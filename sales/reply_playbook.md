# Reply playbook

What to say when they write back. Rule one: **answer the question honestly, briefly, and
stop selling.** They already have the preview — it does the persuading.

Every reply signs off as: "Thomas — Brissie Sites" (first name + studio, matching the
first email).

---

## "How much is it really? / What's the catch?"

> No catch — it's A$249 once, and that includes setup and connecting your domain.
> Hosting is free (it's a plain fast website, not something that needs expensive
> servers). The only extra ever is ~A$15–25/year for your domain if you don't have one,
> paid to the registrar in your name. You pay only after you've said yes to the site
> you've already seen.

## "That's more than I want to pay / too expensive"

> Fair enough — it's not for everyone. For what it's worth, A$249 once is usually
> less than one month of an agency retainer, and you already know exactly what you're
> getting. No pressure — if it's not the right time, the preview stays up either way.

If they push further on price: don't discount below ~A$199 without coordinator sign-off;
the price is already the honest floor.

## "Who are you? Is this a scam?"

Healthy scepticism — answer it straight.

> Fair question. I'm Thomas — a Brisbane student running a tiny web studio called
> Brissie Sites. The preview is real and already built; you never pay anything before
> seeing and approving it, and payment is by bank transfer after delivery, to an account
> you'll get on a normal invoice. Happy to chat on the phone if that's easier.
> You can also look at our studio site and sample work here: {{studio_url}}

## "I don't need a website / I'm on Facebook already"

> All good — Facebook covers a lot. Where a site helps is when people Google you:
> your hours, services and tap-to-call in one place that you own, instead of a feed
> you don't control. If yours is already doing that job, genuinely no worries —
> thanks for having a look.

If they clearly aren't interested after that, close politely and mark "not interested".

## "I already have a website"

> Nice — if it does the job, keep it. Happy to take down the preview I made; it was
> just my way of showing the kind of thing I build. If there's ever anything you'd
> like changed or rebuilt, I'm here.

If the preview was built because their existing site looked broken/dated, honest version:
> I built it because your current site looked a bit hard to use on phones — if that's
> not your experience, ignore me entirely.

## "Can you change X / Y / Z on the preview?"

> Yes — happy to. Point out anything you'd like different (photos, wording, colours,
> services) and I'll work it in before anything goes live. Two rounds of tweaks are
> included in the A$249.

## "I don't have a domain / how do domains work?"

> Easy — I'll help you buy one (like yourbusiness.com.au), it's about A$15–25 a year
> paid to the registrar in YOUR name, so you own it. If you'd rather start without one,
> I can put the site on a free address first and connect a domain whenever you're ready.

If they already own a domain:
> Just tell me where it's registered (e.g. GoDaddy, Crazy Domains). I'll send you simple
> steps to point it at the new site — takes about 10 minutes and I can walk you through it.

## "How long does it take?"

> The site's already built — you saw it. Once you say yes and we agree any tweaks,
> it's usually live within a couple of days.

## "How do I pay?"

> Bank transfer or PayID, after the site's delivered. I'll send a simple invoice —
> no deposit needed before you've seen the work. (For their accountant: I supply under
> the ATO "statement by a supplier" rules — small payments to an individual, so there's
> no ABN withholding for them to worry about.)

## "Stop emailing me / no thanks"

> No worries — you won't hear from me again. Thanks for your time.

Then: add to `private/optouts.csv` IMMEDIATELY and mark the lead. One line, nothing else.

## "Sounds good — what's next?" → handover steps

1. Confirm the tweaks they want on the preview.
2. Send the quote (`quote_template.md`) + the one-page agreement (`agreement.md`);
   a parent/guardian co-signs on our side.
3. Make the agreed edits; send the updated preview for approval.
4. Domain: they buy one in their name, or tell us their registrar to connect an existing
   one, or accept a free starter address.
5. Deploy the site and connect the domain; show them it live.
6. Send the invoice (`invoice_template.md`) — payment on delivery.
7. On payment: hand over all site files (zip + where it's hosted), confirm ownership
   transferred, offer the A$15/month care plan once — no nagging.
8. Log the sale in `ops/STATE.md` money tracker via the coordinator.
