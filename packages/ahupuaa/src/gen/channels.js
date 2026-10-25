// The stream lines as they are drawn, and the beds they run in.
//
// Streams are traced on the 1024 hydrology grid, but the ground they are drawn
// on is the 2048 heightfield, which gets young cones, fine relief and the loʻi
// after the tracing — and even the 1024 ground has hollows the priority-flood
// routed straight through. Left alone, a ribbon laid on that ground climbs over
// every bump it crosses. So once the land is otherwise finished, each drawn line
// cuts its own bed: walking from source to mouth, wherever the ground stands
// above the lowest point the water has already reached, it is lowered to that
// level, with banks sloping back up either side. Small bumps become a shallow
// channel; a real sill becomes a ravine the stream has cut through it.

import { WORLD, HALF, HYDRO_RES } from '../config.js'
import { chaikin } from './division.js'

/**
 * The stream lines as they are drawn: biggest first, each smaller one ending
 * where it meets one already laid (on a flat valley floor D8 runs parallel
 * paths a cell apart, and without this they'd draw as twin lines all the way to
 * the sea), then smoothed. Shared by the generator (which cuts their beds), the
 * ribbons and the waterfall planner, so all three agree to the centimetre on
 * where a stream runs.
 *
 * A tributary doesn't just stop short of the stream it joins: from where it
 * comes within a couple of cells of it, it bends in and ends on that stream's
 * own centreline, a little downstream, at the angle tributaries meet at, and
 * where that stream already runs no higher than the tributary does (read off
 * the hydrology grid, `data.height1024`, when there is one), so the bed the
 * generator cuts along it falls all the way into the junction. Its `join`
 * says which line it runs into (an index into the result) and where (`s`, arc
 * length along that line).
 *
 * Each line carries its cumulative length (`along`, world units), the area
 * the generator gave the whole line (`lineA`, which sizes the ribbon), and the
 * drainage area at every point (`area`, for the waterfalls: a traced line only
 * knows the area where it ends, which for a tributary is the junction with
 * something far bigger, so it is read off the grid instead — the best cell
 * around each point, never shrinking downstream, and held at its own over the
 * last bend into the junction, where the grid already reads the stream it
 * joins).
 */
