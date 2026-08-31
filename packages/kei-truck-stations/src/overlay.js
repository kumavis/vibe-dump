import * as THREE from 'three'
import { T, X } from './specs.js'
import { mm } from './build.js'

// ---------------------------------------------------------------------------
// The engineering overlay
//
// Everything the design claims, drawn on top of the thing itself:
//
//   COLLISION HULLS — the boxes the audit actually tested, in green, turning
//   red on any pair it found sharing space. If a fold is illegal you can see
//   which two boxes and watch the frame it happens on.
//   HINGE AXES — a stub through every joint, along the axis it turns about.
//   SWEPT ARCS — the path each hinged part's far corner travels, drawn in its
//   parent's frame. This is the picture that makes a fold obviously safe or
//   obviously not: if an arc passes through a neighbour, the design is wrong.
//   THE SUPPORT POLYGON — the convex hull of every foot on the ground, and the
//   truck's own two contact patches. Fill it and it is the region the centre of
//   gravity has to stay inside.
//   THE CENTRE OF GRAVITY — a plumb line from where the deployed mass actually
//   acts down to the tarmac, green inside the polygon and red outside.
//
// The last two are the tipping check, live: deploy a module and watch the CG
// walk sideways as trays glide out and masts rise, while the polygon it has to
// stay inside grows underneath it.
// ---------------------------------------------------------------------------

const GROUND_Y = -T.deckH + mm(4) // the tarmac, in bed coordinates

/**
 * Where the empty truck's own weight acts, longitudinally.
 *
 * A kei truck is cab-forward with its engine under the seat, so unladen it is
 * nose-heavy — roughly 60/40 over the front axle, which puts its centre of
 * gravity about 0.4 of the wheelbase back from the front. Leaving the truck out
 * of the tipping sum entirely would make every module look like it was about to
 * fall over; it is 780 kg against the module's 300.
 */
const TRUCK_CG_X = X.axleFront - (X.axleFront - X.axleRear) * 0.4

export function buildOverlay({ rig, lib, statics, report }) {
  const group = new THREE.Group()
  group.name = 'overlay'
  group.visible = false

  const bad = new Set()
  for (const c of report?.collisions ?? []) {
    bad.add(c.a)
    bad.add(c.b)
  }

  // --- hull wireframes ------------------------------------------------------
  // One LineSegments per state, so the good and bad boxes can use different
  // materials without a per-box draw call.
  const hullSets = { ok: [], bad: [] }
  for (const part of rig.order) {
    for (const h of part.hulls) hullSets[bad.has(part.id) ? 'bad' : 'ok'].push({ part, h })
  }
  const hullLines = {}
  for (const key of ['ok', 'bad']) {
    const n = hullSets[key].length
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 24 * 3), 3))
    const line = new THREE.LineSegments(geo, key === 'bad' ? lib.hullWireBad : lib.hullWire)
    line.frustumCulled = false
    hullLines[key] = line
    group.add(line)
  }

  // --- hinge axes and swept arcs -------------------------------------------
  // Both are drawn as children of the relevant group, so they inherit the
  // transform for free and never need updating.
  for (const part of rig.order) {
    if (part.static || part.jointType === 'fixed') continue
    const stub = axisStub(part, lib)
    if (stub) part.group.add(stub)
    const arc = sweptArc(part, lib)
    if (arc) (part.group.parent ?? group).add(arc)
  }

  // --- support polygon + centre of gravity ---------------------------------
  const polyGeo = new THREE.BufferGeometry()
  polyGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(64 * 3), 3))
  const poly = new THREE.LineLoop(polyGeo, lib.supportWire)
  poly.frustumCulled = false
  group.add(poly)

  const cgGeo = new THREE.BufferGeometry()
  cgGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(2 * 3), 3))
  const cgLine = new THREE.Line(cgGeo, lib.supportWire)
  cgLine.frustumCulled = false
  group.add(cgLine)

  const cgOk = new THREE.MeshBasicMaterial({ color: 0x46e0a0, transparent: true, opacity: 0.9 })
  const cgBad = new THREE.MeshBasicMaterial({ color: 0xff4d6d, transparent: true, opacity: 0.95 })
  const cgDisc = new THREE.Mesh(new THREE.RingGeometry(mm(60), mm(110), 24), cgOk)
  cgDisc.rotation.x = -Math.PI / 2
  group.add(cgDisc)
  const cgBall = new THREE.Mesh(new THREE.SphereGeometry(mm(55), 12, 8), cgOk)
  group.add(cgBall)

  // The truck's own footprint: four tyre patches, always there, always part of
  // the polygon whether the module puts anything else on the ground or not.
  const tyrePatches = [
    [X.axleRear, -T.trackRear / 2],
    [X.axleRear, T.trackRear / 2],
    [X.axleFront, -T.trackFront / 2],
    [X.axleFront, T.trackFront / 2],
  ]

  const status = { inside: true, margin: 0, mass: 0 }

  function update() {
    for (const key of ['ok', 'bad']) {
      const arr = hullLines[key].geometry.attributes.position
      let o = 0
      for (const { part, h } of hullSets[key]) {
        o = writeBoxEdges(arr.array, o, part.group.matrixWorld, h)
      }
      arr.needsUpdate = true
      hullLines[key].geometry.setDrawRange(0, o / 3)
    }

    // Support polygon: every deployed foot plus the tyre patches.
    const pts = tyrePatches.map(([x, z]) => [x, z])
    for (const f of rig.feet()) {
      // A foot only counts once it is actually on the ground.
      if (f.y <= GROUND_Y + mm(25)) pts.push([f.x, f.z])
    }
    const hull = convexHull(pts)
    const pa = poly.geometry.attributes.position
    for (let i = 0; i < Math.min(hull.length, 64); i++) {
      pa.array[i * 3] = hull[i][0]
      pa.array[i * 3 + 1] = GROUND_Y
      pa.array[i * 3 + 2] = hull[i][1]
    }
    pa.needsUpdate = true
    poly.geometry.setDrawRange(0, Math.min(hull.length, 64))

    const { point, mass } = rig.centreOfMass()
    // The truck itself is by far the biggest mass in the system, and leaving it
    // out would make every module look like it was about to fall over.
    const truckMass = T.kerb
    const cx = (point.x * mass + TRUCK_CG_X * truckMass) / (mass + truckMass)
    const cz = (point.z * mass) / (mass + truckMass)
    status.mass = mass
    status.inside = pointInPolygon(cx, cz, hull)
    status.margin = polygonMargin(cx, cz, hull)

    const m = status.inside ? cgOk : cgBad
    cgDisc.material = m
    cgBall.material = m
    cgDisc.position.set(cx, GROUND_Y + mm(6), cz)
    cgBall.position.set(cx, point.y, cz)
    const ca = cgLine.geometry.attributes.position
    ca.array.set([cx, GROUND_Y, cz, cx, point.y, cz])
    ca.needsUpdate = true
  }

  update()

  return {
    group,
    status,
    update,
    setVisible(on) {
      group.visible = on
    },
    dispose() {
      group.traverse((o) => o.geometry?.dispose?.())
    },
  }
}

