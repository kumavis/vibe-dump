// The table and the box joined (ENGINEERING.md §§8, 9, 11; DESIGN.md §§5.6–5.7;
// ROUND-2.md §§1, 4–5): the UI's hooks wired to app.battle, the box's bar,
// the unit list, the unit card, the briefing and the after-card built from
// battle.json, sim.units() and sim.sortie (or the first round's score and
// outcome) as plain objects (so the UI never imports the sim), the URL's
// #battle, #t, #moment, #unit and #station, and the keys that belong to no
// one module (Esc in a moment and while flying down; L and Enter while
// watching a box: Tab is the box's own, the next unit while watching and the
// next station while a unit is held).
//
// Watching is the default: entering a box plays the record at once, the
// briefing open beside it; taking the controls is an offer, never a prompt:
// on the briefing (Start here, the record's turning points), on a stop's
// card, on the unit card (a station's button), on the bar's strip (a
// bookmark), and from the URL (#moment or #unit focus the button, never
// press it: a sortie never starts without a click, and its click is the one
// pointer lock is asked from).
//
// The hooks (ROUND-2 §5):
//
//   ui.onSelect(index)          a row of the unit list → Battle.select(index); the unit card opens
//   ui.onTake(arg)              a bookmark's id (a string: Battle.takeMoment, as before) or a role
//                               { unit | group, index?, station, t? } (Battle.take)
//   ui.onStation(name)          the bar's station buttons, the held unit's card → Battle.setStation (Tab: the controls')
//   ui.onRelease()              Release on the bar or the card → Battle.release(); the after-card follows
//   ui.onAssist(value)          Assisted or Pilot → app.setAssist (Battle.assist, kept as pt.assist)
//   ui.onFirstDoor()            Start here → Battle.take(firstDoor.role at firstDoor.t)
//   ui.onUnits()                the unit list, opened or closed
//
// The after-card opens once per held sortie, whichever way it ends: the
// promise a take returns (takeMoment's, as before), the 'battle' event
// { kind: 'released', sortie } (a release by Backspace or the fate of the
// unit, as the engine sees it), app.link.afterSortie(sortie), or the value
// Battle.release() returns. research/ui-2.md lists every call into Battle
// with the signature this file expects.
//
// Round three (ROUND-3.md §1, §4–5), the Wargame: a box event's card, the
// briefing and the bar (watching) offer it where the box has one; the start
// sheet shows the two sides' forces and goals from the scenario
// (public/data/wargames/<id>.json) and the box's battle file; a side's button
// enters it (Battle.enterWargame(id, { side })); while it runs the HUD layer
// (ui/wargame.js) is fed each frame from the arena (strength, tally,
// objective, phase, the events for the hit markers and the respawn line, the
// highlights for the reel), the bar holds the stations and the hop button,
// the unit list and a tap in the box possess a unit of the played side at
// once (Battle.hop(index)); the arena's result opens the end card, whose
// buttons restart (Battle.restart({ side })) or leave. The hooks:
//
//   ui.wargameFor(ev)           the scenario id a box event's card offers (or null)
//   ui.onWargame(id)            *Play it as a wargame* / *Wargame* → the start sheet
//   ui.onWargameStart(side)     *Japan* / *United States* on the start sheet → Battle.enterWargame
//   ui.onWargameRestart(side)   *Play again* / *Play the other side* → Battle.restart({ side })
//   ui.onHop(kind)              the bar's hop button ('next'), and a unit picked in a wargame (its index) → Battle.hop
//
// The URL: #wargame=<id>&side=<jp|us>, written on start (App keeps them as
// unknown keys and writes them back), cleared on leave; read at boot, it
// opens the start sheet with that side's button focused, never pressed (a
// wargame starts on a click, as a sortie does). research/ui-3.md lists every
// call into the arena and Battle with the shape this file expects.

import { BoxBar } from './ui/boxbar.js'
import { UnitList } from './ui/unitlist.js'
import { sideName } from './ui/names.js'
import { STATION, stationLabel, kitShort, kitLine, shipType, rolePhrase, aircraftRole, eventLine, attackLine, countWords, damageWords, asSentence, midName, ASSIST, SIDE_ORDER as SIDES, FATE_VERB } from './ui/roles.js'
import { WargameHud, HOP_ICON, TYPE_ORDER, numWord, typeCount, clockText } from './ui/wargame.js'

const SIDE_ORDER = { ...SIDES }
const WATCH_SCALES = [1, 2, 4, 8, 15, 30, 60]
const SHIP_SCALES = [1, 2, 4, 8]
const narrow = () => innerWidth <= 760
// the wargames (tools/check/ids.json `wargames`): a scenario's id is its box's (ROUND-3 §6); a loader's list wins (app.data.wargames)
const WARGAMES = ['samar', 'midway', 'ironbottom-sound']
const WG_LABEL = 'A wargame played with the real forces. The record is on the other side of the table.'
const WG_KEY = { jp: 'japan', us: 'usa' }
const otherSide = (s) => (s === 'jp' ? 'us' : 'jp')
// the arena's events that put a marker on their target (ROUND-3 §1: machine words at the target)
const MARKED = new Set(['hit', 'torpedo-hit', 'bomb-hit', 'gun-hit', 'fire', 'downed', 'shot-down', 'sinking', 'sunk', 'magazine'])

