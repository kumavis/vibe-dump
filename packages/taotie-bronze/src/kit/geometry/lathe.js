// STATUS: first pass — bodies of revolution (gu, zun, jue cups, legs, ring
// feet). Keep `lathe(opts)` / `latheSurface(profile)`; refine the internals.
//
// Round Shang vessels were cast from a clay model turned against a profile
// template, so a profile of (radius, height) points really is how they were
// specified. Points are interpolated with a centripetal Catmull-Rom (no
// overshoot at tight shoulders); mark a point with a third element 'corner'
// to keep a crisp break there (a lip, a foot ring edge).

import * as THREE from 'three'
import { buildSurface } from './surface.js'

/**
 * Arc-length parametrised profile curve.
 * @param {Array<[number,number]|[number,number,'corner']>} profile (r, y) in mm, bottom → top
 * @returns {{ length:number, at(t:number): {r:number,y:number,nr:number,ny:number} }}
 */
export function profileCurve(profile) {
  // split into smooth runs at corners
  const runs = []
  let cur = []
  profile.forEach((p, i) => {
    cur.push(new THREE.Vector3(p[0], p[1], 0))
    if (p[2] === 'corner' && i > 0 && i < profile.length - 1) {
      runs.push(cur)
      cur = [new THREE.Vector3(p[0], p[1], 0)]
    }
  })
  runs.push(cur)
  const pts = []
  for (const run of runs) {
    let seg
    if (run.length < 3) seg = run
    else {
      const c = new THREE.CatmullRomCurve3(run, false, 'centripetal')
      const n = Math.max(8, run.length * 12)
      seg = c.getSpacedPoints(n)
    }
    for (const q of seg) if (!pts.length || pts[pts.length - 1].distanceTo(q) > 1e-6) pts.push(q)
  }
  const cum = [0]
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + pts[i].distanceTo(pts[i - 1]))
  const length = cum[cum.length - 1]
  return {
    isProfileCurve: true,
    length,
    points: pts,
    at(t) {
      const s = Math.min(Math.max(t, 0), 1) * length
      let lo = 0, hi = cum.length - 1
      while (hi - lo > 1) {
        const m = (lo + hi) >> 1
        if (cum[m] <= s) lo = m
        else hi = m
      }
      const f = cum[hi] > cum[lo] ? (s - cum[lo]) / (cum[hi] - cum[lo]) : 0
      const a = pts[lo], b = pts[hi]
      const dr = b.x - a.x, dy = b.y - a.y
      const l = Math.hypot(dr, dy) || 1
      // outward normal in the (r, y) half-plane
      return { r: a.x + dr * f, y: a.y + dy * f, nr: dy / l, ny: -dr / l }
    },
  }
}

/**
 * Surface function for buildSurface. u = 0.5 faces front (+Z), u increases
 * to the right seen from outside; v runs up the profile by arc length.
 */
export function latheSurface(profile, { u0 = 0, u1 = 1, v0 = 0, v1 = 1 } = {}) {
  const curve = profile.isProfileCurve ? profile : profileCurve(profile)
  return (u, v, out) => {
    const th = (u0 + (u1 - u0) * u - 0.5) * Math.PI * 2
    const p = curve.at(v0 + (v1 - v0) * v)
    const s = Math.sin(th), c = Math.cos(th)
    out.pos.set(p.r * s, p.y, p.r * c)
    out.nrm.set(p.nr * s, p.ny, p.nr * c)
  }
}

/**
 * A revolved body as a Mesh.
 * @param {object} o
 * @param {Array} o.profile           (r, y) mm, bottom → top
 * @param {THREE.Material} o.material
 * @param {string} [o.part]           userData.part for metrics
 * @param {[number,number]|{density:number}} [o.segments]
 * @param {number} [o.thickness]      wall thickness → inner wall + rims (open vessels)
 * @param {string[]} [o.rims]
 * @param {ReliefMap} [o.relief] @param {object} [o.reliefRect] @param {number|object} [o.fade]
 */
export function lathe({ profile, material, part = 'body', segments = { density: 0.5 }, thickness = 0, rims = ['v1'], relief = null, reliefRect, fade, maxVerts }) {
  const curve = profile.isProfileCurve ? profile : profileCurve(profile)
  const geo = buildSurface({
    surface: latheSurface(curve),
    segments,
    relief,
    reliefRect,
    // a full revolution meets itself at u = 0/1: no fade across that seam
    fade: fade ?? { u0: 0, u1: 0, v0: 1.5, v1: 1.5 },
    back: thickness > 0 ? { thickness, rims } : null,
    maxVerts,
  })
  const mesh = new THREE.Mesh(geo, material)
  mesh.userData.part = part
  mesh.castShadow = mesh.receiveShadow = true
  return mesh
}
