// The battle's lifecycle (ENGINEERING.md §9): enter a box (load its pack,
// battle.json and the kits, build the sim at t, fly in, hand over), watch
// it, scrub it, take a moment and give the controls back, and leave.
//
// The hand-over is drawn with App's primitives (app.setMode, app.cut,
// app.setActive, the table's flyTo and outline: one scene drawn per frame, a
// fade through the haze between them); Battle.enter and Battle.leave call
// them in the contract's order, for both sides, and App (src/link.js) calls
// Battle (the integration kept the calls here rather than split them):
//
//   enter, from the table (from: 'table'):
//     app.setMode('flying')
//     app.table.outline(boxId, true)                         // the box's outline on the table
//     await app.table.flyTo(app.table.outlineView(boxId), { duration: 2.5, ready: () => battle.ready })
//     await app.cut(() => {                                  // pipeline.uFade to the haze and back, 0.25 s each way
//       app.setActive(battle.scene)                          // re-parents sky.group; the sky at the box's lat/lon and clock.utc(t)
//       battle.scene.rig.jump(poseToBox(app.table.rig.pose(), box.placement))
//     })
//     app.setMode('watch')
//   enter, from the URL (from: 'url'): the same without the flight (the rig jumps to the box's first stop)
//   leave:
//     app.setMode('flying')
//     await app.cut(() => {
//       app.setActive(app.table)
//       app.table.rig.jump(poseToTable(battle.scene.rig.pose(), box.placement))
//     })
//     app.table.outline(boxId, false); battle.scene.dispose(); app.setMode('table')
//
// A moment (takeMoment) takes the controls: the sim's takeControl, the
// camera on the player's unit, the HUD's instruments, the controls bound
// (src/battle/controls/), app.setMode('moment'); release() gives them back
// (app.setMode('watch')). The promise takeMoment returns resolves with the
// score and the outcome when the sortie ends or the after-card is asked for
// (finish()).
//
// Round two (ROUND-2.md §4): any unit is a door. select(index) marks a unit
// (a click or a tap in the box does it too: scene/pick.js); take({ unit |
// group, index?, station, t? }) takes it at a station at the current time
// (or t) and resolves, like takeMoment, when the sortie ends, with
// { sortie, score, outcome, reason }; setStation(name) switches; release()
// gives it back. bookmarks are the moments; assist is 'assisted' or 'pilot'
// (App keeps it); firstDoor is the battle file's (a first door's spare takes
// its `start`: Battle.take passes role.start to the sim). The 'battle' events
// gain 'select', 'take', 'station' and 'released' (the sortie, at every
// release); 'after' carries the sortie. The keys have one owner each: L and
// Enter while watching are src/link.js's, Tab while watching (the next unit)
// is bindWatchKeys's, Tab while a unit is held is the controls'.
//
// Round three (ROUND-3.md §4): the wargame. enterWargame(scenarioId, { side,
// seed, from }) loads the box and wargames/<id>.json, builds the arena
// (src/battle/arena/) in place of the record's sim (this.sim is the arena
// while it runs, so the scene, the HUD, the unit list and the controls read
// it unchanged), cuts to the side's first unit at its first station and runs
// at 1× (pause allowed, no scrubbing). hop(kind | index) is Tab and 1–4;
// restart({ side, seed }) builds a fresh arena (the other side's, when asked);
// endNow() forces the end; leave() as ever. The arena's events go out as
// 'battle' events with wargame: true ('phase', 'hit' markers via the arena's
// markers, 'sinking', 'lost', 'respawn', 'hop', 'turn-away', 'wave',
// 'highlight', and 'wargame-end' with the result); the scene's slow motion
// scales the arena's dt in tick() and only the arena's. research/engine-3.md
// §2 has every method as built.

import { createSim } from './sim/index.js'
import { createArena } from './arena/index.js'
import { BoxScene } from './scene/box.js'
import { Input } from './controls/input.js'
import { AIRCRAFT_HELP, SHIP_HELP, TOUCH_HELP, HINTS } from './controls/bindings.js'
import { poseToBox, poseToTable } from '../geo.js'

const log = (...a) => console.info('[battle]', ...a)

// the first hints' key in pt.hints and their lines: a gun or the sight has its own, on a touch screen too (whose
// stick lines are keyed by the kind)
const TOUCH_HINTS = { aa: 'touchGun', gunner: 'touchGun', bombardier: 'touchSight' }
function hintsFor(station, kind, touch) {
  if (touch) return TOUCH_HINTS[station] ? [station, HINTS[TOUCH_HINTS[station]]] : [kind, HINTS.touch]
  const key = HINTS[station] ? station : kind
  return [key, HINTS[key]]
}

const WATCH_SCALES = [1, 2, 4, 8, 15, 30, 60]
// ROUND-2 §3: the speed lists of a held unit
const AIR_SCALES = { assisted: [0.5, 1, 2], pilot: [1] }
const SHIP_SCALES = [1, 2, 4, 8]
const FLY_HOME = [4, 8, 16, 32] // after a bookmark's checkpoint an aircraft may fly home (R7 D11)
const ASSISTS = ['assisted', 'pilot']
// the camera each station looks through
const STATION_CAMERA = { helm: 'bridge', main: 'director', aa: 'gun', torpedoes: 'director', pilot: 'chase', gunner: 'gun', bombardier: 'bombsight' }
// round three: in a wargame the helm and the torpedoes look from the ship's high chase (the arena's captain fires from the helm)
const WARGAME_CAMERA = { ...STATION_CAMERA, helm: 'chase', torpedoes: 'chase' }
const cameraFor = (battle, station) => (battle.arena ? WARGAME_CAMERA : STATION_CAMERA)[station]

export class Battle {
  constructor(app) {
    this.app = app
    this.ready = false
    this.scene = null
    this.sim = null
    this.running = false
    this.timeScale = 1
    this.loaded = null
    this.input = null
    this.momentId = null
    this.aid = 'standard'
    this._state = null
    this._moment = null
    this._take = null
    this._question = null
    this._keys = new AbortController()
    this._assist = 'assisted'
    this.selected = null
    // round three (ROUND-3 §4): the wargame's arena and its scenario, or null
    this.arena = null
    this.wargame = null
    this._evIndex = 0
  }

