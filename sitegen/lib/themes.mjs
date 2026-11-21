// Theme definitions: 5 category themes + generic fallback.
// Each theme: palette (WCAG-AA), font stacks, layout variant, inline SVG art,
// service bullet icon, category matching, schema.org type and fallback services.

const SVG_OPEN = (w = 480, h = 360) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-hidden="true">`;

/* ---------------- hero illustrations (abstract, per-theme) ---------------- */

const art = {
  trades: () => `${SVG_OPEN()}
    <rect width="480" height="360" fill="#0e2542"/>
    <g stroke="#1d4268" stroke-width="1">
      ${Array.from({ length: 9 }, (_, i) => `<line x1="${i * 60}" y1="0" x2="${i * 60}" y2="360"/>`).join("")}
      ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${i * 60}" x2="480" y2="${i * 60}"/>`).join("")}
    </g>
    <g transform="translate(118 58) rotate(-8 120 120)">
      <path d="M150 12 90 72a52 52 0 0 0-8 64 52 52 0 0 0 68 20l52 52a34 34 0 0 0 48-48l-52-52a52 52 0 0 0-20-68 52 52 0 0 0-64 8l60 60-42 42z" fill="#f5a524" opacity="0.95"/>
      <circle cx="222" cy="222" r="10" fill="#0e2542"/>
    </g>
    <rect x="0" y="316" width="480" height="44" fill="#0a1c33"/>
    <g fill="#f5a524"><rect x="26" y="330" width="60" height="6" rx="3" opacity=".8"/><rect x="102" y="330" width="34" height="6" rx="3" opacity=".5"/><rect x="396" y="330" width="58" height="6" rx="3" opacity=".8"/></g>
  </svg>`,

  beauty: () => `${SVG_OPEN()}
    <rect width="480" height="360" fill="#3b2833"/>
    <circle cx="240" cy="180" r="150" fill="#46303d"/>
    <g fill="none" stroke="#c98ba1" stroke-width="2.4" stroke-linecap="round">
      <path d="M240 300 C 240 210 200 170 150 130"/>
      <path d="M240 300 C 240 200 280 160 330 120"/>
      <path d="M240 300 C 250 230 240 160 240 84"/>
    </g>
    <g fill="#e7b7c8">
      <ellipse cx="150" cy="122" rx="26" ry="15" transform="rotate(-40 150 122)"/>
      <ellipse cx="330" cy="112" rx="26" ry="15" transform="rotate(40 330 112)"/>
      <ellipse cx="240" cy="70" rx="15" ry="26"/>
      <ellipse cx="185" cy="205" rx="22" ry="12" transform="rotate(-25 185 205)"/>
      <ellipse cx="295" cy="195" rx="22" ry="12" transform="rotate(25 295 195)"/>
    </g>
    <g fill="#f4dde6" opacity=".85"><circle cx="116" cy="70" r="5"/><circle cx="366" cy="62" r="5"/><circle cx="410" cy="140" r="4"/><circle cx="70" cy="150" r="4"/><circle cx="240" cy="330" r="5"/></g>
  </svg>`,

  food: () => `${SVG_OPEN()}
    <rect width="480" height="360" fill="#40291a"/>
    <g stroke="#55371f" stroke-width="14"><line x1="-40" y1="90" x2="520" y2="30"/><line x1="-40" y1="330" x2="520" y2="270"/></g>
    <g transform="translate(140 88)">
      <path d="M20 110 h160 v52 a80 46 0 0 1 -160 0 z" fill="#e8d8c3"/>
      <path d="M180 122 h22 a24 24 0 0 1 0 46 h-24" fill="none" stroke="#e8d8c3" stroke-width="10"/>
      <ellipse cx="100" cy="104" rx="82" ry="18" fill="#c9764a"/>
      <ellipse cx="100" cy="98" rx="82" ry="18" fill="#5a3218"/>
      <path d="M60 96 q10 -8 20 0 q10 8 20 0 q10 -8 20 0" stroke="#a4603a" stroke-width="4" fill="none"/>
      <g stroke="#e8d8c3" stroke-width="7" stroke-linecap="round" fill="none" opacity=".9">
        <path d="M78 68 q-14 -18 0 -36 q14 -18 0 -34"/>
        <path d="M122 68 q-14 -18 0 -36 q14 -18 0 -34"/>
      </g>
      <ellipse cx="100" cy="226" rx="118" ry="16" fill="#e8d8c3" opacity=".25"/>
    </g>
  </svg>`,

  automotive: () => `${SVG_OPEN()}
    <rect width="480" height="360" fill="#0d1014"/>
    <g stroke="#232b36" stroke-width="10" stroke-linecap="round">
      <line x1="0" y1="70" x2="300" y2="70"/><line x1="60" y1="120" x2="420" y2="120"/><line x1="0" y1="290" x2="360" y2="290"/>
    </g>
    <g transform="translate(240 190)">
      <circle r="118" fill="#1a2027"/>
      <circle r="118" fill="none" stroke="#ff5c38" stroke-width="6"/>
      <circle r="86" fill="#12161c" stroke="#2c3541" stroke-width="4"/>
      <g stroke="#ff5c38" stroke-width="10" stroke-linecap="round">
        ${Array.from({ length: 5 }, (_, i) => {
          const a = (i * 2 * Math.PI) / 5 - Math.PI / 2;
          const x2 = Math.cos(a) * 74, y2 = Math.sin(a) * 74;
          return `<line x1="0" y1="0" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
        }).join("")}
      </g>
      <circle r="26" fill="#ff5c38"/><circle r="12" fill="#0d1014"/>
    </g>
    <g fill="#ff5c38"><rect x="40" y="48" width="90" height="8" rx="4"/><rect x="40" y="64" width="48" height="8" rx="4" opacity=".55"/></g>
  </svg>`,

  wellness: () => `${SVG_OPEN()}
    <rect width="480" height="360" fill="#264534"/>
    <path d="M0 300 Q120 250 240 290 T480 270 V360 H0 Z" fill="#2f5540"/>
    <path d="M0 320 Q120 285 240 315 T480 300 V360 H0 Z" fill="#274734"/>
    <g transform="translate(240 120)">
      <g fill="none" stroke="#9ec9ad" stroke-width="3" stroke-linecap="round"><path d="M0 150 V20"/></g>
      <g fill="#a8d5b6">
        <ellipse cx="-42" cy="86" rx="34" ry="14" transform="rotate(-32 -42 86)"/>
        <ellipse cx="42" cy="66" rx="34" ry="14" transform="rotate(32 42 66)"/>
        <ellipse cx="-34" cy="22" rx="28" ry="12" transform="rotate(-38 -34 22)"/>
        <ellipse cx="30" cy="-2" rx="28" ry="12" transform="rotate(38 30 -2)"/>
        <ellipse cx="0" cy="-44" rx="13" ry="30"/>
      </g>
    </g>
    <g fill="#cfe8d7" opacity=".8"><circle cx="96" cy="90" r="4"/><circle cx="390" cy="70" r="4"/><circle cx="420" cy="160" r="3"/><circle cx="60" cy="180" r="3"/></g>
  </svg>`,

  generic: () => `${SVG_OPEN()}
    <rect width="480" height="360" fill="#26324f"/>
    <g fill="#31406a"><rect x="0" y="0" width="480" height="360" opacity="0"/><circle cx="408" cy="64" r="88" opacity=".55"/><circle cx="60" cy="320" r="70" opacity=".45"/></g>
    <g transform="translate(120 78)">
      <path d="M0 60 h240 v18 a12 12 0 0 1 -24 0 a12 12 0 0 1 -24 0 a12 12 0 0 1 -24 0 a12 12 0 0 1 -24 0 a12 12 0 0 1 -24 0 a12 12 0 0 1 -24 0 a12 12 0 0 1 -24 0 a12 12 0 0 1 -24 0 a12 12 0 0 1 -24 0 a12 12 0 0 1 -24 0 z" fill="#7ea0e8"/>
      <g fill="#c8d6f5"><rect x="0" y="60" width="24" height="16"/><rect x="48" y="60" width="24" height="16"/><rect x="96" y="60" width="24" height="16"/><rect x="144" y="60" width="24" height="16"/><rect x="192" y="60" width="24" height="16"/></g>
      <rect x="14" y="94" width="212" height="140" rx="10" fill="#1c2740"/>
      <rect x="30" y="112" width="86" height="70" rx="6" fill="#8fb0f0"/>
      <rect x="132" y="112" width="66" height="122" rx="6" fill="#2c3d63"/>
      <rect x="142" y="150" width="22" height="6" rx="3" fill="#7ea0e8"/>
    </g>
  </svg>`,
};

/* ---------------- service bullet icons (inline SVG, 1em) ---------------- */

const bullet = {
  trades: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.7 7.3a5.5 5.5 0 0 1-7.7 7.7l-6.6 6.6a2.1 2.1 0 0 1-3-3l6.6-6.6a5.5 5.5 0 0 1 7.7-7.7l-3 3 2.6 2.6z" fill="currentColor"/></svg>`,
  beauty: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2c2 3.4 6 4.6 6 9a6 6 0 0 1-12 0c0-4.4 4-5.6 6-9zm0 17a8 8 0 0 1-8-8h2a6 6 0 0 0 12 0h2a8 8 0 0 1-8 8z" fill="currentColor"/></svg>`,
  food: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 3h2v8H4zM8 3h2v8H8zM4 11h6v10H4zM14 3c3 2 5 5 5 8 0 2-1 3-2 3l1 7h-3l-2-9c-1-1-1-6 1-9z" fill="currentColor"/></svg>`,
  automotive: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11m-14 0h14a2 2 0 0 1 2 2v4h-2.2M5 11a2 2 0 0 0-2 2v4h2.2m0 0a2 2 0 1 0 4 0m-4 0h4m6 0a2 2 0 1 0 4 0m-4 0h4m-10 0h6" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  wellness: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21C7 17 3 13.5 3 9.5A4.5 4.5 0 0 1 11 7l1 1.3L13 7a4.5 4.5 0 0 1 8 2.5c0 4-4 7.5-9 11.5z" fill="currentColor"/></svg>`,
  generic: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" fill="currentColor"/></svg>`,
};

/* ---------------- themes ---------------- */

export const THEMES = {
  trades: {
    id: "trades",
    label: "Trades",
    fonts: { display: `system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif`, body: `system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif` },
    vars: {
      bg: "#f6f4ef", surface: "#ffffff", ink: "#17233b", muted: "#55607a",
      deep: "#10294a", "deep-ink": "#f3f7ff", "deep-muted": "#b7c5dd",
      accent: "#b45309", "accent-bg": "#f5a524", "accent-ink": "#1c1503", "accent-on-deep": "#f5a524",
      line: "#e5e1d6", chip: "#ece8dd", radius: "12px", "btn-radius": "8px",
    },
    layout: { hero: "split", services: "cards", infoGrid: true },
    headings: { services: "Services", hours: "Opening hours", location: "Find us", contact: "Get a quote" },
    eyebrow: c => `${c} · Brisbane`,
    art: art.trades,
    bullet: bullet.trades,
    dark: false,
    uppercaseHeadings: true,
  },

  beauty: {
    id: "beauty",
    label: "Beauty & hair",
    fonts: { display: `Didot,"Bodoni MT",Cochin,Georgia,"Times New Roman",serif`, body: `system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif` },
    vars: {
      bg: "#fbf7f4", surface: "#ffffff", ink: "#2e2229", muted: "#7a6672",
      deep: "#3b2833", "deep-ink": "#f9eff4", "deep-muted": "#d3b7c5",
      accent: "#9d4a63", "accent-bg": "#8e4160", "accent-ink": "#ffffff", "accent-on-deep": "#e7b7c8",
      line: "#eadfde", chip: "#f3e8ea", radius: "14px", "btn-radius": "999px",
    },
    layout: { hero: "center", services: "rows", infoGrid: false },
    headings: { services: "Services", hours: "Opening hours", location: "Visit us", contact: "Book an appointment" },
    eyebrow: c => `${c} · Brisbane`,
    art: art.beauty,
    bullet: bullet.beauty,
    dark: false,
    uppercaseHeadings: false,
  },

  food: {
    id: "food",
    label: "Café & food",
    fonts: { display: `"Palatino Linotype",Palatino,Georgia,"Times New Roman",serif`, body: `system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif` },
    vars: {
      bg: "#faf6ee", surface: "#fffdf8", ink: "#2a1f16", muted: "#6f5f4e",
      deep: "#40291a", "deep-ink": "#fbefe2", "deep-muted": "#d8bfa8",
      accent: "#a8462a", "accent-bg": "#b3502e", "accent-ink": "#ffffff", "accent-on-deep": "#e2a87e",
      line: "#e9dfd0", chip: "#f1e7d8", radius: "14px", "btn-radius": "10px",
    },
    layout: { hero: "center", services: "menu", infoGrid: true },
    headings: { services: "On the menu", hours: "Opening hours", location: "Find us", contact: "Order or book" },
    eyebrow: c => `${c} · Brisbane`,
    art: art.food,
    bullet: bullet.food,
    dark: false,
    uppercaseHeadings: false,
  },

  automotive: {
    id: "automotive",
    label: "Automotive",
    fonts: { display: `"Arial Narrow","Helvetica Neue",system-ui,"Segoe UI",sans-serif`, body: `system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif` },
    vars: {
      bg: "#15181d", surface: "#1c2129", ink: "#eef2f6", muted: "#9aa5b3",
      deep: "#0d1014", "deep-ink": "#f2f5f8", "deep-muted": "#8d99a8",
      accent: "#ff8a66", "accent-bg": "#ff5c38", "accent-ink": "#160b06", "accent-on-deep": "#ff8a66",
      line: "#2a313c", chip: "#232a34", radius: "10px", "btn-radius": "6px",
    },
    layout: { hero: "split", services: "checks", infoGrid: true },
    headings: { services: "Services & repairs", hours: "Workshop hours", location: "The workshop", contact: "Book it in" },
    eyebrow: c => `${c} · Brisbane`,
    art: art.automotive,
    bullet: bullet.automotive,
    dark: true,
    uppercaseHeadings: true,
  },

  wellness: {
    id: "wellness",
    label: "Health & wellness",
    fonts: { display: `ui-rounded,"SF Pro Rounded","Segoe UI",system-ui,sans-serif`, body: `system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif` },
    vars: {
      bg: "#f3f7f2", surface: "#ffffff", ink: "#223429", muted: "#5c6f62",
      deep: "#264534", "deep-ink": "#eef7ef", "deep-muted": "#b9d2bf",
      accent: "#33704f", "accent-bg": "#2c5a40", "accent-ink": "#ffffff", "accent-on-deep": "#a8d5b6",
      line: "#dde7dc", chip: "#e4efe3", radius: "18px", "btn-radius": "999px",
    },
    layout: { hero: "center", services: "cards", infoGrid: false },
    headings: { services: "Services", hours: "Clinic hours", location: "Visit the clinic", contact: "Book a visit" },
    eyebrow: c => `${c} · Brisbane`,
    art: art.wellness,
    bullet: bullet.wellness,
    dark: false,
    uppercaseHeadings: false,
  },

  generic: {
    id: "generic",
    label: "Local business",
    fonts: { display: `system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif`, body: `system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif` },
    vars: {
      bg: "#f5f7fb", surface: "#ffffff", ink: "#1d2433", muted: "#5b6579",
      deep: "#26324f", "deep-ink": "#eef2fb", "deep-muted": "#b7c3de",
      accent: "#3a57a6", "accent-bg": "#2f4b93", "accent-ink": "#ffffff", "accent-on-deep": "#a9bcf0",
      line: "#e1e6f0", chip: "#e8edf6", radius: "14px", "btn-radius": "10px",
    },
    layout: { hero: "split", services: "cards", infoGrid: true },
    headings: { services: "What we do", hours: "Opening hours", location: "Find us", contact: "Get in touch" },
    eyebrow: c => `${c} · Brisbane`,
    art: art.generic,
    bullet: bullet.generic,
    dark: false,
    uppercaseHeadings: false,
  },
};

/* ---------------- category matching ---------------- */

const CATEGORY_RULES = [
  { re: /plumb|electric|build|construct|carpent|paint|roof|til|landscap|garden|locksmith|handyman|trade|pest|clean|tree.?lopp|fenc|pool|air.?con|solar|renovat|glaz|plaster|cabinet|floor|pressure/i, theme: "trades" },
  { re: /hair|barber|beauty|nail|cosmetic|lash|brow|salon|spa|tattoo|wax|makeup/i, theme: "beauty" },
  { re: /caf|coffee|restaurant|bake|butcher|deli|food|takeaway|take.?away|pizza|sushi|thai|diner|grill|cater|gelato|juice|bar\b|pub|bistro|eatery|kebab|burger|fish|pies?|cak/i, theme: "food" },
  { re: /auto|car\b|mechanic|tyre|tire|panel|smash|detail|car.?wash|motor|brake|tow|exhaust|transmiss/i, theme: "automotive" },
  { re: /physio|chiro|massage|remedial|osteo|podiatr|psych|counsel|yoga|pilates|fitness|gym|health|wellness|vet|dental|optom|naturop|acupun|speech|occupational|dieti/i, theme: "wellness" },
];

const norm = c => String(c || "").toLowerCase().replace(/[_\-\.\/]+/g, " ");

export function themeFor(category) {
  const c = norm(category);
  for (const r of CATEGORY_RULES) if (r.re.test(c)) return THEMES[r.theme];
  return THEMES.generic;
}

/* ---------------- schema.org @type ---------------- */

export function schemaType(category) {
  const c = norm(category);
  const t = [
    [/plumb/, "Plumber"], [/electric/, "Electrician"],
    [/roof/, "RoofingContractor"], [/locksmith/, "Locksmith"],
    [/build|construct|carpent|renovat|paint|landscap|garden|handyman|til|fenc|pest|clean/, "HomeAndConstructionBusiness"],
    [/hair|barber/, "HairSalon"], [/nail|beauty|cosmetic|lash|brow|wax|makeup/, "BeautySalon"],
    [/tattoo/, "TattooParlor"], [/\bspa\b/, "DaySpa"],
    [/caf|coffee/, "CafeOrCoffeeShop"], [/bake/, "Bakery"], [/butcher/, "Butcher"],
    [/pizza|sushi|thai|restaurant|diner|grill|bistro|eatery|kebab|burger/, "Restaurant"],
    [/deli/, "Delicatessen"], [/takeaway|take.?away|fast.?food/, "FastFoodRestaurant"],
    [/tyre|tire/, "TireShop"], [/car.?wash|detail/, "AutoWash"],
    [/auto|car\b|mechanic|panel|smash|brake|exhaust|transmiss|motor/, "AutoRepair"],
    [/physio/, "PhysicalTherapist"], [/chiro|osteo|podiatr/, "MedicalBusiness"],
    [/massage|remedial/, "HealthAndBeautyBusiness"], [/yoga|pilates|fitness|gym/, "ExerciseGym"],
    [/vet/, "VeterinaryCare"], [/dental/, "Dentist"], [/psych|counsel/, "MedicalBusiness"],
  ];
  for (const [re, type] of t) if (re.test(c)) return type;
  return "LocalBusiness";
}

/* ---------------- fallback services per category ---------------- */

const SERVICE_SETS = [
  [/plumb/, ["Leak & pipe repairs", "Blocked drains", "Hot water systems", "Bathroom renovations", "General plumbing"]],
  [/electric/, ["Lighting & power points", "Switchboard upgrades", "Safety switches & testing", "Ceiling fans & appliances", "General electrical work"]],
  [/build|construct|carpent|renovat/, ["Renovations & extensions", "Decks & pergolas", "Repairs & maintenance", "Quotes & consultations"]],
  [/roof/, ["Roof repairs", "Guttering & downpipes", "Roof inspections", "Re-bedding & pointing"]],
  [/paint/, ["Interior painting", "Exterior painting", "Colour consultations", "Repairs & touch-ups"]],
  [/landscap|garden/, ["Garden maintenance", "Lawn care & mowing", "Landscaping & makeovers", "Hedging & pruning"]],
  [/locksmith/, ["Lock repairs & rekeying", "Lockouts", "Security upgrades", "Key cutting"]],
  [/clean/, ["Regular cleans", "One-off & spring cleans", "Bond & end-of-lease cleans", "Office cleaning"]],
  [/barber/, ["Haircuts & fades", "Beard trims & shaping", "Hot towel shaves", "Kids' cuts"]],
  [/hair/, ["Cuts & styling", "Colour & foils", "Blow waves & styling", "Treatments"]],
  [/nail/, ["Manicures & pedicures", "Gel & acrylic nails", "Nail art", "Nail care"]],
  [/beauty|salon|wax|brow|lash|cosmetic|makeup/, ["Facials", "Waxing & tinting", "Brow & lash services", "Skin treatments"]],
  [/tattoo/, ["Custom designs", "Fine line work", "Cover-ups", "Consultations"]],
  [/caf|coffee/, ["Coffee & tea", "Breakfast & brunch", "Sandwiches & light meals", "Cakes & pastries"]],
  [/bake/, ["Fresh bread", "Cakes & pastries", "Pies & savouries", "Special orders"]],
  [/restaurant|thai|sushi|pizza|grill|bistro|diner|eatery|kebab|burger/, ["Dine-in menu", "Takeaway", "Seasonal specials", "Functions & group bookings"]],
  [/butcher/, ["Quality cuts", "Sausages & smallgoods", "Roasts & BBQ packs", "Order ahead"]],
  [/tyre|tire/, ["Tyre supply & fitting", "Wheel alignment", "Puncture repairs", "Rotation & balancing"]],
  [/car.?wash|detail/, ["Wash & vacuum", "Interior detailing", "Polish & wax", "Pre-sale detailing"]],
  [/auto|car\b|mechanic|panel|smash|motor|brake|exhaust|transmiss/, ["Vehicle servicing", "Repairs & diagnostics", "Brakes & suspension", "Pre-purchase inspections"]],
  [/physio/, ["Physiotherapy", "Sports injuries", "Rehabilitation", "Back & neck care"]],
  [/chiro/, ["Chiropractic care", "Back & neck pain", "Posture & mobility", "Family care"]],
  [/massage|remedial/, ["Remedial massage", "Relaxation massage", "Sports massage", "Pregnancy massage"]],
  [/yoga|pilates/, ["Group classes", "Beginners welcome", "Private sessions", "Workshops"]],
  [/fitness|gym/, ["Gym access", "Group classes", "Personal training", "Fitness programs"]],
  [/vet/, ["Consultations", "Vaccinations", "Desexing & surgery", "Microchipping"]],
  [/florist|flower/, ["Bouquets & arrangements", "Wedding & event flowers", "Indoor plants & gifts", "Same-day orders"]],
  [/pet.?groom|groomer/, ["Grooming & clipping", "Wash & blow dry", "Nail trimming", "De-shedding tidy-ups"]],
];

export function defaultServices(category) {
  const c = norm(category);
  for (const [re, svcs] of SERVICE_SETS) if (re.test(c)) return svcs;
  return null; // caller hides the services section when nothing sensible exists
}

export function categoryLabel(category) {
  if (!category) return "Local business";
  const pretty = {
    car_repair: "Mechanic", physiotherapist: "Physiotherapy", fast_food: "Takeaway",
    cafe: "Café", nail_salon: "Nail salon", pet_grooming: "Pet grooming", tattoo: "Tattoo studio",
    sports_club: "Sports club", martial_arts: "Martial arts", coffee: "Coffee roaster",
  };
  const base = norm(category).split(":").pop().trim();
  const k = base.replace(/\s+/g, "_");
  if (pretty[k]) return pretty[k];
  return base.replace(/(^|\s)\w/g, m => m.toUpperCase()) || "Local business";
}

// Natural-language noun for prose: "a local plumber", "your local bakery".
const NOUNS = [
  [/plumb/, "plumber"], [/electric/, "electrician"], [/roof/, "roofer"],
  [/build|construct|carpent|renovat/, "builder"], [/paint/, "painter"],
  [/landscap|garden|tree.?lopp/, "landscaping team"], [/locksmith/, "locksmith"],
  [/clean/, "cleaning service"], [/pest/, "pest control service"], [/handyman/, "handyman"],
  [/til/, "tiler"], [/fenc/, "fencing contractor"], [/air.?con/, "air conditioning team"],
  [/solar/, "solar installer"], [/glaz/, "glazier"], [/plaster/, "plasterer"], [/pool/, "pool shop"],
  [/barber/, "barber shop"], [/hair/, "hair studio"], [/nail/, "nail salon"],
  [/tattoo/, "tattoo studio"], [/beauty|cosmetic|lash|brow|wax|makeup/, "beauty salon"], [/\bspa\b/, "day spa"],
  [/caf|coffee/, "café"], [/bake/, "bakery"], [/butcher/, "butcher shop"], [/deli/, "deli"],
  [/restaurant|thai|sushi|pizza|grill|bistro|diner|eatery/, "restaurant"],
  [/takeaway|take.?away|fast.?food|kebab|burger|fish|pies?/, "takeaway spot"],
  [/cater/, "caterer"], [/\bbar\b|pub/, "local bar"], [/cake|gelato|juice/, "sweet shop"],
  [/car.?wash|detail/, "car wash"], [/tyre|tire/, "tyre shop"],
  [/auto|car\b|mechanic|panel|smash|motor|brake|exhaust|transmiss|tow/, "workshop"],
  [/physio/, "physiotherapy clinic"], [/chiro/, "chiropractic clinic"],
  [/osteo|podiatr|speech|occupational|dieti/, "clinic"], [/massage|remedial/, "massage clinic"],
  [/yoga|pilates/, "studio"], [/fitness|gym/, "gym"], [/psych|counsel/, "practice"],
  [/health|wellness/, "clinic"], [/vet/, "vet clinic"], [/dental/, "dental practice"],
  [/optom/, "optometrist"], [/naturop|acupun/, "practice"],
  [/florist/, "florist"], [/bicycle|bike/, "bike shop"], [/pet.?groom/, "pet groomer"], [/pet/, "pet store"],
  [/tailor/, "tailor"], [/laundromat/, "laundromat"], [/dry.?clean|laundry/, "laundry"], [/photograph/, "photographer"],
  [/comput|phone|mobile|repair/, "repair shop"], [/jewel/, "jeweller"], [/print/, "print shop"],
  [/shoe|cobbler/, "shoe repair shop"], [/upholster/, "upholstery workshop"],
  [/hardware|tool/, "tool & hardware shop"],
  [/martial|taekwondo|karate|judo|boxing/, "martial arts academy"],
  [/sport|tennis|squash|sailing|bowls/, "sports club"],
];

export function proseNoun(category) {
  const c = norm(category);
  for (const [re, noun] of NOUNS) if (re.test(c)) return noun;
  return "business";
}
