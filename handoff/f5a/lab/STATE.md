# F5a balance lab: state at the hand-over (stopped mid-phase 4)

`LAB` below means `/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/lab`.

## What this lab is

The lab is a diagnosis-and-prototype lab for the Tails & Scales F5a feature. F5a adds two races, the Deepdelve Hive
(`insect`) and the Highwind Aerie (`bird`). Both swing between terrain sets and sizes.

It only reads the package code; it never edits it.
- **Code measured:** `packages/tails-and-scales` on branch `wt/f5a` at **e5fdc90**.
- **Untouched work tree:** `/home/user/vibe-dump-wt/f5a`. It carries one old uncommitted edit (`sim/property.mjs`)
  and an untracked `node_modules`.

All experiments run on a **scratch copy** of the package's `core/` and `data/`. Every lever sits behind a switch.

Distances are called **tails** in prose. Code still says inches.

## How to run it, from a fresh checkout of wt/f5a at e5fdc90

### 1. The scratch copy

| path | what it is |
|---|---|
| `LAB/p2/orig/` | copy of `core/`, `data/` and `package.json` at e5fdc90 |
| `LAB/p2/pkg/` | the same with every switch; this is what runs |
| `LAB/p2/pkg-p2-snapshot`, `LAB/p2/pkg-p3-snapshot` | the copy as phases 2 and 3 left it |
| `LAB/p2/patches/all-switches.diff` | `diff -ru orig pkg`; current, includes phase 4's set-price switch |

To rebuild on a new machine:
1. Copy `core/`, `data/` and `package.json` from the checkout into `orig/`.
2. Copy `orig/` to `pkg/`.
3. In `pkg/`, run `patch -p1 < all-switches.diff`. The paths in the diff begin `orig/` and `pkg/`, so strip one
   level.

### 2. The switch file: `p2/pkg/core/x.js`

`TS_X=a,b,c` in the environment turns switches on. With none on, pkg plays battle-for-battle identical to orig:
`node p2/ident.mjs <orig> <pkg>` reports 15/15.

| switch | what it does | status |
|---|---|---|
| `cf1` | AI high-ground term off for every race | measurement |
| `cf2` | Aerie fliers kept off decks | measurement |
| `cf3` | zone ramparts removed | measurement |
| `cf4` | fortification bodies block the Aerie's fliers | measurement |
| `cf5` | no unit deploys on a deck | measurement |
| `cf6` | walls block no ground path | measurement |
| `h1` | Spinethrowers `ai: 'line'` | dropped |
| `h2` | burrow passes under decks | dropped |
| `h3` | undermine with the objective's range | inert |
| `h3b` | undermine measured from the deck's edge | **taken** |
| `a3`, `a3b` | fliers' OC cut | dropped |
| `w1` | canopy cover for the Aerie's fliers | dropped |
| `a4a`, `a4b`, `a4c`, `a4d` | Aerie Field price ×1.25, ×1.5, ×1.15, ×1.2 | |
| `hf`, `hf2` | Hive Field entries | |
| `gx` | Grand extrapolation of the Field entries | |
| `a5`, `a5b` | Stormtalons (and Skyseer) walk | dropped |
| `a6a`, `a6b`, `a6c` | wall toll of 2, 4, 6 tails | dropped |
| `pd` | phase 2's re-fitted Skirmish costs | |
| `sp` | **phase 4: the set-price mechanism** | written, proven |
| `spd` | **phase 4: the set-price data**, a JSON file named by the env var `TS_SP` | written |

### 3. The probe: `LAB/probe.mjs`

- It plays army-sim's own score-gate battles. The draw is `mulberry32(cyrb53("seed:stream:i"))`, with stream
  `score:<pair>:<set>`, prefixed `field:` or `grand:` above Skirmish. Lists come from `autoList` at the mission's
  limit, and seats swap on odd i.
- It writes one JSON line per battle: the telemetry, plus `--rich` (positions, decks, per-unit OC).
- It refuses seeds 1111, 4444 and 5555.
- It reads the copy's `core/x.js` for the h3/h3b OC count. When the copy has `army.listFor`, it builds lists with
  that (phase 4).
- Example:
  `TS_X=h3b node LAB/probe.mjs --rich --dir LAB/p2/pkg --mission classic --set fortified --pair serpent,insect --n 300 --start 0 --seed 2222 --out f.jsonl`

### 4. The job runners

They take one cell per line and are run with `xargs -P 2 -L 1 <runner> < jobs.txt`. Every job waits while the
1-minute load is over 7. A finished cell has a `.done` file next to it, so a re-run skips it (resumable).

