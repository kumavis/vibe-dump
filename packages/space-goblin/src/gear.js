import * as THREE from 'three'
import {
  sweep,
  ellipseProfile,
  rectProfile,
  smoothPath,
  roundedBox,
  lathe,
  horn,
  noisify,
  ragged,
  xform,
  mergeAll,
} from './geometry.js'
import { restPositions, GROUPS } from './rig.js'
import { TORSO } from './body.js'
import { makeRng, noise3, smoothstep } from './noise.js'

// ---------------------------------------------------------------------------
// Kit
//
// The goblin's clothing and armour are *skinned into the same mesh as the
// flesh* — a patched vac-suit, a lamellar pauldron, a scavenged bulkhead
// breastplate, wraps, a scrubber pack, goggles and a rebreather. Anything that
// should swing instead of deform (straps, hoses, the necklace, the cape, kilt
// panels) is not modelled here: this file only publishes the *anchors* for it,
// and `character.js` hands those to the verlet solver in dynamics.js.
// ---------------------------------------------------------------------------

const REST = restPositions()
const P = (n) => REST[n].clone()

/** Bone-local offset of a world point (rest rotations are identity). */
const localTo = (bone, world) => world.clone().sub(REST[bone])

// ---- surface helpers ------------------------------------------------------

/**
 * A point on (or just outside) the torso surface.
 * @param {number} y      world height
 * @param {number} a      angle around the body: 0 = front (+Z), PI/2 = left (+X)
 * @param {number} inflate outward offset from the flesh
 */
export function torsoSurface(y, a, inflate = 0) {
  const t = TORSO.tAtY(y)
  const d = TORSO.depth(t) + inflate
  const w = TORSO.width(t) + inflate
  const bias = TORSO.belly(t)
  const p = new THREE.Vector3(Math.sin(a) * w, y, Math.cos(a) * d + bias)
  // The spine path drifts forward as it rises; keep gear on it.
  const idx = Math.round(t * (TORSO.path.length - 1))
  p.z += TORSO.path[idx].z
  // Outward normal of an ellipse is not the radial direction — scale it.
  const n = new THREE.Vector3(Math.sin(a) / w, 0, Math.cos(a) / d).normalize()
  return { p, n }
}

/** A point on a sphere around `center` — pauldrons, kneecaps, lens housings. */
function domeSurface(center, radius, theta, phi, inflate = 0) {
  const r = radius + inflate
  const n = new THREE.Vector3(
    Math.sin(phi) * Math.sin(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.cos(theta),
  )
  return { p: n.clone().multiplyScalar(r).add(center), n }
}

/**
 * Build a thick panel over a parametric surface. This is the workhorse for all
 * the armour: an outer shell, an inner shell offset inward, and four rims so
 * the plate reads as a *cut piece of metal* with visible thickness rather than
 * a zero-width sheet.
 *
 * @param {(u:number, v:number) => {p:THREE.Vector3, n:THREE.Vector3}} surface
 * @param {object} o
 * @param {number} [o.rows=8] [o.cols=10]     tessellation
 * @param {number} [o.thickness=0.008]
 * @param {(u:number,v:number)=>number} [o.inset]  per-corner inward trim (0..1)
 */
function panel(surface, { rows = 8, cols = 10, thickness = 0.008, inset = null } = {}) {
  const positions = []
  const uvs = []
  const indices = []
  const half = thickness / 2

  // Different surfaces disagree about handedness — `torsoSurface` has
  // du x dv along +n, `domeSurface` has it along -n — so rather than make
  // every caller remember, probe the parameterisation once and wind to match.
  const eps = 1e-3
  const s0 = surface(0.5, 0.5)
  const su = surface(0.5 + eps, 0.5)
  const sv = surface(0.5, 0.5 + eps)
  const flip =
    new THREE.Vector3()
      .subVectors(su.p, s0.p)
      .cross(new THREE.Vector3().subVectors(sv.p, s0.p))
      .dot(s0.n) < 0

  const add = (p, u, v) => {
    positions.push(p.x, p.y, p.z)
    uvs.push(u, v)
    return positions.length / 3 - 1
  }

  const outer = []
  const inner = []
  for (let r = 0; r <= rows; r++) {
    const v = r / rows
    outer.push([])
    inner.push([])
    for (let c = 0; c <= cols; c++) {
      const u = c / cols
      const { p, n } = surface(u, v)
      const k = inset ? inset(u, v) : 0
      const o = p.clone().addScaledVector(n, half - k * thickness * 0.5)
      const i = p.clone().addScaledVector(n, -half + k * thickness * 0.5)
      outer[r].push(add(o, u, v))
      inner[r].push(add(i, u, v))
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const a = outer[r][c]
      const b = outer[r][c + 1]
      const d = outer[r + 1][c]
      const e = outer[r + 1][c + 1]
      const ia = inner[r][c]
      const ib = inner[r][c + 1]
      const id = inner[r + 1][c]
      const ie = inner[r + 1][c + 1]
      if (flip) {
        indices.push(a, d, b, b, d, e)
        indices.push(ia, ib, id, ib, ie, id)
      } else {
        indices.push(a, b, d, b, e, d)
        indices.push(ia, id, ib, ib, id, ie)
      }
    }
  }
  // Rims. Duplicated vertices so the edge stays sharp under smooth normals.
  const rim = (a0, b0, a1, b1) => {
    const p0 = new THREE.Vector3(positions[a0 * 3], positions[a0 * 3 + 1], positions[a0 * 3 + 2])
    const p1 = new THREE.Vector3(positions[b0 * 3], positions[b0 * 3 + 1], positions[b0 * 3 + 2])
    const p2 = new THREE.Vector3(positions[a1 * 3], positions[a1 * 3 + 1], positions[a1 * 3 + 2])
    const p3 = new THREE.Vector3(positions[b1 * 3], positions[b1 * 3 + 1], positions[b1 * 3 + 2])
    const i0 = add(p0, 0, 0)
    const i1 = add(p1, 1, 0)
    const i2 = add(p2, 0, 1)
    const i3 = add(p3, 1, 1)
    if (flip) indices.push(i0, i2, i1, i1, i2, i3)
    else indices.push(i0, i1, i2, i1, i3, i2)
  }
  for (let c = 0; c < cols; c++) {
    rim(outer[0][c + 1], outer[0][c], inner[0][c + 1], inner[0][c])
    rim(outer[rows][c], outer[rows][c + 1], inner[rows][c], inner[rows][c + 1])
  }
  for (let r = 0; r < rows; r++) {
    rim(outer[r][0], outer[r + 1][0], inner[r][0], inner[r + 1][0])
    rim(outer[r + 1][cols], outer[r][cols], inner[r + 1][cols], inner[r][cols])
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3))
  geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
  geo.setIndex(indices)
  geo.computeVertexNormals()
  return geo
}

