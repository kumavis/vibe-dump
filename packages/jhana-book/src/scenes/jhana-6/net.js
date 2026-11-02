// net.js — the paper lattice of jhana-6 (Indra's net) and its graph of jewels.
//
// Pure geometry + paper mechanisms (no canvas, no DOM), so it can be posed in
// Node and checked for collisions.
//
// THE FOLDS
// • Three nested V-folds toward 'far' (apex on the spine, glue lines running
//   out and back) stand one behind the other: low and wide in front, taller
//   and narrower behind, so from the reader's seat the nets rise in tiers.
//   gamma = π/2 stands every crease upright when open, so each panel is a
//   vertical card over its own glue line; the glue lines are nested (the front
//   V has the widest alpha), so open panels never cross. As the book closes a
//   'far' crease leans forward by atan(tan α · cos θ/2) — the front V (largest
//   α) leans most — so the creases fan apart, never into each other, and each
//   one lies flat L·sin α in front of its apex, inside the page.
// • Each panel is a quarter ellipse (foot on the glue line, curving up to the
//   crease top), so a V reads from the front as a dome. It is cut into Voronoi
//   cells, leaving veins like a dragonfly's wing; both panels share one cut, so
//   the pattern is mirrored about the crease as if cut from the folded sheet.
//   A jewel sits on every vein junction (each joins three veins, so each jewel
//   has two or three neighbours), and one on each dome's crest.
// • A needle-thin V-fold toward 'near' stands at the back: a short glue edge
//   (z1 = 0.09) makes it a spire. Its crease tilts back as the book closes,
//   away from the far V's in front of it. Its crown is the brightest jewel.
// • A pair of flaps (veined fronds) stands at the outer edges of the pages,
//   hinged on lines running across the page (alpha = π/2) so they rise facing
//   the reader. A flap turns about its own hinge line, so every point keeps its
//   distance from the spine: they can't reach the nets. lift(θ) is ours: 0 at
//   θ = 0, the leaf flat and inside the page.

import * as THREE from 'three'

const HALF_PI = Math.PI / 2

// z: apex · alpha: glue angle from the spine · L: height (crease) · w: reach
// along the glue line · cells: Voronoi cells per panel
export const VFOLDS = [
  { z: 0.06, alpha: 1.18, L: 0.44, w: 0.64, cells: 7, tone: 'teal' },
  { z: -0.1, alpha: 0.95, L: 0.62, w: 0.58, cells: 7, tone: 'violet' },
  { z: -0.27, alpha: 0.68, L: 0.8, w: 0.5, cells: 7, tone: 'aqua' },
]
export const SPIRE = { z: -0.5, alpha: 0.22, L: 0.88, w: 0.09 }
// x: hinge centre's distance from the spine · z: hinge line · reach: leaf
// height · half: half its width · lean: lift when open (radians)
export const LEAVES = [{ x: 0.74, z: 0.22, reach: 0.33, half: 0.085, lean: 1.3, cells: 5 }]
export const STRUT = 0.012 // the lattice
export const RIM = 0.016 // the outline

// ---- 2D helpers (points are [s, t]) ----------------------------------------------

// Clip a convex polygon to the half-plane n·p ≤ c.
function clip(poly, ns, nt, c) {
  const out = []
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i]
    const q = poly[(i + 1) % poly.length]
    const dp = ns * p[0] + nt * p[1] - c
    const dq = ns * q[0] + nt * q[1] - c
    if (dp <= 0) out.push(p)
    if (dp * dq < 0) {
      const k = dp / (dp - dq)
      out.push([p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k])
    }
  }
  return out
}
function area(poly) {
  let A = 0
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i]
    const q = poly[(i + 1) % poly.length]
    A += p[0] * q[1] - q[0] * p[1]
  }
  return A / 2
}

