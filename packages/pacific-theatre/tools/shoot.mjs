// Dev-only: load the built app (dist/) in headless Chromium and take
// screenshots from a list of shots, without reloading between them. Run
// `npm run build -w @vibe-dump/pacific-theatre` first (and
// `node tools/fake-data.mjs` for the test data).
//
//   node tools/shoot.mjs [outdir] ['<json array of shots>' | preset] [extra query]
//   shot = { name, date, cam: [x, z, distance, yaw, pitch], battle, t, moment, preview, camera,
//            chapter, event, card, frames, wait, eval, until, keys, click, hover, mouse, settle, element, report,
//            viewport: [w, h], stay }
//     viewport: resize the page to it before the shot; stay: keep the box as it is (no leave, no enter)
//     date: the WarClock's date (YYYY-MM-DD), as #date does
//     cam: the active rig's pose in its scene's units (km on the table, m in a box), as #cam does
//     battle, t, moment: enter that box (app.battle.enter, with no fly-down), at that
//       battle-clock time, offering that moment; with the Stage 0 stub this lands the
//       table on the box's outline. preview: true then cuts into the stub's bare box
//       scene. A shot without `battle` leaves any box first.
//     camera: a box camera mode ('orbit', 'chase', ...) for the box scene's setCamera, when it has one
//     chapter: open the tour on that chapter's card (its index); event: open that event's card
//       through the tour (an id; true for the first event with a box); card: 'close' or 'credits'
//     eval: a function body run in the page with `app` (async allowed)
//     until: an expression waited on before the settle (app.ready, say)
//     report: an expression logged after the shot (app.stats(), say)
//     element: a selector to shoot alone instead of the page
//     keys: keys to press, in order; click / hover: a selector to click or rest on
//     mouse: [x, y] to rest the pointer at on the scene (after the settle)
//     settle: snap the camera's flight and the cut to where they're going (default true)
//   presets: "table" (the theatre, the test box's outline, the box's preview);
//            "gate" (the table workflow's gate: the whole table, an island group close, the
//            front at two keyframes with its hatch and perimeters, a card, the chapter page,
//            a cluster, the credits, the briefing and the after-card);
//            "ui" and "ui-air" (round two's interface on the dev page ui.html against the mock
//            Battle, served by Vite's dev server: the unit list, the unit card of a takeable ship,
//            of a greyed Arizona and of an aircraft, the briefing's Start here, the station bar,
//            a bookmark's title on the strip and the after-card over a span; "ui-air" the same
//            for an aircraft held at Midway). Any preset whose name starts with "ui", or PAGE=ui,
//            loads ui.html?box=$BOX&t=$T (pearl-harbor, 08:40) instead of the built app.
//            "phone-watch", "phone-held-air", "phone-held-ship" (the box on a phone held in portrait at
//            360×780, 390×844, 412×915 and 412×720, the owner's phone with the Claude app's header): watching
//            with a beat's subtitle, a held aircraft (Pearl Harbor's first door, the P-40 out of Haleʻiwa;
//            the fixtures' dive bomber) with its first hints, a held ship (Nevada at the anti-aircraft
//            station, then her helm; the fixtures' battleship), with the ⋯ sheet, the unit list and the
//            after-card for the aircraft and the briefing while watching; each with "-land" for the phone on its side
//            (844×390, 915×412); "phone-held-crew" an aircraft at its bombsight (a B5N2) and its rear gun;
//            "phone" all of them. A phone preset opens a mobile page (isMobile, hasTouch,
//            DPR 2 unless DPR says) and resizes it between shots, so one boot serves every size.
//            "wargame-start", "wargame-hud", "wargame-end" (round three's Wargame on ui.html against the mock
//            arena, src/ui/mock-arena.js, on Samar: the start sheet; the HUD layer mid-game with hit markers, then
//            the respawn line after a lost aircraft; the end card with its reel, then a still enlarged), "wargame"
//            all three; "wargame-phone" and "wargame-phone-land" the same on a mobile page at the phone sizes
//            upright and on its side (the box's HUD and touch controls built from their real classes as
//            stand-ins). A preset whose name starts with "wargame" loads ui.html (BOX=samar, T=07:00).
//   DATA=real   load public/data/ (the default once public/data/manifest.json exists)
//   VIEWPORT=390x844, PORT=5299, DPR=2, CHROMIUM_PATH=...
//
// The package directory is served as the root, so the app's ?data= can reach
// test-data/ beside dist/. Adapted from holo-i-ke-au's tools/shoot.mjs
// (b480c27): the server, the launch and the shot loop are kept; the Hawaiian
// presets (settlements, soldiers) are gone; it waits on app.ready.
import { chromium } from 'playwright'
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, normalize, extname } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
// (tools/shots/ is gitignored at the root)
const outDir = process.argv[2] || join(root, 'tools/shots')
// the whole theatre, the camera straight to it, the card closed
const HOME = 'app.ui?.card.close(); app.ui?.onScrub(); const h = app.table.rig.homeView(); app.table.rig.jump({ x: h.target.x, z: h.target.z, distance: h.distance, yaw: h.yaw, pitch: h.pitch })'
// a contested polygon over land in a keyframe, framed close (the hatch)
const HATCH = "app.ui?.card.close(); app.ui?.onScrub(); for (const [id, kf] of app.table.front.keyframes) for (const f of kf.geojson?.features || []) if (f.properties?.state === 'contested' && f.geometry?.type === 'Polygon') { const r = f.geometry.coordinates[0]; let x = 0, z = 0; for (const p of r) { const w = app.data.proj.toWorld(p); x += w[0]; z += w[1] } x /= r.length; z /= r.length; if (app.table.ground.metresAt(x, z) > 0) { app.clock.setDate(Date.parse(id + 'T12:00:00Z')); app.table.rig.jump({ x, z, distance: 1500, yaw: 0, pitch: 1.0 }); return } }"
// a keyframe's date, the middle of the fixtures' table
const KF = (i) => `app.ui?.card.close(); app.ui?.onScrub(); const k = [...app.table.front.keyframes.values()][${i}]; if (k) app.clock.setDate(Date.parse(k.date + 'T12:00:00Z')); app.table.rig.jump({ x: 800, z: 200, distance: 7000, yaw: 0, pitch: 1.05 })`
// the box event's date from the whole theatre, where its neighbours gather with it
const CLUSTER = "app.ui.card.close(); app.ui.pins.activeEvent = null; app.table.setFocus(null); app.ui.onScrub(); app.clock.setDate(Date.UTC(1942, 5, 4, 18)); const h = app.table.rig.homeView(); app.table.rig.jump({ x: h.target.x, z: h.target.z, distance: app.table.rig.maxDistance, yaw: 0, pitch: 1.12 })"
const BRIEFING = "app.ui.openBriefing({ title: 'The Test Box Battle, 4 June 1942', ja: { kanji: '試験海戦', romaji: 'Shiken kaisen' }, when: '4 June 1942, 10:20', clock: 'zone plus 12, Midway time (UTC−12)', clockNote: 'Test: Tokyo time is 21 hours ahead.', situation: 'Test: two made-up forces close near Dateline Island. Nothing here is history.', forces: [{ name: 'Test Japanese force', ja: '試験部隊', units: ['Test Carrier A', 'Test Battleship', 'Test Destroyer'] }, { name: 'Test US force', units: ['Test Carrier B', 'Test Cruiser', 'Test Destroyer'] }], moments: [{ id: 'test-dive', title: 'A test dive', role: 'a test dive bomber of the test group', t: '10:21:30', objective: 'Test: put a bomb on the test carrier.', focus: true }, { id: 'test-duel', title: 'A test gunnery duel', role: 'the test battleship', t: '11:40', objective: 'Test: hit the test cruiser.' }], sources: [{ id: 'test-source-a', where: 'p. 2' }], credit: 'Test terrain: made-up relief from tools/fake-data.mjs.' })"
// round two on ui.html: a clean slate (no card, no list, nothing held), a unit selected by its units() id, another box
const UI_RESET = 'if (app.battle.state?.station) app.ui.onRelease(); app.ui.card.close(); app.ui.unitList?.close();'
const UI_SELECT = (id) => `app.ui.onSelect(app.link.units().find((u) => u.id === ${JSON.stringify(id)}).index); await new Promise((r) => setTimeout(r, 100));`
const UI_BOX = (box, t) => `${UI_RESET} await app.urlBattle(new URLSearchParams('battle=${box}&t=${t}')); app.battle.pause(); app.ui.card.close();`
const AFTER = "app.ui.openAfter({ momentId: 'test-dive', title: 'A test dive', sortie: [{ label: 'Hits', value: 'one test bomb, aft' }, { label: 'Release', value: '740 m (the record: about 760 m)' }, { label: 'Came back', value: 'landed' }], battle: { rows: [{ what: 'Test Carrier A', record: 'burning from 10:25, sank 19:25', yours: 'burning from 10:24; sinks 19:25 as in the record' }], guesses: ['Test: the sim’s guess; the record has no such event'] }, record: { text: 'Test: the record counts between 1,000 and 1,200 men lost their lives aboard the test carrier.', tellings: [{ source: 'test-source-b', says: 'Test: three hits.' }], sources: ['test-source-a'] }, next: { text: 'Test: what came next.' }, retry: { start: true, checkpoint: true } })"
const useTest = process.env.DATA ? process.env.DATA === 'test' : !existsSync(join(root, 'public/data/manifest.json'))
// the box on a phone (style.css's phone layout, scene/hud.js and controls/touch.js under the same query): Pearl Harbor
// on the real data, the fixtures' box otherwise; the sizes the smoke test's bounding-box check measures, and the owner's
// phone as the Claude app shows a page (412 wide, about 720 under its header)
const PHONE_BOX = useTest ? 'test-box' : 'pearl-harbor'
const PHONE_T = useTest ? '10:15' : '07:57'
const PORTRAIT = [[360, 780], [390, 844], [412, 915], [412, 720]]
const LANDSCAPE = [[844, 390], [915, 412]]
// a beat's subtitle held on screen (a long one, as Pearl Harbor's are) and the first hints kept up while the sizes are shot
const SUBTITLE = "{ const hud = app.battle.scene.hud; hud.lines = [{ text: 'Kaga’s torpedo bombers (2nd Special Attack Unit) come in low over the ʻAiea hills toward Battleship Row', until: performance.now() / 1000 + 3600 }]; hud.textT = 0 }"
const HINTS_UP = '{ const hud = app.battle.scene.hud; if (hud.hints.textContent) hud.hintsUntil = performance.now() / 1000 + 3600 }'
const PHONE_ENTER = `if (app.battle.state?.boxId !== '${PHONE_BOX}') await app.battle.enter('${PHONE_BOX}', { t: '${PHONE_T}', from: 'url' }); if (app.battle.input) { app.ui.onRelease(); await new Promise((r) => setTimeout(r, 400)) } app.ui.card.close(); app.ui.unitList?.close(); try { localStorage.removeItem('pt.hints') } catch {}`
const PHONE_SETUP = {
  watch: `${PHONE_ENTER} app.battle.scrub(app.battle.sim.clock.parse('${PHONE_T}'), { answer: 'yes' }); app.ui.card.close(); app.battle.play(1); ${SUBTITLE}`,
  // (the first door where it is an aircraft, Pearl Harbor's; else an aircraft in the air at the first aircraft bookmark)
  air: `${PHONE_ENTER} const fd = app.battle.firstDoor; if (fd?.role?.kind === 'aircraft') app.ui.onFirstDoor(); else { const m = [...app.battle.sim.record.moments.values()].find((m) => m.role?.kind === 'aircraft'); if (m) app.battle.scrub(app.battle.sim.clock.parse(m.t), { answer: 'yes' }); const a = app.battle.sim.units().find((u) => u.kind === 'aircraft' && u.takeable === true && u.stations.includes('pilot')); app.takeUnit({ unit: a.id, station: 'pilot' }) } app.ui.card.close(); await new Promise((r) => setTimeout(r, 300)); app.battle.pause(); ${SUBTITLE} ${HINTS_UP}`,
  ship: `${PHONE_ENTER} app.battle.scrub(app.battle.sim.clock.parse('${PHONE_T}'), { answer: 'yes' }); app.takeUnit({ unit: '${useTest ? 'test-bb-b' : 'nevada'}', station: 'aa' }); app.ui.card.close(); await new Promise((r) => setTimeout(r, 300)); app.battle.pause(); ${SUBTITLE} ${HINTS_UP}`,
  // an aircraft's crew: the bombsight where one in the air offers it (a B5N2), then the rear gun
  crew: `${PHONE_ENTER} const m = [...app.battle.sim.record.moments.values()].find((m) => m.role?.kind === 'aircraft'); if (m) app.battle.scrub(app.battle.sim.clock.parse(m.t), { answer: 'yes' }); const rows = app.battle.sim.units().filter((u) => u.kind === 'aircraft' && u.takeable === true); const a = rows.find((u) => u.stations.includes('bombardier')) || rows.find((u) => u.stations.includes('gunner')); app.takeUnit({ unit: a.id, station: a.stations.includes('bombardier') ? 'bombardier' : 'gunner' }); app.ui.card.close(); await new Promise((r) => setTimeout(r, 300)); app.battle.pause(); ${SUBTITLE} ${HINTS_UP}`,
  gunner: "if (app.battle.state.station !== 'gunner') app.ui.onStation('gunner'); await new Promise((r) => setTimeout(r, 300)); app.battle.pause();",
  // the same ship at her helm: the helm and telegraph sliders, salvo, torpedoes and AA
  helm: "app.ui.onStation('helm'); await new Promise((r) => setTimeout(r, 300)); app.battle.pause();",
  // the ⋯ sheet open over the held view; then Units from it (the list between the bar and the controls); then Release
  more: "document.querySelector('.boxbar .bb-more')?.click(); await new Promise((r) => setTimeout(r, 200));",
  units: "document.querySelector('.boxbar .bb-units')?.click(); await new Promise((r) => setTimeout(r, 400));",
  // a ship's row in the list while held: its card, between the bar and the controls
  'unit-card': "document.querySelector('.unitlist .ul-row[data-key^=\"u:\"]')?.click(); await new Promise((r) => setTimeout(r, 400));",
  after: "app.ui.unitList?.close(); app.ui.card.close(); document.querySelector('.boxbar .bb-release')?.click(); await new Promise((r) => setTimeout(r, 800));",
  // watching with the briefing open
  card: "app.link.openBriefing(); await new Promise((r) => setTimeout(r, 400));",
}
// round three on ui.html: the Wargame on Samar against the mock arena (the start sheet, the HUD layer with markers, the
// respawn line, the end card and a still enlarged); the game run on to a condition and held there
const WG_IN = (side = 'us') => `if (!app.link.wg) { try { localStorage.removeItem('pt.hints') } catch {} app.ui.card.close(); await app.link.openStartSheet('samar'); await app.link.startWargame('samar', '${side}') }`
const WG_RUN = (t, cond) => `app.ui.card.close(); app.battle.arena.seek(${t}); app.battle.play(1); const t0 = performance.now(); while (!(${cond}) && performance.now() - t0 < 30000) await new Promise((r) => setTimeout(r, 100)); app.battle.pause();`
const WG = {
  start: `${UI_RESET} if (app.link.wg) await app.leaveBox(); if (!app.battle.sim) await app.urlBattle(new URLSearchParams('battle=samar&t=07:00')); app.battle.pause(); try { localStorage.removeItem('pt.hints') } catch {} await app.link.openStartSheet('samar'); await new Promise((r) => setTimeout(r, 300))`,
  hud: `${WG_IN()} ${WG_RUN(148, "document.querySelectorAll('.wg-mark').length >= 2")} ${'{'} const a = app.battle.arena; const me = a.player.unitIndex; const d = (u) => Math.hypot(a.state.pos[3 * u.index] - a.state.pos[3 * me], a.state.pos[3 * u.index + 2] - a.state.pos[3 * me + 2]); const t = a.u.filter((u) => u.side !== a.side && u.alive === 1 && u.kind === 'ship').sort((p, q) => d(p) - d(q))[0]; if (t) a.events.push({ id: 700000 + a.events.length, t: a.t, kind: 'hit', target: t.index, text: t.name + ': torpedo hit amidships, fire', mine: true }, { id: 700001 + a.events.length, t: a.t, kind: 'hit', target: t.index, text: t.name + ': hit aft', mine: true }) }`,
  respawn: `${WG_IN()} app.ui.onHop('aircraft'); ${WG_RUN(209.5, "document.querySelector('.wg-say.show')")}`,
  end: `${WG_IN()} ${WG_RUN(598, "app.ui.card.mode === 'wargame-end'")} await new Promise((r) => setTimeout(r, 400))`,
  zoom: "document.querySelector('.wg-shot')?.click(); await new Promise((r) => setTimeout(r, 300))",
  // (between a phone's sizes: the hints and the respawn line held, a fresh marker on the nearest ship of the other side)
  hold: "{ const h = app.link.hud; if (h?.hintsEl.textContent) h.hintUntil = performance.now() / 1000 + 3600; if (h?.sayEl.textContent) h.sayUntil = performance.now() / 1000 + 3600; const a = app.battle.arena; if (a && !a.result) { const me = a.player.unitIndex; const d = (u) => Math.hypot(a.state.pos[3 * u.index] - a.state.pos[3 * me], a.state.pos[3 * u.index + 2] - a.state.pos[3 * me + 2]); const t = a.u.filter((u) => u.side !== a.side && u.alive === 1 && u.kind === 'ship').sort((p, q) => d(p) - d(q))[0]; if (t) a.events.push({ id: 700000 + a.events.length, t: a.t, kind: 'hit', target: t.index, text: t.name + ': hit forward, fire', mine: true }) } }",
}
const wgShots = (name, sizes, steps) => steps.flatMap(([step, eval_]) => sizes.map(([w, h], i) => ({ name: `${name}-${step}-${w}x${h}`, viewport: [w, h], eval: i === 0 ? eval_ : WG.hold, frames: 2 })))
const phoneShots = (name, sizes, steps) => steps.flatMap(([step, eval_]) => sizes.map(([w, h], i) => ({ name: `${name}${step ? `-${step}` : ''}-${w}x${h}`, battle: PHONE_BOX, stay: true, viewport: [w, h], eval: i === 0 ? eval_ : undefined, settle: true, frames: 3 })))
const PRESETS = {
  gate: [
    { name: 'gate-table', eval: HOME, frames: 3 },
    // an island group: the Solomons on the real data (Guadalcanal's place), the fixture's islands otherwise
    { name: 'gate-island', eval: "app.ui?.card.close(); const p = app.data.places.find((x) => x.id === 'guadalcanal'); const [x, z] = p && p.geometry?.type === 'Point' ? app.data.proj.toWorld(p.geometry.coordinates) : [-213, -1168]; app.table.rig.jump({ x, z, distance: 900, yaw: 0, pitch: 0.95 })", frames: 3 },
    { name: 'gate-front-a', eval: KF(0), frames: 3, report: 'app.table.front.legend()' },
    { name: 'gate-front-b', eval: KF(1), frames: 3, report: 'app.table.front.legend()' },
    { name: 'gate-hatch', eval: HATCH, frames: 3 },
    { name: 'gate-card', event: true, frames: 3 },
    { name: 'gate-chapter', click: ".tl-tick[data-i='2']", frames: 3 },
    { name: 'gate-cluster', eval: CLUSTER, frames: 3, report: 'app.ui.pins.groups()' },
    { name: 'gate-credits', card: 'credits', frames: 2 },
    { name: 'gate-briefing', eval: BRIEFING, frames: 2 },
    { name: 'gate-after', eval: AFTER, frames: 2 },
  ],
  table: [
    { name: 'table-theatre', eval: 'const h = app.table.rig.homeView(); app.table.rig.jump({ x: h.target.x, z: h.target.z, distance: h.distance, yaw: h.yaw, pitch: h.pitch })', frames: 3 },
    { name: 'table-outline', battle: 'test-box', frames: 3 },
    { name: 'box-preview', battle: 'test-box', preview: true, frames: 3 },
  ],
  // round two's interface on ui.html (the mock Battle over the real Pearl Harbor file)
  ui: [
    { name: 'ui-list', eval: `${UI_RESET} app.ui.onUnits()`, frames: 2 },
    { name: 'ui-list-air', eval: "document.querySelector('.ul-filter [data-kind=aircraft]').click()", frames: 2 },
    { name: 'ui-card-ship', eval: `document.querySelector('.ul-filter [data-kind=all]').click(); ${UI_SELECT('nevada')}`, frames: 2 },
    { name: 'ui-card-grey', eval: UI_SELECT('arizona'), frames: 2 },
    { name: 'ui-card-air', eval: UI_SELECT('kaga-level#3'), frames: 2 },
    { name: 'ui-briefing', eval: "app.ui.unitList.close(); app.link.openBriefing(); document.querySelector('.card .door')?.scrollIntoView()", frames: 2 },
    { name: 'ui-station-bar', eval: `app.ui.card.close(); ${UI_SELECT('nevada')} document.querySelector('.card [data-station=main]').click(); await new Promise((r) => setTimeout(r, 200)); document.querySelector('.bb-st[data-station=aa]').click()`, frames: 2 },
    { name: 'ui-after', eval: "app.battle.play(8); await new Promise((r) => setTimeout(r, 4500)); app.ui.onRelease()", frames: 2 },
    { name: 'ui-strip', eval: 'app.ui.card.close()', hover: '.bb-mark', frames: 1 },
  ],
  // an aircraft held, at Midway
  'ui-air': [
    { name: 'ui-air-card', eval: `${UI_BOX('midway', '10:22')} ${UI_SELECT('vb-6#4')}`, frames: 2 },
    { name: 'ui-air-held', eval: "document.querySelector('.card [data-station=gunner]').click()", frames: 2 },
    { name: 'ui-air-after', eval: 'app.battle.play(2); await new Promise((r) => setTimeout(r, 5000)); app.ui.onRelease()', frames: 2 },
    { name: 'ui-air-briefing', eval: "app.link.openBriefing(); document.querySelector('.card .door')?.scrollIntoView()", frames: 2 },
  ],
  // the box on a phone: watching, an aircraft held, a ship held (at the AA director, then the helm, then the ⋯ sheet open)
  'phone-watch': phoneShots('phone-watch', PORTRAIT, [['', PHONE_SETUP.watch], ['card', PHONE_SETUP.card]]),
  'phone-held-air': phoneShots('phone-held-air', PORTRAIT, [['', PHONE_SETUP.air], ['more', PHONE_SETUP.more], ['units', PHONE_SETUP.units], ['unit-card', PHONE_SETUP['unit-card']], ['after', PHONE_SETUP.after]]),
  'phone-held-ship': phoneShots('phone-held-ship', PORTRAIT, [['aa', PHONE_SETUP.ship], ['helm', PHONE_SETUP.helm]]),
  'phone-held-crew': phoneShots('phone-held-crew', PORTRAIT, [['sight', PHONE_SETUP.crew], ['gunner', PHONE_SETUP.gunner]]),
  'phone-held-crew-land': phoneShots('phone-held-crew-land', LANDSCAPE, [['sight', PHONE_SETUP.crew], ['gunner', PHONE_SETUP.gunner]]),
  'phone-watch-land': phoneShots('phone-watch-land', LANDSCAPE, [['', PHONE_SETUP.watch], ['card', PHONE_SETUP.card]]),
  'phone-held-air-land': phoneShots('phone-held-air-land', LANDSCAPE, [['', PHONE_SETUP.air], ['more', PHONE_SETUP.more], ['units', PHONE_SETUP.units], ['unit-card', PHONE_SETUP['unit-card']], ['after', PHONE_SETUP.after]]),
  'phone-held-ship-land': phoneShots('phone-held-ship-land', LANDSCAPE, [['aa', PHONE_SETUP.ship], ['helm', PHONE_SETUP.helm]]),
}
// round three: the Wargame on ui.html
PRESETS['wargame-start'] = [{ name: 'wargame-start', eval: WG.start, frames: 2 }]
PRESETS['wargame-hud'] = [{ name: 'wargame-hud', eval: WG.hud, frames: 1 }, { name: 'wargame-respawn', eval: WG.respawn, frames: 1 }]
PRESETS['wargame-end'] = [{ name: 'wargame-end', eval: WG.end, frames: 2 }, { name: 'wargame-zoom', eval: WG.zoom, frames: 1 }]
PRESETS.wargame = [...PRESETS['wargame-start'], ...PRESETS['wargame-hud'], ...PRESETS['wargame-end']]
PRESETS['wargame-phone'] = wgShots('wargame-phone', PORTRAIT, [['start', WG.start], ['hud', WG.hud], ['respawn', WG.respawn], ['end', WG.end]])
PRESETS['wargame-phone-land'] = wgShots('wargame-phone-land', LANDSCAPE, [['start', WG.start], ['hud', WG.hud], ['respawn', WG.respawn], ['end', WG.end]])
PRESETS.phone = ['phone-watch', 'phone-watch-land', 'phone-held-air', 'phone-held-air-land', 'phone-held-crew', 'phone-held-crew-land', 'phone-held-ship', 'phone-held-ship-land'].flatMap((k) => PRESETS[k])
const preset = process.argv[3] || ''
const WARGAME = preset.startsWith('wargame')
const UI = preset.startsWith('ui') || WARGAME || process.env.PAGE === 'ui'
const MOBILE = preset.startsWith('phone') || preset.includes('-phone') || process.env.MOBILE === '1'
const shots = PRESETS[preset] || JSON.parse(preset || '[{"name":"default"}]')
const extra = process.argv[4] || ''
const port = Number(process.env.PORT || 5299)
mkdirSync(outDir, { recursive: true })

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.geojson': 'application/geo+json', '.png': 'image/png', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' }
export function serve(dir, p) {
  const server = createServer(async (req, res) => {
    let f = normalize(join(dir, decodeURIComponent(req.url.split('?')[0])))
    if (!f.startsWith(dir)) return res.writeHead(403).end()
    const s = await stat(f).catch(() => null)
    if (s?.isDirectory()) f = join(f, 'index.html')
    const body = await readFile(f).catch(() => null)
    if (!body) return res.writeHead(404).end('not found')
    res.writeHead(200, { 'Content-Type': MIME[extname(f)] || 'application/octet-stream' }).end(body)
  })
  return new Promise((r) => server.listen(p, '127.0.0.1', () => r(server)))
}

