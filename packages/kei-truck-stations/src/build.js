import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Geometry primitives
//
// Two conventions run through this whole app and they are worth stating once.
//
// UNITS ARE METRES. Every real-world dimension in specs.js is quoted in
// millimetres, because that is how the spec sheets quote them and converting by
// hand is how you end up with a 14-metre truck. `mm()` does the conversion at
// the one place it belongs, and nothing downstream ever sees a millimetre.
//
// ANCHORS, NOT CENTRES. `slab()` takes an anchor in [-1, 1] per axis: -1 puts
// the box's minimum face on the origin, 0 centres it, +1 puts its maximum face
// there. A folding panel is authored with its *hinge edge* on the origin, so the
// rig can rotate the part directly and the panel swings about the hinge instead
// of about its own middle. Nearly every part below is anchored, not centred.
// ---------------------------------------------------------------------------

/** millimetres -> scene metres. */
export const mm = (v) => v / 1000

/** degrees -> radians, because spec sheets quote rake angles in degrees. */
export const deg = (v) => (v * Math.PI) / 180

const UNIT = new THREE.BoxGeometry(1, 1, 1)

/**
 * A box, anchored.
 *
 * @param {[number,number,number]} size    metres
 * @param {THREE.Material} mat
 * @param {object} [o]
 * @param {[number,number,number]} [o.anchor]  -1 min face on origin, 0 centre, +1 max face
 * @param {[number,number,number]} [o.pos]     offset applied after anchoring
 */
export function slab(size, mat, { anchor = [0, 0, 0], pos = [0, 0, 0], rot = null, name = '' } = {}) {
  const m = new THREE.Mesh(UNIT, mat)
  m.scale.set(size[0] || 1e-5, size[1] || 1e-5, size[2] || 1e-5)
  m.position.set(
    pos[0] - (anchor[0] * size[0]) / 2,
    pos[1] - (anchor[1] * size[1]) / 2,
    pos[2] - (anchor[2] * size[2]) / 2,
  )
  if (rot) m.rotation.set(rot[0], rot[1], rot[2])
  m.castShadow = true
  m.receiveShadow = true
  if (name) m.name = name
  return m
}

/** The hull spec that `slab` above would occupy — so a part's collision box and
 *  its visible box are written once and cannot drift apart. */
export function slabHull(size, { anchor = [0, 0, 0], pos = [0, 0, 0], tag = '' } = {}) {
  return {
    s: size,
    c: [
      pos[0] - (anchor[0] * size[0]) / 2,
      pos[1] - (anchor[1] * size[1]) / 2,
      pos[2] - (anchor[2] * size[2]) / 2,
    ],
    tag,
  }
}

/** Rounded box via an extruded rounded rectangle. Depth runs along +Z. */
export function roundedSlab(w, h, d, r, mat, { anchor = [0, 0, 0], pos = [0, 0, 0], steps = 3 } = {}) {
  const rr = Math.min(r, w / 2 - 1e-4, h / 2 - 1e-4)
  const s = new THREE.Shape()
  s.moveTo(-w / 2 + rr, -h / 2)
  s.lineTo(w / 2 - rr, -h / 2)
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + rr)
  s.lineTo(w / 2, h / 2 - rr)
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - rr, h / 2)
  s.lineTo(-w / 2 + rr, h / 2)
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - rr)
  s.lineTo(-w / 2, -h / 2 + rr)
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + rr, -h / 2)
  const g = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false, curveSegments: steps })
  g.translate(0, 0, -d / 2)
  const m = new THREE.Mesh(g, mat)
  m.position.set(pos[0] - (anchor[0] * w) / 2, pos[1] - (anchor[1] * h) / 2, pos[2] - (anchor[2] * d) / 2)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

/** A cylinder laid along an arbitrary axis between two points. */
export function rod(a, b, radius, mat, { seg = 12, cap = false } = {}) {
  const va = new THREE.Vector3().fromArray(a)
  const vb = new THREE.Vector3().fromArray(b)
  const dir = new THREE.Vector3().subVectors(vb, va)
  const len = dir.length()
  if (len < 1e-6) return new THREE.Group()
  const g = new THREE.CylinderGeometry(radius, radius, len, seg, 1, !cap)
  const m = new THREE.Mesh(g, mat)
  m.position.copy(va).addScaledVector(dir, 0.5)
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
  m.castShadow = true
  m.receiveShadow = true
  return m
}

/**
 * A length of square aluminium tube — the module frames are built from these.
 * Drawn as a solid box; at this scale the wall thickness is invisible and the
 * triangle budget is better spent elsewhere.
 */
export function extrusion(a, b, section, mat) {
  const va = new THREE.Vector3().fromArray(a)
  const vb = new THREE.Vector3().fromArray(b)
  const dir = new THREE.Vector3().subVectors(vb, va)
  const len = dir.length()
  if (len < 1e-6) return new THREE.Group()
  const m = new THREE.Mesh(UNIT, mat)
  m.scale.set(section, len, section)
  m.position.copy(va).addScaledVector(dir, 0.5)
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())
  m.castShadow = true
  m.receiveShadow = true
  return m
}

