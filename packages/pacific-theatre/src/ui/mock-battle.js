// Dev-only (ui.html, never in the build): a stub of ROUND-2.md §3–4's Battle
// over a real battle file, so the unit list, the unit card, the box's bar,
// the briefing and the after-card can be built and tested while the engine
// is rebuilt beside them. It serves the contract's shapes, not the engine's
// models:
//
//   battle.sim.units() → [{ index, id, kind: 'ship' | 'aircraft', side, name, ja, kit, group, alive,
//                           takeable: true | reason, stations, now, next,
//                           (extras: k, the aircraft's index in its group; hull; spare; state: [words]) }]
//   battle.sim.sortie  → { span: [tTake, tRelease], unit, stations, hits, releases, damageTaken, survived, how,
//                           divergedDuring: [{ id, name, kind, reason }] }
//   battle.select(index | null), battle.take({ unit | group, index?, station, t? }), battle.setStation(name),
//   battle.release(), battle.bookmarks, battle.takeMoment(id), battle.assist (get/set), battle.firstDoor,
//   battle.state (+ selected, station, assist, sortie), battle.play(0.5…), battle.speeds
//
// with the box's clock running (tick), and scripted changes while a unit is
// held (a release, a hit, damage taken, an aircraft of the other side that
// did not return), so every screen has something to show. Units come from
// battle.json and the kits by ROUND-2 §2–3's rules (takeability by the
// record's flags and the clock; stations by kit); `now` and `next` from the
// unit's track, station or route and its events, in the stops' voice
// (src/ui/roles.js). Positions are the record's, interpolated, for the dev
// page's plan view and its click-to-select (scene/pick.js's 24 px rule).

import { BattleClock } from '../time.js'
import { wrapDeep } from '../data/load.js'
import { STATIONS, eventLine, attackLine, steaming, FATE_VERB } from './roles.js'

const KN = 0.514444
const DEG = Math.PI / 180
const SINK = new Set(['sunk', 'scuttled', 'capsized', 'exploded', 'lost', 'wrecked', 'beached'])
const normSide = (s) => (/^(jp|japan|ijn|ija)$/i.test(String(s)) ? 'jp' : /^(us|usa|usn|usaaf|usmc)$/i.test(String(s)) ? 'us' : s || 'us')
const WATCH_SCALES = [1, 2, 4, 8, 15, 30, 60]
const SHIP_SCALES = [1, 2, 4, 8]

/** ROUND-2 §3's rule: the stations a kit offers (kit.stations overrides). group: the air group's record, for a level run-in. */
export function stationsFor(kit, kind, group = null) {
  if (Array.isArray(kit?.stations) && kit.stations.length) return kit.stations.filter((s) => STATIONS.includes(s))
  if (kind === 'ship') {
    const out = ['helm']
    if ((kit?.guns || []).some((g) => g.role === 'main')) out.push('main')
    if ((kit?.aa || []).some((a) => (a.mounts ?? 1) > 0)) out.push('aa')
    if (kit?.torpedoes?.tubes) out.push('torpedoes')
    return out
  }
  const out = ['pilot']
  const crew = kit?.crew ?? 1
  // a rear gun: engine-2 adds `arc: 'rear'` (ROUND-2 §7); until then the kits' `position` says it
  const rear = (kit?.guns || []).some((g) => g.arc === 'rear' || ['rear', 'turret', 'waist'].includes(g.position))
  if (crew >= 2 && (rear || ['torpedo', 'dive', 'level'].includes(kit?.type))) out.push('gunner')
  if (kit?.type === 'level' || group?.attack?.profile === 'level') out.push('bombardier')
  return out
}

export class MockBattle {
  constructor(app) {
    this.app = app
    this.ready = false
    this.scene = null
    this.sim = null
    this.loaded = null
    this.running = false
    this.timeScale = 1
    this.input = null
    this.momentId = null
    this._assist = 'assisted'
    this._selected = null
    this._held = null
    this._moment = null
    this._keys = null
    this.calls = [] // every API call, for the smoke test
  }

  // --- ROUND-2 §4 -----------------------------------------------------------------------------

  get assist() {
    return this._assist
  }
  set assist(v) {
    if (v !== 'assisted' && v !== 'pilot') throw new Error(`assist “${v}”: assisted or pilot`)
    this.calls.push(['assist', v])
    this._assist = v
    if (this.sim) this.sim.assist = v
    // a held aircraft keeps the list's bounds (Pilot: ×1 only)
    if (this._held?.kind === 'aircraft' && !this.speeds.includes(this.timeScale)) this.timeScale = 1
  }

