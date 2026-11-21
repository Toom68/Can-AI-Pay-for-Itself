# Hands-off product research — digital goods that sell themselves

Researched 2026-11-21. Goal: a product that sells via a marketplace's *own* buyer
traffic (no marketing by Thomas), costs A$0 to list, pays out to a parent-owned
account, and can plausibly put **≥ A$50 (~US$33) cash in hand by 2026-12-21**
(30 days away). Every probability below is an honest estimate, not a promise.

**Exchange-rate note:** "A$50" ≈ US$33. Where a channel pays in USD I use US$.

**Hard deadline math:** any channel whose payout for November sales lands after
~Dec 21, or that gates selling behind a multi-week review, is near-worthless for
this experiment no matter how good the traffic is.

---

## Scoreboard

| # | Channel | Upfront | Payout speed | Built-in traffic | Gate / blocker | P(≥A$50 by Dec 21) |
|---|---------|---------|--------------|------------------|----------------|--------------------|
| 1 | **itch.io** (paid tool/asset, direct PayPal) | $0 | **Instant** (direct to your PayPal/Stripe) | Medium (browse, tags, jams) | Parent account 18+ | **~7–12%** |
| 2 | **Bandcamp** (same product, mirror) | $0 | **24–48 h** to PayPal | Medium (music browse/tags) | Parent account | **~4–7%** (additive) |
| 3 | Framer Marketplace | $0 | Instant publish, but **checkout is external** | High ($6.5M paid to creators in 2025) | Needs Framer account + template built inside Framer GUI | ~0% as agent-built; ~10% if a human builds it |
| 4 | Apify Store (pay-per-event actor) | $0 | Monthly ~21st–25th of **following** month | High intent, tiny in our niche | KYC (parent); US$20 min; niche data shows ~1–6 monthly users for direct competitors | **~2–4%** |
| 5 | Gumroad (incl. Discover) | $0 | Weekly, **US$100 min** | Low-medium (Discover) | Min payout almost unreachable in window | ~3–6% |
| 6 | Payhip | $0 | **Instant** to your PayPal/Stripe | **None** (storefront, not a marketplace) | — | ~0–1% |
| 7 | Ko-fi Shop | $0 | **Instant** to your PayPal/Stripe | Very low | — | ~1–2% |
| 8 | Etsy digital downloads | **US$0.20/listing + possible shop set-up fee** | Daily-ish to bank | Very high | **Fee → excluded by A$0 rule** | ~15% if the fee were paid |
| 9 | Notion Marketplace | $0 | Bi-weekly Thu, US$20 min, 14-day hold | Medium-high | **Waitlist — "may take a few months"** | ~0–2% |
| 10 | Lemon Squeezy | — | — | — | **Dead: sign-ups closed 2026-11-16, payments stop 2027-03-31** | 0% |
| 11 | Chrome Web Store paid extension | **US$5 reg fee** | External payment needed anyway | High | Fee + no native payments | ~0% |
| 12 | VS Code Marketplace | $0 | No payments at all | High installs, no buyers | Paid tier must be licensed externally | ~0–1% |
| 13 | n8n paid templates | $0 | Your own checkout | Medium | Paid tier locked behind **3 approved free templates** (1 at a time, ~week each) | ~0–2% |
| 14 | ThemeForest / Creative Market | $0 | Monthly, mins vary | High | Review queue days–weeks; monthly payout | ~1–4% |

---

## 1. itch.io — TOP PICK

- **Fees:** $0 to list. "Open Revenue Sharing": *you* choose itch's cut, 0–100%
  (default 10%, can be set to 0%). Payment processors take ~$0.30 + 2.9%.
- **Payout:** two modes. **"Direct to you"** = each purchase is a transaction
  straight into your own PayPal or Stripe — money lands immediately, **no
  minimum, no payout schedule**. "Collected by itch.io, paid later" also exists
  (itch handles EU VAT). Sources:
  - https://itch.io/docs/creators/payments
  - https://itch.io/docs/creators/faq
  - https://itch.io/t/643204/paypal-marketplaces-an-update-for-paypal-direct-to-you-payments