| runner | job line | output |
|---|---|---|
| `p2/pjob.sh` (phases 2 and 3) | `<variant: base or switches joined by +> <mission> <set> <pair> <n> <start> [seed]` | `p2/data/` |
| `p4/job.sh` (phase 4) | `<label> <TS_X or base> <TS_SP file or -> <mission> <set> <pair> <n> <start> <seed>` | `p4/data/` |

Also:
- `p2/gate.sh cmd…`: the load gate on its own.
- Phase 1's runners: `job.sh`, `rjob.sh`, `bjob.sh`.

### 5. The tables scripts

All are Node; they read the jsonl files.

| phase | scripts |
|---|---|
| 1 | `agg.mjs`, `attr.mjs`, `rich.mjs`, `bstats.mjs`, `within.mjs`, `wipe.mjs`, `perch.mjs`, `home.mjs`, `lists.mjs` |
| shared | `load.mjs` (the loader and an IRLS logistic fit) |
| 2 | `p2/p2.mjs [variants]`: paired tables. Give it a variant list; the full table runs out of memory. |
| 2 | `p2/p2d.mjs`: the D table on 6666 |
| 2 | `p2/bind.mjs <pkgdir>`: points-bind figures |
| 3 | `p3/step1.mjs`, `p3/p3d.mjs <seed> <label> [label2]` |
| 4 | `p4/table.mjs`, `p4/solve.mjs`, `p4/obs.mjs`, `p4/judge.mjs`: see the phase 4 section |

### 6. The fit (army-sim)

Run army-sim from the work tree against the scratch copy:

```
cd <checkout>/packages/tails-and-scales
TS_X=... node sim/army-sim.mjs --fit --mission <m> --races insect,bird --seed 2222,3333 --n N --jobs 2 --dir LAB/p2/pkg
```

- It loads `core/` and `data/` from `--dir`, and its workers inherit `TS_X`.
- Logs so far: `p2/fit-d.log` (Skirmish, with h3b) and `p2/fit-field.log` (Field, with h3b and pd).
- army-sim does **not** know set prices (phase 4): it builds lists from `MISSIONS[m].list`. Phase 4 therefore fits
  by scores with `p4/solve.mjs`, not with army-sim.

### 7. Pairing and seeds

**Pairing.** Screening runs use seed 2222 from battle 0. Variant battle i is run1's battle i (`LAB/data/`, seed 2222):
the same board, lists and dice. Report the paired delta.

| seeds | use |
|---|---|
| 2222, 3333 | fitting and screening |
| 6666 | phase 2's judgment (spent) |
| 7777 | phase 3's judgment (spent) |
| 8888 | reserved for phase 4's judgment, unused |
| 1111, 4444, 5555 | the final judgment by a later task: never use them |

### 8. Paths a new machine must change

| where | path |
|---|---|
| hard-coded inside the scripts | `LAB` itself |
| | `/home/user/vibe-dump-wt/f5a/packages/tails-and-scales` (the default `--dir` of `board.mjs`, the import in `lists.mjs`, the one in `same.mjs`) |
| in the runners | the absolute `LAB` path baked into `job.sh`, `rjob.sh`, `bjob.sh`, `p2/pjob.sh`, `p4/job.sh` |
| | the `TMPDIR` the runners set to `LAB/tmp` |
| in the job lists | absolute `TS_SP` paths in `p4/jobs-it1.txt` |

`load.mjs` and the `p2`/`p3`/`p4` scripts resolve paths from their own location (`import.meta.url`).

## Findings, phases 1 to 3

1. **Hive's Skirmish swing** (strong on classic) was the keep (25-60%) plus the zone ramparts lengthening ground
   paths (burrowers lose 2.9 tails in round 1).
2. **H3b closes the Hive's swing.** Undermine from a deck's edge took it from −6.5 / −8.3 to −0.2 / −1.3 (paired), and
   on 6666 and 7777 to −3.6 / +1.3 and −3.1 / −2.0. H3 as specified is inert: the keep's foot is 3 tails or more from
   the objective.
3. **Aerie's swing** (strong on fortified): 15-30 points at Skirmish and Field. About a quarter is fewer wipes; the
   rest is a 15-25-point higher score among battles nobody is wiped in.
4. **The Aerie is caught and killed less on fortified, not faster.** The enemy charges it 0.6-1.5 times fewer a
   battle and arrives 0.15-0.26 rounds later; the Aerie's own tempo is unchanged.
5. **The cause is each army's own zone ramparts slowing its walkers; fliers ignore them.** CF3 (no ramparts) and CF6
   (walls block no ground path) close the swing against the Bushtails and the Serpents. CF4 (fliers obey walls)
   closes only about a third.
6. **The older pair's fortified balance rests on the ramparts.** CF3 and CF6 move B-S by 9-13 points. This is a
   roadmap finding.
