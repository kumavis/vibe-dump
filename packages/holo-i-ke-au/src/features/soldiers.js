// The battles' people (DESIGN.md §8, the tone rule): pixel-art figures
// (sprites.js) walking the forces' lines and meeting at the fronts, drawn as
// camera-facing billboards (render/shaders/sprite.glsl.js). forces.js decides
// which of features.json's forces and fronts show, and how strongly; this
// places their people and moves them.
//
// - A force taken along its line is people in loose files and knots,
//   walking its way, a little faster or slower one from another, and
//   running where the line is a retreat or a pursuit. Each walks the line
//   from its start and dissolves somewhere over its last stretch, to come in
//   again at its start: a figure whose part is done walks on out of it, and
//   nobody falls. A force that holds ground (the posts up the valley, an army
//   ashore putting itself in order) stands in knots along its line, a few
//   pacing between them. As the view widens, where each figure stands taller
//   on the ground, a force's people thin out.
// - A front (a `line`) is people standing in loose ranks behind it. Where
//   two fronts of opposing sides stand near each other, the two meet between
//   them: pairs of fighters, one of each side, toe to toe, striking in turn
//   (the thrust, the swing) while the other stands on guard and gives a
//   pixel, the pairs swaying to and fro so the front stirs; behind them the ranks shuffle, muskets are levelled and
//   fired now and then, and on Kamehameha's side his field pieces are served,
//   rammed, fired and smoking. A front alone stands, facing where its enemy
//   comes from.
// - Off the tour, in the battle's year, fewer of them show (forces.js gives
//   the quiet weight), walking and standing only, at half pace.
//
// With two facings only, left and right, the two sides at a front face each
// other across the screen: whichever stands to the left of the other as the
// camera sees it faces right (held while the camera looks straight across
// the gap, so nobody turns on every small orbit).
//
// Nothing is drawn within 300 m of the edge of the pali (EDGES): a line that
// runs to it ends 600 m short for its people, who thin out over the
// kilometre before that, and any figure that a sideways step would take
// inside is not drawn at all. Nor is anything drawn over the edge as the
// camera sees it: from the head of Nuʻuanu the camera looks through the
// notch, and the file down the old path, half a kilometre and more down the
// windward side, would stand on the screen right at the brink; a figure that
// falls inside the 300 m round the edge on the screen, however near or far it
// stands, is not drawn either.
//
// The sizes: cssScale gives the CSS pixels to the sprite pixel at a figure's
// distance from the eye (4, a figure 64 px tall, at the closest the camera
// comes; 2, 32 px, at the valley stops; 1, 16 px, about 8.5 km out), and
// pixelScale rounds it to a whole number of device pixels to the sprite
// pixel, never fewer than two nor more than four CSS pixels' worth. Past
// 8.5 km, where the curve would take a figure under one CSS pixel to the
// sprite pixel (two device pixels on a 2x screen), they thin out, each at its
// own distance out to 11 km. Their walking pace is set in sprite pixels a
// second at the size they have at the camera's target, so the gait looks the
// same at every zoom.
//
// The work each frame is in typed arrays: each figure's state is advanced,
// its foot found on the ground of the year (world.metresAt, looked up again
// only once it has moved a metre or the ground has changed under it, and now
// and then), and every one shown
// is written into the instance buffers, one draw for the figures and one for
// their shadows, at most MAX_DRAWN of them.

import * as THREE from 'three'
import { buildSheet, SPRITE_H, KINDS, SIDES, DRESS } from './sprites.js'
import { spriteVertex, spriteFragment, shadowVertex, shadowFragment } from '../render/shaders/sprite.glsl.js'

// where nothing is drawn: a gazetteer place, and the world units kept clear of it (300 m)
export const EDGES = [{ place: 'nuuanu-pali', clear: 3 }]
// a line that runs to an edge (or from one) ends this far short of it for its people, who thin out over
// up to a kilometre before that, as the masses did: seen along the valley from its head, a figure even a
// few hundred metres short of the gap stands at the brink on the screen
const EDGE_LINE = 6
const EDGE_THIN = 10

export const MAX_DRAWN = 2400
const MODE = { file: 0, knot: 1, pacer: 2, rank: 3, duel: 4, piece: 5, crew: 6 }
const K = Object.fromEntries(KINDS.map((k, i) => [k, i]))
const A_WALK = 0
const A_RUN = 4
const A_IDLE = 8
const A_ENGAGE = 10
// gaits, in sprite pixels a second at the size a figure has at the camera's target
const GAIT_WALK = 9
const GAIT_RUN = 20
const FADE_S = 0.35 // seconds to dissolve in or out

// CSS pixels to the sprite pixel at a distance from the eye (world units): 4 at 800 m, 2 at 1.6 km, 1 at 8.5 km
const Q_FAR = (8 / 85) ** 1.5
export function cssScale(depth) {
  const q = (8 / Math.max(depth, 0.5)) ** 1.5
  return 1 + (3 * (q - Q_FAR)) / (1 - Q_FAR)
}
/** Device pixels to the sprite pixel: a whole number, at least two, at most four CSS pixels' worth. */
export function pixelScale(depth, dpr) {
  return Math.max(2, Math.min(Math.round(4 * dpr), Math.round(cssScale(depth) * dpr)))
}

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// how a force moves, from what the data calls it: a retreat or a pursuit runs; a
// force that holds its ground, or an army ashore putting itself in order, stands
const RUNS = /\bretreat|\bpursu|\bfalls? back|\bescap|\bflee(s|ing)?\b|\brout(ed|s)?\b|\bgot away|\bover the ridge|\bold path/i
const STANDS = /\bposts?\b|ashore|encamp|in order/i
export function moveOf(p) {
  const text = `${p.name || ''} ${p.note || ''}`
  if (RUNS.test(text)) return 'run'
  if (STANDS.test(`${p.name || ''}`) || /putting itself in order|encamped|organising/i.test(p.note || '')) return 'stand'
  return 'walk'
}

