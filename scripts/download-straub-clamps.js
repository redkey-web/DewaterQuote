const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
  // SCE Clamp (one-piece)
  {
    url: 'https://www.vinidex.com.au/app/uploads/2019/05/CLAMP1_042012-lr-1-e1559192849146-276x300.jpg',
    filename: 'straub-clamp-sce-photo.jpg',
    product: 'Straub Clamp SCE'
  },
  {
    url: 'https://www.vinidex.com.au/app/uploads/2019/05/Page-41-Tech-Man_STRAUB-CLAMP-SCE-44-330mm-300x100.png',
    filename: 'straub-clamp-sce-diagram.png',
    product: 'Straub Clamp SCE'
  },
  // SCZ Clamp (two-piece)
  {
    url: 'https://www.vinidex.com.au/app/uploads/2019/05/CLAMP2_042012-LR-e1559193892646-248x300.jpg',
    filename: 'straub-clamp-scz-photo.jpg',
    product: 'Straub Clamp SCZ'
  },
  {
    url: 'https://www.vinidex.com.au/app/uploads/2019/05/Page-42-Tech-Man_STRAUB-CLAMP-SCZ-88-440mm-e1559194062335-300x100.jpg',
    filename: 'straub-clamp-scz-diagram.jpg',
    product: 'Straub Clamp SCZ'
  }
];

const outputDir = path.join(__dirname, '../public/images/products/straub/clamps');

// Create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadImage(imageInfo) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(outputDir, imageInfo.filename);
    const file = fs.createWriteStream(filepath);

    https.get(imageInfo.url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Follow redirect
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`✓ Downloaded: ${imageInfo.filename} (${imageInfo.product})`);
            resolve(filepath);
          });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${imageInfo.filename} (${imageInfo.product})`);
          resolve(filepath);
        });
      }
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading Straub Clamp images from Vinidex...\n');
  console.log(`Output directory: ${outputDir}\n`);

  for (const image of images) {
    try {
      await downloadImage(image);
    } catch (err) {
      console.error(`✗ Failed to download ${image.filename}:`, err.message);
    }
  }

  console.log('\n✓ Download complete!');
  console.log(`\nImages saved to: ${outputDir}`);
}

main();
