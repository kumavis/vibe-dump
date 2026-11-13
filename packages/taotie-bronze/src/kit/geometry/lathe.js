// Bodies of revolution — gu, zun, jia, lei, pou, hu, round ding bowls.
//
// Round Shang vessels were cast from a clay model turned against a profile
// template, so the outer surface is a Profile (profile.js: (r, y) mm, arc-length
// parametrised, corners = carinations = horizontal mould joints, named
// REGISTERS). The piece mould then cut that surface into SECTORS (vertical mould
// sections, between flange axes) and REGISTERS (horizontal bands): one cell per
// sector × register, and décor is a 2D panel per cell. lathe() builds exactly
// that grid:
//
//   outer skin   one buildSurface patch per (band × sector). Bands are the arc
//                intervals between corners, ridge zones, register ends and hole
//                edges, so carinations stay crisp (split normals) and a decorated
//                cell is cut only where it must be. All patches share ONE column
//                set (θ) and their band-edge rows, so neighbours share vertices:
//                watertight by construction (relief fades to 0 at panel borders).
//   lip          rounded / squared cap from the outer rim to the inner wall,
//                thickened over the last few mm (rims are cast thick).
//   inner wall   the core: a smoothed inward offset of the outline, plain.
//   floor        a cup floor at floor.y (gu / zun: well above the base), slightly domed.
//   hollow foot  inner foot wall + floor underside + foot-ring bottom annulus.
//   holes        cruciform / rectangular openings in the foot, cut on grid lines,
//                with real tunnel walls through the wall (core-support voids).
//   tolerance    research/03 §5 'cast, not CAD': ovality, rim out of level, lean —
//                one smooth deformation applied to every vertex (and to flange
//                paths / head mounts), the foot stays flat on y = 0.
//
// Called the old way (no wall / registers / sectors …) it still returns the
// single Mesh the first pass did (parts.js legs and ring feet use that).

import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { buildSurface } from './surface.js'
import { flange } from './flange.js'
import { Profile, profile as toProfile } from './profile.js'
import { PatinaMaterial } from '../material/patina.js'
import { Rng } from '../util/rng.js'

const TAU = Math.PI * 2
const DEG = Math.PI / 180

// =================================================================== legacy API

/**
 * Arc-length parametrised profile curve (legacy shape: at(t), t ∈ [0,1]).
 * @param {Array<[number,number]|[number,number,'corner']>|Profile} profile
 */
export function profileCurve(profile) {
  if (profile?.isProfileCurve) return profile
  const P = toProfile(profile)
  return {
    isProfileCurve: true,
    profile: P,
    length: P.length,
    points: P.points.map((p) => new THREE.Vector3(p[0], p[1], 0)),
    at(t, side) {
      const q = P.at(Math.min(Math.max(t, 0), 1) * P.length, side)
      return { r: q.r, y: q.y, nr: q.nr, ny: q.ny }
    },
  }
}

/**
 * Surface function for buildSurface. u = 0.5 faces front (+Z), u increases
 * to the right seen from outside; v runs up the profile by arc length.
 */
export function latheSurface(profile, { u0 = 0, u1 = 1, v0 = 0, v1 = 1 } = {}) {
  const curve = profileCurve(profile)
  return (u, v, out) => {
    const th = (u0 + (u1 - u0) * u - 0.5) * TAU
    const p = curve.at(v0 + (v1 - v0) * v)
    const s = Math.sin(th), c = Math.cos(th)
    out.pos.set(p.r * s, p.y, p.r * c)
    out.nrm.set(p.nr * s, p.ny, p.nr * c)
  }
}

function legacyLathe({ profile, material, part = 'body', segments = { density: 0.5 }, thickness = 0, rims = ['v1'], relief = null, reliefRect, fade, maxVerts }) {
  const curve = profileCurve(profile)
  const geo = buildSurface({
    surface: latheSurface(curve),
    segments,
    relief,
    reliefRect,
    fade: fade ?? { u0: 0, u1: 0, v0: 1.5, v1: 1.5 },
    back: thickness > 0 ? { thickness, rims } : null,
    maxVerts,
  })
  const mesh = new THREE.Mesh(geo, material)
  mesh.userData.part = part
  mesh.castShadow = mesh.receiveShadow = true
  return mesh
}

// =================================================================== vessel lathe

const MODERN = ['wall', 'registers', 'sectors', 'floor', 'holes', 'tolerance', 'lip', 'foot', 'ridges']

