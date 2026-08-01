import * as THREE from 'three'
import {
  sweep,
  ellipseProfile,
  smoothPath,
  panelSurface,
  horn,
  noisify,
  xform,
  mergeAll,
} from './geometry.js'
import { restPositions, GROUPS } from './rig.js'
import { noise3, fbm3, clamp01, smoothstep, makeRng } from './noise.js'

// ---------------------------------------------------------------------------
// The goblin's flesh
//
// Everything here is generated in the *bind pose* (world space, feet at y = 0,
// facing +Z) and handed to the skin solver as a list of parts. Limbs are
// sweeps along the bone rest positions with hand-authored radius curves; the
// skull is a sculpted icosphere; hands, feet, ears and tail are assembled from
// the same two tools.
// ---------------------------------------------------------------------------

const REST = restPositions()
const P = (name) => REST[name].clone()

/**
 * Piecewise-smooth scalar curve from [t, value] stops — the language limb
 * silhouettes are written in below.
 */
function curveFn(stops) {
  return (t) => {
    if (t <= stops[0][0]) return stops[0][1]
    for (let i = 1; i < stops.length; i++) {
      if (t <= stops[i][0]) {
        const [t0, v0] = stops[i - 1]
        const [t1, v1] = stops[i]
        const k = smoothstep(t0, t1, t)
        return v0 + (v1 - v0) * k
      }
    }
    return stops[stops.length - 1][1]
  }
}

/** Path through a list of bone rest positions, resampled smooth. */
function bonePath(names, samples = 20, extra = {}) {
  const pts = names.map((n) => (n instanceof THREE.Vector3 ? n.clone() : P(n)))
  if (extra.prepend) pts.unshift(extra.prepend)
  if (extra.append) pts.push(extra.append)
  return smoothPath(pts, samples, extra.tension ?? 0.5)
}

// ---------------------------------------------------------------------------
// Torso
// ---------------------------------------------------------------------------

/**
 * For a sweep running up +Y the frame puts profile.x on +Z (front) and
 * profile.y on +X (the goblin's left). This builds a cross-section in those
 * terms: an ellipse plus a belly push, a spine ridge and rib flattening.
 */
function torsoSection(depth, width, { frontBias = 0, ridge = 0, flatten = 0, segments = 24 } = {}) {
  const pts = []
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2
    const c = Math.cos(a)
    const s = Math.sin(a)
    let x = c * depth
    let y = s * width
    // Flatten the back (behind = -Z = negative x here) into a slab.
    if (flatten && c < 0) x *= 1 - flatten * (-c) ** 1.5
    // A knobbly spine ridge riding the centre of the back.
    if (ridge) x -= ridge * Math.exp(-((s / 0.32) ** 2)) * (c < 0 ? 1 : 0)
    pts.push(new THREE.Vector2(x + frontBias, y))
  }
  return pts
}

/**
 * The torso spine and its silhouette curves live at module scope because the
 * gear layer needs them too: belts, straps and plates have to hug exactly the
 * surface the flesh sweep produced, or they float and clip.
 */
export const TORSO = (() => {
  const path = bonePath(
    [new THREE.Vector3(0, 0.5, -0.005), 'hips', 'spine01', 'spine02', 'chest', 'neck'],
    30,
  )
  const depth = curveFn([
    [0, 0.055],
    [0.12, 0.086],
    [0.3, 0.098],
    [0.46, 0.084],
    [0.62, 0.098],
    [0.78, 0.093],
    [0.92, 0.062],
    [1, 0.042],
  ])
  const width = curveFn([
    [0, 0.07],
    [0.12, 0.104],
    [0.3, 0.108],
    [0.46, 0.096],
    [0.62, 0.128],
    [0.8, 0.142],
    [0.92, 0.07],
    [1, 0.046],
  ])
  const belly = curveFn([
    [0.1, 0],
    [0.32, 0.022],
    [0.55, 0.004],
    [1, -0.004],
  ])
  const ridge = curveFn([
    [0.05, 0.004],
    [0.4, 0.012],
    [0.75, 0.016],
    [1, 0.006],
  ])

  // Height -> parameter, so gear can ask "how wide is the body at y = 0.8?".
  const yAt = path.map((p) => p.y)
  const tAtY = (y) => {
    if (y <= yAt[0]) return 0
    for (let i = 1; i < yAt.length; i++) {
      if (y <= yAt[i]) return (i - 1 + (y - yAt[i - 1]) / (yAt[i] - yAt[i - 1] || 1)) / (yAt.length - 1)
    }
    return 1
  }
  return { path, depth, width, belly, ridge, tAtY }
})()