/** A polyline's point and direction at arc length s (into out: x, z, dx, dz). */
function along(r, s, out) {
  const cum = r.cum
  const pts = r.pts
  let j = 1
  while (j < cum.length - 1 && cum[j] < s) j++
  const a = pts[j - 1]
  const b = pts[j]
  const L = cum[j] - cum[j - 1] || 1
  const t = Math.max(0, Math.min(1, (s - cum[j - 1]) / L))
  out[2] = (b[0] - a[0]) / L
  out[3] = (b[1] - a[1]) / L
  out[0] = a[0] + (b[0] - a[0]) * t
  out[1] = a[1] + (b[1] - a[1]) * t
  return out
}

/** The stretch [s0, s1] of a polyline clear of every edge by `clear`: the longest such. */
function clearStretch(r, edges, clear) {
  if (!edges.length) return [0, r.total]
  const n = Math.max(2, Math.ceil(r.total / 0.05))
  const out = [0, 0, 0, 0]
  let best = [0, 0]
  let start = -1
  for (let i = 0; i <= n; i++) {
    const s = (i / n) * r.total
    along(r, s, out)
    const ok = edges.every((e) => Math.hypot(out[0] - e.x, out[1] - e.z) >= clear)
    if (ok && start < 0) start = s
    if ((!ok || i === n) && start >= 0) {
      const end = ok ? s : s - r.total / n
      if (end - start > best[1] - best[0]) best = [start, end]
      start = -1
    }
  }
  return best
}

/** A clumped spread of n values over [0, 1), so a column has thicker and thinner stretches. */
function clumps(n, rand, k = 5) {
  const centres = Array.from({ length: k }, () => rand())
  return Array.from({ length: n }, (_, i) => {
    let v = (centres[i % k] + (rand() - 0.5) * (rand() < 0.7 ? 0.14 : 1)) % 1
    if (v < 0) v += 1
    return v
  })
}

