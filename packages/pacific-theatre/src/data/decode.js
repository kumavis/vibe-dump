// A pack, from its PNG bytes to what the renderer samples. Pure functions on
// typed arrays, so they run in the loader's worker (worker.js) or, failing
// that, on the main thread.
//
// Copied from holo-i-ke-au's data/decode.js (b480c27) and adapted: the
// exaggerations the normals and the ambient occlusion are worked out at come
// in as parameters instead of module constants (the table bakes its normals
// near the display exaggeration, 18, so 8-bit normals do not terrace the
// abyssal plain; a box keeps the Hawaiian 2), and the land map (drainage,
// beach sand, rain) is skipped where the shader does not read it (`land:
// false`, the table: about a second and 15 MB saved on a 2048 pack).
//
// The height image carries a 16-bit value split across two 8-bit channels
// (DATA.md §2): value = R·256 + G, metres = value·scale + offset. It is decoded
// here, on the CPU, into a Float32Array, and only that goes to the GPU: the
// split bytes must never be filtered as a texture, since blending a high byte
// with its neighbour's gives nonsense.
//
// From the metres come the companion grids the shaders expect: a normal map
// (with ambient occlusion in its alpha), and for a box the land map of rain,
// beach sand and how much water gathers in each gully. The rain image, when a
// pack has one, is already in the encoding the land map's red channel uses.

/** Split-byte RGB(A) pixels → metres. */
export function decodeHeights(px, W, H, scale, offset, stride = 4) {
  const out = new Float32Array(W * H)
  for (let c = 0, p = 0; c < W * H; c++, p += stride) out[c] = (px[p] * 256 + px[p + 1]) * scale + offset
  return out
}

/** The first channel of RGBA pixels (a greyscale PNG decodes with r = g = b). */
export function decodeGrey(px, W, H, stride = 4) {
  const out = new Uint8Array(W * H)
  for (let c = 0, p = 0; c < W * H; c++, p += stride) out[c] = px[p]
  return out
}

/**
 * Whether the sea in this pack is the flat -1 m a bake writes where it had no
 * bathymetry. If so the ocean would read as one endless lagoon, so a shelf is
 * made up from the distance to land (synthShelf).
 */
export function isFlatSea(m) {
  let sea = 0
  let flat = 0
  for (let c = 0; c < m.length; c += 7) {
    if (m[c] > 0) continue
    sea++
    if (m[c] > -1.6) flat++
  }
  return sea > 100 && flat > sea * 0.95
}

/** A plausible island shelf: a few metres at the shore, a hundred at a kilometre or two, thousands in the channels. */
export function synthShelf(m, W, H, mx, mz) {
  const d = distanceTransform(W, H, (c) => m[c] > 0, mx, mz)
  for (let c = 0; c < m.length; c++) {
    if (m[c] > 0) continue
    const km = d[c] / 1000
    m[c] = -(1 + 30 * km + 3600 * (1 - Math.exp(-Math.max(0, km - 0.6) / 6)))
  }
}

/** Separable box blur on a W × H grid, radius r cells, `passes` times. */
export function blur(src, W, H, r, passes = 1) {
  let a = Float32Array.from(src)
  const b = new Float32Array(W * H)
  const w = 1 / (2 * r + 1)
  for (let p = 0; p < passes; p++) {
    for (let y = 0; y < H; y++) {
      const row = y * W
      let s = 0
      for (let k = -r; k <= r; k++) s += a[row + Math.min(W - 1, Math.max(0, k))]
      for (let x = 0; x < W; x++) {
        b[row + x] = s * w
        s += a[row + Math.min(W - 1, x + r + 1)] - a[row + Math.max(0, x - r)]
      }
    }
    for (let x = 0; x < W; x++) {
      let s = 0
      for (let k = -r; k <= r; k++) s += b[Math.min(H - 1, Math.max(0, k)) * W + x]
      for (let y = 0; y < H; y++) {
        a[y * W + x] = s * w
        s += b[Math.min(H - 1, y + r + 1) * W + x] - b[Math.max(0, y - r) * W + x]
      }
    }
  }
  return a
}

