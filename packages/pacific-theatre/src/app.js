// The app (ENGINEERING.md §§2, 7–9): one renderer with a logarithmic depth
// buffer, the pipeline, the light bag every material of both scenes shares,
// one Sky, the table and (through Battle) a box as two scenes of which one is
// drawn per frame, app.mode for the input, the frame loop with its quality
// governor, and the URL.
//
// Adapted from holo-i-ke-au's app.js (b480c27): the renderer setup, the
// light and its shared uniforms, govern/applyQuality, resize, the frame loop
// and settle() are kept; the World, islands, districts, patches, polity and
// land views, the ocean and the boundary lines are gone (the table's ground
// is src/table/, a box's src/battle/). The Hawaiian bag mixed the light with
// the ground; here the light bag (light.uniforms) is shared by reference by
// every material of both scenes and written each frame by the active scene's
// sky, and each scene's ground uniforms are its own.
//
// The URL (ENGINEERING §9): the hash carries the view (#date, #cam, #battle,
// #t, #moment), the query string the tools' switches (?data=, ?q=, ?fixedq,
// ?debug=). #battle, #t and #moment act through src/link.js (app.urlBattle);
// entering and leaving a box push a history entry, so Back leaves the box.

import * as THREE from 'three'
import { CLOCK, QUALITY } from './config.js'
import { WarClock, parseInstant } from './time.js'
import { Pipeline } from './render/pipeline.js'
import { Sky, WAR_ROOM } from './render/sky.js'
import { MAX_POINT_LIGHTS } from './render/shaders/common.glsl.js'
import { PackDecoder } from './data/load.js'
import { TableScene } from './table/index.js'
import { Battle } from './battle/index.js'

export const MODES = ['table', 'flying', 'watch', 'moment']
const pad = (n) => String(n).padStart(2, '0')

/** A battle-clock time for the URL, as BattleClock.parse reads it back: hours from the clock's first midnight (24:07 the next day). */
export function urlTime(clock, t) {
  const [h0, m0, s0] = clock.label(0, { seconds: true }).split(':').map(Number)
  const all = Math.round(h0 * 3600 + m0 * 60 + s0 + t)
  const h = Math.floor(all / 3600)
  const m = Math.floor((all % 3600) / 60)
  const sec = all % 60
  return `${pad(h)}:${pad(m)}${sec ? `:${pad(sec)}` : ''}`
}

