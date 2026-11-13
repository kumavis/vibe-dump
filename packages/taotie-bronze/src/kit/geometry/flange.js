// Flanges (扉棱) — L3 sculpture on the mould seams and mask axes.
//
// Flanges began as the fins of bronze that leaked into the joints between mould
// sections; Anyang founders made a feature of them, cutting the joint deep and
// notching it, so a flange always sits on a mould seam or a mask's centre line.
//
// Geometry (research/03 §4, research/01 §6):
//   * a solid slab FOLLOWING A PATH — a lathe meridian (curving with the wall:
//     lathe info.meridian(azimuth, range)) or a straight edge (from/to/out);
//   * side outline in (σ along the path, t outward): constant-height strip (or a
//     height law), cut into an integer number of full segments by notches —
//     'square' (F1), 'score' (the dense ladder of the Met gu), 'T' / 'L' (F1 with
//     scored faces), 'hook' (F2: each segment's upper end a beak curling down),
//     'none' (F0);
//   * ends: 'square' | 'taper' | 'beak' (legacy hook) | 'step' (overhangs the
//     register end, the gu waist drum) | 'spur' (curls out past the wall, the gu
//     foot) | 'hook' (rises past the rim);
//   * cross-section: faces taper 2–5° toward a flat crest, small bevel on every
//     arris so edges catch light, root embedded in the wall;
//   * incised T/L/ladder grooves on both faces as a ReliefMap (normal map +
//     cavity), so the patina collects in them;
//   * seeded hand-cut irregularity: notch spacing, crest waver, sway, thickness.

import * as THREE from 'three'
import { Rng } from '../util/rng.js'
import { ReliefPanel } from '../relief/panel.js'
import { PatinaMaterial } from '../material/patina.js'

const DEG = Math.PI / 180

/**
 * @param {object} o
 * @param {{length:number, frame(σ:number):{p,n,d,b}}} [o.path]  a path (lathe meridian, or anything with frame())
 * @param {THREE.Vector3} [o.from]  straight path: root start (bottom), on the wall surface
 * @param {THREE.Vector3} [o.to]    straight path: root end (top)
 * @param {THREE.Vector3} [o.out]   straight path: outward direction
 * @param {number|((f:number)=>number)} o.height  projection (mm), or a law of f = σ/length ∈ [0,1]
 * @param {number} o.thickness      slab thickness at the root (mm)
 * @param {object|null} [o.notches]  { shape: 'square'|'score'|'T'|'L'|'hook'|'none', pitch (mm, alias every),
 *        depth (× height), width (mm), pattern: ['T','L',…] (incision per segment) }
 * @param {number} [o.hook]         legacy: top end beaks up this far (mm) ≡ ends.end = { type: 'beak', length }
 * @param {{start?:End,end?:End}} [o.ends]  End = 'square'|'taper'|{ type, length, height }
 * @param {number} [o.embed]        root sunk into the wall (mm)
 * @param {number} [o.taper]        face taper toward the crest (deg per side, default 3)
 * @param {number} [o.bevel]        arris bevel (mm)
 * @param {number} [o.waver]        hand-cut irregularity 0..1 (default 0.5)
 * @param {number} [o.seed]
 * @param {boolean|'auto'} [o.incise]  scored grooves on the faces (needs a PatinaMaterial; default auto)
 * @param {THREE.Material} o.material
 * @param {string} [o.part]
 * @returns {THREE.Mesh}  userData.flange = { length, outline, relief }
 */