// --- helpers ----------------------------------------------------------------

const _v = new THREE.Vector3()

/** Write the 12 edges of one hull into a flat position array. */
function writeBoxEdges(out, offset, worldMatrix, hull) {
  const m = _m.multiplyMatrices(worldMatrix, hull.local)
  const h = hull.half
  const c = CORNERS
  const p = []
  for (let i = 0; i < 8; i++) {
    _v.set(c[i][0] * h.x, c[i][1] * h.y, c[i][2] * h.z).applyMatrix4(m)
    p.push(_v.x, _v.y, _v.z)
  }
  for (const [a, b] of EDGES) {
    out[offset++] = p[a * 3]
    out[offset++] = p[a * 3 + 1]
    out[offset++] = p[a * 3 + 2]
    out[offset++] = p[b * 3]
    out[offset++] = p[b * 3 + 1]
    out[offset++] = p[b * 3 + 2]
  }
  return offset
}
const _m = new THREE.Matrix4()
const CORNERS = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
]
const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
]

/** A stub through a joint, along the axis it turns or slides on. */
function axisStub(part, lib) {
  const len = part.jointType === 'hinge' ? mm(900) : mm(400)
  const a = part.axis.clone().multiplyScalar(-len / 2)
  const b = part.axis.clone().multiplyScalar(len / 2)
  const g = new THREE.BufferGeometry().setFromPoints([a, b])
  return new THREE.Line(g, lib.axisWire)
}

/**
 * The arc a hinged part's far corner sweeps, drawn in the parent's frame.
 *
 * This is the drawing an engineer makes first and the one a folding design
 * lives or dies by. The reach is taken from the part's own hulls, so it is the
 * real extent of the real part rather than a nominal length.
 */
function sweptArc(part, lib) {
  if (part.jointType !== 'hinge' || Math.abs(part.to - part.from) < 0.05) return null
  let reach = 0
  let probe = new THREE.Vector3()
  for (const h of part.hulls) {
    const c = new THREE.Vector3().setFromMatrixPosition(h.local)
    const far = c.clone().add(new THREE.Vector3(h.half.x, h.half.y, h.half.z))
    // Only the component perpendicular to the hinge axis actually sweeps.
    const perp = far.clone().addScaledVector(part.axis, -far.dot(part.axis))
    if (perp.length() > reach) {
      reach = perp.length()
      probe = far.clone()
    }
  }
  if (reach < mm(80)) return null

  const pts = []
  const q = new THREE.Quaternion()
  const n = 30
  for (let i = 0; i <= n; i++) {
    const ang = part.from + ((part.to - part.from) * i) / n
    q.setFromAxisAngle(part.axis, ang)
    const p = probe.clone()
    if (part.rest) p.applyQuaternion(part.rest)
    p.applyQuaternion(q).add(part.pivot)
    pts.push(p)
  }
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lib.sweepWire)
}

/** Andrew's monotone chain, on the handful of points a support polygon has. */
function convexHull(pts) {
  if (pts.length < 3) return pts.slice()
  const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
  const lower = []
  for (const q of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], q) <= 0) lower.pop()
    lower.push(q)
  }
  const upper = []
  for (let i = p.length - 1; i >= 0; i--) {
    const q = p[i]
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], q) <= 0) upper.pop()
    upper.push(q)
  }
  lower.pop()
  upper.pop()
  return lower.concat(upper)
}

function pointInPolygon(x, z, poly) {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i]
    const [xj, zj] = poly[j]
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside
  }
  return inside
}

/** Distance from the point to the nearest polygon edge, positive inside. */
function polygonMargin(x, z, poly) {
  let best = Infinity
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i]
    const [xj, zj] = poly[j]
    const dx = xj - xi
    const dz = zj - zi
    const l2 = dx * dx + dz * dz
    const t = l2 > 0 ? Math.max(0, Math.min(1, ((x - xi) * dx + (z - zi) * dz) / l2)) : 0
    best = Math.min(best, Math.hypot(x - (xi + t * dx), z - (zi + t * dz)))
  }
  return pointInPolygon(x, z, poly) ? best : -best
}
