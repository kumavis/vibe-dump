# The ui-3 workflow's notes

Round three's interface (ROUND-3.md §1, §5, §7's UI checks), 26 October
2026: the Wargame's doors, its start sheet, the HUD layer over a running
wargame, the hit markers, the respawn line, the hop button and hints, the
end card with its reel, `link.js`'s hooks and the URL, built in a worktree
beside engine-3 (the arena, `Battle.enterWargame`, the scene's shake, slow
motion, sinking and snapshots, the controls' hops) and content-3 (the
scenario files and their check). Nothing here has run against the engine's
arena: every call into it is coded to ROUND-3 §3–5 and exercised against a
mock (`src/ui/mock-arena.js`) on the dev page (`ui.html`), and every
round-two screen still runs on today's Battle. The integrator wires the two.

What I read, line by line unless noted: ROUND-3.md; ROUND-2.md;
ENGINEERING.md §§0–1, 8, 9 (in part), 11 (with both "As built"), 12, the
round notes; DESIGN.md §3.5, §7.3–7.4, §12; research/ui-2.md (all);
`tools/check/ids.json` (`wargames`, `vocab.wargameGoalKinds`,
`wargameGoalTypes`, `hopKinds`, `stations`); `tools/check/common.mjs`'s
voice matchers; every file under `src/ui/`, `src/link.js`, `src/app.js`
(the URL), `main.js`, `ui.html`, `style.css`, `src/battle/index.js` (its
public surface), `src/battle/scene/hud.js` (its layout and `project`),
`src/battle/controls/touch.js` and `bindings.js` (the phone layout, the
keys), `tools/smoke.mjs`, `tools/shoot.mjs`; Samar's and the fixtures'
`battle.json` and the kits for the mock.

---

## 1. What is built

| file | what |
| --- | --- |
| `src/ui/wargame.js` | the HUD layer (`WargameHud`: one block under the bar with both sides' strength bars, names and tallies, the timer, the goal line with its count, the phase with its count and timer, the held unit; the hit markers placed each frame at their targets' projections, 1.5 s, stacking on one target and stepping past one another; the respawn line; the hop hints), the start sheet's and the end card's templates (`startSheetHTML`, `endCardHTML`), the words (`TYPE_WORDS`, `typeCount`, `numWord`, `clockText`) and the two icons |
| `src/ui/card.js` | modes `wargame` (the start sheet) and `wargame-end` (the end card, a still enlarged over the screen on a tap, Esc or a tap closing it); *Play it as a wargame* in a box event's footer where `ui.wargameFor(ev)` names one |
| `src/ui/briefing.js` | *A wargame*: the label and *Play it as a wargame*, after the setting |
| `src/ui/boxbar.js` | *Wargame* while watching a box that has one (the door); mode `wargame` (the table, the held unit's stations, play, Units and the hop button; none of the record's parts); `observe(el)` and `data-pt-head`: `--pt-head` is published under the HUD block too, and `--pt-bar-head` under the bar alone (the block stands there) |
| `src/link.js` | the hooks, the frame, the URL (§2) |
| `style.css` | the doors, the bar's wargame mode, the HUD layer, the markers, the respawn line, the hints, the start sheet, the end card, the enlarged still; desktop and the phone layout both ways up; the dev page's arena |
| `src/ui/mock-arena.js`, `ui.html` | the mock arena and the dev page's wargame (§4) |
| `tools/smoke.mjs`, `tools/shoot.mjs` | §5 |

## 2. Every call `link.js` makes into Battle and the arena (what the integrator wires)

"Guarded" means link.js checks for the member and falls back or says so in
a warning, so today's Battle runs every round-two flow unchanged.

### Battle (ROUND-3 §4)

