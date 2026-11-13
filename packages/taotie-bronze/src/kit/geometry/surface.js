// buildSurface — a parametric surface patch, sampled to a grid, displaced by a
// ReliefMap. This is how cast relief gets onto a vessel wall.
//
// Two decisions worth knowing:
//
// 1. Positions are displaced by relief.macro() — a low-passed copy matched to
//    the vertex spacing — while the SHADING normal comes from the full-res
//    normal map applied over the smooth, undisplaced surface normal
//    (`normals: 'surface'`, the default). Recomputing vertex normals from the
//    displaced mesh and then also applying the normal map would count every
//    plateau shoulder twice. So: silhouette and cast shadow from geometry,
//    slope from the map, one source of truth (the ReliefMap) for both.
//
// 2. Displacement fades to exactly 0 within `fade` mm of the relief rect's
//    border. A Shang wall was cast in mould sections; the seams between them
//    are where flanges sit, and in mesh terms they are where two patches must
//    meet without a crack. Zero displacement at the border makes any two
//    patches that share a border curve watertight by construction.
//
// Parametrisation convention: u runs left → right as seen from OUTSIDE, v runs
// upward, so dP/du × dP/dv points outward. Panel x follows u, panel y follows v.

import * as THREE from 'three'

const _out = { pos: new THREE.Vector3(), nrm: new THREE.Vector3() }
const _pm = [0, 0, 1]

/**
 * @param {object} o
 * @param {(u:number, v:number, out:{pos:THREE.Vector3,nrm:THREE.Vector3}) => void} o.surface
 * @param {[number,number]|{density:number}} [o.segments]  [nu,nv] or vertices per mm
 * @param {import('../relief/bake.js').ReliefMap|null} [o.relief]
 * @param {{u0:number,v0:number,u1:number,v1:number}} [o.reliefRect] where the panel sits in (u,v)
 * @param {{thickness:number, rims?:string[]}|null} [o.back]  inner wall offset inward; rims from 'u0','u1','v0','v1'
 * @param {number|{u0?:number,u1?:number,v0?:number,v1?:number}} [o.fade]  mm over which displacement → 0 at rect borders
 * @param {'surface'|'displaced'} [o.normals]
 * @param {number} [o.maxVerts]
 * @param {number} [o.reliefScale] multiplies displacement (1 = mm as baked)
 * @param {(u:number, v:number, out:number[]) => void} [o.panelMap] optional non-linear surface→panel map:
 *   out = [pu, pv, weight] arrives holding the reliefRect mapping; overwrite it (weight multiplies displacement,
 *   e.g. a fade along a slanted trapezoid edge). Used by fang/lid/handles for 1:1 ("true") panel mapping.
 * @returns {THREE.BufferGeometry}
 */
