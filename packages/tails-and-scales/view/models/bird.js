// (F5a, DESIGN §4.2.12's "View, input, UI": decision Q16) The Highwind
// Aerie's miniatures, in both figure styles (view/models/cache.js's
// STYLES): one builder a unit, made of kit.js's parts as ./insect.js's are,
// and painted through a style: the classic one's faceted painted plastic
// (kit.js's M), the 'new' one's feathers in a soft sheen and beaks and
// talons glossed (./gloss/gloss.js's physical finishes, on smoother
// shapes). The race's look.models names this kit ('bird').
//
// The body every one of them is built on is fowl(): an upright bird-folk,
// an egg of a body leaning forward with a pale breast, a round head with a
// beak and bright eyes, two wings of fanned feathers (each its own group at
// the shoulder, spread level in its own frame and posed folded or open, so
// they beat), a tail fan, legs with clawed feet. A flier stands on a clear
// flight stand as the Glider Wing does (./classic/squirrel.js's glider):
// its body raised `lift` (about 0.7) over its base. Its anim (view/
// units.js's 'bird' kind, view/diorama.js's idle): { kind, body, head,
// wingL, wingR, tail, lift } (lift 0 for a walker), each wing's rest pose
// on it (userData.z0, and its side, userData.s: +1 the wing on +x, whose
// raised angle is +z). The wings are kept out of the bake to move on their
// own, and a walker's head (it bobs as it walks); the rest bakes whole.
//
// Each figure's top sits near its type's eye + 0.1 (DESIGN's heights row,
// sim/bake-check.mjs): a walker's about 1.2" (the Longbills, under the
// walkers' label), a flier's about 1.6" (the Finches 1.3", the smallest
// that stays within 0.4" of it, their stands the tallest), the Roc's 2.1".
//
// Nothing here makes a three.js object as the module loads (each part is
// made inside a builder, the 'new' style's smoother shapes at its first
// build: sim/bake-check.mjs §5, sim/title-shot.mjs). No builder draws
// Math.random itself, so the template cache clones each (DRAWS is empty).
//
//   BUILDERS[unit]()          the 'new' style's miniature of the unit
//   CLASSIC_BUILDERS[unit]()  the classic style's
//   DRAWS                     the builders that draw Math.random: none
//   fowl(style, opts)         the body (opts: colours and shape, below)
import * as THREE from 'three'
import { M, glowMat, metal, G, part, rod, hold, shade } from './kit.js'
import { gloss, polished, glow } from './gloss/gloss.js'

// ── The styles: shapes and finishes ────────────────────────────────────────
// A style is { G, paint(kind, hex) }: the shared shapes its parts are cut
// from, and the material of each kind of part: 'feather', 'down' (the
// breast), 'horn' (beaks and talons), 'skin' (the legs), 'eye', 'iris',
// 'metal' (a helm, a gold band), 'glow' (a gem), 'wood', 'clear' (the
// flight stand), 'cloth' (a pouch).
const STAND = { transparent: true, opacity: 0.35 }
const CLASSIC = {
  G: () => G,
  paint: (kind, hex) => (kind === 'metal' ? metal(hex) : kind === 'glow' ? glowMat(hex) : kind === 'clear' ? M(hex, STAND) : M(hex)),
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
      // (feathers soft, a sheen at the grazing angle and hardly a coat; the
      // breast's down softer still; beaks and talons glossed horn)
      case 'feather': return gloss(hex, { roughness: 0.8, clearcoat: 0.12, clearcoatRoughness: 0.6, sheen: 0.8, sheenRoughness: 0.45, sheenColor: '#ffffff' })
      case 'down': return gloss(hex, { roughness: 0.9, clearcoat: 0.05, clearcoatRoughness: 0.7, sheen: 1, sheenRoughness: 0.6, sheenColor: '#fff8f0' })
      case 'horn': return gloss(hex, { roughness: 0.34, clearcoat: 0.8, clearcoatRoughness: 0.1 })
      case 'skin': return gloss(hex, { roughness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.3 })
      case 'eye': return gloss(hex, { roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.03 })
      case 'metal': return polished(hex)
      case 'glow': return glow(hex)
      case 'clear': return M(hex, STAND)
      // (wood and cloth matte, as the classic's)
      default: return M(hex)
    }
  },
}

// ── The palette ───────────────────────────────────────────────────────────
// Slate-blue and storm-grey plumage with white breasts and golden beaks
// and legs: apart from the Bushtails' orange and the Coil's green, and of a
// piece with the Aerie's cornflower team colour without being it (the
// base's rim carries the seat's).
const SLATE = '#4c6a9a', PALE = '#ece6d6', BEAK = '#e8b030', LEGS = '#d89a3a', DARK = '#16161a', GOLD = '#e6c84a', CLEAR = '#cfe8ff'