/** A rivet: a domed stud on the surface, pointing down `n`. */
function rivet(p, n, r = 0.006) {
  const geo = lathe(
    [
      new THREE.Vector2(0, r * 0.75),
      new THREE.Vector2(r * 0.6, r * 0.62),
      new THREE.Vector2(r, r * 0.25),
      new THREE.Vector2(r * 0.95, 0),
      new THREE.Vector2(0, 0),
    ],
    8,
  )
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n)
  return xform(geo, { pos: p.clone().addScaledVector(n, -r * 0.15), quat: q })
}

/** A strap: a flat band swept along a path that hugs the body. */
function strap(points, width = 0.026, thick = 0.006, samples = 26, twist = 0) {
  return sweep({
    path: smoothPath(points, samples),
    profile: () => rectProfile(thick, width, 0.5, 12),
    upHint: new THREE.Vector3(0, 1, 0),
    twist,
    uvScale: [1, 6],
  })
}

/** Helical binding around a limb — forearm and shin wraps. */
function wrap(a, b, { turns = 5, radius = 0.03, band = 0.016, thick = 0.005, taper = 0 } = {}) {
  const axis = new THREE.Vector3().subVectors(b, a)
  const len = axis.length()
  axis.normalize()
  let side = new THREE.Vector3(0, 1, 0)
  if (Math.abs(side.dot(axis)) > 0.9) side.set(1, 0, 0)
  const u = new THREE.Vector3().crossVectors(axis, side).normalize()
  const v = new THREE.Vector3().crossVectors(axis, u).normalize()
  const pts = []
  const steps = Math.max(16, Math.round(turns * 10))
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const ang = t * turns * Math.PI * 2
    const r = radius * (1 - taper * t)
    pts.push(
      new THREE.Vector3()
        .copy(a)
        .addScaledVector(axis, len * t)
        .addScaledVector(u, Math.cos(ang) * r)
        .addScaledVector(v, Math.sin(ang) * r),
    )
  }
  return sweep({
    path: pts,
    profile: () => rectProfile(band, thick, 0.6, 8),
    upHint: axis.clone(),
    uvScale: [1, 10],
  })
}

// ---------------------------------------------------------------------------
// The undersuit
// ---------------------------------------------------------------------------