  get bookmarks() {
    if (!this.sim) return []
    return [...this.sim.record.moments.values()].map((m) => ({ id: m.id, t: m.t, title: m.title, ja: m.ja ?? null, role: m.role, objective: m.objective?.text ?? null }))
  }

  get firstDoor() {
    const B = this.loaded?.battle
    if (!B) return null
    const fd = B.firstDoor || FALLBACK_DOORS[B.id] || null
    if (!fd) return null
    return { ...fd, t: this.sim.clock.parse(fd.t) }
  }

  /** The speeds the bar offers now: watching 1×–60×; a held aircraft ×0.5, ×1, ×2 in Assisted and ×1 in Pilot; a held ship 1×–8×. */
  get speeds() {
    if (this._moment && this.sim?.momentState) {
      const ms = this.sim.momentState
      return [ms.timeScale, ms.timeScale * 2, 4].filter((v, i, a) => v <= ms.maxTimeScale && a.indexOf(v) === i)
    }
    if (this._held?.kind === 'aircraft') return this._assist === 'assisted' ? [0.5, 1, 2] : [1]
    if (this._held) return SHIP_SCALES
    return WATCH_SCALES
  }

  select(index) {
    this.calls.push(['select', index])
    this._selected = index == null ? null : Number(index)
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'select', index: this._selected } }))
    return this._selected
  }

  /**
   * Take the controls (ROUND-2 §3: { unit, station } for a ship, { group, station } or
   * { group, index, station } for an aircraft, never index 0); t: jump there first.
   * Throws with §2's reason when the unit cannot be taken.
   */
  take(role) {
    this.calls.push(['take', role])
    const sim = this.sim
    if (!sim) throw new Error('take() comes after enter()')
    if (this._held) this.release({ quiet: true })
    if (role.t != null) this.scrub(role.t)
    const u = this.resolve(role)
    if (!u) throw new Error(`no unit for ${JSON.stringify(role)}`)
    if (u.takeable !== true) throw new Error(u.takeable)
    const station = role.station && u.stations.includes(role.station) ? role.station : u.stations[0]
    this._held = { index: u.index, id: u.id, kind: u.kind, group: u.group, k: u.k, t0: sim.t, station, stations: [station], touched: false, script: 0, momentId: role.momentId ?? null }
    sim.player = { kind: u.kind, unitIndex: u.index, station, scripted: false, input: {}, state: {} }
    sim.diverged = true
    sim.sortie = { span: [sim.t, null], unit: { index: u.index, id: u.id, kind: u.kind, name: u.name, ja: u.ja, kit: u.kit, group: u.group, side: u.side, hull: u.hull ?? null }, stations: [station], hits: [], releases: [], damageTaken: 0, survived: true, how: null, divergedDuring: [] }
    this._selected = u.index
    this.input = { mock: true }
    this.app.setMode?.('moment')
    // a take-over of an aircraft runs at ×0.5 in Assisted (ROUND-2 §1.2)
    this.timeScale = u.kind === 'aircraft' && this._assist === 'assisted' ? 0.5 : 1
    this.running = true
    this.bindKeys()
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'take', index: u.index, station } }))
    return this.state
  }

  setStation(name) {
    this.calls.push(['setStation', name])
    const h = this._held
    if (!h) return null
    const u = this.sim.units()[h.index]
    if (!u.stations.includes(name)) throw new Error(`${u.name} has no ${name} station`)
    h.station = name
    if (!h.stations.includes(name)) h.stations.push(name)
    this.sim.player.station = name
    this.sim.sortie.stations = [...h.stations]
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'station', station: name } }))
    return name
  }

  /** Give the unit back: the sortie closes over [tTake, now], the after-card opens through link.js (the 'released' event). */
  release({ quiet = false, how = 'released' } = {}) {
    this.calls.push(['release'])
    const h = this._held
    if (!h) return null
    const sim = this.sim
    const s = sim.sortie
    s.span[1] = sim.t
    s.how = s.how ?? how
    this._held = null
    sim.player = null
    // an untouched unit goes back to the record (and an untouched box's divergence with it)
    if (!h.touched && !s.divergedDuring.length) sim.diverged = false
    this.input = null
    this.unbindKeys()
    this.app.setMode?.('watch')
    if (this.timeScale < 1) this.timeScale = 1
    this.running = true
    if (this._moment) {
      // a bookmark resolves its promise as takeMoment does today
      const mo = this._moment
      this._moment = null
      sim.momentState = null
      const result = { score: { hits: s.hits, how: s.how, survived: s.survived, timeS: s.span[1] - s.span[0] }, outcome: { diverged: [], guess: [] }, reason: s.how, momentId: mo.id, sortie: s }
      this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'after', ...result } }))
      mo.resolve(result)
      return result
    }
    if (!quiet) this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'released', sortie: s } }))
    return { sortie: s }
  }

  /** A bookmark (one of the record's turning points), as today: the role at its t; resolves on the after-card. */
  takeMoment(momentId) {
    this.calls.push(['takeMoment', momentId])
    const m = this.sim?.record.moments.get(momentId)
    if (!m) throw new Error(`no moment “${momentId}”`)
    const role = m.role.kind === 'ship' ? { unit: m.role.unit } : { group: m.role.group }
    this.take({ ...role, station: m.role.kind === 'ship' ? 'helm' : 'pilot', t: m.t, momentId })
    this.momentId = momentId
    this.sim.momentState = { id: momentId, t0: m.t, checkpoint: false, done: false, timeScale: m.timeScale ?? 1, maxTimeScale: m.maxTimeScale ?? 4 }
    this.timeScale = this._held?.kind === 'aircraft' && this._assist === 'assisted' ? 0.5 : m.timeScale ?? 1
    return new Promise((resolve) => (this._moment = { id: momentId, resolve }))
  }

  finish(reason = 'card') {
    return this.release({ how: reason })
  }

  keepGoing() {
    this.running = true
  }

  restart() {
    return null
  }

  get state() {
    if (!this._state) return null
    const s = this.sim
    return { ...this._state, t: s.t, mode: this._held ? 'moment' : 'watch', momentId: this.momentId, selected: this._selected, station: this._held?.station ?? null, assist: this._assist, sortie: s.sortie }
  }

  // --- the lifecycle the first round's link.js already calls ------------------------------------

  async enter(boxId, { t = null, momentId = null } = {}) {
    const app = this.app
    const box = app.data.boxById.get(boxId)
    if (!box) throw new Error(`no box “${boxId}”`)
    this.calls.push(['enter', boxId])
    const get = async (p) => {
      const r = await fetch(app.data.abs(p))
      if (!r.ok) throw new Error(`${p}: HTTP ${r.status}`)
      return r.json()
    }
    const [battle, ships, aircraft] = await Promise.all([get(box.battle), get('kits/ships.json'), get('kits/aircraft.json')])
    wrapDeep(battle, box.proj.lon0)
    const kits = { ships, aircraft }
    this.loaded = { box, battle, kits }
    this.sim = new MockSim(battle, kits, box.proj, this)
    const t0 = t != null ? this.sim.clock.clamp(this.sim.clock.parse(t)) : battle.stops?.length ? this.sim.record.stops[0].t : 0
    this.sim.setTime(t0)
    this.momentId = momentId
    this.scene = { mock: true, setCamera() {}, hud: { say() {} } }
    this.ready = true
    app.active = this.scene
    app.setMode?.('watch')
    this.running = true
    this.timeScale = 1
    this._state = { boxId, t: t0, momentId, mode: 'watch' }
    app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'enter', boxId } }))
    return this.state
  }

  async leave() {
    this.calls.push(['leave'])
    if (this._held) this.release({ quiet: true })
    const id = this._state?.boxId
    this.scene = null
    this.sim = null
    this.loaded = null
    this._state = null
    this._selected = null
    this.ready = false
    this.running = false
    this.app.active = this.app.idle ?? null
    this.app.setMode?.('table')
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'leave', boxId: id } }))
  }

  abort() {}

  tick(realDt) {
    const sim = this.sim
    if (!sim || !this.running) return
    sim.advance(Math.min(0.1, realDt) * this.timeScale)
    if (this._held) this.script()
    if (sim.t >= sim.clock.duration) this.running = false
  }

  play(scale = this.timeScale) {
    const list = this.speeds
    this.timeScale = list.includes(scale) ? scale : list.reduce((a, b) => (Math.abs(b - scale) < Math.abs(a - scale) ? b : a), list[0])
    this.running = true
  }

  pause() {
    this.running = false
  }

  maxScale() {
    return Math.max(...this.speeds)
  }

  cycleTime(dir = 1) {
    const list = this.speeds
    const i = list.findIndex((v) => v >= this.timeScale)
    const j = dir > 0 ? (i + 1) % list.length : (i - 1 + list.length) % list.length
    this.timeScale = list[Math.max(0, j)]
    return this.timeScale
  }

  scrub(t) {
    const sim = this.sim
    if (!sim) return
    sim.setTime(sim.clock.clamp(sim.clock.parse(t)))
    return true
  }

  stopAt(t) {
    const stops = this.sim?.record.stops || []
    let best = stops[0] || null
    for (const s of stops) if (s.t <= t + 1e-6) best = s
    return best
  }

  lookAtStop() {}

  /** A role (or a unit index) → its row of units(). A group with no index: its first takeable aircraft (or the spare). */
  resolve(role) {
    const rows = this.sim.units()
    if (typeof role === 'number') return rows[role]
    if (role.unit != null) return rows.find((u) => u.id === role.unit) || null
    if (role.group != null) {
      const g = rows.filter((u) => u.group === role.group && u.kind === 'aircraft' && u.k != null)
      if (role.index != null) return g.find((u) => u.k === role.index) || null
      return g.find((u) => u.takeable === true) || g[0] || null
    }
    return null
  }

  // --- scripted changes while a unit is held ----------------------------------------------------

  script() {
    const h = this._held
    const sim = this.sim
    const s = sim.sortie
    const el = sim.t - h.t0
    const L = (t) => sim.clock.label(t)
    const step = (n, at, fn) => {
      if (h.script < n && el >= at) {
        h.script = n
        fn()
      }
    }
    const u = sim.rows[h.index]
    const kit = sim.kitOf(u)
    step(1, 4, () => (h.touched = true))
    if (h.kind === 'aircraft') {
      const g = sim.record.groupById.get(h.group)
      // (a fixed unit's fate is the record's alone, and a hospital ship or a ship past her fate registers nothing: ROUND-2 §2)
      const target = g?.attack?.targets?.find((x) => {
        const r = x.unit >= 0 ? sim.record.ships[x.unit] : null
        return r && !r.fixed && !r.hospital && !(r.fate?.t != null && r.fate.t <= sim.t)
      })
      const tName = target ? sim.record.ships[target.unit].name : null
      step(2, 12, () => {
        if (h.station === 'gunner') s.releases.push({ kind: 'guns', count: 1, t: sim.t, station: 'gunner' })
        else if (kit?.type === 'fighter') s.releases.push({ kind: 'guns', count: 2, t: sim.t })
        else if (kit?.type === 'torpedo' && g?.attack?.profile === 'torpedo') s.releases.push({ kind: 'torpedo', count: 1, t: sim.t, heightM: 40 })
        else s.releases.push({ kind: 'bomb', count: 1, t: sim.t, heightM: g?.attack?.releaseM ?? 600 })
      })
      step(3, 16, () => {
        if (tName && kit?.type !== 'fighter') {
          const kind = g.attack.profile === 'torpedo' ? 'torpedo-hit' : 'bomb-hit'
          s.hits.push({ name: tName, kind, count: 1, where: 'amidships' })
          s.divergedDuring.push({ id: target.id, name: tName, kind: 'ship', reason: `hit by a ${kind === 'torpedo-hit' ? 'torpedo' : 'bomb'} at ${L(sim.t)} that the record does not have` })
        } else {
          const other = sim.record.groups.find((x) => x.side !== u.side && x.launch != null && x.launch <= sim.t)
          if (other) {
            s.hits.push({ name: other.name, kind: 'aircraft', count: 1 })
            s.divergedDuring.push({ id: other.id, name: other.name, kind: 'group', reason: `one aircraft did not return, at ${L(sim.t)}` })
          }
        }
      })
      step(4, 22, () => (s.damageTaken = 0.3))
    } else {
      // (the nearest ship of the other side within 25 km that can register a hit)
      const can = (r) => r.side !== u.side && !r.hospital && !r.fixed && !r.parked && !(r.fate?.t != null && r.fate.t <= sim.t)
      const pos = h.script < 3 && el >= 20 ? sim.positions() : null
      const me = pos?.find((p) => p.index === h.index)
      let foe = null
      let best = 25000
      for (const p of pos || []) {
        const r = sim.record.ships[p.index]
        if (!me || !r || !can(r)) continue
        const d = Math.hypot(p.x - me.x, p.z - me.z)
        if (d < best) [foe, best] = [r, d]
      }
      step(2, 10, () => {
        if (h.station === 'aa') s.releases.push({ kind: 'aa', count: 40, t: sim.t })
        else if (h.station === 'torpedoes') s.releases.push({ kind: 'torpedo', count: 5, t: sim.t })
        else s.releases.push({ kind: 'salvo', count: 1, t: sim.t })
      })
      step(3, 20, () => {
        if (h.station === 'aa') {
          const g = sim.record.groups.find((x) => x.side !== u.side && x.launch != null)
          if (g) {
            s.hits.push({ name: g.name, kind: 'aircraft', count: 1 })
            s.divergedDuring.push({ id: g.id, name: g.name, kind: 'group', reason: `one aircraft did not return, at ${L(sim.t)}` })
          }
        } else if (foe) {
          s.hits.push({ name: foe.name, kind: h.station === 'torpedoes' ? 'torpedo-hit' : 'gun-hit', count: 1, where: 'forward' })
          s.divergedDuring.push({ id: foe.id, name: foe.name, kind: 'ship', reason: `hit forward at ${L(sim.t)}; afloat` })
        }
      })
      step(4, 30, () => (s.damageTaken = 0.08))
    }
  }

  // the controls' keys the mock stands in for: Backspace gives the unit back (the engine's
  // bindings.js does this, with its confirm); Tab is link.js's, as the bar's station buttons are
  bindKeys() {
    this.unbindKeys()
    this._keys = new AbortController()
    addEventListener(
      'keydown',
      (e) => {
        if (e.code !== 'Backspace' || !this._held || e.target.closest?.('input, textarea')) return
        e.preventDefault()
        this.release()
      },
      { signal: this._keys.signal, capture: true },
    )
  }

  unbindKeys() {
    this._keys?.abort()
    this._keys = null
  }
}