// 1-D squared distance transform (Felzenszwalb & Huttenlocher 2012), with the
// cells `s` apart.
function edt1d(f, n, d, v, z, s) {
  const s2 = s * s
  let k = 0
  v[0] = 0
  z[0] = -Infinity
  z[1] = Infinity
  for (let q = 1; q < n; q++) {
    let r = (f[q] + q * q * s2 - (f[v[k]] + v[k] * v[k] * s2)) / (2 * s2 * (q - v[k]))
    while (r <= z[k]) {
      k--
      r = (f[q] + q * q * s2 - (f[v[k]] + v[k] * v[k] * s2)) / (2 * s2 * (q - v[k]))
    }
    k++
    v[k] = q
    z[k] = r
    z[k + 1] = Infinity
  }
  k = 0
  for (let q = 0; q < n; q++) {
    while (z[k + 1] < q) k++
    const dq = (q - v[k]) * s
    d[q] = dq * dq + f[v[k]]
  }
}

/** Exact Euclidean distance (metres, texels mx × mz) from every texel to the nearest where seed(c) holds. */
export function distanceTransform(W, H, seed, mx = 1, mz = 1) {
  const INF = 1e20
  const g = new Float64Array(W * H)
  for (let c = 0; c < W * H; c++) g[c] = seed(c) ? 0 : INF
  const n = Math.max(W, H)
  const f = new Float64Array(n)
  const d = new Float64Array(n)
  const v = new Int32Array(n)
  const z = new Float64Array(n + 1)
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) f[y] = g[y * W + x]
    edt1d(f, H, d, v, z, mz)
    for (let y = 0; y < H; y++) g[y * W + x] = d[y]
  }
  const out = new Float32Array(W * H)
  for (let y = 0; y < H; y++) {
    const row = y * W
    for (let x = 0; x < W; x++) f[x] = g[row + x]
    edt1d(f, W, d, v, z, mx)
    for (let x = 0; x < W; x++) out[row + x] = Math.sqrt(d[x])
  }
  return out
}

/**
 * Horizon-based ambient occlusion on a coarse grid (about 512 across), as in
 * ahupuaʻa's finalize.js: in eight directions, how much of the sky do the
 * surrounding ridges hide? Worked out at `exag` (a box's valley 1.3; the
 * table's display exaggeration), where it shows.
 */
export function ambientOcclusion(m, W, H, mx, mz, exag = 1.3) {
  const f = Math.max(1, Math.round(Math.max(W, H) / 512))
  const w = Math.ceil(W / f)
  const h = Math.ceil(H / f)
  const lo = new Float32Array(w * h)
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      let s = 0
      let n = 0
      for (let b = j * f; b < Math.min(H, (j + 1) * f); b++) {
        for (let a = i * f; a < Math.min(W, (i + 1) * f); a++) {
          s += Math.max(0, m[b * W + a])
          n++
        }
      }
      lo[j * w + i] = (s / n) * exag
    }
  }
  const out = new Float32Array(w * h)
  const steps = [1, 2, 3, 5, 7, 10, 14, 19, 26, 34]
  const dirs = []
  for (let k = 0; k < 8; k++) dirs.push([Math.cos((k * Math.PI) / 4), Math.sin((k * Math.PI) / 4)])
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const e = lo[j * w + i]
      if (e <= 0) {
        out[j * w + i] = 1
        continue
      }
      let occ = 0
      for (const [dx, dz] of dirs) {
        let maxTan = 0
        const step = Math.hypot(dx * mx, dz * mz) * f
        for (const s of steps) {
          const x = Math.round(i + dx * s)
          const z = Math.round(j + dz * s)
          if (x < 0 || z < 0 || x >= w || z >= h) break
          const t = (lo[z * w + x] - e) / (s * step)
          if (t > maxTan) maxTan = t
        }
        occ += maxTan / Math.sqrt(1 + maxTan * maxTan)
      }
      out[j * w + i] = 1 - (occ / 8) * 0.95
    }
  }
  return { data: out, w, h, f }
}