- **Traffic:** a real marketplace with browse pages, tags, "new & popular" and
  jams. Game/audio **asset** and **tool** categories get organic buyers;
  music tools (sequencers, trackers, synth toys) are a proven itch niche.
- **KYC/age:** account is just an email; payments go to the connected PayPal/
  Stripe — **parent owns it (18+)**. AU supported.
- **Build effort:** product is a file upload + page. Fully agent-buildable.
- **Competition:** real but categories are long-tail; a priced, polished niche
  item still surfaces in "newest" + tag pages.
- **Verdict:** the only channel that combines (a) real marketplace traffic,
  (b) zero fees, (c) *instant* payout with no minimum, (d) a product we can
  build entirely with local tools. **P(≥A$50) ≈ 7–12%.**

## 2. Bandcamp — mirror for the same product (audio packs)

- **Fees:** free artist account; **15% of digital sales** (10% after US$5,000
  lifetime) + processor fees ~4–6%.
- **Payout:** **24–48 h after each sale** to connected PayPal (default), or
  monthly on the 1st. Sources:
  - https://get.bandcamp.help/en/articles/15263080-how-do-i-get-paid-on-bandcamp-and-how-often
  - https://bandcamp.com/artists
  - https://get.bandcamp.help/en/articles/15263193-what-are-bandcamp-s-fees
- **Traffic:** real music discovery (tag/genre browse). Sample packs and
  chiptune releases both sell on Bandcamp.
- **Verdict:** the same WAV/MIDI pack can be listed here in ~15 extra minutes as
  a second storefront. Additive P ≈ +4–7%.

## 3. Framer Marketplace — high ceiling, can't be agent-built

- **Fees:** **0% cut — keep 100%**. But Framer **does not process payments**;
  the listing links out to your own checkout (Gumroad/Payhip/Stripe/Contra).
- **Traffic:** real — Framer reports **$6.5M paid to creators in 2025**;
  $753k in Nov alone.
- **Publishing:** since Framer 3.0 (2026-06-16) there is **no review queue** —
  templates go live on submit. Sources:
  - https://www.framer.com/creators
  - https://www.framer.com/help/articles/how-to-publish-a-template/
  - https://www.framer.com/help/articles/accept-payments-in-the-community/
  - https://www.framer.com/blog/marketplace-new-framer-community/
- **Blocker for us:** a "Framer template" must be *built inside the Framer
  editor* — a free account (parent) plus manual GUI work an agent can't drive
  reliably. Our `sitegen/` HTML can't be imported.
- **Verdict:** parked. If a parent creates a Framer account and is willing to
  rebuild one sitegen theme in the editor (~an evening), a small-business
  template at ~US$19–39 with a Payhip checkout is probably the **highest-EV
  product on this list** (~10%+), but it is not agent-deliverable.

## 4. Apify Store — pay-per-event actor (evaluated hard, rejected as top pick)

- **Fees:** free to publish. Apify keeps **20%** of revenue; platform usage
  costs are deducted from your payout (negative months floor at $0 per actor).
- **Payout:** monthly — invoices on the **11th**, payouts **days 21–25**, for
  the **previous** month. KYC (Verified Creator) required; min threshold by
  method (US$20 via PayPal per task brief). A sale **must happen by Nov 30**
  to be paid ~Dec 21–25; December sales pay ~Jan 21–25 — too late.
  Sources:
  - https://docs.apify.com/actors/monetize/monthly-payouts
  - https://docs.apify.com/actors/monetize/pay-per-event
  - https://docs.apify.com/legal/store-publishing-terms-and-conditions
  - https://help.apify.com/en/articles/12800725-ship-your-actor-and-get-paid
