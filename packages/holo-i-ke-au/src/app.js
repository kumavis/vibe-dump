// Wires the loaded data into a running scene: the ground (archipelago and
// island packs), the sea, the sky, the boundary lines and the polity overlay,
// under one camera that runs from the whole chain to a single valley.

import * as THREE from 'three'
import { World } from './render/world.js'
import { Ocean } from './render/ocean.js'
import { Sky } from './render/sky.js'
import { Pipeline } from './render/pipeline.js'
import { CameraRig } from './render/camera.js'
import { Boundaries } from './render/lines.js'
import { PolityOverlay } from './overlay/polity.js'
import { Timeline } from './time.js'

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export class App {
  constructor(canvas, data, { warn = console.warn } = {}) {
    this.canvas = canvas
    this.data = data
    this.warn = warn
    this.params = new URLSearchParams(location.search)
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
    renderer.setClearColor(0x000000, 1)
    renderer.info.autoReset = false // (counted over the whole frame, every pass)
    this.renderer = renderer
    this.pipeline = new Pipeline(renderer)
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 9000)

    this.light = {
      sunDir: new THREE.Vector3(0, 1, 0),
      sunColor: new THREE.Color(),
      skyColor: new THREE.Color(),
      groundColor: new THREE.Color(),
      moonDir: new THREE.Vector3(0, -1, 0),
      moonColor: new THREE.Color(),
      zenith: new THREE.Color(),
      horizon: new THREE.Color(),
      sunHorizon: new THREE.Color(),
      night: 0,
    }
    // One bag of uniforms that every surface shares by reference: the light,
    // the ground (World adds its own), and the polity overlay.
    this.shared = {
      uniforms: {
        uSunDir: { value: this.light.sunDir },
        uSunColor: { value: this.light.sunColor },
        uSkyColor: { value: this.light.skyColor },
        uGroundColor: { value: this.light.groundColor },
        uMoonDir: { value: this.light.moonDir },
        uMoonColor: { value: this.light.moonColor },
        uTime: { value: 0 },
        uSkyMap: { value: null },
        uMokuId: { value: null },
        uMokuRect: { value: new THREE.Vector4(0, 0, 1, 1) },
        uPalette: { value: null },
        uEraMix: { value: 0 },
        uPolityK: { value: 0 },
        uHoverMoku: { value: 0 },
      },
    }
    this.world = new World(this, data)
    Object.assign(this.shared.uniforms, this.world.uniforms)
    this.world.uniforms = this.shared.uniforms
    this.timeline = new Timeline(data.eras)
    this.polity = new PolityOverlay(data, this.world.archPack.rect, this.shared.uniforms, warn)
    this.overlay = { polity: true, lines: true, pins: true }
    this.polityK = 0

    this.sky = new Sky()
    this.scene.add(this.sky.group)
    this.shared.uniforms.uSkyMap.value = this.sky.mapRT.texture
    this.pipeline.uniforms.uSkyMap.value = this.sky.mapRT.texture

    this.clock = { doy: Number(this.params.get('doy') ?? 277), hour: Number(this.params.get('hour') ?? 15.6) }
    this.time = 0
    this.frames = 0
    this.updaters = []
  }

  /** The archipelago is decoded: build the scene on it and start the frame loop. */
  start() {
    this.world.setArchipelago(this.world.archPack)
    this.scene.add(this.world.group)
    this.ocean = new Ocean(this.shared, this.shared.uniforms)
    this.scene.add(this.ocean.mesh)
    this.lines = new Boundaries(this.data, this.shared.uniforms)
    this.scene.add(this.lines.group)
    this.rig = new CameraRig(this.camera, this.canvas, this.world)
    const cam = this.params.get('cam')
    if (cam) {
      const [x, z, distance, yaw, pitch] = cam.split(',').map(Number)
      this.rig.jump({ x, z, distance, yaw, pitch })
    }
    const year = this.params.get('year')
    if (year) this.timeline.setYear(Number(year))
    // Open at contact, or the keyframe nearest it: the chiefdoms at their
    // fullest, just before the record changes character (DESIGN.md §3.2)
    else this.timeline.set(Math.round(this.timeline.sAtYear(1778)))
    this.timeline.onChange(() => this.syncEras())
    this.syncEras()
    this.sky.update(this.clock.doy, this.clock.hour, 0, this.light)

    const gl = this.renderer.getContext()
    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    const gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : ''
    this.software = /swiftshader|llvmpipe|software/i.test(gpu)
    this.quality = { level: 2, cap: 3, avg: 16, since: 0, raisedAt: -1e9, fixed: this.software || this.params.has('fixedq') }
    if (this.params.get('q')) this.quality.level = Number(this.params.get('q'))
    this.applyQuality()
    if (this.params.get('debug')) this.world.setDebug(Number(this.params.get('debug')))

    this.resize()
    addEventListener('resize', () => this.resize())
    this.last = performance.now()
    this.frame = this.frame.bind(this)
    requestAnimationFrame(this.frame)
  }

  /** An island pack, decoded in the background. */
  addIsland(pack) {
    const t = this.world.addIsland(pack)
    t.applyRange(this.qset.range)
    if (this.params.get('debug')) t.uniforms.uDebug.value = Number(this.params.get('debug'))
  }

  /** Settle everything that eases (camera, pack detail, overlay) at once: for the tools. */
  settle() {
    this.rig.finishFlight()
    const g = this.rig.goal
    for (const s of [this.rig.goal, this.rig.state]) {
      s.target.copy(g.target)
      s.distance = g.distance
      s.yaw = g.yaw
      s.pitch = g.pitch
    }
    this.world.update(this.camera, g.distance, 0)
    this.world.settle(this.camera)
    this.rig.jump({ x: g.target.x, z: g.target.z })
    this.polityK = this.overlay.polity ? smooth(260, 900, g.distance) : 0
  }

  stats() {
    const info = this.renderer.info
    return { ...this.world.stats(), frameMs: +(this.frameAvg ?? 0).toFixed(1), calls: info.render.calls, triangles: info.render.triangles, textures: info.memory.textures, quality: this.quality.level }
  }

  syncEras() {
    const { a, b, t } = this.timeline.pair
    this.polity.setEras(a, b, t)
  }

  applyQuality() {
    const L = [
      { range: 3, dpr: 1 },
      { range: 3.8, dpr: 1.25 },
      { range: 4.6, dpr: 1.5 },
      { range: 5.5, dpr: 2 },
    ][Math.max(0, Math.min(3, this.quality.level))]
    this.qset = L
    this.world.setRange(L.range)
    if (this.sized) this.resize()
  }

  /** Step quality down when frames run long, back up when there's headroom (as ahupuaʻa). */
  govern(dt) {
    const q = this.quality
    if (q.fixed || this.time < 3) return
    q.avg += (dt * 1000 - q.avg) * 0.05
    q.since += dt
    if (q.avg > 34 && q.since > 2 && q.level > 0) {
      if (this.time - q.raisedAt < 20) q.cap = q.level - 1
      q.level--
      q.since = 0
      this.applyQuality()
    } else if (q.avg < 15 && q.since > 8 && q.level < q.cap) {
      q.level++
      q.since = 0
      q.raisedAt = this.time
      this.applyQuality()
    }
  }

  resize() {
    this.sized = true
    const w = innerWidth
    const h = innerHeight
    const dpr = Math.min(devicePixelRatio || 1, this.software ? 1 : this.qset ? this.qset.dpr : 2)
    this.renderer.setPixelRatio(dpr)
    this.renderer.setSize(w, h, false)
    this.pipeline.setSize(w, h, dpr)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.sky.starUniforms.uPixel.value = dpr
  }

  frame(now) {
    const dt = Math.max(0, Math.min(0.1, (now - this.last) / 1000))
    this.last = now
    this.time += dt
    this.frameAvg = this.frameAvg === undefined ? dt * 1000 : this.frameAvg + (dt * 1000 - this.frameAvg) * 0.1
    this.renderer.info.reset()
    this.camDt = this.camDt === undefined ? dt : this.camDt + (dt - this.camDt) * 0.3
    this.govern(dt)
    this.update(dt)
    this.sky.renderMap(this.renderer)
    this.pipeline.render(this.scene, this.camera)
    this.frames++
    requestAnimationFrame(this.frame)
  }

  update(dt) {
    const c = this.clock
    this.sky.update(c.doy, c.hour, this.time, this.light)
    this.shared.uniforms.uTime.value = this.time
    this.rig.update(this.camDt ?? dt)
    const d = this.rig.state.distance
    this.world.update(this.camera, d, dt)
    this.ocean.update(this.camera)
    // the polity overlay belongs to the far view: full over the chain, gone
    // by the time one island fills the screen
    const pk = this.overlay.polity ? smooth(260, 900, d) : 0
    this.polityK += (pk - this.polityK) * (1 - Math.exp(-dt * 5))
    this.shared.uniforms.uPolityK.value = this.polityK
    this.lines.visible = this.overlay.lines
    const L = this.light
    const lightLevel = Math.min(1, 0.25 + (L.sunColor.r + L.skyColor.r) * 0.35)
    this.lines.update(this.camera, this.renderer, d, lightLevel)
    for (const u of this.updaters) u(dt, this.time)
    const pu = this.pipeline.uniforms
    pu.uSunDir.value.copy(L.sunDir)
    pu.uSunColor.value.copy(L.sunHorizon)
    pu.uFogColor.value.copy(L.horizon)
    // Aerial perspective scaled to the view: the haze is set by how far the
    // camera stands off, so a valley and the whole chain both read with depth
    // and neither goes milky. (ahupuaʻa's fixed 0.0016 and 0.045 suit a
    // camera a few hundred units out.)
    pu.uFogDensity.value = 0.09 / Math.max(30, d)
    pu.uFogFalloff.value = 2.0 / Math.max(30, d)
    pu.uExposure.value = 0.55 * (1 + 2.2 * Math.pow(L.night, 1.5))
    pu.uNight.value = L.night
    this.sky.group.position.copy(this.camera.position)
  }
}
