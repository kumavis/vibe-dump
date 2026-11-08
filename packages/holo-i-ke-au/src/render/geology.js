// The prologue's far view (DESIGN.md §13): the sea floor and the islands of
// the stage the step names, drawn from the geology's height images
// (data/geology.js) in place of the packs, under a sea made clear enough to
// read the floor; the islands carried along the hotspot's drift by the
// clock's age; the debris fields a step names lit on the floor, with their
// blocks named; and a slide run as a diagram: the flank whole, then the mass
// sketched running out along the field to its far edge as the stage
// crossfades to the one after it.
//
// Resources live only while the prologue is open: the seafloor pack's height
// texture, two stage textures whose contents are swapped as the age crosses
// from stage to stage (never a mesh rebuilt), the fields' mask, and one
// fixed grid. On leaving, the sea eases back to opaque, the main view takes
// over again and every one of them is let go.

import * as THREE from 'three'
import { geologyVertex, geologyFragment } from './shaders/geology.glsl.js'
import { GeologyDecoder, driftAt } from '../data/geology.js'
import { geometryPoint } from '../geo.js'

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}
// the abyssal plain beyond the seafloor box, metres
const ABYSS = -4800
// decoded stages kept on the CPU (half floats, about 7 MB each at 2048)
const KEEP = 4
// how long the slide's run takes, seconds
const SLIDE_S = 5.5
// the grid: so many quads across the box, and rings of growing quads beyond it to the horizon
const GRID = 384
const RINGS = 10

function heightTex(W, H, data) {
  const t = new THREE.DataTexture(data, W, H, THREE.RedFormat, THREE.HalfFloatType)
  t.minFilter = THREE.LinearFilter
  t.magFilter = THREE.LinearFilter
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
  t.generateMipmaps = false
  t.needsUpdate = true
  return t
}

/** A grid in world xz over rect r: GRID quads across it, and RINGS of quads growing outward to `far`. */
function gridGeometry(r, far) {
  const axis = (a, b) => {
    const inner = []
    for (let i = 0; i <= GRID; i++) inner.push(a + ((b - a) * i) / GRID)
    const step = (b - a) / GRID
    const k = Math.pow(far / step, 1 / RINGS)
    const lo = []
    const hi = []
    let d = step
    for (let i = 0; i < RINGS; i++) {
      d *= k
      lo.unshift(a - d)
      hi.push(b + d)
    }
    return [...lo, ...inner, ...hi]
  }
  const xs = axis(r.x0, r.x1)
  const zs = axis(r.z0, r.z1)
  const nx = xs.length
  const nz = zs.length
  const pos = new Float32Array(nx * nz * 3)
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const k = (j * nx + i) * 3
    pos[k] = xs[i]
    pos[k + 2] = zs[j]
  }
  const idx = new Uint32Array((nx - 1) * (nz - 1) * 6)
  let n = 0
  for (let j = 0; j < nz - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const a = j * nx + i
    const b = a + 1
    const c = a + nx
    const d = c + 1
    idx[n++] = a
    idx[n++] = c
    idx[n++] = b
    idx[n++] = b
    idx[n++] = c
    idx[n++] = d
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setIndex(new THREE.BufferAttribute(idx, 1))
  return g
}

