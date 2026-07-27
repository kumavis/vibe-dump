import * as THREE from 'three'
import {
  sweep,
  tube,
  smoothPath,
  rectProfile,
  roundedBox,
  lathe,
  horn,
  noisify,
  xform,
  mergeAll,
  refresh,
} from './geometry.js'
import { makeRng, noise2, smoothstep } from './noise.js'

// ---------------------------------------------------------------------------
// The goblin's arsenal
//
// Three pieces of salvage: a cleaver hacked out of a reactor fin, a rivet-gun
// sidearm, and a buckler cut from a bulkhead vent hatch. Zero assets — it is
// all profiles swept along paths, plus a lot of deliberate asymmetry so the kit
// reads as *repaired* rather than manufactured.
//
// Everything is built in WEAPON LOCAL SPACE:
//   • the grip axis runs along Y, grip centre at the origin
//   • the business end (blade / barrel / boss) extends towards +Y (+Z for the
//     buckler's spike, which is the shield's "forward")
//   • the weapon's front / cutting edge faces +Z
// so the caller parents a part to a hand bone and orients it with one rotation.
//
// WINDING NOTE — read before adding geometry. geometry.js's `sweep` builds its
// frame as T = N x B and winds quads (r0+j, r1+j, r0+j+1); working that through,
// a *counter-clockwise* cross-section comes out inside-out. The body meshes never
// noticed (they render with a two-sided skin material) but the weapons are drawn
// FrontSide, so every cross-section in this file goes through `orientCW`, and
// anything produced by the toolkit's own CCW helpers (`tube`, `horn`) is fixed up
// with `flipWinding`.
// ---------------------------------------------------------------------------

const V = (x, y, z) => new THREE.Vector3(x, y, z)
const V2 = (x, y) => new THREE.Vector2(x, y)

// ---- shared kit -----------------------------------------------------------

/** Piecewise-smooth scalar curve from [t, value] stops — the shape language
 *  body.js writes limb silhouettes in, reused here for blade profiles. */
function curve(stops) {
  return (t) => {
    if (t <= stops[0][0]) return stops[0][1]
    for (let i = 1; i < stops.length; i++) {
      if (t <= stops[i][0]) {
        const [t0, v0] = stops[i - 1]
        const [t1, v1] = stops[i]
        return v0 + (v1 - v0) * smoothstep(t0, t1, t)
      }
    }
    return stops[stops.length - 1][1]
  }
}

/** Force a cross-section clockwise (shoelace area < 0) so `sweep` faces it out. */
function orientCW(pts) {
  let a = 0
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i]
    const q = pts[(i + 1) % pts.length]
    a += p.x * q.y - q.x * p.y
  }
  return a > 0 ? pts.slice().reverse() : pts
}

/** Reverse triangle order — rescues a shell that came out inside-out. */
function flipWinding(geo) {
  const idx = geo.index
  if (idx) {
    const a = idx.array
    for (let i = 0; i < a.length; i += 3) {
      const t = a[i + 1]
      a[i + 1] = a[i + 2]
      a[i + 2] = t
    }
    idx.needsUpdate = true
  }
  geo.computeVertexNormals()
  return geo
}

/**
 * Stitch a stack of equal-length rings of explicit points into a shell.
 *
 * `sweep` covers most cases, but parallel-transport frames are wrong for a
 * helix (the frame precesses with the curve's torsion, so a grip wrap would
 * unwind) and undefined for a path that doubles back on itself (the buckler's
 * front-then-back surface). Both of those hand their rings in here instead.
 *
 * Rings must run clockwise in the local (e1, e2) basis where e1 x e2 points
 * along the direction of travel — same convention as `sweep`.
 */
function stitchRings(rings, { capStart = true, capEnd = true, uvScale = [1, 1] } = {}) {
  const R = rings.length
  const N = rings[0].length
  const pos = []
  const uv = []
  const idx = []
  const put = (p, u, v) => {
    pos.push(p.x, p.y, p.z)
    uv.push(u * uvScale[0], v * uvScale[1])
  }
  // Duplicate the seam column so the U wrap doesn't smear across the join.
  for (let i = 0; i < R; i++) {
    const v = R === 1 ? 0 : i / (R - 1)
    for (let j = 0; j <= N; j++) put(rings[i][j % N], j / N, v)
  }
  for (let i = 0; i < R - 1; i++) {
    const r0 = i * (N + 1)
    const r1 = (i + 1) * (N + 1)
    for (let j = 0; j < N; j++) {
      idx.push(r0 + j, r1 + j, r0 + j + 1)
      idx.push(r0 + j + 1, r1 + j, r1 + j + 1)
    }
  }
  const cap = (ring, flip) => {
    const c = new THREE.Vector3()
    for (const p of ring) c.add(p)
    c.multiplyScalar(1 / ring.length)
    const centre = pos.length / 3
    put(c, 0.5, 0.5)
    const base = pos.length / 3
    for (let j = 0; j <= N; j++) {
      const a = (j / N) * Math.PI * 2
      put(ring[j % N], 0.5 + Math.cos(a) * 0.5, 0.5 + Math.sin(a) * 0.5)
    }
    for (let j = 0; j < N; j++) {
      if (flip) idx.push(centre, base + j + 1, base + j)
      else idx.push(centre, base + j, base + j + 1)
    }
  }
  if (capStart) cap(rings[0], true)
  if (capEnd) cap(rings[R - 1], false)

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

/**
 * Sweep with a caller-supplied "up" per sample instead of parallel transport.
 * Matches `sweep`'s frame exactly (N from up, B = T x N) so clockwise profiles
 * still face outwards.
 */
function railSweep({ path, up, profile, capStart = true, capEnd = true }) {
  const n = path.length
  const rings = []
  const T = new THREE.Vector3()
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0 : i / (n - 1)
    T.subVectors(path[Math.min(n - 1, i + 1)], path[Math.max(0, i - 1)])
    if (T.lengthSq() < 1e-14) T.set(0, 1, 0)
    T.normalize()
    const N = up(t, i).clone()
    N.addScaledVector(T, -N.dot(T))
    if (N.lengthSq() < 1e-12) N.set(1, 0, 0)
    N.normalize()
    const B = new THREE.Vector3().crossVectors(T, N)
    rings.push(
      profile(t, i).map((p) => path[i].clone().addScaledVector(N, p.x).addScaledVector(B, p.y)),
    )
  }
  return stitchRings(rings, { capStart, capEnd })
}

/** A dome-head rivet on a collar — cheap, and it reads round from every angle. */
function rivet(r = 0.0038, h = 0.0022, seg = 6) {
  return lathe(
    [V2(0, -0.0008), V2(r * 1.12, -0.0008), V2(r, h * 0.34), V2(r * 0.64, h * 0.84), V2(0, h)],
    seg,
  )
}

