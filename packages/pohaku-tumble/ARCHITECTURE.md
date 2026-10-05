# Pōhaku Tumble — architecture

The code is Jukugo Tumble's (`../jukugo-tumble/src`), adapted for the root-pair design in [DESIGN.md](./DESIGN.md) §2 option B. It also takes the engine recommended by the research in [research/ENGINE.md](./research/ENGINE.md).

This file is the contract between modules. Each module keeps Jukugo's public API unless a section below says otherwise. Anything not listed here stays Jukugo's behaviour. Where one module copies a number from another, its section says so: change the two together. Where the build departs from DESIGN, [BUILD-NOTES.md](./BUILD-NOTES.md) records it.

## Modules

| file | role | Node-importable (no DOM)? |
| --- | --- | --- |
| `src/data/words.js`, `src/data/roots.js` | **generated** by `research/roots/build_words.py`. Never edit by hand | yes |
| `src/palette.js` | colours and canvas font strings | yes |
| `src/ease.js` | the easing curves | yes |
| `src/lexicon.js` | parses the data, defines the playable set, turns, degree, components and the LINK_MAX rule | yes |
| `src/field.js` | board size from the list, scaled `BOUNDS`, horizontal slab layout, what a word covers on the floor (`WORD`), line routes | yes |
| `src/island.js` | **new**: the made island (DESIGN §3), the eight places and the star compass, generated once from the seed | yes |
| `src/board.js` | where words may stand, the deal, turn choice and links (the POHAKU engine) | yes |
| `src/director.js` | what turns when; notes | yes, against a stand-in scene (`tools/sim.mjs`) |
| `src/view.js` | **new**: the camera's slow wander (`wander`), and how far a drag may take it (`reach`, `clamp`) | yes |
| `src/links.js` | link animation; a field line runs to the end `Board.fieldEnd` gives it | yes |
| `src/scene3d.js` | basalt slabs, pecked letters, the raking sun, the roll | no |
| `src/floor.js` | paints the island map, places, compass, swell, links and captions on the floor canvas | the module yes (`REVEAL`); the painter needs a canvas |
| `src/notes.js` | the cards | no |
| `src/main.js`, `index.html`, `src/style.css` | boot, wiring, input, the opening, chrome, fonts | no |

## Data (`src/data/*.js`)

```js
// words.js
export const WORDS = [{ w, a, b, g, f, ev, nodeal }]
//   w      the word exactly as written (one word or two: 'waimaka', 'hale pule'); NFC, ʻokina U+02BB
//   a, b   stone ids, left and right: a root in one sense, e.g. 'wai#0', 'maka#0', 'paʻa'.
//          An id containing '?' ('haka?hakamoa') is an unresolved sense: a stone of its own that never links.
//   g      the card gloss (English, ≤ 6 words, from the review's sources)
//   f      field: 'lani' | 'kai' | 'ʻāina' | 'ulu' | 'kanaka' | 'hana' | 'naʻau' | 'hele'
//   ev     'keep' | 'pending'. pending = not yet confirmed in Pukui & Elbert
//   nodeal true = never an opening word (sensitive: death, disease…)
// roots.js
export const ROOTS = { [id]: { s, g, pp, cog, provisional? } }
//   s    the spelling on the stone, lower case ('wai', 'ʻāina'); display upper case: s.toUpperCase()
//   g    short gloss for the card's parts row ('water'), or '' (an unresolved stone with no reading)
//   pp   the ancestor with its level, e.g. 'PPN *wai', 'PCE *aho', or ''. Today only PPN, PNP, PCE, PEP and PMQ occur
//   cog  [[language, form], …], e.g. [['Māori', 'wai'], ['Tahitian', 'vai']], or []
//   provisional  gloss and ancestor picked by script, not yet curated (no root carries it today)
```

Uniqueness: a word is its `w`. Two stones are the same root iff their ids are equal. Never compare spellings.

## `lexicon.js`

