# Engine study — family "reuse"

Can Jukugo's engine keep Pōhaku Tumble lively on a small word list by *reusing*
words: a word already on the floor, or the word a pair just left? Measured on
Jukugo's real `Board` (patched copy), against the brief's thresholds.

## Answer in five lines

1. **Distant duplicates alone buy little** (as `research/ROOTS.md` found): on
   R300 9x8 they take beats lost from 0.25 to ~0.19. Only a radius small enough
   to put both copies in one camera view helps much.
2. **What works is a fallback ladder plus letting a rested pair go back.**
   Draw from the best non-empty tier — a fresh word; else a far duplicate; else
   an older word from the pair's last 6; else the word it just left (only after
   it has rested ~6 s) — and retry another idle pair on a null. Each piece
   alone fails; together they turn stock R300 9x8 (stall 0.23, stuck 0.22,
   repeat 0.26) into stall 0, stuck 0.014, repeat 0.12 (JUKUGO-LIKE).
3. **Minimum lists (realistic order, 30 seeds, 1500 ticks):** stock needs 905 for
   GOOD on 9x8 and never reaches JUKUGO-LIKE. The final rules (tiers + rest 3 +
   retry 6 + dealMin 3) reach GOOD at 250 / JUKUGO-LIKE at 300–350 on 9x8, and
   GOOD at 200 / JUKUGO-LIKE at 300 on a 6x5 board whose floor shrinks with it.
4. **Below ~200 nothing in this family can work**: a single pair walking the
   R175 graph with no other pairs in the way still repeats ~18% of its turns
   (R225 13%, R300 8.5%). That is the list, not the rules.
5. **The brief's scheduler is optimistic.** A Director-faithful sim (turns only
   in view, notes on their own beat) is much harsher; there the final rules
   match Jukugo's own figures at R300 on a 6x5 board, R350–400 on 7x6, R400 on 9x8.

## Files

| file | what |
| --- | --- |
| `prepare.mjs` | copies Jukugo's `board.js`/`field.js` into `.build/` and patches in the knobs below (absolute paths to `packages/jukugo-tumble/src`) |
| `lexicon.sim.js` | the original stand-in for `lexicon.js` (Jukugo import made absolute) |
| `sim.mjs` | the brief's scheduler (random idle pair per tick), seeded; metrics below |
| `dirsim.mjs` | Director-faithful scheduler (`director.js` + `main.js` camera drift), seconds |
| `run.mjs`, `dirrun.mjs` | run a stage file in parallel → `results/<stage>.jsonl/.tsv` |
| `stages/*.mjs` | every configuration run (`rules.mjs` = named rule sets, `common.mjs` = grids) |
| `mklex.mjs` | intermediate sizes 150/200/250/275/350 → `lex/` (the curves are nested prefixes of `curve-*-905`, checked) |
| `graph.mjs` | turn-graph components per lexicon |
| `minviable.mjs`, `ablation.mjs`, `analyze.mjs`, `show.mjs`, `merge.mjs`, `verdict.mjs` | summaries |
| `results.tsv` | every uniform-sim row, all stages (`stage` column) |
| `dirsim.tsv` | every Director-sim row |
| `results/minviable-*.tsv`, `results/ablation-9x8.tsv` | summaries |
| `report.mjs` | the key rows and min-viable table, as JSON (`results/report.json`) |
| `rerun.sh` | rebuilds everything (~3 h on 4 cores) |

Columns added mid-study: `frozen` (from s2 on) and `dupViewHD` (s7) are blank in
earlier stages' rows. A rerun fills them without changing any other number,
because both are computed without extra random draws. This was checked: the s5
and s7 rows for T-P12-D20-R6-d3 on R250 9x8 are identical.

Lexicons are read from `roots/.cache/tiers/`.
`attested-WA` splits roots by spelling; `curve-*-128` is the same 128 words with
roots split by sense (`lua#0`/`lua#1`), as the grammar requires — prefer the latter.

## Harness changes (vs `research/roots/sim/`)

