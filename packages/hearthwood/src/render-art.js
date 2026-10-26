// Procedural building and unit art (bake time only). OWNER: render implementer.
// Every function draws into a 2D context in local pixel space; u = pixels per tile.
// Building canvases are (w*u) x ((h+over)*u): the footprint occupies the bottom h*u rows.

import {
  B_HEARTH, B_STOREHOUSE, B_LUMBER_LODGE, B_QUARRY, B_MINE, B_GLOWCAP_GROVE, B_MOONSTONE_DELVE,
  B_SAWMILL, B_FORGE, B_WORKSHOP, B_LOOM, B_ENCHANTERY, B_SPRITE_DEN, B_WARDEN_HALL, B_WARD_TOWER, B_SHRINE,
  BUILDING_COUNT,
  U_COURIER, U_WARDEN, U_TREANT, U_CRAWLER, U_HUSK, U_WISP, UNIT_COUNT,
} from './constants.js'
import {
  TAU, PAL, shade, rgba, rr, circle, ell, poly, line, lin, rad, glowBlob, canopy, pad, wall, stoneWall,
  roof, door, windowLit, logPile, crate, mushroom, crystal, banner,
} from './render-paint.js'

/** Tiles of vertical overhang above the footprint, per building type. */
export const BUILDING_OVER = new Float32Array(BUILDING_COUNT)
{
  const o = BUILDING_OVER
  o[B_HEARTH] = 1.3; o[B_STOREHOUSE] = 0.5; o[B_LUMBER_LODGE] = 0.6; o[B_QUARRY] = 0.5; o[B_MINE] = 0.45
  o[B_GLOWCAP_GROVE] = 0.6; o[B_MOONSTONE_DELVE] = 0.6; o[B_SAWMILL] = 0.6; o[B_FORGE] = 1.0; o[B_WORKSHOP] = 0.6
  o[B_LOOM] = 0.6; o[B_ENCHANTERY] = 1.3; o[B_SPRITE_DEN] = 0.4; o[B_WARDEN_HALL] = 1.0; o[B_WARD_TOWER] = 1.9
  o[B_SHRINE] = 0.8
}

/**
 * Chimney / emitter anchor per type in footprint-relative tiles (x from left, y from footprint top;
 * negative y = above the footprint). NaN = none. Used for smoke puffs and glow placement.
 */
export const SMOKE_X = new Float32Array(BUILDING_COUNT).fill(NaN)
export const SMOKE_Y = new Float32Array(BUILDING_COUNT).fill(NaN)
SMOKE_X[B_HEARTH] = 2.15; SMOKE_Y[B_HEARTH] = -0.9
SMOKE_X[B_FORGE] = 1.55; SMOKE_Y[B_FORGE] = -0.85
SMOKE_X[B_SAWMILL] = 0.5; SMOKE_Y[B_SAWMILL] = -0.2
SMOKE_X[B_WORKSHOP] = 1.5; SMOKE_Y[B_WORKSHOP] = -0.25
SMOKE_X[B_LUMBER_LODGE] = 1.45; SMOKE_Y[B_LUMBER_LODGE] = -0.25

/** Glow (additive, drawn after the night tint) per type: 0 none, 1 amber, 2 teal, 3 moon, 4 ember. Position in tiles like SMOKE_*. */
export const GLOW_KIND = new Uint8Array(BUILDING_COUNT)
export const GLOW_X = new Float32Array(BUILDING_COUNT)
export const GLOW_Y = new Float32Array(BUILDING_COUNT)
export const GLOW_R = new Float32Array(BUILDING_COUNT)
function gl(t, k, x, y, r) { GLOW_KIND[t] = k; GLOW_X[t] = x; GLOW_Y[t] = y; GLOW_R[t] = r }
gl(B_HEARTH, 1, 1.5, 2.4, 2.6)
gl(B_FORGE, 4, 1.0, 1.55, 1.7)
gl(B_GLOWCAP_GROVE, 2, 1.0, 1.1, 1.8)
gl(B_MOONSTONE_DELVE, 3, 1.0, 1.0, 1.5)
gl(B_ENCHANTERY, 1, 1.5, 0.6, 2.4)
gl(B_SPRITE_DEN, 2, 1.0, 1.2, 1.5)
gl(B_WARD_TOWER, 2, 0.5, -1.25, 1.1)
gl(B_SHRINE, 3, 1.5, 1.6, 2.6)
gl(B_LOOM, 2, 1.0, 1.4, 1.1)

/** Unit sprite size in tiles (square), per unit type. */
export const UNIT_TILES = new Float32Array(UNIT_COUNT)
UNIT_TILES[U_COURIER] = 0.8; UNIT_TILES[U_WARDEN] = 1.0; UNIT_TILES[U_TREANT] = 1.6
UNIT_TILES[U_CRAWLER] = 0.95; UNIT_TILES[U_HUSK] = 1.4; UNIT_TILES[U_WISP] = 1.05

// ---------------------------------------------------------------- buildings

/**
 * Draw building `type` with footprint w x h tiles into g (canvas sized (w*u) x ((h+over)*u)).
 * @param {CanvasRenderingContext2D} g
 */