/**
 * Normals packed as RGBA8: xyz of the normal at exaggeration E in RGB,
 * ambient occlusion in A. The shader turns the normal back into the ground's
 * gradient (dividing by uNormalE, ground.glsl.js) and rebuilds it at whatever
 * exaggeration the camera has.
 */
export function packNormals(m, W, H, mx, mz, ao, E = 2) {
  const out = new Uint8Array(W * H * 4)
  for (let j = 0; j < H; j++) {
    const jm = Math.max(0, j - 1)
    const jp = Math.min(H - 1, j + 1)
    for (let i = 0; i < W; i++) {
      const c = j * W + i
      const im = Math.max(0, i - 1)
      const ip = Math.min(W - 1, i + 1)
      const gx = (m[j * W + ip] - m[j * W + im]) / ((ip - im) * mx)
      const gz = (m[jp * W + i] - m[jm * W + i]) / ((jp - jm) * mz)
      const nx = -gx * E
      const nz = -gz * E
      const l = Math.hypot(nx, 1, nz)
      out[c * 4] = Math.round(((nx / l) * 0.5 + 0.5) * 255)
      out[c * 4 + 1] = Math.round(((1 / l) * 0.5 + 0.5) * 255)
      out[c * 4 + 2] = Math.round(((nz / l) * 0.5 + 0.5) * 255)
      let a = 1
      if (ao) {
        // bilinear in the coarse grid
        const fx = Math.min(ao.w - 1.001, Math.max(0, (i + 0.5) / ao.f - 0.5))
        const fz = Math.min(ao.h - 1.001, Math.max(0, (j + 0.5) / ao.f - 0.5))
        const x0 = fx | 0
        const z0 = fz | 0
        const tx = fx - x0
        const tz = fz - z0
        const k = z0 * ao.w + x0
        const d = ao.data
        const x1 = Math.min(ao.w - 1, x0 + 1) - x0
        const z1 = Math.min(ao.h - 1, z0 + 1) - z0
        const top = d[k] + (d[k + x1] - d[k]) * tx
        const bot = d[k + z1 * ao.w] + (d[k + z1 * ao.w + x1] - d[k + z1 * ao.w]) * tx
        a = top + (bot - top) * tz
      }
      out[c * 4 + 3] = Math.round(Math.max(0, Math.min(1, a)) * 255)
    }
  }
  return out
}

/**
 * Drainage area (km²) of every land texel: each sends what it has gathered
 * to its steepest lower neighbour, highest ground first (a counting sort by
 * height, so it is linear). Pits and flats simply hold theirs; this is a
 * shading cue for gullies and valley floors, not hydrology.
 */
export function drainageArea(m, W, H, mx, mz) {
  const N = W * H
  const cellKm = (mx * mz) / 1e6
  const area = new Float32Array(N)
  let top = 0
  let count = 0
  for (let c = 0; c < N; c++) {
    if (m[c] > 0) {
      area[c] = cellKm
      if (m[c] > top) top = m[c]
      count++
    }
  }
  if (!count) return area
  const B = Math.min(65536, Math.ceil(top) + 2)
  const bucket = (v) => Math.min(B - 1, Math.floor((v / top) * (B - 2)))
  const start = new Uint32Array(B + 1)
  for (let c = 0; c < N; c++) if (m[c] > 0) start[bucket(m[c]) + 1]++
  for (let b = 0; b < B; b++) start[b + 1] += start[b]
  const order = new Uint32Array(count)
  const fill = start.slice()
  for (let c = 0; c < N; c++) if (m[c] > 0) order[fill[bucket(m[c])]++] = c
  const dl = Math.hypot(mx, mz)
  for (let o = count - 1; o >= 0; o--) {
    const c = order[o]
    const i = c % W
    const j = (c - i) / W
    const h = m[c]
    let best = -1
    let drop = 0
    for (let dj = -1; dj <= 1; dj++) {
      const y = j + dj
      if (y < 0 || y >= H) continue
      for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue
        const x = i + di
        if (x < 0 || x >= W) continue
        const n = y * W + x
        const s = (h - m[n]) / (di && dj ? dl : di ? mx : mz)
        if (s > drop) {
          drop = s
          best = n
        }
      }
    }
    if (best >= 0 && m[best] > 0) area[best] += area[c]
  }
  return area
}