- `Math.random` seeded per seed (rows are reproducible).
- `Board.options(pair)` = the exact list `chooseTurn` draws from; **stuck counts
  pairs whose list is empty under the rules in force** (the original counted
  "on the board", wrong once duplicates or returns are allowed; identical under
  stock rules). Samples are taken whether or not that tick stalled.
- `used` is a word→count map (a word may sit on the floor twice).
- Knobs (all default to Jukugo): `dupFar` (radius), `dealDupFar` (deal only),
  `dupBox [w,h]` (block a copy only if both could be in one w×h view), `dupW`,
  `prevAfter` (ticks of rest before the previous word is allowed again), `banK`,
  `recentW`, `tiers`, `linkMax`, `nearMax`, `scaleBounds`; plus the original
  `dealMin`, `matchMin`, `retry`, grid, `horizontalOnly`, `slab`.
- Grids: `9x8` Jukugo's (~65 pairs); `7x6` (~38 pairs) on Jukugo's 42×29 floor with
  LINK_MAX and the deal's near radius scaled ×1.31 (15.05 / 11.8); `7x6s`, `6x5s`
  (~38 / ~27 pairs) on a floor shrunk with the grid so spacing and LINK_MAX stay Jukugo's.

## Metrics

Uniform sim (`sim.mjs`), per seed then averaged over seeds; a row "deals" only if every seed dealt.

- `stallRate` (= beats lost): ticks with no turn after retries / ticks.
- `stuck`: mean share of pairs with an empty `options()` list, every 50 ticks.
- `frozen`: as stuck but counting each pair as rested — pairs that cannot move
  until another pair frees a word (equals stuck without `prevAfter`).
- `linked`: mean `linkedFraction()`, every 10 ticks.
- `repeatRate`: turns landing on a word in the pair's last 6 / turns.
- `flipRate`: turns landing on the pair's immediately previous word (A→B→A) / turns.
- `seenFrac`: share of the lexicon shown at least once.
- `dupTurn`: turns whose new word was already on another pair / turns.
- `dupBoard`: mean extra copies on the floor (Σ count−1), every 10 ticks — what a
  viewer could see with the whole floor in view (zoomed out, or a big screen).
- `dupView`: share of camera draws (8 per sample) where one 26×17 window, centre
  uniform in Jukugo's default drift box (x ±3.9, z ±1.8), holds two pairs showing
  the same word. `dupViewHD`: same centres, 32×22 window (1920×1080). `dupViewPan`:
  26×17, centre anywhere the user can pan. `dupFits`: some two copies are within
  26×17 of each other at all.

Director sim (`dirsim.mjs`): `bgLost` (background beats with candidates but no
turn), `bgEmpty` (no candidate pair), `noteFail` (note turn attempts with nowhere to
go), `noteShort` (notes retired before their 2nd turn for lack of a turn),
`cardFlip` (2nd note turn returns to the word the card opened on), `repeat`,
`flip`, `linked`, `stuckView` (pairs in view with no legal turn), `dupView` (camera
window holds two copies, real drift path), `tpm` (turns/min).

Thresholds as in the brief (`verdict.mjs`): GOOD = deals every seed, stall ≤ 0.05,
stuck ≤ 0.10, repeat ≤ 0.20, linked 0.35–0.70; JUKUGO-LIKE = stall ≤ 0.02,
stuck ≤ 0.03, repeat ≤ 0.13, linked 0.40–0.65.

## Results

### 1. One knob at a time (s1, 9x8, 10 seeds)

From stock (dealMin 1). R300: stall 0.25 / stuck 0.24 / repeat 0.26.

- **retry 6** hides lost beats (stall 0) but stuck stays 0.25: the frozen pairs are still frozen.
- **distant duplicates**: D 11.5 → 31 gives stall 0.19 → 0.24. Only D ≤ 20 helps measurably,
  and at D 14 two copies share a 26×17 view in 49% of camera draws (R300), 29% at D 17,
  15% at D 20, ~0.2% at D 26, 0 at D 31.1.
- **return to the previous word after N ticks**: stall 0.25 → 0.02 (N ≤ 4) … 0.05 (N 25),
  but repeat 0.26 → 0.44 and a quarter of all turns are A→B→A flips.
