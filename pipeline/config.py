from pathlib import Path

PROJECT_ROOT = Path("I:/Scratch/freedoom-hd")
PIPELINE_DIR = PROJECT_ROOT / "pipeline"
ASSETS_DIR = PROJECT_ROOT / "assets"
WADS_DIR = ASSETS_DIR / "wads"
EXTRACTED_DIR = ASSETS_DIR / "extracted"
UPSCALED_DIR = ASSETS_DIR / "upscaled"
OUTPUT_DIR = PROJECT_ROOT / "output"
PREVIEWS_DIR = OUTPUT_DIR / "previews"

FREEDOOM_VERSION = "0.13.0"
FREEDOOM_URL = f"https://github.com/freedoom/freedoom/releases/download/v{FREEDOOM_VERSION}/freedoom-{FREEDOOM_VERSION}.zip"

UPSCALE_FACTOR = 4
ESRGAN_MODEL_NAME = "RealESRGAN_x4plus_anime_6B"
ESRGAN_MODEL_URL = "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.2.2.4/RealESRGAN_x4plus_anime_6B.pth"
ESRGAN_WEIGHTS_DIR = PROJECT_ROOT / "weights"
ESRGAN_TILE = 256
ESRGAN_HALF_PRECISION = True
GPU_ID = 0

PK3_FILENAME = "freedoom-hd-textures.pk3"
PREVIEW_COUNT = 15

ASSET_TYPES = ["textures", "flats", "sprites"]
