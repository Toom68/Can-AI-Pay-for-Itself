# sitegen — preview-site generator

Turns one lead record into a polished, mobile-first one-page website a small
Brisbane business would happily pay A$249 for. Zero dependencies — pure Node
(Node 18+; developed on Node 26).

## Quick start

```sh
# Build the 6 fictional sample sites + gallery into previews/_samples/
node sitegen/build.mjs --json sitegen/samples.json --all --out previews/_samples --gallery

# Build one real lead into private/previews/ (default output, gitignored)
node sitegen/build.mjs --leads private/leads/leads.csv --slug <slug>

# Build every lead in the CSV
node sitegen/build.mjs --leads private/leads/leads.csv --all

# Screenshots of everything under previews/_samples (needs a local server + Chrome/Edge)
python -m http.server 8987 --directory previews        # in another terminal
node sitegen/screens.mjs --url http://127.0.0.1:8987/_samples/
```

## CLI

| Flag | Meaning |
|---|---|
| `--leads <file>` | CSV of leads (columns per `ops/specs/leads.md`) |
| `--json <file>` | JSON array of lead objects instead of CSV |
| `--slug <slug>` | build only this lead |
| `--all` | build every lead in the input |
| `--out <dir>` | output root (default `private/previews`) |
| `--gallery` | also write `<out>/index.html`, a card gallery of this run |
| `--sold` | production build: drops the preview banner, `noindex` and the unsolicited-preview note |

## Lead fields used

`slug, name, category, suburb, address, phone, email, facebook_url,
opening_hours (OSM format), services, lat, lon, osm_id`.
Everything is optional except `name`. `services` is split on `;`, `|` or `,`.
`opening_hours` is parsed from OSM syntax (`Mo-Fr 08:00-17:00; Sa 08:00-12:00`,
`24/7`, `PH off` …); unparseable strings are shown verbatim. `lat`/`lon` give a
live OpenStreetMap embed; otherwise the location card links to an OSM
search/`osm_id` node. `sample: true` marks fictional portfolio entries.

`personalisation_notes` is deliberately **not rendered** — it is outreach
material, not site copy.

## Themes

Six themes, picked automatically from `category` (`lib/themes.mjs`):

| theme | example categories | look |
|---|---|---|
| `trades` | plumber, electrician, builder, cleaner | navy + amber, bold sans, split hero, card services |
| `beauty` | hairdresser, barber, nails, tattoo | plum + rose, serif display, centred hero, numbered list |
| `food` | cafe, bakery, restaurant, butcher | espresso + terracotta, serif, menu card, info grid |
| `automotive` | car_repair, tyres, detailing | full dark theme, orange accents, checklist services |
| `wellness` | physio, massage, gym, vet | sage green, rounded, centred hero, soft cards |
| `generic` | florist, anything unmatched | slate/indigo storefront, split hero |

Each theme has its own palette (WCAG-AA contrast), font stack (system fonts
only — no downloads), section layout, service presentation and inline SVG
hero illustration. When a lead has no `services`, the theme inserts sensible
generic category services (no invented claims — no licences, years, ratings,
prices, staff names, or testimonials anywhere).

## Pages include

- Dismissible preview banner (text + price + contact from `config.json`)
- Sticky header with call CTA, hero with click-to-call `tel:` / `mailto:` buttons
- Services, opening-hours table (today highlighted via ~300 bytes of optional JS),
  location (OSM embed/link), contact band, footer
- `<title>` + meta description, Open Graph tags, `LocalBusiness` JSON-LD built
  only from real fields, `noindex` on previews, inline SVG favicon
- Everything works without JS; pages weigh ~17–19 KB

## Photos (optional, later)

Drop a `photos/` folder of images next to the leads file as `photos/<slug>/`,
or directly into `<out>/<slug>/photos/`, and rebuild — a gallery section is
added automatically (`.jpg/.jpeg/.png/.webp/.avif/.gif`).

## Config

`sitegen/config.json` — `BRAND_NAME`, `CONTACT_EMAIL`, `PRICE`, `STUDIO_URL`,
`LOCALE`, `REGION`. Update once the brand is chosen; rebuild to re-skin every site.

## Files

```
sitegen/
  build.mjs        CLI + orchestration
  screens.mjs      headless-Chrome screenshotter for verification
  config.json      studio/brand constants
  samples.json     6 fictional Brisbane businesses (sample: true)
  lib/csv.mjs      CSV parser
  lib/hours.mjs    OSM opening_hours -> table + schema.org
  lib/themes.mjs   themes, category matching, schema types, fallback services
  lib/page.mjs     page + gallery templates
```
