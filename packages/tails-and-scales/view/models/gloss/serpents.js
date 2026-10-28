// The Coil of Ssithra, smooth and shiny (refined primitives + physical gloss): the six units of
// view/models/classic/serpent.js, part for part (the coil, torso, head, hood and arms of its naga(), and every
// unit's gear), rebuilt as smooth high-resolution geometry under a lacquered, scaled skin.
//
//   buildSerpent(key, { detail })   { group, triangles, ms }: the figure standing (coiled) on y 0, facing
//                                   +z, no base. detail 1 is the close-up figure; 0.5 the ~60 px level of
//                                   detail, 0.3 the ~28 px one (fewer rings and segments, no scute geometry,
//                                   no claws or catchlights: the shader's own level of detail fades the
//                                   gloss, scales and markings at those sizes). No Math.random.
//   KEYS                            the six unit keys
//
// What is different from serpent.js, and why:
// - The coil, torso, shoulders and neck are ONE swept tube (shapes.js body), so the body has no join
//   anywhere from the tail's point to the head. The tube broadens into the shoulders and slopes up into
//   the neck, so the arms grow out of a shoulder line instead of sitting on the torso as two balls. Its
//   cross-section is flattened on the belly, which is its own mesh: overlapping scutes in the geometry,
//   cream like serpent.js's belly plate, meeting the back at a crisp line along each flank. The back
//   carries a darker pattern in the unit's own colour (a viper's zigzag, chevrons, diamonds, saddles),
//   cut crisply along its own zero line, so a figure reads as a snake even at 28 px.
// - The head is one sculpted blob (a viper's: broad jaw, brow ridges over the eyes, a mouth line with the
//   belly colour under it). The eyes are bigger, with a painted catchlight as the splat Bushtails have.
//   The hood is one curved, thinning shell; on its back three low-contrast chevrons are painted (a king
//   cobra's banding, cut into its vertex colours), not two lens discs nor a spectacle's two loops, so from
//   behind, the player's view of their own army, it doesn't read as a face.
// - Arms taper from the shoulder to a wrist; each hand is a small palm with three claws curling forward,
//   or (naga's `grip`: the sidewinder's) closed round a grip, the claws wrapping it, so its sickles are
//   held in its fists and not hung at its cheeks as serpent.js's are.
// - Gear set along the back sits on the tube's own spine (userData.spineAt(y): the surface point and its
//   normal at theta pi), so the brute's dorsal spikes follow the torso as it tapers into the neck.
// - Ambient occlusion from the figure's own capsules (its centreline, head and arms) darkens the coil's
//   contacts, the armpits and the chin, in the vertex colours.
// - Everything that shines is gloss.js's: clearcoated skin, polished metal, satin bronze, varnished wood,
//   lacquered bone, satin horn.
// - Cheap to build cold (a figure is built once per unit type, while V8 is still cold): lathes welded as
//   they are built, the skull's symmetric half meshed and mirrored, the hood's marks cut only where they
//   are (the triangles just outside split at the cuts' new edge vertices, so the shell stays closed: no
//   T-junction cracks), the crew cloned with no userData.
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { part, rod, hold, shade } from '../kit.js'
import { skin, belly as bellyMat, gloss, polished, satinMetal, glow } from './gloss.js'
import { blob, ellipsoid, lathe, horn, body as sweepBody, tint, triangles, smooth, cutPaint, withPlain, occluder, occlude, sweepSimple, vertexNormals } from './shapes.js'
import { smin, smax, roundCone, ellipsoid as sdfEllipsoid, fieldGeometry } from './sdf.js'

const col = (hex) => new THREE.Color(hex)
const lerp = THREE.MathUtils.lerp
const fr = (x) => x - Math.floor(x)
// a paint a touch more saturated (lacquer over a vivid skin reads as enamel; over a dull one, as glass)
function vivid(hex, k = 1.18) {
  const c = new THREE.Color(hex), hsl = {}
  c.getHSL(hsl)
  return c.setHSL(hsl.h, Math.min(1, hsl.s * k), hsl.l)
}

// ── Finishes ───────────────────────────────────────────────────────────────
// two finishes for everything that isn't skin, metal or glowing (so a baked figure has few classes):
// lacquer (bone, horn, eyes' pupils, the tongue, the gourd, the staff) and satin (oiled wood)
const lacquer = (c, o = {}) => gloss(c, { roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.1, ...o })
const satin = (c) => gloss(c, { roughness: 0.62, clearcoat: 0.2, clearcoatRoughness: 0.3 })
const wood = () => satin('#7a5232')
const bone = (c = '#e8dcc0') => lacquer(c)
// a horn or spike, darker at its root and its own colour at the tip (horn, not a white cone: at 28 px it is
// a pale stroke, not a speck)
const hornM = () => lacquer('#ffffff', { vertexColors: true })
// a satin horn: the brute's dorsal spikes, a row of small cones along the back that face the player's camera
// from behind; lacquered and pale they were a near-white stripe flickering at the pixel spacing at 60 px
const spineM = () => gloss('#ffffff', { vertexColors: true, roughness: 0.55, clearcoat: 0.35, clearcoatRoughness: 0.35 })
function hornTint(g, hex, a, b) {
  const base = col(hex), root = base.clone().multiplyScalar(0.58), A = new THREE.Vector3(...a), dir = new THREE.Vector3(...b).sub(A), len = dir.length()
  dir.normalize()
  return tint(g, '#ffffff', (p, out) => out.copy(root).lerp(base, smooth(p.clone().sub(A).dot(dir) / len, 0.15, 0.95)))
}
const RES = (D, n, min) => Math.max(min, Math.round(n * D))
// where a gripping hand (naga's `grip`) holds its grip: on the hand's own x axis through this point
const GRIP = [0, -0.034, 0.026]

