// Nezu bu — the parts kit.lathe cannot make: the LID (a shell of revolution open at the bottom and closing to
// the crown, with 1:1 relief panels on its decorated slope), a meridian path on it for the lid flanges, and the
// bud KNOB (a plain solid of revolution). All mm, Y up, front +Z.

import * as THREE from 'three'

const DEG = Math.PI / 180

/**
 * A round shell of revolution: `profile` a kit Profile (rim → crown), `bands` [{ name, s0, s1, relief?: (sector,
 * size) => ReliefMap | null, closeBottom? }] covering [0, L] in order, `sectors` [[θa, θb] deg] (default the two
 * halves centred on 0° and 180°). size = { width (developed mm at the band's widest), height (arc mm), rMax } —
 * panels are laid 1:1 from the sector's centre line (panel x = W/2 + θ·r(s)). → Group (part), inner skin `thickness`.
 */
export function roundShell(kit, { profile: P, bands, sectors = [[-90, 90], [90, 270]], thickness = 3.2, quality = 1, material, part = 'lid', fade = 1.2 }) {
  const group = new THREE.Group()
  group.userData.part = part
  const plain = []
  const mats = new Map()
  for (const band of bands) {
    sectors.forEach(([a0, b0], k) => {
      const A = a0 * DEG, B = b0 * DEG, tc = (A + B) / 2
      let rMax = 0
      for (let s = band.s0; s <= band.s1; s += 0.5) rMax = Math.max(rMax, P.at(s).r)
      const width = rMax * (B - A)
      const height = band.s1 - band.s0
      const map = band.relief ? band.relief(k, { width, height, rMax, sector: k }) : null
      const surf = (u, v, out) => {
        const t = A + u * (B - A)
        const q = P.at(band.s0 + v * height, v <= 0 ? 1 : v >= 1 ? -1 : 0)
        const sn = Math.sin(t), cs = Math.cos(t)
        out.pos.set(q.r * sn, q.y, q.r * cs)
        out.nrm.set(q.nr * sn, q.ny, q.nr * cs).normalize()
      }
      const dens = (map ? 0.9 : 0.22) * Math.sqrt(quality)
      const nu = Math.max(24, Math.ceil(width * dens))
      const nv = Math.max(3, Math.ceil(height * (map ? dens : 0.5)))
      const panelMap = map
        ? (u, v, out) => {
            const t = A + u * (B - A)
            out[0] = 0.5 + ((t - tc) * P.at(band.s0 + v * height).r) / width
          }
        : null
      const geo = kit.buildSurface({ surface: surf, segments: [nu, nv], relief: map, fade, panelMap, back: { thickness, rims: band.closeBottom ? ['v0'] : [] } })
      if (map) {
        if (!mats.has(map)) mats.set(map, { mat: new kit.PatinaMaterial({ relief: map }), geos: [] })
        mats.get(map).geos.push(geo)
      } else plain.push(geo)
    })
  }
  const add = (geos, mat, role) => {
    const g = geos.length === 1 ? geos[0] : merge(geos)
    g.computeBoundingBox(); g.computeBoundingSphere()
    const m = new THREE.Mesh(g, mat)
    m.userData.role = role
    group.add(m)
  }
  if (plain.length) add(plain, material, 'outer')
  for (const [, { mat, geos }] of mats) add(geos, mat, 'panel')
  return group
}

/** a flange path up a meridian of a shell of revolution (kit.flange's `path`): σ from s0 to s1 along the profile */
export function meridianPath(P, azimuth, s0, s1) {
  const a = azimuth * DEG, sa = Math.sin(a), ca = Math.cos(a)
  return {
    isPath: true, planar: true, kind: 'meridian', length: s1 - s0,
    frame: (sg) => {
      const q = P.at(Math.min(Math.max(s0 + sg, 0), P.length))
      const p = new THREE.Vector3(q.r * sa, q.y, q.r * ca)
      const n = new THREE.Vector3(q.nr * sa, q.ny, q.nr * ca)
      const d = new THREE.Vector3(q.tr * sa, q.ty, q.tr * ca)
      return { p, n, d, b: new THREE.Vector3().crossVectors(d, n) }
    },
  }
}

/** a plain solid of revolution from [r, y] points (bottom → top) */
export function revolveSolid(points, { segments = 48 } = {}) {
  const geo = new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), segments)
  geo.computeVertexNormals()
  return geo
}

/** merge BufferGeometries with the same attributes */
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
