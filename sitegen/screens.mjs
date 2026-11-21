#!/usr/bin/env node
// Screenshot every page under a previews dir with headless Chrome/Edge.
// Usage: node sitegen/screens.mjs [--dir previews/_samples] [--url http://127.0.0.1:8123/_samples/] [--widths 1280,375]
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i > -1 ? args[i + 1] : d; };
const DIR = resolve(ROOT, opt("--dir", "previews/_samples"));
const BASE = opt("--url", "http://127.0.0.1:8123/_samples/").replace(/\/?$/, "/");
const WIDTHS = opt("--widths", "1280,375").split(",").map(Number);
const OUT = join(DIR, "_screens");

const CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "chrome", "google-chrome", "msedge",
];
function findBrowser() {
  for (const c of CANDIDATES) {
    if (!c) continue;
    if (c.includes("/") || c.includes("\\")) { if (existsSync(c)) return c; continue; }
    const r = spawnSync(c, ["--version"], { encoding: "utf8" });
    if (!r.error) return c;
  }
  return null;
}

const browser = findBrowser();
if (!browser) { console.error("No Chrome/Edge found. Set CHROME_PATH."); process.exit(1); }
mkdirSync(OUT, { recursive: true });

const slugs = readdirSync(DIR).filter(d => d !== "_screens" && statSync(join(DIR, d)).isDirectory() && existsSync(join(DIR, d, "index.html")));
const targets = [...slugs.map(s => `${s}/`), ""]; // "" = the index/gallery page
const profile = join(tmpdir(), "sitegen-shot-profile");

let n = 0;
for (const t of targets) {
  for (const w of WIDTHS) {
    const name = (t ? t.replace(/\/$/, "") : "index") + `-${w}.png`;
    const file = join(OUT, name);
    const r = spawnSync(browser, [
      "--headless", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
      `--user-data-dir=${profile}`, `--window-size=${w},3200`,
      `--screenshot=${file}`, `${BASE}${t}`,
    ], { encoding: "utf8", timeout: 60000 });
    if (existsSync(file)) { n++; console.log(`${name}  ${(statSync(file).size / 1024).toFixed(0)} KB`); }
    else console.error(`FAILED ${name}: ${(r.stderr || r.stdout || "").slice(-300)}`);
  }
}
console.log(`${n} screenshots -> ${OUT}`);