// ── The back's pattern ─────────────────────────────────────────────────────
// Each marking is a field over (s, theta, u): s the arc length from the tail, theta round the body from
// the belly line (pi: the spine), u the fraction of the body's length; about -1 at a mark's heart, 0 on
// its edge (where shapes.js cuts it), positive outside. They shrink away toward the tail's tip and up the
// neck. paint() is the skin without markings (countershaded: paler low on the flanks, darker along the
// spine), which the shader also fades to as a figure shrinks.
function backPattern(scaleC, pat) {
  const base = scaleC, light = base.clone().lerp(new THREE.Color(1, 1, 1), 0.06)
  // (a mark's colour: the unit's own, or the skin's darkened by `dark` (a factor: an HSL shift in linear
  // light is a crushing one on a dark green), a touch more saturated)
  const dark = pat.color ? vivid(pat.color, 1.1) : vivid('#' + base.clone().multiplyScalar(pat.dark ?? 0.5).getHexString(), 1.12)
  const darkLight = dark.clone().lerp(light, 0.1)
  const P = pat.period ?? 0.13
  const paint = (s, th, u, out) => {
    const cb = Math.cos(th)
    out.copy(base).lerp(light, smooth(cb, 0.05, 0.5)) // paler low on the flanks
    out.multiplyScalar(1 - 0.06 * smooth(-cb, 0.3, 1)) // and a touch darker along the spine
  }
  const tmp = new THREE.Color()
  const markPaint = (k) => (s, th, u, out) => {
    const cb = Math.cos(th)
    out.copy(dark).lerp(darkLight, smooth(cb, 0.05, 0.5))
    if (k < 1) {
      paint(s, th, u, tmp)
      out.lerp(tmp, 1 - k)
    }
  }
  const fade = (u) => smooth(u, 0.03, 0.12) * (1 - smooth(u, 0.84, 0.93))
  const field = (f) => (s, th, u) => f(s / P, th - Math.PI, Math.abs(th - Math.PI), Math.cos(th)) + 1.6 * (1 - fade(u))
  const marks = []
  if (pat.kind === 'zigzag') {
    // a viper's: a dark band weaving either side of the spine, and a row of blotches low on each flank
    marks.push({ field: field((f, sg) => (Math.abs(sg - 0.42 * (4 * Math.abs(fr(f) - 0.5) - 1)) - 0.22) / 0.22), paint: markPaint(1) })
    marks.push({ field: field((f, sg, sp) => Math.hypot((fr(f + 0.5) - 0.5) / 0.16, (sp - 1.38) / 0.17) - 1), paint: markPaint(0.6) })
  } else if (pat.kind === 'chevrons') {
    marks.push({ field: field((f, sg, sp, cb) => Math.max((Math.abs(fr(f + 0.22 * sp) - 0.5) - 0.13) / 0.13, (cb - 0.25) / 0.3)), paint: markPaint(1) })
  } else if (pat.kind === 'bands') {
    // a krait's: clean dark rings over the back and flanks
    marks.push({ field: field((f, sg, sp, cb) => Math.max((Math.abs(fr(f) - 0.5) - 0.17) / 0.17, (cb - 0.3) / 0.3)), paint: markPaint(1) })
  } else if (pat.kind === 'diamonds') {
    marks.push({ field: field((f, sg, sp) => sp / 1.25 + 2 * Math.abs(fr(f) - 0.5) - 1), paint: markPaint(1) })
  } else if (pat.kind === 'saddles') {
    // saddles over the back, and blotches on the flanks between them
    marks.push({ field: field((f, sg, sp) => Math.hypot((fr(f) - 0.5) / 0.2, sp / 1.05) - 1), paint: markPaint(1) })
    marks.push({ field: field((f, sg, sp) => Math.hypot((fr(f + 0.5) - 0.5) / 0.15, (sp - 1.8) / 0.36) - 1), paint: markPaint(0.75) })
  }
  return { paint, marks }
}

