# Dino Tiles — the rapid hex puzzle (Plan B)

**Package:** `packages/dino-tiles` · **Status:** v1 playable
**One-liner:** A 3-minute dino-park puzzle: place a fixed deck of 30 hex
tiles for adjacency combos — build herds, fence the raptors, give the
T-Rex space — then chase the star thresholds.

Where Plan A (`docs/design-dino-trails.md`) deepens the *simulation*, Plan B
went the other way on purpose: **no money, no ledger, no menus**. One
score, one deck, single-tap placement, instant feedback. The original
economics-flavored sketch for this direction was cut in favor of pace.

## Core loop

1. The hand shows the **current tile** (with its one-line rule) and the
   next two — enough information to plan, not enough to stall.
2. **Tap an empty hex** to place it. Points burst out immediately as
   floating popups; the tile drops in with a bounce; big combos get gold
   text and a stronger haptic.
3. 30 tiles, 37 cells — the board tightens as the run ends. Final screen:
   score, 0–3 stars, best-score chase with a NEW BEST celebration.

## The deck (fixed composition — every run is fair)

5× Parasaurolophus, 4× Stegosaurus, 4× Triceratops, 4× Velociraptor,
2× T-Rex, 4× Lake, 3× Garden, 2× Snack Stand, 2× Fence — shuffled.

## Scoring rules (each fits on the tile card)

| Tile | Rule |
|---|---|
| 🎺🌵🦬 Herbivores | base 5–7 · **+6 per same-species neighbor** · +2 per friendly herbivore |
| 🗡️ Velociraptor | base 8 · +6 per raptor · **scares herbivores −8** unless a fence neighbors the raptor |
| 👑 T-Rex | base 20 · **+5 per EMPTY neighbor** · −6 per any dino neighbor |
| 🌊 Lake | +4 per dino neighbor (and dinos placed beside it get +4) |
| 🌳 Garden | +3 per non-empty neighbor |
| 🌭 Snack Stand | +5 per *different* species around it |
| ⛓️ Fence | +4 per predator neighbor · pacifies adjacent predators |

**Group bonuses:** connect 3 of a species → **HERD! +25** (raptors:
**PACK HUNTS! +30**); each further member +10.

## Stars — calibrated, not guessed

Headless autoplay in node (game.js is DOM-free): random play averages
~262, a myopic-greedy bot ~525. Thresholds: **★ 320 · ★★ 450 · ★★★ 550** —
three stars sits above the greedy median, so it requires using the
next-tile preview and planning herds ahead.

## What carries over from the siblings

The procedural dino rigs (copied per package — no cross-package imports),
the cartoon chip/modal UI language, and the flat-shaded look. The board is
a fixed-camera diorama (tilt + pinch only) — placement is the game, not
navigation.

## Ideas for a v2

- Daily seed (same shuffle for everyone, shareable score).
- One "crane" per run: move a placed tile — the doc's original
  re-arrangement idea, as a scarce power instead of a system.
- Rare golden-dino tiles appearing mid-run (the market/scarcity idea,
  puzzle-sized).
- End-of-run "park tour": camera swoops the finished board.
