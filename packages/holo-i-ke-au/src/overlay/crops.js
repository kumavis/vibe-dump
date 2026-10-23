// What grows where, by class (DATA.md "Crops, on the era layers"): each
// island's `<keyframe>-crop.png` masks, read with its cultivation masks into
// one crop map the ground shaders read (render/shaders/crops.glsl.js), and
// the year's nearest keyframe on it.
//
// An island's crop map is made when the island takes a slot (render/world.js),
// so when the camera comes down to it, and let go a while after it has given
// the slot up: GPU and CPU both. It is one RGBA texture on the masks' own
// grid, nearest texel, no mipmaps: a channel a keyframe (the layers' four,
// contact, mahele, kingdom, now), each byte a class in its high four bits and
// the share of the texel cultivated (cultivation / 255, to fifteen steps) in
// its low four. A keyframe with no crop mask is nothing in its channel; an
// island with none has no map, and its ground is drawn as it was before
// there were crops.
//
// The year shows the nearest keyframe, by the same map of eras onto
// keyframes the other layers go by (overlay/land.js position, the manifest's
// `eras`, `crop` where it is given, else `cultivation`): never a blend of two
// classes. When the year crosses into another keyframe the fields go over to
// it one by one in under a second (uCropSelB, uCropMix), and settle() makes
// it at once.
//
// App wiring (src/app.js): construct after the land overlay (it adds the
// shared uniforms the materials are made with), attach() each island terrain
// as it arrives, update(dt) every frame, settle() for the tools. Districts
// (render/district.js) bind their island's map with bindDistrict().

import * as THREE from 'three'
import { decodeImage } from '../data/image.js'
import { decodeGrey } from '../data/layers.js'
import { CROP_REGION, CROP_CELL, CROP } from '../render/shaders/crops.glsl.js'

// the classes, in the words the legend uses for them
export const CROP_NAMES = ['', 'loʻi kalo', 'dryland fields', 'rice', 'sugar cane', 'pineapple', 'pasture', 'orchards and coffee', 'lawns and parks']
// how long an island's map stays after it gave up its slot (s)
const LINGER = 20
// the fields go over to a new keyframe at this rate (1/s)
const DISSOLVE = 1.4
const CHANNELS = 4

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const fract = (v) => v - Math.floor(v)

/** cropHash of crops.glsl.js. */
export function cropHash(x, y) {
  let a = fract(x * 0.1031)
  let b = fract(y * 0.1031)
  let c = fract(x * 0.1031)
  const d = a * (b + 33.33) + b * (c + 33.33) + c * (a + 33.33)
  a += d
  b += d
  c += d
  return fract((a + b) * c)
}

/** The region of world (x, z): its index, its middle and its frame (e along it). */
export function cropRegion(rx, rz) {
  const a = (cropHash(rx + 71.3, rz + 71.3) - 0.5) * 1.4
  return { rx, rz, ex: Math.cos(a), ez: Math.sin(a), ox: (rx + 0.5) * CROP_REGION, oz: (rz + 0.5) * CROP_REGION }
}

/** World (x, z) of a point (qx, qz) in a region's frame. */
export const fromRegion = (R, qx, qz) => [R.ox + qx * R.ex - qz * R.ez, R.oz + qx * R.ez + qz * R.ex]

/** A strip of fields' offset along it, in fields (cropCell of crops.glsl.js). */
export const stripOffset = (R, iz) => cropHash(iz + R.rx * 13, 3.7 + R.rz * 13)

/** A field's middle and picks, from its region, its place along its strip (ix) and the strip (iz). */
export function cropField(R, ix, iz) {
  const off = stripOffset(R, iz)
  const [cx, cz] = fromRegion(R, (ix + 0.5 - off) * CROP_CELL[0], (iz + 0.5) * CROP_CELL[1])
  const idx = ix + R.rx * 97
  const idz = iz + R.rz * 97
  const pick = 0.5 * cropHash(idx + 13.1, idz + 13.1) + 0.5 * cropHash(iz + R.rx * 13, 7.9 + R.rz * 13)
  return { cx, cz, ix, iz, idx, idz, off, pick, pickKf: cropHash(idx + 41.7, idz + 41.7) }
}

/** cropCell of crops.glsl.js: the field at world (x, z), its middle and its picks. */
export function cropCell(x, z, R = null) {
  R ??= cropRegion(Math.floor(x / CROP_REGION), Math.floor(z / CROP_REGION))
  const dx = x - R.ox
  const dz = z - R.oz
  const qx = dx * R.ex + dz * R.ez
  const qz = -dx * R.ez + dz * R.ex
  const iz = Math.floor(qz / CROP_CELL[1])
  const ix = Math.floor(qx / CROP_CELL[0] + stripOffset(R, iz))
  return { ...cropField(R, ix, iz), qx, qz }
}

