# Sending guide — how to send a preview email by hand

Thomas sends every email himself from Gmail. No automation, no bulk sending —
that keeps us on the right side of the Spam Act 2003 and out of spam folders.

## Daily routine

- **Cap: 10 emails per day**, sent one at a time. That's it — stop at 10.
- Drafts live in `private/outreach/batch-XX.md` (human-readable) and the
  screenshots they mention are in `private/outreach/shots/`.

## Sending one email

1. Open `private/outreach/batch-XX.md` and pick the next business marked
   `draft` in `private/outreach/log.csv`.
2. **Check `private/optouts.csv` for that address first.** If it's there,
   mark the lead `opted_out` in `log.csv` and skip it. Never email someone
   on the list.
3. In Gmail, start a new message:
   - **To:** the address from the draft.
   - **Subject:** copy it exactly — short and plain, no hype.
   - **Body:** copy the body exactly. Don't add anything, don't remove the
     opt-out line.
   - **Attachments:** attach BOTH screenshots named in the draft
     (`<slug>-mobile.png` and `<slug>-desktop.png`) from
     `private/outreach/shots/` — paperclip icon → pick the two files.
4. Re-read the To/Subject/attachments once, then send.
5. In `private/outreach/log.csv`, update the row: `date_sent` (today,
   YYYY-MM-DD), `status` → `sent`, `follow_up_due` → today + 5 days
   (YYYY-MM-DD).

## Opt-outs — do this immediately

- Any reply that says "no thanks", "unsubscribe", "stop", or anything
  negative → add the email address to `private/optouts.csv` straight away
  (columns: email,business,date,notes), mark `opted_out` in `log.csv`, and
  never contact them again. Then just send one short "No worries — thanks
  for letting me know." reply if you like, nothing more.

## Follow-ups (one only)

- If `status` is `sent` and `follow_up_due` has passed with **no reply**,
  send exactly one follow-up using `sales/followups.md`. Then stop forever —
  no third email, ever. Mark a note in `log.csv`.
- If they replied at all (even to say no), do **not** send the follow-up.

## When someone replies

- Any interested or curious reply → tell the coordinator before answering,
  and use `sales/reply_playbook.md` for the reply templates. Mark `replied`
  (or `interested`) in `log.csv`.
- The live preview site isn't public yet — the coordinator hosts it and
  sends the link once they say yes to a look.

## Quick rules recap

- One email per business, by hand. Never bulk-send.
- Keep the opt-out line exactly as written.
- Max 10 per day; mark `log.csv` after every send and every reply.
- Never invent facts about a business in a reply — use what's in
  `private/leads/leads.csv` or ask the coordinator.