// ── The naga ───────────────────────────────────────────────────────────────
// (sizeK: the engine's crew is built here at full size, then folded to its final 0.72 (foldScale), so its
// skin's scale frequency and level of detail are divided by it: its scales match a standalone figure's)
function naga({ scale = '#3f8f4a', belly = '#d9cf86', hood = null, hoodSize = 1, hoodLift = 0, long = false, thick = 1, pattern = { kind: 'bands' }, detail = 1, iridescence = 0, sizeK = 1, grip = false } = {}) {
  const D = detail, T = thick
  const root = new THREE.Group()
  const bodyG = new THREE.Group()
  root.add(bodyG)
  const own = { ...(iridescence ? { iridescence } : {}), ...(sizeK !== 1 ? { uScaleFreq: 52 / sizeK, uLodScale: sizeK } : {}) }
  const S = skin(own), B = bellyMat()
  const scaleC = vivid(scale), bellyC = col(belly)
  const capC = scaleC.clone().multiplyScalar(0.9), flankC = scaleC.clone().lerp(new THREE.Color(1, 1, 1), 0.06)

  // the centreline: serpent.js's coil (or long S-curve) and its torso, as one curve up into the head
  const down = [0, -1, 0]
  let knots
  if (long) {
    // the sidewinder's S-curve rests on its base (serpent.js's floated: the lean below lifted it off),
    // its tail lifting a little behind as serpent.js's does; its last bend comes round under the chest,
    // on the right, before it rises, so the stroke runs on unbroken into the torso. Written where it
    // should end up, then turned back by the body's 0.12 lean.
    const pts = [[0.05, 0.15, -0.9], [-0.18, 0.11, -0.62], [0.16, 0.085, -0.34], [-0.1, 0.116, -0.1], [0.07, 0.12, 0.07]]
    const rs = [0, 0.055, 0.085, 0.1, 0.104]
    const c = Math.cos(-0.12), s = Math.sin(-0.12)
    knots = pts.map(([x, y, z], i) => ({ p: [x, y * c - z * s, y * s + z * c], r: rs[i] * thick, fb: 0.74, fs: 1.06, d: down, bh: i > 2 ? 0.5 : 0.76 }))
    // (the belly narrow where it rises off the base, so the stroke stays the body's colour)
    knots.push({ p: [0.01, 0.235, 0.07], r: 0.11 * thick, fb: 0.78, fs: 1.06, d: [0, -0.5, 1], bh: 0.46 })
  } else {
    knots = []
    for (let i = 0; i <= 10; i++) {
      const t = i / 10
      const a = -0.6 + t * Math.PI * 2.3
      const rr = 0.3 - t * 0.17
      const r = i === 0 ? 0 : (0.024 + 0.088 * Math.pow(t, 0.62)) * thick
      knots.push({ p: [Math.cos(a) * rr, 0.06 + t * 0.1, Math.sin(a) * rr - 0.04], r, fb: 0.74, fs: 1.06, d: down })
    }
  }
  // the torso: a chest, then the SHOULDERS (the tube broadens to carry the arms, and slopes up into the
  // neck: a trapezius, not a ball on each side), then the neck into the head
  // (the sidewinder's pale belly is a narrower stripe up its long rise, so the stroke stays tan)
  const chest = long ? 0.56 : 0.76
  knots.push(
    { p: [0, 0.31, 0.02], r: 0.114 * T, fb: 0.82, fs: 1.07, d: [0, -0.35, 1], bh: chest },
    { p: [0, 0.42, 0.034], r: 0.107 * T, fb: 0.88, fs: 1.1, d: [0, 0.1, 1], bh: long ? 0.64 : 0.76 },
    { p: [0, 0.525, 0.048], r: 0.121 * T, fb: 0.88, fs: 1.15, d: [0, 0.12, 1], bh: 0.74 },
    { p: [0, 0.625, 0.056], r: 0.108 * T, fb: 0.9, fs: 1.5, d: [0, 0.15, 1], bh: 0.58 },
    { p: [0, 0.7, 0.066], r: 0.074 * Math.pow(T, 0.75), fb: 0.92, fs: 1.18, d: [0, 0.2, 1], bh: 0.66 },
    { p: [0, 0.762, 0.072], r: 0.056, fb: 0.95, fs: 1.04, d: [0, 0.2, 1], bh: 0.7 },
    { p: [0, 0.82, 0.076], r: 0.02, fb: 0.95, fs: 1, d: [0, 0.2, 1], bh: 0.7 },
  )
  // the torso's back at a height: its centreline's z and radius there (gear set along the spine uses it)
  const torso = knots.slice(-7)
  root.userData.backAt = (y) => {
    let i = 0
    while (i < torso.length - 2 && torso[i + 1].p[1] < y) i++
    const a = torso[i], b = torso[i + 1], t = Math.min(1, Math.max(0, (y - a.p[1]) / (b.p[1] - a.p[1])))
    return [a.p[2] + (b.p[2] - a.p[2]) * t, a.r + (b.r - a.r) * t]
  }
  const pat = backPattern(scaleC, pattern)
  const tube = sweepBody(knots, {
    radial: RES(D, 22, 9), scutes: D >= 0.75, ringStep: lerp(1.0, 0.45, D),
    bellyHalf: 0.76, scuteDepth: 0.035,
    paint: pat.paint, marks: pat.marks,
    // (without the scutes' geometry, the belly takes the average of their creases' wash)
    bellyPaint: D >= 0.75 ? (s, u, out) => out.copy(bellyC) : (s, u, out) => out.copy(bellyC).multiplyScalar(0.92),
  })
  // the spine's surface at a height on the torso: the tube's own point at theta pi (the middle of the back)
  // and its normal there, so gear set along the back sits ON it wherever the torso tapers (backAt's knot
  // radius is the centreline's, and the tube's back is not at a fixed z)
  root.userData.spineAt = (y) => {
    const P = new THREE.Vector3(), N = new THREE.Vector3()
    const at = (u) => (tube.frameAt(u * tube.length)(Math.PI, P, N), P.y)
    // (down from the head's end until below y, then halve the step: the torso rises monotonically)
    let lo = 1
    while (lo > 0 && at(lo) > y) lo = Math.max(0, lo - 0.02)
    let hi = Math.min(1, lo + 0.02)
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2
      if (at(mid) > y) hi = mid
      else lo = mid
    }
    at((lo + hi) / 2)
    return { p: P.clone(), n: N.clone() }
  }
  const sk = new THREE.Mesh(tube.skin, S), be = new THREE.Mesh(tube.belly, B)
  sk.userData.aoId = be.userData.aoId = 'body'
  sk.userData.aoGrid = be.userData.aoGrid = true
  bodyG.add(sk, be)

  // the head: one sculpted blob (a viper's)
  const head = new THREE.Group()
  head.position.set(0, 0.79, 0.08)
  bodyG.add(head)
  const browL = new THREE.Vector3(-0.5, 0.62, 0.36).normalize(), browR = new THREE.Vector3(0.5, 0.62, 0.36).normalize()
  const headShape = (v, d) => {
    const zf = d.z
    const wx = 0.104 * (1 + 0.07 * (1 - zf) - 0.26 * smooth(zf, 0.1, 1))
    const wy = 0.084 * (1 - 0.24 * smooth(zf, 0.05, 1)) * (d.y > 0 ? 0.9 : 0.96)
    const wz = 0.152
    // the mouth line, a shallow groove along the lower third, from the snout back to the jaw's hinge
    const mouth = Math.exp(-(((d.y + 0.3) / 0.075) ** 2)) * smooth(d.z, -0.45, 0.1)
    // brow ridges over the eyes
    const brow = 0.07 * (Math.exp(-d.distanceToSquared(browL) / 0.035) + Math.exp(-d.distanceToSquared(browR) / 0.035))
    const k = (1 - 0.06 * mouth) * (1 + brow)
    return v.set(d.x * wx * k, d.y * wy * k, 0.02 + d.z * wz * k)
  }
  const headGeo = withPlain(blob(RES(D, 12, 3), headShape, (d, p, out) => {
    // the lower jaw and throat in the belly's colour, under the mouth line; a darker cap on top
    out.copy(flankC).lerp(capC, smooth(d.y, 0.0, 0.6)).lerp(bellyC, smooth(-d.y, 0.26, 0.34))
  }))
  const headM = new THREE.Mesh(headGeo, S)
  headM.userData.aoId = 'head'
  head.add(headM)
  // the eyes: bigger than serpent.js's (0.034, not 0.03), set into the head's surface so they bulge by
  // about two thirds; a slit pupil, and a painted catchlight up toward the sun (both eyes alike, as the
  // splat Bushtails' are)
  const eyeM = gloss('#ffd23a', { emissive: '#b08000', emissiveIntensity: 0.45, roughness: 0.15, clearcoat: 1, clearcoatRoughness: 0.03 })
  const pupilM = lacquer('#111111')
  const glintM = glow('#ffffff', { emissiveIntensity: 1.1, clearcoat: 0 })
  const er = 0.034
  const eyeGeo = new THREE.SphereGeometry(er, RES(D, 20, 7), RES(D, 14, 5)), dotGeo = new THREE.SphereGeometry(1, RES(D, 10, 5), RES(D, 6, 3))
  const catchDir = new THREE.Vector3(-0.55, 0.83, 0).normalize()
  const eyes = []
  for (const s of [-1, 1]) {
    const d = new THREE.Vector3(s * 0.62, 0.43, 0.45).normalize()
    const at = headShape(new THREE.Vector3(), d)
    const n = at.clone().sub(new THREE.Vector3(0, 0, 0.02)).normalize()
    const c = at.addScaledVector(n, -0.36 * er)
    head.add(part(eyeGeo, eyeM, c.x, c.y, c.z))
    const out = new THREE.Vector3(s * 0.55, 0.2, 0.8).normalize()
    const pu = part(dotGeo, pupilM, ...c.clone().addScaledVector(out, er * 0.9).toArray(), 0.0085, 0.022, 0.008)
    pu.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), out)
    head.add(pu)
    if (D >= 0.45) {
      // (up and toward the sun from the pupil, the same side on both eyes, standing just proud of the
      // pupil so neither the eye nor the slit hides it)
      const gd = out.clone().addScaledVector(catchDir, 0.6).normalize()
      const gl = part(dotGeo, glintM, ...c.clone().addScaledVector(gd, er * 1.1).toArray(), 0.0092, 0.0092, 0.0025)
      gl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), gd)
      head.add(gl)
    }
    eyes.push(c)
  }
  // nostrils
  if (D >= 0.45) for (const s of [-1, 1]) head.add(part(dotGeo, pupilM, s * 0.025, 0.012, 0.165, 0.007, 0.005, 0.006))
  const tongue = new THREE.Group()
  tongue.position.set(0, -0.03, 0.16)
  const tongueM = lacquer('#d0304a')
  for (const s of [-1, 1]) {
    const f = part(new THREE.CylinderGeometry(0.008, 0.004, 0.1, 6), tongueM, s * 0.012, 0, 0.05)
    f.rotation.x = Math.PI / 2
    f.rotation.z = s * 0.3
    tongue.add(f)
  }
  tongue.scale.setScalar(0.001)
  head.add(tongue)

  // the hood: one curved shell, thinning to its edge, its front curling forward round the head
  if (hood) {
    const hs = hoodSize, hoodC = vivid(shade(hood, hoodLift), 1.05), hoodIn = hoodC.clone().lerp(new THREE.Color(1, 1, 1), 0.04)
    const rx = 0.21 * hs, ry = 0.24 * hs
    // (its lower half leans back, so the neck and shoulders it rises from stay in front of it, and is
    // shorter than serpent.js's: below the shoulders it was hidden behind the torso, or poked through)
    const hoodGeo = blob(D >= 0.45 ? RES(D, 14, 5) : 4, (v, d) => {
      const taper = 1 - 0.42 * smooth(-d.y, 0.05, 1)
      const x = d.x * rx * taper
      const y = d.y * ry * (d.y < 0 ? 0.86 : 1) - 0.02
      const edge = d.x * d.x + Math.max(0, d.y) ** 2
      const z = -0.108 - 0.13 * smooth(-d.y, 0, 1) + 0.24 * (x * x) / rx + d.z * 0.04 * (1 - 0.6 * edge)
      v.set(x, y, z)
    }, (d, p, out) => out.copy(hoodC).lerp(hoodIn, smooth(d.z, 0, 0.4)))
    // the hood's back, where serpent.js has its two eye-spots: three nested chevrons, a king cobra's
    // banding, pointing down the hood as its outline does, a thin pale line little lighter than the hood.
    // Nothing on it is a pair of round marks side by side (serpent.js's two belly-coloured lens discs, and
    // then a cobra's spectacle, two loops joined by a bridge, both read as a face from behind: eyes, or
    // goggles). Cut into the vertex colours, so it is crisp and flush (no inlaid discs to z-fight): each
    // band between TWO cuts, along the chevron's signed distance minus and plus the half-width. Each of
    // those is a smooth field (linear but for the chevron's own corner), so even the 60 px level's coarse
    // shell cuts a thin band crisply, where a |distance| - w field's thin valley falls between vertices.
    const line = hoodC.clone().lerp(bellyC, 0.3)
    // (each band tapers along its arms, which curve up a little toward the hood's edge: banding, not a
    // badge's stripes)
    const w0 = D >= 0.75 ? 0.0105 : 0.012, ca = Math.cos(0.52), sa = Math.sin(0.52)
    const w = (X) => w0 * (1 - 0.55 * smooth(X, 0.025, 0.135))
    const V = [0.066, -0.006, -0.078]
    // the bands' extent: an ellipse on the hood's back (their arms end along it), on the back only; every
    // cut is made only near it (a band's two fields, and the back's, cross the whole shell)
    const ext = (Q, o) => Math.hypot(Q[o] / 0.135, (Q[o + 1] + 0.005) / 0.2) - 1
    const near = (Q, o) => ext(Q, o) < 0.25 && Q[o + 2] < -0.25
    const cuts = [{ field: ext, bit: 1 << 6, region: near }, { field: (Q, o) => Q[o + 2] + 0.45, bit: 1 << 7, region: near }]
    V.forEach((y0, k) => {
      // (positive above the chevron, negative below it)
      const f = (Q, o) => {
        const X = Math.abs(Q[o])
        return (Q[o + 1] - y0 - 1.4 * X * X) * ca - X * sa
      }
      cuts.push({ field: (Q, o) => f(Q, o) - w(Math.abs(Q[o])), bit: 1 << (2 * k), region: near }, { field: (Q, o) => f(Q, o) + w(Math.abs(Q[o])), bit: 1 << (2 * k + 1), region: near })
    })
    const bands = new Map()
    const inBand = (l) => {
      let b = bands.get(l)
      if (b === undefined) bands.set(l, (b = (l & 0xc0) === 0xc0 && V.some((y, k) => (l >> (2 * k)) & 1 && !((l >> (2 * k + 1)) & 1))))
      return b
    }
    // (at the 28 px level of detail the shader has faded the markings anyway: no cut)
    const hoodG2 = D < 0.45 ? withPlain(hoodGeo) : cutPaint(hoodGeo, (p, n) => [p.x / hs, p.y / hs, n.z], cuts, (Q, o, label, base, out) => out.copy(inBand(label) ? line : base))
    // (a cobra's hood is smooth-scaled: a lower relief than the body's, a softer coat, the env dimmed so
    // its back carries no broad window or horizon reflection; its rim sheen is thin and in the hood's own
    // purple (a pale one turned the whole hood lilac seen side-on, where all of it is at a grazing angle))
    const hoodMat = skin({ ...own, uBump: 0.16, uKeel: 0.1, uWash: 0.9, uCoatFollow: 0.3, uEnvSpec: 0.22, uEnvCoat: 0.22, clearcoatRoughness: 0.22, uRim: 0.5, uRimPow: 5, uRimTint: 1, uRimColor: [1.0, 0.9, 1.0] })
    // (no occlusion on the hood: thin, and away from everything but the neck it rises behind)
    head.add(new THREE.Mesh(hoodG2, hoodMat))
  }

  // arms: lathed, tapering from the shoulder (sunk in the tube's shoulder) to a wrist; each hand a small
  // palm with three claws curling forward (prototype B's), pale horn at their tips
  const arms = []
  // (the arm hangs along -y and swings forward: its front, +z, is the inside of the forearm, paler)
  const armGeo = withPlain(tint(lathe([[0, 0.012], [0.024, 0.009], [0.038, -0.002], [0.044, -0.02], [0.044, -0.055], [0.041, -0.095], [0.036, -0.13], [0.03, -0.162], [0.024, -0.187], [0.022, -0.2], [0.012, -0.208], [0, -0.21]].map(([r, y]) => [r * T, y]), RES(D, 18, 6)),
    '#' + scaleC.getHexString(), (p, out) => out.lerp(flankC, smooth(p.z / (0.05 * T), -0.2, 0.8))))
  const palmGeo = withPlain(tint(ellipsoid(RES(D, 4, 1), [0.03 * T, 0.024 * T, 0.03 * T], [0, -0.006, 0.006]), '#' + scaleC.getHexString()))
  const clawC = col('#e8dcc4')
  const claws = []
  // (grip: each hand closed round a grip along its own x through GRIP, the palm side's front: every claw
  // runs out past the grip's far side and wraps back round it to the palm side, its point showing there)
  if (D >= 0.45) {
    for (const dx of [-0.019, 0, 0.019]) {
      const A = grip ? [dx * T, -0.026 * T, 0.006 * T] : [dx * T, -0.014 * T, 0.012 * T]
      const Bp = grip ? [dx * T, -0.022 * T, 0.047 * T] : [dx * 1.3 * T, -0.05 * T, 0.036 * T]
      const g = grip ? horn(A, Bp, 0.0095 * T, [0, -0.062 * T, 0], RES(D, 8, 5), RES(D, 8, 5), 0.0015)
        : horn(A, Bp, 0.0115 * T, [0, -0.006 * T, 0.008 * T], RES(D, 8, 5), RES(D, 6, 4), 0.0015)
      const a = new THREE.Vector3(...A), dir = new THREE.Vector3(...Bp).sub(a), len = dir.length()
      dir.normalize()
      tint(g, '#ffffff', (p, out) => out.copy(scaleC).lerp(clawC, smooth(p.clone().sub(a).dot(dir) / len, 0.42, 0.62)))
      claws.push(g)
    }
  }
  const clawM = bellyMat()
  for (const s of [-1, 1]) {
    const arm = new THREE.Group()
    arm.position.set(s * 0.118 * T, 0.618, 0.054)
    // (each arm its own geometry: the occlusion darkens each side's vertices for its own pose)
    const am = new THREE.Mesh(s < 0 ? armGeo : armGeo.clone(), S)
    arm.add(am)
    const hand = new THREE.Group()
    hand.position.set(0, -0.21, 0)
    const pm = new THREE.Mesh(s < 0 ? palmGeo : palmGeo.clone(), S)
    hand.add(pm)
    for (const g of claws) {
      const c = new THREE.Mesh(s < 0 ? g : g.clone(), clawM)
      c.userData.aoId = s < 0 ? 'armL' : 'armR'
      hand.add(c)
    }
    arm.add(hand)
    am.userData.aoId = pm.userData.aoId = s < 0 ? 'armL' : 'armR'
    arm.userData.hand = hand
    arm.rotation.x = -0.9
    bodyG.add(arm)
    arms.push(arm)
  }
  root.userData.anim = { kind: 'naga', body: bodyG, head, tongue, armL: arms[0], armR: arms[1] }
  // what shadeNaga needs once the unit has posed the arms
  root.userData.ao = { chain: tube.chain, frameAt: tube.frameAt, length: tube.length, T }
  return root
}

