# SMF 01 · Dying Patch

A port of the original Slime Mold Foundry prototype (React + three.js) into
this monorepo, then made **player-driven**: the original ran unattended, but
these scenarios exist to show how the *player* solves the challenge, so the
two decisions the original scripted now belong to the player. Full design
context:
[`docs/slime-mold-foundry/design.md`](../../docs/slime-mold-foundry/design.md)
(see §6 for this scenario's findings).

## Design question

The organism handles growth, dormancy, and retreat on its own — so what's
left for the player, and is it enough to make the scenario *play* rather
than *screen*? Here the player is the endocrine system with exactly two
hormones: **where to extend the field** (place the survey beacon) and
**whether the mold may eat its own limbs** (grant resorb authority — the
explicit ceremony from design doc §3).

## Hypothesis

Two well-placed decisions are enough to turn the validated organism loop
into a scenario: withhold either one and the colony visibly fails — no
beacon means no gradient to grow along; no authority means the Beta build
stalls half-funded while dormant Alpha sits as dead weight the mold is
begging to liquidate.

## How this prototype tests it

Outpost ALPHA runs on a small patch (reserve 40); the rich Patch B (reserve
240) sits unsurveyed. ALPHA depletes → the rig's tank drains through the
hysteresis band → gate closes → the field decays → **you place the survey
beacon at B** → structures go dormant → the gradient reverses toward B's
thin survey field → the mold asks for resorb authority → **you grant it** →
builder bots construct BETA, funded by the resorption refunds of ALPHA.
The HUD's YOUR MOVES card holds the two buttons; everything else is the
organism working. The harness plays both moves with reaction delays, then
runs a **no-input control** and asserts the colony stalls without you.

## Run it

```bash
npm run dev          # from this package: live dev server
npx vite build       # production build (what the gallery serves)
node harness.mjs     # headless sim test — also `npm test`
```

The harness doesn't import a `sim.js` — it slices `src/Scenario01.jsx`
between the `CONSTANTS` and `VIEW LAYER` banner comments (the sliced sim
imports nothing and touches no DOM), evaluates it with `new Function`, and
runs twice: the autoplayer (both moves, ~1.5s reaction delays) asserting
the milestone partial orders with `done` before T+240s, and the no-input
control asserting `grow` and `done` never fire without the player.

## Controls

Drag = pan · wheel / pinch = zoom (zoom far out for the tile-LOD view) ·
speed buttons ⏸ ×1 ×8 ×32 · **YOUR MOVES card: place the survey beacon,
grant resorb authority** · HIDE toggles the telemetry panel.

## Milestones

`start` → `deplete` → `gateClosed` → `beaconPlaced` (you) → `alphaDorm` →
`grow` → `resorbWanted` → `authority` (you) → `resorb1` → `done`
(`grow`/`authority` may race, so the harness asserts partial orders, not a
total one.)

Harness reference run: gateClosed T+36.0 · beaconPlaced T+37.6 · alphaDorm
T+39.2 · grow T+47.4 · resorbWanted T+53.0 · authority T+54.6 · resorb1
T+70.7 · **done T+99.7s** (~22 µs/tick). Control run: T+400s, no growth,
no completion, mold still waiting on authority.

## Findings

- **The unattended original was a demo, not a scenario.** Handing the player
  just two verbs — extend and permit — was enough to make it play, because
  both have visible failure modes: the no-input control stalls with a
  half-built BETA (bots build the affordable pieces, then wait on refunds
  that never come) and a dormant ALPHA the mold keeps asking to eat.
- **"Retreat funds extension" got sharper as a player choice.** Matter
  (45) can't cover BETA (95): granting resorb authority is what unblocks
  the build, so the design doc's emergent beat is now a decision you feel.
- **The port itself needed zero component changes** — Vite 5's automatic
  JSX runtime builds `.jsx` under the plain shared config. The player-verb
  redesign (`survey()` / `grantAuthority()`, the YOUR MOVES card) is this
  monorepo's addition, made after playtesting feedback that the original
  "doesn't fit — the user never does anything."
- **Banner comments are a real extraction seam** (per the design doc
  appendix): the sliced sim runs headless tick-for-tick.
- Only addition outside the component: a `data:` favicon link in
  `index.html` to keep a bare static server's console clean. The Google
  Fonts `@import` stays (this port's allowed exception; fallbacks degrade
  fine).