function buildTorso() {
  const { path, depth, width, belly, ridge } = TORSO
  const geo = sweep({
    path,
    profile: (t) =>
      torsoSection(depth(t), width(t), {
        frontBias: belly(t),
        ridge: ridge(t),
        flatten: 0.22 * smoothstep(0.35, 0.8, t),
      }),
    uvScale: [1.6, 2.2],
  })
  // Sinew and rib relief. The mask keeps the belly smooth and the ribcage
  // bumpy — a uniform noise pass just reads as "dirty".
  noisify(geo, {
    amp: 0.006,
    freq: 26,
    seed: 4,
    mask: (v) => 0.35 + 0.65 * smoothstep(0.66, 0.9, v.y) * (v.z < 0 ? 0.7 : 1),
  })
  return geo
}

/** Shoulder and hip masses that blend the limb sweeps into the trunk. */
function buildJoints() {
  const geos = []
  for (const s of [1, -1]) {
    const sh = P(s > 0 ? 'upperarmL' : 'upperarmR')
    geos.push(
      xform(new THREE.SphereGeometry(0.062, 18, 14), {
        pos: sh.clone().add(new THREE.Vector3(-0.012 * s, 0.004, -0.004)),
        scale: [1, 0.95, 1.05],
      }),
    )
    const hip = P(s > 0 ? 'thighL' : 'thighR')
    geos.push(
      xform(new THREE.SphereGeometry(0.062, 16, 12), {
        pos: hip.clone().add(new THREE.Vector3(0.004 * s, 0.012, 0)),
        scale: [1, 1.1, 1],
      }),
    )
  }
  const g = mergeAll(geos)
  noisify(g, { amp: 0.003, freq: 30, seed: 9 })
  return g
}

// ---------------------------------------------------------------------------
// Head — a sculpted icosphere
// ---------------------------------------------------------------------------

/**
 * Displace a unit icosphere by a radius function of direction, then give it
 * spherical UVs with the wrap seam repaired per triangle (three's polyhedron
 * geometries are non-indexed, so the fix is local and exact).
 */
function sculptSphere(detail, radiusFn) {
  const geo = new THREE.IcosahedronGeometry(1, detail)
  const pos = geo.attributes.position
  const dir = new THREE.Vector3()
  const out = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    dir.fromBufferAttribute(pos, i).normalize()
    radiusFn(dir, out)
    pos.setXYZ(i, out.x, out.y, out.z)
  }
  const uv = new Float32Array(pos.count * 2)
  for (let i = 0; i < pos.count; i++) {
    dir.fromBufferAttribute(pos, i).normalize()
    uv[i * 2] = Math.atan2(dir.x, dir.z) / (Math.PI * 2) + 0.5
    uv[i * 2 + 1] = Math.asin(THREE.MathUtils.clamp(dir.y, -1, 1)) / Math.PI + 0.5
  }
  for (let t = 0; t < pos.count; t += 3) {
    const u0 = uv[t * 2]
    const u1 = uv[(t + 1) * 2]
    const u2 = uv[(t + 2) * 2]
    const min = Math.min(u0, u1, u2)
    const max = Math.max(u0, u1, u2)
    if (max - min > 0.5) {
      for (let k = 0; k < 3; k++) {
        const idx = (t + k) * 2
        if (uv[idx] < 0.5) uv[idx] += 1
      }
    }
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2))
  geo.computeVertexNormals()
  return geo
}

/** Smooth-min: blends sculpting features instead of creasing them together. */
const smin = (a, b, k) => {
  const h = clamp01(0.5 + (0.5 * (b - a)) / k)
  return b * (1 - h) + a * h - k * h * (1 - h)
}

