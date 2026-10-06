# Tails & Scales: final refactor specification (multiplayer-ready)

Status: final, for the lead engineer to implement. It supersedes the four proposals (netcode-first, testability-first, content-first, experience-first) and `design/pre-multiplayer/experience-first.md`.

Code references are to HEAD `861a1eb`. In this checkout the determinism commit is `44cf4b2`; the brief calls it `ebfcd56`.

---

## 0. Thesis, base, and the decisions that settle the disagreements

**Thesis.** A battle is a pure function of `(setup, accepted command log)`.

- **The core is a synchronous reducer.** It applies a command, runs on to the next decision a human must make, and pushes plain-data events. It never awaits anything.
- **The view replays those events.** A presenter plays them at animation pace.
- **Online play shares one Automerge document.** It holds the lobby and an append-only command log. Every peer folds the log through the same core, and the AI runs inside that fold.
- **Every mode is one `Session` over a store.** vs-AI, hotseat, watch, online play, spectating, rejoin, scrubbing and replays all work this way. The store is a `LocalStore` (a plain array) or an `AutomergeStore`. Automerge is only the transport and persistence for the log. It never holds game state.

**Base.** The structure and test backbone come from **testability-first**, the winner for two of the three judges. Its strengths are a lean pure core, flags-not-hooks race data, merge-sim, property tests and a widened corpus.

The **match layer comes wholesale from netcode-first**. It is the only fold that stays correct under concurrency:
- seat and device checks;
- per-seat heads for simultaneous decisions;
- `h` checked only where a single seat is being waited on, and checked before `legal()`;
- `ImmutableString` entries;
- size caps and a tamper check.

Specific ideas are grafted from content-first and experience-first. They are named where they appear.

### 0.1 Facts this spec stands on (all verified)