export function flange(o) {
  const {
    from, to, out,
    height = 10,
    thickness = 4,
    notches = { every: 22, depth: 0.4, width: 3 },
    hook = 0,
    ends = {},
    embed,
    taper = 3,
    bevel,
    waver = 0.5,
    seed = 1,
    incise = 'auto',
    material,
    part = 'flanges',
  } = o
  const path = o.path || straightPath(from, to, out)
  const L = path.length
  const rng = new Rng(seed)
  const hFn = typeof height === 'function' ? height : () => height
  const hMaxNominal = sampleMax((f) => hFn(f), 24)
  const e = embed ?? Math.max(0.6, Math.min(thickness * 0.6, 2))
  const endSpec = { start: normEnd(ends.start), end: normEnd(ends.end ?? (hook > 0 ? { type: 'beak', length: hook } : 'square')) }

  // o.outline (optional): a measured side silhouette instead of the generated one — a CCW polygon of
  // [σ (mm along the path, may run past 0 / L), t (mm out from the wall, root at −embed)]; o.grooves:
  // its incisions ([[σ, t]…]…), default = one line following the crest at a 1.5 mm inset
  // o.grooveStyle (optional, with o.outline): { width, depth } mm of those incisions (default 0.55 / 0.35 × thickness/4)
  const outline = o.outline ? { ...customOutline(o.outline, o.grooves), ...(o.grooveStyle ? { groove: o.grooveStyle } : {}) } : flangeOutline({ length: L, height: hFn, notches, ends: endSpec, embed: e, waver, rng: rng.fork('outline') })
  const pts = outline.points

  // ---- frames along the path (sampled, interpolated; extrapolated past the ends)
  let sMin = Infinity, sMax = -Infinity, tMax = 0
  for (const [s, t] of pts) { sMin = Math.min(sMin, s); sMax = Math.max(sMax, s); tMax = Math.max(tMax, t) }
  const frames = sampleFrames(path, sMin - 1, sMax + 1, 0.5)

  // seeded hand-cut sway and thickness variation
  const sway = noise1D(rng.fork('sway'), sMin, sMax, Math.max(12, L / 4))
  const thick = noise1D(rng.fork('thick'), sMin, sMax, Math.max(15, L / 3))
  const swayAmp = 0.25 * waver * Math.min(1, thickness / 4)
  const halfW = (s, t) => {
    const w0 = (thickness / 2) * (1 + 0.1 * waver * thick(s))
    return Math.max(w0 * 0.45, w0 - Math.tan(taper * DEG) * Math.max(0, t))
  }
  const tanT = Math.tan(taper * DEG)
  const bev = bevel ?? Math.min(0.8, Math.max(0.25, thickness * 0.12))

  const map = (s, t, z, outV) => {
    const F = frames(s)
    const zz = z + swayAmp * sway(s)
    outV.set(
      F.p.x + F.n.x * t + F.b.x * zz,
      F.p.y + F.n.y * t + F.b.y * zz,
      F.p.z + F.n.z * t + F.b.z * zz,
    )
    return outV
  }

  // ---- inset outline (face polygons) by the bevel
  const inset = offsetPolygon(pts, bev)

  // ---- triangulate the face in the path's mid plane (planar for meridians and straight edges)
  const F0 = frames((sMin + sMax) / 2)
  const Fm = { p: F0.p.clone(), n: F0.n.clone(), d: F0.d.clone() }
  const tmp = new THREE.Vector3()
  const contour = inset.map(([s, t]) => {
    map(s, t, 0, tmp).sub(Fm.p)
    return new THREE.Vector2(tmp.dot(Fm.d), tmp.dot(Fm.n))
  })
  const tris = THREE.ShapeUtils.triangulateShape(contour, [])

  // ---- incised grooves → ReliefMap (panel space: x = σ - sMin, y = t + e)
  const pw = sMax - sMin, ph = tMax + e
  const isPatina = !material || material.isPatinaMaterial
  let relief = null
  let mat = material
  if ((incise === 'auto' ? isPatina : incise) && outline.grooves.length) {
    relief = bakeGrooves(outline, { w: pw, h: ph, sMin, e, thickness, seed })
    mat = new PatinaMaterial({ relief, cavity: material?.local?.uConstCavity?.value ?? 0.8 })
  }
  if (!mat) mat = new PatinaMaterial()
  const UV = (s, t) => [(s - sMin) / pw, (t + e) / ph]

  // ---- assemble
  const P = [], N = [], U = [], T = [], I = []
  const v = new THREE.Vector3()
  const push = (s, t, z, n, uv, tg) => {
    map(s, t, z, v)
    P.push(v.x, v.y, v.z)
    N.push(n.x, n.y, n.z)
    U.push(uv[0], uv[1])
    T.push(tg.x, tg.y, tg.z, tg.w)
    return P.length / 3 - 1
  }
  const faceN = (s, sgn) => {
    const F = frames(s)
    return new THREE.Vector3().copy(F.b).multiplyScalar(sgn).addScaledVector(F.n, tanT).normalize()
  }
  // faces
  for (const sgn of [1, -1]) {
    const base = P.length / 3
    for (const [s, t] of inset) {
      const F = frames(s)
      push(s, t, sgn * halfW(s, t), faceN(s, sgn), UV(s, t), { x: F.d.x, y: F.d.y, z: F.d.z, w: sgn })
    }
    for (const [a, b, c] of tris) {
      // wind so the triangle faces sgn·B
      const A = new THREE.Vector3().fromArray(P, (base + a) * 3), B = new THREE.Vector3().fromArray(P, (base + b) * 3), C = new THREE.Vector3().fromArray(P, (base + c) * 3)
      const fn = B.sub(A).cross(C.sub(A))
      const want = faceN(inset[a][0], sgn)
      if (fn.dot(want) >= 0) I.push(base + a, base + b, base + c)
      else I.push(base + a, base + c, base + b)
    }
  }
  // side + bevel strips, one quad set per outline edge; vertex normals smoothed across gentle turns
  const n2 = edgeNormals(pts)
  const nPts = pts.length
  for (let k = 0; k < nPts; k++) {
    const k1 = (k + 1) % nPts
    const ends2 = [k, k1].map((q, side) => {
      // 2D outward normal at this end of edge k: smooth if the turn is gentle
      // the neighbouring edge at this vertex: the one before (side 0) or after (side 1)
      const nb = n2[side === 0 ? (q - 1 + nPts) % nPts : k1]
      let nn = n2[k]
      if (nb[0] * nn[0] + nb[1] * nn[1] > Math.cos(40 * DEG)) nn = norm2([nb[0] + nn[0], nb[1] + nn[1]])
      const [s, t] = pts[q]
      const F = frames(s)
      const side3 = new THREE.Vector3().copy(F.d).multiplyScalar(nn[0]).addScaledVector(F.n, nn[1]).normalize()
      return { q, s, t, side3, F: { d: F.d.clone() } }
    })
    const col = (end, which) => {
      const { q, s, t, side3, F } = end
      const tg = { x: F.d.x, y: F.d.y, z: F.d.z, w: 1 }
      const w = halfW(s, t)
      const [is, it] = inset[q]
      if (which === 0) return push(is, it, w, new THREE.Vector3().copy(side3).add(faceN(s, 1)).normalize(), UV(is, it), tg)
      if (which === 1) return push(s, t, w - bev, new THREE.Vector3().copy(side3).multiplyScalar(2).add(faceN(s, 1)).normalize(), UV(s, t), tg)
      if (which === 2) return push(s, t, -(w - bev), new THREE.Vector3().copy(side3).multiplyScalar(2).add(faceN(s, -1)).normalize(), UV(s, t), tg)
      return push(is, it, -w, new THREE.Vector3().copy(side3).add(faceN(s, -1)).normalize(), UV(is, it), tg)
    }
    const A = [0, 1, 2, 3].map((w) => col(ends2[0], w))
    const B = [0, 1, 2, 3].map((w) => col(ends2[1], w))
    for (let r = 0; r < 3; r++) {
      // quad A[r] A[r+1] B[r+1] B[r]; orient outward
      const a = A[r], b = A[r + 1], c = B[r + 1], d = B[r]
      const pa = new THREE.Vector3().fromArray(P, a * 3), pb = new THREE.Vector3().fromArray(P, b * 3), pd = new THREE.Vector3().fromArray(P, d * 3)
      const fn = pd.clone().sub(pa).cross(pb.clone().sub(pa))
      const want = new THREE.Vector3().fromArray(N, a * 3)
      if (fn.dot(want) >= 0) I.push(a, d, c, a, c, b)
      else I.push(a, b, c, a, c, d)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2))
  geo.setAttribute('tangent', new THREE.Float32BufferAttribute(T, 4))
  geo.setIndex(I)
  geo.computeBoundingBox()
  geo.computeBoundingSphere()
  const mesh = new THREE.Mesh(geo, mat)
  mesh.userData.part = part
  mesh.userData.flange = { length: L, outline: pts, relief, height: hMaxNominal }
  mesh.castShadow = mesh.receiveShadow = true
  return mesh
}

