# Pōhaku Tumble — the engine for a small word list (synthesis)

Six explorers each studied one family of engine changes for the Hawaiian cut of Jukugo Tumble.
This report combines their findings into one engine, re-measures that combination instead of adding
up their separate gains, and runs the full curve for it. Everything was measured on Jukugo's real
`Board` (`board.js`, `field.js` and `lexicon.js` read by absolute path; nothing under
`/home/user/vibe-dump` was modified). There are two simulators:

- **the brief's harness** (`sim.mjs`): one random idle pair turns per 2.05 s beat. The GOOD and
  JUKUGO-LIKE thresholds are defined on this one.
- **a Director-faithful model** (`dsim.mjs`, adapted from the director explorer). It turns only
  the pairs in view of the drifting 1280×800 camera, runs noted words on their own beat, and keeps
  the 6 s idle rule and the roll locks. It is harsher, and closer to what a viewer sees.

Each verdict below is the stricter of the two unless it says otherwise.

## 1. Headline

- **Recommended engine (`POHAKU`):** GOOD from **175** and JUKUGO-LIKE from **200** confirmed
  words in realistic dictionary-check order, on a board sized from the list. This holds in both
  simulators, at 30 seeds and at four times the run length. On Jukugo's full 9×8 board it needs
  275 / 300.
- **Stock Jukugo rules (deal bound lowered to 1 so they deal at all):**
  - GOOD only at 905 words on 9×8 in the brief's harness, never JUKUGO-LIKE.
  - Even that GOOD fails at 6000 ticks (beats lost 0.11), because stock rules have absorbing
    traps.
  - In the Director model stock is never GOOD.
- **The one change that bends Jukugo's behaviour:** a pair may return to the word it just left,
  only after resting 6 s and only when nothing else is legal. Without it (`POHAKU -ret`) the
  engine needs 250 / 400 words in the Director model.
- **The 128 attested words alone are not viable on any board of 18 pairs or more.**
  - On 18 pairs, 33–38% of turns repeat a recent word.
  - They pass GOOD only on a toy board of about 8 pairs (a 3×3 grid, 16 stones), and are never
    JUKUGO-LIKE.

## 2. The recommended engine — spec, per function

`POHAKU` is the configuration `engines.mjs` → `ENGINES.POHAKU` (harness) / `DENGINES.POHAKU`
(Director model). The reference implementation is `pohaku.js` plus the patches in `prepare.mjs`.
Items marked **[none]** leave the stated grammar untouched. The one item marked **[BEND]** is listed
again in §3 so the designer can refuse it.

### 2.1 `lexicon.js` (at load)

1. **Playable set = 2-core of the turn graph [none].**
   - Repeatedly drop every word whose degree (`turns(e,0).length + turns(e,1).length`, counted
     among the words still in) is below 2.
   - Then rebuild `keepFirst`, `keepSecond` and `BY_CHAR` from the survivors, so that `turns()`
     and `degree()` see only playable words.
   - Keep the full list for the glossary and cards.
   - This removes every word a pair could enter but never leave without going straight back.
   - Measured sizes:

     | list | words | playable |
     |---|---:|---:|
     | realistic-175 | 175 | 92 |
     | realistic-225 | 225 | 149 |
     | realistic-300 | 300 | 224 |
     | realistic-905 | 905 | 834 |
     | Jukugo | 1649 | 1637 |

     The full table is `lexstats.tsv`.
2. **Component sizes [none].** Label each playable word with the size of its connected component
   (BFS over both turn directions). The deal uses this (§2.3).
3. **LINK_MAX from root concentration [none].**
   - `COLLIDE = Σ_root (faces(root) / (2·|playable|))²` is the chance that two random block faces
     show the same root.
   - `LINK_MAX = 11.5 × clamp(√(0.010 / COLLIDE), 5/11.5, 1)`. It replaces the constant in
     `board.js`.
   - Jukugo (0.0039) and every realistic list from 400 words keep 11.5.
   - Realistic lists below that get 6.1 (128 words) to 11.05 (350 words).
   - The hub-heavy "best" lists get 5.0–10.3 up to 500 words. With 11.5 they run 0.69–0.87
     linked.
   - Calibration is in `results/linkrule.tsv` (c0 ∈ {0.010, 0.012, 0.015} × floor ∈ {5, 6.5}).

### 2.2 `field.js` — board sized from the list, floor scaled [minor: fewer stones]

```
P       = |playable|
target  = clamp(round(P / 8), 18, 65)          // pairs wanted
cells   = target / 0.92                        // layoutPairs leaves ~8% holes
rows    = max(2, round(sqrt(cells / 1.125)))   // Jukugo's 9:8 grid
cols    = max(2, round(cells / rows))
BOUNDS  = { x0: -21·cols/9, x1: 21·cols/9, z0: -14.5·rows/8, z1: 14.5·rows/8 }
```

- A cell stays Jukugo's 4.67 × 3.625, so `LINK_MAX`, the deal's 9-unit radius and the 1.5-wide
  slabs need no other change.
- All words run left to right (`dir = 'h'`), and a tile sits at `±(1.5 + GAP.h)/2`.
- Boards this produced on the curves:

  | playable words (P) | board | pairs |
  |---|---|---:|
  | ≤ ~150 | 5×4 | 18 |
  | 178 | 5×5 | 23 |
  | 224 | 6×5 | 27 |
  | 268 | 6×6 | 33 |
  | 322 | 7×6 | 39 |
  | 421 | 8×7 | 52 |
  | ≥ ~520 | 9×8 | 65 |

  Measured realistic lists: 128–225 words → 5×4, 250 → 5×5, 275–300 → 6×5, 350 → 6×6, 400 → 7×6,
  500 → 8×7, ≥ 650 → 9×8.
- The minimum of 18 pairs is a design judgement. Smaller boards score better still (§7), but stop
  reading as a field.
- Not simulated:
  - `layoutFeatures` must scale its xs by `x1/21` and its zs by `z1/14.5`, or the island generator
    must fit `BOUNDS`.
  - `main.js`: `clampX`/`clampZ` already read `BOUNDS`. The drift amplitudes (±3.9, ±1.8) fit
    inside every board from 5×4 up (5×4 clamps at ±5.7 / ±3.3). The `user.dx`/`dz` limits
    (±18 / ±12) should come from `BOUNDS`.
  - From 1280×800 down, a 5×4 floor (23 × 14.5 units) fits the view whole (about 27 × 21), so the
    island's coast is always on screen. That is a look question.

### 2.3 `board.js` `deal()` — never hangs [none]

```
order = shuffled pairs                                   (as now)
ok(e) = !used.has(e.word) && compSize(e) >= 12
for pair of order:
  entry = null
  near = placed pairs within 9 units
  if near && rng() < 0.6:                                (as now)
    q = random near; c = q.entry.a or q.entry.b
    options = BY_CHAR(c).filter(e => ok(e) && degree(e) >= 3)
    if options: entry = random option
  for k = 5 down to 2 while !entry:                      (replaces the endless rejection loop)
    pool = LEXICON.filter(e => ok(e) && degree(e) >= k)
    if pool: entry = random(pool)
  if !entry: drop the pair (a hole), renumber pair.id / tile.id / tile.pair before any scene object exists
  setWord(pair, entry); placed.push(pair)
```

- On deep lists this is Jukugo's deal. The 5-way bound stays as a preference and is no longer a
  requirement, which is the lowering the user approved.
- With the board sized from the list it never left a hole on any curve (holes = 0).
- The component guard keeps pairs out of 3–7-word islands such as lau·hala/hoe/leʻa, where every
  turn after the second repeats. It is neutral on every measured list (`-comp` row, §5).

### 2.4 `board.js` `chooseTurn(pair, now, linked = this.linkedFraction())`

```
prev   = pair.history.at(-1)?.word
rested = now - pair.turnedAt >= 6                     // seconds              [BEND, §3]
cands  = []
for index of [0, 1]: for entry of turns(pair.entry, index):
  if used.has(entry.word): continue
  if entry.word === prev:
    if !rested: continue                              // Jukugo: always continue   [BEND]
    tier = 2
  else tier = pair.history.some(h => h.word === entry.word) ? 1 : 0
  cands.push({ index, entry, tier })
if !cands: return null
keep only the candidates with the minimum tier        // fresh first          [none]
for each candidate (Jukugo's steering, with a real push down above 0.55)      [none]:
  w = 1
  joins (a block within LINK_MAX already shows the new root):  w += linked < 0.5 ? 6 : linked > 0.55 ? 0 : 1.5
  breaks (the leaving root is shown within LINK_MAX) and linked > 0.55:  w += 3
  entry.field !== pair.entry.field:  w += 0.6
  N = words reachable from entry within 3 turns, walking only through words not on any pair and
      not in {pair.history, pair.entry, entry}; stop counting at 40                  [none]
  w *= (N === 0 ? 0.1 : N)          // replaces Jukugo's min(1.5, 0.6 + degree/20)
weighted random draw (as now)
```

- `turn(pair, choice, now)` also sets `pair.turnedAt = now`.
- History is still the last 6 words.
- Fresh-first is strict:
  - an older word from the last 6 is a candidate only when no fresh one exists;
  - the previous word is a candidate only when neither exists.

### 2.5 `director.js`

- **Background beat [none].** The pool is as now (visible, un-noted, not rolling, idle > 6 s),
  then filtered to `board.canTurn(p, now)` (same rules as `chooseTurn`). Pick uniformly. The beat
  is lost only when that filter leaves nothing. Pace is unchanged: one turn per 1.5–2.6 s, plus
  notes.
- **`pickForNote` [none].** Subtract 1000 from the score of:
  - a pair with no legal turn whose new word has an onward free word other than the current one
    (`canTwo`);
  - another 1000 for a pair with no fresh (tier-0) turn.

  These are preferences only. A failing pair can still get a card when nothing else is in the
  inner frame.
- **Steer on what is on screen [none].** `turnPair` passes `chooseTurn` the linked share of the
  pairs in view, computed from `desiredLinks()`, in place of the whole floor's. On Jukugo's own
  list this restores in-view linked from 0.43 to 0.49 (stock 0.50; `dsteerview.tsv`).
- **Note timings unchanged.** A card's second turn comes 4.2–5.8 s after its first, which is
  under the 6 s rest, so a card never shows a return.

### 2.6 Parameters

| parameter | value |
|---|---|
| history length | 6 words |
| rest before a return | 6 s |
| reach depth, cap, dead-end weight | 3 turns, 40 words, 0.1 |
| steering high side | above 0.55: join +0, break +3 (Jukugo +1.5 / +1.5) |
| LINK_MAX rule | c0 0.010, floor 5, ceiling 11.5 |
| deal | bound 5 stepping to 2, neighbour match 60% within 9 units at degree ≥ 3, component ≥ 12 |
| board | P/8 pairs, clamped 18–65, 9:8 cells, floor scaled |
| background pick | legal only |
| notes | prefer canTwo and a fresh turn |

## 3. Grammar check

| change | grammar_impact | note |
|---|---|---|
| 2-core playable set | none | Every turn is still one block becoming a real word that keeps the other root in place. Cost is vocabulary: words a pair could only leave by going straight back never appear (76 of 225, 76 of 300, 71 of 905 realistic words). |
| never-hang deal, component guard | none | Opening words are still real words that can turn. |
| fresh-first tiers, reach lookahead, steering, legal-only pick, note preferences, in-view steering | none | Weights and choices among legal turns only. |
| LINK_MAX rule | none | Links still join the same root in sense. On hub-heavy lists they are shorter and constellations more local. |
| board sized from the list, floor scaled | minor | Fewer stones on a smaller island (18 pairs at ≤ 225 words). Slab width, reading direction and link density per stone are unchanged. DESIGN allows "fewer, better-spaced pairs". |
| **rested return to the previous word** | **minor (refusable)** | It bends Jukugo's engine rule "never return to the immediately previous word", not the stated grammar: the return is still one block, a real word, the other root kept. It fires only when nothing else is legal and the pair has rested ≥ 6 s. Measured in the Director model, auto board, realistic: 2.1% of turns at 175 words, 0.8% at 225, 0.3% at 300, 0.1% at 500. It never fires inside a card. |

