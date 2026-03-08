"""4x upscale extracted assets using Real-ESRGAN via spandrel + PyTorch."""

import time
from pathlib import Path

import cv2
import numpy as np
import torch
from spandrel import ImageModelDescriptor, ModelLoader
from tqdm import tqdm

from config import (
    ASSET_TYPES,
    ESRGAN_HALF_PRECISION,
    ESRGAN_MODEL_URL,
    ESRGAN_TILE,
    ESRGAN_WEIGHTS_DIR,
    EXTRACTED_DIR,
    GPU_ID,
    UPSCALE_FACTOR,
    UPSCALED_DIR,
)


def download_model():
    """Download Real-ESRGAN model weights if not present."""
    import requests

    ESRGAN_WEIGHTS_DIR.mkdir(parents=True, exist_ok=True)
    model_path = ESRGAN_WEIGHTS_DIR / ESRGAN_MODEL_URL.split("/")[-1]

    if model_path.exists():
        print(f"Model weights already exist: {model_path.name}")
        return model_path

    print(f"Downloading {model_path.name}...")
    resp = requests.get(ESRGAN_MODEL_URL, stream=True)
    resp.raise_for_status()

    total = int(resp.headers.get("content-length", 0))
    with open(model_path, "wb") as f, tqdm(total=total, unit="B", unit_scale=True) as pbar:
        for chunk in resp.iter_content(8192):
            f.write(chunk)
            pbar.update(len(chunk))

    return model_path


def load_model(model_path):
    """Load the Real-ESRGAN model using spandrel."""
    device = torch.device(f"cuda:{GPU_ID}" if torch.cuda.is_available() else "cpu")
    print(f"Using device: {device}")

    model = ModelLoader().load_from_file(str(model_path))
    assert isinstance(model, ImageModelDescriptor)

    model = model.to(device)
    if ESRGAN_HALF_PRECISION and device.type == "cuda":
        model = model.half()
    model.eval()

    return model, device


def tile_upscale(model, device, img_tensor, tile_size=ESRGAN_TILE, tile_pad=10):
    """Upscale image using tiles to manage VRAM."""
    _, _, h, w = img_tensor.shape
    scale = UPSCALE_FACTOR

    # If small enough, process in one go
    if h <= tile_size and w <= tile_size:
        with torch.no_grad():
            return model(img_tensor)

    output = torch.zeros(
        (1, 3, h * scale, w * scale),
        dtype=img_tensor.dtype,
        device=img_tensor.device,
    )

    tiles_y = (h + tile_size - 1) // tile_size
    tiles_x = (w + tile_size - 1) // tile_size

    for ty in range(tiles_y):
        for tx in range(tiles_x):
            y0 = ty * tile_size
            x0 = tx * tile_size
            y1 = min(y0 + tile_size, h)
            x1 = min(x0 + tile_size, w)

            # Add padding
            y0p = max(y0 - tile_pad, 0)
            x0p = max(x0 - tile_pad, 0)
            y1p = min(y1 + tile_pad, h)
            x1p = min(x1 + tile_pad, w)

            tile_in = img_tensor[:, :, y0p:y1p, x0p:x1p]
            with torch.no_grad():
                tile_out = model(tile_in)

            # Calculate output crop positions
            out_y0 = (y0 - y0p) * scale
            out_x0 = (x0 - x0p) * scale
            out_y1 = out_y0 + (y1 - y0) * scale
            out_x1 = out_x0 + (x1 - x0) * scale

            output[:, :, y0 * scale : y1 * scale, x0 * scale : x1 * scale] = (
                tile_out[:, :, out_y0:out_y1, out_x0:out_x1]
            )

    return output


def upscale_image(model, device, input_path, output_path):
    """Upscale a single image, handling RGBA transparency."""
    img = cv2.imread(str(input_path), cv2.IMREAD_UNCHANGED)
    if img is None:
        raise ValueError(f"Failed to read image: {input_path}")

    has_alpha = img.shape[2] == 4 if len(img.shape) == 3 else False
    alpha = None

    if has_alpha:
        alpha = img[:, :, 3]
        img_rgb = img[:, :, :3]
    elif len(img.shape) == 2:
        img_rgb = cv2.cvtColor(img, cv2.COLOR_GRAY2BGR)
    else:
        img_rgb = img

    # Convert BGR to RGB, normalize to 0-1, to tensor
    img_rgb = cv2.cvtColor(img_rgb, cv2.COLOR_BGR2RGB)
    tensor = torch.from_numpy(img_rgb.astype(np.float32) / 255.0)
    tensor = tensor.permute(2, 0, 1).unsqueeze(0).to(device)

    if ESRGAN_HALF_PRECISION and device.type == "cuda":
        tensor = tensor.half()

    # Upscale RGB
    output = tile_upscale(model, device, tensor)
    output = output.squeeze(0).permute(1, 2, 0).float().cpu().clamp(0, 1).numpy()
    output = (output * 255).astype(np.uint8)
    output = cv2.cvtColor(output, cv2.COLOR_RGB2BGR)

    # Upscale alpha channel separately using bicubic interpolation
    if has_alpha:
        h, w = output.shape[:2]
        alpha_up = cv2.resize(alpha, (w, h), interpolation=cv2.INTER_CUBIC)
        # Sharpen alpha edges to prevent haloing
        _, alpha_up = cv2.threshold(alpha_up, 127, 255, cv2.THRESH_BINARY)
        output = cv2.merge([output[:, :, 0], output[:, :, 1], output[:, :, 2], alpha_up])

    cv2.imwrite(str(output_path), output)


def main():
    model_path = download_model()
    model, device = load_model(model_path)

    total_processed = 0
    total_skipped = 0
    t0 = time.time()

    for asset_type in ASSET_TYPES:
        input_dir = EXTRACTED_DIR / asset_type
        output_dir = UPSCALED_DIR / asset_type
        output_dir.mkdir(parents=True, exist_ok=True)

        if not input_dir.exists():
            print(f"No {asset_type} directory found, skipping.")
            continue

        files = sorted(input_dir.glob("*.png"))
        print(f"\nUpscaling {len(files)} {asset_type}...")

        for f in tqdm(files, desc=f"  {asset_type.capitalize()}"):
            out_path = output_dir / f.name
            if out_path.exists():
                total_skipped += 1
                continue

            try:
                upscale_image(model, device, f, out_path)
                total_processed += 1
            except Exception as e:
                print(f"    Error upscaling {f.name}: {e}")

    elapsed = time.time() - t0
    print(f"\nUpscaling complete:")
    print(f"  Processed: {total_processed}")
    print(f"  Skipped:   {total_skipped}")
    print(f"  Time:      {elapsed:.1f}s ({elapsed/60:.1f}m)")
    if total_processed > 0:
        print(f"  Avg:       {elapsed/total_processed:.2f}s per image")


if __name__ == "__main__":
    main()