// ------------------------------------------------------------------ outline

function normEnd(e) {
  if (!e) return { type: 'square' }
  if (typeof e === 'string') return { type: e }
  return { type: 'square', ...e }
}

/**
 * The flange's side outline: a CCW polygon in (σ, t) — σ along the path from the
 * start (bottom) end, t outward from the wall surface (root at t = -embed) —
 * plus the incised groove polylines for its faces.
 * @returns {{ points: Array<[number,number]>, grooves: Array<Array<[number,number]>>, segments: Array<[number,number]> }}
 */
export function flangeOutline({ length: L, height, notches, ends, embed: e, waver = 0.5, rng = new Rng(1) }) {
  const hFn = typeof height === 'function' ? height : () => height
  const H0 = sampleMax(hFn, 16)
  const crestN = noise1D(rng.fork('crest'), -L, 2 * L, Math.max(8, L / 6))
  const h = (s) => Math.max(0.5, hFn(Math.min(1, Math.max(0, s / L))) * (1 + 0.035 * waver * crestN(s)))
  const startE = normEnd(ends?.start), endE = normEnd(ends?.end)

  // taper ends ramp the crest
  const taperIn = (s) => {
    let k = 1
    if (startE.type === 'taper') k = Math.min(k, 0.2 + 0.8 * smooth01(s / (startE.length ?? H0 * 1.5)))
    if (endE.type === 'taper') k = Math.min(k, 0.2 + 0.8 * smooth01((L - s) / (endE.length ?? H0 * 1.5)))
    return k
  }
  const hc = (s) => h(s) * taperIn(s)

  // ---- notch layout: integer number of full segments, slight hand-cut jitter
  const N = notches === null || notches === false ? { shape: 'none' } : { shape: 'square', ...notches }
  if (N.every != null && N.pitch == null) N.pitch = N.every
  const shape = N.shape || 'square'
  const pitch = N.pitch ?? (shape === 'score' ? Math.max(3, H0 * 0.45) : Math.max(6, H0 * 1.5))
  const depth = N.depth ?? (shape === 'score' ? 0.28 : shape === 'hook' ? 0.5 : 0.42)
  const width = N.width ?? (shape === 'score' ? Math.max(1, pitch * 0.38) : Math.max(1.5, pitch * 0.3))
  const capPts = endCap(endE, L, hc(L), H0, +1)
  const sTop = capPts.length ? capPts[capPts.length - 1][0] : L
  const startCap = endCap(startE, 0, hc(0), H0, -1).reverse()
  const sBot = startCap.length ? startCap[0][0] : 0
  const c0 = Math.max(0, sBot), c1 = Math.min(L, sTop)
  const nSeg = shape === 'none' ? 1 : Math.max(1, Math.round((c1 - c0) / pitch))
  const segL = (c1 - c0) / nSeg
  const cuts = [] // notch centres, ascending
  for (let k = 1; k < nSeg; k++) cuts.push(c0 + k * segL + (rng.next() - 0.5) * 0.12 * segL * waver)
  const segments = []
  for (let k = 0; k < nSeg; k++) segments.push([k === 0 ? c0 : cuts[k - 1] + width / 2, k === nSeg - 1 ? c1 : cuts[k] - width / 2])

  const pts = []
  const add = (s, t) => {
    const last = pts[pts.length - 1]
    if (!last || Math.abs(last[0] - s) > 1e-4 || Math.abs(last[1] - t) > 1e-4) pts.push([s, t])
  }
  // dense crest run from s=a down to s=b (a > b) at height fn
  const run = (a, b, fn) => {
    const n = Math.max(1, Math.ceil(Math.abs(a - b) / 1.2))
    for (let i = 0; i <= n; i++) {
      const s = a + ((b - a) * i) / n
      add(s, fn(s))
    }
  }

  // root, start → end
  add(0, -e)
  add(L, -e)
  // end cap (σ = L) from the root up to the crest; returns the σ where the crest begins
  for (const p of capPts) add(p[0], p[1])
  if (!capPts.length) add(L, hc(L))

  // crest from the end back to the start, segment by segment (top segment first)
  const grooves = []
  const d = (s) => depth * hc(s)
  for (let k = nSeg - 1; k >= 0; k--) {
    const [a, b] = segments[k]
    const top = k === nSeg - 1 ? Math.min(sTop, L) : b
    const bot = k === 0 ? Math.max(sBot, 0) : a
    if (shape === 'hook' && k < nSeg - 1) {
      // beak at the upper end of the segment, hanging down over a mouth
      const seg = b - a
      const beak = Math.min(seg * 0.45, H0 * 0.9), mouth = Math.min(seg * 0.22, beak * 0.6)
      const drop = 0.24, stem = 0.3
      add(b, hc(b))
      run(b, b - beak, hc)
      add(b - beak, hc(b - beak) * (1 - drop))
      add(b - beak + mouth, hc(b - beak + mouth) * (1 - drop))
      add(b - beak + mouth, hc(b - beak + mouth) * (1 - stem))
      run(b - beak + mouth, bot, (s) => hc(s) * (1 - stem))
    } else if (shape === 'hook') {
      run(top, bot, (s) => hc(s) * (k === nSeg - 1 ? 1 : 0.7))
    } else {
      run(top, bot, hc)
    }
    if (k > 0) {
      // the notch below this segment
      const c = cuts[k - 1]
      const sHi = c + width / 2, sLo = c - width / 2
      add(sHi, hc(sHi) - d(sHi))
      add(sLo, hc(sLo) - d(sLo))
      add(sLo, hc(sLo))
    }
  }
  for (const p of startCap) add(p[0], p[1])
  add(startCap.length ? startCap[startCap.length - 1][0] : 0, -e)
  if (pts.length > 2 && Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]) < 1e-4) pts.pop()

  // ---- incised grooves (research/03 §4.2: 0.6 mm wide, inset ~1.5 mm, both faces)
  const inset = Math.min(1.5, H0 * 0.18)
  if (shape === 'score') {
    // the ladder: a groove parallel to the crest below the notch floors, rungs from each notch down to it
    // (notches.rungs 'full': no crest line, every rung runs from its notch down to the root — Met gu 1985.214.4)
    const full = N.rungs === 'full'
    if (!full) {
      const line = []
      const s0 = Math.max(0, sBot), s1 = Math.min(L, sTop)
      const n = Math.max(2, Math.ceil((s1 - s0) / 1.5))
      for (let i = 0; i <= n; i++) {
        const s = s0 + ((s1 - s0) * i) / n
        line.push([s, hc(s) - d(s) - inset * 0.8])
      }
      grooves.push(line)
    }
    for (const c of cuts) grooves.push([[c, hc(c) - d(c)], [c, full ? Math.min(0.4, hc(c) * 0.1) : hc(c) - d(c) - inset * 0.8]])
  } else if (shape !== 'none') {
    // follow the crest (and its notches) at the inset
    const off = offsetPolygon(pts, inset)
    let cur = []
    for (let i = 0; i < off.length; i++) {
      const [s, t] = off[i]
      const ok = t > Math.max(inset, 0.3 * H0) && s > sBot + inset * 0.5 && s < sTop - inset * 0.5
      if (ok) cur.push([s, t])
      else if (cur.length) { if (cur.length > 1) grooves.push(cur); cur = [] }
    }
    if (cur.length > 1) grooves.push(cur)
    // T / L stems
    const pattern = N.pattern || (shape === 'T' || shape === 'square' ? ['T'] : shape === 'L' ? ['L', 'J'] : [])
    segments.forEach(([a, b], k) => {
      const kind = pattern.length ? pattern[k % pattern.length] : null
      if (!kind || b - a < inset * 4) return
      const sx = kind === 'T' ? (a + b) / 2 : kind === 'L' ? a + inset * 1.6 : b - inset * 1.6
      const tTop = hc(sx) - inset * 1.1
      const tBot = Math.max(0.2 * H0, tTop - 0.55 * hc(sx))
      if (tTop - tBot > inset) grooves.push([[sx, tTop], [sx, tBot]])
    })
  }
  return { points: pts, grooves, segments, cuts, width, depth, pitch, shape, groove: N.groove }
}