/** The record as the mock plays it: the parts of today's sim.record link.js reads, and units() at sim.t. */
class MockSim {
  constructor(battle, kits, proj, battleRef) {
    this.battle = battle
    this.kits = kits
    this.proj = proj
    this.b = battleRef
    this.clock = new BattleClock(battle.clock)
    this.t = 0
    this.diverged = false
    this.player = null
    this.momentState = null
    this.sortie = null
    this.assist = battleRef._assist
    this.shipKits = new Map(kits.ships.map((k) => [k.id, k]))
    this.airKits = new Map(kits.aircraft.map((k) => [k.id, k]))
    const T = (s) => (s == null ? null : this.clock.parse(s))
    const xz = (ll) => {
      const [x, z] = proj.toWorld(ll)
      return { x, z }
    }
    const sites = new Map((battle.sites || []).map((s) => [s.id, { ...s, ...(s.lonlat ? xz(s.lonlat) : { x: 0, z: 0 }) }]))
    this.sites = sites
    // ships (and parked aircraft, which the record writes as units)
    const ships = (battle.units || []).map((u, i) => ({
      index: i,
      slot: i,
      id: u.id,
      name: u.name || u.id,
      ja: u.ja || null,
      hull: u.hull || null,
      kitId: u.kit,
      side: normSide(u.side),
      fixed: !!u.fixed,
      hospital: !!u.hospital,
      tokko: !!u.tokko,
      parked: !!u.station?.parked,
      offBox: !!u.offBox,
      track: (u.track || []).map((f) => ({ t: T(f.t), ...xz(f.lonlat), course: f.courseDeg, speed: f.speedKn ?? 0 })).sort((a, b) => a.t - b.t),
      station: u.station || null,
      fixedPos: u.station?.lonlat ? xz(u.station.lonlat) : u.station?.site && sites.get(u.station.site) ? sites.get(u.station.site) : u.station?.parked && sites.get(u.station.parked) ? sites.get(u.station.parked) : null,
      events: (u.events || []).map((e, k) => ({ ...e, k, t: T(e.t) })).sort((a, b) => a.t - b.t),
      fate: u.fate ? { kind: u.fate.kind, t: T(u.fate.t) } : null,
      raw: u,
    }))
    const shipById = new Map(ships.map((r) => [r.id, r]))
    const groups = (battle.groups || []).map((g, i) => ({
      index: i,
      id: g.id,
      name: g.name || g.id,
      ja: g.ja || null,
      kitId: g.kit,
      side: normSide(g.side),
      count: Math.max(1, g.count | 0),
      fromId: g.from ?? null,
      launch: T(g.launch),
      enter: g.enter ? { t: T(g.enter.t), ...(g.enter.lonlat ? xz(g.enter.lonlat) : { x: 0, z: 0 }), alt: g.enter.altM ?? g.altM } : null,
      route: (g.route || []).map((w) => ({ t: T(w.t), ...xz(w.lonlat), alt: w.altM ?? g.altM })).sort((a, b) => a.t - b.t),
      attack: g.attack ? { ...g.attack, t: T(g.attack.t) } : null,
      recover: g.recover ? { t: T(g.recover.t), toId: g.recover.to } : null,
      losses: g.losses || [],
      alt: g.altM ?? null,
      namedCrews: !!g.namedCrews,
      tokko: !!g.tokko,
      raw: g,
    }))
    const groupById = new Map(groups.map((g) => [g.id, g]))
    for (const g of groups) {
      const a = g.attack
      if (!a) continue
      const ids = Array.isArray(a.target) ? a.target : a.target != null ? [a.target] : []
      a.targets = ids.map((id) => ({ id, unit: shipById.get(id)?.index ?? -1, group: groupById.get(id)?.index ?? -1, site: sites.get(id) || null }))
    }
    this.record = {
      ships,
      groups,
      shipById,
      groupById,
      sites: [...sites.values()],
      stops: (battle.stops || []).map((s) => ({ ...s, t: T(s.t) })),
      moments: new Map((battle.moments || []).map((m) => [m.id, { ...m, t: T(m.t), beats: (m.beats || []).map((b) => ({ ...b, t: T(b.t) })) }])),
    }
    // the unit slots: the ships, then every aircraft of every group, then a spare for a group of named crews
    const rows = []
    for (const r of ships) rows.push({ index: rows.length, id: r.id, kind: r.parked ? 'aircraft' : 'ship', side: r.side, name: r.name, ja: r.ja, kit: r.kitId, group: r.raw.group ?? null, hull: r.hull, rec: r })
    for (const g of groups) {
      for (let k = 0; k < g.count; k++) rows.push({ index: rows.length, id: `${g.id}#${k + 1}`, kind: 'aircraft', side: g.side, name: g.name, ja: g.ja, kit: g.kitId, group: g.id, k, g })
      if (g.namedCrews) rows.push({ index: rows.length, id: `${g.id}#spare`, kind: 'aircraft', side: g.side, name: g.name, ja: g.ja, kit: g.kitId, group: g.id, k: g.count, g, spare: true })
    }
    this.rows = rows
  }

