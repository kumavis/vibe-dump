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

// --- vessels (DATA.md "Vessels and crowds"): bow toward +x, the waterline at y 0 ---------

/** A thin upright blade between an outer and an inner curve [x, y], at z, t thick: a canoe's end piece. */
function blade(B, outer, inner, z, t, c, mat) {
  const a = z - t / 2
  const b = z + t / 2
  for (let i = 0; i + 1 < outer.length; i++) {
    const [o0, o1, i0, i1] = [outer[i], outer[i + 1], inner[i], inner[i + 1]]
    B.quad([o0[0], o0[1], b], [o1[0], o1[1], b], [i1[0], i1[1], b], [i0[0], i0[1], b], c, mat)
    B.quad([i0[0], i0[1], a], [i1[0], i1[1], a], [o1[0], o1[1], a], [o0[0], o0[1], a], c, mat)
    B.quad([o0[0], o0[1], a], [o1[0], o1[1], a], [o1[0], o1[1], b], [o0[0], o0[1], b], c, mat)
    B.quad([i0[0], i0[1], b], [i1[0], i1[1], b], [i1[0], i1[1], a], [i0[0], i0[1], a], c, mat)
  }
}

/**
 * A lofted hull along x, from -L/2 to L/2, centred at z: `half(t)` its half
 * width and `sheer(t)` its gunwale's height (t from -1 at the stern to 1 at
 * the bow), `keel(t)` its depth below the water; decked over at the gunwale.
 */
function hullLoft(B, L, z, half, sheer, keel, c, deck, n = 16) {
  const st = []
  for (let k = 0; k <= n; k++) {
    const t = -1 + (2 * k) / n
    const x = (t * L) / 2
    const w = half(t)
    const s = sheer(t)
    const d = keel(t)
    st.push([[x, s, z - w], [x, 0.2 * s, z - w * 0.92], [x, d, z], [x, 0.2 * s, z + w * 0.92], [x, s, z + w]])
  }
  for (let k = 0; k < n; k++) {
    const A = st[k]
    const Bq = st[k + 1]
    for (let j = 0; j < 4; j++) B.quad(A[j], Bq[j], Bq[j + 1], A[j + 1], c, MAT.wood)
    B.quad(A[4], Bq[4], Bq[0], A[0], deck, MAT.wood)
  }
}

/**
 * Waʻa kaulua, the double-hulled voyaging canoe, as the photographs of
 * Hōkūleʻa in 1975–76 show her: two hulls with a rising sheer and the tall
 * upswept end pieces at bow and stern, ʻiako across them, a deck between
 * with a low hale amidships and a rail, two masts, the steering paddle
 * aft. `o`: { length, beam, masts, sails, colours: { hull, sail, deck, trim } };
 * `part`: 'hull' (all but the sails), 'set' (each crab-claw sail spread
 * between its two spars, trimmed and drawing) or 'furled' (the spars
 * brought together, the cloth rolled along the boom). The hull part returns
 * where the crew stand: [x, y, z] in metres.
 */
