// Wires the loaded data into a running scene: the ground (archipelago and
// island packs, with the patches that give a year back its reefs), the sea,
// the sky, the boundary lines, the routes and the far view's overlays, under
// one camera that runs from the whole chain to a single valley.
//
// The works (features/works.js) come in with their islands, at the island
// zoom and down into a district, each in the years it stood.
//
// The far view shows one of three things at a time (`view`): the chiefdoms,
// each moku in the colour of the polity that held it (overlay/polity.js);
// the land, how it was used in the chosen year (overlay/land.js); or, from
// 1848, the Māhele, each ahupuaʻa in the class the division gave it
// (overlay/mahele.js). The viewer picks with the switch on the legend; the
// tour may pick for a step until they have (ui/tour.js). Before 1848 a
// choice of the Māhele shows the chiefdoms (`farView`), and the Māhele again
// once the year comes back to it.

import * as THREE from 'three'
import { World } from './render/world.js'
import { Districts } from './render/district.js'
import { Patches } from './render/patches.js'
import { Ocean } from './render/ocean.js'
import { Sky } from './render/sky.js'
import { Pipeline } from './render/pipeline.js'
import { CameraRig } from './render/camera.js'
import { Boundaries } from './render/lines.js'
import { Routes, loadRoutes } from './render/routes.js'
import { PolityOverlay } from './overlay/polity.js'
import { LandOverlay } from './overlay/land.js'
import { MaheleOverlay } from './overlay/mahele.js'
import { CropLayer } from './overlay/crops.js'
import { Timeline } from './time.js'
import { Towns } from './features/towns.js'
import { Works } from './features/works.js'
import { CropTrees } from './features/crops.js'

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// what the far view can show (`view`)
const VIEWS = ['chiefdoms', 'land', 'mahele']

