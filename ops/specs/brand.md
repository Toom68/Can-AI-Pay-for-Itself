# Task: Brand, studio website and sales kit (agent name: brand)

Workspace: C:\Users\tomy\orca\workspaces\200inamonth\sevengill
Read `AGENTS.md` first; its hard rules override anything here. This repo is PUBLIC.

## Context
Thomas (Brisbane, student) runs a small web studio with AI-assisted production. Clients are
local Brisbane small businesses (tradies, cafes, salons, mechanics...). The offer: we build a
polished one-page website BEFORE contacting them (a free preview), and they can have it for
about A$249 one-off, including setup and connecting their own domain; hosting is free (static);
optional A$15/month care plan for edits. Payment by bank transfer/PayID. He is under 18:
honest framing as a "Brisbane student-run web studio" is allowed and can be a strength, but do
NOT state his age, school or full name in public-facing artifacts.

## Deliverables (only create/edit files inside `brand/`, `studio-site/`, `sales/`)
1. `brand/names.md`: 8 candidate brand names (short, memorable, works as a Gmail handle and a
   GitHub org name; Brisbane/Queensland flavour optional). For each, check and record evidence:
   - GitHub availability: `gh api users/<name>` (HTTP 404 means available).
   - Domains: `curl -s -o /dev/null -w "%{http_code}" https://rdap.org/domain/<name>.com`
     (404 likely available); for .com.au try `https://rdap.auda.org.au/domain/<name>.com.au`.
   - Australian business names: search the ABN Lookup site
     (https://abr.business.gov.au/Search/ResultsActive?SearchText=<name>) for identical or
     near-identical names and note conflicts.
   Recommend a top 3 with reasoning. Do NOT register or create anything.
2. `brand/kit.md` for the top pick (keep the name in one variable so it is easy to swap):
   tagline, tone of voice, palette, typography, plus a simple SVG wordmark `brand/logo.svg`.
3. `studio-site/index.html` (+ CSS): the studio's own one-page site: hero; how it works ("we
   build your preview first, no obligation"); what you get; pricing (A$249 launch price, optional
   care plan); portfolio section linking to sample sites at `/_samples/<slug>/` (another worker
   is building them into `previews/_samples/`); FAQ (domains, hosting, edits, payment by bank
   transfer, they own the site); contact (mailto placeholder). No fake testimonials, client
   counts or logos. Mobile-first, fast, brand name and contact set in one place.
4. `sales/`:
   - `cold_email.md`: 3 variants of a short (<120 words) personalised first email linking to
     their preview. Spam Act compliant: identifies the sender (first name + studio), says where
     we found their public email, contains a clear opt-out ("reply 'no thanks' and I won't
     contact you again"). No hype, no false urgency. Placeholders: {{business}},
     {{greeting_name}}, {{preview_url}}, {{personal_note}}, {{email_source}}.
   - `followups.md`: one polite follow-up 4-5 days later (only if no reply), then stop.
   - `reply_playbook.md`: answers for likely replies (price objections, "who are you",
     "is this a scam", "I don't need a website", domains, edits, timeline, payment) and the
     hand-over steps (connecting their domain, giving them the files).
   - `quote_template.md` and `invoice_template.md`: in Thomas's own name for now, bank
     transfer/PayID placeholders, and the ATO "Statement by a supplier" note (individual under
     18, payments of A$350/week or less, so no ABN withholding applies).
   - `agreement.md`: one-page plain-English service terms (scope, 2 revision rounds, payment on
     delivery, ownership passes on payment, parent/guardian co-signs).
   - `walk_in_script.md`: a 60-second in-person pitch for showing a preview on a phone at a
     local shop (optional channel).
5. `brand/README.md`: short summary of decisions.

## Verification
Serve `studio-site/` locally and check it at 375px and 1280px widths (fetch and inspect; take
headless screenshots if you can, saved under `studio-site/_screens/`).

## Logging & git (see AGENTS.md)
- First action: `python ops/tools/agentlog.py brand start "<one-line plan>"`.
- Log every meaningful step, decision and blocker with `agentlog.py` (name-check evidence in
  `--data`); finish with a `done` entry.
- After every meaningful step:
  `python ops/tools/publish_transcript.py brand && git add brand studio-site sales agents/brand && git commit -m "brand: <what>" -- brand studio-site sales agents/brand && git push origin HEAD:main`

## Rules
No accounts, registrations, purchases, sending or posting anything. Do not edit outside your
folders and `agents/brand/`.

## Done means
names.md with evidence for 8 names and a recommendation; kit + logo; studio site renders well;
all sales files present. Your worker_done report: recommended name + 2 alternates, and every
decision Thomas must make.