Exports:
- `FIELDS`: an object keyed by field, each `{ key, label, en, place }`. `label` is the Hawaiian word set in the italic on the floor; `en` is the small-caps English line; `place` is the place kind drawn by `island.js`.

  | key | label | en | place |
  | --- | --- | --- | --- |
  | `lani` | lani | sky | `compass` |
  | `kai` | kai | sea | `fishpond` |
  | `ʻāina` | ʻāina | land | `lava` |
  | `ulu` | ulu | growth | `loi` |
  | `kanaka` | kanaka | people | `kauhale` |
  | `hana` | hana | work | `halau` |
  | `naʻau` | naʻau | mind | `cloud` |
  | `hele` | hele | motion | `stream` |
- `STONES`: the `ROOTS` object.
- `stoneText(id)`: the upper-case spelling for a stone face (`'ʻĀINA'`).
- `unresolved(id)`: whether the id is an unresolved sense (contains `?`).
- `ALL`: every entry, as `{ word, a, b, gloss, field, ev, nodeal }`. A second row with the same spelling is dropped.
- `LEXICON`: the **playable** entries, the 2-core of the turn graph (ENGINE.md §2.1). Repeatedly drop words with degree < 2 among the survivors.
- `BY_STONE`: a Map from stone id to the playable entries containing it. This replaces Jukugo's `BY_CHAR`.
- `turns(entry, index)`: Jukugo's semantics, keyed by stone id: index 0 keeps `b` and changes `a`; index 1 keeps `a` and changes `b`.
- `degree(entry)`.
- `compSize(entry)`: the size of the entry's connected component in the turn graph.
- `COLLIDE` and `LINK_MAX`: the chance that two random stone faces show the same root, and the longest shared-root line it allows (ENGINE.md §2.1): `11.5 × clamp(√(0.010 / COLLIDE), 5/11.5, 1)`. On the shipped list `LINK_MAX` is 11.5.

## `field.js`

Exports:
- `GRID = { cols, rows }`: from the playable count P. `target = clamp(round(P / 8), 18, 65)` pairs; `cells = target / 0.92`; `rows = max(4, round(sqrt(cells / 1.125)))`; `cols = max(4, round(cells / rows))`. The shipped list gives 8 × 7.
- `BOUNDS`: scaled so a cell stays Jukugo's 4.67 × 3.625: `x1 = 21 * cols / 9`, `z1 = 14.5 * rows / 8`.
- `CELL = { w, h }`: one grid cell, Jukugo's 4.67 × 3.625.
- `GAP = { h: 0.12 }` and `SLAB = 1.5` (block width; height and depth 1).
- `JITTER = { x: 0.35, z: 0.45 }`: how far a word may stand from its cell's centre. Small enough sideways that two neighbours never close up into a row of four stones.
- `WORD`, measured from a word's centre: `slabs` (its two stones, where a line's port is drawn), `marks` (everything `floor.js` prints round them: corner ticks, the number, the caption) and `hides` (`marks` plus the floor the stones stand in front of on screen, back to z − 1.3). `CAPTION` (1.45) is where the caption's second line ends. The board, the floor's label layout and the cards all measure a word by these.
- `layoutPairs(rng, whole)`: horizontal only, one pair per cell, jittered. A cell is left empty (8%) only where `whole(cell)` says the grid round it is unbroken (`Board.whole`).
- `beside(p, q)`: whether two words stand in neighbouring cells, diagonals included.
- `tileOffsets()`: `±(SLAB + GAP.h) / 2`.
- `fieldAnchor(place, x, z)`: where a word's field line lands: the nearest point of its place's outline, unless that lies under the word itself, and then the nearest that leaves some line showing past the stones and clear of the caption.
- `linkPath(key, a, b)`: a shared-root line's route: octilinear (horizontals, verticals and 45° diagonals) with rounded corners, one of three styles and one of five parallel lanes, picked from the line's key. The board and the lines both use it, so a line is judged on the path it is drawn on.
- `mulberry32`.
- `featureAnchor`, re-exported from `island.js`.

Jukugo's `layoutFeatures` is gone; the places come from the island.

## `island.js` (new)

```js
export function buildIsland(seed, BOUNDS) → island
export function touchesUpland(island, x0, z0, x1, z1) → bool    // does a floor box reach into the unmarked upland
export function featureAnchor(place, px, pz) → [x, z]           // nearest point on the place's outline (polyline, rect or circle)
export function isolines(grid, level) → lines                    // marching squares, for floor.js
```

