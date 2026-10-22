// The battle's lifecycle (ENGINEERING.md §9): Stage 0's stub Battle, which
// the engine workflow replaces whole.
//
// It keeps the contract's shape so App, the URL and the tools can be written
// against it now: enter() starts loadBox (the box's pack decoding in the app's
// PackDecoder, battle.json, the kits), flies the table rig to the hand-over
// pose over the box's outline through its placement with the rig's `ready`
// hold, logs, and resolves; leave() logs, takes the outline away and
// resolves. Everything else logs and does nothing (there is no sim:
// `sim` stays null, `takeMoment` resolves with nothing to score).
//
// preview() is Stage 0's check that the box flavours (battle/scene/
// terrain.glsl.js, render/ocean.js, render/shadow.js) compile and draw: after
// enter(), it builds a bare box scene (BoxGround, the sea, the sky at the
// box's place and the battle clock's instant, a CameraRig in metres) and cuts
// to it through the haze at the matched pose (poseToBox), as the real
// hand-over will. leave() cuts back.

import * as THREE from 'three'
import { BOX } from '../config.js'
import { BattleClock } from '../time.js'
import { poseToBox, poseToTable } from '../geo.js'
import { CameraRig } from '../render/camera.js'
import { Ocean } from '../render/ocean.js'
import { BoxGround } from './scene/terrain.js'

const log = (...a) => console.info('[battle]', ...a)

/** A bare box scene: terrain, sea, sky and an orbit rig in metres (preview only). */
class PreviewBox {
  constructor(app, loaded) {
    const { box, pack, battle } = loaded
    this.app = app
    this.box = box
    this.name = 'box'
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(42, 1, BOX.near, BOX.far)
    const unit = box.proj.unit
    this.ground = new BoxGround(app, pack, { exaggeration: box.exaggeration, unit })
    this.scene.add(this.ground.group)
    this.ocean = new Ocean({ ...app.light.uniforms, ...this.ground.uniforms }, { unit })
    this.ocean.setWeather(battle?.weather)
    this.scene.add(this.ocean.mesh)
    this.rig = new CameraRig(this.camera, app.canvas, this.ground, BOX)
    this.clock = battle?.clock ? new BattleClock(battle.clock) : null
    this.t = this.clock && battle.stops?.[0]?.t ? this.clock.clamp(this.clock.parse(battle.stops[0].t)) : 0
    this.weather = battle?.weather || {}
  }

  get skyPlace() {
    return { lat: this.box.proj.lat0, lon: this.box.proj.lon0 }
  }

  skyInstant() {
    return this.clock ? this.clock.utc(this.t) : Date.UTC(1942, 5, 4, 22)
  }

  /** The haze from the record's visibility (Koschmieder: 3.912 / visibility), thinning above the cloud base. */
  fog() {
    const vis = this.weather.visibilityM || 40000
    const base = this.weather.cloud?.baseM || 1500
    return { density: 3.912 / vis, falloff: 1 / base }
  }

  update(dt) {
    this.rig.update(dt)
    this.ground.update(this.camera)
    this.ocean.update(this.camera)
  }

  settle() {
    this.rig.finishFlight()
    this.ground.update(this.camera)
  }

  setRange(k) {
    this.ground.setRange(k)
  }

  stats() {
    return { scene: 'box', box: this.box.id, ...this.ground.stats(), distance: +this.rig.state.distance.toFixed(1) }
  }

  dispose() {
    this.rig.dispose()
    this.ground.dispose()
    this.ocean.dispose()
  }
}

export class Battle {
  constructor(app) {
    this.app = app
    this.ready = false
    this.scene = null
    this.sim = null
    this.running = false
    this.timeScale = 1
    this.state = null
    this.loaded = null
  }

  /**
   * Load a box and fly the table to it. t: a battle-clock time (BattleClock
   * parse rules), the box's first stop by default; momentId: kept in the
   * state; from: 'table' (fly) or 'url' (jump, no fly-down).
   */
  async enter(boxId, { t = null, momentId = null, from = 'table' } = {}) {
    const app = this.app
    const box = app.data.boxById.get(boxId)
    if (!box) throw new Error(`no box “${boxId}” in boxes/manifest.json`)
    log('enter', boxId, { t, momentId, from })
    this.ready = false
    this.loaded = null
    const loading = app.data.loadBox(boxId, { decoder: app.decoder, warn: app.warn }).then((b) => {
      this.loaded = b
      this.ready = true
      return b
    })
    const view = app.table.outlineView(boxId)
    app.table.outline(boxId, true)
    app.setMode('flying')
    try {
      if (from === 'url') app.table.rig.jump(view)
      else await app.table.flyTo(view, { duration: 2.5, ready: () => this.ready })
      const { battle } = await loading
      const clock = battle?.clock ? new BattleClock(battle.clock) : null
      const tS = clock ? clock.clamp(clock.parse(t ?? battle.stops?.[0]?.t ?? 0)) : 0
      this.state = { boxId, t: tS, momentId, mode: 'watch' }
      log('at the box', boxId, clock ? `${clock.dateLabel(tS)}, ${clock.label(tS)}` : '', `pack ${this.loaded.pack.W}×${this.loaded.pack.H}`, battle ? `${battle.units?.length ?? 0} units` : 'no battle.json')
      app.events.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'enter', boxId } }))
      return this.state
    } finally {
      // (the stub draws no box: the table keeps the controls)
      app.setMode('table')
    }
  }

  /** Stage 0's check of the box flavours: a bare box scene, cut to at the matched pose. */
  async preview() {
    const app = this.app
    if (!this.loaded) throw new Error('preview() comes after enter()')
    const box = this.loaded.box
    const scene = new PreviewBox(app, this.loaded)
    this.scene = scene
    await app.cut(() => {
      const pose = poseToBox(app.table.rig.pose(), box.placement)
      app.setActive(scene)
      scene.rig.jump(pose)
    })
    app.setMode('watch')
    log('preview', box.id, scene.stats())
    return scene
  }

  tick() {}

  watch() {
    log('watch (stub)')
  }

  scrub(t) {
    const s = this.scene
    if (s?.clock) s.t = s.clock.clamp(s.clock.parse(t))
    if (this.state && s?.clock) this.state.t = s.t
    log('scrub (stub)', t)
  }

  play(timeScale = 1) {
    this.running = true
    this.timeScale = timeScale
    log('play (stub)', timeScale)
  }

  async takeMoment(momentId) {
    log('takeMoment (stub: no sim)', momentId)
    return { score: null, outcome: null }
  }

  keepGoing() {
    log('keepGoing (stub)')
  }

  release() {
    log('release (stub)')
  }

  /** Back to the table at the battle's date; the box is forgotten. */
  async leave() {
    const app = this.app
    const id = this.state?.boxId ?? this.loaded?.box.id
    log('leave', id)
    const s = this.scene
    if (s) {
      const pl = s.box.placement
      await app.cut(() => {
        const pose = poseToTable(s.rig.pose(), pl)
        app.setActive(app.table)
        app.table.rig.jump(pose)
      })
      s.dispose()
      this.scene = null
    }
    if (id) app.table.outline(id, false)
    this.state = null
    this.loaded = null
    this.ready = false
    this.running = false
    app.setMode('table')
    app.events.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'leave', boxId: id } }))
  }
}
