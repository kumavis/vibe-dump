// The far view's other mode: how the land was used in the chosen year, from
// the era layers of public/data/layers/ (DATA.md "Era layers"). Cultivation,
// settlement and native forest, tinted on the ground by the terrain shader
// (common.glsl.js applyLand) at the chain and island zooms, gone by the time
// the camera closes on a valley.
//
// Time runs over the layers' keyframes (1778, 1853, 1896, 2020). The
// manifest places every era on them, as one keyframe or between two with a
// weight; between eras the layers' year moves with the year, so the
// timeline's position s maps to a keyframe position kp, and the two
// keyframes either side of it are on the samplers with uLandT between them.
//
// A keyframe is baked whole (data/layers.js: every island's masks into one
// RGBA grid per island, and a combined grid over the archipelago) in a
// worker, behind the first frame: the year's first keyframe once the islands
// are in, so the switch has something at once, and after that whatever the
// year needs while the land is showing. Only those stay on the GPU, two at
// most but for the moment a third arrives, about 25 MB each with mipmaps.
// When the year crosses into a pair that isn't loaded, what is on screen
// holds at the nearest end until it arrives, then eases on, or fades through
// when the jump is too far to ease.
//
// App wiring (src/app.js): construct before any pack terrain (it adds the
// shared uniforms), attach() each island terrain as it arrives, load() once
// the islands are in, update(dt, k) every frame with the strength the view
// and the zoom ask for, settle() for the tools.

import * as THREE from 'three'
import { decodeImage } from '../data/image.js'
import { bakeKeyframe, decodeGrey, settlementCodec, thinFactor } from '../data/layers.js'

export const LAYERS = ['cultivation', 'settlement', 'forest']
export const LAYER_NAMES = { cultivation: 'Cultivation', settlement: 'Settlement', forest: 'Native forest' }
// the year by which the 1778 layers stand whole; before it they are thinned
// (the contact keyframe's note: the leeward field systems spread after about 1400)
export const EARLY = [1100, 1450]

const KEEP = 3 // keyframes resident at most (the pair on screen, and one arriving)
const AT = 0.002 // a keyframe position this close to a keyframe is that keyframe alone
const IDLE = 10 // seconds an unused keyframe stays before it is let go

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

function blankTexture() {
  const t = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1, THREE.RGBAFormat, THREE.UnsignedByteType)
  t.needsUpdate = true
  return t
}

/** 1 where an island pack's own heights are land, from its decoded metres (or null before they are). */
function landMask(pack) {
  const m = pack.data?.metres
  if (!m) return null
  const out = new Uint8Array(m.length)
  for (let c = 0; c < m.length; c++) out[c] = m[c] > 0 ? 1 : 0
  return out
}

function layerTexture(data, W, H, anisotropy) {
  const t = new THREE.DataTexture(data, W, H, THREE.RGBAFormat, THREE.UnsignedByteType)
  t.minFilter = THREE.LinearMipmapLinearFilter
  t.magFilter = THREE.LinearFilter
  t.generateMipmaps = true
  t.anisotropy = anisotropy
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
  t.needsUpdate = true
  // (as the pack maps: once on the GPU the bytes aren't needed here)
  t.onUpdate = () => {
    t.image.data = null
    t.onUpdate = null
  }
  return t
}

export class LandOverlay {
  constructor(app) {
    this.app = app
    this.data = app.data
    this.warn = app.warn
    this.blank = blankTexture()
    const u = app.shared.uniforms
    Object.assign(u, {
      uArchLandA: { value: this.blank },
      uArchLandB: { value: this.blank },
      uLandT: { value: 0 },
      uLandK: { value: 0 },
      uLandEarly: { value: 1 },
    })
    this.uniforms = u
    this.available = null // unknown until the manifest answers
    this.manifest = null
    this.keyframes = []
    this.resident = new Map()
    this.loading = new Map()
    this.bound = null // { a, b }: the keyframes on the samplers (a === b for one)
    this.swapTo = null
    this.kpShown = 0
    this.fade = 0
    this.fadeGoal = 0
    this.listeners = []
    this.chain = Promise.resolve()
    this.jobN = 0
    this.uploads = []
  }

  onChange(f) {
    this.listeners.push(f)
  }

  notify() {
    for (const f of this.listeners) f(this)
  }