/** A lumpy tube along a seam — the tell-tale of a hand weld. */
function weldBead(path, r = 0.0016, seed = 1) {
  const rng = makeRng(seed)
  const ph = rng() * 20
  const wob = 3 + rng() * 2
  const g = tube(path, (t) => r * (0.7 + 0.55 * (0.5 + 0.5 * Math.sin(t * 34 + ph)) + 0.12 * Math.sin(t * wob)), 6)
  return flipWinding(g)
}

/** A flat strap cross-section (a hexagon, cheaper than a rounded rect). */
function strapProfile(halfThick, halfWide) {
  return orientCW([
    V2(halfThick, -halfWide * 0.62),
    V2(halfThick, halfWide * 0.62),
    V2(halfThick * 0.25, halfWide),
    V2(-halfThick, halfWide * 0.62),
    V2(-halfThick, -halfWide * 0.62),
    V2(-halfThick * 0.25, -halfWide),
  ])
}

/** Collects geometry per material key and merges one buffer per material. */
function bucket() {
  const map = new Map()
  return {
    add(geo, material) {
      if (!geo) return geo
      if (!map.has(material)) map.set(material, [])
      map.get(material).push(geo)
      return geo
    },
    parts(scale) {
      const out = []
      for (const [material, geos] of map) {
        const g = mergeAll(geos)
        if (!g) continue
        if (scale !== 1) g.scale(scale, scale, scale)
        refresh(g)
        out.push({ geometry: g, material })
      }
      return out
    },
  }
}

function anchor(pos, dir) {
  return { pos, dir: dir.clone().normalize() }
}

function scaleGear(gear, s) {
  if (s === 1) return gear
  gear.length *= s
  gear.gripRadius *= s
  for (const a of Object.values(gear.anchors)) a.pos.multiplyScalar(s)
  if (gear.emissivePaths) for (const p of gear.emissivePaths) for (const v of p) v.multiplyScalar(s)
  return gear
}

// ---------------------------------------------------------------------------
// 1. The Slag-Cleaver
//
// A chopping blade cut from a starship reactor fin: heavy towards the tip, a
// hooked back spine, a chewed edge, a fuller down the flat, and the fin's old
// arc-tap channel still live along the spine.
//
// The blade is one sweep up +Y. In that frame profile.x lands on world Z (the
// spine-to-edge axis) and profile.y on world X (the flat), so the whole
// silhouette is authored as two curves of t: where the spine is and where the
// edge is.
// ---------------------------------------------------------------------------

const CLV = {
  baseY: 0.058, // where the blade leaves the guard
  tipY: 0.398, // 0.34 m of blade
  guardY: 0.050,
  gripTop: 0.044,
  gripBot: -0.052,
  gripR: 0.0122,
  strapT: 0.0020,
}

// Spine-to-edge samples. Deliberately not uniform: the primary bevel needs
// resolution near the edge, the fuller near u = 0.36.
const BLADE_U = [0, 0.14, 0.32, 0.52, 0.72, 0.87]

const cleaverEdgeZ = curve([
  [0, 0.019],
  [0.14, 0.027],
  [0.34, 0.039],
  [0.55, 0.054],
  [0.74, 0.066],
  [0.86, 0.071],
  [0.93, 0.062],
  [1, 0.022],
])

// The hook. A hard flare out between 0.60 and 0.68 and a hard cut back after
// 0.86 is what makes this read as a beak; a smooth bulge just reads as a wide
// blade, which is what the first pass did.
const cleaverSpineZ = curve([
  [0, -0.021],
  [0.2, -0.026],
  [0.45, -0.03],
  [0.6, -0.033],
  [0.665, -0.066],
  [0.84, -0.072],
  [0.885, -0.048],
  [0.93, -0.016],
  [1, 0.012],
])

/** Non-periodic bites out of the edge. Spacing, width and depth are all rng. */
function makeChips(rng) {
  const chips = []
  let t = 0.04
  while (t < 0.985) {
    t += 0.022 + rng() * 0.1
    if (t > 0.985) break
    const big = rng() < 0.32
    chips.push({
      c: t,
      w: (big ? 0.012 : 0.004) + rng() * (big ? 0.016 : 0.008),
      d: (big ? 0.005 : 0.0012) + rng() * rng() * (big ? 0.01 : 0.004),
    })
  }
  return chips
}

function chipDepth(chips, t) {
  let d = 0
  for (const c of chips) {
    const x = Math.abs(t - c.c) / c.w
    if (x >= 1) continue
    // Near-vertical walls and a flat floor — a bite, not a dimple. The blade's
    // rings are placed on the 0.85 shoulders so this stays crisp.
    d = Math.max(d, c.d * smoothstep(1, 0.85, x))
  }
  return d
}

