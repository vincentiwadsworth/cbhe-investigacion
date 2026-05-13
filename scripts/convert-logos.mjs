import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(__dirname, '..', 'public', 'images', 'empresas');

// PNG files that should be WebP (raster logos)
const TO_CONVERT = [
  { src: 'canacol-energy.png', dest: 'canacol-energy.webp' },
  { src: 'oxy.svg', dest: 'oxy.webp' },           // actually a PNG
  { src: 'totalenergies.svg', dest: 'totalenergies.webp' }, // actually a PNG
];

for (const { src, dest } of TO_CONVERT) {
  const srcPath = path.join(DIR, src);
  const destPath = path.join(DIR, dest);
  
  if (!fs.existsSync(srcPath)) {
    console.log(`⚠️  ${src} not found, skipping`);
    continue;
  }
  
  try {
    await sharp(srcPath)
      .resize(400, undefined, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 90 })
      .toFile(destPath);
    
    const origSize = fs.statSync(srcPath).size;
    const newSize = fs.statSync(destPath).size;
    console.log(`✅ ${src} → ${dest} (${(origSize/1024).toFixed(1)}KB → ${(newSize/1024).toFixed(1)}KB)`);
    
    // Delete original PNG
    fs.unlinkSync(srcPath);
  } catch (err) {
    console.error(`❌ ${src}: ${err.message}`);
  }
}

console.log('\nDone. Final files:');
for (const f of fs.readdirSync(DIR)) {
  const size = fs.statSync(path.join(DIR, f)).size;
  console.log(`  ${f} — ${(size/1024).toFixed(1)}KB`);
}
