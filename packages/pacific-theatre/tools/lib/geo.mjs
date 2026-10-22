// The projections, for the bakes and the checks: a copy of src/geo.js's
// wrapLon, TangentProjection, TableProjection, projectionFor, placement,
// poseToTable/poseToBox and densifyLonLat (ENGINEERING.md §3: "tools/lib/geo.mjs
// holds a copy of TableProjection"), kept bit for bit the same, which
// tools/test-geo.mjs asserts: change one, change the other. Below the copy,
// the pack grids of a box bake, adapted from holo-i-ke-au's tools/lib/geo.mjs
// (b480c27): a box pack is a regular lon/lat grid in the box's own tangent
// plane, whose metres per degree of longitude come from the box's lat0 (the
// Hawaiian KX was fixed at 20.5° N, 46 % off at 50° N).

export const DEG = Math.PI / 180
/** The sphere every table projection is on (R1 §5.1): the mean Earth radius, metres. */
export const R_EARTH = 6371008.8

/** lon wrapped into [lon0 − 180, lon0 + 180). */
export function wrapLon(lon, lon0 = 0) {
  return lon0 + ((((lon - lon0 + 180) % 360) + 360) % 360) - 180
}

/**
 * A battle box (DATA.md §1): the Hawaiian app's local tangent plane, in
 * metres by default, origin at (lon0, lat0), x east and z south.
 */
export class TangentProjection {
  constructor({ lon0, lat0, unit = 1 } = {}) {
    if (!Number.isFinite(lon0) || !Number.isFinite(lat0)) throw new Error('TangentProjection needs lon0 and lat0')
    this.kind = 'tangent'
    this.lon0 = lon0
    this.lat0 = lat0
    this.unit = unit
    this.kx = (Math.cos(lat0 * DEG) * 111320) / unit // world units per degree of longitude
    this.kz = 110574 / unit // per degree of latitude
  }

  x(lon) {
    return (wrapLon(lon, this.lon0) - this.lon0) * this.kx
  }

  z(lat) {
    return -(lat - this.lat0) * this.kz
  }

  /** [lon, lat] (GeoJSON order) → [x, z] world units. */
  toWorld(c) {
    return [this.x(c[0]), this.z(c[1])]
  }

  /** world (x, z) → [lon, lat], lon in [lon0 − 180, lon0 + 180). */
  toLonLat(x, z) {
    return [wrapLon(x / this.kx + this.lon0, this.lon0), -z / this.kz + this.lat0]
  }

  scaleAt() {
    return 1
  }

  convergenceAt() {
    return 0
  }

  /** World units per metre east and per metre south (the plane's own metres). */
  jacobianAt() {
    return [
      [1 / this.unit, 0],
      [0, 1 / this.unit],
    ]
  }

  /**
   * A pack's bounds [west, south, east, north] as a world rectangle. The bake
   * writes bounds as the outer edges of the texel grid, row 0 at the north
   * edge, so texel (i, j) of a W × H pack is centred on
   * x0 + (i + ½)(x1 − x0)/W, z0 + (j + ½)(z1 − z0)/H. A box's east may
   * exceed 180 (a continuous range); each edge is wrapped about lon0.
   */
  rect([w, s, e, n]) {
    return { x0: this.x(w), z0: this.z(n), x1: this.x(e), z1: this.z(s) }
  }
}

/**
 * The table (DATA.md §1): Snyder's spherical forms on R_EARTH, centred on
 * (lon0, lat0), in kilometres by default. `kind` is 'aeqd' (v1, azimuthal
 * equidistant), 'laea' (Lambert azimuthal equal-area) or 'equirect'
 * (equirectangular with standard parallel `lat1`, lat0 if not given).
 */