/**
 * A vessel body of revolution, or (legacy call) a single revolved Mesh.
 *
 * @param {object} o
 * @param {Profile|Array} o.profile        outer outline bottom → top, mm (profile.js); y = 0 is the ground
 * @param {number|{count:number,center?:number}|{bounds:number[]}} [o.sectors]  default sectoring (deg; sector k centred
 *        at center + k·360/count; 0 = front +Z, positive toward +X). Default 4, centred on the front.
 * @param {Object<string,RegisterSpec>} [o.registers]
 *        RegisterSpec = { y0,y1 | s0,s1 | from,to | (omit: a register already named on the Profile),
 *                         sectors?, relief?: ReliefMap | (sectorIndex, size) => ReliefMap|null, fade?, material? }
 * @param {number|((s:number,y:number)=>number)} [o.wall]  wall thickness mm (default 3)
 * @param {{thickness?:number,length?:number,shape?:'round'|'flat',bulge?:number}} [o.lip]
 * @param {{y:number,thickness?:number,dome?:number}|null} [o.floor]   inner floor (top surface at y); null: follow the profile
 * @param {{wall?:number,hollow?:boolean}} [o.foot]
 * @param {Array<HoleSpec>} [o.holes]  { shape: 'cross'|'rect', azimuth deg, y mm (centre), arm mm (half length), width mm, w, h }
 * @param {{seed?:number,ovality?:number,rim?:number,lean?:number}|null} [o.tolerance]
 *        ovality = fraction of radius (0.005–0.015), rim = peak-to-peak fraction of H (0.003–0.01), lean deg (0.5–1.5)
 * @param {Array} [o.ridges]       bowstrings, added to the Profile (see Profile.addRidges)
 * @param {number} [o.oval]        major:minor plan ratio (you / hu oval bodies, 1.25–1.4): depth (Z) = width / oval
 * @param {number} [o.density]     vertices per mm on decorated cells (default 1)
 * @param {number} [o.quality]     scales density and the plain silhouette tolerance
 * @param {THREE.Material} [o.material]          plain outer wall, lip, foot ring
 * @param {THREE.Material} [o.interiorMaterial]  inner wall, floor, foot cavity, hole walls
 * @param {(relief, registerName) => THREE.Material} [o.materialFor]
 * @param {string} [o.part]
 * @returns {THREE.Group}  userData.part, userData.lathe = LatheInfo (registers, sizes, frame(), meridian(), …)
 */
export function lathe(o) {
  if (!MODERN.some((k) => k in o)) return legacyLathe(o)
  return vesselLathe(o)
}

