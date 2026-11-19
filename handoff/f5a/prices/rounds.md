# F5a Balance and prices (Q31): the round table

Third Prices attempt. Copies under prices/q31/ (mk3.mjs applies stat and cost
lines to a copy of q31/base = HEAD 8229a1f + the Q30 insect.js). Logs under
prices/q31/logs/, the run summary prices/q31/summary.txt.

Binding shares: what binds 1,000 Random lists at Skirmish (army-sim's bindOf).
Scores: the first race's, N 1,500 per pair and set at a round's check.

## Probes (screens, not rounds)
Small --check runs on seed 2222 (a fit seed; never 4444, 1111's check or 5555)
over the Hive's three pairs or the Aerie's: --n 300 --fit-n 600. They pick
what a round tries; a round's fit and check judge it. Full lines in
q31/probes.txt.

Probe table base (base-specs): costs Hivemother 60, Deepguard 100, Spinethrowers 75, Delvers 90, Hoppers 55,
Boilback 45 (classic 500, points bind 857 of 1,000); Aerie at the second attempt's t3 costs (60/105/65/50/50/105,
classic 500, bind 679). Upwelling S5 AP2 (the Elder's Thornburst's) and the Delvers S4 (claws S4), pts 10, in every probe.
Scores are the first race's; "B-I 73/74" = Bushtails v Hivekin, classic set / fortified set.

| probe | change | B-I | S-I | I-B | B-B(irds) | S-B | Delvers' fit (B, S, I-B) |
|---|---|---|---|---|---|---|---|
| p1 | Delvers A3 Sv5 | 73.3/74.0 | 62.0/68.3 | 46.3/22.3 | | | 55, 54, 87 |
| p2 | Delvers A3 Sv4 | 68.8/76.2 | 54.7/67.0 | 48.7/27.2 | | | 66, 76, 83 |
| p3 | Delvers Sv5 W2 | 65.0/70.3 | 54.0/64.7 | 52.0/27.3 | | | 74, 62, 93 |
| p4 | Delvers A3 Sv4 W2 | 52.0/66.0 | 48.5/58.3 | 56.7/26.3 | | | 80, 92, 106 |
| p5 | p4 + Hoppers T4 Sv4 | 44.5/60.8 | 42.3/53.8 | 60.5/33.5 | | | 86, 86, 90 |
| a1 | p5 + Q31's Aerie stats: Stormtalons Sv5, Roc T5, Kestrels Sv6, Longbills T4 Sv3 | | | 52.8/31.3 | 48.8/22.3 | 60.0/37.7 | |
| a2 | p5 + the flip (Stormtalons, Finches walk) | | | 60.3/32.7 | 48.3/29.2 | 65.7/36.8 | |
| a3 | p5 + fliers M -2..-4 | | | 60.7/35.8 | 51.0/36.3 | 63.5/35.5 | |
| a4 | p5 + Roc OC1, Longbills OC1 | | | 61.7/36.5 | 48.2/33.0 | 64.0/39.8 | |
| a5 | p5 + Skyseer's Cry and Gale on 8 | | | 65.0/39.8 | 46.2/31.5 | 69.3/46.3 | |

Diagnosis from the probes and two per-set fits (fs-classic, fs-fort on p5, seed 2222, N 2,400 a pair):
- Blasts erase the Hive's squads: over 120 Bushtails-v-Hive battles (p2) 84% of the Delvers fielded died, 846 of
  1,302 to Thornburst, the Trebuchet and the Grenadiers; they slew 159. W2 is what lifts their fit (55 -> 80-106).
- Unit values barely move between sets; the swing is race-level (the intercept: Bushtails v Hive -110 classic,
  +111 fortified; the Hive v Aerie heroes' difference -25 and -134).
- The Aerie swings on its fragility: Serpents v Aerie on classic, 28 of 100 Aerie losses were wipes; on fortified
  15 (the walls cut the Spitters' and the Venom Engine's kills by about a fifth). Q31's suggested direction (fliers'
  T or Sv down) widened the swing (a1), the flip did not narrow it (a2), nor the fliers' M (a3), OC (a4) or spells (a5).
| a6 | p5 + durability: Finches T3, Kestrels Sv4, Stormtalons Sv3, Longbills Sv3 | | | 38.2/16.7 | 28.8/20.8 | 46.0/21.8 | |
| a7 | a6 + Stormtalons A2, Roc A3 | | | 47.5/24.2 | 36.8/21.0 | 52.2/29.3 | |
| h6 | p5 + Hoppers OC2, Spinethrowers OC3, Deepguard Sv4 | 44.7/57.5 | 48.0/51.7 | 60.3/31.5 | | | 97, 88, 83 |
| h7 | h6 - Delvers back to A2 Sv5, + Hoppers A3 | 50.8/61.5 | 50.8/62.7 | 59.8/31.2 | | | 53, 60, 67 |

## Round 1 (r1: h6's Hive, the Aerie's stats as designed)
Stats: Hivemother's Upwelling S4 AP1 -> S5 AP2; Deepguard Sv3 -> 4; Spinethrowers OC2 -> 3; Delvers S3 -> 4 (claws
S3 -> 4), A2 -> 3, Sv6 -> 4, W1 -> 2, pts 6 -> 10; Hoppers T3 -> 4, Sv5 -> 4, OC1 -> 2. Aerie unchanged.
Fit (r1-fit, seeds 1111-3333 pooled, --races insect,bird, at Hive 60/80/75/90/70/50, Aerie 60/105/65/45/45/110):
| unit | B pair | S pair | I-B | priced |
|---|---|---|---|---|
| Deepguard | 83 ± 4 | 77 ± 3 | 68 ± 3 | 80 |
| Spinethrowers | 74 ± 3 | 75 ± 3 | 85 ± 3 | 75 |
| Delvers | 82 ± 4 | 86 ± 3 | 91 ± 4 | 85 |
| Hoppers | 73 ± 3 | 72 ± 3 | 71 ± 3 | 70 |
| Boilback | 37 ± 4 | 49 ± 4 | 59 ± 4 | 45 |
| Stormtalons | 116 ± 3 | 94 ± 4 | 89 ± 4 | 110 |
| Longbills | 60 ± 2 | 65 ± 2 | 55 ± 3 | 65 |
| Finches | 43 ± 2 | 51 ± 2 | 44 ± 2 | 45 |
| Kestrels | 44 ± 2 | 51 ± 2 | 52 ± 3 | 50 |
| Roc | 101 ± 4 | 98 ± 4 | 121 ± 5 | 100 |
Race-level edge: Hive 0.3 ± 28.7 (B), 7.9 ± 25.2 (S): within 30 of 0. Aerie -42.1 ± 22.7 (B), -27.9 ± 24.1 (S).
Check on 4444 (r1-4444, EXIT 1) at Hive 60/80/75/85/70/45 (classic 490, points bind 820), Aerie 60/110/65/45/50/100
(495, bind 546):
| pair | classic | fortified |
|---|---|---|
| B-S | 48.7 ok | 51.6 ok |
| B-I | 40.6 FAIL | 52.5 ok |
| B-W | 43.4 FAIL | 31.2 FAIL |
| S-I | 41.9 FAIL | 52.0 ok |
| S-W | 58.7 FAIL | 36.5 FAIL |
| I-W | 65.0 FAIL | 36.6 FAIL |
New units outside their band: Deepguard in I-W (60 ± 6, band 16 of 80), Roc in I-W (129 ± 8, band 20 of 100).
(Older units outside theirs in the new pairs, not tunable here: Grenadiers B-I and B-W, Oak Guard and Trebuchet B-W,
Venom Engine S-I and S-W, Spitters S-W; the classic pair's own Brute and Grenadiers.)
The Hive now swings 10-12 points between the sets (strong on classic), the Aerie 12 (Bushtails) and 22 (Serpents).

Lever 2, the flip (Stormtalons and Finches walk), tried twice before any round took it: a2 (N 300, the t3 costs)
B-B 48.3/29.2, S-B 65.7/36.8, I-B 60.3/32.7; a8 (N 800, r1's table) B-B 46.3/26.6, S-B 61.5/34.5, I-B 63.6/34.4.
Beside r1's own 43.4/31.2, 58.7/36.5 and 65.0/36.6 on 4444 the flip widens the swing (B-B 12 -> 20, S-B 22 -> 27)
and does not narrow it on either seed: it is not taken (flyFlipped []).
Two Hive probes at N 800: h8 (r1 + the burrowers M4) B-I 47.9/59.6, S-I 46.4/55.6; h9 (h8 + Hoppers A3,
Spinethrowers 18") 40.4/53.6, 39.3/52.8: the Hive's swing (10-13) does not answer the burrowers' pace either.

## Round 2 (r2: r1's stats, repriced from r1's fit and its 4444 per-unit misses)
Prices: Hive 60/75/75/90/70/45 (classic 490; points bind 1,000: the Delvers at 90, not the fit's 85, which binds 820);
Aerie Skyseer 65, Stormtalons 110, Longbills 60, Finches 45, Kestrels 50, Roc 110 (classic 500; bind 497).
No new fit (the stats are r1's). Check on 4444 (r2-4444, EXIT 1):
| pair | classic | fortified |
|---|---|---|
| B-S | 48.7 ok | 51.6 ok |
| B-I | 46.1 ok | 58.0 FAIL |
| B-W | 42.0 FAIL | 30.0 FAIL |
| S-I | 46.1 ok | 56.1 FAIL |
| S-W | 57.1 FAIL | 34.6 FAIL |
| I-W | 58.9 FAIL | 32.6 FAIL |
New units: every one in its band but the Boilback in I-W (69 ± 7, band 14 of 45). Race edges: Hive -24.3 ± 47.1 (B),
-22.9 ± 44.3 (S); Aerie 1.3 ± 42.4 (B), -16.7 ± 42.6 (S); I-W heroes' difference -53.5 ± 44.9.
Fit-list scores: B-I 50.3, S-I 48.0, B-W 35.3, S-W 45.4, I-W 46.7.
The Delvers' price shapes the lists: 85 -> 90 (and the Deepguard 80 -> 75) moved the Hive's scores about 5 points
down on both sets; the swing stayed 12 (B) and 10 (S).

## Round 3 (r3: r1's Hive, the Stormtalons A3 -> 2)
Fit (r3-fit, seeds 1111-3333, at Hive 60/75/75/90/65/55, Aerie 65/100/65/45/45/115):
| unit | B pair | S pair | I-W | priced (r3c) |
|---|---|---|---|---|
| Deepguard | 81 ± 4 | 74 ± 3 | 64 ± 3 | 75 |
| Spinethrowers | 73 ± 3 | 73 ± 3 | 84 ± 3 | 75 |
| Delvers | 82 ± 4 | 86 ± 4 | 89 ± 4 | 85 (binds 888) |
| Hoppers | 70 ± 3 | 73 ± 3 | 72 ± 3 | 70 |
| Boilback | 39 ± 4 | 47 ± 4 | 59 ± 4 | 50 (45 misses the I-W check) |
| Stormtalons | 94 ± 4 | 80 ± 4 | 75 ± 4 | 85 |
| Longbills | 65 ± 3 | 66 ± 3 | 59 ± 3 | 65 |
| Finches | 44 ± 2 | 50 ± 2 | 47 ± 2 | 45 |
| Kestrels | 42 ± 2 | 52 ± 2 | 51 ± 3 | 45 |
| Roc | 97 ± 4 | 103 ± 4 | 128 ± 5 | 110 |
Race-level edge: Hive -2.2 ± 28.6 (B), -2.9 ± 25.9 (S); Aerie -60.7 ± 25.9 (B), -24.8 ± 24.5 (S). Fit-list scores
B-I 53.1, S-I 49.3, B-W 43.6 (r1 37.3), S-W 51.2 (44.8), I-W 49.2 (41.5).
Check on 4444 (r3-4444, EXIT 1) at Hive 60/75/75/85/70/50 (490, bind 888), Aerie 80/85/65/45/45/110 (495, bind 656):
| pair | classic | fortified |
|---|---|---|
| B-S | 48.7 ok | 51.6 ok |
| B-I | 41.2 FAIL | 52.5 ok |
| B-W | 50.5 ok | 32.2 FAIL |
| S-I | 41.9 FAIL | 52.7 ok |
| S-W | 63.2 FAIL | 40.8 FAIL |
| I-W | 65.6 FAIL | 39.1 FAIL |
New units out of band: Finches S-W (54 ± 4, band 9 of 45), Deepguard I-W (59 ± 6, band 15 of 75), Roc I-W (139 ± 8,
band 22 of 110).
Three rounds, one result: the Hive swings 11 (strong on classic), the Aerie 18 against the Bushtails and 22 against the
Serpents (strong on fortified); I-W 26. The Delvers' price picks which of the Hive's sets passes (85: fortified; 90:
classic). No round reached a table both sets take for any pair with a new race.

## The final table (fin), judged on 1111 and 5555
Stats r3's. Prices from r3's fit and r2's and r3's 4444 checks: Hive 60/75/75/90/65/45 (classic 485; bind 888),
Aerie Skyseer 70, Stormtalons 85, Longbills 65, Finches 50, Kestrels 45, Roc 120 (classic 500; bind 776).
1111 (fin-1111, EXIT 1):
| pair | classic | fortified |
|---|---|---|
| B-S | 48.6 ok | 50.7 ok |
| B-I | 42.1 FAIL | 53.5 ok |
| B-W | 51.8 ok | 35.3 FAIL |
| S-I | 41.6 FAIL | 51.6 ok |
| S-W | 69.7 FAIL | 42.8 FAIL |
| I-W | 69.4 FAIL | 40.8 FAIL |
New units out of band: Kestrels S-W (55 ± 4, band 9 of 45), Hoppers I-W (83 ± 6, band 13 of 65), Finches I-W
(35 ± 4, band 10 of 50). Every new unit in band against both older races. Race edges: Hive 5.7 ± 43.0 (B), -12.5 ±
45.1 (S); Aerie -38.1 ± 46.2 (B), -1.8 ± 41.0 (S).
5555 (fin-5555, EXIT 1):
| pair | classic | fortified |
|---|---|---|
| B-S | 49.1 ok | 50.1 ok |
| B-I | 40.9 FAIL | 52.0 ok |
| B-W | 52.0 ok | 36.7 FAIL |
| S-I | 41.0 FAIL | 51.7 ok |
| S-W | 66.8 FAIL | 43.6 FAIL |
| I-W | 69.1 FAIL | 42.4 FAIL |
New units out of band: Deepguard B-I (94 ± 7, band 15 of 75), Hoppers B-I (78 ± 6, band 13 of 65). I-W every unit in
band. Race edges: Hive 96.2 ± 52.4 (B; noisy), 1.8 ± 45.5 (S); Aerie -15.6 ± 41.1 (B), -43.0 ± 43.1 (S); I-W -4.1 ± 44.0.

## Field at cost (fin-f4444, EXIT 1, 2,664 s)
| pair | open | fortified |
|---|---|---|
| B-S | 54.5 ok | 54.2 ok |
| B-I | 52.8 ok | 63.7 FAIL |
| B-W | 32.3 FAIL | 20.3 FAIL |
| S-I | 46.2 ok | 46.8 ok |
| S-W | 40.7 FAIL | 24.9 FAIL |
| I-W | 47.8 ok | 20.5 FAIL |
Binding at Field: Hive 916, Aerie 934 of 1,000.

## The Field fit and a Field entry tried (step 7)
fin-ffit (--fit --mission field --races insect,bird --seed 1111,2222,3333, N 2,700 a pair, at cost):
| unit | B pair | S pair | I-W | entry tried |
|---|---|---|---|---|
| Hivemother | 111 ± 15 | 82 ± 15 | 67 ± 15 | 95 |
| Deepguard | 112 ± 7 | 111 ± 8 | 62 ± 7 | 110 |
| Spinethrowers | 54 ± 6 | 72 ± 6 | 63 ± 6 | 65 |
| Delvers | 100 ± 7 | 116 ± 7 | 106 ± 7 | 105 (110, cut: the preset 1,010) |
| Hoppers | 54 ± 6 | 62 ± 7 | 67 ± 6 | 55 |
| Boilback | 3 ± 9 | 1 ± 9 | 33 ± 8 | 5 |
| Skyseer | 82 ± 12 | 87 ± 14 | 83 ± 14 | 75 |
| Stormtalons | 103 ± 6 | 79 ± 7 | 90 ± 7 | 85 |
| Longbills | 59 ± 5 | 69 ± 5 | 44 ± 6 | 60 |
| Finches | 37 ± 4 | 59 ± 5 | 37 ± 5 | 40 |
| Kestrels | 56 ± 5 | 69 ± 6 | 58 ± 6 | 55 |
| Roc | 149 ± 8 | 117 ± 9 | 168 ± 10 | 125 |
(The Aerie's fitted preset sums to 1,100: the entry scales it by 10/11 to the preset's 1,000.)
Fit-list scores at cost: B-I 57.7, B-W 30.0, S-I 48.7, S-W 36.5, I-W 36.4. Race edges: B-I 108 ± 118, S-I 249 ± 129,
B-W 28 ± 102, S-W 242 ± 119 (the heroes fitted, so noisy).
Judged on 4444 with the entry (finf-f4444, stopped after six of twelve score gates): B-I open 65.1 (52.8 at cost),
fortified 69.7 (63.7), B-W open 30.9 (32.3), fortified 17.0 (20.3), S-I open 55.6 (46.2): every one further from even
than at cost. Not taken: Field plays the new races at cost, Grand and Powder with it (no copy to make).

## Field at cost, the judgment (step 6)
| pair | 4444 open / fortified | 1111 open / fortified |
|---|---|---|
| B-S | 54.5 ok / 54.2 ok | 54.4 ok / 54.4 ok |
| B-I | 52.8 ok / 63.7 FAIL | 52.1 ok / 62.4 FAIL |
| B-W | 32.3 FAIL / 20.3 FAIL | 30.3 FAIL / 22.2 FAIL |
| S-I | 46.2 ok / 46.8 ok | 42.4 FAIL / 48.4 ok |
| S-W | 40.7 FAIL / 24.9 FAIL | 39.9 FAIL / 26.8 FAIL |
| I-W | 47.8 ok / 20.5 FAIL | 52.6 ok / 20.8 FAIL |
New units outside their Field band (N 900): 4444 the Deepguard (B 111 ± 11, I-W 45 ± 11), Spinethrowers (B 40 ± 10,
I-W 49 ± 10), Boilback (B 14 ± 14, S -17 ± 16), Hivemother (S 137 ± 26, I-W 127 ± 25), Skyseer (B 119 ± 22),
Kestrels (S 82 ± 12), Stormtalons (I-W 61 ± 12), Roc (I-W 172 ± 17); 1111 the Deepguard (B 110 ± 13, S 134 ± 17),
Delvers (S 124 ± 16), Boilback (B -8 ± 16, S -22 ± 19), Finches (B 34 ± 7), Kestrels (B 61 ± 8, S 86 ± 10),
Longbills (I-W 40 ± 12), Roc (I-W 180 ± 23).

## Reported (fin-kgp1111, seed 1111, at cost; EXIT 1: the Powder B-W fit threw)
Keg mission (judged at Skirmish size, reported beside the classic pair's known miss, not tuned):
B-S 35.1 (known), B-I 26.9, B-W 46.1 ok, S-I 35.8, S-W 73.2, I-W 82.2 (the Hive's burrowers pass under the kegs, Q3).
Grand (open / fortified): B-S 48.5/52.8, B-I 36.7/45.0, B-W 1.3/1.8, S-I 22.4/33.4, S-W 2.9/3.7, I-W 6.5/2.6.
Powder: B-S 57.0, B-I 58.9, B-W 0.1, S-I 55.0, S-W 0.0, I-W 0.0.
The Powder B-W fit threw: "the fit's information matrix is singular at Windfolk Roc: a column the lists never vary"
(the Bushtails won 0.7% of the fit's 600 battles): army-sim's full --check (the Sweep's) exits 1 on it.

## Committed
c95203b "tails-and-scales F5a: balance and prices" on wt/f5a, pushed. RULES_ID 20w3b8h0pjh. data-check, flag-lint,
property --only races and --only spell pass; parity 97/97 and --pin 97/97. Four of the eight rounds used (r1-r3 and
the final table); no further round: the swings are race-level and every lever Q31 names was tried.