export class App {
  constructor(canvas, data, { warn = console.warn } = {}) {
    this.canvas = canvas
    this.data = data
    this.warn = warn
    this.params = new URLSearchParams(location.search)
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', logarithmicDepthBuffer: true })
    renderer.setClearColor(0x000000, 1)
    renderer.info.autoReset = false // (counted over the whole frame, every pass)
    this.renderer = renderer
    this.pipeline = new Pipeline(renderer)
    this.events = new EventTarget()

    // The light: what the active scene's sky writes each frame, and one bag
    // of uniforms holding it that every material of both scenes shares by
    // reference (ENGINEERING §7). uPointPos[i].w is a point light's radius.
    const light = {
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
    light.uniforms = {
      uSunDir: { value: light.sunDir },
      uSunColor: { value: light.sunColor },
      uSkyColor: { value: light.skyColor },
      uGroundColor: { value: light.groundColor },
      uMoonDir: { value: light.moonDir },
      uMoonColor: { value: light.moonColor },
      uTime: { value: 0 },
      uSkyMap: { value: null },
      uPointPos: { value: Array.from({ length: MAX_POINT_LIGHTS }, () => new THREE.Vector4(0, -1e9, 0, 1)) },
      uPointCol: { value: Array.from({ length: MAX_POINT_LIGHTS }, () => new THREE.Vector3()) },
      uPointCount: { value: 0 },
    }
    this.light = light

    this.sky = new Sky(WAR_ROOM)
    light.uniforms.uSkyMap.value = this.sky.mapRT.texture
    this.pipeline.uniforms.uSkyMap.value = this.sky.mapRT.texture

    // the table's time (ENGINEERING §4); the fronts' keyframes when there are any
    const chapters = data.chapters.length ? data.chapters : [{ id: 'war', from: '1941-12-07', to: '1945-09-03' }]
    if (!data.chapters.length) warn('chapters.json: none; the clock runs over the war alone')
    const kf = data.fronts?.manifest?.keyframes
    this.clock = new WarClock(chapters, { prologueShare: CLOCK.prologueShare, windowMinDays: CLOCK.windowMinDays, windowMaxDays: CLOCK.windowMaxDays, keyframes: kf?.length ? kf.map((k) => ({ id: k.id, date: k.date })) : null })

    this.decoder = new PackDecoder(2, warn)
    this.mode = 'table'
    this.ready = false
    this.table = null
    this.battle = new Battle(this)
    this.tour = null
    this.ui = null
    this.active = null
    this.time = 0
    this.frames = 0
    this.updaters = []
    this.url = { kept: {}, written: null, timer: 0, battle: null, t: null, moment: null }
  }

  /** The table pack is decoded: build the table, make it the active scene, start the frame loop. */
  start() {
    this.table = new TableScene(this, this.data)
    this.setActive(this.table)
    this.setMode('table')

    const gl = this.renderer.getContext()
    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    const gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : ''
    this.gpu = gpu
    this.software = /swiftshader|llvmpipe|software/i.test(gpu)
    this.quality = { level: 2, cap: 3, avg: 16, since: 0, raisedAt: -1e9, fixed: this.software || this.params.has('fixedq') }
    // (under a software renderer a frame takes about a second: no multisampling there, ?msaa keeps it)
    if (this.software && !this.params.has('msaa')) this.pipeline.setSamples(0)
    if (this.params.get('q')) this.quality.level = Number(this.params.get('q'))
    this.applyQuality()
    if (this.params.get('debug')) this.table.ground.terrain.setDebug(Number(this.params.get('debug')))

    this.resize()
    addEventListener('resize', () => this.resize())
    addEventListener('hashchange', () => {
      if (location.hash === this.url.written) return
      this.fromUrl()
    })
    this.last = performance.now()
    this.frame = this.frame.bind(this)
    requestAnimationFrame(this.frame)
  }

  /** Make a scene the one drawn: the sky moves into it and is seen from its place. */
  setActive(s) {
    if (this.active === s) return
    this.active?.scene.remove(this.sky.group)
    this.active = s
    s.scene.add(this.sky.group)
    const p = s.skyPlace
    this.sky.setPlace(p.lat, p.lon)
    s.setRange?.(this.qset?.range ?? QUALITY[2].range)
    if (this.sized) this.resize()
  }

  /**
   * Who owns the input (ENGINEERING §8): 'table' the table rig and the UI,
   * 'flying' nothing but Esc, 'watch' the box's orbit rig, 'moment' only the
   * battle's controls. The rigs are switched here; the UI and the controls
   * read app.mode before they act.
   */
  setMode(m) {
    if (!MODES.includes(m)) throw new Error(`app.mode “${m}”: one of ${MODES.join(', ')}`)
    this.mode = m
    if (this.table) this.table.rig.enabled = m === 'table'
    const box = this.battle?.scene
    if (box?.rig) box.rig.enabled = m === 'watch'
  }

  /**
   * The hand-over's cut (ENGINEERING §9): the frame fades to the haze over
   * `out` seconds, fn() switches the scene and places its camera, and it
   * fades back in over `back`. One scene is drawn on every frame of it.
   */
  cut(fn, { out = 0.25, back = 0.25 } = {}) {
    return new Promise((resolve, reject) => {
      this._cut = { phase: 'out', t: 0, out, back, fn, resolve, reject }
    })
  }

  stepCut(dt) {
    const c = this._cut
    if (!c) return
    c.t += dt
    const u = this.pipeline.uniforms.uFade
    if (c.phase === 'out') {
      u.value = Math.min(1, c.t / c.out)
      if (c.t >= c.out) {
        try {
          c.fn()
        } catch (err) {
          this._cut = null
          u.value = 0
          return c.reject(err)
        }
        c.phase = 'back'
        c.t = 0
      }
    } else {
      u.value = Math.max(0, 1 - c.t / c.back)
      if (c.t >= c.back) {
        u.value = 0
        this._cut = null
        c.resolve()
      }
    }
  }

  // --- the URL -------------------------------------------------------------

  /** Read the hash (at boot, after the table is ready, and on hashchange): #date and #cam act; #battle, #t, #moment are kept. */
  fromUrl() {
    const h = new URLSearchParams(location.hash.replace(/^#/, ''))
    const kept = {}
    for (const [k, v] of h) if (!['date', 'cam', 'battle', 't', 'moment'].includes(k)) kept[k] = v
    this.url.kept = kept
    const date = h.get('date')
    if (date) {
      try {
        this.clock.setDate(parseInstant(date))
      } catch (err) {
        this.warn(`#date=${date}: ${err.message}`)
      }
    }
    const cam = h.get('cam')
    // (a box's camera is in its metres: link.js places it once the box is in)
    const boxCam = h.get('battle') && this.active === this.table
    if (cam && !boxCam) {
      const v = cam.split(',').map(Number)
      if (v.length === 5 && v.every(Number.isFinite)) {
        const [x, z, distance, yaw, pitch] = v
        this.active.rig.jump({ x, z, distance, yaw, pitch })
      } else this.warn(`#cam=${cam}: want x,z,distance,yaw,pitch`)
    }
    for (const k of ['battle', 't', 'moment']) this.url[k] = h.get(k)
    this.urlBattle?.(h)
  }

  /** A history entry for the view now (entering and leaving a box), so the browser's Back undoes it. */
  pushUrl() {
    const h = this.hashNow()
    this.url.written = h
    this.url.timer = 0.25
    if (h !== location.hash) history.pushState(history.state, '', `${location.pathname}${location.search}${h}`)
  }

  /** The same in the entry the browser is on (a Back that left a box has already landed on the table's entry). */
  replaceUrl() {
    const h = this.hashNow()
    this.url.written = h
    this.url.timer = 0.25
    if (h !== location.hash) history.replaceState(history.state, '', `${location.pathname}${location.search}${h}`)
  }

  /** Start decoding a box's pack before the click that enters it (a box event's card is open). */
  prefetch(boxId) {
    if (!boxId || this.battle?.scene || !this.data.boxById?.has(boxId) || this._prefetch?.id === boxId) return
    const p = this.data.loadBox(boxId, { decoder: this.decoder, warn: this.warn })
    p.catch(() => {})
    this._prefetch = { id: boxId, p }
  }

  /** The prefetched load, once (Battle.enter takes it), or null. */
  takePrefetch(boxId) {
    const f = this._prefetch
    if (!f || f.id !== boxId) return null
    this._prefetch = null
    return f.p
  }

  /** The hash the view now stands for: the date (a day), the active rig's pose, the kept keys. */
  hashNow() {
    const p = new URLSearchParams()
    const sim = this.battle?.sim
    const inBox = !!(sim && this.active === this.battle.scene)
    if (inBox) {
      // in a box: its clock's time, to the second when it is not on the minute
      this.url.t = urlTime(sim.clock, sim.t)
    }
    const d = new Date(this.clock.date)
    p.set('date', `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`)
    const s = this.active.rig.goal
    p.set('cam', [s.target.x, s.target.z, s.distance, s.yaw, s.pitch].map((v) => (+v.toFixed(4)).toString()).join(','))
    // (#t only while a box is the scene: a table hash carries none)
    for (const k of ['battle', 't', 'moment']) if (this.url[k] && (k !== 't' || inBox)) p.set(k, this.url[k])
    for (const [k, v] of Object.entries(this.url.kept)) p.set(k, v)
    return `#${p.toString().replace(/%2C/g, ',').replace(/%3A/g, ':')}`
  }

  /** Write the hash with replaceState, debounced 250 ms, only when it changed; remember it so it does not re-enter fromUrl. */
  syncUrl(dt) {
    // (nothing while flying: during a fly-up after Back the box is still the scene, and its #t would land in the entry Back went to)
    if (!this.ready || this.mode === 'flying') return
    this.url.timer -= dt
    if (this.url.timer > 0) return
    this.url.timer = 0.25
    const h = this.hashNow()
    if (h === this.url.written || h === location.hash) {
      this.url.written = h
      return
    }
    this.url.written = h
    history.replaceState(history.state, '', `${location.pathname}${location.search}${h}`)
  }

  // --- tools ---------------------------------------------------------------

  /** Settle everything that eases (the clock's easing, camera, ground, the cut) at once: for the tools. */
  settle() {
    this.ui?.settle()
    if (this._cut) {
      const c = this._cut
      if (c.phase === 'out') c.fn()
      this._cut = null
      this.pipeline.uniforms.uFade.value = 0
      c.resolve()
    }
    this.active.settle()
  }

  stats() {
    const info = this.renderer.info
    return {
      mode: this.mode,
      ...this.active.stats(),
      frameMs: +(this.frameAvg ?? 0).toFixed(1),
      calls: info.render.calls,
      triangles: info.render.triangles,
      textures: info.memory.textures,
      geometries: info.memory.geometries,
      programs: info.programs?.length ?? 0,
      quality: this.quality.level,
      gpu: this.gpu,
    }
  }

  // --- quality and size ------------------------------------------------------

  applyQuality() {
    const L = QUALITY[Math.max(0, Math.min(QUALITY.length - 1, this.quality.level))]
    this.qset = L
    this.active?.setRange?.(L.range)
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
    for (const s of [this.table, this.battle?.scene]) {
      if (!s) continue
      s.camera.aspect = w / h
      s.camera.updateProjectionMatrix()
    }
    this.sky.starUniforms.uPixel.value = dpr
  }

  // --- the frame -------------------------------------------------------------

  frame(now) {
    const dt = Math.max(0, Math.min(0.1, (now - this.last) / 1000))
    this.last = now
    this.time += dt
    this.frameAvg = this.frameAvg === undefined ? dt * 1000 : this.frameAvg + (dt * 1000 - this.frameAvg) * 0.1
    this.renderer.info.reset()
    this.camDt = this.camDt === undefined ? dt : this.camDt + (dt - this.camDt) * 0.3
    this.govern(dt)
    this.stepCut(dt)
    this.update(dt)
    this.sky.renderMap(this.renderer)
    this.pipeline.render(this.active.scene, this.active.camera)
    this.frames++
    requestAnimationFrame(this.frame)
  }

  update(dt) {
    const s = this.active
    const L = this.light
    this.sky.update(s.skyInstant(), this.time, L)
    L.uniforms.uTime.value = this.time
    s.update(this.camDt ?? dt)
    for (const u of this.updaters) u(dt, this.time)
    const pu = this.pipeline.uniforms
    pu.uSunDir.value.copy(L.sunDir)
    pu.uSunColor.value.copy(L.sunHorizon)
    pu.uFogColor.value.copy(L.horizon)
    const f = s.fog()
    this.pipeline.setFog(f.density, f.falloff)
    pu.uExposure.value = 0.55 * (1 + 2.2 * Math.pow(L.night, 1.5))
    pu.uNight.value = L.night
    this.sky.group.position.copy(s.camera.position)
    this.syncUrl(dt)
  }
}
