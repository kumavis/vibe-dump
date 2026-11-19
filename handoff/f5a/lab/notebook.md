# F5a terrain-swing diagnosis: lab notebook

Lab: /tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/lab
Code measured: /home/user/vibe-dump-wt/f5a/packages/tails-and-scales (wt/f5a at e5fdc90; read-only; its one
uncommitted edit is sim/property.mjs, which no battle reads).

## Tools
- probe.mjs: plays army-sim's score-gate battles (same seed/stream draw, autoList at the mission limit, seats
  swapped on odd i, all-AI) with an `out` sink and an onTrace hook; one JSON line per battle in data/.
  Telemetry: objective facts (floor, raised, stair/ladder), openness (60 random ground lines of 12/18/24" from a
  zone front toward the enemy, Terrain.los), per-round-end objective owners + OC by unit type (and models within
  planar range but out of HIGH), per-unit snapshot (alive, on deck, engaged, dist to nearest/raised objective,
  path length moved, targets faced, charges), every model lost (victim, killer type by `by` id, cause from the
  log line that reports it: volley/blast/spell/fight/morale/other), charges (mode, target on deck?).
- same.mjs: a non-null `out` + onTrace leave the battle identical (18/18 final trace lines equal).
- job.sh / jobs1.txt: the cells, run 3 at a time with xargs -P 3.
- Seed 2222 (a fit seed) for every battle stream.

## Timings
Skirmish ~70-90 ms a battle, Field ~350 ms, Grand ~1 s (one process).

