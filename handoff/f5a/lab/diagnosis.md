# F5a: why the Hive and the Aerie swing between terrain sets (diagnosis)

Code measured: `/home/user/vibe-dump-wt/f5a/packages/tails-and-scales` at e5fdc90 (read-only; nothing in it was
edited). Lab: `/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/lab`.
No rule, price or data change was made or tried. Everything below is observational: AI-against-AI battles that
army-sim itself would play, read with telemetry.

## 0. Method

- **The battles.** `probe.mjs` draws army-sim's own score-gate battles: for seed, mission, pair and set it uses
  the same stream name (`score:<pair>:<set>`, prefixed by mission above Skirmish), the same
  `mulberry32(cyrb53("seed:stream:i"))` draw of board, dice and both `autoList` lists at the mission's limit, and
  the same seat swap on odd i. All seats are `ai`. Battle seeds: **2222** for the main run and **3333** for the
  "rich" replication. Both are fit seeds; 1111, 4444 and 5555 were never used.
- **The hooks.** `createMatch(setup, { out, onTrace })`. `out` is a push-only sink that reads `unit.slain`
  (with the killer's unit id), `unit.flee`, `unit.move`, `unit.face`, `charge.result` and `melee`. `onTrace` gives
  G at every trace line, so each round end is snapshotted from the live state with the rules' own functions
  (`controlOf`, `floorAt`, `HIGH`, `OBJECTIVE_RANGE`, `isEngaged`, `Terrain.los`).
  `same.mjs` checks that a non-null sink leaves a battle unchanged: the final trace line is identical in 18 of 18
  battles. The probe's scores also reproduce the gate's numbers (section 1).
- **Kill causes.** Each loss is labelled by the log line that reports it. `shoot` and stray shots count as
  volley, `fire` then `hits` as blast/template, `casts` then `hits` (or mesmerize) as spell, `fight` as fight, and
  a flee as morale. Nothing was left unclassified.
- **Board facts.** `board.mjs` rebuilds each battle's board, with human seats so it stops at deployment. It
  records:
  - the centre piece: keep, tower ring, rockbox or open;
  - each objective's floor, whether it is raised, and whether a stair or only a ladder leads up;
  - openness: 60-80 random ground-to-ground lines of 12, 18 and 24 inches from a zone front, or from inside a
    zone, toward the enemy, tested with `Terrain.los`, eye at floor + 0.95, chest at floor + 0.55;
  - travel detour: `nav.reach` cost for a 1-inch disc, walk (climbing) and burrow, from 5 points inside each zone
    to each objective, divided by the straight line;
  - terrain shares of no-man's land.
- **Coverage, run1 (seed 2222):**
  - Skirmish: all 6 pairs on both sets, N 1,000 per cell (raised from the 300 asked; compute allowed it).
  - Field: the 5 new-race pairs on both sets, N 300.
  - Grand: 5 pairs on both sets, N 100 (B-W, S-W and S-I as asked, plus B-I and I-W).
- **Coverage, run3 (seed 3333, `--rich`: unit positions, the deck recipe each unit stands on, OC counted per
  unit, seat edges):**
  - Skirmish: 6 pairs on both sets, N 400.
  - Field: B-W, S-I and I-W on both sets, N 150.
- **Compute.** 21,700 battles, 38 CPU-minutes inside `createMatch` and about 45 process-minutes with telemetry.
  Board facts for 15,000 boards took about 15 process-minutes, with no battles. At most 3 processes ran at once,
  with load at or under 4.6.
- **"Focus" race:** the new race in a pair (the Aerie in I-W); the Serpents in the control pair B-S. Unless noted,
  scores are the focus race's, in %. Each SE is a sample SE.

## 1. The swings, reproduced

First race's score (the gate's convention). Seed 2222; Skirmish N 1,000, Field N 300, Grand N 100.