export function drawBuilding(g, type, w, h, u, detail, rng) {
  const O = BUILDING_OVER[type] * u
  const W = w * u, H = h * u
  const top = O, bot = O + H
  switch (type) {
    case B_HEARTH: return hearth(g, W, top, bot, u, detail, rng)
    case B_STOREHOUSE: {
      pad(g, 0, top, W, H, PAL.barkL)
      const wy = top + H * 0.42
      wall(g, W * 0.08, wy, W * 0.84, bot - wy - H * 0.06, PAL.bark, detail)
      roof(g, W * 0.08, wy, W * 0.84, top - O * 0.6, PAL.thatch, 'thatch', detail, rng)
      door(g, W * 0.4, wy + H * 0.12, W * 0.2, bot - wy - H * 0.18, false)
      if (detail) { crate(g, W * 0.76, bot - H * 0.24, W * 0.18); crate(g, W * 0.04, bot - H * 0.2, W * 0.14, PAL.plankD) }
      return
    }
    case B_LUMBER_LODGE: {
      pad(g, 0, top, W, H, PAL.mossD)
      const wy = top + H * 0.42
      // log-cabin walls
      g.fillStyle = PAL.bark; g.fillRect(W * 0.1, wy, W * 0.62, bot - wy - H * 0.08)
      if (detail) for (let i = 0; i < 4; i++) {
        const yy = wy + ((bot - wy - H * 0.08) * (i + 0.5)) / 4
        line(g, W * 0.1, yy, W * 0.72, yy, PAL.barkD, Math.max(1, u * 0.04))
        circle(g, W * 0.1, yy, u * 0.06, PAL.plank)
      }
      roof(g, W * 0.1, wy, W * 0.62, top - O * 0.5, PAL.barkL, 'shingle', detail, rng)
      door(g, W * 0.33, wy + H * 0.14, W * 0.16, bot - wy - H * 0.22, true)
      logPile(g, W * 0.66, bot - H * 0.5, W * 0.34)
      if (detail) {
        // stump + axe
        ell(g, W * 0.86, top + H * 0.25, u * 0.2, u * 0.13, PAL.barkD)
        ell(g, W * 0.86, top + H * 0.22, u * 0.17, u * 0.1, PAL.plank)
        line(g, W * 0.86, top + H * 0.22, W * 0.95, top + H * 0.02, PAL.barkL, u * 0.05)
        poly(g, [W * 0.93, top, W * 0.99, top + H * 0.04, W * 0.95, top + H * 0.08], PAL.iron)
      }
      return
    }
    case B_QUARRY: {
      pad(g, 0, top, W, H, PAL.stoneD)
      // stepped pit
      for (let i = 0; i < 3; i++) {
        const k = i * 0.12
        g.fillStyle = shade(PAL.stone, -0.15 - i * 0.18)
        rr(g, W * (0.1 + k), top + H * (0.15 + k), W * (0.8 - 2 * k), H * (0.75 - 2 * k), u * 0.2); g.fill()
      }
      if (detail) for (let i = 0; i < 5; i++) {
        const bx = W * (0.15 + rng.float() * 0.6), by = top + H * (0.25 + rng.float() * 0.5)
        g.fillStyle = PAL.stoneL; g.fillRect(bx, by, u * 0.22, u * 0.15)
        g.fillStyle = PAL.stoneD; g.fillRect(bx, by + u * 0.12, u * 0.22, u * 0.04)
      }
      // timber crane
      line(g, W * 0.15, bot - H * 0.1, W * 0.3, top - O * 0.8, PAL.bark, u * 0.08)
      line(g, W * 0.45, bot - H * 0.1, W * 0.3, top - O * 0.8, PAL.bark, u * 0.08)
      line(g, W * 0.3, top - O * 0.8, W * 0.75, top - O * 0.4, PAL.barkL, u * 0.07)
      line(g, W * 0.72, top - O * 0.4, W * 0.72, top + H * 0.45, '#d8d2b0', Math.max(1, u * 0.02))
      g.fillStyle = PAL.stoneL; g.fillRect(W * 0.65, top + H * 0.45, u * 0.28, u * 0.2)
      if (detail) { g.fillStyle = PAL.stoneL; g.fillRect(W * 0.02, bot - H * 0.22, u * 0.3, u * 0.22); g.fillRect(W * 0.12, bot - H * 0.3, u * 0.24, u * 0.16) }
      return
    }
    case B_MINE: {
      pad(g, 0, top, W, H, PAL.mossD)
      // mossy mound
      ell(g, W * 0.5, top + H * 0.55, W * 0.48, H * 0.5 + O * 0.4, shade(PAL.stone, -0.25))
      ell(g, W * 0.5, top + H * 0.4, W * 0.44, H * 0.38 + O * 0.4, PAL.mossD)
      if (detail) for (let i = 0; i < 6; i++) ell(g, W * (0.2 + rng.float() * 0.6), top + H * (0.15 + rng.float() * 0.35), u * 0.16, u * 0.1, PAL.moss)
      // tunnel
      const tx = W * 0.32, tw = W * 0.36, ty = top + H * 0.38
      g.fillStyle = '#0d0a08'
      g.beginPath(); g.moveTo(tx, bot - H * 0.08); g.lineTo(tx, ty + tw * 0.4); g.arc(tx + tw / 2, ty + tw * 0.4, tw / 2, Math.PI, 0); g.lineTo(tx + tw, bot - H * 0.08); g.fill()
      line(g, tx, bot - H * 0.08, tx, ty + tw * 0.2, PAL.bark, u * 0.1)
      line(g, tx + tw, bot - H * 0.08, tx + tw, ty + tw * 0.2, PAL.bark, u * 0.1)
      line(g, tx - u * 0.05, ty + tw * 0.15, tx + tw + u * 0.05, ty + tw * 0.15, PAL.barkL, u * 0.11)
      // ore cart
      const cx = W * 0.78, cy = bot - H * 0.2
      g.fillStyle = PAL.ironD; g.fillRect(cx - u * 0.25, cy - u * 0.15, u * 0.5, u * 0.25)
      for (let i = 0; i < 3; i++) circle(g, cx - u * 0.13 + i * u * 0.13, cy - u * 0.17, u * 0.09, '#b0603e')
      circle(g, cx - u * 0.15, cy + u * 0.12, u * 0.07, '#222'); circle(g, cx + u * 0.15, cy + u * 0.12, u * 0.07, '#222')
      return
    }
    case B_GLOWCAP_GROVE: {
      pad(g, 0, top, W, H, PAL.mossD)
      if (detail) for (let i = 0; i < 7; i++) {
        const a = (i / 7) * TAU
        mushroom(g, W * 0.5 + Math.cos(a) * W * 0.42, top + H * 0.55 + Math.sin(a) * H * 0.38, u * 0.28, PAL.teal, true)
      }
      // mushroom-cap hut
      g.fillStyle = PAL.plank; g.fillRect(W * 0.32, top + H * 0.35, W * 0.36, H * 0.48)
      door(g, W * 0.43, top + H * 0.55, W * 0.14, H * 0.28, false)
      g.beginPath(); g.ellipse(W * 0.5, top + H * 0.38, W * 0.38, H * 0.3 + O * 0.5, 0, Math.PI, 0); g.closePath()
      g.fillStyle = lin(g, 0, top - O, 0, top + H * 0.4, [0, shade(PAL.teal, 0.3), 1, PAL.tealD]); g.fill()
      for (let i = 0; i < 5; i++) circle(g, W * (0.25 + i * 0.12), top + H * 0.2 - (i & 1) * u * 0.25, u * 0.06, rgba('#ffffff', 0.8))
      return
    }
    case B_MOONSTONE_DELVE: {
      pad(g, 0, top, W, H, PAL.stoneD)
      stoneWall(g, W * 0.12, top + H * 0.25, W * 0.76, H * 0.62, PAL.stone, detail, rng)
      // arch
      const ax = W * 0.3, aw = W * 0.4, ay = top + H * 0.42
      g.fillStyle = '#10121e'
      g.beginPath(); g.moveTo(ax, bot - H * 0.13); g.lineTo(ax, ay + aw * 0.4); g.arc(ax + aw / 2, ay + aw * 0.4, aw / 2, Math.PI, 0); g.lineTo(ax + aw, bot - H * 0.13); g.fill()
      glowBlob(g, W * 0.5, bot - H * 0.25, u * 0.5, PAL.moon, 0.55)
      crystal(g, W * 0.2, top + H * 0.25, u * 0.6, PAL.moon)
      crystal(g, W * 0.8, top + H * 0.3, u * 0.5, shade(PAL.moon, -0.1))
      crystal(g, W * 0.5, top + H * 0.08, u * 0.75, shade(PAL.moon, 0.15))
      return
    }
    case B_SAWMILL: {
      pad(g, 0, top, W, H, PAL.barkL)
      const wy = top + H * 0.42
      wall(g, W * 0.05, wy, W * 0.6, bot - wy - H * 0.08, PAL.plankD, detail)
      roof(g, W * 0.05, wy, W * 0.6, top - O * 0.5, PAL.bark, 'shingle', detail, rng)
      door(g, W * 0.25, wy + H * 0.14, W * 0.18, bot - wy - H * 0.22, false)
      // big saw blade
      const sx = W * 0.8, sy = top + H * 0.42, sr = u * 0.42
      circle(g, sx, sy, sr, PAL.iron)
      if (detail) {
        g.fillStyle = PAL.ironD
        for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; poly(g, [sx + Math.cos(a) * sr, sy + Math.sin(a) * sr, sx + Math.cos(a + 0.26) * sr * 1.12, sy + Math.sin(a + 0.26) * sr * 1.12, sx + Math.cos(a + 0.4) * sr, sy + Math.sin(a + 0.4) * sr], PAL.ironD) }
      }
      circle(g, sx, sy, sr * 0.25, PAL.barkD)
      // plank stack
      for (let i = 0; i < 3; i++) { g.fillStyle = i & 1 ? PAL.plank : shade(PAL.plank, 0.12); g.fillRect(W * 0.66, bot - H * 0.28 + i * u * 0.1, W * 0.32, u * 0.09) }
      return
    }
    case B_FORGE: {
      pad(g, 0, top, W, H, PAL.stoneD)
      const wy = top + H * 0.4
      stoneWall(g, W * 0.06, wy, W * 0.88, bot - wy - H * 0.06, PAL.stone, detail, rng)
      roof(g, W * 0.06, wy, W * 0.88, top - O * 0.35, '#4a3a38', 'slate', detail, rng)
      // chimney
      g.fillStyle = PAL.stoneD; g.fillRect(W * 0.66, top - O * 0.85, W * 0.2, H * 0.55)
      g.fillStyle = PAL.stone; g.fillRect(W * 0.64, top - O * 0.9, W * 0.24, u * 0.12)
      circle(g, W * 0.76, top - O * 0.86, u * 0.08, PAL.ember)
      // furnace mouth
      const fx = W * 0.3, fw = W * 0.4, fy = wy + H * 0.12
      g.fillStyle = lin(g, 0, fy, 0, bot - H * 0.1, [0, PAL.amberL, 0.5, PAL.ember, 1, '#8a2a10'])
      g.beginPath(); g.moveTo(fx, bot - H * 0.08); g.lineTo(fx, fy + fw * 0.35); g.arc(fx + fw / 2, fy + fw * 0.35, fw / 2, Math.PI, 0); g.lineTo(fx + fw, bot - H * 0.08); g.fill()
      if (detail) {
        // anvil
        g.fillStyle = PAL.ironD; g.fillRect(W * 0.04, bot - H * 0.2, u * 0.32, u * 0.1); g.fillRect(W * 0.08, bot - H * 0.12, u * 0.12, u * 0.12)
      }
      return
    }
    case B_WORKSHOP: {
      pad(g, 0, top, W, H, PAL.barkL)
      const wy = top + H * 0.42
      wall(g, W * 0.08, wy, W * 0.84, bot - wy - H * 0.06, PAL.bark, detail)
      roof(g, W * 0.08, wy, W * 0.84, top - O * 0.5, '#3d6a5a', 'shingle', detail, rng)
      door(g, W * 0.18, wy + H * 0.14, W * 0.18, bot - wy - H * 0.2, true)
      windowLit(g, W * 0.6, wy + H * 0.14, u * 0.22)
      // gear sign
      const gx = W * 0.5, gy = top + H * 0.08, gr = u * 0.25
      g.fillStyle = PAL.gold
      for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU; g.fillRect(gx + Math.cos(a) * gr - u * 0.05, gy + Math.sin(a) * gr - u * 0.05, u * 0.1, u * 0.1) }
      circle(g, gx, gy, gr * 0.85, PAL.gold); circle(g, gx, gy, gr * 0.35, PAL.barkD)
      return
    }
    case B_LOOM: {
      pad(g, 0, top, W, H, PAL.mossD)
      const wy = top + H * 0.42
      wall(g, W * 0.08, wy, W * 0.84, bot - wy - H * 0.06, PAL.plankD, detail)
      roof(g, W * 0.08, wy, W * 0.84, top - O * 0.5, '#4e8a5c', 'leaf', detail, rng)
      door(g, W * 0.42, wy + H * 0.14, W * 0.16, bot - wy - H * 0.2, false)
      // weaving frame with charm threads
      const lx = W * 0.62, ly = wy + H * 0.08
      g.fillStyle = PAL.barkD; g.fillRect(lx, ly, u * 0.06, H * 0.38); g.fillRect(lx + u * 0.5, ly, u * 0.06, H * 0.38)
      for (let i = 0; i < 5; i++) line(g, lx + u * 0.06, ly + u * (0.08 + i * 0.1), lx + u * 0.5, ly + u * (0.08 + i * 0.1), i & 1 ? '#7ef0a8' : PAL.teal, Math.max(1, u * 0.04))
      if (detail) { banner(g, W * 0.14, top - O * 0.1, u * 0.22, u * 0.5, '#7ef0a8', PAL.teal) }
      return
    }
    case B_ENCHANTERY: {
      pad(g, 0, top, W, H, PAL.stoneL)
      ell(g, W * 0.5, bot - H * 0.38, W * 0.46, H * 0.36, shade(PAL.stoneL, -0.15))
      ell(g, W * 0.5, bot - H * 0.42, W * 0.4, H * 0.3, PAL.stoneL)
      // pillars
      for (let i = 0; i < 4; i++) {
        const px = W * (0.18 + i * 0.213)
        g.fillStyle = lin(g, px - u * 0.12, 0, px + u * 0.12, 0, [0, shade(PAL.moon, 0.3), 1, PAL.moonD])
        g.fillRect(px - u * 0.12, top + H * 0.1, u * 0.24, H * 0.55)
      }
      // dome
      g.beginPath(); g.ellipse(W * 0.5, top + H * 0.15, W * 0.42, O * 0.9 + H * 0.05, 0, Math.PI, 0); g.closePath()
      g.fillStyle = lin(g, 0, top - O, 0, top + H * 0.15, [0, PAL.gold, 1, shade(PAL.gold, -0.35)]); g.fill()
      g.fillStyle = shade(PAL.gold, -0.4); g.fillRect(W * 0.08, top + H * 0.13, W * 0.84, u * 0.12)
      // starbloom
      const sx = W * 0.5, sy = top - O * 0.75
      glowBlob(g, sx, sy, u * 0.8, PAL.amberL, 0.7)
      for (let i = 0; i < 6; i++) { const a = (i / 6) * TAU - Math.PI / 2; ell(g, sx + Math.cos(a) * u * 0.2, sy + Math.sin(a) * u * 0.2, u * 0.15, u * 0.15, '#f6dc84') }
      circle(g, sx, sy, u * 0.12, '#fff6d0')
      if (detail) { crystal(g, W * 0.12, bot - H * 0.05, u * 0.5, PAL.moon); crystal(g, W * 0.88, bot - H * 0.05, u * 0.5, PAL.moon) }
      return
    }
    case B_SPRITE_DEN: {
      pad(g, 0, top, W, H, PAL.mossD)
      ell(g, W * 0.5, top + H * 0.55, W * 0.47, H * 0.45 + O * 0.3, shade(PAL.mossD, -0.25))
      ell(g, W * 0.5, top + H * 0.48, W * 0.42, H * 0.38 + O * 0.3, PAL.mossD)
      if (detail) for (let i = 0; i < 8; i++) ell(g, W * (0.15 + rng.float() * 0.7), top + H * (0.15 + rng.float() * 0.5), u * 0.13, u * 0.08, PAL.moss)
      const holes = [0.3, 0.55, 0.7, 0.4, 0.5, 0.75]
      for (let i = 0; i < 6; i += 2) {
        const hx = W * holes[i], hy = top + H * holes[i + 1]
        glowBlob(g, hx, hy, u * 0.35, PAL.teal, 0.6)
        ell(g, hx, hy, u * 0.14, u * 0.1, '#0a2a2a')
        ell(g, hx, hy + u * 0.02, u * 0.09, u * 0.05, '#9fe8ff')
      }
      if (detail) { circle(g, W * 0.75, top - O * 0.2, u * 0.08, '#d8fbff'); glowBlob(g, W * 0.75, top - O * 0.2, u * 0.25, '#9fe8ff', 0.6) }
      return
    }
    case B_WARDEN_HALL: {
      pad(g, 0, top, W, H, PAL.mossD)
      const wy = top + H * 0.45
      wall(g, W * 0.06, wy, W * 0.88, bot - wy - H * 0.06, PAL.bark, detail)
      roof(g, W * 0.06, wy, W * 0.88, top - O * 0.6, '#3f6d4b', 'leaf', detail, rng)
      door(g, W * 0.42, wy + H * 0.12, W * 0.16, bot - wy - H * 0.18, true)
      windowLit(g, W * 0.18, wy + H * 0.12, u * 0.24); windowLit(g, W * 0.72, wy + H * 0.12, u * 0.24)
      banner(g, W * 0.02, top - O * 0.3, u * 0.3, u * 0.75, '#4f8f5a', PAL.mossL)
      banner(g, W * 0.9, top - O * 0.3, u * 0.3, u * 0.75, '#4f8f5a', PAL.mossL)
      if (detail) {
        // crossed bows emblem
        g.strokeStyle = PAL.plank; g.lineWidth = u * 0.06
        g.beginPath(); g.arc(W * 0.5, top + H * 0.02, u * 0.35, Math.PI * 1.15, Math.PI * 1.85); g.stroke()
        line(g, W * 0.5 - u * 0.3, top - u * 0.15, W * 0.5 + u * 0.3, top - u * 0.15, '#e8e0c0', Math.max(1, u * 0.02))
      }
      return
    }
    case B_WARD_TOWER: {
      pad(g, 0, top, W, H, PAL.stoneD)
      const tx = W * 0.2, tw = W * 0.6
      g.fillStyle = lin(g, tx, 0, tx + tw, 0, [0, PAL.stoneL, 0.6, PAL.stone, 1, PAL.stoneD])
      g.beginPath(); g.moveTo(tx - W * 0.06, bot - H * 0.1); g.lineTo(tx + tw + W * 0.06, bot - H * 0.1); g.lineTo(tx + tw, top - O * 0.55); g.lineTo(tx, top - O * 0.55); g.closePath(); g.fill()
      if (detail) for (let i = 0; i < 5; i++) line(g, tx, top - O * 0.55 + i * u * 0.45, tx + tw, top - O * 0.55 + i * u * 0.45, rgba(PAL.stoneD, 0.8), Math.max(1, u * 0.02))
      // rune slit
      g.fillStyle = PAL.teal; g.fillRect(W * 0.46, top - O * 0.35, W * 0.08, u * 0.3)
      // battlement + cone roof
      g.fillStyle = PAL.stoneD; g.fillRect(tx - W * 0.1, top - O * 0.62, tw + W * 0.2, u * 0.16)
      poly(g, [tx - W * 0.12, top - O * 0.6, tx + tw + W * 0.12, top - O * 0.6, W * 0.5, top - O * 0.98], '#3f6d4b')
      poly(g, [W * 0.5, top - O * 0.98, tx + tw + W * 0.12, top - O * 0.6, W * 0.55, top - O * 0.6], shade('#3f6d4b', -0.3))
      circle(g, W * 0.5, top - O * 0.66, u * 0.08, PAL.teal)
      return
    }
    case B_SHRINE: {
      pad(g, 0, top, W, H, PAL.stoneD)
      // standing stones ring (back half)
      const cx = W * 0.5, cy = top + H * 0.55
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU + 0.2
        if (Math.sin(a) > 0.1) continue
        stone(g, cx + Math.cos(a) * W * 0.42, cy + Math.sin(a) * H * 0.36, u, rng)
      }
      // moonwell
      ell(g, cx, cy, W * 0.3, H * 0.22, PAL.stone)
      ell(g, cx, cy + H * 0.015, W * 0.25, H * 0.17, '#1a2448')
      g.fillStyle = rad(g, cx, cy, 0, W * 0.25, [0, rgba('#e8eeff', 0.95), 0.5, rgba(PAL.moon, 0.6), 1, rgba(PAL.moonD, 0.2)])
      g.beginPath(); g.ellipse(cx, cy + H * 0.015, W * 0.24, H * 0.16, 0, 0, TAU); g.fill()
      // crescent
      circle(g, cx, cy - H * 0.32, u * 0.3, '#eef2ff'); circle(g, cx + u * 0.12, cy - H * 0.34, u * 0.26, rgba('#1a2448', 1))
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU + 0.2
        if (Math.sin(a) <= 0.1) continue
        stone(g, cx + Math.cos(a) * W * 0.42, cy + Math.sin(a) * H * 0.36, u, rng)
      }
      return
    }
    default: {
      pad(g, 0, top, W, H, PAL.bark)
      g.fillStyle = PAL.bark; g.fillRect(W * 0.1, top + H * 0.1, W * 0.8, H * 0.8)
    }
  }
}