// ── The Aerie's body ──────────────────────────────────────────────────────
// opts: feather, belly, beak, legs (colours); leg (a walker's leg length:
// its hip's height), fly (on a flight stand, the body raised `lift`), span
// (a wing's length), tail (the tail's length), neck (a neck's length under
// the head), head (the head's radius), eyes (their radius), wings ('fold',
// 'open', 'swept' or 'raised', or a number: an open pose raised that
// many radians, the rest pose)
export function fowl(S, { feather = SLATE, belly = PALE, beak = BEAK, legs: legHex = LEGS, leg = 0.2, fly = false, lift = 0.7, span = 0.34, tail = 0.2, neck = 0, head: hr = 0.09, eyes = 0.022, wings = fly ? 'open' : 'fold' } = {}) {
  const g = S.G(), P = S.paint
  const F = P('feather', feather), F2 = P('feather', shade(feather, -0.1)), B = P('down', belly), K = P('horn', beak), L = P('skin', legHex)
  const root = new THREE.Group()
  const body = new THREE.Group()
  root.add(body)
  body.position.y = fly ? lift : leg
  // the egg body leaning forward, its pale breast
  const egg = part(g.ico, F, 0, 0.22, 0, 0.15, 0.21, 0.14)
  egg.rotation.x = 0.3
  body.add(egg)
  const br = part(g.ico, B, 0, 0.21, 0.06, 0.11, 0.16, 0.09)
  br.rotation.x = 0.3
  body.add(br)
  // the head (on a neck, a heron's), its beak and eyes
  const head = new THREE.Group()
  head.position.set(0, 0.47 + neck, 0.08 + neck * 0.3)
  body.add(head)
  if (neck) body.add(rod([0, 0.36, 0.07], [0, 0.47 + neck, 0.08 + neck * 0.3], 0.04, F))
  head.add(part(g.sph, F, 0, 0, 0, hr))
  const bk = part(g.cone, K, 0, -0.01, hr + 0.03, 0.028, 0.11, 0.022)
  bk.rotation.x = Math.PI / 2
  head.add(bk)
  for (const s of [-1, 1]) {
    head.add(part(g.sph, P('eye', '#f8f2e0'), s * hr * 0.55, hr * 0.28, hr * 0.68, eyes))
    head.add(part(g.sph, P('eye', DARK), s * hr * 0.6, hr * 0.3, hr * 0.68 + eyes * 0.6, eyes * 0.55))
  }
  // the wings: five feathers fanned back from the shoulder, level in the
  // wing's own frame (+x outward from a +x shoulder), and a covert over
  // their roots; posed folded down the flank, open, swept back or raised
  const ws = []
  for (const s of [-1, 1]) {
    const w = new THREE.Group()
    w.position.set(s * 0.12, 0.31, -0.02)
    for (let i = 0; i < 5; i++) {
      const len = span * (1 - i * 0.13), f = new THREE.Group()
      f.rotation.y = s * i * 0.21
      f.add(part(g.box, i % 2 ? F2 : F, s * len / 2, 0, 0, len, 0.014, 0.095))
      w.add(f)
    }
    w.add(part(g.ico, F, s * span * 0.24, 0.01, -0.03, span * 0.3, 0.04, 0.11))
    const z0 = typeof wings === 'number' ? wings : wings === 'fold' ? -1.25 : wings === 'raised' ? 0.75 : wings === 'swept' ? 0.1 : 0.25
    w.rotation.set(wings === 'fold' ? 0.9 : 0, wings === 'swept' ? s * 0.75 : 0, s * z0)
    w.userData.s = s
    w.userData.z0 = s * z0
    w.userData.keep = true
    body.add(w)
    ws.push(w)
  }
  // the tail fan behind and below, tilted down on a walker
  const tl = new THREE.Group()
  tl.position.set(0, 0.11, -0.13)
  tl.rotation.x = fly ? -0.05 : 0.55
  for (let i = 0; i < 4; i++) {
    const f = new THREE.Group()
    f.rotation.y = (i - 1.5) * 0.22
    f.add(part(g.box, i % 2 ? F : F2, 0, 0, -tail / 2, 0.05, 0.01, tail))
    tl.add(f)
  }
  body.add(tl)
  // the legs: a walker's down to clawed feet on the base, a flier's tucked
  // under it, talons forward
  for (const s of [-1, 1]) {
    if (fly) {
      body.add(rod([s * 0.05, 0.06, 0], [s * 0.06, -0.06, -0.06], 0.014, L))
      for (const t of [-0.3, 0, 0.3]) body.add(rod([s * 0.06, -0.06, -0.06], [s * 0.06 + t * 0.06, -0.1, -0.02], 0.007, K))
    } else {
      const foot = [s * 0.06, -leg + 0.03, 0.02]
      body.add(rod([s * 0.05, 0.08, 0], foot, 0.014, L))
      for (const t of [-0.45, 0, 0.45]) body.add(rod(foot, [foot[0] + Math.sin(t) * 0.07, foot[1] - 0.01, foot[2] + Math.cos(t) * 0.07], 0.008, K))
      body.add(rod(foot, [foot[0], foot[1] - 0.01, foot[2] - 0.05], 0.007, K))
    }
  }
  // a flier's clear flight stand
  if (fly) root.add(part(g.cyl, P('clear', CLEAR), 0, (lift + 0.12) / 2, 0, 0.022, lift + 0.12, 0.022))
  // (a walker's head bobs as it walks: its own group)
  if (!fly) {
    head.userData.keep = true
    head.userData.y0 = head.position.y
  }
  root.userData.anim = { kind: 'bird', body, head, wingL: ws[0], wingR: ws[1], tail: tl, lift: fly ? lift : 0 }
  return root
}