// Ambient occlusion for a posed naga (M16): its centreline's capsules, its head and its arms darken each
// other's vertex colours: the coil's contacts, the armpits, under the chin.
function shadeNaga(root) {
  const info = root.userData.ao
  if (!info) return
  delete root.userData.ao
  const a = root.userData.anim
  root.updateMatrixWorld(true)
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert()
  const into = (o) => new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld)
  const pt = (m, p) => new THREE.Vector3(...p).applyMatrix4(m).toArray()
  const bm = into(a.body), hm = into(a.head)
  const occ = info.chain.map((c) => ({ ...c, a: pt(bm, c.a), b: pt(bm, c.b), id: 'body' }))
  occ.push({ a: pt(hm, [0, -0.005, 0.03]), b: pt(hm, [0, 0.0, 0.1]), ra: 0.085, rb: 0.06, id: 'head' })
  for (const [arm, id] of [[a.armL, 'armL'], [a.armR, 'armR']]) {
    const m = into(arm)
    occ.push({ a: pt(m, [0, -0.01, 0]), b: pt(m, [0, -0.2, 0]), ra: 0.042 * info.T, rb: 0.026 * info.T, id })
    occ.push({ a: pt(m, [0, -0.214, 0.006]), b: pt(m, [0, -0.214, 0.006]), ra: 0.028 * info.T, rb: 0.028 * info.T, id })
  }
  const shade = occluder(occ, { strength: 0.8, floor: 0.45 })
  // the body: occlusion on a coarse grid over (s, theta) (it is smooth), each vertex reading it back by
  // its own; the head, arms and hands vertex by vertex
  const ds = 0.03, nt = 14, ns = Math.ceil(info.length / ds) + 1, G = new Float32Array(ns * nt)
  const P = new THREE.Vector3(), N = new THREE.Vector3(), nmat = new THREE.Matrix3().getNormalMatrix(bm)
  for (let i = 0; i < ns; i++) {
    const at = info.frameAt(i * ds)
    for (let j = 0; j < nt; j++) {
    at((j / nt) * Math.PI * 2, P, N)
    P.applyMatrix4(bm)
    N.applyMatrix3(nmat).normalize()
    G[i * nt + j] = shade(P.x, P.y, P.z, N.x, N.y, N.z, 'body', i * ds)
    }
  }
  const meshes = []
  root.traverse((o) => {
    if (!o.isMesh || !o.userData.aoId) return
    if (!o.userData.aoGrid) return meshes.push(o)
    const g = o.geometry, arc = g.userData.arc, th = g.userData.th
    const ca = g.attributes.color.array, pa = g.attributes.plain?.array
    for (let v = 0; v < arc.length; v++) {
      const x = Math.min(ns - 1.001, arc[v] / ds), y = ((((th[v] / (Math.PI * 2)) % 1) + 1) % 1) * nt
      const i = Math.floor(x), j = Math.floor(y) % nt, fx = x - i, fy = y - Math.floor(y), j1 = (j + 1) % nt
      const k = (G[i * nt + j] * (1 - fx) + G[(i + 1) * nt + j] * fx) * (1 - fy) + (G[i * nt + j1] * (1 - fx) + G[(i + 1) * nt + j1] * fx) * fy
      if (k < 1) {
        ca[3 * v] *= k, ca[3 * v + 1] *= k, ca[3 * v + 2] *= k
        if (pa) pa[3 * v] *= k, pa[3 * v + 1] *= k, pa[3 * v + 2] *= k
      }
    }
  })
  occlude(meshes, shade, root)
}

