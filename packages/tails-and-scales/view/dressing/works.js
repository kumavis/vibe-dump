// The works of the people who live round the battlefield (DESIGN's
// "Battlefield dressing", S4): place.js's worksOf lays them out per theme,
// off the mat; this builds them, every one merged into a single mesh in
// vertex colours (one draw call), casting no shadow. A farmstead (house,
// barn, well, cart, a fenced paddock, hay stooks), a quarry (the cut, a
// crane, a works hut, spoil heaps, dressed blocks), a border keep's outer
// wall (gatehouse, towers, garrison huts and tents, a watch beacon), a
// burned hamlet (cottages burned to their walls, chimneys standing).
import * as THREE from 'three'

const C = new THREE.Color()
// a part: a geometry placed in the work's own frame, in one colour
const box = (w, h, d, x, y, z, colour, ry = 0) => [new THREE.BoxGeometry(w, h, d).rotateY(ry).translate(x, y + h / 2, z), colour]
const cyl = (r0, r1, h, n, x, y, z, colour, open = false) => [new THREE.CylinderGeometry(r0, r1, h, n, 1, open).translate(x, y + h / 2, z), colour]
const cone = (r, h, n, x, y, z, colour) => [new THREE.ConeGeometry(r, h, n, 1, true).translate(x, y + h / 2, z), colour]
// a gable roof along x, `w` long, `d` deep, its ridge `h` above `y`
function roof(w, d, h, x, y, z, colour) {
  const g = new THREE.BufferGeometry()
  const a = [-w / 2, 0, -d / 2], b = [w / 2, 0, -d / 2], c = [w / 2, 0, d / 2], e = [-w / 2, 0, d / 2], r0 = [-w / 2, h, 0], r1 = [w / 2, h, 0]
  const tri = [a, r0, r1, a, r1, b, c, r1, r0, c, r0, e, a, e, r0, b, r1, c]
  g.setAttribute('position', new THREE.Float32BufferAttribute(tri.flat(), 3))
  g.translate(x, y, z)
  return [g, colour]
}
// a cart's wheel, upright, at (x, z)
const wheel = (x, z, burned) => [new THREE.CylinderGeometry(0.45, 0.45, 0.12, 8).rotateX(Math.PI / 2).translate(x, 0.45, z), burned ? CHAR : '#4e3220']
function crenels(len, h, d, colour, step = 1.1) {
  const out = []
  for (let x = -len / 2 + 0.4; x <= len / 2 - 0.3; x += step) out.push(box(0.5, 0.5, d, x, h, 0, colour))
  return out
}

