"""Run the full FreeDoom HD pipeline: download → extract → upscale → package → preview."""

import importlib
import sys
import time


STEPS = [
    ("Download Freedoom", "01_download_freedoom"),
    ("Extract Assets", "02_extract_assets"),
    ("Upscale (4x Real-ESRGAN)", "03_upscale_assets"),
    ("Package PK3", "04_package_pk3"),
    ("Generate Previews", "05_generate_previews"),
]


def main():
    t_total = time.time()

    for i, (label, module_name) in enumerate(STEPS, 1):
        print(f"\n{'=' * 60}")
        print(f"  Step {i}/{len(STEPS)}: {label}")
        print(f"{'=' * 60}")

        t_step = time.time()
        try:
            mod = importlib.import_module(module_name)
            mod.main()
        except Exception as e:
            print(f"\n  FAILED: {e}")
            sys.exit(1)

        print(f"\n  Completed in {time.time() - t_step:.1f}s")

    elapsed = time.time() - t_total
    print(f"\n{'=' * 60}")
    print(f"  All steps complete! Total time: {elapsed:.1f}s ({elapsed/60:.1f}m)")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
