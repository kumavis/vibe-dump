// The works (DATA.md "Works, dated"; DESIGN.md §2): military land, airfields,
// highways, rail and harbour works, each drawn from its construction to its
// closing or return, at the island zoom and down into a district.
//
// works/manifest.json is read when the first island takes its slot
// (render/world.js), and an island's own file while it holds one: fetched
// and decoded in a worker (data/works.js) into the few buffers below, built
// once, every year at once, and let go LINGER seconds after the island has
// given its slot up, GPU and CPU both. A data set without works draws none.
//
// What an island draws, one draw call each:
//
// - the washes: military land translucent, a range fainter and hatched, an
//   airfield lighter; every vertex looks the ground up in the vertex shader
//   (common.glsl.js groundMetres), as the boundaries do, so a wash lies on
//   whatever ground is drawn there, the island's or a district's lidar, its
//   patches and the exaggeration of the moment; military land lies on the
//   sea where it is water (Pearl Harbor's lochs), a range and a field fade
//   out over it;
// - the military land's boundary, dashed, draped the same way and widened on
//   the screen like the moku lines (render/lines.js);
// - the ribbons (features/ribbons.js): runways and roads paved, to their
//   width in metres (a road's by its class: an interstate about 24 m, a
//   state road 12, a county road 8), piers and breakwaters stone on the
//   water, rail a thin dark line with its ties at the near zoom; draped on
//   the ground as the district's streams and trails are, from a point every
//   25 m within some kilometres of the camera as it comes down, and every
//   100 m beyond and at the island zoom;
// - the blocks: hangars, barracks and concrete blocks (buildings.js
//   worksKits), by their storeys, instanced, standing on the ground drawn
//   under them now (world.metresAt, refreshed as the district comes and
//   goes), each floor set into the slope at the mean of the ground under its
//   footprint and its footing taking up the fall, near in only, as the
//   towns' buildings are;
// - and the names of the military land, the airfields and the named highways
//   at the island zoom (features/labels.js), clear of the place names.
//
// The year is a uniform (uYearNow, eased as the towns ease theirs): every
// vertex and instance carries its work's years (data/works.js workSpan), so
// dragging the year never rebuilds anything. What is far off draws nothing:
// an island out of its slot has nothing on the GPU, and at the whole chain
// none is in one; the Land view's legend names the military land while any
// of it is drawn on the island in view (legendRows).

import * as THREE from 'three'
import { constants, noise, world, ground, lighting } from '../render/shaders/common.glsl.js'
import { Ribbons } from './ribbons.js'
import { Labels } from './labels.js'
import { Y, objectMaterial } from './kit.js'
import { worksKits } from './buildings.js'
import { mulberry32, LIFT } from './settlements.js'
import { decodeWorks, workWeight, WorksExclusion, LOOKS } from '../data/works.js'

// how long an island's works are kept after it gave its slot up (s)
const LINGER = 30
// the camera's distance over which the blocks come in (as the towns' do,
// a little further out, being larger), and their own fade by their distance
const BLOCK_RIG = [150, 230]
const BLOCK_FADE = [160, 240]
// the names' zoom: from the island zoom in to where the place names begin
const LABEL_RIG = [95, 150]
// the ribbons are drawn from their fine points within a few times the
// camera's distance of it, once it is closer in than RIBBON_FINE, and from
// the coarse beyond (each segment by its middle, in the vertex shader)
const RIBBON_FINE = 280
const fineReach = (d) => (d < RIBBON_FINE ? Math.max(60, d * 4) : 0)
// the blocks' scale, world units per metre: a little over life, as a hangar
// is a large thing already; a footprint from the file is kept at its size
const WORKS_S = 0.013
// where a block's ground is read under its footprint, in its half extents:
// its middle, its corners and the middles of its sides
const BLOCK_SAMPLES = [[0, 0], [-1, -1], [1, -1], [1, 1], [-1, 1], [0, -1], [1, 0], [0, 1], [-1, 0]]

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** The washes' and the boundary's strength by the camera's distance: whole at the island zoom, lighter over a valley. */
export const washZoom = (d) => 0.5 + 0.5 * smooth(45, 140, d)