  kitOf(u) {
    return u.kind === 'ship' ? this.shipKits.get(u.kit) : this.airKits.get(u.kit) || this.shipKits.get(u.kit)
  }

  setTime(t) {
    this.t = t
  }

  advance(dt) {
    this.t = Math.min(this.clock.duration, this.t + dt)
  }

  units() {
    const t = this.t
    const L = (x) => this.clock.label(x)
    const held = this.b._held
    return this.rows.map((row) => {
      const kit = this.kitOf(row)
      const out = { index: row.index, id: row.id, kind: row.kind, side: row.side, name: row.name, ja: row.ja ?? kit?.ja ?? null, kit: row.kit, group: row.group, alive: true, takeable: true, stations: [], now: '', next: '', hull: row.hull ?? null }
      if (row.rec) {
        const r = row.rec
        const sunk = r.fate && SINK.has(r.fate.kind) && r.fate.t != null && r.fate.t <= t
        out.alive = !sunk
        out.stations = row.kind === 'ship' ? stationsFor(kit, 'ship') : []
        out.takeable = r.fixed ? 'fate is fixed' : r.hospital ? 'hospital ship' : r.tokko ? 'tokkō unit' : r.parked ? 'on the ground' : sunk ? `${FATE_VERB[r.fate.kind] ?? 'was lost'} at ${L(r.fate.t)}` : true
        out.now = this.shipNow(r, t)
        out.next = this.shipNext(r, t)
        out.state = this.shipState(r, t, sunk)
      } else {
        const g = row.g
        out.k = row.k
        if (row.spare) out.spare = true
        out.stations = stationsFor(kit, 'aircraft', g)
        const up = g.enter?.t ?? g.launch ?? 0
        const down = g.recover?.t ?? Infinity
        const lostN = g.losses.length ? Math.max(0, ...[].concat(g.losses[0]).map(Number).filter(Number.isFinite)) : 0
        const lost = g.attack?.t != null && t > g.attack.t + 60 && row.k >= g.count - lostN && !row.spare
        out.alive = !lost
        out.takeable = g.tokko ? 'tokkō unit' : row.k === 0 ? 'the leader’s aircraft' : g.namedCrews && !row.spare ? 'a named crew' : t < up ? 'not yet airborne' : t >= down ? 'landed' : lost ? 'did not return' : true
        out.now = this.groupNow(g, t, lost)
        out.next = this.groupNext(g, t)
        out.state = t < up || t >= down || lost ? [] : ['airborne', `${(this.altAt(g, t) ?? 1000).toLocaleString('en-GB')} m`, `fuel ${Math.max(5, Math.round(100 - ((t - up) / 3600) * 22))} %`]
      }
      if (held?.index === row.index) {
        out.takeable = true
        out.now = `at the controls, ${out.now}`
      }
      return out
    })
  }

