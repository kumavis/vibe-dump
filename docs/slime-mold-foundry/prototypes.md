# Prototype Batch 01 — results & findings

Companion to `design.md` (the design doc) and `prototype-brief.md` (what was
built and why). This is the evidence report: what each prototype was built to
find out, what it found, and what the batch says about the two headline
questions. Per-package detail lives in each package's README.

Every prototype is a playable scenario (a **foundry work order**: situation →
your verbs → objective → BEGIN SHIFT) and ships a headless harness whose
autoplayer drives the same `act()` API the mouse uses — the design-CI pattern
from the design doc, applied batch-wide. All numbers below are from harness
runs on this container.

## Headline question 1 — natural ascent

*Can the player be led up the automation ladder without forcing it?*

**SMF 00 · Graduation (L0→L1).** Yes, at this rung — with a mechanism worth
keeping: the game watches for repetition and the offer is a silent palette
card, while the ramping contract supplies the motive. Toil fell 4.0 → 1.5
clicks/line after the echo unlocked and the autoplayer chose stamping for 73%
of remaining lines. Two deeper findings: **blueprint capture must be lossy to
be teachable** (a 2-cell pattern with 4 rotations fits every orthogonal
adjacency, so the "pattern that doesn't fit" only exists if the echo replays
exactly one captured instance — which *is* the L1 lesson: a blueprint
crystallizes an instance of your verb, not the verb), and the *wait* between
early hand-built lines sells the echo more than the demand curve does.

**SMF 02 · The Jam (L2→L3).** Yes, and the motive is greed, not pain
mandates: lanes earn matter, jams scale with lanes, so the player's own
expansion saturates their hands (peak 12 manual clears/min). The palette
appears at the 12th clear; the run ends with zero manual clears in the final
87s. Alert-as-physical-token read clearly, with one requirement discovered:
**absence-as-signal needs presence** — a silent lane only reads as loud once
probed lanes show flow dots. The alert-bay queue is the storyteller: the
control plane visibly fails (queue floods, responders thrash) before
throughput craters. The tank part is revealed at the storm — relief offered
at the exact failure it fixes — which is the same offer-shape as the echo
card and probably the general law: **each tier's tool should first appear at
the moment its absence hurts.**

**SMF 01 · Dying Patch (the baseline, made a scenario).** The original ran
unattended; playtest feedback ("the user never does anything") produced the
sharpest lesson of the batch: an organism that runs itself is a *demo* until
the player holds decisions with visible failure modes. Two were enough —
place the survey beacon (no beacon → no gradient → colony dies dormant) and
grant resorb authority (no grant → Beta stalls half-funded; matter 45 can't
cover cost 95, so **"retreat funds extension" became a decision you feel**).
The harness runs a no-input control asserting the stall — the player's
load-bearing role is now a regression test.

## Headline question 2 — performance at continental scale

**SMF 06 · Continental.** The architecture commitments hold with lots of
headroom. ~50,176 structures on a 384×256 field: **5k = 93µs · 20k = 98µs ·
50k = 104µs per tick** — sublinear, because a flat ~55µs field pass
dominates; ~1MB heap growth over the run; in-browser at ×32 the sim costs
0.6–0.8ms/frame and draw 1.6–2.0ms at continent zoom (budgets: 8ms each).
The verb survives the scale jump: one pour brush stroke pulled 300 new
builds in ~39 sim-seconds; a starve trench resorbed 409. Techniques that
mattered (full detail in the package README): struct-of-arrays with
free-list recycling; staggered policy checks (the organism's reflexes slower
than its heartbeat); field cadence every 8th tick with a view-side display
lerp; an analytic diffusion bound replacing per-cell bookkeeping; and a
benchmarking gotcha — V8 context specialization makes in-process multi-world
benchmarks under-report by ~1.7×, so the harness spawns a process per scale.
Notably, **Scenario 01's temperament constants survived the 400× population
jump unchanged.**

## The other two low-confidence areas

**SMF 03 · Parts Bench (expressiveness without a language).** Held, with
amendments — and the amendments are the finding. All five contracts (scale,
mix, low-pass, conditional route, hysteresis memory) fell to seven parts and
traces, solved by the harness through the player's own `act()` API
(existence proofs, not assertions of hope). Where the doc's parts list
failed, it failed as a *nameable missing part*, never as pressure for a
script: conditional routing needs a two-port gate (SENSE + FLOW, NO/NC) —
the doc's one-input gate can only self-gate; STEADY needs a drag-tunable
tank drain (doc §8 anticipated this); duplicating a stream names the next
part (a manifold). Strains: stream duplication and precise transition
timing — physical solutions are approximately right, so the 12-consecutive-
seconds pass rule is load-bearing.

**SMF 05 · The Seal (the blast-radius UI).** The interaction works, and the
prototype found its actual shape: the red preview wave completes at 0.9s of
the 1.2s hold, so **the hesitation lives in ~0.3s of complete information
before commit**; the real UI invention is the cursor tally, specifically the
`re-verify ≈ 40s` line — the only number denominated in the player's own
time (and honest: the green wave then costs ~41s). Two rules the design doc
didn't state: the radius must include the planner's *instances* of a sealed
word, drawn as dashed vocabulary links, or physically-unconnected stamps
lighting up reads as a bug; and **a leaky average only leaks if downstream
restarts cost something** — with free restarts, bursty ≈ steady, which is
exactly why the enriched contract is windowed. The leak paradox line
(`CONTRACT: PASS · BEHAVIOR: FAILING`) carried the L4 lesson on its own.

## The shell (added mid-batch from playtest feedback)

"Unclear how to play; doesn't feel like one game" → the shared scenario
shell (`shell/` in this directory): one canonical chrome + the work-order
briefing card, sim paused until BEGIN SHIFT, reopenable via ☰ BRIEF. The
rule that made it safe to retrofit: **the shell may never touch a sim** —
pausing is the shell holding speed at 0, so every harness ran unchanged
through the unification. Verbatim-copy discipline (canon in docs, duplicates
in packages) kept the no-cross-package-imports rule intact.

## What this batch suggests next

- **The offer-shape law** (tool appears where its absence hurts) is now
  demonstrated at two rungs; Scenario 04 (Autophagy) and 07 (Severed Trunk)
  should be authored to it deliberately.
- **Parts Bench names new parts** — manifold (stream duplication), and the
  two-port gate should be back-ported into the design doc's parts table.
- **Latency-ladder scenarios are cheap now**: Continental proves slow-clock
  layers cost nothing; Scenario 08 (Two Gradients) can run on its engine.
- **Capture-lossiness is a teachable dial**: Graduation's echo could later
  admit *parameterized* capture (L4 vocabulary foreshadowed at L1).
- The no-input control run (Dying Patch) generalizes: **every scenario
  should assert its player is load-bearing.**
