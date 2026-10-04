// Tileable 3-D noise volumes for the clouds, after Schneider's Nubis notes:
// Perlin-Worley for the billowy shapes, plain Worley for the wispy erosion
// of their edges. Both wrap seamlessly, so the GPU can repeat them forever.

import { mulberry32 } from './noise.js'

function worleyCells(cells, rand) {
  const pts = new Float32Array(cells * cells * cells * 3)
  for (let k = 0; k < pts.length; k++) pts[k] = rand()
  return pts
}

// 1 - distance to the nearest feature point, in a wrapping lattice of `cells`.
function worley(x, y, z, cells, pts) {
  const fx = x * cells
  const fy = y * cells
  const fz = z * cells
  const ix = Math.floor(fx)
  const iy = Math.floor(fy)
  const iz = Math.floor(fz)
  let best = 9
  for (let dz = -1; dz <= 1; dz++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const cx = ix + dx
        const cy = iy + dy
        const cz = iz + dz
        const wx = ((cx % cells) + cells) % cells
        const wy = ((cy % cells) + cells) % cells
        const wz = ((cz % cells) + cells) % cells
        const p = ((wz * cells + wy) * cells + wx) * 3
        const ex = cx + pts[p] - fx
        const ey = cy + pts[p + 1] - fy
        const ez = cz + pts[p + 2] - fz
        const d = ex * ex + ey * ey + ez * ez
        if (d < best) best = d
      }
    }
  }
  return 1 - Math.min(1, Math.sqrt(best))
}

function makeGrads(period, rand) {
  const g = new Float32Array(period * period * period * 3)
  for (let k = 0; k < period * period * period; k++) {
    let x, y, z, l
    do {
      x = rand() * 2 - 1
      y = rand() * 2 - 1
      z = rand() * 2 - 1
      l = x * x + y * y + z * z
    } while (l > 1 || l < 0.01)
    l = Math.sqrt(l)
    g[k * 3] = x / l
    g[k * 3 + 1] = y / l
    g[k * 3 + 2] = z / l
  }
  return g
}

const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10)

function perlin(x, y, z, period, grads) {
  const fx = x * period
  const fy = y * period
  const fz = z * period
  const ix = Math.floor(fx)
  const iy = Math.floor(fy)
  const iz = Math.floor(fz)
  const tx = fx - ix
  const ty = fy - iy
  const tz = fz - iz
  let sum = 0
  for (let c = 0; c < 8; c++) {
    const ox = c & 1
    const oy = (c >> 1) & 1
    const oz = (c >> 2) & 1
    const gx = (((ix + ox) % period) + period) % period
    const gy = (((iy + oy) % period) + period) % period
    const gz = (((iz + oz) % period) + period) % period
    const g = ((gz * period + gy) * period + gx) * 3
    const dx = tx - ox
    const dy = ty - oy
    const dz = tz - oz
    const dot = grads[g] * dx + grads[g + 1] * dy + grads[g + 2] * dz
    const wx = ox ? fade(tx) : 1 - fade(tx)
    const wy = oy ? fade(ty) : 1 - fade(ty)
    const wz = oz ? fade(tz) : 1 - fade(tz)
    sum += dot * wx * wy * wz
  }
  return sum
}

const remap = (v, a, b, c, d) => c + ((v - a) / (b - a)) * (d - c)

export function cloudNoise(seed) {
  const rand = mulberry32(seed + 3131)
  // shape: 64³ Perlin-Worley
  const S = 64
  const shape = new Uint8Array(S * S * S)
  const wA = worleyCells(4, rand)
  const wB = worleyCells(8, rand)
  const wC = worleyCells(16, rand)
  const gA = makeGrads(4, rand)
  const gB = makeGrads(8, rand)
  const gC = makeGrads(16, rand)
  for (let z = 0; z < S; z++) {
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        const u = (x + 0.5) / S
        const v = (y + 0.5) / S
        const w = (z + 0.5) / S
        const p = perlin(u, v, w, 4, gA) * 0.6 + perlin(u, v, w, 8, gB) * 0.3 + perlin(u, v, w, 16, gC) * 0.15
        const pn = Math.min(1, Math.max(0, p * 0.9 + 0.5))
        const wor = worley(u, v, w, 4, wA) * 0.625 + worley(u, v, w, 8, wB) * 0.25 + worley(u, v, w, 16, wC) * 0.125
        const pw = Math.min(1, Math.max(0, remap(pn, wor - 1, 1, 0, 1)))
        shape[(z * S + y) * S + x] = Math.round(255 * Math.min(1, pw * 0.55 + wor * 0.45))
      }
    }
  }
  // detail: 32³ Worley fbm
  const D = 32
  const detail = new Uint8Array(D * D * D)
  const dA = worleyCells(4, rand)
  const dB = worleyCells(8, rand)
  const dC = worleyCells(16, rand)
  for (let z = 0; z < D; z++) {
    for (let y = 0; y < D; y++) {
      for (let x = 0; x < D; x++) {
        const u = (x + 0.5) / D
        const v = (y + 0.5) / D
        const w = (z + 0.5) / D
        const wor = worley(u, v, w, 4, dA) * 0.625 + worley(u, v, w, 8, dB) * 0.25 + worley(u, v, w, 16, dC) * 0.125
        detail[(z * D + y) * D + x] = Math.round(255 * wor)
      }
    }
  }
  return { shape, shapeSize: S, detail, detailSize: D }
}
