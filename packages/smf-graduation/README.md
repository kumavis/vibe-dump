# SMF 00 · Graduation

Gameplay prototype for the Slime Mold Foundry design
(`docs/slime-mold-foundry/design.md`, prototype brief §2). Vanilla JS +
Canvas 2D, no dependencies.

## Design question

Can the game *offer* the blueprint tier (L1) as relief earned by repetition —
no popup, no forced tutorial — and does the L1 signature failure (context
mismatch) teach descent back to hand placement (L0)?

**Hypothesis:** if the manual verb is made to saturate (a contract whose
required rate ramps 1 → 3 → 6 → 10 ingots/s) while the sim silently records
each completed line as a relative pattern, then a palette card appearing after
the third identical line — `PATTERN ECHO — earned ×3`, soft pulse, nothing
else — is a sufficient offer. The player takes it because they want relief,
not because the game told them to.

## How this prototype tests it

- **A line** = extractor on an ore cell + furnace on an adjacent buildable
  cell. Complete lines deliver 1.0 ingot/s to the depot (rates, not items).
- **The echo**: the 3rd identical hand-placed line (same furnace offset)
  unlocks a one-click stamp of the whole pattern, ghost-previewed under the
  cursor (green valid / red invalid / amber unaffordable), `R` to rotate.
- **The pocket**: one authored ore patch (`m`, bottom-left) is sealed by rock
  on every orthogonal side — the echo fails in *every* rotation — but has one
  diagonal ground cell, so a hand-placed line still works. That is the
  context-mismatch beat, and the descent.
- **Toil instrumentation**: clicks-per-completed-line, split at the first
  stamp, shown in the HUD (`TOIL 4.0 → 1.5 /line`). This number is the
  evidence the prototype exists to produce.

## Run it

```bash
npm run dev          # from packages/smf-graduation
node harness.mjs     # headless autoplayer + assertions (also: npm test)
```

Controls: `1` extractor · `2` furnace · `3` echo (once earned) · `R` rotate ·
left-click place/stamp · right-click demolish · `space` pause · ⏸ ×1 ×4 ×16.

## Milestones (asserted in this order by the harness)

`firstLine → thirdLine → echoUnlocked → firstStamp → surge (6/s) →
mismatchSeen → mismatchResolved → contractMet (10/s sustained 20 s)`

The harness autoplayer acts only through `act()` with seeded human-ish
delays, and additionally asserts: toil after first stamp ≤ half toil before
(measured 4.00 → 1.50, ×0.38); ≥ 60 % of lines stamped (measured 73 %); the
pocket line resolved by hand-placed buildings; completion under `T_MAX =
300 s` (measured T+180 s); map invariants (the pocket really is echo-proof in
all four rotations). Perf: ~4 µs/tick headless, ~0.5 ms draw, 60 fps at ×16
with a full board.

## Findings

1. **The mismatch patch forced a theorem, and the theorem is the design
   lesson.** A 2-cell pattern with 4 rotations covers *every* orthogonal
   adjacency — so a patch that defeats the echo in all rotations while still
   admitting a hand-placed line is geometrically impossible **unless hand
   placement is strictly more expressive than the capture**. We made hand
   pairing 8-way (diagonals allowed) while the echo replays only the captured
   orthogonal offset and its rotations. This felt like a hack for about an
   hour, then turned out to be the actual content of L1: a blueprint is a
   crystallization of *one instance* of a verb, not the verb's whole space.
   If capture were lossless, context mismatch could not exist. Extracted rule
   for the full game: every capture tier must forget something the hand
   knows, on purpose, and the map must charge for the forgetting.
2. **The wait sells the echo more than the demand curve does.** With start
   matter 30, a 25-matter line, and 1 matter/ingot income, the player watches
   the matter counter crawl for ~20 s between the early hand lines. The
   ramping contract explains why you keep going; the *waiting between
   identical placements* is what makes the third line feel like toil worth
   automating. An earlier tuning with generous start matter delivered the
   unlock while placement was still fun — the card read as clutter, not
   relief. Boredom is a resource; spend it just before the offer.
3. **The toil metric is honest only with strict bucketing.** Every accepted
   act (select / place / rotate / demolish) counts as a click; the split
   happens at the first *successful* stamp, and that stamp's click lands in
   the "after" bucket. Noticing and selecting the echo card lands in
   "before" — adopting automation is itself pre-automation work. The pocket
   hand-fix (2 failed stamps, a rotate, 4 hand clicks) is what keeps the
   after-number above 1.0: automation carries a permanent mismatch tax, which
   is exactly the claim of the design doc.
4. **Strict pattern identity is legible but fragile — kept anyway.** The
   echo requires the *same* offset three times, so the card's text
   ("earned ×3") is a true sentence and the whole tutorial. But a player who
   naturally alternates furnace-north / furnace-east would delay the unlock
   indefinitely and never know why. A shipping version should count
   rotation-equivalent lines or show a dim progress pip; we kept strict
   identity here because the experiment is the offer's silence.
5. **Milestone order is a property of the authored playthrough, not the
   sim.** `mismatchResolved` is sim-gated on `mismatchSeen` (the story can't
   skip its beat), but `surge → mismatchSeen` ordering holds because the
   pocket is only *worth* visiting once demand is high and the easy patches
   are spoken for. A human can fumble a stamp early and see the mismatch flag
   before the surge; the checklist tolerates it. Where order matters
   mechanically, enforce it in the sim; where it's dramaturgy, author the
   map so the player wants to do it in order.
