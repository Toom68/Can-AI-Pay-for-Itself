# Task: Brisbane lead engine (agent name: leads)

Workspace: C:\Users\tomy\orca\workspaces\200inamonth\sevengill
Read `AGENTS.md` first; its hard rules override anything here. This repo is PUBLIC.

## Goal
Produce a list of Brisbane-area small businesses that have NO website (or a clearly broken one)
and DO publicly list a business email, so Thomas can offer them a website.

## Deliverables
Your paths: `leads/` (public: code, README, aggregate summary) and `private/leads/` (gitignored:
anything with names + contact details).
1. `leads/fetch_osm.py` (Python 3.13; stdlib, or `requests` if already installed): query the
   Overpass API for named businesses in Greater Brisbane (Brisbane City first; Moreton Bay,
   Logan, Redland, Ipswich optional) that have NO `website`, `contact:website` or `url` tag.
   Category groups with high website value:
   - trades: craft=* (plumber, electrician, carpenter, builder, painter, roofer, tiler,
     gardener/landscaper, locksmith), shop=trade
   - automotive: shop=car_repair, shop=tyres, car_wash
   - beauty: shop=hairdresser, beauty, nails/cosmetics, massage, tattoo, barber
   - food: amenity=cafe, restaurant, fast_food (independent only), shop=bakery, butcher, deli
   - health/wellness: physiotherapist, chiropractor, massage, veterinary, gym (independent)
   - retail/services: florist, bicycle, pet, pet_grooming, tailor, dry_cleaning, laundry,
     photographer, cleaning, computer repair, mobile phone repair
   Etiquette: descriptive User-Agent, one query per group, sleep between queries, cache every
   raw response in `leads/cache/` (gitignored) and reuse the cache on re-runs.
2. `private/leads/raw_candidates.csv`: osm_id, name, category, suburb, address, phone, email (if
   in OSM), facebook (if in OSM), opening_hours, lat, lon.
3. Enrichment, done by you with your web search tool at low volume (about one search per
   business). Prioritise candidates that have a phone or email in OSM, are independent, and are
   in trades/beauty/automotive/cafes. For each, record:
   - `website_status`: none | broken | facebook_only | has_site. Drop `has_site` unless the
     site is clearly broken or abandoned (note why).
   - A public business email AND the URL where the business itself publishes it (their own
     page, a directory listing they control, their social "About" text as shown in search
     results). Do not fetch facebook.com/instagram.com pages directly; rely on search results
     and other public pages. Never guess emails (no "info@" guessing).
   - services/specialties and short personalisation notes, only from what is publicly stated.
4. `private/leads/leads.csv`, the final scored list, columns:
   `slug,name,category,suburb,address,phone,email,email_source_url,facebook_url,website_status,website_url,opening_hours,services,personalisation_notes,score,osm_id`
   `score` (1-10) = likelihood they would pay A$249 for a site (independent, active,
   customer-facing, has a phone/FB presence, no site). Sort by score descending.
   Target: at least 40 rows with a verified public email AND website_status in
   {none, broken, facebook_only}. Good phone-only leads go in `private/leads/phone_only.csv`
   (same columns).
5. `leads/summary.json` (public, NO names/emails/phones/addresses): totals fetched/checked/
   qualified, counts by category, suburb and website_status, score histogram, generated_at.
6. `leads/README.md`: how to re-run, data sources, and the attribution line
   "Contains data © OpenStreetMap contributors, ODbL".
7. Exclude: chains/franchises, government, schools, medical specialists, anything
   adult/gambling/weapons/cannabis/vape, and anything listed in `private/optouts.csv`.

## Logging & git (see AGENTS.md)
- First action: `python ops/tools/agentlog.py leads start "<one-line plan>"`.
- Log every meaningful step, decision and blocker with `agentlog.py` (counts in `--data`);
  finish with a `done` entry.
- After every meaningful step:
  `python ops/tools/publish_transcript.py leads && git add leads agents/leads && git commit -m "leads: <what>" -- leads agents/leads && git push origin HEAD:main`
  Never commit anything from `private/`.

## Rules
- Do not contact any business. Do not scrape Google Maps, Yellow Pages, Facebook, Instagram.
- No deploying or account creation. Do not edit files outside your paths and `agents/leads/`.

## Done means
`private/leads/leads.csv` has at least 40 qualifying rows (or you explain with numbers why
fewer), the script re-runs end-to-end from cache, `leads/summary.json` is committed and pushed,
and your worker_done report includes counts per category, how many candidates you checked, and
the top 10 leads (name, suburb, category, why; no contact details).
