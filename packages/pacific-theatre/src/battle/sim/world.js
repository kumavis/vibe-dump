// The ground for the sim (ENGINEERING.md §5 world.js): the decoded box pack
// sampled bilinearly exactly as render/pack.js PackTerrain.metresAt (and the
// shader's rectMetres) do, so the terrain an aircraft hits is the terrain on
// screen; beyond the pack's rect a flat −4,000 m sea. Lines of sight march
// the segment over the heights for the AA and the lookouts.

const OUTSIDE = -4000

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
  return { metresAt, heightAt, exaggeration: exag, lineOfSight, rect }
}
