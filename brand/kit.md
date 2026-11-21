# Brand kit

> **NAME = "Brissie Sites"** — the brand name appears in this kit and in
> `studio-site/index.html` as the single variable `NAME` / `<span class="brand-name">`.
> To rebrand, pick a different name from `names.md`, replace that one string, and the
> palette/type still work (all candidates are Brisbane-flavoured).

- Trading-as (public): **Brissie Sites** — "a student-run web studio in Brisbane"
- Invoices/contracts: Thomas's own legal name, trading as "Brissie Sites"
  (until/unless the business name is registered with ASIC — see names.md decisions).
- Contact (placeholder until the Gmail exists): `hello@brissiesites.com`
- Gmail handle suggestion: `brissiesites@gmail.com`
- GitHub org suggestion: `github.com/brissiesites`

## Tagline

**Primary: "We build it first. You only pay if you love it."**

Alternates:
- "A website for your business, already built — come and see it."
- "Local websites, built before you pay a cent."
- Short form for small spaces: "Built first. Loved, then bought."

## One-line pitch (for email signatures, bios)

> Brissie Sites is a student-run web studio in Brisbane. We build a finished
> one-page website for a local business *before* we contact them — if they love it,
> it's theirs for A$249, domain connected and ready. If not, no hard feelings.

## Tone of voice

Three words: **friendly, plain, honest.**

- Short sentences. No jargon ("static hosting", "CDN", "SEO-optimised" become
  "fast", "shows up on Google", "free to run").
- Say the price out loud. Saying "A$249, once, that's it" builds more trust than any adjective.
- No hype, no false urgency, no "revolutionary". The preview site is the proof;
  the words just point at it.
- We're a student-run studio and we say so — it's honest, and it's why we can
  build a preview before asking for anything.
- Local without being corny: "Brisbane" beats "Brisvegas"; a "no worries" tone
  without the word "mate" in every sentence.

| Do say | Don't say |
|---|---|
| "We already built your site — have a look." | "We can build you an amazing website!" |
| "A$249 once, hosting's free, you own it." | "Affordable packages tailored to your needs." |
| "I'm a Brisbane student running a small web studio." | "Our agency has years of experience." |
| "Reply 'no thanks' and I won't email again." | Any pressure or countdown. |

## Palette

Queensland river + subtropical warmth. High contrast, works on a warm off-white.

| Token | Hex | Name | Use |
|---|---|---|---|
| `--ink` | `#17323C` | River ink | Headings, body text on light |
| `--primary` | `#0E7C7B` | River teal | Primary buttons, links, key brand colour |
| `--accent` | `#F28C28` | Mango | Call-to-action accents, highlights, logo sun |
| `--accent-soft` | `#FDEBD3` | Mango tint | Highlight panels, badges |
| `--paper` | `#FBF7F0` | Sandstone paper | Page background |
| `--card` | `#FFFFFF` | Card | Cards, raised panels |
| `--muted` | `#5A7177` | River mist | Secondary text |
| `--line` | `#E4DCCF` | Sandstone line | Borders, dividers |
| `--success` | `#2F8F5B` | — | ticks/positive |
| On-dark text | `#F4EFE6` | Paper | Text on `--ink` sections |

Accessibility: `--ink` on `--paper` ≈ 12:1, `--primary` on `--paper` ≈ 5.4:1
(AA for normal text at 18px+ bold / large text; use white text on `--primary`
and `--ink` for buttons).

## Typography

Fast, free, no webfont required — system stack only (documented upgrade path below).

- **Headings:** `system-ui, "Segoe UI", "Avenir Next", "Helvetica Neue", Arial, sans-serif`
  at weight 700–800, tight letter-spacing (−0.02em), sentence case.
- **Body:** same stack, weight 400–500, 16–18px, line-height 1.6.
- **Optional upgrade (free):** self-host or Google-Fonts link to **Sora** or
  **Space Grotesk** for headings only — both are OFL-licensed, geometric and
  friendly. Body stays on the system stack.
- Numbers/prices in headings: same font, tabular feel via weight, not a mono font.

## Logo

`logo.svg` is a simple wordmark: a mango-coloured sun rising over a two-line
"river" wave (Brisbane River) inside a river-teal roundel, next to
**brissie sites** set in bold/lowercase with "sites" in the teal.

Usage:
- Minimum size 120px wide on screen.
- Clear space = height of the sun on all sides.
- On dark backgrounds, use the mark + white text (set `fill="#F4EFE6"` on the
  wordmark text) — the mark itself works on both.
- Don't recolour the sun/wave; the two-colour mark is the recognisable bit.