export class Geology {
  constructor(app, geo) {
    this.app = app
    this.geo = geo
    this.proj = app.data.proj
    this.sf = geo.seafloor
    this.stages = new Map(geo.stages.map((s) => [s.id, s]))
    this.group = new THREE.Group()
    this.group.visible = false
    app.scene.add(this.group)
    this.want = false
    this.k = 0 // how clear the sea is, 0..1, and with it how much of the view is the prologue's
    this.cache = new Map() // stage id → { promise, data }
    this.slots = [null, null] // the two stage textures' contents, by stage id
    this.keys = null // { from, fromAge, to, toAge } while the tour drives the crossfade
    this.lit = []
    this.slide = null
    this.marks = []
    this.loads = 0
    this.uploads = 0
    this.releases = 0
    const r = this.sf.rect
    const shared = app.shared.uniforms
    this.uniforms = {
      uSunDir: shared.uSunDir,
      uSunColor: shared.uSunColor,
      uSkyColor: shared.uSkyColor,
      uGroundColor: shared.uGroundColor,
      uMoonDir: shared.uMoonDir,
      uMoonColor: shared.uMoonColor,
      uTime: shared.uTime,
      uSkyMap: shared.uSkyMap,
      uVert: shared.uVert,
      uGeoRect: { value: new THREE.Vector4(r.x0, r.z0, r.x1, r.z1) },
      uStageA: { value: null },
      uStageB: { value: null },
      uStageMix: { value: 0 },
      uSeafloor: { value: null },
      uDrift: { value: new THREE.Vector2() },
      uAbyss: { value: ABYSS },
      uTexel: { value: new THREE.Vector2(1 / this.sf.W, 1 / this.sf.H) },
      uClear: { value: 0 },
      uField: { value: null },
      uFieldK: { value: 0 },
      uSlideAxis: { value: new THREE.Vector4(0, 0, 1, 0) },
      uSlide: { value: new THREE.Vector4(1, 1, 1, 0) },
      uHotspot: { value: new THREE.Vector3(0, 0, 0) },
    }
    if (geo.hotspot.at) this.uniforms.uHotspot.value.set(geo.hotspot.at[0], geo.hotspot.at[1], 35)
  }

  /** The prologue opens: start reading the sea floor (and the stage asked for). */
  enter() {
    this.want = true
    if (!this.decoder) this.decoder = new GeologyDecoder(this.app.warn)
    if (!this.sfTex && !this.sfLoading) {
      this.sfLoading = this.decoder.decode(this.sf, this.sf.W, this.sf.H).then(
        (d) => {
          this.sfLoading = null
          // (left while the decode was under way, and let go since)
          if (!this.want && this.k <= 0) return
          this.sfData = d
          this.sfTex = heightTex(this.sf.W, this.sf.H, d.half)
          this.loads++
          this.build()
        },
        (err) => {
          this.sfLoading = null
          this.app.warn(`geology: ${err.message}`)
        },
      )
    }
  }

  /** And closes: the sea eases back, then everything goes (update). */
  leave() {
    this.want = false
    this.keys = null
    this.slide = null
  }

  /** Whether the prologue's view stands in for the main one this frame. */
  get covers() {
    return this.group.visible
  }

  build() {
    if (this.mesh) return
    const r = this.sf.rect
    const geometry = gridGeometry(r, 250000)
    // the two stage textures, made once and given each stage's heights as the age needs it
    const blank = new Uint16Array(this.sf.W * this.sf.H)
    this.tex = [heightTex(this.sf.W, this.sf.H, blank), heightTex(this.sf.W, this.sf.H, blank)]
    this.slots = [null, null]
    this.material = new THREE.ShaderMaterial({ vertexShader: geologyVertex, fragmentShader: geologyFragment, uniforms: this.uniforms })
    this.mesh = new THREE.Mesh(geometry, this.material)
    this.mesh.frustumCulled = false
    this.group.add(this.mesh)
    this.uniforms.uStageA.value = this.sfTex
    this.uniforms.uStageB.value = this.sfTex
    this.uniforms.uSeafloor.value = this.sfTex
    this.fieldCanvas = document.createElement('canvas')
    this.fieldCanvas.width = 1024
    this.fieldCanvas.height = Math.max(1, Math.round((1024 * this.sf.H) / this.sf.W))
    this.fieldTex = new THREE.CanvasTexture(this.fieldCanvas)
    this.fieldTex.flipY = false
    this.fieldTex.generateMipmaps = false
    this.fieldTex.minFilter = THREE.LinearFilter
    this.uniforms.uField.value = this.fieldTex
    this.drawFields()
  }

