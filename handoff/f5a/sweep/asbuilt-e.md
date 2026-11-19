- **The corpus** (cb9f1ab; the PIN from 494ce08 to c95203b, the prices commit, the last code commit before the recording; Q17). Run against the moved PIN before anything was added, `parity --pin` held 97 of 97. The 14 battles written by `sim/corpus-add.mjs` on the PIN, each admitted twice more in Node and once in Chromium, then `parity --record --only races` (Node v22.22.0) rewrote the same hashes byte for byte; `pairs.json` untouched, the corpus 97 → 111. The 12 AI pairs are each candidate 1 (board 86733, dice 422652), with no lists, so each seat plays its mission's preset (classic: the Hive '112111' 485, the Aerie '112111' 500, the Bushtails 485, the Coil 495); Skirmish battles are 5 rounds, Field 6:

  | Battle | Seating (seat 0 v 1) | Board | Rounds, result | What it shows |
  |---|---|---|---|---|
  | `watch-insect-squirrel-1` | Hive v Bushtails | classic | 5, 6-7 | 2 of 7 walks tunnel; the swarm never fights |
  | `watch-squirrel-insect-1` | Bushtails v Hive | classic | 5, 8-7 | 3 of 6 tunnel; 3 re-rolls (6 dice) in 5 swarm fights |
  | `watch-insect-serpent-1` | Hive v Coil | classic | 5, 9-5 | 0 of 5 tunnel; the swarm never fights |
  | `watch-serpent-insect-1` | Coil v Hive | classic | 5, 9-9 | 2 of 7 tunnel; 1 re-roll |
  | `watch-bird-squirrel-1` | Aerie v Bushtails | classic | 5, 8-8 | 2 dives in 9 swooper fights |
  | `watch-squirrel-bird-1` | Bushtails v Aerie | classic | 5, 10-6 | 4 dives in 4 (the Stormtalons at S5, the Roc at S7) |
  | `watch-bird-serpent-1` | Aerie v Coil | classic | 5, the Aerie wiped out | 1 dive in 3 |
  | `watch-serpent-bird-1` | Coil v Aerie | classic | 5, 9-7 | 6 dives in 10 |
  | `watch-insect-bird-1` | Hive v Aerie | classic | 5, 6-8 | 3 of 14 tunnel; 1 re-roll; 4 dives in 4; snap-check's `races/` battle |
  | `watch-bird-insect-1` | Aerie v Hive | classic | 5, 8-4 | 2 of 7 tunnel; 2 re-rolls (4 dice); 4 dives in 9 |
  | `watch-field-insect-bird-1` | Hive v Aerie | Field, `open`, the `field` presets (970, 1,000) | 6, 12-18 | 1 of 15 tunnels; 2 re-rolls (5 dice) in 3; 9 dives in 13 |
  | `watch-fort-insect-serpent-1` | Hive v Coil | Skirmish, `fortified` | 5, 12-3 | 0 of 11 tunnel, no burrower above `STEP`; 2 re-rolls (5 dice); climbers on the decks (6 deployed there, 3 ladders, 4 deck fights) |
  | `hotseat-aggressive-hive-2` | Hive v Coil, both seats the bot's | classic, board 72995, dice 931106 | 4, the Coil wiped out | 128 entries, 14 a burrower's (advance, move, charge); its burrowers tunnel 3 times (the Delvers in rounds 1 and 4, the Deepguard in 3) and its Delvers re-roll twice ("Re-roll 1s (swarm)" [5] need 5, [3] need 5) |
  | `bushtail-aggressive-aerie-1` | Aerie (the bot's) v Coil (the AI) | classic, 86733 / 422652 | 4, the Aerie wiped out | 53 entries; the Stormtalons' charge (entry 34) and its `chargeEnd` (35) answer the round-2 fight, "Wound 3+ (dive, S5)", on the bot's own turn |

  The human logs: `--need burrowed,swarmed --tries 48` (candidate 2, the first fit; 29 of 48 fit, the rest lacking `burrowed` 12, `swarmed` 6 or both 1) and `--races bird,serpent --need swooped` (candidate 1; 42 of 48 fit). races/ names no list, so data-check's 90% row has nothing of it to hold. fog-check's sight pass reads a fixed list of logs, so `races/`'s two human logs were added to it (106 → 116 checks): the design's "over the corpus: automatic" did not hold for it. snap-check's `RACES_BATTLES` switches its `races/` battle on by the id `watch-insect-bird-1`, needing no edit.