  get state() {
    if (!this._state) return null
    const pl = this.sim?.player
    return {
      ...this._state,
      t: this.sim ? this.sim.t : this._state.t,
      mode: this.input ? 'moment' : 'watch',
      momentId: this.momentId ?? this._state.momentId,
      selected: this.selected,
      station: pl?.station ?? null,
      held: pl ? { index: pl.unitIndex, id: this.sim.slots[pl.unitIndex].id, kind: pl.kind, engaged: pl.engaged, role: pl.role } : null,
      assist: this._assist,
      sortie: this.sim?.sortie ?? null,
      wargame: this.wargame ? { id: this.wargame.id, side: this.wargame.side, games: this.wargame.games, result: this.arena?.result ?? null, t: this.arena?.t ?? 0 } : null,
    }
  }

  // --- round two: the settings, the bookmarks and the first door (ROUND-2 §4) ------------------------------

  /** 'assisted' (the default) or 'pilot'; App persists it. A held aircraft's speed list follows it. */
  get assist() {
    return this._assist
  }

  set assist(v) {
    if (!ASSISTS.includes(v)) throw new Error(`assist “${v}”: one of ${ASSISTS.join(', ')}`)
    this._assist = v
    if (this.sim) this.sim.assist = v
    if (this.input && this.sim?.player?.kind === 'aircraft') {
      const list = this.speeds
      if (!list.includes(this.timeScale)) this.timeScale = v === 'assisted' && this.sim.player && !this.sim.momentState ? 0.5 : list.reduce((a, b) => (Math.abs(b - this.timeScale) < Math.abs(a - this.timeScale) ? b : a), list[0])
    }
    this.scene?.hud?.say(v === 'assisted' ? 'Assisted flight' : 'Pilot', 1.5)
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'assist', assist: v } }))
  }

  /** The moments as the bar's marks: { id, title, t, label, role, kind, station, objective, durationS, timeScale }. */
  get bookmarks() {
    const sim = this.sim
    if (!sim) return []
    return [...sim.record.moments.values()].map((m) => ({
      id: m.id,
      title: m.title,
      t: m.t,
      label: sim.clock.label(m.t, { seconds: m.t % 60 !== 0 }),
      role: m.role,
      kind: m.role?.kind ?? null,
      station: m.role?.kind === 'aircraft' ? 'pilot' : m.objective?.kind === 'gunnery' ? 'main' : m.objective?.kind === 'torpedo' ? 'torpedoes' : 'helm',
      objective: m.objective?.kind ?? null,
      durationS: m.durationS ?? null,
      timeScale: m.timeScale ?? null,
    }))
  }

  /** The battle file's first door (ROUND-2 §7: { role, t, title, text }), or null. */
  get firstDoor() {
    if (this.arena) return null
    const fd = this.loaded?.battle?.firstDoor
    if (!fd) return null
    const sim = this.sim
    let at = null
    try {
      at = sim && fd.t != null ? sim.clock.parse(fd.t) : null
    } catch {
      at = null
    }
    return { ...fd, at }
  }

  /** The speeds the bar offers now: watching 1× to 60×; a held aircraft ×0.5, ×1, ×2 (Assisted) or ×1 (Pilot); a ship 1× to 8× (a bookmark's own list). */
  get speeds() {
    // (a wargame runs at 1×, paused or not: the compression does the pacing, ROUND-3 §1)
    if (this.arena) return [1]
    const sim = this.sim
    const pl = sim?.player
    if (!this.input || !pl) return WATCH_SCALES
    const ms = sim.momentState
    if (pl.kind === 'aircraft') {
      const base = AIR_SCALES[this._assist] || AIR_SCALES.assisted
      return ms && ms.checkpoint ? [...base, ...FLY_HOME] : base
    }
    if (ms && !ms.done) return [ms.timeScale, ms.timeScale * 2, 4, 8, 16, 32].filter((v, i, a) => v >= ms.timeScale && v <= ms.maxTimeScale && a.indexOf(v) === i).sort((a, b) => a - b)
    return SHIP_SCALES
  }

  /** The scale a held unit runs at by default (the threat drop-back returns to it). */
  baseScale() {
    if (this.arena) return 1
    const sim = this.sim
    const pl = sim?.player
    if (!pl) return 1
    if (pl.kind === 'aircraft') return this._assist === 'assisted' ? 0.5 : 1
    return sim.momentState && !sim.momentState.done ? sim.momentState.timeScale : 1
  }

  // --- round two: select, take, station, release (ROUND-2 §4) --------------------------------------------------

  /** Mark a unit (or none): the bracket, the orbit following it (while watching). Selecting never changes the sim. */
  select(index, { follow = true } = {}) {
    const sim = this.sim
    if (!sim) return null
    const i = index == null || index < 0 || index >= sim.capacity || !sim.state.alive[index] ? null : index
    this.selected = i
    this.scene?.select(i)
    if (follow && i != null && !this.input && this.scene) this.scene.setCamera('orbit', { unitIndex: i })
    const row = i == null ? null : sim.units().find((r) => r.index === i) ?? null
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'select', index: i, unit: row } }))
    return row
  }

  /**
   * Take a unit at a station (ROUND-2 §4): { unit } for a ship (its id), {
   * group } or { group, index } for an aircraft, station, and t (a time to go
   * to first; a changed box goes back to the record there). Throws the
   * reason when the unit cannot be taken (sim.takeControl). Resolves with {
   * sortie, score, outcome, reason } when the sortie ends.
   */
  take(role = {}, { scripted = false } = {}) {
    if (this.arena) return this.takeInWargame(role, { scripted })
    let sim = this.sim
    if (!sim) throw new Error('take() comes after enter()')
    const { t = null, ...r } = role
    if (this.input) this.release()
    if (t != null) {
      const tt = sim.clock.clamp(sim.clock.parse(t))
      if (Math.abs(tt - sim.t) > 0.5) {
        if (!sim.diverged || tt > sim.t) sim.setTime(tt)
        else sim = this.rebuild(tt)
      }
    }
    const pl = sim.takeControl(r)
    pl.scripted = scripted
    this.momentId = null
    this._checkpointSeen = false
    this.timeScale = pl.kind === 'aircraft' && this._assist === 'assisted' ? 0.5 : 1
    this.bindPlayer(pl, { scripted })
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'take', role: pl.role, index: pl.unitIndex, station: pl.station } }))
    log('take', sim.slots[pl.unitIndex].id, pl.station, sim.clock.label(sim.t), pl.engaged ? 'engaged' : 'soft')
    return new Promise((resolve) => {
      this._take = { resolve, role: pl.role }
    })
  }

  /** The camera, the controls, the HUD and the mode for a unit just taken. */
  bindPlayer(pl, { scripted = false, cameraMode = null, zoom = 1 } = {}) {
    const app = this.app
    const sc = this.scene
    this.select(pl.unitIndex, { follow: false })
    sc?.setCamera(cameraMode || cameraFor(this, pl.station) || (pl.kind === 'aircraft' ? 'chase' : 'bridge'), { unitIndex: pl.unitIndex, zoom })
    // (the mode first: Input builds the touch controls only for a live take)
    app.setMode('moment')
    this.input?.dispose()
    this.input = new Input(app, this)
    if (!scripted && pl.kind === 'aircraft' && pl.station === 'pilot') this.input.requestLock()
    this.running = true
    const touch = matchMedia?.('(pointer: coarse)')?.matches
    if (sc) {
      sc.hud.showKeys(touch ? TOUCH_HELP : pl.kind === 'aircraft' ? AIRCRAFT_HELP : SHIP_HELP, 3)
      sc.hud.setStations(pl)
      if (!scripted) sc.hud.firstHints(...(this.arena ? (touch ? ['wargame-touch', HINTS['wargame-touch']] : [`wargame-${pl.kind}`, HINTS[`wargame-${pl.kind}`]]) : hintsFor(pl.station, pl.kind, touch)))
    }
    if (touch && this.aid === 'standard') this.setAid('guided')
  }

  /** Switch the held unit's station (Tab, or the bar). */
  setStation(name) {
    const sim = this.sim
    const pl = sim?.player
    if (!pl) throw new Error('setStation: nobody holds a unit')
    sim.setStation(name)
    const sc = this.scene
    sc?.setCamera(cameraFor(this, name) || 'chase', { unitIndex: pl.unitIndex })
    this.input?.onStation?.(name)
    sc?.hud.setStations(pl)
    sc?.hud.say(STATION_WORDS[name] ?? name, 1.5)
    // (the station left takes its hints with it; a gun station or the sight shows its own the first time it is manned)
    if (sc && !pl.scripted) {
      sc.hud.clearHints()
      const touch = matchMedia?.('(pointer: coarse)')?.matches
      // (a touch screen's stick lines were shown at the take; a gun or the sight has its own, once)
      if (!touch || TOUCH_HINTS[name]) sc.hud.firstHints(...hintsFor(name, pl.kind, touch))
    }
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'station', station: name, index: pl.unitIndex } }))
    return name
  }

  /** The next (or previous) station of the held unit. */
  cycleStation(dir = 1) {
    const pl = this.sim?.player
    if (!pl || pl.stations.length < 2) return null
    const k = pl.stations.indexOf(pl.station)
    return this.setStation(pl.stations[(k + dir + pl.stations.length) % pl.stations.length])
  }

  /**
   * Load a box and go into it. t: a battle-clock time (BattleClock.parse
   * rules), the box's first stop by default; momentId: offered on the
   * briefing (never taken without a click); from: 'table' (fly) or 'url'
   * (jump, no fly-down).
   */
  async enter(boxId, { t = null, momentId = null, from = 'table' } = {}) {
    const app = this.app
    const box = app.data.boxById.get(boxId)
    if (!box) throw new Error(`no box “${boxId}” in boxes/manifest.json`)
    if (this.scene) await this.leave()
    log('enter', boxId, { t, momentId, from })
    this.ready = false
    this.momentId = momentId
    const table = app.table && typeof app.table.flyTo === 'function' ? app.table : null
    const startPose = table ? table.rig.pose() : null
    let abortNow
    const aborted = new Promise((r) => (abortNow = r))
    this._abort = () => abortNow('aborted')
    // 1. the box's pack decoding in App's PackDecoder (or the decode a card started: app.prefetched), battle.json, the kits (and the weapons the kits name)
    const loading = (async () => {
      const loaded = await (app.takePrefetch?.(boxId) ?? app.data.loadBox(boxId, { decoder: app.decoder, warn: app.warn }))
      if (!app.data.kits.weapons) {
        try {
          const r = await fetch(app.data.abs('kits/weapons.json'))
          app.data.kits.weapons = r.ok ? await r.json() : []
          if (!r.ok) app.warn?.(`kits/weapons.json: HTTP ${r.status}; guns fly on the kits' own numbers`)
        } catch (err) {
          app.data.kits.weapons = []
          app.warn?.(`kits/weapons.json: ${err.message}`)
        }
      }
      this.loaded = loaded
      const { battle, kits, pack } = loaded
      if (!battle) throw new Error(`box ${boxId} has no battle.json`)
      // 2. the sim at t
      const sim = createSim(battle, kits, { seed: momentId ?? '', warn: app.warn, ground: pack, proj: box.proj, exaggeration: box.exaggeration, assist: this._assist })
      const t0 = t != null ? sim.clock.clamp(sim.clock.parse(t)) : battle.stops?.length ? sim.clock.clamp(sim.clock.parse(battle.stops[0].t)) : 0
      sim.setTime(t0)
      this.sim = sim
      // 3. the scene: terrain, sea, weather, the units' kits a few at a time
      const scene = new BoxScene(app)
      scene.battle = this
      scene.aid = this.aid
      await scene.load(box, battle, kits, { pack })
      await scene.setSim(sim)
      this.scene = scene
      this.ready = true
      return loaded
    })()
    // the table side: fly to the hand-over pose while the box loads (ENGINEERING §9 step 2)
    if (table && from === 'table') {
      app.setMode('flying')
      table.outline?.(boxId, true)
      const view = table.outlineView?.(boxId)
      if (view && (await Promise.race([table.flyTo(view, { duration: 2.5, ready: () => this.ready }), aborted])) === 'aborted') return this.abandon(boxId, loading, startPose)
    } else app.setMode('flying')
    if ((await Promise.race([loading, aborted])) === 'aborted') return this.abandon(boxId, loading, startPose)
    this._abort = null
    const scene = this.scene
    const sim = this.sim
    // the box side (step 3): cut through the haze, the box's rig at the matched pose (or the view of the stop at t)
    await app.cut(() => {
      app.setActive(scene)
      if (table && from === 'table') scene.rig.jump(poseToBox(table.rig.pose(), box.placement))
      else this.lookAtStop(this.stopAt(sim.t), { jump: true })
      app.resize?.()
    })
    app.setMode('watch')
    this.running = true
    this.timeScale = 1
    this._state = { boxId, t: sim.t, momentId, mode: 'watch' }
    this.bindWatchKeys()
    app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'enter', boxId } }))
    log('in', boxId, `${sim.clock.dateLabel(sim.t)} ${sim.clock.label(sim.t)}`, `${sim.capacity} slots`, scene.stats())
    return this.state
  }

  /** Esc while the table flies down (app.mode 'flying'): back to where the flight started, the box let go. */
  abort() {
    this._abort?.()
  }

  async abandon(boxId, loading, startPose) {
    const app = this.app
    this._abort = null
    log('abort', boxId)
    app.table?.outline?.(boxId, false)
    if (startPose && app.table) app.table.rig.flyTo({ target: startPose.target, distance: startPose.distance, yaw: startPose.yaw, pitch: startPose.pitch }, 1.4)
    app.setMode('table')
    // (the load finishes in its own time and is let go)
    loading.then(() => {
      if (this.scene && app.active !== this.scene) {
        this.scene.dispose()
        this.scene = null
        this.sim = null
        this.loaded = null
        this.ready = false
      }
    }, () => {})
    app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'abort', boxId } }))
    return null
  }

  /** The stop at or before t (the first if none is). */
  stopAt(t) {
    const stops = this.sim?.record.stops || []
    let best = stops[0] || null
    for (const s of stops) if (s.t <= t + 1e-6) best = s
    return best
  }

  /** Stage 0's preview(): the box is already drawn by enter(); kept so the tools written against the stub still run. */
  async preview() {
    if (!this.scene) throw new Error('preview() comes after enter()')
    if (this.app.active !== this.scene) await this.app.cut(() => this.app.setActive(this.scene))
    this.app.setMode(this.input ? 'moment' : 'watch')
    return this.scene
  }

  /** A stop's camera: { target: unit id | [lon, lat], bearingDeg, pitch, distanceM }. */
  lookAtStop(stop, { jump = false } = {}) {
    const scene = this.scene
    const sim = this.sim
    if (!scene) return
    let target = null
    let unitIndex = -1
    const cam = stop?.camera
    if (cam?.target != null) {
      if (typeof cam.target === 'string') {
        const r = sim.record.shipById.get(cam.target)
        if (r) {
          unitIndex = r.slot
          target = { x: sim.state.pos[3 * r.slot], z: sim.state.pos[3 * r.slot + 2] }
        }
      } else if (Array.isArray(cam.target)) {
        const [x, z] = sim.proj.toWorld(cam.target)
        target = { x, z }
      }
    }
    if (!target) {
      // the centre of what is afloat
      let n = 0
      let x = 0
      let z = 0
      for (let i = 0; i < sim.capacity; i++) {
        if (sim.state.alive[i] !== 1 || sim.slots[i].kind !== 'ship') continue
        x += sim.state.pos[3 * i]
        z += sim.state.pos[3 * i + 2]
        n++
      }
      target = n ? { x: x / n, z: z / n } : { x: 0, z: 0 }
    }
    const pose = { target, distance: cam?.distanceM ?? 9000, yaw: Math.PI - ((cam?.bearingDeg ?? 200) * Math.PI) / 180, pitch: cam?.pitch ?? 0.45 }
    if (jump) {
      scene.cameras.set('free')
      scene.rig.jump(pose)
    } else if (unitIndex >= 0) scene.setCamera('orbit', { unitIndex, bearing: cam?.bearingDeg, pitch: cam?.pitch, distance: cam?.distanceM })
    else scene.setCamera('free', { target, bearing: cam?.bearingDeg, pitch: cam?.pitch, distance: cam?.distanceM })
  }

  /** Called by the box scene once a frame: the sim advances by realDt × timeScale while running. */
  tick(realDt, simScale = 1) {
    const sim = this.sim
    if (!sim) return
    this.input?.update(realDt)
    if (!this.running) return
    if (this.arena) {
      // the arena's own clock: 1×, its dt scaled by the scene's slow motion only (ROUND-3 §4)
      sim.advance(Math.min(0.1, realDt) * this.timeScale * simScale)
      this.wargameTick()
      return
    }
    const ms = sim.momentState
    if (this.input && sim.player && (!ms || !ms.done)) {
      // a threat drops a compressed scale back to the held unit's own (R7 §4.1; ×0.5 for an aircraft in Assisted)
      const base = this.baseScale()
      if (sim.threat && this.timeScale > base) {
        this.timeScale = base
        this.scene?.hud.say(`${sim.threatWhy}: back to ×${base}`, 2)
      }
    }
    sim.advance(Math.min(0.1, realDt) * this.timeScale)
    if (this._take && this.input) {
      // a free take ends with the unit's fate (or when something else let go of it)
      const pl = sim.player
      if (!pl) this.finish('released')
      else if (sim.state.alive[pl.unitIndex] !== 1) this.finish(sim._score?.how ?? 'lost')
      else if (sim.t >= sim.clock.duration) this.finish('clock')
    }
    if (ms && this.input) {
      if (ms.checkpoint && !this._checkpointSeen) {
        this._checkpointSeen = true
        this.running = false
        this.scene?.hud.say('Checkpoint · Enter: keep going · Backspace twice: the card', 30)
        this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'checkpoint', momentId: ms.id } }))
      }
      if (ms.done) this.finish(ms.reason)
    }
    if (sim.t >= sim.clock.duration) this.running = false
  }

  watch() {
    if (this.input) this.release()
    this.app.setMode('watch')
    this.scene?.setCamera('free')
  }

  /**
   * Go to t. While the sim follows the record this is closed-form; once a
   * moment has changed the battle, a backward scrub asks (one HUD line)
   * whether to return to the record: answer 'yes' rebuilds the sim from
   * battle.json with the same seed and sets t, 'no' plays forward only.
   * stop: the stop being walked to, carried with the question so its Y
   * brings the stop's camera and card ('battle' event 'rebuilt').
   */
  scrub(t, { answer = null, stop = null } = {}) {
    const sim = this.sim
    if (!sim) return
    const tt = sim.clock.clamp(sim.clock.parse(t))
    if (!sim.diverged) {
      sim.setTime(tt)
      return true
    }
    if (answer === 'yes') {
      this.rebuild(tt)
      return true
    }
    if (answer === 'no') {
      if (tt > sim.t) sim.setTime(tt)
      return false
    }
    this._question = { t: tt, stop }
    this.scene?.hud.say('Return to the record at that time? Y: yes · N: play on', 20)
    return null
  }

  /** The sim rebuilt from the record (same seed), at t. */
  rebuild(t, seed = this.momentId ?? '') {
    const app = this.app
    const { battle, kits, pack, box } = this.loaded
    if (this.input) this.release()
    const sim = createSim(battle, kits, { seed, warn: app.warn, ground: pack, proj: box.proj, exaggeration: box.exaggeration, assist: this._assist })
    sim.setTime(t)
    this.sim = sim
    this.scene.setSim(sim)
    this.select(null)
    this.scene.hud.beatIndex = sim.beats.length
    return sim
  }

  play(timeScale = this.timeScale) {
    const max = this.input ? this.maxScale() : 60
    const min = this.input ? Math.min(...this.speeds) : 0.5
    this.timeScale = Math.max(min, Math.min(max, timeScale))
    this.running = true
  }

  pause() {
    this.running = false
  }

  maxScale() {
    // (a held unit's list: ROUND-2 §3; after a bookmark's checkpoint an aircraft may fly home at up to 32×, R7 D11)
    return Math.max(...this.speeds)
  }

  /** Z / + / −: the next time scale (a held unit's list; watching 1× to 60×). */
  cycleTime(dir = 1) {
    const list = this.speeds
    const i = list.findIndex((v) => v >= this.timeScale)
    const j = dir > 0 ? (i + 1) % list.length : (i - 1 + list.length) % list.length
    this.timeScale = list[Math.max(0, j)]
    this.scene?.hud.say(`×${this.timeScale}`, 1)
    return this.timeScale
  }

  cycleCamera() {
    const sc = this.scene
    const pl = this.sim?.player
    if (!sc) return
    const i = pl?.unitIndex ?? sc.cameras.unit
    const order = pl?.kind === 'ship' ? ['bridge', 'director', 'chase', 'orbit'] : ['chase', 'sight', 'orbit']
    const k = order.indexOf(sc.cameraMode)
    sc.setCamera(order[(k + 1) % order.length], { unitIndex: i, distance: pl?.kind === 'ship' ? 1500 : 300 })
  }

  toggleSight() {
    const sc = this.scene
    const pl = this.sim?.player
    if (!sc || !pl) return
    sc.setCamera(sc.cameraMode === 'sight' ? 'chase' : 'sight', { unitIndex: pl.unitIndex })
  }

  setAid(level) {
    this.aid = level
    if (this.sim) this.sim.aid = level
    if (this.scene) this.scene.aid = level
  }

  /**
   * Take a moment (from the click on "Take the controls"). A box the player
   * has already changed restarts from the record at the moment's t (R7 D10).
   * atCheckpoint: the sim already stands at the moment's checkpoint, on the
   * record (restart('checkpoint')), and the unit is handed over there.
   * Resolves with { score, outcome } when the sortie ends or finish() is called.
   */
  takeMoment(momentId, { scripted = false, atCheckpoint = false } = {}) {
    const app = this.app
    let sim = this.sim
    if (!sim) throw new Error('takeMoment() comes after enter()')
    const m = sim.record.moments.get(momentId)
    if (!m) throw new Error(`no moment “${momentId}” in this box`)
    if (this.input) this.release()
    this.momentId = momentId
    if (sim.diverged) sim = this.rebuild(m.t, momentId)
    else if (!atCheckpoint && sim.t !== m.t) sim.setTime(m.t)
    const pl = sim.startMoment(momentId, { atCheckpoint })
    pl.scripted = scripted
    // (from the checkpoint the sortie runs on: the checkpoint's pause is behind it)
    this._checkpointSeen = atCheckpoint
    const sc = this.scene
    const obj = m.objective?.kind
    const mode = pl.kind === 'aircraft' ? 'chase' : obj === 'gunnery' ? 'director' : 'bridge'
    this._take = null
    this.bindPlayer(pl, { scripted, cameraMode: mode, zoom: obj === 'gunnery' ? 4 : 1 })
    // (an aircraft bookmark in Assisted runs at half time, ROUND-2 §1.2)
    this.timeScale = pl.kind === 'aircraft' && this._assist === 'assisted' ? 0.5 : sim.momentState.timeScale
    if (m.objective?.text) sc.hud.say(m.objective.text, 5)
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'moment', momentId } }))
    log('moment', momentId, pl.kind, sim.slots[pl.unitIndex].name, sim.clock.label(sim.t))
    return new Promise((resolve) => {
      this._moment = { id: momentId, resolve }
    })
  }

  /** Past the checkpoint: the sortie runs on until it ends by the sim's rules. */
  keepGoing() {
    if (!this.sim?.momentState) return
    this.running = true
    this.scene?.hud.say('', 0)
  }

  /** The end of the sortie (or the card asked for): the promise resolves with the score and the outcome. */
  finish(reason = 'card') {
    const sim = this.sim
    const mo = this._moment || this._take
    if (!sim || !mo) return null
    this._moment = null
    this._take = null
    const result = { score: sim.score, outcome: sim.outcome, reason, momentId: mo.id ?? null, restart: mo.id ? sim.momentState?.restart ?? null : null, sortie: null }
    // (the kind before the controls go back: releasing them lets go of the player)
    const kind = sim.player?.kind ?? (mo.id ? sim.record.moments.get(mo.id)?.role?.kind : mo.role?.kind)
    if (this.input) this.releaseControls()
    else sim.releaseControl()
    result.sortie = sim.sortie
    this.scene?.hud.say(endLine(sim, reason, kind), 6)
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'after', ...result } }))
    // (ui-2's link opens its after-card on 'released' with the sortie: a release by Backspace or by the unit's fate has no caller to return to)
    if (result.sortie) this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'released', ...result } }))
    mo.resolve(result)
    return result
  }

  /** Back to watching at the current t; the sim keeps the diverged state until leave(). */
  release() {
    if (this.arena) return this.releaseInWargame()
    if (this._moment || this._take) return this.finish('released')
    this.releaseControls()
    return null
  }

  releaseControls() {
    const sim = this.sim
    const i = sim?.player?.unitIndex ?? -1
    this.input?.dispose()
    this.input = null
    sim?.releaseControl()
    this.app.setMode('watch')
    if (this.scene && i >= 0) this.scene.setCamera('orbit', { unitIndex: i, distance: 1500 })
    this.scene?.hud.setStations(null)
    this.scene?.hud.clearHints()
    if (this.timeScale < 1) this.timeScale = 1
    this.running = true
  }

  /** Losing pointer lock (Esc) pauses and offers release. */
  pauseForRelease() {
    this.running = false
    this.scene?.hud.say('Paused. Click to go on · Backspace twice releases the controls', 30)
    const c = this.app.canvas
    const go = () => {
      this.running = true
      this.scene?.hud.say('', 0)
      if (this.sim?.player?.kind === 'aircraft') this.input?.requestLock()
    }
    // (gone with the controls: a drag to look round after a release never starts the clock)
    c.addEventListener('pointerdown', go, { once: true, signal: this.input?.ac.signal })
  }

  /** A restart point: the moment's start or its checkpoint, from the record. */
  restart(which = 'start') {
    // round three: Battle.restart({ side }) plays the wargame again, the same side or the other
    if (this.arena) return this.restartWargame(typeof which === 'object' && which ? which : {})
    const m = this.sim?.record.moments.get(this.momentId)
    if (!m) return null
    if (this.input) this.releaseControls()
    this._moment = null
    const sim = this.rebuild(m.t, this.momentId)
    if (which === 'checkpoint') {
      // the rebuilt sim follows the record, so it stands at the checkpoint closed-form, and the unit is handed over there
      const ts = m.timeScale ?? (m.role?.kind === 'aircraft' ? 1 : 2)
      sim.setTime(m.t + (m.durationS ?? 180) * ts)
      return this.takeMoment(this.momentId, { atCheckpoint: true })
    }
    return this.takeMoment(this.momentId)
  }

  /** Watch-mode keys of the box's own (the answer to a scrub's question); the UI owns the rest. */
  bindWatchKeys() {
    this._keys.abort()
    this._keys = new AbortController()
    addEventListener(
      'keydown',
      (e) => {
        if (this.app.mode === 'moment' && e.code === 'Enter' && this.sim?.momentState?.checkpoint && !this.running) {
          e.preventDefault()
          this.keepGoing()
          return
        }
        if (this.app.mode === 'watch' && !this._question && this.sim && !inField(e)) {
          // ROUND-2 §4: Tab the next unit (Shift: the previous). L (the unit list) and Enter (the selection's card) are
          // src/link.js's, and Tab while a unit is held is the controls' (controls/input.js): one owner a key.
          if (e.code === 'Tab' && onCanvas(e)) {
            e.preventDefault()
            this.selectNext(e.shiftKey ? -1 : 1)
            return
          }
        }
        if (this.app.mode !== 'watch' || !this._question) return
        if (e.code === 'KeyY' || e.code === 'Enter') {
          const q = this._question
          this._question = null
          this.scrub(q.t, { answer: 'yes' })
          this.scene?.hud.say('', 0)
          this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'rebuilt', stop: q.stop } }))
        } else if (e.code === 'KeyN' || e.code === 'Escape') {
          this._question = null
          this.scene?.hud.say('', 0)
        }
      },
      { signal: this._keys.signal },
    )
  }

  /** Tab in watch: the next unit of the list that is afloat or in the air (ships first, in the record's order). */
  selectNext(dir = 1) {
    const sim = this.sim
    if (!sim) return null
    const rows = sim.units().filter((r) => r.alive === 1 && !(r.kind === 'aircraft' && r.state?.parked))
    if (!rows.length) return null
    const k = rows.findIndex((r) => r.index === this.selected)
    const row = rows[(k + dir + rows.length) % rows.length] ?? rows[0]
    this.select(row.index, { follow: false })
    this.scene?.setCamera('orbit', { unitIndex: row.index, distance: row.kind === 'ship' ? 2500 : 600 })
    return row
  }

  // --- round three: the wargame (ROUND-3.md §4) ---------------------------------------------------------------

  /** A scenario (public/data/wargames/<id>.json, read through app.data.abs), cached for the page. */
  async loadScenario(id) {
    const app = this.app
    app.data.wargames ||= new Map()
    if (app.data.wargames.has(id)) return app.data.wargames.get(id)
    // (a test may hand the page a scenario of its own: tools/smoke-arena.mjs, the dev page's look at a scenario not yet in the data)
    const given = globalThis.__wargameScenarios?.[id]
    if (given) {
      app.data.wargames.set(id, given)
      return given
    }
    const r = await fetch(app.data.abs(`wargames/${id}.json`))
    if (!r.ok) throw new Error(`wargames/${id}.json: HTTP ${r.status}`)
    const sc = await r.json()
    app.data.wargames.set(id, sc)
    return sc
  }

  /**
   * Enter a battle as a wargame (ROUND-3 §4): load the box and the scenario,
   * build the arena for the side, cut to the side's first unit and run.
   * side: 'jp' | 'us' (or 'japan' | 'usa'); from: 'table' (the fly-down) or
   * 'url' (a cut); seed: the game's (the restarts count on from it).
   */
  async enterWargame(scenarioId, { side = 'us', from = 'table', seed = null } = {}) {
    const app = this.app
    const scenario = await this.loadScenario(scenarioId)
    const boxId = scenario.box
    const box = app.data.boxById.get(boxId)
    if (!box) throw new Error(`wargame ${scenarioId}: no box “${boxId}” in boxes/manifest.json`)
    if (this.scene) await this.leave()
    side = side === 'japan' ? 'jp' : side === 'usa' ? 'us' : side
    log('wargame', scenarioId, side, { from })
    this.ready = false
    this.momentId = null
    const table = app.table && typeof app.table.flyTo === 'function' ? app.table : null
    const loading = (async () => {
      const loaded = await (app.takePrefetch?.(boxId) ?? app.data.loadBox(boxId, { decoder: app.decoder, warn: app.warn }))
      if (!app.data.kits.weapons) {
        try {
          const r = await fetch(app.data.abs('kits/weapons.json'))
          app.data.kits.weapons = r.ok ? await r.json() : []
        } catch {
          app.data.kits.weapons = []
        }
      }
      this.loaded = loaded
      const { battle, kits, pack } = loaded
      const games = 1
      const arena = createArena(scenario, kits, { battle, pack, box }, { side, seed: `${seed ?? ''}:${games}`, warn: app.warn })
      const scene = new BoxScene(app)
      scene.battle = this
      // (the HUD's clock line names the wargame, not the box's zone)
      await scene.load(box, { ...battle, clock: { ...battle.clock, name: scenario.title ?? battle.clock?.name } }, kits, { pack })
      await scene.setSim(arena)
      this.sim = arena
      this.arena = arena
      this.wargame = { id: scenarioId, side, scenario, seed, games }
      this._evIndex = 0
      this.scene = scene
      this.ready = true
      return loaded
    })()
    if (table && from === 'table') {
      app.setMode('flying')
      table.outline?.(boxId, true)
      const view = table.outlineView?.(boxId)
      if (view) await table.flyTo(view, { duration: 2.5, ready: () => this.ready })
    } else app.setMode('flying')
    await loading
    const scene = this.scene
    const arena = this.arena
    await app.cut(() => {
      app.setActive(scene)
      if (table && from === 'table') scene.rig.jump(poseToBox(table.rig.pose(), box.placement))
      else scene.rig.jump({ target: { x: arena.centre.x, z: arena.centre.z }, distance: 7000, yaw: Math.PI - (200 * Math.PI) / 180, pitch: 0.5 })
      app.resize?.()
    })
    app.setMode('watch')
    this.running = true
    this.timeScale = 1
    this._state = { boxId, t: 0, momentId: null, mode: 'watch' }
    this.bindWatchKeys()
    this.setAid('guided')
    this.startWargame()
    app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'wargame', phase: 'start', id: scenarioId, side } }))
    log('in', scenarioId, side, `${arena.capacity} slots`, scene.stats())
    return this.state
  }

  /** The side's first unit taken at once: a cut, no briefing (ROUND-3 §1). */
  startWargame() {
    const arena = this.arena
    const first = arena?.first
    if (!first) return null
    const pl = arena.takeControl(first)
    this.bindPlayer(pl)
    this._evIndex = arena.events.length
    this.scene?.hud.say(arena.sides[arena.side].def.goal?.text ?? '', 5)
    return pl
  }

  /** Once a tick in a wargame: the arena's events to the page, the camera kept on the player's unit, the end. */
  wargameTick() {
    const arena = this.arena
    const ev = this.app.events
    while (this._evIndex < arena.events.length) {
      const e = arena.events[this._evIndex++]
      // (the hit markers stay in arena.events, where the HUD layer reads them: not sent to the page a second time)
      if (e.marker) continue
      if (e.kind === 'hop' && (e.how === 'respawn' || e.how === 'hop')) this.rebindPlayer()
      if (e.kind === 'end') this.endWargame(e.result)
      ev?.dispatchEvent(new CustomEvent('battle', { detail: { ...e, kind: e.kind === 'end' ? 'wargame-end' : e.kind, wargame: true } }))
    }
  }

  /** The held unit changed under the controls (a hop, a respawn): the camera, the selection, the station bar. */
  rebindPlayer() {
    const pl = this.arena?.player
    if (!pl) return
    if (!this.input) return this.bindPlayer(pl)
    this.select(pl.unitIndex, { follow: false })
    this.scene?.setCamera(cameraFor(this, pl.station) || (pl.kind === 'aircraft' ? 'chase' : 'bridge'), { unitIndex: pl.unitIndex, zoom: 1 })
    this.input.onStation?.(pl.station)
    this.scene?.hud.setStations(pl)
  }

  /**
   * A hop (ROUND-3 §1): 'carrier' | 'capital' | 'destroyer' | 'aircraft'
   * (1–4: the nearest friendly one) | 'next' | 'prev' (Tab: the next of the
   * same kind) | a slot. Returns the unit's row, or null when nothing matches.
   */
  hop(kind) {
    const arena = this.arena
    if (!arena || arena.result) return null
    const pl = arena.hop(kind)
    if (!pl) {
      this.scene?.hud.say('None to go to', 1.2)
      return null
    }
    if (!this.input) this.bindPlayer(pl)
    else this.rebindPlayer()
    this._evIndex = arena.events.length
    const row = arena.units().find((r) => r.index === pl.unitIndex) ?? null
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'hop', how: 'hop', index: pl.unitIndex, unit: row, hop: kind, wargame: true } }))
    return row
  }

  /** take() in a wargame: possession at a station; resolves at the release, the next take or the end with { sortie, reason, result }. */
  takeInWargame(role, { scripted = false } = {}) {
    const arena = this.arena
    const pl = arena.takeControl(role)
    pl.scripted = scripted
    if (!this.input) this.bindPlayer(pl, { scripted })
    else this.rebindPlayer()
    this._evIndex = arena.events.length
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'take', role: pl.role, index: pl.unitIndex, station: pl.station, wargame: true } }))
    this._wtake?.resolve({ sortie: arena._lastSortie, reason: 'hop', result: null })
    return new Promise((resolve) => {
      this._wtake = { resolve }
    })
  }

  /** release() in a wargame: the unit goes back to its AI and the box to watching (no after-card: the end card is the wargame's). */
  releaseInWargame() {
    const arena = this.arena
    const sortie = arena.releaseControl()
    if (this.input) this.releaseControls()
    this._wtake?.resolve({ sortie, reason: 'released', result: arena.result })
    this._wtake = null
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'wargame-release', sortie, wargame: true } }))
    return sortie
  }

  /** The end (the clock, the goals, or forced): the controls let go, the camera round the last unit; the UI opens its end card on 'wargame-end'. */
  endWargame(result) {
    const arena = this.arena
    const i = arena.player?.unitIndex ?? -1
    if (this.input) {
      this.input.dispose()
      this.input = null
    }
    this.app.setMode('watch')
    this.scene?.hud.setStations(null)
    this.scene?.hud.clearHints()
    if (this.scene && i >= 0 && this.sim.state.alive[i]) this.scene.setCamera('orbit', { unitIndex: i, distance: 2500 })
    this._wtake?.resolve({ sortie: arena.sortie, reason: 'end', result })
    this._wtake = null
    log('wargame end', this.wargame?.id, result.reason, result.line)
  }

  /** Force the end now (the smoke test; Back to the table): the result. */
  endNow(reason = 'forced') {
    const r = this.arena?.forceEnd(reason) ?? null
    if (r) this.wargameTick()
    return r
  }

  /** Play again (ROUND-3 §4): a fresh arena on the same box and scene, the same side or { side }, the next seed. */
  restartWargame({ side = null } = {}) {
    const app = this.app
    const w = this.wargame
    if (!w) return null
    side = side === 'japan' ? 'jp' : side === 'usa' ? 'us' : side ?? w.side
    if (this.input) {
      this.input.dispose()
      this.input = null
    }
    this._wtake?.resolve({ sortie: this.arena?.sortie ?? null, reason: 'restart', result: this.arena?.result ?? null })
    this._wtake = null
    const { battle, kits, pack, box } = this.loaded
    w.games++
    w.side = side
    const arena = createArena(w.scenario, kits, { battle, pack, box }, { side, seed: `${w.seed ?? ''}:${w.games}`, warn: app.warn })
    this.sim = arena
    this.arena = arena
    this._evIndex = 0
    this.selected = null
    this.scene.setSim(arena)
    this.scene.hud.beatIndex = 0
    this.running = true
    this.timeScale = 1
    app.setMode('watch')
    this.startWargame()
    app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'wargame', phase: 'restart', id: w.id, side } }))
    return this.state
  }

  /** Back to the table at the battle's date; the box is forgotten. */
  async leave() {
    const app = this.app
    const id = this._state?.boxId ?? this.loaded?.box.id
    log('leave', id)
    if (this.arena) {
      this._wtake?.resolve({ sortie: this.arena.releaseControl(), reason: 'left', result: this.arena.result })
      this._wtake = null
    }
    if (this._moment || this._take) this.finish('left')
    if (this.input) this.releaseControls()
    const s = this.scene
    const table = app.table && app.table.rig ? app.table : null
    if (s) {
      const pl = this.loaded?.box.placement
      app.setMode('flying')
      // (step 4) the box's rig flies up to the hand-over pose first, so the table takes over where it let go
      if (table && pl && id && table.outlineView) {
        s.setCamera('free')
        const up = poseToBox(table.outlineView(id), pl)
        await Promise.race([
          new Promise((r) => s.rig.flyTo(up, 2.2, { onDone: r })),
          new Promise((r) => setTimeout(r, 3500)),
        ])
        s.rig.finishFlight?.()
      }
      await app.cut(() => {
        if (table) {
          if (pl) app.table.rig.jump(poseToTable(s.rig.pose(), pl))
          app.setActive(app.table)
        } else if (app.idle) app.setActive(app.idle)
      })
      if (app.active === s) s.scene.remove(app.sky.group)
      s.dispose()
      this.scene = null
    }
    if (id) table?.outline?.(id, false)
    this._keys.abort()
    this.selected = null
    this.sim = null
    this._state = null
    this.loaded = null
    this.ready = false
    this.running = false
    this.momentId = null
    this.arena = null
    this.wargame = null
    app.setMode('table')
    app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'leave', boxId: id } }))
  }
}

