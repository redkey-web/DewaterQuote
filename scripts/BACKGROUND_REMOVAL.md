# Background Removal for Product Images

Remove backgrounds from product images using AI.

## Setup

Install Python dependencies:

```bash
pip install rembg pillow requests
```

**Note:** First run will download an AI model (~180MB) automatically.

## Usage

### 1. Remove backgrounds from specific images

```bash
# Dry run (test without processing)
python scripts/remove-backgrounds.py --urls "https://example.com/image.png"

# Actually process
python scripts/remove-backgrounds.py --urls "https://example.com/image.png" --process

# Multiple images
python scripts/remove-backgrounds.py --urls "url1,url2,url3" --process
```

### 2. Get image URLs from database

To see all product image URLs:

```bash
npx tsx -e "
import { db } from './src/db';
const products = await db.query.products.findMany({ with: { images: true } });
products.forEach(p => {
  p.images.forEach(img => {
    if (img.type === 'image') console.log(\`\${p.name}: \${img.url}\`);
  });
});
process.exit(0);
"
```

### 3. Process images

Example for Bore-Flex products:

```bash
python scripts/remove-backgrounds.py --urls "\
https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/SAREJ/SAREJ_1.png,\
https://9sedkgbytyvyjils.public.blob.vercel-storage.com/products/DAREJ/DAREJ_1.png\
" --process
```

Processed images will be saved to `output/` directory with `-no-bg.png` suffix.

### 4. Upload processed images

After processing, upload the new images and update the database:

```bash
# Dry run (see what will be uploaded)
npx tsx --env-file=.env.local scripts/upload-processed-images.ts

# Actually upload and update database
npx tsx --env-file=.env.local scripts/upload-processed-images.ts --upload
```

The script will:
- Upload all images from `output/` to Vercel Blob
- Update the database with new URLs
- Delete old blob images
- Match images to products automatically

## Complete Workflow

```bash
# 1. Install Python dependencies
pip install rembg pillow requests

# 2. Get image URLs for a category (e.g., Bore-Flex)
npx tsx --env-file=.env.local scripts/get-boreflex-urls.ts

# 3. Process images (removes backgrounds)
python scripts/remove-backgrounds.py --urls "url1,url2,url3" --process

# 4. Check output/ directory
ls output/

# 5. Preview what will be uploaded
npx tsx --env-file=.env.local scripts/upload-processed-images.ts

# 6. Upload and update database
npx tsx --env-file=.env.local scripts/upload-processed-images.ts --upload
```

## Quick Start: Process All Bore-Flex Images

```bash
# Step 1: Get URLs
npx tsx --env-file=.env.local scripts/get-boreflex-urls.ts

# Step 2: Copy the command output and run it
python scripts/remove-backgrounds.py --urls "..." --process

# Step 3: Upload processed images
npx tsx --env-file=.env.local scripts/upload-processed-images.ts --upload
```

## Tips

- **First run is slow** - downloads AI model (~180MB)
- **Processing takes 3-10 seconds per image**
- **Works offline** after initial model download
- **Free** - no API keys needed
- **Best results** with clear product photos on solid backgrounds

## Troubleshooting

### Import Error

```bash
pip install rembg pillow requests
```

### Slow Processing

Normal - AI processing takes time. First run downloads model.

### Poor Results

Works best on:
- Clear product photos
- Solid color backgrounds
- Good lighting
- High contrast between product and background
