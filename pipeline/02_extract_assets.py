"""Extract textures, flats, and sprites from Freedoom WADs as PNGs."""

from PIL import Image
from omg import WAD, txdef as txdef_mod
from tqdm import tqdm

from config import EXTRACTED_DIR, WADS_DIR


def sanitize_filename(name):
    """Replace characters that are invalid in Windows filenames."""
    return name.replace("\\", "^").replace("/", "^")


def extract_flats(wad, output_dir, seen):
    """Extract floor/ceiling textures (64x64 raw pixel data)."""
    output_dir.mkdir(parents=True, exist_ok=True)
    count = 0
    for name, flat in tqdm(wad.flats.items(), desc="  Flats", leave=False):
        if name in seen:
            continue
        seen.add(name)
        try:
            img = flat.to_Image()
            safe_name = sanitize_filename(name)
            img.save(output_dir / f"{safe_name}.png")
            count += 1
        except Exception as e:
            print(f"    Warning: failed to extract flat {name}: {e}")
    return count


def extract_sprites(wad, output_dir, seen):
    """Extract enemy/item/weapon sprites with transparency."""
    output_dir.mkdir(parents=True, exist_ok=True)
    count = 0
    for name, sprite in tqdm(wad.sprites.items(), desc="  Sprites", leave=False):
        if name in seen:
            continue
        seen.add(name)
        try:
            img = sprite.to_Image()
            if img.mode != "RGBA":
                img = img.convert("RGBA")
            safe_name = sanitize_filename(name)
            img.save(output_dir / f"{safe_name}.png")
            count += 1
        except Exception as e:
            print(f"    Warning: failed to extract sprite {name}: {e}")
    return count


def extract_textures(wad, output_dir, seen):
    """Extract wall textures by compositing patches according to TEXTURE definitions."""
    output_dir.mkdir(parents=True, exist_ok=True)
    count = 0

    # Parse TEXTURE1/TEXTURE2 lumps with PNAMES
    all_texdefs = {}
    pnames_lump = wad.txdefs.get("PNAMES")
    if not pnames_lump:
        print("    No PNAMES lump found, skipping textures.")
        return 0

    for lump_name in ["TEXTURE1", "TEXTURE2"]:
        if lump_name in wad.txdefs:
            parsed = txdef_mod.Textures(wad.txdefs[lump_name], pnames_lump)
            all_texdefs.update(parsed)

    if not all_texdefs:
        print("    No texture definitions found.")
        return 0

    for name, tex in tqdm(all_texdefs.items(), desc="  Textures", leave=False):
        if name in seen:
            continue
        seen.add(name)
        try:
            canvas = Image.new("RGBA", (tex.width, tex.height), (0, 0, 0, 0))
            for patch_ref in tex.patches:
                patch_name = patch_ref.name
                if patch_name in wad.patches:
                    try:
                        patch_img = wad.patches[patch_name].to_Image()
                        if patch_img.mode != "RGBA":
                            patch_img = patch_img.convert("RGBA")
                        canvas.paste(
                            patch_img, (patch_ref.x, patch_ref.y), patch_img
                        )
                    except Exception:
                        pass
            safe_name = sanitize_filename(name)
            canvas.save(output_dir / f"{safe_name}.png")
            count += 1
        except Exception as e:
            print(f"    Warning: failed to extract texture {name}: {e}")
    return count


def main():
    seen_flats = set()
    seen_sprites = set()
    seen_textures = set()
    total = {"flats": 0, "sprites": 0, "textures": 0}

    for wad_name in ["freedoom2.wad", "freedoom1.wad"]:
        wad_path = WADS_DIR / wad_name
        if not wad_path.exists():
            print(f"  {wad_name} not found, skipping.")
            continue

        print(f"\nProcessing {wad_name}...")
        wad = WAD(str(wad_path))

        total["flats"] += extract_flats(
            wad, EXTRACTED_DIR / "flats", seen_flats
        )
        total["sprites"] += extract_sprites(
            wad, EXTRACTED_DIR / "sprites", seen_sprites
        )
        total["textures"] += extract_textures(
            wad, EXTRACTED_DIR / "textures", seen_textures
        )

    print(f"\nExtraction complete:")
    print(f"  Flats:    {total['flats']}")
    print(f"  Sprites:  {total['sprites']}")
    print(f"  Textures: {total['textures']}")
    print(f"  Total:    {sum(total.values())}")


if __name__ == "__main__":
    main()
