// Hand-built models of the things people made, in metres (the Builder's
// transform scales and places them). Proportions follow descriptions and
// reconstructions: steep pili-thatch roofs on low stone paepae, heiau as
// stepped stone platforms with an ʻanuʻu tower wrapped in white kapa, koa-hull
// canoes with an ama float, walls of dry-stacked stone.

import { MAT, col } from './kit.js'
import { HEIAU } from '../gen/footing.js'

export const PALETTE = {
  thatch: '#b79560',
  thatchDark: '#8a6a3d',
  stone: '#6b625b',
  stoneDark: '#4f4844',
  wood: '#6b4a2f',
  koa: '#7a4a2a',
  kapa: '#efe8d8',
  ti: '#4f8a3a',
  salt: '#f2ece4',
  sand: '#d9c9a3',
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
  // undersides so the overhang isn't see-through
  B.quad(e2, r2, r1, e1, thD, MAT.thatch)
  B.quad(f1, r1, r2, f2, thD, MAT.thatch)
  // gable ends
  const gx = L / 2
  B.tri([-gx, eave, -W / 2], [-gx, eave, W / 2], [-gx, ridge - 0.2, 0], th, MAT.thatch)
  B.tri([gx, eave, W / 2], [gx, eave, -W / 2], [gx, ridge - 0.2, 0], th, MAT.thatch)
  // ridge cap
  B.box(0, ridge - 0.12, 0, L + 0.9, 0.35, 0.55, thD, MAT.thatch)
  if (door) {
    const dk = [0.05, 0.035, 0.025]
    B.quad([gx + 0.02, y0, -0.45], [gx + 0.02, y0 + 1.4, -0.45], [gx + 0.02, y0 + 1.4, 0.45], [gx + 0.02, y0, 0.45], dk, 0)
  }
}

/** Kiʻi: a carved post with a broad head and a crest. */
export function kii(B, x, z, h, rand) {
  const w = col(PALETTE.wood, 0.25, rand)
  B.cyl([x, 0, z], [x, h * 0.62, z], 0.22, 0.18, w, MAT.wood, 5)
  B.box(x, h * 0.6, z, 0.75, h * 0.28, 0.6, w, MAT.wood, rand() * 0.3, 0.85)
  B.box(x, h * 0.86, z, 0.35, h * 0.16, 0.35, w, MAT.wood, 0, 0.6)
}

/** ʻAnuʻu: a tall lashed frame wrapped in white kapa, where the kahuna listened. */
export function anuu(B, x, z, h, rand) {
  const k = col(PALETTE.kapa, 0.05, rand)
  const w = col(PALETTE.wood, 0.2, rand)
  B.box(x, 0, z, 2.6, h, 2.6, k, MAT.kapa, 0.1, 0.62)
  for (const [dx, dz] of [[-1.35, -1.35], [1.35, -1.35], [1.35, 1.35], [-1.35, 1.35]]) {
    B.cyl([x + dx, 0, z + dz], [x + dx * 0.55, h + 0.8, z + dz * 0.55], 0.12, 0.08, w, MAT.wood, 4)
  }
}

/** Lele: a raised offering stand on four posts. */
export function lele(B, x, z, rand) {
  const w = col(PALETTE.wood, 0.2, rand)
  for (const [dx, dz] of [[-0.9, -0.6], [0.9, -0.6], [0.9, 0.6], [-0.9, 0.6]]) B.cyl([x + dx, 0, z + dz], [x + dx, 2.6, z + dz], 0.09, 0.08, w, MAT.wood, 4)
  B.box(x, 2.5, z, 2.2, 0.18, 1.6, w, MAT.wood)
  B.blob(x, 2.85, z, 0.5, 0.25, 0.4, col('#c9a35a', 0.2, rand), MAT.plain, 1)
}

