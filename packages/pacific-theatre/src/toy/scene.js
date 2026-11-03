// The toy's scene: App's active scene while the toy runs (the surface App
// draws: scene, camera, rig, skyPlace, skyInstant, update, fog, settle,
// setRange, stats). Built from the box's own modules, imported, never copied
// (TOY.md §5): the terrain over the box's pack (BoxGround), the sea with the
// record's wind (Ocean), App's one sky at the box's place, the units through
// UnitRenderer and the effects pool through EffectsRenderer, both reading the
// toy's world as they read a sim. Its own: the chase camera, the reload ring
// over the carrier, and the sinking pose.

import * as THREE from 'three'
import { BOX } from '../config.js'
import { BattleClock } from '../time.js'
import { Ocean } from '../render/ocean.js'
import { BoxGround } from '../battle/scene/terrain.js'
import { UnitRenderer } from '../battle/scene/units.js'
import { EffectsRenderer } from '../battle/scene/effects.js'
import { insigniaAtlas } from '../battle/kits/index.js'
import { ChaseCamera } from './camera.js'

const _q = new THREE.Quaternion()
const _e = new THREE.Euler()

/** A point near the box's middle with open sea a kilometre and more about it (the arena), in box metres. */
export function findSea(ground, need = 900) {
  const seaAt = (x, z) => {
    for (let a = 0; a < 12; a++) {
      const r = need
      if (ground.metresAt(x + Math.cos((a / 12) * Math.PI * 2) * r, z + Math.sin((a / 12) * Math.PI * 2) * r) > -3) return false
      if (ground.metresAt(x + Math.cos((a / 12) * Math.PI * 2) * r * 0.5, z + Math.sin((a / 12) * Math.PI * 2) * r * 0.5) > -3) return false
    }
    return ground.metresAt(x, z) < -3
  }
  if (seaAt(0, 0)) return { x: 0, z: 0 }
  for (let r = 1000; r < 60000; r += 1000) {
    const n = Math.max(8, Math.round(r / 600))
    for (let k = 0; k < n; k++) {
      const x = Math.cos((k / n) * Math.PI * 2) * r
      const z = Math.sin((k / n) * Math.PI * 2) * r
      if (seaAt(x, z)) return { x, z }
    }
  }
  return { x: 0, z: 0 }
}