`island` is plain data in world units: x to the right, z toward the viewer. Map north is −z (away from the viewer). It holds:
- `k` (the size of things drawn on the map; it stops shrinking where a place would get smaller than a stone) and `sheet` (the survey sheet's edge, a margin outside `BOUNDS`);
- `summit` and the height field (`height`);
- the coast polygon(s);
- contours with levels, every fifth `major`;
- waterlines;
- `boundaries`: the ahupuaʻa lines `{ line, sea, moku }`, two of them the heavier moku line, each running on past the reef (`sea`);
- the ala loa `trail` (`firm`, and `flow` where it crosses the lava as stepping stones);
- `ahu`, one where each boundary crosses the trail;
- streams (windward and leeward), less the main stream and the gulch the lava took;
- reef dots and surf marks;
- `upland`: the unmarked upland (`wao akua` and above, where nothing may be drawn) as `{ x, z, r, ring }`, and `form`, the supplementary contours inside it at half the interval, which `floor.js` dashes;
- `moku`: where the two moku names go;
- swell crest seeds;
- `compass`: the lani place itself, `{ x, z, r, … }`, in open water off the northeast, pulled in from the floor's corner;
- `places`: eight objects `{ field, kind, x, z, r, …geometry }`, one per field, with the kinds from `FIELDS`. The compass is a circle and the kauhale a rectangle (`hw`, `hh`); the others carry a polyline `line` that `featureAnchor` lands on: the fishpond wall, the lava's edge, the loʻi, the canoe house, the cloud band's outer edge and the stream. The cloud band's inner edge swings in lobes and each row of its hatching (`strokes`) stops short of it by a random amount, so it never parallels the contour beside it, as waterlining would; the inner edge itself is not returned.

`board.features = island.places`, so field links work as in Jukugo. The geometry is generated once and is deterministic from the seed. It fits `BOUNDS` (DESIGN §3.2, §3.5; research/ENGINE.md, critic note on small floors): place sizes scale with the floor, each place stays inside its own ahupuaʻa, and places keep off each other and off the summit region. The places on the shore lean toward the middle of the floor, which the camera opens on.

## `board.js`

```js
new Board(seed)
  .island, .features (= island.places), .pairs, .tiles, .turnCount
  .chooseTurn(pair, now, linked)   // POHAKU: fresh-first tiers, root crowding, steering, reach weighting
  .turn(pair, choice, now)          // sets pair.turnedAt = now
  .targets(pair, now)               // the legal turns, best tier only: [{ index, entry, tier }]
  .canTurn(pair, now)               // any legal turn at this moment
  .canTurnTwice(pair, now)          // a turn now and a fresh one a card's few seconds later
  .desiredLinks()                   // pair links { key, kind: 'pair', stone, a, b }; field links { key, kind: 'field', pair, feature, end, stub }
  .linkedFraction(), .linkedPairs()
  .whole(cell), .clear(box)         // layout: may this cell be a hole; does this box keep off the upland and the compass
  .cover(end, a, name)              // how much of an off-page connector's name lies on words (Infinity: on the upland or the compass)
```

- Tiles are `{ id, pair, index, x, z, stone }`. `stone` is the stone id; this replaces Jukugo's `char`.
- Pairs carry `{ id, x, z, dir: 'h', entry, history, tiles, turnedAt }`.

Where a word may stand:
- **The upland.** No stone, caption or line reaches into it (DESIGN §3.2): a word's `WORD.marks` box must not touch it.
- **The compass.** A word's marks keep 1.12 compass radii from its centre (`COMPASS_CLEAR`), clear of the rim ticks and the credit.
- **The small places.** The words round a place may hide no more than a share of its drawing between them (`BURY`): 15% of the fishpond, the loʻi, the kauhale and the hālau, 20% of the lava flow. It is counted on `WORD.hides`, against sample points inside the place's own outlines (the hālau's shed and hulls, the pond, loʻi and lava outlines, the house lots' rectangle) and 48 more along each outline, counted on their own. The stream and the cloud band are not held to a share: they cross the whole floor or ring the upland, and stay readable as one course.
- A word that can't stand where the jitter put it takes the nearest spot within the jitter that fits; failing that the cell stays empty.
- **Holes.** Jukugo's random 8% holes are left only where the 3 × 3 block of cells round the cell is clear of the upland and the compass (`whole`). Where the island already breaks the grid, a hole would only widen the bare ground.

The deal (ENGINE.md §2.3):
- It never hangs: the five-way bound is a preference that steps down to two, and a pair that finds no word is left out before any scene object exists. A pair dealt a word whose every turn another pair holds is dealt again, a few passes at most.
- Only words in a component of 12 or more are dealt. `nodeal` words are never dealt, but may be turned into.
- While under half of the words down are on a line (`WIRED`), three words in five are picked to share a root with a neighbour within 9 units, so the opening comes down near half linked.
- Variety: every word is picked first from those that keep any root to three stones at most (`FACES.deal`; a repeat counts its root twice), with at most one full repeat in sixteen pairs, never two side by side (`REPEATS`). Only when nothing varied fits does it fall back to any word.

Turning:
- History is the pair's last 6 words. `targets` offers, in the best tier on offer: words it hasn't shown in its last six (tier 0); failing those, once it has rested, older words from the six (1); failing those, the word it just left (2). A word on another pair is never a target.
- The rest (`REST`) is **60 s**, not Jukugo's 6 s (ENGINE.md, critic: 6 s never binds), and it holds for every word of the six, counted from the pair's last turn: a pair goes back to any of them only when no fresh word is free, and only once it has rested a minute.
- `chooseTurn` passes over a turn that would put a root on a fifth stone (`FACES.turn`) while another turn in the same tier exists. Then Jukugo's steering on the linked share in view, as ENGINE.md §2.4: below half, turns that join a line are favoured; above 0.55, turns that cut one. A new field adds 0.6. Each weight is scaled by how many fresh words lie within three turns (`REACH`: depth 3, cap 40, a dead end keeps a tenth).

Links (`desiredLinks`):
- Stones showing the same root id are joined by a minimum spanning tree over the stones within `LINK_MAX` of each other, so a root on five stones costs four lines. An unresolved stone links to nothing.
- A line exists only if its drawn path (`linkPath`) keeps 0.12 off the upland and out of the circle 1.12 radii + 0.2 round the compass, so its capsule can't sit on the house names (`lineClear`, cached: stones never move).
- A word on no shared-root line runs a field line to its place (`fieldEnd`, cached per word and place). It runs to the place's outline (`fieldAnchor`) if that is within 12.5 and the way is clear of the upland, and of the compass unless that is the place. Otherwise it is an off-page connector (`stub: true`): 1.2–2.6 long, turned up to 60° off its place in 10° steps if need be, ending where it shows past its own stones and its arrow and the place's name land on bare floor, off every word's `hides` box, the upland and the compass. About one connector in sixty finds no such spot and ends where the least of its name lies on a word.
- `NAME` and `LOOKS` size the connector's name on the floor. They copy `floor.js` (italic at 12 px, 9 px past the arrow) and `view.js` (the smallest scale, 34 px a unit less the zoom's 3.5% breathing; yaw −8° to 2°; pitch 55° ± 2.5°).

