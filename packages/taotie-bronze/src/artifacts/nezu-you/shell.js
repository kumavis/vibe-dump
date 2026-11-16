// Nezu you — the two surfaces kit.lathe cannot make: the LID (an oval shell of revolution that is open at
// the bottom and closes to an apex) and the BAIL (a flat strap bent over the lid). Both are buildSurface
// patches with 1:1 ("true") relief panels and an inner skin. All mm, Y up, front +Z.

import * as THREE from 'three'
import { bailFrame, bailHalfLength, BAIL } from './form.js'

const TAU = Math.PI * 2

/** developed arc per unit radius on the oval x = r sin t, z = r cos t / k (signed, from t = 0) */
export function ellipseArc(k) {
  if (k === 1) return (t) => t
  const N = 720, h = TAU / N, tab = new Float64Array(N + 1)
  const f = (t) => Math.sqrt(Math.cos(t) ** 2 + Math.sin(t) ** 2 / (k * k))
  for (let i = 1; i <= N; i++) tab[i] = tab[i - 1] + (h / 6) * (f((i - 1) * h) + 4 * f((i - 0.5) * h) + f(i * h))
  const per = tab[N]
  return (t) => {
    const w = Math.floor(t / TAU), u = (t - w * TAU) / h
    const i = Math.min(N - 1, Math.floor(u)), fr = u - i
    return w * per + tab[i] + (tab[i + 1] - tab[i]) * fr
  }
}

/**
 * An oval shell of revolution (the lid): `profile` a kit Profile (bottom → apex), `oval` plan ratio,
 * `bands` [{ s0, s1, relief?: (sector, size) => ReliefMap | null, density }] covering [0, L] in order,
 * `sectors` [[θa, θb] deg] (default front / back halves centred on 0 and 180).
 * size = { width (developed mm at the widest), height (arc mm), rAt(yArc), arcAt(θ) } for authoring 1:1.
 * → Group of meshes (one per relief map + one plain), inner skin `thickness` mm, the bottom rim closed.
 */
export function ovalShell(kit, { profile: P, oval, bands, sectors = [[-90, 90], [90, 270]], thickness = 3.5, quality = 1, material, part = 'lid', fade = 1.2 }) {
  const arc = ellipseArc(oval)
  const DEG = Math.PI / 180
  const group = new THREE.Group()
  group.userData.part = part
  const plainGeos = []
  const mats = new Map()
  const sizes = {}
  for (const band of bands) {
    sectors.forEach(([a0, b0], k) => {
      const A = a0 * DEG, B = b0 * DEG, tc = (A + B) / 2
      let rMax = 0
      for (let s = band.s0; s <= band.s1; s += 0.5) rMax = Math.max(rMax, P.at(s).r)
      const width = rMax * (arc(B) - arc(A))
      const height = band.s1 - band.s0
      const size = { width, height, rMax, rAt: (yA) => P.at(band.s0 + yA).r, sector: k }
      sizes[(band.name || 'band') + '#' + k] = size
      const map = band.relief ? band.relief(k, size) : null
      const surf = (u, v, out) => {
        const t = A + u * (B - A)
        const s = band.s0 + v * (band.s1 - band.s0)
        const q = P.at(s, v <= 0 ? 1 : v >= 1 ? -1 : 0)
        const sn = Math.sin(t), cs = Math.cos(t)
        out.pos.set(q.r * sn, q.y, (q.r * cs) / oval)
        out.nrm.set(q.nr * sn, q.ny, q.nr * cs * oval).normalize()
      }
      const dens = (map ? band.density ?? 0.95 : 0.25) * Math.sqrt(quality)
      const nu = Math.max(24, Math.ceil((width * dens) / (map ? 1 : 1)))
      const nv = Math.max(4, Math.ceil(height * (map ? dens : 0.6)))
      const panelMap = map
        ? (u, v, out) => {
            const t = A + u * (B - A)
            const s = band.s0 + v * (band.s1 - band.s0)
            out[0] = 0.5 + ((arc(t) - arc(tc)) * P.at(s).r) / width
          }
        : null
      const geo = kit.buildSurface({
        surface: surf, segments: [nu, nv], relief: map, fade, panelMap,
        back: { thickness, rims: band.closeBottom ? ['v0'] : [] },
      })
      if (map) {
        if (!mats.has(map)) mats.set(map, { mat: new kit.PatinaMaterial({ relief: map }), geos: [] })
        mats.get(map).geos.push(geo)
      } else plainGeos.push(geo)
    })
  }
  const add = (geos, mat, role) => {
    const g = geos.length === 1 ? geos[0] : merge(geos)
    g.computeBoundingBox(); g.computeBoundingSphere()
    const m = new THREE.Mesh(g, mat)
    m.userData.role = role
    m.castShadow = m.receiveShadow = true
    group.add(m)
  }
  if (plainGeos.length) add(plainGeos, material, 'outer')
  for (const [, { mat, geos }] of mats) add(geos, mat, 'panel')
  group.userData.sizes = sizes
  return group
}