const server = await serve(root, port)
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
})
const [vw, vh] = process.env.VIEWPORT ? process.env.VIEWPORT.split('x').map(Number) : shots[0]?.viewport || [1280, 800]
// (a phone preset: a mobile page with touch, as the owner's Android phone; Chromium then matches (pointer: coarse))
const page = await browser.newPage({ viewport: { width: vw, height: vh }, deviceScaleFactor: Number(process.env.DPR || (MOBILE ? 2 : 1)), hasTouch: MOBILE || vw < 760, isMobile: MOBILE })
const errors = []
page.on('console', (m) => {
  if (m.type() === 'error' || m.type() === 'warning') errors.push(`${m.type()}: ${m.text()}`)
  console.log('[page]', m.type(), m.text())
})
page.on('pageerror', (e) => {
  errors.push(`pageerror: ${e.message}`)
  console.log('[pageerror]', e.message)
})
const t0 = Date.now()
let vite = null
if (UI) {
  // the dev page is not in the build: Vite's dev server serves it (and public/data at ./data/)
  const { createServer: viteServer } = await import('vite')
  vite = await viteServer({ root, configFile: join(root, 'vite.config.js'), logLevel: 'error', clearScreen: false, server: { port: port + 1, host: '127.0.0.1', strictPort: false, hmr: false } })
  await vite.listen()
  const q = [`box=${process.env.BOX || (WARGAME ? 'samar' : 'pearl-harbor')}`, `t=${process.env.T || (WARGAME ? '07:00' : '08:40')}`, 'paused', extra].filter(Boolean).join('&')
  await page.goto(`http://127.0.0.1:${vite.httpServer.address().port}/ui.html?${q}`)
  await page.waitForFunction(() => window.__app?.ready && window.__app.battle?.sim, null, { timeout: 180000 })
  console.log('the dev page up after', Date.now() - t0, 'ms (the mock Battle over the real battle file)')
} else {
  const q = [useTest ? 'data=../test-data/' : '', extra].filter(Boolean).join('&')
  await page.goto(`http://127.0.0.1:${port}/dist/index.html${q ? `?${q}` : ''}`)
  await page.waitForSelector('#boot', { state: 'detached', timeout: 180000 })
  await page.waitForFunction(() => window.__app?.ready, null, { timeout: 180000 })
  console.log('booted after', Date.now() - t0, 'ms', useTest ? '(test data)' : '(real data)')
}