## `director.js`

Jukugo's Director with the POHAKU changes (ENGINE.md §2.5), plus these.

The frame:
- `inView(margin = 0.1)`: pairs whose middle, at half a stone's height, is inside x 0.1–0.9 of the width and y 0.16–0.86 of the height. Turns happen only here. `view.js` (`BAND`) and `style.css` (the plates' margins) are tuned to this band.
- Cards open only on pairs inside `inView(0.15)` (`NOTE_FRAME`), and retire once their pair leaves `inView(-0.05)`.

The beat:
- The background beat comes every 1.5–2.6 s, slowed in proportion when fewer than `CROWD` (10) pairs are in view, so each word in view keeps turning about as often on a phone as on a desktop. It picks evenly among pairs in view that aren't noted, aren't rolling, have been idle over 6 s, `canTurn`, and wouldn't only go back to the word a card just showed as "was" (`RECALL`, 180 s after that card closes).
- A card's word turns 1.15 s after it opens, again 4.2–5.8 s later, and the card closes 3.4 s after that. A card that finds nothing to turn retires.
- `chooseTurn` gets `now` and the linked share of the pairs in view.

Capacity (`capacity()`), by width and by height:

| width | cards | | height | at most |
| --- | --- | --- | --- | --- |
| < 520 | 1 | | < 520 | 1 |
| < 700 | 2 | | < 700 | 2 |
| < 1440 | 3 | | | |
| otherwise | 4 | | | |

