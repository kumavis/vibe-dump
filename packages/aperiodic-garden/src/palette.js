// Colours and the per-biome look. Kept in one place so the whole garden can be
// re-tuned without touching the geometry builder.

import { WATER, PLAINS, FOREST, HILLS, VILLAGE, PEAK } from './board.js'

export const SKY_TOP = 0xbcd8e8
export const SKY_LOW = 0xe9eee4
export const FOG = 0xdce8ec
export const EARTH_TOP = 0x7a6047
export const EARTH_LOW = 0x3d3128
export const SNOW = 0xf8fbfe
export const ROCK = 0x6f757f

/** top: the flat face. edge: the chamfer under it, always a shade darker. */
export const LOOK = []
LOOK[WATER] = { top: 0x2f5d78, edge: 0x3d4f52, name: 'river' }
LOOK[PLAINS] = { top: 0xc5d67a, edge: 0xa3b662, name: 'meadow' }
LOOK[FOREST] = { top: 0x4c7a4a, edge: 0x3a5f3c, name: 'forest' }
LOOK[HILLS] = { top: 0xb2a061, edge: 0x93844e, name: 'hills' }
LOOK[VILLAGE] = { top: 0xd8c8a6, edge: 0xb5a582, name: 'hamlet' }
LOOK[PEAK] = { top: 0x6f757f, edge: 0x555b64, name: 'peak' }

export const WATER_SHALLOW = 0x9fd8ea
export const WATER_DEEP = 0x3f92be

/** Above this ground elevation (lattice units, pre-scale) a peak wears snow. */
/** Snow is a property of *height*, not of biome: above the treeline the alpine
 *  slope goes white too, which is what makes the massif read as a mountain
 *  rather than as a grey lid on a green hill. */
export const SNOW_LINE = 2.5
export const SNOW_BLEND = 0.55

export const TREE_GREENS = [0x3f6b3f, 0x4a7b45, 0x36603c, 0x557f45]
export const AUTUMN = [0xb8823c, 0xa96a34]
export const HOUSE_WALLS = [0xe8ddc7, 0xdccdb2, 0xf0e7d6]
export const HOUSE_ROOFS = [0xa04f3c, 0x8c4436, 0xb35b45, 0x6d5a4c]
export const ROCK_GREYS = [0x8b8f96, 0x9aa0a6, 0x7c8189]

export function shade(hex, k) {
  const r = Math.min(255, Math.round(((hex >> 16) & 255) * k))
  const g = Math.min(255, Math.round(((hex >> 8) & 255) * k))
  const b = Math.min(255, Math.round((hex & 255) * k))
  return (r << 16) | (g << 8) | b
}

export function mixHex(a, b, t) {
  const ar = (a >> 16) & 255
  const ag = (a >> 8) & 255
  const ab = a & 255
  const br = (b >> 16) & 255
  const bg = (b >> 8) & 255
  const bb = b & 255
  return (
    (Math.round(ar + (br - ar) * t) << 16) |
    (Math.round(ag + (bg - ag) * t) << 8) |
    Math.round(ab + (bb - ab) * t)
  )
}

/** The top colour of a cell, once snow and a little per-cell variation are in. */
const snowT = (h, off = 0) => {
  const t = Math.min(1, Math.max(0, (h - SNOW_LINE - off) / SNOW_BLEND))
  return t * t * (3 - 2 * t)
}

export function topColour(biome, height, jitter) {
  const c = shade(LOOK[biome].top, 0.94 + jitter * 0.12)
  return mixHex(c, SNOW, snowT(height))
}

export function edgeColour(biome, height, jitter) {
  const c = shade(LOOK[biome].edge, 0.94 + jitter * 0.1)
  return mixHex(c, shade(SNOW, 0.86), snowT(height, 0.25))
}
