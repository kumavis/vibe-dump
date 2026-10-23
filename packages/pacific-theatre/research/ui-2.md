# The ui-2 workflow's notes

Round two's interface (ROUND-2.md §1.1–1.2, §5, §6's UI checks), 23 October
2026: the unit list, the unit card, the box's bar with its stations, speeds,
bookmarks and setting, Start here on the briefing, the after-card over a
span, the URL's `#unit`/`#station` and the `pt.assist` setting, built in a
worktree beside engine-2 (who rebuilds `src/battle/**`) and content-2 (the
prologue front and `firstDoor`). Nothing here has run against the rebuilt
Battle: every call into it is coded to the contract and exercised against a
mock (`src/ui/mock-battle.js`) on a dev page (`ui.html`), and the first
round's flows still run on today's Battle. The integrator wires the two.

What I read, line by line unless noted: ROUND-2.md; ENGINEERING.md §§0–2,
5 (the "As built"), 9 (with its "As built"), 11; DATA.md §§8–9; DESIGN.md
§3.5, §5.7, §7.3–7.4, §12; research/table.md; R8-tone.md §3.6, §5 (all);
`tools/check/ids.json` (the stations and assist vocabularies);
`tools/check/common.mjs`'s voice matchers; every file under `src/ui/`,
`src/link.js`, `src/app.js`, `main.js`, `index.html`, `style.css`,
`src/battle/index.js`, `src/battle/controls/{input,bindings}.js`, and
`src/battle/sim/{index,record,units}.js` for today's shapes; the four
`battle.json` files and the kits for the mock.

---

## 1. What is built

