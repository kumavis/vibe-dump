# Dino Tiles — the synergy grid (Plan B)

**Package:** `packages/dino-tiles` (future — not started)
**One-liner:** A cozy tile-placement puzzle wearing the dino-park skin:
draw tiles, place them for neighbor bonuses, and keep re-arranging as
conditions shift and rarer tiles unlock.

Where Plan A (`docs/design-dino-trails.md`) deepens the *simulation*, Plan B
pivots the *genre*: Dorfromantik / Islanders-adjacent, built for short
sessions and one-thumb play. It should be its own package — bending
dino-park into this would lose the living-park sim without gaining the
puzzle's clarity.

## Core loop

1. **Acquire a tile** — from a drip-feed draw, a milestone unlock, or the
   timed market (see below).
2. **Place it** on the hex/square grid for maximum synergy with neighbors.
3. **Re-adjust**: moving a placed tile is allowed but costs (money or a
   limited "crane" resource) — the tension between a locally-good placement
   now and the layout you'll wish you had in ten turns.
4. **Conditions change**: seasons, guest fads, and events re-weight the
   synergy table (heatwave: fountains spike; raptor-movie summer: predator
   tiles double draw) — forcing periodic re-planning rather than one solved
   layout.

## Tile taxonomy & synergy

Tile classes: **dino paddocks** (one species each), **amenities** (snack,
gift, restroom), **flora** (garden, grove, lake), **infrastructure**
(path plaza, generator, ranger post).

Synergy is edge-adjacency, readable at a glance before placing (ghost
preview shows the score delta). Example rules, all thematic:

| Pairing | Effect |
|---|---|
| Herd dino ⟷ same-species paddock | +happiness, +draw (the herd bonus) |
| Predator ⟷ prey species | +draw ("drama"), −prey happiness |
| Predator ⟷ predator | −both (territorial) unless ranger post adjacent |
| Any dino ⟷ lake / garden | +happiness |
| Snack ⟷ high-draw dino | +revenue (captive audience) |
| Restroom ⟷ snack | +revenue chain |
| Generator ⟷ electric-fence paddock | enables the fence tier |
| Grove ⟷ grove ⟷ grove | forest set bonus, unlocks shy species |

Scoring surfaces as **income per day** (money remains the master resource)
plus a **park score** that gates tile unlocks.

## Scarcity & the market

The shared idea with Plan A, translated to tiles: rare dino tiles appear in
a **timed shop window** (3 slots, countdown, gone when missed). Common
tiles drip steadily; a T-Rex tile showing up is the event that reshapes the
whole board — you clear and re-arrange a district for it. Duplicate common
tiles can be merged (three Parasaurolophus paddocks → one "sanctuary" tile
with a bigger footprint and aura).

## What carries over from dino-park

- The procedural cartoon dino rigs (copied per package — no cross-package
  imports), rendered small and idle-animated on their tiles; the 3D board
  is presentation, the sim is the adjacency graph.
- UI chrome: HUD chips, bottom sheets, toasts, the validated chart palette
  for the books panel.
- Tone: escapes become a *puzzle* event here — an unhappy predator with a
  bad neighborhood "rampages" and locks tiles until resolved.

## Why a separate package

- Different genre, different session shape, different failure states —
  a shared codebase would compromise both.
- The monorepo is built for siblings: new slug, `npm install`, done; the
  gallery picks it up automatically.

## Open questions

- Hex vs square: hex gives 6 neighbors (richer synergy, softer look) but
  square matches dino-park's visual language and is easier to read on
  small screens. Leaning hex — it differentiates the sibling.
- Fixed board that grows by unlock rings vs infinite scroll: leaning fixed
  rings — scarcity of frontage is part of the puzzle.
- Whether guests exist visually at all, or are pure numbers with a crowd
  *sound* — leaning tiny wandering guests for life, zero mechanics.
