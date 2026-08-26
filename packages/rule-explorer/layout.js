// Deterministic layout for a functional graph (basin-of-attraction field).
//
// A force-directed layout is the wrong tool here: it has to *discover* structure
// that we already know exactly. Every component of a functional graph has one
// attractor cycle with transient trees draining into it, so we can draw the
// canonical picture directly:
//
//   • the attractor cycle becomes a literal ring in the z = 0 plane, so a
//     period-7 orbit *looks* like a 7-gon;
//   • each transient node sits at height z = (steps to the attractor) * levelHeight,
//     so every edge points strictly downhill and the flow of time reads as gravity;
//   • trees fan out in the angular wedge belonging to the cycle node they drain
//     into, subdivided among subtrees by leaf count, so siblings never cross;
//   • the ring radius at each level grows to whatever that level's population
//     needs, giving each basin a flared cone/funnel silhouette;
//   • components are packed as disjoint disks in the plane, so N basins read as
//     N separate objects instead of one interpenetrating hairball.

const TAU = Math.PI * 2

export function layoutGraph(a, opts = {}) {
  const nodeSpacing = opts.nodeSpacing ?? 13
  const levelHeight = opts.levelHeight ?? 16
  const pad = opts.pad ?? nodeSpacing * 1.3

  const { M, succ, rev, onCycle, compOf, dist, maxDist, nComp } = a

  // --- children in the transient forest -------------------------------------
  // Predecessors that are not themselves on a cycle. (A cycle node's only
  // cycle-predecessor is the incoming ring edge, which the ring already draws.)
  const kids = new Array(M)
  for (let v = 0; v < M; v++) {
    const pre = rev[v]
    let n = 0
    for (let i = 0; i < pre.length; i++) if (!onCycle[pre[i]]) n++
    const arr = new Int32Array(n)
    let k = 0
    for (let i = 0; i < pre.length; i++) if (!onCycle[pre[i]]) arr[k++] = pre[i]
    kids[v] = arr
  }

  // --- bucket nodes by depth (children always sit one level deeper) ----------
  const byDepth = Array.from({ length: maxDist + 1 }, () => [])
  for (let v = 0; v < M; v++) byDepth[dist[v]].push(v)

  // --- subtree leaf weight, deepest level first so children precede parents --
  const weight = new Float64Array(M)
  for (let d = maxDist; d >= 0; d--) {
    for (const v of byDepth[d]) {
      const ch = kids[v]
      if (ch.length === 0) { weight[v] = 1; continue }
      let w = 0
      for (let i = 0; i < ch.length; i++) w += weight[ch[i]]
      weight[v] = w
    }
  }

  // --- per-component cycle order + level histogram --------------------------
  const comps = new Array(nComp)
  for (let c = 0; c < nComp; c++) comps[c] = { cycle: [], levels: [], height: 0, radius: 0, r: null }
  for (let v = 0; v < M; v++) {
    const c = comps[compOf[v]]
    const d = dist[v]
    c.levels[d] = (c.levels[d] || 0) + 1
    if (d > c.height) c.height = d
  }
  const walked = new Uint8Array(M)
  for (let v = 0; v < M; v++) {
    if (!onCycle[v] || walked[v]) continue
    const c = comps[compOf[v]]
    let u = v
    do { c.cycle.push(u); walked[u] = 1; u = succ[u] } while (u !== v)
  }

  // --- ring radius per level ------------------------------------------------
  // Each level needs enough circumference to seat its population, and radii are
  // non-decreasing with depth so the basin flares rather than pinching.
  for (const c of comps) {
    const L = c.cycle.length
    const rr = new Float64Array(c.height + 1)
    let widest = 0
    for (let d = 0; d <= c.height; d++) {
      const n = c.levels[d] || 0
      let need = (n * nodeSpacing) / TAU
      if (d === 0 && L <= 1) need = 0 // a fixed point sits dead centre
      rr[d] = d === 0 ? need : Math.max(need, rr[d - 1] + nodeSpacing * 0.35)
      if (rr[d] > widest) widest = rr[d]
    }
    c.r = rr
    c.radius = Math.max(widest, nodeSpacing * 0.5)
  }

  // --- angular assignment ---------------------------------------------------
  const angle = new Float64Array(M)
  const wlo = new Float64Array(M)
  const whi = new Float64Array(M)
  for (const c of comps) {
    const L = c.cycle.length
    const span = TAU / L
    for (let k = 0; k < L; k++) {
      const v = c.cycle[k]
      const th = L === 1 ? 0 : k * span
      angle[v] = th
      wlo[v] = th - span / 2
      whi[v] = th + span / 2
    }
  }
  // Hand each node's wedge down to its children, split by subtree weight.
  for (let d = 0; d <= maxDist; d++) {
    for (const v of byDepth[d]) {
      const ch = kids[v]
      if (ch.length === 0) continue
      let total = 0
      for (let i = 0; i < ch.length; i++) total += weight[ch[i]]
      const width = whi[v] - wlo[v]
      let cur = wlo[v]
      for (let i = 0; i < ch.length; i++) {
        const w = (weight[ch[i]] / total) * width
        const u = ch[i]
        wlo[u] = cur
        whi[u] = cur + w
        angle[u] = cur + w / 2
        cur += w
      }
    }
  }

  // --- pack the basins as disjoint disks in the plane ------------------------
  const centers = packDisks(comps.map((c) => c.radius), pad)

  const positions = new Float32Array(M * 3)
  for (let v = 0; v < M; v++) {
    const ci = compOf[v]
    const c = comps[ci]
    const ctr = centers[ci]
    const d = dist[v]
    const r = c.r[d]
    positions[v * 3] = ctr.x + r * Math.cos(angle[v])
    positions[v * 3 + 1] = ctr.y + r * Math.sin(angle[v])
    positions[v * 3 + 2] = d * levelHeight
  }

  return { positions, comps, centers, nodeSpacing, levelHeight }
}