  /** Let go of every texture and the grid. */
  release() {
    this.group.visible = false
    if (this.mesh) {
      this.group.remove(this.mesh)
      this.mesh.geometry.dispose()
      this.material.dispose()
      this.mesh = null
    }
    for (const t of this.tex || []) t.dispose()
    this.tex = null
    this.sfTex?.dispose()
    this.sfTex = null
    this.sfData = null
    this.fieldTex?.dispose()
    this.fieldTex = null
    this.fieldCanvas = null
    this.uniforms.uStageA.value = null
    this.uniforms.uStageB.value = null
    this.uniforms.uSeafloor.value = null
    this.uniforms.uField.value = null
    this.slots = [null, null]
    this.cache.clear()
    this.decoder?.dispose()
    this.decoder = null
    for (const m of this.marks) m.el.remove()
    this.marks = []
    this.releases++
  }

  // --- stages -------------------------------------------------------------------

  /** A stage's decoded heights: the seafloor's for the present, else read (and kept a while). */
  load(id) {
    const st = this.stages.get(id)
    if (!st) return null
    if (st.seafloor) return this.sfData ? Promise.resolve(this.sfData) : null
    let c = this.cache.get(id)
    if (!c) {
      if (!this.decoder) return null
      c = { data: null, used: performance.now() }
      c.promise = this.decoder.decode(st, this.sf.W, this.sf.H).then(
        (d) => {
          c.data = d
          this.loads++
        },
        (err) => {
          this.app.warn(`geology: stage ${id}: ${err.message}`)
          this.cache.delete(id)
        },
      )
      this.cache.set(id, c)
      // (the least lately used goes, past KEEP)
      if (this.cache.size > KEEP) {
        const old = [...this.cache.entries()].filter(([k]) => !this.slots.includes(k)).sort((a, b) => a[1].used - b[1].used)[0]
        if (old) this.cache.delete(old[0])
      }
    }
    c.used = performance.now()
    return c.promise
  }

  ready(id) {
    const st = this.stages.get(id)
    if (!st) return false
    return st.seafloor ? !!this.sfTex : !!this.cache.get(id)?.data
  }

  /** The texture holding stage id, giving it a slot (not the one `keep` is in) if it has none. */
  texFor(id, keep) {
    const st = this.stages.get(id)
    if (st.seafloor) return this.sfTex
    let s = this.slots.indexOf(id)
    if (s < 0) {
      s = this.slots[0] === keep ? 1 : 0
      const t = this.tex[s]
      t.image.data = this.cache.get(id).data.half
      t.needsUpdate = true
      this.slots[s] = id
      this.uploads++
    }
    return this.tex[s]
  }

  /** The stage a step names, and the age it stands at: the crossfade runs from what is drawn now as the clock eases there. */
  show(stageId, age, { jump = false } = {}) {
    if (!this.stages.has(stageId)) {
      this.app.warn(`geology: no stage “${stageId}”`)
      this.keys = null
      return
    }
    this.load(stageId)
    const now = this.app.geoClock.age
    const from = this.drawn?.b && this.drawn.mix > 0.5 ? this.drawn.b : this.drawn?.a
    this.keys = jump || !from ? { from: stageId, fromAge: age, to: stageId, toAge: age } : { from, fromAge: now, to: stageId, toAge: age }
    this.slide = null
  }

  /** The viewer has taken the clock (ui.onScrubAge): the step's hold lets go, and the stages follow the age. */
  free() {
    if (!this.slide) this.keys = null
  }

  /** The two stages at the clock's age and how far between (one, at either end of a crossfade). */
  pair(A) {
    const p = this.pairAt(A)
    if (p.mix >= 1 - 1e-4) return { a: p.b, b: p.b, mix: 0 }
    if (p.mix <= 1e-4) return { a: p.a, b: p.a, mix: 0 }
    return p
  }