export function layStreams(meta, data) {
  const laid = new Set()
  const C = 0.2
  const key = (x, z) => Math.floor(x / C) * 100003 + Math.floor(z / C)
  const near = (x, z) => {
    for (let dz = -2; dz <= 2; dz++) for (let dx = -2; dx <= 2; dx++) if (laid.has(key(x + dx * C, z + dz * C))) return true
    return false
  }
  const lay = (pts) => {
    for (let i = 1; i < pts.length; i++) {
      const [ax, az] = pts[i - 1]
      const [bx, bz] = pts[i]
      const n = Math.ceil(Math.hypot(bx - ax, bz - az) / (C * 0.5))
      for (let k = 0; k <= n; k++) laid.add(key(ax + ((bx - ax) * k) / n, az + ((bz - az) * k) / n))
    }
  }
  const N = HYDRO_RES
  const cell = WORLD / N
  const areaAt = (x, z) => {
    const ci = Math.floor((x + HALF) / cell)
    const cj = Math.floor((z + HALF) / cell)
    let best = 0
    for (let j = Math.max(0, cj - 1); j <= Math.min(N - 1, cj + 1); j++) for (let i = Math.max(0, ci - 1); i <= Math.min(N - 1, ci + 1); i++) best = Math.max(best, data.area[j * N + i])
    return best
  }
  const h1 = data.height1024 ? (x, z) => heightAt(data.height1024, N, x, z) : null
  const out = []
  const drawn = segmentIndex(out)
  const sorted = meta.streams.map((s, k) => ({ s, k })).filter(({ s }) => s.area >= 0.9 && s.pts.length >= 3).sort((a, b) => b.s.area - a.s.area)
  for (const { s, k } of sorted) {
    let cut = s.pts.length
    for (let i = 0; i < s.pts.length; i++) {
      if (near(s.pts[i][0], s.pts[i][1])) {
        cut = i + 1 // run on into the confluence
        break
      }
    }
    if (cut < 3) continue
    let pts = s.pts.slice(0, cut).map((p) => [p[0], p[1]])
    // (a trace that stops short of the sea ends in another stream)
    const join = cut < s.pts.length || !s.mouth ? joinUp(s.pts, cut, pts, out, drawn, h1) : null
    const own = pts.length - (join ? join.added : 0) // the traced points, before the bend in
    lay(pts)
    pts = chaikin(pts, 2)
    const along = new Float32Array(pts.length)
    const area = new Float32Array(pts.length)
    // (chaikin makes n points 4n, of which the first 4(own - 1) lie on the
    // traced stretch)
    const ownEnd = join ? 4 * (own - 1) : pts.length
    let run = 0
    for (let i = 0; i < pts.length; i++) {
      if (i > 0) along[i] = along[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
      if (i < ownEnd) run = Math.max(run, areaAt(pts[i][0], pts[i][1]))
      area[i] = run
    }
    const line = { src: k, pts, along, area, lineA: s.area }
    if (join) line.join = { line: join.line, s: join.s }
    out.push(line)
    drawn.add(out.length - 1)
  }
  return out
}

/**
 * A grid of the drawn lines' segments, for finding the nearest point on any
 * of them: `add(li)` files line li of `lines`, `nearest(x, z, r)` returns
 * { li, seg, t, d, x, z, s } for the closest point within r, or null.
 */
function segmentIndex(lines) {
  const B = 0.5
  const cells = new Map()
  const ck = (i, j) => i * 100003 + j
  return {
    add(li) {
      const { pts } = lines[li]
      for (let i = 1; i < pts.length; i++) {
        const i0 = Math.floor(Math.min(pts[i - 1][0], pts[i][0]) / B)
        const i1 = Math.floor(Math.max(pts[i - 1][0], pts[i][0]) / B)
        const j0 = Math.floor(Math.min(pts[i - 1][1], pts[i][1]) / B)
        const j1 = Math.floor(Math.max(pts[i - 1][1], pts[i][1]) / B)
        for (let j = j0; j <= j1; j++) {
          for (let ii = i0; ii <= i1; ii++) {
            const c = ck(ii, j)
            let list = cells.get(c)
            if (!list) cells.set(c, (list = []))
            list.push(li, i - 1)
          }
        }
      }
    },
    nearest(x, z, r) {
      let best = null
      for (let j = Math.floor((z - r) / B); j <= Math.floor((z + r) / B); j++) {
        for (let i = Math.floor((x - r) / B); i <= Math.floor((x + r) / B); i++) {
          const list = cells.get(ck(i, j))
          if (!list) continue
          for (let q = 0; q < list.length; q += 2) {
            const li = list[q]
            const seg = list[q + 1]
            const { pts, along } = lines[li]
            const ax = pts[seg][0]
            const az = pts[seg][1]
            const dx = pts[seg + 1][0] - ax
            const dz = pts[seg + 1][1] - az
            const l2 = dx * dx + dz * dz || 1e-12
            const t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / l2))
            const px = ax + dx * t
            const pz = az + dz * t
            const d = Math.hypot(px - x, pz - z)
            if (d <= r && (!best || d < best.d)) best = { li, seg, t, d, x: px, z: pz, s: along[seg] + (along[seg + 1] - along[seg]) * t }
          }
        }
      }
      return best
    },
  }
}

/** Point and unit direction on a laid line at arc length s (clamped to it). */
function pointAt(line, s) {
  const { pts, along } = line
  let lo = 0
  let hi = pts.length - 1
  s = Math.max(0, Math.min(along[hi], s))
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1
    if (along[m] <= s) lo = m
    else hi = m
  }
  const t = (s - along[lo]) / (along[hi] - along[lo] || 1)
  const dx = pts[hi][0] - pts[lo][0]
  const dz = pts[hi][1] - pts[lo][1]
  const l = Math.hypot(dx, dz) || 1
  return { x: pts[lo][0] + dx * t, z: pts[lo][1] + dz * t, ux: dx / l, uz: dz / l }
}

/**
 * Bend a tributary's traced points (`pts`, the first `cut` of `trace`) into
 * the nearest drawn line, appending the bend to `pts`. The junction goes a
 * little downstream of the nearest point, as far as the tributary's own
 * heading would carry it there (between 0.4 and 1.6 times its distance off),
 * and then on down that stream until it runs no higher than the tributary
 * has; if that is a long way down, the tributary follows its own trace
 * alongside first, as it does on the ground. Returns { line, s, added }, or
 * null when nothing drawn is near enough to join.
 */
