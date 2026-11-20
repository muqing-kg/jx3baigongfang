"""把 shell/logo/source.png 生成各尺寸图标。换 logo 时覆盖 source.png 后重跑。

用法: python scripts/make-logo.py
输出: shell/logo/ 下各尺寸 PNG，供 homeland / price / 入口页统一引用。
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
LOGO = ROOT / "shell" / "logo"
SRC = LOGO / "source.png"
SIZES = {"logo-1024.png": 1024, "logo-512.png": 512, "logo-192.png": 192,
         "logo-180.png": 180, "logo-64.png": 64, "logo-32.png": 32}


def trimmed(im: Image.Image) -> Image.Image:
    box = im.getchannel("A").getbbox()
    return im.crop(box) if box else im


def squared(im: Image.Image) -> Image.Image:
    side = max(im.size)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(im, ((side - im.width) // 2, (side - im.height) // 2), im)
    return canvas


def main() -> None:
    src = squared(trimmed(Image.open(SRC).convert("RGBA")))
    for name, size in SIZES.items():
        src.resize((size, size), Image.LANCZOS).save(LOGO / name, optimize=True)
    src.resize((64, 64), Image.LANCZOS).save(
        LOGO / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)]
    )
    print("logo ok:", ", ".join(SIZES), "+ favicon.ico")


if __name__ == "__main__":
    main()