7. **The AI's high-ground term (CF1) moves the swings 4 points or less.** Perching comes from deployment onto the
   works, but no-deck deployment (CF5) doesn't close the swing either.
8. **No Aerie stat or movement dial narrowed the swing** (OC, cover, walking units, wall toll). They only change its
   level.
9. **Pace at Field and Grand is priceable but steep:** about 11 points per 10% on the fliers' cost. The Aerie wins
   96-100% at Grand today; the Hive wins 59-79% there.
10. **Phase 3's best set** on 7777 (H3b, phase 2's Skirmish costs, Field Aerie ×1.2 and Hive Boilback 20 / Hoppers
    70) passed EVEN in 2 and HOME in 6 of 12 cells (today: 1 and 3). Every Aerie swing outside 40-60 remained.

## Decisions taken (coordinator)

- **In:** H3b.
- **Out:** H1, H2, H3, A3, A3b, A5, A5b, A6, w1. CF1 to CF6 were measurements only.
- **Kept as a mechanism:** the Field price entry; its factor gets re-fitted.
- **Not allowed:** any change to terrain generation, missions' boards, or the older races' AI or data. The rampart
  finding goes to the roadmap.
- **Targets:**
  - EVEN: both sets in 46-54.
  - HOME: the mean of the sets in 46-54, and both sets in 40-60.
  - The owner hasn't said which binds, so report both.

## Phase 4: the brief, as given

> Price the two new races by terrain set as well as by size, and judge the whole table on a fresh seed.
>
> 1. Scratch copy: a switch for set prices (e.g. list.setPrices: { fortified: { bird: { unit: cost } } }), looked up
>    before the size entry, before the unit's own cost. Only the two new races get entries; prove identity with
>    ident.mjs with the switch on and no entries. Presets must be legal on every set they can be fought on; say what
>    you do where a surcharge breaks one.
> 2. Fit, seeds 2222 and 3333: for each size (Skirmish, Field, Grand) and each set, the costs of the Aerie's and the
>    Hive's units, starting from phase 3's table. Prefer one factor per race per set per size, applied to its fliers
>    (Aerie) or all its units (Hive); per unit only where one unit's fit sits far from the factor. The unit's base
>    cost stays the Skirmish classic cost. Grand fitted properly (N 150 a cell); the Hive's 59-79% there is in scope.
> 3. Judge on seed 8888: Skirmish N 600 a cell, Field N 150, Grand N 150, all six pairs, both sets, both targets, with
>    today's table beside it. Report EVEN and HOME counts for the new-pair cells per size, points-bind figures per
>    size and set, and each race's presets' costs on each set.
> 4. Say plainly what price could not reach: cells still failing HOME and why (pair-specific gaps, a slot-bound
>    list, a swing between sets larger than a sane surcharge, at most 30% between two sets of one size; cap it and
>    report the residue).
>
> Conditions: scratch copy only, at most 2 processes, load-gated at 7, notebook current. Write phase4.md and
> standalone patches (the set-price mechanism, the data entries, any preset change) in p2/patches/.

## How far phase 4 got

**Step 1, the mechanism: done and proven.**
- `p2/pkg/core/army.js` `listFor(rules, set)`, behind `X.sp`, lays `rules.setPrices[set]` over `rules.prices` race by
  race.
  - `armyOf` uses `listFor(mission.list, setup.terrain ?? mission.sets[0])`; `fullSetup` fills terrain before
    `armyOf`.
  - `unitPrice` uses `setup.terrain`.
- `p2/pkg/data/mission.js`, behind `X.spd`, reads the JSON file at `TS_SP` into each list's `setPrices` for classic,
  field and grand. `LIST_KEYS` gains `'setPrices'`; there is no validation of its entries yet.
- `probe.mjs` builds lists with `A.listFor(list, set)`.
- **Identity:** no switch 15/15, `sp` 15/15, and `sp,spd` with an empty table (`LAB/p4-empty.json`) 15/15.
- **Not yet done:**
  - a proof with real entries that B-S battles stay identical (run ident on older-pair battles only, with `sp1.json`);
  - the standalone patch of the mechanism. It exists only inside `all-switches.diff`.

**Step 2, the fit: started, not finished.**
- **Tools:**
  - `p4/table.mjs factors.json out.json`: factors to prices. The Aerie's fliers are scaled by fW and the Hive's units
    by fI. Base costs are phase 2's `pd`: Hive 60/75/70/95/75/50, Aerie 70/85/65/45/50/115. At Field and Grand the
    Hive's base is Boilback 20 and Hoppers 70. Prices are rounded to 5.
  - `p4/solve.mjs obs.json [kW kI]`: one factor per race per set per size, from the first-race logit, slope
    priors kW 6 and kI 8. It fits the slopes once two or more factor points exist per cell, and caps the ratio
    between a size's two sets at 1.3.
  - `p4/obs.mjs label factors.json`: turns `p4/data` cells into observations.