function buildCleaverBlade(chips) {
  const { baseY, tipY } = CLV
  const L = tipY - baseY

  // Adaptive ring placement. A uniform stack has to be very dense before a
  // 4 mm chip survives sampling; instead lay a coarse base down and drop extra
  // rings exactly on each chip's shoulders and on the hook's corners, so every
  // silhouette feature gets a near-vertical wall for a handful of triangles.
  const set = new Set([0, 1])
  for (let i = 1; i < 18; i++) set.add(i / 18)
  for (const t of [0.58, 0.615, 0.65, 0.685, 0.83, 0.855, 0.88, 0.91, 0.945, 0.975]) set.add(t)
  for (const c of chips) {
    for (const k of [-1, -0.86, 0.86, 1]) {
      const t = c.c + c.w * k
      if (t > 0.002 && t < 0.998) set.add(t)
    }
  }
  const ts = [...set].sort((a, b) => a - b)

  const path = ts.map((t) => V(0.0016 * t * t, baseY + L * t, 0))

  // The extra collapse past 0.86 is what stops the clipped tip reading as a
  // blob: without it the tip section is nearly square in cross-section.
  const spineThick = (t) => 0.0064 * (1 - 0.34 * t) * (1 - 0.72 * smoothstep(0.86, 1, t))
  const fullerAmt = (t) => 0.0021 * smoothstep(0.01, 0.09, t) * smoothstep(0.78, 0.64, t)
  const grooveDepth = (t) => 0.0042 * smoothstep(0.005, 0.05, t) * smoothstep(0.84, 0.72, t)

  // NB: `sweep` hands the profile a *uniform* t (i / rings-1), but our rings are
  // deliberately non-uniform — so index straight back into `ts`.
  const section = (_u, i) => {
    const t = ts[i]
    const zS = cleaverSpineZ(t)
    const zNom = cleaverEdgeZ(t) // where the edge would be if it were not chewed
    const zE = zNom - chipDepth(chips, t)
    const ts0 = spineThick(t)
    const fl = fullerAmt(t)
    const gd = grooveDepth(t)
    // A chipped stretch of edge is a blunt stretch of edge.
    const eh = 0.00055 + chipDepth(chips, t) * 0.11
    const half = (u) => {
      let h = ts0 * (1 - 0.16 * u * u) * (1 - 0.84 * smoothstep(0.55, 1, u))
      h -= fl * Math.exp(-(((u - 0.36) / 0.15) ** 2))
      return Math.max(h, eh * 1.1)
    }
    // Lay the bevel samples out against the *nominal* edge and merely clip them
    // at the chipped one. Parametrising off the chipped edge instead makes the
    // whole thickness profile slide sideways at every chip, which shows up as
    // ugly terraces running clear across the flat.
    const zAt = (u) => Math.min(zS + (zNom - zS) * u, zE)
    const h0 = half(0)
    const pts = [V2(zS, h0)]
    for (let i = 1; i < BLADE_U.length; i++) pts.push(V2(zAt(BLADE_U[i]), half(BLADE_U[i])))
    pts.push(V2(zE, eh), V2(zE, -eh))
    for (let i = BLADE_U.length - 1; i >= 1; i--) pts.push(V2(zAt(BLADE_U[i]), -half(BLADE_U[i])))
    pts.push(V2(zS, -h0))
    // The arc-tap channel is a real slot: the spine face dives in and comes
    // back out, and the emissive bar below sits recessed inside it.
    pts.push(V2(zS + gd, -h0 * 0.55), V2(zS + gd, h0 * 0.55))
    return orientCW(pts)
  }

  const geo = sweep({ path, profile: section, uvScale: [1, 6] })
  // Rolled-and-hammered surface. Mask by |x| so the primary bevel and the
  // fuller lip keep their crispness — noise on a knife edge just melts it.
  // Only low-frequency warp here. The rings are deliberately uneven (dense at
  // the chips, sparse between) so anything with a wavelength near the ring
  // spacing gets resolved in the dense bands and aliased flat in the sparse
  // ones — which shows up as stripes running across the blade.
  noisify(geo, {
    amp: 0.00055,
    freq: 9,
    seed: 23,
    mask: (v) => smoothstep(0.0012, 0.0038, Math.abs(v.x)),
  })
  return { geo, path, grooveDepth, spineThick }
}