`pickForNote` skips a pair that is already noted, rolling, carded within the last 15 s (`RECARD.wait`), or can't turn twice (`canTurnTwice`): such a pair gets no card at all. Among the rest it prefers pairs far from the open cards, and marks down one that turned in the last 4 s, one carded within the last 40 s (`RECARD.rest`), and most of all one with no fresh turn.

A clicked stone (`poke`) turns now and gets a card, closing the oldest if the screen is full. A pair with nowhere to go gets neither. Space pauses the Director (`paused`); the cards and lines finish what they were doing.

The caption set on each turn is `{ prev1, prev2, text1: entry.word.toUpperCase(), text2: entry.gloss, t0 }`.

## `view.js` (new)

```js
export function wander(view, t, w, h, user = { dx: 0, dz: 0, zoom: 1 }) → view   // writes tx, tz, ppu, yaw, pitch
export function reach(w, h) → { x, z }                                          // how far a drag may move the view
export const clamp = (v, c, r) => …                                             // keep v within r of c
```

The camera depends only on `t`, the screen and the viewer's drag and zoom, never on the seed, so `tools/sim.mjs` imports `wander` and watches the floor through the same camera a viewer does.
- The scale is `clamp(min(w, h) / 17, 34, 60)` px a unit, times the zoom, breathing ±3.5%. Yaw swings −8° to 2°, pitch 55° ± 2.5°.
- The view's centre goes round a loop about the floor's middle, clockwise from the middle of its north side, so it heads out past the compass first. The loop is a rectangle with corners rounded (radius 1), sized to the screen so that at its corners the Director's band reaches 2 units past the furthest out a word can stand (an outer cell's middle plus the full jitter). A phone sweeps the floor end to end; a wide screen barely moves.
- A lap takes 330 s, or longer where the loop is long, so the camera never goes faster than 0.18 units a second along it. Jukugo's own drift rides on top at 0.4 of its size, so the camera never runs on a rail, and it never goes faster than 0.35 units a second.
- The loop opens out from the middle over the first 45 s or more (never faster than 0.15 units a second), so the stones fall in round the middle of the floor, as in Jukugo.
- On a screen small both ways, where a loop that reaches the corners would leave a hole in the middle, every other lap draws in.
- The view's centre keeps 6 units in from the floor's sides and 4 from its ends, unless the loop and drift need more. A drag may reach the view's limit from anywhere in the loop (`reach`), and `main.js` clamps the drag again when the screen changes.

`view.js` copies the band of `director.js` `inView` as `BAND` (x 0.1–0.9 of the width, y 0.16–0.86 of the height). `board.js` `NAME`/`LOOKS` copy its scale, yaw and pitch.

## `links.js`

Jukugo's `LinkStore`: `sync(desired, now, { origin, holdUntil })`, `update(now)`, `count()`, with `links` a Map by key; `pointAt` and `visibleSpan` are exported for the floor.
- A new line waits for its stones to land (`holdUntil`), and new lines start 0.06 s apart in the order they are handed over.
- A line draws on from one end and lets go of the stone that turned; a field line is drawn back into its place.
- A pair line's ports are where it leaves each word's `WORD.slabs` box, the whole word, not the one stone. A field line runs straight to the `end` the board gave it.

## `scene3d.js`

Jukugo's API: `setSize`, `setView`, `project`, `floorAffine`, `addTile`, `block(tile)` → `{ dropIn, turn(stone, t0, dur), landsAt, roll, drop }`, `pick`, `update`, `render`.

What changes:
- Glyphs are drawn from `stoneText(stone)`. Roots run 1–8 letters, including ʻ and macron capitals, on a 1.5 × 1 face. Every root of up to five letters is set at one size, the size at which the widest of them fills the face (84–108 px type on a 384 × 256 texture). Longer roots are condensed, down to 0.6 of their width, and only past that set smaller.
- Slabs are 1.5 × 1 × 1 (DESIGN §5): basalt material with object-space noise, vesicles and olivine flecks, six chipped variants.
- Letters are pecked, not printed.
- The sun is lower and raking: one directional light, 42° up, from the west and 12° round toward north, so from the upper left as a map is lit. It draws the stones, the thin shadow inside each pecked letter and the shadows on the floor. A low sky-and-paper fill lights the fronts more than the tops. 42° rather than lower keeps each shadow (1/tan of the elevation, about 1.1 units) short of most neighbours along the row.
- Shadows are warm brown and translucent (opacity 0.20), so where the jitter sets two words close, a shadow lies between them as a tint. A contact shadow keeps each stone on the floor.
- The previous root stays as a weathered ghost on the front face.