function buildCranium() {
  const origin = P('head')
  const geo = sculptSphere(4, (d, out) => {
    const { x, y, z } = d
    // Base skull: tall, narrow, back-heavy braincase.
    let r = 0.082
    r += 0.028 * smoothstep(0.1, 1, y) // domed crown
    r += 0.016 * smoothstep(0.2, 1, -z) * smoothstep(-0.4, 0.6, y) // occipital shelf
    r -= 0.014 * smoothstep(0.3, 1, Math.abs(x)) * smoothstep(0.1, 1, y) // temple pinch
    // Brow ridge: a heavy horizontal bar over the eyes.
    const brow = Math.exp(-(((y - 0.22) / 0.16) ** 2) - ((Math.abs(x) - 0.34) / 0.34) ** 2) * smoothstep(0.1, 0.6, z)
    r += 0.022 * brow
    // Snout / hooked nose, pushed forward and down.
    const snout = Math.exp(-(((y + 0.06) / 0.3) ** 2) - (x / 0.3) ** 2) * smoothstep(0.25, 1, z)
    r += 0.05 * snout
    const nose = Math.exp(-(((y + 0.02) / 0.12) ** 2) - (x / 0.14) ** 2) * smoothstep(0.55, 1, z)
    r += 0.024 * nose
    // Cheekbones, then a hollow under them — the gaunt look.
    const cheek = Math.exp(-(((y + 0.12) / 0.16) ** 2) - ((Math.abs(x) - 0.6) / 0.3) ** 2) * smoothstep(0, 0.9, z)
    r += 0.016 * cheek
    r -= 0.013 * Math.exp(-(((y + 0.36) / 0.18) ** 2) - ((Math.abs(x) - 0.55) / 0.26) ** 2) * smoothstep(0.1, 1, z)
    // Eye sockets: two spherical scoops, blended in with smin so the rims
    // stay rounded rather than knife-edged.
    for (const s of [1, -1]) {
      const dx = x - s * 0.42
      const dy = y - 0.06
      const dz = z - 0.78
      const d2 = dx * dx + dy * dy + dz * dz
      r = smin(r, r - 0.03 * Math.exp(-d2 / 0.05), 0.012)
    }
    // The cranium stops at the jawline; the mandible is a separate piece.
    r *= 1 - 0.28 * smoothstep(-0.45, -0.95, y)
    // Pores and lumps.
    r += (fbm3(x * 9 + 5, y * 9, z * 9, 3) - 0.5) * 0.006
    r += (noise3(x * 34, y * 34, z * 34) - 0.5) * 0.0025
    out.set(x * r, y * r * 1.06, z * r).add(origin)
    out.z += 0.004
  })
  return geo
}

function buildMandible() {
  const jaw = P('jaw')
  const geo = sculptSphere(3, (d, out) => {
    const { x, y, z } = d
    let r = 0.05
    r += 0.03 * smoothstep(0, 1, z) * smoothstep(-0.9, 0.2, y) // chin thrust
    r += 0.012 * smoothstep(0.3, 1, Math.abs(x)) * smoothstep(-0.6, 0.4, y) // jaw corners
    r -= 0.018 * smoothstep(0.1, 1, y) // flat top where it meets the skull
    r += (fbm3(x * 11 + 21, y * 11, z * 11, 3) - 0.5) * 0.005
    out.set(x * r * 1.12, y * r * 0.72, z * r * 1.15).add(jaw)
    out.y -= 0.012
    out.z += 0.012
  })
  return geo
}

/** Eyes: a dark sclera sphere plus a bright iris cap that catches the rim light. */
function buildEyes() {
  const head = P('head')
  const sclera = []
  const iris = []
  for (const s of [1, -1]) {
    const c = head.clone().add(new THREE.Vector3(s * 0.036, 0.006, 0.062))
    sclera.push(xform(new THREE.SphereGeometry(0.0175, 16, 12), { pos: c }))
    const irisGeo = new THREE.SphereGeometry(0.0128, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.42)
    iris.push(
      xform(irisGeo, {
        pos: c.clone().add(new THREE.Vector3(s * 0.0045, 0.001, 0.0085)),
        rot: [Math.PI / 2 - 0.12, 0, 0],
      }),
    )
  }
  return { sclera: mergeAll(sclera), iris: mergeAll(iris) }
}