/**
 * Heiau: a stepped stone platform with a walled upper court, the ʻanuʻu, a
 * crescent of kiʻi, a lele and a hale mana; a luakini (`f.big`) is the larger.
 * `f` is its footing (gen/footing.js): the base tier's top clears the highest
 * ground under it and its walls reach the lowest, and where that leaves a tall
 * face the platform is built out in front of it in terraces, the last
 * standing on the lowest ground.
 */
export function placeHeiau(B, f, rand, S) {
  const st = col(PALETTE.stone, 0.12, rand)
  const stD = col(PALETTE.stoneDark, 0.12, rand)
  const d = f.big ? HEIAU.big : HEIAU.small
  const { L, W, tiers, rise } = d
  const big = f.big
  const { x, z, rot } = f
  // the frame's floor is where the base tier's top is a tier's rise above
  const gy = f.top - rise * S
  const local = (y) => (y - gy) / S
  B.at(x, gy, z, rot, S)
  // the terraces, the lowest first, each standing down into the one below
  // (all of the base tier's stone: where one stands into the next their side
  // faces share a plane, and two colours there would flicker)
  for (let k = f.steps.length - 1; k >= 0; k--) {
    const step = f.steps[k]
    const [a, b, c, e] = step.ext.map((v) => v / S)
    const foot = local(step.bottom)
    B.box((b - a) / 2, foot, (e - c) / 2, L + a + b, local(step.top) - foot, W + c + e, st, MAT.stone)
  }
  const foot = local(f.bottom)
  B.box(0, foot, 0, L, rise - foot, W, st, MAT.stone)
  let y = rise
  for (let t = 1; t < tiers; t++) {
    const k = 1 - t * 0.14
    B.box(0, y, 0, L * k, rise, W * k, t % 2 ? stD : st, MAT.stone)
    y += rise
  }
  const k = 1 - (tiers - 1) * 0.14
  const lx = (L * k) / 2
  const lz = (W * k) / 2
  const wallH = big ? 2.2 : 1.5
  B.box(0, y, -lz + 0.8, L * k, wallH, 1.6, stD, MAT.stone)
  B.box(0, y, lz - 0.8, L * k, wallH, 1.6, stD, MAT.stone)
  B.box(-lx + 0.8, y, 0, 1.6, wallH, W * k, stD, MAT.stone)
  B.done()
  // court furniture, lifted onto the platform
  B.at(x, gy + y * S, z, rot, S)
  anuu(B, -lx * 0.55, 0, big ? 11 : 7.5, rand)
  const n = big ? 7 : 4
  for (let i = 0; i < n; i++) {
    const a = (i / (n - 1) - 0.5) * 1.6
    kii(B, -lx * 0.55 + Math.cos(a) * (big ? 8 : 5), Math.sin(a) * (big ? 8 : 5), big ? 4.2 : 3.2, rand)
  }
  lele(B, lx * 0.15, 0, rand)
  B.done()
  // a hale mana and a drum house on the court
  B.at(x + Math.cos(rot) * lx * 0.45 * S - Math.sin(rot) * lz * 0.35 * S, gy + y * S, z + Math.sin(rot) * lx * 0.45 * S + Math.cos(rot) * lz * 0.35 * S, rot, S)
  hale(B, rand, big ? 8 : 6, big ? 5 : 4, big ? 6 : 4.5, false)
  B.done()
  return y
}

/** Waʻa: a single-hulled outrigger canoe, bow toward +x. Length in metres. */
export function waa(B, rand, len = 8) {
  const k = col(PALETTE.koa, 0.2, rand)
  const kd = col('#4a2c18', 0.2, rand)
  const w = len / 2
  // hull: a long tapered box, lifted at the ends
  B.box(0, 0, 0, len * 0.8, 0.55, 0.62, k, MAT.wood, 0, 0.9)
  B.box(w * 0.85, 0.05, 0, len * 0.2, 0.6, 0.4, kd, MAT.wood, 0, 0.5)
  B.box(-w * 0.85, 0.05, 0, len * 0.2, 0.55, 0.4, kd, MAT.wood, 0, 0.5)
  // ʻiako booms and the ama float off to port
  const amaZ = -2.4
  for (const bx of [-len * 0.15, len * 0.15]) B.cyl([bx, 0.55, 0], [bx, 0.5, amaZ], 0.06, 0.06, kd, MAT.wood, 4)
  B.box(0, 0.05, amaZ, len * 0.5, 0.28, 0.24, kd, MAT.wood, 0, 0.8)
}

