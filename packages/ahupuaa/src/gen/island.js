// The island before rain gets to it: two shield volcanoes, joined at a saddle.
//
// The shape borrows the anatomy every Hawaiian high island shares rather than
// any one island's outline — an older, lower, drier shield to the west-northwest
// (the chain gets older that way), a younger main shield whose summit sits just
// under the trade-wind inversion so the clouds pile up on it, rift-zone ridges
// that stretch both volcanoes along the chain, and a saddle plain between them
// opening onto a sheltered southern bay.

import { makeSimplex, fbm, smoothstep } from './noise.js'
import { toWorld } from './grid.js'

export const SHIELDS = [
  // The main shield. Summit just below the inversion, so clouds bank against it.
  { x: 32, z: -12, a: 96, b: 60, angle: 42, H: 1700, age: 1.0, rift: [96, 1.0] },
  // The old shield: lower, drier, longer exposed to rain.
  { x: -64, z: 30, a: 60, b: 44, angle: 34, H: 1090, age: 1.45, rift: [64, 0.8] },
]

// smooth max, so the two shields meet in a saddle rather than a crease
function smax(a, b, k) {
  const h = Math.max(k - Math.abs(a - b), 0) / k
  return Math.max(a, b) + h * h * k * 0.25
}

function shieldHeight(s, x, z, warpX, warpZ) {
  const ca = Math.cos((s.angle * Math.PI) / 180)
  const sa = Math.sin((s.angle * Math.PI) / 180)
  const dx = x + warpX - s.x
  const dz = z + warpZ - s.z
  const u = dx * ca + dz * sa // along the rift axis
  const v = -dx * sa + dz * ca // across it
  const r = Math.sqrt((u / s.a) ** 2 + (v / s.b) ** 2)
  // Convex dome near the summit, flattening onto a coastal plain at r = 1, then
  // falling away under the sea.
  let h
  if (r < 1) {
    const t = 1 - r * r
    h = s.H * (0.88 * Math.pow(t, 1.45) + 0.12 * (1 - r))
  } else {
    h = -s.H * 0.12 * (r - 1) - 900 * smoothstep(1.0, 1.9, r)
  }
  // Rift-zone ridges: a narrow crest running out along the axis both ways,
  // dying away before it reaches the tips.
  const [len, amp] = s.rift
  const along = Math.abs(u) / len
  const ridge = Math.exp(-((v / (s.b * 0.22)) ** 2)) * Math.max(0, 1 - along) ** 1.6
  h += ridge * s.H * 0.16 * amp * smoothstep(0.05, 0.35, along)
  return h
}

/**
 * Pre-erosion heights (m) on an N×N grid, plus an erodibility multiplier per
 * cell — the old shield has been under the rain longer, so it carves faster.
 */
export function baseShape(N, seed) {
  const warpA = makeSimplex(seed + 11)
  const warpB = makeSimplex(seed + 12)
  const lump = makeSimplex(seed + 13)
  const lobe = makeSimplex(seed + 14)
  const height = new Float32Array(N * N)
  const age = new Float32Array(N * N)
  const [main, old] = SHIELDS
  for (let j = 0; j < N; j++) {
    const z = toWorld(N, j)
    for (let i = 0; i < N; i++) {
      const x = toWorld(N, i)
      // Domain warp: the coastline wanders by a kilometre or two.
      const wx = 14 * fbm(warpA, x / 70, z / 70, 4)
      const wz = 14 * fbm(warpB, x / 70 + 31.7, z / 70 - 12.1, 4)
      const h1 = shieldHeight(main, x, z, wx, wz)
      const h2 = shieldHeight(old, x, z, wx * 1.2, wz * 1.2)
      let h = smax(h1, h2, 260)

      // The southern bay between the shields, and a shallower windward bay on
      // the main shield's northeast flank where the lagoon will sit.
      const bayS = Math.exp(-(((x + 8) / 24) ** 2 + ((z - 62) / 22) ** 2))
      const bayNE = Math.exp(-(((x - 70) / 30) ** 2 + ((z + 52) / 18) ** 2))
      h -= bayS * 260 + bayNE * 150

      // Broad lumps and lava-flow lobes so slopes aren't perfectly conical.
      const land = smoothstep(-200, 300, h)
      h += 70 * fbm(lump, x / 45, z / 45, 4) * land
      h += 35 * fbm(lobe, x / 14, z / 14, 3) * land * smoothstep(0, 800, h)

      height[j * N + i] = h
      const dOld = Math.hypot((x - old.x) / old.a, (z - old.z) / old.b)
      const dMain = Math.hypot((x - main.x) / main.a, (z - main.z) / main.b)
      age[j * N + i] = dOld < dMain ? old.age : main.age
    }
  }
  return { height, age }
}