| call | expected | in link.js |
| --- | --- | --- |
| `battle.enterWargame(id, { side })` | `id` the scenario's (= its box's id), `side` `'jp' \| 'us'`; loads the box and the scenario (from the table or from inside a box), builds the arena, cuts to the side's first unit, runs; resolves truthy (the state), or falsy if aborted | guarded: without it the start buttons warn `Battle.enterWargame() is not in this build` and nothing starts; the start sheet closes before the call and the URL is written after it resolves |
| `battle.restart({ side })` | the same scenario begun again with `side` (the same or the other); may return a promise | link.js calls it with an **object** only while a wargame runs (the record's `restart('start' \| 'checkpoint')` keeps its string): engine-3's `restart` must tell the two apart |
| `battle.hop(kind \| index)` | `kind` one of `ids.json` `hopKinds` (`next`, `carrier`, `capital`, `destroyer`, `aircraft`) or a unit's index; returns the new player or null | guarded: `arena.hop(kind)` where Battle has none. Called by the bar's hop button (`'next'`), a pick in the unit list and a tap in the box (the index). **The keys (Tab, 1–4) are the controls'** (ROUND-3 §4): link.js binds none of them |
| `battle.leave()` | as now; the `battle` event `{ kind: 'leave' }` | link.js's own leave clears the wargame's state after it; the event clears it when the engine leaves by itself (Back) |
| `battle.loadWargame(id)` (an extra, optional) | the scenario object | read first where it exists (the mock has it); else `app.data.wargames` (a loader's list, optional), else `fetch(wargames/<id>.json)` |
| `battle.arena` | the arena while a wargame runs | read first; else `battle.wargame.arena`; else `battle.sim` itself when it has `objective` and `tally` (the arena standing in for the sim, as §3's "the record sim's public surface" suggests) |
| `battle.state.wargame` | `{ id, side }` while a wargame runs (an extra) | read for the played side (a restart from the engine's own key) and to adopt a wargame the engine started itself; optional |
| `battle.state.selected` | the selection (as round two) | a change made in the box (a tap) possesses the unit when it is the played side's |
| `battle.setStation(name)`, `battle.select(i)`, `battle.play()`, `battle.pause()`, `battle.running` | as round two | the bar's stations and play; `select` for a unit of the other side picked in the list (looked at, not taken) |
| `battle.scene.hud.project(x, y, z)` (or `battle.scene.project`) | world → `[x, y]` CSS px or null (scene/hud.js has it) | the hit markers' places, from `arena.state.pos` (+25 m) |
| `battle.scene.snapshot()` | a 320 × 200 JPEG data URL of the canvas now | called on a highlight that carries no still of its own, at most six kept; must render first if the canvas has no preserved buffer (link.js calls it from an updater, before or after the frame's draw: **engine-3 must make that safe**) |

### The arena (ROUND-3 §3: the shapes the mock serves and link.js reads)

| member | shape link.js reads | notes |
| --- | --- | --- |
| `units()` | round two's rows; `takeable: true` for a friendly unit afloat or flying, a reason otherwise; `enemy: true` on the other side's; extras `groupName` (an aircraft's flight, "Gambier Bay’s Avengers"), `k`, `hull` | a row of the other side whose `takeable` is not a string shows "the other side"… only if the arena gives that string: link.js prints whatever `takeable` says |
| `player` | `{ kind, unitIndex, station, stations }` | the held unit, its station |
| `t`, `durationS` | seconds from 0 to the game's length (600) | the timer counts up |
| `strength` | `{ jp, us }` (or `{ japan, usa }`, or a function of the code): a share 0–1 (a number over 1 is read as a percentage), or an object with `share` \| `fraction` \| `ratio` \| `value` \| `now/max` \| `hp/hpMax` | the bars |
| `tally` | `{ jp: { sunk, downed }, us: { … }, player: { hits, sunk, downed, lost } }`; a side's tally is **what it did** (ships it sank, aircraft it shot down); `sank`, `shipsSunk`, `shotDown`, `aircraft` are read too | the bars' lines ("sank 2 · shot down 9"), the end card |
| `objective` | the main goal by side (`{ jp: goal, us: goal }`) or the played side's alone; `goal = { kind, type, count, text, done, of, status: 'open' \| 'met' \| 'failed' }` (`progress`, `target`, `total` read too); the scenario's `goal` fills what it lacks | the goal line: "2 of 4", a survive goal "5 of 6 afloat"; met / missed |
| `phase` | by side or the played side's: `{ index, t, title, text, goal, done, count, leftS \| left \| endsAt, status }` | the phase line and its timer (from `goal.withinS` if no time is given); a new phase flashes |
| `events` | an array appended to: `{ id, t, kind, target, by, mine, text, from?, to? }`; kinds marked: `hit`, `torpedo-hit`, `bomb-hit`, `gun-hit`, `fire`, `downed`, `shot-down`, `sinking`, `sunk`, `magazine`; `near-miss` only when `mine` or on the held unit; `respawn` puts its `text` (or link.js's words from `from` / `to`) up as the respawn line | an array that shrinks is read again from its start (a restart in place); an event older than 1.5 s of the game's time is never marked. The `battle` event `{ kind: <marked kind>, target, text, mine }` is accepted as well |
| `highlights` | an array appended to: `{ id, t, kind: 'hit' \| 'sunk' \| 'lost' \| 'downed' \| 'magazine', mine, unit, text, image? }` | the reel: `image` (or `snapshot`, `src`) where the engine took one, else `scene.snapshot()` at once; six kept, a sinking (the player's first), a magazine, a loss, the player's hits, in that order of keeping |
| `result` | null, then `{ t, reason, met: { jp, us }, text? }` (`winner` or `side` read too) | the end card 1.6 s later; its line is `text`, or link.js's from the played side's goal ("Taffy 3 kept five of the six escort carriers afloat until 10:00.") |
| `hop(kind \| index)` | as Battle.hop | where Battle has none |
| `state.pos` | the record sim's layout, box metres, 3 a unit | the markers |
| `clock` | not read by link.js | **App.hashNow reads `battle.sim.clock` for `#t` while a box is the scene**: if the arena stands in `battle.sim` without a clock, App's frame throws (see §7) |

## 3. The URL

`#wargame=<id>&side=<jp|us>`: link.js sets them as App's kept keys
(`app.url.kept`, which App writes back with every hash) when a wargame
begins or restarts, and deletes them on leave and when a start sheet closes
with no wargame running; `#battle`, `#moment`, `#unit`, `#station` are
cleared while a wargame runs, so a reload lands on the wargame's sheet, not
the record. Read at boot (App's `fromUrl` hands the hash to
`app.urlBattle`): the start sheet opens with that side's button focused,
over the table (or over the box when the hash names one), **nothing
started** (§6).

## 4. The dev page and the mock

`npx vite --port 5297` in the package, then
`http://127.0.0.1:5297/ui.html?box=samar&t=07:00&paused` (the bar's
*Wargame*), or `…#wargame=samar&side=us` (the sheet offered), `&scrub` for
a slider on the ten-minute clock (`[` and `]` step it 30 s), `&seed=7` for
another game, `&scenarios=data` to read `public/data/wargames/<id>.json`
instead of the fixtures, `?box=test-box&data=../test-data/` for the
fixtures' box.

The mock (`src/ui/mock-arena.js`): `FIXTURE_SCENARIOS` for `samar` and
`test-box` in ROUND-3 §6's shape (plainly the mock's: Samar's side names are
"Centre Force" and "Taffy 3", its phases and footnote mine); `MockArena`
builds the units from the box's battle file (ships by the scenario's list in
three formation rings about the guide, aircraft a flight each from their
carriers), and plays a seeded script resolved against the state: shots by a
side and a weapon (shells by calibre, bombs, torpedoes) on the other side's
ships (the goal's type first, the damaged first), hit points by type and
damage by weapon as ROUND-3 §3 lists them, fire under half, listing under a
quarter, sinking at zero over twenty seconds (a hit on a sinking ship
registers nothing), aircraft shot down, the player's own shots every 25–45
s, a near miss, and at 3:32 the held unit's loss (an aircraft: the next of
its flight two seconds later; a ship: the nearest friendly ship at once).
The goals, the phases (their counts within their windows), the strength, the
tallies and the result (a side's goal met that is not "survive", or the
clock) follow. Positions are closed-form (the formations close at 2 m/s to
3.6 km and zigzag; strike aircraft loop between their carrier and the other
force, CAP orbits). `seek(t)` replays from 0. Twenty seeds a side end
between 7:20 and 10:00 as the United States and 4:00 and 9:10 as Japan.

Installed on the dev page's `MockBattle` (`mock-battle.js` untouched: its
prototype is extended) as `enterWargame`, `restart({ side })`, `hop`,
`loadWargame`, `setStation`, `select`, `tick`, `leave`, `speeds` and `state`
in a wargame; the scene gives `hud.project` (the arena view's), `snapshot()`
(a 320 × 200 JPEG of the arena about the latest highlight's unit), `shake`
and `slowmo` (recorded, no-ops). The box's own HUD (`scene/hud.js`'s `Hud`)
and on a touch screen its touch controls (`controls/touch.js`) are built
from their real classes and filled with stand-in readings, so the layout is
the box's and the phone check measures them together; the arena is drawn
from above on `#arena` (the plan stands down).

One quirk of the dev page, not of the app: `mock-page.js` (ui-2's, not
mine) writes its own hash from `app.url.battle` and `#t` and drops App's
kept keys, so while a wargame runs the dev page's address reads
`#battle=null&t=m:ss` and never shows `#wargame`; the tests read
`app.url.kept` there, and hold the real hash on the built app (App's
`hashNow`).

## 5. The tests

`tools/smoke.mjs` keeps every check of the first two rounds and adds:

- on the built app: a box event's card offers *Play it as a wargame* (the
  fixtures' box, and Samar until content-3's file lands, are handed the
  mock's fixture scenario through `app.link.addWargame`); the start sheet
  (both sides, their ship groups, goals, the label, *Japan* and *United
  States*); a side's button calls `Battle.enterWargame(id, { side })` (a
  stand-in records the call while the Battle has none) and the hash carries
  `wargame=` and `side=` and no `battle=`; the engine's `leave` event lets
  them go; `#wargame=…&side=jp` offers the sheet with Japan focused and
  closing it lets the keys go;
- the phone check: its measure (now `MEASURE`, shared with the dev page)
  takes the Wargame's block, respawn line and hints with the rest (a hit
  marker only for leaving the screen), and holds **a wargame** at the six
  sizes once `Battle.enterWargame` exists (skipped, and said, until then);
- on `ui.html` (`WARGAME=0` skips): the bar's *Wargame*, the start sheet's
  contents against the fixture, the briefing's door; United States entering
  (`enterWargame('samar', 'us')`, the bar's wargame mode with Johnston's
  four stations and the hop button and none of the record's parts, both
  bars, the timer, "6 of 6 afloat", the phase "0 of 1" with its timer,
  "Johnston DD-557 · Helm", the hints and `pt.hints`, the URL's keys,
  `--pt-head` under the block); a hit marker at its target's projection in
  machine words, two on one ship stacked, gone after 1.5 s; the hop button
  (`hop('next')`), 1 (`carrier` → an escort carrier), a ship of the played
  side picked in the list held at once, one of the other side only selected;
  the respawn line after a lost aircraft; the end card (the result line, the
  kicker, both tallies, yours, ≤ 6 stills with captions, one enlarged and
  closed with Esc, the record's sentence, the label, the three buttons);
  *Play the other side* (`restart({ side: 'jp' })`, the URL's side), *Play
  again*, *Back to the table*; the voice rules over every view (slurs,
  glory words, announcing, game words, counts of people, "what if",
  "saved"); the wargame on a mobile page at 360×780, 390×844, 412×915,
  412×720, 844×390 and 915×412, a ship held with the hints and a marker,
  then an aircraft after its loss with the respawn line, the bar, the block,
  the box's HUD and the touch controls (the real classes) clear of one
  another, and the end card under the bar's row.

`tools/shoot.mjs`: `wargame-start`, `wargame-hud` (with the respawn),
`wargame-end` (with a still enlarged), `wargame` (all), `wargame-phone`
(upright at the four sizes) and `wargame-phone-land` (on its side), on
`ui.html` (BOX=samar, T=07:00).

## 6. Where I departed from the contract, and why

- **`#wargame` offers, it does not start.** Read at boot it opens the start
  sheet with that side's button focused, as `#moment` and `#unit` do in
  rounds one and two (a sortie never starts without a click, and pointer
  lock needs one). ROUND-3 §4–5 say only "the URL".
- **The bar's `wargame` mode** is more than "the door and the hop button":
  without it the bar would show the record's stops, strip, speeds and
  Release over a game that has none of them. It is CSS over the existing
  buttons, plus `observe()` and the `data-pt-head` / `--pt-bar-head`
  plumbing in `publish()`, so the box's HUD and touch controls stand under
  the HUD block on a phone without either file knowing it.
- **A tally is what a side did** (the ships it sank, the aircraft it shot
  down), written "sank 2 · shot down 9" under that side's bar and "sank 2
  ships, shot down 9 aircraft" on the end card: the contract's "a running
  tally of ships sunk and aircraft shot down for each side" read with active
  verbs, so no line can be read as a side's own losses.
- **Japan on the left, the United States on the right**, whichever is
  played (the one played marked in sand with a dot): the briefing's and the
  list's order, and a restart as the other side does not swap the bars.
- **The goal line is the played side's goal**; the other side's is on the
  start sheet.
- **A pick in the unit list or a tap in the box possesses at once** a unit
  of the played side (ROUND-3 §1: "pick it from the unit list… a cut"); no
  unit card opens in a wargame. One of the other side is selected (looked
  at) only.
- **One word in the middle at a time**: the respawn line hides the hop
  hints while it shows, and the box's own first hints hide them too.
- **Esc in a wargame** (without pointer lock) closes the enlarged still,
  then the list, then the card, and never gives the unit back (a wargame is
  always held); round two's Esc-to-release stands down while one runs.
- **The start sheet and the end card lift the interface** (`#ui`) over the
  box's own HUD and touch controls while they show, as a phone's open card
  already does, so the HUD's subtitle and plot never cross them.
- **Near misses** are marked only on the held unit or for the player's own
  shot (every near miss of a fleet action marked would bury the hits).
- **Markers for a target off the screen are not drawn** (one pinned to the
  edge would name the wrong ship), and the HUD block and the bar stand over
  a marker whose ship sails under them.
- **The end card waits 1.6 s** after the result, so the last hit's marker
  and the sinking are seen.
- **The start sheet's footer** says how to move between units (Tab and 1–4,
  or the bar's arrows on a touch screen): not in §5's list, and short.
- Commits: the mock first, then the UI modules (doors, sheet, HUD, end card
  together, as `card.js` and the bar need `wargame.js`), then `link.js`,
  then the tests and these notes; §8's seven steps share files too closely
  to stand alone as seven commits.

## 7. Files outside my ownership that need a change (for the integrator)

1. **`src/app.js` `hashNow()`**: while a box is the scene it writes `#t`
   from `battle.sim.clock` (`urlTime(sim.clock, sim.t)`). If engine-3 puts
   the arena in `battle.sim` without a `clock` (`label`, at least), App's
   frame throws every 250 ms. Either the arena carries a clock (the mock's
   is `{ duration, label: (t) => 'm:ss', … }`), or hashNow skips `#t` when
   `battle.state?.wargame` (the cleaner: a wargame's URL is `#wargame` and
   `#side` alone).
2. **`src/ui/ui.js`**: the five new hooks (`wargameFor`, `onWargame`,
   `onWargameStart`, `onWargameRestart`, `onHop`) are set by link.js and
   called guarded (`?.`), so ui.js needs nothing; adding them to its hook
   list and constructor as no-ops would keep its header honest. Its Esc in
   mode `moment` returns early, so in a wargame Esc is the controls'
   (pointer lock's pause) and link.js's own Esc-to-release stands down.
3. **`src/config.js`**: `HASH` could gain `wargame` and `side` when
   ENGINEERING §9 is folded (nothing reads it).
4. **`src/data/load.js`** (optional): an `app.data.wargames` list (ids, or
   the scenarios) would let the door show only where a file exists; without
   it link.js offers the door on the boxes in `ids.json`'s `wargames` that
   the data has.
5. **The controls (engine-3)**: Tab is round two's station key and §1's
   next-unit hop; in a wargame the hop needs it, and the stations keep the
   bar (and Shift+Tab, if engine-3 keeps it). The keys are theirs; link.js
   binds none.

## 8. What the integrator must do

1. Wire link.js to the engine's arena: §2's table. Where names differ, map
   them in Battle (`battle.arena`, `battle.state.wargame`) or in link.js's
   readers (`bySide`, `shareOf`, `tallyOf`, `goalOf`, `phaseOf` take several
   spellings already); check the warnings.
2. Decide §7.1 (App's `#t` in a wargame).
3. `restart` with an object for a wargame (§2); `hop` with a kind or an
   index; `scene.snapshot()` safe from an updater.
4. Run `node tools/smoke.mjs` and `DATA=real node tools/smoke.mjs`: the
   phone check's **a wargame** state must then run (not "skipped") and
   pass with the real HUD and touch controls; the built app's door and URL
   checks then go through the real `enterWargame` (the stand-in only
   stands in while there is none). With content-3's files in
   `public/data/wargames/`, drop nothing: the checks hand over the
   fixture only where the file is missing.
5. Play Samar as each side under Playwright with `tools/shoot.mjs`'s
   presets pointed at the built app (the presets here run on `ui.html`);
   look at the markers on the real scene (their +25 m offset and the
   stacking on a ship that takes several hits).
6. Fold §6 into ENGINEERING §11 and DESIGN (the tally's reading, the URL
   offering, the bar's wargame mode).

## 9. The gate, as run

- `npm run build -w @vibe-dump/pacific-theatre`: built (one 1.1 MB chunk,
  as before; `ui.html` and the mock are not in `dist/`).
- `node tools/smoke.mjs` (fixtures, on the final commit): 58 ✓, all passed, no console errors: every
  first- and second-round check, the three round-three checks on the built
  app (the test box's door and sheet with the fixture scenario handed over,
  `enterWargame("test-box", { side: "us" })` through the stand-in with
  `wargame=test-box&side=us` in the hash and gone after the leave, the
  sheet offered from `#wargame=…&side=jp` with Japan focused), the five
  round-two phone states clear at the six sizes and the sixth ("a
  wargame") **skipped, and said**, the dev page's fourteen round-two checks
  and its eleven round-three checks.
- `DATA=real node tools/smoke.mjs`: 58 ✓, all passed, no console errors: the
  same on Samar's real card and sheet (the fixture scenario handed over
  while `public/data/wargames/samar.json` does not exist here), the
  prologue front checks, the phone states on Pearl Harbor.
- `MOCK=only node tools/smoke.mjs`: all passed (about nine minutes).
- `node tools/check-data.mjs`: clean (14 warnings, none mine);
  `node tools/check-data.mjs test-data`: clean; `node tools/test-time.mjs`:
  all 55 passed; `node tools/replay.mjs`: all 4 boxes replay the record.
- `node tools/smoke-battle.mjs --real-only` (every v1 moment in the built
  app, which runs link.js): 31 ✓, "all passed", no console errors in any
  of the four boxes.
- `node tools/shoot.mjs <dir> wargame` and `… wargame-phone-land`: no
  console errors.
- Looked at (Playwright shots read as images): the start sheet over a box
  and over the table (desktop) and at 412 × 915 upright and 915 × 412 on its
  side; the HUD layer at the start (hints up), mid-game with markers
  (stacked on one ship), after a lost aircraft with the respawn line, and
  the unit list in a wargame, on desktop, 412 × 915, 412 × 720 and on its
  side at 915 × 412 and 844 × 390; the end card with its reel and an
  enlarged still, on desktop, 412 × 915 and 915 × 412; the table's card with
  its door; the watching bar with *Wargame* at 360 × 780, 412 × 720,
  844 × 390 and 915 × 412.

## 10. What I could not settle, or left undone

- Nothing ran against engine-3's arena or Battle; §2 is my reading of
  ROUND-3 §3–5, and the mock's balance is a mock's.
- The real scene's hit markers (their height over a ship, how they read
  over the sea in motion), the snapshot's timing and the slow motion's feel
  are the integrator's to look at.
- The start sheet lists every ship by name: Samar's 23 Japanese ships make
  it tall on a phone (it scrolls; the side buttons sit under each side).
- The Japanese line under a side's name on the sheet is the battle file's
  `sides[…].ja`; the scenario's side names have no Japanese of their own in
  §6.