function vesselLathe({
  profile,
  sectors = 4,
  registers = {},
  wall = 3,
  lip = {},
  floor,
  foot = {},
  holes = [],
  tolerance = null,
  oval = 1,
  ridges = null,
  density = 1,
  quality = 1,
  chord = 0.05,
  fade = 1.5,
  material,
  interiorMaterial,
  materialFor,
  part = 'body',
  name,
}) {
  const P = profile?.isProfile ? profile : new Profile(profile)
  if (ridges) for (const r of ridges) P.addRidges(r)
  const L = P.length
  const H = P.bounds.yMax
  const wallFn = typeof wall === 'function' ? wall : () => wall
  const dens = density * Math.sqrt(quality)

  // ---- registers
  const regs = []
  for (const [nm, spec0] of Object.entries(registers)) {
    const spec = spec0 || {}
    const hasRange = Array.isArray(spec) || ['y0', 's0', 'from'].some((k) => k in spec)
    const r = hasRange ? P.setRegister(nm, Array.isArray(spec) ? spec : spec) : P.register(nm)
    regs.push({ ...r, name: nm, spec: Array.isArray(spec) ? {} : spec })
  }
  for (const [nm, r] of Object.entries(P.registers)) if (!regs.find((q) => q.name === nm)) regs.push({ ...r, name: nm, spec: {} })
  regs.sort((a, b) => a.s0 - b.s0)

  const defaultSectors = parseSectors(sectors)
  const sectorsOf = (reg) => (reg?.spec?.sectors != null ? parseSectors(reg.spec.sectors) : defaultSectors)

  // ---- tolerance → deformation (applied to every vertex; foot stays on y = 0)
  const deform = makeDeform(tolerance, H, oval)

  // ---- holes (in θ, s)
  const holeList = holes.map((h) => parseHole(h, P, H))

  // ---- columns: one θ set for the whole vessel
  const required = []
  for (const sc of [defaultSectors, ...regs.map(sectorsOf)]) for (const [a] of sc) required.push(a)
  for (const h of holeList) required.push(...h.thetas)
  let rDec = 0
  for (const reg of regs) if (reg.spec.relief) for (let s = reg.s0; s <= reg.s1; s += Math.max(1, reg.length / 40)) rDec = Math.max(rDec, P.at(s).r)
  const rMax = P.bounds.rMax
  const ch = chord / Math.max(0.25, quality)
  const Mplain = Math.ceil(TAU / (2 * Math.sqrt((2 * ch) / Math.max(rMax, 1))))
  const Mdec = Math.ceil(TAU * rDec * dens)
  const M = Math.max(64, Mplain, Mdec)
  const cols = makeColumns(M, required)
  const theta0 = cols[0]
  const cols2 = cols.concat(cols.slice(1).map((t) => t + TAU))
  const colSlice = (a, b) => {
    let a1 = theta0 + mod(a - theta0, TAU)
    if (a1 > theta0 + TAU - 1e-9) a1 -= TAU
    const b1 = a1 + (b - a)
    const i0 = nearestIdx(cols2, a1)
    const i1 = nearestIdx(cols2, b1)
    const out = cols2.slice(i0, i1 + 1)
    out[0] = a1
    out[out.length - 1] = b1
    return out
  }

  // ---- bands
  const brk = new Set([0, L, ...P.breaks()])
  for (const r of regs) { brk.add(r.s0); brk.add(r.s1) }
  for (const h of holeList) for (const s of h.ss) brk.add(s)
  const bps = [...brk].filter((s) => s >= 0 && s <= L).sort((a, b) => a - b)
  const bands = []
  for (let i = 0; i < bps.length - 1; i++) if (bps[i + 1] - bps[i] > 0.02) bands.push([bps[i], bps[i + 1]])

  // ---- per-register, per-sector sizes (the author's panel sizes)
  const info = {
    isLatheInfo: true,
    profile: P,
    height: H,
    length: L,
    columns: cols.length - 1,
    sectors: defaultSectors.map(([a, b]) => [a / DEG, b / DEG]),
    registers: {},
    deform,
  }
  for (const reg of regs) {
    const sc = sectorsOf(reg)
    const at0 = P.at(reg.s0, 1), at1 = P.at(reg.s1, -1), atm = P.at((reg.s0 + reg.s1) / 2)
    let rMx = 0
    for (let s = reg.s0; s <= reg.s1; s += Math.max(0.5, reg.length / 60)) rMx = Math.max(rMx, P.at(s).r)
    info.registers[reg.name] = {
      name: reg.name, s0: reg.s0, s1: reg.s1, y0: reg.y0, y1: reg.y1, height: reg.length,
      rBottom: at0.r, rTop: at1.r, rMid: atm.r, rMax: rMx,
      sectors: sc.map(([a, b], k) => panelSize(P, reg, k, sc.length, a, b)),
    }
  }

  // ---- materials
  const plainMat = material || new PatinaMaterial()
  // the cup is seen through the mouth (keeps most of the outer patina); the foot cavity and hole walls are buried
  const cupMat = interiorMaterial || new PatinaMaterial({ interior: 0.45 })
  const innerMat = interiorMaterial || new PatinaMaterial({ interior: 1 })
  const reliefMats = new Map()
  const matFor = (map, reg) => {
    if (reg.spec.material) return reg.spec.material
    if (reliefMats.has(map)) return reliefMats.get(map)
    const m = materialFor ? materialFor(map, reg.name) : new PatinaMaterial({ relief: map })
    reliefMats.set(map, m)
    return m
  }

  // ---- wall thickness along the outline, thickened toward the lip
  const lipT = lip.thickness ?? wallFn(L, H) * 1.6
  const lipLen = lip.length ?? Math.max(6, lipT * 3)
  const cupWall = (s, y) => {
    const w = wallFn(s, y)
    return w + (lipT - w) * smooth01((s - (L - lipLen)) / lipLen)
  }
  const bottom = P.at(0)
  const r0 = bottom.r
  let fl = floor
  if (fl === undefined) fl = r0 > 0.5 ? { y: wallFn(0, 0) * 1.4, thickness: wallFn(0, 0) * 1.4 } : null
  const floorY = fl ? fl.y : null
  const floorT = fl ? fl.thickness ?? wallFn(0, 0) * 1.5 : 0
  const footWall = foot.wall ?? wallFn(0, 0)
  const hollow = fl ? (foot.hollow ?? true) && floorY - floorT > footWall * 1.5 : false
  function holeDepth(s) {
    const y = P.at(s).y
    return (fl && hollow && y < floorY - floorT ? footWall : cupWall(s, y)) + 0.15
  }
  info.wallAt = (s) => cupWall(s, P.at(s).y)
  info.floorY = floorY

  // ---- outer skin
  const buckets = new Map() // key (ReliefMap | 'plain') → { geos, material }
  const tunnels = []
  const reliefCache = new Map()
  const regAt = (s) => regs.find((r) => s > r.s0 + 1e-6 && s < r.s1 - 1e-6) || null
  for (const [b0, b1] of bands) {
    const reg = regAt((b0 + b1) / 2)
    const decorated = !!reg?.spec?.relief
    const rows = P.samples(b0, b1, decorated
      ? { maxAngle: 0.05 / Math.sqrt(quality), maxLen: 1 / dens }
      : { maxAngle: 0.06 / Math.sqrt(quality), maxLen: 8 / Math.sqrt(quality) })
    const vS = rows.map((s) => (s - b0) / (b1 - b0))
    vS[0] = 0
    vS[vS.length - 1] = 1
    const sc = sectorsOf(reg)
    sc.forEach(([a, b], k) => {
      const th = colSlice(a, b)
      const uS = th.map((t) => (t - th[0]) / (th[th.length - 1] - th[0]))
      uS[0] = 0
      uS[uS.length - 1] = 1
      const A = th[0], B = th[th.length - 1]
      const surf = (u, v, out) => {
        const t = u <= 0 ? A : u >= 1 ? B : A + u * (B - A)
        const s = v <= 0 ? b0 : v >= 1 ? b1 : b0 + v * (b1 - b0)
        const q = P.at(s, v <= 0 ? 1 : v >= 1 ? -1 : 0)
        const sn = Math.sin(t), cs = Math.cos(t)
        out.pos.set(q.r * sn, q.y, q.r * cs)
        deform(out.pos)
        out.nrm.set(q.nr * sn, q.ny, q.nr * cs)
      }
      let map = null
      if (decorated) {
        const key = reg.name + '#' + k
        if (!reliefCache.has(key)) {
          const rel = reg.spec.relief
          const size = info.registers[reg.name].sectors[k]
          reliefCache.set(key, typeof rel === 'function' ? rel(k, size) || null : Array.isArray(rel) ? rel[k] || null : rel)
        }
        map = reliefCache.get(key)
      }
      const geo = buildSurface({
        surface: surf,
        samples: { u: uS, v: vS },
        relief: map,
        reliefRect: map ? { u0: 0, u1: 1, v0: (reg.s0 - b0) / (b1 - b0), v1: (reg.s1 - b0) / (b1 - b0) } : undefined,
        fade: reg?.spec?.fade ?? fade,
        normals: 'surface',
      })
      if (holeList.length) {
        const sAt = (j) => b0 + vS[j] * (b1 - b0)
        const tAt = (i) => A + uS[i] * (B - A)
        const t = cutHoles(geo, holeList, tAt, sAt, uS.length - 1, vS.length - 1, (s) => holeDepth(s))
        if (t) tunnels.push(t)
      }
      const keyM = map || 'plain'
      if (!buckets.has(keyM)) buckets.set(keyM, { geos: [], material: map ? matFor(map, reg) : plainMat, register: reg?.name })
      buckets.get(keyM).geos.push(geo)
    })
  }

  const group = new THREE.Group()
  group.name = name || part
  group.userData.part = part
  const add = (geo, mat, role) => {
    const m = new THREE.Mesh(geo, mat)
    m.userData.role = role
    m.castShadow = m.receiveShadow = true
    group.add(m)
    return m
  }
  for (const [key, b] of buckets) {
    const g = b.geos.length === 1 ? b.geos[0] : mergeGeometries(b.geos, false)
    g.computeBoundingBox()
    g.computeBoundingSphere()
    add(g, b.material, key === 'plain' ? 'outer' : 'panel:' + b.register)
  }


  // ---- inner pieces as 2D polylines, revolved on the same columns
  const core = P.offset((s, y) => cupWall(s, y), { smooth: Math.max(2, wallFn(L / 2, H / 2)) })
  const top = P.at(L, -1)
  const It = core[core.length - 1]
  // lip cap: superellipse over the rim from the outer edge to the inner edge
  const lipPts = []
  {
    const n = 14
    const e = lip.shape === 'flat' ? 0.3 : 1
    const k = lip.bulge ?? (lip.shape === 'flat' ? 0.45 : 0.6)
    const Ot = [top.r, top.y]
    const w = Math.hypot(Ot[0] - It[0], Ot[1] - It[1])
    const c = [(Ot[0] + It[0]) / 2, (Ot[1] + It[1]) / 2]
    const nx = (Ot[0] - It[0]) / w, ny = (Ot[1] - It[1]) / w // inner → outer
    let tx = top.tr, ty = top.ty
    const dd = tx * nx + ty * ny
    tx -= nx * dd; ty -= ny * dd
    const tl = Math.hypot(tx, ty) || 1
    tx /= tl; ty /= tl
    for (let i = 0; i <= n; i++) {
      const ph = (Math.PI * i) / n
      const cc = Math.cos(ph), ss = Math.sin(ph)
      const a = Math.sign(cc) * Math.pow(Math.abs(cc), e) * (w / 2)
      const b = Math.sign(ss) * Math.pow(Math.abs(ss), e) * (w / 2) * k
      lipPts.push([c[0] + nx * a + tx * b, c[1] + ny * a + ty * b])
    }
    lipPts[0] = Ot
    lipPts[n] = [It[0], It[1]]
  }
  add(revolve(lipPts, cols, deform, { split: 50 }), plainMat, 'lip')

  // inner cup: from the lip down to the floor (or to the axis)
  const cup = []
  for (let i = core.length - 1; i >= 0; i--) {
    const p = core[i]
    if (fl && p[1] <= floorY) {
      // crossing with the floor plane
      const q = core[i + 1] || p
      const f = q[1] !== p[1] ? (floorY - p[1]) / (q[1] - p[1]) : 0
      cup.push([p[0] + (q[0] - p[0]) * f, floorY])
      break
    }
    if (!fl && p[0] <= 0.01) { cup.push([0, p[1]]); break }
    cup.push([p[0], p[1]])
  }
  let innerPoly = simplify(cup, 0.07, 5)
  if (fl) {
    // fillet at the wall/floor junction, then a slightly domed floor to the axis
    const last = innerPoly[innerPoly.length - 1]
    const rf = last[0]
    const dome = fl.dome ?? Math.min(2.5, rf * 0.04)
    const fr = Math.min(wallFn(0, floorY) * 1.2, rf * 0.3)
    innerPoly = innerPoly.slice(0, -1)
    while (innerPoly.length > 1 && innerPoly[innerPoly.length - 1][1] < floorY + fr) innerPoly.pop()
    innerPoly.push([rf, floorY + fr])
    for (let i = 1; i <= 4; i++) {
      const a = (i / 4) * (Math.PI / 2)
      innerPoly.push([rf - fr + fr * Math.cos(a), floorY + fr - fr * Math.sin(a)])
    }
    const nF = 10
    for (let i = 1; i <= nF; i++) {
      const r = (rf - fr) * (1 - i / nF)
      innerPoly.push([r, floorY + dome * (1 - (r / Math.max(1e-3, rf - fr)) ** 2)])
    }
  }
  add(revolve([[It[0], It[1]], ...innerPoly.slice(1)], cols, deform, { split: 40 }), cupMat, 'inner')

  // underside: hollow foot (inner foot wall + floor underside) and the foot-ring bottom,
  // or a solid flat base disk
  if (r0 > 0.01) {
    const under = []
    if (hollow) {
      const yU = floorY - floorT
      const fcore = P.offset(footWall, { smooth: Math.max(1.5, footWall) })
      const fpts = []
      for (const p of fcore) {
        if (p[1] >= yU) break
        fpts.push([p[0], Math.max(0, p[1])])
      }
      const rU = fpts.length ? fpts[fpts.length - 1][0] : r0 - footWall
      under.push([0, yU - Math.min(1.5, rU * 0.02)])
      for (let i = 1; i <= 6; i++) { const r = (rU * i) / 6; under.push([r, yU - Math.min(1.5, rU * 0.02) * (1 - (r / rU) ** 2)]) }
      const down = simplify(fpts.slice().reverse(), 0.07, 5)
      for (const p of down) if (p[1] < yU - 0.05) under.push(p)
      const lastIn = under[under.length - 1]
      if (lastIn[1] > 0.001) under.push([lastIn[0], 0])
      under.push([r0, 0])
      add(revolve(under.slice(0, -2).concat([under[under.length - 2]]), cols, deform, { split: 40 }), innerMat, 'foot-inner')
      add(revolve(under.slice(-2), cols, deform, { split: 40 }), plainMat, 'foot-ring')
    } else {
      add(revolve([[0, 0], [r0, 0]], cols, deform, { split: 40 }), plainMat, 'base')
    }
  }

  // hole tunnels
  if (tunnels.length) add(tunnels.length === 1 ? tunnels[0] : mergeGeometries(tunnels, false), innerMat, 'holes')

  // ---- frames for flanges, heads, anything mounted on the wall
  const _q = new THREE.Vector3()
  info.frame = (thetaDeg, s, side = 0) => {
    const t = thetaDeg * DEG
    const sc = Math.min(Math.max(s, 0), L)
    const q = P.at(sc, side)
    const sn = Math.sin(t), cs = Math.cos(t)
    const ext = s - sc // linear extrapolation beyond the ends
    const p = new THREE.Vector3((q.r + q.tr * ext) * sn, q.y + q.ty * ext, (q.r + q.tr * ext) * cs)
    // deform via finite differences so the frame follows the cast-in irregularity
    const pd = deform(p.clone())
    const n = new THREE.Vector3(q.nr * sn, q.ny, q.nr * cs)
    const d = new THREE.Vector3(q.tr * sn, q.ty, q.tr * cs)
    const dd = deform(_q.copy(p).addScaledVector(d, 1)).sub(pd).normalize()
    const b = new THREE.Vector3(cs, 0, -sn)
    const nn = new THREE.Vector3().crossVectors(b, dd).normalize()
    if (nn.dot(n) < 0) nn.negate()
    return { p: pd, n: nn, d: dd, b: new THREE.Vector3().crossVectors(dd, nn).normalize(), r: q.r, y: q.y }
  }
  info.sAtY = (y, o) => P.sAtY(y, o)
  info.range = (spec) => resolveRange(P, info, spec)
  info.meridian = (thetaDeg, spec) => {
    const [s0, s1] = resolveRange(P, info, spec)
    return {
      isPath: true, planar: true, kind: 'meridian', theta: thetaDeg, s0, s1, length: s1 - s0,
      // beyond its ends the path runs straight on along the end tangent (overhanging flange ends)
      frame: (sigma) => {
        const L = s1 - s0
        const c = Math.min(Math.max(sigma, 0), L)
        const f = info.frame(thetaDeg, s0 + c, c <= 0 ? 1 : c >= L ? -1 : 0)
        if (sigma !== c) f.p.addScaledVector(f.d, sigma - c)
        return f
      },
    }
  }
  group.userData.lathe = info
  group.userData.registers = info.registers
  return group
}