/** cropCover of crops.glsl.js: how much of a field of class c and share s (0..1) is planted. */
export function cropCover(c, s) {
  if (!c) return s
  if (c === CROP.pasture || c === CROP.lawn || s <= 0) return 1
  return 0.55 + 0.45 * s
}

/** A byte of the crop map: [class, share 0..1]. */
export const unpack = (v) => [v >> 4 > 8 ? 0 : v >> 4, (v & 15) / 15]

/**
 * Where the layers' manifest lists an island's crop masks (DATA.md "Crops,
 * on the era layers"): for each keyframe id, a file under layers/ or null.
 * Read from `crops.islands.<island>.layers.<keyframe>` (an entry with
 * `file`, or a file name), or the same straight under the island; else the
 * island's era layer entry, `crop` beside `cultivation`.
 */
export function cropFiles(m, island, keyframes) {
  const top = m?.crops
  const e = top?.islands?.[island] ?? null
  const file = (v) => (typeof v === 'string' ? v : v?.file || null)
  return keyframes.map((k) => file(e?.layers?.[k] ?? e?.[k] ?? e?.keyframes?.[k] ?? m?.islands?.[island]?.layers?.[k]?.crop) || null)
}

/** The classes a keyframe's masks hold, from the manifest's stats: { class: km² (or texels, or share) } summed over the islands, or null without any. */
export function cropShares(m, keyframe) {
  const top = m?.crops
  const isl = top?.islands ?? {}
  let any = false
  const out = {}
  for (const id of Object.keys(isl)) {
    const e = isl[id]?.layers?.[keyframe] ?? isl[id]?.[keyframe] ?? isl[id]?.keyframes?.[keyframe]
    const s = e?.stats?.km2 ?? e?.stats?.texels ?? e?.stats?.share ?? null
    if (!s || typeof s !== 'object') continue
    any = true
    for (const [k, v] of Object.entries(s)) if (Number(k) > 0 && v > 0) out[k] = (out[k] || 0) + v
  }
  return any ? out : null
}

/**
 * One island's crop map: up to four keyframes' class masks and their
 * cultivation (each { px, W, H } or null), onto the first class mask's grid
 * (the others by nearest texel where they differ). Returns { data, W, H, has }.
 */
export function packCrops(classes, cults) {
  const ref = classes.find(Boolean)
  if (!ref) return null
  const { W, H } = ref
  const data = new Uint8Array(W * H * 4)
  const has = []
  const at = (img, i, j) => (img.W === W && img.H === H ? img.px[j * W + i] : img.px[Math.min(img.H - 1, Math.floor(((j + 0.5) * img.H) / H)) * img.W + Math.min(img.W - 1, Math.floor(((i + 0.5) * img.W) / W))])
  for (let k = 0; k < CHANNELS; k++) {
    const cl = classes[k]
    const cu = cults[k]
    has.push(cl ? 1 : 0)
    if (!cl) continue
    for (let j = 0; j < H; j++) {
      for (let i = 0; i < W; i++) {
        let c = at(cl, i, j)
        if (c > 8) c = 0
        // (any cultivation at all is a step: 0 is none, under a class the class alone)
        const v = cu ? at(cu, i, j) : 0
        const s = v > 0 ? Math.max(1, Math.round((v / 255) * 15)) : 0
        data[(j * W + i) * 4 + k] = (c << 4) | s
      }
    }
  }
  return { data, W, H, has }
}

function blank() {
  const t = new THREE.DataTexture(new Uint8Array(4), 1, 1, THREE.RGBAFormat, THREE.UnsignedByteType)
  t.needsUpdate = true
  return t
}

const oneHot = (v, k) => v.set(k === 0 ? 1 : 0, k === 1 ? 1 : 0, k === 2 ? 1 : 0, k === 3 ? 1 : 0)

// The crops compiled into a material, or out of it, only when that changes
// (render/shaders/crops.glsl.js: a software renderer runs the branch the
// uniform would skip, so a material with no map is better without the code).
function compiled(mat, on) {
  if (!mat || ('CROPS' in (mat.defines ?? {})) === on) return
  mat.defines ??= {}
  if (on) mat.defines.CROPS = ''
  else delete mat.defines.CROPS
  mat.needsUpdate = true
}