export function waaKaulua(B, rand, o = {}, part = 'hull') {
  const L = o.length || 19
  const beam = o.beam || L * 0.28
  const nm = Math.max(1, Math.min(3, o.masts || 2))
  const ns = Math.max(0, Math.min(nm, o.sails ?? nm))
  const hullC = col(o.colours?.hull || '#2b2622', 0.06, rand)
  const trimC = col(o.colours?.trim || '#5a3e2a', 0.08, rand)
  const deckC = col(o.colours?.deck || '#8a6a46', 0.08, rand)
  const sailC = col(o.colours?.sail || '#e6dcc3', 0.04, rand)
  const spar = col('#6b4a2f', 0.1, rand)
  const hw = Math.max(0.45, beam * 0.11)
  const zc = beam / 2 - hw
  const sheer = (t) => 0.85 + 0.55 * Math.abs(t) ** 3
  const deckY = sheer(0) + 0.3
  const mastX = nm === 1 ? [0.05 * L] : nm === 2 ? [0.17 * L, -0.13 * L] : [0.25 * L, 0, -0.22 * L]
  if (part === 'hull') {
    for (const z of [-zc, zc]) {
      hullLoft(B, L, z, (t) => hw * Math.pow(Math.max(0, 1 - Math.abs(t) ** 2.4), 0.55), sheer, (t) => -0.75 * (1 - t * t) - 0.05, hullC, trimC)
      // the end pieces: rising from the hull's tip, curving up and a little back
      for (const sgn of [1, -1]) {
        const x0 = (sgn * L) / 2
        const h0 = sheer(sgn)
        const tall = sgn > 0 ? 1.9 : 1.6
        const outer = []
        const inner = []
        for (let k = 0; k <= 6; k++) {
          const u = k / 6
          const ox = x0 + sgn * (0.35 * Math.sin(u * Math.PI * 0.9) - 0.3 * u * u)
          const oy = h0 - 0.1 + tall * u
          outer.push([ox, oy])
          inner.push([ox - sgn * (0.55 - 0.3 * u), oy - 0.15 * (1 - u)])
        }
        blade(B, outer, inner, z, 0.16, hullC, MAT.wood)
      }
    }
    // the ʻiako across the hulls
    for (const f of [-0.33, -0.15, 0.03, 0.2, 0.34]) B.cyl([f * L, sheer(0) + 0.12, -zc - hw * 0.6], [f * L, sheer(0) + 0.12, zc + hw * 0.6], 0.11, 0.11, spar, MAT.wood, 5)
    // the deck between them, and its rail
    B.box(-0.01 * L, deckY - 0.12, 0, 0.7 * L, 0.12, 2 * zc + hw * 0.6, deckC, MAT.wood)
    for (const z of [-zc - hw * 0.25, zc + hw * 0.25]) {
      B.cyl([-0.34 * L, deckY + 0.6, z], [0.32 * L, deckY + 0.6, z], 0.04, 0.04, spar, MAT.wood, 4)
      for (let x = -0.34 * L; x <= 0.33 * L; x += L * 0.11) B.cyl([x, deckY, z], [x, deckY + 0.6, z], 0.04, 0.04, spar, MAT.wood, 4)
    }
    // the low hale amidships
    const hl = L * 0.15
    const hb = Math.min(2.4, zc * 1.1)
    const hx = -0.03 * L
    const th = col(PALETTE.thatch, 0.12, rand)
    const thD = col(PALETTE.thatchDark, 0.12, rand)
    const ridge = deckY + 1.25
    B.quad([hx - hl / 2, deckY, -hb / 2], [hx - hl / 2, ridge, 0], [hx + hl / 2, ridge, 0], [hx + hl / 2, deckY, -hb / 2], th, MAT.thatch)
    B.quad([hx + hl / 2, deckY, hb / 2], [hx + hl / 2, ridge, 0], [hx - hl / 2, ridge, 0], [hx - hl / 2, deckY, hb / 2], thD, MAT.thatch)
    B.tri([hx - hl / 2, deckY, hb / 2], [hx - hl / 2, ridge, 0], [hx - hl / 2, deckY, -hb / 2], thD, MAT.thatch)
    B.tri([hx + hl / 2, deckY, -hb / 2], [hx + hl / 2, ridge, 0], [hx + hl / 2, deckY, hb / 2], th, MAT.thatch)
    // the masts
    for (const x of mastX) B.cyl([x, deckY, 0], [x, deckY + 0.34 * L, 0], 0.13, 0.08, spar, MAT.wood, 6)
    // the steering paddle, off the stern between the hulls, down into the water
    B.cyl([-0.36 * L, deckY + 1.1, zc * 0.35], [-0.6 * L, -0.6, zc * 0.45], 0.08, 0.08, spar, MAT.wood, 5)
    B.box(-0.62 * L, -1.3, zc * 0.46, 0.6, 1.0, 0.1, col('#4a2c18', 0.1, rand), MAT.wood, 0.3)
    // (the crew: forward, by the masts and aft by the paddle)
    return [[0.3 * L, deckY, -zc * 0.4], [0.02 * L, deckY, zc * 0.55], [-0.3 * L, deckY, zc * 0.3]]
  }
  for (let m = 0; m < ns; m++) {
    const x = mastX[m] + 0.4
    const tack = [x, deckY + 0.35, 0]
    if (part === 'set') {
      // in the sail's plane: u along it (forward +), v up; trimmed to one side, the cloth bellied
      const trim = 0.3 + m * 0.06
      const du = [Math.cos(trim), 0, -Math.sin(trim)]
      const dn = [Math.sin(trim), 0, Math.cos(trim)]
      const T1 = [0.08 * L, 0.58 * L]
      const T2 = [-0.5 * L, 0.34 * L]
      const P = (u, v, w) => [tack[0] + du[0] * u + dn[0] * w, tack[1] + v, tack[2] + du[2] * u + dn[2] * w]
      const na = 9
      const nr = 5
      const grid = []
      for (let i = 0; i <= na; i++) {
        const s = i / na
        // the top edge drawn in toward the tack between the spars' tips: the claw
        const k = 1 - 0.42 * Math.sin(Math.PI * s)
        const eu = (T1[0] + (T2[0] - T1[0]) * s) * k
        const ev = (T1[1] + (T2[1] - T1[1]) * s) * k
        const row = []
        for (let j = 0; j <= nr; j++) {
          const r = j / nr
          row.push(P(eu * r, ev * r, 0.09 * L * Math.sin(Math.PI * s) * Math.sin(Math.PI * Math.min(1, r * 1.15))))
        }
        grid.push(row)
      }
      for (let i = 0; i < na; i++) for (let j = 0; j < nr; j++) B.quad(grid[i][j], grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1], sailC, MAT.kapa)
      B.cyl(tack, P(T1[0], T1[1], 0), 0.1, 0.07, spar, MAT.wood, 5)
      B.cyl(tack, P(T2[0], T2[1], 0), 0.1, 0.07, spar, MAT.wood, 5)
    } else {
      // furled: the two spars together up along the mast, the cloth rolled round the boom
      const top1 = [x + 0.3, deckY + 0.55 * L, 0.15]
      const top2 = [x - 1.2, deckY + 0.5 * L, -0.15]
      B.cyl(tack, top1, 0.1, 0.07, spar, MAT.wood, 5)
      B.cyl(tack, top2, 0.1, 0.07, spar, MAT.wood, 5)
      B.cyl([tack[0] - 0.1, tack[1] + 0.6, 0], [x - 1.0, deckY + 0.46 * L, -0.1], 0.32, 0.18, sailC, MAT.kapa, 7)
    }
  }
  return []
}

