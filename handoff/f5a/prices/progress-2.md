# Prices phase, second attempt: progress (for a restart)
- Q30 applied in the worktree: data/races/insect.js delver ai 'melee' + comment; DESIGN Q30 edits (code block, units row, Q25, Q30 entry). Uncommitted.
- base/ = git archive 21052ce + Q30 insect.js. mk2.sh builds copies from base/.
- fit2 (logs/fit2.log): the Hive's 3 pairs refitted with Q30 (seeds 1111-3333). Aerie-only pairs from fit1 stand.
- t2 table (round 1, the letter): hivemother 50, deepguard 100, spinethrower 85, delver 50, hopper 60, boilback 50 (classic 480);
  skyseer 60, stormtalon 105, longbill 65, finch 50, kestrel 50, roc 105 (classic 500).
- c2-4444 EXIT 1, c2-1111 EXIT 1: every new pair's score gate misses (Hive ~70% against, Aerie 32-39% on fortified, Serpents 60-61% v Aerie classic).
  Per-unit misses among new units: Deepguard and Boilback in I-B on both seeds; Hoppers S-I 4444; Boilback C-I 1111.
- Next: round 2 fit pooled 1111-4444 at t2 (--races insect,bird), judge on 5555; then Field 4444/1111; keg, grand, powder on 1111; diagnostics (Hive handicap trial on 7777; Aerie per-set fits).
- fit3 (round 2: 1111-4444 pooled at t2, --races insect,bird) -> t3: as t2 but hivemother 45, boilback 55 (spine 85 kept: 87.5 a tie). Hive classic 480, Aerie 500.
- c3-5555 (t3, the unseen seed) EXIT 1: same score misses (Hive 68.8-75.4% against; Aerie fortified 30.8/40.1; Serpents 61.4 v Aerie classic; I v B 36.5/17.3).
  per-unit: S-I ok, C-I ok; Finch S-B 39±4 vs 50 FAIL; I-B Deepguard 76±7, Boilback 80±7 FAIL. No round 3: the misses are race-level.
- Running: f3-4444 (Field check on t3). Then f3-1111, Field fit if needed, keg/grand/powder 1111, t3 classic 4444/1111, a handicap trial on 7777 (informational).
- f3-4444, f3-1111 (Field at cost, t3) EXIT 1: Hive 73-81% against, Aerie 16-36% for its opponents, I v B 2-10%. Classic pair at Field: 54.4-54.5 (known Brute/Scaleguard misses).
- Running ff3: --fit --mission field --races insect,bird --seed 1111,2222,3333 on t3 (step 7).
- ff3 done. t4 = t3 + Field prices (and Grand, Powder copies): insect { hivemother 85, deepguard 135, spinethrower 65, delver 50, hopper 45, boilback 20 } (preset 930);
  bird { skyseer 85, stormtalon 100, longbill 50, finch 40, kestrel 55, roc 120 } (the fit's 1,120 cut 5 at a time, furthest over first, to the preset's 1,000).
- Running f4-4444 (Field check on t4); then f4-1111; keg, grand, powder on 1111 (t4); t3 classic 4444/1111 if time.
