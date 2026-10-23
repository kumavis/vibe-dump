// The box scene (ENGINEERING.md §7): a battle box drawn in metres. The
// terrain over the box's pack (BoxGround), the sea with the record's wind and
// sea state, the weather (cloud puffs at the base, squalls, the haze), the
// dated sky through App's one Sky at the box's place and the battle clock's
// instant, the units and the effects from the sim's typed arrays, the
// cameras and the HUD. It is App's active scene while a box is entered:
// scene, camera, rig, skyPlace, skyInstant(), update(), fog(), settle(),
// setRange(), stats().

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
    if (battle?.tick) battle.tick(realDt)
    const sim = this.sim
    this.cameras?.update(realDt)
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