export function buildCleaver(opts = {}) {
  const { seed = 4172, scale = 1 } = opts
  const rng = makeRng(seed)
  const B = bucket()
  const { baseY, tipY, guardY, gripTop, gripBot, gripR, strapT } = CLV
  const L = tipY - baseY
  const chips = makeChips(rng)

  // ---- blade ----
  const blade = buildCleaverBlade(chips)
  B.add(blade.geo, 'metal')

  // ---- arc-tap channel: an emissive bar sunk into the spine slot ----
  const chanT0 = 0.03
  const chanT1 = 0.78
  const chanRings = 30
  const chanPath = []
  for (let i = 0; i < chanRings; i++) {
    const t = chanT0 + (chanT1 - chanT0) * (i / (chanRings - 1))
    // Sits on the slot floor and stops 1 mm short of the spine rim, so it is
    // genuinely inset — you can see the lip of metal overhanging it side-on.
    chanPath.push(V(0.0016 * t * t, baseY + L * t, cleaverSpineZ(t) + 0.0026))
  }
  const channel = sweep({
    path: chanPath,
    profile: (t) => {
      const tt = chanT0 + (chanT1 - chanT0) * t
      const hw = blade.spineThick(tt) * 0.5
      return orientCW(rectProfile(0.0032, hw * 2, 0.7, 8))
    },
  })
  B.add(channel, 'emissive')
  // Three tap studs bridging the channel, like the fin's old bus bars.
  for (let i = 0; i < 3; i++) {
    const t = 0.18 + i * 0.24 + rng() * 0.04
    const y = baseY + L * t
    const z = cleaverSpineZ(t) + 0.0026
    const stud = xform(new THREE.CylinderGeometry(0.0026, 0.0032, 0.013, 6), {
      pos: V(0, y, z),
      rot: [0, 0, Math.PI / 2],
    })
    B.add(stud, 'brass')
  }

  // ---- welded-on patch plate over a crack in the flat ----
  const px = 0.0056
  const patch = roundedBox(0.0028, 0.05, 0.032, 0.0012, 2)
  xform(patch, { pos: V(px, baseY + L * 0.17, 0.001), rot: [0.06, 0.05, 0.11] })
  B.add(patch, 'metal')
  const patchSeam = []
  for (let i = 0; i <= 14; i++) {
    const a = (i / 14) * Math.PI * 2
    // Rounded-rectangle perimeter, in the YZ plane on the +X flat.
    const c = Math.cos(a)
    const s = Math.sin(a)
    patchSeam.push(
      V(
        px - 0.0006,
        baseY + L * 0.17 + Math.sign(s) * Math.abs(s) ** 0.6 * 0.026,
        0.001 + Math.sign(c) * Math.abs(c) ** 0.6 * 0.017,
      ),
    )
  }
  B.add(weldBead(patchSeam, 0.0016, 31), 'metalDark')
  // The crack the patch is hiding, escaping past one corner.
  const crack = roundedBox(0.0012, 0.03, 0.0016, 0.0004, 1)
  xform(crack, { pos: V(0.0052, baseY + L * 0.29, 0.012), rot: [0, 0, 0.5] })
  B.add(crack, 'metalDark')

  // ---- rivets: mismatched, both faces, none quite in line ----
  const rivetSpots = [
    [0.09, 0.004, 0.0042],
    [0.145, -0.008, 0.0032],
    [0.2, 0.011, 0.0046],
    [0.26, -0.002, 0.0034],
    [0.115, 0.019, 0.0029],
  ]
  for (const [t, dz, r] of rivetSpots) {
    const y = baseY + L * t
    const z = (cleaverSpineZ(t) + cleaverEdgeZ(t)) * 0.35 + dz
    for (const s of [1, -1]) {
      // Skip the odd one so the two faces don't match — nobody riveted this
      // thing twice from both sides.
      if (s < 0 && rng() < 0.3) continue
      const g = rivet(r * (0.9 + rng() * 0.3), 0.0022, 6)
      xform(g, { pos: V(s * 0.0058, y, z), rot: [0, 0, s > 0 ? -Math.PI / 2 : Math.PI / 2] })
      B.add(g, rng() < 0.4 ? 'brass' : 'metalDark')
    }
  }
  // Four on the patch plate itself.
  for (let i = 0; i < 4; i++) {
    const y = baseY + L * 0.17 + (i < 2 ? 0.019 : -0.019)
    const z = 0.001 + (i % 2 ? 0.011 : -0.011)
    const g = rivet(0.0034 + rng() * 0.0008, 0.0024, 6)
    xform(g, { pos: V(px + 0.0016, y, z), rot: [0, 0, -Math.PI / 2] })
    B.add(g, 'brass')
  }

  // ---- cross-guard: a structural bracket, bent, bolted, not symmetric ----
  const guardPath = smoothPath(
    [
      V(0.005, guardY - 0.007, -0.05),
      V(0.0015, guardY + 0.002, -0.024),
      V(0, guardY + 0.006, 0),
      V(-0.0025, guardY + 0.002, 0.03),
      V(-0.009, guardY - 0.011, 0.061),
    ],
    16,
  )
  const guard = sweep({
    path: guardPath,
    // Along a mostly-+Z path with an up hint the frame puts profile.x on Y
    // (bracket height) and profile.y on -X (bracket thickness).
    upHint: V(0, 1, 0),
    profile: (t) => {
      const h = 0.013 + 0.005 * Math.exp(-(((t - 0.5) / 0.16) ** 2))
      const w = 0.019 + 0.004 * Math.exp(-(((t - 0.5) / 0.2) ** 2))
      return orientCW(rectProfile(h, w, 0.72, 12))
    },
  })
  noisify(guard, { amp: 0.0004, freq: 60, seed: 44 })
  B.add(guard, 'metal')
  // A stiffening web along the top of the bracket and a bolt through each ear.
  const web = sweep({
    path: guardPath.slice(3, 13),
    upHint: V(0, 1, 0),
    profile: () => orientCW(rectProfile(0.02, 0.007, 0.7, 8)),
  })
  B.add(web, 'metalDark')
  for (const e of [guardPath[1], guardPath[14]]) {
    const bolt = xform(new THREE.CylinderGeometry(0.0044, 0.0048, 0.026, 6), {
      pos: e.clone(),
      rot: [0, 0, Math.PI / 2],
    })
    B.add(bolt, 'brass')
  }
  B.add(
    weldBead(
      [V(0.004, guardY + 0.008, -0.018), V(0, guardY + 0.01, 0), V(-0.004, guardY + 0.008, 0.02)],
      0.0018,
      52,
    ),
    'metalDark',
  )

  // ---- grip: metal core, then an actual helical leather binding ----
  const core = sweep({
    path: [V(0, gripBot - 0.004, 0), V(0, 0, 0), V(0, gripTop + 0.008, 0)],
    profile: (t) => orientCW(rectProfile(0.023, 0.0205, 0.55, 12).map((p) => p.multiplyScalar(1 - 0.1 * Math.abs(t - 0.5)))),
  })
  B.add(core, 'metalDark')

  const turns = 8
  const perTurn = 7
  const wrapRings = turns * perTurn + 1
  const wrapPath = []
  const wrapUp = []
  for (let i = 0; i < wrapRings; i++) {
    const t = i / (wrapRings - 1)
    const th = t * turns * Math.PI * 2
    const y = gripBot + 0.004 + (gripTop - gripBot - 0.008) * t
    // Radial direction is what the strap's thickness must follow; parallel
    // transport would let the frame precess and the wrap would spiral off.
    const rad = V(Math.cos(th), 0, Math.sin(th))
    const r = gripR + 0.0009 * Math.sin(t * Math.PI)
    wrapPath.push(V(rad.x * r, y, rad.z * r))
    wrapUp.push(rad)
  }
  const wrap = railSweep({
    path: wrapPath,
    up: (t, i) => wrapUp[i],
    profile: (t) => strapProfile(strapT, 0.0053 * (1 - 0.25 * smoothstep(0.9, 1, t))),
  })
  noisify(wrap, { amp: 0.0004, freq: 90, seed: 61 })
  B.add(wrap, 'leather')

  // Whipping at both ends of the wrap, then a loose tail tucked under it.
  for (const [y0, dir] of [
    [gripBot + 0.001, 1],
    [gripTop + 0.002, -1],
  ]) {
    const whipRings = 14
    const wp = []
    const wu = []
    for (let i = 0; i < whipRings; i++) {
      const t = i / (whipRings - 1)
      const th = t * 3 * Math.PI * 2
      const rad = V(Math.cos(th), 0, Math.sin(th))
      const r = gripR + strapT * 0.7
      wp.push(V(rad.x * r, y0 + dir * t * 0.008, rad.z * r))
      wu.push(rad)
    }
    B.add(
      railSweep({ path: wp, up: (t, i) => wu[i], profile: () => strapProfile(0.0011, 0.0013) }),
      'cloth',
    )
  }
  const tail = sweep({
    path: smoothPath(
      [V(gripR * 0.6, gripTop + 0.004, gripR * 0.6), V(0.016, gripTop + 0.012, 0.012), V(0.021, gripTop + 0.006, 0.02)],
      8,
    ),
    profile: (t) => strapProfile(0.0012, 0.0052 * (1 - 0.5 * t)),
  })
  B.add(tail, 'leather')

  // ---- pommel: a chunky bolt counterweight on the tang ----
  const washer = lathe(
    [V2(0, 0), V2(0.0185, 0), V2(0.019, 0.0022), V2(0.0175, 0.005), V2(0, 0.005)],
    10,
  )
  xform(washer, { pos: V(0, gripBot - 0.006, 0) })
  B.add(washer, 'metal')
  const nut = xform(new THREE.CylinderGeometry(0.0155, 0.017, 0.019, 6), {
    pos: V(0, gripBot - 0.0155, 0),
    rot: [0, 0.3, 0.04],
  })
  B.add(nut, 'metalDark')
  const stub = xform(new THREE.CylinderGeometry(0.0062, 0.007, 0.009, 8), {
    pos: V(0, gripBot - 0.029, 0),
  })
  B.add(stub, 'metal')
  const ring = xform(new THREE.TorusGeometry(0.0072, 0.0021, 5, 12), {
    pos: V(0, gripBot - 0.038, 0),
    rot: [0, Math.PI / 2, 0],
  })
  B.add(ring, 'brass')
  // A rag knotted through the lanyard ring.
  B.add(
    sweep({
      path: smoothPath(
        [
          V(0, gripBot - 0.043, 0.002),
          V(0.006, gripBot - 0.056, -0.006),
          V(0.003, gripBot - 0.07, 0.004),
          V(-0.005, gripBot - 0.079, -0.002),
        ],
        10,
      ),
      profile: (t) => strapProfile(0.0009, 0.006 * (1 - 0.55 * t)),
    }),
    'cloth',
  )

  const pommelY = gripBot - 0.042
  const gear = {
    parts: B.parts(scale),
    length: tipY,
    gripRadius: gripR + strapT,
    anchors: {
      pommel: anchor(V(0, gripBot - 0.024, 0), V(0, -1, 0)),
      lanyard: anchor(V(0, pommelY, 0), V(0, -1, 0)),
      tip: anchor(V(0.0016, tipY, 0.02), V(0, 1, 0)),
      guard: anchor(V(0, guardY + 0.006, 0), V(0, 0, 1)),
    },
    emissivePaths: [chanPath.map((p) => p.clone().setZ(p.z - 0.0016))],
  }
  return scaleGear(gear, scale)
}

