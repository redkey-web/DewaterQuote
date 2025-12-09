const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const downloads = [
  { url: 'https://www.dewaterproducts.com.au/assets/thumb/FVGALV.jpg', dest: 'public/images/products/valves/foot-valve-galv.jpg' }
];

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        file.close();
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(dest);
        resolve({ dest, size: stats.size });
      });
    }).on('error', (err) => {
      file.close();
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading product images...\n');

  for (const d of downloads) {
    try {
      const result = await downloadFile(d.url, d.dest);
      console.log(`✓ ${result.dest} (${result.size} bytes)`);
    } catch (err) {
      console.log(`✗ ${d.dest}: ${err.message}`);
    }
  }

  console.log('\nDone!');
}

main();
