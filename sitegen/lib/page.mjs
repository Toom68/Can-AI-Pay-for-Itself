import { parseOpeningHours } from "./hours.mjs";
import { themeFor, schemaType, defaultServices, categoryLabel, proseNoun } from "./themes.mjs";

export const esc = s =>
  String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const telHref = phone => "tel:" + String(phone).replace(/[^+\d]/g, "");
const mailHref = email => "mailto:" + String(email).trim();

/* ------------------------------------------------------------------ CSS -- */

function css(theme) {
  const v = Object.entries(theme.vars).map(([k, val]) => `--${k}:${val}`).join(";");
  return `
:root{${v};--font-d:${theme.fonts.display};--font-b:${theme.fonts.body}}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--font-b);background:var(--bg);color:var(--ink);line-height:1.6;font-size:16.5px;-webkit-font-smoothing:antialiased}
img,svg{max-width:100%;display:block}
a{color:var(--accent)}
.wrap{max-width:1100px;margin:0 auto;padding:0 22px}
section{padding:64px 0}
h1,h2,h3{font-family:var(--font-d);line-height:1.12;font-weight:${theme.id === "beauty" || theme.id === "food" ? 500 : 800};letter-spacing:${theme.id === "trades" || theme.id === "automotive" ? "-.015em" : "-.01em"}${theme.uppercaseHeadings ? ";text-transform:uppercase" : ""}}
h2{font-size:clamp(1.7rem,3.4vw,2.3rem);margin-bottom:.4em}
h3{font-size:1.05rem}
.eyebrow{display:inline-flex;align-items:center;gap:.55em;font-size:.8rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${theme.dark ? "var(--accent)" : "var(--accent)"};margin-bottom:18px}
.eyebrow::before{content:"";width:26px;height:2px;background:var(--accent);display:inline-block}
.hero .eyebrow{color:var(--accent-on-deep)}
.hero .eyebrow::before{background:var(--accent-on-deep)}
.lede{font-size:1.13rem;color:var(--deep-muted);max-width:34em;margin:14px 0 30px}
.btn{display:inline-flex;align-items:center;gap:.5em;padding:13px 26px;border-radius:var(--btn-radius);font-weight:700;font-size:1rem;text-decoration:none;border:2px solid transparent;transition:transform .15s ease,box-shadow .15s ease;max-width:100%;min-width:0;overflow-wrap:anywhere;text-align:center}
.btn-primary{background:var(--accent-bg);color:var(--accent-ink)}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgb(0 0 0/.22)}
.btn-ghost{border-color:var(--deep-muted);color:var(--deep-ink);background:transparent}
.btn-ghost:hover{border-color:var(--deep-ink)}
.btn svg{width:1.05em;height:1.05em;flex:none}
/* preview banner */
.pvbar{position:relative;z-index:60;display:flex;align-items:center;justify-content:center;gap:1em;flex-wrap:wrap;background:#141414;color:#f2f2f2;font-size:.83rem;padding:9px 46px 9px 18px;text-align:center}
.pvbar a{color:#ffd479;font-weight:700}
.pvbar strong{color:#fff}
.pvbar button{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:transparent;border:0;color:#bbb;font-size:1.15rem;cursor:pointer;line-height:1;padding:4px 8px}
.pvbar button:hover{color:#fff}
/* header */
.site-head{position:sticky;top:0;z-index:50;background:${theme.dark ? "color-mix(in srgb,var(--deep) 86%,transparent)" : "color-mix(in srgb,var(--surface) 88%,transparent)"};backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
.site-head .wrap{display:flex;align-items:center;justify-content:space-between;gap:14px;padding-top:12px;padding-bottom:12px}
.brand{display:flex;align-items:center;gap:11px;text-decoration:none;color:var(--ink);font-family:var(--font-d);font-weight:${theme.id === "beauty" || theme.id === "food" ? 600 : 800};font-size:1.08rem;letter-spacing:-.01em}
.brand .mark{width:36px;height:36px;flex:none;border-radius:${theme.id === "beauty" || theme.id === "wellness" ? "50%" : "var(--radius)"};background:var(--accent-bg);color:var(--accent-ink);display:grid;place-items:center;font-size:1.05rem}
nav{display:flex;align-items:center;gap:22px}
nav a{color:var(--ink);text-decoration:none;font-size:.93rem;font-weight:600}
nav a:hover{color:var(--accent)}
nav .btn{padding:9px 18px;font-size:.9rem}
@media(max-width:640px){nav a.navlink{display:none}nav .btn{display:none}}
/* hero */
.hero{background:var(--deep);color:var(--deep-ink);padding:76px 0 84px;overflow:hidden}
.hero-grid{display:grid;grid-template-columns:1.02fr .98fr;gap:56px;align-items:center}
.hero-center{text-align:center;max-width:820px;margin:0 auto}
.hero-center .eyebrow{justify-content:center}
.hero-center .lede{margin-left:auto;margin-right:auto}
.hero-art{border-radius:var(--radius);overflow:hidden;box-shadow:0 24px 60px rgb(0 0 0/.3);line-height:0}
.hero-center .hero-art{margin-top:44px}
.hero h1{font-size:clamp(2.2rem,5.4vw,3.6rem)}
.cta-row{display:flex;gap:14px;flex-wrap:wrap}
.hero-center .cta-row{justify-content:center}
.hero .phone-chip{margin-top:22px;color:var(--deep-muted);font-size:.92rem}
/* services */
.svc-head{display:flex;align-items:end;justify-content:space-between;gap:20px;margin-bottom:34px}
.svc-head p{color:var(--muted);max-width:40em}
.svc-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;list-style:none}
.svc-grid li{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:20px 22px;display:flex;gap:14px;align-items:flex-start;box-shadow:0 1px 2px rgb(0 0 0/.04)}
.svc-grid li .ic{flex:none;width:38px;height:38px;border-radius:${theme.id === "beauty" || theme.id === "wellness" ? "50%" : "10px"};background:var(--chip);color:var(--accent);display:grid;place-items:center}
.svc-grid li .ic svg{width:19px;height:19px}
.svc-rows{list-style:none;max-width:720px;margin:0 auto}
.svc-rows li{display:flex;align-items:center;gap:16px;padding:17px 4px;border-bottom:1px solid var(--line);font-family:var(--font-d);font-size:1.15rem}
.svc-rows li:last-child{border-bottom:0}
.svc-rows .dot{flex:none;width:9px;height:9px;border-radius:50%;background:var(--accent)}
.svc-rows .no{color:var(--accent);font-size:.8rem;letter-spacing:.1em;font-family:var(--font-b);font-weight:700;min-width:2.1em}
.svc-menu{list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));column-gap:48px;max-width:860px;margin:0 auto;background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:34px 40px}
.svc-menu li{display:flex;align-items:baseline;gap:10px;padding:13px 0;border-bottom:1px dashed var(--line)}
.svc-menu li span:first-child{font-family:var(--font-d);font-size:1.12rem}
.svc-checks{list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px 34px;max-width:860px}
.svc-checks li{display:flex;gap:12px;align-items:flex-start;padding:6px 0;font-size:1.05rem}
.svc-checks .ic{flex:none;width:26px;height:26px;border-radius:6px;background:var(--chip);color:var(--accent);display:grid;place-items:center;margin-top:2px}
.svc-checks .ic svg{width:15px;height:15px}
/* info (hours + location) */
.info-grid{display:grid;grid-template-columns:1fr 1fr;gap:26px;align-items:stretch}
.info-grid.single{grid-template-columns:1fr;max-width:720px;margin:0 auto}
.info-grid.centered{grid-template-columns:minmax(0,680px);justify-content:center}
.card{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:30px;box-shadow:0 1px 2px rgb(0 0 0/.04)}
.hours-table{width:100%;border-collapse:collapse;font-size:.98rem}
.hours-table td{padding:10px 0;border-bottom:1px solid var(--line)}
.hours-table tr:last-child td{border-bottom:0}
.hours-table td:last-child{text-align:right;font-weight:600;font-variant-numeric:tabular-nums}
.hours-table tr.today td{color:var(--accent);font-weight:800}
.hours-note{margin-top:16px;font-size:.85rem;color:var(--muted)}
.map-frame{width:100%;aspect-ratio:4/3;border:0;border-radius:calc(var(--radius) - 6px);background:var(--chip)}
.addr{font-size:1.05rem;margin:6px 0 14px}
.map-link{font-size:.9rem;font-weight:600}
.map-credit{font-size:.75rem;color:var(--muted);margin-top:10px}
.photos{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px;margin-top:20px}
.photos img{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:calc(var(--radius) - 6px)}
/* contact */
.contact-band{background:var(--deep);color:var(--deep-ink);border-radius:calc(var(--radius) + 8px);padding:56px 48px;text-align:center;box-shadow:0 24px 60px rgb(0 0 0/.18)}
.contact-band h2{color:var(--deep-ink)}
.contact-band p{color:var(--deep-muted);max-width:38em;margin:0 auto 28px}
.contact-band .cta-row{justify-content:center}
/* footer */
.site-foot{border-top:1px solid var(--line);padding:36px 0 44px;font-size:.87rem;color:var(--muted)}
.site-foot .wrap{display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap}
.site-foot .studio{color:var(--accent);font-weight:700;text-decoration:none}
.preview-note{width:100%;font-size:.78rem;margin-top:14px}
/* responsive */
@media(max-width:860px){
  .hero-grid{grid-template-columns:1fr;gap:38px}
  .hero{padding:60px 0 66px}
  .info-grid{grid-template-columns:1fr}
  .contact-band{padding:42px 24px}
  section{padding:50px 0}
  .svc-menu{padding:26px 22px}
}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto;transition:none!important}}
:focus-visible{outline:3px solid var(--accent);outline-offset:2px;border-radius:4px}
`;
}