/** The polity overlay's strength at a camera distance. */
export const polityZoom = (d) => smooth(260, 900, d)
/** The land overlay's, and the Māhele's: full at the island zooms, gone over a valley. */
export const landZoom = (d) => smooth(90, 300, d)
/** How strongly a chapter's card draws its events' routes: a sketch of what is to come. */

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
    // the ground (World adds its own), and the two overlays (the land's add
    // their own too).
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
    // the patches (render/patches.js): read behind the first frame (main.js)
    this.patches = new Patches(this)
    this.timeline = new Timeline(data.eras)
    this.polity = new PolityOverlay(data, this.world.archPack.rect, this.shared.uniforms, warn)
    this.land = new LandOverlay(this)
    // what grows where, by class, at the island zooms and in the districts
    this.crops = new CropLayer(this)
    this.mahele = new MaheleOverlay(this)
    // (the moku's map is on the shader's region path to begin with; see region())
    this.regionOn = 'chiefdoms'
    // (the routes follow the story unless the viewer turns them all on: the
    // toggle is the override, off until they press it)
    this.overlay = { lines: true, pins: true, routes: false }
    // 'chiefdoms', 'land', 'mahele', or null for none; ?view= asks for one,
    // and counts as the viewer's choice
    const v = this.params.get('view')
    this.view = VIEWS.includes(v) ? v : v === 'none' ? null : 'chiefdoms'
    this.viewChosen = VIEWS.includes(v) || v === 'none'
    this.viewListeners = []
    this.polityK = 0
    this.landK = 0

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
    // the district close-ups under their islands (render/district.js); their
    // manifest is read behind the first frame (main.js)
    this.districts = new Districts(this)
    this.world.district = this.districts
    // and the settlements of every island, where the camera comes down (features/towns.js)
    this.towns = new Towns(this)
    // the works of the last century and a half, by their dates, on the islands in their slots (features/works.js)
    this.works = new Works(this)
    // and the trees of the year's pastures, orchards and lawns (features/crops.js)
    this.cropTrees = new CropTrees(this)
    this.ocean = new Ocean(this.shared, this.shared.uniforms)
    this.scene.add(this.ocean.mesh)
    this.lines = new Boundaries(this.data, this.shared.uniforms)
    this.scene.add(this.lines.group)
    // what moved over the sea in the chosen years: canoes, fleets, ships,
    // lanes (render/routes.js); the file loads behind the first frame
    this.routes = new Routes({ proj: this.data.proj, uniforms: this.shared.uniforms, camera: this.camera, renderer: this.renderer, eras: this.data.eras })
    this.scene.add(this.routes.group)
    loadRoutes(this.data, this.warn).then((r) => this.routes.setRoutes(r))
    // the Māhele's file, small, behind the first frame (its map waits until it is wanted)
    this.mahele.load()
    this.rig = new CameraRig(this.camera, this.canvas, this.world)
    const cam = this.params.get('cam')
    if (cam) {
      const [x, z, distance, yaw, pitch] = cam.split(',').map(Number)
      this.rig.jump({ x, z, distance, yaw, pitch })
    }
    const year = this.params.get('year')
    if (year) this.timeline.setYear(Number(year))
    // A view asked for with no year opens at contact, or the keyframe nearest
    // it: the chiefdoms at their fullest, just before the record changes
    // character (DESIGN.md §3.2). Otherwise the tour opens on its first
    // chapter (ui/tour.js), and the year is that era's.
    else if (cam) this.timeline.set(Math.round(this.timeline.sAtYear(1778)))
    else this.timeline.set(0)
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

  /**
   * What the far view shows: 'chiefdoms', 'land', 'mahele' or null. `user`
   * marks the viewer's own choice, which the tour leaves alone from then on.
   */
  setView(v, { user = false } = {}) {
    if (user) this.viewChosen = true
    const next = VIEWS.includes(v) ? v : null
    if (next === this.view) return
    this.view = next
    for (const f of this.viewListeners) f(next)
  }

  /** What the far view draws: the view chosen, but the chiefdoms where the Māhele hasn't happened yet. */
  get farView() {
    return this.view === 'mahele' && !this.mahele.availableAt(this.timeline.year) ? 'chiefdoms' : this.view
  }

  /**
   * The chiefdoms and the Māhele are drawn by one path in the terrain shader
   * (common.glsl.js applyPolity), so one of them at a time stands on its
   * uniforms: the moku's map and the polities' palette, or the ahupuaʻa's
   * classes and theirs. They change over only while neither shows, so a
   * switch between the two fades one out and then the other in.
   */
  region(want) {
    if (want === this.regionOn || this.polityK > 0.004) return
    if (want === 'mahele' && !this.mahele.build()) return
    const src = want === 'mahele' ? this.mahele : this.polity
    const u = this.shared.uniforms
    u.uMokuId.value = src.idTex
    u.uPalette.value = src.palTex
    u.uMokuRect.value.set(src.rect.x0, src.rect.z0, src.rect.x1, src.rect.z1)
    this.regionOn = want
  }

  /** The strength the region path asks for at distance d: the chiefdoms' or the Māhele's, whichever is on and wanted. */
  regionZoom(fv, d) {
    if (fv !== this.regionOn) return 0
    return fv === 'mahele' ? landZoom(d) : fv === 'chiefdoms' ? polityZoom(d) : 0
  }

  onView(f) {
    this.viewListeners.push(f)
  }

  /** How much of the screen the island under the camera's target fills: 0 over open sea, about 1 edge to edge. */
  islandFill() {
    const s = this.rig.state
    const t = s.target
    let best = null
    let e0 = 0
    for (const p of this.world.islandPacks) {
      const q = p.rect
      const e = Math.min(t.x - q.x0, q.x1 - t.x, t.z - q.z0, q.z1 - t.z)
      if (e > e0) {
        e0 = e
        best = p
      }
    }
    if (!best) return 0
    const h = 2 * s.distance * Math.tan((this.camera.fov * Math.PI) / 360)
    const q = best.rect
    return Math.max((q.x1 - q.x0) / (h * this.camera.aspect), (q.z1 - q.z0) / h)
  }

  /**
   * The routes the part of the story in front of the viewer asks for
   * (render/routes.js `section`): on an event's step that event's own, and
   * nothing on a chapter's card, because a path belongs to the step it is
   * part of; off the tour the routes of the event whose card is open, or
   * none. Null for none.
   */
  routeSection() {
    const tour = this.tour
    const card = this.ui?.card
    let ev = null
    if (tour?.active && tour.event) ev = tour.event
    else if (!tour?.active && card?.mode === 'event' && card.ev) ev = card.ev
    const key = ev ? `ev:${ev.id}` : ''
    if (key !== this._routeKey) {
      this._routeKey = key
      this._routeSection = ev
        ? { routes: new Set(ev.routes || []), events: new Set([ev.id]), k: 1, focus: true }
        : null
    }
    return this._routeSection
  }

  /**
   * What the routes need to know of the tour and the view, besides the year:
   * the section's routes, or with the routes toggle on (the viewer's
   * override), every route of the year.
   */
  routeOptions(extra) {
    return { window: this.timeline.window, fill: this.islandFill(), section: this.routeSection(), all: this.overlay.routes === true, ...extra }
  }

  /** An island pack, decoded in the background. */
  addIsland(pack) {
    const t = this.world.addIsland(pack)
    this.land.attach(t)
    this.crops.attach(t)
    t.applyRange(this.qset.range)
    if (this.params.get('debug')) t.uniforms.uDebug.value = Number(this.params.get('debug'))
  }

  /** Settle everything that eases (camera, pack detail, overlay, the year) at once: for the tools. */
  settle() {
    this.ui?.timeline.finish()
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
    this.crops.update(0)
    this.crops.settle()
    this.districts?.settle(this.camera, g.distance)
    this.towns?.settle()
    this.works?.settle()
    this.cropTrees?.settle()
    this.rig.jump({ x: g.target.x, z: g.target.z })
    const fv = this.farView
    if (fv === 'chiefdoms' || fv === 'mahele') {
      this.polityK = 0
      this.region(fv)
    }
    this.polityK = this.regionZoom(fv, g.distance)
    this.landK = fv === 'land' ? landZoom(g.distance) : 0
    this.shared.uniforms.uPolityK.value = this.polityK
    this.land.settle(this.landK)
    this.routes?.settle(this.timeline.year, g.distance, this.routeOptions())
  }

  stats() {
    const info = this.renderer.info
    return { ...this.world.stats(), view: this.view, farView: this.farView, frameMs: +(this.frameAvg ?? 0).toFixed(1), calls: info.render.calls, triangles: info.render.triangles, textures: info.memory.textures, quality: this.quality.level }
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
    // the overlays of the far view, crossfading as the view changes: the
    // polity full over the chain and gone well before the valleys; the land
    // and the Māhele full at the chain and the island zooms, gone as the
    // camera closes on a valley (where the near view will carry the land
    // itself). The polity and the Māhele share a path (region), so between
    // those two it fades out, changes over, and fades in.
    const ease = 1 - Math.exp(-dt * 5)
    const fv = this.farView
    if (fv === 'chiefdoms' || fv === 'mahele') this.region(fv)
    const pk = this.regionZoom(fv, d)
    this.polityK += (pk - this.polityK) * ease
    if (Math.abs(pk - this.polityK) < 1e-3) this.polityK = pk
    this.shared.uniforms.uPolityK.value = this.polityK
    const lk = fv === 'land' ? landZoom(d) : 0
    this.landK += (lk - this.landK) * ease
    this.land.update(dt, this.landK)
    this.crops.update(dt)
    this.lines.visible = this.overlay.lines
    const L = this.light
    const lightLevel = Math.min(1, 0.25 + (L.sunColor.r + L.skyColor.r) * 0.35)
    this.lines.update(this.camera, this.renderer, d, lightLevel)
    this.routes.update(this.timeline.year, d, this.routeOptions({ light: lightLevel }))
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
