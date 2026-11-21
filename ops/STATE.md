# Live state

Last updated: 2026-11-21 (session 1)
Deadline: 2026-12-21 | Target: US$200 (~A$310), internal A$400

## Money tracker
| Date | Source | Amount | Status |
|------|--------|--------|--------|
| - | - | A$0 | - |

## Status
- Session 1: strategy agreed with Thomas (both business lines, new brand name, ~30 min/day
  baseline, parents consented, client payments by bank transfer to Thomas's account).
- Repo: public https://github.com/Toom68/Can-AI-Pay-for-Itself (branch `main`). Every agent
  commits its work + JSON logs; prospects' contact data stays in gitignored `private/`.
- Round 1 workers (free model swe-2-max) all finished:
  - leads: 40 qualified leads (verified public email, no/broken/FB-only site) + 18 phone-only,
    in `private/leads/`; public aggregate in `leads/summary.json`.
  - sitegen: zero-dep generator, 6 themes, samples + gallery in `previews/_samples/`;
    Lighthouse 100/100/100/100 on sold builds. All 40 real previews built to
    `private/previews/` (avg 16.7 KB) with placeholder brand config.
  - brand: recommends **Brissie Sites** (alternates Jacaranda Web, Bunya Web); studio site in
    `studio-site/`; full sales kit in `sales/`.
  - products: **Pocket Chip Kit** chiptune pack (82 WAV + 12 MIDI) ready to list on itch.io;
    worker's odds of meaningful sales this month ~7-12%. cadence paid build needs Rust.

## Decisions made
- 2026-11-21: target confirmed **US$200 (A$310)**. Rust toolchain install approved (for cadence
  builds). Thomas sets up itch.io himself (payouts must go to a parent's PayPal: 18+).

- 2026-11-21: brand **Brissie Sites**, email **brissiesites@gmail.com** (working). itch.io
  account created (payments not yet). GitHub flagged Thomas's network for automated activity:
  GitHub org on hold; agents push once per task only. First emails use **screenshots** of each
  preview; live previews are hosted only for businesses that reply.

- 2026-11-21: cadence 1.1.0 Windows build + listing ready (`products/cadence/`), but **on hold**:
  Thomas is improving cadence first. When he's done: re-clone into `private/cadence`, rebuild
  with the repo's `windows-package.ps1`, smoke-test, refresh the zip/screenshot/LISTING.md.

## Waiting on Thomas
- [ ] Finish cadence changes, then tell the coordinator to rebuild + list it.
- [ ] itch.io payments: link a parent's PayPal for "Direct to you" payouts.
- [ ] GitHub org `brissiesites` once the restriction lifts (for hosting live previews).
- [ ] Send outreach batch 01 (10 emails) when the drafts are ready.
- [ ] Coordinator cost: switch this session to `/model swe-2-max` for routine supervision?
- [ ] Before the first invoice: register the brand name (~A$44/yr + free ABN) or invoice in
      own name.

## Shutdown snapshot (2026-11-21, "shut off, temporarily")
- outreach worker FINISHED while Thomas was away: Brissie Sites branding applied, 39 previews
  QA'd (Pure Shot Cafe dropped: renamed), phone + desktop screenshots for all, batch-01 = 10
  drafts in `private/outreach/batch-01.md` (+ .json, `log.csv`, `sales/sending_guide.md`).
- Coordinator review of batch-01: all 10 have sender ID, source line, opt-out, ~95-100 words.
  **6 ready to send** (sources: Cylex listing / OpenStreetMap): Diateq, Jack's Barber, SAKAZ
  Customs, Monster Tyres, Rami's Thunder Martial Arts, Mana Souvlaki.
  **4 on hold** (email only found via exa.ai, an aggregator, not published by the business):
  Brookfield Hair Studio, Mayfair Nails, Stafford Tattoo, Aloha Hound. Send only after
  confirming the address on the business's own Facebook/Google/Instagram page, and change the
  "I found your email on..." line to that page.
- No workers running.

## Next actions (coordinator) — on "turning on"
1. `orca orchestration check --run run_fe71059351c2` and `orca orchestration worker-list`.
2. Thomas sends the 6 ready emails (max 10/day) and marks `private/outreach/log.csv`.
3. Confirm/fix the 4 held emails (Thomas checks the businesses' own pages in his browser).
4. When Thomas finishes cadence changes: rebuild + refresh listing (see Decisions).
5. When GitHub's restriction lifts: org `brissiesites` + Pages hosting for live previews.
6. Council review of the plan (free models).

## Token burn
<!-- tokens:start -->
_Updated 2026-11-21T19:02:12+10:00 by `python ops/tools/token_report.py` (JSON: `ops/tokens.json`)._

| Agent | Model(s) | Calls | Input | Cached input | Output | Quota cost (US$) |
|-------|----------|------:|------:|-------------:|-------:|-----------------:|
| brand | swe-2-max (free) | 132 | 418k | 8.42M | 93k | 0.00 |
| coordinator | claude-opus-5-5-xhigh | 343 | 1.25M | 82.35M | 305k | 27.57 |
| leads | swe-2-max (free), compactor | 118 | 922k | 10.46M | 111k | 0.00 |
| outreach | swe-2-max (free) | 187 | 461k | 23.32M | 181k | 0.00 |
| products | swe-2-max (free) | 131 | 215k | 13.76M | 124k | 0.00 |
| sitegen | swe-2-max (free) | 155 | 421k | 14.53M | 139k | 0.00 |
| **Total** | | 1066 | 3.69M | 152.85M | 952k | **27.57** |
<!-- tokens:end -->
