# Products plan — what to list, where, and what a human must do

From `research.md`: **itch.io** is the only channel with real marketplace
traffic, $0 fees, and instant/no-minimum payout (direct PayPal). **Bandcamp**
is a free second storefront for the same audio product (payout 24–48 h). All
accounts below are owned by **Thomas's parent (18+)**; payouts go to the
parent's PayPal/bank.

Deadline: cash in hand by **2026-12-21**. These picks pay out within 48 h of a
sale, so even a Dec 20 sale counts.

---

## Pick 1 (BUILT — ready to list): "Pocket Chip Kit" chiptune sample + MIDI pack

Lives in `products/pocket-chip-kit/`. An original, royalty-free chiptune pack —
drums, basses, leads, FX, loops and matching MIDI files — synthesized by a
reproducible Python script (`build_pack.py`, stdlib only). Includes a browser
preview page so buyers can hear it before buying, and `verify_pack.py` which
proves every file decodes and is not silent/clipped.

### Why this product
- itch.io's audio-assets category has real browse traffic from game devs and
  chiptune producers; a US$4.99 pay-what-you-want price is impulse-buy level.
- Cross-sells Pick 2: the pack is the same chiptune/8-bit aesthetic as
  `cadence`; each itch page can link to the other (both honest claims).
- Fully agent-built and verified — no human needed until the listing step.
- One product → **three listings** (itch + Bandcamp + Gumroad) ≈ 15 min each.

### Listing steps — itch.io (~20 min, parent)
1. Create an itch.io account (free) at itch.io → Register. Use the brand name
   if one is picked, otherwise a neutral name.
2. Account → Settings → Payment modes → choose **"Direct to you"** and connect
   the parent's **PayPal** (or Stripe). Set **revenue share to 0–10%** (slider
   in account settings; 0% is allowed).
3. New project → Kind of project: **Assets** → Classification: **Asset pack** /
   Audio. Upload `pocket-chip-kit.zip`.
4. Set price **US$4.99**, enable **"pay what you want"** above it.
5. Paste the listing copy below; upload `cover.png` (630×500) + screenshots.
6. Tags: `chiptune` `8-bit` `sample pack` `drums` `midi` `game assets`
   `nes` `loops` `royalty-free` `audio`.
7. Save as **Public**.

### Listing steps — Bandcamp (~15 min, parent)
1. Free artist account at bandcamp.com → connect parent PayPal.
2. "Add music" → digital track/album, upload a few preview WAVs as streaming
   tracks, attach `pocket-chip-kit.zip` as the bonus/download file (or list it
   as a "merch/other digital" item — Bandcamp supports file downloads).
3. Name-your-price with **US$4 minimum**. Tags: chiptune, sample pack, 8-bit,
   video game music, drum kit.
4. Publish.

### Listing steps — Gumroad (~10 min, parent)
1. gumroad.com → sign up free → New product → Digital → upload zip.
2. Price US$4.99+. Note: **US$100 minimum payout** — treat any Gumroad income
   as a bonus; itch/Bandcamp are the bankable channels.

### Listing copy (itch.io — paste-ready)

> **Title:** Pocket Chip Kit — Chiptune Sample & MIDI Pack
>
> **Tagline:** 90+ original 8-bit drums, basses, leads, FX and loops + matching
> MIDI — royalty-free for games, music and jams.
>
> **Body:**
> Pocket Chip Kit is a hand-crafted chiptune sample pack: every sound is an
> original synthesis (square, pulse, triangle and noise voices, NES/Game Boy
> style), rendered to clean 44.1 kHz WAVs and ready to drop into any DAW,
> tracker or game engine.
>
> **Inside:**
> - 20+ drum one-shots — kicks, snares, hats, claps, toms, rim/noise hits
> - 20+ bass & lead one-shots across octaves — pulse, square, triangle
> - 15+ FX — coin, jump, laser, power-up, risers, noise sweeps
> - 15 loops — drums, basslines and arps at 120/140 BPM
> - 12 MIDI files — drum patterns, basslines and melodies to rebuild with your
>   own sounds
> - A browser preview page so you can audition the whole kit
>
> **License:** royalty-free. Use the sounds in unlimited commercial and
> non-commercial projects (games, tracks, streams). Don't resell or
> redistribute the pack itself as-is. Full text in `LICENSE.txt`.
>
> Made by a Brisbane student project (with a lot of help from AI coding
> agents) — every sale literally goes toward proving a point.