export class TableProjection {
  constructor({ kind = 'aeqd', lon0, lat0, lat1, unit = 1000 } = {}) {
    if (!['aeqd', 'laea', 'equirect'].includes(kind)) throw new Error(`unknown table projection “${kind}”`)
    if (!Number.isFinite(lon0) || !Number.isFinite(lat0)) throw new Error('TableProjection needs lon0 and lat0')
    this.kind = kind
    this.lon0 = lon0
    this.lat0 = lat0
    this.lat1 = Number.isFinite(lat1) ? lat1 : lat0
    this.unit = unit
    this.R = R_EARTH
    this.sin0 = Math.sin(lat0 * DEG)
    this.cos0 = Math.cos(lat0 * DEG)
    this.cos1 = Math.cos(this.lat1 * DEG)
  }

  /** [lon, lat] → [x, z] world units (x east, z south). */
  toWorld(c) {
    const R = this.R
    const dl = (wrapLon(c[0], this.lon0) - this.lon0) * DEG
    const phi = c[1] * DEG
    if (this.kind === 'equirect') return [(R * this.cos1 * dl) / this.unit, -(R * (phi - this.lat0 * DEG)) / this.unit]
    const sp = Math.sin(phi)
    const cp = Math.cos(phi)
    const cd = Math.cos(dl)
    const ex = cp * Math.sin(dl)
    const ny = this.cos0 * sp - this.sin0 * cp * cd
    const cosc = this.sin0 * sp + this.cos0 * cp * cd
    let k
    if (this.kind === 'aeqd') {
      // c from atan2 of its sine and cosine: acos alone loses digits near the centre
      const sinc = Math.hypot(ex, ny)
      const cc = Math.atan2(sinc, cosc)
      k = sinc < 1e-15 ? 1 : cc / sinc
    } else {
      k = Math.sqrt(2 / Math.max(1e-300, 1 + cosc))
    }
    return [(R * k * ex) / this.unit, -(R * k * ny) / this.unit]
  }

  /** world (x, z) → [lon, lat], lon in [lon0 − 180, lon0 + 180). */
  toLonLat(x, z) {
    const R = this.R
    const X = x * this.unit
    const Y = -z * this.unit
    if (this.kind === 'equirect') return [wrapLon(this.lon0 + X / (R * this.cos1) / DEG, this.lon0), this.lat0 + Y / R / DEG]
    const rho = Math.hypot(X, Y)
    if (rho < 1e-9) return [this.lon0, this.lat0]
    const c = this.kind === 'aeqd' ? rho / R : 2 * Math.asin(Math.min(1, rho / (2 * R)))
    const sc = Math.sin(c)
    const cc = Math.cos(c)
    const phi = Math.asin(Math.max(-1, Math.min(1, cc * this.sin0 + (Y * sc * this.cos0) / rho)))
    const lam = Math.atan2(X * sc, rho * this.cos0 * cc - Y * this.sin0 * sc)
    return [wrapLon(this.lon0 + lam / DEG, this.lon0), phi / DEG]
  }

  /**
   * The projection's 2 × 2 Jacobian at [lon, lat]: world units per metre
   * east and per metre south on the sphere, [[dx/dE, dx/dS], [dz/dE, dz/dS]].
   * Central differences 25 m either way, which in doubles is good to about
   * one part in 1e10 here.
   */
  jacobianAt(c) {
    const h = 25
    const lat = c[1]
    const dLon = (h / (this.R * Math.max(1e-9, Math.cos(lat * DEG)))) / DEG // degrees for h metres east
    const dLat = h / this.R / DEG // degrees for h metres north
    const e1 = this.toWorld([c[0] + dLon, lat])
    const e0 = this.toWorld([c[0] - dLon, lat])
    const s1 = this.toWorld([c[0], lat - dLat]) // south
    const s0 = this.toWorld([c[0], lat + dLat])
    return [
      [(e1[0] - e0[0]) / (2 * h), (s1[0] - s0[0]) / (2 * h)],
      [(e1[1] - e0[1]) / (2 * h), (s1[1] - s0[1]) / (2 * h)],
    ]
  }

