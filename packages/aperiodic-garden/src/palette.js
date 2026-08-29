// Colours and the per-biome look. Kept in one place so the whole garden can be
// re-tuned without touching the geometry builder.
//
// The ground is flat, so colour is doing all the work of telling one cover from
// another: the five sit at clearly different values as well as different hues,
// which is what keeps them apart at the distance the camera actually sits.

import { PLAINS, FOREST, HILLS, VILLAGE, SCREE } from './board.js'

export const SKY_TOP = 0xbcd8e8
export const FOG = 0xdce8ec
export const EARTH_TOP = 0x7a6047
export const EARTH_LOW = 0x3d3128

/** top: the flat face. edge: the chamfer under it, always a shade darker. */
export const LOOK = []
LOOK[PLAINS] = { top: 0xc5d67a, edge: 0xa3b662, name: 'meadow' }
LOOK[FOREST] = { top: 0x4c7a4a, edge: 0x3a5f3c, name: 'forest' }
LOOK[HILLS] = { top: 0xb2a061, edge: 0x93844e, name: 'hills' }
LOOK[VILLAGE] = { top: 0xd8c8a6, edge: 0xb5a582, name: 'hamlet' }
LOOK[SCREE] = { top: 0x8d919a, edge: 0x6e727b, name: 'scree' }

// The river is a line drawn on the ground, not a cover: a dark bank with bright
// water inside it, so it reads as a stream from directly above.
export const RIVER_BANK = 0x3f5a52
export const WATER_SHALLOW = 0x9fd8ea
export const WATER_DEEP = 0x3f92be

// The peak is a modelled feature standing on flat ground.
export const ROCK = 0x6f7681
export const ROCK_DARK = 0x4d5460
export const SNOW = 0xfbfdff
export const SNOW_SHADE = 0xc6d6e6

export const TREE_GREENS = [0x3f6b3f, 0x4a7b45, 0x36603c, 0x557f45]
export const AUTUMN = [0xb8823c, 0xa96a34]
export const HOUSE_WALLS = [0xe8ddc7, 0xdccdb2, 0xf0e7d6]
export const HOUSE_ROOFS = [0xa04f3c, 0x8c4436, 0xb35b45, 0x6d5a4c]
export const ROCK_GREYS = [0x8b8f96, 0x9aa0a6, 0x7c8189]

/** The warm spark that marks somewhere a tile could go. */
export const HINT = 0xffe9a8
/** The outline that says the piece under the cursor is not laid yet. */
export const GHOST_RIM = 0xfff0b8

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

export const topColour = (biome, jitter) => shade(LOOK[biome].top, 0.94 + jitter * 0.12)
export const edgeColour = (biome, jitter) => shade(LOOK[biome].edge, 0.94 + jitter * 0.1)

/** '#rrggbb', for the 2D tile card. */
export const css = (hex) => '#' + hex.toString(16).padStart(6, '0')