function stone(g, x, y, u, rng) {
  const h = u * (0.8 + rng.float() * 0.3), w = u * 0.32
  ell(g, x, y, w * 0.7, w * 0.3, rgba('#000000', 0.35))
  g.fillStyle = lin(g, x - w / 2, 0, x + w / 2, 0, [0, PAL.stoneL, 1, PAL.stoneD])
  rr(g, x - w / 2, y - h, w, h, w * 0.4); g.fill()
  g.fillStyle = PAL.teal; g.fillRect(x - w * 0.1, y - h * 0.7, w * 0.2, h * 0.25)
  ell(g, x, y - h + w * 0.25, w * 0.45, w * 0.2, rgba(PAL.moss, 0.8))
}

function hearth(g, W, top, bot, u, detail, rng) {
  const H = bot - top
  pad(g, 0, top, W, H, PAL.barkL)
  // roots
  g.strokeStyle = PAL.barkD; g.lineCap = 'round'
  for (let i = 0; i < 6; i++) {
    const a = Math.PI * (0.05 + (i / 5) * 0.9)
    g.lineWidth = u * (0.22 - i * 0.012)
    g.beginPath(); g.moveTo(W * 0.5, bot - H * 0.35)
    g.quadraticCurveTo(W * 0.5 + Math.cos(a) * W * 0.3, bot - H * 0.1, W * 0.5 + Math.cos(a) * W * 0.48, bot - H * 0.04 - Math.sin(a) * H * 0.04)
    g.stroke()
  }
  g.lineCap = 'butt'
  // trunk
  g.fillStyle = lin(g, W * 0.22, 0, W * 0.78, 0, [0, PAL.barkD, 0.35, PAL.barkL, 0.7, PAL.bark, 1, PAL.barkD])
  g.beginPath()
  g.moveTo(W * 0.2, bot - H * 0.06)
  g.bezierCurveTo(W * 0.3, bot - H * 0.4, W * 0.26, top + H * 0.1, W * 0.32, top - u * 0.3)
  g.lineTo(W * 0.68, top - u * 0.3)
  g.bezierCurveTo(W * 0.74, top + H * 0.1, W * 0.7, bot - H * 0.4, W * 0.8, bot - H * 0.06)
  g.closePath(); g.fill()
  if (detail) {
    g.strokeStyle = rgba(PAL.barkD, 0.8); g.lineWidth = Math.max(1, u * 0.04)
    for (let i = 0; i < 6; i++) {
      const x = W * (0.32 + i * 0.07)
      g.beginPath(); g.moveTo(x, bot - H * 0.1); g.quadraticCurveTo(x + u * 0.1 * (i & 1 ? 1 : -1), top + H * 0.4, x, top); g.stroke()
    }
  }
  // glowing arched door + windows
  glowBlob(g, W * 0.5, bot - H * 0.2, u * 0.9, PAL.amber, 0.55)
  door(g, W * 0.42, bot - H * 0.42, W * 0.16, H * 0.36, true)
  windowLit(g, W * 0.33, top + H * 0.3, u * 0.2)
  windowLit(g, W * 0.6, top + H * 0.18, u * 0.2)
  // canopy
  const cy = top - u * 0.15
  canopy(g, W * 0.5, cy, W * 0.52, u * 1.15, '#3d7a45', rng, 9)
  if (detail) {
    for (let i = 0; i < 7; i++) {
      const a = rng.float() * TAU, r = rng.float()
      const lx = W * 0.5 + Math.cos(a) * W * 0.42 * r, ly = cy + Math.sin(a) * u * 0.9 * r
      glowBlob(g, lx, ly, u * 0.16, PAL.amberL, 0.9)
    }
    // lanterns
    line(g, W * 0.18, top + H * 0.15, W * 0.18, top + H * 0.32, PAL.barkD, Math.max(1, u * 0.03))
    glowBlob(g, W * 0.18, top + H * 0.36, u * 0.25, PAL.amber, 0.8)
    circle(g, W * 0.18, top + H * 0.36, u * 0.07, PAL.amberL)
    line(g, W * 0.82, top + H * 0.2, W * 0.82, top + H * 0.38, PAL.barkD, Math.max(1, u * 0.03))
    glowBlob(g, W * 0.82, top + H * 0.42, u * 0.25, PAL.amber, 0.8)
    circle(g, W * 0.82, top + H * 0.42, u * 0.07, PAL.amberL)
  }
}

