# Brisbane lead engine

Finds small businesses in Greater Brisbane that have **no website** (or a clearly
broken/Facebook-only presence) but **do** publish a business email publicly, so
Thomas can offer them a website.

## Layout

- `fetch_osm.py` — queries the Overpass API for named businesses with no
  `website`, `contact:website` or `url` tag, one query per category group
  (trades, automotive, beauty, food, health, retail/services), with a
  descriptive User-Agent and a sleep between queries. Raw responses are cached
  in `leads/cache/` (gitignored) and reused on re-runs; pass `--refresh` to
  re-query. Output: `private/leads/raw_candidates.csv` (gitignored).
- `enrich_queue.py` — builds `private/leads/enrich_queue.csv`: the subset of raw
  candidates that have a phone, email or Facebook link, prioritised by
  category.
- `build_outputs.py` — joins `private/leads/enrichment.jsonl` (manual web-search
  notes, one record per business checked) with the raw candidates and emits:
  - `private/leads/leads.csv` — scored qualified leads (verified public email +
    `website_status` in `none | broken | facebook_only`), sorted by score desc.
  - `private/leads/phone_only.csv` — good leads with no public email found.
  - `leads/summary.json` — public aggregate stats (no names/contacts).

## Re-running

```sh
python leads/fetch_osm.py          # uses cache; --refresh to hit Overpass again
python leads/enrich_queue.py       # rebuild the prioritisation queue
python leads/build_outputs.py      # regenerate CSVs + summary.json
```

Enrichment is manual: for each queued candidate, run one web search, record
`website_status`, a publicly-published business email plus the URL where it
appears, services and a personalisation note, and append the record to
`private/leads/enrichment.jsonl`. Never guess emails. Chains, government,
schools, medical specialists and adult/gambling/weapons/vape businesses are
excluded, as is anything in `private/optouts.csv`.

## Data sources

- OpenStreetMap via the Overpass API (business names, categories, addresses,
  phones, opening hours, coordinates).
- Ordinary web search at low volume (~1 query/business) for website-status and
  publicly listed emails (directories such as cylex/exa/lovemycafe, the
  business's own Facebook/about snippets as shown in search results).

Contains data © OpenStreetMap contributors, ODbL
