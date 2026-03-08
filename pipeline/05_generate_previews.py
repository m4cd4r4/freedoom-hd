"""Generate before/after comparison images for the website."""

import random

from PIL import Image
from tqdm import tqdm

from config import ASSET_TYPES, EXTRACTED_DIR, PREVIEW_COUNT, PREVIEWS_DIR, UPSCALED_DIR


def create_comparison(original_path, upscaled_path, output_prefix):
    """Create before/after comparison images."""
    original = Image.open(original_path)
    upscaled = Image.open(upscaled_path)

    # Scale original to match upscaled size using nearest neighbor (preserves pixel art look)
    original_scaled = original.resize(upscaled.size, Image.NEAREST)

    # Save individual before/after for the interactive slider
    original_scaled.save(f"{output_prefix}-before.webp", "WEBP", quality=90)
    upscaled.save(f"{output_prefix}-after.webp", "WEBP", quality=90)

    # Side-by-side comparison
    gap = 4
    comparison = Image.new(
        "RGBA",
        (upscaled.width * 2 + gap, upscaled.height),
        (0, 0, 0, 255),
    )
    comparison.paste(original_scaled, (0, 0))
    comparison.paste(upscaled, (upscaled.width + gap, 0))
    comparison.save(f"{output_prefix}-compare.webp", "WEBP", quality=90)


def main():
    PREVIEWS_DIR.mkdir(parents=True, exist_ok=True)

    # Collect candidate files (must exist in both extracted and upscaled)
    candidates = []
    for asset_type in ASSET_TYPES:
        extracted_dir = EXTRACTED_DIR / asset_type
        upscaled_dir = UPSCALED_DIR / asset_type
        if not extracted_dir.exists() or not upscaled_dir.exists():
            continue
        for f in sorted(extracted_dir.glob("*.png")):
            upscaled_f = upscaled_dir / f.name
            if upscaled_f.exists():
                candidates.append((asset_type, f, upscaled_f))

    if not candidates:
        print("No matching extracted/upscaled pairs found.")
        return

    # Select a diverse set: pick from each category
    selected = []
    by_type = {}
    for asset_type, orig, upsc in candidates:
        by_type.setdefault(asset_type, []).append((orig, upsc))

    per_type = max(1, PREVIEW_COUNT // len(by_type))
    for asset_type, pairs in by_type.items():
        # Prefer larger images for more impressive comparisons
        pairs.sort(key=lambda p: p[0].stat().st_size, reverse=True)
        # Take top half by size, then random sample
        pool = pairs[: max(len(pairs) // 2, per_type * 2)]
        sample = random.sample(pool, min(per_type, len(pool)))
        selected.extend([(asset_type, o, u) for o, u in sample])

    # Trim to PREVIEW_COUNT
    selected = selected[:PREVIEW_COUNT]

    print(f"Generating {len(selected)} comparison previews...")
    manifest = []

    for asset_type, orig, upsc in tqdm(selected, desc="  Previews"):
        name = orig.stem
        prefix = str(PREVIEWS_DIR / f"{asset_type}-{name}")
        create_comparison(orig, upsc, prefix)
        manifest.append(
            {
                "name": name,
                "type": asset_type,
                "before": f"{asset_type}-{name}-before.webp",
                "after": f"{asset_type}-{name}-after.webp",
                "compare": f"{asset_type}-{name}-compare.webp",
            }
        )

    # Write manifest JSON for the website to consume
    import json
    manifest_path = PREVIEWS_DIR / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2))

    print(f"\nPreviews saved to {PREVIEWS_DIR}")
    print(f"  Manifest: {manifest_path}")


if __name__ == "__main__":
    main()