function buildUndersuit() {
  const geos = []
  // Torso layer: sits 4 mm proud of the flesh, with a ragged neckline and a
  // hem that stops above the belly so the bare midriff shows.
  geos.push(
    panel(
      (u, v) => {
        const y = 0.63 + v * 0.31
        const a = u * Math.PI * 2
        // Wear the shoulders thin, keep the back thick (patched over).
        const inflate = 0.006 + 0.004 * Math.sin(a) ** 2 + 0.003 * smoothstep(0.4, 1, v)
        const s = torsoSurface(y, a, inflate)
        // Ragged collar: chew the top edge with a fixed noise so it tiles.
        if (v > 0.86) {
          const n = noise3(Math.cos(a) * 3, Math.sin(a) * 3, 7)
          s.p.y -= (v - 0.86) * 0.32 * (0.3 + n)
        }
        return s
      },
      { rows: 16, cols: 30, thickness: 0.0055 },
    ),
  )

  // Sleeves: half-length, one torn shorter than the other.
  for (const side of ['L', 'R']) {
    const s = side === 'L' ? 1 : -1
    const sh = P(`upperarm${side}`)
    const el = P(`forearm${side}`)
    const end = sh.clone().lerp(el, side === 'L' ? 0.72 : 0.5)
    const g = sweep({
      path: smoothPath([sh.clone().addScaledVector(new THREE.Vector3(-s, 0, 0), 0.03), sh.clone().lerp(end, 0.5), end], 12),
      profile: (t) => {
        const r = 0.06 - 0.016 * t
        return ellipseProfile(r * 0.94, r, 14)
      },
      upHint: new THREE.Vector3(0, 1, 0),
      capStart: false,
      capEnd: false,
      uvScale: [1, 2],
    })
    ragged(g, { axis: 'x', from: end.x, amp: 0.014, freq: 30, seed: side === 'L' ? 5 : 6 })
    geos.push(g)
  }

  // Leggings to just above the knee.
  for (const side of ['L', 'R']) {
    const hip = P(`thigh${side}`)
    const knee = P(`shin${side}`)
    const end = hip.clone().lerp(knee, 0.78)
    const g = sweep({
      path: smoothPath([hip.clone().add(new THREE.Vector3(0, 0.035, 0)), hip.clone().lerp(end, 0.5), end], 12),
      profile: (t) => {
        const r = 0.068 - 0.019 * t
        return ellipseProfile(r, r * 0.96, 14)
      },
      upHint: new THREE.Vector3(0, 0, 1),
      capStart: false,
      capEnd: false,
      uvScale: [1, 2],
    })
    ragged(g, { axis: 'y', from: end.y, amp: 0.012, freq: 26, seed: side === 'L' ? 7 : 8 })
    geos.push(g)
  }

  const g = mergeAll(geos)
  noisify(g, { amp: 0.0018, freq: 40, seed: 15 })
  return g
}

/** Stitched-on patches — the suit has been repaired a dozen times. */
function buildPatches() {
  const rng = makeRng(303)
  const geos = []
  const spots = [
    [0.7, 0.6, 0.05, 0.045],
    [0.78, -1.9, 0.055, 0.05],
    [0.86, 2.6, 0.045, 0.04],
    [0.66, 3.5, 0.05, 0.038],
    [0.9, -0.5, 0.04, 0.035],
  ]
  for (const [y, a0, w, h] of spots) {
    const seed = rng() * 10
    geos.push(
      panel(
        (u, v) => {
          const a = a0 + (u - 0.5) * (w / 0.1)
          const yy = y + (v - 0.5) * h
          return torsoSurface(yy, a, 0.0125 + 0.0015 * noise3(u * 4 + seed, v * 4, 1))
        },
        { rows: 4, cols: 5, thickness: 0.0035 },
      ),
    )
  }
  return mergeAll(geos)
}

// ---------------------------------------------------------------------------
// Armour
// ---------------------------------------------------------------------------

function buildBreastplate() {
  const geos = []
  // A dished bulkhead offcut strapped across the chest, tilted and off-centre
  // because it was never made for a goblin.
  geos.push(
    panel(
      (u, v) => {
        const a = -0.18 + (u - 0.5) * 1.85
        const y = 0.79 + v * 0.135
        const bow = 0.012 * Math.sin(v * Math.PI) * Math.sin(u * Math.PI)
        return torsoSurface(y, a, 0.019 + bow)
      },
      { rows: 8, cols: 14, thickness: 0.009 },
    ),
  )
  // Reinforcing rib welded across the middle.
  geos.push(
    panel(
      (u, v) => {
        const a = -0.18 + (u - 0.5) * 1.7
        const y = 0.845 + (v - 0.5) * 0.026
        return torsoSurface(y, a, 0.027 + 0.004 * Math.sin(v * Math.PI))
      },
      { rows: 3, cols: 12, thickness: 0.007 },
    ),
  )
  // Rivets round the border.
  for (let i = 0; i < 10; i++) {
    const t = i / 9
    const a = -0.18 + (t - 0.5) * 1.72
    for (const y of [0.797, 0.918]) {
      const s = torsoSurface(y, a, 0.024)
      geos.push(rivet(s.p, s.n, 0.0055))
    }
  }
  const g = mergeAll(geos)
  noisify(g, { amp: 0.0016, freq: 26, seed: 91 })
  return g
}