## `floor.js`

Jukugo's `FloorPainter` API: `resize(w, h, dpr)` and `draw(s)`, with `s = { A, board, links, ripples, now, intro, noted }`. The island is at `s.board.island`. `REVEAL` is the opening's timetable, in seconds: the sheet, the coast, the relief, the boundaries, the places' marks, the labels, and `stones` (1.35), when `main.js` may start dropping them. It paints:
- the map (DESIGN §3.3: survey-sheet conventions, the reveal order). The coast is the heaviest line of the map, in ink-2 at 1.2 px; full ink is kept for the lines between words. The upland holds its contours and the dashed supplementary contours (`upland.form`), nothing else;
- the eight places with their quiet motions;
- the star compass (research/TERMS.md: 32 houses, *Nālani* one word, *Nā Leo* two, the order mirrored per quadrant, cardinal points as houses; one star rising and setting in same-named houses; a small credit to PVS / Nainoa Thompson);
- the trade swell;
- pair links with the shared-root capsule at the midpoint;
- field links, ending in a diamond on the place's outline, or for an off-page connector in an arrowhead and the place's name in the italic at 12 px, 9 px past the tip (`board.js` copies these);
- pair captions (word in small caps, gloss beneath, typed in after a turn with a typing cursor);
- the field labels and the moku names, laid out once to keep off every word's `WORD.hides` box and off the upland;
- ripples.

Nothing may be drawn inside the unmarked upland except contours.

## `notes.js`

Jukugo's `Notes` API: `new Notes(root, canvas)`, `resize`, `open(pair, now)`, `close(note, now)`, `turn(pair, index, prev, at)`, `update(scene, now, dt, reserved)`, `has`, `noted`, and `list` (each note `{ pair, el, closing, … }`). The card follows DESIGN §7:
- a number and the field label;
- the word, large, with the turned root flipping;
- the gloss;
- the parts row: each stone's spelling, gloss and ancestor, with the turned stone highlighted;
- one line of the turned stone's cognates;
- "was" and the previous word.

A `pending` word carries a small open circle `◦` after it. The legend explains it as "awaiting dictionary check". The cards set Hawaiian in lower case as written, and never use an apostrophe for an ʻokina.

Empty and fresh states:
- A stone with no sense or no cognates shows a quiet "—" in ink-3; one with no ancestor shows nothing there.
- A fresh card rules the stone likely to turn first (one with cognates, then the one with more turns) and shows its cognates; its last line reads "was —" until the first turn.

No false scholarship at any frame:
- Only glosses and stone spellings flicker while they settle. English flickers in a–z, Hawaiian in Hawaiian letters (C)V by (C)V, stones in Hawaiian capitals. An ʻokina never appears in a flicker, and a place never shows the letter it is leaving or the one it is settling into.
- Ancestors and cognates are claims about other languages, so they fade out, change while invisible and come back; cognates one language at a time.
- The word flip and the roots' sliding widths run on the card's own clock, from the frame loop, so slow frames can't leave a clipped old root showing.

Fitting: nothing settled shows an ellipsis. A long sense is cut at a whole sense, set up to 10% smaller, or wraps onto an empty ancestor line. A long ancestor is set smaller, never cut. The "was" line is cut only after a whole word. During a turn the gloss keeps one height.

Placement: a card rides rigidly at one of six places round its word: the four corners, or level with it to either side. A side costs a little more than a corner on a screen 520 high or more. Nothing is re-decided frame to frame. When a card opens, or one has hidden more than 2% of its area for 0.25 s, the open cards are placed together (`place`): every combination of places is tried, and each is costed by what the cards would hide where they would really stand, after the screen-edge clamp. Its own word counts double; the `reserved` boxes (the plates and the compass) and the other cards count alike; the words other cards are tied to count for less. A move has a cost of its own, smaller for the card in trouble, and the newest card gives way first. A moved card glides there over 0.6 s (`move`). On a small screen the card is a size down and drops the "was" line.