// Cut a convex outline into Voronoi cells around `seeds` — the veins of a leaf,
// a dragonfly's wing. Every vein junction joins exactly three veins, so each
// jewel on a junction has two or three neighbours.
//   outline: convex polygon [[s, t], …]; inset[i]: how far the hole edge stays
//   from outline edge i (the rim); veins are `strut` wide.
// Returns { holes, vertices: [{ s, t }] (interior junctions), edges: [[i, j]] }.
export function voronoiCut(outline, inset, seeds, strut = STRUT) {
  const holes = []
  const raw = []
  // inward normal of each outline edge (the outline's winding may be either)
  const sign = area(outline) > 0 ? 1 : -1
  const edgesOut = outline.map((p, i) => {
    const q = outline[(i + 1) % outline.length]
    const ds = q[0] - p[0]
    const dt = q[1] - p[1]
    const l = Math.hypot(ds, dt)
    // outward normal (for CCW: (dt, −ds)/l)
    const ns = (sign * dt) / l
    const nt = (-sign * ds) / l
    return { ns, nt, c: ns * p[0] + nt * p[1] }
  })
  for (let i = 0; i < seeds.length; i++) {
    let cell = outline.map((p) => [p[0], p[1]])
    let hole = outline.map((p) => [p[0], p[1]])
    edgesOut.forEach((e, k) => {
      hole = clip(hole, e.ns, e.nt, e.c - inset[k])
    })
    const a = seeds[i]
    for (let j = 0; j < seeds.length; j++) {
      if (j === i) continue
      const b = seeds[j]
      let us = b[0] - a[0]
      let ut = b[1] - a[1]
      const l = Math.hypot(us, ut)
      us /= l
      ut /= l
      const c = us * (a[0] + b[0]) * 0.5 + ut * (a[1] + b[1]) * 0.5
      cell = clip(cell, us, ut, c)
      hole = clip(hole, us, ut, c - strut / 2)
    }
    raw.push(cell)
    if (hole.length >= 3 && Math.abs(area(hole)) > 1.5e-4) holes.push(hole)
  }
  // junctions: raw cell corners not on the outline, merged across cells
  const onOutline = (p) => edgesOut.some((e) => Math.abs(e.ns * p[0] + e.nt * p[1] - e.c) < 1e-6)
  const vertices = []
  const find = (p) => {
    for (let k = 0; k < vertices.length; k++) if (Math.hypot(vertices[k].s - p[0], vertices[k].t - p[1]) < 1e-5) return k
    return -1
  }
  const edges = []
  const seen = new Set()
  for (const cell of raw) {
    const ids = cell.map((p) => {
      if (onOutline(p)) return -1
      let k = find(p)
      if (k < 0) {
        vertices.push({ s: p[0], t: p[1] })
        k = vertices.length - 1
      }
      return k
    })
    for (let k = 0; k < ids.length; k++) {
      const i = ids[k]
      const j = ids[(k + 1) % ids.length]
      if (i < 0 || j < 0 || i === j) continue
      const key = i < j ? `${i},${j}` : `${j},${i}`
      if (seen.has(key)) continue
      seen.add(key)
      edges.push([i, j])
    }
  }
  return { holes, vertices, edges }
}

// Evenly scattered seeds (darts with a minimum spacing) inside a convex outline, kept a
// little away from the crease (t = 0) so the cells there aren't slivers.
export function scatter(rnd, outline, count, minT = 0.05) {
  const seeds = []
  const inside = (p) => {
    const sgn = area(outline) > 0 ? 1 : -1
    for (let i = 0; i < outline.length; i++) {
      const a = outline[i]
      const b = outline[(i + 1) % outline.length]
      if (sgn * ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])) < 0) return false
    }
    return true
  }
  let sMax = 0
  let tMax = 0
  for (const p of outline) {
    sMax = Math.max(sMax, p[0])
    tMax = Math.max(tMax, p[1])
  }
  const d = Math.sqrt((sMax * tMax * 0.75) / count) // rough spacing
  let tries = 0
  while (seeds.length < count && tries++ < 4000) {
    const p = [rnd() * sMax, minT + rnd() * (tMax - minT)]
    if (!inside(p)) continue
    if (seeds.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < d * (tries < 2000 ? 0.85 : 0.6))) continue
    seeds.push(p)
  }
  return seeds
}

// A quarter ellipse from the foot (0, w) on the glue line round to the crease
// top (L, 0): a V panel shaped like half a dome.
export function domeOutline(L, w, n = 9) {
  const pts = [[0, 0]]
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * HALF_PI
    pts.push([L * Math.sin(a), w * Math.cos(a)])
  }
  return pts // apex, foot … top; edges: glue, arc…, crease
}

function shapeFrom(outline, holes) {
  const v = (p) => new THREE.Vector2(p[0], p[1])
  const sh = new THREE.Shape(outline.map(v))
  for (const h of holes) sh.holes.push(new THREE.Path(h.map(v)))
  return sh
}

// A flap leaf: a pointed frond standing on its hinge (s up, t across). Convex.
function leafOutline(reach, half) {
  const prof = [
    [0, 0.4],
    [0.22, 0.9],
    [0.45, 1],
    [0.68, 0.82],
    [0.86, 0.45],
    [1, 0],
  ]
  const right = prof.map(([u, k]) => [u * reach, -k * half])
  const left = prof
    .slice(0, -1)
    .reverse()
    .map(([u, k]) => [u * reach, k * half])
  return [...right, ...left] // (0, −) … tip … (0, +); the closing edge is the hinge
}

// ---- the net ---------------------------------------------------------------------

