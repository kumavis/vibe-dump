# Dino Tiles — the endless hex park (Plan B)

**Package:** `packages/dino-tiles` · **Status:** v2 playable
**One-liner:** An endless dino-park builder: tap to place tiles on an
ever-growing hex frontier, fences rise on their own and merge into pens,
tiny guests wander the seams, and rolling mini-quests set the goals.

Where Plan A (`docs/design-dino-trails.md`) deepens the *simulation*, Plan B
is the zen puzzle: **no money, no menus, no end screen**. v1 was a 30-tile
score-attack with star ratings; v2 replaced that with an endless, persistent
park after playtesting feedback — the deck never runs out, the board never
fills, and the run autosaves on-device.

## Core loop

1. The hand shows the **current tile** (a colored hex chip + one-line rule)
   and the next two.
2. **Tap any frontier pad** — empty cells touching the park — to place it.
   Points burst out as floating popups; every placement opens new frontier,
   so the park grows outward from the founding lake forever.
3. **Quests roll in** one at a time with live progress ("Build a pen of 7
   same-species dinos — 4/7"). Completing one pays a rising bonus and the
   next appears. The chain is scripted early, then generates ever-bigger
   targets.

## Pens & fences (the signature rule)

Every dinosaur tile fences itself automatically — except edges shared with
the **same species**, which stay open. Cluster five stegos and they live in
one big pen with a single perimeter fence. Predator pens use steel posts.
This is pure presentation logic driven by the board state; the scoring
already rewarded clustering, and the fences make the pens *visible*.

## Guests on the seams

Tiles are slightly smaller than their grid cells, leaving walkable seams.
Hex corners form a node graph (corners dedupe across neighbors — the same
grid that placed the tiles), and mini guests random-walk the seam network.
Guest count scales with park size. Pure ambience, zero mechanics.

## Scoring rules (each fits on the tile card)

| Tile | Rule |
|---|---|
| Herbivores (parasaur/stego/trike) | base 5–7 · **+6 per same species in the pen** · +2 per friendly herbivore · fears predators (−8) |
| Velociraptor | base 8 · +6 per raptor in the pack · scares neighboring herbivores −8 |
| T-Rex | base 20 · **+6 per lake or garden neighbor** · −6 per neighboring dino |
| Lake | +4 per dino neighbor (symmetric) |
| Garden | +3 per non-empty neighbor |
| Snack Stand | +5 per *different* species around it |

**Group bonuses:** pen of 3 → **A HERD FORMS! +25** (raptors: **PACK
HUNTS! +30**), +10 per further member. The infinite queue is weighted
(commons frequent, T-Rex ~6%).

## Quest chain

Scripted opening (pen of 3 → variety 3 → lakeside 3 → pen of 5 → snack hub →
score marks → pen of 7/9 …), then generated: alternating bigger pens and
score targets. Rewards escalate (+50, +65, +80 …). Quests are measured live
against the board, so progress can chain — one placement can complete two.

## Presentation

- Aligned pointy-top hexes (tile geometry, fences, and the guest path graph
  all derive from one corner function).
- No emoji anywhere — tiles are identified by colored hex chips.
- Drag roams, pinch zooms, two-finger tilts; the camera gently auto-follows
  the latest placement when idle.
- Tile drop-bounce springs, floating score popups, gold quest banners,
  haptics.

## Ideas for a v3

- Golden dino variants appearing rarely in the queue (scarcity, puzzle-sized).
- A once-per-N-tiles "crane" to move a placed tile.
- Park milestones that visibly upgrade the surroundings (paths pave, gates
  appear) as quest count climbs.