/**
 * Aluminium ladder truss: two chords and a zig-zag web.
 *
 * Runs along +X from the origin, `depth` tall in Y, chords `width` apart in Z.
 * This is the section that lets a canopy cantilever without a mid-span leg, so
 * it appears wherever a station spans more than about a metre unsupported.
 */
export function truss(length, depth, width, mat, { chord = 0.024, bays = 0 } = {}) {
  const g = new THREE.Group()
  const n = bays || Math.max(2, Math.round(length / Math.max(0.18, depth)))
  const zs = width > chord ? [-width / 2, width / 2] : [0]
  for (const z of zs) {
    g.add(extrusion([0, 0, z], [length, 0, z], chord, mat))
    g.add(extrusion([0, depth, z], [length, depth, z], chord, mat))
    for (let i = 0; i < n; i++) {
      const x0 = (i / n) * length
      const x1 = ((i + 1) / n) * length
      // Alternate the diagonal so the web reads as a Warren truss: every bay
      // takes its shear in a member that is loaded along its length.
      const up = i % 2 === 0
      g.add(rod([x0, up ? 0 : depth, z], [x1, up ? depth : 0, z], chord * 0.42, mat))
      g.add(rod([x1, 0, z], [x1, depth, z], chord * 0.36, mat))
    }
    g.add(rod([0, 0, z], [0, depth, z], chord * 0.36, mat))
  }
  if (zs.length === 2) {
    for (let i = 0; i <= n; i++) {
      const x = (i / n) * length
      g.add(rod([x, 0, -width / 2], [x, 0, width / 2], chord * 0.34, mat))
      g.add(rod([x, depth, -width / 2], [x, depth, width / 2], chord * 0.34, mat))
    }
  }
  return g
}

/**
 * The knuckles of a piano hinge, drawn on the fold line.
 *
 * Cosmetic, but it is the detail that makes a fold read as a hinge rather than
 * as two boxes that happen to meet — and it draws the eye to the offset that
 * makes the fold legal.
 */
export function hingeLine(a, b, radius, mat, { count = 0 } = {}) {
  const va = new THREE.Vector3().fromArray(a)
  const vb = new THREE.Vector3().fromArray(b)
  const len = va.distanceTo(vb)
  const n = count || Math.max(3, Math.round(len / (radius * 9)))
  const g = new THREE.Group()
  for (let i = 0; i < n; i++) {
    if (i % 2 === 1) continue
    const t0 = i / n
    const t1 = (i + 1) / n
    g.add(
      rod(
        new THREE.Vector3().lerpVectors(va, vb, t0).toArray(),
        new THREE.Vector3().lerpVectors(va, vb, t1).toArray(),
        radius,
        mat,
        { seg: 8 },
      ),
    )
  }
  g.add(rod(a, b, radius * 0.34, mat, { seg: 6 }))
  return g
}

/** A row of bolt heads along a line — used on subframe spreader plates. */
export function boltRow(a, b, count, radius, mat) {
  const va = new THREE.Vector3().fromArray(a)
  const vb = new THREE.Vector3().fromArray(b)
  const g = new THREE.Group()
  const geo = new THREE.CylinderGeometry(radius, radius, radius * 0.8, 6)
  const dir = new THREE.Vector3().subVectors(vb, va)
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(geo, mat)
    m.position.copy(va).addScaledVector(dir, count === 1 ? 0.5 : i / (count - 1))
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0))
    g.add(m)
  }
  return g
}

/** Extrude a 2-D profile (array of [x,y]) along +Z. Used for stamped panels. */
export function profile(points, depth, mat, { anchorZ = 0, holes = [] } = {}) {
  const s = new THREE.Shape()
  s.moveTo(points[0][0], points[0][1])
  for (let i = 1; i < points.length; i++) s.lineTo(points[i][0], points[i][1])
  s.closePath()
  for (const h of holes) {
    const p = new THREE.Path()
    p.moveTo(h[0][0], h[0][1])
    for (let i = 1; i < h.length; i++) p.lineTo(h[i][0], h[i][1])
    p.closePath()
    s.holes.push(p)
  }
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false })
  g.translate(0, 0, -(anchorZ + 1) * depth * 0.5)
  const m = new THREE.Mesh(g, mat)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

/**
 * A lathed solid from a [radius, height] profile — finials, lantern bodies,
 * the offering-box roll, wheel dishes.
 */
export function lathe(pts, mat, { seg = 24, open = false } = {}) {
  const v = pts.map((p) => new THREE.Vector2(p[0], p[1]))
  const g = new THREE.LatheGeometry(v, seg)
  const m = new THREE.Mesh(g, mat)
  m.material.side = open ? THREE.DoubleSide : THREE.FrontSide
  m.castShadow = true
  m.receiveShadow = true
  return m
}

