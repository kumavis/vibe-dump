// The named buildings (DATA.md "Landmarks, dated"; ISSUES.md 8): ʻIolani
// Palace and the first palace on its ground, Aliʻiōlani Hale, Kawaiahaʻo and
// the Mission Houses, the hotels of Waikīkī and the rest of landmarks.json,
// each at its footprint from the year it stood finished to the year it went,
// in the town's low-polygon manner: nothing photographic, but each one known
// by its form at the near zoom (the palace by its towers and two storeys of
// lanai, the hall by its clock tower, the church by its square tower, the
// hotel by its storeys of verandas).
//
// The district's scatter (settlements.js) draws them: those whose footprint
// lies inside the district's own lots (PART + PART_GAP from its edge), with
// its material, so they fade with its year and its weight as its buildings
// do. Its lots yield to them in their years (and across the gap between two
// forms of one building, a palace and the palace that replaced it), as at a
// break: the lot's building fades out in the half year before `from`, the
// named one fades in after it and is whole in `from`, stands whole through
// `to`, fades out in the half year after, and the lot's comes back after
// that; so no ground ever carries a lot's building and a named one at once.
//
// A footprint is drawn larger than life, as the town's buildings are (E),
// about its centre and along its own long axis; a building that would then
// reach a neighbour standing in the same years is drawn smaller, down to its
// surveyed size, so no two named buildings share ground either.
//
// Each type is a kit, built in metres at its own nominal size with its long
// side along x and its front toward +z, scaled to the footprint per
// instance: its length to the footprint's, its width to the footprint's, its
// height by the same factor as its length (never squashed). A type the kits
// do not know is drawn as a hall.

import * as THREE from 'three'
import { Builder, MAT, col, indexed, Y } from './kit.js'
import { geometryPoint } from '../geo.js'

// a footprint drawn this much over life (the town's church is drawn at about
// twice its size), and never under life
const E = 1.9
// metres of footing under a kit, for the fall of its ground
const FOOT = 6
// world units per metre at life (1 unit = 100 m)
const LIFE = 0.01
// a lot keeps this far (world units) off a named building's drawn footprint
const KEEP = 0.02

/** landmarks.json, once per data set: { features } or null where there is none. */
const cache = new Map()
export function loadLandmarks(app) {
  const url = app.data.abs('landmarks.json')
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    )
  }
  return cache.get(url)
}

/** A footprint's box in the world: centre, turn about y (as THREE turns), half extents along and across (world units at life). */
function worldBox(proj, g) {
  const rings = g.type === 'Polygon' ? [g.coordinates[0]] : g.type === 'MultiPolygon' ? g.coordinates.map((p) => p[0]) : [[geometryPoint(g)]]
  const pts = rings.flat().map((c) => proj.toWorld(c))
  let cx = 0
  let cz = 0
  for (const [x, z] of pts) {
    cx += x / pts.length
    cz += z / pts.length
  }
  // (the turn that boxes it tightest, to a degree)
  let best = null
  for (let d = 0; d < 180; d++) {
    const th = (d * Math.PI) / 180
    const c = Math.cos(th)
    const s = Math.sin(th)
    let u0 = Infinity
    let u1 = -Infinity
    let v0 = Infinity
    let v1 = -Infinity
    for (const [x, z] of pts) {
      const u = (x - cx) * c + (z - cz) * s
      const v = -(x - cx) * s + (z - cz) * c
      u0 = Math.min(u0, u)
      u1 = Math.max(u1, u)
      v0 = Math.min(v0, v)
      v1 = Math.max(v1, v)
    }
    const area = (u1 - u0) * (v1 - v0)
    if (!best || area < best.area) best = { area, th, u0, u1, v0, v1 }
  }
  let { th, u0, u1, v0, v1 } = best
  if (v1 - v0 > u1 - u0) {
    ;[u0, u1, v0, v1] = [v0, v1, -u1, -u0]
    th += Math.PI / 2
  }
  const mu = (u0 + u1) / 2
  const mv = (v0 + v1) / 2
  const x = cx + mu * Math.cos(th) - mv * Math.sin(th)
  const z = cz + mu * Math.sin(th) + mv * Math.cos(th)
  // (local +x along (cos th, sin th) is THREE's turn a = −th: local x to (cos a, −sin a))
  return { x, z, a: -th, hx: (u1 - u0) / 2, hz: (v1 - v0) / 2 }
}

