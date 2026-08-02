# SMF 01 · Dying Patch

A faithful port of the original Slime Mold Foundry prototype (React + three.js)
into this monorepo — the validated baseline the other `smf-*` prototypes are
measured against. Full design context:
[`docs/slime-mold-foundry/design.md`](../../docs/slime-mold-foundry/design.md)
(see §6 for this scenario's findings).

## Design question

Does the grow / dorm / resorb organism loop work end-to-end — value field
dynamics, rig hysteresis, dormancy cascade, gradient-reversal growth, and
resorption funding relocation — with no player input?

## Hypothesis

Pouring a decaying, diffusing value field from a signal rig (probe → tank →
threshold gate → emitter) is enough policy for a colony to abandon a depleted
ore patch and rebuild itself at a surveyed one, partly financed by eating its
own dormant structures. **Status: validated** (this prototype predates the
brief; it's the reference, ported unchanged).

## How this prototype tests it

Outpost ALPHA runs on a small patch (reserve 40); a survey beacon holds a thin
field over the rich Patch B (reserve 240). ALPHA depletes → extraction tapers →
the rig's tank drains through the hysteresis band → gate closes → the field
decays → structures go dormant, then get marked for resorption → the gradient
reverses toward B → builder bots construct outpost BETA, funded in part by
resorption refunds. The scenario is unattended; the HUD checklist and the
headless harness assert the same milestone flags.

## Run it

```bash
npm run dev          # from this package: live dev server
npx vite build       # production build (what the gallery serves)
node harness.mjs     # headless sim test — also `npm test`
```

The harness doesn't import a `sim.js` — the component stays verbatim, so it
slices `src/Scenario01.jsx` between the `CONSTANTS` and `VIEW LAYER` banner
comments (the sliced sim imports nothing and touches no DOM), evaluates it
with `new Function`, runs to completion, prints the milestone timeline + perf
stats, and asserts the ordered timeline with `done` before T+180s.

## Controls

Drag = pan · wheel / pinch = zoom (zoom far out for the tile-LOD view) ·
speed buttons ⏸ ×1 ×8 ×32 · HIDE toggles the telemetry panel.

## Milestones (asserted in order)

`start` → `deplete` → `gateClosed` → `alphaDorm` → `grow` → `resorb1` → `done`

Harness reference run: deplete T+16.7 · gateClosed T+36.0 · alphaDorm T+39.2 ·
grow T+46.2 · resorb1 T+69.0 · **done T+98.0s** (980 ticks, ~20 µs/tick) —
matching the design doc's ~98s arc exactly.

## Findings

- **The port needed zero component changes.** `Scenario01.jsx` builds as-is
  under the plain shared Vite config — Vite 5's automatic JSX runtime handles
  `.jsx` with no plugin and no esbuild overrides.
- **Banner comments are a real extraction seam.** The source-slicing harness
  (per the design doc appendix) works exactly as described: the slice between
  the two banners is pure JS, and the headless timeline reproduces the
  documented 98-second arc tick-for-tick.
- Only addition outside the component: a `data:` favicon link in `index.html`,
  because the browser's automatic `/favicon.ico` request 404s against a bare
  static server and pollutes an otherwise-clean console.
- Kept as-is per the brief: the Google Fonts `@import` (this port's allowed
  exception to the no-runtime-network rule; its fallbacks degrade fine).
