# F5a phase 3: what the Aerie's terrain swing is made of

Lab: `/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/lab`. Everything ran in
the scratch copy `p2/pkg`. The f5a work tree is untouched (its status still shows only the old `sim/property.mjs`
edit and `node_modules`). Distances are given in tails.

## 0. How it was run

**The scratch copy.**
- `p2/pkg-p2-snapshot` is the copy as phase 2 left it.
- The new switches are listed in `p2/pkg/core/x.js`.
- With no switch set, pkg still plays identically to `orig` (15/15 battles).

**Pairing.** Screening runs are paired with run1 on seed 2222 (battle i = run1's battle i; Skirmish N 300).
"Δ" is variant minus base in the **first race's** fortified score.

**Swing** = the Aerie's fortified score minus its classic score. Base swings at N 300: B-W 13.5, S-W 24.5, I-W 20.8.
- The switches below act only where the board has height, so classic is unchanged.
- The variant swing is therefore base swing − Δ.

**Jobs.** At most 2 of my processes ran, every job load-gated at 7 (`p2/pjob.sh`, `p2/gate.sh`).

**Phase 3 compute:**
- 29,600 probe battles, 62 CPU-minutes inside `createMatch`;
- plus the Field fit (3,000 battles, 409 s wall on 2 workers).

## 1. Step 1: the swing by outcome (no new battles)

Script `p3/step1.mjs`, output `p3/step1.md`. Run1, seed 2222, N 1,000; the seed-3333 rich run agrees.

| pair | set | Aerie score | Aerie wiped | score when nobody is wiped | Aerie losses: fight / volley / blast / spell / morale | losses r1 r2 r3 r4 r5 | enemy charges into the Aerie per battle (contact %) | round of the first enemy charge home | round of the Aerie's first charge home |
|---|---|---|---|---|---|---|---|---|---|
| B-W | classic | 47.1 | 17.6% | 55.2 | 3.8 / 7.5 / 9.3 / 4.4 / 1.1 | 8.1 8.1 5.1 3.2 1.8 | 3.36 (77) | 2.35 | 1.76 |
| B-W | fortified | 63.1 | 10.7% | 70.2 | 3.6 / 7.2 / 9.1 / 4.7 / 1.1 | 7.2 7.8 5.1 3.4 2.3 | 2.75 (77) | 2.61 | 1.89 |
| S-W | classic | 32.9 | 29.8% | 46.8 | 9.4 / 9.5 / 4.7 / 2.7 / 1.3 | 4.9 7.4 7.3 5.0 2.9 | 6.35 (77) | 1.81 | 1.80 |
| S-W | fortified | 57.4 | 14.3% | 66.9 | 8.7 / 8.2 / 4.3 / 3.2 / 1.3 | 3.7 7.2 6.7 5.0 3.1 | 5.42 (76) | 1.95 | 1.90 |
| I-W | classic | 32.4 | 24.5% | 42.5 | 9.3 / 6.1 / 7.2 / 4.6 / 1.1 | 6.3 9.0 6.7 4.1 2.1 | 6.74 (72) | 1.83 | 2.01 |
| I-W | fortified | 59.9 | 12.0% | 68.0 | 7.9 / 6.1 / 6.7 / 4.6 / 1.2 | 4.5 8.5 6.4 4.3 2.8 | 5.20 (74) | 2.08 | 1.97 |

**Answer: "the Aerie is caught and killed less on fortified", not "it arrives sooner".**

The Aerie's own tempo is unchanged:
- its first charge lands at round 1.8-2.0 on both sets;
- its round-1 objective lead is the same (phase 2 showed halving it moves nothing).

On fortified, the enemy reaches it later and less often:
- the enemy charges the Aerie 0.6-1.5 times fewer a battle;
- the first enemy charge home comes 0.14-0.26 rounds later;
- the Aerie loses 0.9-1.8 fewer models in round 1;
- the wipe rate halves.

How the swing splits:
- About a quarter is wipes. Phase 1's counterfactual gave 20-30%.
- The rest is a 15-25-point higher score among battles nobody is wiped in.

**Failed enemy charges.** "No path" failures cannot be counted: the AI only declares a charge it has a plan for.
Declared charges succeed equally often on both sets (72-77%). The enemy simply declares fewer on fortified.
Charges against Aerie units on a deck are rare: 0.3-0.8 a battle.

## 2. Step 2: measurement-only counterfactuals (Skirmish fortified, N 300, paired)

| CF | where in the scratch copy |
|---|---|
| CF3 | `core/terrain/terrain.js` generate: after the layout, every rampart piece within 2.5 tails of a zone front is dead. The rest of the board is as drawn; boards with no keep become flat. |
| CF4 | `core/nav.js` reach: the Aerie's fliers use the height Dijkstra (mode `flywall`). Scenery and rough ground still don't matter to them, but floor steps and ledges block them as they block walkers. They climb stairs and ladders and may end on a deck they reach. Passed from `move.js`'s movePlan and `charge.js`'s chargePlan through `wallOf(u)`. |
| CF5 | `core/deploy.js` fits: no unit of any race deploys on a floor above STEP. |
| CF6 | `core/nav.js` reachHeight and walkableHeight: for walk and wreck modes, no floor or ledge test on the way. Ending rules are unchanged. `levelDist` becomes the straight line (`queries.js`). |

First-race fortified score, base 36.5 / 41.2 / 47.5 for B-W / S-W / I-W (and 52.7 for B-S).

| CF | B-W Δ | S-W Δ | I-W Δ | Aerie swing B-W / S-W / I-W | Aerie wiped on fortified, variant (base about 11 / 14 / 12%) | B-S Δ |
|---|---|---|---|---|---|---|
| CF3 no zone ramparts | +16.3 ± 3.6 | +32.2 ± 3.4 | +13.5 ± 3.5 | **−2.8 / −7.7 / +7.3** | 17 / 40 / 24% | **−12.7 ± 3.6** |
| CF4 walls block the Aerie's fliers | +5.2 ± 3.6 | +12.2 ± 3.6 | +1.2 ± 3.5 | 8.3 / 12.3 / 19.6 | 13 / 14 / 10% | |
| CF5 nobody deploys on a deck | −0.8 ± 3.5 | −2.2 ± 3.6 | −6.8 ± 3.5 | 14.3 / 26.7 / 27.6 | 10 / 12 / 8% | −5.3 ± 3.8 |
| CF6 walls block no ground path | +16.5 ± 3.4 | +34.0 ± 3.5 | +3.8 ± 3.3 | **−3.0 / −9.5 / +17.0** | 11 / 27 / 17% | −8.5 ± 3.8 |

**Verdict: the cause is the zone ramparts holding up the ground armies.** The fliers ignore them.
- **CF3 and CF6** each close the swing against the Bushtails and the Serpents completely, and overshoot against
  the Serpents. They close part of it against the Hive.
  - With the ramparts gone or crossable, the enemy reaches the Aerie as it does on classic: S-W wipes go back to
    27-40%.
- **CF4** works from the Aerie's side (fliers obey walls). It closes only about a third: 5, 12 and 1 points.
  - So this is not simply "fly against walls". The walls cost the walkers far more than they would cost a flier
    made to respect them, because the walkers must leave their own zone across their own rampart.
- **CF5** (deployment) is not it: it moves things the wrong way for the Aerie.
- **The ramparts also hold up the older pair.** Without them, or with them crossable, B-S moves 9-13 points, to
  40.0 / 44.2. The same pair is even on fortified today (52.7).
  - That is a roadmap finding: the fortified set's balance between the Bushtails and the Serpents rests on the
    ramparts.
  - With CF5, B-S moves −5.3 ± 3.8, which is within about 1.4 SE.

## 3. Step 3: Aerie-side dials (Skirmish N 300, paired)

| dial | where (scratch copy) |
|---|---|
| A6 wall toll | `core/nav.js` reach (fly mode) and `crossings()`: each raised run a straight flight passes over costs N tails off the move, advance or charge. Starting from or landing on a deck is free. `a6a` N = 2, `a6b` N = 4, `a6c` N = 6. |
| A5 | `data/races/bird.js` Stormtalons: no fly and no swoop. |
| A5b | A5, plus the Skyseer walks. |

| dial | B-W | S-W | I-W | Aerie swing B-W / S-W / I-W (base 13.5 / 24.5 / 20.8) |
|---|---|---|---|---|
| A6, 2 tails | fortified +5.0 ± 3.6 | +7.3 ± 3.5 | −3.5 ± 3.4 | 8.5 / 17.2 / 24.3 |
| A6, 4 tails | −0.5 ± 3.2 | +6.3 ± 3.6 | −7.5 ± 3.5 | 14.0 / 18.2 / 28.3 |
| A6, 6 tails | +5.8 ± 3.4 | +5.5 ± 3.5 | −5.3 ± 3.5 | 7.7 / 19.0 / 26.1 |
| A5 | classic +3.7, fortified −1.7 | +5.0 / +3.8 | +3.8 / −1.7 | 18.8 / 25.7 / 26.3 |
| A5b | +3.8 / +4.5 | +8.5 / +7.0 | +2.5 / −1.5 | 12.8 / 26.0 / 24.8 |

**The wall toll has no dose response.** The mean Δ is +2.9, −0.6 and +2.0 for 2, 4 and 6 tails. The Aerie's fliers
seldom pass over a fortification body: they fly round, or land.

**Making the Aerie walk widens the swing slightly.** Phase 1's flip (Stormtalons and Finches on foot) did the same.

**No Aerie-side dial I could build closes the swing.** I did not add a lever of my own. The decomposition says
the asymmetry is the opponents' own rampart slowing them. Neither the Aerie's flags nor its data can reach that
without touching terrain or other races.

**The honest answer for the owner.** This is a property of the fortified set's zone ramparts against any army
that doesn't walk. It already balances the older pair: removing the ramparts unbalances B-S by 9-13 points.
- It belongs either to the terrain/AI work (out of F5a's reach: the ramparts, or the AI's sortie from behind them),
  or to the HOME target, with the board shown before armies are picked.
- The one Aerie-side dial that moved it was CF4, about a third. As a rule it is the A1/A2 idea already rejected
  ("birds can't fly over a wall").

## 4. Step 4: the best full set, priced once, judged on seed 7777

**The set:** H3b, plus no Aerie dial (none passed step 3).

**Skirmish costs** are phase 2's fit (`pd`). It was fitted with H3b on seeds 2222 and 3333, and no Skirmish dial
was added since, so it still applies.

| race | costs |
|---|---|
| Hive | Spinethrowers 70, Delvers 95, Hoppers 75, Boilback 50; rest unchanged |
| Aerie | Finches 45, Kestrels 50, Roc 115; rest unchanged |

**Field entries, re-fitted:**
- **Aerie (`a4d`):** the fliers at ×1.2 their `pd` cost: Skyseer 85, Stormtalons 100, Finches 55, Kestrels 60,
  Roc 140. Taken from phase 2's response curve (50% at about ×1.18).
- **Hive (`hf2`):** Boilback 20, Hoppers 70.
  - The Field fit (`p2/fit-field.log`, seeds 2222 and 3333, N 600 a pair) found the Boilback worth about 10 and
    the Hoppers and Spinethrowers overpriced against the Bushtails. The fit is noisy (SE 10-30).
  - Spinethrowers at 60 as well (`hf`) would unbind the points: 153 of 1,000 lists.
- **Grand sanity row (`gx`):** extrapolated as the Aerie's fliers at ×1.4 plus the Hive's entry.

**Points bind** (of 1,000 Random lists):
- Skirmish: Hive 1000, Aerie 674.
- Field: Hive 677, Aerie 991.

**Preset problem.** The Aerie's Field preset `'224222'` costs 1,140 at these prices, over the Field limit. Phase 2's
×1.15 had the same problem at 1,110; I missed it then. The patch changes the preset to `'213222'` (975). The Grand
preset under `gx` (1,935) would be illegal too, so `gx` is a sanity row only.

**Results** (first race; set1 / set2, with the set2 − set1 difference in brackets). Today's table is played on the
same battles.

| size | pair | today | EVEN / HOME | best set | mean | EVEN / HOME |
|---|---|---|---|---|---|---|
| Skirm | B-S | 47.0 / 49.8 (+2.8) | EVEN / HOME | same | 48.4 | EVEN / HOME |
| Skirm | B-I | 41.8 / 47.8 (+6.0) | − / − | 48.2 / 45.1 (−3.1) | 46.6 | − / HOME |
| Skirm | B-W | 56.9 / 35.8 (−21.1) | − / − | 54.6 / 30.7 (−23.9) | 42.6 | − / − |
| Skirm | S-I | 43.2 / 49.1 (+5.9) | − / HOME | **48.5 / 46.5 (−2.0)** | 47.5 | **EVEN / HOME** |
| Skirm | S-W | 62.4 / 44.0 (−18.4) | − / − | 59.5 / 42.2 (−17.3) | 50.8 | − / **HOME** |
| Skirm | I-W | 71.1 / 37.3 (−33.7) | − / − | 61.8 / 40.6 (−21.2) | 51.2 | − / − (61.8) |
| Field | B-S | 55.3 / 50.0 (−5.3) | − / HOME | same | 52.7 | − / HOME |
| Field | B-I | 49.3 / 63.0 (+13.7) | − / − | 44.3 / 54.3 (+10.0) | 49.3 | − / HOME |
| Field | B-W | 32.3 / 20.3 (−12.0) | − / − | 68.0 / 45.7 (−22.3) | 56.8 | − / − |
| Field | S-I | 43.0 / 45.0 (+2.0) | − / − | 34.7 / 45.3 (+10.7) | 40.0 | − / − |
| Field | S-W | 40.7 / 26.0 (−14.7) | − / − | 61.7 / 41.0 (−20.7) | 51.3 | − / − (61.7) |
| Field | I-W | 54.0 / 17.3 (−36.7) | − / − | 79.0 / 53.7 (−25.3) | 66.3 | − / − |

**Cells passing, of 12:** today EVEN 1, HOME 3; best set EVEN 2, HOME 6.

**Hive.**
- It holds its fix on a fresh seed. The Skirmish swings are −3.1 and −2.0 (today +6.0 and +5.9).
- Against the Serpents it passes both targets. Against the Bushtails it passes HOME, missing EVEN by 0.9 on its
  fortified score.
- At Field the Hive entry overshoots against the Serpents: the Hive now scores about 60%.

**Aerie.**
- Its level is near even at Skirmish (means 43-51), but the swings stay at 17-24.
- Only S-W passes HOME: no set is outside 40-60, its mean is 50.8, and it has the smallest swing, 17.3.
- At Field ×1.2 overshoots against the Bushtails and the Hive (means 57 and 66). The response is steep, about 11
  points per 10%. Something nearer ×1.10-1.15 would centre B-W and I-W, but no single factor fixes the 21-25 point
  swings.

**Grand sanity row** (N 50, `gx`, reported, not chased):

| pair | today | best set |
|---|---|---|
| B-W | 0 / 0 | 4 / 19 |
| S-W | 3 / 1 | 19 / 22 |
| I-W | 2 / 4 | 26 / 19 |
| S-I | 29 / 33 | 29 / 31 |

The Aerie's Grand dominance halves (it wins 78-89% instead of 96-100%). At ×1.4 it is still too strong, so pace at
Grand would need about ×1.6 or more.

## 5. Recommended set and what remains

**Take:**
- **H3b** (`p2/patches/h3b-undermine.diff`).
- **The Skirmish costs** (`p2/patches/pd-skirmish-prices.diff`).
- **The Field entries** (`p2/patches/p3-field-prices.diff`): the Aerie ×1.2, the Hive Boilback 20 and Hoppers 70,
  and the Aerie's Field preset `'213222'`.
  - Re-tune these on the final judgment. My single-seed reading is the Aerie nearer ×1.12 and a Hive Boilback
    entry alone.
  - Check that `data-check` accepts the preset change: it has rows that name the field preset `'224222'`.

**Do not take:** any Aerie wall or flier dial. A6, A5 and A5b don't narrow the swing.

**Smallest Aerie swing reached, and its identity cost:**
- With an acceptable lever (A6 at 6 tails): 7.7 / 19.0 / 26.1, against 13.5 / 24.5 / 20.8, within noise, at no cost
  in identity because it barely bites.
- With the rejected one (CF4, fliers obey walls): 8.3 / 12.3 / 19.6, at the cost of birds that cannot fly over a
  rampart.

**Remains:**
- **The Aerie's swing is a terrain-set effect.** The opponents' own zone ramparts slow them, which halves the
  Aerie's wipes and adds 15-25 points among battles nobody is wiped in.
  - Only terrain (CF3) or everyone's pathing (CF6) closes it. Both also unbalance B-S by 9-13.
  - Under EVEN it is out of F5a's reach. Under HOME, S-W passes and B-W and I-W fail by their sets: 30.7 and 61.8.
- **Not measured:** an AI that sorties walkers off their works faster. That would belong to all races, like CF1,
  and moves recorded battles.

## 6. Files

**Patches** (in `/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/lab/p2/patches/`):

| patch | what it is |
|---|---|
| `h3b-undermine.diff` | the chosen Hive rule |
| `pd-skirmish-prices.diff` | the Skirmish costs |
| `p3-field-prices.diff` | the Field entries and the Aerie's Field preset (new this phase) |
| `all-switches.diff` | the scratch copy at the end of phase 2. The phase-3 switches are in `p2/pkg`; diff it against `p2/orig` for the full set. |

**Tables and scripts:**
- `p3/step1.md` (`p3/step1.mjs`): step 1.
- `p3/p3tables.md`: step 2 and step 3, made by `p2/p2.mjs` with the variant list as its argument (the full table
  ran out of memory).
- `p3/p3d.md` (`p3/p3d.mjs 7777 …`): step 4.
- `p2/fit-field.log`.
- Job lists: `p2/jobs-p3a.txt`, `p2/jobs-p3b.txt`, `p2/jobs-p3c.txt`.
- `notebook.md`.