| pair | Skirm classic / fortified | Field open / fortified | Grand open / fortified |
|---|---|---|---|
| B-S | 48.2 / 49.0 | | |
| B-I | 42.6 / 52.5 | 54.3 / 58.3 | 34.0 / 41.5 |
| S-I | 41.5 / 52.1 | 42.2 / 47.7 | 21.0 / 23.0 |
| B-W | 52.9 / 36.9 | 32.5 / 22.5 | 0.0 / 1.0 |
| S-W | 67.1 / 42.6 | 40.7 / 24.5 | 1.0 / 1.5 |
| I-W | 67.7 / 40.1 | 53.3 / 22.7 | 6.5 / 3.0 |

- These match the gate tables in rounds.md.
- **One correction to the brief.** At Grand the Hive **wins** 59-79% on both sets: the first race scores 21-42
  against it, here and in rounds.md's Grand row. The brief says the Hive "loses 55-78%".
- **Replication on seed 3333** (focus score swing, fortified minus classic, N 400; full table in rich.md R1):
  - B-S +2.4
  - B-I −2.2 ± 3.4 (seed 2222: −9.9). The Hive's swing against the Bushtails is the least stable number here.
  - S-I −7.5
  - B-W +14.5
  - S-W +24.6
  - I-W +34.9

**How the battles end** (tables.md §1):
- The Hive's battles are decided on score (95-100% of them).
- The Aerie is wiped out on classic in 17.6% (B), 29.8% (S) and 24.5% (I) of its battles. On fortified the rates
  fall to 10.7%, 14.3% and 12.0%.

## 2. The board facts (boards.md)

**Centre piece, Skirmish:**
- Classic set: tower ring 55%, rockbox 27%, open 18%.
- Fortified set: keep 49%, tower 30%, open 20%.
- Field and Grand: open set rockbox 80%, open 20%; fortified keep 50%, rockbox 29%, open 21%.

**Raised objectives:** only the keep's centre is ever raised. No flank objective is raised at any size.
- Each fortified board has exactly 0 or 1 raised objective (0.45-0.58 a board on average).
- The keep's top is 2.5 inches up and is reached by stairs in 100% of cases. Nothing on the ground can count
  there.

**Tower ring (classic):** a walking squad's 1-inch disc cannot reach the centre on 54% of classic boards. A
burrower can always reach it; it tunnels under the columns. A flier lands inside.

**Ramparts and the walk detour** (path cost over the straight line):

| board | to flank objectives | to the centre |
|---|---|---|
| Skirmish, classic | 1.03 | 1.04 |
| Skirmish, fortified | 1.15 | 1.17 |
| Field, open | 1.04 | |
| Field, fortified | 1.08 | |
| Grand, open | 1.04 | |
| Grand, fortified | 1.07 | |

- Burrow detours are the same as walk detours on fortified, and 1% better on classic.
- Fliers pay 1.00 on every board.

**Openness:**
- From the zone fronts, fortified is the more open set: clear 18-inch lines 64% against 48%.
- From inside the zones the two sets are about equal: 52% against 50% at 18 inches, 44% against 36% at 24.
- Fortified no-man's land has less difficult ground (0.3% against 1.9%) and fewer walker-blocking cells (6%
  against 16%).

## 3. Attribution

### 3.1 The keep (H-deck): a minority share, and almost all of it is the Hive's

The natural experiment is the fortified set's own keep boards against its non-keep boards (attribution.md §C).
- **Keep term** = keep boards' share × (keep-board score − non-keep fortified score).
- **Same-piece effect** = the fortified-minus-classic difference on boards with the *same* centre piece (tower or
  open).
- The swing equals the keep term plus the non-keep gap, exactly. The centre-mix residual is under 1 point
  everywhere at Skirmish.

| Skirmish pair | swing | keep term | same-centre set effect |
|---|---|---|---|
| B-S (control) | −0.8 | +3.5 | −4.7 |
| B-I (Hive) | −9.9 | **−2.5** | −7.5 |
| S-I (Hive) | −10.6 | **−6.3** | −4.3 |
| B-W (Aerie) | +16.0 | +3.6 | +12.5 |
| S-W (Aerie) | +24.5 | −0.8 | +25.9 |
| I-W (Aerie) | +27.5 | +3.9 | +23.2 |