// ---------------------------------------------------------------------------
// 2. The Sputterhawk
//
// A stubby rivet gun. Slab receiver up +Y, grip raked back into -Z, drum on the
// left, and a stovepipe brake whose "vents" are genuine gaps between three
// collars carried on four spines — cheaper and far more convincing than
// pretending to cut slots.
// ---------------------------------------------------------------------------

const PSTL = {
  gripBot: -0.062,
  gripTop: 0.01,
  recvBot: 0.004,
  recvTop: 0.112,
  brakeTop: 0.156,
  recvZ: 0.006,
  coilZ: 0.043,
}

export function buildPistol(opts = {}) {
  const { seed = 9091, scale = 1 } = opts
  const rng = makeRng(seed)
  const B = bucket()
  const { gripBot, gripTop, recvBot, recvTop, brakeTop, recvZ, coilZ } = PSTL

  // ---- grip: slab sided, raked back, flared at the butt ----
  const gripPath = smoothPath(
    [V(0, gripBot, -0.024), V(0, -0.04, -0.016), V(0, -0.016, -0.006), V(0, gripTop, 0.002)],
    10,
  )
  const grip = railSweep({
    path: gripPath,
    up: () => V(0, 0, 1), // profile.x -> Z (grip depth), profile.y -> X (cheeks)
    profile: (t) => {
      const d = 0.0155 + 0.0035 * Math.sin(t * Math.PI) - 0.003 * smoothstep(0.78, 1, t)
      const w = 0.0108 + 0.003 * smoothstep(0.22, 0, t)
      return orientCW(rectProfile(d * 2, w * 2, 0.66, 14))
    },
  })
  noisify(grip, { amp: 0.0004, freq: 70, seed: 12 })
  B.add(grip, 'metalDark')

  // ---- charge cell: a cartridge slotted straight through the grip ----
  const cellY = -0.03
  const cell = roundedBox(0.03, 0.019, 0.021, 0.0022, 2)
  xform(cell, { pos: V(0, cellY, -0.01), rot: [0.06, 0, 0.03] })
  B.add(cell, 'emissive')
  const window = roundedBox(0.0306, 0.0105, 0.0115, 0.0015, 1)
  xform(window, { pos: V(0, cellY, -0.01) })
  B.add(window, 'glass')
  // The retaining frame around the cell mouth, both cheeks.
  for (const s of [1, -1]) {
    for (const [dy, dz, h, d] of [
      [0.011, 0, 0.004, 0.023],
      [-0.011, 0, 0.004, 0.023],
      [0, 0.012, 0.026, 0.004],
      [0, -0.012, 0.026, 0.004],
    ]) {
      const f = roundedBox(0.005, h, d, 0.0012, 1)
      xform(f, { pos: V(s * 0.0135, cellY + dy, -0.01 + dz) })
      B.add(f, 'metal')
    }
  }

  // ---- receiver: two slabs, dented, with a hand-fitted patch ----
  const recv = roundedBox(0.03, recvTop - recvBot, 0.046, 0.005, 3)
  xform(recv, { pos: V(0, (recvBot + recvTop) / 2, recvZ) })
  noisify(recv, { amp: 0.0009, freq: 26, seed: 5 })
  B.add(recv, 'metal')
  const rail = roundedBox(0.018, 0.09, 0.011, 0.0022, 2)
  xform(rail, { pos: V(0, 0.058, 0.032) })
  B.add(rail, 'metalDark')
  const patch = roundedBox(0.0026, 0.03, 0.024, 0.001, 2)
  xform(patch, { pos: V(0.0163, 0.078, 0.004), rot: [0.09, 0, 0.05] })
  B.add(patch, 'metal')
  const seam = []
  for (let i = 0; i <= 12; i++) {
    const a = (i / 12) * Math.PI * 2
    seam.push(
      V(
        0.0152,
        0.078 + Math.sign(Math.sin(a)) * Math.abs(Math.sin(a)) ** 0.6 * 0.0155,
        0.004 + Math.sign(Math.cos(a)) * Math.abs(Math.cos(a)) ** 0.6 * 0.0125,
      ),
    )
  }
  B.add(weldBead(seam, 0.0013, 17), 'metalDark')
  for (let i = 0; i < 4; i++) {
    const g = rivet(0.0029 + rng() * 0.0009, 0.002, 6)
    xform(g, {
      pos: V(0.0176, 0.078 + (i < 2 ? 0.011 : -0.011), 0.004 + (i % 2 ? 0.008 : -0.008)),
      rot: [0, 0, -Math.PI / 2],
    })
    B.add(g, 'brass')
  }
  for (let i = 0; i < 5; i++) {
    const g = rivet(0.0026 + rng() * 0.001, 0.0018, 6)
    const s = rng() < 0.5 ? 1 : -1
    xform(g, {
      pos: V(s * 0.0154, 0.02 + rng() * 0.085, recvZ + (rng() - 0.5) * 0.03),
      rot: [0, 0, s > 0 ? -Math.PI / 2 : Math.PI / 2],
    })
    B.add(g, rng() < 0.5 ? 'brass' : 'metalDark')
  }

  // ---- power feed from the cell in the grip up to the coil ----
  // Also the excuse for putting something on the back of the receiver, which
  // otherwise reads as a blank slab from three-quarter behind.
  B.add(
    weldBead(
      smoothPath(
        [
          V(0.006, cellY + 0.012, -0.026),
          V(0.009, -0.008, -0.021),
          V(0.008, 0.02, -0.019),
          V(0.004, 0.06, -0.018),
          V(0.001, 0.094, -0.012),
        ],
        14,
      ),
      0.0022,
      64,
    ),
    'brass',
  )
  for (const y of [0.01, 0.056, 0.092]) {
    const clamp = roundedBox(0.009, 0.005, 0.006, 0.0011, 1)
    xform(clamp, { pos: V(0.006, y, -0.018) })
    B.add(clamp, 'metalDark')
  }
  // Ejection port, sunk into the right cheek.
  const port = roundedBox(0.004, 0.02, 0.014, 0.0008, 1)
  xform(port, { pos: V(0.0146, 0.045, 0.008), rot: [0, 0, 0.04] })
  B.add(port, 'metalDark')

  // ---- exposed recoil coil along the top ----
  const rod = xform(new THREE.CylinderGeometry(0.003, 0.003, 0.098, 7), { pos: V(0, 0.06, coilZ) })
  B.add(rod, 'metalDark')
  for (const y of [0.012, 0.108]) {
    B.add(xform(new THREE.CylinderGeometry(0.0062, 0.0062, 0.006, 8), { pos: V(0, y, coilZ) }), 'metal')
  }
  const cTurns = 8
  const cPer = 7
  const cRings = cTurns * cPer + 1
  const cPath = []
  const cUp = []
  for (let i = 0; i < cRings; i++) {
    const t = i / (cRings - 1)
    const th = t * cTurns * Math.PI * 2
    const rad = V(Math.cos(th), 0, Math.sin(th))
    const r = 0.008
    cPath.push(V(rad.x * r, 0.02 + 0.08 * t, coilZ + rad.z * r))
    cUp.push(rad)
  }
  const coil = railSweep({
    path: cPath,
    up: (t, i) => cUp[i],
    profile: () => orientCW(rectProfile(0.0044, 0.0042, 0.3, 6)),
  })
  B.add(coil, 'metal')

  // ---- stovepipe muzzle brake: real gaps between collars ----
  const barrel = lathe(
    [V2(0.0072, 0), V2(0.0098, 0), V2(0.0098, 0.05), V2(0.0072, 0.05), V2(0.0072, 0)],
    14,
  )
  xform(barrel, { pos: V(0, recvTop - 0.006, recvZ) })
  B.add(barrel, 'metalDark')
  for (let i = 0; i < 3; i++) {
    const y0 = recvTop + i * 0.0155
    const ro = 0.0168 - i * 0.0011
    const collar = lathe(
      [V2(0.0102, 0), V2(ro, 0.0009), V2(ro, 0.0074), V2(0.0102, 0.0083), V2(0.0102, 0)],
      14,
    )
    xform(collar, { pos: V(0, y0, recvZ), rot: [0, rng() * 0.4, 0] })
    B.add(collar, 'metal')
  }
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + (i * Math.PI) / 2
    const spine = roundedBox(0.0062, brakeTop - recvTop, 0.0062, 0.0015, 1)
    xform(spine, {
      pos: V(Math.cos(a) * 0.0135, (recvTop + brakeTop) / 2, recvZ + Math.sin(a) * 0.0135),
      rot: [0, -a, 0],
    })
    B.add(spine, 'metalDark')
  }
  // One vent bar bent out of true, because of course it is.
  const bent = roundedBox(0.005, 0.02, 0.005, 0.0012, 1)
  xform(bent, { pos: V(0.0165, recvTop + 0.026, recvZ + 0.006), rot: [0, 0, -0.35] })
  B.add(bent, 'metal')

  // ---- drum magazine, worn on the left, slugs showing ----
  const drumX = -0.014
  const drumC = V(drumX, 0.045, 0.004)
  const drum = lathe(
    [V2(0, 0), V2(0.0245, 0.0016), V2(0.0262, 0.005), V2(0.0262, 0.0125), V2(0.0244, 0.0162), V2(0, 0.0175)],
    16,
  )
  xform(drum, { pos: drumC, rot: [0, 0, Math.PI / 2] })
  noisify(drum, { amp: 0.0006, freq: 40, seed: 71 })
  B.add(drum, 'metal')
  const drumFace = drumX - 0.0175
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + 0.2
    const p = V(drumFace - 0.003, drumC.y + Math.sin(a) * 0.0182, drumC.z + Math.cos(a) * 0.0182)
    const slug = xform(new THREE.CylinderGeometry(0.0036, 0.0038, 0.011, 6), {
      pos: p,
      rot: [0, 0, Math.PI / 2],
    })
    B.add(slug, 'brass')
  }
  const hub = lathe([V2(0, 0), V2(0.008, 0), V2(0.0072, 0.005), V2(0, 0.0068)], 8)
  xform(hub, { pos: V(drumFace - 0.001, drumC.y, drumC.z), rot: [0, 0, Math.PI / 2] })
  B.add(hub, 'metalDark')
  // Wind-up key.
  B.add(
    weldBead(
      smoothPath(
        [
          V(drumFace - 0.007, drumC.y, drumC.z),
          V(drumFace - 0.012, drumC.y + 0.008, drumC.z),
          V(drumFace - 0.01, drumC.y + 0.015, drumC.z + 0.004),
        ],
        8,
      ),
      0.0022,
      88,
    ),
    'metalDark',
  )
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2
    const g = rivet(0.003, 0.0018, 6)
    xform(g, {
      pos: V(drumFace + 0.0005, drumC.y + Math.sin(a) * 0.011, drumC.z + Math.cos(a) * 0.011),
      rot: [0, 0, Math.PI / 2],
    })
    B.add(g, 'metalDark')
  }

  // ---- bent wire trigger + guard ----
  B.add(
    weldBead(
      smoothPath(
        [V(0, 0.014, 0.008), V(0, 0.003, 0.015), V(0, -0.006, 0.013), V(0, -0.011, 0.004)],
        10,
      ),
      0.0024,
      3,
    ),
    'metal',
  )
  B.add(
    weldBead(
      smoothPath(
        [
          V(0, 0.008, 0.026),
          V(0, -0.008, 0.03),
          V(0, -0.021, 0.021),
          V(0, -0.025, 0.005),
          V(0, -0.021, -0.008),
        ],
        14,
      ),
      0.0026,
      9,
    ),
    'metalDark',
  )

  // ---- iron sights ----
  const front = roundedBox(0.0032, 0.013, 0.015, 0.0009, 1)
  xform(front, { pos: V(0, 0.104, 0.0415), rot: [0.1, 0, 0] })
  B.add(front, 'metalDark')
  // Rear sight: a base bar with two ears, so the notch between them reads.
  const rearBase = roundedBox(0.02, 0.0055, 0.009, 0.0012, 1)
  xform(rearBase, { pos: V(0, 0.019, 0.0375), rot: [0, 0, 0.03] })
  B.add(rearBase, 'metalDark')
  for (const s of [1, -1]) {
    const ear = roundedBox(0.0055, 0.008, 0.0085, 0.0011, 1)
    xform(ear, { pos: V(s * 0.0068, 0.0225, 0.0405), rot: [0, 0, s * 0.05] })
    B.add(ear, 'metalDark')
  }
  // Charging handle sticking out of the right cheek.
  const handle = xform(new THREE.CylinderGeometry(0.0032, 0.0038, 0.016, 6), {
    pos: V(0.021, 0.09, 0.016),
    rot: [0, 0, Math.PI / 2 - 0.12],
  })
  B.add(handle, 'metalDark')
  B.add(
    xform(new THREE.CylinderGeometry(0.006, 0.005, 0.005, 6), {
      pos: V(0.029, 0.0885, 0.016),
      rot: [0, 0, Math.PI / 2 - 0.12],
    }),
    'brass',
  )

  // ---- lanyard loop off the butt ----
  const loop = xform(new THREE.TorusGeometry(0.0055, 0.0016, 5, 10), {
    pos: V(0, gripBot - 0.001, -0.02),
    rot: [0, Math.PI / 2, 0.5],
  })
  B.add(loop, 'brass')
  B.add(
    sweep({
      path: smoothPath(
        [V(0, gripBot - 0.005, -0.021), V(0.005, gripBot - 0.017, -0.026), V(-0.002, gripBot - 0.028, -0.018)],
        8,
      ),
      profile: (t) => strapProfile(0.0008, 0.0045 * (1 - 0.5 * t)),
    }),
    'cloth',
  )

  const gear = {
    parts: B.parts(scale),
    length: brakeTop,
    gripRadius: 0.0135,
    anchors: {
      muzzle: anchor(V(0, brakeTop, recvZ), V(0, 1, 0)),
      lanyard: anchor(V(0, gripBot - 0.006, -0.021), V(0, -1, -0.35)),
      cell: anchor(V(0, cellY, -0.024), V(0, 0, -1)),
    },
    emissivePaths: [[V(-0.014, cellY, -0.01), V(0.014, cellY, -0.01)]],
  }
  return scaleGear(gear, scale)
}