## Runs
- run1 (jobs1.txt): Skirmish 6 pairs x 2 sets x N 1000; Field 5 pairs x 2 sets x 300; Grand 5 pairs x 2 sets x 100. Output data/*.jsonl, log logs/run1.log, logs/err.log.
- Early read of run1 (Skirmish, partial): the probe's shares match the reported gate (B-I 42.6 / 52.5, B-W 52.9 / 35.7,
  B-S 48.2 / 49.0). Fortified Skirmish boards: exactly 0 or 1 raised objective (the centre keep, ~50% of boards), stairs.
  The fortified set is MORE open at ground level than classic (clear 18" lines from the zone front 64% v 48%).
- Found in the recipes: the classic set's centre is a ruined tower ring (soft columns, R 3.4", doors ~1.25") on ~55% of
  boards (rockbox 25%, open 20%); fortified: keep 50%, tower 30%, open 20%. Soft columns: a burrower tunnels in, a
  squad walker can't enter, a flier lands inside. => new hypothesis H-ring.
- board.mjs (boards/, jobs2.txt, bjob.sh): per battle board, centre kind, openness from inside the zones, travel
  detour walk/burrow from each zone to each objective, terrain shares. Runs after run1.
- run1 done (07:14Z): 44 cells, no errors. tables.md = agg.mjs. run2 (board facts) started.
- run2 done (07:17Z): 32 board files, no errors.
- attr.mjs -> attribution.md (first pass). Findings so far:
  * Centre piece (natural experiment): the Aerie's fortified gain holds on boards WITHOUT the keep (tower 49->61,
    open 44->58 B-W; S-W tower 38->62, open 24->53); the keep term is small (B-W +3.6, S-W -0.8, I-W +3.9 of 16-28).
    Hive: keep explains ~1/4 (B-I) to ~3/5 (S-I) of its drop; the rest is a same-centre set effect.
  * Ranged losses (all, and before contact) are the same on both sets for the Aerie and the Hive: H-sight (works
    shelter a fragile army) refuted as stated. Fortified ground sight is MORE open than classic's.
  * The Aerie is wiped far more on classic (B 17.6/10.7, S 29.8/14.3, I 24.5/12.0 %), and its VP lead fades in
    rounds 4-5 on classic but keeps growing on fortified.
  * Section H: on fortified, walkers of role shooter/hero perch on decks (Hivemother 74-77% of round ends on a deck,
    Elder 54-62, Grenadiers 45, Spinethrowers 38-42, Nutkin 19-21); the Spinethrowers' (Hive OC3) OC per
    model-round falls 1.52 -> 1.01-1.14 and their idle share 0.4 -> 9-11%. AI: score.js +0.25/inch floor for
    shooter/artillery, levelDist for walkers, straight line for burrowers/fliers.
- probe.mjs gains --rich (unit x,z, deck recipe stood on, OC counted per unit; seat edges). probe-v1.mjs = the
  version run1 used. run3 (jobs3.txt, rich/, seed 3333 - a second fit seed, a replication): Skirmish 6 pairs x 2
  sets x 400; Field B-W, S-I, I-W x 2 sets x 150.
- Fixed attr.mjs SC decomposition (keep term + non-keep gap; same-piece + mix) and the keep-foot radius (5.5").
- rich.mjs -> rich.md (run3): replication (B-I swing only -2.2 on 3333), decks stood on (own rampart perch of
  walking shooters/heroes; OC forgone: Hive 18-24, B 14-16, S 10-14, Aerie 4.5-5.7 a battle), round-1 progress
  (Delvers -2.9", walkers -0.2..-1.8, fliers ~0), keep foot (burrowers 6-9%), last survivors (14-16% on decks).
- bstats.mjs -> boards.md: walk detour to flanks 1.03 classic v 1.15 fortified (ramparts); tower ring blocks walking
  squads from the centre on 54% of classic boards; inside-zone openness equal across sets.
- within.mjs -> within.md: within-fortified detour slope Hive -0.29/-0.31 +-0.12, Aerie B/I +0.22/+0.21, S 0.
- wipe.mjs -> wipe.md: wipe channel 3.9/7.3/5.4 of the Aerie's 16/24.5/27.5.
- perch.mjs -> perch.md: Aerie score rises with the opponent's round-1 rampart OC share (+0.10..0.15 logits/0.1).
- home.mjs -> home.md; lists.mjs -> lists.md (lists experiment underpowered, inconclusive).
- diagnosis.md written (the report). Compute: 21,700 battles, 38 CPU-min in createMatch, ~45 process-min total
  for battles + ~15 for boards. No further runs.

# Phase 2 (counterfactuals and prototypes; scratch copy only)
- p2/orig = copy of the package's core/ and data/ at e5fdc90 (+ package.json); p2/pkg = the same with switches,
  read from the environment (TS_X=cf1,h2,...) through p2/pkg/core/x.js. p2/patches-all.diff = diff -ru orig pkg.
  army-sim is run from the work tree with --dir p2/pkg (it loads core/data from DIR; workers inherit TS_X).
- p2/ident.mjs: with no switch pkg == orig, 15/15 battles identical (final trace lines).
- H3 as specified (burrower model on the ground within 3" + base of the objective) is INERT on the keep: 0 OC
  counted in 100 S-I fortified battles, score identical to baseline (the keep is 6x6", its foot is >= 3" from the
  objective, and the cliff field keeps squads off the wall). Implemented h3b: range measured from the deck's edge
  (3.26 burrower OC-rounds a battle). Combos use h3b.
- probe.mjs now counts OC with the scratch copy's h3/h3b waiver when --dir has core/x.js (identical objs on the
  work tree, checked against run1).
- run p2a (jobs-p2a.txt, p2/pjob.sh, 2 at a time, load-gated at 7): seed 2222 start 0, so every cell is PAIRED with
  run1's first N battles (same boards, lists, dice). Output p2/data/<variant>-<mission>-<set>-<pair>-0-2222.jsonl.
- run p2a done (105 cells). p2/p2.mjs -> p2/p2tables.md. Headlines: CF1 (high-ground term off) moves perch share only
  ~4 points and Skirmish fortified scores by <= 3.8 (B-W); CF2 (no Aerie landing on decks) halves the Aerie's r1 lead,
  zeroes the keep term, swing B-W 13.5 -> 6.5, S-W unchanged, I-W 20.8 -> 24.5 (noise ~3.5). h3b closes the Hive's
  keep term (+6-7 Hive on fortified, paired SE 1.5). h1 moves classic too (Hive weaker there). h1+h2+h3b overshoots
  (Hive swing +10). A3/A3b make the Aerie much weaker on both sets, halve its r1 lead, leave the swing (14-22).
- added switch w1 (canopy cover: the Aerie's fliers use inCover like walkers), my own lever: classic has more
  cover terrain, so a cover rule for the birds should lift them on classic more than fortified.
- run p2b (jobs-p2b.txt): h1+h3b; w1; a4a/a4b on base and on a3 at Field.
- w1 refuted (no change: +-2). A4 at Field: x1.25 moves the Aerie's mean ~27-30 points (68% -> 40%), x1.5 ~50: priceable, centre near x1.15 (a4c, interpolated); swings stay (I-W 28). A3+A4 overshoots. Hive best = h3b alone (swing B-I -0.2, S-I -1.3 at N300; h1+h3b reverses to +3.5). D: fit started (TS_X=h3b,a4c, army-sim --fit classic --races insect,bird --seed 2222,3333 --n 500 --jobs 2 --dir p2/pkg), log p2/fit-d.log.
- fit-d (179 s) -> p2/fit-d.log. Priced (switch pd, the mean of each unit's three pair fits, to 5): Hive Deepguard 75,
  Spinethrowers 75->70, Delvers 90->95, Hoppers 65->75, Boilback 45->50 (Hivemother 60; classic list 495); Aerie
  Stormtalons 85, Longbills 65, Finches 50->45, Kestrels 45->50, Roc 120->115 (Skyseer 70; list 495).
  p2/bind.mjs: points bind Hive 1000 / Aerie 674 of 1,000 at Skirmish (today 888 / 776); Field 970 / 970.
- run p2d (jobs-p2d.txt): the D set (h3b, a4c, pd) and the current table (base), seed 6666, Skirmish N 600,
  Field N 150, every pair. Output p2/data/*-6666.jsonl.
- run p2d done. p2/p2d.mjs -> p2/p2d.md. D set (h3b, a4c, pd) on 6666: Hive B-I Skirmish EVEN (48.6/49.9), S-I
  46.8/43.3; Aerie pairs fail both targets (swings 15-21 Skirmish, 15-30 Field; Field means 43-47 with a4c).
  Passing cells of 12: today EVEN 2 / HOME 5, D EVEN 3 / HOME 4.
- Standalone builder patches in p2/patches/ (h3b, h2, h1, a4c, pd; all-switches). phase2.md written.
- Phase-2 compute: 46,700 probe battles, 101 CPU-min in createMatch, + fit 6,000 battles.

# Phase 3 (the Aerie's swing: cause, dial, full set on 7777)
- p2/pkg-p2-snapshot = the scratch copy as phase 2 left it. New switches in p2/pkg (see core/x.js): cf3 (zone ramparts
  dead after layout: terrain.js generate), cf4 (Aerie fliers' reach = height Dijkstra, no scenery: nav.reach
  'flywall'), cf5 (deploy.js fits: no unit on a raised floor), cf6 (walk/wreck reach and pull skip floor/ledge
  tests; levelDist = straight line), a6a/a6b/a6c (wall toll 2/4/6" per raised run a straight flight passes over:
  nav.crossings), a5/a5b (Stormtalons, + Skyseer, walk; swoop off for the Stormtalons). ident 15/15 with no switch.
- step 1 (no new battles): p3/step1.mjs -> p3/step1.md.
- run p3a (jobs-p3a.txt): CF3-CF6 on the three Aerie pairs, fortified, N 300 paired (seed 2222); CF5, CF3 and CF6 on B-S too.
- run p3a done. Aerie fortified first-race Δ (B-W / S-W / I-W): CF3 +16.3 / +32.2 / +13.5 (B-S -12.7);
  CF4 +5.2 / +12.2 / +1.2; CF5 -0.8 / -2.2 / -6.8 (B-S -5.3); CF6 +16.5 / +34.0 / +3.8 (B-S -8.5). The cause is
  the ramparts holding up the ground armies (CF3, CF6), which the fliers ignore; CF4 (fliers blocked) gets about a
  third of it. Deployment (CF5) is not it. The ramparts also move the older pair (B-S).
- run p3b (jobs-p3b.txt): A6 wall toll 2/4/6 (fortified only; flat boards untouched by construction), A5/A5b both sets.
- run p3b done (p3/p3tables.md via p2/p2.mjs with a variant filter; the full run OOMed). A6 toll 2/4/6: Aerie
  fortified first-race delta mean +2.9 / -0.6 / +2.0, no dose response: the fliers rarely pass over a body.
  A5 / A5b (walkers): swing 13.5/24.5/20.8 -> 18.8/25.7/26.3 and 12.8/26.0/24.8: no narrowing.
  => no Aerie-side wall dial works; the swing is the ramparts delaying the ground armies (CF3/CF6), which also
  move B-S by 9-13. Step 4 run as D again with no Aerie dial: H3b + pd (phase-2 Skirmish fit, valid: no Skirmish
  dial) + Field entries re-fitted for both new races.
- Field fit started: army-sim --fit --mission field --races insect,bird --seed 2222,3333 --n 300 --jobs 2, TS_X=h3b,pd,
  log p2/fit-field.log.
- Field fit (p2/fit-field.log, 409 s): noisy (SE 10-30); consistent signal: Boilback worthless at Field (3/-5/30),
  Spinethrowers and Hoppers overpriced v the Bushtails. Switches: a4d (Aerie fliers x1.2 of pd at Field: 85/100/55/60/140,
  re-fitted from the phase-2 response, 50% at ~x1.18), hf2 (Hive Field entry Boilback 20, Hoppers 70; hf with
  Spinethrowers 60 too unbinds the points: 153 of 1,000), gx (Grand: Aerie x1.4 of pd, Hive hf2).
  NB the Aerie's Field preset '224222' costs 1110 at a4c and 1140 at a4d (over 1,000): a preset change is needed
  ('213222' = 975). Phase 2's a4c had the same problem (not flagged there).
- run p3c (jobs-p3c.txt): step 4 on seed 7777: the set h3b+pd+a4d+hf2 and today's table, Skirmish N 600, Field N 150,
  every pair; Grand N 50 (B-W, S-W, I-W, S-I, both sets) with gx.
- run p3c done: p3/p3d.mjs -> p3/p3d.md. On 7777: Hive Skirmish swings -3.1 / -2.0 (today +6.0 / +5.9), S-I EVEN+HOME,
  B-I HOME; Aerie swings 17-24 at Skirmish (S-W HOME only), Field x1.2 overshoots v B and I; hf2 overshoots v S at
  Field. Grand (gx) Aerie 78-89% (was 96-100). Passing of 12: today EVEN 1 / HOME 3; set EVEN 2 / HOME 6.
- phase3.md written; p2/patches/p3-field-prices.diff (Field entries + Aerie Field preset '213222'); all-switches.diff
  refreshed (now includes the phase-3 switches). Phase-3 compute: 29,600 probe battles, 62 CPU-min, + Field fit 409 s.

# Phase 4 (price by terrain set and size)
- p2/pkg-p3-snapshot = the copy as phase 3 left it. Mechanism (switch sp): core/army.js listFor(rules, set) lays
  list.setPrices[set] over list.prices; armyOf and unitPrice use it (setup.terrain, filled before armyOf). Data
  (switch spd): data/mission.js reads a JSON (env TS_SP) {mission:{set:{race:{unit:cost}}}} into each list's
  setPrices; LIST_KEYS gains 'setPrices'. probe.mjs builds lists with A.listFor(list, set) when the copy has it.
  ident: no switch / sp / sp+spd with an empty table: 15/15 identical.
- p4/table.mjs (factors -> prices: Aerie fliers x fW, Hive all units x fI, base = pd costs, Boilback 20 / Hoppers 70 at
  Field and Grand), p4/solve.mjs (one factor per race per set per size from first-race scores, logit slope prior
  kW 6 / kI 8 or fitted from >= 2 factor points per cell; 30% cap between a size's two sets), p4/job.sh.
- iteration 0 = phase 3's 7777 judgment (p4/obs0.json) -> p4/factors1.json -> p4/sp1.json.
  Presets break at these prices (Aerie classic list 530 on fortified, Field 1050-1150, Grand 2370-2610): handled at the end.
- run it1 (p4/jobs-it1.txt): seeds 2222 and 3333, Skirmish 150+150, Field 75+75, Grand 75+75 per cell, the 5 new pairs.
- CHECKPOINT (coordinator: moving to a faster machine). run it1 killed at 12 of 60 cells (all seed 2222: B-I and
  B-W at Skirmish, Field and Grand, both sets); the one partial cell (S-I classic fortified 2222) deleted. No process
  of mine left. Done cells (first race): Skirm B-W 48.3 / 47.0, B-I 46.0 / 52.0; Field B-W 39.3 / 48.0 (open /
  fort), B-I 62.7 / 49.3; Grand B-W 48.0 / 34.0, B-I 38.7 / 42.0 (N 150, 75 at Field/Grand). Too few to solve with.
  p2/patches/all-switches.diff refreshed (includes sp/spd). STATE.md written.