/** A motor vessel: a white hull, flared at the bow, a transom stern, a wheelhouse and a short mast. Returns where its crew stand. */
export function motorVessel(B, rand, o = {}) {
  const L = o.length || 15
  const beam = o.beam || L * 0.3
  const hullC = col(o.colours?.hull || '#e8e6e0', 0.04, rand)
  const deckC = col('#9a8f80', 0.06, rand)
  const sheer = (t) => 1.3 + 0.6 * Math.max(0, t) ** 2
  hullLoft(B, L, 0, (t) => (beam / 2) * (t > 0 ? Math.sqrt(Math.max(0, 1 - t ** 2.2)) : 0.88 + 0.12 * (1 + t)), sheer, (t) => -1.0 * (1 - 0.6 * t * t), hullC, deckC, 12)
  // the transom
  B.quad([-L / 2, sheer(-1), -beam * 0.44], [-L / 2, sheer(-1), beam * 0.44], [-L / 2, -0.4, beam * 0.4], [-L / 2, -0.4, -beam * 0.4], hullC, MAT.plain)
  // a dark band at the waterline
  B.box(0, -0.05, 0, L * 0.92, 0.25, beam * 0.9, col('#3a3532', 0.05, rand), MAT.plain)
  const wh = col('#f0eee8', 0.03, rand)
  B.box(0.08 * L, sheer(0), 0, 0.26 * L, 2.2, beam * 0.62, wh, MAT.plain)
  B.box(0.08 * L, sheer(0) + 1.3, 0, 0.265 * L, 0.55, beam * 0.63, col('#2a3036', 0.05, rand), MAT.plain)
  B.box(0.08 * L, sheer(0) + 2.2, 0, 0.3 * L, 0.15, beam * 0.7, wh, MAT.plain)
  B.cyl([0.12 * L, sheer(0) + 2.3, 0], [0.12 * L, sheer(0) + 5.5, 0], 0.08, 0.05, col('#c8c4bc', 0.04, rand), MAT.plain, 5)
  B.cyl([0.12 * L, sheer(0) + 4.5, -0.9], [0.12 * L, sheer(0) + 4.5, 0.9], 0.05, 0.05, col('#c8c4bc', 0.04, rand), MAT.plain, 4)
  // the towing bitt at the stern
  B.box(-0.45 * L, sheer(0), 0, 0.3, 0.5, 0.3, col('#3a3532', 0.05, rand), MAT.plain)
  return [[-0.32 * L, sheer(0), 0.25 * beam]]
}