  /** The areal scale factor at [lon, lat]: sqrt(|det J|) · unit, 1 at the centre. */
  scaleAt(c) {
    const J = this.jacobianAt(c)
    return Math.sqrt(Math.abs(J[0][0] * J[1][1] - J[0][1] * J[1][0])) * this.unit
  }

  /**
   * Grid convergence at [lon, lat], degrees: the angle from grid north to
   * true north, positive turning from −z toward +x (clockwise on a north-up
   * table), atan2(−dx/dS, dz/dS). About −15° at Midway for the v1 centre:
   * true north leans west. (The azimuthal projections are not conformal, so
   * true east turns a little less: atan2(dz/dE, dx/dE) is −11° there. R1's
   * figures, and the "grid north to true north" of DATA.md, are this one.)
   */
  convergenceAt(c) {
    const J = this.jacobianAt(c)
    return Math.atan2(-J[0][1], J[1][1]) / DEG
  }
}

/** The projection a manifest describes: { kind: 'tangent' | 'aeqd' | 'laea' | 'equirect', lon0, lat0, unit }. */
export function projectionFor(desc) {
  if (!desc) throw new Error('projectionFor: no projection given')
  return desc.kind === 'tangent' ? new TangentProjection(desc) : new TableProjection(desc)
}

/**
 * A box on the table (DATA.md §1, §7): its centre in table units and the
 * Jacobian of box world → table world at the centre (table units per box
 * unit, east and south), exact to first order over a few hundred kilometres.
 * The Jacobian is taken through the box's own tangent plane (its 111,320 m
 * and 110,574 m degrees) and the table's sphere together, so a box metre
 * lands where the composed mapping puts it. box: a boxes/manifest.json entry
 * (its `projection`, or a TangentProjection as `proj`); table: the
 * TableProjection.
 */
export function placement(box, table) {
  const bp = box.proj instanceof TangentProjection ? box.proj : new TangentProjection(box.projection || box)
  const centre = table.toWorld([bp.lon0, bp.lat0])
  const h = 25 / bp.unit
  const f = (x, z) => table.toWorld(bp.toLonLat(x, z))
  const xe = f(h, 0)
  const xw = f(-h, 0)
  const zs = f(0, h)
  const zn = f(0, -h)
  const J = [
    [(xe[0] - xw[0]) / (2 * h), (zs[0] - zn[0]) / (2 * h)],
    [(xe[1] - xw[1]) / (2 * h), (zs[1] - zn[1]) / (2 * h)],
  ]
  const det = J[0][0] * J[1][1] - J[0][1] * J[1][0]
  const Jinv = [
    [J[1][1] / det, -J[0][1] / det],
    [-J[1][0] / det, J[0][0] / det],
  ]
  const scale = Math.sqrt(Math.abs(det))
  // the turn of the box's north on the table (TableProjection.convergenceAt's
  // rule), so a camera looking north in the box looks along the box's
  // meridian on the table at the hand-over
  const alpha = Math.atan2(-J[0][1], J[1][1])
  const [cx, cz] = centre
  const matrix = new Float64Array([J[0][0], 0, J[1][0], 0, 0, scale, 0, 0, J[0][1], 0, J[1][1], 0, cx, 0, cz, 1])
  return {
    id: box.id,
    lon0: bp.lon0,
    lat0: bp.lat0,
    centre,
    J,
    Jinv,
    scale,
    alpha,
    convergenceDeg: alpha / DEG,
    /** box world [x, z] → table world [x, z] */
    toTable: ([x, z]) => [cx + J[0][0] * x + J[0][1] * z, cz + J[1][0] * x + J[1][1] * z],
    /** table world [x, z] → box world [x, z] */
    toBox: ([x, z]) => {
      const dx = x - cx
      const dz = z - cz
      return [Jinv[0][0] * dx + Jinv[0][1] * dz, Jinv[1][0] * dx + Jinv[1][1] * dz]
    },
    /** box metres → table km, column-major, y scaled by `scale` */
    matrix,
  }
}