/** The corners of a box { x, z, a, ax, az } grown by m. */
function corners(b, m = 0) {
  const c = Math.cos(b.a)
  const s = Math.sin(b.a)
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => {
    const lx = u * (b.ax + m)
    const lz = v * (b.az + m)
    return [b.x + lx * c + lz * s, b.z - lx * s + lz * c]
  })
}

/** Whether two boxes meet (separating axes). */
export function boxesMeet(a, b, m = 0) {
  const A = corners(a, m)
  const B = corners(b)
  for (const P of [A, B]) {
    for (let i = 0; i < 2; i++) {
      const nx = -(P[i + 1][1] - P[i][1])
      const nz = P[i + 1][0] - P[i][0]
      let a0 = Infinity
      let a1 = -Infinity
      let b0 = Infinity
      let b1 = -Infinity
      for (const [x, z] of A) {
        const d = x * nx + z * nz
        a0 = Math.min(a0, d)
        a1 = Math.max(a1, d)
      }
      for (const [x, z] of B) {
        const d = x * nx + z * nz
        b0 = Math.min(b0, d)
        b1 = Math.max(b1, d)
      }
      if (a1 <= b0 || b1 <= a0) return false
    }
  }
  return true
}

/**
 * The named buildings a scatter draws: those of landmarks.json whose drawn
 * footprint keeps `inner` world units inside its edge (`edgeAt`), each with
 * its box drawn (x, z, a, ax, az), its scale, its years, and the years the
 * lots keep off its ground (keep: [from, to), a year either side, and across
 * a short gap to the next form of its group).
 */
export function namedFor(app, fc, edgeAt, inner) {
  if (!fc?.features?.length) return []
  const proj = app.data.proj
  const out = []
  for (const f of fc.features) {
    const p = f.properties || {}
    if (!f.geometry || !Number.isInteger(p.from)) continue
    const b = worldBox(proj, f.geometry)
    const to = Number.isInteger(p.to) ? p.to : Infinity
    out.push({ id: p.id, name: p.name, type: p.type, look: p.look ?? null, group: p.group ?? p.id, storeys: p.storeys ?? 2, from: p.from, to, x: b.x, z: b.z, a: b.a, hx: b.hx, hz: b.hz, e: E })
  }
  // drawn larger than life, but never onto a neighbour standing in the same years
  const sized = (n, e) => ({ x: n.x, z: n.z, a: n.a, ax: n.hx * e, az: n.hz * e })
  for (let pass = 0; pass < 24; pass++) {
    let moved = false
    for (let i = 0; i < out.length; i++) {
      for (let j = i + 1; j < out.length; j++) {
        const A = out[i]
        const B = out[j]
        if (A.from > B.to || B.from > A.to) continue
        if (!boxesMeet(sized(A, A.e), sized(B, B.e), KEEP)) continue
        if (A.e <= 1 && B.e <= 1) continue
        A.e = Math.max(1, A.e * 0.92)
        B.e = Math.max(1, B.e * 0.92)
        moved = true
      }
    }
    if (!moved) break
  }
  for (const n of out) {
    n.ax = n.hx * n.e
    n.az = n.hz * n.e
    n.keep = [n.from, n.to + 1]
  }
  // (one building's forms keep the lots off across the gap between them)
  for (const n of out) {
    for (const m of out) {
      if (m === n || m.group !== n.group || m.from < n.to) continue
      if (m.from - n.to <= 10 && boxesMeet(n, m)) n.keep[1] = Math.max(n.keep[1], m.from)
    }
  }
  return out.filter((n) => corners(n).every(([x, z]) => edgeAt(x, z) >= inner))
}

/**
 * Whether a lot's footprint (centre, half extents along its own axes, turned
 * by a) would stand on a named building's ground in `year`: 2 if it would,
 * 1 if it would in some other year, 0 if never.
 */