/* ---------------------------------------------------------------- pieces -- */

const ICONS = {
  phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  fb: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4V14h2.7v8z"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
};

function previewBanner(lead, cfg) {
  return `<div class="pvbar" id="pvbar" role="region" aria-label="Preview notice">
  <span>Free preview made for <strong>${esc(lead.name)}</strong> by <strong>${esc(cfg.BRAND_NAME)}</strong>
  &nbsp;·&nbsp; Like it? It&rsquo;s yours for <strong>${esc(cfg.PRICE)}</strong>
  &nbsp;·&nbsp; <a href="${esc(mailHref(cfg.CONTACT_EMAIL))}">${esc(cfg.CONTACT_EMAIL)}</a></span>
  <button type="button" id="pv-dismiss" aria-label="Dismiss preview notice">&times;</button>
</div>`;
}

function head(lead, theme, cfg, opts) {
  const cat = categoryLabel(lead.category);
  const place = lead.suburb ? `${lead.suburb}, Brisbane` : "Brisbane";
  const title = `${lead.name} — ${cat} in ${place}`.slice(0, 68);
  const svc = splitServices(lead.services).slice(0, 3).join(", ").toLowerCase();
  const desc = `${lead.name} is a local ${proseNoun(lead.category)} in ${place}.${svc ? ` Services include ${svc}.` : ""}${lead.phone ? ` Call ${lead.phone}.` : ""}`.slice(0, 160);
  const robots = opts.sold ? "" : `<meta name="robots" content="noindex">`;
  const initial = encodeURIComponent((lead.name || "?").trim().charAt(0).toUpperCase());
  const favicon = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='${encodeURIComponent(theme.vars["accent-bg"])}'/%3E%3Ctext x='32' y='44' font-family='system-ui,sans-serif' font-size='34' font-weight='700' text-anchor='middle' fill='${encodeURIComponent(theme.vars["accent-ink"])}'%3E${initial}%3C/text%3E%3C/svg%3E`;
  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${robots}
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:locale" content="${esc(cfg.LOCALE || "en_AU")}">
<meta name="theme-color" content="${theme.vars.deep}">
<link rel="icon" href="${favicon}">
${jsonLd(lead, cfg)}
<style>${css(theme)}</style>
</head>`;
}