- **dealMin 2/3/5 with deal duplicates**: small gains (R300 dealMin 5: stall 0.16).

### 2. Ablation (s2 factorial, 9x8, 10 seeds; `results/ablation-9x8.tsv`)

| R300 9x8 | stall | stuck | repeat | flip | verdict |
| --- | --- | --- | --- | --- | --- |
| stock (dealMin 1) | 0.250 | 0.238 | 0.263 | 0 | – |
| + retry 6 | 0 | 0.245 | 0.273 | 0 | – |
| + tiers | 0.280 | 0.262 | 0.084 | 0 | – |
| + rest 12 | 0.037 | 0.042 | 0.416 | 0.212 | – |
| full (tiers, rest 12, D26, retry 6, dealMin 3) | 0 | 0.020 | 0.127 | 0.045 | JUKUGO |
| full − tiers | 0 | 0.016 | 0.389 | 0.185 | – |
| full − rest | 0 | 0.248 | 0.068 | 0 | – |
| full − retry | 0.020 | 0.024 | 0.128 | 0.048 | JUKUGO |
| full − dealMin 3 | 0 | 0.043 | 0.152 | 0.069 | GOOD |
| full − duplicates | 0 | 0.028 | 0.131 | 0.045 | GOOD |

Tiers and rest are the pair that matters: rest un-freezes pairs (a dead end
becomes a detour) and tiers keep the detour a last resort, so repeats stay low.

### 3. Steady state (s4, s6 `@12000`)

Stock rules have absorbing traps (a pair whose only way out is the word it
just left is frozen for good), so stock decays with time: R500 9x8 stuck 0.09
(1500 ticks) → 0.22 (6000) → 0.31 (12000); even Jukugo's own list drifts 0.003 →
0.017. With rest, no trap is absorbing: the final rules are flat (R300 9x8 stuck
0.014 → 0.013) and repeats creep up slightly (0.120 → 0.133, which drops R300
9x8 from JUKUGO-LIKE to GOOD at 12000 ticks). At 1500 ticks the brief's stock
baseline looks better than it is.

### 4. Minimum viable list (s6/s7, 30 seeds × 1500 ticks; `results/minviable-*.tsv`)

Smallest curve size meeting the bar at that size *and every larger size measured*
(sizes 128, 150, 175, 200, 225, 250, 275, 300, 350, 400, 500, 650, 905).

| rules | order | 9x8 GOOD / JL | 7x6 | 7x6s | 6x5s |
| --- | --- | --- | --- | --- | --- |
| stock (dealMin 1) | realistic | 905 / – | – / – | 905 / – | – / – |
| stock | random | 905 / – | – / – | – / – | – / – |
| stock | best | 400 / – | 400 / – | 400 / – | – / – |
| T-P3-box-R6-d3 | realistic | 250 / 300 | 200 / 250 | 225 / 300 | 200 / 300 |
| T-P3-box-R6-d3 | random | 275 / 400 | 275 / 350 | 275 / 350 | 275 / 350 |
| T-P3-box-R6-d3 | best | 400 / 500 | 400 / 500 | 400 / 500 | 400 / 500 |
| **T-P3-dd31-R6-d3** | realistic | 250 / 350 | 225 / 300 | 225 / 300 | **200 / 300** |
| T-P3-dd31-R6-d3 | random | 350 / 400 | 275 / 350 | 275 / 350 | 275 / 350 |
| T-P3-dd31-R6-d3 | best | 500 / 500 | 400 / 500 | 400 / 500 | 400 / 500 |

- `T-P3-box-R6-d3` = tiers, previous word allowed after 3 beats (~6 s) of rest,
  duplicates only where both copies can never be in one 26×17 view
  (|dx| > 27 or |dz| > 18), retry 6, deal from degree ≥ 3 (duplicates by the same box rule as fallback).
- `T-P3-dd31-R6-d3` = the same with no turn ever creating a duplicate (only the deal, as a fallback).
- **best order fails only on linked** (> 0.70: hub roots, and tiers weaken the link
  steering). Its liveliness is JUKUGO-LIKE from 175 up. A shorter LINK_MAX fixes
  it: LINK_MAX 7.5 gives B225 GOOD (linked 0.69) and B300 JUKUGO-LIKE (s5b, 10 seeds).
