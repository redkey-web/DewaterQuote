import { put } from '@vercel/blob';
import * as fs from 'fs';
import * as path from 'path';

// Load env from .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
});

async function main() {
  const vinidexDir = path.join(__dirname, '../public/images/products/straub/vinidex');

  // Get list of image files
  const imageFiles = fs.readdirSync(vinidexDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  console.log(`Uploading ${imageFiles.length} Straub images to Vercel Blob...\n`);

  const uploadedUrls: Record<string, string> = {};

  for (const imageFile of imageFiles) {
    const filePath = path.join(vinidexDir, imageFile);
    const fileBuffer = fs.readFileSync(filePath);

    console.log(`Uploading ${imageFile}...`);
    const blob = await put(`products/straub/${imageFile}`, fileBuffer, {
      access: 'public',
      contentType: imageFile.endsWith('.png') ? 'image/png' : 'image/jpeg',
    });
    console.log(`  ✓ ${blob.url}`);
    uploadedUrls[imageFile] = blob.url;
  }

  console.log('\n✓ All images uploaded!\n');
  console.log('Blob URLs:');
  console.log(JSON.stringify(uploadedUrls, null, 2));
}

main().catch(console.error);