// the looks, in the scene's linear light
const lin = (hex) => new THREE.Color(hex).toArray()
const TONES = [lin('#a65a49'), lin('#a65a49'), lin('#b9bdbd')]
const TONE_A = [0.42, 0.26, 0.4]
const EDGE = lin('#e09a7c')
const LOOK = {
  runway: { mode: 'paved', colour: lin('#aaa69c'), minPx: 1.3, lift: 0.006, alpha: 0.95, marks: true },
  road: { mode: 'paved', colour: lin('#6e6a64'), minPx: 1.0, lift: 0.005, alpha: 0.85 },
  stone: { mode: 'stone', colour: lin('#958b80'), minPx: 1.1, lift: 0.012, alpha: 0.95 },
  // (never thinner than about the military land's dashes, 1.5 px, so a railway reads at the island zoom)
  rail: { mode: 'rail', colour: lin('#2a2522'), minPx: 1.6, lift: 0.007, alpha: 0.9 },
}

const washVertex = /* glsl */ `
${constants}
${world}
${ground}
in vec4 aSpan;
in float aTone;
uniform vec3 uCamPos;
uniform float uYearNow;
out float vW;
out float vTone;
out float vGround;
out vec3 vWorld;
void main() {
  // (a polygon's vertices share its years: one not standing is not drawn at all)
  float w = smoothstep(aSpan.x, aSpan.y, uYearNow) * (1.0 - smoothstep(aSpan.z, aSpan.w, uYearNow));
  vW = w;
  vTone = aTone;
  if (w <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vec2 xz = position.xz;
  float g = groundMetres(xz);
  vGround = g;
  vec3 p = vec3(xz.x, max(g, 0.0) * uVert, xz.y);
  vWorld = p;
  // The ground under a cell of the wash is drawn finer than its corners
  // sample it; drawn a little toward the eye (as the ribbons are), the wash
  // keeps over the ridges between them, and on the screen it doesn't move.
  vec3 toCam = uCamPos - p;
  float dc = length(toCam);
  p += toCam / max(dc, 1e-3) * min(dc * 0.015, 3.0);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
}
`

const washFragment = /* glsl */ `
${constants}
${noise}
${world}
${lighting}
uniform vec3 uTone[3];
uniform vec3 uToneA;
uniform float uAlpha;
uniform float uHatch;   // world units between a range's hatch lines
in float vW;
in float vTone;
in float vGround;
in vec3 vWorld;
void main() {
  int t = int(vTone + 0.5);
  // (military land may be water, as Pearl Harbor's lochs are; a range and a field keep to the land)
  float a = vW * uAlpha * uToneA[t] * (t == 0 ? 1.0 : smoothstep(-1.5, 0.5, vGround));
  if (t == 1) {
    // a range: hatched, the lines averaged out once they are finer than a few pixels
    float u = (vWorld.x - vWorld.z) / uHatch;
    float f = abs(fract(u) - 0.5) * 2.0;
    float aa = 1.0 - smoothstep(0.25, 0.6, fwidth(u));
    a *= mix(1.0, 0.45 + 1.4 * (1.0 - smoothstep(0.55, 0.75, f)), aa);
  }
  if (a <= 0.003) discard;
  vec3 col = uTone[t] * (uSunColor * max(uSunDir.y, 0.0) * 0.75 + uSkyColor * 0.9);
  gl_FragColor = vec4(col, a);
}
`

