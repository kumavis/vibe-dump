// The miniatures' kit (DESIGN §1.1: models.js's parts, R7): every model is
// assembled from these primitives in a chunky, faceted "painted plastic"
// style and stands on a round base with a rim in its army's colour. Models
// face +z; the origin is the centre of the base on the table. The races'
// classic figures are view/models/classic/squirrel.js and serpent.js ((V2)
// the 'new' style's glossy Ssithra, view/models/gloss/, take part, rod, hold
// and shade from here, the splat-fur Bushtails' kit, view/models/
// squirrel.js, its meshes, and every figure stands on its base()), baked by
// bake.js and made (once per unit, then cloned) by cache.js.
import * as THREE from 'three'

// one material per colour and finish, shared by every figure (and the
// objectives' stones and poles): material ids decide the draw order
const mats = new Map()
export function M(color, opts = {}) {
  const key = color + JSON.stringify(opts)
  if (!mats.has(key)) mats.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.72, flatShading: true, ...opts }))
  return mats.get(key)
}
export const glowMat = (color) => M(color, { emissive: color, emissiveIntensity: 1.6, roughness: 0.3 })
export const metal = (color) => M(color, { metalness: 0.65, roughness: 0.35 })

// the shared primitives (unit sized: a part scales its own)
export const G = {
  ico: new THREE.IcosahedronGeometry(1, 1),
  ico0: new THREE.IcosahedronGeometry(1, 0),
  sph: new THREE.SphereGeometry(1, 10, 8),
  box: new THREE.BoxGeometry(1, 1, 1),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 10),
  cone: new THREE.ConeGeometry(1, 1, 8),
  cap: new THREE.SphereGeometry(1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2),
  // closes a `cap` from underneath: same 12 rim vertices, facing down
  brim: new THREE.CircleGeometry(1, 12).rotateX(Math.PI / 2),
  oct: new THREE.OctahedronGeometry(1, 0),
}

export function part(geo, mat, x = 0, y = 0, z = 0, sx = 1, sy = sx, sz = sx) {
  const m = new THREE.Mesh(geo, mat)
  m.position.set(x, y, z)
  m.scale.set(sx, sy, sz)
  m.castShadow = true
  return m
}
// A cylinder from point a to point b.
export function rod(a, b, r, mat) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b)
  const m = part(G.cyl, mat)
  m.position.copy(A).add(B).multiplyScalar(0.5)
  m.scale.set(r, A.distanceTo(B), r)
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize())
  return m
}

// A model's round base: dark, flocked, with a rim in its seat's colour
// ((F6) `rim` times as broad: a mirror match's east army, view/units.js).
// Its tufts of static grass fall at random (Math.random: every figure its
// own), so a base is made for each figure (view/models/cache.js).
export function base(r, sideColor, rim = 1) {
  const g = new THREE.Group()
  const b = part(new THREE.CylinderGeometry(r, r * 1.05, 0.09, 28), M('#262422'), 0, 0.045, 0)
  b.receiveShadow = true
  const top = part(new THREE.CylinderGeometry(r * 0.96, r * 0.96, 0.012, 28), M('#4c5e2c', { flatShading: false }), 0, 0.094, 0)
  top.receiveShadow = true
  const ring = part(new THREE.TorusGeometry(r * 1.02, 0.028 * rim, 4, 32).rotateX(Math.PI / 2), M(sideColor, { emissive: sideColor, emissiveIntensity: 0.35 }), 0, 0.07, 0)
  g.add(b, top, ring)
  // flock: a few tufts of static grass
  for (let i = 0; i < Math.round(r * 9); i++) {
    const a = Math.random() * 6, d = Math.sqrt(Math.random()) * r * 0.85
    g.add(part(G.cone, M('#6a8a3a'), Math.cos(a) * d, 0.13, Math.sin(a) * d, 0.035, 0.08, 0.035))
  }
  return g
}

// Tapered tube along a curve: the serpent bodies.
export function taperTube(points, r0, r1, mat, radial = 8, segs = 40) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)))
  const frames = curve.computeFrenetFrames(segs, false)
  const pos = [], idx = []
  for (let i = 0; i <= segs; i++) {
    const t = i / segs
    const P = curve.getPointAt(t)
    const r = r0 + (r1 - r0) * Math.pow(t, 0.6)
    const N = frames.normals[i], Bn = frames.binormals[i]
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2
      const cx = Math.cos(a), sx = Math.sin(a)
      pos.push(P.x + r * (cx * N.x + sx * Bn.x), P.y + r * (cx * N.y + sx * Bn.y), P.z + r * (cx * N.z + sx * Bn.z))
    }
  }
  // Each ring winds counter-clockwise about the tangent (three's Frenet
  // binormal is T×N), so this order puts the front faces on the outside.
  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j, b = a + radial + 1
      idx.push(a, a + 1, b, b, a + 1, b + 1)
    }
  }
  // close the tail tip with a little fan facing back along the curve
  const tip = curve.getPointAt(0)
  const c = pos.length / 3
  pos.push(tip.x, tip.y, tip.z)
  for (let j = 0; j < radial; j++) idx.push(c, j + 1, j)
  // and the head end, which only mostly disappears into the torso
  const end = curve.getPointAt(1)
  const h = pos.length / 3
  pos.push(end.x, end.y, end.z)
  const last = segs * (radial + 1)
  for (let j = 0; j < radial; j++) idx.push(h, last + j, last + j + 1)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  const m = new THREE.Mesh(geo, mat)
  m.castShadow = true
  return m
}

// ── Kit: wood, weapons, shields, wheels ─────────────────────────────────────
export const wood = () => M('#7a5232')
export function spear(len = 1.1, tip = '#c9a24a') {
  const g = new THREE.Group()
  g.add(part(G.cyl, wood(), 0, 0, 0, 0.022, len, 0.022))
  g.add(part(G.cone, metal(tip), 0, len / 2 + 0.07, 0, 0.04, 0.14, 0.04))
  return g
}
export function roundShield(r, color, boss) {
  const g = new THREE.Group()
  const s = part(G.cyl, color, 0, 0, 0, r, 0.04, r)
  s.rotation.x = Math.PI / 2
  g.add(s)
  g.add(part(G.sph, boss, 0, 0, 0.03, r * 0.25, r * 0.25, r * 0.15))
  return g
}
export const shade = (hex, k) => {
  const c = new THREE.Color(hex)
  const hsl = {}
  c.getHSL(hsl)
  c.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l + k)))
  return '#' + c.getHexString()
}
export function hold(arm, obj, rx = 0.9) {
  arm.userData.hand.add(obj)
  obj.rotation.x = rx
}

export function wheel(r, x, y, z) {
  const w = new THREE.Group()
  const rim = part(G.cyl, M('#5a3a22'), 0, 0, 0, r, 0.1, r)
  rim.rotation.z = Math.PI / 2
  const hub = part(G.cyl, metal('#444'), 0, 0, 0, r * 0.3, 0.13, r * 0.3)
  hub.rotation.z = Math.PI / 2
  w.add(rim, hub)
  w.position.set(x, y, z)
  return w
}
