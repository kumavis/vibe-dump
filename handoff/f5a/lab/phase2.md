# F5a phase 2: counterfactuals, prototypes, one priced set

Lab: `/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/lab`. Everything ran in
a scratch copy. Nothing in `/home/user/vibe-dump-wt/f5a` was edited, and its status is unchanged.

## 0. How it was run

**The scratch copy.**
- `p2/orig/` is the package's `core/`, `data/` and `package.json` at e5fdc90.
- `p2/pkg/` is the same with every lever behind a switch. The switches are read from the environment
  (`TS_X=h3b,a4c,...`) by `p2/pkg/core/x.js`.
- With no switch set, pkg plays battle-for-battle identical to orig: 15/15 final trace lines match (`p2/ident.mjs`).
- army-sim ran from the work tree with `--dir p2/pkg`. It loads core and data from DIR, and its workers inherit
  `TS_X`.

**The battles.**
- `probe.mjs --rich` draws army-sim's score-gate battles.
- Sections 1-3 use seed 2222 from battle 0. Each variant cell is therefore paired with the phase-1 run1 battles
  of the same index (same boards, lists and dice).
  - "Δ" below is the paired difference, variant minus baseline, in the first race's score (the gate's
    convention).
  - Paired SEs are about 2-3.5 points at N 300 (battles diverge once one roll differs). Levers that act only on
    keep boards are tighter (about 1.5).
- The table in section 4 uses seed **6666**.

**The targets.**
- **EVEN:** both sets in 46-54.
- **HOME:** the mean of the two sets in 46-54, and neither set outside 40-60.

**Compute and load.**
- 46,700 probe battles (101 CPU-minutes inside `createMatch`), plus the fit's 6,000 battles (3 minutes wall on 2
  workers).
- At most 2 of my processes ran at a time. Every job waited while the 1-minute load was over 7 (`p2/pjob.sh`,
  `p2/gate.sh`).

**Swing** = the focus race's score on fortified minus its score on classic/open, in points. The focus race is the
new race in the pair (the Aerie in I-W).

## 1. Counterfactuals (measurement only, never candidate rules)

### CF1: the AI's high-ground term off for every race

Implemented at `core/ai/score.js:708`: `+0.25/inch of floor` for the shooter and artillery roles, behind `!X.cf1`.

| pair | Skirmish fortified, base → CF1 | Δ | focus swing, base → CF1 |
|---|---|---|---|
| B-S | 52.7 → 54.0 | +1.3 ± 2.6 | |
| B-I | 49.0 → 46.7 | −2.3 ± 2.5 | −6.5 → −4.2 |
| S-I | 51.2 → 51.5 | +0.3 ± 2.0 | −8.3 → −8.7 |
| B-W | 36.5 → 40.3 | +3.8 ± 2.4 | 13.5 → 9.7 |
| S-W | 41.2 → 43.5 | +2.3 ± 2.2 | 24.5 → 22.2 |
| I-W | 47.5 → 48.3 | +0.8 ± 2.0 | 20.8 → 20.0 |

- **It barely moves the perch.** Walking shooters and heroes on decks fall from 59% to 56% of their round ends
  (B-S), 58% to 53% (B-I) and 54% to 49% (S-I).
- **What does park them** is the deployment and its inertia. `deploy.js` puts the front rows on the works' decks
  ("312 of 700 units started on the works' decks"), and heroes value company. The high-ground term is not the
  cause.
- **Field (N 100):**
  - B-S fortified 45.5 → 57.5 (+12.0 ± 4.9): the older pair leaves the band.
  - B-I fortified +1.5 ± 4.5.
  - B-W fortified −0.5 ± 3.9.
- **Size:** at most 4 points of any Skirmish swing. It shrinks the Aerie's by 0.8-3.8 and leaves the Hive's within
  noise.