const STONE = '#8a857a', DARK = '#5e5a52', WOOD = '#6e5034', THATCH = '#b8a05a', ROOF = '#7a4a34', CHAR = '#24201c', HAY = '#c8b060'
const BUILD = {
  house: () => [box(5, 2.6, 3.4, 0, 0, 0, '#d8ccb0'), roof(5.4, 3.8, 1.6, 0, 2.6, 0, THATCH), box(0.5, 1.6, 0.5, 1.6, 2.6, 0.6, STONE), box(0.9, 1.5, 0.08, -0.6, 0, 1.72, WOOD)],
  barn: () => [box(7, 3.4, 4.6, 0, 0, 0, '#7a4a30'), roof(7.4, 5, 1.9, 0, 3.4, 0, ROOF), box(1.8, 2.4, 0.08, 0, 0, 2.32, '#4e3220')],
  well: () => [cyl(0.6, 0.65, 0.7, 8, 0, 0, 0, STONE), box(0.12, 1.4, 0.12, -0.5, 0.7, 0, WOOD), box(0.12, 1.4, 0.12, 0.5, 0.7, 0, WOOD), roof(1.4, 1.1, 0.5, 0, 2.1, 0, ROOF)],
  cart: (w) => [box(2.2, 0.5, 1.2, 0, 0.45, 0, w.burned ? CHAR : WOOD), wheel(0.3, 0.66, w.burned), wheel(0.3, -0.66, w.burned), box(1.6, 0.08, 0.08, -1.8, 0.6, 0.3, WOOD), box(1.6, 0.08, 0.08, -1.8, 0.6, -0.3, WOOD)],
  stook: () => [cone(0.55, 1.1, 6, 0, 0, 0, HAY)],
  fence: (w) => {
    const out = [], n = Math.max(2, Math.round(w.len / 1.6))
    for (let i = 0; i <= n; i++) out.push(box(0.12, 0.9, 0.12, -w.len / 2 + (i * w.len) / n, 0, 0, WOOD))
    out.push(box(w.len, 0.08, 0.06, 0, 0.45, 0, '#8a6a44'), box(w.len, 0.08, 0.06, 0, 0.75, 0, '#8a6a44'))
    return out
  },
  cut: () => [box(13, 4, 1.5, 0, 0, -1.5, '#9a9282'), box(9, 2.6, 2.2, 0, 0, 0.3, '#a8a090'), box(5, 1.3, 2, 0, 0, 2.2, '#b2ab9c'), box(1.5, 4, 5, -6.3, 0, 0.5, '#8e877a'), box(1.5, 4, 5, 6.3, 0, 0.5, '#8e877a')],
  crane: () => [box(0.4, 6.4, 0.4, 0, 0, 0, WOOD), box(0.3, 0.3, 5.5, 0, 6, 2.2, WOOD, 0), box(0.05, 3.6, 0.05, 0, 2.6, 4.7, '#3a3028'), box(0.7, 0.5, 0.7, 0, 2.1, 4.7, STONE), box(1.6, 0.3, 1.6, 0, 0, 0, WOOD)],
  hut: (w) => [box(3.4, 2, 2.6, 0, 0, 0, '#8a6a48'), roof(3.8, 3, 1, 0, 2, 0, '#5e4a38')],
  spoil: () => [cone(2.2, 2, 8, 0, 0, 0, '#8e8676')],
  block: () => [box(1.1, 0.75, 0.9, 0, 0, 0, '#b8b0a0')],
  gatehouse: () => [box(2.4, 5.2, 2.6, -2.2, 0, 0, STONE), box(2.4, 5.2, 2.6, 2.2, 0, 0, STONE), box(2.2, 1.6, 2.4, 0, 3.6, 0, STONE), box(1.8, 3.4, 0.1, 0, 0, 1.25, '#3a2a1e'), ...crenels(6.6, 5.2, 2.6, DARK)],
  wall: (w) => [box(w.len, 2.5, 1.3, 0, 0, 0, STONE), ...crenels(w.len, 2.5, 1.3, DARK)],
  tower: () => [cyl(1.7, 1.9, 6, 8, 0, 0, 0, STONE), cone(2.1, 2, 8, 0, 6, 0, ROOF)],
  tent: () => [cone(1.2, 1.6, 4, 0, 0, 0, '#cfc4a4')],
  beacon: () => [box(0.35, 5, 0.35, 0, 0, 0, WOOD), box(1, 0.6, 1, 0, 5, 0, '#3a3028'), box(0.7, 0.4, 0.7, 0, 5.4, 0, '#d0802a'), box(1.4, 0.15, 0.15, 0, 4.2, 0, WOOD)],
  shell: () => [box(4.6, 2.2, 0.35, 0, 0, -1.5, '#6a645c'), box(4.6, 1.4, 0.35, 0, 0, 1.5, '#6a645c'), box(0.35, 2.0, 3.3, -2.15, 0, 0, '#6a645c'), box(0.35, 1.1, 3.3, 2.15, 0, 0, '#6a645c'), box(4.4, 0.25, 0.4, 0, 2.2, -1.5, CHAR), box(1.2, 0.3, 1, 0.6, 0, 0.2, CHAR), box(0.2, 0.2, 2.6, -0.8, 0.3, 0, CHAR, 0.6)],
  chimney: () => [box(0.7, 4.6, 0.7, 0, 0, 0, '#6e6860'), box(0.8, 0.3, 0.8, 0, 4.6, 0, CHAR)],
}

// the works, merged: one geometry in vertex colours (null if none)
export function worksGeometry(works) {
  const pos = [], col = []
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), s3 = new THREE.Vector3()
  for (const w of works) {
    m.compose(v.set(w.x, w.y ?? 0, w.z), q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), w.yaw), s3.setScalar(w.s ?? 1))
    for (const [g0, colour] of BUILD[w.kind](w)) {
      const g = g0.index ? g0.toNonIndexed() : g0
      g.applyMatrix4(m)
      C.set(colour)
      const a = g.attributes.position
      for (let i = 0; i < a.count; i++) {
        pos.push(a.getX(i), a.getY(i), a.getZ(i))
        // a little darker low down: the ground's shade
        const k = 0.8 + 0.2 * Math.min(1, (a.getY(i) - (w.y ?? 0)) / 2.5)
        col.push(C.r * k, C.g * k, C.b * k)
      }
    }
  }
  if (!pos.length) return null
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
  g.computeVertexNormals()
  return g
}