/** flange({ outline }) — a caller-supplied CCW side outline; grooves follow its crest unless given. */
function customOutline(points, grooves) {
  const pts = points.map(([s, t]) => [s, t])
  if (grooves) return { points: pts, grooves, segments: [] }
  let tMax = 0
  for (const [, t] of pts) tMax = Math.max(tMax, t)
  const inset = Math.min(1.5, tMax * 0.18)
  const out = []
  let cur = []
  for (const [s, t] of offsetPolygon(pts, inset)) {
    if (t > Math.max(inset, 0.3 * tMax)) cur.push([s, t])
    else if (cur.length) { if (cur.length > 1) out.push(cur); cur = [] }
  }
  if (cur.length > 1) out.push(cur)
  return { points: pts, grooves: out, segments: [] }
}

/**
 * End cap points. dir = +1: the end at σ = s0 (=L), listed from the root upward to the crest.
 * dir = -1: the start (σ = 0), listed from the root upward (caller reverses).
 */
function endCap(E, s0, hEnd, H0, dir) {
  const len = E.length ?? H0 * 0.8
  switch (E.type) {
    case 'beak': // legacy hooked top
      return [[s0 + dir * len * 0.15, hEnd * 0.55], [s0 + dir * len, hEnd]]
    case 'hook': { // rises past the end and curls back (gu / fangyi tops)
      const hh = E.height ?? hEnd * 1.15
      return [[s0, hEnd * 0.35], [s0 + dir * len * 0.55, hh * 0.55], [s0 + dir * len, hh * 0.85], [s0 + dir * len * 0.85, hh], [s0 + dir * len * 0.2, hh * 0.98]]
    }
    case 'step': { // overhangs the end of the register at full height
      const t0 = E.under ?? Math.max(0.5, hEnd * 0.12)
      const r = Math.min(len * 0.3, hEnd * 0.15)
      return [[s0, t0], [s0 + dir * (len - r), t0], [s0 + dir * len, t0 + r], [s0 + dir * len, hEnd - r], [s0 + dir * (len - r), hEnd]]
    }
    case 'spur': { // the end curls out into a pointed spur (the gu foot flange): tip `height` out, `length` in from the end
      const hh = E.height ?? hEnd * 2
      const tipU = E.length ?? H0 * 0.7
      const sweep = E.sweep ?? Math.max(tipU * 2.2, (hh - hEnd) * 1.4)
      const at = (u) => s0 - dir * u
      const pts = []
      // underside: from the root, sagging outward to the tip (a hook pointing out and back)
      for (let i = 1; i <= 6; i++) {
        const f = i / 6
        pts.push([at(tipU * Math.pow(f, 1.6)), hh * 0.94 * f])
      }
      pts.push([at(tipU + 0.5), hh])
      // upper edge: a concave sweep back into the crest
      for (let i = 1; i <= 8; i++) {
        const g = i / 8
        pts.push([at(tipU + 0.5 + sweep * g), hEnd + (hh - hEnd) * (1 - g) * (1 - g)])
      }
      return pts
    }
    default:
      return []
  }
}

