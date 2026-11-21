#!/usr/bin/env python3
"""Join enrichment records with raw OSM candidates and emit final lead CSVs
(private) plus the public aggregate leads/summary.json.

Contains data © OpenStreetMap contributors, ODbL.
"""
import csv, json, re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "private" / "leads" / "raw_candidates.csv"
ENRICH = ROOT / "private" / "leads" / "enrichment.jsonl"
LEADS = ROOT / "private" / "leads" / "leads.csv"
PHONE_ONLY = ROOT / "private" / "leads" / "phone_only.csv"
SUMMARY = ROOT / "leads" / "summary.json"

FINAL_COLS = ["slug", "name", "category", "suburb", "address", "phone", "email",
              "email_source_url", "facebook_url", "website_status", "website_url",
              "opening_hours", "services", "personalisation_notes", "score", "osm_id"]
QUALIFIED = {"none", "broken", "facebook_only"}
HIGH_VALUE = ("trades", "automotive", "beauty", "health")


def norm(s: str) -> str:
    return re.sub(r"[^a-z0-9]", "", s.lower())


def slugify(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s or "lead"


def main() -> None:
    raw = list(csv.DictReader(RAW.open(newline="", encoding="utf-8")))
    enrich = [json.loads(l) for l in ENRICH.open(encoding="utf-8") if l.strip()]

    used = set()
    leads, phone_only, checked = [], [], 0
    for e in enrich:
        checked += 1
        en = norm(e["name"])
        best, best_len = None, 0
        for r in raw:
            rn = norm(r["name"])
            if en and (en in rn or rn in en) and len(rn) > best_len:
                if en[:6] == rn[:6] or en in rn or rn in en:
                    best, best_len = r, len(rn)
        if best is not None:
            used.add(best["osm_id"])

        status = e.get("website_status", "none")
        email = (e.get("email") or "").strip()
        if status not in QUALIFIED:
            continue  # dropped/has_site/closed records were checked but aren't leads
        if status in QUALIFIED and not email:
            target = phone_only
        else:
            target = leads

        r = best or {}
        cat = r.get("category", "")
        group = cat.split(":")[0]
        score = 3
        if email:
            score += 2
        if r.get("phone"):
            score += 1
        if e.get("website_url") and "facebook" in e["website_url"]:
            score += 1
        if status == "broken":
            score += 1
        if group in HIGH_VALUE:
            score += 1
        score = min(10, score)

        esu = (e.get("email_source_url") or "").strip()
        osm_id = r.get("osm_id", "")
        if esu.startswith("https://www.openstreetmap.org") and osm_id:
            esu = f"https://www.openstreetmap.org/{osm_id}"

        row = {
            "slug": slugify(e["name"]),
            "name": e["name"],
            "category": cat or "unknown",
            "suburb": e.get("suburb") or r.get("suburb", ""),
            "address": r.get("address", ""),
            "phone": r.get("phone", ""),
            "email": email,
            "email_source_url": esu,
            "facebook_url": r.get("facebook", "") or (
                e["website_url"] if "facebook" in e.get("website_url", "") else ""),
            "website_status": status,
            "website_url": e.get("website_url", ""),
            "opening_hours": r.get("opening_hours", ""),
            "services": e.get("services", ""),
            "personalisation_notes": e.get("notes", ""),
            "score": score,
            "osm_id": osm_id,
        }
        target.append(row)

    leads.sort(key=lambda x: (-x["score"], x["name"]))
    for t, path in ((leads, LEADS), (phone_only, PHONE_ONLY)):
        with path.open("w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=FINAL_COLS)
            w.writeheader()
            w.writerows(t)

    def grp(c): return c.split(":")[0] if c else "unknown"
    summary = {
        "generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "totals": {
            "fetched": 9454,
            "candidates_without_website_tag": len(raw),
            "checked": checked,
            "qualified": len(leads),
            "phone_only": len(phone_only),
        },
        "qualified_by_category": dict(Counter(grp(r["category"]) for r in leads)),
        "qualified_by_suburb": dict(Counter(r["suburb"] for r in leads).most_common()),
        "qualified_by_website_status": dict(Counter(r["website_status"] for r in leads)),
        "score_histogram": {str(i): sum(1 for r in leads if r["score"] == i)
                            for i in range(1, 11)},
        "attribution": "Contains data © OpenStreetMap contributors, ODbL",
    }
    SUMMARY.write_text(json.dumps(summary, indent=2, ensure_ascii=False) + "\n",
                       encoding="utf-8")
    print(f"checked={checked} qualified={len(leads)} phone_only={len(phone_only)}")
    print(f"by_status={summary['qualified_by_website_status']}")
    print(f"by_cat={summary['qualified_by_category']}")


if __name__ == "__main__":
    main()
