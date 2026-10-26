# Tails & Scales — roadmap

The running record of planned work. Update it as items land: tick them, link
the commit, and add whatever the work turned up.

## Standing rules

- **Behaviour parity.** Refactors must not change how a battle plays.
  `npm run parity -w @vibe-dump/tails-and-scales` replays the corpus in
  `sim/baselines` (seeded AI-vs-AI battles and human command logs) with the
  working tree's pure core, folded headless in Node (since R6b; `--page`
  plays the page itself under a fake DOM instead; since R8 through the
  Folder, every entry an envelope, as every mode plays), and checks every
  trace line, every full-precision shadow snapshot and every battle-log write
  against the recorded hashes; a failure names the first diverging line,
  with context from the frozen code in `sim/oracle/PIN` (by that code's own
  runner: its page today). `node sim/parity.mjs --browser`
  builds the app and does the same in Chromium, starting each battle from its
  title-screen button; set `CHROMIUM_PATH` to the pre-installed Chromium if
  Playwright's own isn't installed. `node sim/self-test.mjs` checks the
  harness still catches what it must. Re-record (`--record`, in Node; since
  N0 Chromium computes the same shadow, so `--browser` then only checks it)
  only for a change that is *meant* to alter play, and say so in the commit; the re-record moves `sim/oracle/PIN` (its first line)
  to the commit whose code produced the new hashes, in the same push, and
  `node sim/parity.mjs --pin` must pass after it.
