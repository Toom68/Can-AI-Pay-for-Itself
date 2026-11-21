#!/usr/bin/env python3
"""Fetch Brisbane-area businesses that have NO website tag from OpenStreetMap.

Queries the Overpass API once per category group over a Greater Brisbane
bounding box, caches every raw response in leads/cache/ (gitignored) and writes
private/leads/raw_candidates.csv (gitignored - contains contact details).

Etiquette: descriptive User-Agent, sleeps between live queries, full cache
reuse on re-runs. Data: (c) OpenStreetMap contributors, ODbL.

Usage:
  python leads/fetch_osm.py            # fetch (or reuse cache) + write CSV
  python leads/fetch_osm.py --refresh  # ignore cache, hit the API again
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
CACHE_DIR = ROOT / "leads" / "cache"
OUT_CSV = ROOT / "private" / "leads" / "raw_candidates.csv"

OVERPASS_ENDPOINTS = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]
USER_AGENT = (
    "CanAIPayForItself-lead-research/0.1 "
    "(student project, low volume; https://github.com/Toom68/Can-AI-Pay-for-Itself)"
)
SLEEP_BETWEEN_QUERIES = 10  # seconds, politeness

# Greater Brisbane: Brisbane City, Logan, Ipswich, Redland, Moreton Bay (south).
BBOX = (-27.98, 152.45, -26.78, 153.62)  # south, west, north, east

WEBSITE_TAGS = ["website", "contact:website", "url", "contact:url"]
PHONE_TAGS = ["phone", "contact:phone", "contact:mobile"]
EMAIL_TAGS = ["email", "contact:email"]
FB_TAGS = ["contact:facebook", "facebook"]

# Category groups from the task spec. Each entry: group -> list of overpass selectors.
TRADES_CRAFT = (
    "plumber|electrician|carpenter|builder|painter|roofer|tiler|gardener|landscaper|"
    "locksmith|plasterer|bricklayer|brick_mason|handyman|hvac|joiner|glaziery|"
    "metal_construction|scaffolder|floorer|window_construction|signmaker|painter_and_decorator|"
    "kitchen_renovation|bathroom_renovation|concreter|fencer|irrigation|plasterer|render"
)
GROUPS = {
    "trades": [
        f'nwr["name"]["craft"~"^({TRADES_CRAFT})$",i]',
        'nwr["name"]["shop"~"^(trade|hardware|building_materials)$",i]',
    ],
    "automotive": [
        'nwr["name"]["shop"~"^(car_repair|car_parts|tyres|motorcycle_repair|car_body)$",i]',
        'nwr["name"]["amenity"="car_wash"]',
    ],
    "beauty": [
        'nwr["name"]["shop"~"^(hairdresser|barber|beauty|nails|cosmetics|tattoo|massage|spa|waxing)$",i]',
        'nwr["name"]["healthcare"~"^(beauty|massage)$",i]',
    ],
    "food": [
        'nwr["name"]["amenity"~"^(cafe|restaurant|fast_food|ice_cream|juice_bar)$",i]',
        'nwr["name"]["shop"~"^(bakery|butcher|deli|greengrocer|seafood|patisserie|confectionery|coffee|pasta)$",i]',
    ],
    "health": [
        'nwr["name"]["healthcare"~"^(physiotherapist|chiropractor|podiatrist|remedial_massage|acupuncture|naturopath|speech_therapist|occupational_therapist|denture|hearing|nutrition_counseling|counselling|psychotherapist)$",i]',
        'nwr["name"]["amenity"="veterinary"]',
        'nwr["name"]["leisure"~"^(fitness_centre|sports_centre)$",i]',
        'nwr["name"]["office"~"^(physiotherapist|chiropractor|massage)$",i]',
    ],
    "retail_services": [
        'nwr["name"]["shop"~"^(florist|bicycle|pet|pet_grooming|tailor|dry_cleaning|laundry|fabric|frame|photo|photography|computer|mobile_phone|shoe_repair|watch_repair|key_cutting|music|musical_instrument|garden_machinery|appliance|trophy|picture_framing|printer_ink|party|balloon|bridal|funeral_directors|sewing|wool|candles|hearing_aids|optician|shoe_store)$",i]',
        'nwr["name"]["craft"~"^(photographer|shoemaker|tailor|watchmaker|upholsterer|jeweller|dressmaker|saddler|key_cutter|print_shop)$",i]',
        'nwr["name"]["office"~"^(cleaning|estate_agent|insurance|accountant|tax_advisor|travel_agent|lawyer|conveyancer)$",i]',
        'nwr["name"]["amenity"~"^(driving_school|music_school|tutoring|photography)$",i]',
    ],
}

# Chain / franchise name fragments -> excluded (we want independent businesses).
CHAIN_RE = re.compile(
    r"(mcdonald|kfc|subway|domino|hungry jack|guzman|zambrero|nando'?s|oporto|red rooster|"
    r"grill'?d|betty'?s burgers|sushi hub|boost juice|chatime|gong ?cha|sharetea|starbucks|"
    r"coffee club|gloria jean|donut king|muffin break|baker'?s delight|brumby'?s|bread top|"
    r"schnitz|crust pizza|pizza hut|eagle boys|la porchetta|motel|7-?eleven|night ?owl|"
    r"ultra ?tune|mymcar|midas|kmart|bridgestone|goodyear|jax ?tyres|bob jane|tyrepower|"
    r"supercheap|repco|autobarn|burson|pedders|tyreplus|beaurepaires|carline|driveway|"
    r"anytime fitness|jetts|snap fitness|goodlife|f45|plus fitness|fernwood|curves|"
    r"world gym|orangetheory|club lime|snap fitness|city gym|fitness first|snap|"
    r"laser clinics|brazilian butterfly|essential beauty|price attack|hairhouse|just cuts|"
    r"petbarn|petstock|pet stock|greencross|best ?friends pets|my ?pet ?warehouse|"
    r"bunnings|officeworks|total tools|sydney tools|toolmart|"
    r"optic ?express|specsavers|opsm|laubman|oscar wylee|1001 optical|"
    r"chemist|pharmacy|priceline|terry ?white|"
    r"guzman|gyg|mad ?mex|fishbowl|noodle box|thai ?express|"
    r"cash converters|loan|hock|pawn|battery world|auto ?one|autopro|opposite lock|\barb\b|"
    r"cartridge world|mister minit|looksmart|zarraffa|the body shop|llewellyn|"
    r"gabba ?goods|veterinary emergency|animal emergency)",
    re.IGNORECASE,
)

# Extra safety net for spec exclusions (should not appear anyway given selectors).
BANNED_RE = re.compile(
    r"(erotic|adult|sex ?shop|strip|escort|casino|bet|gambl|tobacconist|vape|"
    r"cannab|weapons?|gun|rifle|pawn|tattoo removal clinic|government|council|"
    r"primary school|high school|state school|college|kindergarten|child ?care|"
    r"medical centre|doctor|gp clinic|hospital|radiology|pathology|specialist)",
    re.IGNORECASE,
)


def overpass_bbox() -> str:
    s, w, n, e = BBOX
    return f"({s},{w},{n},{e})"


def build_query(group: str) -> str:
    selectors = "".join(sel + overpass_bbox() + ";" for sel in GROUPS[group])
    return f"[out:json][timeout:180];({selectors});out center tags;"


def build_suburb_query() -> str:
    s, w, n, e = BBOX
    return (
        f'[out:json][timeout:120];'
        f'node["place"~"^(suburb|town|village|neighbourhood|locality)$"]({s},{w},{n},{e});'
        f'out tags center;'
    )


def fetch_cached(name: str, query: str, refresh: bool, sleep_s: int) -> dict:
    path = CACHE_DIR / f"{name}.json"
    if path.exists() and not refresh:
        return json.loads(path.read_text(encoding="utf-8"))
    last_err: Exception | None = None
    for endpoint in OVERPASS_ENDPOINTS:
        try:
            resp = requests.post(
                endpoint,
                data={"data": query},
                headers={"User-Agent": USER_AGENT},
                timeout=240,
            )
            if resp.status_code == 429 or resp.status_code >= 500:
                last_err = RuntimeError(f"{endpoint} HTTP {resp.status_code}: {resp.text[:200]}")
                continue
            resp.raise_for_status()
            data = resp.json()
            path.write_text(json.dumps(data), encoding="utf-8")
            time.sleep(sleep_s)
            return data
        except requests.RequestException as e:  # noqa: PERF203
            last_err = e
    raise RuntimeError(f"all Overpass endpoints failed for '{name}': {last_err}")


def first_tag(tags: dict, keys: list[str]) -> str:
    for k in keys:
        v = tags.get(k)
        if v:
            return str(v).strip()
    return ""


def category_of(tags: dict, group: str) -> str:
    for k in ("craft", "shop", "amenity", "healthcare", "leisure", "office"):
        if tags.get(k):
            return f"{group}:{tags[k]}"
    return group


def address_of(tags: dict) -> str:
    parts = []
    hn = tags.get("addr:housenumber")
    street = tags.get("addr:street")
    if street:
        parts.append(f"{hn} {street}".strip() if hn else str(street))
    pc = tags.get("addr:postcode")
    if pc:
        parts.append(str(pc))
    return ", ".join(parts)


def haversine_km(lat1, lon1, lat2, lon2) -> float:
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = math.radians(lat2 - lat1), math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def nearest_suburb(lat: float, lon: float, suburbs: list[tuple[str, float, float]]) -> str:
    best, best_d = "", float("inf")
    for name, slat, slon in suburbs:
        d = haversine_km(lat, lon, slat, slon)
        if d < best_d:
            best, best_d = name, d
    return best if best_d <= 12 else ""  # beyond ~12km: probably outside metro fringe


def norm_name(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", name.lower())


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--refresh", action="store_true", help="re-query the API ignoring cache")
    ap.add_argument("--sleep", type=int, default=SLEEP_BETWEEN_QUERIES)
    args = ap.parse_args()

    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    OUT_CSV.parent.mkdir(parents=True, exist_ok=True)

    # Suburb centroids for backfilling missing addr:suburb.
    suburb_data = fetch_cached("suburbs", build_suburb_query(), args.refresh, args.sleep)
    suburbs = []
    for el in suburb_data.get("elements", []):
        n = el.get("tags", {}).get("name")
        if n:
            suburbs.append((n, el["lat"], el["lon"]))
    print(f"{len(suburbs)} suburb/locality centroids")

    rows: list[dict] = []
    seen: dict[tuple, int] = {}  # (norm_name, rounded cell) -> index
    stats = {"fetched": 0, "kept": 0, "website_tag": 0, "chain": 0, "banned": 0, "dup": 0, "unnamed": 0}

    for group in GROUPS:
        data = fetch_cached(group, build_query(group), args.refresh, args.sleep)
        elements = data.get("elements", [])
        stats["fetched"] += len(elements)
        kept_before = stats["kept"]
        for el in elements:
            tags = el.get("tags", {})
            name = str(tags.get("name", "")).strip()
            if not name:
                stats["unnamed"] += 1
                continue
            if any(tags.get(t) for t in WEBSITE_TAGS):
                stats["website_tag"] += 1
                continue
            brand = str(tags.get("brand", ""))
            if CHAIN_RE.search(name) or (brand and CHAIN_RE.search(brand)):
                stats["chain"] += 1
                continue
            if BANNED_RE.search(name):
                stats["banned"] += 1
                continue
            lat = el.get("lat") or el.get("center", {}).get("lat")
            lon = el.get("lon") or el.get("center", {}).get("lon")
            if lat is None or lon is None:
                continue
            suburb = str(tags.get("addr:suburb") or tags.get("addr:city") or "").strip()
            if not suburb:
                suburb = nearest_suburb(lat, lon, suburbs)
            nn = norm_name(name)
            # dedup: same normalised name within ~250 m
            dup = False
            for (sn, slat, slon), _idx in seen.items():
                if sn == nn and haversine_km(lat, lon, slat, slon) < 0.25:
                    dup = True
                    break
            if dup:
                stats["dup"] += 1
                continue
            seen[(nn, lat, lon)] = len(rows)
            rows.append(
                {
                    "osm_id": f"{el['type']}/{el['id']}",
                    "name": name,
                    "category": category_of(tags, group),
                    "suburb": suburb,
                    "address": address_of(tags),
                    "phone": first_tag(tags, PHONE_TAGS),
                    "email": first_tag(tags, EMAIL_TAGS),
                    "facebook": first_tag(tags, FB_TAGS),
                    "opening_hours": tags.get("opening_hours", ""),
                    "lat": f"{lat:.6f}",
                    "lon": f"{lon:.6f}",
                }
            )
            stats["kept"] += 1
        print(f"{group}: {len(elements)} fetched -> {stats['kept'] - kept_before} kept")

    rows.sort(key=lambda r: (r["category"], r["suburb"], r["name"]))
    with OUT_CSV.open("w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(
            f,
            fieldnames=[
                "osm_id", "name", "category", "suburb", "address", "phone", "email",
                "facebook", "opening_hours", "lat", "lon",
            ],
        )
        w.writeheader()
        w.writerows(rows)

    summary = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        **stats,
        "rows": len(rows),
        "with_phone": sum(1 for r in rows if r["phone"]),
        "with_email": sum(1 for r in rows if r["email"]),
        "with_facebook": sum(1 for r in rows if r["facebook"]),
    }
    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