// ---------------------------------------------------------------------------
// 3. The vent-plate buckler
//
// Cut out of a bulkhead hatch, so it keeps the hatch's stamped louvres and
// concentric stiffening rib. The dish is one shell: rings march from the front
// centre out to the rim, round the rim, and back in along the underside. That
// path doubles back on itself, which is exactly the case parallel-transport
// frames cannot handle — hence the explicit rings.
// ---------------------------------------------------------------------------

const BUCK = {
  R: 0.079,
  // Ring radii, clustered where the shape actually does something: the boss,
  // the concentric rib at 0.63 and the flange fold at 0.8-0.91.
  U_FRONT: [0.04, 0.13, 0.26, 0.47, 0.555, 0.6, 0.63, 0.66, 0.705, 0.79, 0.87, 0.94, 1],
  AZ: 28,
}

/**
 * Battered rim. Keep the wobble tiny — a plate cut off a hatch is *flat and
 * round*, and anything more than a percent or two of low-frequency waviness
 * stops reading as metal — and put the character into three narrow, hard dents
 * where something actually hit it.
 */
function makeRim(rng) {
  const dents = []
  for (let i = 0; i < 3; i++) {
    dents.push({ a: rng() * Math.PI * 2, w: 0.1 + rng() * 0.16, d: 0.003 + rng() * 0.005 })
  }
  return (a) => {
    let r = BUCK.R * (1 + (noise2(Math.cos(a) * 2.3 + 11, Math.sin(a) * 2.3 - 5) - 0.5) * 0.026)
    for (const d of dents) {
      const dd = Math.abs(((a - d.a + Math.PI * 3) % (Math.PI * 2)) - Math.PI)
      if (dd < d.w) r -= d.d * smoothstep(d.w, 0, dd)
    }
    return r
  }
}

