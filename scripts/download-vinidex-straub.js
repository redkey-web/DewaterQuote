const https = require('https');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../public/images/products/straub/vinidex');

// Full-size Vinidex Straub images (removed WordPress size suffixes for full resolution)
const images = [
  // Metal Grip
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/MG_042012-e1559188232105.jpg', name: 'metal-grip-photo.jpg' },
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/Page-8-Tech-Man_STRAUB-Metal-Grip-30-29mm-e1557898278976.jpg', name: 'metal-grip-diagram.jpg' },

  // Grip L (small sizes)
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/76015-GripL-e1559188308834.jpg', name: 'grip-l-photo.jpg' },
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/Page-12-Tech-Man_STRAUB-Grip-L26-219mm-e1557900381975.jpg', name: 'grip-l-diagram.jpg' },

  // Grip L (large sizes)
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/Page-13-Tech-Man_STRAUB-Grip-L-18-609mm.jpg', name: 'grip-l-large-diagram.jpg' },

  // Combi Grip
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/76031-Straub-Combi-Grip-e1559188981933.jpg', name: 'combi-grip-photo.jpg' },
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/Page-22-Tech-Man_STRAUB-combi-grip-only.jpg', name: 'combi-grip-diagram.jpg' },

  // Plastic Grip
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/PLASTGRIP_042012-e1559189262999.jpg', name: 'plastic-grip-photo.jpg' },

  // Flex 1L
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/76172-FLEX_042012-e1559189387306.jpg', name: 'flex-photo.jpg' },
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/Page-26-Tech-Man_STRAUB-FLEX-1L-48.3-168.3mm-1.jpg', name: 'flex-1l-diagram.jpg' },

  // Flex 2
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/Page-27-Tech-Man_STRAUB-FLEX-2L-172-2023mm.jpg', name: 'flex-2-diagram.jpg' },

  // Open Flex 1L
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/76399-Open-Flex-L1-e1559189568790.jpg', name: 'open-flex-photo.jpg' },
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/Page-30-Tech-Man_STRAUB-OPEN-FLEX-1L-48.3-168.3mm-e1557906062198.jpg', name: 'open-flex-1l-diagram.jpg' },

  // Open Flex 2
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/Page-31-Tech-Man_STRAUB-OPEN-FLEX-2-172-2032mm.jpg', name: 'open-flex-2-diagram.jpg' },

  // Clamp SCE (one-piece)
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/CLAMP1_042012-lr-1-e1559192849146.jpg', name: 'clamp-one-piece-photo.jpg' },
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/Page-41-Tech-Man_STRAUB-CLAMP-SCE-44-330mm.png', name: 'clamp-one-piece-diagram.png' },

  // Clamp SCZ (two-piece)
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/CLAMP2_042012-LR-e1559193892646.jpg', name: 'clamp-two-piece-photo.jpg' },
  { url: 'https://www.vinidex.com.au/app/uploads/2019/05/Page-42-Tech-Man_STRAUB-CLAMP-SCZ-88-440mm-e1559194062335.jpg', name: 'clamp-two-piece-diagram.jpg' },
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('Creating output directory:', outputDir);
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`\nDownloading ${images.length} Straub images from Vinidex...\n`);

  for (const img of images) {
    const dest = path.join(outputDir, img.name);
    try {
      await downloadFile(img.url, dest);
      const stats = fs.statSync(dest);
      console.log(`✓ ${img.name} (${Math.round(stats.size / 1024)} KB)`);
    } catch (err) {
      console.log(`✗ ${img.name} - ${err.message}`);
    }
  }

  console.log('\nDone! Images saved to:', outputDir);
}

main().catch(console.error);