export function namedTest(named, x, z, ax, az, a, year) {
  let dep = 0
  const lot = { x, z, a, ax, az }
  for (const n of named) {
    if (Math.hypot(x - n.x, z - n.z) > Math.hypot(ax, az) + Math.hypot(n.ax, n.az) + KEEP) continue
    if (!boxesMeet(n, lot, KEEP)) continue
    dep = 1
    if (year >= n.keep[0] && year < n.keep[1]) return 2
  }
  return dep
}

/** The breaks the named buildings put in the scatter's years: where a lot must go or may come back. */
export function namedBreaks(named) {
  const out = []
  for (const n of named) {
    out.push(n.keep[0])
    if (Number.isFinite(n.keep[1])) out.push(n.keep[1])
  }
  return out
}

/** Whether `kind` (a type) stands named in `year` among them: the scatter's own church of 1842 gives way to a named one. */
export const namedStands = (named, type, year) => named.some((n) => n.type === type && n.from <= year && year <= n.to)

// --- the kits --------------------------------------------------------------------

const C = {
  coral: '#d2c8b0',
  limewash: '#dcd6c6',
  white: '#e2ddd0',
  cream: '#d3c6a4',
  sand: '#c7b38c',
  stone: '#9c968b',
  basalt: '#6f6b66',
  brick: '#97684f',
  pink: '#c9988f',
  roofSlate: '#5c5c5a',
  roofIron: '#6e706c',
  roofTile: '#9a5b45',
  roofGreen: '#6f7a6a',
  wood: '#8a7b66',
  dark: '#4b4743',
  plinth: '#77706a',
  gold: '#a8894a',
  bronze: '#3f3a32',
}

/** A hipped roof over L × W (L ≥ W) from y, `rise` high, eaves o out. */
function hip(B, L, W, y, rise, o, c, { x = 0, z = 0 } = {}) {
  const X = L / 2 + o
  const Z = W / 2 + o
  const rx = Math.max(0, (L - W) / 2)
  const E_ = (sx, sz) => [x + sx * X, y, z + sz * Z]
  const R = (sx) => [x + sx * rx, y + rise, z]
  const shade = c.map((v) => v * 0.84)
  B.quad(E_(-1, -1), R(-1), R(1), E_(1, -1), c, MAT.roof)
  B.quad(E_(1, 1), R(1), R(-1), E_(-1, 1), shade, MAT.roof)
  B.tri(E_(-1, 1), R(-1), E_(-1, -1), c.map((v) => v * 0.92), MAT.roof)
  B.tri(E_(1, -1), R(1), E_(1, 1), c.map((v) => v * 0.92), MAT.roof)
}

/** A gable roof along x over L × W from y, `rise` high, its gable ends in the wall's colour. */
function gableX(B, L, W, y, rise, o, roofC, wallC, wallMat = MAT.masonry, { x = 0, z = 0 } = {}) {
  const ox = L / 2 + o * 0.6
  const oz = W / 2 + o
  const s = rise / (W / 2)
  const ye = y - s * o
  const P = (px, py, pz) => [x + px, py, z + pz]
  B.quad(P(-ox, ye, -oz), P(-ox, y + rise, 0), P(ox, y + rise, 0), P(ox, ye, -oz), roofC, MAT.roof)
  B.quad(P(ox, ye, oz), P(ox, y + rise, 0), P(-ox, y + rise, 0), P(-ox, ye, oz), roofC.map((v) => v * 0.84), MAT.roof)
  B.tri(P(-L / 2, y, -W / 2), P(-L / 2, y, W / 2), P(-L / 2, y + rise, 0), wallC, wallMat)
  B.tri(P(L / 2, y, W / 2), P(L / 2, y, -W / 2), P(L / 2, y + rise, 0), wallC, wallMat)
}

/** A pyramid cap on a square of side a at height y. */
function pyramid(B, a, y, h, c, x = 0, z = 0) {
  const k = a / 2
  const top = [x, y + h, z]
  const E_ = (sx, sz) => [x + sx * k, y, z + sz * k]
  B.tri(E_(-1, -1), top, E_(1, -1), c, MAT.roof)
  B.tri(E_(1, 1), top, E_(-1, 1), c.map((v) => v * 0.84), MAT.roof)
  B.tri(E_(-1, 1), top, E_(-1, -1), c.map((v) => v * 0.92), MAT.roof)
  B.tri(E_(1, -1), top, E_(1, 1), c.map((v) => v * 0.92), MAT.roof)
}