/** A ragged double row of teeth — uppers on the skull, lowers on the mandible. */
function buildTeeth() {
  const rng = makeRng(77)
  const upper = []
  const lower = []
  const head = P('head')
  const jaw = P('jaw')
  const arc = 9
  for (let i = 0; i < arc; i++) {
    const t = (i / (arc - 1)) * 2 - 1
    const ang = t * 0.95
    const x = Math.sin(ang) * 0.036
    const z = Math.cos(ang) * 0.055
    // Uppers hang down from the snout; the canines are the long ones.
    const canine = Math.exp(-(((Math.abs(t) - 0.55) / 0.22) ** 2))
    const hU = 0.009 + canine * 0.014 + rng() * 0.003
    upper.push(
      xform(new THREE.ConeGeometry(0.0055 + canine * 0.002, hU, 6), {
        pos: head.clone().add(new THREE.Vector3(x, -0.038 - hU / 2, z - 0.004)),
        rot: [0.18 + rng() * 0.12 - 0.06, -ang * 0.6, Math.PI + (rng() - 0.5) * 0.2],
      }),
    )
    if (i % 2 === 0 || canine > 0.4) {
      const hL = 0.011 + canine * 0.018 + rng() * 0.004
      lower.push(
        xform(new THREE.ConeGeometry(0.0055 + canine * 0.0025, hL, 6), {
          pos: jaw.clone().add(new THREE.Vector3(x * 0.94, -0.006 + hL / 2, z * 0.9 + 0.004)),
          rot: [-0.12 + (rng() - 0.5) * 0.16, -ang * 0.6, (rng() - 0.5) * 0.2],
        }),
      )
    }
  }
  return { upper: mergeAll(upper), lower: mergeAll(lower) }
}

/** Cranial horns and a brow stud — small, swept back, asymmetric. */
function buildHorns() {
  const head = P('head')
  const geos = []
  for (const s of [1, -1]) {
    const h = horn({
      length: s > 0 ? 0.085 : 0.072,
      radius: 0.014,
      curl: 1.15,
      curlAxis: new THREE.Vector3(-1, 0, 0.25 * s),
      taper: 1.35,
      twistRibs: 5,
    })
    xform(h, {
      pos: head.clone().add(new THREE.Vector3(s * 0.05, 0.075, -0.012)),
      rot: [0.35, s * 0.4, -s * 0.55],
    })
    geos.push(h)
  }
  // A couple of small spurs along the jaw hinge.
  for (const s of [1, -1]) {
    const h = horn({ length: 0.03, radius: 0.007, curl: 0.7, taper: 1.2 })
    xform(h, { pos: head.clone().add(new THREE.Vector3(s * 0.062, -0.036, -0.032)), rot: [0.6, 0, -s * 1.1] })
    geos.push(h)
  }
  return mergeAll(geos)
}

// ---------------------------------------------------------------------------
// Ears — big, membranous, and bone-driven so they flap
// ---------------------------------------------------------------------------

/**
 * An ear is a membrane, and a swept tube is the wrong tool for one: parallel
 * transport decides which way the flat face points, and on a path that climbs
 * as it goes outwards it points at the sky. So the ear is built as an explicit
 * ruled surface instead — a spine curve, an *in-plane* up vector derived from
 * world up, and a fixed sideways normal — which pins the membrane upright no
 * matter where the bone chain runs.
 */
