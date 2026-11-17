// Houmuwu ding — drawing helpers shared by the wall, leg and handle panels.
// Everything is authored in panel MILLIMETRES through a kit.companions Sheet
// whose frame unit is 1 mm, so the measurements in reference/houmuwu-ding/
// dossier.md can be typed in directly (x from the axis, y from a band's
// bottom edge).

/** Relief levels measured on the object (dossier §b.7, §c.7). */
export const LEVELS = {
  wall: { motif: 3, boss: 7.5, groove: 0.8 }, // L1 plateau 3 mm, eye bosses 7–8 above the ground, grooves 0.8
  leg: { motif: 6.5, boss: 10, groove: 0.9 }, // V-b sculptural leg masks, 6–10 mm
  handle: { motif: 6, boss: 9, groove: 0.9 }, // tigers 5–8 mm proud
}

/**
 * Leiwen ground: 1.9 mm pitch, squared, ≈ 0.9 mm deep (dossier §c.7). Discrete square
 * whorls of 4–5 turns (cells ≈ 12–22 mm, the turn cap keeps them whorls rather than a
 * maze), few S-pairs; slightly wide grooves so the ground reads dark at vessel distance.
 */
export const GROUND = { pitch: 1.9, line: 0.54, roundness: 0.18, depth: 1.0, jitter: 0.07, cell: [12, 22], turns: 5, fillers: true, pairs: 0.1, maxAspect: 1.6 }

/** Style V-a, sparse: flat plateau, ONE incised contour line inset ≈ 2.2 mm, ≈ 0.8 wide. */
export function style(relief, extra = {}) {
  return { style: 'relief', carving: 'sparse', lineWeight: 0.85, echoInset: 2.2, irregularity: 1, seed: 0, relief, ...extra }
}

/**
 * A Sheet whose local unit is 1 mm. `flip` mirrors x inside rect (author facing
 * +x, flip to face −x).
 */
export function sheet(kit, rect, { flip = false, seed = 1, wobble = 0.25 } = {}) {
  const C = kit.companions
  const f = C.makeFrame(rect, { unit: 1, flip })
  return new C.Sheet(f, { rng: new kit.Rng(seed), wobble })
}

/** Squared-round polyline through corner points (radius r mm). */
export function sq(kit, pts, r = 5) {
  return kit.shapes.resample(kit.shapes.fillet(pts, r), 0.8)
}

/** Draw a sheet into the panel, clipped to `clip` (panel mm rect). */
export function render(kit, panel, S, p, clip) {
  kit.companions.renderSheet(panel, S, p, { clip: clip ? kit.companions.rectClip(clip) : null })
}

/** A band of hooks ⌐ standing on a line: n hooks between x0 and x1 at y, pointing up (+1) or down (−1). */
export function hookRow(kit, S, x0, x1, y, n, { up = 1, h = 13, back = 8, w = 5, dir = -1 } = {}) {
  const step = (x1 - x0) / Math.max(1, n)
  for (let i = 0; i < n; i++) {
    const x = x0 + step * (i + 0.5)
    S.band(sq(kit, [[x, y], [x, y + up * h], [x + dir * back, y + up * h], [x + dir * back, y + up * (h - 6)]], 2.5), w)
  }
}

/**
 * Squared spiral polyline turning inward inside the box [x0, y0, x1, y1]: starts at the
 * top-right corner heading left (anticlockwise), one side shorter by `p` each half turn.
 * flipX / flipY mirror it inside the box (start at top-left / bottom-right …).
 */
export function sqSpiralBox([x0, y0, x1, y1], p, turns, { flipX = false, flipY = false } = {}) {
  const pts = []
  for (let i = 0; i < turns; i++) {
    const a = x0 + i * p, b = y0 + i * p, c = x1 - i * p, d = y1 - i * p
    if (c - a < p * 0.6 || d - b < p * 0.6) break
    if (i === 0) pts.push([c, d])
    pts.push([a, d], [a, b], [c, b], [c, d - p])
  }
  const last = pts[pts.length - 1], prev = pts[pts.length - 2]
  if (last && prev) last[1] = Math.max(last[1], prev[1] + p * 0.9)
  return pts.map(([x, y]) => [flipX ? x0 + x1 - x : x, flipY ? y0 + y1 - y : y])
}

/** Rectangle helpers. */
export const rect = (x, y, w, h) => ({ x, y, w, h })
export const inset = (r, l, b = l, rr = l, t = b) => ({ x: r.x + l, y: r.y + b, w: r.w - l - rr, h: r.h - b - t })