  /** The tour's keys, a slide's run, or (wandering) the stages either side of the age. */
  pairAt(A) {
    const clk = this.app.geoClock
    if (this.slide) {
      const t = Math.max(0, this.slide.t) / SLIDE_S
      return { a: this.slide.from, b: this.slide.to, mix: smooth(0.06, 0.5, t) }
    }
    const K = this.keys
    if (K) {
      // the tour's stretch, from the age the step was opened at to its own:
      // one stage held over it (a step on the stage already drawn), or the
      // two crossfaded along it. A step's stage is held while the clock eases
      // to it, so the land never goes by the stages' own ages between two
      // steps on one stage (the Honolulu vents at 0.5 Ma on the stage of
      // 0.3, between steps on that stage, once crossfaded back toward 0.6)
      const lo = Math.min(K.fromAge, K.toAge)
      const hi = Math.max(K.fromAge, K.toAge)
      if (A >= lo - 1e-6 && A <= hi + 1e-6) {
        if (K.from === K.to || hi - lo < 1e-9) return { a: K.to, b: K.to, mix: 0 }
        return { a: K.from, b: K.to, mix: clamp((clk.uAt(A) - clk.uAt(K.fromAge)) / (clk.uAt(K.toAge) - clk.uAt(K.fromAge)), 0, 1) }
      }
      // (the clock taken off the tour's stretch is wandering: by the stages' own ages)
      this.keys = null
    }
    const S = this.geo.stages
    if (A >= S[0].age) return { a: S[0].id, b: S[0].id, mix: 0 }
    for (let i = 0; i + 1 < S.length; i++) {
      if (A <= S[i].age && A >= S[i + 1].age) {
        const t = (clk.uAt(A) - clk.uAt(S[i].age)) / Math.max(1e-6, clk.uAt(S[i + 1].age) - clk.uAt(S[i].age))
        return { a: S[i].id, b: S[i + 1].id, mix: clamp(t, 0, 1) }
      }
    }
    const last = S[S.length - 1].id
    return { a: last, b: last, mix: 0 }
  }

  // --- fields and slides ----------------------------------------------------------

  /** The debris fields to light (a step's `landslides`). */
  light(ids = []) {
    const want = ids.filter((id) => this.geo.fields.has(id))
    if (want.join() === this.lit.join()) return
    this.lit = want
    this.drawFields()
    this.makeMarks()
  }

  drawFields() {
    const c = this.fieldCanvas
    if (!c) return
    const ctx = c.getContext('2d')
    ctx.clearRect(0, 0, c.width, c.height)
    const [w, s, e, n] = this.geo.manifest.seafloor.bounds
    const at = ([lon, lat]) => [((lon - w) / (e - w)) * c.width, ((n - lat) / (n - s)) * c.height]
    const path = (ring) => {
      ctx.beginPath()
      ring.forEach((p, i) => (i ? ctx.lineTo(...at(p)) : ctx.moveTo(...at(p))))
      ctx.closePath()
    }
    ctx.globalCompositeOperation = 'lighter'
    for (const id of this.lit) {
      const f = this.geo.fields.get(id)
      path(f.ring)
      ctx.fillStyle = '#ff0000'
      ctx.fill()
      ctx.strokeStyle = '#00ff00'
      ctx.lineWidth = 2
      ctx.stroke()
      if (f.scarRing) {
        path(f.scarRing)
        ctx.strokeStyle = '#0000ff'
        ctx.setLineDash([4, 3])
        ctx.stroke()
        ctx.setLineDash([])
      }
    }
    if (this.fieldTex) this.fieldTex.needsUpdate = true
  }