export function link(app, ui) {
  const battle = app.battle
  const L = { stop: -1, offered: null, busy: false, held: null, session: 0, shown: 0, cache: null, selected: null, cardIndex: null, heldIndex: -1, heldStation: null, seenSelected: undefined, slow: 0, wg: null, sheet: null, scenarios: new Map(), boxFiles: null }
  app.link = L

  // --- the box's bar -----------------------------------------------------------------
  const bar = new BoxBar(ui.root, {
    leave: () => leave(),
    step: (d) => step(d),
    play: () => battle.play(Math.max(battle.input ? 0.5 : 1, battle.timeScale)),
    pause: () => battle.pause(),
    speed: (d) => battle.cycleTime(d),
    setSpeed: (v) => battle.play(v),
    briefing: () => openBriefing(),
    credits: () => ui.openCredits(),
    keepGoing: () => {
      battle.keepGoing()
      // (the click is a gesture: an aircraft takes the pointer back)
      if (battle.sim?.player?.kind === 'aircraft' && !battle.sim.player.scripted) battle.input?.requestLock?.()
    },
    card: () => battle.finish('card'),
    units: () => ui.onUnits(),
    station: (name) => ui.onStation(name),
    release: () => ui.onRelease(),
    assist: (v) => ui.onAssist(v),
    take: (id) => ui.onTake(id),
    goStop: (i) => goStop(i),
    scrub: (t) => {
      if (battle.input) return
      battle.scrub(t)
      L.stop = stopIndexAt(battle.sim?.t ?? 0)
    },
    wargame: () => ui.onWargame(wargameFor(battle.loaded?.box?.id)),
    hop: () => ui.onHop('next'),
  })
  L.bar = bar

  // --- the Wargame's HUD layer (ui/wargame.js): under the bar, part of its head ------------------------
  const hud = new WargameHud(ui.root, { layout: () => bar.publish() })
  bar.observe(hud.board)
  L.hud = hud

  // --- the unit list -------------------------------------------------------------------
  const list = new UnitList(ui.root, {
    select: (row) => ui.onSelect(row.index, row),
    close: () => {},
  })
  L.list = list
  ui.unitList = list

  app.updaters.push(() => {
    // (a wargame has its own frame: the arena, the HUD layer, the bar's wargame mode)
    if (wargameFrame()) return
    const sim = battle.sim
    if (!sim || app.active !== battle.scene || app.mode === 'flying') {
      if (list.isOpen) list.close()
      ui.root.classList.remove('holding')
      return bar.set(null)
    }
    const ms = sim.momentState
    const heldU = heldUnit()
    trackHeld(heldU)
    const holding = !!(battle.input || sim.player)
    const mode = holding ? (ms?.checkpoint && !battle.running ? 'checkpoint' : 'held') : 'watch'
    // (the bar moves to the top while a unit is held, and the list and the card step down: style.css)
    ui.root.classList.toggle('holding', mode === 'held')
    const stops = sim.record.stops
    const where = heldU ? heldU.name : L.stop >= 0 ? `stop ${L.stop + 1} of ${stops.length}` : battle.loaded?.battle.title?.split(',')[0] ?? ''
    bar.set({
      mode,
      clock: sim.clock.label(sim.t),
      clockS: sim.clock.label(sim.t, { seconds: true }),
      where,
      stop: [L.stop, stops.length],
      running: battle.running,
      scale: battle.timeScale,
      scales: speeds(heldU),
      t: Math.round(sim.t),
      duration: sim.clock.duration,
      door: !!wargameFor(battle.loaded?.box?.id),
      assist: assist(),
      held: heldU ? { name: heldU.name, station: heldStation(), stations: (heldU.stations || []).map((s) => ({ name: s, label: stationLabel(s), short: STATION[s]?.short ?? null, where: STATION[s]?.where ?? '' })) } : null,
    })
    // the list, the unit card and the selection follow the clock, a few times a second
    const now = performance.now()
    if (now - L.slow < 250) return
    L.slow = now
    const sel = selectedIndex()
    if (sel !== L.seenSelected) {
      // (a click in the box selected it: the card follows, unless another card is being read)
      const fromBox = L.seenSelected !== undefined && sel !== L.selected
      L.seenSelected = sel
      L.selected = sel
      if (fromBox && sel != null && (!ui.card.isOpen || ui.card.mode === 'unit')) openUnitCard(sel)
    }
    if (ui.card.isOpen && ui.card.mode === 'unit' && L.cardIndex != null) openUnitCard(L.cardIndex, { refresh: true })
    if (list.isOpen) list.set(listData())
  })

  // --- the hooks -----------------------------------------------------------------------
  ui.onEnter = (ev) => enter(ev.box, { from: 'table' })
  ui.onPrefetch = (ev) => app.prefetch(ev.box)
  ui.onTake = (arg) => (typeof arg === 'string' ? take(arg) : takeUnit(arg))
  ui.onWatch = () => battle.play(Math.max(1, battle.timeScale))
  ui.onWatchOn = () => {
    battle.play(1)
    app.url.moment = null
  }
  ui.onLeave = () => {
    if (app.mode === 'flying') return battle.abort()
    if (battle.scene) leave()
  }
  ui.onRetry = (momentId, from) => {
    ui.card.close()
    const p = battle.restart(from === 'checkpoint' ? 'checkpoint' : 'start')
    if (p) {
      const session = ++L.session
      L.held = { session, momentId }
      p.then((r) => after(r, session))
    }
  }
  ui.onStep = (d) => step(d)
  // (a group row whose aircraft are all greyed but which flies a spare selects its first aircraft and offers the spare)
  ui.onSelect = (index, row) => select(index, { spareOf: row?.spareOf ?? null })
  ui.onStation = (name) => setStation(name)
  ui.onRelease = () => release()
  ui.onAssist = (v) => setAssist(v)
  ui.onFirstDoor = () => {
    const fd = battle.firstDoor
    // (a first door's spare starts where the battle file says: Pearl Harbor's P-40 out of Haleʻiwa)
    if (fd?.role) return takeUnit({ ...fd.role, t: fd.t, ...(fd.start ? { start: fd.start } : {}) })
  }
  ui.onUnits = () => toggleList()
  // round three (ROUND-3 §5)
  ui.wargameFor = (ev) => wargameFor(ev?.box)
  ui.onWargame = (id) => openStartSheet(id)
  ui.onWargameStart = (side) => startWargame(L.sheet, side)
  ui.onWargameRestart = (side) => restartWargame(side)
  ui.onHop = (kind) => hop(kind)
  // (the start sheet closed without a start: the URL lets the wargame go)
  const cardClosed = ui.onCardClosed?.bind(ui)
  ui.onCardClosed = (was, mode) => {
    if (mode === 'wargame' && !L.wg) clearWargameUrl()
    cardClosed?.(was, mode)
  }

  // Esc in a moment without pointer lock gives the controls back (with the lock, the browser's Esc
  // leaves the lock and the battle pauses and offers release: battle/controls/input.js)
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || app.mode !== 'moment' || document.pointerLockElement) return
    // (in a wargame Esc closes its card, or the list, and gives nothing back: a wargame is always held)
    if (L.wg) {
      if (e.defaultPrevented) return
      if (list.isOpen) list.close()
      else if (ui.card.isOpen) ui.card.close()
      else return
      e.preventDefault()
      return
    }
    e.preventDefault()
    release()
  })
  // L (the list) and Enter (the selection's card) while watching are this file's; Tab is the box's (the next unit
  // while watching: Battle's watch keys; the next station while a unit is held: the controls', controls/input.js)
  addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
    if (!battle.sim || app.active !== battle.scene || e.target.closest?.('input, textarea, select')) return
    if (app.mode !== 'watch') return
    if (e.code === 'KeyL') {
      e.preventDefault()
      toggleList()
    } else if ((e.code === 'Enter' || e.code === 'NumpadEnter') && !e.target.closest?.('button, a') && !battle._question) {
      const sel = selectedIndex()
      if (sel == null) return
      e.preventDefault()
      openUnitCard(sel)
    }
  })
  // a box's own events: the checkpoint's offer, the end of a sortie, a selection made in the box
  app.events.addEventListener('battle', (e) => {
    const d = e.detail
    // at the checkpoint the pointer comes back, so the bar's two buttons can be pressed
    if (d.kind === 'checkpoint' && document.pointerLockElement) document.exitPointerLock?.()
    // a changed battle returned to the record on the way to a stop (the scrub's Y): the stop's camera and card, as the walk gives them
    const stop = d.kind === 'rebuilt' && d.stop != null ? battle.sim?.record.stops[d.stop] : null
    if (stop) {
      L.stop = d.stop
      battle.lookAtStop(stop)
      ui.card.openStop(stopCard(d.stop))
    }
    if (d.kind === 'enter' || d.kind === 'rebuilt') {
      L.cache = null
      setMarks()
    }
    // the unit given back, by Backspace or by its fate: the sortie's card
    if ((d.kind === 'released' || d.kind === 'sortie') && d.sortie) after({ sortie: d.sortie, outcome: d.outcome ?? null, reason: d.sortie.how ?? d.reason ?? 'released', momentId: d.momentId ?? L.held?.momentId ?? null }, L.held?.session ?? 0)
    if (d.kind === 'select' || d.kind === 'take' || d.kind === 'station') L.cache = null
    // a wargame the engine left by itself (the browser's Back, Esc with its own confirm): the layer and the URL let it go
    if (d.kind === 'leave' && L.wg) endWargameState()
    // a hit the engine raises as an event rather than in arena.events: a marker all the same
    if (L.wg && MARKED.has(d.kind) && d.target != null && d.text) L.wg.extra.push({ kind: d.kind, target: d.target, text: d.text, mine: !!d.mine, id: `x${++L.wg.xid}` })
  })
  /** For the engine: the after-card of the sortie just closed (the event above does the same). */
  L.afterSortie = (sortie, extra = {}) => after({ sortie, reason: sortie?.how ?? 'released', ...extra }, L.held?.session ?? 0)

  // --- entering, leaving, the stops ----------------------------------------------------------
  async function enter(boxId, { from = 'table', t = null, momentId = null } = {}) {
    if (L.busy || !app.data.boxById.has(boxId)) return
    L.busy = true
    try {
      ui.card.close()
      ui.help.classList.add('hidden')
      const state = await battle.enter(boxId, { from, t, momentId })
      if (!state) return // (aborted)
      // the table waits at the battle's date (the tour keeps its place)
      ui.tour.setting = true
      app.clock.setDate(battle.sim.clock.utc(0))
      ui.tour.setting = false
      L.stop = stopIndexAt(battle.sim.t)
      L.offered = momentId
      L.cache = null
      L.selected = null
      L.seenSelected = undefined
      L.heldIndex = -1
      app.url.battle = boxId
      app.url.moment = momentId
      app.url.unit = null
      app.url.station = null
      // the setting the browser kept goes to the box (App reads it at boot)
      if (app.assist && 'assist' in battle) {
        try {
          battle.assist = app.assist
        } catch (err) {
          app.warn(`battle.assist: ${err.message}`)
        }
      }
      setMarks()
      if (from !== 'url') app.pushUrl()
      openBriefing({ focus: momentId })
    } finally {
      L.busy = false
    }
  }

  /** fromUrl: the browser's Back took the hash off the box; the entry it landed on is rewritten, not added to. */
  async function leave({ fromUrl = false } = {}) {
    if (L.busy || !battle.scene) return
    L.busy = true
    try {
      ui.card.close()
      list.close()
      const evId = battle.loaded?.battle.event ?? null
      await battle.leave()
      if (L.wg) endWargameState()
      app.url.battle = null
      app.url.t = null
      app.url.moment = null
      app.url.unit = null
      app.url.station = null
      L.stop = -1
      L.held = null
      L.cache = null
      // back on the table: the battle's own card again, the camera out to its view
      const ev = evId ? app.data.events.find((e) => e.id === evId) : null
      if (ev) ui.tour.open(ev)
      if (fromUrl) app.replaceUrl()
      else app.pushUrl()
    } finally {
      L.busy = false
    }
  }
  app.enterBox = enter
  app.leaveBox = leave

  function stopIndexAt(t) {
    const stops = battle.sim?.record.stops || []
    let k = -1
    stops.forEach((s, i) => {
      if (s.t <= t + 1e-6) k = i
    })
    return k
  }

  /** The tour inside a box: its stops, each scrubbing the battle to its t, its card beside it. */
  function step(d) {
    const sim = battle.sim
    if (!sim || battle.input) return
    const stops = sim.record.stops
    if (!stops.length) return
    // (after a sortie the walk goes on from where the battle is)
    const at = L.stop < 0 ? stopIndexAt(sim.t) : L.stop
    const i = Math.max(0, Math.min(stops.length - 1, at + d))
    goStop(i)
  }

  function goStop(i) {
    const sim = battle.sim
    if (!sim || battle.input) return
    const s = sim.record.stops[i]
    if (!s) return
    // (a changed battle asks first, the HUD's question; its Y comes back as the 'rebuilt' event with the stop)
    if (battle.scrub(s.t, { stop: i }) !== true) return
    L.stop = i
    battle.lookAtStop(s)
    ui.card.openStop(stopCard(i))
  }
  app.goStop = goStop

  function stopCard(i) {
    const sim = battle.sim
    const B = battle.loaded.battle
    const stops = sim.record.stops
    const s = stops[i]
    // a stop that is also a moment (a moment that starts within a few minutes of it) offers it
    const moments = [...sim.record.moments.values()].filter((m) => Math.abs(m.t - s.t) <= 300).map((m) => momentRow(m))
    return { title: B.title, ja: B.ja, when: `${sim.clock.dateLabel(s.t)}, ${sim.clock.label(s.t, { seconds: s.t % 60 !== 0 })}`, clock: B.clock?.name, text: s.text, sources: s.sources || [], index: i, count: stops.length, moments }
  }

  /** The strip's marks: the clock's span, the stops, the bookmarks (the record's turning points). */
  function setMarks() {
    const sim = battle.sim
    if (!sim) return
    const label = (t) => sim.clock.label(t, { seconds: t % 60 !== 0 })
    const bms = Array.isArray(battle.bookmarks) ? battle.bookmarks : [...sim.record.moments.values()]
    bar.setMarks({
      duration: sim.clock.duration,
      stops: sim.record.stops.map((s) => ({ t: s.t, label: label(s.t) })),
      bookmarks: bms.map((b) => {
        const t = typeof b.t === 'number' ? b.t : sim.clock.parse(b.t)
        const row = sim.record.moments.get(b.id) ? momentRow(sim.record.moments.get(b.id)) : null
        return { id: b.id, t, title: b.title, label: label(t), side: row?.side ?? null }
      }),
    })
  }

  // --- the units: the list, the card, the selection ----------------------------------------
  /** A row afloat or in the air (the engine's alive: 0 gone, 1 afloat or flying, 2 going down; a mock's boolean). */
  const isAlive = (u) => u.alive === true || u.alive === 1 || u.alive === 2
  /** sim.units() (ROUND-2 §3), read at most four times a second; [] where the sim has none yet. */
  function units() {
    const sim = (L.wg ? arenaOf() : null) ?? battle.sim
    if (!sim || typeof sim.units !== 'function') return []
    const now = performance.now()
    const c = L.cache
    const held = sim.player?.unitIndex ?? -1
    if (c && c.sim === sim && now - c.at < 250 && Math.abs(c.t - sim.t) < 30 && c.held === held) return c.rows
    let rows = []
    try {
      rows = sim.units() || []
    } catch (err) {
      app.warn(`sim.units(): ${err.message}`)
    }
    L.cache = { sim, at: now, t: sim.t, rows, held }
    return rows
  }
  L.units = units

  const unitAt = (index) => (index == null ? null : units().find((u) => u.index === index) || null)
  const selectedIndex = () => {
    const s = battle.state?.selected
    return s === undefined ? L.selected : s
  }

  function heldUnit() {
    // (in a wargame the arena's player)
    const sim = (L.wg ? arenaOf() : null) ?? battle.sim
    const p = sim?.player
    if (!p || p.unitIndex == null) return null
    return unitAt(p.unitIndex) || (p.kind ? { index: p.unitIndex, kind: p.kind, name: Array.isArray(sim.units) ? sim.units[p.unitIndex]?.name ?? '' : '', stations: [] } : null)
  }
  const heldStation = () => (L.wg ? arenaOf()?.player?.station : null) ?? battle.state?.station ?? battle.sim?.player?.station ?? null

  function kitFor(u) {
    const k = battle.loaded?.kits
    if (!k || !u) return null
    if (!L.kits || L.kits.k !== k) L.kits = { k, ship: new Map((k.ships || []).map((x) => [x.id, x])), air: new Map((k.aircraft || []).map((x) => [x.id, x])) }
    return u.kind === 'ship' ? L.kits.ship.get(u.kit) : L.kits.air.get(u.kit) ?? L.kits.ship.get(u.kit)
  }

  function recordMaps() {
    const B = battle.loaded?.battle
    if (!B) return { units: new Map(), groups: new Map() }
    if (!L.maps || L.maps.B !== B) L.maps = { B, units: new Map((B.units || []).map((u) => [u.id, u])), groups: new Map((B.groups || []).map((g) => [g.id, g])) }
    return L.maps
  }

  /** The aircraft's index in its group: the units() row's k (today's sim), or the "#n" of its id. */
  const memberOf = (u) => (u.k != null && u.k >= 0 ? u.k : /#(\d+)$/.test(u.id || '') ? Number(/#(\d+)$/.exec(u.id)[1]) - 1 : null)

  /** What Battle.take is handed for a unit (ROUND-2 §3): never the leader's index; a spare by its group. */
  function roleOf(u) {
    if (u.kind === 'ship') return { unit: u.id }
    const k = memberOf(u)
    return u.spare || k == null || k < 1 ? { group: u.group } : { group: u.group, index: k }
  }

  function sideNames(code) {
    const B = battle.loaded?.battle
    const entry = Object.entries(B?.sides || {}).find(([key, sd]) => sd.side === code || key === code)?.[1]
    return { name: sideName(code), ja: entry?.ja ?? null }
  }

  /** A height in the side's own units, as the HUD and the row's now have them: feet for the US, metres for Japan. */
  const heightWords = (side, m) => (side === 'jp' ? `${(Math.round(m / 50) * 50).toLocaleString('en')} m` : `${(Math.round((m * 3.28084) / 100) * 100).toLocaleString('en')} ft`)

  function stateWords(u) {
    if (Array.isArray(u.state)) return u.state
    if (typeof u.state === 'string') return [u.state]
    const o = u.state
    if (o && typeof o === 'object') {
      // the engine's row state (takeover.js): a ship afloat, listing, on fire, sinking or sunk; an aircraft airborne with its height and fuel, or on the ground
      if (u.kind === 'ship') {
        if (o.sunk) return ['sunk']
        if (o.sinking) return ['sinking']
        const w = [o.aground ? 'aground' : 'afloat']
        if (o.onFire) w.push('on fire')
        if (o.listing) w.push(`listing ${Math.round(o.listDeg ?? 0)}°`)
        return w
      }
      if (o.parked) return ['on the ground']
      if (!o.airborne) return []
      const w = ['airborne', heightWords(u.side, o.altM ?? 0)]
      // (fuel where the sim flies the aircraft itself; the record's own aircraft carry no tanks to read)
      if (o.fuelS != null) w.push(`fuel for ${Math.max(0, Math.round(o.fuelS / 60))} min`)
      return w
    }
    const st = battle.sim?.state
    const i = u.index
    if (!st?.alive || i == null) return []
    if (!st.alive[i]) return []
    if (u.kind === 'ship') {
      const w = ['afloat']
      if (st.damage?.[i] > 0.05) w.push('damaged')
      if (st.fire?.[i] > 0.05) w.push('on fire')
      if (Math.abs(st.list?.[i] ?? 0) > 3) w.push('listing')
      return w
    }
    const y = st.pos?.[3 * i + 1]
    return y > 20 ? ['airborne', `${Math.round(y / 10) * 10} m`] : []
  }

  /**
   * The unit card's data. spareOf: a group whose every aircraft is greyed but which takes as a group, flying a
   * spare (sim.groupTakeable: Welch's and Taylor's P-40s): the card offers that spare, not the greyed aircraft.
   */
  function unitCard(u, { spareOf = null } = {}) {
    const sim = battle.sim
    const { units: rawUnits, groups } = recordMaps()
    const kit = kitFor(u)
    const raw = u.kind === 'ship' ? rawUnits.get(u.id) : null
    const g = groups.get(u.group)
    const k = memberOf(u)
    const held = (sim.player?.unitIndex ?? -1) === u.index
    const spare = !held && spareOf && groupTakeable(spareOf) === true
    const member = u.kind === 'aircraft' && g ? (u.spare || spare ? 'a spare aircraft of the group' : k === 0 ? (g.count > 1 ? 'the leader’s aircraft' : 'the group’s one aircraft') : k != null ? `aircraft ${k + 1} of ${g.count}` : null) : null
    return {
      key: u.id ?? `i${u.index}`,
      index: u.index,
      kind: u.kind,
      name: u.kind === 'aircraft' && g ? g.name || u.name : u.name,
      ja: u.ja ?? raw?.ja ?? g?.ja ?? (u.kind === 'aircraft' ? kit?.ja : null) ?? null,
      hull: u.hull ?? raw?.hull ?? null,
      kitLine: kitLine(kit, u.kind === 'ship' ? 'ship' : 'aircraft', raw),
      member,
      sideName: sideNames(u.side).name,
      now: u.now || '',
      next: u.next || '',
      state: stateWords(u),
      clock: sim.clock.label(sim.t),
      stations: (u.stations || []).map((s) => ({ name: s, label: stationLabel(s), where: STATION[s]?.where ?? '' })),
      takeable: held || spare ? true : u.takeable,
      held,
      station: held ? heldStation() : null,
      role: spare ? { group: spareOf } : roleOf(u),
    }
  }

  /** sim.groupTakeable (true, or the reason a group cannot be taken as a group), or null where the sim has none. */
  function groupTakeable(id) {
    const f = battle.sim?.groupTakeable
    if (typeof f !== 'function' || id == null) return null
    try {
      return f(id)
    } catch (err) {
      return err.message
    }
  }

  function openUnitCard(index, { refresh = false, focus = null, spareOf } = {}) {
    const u = unitAt(index)
    if (!u) {
      if (refresh) return
      return app.warn?.(`unit card: no unit at ${index}`)
    }
    if (spareOf !== undefined || L.cardIndex !== index) L.cardSpare = spareOf ?? null
    L.cardIndex = index
    ui.card.openUnit(unitCard(u, { spareOf: L.cardSpare }), { focus })
  }
  L.openUnitCard = openUnitCard

  function select(index, { open = true, focus = null, spareOf = null } = {}) {
    if (L.wg) return selectInWargame(index)
    if (!battle.sim) return
    L.selected = index
    L.seenSelected = index
    if (typeof battle.select === 'function') battle.select(index)
    L.cache = null
    if (narrow() && list.isOpen && open) list.close()
    if (open && index != null) openUnitCard(index, { focus, spareOf })
    if (list.isOpen) list.set(listData())
  }

  /** The list's rows: by side, ships then air groups in the record's order (parked aircraft gathered, one row a field's kind). */
  function listData() {
    const sim = (L.wg ? arenaOf() : null) ?? battle.sim
    const B = battle.loaded.battle
    const { units: rawUnits, groups } = recordMaps()
    const sides = new Map()
    const side = (code) => {
      if (!sides.has(code)) sides.set(code, { code, ...sideNames(code), ships: [], groups: [], byKey: new Map() })
      return sides.get(code)
    }
    for (const u of units()) {
      const s = side(u.side)
      const kit = kitFor(u)
      if (u.kind === 'ship') {
        const raw = rawUnits.get(u.id)
        s.ships.push({ key: `u:${u.id}`, index: u.index, kind: 'ship', name: u.name, ja: u.ja ?? raw?.ja ?? null, hull: u.hull ?? raw?.hull ?? null, sub: shipType(kit, raw), now: u.now, takeable: u.takeable, alive: isAlive(u) })
        continue
      }
      const air = groups.has(u.group)
      const key = `${air ? 'g' : 'p'}:${u.group ?? u.id}`
      let r = s.byKey.get(key)
      if (!r) {
        const g = groups.get(u.group)
        r = { key, index: null, kind: 'aircraft', name: air ? g.name || u.name : u.groupName || u.name, ja: air ? g.ja ?? null : null, sub: kitShort(kit, u.kit), now: '', takeable: null, alive: false, count: 0, members: [], parked: !air && !L.wg, first: null, pick: null }
        s.byKey.set(key, r)
        s.groups.push(r)
      }
      r.members.push(u.index)
      if (!u.spare) r.count++
      if (isAlive(u)) r.alive = true
      r.first ??= u
      if (u.takeable === true && !r.pick) r.pick = u
      // (the reason a group shows: a wingman's, not the leader's, which never changes)
      if (u.takeable !== true && memberOf(u) === 1) r.wing = u
    }
    const out = [...sides.values()].sort((a, b) => (SIDE_ORDER[a.code] ?? 2) - (SIDE_ORDER[b.code] ?? 2))
    for (const s of out) {
      for (const r of s.groups) {
        const u = r.pick || r.wing || r.first
        r.index = u.index
        r.takeable = r.pick ? true : u.takeable
        // (an air group takes as a group: where every aircraft is greyed but the group flies a spare, the row says so)
        const gt = r.parked ? null : groupTakeable(r.key.slice(2))
        if (gt != null && !r.pick) {
          r.takeable = gt
          if (gt === true) r.spareOf = r.key.slice(2)
        }
        r.now = u.now
        delete r.first
        delete r.pick
        delete r.wing
      }
      delete s.byKey
    }
    // (in a wargame its title and its clock, the game's)
    const title = L.wg ? L.wg.scenario?.title ?? B.title?.split(',')[0] ?? '' : B.title?.split(',')[0] ?? ''
    const clock = L.wg || !sim.clock?.label ? clockText(sim.t ?? 0) : sim.clock.label(sim.t)
    return { title, clock, sides: out, selected: { index: L.wg ? arenaOf()?.player?.unitIndex ?? null : selectedIndex() } }
  }

  function toggleList() {
    if (!battle.sim && !arenaOf()) return
    if (list.isOpen) return list.close()
    list.set(listData())
    // (on a phone the list takes the screen the card would)
    if (narrow() && ui.card.isOpen) ui.card.close()
    list.open()
  }

  /** The speeds the bar offers (Battle.speeds where it has them; ROUND-2 §3's lists otherwise). */
  function speeds(heldU) {
    if (Array.isArray(battle.speeds)) return battle.speeds
    const ms = battle.sim?.momentState
    if (battle.input && ms && !ms.done && typeof battle.maxScale === 'function') return [ms.timeScale, ms.timeScale * 2, 4, 8, 16, 32].filter((v, i, a) => v >= ms.timeScale && v <= battle.maxScale() && a.indexOf(v) === i)
    if (heldU?.kind === 'aircraft') return assist() === 'assisted' ? [0.5, 1, 2] : [1]
    if (heldU) return SHIP_SCALES
    return WATCH_SCALES
  }

  // --- the setting ---------------------------------------------------------------------
  const assist = () => (ASSIST.includes(battle.assist) ? battle.assist : ASSIST.includes(app.assist) ? app.assist : 'assisted')

  function setAssist(v) {
    if (!ASSIST.includes(v)) return
    if (typeof app.setAssist === 'function') app.setAssist(v)
    else {
      try {
        battle.assist = v
      } catch (err) {
        app.warn(`battle.assist: ${err.message}`)
      }
    }
    // (the briefing shows the setting too: drawn again with the new one marked)
    if (ui.card.isOpen && ui.card.mode === 'briefing') openBriefing({ focus: null, keepScroll: true })
  }

  // --- taking, switching, giving back -----------------------------------------------------
  /** A role (ROUND-2 §3) taken at the current time (or role.t), from a click. */
  function takeUnit(role) {
    if (!battle.sim || !role) return null
    if (typeof battle.take !== 'function') {
      app.warn('Battle.take() is not in this build (ROUND-2 §4): link.js calls it, the integrator wires it')
      return null
    }
    let r
    try {
      r = battle.take(role)
    } catch (err) {
      app.warn(`take ${JSON.stringify(role)}: ${err.message}`)
      L.cache = null
      if (ui.card.mode === 'unit' && L.cardIndex != null) openUnitCard(L.cardIndex)
      return null
    }
    // (the held view is the unit's: the card and the list step aside, the bar's Units brings the list back)
    ui.card.close()
    list.close()
    const session = ++L.session
    L.held = { session, momentId: role.momentId ?? null, role }
    L.offered = null
    L.stop = -1
    L.cache = null
    sawSelection()
    app.url.moment = null
    if (r && typeof r.then === 'function') r.then((res) => after(res, session))
    return r
  }

  /** The selection Battle made itself (the held unit's bracket) is seen, so the card does not open over the held view. */
  function sawSelection() {
    const s = battle.state?.selected
    if (s !== undefined) {
      L.selected = s
      L.seenSelected = s
    }
  }
  app.takeUnit = takeUnit

  function setStation(name) {
    const u = heldUnit()
    if (!u || !(u.stations || []).includes(name)) return
    if (typeof battle.setStation === 'function') {
      try {
        battle.setStation(name)
      } catch (err) {
        return app.warn(`setStation ${name}: ${err.message}`)
      }
    }
    L.cache = null
    if (!L.held?.momentId && !L.wg) app.url.station = name
    if (ui.card.mode === 'unit' && L.cardIndex === u.index) openUnitCard(u.index)
  }

  /** Release on the bar or the card (and Esc without pointer lock): the unit back, the sortie's card. */
  function release() {
    if (!battle.sim?.player && !battle.input) return
    const session = L.held?.session ?? 0
    const r = battle.release()
    if (r && typeof r.then !== 'function' && (r.sortie || r.score)) after(r, session)
  }

  /** The URL follows the held unit (#unit, #station: ROUND-2 §5; a bookmark keeps #moment). */
  function trackHeld(u) {
    const i = u?.index ?? -1
    if (i !== L.heldIndex) {
      // a take the engine started itself (a key in the box) is a session too, so its card opens once
      if (i >= 0 && !L.held) L.held = { session: ++L.session, momentId: battle.momentId ?? null }
      L.heldIndex = i
      L.cache = null
    }
    const st = u ? heldStation() : null
    if (u && !L.held?.momentId) {
      app.url.unit = (u.spare ? u.group : u.id) ?? null
      app.url.station = st
    } else if (!u && (app.url.unit || app.url.station)) {
      app.url.unit = null
      app.url.station = null
    }
    L.heldStation = st
  }

  // --- the briefing -------------------------------------------------------------------------
  function momentRow(m, focus = null) {
    const sim = battle.sim
    const B = battle.loaded.battle
    const role = m.role || {}
    // (a role names its side by the battle's key, japan or usa, or by the code, jp or us)
    const sideKey = Object.keys(B.sides || {}).find((k) => k === role.side || B.sides[k]?.side === role.side) ?? role.side ?? null
    const side = B.sides?.[sideKey]?.side ?? sideKey
    const unit = role.unit ? sim.record.shipById.get(role.unit) : null
    return {
      id: m.id,
      title: m.title,
      ja: m.ja?.kanji ?? (typeof m.ja === 'string' ? m.ja : null),
      role: role.name || unit?.name || null,
      t: sim.clock.label(m.t, { seconds: m.t % 60 !== 0 }),
      objective: m.objective?.text ?? null,
      focus: focus === m.id,
      side: side === 'japan' ? 'jp' : side === 'usa' ? 'us' : side,
      sideName: B.sides?.[sideKey]?.name ?? sideName(side),
    }
  }

  /** Start here (ROUND-2 §1.2): the box's first door as the briefing shows it. */
  function doorRow() {
    const fd = battle.firstDoor
    if (!fd?.role) return null
    const sim = battle.sim
    const { units: rawUnits, groups } = recordMaps()
    const st = fd.role.station ? stationLabel(fd.role.station) : null
    let who = null
    if (fd.role.unit) {
      const u = rawUnits.get(fd.role.unit)
      who = u ? `${u.name}${u.hull ? ` (${u.hull})` : ''}` : fd.role.unit
    } else if (fd.role.group) {
      const g = groups.get(fd.role.group)
      who = g ? aircraftRole(kitShort(kitFor({ kind: 'aircraft', kit: g.kit }), g.kit), g.name || g.id) : fd.role.group
    }
    let t = null
    try {
      t = fd.t != null ? sim.clock.label(typeof fd.t === 'number' ? fd.t : sim.clock.parse(fd.t)) : null
    } catch (err) {
      app.warn(`firstDoor.t: ${err.message}`)
    }
    return { title: fd.title || who || '', text: fd.text || '', role: [who, st].filter(Boolean).join(' · '), t }
  }

  function openBriefing({ focus = L.offered, keepScroll = false } = {}) {
    const sim = battle.sim
    if (!sim) return
    const B = battle.loaded.battle
    const box = battle.loaded.box
    const t = sim.t
    const stop = battle.stopAt(t)
    const ev = app.data.events.find((e) => e.id === B.event)
    const forces = Object.entries(B.sides || {})
      .map(([key, sd]) => {
        const code = sd.side ?? key
        const ships = (B.units || []).filter((u) => (u.side === key || u.side === code) && !u.station?.parked && !(u.lonlat && !u.track))
        const names = ships.map((u) => (u.ja ? `${u.name} ${u.ja}` : u.name))
        const shown = names.length > 16 ? [...names.slice(0, 14), `and ${names.length - 14} more ships`] : names
        return { side: code, order: SIDE_ORDER[code] ?? 2, name: sd.name || sideName(code), ja: sd.ja || null, units: shown }
      })
      .sort((a, b) => a.order - b.order)
    const moments = [...sim.record.moments.values()].sort((a, b) => (SIDE_ORDER[momentRow(a).side] ?? 2) - (SIDE_ORDER[momentRow(b).side] ?? 2) || a.t - b.t).map((m) => momentRow(m, focus))
    const scroll = keepScroll ? ui.card.el.scrollTop : 0
    ui.openBriefing({
      title: B.title,
      ja: B.ja,
      when: `${sim.clock.dateLabel(t)}, ${sim.clock.label(t)}`,
      clock: B.clock?.name,
      clockNote: B.clock?.note,
      situation: stop?.text || ev?.summary || '',
      forces,
      moments,
      sources: B.sources || [],
      credit: box.credit || null,
      // round two: Start here, and the setting (only where the Battle has them)
      door: doorRow(),
      assist: 'assist' in battle || app.assist ? assist() : null,
      // round three: the wargame's door, where the box has one
      wargame: (() => {
        const id = wargameFor(box.id)
        return id ? { id, label: L.scenarios.get(id)?.label ?? WG_LABEL } : null
      })(),
    })
    if (keepScroll) ui.card.el.scrollTop = scroll
  }
  L.openBriefing = openBriefing

  // --- a moment (a bookmark), and its card ----------------------------------------------------
  /** From a click (briefing, a stop's card, the strip): the controls are taken inside it, so pointer lock may be asked. */
  function take(momentId) {
    if (!battle.sim || !battle.sim.record.moments.has(momentId)) return
    // (a unit already held is given back first, so its after-card is its own and the bookmark's session is new)
    if (battle.input || battle.sim.player) battle.release()
    ui.card.close()
    list.close()
    app.url.moment = momentId
    app.url.unit = null
    app.url.station = null
    const session = ++L.session
    L.held = { session, momentId }
    const p = battle.takeMoment(momentId)
    L.stop = -1
    L.cache = null
    sawSelection()
    p.then((r) => after(r, session))
    return p
  }
  app.take = take

  /** The sortie's end, once per held session, whichever way it came. */
  function after(result, session = 0) {
    if (session && L.shown === session) return
    if (session) L.shown = session
    if (!session && L.held) L.shown = L.held.session
    L.held = null
    if (app.url.unit || app.url.station) {
      app.url.unit = null
      app.url.station = null
    }
    if (!result || !battle.sim) return
    L.cache = null
    const s = result.sortie ?? null
    ui.openAfter(s ? sortieCard(result, s) : afterCard(result))
  }
  L.after = after

  /** ROUND-2 §1.1: the after-card from sim.sortie, over the span the controls were held. */
  function sortieCard(r, s) {
    const sim = battle.sim
    const B = battle.loaded.battle
    const label = (t) => sim.clock.label(t)
    const m = r.momentId ? sim.record.moments.get(r.momentId) : null
    const u = typeof s.unit === 'object' && s.unit ? s.unit : unitAt(typeof s.unit === 'number' ? s.unit : null) || units().find((x) => x.id === s.unit) || {}
    const kind = u.kind ?? (m?.role?.kind === 'ship' ? 'ship' : 'aircraft')
    const { groups } = recordMaps()
    const g = groups.get(u.group)
    const kit = kitFor({ kind, kit: u.kit })
    const stations = (s.stations || [s.station]).filter(Boolean)
    const [t0, t1raw] = s.span || [sim.t, sim.t]
    const t1 = t1raw ?? sim.t
    // (to the second when the controls were held under two minutes, so the span never reads 08:40–08:40)
    const secs = t1 - t0 < 120
    const span = `${sim.clock.label(t0, { seconds: secs })}–${sim.clock.label(t1, { seconds: secs })}`
    const phrase = rolePhrase({ kind, name: u.name, kitShortName: kitShort(kit, u.kit), groupName: g?.name || u.name, label: u.label ?? null }, stations)
    // Your sortie: the unit in its own terms
    const sortie = []
    const dur = Math.max(0, t1 - t0)
    sortie.push({ label: 'At the controls', value: `${span} (${Math.floor(dur / 60)} min ${String(Math.round(dur % 60)).padStart(2, '0')} s)` })
    if (stations.length) sortie.push({ label: stations.length > 1 ? 'Stations' : 'Station', value: stations.map(stationLabel).join(', ') })
    const hits = (s.hits || []).filter((x) => x.kind !== 'near-miss' && x.kind !== 'aircraft')
    const downed = (s.hits || []).filter((x) => x.kind === 'aircraft')
    const near = (s.hits || []).filter((x) => x.kind === 'near-miss').reduce((a, x) => a + (x.count || 1), 0)
    const kindWord = (k) => String(k || '').replace(/-hit$/, '').replace('-', ' ')
    const whereOf = (x) => [...new Set([].concat(x.where ?? []).map((w) => String(w).trim()).filter(Boolean))].join(', ')
    sortie.push({ label: 'Hits', value: hits.length ? hits.map((x) => `${x.name}: ${x.count ?? 1} ${kindWord(x.kind)} hit${(x.count ?? 1) > 1 ? 's' : ''}${whereOf(x) ? `, ${whereOf(x)}` : ''}`).join('; ') : 'none' })
    if (near) sortie.push({ label: 'Near misses', value: String(near) })
    if (downed.length) sortie.push({ label: 'Aircraft downed', value: downed.map((x) => `${x.count ?? 1} (${x.name})`).join('; ') })
    // what left the unit: the engine's counts ({ bombs, torpedoes, salvos, shells, rounds, aaBursts, releaseM }), or a list of releases
    const released = []
    const fired = []
    const R = s.releases
    const plural = (n, one, many) => `${n.toLocaleString('en')} ${n === 1 ? one : many}`
    if (Array.isArray(R)) {
      const rel = new Map()
      for (const x of R) {
        const k = x.kind || 'release'
        const e = rel.get(k) || { n: 0, h: [] }
        e.n += x.count ?? 1
        if (x.heightM != null) e.h.push(Math.round(x.heightM))
        rel.set(k, e)
      }
      const NOUN = { bomb: ['bomb', 'bombs'], torpedo: ['torpedo', 'torpedoes'], salvo: ['salvo', 'salvos'], aa: ['AA round', 'AA rounds'], guns: ['burst', 'bursts'], release: ['release', 'releases'] }
      for (const [k, e] of rel) released.push(`${e.n} ${(NOUN[k] || [k, `${k}s`])[e.n === 1 ? 0 : 1]}${e.h.length ? ` at ${e.h.join(', ')} m` : ''}`)
    } else if (R) {
      const at = R.releaseM != null ? ` at ${Math.round(R.releaseM)} m` : ''
      if (R.bombs) released.push(`${plural(R.bombs, 'bomb', 'bombs')}${at}`)
      if (R.torpedoes) released.push(`${plural(R.torpedoes, 'torpedo', 'torpedoes')}${R.bombs ? '' : at}`)
      if (R.salvos) fired.push(`${plural(R.salvos, 'salvo', 'salvos')}${R.shells ? ` (${plural(R.shells, 'shell', 'shells')})` : ''}`)
      if (R.rounds >= 1) fired.push(plural(Math.round(R.rounds), 'round', 'rounds'))
      // (the AA director's tracer streams, one each 0.12 s of fire: said as the time the guns were fired)
      if (R.aaBursts) fired.push(`the anti-aircraft guns for ${plural(Math.max(1, Math.round(R.aaBursts * 0.12)), 'second', 'seconds')}`)
    }
    if (released.length) sortie.push({ label: 'Released', value: released.join('; ') })
    if (fired.length) sortie.push({ label: 'Fired', value: fired.join('; ') })
    const dmg = damageWords(s.damageTaken, kind)
    if (dmg) sortie.push({ label: 'Damage taken', value: dmg })
    const how = s.how ?? r.reason
    const fate =
      kind === 'ship'
        ? s.survived === false
          ? 'lost'
          : { clock: 'afloat when the battle clock ran out', released: 'afloat, the controls given back', left: 'afloat', card: 'afloat' }[how] ?? 'afloat'
        : s.survived === false
          ? 'did not return'
          : { landed: 'landed', ditched: 'ditched', clock: 'still flying when the battle clock ran out', released: 'still flying, the controls given back', left: 'still flying', card: 'still flying' }[how] ?? 'still flying'
    sortie.push({ label: kind === 'ship' ? 'The ship' : 'The aircraft', value: fate })
    // Your battle: what left the record while the controls were held, in the sim's words only
    // (the sortie's own span only: the whole battle's divergences from the record are the first round's card, never repeated here)
    const rows = (s.divergedDuring || []).map((d) => ({ what: d.name || d.id || d.unit || d.group, yours: d.reason || d.sim || d.text || 'left the record' }))
    const o = r.outcome
    const guesses = (o?.guess || []).map((x) => (typeof x === 'string' ? x : `${label(x.t)}: ${x.text}`))
    // The record: a bookmark's written text, then the unit's own record over the span
    const rec = recordLines(u, kind, t0, t1)
    const record = { text: m?.after?.text || '', lines: rec.lines, tellings: m ? [...(m.after?.tellings || []), ...(B.tellings || [])] : [], sources: [...(m?.after?.sources || []), ...rec.sources] }
    return {
      momentId: r.momentId ?? null,
      title: m ? m.title : `${phrase}, ${span}`,
      gloss: m ? `${phrase}, ${span}` : null,
      ja: m ? m.ja?.kanji ?? (typeof m.ja === 'string' ? m.ja : null) : null,
      sortie,
      battle: { rows, guesses },
      record,
      next: whatCameNext(sim, B),
      retry: m ? { start: true, checkpoint: true } : null,
    }
  }

  /** The unit's own record between t0 and t1, a line each in the stops' voice (its events, and what it did to others). */
  function recordLines(u, kind, t0, t1) {
    const sim = battle.sim
    const B = battle.loaded.battle
    const { units: rawUnits, groups } = recordMaps()
    const parse = (s) => {
      try {
        return sim.clock.parse(s)
      } catch {
        return null
      }
    }
    const inSpan = (t) => t != null && t >= t0 - 1 && t <= t1 + 1
    const cause = (by) => {
      const g = groups.get(by)
      if (g) return { kind: 'group', name: g.name, profile: g.attack?.profile ?? null }
      const x = rawUnits.get(by)
      return x ? { kind: 'unit', name: x.name } : null
    }
    const lines = []
    const sources = []
    const add = (t, text, srcs) => {
      if (!text) return
      lines.push({ tt: t, t: sim.clock.label(t), text: asSentence(text) })
      for (const x of srcs || []) if (!sources.some((y) => (y.id ?? y) === (x.id ?? x))) sources.push(x)
    }
    if (kind === 'ship') {
      const raw = rawUnits.get(u.id)
      for (const e of raw?.events || []) {
        const t = parse(e.t)
        if (inSpan(t)) add(t, eventLine(e, raw.name, cause(e.by)), e.sources)
      }
      for (const o of B.units || []) {
        if (o.id === u.id) continue
        for (const e of o.events || []) {
          const t = parse(e.t)
          if (e.by === u.id && inSpan(t)) add(t, eventLine(e, o.name, { kind: 'unit', name: raw?.name }), e.sources)
        }
      }
    } else {
      const g = groups.get(u.group)
      if (g) {
        const name = asSentence(g.name || g.id).replace(/\.$/, '')
        const at = (x) => (x == null ? null : parse(x))
        const from = g.from ? rawUnits.get(g.from)?.name ?? null : null
        const launch = at(g.launch)
        if (inSpan(launch)) add(launch, `${name} launches${from ? ` from ${from}` : ''}`)
        const enter = at(g.enter?.t)
        if (inSpan(enter) && enter !== launch) add(enter, `${name} comes in over the edge of the box`)
        const a = g.attack
        const ta = at(a?.t)
        if (a && inSpan(ta)) {
          const tid = Array.isArray(a.target) ? a.target[0] : a.target
          const target = rawUnits.get(tid)?.name ?? (groups.get(tid) ? midName(groups.get(tid).name) : (B.sites || []).find((x) => x.id === tid)?.name ?? null)
          add(ta, `${name} ${attackLine(a.profile, target)}`, a.sources)
          // (the record's losses as a range, said only where it has some: aircraft "did not return", R8 §3.6)
          const lost = (g.losses || [])[0]
          const most = Math.max(0, ...[].concat(lost ?? []).map(Number).filter(Number.isFinite))
          if (most > 0) add(ta, `${countWords(lost)} of its aircraft did not return`)
        }
        const rec = at(g.recover?.t)
        if (inSpan(rec)) add(rec, `${name} lands${g.recover?.to ? ` on ${rawUnits.get(g.recover.to)?.name ?? g.recover.to}` : ''}`)
        for (const o of B.units || []) {
          for (const e of o.events || []) {
            const t = parse(e.t)
            if (e.by === g.id && inSpan(t)) add(t, eventLine(e, o.name, cause(g.id)), e.sources)
          }
        }
      }
    }
    lines.sort((a, b) => a.tt - b.tt)
    return { lines: lines.slice(0, 14).map(({ t, text }) => ({ t, text })), sources: sources.slice(0, 6) }
  }

  /** The first round's after-card, from a moment's score and outcome (a Battle without sim.sortie). */
  function afterCard(r) {
    const sim = battle.sim
    const B = battle.loaded.battle
    const m = sim.record.moments.get(r.momentId) || {}
    const sc = r.score || {}
    const o = r.outcome || { diverged: [], guess: [] }
    const L2 = (t) => sim.clock.label(t)
    // Your sortie: the player's unit in its own terms
    const sortie = []
    const hits = (sc.hits || []).filter((x) => x.kind !== 'near-miss')
    const near = (sc.hits || []).filter((x) => x.kind === 'near-miss').reduce((s, x) => s + x.count, 0)
    const kindWord = (k) => String(k).replace(/-hit$/, '').replace('-', ' ')
    const whereOf = (x) => [...new Set([].concat(x.where ?? []).map((w) => String(w).trim()).filter(Boolean))].join(', ')
    sortie.push({ label: 'Hits', value: hits.length ? hits.map((x) => `${x.name}: ${x.count} ${kindWord(x.kind)} hit${x.count > 1 ? 's' : ''}${whereOf(x) ? `, ${whereOf(x)}` : ''}`).join('; ') : 'none' })
    if (near) sortie.push({ label: 'Near misses', value: String(near) })
    if (sc.bombs) sortie.push({ label: 'Bombs dropped', value: String(sc.bombs) })
    if (sc.releaseM != null) sortie.push({ label: 'Release height', value: `${Math.round(sc.releaseM)} m` })
    if (sc.torpedoes) sortie.push({ label: 'Torpedoes', value: `${sc.torpedoes} fired, ${sc.torpedoesHit || 0} hit` })
    if (sc.salvos) sortie.push({ label: 'Salvos', value: `${sc.salvos} (${sc.shells || 0} shells, ${sc.straddles || 0} straddling)` })
    if (sc.downed) sortie.push({ label: 'Aircraft downed', value: String(sc.downed) })
    const unitsArr = Array.isArray(sim.units) ? sim.units : null
    const ship = (unitsArr?.[sim.player?.unitIndex]?.kind ?? (m.role?.kind === 'ship' ? 'ship' : 'aircraft')) === 'ship' || m.role?.kind === 'ship'
    const how = ship
      ? { lost: 'lost', clock: 'afloat when the battle clock ran out', released: 'afloat, the controls given back', left: 'afloat', card: 'afloat' }[sc.how ?? r.reason]
      : { landed: 'landed', ditched: 'ditched', lost: 'did not return', clock: 'still flying when the battle clock ran out', released: 'still flying, the controls given back', left: 'still flying', card: 'still flying' }[sc.how ?? r.reason]
    if (how) sortie.push({ label: ship ? 'The ship' : 'Came back', value: sc.survived === false ? (ship ? 'lost' : 'did not return') : how })
    if (sc.timeS) sortie.push({ label: 'Time', value: `${Math.floor(sc.timeS / 60)} min ${String(Math.round(sc.timeS % 60)).padStart(2, '0')} s` })
    // Your battle: ships and aircraft only, the divergences, from the sim's side only (the record's is The record's)
    const rows = (o.diverged || []).map((d) => ({ what: d.name || d.unit || d.group, yours: d.group ? aircraftLine(d.sim) : d.sim }))
    const guesses = (o.guess || []).map((g) => (typeof g === 'string' ? g : `${L2(g.t)}: ${g.text}`))
    // The record: the moment's own text, its tellings and the battle's (the people, by source, in ranges)
    const record = { text: m.after?.text || '', tellings: [...(m.after?.tellings || []), ...(B.tellings || [])], sources: m.after?.sources || [] }
    // What came next: the record after the clock closes
    const next = whatCameNext(sim, B)
    return {
      momentId: r.momentId,
      title: m.title,
      ja: m.ja?.kanji ?? (typeof m.ja === 'string' ? m.ja : null),
      sortie,
      battle: { rows, guesses },
      record,
      next,
      retry: { start: true, checkpoint: true },
    }
  }

  function aircraftLine(s) {
    return String(s).replace(/^(\d+) lost$/, (_, n) => `${n} aircraft lost`)
  }

  function whatCameNext(sim, B) {
    const end = sim.clock.duration
    const lines = []
    const sources = []
    const zone = B.clock?.name ? `, ${B.clock.name}` : ''
    const at = (t) => (sim.clock.dateLabel(t) === sim.clock.dateLabel(0) ? `at ${sim.clock.label(t)}` : `on ${sim.clock.dateLabel(t)}, at ${sim.clock.label(t)}`)
    const items = []
    // a group the record sends in after the clock (Samar's Shikishima unit): the record's next blow, said once
    for (const g of sim.record.groups) {
      const t = g.attack?.t ?? g.enter?.t ?? g.launch
      if (t == null || t <= end || !g.raw?.tokko) continue
      const names = (g.attack?.targets || []).map((x) => (x.unit >= 0 ? sim.record.ships[x.unit]?.name : null)).filter(Boolean)
      items.push({ t, text: `${at(t).replace(/^at /, 'At ').replace(/^on /, 'On ')}${zone}, aircraft of ${g.name.replace(/^The /, 'the ')}, a tokkō (special attack) unit, dived on ${names.length ? names.join(' and ') : 'the ships'}.`, sources: g.attack?.sources || g.sources })
    }
    // the ships' fates after the clock, in the record's order
    for (const r of sim.record.ships) {
      const f = r.fate
      if (f?.t != null && f.t > end && FATE_VERB[f.kind]) items.push({ t: f.t, text: `${r.name} ${FATE_VERB[f.kind]} ${at(f.t)}${zone}.`, sources: r.raw.fate?.sources })
    }
    items.sort((a, b) => a.t - b.t)
    // (the clock named once, on the first line)
    for (const [k, it] of items.slice(0, 5).entries()) {
      lines.push(k && zone ? it.text.replace(zone, '') : it.text)
      for (const s of it.sources || []) if (!sources.some((x) => (x.id ?? x) === (s.id ?? s))) sources.push(s)
    }
    // and the war's next step on the table
    const evs = app.data.events
    const here = evs.find((e) => e.id === B.event)
    if (here) {
      const t0 = Date.parse(here.when?.to ?? here.when?.from ?? '') || null
      const later = evs.filter((e) => e !== here && e.kind === 'battle' && e.when?.from && (Date.parse(e.when.from) || 0) > (t0 ?? 0)).sort((a, b) => Date.parse(a.when.from) - Date.parse(b.when.from))[0]
      if (later) lines.push(`Next on the table: ${later.title}${later.gloss ? `, ${later.gloss}` : ''}.`)
    }
    return { text: lines.join(' '), sources: sources.slice(0, 6) }
  }

  // --- the Wargame (ROUND-3.md §1, §4–5) ----------------------------------------------------------
  /** The arena while a wargame runs: Battle.arena, or the sim itself where Battle put the arena there (it has the record sim's surface). */
  function arenaOf() {
    if (battle.arena) return battle.arena
    if (battle.wargame?.arena) return battle.wargame.arena
    const s = battle.sim
    return s && typeof s === 'object' && 'objective' in s && 'tally' in s ? s : null
  }
  L.arena = arenaOf

  /** A loader's list of wargames (app.data.wargames: ids, or scenarios with id and box), where it has one. */
  function dataWargames() {
    const w = app.data?.wargames
    if (!w) return null
    return w instanceof Map ? [...w.values()] : Array.isArray(w) ? w : Object.values(w)
  }

  function wargameKnown(id) {
    if (L.scenarios.has(id)) return true
    const list = dataWargames()
    if (list) return list.some((w) => (typeof w === 'string' ? w : w?.id) === id)
    return WARGAMES.includes(id) || id === battle.loaded?.box?.id
  }

  /** The wargame a box offers: the scenario whose box it is (a loaded one, the loader's list, or the frozen ids where the box exists). */
  function wargameFor(boxId) {
    if (!boxId) return null
    for (const [id, sc] of L.scenarios) if ((sc.box ?? id) === boxId) return id
    const list = dataWargames()
    if (list) {
      for (const w of list) {
        const id = typeof w === 'string' ? w : w?.id
        if (id && (typeof w === 'string' ? w : w.box ?? w.id) === boxId) return id
      }
      return null
    }
    return WARGAMES.includes(boxId) && app.data?.boxById?.has(boxId) ? boxId : null
  }
  L.wargameFor = wargameFor
  /** For the tools and a loader: a scenario object handed over (it then needs no fetch). */
  L.addWargame = (sc) => {
    if (sc?.id) L.scenarios.set(sc.id, sc)
  }

  /** The scenario (ROUND-3 §6): already read; the loader's; Battle.loadWargame(id) where the Battle has one; else wargames/<id>.json. */
  async function loadScenario(id) {
    if (L.scenarios.has(id)) return L.scenarios.get(id)
    let sc = (dataWargames() || []).find((w) => w && typeof w === 'object' && w.id === id && w.sides) || null
    if (!sc && typeof battle.loadWargame === 'function') sc = await battle.loadWargame(id)
    if (!sc) {
      const r = await fetch(app.data.abs(`wargames/${id}.json`))
      if (!r.ok) throw new Error(`wargames/${id}.json: HTTP ${r.status}`)
      sc = await r.json()
    }
    if (sc) L.scenarios.set(id, sc)
    return sc
  }

  /** The box's battle file and the kits, for the start sheet's forces (the box's own when it is open; read once otherwise). */
  async function boxFile(boxId) {
    if (battle.loaded?.box?.id === boxId && battle.loaded.battle) return { battle: battle.loaded.battle, kits: battle.loaded.kits || app.data.kits || { ships: [], aircraft: [] } }
    if (L.boxFiles?.id === boxId) return L.boxFiles
    const box = app.data.boxById.get(boxId)
    const get = async (p) => {
      const r = await fetch(app.data.abs(p))
      return r.ok ? r.json() : null
    }
    const [b, ships, aircraft] = await Promise.all([box?.battle ? get(box.battle) : null, app.data.kits?.ships ?? get('kits/ships.json'), app.data.kits?.aircraft ?? get('kits/aircraft.json')])
    L.boxFiles = { id: boxId, battle: b || { units: [], sides: {} }, kits: { ships: ships || [], aircraft: aircraft || [] } }
    return L.boxFiles
  }

  /** A side of the scenario by its code (sides.japan / sides.usa, or sides.jp / sides.us). */
  const scenarioSide = (sc, code) => sc?.sides?.[WG_KEY[code]] ?? sc?.sides?.[code] ?? null
  function wgSideName(code) {
    return scenarioSide(L.wg?.scenario, code)?.name || sideName(code)
  }
  const plural = (word, n) => (n === 1 || /aircraft$/.test(word) ? word : `${word}s`)

  /** The start sheet's data: each side's ships by type (their names, the kanji beside a Japanese one), its aircraft counted by kind, its goal. */
  function sheetData(sc, files, focus) {
    const raw = new Map((files.battle?.units || []).map((u) => [u.id, u]))
    const shipKits = new Map((files.kits?.ships || []).map((k) => [k.id, k]))
    const airKits = new Map((files.kits?.aircraft || []).map((k) => [k.id, k]))
    const sides = ['jp', 'us'].map((code) => {
      const sd = scenarioSide(sc, code) || {}
      const byType = new Map()
      for (const id of sd.ships || []) {
        const u = raw.get(id)
        const type = shipKits.get(u?.kit)?.type || 'ship'
        if (!byType.has(type)) byType.set(type, [])
        byType.get(type).push({ name: u?.name || id, ja: u?.ja || null })
      }
      const order = [...TYPE_ORDER, ...[...byType.keys()].filter((t) => !TYPE_ORDER.includes(t))]
      const ships = order.filter((t) => byType.has(t)).map((t) => ({ label: typeCount(byType.get(t).length, t, { words: false }), names: byType.get(t) }))
      const kinds = new Map()
      let count = 0
      for (const a of sd.aircraft || []) {
        const short = kitShort(airKits.get(a.kit), a.kit)
        kinds.set(short, (kinds.get(short) || 0) + (a.count || 0))
        count += a.count || 0
      }
      const B = files.battle?.sides || {}
      const ja = (B[WG_KEY[code]] || Object.values(B).find((x) => x?.side === code))?.ja ?? null
      return { code, name: sd.name || sideName(code), ja, goal: sd.goal?.text || '', ships, aircraft: { count, list: [...kinds].map(([k, n]) => `${n} ${plural(k, n)}`) } }
    })
    const mins = Math.round((sc.durationS || 600) / 60)
    const touch = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches
    const keys = touch ? 'The arrows on the bar take you to the next ship or aircraft of the same kind; a tap on one of your side’s takes you into it.' : 'Tab and 1–4 move you between ships and aircraft; a click on one of your side’s takes you into it.'
    return { id: sc.id, title: sc.title || `${sc.box ?? sc.id} as a wargame`, gloss: `${mins === 10 ? 'Ten' : numWord(mins).replace(/^./, (c) => c.toUpperCase())} minutes, either side`, label: sc.label || WG_LABEL, focus, sides, keys }
  }

  /** *Play it as a wargame* (the card, the briefing) or *Wargame* (the bar): the start sheet. */
  async function openStartSheet(id, { focus = null } = {}) {
    if (!id) return
    L.sheet = id
    let sc = null
    try {
      sc = await loadScenario(id)
    } catch (err) {
      app.warn(`wargame ${id}: ${err.message}`)
    }
    if (!sc) return ui.card.openWargame({ id, title: 'A wargame', label: WG_LABEL, missing: true })
    let files = { battle: { units: [], sides: {} }, kits: { ships: [], aircraft: [] } }
    try {
      files = await boxFile(sc.box ?? id)
    } catch (err) {
      app.warn(`wargame ${id}: the box's battle file: ${err.message}`)
    }
    if (L.sheet !== id) return
    // (on a phone the sheet takes the screen the list would)
    if (narrow() && list.isOpen) list.close()
    ui.card.openWargame(sheetData(sc, files, focus))
  }
  L.openStartSheet = openStartSheet

  function setWargameUrl(id, side) {
    app.url.battle = null
    app.url.t = null
    app.url.moment = null
    app.url.unit = null
    app.url.station = null
    app.url.kept = { ...(app.url.kept || {}), wargame: id, side }
  }
  function clearWargameUrl() {
    if (!app.url?.kept) return
    const { wargame, side, ...rest } = app.url.kept
    if (wargame === undefined && side === undefined) return
    app.url.kept = rest
  }

  /** *Japan* / *United States*: Battle.enterWargame(id, { side }) (it loads the box and the scenario, and cuts to the side's first unit). */
  async function startWargame(id, side) {
    if (!id || !['jp', 'us'].includes(side) || L.busy) return null
    if (typeof battle.enterWargame !== 'function') {
      app.warn('Battle.enterWargame() is not in this build (ROUND-3 §4): link.js calls it, the integrator wires it')
      return null
    }
    L.busy = true
    try {
      ui.card.close()
      list.close()
      ui.help?.classList.add('hidden')
      const sc = await loadScenario(id).catch(() => null)
      const state = await battle.enterWargame(id, { side })
      if (!state) return null
      beginWargame(id, side, sc ?? battle.wargame?.scenario ?? null)
      app.pushUrl?.()
      return state
    } catch (err) {
      app.warn(`enterWargame ${id}: ${err.message}`)
      return null
    } finally {
      L.busy = false
    }
  }
  L.startWargame = startWargame

  /** A wargame begun (or begun again): its state, the URL, the hints once. */
  function beginWargame(id, side, sc) {
    const was = L.wg
    L.wg = { id, side, scenario: sc ?? was?.scenario ?? L.scenarios.get(id) ?? null, session: ++L.session, arena: null, seen: 0, seenH: 0, marks: [], extra: [], xid: 0, reel: [], ended: false, endAt: 0, heldIndex: null }
    setWargameUrl(id, side)
    L.held = null
    L.offered = null
    L.stop = -1
    L.cache = null
    L.selected = null
    L.seenSelected = undefined
    hintsOnce()
  }

  /** *Play again* (the same side) or *Play the other side*: Battle.restart({ side }). */
  function restartWargame(side) {
    const wg = L.wg
    if (!wg || !['jp', 'us'].includes(side)) return
    ui.card.close()
    let r = null
    try {
      r = typeof battle.restart === 'function' ? battle.restart({ side }) : null
    } catch (err) {
      return app.warn(`restart ${side}: ${err.message}`)
    }
    const go = () => {
      beginWargame(wg.id, side, wg.scenario)
      app.replaceUrl?.()
    }
    if (r && typeof r.then === 'function') r.then(go, (err) => app.warn(`restart ${side}: ${err.message}`))
    else go()
  }

  /** The wargame left: the layer, the end card, the URL's keys. */
  function endWargameState() {
    L.wg = null
    L.sheet = null
    clearWargameUrl()
    hud.set(null)
    ui.root.classList.remove('wargame')
    if (ui.card.mode === 'wargame-end') ui.card.close()
  }

  /** Tab's hop on the bar (the next friendly unit of the same kind), 1–4's kinds, or a unit's index: Battle.hop (or the arena's). */
  function hop(kind = 'next') {
    if (!L.wg) return null
    const a = arenaOf()
    try {
      const r = typeof battle.hop === 'function' ? battle.hop(kind) : a?.hop?.(kind) ?? null
      L.cache = null
      return r
    } catch (err) {
      app.warn(`hop ${kind}: ${err.message}`)
      return null
    }
  }
  L.hop = hop

  /** In a wargame a unit picked (the list, a tap in the box) is possessed at once when it is the played side's; the other side's is only looked at. */
  function selectInWargame(index) {
    const u = unitAt(index)
    if (!u) return
    const me = arenaOf()?.player?.unitIndex
    if (u.index === me) return
    if (u.takeable === true && !u.enemy && u.side === L.wg.side) {
      hop(u.index)
      if (narrow() && list.isOpen) list.close()
    } else if (typeof battle.select === 'function') battle.select(index)
    L.selected = index
    L.seenSelected = battle.state?.selected ?? index
    if (list.isOpen) list.set(listData())
  }

  // (the arena's fields, by the side's code or its key, as a number, an object or a function)
  const bySide = (o, code) => (typeof o === 'function' ? o(code) : o?.[code] ?? o?.[WG_KEY[code]] ?? null)
  function shareOf(v) {
    if (typeof v === 'number') return v > 1.0001 ? v / 100 : v
    if (!v || typeof v !== 'object') return 0
    const x = v.share ?? v.fraction ?? v.ratio ?? v.value ?? (v.max ? v.now / v.max : v.hpMax ? v.hp / v.hpMax : null)
    return typeof x === 'number' ? (x > 1.0001 ? x / 100 : x) : 0
  }
  function tallyOf(t, code) {
    const x = bySide(t, code) || {}
    return { sunk: x.sunk ?? x.sank ?? x.shipsSunk ?? x.ships ?? 0, downed: x.downed ?? x.shotDown ?? x.aircraft ?? 0 }
  }
  /** The played side's main goal: a single goal object, or one per side. */
  function goalOf(a, code) {
    const o = a.objective
    const g = o && (o.kind || o.text) && !o[code] && !o[WG_KEY[code]] ? o : bySide(o, code)
    const sd = scenarioSide(L.wg?.scenario, code)?.goal
    if (!g && !sd) return null
    return { ...(sd || {}), ...(g || {}) }
  }
  function phaseOf(a, code) {
    const p = a.phase
    return p && (p.title || p.text) && !p[code] && !p[WG_KEY[code]] ? p : bySide(p, code)
  }
  const goalCount = (g) => {
    const done = g.done ?? g.progress ?? 0
    if (g.kind === 'survive') return `${done} of ${g.of ?? g.total ?? g.count} afloat`
    return `${done} of ${g.count ?? g.target ?? g.of ?? 0}`
  }

  /** The HUD layer's data, from the arena now. */
  function hudState(a, side, heldU) {
    const g = goalOf(a, side)
    const p = phaseOf(a, side)
    const leftS = p ? p.leftS ?? p.left ?? (p.endsAt != null ? p.endsAt - (a.t ?? 0) : p.t != null && p.goal?.withinS != null ? p.t + p.goal.withinS - (a.t ?? 0) : null) : null
    let you = null
    if (heldU) {
      const kit = kitFor(heldU)
      const st = heldStation()
      if (heldU.kind === 'aircraft') {
        const members = units().filter((x) => x.group === heldU.group && x.kind === 'aircraft')
        const k = memberOf(heldU)
        you = { name: heldU.groupName || heldU.name, sub: [`${kitShort(kit, heldU.kit)}${k != null && members.length > 1 ? ` ${k + 1} of ${members.length}` : ''}`, st ? stationLabel(st) : null].filter(Boolean).join(' · ') }
      } else you = { name: heldU.name, sub: [heldU.hull || shipType(kit), st ? stationLabel(st) : null].filter(Boolean).join(' · ') }
    }
    return {
      sides: ['jp', 'us'].map((code) => ({ code, name: wgSideName(code), strength: shareOf(bySide(a.strength, code)), tally: tallyOf(a.tally, code), mine: code === side })),
      timer: clockText(a.t ?? 0),
      goal: g ? { text: g.text || '', count: goalCount(g), status: g.status || 'open' } : null,
      phase: p ? { key: `${p.index ?? ''}:${p.t ?? ''}:${p.title ?? ''}`, title: p.title || '', text: p.text || '', count: p.goal?.kind === 'survive' ? `${p.done ?? 0} afloat` : `${p.done ?? 0} of ${p.count ?? p.goal?.count ?? 0}`, left: leftS != null ? clockText(leftS) : '', status: p.status || 'open' } : null,
      you,
      touch: typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches,
    }
  }

  /** Where the scene puts unit i on the screen (the HUD's projection of its state.pos, a little above it), or null. */
  function project(a, i) {
    const P = a.state?.pos
    let x
    let y
    let z
    if (P && P.length >= 3 * i + 3) [x, y, z] = [P[3 * i], P[3 * i + 1], P[3 * i + 2]]
    else {
      const p = a.positionOf?.(i)
      if (!p) return null
      ;[x, y, z] = Array.isArray(p) ? p : [p.x, p.y, p.z]
    }
    const sc = battle.scene
    const f = typeof sc?.project === 'function' ? sc.project.bind(sc) : typeof sc?.hud?.project === 'function' ? sc.hud.project.bind(sc.hud) : null
    if (!f || !Number.isFinite(x)) return null
    return f(x, Math.max(0, y || 0) + 25, z)
  }

  /** The new events since the last frame: hit markers on their targets, the respawn line; then the markers placed. */
  function markersFrame(a) {
    const wg = L.wg
    const evs = a.events || []
    const now = performance.now() / 1000
    const me = a.player?.unitIndex
    const fresh = []
    for (let i = wg.seen; i < evs.length; i++) fresh.push(evs[i])
    wg.seen = evs.length
    fresh.push(...wg.extra.splice(0))
    for (const e of fresh) {
      // (what happened more than a marker's life ago in the game's time is not marked: a slow frame or a jump in the clock)
      if (typeof e.t === 'number' && typeof a.t === 'number' && a.t - e.t > 1.5) continue
      // (a near miss only where it is the player's: on the held unit, or the player's own shot)
      const marked = MARKED.has(e.kind) || (e.kind === 'near-miss' && (e.mine || e.target === me))
      if (marked && e.target != null && e.text) wg.marks.push({ id: `${wg.session}:${e.id ?? wg.marks.length}`, key: e.target, text: e.text, mine: !!e.mine, kind: e.kind, at: now })
      if (e.kind === 'respawn' && e.mine !== false) hud.say(e.text || respawnLine(a, e), 3.2)
    }
    wg.marks = wg.marks.filter((m) => now - m.at < 1.5).slice(-8)
    hud.marks(wg.marks.map((m) => {
      const p = project(a, m.key)
      return { ...m, x: p?.[0], y: p?.[1], age: now - m.at }
    }))
  }

  /** "Your Avenger did not return. The next one is yours." where the arena gives no words. */
  function respawnLine(a, e) {
    const rows = units()
    const from = rows.find((u) => u.index === e.from)
    const to = rows.find((u) => u.index === e.to)
    if (from?.kind === 'aircraft') {
      const short = kitShort(kitFor(from), from.kit)
      const other = to?.kind === 'aircraft' ? asSentence(aircraftRole(kitShort(kitFor(to), to.kit), to.groupName || to.name || '')).replace(/\.$/, '') : to?.name
      return `Your ${short} did not return. ${to && to.group === from.group ? 'The next one is yours.' : to ? `${other} is yours.` : ''}`.trim()
    }
    return `${from?.name ?? 'Your ship'} is sinking.${to ? ` ${to.name} is yours.` : ''}`
  }

  /** The highlights since the last frame, for the reel: their stills (the arena's, or the scene's snapshot now), at most six, the sinkings and the player's own kept first. */
  function reelFrame(a) {
    const wg = L.wg
    const hs = a.highlights || []
    const prio = (x) => (x.kind === 'sunk' || x.kind === 'sinking' ? (x.mine ? 5 : 4) : x.kind === 'magazine' ? 4 : x.kind === 'lost' ? 3 : x.mine ? 2 : 1)
    for (let i = wg.seenH; i < hs.length; i++) {
      const hl = hs[i]
      const item = { id: hl.id ?? i, t: hl.t ?? a.t ?? 0, kind: hl.kind, mine: !!hl.mine, text: hl.text ?? hl.caption ?? '', src: hl.image ?? hl.snapshot ?? hl.src ?? null }
      item.prio = prio(item)
      const worst = wg.reel.length >= 6 ? wg.reel.reduce((w, r, k) => (r.prio < wg.reel[w].prio ? k : w), 0) : -1
      if (worst >= 0 && wg.reel[worst].prio >= item.prio) continue
      if (!item.src) {
        try {
          item.src = battle.scene?.snapshot?.() ?? null
        } catch (err) {
          app.warn(`scene.snapshot(): ${err.message}`)
        }
      }
      if (!item.src) continue
      if (worst >= 0) wg.reel.splice(worst, 1)
      wg.reel.push(item)
    }
    wg.seenH = hs.length
  }

  /** The result: the end card, a moment after it (the last marker and the sinking seen first). */
  function endFrame(a) {
    const wg = L.wg
    const r = a.result
    if (!r || wg.ended) return
    const now = performance.now()
    if (!wg.endAt) wg.endAt = now + 1600
    if (now < wg.endAt) return
    wg.ended = true
    if (document.pointerLockElement) document.exitPointerLock?.()
    list.close()
    hud.say('')
    hud.hint(null)
    ui.card.openWargameEnd(endData(a, r))
  }

  function endData(a, r) {
    const wg = L.wg
    const side = wg.side
    const other = otherSide(side)
    const met = r.met ? bySide(r.met, side) : r.winner ? r.winner === side : r.side ? r.side === side : null
    const t = clockText(r.t ?? a.t ?? 0)
    const tl = (code) => {
      const x = tallyOf(a.tally, code)
      return `sank ${typeCount(x.sunk, 'ship', { words: false })}, shot down ${typeCount(x.downed, 'aircraft', { words: false })}`
    }
    const p = a.tally?.player || a.tally?.mine || null
    const yours = p ? [`${p.hits ?? 0} ${p.hits === 1 ? 'hit' : 'hits'}`, `${p.sunk ?? 0} sunk`, `${p.downed ?? 0} shot down`, `${p.lost ?? 0} lost`].join(' · ') : null
    return {
      title: wg.scenario?.title || 'The wargame',
      kicker: `${met === true ? 'Goal met' : met === false ? 'Goal missed' : 'The end'} · ${t}`,
      result: r.text || resultLine(a, r),
      sides: ['jp', 'us'].map((code) => ({ code, name: wgSideName(code), line: tl(code), mine: code === side })),
      yours,
      reel: [...wg.reel].sort((x, y) => x.t - y.t).map((x) => ({ src: x.src, caption: `${clockText(x.t)} · ${asSentence(x.text).replace(/\.$/, '')}` })),
      footnote: wg.scenario?.footnote || '',
      label: wg.scenario?.label || WG_LABEL,
      side,
      other: { code: other, name: wgSideName(other) },
    }
  }

  /** The result in one line, from the played side's goal ("Taffy 3 kept five of the six escort carriers afloat until 10:00."). */
  function resultLine(a, r) {
    const side = L.wg.side
    const g = goalOf(a, side) || {}
    const end = clockText(a.durationS ?? L.wg.scenario?.durationS ?? 600)
    const t = clockText(r.t ?? a.t ?? 0)
    const me = wgSideName(side)
    const them = wgSideName(otherSide(side))
    const n = g.done ?? g.progress ?? 0
    const type = g.type || 'ship'
    const met = r.met ? bySide(r.met, side) : null
    if (g.kind === 'survive') {
      const of = g.of ?? g.total ?? g.count ?? 0
      if (met === false || g.status === 'failed') return `${them} sank ${numWord(Math.max(0, of - n))} of the ${typeCount(of, type)} by ${t}.`
      return `${me} kept ${numWord(n)} of the ${typeCount(of, type)} afloat until ${end}.`
    }
    const verb = { sink: 'sank', hit: 'hit', 'shoot-down': 'shot down', reach: 'reached' }[g.kind] ?? 'made'
    const count = g.count ?? g.target ?? 0
    if (met === true || g.status === 'met') return `${me} ${verb} ${typeCount(n, type)} by ${t}.`
    return `${me} ${verb} ${typeCount(n, type)}; the goal was ${numWord(count)} by ${end}.`
  }

  /** The hop hints, once in this browser (localStorage pt.hints, as the first take's): Tab and 1–4, or on a touch screen the hop button. */
  function hintsOnce() {
    let seen = {}
    try {
      seen = JSON.parse(localStorage.getItem('pt.hints') || '{}') || {}
    } catch {
      seen = {}
    }
    if (seen.wargame) return
    const touch = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches
    hud.hint(
      touch
        ? [`<b class="wg-hop-ic">${HOP_ICON}</b> the next ship or aircraft of the same kind`, '<b>Units</b> any ship or aircraft of your side', 'A tap on one of your side’s ships or aircraft: it is yours']
        : ['<b>Tab</b> the next ship or aircraft of the same kind', '<b>1</b> carrier <b>2</b> battleship or cruiser <b>3</b> destroyer <b>4</b> aircraft', 'A click on one of your side’s ships or aircraft: it is yours'],
      9,
    )
    try {
      localStorage.setItem('pt.hints', JSON.stringify({ ...seen, wargame: true }))
    } catch {
      // (no storage: the hints show this once in this page's life)
    }
  }

  /** A wargame's frame: false when none runs (the record's frame follows); else the bar, the HUD layer, the markers, the reel, the end. */
  function wargameFrame() {
    const a = arenaOf()
    const st = battle.state
    // (a wargame the engine started itself, from its own key or URL: adopted)
    if (!L.wg && a && st?.wargame?.id) beginWargame(st.wargame.id, st.wargame.side, battle.wargame?.scenario ?? null)
    if (!L.wg) {
      if (hud.shown) hud.set(null)
      ui.root.classList.remove('wargame')
      return false
    }
    if (!a || app.active !== battle.scene || app.mode === 'flying') {
      hud.set(null)
      bar.set(null)
      if (list.isOpen) list.close()
      ui.root.classList.remove('holding', 'wargame')
      return true
    }
    const wg = L.wg
    // a restart (the arena anew, or its events begun again): the markers and the reel with it
    const side = st?.wargame?.side ?? a.side ?? wg.side
    if (a !== wg.arena || side !== wg.side) {
      if (wg.arena) beginWargame(wg.id, side, wg.scenario)
      L.wg.arena = a
    } else if ((a.events?.length ?? 0) < wg.seen || (a.highlights?.length ?? 0) < wg.seenH) {
      // (the same arena begun again in place, or the dev page's scrub back: what was read is read again)
      Object.assign(wg, { seen: 0, seenH: 0, marks: [], reel: [], ended: false, endAt: 0 })
    }
    if (!a.result && wg.ended) Object.assign(wg, { ended: false, endAt: 0 })
    ui.root.classList.add('holding', 'wargame')
    const heldU = heldUnit()
    if ((heldU?.index ?? null) !== L.wg.heldIndex) {
      L.wg.heldIndex = heldU?.index ?? null
      L.cache = null
    }
    const timer = clockText(a.t ?? 0)
    bar.set({
      mode: 'wargame',
      clock: timer,
      clockS: timer,
      where: heldU?.name ?? '',
      stop: [-1, 0],
      running: battle.running,
      scale: 1,
      scales: [],
      t: Math.round(a.t ?? 0),
      duration: a.durationS ?? 600,
      assist: null,
      held: heldU ? { name: heldU.name, station: heldStation(), stations: (heldU.stations || []).map((s) => ({ name: s, label: stationLabel(s), short: STATION[s]?.short ?? null, where: STATION[s]?.where ?? '' })) } : null,
    })
    hud.set(hudState(a, L.wg.side, heldU))
    markersFrame(a)
    reelFrame(a)
    endFrame(a)
    // the list and the selection a few times a second (a tap in the box possesses, as a pick in the list does)
    const now = performance.now()
    if (now - L.slow >= 250) {
      L.slow = now
      const sel = battle.state?.selected
      if (sel !== undefined && sel !== L.seenSelected) {
        const fromBox = L.seenSelected !== undefined
        L.seenSelected = sel
        if (fromBox && sel != null && sel !== a.player?.unitIndex) selectInWargame(sel)
      }
      if (list.isOpen) list.set(listData())
    }
    return true
  }
  L.wargameFrame = wargameFrame

  // --- the URL (ENGINEERING §9, ROUND-2 §5) ---------------------------------------------------
  /** A unit named by the URL (#unit, #station): selected, its card open with the station's button focused, never pressed. */
  function offerUnit(id, station) {
    const rows = units()
    let u = rows.find((x) => x.id === id && !x.spare)
    let spareOf = null
    // (a group's id: its first aircraft that can be taken, else the group's spare where it flies one)
    if (!u) {
      u = rows.find((x) => x.group === id && x.kind === 'aircraft' && !x.spare && x.takeable === true)
      if (!u && groupTakeable(id) === true) spareOf = id
      u ||= rows.find((x) => x.group === id && x.kind === 'aircraft' && !x.spare)
    }
    if (!u) return app.warn(`#unit=${id}: no such unit in this box`)
    if (station && !(u.stations || []).includes(station)) app.warn(`#station=${station}: ${u.name} has no such station`)
    L.offeredUnit = `${id}|${station ?? ''}`
    select(u.index, { focus: station && (u.stations || []).includes(station) ? station : (u.stations || [])[0], spareOf })
  }
  L.offerUnit = offerUnit

  /** #battle, #t, #moment, #unit and #station, read at boot (after the table) and on hashchange. */
  app.urlBattle = async (h) => {
    if (L.busy || app.mode === 'flying') return
    // #wargame=<id>&side=<jp|us>: the start sheet, that side's button focused (a wargame starts on a click)
    const wgId = h.get('wargame')
    if (wgId) {
      if (L.wg?.id === wgId) return
      const side = ['jp', 'us'].includes(h.get('side')) ? h.get('side') : null
      if (!wargameKnown(wgId)) return app.warn(`#wargame=${wgId}: no such wargame`)
      // (the box the URL names first, where it names one: the sheet then stands over the box)
      if (h.get('battle') && h.get('battle') !== battle.state?.boxId && app.data.boxById.has(h.get('battle'))) await enter(h.get('battle'), { from: 'url', t: h.get('t') })
      return openStartSheet(wgId, { focus: side })
    }
    const id = h.get('battle')
    const t = h.get('t')
    const momentId = h.get('moment')
    const unit = h.get('unit')
    const station = h.get('station')
    const open = battle.state?.boxId ?? null
    if (id && !app.data.boxById.has(id)) {
      app.warn(`#battle=${id}: no such box`)
      return
    }
    if (!id && open) return leave({ fromUrl: true })
    if (id && id !== open) {
      await enter(id, { from: 'url', t, momentId })
      const cam = h.get('cam')?.split(',').map(Number)
      if (cam?.length === 5 && cam.every(Number.isFinite) && battle.scene?.rig) battle.scene.rig.jump({ x: cam[0], z: cam[1], distance: cam[2], yaw: cam[3], pitch: cam[4] })
      // (after the box is entered: the unit offered, as #moment is)
      if (unit && battle.sim && !momentId) offerUnit(unit, station)
      return
    }
    if (id && t && battle.sim) {
      try {
        const tt = battle.sim.clock.parse(t)
        if (Math.abs(tt - battle.sim.t) > 1) battle.scrub(t)
      } catch (err) {
        app.warn(`#t=${t}: ${err.message}`)
      }
    }
    if (id && momentId && momentId !== L.offered && !battle.input) {
      L.offered = momentId
      openBriefing({ focus: momentId })
    }
    if (id && unit && !momentId && !battle.input && `${unit}|${station ?? ''}` !== L.offeredUnit) offerUnit(unit, station)
  }
}
