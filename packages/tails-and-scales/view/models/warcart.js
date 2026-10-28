// (F9a, DESIGN §4.2.5) The Acorn War-Cart, the Bushtail Clans' transport: one
// machine of meshes (./kit.js), shared by both figure styles (V2, view/models/
// cache.js's STYLES): the classic kit (./classic/squirrel.js) and the
// splat-fur one (./squirrel.js) each build it here, and differ only in its
// two crew, whom `crewman` makes (the classic squirrel body, or a splat-fur
// squirrel, as each style's trebuchet is crewed).
//
// One big figure on its 1.5" base, its front +z. A giant acorn cup (a lathe,
// its scaly cupules in rows round it, a rolled rim) holding an open plank
// deck, on four spiked wheels; a bolt thrower on the front rim; a leaf
// pennant on a stalk at the back; and two crew behind, leaning on the push
// bar. Nothing drawn at random, so the template cache clones it. The wheels
// are kept apart from the bake and turn as it rolls (the view's 'machine'
// kind); its anim's `deck` is the height its riders stand at, in the
// figure's own frame (view/units.js parents their figures there, at
// present/deck.js's slots, so they ride with it). The riders are their own
// units' figures, in the page's style: the cart draws none of them itself.
//
//   warCart(crewman)   the miniature; crewman(s) returns one crewman (s -1
//                      the left, 1 the right), posed with both paws forward
//                      on the push bar, standing on y 0 and facing +z in its
//                      own frame: warCart scales, places and leans it
import * as THREE from 'three'
import { M, metal, G, part, rod, shade, wood, wheel } from './kit.js'

