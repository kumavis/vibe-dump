# SMF 03 · Parts Bench

Slime Mold Foundry prototype 03 — the signal-expressiveness pressure test.
Companion docs: `docs/slime-mold-foundry/design.md` (§2, §4.1, §8) and
`docs/slime-mold-foundry/prototype-brief.md` (§4).

## Design question

The design doc's biggest stated risk (§8, first open question): **is
computation-as-plumbing — physical signal parts, no scripting language, no
node editor — expressive enough for real control policies?** Node editors are
boring because they have no scarcity; this game bets that valves, tanks and
gates that jam, saturate and chatter can carry the whole control plane. If
that bet fails, L6 fails.

## Hypothesis

A player can solve genuine control contracts (scaling, mixing, averaging,
conditional routing, hysteresis) with nothing but placeable parts and traces —
and where the parts list falls short, the *shortfall itself* is legible enough
to name the missing part. Documented failures of the parts list are a success
condition of this prototype, not a bug.

## How this prototype tests it

A 14×9 schematic bench. Left edge: four deterministic sources (constant 10/s ·
square 0↔12 every 8 s · sine 2..8 every 20 s · triangle 0..10 every 30 s).
Right edge: one contract socket. Five contracts, selectable as tabs (each tab
keeps its own board, so earlier solutions stay solved):

1. **HALF** — deliver 5±0.5 from the constant *(one valve)*
2. **BLEND** — deliver 0.5·sine + 0.5·const ±1 *(two valves + merge)*
3. **STEADY** — deliver 6±1 from the square wave *(tank as averaging)*
4. **GUARD** — deliver the constant only while sine < 4, else 0 *(NC gate: sine→SENSE, const→FLOW)*
5. **LATCH** — 4/s while latched open at ≥6 / closed below 2 *(the Scenario 01 rig, rebuilt from parts)*

The scrolling scope strip shows target band vs actual; a contract passes after
**12 consecutive in-tolerance seconds** (progress bar fills along the scope).
Every failure is visible in-world: saturated traces glow red and shed excess,
a starved ratio-gate side glows, gates flicker when their SENSE hovers at N,
tanks read FULL/EMPTY at a glance, and cycles flash red `CONFUSED` while
carrying 0 — never an error dialog.

**The harness is an existence proof.** `node harness.mjs` builds a known-good
solution to all five contracts through the *same* `act()` API the mouse uses
(place / traceRun / tune / mode / rotate / remove / puzzle), deliberately
saturates a trace mid-BLEND and chatters a gate mid-GUARD, and asserts
`p1..p5 + firstSaturation + firstChatter` all fire. It exits non-zero if the
parts list can't solve a contract.

## Controls

Palette: click a part, click a cell to place (costs shown in amber — signal
infrastructure costs matter). Drag on the board = draw a trace, cell by cell;
end the drag on a part/socket to aim into it. SELECT + vertical drag on a
valve/gate/tank tunes k / N / drain (value shown); the inspector strip has the
precise slider, NO↔NC toggle, rotate and remove. `R` rotate · right-click
remove · `1–5` contracts · `Esc` deselect · speed ⏸ ×1 ×4 ×16.

## Milestones

`p1 p2 p3 p4 p5` (contract passes) · `firstSaturation` (a trace over 20/s) ·
`firstChatter` (a gate flips ≥3× in 2 s).

## Running

```bash
npm run dev      # from packages/smf-parts-bench
node harness.mjs # headless existence proof + perf (also: npm test)
```

Reference harness run: all five contracts solved in 131.7 sim-seconds,
~14 µs/tick (1317 ticks, ~18 ms wall).

## Findings

Real ones, discovered while building. Each is exactly the kind of evidence
this bench exists to produce.

