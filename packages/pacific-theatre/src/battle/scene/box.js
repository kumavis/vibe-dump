// The box scene (ENGINEERING.md §7): a battle box drawn in metres. The
// terrain over the box's pack (BoxGround), the sea with the record's wind and
// sea state, the weather (cloud puffs at the base, squalls, the haze), the
// dated sky through App's one Sky at the box's place and the battle clock's
// instant, the units and the effects from the sim's typed arrays, the
// cameras and the HUD. It is App's active scene while a box is entered:
// scene, camera, rig, skyPlace, skyInstant(), update(), fog(), settle(),
// setRange(), stats().
//
// Round three (ROUND-3.md §4), for the wargame's arena (sim.arena): shake
// (amount) jolts the camera on a hit taken or a near miss and dies away;
// slowmo(seconds) runs the arena at a quarter of its pace for that long (the
// arena's dt only: Battle.tick's simScale, never the record's sim); the
// sinking animation lists, trims and settles a ship over the twenty seconds
// the arena gives her (UnitRenderer's pose hook, from the arena's damage
// state); snapshot() is a 320 × 200 JPEG of the canvas, at most six a game,
// taken by itself on the arena's highlights. Each is driven by the arena's
// own requests (sim.shake, sim.slowmo, sim.highlights).

import * as THREE from 'three'
import { BOX } from '../../config.js'
import { BattleClock } from '../../time.js'
import { CameraRig } from '../../render/camera.js'
import { Ocean } from '../../render/ocean.js'
import { BoxGround } from './terrain.js'
import { UnitRenderer } from './units.js'
import { EffectsRenderer } from './effects.js'
import { Weather } from './weather.js'
import { Cameras } from './cameras.js'
import { Hud } from './hud.js'
import { Picker } from './pick.js'
import { insigniaAtlas } from '../kits/index.js'

const DEG = Math.PI / 180
const _q = new THREE.Quaternion()
const _e = new THREE.Euler()

const tick = () => new Promise((r) => setTimeout(r, 0))

export class BoxScene {
  constructor(app) {
    this.app = app
    this.name = 'box'
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(42, innerWidth / Math.max(1, innerHeight), BOX.near, BOX.far)
    this.ready = false
    this.sim = null
    this.battle = null
    this.ground = null
    this.rig = null
    this.hud = null
    this.aid = 'standard'
    this.time = 0
    this.lowQuality = !!app.software || matchMedia?.('(pointer: coarse)')?.matches
    this.selected = null // ROUND-2 §4: the selected unit's slot (a bracket on it), or null
    // round three: the camera's shake, the slow motion, the snapshots
    this.shakeAmp = 0
    this.slowUntil = -1
    this.slowFrom = -1
    this.snapshots = 0
    this._shakeSeq = 0
    this._slowSeq = 0
    this._hiIndex = 0
    this._lastSnapT = -1e9
    this._snapQueue = []
    this._shaken = null
  }

  /** Jolt the camera (0..1): the strongest request wins, and it dies away in about a third of a second. */
  shake(amount = 0.3) {
    this.shakeAmp = Math.max(this.shakeAmp, Math.min(1, amount))
  }

  /** Slow the arena to a quarter of its pace for `seconds` of the screen's time (eased in and out). */
  slowmo(seconds = 1) {
    this.slowFrom = this.time
    this.slowUntil = this.time + seconds
  }

  /** The factor on the arena's dt now: 1, or down to 0.25 inside a slow motion. */
  slowFactor() {
    if (this.time >= this.slowUntil) return 1
    const span = this.slowUntil - this.slowFrom
    const u = (this.time - this.slowFrom) / Math.max(1e-3, span)
    const edge = Math.min(1, u / 0.15, (1 - u) / 0.2)
    return 1 - 0.75 * Math.max(0, Math.min(1, edge))
  }

  /**
   * A 320 × 200 JPEG data URL of the canvas, taken just after the next frame is
   * drawn (a promise); null once six have been taken this game.
   */
  snapshot() {
    if (this.snapshots >= 6) return Promise.resolve(null)
    this.snapshots++
    return new Promise((resolve) => this._snapQueue.push(resolve))
  }

  /** Draw the canvas into a 320 × 200 JPEG (called in the frame's task, after the render). */
  _grab() {
    const src = this.app.renderer?.domElement
    if (!src) return null
    try {
      const c = this._snapCanvas || (this._snapCanvas = document.createElement('canvas'))
      c.width = 320
      c.height = 200
      const g = c.getContext('2d')
      // the canvas's middle at 16:10, scaled down
      const W = src.width
      const H = src.height
      const k = Math.min(W / 320, H / 200)
      const sw = 320 * k
      const sh = 200 * k
      g.drawImage(src, (W - sw) / 2, (H - sh) / 2, sw, sh, 0, 0, 320, 200)
      return c.toDataURL('image/jpeg', 0.82)
    } catch {
      return null
    }
  }

