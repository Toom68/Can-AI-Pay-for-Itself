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
- Workers (free model swe-2-max, smart permission mode, transcripts exported as JSON):
  leads, sitegen, brand, products.

## Waiting on Thomas
- [ ] Confirm target currency (assumed US$200 = ~A$310).
- [ ] Once the brand is picked: create a brand Gmail (5 min) for outreach.
- [ ] Before the first invoice: register the brand name (~A$44/yr + free ABN) or invoice in
      own name.

## Next actions (coordinator)
1. Review worker outputs as they finish; republish transcripts and push.
2. Council review of the plan (free models).
3. Pick the brand, build the first 5 real previews, draft the first 5 emails for Thomas.
4. Decide where real previews are hosted publicly (brand GitHub org + Pages, or similar).

## Token burn
<!-- tokens:start -->
_Updated 2026-11-21T18:14:06+10:00 by `python ops/tools/token_report.py` (JSON: `ops/tokens.json`)._

| Agent | Model(s) | Calls | Input | Cached input | Output | Quota cost (US$) |
|-------|----------|------:|------:|-------------:|-------:|-----------------:|
| brand | swe-2-max (free) | 115 | 413k | 6.60M | 85k | 0.00 |
| coordinator | claude-opus-5-5-xhigh | 177 | 511k | 31.45M | 221k | 12.74 |
| leads | swe-2-max (free), compactor | 118 | 922k | 10.46M | 111k | 0.00 |
| products | swe-2-max (free) | 39 | 152k | 2.18M | 59k | 0.00 |
| sitegen | swe-2-max (free) | 80 | 337k | 5.52M | 107k | 0.00 |
| **Total** | | 529 | 2.33M | 56.21M | 583k | **12.74** |
<!-- tokens:end -->