export class ToyScene {
  /** loaded: loadBox's { box, pack, battle }; side: SIDES[code]. */
  constructor(app, loaded, side) {
    this.app = app
    this.name = 'toy'
    this.box = loaded.box
    this.battleData = loaded.battle
    this.side = side
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(55, innerWidth / Math.max(1, innerHeight), 0.5, BOX.far)
    this.chase = new ChaseCamera(this.camera)
    this.time = 0
    this.world = null
    this.onTick = null
    this.lowQuality = !!app.software || matchMedia?.('(pointer: coarse)')?.matches
    const unit = this.box.proj?.unit ?? BOX.unit
    this.ground = new BoxGround(app, loaded.pack, { exaggeration: this.box.exaggeration ?? BOX.exaggeration, unit })
    this.scene.add(this.ground.group)
    this.ocean = new Ocean({ ...app.light.uniforms, ...this.ground.uniforms }, { unit })
    this.ocean.setWeather(this.battleData?.weather)
    this.scene.add(this.ocean.mesh)
    this.atlas = insigniaAtlas()
    this.centre = findSea(this.ground)
    this.clock = this.battleData?.clock ? new BattleClock(this.battleData.clock) : null
    // the reload ring over the carrier: fly through it for bombs and the torpedo
    this.ring = new THREE.Mesh(new THREE.TorusGeometry(24, 1.3, 8, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 1.6, 0.5), transparent: true, opacity: 0.85, depthWrite: false }))
    this.ring.renderOrder = 6
    this.scene.add(this.ring)
    // the tools' handle the App's URL writer reads (a toy writes no #cam)
    this.rig = { goal: { target: { x: 0, z: 0 }, distance: 1, yaw: 0, pitch: 0 }, state: { distance: 1 }, enabled: false, pose: () => ({ target: { x: 0, y: 0, z: 0 }, distance: 1, yaw: 0, pitch: 0 }), jump() {}, finishFlight() {}, dispose() {} }
  }

  /** Bind a world (a fresh game): the unit renderer and the effects pool read it; kits built a few at a time. */
  async setWorld(world) {
    const app = this.app
    for (const k of ['units', 'effects']) {
      if (this[k]) {
        this.scene.remove(this[k].group)
        this[k].dispose()
      }
    }
    this.world = world
    this.units = new UnitRenderer(app.light.uniforms, world, { colourDate: this.side.colourDate, weapons: new Map(), atlas: this.atlas })
    this.units.pose = (i, P, Q) => this.sinkingPose(i, P, Q)
    this.effects = new EffectsRenderer(app.light.uniforms, world, { lowQuality: this.lowQuality })
    this.scene.add(this.units.group, this.effects.group)
    while (!this.units.buildSome(3)) await new Promise((r) => setTimeout(r, 0))
    this.chase.snap = true
    return this
  }

  /** A ship going down: she lists, trims by the bow and settles under the sea over her sinking. */
  sinkingPose(i, P, Q) {
    const th = this.world.slots[i].thing
    if (!th || th.sinkT == null) return
    const u = Math.max(0, Math.min(1, (this.world.t - th.sinkT) / (th.sinkDur || 8)))
    const m = this.world._X[i].model
    const list = (th.listDir || 1) * (th.magazine ? 20 : 30) * Math.min(1, u * 1.6)
    P.y = -(m.H + 6) * u * u
    _q.setFromEuler(_e.set((7 * u * Math.PI) / 180, -th.yaw, (-list * Math.PI) / 180, 'YXZ'))
    Q.copy(_q)
  }

  get skyPlace() {
    return { lat: this.box.proj?.lat0 ?? this.box.projection?.lat0 ?? 0, lon: this.box.proj?.lon0 ?? this.box.projection?.lon0 ?? 0 }
  }

  /** The box's morning at the side's hour (a toy keeps the sun still). */
  skyInstant() {
    if (!this.clock) return Date.UTC(1944, 9, 24, 22, 40)
    try {
      return this.clock.utc(this.clock.parse(this.side.localTime))
    } catch {
      return this.clock.utc(0)
    }
  }

  fog() {
    const vis = Math.max(30000, this.battleData?.weather?.visibilityM || 40000)
    return { density: (0.6 * 3.912) / vis, falloff: 1 / 1500 }
  }

  update(dt) {
    this.time += dt
    const cam = this.camera
    const aspect = innerWidth / Math.max(1, innerHeight)
    if (Math.abs(cam.aspect - aspect) > 1e-3) {
      cam.aspect = aspect
      cam.updateProjectionMatrix()
    }
    const fxDt = this.onTick ? this.onTick(dt) : dt
    const w = this.world
    if (w) {
      const me = w.me
      const c = w.centre
      this.chase.update(me ? { x: me.x + c.x, y: me.y, z: me.z + c.z, yaw: me.yaw, pitch: me.pitch, roll: me.roll } : null, dt)
      const r = w.ring
      if (r) {
        this.ring.visible = true
        this.ring.position.set(r.x + c.x, r.y, r.z + c.z)
        this.ring.rotation.set(0, -r.yaw, 0)
        const ready = r.ready
        this.ring.material.opacity = ready ? 0.55 + 0.35 * Math.sin(this.time * 5) ** 2 : 0.18
      } else this.ring.visible = false
    }
    this.ground.update(cam)
    this.ocean.update(cam)
    if (!w || !this.units) return
    const H = this.app.renderer?.domElement?.clientHeight || innerHeight
    this.units.update(cam, H, this.time)
    this.effects.update(cam, H, w.t, fxDt ?? dt, this.app.light)
  }

  settle() {
    this.ground.update(this.camera)
  }

  setRange(k) {
    this.ground?.setRange(k)
  }

  materials() {
    const out = new Set()
    this.scene.traverse((o) => {
      if (o.material) for (const m of [].concat(o.material)) out.add(m)
    })
    return [...out]
  }

  stats() {
    const w = this.world
    return {
      scene: 'toy',
      box: this.box.id,
      t: w ? +w.t.toFixed(1) : null,
      things: w ? w.things.length : 0,
      shots: w ? w.shots.length : 0,
      particles: this.effects ? this.effects.alpha.list.length + this.effects.add.list.length : 0,
    }
  }

  dispose() {
    this.ground?.dispose()
    this.ocean?.dispose()
    this.units?.dispose()
    this.effects?.dispose()
    this.atlas?.texture?.dispose()
    this.ring.geometry.dispose()
    this.ring.material.dispose()
    this.scene.clear()
  }
}