/** Left pauldron: four lamellar plates fanned over the shoulder. */
function buildPauldron() {
  // Pushed outboard and started well off the pole: a dome centred on the
  // shoulder joint caps out at head height, and armour floating beside the jaw
  // reads as a bug rather than as a pauldron.
  const center = P('upperarmL').clone().add(new THREE.Vector3(0.022, -0.006, -0.004))
  const geos = []
  for (let i = 0; i < 4; i++) {
    const t = i / 3
    const inflate = 0.017 + i * 0.005
    geos.push(
      panel(
        (u, v) => {
          const theta = -0.4 + (u - 0.5) * 2.4
          const phi = 0.62 + t * 0.6 + v * 0.42
          return domeSurface(center, 0.062, theta, phi, inflate + 0.004 * Math.sin(u * Math.PI))
        },
        { rows: 4, cols: 12, thickness: 0.0075 },
      ),
    )
    // A rivet at each plate's hinge.
    const hinge = domeSurface(center, 0.062, -0.4, 0.64 + t * 0.6, inflate + 0.006)
    geos.push(rivet(hinge.p, hinge.n, 0.006))
    const hinge2 = domeSurface(center, 0.062, 1.55, 0.64 + t * 0.6, inflate + 0.006)
    geos.push(rivet(hinge2.p, hinge2.n, 0.006))
  }
  // A bone spike lashed to the cap.
  const spike = horn({ length: 0.07, radius: 0.013, curl: 0.9, taper: 1.4, twistRibs: 4 })
  const cap = domeSurface(center, 0.062, 0.45, 0.5, 0.022)
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), cap.n)
  xform(spike, { pos: cap.p, quat: q })
  const g = mergeAll(geos)
  noisify(g, { amp: 0.0014, freq: 30, seed: 93 })
  return { plates: g, spike }
}

/** Right shoulder gets a smaller strapped cap, so the silhouette is asymmetric. */
function buildShoulderCap() {
  // Sits *on* the deltoid, not on top of the trapezius: pulled outboard and
  // started below the pole, or it rides up beside the jaw and reads as a
  // separate floating shell.
  const center = P('upperarmR').clone().add(new THREE.Vector3(-0.024, -0.008, -0.002))
  const cap = panel(
    (u, v) => {
      const theta = 0.2 + (u - 0.5) * 1.5
      const phi = 0.66 + v * 0.56
      return domeSurface(center, 0.056, theta, phi, 0.013)
    },
    { rows: 5, cols: 10, thickness: 0.0075 },
  )
  noisify(cap, { amp: 0.0018, freq: 24, seed: 95 })
  return cap
}

function buildBelt() {
  const geos = []
  const y0 = 0.615
  geos.push(
    panel((u, v) => torsoSurface(y0 + v * 0.055, u * Math.PI * 2, 0.014), {
      rows: 3,
      cols: 28,
      thickness: 0.009,
    }),
  )
  // Buckle: a slab with a slot, sitting proud at the front.
  const front = torsoSurface(y0 + 0.028, 0.05, 0.03)
  const buckle = roundedBox(0.062, 0.05, 0.014, 0.006, 3)
  xform(buckle, { pos: front.p, rot: [0, 0.05, 0] })
  geos.push(buckle)
  // Pouches and canisters around the hips.
  const pouches = [
    { a: 1.25, w: 0.062, h: 0.075, d: 0.05 },
    { a: 2.05, w: 0.05, h: 0.058, d: 0.042 },
    { a: -1.15, w: 0.058, h: 0.07, d: 0.046 },
    { a: 3.35, w: 0.07, h: 0.06, d: 0.04 },
  ]
  for (const po of pouches) {
    const s = torsoSurface(y0 - po.h * 0.42, po.a, 0.016 + po.d / 2)
    const box = roundedBox(po.w, po.h, po.d, 0.012, 3)
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), s.n)
    xform(box, { pos: s.p, quat: q })
    geos.push(box)
    // Flap over the top.
    const flap = roundedBox(po.w * 1.05, po.h * 0.36, po.d * 1.06, 0.008, 2)
    xform(flap, {
      pos: s.p.clone().add(new THREE.Vector3(0, po.h * 0.36, 0)).addScaledVector(s.n, 0.002),
      quat: q,
    })
    geos.push(flap)
  }
  const g = mergeAll(geos)
  noisify(g, { amp: 0.0015, freq: 34, seed: 97 })
  return g
}

/** Air-scrubber pack: a canister pair on a frame across the shoulder blades. */
function buildScrubberPack() {
  const geos = []
  const back = torsoSurface(0.86, Math.PI, 0.028)
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), back.n)

  const frame = roundedBox(0.15, 0.15, 0.03, 0.012, 3)
  xform(frame, { pos: back.p, quat: q })
  geos.push(frame)

  for (const s of [1, -1]) {
    const tankProfile = [
      new THREE.Vector2(0, -0.055),
      new THREE.Vector2(0.02, -0.058),
      new THREE.Vector2(0.03, -0.05),
      new THREE.Vector2(0.032, 0.045),
      new THREE.Vector2(0.026, 0.058),
      new THREE.Vector2(0.012, 0.064),
      new THREE.Vector2(0, 0.066),
    ]
    const tank = lathe(tankProfile, 14)
    xform(tank, {
      pos: back.p.clone().add(new THREE.Vector3(s * 0.045, 0.005, 0)).addScaledVector(back.n, 0.042),
      quat: q.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0))),
      rot: undefined,
    })
    geos.push(tank)
    // Banding straps around each tank.
    for (const yy of [-0.03, 0.03]) {
      const band = lathe(
        [new THREE.Vector2(0.033, 0), new THREE.Vector2(0.036, 0), new THREE.Vector2(0.036, 0.01), new THREE.Vector2(0.033, 0.01)],
        14,
      )
      xform(band, {
        pos: back.p
          .clone()
          .add(new THREE.Vector3(s * 0.045, 0.005, 0))
          .addScaledVector(back.n, 0.042 + yy),
        quat: q.clone().multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0))),
      })
      geos.push(band)
    }
  }
  // Regulator block with a readout face.
  const reg = roundedBox(0.05, 0.036, 0.026, 0.006, 2)
  xform(reg, { pos: back.p.clone().add(new THREE.Vector3(0, -0.062, 0)).addScaledVector(back.n, 0.03), quat: q })
  geos.push(reg)

  const g = mergeAll(geos)
  noisify(g, { amp: 0.0012, freq: 40, seed: 99 })
  return g
}

