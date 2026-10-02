// The floor plan: where every pair of blocks sits, and where the eight
// field diagrams are printed underneath them. World units are block widths;
// x runs right, z runs toward the viewer, y is up.

export const BOUNDS = { x0: -21, x1: 21, z0: -14.5, z1: 14.5 }

// Gap between the two blocks of a word. A vertical (top-to-bottom) word needs
// more: its blocks tumble toward each other, and at 45° a cube reaches 0.707
// out from its centre — further than a 0.1 gap leaves room for.
export const GAP = { h: 0.12, v: 0.24 }

export function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function layoutPairs(rng) {
  const cols = 9
  const rows = 8
  const cw = (BOUNDS.x1 - BOUNDS.x0) / cols
  const ch = (BOUNDS.z1 - BOUNDS.z0) / rows
  const pairs = []
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      // A few holes keep the grid from reading as a grid.
      if (rng() < 0.08) continue
      const dir = rng() < 0.3 ? 'v' : 'h'
      const x = BOUNDS.x0 + (i + 0.5) * cw + (rng() - 0.5) * 1.3
      const z = BOUNDS.z0 + (j + 0.5) * ch + (rng() - 0.5) * (dir === 'v' ? 0.5 : 0.9)
      pairs.push({ x, z, dir })
    }
  }
  return pairs
}

// Tile centres for a pair: first character left (across) or top (down).
export function tileOffsets(dir) {
  const d = (1 + GAP[dir]) / 2
  return dir === 'h'
    ? [
        [-d, 0],
        [d, 0],
      ]
    : [
        [0, -d],
        [0, d],
      ]
}

// Each field gets one diagram. They are laid out on a loose 4×2 grid so every
// part of the floor is near a few of them, sized so neighbours overlap a
// little — background, not tiles.
const KINDS = { n: 'ripples', t: 'dial', l: 'grid', m: 'spiral', h: 'venn', w: 'genko', p: 'crowd', o: 'blueprint' }

export function layoutFeatures(rng, fieldKeys) {
  const order = [...fieldKeys]
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  const xs = [-15, -5, 5, 15]
  const zs = [-6.5, 6.5]
  const features = []
  order.forEach((field, k) => {
    const x = xs[k % 4] + (rng() - 0.5) * 3
    const z = zs[Math.floor(k / 4)] + (rng() - 0.5) * 2.5 + (k % 2 ? 1 : -1)
    const r = 3.6 + rng() * 1.3
    features.push(makeFeature(field, KINDS[field], x, z, r, rng))
  })
  return features
}

function makeFeature(field, kind, x, z, r, rng) {
  const f = { field, kind, x, z, r, phase: rng() * Math.PI * 2, spin: rng() < 0.5 ? -1 : 1 }
  if (kind === 'grid') {
    f.hw = r
    f.hh = r * 0.86
  } else if (kind === 'genko') {
    f.cell = 0.46
    f.cols = Math.round((r * 2) / f.cell / 2) * 2 + 1 // odd: the fold sits in the middle column
    f.rows = Math.round((r * 1.35) / f.cell)
    f.hw = (f.cols * f.cell) / 2
    f.hh = (f.rows * f.cell) / 2
  } else if (kind === 'blueprint') {
    f.hw = r * 0.82
    f.hh = r * 0.82
  }
  return f
}

// Where a line from (px, pz) should land on the feature's outline: the nearest
// point on the circle, or on the rectangle's border.
export function featureAnchor(f, px, pz) {
  if (f.hw != null) {
    const dx = px - f.x
    const dz = pz - f.z
    const inside = Math.abs(dx) <= f.hw && Math.abs(dz) <= f.hh
    if (!inside) {
      return [f.x + Math.max(-f.hw, Math.min(f.hw, dx)), f.z + Math.max(-f.hh, Math.min(f.hh, dz))]
    }
    // Inside: out to the nearest side.
    const gx = f.hw - Math.abs(dx)
    const gz = f.hh - Math.abs(dz)
    return gx < gz ? [f.x + Math.sign(dx || 1) * f.hw, pz] : [px, f.z + Math.sign(dz || 1) * f.hh]
  }
  const dx = px - f.x
  const dz = pz - f.z
  const d = Math.hypot(dx, dz) || 1
  return [f.x + (dx / d) * f.r, f.z + (dz / d) * f.r]
}