/**
 * A doubly-curved shrine roof plane.
 *
 * A Japanese roof is not a flat triangle: the slope steepens toward the ridge
 * and the eave flies up at the corners (sori). This builds one half-slope as a
 * grid whose Y is a sag curve along the rake and whose eave line lifts toward
 * the ends — the minimum that makes a roof read as a shrine rather than as a
 * shed. The station that uses it folds the surface as flat facets and this
 * mesh is what those facets approximate.
 *
 * @param {number} run    horizontal distance ridge -> eave (metres, along +X)
 * @param {number} span   length along the ridge (metres, along +Z)
 * @param {number} rise   height of the ridge above the eave
 * @param {number} sori   how far the eave corners lift
 */
export function shrineRoofPlane(run, span, rise, sori, thickness, mat, { nx = 10, nz = 14 } = {}) {
  const g = new THREE.PlaneGeometry(run, span, nx, nz)
  const p = g.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    const u = (v.x + run / 2) / run // 0 at ridge -> 1 at eave
    const w = Math.abs(v.y) / (span / 2) // 0 mid-ridge -> 1 at gable end
    // Concave slope: steep off the ridge, flattening to the eave (mukuri/sori).
    const drop = rise * (1 - Math.pow(1 - u, 1.85))
    const lift = sori * Math.pow(u, 2.4) * Math.pow(w, 2.0)
    p.setXYZ(i, v.x, v.y, -drop + lift)
  }
  g.computeVertexNormals()
  g.rotateX(-Math.PI / 2)
  g.rotateY(Math.PI / 2)
  const top = new THREE.Mesh(g, mat)
  top.castShadow = true
  top.receiveShadow = true
  const out = new THREE.Group()
  out.add(top)
  if (thickness > 0) {
    const under = top.clone()
    under.geometry = g.clone()
    under.geometry.translate(0, -thickness, 0)
    under.geometry.scale(1, -1, 1)
    under.geometry.computeVertexNormals()
    out.add(under)
  }
  return out
}

/** A hanging cloth panel with a gentle catenary sag — noren, banners, skirts. */
export function cloth(width, height, sag, mat, { nx = 10, ny = 6, wave = 0.01 } = {}) {
  const g = new THREE.PlaneGeometry(width, height, nx, ny)
  const p = g.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    const u = v.x / width
    const t = (height / 2 - v.y) / height // 0 at the rail -> 1 at the hem
    p.setXYZ(i, v.x, v.y - sag * (1 - Math.cos(u * Math.PI * 2)) * 0.5 * t, Math.sin(u * Math.PI * 5) * wave * t)
  }
  g.computeVertexNormals()
  const m = new THREE.Mesh(g, mat)
  m.castShadow = true
  m.receiveShadow = true
  return m
}

/** Fabric stretched over a frame, bellowed — pop-top tent walls. */
export function bellows(width, height, depth, mat, { pleats = 6 } = {}) {
  const g = new THREE.PlaneGeometry(width, height, pleats * 2, 4)
  const p = g.attributes.position
  const v = new THREE.Vector3()
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i)
    const u = (v.x + width / 2) / width
    const t = 1 - Math.abs(v.y) / (height / 2)
    p.setXYZ(i, v.x, v.y, Math.sin(u * Math.PI * pleats * 2) * depth * 0.5 * (0.35 + 0.65 * t))
  }
  g.computeVertexNormals()
  const m = new THREE.Mesh(g, mat)
  m.castShadow = false
  m.receiveShadow = true
  return m
}

/** Merge a group's world transform into a single parent for cheap reuse. */
export function grouped(...objs) {
  const g = new THREE.Group()
  for (const o of objs) if (o) g.add(o)
  return g
}

/** Clamp, and a smoothstep that takes its own edges — used by the body tapers. */
export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const smoothstep = (a, b, v) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/**
 * Scale a geometry's Z as a function of its Y, in place.
 *
 * This is how the cab gets its tumblehome. An extruded side silhouette is
 * necessarily constant-width, but a kei cab is 1440 mm across the shoulders and
 * only 1290 across the roof — and without that taper it models as a fridge.
 * Rather than give up the silhouette extrusion (which is what makes the
 * windscreen aperture honest), the extrusion is squeezed afterwards.
 */
export function taperByHeight(geometry, fn) {
  const p = geometry.attributes.position
  for (let i = 0; i < p.count; i++) {
    p.setZ(i, p.getZ(i) * fn(p.getY(i)))
  }
  p.needsUpdate = true
  geometry.computeVertexNormals()
  return geometry
}

/** A flat quad from four corner points, wound a-b-c-d. */
export function quad(a, b, c, d, mat, { doubleSide = true } = {}) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b, ...c, ...a, ...c, ...d], 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1], 2))
  g.computeVertexNormals()
  const m = new THREE.Mesh(g, mat)
  if (doubleSide) m.material = mat
  m.castShadow = true
  m.receiveShadow = true
  return m
}

/** Piecewise-linear lookup over [[key, value], ...], sorted ascending by key. */
export function piecewise(table) {
  return (k) => {
    if (k <= table[0][0]) return table[0][1]
    for (let i = 1; i < table.length; i++) {
      if (k <= table[i][0]) {
        const [k0, v0] = table[i - 1]
        const [k1, v1] = table[i]
        return v0 + ((v1 - v0) * (k - k0)) / (k1 - k0)
      }
    }
    return table[table.length - 1][1]
  }
}