| file | what |
| --- | --- |
| `src/ui/unitlist.js` | the list: by side (Japan first, as the briefing), ships then air groups in the record's order; an air group is one row (its aircraft ×count), parked aircraft one greyed row per field's kind; greyed rows carry the reason; All / Ships / Aircraft; ↑ ↓ Home End PgUp PgDn, a letter jumps (not L, which closes), Enter or Space selects, Esc closes; built once per box, rewritten in place as the clock moves so focus and scroll survive |
| `src/ui/card.js` (mode `unit`) | name (+ hull, + kanji), the kit's line ("Nevada-class battleship"; an aircraft's full kit name and "aircraft 4 of 12" or "the leader's aircraft"), the side, Now, Next, the state words, a button per station (*Take the controls* at the current time); a greyed unit shows the reason and no button; while held the buttons switch stations and *Give the controls back* releases; re-opened on the same unit it rewrites only the lines that changed |
| `src/ui/boxbar.js` | watching: the table, the stops, the **stop strip** (a tick per stop, a diamond per bookmark: hover or focus gives "07:56:30 · title", a click takes it; bookmarks a few minutes apart step up a row so each can be pressed; a click on the strip goes to that time), play/pause, the speed, Units, Briefing, the setting, credits; held: Release, the station bar, the clock, the strip, the speed list as buttons (×½ ×1 ×2 for an aircraft in Assisted, ×1 in Pilot, 1–8× for a ship), Units, the setting; the checkpoint as before |
| `src/ui/briefing.js` | *Start here* (the first door's time, title, role, text, *Take the controls*) before *The record's turning points*, then the setting with its line "Assisted flight holds the aircraft for you; Pilot is the real thing." (`assistHTML` is shared with the bar's look) |
| `src/ui/after.js` | a `gloss` under the title; `record.lines` (the unit's own record over the span, a line each with its time) after a bookmark's written text; "The record has nothing for this unit over these minutes." when there is none; the old guards on people and words apply to the new lines |
| `src/ui/roles.js` | the words: station labels and places, the kits' short names ("Dauntless", "Type 97 carrier attack aircraft"), ship types, the role phrase ("At the controls of a Dauntless of Bombing Six", "At the helm of Johnston", "Aboard Nevada" for several stations), the record's events in the stops' voice (`eventLine`, the record's own `text` first, nothing for `hud: false`), an attack in words, counts of bombs and torpedoes in words, damage in words |
| `src/ui/setting.js` | `loadAssist`/`saveAssist` over localStorage `pt.assist` (Assisted where storage is absent or throws) |
| `src/link.js` | everything wired (§2 below) |
| `src/app.js` | `app.assist` read at boot and handed to the Battle, `app.setAssist(v)`; `#unit`/`#station` in `fromUrl` and `hashNow` (box-only, like `#t`) |
| `src/ui/ui.js` | the new hooks as no-ops; Esc closes the unit list before the card |
| `style.css` | the list, the card's mode, the bar's new parts, Start here, the record lines, phone width; the bar now has its own width (absolutely placed from the middle it used to wrap at half the screen) |
| `ui.html`, `src/ui/mock-page.js`, `src/ui/mock-battle.js` | the dev page (§4) |
| `tools/smoke.mjs`, `tools/shoot.mjs` | §5 |

## 2. Every call `link.js` makes into Battle (what the integrator wires)

Today's Battle is `src/battle/index.js` at 79ca845. "Guarded" means link.js
checks for the member and falls back, so today's Battle runs the first
round's flows unchanged.

| call | expected (ROUND-2 §3–4) | today | in link.js |
| --- | --- | --- | --- |
| `battle.sim.units()` | `[{ index, id, kind, side, name, ja, kit, group, alive, takeable: true \| reason, stations, now, next }]` | `sim.units` is an **array** of slot records (`{ index, id, name, kind, side, kit, group, k, fixed, … }`), not a function | guarded: `[]` when not a function (the list is empty, the card never opens); read at most 4× a second |
| extras read from a row | `k` (aircraft's index in its group; else the `#n` of the id), `hull`, `spare` (a named-crews group's spare), `state` (words: `['afloat', 'on fire']`, `['airborne', '3,000 m', 'fuel 80 %']`) | `k` exists in today's array rows | all optional; without `state` the words come from `sim.state` (alive, damage, fire, list, pos.y) |
| `battle.select(index \| null)` | the selection, bracket and camera; never changes the sim | absent | guarded (link keeps its own `L.selected`) |
| `battle.state.selected`, `.station`, `.assist`, `.sortie` | §4 | absent | `selected` watched 4× a second: a change made in the box (a click) opens the card unless another card is being read |
| `battle.take(role)` | `role = { unit, station }` \| `{ group, station }` \| `{ group, index, station }` (+ `t`, + link passes `momentId: null`); throws an `Error` whose message is §2's reason | absent | guarded (warns); a throw is warned and the card redrawn; a returned promise is followed to the after-card |
| `battle.setStation(name)` | switch, the AI keeps the rest | absent | guarded |
| `battle.release()` | gives back; "opens the after-card through link.js with `sim.sortie`" | finishes a moment (resolves takeMoment) or `releaseControls()` | any of: release()'s return value `{ sortie }`; the `battle` event `{ kind: 'released', sortie }` (also for a release by Backspace or by the unit's fate); `app.link.afterSortie(sortie)`. The card opens once per held session whichever comes first |
| `battle.bookmarks` | the moments | absent | guarded: `sim.record.moments` |
| `battle.takeMoment(id)` | as now (+ `sortie` on its result, so the bookmark's card has the span) | as now | as now; with `sortie` the round-two card, without it the first round's (score and outcome) |
| `battle.assist` | get/set `'assisted' \| 'pilot'` | absent (App sets the property; harmless) | App sets it at boot and on every toggle |
| `battle.firstDoor` | `{ role: { kind, unit \| group, station }, t, title, text }` from battle.json (`t` a clock string or seconds) | absent | guarded: no Start here |
| `battle.speeds` (an extra) | the list the bar offers now | absent | guarded: §3's lists computed in link (watch 1–60×; held aircraft ×½ ×1 ×2 / ×1; held ship 1–8×; a moment's own list) |
| `battle.play(scale)` | takes 0.5 | clamps to ≥ 1 | passes 0.5 through |
| `sim.player` | `{ kind, unitIndex, station? }` | `{ kind, unitIndex, scripted, … }` | the held unit; `station` read from `state.station` first |
| `sim.sortie` | `{ span: [tTake, tRelease], unit, stations?, hits, releases, damageTaken, survived, how?, divergedDuring }` | absent | see §3 for the fields read |
| `battle._question` | (private) a scrub's pending question | exists | read only, so Enter answers the question rather than opening a card |
| unchanged | `enter`, `leave`, `abort`, `scrub`, `stopAt`, `lookAtStop`, `cycleTime`, `maxScale`, `pause`, `keepGoing`, `finish`, `restart`, `loaded`, `scene`, `input`, `running`, `timeScale`, `momentId` | — | — |

**Keys.** link.js owns **L** (the list) and **Enter** (the selection's card)
while watching and **Tab** (the next station, Shift+Tab the one before)
while a unit is held. ROUND-2 §4 also gives the Battle's watch keys L, Enter
and Tab: only one may act. As built, link.js's listener is on `window`
(bubble) and skips an event already `defaultPrevented`; the engine's
`Input` listens in capture and stops propagation for its own keys, so if
engine-2 binds Tab there it wins and link.js never sees it. **The
integrator must keep one owner** (link.js's is simplest: it already updates
the URL's `#station` on a switch) and must not let Battle's watch keys open
anything on L or Enter. Backspace stays the controls' (the mock stands in).

**Events link.js listens to** on `app.events` `battle`: `checkpoint`,
`rebuilt` (as before), `enter` and `rebuilt` (the strip's marks),
`released` or `sortie` with `detail.sortie` (the after-card), `select`,
`take`, `station` (drop the units cache).

## 3. What the mock assumes (the shapes the engine should match or the integrator map)

- `units()` rows as above, one per slot: every ship (and every parked
  aircraft, which the record writes as a unit: kind `aircraft`, `group` its
  formation id, no `k`), then every aircraft of every group (`id`
  `"<group>#<k+1>"` as today's sim names them, `k` from 0, `name` the
  group's name), then a spare for a `namedCrews` group (`spare: true`).
  The list tells an air group from a formation by whether `group` is in
  battle.json's `groups`.
- `takeable` reasons the mock uses: "fate is fixed", "hospital ship",
  "tokkō unit", "on the ground" (parked), "not yet airborne" (§1.1's five),
  and, where §1.1 gives no words, "the leader’s aircraft", "a named crew",
  "landed", "did not return", and "<sank | capsized | was scuttled | blew
  up | was beached> at HH:MM" for a ship past her fate. The engine's words
  are the ones shown; these are only the mock's.
- `sortie.hits`: `[{ name, kind: 'bomb-hit' | 'torpedo-hit' | 'gun-hit' |
  'near-miss' | 'aircraft', count, where }]` (`aircraft` = an aircraft of
  `name` downed; shown as *Aircraft downed*). `sortie.releases`: `[{ kind:
  'bomb' | 'torpedo' | 'salvo' | 'aa' | 'guns', count, t, heightM? }]`.
  `damageTaken`: a share of the kit's fatal (a number; a string is printed
  as is). `survived`: false prints "lost" / "did not return". `how`:
  `released | landed | ditched | clock | left | card | lost`.
  `divergedDuring`: `[{ id, name, kind, reason }]`, printed "name: reason."
  in *Your battle* as the sim's words (`sim` or `text` are read if `reason`
  is absent). `unit`: an object `{ index, id, kind, name, kit, group }` or
  an index or an id. `stations`: the stations held, in order (else
  `[station]`).
- Stations by ROUND-2 §3's rule, with two readings engine-2 should confirm:
  (a) no kit has `type: 'level'` (the B5N2 is `torpedo`, the B-17E
  `bomber`), so the mock also offers *bombardier* where the **group's**
  attack profile is `level` (§1.1: "a level bomber on its run-in"); (b)
  until the kits carry `arc: 'rear'`, a gun at `position` rear, turret or
  waist counts as a rear gun.

## 4. The dev page

`npx vite --port 5297` in the package, then
`http://127.0.0.1:5297/ui.html?box=pearl-harbor&t=07:55` (`&paused` to hold
the clock; `#battle=midway&unit=vb-6%234&station=gunner` to test the URL).
No WebGL: a plan of the box (the table's coast, the sites, every unit where
the record has it, the selection's bracket, the held unit's ring), a click
selects the nearest unit within 24 px. `window.__app` stands in for App;
`app.battle.calls` lists every call link.js made. The mock's clock runs;
while a unit is held it scripts a release at +10–12 s, a hit at +16–20 s
(only on a ship that can register one: never a fixed unit, a hospital ship
or a ship past her fate; for a ship, the nearest of the other side within
25 km), damage taken, and an aircraft of the other side that did not
return. It is not in the build (Vite builds `index.html` alone).

## 5. The tests

`tools/smoke.mjs` keeps every first-round check unchanged and adds:

- on the built app: the setting read at boot, handed to the Battle and kept
  as `pt.assist`; App.hashNow composing `#unit`/`#station` while a box is
  the scene and never on the table (the keys set as link.js sets them and
  the hash composed at once: link.js clears them every frame nothing is
  held, and today's Battle has no `take()`); on the real data, the prologue front
  moving between 1931-09-18 and 1941-12-06 (**skipped, and said, while the
  data has no keyframe before 6 December 1941**: content-2's six arrive with
  the merge; the integrator must see it pass);
- on `ui.html` (a Vite dev server started by the script; `MOCK=0` skips,
  `MOCK=only` runs these alone without a build): the list from the bar and
  L, by side, ships then air groups, Arizona "fate is fixed", Solace
  "hospital ship", a midget "tokkō unit", parked aircraft "on the ground";
  the kind filter and the keyboard; a row selects and only that row is
  marked; the unit card's stations; a greyed card's reason and no button;
  Take the controls → `take({ unit: 'nevada', station: 'main' })`, the
  station bar, Tab → `aa`, the hash `unit=nevada&station=aa`, the bar's Helm;
  Release → the after-card titled over its span with its four parts and the
  unit gone from the hash; a B5N2's three stations, ×0.5 with ×½ ×1 ×2,
  Pilot → ×1 and the setting kept across a reload; the bookmarks on the
  strip (hover title, a click takes, the bookmark's after text and its two
  restart points kept); Start here before the turning points with the
  setting's line, its button taking the door's role; `#unit`/`#station`
  offering (selected, the station's button focused, nothing taken); a click
  on the plan selects; a Midway aircraft card, gunner station and after-card
  ("At the rear gun of a Dauntless of Bombing Six, 10:22:00–10:22:10"); the
  voice rules over the text of every view (common.mjs's slurs, glory words
  and announcing words, a game-word list, no count of people outside The
  record); the list and a row at 390×844.
- The fixtures have no `kits/weapons.json`, so entering the test box logs
  a 404 the app already warns about and survives; the first round's
  fixture smoke counted it as a console error. smoke.mjs now files that one
  404 (fixtures only, that URL only) as a warning.

`tools/shoot.mjs` gains presets `ui` (list, list filtered to aircraft, a
takeable ship's card, Arizona's, a B5N2's, the briefing's Start here, the
station bar, the after-card, a bookmark's title on the strip) and `ui-air`
(Midway: an SBD's card, the gunner held, its after-card, the briefing);
any preset named `ui…` or `PAGE=ui` loads `ui.html` through Vite (`BOX`,
`T` choose the box and time; `VIEWPORT=390x844` for the phone).

## 6. Where I departed from the contract, and why

- **`#unit`/`#station` offer, they do not take.** Read at boot (after the
  box is entered) they select the unit and open its card with that
  station's button focused; nothing is taken without a click, as ENGINEERING
  §9 rules for `#moment` ("a moment never starts without a click", and
  pointer lock needs one). ROUND-2 §5 says only that they are read.
- **`ui.onTake` takes either a bookmark's id (a string, to `takeMoment` as
  before) or a role object (to `take`)**, so the first round's briefing,
  stop cards and smoke test keep working; `ui.onSelect(index)` takes the
  slot index.
- **An air group is one row**, not one row per aircraft: a group's row
  selects its first takeable aircraft (else a wingman, whose reason it
  shows, else the leader); the card is the aircraft's ("aircraft 4 of 12"),
  and a click in the box selects that very aircraft. Parked aircraft are
  gathered one row per field and kind (227 at Pearl Harbor would bury the
  ships).
- **The setting is on the bar while watching as well as while held**
  (labelled *Flying* beside its two buttons, so it never reads as the
  *Pilot* station), and on the briefing with its line.
- **While a unit is held the bar stands at the top on a wide screen**
  (between the HUD's clock and its plot, wrapping to two rows), because the
  HUD keeps the foot (`scene/hud.js`: instruments bottom left, keys bottom
  right, lines at 64 px); the list and the card step down under it (`#ui.holding`).
  On a phone it stays at the foot: the touch controls' layout is engine-2's,
  and the integrator must check the two together. (Since superseded: on a
  phone the held bar is one row at the top too, with ⋯ for the rest;
  ENGINEERING §8 and §11, "As built (the phone layout)".)
- **The station bar shows even for a unit with one station** (a fighter's
  *Pilot*): the contract says the bar shows while a unit is held.
- **Speeds**: a list of four or fewer is a row of buttons; watching's seven
  stay the button that cycles them.
- **Bookmarks close in time step up a row on the strip** (three at most) so
  each stays hoverable and pressable; without it Pearl Harbor's 07:56:30
  and 07:58 marks sat on one another.
- **The record's lines are link.js's, from battle.json**: the unit's own
  events and the events it caused (a group's launch, attack, losses and
  landing, and the hits on ships whose `by` is the group) inside the span,
  `hud: false` events left out, at most fourteen.
- **No retry buttons on a free take's card** (restart points belong to a
  bookmark's checkpoint logic).

## 7. What the contract leaves open (for the project manager and engine-2)

1. **The fixed fates and the level bombers.** DESIGN §3.5 and DATA §9 rule
   that no player role may be the cause of a `fixed` unit's events ("so
   there is no high-level bomber moment at Pearl Harbor"); ROUND-2 §2's
   never-takeable list leaves this out, so the first wave's level bombers
   (Akagi's to Hiryū's, whose target is Arizona) are takeable under §2. The
   mock follows §2 and never scripts a hit on a fixed unit. Engine-2 must
   either grey those groups (a reason such as "fate is fixed") or make a
   player's bomb on a fixed unit register nothing; the unit card's *Next*
   for them reads "at 08:05 the group bombs Arizona from altitude", which is
   the record, but an offer to take it sits beside it.
2. **Single-aircraft groups** (Chikuma's floatplane, the Midway scouts) are
   only a leader, so §2's index-0 rule makes them never takeable unless the
   engine gives a spare as for `namedCrews`.
3. **Off-box ships** (the Kidō Butai at Pearl Harbor, 300+ km north) are
   takeable under §2 though they sail outside the box's terrain.
4. **Reason words** beyond §1.1's five (§3 above) are the engine's to
   choose; the list and the card print whatever `takeable` says.
5. **The card's state** (afloat, listing, on fire; airborne, height, fuel)
   is in §1.1 but not in §3's `units()` fields: the mock adds `state`; the
   integrator should ask engine-2 for it or accept the `sim.state` fallback
   (no fuel there).

## 8. What the integrator must do

1. Wire `link.js` to the rebuilt Battle: the table in §2. Where engine-2's
   names differ, map them in Battle or in link.js (the guards make every
   member optional, so a missing one fails quietly: check the warnings).
   `sim.units` must become a function (or `battle.units()` read instead).
2. Make Battle open the after-card on every release: dispatch `battle`
   `{ kind: 'released', sortie }` (or call `app.link.afterSortie(sortie)`),
   including when the held unit's fate resolves; give `takeMoment`'s result
   a `sortie`.
3. One owner for L, Enter and Tab (§2, Keys).
4. Run `node tools/smoke.mjs` and `DATA=real node tools/smoke.mjs` after the
   merge: the prologue check must then read ✓ (not "skipped"); the mock's
   checks still run against `ui.html`. Then add a real-box take to the
   first round's box checks (select, take a ship's station, Tab, release,
   the after-card), which I could not write against today's Battle.
5. `src/config.js` (not mine) still lists `HASH = ['date', 'cam', 'battle',
   't', 'moment']`; nothing reads it, but it should gain `unit` and
   `station` when ENGINEERING §9 is folded.
6. Fold §6's decisions into ENGINEERING §11 and DESIGN §5.7.

## 9. The gate, as run

- `npm run build -w @vibe-dump/pacific-theatre`: built (one 985 kB chunk,
  as before; `ui.html` is not in `dist/`).
- `node tools/smoke.mjs` (fixtures): 39 ✓, "no console errors", "all
  passed" (the first round's checks, the three round-two app checks, the
  fixtures' "no prologue" note, and the dev page's fourteen).
- `DATA=real node tools/smoke.mjs`: 39 ✓, "no console errors", "all
  passed": the table, the Pearl Harbor box entered from its card (769
  slots, 5 moments offered), its stops, the kaga-b5n-torpedo moment with
  its four-part card, Back, `#battle/#t/#moment`, the perf block, the
  round-two app checks and the dev page's; the prologue check reads
  "– skipped: no keyframe before 1941-12-06 in the data yet (8 keyframes)"
  until content-2's keyframes are merged.
- `MOCK=only node tools/smoke.mjs`: all passed (about two minutes).
- `node tools/check-data.mjs`: the six "has no keyframe 1931-09-18 …
  1941-07-31" problems, content-2's (expected); nothing else.
  `node tools/check-data.mjs test-data`: clean. `node tools/test-time.mjs`:
  all 55 passed. `node tools/replay.mjs`: all 4 boxes replay the record
  (link.js is not in the sim's path; run because App changed).
- `battle.html?data=./data/&box=pearl-harbor` (the engine's dev page, which
  boots App): in the box at 07:55 in watch mode, the setting Assisted on
  App and on the Battle, no console error or warning. `smoke-battle.mjs`
  was not run: it loads no file of mine beyond App's constructor, which the
  boot above exercises.
- Looked at (Playwright shots, read as images): the unit list (desktop, an
  aircraft filter, phone 390×844), a takeable ship's card (Nevada), a
  greyed Arizona, a B5N2's card, an SBD's card, the station bar (ship at the
  top of the screen; aircraft; phone), a bookmark's title on the strip,
  the briefing's Start here (Pearl Harbor, Midway), the after-card over a
  span (Nevada, an SBD gunner, a bookmark). `node tools/shoot.mjs
  tools/shots/ui ui` and `… ui-air` remake them.

## 10. What I could not settle, or left undone

- Nothing ran against engine-2's Battle; the shapes in §3 are my reading of
  the contract.
- The Japanese line on an empty record ("その間の記録はない。") uses only
  characters the font subset already holds; a native reader should check it
  with the after-card's other Japanese (ACCESS.md).
- Touch: the list, the card and the bar work by tap (shot at 390×844); the
  engine's touch station bar and fire button (§4) are engine-2's.
- The bar while flying with pointer lock cannot be clicked (the lock owns
  the pointer); Tab and Backspace are the way, as the HUD's hints will say.