function jsonLd(lead, cfg) {
  const data = { "@context": "https://schema.org", "@type": schemaType(lead.category), name: lead.name };
  if (lead.address || lead.suburb) {
    data.address = {
      "@type": "PostalAddress",
      ...(lead.address ? { streetAddress: lead.address } : {}),
      ...(lead.suburb ? { addressLocality: lead.suburb } : {}),
      addressRegion: "QLD",
      addressCountry: "AU",
    };
  }
  if (lead.phone) data.telephone = lead.phone;
  if (lead.email) data.email = lead.email;
  if (lead.facebook_url) data.sameAs = [lead.facebook_url];
  const lat = parseFloat(lead.lat), lon = parseFloat(lead.lon);
  if (Number.isFinite(lat) && Number.isFinite(lon)) data.geo = { "@type": "GeoCoordinates", latitude: lat, longitude: lon };
  const hours = parseOpeningHours(lead.opening_hours);
  if (hours?.schema?.length) data.openingHoursSpecification = hours.schema;
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

function splitServices(raw) {
  const s = String(raw || "").trim();
  if (!s) return [];
  return s.split(/[;|,]/).map(x => x.trim()).filter(x => x.length > 1 && x.length < 80).slice(0, 12);
}

function header(lead, nav = {}) {
  const initial = esc((lead.name || "?").trim().charAt(0).toUpperCase());
  const callBtn = lead.phone
    ? `<a class="btn btn-primary" href="${esc(telHref(lead.phone))}">${ICONS.phone}${esc(lead.phone)}</a>`
    : "";
  const link = (id, label) => `<a class="navlink" href="#${id}">${label}</a>`;
  return `<header class="site-head"><div class="wrap">
  <a class="brand" href="#top"><span class="mark">${initial}</span>${esc(lead.name)}</a>
  <nav aria-label="Site">
    ${nav.services === false ? "" : link("services", "Services")}
    ${nav.hours === false ? "" : link("hours", "Hours")}
    ${nav.location === false ? "" : link("location", "Location")}
    ${link("contact", "Contact")}
    ${callBtn}
  </nav>
</div></header>`;
}

function hero(lead, theme) {
  const cat = categoryLabel(lead.category);
  const place = lead.suburb || "Brisbane";
  const btns = [];
  if (lead.phone) btns.push(`<a class="btn btn-primary" href="${esc(telHref(lead.phone))}">${ICONS.phone}Call ${esc(lead.phone)}</a>`);
  if (lead.email) btns.push(`<a class="btn btn-ghost" href="${esc(mailHref(lead.email))}">${ICONS.mail}${esc(lead.email)}</a>`);
  if (!btns.length) btns.push(`<a class="btn btn-primary" href="#location">${ICONS.pin}Find us</a>`);
  const artHtml = `<div class="hero-art">${theme.art(lead)}</div>`;
  const inner = theme.layout.hero === "split"
    ? `<div class="hero-grid"><div>
        <span class="eyebrow">${esc(cat)} · ${esc(place)}</span>
        <h1>${esc(lead.name)}</h1>
        <p class="lede">Your friendly local ${esc(proseNoun(lead.category))}, proudly serving ${esc(place)} and the surrounding Brisbane area.</p>
        <div class="cta-row">${btns.join("\n")}</div>
      </div>${artHtml}</div>`
    : `<div class="hero-center">
        <span class="eyebrow">${esc(cat)} · ${esc(place)}</span>
        <h1>${esc(lead.name)}</h1>
        <p class="lede">Your friendly local ${esc(proseNoun(lead.category))}, proudly serving ${esc(place)} and the surrounding Brisbane area.</p>
        <div class="cta-row">${btns.join("\n")}</div>
        ${artHtml}
      </div>`;
  return `<section class="hero" id="top"><div class="wrap">${inner}</div></section>`;
}

function services(lead, theme) {
  let items = splitServices(lead.services);
  if (!items.length) items = defaultServices(lead.category) || [];
  if (!items.length) return "";
  const style = theme.layout.services;
  let list;
  if (style === "rows") {
    list = `<ul class="svc-rows">${items.map((s, i) => `<li><span class="no">${String(i + 1).padStart(2, "0")}</span>${esc(s)}</li>`).join("")}</ul>`;
  } else if (style === "menu") {
    list = `<ul class="svc-menu">${items.map(s => `<li><span>${esc(s)}</span></li>`).join("")}</ul>`;
  } else if (style === "checks") {
    list = `<ul class="svc-checks">${items.map(s => `<li><span class="ic">${theme.bullet}</span>${esc(s)}</li>`).join("")}</ul>`;
  } else {
    list = `<ul class="svc-grid">${items.map(s => `<li><span class="ic">${theme.bullet}</span><span>${esc(s)}</span></li>`).join("")}</ul>`;
  }
  return `<section id="services"><div class="wrap">
  <div class="svc-head"><div><span class="eyebrow">What we offer</span><h2>${esc(theme.headings.services)}</h2></div></div>
  ${list}
</div></section>`;
}

function hoursBlock(lead, theme) {
  const raw = (lead.opening_hours || "").trim();
  if (!raw) return "";
  const parsed = parseOpeningHours(raw);
  const body = parsed
    ? `<table class="hours-table"><tbody>${parsed.rows.map(r => `<tr data-days="${r.dayIdxs.join(",")}"><td>${esc(r.days)}</td><td>${esc(r.times)}</td></tr>`).join("")}</tbody></table>
       <p class="hours-note">Hours from public listing — worth a quick call before visiting.</p>`
    : `<p class="addr">${esc(raw)}</p>
       <p class="hours-note">As listed publicly — worth a quick call before visiting.</p>`;
  return `<div class="card" id="hours"><h3>${esc(theme.headings.hours)}</h3><div style="height:14px"></div>${body}</div>`;
}

function locationBlock(lead, theme) {
  const lat = parseFloat(lead.lat), lon = parseFloat(lead.lon);
  const hasGeo = Number.isFinite(lat) && Number.isFinite(lon);
  const query = encodeURIComponent([lead.address, lead.suburb, "Brisbane QLD Australia"].filter(Boolean).join(", "));
  let inner = "";
  if (hasGeo) {
    const d = 0.0045;
    const bbox = `${(lon - d).toFixed(5)},${(lat - d * 0.72).toFixed(5)},${(lon + d).toFixed(5)},${(lat + d * 0.72).toFixed(5)}`;
    inner += `<iframe class="map-frame" title="Map of ${esc(lead.name)} area" loading="lazy" referrerpolicy="no-referrer"
      src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&amp;layer=mapnik&amp;marker=${lat},${lon}"></iframe>`;
    inner += `<p class="map-credit"><a class="map-link" href="https://www.openstreetmap.org/?mlat=${lat}&amp;mlon=${lon}#map=17/${lat}/${lon}" target="_blank" rel="noopener">Open in OpenStreetMap &nearr;</a><br>Map data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a></p>`;
  } else {
    const osmId = (lead.osm_id || "").trim();
    const href = osmId
      ? `https://www.openstreetmap.org/${osmId.includes("/") ? osmId : "node/" + osmId}`
      : `https://www.openstreetmap.org/search?query=${query}`;
    inner += `<div style="display:flex;gap:14px;align-items:flex-start"><span class="ic" style="flex:none;width:38px;height:38px;border-radius:${theme.id === "beauty" || theme.id === "wellness" ? "50%" : "10px"};background:var(--chip);color:var(--accent);display:grid;place-items:center"><span style="width:19px;height:19px;display:block">${ICONS.pin}</span></span>
      <div>${lead.address ? `<p class="addr">${esc(lead.address)}${lead.suburb ? `, ${esc(lead.suburb)}` : ""}</p>` : lead.suburb ? `<p class="addr">${esc(lead.suburb)}, Brisbane</p>` : ""}
      <a class="map-link" href="${esc(href)}" target="_blank" rel="noopener">View on OpenStreetMap &nearr;</a></div></div>`;
  }
  if (lead.address && hasGeo) inner = `<p class="addr">${esc(lead.address)}${lead.suburb ? `, ${esc(lead.suburb)}` : ""}</p>` + inner;
  return `<div class="card" id="location"><h3>${esc(theme.headings.location)}</h3><div style="height:14px"></div>${inner}</div>`;
}

function infoSection(lead, theme) {
  const h = hoursBlock(lead, theme);
  const loc = lead.address || lead.lat || lead.suburb || lead.osm_id ? locationBlock(lead, theme) : "";
  if (!h && !loc) return "";
  const blocks = [h, loc].filter(Boolean);
  const cls = !theme.layout.infoGrid || blocks.length === 1 ? "info-grid centered" : "info-grid";
  return `<section><div class="wrap"><span class="eyebrow">Visit</span>
  <h2 style="margin-bottom:34px">Hours &amp; location</h2>
  <div class="${cls}">${blocks.join("\n")}</div>
</div></section>`;
}

function photosBlock(photos) {
  if (!photos?.length) return "";
  return `<section id="photos"><div class="wrap"><span class="eyebrow">Gallery</span><h2>A look at our work</h2>
  <div class="photos">${photos.map(p => `<img src="photos/${esc(p)}" alt="Photo of the business" loading="lazy">`).join("")}</div>
</div></section>`;
}

function contact(lead, theme) {
  const parts = [];
  if (lead.phone) parts.push(`<a class="btn btn-primary" href="${esc(telHref(lead.phone))}">${ICONS.phone}${esc(lead.phone)}</a>`);
  if (lead.email) parts.push(`<a class="btn btn-ghost" href="${esc(mailHref(lead.email))}">${ICONS.mail}${esc(lead.email)}</a>`);
  if (lead.facebook_url) parts.push(`<a class="btn btn-ghost" href="${esc(lead.facebook_url)}" target="_blank" rel="noopener">${ICONS.fb}Facebook</a>`);
  const addr = [lead.address, lead.suburb].filter(Boolean).join(", ");
  return `<section id="contact"><div class="wrap"><div class="contact-band">
  <h2>${esc(theme.headings.contact)}</h2>
  <p>Call, email or drop in${addr ? ` — you&rsquo;ll find ${esc(lead.name)} at ${esc(addr)}` : ""}. We&rsquo;d be glad to help.</p>
  <div class="cta-row">${parts.join("\n")}</div>
</div></div></section>`;
}

function footer(lead, theme, cfg, opts) {
  const year = new Date().getFullYear();
  const note = opts.sold
    ? ""
    : `<p class="preview-note">This is a free, unsolicited design preview created for ${esc(lead.name)} by ${esc(cfg.BRAND_NAME)}. It is not affiliated with or endorsed by the business unless claimed.</p>`;
  return `<footer class="site-foot"><div class="wrap">
  <div><strong>${esc(lead.name)}</strong><br>${esc([lead.suburb, "Brisbane"].filter(Boolean).join(", "))} · &copy; ${year}</div>
  <div style="text-align:right">Map data &copy; OpenStreetMap contributors<br><a class="studio" href="${esc(cfg.STUDIO_URL || "#")}">Site by ${esc(cfg.BRAND_NAME)}</a></div>
  ${note}
</div></footer>`;
}

const ENHANCE_JS = `<script>(function(){var b=document.getElementById('pv-dismiss');if(b){b.addEventListener('click',function(){var e=document.getElementById('pvbar');if(e)e.remove()})}var d=(new Date().getDay()+6)%7;var t=document.querySelectorAll('tr[data-days]');for(var i=0;i<t.length;i++){if(t[i].getAttribute('data-days').split(',').indexOf(String(d))>-1)t[i].classList.add('today')}})();</script>`;

export function renderPage(lead, cfg, opts = {}) {
  const theme = themeFor(lead.category);
  const nav = {
    services: splitServices(lead.services).length > 0 || !!defaultServices(lead.category),
    hours: !!(lead.opening_hours || "").trim(),
    location: !!(lead.address || lead.suburb || lead.osm_id || (Number.isFinite(parseFloat(lead.lat)) && Number.isFinite(parseFloat(lead.lon)))),
  };
  const html = `${head(lead, theme, cfg, opts)}
<body>
${opts.sold ? "" : previewBanner(lead, cfg)}
${header(lead, nav)}
<main>
${hero(lead, theme)}
${services(lead, theme)}
${infoSection(lead, theme)}
${photosBlock(lead._photos)}
${contact(lead, theme)}
</main>
${footer(lead, theme, cfg, opts)}
${ENHANCE_JS}
</body>
</html>
`;
  return { html, theme: theme.id, title: lead.name };
}

/* ------------------------------------------------------------- gallery -- */

export function renderGallery(entries, cfg) {
  const cards = entries.map(e => `<a class="g-card" href="./${esc(e.slug)}/">
    <div class="g-art">${e.art}</div>
    <div class="g-meta"><strong>${esc(e.name)}</strong><span>${esc(e.meta)}</span>
    ${e.sample ? '<em class="g-chip">Fictional sample</em>' : ""}</div></a>`).join("\n");
  return `<!doctype html>
<html lang="en-AU"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>Site previews — ${esc(cfg.BRAND_NAME)}</title>
<meta name="description" content="Sample one-page websites built by ${esc(cfg.BRAND_NAME)} for Brisbane small businesses.">
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:system-ui,"Segoe UI",Roboto,sans-serif;background:#f4f5f7;color:#1d2433;line-height:1.6}
.wrap{max-width:1100px;margin:0 auto;padding:0 22px}
header{padding:56px 0 10px}
h1{font-size:clamp(1.8rem,4vw,2.6rem);letter-spacing:-.02em}
.sub{color:#5b6579;max-width:44em;margin-top:8px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:22px;padding:36px 0 60px}
.g-card{display:block;background:#fff;border:1px solid #e3e6ec;border-radius:14px;overflow:hidden;text-decoration:none;color:inherit;transition:transform .15s ease,box-shadow .15s ease}
.g-card:hover{transform:translateY(-3px);box-shadow:0 14px 34px rgb(20 30 60/.12)}
.g-art{aspect-ratio:4/3;overflow:hidden;line-height:0}
.g-art svg{width:100%;height:100%;object-fit:cover}
.g-meta{padding:16px 18px 18px;display:flex;flex-direction:column;gap:2px}
.g-meta strong{font-size:1.05rem}
.g-meta span{color:#5b6579;font-size:.9rem}
.g-chip{align-self:flex-start;margin-top:8px;font-style:normal;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;background:#ece8dd;color:#7a6a3a;padding:3px 9px;border-radius:999px}
footer{border-top:1px solid #e3e6ec;padding:26px 0;color:#5b6579;font-size:.85rem}
</style></head><body><div class="wrap">
<header><h1>Site previews by ${esc(cfg.BRAND_NAME)}</h1>
<p class="sub">One-page websites designed for Brisbane small businesses. Every business shown here is fictional &mdash; these are design samples, not live sites.</p></header>
<div class="grid">${cards}</div>
<footer>Built by ${esc(cfg.BRAND_NAME)} &middot; ${esc(cfg.CONTACT_EMAIL)}</footer>
</div></body></html>`;
}
