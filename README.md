# Vahan Mitra — Parivahan Sewa, rebuilt around what citizens actually want

Zero trips. Zero jargon. Zero agents.

## Live demo

**[vahan-mitra-inky.vercel.app](https://vahan-mitra-inky.vercel.app)** — deployed on Vercel, no login or setup needed.

| Persona | Mobile | OTP | What they show |
|---|---|---|---|
| Ananya Verma | 9876500001 | 1234 | The clean run: just bought a used bike, 2 open fines |
| Rakesh Yadav | 9876500002 | 1234 | Commercial vehicle, 6 fines across 3 states, a licence expiring, one filing stuck at an office |
| Sunita Devi | 9876500003 | 1234 | Zero state, Hindi-first, no vehicles yet, applies by voice |

The landing page has one-click login cards for all three, so no typing is needed. The mobile+OTP form works too; any OTP is accepted and the field prefills with `1234`.

Everything runs offline from seeded mock data. There is no backend and no account to create.

## The 90-second review path

1. **Log in as Ananya.** The dashboard already shows a "needs your action" card nobody asked for.
2. **Type or speak "I bought a used bike"** on `/ask`. Watch it resolve to a task plan with no form name typed anywhere.
3. **Open the plan.** Note the fee, the days, and tasks ordered by dependency, not alphabetically.
4. **Start a task.** One thing per screen. Scan a document; no camera needed, since sample documents stand in.
5. **Submit with something still missing.** It files anyway with the legal minimum and shows what's still owed, and by when.
6. **Open the tracker.** See which desk has the file and how many days it's spent there against the office average. No red banners.
7. **Dispute a fine on `/challans`.** It resolves on its own about 8 seconds later. Watch the status flip and the confetti.
8. **Switch to Hindi**, then click **Reset demo** in the top bar to return to seed state.

## The problem

Parivahan splits one life event — buying a bike, losing a licence — across four separate portals and a landing page with over a hundred links, each named after an internal government form. A citizen who just bought a bike has no idea that means "Form 29/30." That gap is the entire reason RTO agents exist, charging roughly ₹2,000 to do what should be a ₹530 job.

Ownership transfer, taken as a worked example, runs 47 questions across 4 portals and about 38 minutes today. This rebuild answers the same legal requirement in 9 questions, 1 screen, about 4 minutes. No regulation changed to get there.

Citizens don't know the name of the form they need. Every screen here is built to never make them name it.

## What we built

### The intent engine (`/ask`)
Type or speak a plain sentence, like "I bought a used bike," and it resolves to a task plan with fees, timelines, and dependency order, asking a clarifying question first if it's ambiguous. No service directory, no form names.

«SCREENSHOT: the /ask page mid-resolution, showing the "thinking" steps»

### Document scanning (inside `/apply/[taskId]`)
Each document step runs a simulated 1200ms OCR pass that reads back what it found and flags problems: a blurred RC, a name mismatch against Aadhaar. No camera in the room, no problem, since sample documents stand in.

«SCREENSHOT: DocScanDialog showing OCR-read fields and a flagged mismatch»

### Fines and disputes (`/challans`)
Every fine sits on a number-plate chip matching the vehicle's real plate style. Disputing one files a reasoned statement; it resolves on its own a few seconds later, accepted or not, with confetti if waived.

«SCREENSHOT: the challans page with a disputed fine mid-resolution»

### The proactive engine (dashboard)
On every login the dashboard reads the citizen's own data and surfaces tasks nobody asked for: an expiring licence, a lapsing PUC, each carrying the label "You didn't ask for this. We noticed."

«SCREENSHOT: Rakesh's dashboard with two proactive action cards»

### File tracking (`/track/[appId]`)
Every application lists which desk touched it, timestamped, with days at the current desk stated against the office average. No "DELAYED" banners, no red text.

«SCREENSHOT: the track page for Rakesh's stuck licence-renewal application»

## The thinking behind it

Three government redesigns proved this works without new laws:

- **Michigan** cut the country's longest benefits form by roughly 80%, same law, fewer questions. From this we took the discipline of justifying every field before adding it.
- **Singapore** cut birth registration from about 60 minutes to 15 by bundling the process around the life event instead of the agency. That gave us the task-plan model: one query, several agency-owned tasks.
- **Estonia** made it illegal for the state to ask a citizen for the same information twice. The principle behind it, not the law itself, is why a document scanned once fills every field that needs it downstream.

## What is mocked, and why

The OCR, the intent matching, and the dispute adjudication are all simulated: no real vision model, no real NLP, no real RTO backend behind any of it. The brief asked for a redesign of the citizen experience, not a piece of government infrastructure, so the effort went into interaction design instead. It also means the demo runs identically every time instead of failing on conference wifi.

All seed data lives in `lib/mockData.ts`. Every read or write goes through `lib/mockApi.ts`, which wraps that data in a fixed-latency promise. Swapping in a real backend means rewriting `lib/mockApi.ts`. Nothing else in the app knows the data isn't real.

## What is not built

- No admin, RTO-staff, or dealer views. Scoped to the citizen only.
- Vehicles isn't in the 5-item mobile bottom nav, an intentional cut to keep the bar at five; vehicle status still shows on the mobile dashboard.
- No real payment flow. Paying a fine flips its status locally with no gateway behind it.
- Next up: a real OCR/NLP backend behind the same `mockApi.ts` boundary, and a payments integration.

## Accessibility and language

Every string, including proactive-engine text generated at runtime and relative dates, ships in both English and Hindi. Toggle it from the top bar on any screen. Motion respects `prefers-reduced-motion`, and the status rail and OCR result panel use `aria-live="polite"` for screen readers.

## Stack

- Next.js 15 (App Router) + TypeScript, strict mode
- Tailwind CSS v4, shadcn/ui components
- framer-motion for the status rail, plate stamps, and entrance animation
- zustand with `persist`, so the entire demo survives a hard refresh
- sonner for toasts

## Running it locally

```bash
git clone <this repo>
cd vahan-mitra
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Credits

Harsh Sharma — [@HarshSharma07k](https://github.com/HarshSharma07k)

Built for **Build What Moves India**.
