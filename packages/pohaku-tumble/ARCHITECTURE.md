# Pōhaku Tumble — architecture

The code is Jukugo Tumble's (`../jukugo-tumble/src`), adapted for the root-pair design in [DESIGN.md](./DESIGN.md) §2 option B. It also takes the engine recommended by the research in [research/ENGINE.md](./research/ENGINE.md).

This file is the contract between modules. Each module keeps Jukugo's public API unless a section below says otherwise. Anything not listed here stays Jukugo's behaviour.

## Modules

| file | role | Node-importable (no DOM)? |
| --- | --- | --- |
| `src/data/words.js`, `src/data/roots.js` | **generated** by `research/roots/build_words.py`. Never edit by hand | yes |
| `src/palette.js` | colours and canvas font strings | yes |
| `src/lexicon.js` | parses the data, defines the playable set, turns, degree, components and the LINK_MAX rule | yes |
| `src/field.js` | board size from the list, scaled `BOUNDS`, horizontal slab layout | yes |
| `src/island.js` | **new**: the made island (DESIGN §3), the eight places and the star compass, generated once from the seed | yes |
| `src/board.js` | deal, turn choice and links (the POHAKU engine) | yes |
| `src/director.js` | what turns when; notes | no |
| `src/links.js` | link animation; field lines land on places via `featureAnchor` | no |
| `src/scene3d.js` | basalt slabs, pecked letters, raking light, the roll | no |
| `src/floor.js` | paints the island map, places, compass, swell, links and captions on the floor canvas | no |
| `src/notes.js` | the cards | no |
| `src/main.js`, `index.html`, `src/style.css` | boot, wiring, camera, chrome, fonts | no |

## Data (`src/data/*.js`)

```js
// words.js
export const WORDS = [{ w, a, b, g, f, ev, nodeal }]
//   w      the word exactly as written (one word or two: 'waimaka', 'hale pule'); NFC, ʻokina U+02BB
//   a, b   stone ids, left and right: a root in one sense, e.g. 'wai#0', 'maka#0', 'paʻa'.
//          An id containing '?' ('ala?alahaka') is an unresolved sense: a stone of its own that never links.
//   g      the card gloss (English, ≤ 6 words, from the review's sources)
//   f      field: 'lani' | 'kai' | 'ʻāina' | 'ulu' | 'kanaka' | 'hana' | 'naʻau' | 'hele'
//   ev     'keep' | 'pending'. pending = not yet confirmed in Pukui & Elbert
//   nodeal true = never an opening word (sensitive: death, disease…)
// roots.js
export const ROOTS = { [id]: { s, g, pp, cog, provisional? } }
//   s    the spelling on the stone, lower case ('wai', 'ʻāina'); display upper case: s.toUpperCase()
//   g    short gloss for the card's parts row ('water')
//   pp   Proto-Polynesian (or other proto-level) ancestor, e.g. '*wai', or ''
//   cog  [[language, form], …], e.g. [['Māori', 'wai'], ['Tahitian', 'vai']], or []
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
- `ALL`: every entry, as `{ word, a, b, gloss, field, ev, nodeal }`.
- `LEXICON`: the **playable** entries, the 2-core of the turn graph (ENGINE.md §2.1). Repeatedly drop words with degree < 2 among the survivors.
- `BY_STONE`: a Map from stone id to the playable entries containing it. This replaces Jukugo's `BY_CHAR`.
- `turns(entry, index)`: Jukugo's semantics, keyed by stone id: index 0 keeps `b` and changes `a`; index 1 keeps `a` and changes `b`.
- `degree(entry)`.
- `compSize(entry)`: the size of the entry's connected component in the turn graph.
- `LINK_MAX`: from root concentration (ENGINE.md §2).

## `field.js`

Exports:
- `GRID = { cols, rows }`: from the playable count P. `target = clamp(round(P / 8), 18, 65)` pairs; `cells = target / 0.92`; `rows = max(4, round(sqrt(cells / 1.125)))`; `cols = max(4, round(cells / rows))`.
- `BOUNDS`: scaled so a cell stays Jukugo's 4.67 × 3.625: `x1 = 21 * cols / 9`, `z1 = 14.5 * rows / 8`.
- `GAP = { h: 0.12 }` and `SLAB = 1.5` (block width; height and depth 1).
- `layoutPairs(rng)`: horizontal only.
- `tileOffsets()`: `±(SLAB + GAP.h) / 2`.
- `mulberry32`.
- `featureAnchor`, re-exported from `island.js`.

Jukugo's `layoutFeatures` is gone; the places come from the island.

## `island.js` (new)

```js
export function buildIsland(seed, BOUNDS) → island
export function featureAnchor(place, px, pz) → [x, z]   // nearest point on the place's outline (circle, rect or polyline)
```

`island` is plain data in world units: x to the right, z toward the viewer. Map north is −z (away from the viewer). It holds:
- the height field;
- the coast polygon(s);
- contours with levels;
- waterlines;
- ahupuaʻa boundaries and the heavier moku line;
- the ala loa trail;
- ahu positions;
- streams;
- reef dots and surf marks;
- the unmarked upland region (`wao akua`, where nothing may be drawn);
- swell crest seeds;
- the compass `{ x, z, r }`;
- `places`: eight objects `{ field, kind, x, z, r, …geometry }`, one per field, with the kinds from `FIELDS`. The `stream` and `lava` places carry polylines.

`board.features = island.places`, so field links work as in Jukugo. The geometry is generated once and is deterministic from the seed. It must fit `BOUNDS` (DESIGN §3.2, §3.5; research/ENGINE.md, critic note on small floors): scale place radii to the floor, and keep places off each other and off the summit region.

## `board.js`

```js
new Board(seed)
  .island, .features (= island.places), .pairs, .tiles, .turnCount
  .chooseTurn(pair, now, linked)   // POHAKU: fresh-first tiers, reach weighting, rested return
  .turn(pair, choice, now)          // sets pair.turnedAt = now
  .canTurn(pair, now)               // any legal turn at this moment
  .desiredLinks()                   // pair links { key, kind: 'pair', stone, a, b }; field links { key, kind: 'field', pair, feature }
  .linkedFraction()