// ── Gear ───────────────────────────────────────────────────────────────────
function spear(D, len = 1.15, tip = '#c9a24a') {
  const g = new THREE.Group()
  g.add(part(new THREE.CylinderGeometry(0.02, 0.022, len, RES(D, 12, 5)), wood()))
  // a leaf blade, flattened, on a socket
  const blade = part(lathe([[0, -0.01], [0.024, 0], [0.034, 0.03], [0.044, 0.07], [0.038, 0.105], [0.02, 0.14], [0, 0.175]], RES(D, 14, 5)), polished(tip), 0, len / 2 + 0.01, 0, 1, 1, 0.42)
  g.add(blade)
  g.add(part(new THREE.CylinderGeometry(0.026, 0.026, 0.035, RES(D, 14, 5)), polished(tip), 0, len / 2 - 0.005, 0))
  return g
}
// the round shield: a gently domed face of satin bronze (polished metal mirrored the dark table and read
// as a black disc), a rolled rim, and a domed boss
function roundShield(D, r, color, boss) {
  const g = new THREE.Group()
  const face = part(lathe([[0, 0.05], [0.3, 0.045], [0.6, 0.032], [0.85, 0.014], [0.97, 0.002], [1.0, -0.012], [0.96, -0.02], [0.5, -0.016], [0, -0.014]].map(([x, y]) => [x * r, y]), RES(D, 28, 9)), satinMetal(color))
  face.rotation.x = Math.PI / 2
  g.add(face)
  const rim = part(new THREE.TorusGeometry(r * 0.985, 0.012, RES(D, 8, 3), RES(D, 40, 12)), polished(boss, { roughness: 0.3 }), 0, 0, -0.002)
  g.add(rim)
  // the boss: a dome on a low flange, its shading the sun's (satin), so it reads raised, not hollow
  const bossM = part(lathe([[0, 0.052], [0.022, 0.049], [0.038, 0.039], [0.048, 0.024], [0.053, 0.01], [0.06, 0.006], [0.066, 0.0], [0, 0]], RES(D, 20, 7)), satinMetal(boss, { roughness: 0.34, metalness: 0.2, clearcoat: 0.6 }), 0, 0, 0.044)
  bossM.rotation.x = Math.PI / 2
  g.add(bossM)
  return g
}
// a rounded octahedron (the sidewinder's back ridges)
function ridge(D, rx, ry, rz) {
  return blob(D >= 0.45 ? RES(D, 3, 1) : 0, (v, d) => {
    const k = Math.pow(Math.abs(d.x) + Math.abs(d.y) + Math.abs(d.z), -0.75)
    v.set(d.x * k * rx, d.y * k * ry, d.z * k * rz)
  })
}
// a smooth, slightly convex spike along +y, its base at y 0
const coneGeo = (D, r, h) => lathe([[r, 0], [r * 0.95, h * 0.2], [r * 0.7, h * 0.55], [r * 0.35, h * 0.85], [0, h]], RES(D, 12, 5))

