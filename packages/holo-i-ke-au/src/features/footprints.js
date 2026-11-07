// The ground every building drawn in a year stands on, whoever placed it:
// the district's scatter and landmarks (settlements.js), the island's scatter
// (towns.js) where the district does not take its ground over, and the works'
// blocks (works.js). For the tools and the checks (ISSUES.md 9): no ground
// should carry two buildings at once, since two solids in one place fight
// for the same pixels and the loser reads as a stipple.
//
// Each footprint is the model's own box on the ground, turned as it is drawn
// (local x to (cos a, −sin a) and local z to (sin a, cos a), as THREE turns
// about y): `box` its extents [x0, x1, z0, z1] in world units about (x, z).

/** How far a fade (x in, y in; z out, w out) has a building in at year y. */
const weight = (s, y, k = 0) => smooth(s[k], s[k + 1], y) * (1 - smooth(s[k + 2], s[k + 3], y))
const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/**
 * What is drawn in `year` within `radius` world units of (x, z), as drawn
 * now: the district's (while it is down), the island's (less those the
 * district's yield takes over) and the works' blocks,
 * each faded in at least `min` (0.999: standing whole; 0.02: drawn at all,
 * a building caught fading too).
 */
export function standing(app, year, x, z, radius, min = 0.999) {
  const out = []
  const near = (px, pz, r = 0) => Math.hypot(px - x, pz - z) <= radius + r
  const S = app.districts?.cur?.features?.settlements
  if (S?.ready && app.districts.on) {
    for (let i = 0; i < S.N; i++) {
      if (!near(S.ix[i], S.iz[i]) || S.weightAt(i, year) < min) continue
      const kit = S.variants[S.vOf[i]].kit
      out.push({ src: S.iland[i] ? 'landmark' : 'district', id: `${S.variants[S.vOf[i]].name}#${i}`, x: S.ix[i], z: S.iz[i], a: S.ia[i], box: kit.box.map((v) => v * S.ish[i]) })
    }
  }
  const yu = app.towns?.yieldU
  const yr = yu?.uYieldRect.value
  const yielded = (px, pz) => yu && yu.uYield.value >= 0.5 && px > yr.x && pz > yr.y && px < yr.z && pz < yr.w
  for (const isl of app.towns?.islands?.values() ?? []) {
    if (!isl.ready) continue
    for (const tile of isl.tiles.values()) {
      if (!tile.n || Math.hypot(Math.max(tile.x0 - x, 0, x - tile.x0 - 5), Math.max(tile.z0 - z, 0, z - tile.z0 - 5)) > radius) continue
      for (let i = 0; i < tile.n; i++) {
        const px = tile.pos[i * 4]
        const pz = tile.pos[i * 4 + 2]
        if (!near(px, pz) || yielded(px, pz) || weight(tile.spans, year, i * 4) < min) continue
        const vr = isl.variants[tile.vOf[i]]
        const sc = tile.scale[i * 3]
        out.push({ src: 'island', id: `${isl.id}:${vr.name}#${tile.ti},${tile.tj},${i}`, x: px, z: pz, a: tile.pos[i * 4 + 3], box: vr.kit.box.map((v) => v * sc) })
      }
    }
  }
  for (const isl of app.works?.islands?.values() ?? []) {
    for (const [k, it] of (isl.view?.instances ?? []).entries()) {
      if (weight(it.span, year) < min || !near(it.x, it.z, 3)) continue
      const hx = it.kit.hx * it.sx
      const hz = it.kit.hz * it.sz
      out.push({ src: 'works', id: `${isl.id}:${it.kind}#${k}`, x: it.x, z: it.z, a: -it.dir, box: [-hx, hx, -hz, hz] })
    }
  }
  return out
}

/** A footprint's four corners in the world. */
function corners(f) {
  const c = Math.cos(f.a)
  const s = Math.sin(f.a)
  const [x0, x1, z0, z1] = f.box
  return [[x0, z0], [x1, z0], [x1, z1], [x0, z1]].map(([u, v]) => [f.x + u * c + v * s, f.z - u * s + v * c])
}

