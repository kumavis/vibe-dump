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
 * Each line carries its cumulative length (`along`, world units), the area
 * the generator gave the whole line (`lineA`, which sizes the ribbon), and the
 * drainage area at every point (`area`, for the waterfalls: a traced line only
 * knows the area where it ends, which for a tributary is the junction with
 * something far bigger, so it is read off the grid instead — the best cell
 * around each point, never shrinking downstream).
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
  const out = []
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
    lay(pts)
    pts = chaikin(pts, 2)
    const along = new Float32Array(pts.length)
    const area = new Float32Array(pts.length)
    let run = 0
    for (let i = 0; i < pts.length; i++) {
      if (i > 0) along[i] = along[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
      run = Math.max(run, areaAt(pts[i][0], pts[i][1]))
      area[i] = run
    }
    out.push({ src: k, pts, along, area, lineA: s.area })
  }
  return out
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
