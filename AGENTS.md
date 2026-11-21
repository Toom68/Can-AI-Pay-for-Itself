# Can AI Pay for Itself? — operating manual (read this first, every agent)

This repo is **PUBLIC**: https://github.com/Toom68/Can-AI-Pay-for-Itself. It houses the full
logs of the experiment. Everything committed here is visible to anyone, so read the
"Public repo / private data" rules below before writing any file.

## Mission
Earn at least **US$200 (~A$310) in cash by 2026-12-21** for Thomas (Brisbane, under 18, parents
have consented) using Devin agents, with ~A$0 startup cost. Internal target: **A$400**.

## Business lines
1. **Local web studio (primary, money engine).** Find Brisbane-area small businesses with no
   website (or a clearly broken/outdated one), build each a free, polished preview site, and
   have Thomas send a short personalised email (~5-10/day, sent by hand). Price ~A$249 per site
   incl. setup; optional small monthly care plan. Two clients = target met.
2. **Hands-off products (secondary, background).** Small paid digital products/tools listed on
   marketplaces that already have buyers. Runs without Thomas. Low odds this month; must not
   steal effort from line 1.

## Hard rules (apply to every agent, no exceptions)
- **No spending money.** Anything that costs money (domains, fees, paid APIs, paid models)
  needs Thomas's explicit OK via the coordinator.
- **Workers use free models only:** `devin --model swe-2-max` or `swe-2-flash-max`.
- **No external side effects by workers.** Do not send emails/DMs, post anywhere,
  deploy/publish sites, create accounts, or open issues/PRs on other people's repos. Workers
  produce files; the coordinator reviews and does anything external. Pushing to THIS repo is
  allowed (see Git protocol).
- **Honesty.** No fake reviews, testimonials, client logos, awards, licences, years in
  business or other invented claims. Preview sites only use facts from public sources (or
  obvious placeholders) and are clearly labelled as an unsolicited preview.
- **Spam Act 2003 (Australia).** Only email addresses the business itself publishes publicly
  (record the source URL), message must be relevant to their business, identify the sender,
  include a working opt-out, honour opt-outs immediately (`private/optouts.csv`), low volume,
  sent manually by Thomas. Never contact anyone in the opt-out list.
- **Data sourcing.** Prefer OpenStreetMap (Overpass API, ODbL, attribute it) and ordinary web
  search at low volume. Do not scrape sites whose terms forbid it (Google Maps, Yellow Pages,
  Facebook, Instagram, LinkedIn). Cache results; be polite to APIs.

## Public repo / private data
- `private/` is gitignored and never leaves this machine. Put there anything containing
  prospects' contact details or outreach state: lead lists with emails/phones, real-business
  preview sites, outreach logs, opt-outs, raw transcripts.
- Public files may contain: code, templates, sample (fictional) sites, research, plans,
  aggregate numbers (counts by category/suburb), and redacted logs/transcripts.
- Never commit: prospects' emails or phone numbers, secrets/tokens, Thomas's personal details
  (school, home address, personal email, exact age, bank details).

## Logs (JSON, one folder per agent)
- `agents/<name>/log.json`: your running work log. Append entries ONLY via
  `python ops/tools/agentlog.py <name> <kind> "<message>" [--data '<json object>']`
  where kind is start | progress | decision | result | blocker | done | note. Log at start,
  after every meaningful step (what you did, why, numbers), every decision, every blocker, and
  at the end. Put numbers and file paths in `--data`.
- `agents/<name>/transcript.json`: your full conversation (Devin `--export`, ATIF JSON),
  redacted. Workers are launched with `--export private/transcripts/<name>.json`; publish it with
  `python ops/tools/publish_transcript.py <name>` before committing (the export updates when a
  turn ends, so it may lag; the coordinator republishes after you finish).

## Git protocol (every worker commits and pushes its own work + logs)
Several workers share ONE worktree and ONE local branch, which pushes to `main`. Follow exactly:
- Commit early and often (after every meaningful step, and before reporting done).
- Commit ONLY your own paths, listing them after `--` so other workers' staged files are never
  swept into your commit:
  `git add <your paths> agents/<name> && git commit -m "<name>: <what and why>" -- <your paths> agents/<name>`
- Push with exactly: `git push origin HEAD:main`
- Never `git add -A`, `git add .`, `git commit -a`, force-push, rebase, reset, or rewrite history.
- If git reports `index.lock`, "cannot lock ref", or a rejected push, another worker is
  mid-operation: wait 10 seconds and retry (up to 5 times). Never delete lock files.
- Before committing, check `git diff --cached --stat -- <your paths>` and make sure nothing from
  `private/`, no secrets and no prospect contact details are included.

## Payments / legal (current position)
- Clients pay by bank transfer / PayID into Thomas's bank account (parents consented).
- Thomas is under 18: for payments of A$350/week or less per payer, he supplies the ATO
  "Statement by a supplier" so the client does not have to withhold 47% for a missing ABN.
- Trading under a brand name (not exactly his own first name + surname) requires ASIC
  business-name registration (~A$44/yr, needs a free ABN). **Decision pending before the first
  invoice**; until then quotes/invoices go out in Thomas's own name. Building under a working
  brand is fine.
- Marketplace payouts (Gumroad/Stripe/Apify etc.) need an 18+ account holder: a parent owns them.

## Repo layout
- `agents/<name>/`  per-agent `log.json` + redacted `transcript.json`
- `leads/`          lead pipeline code + public aggregate `summary.json` (contacts live in `private/leads/`)
- `sitegen/`        preview-site generator (templates + build script)
- `previews/_samples/` fictional sample sites (portfolio); real previews live in `private/previews/`
- `brand/`          brand name research, brand kit
- `studio-site/`    the studio's own website (pricing, portfolio, contact)
- `sales/`          outreach email templates, reply playbook, quote/invoice/agreement templates
- `products/`       hands-off product research and builds
- `ops/`            `STATE.md` (live status), `specs/` (worker task specs), `tools/`
- `private/`        gitignored: contacts, real previews, outreach, opt-outs, raw transcripts

## Resume protocol
- **"turning on"**: read `ops/STATE.md`, then `orca orchestration run-list` / `worker-list` and
  resume the "Next actions" list. Re-launch stopped workers from `ops/specs/`.
- **"shutting off"**: publish transcripts (`python ops/tools/publish_transcript.py --all`),
  update `ops/STATE.md`, commit and push, and let workers settle or stop them cleanly.

## Verification
- Static sites: serve locally, check 375px and 1280px widths, no console errors, links work.
- Scripts: run end-to-end on a small sample and show the output.