/**
 * Flanges on a lathe body: one per azimuth × range, each following the wall
 * (meridian path) and breaking at register boundaries (research/03 §4.3: stop
 * 1–3 mm short of rings / carinations and restart in the next register).
 * @param {THREE.Group} body   from lathe()
 * @param {object} o
 * @param {number[]} [o.azimuths]  deg (default the 4 sector boundaries … pass explicitly)
 * @param {Array<string|object>} o.ranges  register names, {y0,y1}, {s0,s1}, or { range, ...flangeOverrides }
 * @param {number} [o.gap]        mm kept clear at each end of a range (default 1.5)
 * @param {(f:number, ctx:{azimuth,range,body})=>number} [o.height]  may also be a law of f ∈ [0,1]
 * @returns {THREE.Mesh[]}  (not added to the body; add them where you like)
 */
export function latheFlanges(body, { azimuths = [0, 90, 180, 270], ranges, gap = 1.5, seed = 1, ...opts } = {}) {
  const info = body.userData.lathe
  const out = []
  let n = 0
  for (const az of azimuths) {
    for (const r0 of ranges || [null]) {
      const r = r0 && typeof r0 === 'object' && 'range' in r0 ? r0 : { range: r0 }
      const { range, gap: g = gap, ...over } = r
      const [s0, s1] = info.range(range)
      const path = info.meridian(az, { s0: s0 + (over.gap0 ?? g), s1: s1 - (over.gap1 ?? g) })
      delete over.gap0
      delete over.gap1
      const o = { ...opts, ...over }
      out.push(flange({ ...o, path, seed: seed * 7919 + n++ * 131 + Math.round(az) }))
    }
  }
  return out
}