/** A ship: a long dark hull, its masts with their yards, the sails furled on them. Returns where its crew stand. */
export function ship(B, rand, o = {}) {
  const L = o.length || 35
  const beam = o.beam || L * 0.26
  const hullC = col(o.colours?.hull || '#2e2a26', 0.05, rand)
  const sheer = (t) => 2.4 + 1.2 * t * t
  hullLoft(B, L, 0, (t) => (beam / 2) * Math.pow(Math.max(0, 1 - Math.abs(t) ** 2.5), 0.5), sheer, (t) => -2.2 * (1 - t * t), hullC, col('#8a6a46', 0.05, rand), 14)
  const spar = col('#5b3d27', 0.08, rand)
  const furl = col(o.colours?.sail || '#e0d6bd', 0.04, rand)
  const nm = Math.max(1, Math.min(3, o.masts || 3))
  for (let m = 0; m < nm; m++) {
    const x = (nm === 1 ? 0 : 0.3 - (0.6 * m) / (nm - 1)) * L
    const h = L * (m === 1 || nm === 1 ? 0.8 : 0.7)
    B.cyl([x, sheer(0), 0], [x, sheer(0) + h, 0], 0.25, 0.1, spar, MAT.wood, 6)
    for (const f of [0.35, 0.6, 0.85]) {
      const y = sheer(0) + h * f
      const w = beam * (1.1 - f * 0.5)
      B.cyl([x, y, -w], [x, y, w], 0.12, 0.12, spar, MAT.wood, 4)
      B.cyl([x + 0.15, y - 0.1, -w * 0.9], [x + 0.15, y - 0.1, w * 0.9], 0.25, 0.25, furl, MAT.kapa, 5)
    }
  }
  B.cyl([L / 2, sheer(1), 0], [L * 0.72, sheer(1) + L * 0.12, 0], 0.15, 0.08, spar, MAT.wood, 5)
  return [[-0.35 * L, sheer(0), 0]]
}

/** The small hull a vessel is at the island zoom, of unit length along x: a sliver, two for a double canoe, and a fleck of sail when set. */
export function hullMark(B, rand, o = {}, sail = false) {
  const c = col(o.colours?.hull || (o.design === 'motor' ? '#e8e6e0' : '#2b2622'), 0.04, rand)
  const double = o.design === 'waa-kaulua'
  const bw = (o.beam || 4) / (o.length || 15)
  for (const z of double ? [-bw * 0.4, bw * 0.4] : [0]) hullLoft(B, 1, z, (t) => (double ? 0.05 : bw * 0.5) * Math.sqrt(Math.max(0, 1 - t * t)), () => 0.06, () => -0.04, c, c, 6)
  if (sail) {
    const s = col(o.colours?.sail || '#e6dcc3', 0.03, rand)
    B.tri([0.1, 0.06, 0], [-0.3, 0.45, 0.02], [0.15, 0.6, 0.02], s, MAT.kapa)
    B.tri([0.15, 0.6, -0.02], [-0.3, 0.45, -0.02], [0.1, 0.06, 0], s, MAT.kapa)
  }
}
