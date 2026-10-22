// Hand-built models of the things people made, in metres (the Builder's
// transform scales and places them), from the ahupuaʻa app's
// features/structures.js: steep pili-thatch roofs on low stone paepae,
// koa-hull canoes with an ama float, walls of dry-stacked stone. Only what the
// district draws is kept: the heiau of features.json stand at their ahupuaʻa's
// centroid, so they are not built (DATA.md §4).

import { MAT, col } from './kit.js'

export const PALETTE = {
  thatch: '#b79560',
  thatchDark: '#8a6a3d',
  stone: '#6b625b',
  stoneDark: '#4f4844',
  wood: '#6b4a2f',
  koa: '#7a4a2a',
  pondStone: '#8a817a',
}

/**
 * A hale: stone paepae, low thatched walls, steep gable roof, door at +x. The
 * paepae's top is 0.45 m up; it reaches `foot` metres down, to the lowest
 * ground under it.
 */
export function hale(B, rand, L = 7, W = 4.6, H = 5.2, door = true, foot = 0.6) {
  const th = col(PALETTE.thatch, 0.18, rand)
  const thD = col(PALETTE.thatchDark, 0.15, rand)
  const st = col(PALETTE.stone, 0.15, rand)
  B.box(0, -foot, 0, L + 1.8, 0.45 + foot, W + 1.8, st, MAT.stone)
  const y0 = 0.45
  const eave = y0 + 1.05
  B.box(0, y0, 0, L, eave - y0, W, th, MAT.thatch)
  const ox = L / 2 + 0.35
  const oz = W / 2 + 0.45
  const ridge = y0 + H
  const e1 = [-ox, eave - 0.15, -oz]
  const e2 = [ox, eave - 0.15, -oz]
  const r1 = [-ox, ridge, 0]
  const r2 = [ox, ridge, 0]
  const f1 = [-ox, eave - 0.15, oz]
  const f2 = [ox, eave - 0.15, oz]
  B.quad(e1, r1, r2, e2, th, MAT.thatch)
  B.quad(f2, r2, r1, f1, th, MAT.thatch)
  B.quad(e2, r2, r1, e1, thD, MAT.thatch)
  B.quad(f1, r1, r2, f2, thD, MAT.thatch)
  const gx = L / 2
  B.tri([-gx, eave, -W / 2], [-gx, eave, W / 2], [-gx, ridge - 0.2, 0], th, MAT.thatch)
  B.tri([gx, eave, W / 2], [gx, eave, -W / 2], [gx, ridge - 0.2, 0], th, MAT.thatch)
  B.box(0, ridge - 0.12, 0, L + 0.9, 0.35, 0.55, thD, MAT.thatch)
  if (door) {
    const dk = [0.05, 0.035, 0.025]
    // (a shallow dark block out from the wall: as a sheet against it, it
    // fights the wall for the depth buffer from a kilometre off)
    B.box(gx + 0.15, y0, 0, 0.3, 1.4, 0.9, dk, 0)
  }
}

/** Waʻa: a single-hulled outrigger canoe, bow toward +x. Length in metres. */
export function waa(B, rand, len = 8) {
  const k = col(PALETTE.koa, 0.2, rand)
  const kd = col('#4a2c18', 0.2, rand)
  const w = len / 2
  B.box(0, 0, 0, len * 0.8, 0.55, 0.62, k, MAT.wood, 0, 0.9)
  B.box(w * 0.85, 0.05, 0, len * 0.2, 0.6, 0.4, kd, MAT.wood, 0, 0.5)
  B.box(-w * 0.85, 0.05, 0, len * 0.2, 0.55, 0.4, kd, MAT.wood, 0, 0.5)
  const amaZ = -2.4
  for (const bx of [-len * 0.15, len * 0.15]) B.cyl([bx, 0.55, 0], [bx, 0.5, amaZ], 0.06, 0.06, kd, MAT.wood, 4)
  B.box(0, 0.05, amaZ, len * 0.5, 0.28, 0.24, kd, MAT.wood, 0, 0.8)
}

/** Imu: the earth oven, a low mound of stones. */
export function imu(B, rand) {
  const st = col('#4d4642', 0.2, rand)
  for (let i = 0; i < 5; i++) B.blob((rand() - 0.5) * 1.6, 0, (rand() - 0.5) * 1.6, 0.5, 0.35, 0.5, st, MAT.stone, i)
}