export class CropLayer {
  constructor(app) {
    this.app = app
    this.blank = blank()
    const u = app.shared.uniforms
    Object.assign(u, {
      uCropSelA: { value: new THREE.Vector4(1, 0, 0, 0) },
      uCropSelB: { value: new THREE.Vector4(1, 0, 0, 0) },
      uCropMix: { value: 0 },
      // the district's: its island's map (render/district.js binds it)
      uDistCrop: { value: this.blank },
      uDistCropRect: { value: new THREE.Vector4(0, 0, 1, 1) },
      uDistCropOn: { value: 0 },
    })
    this.uniforms = u
    this.available = null // unknown until the land layers' manifest answers
    this.keyframes = []
    this.islands = new Map()
    this.files = new Map()
    this.shown = { a: 0, b: 0, mix: 0 }
    this.hidden = false
    this.uploads = []
    this.loads = 0
    this.releases = 0
    app.land.onChange(() => this.start())
  }

  /** Once the land layers' manifest is in: which islands have crop masks, and the keyframes' years on the timeline. */
  start() {
    const land = this.app.land
    if (this.available !== null || land.available === null) return
    const m = land.manifest
    if (!land.available || !m) {
      this.available = false
      return
    }
    this.manifest = m
    this.keyframes = land.keyframes.slice(0, CHANNELS)
    const ids = this.keyframes.map((k) => k.id)
    for (const p of this.app.world.islandPacks) {
      const f = cropFiles(m, p.id, ids)
      if (f.some(Boolean)) this.files.set(p.id, f)
    }
    this.available = this.files.size > 0
    // each era's year on the keyframes: its keyframe in the crops' own map of
    // eras, else as the land layers place it (`crop`, else `cultivation`)
    const own = m.crops?.eras ?? {}
    const kfYear = (id) => this.keyframes.find((k) => k.id === id)?.year
    this.eraYears = this.app.timeline.eras.map((era) => kfYear(own[era.id]?.keyframe) ?? land.eraYear(era, 'crop'))
    this.edges = this.boundaries()
    const k = this.nearest()
    this.shown = { a: k, b: k, mix: 0 }
    this.apply()
  }

  // --- time ---------------------------------------------------------------------

  /** The keyframe the year shows: the nearest, by the land layers' map of eras onto keyframes. */
  nearest(s = this.app.timeline.s) {
    if (!this.keyframes.length) return 0
    return clamp(Math.round(this.app.land.position(s, this.eraYears)), 0, this.keyframes.length - 1)
  }

  /**
   * The years (on the timeline) at which the nearest keyframe changes: for
   * each keyframe, the span of years it is shown, [from, to), open at the ends.
   */
  boundaries() {
    const T = this.app.timeline
    const n = this.keyframes.length
    const spans = Array.from({ length: n }, () => [Infinity, -Infinity])
    const N = 4000
    let prev = null
    for (let q = 0; q <= N; q++) {
      const s = (q / N) * T.max
      const k = this.nearest(s)
      const y = T.yearAt(s)
      if (prev !== null && k !== prev.k) {
        // (the year between the two samples, refined)
        let lo = prev.s
        let hi = s
        for (let it = 0; it < 30; it++) {
          const mid = (lo + hi) / 2
          if (this.nearest(mid) === prev.k) lo = mid
          else hi = mid
        }
        const at = T.yearAt(hi)
        spans[prev.k][1] = Math.max(spans[prev.k][1], at)
        spans[k][0] = Math.min(spans[k][0], at)
      }
      if (prev === null) spans[k][0] = -Infinity
      prev = { k, s, y }
    }
    if (prev) spans[prev.k][1] = Infinity
    return spans
  }

  // --- islands ------------------------------------------------------------------

