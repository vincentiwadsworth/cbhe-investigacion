import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '..', 'public/images/capacitacion');
const OUT = path.join(__dirname, '..', 'public/images/capacitacion');

async function processCarousel() {
  const photos = [
    { src: 'WhatsApp Image 2026-03-16 at 15.09.38.jpeg', dst: 'carousel-1.webp' },
    { src: 'WhatsApp Image 2026-03-16 at 15.11.08.jpeg', dst: 'carousel-2.webp' },
    { src: 'WhatsApp Image 2026-03-16 at 15.16.45.jpeg', dst: 'carousel-3.webp' },
  ];

  for (const { src, dst } of photos) {
    const input = path.join(SRC, src);
    const output = path.join(OUT, dst);
    await sharp(input)
      .resize(800, 500, { fit: 'cover', position: 'attention' })
      .webp({ quality: 85 })
      .toFile(output);
    console.log(`✓ ${dst}`);
  }
}

async function splitLogos() {
  const input = path.join(SRC, 'logo_NFPA-UL-FM.jpg');
  const { width, height } = await sharp(input).metadata();
  const sliceWidth = Math.floor(width / 3);

  const names = ['nfpa', 'ul', 'fm'];
  for (let i = 0; i < 3; i++) {
    const output = path.join(OUT, `logo-${names[i]}.webp`);
    await sharp(input)
      .extract({ left: i * sliceWidth, top: 0, width: sliceWidth, height })
      .webp({ quality: 90 })
      .toFile(output);
    console.log(`✓ logo-${names[i]}.webp (${sliceWidth}x${height})`);
  }
}

await processCarousel();
await splitLogos();
console.log('Done!');
