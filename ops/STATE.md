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

## Waiting on Thomas
- [ ] Pick the brand: Brissie Sites / Jacaranda Web / Bunya Web.
- [ ] Confirm target currency (assumed US$200 = ~A$310).
- [ ] Coordinator cost: switch this session to `/model swe-2-max` for routine supervision?
- [ ] Approve installing the Rust toolchain (for cadence builds)?
- [ ] Parent: free itch.io account + PayPal ("Direct to you") to list Pocket Chip Kit.
- [ ] Once the brand is picked: create brand Gmail + GitHub org (free, ~5 min) for outreach
      and preview hosting.
- [ ] Before the first invoice: register the brand name (~A$44/yr + free ABN) or invoice in
      own name.

## Next actions (coordinator)
1. Apply the brand to `sitegen/config.json` + studio site; rebuild the 40 previews.
2. Host previews publicly (brand GitHub org + Pages, noindex), deploy studio site.
3. Draft the first 10 personalised emails (`private/outreach/`) for Thomas to send.
4. Council review of the plan (free models).

## Token burn
<!-- tokens:start -->
_Updated 2026-11-21T18:19:56+10:00 by `python ops/tools/token_report.py` (JSON: `ops/tokens.json`)._

| Agent | Model(s) | Calls | Input | Cached input | Output | Quota cost (US$) |
|-------|----------|------:|------:|-------------:|-------:|-----------------:|
| brand | swe-2-max (free) | 132 | 418k | 8.42M | 93k | 0.00 |
| coordinator | claude-opus-5-5-xhigh | 227 | 570k | 45.41M | 241k | 16.17 |
| leads | swe-2-max (free), compactor | 118 | 922k | 10.46M | 111k | 0.00 |
| products | swe-2-max (free) | 69 | 167k | 5.39M | 92k | 0.00 |
| sitegen | swe-2-max (free) | 155 | 421k | 14.53M | 139k | 0.00 |
| **Total** | | 701 | 2.50M | 84.22M | 676k | **16.17** |
<!-- tokens:end -->