// ------------------------------------------------------------------ grooves → relief

function bakeGrooves(outline, { w, h, sMin, e, thickness, seed }) {
  const ppmm = Math.min(8, 1000 / w, 500 / h)
  const p = new ReliefPanel({ width: w, height: h, ppmm, seed })
  const k = Math.min(1.3, Math.max(0.7, thickness / 4))
  const g = outline.groove?.width ?? 0.55 * k // notches.groove { width, depth } (mm) overrides the default incision
  p.sink((ctx) => {
    ctx.lineWidth = g
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (const line of outline.grooves) {
      ctx.beginPath()
      line.forEach(([s, t], i) => (i ? ctx.lineTo(s - sMin, t + e) : ctx.moveTo(s - sMin, t + e)))
      ctx.stroke()
    }
  }, { depth: outline.groove?.depth ?? 0.35 * k, profile: 'u' })
  return p.bake()
}

// ------------------------------------------------------------------ paths & frames

function straightPath(from, to, out) {
  const D = new THREE.Vector3().subVectors(to, from)
  const L = D.length()
  D.normalize()
  const O = out.clone().addScaledVector(D, -out.dot(D)).normalize()
  const S = new THREE.Vector3().crossVectors(D, O)
  return {
    isPath: true, planar: true, kind: 'straight', length: L,
    frame: (s) => ({ p: from.clone().addScaledVector(D, s), n: O, d: D, b: S }),
  }
}