  /** An island's map, decoded and packed; its texture uploaded a frame later. */
  async load(id, rec) {
    const t0 = performance.now()
    const files = this.files.get(id)
    const ids = this.keyframes.map((k) => k.id)
    const entry = this.manifest.islands?.[id]
    const grey = (f) => (f ? decodeGrey(decodeImage, this.app.data.abs(`layers/${f}`)).catch((err) => (this.app.warn(`crops ${id}: ${f}: ${err.message}`), null)) : Promise.resolve(null))
    const classes = await Promise.all(files.map(grey))
    // (a keyframe without its own cultivation takes the nearest that has it, as the land layers do)
    const cultFile = (k) => {
      for (let d = 0; d < ids.length; d++) for (const j of [k - d, k + d]) if (entry?.layers?.[ids[j]]?.cultivation?.file) return entry.layers[ids[j]].cultivation.file
      return null
    }
    const cults = await Promise.all(ids.map((_, k) => (classes[k] ? grey(cultFile(k)) : null)))
    if (rec.dropped) return
    const packed = packCrops(classes, cults)
    if (!packed) {
      rec.state = 'none'
      return
    }
    const tex = new THREE.DataTexture(packed.data, packed.W, packed.H, THREE.RGBAFormat, THREE.UnsignedByteType)
    tex.minFilter = tex.magFilter = THREE.NearestFilter
    tex.generateMipmaps = false
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping
    tex.needsUpdate = true
    Object.assign(rec, { state: 'ready', tex, bytes: packed.data, W: packed.W, H: packed.H, has: packed.has, ms: Math.round(performance.now() - t0) })
    this.uploads.push(tex)
    this.loads++
    const t = this.app.world.terrains.get(id)
    if (t) this.attach(t)
  }

  /** An island terrain's own crop map, or none (and the crops compiled into its materials while it has one). */
  attach(terrain) {
    const u = terrain.uniforms
    if (!u.uOwnCrop) return
    const rec = this.islands.get(terrain.pack.id)
    const has = rec?.state === 'ready'
    const on = has && !this.hidden
    u.uOwnCrop.value = on ? rec.tex : this.blank
    u.uOwnCropOn.value = on ? 1 : 0
    for (const g of [terrain.full, terrain.half]) compiled(g?.material, has)
  }

  /** Let an island's map go: off the GPU, out of memory. */
  release(id) {
    const rec = this.islands.get(id)
    if (!rec) return
    rec.dropped = true
    rec.tex?.dispose()
    this.uploads = this.uploads.filter((t) => t !== rec.tex)
    this.islands.delete(id)
    this.releases++
    const t = this.app.world.terrains.get(id)
    if (t) this.attach(t)
    this.app.cropTrees?.drop(id)
  }

  /** The island's map, for what is planted on it and for a district over it: { tex, bytes, W, H, rect, has } once ready. */
  map(id) {
    const rec = this.islands.get(id)
    return rec?.state === 'ready' ? rec : null
  }

  /**
   * A district's ground and trees read its island's map (null: none). Its
   * materials have the crops compiled in from the first time it binds a map
   * and keep them till it goes (a district switches off and on as the camera
   * comes and goes, and recompiling each time would cost more than the
   * uniform that turns them off).
   */
  bindDistrict(parentId) {
    const rec = parentId ? this.map(parentId) : null
    const u = this.uniforms
    const on = !!rec && !this.hidden
    u.uDistCrop.value = on ? rec.tex : this.blank
    u.uDistCropOn.value = on ? 1 : 0
    if (on) {
      const r = this.app.world.terrains.get(parentId).rect
      u.uDistCropRect.value.copy(r)
    }
    if (!rec) return
    const cur = this.app.districts?.cur
    const forest = cur?.features?.forest
    for (const m of [cur?.terrain?.full?.material, cur?.terrain?.half?.material, forest?.mat, forest?.matDS]) compiled(m, true)
  }

  /** The field at world (x, z): its middle and its picks (tools). */
  cell(x, z) {
    return cropCell(x, z)
  }

  /** How much of a field of class c and share s is planted (tools). */
  cover(c, s) {
    return cropCover(c, s)
  }

  /** The class and share at world (x, z) on island `id`'s map, in keyframe k (default: the one shown), read at the field's middle as the ground is. */
  classAt(id, x, z, k = this.shown.a) {
    const rec = this.map(id)
    if (!rec) return null
    const c = cropCell(x, z)
    const r = this.app.world.terrains.get(id).pack.rect
    const i = Math.floor(((c.cx - r.x0) / (r.x1 - r.x0)) * rec.W)
    const j = Math.floor(((c.cz - r.z0) / (r.z1 - r.z0)) * rec.H)
    if (i < 0 || j < 0 || i >= rec.W || j >= rec.H) return [0, 0]
    return unpack(rec.bytes[(j * rec.W + i) * 4 + k])
  }

  // --- every frame --------------------------------------------------------------