## `main.js`

- Boot waits for all three Alegreya cuts, since every letter is pecked into a texture or drawn on a canvas. `?seed=` (default 1031) picks the board and the island; `?slow=` divides the clock.
- The opening: the map draws itself (`REVEAL`); from `REVEAL.stones` the stones fall in from the middle of the frame outward, 0.06 s apart within a pair; captions type in a second after; the opening lines are handed to `LinkStore` in the order their stones land. The Director starts 0.15 s before the stones begin to fall, Jukugo's distance.
- `reserved`, the boxes the cards keep off, are the title, legend and stats plates with 12 px round them, measured on resize, plus the compass's box on screen, taken each frame.
- Input: drag moves the view (held within `reach`, and clamped again on resize or rotation); the wheel zooms 0.6–1.9; a click on a stone pokes it; Space pauses. With reduced motion the camera holds where its wander begins.
- `body.ready` is set on the first frame. `body.opened` is set once every line of the opening is in (or has since let go) and the first card has opened. The last opening line arrives about a second after that card's first turn is due, so the card usually shows its word with the one it was. The gallery's thumbnail waits for `body.opened`.

## Chrome, fonts

- Title plate: **Pōhaku Tumble** (*huaʻōlelo* is not used on the plate until the *hua* ruling, DECISIONS A2), with: "Two-root words cut in stone. A stone turns over to another root, and the word turns into another word."
- Legend: shared root · field · note · ◦ awaiting dictionary check.
- Stats: turns · links · words, and the keys (drag · scroll · click a stone · space).
- One quiet credit line: Wiktionary, Andrews–Parker 1922, POLLEX-Online, Polynesian Voyaging Society.
- The plates stay outside the Director's band (the top 16% of the frame and the bottom 14%), so a stone it turns is never under one:
  - 920 px high or more: the title stacked, the sentence beneath the name;
  - 641 px wide or more and 521–919 high (laptops): the plates lie flat: the sentence beside the name in two lines behind a hairline, the legend in two columns, 16 px insets; below 900 wide the keys give way;
  - 640 wide or less, or 520 high or less (phones): the title without its sentence, the legend on one line ("awaiting check"), the credit whole, the cards a size down without their "was" line; held sideways the plates draw in tighter; upright, the legend and the stats close up into one plate.
- Fonts: Alegreya regular, italic and semibold, subset to Latin + ʻ (U+02BB) + macron vowels + whatever the data uses. They are registered as the family `'PT Alegreya'` (see `palette.js` `font()`). `tools/build-fonts.py` cuts them; `FONTS.md` records licences; `SOURCES.md` credits the word sources.

## Checking work

- Build: `cd packages/pohaku-tumble && ../../node_modules/.bin/vite build`. This writes `packages/pohaku-tumble/dist/`, which is gitignored. Don't run the repo-root `npm run build` during development.
- Look: serve `dist/` (`../../node_modules/.bin/vite preview --port 41xx`), then screenshot with Playwright. Use Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, at 1280×800 DPR 2 (the gallery's), 1920×1080, 390×844 and 844×390. Wait for `body.opened`. Under SwiftShader the page runs at about one frame a second, so a shot can catch a card mid-turn: look before trusting it.
- Engine: `tools/sim.mjs` runs `Board` and the real `Director` in Node against the real data, through `view.js`'s camera, and prints Jukugo's metrics (research/ENGINE.md §13) for the harness and at 1280×800, 390×844 and 844×390. It adds `faces` (the most stones on one root), `back60` (turns back to a word left under a minute before) and `loop/h` (a pair circling six words or fewer). Then the deal check, on the real list and on lists cut far down: the deal never hangs, no stone or line reaches into the upland, no word stands on the compass, no field line ends under its own word, no connector's name reaches the upland; and how varied each opening is.
- `package.json` carries the gallery metadata, with the thumbnail at `{ "waitFor": "body.opened", "settle": 3000 }`. The package stays `"status": "wip"` until the fluent read (DESIGN §4.2).