export function warCart(crewman) {
  const root = new THREE.Group()
  const body = new THREE.Group()
  root.add(body)
  const CUP = '#86552c', DARK = '#5a3820', RIM = '#4e301a', PLANK = '#c49a62'
  // the cup: a bowl swelling from its foot to the rim, open at the top
  const prof = [[0.34, 0.3], [0.72, 0.33], [1.0, 0.44], [1.17, 0.6], [1.25, 0.78], [1.26, 0.92]]
  const cup = new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), 20)
  body.add(part(cup, M(CUP, { side: THREE.DoubleSide })))
  body.add(part(G.cyl, M(DARK), 0, 0.31, 0, 0.36, 0.04, 0.36))
  // the cupules: rows of overlapping scales round the outside, tips down
  const rows = [[0.62, 0.34, 0.12], [0.86, 0.4, 0.13], [1.06, 0.5, 0.14], [1.19, 0.64, 0.14], [1.25, 0.79, 0.13]]
  rows.forEach(([r, y, s], k) => {
    const n = Math.round((2 * Math.PI * r) / (s * 1.55))
    for (let i = 0; i < n; i++) {
      const a = ((i + (k % 2) * 0.5) / n) * Math.PI * 2
      const sc = part(G.ico0, M(i % 3 === 0 ? shade(CUP, -0.08) : i % 3 === 1 ? shade(CUP, 0.05) : DARK), Math.sin(a) * (r + 0.015), y, Math.cos(a) * (r + 0.015), s * 0.62, s * 0.5, s * 0.22)
      sc.rotation.set(-0.5, a, 0)
      body.add(sc)
    }
  })
  // the rolled rim, and the deck inside it: planks across a disc
  body.add(part(new THREE.TorusGeometry(1.24, 0.075, 5, 28).rotateX(Math.PI / 2), M(RIM), 0, 0.93, 0))
  body.add(part(G.cyl, M(shade(PLANK, -0.25)), 0, 0.55, 0, 1.16, 0.06, 1.16))
  for (let i = -4; i <= 4; i++) {
    const x = i * 0.25, half = Math.sqrt(Math.max(0, 1.12 * 1.12 - x * x))
    body.add(part(G.box, M(i % 2 ? PLANK : shade(PLANK, -0.08)), x, 0.59, 0, 0.22, 0.03, half * 2))
  }
  // four spiked wheels under the cup's swell, their axles across it
  const wheels = []
  for (const z of [-0.62, 0.62]) {
    body.add(rod([-1.1, 0.4, z], [1.1, 0.4, z], 0.045, metal('#4a4a4a')))
    for (const s of [-1, 1]) {
      const w = wheel(0.4, s * 1.12, 0.4, z)
      // the iron tyre and its spikes, standing out from the rim
      const tyre = part(new THREE.TorusGeometry(0.4, 0.035, 4, 16).rotateY(Math.PI / 2), metal('#6a6e74'))
      w.add(tyre)
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2, d = new THREE.Vector3(0, Math.sin(a), Math.cos(a))
        const sp = part(G.cone, metal('#b8bec6'), 0, d.y * 0.49, d.z * 0.49, 0.045, 0.16, 0.045)
        sp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d)
        w.add(sp)
      }
      // spokes
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI
        w.add(rod([0, Math.sin(a) * 0.36, Math.cos(a) * 0.36], [0, -Math.sin(a) * 0.36, -Math.cos(a) * 0.36], 0.03, M('#3e2614')))
      }
      body.add(w)
      wheels.push(w)
    }
  }
  // the bolt thrower on the front rim: a stock, a bow, its string, a bolt
  const bt = new THREE.Group()
  bt.position.set(0, 1.0, 1.02)
  bt.add(part(G.box, wood(), 0, 0, 0, 0.12, 0.1, 0.9))
  bt.add(part(G.box, M(DARK), 0, -0.12, -0.18, 0.18, 0.16, 0.18))
  for (const s of [-1, 1]) {
    bt.add(rod([0, 0.02, 0.32], [s * 0.42, 0.04, 0.12], 0.035, M('#6b4a2a')))
    bt.add(rod([s * 0.42, 0.04, 0.12], [0, 0.04, -0.2], 0.008, M('#efe6d0')))
  }
  bt.add(rod([0, 0.08, -0.25], [0, 0.08, 0.5], 0.022, wood()))
  bt.add(part(G.cone, metal('#c9cdd2'), 0, 0.08, 0.56, 0.04, 0.14, 0.04).rotateX(Math.PI / 2))
  for (const s of [-1, 1]) bt.add(part(G.cone, M('#5f8f2e'), s * 0.03, 0.08, -0.25, 0.02, 0.12, 0.05).rotateX(-Math.PI / 2))
  body.add(bt)
  // the stalk at the back, flying a leaf pennant
  body.add(rod([0, 0.9, -1.16], [0, 2.05, -1.22], 0.04, M('#5a3d24')))
  const flag = new THREE.BufferGeometry()
  flag.setAttribute('position', new THREE.Float32BufferAttribute([0, 2.02, -1.22, 0, 1.72, -1.22, 0.02, 1.86, -1.78, 0, 2.02, -1.22, 0.02, 1.86, -1.78, 0, 1.72, -1.22], 3))
  flag.computeVertexNormals()
  const leaf = new THREE.Mesh(flag, M('#6aa646', { side: THREE.DoubleSide }))
  leaf.castShadow = true
  body.add(leaf)
  // the push bar behind, and two crew leaning on it
  body.add(rod([-0.62, 0.62, -1.34], [0.62, 0.62, -1.34], 0.04, wood()))
  for (const s of [-1, 1]) body.add(rod([s * 0.5, 0.62, -1.34], [s * 0.6, 0.72, -1.05], 0.035, wood()))
  for (const s of [-1, 1]) {
    const crew = crewman(s)
    crew.scale.setScalar(0.72)
    crew.position.set(s * 0.42, 0.02, -1.62)
    crew.rotation.x = 0.32
    body.add(crew)
  }
  for (const w of wheels) w.userData.keep = true
  root.userData.anim = { kind: 'machine', body, wheels, deck: 0.62 }
  return root
}
