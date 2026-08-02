# Dino Trails — territory & footfall (Plan A)

**Package:** `packages/dino-trails` · **Status:** v0 playable
**One-liner:** A dinosaur park tycoon where the land itself is the game: an
uneven, procedurally carved park where every cell is a different shape and
size, guests physically walk the trail network, and the money follows the
footsteps.

This is the spatial evolution of the original `dino-park` grid prototype
(since retired from the repo). Where a grid makes every plot
interchangeable, Dino Trails makes *where* the central question: which dino
deserves the roomy meadow on the main drag, and what happens to your gift
stand when the crowds change course.

## Design pillars

1. **Land is scarce and unequal.** Cells differ in area, shape, terrain and
   position. "Big enough for a Brachiosaurus AND beside the busy trail" is a
   rare object you plan around, pay premiums for, and regret wasting.
2. **The economy is footfall.** Guests are simulated agents walking real
   shortest paths. Shops earn from guests passing their edges, not from a
   global visitor count. Placement *is* the economic decision.
3. **Good dinosaurs are hard to get.** Commons are always in stock so the
   park never stalls, but everything above them comes through a rotating
   market: a few offers at a time on a countdown; rare species appear
   seldom and sell out. Cash you hoard is optionality for the next window.

## Terrain generation

- **Voronoi partition** of a convex park boundary (~24-gon blob), seeds from
  a jittered grid with a **density gradient**: fine cells near the gate
  (cheap starter land, kiosk-scale), coarse cells toward the back (premium
  territory sized for giants). One Lloyd-style relaxation keeps cells even
  enough to read while staying irregular.
- **Terrain types** per cell: meadow (default), forest (shade — shy species
  bonus), rock (cheap, decor-hostile), water (unbuildable; beauty + calm
  aura to neighbors, and the lakeside trail is naturally busy).
- **Elevation** is cosmetic in v0 (slight per-cell height noise); slopes and
  cliffs are a roadmap item (cliff edges = free fencing).
- Deterministic from a stored seed so saves can regenerate geometry.

## The trail network

The insight that keeps this buildable: **Voronoi edges are the paths.**
Cells are plots; their shared borders are the walkable trail graph
(vertices = Voronoi vertices, plus the gate). No navmesh, no pathfinding
research — Dijkstra over a ~150-node graph.

- Guests spawn at the gate, pick a target attraction (weighted by dino
  draw), walk the shortest path, dwell, then pick another or leave.
- Every edge counts its daily crossings → the **footfall map**. A heat
  overlay (toggle) paints trails from quiet blue to blazing red — the
  player's primary planning instrument.
- A hot edge is an *emergent* property: it sits on many shortest routes
  between the gate and the current stars. Add a T-Rex in the north and
  yesterday's hot edge goes cold. Actual counted traffic, not precomputed
  centrality — the sim is the source of truth.

## Footfall economics

- **Tickets**: per guest through the gate (fame- and star-power-driven, with
  the diminishing-returns demand curve tuned in dino-park).
- **Shops** (kiosk, gift stand): earn per crossing on their adjacent edges ×
  capture rate. A kiosk in a dead corner starves regardless of park size.
- **Land pricing is dynamic**: cell price = base + area component +
  yesterday's adjacent footfall premium. Buying ahead of traffic is the
  speculation game; the heat overlay is the tell.
- Feed, upkeep and wages as in dino-park; ledger + history retained.
- **Gate pricing**: a ticket slider in the Books with fame-driven demand
  elasticity (the sweet price rises as the park gets famous).

## Guest needs — one wallet, not a hose

Guests carry needs: **hunger** (grows during the visit), **one souvenir
wish**, and **comfort**. A need is satisfied at the *first* stand the guest
passes once it bites — then they walk past every other stand sated. So shop
income is per-sale, not per-passer-by: coverage of the hungry stretch of
trail beats shop spam, and rival kiosks compete for the same first bite.

Unmet needs sour the guest's exit satisfaction; fleeing a loose dinosaur
ruins it. Exit surveys aggregate into a park-wide **guest mood** that moves
fame — restrooms and snack coverage now matter through the guests
themselves, not a hard-coded rule.

