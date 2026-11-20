#!/usr/bin/env python3
"""Render the single-page 3:4 Xiaohongshu PDF + PNG.

Usage:
    cd JX3-AH-Calculator
    python3 -m http.server 8933
    python3 scripts/render-xhs-single.py

The QR block contains the tool URL, but the PDF does not print the URL text.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_URL = "http://127.0.0.1:8933/single.html"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default=DEFAULT_URL, help="single.html URL")
    parser.add_argument("--out", default=str(ROOT / "docs/guide-single"), help="output directory")
    args = parser.parse_args()

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    pdf_path = out_dir / "剑网三物价助手_小红书图文.pdf"
    png_path = out_dir / "剑网三物价助手_小红书图文.png"

    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(
            viewport={"width": 720, "height": 960},
            device_scale_factor=1.5,
            locale="zh-CN",
        )
        page = ctx.new_page()
        page.goto(args.url, wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(500)
        page.locator(".page").screenshot(path=str(png_path))
        page.pdf(
            path=str(pdf_path),
            width="720px",
            height="960px",
            print_background=True,
            margin={"top": "0", "bottom": "0", "left": "0", "right": "0"},
            prefer_css_page_size=False,
        )
        print("png ", png_path)
        print("pdf ", pdf_path)
        browser.close()


if __name__ == "__main__":
    main()
