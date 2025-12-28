#!/usr/bin/env python3
"""
Remove backgrounds from product images using rembg.
Creates transparent PNG versions alongside originals.
"""

import os
import sys
from pathlib import Path

# Add user's Python bin to path for rembg
sys.path.insert(0, '/Users/redkey/Library/Python/3.9/lib/python/site-packages')

from rembg import remove
from PIL import Image

INPUT_DIR = Path('./public/images/products/optimized')
OUTPUT_DIR = Path('./public/images/products/nobg')

def process_image(input_path: Path, output_path: Path) -> bool:
    """Remove background from a single image."""
    try:
        with Image.open(input_path) as img:
            # Convert to RGBA if needed
            if img.mode != 'RGBA':
                img = img.convert('RGBA')

            # Remove background
            output = remove(img)

            # Save as PNG with transparency
            output.save(output_path, 'PNG')
            return True
    except Exception as e:
        print(f"  Error: {e}")
        return False

def main():
    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Get all main product images (not alt images)
    image_files = sorted([
        f for f in INPUT_DIR.glob('*.jpg')
        if '_alt' not in f.stem  # Only main images
    ])

    print(f"\nRemoving backgrounds from {len(image_files)} main product images...")
    print(f"Output directory: {OUTPUT_DIR}\n")

    success = 0
    failed = 0

    for img_path in image_files:
        output_name = f"{img_path.stem}_nobg.png"
        output_path = OUTPUT_DIR / output_name

        if output_path.exists():
            print(f"  Skip {img_path.name} (already exists)")
            success += 1
            continue

        print(f"  Processing {img_path.name}...", end=' ', flush=True)

        if process_image(img_path, output_path):
            size_kb = output_path.stat().st_size / 1024
            print(f"OK ({size_kb:.0f}KB)")
            success += 1
        else:
            failed += 1

    print(f"\n{'='*50}")
    print(f"Complete! Processed: {success}, Failed: {failed}")
    print(f"Output: {OUTPUT_DIR}")

if __name__ == '__main__':
    main()