export class Soldiers {
  /**
   * recs: forces.js's records (forces and fronts, each { p, pts, cum, total,
   * side, line, event }); each is given o and n, its figures' first index and
   * count. shared: the app's uniforms.
   */
  constructor(app, recs, shared) {
    this.app = app
    this.recs = recs
    this.sheet = buildSheet()
    const rand = mulberry32(1795)
    this.edges = []
    for (const e of EDGES) {
      const pl = app.data.places?.find((p) => p.id === e.place)
      const c = pl?.geometry?.type === 'Point' ? pl.geometry.coordinates : null
      if (c) {
        const [x, z] = app.data.proj.toWorld(c)
        this.edges.push({ x, z, clear: e.clear, place: e.place, ux: 0, uy: 0, uz: 0, cos: 2 })
      }
    }

    // --- plan every rec's people ------------------------------------------------------
    const specs = recs.map(() => [])
    this.fronts = []
    this.pairs = []
    this.guns = []
    for (const r of recs) {
      r.enemy = this.enemyOf(r, recs)
      r.stretch = clearStretch(r, this.edges, EDGE_LINE)
    }
    // fronts that meet: two lines of opposing sides in one event, shown together, near each other
    const lines = recs.filter((r) => r.line)
    const paired = new Set()
    for (const a of lines) {
      for (const b of lines) {
        if (a === b || paired.has(a) || paired.has(b) || a.event !== b.event || a.side === b.side) continue
        if (JSON.stringify(a.p.stop ?? a.step) !== JSON.stringify(b.p.stop ?? b.step)) continue
        const [ax, az] = this.mid(a)
        const [bx, bz] = this.mid(b)
        if (Math.hypot(ax - bx, az - bz) > 4) continue
        // (the attacker first: the side that is not Oʻahu's)
        const [A, B] = a.side === 'oahu' ? [b, a] : [a, b]
        paired.add(A)
        paired.add(B)
        this.planFront(A, B, specs, recs, rand)
      }
    }
    for (const r of recs) {
      const i = recs.indexOf(r)
      if (r.line && !paired.has(r)) this.planRanks(r, null, specs[i], rand)
      else if (!r.line) this.planForce(r, specs[i], rand)
    }

    // --- lay them out, rec by rec ------------------------------------------------------
    const N = specs.reduce((s, l) => s + l.length, 0)
    this.count = N
    const F32 = (n = 1) => new Float32Array(Math.max(1, N) * n)
    const U8 = () => new Uint8Array(Math.max(1, N))
    this.f = {
      rec: new Uint16Array(Math.max(1, N)),
      mode: U8(),
      kind: U8(),
      side: U8(),
      dress: U8(),
      row: F32(),
      cw: F32(),
      s: F32(),
      s0: F32(),
      lat: F32(),
      spd: F32(),
      thr: F32(),
      inAt: F32(),
      outAt: F32(),
      far: F32(),
      ph: F32(),
      tm: F32(),
      tt: F32(),
      st: U8(),
      off: F32(),
      offTo: F32(),
      face: new Int8Array(Math.max(1, N)),
      grp: new Int16Array(Math.max(1, N)),
      role: U8(),
      vis: F32(),
      gm: F32(),
      gx: F32(),
      gz: F32(),
      x: F32(),
      z: F32(),
      k: F32(),
      tint: F32(),
      wet: U8(),
      fr: U8(),
      dx: new Int8Array(Math.max(1, N)),
      dx0: new Int8Array(Math.max(1, N)),
      hid: U8(),
    }
    const f = this.f
    let o = 0
    recs.forEach((r, ri) => {
      r.o = o
      r.n = specs[ri].length
      for (const sp of specs[ri]) {
        const i = o++
        f.rec[i] = ri
        f.mode[i] = MODE[sp.mode]
        f.kind[i] = K[sp.kind]
        f.side[i] = SIDES.indexOf(sp.side)
        f.dress[i] = DRESS.indexOf(sp.dress)
        const c = this.sheet.cell(sp.kind, sp.side, sp.dress, 'idle', 0)
        f.row[i] = c[1]
        f.cw[i] = c[2]
        f.s[i] = f.s0[i] = sp.s ?? 0
        f.lat[i] = sp.lat ?? 0
        f.spd[i] = sp.spd ?? 1
        f.thr[i] = sp.thr ?? rand()
        f.inAt[i] = sp.inAt ?? -1e9
        f.outAt[i] = sp.outAt ?? 1e9
        f.far[i] = 85 + rand() * 25
        f.ph[i] = rand()
        f.tm[i] = sp.tm ?? 1 + rand() * 6
        f.face[i] = sp.face ?? 1
        f.grp[i] = sp.grp ?? -1
        f.dx0[i] = sp.dx ?? 0
        f.role[i] = sp.role ?? 0
        f.tint[i] = 0.9 + rand() * 0.18
        f.gx[i] = 1e9
      }
    })

    // the tools' view, as forces.js has always kept it: per figure x, z, how much shows, its scale
    this.marks = new Float32Array(Math.max(1, N) * 4)

    // --- the sheet, and the two draws --------------------------------------------------
    const tex = new THREE.DataTexture(this.sheet.data, this.sheet.width, this.sheet.height, THREE.RGBAFormat, THREE.UnsignedByteType)
    tex.minFilter = tex.magFilter = THREE.NearestFilter
    tex.generateMipmaps = false
    tex.needsUpdate = true
    this.texture = tex
    const cap = Math.max(1, Math.min(N, MAX_DRAWN))
    this.cap = cap
    const g = new THREE.InstancedBufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0]), 3))
    g.setIndex([0, 1, 2, 0, 2, 3])
    const attr = (name) => {
      const a = new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4)
      a.setUsage(THREE.DynamicDrawUsage)
      g.setAttribute(name, a)
      return a
    }
    this.aFoot = attr('aFoot')
    this.aCell = attr('aCell')
    this.aDraw = attr('aDraw')
    this.attrs = [this.aFoot, this.aCell, this.aDraw]
    g.instanceCount = 0
    this.geometry = g
    this.range = { start: 0, count: 0 }
    this.own = {
      uSheet: { value: tex },
      uViewport: { value: new THREE.Vector2(1, 1) },
      uPxW: { value: 0.001 },
      uFigS: { value: null },
      uHasS: { value: 0 },
    }
    const uniforms = { ...shared.uniforms, ...this.own }
    // (drawn with the transparent things, after the fronts' bands and the streams laid on the ground,
    // which write no depth and are pulled toward the eye, so they never wash over a figure's feet;
    // but cut out, not blended, and writing depth as anything solid does)
    this.material = new THREE.ShaderMaterial({ vertexShader: spriteVertex, fragmentShader: spriteFragment, uniforms, transparent: true, blending: THREE.NoBlending, depthWrite: true })
    this.shadowMaterial = new THREE.ShaderMaterial({
      vertexShader: shadowVertex,
      fragmentShader: shadowFragment,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.MultiplyBlending,
    })
    this.mesh = new THREE.Mesh(g, this.material)
    this.mesh.frustumCulled = false
    this.mesh.renderOrder = 8
    this.shadows = new THREE.Mesh(g, this.shadowMaterial)
    this.shadows.frustumCulled = false
    this.shadows.renderOrder = 7
    this.group = new THREE.Group()
    this.group.add(this.shadows, this.mesh)

    this.time = 0
    this.frame = 0
    this.thin = 1
    this.drawn = 0
    this._p = [0, 0, 0, 0]
    this._right = new THREE.Vector3()
    this._fwd = new THREE.Vector3()
    this._v4 = new THREE.Vector4()
    this._size = new THREE.Vector2()
  }

  /** Where a rec's enemy is: the middle of every rec of the other sides in its event (null for none). */
  enemyOf(r, recs) {
    let x = 0
    let z = 0
    let n = 0
    for (const q of recs) {
      if (q.event !== r.event || q.side === r.side) continue
      for (const [px, pz] of q.pts) {
        x += px
        z += pz
        n++
      }
    }
    return n ? [x / n, z / n] : null
  }

  mid(r) {
    return along(r, r.total / 2, [0, 0, 0, 0])
  }

  /** Kinds and dress for a rec's people: who carries what, and who is a chief. */
  outfit(r, rand, { chiefs = 0.03, noMusket = false } = {}) {
    const year = Number.isFinite(r.p.from) ? r.p.from : 1795
    // (a side the sheet has no dress for is drawn in Oʻahu's)
    const side = SIDES.includes(r.side) ? r.side : 'oahu'
    // (muskets by 1790, Kamehameha's side more of them; none in 1783)
    const musket = noMusket || year < 1790 ? 0 : side === 'hawaii' ? 0.14 : 0.06
    const u = rand()
    if (rand() < chiefs) return { kind: 'spear', dress: 'chief', side }
    const kind = u < musket ? 'musket' : u < musket + 0.3 ? 'club' : 'spear'
    return { kind, dress: rand() < 0.55 ? 'kihei' : 'bare', side }
  }

  /** A force along its line: files and knots walking it, or knots standing on it. */
  planForce(r, out, rand) {
    r.move = moveOf(r.p)
    const [sa, sb] = r.stretch
    const L = Math.max(0, sb - sa)
    if (L < 0.3) return
    // (the path down the pali is a single file, taken at a walk)
    const file = /path/i.test(r.p.name || '') && r.total < 12
    r.file = file
    if (file) r.move = 'walk'
    if (r.move === 'stand') {
      // knots along the line, and a few pacing between them
      const knots = Math.max(3, Math.min(12, Math.round(L / 2.4)))
      for (let q = 0; q < knots; q++) {
        const s = sa + ((q + 0.5) / knots) * L + (rand() - 0.5) * (L / knots) * 0.4
        // (a knot's people stand round one foot, set apart across the screen by whole sprite
        // pixels and a little in depth, so it is a knot at every zoom, not a heap when far out)
        const m = 6 + Math.floor(rand() * 9)
        const sk = Math.max(sa, Math.min(sb, s))
        for (let i = 0; i < m; i++) {
          const dx = Math.round((i - (m - 1) / 2) * 5 + (rand() - 0.5) * 4)
          out.push({ mode: 'knot', s: sk, lat: (rand() - 0.5) * 0.24, dx, ...this.outfit(r, rand) })
        }
        for (let i = 0; i < 2; i++) out.push({ mode: 'pacer', s: s + (rand() - 0.5) * 0.8, lat: (rand() - 0.5) * 0.4, spd: 0.4 + rand() * 0.3, ...this.outfit(r, rand, { chiefs: 0 }) })
      }
      return
    }
    // files and knots walking (or running) the line, each dissolving in over its first
    // stretch and out somewhere over its last, never arriving anywhere
    const dens = file ? 2.5 : r.move === 'run' ? 4 : 5
    const n = Math.max(12, Math.min(300, Math.round(L * dens)))
    const lanes = file ? 1 : 3
    const half = file ? 0.03 : r.side === 'hawaii' ? 0.32 : 0.26
    const us = clumps(n, rand)
    const edge = Math.min(L * 0.15, 4)
    // (cut short by an edge at its end, or its start: thinned out over a longer stretch there)
    const cutEnd = sb < r.total - 0.01 ? Math.min(EDGE_THIN, L * 0.3) : 0
    const cutStart = sa > 0.01 ? Math.min(EDGE_THIN * 0.4, L * 0.2) : 0
    for (let i = 0; i < n; i++) {
      const lane = Math.floor(rand() * lanes)
      out.push({
        mode: 'file',
        s: sa + us[i] * L,
        lat: lanes > 1 ? ((lane - (lanes - 1) / 2) * 0.7 + (rand() - 0.5) * 0.5) * half : (rand() - 0.5) * half,
        spd: r.move === 'run' ? 0.8 + rand() * 0.45 : 0.85 + rand() * 0.3,
        inAt: sa + rand() * (cutStart || edge * 0.6),
        outAt: cutEnd ? sb - rand() * cutEnd : sb - edge * 0.2 - rand() * edge,
        ...this.outfit(r, rand),
      })
    }
  }

  /** A front's ranks: behind its line (away from `foe`, a point), or round it when it stands alone. */
  planRanks(r, foe, out, rand, gaps = []) {
    const [sa, sb] = r.stretch
    const L = Math.max(0, sb - sa)
    if (L < 0.3) return
    // which way is behind: the side of the line away from its foe
    const m = this.mid(r)
    let back = 0
    if (foe) back = (foe[0] - m[0]) * -m[3] + (foe[1] - m[1]) * m[2] > 0 ? -1 : 1
    r.back = back
    const n = Math.max(24, Math.min(120, Math.round(L * 11)))
    for (let i = 0; i < n; i++) {
      const s = sa + (0.04 + 0.92 * ((i + rand() * 0.9) / n)) * L
      // (a lane is kept clear behind each field piece, so it is seen)
      if (gaps.some((g) => Math.abs(s - g) < 0.32)) continue
      const depth = back ? back * (0.15 + Math.pow(rand(), 1.2) * 1.2) : (rand() + rand() - 1) * 0.5
      out.push({ mode: 'rank', s, lat: depth, ...this.outfit(r, rand, { chiefs: 0.04 }), tm: 1 + rand() * 8 })
    }
    // at least one chief on every front
    if (!out.some((sp) => sp.dress === 'chief')) Object.assign(out[Math.floor(rand() * out.length)], { kind: 'spear', dress: 'chief' })
  }

  /** Two fronts that meet: ranks behind each, pairs fighting between, and the attacker's field pieces. */
  planFront(A, B, specs, recs, rand) {
    const ia = recs.indexOf(A)
    const ib = recs.indexOf(B)
    // Kamehameha's guns, on his line (none before there were any)
    const year = Number.isFinite(A.p.from) ? A.p.from : 1795
    const ng = A.side === 'hawaii' && year >= 1790 ? Math.max(1, Math.min(3, Math.round(A.total / 2.5))) : 0
    const gunS = Array.from({ length: ng }, (_, q) => ((q + 1) / (ng + 1)) * A.total)
    this.planRanks(A, this.mid(B), specs[ia], rand, gunS)
    this.planRanks(B, this.mid(A), specs[ib], rand)
    // the line between them, and the way from A's to B's
    const M = 24
    const pa = []
    const pb = []
    const t = [0, 0, 0, 0]
    for (let i = 0; i <= M; i++) {
      along(A, (i / M) * A.total, t)
      pa.push([t[0], t[1]])
      along(B, (i / M) * B.total, t)
      pb.push([t[0], t[1]])
    }
    // (B's line may run the other way)
    if (Math.hypot(pa[0][0] - pb[0][0], pa[0][1] - pb[0][1]) > Math.hypot(pa[0][0] - pb[M][0], pa[0][1] - pb[M][1])) pb.reverse()
    const mid = pa.map((p, i) => [(p[0] + pb[i][0]) / 2, (p[1] + pb[i][1]) / 2])
    let nx = 0
    let nz = 0
    for (let i = 0; i <= M; i++) {
      nx += pb[i][0] - pa[i][0]
      nz += pb[i][1] - pa[i][1]
    }
    const nl = Math.hypot(nx, nz) || 1
    const front = { a: A, b: B, nx: nx / nl, nz: nz / nl, aLeft: true, ia, ib }
    const fi = this.fronts.push(front) - 1
    A.front = fi
    B.front = fi
    const cum = [0]
    for (let i = 1; i <= M; i++) cum.push(cum[i - 1] + Math.hypot(mid[i][0] - mid[i - 1][0], mid[i][1] - mid[i - 1][1]))
    const midRec = { pts: mid, cum, total: cum[M] }
    // the pairs, along the line between
    const np = Math.max(4, Math.min(16, Math.round(midRec.total * 2)))
    for (let q = 0; q < np; q++) {
      along(midRec, (0.08 + 0.84 * ((q + 0.2 + rand() * 0.6) / np)) * midRec.total, t)
      const wob = (rand() - 0.5) * 0.4
      const pi =
        this.pairs.push({
          x: t[0] + front.nx * wob,
          z: t[1] + front.nz * wob,
          front: fi,
          period: 1.5 + rand() * 0.8,
          phase: rand(),
          sway: rand() * Math.PI * 2,
          swayT: 3 + rand() * 3,
        }) - 1
      const fa = this.outfit(A, rand, { noMusket: true, chiefs: 0.08 })
      const fb = this.outfit(B, rand, { noMusket: true, chiefs: 0.08 })
      specs[ia].push({ mode: 'duel', grp: pi, role: 0, ...fa, thr: rand() * 0.9 })
      specs[ib].push({ mode: 'duel', grp: pi, role: 1, ...fb, thr: rand() * 0.9 })
    }
    // the guns, each with its crew round it
    for (let q = 0; q < ng; q++) {
      along(A, gunS[q], t)
      const back = A.back || -1
      const gi =
        this.guns.push({
          x: t[0] - t[3] * back * 0.05,
          z: t[1] + t[2] * back * 0.05,
          front: fi,
          period: 7 + rand() * 2.5,
          phase: rand(),
        }) - 1
      const thr = rand() * 0.5
      specs[ia].push({ mode: 'piece', kind: 'gun', side: 'hawaii', dress: 'bare', grp: gi, role: 0, thr })
      specs[ia].push({ mode: 'crew', kind: 'linstock', side: 'hawaii', dress: 'kihei', grp: gi, role: 1, thr })
      specs[ia].push({ mode: 'crew', kind: 'rammer', side: 'hawaii', dress: 'bare', grp: gi, role: 2, thr })
    }
  }

  /**
   * Every frame: dt seconds on; show the district's weight times the near
   * zoom's; quiet off the tour. Each rec's own weight is its w (forces.js).
   */
  update(dt, show, quiet) {
    const app = this.app
    const cam = app.camera
    const f = this.f
    const recs = this.recs
    // (the tools can hold everyone still, so a screenshot and this state agree)
    if (this.hold) dt = 0
    this.time += dt
    this.frame++
    const T = this.time
    cam.updateMatrixWorld()
    const e = cam.matrixWorld.elements
    const right = this._right.set(e[0], 0, e[2]).normalize()
    const fwd = this._fwd.set(-e[8], -e[9], -e[10])
    const cx = cam.position.x
    const cy = cam.position.y
    const cz = cam.position.z
    // the target drawn into, and the pixel's size in the world
    const size = app.pipeline?.size || app.renderer.getDrawingBufferSize(this._size)
    const dpr = size.y / Math.max(1, innerHeight)
    this.dpr = dpr
    const tanH = Math.tan((cam.fov * Math.PI) / 360)
    this.own.uViewport.value.set(size.x, size.y)
    this.own.uPxW.value = (2 * tanH) / Math.max(1, size.y)
    const shadow = app.districts?.on ? app.districts.cur?.terrain?.shadow?.texture : null
    this.own.uFigS.value = shadow || null
    this.own.uHasS.value = shadow ? 1 : 0
    const vert = app.world.uniforms.uVert.value
    // (while the ground itself is changing, the district easing in or out over its island, the
    // island's own detail, the year, everyone's ground is looked up again, not only the movers')
    const D = app.districts
    const g0 = D?.on ? 1 + D.k : 0
    const g1 = D?.cur?.parent?.k ?? 0
    const g2 = app.timeline?.year ?? 0
    const stale = g0 !== this._g0 || g1 !== this._g1 || g2 !== this._g2
    this._g0 = g0
    this._g1 = g1
    this._g2 = g2
    // world units to the sprite pixel at the camera's target, for the pace
    const d0 = app.rig?.state?.distance ?? 16
    const unit = (cssScale(d0) * d0 * 2 * tanH) / Math.max(1, innerHeight)
    const pace = quiet ? 0.5 : 1
    const vWalk = GAIT_WALK * unit * pace
    const vRun = GAIT_RUN * unit * pace
    const fade = dt > 0 ? dt / FADE_S : 1
    // (a force's people thin out as the view widens, where each stands taller on the ground)
    const crowd = Math.min(1, Math.max(0.35, Math.pow(24 / Math.max(1, d0), 0.8)))
    // each front: which side stands to the left on the screen (held while the camera looks across the gap)
    for (const fr of this.fronts) {
      const d = fr.nx * right.x + fr.nz * right.z
      if (d > 0.2) fr.aLeft = true
      else if (d < -0.2) fr.aLeft = false
    }
    // each edge as the camera sees it: the way to it, and how wide 300 m round it looks from here
    for (let q = 0; q < this.edges.length; q++) {
      const ed = this.edges[q]
      const ey = Math.max(app.world.metresAt(ed.x, ed.z), 0) * vert
      const vx = ed.x - cx
      const vy = ey - cy
      const vz = ed.z - cz
      const l = Math.hypot(vx, vy, vz) || 1
      ed.ux = vx / l
      ed.uy = vy / l
      ed.uz = vz / l
      // (a little wider, for the figure's height above its foot)
      ed.cos = Math.cos(Math.atan((ed.clear * 1.3) / l))
    }
    const p = this._p
    const M = this.marks
    const foot = this.aFoot.array
    const cell = this.aCell.array
    const draw = this.aDraw.array
    let j = 0
    let wanted = 0
    const cap = this.cap
    for (let ri = 0; ri < recs.length; ri++) {
      const r = recs[ri]
      const w = r.w * show
      if (w <= 0.002 && !r.drawnLast) {
        // (nothing of it showing, now or last frame: leave its people where they are)
        continue
      }
      // (back after a while: its people's ground is looked up afresh)
      const fresh = stale || !r.drawnLast
      r.drawnLast = w > 0.002
      const fr = r.front !== undefined ? this.fronts[r.front] : null
      const isA = fr ? fr.a === r : false
      const wr = w * this.thin * (r.line ? 1 : crowd)
      for (let i = r.o; i < r.o + r.n; i++) {
        const mode = f.mode[i]
        let anim = A_IDLE
        let fi = 0
        let dx = 0
        let nudge = 0
        let on = wr > f.thr[i]
        let x = 0
        let z = 0
        let facing = f.face[i]
        if (mode === MODE.file) {
          const v = (r.move === 'run' ? vRun : vWalk) * f.spd[i]
          let s = f.s[i] + v * dt
          const sa = r.stretch[0]
          const sb = r.stretch[1]
          if (s > sb) s = sa + ((s - sa) % (sb - sa))
          f.s[i] = s
          along(r, s, p)
          x = p[0] - p[3] * f.lat[i]
          z = p[1] + p[2] * f.lat[i]
          facing = this.faceToward(p[2], p[3], facing)
          const rate = (r.move === 'run' ? 1.7 : 1.15) * f.spd[i] * pace
          f.ph[i] = (f.ph[i] + rate * dt) % 1
          anim = r.move === 'run' ? A_RUN : A_WALK
          fi = Math.floor(f.ph[i] * 4) % 4
          if (s < f.inAt[i] || s > f.outAt[i]) on = false
          // (a figure that has stepped into water is drawn back toward its line)
          if (f.wet[i]) f.lat[i] *= 1 - Math.min(1, dt * 0.5)
        } else if (mode === MODE.knot || mode === MODE.pacer) {
          let s = f.s0[i]
          if (mode === MODE.pacer) {
            // to and fro over a stretch of the line
            const A = 0.7
            f.tt[i] += vWalk * 0.6 * f.spd[i] * dt
            const u = f.tt[i] / (2 * A) + f.ph[i]
            const tri = 2 * Math.abs(u - Math.floor(u + 0.5))
            s = Math.max(r.stretch[0], Math.min(r.stretch[1], f.s0[i] + (tri - 0.5) * 2 * A))
            const dir = u - Math.floor(u) < 0.5 ? 1 : -1
            along(r, s, p)
            facing = this.faceToward(p[2] * dir, p[3] * dir, facing)
            anim = A_WALK
            fi = Math.floor(((T * 1.1 * pace + f.ph[i]) % 1) * 4)
          } else {
            along(r, s, p)
            if (r.enemy) facing = this.faceToward(r.enemy[0] - p[0], r.enemy[1] - p[1], facing)
            dx = f.dx0[i]
            anim = A_IDLE
            fi = Math.floor(T / (0.9 + f.tint[i]) + f.ph[i] * 2) & 1
          }
          x = p[0] - p[3] * f.lat[i]
          z = p[1] + p[2] * f.lat[i]
        } else if (mode === MODE.rank) {
          along(r, f.s0[i], p)
          // standing, shuffling a little along the line, now and then a musket fired or a weapon raised
          // (off the tour nobody fights: a volley or a raised weapon is let fall)
          f.tm[i] -= dt
          if (quiet && f.st[i] >= 2) f.st[i] = 0
          const st = f.st[i]
          if (st === 1) {
            const step = vWalk * 0.5 * dt
            const d = f.offTo[i] - f.off[i]
            if (Math.abs(d) <= step) {
              f.off[i] = f.offTo[i]
              f.st[i] = 0
            } else f.off[i] += Math.sign(d) * step
            facing = this.faceToward(p[2] * Math.sign(d), p[3] * Math.sign(d), facing)
            anim = A_WALK
            fi = Math.floor(((T * 1.15 + f.ph[i]) % 1) * 4)
          } else if (st === 2 || st === 3) {
            f.tt[i] += dt
            const t = f.tt[i]
            anim = A_ENGAGE
            if (st === 2) fi = t < 0.55 ? 0 : t < 0.67 ? 1 : 2
            else fi = 2
            if (t > (st === 2 ? 1.4 : 0.8)) f.st[i] = 0
          } else {
            anim = A_IDLE
            fi = Math.floor(T / (0.9 + f.tint[i]) + f.ph[i] * 2) & 1
          }
          if (st !== 1) {
            if (fr) facing = (isA ? fr.aLeft : !fr.aLeft) ? 1 : -1
            else if (r.enemy) facing = this.faceToward(r.enemy[0] - p[0], r.enemy[1] - p[1], facing)
          }
          if (f.st[i] === 0 && f.tm[i] <= 0) {
            const u = Math.random()
            f.tm[i] = 3 + Math.random() * 7
            if (f.kind[i] === K.musket && !quiet && fr) {
              f.st[i] = 2
              f.tt[i] = 0
            } else if (u < 0.55) {
              f.st[i] = 1
              f.offTo[i] = (Math.random() - 0.5) * 0.5
            } else if (!quiet && u < 0.75) {
              f.st[i] = 3
              f.tt[i] = 0
            }
          }
          x = p[0] - p[3] * f.lat[i] + p[2] * f.off[i]
          z = p[1] + p[2] * f.lat[i] + p[3] * f.off[i]
        } else if (mode === MODE.duel) {
          const pr = this.pairs[f.grp[i]]
          const fr2 = this.fronts[pr.front]
          const a = f.role[i] === 0
          // the pair's ground, rocking slowly toward one side and the other
          const rock = 0.1 * Math.sin((T * 2 * Math.PI) / pr.swayT + pr.sway)
          x = pr.x + fr2.nx * rock
          z = pr.z + fr2.nz * rock
          const left = a === fr2.aLeft
          facing = left ? 1 : -1
          // striking in turn: the first half of the bout A's, the second B's; the one struck at gives a pixel
          const u = (T / pr.period + pr.phase) % 1
          const mine = a ? u < 0.5 : u >= 0.5
          const v = (u % 0.5) / 0.5
          const push = Math.round(1.6 * Math.sin((T * 2 * Math.PI) / (pr.swayT * 1.7) + pr.sway))
          dx = (left ? -4 : 4) + push
          anim = A_ENGAGE
          if (quiet) {
            // (off the tour the pairs are not drawn: standing, as they go)
            on = false
            anim = A_IDLE
            fi = 0
          } else if (mine) fi = v < 0.3 ? 0 : v < 0.55 ? 1 : 2
          else {
            // on guard, giving a pixel as the blow comes in
            fi = 2
            if (v >= 0.3 && v < 0.7) dx += left ? -1 : 1
          }
        } else {
          // the field piece and its crew: rammed, the match put to it, fired, smoking
          const gn = this.guns[f.grp[i]]
          const fr2 = this.fronts[gn.front]
          x = gn.x
          z = gn.z
          const g = fr2.aLeft ? 1 : -1
          const t = quiet ? 99 : ((T / gn.period + gn.phase) % 1) * gn.period
          const role = f.role[i]
          // (each of the three: the engage frame it shows at t into the round, or -1 to stand)
          let e = -1
          if (role === 0) {
            facing = g
            e = t >= 3.5 && t < 3.65 ? 0 : t >= 3.65 && t < 4.4 ? 1 : t >= 4.4 && t < 5.2 ? 2 : -1
          } else if (role === 1) {
            // the linstock, behind the breech
            facing = g
            dx = -11 * g
            e = t >= 2.6 && t < 3.2 ? 0 : t >= 3.2 && t < 3.6 ? 1 : t >= 3.6 && t < 4.3 ? 2 : -1
          } else {
            // the rammer, at the muzzle, turned to it (and drawn in front of the piece)
            facing = -g
            dx = 11 * g
            nudge = 0.02
            e = t < 0.9 ? Math.min(2, Math.floor(t / 0.3)) : -1
          }
          if (e >= 0) {
            anim = A_ENGAGE
            fi = e
          } else {
            anim = A_IDLE
            fi = role === 0 ? 0 : Math.floor(T * (0.6 + 0.1 * role) + f.ph[i]) & 1
          }
        }
        f.face[i] = facing
        f.fr[i] = anim + fi
        f.dx[i] = dx
        f.x[i] = x
        f.z[i] = z
        // the ground under it: looked up again once it has moved a metre, and now and then
        if (fresh || Math.abs(x - f.gx[i]) + Math.abs(z - f.gz[i]) > 0.01 || (this.frame + i) % 30 === 0) {
          f.gm[i] = app.world.metresAt(x, z)
          f.gx[i] = x
          f.gz[i] = z
          f.wet[i] = f.gm[i] < 0.15 ? 1 : 0
        }
        if (f.wet[i]) on = false
        const gy = Math.max(f.gm[i], 0) * vert
        const depth = (x - cx) * fwd.x + (gy - cy) * fwd.y + (z - cz) * fwd.z
        if (depth > f.far[i] || depth < 0.05) on = false
        // nothing near the edge of the pali, not even for a step, and nothing over it on the screen
        // (inside on the ground: gone at once; over it on the screen: dissolved, as anywhere else)
        let edge = false
        let seen = false
        for (let q = 0; q < this.edges.length; q++) {
          const ed = this.edges[q]
          if (Math.abs(x - ed.x) < ed.clear && Math.abs(z - ed.z) < ed.clear && Math.hypot(x - ed.x, z - ed.z) < ed.clear) edge = true
          const vx = x - cx
          const vy = gy - cy
          const vz = z - cz
          if ((vx * ed.ux + vy * ed.uy + vz * ed.uz) / (Math.hypot(vx, vy, vz) || 1) > ed.cos) seen = true
        }
        f.hid[i] = edge || seen ? 1 : 0
        if (edge || seen) on = false
        if (on) wanted++
        let vis = f.vis[i]
        vis = on ? Math.min(1, vis + fade) : Math.max(0, vis - fade)
        if (edge || w <= 0.002) vis = 0
        f.vis[i] = vis
        const k = pixelScale(depth, dpr)
        f.k[i] = vis > 0 ? k : 0
        const m = i * 4
        M[m] = x
        M[m + 1] = z
        M[m + 2] = vis
        M[m + 3] = f.k[i]
        if (vis <= 0 || j >= cap) continue
        const o = j * 4
        foot[o] = x
        foot[o + 1] = f.gm[i]
        foot[o + 2] = z
        foot[o + 3] = nudge
        const cw = f.cw[i]
        cell[o] = (anim + fi) * cw
        cell[o + 1] = f.row[i]
        cell[o + 2] = cw
        cell[o + 3] = SPRITE_H
        draw[o] = k
        draw[o + 1] = facing * f.tint[i]
        draw[o + 2] = vis
        draw[o + 3] = dx
        j++
      }
    }
    // (over the budget, every rec is thinned alike next frame)
    if (wanted > cap) this.thin = Math.max(0.1, this.thin * 0.92)
    else if (wanted < cap * 0.85 && this.thin < 1) this.thin = Math.min(1, this.thin * 1.04)
    this.drawn = j
    this.geometry.instanceCount = j
    this.group.visible = j > 0
    if (j > 0) {
      this.range.count = j * 4
      for (let q = 0; q < 3; q++) {
        const a = this.attrs[q]
        a.clearUpdateRanges()
        a.updateRanges.push(this.range)
        a.needsUpdate = true
      }
    }
  }

  /** Which way to face for a heading (x, z) on the ground: right or left on the screen, held when it is near neither. */
  faceToward(hx, hz, cur) {
    const r = this._right
    const l = Math.hypot(hx, hz) || 1
    const d = (hx * r.x + hz * r.z) / l
    if (d > 0.15) return 1
    if (d < -0.15) return -1
    return cur || 1
  }

  /** For the tools: the scale a figure this far from the eye is drawn at, in device pixels to the sprite pixel. */
  scaleAt(depth) {
    return pixelScale(depth, this.dpr || 1)
  }

  /**
   * For the tools: where figure i stands on the screen, as the shader puts it
   * (sprite.glsl.js footPixel), in the target's pixels from its top left; with
   * its frame in the sheet and its facing. Null when it isn't drawn.
   */
  screenRect(i) {
    const f = this.f
    if (f.vis[i] <= 0 || !f.k[i]) return null
    const cam = this.app.camera
    const v = this._v4.set(f.x[i], Math.max(f.gm[i], 0) * this.app.world.uniforms.uVert.value, f.z[i], 1)
    v.applyMatrix4(cam.matrixWorldInverse).applyMatrix4(cam.projectionMatrix)
    if (v.w <= 0) return null
    const W = this.own.uViewport.value.x
    const H = this.own.uViewport.value.y
    const k = f.k[i]
    const px = Math.floor(((v.x / v.w) * 0.5 + 0.5) * W + 0.5) + f.dx[i] * k
    const py = Math.floor(((v.y / v.w) * 0.5 + 0.5) * H + 0.5)
    const w = f.cw[i] * k
    const h = SPRITE_H * k
    return { x: px - w / 2, y: H - py - h, w, h, k, cell: [f.fr[i] * f.cw[i], f.row[i], f.cw[i], SPRITE_H], facing: f.face[i], vis: f.vis[i] }
  }

  /** For the tools: what is drawn, by side, kind and what they are doing. */
  stats() {
    const f = this.f
    const out = { figures: this.drawn, planned: this.count, fronts: this.fronts.length, pairs: this.pairs.length, guns: this.guns.length, sides: {}, kinds: {}, k: {} }
    for (let i = 0; i < this.count; i++) {
      if (f.vis[i] <= 0) continue
      const s = SIDES[f.side[i]]
      const kd = KINDS[f.kind[i]]
      out.sides[s] = (out.sides[s] || 0) + 1
      out.kinds[kd] = (out.kinds[kd] || 0) + 1
      out.k[f.k[i]] = (out.k[f.k[i]] || 0) + 1
    }
    return out
  }

  static MODE = MODE
  static KIND = K

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
    this.shadowMaterial.dispose()
    this.texture.dispose()
  }
}