/** Waʻa kaulua: the double-hulled voyaging canoe with a crab-claw sail. */
export function kaulua(B, rand, len = 18) {
  const k = col(PALETTE.koa, 0.15, rand)
  const kd = col('#4a2c18', 0.15, rand)
  for (const z of [-2.2, 2.2]) {
    B.box(0, 0, z, len * 0.82, 1.0, 1.0, k, MAT.wood, 0, 0.88)
    B.box(len * 0.45, 0.2, z, len * 0.14, 1.2, 0.6, kd, MAT.wood, 0, 0.5)
    B.box(-len * 0.45, 0.2, z, len * 0.14, 1.1, 0.6, kd, MAT.wood, 0, 0.5)
  }
  // pola deck and a little shelter
  B.box(0, 1.0, 0, len * 0.42, 0.2, 5.2, kd, MAT.wood)
  B.box(-len * 0.08, 1.2, 0, 3.2, 1.4, 2.4, col(PALETTE.thatch, 0.1, rand), MAT.thatch, 0, 0.7)
  // mast and the crab-claw sail of lauhala matting
  const sail = col('#c9ac78', 0.08, rand)
  B.cyl([len * 0.1, 1.1, 0], [len * 0.05, 9.5, 0], 0.12, 0.08, kd, MAT.wood, 4)
  B.quad([len * 0.12, 1.4, 0.05], [len * 0.36, 8.8, 0.05], [len * 0.02, 10.8, 0.05], [len * 0.05, 4.0, 0.05], sail, MAT.plain)
  B.quad([len * 0.05, 4.0, -0.05], [len * 0.02, 10.8, -0.05], [len * 0.36, 8.8, -0.05], [len * 0.12, 1.4, -0.05], sail, MAT.plain)
}

/** Hālau waʻa: a long, open-ended thatched canoe shed, opening toward +x. */
export function halau(B, rand, L = 16, W = 6) {
  const th = col(PALETTE.thatch, 0.15, rand)
  const thD = col(PALETTE.thatchDark, 0.15, rand)
  const w = col(PALETTE.wood, 0.2, rand)
  const ridge = 4.8
  const ox = L / 2
  const oz = W / 2 + 0.3
  B.quad([-ox, 0.3, -oz], [-ox, ridge, 0], [ox, ridge, 0], [ox, 0.3, -oz], th, MAT.thatch)
  B.quad([ox, 0.3, oz], [ox, ridge, 0], [-ox, ridge, 0], [-ox, 0.3, oz], th, MAT.thatch)
  B.quad([ox, 0.3, -oz], [ox, ridge, 0], [-ox, ridge, 0], [-ox, 0.3, -oz], thD, MAT.thatch)
  B.quad([-ox, 0.3, oz], [-ox, ridge, 0], [ox, ridge, 0], [ox, 0.3, oz], thD, MAT.thatch)
  // closed back, thatched on both faces
  B.tri([-ox, 0.3, oz], [-ox, 0.3, -oz], [-ox, ridge, 0], thD, MAT.thatch)
  B.tri([-ox, 0.3, -oz], [-ox, 0.3, oz], [-ox, ridge, 0], th, MAT.thatch)
  B.box(0, ridge - 0.1, 0, L + 0.4, 0.3, 0.45, thD, MAT.thatch)
  B.cyl([ox, 0, 0], [ox, ridge, 0], 0.15, 0.12, w, MAT.wood, 5)
}

/**
 * Ahu: the boundary cairn, with the carved puaʻa image set on it, on a stone
 * footing that reaches `foot` metres down to the lowest ground under it.
 */
