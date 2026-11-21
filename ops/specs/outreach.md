# Task: Brand the previews and draft outreach batch 01 (agent name: outreach)

Workspace: C:\Users\tomy\orca\workspaces\200inamonth\sevengill
Read `AGENTS.md` first; its hard rules override anything here. This repo is PUBLIC.

## Context
Decisions made by Thomas: the studio is **Brissie Sites**, contact email
**brissiesites@gmail.com**, price **A$249**. GitHub is temporarily restricted, so previews are
NOT hosted yet: the first emails show each business a screenshot of the site we made for them,
and we send the live version only when they reply interested. Thomas sends every email by hand
from Gmail, at most 10 per day.

## Deliverables
Your paths: `sitegen/config.json`, `previews/_samples/`, `studio-site/`, `sales/` (public) and
`private/previews/`, `private/outreach/`, `private/leads/leads.csv` (gitignored, never committed).
1. **Apply the brand.** Set `sitegen/config.json` to BRAND_NAME "Brissie Sites", CONTACT_EMAIL
   "brissiesites@gmail.com", PRICE "A$249" (STUDIO_URL: a `mailto:` link for now). Make sure the
   studio site (`studio-site/`) uses the same name and email. Rebuild the samples
   (`node sitegen/build.mjs --json sitegen/samples.json --all --out previews/_samples --gallery`)
   and all real previews (`node sitegen/build.mjs --leads private/leads/leads.csv --all`).
2. **Quality pass on the real previews.** Open each of the 40 previews (serve `private/previews/`
   locally) and fix anything embarrassing: wrong category theme, odd capitalisation, broken
   hours, empty sections, services that don't fit the business. Fix the data in
   `private/leads/leads.csv` (log each change) or the generator, then rebuild. Drop any lead that
   turns out to be closed, a chain, or not a fit (move it to `private/leads/dropped.csv` with the
   reason).
3. **Screenshots.** For each real preview, capture `private/outreach/shots/<slug>-mobile.png`
   (375px wide, first ~1.5 screens) and `private/outreach/shots/<slug>-desktop.png` (1280px wide,
   first ~1 screen), with the preview banner hidden so the site looks finished. `sitegen/screens.mjs`
   and headless Chrome (`C:/Program Files/Google/Chrome/Application/chrome.exe`) already work.
   Stop any local server you start when done.
4. **Batch 01 drafts.** Pick the 10 best leads (highest score, varied categories, not in
   `private/optouts.csv`). For each, write a personalised email following `sales/cold_email.md`
   but adapted for an attached screenshot instead of a link. Requirements:
   - Subject: short, plain, no hype (e.g. "A website idea for Jack's Barber").
   - Body under 120 words: who is writing (Thomas from Brissie Sites, a Brisbane web studio),
     one genuine personal line from `personalisation_notes` (publicly stated facts only), what is
     attached, the offer (yours for A$249, includes setup and connecting your domain; you own it),
     where we found their email ("I found your email on <source>"), and the opt-out line
     ("If you'd rather not hear from me, just reply 'no thanks' and I won't contact you again").
   - Sign-off: "Thomas, Brissie Sites, brissiesites@gmail.com". No phone number, no surname.
   - Never invent facts, reviews, or claims.
   Write them to `private/outreach/batch-01.md` (human-readable, copy-paste ready: To, Subject,
   Body, Attachments) and `private/outreach/batch-01.json` (array of objects: slug, business,
   to, email_source_url, subject, body, attachments, status "draft").
5. **Tracking.** Create `private/outreach/log.csv` with columns
   `date_sent,slug,business,to,status,follow_up_due,notes` (status: draft | sent | replied |
   interested | opted_out | won | lost), pre-filled with the 10 drafts as `draft`.
6. **Sending guide (public, generic, no prospect data):** `sales/sending_guide.md`, a short
   checklist for Thomas: how to send one email from Gmail with the two screenshots attached, the
   10-per-day cap, marking `log.csv`, adding opt-outs to `private/optouts.csv` immediately, the
   single follow-up after 4-5 days (from `sales/followups.md`), and what to do when someone
   replies (tell the coordinator; reply templates are in `sales/reply_playbook.md`).
7. Update `sales/cold_email.md` with a screenshot-attachment variant (generic placeholders only).

## Logging & git (see AGENTS.md)
- First action: `python ops/tools/agentlog.py outreach start "<one-line plan>"`.
- Log each step, decision and data fix with `agentlog.py`; finish with a `done` entry.
- Commit locally after each step:
  `python ops/tools/publish_transcript.py outreach && git add sitegen/config.json previews/_samples studio-site sales agents/outreach && git commit -m "outreach: <what>" -- sitegen/config.json previews/_samples studio-site sales agents/outreach`
- Push ONLY ONCE, when you are done: `git push origin HEAD:main` (GitHub flagged automated
  activity; keep traffic low). Never commit anything from `private/`.

## Rules
Do not send any email, contact anyone, deploy, or create accounts. Do not edit outside your paths
and `agents/outreach/`.

## Done means
40 branded previews rebuilt (minus any dropped, with reasons), screenshots for every remaining
preview, batch-01 (10 drafts) in md + json, log.csv, sending guide. Your worker_done report: the
10 businesses (name, suburb, category, subject line), any dropped leads and why, and data fixes.