// the Basilisk Venom Engine's figurehead (M4): a long reptile skull sculpted as one bone (prototype B's
// shapes, in sdf.js): cranium and crest, a flat snout, brow ridges over deep sockets, cheek arches, a lower
// jaw under a dark mouth line, a row of teeth and a pair of fangs; its sockets and hollows washed dark (the
// field's own occlusion, and the sockets painted), so at 28 px it is still two dark eyes, a crest and a
// jaw, not an egg
function skullGeometry(D) {
  const parts = [
    [sdfEllipsoid([0, 0.58, 0.66], [0.148, 0.1, 0.16]), 0], // the cranium, flat-topped
    [sdfEllipsoid([0, 0.655, 0.62], [0.022, 0.05, 0.17], -0.1), 0.03], // the crest, low, running back
    [sdfEllipsoid([0, 0.55, 0.87], [0.098, 0.058, 0.19], 0.1), 0.07], // the snout, long and flat
    ...[-1, 1].map((s) => [sdfEllipsoid([s * 0.092, 0.628, 0.8], [0.046, 0.014, 0.09], -0.1), 0.06]), // brow ridges
    ...[-1, 1].map((s) => [roundCone([s * 0.137, 0.535, 0.64], [s * 0.11, 0.52, 0.88], 0.03, 0.022), 0.04]), // cheek arches
    ...[-1, 1].map((s) => [roundCone([s * 0.12, 0.6, 0.6], [s * 0.215, 0.575, 0.44], 0.03, 0.006), 0.035]), // horns, swept out and back from the temples
    [sdfEllipsoid([0, 0.452, 0.8], [0.108, 0.032, 0.18], 0.06), 0.006], // the lower jaw
  ]
  const sockets = [-1, 1].map((s) => sdfEllipsoid([s * 0.112, 0.6, 0.835], [0.062, 0.052, 0.066]))
  const nostrils = [-1, 1].map((s) => sdfEllipsoid([s * 0.035, 0.585, 1.035], [0.016, 0.013, 0.03]))
  const teeth = []
  for (const s of [-1, 1]) {
    teeth.push(roundCone([s * 0.072, 0.5, 0.98], [s * 0.069, 0.37, 1.0], 0.025, 0.003)) // the fangs
    for (let i = 0; i < 4; i++) {
      const z = 0.91 - i * 0.065, x = s * (0.088 + i * 0.008)
      teeth.push(roundCone([x, 0.5, z], [x, 0.445, z + 0.004], 0.014, 0.003))
    }
  }
  // (each group behind a bounding box: a point far from it takes the box's distance, a lower bound that
  // only matters where it is far from zero, so the surface is the same)
  const boxd = (x, y, z, lo, hi) => Math.hypot(Math.max(lo[0] - x, 0, x - hi[0]), Math.max(lo[1] - y, 0, y - hi[1]), Math.max(lo[2] - z, 0, z - hi[2]))
  const sock = (x, y, z) => {
    const b = boxd(Math.abs(x), y, z, [0.05, 0.548, 0.769], [0.174, 0.652, 0.901])
    return b > 0.04 ? b : Math.min(sockets[0](x, y, z), sockets[1](x, y, z))
  }
  const tooth = (x, y, z) => {
    const b = boxd(Math.abs(x), y, z, [0.045, 0.367, 0.69], [0.135, 0.53, 1.03])
    if (b > 0.03) return b
    let d = Infinity
    for (let i = 0; i < teeth.length; i++) d = Math.min(d, teeth[i](x, y, z))
    return d
  }
  // (plain indexed loops: the field is sampled ~20,000 times, mostly before the JIT has warmed up)
  const pf = parts.map((p) => p[0]), pk = parts.map((p) => p[1]), np = parts.length
  const F = (x, y, z) => {
    let d = pf[0](x, y, z)
    for (let i = 1; i < np; i++) d = smin(d, pf[i](x, y, z), pk[i])
    d = smax(d, -sock(x, y, z), 0.022)
    d = smax(d, -Math.min(nostrils[0](x, y, z), nostrils[1](x, y, z)), 0.012)
    return smin(d, tooth(x, y, z), 0.01)
  }
  const boneC = col('#e6dab4'), aged = col('#9a8658'), ivory = col('#f7f0de'), pit = col('#231a10')
  const h = D >= 0.75 ? 0.02 : D >= 0.45 ? 0.026 : 0.042
  return fieldGeometry(F, [-0.2, 0.35, 0.4], [0.2, 0.74, 1.075], h, (x, y, z, ao, out) => {
    out.copy(boneC).lerp(aged, Math.min(1, smooth(y, 0.56, 0.42) * 0.55 + smooth(z, 0.7, 0.5) * 0.5))
    // the sockets dark to their rims, and the mouth's line
    out.lerp(pit, smooth(sock(x, y, z), 0.03, 0.004) * 0.92)
    out.lerp(pit, (1 - smooth(Math.abs(y - 0.482), 0.006, 0.016)) * smooth(Math.abs(x), 0.03, 0.06) * 0.7)
    out.lerp(ivory, smooth(tooth(x, y, z), 0.004, 0.0))
    out.multiplyScalar(0.3 + 0.7 * ao)
  }, { step: 0.013, taps: 4, strength: 1.8 }, 1, true)
}