// =================================================================== helpers

function smooth01(t) {
  t = Math.min(1, Math.max(0, t))
  return t * t * (3 - 2 * t)
}

function mod(a, m) {
  return ((a % m) + m) % m
}

function nearestIdx(arr, v) {
  let lo = 0, hi = arr.length - 1
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1
    if (arr[m] <= v) lo = m
    else hi = m
  }
  return Math.abs(arr[lo] - v) <= Math.abs(arr[hi] - v) ? lo : hi
}

/** → array of [θa, θb] radians, θb > θa, covering the circle */
export function parseSectors(spec) {
  let bounds
  if (typeof spec === 'number' || spec?.count != null) {
    const n = typeof spec === 'number' ? spec : spec.count
    const c = (spec?.center ?? 0) * DEG
    bounds = []
    for (let k = 0; k < n; k++) bounds.push(c + (k - 0.5) * (TAU / n))
  } else if (spec?.bounds) bounds = spec.bounds.map((d) => d * DEG)
  else if (Array.isArray(spec)) bounds = spec.map((d) => d * DEG)
  else throw new Error('lathe: bad sectors spec')
  const out = []
  for (let k = 0; k < bounds.length; k++) {
    const a = bounds[k]
    let b = k + 1 < bounds.length ? bounds[k + 1] : bounds[0] + TAU
    while (b <= a) b += TAU
    out.push([a, b])
  }
  return out
}