/** Posts along a rectangle's edge (an L × W ring at y0..y1), every `step` metres, standing `inset` in from it. */
function posts(B, L, W, y0, y1, step, c, { inset = 0.5, size = 0.6, x = 0, z = 0, sides = [1, 1, 1, 1] } = {}) {
  const hx = L / 2 - inset
  const hz = W / 2 - inset
  const run = (ax, az, bx, bz) => {
    const n = Math.max(1, Math.round(Math.hypot(bx - ax, bz - az) / step))
    for (let k = 0; k <= n; k++) B.box(x + ax + ((bx - ax) * k) / n, y0, z + az + ((bz - az) * k) / n, size, y1 - y0, size, c, MAT.wood)
  }
  if (sides[0]) run(-hx, hz, hx, hz)
  if (sides[1]) run(-hx, -hz, hx, -hz)
  if (sides[2]) run(-hx, -hz + 1, -hx, hz - 1)
  if (sides[3]) run(hx, -hz + 1, hx, hz - 1)
}

/**
 * ʻIolani Palace: two storeys over a raised basement, lanai on both storeys
 * all round between the towers, a square tower at each corner and a taller
 * one in the middle of the front and of the back, each under a steep cap.
 */
function palace(rand) {
  const B = new Builder()
  const L = 43
  const W = 31
  const wall = col(C.sand, 0.03, rand)
  const trim = col(C.cream, 0.03, rand)
  const cap = col(C.roofSlate, 0.05, rand)
  const post = col(C.limewash, 0.03, rand)
  B.box(0, -FOOT, 0, L + 1.2, FOOT + 2.2, W + 1.2, col(C.plinth, 0.05, rand), MAT.stone)
  // the house within its lanai
  B.box(0, 2.2, 0, L - 9, 14.6, W - 9, wall, MAT.windows)
  // the lanai floors and roofs, with their posts
  B.box(0, 8.6, 0, L - 0.4, 0.5, W - 0.4, trim, MAT.masonry)
  B.box(0, 16.8, 0, L + 0.4, 0.7, W + 0.4, trim, MAT.masonry)
  posts(B, L - 0.4, W - 0.4, 2.2, 8.6, 3.2, post)
  posts(B, L - 0.4, W - 0.4, 9.1, 16.8, 3.2, post)
  // the roof over the middle, low behind a parapet
  hip(B, L - 9, W - 9, 17.5, 2.6, 0.3, cap)
  // the corner towers, a step proud of the lanai, and the middle towers front and back
  for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    const x = sx * (L / 2 - 3.2)
    const z = sz * (W / 2 - 3.2)
    B.box(x, 2.15, z, 7.2, 17.6, 7.2, wall, MAT.masonry)
    pyramid(B, 7.6, 19.75, 4.2, cap, x, z)
  }
  for (const sz of [-1, 1]) {
    const z = sz * (W / 2 - 3.6)
    B.box(0, 2.1, z, 9.6, 21.4, 8.0, wall, MAT.masonry)
    pyramid(B, 10.0, 23.5, 6.0, cap, 0, z)
  }
  return B
}

/**
 * A hall: a long block of `storeys`, a tower over its middle front. `look`:
 * italianate (Aliʻiōlani Hale: two storeys, end pavilions, a clock tower and
 * its cupola), mission (Honolulu Hale: a tile roof and a tall tower), stone
 * (Hawaiian Hall: dark stone under a steep roof), barracks (ʻIolani
 * Barracks: one storey, crenellated, a gate tower).
 */