  /** The named blocks of the lit fields: marked points, as the pins are, riding the drift. */
  makeMarks() {
    for (const m of this.marks) m.el.remove()
    this.marks = []
    const root = this.app.ui?.root
    if (!root) return
    for (const id of this.lit) {
      const f = this.geo.fields.get(id)
      for (const b of f.blocks) {
        const c = b.coordinates || b.geometry?.coordinates
        const name = b.name || b.properties?.name
        if (!c || !name) continue
        const el = document.createElement('div')
        el.className = 'geo-mark'
        el.innerHTML = '<i></i><span></span>'
        el.lastChild.textContent = name
        root.appendChild(el)
        const [x, z] = this.proj.toWorld(c)
        this.marks.push({ el, x, z, field: id, name, shown: false, along: 0 })
      }
    }
  }

  /**
   * The axis a field runs along: from its scar, else its volcano's summit
   * (volcanoes.json), out through the far edge of its spread, in the stage's
   * frame. A field with neither runs from its own centre toward its farthest
   * edge. The length and the width are never under a world unit: the shader
   * divides by both.
   */
  fieldAxis(f) {
    const ring = f.ring.map((p) => this.proj.toWorld(p))
    let o = null
    if (f.scarRing) o = this.proj.toWorld(geometryPoint({ type: 'Polygon', coordinates: [f.scarRing] }))
    else {
      const v = this.geo.volcanoes?.get(f.volcano)
      if (v?.at) o = v.at
    }
    const c = this.proj.toWorld(geometryPoint({ type: 'Polygon', coordinates: [f.ring] }))
    if (!o) o = c
    let dx = c[0] - o[0]
    let dz = c[1] - o[1]
    if (Math.hypot(dx, dz) < 1e-3) {
      // (the origin at the centre: toward the farthest point of the ring)
      let far = 0
      for (const [x, z] of ring) {
        const d = Math.hypot(x - o[0], z - o[1])
        if (d > far) {
          far = d
          dx = x - o[0]
          dz = z - o[1]
        }
      }
    }
    const L0 = Math.hypot(dx, dz) || 1
    dx /= L0
    dz /= L0
    let len = 0
    let wide = 0
    for (const [x, z] of ring) {
      len = Math.max(len, (x - o[0]) * dx + (z - o[1]) * dz)
      wide = Math.max(wide, Math.abs(-(x - o[0]) * dz + (z - o[1]) * dx))
    }
    return { o, d: [dx, dz], len: Math.max(1, len), wide: Math.max(1, wide) }
  }

  /**
   * Run a slide: the mass running out along the field over a few seconds
   * from where the flank stood, the wash behind it, after `delay` seconds of
   * the ground as it was; and where the slide made the step's stage (see
   * slideOf), the stage before it crossfading to it as the mass goes.
   * Replayable.
   */
  playSlide(step, { delay = 0, prev = null } = {}) {
    const run = this.slideOf(step, prev)
    if (!run) return false
    const { id, from, to } = run
    this.load(from)
    this.load(to)
    const ax = this.fieldAxis(this.geo.fields.get(id))
    this.slide = { id, from, to, t: -Math.max(0, delay), ax, step: step.id }
    this.keys = { from: to, fromAge: step.age, to, toAge: step.age }
    const u = this.uniforms
    u.uSlideAxis.value.set(ax.o[0], ax.o[1], ax.d[0], ax.d[1])
    u.uSlide.value.set(ax.len, ax.wide, 0, 0)
    return true
  }

  /**
   * What a slide step runs, given the step before it in the tour: its field
   * (the first it lights that the step before did not, else its first); and
   * the stages, from the step's `from` where it names one, else from the step
   * before's stage where the field has a scar (the flank it took, refilled
   * in the stage before) and that stage is another, else none (the step's
   * own stage throughout: the slide is laid on it, not made by it). Null
   * without a field.
   */
  slideOf(step, prev = null) {
    const ids = (step?.landslides || []).filter((x) => this.geo.fields.has(x))
    const to = step?.stage
    if (!ids.length || !this.stages.has(to)) return null
    const id = ids.find((x) => !(prev?.landslides || []).includes(x)) || ids[0]
    let from = to
    if (step.from && this.stages.has(step.from)) from = step.from
    else if (this.geo.fields.get(id).scarRing && prev?.stage && prev.stage !== to && this.stages.has(prev.stage)) from = prev.stage
    return { id, from, to, fresh: ids.some((x) => !(prev?.landslides || []).includes(x)) }
  }

