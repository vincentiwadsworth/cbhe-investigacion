import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'public', 'images', 'empresas');

// SVG logos from Wikimedia Commons (Special:FilePath = direct raw file)
const LOGOS = [
  {
    slug: 'gazprom',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Gazprom_logo.svg',
    note: 'GP Exploración y Producción (Gazprom International)',
  },
  {
    slug: 'pan-american-energy',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pan_American_Energy_logo.svg',
    note: 'PAE (Pan American Energy)',
  },
  {
    slug: 'petrobras',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Petrobras_horizontal_logo.svg',
    note: 'Petrobras',
  },
  {
    slug: 'repsol',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Repsol_2025.svg',
    note: 'Repsol (logo 2025)',
  },
  {
    slug: 'shell',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Shell_wordmark_2019.svg',
    note: 'Shell (wordmark 2019)',
  },
  {
    slug: 'totalenergies',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/TotalEnergies_wordmark_(2021-present).svg',
    note: 'TotalEnergies',
  },
  {
    slug: 'oxy',
    url: 'https://commons.wikimedia.org/wiki/Special:FilePath/Occidental-Petroleum-Logo.svg',
    note: 'Vintage Petroleum (Occidental / Oxy)',
  },
  {
    slug: 'tecpetrol',
    url: null, // raster — handled separately below
    note: 'Tecpetrol (JPG from press room — needs Sharp WebP conversion)',
  },
  {
    slug: 'canacol-energy',
    url: null, // companieslogo.com — needs direct CDN URL
    note: 'Canacol Energy',
  },
  {
    slug: 'ypf',
    url: null, // companieslogo.com — needs direct CDN URL
    note: 'YPF',
  },
];

// ─── Download SVGs ───────────────────────────────────────────────
for (const logo of LOGOS.filter((l) => l.url)) {
  const dest = path.join(OUT, `${logo.slug}.svg`);
  try {
    const res = await fetch(logo.url, { redirect: 'follow' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`✅ ${logo.slug}.svg — ${(buf.length / 1024).toFixed(1)} KB — ${logo.note}`);
  } catch (err) {
    console.error(`❌ ${logo.slug}.svg — ${err.message}`);
  }
}

// ─── Raster: Tecpetrol from official press room ──────────────────
try {
  const TEC_URL = 'https://www.tecpetrol.com/sites/default/files/2021-09/Logo-Tecpetrol-JPG-Color_0.jpg';
  const res = await fetch(TEC_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  // Convert JPG → WebP con Sharp (ya instalado como dep de Astro)
  const sharp = (await import('sharp')).default;
  await sharp(buf)
    .resize(400, undefined, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(path.join(OUT, 'tecpetrol.webp'));
  console.log(`✅ tecpetrol.webp — ${(buf.length / 1024).toFixed(1)} KB JPG origen — Tecpetrol`);
} catch (err) {
  console.error(`❌ tecpetrol — ${err.message}`);
}

// ─── Raster: Canacol Energy from companieslogo.com CDN ───────────
try {
  // companieslogo.com serves images at predictable CDN paths
  const CANACOL_URL = 'https://cdn.companieslogo.com/images/canacol-energy-inc-5429.png';
  const res = await fetch(CANACOL_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const sharp = (await import('sharp')).default;
  await sharp(buf)
    .resize(400, undefined, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(path.join(OUT, 'canacol-energy.webp'));
  console.log(`✅ canacol-energy.webp — ${(buf.length / 1024).toFixed(1)} KB PNG origen — Canacol Energy`);
} catch (err) {
  console.error(`❌ canacol-energy — ${err.message} (intentando CDN alternativo…)`);
  try {
    const CANACOL_URL2 = 'https://www.canacolenergy.com/wp-content/themes/canacol-energy/assets/images/logo.svg';
    const res2 = await fetch(CANACOL_URL2);
    if (res2.ok) {
      const buf2 = Buffer.from(await res2.arrayBuffer());
      fs.writeFileSync(path.join(OUT, 'canacol-energy.svg'), buf2);
      console.log(`✅ canacol-energy.svg — fallback oficial — Canacol Energy`);
    }
  } catch (_) {
    console.error(`❌ canacol-energy — sin logo disponible`);
  }
}

// ─── Raster: YPF from companieslogo.com ──────────────────────────
try {
  // YPF current logo (post-2012 renationalization) CDN
  const YPF_URL = 'https://cdn.companieslogo.com/images/y-p-f-s-a-62192b51.png';
  const res = await fetch(YPF_URL);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const sharp = (await import('sharp')).default;
  await sharp(buf)
    .resize(400, undefined, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 90 })
    .toFile(path.join(OUT, 'ypf.webp'));
  console.log(`✅ ypf.webp — ${(buf.length / 1024).toFixed(1)} KB PNG origen — YPF`);
} catch (err) {
  console.error(`❌ ypf — ${err.message} (intentando SVG alternativo…)`);
  try {
    const YPF_SVG = 'https://upload.wikimedia.org/wikipedia/commons/2/2c/YPF_Logo_2024.svg';
    const res2 = await fetch(YPF_SVG);
    if (res2.ok) {
      const buf2 = Buffer.from(await res2.arrayBuffer());
      fs.writeFileSync(path.join(OUT, 'ypf.svg'), buf2);
      console.log(`✅ ypf.svg — fallback Wikipedia — YPF`);
    }
  } catch (_) {
    console.error(`❌ ypf — sin logo disponible`);
  }
}

console.log('\n─── Logos en public/images/empresas/ ───');
for (const f of fs.readdirSync(OUT)) {
  const stat = fs.statSync(path.join(OUT, f));
  console.log(`  ${f} — ${(stat.size / 1024).toFixed(1)} KB`);
}