At Field the keep term is −6.1 and −5.7 for the Hive (most of its −4 and −5.5 swing), and +4.5, −4.3 and +6.9 for
the Aerie.

**What happens on the keep:**
- The Aerie does land on it first. It holds 53-55% of the raised objective's round ends against Bushtails and
  Serpents, against 9-23% for the opponent.
- But the Aerie wins the centre about as well on tower and open boards. Its centre margin against the Bushtails
  is +2.24 objective-rounds on keep boards against +1.52 and +1.70 elsewhere. Against the Serpents the keep is
  worse for it than the tower: +0.97 against +1.20.
- The Hive's centre margin falls to −0.02 (B) and −0.68 (S) on keep boards, against +0.56 to +0.65 on non-keep
  fortified boards and about +0.9 on classic. On keep boards the Delvers and Deepguard count 0 OC at the centre.

**Verdict on H-deck:**
- Supported for the Hive: 25% (B-I) to 60% (S-I) of its Skirmish swing, and most of its Field swing.
- Weak for the Aerie: 0-22% of its swing.
- The Aerie's swing is a set-level effect: it appears just as strongly on fortified boards with no raised
  objective (B-W: tower 49 → 61, open 44 → 58; S-W: tower 38 → 62, open 24 → 53).

### 3.2 The works lengthen every ground path; fliers are exempt (an H-speed variant): the largest measured mechanism

Each zone's own rampart stands across its front.
- It adds about 12 points of detour to every ground unit's path to the objectives at Skirmish (1.03 → 1.15) and
  3-4 points at Field and Grand.
- Burrowers cannot pass under a fortification. Walkers climb it or go round. Fliers ignore it.

**Ground covered by the end of round 1** (distance from own edge, rich.md R3):
- Delvers lose 2.9 inches (12.6 → 9.7); Deepguard lose 1.7.
- Walkers lose 0.2-1.8 inches: Oak Guard −0.8, Scaleguard −1.1, Spinethrowers −1.4, Brute −1.8.
- Aerie fliers lose 0.0-0.8 inches (Kestrels, Stormtalons and Roc 0.0). The Gliders lose 0.0.

**Within-set slopes** (within.md): fitted on the fortified set alone, with the centre piece as dummies, score
against each board's walk detour (per 0.1).
- Hive: −0.29 ± 0.12 (B-I), −0.31 ± 0.12 (S-I).
- Aerie: +0.22 ± 0.12 (B-W), +0.00 ± 0.12 (S-W), +0.21 ± 0.12 (I-W).
- Control B-S: −0.13 ± 0.12.

Projected over the sets' detour difference (an extrapolation of about two within-set SDs):
- B-I −8.7 against −9.9 actual; S-I −9.4 against −10.6.
- B-W +6.9 against +16.0; I-W +6.1 against +27.5; S-W 0.

**Verdict:**
- Supported for the Hive: it can account for most of the Hive's non-keep swing.
- Supported for the Aerie against the Bushtails and the Hive: about a quarter to two-fifths of the swing.
- Not seen against the Serpents.
- Its share overlaps with the keep's and with the perch's (3.4), since all three are the fortified set.

### 3.3 Wipe-outs: about a quarter of the Aerie's swing

Counterfactual: classic's Aerie-wiped share is set to fortified's, and the moved battles are scored at classic's
non-wiped rate (wipe.md).

| Skirmish pair | swing | wipe channel |
|---|---|---|
| B-W | 16.0 | +3.9 (24%) |
| S-W | 24.5 | +7.3 (30%) |
| I-W | 27.5 | +5.4 (20%) |

At Field: +6.1, +1.3 and +0.6. The Hive is almost never wiped (channel ≤ 0.8).

**Total losses do not explain the wipes.** The Aerie loses the same number of models on both sets: 26 per battle
against the Bushtails on either set, and at round 5 it has 17% against 18% of its models alive. The difference is
who survives where:
- In battles where the Aerie falls to 8 or fewer models, 14-16% of those survivors stand on a deck on fortified.
- In those battles the Aerie is then wiped in 17.5% against 19.8% (B), 16.5% against 32.3% (S) and 10.9% against
  27.9% (I).