// ── The six units ──────────────────────────────────────────────────────────
const BUILD = {
  scaleguard(D) {
    const m = naga({ scale: '#3f8f4a', belly: '#d9cf86', pattern: { kind: 'zigzag', dark: 0.4, period: 0.16 }, detail: D })
    const a = m.userData.anim
    const brass = polished('#b8862e')
    // the helmet: a dome with a rolled lip, and a crest
    const dome = part(lathe([[0, 1], [0.38, 0.93], [0.7, 0.72], [0.9, 0.43], [0.99, 0.12], [1.03, 0.0], [1.1, -0.03], [1.13, -0.08], [1.06, -0.1], [0.98, -0.03], [0.6, -0.02], [0, -0.02]], RES(D, 24, 8)), brass, 0, 0.05, 0.005, 0.118, 0.09, 0.142)
    // (set high and tipped back, so the eyes clear its brim from the table's camera)
    const helm = new THREE.Group()
    helm.add(dome, part(ridgeFin(D), brass, 0, 0.125, -0.02))
    helm.rotation.x = -0.3
    helm.position.set(0, 0.03, -0.028)
    a.head.add(helm)
    hold(a.armR, spear(D, 1.15), 0.9)
    const sh = roundShield(D, 0.2, '#b07e36', '#e0b050')
    hold(a.armL, sh, 0.9)
    sh.position.z = 0.06
    a.armL.rotation.set(-0.7, 0, 0.35)
    return m
  },
  spitter(D) {
    const m = naga({ scale: '#2f8f86', belly: '#e0d890', hood: '#5a2f7a', hoodSize: 1.45, hoodLift: 0.03, pattern: { kind: 'bands', color: '#16504b', period: 0.13 }, detail: D })
    const a = m.userData.anim
    // venom beading at the mouth
    a.head.add(part(new THREE.SphereGeometry(1, RES(D, 16, 6), RES(D, 12, 4)), glow('#8aff5a'), 0, -0.04, 0.16, 0.03, 0.036, 0.03))
    // the venom gourd at the hip, and its glowing stopper
    const gourd = part(lathe([[0, -0.1], [0.05, -0.092], [0.078, -0.06], [0.08, -0.02], [0.062, 0.03], [0.04, 0.062], [0.034, 0.085], [0.036, 0.1], [0, 0.1]], RES(D, 18, 6)), lacquer('#7a8a3a'), 0.17, 0.38, 0.05)
    a.body.add(gourd)
    a.body.add(part(new THREE.SphereGeometry(1, RES(D, 14, 6), RES(D, 10, 4)), glow('#8aff5a'), 0.17, 0.485, 0.05, 0.03))
    a.armL.rotation.x = -0.5
    a.armR.rotation.x = -0.5
    return m
  },
  sidewinder(D) {
    const m = naga({ scale: '#c2a061', belly: '#efe0b0', long: true, pattern: { kind: 'diamonds', color: '#8a6234', period: 0.15 }, detail: D, grip: true })
    const a = m.userData.anim
    const ridgeM = lacquer('#6b4a2a')
    const rg = ridge(D, 0.04, 0.03, 0.04)
    // (along the back of the rising body, where serpent.js's sat behind the old one)
    for (let i = 0; i < 6; i++) {
      const y = 0.27 + i * 0.066, [z, r] = m.userData.backAt(y)
      a.body.add(part(rg, ridgeM, 0, y, z - r + 0.008))
    }
    a.armL.rotation.set(-1.3, 0, 0.3)
    a.armR.rotation.set(-1.3, 0, -0.3)
    a.body.rotation.x = 0.12
    // a sickle: a short wooden grip held in the fist, and a crescent blade from its top end (a tapering
    // tube flattened into a blade, polished steel), in the blade's own frame: y up, z forward, its root at
    // the origin. It rises from the grip leaning outward, arches over toward the front and hooks down to its
    // point (a sickle's "?"), so the pair splays out either side of the chest, held up ready (with the
    // whole sickle along the forearm's tilt it drooped like a hook; laid flat it read as a hoop)
    const R = 0.092, lean = 0.6, gripLen = 0.075
    const sickleBlade = (o) => {
      // (o: which way along x is outward)
      const U = new THREE.Vector3(o * Math.sin(lean), Math.cos(lean), 0), W = new THREE.Vector3(0, 0, 1)
      const arc = new THREE.CatmullRomCurve3(Array.from({ length: 9 }, (_, i) => {
        const t = (i / 8) * Math.PI * 0.9
        return new THREE.Vector3(0, -0.006, 0).addScaledVector(U, R * Math.sin(t)).addScaledVector(W, R * (1 - Math.cos(t)))
      }))
      const g = sweepSimple(arc, (t) => 0.0025 + 0.016 * Math.pow(1 - t, 0.6) * (0.7 + 0.3 * smooth(t, 0, 0.25)), RES(D, 8, 4), RES(D, 24, 8), true)
      // (flattened across the crescent's plane: a blade)
      const n = new THREE.Vector3().crossVectors(U, W).normalize(), k = 0.32 - 1
      const e = new THREE.Matrix4().set(1 + k * n.x * n.x, k * n.x * n.y, k * n.x * n.z, 0, k * n.y * n.x, 1 + k * n.y * n.y, k * n.y * n.z, 0, k * n.z * n.x, k * n.z * n.y, 1 + k * n.z * n.z, 0, 0, 0, 0, 1)
      return vertexNormals(g.applyMatrix4(e))
    }
    const bladeM = polished('#c8ccd0', { roughness: 0.15 }), gripM = wood()
    // (the grip along the hand's x: a cylinder's y turned onto x)
    const gripGeo = new THREE.CylinderGeometry(0.0145, 0.0155, gripLen, RES(D, 10, 5)).rotateZ(Math.PI / 2)
    const q = new THREE.Quaternion(), X = new THREE.Vector3(), Y = new THREE.Vector3(), Z = new THREE.Vector3(), basis = new THREE.Matrix4()
    for (const s of [-1, 1]) {
      // the horns over the eyes: curved, smooth
      const A = [s * 0.05, 0.05, 0.05], Bp = [s * 0.085, 0.12, 0.035]
      a.head.add(new THREE.Mesh(hornTint(horn(A, Bp, 0.02, [s * 0.012, 0, -0.01], RES(D, 10, 5), RES(D, 8, 3)), '#a8844c', A, Bp), hornM()))
      // held in the fist: the hand turned a quarter about its forearm (thumb up), so its three claws stack
      // up the grip (naga's `grip` claws, wrapped round it toward the midline); the grip runs through them
      // along the hand's own x (upright, leaning a little forward as the forearm reaches down), and the
      // blade sets off from its top end upright in the figure's frame, toward the front and a little out
      const arm = s < 0 ? a.armL : a.armR, hand = arm.userData.hand
      hand.rotation.y = -s * Math.PI / 2
      m.updateMatrixWorld(true)
      const wq = hand.getWorldQuaternion(new THREE.Quaternion())
      const upX = new THREE.Vector3(1, 0, 0).applyQuaternion(wq).y > 0 ? 1 : -1
      hand.add(part(gripGeo, gripM, ...GRIP))
      q.copy(wq).invert()
      Y.set(0, 1, 0).applyQuaternion(q)
      Z.set(s * 0.3, 0, 1).applyQuaternion(q)
      Z.addScaledVector(Y, -Z.dot(Y)).normalize()
      X.crossVectors(Y, Z)
      // (X = Y x Z: the figure's right, so outward is -X on its left hand)
      const blade = new THREE.Mesh(sickleBlade(s), bladeM)
      blade.position.set(GRIP[0] + (upX * gripLen) / 2, GRIP[1], GRIP[2])
      blade.quaternion.setFromRotationMatrix(basis.makeBasis(X, Y, Z))
      hand.add(blade)
    }
    return m
  },
  brute(D) {
    const m = naga({ scale: '#4f6e2a', belly: '#c8b870', thick: 1.35, pattern: { kind: 'saddles', dark: 0.42, period: 0.16 }, detail: D })
    const a = m.userData.anim
    m.scale.setScalar(2.15)
    // (old horn, darker and warmer than its tusks: today's spikes are e8dcc0 too, but matte)
    // the dorsal spikes: a row up the middle of the back, each set ON the tube's spine where it is (the
    // torso tapers into the neck, so a fixed z left the upper ones hanging behind it), sunk a little so its
    // base is buried, and raked back and up from the surface's normal as today's are; the row stops below
    // the head
    const spikeGeo = hornTint(lathe([[0.024, -0.012], [0.022, 0], [0.021, 0.016], [0.0154, 0.044], [0.0077, 0.068], [0, 0.08]], RES(D, 12, 5)), '#b9a679', [0, 0, 0], [0, 0.08, 0])
    const spikeM = spineM(), up = new THREE.Vector3(0, 1, 0)
    for (let i = 0; i < 7; i++) {
      const { p, n } = m.userData.spineAt(0.4 + i * 0.05)
      const dir = n.clone().addScaledVector(up, 0.32).normalize()
      const sp = part(spikeGeo, spikeM, ...p.addScaledVector(n, -0.004).toArray())
      sp.quaternion.setFromUnitVectors(up, dir)
      a.body.add(sp)
    }
    for (const s of [-1, 1]) {
      // horns sweeping back from the brow
      const A = [s * 0.06, 0.05, -0.01], Bp = [s * 0.15, 0.12, -0.12]
      // (satin horn as the spikes, a shade paler: lacquered cream they were the figure's brightest pixels)
      a.head.add(new THREE.Mesh(hornTint(horn(A, Bp, 0.03, [s * 0.03, 0.05, 0.02], RES(D, 12, 5), RES(D, 12, 4)), '#d6c59a', A, Bp), spineM()))
      a.body.add(part(new THREE.TorusGeometry(0.06, 0.015, RES(D, 10, 3), RES(D, 28, 8)).rotateX(Math.PI / 2), polished('#b8862e'), s * 0.2, 0.5, 0.05))
    }
    a.armL.rotation.set(-1.2, 0, 0.5)
    a.armR.rotation.set(-1.2, 0, -0.5)
    return m
  },
  engine(D) {
    const root = new THREE.Group()
    const bodyG = new THREE.Group()
    root.add(bodyG)
    const W = satin('#4a3a2a'), Wd = satin('#3a2c20')
    bodyG.add(part(new RoundedBoxGeometry(0.8, 0.22, 1.35, RES(D, 3, 1), 0.035), W, 0, 0.36, 0))
    // brass straps round the bed
    for (const z of [-0.5, 0, 0.5]) bodyG.add(part(new RoundedBoxGeometry(0.83, 0.235, 0.05, 1, 0.012), polished('#b8862e'), 0, 0.36, z))
    const wheels = []
    for (const s of [-1, 1]) for (const z of [-0.45, 0.45]) {
      const w = new THREE.Group()
      const tyre = part(new THREE.TorusGeometry(0.18, 0.04, RES(D, 10, 3), RES(D, 32, 9)), satin('#5a3a22'))
      tyre.rotation.y = Math.PI / 2
      const disc = part(new THREE.CylinderGeometry(0.17, 0.17, 0.07, RES(D, 28, 8)), satin('#5a3a22'))
      disc.rotation.z = Math.PI / 2
      const hub = part(lathe([[0, 0.08], [0.04, 0.075], [0.062, 0.05], [0.068, 0.0], [0.068, -0.08], [0, -0.08]], RES(D, 16, 5)), polished('#8a8f96'))
      hub.rotation.z = -s * Math.PI / 2
      w.add(tyre, disc, hub)
      w.position.set(s * 0.47, 0.21, z)
      bodyG.add(w)
      wheels.push(w)
    }
    // the basilisk figurehead, and its glowing eyes deep in the sockets
    const skull = new THREE.Mesh(skullGeometry(D), lacquer('#ffffff', { vertexColors: true, roughness: 0.42, clearcoatRoughness: 0.14 }))
    bodyG.add(skull)
    for (const s of [-1, 1]) bodyG.add(part(new THREE.SphereGeometry(1, RES(D, 14, 6), RES(D, 10, 4)), glow('#8aff5a'), s * 0.104, 0.6, 0.848, 0.03))
    // the throwing arm and its glowing globe
    for (const s of [-1, 1]) bodyG.add(rod([s * 0.3, 0.45, -0.3], [s * 0.2, 1.05, -0.1], 0.04, Wd))
    const axle = part(new THREE.CylinderGeometry(0.03, 0.03, 0.5, RES(D, 12, 5)), polished('#8a8f96'), 0, 1.05, -0.1)
    axle.rotation.z = Math.PI / 2
    bodyG.add(axle)
    const arm = new THREE.Group()
    arm.position.set(0, 1.05, -0.1)
    arm.add(part(new RoundedBoxGeometry(0.08, 0.08, 0.9, RES(D, 2, 1), 0.02), W, 0, 0, 0.35))
    // an open bowl, seen from its open side: draw the inside too
    const bowl = part(lathe([[0.0, -0.08], [0.06, -0.075], [0.11, -0.05], [0.14, -0.01], [0.15, 0.01], [0.135, 0.005], [0.1, -0.035], [0.05, -0.058], [0, -0.062]], RES(D, 20, 7)), Wd, 0, 0.06, 0.8)
    arm.add(bowl)
    const globe = part(new THREE.SphereGeometry(1, RES(D, 28, 10), RES(D, 20, 7)), glow('#7dff5a', { emissive: '#4ad02a', emissiveIntensity: 1.1, transparent: true, opacity: 0.85 }), 0, 0.12, 0.8, 0.14)
    globe.userData.keep = true
    arm.add(globe)
    arm.rotation.x = -0.55
    bodyG.add(arm)
    for (let i = 0; i < 3; i++) bodyG.add(part(new THREE.SphereGeometry(1, RES(D, 18, 7), RES(D, 12, 5)), glow('#7dff5a', { emissive: '#3ab02a', emissiveIntensity: 0.9 }), -0.2 + i * 0.2, 0.55, -0.55, 0.08))
    // the crew: two scaleguard nagas, built at their final 0.72 size (their scales' frequency and level of
    // detail divided by it), so a baked crew's scales match a standalone figure's; one built, the other
    // its copy (they stand alike: Object3D.clone shares the geometry)
    const one = naga({ scale: '#3f8f4a', belly: '#d9cf86', pattern: { kind: 'zigzag', dark: 0.4, period: 0.16 }, detail: D * 0.5, sizeK: 0.72 })
    shadeNaga(one)
    foldScale(one, 0.72)
    // (the crew is a part of the machine: nothing animates it, so it carries no userData. Object3D.clone
    // copies every node's userData through JSON, and an arm's `hand` is an Object3D, which three would
    // serialise whole, geometry, materials and env map: ~20 ms, and a 0.75 MB blob left in each arm)
    one.traverse((o) => (o.userData = {}))
    for (const s of [-1, 1]) {
      const crew = s < 0 ? one : one.clone()
      crew.position.set(s * 0.72, 0.05, -0.35)
      crew.rotation.y = -s * 0.5
      bodyG.add(crew)
    }
    arm.userData.keep = true
    for (const w of wheels) w.userData.keep = true
    root.userData.anim = { kind: 'machine', body: bodyG, wheels, throwArm: arm, rest: -0.55, globe }
    return root
  },
  hierophant(D) {
    const m = naga({ scale: '#5e3a8c', belly: '#e6c870', hood: '#432068', hoodSize: 1.7, hoodLift: 0.11, pattern: { kind: 'chevrons', color: '#3f2366', period: 0.11 }, detail: D, iridescence: 0.5 })
    const a = m.userData.anim
    m.scale.setScalar(1.32)
    const gold = polished('#e0b040'), crown = coneGeo(D, 0.02, 0.12)
    for (let i = 0; i < 5; i++) {
      const t = (i / 4 - 0.5) * 1.6
      const sp = part(crown, gold)
      sp.position.set(Math.sin(t) * 0.1, 0.06 + Math.cos(t) * 0.04, -0.02)
      sp.rotation.z = -t * 0.5
      a.head.add(sp)
    }
    for (const s of [-1, 1]) a.body.add(part(new THREE.TorusGeometry(0.05, 0.014, RES(D, 10, 3), RES(D, 26, 8)).rotateX(Math.PI / 2), gold, s * 0.15, 0.45, 0.05))
    const staff = new THREE.Group()
    staff.add(part(new THREE.CylinderGeometry(0.02, 0.024, 1.0, RES(D, 12, 5)), lacquer('#2a1a40'), 0, 0.25, 0))
    const gem = part(new THREE.SphereGeometry(1, RES(D, 24, 8), RES(D, 18, 6)), glow('#c070ff'), 0, 0.82, 0, 0.08)
    staff.add(gem)
    staff.add(part(new THREE.TorusGeometry(0.1, 0.012, RES(D, 10, 3), RES(D, 36, 10)), gold, 0, 0.82, 0))
    staff.add(part(lathe([[0.024, 0], [0.03, 0.02], [0.026, 0.05], [0.016, 0.07]], RES(D, 12, 5)), gold, 0, 0.73, 0))
    hold(a.armL, staff, 0.9)
    a.armL.rotation.x = -0.6
    a.gem = gem
    a.gem.userData.keep = true
    return m
  },
}
// the scaleguard's crest: a fin
function ridgeFin(D) {
  return blob(RES(D, 8, 2), (v, d) => {
    const h = 0.04 * (1 - 0.35 * smooth(-d.z, 0.2, 1))
    v.set(d.x * 0.011, d.y * h, d.z * 0.105)
    if (v.y < 0) v.y *= 0.4
  })
}