- **The older pair at Skirmish** stays even on fortified (54.0). At Field it moves by 12 (noisy).
- **For the owner:** the measured part says "the game is uneven", not "the AI's high-ground term plays
  fortifications badly". The deployment onto the works is a separate, unmeasured AI factor (section 5).

### CF2: the Aerie's fliers may not end a move or a charge on, or deploy onto, a floor above STEP

Implemented at `core/actions/move.js:54`: `groundOnly` is also true for the Aerie's fliers. That forbids raised cells
in their end mask, their charge spots and their deployment.

| pair | Skirmish fortified, base → CF2 | Δ | Aerie swing, base → CF2 | keep term | Aerie round-1 objective lead |
|---|---|---|---|---|---|
| B-W | 36.5 → 43.5 | +7.0 ± 3.3 | 13.5 → 6.5 | 4.5 → 0.7 | 0.59 → 0.31 |
| S-W | 41.2 → 40.8 | −0.3 ± 3.6 | 24.5 → 24.8 | −0.8 → 0.3 | 0.94 → 0.53 |
| I-W | 47.5 → 43.8 | −3.7 ± 3.4 | 20.8 → 24.5 | 5.0 → 0.0 | 0.78 → 0.50 |

**Size of the deck channel:** about +1 point on average (−4 to +7). The keep term goes to 0 and the round-1 lead
halves, yet the swing does not follow. Decks are not what the Aerie's swing is made of.

## 2. Hive levers (Skirmish N 300, Field N 100, Grand S-I fortified N 50)

