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
- outreach worker (task_87853c5a4bd8, terminal term_4e08457c...) was mid-task: brand applied,
  previews rebuilt (39 after dropping Pure Shot Cafe, renamed), screenshots in progress, batch-01
  drafts not yet written. If the PC was turned off it died; its files are in `private/outreach/`.
- All other workers finished. Nothing is waiting on a worker prompt.

## Next actions (coordinator) — on "turning on"
1. `orca orchestration check --run run_fe71059351c2` and `orca orchestration worker-list`.
2. If outreach didn't report worker_done: check `private/outreach/` for `batch-01.md/json`,
   `log.csv`, `shots/`; relaunch with `bash ops/tools/launch_worker.sh outreach` and tell it to
   resume (skip steps already done).
3. Review batch-01 drafts, then hand them to Thomas to send (max 10/day).
4. When Thomas finishes cadence changes: rebuild + refresh listing (see Decisions).
5. When GitHub's restriction lifts: org `brissiesites` + Pages hosting for live previews.
6. Council review of the plan (free models).

## Token burn
<!-- tokens:start -->
_Updated 2026-11-21T18:47:35+10:00 by `python ops/tools/token_report.py` (JSON: `ops/tokens.json`)._

| Agent | Model(s) | Calls | Input | Cached input | Output | Quota cost (US$) |
|-------|----------|------:|------:|-------------:|-------:|-----------------:|
| brand | swe-2-max (free) | 132 | 418k | 8.42M | 93k | 0.00 |
| coordinator | claude-opus-5-5-xhigh | 301 | 1.22M | 68.10M | 291k | 24.31 |
| leads | swe-2-max (free), compactor | 118 | 922k | 10.46M | 111k | 0.00 |
| outreach | swe-2-max (free) | 69 | 169k | 6.23M | 97k | 0.00 |
| products | swe-2-max (free) | 131 | 215k | 13.76M | 124k | 0.00 |
| sitegen | swe-2-max (free) | 155 | 421k | 14.53M | 139k | 0.00 |
| **Total** | | 906 | 3.36M | 121.51M | 856k | **24.31** |
<!-- tokens:end -->
