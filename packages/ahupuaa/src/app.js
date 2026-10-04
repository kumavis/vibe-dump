// Wires the generated island into a running scene.

import * as THREE from 'three'
import { HYDRO_RES, HEIGHT_RES, WORLD } from './config.js'
import { Terrain } from './render/terrain.js'
import { Ocean } from './render/ocean.js'
import { Sky } from './render/sky.js'
import { Pipeline } from './render/pipeline.js'
import { CameraRig } from './render/camera.js'
import { TerrainShadow } from './render/shadow.js'
import { Clouds } from './render/clouds.js'
import { Weather } from './weather/sim.js'
import { Features } from './features/index.js'
import { Vegetation } from './features/vegetation.js'
import { Life } from './features/life.js'
import { Streams } from './features/streams.js'
import { planFalls, Waterfalls } from './features/waterfalls.js'
import { blur, distanceTransform } from './gen/grid.js'

function dataTexture(arr, N, { filter = 'mip', format = THREE.RGBAFormat } = {}) {
  const t = new THREE.DataTexture(arr, N, N, format, THREE.UnsignedByteType)
  if (filter === 'nearest') {
    t.minFilter = THREE.NearestFilter
    t.magFilter = THREE.NearestFilter
  } else if (filter === 'linear') {
    t.minFilter = THREE.LinearFilter
    t.magFilter = THREE.LinearFilter
  } else {
    t.minFilter = THREE.LinearMipmapLinearFilter
    t.magFilter = THREE.LinearFilter
    t.generateMipmaps = true
  }
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
  t.needsUpdate = true
  return t
}

function makeLandTexture(data) {
  const N = HYDRO_RES
  const out = new Uint8Array(N * N * 4)
  const lr0 = Math.log(300)
  const lr1 = Math.log(12000)
  const rip = new Float32Array(N * N)
  for (let c = 0; c < N * N; c++) rip[c] = Math.max(0, Math.min(1, Math.log10(Math.max(1e-6, data.area[c]) / 0.04) / 1.6))
  const ripB = blur(rip, N, 2, 2)
  for (let c = 0; c < N * N; c++) {
    out[c * 4] = Math.round(255 * Math.max(0, Math.min(1, (Math.log(data.rain[c]) - lr0) / (lr1 - lr0))))
    out[c * 4 + 1] = Math.round(255 * Math.max(0, Math.min(1, data.sand[c])))
    out[c * 4 + 2] = Math.round(255 * Math.min(1, ripB[c] * 1.6))
    out[c * 4 + 3] = data.region[c * 4 + 3] // field-system mask
  }
  return dataTexture(out, N)
}

function makeSeaTexture(data) {
  const N = HYDRO_RES
  const out = new Uint8Array(N * N * 4)
  const cell = (WORLD / N) * 100 // metres
  const toLand = distanceTransform(N, (c) => data.height1024[c] > 0)
  for (let c = 0; c < N * N; c++) out[c * 4 + 3] = Math.round(255 * Math.min(1, (toLand[c] * cell) / 300))
  return { tex: dataTexture(out, N), data: out }
}

// Zone colours, from mountain to sea; moku tints (index 0 unused).
export const ZONE_COLORS = ['#8d9cc9', '#3d8a4c', '#a3d05b', '#e3b65e', '#f3e2b0', '#53d6c8', '#2a5aa8']
export const MOKU_COLORS = ['#000000', '#f0a35e', '#6fb6e8', '#f2d06b', '#9ed27a']