  shipNow(r, t) {
    if (r.parked) return `parked at ${(r.station && this.sites.get(r.station.parked || r.station.site)?.name) || 'its field'}`
    if (r.fate?.t != null && r.fate.t <= t && SINK.has(r.fate.kind)) return `${FATE_VERB[r.fate.kind] ?? 'was lost'} at ${this.clock.label(r.fate.t)}`
    if (r.track.length) {
      let f = r.track[0]
      for (const x of r.track) if (x.t <= t) f = x
      return steaming(f.course, f.speed)
    }
    if (r.station?.guide) return `keeping station on ${this.record.shipById.get(r.station.guide)?.name ?? r.station.guide}`
    return 'not under way'
  }

  shipNext(r, t) {
    const e = r.events.find((x) => x.t > t && x.hud !== false && eventLine(x, 'she', this.cause(x)))
    if (!e) return ''
    // (the record's own words keep their capital after a colon; a made line runs on)
    return e.text ? `at ${this.clock.label(e.t)}: ${eventLine(e, 'she', this.cause(e))}` : `at ${this.clock.label(e.t)} ${eventLine(e, 'she', this.cause(e))}`
  }

  shipState(r, t, sunk) {
    if (sunk) return []
    const seen = new Set(r.events.filter((e) => e.t <= t).map((e) => e.kind))
    const w = ['afloat']
    if (seen.has('hit') || seen.has('torpedo-hit')) w.push('damaged')
    if (seen.has('fire')) w.push('on fire')
    if (seen.has('list')) w.push('listing')
    if (seen.has('flood')) w.push('flooding')
    if (seen.has('dead-in-water')) w.push('dead in the water')
    return w
  }

