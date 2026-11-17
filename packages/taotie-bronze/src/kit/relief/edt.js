// Exact Euclidean distance transforms (Felzenszwalb & Huttenlocher 2012) and an
// anti-aliased signed distance built on them.
//
// Why exact and why sub-pixel: a cast plateau's shoulder is a fraction of a
// millimetre wide, and under a raking light the normal map turns every
// distance error into a visible ripple along the shoulder. Chamfer distances
// give octagonal shoulders; pixel-centre EDTs give stair-stepped ones. The fix
// (after Gustavson's edtaa) is to locate the true edge inside each partly
// covered pixel from its antialiased coverage, and measure to that point.

const INF = 1e20

/**
 * 1-D squared distance transform of a sampled function f over n samples.
 * Writes d[q] = min_p ( (q-p)^2 + f[p] ) and arg[q] = argmin p.
 * Entries ≥ INF/2 are skipped while building the lower envelope, which makes the
 * sparse first pass (mostly "no feature here") nearly free.
 */
function envelope1d(f, n, d, arg, v, z) {
  let k = -1
  for (let q = 0; q < n; q++) {
    const fq = f[q]
    if (fq >= INF * 0.5) continue
    if (k < 0) {
      k = 0
      v[0] = q
      z[0] = -Infinity
      z[1] = Infinity
      continue
    }
    let s
    for (;;) {
      const p = v[k]
      s = (fq + q * q - (f[p] + p * p)) / (2 * q - 2 * p)
      if (s <= z[k] && k > 0) k--
      else break
    }
    if (s <= z[k]) {
      // k === 0 and the new parabola dominates the only one left
      v[0] = q
      z[0] = -Infinity
      z[1] = Infinity
      continue
    }
    k++
    v[k] = q
    z[k] = s
    z[k + 1] = Infinity
  }
  if (k < 0) {
    for (let q = 0; q < n; q++) {
      d[q] = INF
      arg[q] = -1
    }
    return
  }
  let j = 0
  for (let q = 0; q < n; q++) {
    while (z[j + 1] < q) j++
    const p = v[j]
    d[q] = (q - p) * (q - p) + f[p]
    arg[q] = p
  }
}

/**
 * Nearest-feature transform. `seed[i]` truthy marks feature pixels.
 * Returns { dist2: Float32Array (squared px distance to nearest feature centre),
 *           nearest: Int32Array (index of that feature, -1 if none) }.
 */
export function nearestFeature(seed, w, h) {
  const n = Math.max(w, h)
  const f = new Float64Array(n)
  const d = new Float64Array(n)
  const arg = new Int32Array(n)
  const v = new Int32Array(n)
  const z = new Float64Array(n + 1)

  const colD = new Float32Array(w * h)
  const colArg = new Int32Array(w * h)
  // columns: distance to nearest feature in the same column
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < h; y++) f[y] = seed[y * w + x] ? 0 : INF
    envelope1d(f, h, d, arg, v, z)
    for (let y = 0; y < h; y++) {
      colD[y * w + x] = d[y]
      colArg[y * w + x] = arg[y]
    }
  }
  const dist2 = new Float32Array(w * h)
  const nearest = new Int32Array(w * h)
  // rows: combine; the winning column's own row-argmin names the feature
  for (let y = 0; y < h; y++) {
    const row = y * w
    for (let x = 0; x < w; x++) f[x] = colD[row + x]
    envelope1d(f, w, d, arg, v, z)
    for (let x = 0; x < w; x++) {
      const cx = arg[x]
      if (cx < 0 || d[x] >= INF * 0.5) {
        dist2[row + x] = INF
        nearest[row + x] = -1
      } else {
        dist2[row + x] = d[x]
        nearest[row + x] = colArg[row + cx] * w + cx
      }
    }
  }
  return { dist2, nearest }
}

/**
 * Plain squared EDT of a binary image (truthy = feature). Kept for kit modules
 * that only need "how far from anything", e.g. leiwen packing.
 */
export function edt(binary, w, h) {
  return nearestFeature(binary, w, h).dist2
}

/**
 * Distance from a pixel centre to the edge crossing it, from coverage `a` and
 * the unit coverage gradient (gx, gy). Positive when the centre is outside.
 * (Gustavson & Strand 2011, "Anti-aliased Euclidean distance transform".)
 */
function edgeDistance(gx, gy, a) {
  if (gx === 0 || gy === 0) return 0.5 - a
  gx = Math.abs(gx)
  gy = Math.abs(gy)
  if (gx < gy) {
    const t = gx
    gx = gy
    gy = t
  }
  const a1 = (0.5 * gy) / gx
  if (a < a1) return 0.5 * (gx + gy) - Math.sqrt(2 * gx * gy * a)
  if (a < 1 - a1) return (0.5 - a) * gx
  return -0.5 * (gx + gy) + Math.sqrt(2 * gx * gy * (1 - a))
}

/**
 * Signed distance in pixels from an antialiased coverage image (0..1).
 * Positive inside (coverage ≥ 0.5), negative outside, sub-pixel accurate near
 * the edge. Out-of-range neighbours count as empty, so callers give the image a
 * margin of a few pixels around the drawn shape.
 */
export function signedDistance(cov, w, h) {
  const N = w * h
  const seed = new Uint8Array(N)
  const ex = new Float32Array(N) // edge point (pixel coords) for each seed
  const ey = new Float32Array(N)
  const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? 0 : cov[y * w + x])
  const SQ2 = Math.SQRT2

  let any = false
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      const a = cov[i]
      const inside = a >= 0.5
      let edge = a > 0 && a < 1
      if (!edge) {
        // hard (unaliased) edge: an in/out flip between 4-neighbours
        edge =
          (at(x - 1, y) >= 0.5) !== inside ||
          (at(x + 1, y) >= 0.5) !== inside ||
          (at(x, y - 1) >= 0.5) !== inside ||
          (at(x, y + 1) >= 0.5) !== inside
      }
      if (!edge) continue
      any = true
      seed[i] = 1
      // coverage gradient points into the shape
      let gx =
        -at(x - 1, y - 1) - SQ2 * at(x - 1, y) - at(x - 1, y + 1) + at(x + 1, y - 1) + SQ2 * at(x + 1, y) + at(x + 1, y + 1)
      let gy =
        -at(x - 1, y - 1) - SQ2 * at(x, y - 1) - at(x + 1, y - 1) + at(x - 1, y + 1) + SQ2 * at(x, y + 1) + at(x + 1, y + 1)
      const gl = Math.hypot(gx, gy)
      if (gl > 1e-6) {
        gx /= gl
        gy /= gl
      } else {
        gx = 0
        gy = 0
      }
      const df = gl > 1e-6 ? edgeDistance(gx, gy, a) : 0.5 - a
      ex[i] = x + gx * df
      ey[i] = y + gy * df
    }
  }

  const sd = new Float32Array(N)
  if (!any) {
    // uniform image: all inside or all outside, far from any edge
    const s = N && cov[0] >= 0.5 ? 1 : -1
    sd.fill(s * Math.hypot(w, h))
    return sd
  }
  const { nearest } = nearestFeature(seed, w, h)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x
      const j = nearest[i]
      const dist = Math.hypot(x - ex[j], y - ey[j])
      sd[i] = cov[i] >= 0.5 ? dist : -dist
    }
  }
  return sd
}