function makeZoneTexture(region) {
  const N = HYDRO_RES
  const cols = ZONE_COLORS.map((h) => new THREE.Color(h))
  const ch = [new Float32Array(N * N), new Float32Array(N * N), new Float32Array(N * N)]
  for (let c = 0; c < N * N; c++) {
    const z = cols[region[c * 4 + 2]] || cols[6]
    ch[0][c] = z.r
    ch[1][c] = z.g
    ch[2][c] = z.b
  }
  const bl = ch.map((a) => blur(a, N, 2, 2))
  const out = new Uint8Array(N * N * 4)
  for (let c = 0; c < N * N; c++) {
    out[c * 4] = Math.round(255 * Math.pow(bl[0][c], 1 / 2.2))
    out[c * 4 + 1] = Math.round(255 * Math.pow(bl[1][c], 1 / 2.2))
    out[c * 4 + 2] = Math.round(255 * Math.pow(bl[2][c], 1 / 2.2))
    out[c * 4 + 3] = 255
  }
  const t = dataTexture(out, N)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export class App {
  constructor(canvas, island) {
    this.canvas = canvas
    this.island = island
    this.params = new URLSearchParams(location.search)
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
    renderer.setClearColor(0x000000, 1)
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
    const empty = new THREE.DataTexture(new Uint8Array([0, 0, 0, 0]), 1, 1)
    empty.needsUpdate = true
    const d = island.data
    this.landTex = makeLandTexture(d)
    this.regionTex = dataTexture(d.region, HYDRO_RES, { filter: 'nearest' })
    this.linesTex = dataTexture(d.lines, HEIGHT_RES, { filter: 'linear' })
    this.zoneTex = makeZoneTexture(d.region)
    this.overlay = new THREE.Vector4(0, 0, 0, 0)
    this.shared = {
      uniforms: {
        uSunDir: { value: this.light.sunDir },
        uSunColor: { value: this.light.sunColor },
        uSkyColor: { value: this.light.skyColor },
        uGroundColor: { value: this.light.groundColor },
        uMoonDir: { value: this.light.moonDir },
        uMoonColor: { value: this.light.moonColor },
        uTime: { value: 0 },
        uShadow: { value: null },
        uWeather: { value: empty },
        uWeatherRect: { value: new THREE.Vector4(-WORLD, -WORLD, WORLD * 2, WORLD * 2) },
        uCloudShadowK: { value: 0 },
        uCloudMidY: { value: 15 },
        uWetness: { value: 0 },
        uLand: { value: this.landTex },
        uSkyMap: { value: null },
        uRegion: { value: this.regionTex },
        uLines: { value: this.linesTex },
        uZoneTex: { value: this.zoneTex },
        uOverlay: { value: this.overlay },
        uHover: { value: 0 },
        uFocus: { value: 0 },
        uFocusK: { value: 0 },
        uMokuColors: { value: MOKU_COLORS.map((h) => new THREE.Color(h)) },
        uWindVec: { value: new THREE.Vector2(1, 0) },
      },
    }

    // the hero falls cut their headwalls into the heightfield first, so the
    // terrain, its shadow, the trees and the stream ribbons all see the carve
    const fp = this.params.get('falls')
    this.wailele = fp === '0' ? null : planFalls(island, { carve: fp !== 'flat' })
    this.terrain = new Terrain(d, this.shared)
    this.scene.add(this.terrain.group)
    this.shadow = new TerrainShadow(this.terrain.heightTex)
    this.shared.uniforms.uShadow.value = this.shadow.texture
    const sea = makeSeaTexture(d)
    this.seaTex = sea.tex
    this.seaData = sea.data
    this.ocean = new Ocean(this.shared, this.terrain.heightTex, sea.tex)
    this.scene.add(this.ocean.mesh)
    this.sky = new Sky()
    this.scene.add(this.sky.group)
    this.shared.uniforms.uSkyMap.value = this.sky.mapRT.texture
    this.pipeline.uniforms.uSkyMap.value = this.sky.mapRT.texture

    this.weather = new Weather(d.height1024, HYDRO_RES)
    const [ss, ds] = island.meta.cloudSizes
    this.clouds = new Clouds({ shape: d.cloudShape, shapeSize: ss, detail: d.cloudDetail, detailSize: ds })
    this.clouds.uniforms.uWeather.value = this.weather.texture
    this.clouds.uniforms.uWeatherRect.value = this.weather.rect
    // the rainbow asks the land which rain the sun can reach
    this.clouds.uniforms.uShadow.value = this.shadow.texture
    this.clouds.uniforms.uHeight.value = this.terrain.heightTex
    this.shared.uniforms.uWeather.value = this.weather.texture
    this.shared.uniforms.uWeatherRect.value = this.weather.rect
    this.pipeline.atmosphere = this.clouds

    this.features = new Features(this)
    this.scene.add(this.features.group)
    this.vegetation = new Vegetation(this)
    this.scene.add(this.vegetation.group)
    this.life = new Life(this)
    this.scene.add(this.life.group)
    this.streams = new Streams(this)
    this.scene.add(this.streams.mesh)
    if (this.wailele) {
      this.waterfalls = new Waterfalls(this, this.wailele)
      this.scene.add(this.waterfalls.group)
    }
    this.flash = { t: -10, next: 0, pos: new THREE.Vector3(), k: 0 }

    this.rig = new CameraRig(this.camera, canvas, this.terrain)
    this.clock = { doy: Number(this.params.get('doy') ?? 277), hour: Number(this.params.get('hour') ?? 9.2), speed: Number(this.params.get('speed') ?? 60) }
    this.season = this.clock.doy > 120 && this.clock.doy < 300 ? 'kau' : 'hooilo'
    if (this.params.get('weather')) this.weather.setMode(this.params.get('weather'))
    this.sky.update(this.clock.doy, this.clock.hour, 0, this.light)
    this.weather.warm(6, this.light.sunDir.y, this.clock.hour, this.season)
    this.time = 0
    this.frames = 0
    this.updaters = []

    // software rendering (headless thumbnails) gets native-pixel rendering and a
    // fixed quality; everything else adapts to its frame rate
    const gl = renderer.getContext()
    const dbg = gl.getExtension('WEBGL_debug_renderer_info')
    const gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : ''
    this.software = /swiftshader|llvmpipe|software/i.test(gpu)
    // start a step below the top (full DPR 2 with MSAA is a lot of pixels) and
    // let the governor climb if there is headroom
    this.quality = { level: 2, cap: 3, avg: 16, since: 0, raisedAt: -1e9, fixed: this.software || this.params.has('fixedq') }
    if (this.params.get('q')) this.quality.level = Number(this.params.get('q'))
    this.applyQuality()

    this.resize()
    addEventListener('resize', () => this.resize())
    this.last = performance.now()
    this.frame = this.frame.bind(this)
    requestAnimationFrame(this.frame)
  }

  applyQuality() {
    const L = [
      { clouds: 0.25, steps: 26, light: 2, range: 12, dpr: 1 },
      { clouds: 0.33, steps: 34, light: 2, range: 16, dpr: 1.25 },
      { clouds: 0.42, steps: 44, light: 3, range: 19, dpr: 1.5 },
      { clouds: 0.5, steps: 56, light: 4, range: 22, dpr: 2 },
    ][Math.max(0, Math.min(3, this.quality.level))]
    this.qset = L
    this.clouds.setScale(L.clouds)
    this.clouds.uniforms.uSteps.value = L.steps
    this.clouds.uniforms.uLightSteps.value = L.light
    this.terrain.setRange(L.range)
    this.waterfalls?.setQuality(this.quality.level)
    if (this.sized) this.resize()
  }

  /**
   * Step quality down when frames run long, back up when there's headroom.
   * Every change reallocates the render targets, which is itself a hitch, so
   * it waits for a steady reading and never ping-pongs: if a step up has to be
   * taken back soon after, that level becomes the ceiling.
   */
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

  /** Kona storms, and any towering shower, throw lightning now and then. */
  lightning() {
    const W = this.weather
    const f = this.flash
    const st = W.stormiest
    const stormy = st && (W.regime === 'kona' ? st.strength > 0.35 : st.strength > 0.9)
    if (stormy && this.time > f.next && this.clock.speed > 0) {
      f.t = this.time
      f.pos.set(st.x + (Math.random() - 0.5) * 8, W.base + (W.top - W.base) * (0.3 + Math.random() * 0.4), st.z + (Math.random() - 0.5) * 8)
      f.next = this.time + 1.5 + Math.random() * (W.regime === 'kona' ? 5 : 14)
    }
    const age = this.time - f.t
    f.k = age < 0.6 ? Math.exp(-age * 9) * (0.7 + 0.3 * Math.sin(age * 70)) + (age > 0.12 && age < 0.22 ? 0.6 : 0) : 0
    this.clouds.uniforms.uFlash.value = f.k
    this.clouds.uniforms.uFlashPos.value.copy(f.pos)
    if (f.k > 0) this.light.skyColor.offsetHSL(0, 0, 0).add(new THREE.Color(0.25, 0.27, 0.35).multiplyScalar(f.k))
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
    // (the first frame's timestamp can predate the end of a long setup, so
    // never let dt go negative)
    const dt = Math.max(0, Math.min(0.1, (now - this.last) / 1000))
    this.last = now
    this.time += dt
    // the camera moves on a lightly smoothed clock, so one slow frame nudges
    // it rather than jolting it
    this.camDt = this.camDt === undefined ? dt : this.camDt + (dt - this.camDt) * 0.3
    this.govern(dt)
    this.update(dt)
    this.sky.renderMap(this.renderer)
    this.shadow.update(this.renderer, this.light.sunDir)
    this.pipeline.render(this.scene, this.camera)
    this.frames++
    requestAnimationFrame(this.frame)
  }

  update(dt) {
    const c = this.clock
    c.hour += (dt * c.speed) / 3600
    if (c.hour >= 24) {
      c.hour -= 24
      c.doy = (c.doy + 1) % 365
    }
    this.sky.update(c.doy, c.hour, this.time, this.light)
    this.shared.uniforms.uTime.value = this.time
    this.rig.update(this.camDt ?? dt)
    this.terrain.update(this.camera)
    this.ocean.update(this.camera)
    this.vegetation.update(this.camera)
    this.weather.step(dt * c.speed, this.light.sunDir.y, c.hour, this.season)
    this.life.update(dt, this.time)
    this.streams.update()
    this.waterfalls?.update(dt)
    this.lightning()
    for (const u of this.updaters) u(dt, this.time)
    const L = this.light
    const W = this.weather
    const cu = this.clouds.uniforms
    cu.uSunDir.value.copy(L.sunDir)
    cu.uSunColor.value.copy(L.sunColor)
    cu.uSkyColor.value.copy(L.skyColor)
    cu.uGroundColor.value.copy(L.groundColor)
    cu.uFogColor.value.copy(L.horizon)
    cu.uMoonDir.value.copy(L.moonDir)
    cu.uMoonColor.value.copy(L.moonColor)
    cu.uWind.value.copy(W.windOffset)
    cu.uWindDir.value.copy(W.wind)
    cu.uTime.value = this.time
    cu.uBase.value = W.base
    cu.uTop.value = W.top
    // Kona storms close the sky in; the light goes grey and flat under them
    const overcast = Math.max(0, Math.min(1, (W.state.humidity - 1.1) / 0.3))
    cu.uOvercast.value = overcast
    cu.uFarCover.value = 0.32 + overcast * 0.4
    if (overcast > 0) {
      const k = 1 - overcast * 0.65
      L.sunColor.multiplyScalar(k)
      const grey = (L.skyColor.r + L.skyColor.g + L.skyColor.b) / 3
      L.skyColor.lerp(new THREE.Color(grey, grey, grey * 1.04), overcast * 0.5).multiplyScalar(1 - overcast * 0.25)
    }
    this.shared.uniforms.uCloudShadowK.value = 2.6
    this.shared.uniforms.uCloudMidY.value = (W.base + W.top) * 0.5
    this.ocean.uniforms.uWind.value.set(W.wind.x / 9, W.wind.y / 9)
    this.shared.uniforms.uWindVec.value.set(W.wind.x / 9, W.wind.y / 9)
    const pu = this.pipeline.uniforms
    pu.uSunDir.value.copy(L.sunDir)
    pu.uSunColor.value.copy(L.sunHorizon)
    pu.uFogColor.value.copy(L.horizon)
    // eyes adjust: open up the exposure as the light goes
    pu.uExposure.value = 0.55 * (1 + 2.2 * Math.pow(L.night, 1.5))
    pu.uNight.value = L.night
    this.sky.group.position.copy(this.camera.position)
  }
}