### Expected value, honestly
P(any sale in 30 days across itch+Bandcamp) ≈ 10–20% for a well-presented new
pack; P(≥A$50 ≈ US$33, i.e. ~7 sales) ≈ **7–12%**. Not likely — but it is the
highest-probability hands-off option available, and it costs nothing but the
listing time.

---

## Pick 2 (READY AFTER ~45 MIN PARENT WORK): `cadence` paid build on itch.io

Thomas's repo `github.com/Toom68/cadence` is a native Rust sequencer for
macOS/Windows — a real, substantial product and the best itch fit (music tools
are a proven itch category). No licence file, but Thomas owns the copyright
outright, so selling builds is his right.

**Blocked on:** the coordinator vetoed system installs (rustup). The machine
already has VS 2022 + MSVC x64 + Windows SDK, so once Rust is approved the
build should work on the stable MSVC toolchain.

### What the parent/coordinator must do (~45 min)
1. Install Rust: `winget install -e --id Rustlang.Rustup` (or rustup-init.exe),
   then `rustup default stable-x86_64-pc-windows-msvc`.
2. `git clone https://github.com/Toom68/cadence` (or fetch existing).
3. `cargo test --locked --all-targets` — sanity check the engine.
4. `cargo build --release --locked` then run the repo's own
   `scripts/windows-package.ps1` → produces
   `dist/Cadence-<ver>-windows-x64.zip` (contains `Cadence.exe`).
5. Smoke-test: launch `Cadence.exe` once on Windows (the README warns the
   Windows exe has never been run on Windows — verify before selling!).
6. itch.io (same parent account as Pick 1): new project → kind **Tool** /
   Desktop app → upload zip → price **US$9** (PWYW). Tags: `music` `sequencer`
   `chiptune` `daw` `tracker` `midi` `rust`.
7. Suggested tagline: *"A native, offline chiptune studio — step sequencer,
   piano roll, 202 synthesized sounds, WAV/MIDI export."* (All verifiable from
   its README — keep the page equally honest: mark Windows build as unsigned,
   mention the free source on GitHub.)
8. Link the two listings to each other.

Caveats to keep honest on the listing: unsigned binary (SmartScreen warning),
Windows build lightly tested, source is free on GitHub (pay-for-convenience
build — itch buyers do this).

**EV:** at US$9, ~5 sales = A$50. P ≈ 4–8% within window; instant payout.
Combined with Pick 1, P(≥A$50 across both) ≈ **10–16%**.

---

## Optional hedge (documented, not built): Apify pay-per-event actor

`leads/fetch_osm.py` can be repackaged as an Apify actor ("independent
businesses with no website — lead finder") in ~1 h. Evidence shows the niche
has only 1–6 monthly users per actor and payouts land Dec 21–25 at the earliest
— likely **after** the deadline and below the US$20 minimum. Recommend skipping
unless the coordinator wants it for line-1 lead generation anyway (it doubles
as our own tool).

### If built anyway (parent steps)
- Free Apify account → Development → create actor → push code → Publication
  tab → enable **pay-per-event** (e.g. `lead` event at US$1.50/1,000).
- Parent completes **KYC** (Verified Creator) and adds PayPal/Wise payout
  (US$20 min). Sales by Nov 30 pay out ~Dec 21–25.

---

## What the coordinator/parent must do, in one list

| When | Who | Action | Cost |
|------|-----|--------|------|
| Any time | Parent | Create itch.io account, connect own PayPal, list `pocket-chip-kit.zip` with the copy above (~20 min) | $0 |
| Same sitting | Parent | Mirror on Bandcamp (+15 min) and Gumroad (+10 min) | $0 |
| If approved | Parent/coord | Approve rustup install, build cadence, list on itch (~45 min) | $0 |
| If Thomas relaxes A$0 | Parent | ONE Etsy listing for the pack — the single highest-traffic option | **US$0.20 + possible shop set-up fee** — must be explicitly approved |
| Later | Parent | (Optional) Framer account + rebuild a sitegen theme in Framer editor → list with a Payhip checkout — highest EV but human work | $0 |

No accounts, purchases, or listings were created by the agent. All account
names, emails and payout details belong to the parent.