function joinUp(trace, cut, pts, out, drawn, h1) {
  let E = pts[pts.length - 1]
  const hit = drawn.nearest(E[0], E[1], 1)
  if (!hit) return null
  let stem = out[hit.li]
  let total = stem.along[stem.along.length - 1]
  const P = pts[Math.max(0, pts.length - 3)]
  let hx = E[0] - P[0]
  let hz = E[1] - P[1]
  const hl = Math.hypot(hx, hz) || 1
  hx /= hl
  hz /= hl
  const { ux, uz } = pointAt(stem, hit.s)
  let sJ
  if (hit.d < 1e-4) sJ = hit.s
  else {
    const inx = (hit.x - E[0]) / hit.d
    const inz = (hit.z - E[1]) / hit.d
    const cosIn = hx * inx + hz * inz
    const reach = cosIn > 0.3 ? (hit.d / cosIn) * (hx * ux + hz * uz) : hit.d * 1.2
    sJ = hit.s + Math.max(hit.d * 0.4, Math.min(hit.d * 1.6, reach))
  }
  sJ = Math.min(sJ, total)
  // (in the last stretch of a stream that itself runs into a bigger one, it
  // joins that one instead, just below where the two meet)
  if (stem.join && sJ > total - 0.6) {
    const { line, s } = stem.join
    hit.li = line
    stem = out[line]
    total = stem.along[stem.along.length - 1]
    sJ = Math.min(total, s + 0.1)
  }
  if (h1) {
    // no higher than the tributary has run (it can only be cut down to that)
    let run = Infinity
    for (const p of pts) run = Math.min(run, h1(p[0], p[1]))
    // (as far as where its own trace meets this stream, and a little past)
    const D = trace[trace.length - 1]
    const end = drawn.nearest(D[0], D[1], 0.6)
    const lim = Math.min(total, sJ + 4, Math.max(sJ, end && end.li === hit.li ? end.s + 0.3 : sJ))
    let best = sJ
    let lo = Infinity
    for (let s = sJ; s <= lim + 1e-6; s += 0.05) {
      const q = pointAt(stem, s)
      const h = h1(q.x, q.z)
      if (h < lo) {
        lo = h
        best = s
      }
      if (h <= run + 0.5) break
    }
    sJ = best
  }
  let added = 0
  // far down: follow the trace alongside until the junction is a short bend away
  for (let i = cut; i < trace.length - 1; i++) {
    const q = drawn.nearest(trace[i][0], trace[i][1], 1)
    if (!q || q.li !== hit.li || q.d < 0.15 || q.s + Math.max(0.3, q.d * 1.6) >= sJ) break
    pts.push([trace[i][0], trace[i][1]])
    added++
  }
  E = pts[pts.length - 1]
  const J = pointAt(stem, sJ)
  // a cubic from the tributary's heading into the stream at a slant
  const P2 = pts[Math.max(0, pts.length - 3)]
  hx = E[0] - P2[0]
  hz = E[1] - P2[1]
  const hl2 = Math.hypot(hx, hz) || 1
  hx /= hl2
  hz /= hl2
  const L = Math.hypot(J.x - E[0], J.z - E[1])
  if (L > 1e-4) {
    const cx = (J.x - E[0]) / L
    const cz = (J.z - E[1]) / L
    // (a heading that points away from the junction is turned toward it first)
    if (hx * cx + hz * cz < 0.3) {
      hx = hx * 0.3 + cx
      hz = hz * 0.3 + cz
      const l = Math.hypot(hx, hz)
      hx /= l
      hz /= l
    }
    let tx = cx + J.ux
    let tz = cz + J.uz
    const tl = Math.hypot(tx, tz) || 1
    tx /= tl
    tz /= tl
    const b1x = E[0] + hx * L * 0.35
    const b1z = E[1] + hz * L * 0.35
    const b2x = J.x - tx * L * 0.35
    const b2z = J.z - tz * L * 0.35
    const n = Math.max(1, Math.ceil(L / 0.15))
    for (let q = 1; q < n; q++) {
      const t = q / n
      const m = 1 - t
      pts.push([m * m * m * E[0] + 3 * m * m * t * b1x + 3 * m * t * t * b2x + t * t * t * J.x, m * m * m * E[1] + 3 * m * m * t * b1z + 3 * m * t * t * b2z + t * t * t * J.z])
      added++
    }
  }
  // (and if it was there already, it just ends there)
  if (L > 1e-4) {
    pts.push([J.x, J.z])
    added++
  } else pts[pts.length - 1] = [J.x, J.z]
  return { line: hit.li, s: sJ, added }
}