function buildEar(side) {
  const s = side === 'L' ? 1 : -1
  const names = [`ear${side}0`, `ear${side}1`, `ear${side}2`, `ear${side}3`]
  const spine = bonePath(names, 20, {
    append: P(`ear${side}3`).clone().add(new THREE.Vector3(s * 0.018, -0.012, -0.026)),
  })

  const height = curveFn([
    [0, 0.026],
    [0.22, 0.049],
    [0.5, 0.044],
    [0.8, 0.026],
    [1, 0.005],
  ])
  const thick = curveFn([
    [0, 0.011],
    [0.35, 0.005],
    [1, 0.0022],
  ])

  const worldUp = new THREE.Vector3(0, 1, 0)
  const T = new THREE.Vector3()
  const N = new THREE.Vector3()
  const U = new THREE.Vector3()

  const frameAt = (v) => {
    const f = THREE.MathUtils.clamp(v, 0, 1) * (spine.length - 1)
    const i = Math.min(spine.length - 2, Math.floor(f))
    const p = new THREE.Vector3().lerpVectors(spine[i], spine[i + 1], f - i)
    T.subVectors(spine[i + 1], spine[i]).normalize()
    N.crossVectors(T, worldUp).normalize().multiplyScalar(s)
    U.crossVectors(N, T).normalize().multiplyScalar(s)
    return p
  }

  const surface = (u, v) => {
    const p = frameAt(v)
    const h = height(v)
    // The membrane hangs a little below the cartilage spine and rises well
    // above it, which is what gives an ear its lopsided leaf shape.
    let off = (u - 0.32) * h * 1.55
    // Chewed edge: every goblin ear has lost an argument.
    if (u > 0.9) off -= (0.5 + 0.5 * Math.sin(v * 31 + s)) * h * 0.22
    // Cup the membrane towards the front so it catches light like an ear and
    // not like a leaf.
    const cup = Math.sin(THREE.MathUtils.clamp(u, 0, 1) * Math.PI) * 0.016 * (0.35 + v)
    const n = N.clone()
    return { p: p.clone().addScaledVector(U, off).addScaledVector(N, cup), n }
  }

  const membrane = panelSurface(surface, {
    rows: 22,
    cols: 9,
    thickness: (u, v) => thick(v) * (u > 0.86 ? 1.7 : 1) * (u < 0.12 ? 1.6 : 1),
  })
  noisify(membrane, { amp: 0.0016, freq: 46, seed: side === 'L' ? 12 : 13 })

  // A cartilage spine along the base, and ribs fanning up into the membrane.
  const parts = [membrane]
  parts.push(
    sweep({
      path: spine,
      profile: (t) => ellipseProfile(thick(t) * 1.5, thick(t) * 2.2, 8),
      upHint: new THREE.Vector3(0, 1, 0),
    }),
  )
  for (let i = 0; i < 4; i++) {
    const v = 0.12 + i * 0.2
    const a = frameAt(v)
    const b = a.clone().addScaledVector(U, height(v) * 0.62).addScaledVector(N, 0.004)
    parts.push(
      sweep({
        path: smoothPath([a, a.clone().lerp(b, 0.5), b], 7),
        profile: (t) => ellipseProfile(0.0038 * (1 - t * 0.75), 0.0028 * (1 - t * 0.75), 6),
      }),
    )
  }
  return mergeAll(parts)
}

// ---------------------------------------------------------------------------
// Arms, hands, claws
// ---------------------------------------------------------------------------

function buildArm(side) {
  const s = side === 'L' ? 1 : -1
  const shoulder = P(`upperarmL`).clone()
  shoulder.x *= s
  const elbow = P('forearmL').clone()
  elbow.x *= s
  const wrist = P('handL').clone()
  wrist.x *= s

  const path = smoothPath(
    [
      shoulder.clone().add(new THREE.Vector3(-0.02 * s, 0.01, 0)),
      shoulder.clone().lerp(elbow, 0.32).add(new THREE.Vector3(0, 0.006, -0.008)),
      elbow.clone().add(new THREE.Vector3(0, -0.004, 0.006)),
      elbow.clone().lerp(wrist, 0.42).add(new THREE.Vector3(0, 0.002, -0.004)),
      wrist,
    ],
    26,
  )
  // Deltoid -> biceps -> elbow knob -> forearm belly -> narrow wrist.
  const rx = curveFn([
    [0, 0.056],
    [0.12, 0.05],
    [0.26, 0.045],
    [0.44, 0.037],
    [0.5, 0.039],
    [0.62, 0.043],
    [0.8, 0.033],
    [1, 0.022],
  ])
  const geo = sweep({
    path,
    profile: (t) => {
      const r = rx(t)
      const pts = ellipseProfile(r * 0.92, r, 14)
      // Ulnar flat along the outside of the forearm.
      if (t > 0.55) for (const p of pts) if (p.y * s < 0) p.y *= 1 - 0.18 * smoothstep(0.55, 0.9, t)
      return pts
    },
    upHint: new THREE.Vector3(0, 1, 0),
    uvScale: [1, 3],
    capStart: true,
    capEnd: false,
  })
  noisify(geo, { amp: 0.0035, freq: 30, seed: side === 'L' ? 21 : 22 })

  // Elbow spur — a little chitinous point, very goblin.
  const spur = horn({ length: 0.028, radius: 0.009, curl: 0.5, taper: 1.1 })
  const elbowDir = new THREE.Vector3().subVectors(wrist, shoulder).normalize()
  xform(spur, {
    pos: elbow.clone().addScaledVector(elbowDir, -0.012).add(new THREE.Vector3(0, -0.026, -0.01)),
    rot: [1.4, 0, s * 0.4],
  })
  return { flesh: geo, spur }
}