```

- Tiles are `{ id, pair, index, x, z, stone }`. `stone` is the stone id; this replaces Jukugo's `char`.
- Pairs carry `{ id, x, z, dir: 'h', entry, history, tiles, turnedAt }`.
- The deal never hangs (ENGINE.md §2).
- `nodeal` words are never dealt, but may be turned into.
- The rest before a return to the previous word is **25 s**, not 6 s (ENGINE.md, critic: 6 s never binds).

## `director.js`

Jukugo's Director with the POHAKU changes (ENGINE.md §2):
- the background beat picks among pairs that `canTurn`;
- `pickForNote` prefers pairs with two onward turns;
- `chooseTurn` gets `now` and the in-view linked share.

The caption set on each turn is `{ prev1, prev2, text1: entry.word.toUpperCase(), text2: entry.gloss, t0 }`.

## `scene3d.js`

Jukugo's API: `setSize`, `setView`, `project`, `floorAffine`, `addTile`, `block(tile)` → `{ dropIn, turn(stone, t0, dur), landsAt, roll, drop }`, `pick`, `update`, `render`.

What changes:
- Glyphs are drawn from `stoneText(stone)`. Roots run 1–8 letters, including ʻ and macron capitals, on a 1.5 × 1 face; set condensed above 5 letters, never smaller than readable.
- Slabs are 1.5 × 1 × 1 (DESIGN §5): basalt material with object-space noise, vesicles and olivine flecks, six chipped variants.
- Letters are pecked, not printed.
- The sun is lower and raking.
- The previous root stays as a weathered ghost on the front face.

## `floor.js`

Jukugo's `FloorPainter` API: `resize(w, h, dpr)` and `draw(s)`, with `s = { A, board, links, ripples, now, intro, noted }`. The island is at `s.board.island`. It paints:
- the map (DESIGN §3.3: survey-sheet conventions, the reveal order);
- the eight places with their quiet motions;
- the star compass (research/TERMS.md: 32 houses, *Nālani* one word, *Nā Leo* two, the order mirrored per quadrant, cardinal points as houses; one star rising and setting in same-named houses; a small credit to PVS / Nainoa Thompson);
- the trade swell;
- pair links with the shared-root capsule at the midpoint;
- field links;
- pair captions (word in small caps, gloss beneath);
- ripples.

Nothing may be drawn inside the unmarked upland except contours.

## `notes.js`

Jukugo's `Notes` API. The card follows DESIGN §7:
- a number and the field label;
- the word, large, with the turned root flipping;
- the gloss;
- the parts row: each stone's spelling, gloss and ancestor, with the turned stone highlighted;
- one line of the turned stone's cognates;
- "was" and the previous word.

A `pending` word carries a small open circle `◦` after it. The legend explains it as "awaiting dictionary check". The cards set Hawaiian in lower case as written, and never use an apostrophe for an ʻokina.

## Chrome, fonts

- Title plate: **Pōhaku Tumble** (*huaʻōlelo* is not used on the plate until the *hua* ruling, DECISIONS A2), with: "Two-root words cut in stone. A stone turns over to another root, and the word turns into another word."
- Legend: shared root · field · note · ◦ awaiting dictionary check.
- Stats: turns · links · words.
- One quiet credit line: Wiktionary, Andrews–Parker 1922, POLLEX-Online, Polynesian Voyaging Society.
- Fonts: Alegreya regular, italic and semibold, subset to Latin + ʻ (U+02BB) + macron vowels + whatever the data uses. They are registered as the family `'PT Alegreya'` (see `palette.js` `font()`). `tools/build-fonts.py` cuts them; `FONTS.md` records licences; `SOURCES.md` credits the word sources.

## Checking work

- Build: `cd packages/pohaku-tumble && ../../node_modules/.bin/vite build`. This writes `packages/pohaku-tumble/dist/`, which is gitignored. Don't run the repo-root `npm run build` during development.
- Look: serve `dist/` (`../../node_modules/.bin/vite preview --port 41xx`), then screenshot with Playwright. Use Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, 1280×800 at DPR 2 and 390×844.
- Engine: `tools/sim.mjs` runs `Board` in Node against the real data and prints Jukugo's metrics (research/ENGINE.md).
- There is no `package.json` yet. It is added at the end, with the gallery metadata, so the gallery build and `npm run verify` ignore the package until it is ready.