function makeColumns(M, required) {
  const req = [...new Set(required.map((t) => mod(t, TAU)))].sort((a, b) => a - b)
  const base = req.length ? req[0] : 0
  const step = TAU / M
  const cols = []
  for (let k = 0; k <= M; k++) cols.push(base + k * step)
  // snap a nearby column onto each required angle, or insert one
  for (const r0 of req) {
    const r = base + mod(r0 - base, TAU)
    const i = nearestIdx(cols, r)
    if (Math.abs(cols[i] - r) < step * 0.35 && i !== 0 && i !== cols.length - 1) cols[i] = r
    else if (Math.abs(cols[i] - r) > 1e-9) cols.splice(cols[i] < r ? i + 1 : i, 0, r)
  }
  cols[cols.length - 1] = cols[0] + TAU
  return cols
}

function makeDeform(tol, H, oval = 1) {
  if (!tol && oval === 1) return (v) => v
  if (!tol) return (v) => { v.z /= oval; return v }
  const t = { seed: 1, ovality: 0, rim: 0, lean: 0, ...tol }
  const rng = new Rng(t.seed)
  const phO = rng.range(0, TAU), ph1 = rng.range(0, TAU), ph2 = rng.range(0, TAU), phL = rng.range(0, TAU)
  const a1 = rng.range(0.55, 1), a2 = rng.range(0.35, 0.8)
  const rimAmp = (t.rim * H) / 2
  const lean = Math.tan((t.lean || 0) * DEG)
  return (v) => {
    const th = Math.atan2(v.x, v.z)
    const k = 1 + t.ovality * Math.cos(2 * (th - phO))
    v.x *= k
    v.z *= k
    if (rimAmp) {
      const w = Math.max(0, v.y / H) ** 2
      v.y += (rimAmp * w * (a1 * Math.cos(th - ph1) + a2 * Math.cos(2 * (th - ph2)))) / (a1 + a2)
    }
    if (lean) {
      v.x += v.y * lean * Math.sin(phL)
      v.z += v.y * lean * Math.cos(phL)
    }
    if (oval !== 1) v.z /= oval
    return v
  }
}

function resolveRange(P, info, spec) {
  if (spec == null) return [0, P.length]
  if (typeof spec === 'string') {
    const r = info.registers[spec] || P.registers[spec]
    if (!r) throw new Error(`lathe: no register '${spec}'`)
    return [r.s0, r.s1]
  }
  if (Array.isArray(spec)) return [P.sAtY(spec[0]), P.sAtY(spec[1], { from: 'top' })]
  if ('s0' in spec) return [spec.s0, spec.s1]
  if ('y0' in spec) return [P.sAtY(spec.y0), P.sAtY(spec.y1, { from: 'top' })]
  if ('register' in spec) {
    const [a, b] = resolveRange(P, info, spec.register)
    return [a + (spec.inset0 ?? spec.inset ?? 0), b - (spec.inset1 ?? spec.inset ?? 0)]
  }
  throw new Error('lathe: bad range')
}

