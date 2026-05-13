/**
 * migrate-csv.mjs — One-time migration script
 * Reads lista-afiliadas-cbhe.csv (semicolon-delimited), maps groups,
 * deduplicates, and writes 51 .md files to src/content/empresas/
 *
 * Idempotent: re-running clears existing .md files and rewrites them.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.resolve(__dirname, "../src/content/empresas/lista-afiliadas-cbhe.csv");
const outputDir = path.resolve(__dirname, "../src/content/empresas");

// ── Helpers ───────────────────────────────────────────

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")            // strip diacritics
    .replace(/[&,()]/g, " ")                     // separators → space
    .replace(/[^a-z0-9\s-]/g, "")               // remove remaining special chars
    .trim()
    .replace(/[\s-]+/g, "-")                     // collapse whitespace/dashes
    .replace(/^-|-$/g, "")                       // trim leading/trailing dashes
    .split("-")
    .slice(0, 6)
    .join("-");
}

function mapGroup(raw) {
  if (/UPSTREAM/i.test(raw)) return "upstream";
  if (/DOWNSTREAM/i.test(raw)) return "downstream";
  if (/ADHERENTE/i.test(raw)) return "adherentes";
  if (/POZO/i.test(raw)) return "pozo";
  if (/SUPERFICIE/i.test(raw)) return "superficie";
  if (/AUXILIARES/i.test(raw)) return "auxiliares";
  return null;
}

// ── Clean output directory (remove .md files, keep .csv) ──

for (const file of fs.readdirSync(outputDir)) {
  if (file.endsWith(".md")) {
    fs.unlinkSync(path.join(outputDir, file));
  }
}

// ── Read & parse CSV ─────────────────────────────────

const raw = fs.readFileSync(csvPath, "utf-8").replace(/^\uFEFF/, ""); // strip BOM
const lines = raw.trim().split(/\r?\n/);
const header = lines[0];

if (header !== "GRUPO;EMPRESA") {
  console.error(`Unexpected header: ${header}`);
  process.exit(1);
}

const rows = lines.slice(1);

// ── Process rows ─────────────────────────────────────

const seen = new Set();
let count = 0;

for (const line of rows) {
  const [grupoRaw, ...rest] = line.split(";");
  const empresa = rest.join(";").trim(); // handle any semicolons in company name

  if (!empresa) continue;

  // Deduplicate by company name
  if (seen.has(empresa)) {
    console.log(`  ⚠ Duplicate skipped: ${empresa}`);
    continue;
  }
  seen.add(empresa);

  const grupo = mapGroup(grupoRaw);
  if (!grupo) {
    console.warn(`  ⚠ Unknown group: ${grupoRaw} for ${empresa}`);
    continue;
  }

  const slug = slugify(empresa);
  const escapedNombre = empresa.replace(/"/g, '\\"');

  const frontmatter = `---
nombre: "${escapedNombre}"
grupo: ${grupo}
destacada: false
orden: 0
draft: false
---
`;

  fs.writeFileSync(path.join(outputDir, `${slug}.md`), frontmatter);
  count++;
}

// ── Summary ──────────────────────────────────────────

console.log(`Created ${count} files in src/content/empresas/`);