  canSlide(step) {
    return !!this.slideOf(step)
  }

  /** Skip the sea's easing in or out (app.settle, the tools): up, or let go. */
  settle() {
    if (this.want && this.mesh) this.k = 1
    else if (!this.want) this.k = 0
    this.update(0)
  }

  /** Skip to the end of a running slide (the tools). */
  finishSlide() {
    if (this.slide) this.slide.t = SLIDE_S
    this.update(0)
  }

  // --- the frame --------------------------------------------------------------------

  update(dt) {
    const want = this.want && !!this.mesh
    const ease = 1 - Math.exp(-dt * 2.2)
    this.k += ((want ? 1 : 0) - this.k) * ease
    if (Math.abs((want ? 1 : 0) - this.k) < 0.004) this.k = want ? 1 : 0
    if (!this.want && this.k <= 0) {
      if (this.mesh || this.sfTex) this.release()
      return
    }
    if (!this.mesh) return
    const A = this.app.geoClock.age
    const u = this.uniforms
    // the slide, if one is running: its front out along the field, the body
    // easing in at the scar and fading at the far edge
    const sl = this.slide
    if (sl && (!this.ready(sl.from) || !this.ready(sl.to))) {
      // (waiting for its stages: the flank whole until then)
    } else if (sl) {
      sl.t = Math.min(SLIDE_S, sl.t + dt)
      const t = Math.max(0, sl.t) / SLIDE_S
      u.uSlide.value.z = smooth(0.08, 0.92, t)
      u.uSlide.value.w = sl.t > 0 ? smooth(0.02, 0.15, t) * (1 - smooth(0.82, 1, t)) : 0
      if (sl.t >= SLIDE_S) {
        u.uSlide.value.set(sl.ax.len, sl.ax.wide, 1, 0)
        this.slide = null
        this.slides = (this.slides || 0) + 1
      }
    } else u.uSlide.value.set(1, 1, 1, 0)
    // the stages either side and the crossfade, from what is loaded
    const p = this.pair(A)
    this.load(p.a)
    this.load(p.b)
    let a = p.a
    let b = p.b
    let mix = p.mix
    if (!this.ready(b)) {
      b = a
      mix = 0
    }
    if (!this.ready(a)) {
      a = this.ready(b) ? b : (this.drawn?.a ?? 'present')
      if (!this.ready(a)) a = 'present'
      if (!this.ready(b)) b = a
      if (a === b) mix = 0
    }
    if (this.ready(a) && this.ready(b)) {
      u.uStageA.value = this.texFor(a, b)
      u.uStageB.value = this.texFor(b, a)
      u.uStageMix.value = a === b ? 0 : mix
      this.drawn = { a, b, mix: u.uStageMix.value }
    }
    const [dx, dz] = driftAt(this.geo.hotspot, A)
    u.uDrift.value.set(dx, dz)
    u.uClear.value = this.k
    u.uFieldK.value += ((this.lit.length ? 1 : 0) - u.uFieldK.value) * (1 - Math.exp(-dt * 3))
    if (!dt) u.uFieldK.value = this.lit.length ? 1 : 0
    this.group.visible = true
    this.updateMarks(dx, dz)
  }

