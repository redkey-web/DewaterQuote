#!/usr/bin/env python3
"""
Background Removal Script using rembg (FREE, no API key needed)

Setup:
    pip install rembg pillow requests

Usage:
    # Process specific image URLs
    python scripts/remove-backgrounds.py --urls "https://example.com/image.png" --process
"""

import os
import sys
import argparse
import requests
from io import BytesIO
from pathlib import Path

try:
    from rembg import remove
    from PIL import Image
except ImportError:
    print("❌ Required packages not installed")
    print("\nInstall with: pip install rembg pillow requests")
    sys.exit(1)

def download_image(url):
    response = requests.get(url)
    response.raise_for_status()
    return Image.open(BytesIO(response.content))

def remove_background(image):
    img_byte_arr = BytesIO()
    image.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()
    output = remove(img_byte_arr)
    return Image.open(BytesIO(output))

def save_image(image, filename, output_dir="output"):
    os.makedirs(output_dir, exist_ok=True)
    base_name = Path(filename).stem
    new_filename = f"{base_name}-no-bg.png"
    output_path = os.path.join(output_dir, new_filename)
    image.save(output_path, "PNG")
    return output_path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--process", action="store_true")
    parser.add_argument("--urls", type=str, required=True)
    parser.add_argument("--output", type=str, default="output")
    args = parser.parse_args()

    urls = [url.strip() for url in args.urls.split(",")]
    print(f"🔍 Processing {len(urls)} image(s)...\n")

    for idx, url in enumerate(urls, 1):
        print(f"{idx}/{len(urls)}: {url}")
        
        if not args.process:
            print("  [DRY RUN]")
            continue

        try:
            print("  ⬇️  Downloading...")
            img = download_image(url)
            print("  🎨 Removing background...")
            processed = remove_background(img)
            filename = url.split('/')[-1]
            output_path = save_image(processed, filename, args.output)
            print(f"  ✅ {output_path}")
        except Exception as e:
            print(f"  ❌ {e}")

    if not args.process:
        print(f"\n💡 Run with --process to actually remove backgrounds")
    else:
        print(f"\n✨ Done! Check {args.output}/ directory")

if __name__ == "__main__":
    main()