/** The readout screen on the regulator, and tank labels — emissive bits. */
function buildPackGlow() {
  const back = torsoSurface(0.86, Math.PI, 0.028)
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), back.n)
  const screen = roundedBox(0.032, 0.02, 0.004, 0.002, 1)
  xform(screen, {
    pos: back.p.clone().add(new THREE.Vector3(0, -0.062, 0)).addScaledVector(back.n, 0.044),
    quat: q,
  })
  return screen
}

// ---------------------------------------------------------------------------
// Head kit
// ---------------------------------------------------------------------------

function buildGoggles() {
  const head = P('head')
  const geos = []
  const lenses = []
  // Pushed up onto the forehead, one lens cracked and dark.
  const centre = head.clone().add(new THREE.Vector3(0, 0.072, 0.03))
  for (const s of [1, -1]) {
    const c = centre.clone().add(new THREE.Vector3(s * 0.038, 0, 0.016))
    const housing = lathe(
      [
        new THREE.Vector2(0, 0.012),
        new THREE.Vector2(0.022, 0.014),
        new THREE.Vector2(0.03, 0.008),
        new THREE.Vector2(0.031, -0.008),
        new THREE.Vector2(0.024, -0.014),
        new THREE.Vector2(0, -0.014),
      ],
      14,
    )
    xform(housing, { pos: c, rot: [Math.PI / 2 - 0.5, 0, 0] })
    geos.push(housing)
    const lens = new THREE.CircleGeometry(0.023, 16)
    xform(lens, { pos: c.clone().add(new THREE.Vector3(0, 0.008, 0.012)), rot: [-0.5, 0, 0] })
    lenses.push(lens)
  }
  // Strap around the skull. The radius has to *follow* the cranium: the skull
  // narrows fast above the brow, so a constant-radius band stands off it and
  // reads as the brim of a hat.
  const strapPts = []
  const bandY = 0.07
  const skull = 0.104
  const ring = Math.sqrt(Math.max(0.001, skull * skull - bandY * bandY))
  for (let i = 0; i <= 16; i++) {
    const a = -1.25 + (i / 16) * (Math.PI * 2 - 0.9)
    strapPts.push(
      head
        .clone()
        .add(new THREE.Vector3(Math.sin(a) * ring * 0.96, bandY + Math.cos(a) * 0.014, Math.cos(a) * ring * 1.06)),
    )
  }
  geos.push(strap(strapPts, 0.017, 0.005, 26))
  return { frame: mergeAll(geos), lenses: mergeAll(lenses) }
}

/**
 * A cup over the snout hides the whole face, which is the one thing a
 * character can't afford to lose. So the rebreather is a *clamp*: a narrow
 * band over the bridge of the snout, a chin strap under the mandible, and a
 * filter cartridge on each cheek — the mouth and teeth stay visible.
 */
function buildRebreather() {
  const jaw = P('jaw')
  const geos = []

  // Bridge band, arcing over the top of the snout.
  const bridge = []
  for (let i = 0; i <= 12; i++) {
    const a = -1.1 + (i / 12) * 2.2
    bridge.push(
      jaw
        .clone()
        .add(new THREE.Vector3(Math.sin(a) * 0.042, 0.03 + Math.cos(a) * 0.022, 0.062 - Math.abs(a) * 0.006)),
    )
  }
  geos.push(strap(bridge, 0.019, 0.006, 20))

  // Chin strap, under the mandible.
  const chin = []
  for (let i = 0; i <= 10; i++) {
    const a = -1.2 + (i / 10) * 2.4
    chin.push(
      jaw.clone().add(new THREE.Vector3(Math.sin(a) * 0.04, -0.026 - Math.cos(a) * 0.012, 0.03 + Math.cos(a) * 0.02)),
    )
  }
  geos.push(strap(chin, 0.014, 0.005, 18))

  // Filter cartridges on the cheeks, angled forward.
  for (const s of [1, -1]) {
    const f = lathe(
      [
        new THREE.Vector2(0, 0.016),
        new THREE.Vector2(0.012, 0.017),
        new THREE.Vector2(0.015, 0.01),
        new THREE.Vector2(0.015, -0.013),
        new THREE.Vector2(0.011, -0.017),
        new THREE.Vector2(0, -0.017),
      ],
      12,
    )
    xform(f, { pos: jaw.clone().add(new THREE.Vector3(s * 0.048, 0.008, 0.034)), rot: [0.3, 0, s * 1.25] })
    geos.push(f)
    // A short intake stub aimed at the nostril.
    const stub = lathe(
      [new THREE.Vector2(0, 0.012), new THREE.Vector2(0.005, 0.012), new THREE.Vector2(0.005, -0.012), new THREE.Vector2(0, -0.012)],
      8,
    )
    xform(stub, { pos: jaw.clone().add(new THREE.Vector3(s * 0.032, 0.016, 0.052)), rot: [0, 0, s * 1.0] })
    geos.push(stub)
  }
  return mergeAll(geos)
}

