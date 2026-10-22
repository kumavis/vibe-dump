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

import { createSim } from './sim/index.js'
import { BoxScene } from './scene/box.js'
import { Input } from './controls/input.js'
import { AIRCRAFT_HELP, SHIP_HELP, TOUCH_HELP } from './controls/bindings.js'
import { poseToBox, poseToTable } from '../geo.js'

const log = (...a) => console.info('[battle]', ...a)
const WATCH_SCALES = [1, 2, 4, 8, 15, 30, 60]

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
    this._question = null
    this._keys = new AbortController()
  }

  get state() {
    if (!this._state) return null
    return { ...this._state, t: this.sim ? this.sim.t : this._state.t, mode: this.input ? 'moment' : 'watch', momentId: this.momentId ?? this._state.momentId }
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
      const sim = createSim(battle, kits, { seed: momentId ?? '', warn: app.warn, ground: pack, proj: box.proj, exaggeration: box.exaggeration })
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
        if (sim.state.alive[i] !== 1 || sim.units[i].kind !== 'ship') continue
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
  tick(realDt) {
    const sim = this.sim
    if (!sim) return
    this.input?.update(realDt)
    if (!this.running) return
    const ms = sim.momentState
    if (ms && !ms.done && this.input) {
      // a threat drops a compressed scale back to the moment's own (R7 §4.1)
      if (sim.threat && this.timeScale > ms.timeScale) {
        this.timeScale = ms.timeScale
        this.scene?.hud.say(`${sim.threatWhy}: back to ×${ms.timeScale}`, 2)
      }
    }
    sim.advance(Math.min(0.1, realDt) * this.timeScale)
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
   */
  scrub(t, { answer = null } = {}) {
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
    this._question = { t: tt }
    this.scene?.hud.say('Return to the record at that time? Y: yes · N: play on', 20)
    return null
  }

  /** The sim rebuilt from the record (same seed), at t. */
  rebuild(t, seed = this.momentId ?? '') {
    const app = this.app
    const { battle, kits, pack, box } = this.loaded
    if (this.input) this.release()
    const sim = createSim(battle, kits, { seed, warn: app.warn, ground: pack, proj: box.proj, exaggeration: box.exaggeration })
    sim.setTime(t)
    this.sim = sim
    this.scene.setSim(sim)
    this.scene.hud.beatIndex = sim.beats.length
    return sim
  }

  play(timeScale = this.timeScale) {
    const ms = this.sim?.momentState
    const max = this.input && ms && !ms.done ? this.maxScale() : 60
    this.timeScale = Math.max(1, Math.min(max, timeScale))
    this.running = true
  }

  pause() {
    this.running = false
  }

  maxScale() {
    const ms = this.sim?.momentState
    if (!ms) return 60
    const air = this.sim.player?.kind === 'aircraft'
    // after the checkpoint an aircraft may fly home at up to 32× (R7 D11)
    return air && ms.checkpoint ? 32 : ms.maxTimeScale
  }

  /** Z / + / −: the next time scale (a moment's within its bounds; watching 1× to 60×). */
  cycleTime(dir = 1) {
    const ms = this.sim?.momentState
    const list = this.input && ms ? [ms.timeScale, ms.timeScale * 2, 4, 8, 16, 32].filter((v, i, a) => v >= ms.timeScale && v <= this.maxScale() && a.indexOf(v) === i).sort((a, b) => a - b) : WATCH_SCALES
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
    sc.setCamera(mode, { unitIndex: pl.unitIndex, zoom: obj === 'gunnery' ? 4 : 1 })
    this.input = new Input(app, this)
    if (!scripted && pl.kind === 'aircraft') this.input.requestLock()
    app.setMode('moment')
    this.timeScale = sim.momentState.timeScale
    this.running = true
    const touch = matchMedia?.('(pointer: coarse)')?.matches
    sc.hud.showKeys(touch ? TOUCH_HELP : pl.kind === 'aircraft' ? AIRCRAFT_HELP : SHIP_HELP, 3)
    if (m.objective?.text) sc.hud.say(m.objective.text, 5)
    if (touch && this.aid === 'standard') this.setAid('guided')
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'moment', momentId } }))
    log('moment', momentId, pl.kind, sim.units[pl.unitIndex].name, sim.clock.label(sim.t))
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
    const mo = this._moment
    if (!sim || !mo) return null
    this._moment = null
    const result = { score: sim.score, outcome: sim.outcome, reason, momentId: mo.id, restart: sim.momentState?.restart ?? null }
    if (this.input) this.releaseControls()
    this.scene?.hud.say(endLine(sim, reason), 6)
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'after', ...result } }))
    mo.resolve(result)
    return result
  }

  /** Back to watching at the current t; the sim keeps the diverged state until leave(). */
  release() {
    if (this._moment) return this.finish('released')
    this.releaseControls()
  }

  releaseControls() {
    const sim = this.sim
    const i = sim?.player?.unitIndex ?? -1
    this.input?.dispose()
    this.input = null
    sim?.releaseControl()
    this.app.setMode('watch')
    if (this.scene && i >= 0) this.scene.setCamera('orbit', { unitIndex: i, distance: 1500 })
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
    c.addEventListener('pointerdown', go, { once: true })
  }

  /** A restart point: the moment's start or its checkpoint, from the record. */
  restart(which = 'start') {
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
        if (this.app.mode !== 'watch' || !this._question) return
        if (e.code === 'KeyY' || e.code === 'Enter') {
          const q = this._question
          this._question = null
          this.scrub(q.t, { answer: 'yes' })
          this.scene?.hud.say('', 0)
        } else if (e.code === 'KeyN' || e.code === 'Escape') {
          this._question = null
          this.scene?.hud.say('', 0)
        }
      },
      { signal: this._keys.signal },
    )
  }

  /** Back to the table at the battle's date; the box is forgotten. */
  async leave() {
    const app = this.app
    const id = this._state?.boxId ?? this.loaded?.box.id
    log('leave', id)
    if (this._moment) this.finish('left')
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
    this.sim = null
    this._state = null
    this.loaded = null
    this.ready = false
    this.running = false
    this.momentId = null
    app.setMode('table')
    app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'leave', boxId: id } }))
  }
}

/** The line the end of a sortie leaves on the screen (the card's is the UI's). */
function endLine(sim, reason) {
  const sc = sim.score
  const hits = sc.hits.filter((h) => h.kind !== 'near-miss').map((h) => `${h.name}: ${h.count} ${h.kind} hit${h.count > 1 ? 's' : ''}`)
  const how = { lost: 'Lost.', landed: 'Landed.', ditched: 'Ditched.', clock: 'The battle clock has run out.', released: '', left: '', card: '' }[reason] ?? ''
  return [how, hits.join(' · ')].filter(Boolean).join(' ') || 'The sortie is over.'
}