/**
 * Greedy disk packing along a phyllotaxis spiral: largest first, each disk taking
 * the first spiral sample that clears everything already placed.
 *
 * Placed disks go into a spatial hash whose cell is twice the largest radius, so
 * a candidate can only overlap something in its own or an adjacent cell and the
 * collision test stays O(1). Rules like 204 (identity) make every one of the 2^N
 * states its own basin, so this runs at n = 4096 and a naive O(n^2) scan costs
 * seconds.
 */
function packDisks(radii, pad) {
  const n = radii.length
  if (n === 1) return [{ x: 0, y: 0 }]

  const GOLDEN = Math.PI * (3 - Math.sqrt(5))
  let sq = 0
  let maxR = 0
  for (const r0 of radii) {
    const r = r0 + pad
    sq += r * r
    if (r > maxR) maxR = r
  }
  const step = Math.max(1e-3, 0.85 * Math.sqrt(sq / n))
  const cell = 2 * maxR
  const grid = new Map()
  const keyOf = (i, j) => (i + 32768) * 65536 + (j + 32768)

  const fits = (x, y, r) => {
    const ci = Math.floor(x / cell)
    const cj = Math.floor(y / cell)
    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        const b = grid.get(keyOf(ci + di, cj + dj))
        if (!b) continue
        for (let p = 0; p < b.length; p++) {
          const q = b[p]
          const dx = x - q.x
          const dy = y - q.y
          const rr = r + q.r
          if (dx * dx + dy * dy < rr * rr) return false
        }
      }
    }
    return true
  }

  const order = Array.from({ length: n }, (_, i) => i).sort((i, j) => radii[j] - radii[i])
  const out = new Array(n)
  let cursor = 0
  let prevR = Infinity

  for (const idx of order) {
    const r = radii[idx] + pad
    // Disks only shrink as we go, so resume the spiral near the last hit. A disk
    // no smaller than its predecessor cannot fit in a gap the predecessor already
    // rejected, so it skips the backtrack entirely — which is the whole cost for
    // rules like 204 where all 2^N basins are the same size.
    let t = r < prevR ? Math.max(0, cursor - 32) : cursor + 1
    prevR = r
    for (;;) {
      const ang = t * GOLDEN
      const rad = step * Math.sqrt(t)
      const x = rad * Math.cos(ang)
      const y = rad * Math.sin(ang)
      if (fits(x, y, r)) {
        out[idx] = { x, y }
        const k = keyOf(Math.floor(x / cell), Math.floor(y / cell))
        let b = grid.get(k)
        if (!b) { b = []; grid.set(k, b) }
        b.push({ x, y, r })
        cursor = t
        break
      }
      t++
    }
  }
  return out
}

// --- sequential depth ramp (inferno) ----------------------------------------
// Attractors run hot/bright, deep transients cool to violet. One ordered ramp
// beats per-component hues: the basins are already separated by geometry, so
// colour is free to encode "how far from the attractor am I".
const RAMP = [
  [0.0, 0x18, 0x0a, 0x3c],
  [0.16, 0x40, 0x0a, 0x67],
  [0.32, 0x6b, 0x18, 0x6e],
  [0.48, 0x9c, 0x27, 0x63],
  [0.62, 0xc7, 0x3d, 0x4d],
  [0.76, 0xe8, 0x62, 0x2c],
  [0.88, 0xf9, 0x99, 0x0a],
  [1.0, 0xfd, 0xef, 0xa2],
]

/**
 * Map v in [0,1] (1 = attractor) to rgb in 0..1, written straight into `out` at
 * `o`. Writing in place rather than returning a triple avoids one allocation per
 * node, which at 65k nodes is the difference between smooth and janky.
 */
export function depthColor(v, out, o) {
  const t = v <= 0 ? 0 : v >= 1 ? 1 : v
  let i = 0
  while (i < RAMP.length - 2 && t > RAMP[i + 1][0]) i++
  const a = RAMP[i]
  const b = RAMP[i + 1]
  const k = (t - a[0]) / (b[0] - a[0])
  out[o] = (a[1] + (b[1] - a[1]) * k) / 255
  out[o + 1] = (a[2] + (b[2] - a[2]) * k) / 255
  out[o + 2] = (a[3] + (b[3] - a[3]) * k) / 255
}