| lever | where (scratch copy) |
|---|---|
| **H1** | `data/races/insect.js:42`: Spinethrowers `ai: 'line'` |
| **H2** | `core/nav.js:634,642-644` (reachHeight: no floor or ledge test for burrow); `:732-733` (walkableHeight); `core/actions/move.js:101` (the burrower's mask leaves raised cells open on the way); `move.js:237` and `charge.js:99` (it still ends only on floor ≤ STEP); deployment unchanged |
| **H3** (as specified) | `core/queries.js:299`: a burrower's ground model within 3" + base of a raised objective counts |
| **H3b** | `core/queries.js:301` plus `deckGap`: the range is measured from the edge of the deck the objective stands on |

**H3 as specified is inert.** In 100 S-I fortified battles it counted 0 OC and every score equalled the baseline.
- The keep is 6×6 inches, so its foot is 3 inches or more from the objective.
- The ledge field keeps a squad's base off the wall.

H3b is the working form, and the combinations use it.

First-race score Δ (paired); then the Hive's swing, base → variant.

| variant | Skirm B-I classic / fort | Skirm S-I classic / fort | Hive swing B-I, S-I | Skirm I-W fort | Field B-I open / fort | Field S-I open / fort | Grand S-I fort |
|---|---|---|---|---|---|---|---|
| base (score) | 42.5 / 49.0 | 42.8 / 51.2 | −6.5, −8.3 | 47.5 | 56.0 / 61.0 | 39.5 / 47.0 | 28.0 |
| H1 | +2.7 / +0.2 | +6.5 / +3.0 | −4.0, −4.8 | −2.3 | +11.0 / −6.5 | +2.5 / −7.5 | −2.0 |
| H2 | 0 / +0.5 | 0 / −3.3 | −7.0, −5.0 | −0.3 | 0 / −0.5 | 0 / −9.0 | +3.0 |
| H3b | 0 / **−6.3 ± 1.5** | 0 / **−7.0 ± 1.7** | **−0.2, −1.3** | +6.7 | 0 / −3.0 | 0 / −10.0 | −3.0 |
| H1+H2 | +2.7 / −3.2 | +6.5 / −4.0 | −0.7, +2.2 | +0.5 | +11.0 / −3.0 | +2.5 / −4.0 | −8.0 |
| H1+H3b | +2.7 / −7.3 | +6.5 / −5.2 | +3.5, +3.3 | +2.5 | +11.0 / −11.5 | +2.5 / −12.5 | −6.0 |
| H1+H2+H3b | +2.7 / −13.3 | +6.5 / −12.0 | **+9.5, +10.2** | +8.8 | +11.0 / −8.0 | +2.5 / −12.5 | −12.0 |

**Against the three phase-1 terms:**
- **Keep term:**
  - H3b takes it from −2.5/−6.3 to 0 or positive. The Hive then does slightly better on keep boards (B-I
    keep-board share × difference +8.6).
  - H1 and H2 do not touch it.
- **Detour term:**
  - H2 restores 1.4 inches of the Delvers' 3.3-inch round-1 loss on fortified (9.2 → 10.6).
  - Its score effect is small and noisy (−3 to +0.5 at Skirmish, −9 ± 5 for S-I at Field).
- **Perch term:**
  - H1 cuts the Hive's own perch share by about 10 points (58 → 48% B-I, 54 → 44% S-I) and lifts the Hive's OC on
    the keep.
  - But H1 also changes classic (a `line` role plays differently on flat boards too): the Hive is 3-6.5 points
    weaker there.
  - At Field it overshoots: the B-I swing goes −5 → +12.5.

**Overshoot.**
- H1+H2+H3b reverses the swing to about +10 and makes the Hive too strong at Grand (−12 ± 7 on a cell where the
  Hive already wins 72%).
- H1+H3b reverses it to +3.5 and overshoots at Field.

**Recommended Hive set: H3b alone, the deck-edge undermine.**
- It is the only lever that closes the measured keep term.
- It does so where the term was measured, with the smallest variance, and leaves classic and open boards
  untouched by construction.
- H2 is an optional second: thematic, small, mainly at Field. H1 is not recommended (it moves classic and
  overshoots at Field).

## 3. Aerie levers

### A3: what the fliers hold (Skirmish N 300; Field N 100)

- **A3:** Finches OC0, Kestrels OC0, Roc OC2.
- **A3b:** A3 plus Stormtalons OC0.
- Implemented at `data/races/bird.js:53, 63, 74, 85`.

| variant | Aerie swing, Skirmish B-W / S-W / I-W | Field | Aerie r1 lead (Skirm fort) | first-race Δ classic / fort, typical |
|---|---|---|---|---|
| base | 13.5 / 24.5 / 20.8 | 14.5 / 12.0 / 27.5 | 0.59 / 0.94 / 0.78 | |
| A3 | 19.3 / 16.5 / 22.2 | 10.0 / 14.0 / 22.0 | 0.30 / 0.43 / 0.48 | +10 to +18 / +9 to +26 (Aerie much weaker) |
| A3b | 22.3 / 14.7 / 19.7 | 3.0 / 8.0 / 28.0 | 0.17 / 0.29 / 0.26 | +13 to +26 / +14 to +29 |

- **The round-1 objective lead does shrink:** it halves under A3 and falls to a third under A3b.
- **The swing does not.** Its Skirmish mean goes 19.6 → 19.3 (A3) and 18.9 (A3b).
- **What the fliers hold sets the Aerie's level, not its terrain swing.** That also argues against pace (H-speed)
  as the set driver.

### A4: Field prices for every flying Aerie unit, through the mission's `list.prices`

Implemented at `data/mission.js:94`. Field first race, open / fortified (mean); N 100.

| | B-W | S-W | I-W |
|---|---|---|---|
| base | 39.5 / 25.0 (32) | 38.5 / 26.5 (32.5) | 52.0 / 24.5 (38) |
| ×1.25 (a4a) | 64.5 / 54.5 (59.5) | 72.5 / 54.0 (63) | 75.0 / 46.5 (61) |
| ×1.5 (a4b) | 86.5 / 79.5 (83) | 85.5 / 73.0 (79) | 94.5 / 79.5 (87) |
| A3 + ×1.25 | 84.0 / 72.5 | 89.5 / 74.5 | 95.5 / 66.0 |
| A3 + ×1.5 | 93.0 / 86.0 | 96.5 / 92.0 | 94.5 / 88.0 |

**Pace at Field is priceable.**
- The response is steep and roughly linear: about +11 first-race points per +10% on the fliers' cost.
- The centre is near ×1.13-1.16. I took **×1.15 (a4c**: Skyseer 80, Stormtalons 100, Finches 55, Kestrels 50,
  Roc 140). It was interpolated, then tested in section 4.
- **A price cannot fix the swing:** at ×1.25 the swings are 10 / 18.5 / 28.5.
- A3 combined with any price overshoots.

### My own lever: w1, canopy cover

**Why I tried it.** Fliers are never in cover, and the classic set has the cover terrain. I expected cover for the
birds to lift them on classic more than on fortified.

**Rule as tested** (`core/queries.js:142`): the Aerie's fliers are in cover by the walkers' half-the-models test.

**Result: no effect.** Classic −0.7 to +1.3, fortified −1.0 to −2.2, swings unchanged (17.0 / 27.2 / 22.3). Refuted;
not recommended.

**Recommended Aerie set:**
- No stat lever tested narrows the Aerie's terrain swing.
- Take **the Field price entry ×1.15 (a4c)**: it is the one tested lever that fixes the Aerie's size problem.
- Keep the stats as they are, and re-fit the Skirmish costs.

## 4. The best set, priced once (D)

**The set:** H3b + a4c, with the two races' Skirmish costs re-fitted.

**The fit.** `army-sim --fit --mission classic --races insect,bird --seed 2222,3333 --n 500 --jobs 2 --dir p2/pkg`
with `TS_X=h3b,a4c`. The output is in `p2/fit-d.log`. Each unit's price is the mean of its three pair fits, rounded
to 5; the heroes stay as they are. These new costs are switch `pd`.

| race | unit | cost |
|---|---|---|
| Hive | Deepguard | 75 |
| Hive | Spinethrowers | 75 → 70 |
| Hive | Delvers | 90 → 95 |
| Hive | Hoppers | 65 → 75 |
| Hive | Boilback | 45 → 50 |
| Hive | Hivemother | 60 |
| Aerie | Stormtalons | 85 |
| Aerie | Longbills | 65 |
| Aerie | Finches | 50 → 45 |
| Aerie | Kestrels | 45 → 50 |
| Aerie | Roc | 120 → 115 |
| Aerie | Skyseer | 70 |

Classic lists: Hive 495, Aerie 495.

**Points bind** (army-sim's `bindOf`, `p2/bind.mjs`; of 1,000 Random lists):

| | Skirmish, today | Skirmish, D | Field, today | Field, D |
|---|---|---|---|---|
| Hive | 888 | 1000 | 916 | 970 |
| Aerie | 776 | 674 | 934 | 970 |

**Judged on seed 6666.** Skirmish N 600 a cell, Field N 150. Today's table on the same battles is beside it.
First-race score, set1 / set2 (set2 − set1).

| size | pair | today | EVEN / HOME | D | mean | EVEN / HOME |
|---|---|---|---|---|---|---|
| Skirm | B-S | 50.9 / 50.3 (−0.6) | EVEN / HOME | 50.9 / 50.3 (−0.6) | 50.6 | EVEN / HOME |
| Skirm | B-I | 43.9 / 54.8 (+10.8) | − / HOME | **48.6 / 49.9 (+1.3)** | 49.3 | **EVEN / HOME** |
| Skirm | B-W | 55.0 / 35.8 (−19.3) | − / − | 50.1 / 33.7 (−16.4) | 41.9 | − / − |
| Skirm | S-I | 42.8 / 49.8 (+7.1) | − / HOME | 46.8 / 43.3 (−3.6) | 45.0 | − / − |
| Skirm | S-W | 68.4 / 45.0 (−23.4) | − / − | 63.2 / 42.3 (−20.8) | 52.8 | − / − |
| Skirm | I-W | 69.0 / 38.2 (−30.8) | − / − | 61.3 / 46.4 (−14.9) | 53.9 | − / − |
| Field | B-S | 50.0 / 54.0 (+4.0) | EVEN / HOME | same | 52.0 | EVEN / HOME |
| Field | B-I | 62.0 / 61.7 (−0.3) | − / − | 64.7 / 55.3 (−9.3) | 60.0 | − / − |
| Field | B-W | 35.3 / 20.3 (−15.0) | − / − | 52.7 / 33.0 (−19.7) | 42.8 | − / − |
| Field | S-I | 44.0 / 50.3 (+6.3) | − / HOME | 46.3 / 55.3 (+9.0) | 50.8 | − / HOME |
| Field | S-W | 48.0 / 21.7 (−26.3) | − / − | 53.3 / 38.3 (−15.0) | 45.8 | − / − |
| Field | I-W | 46.3 / 17.3 (−29.0) | − / − | 62.0 / 31.7 (−30.3) | 46.8 | − / − |

**Cells passing, of 12:** today EVEN 2, HOME 5; D EVEN 3, HOME 4.

**Hive:**
- The Skirmish swing shrinks: B-I 10.8 → 1.3, S-I 7.1 → −3.6.
- B-I becomes EVEN at Skirmish.
- S-I misses by its level, not its swing: the Hive is about 5 points too strong there.
- At Field the Hive is weak against the Bushtails (mean 60).

**Aerie:**
- The Field price brings its means to 43-47, inside or near HOME's 46-54.
- Every Aerie pair still fails both targets, because the swings stay at 15-21 (Skirmish) and 15-30 (Field).

## 5. What remains unexplained, and what I would measure next

**The Aerie's terrain swing is still unexplained.** It is about 15-30 points.

Measured and found small or null:
- what the fliers hold (A3, A3b);
- landing on decks (CF2, about 1 point);
- the high-ground term (CF1, 4 points or less);
- cover (w1);
- the round-1 lead: halving it left the swing.

Not measured, because both are outside the rules on offer:
- **The zone ramparts themselves** (phase 1's detour term). The Aerie flies over them and the walkers do not.
- **The deployment that stands the front rows on the works.**

Two measurement-only counterfactuals would settle them:
- CF3: fortified boards without the zone ramparts.
- CF4: A2 as a measurement, with fortification bodies blocking the fliers' paths.

If CF3 explains the swing, the honest message to the owner is that the fortified set's ramparts favour fliers.
That points to the HOME target with the board shown before armies are picked.

## 6. Files

**Patches** (in `/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/lab/p2/patches/`): standalone builder patches against the package at e5fdc90, `diff -ru a b`, paths relative to `packages/tails-and-scales`. No switches.

| patch | what it is |
|---|---|
| `h3b-undermine.diff` | the recommended Hive lever, in `core/queries.js` |
| `a4c-field-prices.diff` | the Aerie's Field price entry |
| `pd-skirmish-prices.diff` | the re-fitted Skirmish costs |
| `h2-burrow-under-decks.diff` | |
| `h1-spinethrowers-line.diff` | |
| `all-switches.diff` | the scratch copy with every switch (CF1, CF2, H1-H3b, A3, A3b, A4a-c, w1, pd) |

**Tables and logs:**
- `p2/p2tables.md` (`p2/p2.mjs`): every variant cell beside its paired baseline, with the keep term, non-keep gap,
  round-1 lead, wipes, perch shares, OC at raised objectives, Delvers' progress and both verdicts.
- `p2/p2d.md` (`p2/p2d.mjs`): the table in section 4.
- `p2/fit-d.log`.
- `p2/data/`: the battles.
- Job lists `p2/jobs-p2a.txt`, `p2/jobs-p2b.txt`, `p2/jobs-p2d.txt`.
- `notebook.md`.