// ---------------------------------------------------------------- units

/**
 * Draw unit `type` facing right, animation phase `ph` in [0,1), into a square of side s px.
 * Feet/ground at about 0.62*s; body centred.
 */
export function drawUnit(g, type, s, ph) {
  const c = s / 2
  const sw = Math.sin(ph * TAU)
  switch (type) {
    case U_COURIER: {
      const bob = sw * s * 0.05
      glowBlob(g, c, c + bob, s * 0.48, '#9fe8ff', 0.55)
      // wings
      ell(g, c - s * 0.12, c - s * 0.1 + bob, s * 0.14, s * (0.08 + 0.04 * Math.abs(sw)), rgba('#e8fdff', 0.7))
      ell(g, c + s * 0.06, c - s * 0.12 + bob, s * 0.12, s * (0.07 + 0.04 * Math.abs(sw)), rgba('#e8fdff', 0.6))
      circle(g, c, c + bob, s * 0.17, '#bff4ff')
      circle(g, c + s * 0.03, c - s * 0.03 + bob, s * 0.1, '#ffffff')
      // satchel
      ell(g, c - s * 0.08, c + s * 0.14 + bob, s * 0.1, s * 0.08, PAL.bark)
      line(g, c - s * 0.15, c + s * 0.08 + bob, c + s * 0.06, c - s * 0.02 + bob, PAL.barkD, Math.max(1, s * 0.03))
      circle(g, c + s * 0.08, c - s * 0.02 + bob, s * 0.025, '#123')
      return
    }
    case U_WARDEN: {
      // legs
      line(g, c - s * 0.06, c + s * 0.12, c - s * 0.06 + sw * s * 0.08, c + s * 0.3, '#2b3a22', s * 0.07)
      line(g, c + s * 0.06, c + s * 0.12, c + s * 0.06 - sw * s * 0.08, c + s * 0.3, '#2b3a22', s * 0.07)
      // cloak
      g.fillStyle = lin(g, 0, c - s * 0.25, 0, c + s * 0.2, [0, '#5f9a4e', 1, '#2f5a32'])
      g.beginPath(); g.moveTo(c - s * 0.18, c + s * 0.2); g.quadraticCurveTo(c - s * 0.2, c - s * 0.15, c, c - s * 0.22)
      g.quadraticCurveTo(c + s * 0.2, c - s * 0.15, c + s * 0.18, c + s * 0.2); g.closePath(); g.fill()
      // hood + face
      circle(g, c + s * 0.02, c - s * 0.2, s * 0.12, '#3f7a3c')
      circle(g, c + s * 0.06, c - s * 0.19, s * 0.06, '#e2c9a0')
      // bow
      g.strokeStyle = PAL.barkL; g.lineWidth = s * 0.045
      g.beginPath(); g.arc(c + s * 0.12, c - s * 0.02, s * 0.22, -1.1, 1.1); g.stroke()
      line(g, c + s * 0.12 + Math.cos(-1.1) * s * 0.22, c - s * 0.02 + Math.sin(-1.1) * s * 0.22,
        c + s * 0.12 + Math.cos(1.1) * s * 0.22, c - s * 0.02 + Math.sin(1.1) * s * 0.22, '#e8e0c0', Math.max(1, s * 0.015))
      // quiver
      g.fillStyle = PAL.bark; g.fillRect(c - s * 0.2, c - s * 0.2, s * 0.07, s * 0.22)
      return
    }
    case U_TREANT: {
      // legs (roots)
      line(g, c - s * 0.1, c + s * 0.1, c - s * 0.12 + sw * s * 0.06, c + s * 0.32, PAL.barkD, s * 0.09)
      line(g, c + s * 0.1, c + s * 0.1, c + s * 0.12 - sw * s * 0.06, c + s * 0.32, PAL.barkD, s * 0.09)
      // trunk body
      g.fillStyle = lin(g, c - s * 0.17, 0, c + s * 0.17, 0, [0, PAL.barkD, 0.4, PAL.barkL, 1, PAL.barkD])
      rr(g, c - s * 0.15, c - s * 0.2, s * 0.3, s * 0.36, s * 0.08); g.fill()
      // arms
      line(g, c - s * 0.14, c - s * 0.08, c - s * 0.3, c + s * 0.06 - sw * s * 0.05, PAL.bark, s * 0.06)
      line(g, c + s * 0.14, c - s * 0.08, c + s * 0.32, c + s * 0.02 + sw * s * 0.05, PAL.bark, s * 0.06)
      // face
      circle(g, c + s * 0.03, c - s * 0.08, s * 0.025, '#d8ff9a'); circle(g, c + s * 0.1, c - s * 0.08, s * 0.025, '#d8ff9a')
      // crown
      const rng = { k: 0.37, float() { this.k = (this.k * 9301 + 0.4927) % 1; return this.k } }
      canopy(g, c, c - s * 0.28 + sw * s * 0.01, s * 0.3, s * 0.18, '#4d8a3e', rng, 6)
      return
    }
    case U_CRAWLER: {
      g.strokeStyle = PAL.blightD; g.lineWidth = s * 0.04
      for (let i = 0; i < 4; i++) {
        const lx = c - s * 0.12 + i * s * 0.08, kk = ((i + (ph * 4 | 0)) & 1) ? 1 : -1
        g.beginPath(); g.moveTo(lx, c); g.lineTo(lx + kk * s * 0.04, c - s * 0.2); g.lineTo(lx + kk * s * 0.06, c - s * 0.28); g.stroke()
        g.beginPath(); g.moveTo(lx, c); g.lineTo(lx - kk * s * 0.04, c + s * 0.2); g.lineTo(lx - kk * s * 0.06, c + s * 0.28); g.stroke()
      }
      ell(g, c - s * 0.08, c, s * 0.16, s * 0.12, PAL.blightD)
      ell(g, c - s * 0.1, c - s * 0.02, s * 0.12, s * 0.08, PAL.blight)
      circle(g, c + s * 0.12, c, s * 0.08, PAL.blightD)
      circle(g, c + s * 0.16, c - s * 0.025, s * 0.02, '#ffe36b'); circle(g, c + s * 0.16, c + s * 0.025, s * 0.02, '#ffe36b')
      return
    }
    case U_HUSK: {
      const br = 1 + sw * 0.04
      line(g, c - s * 0.1, c + s * 0.12, c - s * 0.12 + sw * s * 0.05, c + s * 0.3, '#3a2030', s * 0.08)
      line(g, c + s * 0.1, c + s * 0.12, c + s * 0.12 - sw * s * 0.05, c + s * 0.3, '#3a2030', s * 0.08)
      ell(g, c, c, s * 0.28 * br, s * 0.24 * br, '#4a2a52')
      ell(g, c - s * 0.04, c - s * 0.04, s * 0.22 * br, s * 0.18 * br, '#6b3a7a')
      for (let i = 0; i < 5; i++) {
        const a = Math.PI * (1.1 + i * 0.2)
        poly(g, [c + Math.cos(a) * s * 0.2, c + Math.sin(a) * s * 0.17, c + Math.cos(a) * s * 0.36, c + Math.sin(a) * s * 0.32, c + Math.cos(a + 0.15) * s * 0.2, c + Math.sin(a + 0.15) * s * 0.17], PAL.barkD)
      }
      for (let i = 0; i < 3; i++) circle(g, c - s * 0.1 + i * s * 0.09, c + s * 0.05 - (i & 1) * s * 0.06, s * 0.035, '#c9f05a')
      circle(g, c + s * 0.17, c - s * 0.04, s * 0.03, '#ffe36b')
      return
    }
    case U_WISP: {
      const fl = sw * s * 0.04
      glowBlob(g, c, c, s * 0.42, PAL.blightL, 0.5)
      g.fillStyle = lin(g, 0, c - s * 0.3, 0, c + s * 0.25, [0, '#f0c0ff', 0.5, '#d070ff', 1, rgba(PAL.blightD, 0)])
      g.beginPath(); g.moveTo(c, c - s * 0.3 + fl)
      g.quadraticCurveTo(c + s * 0.22, c - s * 0.05, c + s * 0.08, c + s * 0.28)
      g.quadraticCurveTo(c, c + s * 0.12, c - s * 0.1, c + s * 0.3 - fl)
      g.quadraticCurveTo(c - s * 0.24, c - s * 0.05, c, c - s * 0.3 + fl)
      g.fill()
      circle(g, c + s * 0.04, c - s * 0.06, s * 0.03, '#1a0022'); circle(g, c + s * 0.11, c - s * 0.06, s * 0.03, '#1a0022')
      return
    }
    default:
      circle(g, c, c, s * 0.3, '#ff00ff')
  }
}
