// The ground for the sim (ENGINEERING.md §5 world.js): the decoded box pack
// sampled bilinearly exactly as render/pack.js PackTerrain.metresAt (and the
// shader's rectMetres) do, so the terrain an aircraft hits is the terrain on
// screen; beyond the pack's rect a flat −4,000 m sea. Lines of sight march
// the segment over the heights for the AA and the lookouts.

const OUTSIDE = -4000
const PYRAMIDS = new WeakMap() // a pack's max pyramid, kept while its heights are (a rebuilt sim reuses it)

/**
 * ground: { metres: Float32Array (row 0 north), W, H, rect: { x0, z0, x1, z1 },
 * exaggeration } or null (an open sea everywhere).
 */
export function createWorld(ground) {
  if (!ground || !ground.metres) {
    return {
      metresAt: () => OUTSIDE,
      heightAt: () => 0,
      exaggeration: 1,
      lineOfSight: () => true,
      maxIn: () => OUTSIDE,
      rect: null,
    }
  }
  const { metres, W, H, rect } = ground
  const exag = ground.exaggeration ?? 1
  const sx = W / (rect.x1 - rect.x0)
  const sz = H / (rect.z1 - rect.z0)
  function metresAt(x, z) {
    if (x < rect.x0 || z < rect.z0 || x > rect.x1 || z > rect.z1) return OUTSIDE
    let fx = (x - rect.x0) * sx - 0.5
    let fz = (z - rect.z0) * sz - 0.5
    if (fx < 0) fx = 0
    else if (fx > W - 1.001) fx = W - 1.001
    if (fz < 0) fz = 0
    else if (fz > H - 1.001) fz = H - 1.001
    const i = fx | 0
    const j = fz | 0
    const tx = fx - i
    const tz = fz - j
    const k = j * W + i
    const a = metres[k] + (metres[k + 1] - metres[k]) * tx
    const b = metres[k + W] + (metres[k + W + 1] - metres[k + W]) * tx
    return a + (b - a) * tz
  }
  /** World y of the ground or the sea surface (never below 0), at the box's one exaggeration. */
  const heightAt = (x, z) => Math.max(0, metresAt(x, z)) * exag
  /** Whether the straight line from a to b ({x, y, z}) clears the ground, sampled every `step` metres. */
  function lineOfSight(a, b, step = 150) {
    const d = Math.hypot(b.x - a.x, b.z - a.z)
    const n = Math.max(2, Math.min(200, Math.ceil(d / step)))
    for (let k = 1; k < n; k++) {
      const t = k / n
      const x = a.x + (b.x - a.x) * t
      const z = a.z + (b.z - a.z) * t
      const y = a.y + (b.y - a.y) * t
      if (heightAt(x, z) > y) return false
    }
    return true
  }
  // The highest ground under a rectangle, for the record's clearance over land (record.js clearGround): a
  // max pyramid of the pack from 4 × 4 blocks up, built on the first query. A query reads every pixel
  // whose bilinear support reaches into the rectangle, so no point inside it stands higher than the answer.
  let pyramid = PYRAMIDS.get(metres) || null
  function buildPyramid() {
    const levels = []
    let w = Math.ceil(W / 4)
    let h = Math.ceil(H / 4)
    let cur = new Float32Array(w * h).fill(OUTSIDE)
    for (let j = 0; j < H; j++) {
      const row = (j >> 2) * w
      for (let i = 0; i < W; i++) {
        const v = metres[j * W + i]
        const c = row + (i >> 2)
        if (v > cur[c]) cur[c] = v
      }
    }
    levels[2] = { a: cur, w, h }
    for (let L = 3; w > 1 || h > 1; L++) {
      const pw = w
      const ph = h
      const prev = cur
      w = Math.ceil(w / 2)
      h = Math.ceil(h / 2)
      cur = new Float32Array(w * h).fill(OUTSIDE)
      for (let j = 0; j < ph; j++) {
        for (let i = 0; i < pw; i++) {
          const v = prev[j * pw + i]
          const c = (j >> 1) * w + (i >> 1)
          if (v > cur[c]) cur[c] = v
        }
      }
      levels[L] = { a: cur, w, h }
    }
    return levels
  }
  /** The highest metres the ground reaches anywhere in the rectangle [x0, x1] × [z0, z1] (OUTSIDE wholly beyond the pack). */
  function maxIn(x0, z0, x1, z1) {
    if (x1 < rect.x0 || z1 < rect.z0 || x0 > rect.x1 || z0 > rect.z1) return OUTSIDE
    const px = (x) => Math.min(W - 1.001, Math.max(0, (x - rect.x0) * sx - 0.5)) | 0
    const pz = (z) => Math.min(H - 1.001, Math.max(0, (z - rect.z0) * sz - 0.5)) | 0
    const i0 = px(x0)
    const i1 = Math.min(W - 1, px(x1) + 1)
    const j0 = pz(z0)
    const j1 = Math.min(H - 1, pz(z1) + 1)
    const span = Math.max(i1 - i0, j1 - j0) + 1
    let m = OUTSIDE
    if (span <= 8) {
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) if (metres[j * W + i] > m) m = metres[j * W + i]
      return m
    }
    if (!pyramid) PYRAMIDS.set(metres, (pyramid = buildPyramid()))
    let L = Math.max(2, Math.ceil(Math.log2(span)) - 1)
    while (!pyramid[L]) L--
    const { a, w } = pyramid[L]
    for (let j = j0 >> L; j <= j1 >> L; j++) for (let i = i0 >> L; i <= i1 >> L; i++) if (a[j * w + i] > m) m = a[j * w + i]
    return m
  }
  return { metresAt, heightAt, exaggeration: exag, lineOfSight, maxIn, rect }
}
