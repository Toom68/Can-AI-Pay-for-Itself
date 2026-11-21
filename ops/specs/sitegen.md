# Task: Preview-site generator (agent name: sitegen)

Workspace: C:\Users\tomy\orca\workspaces\200inamonth\sevengill
Read `AGENTS.md` first; its hard rules override anything here. This repo is PUBLIC.

## Goal
A generator that turns one lead record into a fast, beautiful, mobile-first one-page website
that a small Brisbane business would happily pay A$249 for. Quality IS the sales pitch: it must
look like a real agency build, not a generic template.

## Deliverables
Your paths: `sitegen/` and `previews/_samples/` (public), `private/previews/` (gitignored: real
businesses' previews, never committed).
1. A build script (Node 26 is installed; keep dependencies minimal and local to `sitegen/`, no
   global installs): `node sitegen/build.mjs --leads private/leads/leads.csv --slug <slug>`
   writes `private/previews/<slug>/index.html` (+ assets); `--out <dir>` overrides the output
   root (default `private/previews`). Also support `--all` and `--json <file>` input.
   Lead fields: see the column list in `ops/specs/leads.md` (slug, name, category, suburb,
   address, phone, email, facebook_url, opening_hours, services, personalisation_notes...).
   `private/leads/leads.csv` may not exist yet: another worker is producing it.
2. At least 5 visually distinct category themes plus a generic fallback: trades
   (plumber/electrician/builder), beauty (hair/nails/barber), food (cafe/bakery/restaurant),
   automotive, wellness/health (physio/massage). Each with its own palette, typography and
   section layout. System font stacks or self-hosted open-licence fonts; inline SVG icons.
3. Sections: hero (business name, suburb, primary CTA: click-to-call `tel:` and/or email),
   services (from lead data; if absent, sensible generic category services such as
   "Leak repairs"), opening hours (parse OSM `opening_hours` into a readable table; hide if
   missing), location (OpenStreetMap embed iframe or link; no Google API keys), contact,
   footer. NEVER invent claims: no "licensed", "20 years experience", star ratings,
   testimonials, awards, prices, or staff names unless present in the lead data.
4. SEO/tech: semantic HTML, title + meta description, Open Graph tags, schema.org
   `LocalBusiness` JSON-LD built only from real fields, responsive (check 375px and 1280px),
   content works without JS, page weight under 300 KB, WCAG AA contrast. Aim for Lighthouse
   95+ in every category (try `npx lighthouse` locally if it works; otherwise keep it lean
   and explain).
5. Preview banner: slim, dismissible top bar: "Free preview made for <Business> by
   {{BRAND_NAME}} · Like it? It's yours for {{PRICE}} · {{CONTACT}}". Values come from
   `sitegen/config.json` (placeholders for now: BRAND_NAME "Studio Name", CONTACT_EMAIL
   "hello@example.com", PRICE "A$249", STUDIO_URL "#"). Add
   `<meta name="robots" content="noindex">` to previews. Footer credit "Site by {{BRAND_NAME}}"
   (configurable).
6. Images: do not hotlink stock photos. Use tasteful CSS/SVG patterns, gradients or abstract
   per-category illustrations. Support an optional `photos/` folder per slug for later.
7. Create `sitegen/samples.json` with 6 clearly fictional sample businesses (one per theme,
   Brisbane suburbs, names suffixed "(sample)" is NOT needed in the page but the data file must
   mark them `"sample": true`) and build them into `previews/_samples/<slug>/`, plus a gallery
   page `previews/_samples/index.html`. These become the studio's portfolio.
8. `sitegen/README.md` with usage.

## Verification
Serve `previews/` locally (e.g. `python -m http.server` from `previews/` in the background, or
`npx serve`) and check your pages: fetch them, validate structure, measure page weights. If you
can take screenshots (e.g. headless Chrome/Edge `--screenshot`), save them to
`previews/_samples/_screens/`.

## Logging & git (see AGENTS.md)
- First action: `python ops/tools/agentlog.py sitegen start "<one-line plan>"`.
- Log every meaningful step, decision and blocker with `agentlog.py` (page weights, scores in
  `--data`); finish with a `done` entry.
- After every meaningful step:
  `python ops/tools/publish_transcript.py sitegen && git add sitegen previews agents/sitegen && git commit -m "sitegen: <what>" -- sitegen previews agents/sitegen && git push origin HEAD:main`
  Never commit anything from `private/` (real businesses' previews stay there).

## Rules
Do not deploy or create accounts. Do not edit files outside your paths and `agents/sitegen/`.

## Done means
The build on `sitegen/samples.json` produces 6 polished previews + gallery. Your worker_done
report lists the commands, page weights, any Lighthouse scores, and screenshot paths.
