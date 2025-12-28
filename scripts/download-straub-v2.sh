#!/bin/bash
# Download all Straub product images with correct URLs

OUTPUT_DIR="./public/images/products/straub"
USER_AGENT="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"

mkdir -p "$OUTPUT_DIR"
cd "$OUTPUT_DIR"

echo "Downloading Straub product images..."

# Array of image URLs and filenames
declare -A IMAGES=(
  # Axial Restraint Couplings
  ["straub-metal-grip.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/e/c/csm_metal-grip_2bfc5deea4.png"
  ["straub-metal-grip-ff.png"]="https://www.straub.ch/fileadmin/_processed_/8/e/csm_metal-grip-ff_3b3b00a877.png"
  ["straub-grip.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/e/f/csm_GR_3D_114.3_d58e3ff4fa.png"
  ["straub-grip-ff.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/5/6/csm_GR-FF_3D_76.1_4bfe12a7c7.png"
  ["straub-plast-grip.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/4/f/csm_plast-grip_4b78a1f72c.png"
  ["straub-combi-grip.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/e/5/csm_combi-grip_31dd380243.png"
  ["straub-plast-pro.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/7/f/csm_plast-pro_b89a3df64f.png"

  # Non-Axial Restraint (Flex) Couplings
  ["straub-flex-1.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/f/5/csm_flex-1l_205c3e2f22.png"
  ["straub-flex-2.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/c/b/csm_flex-2_a46ae8fc74.png"
  ["straub-flex-3.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/a/c/csm_flex-3_5e3d14088e.png"
  ["straub-flex-35.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/8/1/csm_flex-3-5_493a6a00c6.png"
  ["straub-flex-4.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/1/4/csm_flex-4_8beaf7514c.png"
  ["straub-open-flex-1.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/3/8/csm_open-flex-1l_bde93981c5.png"
  ["straub-open-flex-2.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/7/d/csm_open-flex-2_96ebcfc861.png"
  ["straub-open-flex-3.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/7/5/csm_open-flex-3_0f99650977.png"
  ["straub-open-flex-35.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/c/0/csm_open-flex-3-5_1d05035d55.png"
  ["straub-open-flex-4.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/8/a/csm_open-flex-4_e79799b09c.png"
  ["straub-step-flex-2.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/6/6/csm_step-flex-2_4a50565efb.png"
  ["straub-step-flex-3.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/4/8/csm_step-flex-3_e85dbf865b.png"
  ["straub-square-flex.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/5/e/csm_square-flex_192031173e.png"
  ["straub-rep-flex.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/5/9/csm_rep-flex_12f49b88c2.png"
  ["straub-clamp-1pc.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/8/0/csm_clamp-one_2fd2e95d95.png"
  ["straub-clamp-2pc.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/a/6/csm_clamp-two_b21059c138.png"

  # Shaped Parts
  ["straub-elbow-90.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/4/e/csm_STRAUB-Formteil_B90_b8bff979ae.png"
  ["straub-elbow-45.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/1/3/csm_STRAUB-Formteil_B45_30272bf505.png"
  ["straub-equal-tee.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/2/8/csm_STRAUB-Formteil_T90_c5251970a6.png"
  ["straub-reducing-tee.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/2/f/csm_STRAUB-Formteil_T-reduziert_1facbe8f8d.png"
  ["straub-reducer.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/f/a/csm_STRAUB-Formteil_Reduktion_25ff361efc.png"
  ["straub-flange-adapter.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/8/3/csm_STRAUB-Formteil_Flanschadapter_6bef6d40ef.png"
  ["straub-end-cap.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/a/c/csm_STRAUB-Formteil_Endkappe_bfc5d4ce43.png"
  ["straub-threaded.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/0/6/csm_STRAUB-Formteil_Gewindeanschluss_b3ba25f778.png"

  # Installation/Application images
  ["straub-metal-grip-install.jpg"]="https://www.straub.ch/fileadmin/Straub/_processed_/e/d/csm_04_metal_grip_1224349076.jpg"
  ["straub-metal-grip-diagram.png"]="https://www.straub.ch/fileadmin/Straub/_processed_/e/c/csm_metal-grip_6211767325.png"
)

for filename in "${!IMAGES[@]}"; do
  url="${IMAGES[$filename]}"
  if [ -f "$filename" ] && [ $(stat -f%z "$filename") -gt 2000 ]; then
    echo "  Exists: $filename"
  else
    curl -L -s -H "User-Agent: $USER_AGENT" -o "$filename" "$url"
    if [ -s "$filename" ] && [ $(stat -f%z "$filename") -gt 2000 ]; then
      size=$(stat -f%z "$filename")
      echo "  Downloaded: $filename (${size} bytes)"
    else
      rm -f "$filename"
      echo "  Failed: $filename"
    fi
  fi
done

echo ""
echo "Download complete!"
echo ""
ls -la | grep -v "^total" | head -40