// materials: { teal, violet, aqua, spire, leaf } — MeshStandardMaterials;
// rnd: paper.rng (seeds the cells).
// Returns { nodes: [{ anchor, size, kind }], edges: [[i, j]], sets: [{ material, nodes }], origins }
export function buildNet(paper, materials, rnd) {
  const nodes = []
  const edges = []
  const sets = []
  const node = (anchor, size, kind, set) => {
    nodes.push({ anchor, size, kind })
    set.nodes.push(nodes.length - 1)
    return nodes.length - 1
  }
  const link = (i, j) => {
    if (i !== j && i >= 0 && j >= 0) edges.push([i, j])
  }
  const tiers = [] // per V: highest junction, outermost junction per side

  VFOLDS.forEach((v) => {
    const set = { material: materials[v.tone], nodes: [] }
    sets.push(set)
    const fold = paper.vFold({ z: v.z, alpha: v.alpha, gamma: HALF_PI, length: v.L, toward: 'far' })
    const outline = domeOutline(v.L, v.w)
    const inset = outline.map((_, i) => (i === outline.length - 1 ? RIM / 2 : RIM)) // last edge: the crease
    const seeds = scatter(rnd, outline, v.cells)
    const cut = voronoiCut(outline, inset, seeds)
    const shape = shapeFrom(outline, cut.holes)
    paper.card(fold.left, { shape, material: set.material })
    paper.card(fold.right, { shape, material: set.material })
    // a jewel on every vein junction, both panels (the pattern is mirrored
    // about the crease, as if cut from the folded sheet)
    let top = { s: -1, i: -1 }
    const outer = []
    for (const panel of [fold.left, fold.right]) {
      const ids = cut.vertices.map((p) => node(paper.place(panel, { x: p.s, z: p.t }), 0.05 + 0.045 * (p.s / v.L), 'knot', set))
      for (const [a, b] of cut.edges) link(ids[a], ids[b])
      let far = { d: -1, i: -1 }
      cut.vertices.forEach((p, k) => {
        if (p.s > top.s) top = { s: p.s, i: ids[k] }
        const d = Math.hypot(p.s / v.L, p.t / v.w)
        if (p.t > 0.5 * v.w && d > far.d) far = { d, i: ids[k] }
      })
      outer.push(far.i)
    }
    // the crown of each dome: a jewel on the crease top
    const crest = node(paper.place(fold.left, { x: v.L - RIM, z: 0 }), 0.09, 'crease', set)
    link(crest, top.i)
    tiers.push({ top: crest, outer })
  })
  // the tiers know each other: crest to crest, flank to flank
  for (let k = 0; k + 1 < tiers.length; k++) {
    link(tiers[k].top, tiers[k + 1].top)
    link(tiers[k].outer[0], tiers[k + 1].outer[0])
    link(tiers[k].outer[1], tiers[k + 1].outer[1])
  }

  // the spire, with its crown
  let crown = -1
  {
    const set = { material: materials.spire, nodes: [] }
    sets.push(set)
    const v = SPIRE
    const fold = paper.vFold({ z: v.z, alpha: v.alpha, gamma: HALF_PI, length: v.L, toward: 'near' })
    paper.card(fold.left, { shape: 'tri', z1: v.w, material: set.material })
    paper.card(fold.right, { shape: 'tri', z1: v.w, material: set.material })
    crown = node(paper.place(fold.left, { x: v.L, z: 0 }), 0.1, 'crown', set)
    link(crown, tiers[tiers.length - 1].top)
  }

  // the leaves, mirrored on both pages
  const tips = []
  {
    const set = { material: materials.leaf, nodes: [] }
    sets.push(set)
    LEAVES.forEach((f, k) => {
      const outline = leafOutline(f.reach, f.half)
      const inset = outline.map((_, i) => (i === outline.length - 1 ? RIM * 1.5 : RIM))
      // seeds across the whole leaf (t may be negative here: no crease)
      const seeds = scatter(rnd, outline.map(([s2, t]) => [s2, t + f.half]), f.cells, 0.02).map(([s2, t]) => [s2, t - f.half])
      const cut = voronoiCut(outline, inset, seeds)
      const shape = shapeFrom(outline, cut.holes)
      for (const side of ['left', 'right']) {
        const flap = paper.flap({
          side,
          x: f.x,
          z: f.z,
          alpha: HALF_PI, // hinge runs across the page: the leaf rises facing the reader
          length: f.reach,
          lift: (th) => f.lean * Math.sin(th / 2) ** 2, // eases in: they rise after the nets
        })
        paper.card(flap.panel, { shape, material: set.material })
        const ids = cut.vertices.map((p) => node(paper.place(flap.panel, { x: p.s, z: p.t }), 0.055, 'knot', set))
        for (const [a, b] of cut.edges) link(ids[a], ids[b])
        const tip = node(paper.place(flap.panel, { x: f.reach - RIM * 0.5, z: 0 }), 0.08, 'tip', set)
        let hi = { s: -1, i: -1 }
        let lo = { s: 9, i: -1 }
        cut.vertices.forEach((p, j) => {
          if (p.s > hi.s) hi = { s: p.s, i: ids[j] }
          if (p.s < lo.s) lo = { s: p.s, i: ids[j] }
        })
        link(tip, hi.i)
        link(lo.i, tiers[k].outer[side === 'left' ? 0 : 1])
        tips.push(tip)
      }
    })
  }

  // where each in-breath's wave begins, in turn
  const origins = [crown, tips[1], tiers[1].top, tiers[0].top, tips[0], tiers[2].top]
  return { nodes, edges, sets, origins }
}
