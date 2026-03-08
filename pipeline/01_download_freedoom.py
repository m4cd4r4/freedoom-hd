"""Download Freedoom WADs from GitHub releases."""

import io
import zipfile

import requests
from tqdm import tqdm

from config import FREEDOOM_URL, FREEDOOM_VERSION, WADS_DIR


def main():
    WADS_DIR.mkdir(parents=True, exist_ok=True)

    wad_files = ["freedoom1.wad", "freedoom2.wad"]
    existing = [f for f in wad_files if (WADS_DIR / f).exists()]

    if len(existing) == len(wad_files):
        print(f"Both WADs already exist in {WADS_DIR}, skipping download.")
        return

    print(f"Downloading Freedoom {FREEDOOM_VERSION}...")
    resp = requests.get(FREEDOOM_URL, stream=True)
    resp.raise_for_status()

    total = int(resp.headers.get("content-length", 0))
    buf = io.BytesIO()
    with tqdm(total=total, unit="B", unit_scale=True, desc="Download") as pbar:
        for chunk in resp.iter_content(chunk_size=8192):
            buf.write(chunk)
            pbar.update(len(chunk))

    print("Extracting WADs...")
    buf.seek(0)
    with zipfile.ZipFile(buf) as zf:
        for name in zf.namelist():
            basename = name.split("/")[-1].lower()
            if basename in wad_files:
                data = zf.read(name)
                out_path = WADS_DIR / basename
                out_path.write_bytes(data)
                size_mb = len(data) / (1024 * 1024)
                print(f"  Extracted {basename} ({size_mb:.1f} MB)")

    for f in wad_files:
        if not (WADS_DIR / f).exists():
            raise FileNotFoundError(f"Failed to extract {f}")

    print("Done.")


if __name__ == "__main__":
    main()