- **Standing checks.** Beside parity, every step runs the checks the steps
  before it added, each exiting 0: `node sim/self-test.mjs`,
  `node sim/mutation.mjs`, `node sim/perturb.mjs --fn hypot` (0 battles
  moved; from N0 also `--fn sin,cos,atan,atan2`), from N0
  `node sim/dmath-check.mjs` (core/dmath.js computes Node's own bits;
  `--browser` in Chromium too: the same bits), `node sim/data-check.mjs`, `node sim/flag-lint.mjs` (and
  `--self-test`), `node sim/mirror-check.mjs`, `node sim/terrain-check.mjs`
  (and `--self-test`), from R4 `node sim/rematch-check.mjs` (two battles
  in one page don't touch each other, and every event is played), and from
  R5 `node sim/present-check.mjs` (and `--self-test`: what the table shows,
  folded from the match's events, is the match at every action), and from
  R6a `node sim/parity.mjs --core` (the pure core folds the whole corpus
  headless, exactly, with three.js and the fake DOM refused; since R6b
  the default, with `node sim/parity.mjs --page` the page's run),
  `node sim/mutation.mjs --core` (one swapped die fails that gate too) and
  `node sim/property.mjs` (and `--self-test`: P-prop, what holds for any
  play of the core, the Session included since R6b, and since R7b the end
  screen's `resultOf` held to the match's game.over), and from R6b
  `node sim/boundaries.mjs` (and `--self-test`: the layer rules, which
  code may import what, the core's surface that keeps the dice out of the
  layers above it, and what the consensus code must never contain), and
  from R7a `node sim/camera-check.mjs` (the camera presets give the R0
  code's views, and the CameraRig comes to rest where `fitPose` puts it;
  since F1/F2 a battle opens behind the seat played here or broadside, and
  the view button's views step round, DESIGN §2.11), and from R8 `node sim/merge-sim.mjs` (and
  `--self-test`: P-merge, peers folding one log in any causal order agree
  on what was accepted, refused and hashed, junk and forks included, each
  entry hashed where §0.2 #3 says; the cap, the Folder's edges, same-seat
  forks in the deployment and the desync drills, early and late; since
  R8b each human log's seats also answering only from their sinks, the
  single flight), and from R8b `node sim/fold-cost.mjs` (and
  `--self-test`: a 5,000-entry log folds with the same work per entry as
  a short one, with no O(n) decode, copy or stringify per entry (played an
  entry at a time, each change still makes one identity scan of the
  entries pushed: nanoseconds a compare, so quadratic only in theory); it times folds, so
  run it on a quiet machine; from N1 also `--store automerge`, and its
  `--self-test`, over the Automerge store), and from N1
  `node sim/peers.mjs` (and `--self-test`: P-peers, the corpus played over
  real Automerge by two and three automerge-repo peers, same-seat forks
  included, every peer's document, fold and view agreeing with a fresh fold
  and the corpus battle; it runs on real time, about a minute), and from N2
  `node sim/net-check.mjs` (names, the seed, the start's check, the lobby
  and a whole battle through a sync server) and `node sim/bundle-check.mjs`
  (a game played alone loads no Automerge), and from N3
  `node sim/replay-check.mjs` (and `--self-test`: every corpus battle
  scrubbed move by move, replayed from its start event for event, saved
  and opened again, held to what a page kept), and from S0-S3
  `node sim/scale-check.mjs` (and `--self-test`: P-scan, P-los and
  P-memo, the core's scans held to the scans as they were, on classic and
  Grand: the Grand fixture until F8b, the `grand` mission since) and
  `node sim/scale-bench.mjs` (the core's cost on
  classic and Grand, a report failing above 1.5× budget: run it on a quiet
  machine), and from F10a `node sim/macro-check.mjs` (and `--self-test`:
  P-macro, one-shot group actions over a Session send only what the match
  takes, and land where their preview drew them), and from V1
  `node sim/playback-check.mjs` (and `--self-test`: the batch rule over
  every corpus and Grand stream, a Grand AI movement phase within
  8 s; since F8b the attack batches and brief banners too, a Grand AI
  battle within 200 s as watched, and the `scale/` streams; `--browser`
  with Chromium), and from F10b
  `node sim/pilot-check.mjs` (and `--self-test`: P-auto, a pilot of every
  standing unit and End play the battle Auto plays, phase by phase), and
  from F10c `node sim/macro-check.mjs` covers the standing orders too (the
  march scenarios at 80%, the settings answered from settled), and from F8a
  P-prop's setups task holds P-mission, and from F11a
  `node sim/army-sim.mjs --check` (and `--self-test`: the Skirmish gates,
  the score within 4 points of even on every set the mission offers, from
  F7a `fortified` with `classic` (`--terrain <set>` plays one), and each
  unit's price within its fitted band; 5,400 battles, so run it on a quiet
  machine, about 4 minutes, its self-test, on one set, about 3), P-army
  in P-prop (fuzzed armies, autoList, battles between random lists) and
  P-mission's refusals, data-check's prices, rosters, presets and list
  rules, the `army/` set in parity and merge-sim's `lists`, and from F7a P-prop holds P-height and P-level (two
  random games in five on fortified boards, and the `height` task: since
  F7a's review its scenes, and P-level on Grand-sized boards too),
  scale-check's P-scan the fortified boards (the `fort/` AI pairs, the
  Grand fixture's `--fortified`, and the box with height), terrain-check
  holds the fortified set and P-climb (its sections 6 and 7, and the
  self-test's fortified edits), parity folds the `fort/` log set (AI pairs
  as logs with no entries) beside the rest (with `army/`, 60 battles), and
  `node sim/play-report.mjs` (the step's AI corpus against §4.2.9's
  thresholds: F7a's over the `fort/` AI pairs, its counts read off the
  match by `sim/height-probe.mjs`) passes, and from
  F8b terrain-check's **connectivity** rows (a hull of r 1.5 and a squad of
  r 1.18 cross zone to zone, and the squad controls every objective, on
  every Field and Grand board of seeds 1-500; its `--self-test` plants a
  wall and a ring), army-sim's gates at all three sizes (Skirmish, Field
  and Grand, the score and per-unit gates: about 15-20 minutes with
  `--jobs 2`; a step that moves balance runs it; Grand's rows are played
  and reported, not judged, until the Grand rebalance below is settled),
  `node sim/play-report.mjs`
  (F10b's row over the `scale/` corpus's Grand pairs), and the `scale/`
  set in every check that reads the corpus (parity's 70 battles with `army/` and `fort/`, P-auto,
  P-peers' `--only scale`). A step
  that touches `view/`, `ui/`, `input/`, `app/` (main.js's handlers until
  R7b) or the `?debug` block also runs these in Chromium (`CHROMIUM_PATH`
  set),
  each exiting 0: `node sim/snap-check.mjs` (and `--self-test`: the table
  built event by event is a fresh snap's, and each battle's table snapped
  in place at its end; by default seven battles, and the whole corpus,
  `--only ai,human`, at milestones, as P-browser),
  `node sim/rematch-memory.mjs` (and `--self-test`, an edit for each rule
  it judges: renderer.info flat over 5 rematches, the page's own heap not
  growing a rematch (R7b: from heap snapshots, V8's compiled code left
  out), and no shader program linked twice between a title and a battle's
  end; from F7a's review also `--terrain fortified`, the same over
  fortified battles), `node sim/title-shot.mjs` (the title at 1200 ms against the
  previous commit; exit 3 is a timeout, not a verdict: run it again),
  `node sim/terrain-shots.mjs` (the five boards against R0, run at every
  step that touched the view since R3, listed here from R7a) and, from
  R7b, `node sim/hud-check.mjs` (and `--self-test`: a snap mid-battle, in
  the deployment, the roll-off, a seat's phase, at a charge's end and past
  the end, leaves the HUD right: Begin battle, End and Auto up for a local
  seat's phase, Shortest move and the charge's spots, the end screen worded
  as the match's own game.over; and the HUD model's `end.ready` is the
  match's wherever a local seat idles in its phase), and from R8b
  `node sim/play-check.mjs` (the shipped page played rendered, without
  `?debug` or `?fast`, through the DOM alone: a watched battle and back,
  vs. the AI from each seat and hotseat, each seat played here placing
  units by clicks before Begin battle; `--full` without `?lowfi`), and from
  N2 `node sim/lobby-rig.mjs` (and `--self-test`: online play in Chromium,
  pages meeting only through a local sync server, from the lobby to the
  rematch; from N3 the replay bar, replay files and the page that comes
  back; from F10a a group placed and moved online), and from F10a
  `node sim/input-check.mjs` (the group input by mouse, keys and real
  touches: the box, the pin and its sending, lines, +D6, Tab, Ready N,
  Select mode, long presses, the touch fallback), and from F8a
  `node sim/board-check.mjs` (and `--self-test`: P-board, the table made
  for each match's board across missions, flat over round trips), and from
  F8b `node sim/render-bench.mjs` (the drawing's rows on a Grand
  whole-board frame, a report failing above 1.25× budget: build first, run
  it on a quiet machine; rematch-memory alternates Grand and classic
  battles now, 50-80 minutes, `--classic` the old run). A step that changes what one of them reads ports it in the same
  step (DESIGN's §4 rows and notes say which).
- **Determinism.** Everything that can change an outcome draws from the logic
  RNG (the match's `G.rng`, `core/rng.js`), never `Math.random`; measures
  distances and angles with `core/dmath.js` (`hypot`, `hypot3`, and since N0
  `sin`, `cos`, `atan`, `atan2`), never the engine's approximated `Math`
  functions or `**`, which `sim/boundaries.mjs` bans from the rules; and reads
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
    match, and `atan` joins its list. (N0: Node's, which is fdlibm's;
    `webShadow` retired.)
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
- [x] **R5 Synchronous actions.** Each `await` becomes an emitted event; a
  transitional `EventPlayer` keeps today's visuals; a mirror for display state.
  In three passes: R5a (the seam, damage, morale), R5b (fight, charge),
  R5c (built move first, then shoot, the lead's order; then the whole
  corpus in Chromium).
  - [x] **R5a** landed: `core/journal.js` emits events into the match's
    `out` (`emit`, `emitTo`, `drain`; a battle-log line is now a traced
    `log` event, `at` its place in the trace); `present/mirror.js` (the
    match as shown: `project`, `applyEvent`) and `present/pace.js`;
    `view/player.js`, the transitional `EventPlayer` whose handlers in
    main.js are the old visuals; `core/actions/damage.js` (`damage`,
    `closeRanks`, `killModel`, `unitDestroyed`) and
    `core/actions/morale.js` (`moralePhase`, `flee`), synchronous. The
    figures, labels, objective flags, score and round now read the mirror,
    not the match. The terrain reports its events by chunk id, and its view
    never reads a live chunk. Checks: the new `sim/present-check.mjs`
    (P-present: the mirror is the match at every action's end, after
    every converted action's events, which is what catches a flag or
    label event an action forgets, after the stage events main.js emits,
    and, for the flags, at the old walk's end; with a self-test that drops
    one event at a time); parity 40/40 after each file; `rematch-check`
    waits for the player to be idle; `terrain-check` folds the terrain's
    events into a mirror too; a battle watched rendered in Chromium on R4
    and on each pass writes every log line at the same trace length and
    game time (to within the watch harness's own frame or two of jitter
    from run to run, which R4 shows too).
    Turned up: the oracle stamps each battle-log write with the live trace
    length, not `data-at`, so under `?debug` the page's trace keeps pace
    with the player (DESIGN's R5a notes); R5b must keep that true for the
    state lines its actions write, and R6 must carry the state with them
    (until then a state line that waits throws if the match has moved). A
    wall block dropped twice by one blast is drawn a level too high, as it
    always was (view only). The flags at the battle's start are checked,
    but no corpus battle has an objective held then, so dropping them
    passes P-present: covering them needs a human log that deploys onto an
    objective (a corpus change). R5a lands as one commit (the seam, damage
    and morale): the review rounds changed the seam both files share, so
    no damage-only state of the final code was gated on its own (DESIGN's
    R5a notes).
  - [x] **R5b** landed: `core/actions/fight.js` (`fight`, `fightPhase`)
    and the charge split in `core/actions/charge.js` (`chargeSpots`,
    `declareCharge`, `finishCharge`), synchronous, each wait an event in
    its old place (a lunge is a `melee` event, a turn to face `unit.face`,
    the camera's swing `focus`, the roll's verdict `charge.result`). A
    human still picks the charge's end spot in main.js (the orange area, a
    click, Shortest move) until R6's `chargeEnd`. A charge's move is
    `resolveWalk` (with `smashAround`, now in `core/actions/move.js`),
    brought forward from R5c because `finishCharge` walks: the walk is
    resolved at once and played back by the view, which draws the unit
    along its path while the mirror already holds where it ends. Checks:
    parity 40/40 and every standing check after each file; P-present's
    self-test drops the charge's walk, its smashes, and its flags and
    labels (20 drops in all, every one caught); a battle watched rendered
    on R5a and on each pass writes every battle-log line at the same trace
    length and the same game time into the battle (the runs' starts sat a
    frame or less apart), a human log's charge picks included, and
    played again with the picks made by the mouse (a click on the spot,
    and the Shortest move button) writes the same battle. After review,
    P-present also holds the fight's and the charge's own events, which
    the mirror can't see (a lunge and its hit row, a turn to face, a
    charge's verdict, the beat after a fight), to their order (27 drops
    and moves in its self-test, every one caught); terrain-check's sweeps
    go through core's `smashAround` itself; and a walk in a quiet run
    keeps no events.
    Turned up: the charge's `act` line need not wait (the R5a follow-up):
    main.js ends the action once the charge's events have played, so no
    state line is written while the view is behind until R6 ends actions
    in core. A charge's flags now turn as its walk ends rather than the
    frame it crosses (a move's still turn mid-walk until R5c). The fight
    phase's closing label refresh repeats its last fight's, so P-present
    cannot see it go (DESIGN's R5b notes).
  - [x] **R5c** landed: the movement phase's actions in
    `core/actions/move.js` (`doMove`, also an advance's move and a fall
    back, now on the `resolveWalk` the charge already used; `doAdvance`,
    the roll, which writes no `act` line; `hold`, the AI's spent move) and
    the shot in `core/actions/shoot.js` (`doShoot`, `blastVolley`,
    `eruption`, `blastLands`, `mesmerize`), synchronous, each wait an event
    in its old place: a volley, a template's aim, scatter, throw and
    landing, a spell cast or fizzling, thorns erupting and fading, a gaze
    and its "Mesmerized!", and a wrecker's stomp on its walk. No rules
    action awaits anything now; main.js plays each action's events with
    the old visuals (projectiles, the war machines' throws, the thorn
    spikes, the gaze beam, explosions and scorch marks) and then ends it.
    The old per-frame walk is gone, and with it its flag hack and its
    checkpoint: every figure's place on the table comes from the events.
    Checks: parity 40/40 and the step's gates after each file (DESIGN's
    R5c notes list them);
    P-present now holds the move's and the shot's own events to their
    order too (42 drops and moves in its self-test, every one caught, and
    `--mutations` to run a few); one battle that shows every weapon,
    friendly fire, wrecked scenery, the Brute's wrecking move and a fall
    back, watched rendered on R5b, on the move and on the shot, writes the
    same trace and battle log at the same game time and draws the same
    frames (but for the two below); every weapon's look caught on screen
    as its events play; a game played without `?debug` (an Advance, a
    move and a shot with the mouse, a vs-AI game on Auto to its end); and
    P-browser over the whole corpus, 40/40.
    Turned up: a move's objective flags now turn as its walk ends rather
    than the frame it crosses, and a block a wrecker's move drops twice
    raises its dust where the whole walk left it (both as a charge's have
    since R5b): the only differences the watched frames show. The watch
    harness's screenshots differ wherever a CSS animation is on screen
    (the turn banner, the dice rolling in), which runs on the wall clock,
    not the virtual one, so builds are compared frame for frame with CSS
    animations ended at once. Two events joined §2.3 (`spell.fade`,
    `spell.mesmerized`) and `unit.move` gained `stomp` (DESIGN's R5c
    notes, for approval).
    After review: P-present's "held none" rule is the whole corpus's (a
    `--only` run just notes the kinds it lacks), and its self-test runs
    the check unmutated first and counts only a battle's own failure as a
    catch; the "Mesmerized!" rule now needs a `status` with the target
    mesmerized; core's `doMove` remakes its plan from the unit's flags
    when given none, as R6's `move {u, c}` will, and every move goes that
    way now, so parity holds all 1,751 corpus moves made on the remade
    plan to the old ones (a one-off probe found the plans deep-equal
    too); `check` lost its unused `keys`. R5c lands as one commit, as R5a
    and R5b did (the review changed what the move's half and the shot's
    half share), for approval (DESIGN's R5c notes).
    After the second review: P-present also holds the look the view reads
    off those events (a walk's flight and pace, the beat after a template
    that caught nobody, who throws, each weapon's `fx`: six more edits in
    its self-test, 48 in all); the shot's handlers that go on after a
    wait do nothing more once their table is replaced, as the walk's and
    the lunge's; a `?debug` `setUnitPos` in battle turns the flags and
    labels with it; and DESIGN says a snap must take away the template's
    marker and the thorns, view state outside the mirror. Every gate ran
    again on the fixed tree, P-browser over the whole corpus last, 40/40
    (DESIGN's R5c notes).
- [x] **R6 Engine and commands.** Step machine, `legal`/`apply`, AI as
  generators, `LocalStore` + `Session`; the core runs headless in Node.
  In two passes, the engine built beside the old loop and switched only at
  full parity: R6a (the pure core, proved headless), R6b (the game onto it
  through `LocalStore` and `Session`, the legacy pieces retired).
  - [x] **R6a** landed: `core/engine.js` (the battle loop unrolled into
    a step machine: the roll-off, the turns and their phases, the score,
    the end, the AI played inside it), `core/commands.js` (what each seat
    may send, `legal()` with the dice locked, and the handlers),
    `core/index.js` (`createMatch`, `legal`, `apply`, `pendingSeats`,
    `preview`, `q`), the AI as generators in `core/ai/` (ai.js is gone:
    the shipped game's old loop drives the same generators, so the game
    and the fold run one AI), and `data/mission.js` (the objectives, the
    rounds and the deployment depth, now in `RULES_ID`). The turn has its
    final shape in both loops (`ph`, read through `phaseKey`). Checks: the
    new `node sim/parity.mjs --core` folds every corpus battle through the
    pure core in plain Node (`sim/run.mjs` refuses three.js and the fake
    DOM), 40/40 the same, the battle log and the full-precision shadows
    rebuilt from the match; a battle takes 0.21 s folded cold in a fresh
    process, 0.07 s warm; `node sim/mutation.mjs --core` shows one
    swapped die fails it at the right line (33 of 40 battles); the new
    `sim/property.mjs` (P-prop: asking `legal()` or a preview never rolls
    or changes the match, the AI never sends an illegal command, random
    legal play never throws, two matches in one process never touch, and
    a quiet fold, with no events kept, plays the same battle; its
    self-test catches thirteen broken cores: six from the first pass, two
    added in review round 1, three in round 2 and two in round 3); and
    every standing check, the
    page's parity included, plus P-browser over the whole corpus, since
    the shipped game's AI now comes from the generators (run before the
    review fixes, and again after fixer rounds 2 and 3, 40/40).
    Turned up: the engine's round stops at the last round where the old
    loop overshot by one, which only the legacy shadow sees (the G adapter
    keeps the quirk); a preview has to lock the dice through the core,
    since nothing above it may touch them (`preview`, for R6b's Session);
    and the charge's decision is opened by its handler, so the actions
    never touch the pending decision (DESIGN's R6a notes, for approval,
    with the list of what R6b must do).
    Review fixes (fixer round 1): the charge proposal is marked in the R6
    row and in §2.2's charge bullets, with what R6b does either way, for
    the lead's decision now; P-prop also folds the engine's own events
    into the mirror and holds it to the match at every act, decision and
    end (the engine's stream had no check until R6b's Session); `legal()`
    refuses a body carrying a field its kind doesn't take, and a
    concession once a side is wiped out (which handed the win to an army
    with nothing standing); the AI's phase decision is no longer stored
    in the pending decision while it plays; `pendingSeats` answers a
    copy, a setup's empty fields take their defaults, main.js's zone
    meshes read the mission's depth, the headless guard names what it
    refused, and DESIGN says where the battle log comes from now (a quiet
    fold has none, for R6b and R8 to keep).
    Review fixes (fixer round 2): the headless fold held a concession to
    the seat the match was waiting on, so a hotseat log in which the other
    player concedes (legal at any time) would not fold; it now lets
    `legal()` judge a concession alone, as the Folder will. P-prop applies
    such concessions (in random hotseat games, and in a fixed case in the
    deployment and in the battle), folds every random game's log again
    through the headless fold, checks that asking emits no event and that
    the game-over event says the result and the rounds played (0 for a
    concession in the deployment, which said 1); its self-test catches
    three more broken cores. The setup keeps its own key order, DESIGN's API
    listing names `fullSetup`, the actions' headers say who ends an action
    until R6b and after, and the record of checks says which tree each ran
    on.
    Review fixes (fixer round 3): DESIGN's Folder (§2.6) handed `legal()`
    the whole log entry, envelope and all, which the strict `legal()`
    would refuse at its first field; it now hands it the body,
    `match/envelope.js` `bodyOf(e)` (the entry less the envelope's fixed
    `ENVELOPE_KEYS`, so a stray field still reaches `legal()` and is
    refused), with R8's row and R6b's store saying the same. The match's
    state holds its pending decision (null) and `strict` from the start,
    so an all-AI battle never runs with the key missing; a setup asking
    for more than 99 rounds is refused, since `createMatch` plays an
    all-AI battle to its end before it returns; P-prop checks the setups
    the core refuses and the state's shape (two more broken cores caught);
    the API listings mark what joins at R8.
  - [x] **R6b** landed: every mode (watch, vs. the AI from either seat,
    hotseat) is a `Session` (`match/session.js`) over a `LocalStore`
    (`match/store.js`), the match created from the whole setup when a mode
    is chosen; the old battle loop in main.js is gone (the battle, the
    turns, the score, the end, the action's end, the AI's turn), and the
    page plays the core's events (the roll-off's dice, each phase's banner,
    the score's rings, the end screen worded from how it ended). The title
    shows a backdrop, a match on the board seed that is never played, whose
    meshes and figures the battle keeps. Clicks and buttons are commands
    (units by id, places by nav cell) sent only if the match takes them,
    the previews ask with the dice locked, and the charge's end is
    `input/tools/charge-end.js`. End, Auto and Advance now look disabled
    while the table plays, not just ignore clicks. The `?debug` surface is
    derived from the Session (sim/oracle unchanged), each waiting state
    line carrying a snapshot of the match as it was written, since one End
    now computes a whole AI turn first. P-present's checkpoints come from
    the trace as the match writes it. `data/compat.js` is gone (the seats'
    look in `ui/theme.js`, the classic matchup in `data/mission.js`);
    `sim/boundaries.mjs` checks the layer rules; parity's default is the
    pure core, the page kept as `--page`, and the PIN rule stays, with
    references from the PIN's own runner (DESIGN's R6b notes). Checks:
    parity 40/40 on the core and on the page, P-browser over the whole
    corpus 40/40, P-present 40/40 (and its self-test), P-prop with the
    Session (and its self-test, two more broken copies caught), every
    standing check, and the shipped page played rendered in Chromium
    without `?debug` or `?fast`: a watched battle to its end screen and back
    to a new battlefield, vs. the AI from each seat with real clicks, and
    hotseat.
    Review fixes (fixer round 1): through the roll-off the HUD no longer
    shows seat 0's movement (End, Auto and the hint wait for the first
    phase's banner); a click off the orange area during a charge's pick
    does nothing again (it ended the charge with Shortest move); every seed
    the page takes is wrapped as the generators always did (`?seed=-5`, a
    seed box of -5 or `?dice=2.5` broke the page or every start), drawing the
    same boards and dice as before; `sim/boundaries.mjs` bans `core/rng.js`
    from match/, present/ and net/ too, and catches `export let` and empty
    Sets; a battle always starts on its own table; the sink binds the
    Session it is handed; `?debug` `scenery.blast` is title-only and every
    hook throws on a refused command; the dead `play()` and `drain()` went;
    P-present holds the roll-off's order; data-check holds the seats' look;
    flag-lint runs through a symlinked path; P-prop requires the Session
    whenever `match/` exists; `sim/terrain-shots.mjs` run (identical to R0,
    with `--full` too). Every check again, P-browser over the whole corpus
    and the rendered runs included (DESIGN's R6b notes).
    Review fixes (fixer round 2): `sim/boundaries.mjs` now keeps the dice
    themselves out of the layers above the consensus code, not just their
    module: each imports from `core/` only its surface (no `d6`/`roll`, no
    engine, commands, actions or AI; `apply` only from `match/`), the
    surface's doors pass on nothing that draws but the listed queries,
    statements are read across lines and re-exports followed through
    `export const` and aliases (75 self-test cases); the unit card no longer
    tells of moves, shots, charges and cover the table hasn't played yet
    (only while the player is idle; P-present reads every card at every
    checkpoint); stale R5/R6a headers rewritten; a seat "played here" is the
    Session's `localSeats`; a `?debug` charge hook abandoned mid-pick no
    longer breaks the next table. Every check again, P-browser over the
    whole corpus and the rendered runs included (DESIGN's R6b notes).
    Review fixes (fixer round 3): P-prop holds the events the Session hands
    its view to the ones the core leaves, batch by batch (a Session that
    dropped the `pending` events passed it; one more broken copy caught);
    End and Auto stay up, disabled, through a contact charge's roll and its
    walk, hidden only while the pick waits; `sim/boundaries.mjs` also bans
    `Math` other than as `Math.<member>`, the timers, `crypto`, `process`
    and `globalThis` from the consensus code, and no longer loses a line's
    code after a `//` inside a string (86 self-test cases); `CLASSIC`
    documented as the page's default races (no setup takes it by default);
    the two changes players can see (hotseat's deploy lines at once, the
    zones' opacity on the title after a battle) listed for approval; stale
    headers rewritten. Every check again (DESIGN's R6b notes).
- [x] **R7 View and UI decomposition.** Stage, camera rig and presets, views,
  input tools, `ui/*`, HUD model, template cache. In two passes: R7a (the
  view), R7b (the input, the UI, the HUD model and the app; main.js down to
  its boot).
  - [x] **R7a** built: every three.js object the page draws is made and
    played by `view/`'s modules (stage, clock, camera rig, table,
    objectives, units, terrain, overlay, effects, models, sfx; `util.js`,
    `fx.js`, `sfx.js` and `models.js` moved or split), the camera's poses
    come from `present/camera-presets.js` (today's views, the broadside and
    behind presets built for F1/F2), and main.js keeps the input, the UI
    and the flow (2,357 lines to 1,648). The player snaps: a new table and
    a battle's start rebuild the table from the match as it stands
    (`TerrainView.sync`, `UnitViews.sync`), in place of the start's dropped
    board events, and the board's adds take back the meshes on show.
    Figures are cloned from a template per unit type, and a new table frees
    the last one's figures and meshes (before, every rematch leaked a
    table's geometry). Changes a player can see, for approval: a block a
    blast drops now falls to its place instead of floating a level up when
    the blast drops it twice, or drops and then hurts it (R0's tweens). The
    start's snap shows the title's stage, so P-present still sees the
    deployment's `stage` event. New checks: the snap-equivalence check in
    Chromium (`sim/snap-check.mjs`, with a self-test), renderer.info and
    the heap over 5 rematches (`sim/rematch-memory.mjs`), the camera
    presets against R0's camera (`sim/camera-check.mjs`), and the title at
    1200 ms against HEAD (`sim/title-shot.mjs`). Checks: parity 40/40 on
    the core and on the page, P-browser over the whole corpus 40/40,
    P-present 40/40 (and its self-test), P-prop, the snap check over seven
    battles (and its self-test), the memory check over 5 rematches (HEAD's
    leak shown by the same check), the title against HEAD, every standing
    check, and the shipped page played rendered in Chromium without
    `?debug` or `?fast`: a watched battle to its end screen and back to a
    new battlefield, vs. the AI from each seat with real clicks, and
    hotseat (DESIGN's R7a notes, with what R7b must do). Fixer, round 1:
    the camera rig's `fit` and `goTo(preset)` (a fitted preset, F1's or
    F2's, no longer throws, and the dolly limit makes room for it), tested
    on the rig itself in `sim/camera-check.mjs`; a board's adds on a table
    synced to wrecked chunks no longer take back a broken chunk's empty item
    (a standing chunk never drawn) or a block the sync set lower (left at
    its dropped height) (terrain-check plays it, with two more self-test
    edits); the snap check's fresh snap goes
    through the player's own `rebuild` and compares the shooting's marker
    and thorns; a snap puts a war machine's arm and globe back; every check
    again. Fixer, round 2: R7a's checks joined the standing checks above
    (`sim/camera-check.mjs` every step; the snap check and its self-test,
    the memory check, the title shot and `sim/terrain-shots.mjs` in
    Chromium for a step that touches the view, the snap check over the
    whole corpus at milestones), and F1/F2's rows name camera-check's
    checks they change; the snap check ran over the whole corpus, 40/40;
    the presets' unread `fit` gone (`fitPose` fits the whole board, and a
    narrow portrait phone stops at `max`: F1/F2's to tune); an open card is
    left as it was after a snap, as before R7 (no card is open across one
    in play); `sim/title-shot.mjs --timeout`, a timeout read as
    inconclusive (exit 3), not as a failed frame; stale wording fixed (the
    start snaps the backdrop, the battle's table; "another point of the
    stream"; the projectiles made with the shooting's view); What R7b must
    do names homes for the handlers' table, `rebuild`, `sameUnits`, `onTitle`
    and the fallback, and the HUD after a snap mid-battle; every check
    again (DESIGN's R7a notes). Fixer, round 3: a snap takes away fx's
    scorch and acid marks (only a new table did, after its snap; N2's
    scrub or rejoin would have kept a left timeline's), held by the snap
    check snapping each battle's table in place at its end (a self-test
    edit more); a glowing projectile's material is shared per colour
    instead of made and freed per shot, which linked its shader program
    again at every spit or acid volley, held by the memory check noting
    every program linked (and its own `--self-test`); terrain-check holds
    every add's def to the view's copy of `defOf` (a self-test edit more;
    F7's row names the pair); the docs give `UnitViews.sync(units,
    edgeOf)`, and What R7b must do names flag-lint's two main.js entries
    and no new boundaries rows; every check again (DESIGN's R7a notes).
  - [x] **R7b** built: `input/` (`human.js`, the local human with its derived
    mode, the selection, the commands and the buttons' intents; `picking.js`;
    the deploy, move, shoot and charge tools beside `charge-end.js`), `ui/*`
    (the HUD, the action buttons, the tray, the log, the card, the tooltip,
    the banner, `theme.js` with `paintSeats`, the title, result and help
    screens), `present/hud-model.js` (R6b's `refreshUI` and `refreshRings`
    rule as a model: the buttons still go disabled while the table plays;
    `end.ready` computed for F3, not shown), `view/index.js` (the view made in
    its order, its handlers and `rebuild`), `app/flow.js` (the title's table,
    a battle, the Session's sink, the handlers merged, the HUD's refresh) and
    `app/boot.js` (the URL, the page made in its old order, the `?debug`
    block, its surface unchanged); main.js is its boot, 1,648 lines to 8. The
    fallback handler is the player's own default. A snap mid-battle now leaves
    the HUD right (End and Auto up for a local seat's phase, the end screen
    past the end), held by the new `sim/hud-check.mjs` (and its self-test).
    The unit card, while the table is behind, tells what each unit did this
    turn and its cover as of the last action or stop for a decision played
    (a change a player can see, the lead's R6b decision; P-present holds it
    to a fold of its own; the fixer's round added the stops, so a
    deployment's placements are in it as the battle begins).
    The title retains nothing per rematch: heap snapshots show its growth is
    V8's compiled code warming up, so `sim/rematch-memory.mjs` now judges the
    page's own heap a rematch (from snapshots) instead of a flat 2 MB on all
    of it. The tools that anchored on main.js moved with it (P-present's card
    edits, the snap check's, flag-lint's two ALLOW entries, hooks-inert's
    block). Fixer, round 2: a snap takes the local human's selection again
    from the snapped match (by id); `sim/hud-check.mjs` also snaps in the
    deployment and at a charge's end (twice: behind the roll, and again
    once the spots are shaded), and words the end screen it expects from
    the match's own game.over; P-prop holds the end screen's `resultOf` to
    that game.over; hooks-inert's self-test checks the working tree's own
    block; the spec's body says `onTrace` is the page's (§2.1, §2.2, §2.6).
    Checks, on the final tree: parity 40/40 on the core and on the page,
    P-browser over the whole corpus 40/40 (no battle run again), P-present
    40/40 (and its self-test, 53 of 53), P-prop (and its self-test, 17 of
    17), every standing check, in Chromium the snap check over the whole
    corpus (8,277 checks) and its self-test, `sim/hud-check.mjs` (17 snaps)
    and its self-test (4 of 4),
    `sim/rematch-memory.mjs` with and without `?lowfi` and its self-test, the
    title at 1200 ms R7a's pixel for pixel (`sim/title-shot.mjs`),
    `sim/terrain-shots.mjs` identical to R0, and the shipped page played
    rendered without `?debug` or `?fast`: watched battles to their end screen
    and back, with and without `?lowfi`, vs. the AI from each seat with real
    clicks (charges ended in the orange area and by Shortest move, Auto,
    Advance, End), and hotseat; no page errors (DESIGN's R7b notes, with the
    spec changes for approval and what R8 and F1-F3 inherit).
- [x] **R8 Netplay seams** built: `core/hash.js` (`stateHash`,
  `shadowState`), `CORE_VERSION = 1`, `match/envelope.js` (canonical JSON,
  at most 1 kB, `bodyOf`), `match/fold.js` (the `Folder`: seat, device, prev,
  the hash on a single seat's decision, out of band, the cap, the desync
  freeze with a report, skew, tamper, a quiet refold and a reset), the
  `LocalStore` keeping each entry as its text, and the Session folding
  through the Folder: every mode, so a game played alone goes through the
  validator that guards online play (`app/flow.js` names this device on each
  human seat and writes the start with the rules' versions). Parity folds
  the corpus through the Folder too, every entry an envelope. New:
  `sim/merge-sim.mjs` (P-merge, no Automerge: peers over an RGA list ordered
  as Automerge orders one, ops delivered in random causal order, every human
  log played by its seats' peers with junk, duplicates, stray fields, stale
  heads, out-of-turn, wrong-device and spoofed entries, same-seat forks and
  concessions; all peers agree, on the single-process fold, which traces the
  corpus, each sink handed the match its events lead to; the cap at 5,000
  entries, the Folder's edges, same-seat forks in the deployment, and the
  desync drills: a peer with `hypot` an ulp off freezes with the others at
  the same entry, reported; R8's fixer's round 2 adds a drift late enough
  that its desync finds the author's match over, and a match that goes on
  past the others' end) and its self-test (41 broken match layers and a
  store that caches by index, R8's fixers' among them: a refold swapped in
  late, a decode that throws, the bare closing entry as the head, no turn
  or hash check, a hash that rejects, `legal()` before the hash, a tamper
  that thaws; an over match deaf to a desync or to a hashed entry on its
  last head, tamper by ids alone, a charge's end with no hash, the cap
  moved by one; round 3's: a Session or Folder that folds again from a
  sink's submit, a throwing sink leaving the Session deaf, an entry with
  no hash played, an over match frozen from any device, an older build's
  start folded, tamper by content alone, a seat's device no entry can
  carry, a start made inert silently, a stale error, a start without its
  seed reveal); P-prop's quiet folds hash alike; data-check's section 9
  (the versions, the Folder's spec constants, and what the hash reads);
  boundaries holds match/ to no clock, random draw, timer or module-level
  state.
  Nothing in play changed: parity 40/40 through the Folder and on the page,
  P-browser over the whole corpus, every standing check, and the shipped
  page played rendered without `?debug` or `?fast` (DESIGN's R8 notes, with
  the spec changes for approval, the refactor's three claims confirmed, and
  what N0, N1-N3 and F4 inherit). The refactor is complete.
- [x] **R8b Consolidation** (after R8; no rules change, the corpus
  byte-identical, `CORE_VERSION` 1). What the large battles need of the
  netplay seams, from their design's "R8 must allow" list: the Session's
  single flight (a submit from any sink callback queued as its body and
  written once the change in hand is folded, on the match as it then
  stands, or dropped with `sink.dropped` when no longer legal;
  `Folder.sync` and `Folder.push` not reentrant), `sink.settled` (once a
  change is folded: where an autopilot or an auto-End answers), kinds and
  fields (decode takes any safe whole number or boolean, nothing in
  match/ reads a kind's fields), a lint that no command field bears an
  envelope key's name or `t`, the sizes (one `MAX_BYTES`, the cap
  counting junk, the entry count exposed), a fold whose work per entry
  doesn't grow with the log (bar the per-change identity scan) (the store's `length`, ids from a counter, no copy of the list
  per entry, the refold behind one seam; `sim/fold-cost.mjs`), `stateHash`
  extensible (a feature's unit fields printed only off their defaults)
  and its format pinned under `CORE_VERSION`, and concede and desync the
  only kinds out of band; the setup's key whitelist waits for F8a/F11.
  R8's critic lows: P-prop's quiet folds and refolds held to the Folder,
  P-prop's Session cases for R8's three gate-gap mutants, and a rendered
  lane that places units by clicks (`sim/play-check.mjs`, the scratch
  lanes committed). Then every standing check on the final tree, the
  refactor's closing record (DESIGN's R8b notes, its results table).

**Multiplayer and features.** Online play first; the large-battle work
follows N3.

- [x] **N0** Cross-engine maths (`sin`/`cos`/`atan`/`atan2` in `dmath`).
  fdlibm's algorithms, as Node's V8 runs them, in plain JS: Node's own bits
  (so no battle changed and nothing was re-recorded), and the same bits in
  Chromium, whose build of V8 rounds `sin` and `cos` its own way. The rules'
  approximated `Math` calls and `**` are banned by `sim/boundaries.mjs`;
  `sim/dmath-check.mjs` holds dmath to Node's bits (and to Chromium's with
  `--browser`); perturb on `sin,cos,atan,atan2` moves 24/24 PIN battles and
  0/24 now; the corpus's `webShadow` is retired, P-browser checking
  Chromium against Node's shadow (DESIGN's N0 notes).
- [x] **F3** The End-phase button lights up when nothing is left to do.
  End is an ordinary button while units can still act, and lit (with a
  slow glow, still under reduced motion) once none can, and as Begin battle
  in the deployment; `sim/hud-check.mjs` holds the page to it (DESIGN's F3
  notes).
- [x] **F1** Playing a side puts your side of the board in front of you
  (the serpents included); the presets take the board as an argument.
- [x] **F2** Spectating is viewed broadside: one army left, one right.
  (F1 and F2 landed together: a battle opens behind the one seat played
  here, else broadside, fitted to the screen and the board; the 🧭 button
  and V step through behind your army, broadside, behind the other army
  and an overview, and Home goes to the overview. DESIGN's F1/F2 notes.)
- [x] **F4** After round 5, the win screen offers **Keep playing** (a vote);
  `legal()` takes optional and boolean fields; no Keep playing past 80% of
  the log cap. (Every battle with a human seat asks after its last round and
  each overtime round; play goes on only on everyone's yes. `CORE_VERSION`
  2. Two logs that vote joined the corpus, 42 battles, recorded on F4's
  code, to which the PIN moved; `legacyMode` retired, every page runner
  holding the page's battle to the log's setup instead. DESIGN's F4 notes.)
- [x] **N1** Real Automerge in Node: two- and three-peer tests. (The
  match store over an Automerge document, `net/automerge-store.js`; the
  corpus played by two and three automerge-repo peers over lagging links,
  same-seat forks included, every peer agreeing with a fresh fold and the
  corpus battle, `sim/peers.mjs`; the fold linear over it, fold-cost
  `--store automerge`; a 465-entry log's document 11 KB. DESIGN's N1
  notes.)
- [x] **N2** Online play: lobby, join by link, joint dice seed, presence,
  desync report. `verifyStart` checks your whole seat (race, controller,
  device, name, nonce); names up to 24 characters and 48 bytes. (The
  claude.ai artifact blocks outside connections, so online play works from
  GitHub Pages or a local server.) (Play online makes a match and its
  link; the lobby seats both players, Ready starts the battle from the
  host's page with dice from its secret and the guest's nonce; each page
  plays its own seat, others watch; the net badge, the opponent's ghost, the
  elastic catch-up, "History changed", the desync dialog with its report,
  Rematch; and a closing check, each seated device's `final` hash, which a
  drift inside the battle's last entry can't pass. Automerge loads only for
  online play. `sim/net-check.mjs`, `sim/lobby-rig.mjs` (Chromium, with a
  local sync server), `sim/bundle-check.mjs`; merge-sim and P-peers play
  every seat with the closing check on. The review's nine findings fixed:
  a concession racing a move no longer freezes an honest match, a bad
  lobby is never started from, guests draw their own nonces after the
  host's commitment. DESIGN's N2 notes.)
- [x] **N3** Spectating, rejoin, scrubbing, replay export, tamper alarm.
  (A replay bar: a page watching an online battle has it at Live, and
  anyone gets it once a battle is over or frozen; its slider scrubs to any
  move, ⏮ watches from the start at the page's speed and catches up with
  a battle still going on, 💾 saves the battle's log as a replay file,
  which the title's 📼 opens again. The tamper alarm across reloads: a page
  keeps the entries it accepted, in IndexedDB once the document is on
  disk, and holds the log to them when it comes back. Rejoin: "Back in the
  battle: N moves since you were last here", and the title's Continue for
  the last online battle still going on. `sim/replay-check.mjs` (Node), four
  lobby-rig cases, merge-sim edges. DESIGN's N3 notes.)
- [x] **F6** Race selection with a mini 3D diorama of each race's figures,
  on a battle-setup panel that a mode button opens (later steps add the
  terrain, the battle size and the army to it). It makes mirror matches
  reachable from the title, so it also takes R2's leftovers: seat names
  that read the same in a mirror (roll-off rows, log lines, AI hint) and a
  stronger mirror cue on the table.
  (The panel, `ui/screens/setup.js`; the picker, `ui/screens/races.js`,
  also in the lobby's seat cards; the figures drawn by the table's own
  renderer into each window, `view/diorama.js`, with a unit's stats under
  the pointer. A mirror match names each seat by its edge too, and the
  east army gets thick rims and filled labels. The Chromium harnesses press
  the panel's Start; mirror-check holds the names. DESIGN's F6 notes.)
- [x] **S0-S3** Scale hygiene: bounded scans, an LOS broadphase, hoisted
  invariants, one forbid mask, a plan memo inside one apply. Byte-identical,
  no bump; `sim/scale-bench.mjs` and a Grand test fixture.
  (The AI's scans walk only the box a plan can reach, line of sight tests
  only the chunks binned where it passes, a plan is made once per apply.
  `sim/scale-check.mjs` holds every scan to the old one on classic and the
  Grand fixture; a Grand AI battle 483 → 366 ms here. DESIGN's S0-S3 notes.)
- [x] **F10a** Drag-select a group (Shift-drag; ▭ Select on touch), the group
  bar, and group move, approach, fire, charge and place as ordinary commands.
  A group move pins a ghost formation; a click on its flag (or Enter, ✓)
  sends it. No rules change.
  (Box, Shift-click, long press, double click by type, Q and Ready N, Tab,
  saved groups, Space; a ground click pins, Alt-drag pins a line, the flag
  or Enter sends, a right click drops; +D6; the bar beside the card; the
  picker's touch fallback; the group in presence as `sels`. P-macro
  (`sim/macro-check.mjs`), `sim/input-check.mjs` and lobby-rig's `group`
  case. DESIGN's F10a notes.)
- [x] **V1** Batched playback: units walk together, a batch's advance dice in
  one row.
  (A seat's walks 0.15 s apart, those after a wreck held back to its last
  smash; one tray row; the flags turn as their units arrive; ⇉ for one at
  a time. An AI movement phase 6.0 → 2.6 s on classic, 19.5 → 4.5 s on the
  Grand fixture (the longest 7.3 s, under 8). A Grand battle 558 → 349 s
  stays over its 200 s: the shooting, unbatched, is about half of it.
  `sim/playback-check.mjs`. DESIGN's V1 notes.)
- [x] **Later (V1's open budget):** a Grand AI battle plays about 349 s
  against §4.2.1's 200 s; batch a seat's volleys (or pace a watched
  battle's shooting faster) before F8b's Grand boards ship.
  (Settled by F8b: attack batches, a seat's shots and blows in one tray
  0.3 s apart, and a 0.25 s banner for an empty phase; a Grand AI battle
  watched plays 174 s on average, 185 s at most, on the grand mission, and
  177 / 186 s over the `scale/` pairs. By PACE.cost's flat 0.9 s a banner,
  which the online backlog's estimate still counts, 205-215 s.)
- [x] **F10b** Autopilot in the rules: `pilot {m}`, the AI playing the
  units you choose.
  (`CORE_VERSION` 3; the mask's bits the seat's units in `G.units` order;
  the AI's phase filtered, the phase left open; the group bar's 🤖 Auto
  these. P-auto (`sim/pilot-check.mjs`), P-pilot in P-prop, input-check's
  Auto these, the human-bot's `pilot` policy; four `pilot/` logs, recorded
  on F10b's code in a commit of their own, the corpus 46 battles. DESIGN's
  F10b notes.)
- [x] **F10c** Standing orders: March, Attack, Hold and Autopilot, carried
  out at End or Go; badges, counters, optional auto-End. Left from F10a:
  the pinned formation's handles (move, rotate, stretch into a line: the
  only way to make a line on touch), its faint paths. Left from F10b:
  merge-sim's bursts of 25 macro entries from one seat with junk between.
  (The order book, `input/book.js`; the planner, `present/standing.js`;
  `runOrders`; the bar's verbs, the card's row, G T H P X O; End's ⟳ badge,
  ▶ Go, Orders N, cyan rings, label badges, order lines; Autopilot first
  and Auto-End; `ords` in presence; the pin's knobs and paths; merge-sim's
  `burst`. P-macro's standing orders and march scenarios (98% arrive),
  input-check, the lobby rig's orders at End online. DESIGN's F10c notes.)
- [ ] **Later (F10's, with F8b):** ghosts planned a few per frame once boards
  grow; March from the minimap; the play-report's F10b row (an army on
  `pilot` every phase reaches melee by round 3 in 3 of 4 Grand battles);
  §4.2.6's richer cues (a race voice and a ring pulse as an order is given,
  floating text and a minimap ping as one finishes, a dashed turning ring
  for autopilot).
  (F8b settled the first three: `previewSteps` and the GhostPlanner, March
  by a right-click or long press on the minimap, and the F10b row, 4 of 4
  over the `scale/` Grand pairs (three first fights in round 3, one in 2).
  Open: §4.2.6's richer cues; the ghost planner's first plan on a fresh
  page, 20-31 ms in one frame.)
- [x] **F8a** Missions choose the board: `setup.mission`, the setup
  whitelist, `G.board`, the table rebuilt per match. Only the classic
  mission yet.
  (`CORE_VERSION` 4; `checkMission`; `SETUP_KEYS` and `SEAT_KEYS`; `G.board`
  at every BOARD site; the view's `setBoard` (table, objectives, overlay,
  dolly, far plane, fog, shadows) only when the board changes; `?mission=`;
  the lobby's `mission`. P-mission in P-prop, P-board
  (`sim/board-check.mjs`), camera-check's mission boards, data-check; the
  Grand fixture on `MISSIONS.classic`. DESIGN's F8a notes.)
- [x] **Later (F8a's, with F8b):** the mat's tiled detail texture and shadows
  fitted to the view (a larger board's are coarser until then).
  (Built in F8b: a detail tile per 4", and the shadow camera fitted to the
  view's ground once the camera rests, on a board larger than classic's.)
- [x] **F11a** Army lists in the setup: each seat names a preset or a list of
  unit counts, checked against the mission's points limit and slot table;
  prices (`cost`) tuned by `sim/army-sim.mjs`; AI seats play presets (or a
  seeded random list); the classic battles unchanged.
  (`CORE_VERSION` 5; each unit's `cost` and each race's `roster`, the
  `classic` preset derived from its army, `MISSIONS.classic.list` and
  `checkMission`'s list checks; `core/army.js` (`armyOf`, `checkList`,
  `autoList`, the eight refusals in seat-major order); `fullSetup` filling
  in each seat's `army`, `newState` fielding the lists; `?armies=` (F11b's,
  built as the checks' door); the card's cost, the group line's points
  standing. `sim/army-sim.mjs` (`--check`, `--fit`, `--self-test`): the v6
  prices pass unchanged, the Bushtails 52.4% ± 1.2 and every unit within
  its band. P-army and P-mission's refusals in P-prop, data-check's rows,
  flag-lint's one-reader rule, boundaries' pure door, merge-sim's `lists`;
  six `army/` battles, recorded on F11a's code in a commit of their own,
  the corpus 52. The review's nine fixes, `RULES_ID` leaving out the size's
  name. DESIGN's F11a notes.)
- [ ] **Later (F11a's, with F8b):** the Grand fixture's cap lists cost
  1,575 and 1,670 against Grand's 1,500 (under `--caps` the fixture lifts
  its limit to 2,000): when the fixture retires, build the cap lists within
  the limit or give scale-bench's cap rows a test mission with it lifted.
  army-sim's fit plays no list over the limit (§4.2.8.2's 80-120% budgets
  clamped at 100%); a copy with the limit lifted would fit the top too, if
  F8b's retune wants it.
- [ ] **F11b** The Muster screen: build an army with +/− and a points bar,
  presets, Random, lists saved on the device; hotseat builds in turn;
  online lists ride in the lobby, unseen until the battle starts; changing
  race resets the army.
  (Built at F11a: the `?armies=` door, checked by the fold's own `armyOf`,
  a race change on the panel already dropping that seat's list; the unit
  card's cost and the group line's points standing. Still F11b's: the
  cost on F6's race picker, the deployment's points banner.)
- [x] **F7a** Climbable fortifications: decks, stairs and ladders sized for
  whole squads; ramparts, bastions, watchtowers, timber platforms and a keep
  on the centre objective; each side's own rampart at its zone's front (the
  `fortified` set, on every mission).
  (`CORE_VERSION` 6; the deck, stair, ladder and post pieces and five
  recipes, exact point mirrors, `gatesOf`; `SETS.fortified` with the works,
  the fort phase and the area scale; the nav's height layer (floor, links,
  cliff, levels, gates) behind `hasHeight`, and height in sight
  (`sightInfo`), engagement, forbid, charge, control, blast, smash and
  pile-in; `climb`; `levelDist` and the height term; `y` in the events and
  the mirror; decks, stairs and ladders drawn, units at their height,
  climbs in file, drop lines, the deck overlay, picking tops; the terrain
  line, `?terrain=`, the lobby's terrain; the title stays classic.
  terrain-check's fortified rows and P-climb, P-height and P-level,
  data-check's set and footprint rows, scale-bench's fortified rows,
  `sim/play-report.mjs`, corpus-add's `--mode watch`, `--terrain` and
  height needs; the `fort/` corpus, 8 battles. DESIGN's F7a notes. The
  review's fixes: `levelDist` exact over the gate graph with decks as
  shortcuts and stairs walked down, `scanBox` widened by the ladders'
  savings, fliers' straight lines, a charge's other enemies by level, the
  planner's fields climbing, walks on the table's tops; the play-report's
  row judged by a move and the AI tuned to it; P-scan fortified, P-level
  on Grand-sized boards, P-height's scenes, rematch-memory's
  `--terrain`; `fort/`'s AI pairs re-recorded.)
- [ ] **F7b** Parapets with cover at deck level; reading heights: drop
  lines, the climbing cost, line of sight with its reasons, see-through
  walls. F7a left it: the parapet piece (a comment block in recipes.js, each
  recipe noting where its own go) and its level-aware cover raster (the
  rasters already apply by `base`); `sightInfo` (`{ok, block, obscure,
  cover, high}`) for the ray and its reasons; `nav.linkCostOf` for the
  move tooltip's climbing cost; cliff rims; see-through occluders and Alt;
  `blast.land` with no `y` (the view takes a template's height from its own
  tops); the play-report's F7b row (a shooter fires from a deck in ≥ 50% of
  `fort/`), with `fort/` re-recorded. Drop lines and the "▲2"" label landed
  in F7a.
- [ ] **F7c** Timber platforms that collapse under their defenders. (F7a
  draws the platform as an open slab on braced posts while its deck's
  line-of-sight body is solid from the ground, as the piece table says: a
  thin timber body, or the view closing the gap, goes with the posts made
  breakable.)
- [x] **F8b** Field (60×40, 1,000 points) and Grand (80×56, 1,500 points)
  battles: their presets and list limits, prices retuned on the real
  boards, the `open` set, a minimap (March from it), semantic zoom, terrain
  tiles and LOD.
  (6507f10; `CORE_VERSION` 7, F7a's 6 beside it; the classic corpus
  byte-identical. `field` and `grand` with their lists and every race's
  ×2 and ×3 presets; `open`, classic's pieces scaled with the area, a rock
  box at the centre (the tower ring walls the objective off from every
  squad); the fight guard `max(30, 2·units + 2)`. One price table couldn't
  hold all three sizes, so each larger mission's list carries its own
  `prices` (§4.2.8.2's fallback); army-sim's gates pass at Skirmish and
  Field (the review re-fitted Field on three seeds pooled and judged it on
  a fourth: Skirmish 51.7%, Field 48.2% on seed 4444); Grand is reported,
  not judged (the next item). Terrain
  tiles, shadows fitted to the view, the mat's detail, figure LOD, chips,
  the minimap and the roster: a Grand whole-board frame 1,562 → 351 main
  draw calls. The camera behind your half at 45-46", batch framing, the
  bookmark; the size on the setup panel and in the lobby. The Grand
  fixture retired; connectivity 1,000 of 1,000 boards; render-bench;
  play-report's F10b row 4 of 4. scale-bench's Grand battle sits at
  1.0-1.2× its 350 ms on `open` already: the AI count budget's trigger,
  for F9b. The `scale/` corpus, 4 Field and 4 Grand AI pairs and 2
  human-bot logs on `open`, in 2223665, the corpus 56 battles. **For F7a's merge:** both missions' sets become
  `['open', 'fortified']` (the refusal then reads "fought on open or
  fortified"), and half the `scale/` AI pairs (2 Field, 2 Grand) are
  re-recorded on `fortified`, with army-sim's Field and Grand gates and the
  connectivity rows run there too. Left: the gates below, in an item of
  their own. DESIGN's F8b notes.)
- [ ] **Grand rebalance.** At Grand the points don't bind the Bushtails'
  lists (the slot table and the 90-model cap do: points bind 14 of 1,000
  Random lists, a median 1,325 spent, against the Coil's 900 and 1,480),
  so they field less than the Coil and score 41-48% on `open`: the table
  as shipped 45.4%, 44.1% and 47.6% on seeds 1111, 2222 and 4444 (N 625,
  the band ±6); the tables tried in F8b's review 44.3-44.6% on seeds
  1111, 2222 and 3333 pooled (N 1,875), and the one of them that passed
  its per-unit gate there 42.2% and 41.0% on seeds 1111 and 5555 alone,
  and 46.2% on 4444 with 7 of 12 units outside their bands (a seed it
  wasn't tuned on). The per-unit fit at Grand is weakly identified (columns
  move 40-100 points between seeds; standard errors of 24-87 points a
  unit). Options, a design call: move the slot table or the presets at
  Grand, a `prices` override on the Coil (the simplest that passed pooled
  seeds read as nonsense: a hero at 5), or a better-identified fit (more
  seeds; lists that vary the heroes). Until then army-sim reports Grand
  and judges Skirmish and Field. Playtest first. (DESIGN's F8b notes, the
  review.)
- [ ] **Later (F8b's, its migration row's open gates):** F8b is ticked for
  what it built and checked; these gates of its row in DESIGN §4 (the
  migration table) are not done, and stay open here until they are
  (F8b's review): army/'s Field and Grand pairs (army/ lives on main with
  F11a's corpus: recorded at the merge, in a commit of their own);
  pilot/'s two Grand logs; a Grand battle played on a phone by hand; the
  minimap's deck rims, stair arrows and ladder ticks (F7a's look, at F7a's
  merge).
- [ ] **F9a** Vehicles: the Bushtail War-Cart, a round transport carrying two
  squads; embark, disembark, wrecks and bail-outs; riders loaded at
  deployment; up to two a side in Field and Grand.
- [ ] **F9b** Long hulls: the Coil's Shell-Back Howdah, three segments that
  turn where there's room; a facing, set with a rotate handle or [ / ].
- [ ] **F9c** Firing decks on every hull: riders shoot from the deck.
- [ ] **F5a** New races: insectoids (burrow, swarm) and bird-people (fly,
  swoop), each priced for the army builder against the other races, with
  their Field and Grand presets. (Moved behind F9c after F8a, the user's
  call: the big boards and vehicles come first.)
- [ ] **F5b** The new races' vehicles: the insectoids' Brood Beetle and the
  bird-people's Sky-Basket (which may land on ramparts).
- [ ] **F9d** Siege towers that unload onto ramparts (round for every race
  in v1).
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
6. *(answered)* **Online play comes first**; the large-battle work follows
   N3. Race selection stays right after N3.
7. *(answered)* Battle sizes are **Skirmish 40×28, Field 60×40 and Grand
   80×56** with a **points-based army builder** (500, 1,000, 1,500 points;
   5, 6, 7 rounds); the fixed lists ×1, ×2, ×3 are presets.
8. Standing orders live **on your device** (free to improve; they act only
   while you play). Orders kept in the match are the documented fallback.
9. Standing orders act **when you press End (or Go)**; "autopilot first" is
   a local setting, off.
10. A march that arrives **holds**; an attack whose target dies goes on
    **autopilot**; a march blocked two turns **waits for you**.
11. Auto-End (a 1.5 s countdown when only ordered units can act) is a
    setting, **off** by default.
12. Stairs for all but ground vehicles, **ladders for infantry**; squads
    stand on wide walks as a group, no lining walls; no to-hit bonus for
    height.
13. Each side starts with **its own rampart** on a fortified board.
14. *(answered)* **Each race's vehicle has its own shape**: a round War-Cart,
    a long Shell-Back Howdah, and (with the new races) a Brood Beetle and a
    flying Sky-Basket; at most two a side in Field and Grand, none in
    Skirmish. (This covers the transports; siege towers are question 26.)
15. Walks are **batched**, with a "one at a time" setting.
16. Grand is offered on phones, **with a note**.
17. *(answered)* Left-drag **orbits**; Shift-drag (▭ on touch) selects; a
    long hull turns by its handle or [ / ].
18. **No undo** of group orders in v1; a group move pins and needs a second
    click.
19. A siege mission comes **later**, after F9d.
20. *(answered)* Army lists are hidden **by courtesy** until the battle
    starts; sealed lists come with N4 if strangers play.
21. Units are bought **whole**, at their fixed size.
22. Heroes are **not unique**: a Field army may field two Elders.
23. A long hull's pivot costs **0.25" per 45° for the Howdah**, nothing for
    the Beetle.
24. The Sky-Basket **lands on rampart and keep tops** and unloads there.
25. The insectoids' vehicle is the **Brood Beetle**; a burrowing Sapper Grub
    may come later.
26. *(answered)* Siege towers are **round for every race** in v1 (each in
    its race's look); towers on each race's own chassis may follow.
27. *(answered, then revised after F8a)* The new races arrive **after the
    firing decks** (F5a after F9c, then their vehicles, F5b): the big
    boards and vehicles first, the user's call. (First answer: F5a right
    after F11a.)

## Done

- Charge destination picking; clean table on a new game; inside-out serpent
  bodies and open shells fixed; exact pathfinding distances; Auto race
  closed.
- Battles replay exactly (logic RNG, logical positions, sampled wrecking,
  trace, `?fast`), plus the parity tooling in `test/` (moved to `sim/` in R0).