const FINGERS = ['thumb', 'index', 'mid', 'ring']

function buildHand(side) {
  const s = side === 'L' ? 1 : -1
  const sgn = (v) => new THREE.Vector3(v.x * s, v.y, v.z)
  const wrist = sgn(P('handL'))
  const flesh = []
  const claws = []

  // Palm: a flattened wedge spanning the wrist to the knuckles.
  const knuckleMid = sgn(P('midL0'))
  const palmPath = smoothPath(
    [
      wrist.clone().add(new THREE.Vector3(-0.01 * s, 0, 0)),
      wrist.clone().lerp(knuckleMid, 0.5),
      knuckleMid.clone().add(new THREE.Vector3(0.012 * s, 0, 0)),
    ],
    10,
  )
  const palm = sweep({
    path: palmPath,
    profile: (t) => {
      const w = 0.03 + 0.026 * smoothstep(0, 0.8, t)
      const d = 0.019 - 0.005 * t
      const pts = ellipseProfile(d, w, 14)
      // Palm side is flatter than the back of the hand.
      for (const p of pts) if (p.x < 0) p.x *= 0.72
      return pts
    },
    upHint: new THREE.Vector3(0, 1, 0),
    capEnd: false,
  })
  noisify(palm, { amp: 0.0022, freq: 44, seed: 31 })
  flesh.push(palm)

  for (const f of FINGERS) {
    const joints = [0, 1, 2].map((i) => sgn(P(`${f}L${i}`)))
    const tipDir = new THREE.Vector3().subVectors(joints[2], joints[1]).normalize()
    const tip = joints[2].clone().addScaledVector(tipDir, f === 'thumb' ? 0.022 : 0.028)
    const path = smoothPath([joints[0].clone().lerp(wrist, 0.25), ...joints, tip], 18)
    const base = f === 'thumb' ? 0.0155 : f === 'mid' ? 0.0145 : 0.0132
    const r = curveFn([
      [0, base * 1.15],
      [0.2, base],
      [0.34, base * 1.12], // knuckle
      [0.5, base * 0.88],
      [0.62, base * 0.98],
      [0.8, base * 0.74],
      [1, base * 0.4],
    ])
    const digit = sweep({
      path,
      profile: (t) => ellipseProfile(r(t) * 0.92, r(t), 10),
      upHint: new THREE.Vector3(0, 1, 0),
      uvScale: [1, 2],
      capEnd: false,
    })
    noisify(digit, { amp: 0.0016, freq: 60, seed: 41 })
    flesh.push(digit)

    // Claw: a curved, keeled talon continuing the last phalanx.
    const claw = horn({
      length: f === 'thumb' ? 0.03 : 0.034,
      radius: 0.0072,
      curl: 1.5,
      curlAxis: new THREE.Vector3(0, 0, -s),
      taper: 1.5,
      rings: 10,
      radialSegments: 7,
    })
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), tipDir)
    xform(claw, { pos: tip.clone().addScaledVector(tipDir, -0.008), quat: q })
    claws.push({ geo: claw, bone: `${f}${side}2` })
  }

  return { flesh: mergeAll(flesh), claws }
}

// ---------------------------------------------------------------------------
// Legs and feet
// ---------------------------------------------------------------------------