/** A straight path for flange({ path }) — exported for fang/parts code. */
export function edgePath(from, to, out) {
  return straightPath(from, to, out)
}

function sampleFrames(path, s0, s1, step) {
  const n = Math.max(2, Math.ceil((s1 - s0) / step))
  const F = []
  for (let i = 0; i <= n; i++) {
    const s = s0 + ((s1 - s0) * i) / n
    const f = path.frame(s)
    F.push({ p: f.p.clone(), n: f.n.clone(), d: f.d.clone(), b: (f.b || new THREE.Vector3().crossVectors(f.d, f.n)).clone() })
  }
  const out = { p: new THREE.Vector3(), n: new THREE.Vector3(), d: new THREE.Vector3(), b: new THREE.Vector3() }
  return (s) => {
    const x = Math.min(n, Math.max(0, ((s - s0) / (s1 - s0)) * n))
    const i = Math.min(n - 1, Math.floor(x))
    const f = x - i
    const A = F[i], B = F[i + 1]
    out.p.lerpVectors(A.p, B.p, f)
    out.n.lerpVectors(A.n, B.n, f).normalize()
    out.d.lerpVectors(A.d, B.d, f).normalize()
    out.b.lerpVectors(A.b, B.b, f).normalize()
    return out
  }
}

// ------------------------------------------------------------------ small 2D helpers

