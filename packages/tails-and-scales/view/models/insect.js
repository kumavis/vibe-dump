// (F5a, DESIGN §4.2.12's "View, input, UI": decision Q16) The Deepdelve
// Hive's miniatures, in both figure styles (view/models/cache.js's STYLES):
// one builder a unit, made of kit.js's parts as the War-Cart's and the
// Howdah's machines are (./warcart.js, ./howdah.js), and painted through a
// style: the classic one's faceted painted plastic (kit.js's M), the 'new'
// one's lacquered chitin (./gloss/gloss.js's physical finishes, on smoother
// shapes). The race's look.models names this kit ('insect').
//
// The body every one of them is built on is bug(): an upright ant-folk on
// four legs (each a femur and a tibia), its banded abdomen slung behind a
// narrow waist, an upright thorax with a breast plate, a head with gold
// compound eyes, two antennae and a pair of mandibles, and two arms to hold
// a weapon (kit.js's hold). Its anim (view/units.js's 'insect' kind,
// view/diorama.js's idle): { kind, body, head, antL, antR, armL, armR, legs }.
// ((F5a's sweep) render-bench's classic row: a figure drew in up to 15 main
// calls, the Hive against the Aerie 1,032, 1.72× the 600, so each kept part
// is a set) The legs are the scuttle's two sets, `legs` [even, odd], each a
// front leg and the back one across from it in one group at the hips' mid
// point (so a set's hips see-saw 0.024" as it swings); the antennae are one
// group, antL (antR null: they twitch together). Both are kept out of the
// bake (userData.keep) to move on their own; the rest bakes whole. (The
// Boilback, one figure, keeps its six legs and two antennae each its own.)
//
// Each figure's top sits near its type's eye + 0.1 (DESIGN's heights row,
// sim/bake-check.mjs): about 1.0" a walker (a Delver 0.75: the smallest
// that stays within 0.4" of it), the Hivemother 1.25" under her crown, the
// Boilback 1.8" at its nozzle's mouth. The burrowers (the Deepguard, the
// Delvers) stand among clods of turned earth, the mark of the burrow.
//
// Nothing here makes a three.js object as the module loads (each part is
// made inside a builder, the 'new' style's smoother shapes at its first
// build): three draws Math.random for every object's uuid, and the title's
// table is painted from Math.random as the page loads (sim/bake-check.mjs
// §5, sim/title-shot.mjs). No builder draws Math.random itself, so the
// template cache clones each (DRAWS is empty).
//
//   BUILDERS[unit]()          the 'new' style's miniature of the unit
//   CLASSIC_BUILDERS[unit]()  the classic style's
//   DRAWS                     the builders that draw Math.random: none
//   bug(style, opts)          the body (opts: colours and shape, below)
import * as THREE from 'three'
import { M, glowMat, metal, G, part, rod, hold, taperTube } from './kit.js'
import { gloss, polished, glow } from './gloss/gloss.js'

