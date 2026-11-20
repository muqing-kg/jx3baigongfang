#!/usr/bin/env python3
"""Render the 4:3 onboarding guide (docs/guide/guide.html) to PDF + page PNGs.

Usage:
    cd JX3-AH-Calculator
    python3 -m http.server 8931
    python3 scripts/render-xhs-guide.py

Optional:
    python3 scripts/render-xhs-guide.py --url http://127.0.0.1:8931/docs/guide/guide.html

Requires Playwright for Python with Chromium installed:
    python3 -m pip install playwright
    python3 -m playwright install chromium
"""

from __future__ import annotations

import argparse
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
PAGE_NAMES = [
    "01-cover",
    "02-access",
    "03-quick-start",
    "04-modules",
    "05-operations",
    "06-reading",
    "07-mobile",
    "08-trust",
]
DEFAULT_URL = "http://127.0.0.1:8931/docs/guide/guide.html"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default=DEFAULT_URL, help="guide.html URL")
    parser.add_argument("--out", default=str(ROOT / "docs/guide"), help="output directory")
    args = parser.parse_args()

    out_dir = Path(args.out)
    pages_dir = out_dir / "pages"
    pages_dir.mkdir(parents=True, exist_ok=True)
    pdf_path = out_dir / "剑网三物价助手-上手指南-合规版.pdf"

    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(
            viewport={"width": 1600, "height": 1200},
            device_scale_factor=1,
            locale="zh-CN",
        )
        page = ctx.new_page()
        page.goto(args.url, wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        page.wait_for_timeout(600)

        sections = page.locator(".page")
        count = sections.count()
        if count != len(PAGE_NAMES):
            raise SystemExit(f"expected {len(PAGE_NAMES)} pages, found {count}")

        for i, name in enumerate(PAGE_NAMES):
            img_path = pages_dir / f"{name}.png"
            sections.nth(i).screenshot(path=str(img_path))
            print("page", img_path)

        page.pdf(
            path=str(pdf_path),
            width="1600px",
            height="1200px",
            print_background=True,
            margin={"top": "0", "bottom": "0", "left": "0", "right": "0"},
            prefer_css_page_size=False,
        )
        print("pdf ", pdf_path)
        browser.close()


if __name__ == "__main__":
    main()