- 6x5s JUKUGO-LIKE at 250 is met at 250 but missed at 275 (repeat 0.13x); hence "300".
- R128 (sense-split) on 9x8 does not deal with dealMin 3 even with duplicates
  (9/30 seeds); the deal must fall back to dealMin 1 there. No configuration
  makes 128 viable (best on 7x6: stuck 0.13, repeat 0.43).

### 5. Duplicates — would anyone see them?

The camera footprint depends on the window (main.js: ppu = clamp(min(w,h)/17, 34, 60),
pitch 55°, zoom 0.6–1.9 with ±3.5% breathing, yaw −8°…+2°):

| window | floor footprint at default zoom | vs the 42 × 29 floor |
| --- | --- | --- |
| 1280×800 | ~27 × 21 | about half |
| 1920×1080 | ~32 × 22 | |
| 2560×1440 | ~43 × 29 | **the whole floor** |
| any, zoomed to 0.6 | ≥ 43 × 35 | the whole floor |

So no distance rule hides duplicates on a large screen or after zooming out;
there `dupBoard` is what the viewer sees. Measured (s5, 30 seeds):

| 9x8 | rule | dupTurn | dupBoard | dupView (26×17) | dupViewPan |
| --- | --- | --- | --- | --- | --- |
| R250 | D20 | 0.060 | 2.0 | 0.053 | 0.031 |
| R250 | D26 | 0.036 | 1.3 | 0.004 | 0.001 |
| R250 | box 27×18 | 0.041 | 1.45 | 0 | 0 |
| R300 | box 27×18 | 0.020 | 0.74 | 0 | 0 |
| R400 | box 27×18 | 0.009 | 0.36 | 0 | 0 |
| R250 | deal only (dd31) | 0 | 0.05 | 0 | 0 |

The 26×17-safe box is not safe at 1920×1080 (s7, 30 seeds; `dupViewHD` = share of
camera draws with two copies inside a 32×22 view):

| 9x8 | rule | stuck | repeat | dupBoard | dupView 26×17 | dupViewHD 32×22 |
| --- | --- | --- | --- | --- | --- | --- |
| R200 | box 27×18 | 0.057 | 0.237 | 4.1 | 0 | **0.335** |
| R200 | box 33×23 (HD-safe) | 0.096 | 0.297 | 1.3 | 0 | 0 |
| R200 | none (deal only) | 0.121 | 0.320 | 0.11 | 0 | 0 |
| R250 | box 27×18 | 0.022 | 0.152 | 1.45 | 0 | 0.117 |
| R250 | box 33×23 | 0.031 | 0.177 | 0.43 | 0 | 0 |
| R250 | none | 0.038 | 0.190 | 0.05 | 0 | 0 |
| R300 | box 27×18 | 0.014 | 0.120 | 0.74 | 0 | 0.066 |
| R300 | box 33×23 | 0.018 | 0.130 | 0.21 | 0 | 0 |
| R300 | none | 0.020 | 0.135 | 0.07 | 0 | 0 |
| R250 | D20 (rest 12) | 0.025 | 0.137 | 2.0 | 0.053 | 0.280 |
| R250 | D14 (rest 12) | 0.016 | 0.122 | 3.0 | 0.222 | 0.566 |

So the duplicate benefit shrinks as the rule is made safe for bigger windows, and
on the whole-floor views (2560×1440, zoom-out) every copy in `dupBoard` is visible.

On the 7x6s/6x5s floors (≤ 32.7 × 21.75) few pairs are 27 apart, so the box rule
seldom fires (dupBoard ≤ 0.5 at R175+) and changes nothing measurable; on 6x5s
it cannot fire at all (max |dx| ≈ 24.6, max |dz| ≈ 15.4), so box = none there.

What duplicates buy under the final rules (rest 3), 9x8, 30 seeds: R250 stuck
0.038 → 0.022, repeat 0.190 → 0.152 (both GOOD); R300 GOOD → JUKUGO-LIKE (repeat
0.135 → 0.120). In the Director sim they help only on 9x8 below R300 (R250
noteShort 0.20 → 0.16) and nothing at R300+ or on the small floors.