function edgeNormals(pts) {
  // outward normals of a CCW polygon's edges: (dy, -dx)
  const n = pts.length
  const out = []
  for (let k = 0; k < n; k++) {
    const a = pts[k], b = pts[(k + 1) % n]
    out.push(norm2([b[1] - a[1], -(b[0] - a[0])]))
  }
  return out
}

function norm2(v) {
  const l = Math.hypot(v[0], v[1]) || 1
  return [v[0] / l, v[1] / l]
}

/** Inward miter offset of a CCW polygon by d (clamped at sharp corners). */
function offsetPolygon(pts, d) {
  const n = pts.length
  const en = edgeNormals(pts)
  return pts.map((p, k) => {
    const a = en[(k - 1 + n) % n], b = en[k]
    let mx = a[0] + b[0], my = a[1] + b[1]
    const ml = Math.hypot(mx, my)
    if (ml < 1e-6) { mx = b[0]; my = b[1] } else { mx /= ml; my /= ml }
    const c = Math.max(0.35, mx * b[0] + my * b[1])
    const len = d / c
    return [p[0] - mx * len, p[1] - my * len]
  })
}

function smooth01(t) {
  t = Math.min(1, Math.max(0, t))
  return t * t * (3 - 2 * t)
}

function sampleMax(fn, n) {
  let m = 0
  for (let i = 0; i <= n; i++) m = Math.max(m, fn(i / n))
  return m
}

/** smooth seeded value noise in [-1, 1] over [a, b] with the given wavelength */
function noise1D(rng, a, b, lambda) {
  const n = Math.max(2, Math.ceil((b - a) / lambda) + 2)
  const knots = []
  for (let i = 0; i <= n; i++) knots.push(rng.next() * 2 - 1)
  return (s) => {
    const x = Math.min(n - 1e-6, Math.max(0, (s - a) / lambda))
    const i = Math.floor(x)
    const f = x - i
    const w = f * f * (3 - 2 * f)
    return knots[i] * (1 - w) + knots[i + 1] * w
  }
}