/**
 * The author's view of one cell: physical sizes (mm) and the mapping between
 * TRUE developed-surface coordinates and PANEL coordinates. Panels are mapped
 * angle-linearly, so on a flaring register the panel is stretched by
 * widthAt(y) / width: a trumpet register is a fan. Draw in true mm with
 * toPanel (or map a shapes.js shape with `map`) and blades come out straight
 * and correctly tapered on the vessel.
 */
function panelSize(P, reg, k, n, a, b) {
  const ang = b - a
  const at = (yArc) => P.at(reg.s0 + Math.min(Math.max(yArc, 0), reg.length))
  const widthAt = (yArc) => at(yArc).r * ang
  const width = widthAt(reg.length / 2)
  const size = {
    register: reg.name, sector: k, sectors: n,
    theta0: a / DEG, theta1: b / DEG, center: (a + b) / 2 / DEG,
    width, height: reg.length,
    widthBottom: widthAt(0), widthTop: widthAt(reg.length),
    rBottom: at(0).r, rTop: at(reg.length).r, rMid: at(reg.length / 2).r,
    widthAt,
    /** [x mm from the sector centre line along the circumference, y mm of arc] → panel [px, py] (panel width W) */
    toPanel: (pt, W = width) => [W / 2 + (pt[0] * W) / widthAt(pt[1]), pt[1]],
    fromPanel: (pt, W = width) => [((pt[0] - W / 2) * widthAt(pt[1])) / W, pt[1]],
  }
  size.map = (pts, W = width) => pts.map((p) => size.toPanel(p, W))
  return size
}

function parseHole(h, P, H) {
  const sh = h.s ?? P.sAtY(h.y)
  const rH = P.at(sh).r
  const th = (h.azimuth ?? 0) * DEG
  const shape = h.shape || 'cross'
  const arm = h.arm ?? H * 0.02
  const wd = h.width ?? Math.max(2, H * 0.008)
  let hx, hy
  if (shape === 'cross') { hx = [arm, wd / 2]; hy = [wd / 2, arm] }
  else { hx = [(h.w ?? wd) / 2]; hy = [(h.h ?? arm * 2) / 2] }
  const thetas = [], ss = []
  for (const x of hx) { thetas.push(th - x / rH, th + x / rH) }
  for (const y of hy) { ss.push(sh - y, sh + y) }
  const inside = (t, s) => {
    const dx = angDiff(t, th) * rH
    const dy = s - sh
    for (let i = 0; i < hx.length; i++) if (Math.abs(dx) < hx[i] && Math.abs(dy) < hy[i]) return true
    return false
  }
  return { thetas, ss, inside }
}

function angDiff(a, b) {
  let d = mod(a - b + Math.PI, TAU) - Math.PI
  return d
}

/** Remove the quads inside holes from a buildSurface grid; return the tunnel walls. */
function cutHoles(geo, holes, tAt, sAt, nu, nv, depthAt) {
  const inside = (t, s) => holes.some((h) => h.inside(t, s))
  const idx = geo.index.array
  const keep = []
  const pos = geo.attributes.position.array
  const nrm = geo.attributes.normal.array
  const W = nu + 1
  const wp = [], wn = []
  const eps = 1e-5
  let cut = false
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const q = (j * nu + i) * 6
      const tc = (tAt(i) + tAt(i + 1)) / 2, sc = (sAt(j) + sAt(j + 1)) / 2
      if (!inside(tc, sc)) {
        for (let k = 0; k < 6; k++) keep.push(idx[q + k])
        continue
      }
      cut = true
      const centre = avgPos(pos, [j * W + i, j * W + i + 1, (j + 1) * W + i, (j + 1) * W + i + 1])
      const edges = [
        [j * W + i, j * W + i + 1, tc, sAt(j) - eps],
        [j * W + i + 1, (j + 1) * W + i + 1, tAt(i + 1) + eps, sc],
        [(j + 1) * W + i + 1, (j + 1) * W + i, tc, sAt(j + 1) + eps],
        [(j + 1) * W + i, j * W + i, tAt(i) - eps, sc],
      ]
      for (const [a, b, tn, sn] of edges) {
        if (inside(tn, sn)) continue
        const d = depthAt(sc)
        const A = [pos[a * 3], pos[a * 3 + 1], pos[a * 3 + 2]]
        const B = [pos[b * 3], pos[b * 3 + 1], pos[b * 3 + 2]]
        const Ai = [A[0] - nrm[a * 3] * d, A[1] - nrm[a * 3 + 1] * d, A[2] - nrm[a * 3 + 2] * d]
        const Bi = [B[0] - nrm[b * 3] * d, B[1] - nrm[b * 3 + 1] * d, B[2] - nrm[b * 3 + 2] * d]
        // face normal toward the void
        const e1 = sub(B, A), e2 = sub(Ai, A)
        let fn = cross(e1, e2)
        const mid = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2, (A[2] + B[2]) / 2]
        const toVoid = sub(centre, mid)
        let quad = [A, B, Bi, Ai]
        if (dot(fn, toVoid) < 0) { quad = [B, A, Ai, Bi]; fn = fn.map((x) => -x) }
        const l = Math.hypot(...fn) || 1
        for (const vi of [0, 1, 2, 0, 2, 3]) { wp.push(...quad[vi]); wn.push(fn[0] / l, fn[1] / l, fn[2] / l) }
      }
    }
  }
  if (!cut) return null
  geo.setIndex(keep)
  const t = new THREE.BufferGeometry()
  t.setAttribute('position', new THREE.Float32BufferAttribute(wp, 3))
  t.setAttribute('normal', new THREE.Float32BufferAttribute(wn, 3))
  t.setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array((wp.length / 3) * 2).fill(-1), 2))
  t.setIndex([...Array(wp.length / 3).keys()])
  return t
}