  /** layers/manifest.json, then the keyframes the year needs. */
  async load() {
    const url = this.data.abs('layers/manifest.json')
    let m
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      m = await res.json()
      if (!Array.isArray(m?.keyframes) || !m.keyframes.length || !m.islands) throw new Error('no keyframes or islands')
    } catch (err) {
      this.available = false
      this.warn(`${url}: ${err.message} (no land layers)`)
      this.notify()
      return
    }
    this.manifest = m
    this.keyframes = [...m.keyframes].filter((k) => Number.isFinite(k.year)).sort((a, b) => a.year - b.year)
    this.kfIndex = new Map(this.keyframes.map((k, i) => [k.id, i]))
    const enc = m.encoding?.settlement || {}
    this.codec = settlementCodec(enc.d0 ?? 2, enc.dMax ?? 50000)
    const world = this.app.world
    this.islands = world.islandPacks.filter((p) => m.islands[p.id]).map((pack) => ({ pack, entry: m.islands[pack.id] }))
    const ap = world.archPack
    this.arch = { W: Math.max(1, Math.round(ap.W / 2)), H: Math.max(1, Math.round(ap.H / 2)), rect: ap.rect }
    this.eraYears = this.app.timeline.eras.map((era) => this.eraYear(era))
    this.available = true
    this.notify()
  }

  // --- time ---------------------------------------------------------------------

  /** The year an era's layers stand at, as the manifest maps it: a keyframe's, or between two by its weight. */
  eraYear(era) {
    const spec = this.manifest.eras?.[era.id]?.cultivation
    const year = (id) => this.keyframes[this.kfIndex.get(id)]?.year
    if (spec?.keyframe && year(spec.keyframe) !== undefined) return year(spec.keyframe)
    if (spec?.from && year(spec.from) !== undefined && year(spec.to) !== undefined) return year(spec.from) + (year(spec.to) - year(spec.from)) * (spec.t ?? 0)
    return era.year
  }

  /** Keyframe position of a year: 0 at the first keyframe, 1 at the second, …, clamped to the ends. */
  kpAtYear(y) {
    const K = this.keyframes
    if (K.length < 2 || y <= K[0].year) return 0
    for (let i = 0; i + 1 < K.length; i++) if (y <= K[i + 1].year) return i + (y - K[i].year) / Math.max(1e-6, K[i + 1].year - K[i].year)
    return K.length - 1
  }

  /**
   * Keyframe position at the timeline's position: at an era, where the
   * manifest puts it; between two eras, the layers' year moves with the
   * year (so 1853 is the Māhele keyframe itself, wherever the eras fall).
   */
  position(s = this.app.timeline.s) {
    const Y = this.eraYears
    if (!Y?.length) return 0
    const v = clamp(s, 0, Y.length - 1)
    const i = Math.min(Y.length - 2, Math.floor(v))
    if (i < 0) return this.kpAtYear(Y[0])
    return this.kpAtYear(Y[i] + (Y[i + 1] - Y[i]) * (v - i))
  }

  /** The two keyframes either side of kp, how far between, and which of them carry any weight. */
  bracket(kp) {
    const n = this.keyframes.length
    const id = (i) => this.keyframes[i].id
    if (n < 2) return { a: id(0), b: id(0), t: 0, need: [id(0)] }
    const a = clamp(Math.floor(kp), 0, n - 2)
    const t = clamp(kp - a, 0, 1)
    const need = t < AT ? [id(a)] : t > 1 - AT ? [id(a + 1)] : [id(a), id(a + 1)]
    return { a: id(a), b: id(a + 1), t, need }
  }

  covers(pair, kp) {
    if (!pair) return false
    return kp >= this.kfIndex.get(pair.a) - AT && kp <= this.kfIndex.get(pair.b) + AT
  }

  clampTo(pair, kp) {
    return clamp(kp, this.kfIndex.get(pair.a), this.kfIndex.get(pair.b))
  }

  // --- loading ------------------------------------------------------------------

  /** One keyframe's bake, for data/layers.js. */
  job(kf) {
    const K = this.keyframes
    const i = this.kfIndex.get(kf)
    const abs = (f) => this.data.abs(`layers/${f}`)
    const source = (entry, l) => {
      const at = (j) => entry.layers?.[K[j].id]?.[l]?.file
      if (at(i)) return abs(at(i))
      // none at this keyframe: by year between the nearest either side that have it
      let a = i - 1
      while (a >= 0 && !at(a)) a--
      let b = i + 1
      while (b < K.length && !at(b)) b++
      if (a >= 0 && b < K.length) return { from: abs(at(a)), to: abs(at(b)), t: (K[i].year - K[a].year) / (K[b].year - K[a].year) }
      if (a >= 0) return abs(at(a))
      if (b < K.length) return abs(at(b))
      return null
    }
    const enc = this.manifest.encoding?.settlement || {}
    return {
      kf,
      d0: enc.d0 ?? 2,
      dMax: enc.dMax ?? 50000,
      arch: this.arch,
      islands: this.islands.map(({ pack, entry }) => ({
        id: pack.id,
        W: pack.W,
        H: pack.H,
        f: thinFactor(Math.max(pack.mx, pack.mz)),
        rect: pack.rect,
        // where the pack is land, so averages leave the sea out (made for
        // each bake rather than kept: a bake is rare, six megabytes aren't)
        land: landMask(pack),
        layers: Object.fromEntries(LAYERS.map((l) => [l, source(entry, l)])),
      })),
    }
  }

  /** Bake keyframe kf, one at a time, unless the year has moved on by its turn. */
  request(kf) {
    const p = (this.chain = this.chain
      .catch(() => {})
      .then(() => {
        if (!this.wanted(kf)) return null
        const t0 = performance.now()
        return this.run(this.job(kf)).then((out) => {
          this.arrive(out)
          this.lastBakeMs = Math.round(performance.now() - t0)
        })
      })
      .catch((err) => this.warn(`land layers ${kf}: ${err.message}`))
      .finally(() => {
        this.loading.delete(kf)
      }))
    this.loading.set(kf, p)
    return p
  }

  wanted(kf) {
    const w = this.bracket(this.position())
    if (this.bound && this.app.view !== 'land') return false
    return w.need.includes(kf) || this.swapTo?.a === kf || this.swapTo?.b === kf
  }

  /** In the worker; on the main thread if workers can't decode images here. */
  run(job) {
    const grey = (url) => decodeGrey(decodeImage, url)
    if (!this.fallback && !this.worker) {
      try {
        this.worker = new Worker(new URL('../data/layers-worker.js', import.meta.url), { type: 'module' })
        this.worker.onmessage = (e) => this.reply(e.data)
        this.worker.onerror = (e) => {
          e.preventDefault?.()
          this.fallback = true
          const p = this.pending
          this.pending = null
          if (p) bakeKeyframe(p.job, grey).then(p.resolve, p.reject)
        }
      } catch {
        this.fallback = true
      }
    }
    if (this.fallback) return bakeKeyframe(job, grey)
    return new Promise((resolve, reject) => {
      const id = ++this.jobN
      this.pending = { id, job, resolve, reject }
      this.worker.postMessage({ ...job, job: id })
    })
  }

  reply(m) {
    const p = this.pending
    if (!p || m.job !== p.id) return
    this.pending = null
    if (m.ok) p.resolve(m.out)
    else if (/OffscreenCanvas|getContext|createImageBitmap/i.test(m.message)) {
      // (no canvas in workers here: on the main thread instead)
      this.fallback = true
      bakeKeyframe(p.job, (url) => decodeGrey(decodeImage, url)).then(p.resolve, p.reject)
    } else p.reject(new Error(m.message))
  }

  arrive(out) {
    const aniso = Math.min(4, this.app.renderer.capabilities.getMaxAnisotropy())
    const rec = {
      id: out.kf,
      arch: layerTexture(out.arch.data, out.arch.W, out.arch.H, aniso),
      // (the archipelago's grid stays here too, for the hover card)
      archData: out.arch.data,
      islands: new Map(out.islands.map((i) => [i.id, layerTexture(i.data, i.W, i.H, aniso)])),
      texels: out.arch.W * out.arch.H + out.islands.reduce((s, i) => s + i.W * i.H, 0),
      used: performance.now(),
    }
    this.resident.set(out.kf, rec)
    // Onto the GPU now, a texture a frame, rather than when something first
    // draws with it: an island the camera hasn't visited would otherwise
    // keep its bytes here for as long as the keyframe stays.
    this.uploads.push(rec.arch, ...rec.islands.values())
  }

  dropUnused() {
    const now = performance.now()
    const using = new Set([this.bound?.a, this.bound?.b, this.swapTo?.a, this.swapTo?.b, ...this.bracket(this.position()).need])
    for (const [id, rec] of this.resident) {
      if (using.has(id)) {
        rec.used = now
        continue
      }
      if (this.resident.size > KEEP || now - rec.used > IDLE * 1000) {
        rec.arch.dispose()
        for (const t of rec.islands.values()) t.dispose()
        this.resident.delete(id)
        this.uploads = this.uploads.filter((t) => t !== rec.arch && ![...rec.islands.values()].includes(t))
      }
    }
  }

  // --- the samplers -------------------------------------------------------------

  /** The pair of `want` that is resident: both, or the one of them that is. */
  resolve(want) {
    const a = this.resident.has(want.a) ? want.a : want.b
    return { a, b: this.resident.has(want.b) ? want.b : a }
  }

  /** The pair `want` on the samplers, as far as it is resident. */
  bind(want) {
    const { a: A, b: B } = this.resolve(want)
    this.bound = { a: A, b: B }
    const ra = this.resident.get(A)
    const rb = this.resident.get(B)
    const u = this.uniforms
    u.uArchLandA.value = ra.arch
    u.uArchLandB.value = rb.arch
    for (const t of this.app.world.islands) this.attach(t)
    this.notify()
  }

  /** An island terrain's own samplers: its grids of the bound pair, or nothing. */
  attach(terrain) {
    const u = terrain.uniforms
    if (!u.uOwnLandA) return
    const ra = this.bound && this.resident.get(this.bound.a)
    const rb = this.bound && this.resident.get(this.bound.b)
    u.uOwnLandA.value = ra?.islands.get(terrain.pack.id) || this.blank
    u.uOwnLandB.value = rb?.islands.get(terrain.pack.id) || this.blank
  }

  /** Every frame. k: the strength the view and the zoom ask for (0..1, eased by the app). */
  update(dt, k) {
    const u = this.uniforms
    u.uLandEarly.value = smooth(EARLY[0], EARLY[1], this.app.timeline.year)
    if (!this.available) {
      u.uLandK.value = 0
      return
    }
    const kp = this.position()
    const want = this.bracket(kp)
    // the year's keyframes load while the land is showing (and once at the
    // start, so the switch has something at once); in the chiefdoms the
    // pair already on the GPU just waits
    const active = this.app.view === 'land' || k > 0.001 || !this.bound
    if (active) for (const id of want.need) if (!this.resident.has(id) && !this.loading.has(id)) this.request(id)
    const ready = want.need.every((id) => this.resident.has(id))
    if (ready && !this.swapTo && !this.covers(this.bound, kp)) {
      // a pair that holds what is on screen takes over and eases on;
      // otherwise fade out, swap, fade in
      if (!this.bound || this.fade < 0.02) {
        this.bind(want)
        this.kpShown = this.clampTo(this.bound, kp)
      } else if (this.covers(this.resolve(want), this.kpShown)) this.bind(want)
      else this.swapTo = want
    }
    if (this.swapTo) {
      this.fadeGoal = 0
      if (this.fade < 0.02) {
        // (the year may have moved on while it faded)
        this.bind(ready ? want : this.swapTo)
        this.swapTo = null
        this.kpShown = this.clampTo(this.bound, kp)
      }
    } else this.fadeGoal = this.bound ? 1 : 0
    if (this.bound) {
      const goal = this.clampTo(this.bound, kp)
      this.kpShown += (goal - this.kpShown) * (1 - Math.exp(-dt * 8))
      if (Math.abs(goal - this.kpShown) < 1e-4) this.kpShown = goal
    }
    this.fade += (this.fadeGoal - this.fade) * (1 - Math.exp(-dt * 6))
    if (Math.abs(this.fadeGoal - this.fade) < 0.003) this.fade = this.fadeGoal
    this.apply(k)
    this.dropUnused()
    const t = this.uploads.shift()
    if (t?.image.data) this.app.renderer.initTexture(t)
  }

  apply(k) {
    const u = this.uniforms
    if (this.bound) {
      const ia = this.kfIndex.get(this.bound.a)
      const ib = this.kfIndex.get(this.bound.b)
      u.uLandT.value = ib > ia ? clamp((this.kpShown - ia) / (ib - ia), 0, 1) : 0
    }
    u.uLandK.value = k * this.fade
  }

  /** Straight to what the year asks for, if it is loaded (tools, screenshots). */
  settle(k) {
    if (!this.available) return
    const kp = this.position()
    const want = this.bracket(kp)
    if (want.need.every((id) => this.resident.has(id)) && !this.covers(this.bound, kp)) this.bind(want)
    this.swapTo = null
    if (this.bound) this.kpShown = this.clampTo(this.bound, kp)
    this.fade = this.fadeGoal = this.bound ? 1 : 0
    this.uniforms.uLandEarly.value = smooth(EARLY[0], EARLY[1], this.app.timeline.year)
    this.apply(k)
  }

  /** The year's keyframes are on the samplers and nothing is fading: for the tools. */
  get ready() {
    return !!this.available && this.covers(this.bound, this.position()) && !this.swapTo && this.fade > 0.99
  }

  // --- words --------------------------------------------------------------------

  /**
   * For the legend: the keyframe years the year is drawn from, and for each
   * layer the word that warns of a model ("modelled", "partly modelled"), or
   * none when every keyframe in use was mapped (DATA.md: the app labels
   * anything not mapped).
   */
  describe() {
    if (!this.available) return null
    const { a, b, need } = this.bracket(this.position())
    const K = this.keyframes
    const methodOf = (kf, l) => {
      const i = this.kfIndex.get(kf)
      const m = this.manifest.methods?.[kf]?.[l]?.method
      if (m || K[i].layers?.includes(l)) return m ? [m] : []
      // a layer this keyframe lacks comes from its neighbours
      const out = []
      for (let j = i - 1; j >= 0; j--) {
        const v = this.manifest.methods?.[K[j].id]?.[l]?.method
        if (v) {
          out.push(v)
          break
        }
      }
      for (let j = i + 1; j < K.length; j++) {
        const v = this.manifest.methods?.[K[j].id]?.[l]?.method
        if (v) {
          out.push(v)
          break
        }
      }
      return out
    }
    const layers = LAYERS.map((l) => {
      const ms = need.flatMap((kf) => methodOf(kf, l))
      const note = ms.includes('modelled') ? 'modelled' : ms.includes('mixed') ? 'partly modelled' : ''
      return { id: l, name: LAYER_NAMES[l], note }
    })
    const year = (id) => K[this.kfIndex.get(id)].year
    const years = need.length > 1 ? [year(a), year(b)] : [year(need[0])]
    return { years, layers, early: this.app.timeline.year < EARLY[1] }
  }

  /** The layers' values under world (x, z), from the archipelago's grid (about 560 m): for the hover card. */
  valuesAt(x, z) {
    if (!this.bound) return null
    const A = this.resident.get(this.bound.a)
    const B = this.resident.get(this.bound.b)
    if (!A || !B) return null
    const { W, H, rect: r } = this.arch
    const I = Math.floor(((x - r.x0) / (r.x1 - r.x0)) * W)
    const J = Math.floor(((z - r.z0) / (r.z1 - r.z0)) * H)
    if (I < 0 || J < 0 || I >= W || J >= H) return null
    const c = (J * W + I) * 4
    const t = this.uniforms.uLandT.value
    const at = (ch) => A.archData[c + ch] + (B.archData[c + ch] - A.archData[c + ch]) * t
    return { cultivation: at(0) / 255, people: this.codec.decode(at(1)), forest: at(2) / 255 }
  }

  /** What is loaded, for the tools: keyframes resident and an estimate of their GPU bytes (mipmaps included). */
  stats() {
    let texels = 0
    let cpu = 0
    for (const r of this.resident.values()) {
      texels += r.texels
      cpu += r.archData.byteLength
    }
    return {
      available: this.available,
      resident: [...this.resident.keys()],
      bound: this.bound ? `${this.bound.a}/${this.bound.b}` : null,
      t: +this.uniforms.uLandT.value.toFixed(3),
      k: +this.uniforms.uLandK.value.toFixed(3),
      gpuMB: +((texels * 4 * 4) / 3 / 1048576).toFixed(1),
      cpuMB: +(cpu / 1048576).toFixed(1),
      bakeMs: this.lastBakeMs ?? null,
    }
  }

  dispose() {
    for (const rec of this.resident.values()) {
      rec.arch.dispose()
      for (const t of rec.islands.values()) t.dispose()
    }
    this.resident.clear()
    this.worker?.terminate()
  }
}