// ---------------------------------------------------------------------------
// Wraps, guards, holster
// ---------------------------------------------------------------------------

function buildWraps() {
  const geos = []
  // Right forearm binding (the sword hand), left is bare under the buckler.
  geos.push(
    wrap(P('forearmR').clone().lerp(P('handR'), 0.12), P('handR').clone().lerp(P('forearmR'), 0.12), {
      turns: 7,
      radius: 0.033,
      band: 0.013,
      thick: 0.0032,
      taper: 0.3,
    }),
  )
  // Both shins.
  for (const side of ['L', 'R']) {
    geos.push(
      wrap(P(`shin${side}`).clone().lerp(P(`foot${side}`), 0.35), P(`foot${side}`).clone(), {
        turns: 6,
        radius: 0.031,
        band: 0.014,
        thick: 0.0032,
        taper: 0.38,
      }),
    )
  }
  // Left hand knuckle binding.
  geos.push(
    wrap(P('handL').clone(), P('midL0').clone(), { turns: 3, radius: 0.034, band: 0.014, thick: 0.0032 }),
  )
  const g = mergeAll(geos)
  noisify(g, { amp: 0.0012, freq: 50, seed: 111 })
  return g
}

function buildKneeGuards() {
  const geos = []
  for (const side of ['L', 'R']) {
    const knee = P(`shin${side}`)
    geos.push(
      panel(
        (u, v) => {
          const theta = (u - 0.5) * 1.9
          const phi = 0.55 + v * 0.85
          return domeSurface(knee.clone().add(new THREE.Vector3(0, 0.004, 0)), 0.047, theta, phi, 0.011)
        },
        { rows: 4, cols: 8, thickness: 0.007 },
      ),
    )
    // A stubby spike on each cap.
    const s = domeSurface(knee, 0.047, 0, 1.0, 0.016)
    const sp = horn({ length: 0.032, radius: 0.01, curl: 0.5, taper: 1.3, rings: 8, radialSegments: 6 })
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), s.n)
    geos.push(xform(sp, { pos: s.p, quat: q }))
  }
  const g = mergeAll(geos)
  noisify(g, { amp: 0.0014, freq: 32, seed: 113 })
  return g
}

/** Thigh holster for the sidearm, on the right leg. */
function buildHolster() {
  const geos = []
  const hip = P('thighR')
  const knee = P('shinR')
  const c = hip.clone().lerp(knee, 0.36).add(new THREE.Vector3(-0.062, 0, 0.006))
  const body = roundedBox(0.05, 0.11, 0.052, 0.014, 3)
  xform(body, { pos: c, rot: [0.12, 0, -0.14] })
  geos.push(body)
  const flap = roundedBox(0.052, 0.032, 0.056, 0.01, 2)
  xform(flap, { pos: c.clone().add(new THREE.Vector3(0.002, 0.062, 0)), rot: [0.12, 0, -0.14] })
  geos.push(flap)
  // Leg strap around the thigh.
  const pts = []
  for (let i = 0; i <= 14; i++) {
    const a = (i / 14) * Math.PI * 2
    pts.push(hip.clone().lerp(knee, 0.36).add(new THREE.Vector3(Math.sin(a) * 0.055, 0.03, Math.cos(a) * 0.05)))
  }
  geos.push(strap(pts, 0.018, 0.005, 22))
  const g = mergeAll(geos)
  noisify(g, { amp: 0.0012, freq: 40, seed: 115 })
  return g
}

