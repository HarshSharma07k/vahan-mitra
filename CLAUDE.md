# CLAUDE.md — Vahan Mitra

Read this before writing any code in this repo. Every decision below is already made. Do not re-open them, do not offer alternatives, do not ask which approach I prefer. Build to the spec.

---

## What this is

A citizen-side redesign of Parivahan Sewa (India's transport services portal) for the "Build What Moves India" hackathon. It is a **frontend-only demo**. There is no backend, and there will never be one.

Product name: **Vahan Mitra**. Tagline: *Zero trips. Zero jargon. Zero agents.*

The core thesis, which every screen must serve: **stop shipping a service directory, start shipping an intent resolver.** Citizens do not know the name of the form they need. Never make them name it.

Scope is the citizen only. No admin, no RTO staff, no dealer views.

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15, App Router, TypeScript strict |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui (new-york style, neutral base) |
| Icons | lucide-react only |
| Motion | framer-motion |
| State | zustand with `persist` middleware, key `vahan-mitra-v1` |
| Toasts | sonner |
| Charts | none — do not add a chart library |

Do not add any dependency not listed here without being asked. Specifically: no react-hook-form, no zod, no tanstack-query, no axios, no redux, no next-auth, no i18next.

## Commands

```bash
npm run dev          # http://localhost:3000
npm run build        # must pass with zero type errors before any commit
npx shadcn@latest add <component>
```

---

## Non-negotiable rules

### 1. No network. Ever.
No `fetch`, no `axios`, no API routes, no server actions that hit anything. Every piece of data originates in `lib/mockData.ts`. If a screen needs data that does not exist there, **add it to `mockData.ts` first**, then consume it.

### 2. All latency is simulated, never real.
Every read or write goes through `lib/mockApi.ts`, which wraps the mock data in a promise:

```ts
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
export async function getChallans(citizenId: string) {
  await wait(320);
  return mockChallans.filter((c) => c.citizenId === citizenId);
}
```

Latency budget: reads 250–450ms, writes 600–900ms, OCR 1200ms, intent resolution 1600ms. Never random. A demo that runs differently each time is a demo that fails on stage.

### 3. Deterministic, seeded, resettable.
No `Math.random()` anywhere. No `new Date()` for anything the user sees — use `MOCK_TODAY` from `mockData.ts` so relative dates ("expires in 11 days") never drift. A **Reset demo** button in the top bar clears the persisted store and reseeds in under a second.

### 4. The demo must never fail.
Every capability that depends on the environment needs a fallback that produces the same on-screen result:
- Web Speech API unavailable or permission denied → type the scripted transcript out character by character.
- Camera unavailable → the drop zone offers three sample documents from `/public/mock/`.
- No file uploaded → a **Use sample document** button.

Assume: no microphone, no camera, no network, and a projector at 1440px. Build for that machine.

### 5. Loading and empty states are part of the feature.
Every async surface gets a skeleton, not a spinner. Every empty list gets an `EmptyState` with a heading, one line of direction, and a button that does the obvious next thing. An empty screen is an invitation to act, not a shrug.

---

## Form and flow rules

These come from projects that won awards for exactly this kind of redesign. Follow them literally.

**One thing per screen.** Every wizard step asks for one thing. GDS tested the alternatives and found single-question pages work better for low-confidence users, work better on mobile, and handle errors, branching and saved progress better. An address counts as one thing even though it has several fields.

**Justify every field.** Before adding an input, write down who needs the answer and what breaks if you don't ask. If you can't answer both, delete the field. The complexity-meter number is the direct product of this discipline, so a field you couldn't justify is a point you gave away.

**Never all-or-nothing.** The citizen can file with the legal minimum and owe the rest by a deadline. No session timeouts, progress saved on every step, a visible back link on every screen.

**Proactive before requested.** The system reads the citizen's own data on every dashboard load and opens tasks nobody asked for — expiring licence, expiring PUC, ownership still pending, loan closed but bank still on the RC. Every proactive card carries the label "You didn't ask for this. We noticed." in 11px muted.

**Reminders are opt-out and visible.** Show the citizen the actual schedule and the actual message text, with a mute toggle. Never a settings checkbox buried three screens deep.

**Show who touched the file.** Every application lists each desk and system that opened it, timestamped, plus days-at-current-desk against the office average. State the numbers flatly. No red "DELAYED" banners, no blame, no exclamation marks.

## Design system

### Colour

Declare these as CSS variables in `globals.css` and map them into the Tailwind theme. Use the token names in code, never raw hex.

```css
--brand: #0F766E;        /* primary actions, active nav, focus ring */
--brand-soft: #F0FDFA;   /* selected rows, active stage bg */
--plate: #FFD400;        /* commercial plates + "needs your action" ONLY */
--ink: #0C0A09;          /* body text, private plates */
--muted: #57534E;        /* secondary text, labels */
--canvas: #FAFAF9;       /* page background */
--surface: #FFFFFF;      /* cards */
--line: #E7E5E4;         /* borders, dividers */
--ok: #059669;           /* verified, approved, waived */
--warn: #D97706;         /* expiring, low confidence */
--danger: #DC2626;       /* rejected, blocked, unpaid */
```

Teal is deliberate: this must not look like a government portal. `--plate` yellow has exactly two jobs (commercial number plates, and the "action needed" indicator). It is never a button, never a background for text, never decoration.

### Type

| Role | Face | Setting |
|---|---|---|
| Display, plates | Archivo 700–800 | headings `tracking-tight`; plates `tracking-[0.15em] uppercase` |
| Body, UI | Inter 400–600 | 15px base, 1.55 line height |
| Data | JetBrains Mono 500 | registration numbers, challan IDs, application IDs, all ₹ amounts |
| Hindi | Noto Sans Devanagari | applied via `:lang(hi)` so it never touches Latin text |

Load all four through `next/font/google` in `app/layout.tsx` as CSS variables. Type scale: 32 / 24 / 19 / 15 / 13 / 11. Six sizes. Do not invent a seventh.

### The signature element

**Every vehicle renders as an actual Indian number plate.** Build `components/common/PlateChip.tsx` once and use it everywhere a vehicle appears — dashboard, plan cards, challan cards, tracker, garage.

- Private (`TWO_WHEELER`, `LMV`): white background, `--ink` text, 2px `--ink` border.
- Commercial (`GOODS`, `TRANSPORT`): `--plate` background, `--ink` text.
- Archivo 800, uppercase, `tracking-[0.15em]`, `rounded-[4px]`, formatted `HR 26 DK 8337` with real spacing.
- Sizes `sm | md | lg`. Never stretch it, never round it more than 4px, never put it on a coloured background.

### Everything else

- Radius: `rounded-2xl` cards, `rounded-xl` inputs and buttons, `rounded-full` chips.
- Shadow: one only. `shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)]`. Never nest shadows.
- Spacing: 4px base. Page gutter 16px mobile, 32px desktop. Card padding 20px.
- Borders: 1px `--line`. Do not use borders and shadows on the same element.
- Motion: 150ms for hover and colour; 240ms `ease-out` for entrances; spring `{ stiffness: 260, damping: 24 }` for the status rail, bounding boxes, and plate stamps. Wrap every animation in a `prefers-reduced-motion` check.
- Dark mode: **not supported.** Do not write dark: variants.

---

## Component rules

- `components/ui/` is shadcn output. Never hand-edit it. To restyle, wrap it or pass `className`.
- Every component is a named export in its own file, `PascalCase.tsx`, matching the component name.
- Default to server components. Add `"use client"` only for state, effects, or event handlers.
- Props interfaces live in the same file, named `<Component>Props`. No `any`. No `React.FC`.
- Max ~150 lines per component. Past that, extract.
- Compose with `cn()` from `lib/utils.ts`. No inline `style` except for dynamic bounding-box coordinates.
- Icons: 16px inline with text, 20px in buttons, 24px in nav. `strokeWidth={1.75}` everywhere.

## State rules

One store, `store/useAppStore.ts`:

```ts
{
  session: { citizenId: string | null; lang: "en" | "hi" };
  wallet: WalletDocument[];
  vehicles: Vehicle[];
  challans: Challan[];
  applications: Application[];
  plans: TaskPlan[];
  // actions: login, logout, setLang, addDocument, resolveIntent,
  //          startApplication, submitApplication, payChallan,
  //          disputeChallan, resetDemo
}
```

Persisted with the `persist` middleware. Derived values (totals, counts, "action needed" lists) are computed in selectors or components, never stored. Timers set by the store (the 8-second dispute resolution) must be cleared on `resetDemo`.

---

## Writing the interface copy

Copy is design material here, not filler. It is most of what makes this better than the original.

- **Name things the way a citizen would.** "Transfer ownership", not "Form 29/30 submission". "Fines", not "Challan disposal".
- **Demote jargon, never hide it.** Plain name in 19px, the legal form name in 11px `--muted` underneath. Citizens still need the real term when they reach an office.
- **Active voice on every control.** "Pay ₹500", not "Submit". The verb on the button is the verb in the toast: *Pay* → *Paid*.
- **Errors name the field and the fix.** Not "Validation failed". Instead: "This document reads HARSH SHARMA. Your Aadhaar says HARSH KUMAR SHARMA. RTOs reject on this. Which one is correct?"
- **Never apologise in an error.** State what happened and what to do.
- Sentence case on every heading and button. No Title Case.
- **Money:** always `₹` with Indian grouping (`₹1,03,000`), in JetBrains Mono. Use `formatINR()`.
- **Dates:** `12 Mar 2026`. Relative form for anything under 14 days ("in 11 days", "9 days ago").
- **Hindi:** all user-facing strings go through `t()` in `lib/i18n.ts`. Both `en` and `hi` keys required, always. Hindi is a real user path in this demo, not a toggle that half-works — check every screen at the longest Hindi string.

---

## Accessibility floor

Ship these without being asked: visible focus rings using `--brand`, labels on every input, `aria-live="polite"` on the status rail and the OCR result panel, 44px minimum touch targets, keyboard operability for the intent box and the dispute sheet, and `prefers-reduced-motion` respected everywhere.

---

## Definition of done, per screen

1. Works on mobile (375px) and desktop (1440px).
2. Loading skeleton, empty state, and error state all implemented.
3. Reads correctly in Hindi with no overflow.
4. Keyboard-operable, focus visible.
5. `npm run build` passes clean.
6. Survives a hard refresh with state intact.
7. `Reset demo` returns it to seed state.

---

## Engineering log — DECISIONS.md

Maintain `DECISIONS.md` at the repo root. It is a running record for me, not
documentation for users. It is gitignored, so it never ships.

**Write to it when, and only when:**
- You make a non-obvious engineering choice, or pick between real alternatives
- You hit a bug, build failure, or environment problem that took more than one
  attempt to resolve
- You deviate from anything in CLAUDE.md, for any reason
- You finish a numbered prompt (append a one-line milestone)

Do NOT log routine work. "Created the Button component" is noise. If there was
no fork in the road and nothing broke, there is nothing to log.

**Append, never rewrite.** Newest entries at the bottom of their section. Never
edit or delete an earlier entry, even if it turned out to be wrong — add a new
entry that supersedes it and say so.

**Formats — use exactly these:**

Decisions:
    ### D-007 · <what was decided>
    **Date:** 2026-08-23 · **Prompt:** 3
    **Chose:** <the option taken>
    **Over:** <the real alternative you rejected>
    **Because:** <one or two sentences, concrete>
    **Cost:** <what this makes harder later, or "none">

Challenges:
    ### C-004 · <one-line symptom>
    **Date:** 2026-08-23 · **Prompt:** 3
    **Symptom:** <the exact error text or observed behaviour>
    **Cause:** <the actual root cause, not the first guess>
    **Fix:** <what resolved it>
    **Attempts:** <how many tries, and what failed first>

Number entries sequentially and never reuse an ID. Keep each entry under 80
words. Report at the end of your turn which IDs you added, one line, nothing more.

---

## Do not

- Do not add a backend, database, API route, or auth library.
- Do not call `Math.random()` or bare `new Date()` in anything the user sees.
- Do not use `any`, `@ts-ignore`, or `eslint-disable`.
- Do not add dark mode, a chart library, or a dependency not listed above.
- Do not hand-edit `components/ui/`.
- Do not write placeholder copy. Every string ships as if a judge will read it aloud, because one will.
- Do not build admin, RTO-staff, or dealer views.
- Do not use emoji in the interface.
- Do not use gradients, glassmorphism, or more than one shadow depth.
- Do not stop and ask which option I prefer. The spec decided. Build it.