  /** The arena's requests: the shake, the slow motion, a snapshot on each highlight worth one (six at most, four seconds apart). */
  arenaRequests() {
    const sim = this.sim
    if (sim.shake.seq !== this._shakeSeq) {
      this._shakeSeq = sim.shake.seq
      this.shake(sim.shake.amount)
    }
    if (sim.slowmo.seq !== this._slowSeq) {
      this._slowSeq = sim.slowmo.seq
      if (sim.slowmo.seconds > 0) this.slowmo(sim.slowmo.seconds)
    }
    while (this._hiIndex < sim.highlights.length) {
      const h = sim.highlights[this._hiIndex++]
      if (!h.snap || this.snapshots >= 6 || this.time - this._lastSnapT < 4) continue
      this._lastSnapT = this.time
      this.snapshot().then((url) => {
        h.snapshot = url
      })
    }
  }

  /** The sinking animation (the arena's ships going down): list, trim and settle over her twenty seconds. */
  sinkingPose(i, P, Q) {
    const sim = this.sim
    const x = sim._X[i]
    if (!x || x.sinkT == null) return
    const u = Math.max(0, Math.min(1, (sim.t - x.sinkT) / (x.sinkDur || 20)))
    const m = x.model
    const listTo = (x.list < 0 ? -1 : 1) * (x.magazine ? 18 : 32)
    const list = (x.list || 0) + (listTo - (x.list || 0)) * Math.min(1, u * 1.4)
    const trim = (x.trim || 1) * 9 * u
    P.y = -(m.top + m.T + 4) * u * u
    _q.setFromEuler(_e.set(trim * DEG, -sim.state.heading[i] * DEG, -list * DEG, 'YXZ'))
    Q.copy(_q)
  }

  /** Select a unit (its slot) or none: the HUD's bracket marks it. Battle.select calls this; selecting never changes the sim. */
  select(index) {
    const sim = this.sim
    this.selected = index != null && sim && index >= 0 && index < sim.capacity ? index : null
    return this.selected
  }

  /**
   * boxDesc: the manifest entry (loadBox's box); battle: battle.json; kits:
   * { ships, aircraft, weapons }; opts.pack: the decoded pack (loadBox's), or
   * it is decoded here in app.decoder.
   */
  async load(boxDesc, battle, kits, { pack = null } = {}) {
    const app = this.app
    this.box = boxDesc
    this.battleData = battle
    this.kits = kits
    this.clock = battle?.clock ? new BattleClock(battle.clock) : null
    if (!pack) pack = { ...boxDesc.pack, data: await app.decoder.decode(boxDesc.pack) }
    const unit = boxDesc.proj?.unit ?? BOX.unit
    this.ground = new BoxGround(app, pack, { exaggeration: boxDesc.exaggeration ?? BOX.exaggeration, unit })
    this.scene.add(this.ground.group)
    this.ocean = new Ocean({ ...app.light.uniforms, ...this.ground.uniforms }, { unit })
    this.ocean.setWeather(battle?.weather)
    this.scene.add(this.ocean.mesh)
    this.rig = new CameraRig(this.camera, app.canvas, this.ground, BOX)
    this.cameras = new Cameras(this)
    this.atlas = insigniaAtlas()
    this.hud = new Hud(this)
    this.picker = new Picker(this)
    await tick()
    return this
  }

  /** Bind the sim: the unit and effect renderers and the weather (squalls from the record); kits built a few at a time. */
  async setSim(sim) {
    this.sim = sim
    this.selected = null
    const app = this.app
    const date = sim.clock.utc(0)
    const weapons = new Map((Array.isArray(this.kits?.weapons) ? this.kits.weapons : []).map((w) => [w.id, w]))
    if (this.units) {
      this.scene.remove(this.units.group)
      this.units.dispose()
    }
    if (this.effects) {
      this.scene.remove(this.effects.group)
      this.effects.dispose()
    }
    if (this.weather) {
      this.scene.remove(this.weather.group)
      this.weather.dispose()
    }
    this.units = new UnitRenderer(app.light.uniforms, sim, { colourDate: date, weapons, atlas: this.atlas })
    // (the arena's ships go down by the scene's sinking animation; the record's sim places its own)
    if (sim.arena) this.units.pose = (i, P, Q) => this.sinkingPose(i, P, Q)
    this.snapshots = 0
    this._hiIndex = 0
    this._shakeSeq = sim.shake?.seq ?? 0
    this._slowSeq = sim.slowmo?.seq ?? 0
    this.slowUntil = -1
    this.effects = new EffectsRenderer(app.light.uniforms, sim, { lowQuality: this.lowQuality })
    this.weather = new Weather(app.light.uniforms, this.battleData?.weather || {}, this.ground.bounds, sim.record.squalls, { lowQuality: this.lowQuality })
    this.scene.add(this.units.group, this.effects.group, this.weather.group)
    while (!this.units.buildSome(2)) await tick()
    this.ready = true
    return this
  }

