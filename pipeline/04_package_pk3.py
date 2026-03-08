"""Package upscaled assets into a GZDoom-compatible PK3 file."""

import zipfile

from tqdm import tqdm

from config import ASSET_TYPES, OUTPUT_DIR, PK3_FILENAME, UPSCALED_DIR

GAMEINFO = """\
; FreeDoom HD - AI-Upscaled Texture Pack
; 4x upscaled using Real-ESRGAN
; Based on Freedoom (BSD licensed)
; https://freedoom.github.io/
"""


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    pk3_path = OUTPUT_DIR / PK3_FILENAME

    all_files = []
    for asset_type in ASSET_TYPES:
        asset_dir = UPSCALED_DIR / asset_type
        if asset_dir.exists():
            all_files.extend(sorted(asset_dir.glob("*.png")))

    if not all_files:
        print("No upscaled assets found. Run 03_upscale_assets.py first.")
        return

    print(f"Packaging {len(all_files)} assets into {pk3_path.name}...")

    with zipfile.ZipFile(pk3_path, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as pk3:
        pk3.writestr("GAMEINFO.txt", GAMEINFO)

        for f in tqdm(all_files, desc="  Packing"):
            arcname = f"hires/{f.name}"
            pk3.write(f, arcname)

    size_mb = pk3_path.stat().st_size / (1024 * 1024)
    print(f"\nPK3 created: {pk3_path}")
    print(f"  Size:   {size_mb:.1f} MB")
    print(f"  Assets: {len(all_files)}")


if __name__ == "__main__":
    main()