// A smoothstep dish rather than a parabola: it flattens into a genuine flange
// past u = 0.86, which is what makes the outer band read as cut plate instead
// of a cushion.
const buckZFront = (u) =>
  0.0102 * (1 - smoothstep(0.06, 0.84, u)) - // the dish
  0.0016 * smoothstep(0.8, 0.91, u) + // a fold where the plate was flanged
  0.0125 * smoothstep(0.26, 0, u) + // the boss
  0.0052 * Math.exp(-(((u - 0.63) / 0.038) ** 2)) // the concentric rib

const buckThick = (u) => 0.003 + 0.0034 * smoothstep(0.26, 0, u)

export function buildBuckler(opts = {}) {
  const { seed = 2255, scale = 1 } = opts
  const rng = makeRng(seed)
  const B = bucket()
  const { U_FRONT, AZ } = BUCK
  const rimR = makeRim(rng)

  // ---- the dished plate ----
  // Travel runs front-centre -> rim -> back-centre, i.e. mostly -Z. Taking
  // e1 = Y and e2 = X gives e1 x e2 = -Z, and points laid out with the azimuth
  // increasing are clockwise in that basis — which is what faces them outwards.
  const ringAt = (u, z) => {
    const pts = []
    for (let j = 0; j < AZ; j++) {
      const a = (j / AZ) * Math.PI * 2
      const r = rimR(a) * u
      pts.push(V(Math.cos(a) * r, Math.sin(a) * r, z(a, u)))
    }
    return pts
  }
  const rings = []
  for (const u of U_FRONT) rings.push(ringAt(u, () => buckZFront(u)))
  // A tight rolled lip: one ring just past the rim, halfway through the plate.
  rings.push(ringAt(1.006, () => buckZFront(1) - buckThick(1) * 0.5))
  for (let i = U_FRONT.length - 1; i >= 0; i--) {
    const u = U_FRONT[i]
    rings.push(ringAt(u, () => buckZFront(u) - buckThick(u)))
  }
  const dish = stitchRings(rings, { uvScale: [1, 2] })
  noisify(dish, { amp: 0.00035, freq: 52, seed: 19 })
  B.add(dish, 'metal')

  // ---- radial louvre slots ----
  // A stamped louvre is a dark slot with a lip of plate peeled up over its
  // outer half. Modelling only the peeled lip (the first attempt) just reads as
  // a fan blade floating over the shield, so the dark slot floor sits flush on
  // the surface and the lip springs out of it.
  const nLouvre = 8
  for (let i = 0; i < nLouvre; i++) {
    const a = (i / nLouvre) * Math.PI * 2 + 0.35 + (rng() - 0.5) * 0.07
    const Rd = V(Math.cos(a), Math.sin(a), 0)
    const Tn = V(-Rd.y, Rd.x, 0)
    const rr = rimR(a)
    const plate = (u0, u1, halfW, halfT, z0, z1, taper) => {
      const rs = []
      for (let k = 0; k <= 5; k++) {
        const s = k / 5
        const u = u0 + (u1 - u0) * s
        const c = Rd.clone()
          .multiplyScalar(rr * u)
          .setZ(buckZFront(u) + z0 + (z1 - z0) * s * s)
        const w = halfW * (1 - taper * (1 - s))
        // profile.x on the tangential axis, profile.y on Z: Tn x Z = Rd, the
        // direction of travel, so this ordering is the clockwise one.
        rs.push([
          c.clone().addScaledVector(Tn, w).setZ(c.z + halfT),
          c.clone().addScaledVector(Tn, w).setZ(c.z - halfT),
          c.clone().addScaledVector(Tn, -w).setZ(c.z - halfT),
          c.clone().addScaledVector(Tn, -w).setZ(c.z + halfT),
        ])
      }
      return stitchRings(rs)
    }
    // The slot mouth: a dark bar lying on the plate (0.7 mm proud — enough to
    // beat depth precision at this scale, small enough to look flush).
    B.add(plate(0.34, 0.6, 0.0072, 0.0006, 0.0007, 0.0007, 0), 'metalDark')
    // The lip: metal peeled out of the slot's outer half and bent up 2.6 mm. It
    // starts flush and overhangs the slot's far end, so the inner third of the
    // slot stays visible as a dark line under it. Lifting it further (the first
    // attempt used 7 mm) just makes a pinwheel of floating blades.
    B.add(plate(0.45, 0.64, 0.0085, 0.0009, 0.0005, 0.0026, 0), 'metal')
  }

  // ---- three big mismatched rivets, out on the flange ----
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.9 + (rng() - 0.5) * 0.2
    const u = 0.9 + (rng() - 0.5) * 0.04
    const r = rimR(a) * u
    const g = rivet(0.0062 + rng() * 0.0018, 0.0042, 7)
    // Lathe grows along +Y; rotate it onto +Z so the head stands off the face.
    xform(g, { pos: V(Math.cos(a) * r, Math.sin(a) * r, buckZFront(u)), rot: [Math.PI / 2, 0, 0] })
    B.add(g, i === 1 ? 'brass' : 'metalDark')
  }

  // ---- bone spike welded to the boss ----
  const bossZ = buckZFront(0)
  const spike = flipWinding(
    horn({ length: 0.058, radius: 0.0115, curl: 0.3, curlAxis: V(1, 0.2, 0), taper: 1.5, rings: 10, radialSegments: 7 }),
  )
  xform(spike, { pos: V(0.002, 0.003, bossZ - 0.002), rot: [Math.PI / 2 - 0.1, 0.15, 0] })
  B.add(spike, 'bone')
  const collar = lathe([V2(0, 0), V2(0.0145, 0), V2(0.0125, 0.006), V2(0.0102, 0.009), V2(0, 0.009)], 10)
  xform(collar, { pos: V(0.002, 0.003, bossZ - 0.004), rot: [-Math.PI / 2, 0, 0] })
  B.add(collar, 'metalDark')
  const weldRing = []
  for (let i = 0; i <= 12; i++) {
    const a = (i / 12) * Math.PI * 2
    weldRing.push(V(0.002 + Math.cos(a) * 0.0142, 0.003 + Math.sin(a) * 0.0142, bossZ + 0.0015))
  }
  B.add(weldBead(weldRing, 0.0016, 41), 'metal')

  // ---- a patch riveted over a split in the flange ----
  {
    const a = 2.35
    const r = rimR(a) * 0.86
    const c = V(Math.cos(a) * r, Math.sin(a) * r, buckZFront(0.86) + 0.0018)
    const patch = roundedBox(0.026, 0.019, 0.0026, 0.0009, 2)
    xform(patch, { pos: c, rot: [0.05, 0.04, a - Math.PI / 2] })
    B.add(patch, 'metal')
    for (let i = 0; i < 3; i++) {
      const g = rivet(0.0028 + rng() * 0.0008, 0.0018, 6)
      const t = (i / 2 - 0.5) * 0.019
      xform(g, {
        pos: c
          .clone()
          .add(V(Math.cos(a - Math.PI / 2) * t, Math.sin(a - Math.PI / 2) * t, 0.0018)),
        rot: [Math.PI / 2, 0, 0],
      })
      B.add(g, 'brass')
    }
  }

  // ---- strap bracket on the back ----
  const backZ = (u) => buckZFront(u) - buckThick(u)
  const bracketU = 0.62
  for (const s of [1, -1]) {
    const y = rimR(s > 0 ? Math.PI / 2 : -Math.PI / 2) * bracketU * s
    const br = roundedBox(0.026, 0.012, 0.009, 0.0016, 2)
    xform(br, { pos: V(0, y, backZ(bracketU) - 0.004), rot: [0, 0, 0] })
    B.add(br, 'metal')
    for (const dx of [-0.008, 0.008]) {
      const g = rivet(0.0034, 0.0022, 6)
      xform(g, { pos: V(dx, y, backZ(bracketU) - 0.0092), rot: [-Math.PI / 2, 0, 0] })
      B.add(g, 'brass')
    }
  }
  const yTop = rimR(Math.PI / 2) * bracketU
  const yBot = -rimR(-Math.PI / 2) * bracketU
  const strap = sweep({
    path: smoothPath(
      [
        V(0.004, yTop, backZ(bracketU) - 0.008),
        V(0.006, yTop * 0.45, backZ(0.3) - 0.017),
        V(0, 0, backZ(0.05) - 0.021),
        V(-0.006, yBot * 0.45, backZ(0.3) - 0.017),
        V(-0.004, yBot, backZ(bracketU) - 0.008),
      ],
      16,
    ),
    upHint: V(0, 0, 1),
    profile: (t) => strapProfile(0.0018, 0.011 + 0.003 * Math.exp(-(((t - 0.5) / 0.25) ** 2))),
  })
  noisify(strap, { amp: 0.0004, freq: 60, seed: 55 })
  B.add(strap, 'leather')
  // A second, shorter grip strap so the fist has something to close on, bolted
  // to its own pair of tabs rather than floating off the plate.
  const gy = yTop * 0.36
  const gx = 0.032
  for (const s of [1, -1]) {
    const tab = roundedBox(0.016, 0.01, 0.008, 0.0014, 1)
    xform(tab, { pos: V(gx, s * gy, backZ(0.5) - 0.0035), rot: [0, 0, 0] })
    B.add(tab, 'metal')
    const g = rivet(0.0028, 0.0018, 6)
    xform(g, { pos: V(gx, s * gy, backZ(0.5) - 0.008), rot: [-Math.PI / 2, 0, 0] })
    B.add(g, 'brass')
  }
  const grip = sweep({
    path: smoothPath(
      [
        V(gx, gy, backZ(0.5) - 0.006),
        V(gx + 0.004, 0, backZ(0.5) - 0.019),
        V(gx, -gy, backZ(0.5) - 0.006),
      ],
      12,
    ),
    upHint: V(0, 0, 1),
    profile: () => strapProfile(0.0022, 0.008),
  })
  B.add(grip, 'leather')

  const gear = {
    parts: B.parts(scale),
    // The plate's reach along +Y is just the (dented) rim radius that way.
    length: rimR(Math.PI / 2),
    gripRadius: 0.011,
    anchors: {
      boss: anchor(V(0.002, 0.003, bossZ + 0.055), V(0, 0, 1)),
      strapTop: anchor(V(0, yTop, backZ(bracketU) - 0.008), V(0, 0, -1)),
      strapBottom: anchor(V(0, yBot, backZ(bracketU) - 0.008), V(0, 0, -1)),
      rim: anchor(V(0, rimR(Math.PI / 2), 0), V(0, 1, 0)),
    },
  }
  return scaleGear(gear, scale)
}