**If the designer refuses the return** (`POHAKU -ret`, everything else the same):

| simulator | GOOD | JUKUGO-LIKE |
|---|---:|---:|
| brief's harness | 250 | 300 |
| Director model | 250 | 400 |

Those are realistic order on the auto board, after the long-run checks. Without the return the
board is also not stationary: frozen pairs pile up over time. For example, Director realistic-225
on 5×4 goes from stuck 0.18 (1 h, 30 seeds) to 0.23 (2 h). Neither the 2-core nor anything else in the
family removes the cause: two pairs can each hold the other's only exit. The explorers' grammar-clean
recoveries (hand-off, back-and-onward double tumble) attack the same thing at more complexity; see §8.

## 4. Minimum viable sizes

The table gives the smallest size from which every larger measured size also passes (GOOD /
JUKUGO-LIKE), at 10 seeds.

- Harness runs are 1500 ticks; Director-model runs are 1 h.
- Sizes are the eight curve files plus prefix slices at 150, 200, 250, 275, 350 and 450 (the
  curves were checked to be nested prefixes of `curve-*-905`).
- "—" means not reached at 905.
- The 128 point is `curve-*-128` (sense-keyed). It is the same 128 words for all three orders.

| engine | grid | harness realistic | harness random | harness best | Director realistic | Director random | Director best |
|---|---|---|---|---|---|---|---|
| stock | 9x8 | 905 / — | 905 / — | 400 / — | — / — | — / — | — / — |
| stock | 6x5s | — / — | — / — | — / — | — / — | — / — | — / — |
| stock | 5x4s | — / — | — / — | — / — | — / — | — / — | — / — |
| stock | auto | 905 / — | 905 / — | 400 / — | — / — | — / — | — / — |
| POHAKU -ret | 9x8 | 275 / 350 | 350 / 400 | 175 / 200 | 450 / 650 | 450 / 650 | 225 / 275 |
| POHAKU -ret | 6x5s | 200 / 250 | 225 / 350 | 150 / 200 | 250 / 275 | 350 / 450 | 200 / 250 |
| POHAKU -ret | 5x4s | 200 / 250 | 150 / 275 | 150 / 200 | 250 / 275 | 275 / 400 | 200 / 225 |
| POHAKU -ret | auto | 200 / 250 | 150 / 275 | 150 / 200 | 250 / 400 | 300 / 650 | 200 / 225 |
| POHAKU | 9x8 | 250 / 275 | 275 / 350 | 175 / 175 | 275 / 300 | 350 / 400 | 275 / 275 |
| POHAKU | 6x5s | 200 / 225 | 200 / 225 | 150 / 200 | 200 / 200 | 200 / 225 | 200 / 250 |
| POHAKU | 5x4s | 175 / 200 | 150 / 200 | 150 / 200 | 150 / 200 | 150 / 200 | 200 / 225 |
| POHAKU | auto | 175 / 200 | 150 / 200 | 150 / 200 | 150 / 200 | 150 / 200 | 200 / 250 |
| REC+ret -prune | 9x8 | 250 / 275 | 275 / 350 | 175 / 275 | 275 / 300 | 350 / 400 | 300 / 350 |
| REC+ret -prune | 6x5s | 200 / 225 | 200 / 250 | 225 / 250 | 200 / 225 | 200 / 250 | 250 / 300 |
| REC+ret -prune | 5x4s | 175 / 200 | 150 / 200 | 225 / 250 | 150 / 200 | 150 / 200 | 225 / 275 |
| REC+ret -prune | auto | 175 / 200 | 150 / 200 | 225 / 275 | 150 / 200 | 150 / 200 | 250 / 350 |

**Boundary checks.** Every min-viable cell of `POHAKU` and `POHAKU -ret` on 9×8, 5×4 and auto, and
the size just below it, was rerun with 30 seeds and at four times the length (harness 6000 ticks,
Director 2 h). Files: `boundary*.tsv`, `dboundary*.tsv`.

`POHAKU` (robust = holds at 30 seeds and at 4× length):

| grid | harness realistic | harness random | harness best | Director realistic | Director random | Director best |
|---|---|---|---|---|---|---|
| auto (= 5×4 to 225 words) | 175 / 200 | 150 / 200 | 150 / 200 | 150 ¹ / 200 | 150 / 200 | 200 / 250 ² |
| 5×4 | 175 / 200 | 150 / 200 | 150 / 200 | 150 ¹ / 200 | 150 / 200 | 200 / 225 |
| 9×8 | 250 / 275 | **300** / 350 ³ | 175 / 175 | 275 / 300 | 350 / 400 | 275 / 300 ⁴ |

1. Realistic-150 passes GOOD in the Director model only marginally (repeat 0.198 / 0.197 at
   30 seeds / 2 h). It fails in the harness (0.224), so 175 is the figure to plan on.
2. Best-225 on the auto board is JUKUGO-LIKE at 30 seeds, but linked in view is 0.655 at 2 h, so
   GOOD only there. 250 holds.
3. Random-275 on 9×8 is GOOD at 30 seeds but repeats 0.21 at 6000 ticks. 300 holds (0.166 / 0.182).
4. Best-275 on 9×8 is JUKUGO-LIKE at 2 h, but linked in view is 0.654 at 30 seeds.

`POHAKU -ret` (robust):

| grid | harness realistic | harness random | Director realistic | Director random |
|---|---|---|---|---|
| auto | 250 / 300 | 275 / 450 | 250 / 400 | 400 / 650 |
| 9×8 | 300 / 400 | 400 / 450 | 450 / 650 | 650 / 650 |

Its 10-seed figures above are optimistic because frozen pairs keep accumulating.

Stock's only GOOD cells all fail at 6000 ticks, while still passing at 30 seeds × 1500
(`stocklong.tsv`):

| cell | 30 seeds × 1500 ticks: beats lost / stuck | 6000 ticks: beats lost / stuck |
|---|---|---|
| realistic-905, 9×8 | 0.043 / 0.041 | 0.110 / 0.105 |
| random-905, 9×8 | 0.037 / 0.035 | 0.100 / 0.093 |
| best-400, 9×8 | 0.044 / 0.041 | 0.094 / 0.089 |

**The best smaller grid** is 5×4 with the floor scaled (18 pairs).

- It reaches every threshold at the smallest list of any fixed grid of ≥ 18 pairs measured: 9×8,
  6×5, 5×4 and, in exploration, 7×6.
- The auto rule is identical to it up to about 225 realistic words, then grows the board toward
  9×8 as the list grows.
- 6×5 (27 pairs, about one screen at Jukugo density) is one step behind: 200 / 225 in the
  harness, 200 / 200 in the Director model.

## 5. Interaction check (ablation of the combination)

Every component of the combination was removed or swapped on its own and the whole was
re-measured. Each cell is `beats lost / stuck / repeat / linked`. Results are at 10 seeds; files
`ablation*.tsv` and `dablation*.tsv` (more cells and the 5×4 / 6×5 grids are in those files).

`REC+ret` is `POHAKU` without the in-view steering. In the harness they are identical; in the
Director model see `dsteerview.tsv`.

| variant | harness auto realistic-175 | harness auto realistic-225 | harness 9x8 realistic-300 | Director auto realistic-175 | Director auto realistic-225 | Director 9x8 realistic-300 | Director auto random-225 |
|---|---|---|---|---|---|---|---|
| REC | .00/.13/.13/.47 – | .00/.09/.07/.49 **G** | .00/.05/.05/.54 **G** | .02/.26/.12/.45 – | .01/.19/.06/.50 – | .01/.31/.08/.54 – | .00/.18/.07/.54 – |
| REC+ret | .00/.00/.16/.46 **G** | .00/.00/.08/.47 **J** | .00/.00/.08/.55 **J** | .00/.01/.15/.44 **G** | .00/.00/.08/.47 **J** | .00/.01/.11/.54 **J** | .00/.00/.09/.53 **J** |
| REC+ret -prune | .00/.01/.17/.56 **G** | .00/.00/.09/.50 **J** | .00/.01/.08/.55 **J** | .00/.01/.16/.54 **G** | .00/.00/.09/.48 **J** | .00/.01/.12/.56 **J** | .00/.00/.10/.56 **J** |
| REC+ret -prune +dealCore | .00/.01/.17/.56 **G** | .00/.00/.09/.50 **J** | .00/.01/.08/.55 **J** | .00/.01/.16/.54 **G** | .00/.00/.09/.48 **J** | .00/.01/.12/.56 **J** | .00/.00/.10/.56 **J** |
| REC+ret -reach | .00/.00/.20/.47 **G** | .00/.00/.13/.47 **J** | .00/.01/.11/.54 **J** | .00/.01/.19/.46 **G** | .00/.00/.13/.46 **J** | .00/.01/.16/.51 **G** | .00/.00/.13/.53 **G** |
| REC+ret -tiers | .00/.00/.37/.50 – | .00/.00/.26/.52 – | .00/.00/.23/.56 – | .00/.00/.37/.50 – | .00/.00/.27/.52 – | .00/.00/.30/.57 – | .00/.00/.28/.57 – |
| REC+ret -tiers +hist0.05 | .00/.00/.21/.48 – | .00/.00/.10/.48 **J** | .00/.00/.10/.55 **J** | .00/.00/.20/.47 – | .00/.00/.11/.48 **J** | .00/.01/.14/.56 **G** | .00/.00/.11/.54 **J** |
| REC+ret -comp | .00/.00/.16/.46 **G** | .00/.00/.08/.47 **J** | .00/.00/.08/.55 **J** | .00/.01/.15/.44 **G** | .00/.00/.08/.47 **J** | .00/.01/.11/.54 **J** | .00/.00/.09/.53 **J** |
| REC+ret -legal | .00/.00/.17/.45 **G** | .00/.00/.08/.47 **J** | .01/.01/.07/.54 **J** | .01/.01/.16/.46 **G** | .00/.00/.07/.46 **J** | .00/.01/.11/.55 **J** | .00/.00/.09/.53 **J** |
| REC+ret -legal +retry6 | .00/.00/.16/.45 **G** | .00/.00/.08/.47 **J** | .00/.01/.07/.54 **J** | .00/.01/.16/.44 **G** | .00/.00/.08/.47 **J** | .00/.01/.11/.54 **J** | .00/.00/.09/.53 **J** |
| REC+ret -steer | .00/.00/.17/.47 **G** | .00/.00/.08/.48 **J** | .00/.00/.08/.56 **J** | .00/.01/.15/.45 **G** | .00/.00/.08/.48 **J** | .00/.01/.12/.58 **J** | .00/.00/.09/.54 **J** |
| REC+ret L11.5 | .00/.00/.17/.61 **G** | .00/.00/.09/.51 **J** | .00/.00/.07/.57 **J** | .00/.01/.15/.60 **G** | .00/.00/.08/.51 **J** | .00/.00/.11/.58 **J** | .00/.00/.09/.61 **J** |
| REC+ret ret0 | .00/.00/.16/.46 **G** | .00/.00/.08/.47 **J** | .00/.00/.08/.55 **J** | .00/.01/.16/.44 **G** | .00/.00/.08/.47 **J** | .00/.01/.12/.53 **J** | .00/.00/.09/.53 **J** |
| REC+ret ret20 | .00/.00/.16/.46 **G** | .00/.00/.08/.46 **J** | .00/.01/.08/.54 **J** | .00/.01/.14/.45 **G** | .00/.00/.07/.48 **J** | .00/.00/.10/.54 **J** | .00/.00/.08/.53 **J** |
| REC -prune | .14/.66/.09/.34 – | .00/.42/.05/.34 – | .00/.17/.03/.51 – | .61/.81/.08/.35 – | .38/.66/.04/.29 – | .25/.68/.05/.37 – | .39/.66/.04/.30 – |
| REC+ret dealMin2 | .00/.00/.17/.45 **G** | .00/.00/.08/.47 **J** | .00/.01/.07/.54 **J** | .00/.01/.15/.44 **G** | .00/.00/.08/.47 **J** | .00/.03/.10/.56 **J** | .00/.00/.09/.53 **J** |
| REC+ret matchMin2 | .00/.00/.17/.47 **G** | .00/.00/.08/.47 **J** | .00/.00/.08/.55 **J** | .00/.00/.15/.45 **G** | .00/.00/.08/.47 **J** | .00/.01/.12/.55 **J** | .00/.00/.09/.53 **J** |