**1. The one-input threshold gate cannot express GUARD — the gate needs two
ports.** The design doc's gate (§4.1) has a single input: "opens above N
tokens/min". That gate can only *self-gate*: "pass X while X ≥ N". GUARD asks
for "pass X while **Y** < 4" — the routed stream and the deciding stream are
different goods, and with one port the decision signal *is* the payload. No
composition of the other parts recovers this (merge destroys the distinction;
ratio-gate min() is symmetric). The minimal fix, adopted here: **SENSE and
FLOW as separate ports** — FLOW enters the gate's rear and passes straight
through; SENSE taps in from a perpendicular side. GUARD also forced a **NC
mode** (pass while SENSE < N); the doc's gate is normally-open only. This is a
real amendment the design doc should absorb: *the conditional is a two-port
part, and mode (NO/NC) is a property of it.*

**2. The tank as written cannot average — drain must be tunable and cap 10 is
too small.** STEADY wants 6±1 from a wave whose average is 6, and the doc's
tank drains at a fixed 4/s: the only steady rate any tank (or chain of tanks)
can emit is 4, so 6 is unreachable — there is also no splitter to top it up
from the same stream (finding 3). Fix adopted: **drain is drag-tunable
(0.5–8/s, default 4)**, which turns "tank as averaging" into an honest tuning
act — set the drain just under the incoming average (5.7 here) and let the
level ride. That exposes the second wall: at drain ≈6 the square's low phase
draws ~23 units from the level while the high phase banks ~25; a cap-10 tank
empties mid-phase every cycle and the output gaps to 0. **Cap raised to 30.**
The design doc predicted this shape of fix (§8): tank size and drain should be
*player-visible properties of the part*, not hidden globals.

**3. There is no splitter — one stream cannot feed two consumers.** A part
has one output cell; the bench never duplicates a rate. The contracts survived
because they combine *different* sources, but it bent LATCH: the spec's
"deliver the tank's drain" is delivered as a valved constant (4/s) through the
gate's FLOW port, while the tank's drain drives SENSE — one stream cannot be
both the payload and the decision. A stream-duplicating part (a manifold; the
doc's filter splitter routes, it doesn't copy) is the first part the set needs
next. This is the sharpest expressiveness strain the bench found.

**4. Chatter had to be modeled, not hoped for.** With deterministic smooth
sources and an exact comparator, a gate can flip at most twice per period —
nothing "chatters". The gate's "built-in narrow band" is implemented as: clean
crossings switch exactly at N, but a SENSE that *hovers* within ±0.12 of N for
more than 0.6 s makes the comparator flicker at ~3 Hz. That is what makes the
authored GUARD mistake real: N guessed at 8 sits on the sine's peak, where it
hovers for ~1.8 s each period — the gate flaps, the bay would flood. Honest
caveat: true emergent chatter needs feedback (gate output influencing its own
sense), and this bench outlaws cycles (`CONFUSED`); in the full game, chatter
will emerge from plant feedback instead.

**5. Junctions merge implicitly.** Two traces converging on one trace cell
sum (capped at 20/s). The merge part is still the *legible* junction — its
sum is uncapped and it wears its own saturation glow — but grid adjacency
makes some free merging unavoidable. The scarcity holds anyway: the trace cap
is what bites (that is exactly how the BLEND draft failed: 10+12 = 22 into a
20/s trace).

**6. The 12-consecutive-seconds rule is what makes physical solutions
viable.** The rebuilt LATCH rig opens at t≡9.0 s exactly (SENSE crosses N with
the valved triangle) but closes ~0.8 s late — the close is a tank running
dry, not a threshold. It still passes, inside the 18 s open phase. Tolerance
in *time*, not just value, is load-bearing for plumbing-as-computation; exact
tracking through transitions would demand a language again.

## Verdict

Computation-as-plumbing **held, with amendments**. All five contracts —
scaling, mixing, low-pass averaging, conditional routing, hysteresis memory —
fell to seven part types and traces, solved through the same verbs a player
has, and every shortfall surfaced as a *nameable missing part* (a second gate
port, a tunable drain, a manifold) rather than as pressure for a scripting
language. Where it strains: anything needing a stream in two places at once
(finding 3), and precise timing at transitions (finding 6). Neither strain
asks for text — they ask for more plumbing. That is the answer §8 was
waiting on.