function hall(rand, look, storeys) {
  const B = new Builder()
  const L = 60
  const W = 30
  const st = Math.max(1, storeys)
  const h = st * 4.6
  const wallC = { italianate: C.cream, mission: C.limewash, stone: C.basalt, barracks: C.coral }[look] ?? C.cream
  const wall = col(wallC, 0.03, rand)
  const roofC = col({ italianate: C.roofIron, mission: C.roofTile, stone: C.roofSlate, barracks: C.coral }[look] ?? C.roofIron, 0.05, rand)
  B.box(0, -FOOT, 0, L + 1, FOOT + 1, W + 1, col(C.plinth, 0.05, rand), MAT.stone)
  B.box(0, 1, 0, L, h, W, wall, MAT.windows)
  if (look === 'barracks') {
    for (let k = -5; k <= 5; k++) B.box((k * L) / 11.5, 1 + h, W / 2 - 0.6, 2.4, 1.4, 1.4, wall, MAT.masonry)
    B.box(0, 1 + h, 0, L - 1, 0.4, W - 3, roofC.map((v) => v * 0.9), MAT.masonry)
    B.box(0, 0.95, W / 2 - 3, 10, h + 4.1, 7, wall, MAT.masonry)
    for (const sx of [-1, 1]) B.box(sx * 4.2, 1 + h + 4, W / 2 - 3, 1.5, 1.6, 6.4, wall, MAT.masonry)
    return B
  }
  // the end pavilions, a step proud and a little higher
  for (const sx of [-1, 1]) B.box(sx * (L / 2 - 5), 0.95, 0, 10.4, h + 1.2, W + 1.2, wall.map((c) => c * 0.96), MAT.windows)
  if (look === 'stone') gableX(B, L - 20, W, 1 + h, 7, 0.6, roofC, wall, MAT.masonry)
  else if (look === 'mission') hip(B, L - 20, W, 1 + h, 4, 0.8, roofC)
  else B.box(0, 1 + h, 0, L - 20, 1.0, W, wall.map((c) => c * 0.9), MAT.masonry)
  for (const sx of [-1, 1]) {
    if (look === 'mission') hip(B, 10.4, W + 1.2, 2.15 + h, 3, 0.6, roofC, { x: sx * (L / 2 - 5) })
    else B.box(sx * (L / 2 - 5), 2.15 + h, 0, 11, 0.8, W + 1.8, wall.map((c) => c * 0.88), MAT.masonry)
  }
  // the tower over the front's middle
  const th = look === 'mission' ? h + 14 : look === 'stone' ? h + 4 : h + 11
  B.box(0, 0.9, W / 2 - 4, 9, th + 0.1, 9, wall, MAT.masonry)
  if (look === 'mission') hip(B, 9, 9, 1 + th, 4, 0.6, roofC, { z: W / 2 - 4 })
  else if (look === 'stone') pyramid(B, 9.4, 1 + th, 6, roofC, 0, W / 2 - 4)
  else {
    B.box(0, 1 + th, W / 2 - 4, 6, 4, 6, wall.map((c) => c * 0.95), MAT.masonry)
    pyramid(B, 6.6, 5 + th, 3.5, col(C.roofGreen, 0.05, rand), 0, W / 2 - 4)
  }
  return B
}