  get skyPlace() {
    return { lat: this.box.proj?.lat0 ?? this.box.projection?.lat0 ?? 0, lon: this.box.proj?.lon0 ?? this.box.projection?.lon0 ?? 0 }
  }

  skyInstant() {
    if (this.sim) return this.sim.clock.utc(this.sim.t)
    return this.clock ? this.clock.utc(0) : Date.UTC(1942, 5, 4, 22)
  }

  /**
   * The haze from the record's visibility, thinning above the cloud base.
   * Koschmieder's 3.912 / visibility is where a dark object's contrast falls
   * to 2 %; the pipeline's fog brightens toward the horizon colour as well, so
   * the density is taken at 0.6 of it, which reads as the record's distance.
   */
  fog() {
    const w = this.battleData?.weather || {}
    const vis = w.visibilityM || 40000
    const base = w.cloud?.baseM || 1500
    return { density: (0.6 * 3.912) / vis, falloff: 1 / base }
  }

  /** setCamera(mode, { unitIndex, target, bearing, pitch, distance }): free, orbit, chase, bridge, director, sight, gun, bombsight. */
  setCamera(mode, opts = {}) {
    this.cameras.set(mode, opts)
  }

  get cameraMode() {
    return this.cameras?.mode ?? 'free'
  }

  update(realDt) {
    const app = this.app
    this.time += realDt
    const battle = this.battle ?? app.battle
    // (the shake's offset of the last frame taken off before the cameras place the camera again)
    if (this._shaken) {
      this.camera.quaternion.copy(this._shaken)
      this._shaken = null
    }
    const arena = this.sim?.arena ? this.sim : null
    if (battle?.tick) battle.tick(realDt, arena ? this.slowFactor() : 1)
    const sim = this.sim
    this.cameras?.update(realDt)
    if (arena && this.ready) {
      this.arenaRequests()
      if (this.shakeAmp > 0.003) {
        this._shaken = this.camera.quaternion.clone()
        const a = this.shakeAmp * 0.022
        const tt = this.time * 37
        this.camera.rotateX(Math.sin(tt) * a)
        this.camera.rotateY(Math.sin(tt * 1.37 + 1.1) * a)
        this.camera.rotateZ(Math.sin(tt * 0.71 + 2.3) * a * 0.6)
        this.camera.updateMatrixWorld()
        this.shakeAmp *= Math.exp(-realDt / 0.35)
      } else this.shakeAmp = 0
      // the snapshots asked for this frame: taken after the frame is drawn (App renders after update, in this task)
      if (this._snapQueue.length) {
        const q = this._snapQueue.splice(0)
        queueMicrotask(() => {
          const url = this._grab()
          for (const r of q) r(url)
        })
      }
    }
    this.ground.update(this.camera)
    this.ocean.update(this.camera)
    if (!sim || !this.ready) return
    const H = app.renderer?.domElement?.clientHeight || innerHeight
    this.effects.drain(sim, sim.t)
    this.units.update(this.camera, H, this.time)
    this.effects.update(this.camera, H, sim.t, realDt * (battle?.running ? battle.timeScale : 0), app.light)
    this.weather.update(this.camera, sim.t)
    this.hud.update(realDt)
  }

  settle() {
    this.rig.finishFlight()
    this.ground.update(this.camera)
  }

  setRange(k) {
    this.ground?.setRange(k)
  }

  /** Every ShaderMaterial in the scene (the smoke test reads their programs). */
  materials() {
    const out = new Set()
    this.scene.traverse((o) => {
      if (o.material) for (const m of [].concat(o.material)) out.add(m)
    })
    return [...out]
  }

  stats() {
    const s = this.sim
    let alive = 0
    if (s) for (let i = 0; i < s.capacity; i++) if (s.state.alive[i]) alive++
    return {
      scene: 'box',
      box: this.box?.id,
      ...(this.ground ? this.ground.stats() : {}),
      t: s ? s.clock.label(s.t, { seconds: true }) : null,
      units: alive,
      projectiles: s?.projectiles.count ?? 0,
      particles: this.effects ? this.effects.alpha.list.length + this.effects.add.list.length : 0,
      camera: this.cameraMode,
      distance: this.rig ? +this.rig.state.distance.toFixed(1) : null,
    }
  }

  dispose() {
    this.picker?.dispose()
    this.rig?.dispose()
    this.ground?.dispose()
    this.ocean?.dispose()
    this.units?.dispose()
    this.effects?.dispose()
    this.weather?.dispose()
    this.hud?.dispose()
    this.atlas?.texture?.dispose()
    this.scene.clear()
    this.ready = false
  }
}