/**
 * A camera pose { target: {x, y, z}, distance, yaw, pitch } from a box to the
 * table and back (the hand-over, ENGINEERING §9). The rig puts the camera at
 * target + d·(cos p·sin ψ, sin p, cos p·cos ψ); the box's +x maps to a table
 * direction `alpha` from the table's +x toward +z, so ψ_table = ψ_box − alpha.
 * (alpha is the turn of the box's north; with the projection's shear an
 * oblique direction turns by up to a few degrees more or less.) y is carried
 * by the scale only as a hint: each scene puts its own target on its own
 * ground.
 */
export function poseToTable(pose, pl) {
  const [x, z] = pl.toTable([pose.target.x, pose.target.z])
  return { target: { x, y: (pose.target.y ?? 0) * pl.scale, z }, distance: pose.distance * pl.scale, yaw: pose.yaw - pl.alpha, pitch: pose.pitch }
}

export function poseToBox(pose, pl) {
  const [x, z] = pl.toBox([pose.target.x, pose.target.z])
  return { target: { x, y: (pose.target.y ?? 0) / pl.scale, z }, distance: pose.distance / pl.scale, yaw: pose.yaw + pl.alpha, pitch: pose.pitch }
}

/**
 * A ring or line of [lon, lat] with every leg longer than maxKm split in
 * lon/lat, so an edge drawn straight on a plate carrée source map is not
 * drawn as a chord across the azimuthal table (R9 §2.1). Longitudes must be
 * normalised already (continuous across 180).
 */
export function densifyLonLat(coords, maxKm = 50) {
  if (!coords || coords.length < 2) return coords
  const out = [coords[0]]
  for (let i = 1; i < coords.length; i++) {
    const a = coords[i - 1]
    const b = coords[i]
    const kx = 111.32 * Math.cos((((a[1] + b[1]) / 2) * Math.PI) / 180)
    const km = Math.hypot((b[0] - a[0]) * kx, (b[1] - a[1]) * 110.574)
    const n = Math.max(1, Math.ceil(km / maxKm))
    for (let k = 1; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n])
    out.push(b)
  }
  return out
}

// ---------------------------------------------------------------------------
// Box pack grids

/** Metres per degree of longitude and of latitude in a box's tangent plane at lat0. */
export function tangentK(lat0) {
  return [Math.cos(lat0 * DEG) * 111320, 110574]
}

const r7 = (v) => Math.round(v * 1e7) / 1e7

/**
 * A box pack grid: a regular lon/lat grid whose texels are square in the
 * box's tangent-plane metres. bbox is [west, south, east, north] of the
 * subject (east may exceed 180); it is padded by padMetres on every side,
 * then either `width` texels across, or `longSide` texels on the longer side.
 * The short side is rounded up so no padding is lost, then the bounds are
 * re-centred so that they are exactly the outer edges of the texel grid:
 * texel (i, j) covers
 *   lon west + i*dLon .. west + (i+1)*dLon,  lat north - j*dLat .. north - (j+1)*dLat
 * with row 0 at the north edge.
 */
export function packGrid(bbox, { lat0 = (bbox[1] + bbox[3]) / 2, padMetres = 0, longSide, width }) {
  const [KX, KZ] = tangentK(lat0)
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
  return gridFromBounds(bounds, W, H, lat0)
}

/** Grid helpers for given bounds and size (texel metres in the tangent plane at lat0). */
export function gridFromBounds(bounds, W, H, lat0 = (bounds[1] + bounds[3]) / 2) {
  const [KX, KZ] = tangentK(lat0)
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

/** Bounding box [w, s, e, n] of any GeoJSON geometry's coordinates (normalise longitudes first). */
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