export function ahu(B, rand, withPig = true, foot = 0.3) {
  const st = col(PALETTE.stone, 0.2, rand)
  B.box(0, -foot, 0, 3.2, foot + 0.1, 3.2, st, MAT.stone, 0, 0.92)
  for (let i = 0; i < 9; i++) {
    const a = rand() * Math.PI * 2
    const r = 1.4 * (1 - i / 10)
    B.blob(Math.cos(a) * r * 0.5, i * 0.28, Math.sin(a) * r * 0.5, 0.75, 0.45, 0.7, st, MAT.stone, i + rand())
  }
  B.box(0, 2.3, 0, 1.6, 0.25, 1.3, col('#5d5650', 0.1, rand), MAT.stone)
  if (withPig) {
    const w = col('#3b2a1e', 0.2, rand)
    B.box(0, 2.55, 0, 1.0, 0.75, 0.6, w, MAT.wood, 0, 0.8)
    B.box(0.65, 2.7, 0, 0.5, 0.35, 0.35, w, MAT.wood, 0, 0.7) // snout
    B.box(-0.2, 3.25, -0.2, 0.15, 0.3, 0.12, w, MAT.wood)
    B.box(-0.2, 3.25, 0.2, 0.15, 0.3, 0.12, w, MAT.wood)
  }
}

/** Akua loa: Lono's tall standard — a pole and crosspiece hung with kapa. */
export function akuaLoa(B, rand, h = 7) {
  const w = col(PALETTE.wood, 0.1, rand)
  const k = col(PALETTE.kapa, 0.04, rand)
  B.cyl([0, 0, 0], [0, h, 0], 0.09, 0.07, w, MAT.wood, 5)
  B.cyl([0, h * 0.82, -1.6], [0, h * 0.82, 1.6], 0.06, 0.06, w, MAT.wood, 4)
  B.quad([0.02, h * 0.82, -1.5], [0.02, h * 0.82, 1.5], [0.02, h * 0.3, 1.3], [0.02, h * 0.3, -1.3], k, MAT.kapa)
  B.quad([-0.02, h * 0.3, -1.3], [-0.02, h * 0.3, 1.3], [-0.02, h * 0.82, 1.5], [-0.02, h * 0.82, -1.5], k, MAT.kapa)
  // streamers of feathers / ferns
  B.box(0, h * 0.85, -1.55, 0.1, -1.6, 0.1, col('#e2b13c', 0.1, rand), MAT.plain)
  B.box(0, h * 0.85, 1.55, 0.1, -1.6, 0.1, col('#e2b13c', 0.1, rand), MAT.plain)
  B.blob(0, h + 0.2, 0, 0.35, 0.45, 0.35, col('#3d2c1f', 0.1, rand), MAT.wood, 2)
}

/**
 * Koʻa: a fisherman's shrine of stacked stones topped with white coral, its
 * base 0.5 m up and reaching `foot` metres down to the lowest ground.
 */
export function koa(B, rand, foot = 0.3) {
  const st = col(PALETTE.stone, 0.2, rand)
  B.box(0, -foot, 0, 3.2, 0.5 + foot, 2.4, st, MAT.stone, 0, 0.85)
  for (let i = 0; i < 5; i++) B.blob((rand() - 0.5) * 1.4, 0.7 + i * 0.25, (rand() - 0.5) * 1.0, 0.45, 0.3, 0.4, st, MAT.stone, i)
  B.blob(0, 2.0, 0, 0.45, 0.35, 0.45, col('#f3efe6', 0.05, rand), MAT.kapa, 3)
}

/** Imu: the earth oven — a low mound of stones. */
export function imu(B, rand) {
  const st = col('#4d4642', 0.2, rand)
  for (let i = 0; i < 7; i++) B.blob((rand() - 0.5) * 1.6, 0, (rand() - 0.5) * 1.6, 0.5, 0.35, 0.5, st, MAT.stone, i)
}