  updateMarks(dx, dz) {
    if (!this.marks.length) return
    const cam = this.app.camera
    const v = this._v || (this._v = new THREE.Vector3())
    const W = innerWidth
    const H = innerHeight
    const sl = this.slide
    const vert = this.uniforms.uVert.value
    for (const m of this.marks) {
      const x = m.x + dx
      const z = m.z + dz
      // (during a run, a block shows once the front has passed it)
      let show = this.k > 0.5 && this.uniforms.uFieldK.value > 0.5
      if (sl && sl.id === m.field) {
        const along = ((m.x - sl.ax.o[0]) * sl.ax.d[0] + (m.z - sl.ax.o[1]) * sl.ax.d[1]) / Math.max(1, sl.ax.len)
        show = show && along <= this.uniforms.uSlide.value.z
      }
      v.set(x, this.metresAt(x, z) * vert, z).project(cam)
      const sx = ((v.x + 1) / 2) * W
      const sy = ((1 - v.y) / 2) * H
      show = show && v.z < 1 && sx > 0 && sx < W && sy > 84 && sy < H
      if (show !== m.shown) {
        m.shown = show
        m.el.classList.toggle('show', show)
      }
      if (show) m.el.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px)`
    }
  }

  /** The drawn ground at world (x, z), metres, from the coarse copies (the CPU's view of the shader's). */
  metresAt(x, z) {
    const d = this.drawn
    if (!d) return ABYSS
    const [dx, dz] = driftAt(this.geo.hotspot, this.app.geoClock.age)
    const qa = this.coarseAt(d.a, x - dx, z - dz)
    const qb = d.b === d.a ? qa : this.coarseAt(d.b, x - dx, z - dz)
    return qa + (qb - qa) * d.mix
  }

  coarseAt(id, x, z) {
    const st = this.stages.get(id)
    const D = st?.seafloor ? this.sfData : this.cache.get(id)?.data
    if (!D) return ABYSS
    const r = this.sf.rect
    const u = (x - r.x0) / (r.x1 - r.x0)
    const v = (z - r.z0) / (r.z1 - r.z0)
    if (u < 0 || v < 0 || u > 1 || v > 1) return ABYSS
    const i = Math.min(D.cw - 1, Math.floor(u * D.cw))
    const j = Math.min(D.ch - 1, Math.floor(v * D.ch))
    return D.coarse[j * D.cw + i]
  }

  /** What it holds and draws, for the tools. */
  stats() {
    const u = this.uniforms
    const texMB = (this.sfTex ? 1 : 0) * this.sf.W * this.sf.H * 2 + (this.tex ? 2 : 0) * this.sf.W * this.sf.H * 2 + (this.fieldTex ? this.fieldCanvas.width * this.fieldCanvas.height * 4 : 0)
    return {
      want: this.want,
      on: this.covers,
      k: +this.k.toFixed(3),
      seafloor: !!this.sfTex,
      size: [this.sf.W, this.sf.H],
      slots: [...this.slots],
      drawn: this.drawn ? { ...this.drawn, mix: +this.drawn.mix.toFixed(3) } : null,
      bound: [u.uStageA.value === this.sfTex ? 'seafloor' : this.tex?.indexOf(u.uStageA.value) ?? -1, u.uStageB.value === this.sfTex ? 'seafloor' : this.tex?.indexOf(u.uStageB.value) ?? -1],
      drift: [+u.uDrift.value.x.toFixed(2), +u.uDrift.value.y.toFixed(2)],
      lit: [...this.lit],
      fieldK: +u.uFieldK.value.toFixed(3),
      slide: this.slide ? { id: this.slide.id, from: this.slide.from, to: this.slide.to, t: +this.slide.t.toFixed(2), front: +u.uSlide.value.z.toFixed(3), body: +u.uSlide.value.w.toFixed(3) } : null,
      marks: this.marks.filter((m) => m.shown).map((m) => m.name),
      cached: [...this.cache.keys()],
      gpuMB: +(texMB / 1048576).toFixed(1),
      slides: this.slides || 0,
      loads: this.loads,
      uploads: this.uploads,
      releases: this.releases,
    }
  }
}
