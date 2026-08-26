# Vahan Mitra

*Zero trips. Zero jargon. Zero agents.*

A citizen-side redesign of Parivahan Sewa for the "Build What Moves India" hackathon. Frontend-only demo — there is no backend and there will never be one. Every screen exists to prove one thesis: stop shipping a service directory, start shipping an intent resolver.

## Running it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). There is nothing to configure — no `.env`, no API keys, no database.

## Demo logins

The landing page is the only entry point. Every persona uses OTP `1234`.

| Persona | Click path | What it shows |
|---|---|---|
| **Ananya Verma** — `9876500001` | Click her persona card. Logs straight in, no OTP needed. | The clean run: 1 vehicle, 2 fines, one clear-cut proactive nudge. Use this for the main demo. |
| **Rakesh Yadav** — `9876500002` | Click his persona card. | A commercial operator: 6 challans across 3 states, an expiring licence, and one application stuck partway through verification. |
| **Sunita Devi** — `9876500003` | Click her persona card, or click "Use mobile OTP", enter `9876500003` + `1234`. | The zero state — no vehicles, no documents, no fines. Hindi is her default language. Shows every empty state in the app and the voice-input fallback. |

The "Use mobile OTP" link on the landing page opens a dialog pre-filled for Ananya's number; enter `1234` to sign in through that path instead of the card click.

A **Reset demo** button lives in the top bar on every authenticated screen. It clears the persisted store and reseeds all three personas in under a second — use it between takes.

## A 2-minute demo click path

1. **0:00–0:15 — Landing.** Show the pitch and the complexity-meter comparison strip, then click Ananya's persona card.
2. **0:15–0:35 — Home.** Point out the proactive card labelled "You didn't ask for this. We noticed," the number-plate chips, and the fee/day complexity strip.
3. **0:35–0:55 — Ask.** Type (or let the mic fallback type) a plain-language intent like "I bought a used bike." Show the resulting task plan with legal names demoted under plain ones.
4. **0:55–1:20 — Apply.** Start a task from the plan. Walk through the one-document-per-screen wizard, let the OCR scan-line sweep run, and submit with one document still missing to show the partial-submission deadline instead of a hard block.
5. **1:20–1:35 — Track.** Open the resulting application. Show the status rail and the file trail ("who's touched this") with desk names and timestamps, no red banners.
6. **1:35–1:50 — Fines.** Go to Fines. Pay one challan, dispute another (point out the pre-filled reason and statement), and mention the waiver arrives on its own a few seconds later — no need to wait for it on camera.
7. **1:50–2:00 — Hindi + reset.** Switch the language toggle to हिं, log out, and sign in as Sunita to show the zero-vehicle empty states in Hindi. Close on the Reset demo button.

## What's mocked, and why

Everything on screen — vehicles, fines, documents, applications, RTO desks, OCR results — comes from `lib/mockData.ts` and is read through `lib/mockApi.ts`, which wraps each call in a fixed, non-random delay (250–450ms for reads, 600–900ms for writes, 1200ms for OCR) so the pacing of a live demo never varies between runs. There's a frozen "today" (`MOCK_TODAY`) so relative dates like "expires in 11 days" never drift, and every fallback path — no microphone, no camera, no network — reproduces the same on-screen result as the real thing, because the goal of this build is to survive a stage with no working internet, not to simulate one that has it.

## Known gaps

- No live browser was available in the environment this was built in, so breakpoint behaviour (375–1920px), 110% zoom clipping, and the bottom-drawer sheets on mobile are verified by code/CSS review only, not by visual testing — worth a manual pass before presenting.
- `buildDisputeStatement()`'s generated legal statement text is English-only; it doesn't switch with the Hindi toggle (see `DECISIONS.md`, D-020).
- Three components (`ThinkingSteps.tsx`, `ComplexityMeter.tsx`) still carry a pre-existing `react-hooks` lint violation from an earlier prompt that wasn't in scope for the polish pass — documented in `DECISIONS.md`, C-010.