/**
 * The land map, RGBA8 on the pack's grid, as the terrain shader reads it:
 * r rain (ln(mm/300)/ln 40), g beach sand, b riparian (how much water has
 * gathered here, 0..1 on a log scale), a reserved for the cultivation layers.
 */
export function landTexture(m, rain, W, H, mx, mz) {
  const N = W * H
  const out = new Uint8Array(N * 4)
  const area = drainageArea(m, W, H, mx, mz)
  const cellKm = (mx * mz) / 1e6
  const ref = Math.max(0.04, 4 * cellKm)
  const rip = new Float32Array(N)
  for (let c = 0; c < N; c++) rip[c] = m[c] > 0 ? Math.max(0, Math.min(1, Math.log10(Math.max(1e-9, area[c]) / ref) / 1.6)) : 0
  const ripB = blur(rip, W, H, 1, 2)
  const toSea = distanceTransform(W, H, (c) => m[c] <= 0, mx, mz)
  const sand = new Float32Array(N)
  for (let j = 0; j < H; j++) {
    for (let i = 0; i < W; i++) {
      const c = j * W + i
      if (m[c] <= 0 || m[c] > 9) continue
      const ip = Math.min(W - 1, i + 1)
      const im = Math.max(0, i - 1)
      const jp = Math.min(H - 1, j + 1)
      const jm = Math.max(0, j - 1)
      const g = Math.hypot((m[j * W + ip] - m[j * W + im]) / ((ip - im) * mx), (m[jp * W + i] - m[jm * W + i]) / ((jp - jm) * mz))
      sand[c] = toSea[c] < 260 + Math.max(mx, mz) && g < 0.12 ? 1 : 0
    }
  }
  const sandB = blur(sand, W, H, 1, 1)
  // (a beach is a few tens of metres wide, so a coarse texel holds only a
  // little of one: the archipelago's 280 m texels would ring every island)
  const sandK = 1.5 * Math.min(1, 70 / Math.max(mx, mz))
  for (let c = 0; c < N; c++) {
    out[c * 4] = rain ? rain[c] : m[c] > 0 ? 82 : 0
    out[c * 4 + 1] = Math.round(255 * Math.min(1, sandB[c] * sandK))
    out[c * 4 + 2] = Math.round(255 * Math.min(1, ripB[c] * 1.6))
    out[c * 4 + 3] = 0
  }
  return out
}

/**
 * Everything a pack needs, from decoded pixels. normalExag: the exaggeration
 * the normals are baked at (the shader's uNormalE); aoExag: the occlusion's;
 * land: whether to derive the land map (null when false).
 */
export function derivePack({ heightPx, rainPx, W, H, scale, offset, mx, mz, normalExag = 2, aoExag = 1.3, land: withLand = true, stride = 4 }) {
  if (!Number.isFinite(scale) || !Number.isFinite(offset)) throw new Error('a pack needs its height scale and offset (DATA.md §2 makes both mandatory)')
  const metres = decodeHeights(heightPx, W, H, scale, offset, stride)
  const flatSea = isFlatSea(metres)
  if (flatSea) synthShelf(metres, W, H, mx, mz)
  const rain = rainPx ? decodeGrey(rainPx, W, H, stride) : null
  const ao = ambientOcclusion(metres, W, H, mx, mz, aoExag)
  const normals = packNormals(metres, W, H, mx, mz, ao, normalExag)
  const land = withLand ? landTexture(metres, rain, W, H, mx, mz) : null
  let lo = Infinity
  let hi = -Infinity
  for (let c = 0; c < metres.length; c++) {
    if (metres[c] < lo) lo = metres[c]
    if (metres[c] > hi) hi = metres[c]
  }
  return { metres, normals, land, flatSea, lo, hi, normalExag }
}