- It scores 50-55% in them on fortified against 24-37% on classic (rich.md R5).

### 3.4 The AI perches walking shooters and heroes on their own rampart (H-ai, a new mechanism)

`score.js` gives `shooter` and `artillery` roles +0.25 a inch of floor, and heroes value company. Share of round
ends spent on the unit's own rampart on fortified Skirmish (rich.md R2):

| unit | share on own rampart | its OC there |
|---|---|---|
| Hivemother | 58-70% | |
| Elder | 48-63% | |
| Hierophant | 54-62% | |
| Spitters | 44-46% | about 0.0 |
| Grenadiers | 40-46% | about 0.05 |
| Spinethrowers (Hive, OC 3) | 32-37% | 0.2-0.7 a unit-round (7.5-9.2 on the ground) |
| Nutkin | 15-21% | |
| Finches | 11-17% | |
| Longbills (Aerie, `line`) | 2.5-3.4% | |

**OC forgone a battle** (deck round ends off any objective × the unit type's ground OC rate):
- Hive 18-24 (Field 23-34).
- Bushtails 14-16.
- Serpents 10-14.
- Aerie 4.5-5.7.

**Who holds what** (home.md): on fortified the Aerie's own home flanks rise from 50-58% to 55-62%, carried by its
Longbills (home-flank OC 25 → 33 a battle). The opponents' home flanks fall:
- Bushtails 68 → 62%;
- Serpents 71 → 57%;
- Hive 62 → 54%.

**Within fortified** (perch.md), the round-1 share of each side's OC standing on its own rampart is nearly a
deployment fact.
- The Aerie's score rises with the opponent's share: +0.10 ± 0.06 (B), +0.15 ± 0.06 (S), +0.10 ± 0.06 (I) logits
  per 0.1.
- The Hive's falls with its own share against the Serpents (−0.17 ± 0.06), but not against the Bushtails
  (−0.01 ± 0.05).
- The Aerie's opponents put 0.22-0.30 of their OC there at round 1. The Aerie puts 0.11.
- That gap is worth roughly 5-10 points to the Aerie, overlapping 3.2.

**List variation** (lists.md): the number of walking shooter units an opponent fields does not visibly change how
much the fortified set helps the focus race (B-W: +16.6 at or below the median, +13.4 above). That test is
underpowered (perchers barely vary across `autoList` lists). It does not confirm the perch; it does not refute it.

**Verdict:**
- Supported, of moderate size, for the Aerie: its opponents abandon ground and it does not.
- Supported for the Hive against the Serpents. Unclear against the Bushtails, who perch nearly as much.
- The Glider Wing (the Bushtails' flier) perches like the Aerie's fliers (14-17% on decks, 10-14% on the keep)
  and holds as well per model. Flight alone does not swing the Bushtails because it is 4 models of 30.

### 3.5 H-sight: refuted as the cause of the swing

- Ranged losses (volley, blast and spell) are the same on both sets:
  - Aerie: 21.2 / 21.1 (B), 16.9 / 15.7 (S), 17.9 / 17.4 (I).
  - Hive: 16.5 / 16.4 (B), 13.2 / 12.3 (S).
- Losses before the first contact are 1.3-3.5 on both sets.
- The sets are equally open from inside the zones (50% against 52% at 18 inches).
- Within the fortified set, more open boards are somewhat worse for the Aerie against the Serpents
  (−0.26 ± 0.07 a 0.1) and the Hive (−0.18 ± 0.07), but not against the Bushtails (−0.07). This is a real local
  effect, but it cannot make a between-set swing that the openness data does not have.

### 3.6 H-speed: supported as the size driver, not the set driver

- At every size the Aerie leads by about one objective after round 1: Skirmish +0.4 to +0.6, Field +1.0, Grand
  +0.9 to +1.1 (attribution.md §F).
- The rounds compound it. The final VP margin is +0.25 to +2.0 at Skirmish, +2 to +7 at Field and +9 to +14 at
  Grand.
- At Grand the Aerie is never wiped and wins 93-100% on both sets. Its set swing there is −1 to +3.5.
- The fliers' pace is why the Aerie dominates the larger boards. The set swing on top of it is 3.1-3.4.

### 3.7 H-reach: minor

- Charges into a deck target are rare:
  - walkers: 0.1-0.8 a battle, with 70-85% making contact;
  - fliers: 0.6-1.1 a battle.
- Aerie models on decks lose 0.5-1.3 a battle to fights and 3-5 to shooting. Decks do not shelter fliers, which
  are never in cover.
- The Aerie's dives on perched rampart shooters kill about 1-1.5 models a battle.
- Its only measurable role is the deck-perched survivors in 3.3.

### 3.8 H-ai as the brief framed it: refuted or minor

- **Burrowers drawn to the keep's foot** (Q26's straight-line term): on keep boards Delvers and Deepguard spend
  only 6-9% of their round ends at the foot (Skirmish) and 1-2% at Field (rich.md R4).
- **Idle fliers:** under 1% of round ends, except the Roc at 8-10%, on both sets alike.
- **Idle walkers:** only the perchers (3.4) idle more on fortified. Spinethrowers go from 0.4% to 9-11%,
  Grenadiers from 1% to 13%.

### 3.9 Also seen (not in the brief's list)

- **H-ring, refuted.** The classic tower ring shuts walking squads out of the centre on 54% of boards. It does not
  help the Hive: its centre margin is +0.91 on tower boards against +0.97 on open ones. It mildly helps the Aerie:
  tower boards are its best classic boards (B 49 against 44-45; S 38 against 24-28).
- **Late-game fade on classic.** The Aerie's VP lead peaks at round 2-3 on classic and then falls: S-W +0.95 →
  −0.46, I-W +1.00 → −0.75. On fortified it keeps growing: +1.71 → +1.59, +1.70 → +1.76. This is consistent with
  the opponents' walkers being slower to come off the works and retake ground (3.2, 3.4).

## 4. Shares, summarised (Skirmish; the parts overlap and are not additive)

| swing | keep (H-deck) | works detour | perch (opponent on its rampart, own) | wipes | unexplained |
|---|---|---|---|---|---|
| Hive v B (−9.9; −2.2 on 3333) | 25% | most of the remaining 75% (projected −8.7) | about 0 (both perch) | 0 | small, but the swing itself is unstable across seeds |
| Hive v S (−10.6) | 60% | rest (projected −9.4) | own perch slope −0.17 / 0.1: a real share | 0 | small |
| Aerie v B (+16.0) | 22% | about 40% | about 40-60% | 24% | none left once overlap is allowed for: the parts over-explain it |
| Aerie v S (+24.5) | 0% | 0% | about 40% | 30% | about 30-40% |
| Aerie v I (+27.5) | 14% | about 22% | about 20%, plus the Hive's own perch | 20% | about 25-40% |

## 5. What I could not determine

- **The exact split between detour, perch and keep.** They co-occur on every fortified board: every fortified
  board has the ramparts, and only centre pieces vary. Board-to-board variation and the round-1 rampart share
  only give slopes, and the detour projection extrapolates about two SDs.
  - A clean split needs counterfactual runs on a scratch copy, which this task excludes. Examples: the AI's
    high-ground term off for every race (diagnostic only), or the zone ramparts removed.
- **A fifth or more of the Aerie's swing against the Serpents and the Hive is unexplained.** The likeliest place
  is the late game (3.9), but I could not pin a single cause on it.
- **Why the Hive v Bushtails swing is −9.9 on seed 2222 but −2.2 ± 3.4 on seed 3333.** Possibly sampling.
- **The OC "rounds" by unit type count only round ends.** They do not say how much a unit's presence denied the
  enemy.

## 6. Candidate levers (not built, not tested)

"In" means only a new race's own data or a flag only the new races carry is involved, so no existing battle can
change. "Out" means it would move older battles or change terrain or missions.

| # | lever | targets | in/out |
|---|---|---|---|
| A1 | A new Aerie-only flag (e.g. `soar`): its fliers may pass over decks but must end a move on a floor ≤ STEP | keep (3.1) and the deck-perched survivors behind the wipe channel (3.3) | in |
| A2 | The same flag makes a fortification's body something its fliers must go round, or pay the climb for, like a walker | the works-detour exemption (3.2) | in |
| A3 | The Longbills (the Aerie's one walker and main holder) keep their role; instead give the Finches the `line` role | neither 3.2 nor 3.4 directly; low value | in |
| H1 | The Spinethrowers' `ai` role `shooter` → `line` (the race's own data, as Q30 did for the Delvers): no high-ground pull on the Hive's OC-3 holder | the perch, 16-23 OC-rounds a battle forgone (3.4) | in |
| H2 | `burrow` passes under a zone **rampart's** body, surfacing where a walker can stand | the works detour that costs Delvers 2.9 inches in round 1 (3.2) | in |
| H3 | "Undermine": a `burrow` model within range at a raised objective's foot counts its OC there, ignoring HIGH | the keep term, 25-60% of the Hive's swing (3.1) | in |
| X1 | Change `score.js`'s high-ground term for every shooter | the perch, for every race | out (moves old battles) |
| X2 | Fewer, smaller or no zone ramparts | the works detour and the perch | out (terrain generation) |
| X3 | Any rule keyed on `fly` | | out (the Glider Wing flies) |

**Which to prototype first:**
- **Hive: H3, then H2.** H3 attacks the one mechanism measured directly, not extrapolated: the keep term, −2.5 to
  −6.3 points at Skirmish and most of the Field swing. H2 attacks the detour that the within-fortified slope
  says carries the rest. H1 is a cheap data-only third, since the perch is real but nearly cancels against the
  Bushtails.
- **Aerie: A2, then A1.** A2 removes the fliers' exemption from the works, the mechanism with the largest
  measured share against the Bushtails and the Hive. A1 removes the keep and the survivors' perches (the keep
  term plus part of the wipe channel). Neither touches H-speed. Even with both, expect the Aerie to stay strong
  at Field and Grand, where its lead comes from pace on every set.