// ── The six unit types ────────────────────────────────────────────────────
function units(S) {
  const g = () => S.G(), P = S.paint
  return {
    // Skyseer Varra: owl-folk on its stand, great round eyes, a tufted
    // brow, a staff in one wing's tip with a pale gem (a.gem: the units'
    // animator spins it, kept out of the bake)
    skyseer() {
      const m = fowl(S, { feather: '#8a7a68', belly: '#efe4cc', beak: '#c8a050', fly: true, lift: 0.62, head: 0.13, eyes: 0.045, span: 0.38, wings: 'open' })
      const a = m.userData.anim, F = P('feather', '#6a5a4a')
      m.scale.setScalar(1.12)
      // the facial disc, the brow's tufts
      a.head.add(part(g().sph, P('down', '#f4ecd8'), 0, 0.01, 0.07, 0.11, 0.1, 0.06))
      for (const s of [-1, 1]) {
        const tuft = part(g().cone, F, s * 0.08, 0.13, 0, 0.03, 0.09, 0.02)
        tuft.rotation.z = -s * 0.4
        a.head.add(tuft)
        // (the great eyes over the disc)
        a.head.add(part(g().sph, P('eye', '#f8e070'), s * 0.05, 0.03, 0.12, 0.04))
        a.head.add(part(g().sph, P('eye', DARK), s * 0.052, 0.032, 0.15, 0.022))
      }
      // the staff, in the left wing's tip, its gem at the top
      const st = new THREE.Group()
      st.add(part(g().cyl, P('wood', '#5a4630'), 0, 0.08, 0, 0.018, 0.56, 0.018))
      const gem = part(g().sph, P('glow', '#cfe8ff'), 0, 0.42, 0, 0.055)
      st.add(gem)
      st.add(part(new THREE.TorusGeometry(0.07, 0.01, 4, 16), P('metal', GOLD), 0, 0.42, 0))
      // (upright: its wing's open pose turned back out of it)
      st.position.set(-0.2, 0, 0.06)
      st.rotation.z = -a.wingL.rotation.z
      a.wingL.add(st)
      a.gem = gem
      gem.userData.keep = true
      return m
    },
    // Stormtalon Guard: eagle-folk in a helm, wings raised wide, talons
    // forward, on a tall stand (0.86: its top at a flier's eye)
    stormtalon() {
      const m = fowl(S, { feather: '#3e3a44', belly: '#e8e2d4', beak: '#f0c040', fly: true, lift: 0.86, span: 0.42, head: 0.1, wings: 'raised' })
      const a = m.userData.anim, Mt = P('metal', '#b8c0c8'), K = P('horn', '#f0c040')
      a.head.add(part(g().cap, Mt, 0, 0.02, -0.01, 0.105, 0.08, 0.105))
      a.head.add(part(g().brim, Mt, 0, 0.02, -0.01, 0.105, 1, 0.105))
      const crest = part(g().cone, P('feather', '#c0302a'), 0, 0.12, -0.04, 0.02, 0.12, 0.05)
      crest.rotation.x = -0.6
      a.head.add(crest)
      // the hooked beak's tip, the talons out before it
      const hk = part(g().cone, K, 0, -0.04, 0.2, 0.02, 0.05, 0.02)
      hk.rotation.x = Math.PI
      a.head.add(hk)
      for (const s of [-1, 1]) for (const t of [-0.3, 0, 0.3]) a.body.add(rod([s * 0.06, -0.02, 0.06], [s * 0.06 + t * 0.06, -0.1, 0.16], 0.01, K))
      a.body.add(part(g().box, Mt, 0, 0.25, 0.1, 0.16, 0.12, 0.04))
      return m
    },
    // Longbill Pikes: heron-folk on long legs, a long thin bill, a bundle of
    // quills on the back (they walk)
    longbill() {
      const m = fowl(S, { feather: '#7f93b0', belly: '#f0ece2', beak: '#e0a028', leg: 0.45, neck: 0.16, head: 0.075, tail: 0.24, span: 0.32 })
      const a = m.userData.anim, K = P('horn', '#e0a028')
      // the long bill over the short one
      const bill = part(g().cone, K, 0, -0.01, 0.17, 0.02, 0.28, 0.016)
      bill.rotation.x = Math.PI / 2
      a.head.add(bill)
      const cap = part(g().cone, P('feather', '#2a3a5a'), 0, 0.03, -0.08, 0.02, 0.16, 0.02)
      cap.rotation.x = -1.1
      a.head.add(cap)
      // the quiver of quills on the back
      a.body.add(part(g().cyl, P('cloth', '#6a4a30'), 0, 0.27, -0.12, 0.05, 0.22, 0.05))
      for (let i = 0; i < 5; i++) {
        const q = rod([(i - 2) * 0.018, 0.34, -0.13], [(i - 2) * 0.03, 0.52, -0.2], 0.006, P('down', '#e8e0c8'))
        a.body.add(q)
      }
      return m
    },
    // Finch Flock: small round birds on tall stands, a pebble pouch
    finch() {
      const m = fowl(S, { feather: '#c8902a', belly: '#f4e4b8', beak: '#4a3a2a', fly: true, lift: 0.92, span: 0.22, tail: 0.12, head: 0.085, eyes: 0.02 })
      const a = m.userData.anim
      // (round: the body a ball, not an egg)
      a.body.children[0].scale.set(0.13, 0.14, 0.13)
      a.body.children[1].scale.set(0.1, 0.11, 0.08)
      a.head.position.set(0, 0.34, 0.07)
      a.head.add(part(g().cap, P('feather', '#3a4a6a'), 0, 0.03, -0.01, 0.088, 0.06, 0.088))
      a.body.add(part(g().sph, P('cloth', '#7a5a3a'), 0, 0.06, 0.08, 0.06, 0.05, 0.05))
      a.body.add(part(g().sph, P('horn', '#8a8a84'), 0.03, 0.03, 0.12, 0.025))
      return m
    },
    // Kestrel Divers: falcons in a stoop, the body pitched down 0.6 rad,
    // wings swept back, on a tall stand (0.98: the stoop's top at about a
    // flier's eye)
    kestrel() {
      const m = fowl(S, { feather: '#a8603a', belly: '#f0dcc0', beak: '#e8c040', fly: true, lift: 0.98, span: 0.4, tail: 0.24, wings: 'swept' })
      const a = m.userData.anim
      a.body.rotation.x = 0.6
      for (const s of [-1, 1]) a.head.add(part(g().box, P('feather', '#2a2a30'), s * 0.06, -0.02, 0.05, 0.015, 0.06, 0.02))
      a.head.add(part(g().cap, P('feather', '#4a5a7a'), 0, 0.02, -0.01, 0.092, 0.07, 0.092))
      return m
    },
    // Greatwing Roc: a great bird, its wings spread over its base (about
    // 2.2" across), a hooked beak, on a short stand
    roc() {
      const m = fowl(S, { feather: '#5a4a3c', belly: '#d8c8a8', beak: '#e8b030', fly: true, lift: 0.36, span: 0.38, tail: 0.24, head: 0.1, wings: 0.5 })
      const a = m.userData.anim, K = P('horn', '#e8b030')
      m.scale.setScalar(2.25)
      const hk = part(g().cone, K, 0, -0.045, 0.18, 0.02, 0.06, 0.02)
      hk.rotation.x = Math.PI
      a.head.add(hk)
      a.head.add(part(g().cap, P('feather', '#e8e0d0'), 0, 0.02, -0.01, 0.1, 0.06, 0.1))
      for (const s of [-1, 1]) {
        const ruff = part(g().cone, P('feather', '#3a2e24'), s * 0.05, -0.08, -0.04, 0.05, 0.12, 0.03)
        ruff.rotation.z = s * 0.4
        a.head.add(ruff)
      }
      return m
    },
  }
}

export const BUILDERS = Object.freeze(units(NEW))
export const CLASSIC_BUILDERS = Object.freeze(units(CLASSIC))
// The builders that draw Math.random themselves, which view/models/cache.js
// makes no template of: none here.
export const DRAWS = new Set()