// Build a group at `s` times its size without a scale on it: every descendant's offset and geometry
// scaled instead (a uniform scale commutes with every rotation below it), so its parts' object space is
// the figure's own and a bake carries no scale into the skin shader's pattern.
function foldScale(g, s) {
  const done = new Map()
  g.traverse((o) => {
    if (o === g) return
    o.position.multiplyScalar(s)
    if (o.isMesh) {
      if (!done.has(o.geometry)) {
        const c = o.geometry.clone().scale(s, s, s)
        c.userData = { ...o.geometry.userData }
        done.set(o.geometry, c)
      }
      o.geometry = done.get(o.geometry)
    }
  })
}
// Fold every mesh's own scale (part()'s) into its geometry, so a mesh's model matrix carries only its
// figure's scale: the shader's level of detail reads it as "how big is this figure on screen".
function unscaleParts(root) {
  const done = new Map(), M = new THREE.Matrix4()
  root.traverse((o) => {
    if (!o.isMesh || o.children.length) return
    const { x, y, z } = o.scale
    if (x === 1 && y === 1 && z === 1) return
    if (x <= 0 || y <= 0 || z <= 0) throw new Error('serpents.js: a mirrored part')
    const key = `${o.geometry.uuid}|${x}|${y}|${z}`
    if (!done.has(key)) {
      const c = o.geometry.clone().applyMatrix4(M.makeScale(x, y, z))
      c.userData = { ...o.geometry.userData }
      done.set(key, c)
    }
    o.geometry = done.get(key)
    o.scale.set(1, 1, 1)
  })
}

export const KEYS = Object.keys(BUILD)
export function buildSerpent(key, opts = {}) {
  if (!Object.hasOwn(BUILD, key)) throw new Error(`no serpent "${key}": ${KEYS.join(', ')}`)
  const t0 = performance.now()
  const group = BUILD[key](opts.detail ?? 1)
  // (occlusion once the unit has posed its arms)
  const nagas = []
  group.traverse((o) => o.userData.ao && nagas.push(o))
  for (const n of nagas) shadeNaga(n)
  unscaleParts(group)
  group.traverse((o) => {
    if (!o.isMesh) return
    o.castShadow = true
    // every skin mesh carries its plain colour (the shader fades the markings toward it)
    if (o.material.userData.shader?.plain) withPlain(o.geometry)
  })
  return { group, triangles: triangles(group), ms: performance.now() - t0 }
}