/** A church: coral (Kawaiahaʻo: a gable nave, a square tower at its front with a parapet) or gothic (St. Andrew's: grey stone, a steep roof, a buttressed tower). Its length along x, the tower at +x. */
function church(rand, look) {
  const B = new Builder()
  const L = 44
  const W = 24
  const gothic = look === 'gothic'
  const wall = col(gothic ? C.stone : C.coral, 0.04, rand)
  const roof = col(gothic ? C.roofSlate : C.roofIron, 0.06, rand)
  B.box(0, -FOOT, 0, L + 1, FOOT + 0.8, W + 1, col(C.plinth, 0.05, rand), MAT.stone)
  B.box(-2, 0.8, 0, L - 4, gothic ? 12 : 9.2, W, wall, MAT.masonry)
  gableX(B, L - 4, W, gothic ? 12.8 : 10, gothic ? 10 : 6.5, 0.6, roof, wall, MAT.masonry, { x: -2 })
  if (gothic) for (let k = -3; k <= 3; k++) for (const sz of [-1, 1]) B.box(-2 + k * 5.6, 0.75, sz * (W / 2 + 0.7), 1.2, 9, 1.4, wall.map((c) => c * 0.92), MAT.masonry)
  const tx = L / 2 - 3.6
  const tH = gothic ? 24 : 22
  B.box(tx, 0.75, 0, 8.4, tH + 0.05, 9, wall, MAT.masonry)
  B.box(tx, tH + 0.8, 0, 9, 0.8, 9.6, wall.map((c) => c * 0.88), MAT.masonry)
  for (const [sx, sz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) B.box(tx + sx * 3.5, tH + 1.6, sz * 4, 1.2, gothic ? 3.4 : 1.4, 1.2, wall, MAT.masonry)
  // the door on the tower's front
  B.box(tx + 4.35, 0.8, 0, 0.3, 4, 2.2, col(C.dark, 0), MAT.plain)
  return B
}

/** A house: lanai (Hale Aliʻi: one storey, a lanai all round under a hipped roof) or mission (a small house of two storeys under a gable). */
function house(rand, look, storeys) {
  const B = new Builder()
  if (look === 'lanai') {
    const L = 30
    const W = 18
    B.box(0, -FOOT, 0, L + 0.6, FOOT + 1.2, W + 0.6, col(C.plinth, 0.05, rand), MAT.stone)
    B.box(0, 1.2, 0, L - 6, 4.6, W - 6, col(C.coral, 0.03, rand), MAT.masonry)
    posts(B, L, W, 1.2, 5.0, 2.6, col(C.wood, 0.05, rand), { size: 0.4 })
    hip(B, L, W, 5.0, 4.0, 0.6, col(C.roofIron, 0.06, rand))
    return B
  }
  const L = 12
  const W = 8
  const h = Math.max(1, storeys) * 3.2
  const wall = col(rand() < 0.5 ? C.white : C.coral, 0.04, rand)
  B.box(0, -FOOT, 0, L + 0.4, FOOT + 0.6, W + 0.4, col(C.plinth, 0.05, rand), MAT.stone)
  B.box(0, 0.6, 0, L, h, W, wall, MAT.clap)
  gableX(B, L, W, 0.6 + h, 3.4, 0.4, col(C.roofIron, 0.06, rand), wall, MAT.clap)
  return B
}

/** Washington Place: a square house of two storeys, colonnaded lanai on three sides on both floors, a low hipped roof. */
function villa(rand) {
  const B = new Builder()
  const L = 34
  const W = 26
  const wall = col(C.white, 0.03, rand)
  B.box(0, -FOOT, 0, L + 0.6, FOOT + 1, W + 0.6, col(C.plinth, 0.05, rand), MAT.stone)
  B.box(0, 1, -1.5, L - 8, 8.6, W - 9, wall, MAT.clap)
  B.box(0, 5.0, 0, L - 0.4, 0.4, W - 0.4, wall.map((c) => c * 0.93), MAT.masonry)
  posts(B, L - 0.4, W - 0.4, 1, 9.3, 3, col(C.white, 0.02, rand), { size: 0.7, sides: [1, 0, 1, 1] })
  hip(B, L, W, 9.3, 4.2, 0.8, col(C.roofSlate, 0.05, rand))
  return B
}

/** The statue on its pedestal: a stepped base, a pedestal, the figure gilded and dark. */
function statue(rand) {
  const B = new Builder()
  B.box(0, -FOOT, 0, 5, FOOT + 0.6, 5, col(C.stone, 0.05, rand), MAT.stone)
  B.box(0, 0.6, 0, 3.4, 3.4, 3.4, col(C.limewash, 0.03, rand), MAT.masonry)
  B.cyl([0, 4, 0], [0, 6.6, 0], 0.55, 0.45, col(C.gold, 0.05, rand), MAT.plain, 6)
  B.cyl([0, 4, 0], [0, 5.5, 0], 0.7, 0.3, col(C.bronze, 0.05, rand), MAT.plain, 6)
  B.cyl([0, 6.6, 0], [0, 7.3, 0], 0.3, 0.3, col(C.bronze, 0.05, rand), MAT.plain, 6)
  B.cyl([0.3, 6.2, 0], [1.4, 7.6, 0], 0.15, 0.12, col(C.bronze, 0.05, rand), MAT.plain, 4)
  B.cyl([1.4, 5.2, 0], [1.4, 9.4, 0], 0.07, 0.07, col(C.gold, 0.05, rand), MAT.plain, 4)
  return B
}

/** A hotel of `storeys`: colonial (the Moana: white, verandas the length of each storey, a cupola) or moorish (the Royal Hawaiian: pink, a tall middle tower with a cupola, towers at the ends). */
function hotel(rand, look, storeys) {
  const B = new Builder()
  const L = 70
  const W = 22
  const st = Math.max(2, storeys)
  const h = st * 3.6
  const moor = look === 'moorish'
  const wall = col(moor ? C.pink : C.white, 0.03, rand)
  const roof = col(moor ? C.roofTile : C.roofSlate, 0.05, rand)
  B.box(0, -FOOT, 0, L + 1, FOOT + 1, W + 1, col(C.plinth, 0.05, rand), MAT.stone)
  B.box(0, 1, 0, L - 2, h, W - 6, wall, MAT.windows)
  if (!moor) {
    // the verandas along the front, a floor at each storey on posts
    for (let k = 1; k < st; k++) B.box(0, 1 + k * 3.6 - 0.3, (W - 6) / 2 + 1.5, L - 0.4, 0.3, 3.2, wall.map((c) => c * 0.9), MAT.masonry)
    posts(B, L - 0.4, W, 1, 1 + h, 3.4, wall, { size: 0.35, sides: [1, 0, 0, 0] })
    hip(B, L, W, 1 + h, 3.6, 0.6, roof)
    B.box(0, 0.9 + h + 2.4, 0, 6, 4.2, 6, wall, MAT.masonry)
    pyramid(B, 6.4, 5.1 + h + 2.4, 3, roof)
  } else {
    hip(B, L - 2, W - 6, 1 + h, 3.2, 0.8, roof)
    B.box(0, 0.95, 0, 12, h + 6.05, 12, wall, MAT.windows)
    B.box(0, 7 + h, 0, 6, 5, 6, wall, MAT.masonry)
    pyramid(B, 6.4, 12 + h, 4, roof)
    for (const sx of [-1, 1]) {
      B.box(sx * (L / 2 - 5), 0.9, 0, 9, h + 2.1, W, wall.map((c) => c * 0.97), MAT.windows)
      hip(B, 9, W, 3 + h, 2.6, 0.5, roof, { x: sx * (L / 2 - 5) })
    }
  }
  return B
}

/** The harbour's clock tower: a square shaft, the clock stage, a pyramid and a mast. */
function tower(rand) {
  const B = new Builder()
  const wall = col(C.cream, 0.03, rand)
  B.box(0, -FOOT, 0, 14, FOOT + 0.5, 14, col(C.plinth, 0.05, rand), MAT.stone)
  B.box(0, 0.5, 0, 12, 40, 12, wall, MAT.windows)
  B.box(0, 40.5, 0, 13, 6, 13, wall.map((c) => c * 0.93), MAT.masonry)
  pyramid(B, 13, 46.5, 7, col(C.roofGreen, 0.05, rand))
  B.cyl([0, 53.5, 0], [0, 60, 0], 0.25, 0.15, col(C.dark, 0), MAT.plain, 4)
  return B
}

/** A block of `storeys`: plain (the Post Office: concrete, a cornice) or theatre (a tall front over the street and a blade sign). */
function block(rand, look, storeys) {
  const B = new Builder()
  const L = 24
  const W = 18
  const h = Math.max(1, storeys) * 4.4
  const wall = col(look === 'theatre' ? C.cream : C.limewash, 0.04, rand)
  B.box(0, -FOOT, 0, L + 0.6, FOOT + 0.8, W + 0.6, col(C.plinth, 0.05, rand), MAT.stone)
  B.box(0, 0.8, 0, L, h, W, wall, MAT.windows)
  B.box(0, 0.8 + h, 0, L + 0.6, 0.5, W + 0.6, wall.map((c) => c * 0.86), MAT.masonry)
  if (look === 'theatre') {
    B.box(0, 0.75, W / 2 - 1.8, L + 0.2, h + 5, 4, wall.map((c) => c * 0.96), MAT.masonry)
    B.box(0, 0.8 + h - 2, W / 2 + 0.9, 1.0, 9, 2.4, col(C.brick, 0.04, rand), MAT.plain)
  }
  return B
}

const KITS = { palace, hall, church, house, villa, statue, hotel, tower, block }

/** The kit for a named building's type, look and storeys (a type the kits do not know as a hall), with its size: built once per key. */
function kitOf(kits, rand, n) {
  const make = KITS[n.type] ?? hall
  const key = `${KITS[n.type] ? n.type : 'hall'}:${n.look}:${n.storeys}`
  if (!kits.has(key)) {
    const g = indexed(make(rand, n.look, n.storeys).geometry())
    g.computeBoundingBox()
    const bb = g.boundingBox
    kits.set(key, { key, geometry: g, L: bb.max.x - bb.min.x, W: bb.max.z - bb.min.z, cx: (bb.max.x + bb.min.x) / 2, cz: (bb.max.z + bb.min.z) / 2, top: bb.max.y })
  }
  return kits.get(key)
}

/**
 * The meshes of the named buildings of a scatter, one instanced mesh per kit
 * with the scatter's material (its year, weight and shadows), standing on
 * the ground `groundAt(n)` gives (metres: the highest under the footprint in
 * its first year). Each fades in over the half year before its `from` and
 * out over the half year after its `to`, after the lots there have gone and
 * before they come back (namedFor's keep; settlements.js FADE), so it never
 * fades over a lot's building.
 */
export function namedMeshes(named, material, groundAt, rand, lift) {
  const kits = new Map()
  const byKit = new Map()
  for (const n of named) {
    const kit = kitOf(kits, rand, n)
    if (!byKit.has(kit.key)) byKit.set(kit.key, [])
    byKit.get(kit.key).push(n)
  }
  const meshes = []
  const m4 = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const up = new THREE.Vector3(0, 1, 0)
  const pos = new THREE.Vector3()
  const scl = new THREE.Vector3()
  for (const [key, list] of byKit) {
    const kit = kits.get(key)
    const mesh = new THREE.InstancedMesh(kit.geometry, material, list.length)
    mesh.name = `named ${key}`
    mesh.frustumCulled = false
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(list.length * 3).fill(1), 3)
    const aSpan = new THREE.InstancedBufferAttribute(new Float32Array(list.length * 4), 4)
    const aStretch = new THREE.InstancedBufferAttribute(new Float32Array(list.length).fill(1), 1)
    kit.geometry.setAttribute('aSpan', aSpan)
    kit.geometry.setAttribute('aStretch', aStretch)
    list.forEach((n, i) => {
      // its length and width to the footprint drawn, its height with its length (world units per metre)
      const sx = (2 * n.ax) / kit.L
      const sz = (2 * n.az) / kit.W
      const sy = Math.min(sx, LIFE * n.e * 1.15)
      n.top = groundAt(n)
      n.y = Y(n.top) + lift
      n.height = kit.top * sy
      q.setFromAxisAngle(up, n.a)
      // (the kit's own middle on the footprint's)
      const c = Math.cos(n.a)
      const s = Math.sin(n.a)
      pos.set(n.x - (kit.cx * sx * c + kit.cz * sz * s), n.y, n.z - (-kit.cx * sx * s + kit.cz * sz * c))
      scl.set(sx, sy, sz)
      m4.compose(pos, q, scl)
      m4.toArray(mesh.instanceMatrix.array, i * 16)
      aSpan.array.set(namedSpan(n), i * 4)
    })
    meshes.push(mesh)
  }
  return { meshes, kits }
}

/** A named building's fade (in from, in to, out from, out to): in the half year before `from` and out in the half year after `to`, inside the lots' own fades at those breaks. */
export function namedSpan(n) {
  return Number.isFinite(n.to) ? [n.from - 0.47, n.from - 0.1, n.to + 0.1, n.to + 0.47] : [n.from - 0.47, n.from - 0.1, 1e5, 1e5 + 1]
}

/** How far a named building has faded in at year y (as the shader has it). */
export function namedWeight(n, y) {
  const sm = (a, b, x) => {
    const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)
  }
  const s = namedSpan(n)
  return sm(s[0], s[1], y) * (1 - sm(s[2], s[3], y))
}
