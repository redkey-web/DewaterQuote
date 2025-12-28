#!/bin/bash
# Download Straub product images

BASE_URL="https://www.straub.ch"
OUTPUT_DIR="./public/images/products/straub"
USER_AGENT="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"

mkdir -p "$OUTPUT_DIR"

echo "Downloading Straub product images..."

# Function to download image
download() {
  local url="$1"
  local filename="$2"
  if [ ! -f "$OUTPUT_DIR/$filename" ]; then
    curl -L -s -H "User-Agent: $USER_AGENT" -o "$OUTPUT_DIR/$filename" "$BASE_URL$url"
    if [ -s "$OUTPUT_DIR/$filename" ]; then
      echo "  Downloaded: $filename"
    else
      rm -f "$OUTPUT_DIR/$filename"
      echo "  Failed: $filename"
    fi
  else
    echo "  Exists: $filename"
  fi
}

# Axial Restraint Couplings
echo ""
echo "=== Axial Restraint Couplings ==="
download "/fileadmin/Straub/_processed_/e/c/csm_metal-grip_2bfc5deea4.png" "straub-metal-grip.png"
download "/fileadmin/Straub/_processed_/0/2/csm_metal-grip-ff_fda05e0db6.png" "straub-metal-grip-ff.png"
download "/fileadmin/Straub/_processed_/e/f/csm_GR_3D_114.3_d58e3ff4fa.png" "straub-grip.png"
download "/fileadmin/Straub/_processed_/5/6/csm_GR-FF_3D_76.1_4bfe12a7c7.png" "straub-grip-ff.png"
download "/fileadmin/Straub/_processed_/4/f/csm_plast-grip_4b78a1f72c.png" "straub-plast-grip.png"
download "/fileadmin/Straub/_processed_/4/8/csm_combi-grip_e0c29ccc91.png" "straub-combi-grip.png"
download "/fileadmin/Straub/_processed_/4/3/csm_plast-pro_09e3ec5df6.png" "straub-plast-pro.png"

# Non-Axial Restraint (Flex) Couplings
echo ""
echo "=== Non-Axial Restraint Couplings ==="
download "/fileadmin/Straub/_processed_/f/5/csm_flex-1l_205c3e2f22.png" "straub-flex-1.png"
download "/fileadmin/Straub/_processed_/d/5/csm_flex-2_2ac6da57ec.png" "straub-flex-2.png"
download "/fileadmin/Straub/_processed_/0/7/csm_flex-3_67f9a9f4bd.png" "straub-flex-3.png"
download "/fileadmin/Straub/_processed_/9/4/csm_flex-35_7dbfdf9ae7.png" "straub-flex-35.png"
download "/fileadmin/Straub/_processed_/1/2/csm_flex-4_e4f6e88fb7.png" "straub-flex-4.png"
download "/fileadmin/Straub/_processed_/2/0/csm_open-flex-1l_f5f5eb04e5.png" "straub-open-flex-1.png"
download "/fileadmin/Straub/_processed_/2/4/csm_open-flex-2_1b2612be84.png" "straub-open-flex-2.png"
download "/fileadmin/Straub/_processed_/b/1/csm_open-flex-3_0c79f46cf9.png" "straub-open-flex-3.png"
download "/fileadmin/Straub/_processed_/c/0/csm_open-flex-35_5f63df1b7f.png" "straub-open-flex-35.png"
download "/fileadmin/Straub/_processed_/2/5/csm_open-flex-4_fa6be02cc7.png" "straub-open-flex-4.png"
download "/fileadmin/Straub/_processed_/c/9/csm_step-flex-2_3b09b36c6d.png" "straub-step-flex-2.png"
download "/fileadmin/Straub/_processed_/2/d/csm_step-flex-3_5b1dfd9eac.png" "straub-step-flex-3.png"
download "/fileadmin/Straub/_processed_/c/a/csm_square-flex_8c0e56ba53.png" "straub-square-flex.png"
download "/fileadmin/Straub/_processed_/2/b/csm_rep-flex_6ad9d99bc7.png" "straub-rep-flex.png"
download "/fileadmin/Straub/_processed_/5/6/csm_clamp_d0a79d49d0.png" "straub-clamp.png"

# Shaped Parts
echo ""
echo "=== Shaped Parts ==="
download "/fileadmin/Straub/_processed_/4/e/csm_STRAUB-Formteil_B90_b8bff979ae.png" "straub-elbow-90.png"
download "/fileadmin/Straub/_processed_/0/2/csm_STRAUB-Formteil_B45_16b53cd72a.png" "straub-elbow-45.png"
download "/fileadmin/Straub/_processed_/d/9/csm_STRAUB-Formteil_T_a0c4db9ca2.png" "straub-equal-tee.png"
download "/fileadmin/Straub/_processed_/8/3/csm_STRAUB-Formteil_TR_e06edebb3a.png" "straub-reducing-tee.png"
download "/fileadmin/Straub/_processed_/7/0/csm_STRAUB-Formteil_R_0cab96f7ba.png" "straub-reducer.png"
download "/fileadmin/Straub/_processed_/f/a/csm_STRAUB-Formteil_FA_4c2eb8f5c9.png" "straub-flange-adapter.png"
download "/fileadmin/Straub/_processed_/6/2/csm_STRAUB-Formteil_EC_1ac91a2fb6.png" "straub-end-cap.png"
download "/fileadmin/Straub/_processed_/1/c/csm_STRAUB-Formteil_AG_fe7a61d09a.png" "straub-threaded.png"

echo ""
echo "Download complete!"
ls -la "$OUTPUT_DIR" | head -40
