# Task: Hands-off product research + first build (agent name: products)

Workspace: C:\Users\tomy\orca\workspaces\200inamonth\sevengill
Read `AGENTS.md` first; its hard rules override anything here. This repo is PUBLIC.

## Context
Secondary business line: small paid digital products that sell without Thomas doing any
marketing, via marketplaces that already have buyer traffic. Constraints:
- A$0 upfront. Anything with a fee (e.g. Chrome Web Store developer fee, Etsy listing fees)
  must be flagged with the exact amount, never paid.
- Payout account is owned by a parent (18+, Australia). Payout ideally within ~30 days of a
  sale; the cash deadline is 2026-12-21. Note anything that pays later.
- Built and maintained by AI agents on free models; no ToS violations; no spam marketing;
  honest listings.

Thomas's existing public repos (github.com/Toom68) may be monetisable assets: e.g. `cadence`
(native Rust music sequencer for macOS/Windows), `afterglow-ios`, `People-in-perspective`,
`multiagentcouncil-orca`, `translink-but-better`. Inspect them read-only (`gh repo view`, read
READMEs and licences); do not modify those repos.

## Deliverables (only create/edit files inside `products/`)
1. `products/research.md`: evaluate at least 8 channels/product ideas with evidence (links,
   numbers where findable). Include at least: Apify Store actors (pay-per-event; payouts are
   monthly around the 21st-25th of the following month, KYC, US$20 minimum via PayPal/Wise),
   Gumroad / Lemon Squeezy / Payhip digital products (e.g. website templates for Aussie
   tradies reusing our preview-site themes in `sitegen/`), itch.io (e.g. paid builds of
   `cadence`, check its licence), VS Code or Chrome extensions with a paid tier, Notion
   templates, Framer/Webflow templates, Etsy digital downloads, n8n/Make templates, plus
   anything better you find. For each: built-in traffic, realistic time to first sale, payout
   timing, fees, age/KYC constraints (parent-owned is fine), build effort, competition, and an
   honest probability of at least A$50 by 2026-12-21.
2. Rank them and pick the top 1-2. Write `products/plan.md`: exact build + listing plan,
   listing copy, pricing, and what a parent/coordinator must do (accounts, fees, KYC).
3. Build the top pick inside `products/<name>/` to a "ready to list" state (no publishing, no
   account creation): working product, listing copy, cover/screenshots if feasible
   (SVG/HTML-rendered), and a test or demo that proves it works.

## Logging & git (see AGENTS.md)
- First action: `python ops/tools/agentlog.py products start "<one-line plan>"`.
- Log every meaningful step, decision and blocker with `agentlog.py` (evidence links and
  numbers in `--data`); finish with a `done` entry.
- After every meaningful step:
  `python ops/tools/publish_transcript.py products && git add products agents/products && git commit -m "products: <what>" -- products agents/products && git push origin HEAD:main`

## Rules
No accounts, listings or purchases; contact nobody. Do not edit outside `products/` and
`agents/products/`.

## Done means
research.md with at least 8 evaluated options and evidence; plan.md; top pick built to
ready-to-list with proof it works. Your worker_done report: the top pick, its expected value
this month, and exactly what the coordinator/parent must do to list it.
