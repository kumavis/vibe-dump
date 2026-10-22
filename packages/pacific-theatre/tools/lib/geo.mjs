// The shared projection of DATA.md §1, the island table, and pack grids.

export const LAT0 = 20.5
export const LON0 = -157.5
/** metres per degree of longitude and of latitude in the shared projection */
export const KX = Math.cos((LAT0 * Math.PI) / 180) * 111320
export const KZ = 110574

/** lon/lat (degrees) to projected metres [x, z]; z grows south. */
export function project(lon, lat) {
  return [(lon - LON0) * KX, -(lat - LAT0) * KZ]
}

/** The eight main islands: pack id, display name, and the order they go in the manifest. */
export const ISLANDS = [
  { id: 'hawaii', name: 'Hawaiʻi' },
  { id: 'maui', name: 'Maui' },
  { id: 'kahoolawe', name: 'Kahoʻolawe' },
  { id: 'lanai', name: 'Lānaʻi' },
  { id: 'molokai', name: 'Molokaʻi' },
  { id: 'oahu', name: 'Oʻahu' },
  { id: 'kauai', name: 'Kauaʻi' },
  { id: 'niihau', name: 'Niʻihau' },
]

export const ARCHIPELAGO = { id: 'archipelago', name: 'Ka Pae ʻĀina' }

/** Fold a Hawaiian name to ASCII: drop kahakō and every kind of ʻokina, lower-case. */
export function fold(name) {
  return String(name)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[ʻʼ‘’'`]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
}

/** Island pack id for a name as the State layer spells it, or null. */
export function islandId(name) {
  const f = fold(name)
  return ISLANDS.find((i) => i.id === f)?.id ?? null
}

const r7 = (v) => Math.round(v * 1e7) / 1e7

/**
 * A pack grid: a regular lon/lat grid whose texels are square in projected
 * metres. bbox is [west, south, east, north] of the subject; it is padded by
 * padMetres on every side, then either `width` texels across, or `longSide`
 * texels on the longer side. The short side is rounded up so no padding is
 * lost, then the bounds are re-centred so that they are exactly the outer
 * edges of the texel grid: texel (i, j) covers
 *   lon west + i*dLon .. west + (i+1)*dLon,  lat north - j*dLat .. north - (j+1)*dLat
 * with row 0 at the north edge.
 */
export function packGrid(bbox, { padMetres = 2000, longSide, width }) {
  let [w, s, e, n] = bbox
  w -= padMetres / KX
  e += padMetres / KX
  s -= padMetres / KZ
  n += padMetres / KZ
  const wm = (e - w) * KX
  const hm = (n - s) * KZ
  let step, W, H
  if (width) {
    W = width
    step = wm / W
    H = Math.ceil(hm / step - 1e-9)
  } else {
    step = Math.max(wm, hm) / longSide
    W = Math.min(longSide, Math.ceil(wm / step - 1e-9))
    H = Math.min(longSide, Math.ceil(hm / step - 1e-9))
  }
  const cx = (w + e) / 2
  const cy = (s + n) / 2
  const halfLon = (W * step) / 2 / KX
  const halfLat = (H * step) / 2 / KZ
  const bounds = [r7(cx - halfLon), r7(cy - halfLat), r7(cx + halfLon), r7(cy + halfLat)]
  return gridFromBounds(bounds, W, H)
}

/** Grid helpers for given bounds and size. */
export function gridFromBounds(bounds, W, H) {
  const [w, s, e, n] = bounds
  const dLon = (e - w) / W
  const dLat = (n - s) / H
  return {
    bounds,
    W,
    H,
    dLon,
    dLat,
    metresPerTexel: [dLon * KX, dLat * KZ],
    /** lon of the centre of column i */
    lonAt: (i) => w + (i + 0.5) * dLon,
    /** lat of the centre of row j (row 0 north) */
    latAt: (j) => n - (j + 0.5) * dLat,
  }
}

/** Bounding box [w, s, e, n] of any GeoJSON geometry's coordinates. */
export function bboxOf(geometry, into = [Infinity, Infinity, -Infinity, -Infinity]) {
  const visit = (c) => {
    if (typeof c[0] === 'number') {
      if (c[0] < into[0]) into[0] = c[0]
      if (c[1] < into[1]) into[1] = c[1]
      if (c[0] > into[2]) into[2] = c[0]
      if (c[1] > into[3]) into[3] = c[1]
    } else c.forEach(visit)
  }
  visit(geometry.coordinates)
  return into
}