/** The bandolier: shoulder-to-hip strap with shell loops. */
function buildBandolier() {
  const geos = []
  const pts = []
  for (let i = 0; i <= 22; i++) {
    const t = i / 22
    // Left shoulder down across the chest to the right hip, wrapping the back.
    const y = 0.94 - t * 0.31
    const a = 1.15 - t * 3.1
    pts.push(torsoSurface(y, a, 0.021).p)
  }
  geos.push(strap(pts, 0.034, 0.008, 34))
  // Slug loops along the front half.
  for (let i = 0; i < 7; i++) {
    const t = 0.16 + i * 0.086
    const y = 0.94 - t * 0.31
    const a = 1.15 - t * 3.1
    const s = torsoSurface(y, a, 0.03)
    const slug = lathe(
      [
        new THREE.Vector2(0, -0.018),
        new THREE.Vector2(0.009, -0.018),
        new THREE.Vector2(0.0095, 0.012),
        new THREE.Vector2(0.007, 0.02),
        new THREE.Vector2(0, 0.022),
      ],
      10,
    )
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), s.n)
    geos.push(xform(slug, { pos: s.p, quat: q }))
  }
  const g = mergeAll(geos)
  noisify(g, { amp: 0.0012, freq: 44, seed: 117 })
  return g
}

// ---------------------------------------------------------------------------
// Dynamic accessory anchors
//
// These are descriptions, not geometry: character.js turns each one into a
// verlet strand or cloth patch so it swings under gravity and the run's
// inertia. Offsets are bone-local (rest rotations are identity, so a local
// offset is just world-minus-rest).
// ---------------------------------------------------------------------------

function accessorySpecs() {
  const specs = []
  const rng = makeRng(555)

  // ---- belt straps: the loose tails of every buckle ----
  const strapAngles = [0.35, 0.95, 1.75, 2.6, -0.65, -1.5, 3.6]
  strapAngles.forEach((a, i) => {
    const s = torsoSurface(0.63, a, 0.02)
    specs.push({
      type: 'strand',
      name: `beltStrap${i}`,
      bone: 'hips',
      offset: localTo('hips', s.p),
      dir: new THREE.Vector3(0.1 * (rng() - 0.5), -1, 0.12 * (rng() - 0.5)).normalize(),
      length: 0.14 + rng() * 0.11,
      segments: 7,
      radius: 0.008,
      taper: 0.7,
      material: 'leather',
      damping: 0.09,
      wind: 0.35,
    })
  })

  // ---- pouch danglers: a tooth charm and two ration tins ----
  const charms = [
    { a: 1.25, len: 0.09, mat: 'bone' },
    { a: -1.15, len: 0.12, mat: 'metalDark' },
    { a: 2.05, len: 0.075, mat: 'brass' },
  ]
  charms.forEach((c, i) => {
    const s = torsoSurface(0.585, c.a, 0.05)
    specs.push({
      type: 'strand',
      name: `charm${i}`,
      bone: 'hips',
      offset: localTo('hips', s.p),
      dir: new THREE.Vector3(0, -1, 0),
      length: c.len,
      segments: 5,
      radius: 0.005,
      taper: 0.9,
      material: 'leather',
      tip: { kind: i === 0 ? 'tooth' : i === 1 ? 'tin' : 'ring', material: c.mat },
      damping: 0.05,
      wind: 0.5,
    })
  })

  // ---- ear rings ----
  for (const side of ['L', 'R']) {
    for (let i = 0; i < (side === 'L' ? 3 : 2); i++) {
      const bone = `ear${side}${i === 0 ? 1 : 2}`
      const base = P(bone)
      specs.push({
        type: 'strand',
        name: `earRing${side}${i}`,
        bone,
        offset: localTo(bone, base.clone().add(new THREE.Vector3(0, -0.012 - i * 0.004, -0.01 * i))),
        dir: new THREE.Vector3(0, -1, 0),
        length: 0.035 + i * 0.012,
        segments: 4,
        radius: 0.0035,
        taper: 1,
        material: 'brass',
        tip: { kind: 'ring', material: 'brass' },
        damping: 0.03,
        wind: 0.7,
      })
    }
  }

  // ---- necklace: pinned at both collarbones, swings across the chest ----
  specs.push({
    type: 'strand',
    name: 'necklace',
    bone: 'chest',
    offset: localTo('chest', torsoSurface(0.945, 0.85, 0.012).p),
    dir: new THREE.Vector3(0, -0.35, 0.9).normalize(),
    length: 0.34,
    segments: 12,
    radius: 0.005,
    taper: 1,
    material: 'bone',
    beads: 11,
    pinTip: true,
    pinTipTo: localTo('chest', torsoSurface(0.945, -0.85, 0.012).p),
    damping: 0.07,
    wind: 0.25,
  })

  // ---- scrubber hose: pack to rebreather, pinned at both ends ----
  specs.push({
    type: 'strand',
    name: 'hose',
    bone: 'chest',
    offset: localTo('chest', torsoSurface(0.9, Math.PI - 0.5, 0.05).p),
    dir: new THREE.Vector3(0.3, 0.4, -0.6).normalize(),
    length: 0.36,
    segments: 12,
    radius: 0.011,
    taper: 1,
    material: 'hose',
    ribbed: true,
    // Pinned to the mask, but expressed in the chest's frame: the jaw only
    // travels a couple of centimetres and a hose that stretched with every
    // roar would read as rubber-band, not armoured tubing.
    pinTip: true,
    pinTipTo: localTo('chest', P('jaw').clone().add(new THREE.Vector3(0.052, 0.004, 0.022))),
    damping: 0.12,
    stiffness: 0.9,
    wind: 0.15,
  })

  // ---- pack antenna: a long whip with a blinking bead ----
  specs.push({
    type: 'strand',
    name: 'antenna',
    bone: 'chest',
    offset: localTo('chest', torsoSurface(0.93, Math.PI + 0.25, 0.055).p),
    dir: new THREE.Vector3(-0.15, 0.95, -0.25).normalize(),
    length: 0.42,
    segments: 9,
    radius: 0.0035,
    taper: 0.55,
    material: 'metalDark',
    tip: { kind: 'bead', material: 'emissive' },
    gravity: -3.2, // stiff whip: it should stand up, not flop
    stiffness: 1,
    damping: 0.02,
    wind: 0.9,
  })

  // ---- shoulder cape: torn banner off the pauldron ----
  specs.push({
    type: 'cloth',
    name: 'cape',
    width: 0.42,
    height: 0.52,
    cols: 13,
    rows: 15,
    material: 'cape',
    wind: 0.85,
    drag: 0.05,
    pins: [
      { bone: 'chest', local: localTo('chest', torsoSurface(0.955, 1.5, 0.03).p), col: 0 },
      { bone: 'chest', local: localTo('chest', torsoSurface(0.94, Math.PI, 0.04).p), col: 6 },
      { bone: 'chest', local: localTo('chest', torsoSurface(0.955, -1.5, 0.03).p), col: 12 },
    ],
  })

  // ---- kilt panels: three loose leather aprons off the belt ----
  const kilt = [
    { a: 0.0, w: 0.15, h: 0.21 },
    { a: 2.35, w: 0.14, h: 0.19 },
    { a: -2.35, w: 0.14, h: 0.2 },
  ]
  kilt.forEach((k, i) => {
    const left = torsoSurface(0.628, k.a + 0.34, 0.024).p
    const mid = torsoSurface(0.628, k.a, 0.024).p
    const right = torsoSurface(0.628, k.a - 0.34, 0.024).p
    specs.push({
      type: 'cloth',
      name: `kilt${i}`,
      width: k.w,
      height: k.h,
      cols: 7,
      rows: 9,
      material: 'kilt',
      wind: 0.4,
      drag: 0.03,
      pins: [
        { bone: 'hips', local: localTo('hips', left), col: 0 },
        { bone: 'hips', local: localTo('hips', mid), col: 3 },
        { bone: 'hips', local: localTo('hips', right), col: 6 },
      ],
    })
  })

  return specs
}