  update(dt) {
    if (!this.available) return
    // the keyframe the year shows, the fields going over to it
    const k = this.nearest()
    const sh = this.shown
    if (k !== sh.b) {
      if (sh.mix > 0) sh.a = sh.mix < 0.5 ? sh.a : sh.b
      sh.b = k
      sh.mix = 0
    }
    if (sh.a !== sh.b) {
      sh.mix += dt * DISSOLVE
      if (sh.mix >= 1) {
        sh.a = sh.b
        sh.mix = 0
      }
    }
    // the islands in a slot have their maps; one that left its slot a while ago lets its go
    const now = performance.now()
    for (const t of this.app.world.islands) {
      const id = t.pack.id
      if (!this.files.has(id)) continue
      let rec = this.islands.get(id)
      if (t.slot >= 0 && t.k > 0.002) {
        if (!rec) {
          rec = { id, state: 'loading', lastSeen: now }
          this.islands.set(id, rec)
          this.load(id, rec).catch((err) => {
            rec.state = 'failed'
            this.app.warn(`crops ${id}: ${err.message} (its ground is drawn without them)`)
          })
        }
        rec.lastSeen = now
      } else if (rec && rec.state !== 'loading' && now - rec.lastSeen > LINGER * 1000) this.release(id)
    }
    this.apply()
    const tex = this.uploads.shift()
    if (tex) this.app.renderer.initTexture(tex)
  }

  apply() {
    const u = this.uniforms
    oneHot(u.uCropSelA.value, this.shown.a)
    oneHot(u.uCropSelB.value, this.shown.b)
    u.uCropMix.value = this.shown.mix
  }

  /** Straight to the year's keyframe (tools, screenshots). */
  settle() {
    if (!this.available) return
    const k = this.nearest()
    this.shown = { a: k, b: k, mix: 0 }
    this.apply()
    while (this.uploads.length) this.app.renderer.initTexture(this.uploads.shift())
  }

  /** The crops off and on again, everywhere (tools: the ground with and without them). */
  setHidden(v) {
    this.hidden = !!v
    for (const t of this.app.world.islands) this.attach(t)
    const D = this.app.districts
    if (D?.on && D.cur) this.bindDistrict(D.cur.parent?.pack.id)
  }

  /** Whether the maps the islands in a slot want are in and on the GPU (tools). */
  get ready() {
    if (!this.available) return true
    for (const t of this.app.world.islands) {
      if (!this.files.has(t.pack.id) || !(t.slot >= 0 && t.k > 0.002)) continue
      const rec = this.islands.get(t.pack.id)
      if (!rec || rec.state === 'loading' || (rec.tex && this.uploads.includes(rec.tex))) return false
    }
    return true
  }

  // --- words and numbers ------------------------------------------------------------

  /** For the legend: the keyframe the year shows, and the classes its masks hold (from the manifest), or null. */
  describe() {
    if (!this.available) return null
    const kf = this.keyframes[this.nearest()]
    const shares = kf ? cropShares(this.manifest, kf.id) : null
    if (!shares) return null
    const classes = Object.keys(shares)
      .map(Number)
      .filter((c) => c > 0 && c < CROP_NAMES.length)
      .sort((a, b) => shares[b] - shares[a])
    return { keyframe: kf.id, year: kf.year, classes: classes.map((c) => ({ id: c, name: CROP_NAMES[c] })) }
  }

  /** The names of the cultivated classes (not pasture or lawn) the keyframe the year shows holds, largest first: for the land view's legend. */
  grown() {
    return (this.describe()?.classes || []).filter((c) => c.id !== CROP.pasture && c.id !== CROP.lawn).map((c) => c.name)
  }

  stats() {
    const isl = [...this.islands.values()]
    const bytes = isl.reduce((s, r) => s + (r.state === 'ready' ? r.W * r.H * 4 : 0), 0)
    const k = this.shown
    return {
      available: this.available,
      keyframe: this.keyframes[k.a]?.id ?? null,
      going: k.a !== k.b ? this.keyframes[k.b]?.id ?? null : null,
      mix: +k.mix.toFixed(3),
      spans: this.edges?.map((s, i) => [this.keyframes[i].id, s[0] === -Infinity ? null : +s[0].toFixed(2), s[1] === Infinity ? null : +s[1].toFixed(2)]) ?? [],
      islands: isl.map((r) => ({ id: r.id, state: r.state, size: r.W ? `${r.W}×${r.H}` : null, has: r.has ?? null, ms: r.ms ?? null })),
      withMasks: [...this.files.keys()],
      gpuMB: +(bytes / 1048576).toFixed(2),
      cpuMB: +(bytes / 1048576).toFixed(2),
      loads: this.loads,
      releases: this.releases,
      hidden: this.hidden,
    }
  }

  dispose() {
    for (const id of [...this.islands.keys()]) this.release(id)
    this.blank.dispose()
  }
}
