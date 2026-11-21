// Parse OSM opening_hours into a readable table + schema.org data.
// Returns null when the string can't be confidently parsed (caller shows raw text).
const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_RE = /^(Mo|Tu|We|Th|Fr|Sa|Su)(?:-(Mo|Tu|We|Th|Fr|Sa|Su))?$/;
const TIME_RE = /^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/;

function expandDays(spec) {
  const days = new Set();
  for (const part of spec.split(",")) {
    const m = part.trim().match(DAY_RE);
    if (!m) return null;
    const a = DAYS.indexOf(m[1]);
    const b = m[2] ? DAYS.indexOf(m[2]) : a;
    if (a <= b) for (let d = a; d <= b; d++) days.add(d);
    else for (let d = a; d <= b + 7; d++) days.add(d % 7); // wraps e.g. Sa-Mo
  }
  return days;
}

function fmtTime(h, m) {
  const hh = Number(h);
  const ampm = hh < 12 ? "AM" : "PM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${m} ${ampm}`;
}

// Parse one rule's time spec -> array of {open, close} or "off" or null.
function parseTimes(spec) {
  const s = spec.trim();
  if (/^(off|closed)$/i.test(s)) return "off";
  if (/^24\/7$/.test(s)) return [{ open: "00:00", close: "23:59" }];
  const spans = s.split(",").map(p => p.trim());
  const out = [];
  for (const p of spans) {
    const m = p.match(TIME_RE);
    if (!m) return null;
    out.push({ open: `${m[1].padStart(2, "0")}:${m[2]}`, close: `${m[3].padStart(2, "0")}:${m[4]}` });
  }
  return out;
}

function spanText(spans) {
  return spans.map(s => `${fmtTime(...s.open.split(":"))} – ${fmtTime(...s.close.split(":"))}`).join(", ");
}

export function parseOpeningHours(raw) {
  const s = (raw || "").trim();
  if (!s) return null;
  if (/^24\/7$/.test(s)) {
    return {
      rows: [{ days: "Monday – Sunday", times: "Open 24 hours", dayIdxs: [0, 1, 2, 3, 4, 5, 6] }],
      perDay: DAY_NAMES.map(() => "Open 24 hours"),
      schema: [{ "@type": "OpeningHoursSpecification", dayOfWeek: DAY_NAMES, opens: "00:00", closes: "23:59" }],
    };
  }
  const rules = s.split(";").map(r => r.trim()).filter(Boolean);
  const perDay = Array(7).fill(null); // each: array of {open,close} | "off" | null
  const schemaRules = [];
  for (const rule of rules) {
    let daySpec = null;
    let timeSpec = rule;
    const m = rule.match(/^([A-Za-z][A-Za-z,\- ]*?)\s+(.+)$/);
    if (m) {
      const candidate = m[1].replace(/\s+/g, "");
      if (candidate.split(",").every(p => DAY_RE.test(p.trim()))) {
        daySpec = candidate;
        timeSpec = m[2];
      } else if (/\b(PH|SH)\b/.test(candidate)) {
        continue; // public/school holiday rules don't belong on a weekly table
      } else {
        return null;
      }
    }
    const times = parseTimes(timeSpec);
    if (times === null) return null;
    const days = daySpec ? expandDays(daySpec) : new Set([0, 1, 2, 3, 4, 5, 6]);
    if (!days) return null;
    if (times === "off") {
      for (const d of days) perDay[d] = "off";
    } else {
      for (const d of days) perDay[d] = times;
      schemaRules.push({ days: [...days].sort(), times });
    }
  }
  if (!perDay.some(Boolean)) return null;

  // Display rows: group consecutive days with identical text.
  const perDayText = perDay.map(v => (v === "off" ? "Closed" : v ? spanText(v) : "Closed"));
  const rows = [];
  let start = 0;
  for (let d = 1; d <= 7; d++) {
    if (d === 7 || perDayText[d] !== perDayText[start]) {
      const dayIdxs = [];
      for (let k = start; k < d; k++) dayIdxs.push(k);
      rows.push({
        days: d - 1 === start ? DAY_NAMES[start] : `${DAY_NAMES[start]} – ${DAY_NAMES[d - 1]}`,
        times: perDayText[start],
        dayIdxs,
      });
      start = d;
    }
  }
  const schema = schemaRules.map(r => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: r.days.map(d => DAY_NAMES[d]),
    opens: r.times[0].open,
    closes: r.times[r.times.length - 1].close,
  }));
  return { rows, perDay: perDayText, schema };
}