### 6. Director-faithful check (d1–d3, 10 seeds × 1 h; `dirsim.tsv`)

The brief's scheduler spreads turns over all ~65 pairs. The real Director turns only
pairs comfortably in view (~13 of 65 at 26×17), so each of them turns 5–10× as often,
runs through its neighbourhood, and stock rules trap it fast: stock R500 9x8 loses
58% of background beats (uniform sim: 10%) and 73% of notes retire early.

Rest length matters here: rest 12 beats (~25 s) leaves R300 9x8 with 25% of notes
retiring early; rest 3 (~6 s) cuts that to 11%. A rest of 3 beats is still longer
than the 4.2–5.8 s between a note's two turns, so **no card ever flips back**
(`cardFlip` = 0 in every run).

Jukugo itself: bgLost 0.04, noteShort 0.053, repeat 0.125, stuckView 0.024, linked 0.57.

| final rules (T-P3-box-R6-d3) | bgLost | noteShort | repeat | flip | stuckView | linked |
| --- | --- | --- | --- | --- | --- | --- |
| 9x8 R250 | 0 | 0.158 | 0.261 | 0.089 | 0.072 | 0.68 |
| 9x8 R300 | 0 | 0.108 | 0.180 | 0.075 | 0.051 | 0.65 |
| 9x8 R400 | 0 | 0.054 | 0.135 | 0.039 | 0.027 | 0.63 |
| 7x6s R250 | 0 | 0.092 | 0.199 | 0.063 | 0.042 | 0.59 |
| 7x6s R300 | 0 | 0.083 | 0.151 | 0.059 | 0.035 | 0.59 |
| 7x6s R350 | 0 | 0.057 | 0.127 | 0.038 | 0.027 | 0.59 |
| 6x5s R250 | 0 | 0.083 | 0.139 | 0.045 | 0.032 | 0.54 |
| 6x5s R300 | 0 | 0.055 | 0.114 | 0.037 | 0.022 | 0.55 |
| stock 9x8 R300 | 0.73 | 0.845 | 0.408 | 0 | 0.652 | 0.56 |

The fixed-floor 7x6 (sparser) is worse under the Director than in the uniform sim:
too few pairs in view, so 4–7% of background beats find no candidate (`bgEmpty`).
Prefer a smaller floor (7x6s/6x5s) to a sparser one.

## Recommendation

`T-P3-dd31-R6-d3` sized to the list: tiers + previous word after ~6 s rest +
director retry + deal from degree ≥ 3 with a bounded deal that falls back to
far duplicates (then degree ≥ 1) rather than hanging; **no turn ever creates a
duplicate**. Board: 6x5 cells on a floor shrunk to match (~27 pairs) below ~300
words; 7x6 (~38) from ~300; Jukugo's 9x8 from ~400.

- Brief's sim: GOOD from 200 words (6x5s), JUKUGO-LIKE from 250 (met at 250 and
  300, missed at 275 by 0.005 of repeat).
- Director sim: matches Jukugo's own figures at ~300 on 6x5s, ~350 on 7x6s, ~400 on 9x8.
- Turn-time duplicates are worth it only on the full 9x8 floor below ~300 words,
  and only with a rule sized to the largest window and zoom supported. That is
  not possible for 2560×1440 or zoom-out, where the whole floor is in view.

## Caveats

- Nothing here measures how a turn *looks*. The flip rate (2–9% of turns at R250+)
  is a background stone tumbling back to the root it just left, at least 6 s later;
  whether that reads as "lively" or "undecided" is a design call.
- The 26×17 view is the brief's figure; main.js gives ~27×21 at 1280×800 and the
  whole floor at 2560×1440 or zoomed out.
- The Director sim leaves out user pan/zoom/poke and card layout; the camera window
  margins are fractions of 26×17.
- Smaller floors change the look (fewer stones, the island map smaller or cropped);
  the sim cannot judge that.
- Thresholds are on means over seeds; per-seed maxima are in `stallMax`/`stuckMax`.
- 1500-tick numbers flatter stock (absorbing traps); see §3.