// ── The styles: shapes and finishes ────────────────────────────────────────
// A style is { G, paint(kind, hex) }: the shared shapes its parts are cut
// from, and the material of each kind of part: 'chitin' (the shell),
// 'plate' (its accent plates), 'joint' (the dark joints, legs and
// feelers), 'eye', 'horn' (bone, claws and blades), 'metal' (gold),
// 'glow' (a resin gem, a hot glob), 'wood', 'earth' (the clods).
const CLASSIC = {
  G: () => G,
  paint: (kind, hex) => (kind === 'metal' ? metal(hex) : kind === 'glow' ? glowMat(hex) : M(hex)),
}
// (the 'new' style's shapes: kit.js's, but rounder where a gloss shows the
// facets; made at the first build, never as the module loads)
let SMOOTH = null
const smooth = () => (SMOOTH ??= {
  ...G,
  ico: new THREE.IcosahedronGeometry(1, 2),
  sph: new THREE.SphereGeometry(1, 12, 9),
  cap: new THREE.SphereGeometry(1, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
  brim: new THREE.CircleGeometry(1, 16).rotateX(Math.PI / 2),
  cone: new THREE.ConeGeometry(1, 1, 10),
})
const NEW = {
  G: smooth,
  paint(kind, hex) {
    switch (kind) {
      // (two finishes, each part's colour its own: the lacquered shell, its
      // plates and gold eyes told apart by colour; and the satin of the
      // joints, horn and claws, the wood and the turned earth. A finish is
      // a class the bake draws in one call ((F5a's sweep) five finishes and
      // matte wood and earth drew a figure in six to eight calls for its
      // body alone: render-bench's classic row))
      case 'chitin': case 'plate': case 'eye': return gloss(hex, SHELL)
      case 'joint': case 'horn': case 'wood': case 'earth': return gloss(hex, SATIN)
      case 'metal': return polished(hex)
      case 'glow': return glow(hex)
      default: return M(hex)
    }
  },
}
const SHELL = { roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08 }
const SATIN = { roughness: 0.5, clearcoat: 0.45, clearcoatRoughness: 0.22 }

// ── The palette ───────────────────────────────────────────────────────────
// Plum-dark chitin with heather-carmine plates and gold eyes: apart from
// the Bushtails' orange fur and the Coil's green scales at the table's
// distance, and of a piece with the Hive's team colour (data/races/
// insect.js's look) without being it (the base's rim carries the seat's).
const CHITIN = '#5c2438', PLATE = '#c2427e', JOINT = '#2a121c', EYE = '#f0b030', GOLD = '#e6c84a', BONE = '#dccca4', EARTH = '#5e4430'

// ── The Hive's body ───────────────────────────────────────────────────────
// opts: chitin, plate, joint, eye (colours); slim (the body's breadth),
// round (a round head, not a faceted one), antLen (the antennae's length),
// hind (the back legs a hopper's, folded high), spines (how many spines
// bristle along the abdomen's back)
export function bug(S, { chitin = CHITIN, plate = PLATE, joint = JOINT, eye = EYE, slim = 1, round = false, antLen = 1, hind = false, spines = 0 } = {}) {
  const g = S.G(), P = S.paint
  const C = P('chitin', chitin), A = P('plate', plate), J = P('joint', joint), E = P('eye', eye)
  const root = new THREE.Group()
  const body = new THREE.Group()
  root.add(body)
  // the abdomen slung behind, tilted down, two plates banding it
  const abd = new THREE.Group()
  abd.position.set(0, 0.34, -0.17)
  abd.rotation.x = -0.45
  body.add(abd)
  abd.add(part(g.ico, C, 0, 0, -0.07, 0.14 * slim, 0.12, 0.19))
  for (const z of [-0.02, -0.12]) abd.add(part(g.sph, A, 0, 0.008, z, 0.146 * slim * (z < -0.1 ? 0.92 : 1), 0.118, 0.028))
  for (let i = 0; i < spines; i++) {
    const k = i / Math.max(1, spines - 1)
    const sp = part(g.cone, P('horn', BONE), (i % 2 ? 1 : -1) * 0.035, 0.1 - k * 0.02, 0.02 - k * 0.22, 0.013, 0.15 - k * 0.04, 0.013)
    sp.rotation.set(-0.45 - k * 0.5, 0, (i % 2 ? -1 : 1) * 0.3)
    abd.add(sp)
  }
  // the waist, the upright thorax and its breast plate
  body.add(part(g.sph, J, 0, 0.36, -0.05, 0.045))
  const th = part(g.sph, C, 0, 0.52, 0, 0.095 * slim, 0.15, 0.085)
  th.rotation.x = 0.1
  body.add(th)
  body.add(part(g.ico, A, 0, 0.56, 0.06, 0.07 * slim, 0.085, 0.035))
  // the head: compound eyes, mandibles
  const head = new THREE.Group()
  head.position.set(0, 0.76, 0.05)
  body.add(head)
  head.add(part(round ? g.sph : g.ico0, C, 0, 0, 0, 0.095, 0.085, 0.09))
  for (const s of [-1, 1]) {
    head.add(part(g.sph, E, s * 0.06, 0.015, 0.055, 0.032, 0.038, 0.028))
    const md = part(g.cone, J, s * 0.032, -0.055, 0.085, 0.016, 0.075, 0.016)
    md.rotation.set(Math.PI * 0.62, 0, -s * 0.5)
    head.add(md)
  }
  // the antennae, one group (they twitch together)
  const ants = new THREE.Group()
  ants.position.set(0, 0.065, 0.04)
  for (const s of [-1, 1]) {
    const ant = new THREE.Group()
    ant.position.set(s * 0.035, 0, 0)
    const L = 0.11 * antLen
    ant.add(rod([0, 0, 0], [s * 0.04, L, 0.02], 0.007, J))
    ant.add(rod([s * 0.04, L, 0.02], [s * 0.07, L * 1.15, L * 0.75], 0.006, J))
    ants.add(ant)
  }
  ants.userData.keep = true
  head.add(ants)
  // four legs (they scuttle): front left, front right, back right, back
  // left, so even and odd are the diagonal pairs that step together, each
  // pair one set, a group at the mid point of its two hips; a hopper's back
  // legs folded high behind (its femurs in the chitin's colour, the
  // joints' satin, so a set bakes as one class)
  const legs = [new THREE.Group(), new THREE.Group()]
  const HIP = [0, 0.36, -0.04]
  for (const [k, [s, z]] of [[-1, 0.03], [1, 0.03], [1, -0.11], [-1, -0.11]].entries()) {
    const leg = new THREE.Group()
    leg.position.set(s * 0.07, 0.36 - HIP[1], z - HIP[2])
    const back = z < 0, hi = hind && back
    const knee = hi ? [s * 0.1, 0.3, -0.17] : [s * 0.13, 0.07, back ? -0.03 : 0.04]
    const foot = hi ? [s * 0.11, -0.33, -0.07] : [s * 0.18, -0.32, back ? -0.08 : 0.09]
    leg.add(rod([0, 0, 0], knee, hi ? 0.026 : 0.02, hi ? P('joint', chitin) : J))
    leg.add(rod(knee, foot, 0.015, J))
    leg.add(part(g.sph, J, ...knee, hi ? 0.028 : 0.022))
    leg.add(part(g.sph, J, ...foot, 0.022))
    legs[k % 2].add(leg)
  }
  for (const set of legs) {
    set.position.set(...HIP)
    set.userData.keep = true
    body.add(set)
  }
  // two arms from the shoulders (the pivot), the hand at the end
  const arms = []
  for (const s of [-1, 1]) {
    const arm = new THREE.Group()
    arm.position.set(s * 0.095, 0.6, 0.03)
    arm.add(rod([0, 0, 0], [s * 0.02, -0.11, 0], 0.017, J))
    arm.add(rod([s * 0.02, -0.11, 0], [0, -0.2, 0], 0.014, C))
    const hand = new THREE.Group()
    hand.position.set(0, -0.21, 0)
    hand.add(part(g.sph, J, 0, 0, 0, 0.025))
    arm.add(hand)
    arm.userData.hand = hand
    arm.rotation.x = -0.9
    body.add(arm)
    arms.push(arm)
  }
  root.userData.anim = { kind: 'insect', body, head, antL: ants, antR: null, armL: arms[0], armR: arms[1], legs }
  return root
}

// clods of turned earth round the feet: the burrowers' mark
function clods(S, fig, spots) {
  const g = S.G(), E = S.paint('earth', EARTH), D = S.paint('earth', '#4a3424')
  spots.forEach(([x, z, r], i) => fig.add(part(g.cap, i % 2 ? D : E, x, 0.03, z, r, r * 0.55, r)))
}

// a staff, its gem at the top (the Hivemother's resin)
function staff(S, len, gemHex) {
  const g = S.G(), P = S.paint
  const st = new THREE.Group()
  st.add(part(g.cyl, P('wood', '#4a2a1c'), 0, len / 2 - 0.2, 0, 0.022, len, 0.022))
  const gem = part(g.oct, P('glow', gemHex), 0, len - 0.12, 0, 0.05, 0.08, 0.05)
  st.add(gem)
  for (let i = 0; i < 3; i++) {
    const t = (i / 3) * Math.PI * 2
    st.add(rod([0, len - 0.24, 0], [Math.cos(t) * 0.06, len - 0.1, Math.sin(t) * 0.06], 0.01, P('joint', JOINT)))
  }
  return { st, gem }
}

// ── The six unit types ────────────────────────────────────────────────────
function units(S) {
  const g = () => S.G(), P = S.paint
  return {
    // Hivemother Kesh: the body ×1.3, a swollen abdomen trailing, a crown of
    // five gold cones, a staff with a resin gem (a.gem: the units' animator
    // spins it, kept out of the bake)
    hivemother() {
      const m = bug(S, { chitin: '#6a2440', plate: '#d0488c', slim: 1.1 })
      const a = m.userData.anim, C = P('chitin', '#6a2440'), A = P('plate', '#d0488c')
      m.scale.setScalar(1.3)
      const sw = part(g().ico, C, 0, 0.27, -0.33, 0.17, 0.15, 0.22)
      sw.rotation.x = -0.2
      a.body.add(sw)
      for (const z of [-0.26, -0.38]) a.body.add(part(g().sph, A, 0, 0.27 + (z + 0.33) * 0.2, z, 0.175, 0.15, 0.03))
      for (let i = 0; i < 5; i++) {
        const t = (i - 2) * 0.5
        const c = part(g().cone, P('metal', GOLD), Math.sin(t) * 0.075, 0.1, Math.cos(t) * 0.06 - 0.01, 0.02, 0.08 + (i === 2 ? 0.03 : 0), 0.02)
        c.rotation.set(Math.cos(t) * 0.25, 0, -Math.sin(t) * 0.35)
        a.head.add(c)
      }
      a.head.add(part(g().cyl, P('metal', GOLD), 0, 0.06, 0, 0.085, 0.025, 0.08))
      const { st, gem } = staff(S, 0.62, '#ffb030')
      hold(a.armL, st, 0.9)
      a.armL.rotation.x = -0.6
      a.armR.rotation.set(-0.5, 0, -0.35)
      a.gem = gem
      gem.userData.keep = true
      return m
    },
    // Deepguard: broad and low, plated, scythe forelegs held forward, heavy
    // mandibles; clods of earth at its feet
    deepguard() {
      const m = bug(S, { chitin: '#4a1c2c', plate: '#9a3466', slim: 1.3, antLen: 0.8 })
      const a = m.userData.anim, A = P('plate', '#9a3466'), H = P('horn', BONE), J = P('joint', JOINT)
      m.scale.set(1.12, 0.95, 1.12)
      for (const [y, w] of [[0.62, 0.17], [0.52, 0.19], [0.42, 0.15]]) a.body.add(part(g().box, A, 0, y, 0.07, w, 0.075, 0.05))
      for (const s of [-1, 1]) a.body.add(part(g().cap, A, s * 0.11, 0.64, 0.01, 0.065, 0.045, 0.065))
      // the scythes: bone blades curving forward and down from the shoulders
      for (const s of [-1, 1]) {
        a.body.add(taperTube([[s * 0.1, 0.62, 0.03], [s * 0.17, 0.74, 0.15], [s * 0.16, 0.7, 0.3], [s * 0.12, 0.54, 0.4]], 0.03, 0.004, H, 6, 16))
        const md = part(g().cone, J, s * 0.04, -0.06, 0.1, 0.025, 0.11, 0.025)
        md.rotation.set(Math.PI * 0.6, 0, -s * 0.55)
        a.head.add(md)
      }
      a.armL.rotation.x = a.armR.rotation.x = -0.4
      clods(S, m, [[0.2, 0.17, 0.075], [-0.22, -0.03, 0.065], [0.06, -0.24, 0.055], [-0.12, 0.2, 0.05]])
      return m
    },
    // Spinethrower Brood: slender, a bristle of spines along its abdomen, a
    // spine-sling in its arms with a spine nocked
    spinethrower() {
      const m = bug(S, { slim: 0.85, spines: 6 })
      const a = m.userData.anim, J = P('joint', JOINT), H = P('horn', BONE)
      const sl = new THREE.Group()
      sl.add(rod([0, -0.1, 0], [0, 0.05, 0], 0.014, P('wood', '#5a3420')))
      for (const s of [-1, 1]) sl.add(rod([0, 0.05, 0], [s * 0.06, 0.15, 0], 0.011, P('wood', '#5a3420')))
      sl.add(rod([-0.06, 0.15, 0], [0, 0.11, -0.05], 0.004, J))
      sl.add(rod([0.06, 0.15, 0], [0, 0.11, -0.05], 0.004, J))
      const sp = part(g().cone, H, 0, 0.12, 0.05, 0.012, 0.2, 0.012)
      sp.rotation.x = Math.PI / 2
      sl.add(sp)
      hold(a.armR, sl, 1.3)
      a.armR.rotation.x = -1.2
      a.armL.rotation.set(-1.1, 0, 0.3)
      return m
    },
    // Delver Swarm: small, round-headed, dusty, a flattened pair of digging
    // claws; clods at their feet
    delver() {
      const m = bug(S, { chitin: '#7a5440', plate: '#a8805a', joint: '#3a2820', eye: '#e0a040', round: true, slim: 1.05, antLen: 0.7 })
      const a = m.userData.anim, H = P('horn', '#c8b088')
      m.scale.setScalar(0.74)
      for (const [arm, s] of [[a.armL, -1], [a.armR, 1]]) {
        const claw = part(g().oct, H, s * 0.01, -0.03, 0.03, 0.07, 0.025, 0.085)
        claw.rotation.z = s * 0.3
        arm.userData.hand.add(claw)
        arm.rotation.set(-1.25, 0, s * 0.2)
      }
      clods(S, m, [[0.2, 0.12, 0.08], [-0.18, -0.12, 0.07], [0.02, 0.24, 0.06]])
      return m
    },
    // Hopper Lancers: grasshopper-folk, long hind legs folded high, long
    // antennae, a lance couched forward
    hopper() {
      const m = bug(S, { chitin: '#4e3a4a', plate: '#b8608a', slim: 0.9, antLen: 1.8, hind: true })
      const a = m.userData.anim
      const lance = new THREE.Group()
      lance.add(part(g().cyl, P('wood', '#6a4a2a'), 0, 0, 0, 0.02, 1.0, 0.02))
      lance.add(part(g().cone, P('horn', BONE), 0, 0.57, 0, 0.035, 0.16, 0.035))
      lance.add(part(g().cone, P('plate', '#b8608a'), 0, 0.42, 0, 0.03, 0.08, 0.008))
      // (couched: tilted well forward of the upright)
      hold(a.armR, lance, 2.1)
      a.armR.rotation.x = -1.15
      a.armL.rotation.x = -1.0
      return m
    },
    // Boilback Bombardier: a beetle on six legs under a domed, spotted
    // carapace, its head and mandibles forward, and on a pivot over its
    // back the rear nozzle that throws the glob: its throwArm (and rest),
    // which view/effects/shots.js's artilleryFire swings as a trebuchet's
    boilback() {
      const root = new THREE.Group()
      const body = new THREE.Group()
      root.add(body)
      const C = P('chitin', '#4a1c2c'), A = P('plate', '#a8306e'), J = P('joint', JOINT), E = P('eye', EYE), Au = P('plate', GOLD)
      body.add(part(g().ico, J, 0, 0.42, 0, 0.6, 0.28, 0.82))
      // (the dome the Hive's dark chitin, a carmine rim round its foot)
      body.add(part(g().cap, P('chitin', '#5a1e34'), 0, 0.5, -0.05, 0.75, 0.85, 0.95))
      body.add(part(g().brim, J, 0, 0.5, -0.05, 0.75, 1, 0.95))
      body.add(part(new THREE.TorusGeometry(1, 0.05, 5, 24).rotateX(Math.PI / 2), A, 0, 0.53, -0.05, 0.75, 1, 0.95))
      // the elytra's seam down the dome, and the gold spots on it
      const seam = []
      for (let i = 0; i <= 8; i++) {
        const f = -1 + i / 4, c = Math.sqrt(Math.max(0, 1 - f * f))
        seam.push([0, 0.5 + 0.86 * c, -0.05 + 0.96 * f])
      }
      body.add(taperTube(seam, 0.022, 0.022, J, 6, 24))
      for (const [th, ph] of [[0.5, 0.8], [-0.5, 0.8], [1.1, 0.45], [-1.1, 0.45], [2.3, 0.7], [-2.3, 0.7]]) {
        const x = 0.75 * Math.sin(ph) * Math.sin(th), y = 0.5 + 0.85 * Math.cos(ph), z = -0.05 + 0.95 * Math.sin(ph) * Math.cos(th)
        // (flattened on the dome: a spot, not a bead)
        const sp = part(g().sph, Au, x, y, z, 0.09)
        sp.lookAt(0, 0.5, -0.05)
        sp.scale.set(0.09, 0.09, 0.035)
        body.add(sp)
      }
      // the head, its eyes, mandibles and short antennae
      const head = new THREE.Group()
      head.position.set(0, 0.55, 0.92)
      body.add(head)
      head.add(part(g().ico0, C, 0, 0, 0, 0.26, 0.22, 0.24))
      const ants = []
      for (const s of [-1, 1]) {
        head.add(part(g().sph, E, s * 0.17, 0.06, 0.13, 0.07, 0.08, 0.06))
        const md = part(g().cone, J, s * 0.09, -0.1, 0.24, 0.045, 0.22, 0.045)
        md.rotation.set(Math.PI * 0.55, 0, -s * 0.6)
        head.add(md)
        const ant = new THREE.Group()
        ant.position.set(s * 0.1, 0.16, 0.12)
        ant.add(rod([0, 0, 0], [s * 0.12, 0.22, 0.12], 0.016, J))
        ant.add(rod([s * 0.12, 0.22, 0.12], [s * 0.2, 0.26, 0.32], 0.013, J))
        ant.userData.keep = true
        head.add(ant)
        ants.push(ant)
      }
      // six legs, each its own group at the hip, the tripods alternating
      // (front left, front right, middle right, middle left, back left,
      // back right: even and odd step together)
      const legs = []
      for (const [s, z] of [[-1, 0.45], [1, 0.45], [1, 0], [-1, 0], [-1, -0.45], [1, -0.45]]) {
        const leg = new THREE.Group()
        leg.position.set(s * 0.5, 0.42, z)
        const knee = [s * 0.33, 0.16, z * 0.15], foot = [s * 0.44, -0.4, z * 0.35]
        leg.add(rod([0, 0, 0], knee, 0.075, J))
        leg.add(part(g().sph, J, ...knee, 0.08))
        leg.add(rod(knee, foot, 0.055, J))
        leg.add(part(g().cone, J, ...foot, 0.035, 0.08, 0.035))
        leg.userData.keep = true
        body.add(leg)
        legs.push(leg)
      }
      // the nozzle on its pivot over the back, tilted forward at rest, a
      // hot glow at its mouth
      const REST = 0.5
      const arm = new THREE.Group()
      arm.position.set(0, 1.18, -0.45)
      arm.add(part(new THREE.CylinderGeometry(0.07, 0.15, 0.6, 10).translate(0, 0.3, 0), J))
      arm.add(part(g().cyl, Au, 0, 0.12, 0, 0.17, 0.07, 0.17))
      arm.add(part(g().cyl, A, 0, 0.55, 0, 0.085, 0.05, 0.085))
      arm.add(part(g().sph, P('glow', '#ffb84a'), 0, 0.62, 0, 0.06))
      arm.rotation.x = REST
      arm.userData.keep = true
      body.add(arm)
      root.userData.anim = { kind: 'insect', body, head, antL: ants[0], antR: ants[1], legs, throwArm: arm, rest: REST }
      return root
    },
  }
}

export const BUILDERS = Object.freeze(units(NEW))
export const CLASSIC_BUILDERS = Object.freeze(units(CLASSIC))
// The builders that draw Math.random themselves, which view/models/cache.js
// makes no template of: none here.
export const DRAWS = new Set()