const frames = async (n) => {
  const f0 = await page.evaluate(() => window.__app.frames)
  await page.waitForFunction(([f0, n]) => window.__app.frames > f0 + n, [f0, n], { timeout: 300000 })
}

for (const s of shots) {
  if (s.viewport && !process.env.VIEWPORT) {
    const v = page.viewportSize()
    if (v.width !== s.viewport[0] || v.height !== s.viewport[1]) await page.setViewportSize({ width: s.viewport[0], height: s.viewport[1] })
  }
  await page.evaluate(async ([s, UI]) => {
    const app = window.__app
    const b = app.battle
    // the dev page stays in its box; only eval, keys, click and hover act there
    if (UI) {
      if (s.eval) await new Function('app', `return (async () => { ${s.eval} })()`)(app)
      return
    }
    // a shot without a battle, or with another one, leaves the box it is in (unless it stays, as a phone's sizes do)
    if (s.stay && s.battle && b.state?.boxId === s.battle && b.scene) {
      if (s.eval) await new Function('app', `return (async () => { ${s.eval} })()`)(app)
      return
    }
    if (b.state && (!s.battle || s.battle !== b.state.boxId || (b.scene && !s.preview))) await b.leave()
    if (s.date) app.clock.setDate(Date.parse(`${s.date}T00:00:00Z`))
    if (s.battle && b.state?.boxId !== s.battle) await b.enter(s.battle, { t: s.t ?? null, momentId: s.moment ?? null, from: 'url' })
    if (s.preview && !b.scene) await b.preview()
    if (s.cam) {
      const [x, z, distance, yaw, pitch] = s.cam
      app.active.rig.jump({ x, z, distance, yaw, pitch })
    }
    if (s.camera && app.active.setCamera) app.active.setCamera(s.camera)
    if (s.chapter !== undefined) app.tour.goTo(s.chapter, -1)
    if (s.event) {
      const ev = s.event === true ? app.data.events.find((e) => e.box && app.data.boxById.has(e.box)) : app.data.events.find((e) => e.id === s.event)
      if (ev) app.tour.open(ev)
    }
    if (s.card === 'close') app.ui.card.close()
    if (s.card === 'credits') app.ui.openCredits()
    if (s.eval) await new Function('app', `return (async () => { ${s.eval} })()`)(app)
  }, [s, UI])
  for (const k of s.keys || []) await page.keyboard.press(k)
  if (s.click) await page.click(s.click, { timeout: 30000 })
  // a frame to move the camera, then let the ground and the camera's target settle
  await frames(1)
  if (s.until) await page.waitForFunction(new Function(`const app = window.__app; return ${s.until}`), null, { timeout: 300000 })
  if (s.settle !== false) await page.evaluate(() => window.__app.settle())
  await frames(s.frames ?? 3)
  if (s.hover) {
    await page.hover(s.hover, { timeout: 30000 })
    await frames(2)
  }
  if (s.mouse) {
    await page.mouse.move(s.mouse[0] - 6, s.mouse[1])
    await page.waitForTimeout(150)
    await page.mouse.move(s.mouse[0], s.mouse[1])
    await frames(2)
  }
  if (s.wait) await page.waitForTimeout(s.wait)
  const t = Date.now()
  const file = join(outDir, (s.name || 'shot') + '.png')
  if (s.element) await page.locator(s.element).screenshot({ path: file, timeout: 180000 })
  else await page.screenshot({ path: file, timeout: 180000 })
  const info = await page.evaluate(() => {
    const a = window.__app
    const st = a.stats()
    return { mode: a.mode, scene: st.scene, d: st.distance, exag: st.exag, nodes: st.nodes, calls: st.calls, date: new Date(a.clock.date).toISOString().slice(0, 10), battle: a.battle.state, hash: location.hash }
  })
  if (s.report) console.log('report', s.name, JSON.stringify(await page.evaluate(new Function(`const app = window.__app; return ${s.report}`))))
  // (a phone's sizes: the name, the size and the mode are enough)
  if (MOBILE) console.log('shot', s.name, 'in', Date.now() - t, 'ms', JSON.stringify({ mode: info.mode, held: info.battle?.held?.id ?? null, station: info.battle?.station ?? null, t: info.battle?.t != null ? Math.round(info.battle.t) : null }), '→', file)
  else console.log('shot', s.name, 'in', Date.now() - t, 'ms', JSON.stringify(info), '→', file)
}
const perf = await page.evaluate(() => window.__app.stats?.())
if (perf) console.log('stats', JSON.stringify(perf))
console.log(errors.length ? `${errors.length} console errors/warnings: ${errors.slice(0, 3).join(' | ')}` : 'no console errors')
await browser.close()
server.close()
await vite?.close()
