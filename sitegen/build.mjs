#!/usr/bin/env node
// Preview-site generator. Zero dependencies (Node >= 18).
//
// Usage:
//   node sitegen/build.mjs --leads private/leads/leads.csv --slug <slug>
//   node sitegen/build.mjs --leads private/leads/leads.csv --all
//   node sitegen/build.mjs --json sitegen/samples.json --all --out previews/_samples --gallery
//
// Options:
//   --leads <file>   CSV of lead records (see ops/specs/leads.md for columns)
//   --json <file>    JSON array of lead objects (alternative to --leads)
//   --slug <slug>    build only this lead
//   --all            build every lead in the input
//   --out <dir>      output root (default: private/previews)
//   --gallery        write an index.html gallery of everything built this run
//   --sold           production build: no preview banner, no noindex
//   --force          overwrite existing output (default behaviour anyway)
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv } from "./lib/csv.mjs";
import { renderPage, renderGallery } from "./lib/page.mjs";
import { themeFor, categoryLabel } from "./lib/themes.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const PHOTO_EXT = /\.(jpe?g|png|webp|avif|gif)$/i;

function parseArgs(argv) {
  const a = { out: join(ROOT, "private", "previews"), gallery: false, sold: false };
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    if (k === "--all") a.all = true;
    else if (k === "--gallery") a.gallery = true;
    else if (k === "--sold") a.sold = true;
    else if (k === "--force") a.force = true;
    else if (k === "--leads") a.leads = argv[++i];
    else if (k === "--json") a.json = argv[++i];
    else if (k === "--slug") a.slug = argv[++i];
    else if (k === "--out") a.out = resolve(argv[++i]);
    else if (k === "-h" || k === "--help") { a.help = true; }
    else { console.error(`Unknown option: ${k}`); a.bad = true; }
  }
  return a;
}

function slugify(lead, i) {
  if (lead.slug && /^[a-z0-9][a-z0-9-]*$/.test(lead.slug)) return lead.slug;
  const base = String(lead.name || `lead-${i}`)
    .toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return base || `lead-${i}`;
}

function loadLeads(a) {
  if (a.leads) return parseCsv(readFileSync(resolve(a.leads), "utf8"));
  if (a.json) {
    const data = JSON.parse(readFileSync(resolve(a.json), "utf8"));
    return Array.isArray(data) ? data : data.leads;
  }
  return null;
}

// Photos for a slug: <inputDir>/photos/<slug>/ copied into <out>/<slug>/photos/,
// and/or files already sitting in <out>/<slug>/photos/.
function collectPhotos(slug, inputDir, outSiteDir) {
  const destDir = join(outSiteDir, "photos");
  const srcDir = inputDir ? join(inputDir, "photos", slug) : null;
  if (srcDir && existsSync(srcDir)) {
    mkdirSync(destDir, { recursive: true });
    for (const f of readdirSync(srcDir)) {
      if (PHOTO_EXT.test(f)) copyFileSync(join(srcDir, f), join(destDir, f));
    }
  }
  if (!existsSync(destDir)) return [];
  return readdirSync(destDir).filter(f => PHOTO_EXT.test(f)).sort();
}

function main() {
  const a = parseArgs(process.argv);
  const usage = `Usage:
  node sitegen/build.mjs --leads <leads.csv> (--slug <slug> | --all) [--out <dir>] [--gallery] [--sold]
  node sitegen/build.mjs --json <leads.json> (--slug <slug> | --all)  [--out <dir>] [--gallery] [--sold]`;
  if (a.help || a.bad) { console.log(usage); process.exit(a.bad ? 1 : 0); }
  const cfg = JSON.parse(readFileSync(join(HERE, "config.json"), "utf8"));
  const leads = loadLeads(a);
  if (!leads) { console.error("Give --leads <csv> or --json <file>.\n" + usage); process.exit(1); }
  if (!a.slug && !a.all) { console.error("Give --slug <slug> or --all.\n" + usage); process.exit(1); }

  const inputDir = a.leads ? dirname(resolve(a.leads)) : a.json ? dirname(resolve(a.json)) : null;
  const results = [];
  let failures = 0;

  leads.forEach((lead, i) => {
    const slug = slugify(lead, i);
    if (!a.all && lead.slug !== a.slug && slug !== a.slug) return;
    if (!lead.name) { console.error(`skip: lead #${i} has no name`); failures++; return; }
    const outSiteDir = join(a.out, slug);
    mkdirSync(outSiteDir, { recursive: true });
    lead._photos = collectPhotos(slug, inputDir, outSiteDir);
    try {
      const { html, theme } = renderPage(lead, cfg, { sold: a.sold });
      writeFileSync(join(outSiteDir, "index.html"), html, "utf8");
      const kb = (Buffer.byteLength(html, "utf8") / 1024).toFixed(1);
      console.log(`built ${slug}  [${theme}]  ${kb} KB -> ${outSiteDir}`);
      results.push({ slug, theme, kb: +kb, name: lead.name, sample: !!lead.sample, meta: `${categoryLabel(lead.category)} · ${lead.suburb || "Brisbane"}`, art: themeFor(lead.category).art(lead) });
    } catch (err) {
      failures++;
      console.error(`FAIL ${slug}: ${err.stack || err}`);
    }
  });

  if (a.slug && !results.length && !failures) {
    console.error(`No lead with slug "${a.slug}". Available: ${leads.map((l, i) => slugify(l, i)).join(", ")}`);
    process.exit(1);
  }
  if (a.gallery) {
    writeFileSync(join(a.out, "index.html"), renderGallery(results, cfg), "utf8");
    console.log(`gallery -> ${join(a.out, "index.html")} (${results.length} cards)`);
  }
  const total = results.reduce((s, r) => s + r.kb, 0);
  console.log(`done: ${results.length} built, ${failures} failed, avg ${results.length ? (total / results.length).toFixed(1) : 0} KB`);
  if (failures) process.exit(1);
}

main();