What the combination needs, and what turned out redundant once the rest was in:

- **The rested return carries stuck.**
  - Without it (`REC`): Director auto realistic-225 stuck 0.19, 9×8 realistic-300 0.31.
  - With it: 0.00 and 0.01.
- **Fresh-first tiers carry repeat.**
  - Without them: 0.23–0.37.
  - A soft 0.05 history weight in their place recovers most of it but not all: repeat 0.10–0.21
    against 0.08–0.16.
- **Reach lookahead** takes another 0.03–0.05 off repeat (e.g. 0.13 → 0.08 at realistic-225).
- **The LINK_MAX rule** keeps linked inside the band on small and hub-heavy lists.
  - With 11.5, the auto board at realistic-175 runs 0.60–0.61.
  - The best-order lists run 0.69–0.87 (`explore2`, `linkrule`).
- **The 2-core is redundant once the return is in**: same thresholds on realistic and random
  (`REC+ret -prune`). It is kept for three reasons:
  - it halves the returns: 1.0% vs 2.7% of turns at realistic-225, auto board;
  - it keeps repeats about 0.01 lower;
  - it is what keeps `POHAKU -ret` alive if the return is refused (`REC -prune` is the worst row in
    the table).

  The price is vocabulary. Over a 1 h run, words shown out of the full list are 0.62 vs 0.70 at
  realistic-225 and 0.69 vs 0.75 at 300.
- **Neutral on the auto board**, kept as cheap guards:
  - the legal-only pick. It matters on a fixed 9×8 with a small list: realistic-175 loses 36% of
    beats without it in the harness, and realistic-225 16% in the Director model.
  - the component guard;
  - the deal's preference for degree ≥ 5. `dealMin 2` is the same within noise.
  - the neighbour-match bound (`matchMin 2` the same);
  - symmetric steering. On 9×8 realistic-500 in the Director model, linked in view goes 0.58 →
    0.66 without it.
  - the rest length: 0 s, 6 s and 20 s are identical in the harness. 20 s loses beats on a small
    9×8 list in the Director model.
- **Note preferences** (Director only) lower repeat by about 0.02–0.05 at small lists
  (`REC+ret -notes`).

## 6. Jukugo's own lexicon (no harm to the big-list case)

These runs use Jukugo's real list with its 30% vertical words and cubes, on 9×8. The steady-state
column is 6000 ticks / 2 h.

| run | beats lost | stuck | repeat | linked |
|---|---|---|---|---|
| harness, stock (dealMin 5) | 0.002 | 0.002 | 0.108 | 0.511 |
| harness, POHAKU | 0 | 0 | 0.001 | 0.491 |
| harness steady state, stock | 0.005 | 0.005 | 0.120 | 0.512 |
| harness steady state, POHAKU | 0 | 0 | 0 | 0.486 |
| Director, stock | 0.010 | 0.008 | 0.120 | 0.501 (in view) |
| Director, POHAKU | 0 | 0 | 0 | 0.487 (in view) |
| Director 2 h, stock | 0.018 | 0.014 | 0.123 | 0.507 (in view) |
| Director 2 h, POHAKU | 0 | 0 | 0 | 0.487 (in view) |

- Pace is unchanged: 65.5 vs 64.9 turns/min.
- Fairness is unchanged: the busiest 20% of pairs make 0.52–0.54 of turns against Jukugo's 0.52.
  Still60 is 0.104 vs 0.112.
- `POHAKU` removes Jukugo's own slow trap accumulation: stock stuck 0.002 → 0.005 over 6000 ticks,
  `POHAKU` 0.
- Without the in-view steering (`REC+ret`), in-view linked on Jukugo's list is 0.43. That is the
  one regression the in-view steering fixes.

## 7. The 128 attested words

These runs use `curve-realistic-128`, the 128 words keyed by root sense as the grammar requires,
with 30 seeds (`w128.tsv`, `dw128.tsv`). The 2-core is 52 words in components of 39, 7, 3 and 3.

| board (pairs) | harness POHAKU: beats lost / stuck / repeat / linked | Director POHAKU |
|---|---|---|
| 9×8 (39 dealt; the component guard leaves 26 holes) | 1.00 / 1.00 / – / – (every word in play is on the board) | same |
| 6×5 (27) | 0 / 0.20 / 0.55 / 0.49 | 0 / 0.23 / 0.55 / 0.52 |
| 5×4 (18) | 0 / 0.05 / 0.38 / 0.48 | 0 / 0.06 / 0.33 / 0.48 |
| 4×4 (14) | 0 / 0.02 / 0.30 / 0.47 | 0 / 0.03 / 0.26 / 0.47 |
| 4×3 (11) | 0 / 0.01 / 0.24 / 0.47 | 0 / 0.01 / 0.21 / 0.46 |
| **3×3 (8)** | 0 / 0.004 / 0.19 / 0.45 → **GOOD** | 0.02 / 0.005 / 0.17 / 0.45 → **GOOD** |
| 3×2 (5) | 0 / 0.001 / 0.15 / 0.41 → GOOD | 0.43 lost (too few idle pairs for the beat) |

- Stock rules fail on every one of these boards (beats lost 0.62–0.96).
- Without the return, stuck is 0.16–0.57 on every board in both simulators.
- `attested-WA.json`, which keys roots by spelling against the grammar, is slightly easier. It is
  GOOD on 4×3 in the harness and JUKUGO-LIKE only on 3×2.
- So the 128 words reach GOOD only on a toy board of about 16 stones, never JUKUGO-LIKE. That is
  not the piece.
- The structural reason: a pair walking the 39-word component meets only words from its last 6 on
  15–19% of its turns, even with five to eight pairs on the board (`noFresh` = repeat).

## 8. Rejected, and why

Numbers marked with an explorer's name come from that explorer's workdir and were not re-measured
here.

- **Director retry-N only, or legal-only pick only.** These hide lost beats but not frozen pairs.
  Director explorer, realistic-300 on 9×8: retry 6 gives lost 0.27 and stuck 0.68. Legal pick on
  its own is kept, but only as a guard (§5).
- **Turn-time distant duplicates** (reuse explorer). They help only on 9×8 below about 300 words.
  No distance rule hides the copies at 1920×1080 and above, or when zoomed out. They never fire on
  list-sized boards.
- **Re-deal of a frozen pair** (dead-end-recovery). A major bend: it is not a tumble. It buys one
  curve step, but at small lists it becomes 6–30 re-deals a minute.
- **Transient-duplicate double tumble, and a frozen pair taking a shown word** (dead-end-recovery).
  Both are minor bends that bought nothing over the clean recoveries.
- **Hand-off and the clean back-and-onward double tumble** (dead-end-recovery). Grammar-clean. Not
  needed once the rested return is in: `POHAKU` stuck is ≤ 0.02 at every viable size. The double
  tumble also puts two rolls in one beat. They are the route to try if the designer refuses the
  return but wants the stationarity back.
- **Off-screen silent release** (director explorer; re-measured here as `+release`). It helps only
  a fixed 9×8 with a small list: Director realistic-225 goes from stuck 0.10 / repeat 0.46 to
  0.04 / 0.29. A list-sized board makes it moot: identical on auto. It also risks an off-screen
  line visibly letting go.
- **Picking pairs that have a fresh turn** (`bgRetry "fresh"`, `pickFresh`; director and lookahead
  explorers). This games the repeat metric by starving pairs: still60 rose from 0.12 to 0.44, and
  frozen to 0.17–0.23.
- **Hard bans on the last 2 or last 6 words** (lookahead). Stuck rises; repeat falls only by
  stalling.
- **A soft history weight instead of strict tiers.** Measured here: hist 0.05 gives repeat 0.10 vs
  0.08 (harness, auto, realistic-225) and 0.14 vs 0.11 (Director, 9×8, realistic-300).
- **A constant LINK_MAX of 9** (deal-and-board). Fine for realistic lists, but hub-heavy lists stay
  over-linked. The rule in §2.1 covers both.
- **A fixed smaller grid on Jukugo's full floor with LINK_MAX stretched** (lookahead and reuse).
  Same harness numbers, but under the Director too few pairs are in view: 4–7% of beats find no
  candidate (reuse explorer).
- **3-core pruning** (lexicon-structure). It raises repeat and linked, and hides more words.
- **Boards under 18 pairs** (4×3, 3×3). Better numbers in both simulators (§7, `explore2`), but 10
  or fewer stones stop reading as a field. This is a design judgement, not a measurement.
- **Stock deal with a lowered bound alone.** It deals, but the steady state is set by the turn
  rules: dealMin 1–5 moves stall, stuck and repeat by ≤ 0.03 (deal-and-board).
- **Not an engine change, but the biggest data lever** (lexicon-structure). Confirming the
  `bridges.tsv` candidates first gets a stock-rule 9×8 board GOOD from about 250–275 confirmed
  words. With `POHAKU` the realistic order already needs only 175. A bridge-first check order
  would most likely lower it further. That was not measured here.

## 9. Pace, fairness, vocabulary, returns (Director model, auto board, realistic order)

| words | board | turns/min | still60 | busiest 20% share | notes cut short | returns | words shown (1 h) |
|---:|---|---:|---:|---:|---:|---:|---:|
| 175 | 5×4 | 65.4 | 0.04 | 0.32 | 0.9% | 2.1% | 0.47 |
| 225 | 5×4 | 65.4 | 0.04 | 0.32 | 0.3% | 0.8% | 0.62 |
| 300 | 6×5 | 65.4 | 0.14 | 0.43 | 0.1% | 0.3% | 0.69 |
| 500 | 8×7 | 65.4 | 0.14 | 0.45 | 0 | 0.1% | 0.76 |
| 905 | 9×8 | 65.5 | 0.11 | 0.52 | 0 | 0 | 0.82 |
| Jukugo stock | 9×8 | 64.9 | 0.11 | 0.52 | 2.7% | 0 | – |

- On a board that fits the view every stone is in play. Still60 (in-view pairs unturned for 60 s)
  drops to 0.04, and the turns spread more evenly than in Jukugo.
- "Words shown" counts against the full confirmed list, so pruned words count as not shown.

## 10. What the simulators cannot tell

- How a return reads: a background stone going back to the root it left at least 6 s earlier.
- How a smaller island looks with its coast always in view (5×4 at 1280×800).
- How shorter LINK_MAX constellations look on hub-heavy lists.
- How the scaled `layoutFeatures` and drag limits look.

Neither simulator models user drag, zoom or clicks (pokes). The Director model is stepped at
1/30 s at 1280×800. Other viewports were not re-run here; the director explorer found 1920×1080
and phone within one curve step for its engine.

