# Tails & Scales — roadmap

The running record of planned work. Update it as items land: tick them, link
the commit, and add whatever the work turned up.

## Standing rules

- **Behaviour parity.** Refactors must not change how a battle plays.
  `npm run parity -w @vibe-dump/tails-and-scales` replays the corpus in
  `sim/baselines` (seeded AI-vs-AI battles and human command logs) with the
  working tree's code in Node, and checks every trace line, every
  full-precision shadow snapshot and every battle-log write against the
  recorded hashes; a failure names the first diverging line, with context
  from the frozen code in `sim/oracle/PIN`. `node sim/parity.mjs --browser`
  builds the app and does the same in Chromium, starting each battle from its
  title-screen button; set `CHROMIUM_PATH` to the pre-installed Chromium if
  Playwright's own isn't installed. `node sim/self-test.mjs` checks the
  harness still catches what it must. Re-record (`--record`, then
  `--record --browser`) only for a change that is *meant* to alter play, and
  say so in the commit; the re-record moves `sim/oracle/PIN` (its first line)
  to the commit whose code produced the new hashes, in the same push, and
  `node sim/parity.mjs --pin` must pass after it.
- **Standing checks.** Beside parity, every step runs the checks the steps
  before it added, each exiting 0: `node sim/self-test.mjs`,
  `node sim/mutation.mjs`, `node sim/perturb.mjs --fn hypot` (0 battles
  moved), `node sim/data-check.mjs`, `node sim/flag-lint.mjs` (and
  `--self-test`), `node sim/mirror-check.mjs`, `node sim/terrain-check.mjs`
  (and `--self-test`) and, from R4, `node sim/rematch-check.mjs` (two
  battles in one page don't touch each other, and every terrain report is
  played). A step that changes what one of them reads ports it in the same
  step (DESIGN's §4 rows and notes say which).
- **Determinism.** Everything that can change an outcome draws from the logic
  RNG (the match's `G.rng`, `core/rng.js`), never `Math.random`; measures
  distances with `core/dmath.js`, never the engine's `Math.hypot`; and reads
  logical positions, never animated ones. Visual randomness stays on
  `Math.random`.
- **Copy.** Call it a tabletop wargame. Don't name other games or companies in
  docs, in-game copy, code comments or commit messages.
- **Repo conventions** (see the root `CLAUDE.md`): `npm run build` and
  `npm run verify` before every push, `dist/` committed, and lockfile changes
  in a commit of their own.

## Queue

The architecture is specified in [DESIGN.md](./DESIGN.md), the output of a
design panel (Automerge research, four competing proposals, three judges).
Its migration plan (§4) is the order of work. Every step has a gate, and every
step keeps the game playable.

**Refactor proper: behaviour frozen.** Byte-identical parity gates every step.

- [x] **R0 Harness and corpus.** `?debug` input hooks; `sim/oracle` runs the
  frozen legacy code in Node; a human-bot that plays through the hooks; a
  widened corpus (vs-AI, hotseat, wipe-outs) admitted only where Node and
  Chromium agree; a full-precision shadow snapshot at every action.
  Landed: `sim/` replaces `test/` (the 12 original battles, same hashes)
  and holds 24 AI pairs and 16 human command logs (4 per vs-AI seat, 8
  hotseat, 6 wipe-outs, one by a human's shot and one by their own friendly
  fire), built by `sim/corpus.mjs`. Each has its trace, its full-precision
  shadow and its battle log (including the destroyed-unit lines the trace
  never shows). Checks: `sim/mutation.mjs` (one swapped die fails parity at
  the right line), `sim/hooks-inert.mjs` (the hooks change nothing outside
  `?debug`) and `sim/self-test.mjs` (the harness catches wrong-phase
  commands, a spinning battle, a lost log line, a dead title screen).
  `sim/oracle/PIN` names the R0 commit. To read a reference trace:
  `node sim/parity.mjs --pin --dump <dir>`.
  Turned up:
  - Two rules bugs, fixed in their own commit (33946a4) before the corpus
    was recorded: a blast volley that wiped out its own unit crashed and
    soft-locked the game, and Advance-then-Auto let the AI advance the same
    unit twice.
  - Chromium's build of V8 disagrees with Node's in the last bit of
    `Math.sin`/`cos` for ~3% of inputs (`pow` ~10%; `atan`, `atan2`, `exp`
    and `hypot` agree). So 31 of the 40 battles have terrain an ULP apart in
    the two engines while their traces match; the corpus keeps Chromium's
    shadow hashes for those (`webShadow`). N0 picks which engine's trig to
    match, and `atan` joins its list.
  - DESIGN.md's R0 notes record the spec changes R0 made and the lead's
    decisions on them, plus two hooks later steps need (`log.at`,
    `createMatch`'s `onTrace`).
- [x] **R1 Per-match RNG and `hypot`.** `core/rng.js` instances; `dmath.hypot`.
  Landed: the dice are a plain-data generator in `G.rng`, fresh per battle,
  that `d6(G)`/`roll(G, n)`, the blast aim and the AI's tie-break draw from;
  `core/dmath.js` holds V8's two- and three-argument `hypot` formulas, which
  matched `Math.hypot` on 5M samples each, so both landed and every rules
  call uses them. `node sim/perturb.mjs --fn hypot` nudges `Math.hypot` by
  an ULP: 24/24 AI battles move on the R0 code, 0/40 on R1.
- [x] **R2 Race data and seats.** `data/` race definitions; seats with race,
  edge and controller; ability flags instead of text checks; `RULES_ID`.
  Landed: the two races are data (`data/races/*.js`), checked and frozen
  by `data/schema.js`. `G.seats` holds race, edge and controller, and every
  side-hard-wired site reads the edge. The flags `chargeAfterAdvance`,
  `corrodes`, `noCharge` and `brawler` and the AI's `t.ai` replace the
  key, text and fx tests. Names, colours, voices and gore come from the
  seat's race, and a mirror match paints seat 1 in the race's alternate
  colour, a clearly different hue (and the turn banner and end screen take
  the seat's colour, since the names read the same). `?races=a,b` picks the
  races for a page. Every table `core/` and `data/` export is frozen.
  `RULES_ID` is in `core/version.js`, and the ruleset moved to
  `core/rules.js` (the root `rules.js` re-exports it). Checks:
  `sim/data-check.mjs` (the types against the R0 code's, flags from the
  legacy tests; seats refuse `Object.prototype` names; `RULES_ID` moves on
  a stat, not on a name), `sim/flag-lint.mjs` (no unit or race key, name,
  ability-text or fx tests in rules code) and `sim/mirror-check.mjs`
  (serpent v serpent, squirrel v squirrel and swapped seats, AI and bot,
  each finish twice identically with each seat on its own edge; no
  baseline). data-check and flag-lint's self-test read the legacy code
  from the R0 commit (`LEGACY_REF` in `sim/lib.mjs`), which never moves:
  a re-record moves the PIN and leaves them alone. Left for R7/F6: the
  title screen's copy and mode-button colours, the HUD's VP pill ink, seat
  names that read the same in a mirror match (the tray's roll-off rows,
  several log lines, the AI hint), and a stronger mirror cue on the table
  than the base rim.
- [x] **R3 Terrain split.** `core/terrain/*` logic and recipes separated from
  `view/terrain.js` meshes.
  Landed: `core/terrain/` holds the battlefield as rules data. `terrain.js`
  has the chunks, line of sight and destruction. `recipes.js` has the
  modules and features, which make every layout draw in the old order and
  record what they decided in each chunk's `look`. `sets.js` holds the
  classic set's selection table and centre rule as data, and `geom.js` the
  box maths. `view/terrain.js` builds the meshes from the looks and plays
  breaks, falls, topples and rubble as the terrain reports them. That
  reporting is synchronous, through a plain sink; R4 moves the reports into
  the match's `out`, and R5 makes them the event stream. `scenery.js` is a facade with the old API, so main.js is
  untouched. `mulberry32`, `pick` and `rr` moved to `core/util.js`. The
  terrain sets joined `RULES_ID`. Checks: `sim/terrain-check.mjs` (P-terrain)
  holds boards 1-500 to the R0 code, exactly, on four counts: every layout
  draw, every chunk, every mesh, and a seeded run of blasts and wrecker
  sweeps. Its `--self-test` shows nine kinds of slip fail it, a single
  extra layout draw among them.
  `sim/terrain-shots.mjs` diffs rendered tables against the R0 build in
  Chromium, fresh and after identical blasts, and finds them pixel-identical.
  It runs Chromium's canvas 2D on the CPU, because the accelerated path
  painted main.js's mat slightly differently on some page loads (one run
  failed on that alone, with the code unchanged). A board that differs is
  shot again, and a difference that does not repeat is reported as noise
  rather than failed.
  Turned up: none of the parity corpus's boards has a log wall, so only
  P-terrain covers one. Both terrain tools drive the `Scenery` facade, so
  when R4 removes it, R4 ports P-terrain to `Terrain` and `TerrainView`
  (it stays a gate) and ports or retires the screenshot diff.
- [x] **R4 State and queries.** The game state `G` owns units, terrain, nav,
  turn and journal; queries take `(G, …)`.
  Landed: `core/match.js` `newState(setup)` builds the match state for every
  table the title screen shows (the board, both armies deployed, the turn,
  the trace), and `start()` begins the battle on it with its own dice
  (`startMatch`), so nothing carries over between battles: unit and chunk
  ids count from 1 again. The rules' questions are `core/queries.js`, each
  taking `G`; the read-only halves of moving, shooting and charging moved
  to `core/actions/`, and `nav.js` to `core/`. The AI reads `G` with those
  queries. Units are rules data only: their figures, rings, labels and
  animation state live in main.js's view, by unit id. The terrain reports
  into an array the caller passes (the match's `out`), which main.js plays
  into the terrain view straight after each call, so `scenery.js` is gone.
  The `?debug` surface the parity driver reads is unchanged, mapped onto
  `G` inside the block. Checks: parity 40/40 in Node and in Chromium;
  `sim/terrain-check.mjs` (P-terrain) now drives `Terrain` and `TerrainView`
  directly, boards 1-500 identical; `sim/terrain-shots.mjs` was ported (it
  finds figures by their own mark) and is pixel-identical to R0, and to R3
  with figures drawn; the new `sim/rematch-check.mjs` plays every corpus
  battle twice in one page, with Again between, then a third on a new
  board in another mode, and requires the same battle both times, the
  third to be the battle a fresh page plays, and every terrain report
  played; `sim/data-check.mjs` now loads every `core/` and `data/` module
  on its own, so an import cycle read too early fails there.
  Turned up: before R4 a second battle in the same page numbered its units
  15 to 28, so its trace differed from a fresh page's (no baseline could
  see it). The R3 note's worry about queued terrain events reading a block
  a later collapse had lowered can't happen with classic's recipes: a blast
  walks each column's blocks lowest first, a collapse lowers a block only
  over a gap, and the only gap below a block walked early is a window, with
  just one block above it in classic, the column's last (DESIGN's R4 notes
  have the whole argument, and what F7's pieces could change). The events
  carry the place anyway, for R5.
- [ ] **R5 Synchronous actions.** Each `await` becomes an emitted event; a
  transitional `EventPlayer` keeps today's visuals; a mirror for display state.
- [ ] **R6 Engine and commands.** Step machine, `legal`/`apply`, AI as
  generators, `LocalStore` + `Session`; the core runs headless in Node.
- [ ] **R7 View and UI decomposition.** Stage, camera rig and presets, views,
  input tools, `ui/*`, HUD model, template cache.
- [ ] **R8 Netplay seams.** `stateHash`, envelopes, `Folder` (the replicated
  authority), merge-sim.

**Multiplayer and features.**

- [ ] **N0** Cross-engine maths (`sin`/`cos`/`atan`/`atan2` in `dmath`).
- [ ] **F3** The End-phase button lights up when nothing is left to do.
- [ ] **F1** Playing a side puts your side of the board in front of you
  (the serpents included).
- [ ] **F2** Spectating is viewed broadside: one army left, one right.
- [ ] **F4** After round 5, the win screen offers **Keep playing** (a vote).
- [ ] **N1** Real Automerge in Node: two- and three-peer tests.
- [ ] **N2** Online play: lobby, join by link, joint dice seed, presence,
  desync report. (The claude.ai artifact blocks outside connections, so
  online play works from GitHub Pages or a local server.)
- [ ] **N3** Spectating, rejoin, scrubbing, replay export, tamper alarm.
- [ ] **F6** Race selection with a mini 3D diorama of each race's figures.
  It makes mirror matches reachable from the title, so it also takes R2's
  leftovers: seat names that read the same in a mirror (roll-off rows, log
  lines, AI hint) and a stronger mirror cue on the table.
- [ ] **F5** New races: insectoids (burrow, swarm) and bird-people (fly,
  swoop).
- [ ] **F7** More terrain: climbable fortifications (2.5D elevation).
- [ ] **Ship.** Verify everything, rebuild, re-shoot the thumbnail if
  needed, publish.

### Open questions (building the defaults unless told otherwise)

1. Online opponents are **friends sharing a link**. Dice are seeded jointly,
   so nobody can grind the seed, but a player with devtools could foresee
   rolls. Strangers would need fair commit-reveal dice and signed commands.
2. Sync goes through the **public `wss://sync.automerge.org`**, with a
   `?sync=` override for a self-hosted server.
3. The Automerge wasm (3.6 MB, about 1.1 MB compressed) is **committed in
   `dist/`** and loaded only when you play online.
4. A rules change makes in-progress online matches **read-only**.
5. Insect burrowing is **always visible**.

## Done

- Charge destination picking; clean table on a new game; inside-out serpent
  bodies and open shells fixed; exact pathfinding distances; Auto race
  closed.
- Battles replay exactly (logic RNG, logical positions, sampled wrecking,
  trace, `?fast`), plus the parity tooling in `test/` (moved to `sim/` in R0).