/** merge non-indexed/indexed BufferGeometries with the same attributes (position, normal, tangent, uv) */
function merge(geos) {
  const names = Object.keys(geos[0].attributes).filter((n) => geos.every((g) => g.attributes[n]))
  let nV = 0, nI = 0
  for (const g of geos) { nV += g.attributes.position.count; nI += g.index ? g.index.count : g.attributes.position.count }
  const out = new THREE.BufferGeometry()
  for (const n of names) {
    const it = geos[0].attributes[n].itemSize
    const arr = new Float32Array(nV * it)
    let o = 0
    for (const g of geos) { arr.set(g.attributes[n].array, o); o += g.attributes[n].array.length }
    out.setAttribute(n, new THREE.BufferAttribute(arr, it))
  }
  const idx = new Uint32Array(nI)
  let o = 0, base = 0
  for (const g of geos) {
    const c = g.attributes.position.count
    if (g.index) for (let i = 0; i < g.index.count; i++) idx[o++] = g.index.array[i] + base
    else for (let i = 0; i < c; i++) idx[o++] = i + base
    base += c
  }
  out.setIndex(new THREE.BufferAttribute(idx, 1))
  return out
}

/**
 * The bail: one strap, built as two halves (front leg + half the arch, and its mirror at the back) that meet
 * at the crown. `relief` (the outer face, panel width = BAIL.width, height = the half length, y from the
 * lower end to the crown) is shared by both halves. Inner skin BAIL.thick.
 */
export function bailStrap(kit, { relief, quality = 1, material }) {
  const L = bailHalfLength()
  const W = BAIL.width, T = BAIL.thick
  const group = new THREE.Group()
  group.userData.part = 'handles'
  const mat = relief ? new kit.PatinaMaterial({ relief }) : material
  for (const side of [1, -1]) {
    const surf = (u, v, out) => {
      const f = bailFrame(v * L)
      // outer face: centre line + T/2 along the outward normal; u runs left → right seen from outside
      const x = (u - 0.5) * W * side
      out.pos.set(x, f.p[0] + (f.n[0] * T) / 2, side * (f.p[1] + (f.n[1] * T) / 2))
      out.nrm.set(0, f.n[0], side * f.n[1])
    }
    const geo = kit.buildSurface({
      surface: surf, segments: [Math.ceil(W * 1.1 * Math.sqrt(quality)), Math.ceil(L * 1.0 * Math.sqrt(quality))],
      relief, fade: { u0: 0.6, u1: 0.6, v0: 0, v1: 0 }, back: { thickness: T, rims: ['u0', 'u1', 'v0'] },
    })
    const m = new THREE.Mesh(geo, mat)
    m.userData.part = 'handles'
    m.castShadow = m.receiveShadow = true
    group.add(m)
  }
  return group
}