function avgPos(pos, ids) {
  const c = [0, 0, 0]
  for (const i of ids) { c[0] += pos[i * 3]; c[1] += pos[i * 3 + 1]; c[2] += pos[i * 3 + 2] }
  return c.map((x) => x / ids.length)
}
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]

/** Thin a dense polyline: keep a vertex when turning > maxAngle or length > maxLen since the last kept one. */
function simplify(pts, maxAngle, maxLen) {
  if (pts.length < 3) return pts.slice()
  const out = [pts[0]]
  let last = pts[0]
  let dir = null
  for (let i = 1; i < pts.length - 1; i++) {
    const p = pts[i]
    const dx = p[0] - last[0], dy = p[1] - last[1]
    const l = Math.hypot(dx, dy)
    if (l < 1e-6) continue
    const d = [dx / l, dy / l]
    if (!dir) dir = d
    const ang = Math.acos(Math.max(-1, Math.min(1, d[0] * dir[0] + d[1] * dir[1])))
    if (ang > maxAngle || l > maxLen) {
      const keepP = pts[i - 1] !== last ? pts[i - 1] : p
      out.push(keepP)
      last = keepP
      dir = null
    }
  }
  out.push(pts[pts.length - 1])
  return out
}

/**
 * Revolve a 2D polyline [[r, y], …] about Y on the given θ columns.
 * Normal = (dy, -dr) of the walking direction (material on the left).
 * Vertices are duplicated where the polyline turns by more than `split` degrees.
 */
export function revolve(poly, cols, deform = (v) => v, { split = 40 } = {}) {
  const n = poly.length
  const seg = []
  for (let i = 0; i < n - 1; i++) {
    const dr = poly[i + 1][0] - poly[i][0], dy = poly[i + 1][1] - poly[i][1]
    const l = Math.hypot(dr, dy) || 1
    seg.push([dr / l, dy / l, l])
  }
  const rows = [] // { r, y, nr, ny, s, gap }
  let s = 0
  const cosSplit = Math.cos(split * DEG)
  for (let i = 0; i < n; i++) {
    if (i > 0) s += seg[i - 1][2]
    const a = seg[i - 1], b = seg[i]
    const nrm = (t) => [t[1], -t[0]]
    if (a && b && a[0] * b[0] + a[1] * b[1] < cosSplit) {
      rows.push({ r: poly[i][0], y: poly[i][1], n: nrm(a), s })
      rows.push({ r: poly[i][0], y: poly[i][1], n: nrm(b), s, gap: true })
    } else {
      const t = a && b ? [a[0] + b[0], a[1] + b[1]] : a || b
      const l = Math.hypot(t[0], t[1]) || 1
      rows.push({ r: poly[i][0], y: poly[i][1], n: nrm([t[0] / l, t[1] / l]), s })
    }
  }
  const C = cols.length
  const N = rows.length * C
  const pos = new Float32Array(N * 3), nor = new Float32Array(N * 3), uv = new Float32Array(N * 2)
  const v = new THREE.Vector3()
  const S = Math.max(s, 1e-6)
  rows.forEach((rw, j) => {
    for (let i = 0; i < C; i++) {
      const t = cols[i]
      const sn = Math.sin(t), cs = Math.cos(t)
      v.set(rw.r * sn, rw.y, rw.r * cs)
      deform(v)
      const k = (j * C + i) * 3
      pos[k] = v.x; pos[k + 1] = v.y; pos[k + 2] = v.z
      nor[k] = rw.n[0] * sn; nor[k + 1] = rw.n[1]; nor[k + 2] = rw.n[0] * cs
      uv[(j * C + i) * 2] = (t - cols[0]) / TAU
      uv[(j * C + i) * 2 + 1] = rw.s / S
    }
  })
  const idx = []
  for (let j = 0; j < rows.length - 1; j++) {
    if (rows[j + 1].gap) continue
    for (let i = 0; i < C - 1; i++) {
      const a = j * C + i, b = a + 1, c = a + C + 1, d = a + C
      idx.push(a, b, c, a, c, d)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3))
  g.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  g.setIndex(N > 65535 ? new THREE.Uint32BufferAttribute(idx, 1) : new THREE.Uint16BufferAttribute(idx, 1))
  g.computeBoundingBox()
  g.computeBoundingSphere()
  return g
}