// ---------------------------------------------------------------------------
// Assembly
// ---------------------------------------------------------------------------

/**
 * @returns {{ parts: import('./skinning.js').SkinPart[], accessories: object[] }}
 */
export function buildGearParts() {
  const parts = []
  const push = (geometry, material, bones, extra = {}) => {
    if (geometry) parts.push({ geometry, material, bones, ...extra })
  }

  const torsoBones = [...GROUPS.torso, 'spine01', 'spine02']

  push(buildUndersuit(), 'cloth', [...torsoBones, 'upperarmL', 'upperarmR', 'forearmL', 'forearmR', 'shinL', 'shinR'], {
    smoothRadius: 0.045,
    falloff: 3.4,
  })
  push(buildPatches(), 'patch', torsoBones, { falloff: 4 })
  push(buildBreastplate(), 'hazard', ['chest', 'spine02', 'spine01'], { falloff: 6, smooth: 1 })
  push(buildBandolier(), 'leather', torsoBones, { falloff: 4, smoothRadius: 0.05 })

  const pauldron = buildPauldron()
  push(pauldron.plates, 'metal', null, { rigid: 'clavicleL' })
  push(pauldron.spike, 'bone', null, { rigid: 'clavicleL' })
  push(buildShoulderCap(), 'metalDark', null, { rigid: 'clavicleR' })

  push(buildBelt(), 'leather', ['hips', 'spine01'], { falloff: 5, smoothRadius: 0.04 })
  push(buildScrubberPack(), 'metalDark', null, { rigid: 'chest' })
  push(buildPackGlow(), 'emissive', null, { rigid: 'chest' })

  const goggles = buildGoggles()
  push(goggles.frame, 'metalDark', null, { rigid: 'head' })
  push(goggles.lenses, 'glass', null, { rigid: 'head' })
  push(buildRebreather(), 'metal', null, { rigid: 'jaw' })

  push(buildWraps(), 'wrap', [...GROUPS.armR, ...GROUPS.legL, ...GROUPS.legR, ...GROUPS.handL], {
    falloff: 4.5,
    smoothRadius: 0.03,
  })
  push(buildKneeGuards(), 'metalDark', ['shinL', 'shinR', 'thighL', 'thighR'], { falloff: 6, smooth: 1 })
  push(buildHolster(), 'leather', ['thighR', 'hips'], { falloff: 5 })

  return { parts, accessories: accessorySpecs() }
}

export { panel, rivet, strap, wrap, domeSurface, localTo }
