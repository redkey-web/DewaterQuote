#!/bin/bash

# Download product images from Neto (dewaterproducts.com.au)
# Run this before migrating away from Neto to preserve all product images

BASE_URL="https://www.dewaterproducts.com.au/assets"
OUTPUT_DIR="/Users/redkey/Documents/NEXUS/RED-KEY/websites/DewaterQuote/public/images/products/neto-download"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# List of all product SKUs
SKUS=(
  "BFLYW316"
  "BV-316-FF"
  "CF8MDAFV"
  "DB-1"
  "FSFREJ"
  "FVGALV"
  "GV-DI-RS"
  "OCERC"
  "OCFG-L"
  "OCFG-S"
  "OCFPC"
  "OCML-L"
  "OCML-S"
  "OCOF300-L"
  "OCOF400-L"
  "OCRC200"
  "OCRC300"
  "OCRC55"
  "REJ-EPDM"
  "SBSANSI"
  "SSFA"
  "SSYS"
  "YSTR-CI"
  # Additional SKUs with hyphen variants
  "OCOF300L"
  "OCOF400L"
  "OCELBRC"
  "OCFGO-L"
  "OCFGO-S"
  "OCFG2-L"
  "OCFG2-S"
  "OCRC100wide"
  "OCRC400"
)

echo "Downloading product images from Neto..."
echo "Output directory: $OUTPUT_DIR"
echo ""

for SKU in "${SKUS[@]}"; do
  echo "Processing $SKU..."

  # Download main/full image (try both .jpg and .png)
  wget -q --show-progress -nc -P "$OUTPUT_DIR" "$BASE_URL/full/$SKU.jpg" 2>/dev/null || \
  wget -q --show-progress -nc -P "$OUTPUT_DIR" "$BASE_URL/full/$SKU.png" 2>/dev/null

  # Download thumbnail
  wget -q --show-progress -nc -P "$OUTPUT_DIR" "$BASE_URL/thumb/$SKU.jpg" 2>/dev/null || \
  wget -q --show-progress -nc -P "$OUTPUT_DIR" "$BASE_URL/thumb/$SKU.png" 2>/dev/null

  # Download alternate images (alt_1 through alt_4)
  for ALT in 1 2 3 4; do
    wget -q --show-progress -nc -P "$OUTPUT_DIR" "$BASE_URL/alt_$ALT/$SKU.jpg" 2>/dev/null || \
    wget -q --show-progress -nc -P "$OUTPUT_DIR" "$BASE_URL/alt_$ALT/$SKU.png" 2>/dev/null
  done
done

echo ""
echo "Download complete!"
echo "Images saved to: $OUTPUT_DIR"
echo ""
echo "Downloaded files:"
ls -la "$OUTPUT_DIR"
