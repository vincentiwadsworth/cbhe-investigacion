import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputDir = path.join(__dirname, '..', 'public', 'images', 'alianzas');

const logos = [
  { input: 'aws-original.png', output: 'aws.webp' },
  { input: 'arpel-original.png', output: 'arpel.webp' },
  { input: 'enginzone-original.png', output: 'enginzone.webp' },
  { input: 'icc-original.svg', output: 'icc.webp' },
];

for (const logo of logos) {
  const inputPath = path.join(inputDir, logo.input);
  const outputPath = path.join(inputDir, logo.output);

  console.log(`Processing ${logo.input}...`);

  // Pipeline: Resize -> Trim whitespace -> WebP
  // trim() removes whitespace based on the top-left pixel color.
  // For logos with white backgrounds, this crops tight to the content.
  await sharp(inputPath)
    .resize(300, null, { fit: 'inside' }) // Scale up slightly for retina
    .trim() // Crop whitespace aggressively
    .webp({ quality: 90 })
    .toFile(outputPath);

  const metadata = await sharp(outputPath).metadata();
  console.log(`  Done: ${metadata.width}x${metadata.height}`);
}

console.log('Logos processed with tight cropping.');
