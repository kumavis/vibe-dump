// The kits' public face (ENGINEERING.md §6) and their cache: the generators
// are deterministic, so a geometry is built once per kit id and colour date
// (and colour override) for the page's life, and a box revisited costs
// nothing. disposeKitCache() frees them (the box's dispose does not: the
// next box at the same date reuses them).

import { buildShipGeometry, colourAt, shipAsOne } from './ships.js'
import { buildAircraftGeometry, aircraftColoursAt } from './aircraft.js'
import { paletteFor, schemeFor } from './palette.js'
import { insigniaAtlas, insigniaRects } from './insignia.js'

export { buildShipGeometry, buildAircraftGeometry, paletteFor, schemeFor, insigniaAtlas, insigniaRects, colourAt, aircraftColoursAt, shipAsOne }

const CACHE = new Map()
const dayOf = (d) => {
  if (d == null) return 'any'
  const ms = typeof d === 'number' ? d : Date.parse(d)
  return new Date(ms).toISOString().slice(0, 10)
}

/** A ship kit's geometry at a date (cached). colour: a unit's override of the kit's colour, or null. */
export function shipGeometry(kit, { colourDate = null, weapons = null, colour = null } = {}) {
  const k = colour ? { ...kit, colour, colours: null } : kit
  const key = `ship:${kit.id}:${dayOf(colourDate)}:${colour ? JSON.stringify(colour) : ''}`
  let g = CACHE.get(key)
  if (!g) {
    g = buildShipGeometry(k, { colourDate, weapons })
    CACHE.set(key, g)
  }
  return g
}

/** An aircraft kit's geometry at a date (cached). */
export function aircraftGeometry(kit, { colourDate = null } = {}) {
  const key = `air:${kit.id}:${dayOf(colourDate)}`
  let g = CACHE.get(key)
  if (!g) {
    g = buildAircraftGeometry(kit, { colourDate })
    CACHE.set(key, g)
  }
  return g
}

export function disposeKitCache() {
  for (const g of CACHE.values()) {
    for (const k of ['hull', 'parts', 'body', 'prop']) g[k]?.dispose?.()
    for (const t of g.turrets || []) t.geometry.dispose()
  }
  CACHE.clear()
}

export function kitCacheSize() {
  return CACHE.size
}
