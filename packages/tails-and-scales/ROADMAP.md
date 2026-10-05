# Tails & Scales — roadmap

The running record of planned work. Update it as items land: tick them, link
the commit, and add whatever the work turned up.

## Standing rules

- **Behaviour parity.** Refactors must not change how a battle plays. With the
  app built, `node test/parity.mjs` replays twelve seeded AI-vs-AI battles in
  the browser (`?debug&fast`) and compares each trace line against
  `test/baseline.json`. Set `CHROMIUM_PATH` to the pre-installed Chromium if
  Playwright's own isn't installed. Re-record (`--record`) only for a change
  that is *meant* to alter play, and say so in the commit.
- **Determinism.** Everything that can change an outcome draws from the logic
  RNG (`rng.js`), never `Math.random`, and reads logical positions, never
  animated ones. Visual randomness stays on `Math.random`.
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

- [ ] **R0 Harness and corpus.** `?debug` input hooks; `sim/oracle` runs the
  frozen legacy code in Node; a human-bot that plays through the hooks; a
  widened corpus (vs-AI, hotseat, wipe-outs) admitted only where Node and
  Chromium agree; a full-precision shadow snapshot at every action.
- [ ] **R1 Per-match RNG and `hypot`.** `core/rng.js` instances; `dmath.hypot`.
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

- [ ] **N0** Cross-engine maths (`sin`/`cos`/`atan2` in `dmath`).
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
  trace, `?fast`), plus the parity tooling in `test/`.