const edgeVertex = /* glsl */ `
${constants}
${world}
${ground}
in vec4 aSeg;   // the segment's ends: ax, az, bx, bz
in vec2 aS;     // the distance along its ring at each end (world units)
in vec4 aSpan;
uniform vec2 uResolution;
uniform float uWidth;
uniform vec3 uCamPos;
uniform float uYearNow;
out float vS;
out float vW;
vec3 draped(vec2 xz) {
  vec3 p = vec3(xz.x, max(groundMetres(xz), 0.0) * uVert, xz.y);
  p.y += 0.015 + distance(uCamPos, p) * 0.0022;
  return p;
}
void main() {
  float w = smoothstep(aSpan.x, aSpan.y, uYearNow) * (1.0 - smoothstep(aSpan.z, aSpan.w, uYearNow));
  vW = w;
  if (w <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vec3 A = draped(aSeg.xy);
  vec3 B = draped(aSeg.zw);
  mat4 pv = projectionMatrix * viewMatrix;
  vec4 ca = pv * vec4(A, 1.0);
  vec4 cb = pv * vec4(B, 1.0);
  const float W0 = 1e-3;
  if (ca.w < W0 && cb.w < W0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  if (ca.w < W0) ca = mix(ca, cb, (W0 - ca.w) / (cb.w - ca.w));
  if (cb.w < W0) cb = mix(cb, ca, (W0 - cb.w) / (ca.w - cb.w));
  vec2 sa = ca.xy / ca.w;
  vec2 sb = cb.xy / cb.w;
  vec2 d = (sb - sa) * uResolution;
  float len = length(d);
  vec2 dir = len > 1e-5 ? d / len : vec2(1.0, 0.0);
  vec2 nrm = vec2(-dir.y, dir.x);
  bool atB = position.x > 0.5;
  vec4 c = atB ? cb : ca;
  vec2 off = (nrm * position.y + dir * (atB ? 0.5 : -0.5)) * uWidth / uResolution;
  c.xy += off * c.w;
  gl_Position = c;
  vS = atB ? aS.y : aS.x;
}
`

const edgeFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uOpacity;
uniform float uDash;     // world units a dash and its gap take
uniform float uDashMix;  // toward the dashes twice as long, as the camera pulls back
in float vS;
in float vW;
void main() {
  float d = mix(step(fract(vS / uDash), 0.58), step(fract(vS / (2.0 * uDash)), 0.58), uDashMix);
  float a = uOpacity * vW * d;
  if (a <= 0.003) discard;
  gl_FragColor = vec4(uColor, a);
}
`

const QUAD = new Float32Array([0, -1, 0, 0, 1, 0, 1, -1, 0, 1, 1, 0])

export class Works {
  constructor(app) {
    this.app = app
    this.group = new THREE.Group()
    this.group.name = 'works'
    app.scene.add(this.group)
    this.islands = new Map() // island id → { id, t, view, lastSeen }
    this.entries = new Map() // island id → its decode: { promise, out, excl, used, done }
    this.yearNow = app.timeline.year
    this.yearU = { value: this.yearNow }
    this.hidden = false
    this.tint = false
    this.available = null
    this.base = app.params.get('works') || null
    this.jobs = new Map()
    this.jobN = 0
    app.updaters.push((dt) => this.update(dt))
  }

  /** Read the works from another base from now on (the tools' test works), letting go of what was read. */
  setBase(base) {
    for (const isl of this.islands.values()) isl.view?.dispose()
    this.islands.clear()
    this.entries.clear()
    this._files = null
    this.available = null
    this.base = base
  }

  url(path) {
    if (!this.base) return this.app.data.abs(path)
    const b = this.base.endsWith('/') ? this.base : `${this.base}/`
    return new URL(path, new URL(b, location.href)).href
  }

  /** works/manifest.json, once: each island's file, by island id; none where there is no manifest. */
  files() {
    this._files ??= (async () => {
      const url = this.url('works/manifest.json')
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const m = await res.json()
        this.manifest = m
        const files = new Map()
        for (const f of m.files || []) files.set(String(f).replace(/^.*\//, '').replace(/\.geojson$/, ''), `works/${f}`)
        this.available = files.size > 0
        return files
      } catch (err) {
        this.available = false
        this.app.warn(`${url}: ${err.message} (no works)`)
        return new Map()
      }
    })()
    return this._files
  }

  /** Island `id`'s works, decoded once until let go: { promise (of the decode, or null), out, excl }. */
  entry(id) {
    let e = this.entries.get(id)
    if (!e) {
      e = { id, out: null, excl: null, used: performance.now(), done: false, ms: null }
      const t0 = performance.now()
      e.promise = this.files()
        .then((files) => (files.has(id) ? this.decode(this.url(files.get(id))) : null))
        .then((out) => {
          if (this.entries.get(id) !== e) return null
          e.out = out
          e.ms = Math.round(performance.now() - t0)
          return out
        })
        .catch((err) => {
          this.app.warn(`works ${id}: ${err.message}`)
          return null
        })
        .finally(() => {
          e.done = true
        })
      this.entries.set(id, e)
    }
    e.used = performance.now()
    return e
  }

  /** What island `id`'s settlements keep off (data/works.js WorksExclusion), or null where it has no works: they wait for it. */
  async exclusion(id) {
    const e = this.entry(id)
    const out = await e.promise
    if (!out) return null
    e.excl ??= new WorksExclusion(out.excl)
    return e.excl
  }

  /** In the worker; on the main thread if there is none. */
  decode(url) {
    const { lat0, lon0 } = this.app.data.proj
    if (!this.fallback && !this.worker) {
      try {
        this.worker = new Worker(new URL('../data/works-worker.js', import.meta.url), { type: 'module' })
        this.worker.onmessage = (e) => {
          const j = this.jobs.get(e.data.job)
          if (!j) return
          this.jobs.delete(e.data.job)
          if (e.data.ok) j.resolve(e.data.out)
          else j.reject(new Error(e.data.message))
        }
        this.worker.onerror = (e) => {
          e.preventDefault?.()
          this.fallback = true
          for (const [n, j] of this.jobs) {
            this.jobs.delete(n)
            this.mainThread(j.url).then(j.resolve, j.reject)
          }
        }
      } catch {
        this.fallback = true
      }
    }
    if (this.fallback) return this.mainThread(url)
    return new Promise((resolve, reject) => {
      const job = ++this.jobN
      this.jobs.set(job, { url, resolve, reject })
      this.worker.postMessage({ job, url, lat0, lon0 })
    })
  }

  async mainThread(url) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const { lat0, lon0 } = this.app.data.proj
    return decodeWorks(await res.json(), { lat0, lon0 })
  }

  update(dt) {
    const app = this.app
    const target = app.timeline.year
    if (dt > 0) {
      this.yearNow += (target - this.yearNow) * (1 - Math.exp(-dt * 2.2))
      if (Math.abs(target - this.yearNow) < 0.05) this.yearNow = target
    } else this.yearNow = target
    this.yearU.value = this.yearNow
    const d = app.rig.state.distance
    const now = performance.now()
    for (const t of app.world.islands) {
      const id = t.pack.id
      const k = t.slot >= 0 ? t.k : 0
      let isl = this.islands.get(id)
      if (k > 0.02) {
        const e = this.entry(id)
        if (!isl) this.islands.set(id, (isl = { id, t, view: null, lastSeen: now }))
        isl.lastSeen = now
        if (!isl.view && e.out) {
          isl.view = new IslandWorks(this, t, e.out)
          this.group.add(isl.view.group)
        }
      }
      if (isl?.view) isl.view.update(this.hidden ? 0 : k, d)
    }
    // a while after an island gave its slot up, let it go; and what was
    // decoded for one only its settlements asked of, once they are done
    for (const [id, isl] of this.islands) {
      if (now - isl.lastSeen <= LINGER * 1000) continue
      isl.view?.dispose()
      this.islands.delete(id)
    }
    for (const [id, e] of this.entries) if (!this.islands.has(id) && e.done && now - e.used > LINGER * 1000) this.entries.delete(id)
  }

  /** Straight to what the view and the year want (tools). */
  settle() {
    this.update(0)
  }

  /** Every island's works let go now, as LINGER after the camera has left them (tools). */
  release() {
    for (const isl of this.islands.values()) isl.lastSeen = -1e9
    for (const e of this.entries.values()) e.used = -1e9
    this.update(0)
  }

  /** A work by its id, on an island whose works are in: its description (data/works.js decodeWorks feats) and island. */
  feature(id) {
    for (const [isl, e] of this.entries) {
      const f = e.out?.feats.find((q) => q.id === id)
      if (f) return { ...f, island: isl }
    }
    return null
  }

  /** How much of a work shows in a year, as the shaders draw it (the eased year by default). */
  weightOf(id, year = this.yearNow) {
    const f = this.feature(id)
    return f ? workWeight(f.span, year) : null
  }

  /**
   * The rows the Land view's legend adds: "Military land" while any of it
   * stands in the year on an island drawn now, with the wash showing.
   */
  legendRows() {
    const rows = []
    for (const isl of this.islands.values()) {
      const v = isl.view
      if (!v || v.show < 0.3 || this.hidden) continue
      if (v.out.feats.some((f) => f.part === 'land' && workWeight(f.span, this.yearNow) > 0.5)) {
        rows.push({ id: 'military', name: 'Military land' })
        break
      }
    }
    return rows
  }

  stats() {
    return {
      available: this.available,
      base: this.base,
      year: +this.yearNow.toFixed(2),
      hidden: this.hidden,
      entries: [...this.entries.values()].map((e) => ({ id: e.id, ready: !!e.out, ms: e.ms, decodeMs: e.out?.ms ?? null, features: e.out?.feats.length ?? 0, counts: e.out?.counts ?? null })),
      islands: [...this.islands.values()].map((i) => ({ id: i.id, drawn: !!i.view, ...(i.view ? i.view.stats() : {}) })),
    }
  }
}

// --- one island ------------------------------------------------------------------

class IslandWorks {
  constructor(works, t, out) {
    this.works = works
    this.app = works.app
    this.t = t
    this.out = out
    this.id = t.pack.id
    this.group = new THREE.Group()
    this.group.name = `works ${this.id}`
    this.show = 0
    const app = this.app
    const shared = app.shared.uniforms
    const year = works.yearU
    this.geometries = []
    this.materials = []

    // --- the washes
    const W = out.wash
    this.washTris = W.index.length / 3
    if (W.index.length) {
      const n = W.pos.length / 2
      const pos = new Float32Array(n * 3)
      for (let i = 0; i < n; i++) {
        pos[i * 3] = W.pos[i * 2]
        pos[i * 3 + 2] = W.pos[i * 2 + 1]
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      g.setAttribute('aSpan', new THREE.BufferAttribute(W.span, 4))
      g.setAttribute('aTone', new THREE.BufferAttribute(W.tone, 1))
      g.setIndex(new THREE.BufferAttribute(W.index, 1))
      this.washU = {
        ...shared,
        uCamPos: { value: new THREE.Vector3() },
        uYearNow: year,
        uTone: { value: TONES.map((c) => new THREE.Vector3(...c)) },
        uToneA: { value: new THREE.Vector3(...TONE_A) },
        uAlpha: { value: 0 },
        uHatch: { value: 2 },
      }
      // (cut from earcut's triangles, which come out wound either way as seen from above)
      const m = new THREE.ShaderMaterial({ vertexShader: washVertex, fragmentShader: washFragment, uniforms: this.washU, transparent: true, depthWrite: false, side: THREE.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -2 })
      this.wash = new THREE.Mesh(g, m)
      this.wash.frustumCulled = false
      this.wash.renderOrder = 2
      this.group.add(this.wash)
      this.geometries.push(g)
      this.materials.push(m)
    }

    // --- the military land's boundary
    const E = out.edges
    this.edgeCount = E.seg.length / 4
    if (this.edgeCount) {
      const g = new THREE.InstancedBufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(QUAD, 3))
      g.setIndex([0, 2, 1, 1, 2, 3])
      g.setAttribute('aSeg', new THREE.InstancedBufferAttribute(E.seg, 4))
      g.setAttribute('aS', new THREE.InstancedBufferAttribute(E.s, 2))
      g.setAttribute('aSpan', new THREE.InstancedBufferAttribute(E.span, 4))
      g.instanceCount = this.edgeCount
      this.edgeU = {
        ...shared,
        uResolution: { value: new THREE.Vector2(1, 1) },
        uWidth: { value: 1.6 },
        uCamPos: { value: new THREE.Vector3() },
        uYearNow: year,
        uColor: { value: new THREE.Color(...EDGE) },
        uOpacity: { value: 0 },
        uDash: { value: 4 },
        uDashMix: { value: 0 },
      }
      const m = new THREE.ShaderMaterial({ vertexShader: edgeVertex, fragmentShader: edgeFragment, uniforms: this.edgeU, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 })
      this.edges = new THREE.Mesh(g, m)
      this.edges.frustumCulled = false
      this.edges.renderOrder = 4
      this.group.add(this.edges)
      this.geometries.push(g)
      this.materials.push(m)
    }

    // --- the ribbons
    this.ribbons = new Ribbons(app.shared, app.camera)
    this.batches = {}
    for (const look of LOOKS) {
      const R = out.ribbons[look]
      if (!R?.n) continue
      const L = LOOK[look]
      const opts = { mode: L.mode, colour: L.colour, alpha: 0, minPx: L.minPx, lift: L.lift, order: 6, marks: !!L.marks, year }
      // (each twice: a point every 25 m for the near zoom, every 100 m for the island's)
      this.batches[look] = { fine: this.ribbons.addPacked(R.fine, opts), coarse: this.ribbons.addPacked(R.coarse, opts), look: L, n: R.n, km: R.length / 10 }
    }
    this.group.add(this.ribbons.group)

    // --- the blocks
    this.buildBlocks(out.blocks)

    // --- the names
    this.labels = new Labels(app, [], {
      items: out.labels.map((l) => ({ ...l, cls: `dlabel wlabel wl-${l.kind}` })),
      alive: (it, y) => workWeight(it.span, y) > 0.5,
      zoom: (d) => smooth(LABEL_RIG[0], LABEL_RIG[1], d),
      layer: 'wlabels',
      avoid: '.pin.show, .cluster.show',
      lang: '',
    })
    this._res = new THREE.Vector2()
    this.groundKey = ''
  }

  /** One instanced mesh per kind of block, each instance fitted to its footprint and standing in its years. */
  buildBlocks(B) {
    const n = B.length / 10
    this.blockCount = n
    this.blockMeshes = []
    if (!n) return
    const rand = mulberry32(1941 + n)
    this.kits = worksKits(rand)
    this.own = {
      uShow: { value: 0 },
      uFeatSeen: { value: Array.from({ length: 16 }, () => new THREE.Vector4(0, 0, 0, 0)) },
      uShadeS: { value: this.t.shadow.texture },
      uShadeRect: { value: this.t.rect },
      uYearNow: this.works.yearU,
    }
    this.blockMat = objectMaterial(this.app.shared, this.own, { fade: BLOCK_FADE, grow: true })
    this.materials.push(this.blockMat)
    const byKind = new Map()
    this.instances = []
    for (let k = 0; k < n; k++) {
      const [x, z, dir, L, Wd, storeys, a0, a1, b0, b1] = B.subarray(k * 10, k * 10 + 10)
      const area = L * Wd * 1e4
      let kind
      if (storeys >= 4) kind = 'block'
      else if (storeys === 3) kind = 'barracks3'
      else if (storeys === 2) kind = 'barracks2'
      else if (storeys === 1) kind = area && area < 900 ? 'low' : 'hangar'
      else kind = area > 2500 ? 'hangar' : 'barracks2'
      const kit = this.kits[kind]
      const stretch = kind === 'block' ? Math.max(1, storeys / 4) : 1
      const sx = L > 0 ? L / kit.L : WORKS_S
      const sz = Wd > 0 ? Wd / kit.W : WORKS_S
      const inst = { x, z, dir, sx, sy: WORKS_S * stretch, sz, stretch, span: [a0, a1, b0, b1], kind, kit, c: 0.94 + 0.12 * rand() }
      if (!byKind.has(kind)) byKind.set(kind, [])
      byKind.get(kind).push(inst)
      this.instances.push(inst)
    }
    for (const [kind, list] of byKind) {
      const kit = this.kits[kind]
      const g = kit.geometry
      const mesh = new THREE.InstancedMesh(g, this.blockMat, list.length)
      mesh.name = `works ${kind}`
      mesh.frustumCulled = false
      mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(list.length * 3), 3)
      const aSpan = new THREE.InstancedBufferAttribute(new Float32Array(list.length * 4), 4)
      const aStretch = new THREE.InstancedBufferAttribute(new Float32Array(list.length), 1)
      g.setAttribute('aSpan', aSpan)
      g.setAttribute('aStretch', aStretch)
      list.forEach((it, i) => {
        aSpan.array.set(it.span, i * 4)
        aStretch.array[i] = it.stretch
        mesh.instanceColor.array.set([it.c, it.c, it.c * 0.98], i * 3)
        it.mesh = mesh
        it.index = i
      })
      this.blockMeshes.push(mesh)
      this.group.add(mesh)
      this.geometries.push(g)
    }
    this._m4 = new THREE.Matrix4()
    this._q = new THREE.Quaternion()
    this._v = new THREE.Vector3()
    this._s = new THREE.Vector3()
    this._up = new THREE.Vector3(0, 1, 0)
    // (every one placed once, so none the eased year passes through stands anywhere but on its own ground)
    this.placeBlocks()
  }

  /**
   * Each block on the ground drawn under it now (world.metresAt, the
   * district's where it is down): its floor at the mean of the ground under
   * its footprint, cut into a slope as a building on a hillside is, its
   * footing taking up the ground falling away under it; and never further
   * over the lowest of that ground than its footing reaches. (A town's lot
   * is small enough to stand over its highest ground; a footprint a hundred
   * metres across on Tripler's hillside would float metres over the rest.)
   * With `year`, those standing within a year of it, the rest as the year
   * comes to them; without, all of them.
   */
  placeBlocks(year) {
    const W = this.app.world
    for (const it of this.instances) {
      if (year !== undefined && (year < it.span[0] - 1 || year > it.span[3] + 1)) continue
      const c = Math.cos(it.dir)
      const s = Math.sin(it.dir)
      const hx = it.kit.hx * it.sx
      const hz = it.kit.hz * it.sz
      let sum = 0
      let lo = Infinity
      for (const [u, v] of BLOCK_SAMPLES) {
        const g = Math.max(0, W.metresAt(it.x + u * hx * c - v * hz * s, it.z + u * hx * s + v * hz * c))
        sum += g
        lo = Math.min(lo, g)
      }
      const floor = Math.min(sum / BLOCK_SAMPLES.length, lo + it.kit.foot * it.stretch)
      this._q.setFromAxisAngle(this._up, -it.dir)
      this._v.set(it.x, Y(floor) + LIFT, it.z)
      this._s.set(it.sx, it.sy, it.sz)
      this._m4.compose(this._v, this._q, this._s)
      this._m4.toArray(it.mesh.instanceMatrix.array, it.index * 16)
    }
    for (const m of this.blockMeshes) m.instanceMatrix.needsUpdate = true
  }

  update(k, d) {
    const app = this.app
    const show = k
    this.show = show
    this.group.visible = show > 0.001
    if (!this.group.visible) {
      this.labels.update(0)
      return
    }
    const cam = app.camera
    const tint = this.works.tint
    const wz = washZoom(d)
    if (this.wash) {
      this.washU.uCamPos.value.copy(cam.position)
      this.washU.uAlpha.value = show * wz
      // (a range's hatch a few pixels apart at any zoom: doubling as the camera pulls back)
      this.washU.uHatch.value = 2 ** Math.round(Math.log2(Math.max(0.05, d * 0.012)))
    }
    if (this.edges) {
      app.renderer.getDrawingBufferSize(this._res)
      const u = this.edgeU
      u.uResolution.value.copy(this._res)
      u.uCamPos.value.copy(cam.position)
      u.uWidth.value = 1.7 * app.renderer.getPixelRatio()
      u.uOpacity.value = show * (0.55 + 0.4 * wz)
      const l = Math.log2(Math.max(0.05, d * 0.012))
      u.uDash.value = 2 ** Math.floor(l)
      u.uDashMix.value = l - Math.floor(l)
    }
    const reach = fineReach(d)
    for (const { fine: f, coarse: c, look } of Object.values(this.batches)) {
      for (const [batch, on] of [[f, reach > 0], [c, true]]) {
        if (!batch) continue
        if (batch === f) batch.uniforms.uLod.value.set(0, reach)
        else batch.uniforms.uLod.value.set(reach, 1e9)
        batch.uniforms.uAlpha.value = on ? show * (tint ? 1 : look.alpha) : 0
        if (tint) batch.uniforms.uColor.value.setRGB(3, 0, 3)
        else batch.uniforms.uColor.value.setRGB(...look.colour)
        batch.uniforms.uMinPx.value = tint ? Math.max(4, look.minPx) : look.minPx
      }
    }
    this.ribbons.update(app.renderer)
    if (this.blockMeshes.length) {
      const bs = show * (1 - smooth(BLOCK_RIG[0], BLOCK_RIG[1], d))
      this.own.uShow.value = bs
      for (const m of this.blockMeshes) m.visible = bs > 0.001
      if (bs > 0.001) {
        // (the ground under them moves as the district comes and goes, and with the patches of the year)
        const D = app.districts
        const year = Math.round(app.timeline.year)
        const key = `${D?.on ? D.cur?.d.id : ''}:${(D?.on ? D.k : 0).toFixed(2)}:${this.t.k.toFixed(2)}:${year}`
        if (key !== this.groundKey) {
          this.groundKey = key
          this.placeBlocks(year)
        }
      }
    }
    this.labels.update(show * (1 - smooth(1500, 2300, d)))
  }

  /** What it holds and draws, for the tools. */
  stats() {
    const y = this.works.yearNow
    const standing = this.out.feats.filter((f) => workWeight(f.span, y) > 0.5)
    const by = {}
    for (const f of standing) by[`${f.kind}:${f.part}`] = (by[`${f.kind}:${f.part}`] || 0) + 1
    let gpu = 0
    for (const g of this.geometries) for (const a of Object.values(g.attributes)) gpu += a.array.byteLength
    for (const g of this.geometries) if (g.index) gpu += g.index.array.byteLength
    for (const b of Object.values(this.batches)) for (const batch of [b.fine, b.coarse]) if (batch) for (const a of Object.values(batch.mesh.geometry.attributes)) gpu += a.array.byteLength
    return {
      show: +this.show.toFixed(2),
      features: this.out.feats.length,
      standing: by,
      washTris: this.washTris,
      edges: this.edgeCount,
      ribbons: Object.fromEntries(Object.entries(this.batches).map(([k, v]) => [k, { segments: v.n, km: +v.km.toFixed(1) }])),
      blocks: this.blockCount,
      blocksShown: this.blockMeshes.length ? +this.own.uShow.value.toFixed(2) : 0,
      calls: (this.wash ? 1 : 0) + (this.edges ? 1 : 0) + Object.keys(this.batches).length + this.blockMeshes.length,
      fineReach: fineReach(this.works.app.rig.state.distance),
      labels: this.labels.visible(),
      gpuMB: +(gpu / 1048576).toFixed(2),
    }
  }

  dispose() {
    this.group.parent?.remove(this.group)
    for (const g of this.geometries) g.dispose()
    // (and the kits no block drew: those that did are among the geometries, each disposed once)
    for (const kit of Object.values(this.kits || {})) if (!this.geometries.includes(kit.geometry)) kit.geometry.dispose()
    for (const m of this.materials) m.dispose()
    for (const m of this.blockMeshes) m.dispose()
    this.ribbons.dispose()
    this.labels.dispose()
  }
}
