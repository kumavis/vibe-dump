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
- [ ] **R2 Race data and seats.** `data/` race definitions; seats with race,
  edge and controller; ability flags instead of text checks; `RULES_ID`.
- [ ] **R3 Terrain split.** `core/terrain/*` logic and recipes separated from
  `view/terrain.js` meshes.
- [ ] **R4 State and queries.** The game state `G` owns units, terrain, nav,
  turn and journal; queries take `(G, …)`.
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