| Fact | Evidence |
|---|---|
| Today's `main.js` runs unmodified in Node under the scratch fake-DOM/three-shim harness, and reproduces the browser baselines byte for byte | I re-ran seed 64 / dice 89 this session: identical, 0.7 s. The judges ran all 12. |
| No logic runs while a visual is being awaited, so replacing each `await` with an emitted event in the same position keeps the logic-RNG order | Input is gated (`S.busy`, `phaseResolve`, `myTurn` 1348). Per-frame code only reads state. Tween callbacks touch only visuals or `Math.random`. Scenery `hurt`/`destroy`/`collapse`/`topple` change logic state instantly. The walk's smashing is path-sampled (529-545). |
| The AI is part of the dice stream | Its tie-break `rng()*0.05` per valid lattice cell (ai.js 133) accounts for most of the 3.3-4.8k draws per battle. |
| None of the 12 baselines ends in a wipe-out. The "can't find a way" charge branch (977) is unreachable. | Both callers check `chargePlan` first (click 1384, ai.js 270), and `doCharge` recomputes the same plan. Keep the branch as defensive code; it needs no coverage. |
| `freeSpot` returns cell centres | 367-382. So `place {u, c}` reproduces deployment exactly. |
| Deploying both sides at once leaves the trace unchanged | No trace line sits between the two "deploy your army" logs (1933-1944). Placements commute: the zones are at least 24" apart, and the clearance is only 0.4". |
| `ImmutableString` is exported by `@automerge/automerge` 3.5.0 | Checked. Plain strings in a list are collaborative text and can be edited character by character (`judge-str.mjs`). |
| Approximated `Math.*` calls in logic files | main.js: hypot 20, sin 25, cos 8, atan2 11. scenery: hypot 11, sin 14, cos 12, atan2 2, atan 1 (a hedgerow's yaw, 482). ai: hypot 12. nav: hypot 7, sin 1, cos 1. Some of these are view code that still lives in those files. `exp` (2) is view-only. |
| `npm run verify` builds nothing and accepts extra files under `dist/<slug>/` | scripts/verify.mjs. A `.wasm` asset is fine. |
| Node's and Chromium's builds of V8 disagree in the last bit of `Math.sin`/`cos` for ~3% of inputs and `pow` for ~10%; `atan`, `atan2`, `exp` and `hypot` agree | Found at R0 over 100k samples. Node 20, 21 and 22 (V8 11.3 to 12.4) agree with each other on all seven; Chromium 141 (Playwright 1.61's `chromium-1194`) differs. So the split follows Chromium's build of V8, not the V8 version (a newer Chromium was reported to change `atan` too). Terrain built with sin/cos then sits an ULP apart in the two engines: 31 of the 40 R0 battles have a different Chromium shadow while their traces match byte for byte. So "the V8" is two engines: the parity shadow is compared per engine (`webShadow`), `pairs.json` names the Node and the Chromium that recorded it (`engines`), and a Chromium (Playwright) upgrade is followed by `parity.mjs --browser`, then `--record --browser` if only `webShadow` moved. |

### 0.2 Conflict resolutions

| # | Topic | Decision | Reason |
|---|---|---|---|
| 1 | Layout | Consensus code lives in `core/` and `data/`. `match/` is the pure netplay rules. `net/` is the only code that imports Automerge, and it is reached only through `import()`. Node-only code lives in `sim/`. | The boundary is enforceable by directory. The two-peer tests can import everything except the wasm bootstrap. |
| 2 | Fold check order | envelope → duplicate → turn (seat is pending) → device → `prev` → `h` → `legal()` | Hash before legal: a desynced peer's command is *reported*. With legal first (testability-first) it is silently rejected, its successors go stale, and the game stalls with no report. Judge 3 preferred legal first to stop a forged entry freezing the match. I rejected that: at trust level L0 a forger can already play a *legal* move for the victim, which is worse than a freeze. Signatures (N4) are the real fix. |
| 3 | Scope of `h` | Required on single-seat decision kinds (`phase`, `chargeEnd`). Never present on simultaneous kinds (`deploy`, `roundLimit`) or out-of-band entries. The rule is by decision **kind**, not by how many seats are still pending. | Otherwise every concurrent online deployment raises a false desync. Keying it to the remaining seat count would break when one seat finishes deploying first. |
| 4 | Entry encoding | Canonical JSON (sorted keys, integers and booleans only) inside `A.ImmutableString` | Atomic and about 4× cheaper to append than objects. Fields of objects can be mutated after acceptance. Plain strings are editable text. |
| 5 | Command vocabulary | Specific `t` names (`move`, `shoot`, …). The fold never switches on `t`, except for `open`, `start`, `concede` and `desync`. | Readable, one legality rule per name. New actions such as `burrow` are core changes plus a `CORE_VERSION` bump. The wire format and the fold stay the same, which is what content-first's generic `act` was meant to buy. |
| 6 | `concede`, `desync` | **Out-of-band** entries: no `prev`, valid at any time after `start` from a seated human seat's device, terminal at their position in fold order | Fixes netcode-first's "any seat, any time" contradicting its own seat gate. |
| 7 | Who appends `start`; where the seed commitment lives | The creator. The commitment is the immutable first log entry `open {commit}`, not a mutable lobby field. | The creator holds the reveal `a`. A last-writer-wins lobby field could be overwritten after the fact. |
| 8 | Seeds | The board seed is the creator's visible choice, as the title screen's "New battlefield" is today. The dice seed is a joint commit-reveal. | The board is not hidden information. Only the dice stream must be grind-proof. |
| 9 | AI in online games | Runs inside the fold on every peer. AI seats append nothing. `hold` is internal to the AI and never on the wire. | All 12 traces stay valid, no host has to be online, and nobody can play the AI for their own benefit. Cost: AI code is rules code. |
| 10 | dmath timing | The two-argument `hypot` (V8 formula port, proven trace-neutral on 12/12 and 5M samples) lands at R1. Three-argument `hypot` lands at R1 only if it matches V8 exactly, otherwise at N0. `sin`/`cos`/`atan`/`atan2` land at **N0**. | Single-engine parity doesn't need them. Netplay across engines does. **Cross-engine determinism only requires dmath to be pure JS over exact IEEE operations. Matching V8 bit for bit only avoids one re-baseline.** If a V8-exact port proves elusive, take `CORE_VERSION 2` and re-record once, in a commit of its own. |
| 11 | Nav cache | Explicit `refreshNav(G)` at exactly today's call sites (477, 572, 816, 939, 999, plus setup at 1897). No lazy cache. | testability-first's lazy cache claim is unproven. `inCover` reads `nav.cover`. |
| 12 | Forking and fixtures | Refold `(setup, entries.slice(0, k))`. `structuredClone(G)` is not required, so `G` may hold `NavGrid` and `Terrain` instances. Invariant: **between commands, `G` holds no in-flight control state** (no promises, generators or pending closures). | Event sourcing gives forks for free, in at most 0.3 s. |
| 13 | Abilities | Flags on data, each read by exactly one rules module, plus a lint. content-first's hook and registry framework is deferred. | 4-6 new mechanics don't justify a framework inside the parity window. Hooks would also have to reach `expected()` and the AI. |
| 14 | `RULES_ID` | Adopted from content-first: a hash of the rule-bearing data, carried in `start` | A stat retune then makes old matches visibly incompatible instead of silently desyncing. |
| 15 | Display positions, event-driven labels/flags/VP | From **R5**, the first step where actions become synchronous, not at the view decomposition | `animateUnits` lerps toward `u.pos` (1961-1965), and `animateObjectives` polls `controlOf` (2020). Without this, figures glide straight to the end of a move through walls. |
| 16 | Human-path baselines | Recorded at **R0** from the legacy code, in the netplay command format (netcode-first M0). Recording uses an aggressive wipe-seeking policy, a widened AI corpus, admission only when Node and Chromium agree, a swapped-die mutation check, and a full-precision shadow snapshot (judge 3). | Every risky step, including the charge split and simultaneous deploy, is then checked on human flows against pre-refactor behaviour. |
| 17 | Engine rewrite | Built beside the old loop. Switch only when the headless fold matches every baseline. | R6 is the riskiest step. |
| 18 | Preview safety | `legal()`, hover previews and the HUD model run under `rng.lock`, where a draw throws. A property test checks that `rngState` never moves. | The strongest guard against UI code shifting the dice. |
| 19 | Feature 4 semantics | `setup.overtime: 'never' \| 'vote'`. It is absent, meaning `'never'`, in every baseline and in `?watch`. Voters are the human seats. AI seats follow. Continuing needs a unanimous `more`. The vote is asked after every round ≥ `rounds`. A wipe is final. Watch mode has no overtime in v1. | Keeps parity, and keeps `start` free of a seat −1 "host voter". |
| 20 | Presence | Who is here (seat or spectator), `{head, hash}` and current selection, sent on change plus a 5 s heartbeat. No cursor streaming. | Cross-checks spectators. 10 Hz through a public server is waste. |
| 21 | Fold slicing or Worker | None in v1. The worst case is about 1 s on a phone for a whole AI battle, shown behind a "Setting up the battle" veil. | Simplicity. Results never depend on slicing, so it can be added later. |
| 22 | State in the doc | None: no snapshots, no derived state | Unvalidatable, forgeable, and it bloats the doc. |
| 23 | Test location | `packages/tails-and-scales/sim/`, never bundled (Vite only follows `index.html`'s graph), run by hand like thumbnails | CI stays `npm run verify` only (CLAUDE.md). |

---

## 1. Directory tree, responsibilities, function mapping

### 1.1 Tree

```
packages/tails-and-scales/
├─ index.html, style.css          shell; race names/colours injected by ui/theme.js (today hard-coded: index.html 14, 21, 53-56; style.css 7-10)
├─ main.js                        ~10 lines: import { boot } from './app/boot.js'; boot(location)
├─ core/                          CONSENSUS · pure · synchronous · runs in plain Node
│  ├─ index.js                    the public API (§2.2): createMatch, legal, apply, pendingSeats, stateHash, shadowState, q, CORE_VERSION, RULES_ID
│  ├─ version.js                  CORE_VERSION (manual int); RULES_ID = cyrb53(canonical(rule-bearing data))
│  ├─ dmath.js                    hypot, hypot3 (R1); sin, cos, atan, atan2 (N0). Only exact IEEE ops (+ − × ÷ sqrt abs floor imul)
│  ├─ rng.js                      createRng(seed) → {a, n, h, locked}; draw(r); rngState(r) (same 'n#h36' string); lock/unlock
│  ├─ util.js                     mulberry32 (layout stream), lerp, pick, rr, deepFreeze, cyrb53, canonicalJSON
│  ├─ rules.js                    BOARD…AURA, PHASES, d6(G), roll(G,n), passes, clamp, pD6, p2D6, woundNeed, saveNeed, hitNeed, attackCount, expected
│  ├─ match.js                    newState(setup), seat helpers (makeSeats, ctrl, edgeOf, raceOf), refreshNav(G)
│  ├─ units.js                    formation, makeUnit (logic), relayout (logic), setUnitPos
│  ├─ deploy.js                   placeOk(G,u,c), freeSpot, deployArmies
│  ├─ queries.js                  alive…isEngaged, mx/mz, eyeY/chestY, inCover, sight, leadership, controlOf, canAct, anyCanAct
│  ├─ actions/move.js             moveMode, forbidMask, movePlan, validEnd, nearestValid, resolveWalk, smashAround, doMove, doAdvance, hold
│  ├─ actions/shoot.js            canShoot, shotInfo, shootTargets, doShoot, blastVolley, eruption (was thornburst), blastLands, mesmerize
│  ├─ actions/damage.js           damage, closeRanks, killModel, unitDestroyed
│  ├─ actions/charge.js           canCharge, chargeTargets, chargePlan, chargeSpots, declareCharge, finishCharge
│  ├─ actions/fight.js            fight, fightPhase          · actions/morale.js  moralePhase, flee
│  ├─ engine.js                   step machine (battle/playerTurn unrolled), advance, finishAction, checkWipe, scoreRound, gameOver, runAI
│  ├─ commands.js                 HANDLERS[t], legal(G, seat, body)
│  ├─ journal.js                  emit, log, write, traceState, pendingLog (quirks preserved)
│  ├─ hash.js                     stateHash(G), shadowState(G)
│  ├─ nav.js                      NavGrid (= nav.js on dmath; + floor/step/cliff for F7)
│  ├─ terrain/terrain.js          Terrain: chunks, add, generate (clear, then recipes' scatter), los, blast, hurt, destroy, collapse, rubble, topple (logic; emits terrain.*)
│  ├─ terrain/recipes.js          modules column, tree, hedge, boulder, crate, mushroom, floor; FEATURES ruin…obelisk and CENTRES tower, rockbox → ChunkDefs with `look`;
│  │                              STYLES, LEAVES, WOOD; scatter(T, set, seed, objectives, deployDepth) (a set's draws, in order); checkSet (a set's shape, at load)
│  ├─ terrain/sets.js             SETS.classic (the selection table, centre rule and spacing rules scatter reads), each checked at load; later SETS.fortified
│  ├─ terrain/geom.js             segmentHitsBox, distToBox
│  └─ ai/policy.js, ai/score.js   aiPhase generators (aiMove/aiShoot/aiCharge) · worth, meleeValue, shotValue, bestSpot, score
├─ data/                          CONSENSUS data
│  ├─ schema.js                   defineRace: parse stats, derive fields, validate; RACES registry
│  ├─ races/squirrel.js, serpent.js   (+ insect.js, bird.js in F5)
│  ├─ mission.js                  classic: OBJ_POS, default rounds, deploy depth
│  └─ compat.js                   sidesFor / isMirror / CLASSIC for main.js, and the legacy-shaped TYPES / ARMIES / SIDES views data-check compares, during R2-R5; deleted in R6
├─ match/                         pure netplay rules, no Automerge, Node-testable
│  ├─ envelope.js                 encode/decode (canonical JSON, ≤1 kB), newEntryId
│  ├─ fold.js                     Folder: the replicated authority (§2.6)
│  ├─ store.js                    MatchStore contract; LocalStore
│  └─ session.js                  Session(store, localSeats, dev, sink)
├─ present/                       pure view-models, Node-testable
│  ├─ mirror.js                   project(G), applyEvent(M, e): the state "as shown"
│  ├─ hud-model.js                hudModel(...) → slices (round, VP, phase, end{show,busy,ready}, buttons, hint, rings)
│  ├─ camera-presets.js           battleView({localSeats, edges, aspect}) · PRESETS
│  └─ pace.js                     PACE: every fixed duration in one table
├─ net/                           the ONLY importers of @automerge/*; reached only via import()
│  ├─ repo.js                     lazy slim init + adapters + IndexedDB
│  ├─ automerge-store.js          AutomergeStore(handle) implements MatchStore (never inits wasm, so Node can import it)
│  ├─ lobby.js                    create, join/claim, ready, start, rematch
│  ├─ seed.js                     commit/derive/verifyStart (WebCrypto SHA-256; async, outside the fold)
│  └─ presence.js                 ephemeral who/seat/head/hash/selection
├─ app/                           boot.js (URL: ?seed ?dice ?watch ?fast ?debug ?lowfi ?sync, #m= ; compat window.__ts), flow.js (screens → setup → Session)
├─ view/                          three.js
│  ├─ stage.js, clock.js          renderer, scene, lights, frame loop · tween/wait/stepTweens/easings (util.js 13-55)
│  ├─ player.js                   EventPlayer: drains events through handlers, catch-up, snap
│  ├─ camera.js                   CameraRig: goTo(preset), fit, follow policy, WASD, shake, panel shift, view-cycle button
│  ├─ table.js, objectives.js     mat, wood, board, zones (by seat edge and race colour), tufts · objective meshes, owners from mirror
│  ├─ units.js                    UnitView: figures, ring, hit cylinder, label, display positions, animators, death/flee playback
│  ├─ terrain.js                  TerrainView: meshes from ChunkDef.look; shudder, debris, collapse, topple, rubble pieces; dispose
│  ├─ overlay.js                  reach texture, range ring, path line, ghost
│  ├─ diorama.js                  race showcase in a scissor viewport of the same renderer (F6)
│  ├─ sfx.js                      = sfx.js (+ voices keyed by race look.voice)
│  ├─ effects/fx.js, shots.js     = fx.js · volley, projectile styles, artillery fire, thorn spikes, gaze beam
│  └─ models/kit.js, bake.js, cache.js, squirrel.js, serpent.js   (template cache per (race, unit, colour))
├─ input/                         human.js (derived input mode, selection), picking.js, tools/{deploy,move,shoot,charge,charge-end}.js
├─ ui/                            hud, actions, tray, log, card, tooltip, banner, netbadge, theme, screens/{title,races,lobby,result,help}
└─ sim/                           Node only, never bundled, run by hand
   ├─ oracle/                     fakedom.mjs, three-shim.mjs, orbit-stub.mjs, register.mjs, hooks.mjs, run-legacy.mjs, human-bot.mjs, shadow.mjs (the frozen parity shadow and battle-log formats), pin.mjs, PIN, perturb-preload.mjs (perturb.mjs's nudge, preloaded into the oracle child)
   ├─ run.mjs, parity.mjs         headless fold CLI · all baselines, first divergence with context (`--browser`: the same in Chromium, on a fresh build)
   ├─ chromium.mjs, browser.mjs   the Chromium runner (library) · its one-battle CLI
   ├─ corpus.mjs, lib.mjs         builds the corpus, admitting only what Node and Chromium agree on · shared plumbing (oracle runs with a deadline, verdicts)
   ├─ mutation.mjs, hooks-inert.mjs, self-test.mjs   one swapped die must fail parity · the `?debug` hooks change nothing outside `?debug` · the harness catches what it must
   ├─ present-check.mjs, property.mjs, merge-sim.mjs, peers.mjs, perturb.mjs, terrain-check.mjs, data-check.mjs, flag-lint.mjs, mirror-check.mjs, boundaries.mjs
   ├─ terrain-hooks.mjs           terrain-check's module hooks: counts the layout stream's draws in memory; its --self-test edits
   ├─ terrain-shots.mjs           R3's screenshot diff against the R0 build in Chromium (R0-R3 code only: it reads view members the `?debug` contract doesn't promise; R3 notes)
   └─ baselines/                  pairs.json, human/*.json: inputs plus a 10-hex hash per trace line, per shadow snapshot and per battle-log write (`webShadow` where Chromium's shadow differs); full texts are regenerated from oracle/PIN (`parity.mjs --pin --dump <dir>`)
```

### 1.2 Layer rules, enforced by `sim/boundaries.mjs`

`sim/boundaries.mjs` walks the static import graph and greps tokens.

| Layer | May import | Must not contain |
|---|---|---|
| `core/`, `data/` | each other | `three`; `@automerge`; `document`, `window`, `location`, `localStorage`, `requestAnimationFrame`; `async`, `await`, `Promise`; `Math.random`, `Date`, `performance`; module-level mutable state (ids, rng, counters); approximated `Math.*`: `hypot` from R1, `sin\|cos\|tan\|atan\|atan2\|exp\|pow\|log` from N0; tests on unit key, race key, ability text or `fx` (`.key ===`, `startsWith(`, `.fx`: `sim/flag-lint.mjs`'s patterns, with its allow-list) |
| `match/` | core, data | three, DOM, Automerge, `async`/`await` |
| `present/` | core (read-only queries), match | three, DOM |
| `net/` | match, core, `@automerge/*` | three, DOM rendering |
| `view/`, `input/`, `ui/`, `app/` | everything above | a **static** import of `net/` (it is reached only through `import()`); importing `core/rng.js` |

### 1.3 Where every current function goes

Line numbers are from HEAD.

#### main.js

| Lines | Today | New home |
|---|---|---|
| 1-32 | imports, `params` | `app/boot.js` |
| 34-71 | renderer, scene, fog, camera, OrbitControls, lights | `view/stage.js`; camera and controls config in `view/camera.js` |
| 73-74 | `overlayEl`, `new FX` | `view/stage.js` |
| 77-153 | `paintMat`, `paintWood`, board and frame meshes | `view/table.js` |
| 155-171 | deployment zones (`sx = side===0?-1:1`) | `view/table.js` `zones(seats)`: x from `edge`, colour from race `look` |
| 173-196 | tufts and flowers, `scatterTufts` | `view/table.js` (keeps `Math.random`) |
| 199-205 | `OBJ_POS` | `data/mission.js` |
| 206-227 | objective meshes | `view/objectives.js` |
| 229-234 | `new Scenery`, `new NavGrid`, `onBreak` sfx | `core/match.js` (`G.terrain`, `G.nav`); sfx in `view/terrain.js` on `terrain.destroy` (R3-R6: `TerrainView` plays `terrain.destroy` by calling main.js's `onBreak` hook, set through the `Scenery` facade at R3; R7 moves the sfx call into `view/terrain.js`) |
| 235-240 | `refreshNav` | `core/match.js` `refreshNav(G)`, same call sites |
| 242-256 | `S` | `seed`/`control` → `G.setup`; `round`/`active`/`first`/`phase`/`vp`/`stage`/`wiped` → `G.turn`; `pendingLog` → `G.journal`; `sel`/`reach`/`hover`/`mouse` → `input/human.js`; `busy`/`auto`/`waiting`/`deployDone`/`chargePick` are derived from `G.pending` and `player.idle`; `follow`/`titleSpin`/`titleAngle`/`viewShift` → `view/camera.js` |
| 258-259 | `units`, `nextUnitId` | `G.units`, `G.nextUnitId` (reset per match) |
| 261-271 | `alive`, `enemiesOf`, `friendsOf`, `dist`, `gap`, `engagedWith`, `mx`, `mz`, `isEngaged` | `core/queries.js` as `(G, …)` |
| 272 | `human(side)` | `core/match.js` `ctrl(G, s)`. Actions receive `via: 'seat' \| 'ai'` instead of testing it. |
| 277-287 | `formation` | `core/units.js` |
| 289-314 | `makeUnit` | `core/units.js` (id, `t`, models `{w, alive, ox, oz}`); meshes, ring, hit and label → `view/units.js` `UnitView.create` |
| 316-330 | `relayout` | `core/units.js` (offsets and `r`; emits `unit.formation`); ring and hit scale → `view/units.js` |
| 332-336 | `placeModel` | `view/units.js` |
| 338-344 | `setUnitPos` | `core/units.js` (position only) |
| 346-355 | `updateLabel` | `view/units.js`, from the mirror |
| 357-364 | `clearUnits` | `view/units.js` `dispose()`, which now also disposes geometry |
| 367-382 | `freeSpot` | `core/deploy.js`; its predicate becomes `placeOk(G, u, c)`, which `legal('place')` shares |
| 384-407 | `deployArmies` | `core/deploy.js` (`sx = edge`, z flip `= -edge`, row from `t.deployRow`) |
| 410-450 | `eyeY`, `chestY`, `inCover`, `sight`, `leadership`, `controlOf` | `core/queries.js`; eye and chest come from derived `t.eye`/`t.chest` |
| 453-515 | `moveMode`, `forbidMask`, `movePlan`, `validEnd`, `nearestValid` | `core/actions/move.js` (the input tools also use `nearestValid`) |
| 517-549 | `walk` | `core/actions/move.js` `resolveWalk`, now synchronous; playback in `view/units.js` |
| 552-561 | `smashAround` | `core/actions/move.js`; `fx.shake` becomes a field of the smash event |
| 563-586 | `doMove`, `doAdvance` | `core/actions/move.js`; the AI's direct `u.flags.moved = true` (ai.js 110) becomes the internal `hold` |
| 589-613 | `canShoot`, `shotInfo`, `shootTargets` | `core/actions/shoot.js` |
| 615-660 | `doShoot` | `core/actions/shoot.js` |
| 662-705 | `volleyFx`, `projGeo`, `projectileStyle` | `view/effects/shots.js` (`volley` handler) |
| 707-734 | `blastVolley` | `core/actions/shoot.js`; the marker tween becomes `blast.aim`/`blast.scatter` |
| 736-754 | `artilleryFire` | `view/effects/shots.js` (`blast.fire`) |
| 756-783 | `thornburst` | logic → `core/actions/shoot.js` `eruption`; spikes → `view/effects/shots.js` (`spell.thorns`) |
| 785-817 | `blastLands` | `core/actions/shoot.js`; explode, ring and boom → `blast.land` handler |
| 819-838 | `mesmerize` | `core/actions/shoot.js`; beam → `spell.gaze` handler |
| 841-875 | `damage` | `core/actions/damage.js`; `fx.text`/flash → `unit.wound`; waits → `pause` |
| 877-885 | `closeRanks` | `core/actions/damage.js` |
| 887-909 | `killModel` | `core/actions/damage.js` (logic); death tween, voice and debris (from race `look`) → `view/units.js` |
| 911-919 | `unitDestroyed` | `core/actions/damage.js` (`pendingLog`); label hide and text → view |
| 922-970 | `canCharge`, `chargeTargets`, `chargePlan` | `core/actions/charge.js`, plus `chargeSpots(plan, rolled)` extracted from 1009-1011 |
| 972-1002 | `doCharge` | `core/actions/charge.js`: `declareCharge` (972-994, plus the shortest-move continuation for AI and Auto) and `finishCharge` (997-1001) |
| 1005-1044 | `pickChargeSpot`, `nearestSpot`, `placeCharge` | `input/tools/charge-end.js` (mask from `chargeSpots`, then `submit({t:'chargeEnd', c})`) |
| 1046-1102 | `fight`, `fightPhase` | `core/actions/fight.js`; lunge and motes → `melee` event; `focus` → event |
| 1104-1148 | `moralePhase`, `flee1` | `core/actions/morale.js` (logic); flee tween → `view/units.js` (exit `edge·(W/2+3)`) |
| 1150-1154 | `face`, `top` | `unit.face` event; `top` → `view/units.js` |
| 1156-1169 | `finishAction`, `checkWipe` | `core/engine.js` (trace `act`, checkWipe, `objectives`/`status`/`act` events); reselect → `input/human.js` on idle |
| 1171-1187 | `focus` | `view/camera.js` follow policy on `focus` events |
| 1189-1197 | `api` | deleted; the AI imports the core queries and takes `G` |
| 1199 | `phaseResolve` | `G.pending` |
| 1201-1264 | `battle`, `playerTurn` | `core/engine.js` steps (§2.2) |
| 1266-1298 | `scoreRound`, `gameOver` | `core/engine.js`; rings, banner and the over screen → presenter and `ui/screens/result.js` |
| 1301-1312 | `pick` | `input/picking.js` |
| 1314-1323 | `canAct`, `anyCanAct` | `core/queries.js` |
| 1325-1350 | pointer listeners, `myTurn` | `input/human.js` (mode derived, §2.5) |
| 1352-1425 | `click`, `deployClick`, `select` | `input/human.js` plus `tools/{move,shoot,charge,deploy}.js` |
| 1427-1496 | overlay texture, `paintReach`, `paintMask`, `clearOverlay`, range ring, `showRange`, path line, ghost, `ghostAt` | `view/overlay.js` |
| 1498-1556 | `hover` | `input/human.js` plus each tool's `preview` (under `rng.lock`) |
| 1558-1579 | `oddsText` | `ui/tooltip.js` |
| 1582-1639 | `PIPS`, `dieEl`, `tray` | `ui/tray.js` (handlers for `tray.open`/`dice`; duration from `PACE`) |
| 1641-1662 | `trace`, `traceState`, `log`, `write` | `core/journal.js` (trace and `log` event); DOM → `ui/log.js` |
| 1664-1703 | `statKeys`, `showCard` | `ui/card.js` |
| 1705-1771 | `refreshUI`, `refreshRings` | `present/hud-model.js` (pure) → `ui/hud.js`, `ui/actions.js`, `view/units.js` rings |
| 1773-1781 | `banner` | `ui/banner.js` (handlers for `phase.start`/`round.scored`) |
| 1783-1816 | End, Shortest, Auto, Advance buttons | `ui/actions.js` intents → `input/human.js` → `session.submit` |
| 1818-1847 | speed, follow, mute, help, log toggle, seed, reroll | `ui/hud.js`, `ui/screens/title.js` |
| 1848-1862 | mode buttons, Again | `app/flow.js`, `ui/screens/result.js` |
| 1864-1885 | keys, `panKeys` | `view/camera.js`; Escape → `input/human.js` |
| 1887-1947 | `setupTable`, `start` | `app/flow.js`: `showTable(boardSeed)` (title/lobby backdrop) and `startMatch(mode)` → setup → `Session` |
| 1949-1953 | timer, title spin | `view/stage.js`, `view/camera.js` |
| 1955-2009 | `animateUnits` | `view/units.js`: display positions and race animators |
| 2012-2030 | `paintObjective`, `animateObjectives` | `view/objectives.js`: owners from the mirror, never `controlOf` |
| 2032-2063 | `FAST`, `frame` | `view/stage.js`; `?fast` = player speed 1e4, no render |
| 2065-2081 | `defaultView`, `fitFov`, resize | `present/camera-presets.js`, `view/camera.js` |
| 2083-2098 | boot, `?watch`, `?debug` | `app/boot.js`; under `?debug`, `window.__ts` keeps the whole surface the parity driver (`sim/oracle/*` and `sim/chromium.mjs`) reads, listed in the comment at the top of main.js's `?debug` block (`S` fields, `trace`, `units`, `scenery.chunks`, `nav`, `validEnd`, `phaseResolve`, `chargePick`, ten `q` members with the result fields named there, `start` and the input hooks), so `node sim/parity.mjs --browser` (`sim/chromium.mjs`) runs unchanged on every build (other `sim/` tools may read more and are not promised it: R0 notes). It also presses the title screen's `[data-mode]` buttons and reads `#logList`, so the screens and the log UI keep those (or `sim/` changes them in one place) |

#### Other modules

| Module | Today | New home |
|---|---|---|
| rules.js | `BOARD`, `ENGAGE`, `CHARGE_RANGE`, `OBJECTIVE_RANGE`, `ROUNDS`, `AURA`, `PHASES` (13-31) | `core/rules.js` (`ROUNDS` becomes the default for `setup.rounds`) |
| | `SIDES` (20-23) | race data: `name`, `short`, `icon`, `look.team`/`look.dark` |
| | `TYPES` (36-125) | `data/races/squirrel.js`, `serpent.js` |
| | `ARMIES` (127-130) | `race.army` |
| | `d6`, `roll` (133-134) | `core/rules.js` `d6(G)`, `roll(G, n)` on `G.rng` |
| | `passes` … `expected` (135-186) | `core/rules.js`, unchanged |
| rng.js | `rng`, `seedLogic`, `rngState` | `core/rng.js`: per-match instance; the same mulberry32 arithmetic, count and hash |
| util.js | `mulberry32`, `lerp`, `pick`, `rr` | `core/util.js` |
| | easings, `bounce`, `wrapAngle`, `clock`, `tween`, `wait`, `stepTweens` | `view/clock.js` |
| nav.js | all | `core/nav.js`; `Math.hypot`/`sin`/`cos` → dmath |
| scenery.js | `BOX`, `LOG`, `mat`, `mesh` (21-34) | `view/terrain.js` |
| | `STYLES`, `LEAVES`, `WOOD` (36-46) | `core/terrain/recipes.js` (palettes are drawn from the layout stream, so they are consensus) |
| | `nextId` (48) | per-`Terrain` counter |
| | `Scenery` constructor, `clear`, `add` (50-84) | `core/terrain/terrain.js` (no meshes) |
| | `generate` (86-147) | `sets.js` (the table) and `recipes.js` `scatter` (the draws, same order); `Terrain.generate` is `clear` plus `scatter` |
| | `build` and modules (149-515) | `recipes.js`, producing ChunkDefs plus `look` |
| | `los` (522-540) | `terrain.js` |
| | `blast`, `hurt`, `destroy`, `collapse`, `rubble`, `topple` (546-698) | logic → `terrain.js`, emitting `terrain.*` events; shudder, debris, leaves, rubble pieces, topple and collapse tweens → `view/terrain.js` |
| | `segmentHitsBox`, `distToBox` (702-729) | `core/terrain/geom.js` |
| models.js | `M`, `G`, `part`, `rod`, `base`, `taperTube`, `spear`, `roundShield`, `hold`, `wheel` | `view/models/kit.js` |
| | `squirrel()` and `BUILDERS` nutkin…elder | `view/models/squirrel.js` |
| | `naga()` and scaleguard…hierophant | `view/models/serpent.js` |
| | `bake`, `flipWinding`, `classKey` | `view/models/bake.js` |
| | `buildModel` | `view/models/cache.js` (template cache, clone) |
| fx.js, sfx.js | all | `view/effects/fx.js`; `view/sfx.js` (voice by race) |
| ai.js | `ROLE` (13-16) | unit field `ai` |
| | `ORDER` (17) | `core/ai/policy.js` |
| | `aiPhase`, `aiMove`, `aiShoot`, `aiCharge` | generators in `policy.js` |
| | `worth`, `meleeValue`, `shotValue`, `bestSpot`, `score` | `core/ai/score.js` (line 204's key test → `e.t.brawler`) |

---

## 2. Interfaces

### 2.1 Core state

```js
G = {
  setup,                   // frozen: { board, dice, terrain:'classic', rounds:5, overtime:'never'|'vote', diceMode:'shared',
                           //           seats:[{ race, ctrl:'human'|'ai', dev?, name?, nonce? }, …] }  (+ core, rules from `start`)
  rng: { a, n, h, locked },      // createRng(setup.dice); rngState(G.rng) prints exactly today's `${count}#${hash36}`
  seats: [{ seat: 0, race: 'squirrel', edge: -1, ctrl }, { seat: 1, race: 'serpent', edge: +1, ctrl }],  // edge fixed by seat
  units: Unit[], nextUnitId,     // army order, seat 0 first; ids 1..N, reset per match
  objectives: [{ i, x, z }],
  terrain: Terrain,              // chunk logic data, per-match chunk ids
  nav: NavGrid,                  // derived cache; not hashed; refreshed only at today's refreshNav sites
  turn: { stage: 'deploy'|'battle'|'over', step, round, t, first, active, ph, vp: [0, 0], wiped: -1, result: null, overtime: 0 },
  pending: Decision | null,
  journal: { trace: [], pendingLog: [] },
  out: Event[] | null,           // null = quiet fold (catch-up, scrub, peers); [] when someone will present
}
Unit = { id, side /* = seat */, race, key, t, pos: { x, z }, r, alive, lost, mesmerized,
         flags: { moved, advanced, advRoll, fellBack, shot, charged, chargeTried, chargeTarget, fought },
         models: [{ w, alive, ox, oz }] }
Decision = { k: 'deploy',     seats: [s…] }                          // simultaneous: one head per seat
         | { k: 'phase',      seats: [s], phase: 'move'|'shoot'|'charge' }
         | { k: 'chargeEnd',  seats: [s], u, tg, rolled, cell }     // cell = the shortest-move spot (plan.cell)
         | { k: 'roundLimit', seats: [s…], votes: { [s]: bool } }   // simultaneous
```

Every view field leaves the unit and goes to `view/units.js`: `mesh`, `ring`, `hit`, `label`, `facing`, `moving`, and per model `x, z, yaw, lunge, lungeDir, lift, flash, dying, look, flying, fleeing`. `u.facing` has one logic read (532), which can never fire because `walk` returns early when the path is under 0.05" (519).

`edge` replaces every hard-wired side. Seat 0 → −1 reproduces today's numbers exactly.

| Site | Lines | Becomes |
|---|---|---|
| facing | 293 | `-edge·π/2` |
| `freeSpot` zone | 369 | `[edge·W/2 … edge·(W/2−deploy)]` |
| deploy | 386, 399 | `sx = edge`, z flip `-edge` |
| flee exit and yaw | 1133, 1137 | `edge·(W/2+3)` |
| zones | 158-170 | by edge |
| title drift | 2045 | camera preset (R7) |

Death voice and gore colours (892-897) come from race `look`. A mirror match uses `look.alt` for seat 1.

### 2.2 Commands and the engine

**Command bodies.** Units are addressed by per-match id. Places are addressed by nav cell index on the half-inch grid (80×56 = 4,480 cells). Bodies carry only integers and booleans. The client snaps clicks with the same core queries the UI uses today (`nearestValid`, `freeSpot`, `nearestSpot`), so a float from the view never enters the log.

| `t` | Body | Legal when (`core/commands.js`; the source of today's check) | Logic draws |
|---|---|---|---|
| `place` | `{u, c}` | `deploy` pending for seat; `u` is the seat's unit; `placeOk(G,u,c)`: inside the edge's zone, `standable(c, r, 'walk')`, no other unit within `o.r+u.r+0.4` (deployClick 1392-1411, freeSpot 367-382). The 2.5" click tolerance is UI only. | – |
| `deployed` | `{}` | `deploy` pending for seat (`#endPhase` in deploy, 1786) | The last one closes deployment, then the roll-off (1207-1213) |
| `advance` | `{u}` | `phase:move`; own unit; alive, `!moved`, `!advanced`, `!isEngaged` (1723) | 1 D6 |
| `move` | `{u, c}` | `phase:move`; own, alive, `!moved`; `validEnd(movePlan(G, u, advanced ? advRoll : 0), c)` (1372). Also covers advance moves and falling back. | – |
| `shoot` | `{u, tg}` | `phase:shoot`; own; `canShoot(u)`; `tg` is an alive enemy; `shotInfo(u, tg).ok` (1380) | yes |
| `charge` | `{u, tg}` | `phase:charge`; own; `chargeTargets(u).includes(tg) && chargePlan(u, tg)` (1384) | 2D6 |
| `chargeEnd` | `{c}`, `-1` = shortest | `chargeEnd` pending for seat; `c === -1 \|\| chargeSpots(chargePlan(u,tg), rolled)[c]` (1035) | – |
| `end` | `{}` | `phase` pending for seat | Only the charge-phase `end`, which runs fight, morale, scoring and the next turns, AI included |
| `auto` | `{}` | `phase` pending for seat | AI policy for this phase, then `end` (1798-1811) |
| `vote` | `{more}` | `roundLimit` pending; seat hasn't voted | – |
| `concede` | `{}` | out-of-band: any seated human, any time after `start` | – |
| `hold` | `{u}` | **internal to the AI**, never legal on the wire (ai.js 109-110) | – |

```js
// core/index.js: the only API that match/, sim/ and the UI call
export function createMatch(setup, { out = null, onTrace = null } = {})  // onTrace(line, G): sim/debug only (R0 notes, §4)
                                                        // terrain, units, deployArmies; logs "deploy your army" per human seat
                                                        // (seat order); pending = deploy(humanSeats) or straight on: an all-AI
                                                        // match runs to 'over' inside this call
export const pendingSeats = (G) => G.pending?.seats ?? []
export function legal(G, seat, body)                    // → null | 'why'; runs under rng.lock; pure; may refreshNav (idempotent)
export function apply(G, seat, body) { HANDLERS[body.t](G, seat, body, 'seat'); advance(G) }  // precondition: legal
export function stateHash(G)                            // cyrb53 → base36 over canonical pre-state (§2.6)
export function shadowState(G)                          // debug: full-precision superset of traceState (not the parity shadow, §2.6)
export * as q from './queries.js'                       // read-only, for previews and the ?debug __ts surface
```

`q` covers every query the `__ts` contract names (R0 notes, §4), so `app/` can serve that surface without importing anything it may not: `queries.js` re-exports `movePlan`, `validEnd`, `nearestValid` (`actions/move.js`), `freeSpot` (`deploy.js`), `shootTargets`, `shotInfo` (`actions/shoot.js`), `chargeTargets`, `chargePlan`, `chargeSpots` (`actions/charge.js`) and a read-only `rngState(r)` from `core/rng.js`, which `app/`, `view/`, `input/` and `ui/` never import (§1.2). The `?debug` block maps it as `rngState: () => q.rngState(G.rng)` and never rebuilds the `n#h36` format from `G.rng`'s fields itself.

**Step machine.** `battle()` and `playerTurn()` (1201-1264) are unrolled into resumable steps. The statement order is unchanged, so the trace lines up line for line:

```js
function advance(G) {
  const T = G.turn
  while (!G.pending && T.stage !== 'over') switch (T.step) {
    case 'rolloff':   rollOff(G); T.stage = 'battle'; T.round = 1; T.t = 0; T.step = 'turnStart'; break   // do…while as 1208-1213
    case 'turnStart': T.active = (T.first + T.t) % 2; resetTurn(G, T.active); T.ph = 0; T.step = 'phase'; break  // 1228-1231
    case 'phase': {
      const ph = PHASES[T.ph].key; emit(G, 'phase.start', { side: T.active, phase: ph }); T.step = 'phaseEnd'
      if (ph === 'fight') { if (G.units.some((u) => alive(u) && isEngaged(G, u))) fightPhase(G, T.active) }
      else if (ph === 'morale') moralePhase(G)
      else if (!anyCanAct(G, T.active)) emit(G, 'pause', { s: 0.2 })
      else if (ctrl(G, T.active) === 'human') G.pending = { k: 'phase', seats: [T.active], phase: ph }
      else runAI(G, T.active, ph)
      break
    }
    case 'phaseEnd':  traceState(G, `phase ${T.active}:${PHASES[T.ph].key}`); checkWipe(G)
                      if (T.wiped >= 0) { gameOver(G); break }                     // skips the mesmerism reset, as 1257
                      T.step = ++T.ph < PHASES.length ? 'phase' : 'turnEnd'; break
    case 'turnEnd':   endMesmerism(G, T.active); T.step = ++T.t < 2 ? 'turnStart' : 'score'; break  // 1259-1263
    case 'score':     scoreRound(G)                                                 // 1266-1281
                      if (T.round < G.setup.rounds) { T.round++; T.t = 0; T.step = 'turnStart' }
                      else if (G.setup.overtime === 'vote' && humanSeats(G).length) G.pending = { k: 'roundLimit', seats: humanSeats(G), votes: {} }
                      else gameOver(G)
                      break
  }
}
```

**Handlers.**

- `end` clears `pending` (the step is already `phaseEnd`).
- `auto` runs `runAI(G, seat, phase)`, then clears `pending`.
- `deployed` removes the seat from `pending.seats`. When none are left, it clears `pending` and sets the step to `rolloff`.
- `vote` records the vote. When every seat has voted, all `more` means `T.round++; T.overtime++; step 'turnStart'`, and anything else means `gameOver`.
- `concede` ends the game for the other side.

Actions inside a phase leave `pending` as the phase decision. `charge` may replace it with `chargeEnd`, and `chargeEnd` restores it.

**The charge splits at today's `await pickChargeSpot` (996). It draws nothing between the two halves.**

- `declareCharge(G, u, tg, via)` runs 972-994 unchanged (plan, `chargeTried`, 2D6, failure → `finishAction`; success → flags, "Contact!" log).
  - If `via === 'ai'` (an AI seat, or a human's Auto; this replaces `auto || !human(u.side)`), it calls `finishCharge(G, u, tg, plan.cell)`.
  - Otherwise it sets `pending = {k:'chargeEnd', seats:[seat], u, tg, rolled, cell: plan.cell}`.
- `finishCharge` walks, calls `refreshNav`, then `finishAction`. The `act` trace line comes after the walk in both paths, exactly as today.
- `chargeEnd` recomputes `chargePlan(G, u, tg)`. That is pure over unchanged state: nav is never dirty at a command boundary, because every action ends with `refreshNav`.

**AI inside the fold.**

```js
function runAI(G, seat, phase) {
  for (const cmd of aiPhase(G, seat, phase)) {        // generators keep `mine` and `claimed` as today (ai.js 57-114)
    if (SIM) assertNull(legal(G, seat, cmd))          // property: the AI never issues an illegal command
    HANDLERS[cmd.t](G, seat, cmd, 'ai')
  }
}
```

Inside the generators:
- `await api.doAdvance(u)` becomes `yield {t:'advance', u}`, after which the roll is read back from `u.flags.advRoll`.
- `await wait(s)` (ai.js 112, 256, 287) becomes `emit(G, 'pause', {s})`.
- `api.focus` becomes `emit(G, 'focus', …)`.
- Every tie-break draw stays between the same yields.

### 2.3 Events

`emit(G, t, payload)` pushes `{t, ...payload}` onto `G.out` when it is non-null. Building an event never draws and never mutates. Every pure wait in today's code becomes a `pause {s}` at the same spot: damage 0.25, fight end 0.3, a morale flee 0.5, a blast with no victims 0.25, a skipped phase 0.2, AI waits 0.05/0.1. Every visual await becomes the semantic event below.

| Group | Events |
|---|---|
| Flow | `phase.start {side, phase}` · `pause {s}` · `focus {x, z}` · `round.scored {round, held, vp, owners}` · `objectives {owners}` (at every action end) · `status {engaged: [ids], mesmerized: [ids]}` (at action end; labels) · `act {tag, proj?}` (after `traceState('act')`; `proj` = `mirror.project(G)` in sim only) · `pending {k, seats}` · `game.over {win, why: 'score'\|'wipe'\|'concede', vp, rounds}` |
| Tray and log | `tray.open {title}` · `dice {label, dice, need, sum, pass, note, save}` · `log {side, html, cls, traced, at}` (`at`: trace length when logged or flushed) |
| Units | `unit.move {u, path: [{x,z}], L, speed, fly, smashes: [{s, ev: [terrain events]}]}` · `unit.face {u, tg}` · `unit.wound {u, m, dmg}` · `unit.slain {u, m, by}` · `unit.flee {u, m}` · `unit.formation {u, offs, r, pos}` · `unit.destroyed {u, by}` |
| Attacks | `volley {u, tg, fx, n}` · `blast.aim {x, z, r}` · `blast.scatter {from, to, d}` · `blast.fire {u, to, fx}` · `blast.land {x, z, r, fx}` · `spell.cast {u}` · `spell.fizzle {u}` · `spell.thorns {u, x, z, r}` · `spell.gaze {u, tg}` · `melee {u, tg, hits}` · `charge.result {u, tg, ok}` |
| Terrain | `terrain.clear {}` (a new table) · `terrain.add {def}` (every chunk, the board's included: rubble piles and fallen logs too; `def.look` included, a fallen log's being `{piece: 'fallen', tree, dx, dz}`, so the fall plays from its add and there is no topple event) · `terrain.hurt {id, from}` · `terrain.destroy {id, kind, from}` (before its consequences) · `terrain.collapse {drops: [{id, dy}], by}` · `terrain.rubble {id, from}`. The view never reads the live chunk: it keeps each chunk's `x`/`z` from its `terrain.add {def}` (a chunk never moves sideways; a collapse only lowers it), and reads `alive` and `y` from the mirror (§2.4). |

`m` is a model index. `fx` and `look` values are presentation keys only; rules never read them.

**`resolveWalk`.** It samples exactly as 522-533:
- one sample every 0.25" for a wrecker, plus the end point;
- `smashAround` runs per sample, in order, and its `terrain.*` events are captured with that sample's `s`;
- the unit is then placed at the **k=1 lerp** (`seg.find(d <= s+l)`, `lerp`, 536-539), not at `pts.at(-1)`;
- a path under 0.05" moves nothing and smashes nothing (519);
- finally it emits `unit.move`.

### 2.4 The core/presenter boundary

```js
// view/player.js
export class EventPlayer {
  constructor({ handlers, mirror, onIdle })
  push(events) { this.q.push(...events); if (!this.running) this.run() }        // never blocks the fold
  async run() { this.running = true
    while (this.q.length) { const e = this.q.shift(); this.mirror = applyEvent(this.mirror, e)
      this.catchUp(); await (this.handlers[e.t] ?? this.handlers.fallback)(e, this.mirror) }
    this.running = false; this.onIdle() }
  get idle() { return !this.running && !this.q.length }
  backlog()                    // seconds queued at the current speed, estimated from PACE and unit.move L/speed
  snap(G) { this.q.length = 0; this.mirror = project(G); this.view.rebuild(this.mirror); this.onIdle() }
}
```

- **Handlers hold today's visuals verbatim.** `dice` → `tray.row` (1605-1638); `unit.move` → the old tween (535-545), driving a per-figure display position and replaying each smash's events as the walker passes `s`; `unit.slain` → the `killModel` tween chain (898-907).
- **Unknown events go to a fallback.** It floats `e.text` if present, then waits `e.beat ?? 0.3` s (content-first), so a new keyword can ship rules before art.
- **`present/pace.js` holds every fixed duration:**
  - `phase.start`: 0.9 s when the seat is local or the stage isn't battle, otherwise 0.6 (1779);
  - `dice`: `0.38 + min(n,14)·0.035` (1637);
  - `unit.wound`/`unit.slain`: 0.06;
  - `pause`: `e.s`.
  Animation handlers keep their tween lengths.
- **The view never reads `G` while events are queued.** One `end` can compute a whole AI turn before the first die is shown. Labels, rings, flags, VP, round and figure positions read the **mirror**: `present/mirror.js`, a pure fold of events into `{units: {id → pos, r, models, alive, mesmerized, engaged}, chunks: {id → alive, y}, owners, vp, round, active, phase, stage}`.
- **Input, the HUD model and previews read `G` only when `player.idle`** and the pending decision belongs to a local seat. At that point mirror and `G` agree.
- **Instant replay and catch-up.**
  - Rejoin, late join, rollback and scrubbing all fold quietly (`G.out = null`) and then `snap(G)`.
  - Live backlog is handled elastically (experience-first): above 8 s at the current speed, play at 2×, then 4×. Above 30 s, or while `document.hidden`, snap and toast a summary such as "Caught up: Ann moved 3 units, shot twice". The log keeps every line.
  - The fold is driven by store change events, never by `requestAnimationFrame`, so background tabs stay current.
- **Checks.** `sim/present-check.mjs` asserts `applyEvent*` equals `project(G)` at every `act` of every log, so a missing event is a failing test, not a ghost unit. Under `?debug` the browser diffs the drained view against a fresh `snap(G)`.
- **`?fast`** keeps `clock.speed = 1e4` and no render (legacy behaviour), so `sim/chromium.mjs` keeps working.

### 2.5 Controllers

| Source | Where it runs | What it does |
|---|---|---|
| **Local human** (`input/human.js`) | the client holding the seat | The mode is derived, never stored: `mode = player.idle && session.decisionFor() >= 0 ? G.pending.k : 'watch'`. That replaces `S.busy`, `S.auto`, `S.waiting`, `phaseResolve`, `S.deployDone`, `S.chargePick` and `myTurn()`. Tools turn a pick into a body (`tools/move`: `{t:'move', u, c: nearestValid(plan, x, z)}`; Advance: `{t:'advance', u}`; Shortest: `{t:'chargeEnd', c:-1}`). The tool previews with `session.preview(fn)` (rng locked), then calls `session.submit(seat, body)` only if `legal` passes. |
| **AI** (`core/ai/policy.js`) | inside `apply`/`advance`, **on every peer** | Generators yield commands, so an AI seat appends nothing. A human's `auto` runs the same generator. |
| **Remote human** | none on this client | Its entries arrive through the store and fold like anyone's. |
| **Script** (`sim/`) | Node | Replays recorded bodies. Human baselines, peer tests and the netplay log share one format. |

Hotseat is two local seats. During a simultaneous deploy, `submit` takes an explicit seat, and the UI deploys seat 0 then seat 1 as today. A spectator is `localSeats = []`.

### 2.6 Match layer: envelope, fold, stores, session (pure)

**Envelope.** One per log entry, stored as canonical JSON:

```js
{ id: 'k3f9.17.x2', s: 0, d: 'k3f9', p: 'p2x1.16.q0', h: '1u8kq0d', t: 'move', u: 3, c: 1234 }
// id: `${dev}.${counter}.${rand}` (unique) · s: seat (−1 for open/start) · d: device · p: prev (the head this seat saw)
// h: stateHash(author's pre-state), only on single-seat decision kinds · then the body
```

`decode` rejects anything that is not an object with known `t`, integer fields, or more than 1 kB. The log is capped at 5,000 entries; past that the status becomes `full` and the match freezes.

**stateHash.** It is cyrb53 → base36 over a canonical string, a superset of `traceState`:
- turn: stage, step, round, t, first, active, ph, vp, wiped, overtime;
- pending;
- every unit: id, `pos.x`/`pos.z` printed with `String(n)` (ES `Number::toString` is spec-exact on every engine), r, alive, lost, mesmerized, flags in sorted keys, models `w/alive/ox/oz`;
- every chunk: id, alive, hp, `shape.y`;
- `rngState` plus the generator word.

`shadowState` is the same string, for debugging. It is **not** the parity shadow. The shadow hashes in `sim/baselines` are `sim/oracle/shadow.mjs`'s legacy format, frozen at R0 and taken at every state line of the trace, not only at `act`. From R4/R6, `sim/` keeps a G → legacy-shadow adapter beside the `__ts` one. It reproduces that format's quirks, which the header of shadow.mjs lists: the last phase run on `round` lines, the round overshoot and stage `battle` on a non-wipe `over` line, `wiped` printed `-` rather than −1, false flags dropped, chunks by array index. The same adapter rebuilds the third parity stream, the battle log as written (`written`: each `#logList` entry as `@<trace length> <class>: <html>`), from `G.journal` once the core has no DOM; it is what pins the destroyed-unit lines that are written but never traced (§4.1 rule 8).

```js
// match/fold.js: pure, synchronous; the replicated authority; knows nothing about Automerge
const SIMULTANEOUS = new Set(['deploy', 'roundLimit'])
export class Folder {
  constructor({ out = null } = {})        // status 'lobby' until a valid start
  get G(); get status()                   // 'lobby' | 'live' | 'over' | 'desync' | 'skew' | 'full' | 'tamper'
  get accepted(); get rejected()          // ids in fold order · [{ id, why }]
  head(seat)                              // simultaneous decision: this seat's last accepted entry in it, else the entry that opened it;
                                          // otherwise the last accepted entry overall
  push(e) {
    if (e.bad || this.seen.has(e.id)) return this.reject(e, 'envelope')
    this.seen.add(e.id)
    if (this.status === 'lobby') {                                        // online logs open with `open`; local logs start with `start`
      if (e.t === 'open' && !this.openBy) this.openBy = e.d
      return e.t === 'start' && (!this.openBy || e.d === this.openBy) ? this.begin(e) : this.inert(e)
    }
    if (this.status !== 'live') return this.inert(e)                       // over or frozen: later entries are inert
    if (e.t === 'concede' || e.t === 'desync') return this.outOfBand(e)    // seated human seat + device; terminal
    const P = this.G.pending
    if (!P?.seats.includes(e.s))               return this.reject(e, 'turn')
    if (e.d !== this.G.setup.seats[e.s].dev)   return this.reject(e, 'device')
    if (e.p !== this.head(e.s))                return this.reject(e, 'stale')    // first valid extension of the head wins
    if (!SIMULTANEOUS.has(P.k) && e.h !== stateHash(this.G)) return this.freeze(e)  // desync: never a rejection
    const why = legal(this.G, e.s, e);  if (why) return this.reject(e, why)
    apply(this.G, e.s, e); return this.accept(e)                            // updates heads; records decision openers
  }
  sync(entries)                           // → { events, reset }
}
```

- **`begin(e)`.** If `e.core !== CORE_VERSION || e.rules !== RULES_ID`, the status becomes `skew` (read-only). Otherwise `G = createMatch(e.setup, {out})`, the deploy decision is opened by `start.id`, and the status becomes `live` (or `over` for an all-AI match).
- **`sync(entries)`.**
  - If the entries already pushed are a prefix of `entries`, it pushes the tail and events flow.
  - Otherwise (a concurrent insert landed *before* entries already applied, as the research measured), it refolds quietly. If the old accepted list is a prefix of the new one, nothing shown is undone: it refolds quietly up to the old count, then pushes the rest with events. Otherwise it returns `reset: true`, the view snaps, and a "History changed: N moves undone" toast appears. This happens only with two devices on one seat, or with tampering.
- **Why `prev` is required.** Automerge orders concurrent list inserts arbitrarily but identically on every peer, and the higher actor id goes first. It can insert *before* entries a peer has already applied. With `prev`, every peer accepts and rejects the same entries, whatever their arrival order. The prototype showed both an out-of-turn append and a same-seat fork.
- **Why per-seat heads are sound during `deploy` and `roundLimit`.** Their commands commute: zones are at least 24" apart, and votes are per seat. When the decision closes, the global head is the entry that closed it.
- **The fold depends only on the entry list.** Never on wall time, arrival order, who is online, or local settings.
- **On a desync**, `freeze(e)` records `{at: e.id, theirs: e.h, mine}`. The session then appends an out-of-band `desync {at, mine}` (seated clients only) so the author's client freezes too: its own hash matched, so it would never notice otherwise. Spectators only show a banner.

**Stores and session.**

```js
// match/store.js
/** MatchStore: { entries(): Entry[] (decoded, list order), append(entry): void, subscribe(fn): () => void, kind: 'local'|'automerge' } */
export class LocalStore { constructor(entries = []) }    // vs AI, hotseat, watch, sim; export → a replay JSON of about 6 kB
// match/session.js
export class Session {
  constructor({ store, localSeats, dev, sink })           // sink: { events(evts), reset(G, info), status(s, info) }
  get G(); get status()
  decisionFor()                                           // first seat in pendingSeats(G) ∩ localSeats, else -1
  preview(fn)                                             // fn(G, q) under rng.lock (overlays, odds, hud)
  submit(seat, body) {                                    // throws unless seat ∈ localSeats ∩ pendingSeats
    const P = this.G.pending
    this.store.append(envelope(body, { s: seat, d: this.dev, p: this.folder.head(seat), id: this.nextId(),
                                       h: SIMULTANEOUS.has(P.k) ? undefined : stateHash(this.G) }))
  }                                                       // store change → onChange (synchronous for both store kinds)
  onChange() { const { events, reset } = this.folder.sync(this.store.entries())
               reset ? this.sink.reset(this.G) : this.sink.events(events); this.sink.status(this.folder.status) }
}
```

Every mode goes through this. From R8, single-player and hotseat exercise the same validator that guards online play.

| Mode | Seats 0 / 1 | Store | `localSeats` | AI runs |
|---|---|---|---|---|
| vs AI | human / ai (or ai / human) | Local | `[0]` or `[1]` | in-fold, here |
| Hotseat | human / human | Local | `[0, 1]` | – |
| Watch | ai / ai | Local | `[]` | in-fold |
| Online | human / human | Automerge | `[mine]` | – |
| Online vs AI, or spectating | human / ai | Automerge | `[0]` or `[]` | in-fold on every peer |

### 2.7 Automerge document and network layer

**Document.** It holds commands, never state.

```js
{
  app: 'tails-and-scales', schema: 1,
  lobby: {                                    // mutable, last-writer-wins; the fold ignores it once `start` exists
    host: 'k3f9',                             // creator device
    board: 1234, terrain: 'classic', rounds: 5, overtime: 'vote',      // creator edits until start
    seats: { s0: { ctrl: 'human', dev: 'k3f9', name: 'Ann', race: 'squirrel', ready: true, nonce: '' },
             s1: { ctrl: 'human', dev: 'p2x1', name: 'Ben', race: 'serpent', ready: true, nonce: '9f…' } },
    next: null,                               // rematch documentId
  },
  log: [ ImmutableString(json(entry)), … ],   // append-only by convention; one A.change per entry
}
// log[0]  { id, s:-1, d:host, t:'open', commit: hex(sha256(a)) }       a = 16 random bytes kept in the host's localStorage per doc
// start   { id, s:-1, d:host, p:openId, t:'start', core, rules, a,
//           setup:{ board, dice, terrain, rounds, overtime, diceMode:'shared', seats:[{race, ctrl, dev, name, nonce}…] } }
```

- **Seat claims** use map keys `s0`/`s1`. Concurrent claims resolve last-writer-wins, and the loser sees the conflict through `getConflicts` ("seat taken").
- **The dice seed** is `dice = u32be(sha256(a ‖ ':' ‖ documentId ‖ ':' ‖ nonce0 ‖ ':' ‖ nonce1))`, where an AI or creator seat contributes `''`.
- **`net/seed.verifyStart(doc)`** runs once, asynchronously, outside the fold. It checks that `sha256(start.a) === open.commit`, that `setup.dice` re-derives, and that this client's own nonce appears in its seat. On failure the match is read-only, with the message "seed check failed".
- **Local matches** have no `open` and no `a`. Their log is `[start, …]`, with `dice` from `?dice=` or `Math.random` at the app level.

**Lobby flow (`net/lobby.js`, `ui/screens/lobby.js`).**

1. Title → Play online → pick a race in the diorama and a battlefield.
2. `repo.create(lobbyDoc)`, append `open`, and the URL becomes `…/tails-and-scales/#m=<documentId>`.
3. The page shows Copy link and Open second tab. The second tab syncs over BroadcastChannel, which helps testing.
4. The joiner opens the link and claims the free seat with its device id, name, race and a fresh nonce.
5. Both press Ready. The host's client appends `start` (setup frozen, `a` revealed). If the host is offline, the lobby says "waiting for host".
6. Anyone who arrives once the seats are full is a spectator.
7. Rematch creates a new doc with the same seats and races, and sets `lobby.next`.

**Identity and URLs.**

- A device id lives in `localStorage['ts.dev']`: 8 random base36 characters.
- `#m=<id>&dev=<dev>` is a "continue on another device" link for the same seat.
- `#m=<id>&sync=<wss url>` carries a non-default sync server.
- The fragment never reaches GitHub Pages, so no routing is needed.

**Lazy loading.** This is the research's verified recipe. It needs no Vite plugin and no change to the shared config.

```js
// net/repo.js: reached only from "Play online" or a #m= URL via import('../net/repo.js'); prefetched when the Online panel opens
const [{ Repo, initializeWasm }, { default: wasmUrl }, { WebSocketClientAdapter }, { BroadcastChannelNetworkAdapter },
       { IndexedDBStorageAdapter }] = await Promise.all([
  import('@automerge/automerge-repo/slim'), import('@automerge/automerge/automerge.wasm?url'),
  import('@automerge/automerge-repo-network-websocket'), import('@automerge/automerge-repo-network-broadcastchannel'),
  import('@automerge/automerge-repo-storage-indexeddb')])
await initializeWasm(wasmUrl)
export const repo = new Repo({ storage: new IndexedDBStorageAdapter('tails-and-scales'),
  network: [new BroadcastChannelNetworkAdapter(), new WebSocketClientAdapter(syncParam() ?? 'wss://sync.automerge.org')] })
```

- **Cost:** about 68 kB gz of JS plus a 3.64 MB `.wasm` file (1.14 MB gz), fetched on demand. GitHub Pages serves it as `application/wasm` with gzip. The single-player entry stays at 169 kB gz and holds no Automerge code and no modulepreload of it; N2 checks this with a grep of the entry chunk.
- **Pin exactly**, with `--save-exact`: `@automerge/automerge@3.5.0` and every `@automerge/automerge-repo*@2.5.6`. npm's `latest` tag for automerge-repo points at `2.6.0-alpha.3`. `…-network-messagechannel@2.5.6` is a devDependency for the tests.
- **`ImmutableString`** is imported from `@automerge/automerge/slim`, the same module instance the repo initialises. Verify this in N1.
- **Repo cost:** `dist/` is committed, so the wasm enters git once per Automerge version.

**`net/automerge-store.js`.** `new AutomergeStore(handle)` implements `MatchStore`:
- `entries()` decodes `String(imm)` with a per-index cache;
- `append(e)` is `handle.change((d) => d.log.push(new ImmutableString(encode(e))))`;
- `subscribe` wires up `handle.on('change')`.

It never initialises the wasm, so `sim/peers.mjs` imports it under Node's `node` export condition and hands it handles.

**Transport.**

- `wss://sync.automerge.org` stores and forwards, so asynchronous play and late joins work. Its terms: "as-is", for prototyping, no privacy (the URL is the capability). See open question 2.
- BroadcastChannel covers tabs in the same browser.
- `?sync=ws://127.0.0.1:3030` points at a self-hosted `@automerge/automerge-repo-sync-server` (0.3.0). That is the escape hatch, and also the browser test rig.
- IndexedDB keeps the doc locally, so reload and rejoin work offline.

**Presence (`net/presence.js`).** `handle.broadcast` sends `{dev, seat|-1, name, head, hash, sel?, tg?}` on change and every 5 s, and is never persisted.

- **Net badge:** "online · 2 watching", "reconnecting", or "offline · your moves will sync".
- **Opponent ghost:** the opponent's selected unit gets a dashed ring in their colour, with a line to their chosen target.
- **Hash cross-check:** spectators compare `{head, hash}`. That is the only cross-check in an all-AI match, where no `h` ever flows.

**Joining, rejoining, spectating.**

- **Load:** from IndexedDB, or `await repo.find(url)`. An unknown doc rejects with "unavailable", shown as "Match not found; is the host online?".
- **Then:** `verifyStart`, a quiet fold (0.25-0.28 s of logic for a whole AI-heavy battle), and `snap`. Join time is dominated by baking figures, which the template cache addresses.
- **Spectators:**
  - get the broadside camera and their own speed control;
  - can scrub history by refolding `start + accepted[0..k]`, with "watch from the start" as a replay;
  - get a JSON replay export from the log.

**AI in online games.** Every peer runs it, with no host required (§0.2 row 9).

**Validation and authority.** This is the Folder in §2.6. Rejected entries stay in the log, inert, and every peer rejects the same ones.

**Desync.** The match freezes on all seated clients, through the out-of-band `desync` entry. A dialog offers a downloadable report containing:
- setup;
- raw entries;
- accepted and rejected entries;
- the entry where it diverged, and both hashes;
- the last 50 trace lines;
- `shadowState`;
- user agent, `CORE_VERSION`, `RULES_ID` and the URL.

**Versioning.**

- **`CORE_VERSION`** is a manual integer, bumped whenever consensus behaviour changes. The parity suite forces the bump, because any such change breaks a baseline.
- **`RULES_ID`** is computed at module load: cyrb53 over canonical JSON of the rule-bearing data. That is every race field except `name`, `short`, `abilities`, `icon`, `look` and `fx`, left out at every level (so a unit's or a weapon's rename doesn't move it), plus the `PHASES` keys (their names are banner copy), the constants and, from R3, `SETS`.
- **A mismatch with `start`** opens the match read-only: "This battle was made with a different version of the game". A deploy therefore orphans matches in progress (open question 4).

**Tamper detection.** Accepted ids are cached per doc in IndexedDB. If a previously accepted id vanishes from the list, the status becomes `tamper` and the match freezes with a report. An entry that becomes rejected after a concurrent insert is legitimate and is not tamper.

**Dice fairness: v1 is "friendly".**

- The seed is public but jointly derived, so nobody can grind it.
- Anyone with devtools can predict hypothetical rolls. The active player could fork `G` and search action orders, and the advance roll is visible before its move by the rules.
- `setup.diceMode: 'fair'` is reserved. It means per-command hash-chain reveals from both players, about 70-90 round trips a battle, both players online, and its own baselines. It may only reseed `G.rng` at a command boundary.
- This is open question 1.

### 2.8 Race, unit, weapon and ability data

**Abilities are flags on the data.** Each flag is read by exactly one rules module. Card text is never read by rules.

- Stat lines stay flat, so `u.t.M` still works.
- `name`, `short` and weapon `name` are copied verbatim, because they appear in traced log lines.
- `look`, `icon`, `abilities` and `fx` are presentation.

```js
// data/schema.js
defineRace({ key, name, short, icon, look: { team, dark, alt, gore: [a, b], voice, models, anim }, army: [unitKey…], units: { [key]: UnitDef } })
UnitDef = { name, short, role: 'Troops'|'Elite'|'Fast'|'Hero'|'Monster'|'Artillery', models, base, pts, ai: 'melee'|'raider'|'line'|'shooter'|'hero'|'artillery',
            stats: 'M7 WS4 BS4 S3 T3 W1 A1 Ld6 Sv6 OC2', ranged: Weapon|null, melee: Weapon, abilities: [text…],
            fly?, wrecker?, big?, hero?, chargeAfterAdvance?, noCharge?, brawler?, burrow?, swarm?: {min}, swoop?: {chargeS} }
Weapon  = { name, range?, shots?, S, AP, D, assault?, heavy?, indirect?, blast?, scenery?, poison?, corrodes?, spell?, mesmerize?, fx }
// derived (each overridable): M…OC from stats · move = fly ? 'fly' : wrecker ? 'wreck' : burrow ? 'burrow' : 'walk'
//   brawler = !ranged || wrecker  (reproduces ai.js 204: oakguard and sidewinder have ranged:null)
//   noCharge = role === 'Artillery' (924) · hero from role 'Hero' · deployRow = Artillery ? back : hero ? mid : front (388-391)
//   eye = big ? 1.9 : fly ? 1.5 : 0.95 · chest = big ? 1.0 : fly ? 1.0 : 0.55 (410-411)
```

| Flag | Read only by |
|---|---|
| `fly` | `moveMode`, `inCover`, derived eye/chest |
| `wrecker` | `moveMode`, `resolveWalk` smashing, derived `brawler` |
| `big` | `blastLands` (`ceil(d6/2)+1` hits, 799), eye/chest |
| `hero` | `leadership` aura, `deployRow` |
| `chargeAfterAdvance` | `canCharge` (was `startsWith('Sidewind')`, 925); the Advance button text (was 1725) |
| `noCharge` | `canCharge` |
| `assault` | `canShoot`, AI advance choice |
| `heavy`, `indirect` | `shotInfo`, AI `shotValue` |
| `blast`, `scenery` | `blastVolley`, `blastLands` |
| `poison` | `woundNeed` (and so `expected`, the AI and the odds, all through the same function) |
| `corrodes` | `blastLands` → `terrain.blast({acid})` (was `w.fx === 'acid'`, 814) |
| `spell`, `mesmerize` | `doShoot`'s branch |
| `burrow`, `swarm`, `swoop` (F5) | `moveMode`/nav, `fight` wound re-roll, `fight` strength bonus on the charge turn |

```js
// data/races/squirrel.js: plain data; data/schema.js runs defineRace over each race file as it builds RACES
// (a race file that called defineRace itself would reach schema.js's tables before they exist, through the import cycle)
const KNIVES = { name: 'Twig knives', S: 3, AP: 0, D: 1 }
export default { key: 'squirrel', name: 'Bushtail Clans', short: 'Bushtails', icon: '\u{1F43F}\uFE0F',
  look: { team: '#ec8a34', dark: '#7a3d12', alt: '#c75ad6', gore: ['#cf6d2a', '#f1dcb5'], voice: 'squeak', models: 'squirrel', anim: 'squirrel' },
  army: ['elder', 'oakguard', 'nutkin', 'nutkin', 'grenadier', 'glider', 'trebuchet'],
  units: {
    nutkin:    { name: 'Nutkin Skirmishers', short: 'Nutkin', role: 'Troops', ai: 'shooter', models: 6, base: 0.3, pts: 7,
                 stats: 'M7 WS4 BS4 S3 T3 W1 A1 Ld6 Sv6 OC2', melee: KNIVES, abilities: ['Scurry — may shoot after Advancing.'],
                 ranged: { name: 'Slingshots', range: 18, shots: 2, S: 3, AP: 0, D: 1, assault: true, fx: 'acorn' } },
    grenadier: { name: 'Acorn Grenadiers', short: 'Grenadiers', role: 'Troops', ai: 'shooter', models: 5, base: 0.3, pts: 11,
                 stats: 'M6 WS4 BS4 S3 T3 W1 A1 Ld7 Sv5 OC1', melee: KNIVES, abilities: ['Blast — lobs 2 templates; a miss scatters D6+1".'],
                 ranged: { name: 'Blasting acorns', range: 12, shots: 2, blast: 1.6, S: 4, AP: 1, D: 1, scenery: 1, fx: 'bomb' } },
    oakguard:  { name: 'Oak Guard', short: 'Oak Guard', role: 'Elite', ai: 'melee', models: 5, base: 0.34, pts: 22,
                 stats: 'M5 WS3 BS5 S4 T4 W2 A2 Ld8 Sv3 OC1', ranged: null, melee: { name: 'Pinecone halberds', S: 5, AP: 2, D: 1 }, abilities: [/* verbatim */] },
    glider:    { name: 'Glider Wing', short: 'Gliders', role: 'Fast', ai: 'raider', fly: true, models: 4, base: 0.32, pts: 15,
                 stats: 'M12 WS3 BS4 S3 T3 W1 A2 Ld7 Sv5 OC1', melee: { name: 'Hooked claws', S: 4, AP: 1, D: 1 },
                 ranged: { name: 'Thorn darts', range: 10, shots: 2, S: 3, AP: 1, D: 1, assault: true, fx: 'dart' } },
    trebuchet: { name: 'Pinecone Trebuchet', short: 'Trebuchet', role: 'Artillery', ai: 'artillery', big: true, models: 1, base: 1.05, pts: 95,
                 stats: 'M3 WS6 BS4 S3 T5 W7 A2 Ld7 Sv4 OC0', melee: { name: 'Crew mallets', S: 3, AP: 0, D: 1 },
                 ranged: { name: 'Flaming pinecone', range: 36, shots: 1, blast: 3, S: 6, AP: 1, D: 2, indirect: true, heavy: true, scenery: 3, fx: 'pinecone' } },
    elder:     { name: 'Elder Chitterwick', short: 'Elder', role: 'Hero', ai: 'hero', hero: true, models: 1, base: 0.42, pts: 80,
                 stats: 'M6 WS3 BS3 S4 T4 W5 A3 Ld9 Sv4 OC1', melee: { name: 'Rootwood staff', S: 5, AP: 1, D: 2 },
                 ranged: { name: 'Thornburst', spell: 6, range: 18, shots: 1, blast: 2.4, S: 5, AP: 2, D: 1, scenery: 2, fx: 'thorns' } } } }
// data/races/serpent.js: same shape; names, shorts and ability text verbatim from rules.js 81-125
//   key 'serpent', 'Coil of Ssithra' / 'Serpents', icon '\u{1F40D}', look { team '#46c27a', dark '#14532d', alt '#4aa8e8', gore ['#3f8f4a','#d9cf86'], voice 'hiss', models/anim 'serpent' }
//   army ['hierophant','brute','scaleguard','scaleguard','spitter','sidewinder','engine']
//   scaleguard Troops ai 'line'     6×0.32 10  'M5 WS3 BS5 S4 T4 W1 A1 Ld7 Sv4 OC2'  Javelins 8" ×1 S4 AP0 D1 · Serpent spears S4 AP1 D1
//   spitter    Troops ai 'shooter'  5×0.32 12  'M5 WS4 BS3 S3 T4 W1 A1 Ld7 Sv5 OC1'  Venom spit 12" ×2 S2 AP1 D1 poison 4 · Fangs S3 AP0 D1 poison 4
//   sidewinder Fast   ai 'melee'    4×0.34 24  'M10 WS3 BS5 S4 T4 W2 A2 Ld7 Sv5 OC1' chargeAfterAdvance, ranged null · Twin sickles S4 AP1 D1
//   brute      Monster ai 'melee'   1×0.95 125 'M6 WS3 BS6 S6 T6 W9 A4 Ld8 Sv4 OC4'  big, wrecker, ranged null · Crushing coils S7 AP2 D2
//   engine     Artillery ai 'artillery' 1×1.05 100 'M4 WS6 BS4 S3 T6 W7 A1 Ld7 Sv3 OC0' big · Acid globe 30" ×1 blast 2.6 S5 AP2 D2 poison 3
//              indirect heavy scenery 4 corrodes fx 'acid' · Crew hooks S3 AP0 D1
//   hierophant Hero   ai 'hero'     1×0.45 85  'M5 WS3 BS3 S4 T5 W5 A3 Ld9 Sv4 OC1'  hero · Mesmerize spell 7, 18", mesmerize, fx 'gaze' · Fang staff S5 AP2 D2 poison 3
```

`sim/data-check.mjs` deep-equals the normalised types against legacy `TYPES` (minus `side`, plus the derived fields). It also checks that `RULES_ID` changes when a stat changes and does not change when a name changes.

### 2.9 Terrain: recipes, sets, meshes

```js
ChunkDef = { id, kind: 'block'|'tree'|'hedge'|'rock'|'crate'|'mushroom'|'floor'|'rubble'|'log' (+ 'deck'|'stair' F7),
             hp, maxHp, destructible, alive, navKind: 'hard'|'soft'|'diff'|null, los: 'block'|'obscure'|null, cover,
             shape: { x, y, z, hx, hy, hz, yaw, reach }, nav?, coverShape?, level?, trunkH?, trunkR?,
             col?: { blocks: [chunk…], x, z, yaw, style, by, rubble, w, t },   // a wall column, shared by its blocks
             surface?: { y, ramp?: { axis, y0, y1 } }, supports?: [id],          // F7
             look: { piece, chip?, leaves?, …what the layout stream decided for that piece } }
// look.piece: box | log (a wall block) · cap · tree (its trunk: { h, r }) · hedge · boulder · crate | barrel | sack · mushroom · floor
//             · rubble { style } · fallen { tree, dx, dz } (a toppled tree's log: the tree's own mesh, keeled over)
// look.chip: the debris colour (a block's colour; '#9a7048' for a crate) · look.leaves: what bursts from it
// core/terrain/sets.js: the selection table is data; recipes stay code
export const SETS = { classic: { centre: [['tower', 0.55], ['rockbox', 0.8]], kinds: [['ruin', 3.2, 4], ['wall', 3.6, 2], ['forest', 3.2, 3],
  ['hedgerow', 3.4, 2], ['rocks', 2.0, 2], ['barricade', 2.0, 2], ['mushrooms', 2.0, 1.5], ['obelisk', 1.6, 1]],
  pairs: [6, 3], attempts: 1200, mirror: 'point', margin: 0.5, selfGap: 1.4, deployMargin: 1, bigNotInDeploy: 2.1,
  notInDeploy: ['forest'], objectiveGap: 2.2, gap: 2.1 } }   // F7 adds `fortified`; `classic` is frozen; recipes.js checkSet runs on each at load
```

- **The trap.** `generate` draws visual values from the same `mulberry32(seed)` stream as the layout: colour picks and scale jitter (170-174), canopy blobs (206-235), berries, moss. `recipes.js` must make **every** `rng()` call in the same order and **record** the results in `look`. `view/terrain.js` then builds meshes with no randomness.
- **Purely cosmetic randomness stays in the view, on `Math.random`:** rubble pieces (648-659), shudder (577) and leaves. The rubble piece count `r.pieces` is visual only.
- **Destruction is already instant in logic.** `collapse` lowers `shape.y` (624), and `topple` adds the log chunk (691). They now emit events where today they create tweens.
- **Iteration semantics are preserved.** `smashAround` walks the **live** chunk array, so a fresh log can be smashed in the same sweep. `blast` walks a copy (548). Chunk ids are per match.
- **Adding a kind to `classic` would change every classic board's draws**, so new pieces only ever go into new sets, selected by `setup.terrain`.
- **The same seed gives the same defs**, so the title, lobby and battle reuse one `TerrainView` with no rebuild flash.

### 2.10 Navigation and LOS, ready for elevation

`scenery.los` is already a 3D segment-versus-oriented-box test (522-540, 702-721). Elevation needs correct heights, not a new LOS model.

```js
nav.hasHeight                        // false on every classic board → every height branch is skipped (a separate path, not "+0")
nav.floor: Float32Array              // walkable height per cell
nav.cliff: Float32Array              // distance to the nearest neighbour step > STEP (0.3"); built only when hasHeight
nav.standable(i, r, mode, forbid)    // + cliff[i] ≥ r − 0.06: a base never straddles a ledge
nav.reach(sx, sz, { r, max, mode /* walk|wreck|fly|burrow */, forbid })   // + step allowed iff |Δfloor| ≤ STEP (stairs are ramps); cost += |Δfloor|
nav.path / walkable                  // + no string-pull across a level change
q.groundY(G, u, m)                   // floor under the model; 0 when !hasHeight
q.sight(G, a, b, from)               // eye.y = groundY(a) + t.eye; target.y = groundY(b, m) + t.chest
q.gap / engagement                   // + |Δy| ≤ 1.2" to count as engaged
inCover                              // a cover raster applies only at its chunk's base level (a parapet covers the deck, not the ditch)
```

`burrow` mode (F5) gets its own clearance field. It passes under soft and difficult scenery, and must end on a cell that is standable on foot. Commands stay a single cell index `c`, because a 2.5D heightfield has exactly one floor per cell. Bridges are a non-goal.

### 2.11 Camera presets and HUD model

```js
// present/camera-presets.js: pure, unit-tested
export const PRESETS = { title: { orbit: { centre: [-5, 0, 0], radius: 25, y: 13, speed: 0.035 } },          // 2044-2049
  broadside: { azimuth: 0, elevation: 0.77, fit: 'length' },                                              // seat 0 (west) left
  behind: (edge) => ({ azimuth: edge < 0 ? -Math.PI / 2 : Math.PI / 2, elevation: 0.9, fit: 'width' }) }
export const battleView = ({ localSeats, edges }) => localSeats.length === 1 ? PRESETS.behind(edges[localSeats[0]]) : PRESETS.broadside
```

- **The preset keys off the seats on this client**, never off a count of human players. Two online players each get their own `behind` view. Spectators, watch mode and hotseat get the broadside.
- **`CameraRig.fit(preset, aspect)`** solves the distance from fov and aspect, with HUD padding. Maximum distance is per preset: a portrait broadside needs about 86", above today's fixed 75 (line 56). This replaces `defaultView` (2065-2068).
- **Follow policy:** never during the local player's own decision (1173-1174, generalised).
- **The view-cycle button** switches between behind-me, broadside and top, local only and remembered in `localStorage`. Hotseat can opt in to "swing to the active side".
- **`hudModel({ G, mirror, session, input })`** is pure, and reads `G` only when idle. It returns:
  - `sides: [{name, who: 'You'|'AI'|name|'name · offline', active, vp}]`;
  - `round: 'Round r / R'`, or `'Round r · overtime'`;
  - `end: {show, label, busy: !idle, ready: mine && pending.k === 'phase' && !anyCanAct(G, seat)}`;
  - `advance`, `auto`, `shortest`, `hint`, `rings`, and `waiting: '<name> is choosing a charge spot…'`.
- **`ui/theme.js`** sets `--s0`/`--s1` and the glow colours from the seats' race `look`, using `alt` in a mirror match.
- **Frame budget** (experience-first). Cache each figure template per (race, unit, colour) and clone it: about 12 bakes instead of 52, against about 400 ms today. Dispose per-game geometry; today `clearUnits` (357-364) and `Scenery.clear` leak it. Use one renderer, with the diorama drawn into a scissor viewport.

---

## 3. Landing notes

| # | What lands, where | Consensus impact | Size |
|---|---|---|---|
| **R0: Automerge multiplayer** | **Core: 0 lines.** The seams all exist after R8: commands, `legal`, `Folder`, `MatchStore`, `Session`, `stateHash`, `CORE_VERSION`, `RULES_ID`, per-match RNG and dmath. New: `net/repo.js` (~50), `automerge-store.js` (~90), `lobby.js` (~160), `seed.js` (~60), `presence.js` (~60); `ui/screens/lobby.js` (~150), `ui/netbadge.js` (~40), desync dialog and report (~70), elastic catch-up in `view/player.js` (~40), spectator scrub bar (~60), `#m=` routing and the Play online entry (~50); `sim/peers.mjs` (~250). Pinned deps in `package.json`; **the lockfile in its own commit**. | none (no baselines change) | ~1,100 + tests |
| **F1: Ssithra player faces their own side** | `present/camera-presets.js` `behind(edge)` plus `CameraRig.fit`; `app/flow.js` passes `localSeats`. Applies to both races, so a landscape Bushtail player also gets the behind view (today: broadside); the view-cycle button switches back. | none | ~40 |
| **F2: AI vs AI viewed side-on** | Broadside with a portrait fit and per-preset maximum distance; zero local seats means broadside | none | ~30 |
| **F3: Highlight End when nothing is left** | `hudModel.end.ready`; `ui/actions.js` toggles `.ready`. CSS: End becomes neutral by default, and `.ready` is today's `.primary` plus a pulse (today it is always primary, index.html 44). | none | ~25 |
| **F4: Win screen with "keep playing"** | `engine.js` `score` step plus a `roundLimit` decision; the `vote` handler; `setup.overtime`; `ui/screens/result.js` (a provisional result with live votes, Keep playing / End battle; no continue after a wipe); `hudModel.round` shows "overtime"; `merge-sim` scenarios for concurrent votes | bump `CORE_VERSION`; baselines unaffected (`overtime` absent means `'never'`); add 2 human logs that vote | ~120 |
| **F5: Insectoids and bird-people** | `data/races/insect.js`, `bird.js` (~6 units each, ~100 lines each, each added to `data/schema.js`'s `RACES` registry); flags: `burrow` (nav mode + clearance field ~40), `swarm {min}` (fight.js: re-roll wound 1s while ≥ min models alive; new draws only inside `if (t.swarm)`, ~15), `swoop {chargeS}` (fight.js: +S on the charge turn, ~10); `view/models/insect.js`, `bird.js` (~250 each, plus animators ~40 each); 4 projectile styles; 2 voices; AI needs only `ai:` roles. **Burrowing stays visible**, because a public doc can't hold hidden positions (open question 5). | bump; squirrel and serpent baselines unchanged (they carry no new flags); new matrix baselines for each new pairing, recorded once by `sim/run.mjs` | ~900, mostly data and art |
| **F6: Race select with a mini 3D scene** | `view/diorama.js`: the same renderer with a scissor viewport in the panel's rect, figures laid out from `race.units` via the template cache, idle animators, hover → card. `ui/screens/races.js`, reused in lobby seat cards. Re-shoot and inspect `thumbnail.jpg` if the title changes; the title must still be on screen 1200 ms after load. | none | ~360 |
| **F7: Climbable fortifications** | `core/terrain/recipes.js` (deck, stair, parapet pieces; rampart, bastion, keep ~250); `SETS.fortified`; `terrain.js` surfaces and supports (~50); `nav.js` floor, cliff, step, ramps, per-level clearance (~150); `queries.js` `groundY`, height in LOS, level-aware cover, engagement `|Δy|` (~40); an engine `settle` step after any action that destroys a `surface` chunk: each unit whose floor changed takes D3 mortal wounds (the only new draws, and only then) and moves to the nearest standable cell (~60); `view/terrain.js` (~120); unit y and labels at `groundY`; overlay projected onto deck tops (~60); picking against walkable surfaces (~30); AI height score term (~20); terrain choice in title and lobby (~15) | only under `setup.terrain = 'fortified'`; bump; its own baselines | ~800 |

---

## 4. Migration plan

**Gates.** Every step leaves the game playable and must pass its gate. Each shipping step ends with `npm run build && npm run verify` and a commit of `dist/` (CLAUDE.md). Lockfile changes always go in their own commit.

| Gate | What it checks |
|---|---|
| **P-ai** | 12 existing plus ~12 widened AI baselines: trace **byte-identical**, the shadow snapshot at every state line identical (per engine: in Chromium against `webShadow` where the corpus records one, since the engines' sin/cos differ, §0.1), and every battle-log write identical (`written`, which includes the destroyed-unit lines the trace never shows) |
| **P-human** | the human command logs: trace, shadow and battle log (per engine, as P-ai) |
| **P-browser** | `node sim/parity.mjs --browser`: a fresh build of the code under test in Chromium (`sim/chromium.mjs`), every battle started from its title-screen button; the whole corpus, AI pairs and human logs, or `--only` a few; at milestones only |
| **P-terrain** | ChunkDefs for board seeds 1-500 against legacy `scenery.js`, which imports in Node with a no-op fx proxy |
| **P-present** | mirror equals `project(G)` at every `act` of every log |
| **P-prop** | `legal`/previews never move `rngState`; the AI never issues an illegal command; random legal play never throws |
| **P-merge** | merge-sim agreement |
| **P-peers** | real Automerge two- and three-peer runs |

Everything runs by hand with `npm run parity -w @vibe-dump/tails-and-scales` (and `test`, `peers`). The parity harness runs the **working tree's** `main.js` under the fake-DOM harness through R5, and the pure core with no shims from R6. A failure prints the first diverging line with context; a Node battle that never finishes is stopped at a deadline (`ORACLE_TIMEOUT_MS`, 60 s) and named. `node sim/self-test.mjs [--browser]` checks the harness itself catches what it must.

### Refactor proper (R0-R8): behaviour frozen, no rules or AI changes

| Step | Change | Checkpoint |
|---|---|---|
| **R0 Harness and corpus** | (1) Add `?debug`-only hooks to `__ts`: `select`, `doMove`, `doAdvance`, `doShoot`, `doCharge`, `placeCharge`, `deployClick`, `endPhase`, `autoPhase`, plus getters for `phaseResolve`/`chargePick`/`S`. They are inert without `?debug`. Commit; this sha becomes `sim/oracle/PIN`. (2) `sim/oracle/` is the scratch harness; `run-legacy.mjs` runs `git archive PIN` output, so references come from frozen code. (3) The oracle wraps `__ts.trace.push` to record a **full-precision shadow** at every state line of the trace (each `act`, `phase`, `round` and `over` line: every non-`log` line; `sim/oracle/shadow.mjs`, frozen format): positions, flags, mesmerized, lost, chunk hp and `shape.y`, rngState. (4) `human-bot.mjs` plays human seats through the hooks with its own mulberry32, never `rng()`. Policies: random-legal; `late` (random-legal, plus Auto part-way through a phase, most often straight after an Advance, which produces the `re-advance` logs); and aggressive (wipe-seeking). It covers deploy, advance, fall back, non-shortest and shortest charge ends, a failed charge, and Auto in each phase. Its entries are §2.2 command bodies; what the corpus stores is in the R0 notes below. (5) Corpus: ≥6 vs-AI (both sides) plus ≥6 hotseat human logs, ≥3 ending in a wipe-out; ~12 extra AI pairs chosen to show friendly fire, mesmerize, flee, wrecked, fizzles, failed charges. **A log or pair is admitted only when Node and Chromium agree** (browser via `sim/chromium.mjs`, which drives human logs through the same hooks driver). | 12/12 existing identical (done). Each human log reproduces twice. **Mutation check:** a build with one swapped die fails and names the first divergent line. Hooks inert (`sim/hooks-inert.mjs`: the unminified and the identifier-keeping builds are identical outside the hook block; the shipped minified bundle also differs by identifier renaming). |
| **R1 Per-match RNG and hypot** | `core/rng.js` `createRng`; main.js holds `G.rng`; `d6(G)`/`roll(G,n)`; ai.js draws via `G`. `core/dmath.js` `hypot` (2-arg V8 port) replaces `Math.hypot` in logic, and `hypot3` too if it matches V8 on 5M samples. | P-ai, P-human. The `perturb.mjs` probe on `hypot` alone: 0/12 diverge. |
| **R2 Race data and seats** | `data/schema.js`, `squirrel.js`, `serpent.js`, `compat.js` (`TYPES`/`ARMIES`/`SIDES` views); `G.seats` with race, edge, ctrl; every side-hard-wired site in §2.1 → `edge`/race `look`; flags `chargeAfterAdvance`, `corrodes`, `noCharge`, `brawler`; `ROLE` → `t.ai`; `RULES_ID`; the key/ability/fx lint | `data-check` deep-equal; P-ai, P-human. New: serpent-vs-serpent, squirrel-vs-squirrel and swapped-seat AI games finish, twice identically (no baseline, determinism only). |
| **R3 Terrain split** | `core/terrain/{terrain,recipes,sets,geom}.js`, `view/terrain.js`, a `Scenery` facade so main.js is untouched | P-terrain (shape, hp, navKind, los, cover, order, `look` against legacy mesh parameters); P-ai, P-human; screenshot diff of 3 tables with tufts hidden |
| **R4 State and queries** | `G` owns units, objectives, terrain, nav, turn, journal; queries become `(G, …)`; unit logic/view split (`UnitView` map by id); ids per match; `refreshNav(G)` at the same sites. The `?debug` block keeps the `__ts` surface the parity driver reads (R0 note below), adapted in place, e.g. `q.canAct: (u) => canAct(G, u)`; `sim/oracle` is never edited for it, since the PIN and the working tree run one driver. The `Scenery` facade goes: `G.terrain` is the `Terrain`, and its reports go through `emit(G, …)` into `G.out` (or an `out` passed per call), never a callback stored on it (§0.2 #12). Two R3 tools drive the facade and move with it: `sim/terrain-check.mjs` (P-terrain, a standing check) is ported to `Terrain` and `TerrainView` directly, and `sim/terrain-shots.mjs` is ported to what the `?debug` block then exposes, or retired explicitly (R3 notes). | P-ai, P-human (shadow included); P-terrain |
| **R5 Synchronous actions** | One file per commit: damage → morale → fight → charge (split) → shoot → move (`resolveWalk`). Each `await` becomes `emit` in place. main.js wraps each call as `fn(); await player.play(drain(G))` through a transitional `EventPlayer` holding the old visuals verbatim. **From the first file:** the mirror, display positions and event-driven labels, flags and VP. | P-ai, P-human after each file; P-present from the first file; one game watched per file; P-browser after the last |
| **R6 Engine and commands** | `core/engine.js` step machine and `G.pending` (built **beside** the old loop, switched only at full parity); `commands.js` `legal`/`HANDLERS`; AI generators plus `hold`; `rng.lock`; `match/store.js` `LocalStore` and `match/session.js` (plain bodies, no envelopes yet); input produces commands; `phaseResolve`, `S.deployDone`, `S.chargePick`, `S.busy`, `S.auto` deleted; `compat.js` deleted, its live consumers moved: `sidesFor` and `isMirror` (pure functions, which Node scripts still import) to view code, either main.js's view until R7 or `ui/theme.js` created now, their §2.11 home (not `present/`, which may not import `data/`), flag-lint's `data/compat.js` allow entry and self-test lines moving with them; `CLASSIC` to the setup's default seat races, beside the classic mission in `data/mission.js`; `sim/data-check.mjs` builds its legacy-shaped `TYPES`/`ARMIES`/`SIDES` from `RACES` itself and keeps comparing them with the fixed R0 commit; `sim/run.mjs`; `sim/boundaries.mjs`, which runs flag-lint's key/text/`fx` ban over `core/` and `data/` with its allow-list (`data/schema.js` names `.fx` and `.abilities` to validate them, so a bare token grep would fail on it); the parity harness switches to the pure core. The human logs' entries are already command bodies, so the Node fold applies them directly. For the browser half, the `?debug` block implements the R0 `__ts` surface over the Session, so `sim/oracle` and `sim/chromium.mjs` run unchanged (one driver for the PIN and the working tree): the input hooks become promise-returning wrappers that build a body and call `session.submit(seat, body)`, settling once `player.idle` again (`doMove(u, c)` → `{t:'move', u:u.id, c}`, `placeCharge(c)` → `{t:'chargeEnd', c}`, `deployClick` keeps its select-then-place pair ending in `{t:'place'}`, `endPhase` and `autoPhase` likewise; `doCharge`'s promise stays pending until the `chargeEnd` is placed, as today). The block derives the rest: `select(u)` sets `S.reach` to a plan `validEnd(plan, i)` accepts; `phaseResolve` is truthy iff a local seat holds a `phase` decision in `G.pending` and `player.idle`; `chargePick` is `{u, plan:{cell}, ok}` from a pending `chargeEnd` (ok a per-cell boolean array); `S.busy` and `S.auto` read `!player.idle`; `S.deploySide` comes from the pending deploy seat; the turn fields, `units` and `scenery.chunks` keep the legacy shapes, and the shadow and battle log come from the G adapter (§2.6). (The legacy double advance after Advance-then-Auto was fixed before the corpus was recorded, commit 33946a4, so P-prop's "the AI never issues an illegal command" holds without exception.) | **Headless pure-Node fold (no fakedom, no three) reproduces every AI and human baseline**, about 0.3 s per battle. P-prop, P-present, boundaries green. P-browser (the whole corpus). |
| **R7 View and UI decomposition** | stage, clock, camera rig and presets, table, objectives, units, terrain view (with `TerrainView.sync`, building the table from the chunks as they stand, which the snap needs: R3 notes), overlay, input tools, `ui/*`, screens, `present/hud-model.js`, `PACE`, fallback handler, template cache and dispose, compatibility `__ts` getters | No logic touched: P-ai, P-human unchanged; P-present; P-browser (which presses the title screen's `[data-mode]` buttons and reads `#logList`); the `?debug` snap-equivalence diff holds after every drained queue; `renderer.info` and heap after 5 rematches; title still up at 1200 ms (thumbnail unchanged) |
| **R8 Netplay seams (pure)** | `core/hash.js` `stateHash`; `CORE_VERSION = 1`; `RULES_ID` in `start`; `match/envelope.js`; `match/fold.js` `Folder` (all of §2.6: seat, device, prev, h by kind, out-of-band, caps, desync freeze); `Session` goes through `Folder`, so single-player exercises the validator; `sim/merge-sim.mjs` | P-ai, P-human now **through the Folder** with envelopes. **P-merge:** K peers over random linear extensions of the causal DAG of appends (each peer sees a causally closed subset ordered by one fixed tie-break rule, like Automerge) with stale `prev`, out-of-turn, duplicate, junk, same-seat fork and concurrent deploy; all agree on `{accepted, rejected, stateHash}`, and the accepted trace equals the single-process trace. **Desync drill:** patch `hypot` in one peer, and both freeze at the same entry with a report. |

**R0 as built.**
- **Corpus.** `sim/baselines` commits inputs and hashes only: `pairs.json` (seed and dice, plus `engines`: the Node and the Chromium that recorded the corpus) and `human/*.json` (`{setup, bot, why, n, trace, shadow[, webShadow], written, entries}`), with a 10-hex hash per trace line, per shadow snapshot and per battle-log write. Full texts are regenerated from the PIN code on demand (`node sim/parity.mjs --pin --dump <dir>`). `sim/corpus.mjs` rebuilds it, seeded. Chromium runs a fresh build of the PIN code for admission, and nothing is written unless the run is complete: every original admissible, every quota and coverage target met (`--no-browser` only previews). It holds the 12 originals plus 12 AI pairs, and 16 human logs: 4 per vs-AI seat and 8 hotseat. Six end in a wipe-out: by the AI's shooting, in a fight, by a human's shot, and by a human's own friendly fire. The logs cover deployment, advances, falling back, both charge ends, a failed charge, Auto first and after acting, and the AI advancing an already-advanced unit again after Auto.
- **Three streams, per engine.** Admission means the Node and Chromium **traces and battle logs** agree. The shadow is compared within one engine: Node against `shadow`, Chromium against `webShadow` where the corpus records one (§0.1). The battle log (`written`) is every entry put into `#logList`, which pins the destroyed-unit lines the trace never shows.
- **The PIN.** `sim/oracle/PIN` names two commits. The PIN is the one whose code produced the committed hashes; references and failure context come from it. `hooks` is the commit that added the `?debug` hooks, which `hooks-inert.mjs` checks by default. After the R0 commit, both are set to its sha in a commit of their own. A deliberate re-record (`--record` then `--record --browser`, N0's `CORE_VERSION 2`, the F4, F5 and F7 baselines) moves the PIN, and only the PIN, to the commit whose code produced the new hashes, in the same push; `node sim/parity.mjs --pin` must pass after it. Until it does, parity shows hashes instead of stale context and `mutation.mjs` reports inconclusive. Revisit this rule at R6, when `sim/run.mjs` regenerates references.
- **The `__ts` contract.** The comment at the top of main.js's `?debug` block lists everything the parity driver reads (`sim/oracle/*` and `sim/chromium.mjs`, which the PIN and the working tree share): the `S` fields, `trace`, the unit, chunk and nav fields, `validEnd`, `phaseResolve`, `chargePick`, `start`, the input hooks, and the ten `q` members (`alive`, `isEngaged`, `canAct`, `movePlan`, `freeSpot`, `shootTargets`, `shotInfo`, `chargeTargets`, `chargePlan`, `rngState`) with today's arity and the result fields `sim/` reads: `shotInfo().ok`; `chargePlan()` null when unreachable, else a plan with `.need`; `freeSpot()` null or `{x, z}`; `movePlan()` the plan `validEnd` takes; target lists holding the unit objects themselves. Replaying a log depends on the hooks, `alive`/`isEngaged`/`canAct`, `shotInfo().ok`, `chargeTargets`, `chargePlan`'s null and `rngState()`. `.need`, `freeSpot` and `movePlan` feed only the corpus policies, so parity alone won't catch a reshape of them. R2-R7 keep the surface working inside that block, mapping members in place (`rngState: () => q.rngState(G.rng)`, §2.2; from R6 derived from the Session). Outside `__ts`, `sim/` wraps `#logList`'s `prepend` and, in Chromium, presses `#title`'s `[data-mode]` buttons. The oracle refuses code older than the PIN (it has no hooks) and setups the legacy URL can't carry, across the whole corpus: a step that adds logs it can't carry (F4, F5, F7) loosens `legacyMode` in the same step. Other `sim/` tools may read more of `__ts`, and nothing promises them those members: `sim/terrain-shots.mjs` (R3's screenshot diff) also reads `clock.speed` and `clock.time`, `S.titleSpin`, `camera`, `renderer`, `scenery.scene`, `scenery.blast` and `units[].models[].mesh` (R3 notes).
- **The driver** checks what the UI's own gates check before each entry: the seat holds the pending decision, the command answers that kind of decision and belongs to the current phase, then the per-command query. A log that breaks one stops with an error naming the entry.
- **Checks.**
  - `sim/mutation.mjs` swaps one die. It exits 2, inconclusive, when the swap changes nothing.
  - `sim/hooks-inert.mjs` compares everything outside the `?debug` block's body by parsing. It also compares every other source file at any depth, `vite.config.js`, `package.json` outside `scripts` and `gallery`, the root shared config and the locked `three`. Its `--self-test` shows it catches edits before the block, after it, in an `else`, in a second block, in another module, in a new subdirectory, in the Vite config and in a dependency, and that it passes a scripts-only edit.
  - `sim/self-test.mjs` shows the harness refuses wrong-phase commands and runs through a symlinked path. It stops a battle that spins forever (`ORACLE_TIMEOUT_MS`) and names it, and fails a build that drops the destroyed-unit lines. With `--browser`, it fails a title screen whose buttons start nothing, on one watch and one hotseat battle it picks from the corpus by mode. (It named `hotseat-late-3` until R2, which is not in the corpus, so `--browser` exited 2; R2 fixed this harness bug.)
- **Spec changes made at R0 (approved by the lead).** Beyond R0's own row, R0 changed:
  - §0.1: the per-engine trig fact; `atan` added to the logic `Math.*` list, N0's dmath list and the lint.
  - §2.2: `q` re-exports the whole `__ts` query set, `rngState(r)` included.
  - §2.6: the parity shadow is `shadow.mjs`'s legacy format, not `shadowState`. A G adapter keeps its quirks through R8 and rebuilds the battle log from `G.journal`.
  - The gate rows: P-ai and P-human snapshot every state line, check the battle log and compare per engine. P-browser is the whole corpus on a fresh build, started from the title buttons.
  - R0's checkpoint: the hooks-inert criterion, and admission on traces and battle logs.
  - R4 and R6: the `__ts` obligation, which R6 meets by deriving the surface from the Session.
  - N0's target, and §4.1's statement of who enforces what.

  The lead's decisions on the three open choices:
  1. **Shadows at every state line: kept.** It is the stronger check. The G adapter keeps the round, phase and stage quirks through R8.
  2. **The double advance: fixed, not pinned.** A human's Advance followed by Auto let the AI advance the same unit again (a second D6). That is a rules bug, so it was fixed in its own commit (33946a4: the AI moves an already-advanced unit on its existing roll) before the corpus was recorded. The same commit ends a blast volley whose own unit is wiped out by its first template, which used to crash and soft-lock the game. Neither path occurs in an AI-only battle; the 12 original battles replay identically across it.
  3. **`shadowState` as the parity shadow: no.** The legacy `shadow.mjs` format stays the parity shadow, through the G adapter. `shadowState` remains a debugging aid.
- **Two hooks later steps need (from the R0 review).**
  - **The battle log's position stamp.** The corpus's `written` stream records, for each line put into `#logList`, the trace length at the moment it was written. From R5 the log is an event played later by the presenter, when the trace has run ahead, so that stamp would drift. The `log` event therefore carries `at` (the trace length when the line was logged or flushed, §2.3). `ui/log.js` (and R5's transitional log handler) puts it on the entry as `data-at` under `?debug`, and the instrumentation reads `data-at`, falling back to the live trace length for the PIN code, which has none. No re-record is needed.
  - **Seeing trace lines as the core makes them.** From R4/R6 there is no `__ts.trace.push` to wrap. `createMatch(setup, { out, onTrace })` takes a sim/debug-only callback that `journal.js` calls synchronously with `(line, G)` on every trace push. It never draws, is not part of G's hashed state, and sits beside `out` (so §0.2 #12's "no pending closures in G" still holds). The `?debug` block keeps `__ts.trace` as one page-lifetime array fed by it.

**R1 as built.**
- **`hypot3` landed with `hypot`.** V8's three-argument formula matched `Math.hypot` on 5M board-scale samples, 5M more shaped like `distToBox`'s (non-negative, often zero on an axis) and the edge cases (zeros, NaN, Infinity, extremes); the two-argument one did too. So N0's list is `sin`/`cos`/`atan`/`atan2` only.
- **Every rules call measures with dmath.** main.js 16 sites, ai.js 12, nav.js 7, scenery.js 10 (`distToBox` uses `hypot3`). `Math.hypot` stays only in view and input code: the camera follow, the drag threshold, the deploy click's snap tolerance and the figures' walk speed in main.js, the rubble spill in scenery.js, and fx.js.
- **`G` is `{ rng }` until R4.** It is created at load on a `Math.random` seed, which nothing draws from before a battle, and `start` replaces the generator with `createRng(S.dice)`. The AI reaches it as `api.G`. `lock`/`unlock` exist, but nothing locks until R6.
- **`sim/perturb.mjs --fn <names>`** preloads `sim/oracle/perturb-preload.mjs` into every oracle child, which moves each result of the named `Math` functions one ULP away from zero, and replays the corpus (the AI pairs by default). It runs the same nudge on the PIN code first as a control, and is inconclusive if nothing moves there. For `hypot`: the PIN code moves 24/24 AI battles; R1 moves 0/24 AI and 0/16 human. N0 uses the same probe with `--fn sin,cos,atan,atan2`.

**R2 as built.**
- **Races are data.** `data/races/squirrel.js` and `serpent.js` are plain definitions in the §2.8 shape, names, shorts, weapon names and ability text verbatim. `data/schema.js` checks and normalises them into the frozen `RACES` registry. A race file exports its definition rather than calling `defineRace` itself: schema.js imports the race files to build the registry, and that import cycle would reach `defineRace` before its tables exist. Every flag is a boolean on the normalised type, beside the derived `move`, `deployRow`, `eye`, `chest`, `brawler`, `noCharge` and `hero`. Rules code reads them: `moveMode` reads `t.move`, `eyeY`/`chestY` read `t.eye`/`t.chest`, and `deployArmies` reads `t.deployRow`. `RACES` and each race's `units` have no prototype, so a race or unit name such as `toString`, `constructor` or `__proto__` (from a URL now, from a lobby a peer writes at N2) finds nothing instead of an `Object.prototype` member. Race and unit keys are lower-case letters, digits and dashes. `RACES` is `raceRegistry([squirrel, serpent])`, which refuses two races with one key (a race file copied as the start of another and left with the old key would otherwise hide one of them); a new race file is added to that list. Every table `core/` and `data/` export is frozen, deeply where it nests (`BOARD`, `PHASES`, `CONSTANTS`, `EDGES`, the schema's vocabularies, `RACES`, the compat views), so no importer can change what a later match reads (§4.1 rule 13).
- **Flags replace tests.** `canCharge` reads `noCharge` and `chargeAfterAdvance`, which also drives the Advance button's text. `blastLands` passes `corrodes` to `scenery.blast`. The AI reads `t.ai` instead of `ROLE[u.key]`, and `t.brawler` instead of its key test. `brawler = !ranged || wrecker` covers Oak Guard and Sidewinders because both have `ranged: null`; `sim/data-check.mjs` checks this. Rules code may test `t.role` (the AI still favours Artillery targets): role is rule data, which RULES_ID hashes.
- **Seats.** `core/match.js` has `makeSeats(races, ctrl)`, `raceOf`, `edgeOf` and `ctrl`. `G.seats` is built at load, and `start()` rebuilds it from `S.control`, which stays because `sim/chromium.mjs` reads it. The races are fixed at load because `setupTable` builds the armies on the title screen; `start()` changes only the controllers (`seatPlayers()`). So `?races` is read at load, not in `start()` as the R2 task note had it: applying it in `start()` would seat races whose armies the title-screen table doesn't hold. `human()` reads the seat. Every site in the §2.1 table now reads the edge: facing, the `freeSpot` zone, the deploy x and z flip, the flee exit and yaw, and the zones. The title drift stays for R7.
- **Presentation by seat.** `data/compat.js` `sidesFor(seats)` builds the old `SIDES` records (name, short, icon and colours) for whoever is playing, and main.js's `SIDES` is that view. A mirror match (`isMirror`) gives seat 1 `look.alt`, a hue well away from `team` (blue for the Coil, violet for the Bushtails; both stay apart under red-green colour blindness), because the models are the same for both seats and the base rims, label borders, zones and objective flags are the only cues on the table. `killModel`'s voice and gore come from the unit's race (`RACES[u.race].look`). main.js writes a `<style>` that sets `--s0`/`--s1` and the active seat's glow (`--s0-glow`/`--s1-glow`, which style.css's `:root` defaults to the classic pair) for the HUD, labels, log and card, and fills in the HUD's names and icons. In a mirror match the two seats' names read the same. Of the texts that name a seat outside the HUD, labels, log borders and card, only the turn banner and the end screen's title take the seat's colour (inline, and only in a mirror match; otherwise they keep the stylesheet's); the rest are listed below.
- **Left for R7/F6.** The title screen's copy, its `.m0`/`.m1` mode buttons and their classic colours (`index.html`, `style.css`); the HUD's VP pill ink (`#2a1404`/`#05220f`, dark inks picked for orange and green, still legible on the alt colours); seat names in mirror-match text, which stay the same for both seats and carry no seat colour (the dice tray's roll-off rows, the log's roll-off, deploy and end-of-round lines, the AI hint, the card and the end screen's reason); and a stronger mirror cue on the table than a coloured base rim (a thicker or filled rim, a label background). Any qualifier must be mirror-only: the classic lines are traced, and the oracle records every battle-log entry's HTML, so even a classic line's markup must not change.
- **`?races=<seat 0>,<seat 1>`** picks the seat races for the page (case and spaces ignored). It is URL-only. A value naming no two races makes the page warn, say why on the title card and play the classic matchup (`?debug` or not, so there is no second `?debug` test outside the hooks block); `sim/mirror-check.mjs` fails any run whose log shows other races than it asked for. An oracle job takes an optional `races`, which becomes that parameter in Node (`run-legacy.mjs`) and in Chromium (`sim/chromium.mjs`). Jobs without it run exactly as before. The job's `setup.seats` still names the classic races (`legacyMode` takes only title-screen setups); the step that admits race logs to the corpus folds the races into the setup.
- **`RULES_ID`** (`core/version.js`) is cyrb53 over `canonicalJSON`, printed in base36; `cyrb53` and `canonicalJSON` are in `core/util.js`. The hash covers the races minus `name`, `short`, `icon`, `look`, `abilities` and `fx` as fields of any record (a race, a unit type, a weapon), never as keys of the race and unit maps (a unit keyed `fx` is rules like any other), plus the six constants and the phase keys. Phase names are banner copy, so they are left out. The terrain sets join the hash at R3, and the mission's objectives join when they move to `data/`. `CORE_VERSION` still lands at R8.
- **The ruleset is `core/rules.js`** (the constants, `PHASES` and the dice maths), so `data/` and `core/version.js` import only `core/`. The root `rules.js` re-exports it for main.js and ai.js until R4-R6 move their rules code.
- **Checks.**
  - **The legacy anchor.** `sim/data-check.mjs` and flag-lint's `--self-test` read the legacy code from the R0 commit, named as `LEGACY_REF` in `sim/lib.mjs`, not from the PIN. The R0 commit is the first with the hooks; it, like every commit before R2, holds `TYPES`, `SIDES` and `ARMIES` in `rules.js` and the tests the flags replaced in main.js and ai.js. The PIN moves at every deliberate re-record (N0's `CORE_VERSION 2`, the F4, F5 and F7 baselines, a Chromium-upgrade `--record --browser`) to code that has none of this; those re-records leave `LEGACY_REF` alone. `legacyDir()` refuses an anchor whose `rules.js` has no `TYPES`.
  - `sim/data-check.mjs` compares each type with the R0 code's `TYPES`. It computes the expected flags with the legacy tests themselves, and those tests must appear verbatim in the R0 source.
  - It also checks the races against `SIDES`/`ARMIES` and killModel's voice and gore (by the R0 text); that every race's voice is a sound `sfx.js` plays (its proxy would turn a missing one into silence); that `defineRace` refuses fourteen kinds of broken data (an army listing `constructor` or `__proto__`, a unit keyed `Brute` or `__proto__` among them) and the registry two races with one key; that `makeSeats` seats every race in either seat with the edge by seat, and refuses `toString`, `__proto__`, `constructor`, `hasOwnProperty`, `valueOf` and `''` in either seat; 16 changes that must move `RULES_ID` (a retuned unit keyed `fx` and race keyed `look` among them) against 8 that must not; and that every table `core/` and `data/` export is deeply frozen.
  - `sim/flag-lint.mjs` covers main.js, ai.js, rules.js, `core/` and `data/`. It flags tests on a unit or race key (strict or loose comparisons, a table keyed by either or by a bare `key` other than the `RACES` and `race.units` lookups, list membership, `in`, `switch`, text methods such as `includes` or `localeCompare` on a key, a regex `.test` of one), on a name or short, on text (`startsWith`/`endsWith`), and reads of ability text or `fx`, also by another route: a race named through the registry (`RACES.serpent`, `RACES['serpent']`), a banned field read by its string name, destructured, or aliased into a variable. Its allow-list names the presentation sites, each with a reason; an allowed text excuses only itself, and the rest of its line is linted again. Its `--self-test` must flag every legacy test in the R0 code, and a set of lines that must be flagged (race tests the R0 code can't show, loose, method and regex key tests, tests smuggled beside an allowed one) or must pass (`RACES[u.race]`, `race.units[key]`, the mirror check, role and flag reads).
  - `sim/mirror-check.mjs` plays serpent v serpent, squirrel v squirrel and the swapped seats, three battles each, AI v AI and hotseat with the aggressive bot in both seats, each twice. Every run must reach game over with identical traces, shadows, logs (and bot entries), and its log must show the races it asked for. Every unit still unmoved in the first full-precision snapshot must sit on its seat's edge (seat 0 west, seat 1 east, at least one unit each), and the bot must place at least half of each seat's units. An edge taken from the race instead fails all 18 runs; determinism alone passes it. The classic matchup asked for by URL must replay the 24 AI pairs. With `--browser`, each matchup's first AI battle also runs in Chromium and must trace and write its log as Node did.
- **Transitional.** `compat.js` (`CLASSIC`, `TYPES`, `ARMIES`, `SIDES`, `sidesFor`, `isMirror`) goes at R6. main.js reads `sidesFor`, `isMirror` and `CLASSIC` from it (and `RACES` from `data/schema.js`); the three legacy-shaped views, and `CLASSIC` for the legacy side-to-race pairing, serve data-check. At R6 (see its row) `sidesFor` and `isMirror` move to view code, `CLASSIC` becomes the setup's default seat races, and data-check builds its legacy-shaped views from `RACES` itself, still against the fixed R0 commit.
- **Spec changes made at R2 (for lead approval).**
  - §1.1 `core/match.js`: the seat helpers are `makeSeats`, `ctrl`, `edgeOf` and `raceOf`. `makeSeats(races, ctrl)` is R2's transitional builder; from R4 `newState(setup)` folds over `setup.seats`.
  - §2.8: a race file exports a plain object, and `data/schema.js` applies `defineRace` as it builds `RACES` (the import cycle above).
  - §2.7: `RULES_ID` hashes the phase keys only, and leaves `name`, `short` and `fx` out of every record, so unit and weapon renames don't move it. `SETS` joins at R3.
  - §1.1 `data/compat.js`: main.js reads the seat-based `sidesFor`, `isMirror` and `CLASSIC` from it, and `RACES` from `data/schema.js` directly; the legacy-shaped `TYPES`/`ARMIES`/`SIDES` views serve only data-check. Still deleted at R6, whose row now names where each export goes.
  - §4 F5 row: a new race file is added to `data/schema.js`'s `raceRegistry([…])` list (a consequence of the §2.8 change above).
  - §2.1's table: the title drift is left to R7's camera presets; every other site in it reads the edge at R2.
  - R2's row: `?races` is read at load, not in `start()` (see **Seats** above), and it is a URL parameter, not `?debug`-only.
  - §2.8: the mirror `alt` colours are `#4aa8e8` (Coil) and `#c75ad6` (Bushtails) instead of `#a6e05a` and `#f2c14e`, which sat too close to their `team` colours to tell the armies apart on the table.

**R3 as built.**
- **The split.** `core/terrain/terrain.js` is `Terrain`: the chunks, `add`, `generate`, `los`, `blast`, `hurt`, `destroy`, `collapse`, `rubble`, `topple`, with no three.js, clock or randomness of its own. `generate` is `clear` plus `recipes.js` `scatter`, so the layout policy (the centre rule, the pair count, the spacing rules, the point mirror) is not in the class, and a set with another placement rule (F7) changes `scatter`, not `Terrain`. `recipes.js` holds the seven modules, the nine features (`FEATURES`) and the two centre pieces (`CENTRES`) as ChunkDef producers, with every layout-stream draw in the old order and its visual result recorded in `look`; it also holds `STYLES`, `LEAVES` and `WOOD`, `scatter` (the set's own draws: centre, pair count, then per attempt the feature, its place, its turn and its seed) and `checkSet`. `sets.js` holds `SETS.classic`, and `geom.js` holds `segmentHitsBox` and `distToBox`. `view/terrain.js` is `TerrainView`. It builds each mesh from the chunk's `look` plus its place (`shape.x`/`z`, and `shape.y` for a wall block or cap) and nothing else, and it plays the terrain's events with the old visuals unchanged: shudder, debris, the fall, the topple and the rubble pieces, all on `Math.random`. `scenery.js` is now a facade over the API main.js uses: `generate`, `chunks` (the Terrain's live list), `dirty` (read and written through to the Terrain's), `los`, `blast`, `hurt` and `onBreak` (reaching the view), so main.js is untouched; also `clear`, `features` and `group`, and `scene`, `view` and `terrain` for `sim/`. The old public `destroy`, `collapse`, `rubble` and `topple` are gone from it: main.js never called them, and they are the Terrain's own steps now, so a caller from outside would get the logic without the view's part (a tree toppled that way would keep its canopy). `mulberry32`, `lerp`, `pick`, `rr` and a `deepFreeze` live in `core/util.js`. The root `util.js` re-exports `lerp` (main.js's only use of them) and wraps `pick` to default to `Math.random` for the view, while core's always names its stream; nothing outside `core/` and `data/` needs the others. `data/schema.js` freezes with the same `deepFreeze` (it had its own copy). `generate` tests a set name with `in` on the prototype-less `SETS`, not `Object.hasOwn`, which Vite's default ES2020 target leaves to the engine and older Safari and Chrome builds lack.
- **Logic to view, synchronously.** The Terrain reports through `sink`, a function the facade wires to `TerrainView.apply`. Each event is reported as it happens, never awaited:
  - `terrain.clear`
  - `terrain.add {c}`
  - `terrain.hurt {c, from}`
  - `terrain.destroy {c, from}`, before its consequences
  - `terrain.collapse {drops: [{c, dy}], by}`
  - `terrain.rubble {c, from}`

  These are §2.3's terrain events, names and order, except that they carry the chunk itself (`c`) where §2.3's carry `id` (and `def` on an add), and the view reads the live chunk as each one comes. R5 turns them into §2.3's id-addressed events in `G.out`, the view then keeping each chunk's `x`/`z` from its add and reading `alive` and `y` from the mirror. There is no topple event. A felled tree's log is added with `look: {piece: 'fallen', tree, dx, dz}`, and the view plays the fall on that add, reusing the tree's own group as the log's mesh as before.
  - **The sink is R3's only.** It is a closure stored on the Terrain, which §0.2 #12 forbids in `G` (G holds no pending closures, so `stateHash` and refolding see plain data). So at R4, when `G.terrain` is the Terrain, its reports go through `emit(G, …)` into `G.out` (or an `out` passed per call) instead (R4's row). Queuing them is not a drop-in change for the view: it reads the live chunk (a scuffed block's place, for its debris) when each event comes, and a later collapse in the same blast can lower that block, so queued events need their values in the payload or the mirror (§2.4).
  - **TerrainView is built only by replaying events** from a table's `terrain.clear`: a fallen log is its tree's group keeled over (the add finds the tree's mesh), and a collapsed block is wherever its tween left it. Built from the chunks as they stand, it would draw dead chunks as alive. A snap (R5's EventPlayer `snap`, R7's `?debug` snap-equivalence diff, N3's rejoin and scrub) needs `TerrainView.sync(chunks)`: live chunks at their current `shape`, dead ones skipped, a fallen log built from its tree's look already keeled over without its canopy, a rubble pile with a fresh cosmetic spill. It is R7's (its row), or the first step that snaps the view. Destruction stays instant in the logic: `collapse` lowers `shape.y` and `topple` adds the log. `smashAround` (main.js) still walks the live list and `blast` a copy (§4.1 rule 6). main.js's break sound plays on `terrain.destroy`, which is in the same tick as before but now comes ahead of the collapse and rubble visuals rather than after them. Once audio is unlocked, the sound's noise draws `Math.random`, so the rubble pieces after it draw different values from the same state. That changes nothing that can be observed: `Math.random` is never seeded in play, and no rule reads a rubble piece.
- **Looks.** Each mesh kind has one `look.piece`:
  - `box` and `log`: a wall block (a fallen tree is `fallen`, so a log wall's blocks can't be mistaken for one);
  - `cap`, `tree`, `hedge`, `boulder`, `mushroom`, `floor`, `rubble`;
  - `crate`, `barrel` and `sack`: the three crate variants.

  A look records exactly what the layout stream decided: colours, scale and rotation jitter, the canopy, tufts and berries, moss, the crate's variant and stack, the acorns, the mushroom's spots as (azimuth, elevation) and its tilt, and the forest floor's 23 rim factors. A tree's look also has `trunk: {h, r}`, the same draws as its `trunkH` and `trunkR` (which stay chunk fields: a felled tree's log is shaped from them), so the view reads the look alone, the fallen log's tumble included. The view does the rest of the old arithmetic. The old chunk fields that were presentation moved into `look`:
  - `color`, the debris colour (a block's colour, or `'#9a7048'` for any crate), is now `look.chip`;
  - `leaves` is now `look.leaves`;
  - a cap's `capH` is now `look.h`. Nothing ever read `capH`.

  `col` stays a shared column record, `{blocks, x, z, yaw, style, by, rubble, w, t}`, where `style` is a `STYLES` key. There is no `canopyN`: use `look.canopy.length`.
- **Ids.** Chunk ids come from a per-Terrain counter that restarts at 1 on every new table (`clear`). Only the view's map and a fallen log's `look.tree` read an id, and the parity shadow prints none.
- **SETS.** `SETS` follows §2.9, plus the numbers `generate` used to write inline: `attempts` 1200, `margin` 0.5, `selfGap` 1.4, `deployMargin` 1, `objectiveGap` 2.2 and `gap` 2.1. It has a null prototype and is deeply frozen, like every table `core/terrain` exports. `generate(seed, objectives, deployDepth, set = 'classic')` refuses an unknown set. The centre rule names centre pieces from `recipes.js` `CENTRES` (`tower`, `rockbox`), which keep their footprints (4.6, and 1.8 per rock pile) in code. `sets.js` runs `checkSet` on every set as it loads, the way `data/schema.js` checks a race: each feature (`kinds`, `notInDeploy`) is in `FEATURES` and each centre piece in `CENTRES`; radii and weights are numbers above 0; centre thresholds are in (0, 1] and rise; `pairs` is two whole numbers and `attempts` one; `mirror` is `point`, the only one `scatter` knows; the spacing rules are finite; and no field is missing or unknown. A slip in a new set then fails at load, not only on the boards whose draws reach the bad entry.
- **`RULES_ID`** now hashes `SETS` whole (`rulesData({ sets })`): `eypwgs6v2u`, up from R2's `18vs5wwhm0w`. data-check checks that it moves on a feature's weight, its footprint, the table order, the centre rule, the pair count, a spacing rule, `notInDeploy` and an added set. As a control, an unchanged copy of the sets must hash the same. The recipes' own numbers (`STYLES`' hit points and sizes, the modules' shapes) count as code: changing them is CORE_VERSION's business from R8, and P-terrain catches a change until then.
- **Checks.**
  - `sim/terrain-check.mjs` (P-terrain) builds every board twice, with the R0 code's `scenery.js` (`LEGACY_REF`, real three.js and a no-op fx that records its calls) and with the working tree's facade. It compares them exactly, with `Object.is` on every number:
    - every layout stream's seed and draw count, in order;
    - every chunk's logic fields (id order, kind, shape including `reach`, hp, `maxHp`, `destructible`, `alive`, `navKind`, `los`, `cover`, `nav`, `coverShape`, `col`, `level`, `trunkH`, `trunkR`), and that no field on either side is unaccounted for;
    - each old mesh against the new one: object type, position, rotation, quaternion, scale, shadows, children, geometry type and parameters, every vertex attribute value, material settings and colour, and which meshes share a geometry or material;
    - the whole scenery group.

    Then it runs the same seeded destruction on both, 8 operations per board: blasts (some acid) and wrecker sweeps over the live list, with the tweens stepped to the end and `Math.random` seeded alike. After every operation it compares the chunks, what `blast` returns, `dirty` and every fx call. At the end it compares the whole group (rubble pieces, fallen logs, collapsed blocks) and line of sight. Boards 1-500 match. `sim/terrain-hooks.mjs` counts the draws by wrapping `mulberry32` in memory as each `util.js` loads, so neither checkout is edited on disk. `--self-test` applies nine edits one at a time, and each must fail the check: two draws swapped, one dropped, a look value, a material, `blast` walking the live list, a log's shape, the rubble's spill, a set's gap, and one draw too many at the end of an obelisk, which no chunk, mesh or later draw shows (the next feature reseeds), so only the draw count can catch it. It refuses a run that checks nothing, and bad arguments (an unknown option included), with exit 2: `--seeds` is `N` or `A-B` with A ≤ B, `--ops` and `--max` whole numbers, at least one board compared, and with `--ops` above 0 at least one destruction op run.
  - `sim/terrain-shots.mjs` is the screenshot diff. It makes fresh builds of the R0 code and the working tree and opens each with a seeded `Math.random`. Through the `__ts` both builds already expose, it stops the clock at 0, sets one camera pose and reads back one frame per board, of the table as generated and again after the same blasts on both. It hides the tufts, flowers and figures. Since R1, main.js draws one `Math.random` at load after painting the mat, which shifts every later cosmetic draw by one against R0. `--ref HEAD --full` draws everything, for a ref with the same draws at load. main.js needed no new hook. The default boards are 1, 4242, 90210, 411 (log walls, trees, mushrooms) and 22392 (hedges, trees).
    - **Determinism.** SwiftShader's WebGL draws identical draw calls identically, but Chromium's accelerated canvas 2D raster does not rasterise main.js's mat identically on every page load, though `paintMat` is the same code in every build since R0. One gate run failed on that alone: board 4242's frames differed from R0's by 8,554 and 8,733 pixels, at most 2 per channel, all on the mat, and the same code matched on every later run. A probe hashing the canvas textures over 8 loads of each build saw the mat differ on 1 load in 16 on the accelerated path, and 16 loads in 16 the same with canvas 2D on the CPU. So the gate launches Chromium with `--disable-accelerated-2d-canvas --disable-gpu-rasterization` (its own launch only: parity compares no pixels), and the mat, the wood and fx's decals stay in the comparison. As a control, a board whose shots differ is shot again on both sides in fresh pages, up to twice. A difference in the code is deterministic and repeats on every pass, so the board fails. One that goes away is printed as noise, with how far each side's frames moved against its own first pass, and is not counted. Each run builds into its own temp dir, so runs side by side don't share builds.
    - With those flags, all 10 shots are pixel-identical to R0 on the first pass, in 3 runs out of 3, and all 10 with `--full` are identical to the R2 commit (5f3df5b), figures and tufts included. Identical is not enough on its own, since two blank canvases are identical too. So every frame must hold at least 1,000 distinct colours (a real one holds tens of thousands), the blasts must break something, and each side's wrecked frame must differ from its own table frame by at least 2,000 pixels; otherwise the board fails as vacuous. A board whose page fails to load or throws is reported as not run and counts as a failure, and the run goes on. Page loads wait `IDLE_MS` (`sim/chromium.mjs`, 120 s) rather than Playwright's 30 s, which a busy machine can exceed.
  - **Both tools are R0-R3 only as they stand.** They drive the working tree through the `Scenery` facade, which goes at R4. `terrain-check` imports `scenery.js` and calls `new Scenery`; `terrain-shots` uses `__ts.scenery.scene` and `.blast`. `terrain-shots` also reads view members the `?debug` contract (main.js; R0 notes) does not promise: `clock.speed` and `clock.time`, `S.titleSpin`, `camera`, `renderer` and `units[].models[].mesh`. R7 moves the camera and clock. So R4 (its row) ports P-terrain to `Terrain` and `TerrainView` directly, since it is a standing check (§1.1's `sim/` list), and ports `terrain-shots` to what the `?debug` block then exposes, or retires it explicitly. If R7 wants a pixel diff as a gate, R7 adds it to its gate column and puts the members it reads into the contract comment then, marked screenshot-only (comment-only, so hooks-inert holds). Nothing promises them from R3 on.
  - `sim/data-check.mjs` section 7: `checkSet` passes `classic` and refuses 18 broken sets, one field at a time (a feature or centre piece that doesn't exist, `toString` as a feature, an entry without its weight, a footprint of 0, a weight that is a string or negative, no features, a threshold above 1, falling thresholds, fractional or missing pairs, infinite attempts, an unknown mirror, a NaN gap, `notInDeploy` naming no feature, a misspelt field, a missing one).
  - **No banned token in `core/`, even in comments.** §1.2's `boundaries.mjs` (R6) greps tokens, and `core/` had none of them before R3. R3's comments say "the engine's own unseeded random" and "no randomness but the layout stream", and the tower's window flags are `glazed`, so `Math.random` and `window` appear nowhere in `core/`.
  - Coverage: none of the corpus's 40 boards has a log wall, so parity never builds one. P-terrain's 500 boards build 1,148 log-wall blocks, among 38,258 chunks in 1,243,066 layout draws. Its 4,000 destruction runs break 8,682 chunks and fell 115 trees. 36 of those logs are smashed in the same sweep that felled them (the live list), and 67 lie within the blast that felled them and are spared (the copy).
- **Spec changes made at R3 (for lead approval).**
  - §2.9: the ChunkDef `look` is per piece (above); `col` is a shared record and there is no `canopyN`; `SETS` carries the inline numbers; the centre rule's pieces are `CENTRES` in `recipes.js`.
  - §2.3: the Terrain row now lists R5's target as R3 found it: `terrain.clear`, a `terrain.add` for every chunk (the board's too) whose `def.look` carries a fallen log's `{tree, dx, dz}` so the fall plays from the add and there is no topple event, `kind` on `terrain.destroy`, `by` on `terrain.collapse`, and the view keeping each chunk's `x`/`z` from its add and reading `alive` and `y` from the mirror. R3's sink events are those, carrying the chunk itself (`c`) instead of `id`/`def`; R5 converts them (above).
  - §1.1 and §1.3: `Terrain.generate` is `clear` plus `recipes.js` `scatter`, which makes the set's own draws; `recipes.js` also holds `FEATURES`, `CENTRES`, `STYLES`, `LEAVES`, `WOOD` and `checkSet`; `core/util.js` holds `deepFreeze`; `sim/` gains `terrain-hooks.mjs` and `terrain-shots.mjs`.
  - §2.9: a tree's `look.trunk`; every set is checked at load (`checkSet`).
  - The R0 `__ts` contract and §1.3's boot row: the `?debug` comment lists what the parity driver reads (`sim/oracle/*`, `sim/chromium.mjs`), not everything `sim/` reads; `terrain-shots` reads more, unpromised.
  - R4's row: the facade goes; the Terrain reports into `G.out`, not a stored callback; P-terrain is ported to `Terrain` + `TerrainView` and gates R4; `terrain-shots` is ported or retired. R7's row: `TerrainView.sync`.
  - §1.3, the scenery.js rows (main.js 229-234's row edited): the break sound still goes through the facade's `onBreak` (main.js's hook) until R7 moves it into `view/terrain.js`.
  - §2.7: `RULES_ID` hashes `SETS` from R3, as planned.

**The refactor ends at R8.** At that point:
- the core runs headless in Node;
- every mode goes through one Session and Folder;
- every seam R0 needs exists, and is tested in Node without any Automerge dependency.

### Multiplayer and feature work, in order

| Step | Change | Checkpoint |
|---|---|---|
| **N0 Consensus hardening** | dmath `sin`/`cos`/`atan`/`atan2` (and `hypot3` if it was deferred): pure-JS ports; lint bans the approximated `Math.*` in `core/` and `data/`. "Bit-exact to the shipped V8" can't mean both engines, since Node's and Chromium's sin/cos already disagree (§0.1): match Node's (the baselines' `shadow`) and retire `webShadow`, or take the re-record below. | `perturb.mjs` goes **from 11/12 diverging to 0/12**. If the V8 match fails: `CORE_VERSION 2` and one re-record commit containing only baselines, never mixed with code changes. |
| **F3 → F1 → F2** | §3 | P-ai/P-human unchanged; manual check in landscape and portrait |
| **F4 Keep playing** | §3 | P-ai/P-human unchanged; 2 new vote logs; merge-sim with concurrent votes |
| **N1 Real Automerge in Node** | pinned deps (lockfile commit separate); `net/automerge-store.js`; `sim/peers.mjs`: (a) raw `@automerge/automerge` docs from shared genesis bytes, a manual `generateSyncMessage`/`receiveSyncMessage` pump with random delays and partitions, each scenario run with actor ids **swapped** so both concurrent orders occur; (b) three Repos (host, guest, spectator) over `MessageChannelNetworkAdapter` | **P-peers:** each human log split by seat across 2 peers; a spectator joining in round 3; same-seat fork with rollback; out-of-turn junk; concurrent deploy; desync drill; tamper (delete an accepted entry → `tamper`). All peers agree on `{accepted, rejected, stateHash, trace}`, equal to the single-process fold and the baseline. |
| **N2 Online play** | `net/repo.js` (lazy), lobby with joint seed and `verifyStart`, `#m=` routing, device-to-seat mapping, presence, net badge, elastic catch-up, desync dialog and report, version-skew read-only screen | Entry chunk grep: no Automerge. Playwright (by hand): two tabs over BroadcastChannel, and two isolated contexts over a local `automerge-repo-sync-server` (`?sync=ws://127.0.0.1:3030`), play a scripted mini-battle with equal `h` chains. Plus a manual check on `wss://sync.automerge.org` from a real browser (the sandbox's Chromium can't reach it). |
| **N3 Spectating and recovery** | spectator view (broadside, speed, scrub bar, watch from start, replay export), rejoin from IndexedDB, tamper alarm, rematch link, "continue on another device" link | rejoin mid-battle reproduces `stateHash`; scrub to k equals fold of the prefix; tamper drill in the browser |
| **F6 → F5 → F7** | §3 | P-ai/P-human unchanged for squirrel vs serpent and the classic set; new matrix and fortified baselines recorded with the `CORE_VERSION` bump |
| **N4 (optional)** | Ed25519-signed entries (L1: a key per seat claim; 0.15 ms to sign, 0.22 ms to verify; verified on arrival, cached by id, so the fold stays synchronous); `diceMode: 'fair'` | baselines per dice mode; reveal-stall UX |

### 4.1 RNG-order rules

Each rule gets a comment at its new site. The parity gates (P-ai, P-human and P-browser: trace, shadow and battle log) enforce rules 3-11. Rule 1 is enforced by `sim/boundaries.mjs` (imports) and by parity (a stray draw shifts every later die), rule 2 by P-prop, rule 12 by the envelope decoder and P-merge, and rule 13 by `boundaries.mjs` and P-peers.

1. **Only consensus code draws, and only through `G.rng`** (`d6(G)`, `roll(G,n)`, `draw(G.rng)`). The view, presenter, input, UI, match and net layers never import `core/rng.js`. Cosmetic randomness stays on `Math.random` in the view.
2. **`legal`, previews (`oddsText`, hover `chargePlan`/`movePlan`, reach overlays), `hudModel` and the AI-legality assertion run under `rng.lock`.** A draw throws.
3. **Statement order inside each action is frozen.** Each `await` is replaced *in place* by an `emit`. No logic moves across an emit. Building an event never draws or mutates.
4. **These orders must be kept exactly:**
   - `blastVolley`, per template (712-721): break if the shooter's own unit is dead (33946a4), then break if the target is dead and `k > 0`; aim angle `rng()`, then offset `rng()`; then the hit `roll(1)`; on a miss, scatter `roll(1)[0]+1`, then the angle `rng()`.
   - `blastLands` (799): all victims are collected first, in unit order. Per victim, a big target's `d6()` comes before the wound roll.
   - The mesmerize D3 comes after the cast (828).
   - The roll-off is `do { a = roll(1); b = roll(1) } while (a[0] === b[0])` (1208-1213).
5. **The no-save rolls still roll.** `roll(wounds)` runs even when `sn > 6` (653, 807, 1077).
6. **Iteration orders are behaviour:**
   - units in `G.units` order (seat 0's army, then seat 1's);
   - chunk order: `smashAround` walks the live array, `blast` a copy (553, 548);
   - morale walks `units` (1106);
   - fight alternation keeps its guard of 30 (1090);
   - `damage` tie-breaks with `<` (849-855);
   - `relayout` sorts by `atan2` (320);
   - the AI's lattice scan, with its odd-row offset, draws only for cells passing `isFinite(res.dist[i]) && validEnd` (ai.js 127-135);
   - the AI's role sorts are stable: ascending for move and charge (59, 264), reversed for shoot (231).
7. **Walk:** the final position is the k=1 lerp, not `pts.at(-1)`. A path under 0.05" moves nothing and smashes nothing (519). Smash samples are taken every 0.25" plus the end point, in order.
8. **Journal quirks:**
   - `doAdvance` writes no `act` line;
   - destroyed-unit lines are flushed through `write` and are not traced (917, 1284, 1653); the corpus's battle-log stream (`written`) pins where they land;
   - the "deploy your army" lines are logged in seat order at `createMatch`;
   - unit ids restart at 1 per match;
   - the trace format is unchanged (`toFixed(3)`, alive chunk count, vp, `rngState`).
9. **`refreshNav(G)` runs at exactly today's sites.** Nav is never dirty at a command boundary.
10. **AI code is rules code.** Draws stay between the same yields. Any AI change bumps `CORE_VERSION` and re-baselines.
11. **New behaviour draws only inside its own branch** (`if (t.swarm)`, deck `settle`). New terrain kinds go only in new sets. `deploy`, `vote` and `chargeEnd` draw nothing.
12. **Commands carry integers and booleans only.** Fair-dice reseeding (N4) may happen only at a command boundary.
13. **No module-level mutable state in consensus code.** Two matches in one process must not interact; the peer tests rely on it.

---

## 5. Explicit non-goals (v1)

- No game server, no state snapshots in the doc, no derived state in Automerge.
- No host-run AI. Every peer runs it, and no AI time budget is allowed.
- No fair-dice mode and no signed commands until N4. No Keyhive, no WebRTC adapter, no play-by-link URL transport (only replay export).
- No hidden information: no fog of war, no hidden burrowing. No time controls, since there is no trusted clock. Stalling is handled socially, with a "not responding" banner and `concede`.
- No GGPO-style re-animation on rollback; the view snaps. No online undo. Local undo of `move`/`place` by truncating the store is possible later; those commands draw no dice.
- No sliced or Worker fold. No snapshot cache in IndexedDB.
- No overtime in watch mode. No "share this local game online" upgrade (`fromLocal`). No seat handoff mid-match.
- No keyword-hook or registry framework, and no ability DSL. No structured log messages: the trace hashes the HTML text.
- No multi-level navigation (bridges, walking under decks). No vertical engagement beyond `|Δy| ≤ 1.2"`.
- No TypeScript, ECS or framework (JSDoc typedefs only). No `InstancedMesh` figures until `renderer.info` shows insect swarms need them.
- No CI change. `npm run verify` stays the only CI step, and the `sim/` suites run by hand.
- No rules or AI rebalancing before R8 is green.

---

## 6. Open questions for the user

Each of these changes the design. The default in brackets is what gets built if there is no answer.

1. **Who will play online: friends sharing a link, or strangers?** [friends]
   - **Friends:** the "friendly" dice described above. The seed can't be ground, but a determined player with devtools can foresee rolls. Device ids are unauthenticated, so anyone holding the link could disrupt a match.
   - **Strangers** need fair dice: a commit-reveal per roll, about 70-90 opponent round trips a battle, both players online at once, and no asynchronous play. They also need signed commands (N4).
2. **Which sync transport?** [public server, with a `?sync=` override]
   - **The public `wss://sync.automerge.org`:** free, stores and forwards (so asynchronous play and late join work), but offered "as-is" for prototyping, with no privacy or reliability guarantees.
   - **A self-hosted `automerge-repo-sync-server`:** a small Node/Docker service, which needs hosting outside GitHub Pages.
   - **Serverless WebRTC** through a public signalling relay: needs a custom adapter, and both players must be online.
3. **May `dist/` grow by the 3.64 MB Automerge wasm (about 1.1 MB compressed in git) each time Automerge is upgraded?** [yes] The alternative is loading the wasm from a CDN, which breaks the repo's no-external-requests preference.
4. **Is it acceptable that a deploy which changes the rules makes in-progress online matches read-only?** [yes] The alternative is versioned deploy paths, for example `dist/tails-and-scales/v3/`, so old matches keep their old code. That is a build and gallery change.
5. **Insect burrowing: always visible?** [visible] True hidden movement would need per-player secrets and commitments, which a shared public document can't hold.