/** How far two footprints reach into each other (world units): 0 if they do not meet, by separating axes. */
export function penetration(a, b) {
  const A = corners(a)
  const B = corners(b)
  let least = Infinity
  for (const P of [A, B]) {
    for (let i = 0; i < 2; i++) {
      const ex = P[i + 1][0] - P[i][0]
      const ez = P[i + 1][1] - P[i][1]
      const l = Math.hypot(ex, ez) || 1
      const nx = -ez / l
      const nz = ex / l
      let a0 = Infinity
      let a1 = -Infinity
      let b0 = Infinity
      let b1 = -Infinity
      for (const [px, pz] of A) {
        const d = px * nx + pz * nz
        a0 = Math.min(a0, d)
        a1 = Math.max(a1, d)
      }
      for (const [px, pz] of B) {
        const d = px * nx + pz * nz
        b0 = Math.min(b0, d)
        b1 = Math.max(b1, d)
      }
      const o = Math.min(a1, b1) - Math.max(a0, b0)
      if (o <= 0) return 0
      least = Math.min(least, o)
    }
  }
  return least
}

/**
 * The pairs of footprints in `list` that reach into each other by more than
 * `tol` world units (default 0.003: 30 cm of drawn ground), as
 * { a, b, depth, pair } with `pair` their sources ("district+island", say).
 */
export function overlaps(list, tol = 0.003) {
  const CELL = 1
  const grid = new Map()
  const R = list.map((f) => Math.max(Math.abs(f.box[0]), Math.abs(f.box[1])) + Math.max(Math.abs(f.box[2]), Math.abs(f.box[3])))
  list.forEach((f, i) => {
    for (let gi = Math.floor((f.x - R[i]) / CELL); gi <= Math.floor((f.x + R[i]) / CELL); gi++) {
      for (let gj = Math.floor((f.z - R[i]) / CELL); gj <= Math.floor((f.z + R[i]) / CELL); gj++) {
        const k = gi * 100003 + gj
        if (!grid.has(k)) grid.set(k, [])
        grid.get(k).push(i)
      }
    }
  })
  const seen = new Set()
  const out = []
  for (const cell of grid.values()) {
    for (let p = 0; p < cell.length; p++) {
      for (let q = p + 1; q < cell.length; q++) {
        const i = Math.min(cell[p], cell[q])
        const j = Math.max(cell[p], cell[q])
        const key = i * list.length + j
        if (seen.has(key)) continue
        seen.add(key)
        const a = list[i]
        const b = list[j]
        if (Math.hypot(a.x - b.x, a.z - b.z) > R[i] + R[j]) continue
        const depth = penetration(a, b)
        if (depth > tol) out.push({ a: a.id, b: b.id, depth: +depth.toFixed(4), pair: [a.src, b.src].sort().join('+'), at: [+((a.x + b.x) / 2).toFixed(2), +((a.z + b.z) / 2).toFixed(2)] })
      }
    }
  }
  return out
}

/**
 * For the tools and the checks: in `year` within `radius` of (x, z), what is
 * drawn at all (by placement), how much of it is caught fading (a stipple
 * on the screen), and the pairs on one ground among everything drawn, whole
 * or fading (two buildings in one place: an overlap, or two dithered into
 * each other), by the pair of placements.
 */
export function overlapReport(app, year, x, z, radius) {
  const drawn = standing(app, year, x, z, radius, 0.02)
  const whole = standing(app, year, x, z, radius).length
  const o = overlaps(drawn)
  const by = {}
  for (const p of o) by[p.pair] = (by[p.pair] || 0) + 1
  const src = {}
  for (const f of drawn) src[f.src] = (src[f.src] || 0) + 1
  return { year, drawn: src, fading: drawn.length - whole, overlaps: o.length, by, first: o.slice(0, 6) }
}