- **Traffic:** high buyer *intent* but our niche is tiny. Apify's own stats and
  apifystats.com show the direct competitors for an "OSM business leads" actor
  (there are **5+ already**, priced $0.70–$1.90 per 1,000 results) have
  **1–6 monthly users each**. The whole OSM-lead niche is single-digit users
  per actor:
  - https://apify.com/jeffev/openstreetmap-business-leads — 2 total users
  - https://apifystats.com/publishers/transparent_meteorite.html — 130 actors,
    228 monthly users *total*; the "no-website" OSM actor: 6 monthly users
  - Compare compass/Google Maps Scraper: 47,509 monthly users — but Google
    Maps scraping is off-limits for us (AGENTS.md data-sourcing rules).
- **Verdict:** P(US$20 payout by Dec 21) ≈ **2–4%**, and the cash likely lands
  days after the deadline anyway. A correctly-built actor *is* included as an
  optional hedge in `plan.md` because it's nearly free to make from
  `leads/fetch_osm.py` and doubles as our own lead tool.

## 5. Gumroad

- **Fees:** 10% + $0.50 per direct sale; **30%** if the sale comes via
  Discover. https://gumroad.com/pricing
- **Payout:** weekly (AU bank Wed / PayPal Fri, PayPal +2%), each payout covers
  sales ≥7 days old — **but minimum balance is US$100**
  (https://gumroad.com/help/article/13-getting-paid,
  https://gumroad.com/help/article/281-payout-delays).
  At a $5–15 price point, clearing $100 *net* inside 30 days with only Discover
  traffic is unlikely; if you don't clear it, you get **$0**.
- **Verdict:** fine as a *mirror* checkout (free to list, one extra URL), not
  bankable as a primary. P ≈ 3–6%.

## 6. Payhip

- **Fees:** Free plan 5% + processor fees; $0/month, unlimited products.
- **Payout:** **instant** — funds land in your own PayPal/Stripe at sale time.
  https://payhip.com/pricing · https://help.payhip.com/article/396-resolve-payment-issues-as-a-seller
- **Traffic:** effectively **none** — it's a storefront, not a marketplace.
- **Verdict:** best free *checkout layer* (e.g. for a Framer listing); alone it
  generates ~0 sales. P ≈ 0–1%.

## 7. Ko-fi Shop

- **Fees:** free plan 5% on shop sales (0% on one-off tips) + processor fees.
- **Payout:** **instant**, direct to your PayPal/Stripe, no minimum.
  https://ko-fi.com/shop · https://help.ko-fi.com/hc/en-us/articles/360002506494-Does-Ko-fi-take-a-fee
- **Traffic:** small "explore" surface only; Ko-fi assumes you bring the
  audience. P ≈ 1–2%.

## 8. Etsy digital downloads — best traffic, **blocked by the A$0 rule**

- **Fees:** **US$0.20 listing fee** per item (charged whether or not it sells),
  a possible one-time **shop set-up fee** at onboarding, 6.5% transaction +
  3% + $0.25 payment processing (+15% offsite-ads fee if a sale comes via ads).
  https://www.etsy.com/legal/fees/ · https://www.etsy.com/sell
- **Age:** 13–17 may sell **only on a parent-owned, supervised account**.
- **Verdict:** Etsy's digital-download traffic is the biggest on this list and
  P(≥A$50) would be ~15% — but the listing fee makes it off-limits under "no
  spending". Flagged for Thomas: a single US$0.20 listing is the cheapest
  traffic money can buy if he ever relaxes the rule.

## 9. Notion Marketplace

- **Fees:** 8% + $0.40 per sale (+1% FX for non-US); Notion is MoR (handles
  VAT). Payouts every 2 weeks (Thu), US$20 min, 14-day hold.
- **Gate:** sellers must apply and **join a waitlist — "it may take a few
  months to get reviewed"**. https://www.notion.com/help/selling-on-marketplace
- **Verdict:** dead for this window. P ≈ 0–2%.

## 10. Lemon Squeezy — DEAD

- Announced **2026-11-16: winding down. New store sign-ups closed**; payments
  stop 2027-03-31 (moving to Stripe Managed Payments).
  https://www.lemonsqueezy.com/blog/saying-goodbye-to-lemon-squeezy
- **Verdict:** 0%. Cannot even register.

## 11. Chrome Web Store

- **US$5 one-time developer registration fee** → blocked by A$0 rule.
  https://developer.chrome.com/docs/webstore/register
- Also: the store doesn't process payments — paid extensions need an external
  checkout anyway. Double-blocked.

## 12. VS Code Marketplace

- Free to publish, **but it cannot take payments** ("all fees must be billed
  and collected outside of the Marketplace"). Monetization = free extension +
  license key / hosted service sold elsewhere — weeks of work, ~0 sales in
  window for a new unknown extension.
  https://zeroraised.com/blog/how-to-monetize-a-vs-code-extension

## 13. n8n / Make templates

- n8n Creator Hub: **paid templates unlock only after 3 approved free
  templates**, submitted one at a time (~a week each) → ≥3 weeks before you can
  even list a paid item, and payment/delivery is on your own checkout anyway.
  Median paid-template price ~US$20; ~58% of sellers point at Gumroad.
  https://docs.n8n.io/contribute/create-templates
  https://agentaos.ai/answers/sell-n8n-templates-without-stripe
- Make/Zapier: no documented paid third-party template program.
- **Verdict:** too slow for the window.

## 14. ThemeForest / Creative Market

- Real buyer traffic, but: submission review queues of days–weeks, monthly
  payout cycles with minimums, and high rejection odds for a basic HTML
  template. Even approved quickly, first payout would land mid-late December at
  best. P ≈ 1–4%.

---

## Thomas's existing repos as assets (checked 2026-11-21, read-only via `gh`)

| Repo | Licence | Sellable? | Note |
|------|---------|-----------|------|
| `cadence` (Rust sequencer, macOS/Win) | **None** — Thomas owns copyright, free to sell builds | Yes — as a paid itch.io app | Needs Rust toolchain (no system installs allowed → needs parent to run `rustup` + `scripts/windows-package.ps1`); own README says the Windows exe was never run on Windows |
| `afterglow-ios` | None | Blocked — needs Mac/Xcode + US$99/yr Apple | — |
| `multiagentcouncil-orca` | None | Technically yes; audience ≈ Orca users only | ~0 buyers |
| `translink-but-better` | None | Not realistically (PWA + Supabase backend; public transport users won't pay on a marketplace) | — |
| `People-in-perspective` | None | Free site already public; no buyers for a viewer | — |

**Cadence is the one genuinely sellable repo asset.** Listing steps are fully
written up in `plan.md`; it needs ~45 min of parent/coordinator time (install
Rust, build, create itch account, upload). Until that's approved it cannot be
the delivered product.

---

## Conclusion

1. **itch.io is the only channel** with real marketplace traffic + $0 fees +
   instant/no-minimum payout + a product we can build 100% with installed tools.
2. **Best buildable product:** an original **8-bit/chiptune sample + MIDI pack**
   (pure-Python WAV/MIDI synthesis, verifiable automatically) — squarely inside
   itch's audio-asset audience, priced US$4.99 pay-what-you-want, mirrored free
   on Bandcamp (24–48 h payout) and Gumroad.
3. **Best repo asset:** `cadence` paid build on itch.io at ~US$9 — ready to list
   after ~45 min of approved parent work (Rust toolchain + build + itch
   upload). Runbook in `plan.md`.
4. Everything else is either fee-blocked (Etsy, Chrome), gate-blocked (Notion,
   n8n, Framer GUI), payout-blocked (Gumroad $100 min, Apify Dec 21–25,
   ThemeForest monthly), dead (Lemon Squeezy), or traffic-free (Payhip/Ko-fi
   alone).