- Before building either, I would spend one scratch-copy diagnostic run with the high-ground term and the zone
  ramparts switched off. That measures the perch and detour shares directly; it is not a fix.

## 7. Files (all under the lab directory)

| file | what it is |
|---|---|
| `probe.mjs` | the telemetry probe (`--rich` adds positions, decks and per-unit OC) |
| `probe-v1.mjs` | the version run1 used |
| `board.mjs` | board facts |
| `same.mjs` | sink neutrality check |
| `load.mjs` | shared loader and IRLS fit |
| `data/` | run1 battles: 44 cells, one JSON line a battle |
| `rich/` | run3 battles |
| `boards/` | board facts |
| `jobs1-3.txt`, `job.sh`, `rjob.sh`, `bjob.sh` | the runs |
| `logs/` | run logs |
| `tables.md` | (`agg.mjs`) the brief's items 1-5 per cell: outcomes, the objective story round by round, OC by unit type ground/raised, attrition and kills by cause and killer, board facts |
| `attribution.md` | (`attr.mjs`) centre-piece natural experiment, objective margins, decomposition, pooled fits, sight, speed, reach, unit behaviour |
| `rich.md` | (`rich.mjs`) replication, decks stood on, OC forgone, progress, keep foot, last survivors |
| `boards.md` | (`bstats.mjs`) per-set board statistics |
| `within.md` | (`within.mjs`) within-set slopes |
| `wipe.md` | (`wipe.mjs`) the wipe channel |
| `perch.md` | (`perch.mjs`) the round-1 rampart natural experiment |
| `home.md` | (`home.mjs`) home/away objectives |
| `lists.md` | (`lists.mjs`) the lists natural experiment |
| `notebook.md` | the lab notebook |
