// The shared projection (DATA.md §1): equirectangular about 20.5° N, 157.5° W,
// so every pack, boundary and pin lands in one world. It is linear in lon and
// lat, which means every pack's raster is an axis-aligned rectangle in world
// space and its texels stay square to the axes.

import { UNIT } from './config.js'

const DEG = Math.PI / 180

export class Projection {
  constructor({ lat0 = 20.5, lon0 = -157.5 } = {}) {
    this.lat0 = lat0
    this.lon0 = lon0
    this.kx = (Math.cos(lat0 * DEG) * 111320) / UNIT // world units per degree of longitude
    this.kz = 110574 / UNIT // per degree of latitude
  }

  x(lon) {
    return (lon - this.lon0) * this.kx
  }

  z(lat) {
    return -(lat - this.lat0) * this.kz
  }

  /** [lon, lat] (GeoJSON order) → [x, z] world units. */
  toWorld(c) {
    return [this.x(c[0]), this.z(c[1])]
  }

  toLonLat(x, z) {
    return [x / this.kx + this.lon0, -z / this.kz + this.lat0]
  }

  /**
   * A pack's bounds [west, south, east, north] as a world rectangle. The bake
   * writes bounds as the outer edges of the texel grid, row 0 at the north edge,
   * so texel (i, j) of a W × H pack is centred on
   * x0 + (i + ½)(x1 − x0)/W, z0 + (j + ½)(z1 − z0)/H.
   */
  rect([w, s, e, n]) {
    return { x0: this.x(w), z0: this.z(n), x1: this.x(e), z1: this.z(s) }
  }
}

/** Plain-ASCII key for an island name: "Hawaiʻi" → "hawaii", "Kahoʻolawe" → "kahoolawe". */
export function islandKey(name) {
  return String(name || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[ʻʼ‘’'`]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
}

/** A representative point for a GeoJSON geometry: the point itself, a line's middle vertex, or a polygon's area centroid. */
export function geometryPoint(g) {
  if (!g) return null
  if (g.type === 'Point') return g.coordinates
  if (g.type === 'LineString') return g.coordinates[Math.floor(g.coordinates.length / 2)]
  if (g.type === 'MultiPoint') return g.coordinates[0]
  const rings = g.type === 'Polygon' ? [g.coordinates[0]] : g.type === 'MultiPolygon' ? g.coordinates.map((p) => p[0]) : null
  if (!rings) return null
  let A = 0
  let cx = 0
  let cy = 0
  for (const r of rings) {
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const f = r[j][0] * r[i][1] - r[i][0] * r[j][1]
      A += f
      cx += (r[j][0] + r[i][0]) * f
      cy += (r[j][1] + r[i][1]) * f
    }
  }
  if (Math.abs(A) < 1e-12) return rings[0][0]
  return [cx / (3 * A), cy / (3 * A)]
}