function buildLeg(side) {
  const s = side === 'L' ? 1 : -1
  const sgn = (v) => new THREE.Vector3(v.x * s, v.y, v.z)
  const hip = sgn(P('thighL'))
  const knee = sgn(P('shinL'))
  const ankle = sgn(P('footL'))

  const path = smoothPath(
    [
      hip.clone().add(new THREE.Vector3(0, 0.03, 0)),
      hip.clone().lerp(knee, 0.4).add(new THREE.Vector3(0, 0, 0.006)),
      knee.clone().add(new THREE.Vector3(0, 0, -0.004)),
      knee.clone().lerp(ankle, 0.35).add(new THREE.Vector3(0, 0, -0.012)),
      ankle.clone().add(new THREE.Vector3(0, 0.01, 0.004)),
    ],
    26,
  )
  // Heavy thigh, knobbly knee, a big calf high on the shin (digitigrade legs
  // carry their mass up top), then a wire-thin ankle.
  const r = curveFn([
    [0, 0.062],
    [0.16, 0.058],
    [0.34, 0.046],
    [0.46, 0.041],
    [0.54, 0.045],
    [0.66, 0.04],
    [0.84, 0.026],
    [1, 0.019],
  ])
  const geo = sweep({
    path,
    profile: (t) => {
      const rr = r(t)
      const pts = ellipseProfile(rr, rr * 0.94, 14)
      // Calf bulge on the back of the shin.
      const calf = Math.exp(-(((t - 0.6) / 0.12) ** 2)) * 0.012
      if (calf > 0.0005) for (const p of pts) if (p.x < 0) p.x -= calf * (-p.x / rr)
      return pts
    },
    upHint: new THREE.Vector3(0, 0, 1),
    uvScale: [1, 3],
    capEnd: false,
  })
  noisify(geo, { amp: 0.0035, freq: 26, seed: side === 'L' ? 51 : 52 })
  return geo
}

function buildFoot(side) {
  const s = side === 'L' ? 1 : -1
  const sgn = (v) => new THREE.Vector3(v.x * s, v.y, v.z)
  const ankle = sgn(P('footL'))
  const ball = sgn(P('toeL'))
  const heel = sgn(P('heelL'))
  const flesh = []
  const claws = []

  // Metatarsal wedge from the ankle down to the ball of the foot.
  const foot = sweep({
    path: smoothPath([ankle.clone().add(new THREE.Vector3(0, 0.012, -0.006)), ankle.clone().lerp(ball, 0.55), ball], 12),
    profile: (t) => {
      const w = 0.024 + 0.016 * t
      const d = 0.026 - 0.008 * t
      return ellipseProfile(d, w, 12)
    },
    upHint: new THREE.Vector3(0, 0, 1),
    capEnd: false,
  })
  flesh.push(foot)

  // Heel spur — the raised back of a digitigrade foot.
  flesh.push(
    sweep({
      path: smoothPath([ankle.clone().add(new THREE.Vector3(0, -0.004, -0.004)), heel.clone().lerp(ankle, 0.3), heel], 10),
      profile: (t) => ellipseProfile(0.021 * (1 - t * 0.55), 0.019 * (1 - t * 0.5), 10),
      upHint: new THREE.Vector3(0, 1, 0),
    }),
  )

  // Three forward toes plus a small inner dew-claw.
  const toes = [
    { off: [0.026, 0, 0.055], len: 0.052, r: 0.013, bone: `toe${side}` },
    { off: [0.0, 0, 0.062], len: 0.058, r: 0.014, bone: `toe${side}` },
    { off: [-0.026, 0, 0.05], len: 0.048, r: 0.012, bone: `toe${side}` },
  ]
  for (const toe of toes) {
    const a = ball.clone()
    const b = ball.clone().add(new THREE.Vector3(toe.off[0] * s, -0.004, toe.off[2]))
    const dir = new THREE.Vector3().subVectors(b, a).normalize()
    const end = b.clone().addScaledVector(dir, toe.len * 0.55)
    flesh.push(
      sweep({
        path: smoothPath([a, b, end], 10),
        profile: (t) => ellipseProfile(toe.r * (1 - t * 0.45), toe.r * (1 - t * 0.4), 9),
        upHint: new THREE.Vector3(0, 1, 0),
        capEnd: false,
      }),
    )
    const claw = horn({
      length: 0.03,
      radius: 0.0075,
      curl: 1.2,
      curlAxis: new THREE.Vector3(-s, 0, 0),
      taper: 1.5,
      rings: 10,
      radialSegments: 7,
    })
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
    xform(claw, { pos: end.clone().addScaledVector(dir, -0.006), quat: q })
    claws.push({ geo: claw, bone: toe.bone })
  }

  const g = mergeAll(flesh)
  noisify(g, { amp: 0.002, freq: 38, seed: side === 'L' ? 61 : 62 })
  return { flesh: g, claws }
}

// ---------------------------------------------------------------------------
// Tail
// ---------------------------------------------------------------------------