**Insight buildings** gate the analytics: **Guest Services** unlocks the
exit-survey report in the Books (mood, % who left hungry / empty-handed /
uncomfortable); a **Research Post** unlocks exact per-dinosaur happiness
readings in place of vague keeper moods.

## Support systems — running costs that scale with ambition

Advanced dinosaurs pull infrastructure behind them; each support building
adds daily upkeep, so a bigger roster means a bigger payroll:

- **Feed Depot** — the gate shed feeds 30 appetite for free; beyond total
  depot capacity, feed is imported at a 1.8× premium and dinos grumble.
  Big eaters (Brachio 48, Spino 55, T-Rex 75) burn through capacity fast.
- **Ranger Station** — covers 2 dangerous dinos (ferocity ≥ 3): halves
  their escape odds; uncovered dangerous dinos escape *more* often.
  Rangers also auto-recapture runaways within 2 days and discount call-outs.
- **Generator** — electric fences idle at steel strength without one, and
  it keeps fences + stands running through power outages.
- **Vet Clinic** — sickness incidents cure overnight for free; without it,
  illness lingers 4 days or costs a call-out fee.

A "Park systems" dashboard in the Books shows feed, coverage, power and
clinic status at a glance.

## Disasters & incidents

- **Power outage** (3 days): electric fences sag, stand income halves —
  generator negates. **Thunderstorm**: wrecks gardens, guests stay home.
  **Heatwave** (3 days): −6 happiness unless a pond neighbors the pen.
  Rolls begin after day 10 with a cooldown; banner shows days remaining.
- **Incidents**: random sickness (see clinic) and fence wear — a paddock's
  fence can drop a tier, weighted by its occupants' ferocity.

## Territory & dinosaurs

- A paddock is a whole cell: the fence runs along the cell's boundary
  polygon (posts on Voronoi vertices — the geometry does the art).
- **Space requirements**: each species has a minimum "roominess" (cell
  inradius). Giants only fit the big back-country cells; capacity for herd
  species scales with room.
- Terrain preferences (forest-lovers, lakeside calm) push specific dinos
  toward specific cells — the "right dino for the right territory" decision.
- Fences (timber → steel → electrified) vs ferocity, happiness, and escapes
  carry over from dino-park. Escapes get scarier here: a loose raptor on the
  main artery empties the whole park; one in a back corner is containable.
  Guests flee along the trail network, past the thing they're fleeing.

## The dinosaur market

- **Ranch stock**: commons (Parasaurolophus, Stegosaurus) are always for
  sale at list price — the park never stalls waiting for a starter dino.
- **Traveling market**: 3 offer slots, refreshing every ~5 days; each offer
  has a price (jittered) and a hard expiry. Unbought offers vanish.
- Rarity ladder above the commons: mids appear regularly; a T-Rex,
  Spinosaurus or Brachiosaurus offer is an *event* — the game's "drop
  everything" moment, and the reason to sit on cash.
- Roadmap: a rival park that visibly bids on the same offers; breeding pairs;
  seasonal exotic windows.

## v0 scope (this package, first slice)

Voronoi park + trail graph + walking guests with per-edge counts; heat
overlay; dynamic land pricing; cell purchase; paddocks with boundary fences,
space-gated species, escapes-lite; kiosk/gift/garden/restroom; the rotating
dino market; fame, daily economy, ledger, autosave; dino-park's touch UI
chrome (HUD chips, bottom sheets, toasts).

**Since v0:** always-available ranch commons, 12 species (flying Pteranodon,
lakeside-craving Spinosaurus), roomier terrain, roam-first camera, subtle
wild trails, and the full support-systems layer above (buildings, disasters,
incidents, gate pricing).

**Roadmap:** elevation with cliff fencing, rival-park bidding on market
offers, guest needs (hunger/restroom queues on the trail graph), path
upgrades (wider = faster flow), seasonal traffic patterns.

## Technical notes

- `d3-delaunay` for the Voronoi (tiny, battle-tested); cells clipped to the
  convex boundary with Sutherland–Hodgman.
- Cell meshes: `THREE.Shape` → extruded prisms, flat-shaded, cartoon palette
  shared with dino-park. Dino rigs copied from dino-park (packages stay
  self-contained per repo convention).
- Traffic counts accumulate in the render-side guest sim and are handed to
  the economy at each day tick — the 3D world is not just presentation, it
  is the sensor network.