export function buildSurface({
  surface,
  segments = { density: 1 },
  relief = null,
  reliefRect = { u0: 0, v0: 0, u1: 1, v1: 1 },
  back = null,
  fade = 1.5,
  normals = 'surface',
  maxVerts = 400000,
  reliefScale = 1,
  panelMap = null,
  samples = null, // { u?: number[], v?: number[] } explicit sorted parameter values in [0,1] (non-uniform grid; lathe.js)
}) {
  // ---- resolution
  const lenU = maxLength(surface, true)
  const lenV = maxLength(surface, false)
  let nu, nv
  if (samples?.u && samples?.v) { nu = samples.u.length - 1; nv = samples.v.length - 1; maxVerts = Infinity }
  else if (Array.isArray(segments)) [nu, nv] = segments
  else {
    const d = segments.density ?? 1
    nu = Math.max(1, Math.ceil(lenU * d))
    nv = Math.max(1, Math.ceil(lenV * d))
  }
  const budget = back ? maxVerts / 2 : maxVerts
  if ((nu + 1) * (nv + 1) > budget) {
    const k = Math.sqrt(budget / ((nu + 1) * (nv + 1)))
    nu = Math.max(1, Math.floor(nu * k))
    nv = Math.max(1, Math.floor(nv * k))
  }
  const W = nu + 1
  const N = W * (nv + 1)
  const spacing = Math.max(lenU / nu, lenV / nv)
  const sU = samples?.u && samples?.v ? samples.u : null
  const sV = samples?.u && samples?.v ? samples.v : null
  const uAt = (i) => (sU ? sU[i] : i / nu)
  const vAt = (j) => (sV ? sV[j] : j / nv)

  // ---- base surface
  const base = new Float32Array(N * 3)
  const bn = new Float32Array(N * 3)
  for (let j = 0; j <= nv; j++) {
    for (let i = 0; i <= nu; i++) {
      const k = (j * W + i) * 3
      _out.nrm.set(0, 0, 0)
      surface(uAt(i), vAt(j), _out)
      base[k] = _out.pos.x; base[k + 1] = _out.pos.y; base[k + 2] = _out.pos.z
      bn[k] = _out.nrm.x; bn[k + 1] = _out.nrm.y; bn[k + 2] = _out.nrm.z
    }
  }
  // tangent frame from the grid (and normals, where the surface gave none)
  const tu = new Float32Array(N * 3)
  const tv = new Float32Array(N * 3)
  gridDerivatives(base, nu, nv, tu, tv)
  for (let n = 0; n < N; n++) {
    const k = n * 3
    if (bn[k] * bn[k] + bn[k + 1] * bn[k + 1] + bn[k + 2] * bn[k + 2] < 1e-12) {
      const c = cross(tu[k], tu[k + 1], tu[k + 2], tv[k], tv[k + 1], tv[k + 2])
      normalize3(c)
      bn[k] = c[0]; bn[k + 1] = c[1]; bn[k + 2] = c[2]
    }
  }

  // ---- displacement + panel uv
  const pos = new Float32Array(N * 3)
  const uv = new Float32Array(N * 2)
  const R = reliefRect
  const f = typeof fade === 'number' ? { u0: fade, u1: fade, v0: fade, v1: fade } : { u0: 0, u1: 0, v0: 0, v1: 0, ...fade }
  const macro = relief ? relief.macro(spacing) : null
  for (let j = 0; j <= nv; j++) {
    for (let i = 0; i <= nu; i++) {
      const n = j * W + i
      const k = n * 3
      const u = uAt(i)
      const v = vAt(j)
      let pu = (u - R.u0) / (R.u1 - R.u0)
      let pv = (v - R.v0) / (R.v1 - R.v0)
      let pw = 1
      if (panelMap) {
        _pm[0] = pu; _pm[1] = pv; _pm[2] = 1
        panelMap(u, v, _pm)
        pu = _pm[0]; pv = _pm[1]; pw = _pm[2]
      }
      uv[n * 2] = relief ? pu : u
      uv[n * 2 + 1] = relief ? pv : v
      let d = 0
      if (macro && pu >= 0 && pu <= 1 && pv >= 0 && pv <= 1) {
        const w = relief.widthMM
        const h = relief.heightMM
        const fu = Math.min(ramp(pu * w, f.u0), ramp((1 - pu) * w, f.u1))
        const fv = Math.min(ramp(pv * h, f.v0), ramp((1 - pv) * h, f.v1))
        d = macro.sample(pu, pv) * fu * fv * pw * reliefScale
      }
      pos[k] = base[k] + bn[k] * d
      pos[k + 1] = base[k + 1] + bn[k + 1] * d
      pos[k + 2] = base[k + 2] + bn[k + 2] * d
    }
  }

  // ---- normals
  let nrm = bn
  if (normals === 'displaced' && macro) {
    const du = new Float32Array(N * 3)
    const dv = new Float32Array(N * 3)
    gridDerivatives(pos, nu, nv, du, dv)
    nrm = new Float32Array(N * 3)
    for (let n = 0; n < N; n++) {
      const k = n * 3
      const c = cross(du[k], du[k + 1], du[k + 2], dv[k], dv[k + 1], dv[k + 2])
      normalize3(c)
      const s = c[0] * bn[k] + c[1] * bn[k + 1] + c[2] * bn[k + 2] < 0 ? -1 : 1
      nrm[k] = c[0] * s; nrm[k + 1] = c[1] * s; nrm[k + 2] = c[2] * s
    }
  }

  // ---- tangents (xyz along +u projected off the normal, w = handedness so the bitangent is +v)
  const tan = new Float32Array(N * 4)
  for (let n = 0; n < N; n++) {
    const k = n * 3
    let tx = tu[k], ty = tu[k + 1], tz = tu[k + 2]
    const nx = nrm[k], ny = nrm[k + 1], nz = nrm[k + 2]
    const dd = tx * nx + ty * ny + tz * nz
    tx -= nx * dd; ty -= ny * dd; tz -= nz * dd
    const l = Math.hypot(tx, ty, tz) || 1
    tx /= l; ty /= l; tz /= l
    const b = cross(nx, ny, nz, tx, ty, tz)
    const w = b[0] * tv[k] + b[1] * tv[k + 1] + b[2] * tv[k + 2] < 0 ? -1 : 1
    tan[n * 4] = tx; tan[n * 4 + 1] = ty; tan[n * 4 + 2] = tz; tan[n * 4 + 3] = w
  }

  // ---- outer faces, wound so the front face is outward
  const mid = ((nv >> 1) * W + (nu >> 1)) * 3
  const c = cross(tu[mid], tu[mid + 1], tu[mid + 2], tv[mid], tv[mid + 1], tv[mid + 2])
  const outward = c[0] * bn[mid] + c[1] * bn[mid + 1] + c[2] * bn[mid + 2] >= 0
  const idx = []
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const a = j * W + i, b = a + 1, cc = a + W + 1, d = a + W
      if (outward) idx.push(a, b, cc, a, cc, d)
      else idx.push(a, cc, b, a, d, cc)
    }
  }

  const P = [pos], Nn = [nrm], U = [uv], T = [tan]
  let count = N

  if (back && back.thickness > 0) {
    // ---- inner wall: offset along the smooth normal, never displaced (the
    // inside of a Shang vessel is plain — décor was carved in the outer mould)
    const t = back.thickness
    const ip = new Float32Array(N * 3), inr = new Float32Array(N * 3), iuv = new Float32Array(N * 2).fill(-1)
    const itan = new Float32Array(N * 4)
    for (let n = 0; n < N; n++) {
      const k = n * 3
      ip[k] = base[k] - bn[k] * t; ip[k + 1] = base[k + 1] - bn[k + 1] * t; ip[k + 2] = base[k + 2] - bn[k + 2] * t
      inr[k] = -bn[k]; inr[k + 1] = -bn[k + 1]; inr[k + 2] = -bn[k + 2]
      itan[n * 4] = tan[n * 4]; itan[n * 4 + 1] = tan[n * 4 + 1]; itan[n * 4 + 2] = tan[n * 4 + 2]; itan[n * 4 + 3] = -tan[n * 4 + 3]
    }
    for (let j = 0; j < nv; j++) {
      for (let i = 0; i < nu; i++) {
        const a = count + j * W + i, b = a + 1, cc = a + W + 1, d = a + W
        if (outward) idx.push(a, cc, b, a, d, cc)
        else idx.push(a, b, cc, a, cc, d)
      }
    }
    P.push(ip); Nn.push(inr); U.push(iuv); T.push(itan)
    count += N

    // ---- rims: close the wall along the requested borders
    const rims = back.rims ?? ['u0', 'u1', 'v0', 'v1']
    for (const side of rims) {
      const line = []
      if (side === 'v0') for (let i = 0; i <= nu; i++) line.push(i)
      if (side === 'v1') for (let i = 0; i <= nu; i++) line.push(nv * W + i)
      if (side === 'u0') for (let j = 0; j <= nv; j++) line.push(j * W)
      if (side === 'u1') for (let j = 0; j <= nv; j++) line.push(j * W + nu)
      const dir = side[0] === 'u' ? tu : tv
      const sgn = side[1] === '0' ? -1 : 1
      const L = line.length
      const rp = new Float32Array(L * 2 * 3), rn = new Float32Array(L * 2 * 3), ruv = new Float32Array(L * 2 * 2).fill(-1)
      const rt = new Float32Array(L * 2 * 4)
      for (let s = 0; s < L; s++) {
        const n = line[s]
        const k = n * 3
        const e = [dir[k] * sgn, dir[k + 1] * sgn, dir[k + 2] * sgn]
        normalize3(e)
        for (let q = 0; q < 2; q++) {
          const src = q === 0 ? pos : ip
          const o = (s * 2 + q) * 3
          rp[o] = src[k]; rp[o + 1] = src[k + 1]; rp[o + 2] = src[k + 2]
          rn[o] = e[0]; rn[o + 1] = e[1]; rn[o + 2] = e[2]
          const ot = (s * 2 + q) * 4
          rt[ot] = bn[k]; rt[ot + 1] = bn[k + 1]; rt[ot + 2] = bn[k + 2]; rt[ot + 3] = 1
        }
      }
      for (let s = 0; s < L - 1; s++) {
        const a = count + s * 2, b = a + 1, cc = a + 3, d = a + 2
        // orient each quad by its own face normal vs the rim direction
        const ka = (s * 2) * 3, kb = (s * 2 + 1) * 3, kd = (s * 2 + 2) * 3
        const fn = cross(rp[kb] - rp[ka], rp[kb + 1] - rp[ka + 1], rp[kb + 2] - rp[ka + 2], rp[kd] - rp[ka], rp[kd + 1] - rp[ka + 1], rp[kd + 2] - rp[ka + 2])
        if (fn[0] * rn[ka] + fn[1] * rn[ka + 1] + fn[2] * rn[ka + 2] >= 0) idx.push(a, b, cc, a, cc, d)
        else idx.push(a, cc, b, a, d, cc)
      }
      P.push(rp); Nn.push(rn); U.push(ruv); T.push(rt)
      count += L * 2
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(concat(P), 3))
  geo.setAttribute('normal', new THREE.BufferAttribute(concat(Nn), 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(concat(U), 2))
  geo.setAttribute('tangent', new THREE.BufferAttribute(concat(T), 4))
  geo.setIndex(count > 65535 ? new THREE.Uint32BufferAttribute(idx, 1) : new THREE.Uint16BufferAttribute(idx, 1))
  geo.computeBoundingBox()
  geo.computeBoundingSphere()
  geo.userData = { nu, nv, spacing, lenU, lenV }
  return geo
}

/**
 * Bilinear quad surface through four corners (Vector3-like or [x,y,z]):
 * p00 = (u0,v0) bottom-left seen from outside, p10 bottom-right, p01 top-left, p11 top-right.
 */
export function quadSurface(p00, p10, p01, p11) {
  const a = vec(p00), b = vec(p10), c = vec(p01), d = vec(p11)
  return (u, v, out) => {
    out.pos.set(
      (1 - v) * ((1 - u) * a.x + u * b.x) + v * ((1 - u) * c.x + u * d.x),
      (1 - v) * ((1 - u) * a.y + u * b.y) + v * ((1 - u) * c.y + u * d.y),
      (1 - v) * ((1 - u) * a.z + u * b.z) + v * ((1 - u) * c.z + u * d.z),
    )
    // leave nrm zero: buildSurface derives it from the grid
  }
}

function vec(p) {
  return Array.isArray(p) ? new THREE.Vector3(p[0], p[1], p[2]) : p
}

function ramp(x, w) {
  if (w <= 0) return 1
  if (x <= 0) return 0
  if (x >= w) return 1
  const t = x / w
  return t * t * (3 - 2 * t)
}

function maxLength(surface, alongU) {
  const o = { pos: new THREE.Vector3(), nrm: new THREE.Vector3() }
  let best = 0
  for (const s of [0, 0.5, 1]) {
    let len = 0
    let prev = null
    for (let i = 0; i <= 24; i++) {
      const t = i / 24
      surface(alongU ? t : s, alongU ? s : t, o)
      if (prev) len += prev.distanceTo(o.pos)
      prev = o.pos.clone()
    }
    best = Math.max(best, len)
  }
  return Math.max(best, 1e-3)
}

function gridDerivatives(p, nu, nv, du, dv) {
  const W = nu + 1
  for (let j = 0; j <= nv; j++) {
    for (let i = 0; i <= nu; i++) {
      const k = (j * W + i) * 3
      const i0 = Math.max(0, i - 1), i1 = Math.min(nu, i + 1)
      const j0 = Math.max(0, j - 1), j1 = Math.min(nv, j + 1)
      const a = (j * W + i0) * 3, b = (j * W + i1) * 3
      const c = (j0 * W + i) * 3, d = (j1 * W + i) * 3
      for (let q = 0; q < 3; q++) {
        du[k + q] = p[b + q] - p[a + q]
        dv[k + q] = p[d + q] - p[c + q]
      }
    }
  }
}

function cross(ax, ay, az, bx, by, bz) {
  return [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx]
}

function normalize3(v) {
  const l = Math.hypot(v[0], v[1], v[2]) || 1
  v[0] /= l; v[1] /= l; v[2] /= l
  return v
}

function concat(arrs) {
  const n = arrs.reduce((s, a) => s + a.length, 0)
  const out = new Float32Array(n)
  let o = 0
  for (const a of arrs) {
    out.set(a, o)
    o += a.length
  }
  return out
}