function buildTail() {
  const names = ['tail0', 'tail1', 'tail2', 'tail3', 'tail4']
  const tip = P('tail4').clone().add(new THREE.Vector3(0, -0.03, -0.06))
  const path = bonePath([P('hips').clone().add(new THREE.Vector3(0, -0.02, -0.03)), ...names, tip], 26)
  const r = curveFn([
    [0, 0.05],
    [0.15, 0.038],
    [0.45, 0.026],
    [0.75, 0.015],
    [1, 0.005],
  ])
  const geo = sweep({
    path,
    profile: (t) => ellipseProfile(r(t) * 1.05, r(t) * 0.9, 12),
    upHint: new THREE.Vector3(0, 1, 0),
    uvScale: [1, 4],
    capEnd: true,
  })
  noisify(geo, { amp: 0.0025, freq: 34, seed: 71 })

  // Dorsal scutes running down the tail.
  const plates = []
  for (let i = 0; i < 7; i++) {
    const t = 0.16 + i * 0.11
    const idx = Math.round(t * (path.length - 1))
    const p = path[idx]
    const next = path[Math.min(path.length - 1, idx + 1)]
    const dir = new THREE.Vector3().subVectors(next, p).normalize()
    const scale = 1 - i * 0.11
    const plate = horn({ length: 0.026 * scale, radius: 0.009 * scale, curl: 0.6, taper: 1.2, rings: 7, radialSegments: 6 })
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0.85, 0).addScaledVector(dir, 0.5).normalize(),
    )
    xform(plate, { pos: p.clone().add(new THREE.Vector3(0, r(t) * 0.85, 0)), quat: q })
    plates.push(plate)
  }
  return { flesh: geo, plates: mergeAll(plates) }
}

// ---------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------

/**
 * Build every flesh part of the goblin.
 * @returns {import('./skinning.js').SkinPart[]}
 */
export function buildBodyParts() {
  const parts = []
  const push = (geometry, material, bones, extra = {}) => {
    if (geometry) parts.push({ geometry, material, bones, ...extra })
  }

  push(buildTorso(), 'skin', GROUPS.torso.concat(['spine01', 'spine02']), { smoothRadius: 0.045, falloff: 3.4 })
  push(buildJoints(), 'skin', [...GROUPS.torso, 'upperarmL', 'upperarmR', 'thighL', 'thighR'], { smoothRadius: 0.04 })

  push(buildCranium(), 'skin', GROUPS.head, { falloff: 5, smooth: 1 })
  push(buildMandible(), 'skin', ['jaw', 'jawTip'], { falloff: 5, smooth: 1 })
  const eyes = buildEyes()
  push(eyes.sclera, 'eye', null, { rigid: 'head' })
  push(eyes.iris, 'iris', null, { rigid: 'head' })
  const teeth = buildTeeth()
  push(teeth.upper, 'bone', null, { rigid: 'head' })
  push(teeth.lower, 'bone', null, { rigid: 'jaw' })
  push(buildHorns(), 'bone', null, { rigid: 'head' })

  push(buildEar('L'), 'skin', GROUPS.earL, { falloff: 3, smoothRadius: 0.035 })
  push(buildEar('R'), 'skin', GROUPS.earR, { falloff: 3, smoothRadius: 0.035 })

  for (const side of ['L', 'R']) {
    const arm = buildArm(side)
    push(arm.flesh, 'skin', GROUPS[`arm${side}`], { smoothRadius: 0.038, falloff: 3.6 })
    push(arm.spur, 'bone', null, { rigid: `forearm${side}` })

    const hand = buildHand(side)
    push(hand.flesh, 'skin', GROUPS[`hand${side}`], { smoothRadius: 0.016, falloff: 4.2 })
    for (const c of hand.claws) push(c.geo, 'bone', null, { rigid: c.bone })

    push(buildLeg(side), 'skin', GROUPS[`leg${side}`], { smoothRadius: 0.042, falloff: 3.6 })
    const foot = buildFoot(side)
    push(foot.flesh, 'skin', GROUPS[`leg${side}`], { smoothRadius: 0.022, falloff: 4.2 })
    for (const c of foot.claws) push(c.geo, 'bone', null, { rigid: c.bone })
  }

  const tail = buildTail()
  push(tail.flesh, 'skin', GROUPS.tail, { smoothRadius: 0.035, falloff: 3.4 })
  push(tail.plates, 'bone', GROUPS.tail, { falloff: 5, smooth: 0 })

  return parts
}

export { P as restPoint, curveFn, bonePath, sculptSphere }