  cause(e) {
    if (!e.by) return null
    const g = this.record.groupById.get(e.by)
    if (g) return { kind: 'group', name: g.name, profile: g.attack?.profile ?? null }
    const s = this.record.shipById.get(e.by)
    return s ? { kind: 'unit', name: s.name } : null
  }

  targetName(g) {
    const x = g.attack?.targets?.[0]
    if (!x) return null
    return x.unit >= 0 ? this.record.ships[x.unit].name : x.group >= 0 ? this.record.groups[x.group].name.replace(/^The /, 'the ') : x.site?.name ?? null
  }

  groupNow(g, t, lost) {
    const from = g.fromId ? this.record.shipById.get(g.fromId)?.name ?? this.sites.get(g.fromId)?.name ?? null : null
    const up = g.enter?.t ?? g.launch ?? 0
    if (lost) return 'did not return'
    if (t < up) return g.enter && g.launch == null ? 'not yet in the box' : `on deck${from ? ` aboard ${from}` : ''}, launching at ${this.clock.label(up)}`
    if (g.recover && t >= g.recover.t) return `landed${g.recover.toId ? ` on ${this.record.shipById.get(g.recover.toId)?.name ?? g.recover.toId}` : ''}`
    const alt = this.altAt(g, t)
    if (g.attack?.t != null && t < g.attack.t) return `flying in at ${alt.toLocaleString('en-GB')} m`
    return g.recover ? `returning${g.recover.toId ? ` to ${this.record.shipById.get(g.recover.toId)?.name ?? ''}` : ''}` : `flying at ${alt.toLocaleString('en-GB')} m`
  }