const STATION_WORDS = { helm: 'Helm', main: 'Main battery', aa: 'Anti-aircraft', torpedoes: 'Torpedoes', pilot: 'Pilot', gunner: 'Gunner', bombardier: 'Bombardier' }
/** Whether a key went to a field of the page (a list's filter, a button) rather than the box. */
const inField = (e) => {
  const el = e.target
  return !!el && el !== document.body && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON|A)$/.test(el.tagName) || !!el.closest?.('[role="dialog"], [role="listbox"], .card, .unitlist'))
}
const onCanvas = (e) => !inField(e)

/** The line the end of a sortie leaves on the screen (the card's is the UI's). */
function endLine(sim, reason, kind) {
  const sc = sim.score
  const hits = sc.hits.filter((h) => h.kind !== 'near-miss').map((h) => `${h.name}: ${h.count} ${h.kind} hit${h.count > 1 ? 's' : ''}`)
  // (the rule's words: an aircraft did not return, a ship was lost; R8 §3.6)
  const how = { lost: kind === 'ship' ? 'The ship was lost.' : 'Did not return.', landed: 'Landed.', ditched: 'Ditched.', clock: 'The battle clock has run out.', released: '', left: '', card: '' }[reason] ?? ''
  return [how, hits.join(' · ')].filter(Boolean).join(' ') || 'The sortie is over.'
}