- **Iteration 0** is phase 3's 7777 judgment (`p4/obs0.json`). It gave `p4/factors1.json`, with fW / fI:

  | size | first set | fortified |
  |---|---|---|
  | Skirmish | classic 0.95 / 1.01 | 1.10 / 1.02 |
  | Field | open 1.07 / 1.06 | 1.23 / 1.01 |
  | Grand | open 2.03 / 1.14 | 1.81 / 1.06 |

  The prices are in `p4/sp1.json`.
- **Iteration 1** (`p4/jobs-it1.txt`, label `it1`) was stopped at 12 of 60 cells. All 12 are seed 2222, B-I and B-W.
  First race, set1 / set2:

  | pair | Skirmish | Field | Grand |
  |---|---|---|---|
  | B-W | 48.3 / 47.0 | 39.3 / 48.0 | 48.0 / 34.0 |
  | B-I | 46.0 / 52.0 | 62.7 / 49.3 | 38.7 / 42.0 |

  N is 150 at Skirmish and 75 at Field and Grand. This is not enough to solve with.
- **Presets** are not yet handled. At the `sp1` prices they break:
  - the Aerie's classic list costs 530 on fortified;
  - its Field preset costs 1050 / 1150;
  - its Grand preset costs 2610 / 2370;
  - the Hive's Grand preset costs 1590 on open.

  Plan: per size, pick the preset legal at the dearest set, by dropping units from the default while keeping the
  role minimums. Phase 3's Aerie Field preset was `'213222'` (975 at ×1.2).

**Steps 3 and 4: not started.** Seed 8888 is unused. `p4/judge.mjs <seed> <label>` is written but untested.

**Note for step 2:** phase 3's Grand gx data is N 50 and underpowered. Grand needs a fW of about 1.8-2.0, a size
factor of about 2×. That is allowed (the 30% cap is between sets), but say so.

## Commands to pick phase 4 up (on the new machine, after fixing paths)

```
cd LAB
# finish iteration 1 (resumable: .done cells are skipped)
nohup sh -c "xargs -P 2 -L 1 ./p4/job.sh < p4/jobs-it1.txt" > p4/run-it1.log 2>&1 &
# solve iteration 2 from iterations 0 and 1 (then the slopes are fitted)
node p4/obs.mjs it1 p4/factors1.json > p4/obs1.json
node -e "const a=require('./p4/obs0.json'),b=require('./p4/obs1.json');require('fs').writeFileSync('p4/obs01.json',JSON.stringify(a.concat(b)))"
node p4/solve.mjs p4/obs01.json > p4/solve2.json   # write its factors as p4/factors2.json (W, I per mission/set)
node p4/table.mjs p4/factors2.json p4/sp2.json
# iteration 2: copy jobs-it1.txt with it1 -> it2 and sp1.json -> sp2.json, run, re-solve on obs0+1+2
# presets: compute legal presets at the dearest set per size (p2/bind.mjs pattern), add to the race files under a switch
# judge on 8888: label 'set' with TS_X=h3b,pd,sp,spd TS_SP=<final sp.json>, and 'base' (TS_X=base, TS_SP=-),
#   Skirmish N 600, Field N 150, Grand N 150, all six pairs and both sets; then node p4/judge.mjs 8888 set
# binds: TS_X=h3b,pd,sp,spd TS_SP=... node p2/bind.mjs LAB/p2/pkg (extend it to call army.listFor per set)
```

## Where everything is

**Reports:**
- `diagnosis.md` (phase 1);
- `phase2.md`;
- `phase3.md`;
- `notebook.md`: the chronological record.

**Patches** (in `p2/patches/`):

| patch | what it is |
|---|---|
| `h3b-undermine.diff` | the H3b rule |
| `pd-skirmish-prices.diff` | phase 2's Skirmish costs |
| `p3-field-prices.diff` | phase 3's Field entries and the Aerie's Field preset |
| `a4c-field-prices.diff`, `h1-spinethrowers-line.diff`, `h2-burrow-under-decks.diff` | dropped or superseded levers |
| `all-switches.diff` | everything, phase 4's switch included |

**Data:**

| path | what it holds |
|---|---|
| `data/` | run1: seed 2222, N 1000 at Skirmish |
| `rich/` | seed 3333 |
| `boards/` | board facts |
| `p2/data/` | phase 2 and 3 cells |
| `p4/data/` | phase 4's 12 iteration-1 cells |
