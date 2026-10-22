// Class rasters on a pack grid (DATA.md, "Zoning, for the settlements").
//
// A texel's class is the class covering most of its area. Each texel is split
// into s × s samples; every polygon paints the index of its class label into
// the samples it covers (with layers-raster.mjs's scan, so the registration is
// the era layers' own), deferred rules are settled per sample against the
// State district or the height limit painted beneath, and each texel then
// takes the commonest class among its samples. Samples with no class (roads,
// unzoned land, sea beyond the polygons) do not vote, but a texel needs a
// quarter of its samples classed to take a class at all, so a coast or a
// layer's ragged edge does not smear outward.
import { bboxOf } from './geo.mjs'
import { polygonArea, scanPolygons } from './layers-raster.mjs'

/** A texel takes a class only when classed samples cover at least this share of it. */
export const MIN_CLASSED = 0.25

/** Features whose bounding box meets `bounds`, largest first (so a small zone drawn inside a large one wins). */
export function within(features, bounds) {
  const [w, s, e, n] = bounds
  const out = []
  for (const f of features) {
    if (!f.geometry || (f.geometry.type !== 'Polygon' && f.geometry.type !== 'MultiPolygon')) continue
    const b = f._bbox || (f._bbox = bboxOf(f.geometry))
    if (b[2] < w || b[0] > e || b[3] < s || b[1] > n) continue
    f._area ??= polygonArea(f.geometry)
    out.push(f)
  }
  return out.sort((a, b) => b._area - a._area)
}

/** Paint value(feature) (1..65535; 0 skips) into an s × s sample grid. */
export function paint(features, grid, s, value, Kind = Uint16Array) {
  const SW = grid.W * s
  const buf = new Kind(SW * grid.H * s)
  scanPolygons(features, grid, s, (f, row, x0, x1) => {
    const v = value(f)
    if (v) buf.fill(v, row * SW + x0, row * SW + x1)
  })
  return buf
}

/**
 * Settle every sample's class and take each texel's commonest.
 *   labels: per-sample label index (0 none); classOf(label, k) gives the
 *   class of label at sample k (0..n). land: per-texel 0/1.
 * Returns { classes: Uint8Array per texel, tally: Float64Array of land samples
 * per (label, class) as label * (n + 1) + class }.
 */
export function majority(labels, nLabels, classOf, grid, s, n, land) {
  const { W, H } = grid
  const SW = W * s
  const out = new Uint8Array(W * H)
  const counts = new Int32Array(W * (n + 1))
  const tally = new Float64Array((nLabels + 1) * (n + 1))
  const need = Math.ceil(MIN_CLASSED * s * s)
  for (let j = 0; j < H; j++) {
    counts.fill(0)
    for (let b = 0; b < s; b++) {
      const base = (j * s + b) * SW
      for (let i = 0; i < W; i++) {
        const o = base + i * s
        const c0 = i * (n + 1)
        const onLand = land[j * W + i]
        for (let a = 0; a < s; a++) {
          const k = o + a
          const L = labels[k]
          const c = L ? classOf(L, k) : 0
          counts[c0 + c]++
          if (onLand) tally[L * (n + 1) + c]++
        }
      }
    }
    for (let i = 0; i < W; i++) {
      if (!land[j * W + i]) continue
      const c0 = i * (n + 1)
      let best = 0
      let bestN = 0
      let classed = 0
      for (let c = 1; c <= n; c++) {
        const m = counts[c0 + c]
        classed += m
        if (m > bestN) {
          bestN = m
          best = c
        }
      }
      out[j * W + i] = classed >= need ? best : 0
    }
  }
  return { classes: out, tally }
}

/** Share of the pack's land in each class (1..n), and the share with none; 4 decimals. */
export function classShares(classes, land, n) {
  const count = new Float64Array(n + 1)
  let N = 0
  for (let o = 0; o < land.length; o++) {
    if (!land[o]) continue
    N++
    count[classes[o]]++
  }
  const share = {}
  for (let c = 1; c <= n; c++) if (count[c]) share[c] = Math.round((count[c] / N) * 1e4) / 1e4
  return { landTexels: N, classed: Math.round(((N - count[0]) / N) * 1e4) / 1e4, none: Math.round((count[0] / N) * 1e4) / 1e4, share }
}

/** Parse a Honolulu height label ("60'", "60' (90')", "0' / 25'") to its base figure in feet, or 0. */
export function baseFeet(label) {
  const m = /(\d+(?:\.\d+)?)\s*'/.exec(String(label || ''))
  return m ? Math.round(Number(m[1])) : 0
}
