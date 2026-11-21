# Brand name research — 8 candidates

Goal: a short, memorable name for Thomas's Brisbane web studio that works as a
Gmail handle, a GitHub org name, and (later) a domain + ASIC business name.
Checked 2026-11-21. Nothing was registered or created — checks only.

## How each candidate was checked

| Check | Command / method | What "good" looks like |
|---|---|---|
| GitHub org/user availability | `gh api users/<handle>` | HTTP 404 = free |
| `.com` domain | `curl -sL https://rdap.org/domain/<handle>.com` | HTTP 404 = likely free |
| `.com.au` domain | `curl -s https://rdap.cctld.au/rdap/domain/<handle>.com.au` | HTTP 404 = likely free (rdap.auda.org.au does not exist; rdap.org redirects .au to `rdap.cctld.au`) |
| AU business names | `https://abr.business.gov.au/Search/ResultsActive?SearchText=<words>` | no identical/near-identical active names |

Not verifiable without spending money / creating accounts: Gmail handle availability
(only checkable during signup — all handles are ≥6 chars and plausible), and formal
ASIC business-name availability (ABN Lookup search is a good proxy, final check happens
inside the ASIC registration flow if Thomas registers).

## Results

| # | Candidate (handle) | GitHub | .com | .com.au | ABN Lookup (search term) | Notes |
|---|---|---|---|---|---|---|
| 1 | **Brissie Sites** `brissiesites` | 404 free | 404 free | 404 free | "brissie sites" → 27 results, none web-related; closest "BRISSIE & CO", "BRISSY" | Instantly says "Brisbane websites". Friendly, local. |
| 2 | **Jacaranda Web** `jacarandaweb` | 404 free | 404 free | 404 free | "jacaranda web" → 488 results, many "JACARANDA …" entities but none in web/design | Classy, iconic Brisbane tree. Note: "Jacaranda" is also Wiley's school-textbook imprint (different industry). |
| 3 | **Bunya Web** `bunyaweb` | 404 free | 404 free | 404 free | "bunya web" → 148 results, no "Bunya …" match in top results | Short, QLD-specific (bunya pine / Bunya Mts). Bunya has Indigenous cultural significance — used respectfully as a place/nature name. |
| 4 | **Puggle Web** `puggleweb` | 404 free | 404 free | 404 free | "puggle web" → 126 results, zero "Puggle" businesses | Cutest option; weakest link to what we sell. |
| 5 | **Kooka Web** `kookaweb` | 404 free | 404 free | 404 free | "kooka web" → 59 results incl. "KOOKAI" (fashion label), "KOOKAS" | Fun, but "Kookai" is a known AU fashion brand and "kook" is slang for crazy. |
| 6 | **Stormbird Web** `stormbirdweb` | 404 free | 404 free | 404 free | "stormbird" → 1,309 results; STORMBIRD PTY LTD, STORMBIRD VFX, CYBER SECURITY, CONSULTING etc. | Local name for the koel, but crowded — hard to stand out or register later. |
| 7 | **Bilby Web** `bilbyweb` | 404 free | 404 free | **200 taken** | "bilby web" → includes **"BILBY WEB PAGE DESIGN SERVICE"** (trading name) | Near-identical business already exists. Rejected. |
| 8 | **Banksia Web** `banksiaweb` | 404 free | 404 free | **200 taken** | "banksia web" → **"BANKSIA WEB"** is an active registered business name | Exact-match business name + domain taken. Rejected. |

## Recommendation — top 3

### 1. Brissie Sites (recommended pick)
- The name *is* the pitch: a cold email from "Brissie Sites" tells a Brisbane shop
  owner what we do before they open it. Highest clarity for tradies/cafes.
- Every handle and domain is free; no conflicting business names.
- Friendly, student-run, local — matches the honest positioning.
- Downside: slangy; if Thomas later wants clients outside Brisbane it boxes him in.
- Suggested assets: `brissiesites.com`, GitHub org `brissiesites`,
  `brissiesites@gmail.com` (or `hello.brissiesites@`).

### 2. Jacaranda Web
- Most polished/"grown-up" option; jacarandas are a beloved Brisbane icon
  (purple season, UQ, New Farm Park). Suits cafes/salons especially.
- All checks clean. "Jacaranda" is used by many unrelated businesses (and a textbook
  imprint), so it's less ownable, but in a different industry than all of them.
- Suggested: `jacarandaweb.com`, GitHub org `jacarandaweb`.

### 3. Bunya Web
- Shortest and most distinctive of the clean options; quietly Queensland
  (bunya pine, Bunya Mountains) without being slang.
- All checks clean. Slightly less obvious to a layperson than the other two.
- Suggested: `bunyaweb.com`, GitHub org `bunyaweb`.

Dark horse: **Puggle Web** — the cleanest check results of all, but it says nothing
about websites or Brisbane, so it would need more explaining in every email.

## Decisions for Thomas
1. Pick one name (or ask for another round of candidates).
2. Decide whether "Sites"/"Web"/"Studio" suffix — all candidates use the same
   handle for Gmail + GitHub + domain, e.g. `brissiesites`.
3. Free first step: create the GitHub org + Gmail; registering the domain (~A$15-20/yr)
   and the ASIC business name (~A$44/yr) only when the first client is close.