  groupNext(g, t) {
    const up = g.enter?.t ?? g.launch ?? 0
    if (t < up) return `at ${this.clock.label(up)} ${g.enter && g.launch == null ? 'the group enters the box' : 'the group launches'}`
    if (g.attack?.t != null && t < g.attack.t) return `at ${this.clock.label(g.attack.t)} the group ${attackLine(g.attack.profile, this.targetName(g))}`
    if (g.recover && t < g.recover.t) return `at ${this.clock.label(g.recover.t)} the group lands`
    return ''
  }

  altAt(g, t) {
    const keys = [...(g.enter ? [{ t: g.enter.t, alt: g.enter.alt }] : []), ...g.route]
    let a = g.alt ?? keys[0]?.alt ?? 1500
    for (const k of keys) if (k.t <= t && k.alt != null) a = k.alt
    return Math.round(a / 10) * 10
  }

  /** Every unit's place at t (box metres), for the dev page's plan view: ships by track or station, a group by its plan. */
  positions() {
    const t = this.t
    const out = []
    const at = new Map()
    const shipAt = (r) => {
      if (at.has(r.index)) return at.get(r.index)
      let p = null
      if (r.track.length) {
        const tr = r.track
        let i = 0
        while (i < tr.length - 1 && tr[i + 1].t <= t) i++
        const a = tr[i]
        const b = tr[i + 1]
        if (t <= tr[0].t) p = { x: a.x, z: a.z, h: a.course ?? 0 }
        else if (b) {
          const u = (t - a.t) / Math.max(1, b.t - a.t)
          p = { x: a.x + (b.x - a.x) * u, z: a.z + (b.z - a.z) * u, h: a.course ?? Math.atan2(b.x - a.x, -(b.z - a.z)) / DEG }
        } else {
          const dt = Math.min(3600, t - a.t)
          const v = (a.speed || 0) * KN * dt
          p = { x: a.x + Math.sin((a.course ?? 0) * DEG) * v, z: a.z - Math.cos((a.course ?? 0) * DEG) * v, h: a.course ?? 0 }
        }
      } else if (r.fixedPos) p = { x: r.fixedPos.x, z: r.fixedPos.z, h: r.station?.headingDeg ?? 0 }
      else if (r.station?.guide) {
        at.set(r.index, { x: 0, z: 0, h: 0 }) // (a cycle stays at the centre)
        const g = this.record.shipById.get(r.station.guide)
        const q = g ? shipAt(g) : { x: 0, z: 0, h: 0 }
        const brg = (r.station.bearingDeg ?? 0) + (r.station.relative ? q.h : 0)
        p = { x: q.x + Math.sin(brg * DEG) * (r.station.rangeM ?? 0), z: q.z - Math.cos(brg * DEG) * (r.station.rangeM ?? 0), h: q.h }
      } else p = { x: 0, z: 0, h: 0 }
      at.set(r.index, p)
      return p
    }
    for (const r of this.record.ships) {
      const p = shipAt(r)
      const sunk = r.fate && SINK.has(r.fate.kind) && r.fate.t != null && r.fate.t <= t
      out.push({ index: r.index, kind: r.parked ? 'parked' : 'ship', side: r.side, x: p.x, z: p.z, h: p.h, sunk })
    }
    let base = this.record.ships.length
    for (const g of this.record.groups) {
      const keys = []
      const from = g.fromId ? this.record.shipById.get(g.fromId) : null
      const fromSite = g.fromId ? this.sites.get(g.fromId) : null
      const origin = from ? shipAt(from) : fromSite
      if (g.enter) keys.push({ t: g.enter.t, x: g.enter.x, z: g.enter.z })
      else if (g.launch != null && origin) keys.push({ t: g.launch, x: origin.x, z: origin.z })
      keys.push(...g.route)
      const tg = g.attack?.targets?.[0]
      if (g.attack?.t != null && tg) {
        const q = tg.unit >= 0 ? shipAt(this.record.ships[tg.unit]) : tg.site ? tg.site : null
        if (q) keys.push({ t: g.attack.t, x: q.x, z: q.z })
      }
      if (g.recover) {
        const r = this.record.shipById.get(g.recover.toId)
        const q = r ? shipAt(r) : origin
        if (q) keys.push({ t: g.recover.t, x: q.x, z: q.z })
      }
      keys.sort((a, b) => a.t - b.t)
      const n = g.count + (g.namedCrews ? 1 : 0)
      if (keys.length && t >= keys[0].t && t <= (g.recover?.t ?? Infinity)) {
        let i = 0
        while (i < keys.length - 1 && keys[i + 1].t <= t) i++
        const a = keys[i]
        const b = keys[i + 1] || a
        const u = b === a ? 0 : (t - a.t) / Math.max(1, b.t - a.t)
        const x = a.x + (b.x - a.x) * u
        const z = a.z + (b.z - a.z) * u
        const h = Math.atan2(b.x - a.x, -(b.z - a.z)) / DEG
        // (a vee: the leader ahead, the rest stepped back either side)
        for (let k = 0; k < g.count; k++) {
          const side = k === 0 ? 0 : k % 2 ? 1 : -1
          const rank = Math.ceil(k / 2)
          const dx = side * rank * 140
          const dz = rank * 160
          const c = Math.cos(h * DEG)
          const s = Math.sin(h * DEG)
          out.push({ index: base + k, kind: 'aircraft', side: g.side, group: g.id, x: x + dx * c - dz * s, z: z + dx * s + dz * c, h })
        }
      }
      base += n
    }
    return out
  }
}

/** Until content-2's `firstDoor` lands in the battle files (ROUND-2 §1.2, §7): the doors §1.2 names. Dev page only. */
const FALLBACK_DOORS = {
  'pearl-harbor': { role: { kind: 'ship', unit: 'helm', station: 'helm' }, t: '07:58', title: 'Helm, under way in the channel', text: 'A destroyer already moving when the first wave arrives: steer her out past the harbour mouth.' },
  midway: { role: { kind: 'aircraft', group: 'vf-3-cap-noon', station: 'pilot' }, t: '11:59', title: 'A Wildcat of the combat air patrol', text: 'Over Yorktown as Hiryū’s dive bombers come in: guns only, nothing to release.' },
  'ironbottom-sound': { role: { kind: 'ship', unit: 'gwin', station: 'helm' }, t: '23:24', title: 'Gwin’s helm', text: 'Fourth in the destroyer column as the column rounds Savo.' },
  samar: { role: { kind: 'ship', unit: 'johnston', station: 'helm' }, t: '07:10', title: 'Johnston’s helm', text: 'The destroyer turns toward the heavy ships through the smoke.' },
}