## 11. How the explorers' recommendations combined

- The three Director-aware explorers (director, reuse, dead-end-recovery) and lookahead each found
  their own way out of stock's absorbing traps: a bounce or return, or a recovery move.
- deal-and-board and lexicon-structure found the 2-core.
- Re-measured together:
  - the rested return (reuse's rest + lookahead's cooldown + director's bounce fallback) and the
    2-core are substitutes for stuck;
  - lookahead's strict tiers + reach and the director/dead-end history weight are substitutes for
    repeat, with strict tiers + reach the stronger;
  - the board sizing of deal-and-board, director and reuse (6×5s / 5×4s) is complementary to both.
    It is the only lever left on repeat once the turn rules sit at the noFresh floor (repeat =
    noFresh to 0.001 in every `POHAKU` row).
- The explorers' differing small-grid conventions resolve the same way:
  - lookahead stretched LINK_MAX on the full floor;
  - the others scaled the floor.

  The harness cannot tell them apart. The Director model favours the scaled floor.

## 12. Reproduce

```bash
cd engine/synthesis
./run-all.sh                     # everything, ~1 h on 4 cores; seeded, reruns are exact

# or piece by piece:
node prepare.mjs && node mklex.mjs
node gen-curve.mjs jobs/curve2.json sim 'POHAKU,POHAKU -ret' '9x8,6x5,5x4,auto' && node run-matrix.mjs jobs/curve2.json results/curve2.tsv
node gen-curve.mjs jobs/curve.json sim 'stock,REC,REC+ret,REC+ret -prune' '9x8,6x5,5x4,auto' && node run-matrix.mjs jobs/curve.json results/curve.tsv
node gen-curve.mjs jobs/dcurve2.json dir 'POHAKU,POHAKU -ret' '9x8,6x5,5x4,auto' && node dsim-run.mjs jobs/dcurve2.json results/dcurve2.tsv
node gen-ref.mjs jobs/ref.json sim && node run-matrix.mjs jobs/ref.json results/ref.tsv          # Jukugo's lexicon
node analyze.mjs results/minviable-sim.tsv results/curve.tsv results/curve2.tsv
node analyze.mjs results/minviable-dir.tsv results/dcurve.tsv results/dcurve2.tsv
node tables.mjs <(cat results/curve.tsv; tail -n +2 results/curve2.tsv) 'stock|9x8,POHAKU|9x8,stock|5x4s,POHAKU|5x4s,POHAKU|auto,POHAKU -ret|auto' 128,150,175,200,225,250,275,300,350,400,450,500,650,905
node ablation-table.mjs
node merge.mjs                   # → results.tsv, results-dir.tsv (every row, `run` column first)

# one run by hand (the brief's harness):
T=roots/.cache/tiers
LEX=$T/curve-realistic-175.json CFG="$(node -e "import('./engines.mjs').then(m=>console.log(JSON.stringify({...m.ENGINES.POHAKU(null,null),horizontalOnly:true,slab:1.5,seeds:10})))")" node sim.mjs
```

## 13. Metric definitions

**Brief's harness** (`sim.mjs`). One tick is one background beat of 2.05 s. Runs are 10 seeds ×
1500 ticks unless noted.

- `beats lost` (stallRate): ticks on which nothing turned.
- `stuck`: the mean share of pairs that cannot turn under the rules in force even after resting.
  It is sampled every 10 ticks, whether or not the tick turned. That is unbiased; the original
  sampled only on turned ticks, every 50.
- `stuckStrict`: the original test whatever the engine (no free word but the previous one). It is
  in the TSVs.
  - Every `POHAKU` row that is GOOD on `stuck` is still GOOD on stuckStrict (≤ 0.091).
  - Four JUKUGO-LIKE rows would be only GOOD on stuckStrict (0.031–0.068), because pairs there live
    on returns: 9×8 realistic-275, random-350 and best-175, and 6×5 random-225.
  - No auto-board row changes.
- `repeat`: turns landing on a word the pair showed in its last 6. Returns are included.
- `linked`: the mean `Board.linkedFraction()`.
- `seenAll`: the share of the full list ever shown.
- `noFresh`: picks whose pair had no free word outside its last 6. It is a floor under repeat.

**Director model** (`dsim.mjs`). Runs are 10 seeds × 1 h at 1280×800.

- `beats lost`: background beats with no turn, including beats with no idle in-view pair.
- `stuck`: max(share of all pairs, share of in-view pairs) that cannot turn even after resting,
  every 10 s.
- `repeat`: over all turns, notes included.
- `linked`: the share of in-view pairs on a root line, every 2 s. The board-wide figure is in the
  TSV as `linkedAll`.
- Also: `noteEarly` (cards retired for lack of a turn), `still60`, `top20` and `turnsPerMin`.

**Thresholds** (brief).

| verdict | dealt | beats lost | stuck | repeat | linked |
|---|---|---|---|---|---|
| GOOD | every seed | ≤ 0.05 | ≤ 0.10 | ≤ 0.20 | 0.35–0.70 |
| JUKUGO-LIKE | every seed | ≤ 0.02 | ≤ 0.03 | ≤ 0.13 | 0.40–0.65 |

## Appendix — curve tables

Columns are engine · grid. `auto` shows the board it picked. Each cell is
`beats lost / stuck / repeat / linked` followed by the verdict: **J** = JUKUGO-LIKE, **G** = GOOD,
– = neither. Tables come from `tables.mjs`, at 10 seeds. `POHAKU -ret` cells near its threshold
fail in long runs (§4).

### A. Brief's harness

**realistic order** (brief's harness: beats lost / stuck / repeat / linked)

| words | stock · 9x8 | POHAKU · 9x8 | stock · 5x4s | POHAKU · 5x4s | POHAKU · auto | POHAKU -ret · auto |
|---:|---|---|---|---|---|---|
| 128 | .73 / .73 / .45 / .51 – | 1.00 / 1.00 / .00 / .44 – | .72 / .70 / .51 / .35 – | .00 / .04 / .38 / .47 – | .00 / .04 / .38 / .47 – (5x4s) | .00 / .32 / .28 / .47 – (5x4s) |
| 150 | .59 / .59 / .41 / .47 – | 1.00 / 1.00 / .00 / .52 – | .66 / .63 / .44 / .33 – | .00 / .01 / .22 / .44 – | .00 / .01 / .22 / .44 – (5x4s) | .00 / .16 / .17 / .45 – (5x4s) |
| 175 | .49 / .48 / .39 / .48 – | .00 / .34 / .51 / .48 – | .61 / .57 / .44 / .34 – | .00 / .00 / .16 / .46 **G** | .00 / .00 / .16 / .46 **G** (5x4s) | .00 / .13 / .13 / .47 – (5x4s) |
| 200 | .41 / .40 / .34 / .50 – | .00 / .10 / .34 / .48 – | .55 / .51 / .35 / .33 – | .00 / .00 / .09 / .45 **J** | .00 / .00 / .09 / .45 **J** (5x4s) | .00 / .03 / .07 / .45 **J** (5x4s) |
| 225 | .35 / .33 / .33 / .48 – | .00 / .04 / .25 / .49 – | .45 / .42 / .36 / .40 – | .00 / .00 / .08 / .47 **J** | .00 / .00 / .08 / .47 **J** (5x4s) | .00 / .09 / .07 / .49 **G** (5x4s) |
| 250 | .28 / .27 / .32 / .51 – | .00 / .02 / .14 / .53 **G** | .41 / .38 / .34 / .40 – | .00 / .00 / .04 / .50 **J** | .00 / .00 / .04 / .50 **J** (5x5s) | .00 / .01 / .03 / .51 **J** (5x5s) |
| 275 | .27 / .26 / .29 / .51 – | .00 / .01 / .11 / .53 **J** | .41 / .37 / .33 / .42 – | .00 / .00 / .03 / .51 **J** | .00 / .00 / .04 / .53 **J** (6x5s) | .00 / .01 / .03 / .53 **J** (6x5s) |
| 300 | .23 / .23 / .27 / .52 – | .00 / .00 / .08 / .55 **J** | .44 / .40 / .27 / .42 – | .00 / .00 / .02 / .52 **J** | .00 / .00 / .02 / .54 **J** (6x5s) | .00 / .01 / .02 / .53 **J** (6x5s) |
| 350 | .21 / .21 / .25 / .52 – | .00 / .00 / .05 / .56 **J** | .37 / .34 / .24 / .46 – | .00 / .00 / .01 / .54 **J** | .00 / .00 / .02 / .56 **J** (6x6s) | .00 / .00 / .02 / .56 **J** (6x6s) |
| 400 | .15 / .15 / .24 / .53 – | .00 / .00 / .03 / .57 **J** | .26 / .23 / .23 / .51 – | .00 / .00 / .01 / .54 **J** | .00 / .00 / .02 / .57 **J** (7x6s) | .00 / .01 / .02 / .57 **J** (7x6s) |
| 450 | .13 / .13 / .22 / .55 – | .00 / .00 / .02 / .56 **J** | .25 / .22 / .22 / .51 – | .00 / .00 / .01 / .54 **J** | .00 / .00 / .01 / .56 **J** (7x7s) | .00 / .01 / .01 / .56 **J** (7x7s) |
| 500 | .09 / .09 / .20 / .55 – | .00 / .00 / .01 / .56 **J** | .23 / .21 / .21 / .49 – | .00 / .00 / .00 / .53 **J** | .00 / .00 / .01 / .55 **J** (8x7s) | .00 / .00 / .01 / .56 **J** (8x7s) |
| 650 | .07 / .07 / .17 / .54 – | .00 / .00 / .01 / .55 **J** | .18 / .16 / .18 / .51 – | .00 / .00 / .00 / .51 **J** | .00 / .00 / .01 / .55 **J** (9x8) | .00 / .00 / .00 / .54 **J** (9x8) |
| 905 | .05 / .04 / .13 / .56 **G** | .00 / .00 / .00 / .54 **J** | .10 / .08 / .13 / .52 – | .00 / .00 / .00 / .50 **J** | .00 / .00 / .00 / .54 **J** (9x8) | .00 / .00 / .00 / .54 **J** (9x8) |

**random order** (brief's harness: beats lost / stuck / repeat / linked)

| words | stock · 9x8 | POHAKU · 9x8 | stock · 5x4s | POHAKU · 5x4s | POHAKU · auto | POHAKU -ret · auto |
|---:|---|---|---|---|---|---|
| 128 | .73 / .73 / .45 / .51 – | 1.00 / 1.00 / .00 / .44 – | .72 / .70 / .51 / .35 – | .00 / .04 / .38 / .47 – | .00 / .04 / .38 / .47 – (5x4s) | .00 / .32 / .28 / .47 – (5x4s) |
| 150 | .55 / .54 / .40 / .53 – | 1.00 / 1.00 / .00 / .58 – | .58 / .54 / .47 / .41 – | .00 / .01 / .17 / .49 **G** | .00 / .01 / .17 / .49 **G** (5x4s) | .00 / .08 / .14 / .49 **G** (5x4s) |
| 175 | .53 / .51 / .39 / .47 – | .00 / .67 / .55 / .53 – | .58 / .54 / .42 / .39 – | .00 / .01 / .17 / .48 **G** | .00 / .01 / .17 / .48 **G** (5x4s) | .00 / .09 / .14 / .47 **G** (5x4s) |
| 200 | .47 / .46 / .34 / .49 – | .00 / .29 / .41 / .52 – | .60 / .56 / .37 / .37 – | .00 / .00 / .11 / .54 **J** | .00 / .00 / .11 / .54 **J** (5x4s) | .00 / .06 / .09 / .53 **G** (5x4s) |
| 225 | .42 / .41 / .34 / .49 – | .00 / .10 / .33 / .55 – | .59 / .55 / .37 / .38 – | .00 / .00 / .09 / .54 **J** | .00 / .00 / .09 / .54 **J** (5x4s) | .00 / .05 / .08 / .54 **G** (5x4s) |
| 250 | .38 / .37 / .33 / .47 – | .00 / .05 / .25 / .57 – | .56 / .53 / .41 / .39 – | .00 / .00 / .06 / .56 **J** | .00 / .00 / .06 / .56 **J** (5x4s) | .00 / .09 / .05 / .56 **G** (5x4s) |
| 275 | .35 / .34 / .30 / .50 – | .00 / .02 / .19 / .57 **G** | .50 / .47 / .34 / .41 – | .00 / .00 / .04 / .60 **J** | .00 / .00 / .05 / .59 **J** (5x5s) | .00 / .02 / .05 / .59 **J** (5x5s) |
| 300 | .34 / .34 / .29 / .49 – | .00 / .01 / .16 / .58 **G** | .48 / .44 / .30 / .43 – | .00 / .00 / .05 / .58 **J** | .00 / .00 / .05 / .59 **J** (5x5s) | .00 / .01 / .05 / .59 **J** (5x5s) |
| 350 | .27 / .27 / .28 / .48 – | .00 / .01 / .10 / .56 **J** | .47 / .44 / .29 / .41 – | .00 / .00 / .03 / .58 **J** | .00 / .00 / .05 / .57 **J** (7x5s) | .00 / .02 / .04 / .57 **J** (7x5s) |
| 400 | .23 / .23 / .26 / .49 – | .00 / .00 / .06 / .56 **J** | .42 / .39 / .27 / .38 – | .00 / .00 / .02 / .56 **J** | .00 / .00 / .03 / .56 **J** (7x6s) | .00 / .01 / .02 / .56 **J** (7x6s) |
| 450 | .22 / .21 / .22 / .50 – | .00 / .00 / .03 / .56 **J** | .34 / .31 / .24 / .46 – | .00 / .00 / .01 / .55 **J** | .00 / .00 / .02 / .57 **J** (8x6s) | .00 / .01 / .02 / .57 **J** (8x6s) |
| 500 | .19 / .17 / .20 / .51 – | .00 / .00 / .02 / .56 **J** | .31 / .28 / .22 / .48 – | .00 / .00 / .01 / .55 **J** | .00 / .00 / .01 / .56 **J** (8x7s) | .00 / .01 / .01 / .56 **J** (8x7s) |
| 650 | .09 / .08 / .18 / .54 – | .00 / .00 / .01 / .55 **J** | .18 / .16 / .19 / .51 – | .00 / .00 / .00 / .51 **J** | .00 / .00 / .01 / .55 **J** (9x8) | .00 / .00 / .01 / .54 **J** (9x8) |
| 905 | .04 / .04 / .13 / .56 **G** | .00 / .00 / .00 / .53 **J** | .08 / .06 / .13 / .53 – | .00 / .00 / .00 / .49 **J** | .00 / .00 / .00 / .53 **J** (9x8) | .00 / .00 / .00 / .53 **J** (9x8) |

**best order** (brief's harness: beats lost / stuck / repeat / linked)

| words | stock · 9x8 | POHAKU · 9x8 | stock · 5x4s | POHAKU · 5x4s | POHAKU · auto | POHAKU -ret · auto |
|---:|---|---|---|---|---|---|
| 128 | .73 / .73 / .45 / .51 – | 1.00 / 1.00 / .00 / .44 – | .72 / .70 / .51 / .35 – | .00 / .04 / .38 / .47 – | .00 / .04 / .38 / .47 – (5x4s) | .00 / .32 / .28 / .47 – (5x4s) |
| 150 | .42 / .41 / .24 / .58 – | .00 / .31 / .29 / .48 – | .42 / .39 / .23 / .57 – | .00 / .00 / .04 / .69 **G** | .00 / .00 / .04 / .69 **G** (5x4s) | .00 / .01 / .03 / .67 **G** (5x4s) |
| 175 | .29 / .28 / .17 / .68 – | .00 / .02 / .11 / .56 **J** | .35 / .31 / .14 / .65 – | .00 / .00 / .01 / .69 **G** | .00 / .00 / .01 / .69 **G** (5x4s) | .00 / .00 / .01 / .68 **G** (5x4s) |
| 200 | .19 / .18 / .17 / .71 – | .00 / .01 / .04 / .59 **J** | .29 / .26 / .15 / .67 – | .00 / .00 / .00 / .63 **J** | .00 / .00 / .00 / .63 **J** (5x4s) | .00 / .00 / .00 / .64 **J** (5x4s) |
| 225 | .14 / .14 / .15 / .75 – | .00 / .00 / .02 / .60 **J** | .20 / .17 / .15 / .71 – | .00 / .00 / .00 / .61 **J** | .00 / .00 / .00 / .61 **J** (5x5s) | .00 / .00 / .00 / .62 **J** (5x5s) |
| 250 | .10 / .10 / .14 / .77 – | .00 / .00 / .01 / .59 **J** | .17 / .15 / .14 / .72 – | .00 / .00 / .00 / .60 **J** | .00 / .00 / .00 / .60 **J** (5x5s) | .00 / .00 / .00 / .60 **J** (5x5s) |
| 275 | .10 / .09 / .15 / .77 – | .00 / .00 / .00 / .57 **J** | .13 / .11 / .14 / .70 – | .00 / .00 / .00 / .57 **J** | .00 / .00 / .00 / .58 **J** (6x5s) | .00 / .00 / .00 / .58 **J** (6x5s) |
| 300 | .09 / .09 / .14 / .74 – | .00 / .00 / .00 / .56 **J** | .11 / .10 / .14 / .71 – | .00 / .00 / .00 / .56 **J** | .00 / .00 / .00 / .57 **J** (6x6s) | .00 / .00 / .00 / .57 **J** (6x6s) |
| 350 | .05 / .04 / .14 / .73 – | .00 / .00 / .00 / .55 **J** | .09 / .08 / .15 / .66 – | .00 / .00 / .00 / .54 **J** | .00 / .00 / .00 / .55 **J** (7x6s) | .00 / .00 / .00 / .55 **J** (7x6s) |
| 400 | .05 / .04 / .13 / .69 **G** | .00 / .00 / .00 / .56 **J** | .05 / .04 / .14 / .64 **G** | .00 / .00 / .00 / .53 **J** | .00 / .00 / .00 / .56 **J** (7x7s) | .00 / .00 / .00 / .56 **J** (7x7s) |
| 450 | .02 / .02 / .14 / .67 **G** | .00 / .00 / .00 / .56 **J** | .04 / .04 / .15 / .62 **G** | .00 / .00 / .00 / .53 **J** | .00 / .00 / .00 / .56 **J** (8x7s) | .00 / .00 / .00 / .56 **J** (8x7s) |
| 500 | .03 / .02 / .14 / .61 **G** | .00 / .00 / .00 / .55 **J** | .05 / .04 / .14 / .60 **G** | .00 / .00 / .00 / .53 **J** | .00 / .00 / .00 / .55 **J** (8x8s) | .00 / .00 / .00 / .55 **J** (8x8s) |
| 650 | .01 / .01 / .13 / .59 **G** | .00 / .00 / .00 / .55 **J** | .06 / .05 / .14 / .56 – | .00 / .00 / .00 / .52 **J** | .00 / .00 / .00 / .55 **J** (9x8) | .00 / .00 / .00 / .55 **J** (9x8) |
| 905 | .04 / .04 / .13 / .55 **G** | .00 / .00 / .00 / .53 **J** | .07 / .06 / .13 / .53 – | .00 / .00 / .00 / .50 **J** | .00 / .00 / .00 / .53 **J** (9x8) | .00 / .00 / .00 / .53 **J** (9x8) |

### B. Director model

**realistic order** (Director model: beats lost / stuck / repeat / linked in view)

| words | stock · 9x8 | POHAKU · 9x8 | stock · 5x4s | POHAKU · 5x4s | POHAKU · auto | POHAKU -ret · auto |
|---:|---|---|---|---|---|---|
| 128 | .90 / .87 / .74 / .63 – | 1.00 / 1.00 / .00 / .42 – | .84 / .79 / .55 / .30 – | .00 / .06 / .33 / .49 – | .00 / .06 / .33 / .49 – (5x4s) | .13 / .47 / .24 / .50 – (5x4s) |
| 150 | .84 / .80 / .65 / .54 – | 1.00 / 1.00 / .00 / .57 – | .82 / .76 / .47 / .28 – | .00 / .02 / .19 / .46 **G** | .00 / .02 / .19 / .46 **G** (5x4s) | .04 / .31 / .15 / .45 – (5x4s) |
| 175 | .81 / .77 / .64 / .56 – | .05 / .54 / .84 / .61 – | .77 / .70 / .47 / .32 – | .00 / .01 / .15 / .45 **G** | .00 / .01 / .15 / .45 **G** (5x4s) | .04 / .29 / .12 / .47 – (5x4s) |
| 200 | .78 / .73 / .55 / .52 – | .00 / .23 / .65 / .60 – | .74 / .68 / .40 / .26 – | .00 / .00 / .08 / .44 **J** | .00 / .00 / .08 / .44 **J** (5x4s) | .00 / .12 / .07 / .45 – (5x4s) |
| 225 | .75 / .70 / .49 / .47 – | .00 / .10 / .45 / .62 – | .69 / .61 / .40 / .37 – | .00 / .00 / .08 / .47 **J** | .00 / .00 / .08 / .47 **J** (5x4s) | .01 / .16 / .06 / .50 – (5x4s) |
| 250 | .72 / .66 / .47 / .46 – | .00 / .03 / .25 / .56 – | .66 / .58 / .38 / .38 – | .00 / .00 / .03 / .49 **J** | .00 / .00 / .04 / .50 **J** (5x5s) | .00 / .04 / .04 / .51 **G** (5x5s) |
| 275 | .68 / .62 / .40 / .44 – | .00 / .02 / .17 / .57 **G** | .68 / .61 / .34 / .33 – | .00 / .00 / .03 / .51 **J** | .00 / .00 / .05 / .53 **J** (6x5s) | .00 / .02 / .04 / .54 **J** (6x5s) |
| 300 | .64 / .58 / .39 / .46 – | .00 / .01 / .11 / .57 **J** | .67 / .58 / .30 / .35 – | .00 / .00 / .02 / .52 **J** | .00 / .00 / .03 / .55 **J** (6x5s) | .00 / .02 / .02 / .55 **J** (6x5s) |
| 350 | .68 / .62 / .32 / .45 – | .00 / .01 / .08 / .62 **J** | .65 / .58 / .28 / .30 – | .00 / .00 / .01 / .55 **J** | .00 / .00 / .02 / .58 **J** (6x6s) | .00 / .03 / .02 / .58 **G** (6x6s) |
| 400 | .57 / .50 / .30 / .49 – | .00 / .00 / .04 / .62 **J** | .55 / .46 / .24 / .44 – | .00 / .00 / .01 / .54 **J** | .00 / .00 / .02 / .60 **J** (7x6s) | .00 / .02 / .02 / .60 **J** (7x6s) |
| 450 | .50 / .43 / .28 / .47 – | .00 / .00 / .03 / .62 **J** | .46 / .37 / .22 / .45 – | .00 / .00 / .01 / .55 **J** | .00 / .00 / .01 / .61 **J** (7x7s) | .00 / .03 / .01 / .61 **J** (7x7s) |
| 500 | .48 / .41 / .24 / .47 – | .00 / .00 / .02 / .61 **J** | .49 / .40 / .22 / .43 – | .00 / .00 / .00 / .53 **J** | .00 / .00 / .01 / .60 **J** (8x7s) | .00 / .02 / .01 / .60 **J** (8x7s) |
| 650 | .40 / .34 / .21 / .49 – | .00 / .00 / .00 / .58 **J** | .37 / .29 / .18 / .45 – | .00 / .00 / .00 / .51 **J** | .00 / .00 / .00 / .58 **J** (9x8) | .00 / .01 / .00 / .57 **J** (9x8) |
| 905 | .22 / .18 / .15 / .53 – | .00 / .00 / .01 / .56 **J** | .20 / .15 / .14 / .52 – | .00 / .00 / .00 / .50 **J** | .00 / .00 / .01 / .56 **J** (9x8) | .00 / .01 / .01 / .55 **J** (9x8) |

**random order** (Director model: beats lost / stuck / repeat / linked in view)

| words | stock · 9x8 | POHAKU · 9x8 | stock · 5x4s | POHAKU · 5x4s | POHAKU · auto | POHAKU -ret · auto |
|---:|---|---|---|---|---|---|
| 128 | .90 / .87 / .74 / .63 – | 1.00 / 1.00 / .00 / .42 – | .84 / .79 / .55 / .30 – | .00 / .06 / .33 / .49 – | .00 / .06 / .33 / .49 – (5x4s) | .13 / .47 / .24 / .50 – (5x4s) |
| 150 | .78 / .73 / .69 / .60 – | 1.00 / 1.00 / .00 / .63 – | .76 / .68 / .51 / .40 – | .00 / .01 / .15 / .51 **G** | .00 / .01 / .15 / .51 **G** (5x4s) | .00 / .16 / .12 / .47 – (5x4s) |
| 175 | .82 / .77 / .64 / .45 – | .33 / .80 / .80 / .64 – | .72 / .64 / .46 / .40 – | .00 / .01 / .15 / .47 **G** | .00 / .01 / .15 / .47 **G** (5x4s) | .00 / .20 / .12 / .47 – (5x4s) |
| 200 | .79 / .75 / .55 / .49 – | .01 / .43 / .75 / .67 – | .76 / .69 / .42 / .35 – | .00 / .00 / .10 / .53 **J** | .00 / .00 / .10 / .53 **J** (5x4s) | .00 / .16 / .08 / .51 – (5x4s) |
| 225 | .80 / .75 / .51 / .47 – | .00 / .26 / .62 / .70 – | .80 / .74 / .42 / .32 – | .00 / .00 / .08 / .52 **J** | .00 / .00 / .08 / .52 **J** (5x4s) | .01 / .19 / .07 / .53 – (5x4s) |
| 250 | .75 / .70 / .53 / .43 – | .00 / .13 / .47 / .68 – | .77 / .70 / .53 / .32 – | .00 / .00 / .06 / .57 **J** | .00 / .00 / .06 / .57 **J** (5x4s) | .01 / .16 / .05 / .57 – (5x4s) |
| 275 | .74 / .69 / .42 / .43 – | .00 / .04 / .34 / .59 – | .70 / .63 / .36 / .28 – | .00 / .00 / .04 / .59 **J** | .00 / .00 / .06 / .60 **J** (5x5s) | .00 / .11 / .04 / .59 – (5x5s) |
| 300 | .74 / .69 / .39 / .44 – | .00 / .04 / .25 / .63 – | .69 / .61 / .34 / .32 – | .00 / .00 / .05 / .59 **J** | .00 / .00 / .06 / .59 **J** (5x5s) | .00 / .10 / .05 / .59 **G** (5x5s) |
| 350 | .67 / .61 / .37 / .51 – | .00 / .01 / .15 / .59 **G** | .63 / .55 / .29 / .41 – | .00 / .00 / .03 / .58 **J** | .00 / .00 / .06 / .59 **J** (7x5s) | .00 / .08 / .05 / .58 **G** (7x5s) |
| 400 | .67 / .62 / .32 / .42 – | .00 / .01 / .07 / .59 **J** | .62 / .53 / .27 / .37 – | .00 / .00 / .02 / .56 **J** | .00 / .00 / .04 / .59 **J** (7x6s) | .00 / .05 / .03 / .60 **G** (7x6s) |
| 450 | .64 / .57 / .28 / .41 – | .00 / .00 / .04 / .61 **J** | .63 / .54 / .26 / .36 – | .00 / .00 / .01 / .57 **J** | .00 / .00 / .03 / .61 **J** (8x6s) | .00 / .03 / .02 / .61 **J** (8x6s) |
| 500 | .55 / .49 / .24 / .46 – | .00 / .00 / .03 / .63 **J** | .51 / .42 / .22 / .43 – | .00 / .00 / .01 / .56 **J** | .00 / .00 / .02 / .61 **J** (8x7s) | .00 / .04 / .01 / .61 **G** (8x7s) |
| 650 | .44 / .37 / .21 / .50 – | .00 / .00 / .01 / .58 **J** | .39 / .30 / .19 / .47 – | .00 / .00 / .00 / .52 **J** | .00 / .00 / .01 / .58 **J** (9x8) | .00 / .01 / .01 / .59 **J** (9x8) |
| 905 | .20 / .15 / .16 / .56 – | .00 / .00 / .00 / .56 **J** | .20 / .14 / .14 / .52 – | .00 / .00 / .00 / .50 **J** | .00 / .00 / .00 / .56 **J** (9x8) | .00 / .00 / .00 / .56 **J** (9x8) |

**best order** (Director model: beats lost / stuck / repeat / linked in view)

| words | stock · 9x8 | POHAKU · 9x8 | stock · 5x4s | POHAKU · 5x4s | POHAKU · auto | POHAKU -ret · auto |
|---:|---|---|---|---|---|---|
| 128 | .90 / .87 / .74 / .63 – | 1.00 / 1.00 / .00 / .42 – | .84 / .79 / .55 / .30 – | .00 / .06 / .33 / .49 – | .00 / .06 / .33 / .49 – (5x4s) | .13 / .47 / .24 / .50 – (5x4s) |
| 150 | .71 / .65 / .46 / .64 – | .02 / .42 / .43 / .51 – | .59 / .48 / .25 / .53 – | .00 / .00 / .03 / .68 **G** | .00 / .00 / .03 / .68 **G** (5x4s) | .00 / .02 / .03 / .68 **G** (5x4s) |
| 175 | .56 / .49 / .25 / .66 – | .00 / .03 / .18 / .55 **G** | .49 / .40 / .15 / .60 – | .00 / .00 / .01 / .70 – | .00 / .00 / .01 / .70 – (5x4s) | .00 / .00 / .00 / .70 – (5x4s) |
| 200 | .47 / .40 / .22 / .68 – | .00 / .01 / .07 / .62 **J** | .44 / .35 / .15 / .60 – | .00 / .00 / .00 / .66 **G** | .00 / .00 / .00 / .66 **G** (5x4s) | .00 / .00 / .00 / .66 **G** (5x4s) |
| 225 | .42 / .35 / .21 / .66 – | .00 / .00 / .03 / .69 **G** | .37 / .28 / .15 / .66 – | .00 / .00 / .00 / .65 **J** | .00 / .00 / .00 / .66 **G** (5x5s) | .00 / .00 / .00 / .65 **J** (5x5s) |
| 250 | .33 / .27 / .20 / .74 – | .00 / .00 / .01 / .70 – | .33 / .24 / .15 / .65 – | .00 / .00 / .00 / .61 **J** | .00 / .00 / .00 / .62 **J** (5x5s) | .00 / .00 / .00 / .62 **J** (5x5s) |
| 275 | .33 / .26 / .20 / .72 – | .00 / .00 / .00 / .65 **J** | .23 / .17 / .15 / .68 – | .00 / .00 / .00 / .58 **J** | .00 / .00 / .00 / .61 **J** (6x5s) | .00 / .00 / .00 / .62 **J** (6x5s) |
| 300 | .25 / .19 / .18 / .75 – | .00 / .00 / .00 / .64 **J** | .23 / .17 / .15 / .65 – | .00 / .00 / .00 / .56 **J** | .00 / .00 / .00 / .60 **J** (6x6s) | .00 / .00 / .00 / .60 **J** (6x6s) |
| 350 | .22 / .17 / .18 / .70 – | .00 / .00 / .00 / .61 **J** | .17 / .12 / .15 / .65 – | .00 / .00 / .00 / .54 **J** | .00 / .00 / .00 / .59 **J** (7x6s) | .00 / .00 / .00 / .59 **J** (7x6s) |
| 400 | .19 / .15 / .17 / .69 – | .00 / .00 / .00 / .61 **J** | .15 / .11 / .15 / .63 – | .00 / .00 / .00 / .55 **J** | .00 / .00 / .00 / .60 **J** (7x7s) | .00 / .00 / .00 / .59 **J** (7x7s) |
| 450 | .17 / .13 / .17 / .66 – | .00 / .00 / .00 / .60 **J** | .13 / .09 / .15 / .60 – | .00 / .00 / .00 / .54 **J** | .00 / .00 / .00 / .60 **J** (8x7s) | .00 / .01 / .00 / .59 **J** (8x7s) |
| 500 | .11 / .09 / .16 / .67 – | .00 / .00 / .00 / .60 **J** | .11 / .08 / .15 / .60 – | .00 / .00 / .00 / .54 **J** | .00 / .00 / .00 / .60 **J** (8x8s) | .00 / .00 / .00 / .60 **J** (8x8s) |
| 650 | .10 / .07 / .16 / .63 – | .00 / .00 / .00 / .58 **J** | .13 / .09 / .15 / .56 – | .00 / .00 / .00 / .52 **J** | .00 / .00 / .00 / .58 **J** (9x8) | .00 / .00 / .00 / .58 **J** (9x8) |
| 905 | .24 / .18 / .15 / .53 – | .00 / .00 / .00 / .56 **J** | .21 / .15 / .14 / .52 – | .00 / .00 / .00 / .50 **J** | .00 / .00 / .00 / .56 **J** (9x8) | .00 / .01 / .00 / .56 **J** (9x8) |



---

## Verification

An independent agent re-implemented the engine from the written spec alone, without reading this code, and re-measured the claimed rows. A skeptical critic read the code and the results. Both are reported here as they returned. The report above has **not** been revised to absorb them, so read them together.

### Independent reproduction — reproduced: yes

- **POHAKU [harness] realistic 5x4s: min viable GOOD / JUKUGO-LIKE (10 seeds x 1500 ticks; also checked at 30 seeds and at 6000 ticks)** — claimed: GOOD 175, JL 200; measured: GOOD 175, JL 200. 175: stall 0, stuck(sFree) 0.004, repeat 0.158, linked 0.461. 150 fails on repeat 0.228. 200: repeat 0.083, stuck 0.002. Same verdicts under all three stuck definitions, at 30 seeds, and at 6000 ticks. (within tolerance)
- **POHAKU [harness] realistic auto grid (5x4 up to 225 words): min viable GOOD / JL** — claimed: GOOD 175, JL 200; measured: GOOD 175 (repeat 0.164-0.171), JL 200 (repeat 0.085-0.092); robust at 30 seeds and 6000 ticks (within tolerance)
- **POHAKU [harness] realistic 9x8: min viable GOOD / JL** — claimed: GOOD 250, JL 275; measured: GOOD 250 (stuck 0.017, repeat 0.145-0.153, linked 0.51-0.53; 225 fails on repeat 0.244). JL 275 (repeat 0.111 at 10 seeds, 0.116 at 30 seeds; at 6000 ticks 0.128-0.131, and 0.130 at 30 seeds x 6000 ticks, so right on the 0.13 line). With the strict frozen-pair stuck definition (sim.mjs's), JL moves to 300: strict stuck at 275 is 0.043-0.047. (within tolerance)
- **POHAKU [harness] realistic 128, 9x8** — claimed: beats lost 1, stuck 1, repeat 0, linked 0.444, seen 0.305; measured: 1, 1, 0, 0.444, 0.305. Only 39 words are in a component of 12 or more, so the board deals 39 pairs and 26.3 holes, and never turns. (within tolerance)
- **POHAKU [harness] realistic 128, 5x4s** — claimed: 0, 0.045, 0.378, 0.472, 0.305; measured: 0, sFree 0.043 (sLegal 0.070, strict 0.164), 0.371, 0.471, 0.305 (within tolerance)
- **POHAKU [harness] realistic 905, 9x8** — claimed: 0, 0, 0.001, 0.535, 0.682; measured: 0, 0 (strict 0.001), 0.001, 0.534, 0.682 (within tolerance)
- **POHAKU [harness] realistic 905, 5x4s** — claimed: 0, 0, 0, 0.502, 0.627; measured: 0, 0, 0.001, 0.502, 0.632 (within tolerance)
- **POHAKU [harness] realistic 175 / 225 / 300, 9x8 and 5x4s (all other harness curve rows)** — claimed: 9x8 225: 0, 0.035, 0.251, 0.494, 0.622 (rest as listed); measured: 9x8 225: 0, 0.039, 0.244, 0.522, 0.621. Linked is 0.502-0.522 across 5 disjoint seed sets against the claimed 0.494, the only harness rate outside +-0.02. Every other harness rate is within 0.02, and no verdict differs. (outside tolerance)
- **POHAKU (128 attested words) on small grids, 30 seeds** — claimed: 3x3s GOOD; 4x3s and larger fail on repeat; measured: 3x3s (8.1 pairs): GOOD, repeat 0.191, stuck 0.005. 4x3s: repeat 0.234, fails. 4x4s: 0.301. 5x4s: 0.371. (within tolerance)
- **POHAKU [harness] realistic 6x5s (not in the assigned rows)** — claimed: GOOD 200, JL 225; measured: GOOD 200, JL 200: repeat at 200 is 0.126 and 0.130 in two runs, exactly on the 0.13 line. Verdict differs only by threshold noise. (outside tolerance)
- **POHAKU -ret [harness, robust] realistic auto and 9x8** — claimed: auto 250/300; 9x8 300/400; measured: auto 250/300; 9x8 300/400, with stuck = no legal turn. 9x8 frozen pairs grow with time: 275 is 0.077 at 1500 ticks and 0.138 at 6000. (within tolerance)
- **POHAKU [Director model] realistic 5x4s / auto / 9x8 min viable, using my own Director model (DENGINES not specified)** — claimed: 5x4s 150/200; auto 150 (marginal, repeat 0.198)/200; 9x8 275/300; measured: 5x4s 150/200; auto 150 plain, 175 robust (repeat 0.195-0.202 at 150)/200; 9x8 275/300 (within tolerance)
- **POHAKU [Director model] 128 and 905 rows, 9x8 and 5x4s (my own model)** — claimed: 128 9x8: 1, 1, 0, 0.425, 0.305; 128 5x4s: 0, 0.055, 0.326, 0.487, 0.305; 905 9x8: 0, 0.001, 0.007, 0.555, 0.819; 905 5x4s: 0, 0, 0.001, 0.499, 0.796; measured: 128 9x8: 1, 1, 0, 0.424, 0.305; 128 5x4s: 0, 0.056 (whole board), 0.318, 0.483, 0.305; 905 9x8: 0, 0.003, 0.007, 0.558, 0.795; 905 5x4s: 0, 0, 0.001, 0.498, 0.775. Seen runs 0.02 low at 500-905, probably because my horizon (3000 s) is shorter. (outside tolerance)

Spec ambiguities the reproducer had to resolve:

- Sizes 150/200/250/275/350 have no tier files. I used prefixes of curve-<order>-905.json. The tier files are exact prefixes, and the 350 prefix gives LINK_MAX 11.05 as the spec states.
- Harness clock for the 6 s rest: I used now = tick x 2 s, from sim.mjs's 'COOLDOWN 3 = 6 s'. At any tick length of 1.5 s or more, the 3-tick cooldown means every eligible pair is rested, so the return is always allowed in the harness. At 1 s per tick no verdict changed.
- Harness pool: I filtered it by canTurn(p, now) to mirror the spec's Director beat. That makes stall about 0 by construction, so the retry knob is irrelevant. chooseTurn gets the whole-board linkedFraction() because the harness has no view.
- 'stuck' is not defined for POHAKU. The claimed numbers fit 'no turn onto any off-board word, with the previous word counted as available whatever the rest timer' (sFree). The other readings are canTurn with the timer, slightly higher, and sim.mjs's strict frozen pair (return not counted), much higher. The choice changes one verdict: 9x8 JUKUGO-LIKE is 275 under sFree or the timer reading, and 300 under strict. For -ret the claims fit 'no legal turn'.
- Sampling: original sim.mjs samples linked and stuck only on ticks that turned. The claimed 128/9x8 linked of 0.444, on a board that never turns, requires sampling regardless, so I sample every 10th tick.
- seenFrac denominator: the full list, not the playable set (0.305 = 39/128).
- 'robust' is undefined. I read it as also passing at 30 seeds and at 6000 ticks (12000 s in the Director model). Min viable = the smallest size at which it and every larger tested size pass.
- 'Both grids' I read as 9x8 and 5x4s, and reported auto as well. '5x4s' = 5x4 cells with the floor scaled so a cell stays 4.67 x 3.625.
- Layout: target only sets cols/rows. Jukugo's random 8% layout holes are kept, so 5x4 gives about 17.9 pairs. With a fixed grid, BOUNDS still scale with cols/rows.
- Reach N: the blocked set is words on any pair plus the pair's history plus current word plus entry. BFS runs from the entry, 3 steps deep, over both turn directions. Blocked words are neither counted nor walked through, and the count stops at 40.
- Tier order: the previous word is also in history. I test prev first (tier 2 if rested, otherwise skipped). turnedAt starts at -Infinity.
- Deal: as in stock, the near check comes before the 0.6 draw. The k = 5..2 fallback also runs when the near match finds no option. Pools are filtered by ok at pick time, with a uniform pick.
- Joins and breaks follow stock exactly: other pairs' tiles within LINK_MAX, with breaks judged on the turning tile's current root. The weighted draw uses Math.random, as in stock, so runs are not reproducible per seed. Noise between 10-seed sets is about +-0.01.
- canTwo (Director): some legal candidate w has a turn to a word not on the board. The current word is on the board, so it is excluded automatically.
- The Director model (DENGINES.POHAKU) is not in the spec: viewport, camera, note closing, and the denominator for 'stuck' are all missing. I built my own: 1280x800, capacity 3, jukugo's camera drift and inView formulas. In it, the claimed POHAKU Director stuck fits a whole-board share (175/9x8: 0.539-0.542 against 0.544; in-view gives 0.69), while the claimed stock Director stuck fits an in-view share (128/9x8: 0.881 against 0.874). Either the claims use different denominators for the two engines, or my model differs.
- Not simulated: the layoutFeatures scaling (applied but unmeasured) and main.js user.dx/dz limits from BOUNDS.

I reproduced the engine from the written spec only and did not read synthesis/ or any other explorer's code. All files are in engine/repro/, and ./repro.sh reruns everything in about 10 minutes. Nothing under /home/user/vibe-dump was changed (git status is clean).

The engine itself is in two files there: prepare.mjs (the original harness patches plus a POHAKU build of Jukugo's board.js and field.js into .build/pohaku/) and lexicon.pohaku.js. The spec's own checks hold: playable sizes 149, 224 and 834 for realistic 225, 300 and 905, and LINK_MAX 6.10 to 11.05 for realistic 128 to 350 and 5.0 to 10.31 for the best lists.

Verdicts: every assigned claim reproduces.
- Harness, realistic order: 5x4s GOOD 175 and JUKUGO-LIKE 200; auto (5x4 up to 225 words) 175/200; 9x8 250/275.
- 128-word row: dead on 9x8 (1, 1, 0, 0.444, 0.305, as claimed); on 5x4s 0 / 0.043 / 0.371 / 0.471.
- 905-word row: matches on both grids.
- Of 160 claimed-vs-measured rates (harness and my Director model), 7 fall outside +-0.02 and none changes a verdict. The only harness miss is 225/9x8 linked: 0.50 to 0.52 across 5 seed sets against the claimed 0.494.

Caveats the reviewer should weigh:
1. The 9x8 JUKUGO-LIKE verdict at 275 sits on the repeat <= 0.13 line at long horizons: 0.128 to 0.131 at 6000 ticks.
2. The verdicts depend on what 'stuck' means. The claimed numbers fit a definition that counts the return to the previous word as an escape and ignores the 6 s rest timer. Under sim.mjs's strict frozen-pair definition, 9x8 JUKUGO-LIKE moves to 300. Other rows are unaffected.
3. Because the harness pool is filtered by canTurn, beats lost is about 0 by construction. Stuck and repeat carry all the signal.
4. The 6x5s JUKUGO-LIKE verdict (claimed 225) came out 200 for me, with repeat exactly on the threshold (0.126 and 0.130).
5. The Director-model rows came from my own model, because DENGINES is not specified. It still lands on the same minimum sizes (5x4s 150/200, 9x8 275/300, auto 150 marginal/200) and reproduces repeat, linked and seen closely.

Files are in engine/repro/:
- NOTES.md (method and ambiguities)
- results.tsv (every run, with verdicts under three stuck definitions)
- minviable.txt
- compare.tsv and compare.txt
- simx.mjs (harness driver), dmodel.mjs (Director model), batch.mjs, verdicts.mjs, compare.mjs, probe-lex.mjs

### Critic — sound-with-fixes

- **[major] The 6 s rest lets returns undo a turn the viewer just saw, and they cluster into ping-pong** — In the Director model the background pool already requires a pair to be idle for more than 6 s. So a 6 s rest never binds on background turns; it binds only on cards. In the harness a pair can turn at most every 8.2 s, so it never binds there either. The report's '0 s = 6 s' is therefore true by construction, not evidence. On the recommended auto board (1280x800, 30 seeds x 2 h, realistic order):
- 175 words: 84.7 returns per hour. 36% come less than 12 s after the pair's previous turn (median gap 16 s). 18% come within 15 s of a card on that pair turning or closing, so the card shows 'C, was B' and about 2–3 s after it fades the stone flips back to B. 6.4 pairs per 2 h run make 3 or more returns in a row (A→B→A→B).
- 200 words: 39.1 returns per hour, 33% under 12 s, 18% after a card, 2.7 such pairs per run.
- Fixed 9x8: the longest run of consecutive returns by one stone averages 15.2 per seed at realistic-275 and 11.2 at 300.

The synthesis rejected a 20 s rest because it lost beats on a fixed 9x8 board at 175 words, a configuration the recommendation never uses. Its own ablation already shows ret20 is fine on the auto board. *Fix:* Set the rest to 20–30 s. Measured on the auto board at 30 seeds x 2 h (Director) and 30 x 6000 ticks (harness), it keeps every verdict:
- 175 at 20 s: frozen 0.007, repeat 0.149 (Director); stuck 0.004, repeat 0.165 (harness).
- 200 at 20 s: frozen 0.002, repeat 0.078; harness stuck 0.002, repeat 0.087.
- Returns fall to 47 and 22 per hour (30 s: 33 and 16). None comes under 12 s, returns after a card fall to 0.1–0.5%, and pairs with 3+ returns in a row fall to 1.2 and 0.5 per run (30 s: 0.6 and 0.3).
- On 9x8 at 275/300, 20 s is equal or better on frozen and repeat, and the longest runs fall to 10.9 and 6.8.

Then update REPORT §2.4, §2.6, §3 and §8. Add return timing (gap, after-card share) and run length to the metrics, since the return is the one bend the designer is asked to accept.
- **[major] 'JUKUGO-LIKE from 200' holds on the 6-word repeat window, but the board visibly recycles its words about 3x faster than Jukugo** — Strict fresh-first tiers avoid exactly the window the repeat metric measures, so repetition moves just past it. Turns landing on a word from the pair's last 24, at 200 words: 0.265 in the harness (Jukugo 0.134) and 0.265 in the Director model (Jukugo 0.173). With 113 playable words, 18 stones all in view and 65 turns/min, the whole vocabulary cycles through the view in about 2 minutes. Director model, auto board, realistic order (Jukugo stock in brackets):
- in-view landings on a word that sat on an in-view stone in the last 60 s: 0.58 at 200 (0.145), 0.50 at 225, 0.40 at 300, 0.25 at 500, 0.13 at 905;
- card landings on a word a card showed in the last 5 min: 0.88 at 200 (0.30), 0.82 at 225, 0.73 at 300, 0.58 at 500, 0.34 at 905.
On this measure the piece reaches Jukugo's level only at about 650–905 words. It is not an engine bug. A board-level recency rule moved the 60 s figure from 0.58 to 0.42 but left the 5-minute card figure at 0.88–0.89. Fewer card slots help (capacity 1: 0.59), but only by cutting pace from 65 to 41 turns/min. *Fix:* Qualify the headline as 'JUKUGO-LIKE on the brief's metrics', and state the visible recycling next to it. Add rep24, recVis60 and noteRec300 (defined in critic-skeptic/NOTES.md) to the curve tables, so the designer chooses the minimum list knowing that cards repeat within 5 minutes about 9 times in 10 at 175–200 words. Present card capacity on a small board (1–2 slots) as a designer lever, with its measured pace cost. Say plainly that only more confirmed words fix this; bridge-first checking is the cheapest path.
- **[major] GOOD at 175 is a 1280x800 result; on a phone 175 fails, so plan on 200** — At 1280x800 the 5x4 floor is almost entirely in view (15.1 of 17.9 pairs). The Director model therefore collapses toward the harness, and the two simulators agreeing is weaker evidence than the report implies. At 390x844 (30 seeds, 1 h):
- only 7 pairs are in view at a time, and 12.3 of 17.9 are ever in view;
- each visible stone turns 5.9 times a minute (Jukugo on a phone: 3.9);
- realistic-175 repeats 0.226, failing GOOD (0.20); its last-24 repeat is 0.61;
- the 20 s rest doesn't rescue it (0.205);
- realistic-200 passes JUKUGO-LIKE (repeat 0.115, frozen 0.001, beats lost 0.005, linked 0.47), as does 225.
The report's viewport caveat cites the director explorer's engine, not POHAKU on a scaled floor. *Fix:* Report verdicts per viewport (390x844, 1280x800, 1920x1080) for POHAKU on the auto board, and make 200 realistic words the planning figure. If 175 must work on phones, size the board so a phone sees enough pairs. The candidates are a minimum pairs-in-view rule, or note capacity tied to visible pairs. Re-measure either one.
- **[major] The scaled floor conflicts with DESIGN §3, and the spec scales field positions but not their size** — The spec scales layoutFeatures positions by x1/21 and z1/14.5 but leaves the radii at 3.6–4.9. At 5x4 that puts eight features about 5.6 units apart where each is 7–10 units across. Their combined area is about 450 units², on a floor of 338 units² (28% of Jukugo's area): they would pile on top of each other. DESIGN §3.2/§3.5 puts much more on that island:
- 20–26 ahupuaʻa, the ala loa with ahu, streams and reef;
- eight places: fishpond, lava flow, loʻi terraces, kauhale, hālau waʻa, stream, cloud cap, star compass at sea.
With about half Jukugo's perimeter, each ahupuaʻa gets about 2.3 units of coast, roughly 1.5 slabs. On a portrait phone the 14.5-unit-deep floor fills only about half the screen height. None of this was simulated, and the report lists it only as 'a look question'. *Fix:* Make the trade-off explicit for the designer before implementation. Either specify how the island generator fits a small floor (scaled radii, fewer or merged places, fewer ahupuaʻa), or offer 6x5 (27 pairs) as the map-friendly alternative. 6x5 measured one step behind: 200/225 in the harness, 200/200 in the Director model. Add main.js user.dx/dz from BOUNDS and the feature radius rule to the spec, not only to the 'not simulated' list.
- **[minor] The Director model's stuck counts return-only pairs as healthy, which flatters the fixed-9x8 figures** — Under POHAKU, a pair whose only legal move is back to its previous word is not 'frozen', so the Director model's stuck (max of frozen and frozenVis) never sees it. Such pairs are the visible ping-pong. Strict counterpart, frozenVis + returnOnlyVis (both defined in NOTES.md):
- auto 175: 0.047; auto 200: 0.020 (the headline survives);
- 9x8 realistic-300: 0.045, above JUKUGO-LIKE's 0.03, although the report gives 9x8 Director JUKUGO-LIKE at 300;
- 9x8 realistic-275: 0.085.
On those 9x8 boards one stone made 11–15 returns in a row. The harness has stuckStrict, and the report notes four 9x8 rows would drop to GOOD; the Director model had no equivalent. *Fix:* Report strict stuck and the longest run of consecutive returns in the Director model. Restate the fixed-9x8 Director figures as GOOD at 275–300, with JUKUGO-LIKE not established at 300. Re-measure 9x8 with the longer rest before quoting it as the fallback.
- **[minor] Linked hovers near half only on average: the 18-pair floor swings 0.29–0.61, and steering barely acts at 175** — Harness, auto board. Linked 10th–90th percentile at 175 and 200: 0.29–0.61; Jukugo 0.46–0.57. Removing the join/break bonus entirely changes mean linked only from 0.460 to 0.444 at 175 (0.446 to 0.387 at 200, 0.535 to 0.482 at 905). The reach factor multiplies weights by 1–40, which swamps the +6 join bonus. Capping reach at 5 or 10 did not narrow the band. Most of the swing is the board itself: a 5x4 board at 905 words still runs 0.40–0.61. The thresholds judge only the mean. On small lists that mean comes mainly from the LINK_MAX rule, which was calibrated on the same curves it is judged on. *Fix:* Add linkedLo/linkedHi to the curve tables and to the verdict discussion, and present the wider swing as a cost of the 18-pair board (6x5 at 300: 0.445–0.64). Say that on small lists the ~0.5 comes from the LINK_MAX calibration rather than from steering. Check the rule out of sample: calibrate on one order and judge on the others.
- **[minor] Pace is unchanged per beat but faster per visible stone on the small board** — Director cadence is unchanged, but each visible stone moves more often than in Jukugo:
- 1280x800: 4.3 turns/min per visible stone (Jukugo 3.8);
- 1920x1080: 4.6 (Jukugo 3.5);
- 2560x1440: 4.3 (Jukugo 2.0), because capacity 4 runs 77 turns/min over just 18 stones;
- phone: 5.9 (Jukugo 3.9).
The brief defines 'calm pace' by the Director beat, but a viewer feels it per stone. *Fix:* Note this next to the board-sizing bend. If it matters, tie note capacity (and optionally the background interval) to the number of pairs in view rather than to screen width, and re-measure. Capacity 2 and 1 measured 53 and 41 turns/min.
- **[minor] The headline counts confirmed words, not words that can appear** — At 175 confirmed words, the 2-core leaves 92 playable, and one hour shows 47% of the list. At 200 it is 113 playable, 53% shown; at 225, 149 and 62%. The report discloses this in §2.1 and §9, but the headline and the min-viable tables say '175 words'. A dictionary checker reading the headline would expect every confirmed word to appear. Dropping the 2-core under a 20 s rest shows 57% at 175 and 70% at 225, but returns are 3–5x more frequent and recycling barely changes, so pruning itself is defensible. *Fix:* Write the headline and tables as 'confirmed / playable', e.g. '175 (92 playable)'. Point the checker at candidates that join the giant component (the lexicon-structure bridges list), since a confirmed word outside the 2-core never appears.
- **[minor] Spec gaps against Jukugo's real board.js and director.js** — - Board has no clock today. The spec needs chooseTurn(pair, now, linked) and turn(pair, choice, now), with the Director passing its `now`. That clock is divided by ?slow=, which is consistent.
- turnedAt is unset after the deal. A literal `now - pair.turnedAt >= rest` is then NaN; harmless, since there is no previous word yet, but it should be specified as `?? -Infinity`.
- Pokes are not modelled. A click on a return-only pair inside the rest opens a card that turns nothing and retires.
- The legal-only background pick and in-view steering add a canTurn and a desiredLinks() pass per beat; cheap at 36–130 tiles, but they should be stated.
- clampX/clampZ degenerate when the floor has 2 or fewer columns. Irrelevant from 5x4 up, but the auto formula allows cols = 2. *Fix:* Add these to REPORT §2.4–2.5: the signatures, the turnedAt default, poke behaviour (for example, a poke that finds no turn should not open a card), and a floor of 4 on cols and rows in the auto-grid formula.

Overall, POHAKU's core is sound and its reported numbers reproduce exactly. I copied the synthesis harness and Director model into my own directory, added metrics that make no random draws, and both models give the same rows as the synthesis (Director auto realistic-175, harness auto realistic-175). The changes are needed in how the result is judged and in one parameter, not in the engine's structure.

Checked and found correct:
- The fill deal matches the spec: neighbour match first, then degree bound 5 stepping down to 2, component of 12 or more, holes renumbered.
- Repeat is computed against the pair that actually turned, in both simulators, including after retries.
- Harness stuck is sampled every 10 ticks whether or not the tick turned, which is unbiased.
- No two entries share a display spelling, so there are no on-screen duplicates. Same-spelling, different-sense roots near each other are rare (homoNear at most 0.012).
- Choice and Director randomness is seeded per run (the deal was already seeded by the Board), so reruns are exact.
- Note retirements are about 1%, and fairness is better than Jukugo's (busiest 20% of pairs make 0.32 of turns, against 0.52).
- The 2-core choice is defensible once measured against the alternative.

The engine can't fix the visible recycling. That is list size times pace; a board-level recency rule and a capped reach factor were both tried and neither helped.

Recommended edits, in order:
1. Rest 20–30 s instead of 6 s. It is measured at 30 seeds and 4x length, and every verdict holds.
2. State the recycling numbers beside the 'JUKUGO-LIKE from 200' headline.
3. Plan on 200 words, because 175 fails on a phone.
4. Get designer sign-off on the 5x4 floor against DESIGN §3, or offer 6x5.
5. Report strict stuck and runs of consecutive returns in the Director model; the fixed-9x8 JUKUGO-LIKE at 300 does not survive that.

Not measurable here: how the island looks at 28% of Jukugo's floor area, how the floor looks as a band on a portrait phone, and pokes.

Everything is in engine/critic-skeptic/:
- NOTES.md: metric definitions and key tables
- results.tsv: 105 rows; results-*.jsonl hold the raw runs
- run-all.sh: reruns everything (about 25 min on 4 cores)
- simx.mjs / dsimx.mjs: the instrumented harness and Director model
- pohaku.js: adds the noSteer and boardRecent knobs
- engines.mjs: the critic variants at the bottom (ret12/20/30/60, noSteer, reachCap, br*, -prune, -prune ret*)
- runx.sh: runs one configuration