/** Bilinear height at world (x, z), exactly as the terrain reads it. */
function heightAt(h, N, x, z) {
  let fx = ((x + HALF) / WORLD) * N - 0.5
  let fz = ((z + HALF) / WORLD) * N - 0.5
  if (fx < 0) fx = 0
  else if (fx > N - 1.001) fx = N - 1.001
  if (fz < 0) fz = 0
  else if (fz > N - 1.001) fz = N - 1.001
  const i = fx | 0
  const j = fz | 0
  const tx = fx - i
  const tz = fz - j
  const k = j * N + i
  const a = h[k] + (h[k + 1] - h[k]) * tx
  const b = h[k + N] + (h[k + N + 1] - h[k + N]) * tx
  return a + (b - a) * tz
}

/**
 * Cut every drawn line's bed so the water never climbs (heights in metres on
 * the N×N grid, edited in place; only ever lowered). A few passes, because
 * lowering the ground under one point can lower the point just upstream of it
 * too, and a tributary's bed can dip the stream it joins. Returns the deepest
 * cut and how many texels moved, for the record.
 */
export function cutBeds(h, N, lines, passes = 6) {
  const rec = { deepest: 0, moved: 0 }
  for (let pass = 0; pass < passes; pass++) {
    let changed = 0
    for (const line of lines) changed += cutLine(h, N, line, rec)
    if (!changed) break
  }
  return rec
}

/** Lower texel c to v if it stands above it; true if it moved. */
function lowerTo(h, c, v, rec) {
  if (h[c] <= v) return false
  rec.deepest = Math.max(rec.deepest, h[c] - v)
  rec.moved++
  h[c] = v
  return true
}

/** One pass down one line; returns how many texels it lowered. */
function cutLine(h, N, line, rec) {
  const tex = WORLD / N
  const step = tex / 3
  const bed = tex * 0.6 // the flat of the bed, either side of the line
  const bank = 55 // m of rise per world unit beyond it (about 30°)
  const { pts, along } = line
  const total = along[along.length - 1]
  let changed = 0
  let g = Infinity
  let seg = 0
  for (let s = 0; s <= total + 1e-6; s += step) {
    while (seg < pts.length - 2 && along[seg + 1] < s) seg++
    const t = (s - along[seg]) / (along[seg + 1] - along[seg] || 1)
    const x = pts[seg][0] + (pts[seg + 1][0] - pts[seg][0]) * t
    const z = pts[seg][1] + (pts[seg + 1][1] - pts[seg][1]) * t
    const y = heightAt(h, N, x, z)
    if (y < g) g = y
    // the stream has reached the sea: what lies beyond is beach and reef
    if (g < 0.2) break
    if (y - g <= 0.02) continue
    // the four texels the bilinear ground reads here go down to the bed...
    const fx = (x + HALF) / tex - 0.5
    const fz = (z + HALF) / tex - 0.5
    const i0 = Math.max(0, Math.min(N - 2, Math.floor(fx)))
    const j0 = Math.max(0, Math.min(N - 2, Math.floor(fz)))
    const c0 = j0 * N + i0
    if (lowerTo(h, c0, g, rec)) changed++
    if (lowerTo(h, c0 + 1, g, rec)) changed++
    if (lowerTo(h, c0 + N, g, rec)) changed++
    if (lowerTo(h, c0 + N + 1, g, rec)) changed++
    // ...and the banks round it slope back up to the old ground (but the
    // channel just upstream is left alone: cutting into it would eat back up
    // into a steep reach above, a little more every pass)
    let ux = pts[seg + 1][0] - pts[seg][0]
    let uz = pts[seg + 1][1] - pts[seg][1]
    const ul = Math.sqrt(ux * ux + uz * uz) || 1
    ux /= ul
    uz /= ul
    const R = bed + (y - g) / bank
    const ri = Math.ceil(R / tex)
    const ci = Math.round(fx)
    const cj = Math.round(fz)
    for (let j = Math.max(0, cj - ri); j <= Math.min(N - 1, cj + ri); j++) {
      const dz = -HALF + (j + 0.5) * tex - z
      for (let i = Math.max(0, ci - ri); i <= Math.min(N - 1, ci + ri); i++) {
        const dx = -HALF + (i + 0.5) * tex - x
        const d = Math.sqrt(dx * dx + dz * dz)
        if (d > R) continue
        if (dx * ux + dz * uz < -tex * 0.75 && Math.abs(dx * uz - dz * ux) < bed + tex) continue
        if (lowerTo(h, j * N + i, g + Math.max(0, d - bed) * bank, rec)) changed++
      }
    }
  }
  return changed
}
