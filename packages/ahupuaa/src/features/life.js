// People, canoes, surfers, birds and smoke — the island's day going on.
//
// Everyone is a little instanced figure, moved on the CPU (there are only a few
// hundred of them). Most stay about where their work is, and go quietly about
// it: bending to the kalo and straightening up in the loʻi, now and then wading
// on to the next patch; sitting, talking, pounding poi and beating kapa among
// the houses of the kauhale, a few strolling between them; tending the canoes
// on the beach; minding the fishpond gates; on the heiau court. Some go
// somewhere: canoes work the fishing grounds past the reef, surfers wait out the
// lulls and ride the sets, sledders run the hōlua, a voyaging canoe sails the
// coast, and in the Makahiki season Lono's akua loa is carried clockwise around
// the island on the shore trail, the land always on the bearers' right.

import * as THREE from 'three'
import { HALF, HYDRO_RES, METRE, WORLD, Y_PER_M } from '../config.js'
import { layStreams } from '../gen/channels.js'
import { mulberry32 } from '../gen/noise.js'
import { insidePoly } from '../gen/loi.js'
import { swellAt, SWELL } from '../render/ocean.js'
import { Builder, MAT, S, col, objectMaterial } from './kit.js'
import { waa, kaulua, akuaLoa } from './structures.js'
import { drawnHeight } from './index.js'

// depth (m) of a break's line: where a set wave stands up and spills
const BREAK_DEPTH = 3
// how far ahead (s) the lineup sees a set wave coming and someone decides to go
const LEAD = 10
// sprint-paddling pace into a wave, world units a second (2.2 m/s)
const SPRINT = 0.022
// how far outside the break's line a wave stands up under whoever catches it
const FACE = 0.03
// half a board's length (3.65 m) in world units, before each surfer's own scale
const BOARD_HALF = 1.83 * S
// the least room between two boards' edges, world units
const BOARD_GAP = 0.014
// half a hōlua sled's length, in world units (a 3.6 m papa hōlua)
const SLED_HALF = 1.8 * S
// the hōlua track's top surface above its centre line (features/index.js buildHolua)
const TRACK_TOP = 0.0145

const smoothstep = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const wrapAngle = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2))
// slope of a set wave's profile against time, as swellRidge() in ocean.glsl.js
const swellRidge = (a) => {
  const w = a < 0 ? 1.3 : 3.5
  return ((-2 * a) / (w * w)) * Math.exp((-a * a) / (w * w))
}

function person(pose, rand) {
  const B = new Builder()
  const skin = col('#7a4b30', 0.1, rand)
  const cloth = col('#b08a5a', 0.15, rand)
  if (pose === 'stand') {
    B.box(-0.12, 0, 0, 0.16, 0.85, 0.18, skin, MAT.skin, 0, 0.8)
    B.box(0.12, 0, 0, 0.16, 0.85, 0.18, skin, MAT.skin, 0, 0.8)
    B.box(0, 0.78, 0, 0.42, 0.32, 0.26, cloth, MAT.plain)
    B.box(0, 1.05, 0, 0.44, 0.5, 0.24, skin, MAT.skin, 0, 0.85)
    B.box(-0.3, 0.88, 0, 0.11, 0.62, 0.12, skin, MAT.skin)
    B.box(0.3, 0.88, 0, 0.11, 0.62, 0.12, skin, MAT.skin)
    B.blob(0, 1.68, 0, 0.13, 0.15, 0.13, col('#3a2418', 0.1, rand), MAT.skin, 1, false)
  } else {
    // sitting cross-legged
    B.box(0, 0, 0, 0.6, 0.2, 0.42, cloth, MAT.plain)
    B.box(0, 0.18, 0, 0.42, 0.55, 0.24, skin, MAT.skin, 0, 0.85)
    B.box(-0.28, 0.2, 0.08, 0.1, 0.45, 0.1, skin, MAT.skin)
    B.box(0.28, 0.2, 0.08, 0.1, 0.45, 0.1, skin, MAT.skin)
    B.blob(0, 0.86, 0, 0.13, 0.15, 0.13, col('#3a2418', 0.1, rand), MAT.skin, 3, false)
  }
  return B.geometry()
}

// --- figures that move -------------------------------------------------------------
// Someone about their work is put together each frame from instanced parts:
// the torso (malo, body and head, from the hip joints), a thigh and a shin
// with its foot for each leg, and the arms. The feet stay planted until one is
// lifted to step, and the legs reach down to them by a two-bone solve, so a
// figure can turn, lean, crouch or shift its weight without a foot sliding,
// and a walker's body goes on only as far as its strides carry it. Lengths in
// metres, as the figures are modelled (each is drawn S world units a metre).
const HIP_W = 0.11 // each hip joint, out from the middle
const THIGH = 0.44
const SHIN = 0.4 // knee to ankle
const ANKLE = 0.06 // the ankle, over the sole
const HIP_H = 0.885 // the hip joints standing, the knees not quite locked
const FOOT_W = 0.11 // each foot, out from the middle, standing at rest
const SHOULDER_W = 0.29
const SHOULDER_H = 0.62 // over the hip joints
const ARM = 0.62
const SEAT_H = 0.2 // the hip joints of someone sitting cross-legged
// Gaits. step: metres from one footfall to the next; tau: seconds a step
// takes; lift: how high the swinging foot clears the ground; swing: how far
// the arms swing with it.
const STROLL = { step: 0.5, tau: 0.62, lift: 0.08, swing: 0.5 }
const WADE = { step: 0.32, tau: 1.0, lift: 0.14, swing: 0.25 }
const CARRY = { step: 0.46, tau: 0.6, lift: 0.07, swing: 0.45 }
const SHUFFLE = { step: 0, tau: 0.5, lift: 0.05, swing: 0.2 } // turning on the spot
// A planned step, as REC numbers: the body (x, z, heading) and both feet (x, z,
// y) once it is done, which foot moved (0 left, 1 right), when it is done (s
// after the move began), and how high that foot swung.
const REC = 12
// house sizes (L, W in metres), as features/index.js builds them
const HOUSE = { noa: [7, 4.6], mua: [8, 5], aina: [6, 4.2], kuku: [5, 3.6], alii: [12, 7] }
// how far round each kind of planted tree or shrub keeps people off, metres
const PLANT_R = { niu: 0.5, hala: 1.4, ulu: 0.8, kukui: 0.8, maia: 1.3, ki: 0.45, kiRed: 0.45, naupaka: 1.5, aalii: 1.1 }
const LEFT = 0
const RIGHT = 1
// the kuapā's top, over the sea (features/index.js buildPond)
const POND_WALL_TOP = 0.024

function rigParts(rand) {
  const skin = col('#7a4b30', 0.1, rand)
  const cloth = col('#b08a5a', 0.15, rand)
  const torso = new Builder()
  torso.box(0, -0.1, 0, 0.42, 0.32, 0.26, cloth, MAT.plain)
  torso.box(0, 0.17, 0, 0.44, 0.5, 0.24, skin, MAT.skin, 0, 0.85)
  torso.blob(0, 0.8, 0.01, 0.13, 0.15, 0.13, col('#3a2418', 0.1, rand), MAT.skin, 1, false)
  // each limb hangs from its joint at the origin, down -y, its front to +z
  const thigh = new Builder()
  thigh.box(0, 0.02, 0, 0.16, -THIGH - 0.04, 0.18, skin, MAT.skin, 0, 0.8)
  const shin = new Builder()
  shin.box(0, 0.02, 0, 0.13, -SHIN - 0.02, 0.14, skin, MAT.skin, 0, 0.85)
  shin.box(0, -SHIN - ANKLE, 0.05, 0.11, 0.075, 0.25, skin, MAT.skin)
  const arm = new Builder()
  arm.box(0, 0.03, 0, 0.11, -ARM - 0.03, 0.12, skin, MAT.skin, 0, 0.85)
  return { torso: torso.geometry(), thigh: thigh.geometry(), shin: shin.geometry(), arm: arm.geometry(), cloth }
}

/** A hand tool from the grip down, white so each one takes its own colour: the stone pounder or the wooden kapa beater. */
function handTool() {
  const B = new Builder()
  const c = [1, 1, 1]
  B.box(0, 0.05, 0, 0.05, -0.13, 0.05, c, MAT.plain)
  B.box(0, -0.08, 0, 0.085, -0.2, 0.085, c, MAT.plain, 0, 1.35)
  return B.geometry()
}

/** An ʻauamo: a carrying pole on the shoulder (along z), a bundle of kalo hung from each end. */
function auamo(rand) {
  const B = new Builder()
  const wood = col('#7a5a3a', 0.1, rand)
  const corm = col('#6b4a3a', 0.15, rand)
  const leaf = col('#4f7a2e', 0.15, rand)
  B.box(0, 0.03, 0, 0.05, 0.05, 1.7, wood, MAT.wood)
  for (const z of [-0.74, 0.74]) {
    B.box(0, 0.05, z, 0.015, -0.26, 0.015, wood, MAT.plain)
    B.blob(0, -0.3, z, 0.17, 0.13, 0.15, corm, MAT.plain, 7)
    B.blob(0, -0.13, z, 0.11, 0.17, 0.11, leaf, MAT.leaf, 8, false)
  }
  return B.geometry()
}

// What someone sitting at their work has in front of them, built into one
// still mesh with the crossed legs they sit on (the rest of them moves).
function lap(B, cloth) {
  B.box(0, 0, 0, 0.6, 0.2, 0.42, cloth, MAT.plain)
}
/** A papa kuʻi ʻai with a lump of kalo on it being pounded. */
function poiBoard(B, rand) {
  B.box(0, 0, 0.5, 1.0, 0.09, 0.44, col('#6b4a2f', 0.1, rand), MAT.wood)
  B.blob(0, 0.1, 0.5, 0.15, 0.07, 0.13, col('#8c7b86', 0.1, rand), MAT.plain, 3)
}
/** A kua, the log anvil kapa is beaten out on, a strip of wet bark across it. */
function kua(B, rand) {
  B.box(0, 0, 0.48, 1.4, 0.15, 0.2, col('#5e4128', 0.1, rand), MAT.wood)
  B.box(0.12, 0.15, 0.48, 0.75, 0.012, 0.24, col('#e8dcc4', 0.05, rand), MAT.kapa)
}
/** A net spread out on the sand to be mended, the rest of it in a heap. */
function spreadNet(B, rand) {
  const c = col('#4a3c2c', 0.1, rand)
  B.box(0, -0.02, 0.95, 1.6, 0.05, 1.3, c, MAT.plain)
  B.box(0, -0.02, 1.62, 1.7, 0.07, 0.06, col('#c9b48a', 0.1, rand), MAT.plain)
  B.blob(1.05, 0.04, 0.45, 0.32, 0.14, 0.26, c, MAT.plain, 5)
}

/** A value that eases from where it is to where it is sent, over a while. */
class Ease {
  constructor(v = 0) {
    this.a = v
    this.b = v
    this.t0 = 0
    this.d = 1
  }

  at(t) {
    const u = (t - this.t0) / this.d
    if (u >= 1) return this.b
    if (u <= 0) return this.a
    return this.a + (this.b - this.a) * u * u * (3 - 2 * u)
  }

  /** Ease to v from time t over d seconds; returns when it gets there. */
  to(v, t, d) {
    this.a = this.at(t)
    this.b = v
    this.t0 = t
    this.d = Math.max(1e-3, d)
    return t + this.d
  }

  /** Be v from now on. */
  set(v) {
    this.a = this.b = v
    this.t0 = 0
  }
}

/** Point (x, z) to segment ab, in x/z. */
function segDist(x, z, ax, az, bx, bz) {
  const ux = bx - ax
  const uz = bz - az
  const l2 = ux * ux + uz * uz
  const t = l2 > 0 ? Math.max(0, Math.min(1, ((x - ax) * ux + (z - az) * uz) / l2)) : 0
  const ex = x - ax - ux * t
  const ez = z - az - uz * t
  return Math.sqrt(ex * ex + ez * ez)
}

/** The least distance between segments ab and cd, in x/z (nothing where they cross). */
function segSeg(ax, az, bx, bz, cx, cz, dx, dz) {
  const o1 = (bx - ax) * (cz - az) - (bz - az) * (cx - ax)
  const o2 = (bx - ax) * (dz - az) - (bz - az) * (dx - ax)
  const o3 = (dx - cx) * (az - cz) - (dz - cz) * (ax - cx)
  const o4 = (dx - cx) * (bz - cz) - (dz - cz) * (bx - cx)
  if (o1 * o2 < 0 && o3 * o4 < 0) return 0
  return Math.min(segDist(ax, az, cx, cz, dx, dz), segDist(bx, bz, cx, cz, dx, dz), segDist(cx, cz, ax, az, bx, bz), segDist(dx, dz, ax, az, bx, bz))
}

/** How far (x, z) is from the edge of a polygon. */
function edgeDist(poly, x, z) {
  let d = Infinity
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) d = Math.min(d, segDist(x, z, poly[j][0], poly[j][1], poly[i][0], poly[i][1]))
  return d
}

/**
 * Draw and throw away the numbers the people about their work once took from
 * Life's main sequence, when each was put down at random round their site:
 * in the loʻi (a paddy, and where in it if it was flooded), round each
 * village, at the heiau, the canoes and the fishpond gates.
 */
function burnPlaced(rand, sites) {
  for (const l of sites.loi) {
    for (let k = l.model ? 16 : 5; k > 0; k--) if (l.paddies[Math.floor(rand() * l.paddies.length)].flood) for (let j = 0; j < 4; j++) rand()
  }
  for (const v of sites.villages) for (let k = (v.model ? 12 : v.alii ? 14 : 4) * 5; k > 0; k--) rand()
  for (const h of sites.heiau) if (h.model || h.kind === 'luakini') for (let k = 0; k < 9; k++) rand()
  for (const c of sites.canoes) for (let k = (c.village === sites.model ? 5 : 2) * 4; k > 0; k--) rand()
  for (let k = 0; k < sites.ponds.length; k++) rand()
}

/** A box from a to b with a w × d cross-section: limbs and bodies at a slant. */
function beam(B, a, b, w, d, color, mat) {
  const ax = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
  const l = Math.hypot(ax[0], ax[1], ax[2]) || 1
  const y = [ax[0] / l, ax[1] / l, ax[2] / l]
  // the cross-section's w side as near world x as it can be, d side across it
  const ref = Math.abs(y[0]) < 0.9 ? [1, 0, 0] : [0, 0, 1]
  const dp = ref[0] * y[0] + ref[1] * y[1] + ref[2] * y[2]
  const u = [ref[0] - dp * y[0], ref[1] - dp * y[1], ref[2] - dp * y[2]]
  const ul = Math.hypot(u[0], u[1], u[2])
  for (let k = 0; k < 3; k++) u[k] /= ul
  const v = [u[1] * y[2] - u[2] * y[1], u[2] * y[0] - u[0] * y[2], u[0] * y[1] - u[1] * y[0]]
  const ring = (o) =>
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([i, k]) => [
      o[0] + (u[0] * i * w + v[0] * k * d) / 2,
      o[1] + (u[1] * i * w + v[1] * k * d) / 2,
      o[2] + (u[2] * i * w + v[2] * k * d) / 2,
    ])
  B.hexa(ring(a), ring(b), color, mat)
}

// Surfers and sledders are built in their board's frame: nose toward +z, the
// deck at y = 0, in metres. A board and whoever is on it share one transform.
function surfer(pose, rand) {
  const B = new Builder()
  const skin = col('#7a4b30', 0.1, rand)
  const cloth = col('#b08a5a', 0.15, rand)
  const hair = col('#3a2418', 0.1, rand)
  if (pose === 'ride') {
    // side-on to the board, knees bent, arms out along it for balance
    for (const f of [1, -1]) {
      beam(B, [0, 0, 0.38 * f], [0.1, 0.46, 0.3 * f], 0.13, 0.13, skin, MAT.skin)
      beam(B, [0.1, 0.46, 0.3 * f], [0, 0.86, 0.12 * f], 0.15, 0.15, skin, MAT.skin)
    }
    B.box(0, 0.74, 0, 0.28, 0.24, 0.42, cloth, MAT.plain)
    beam(B, [0, 0.84, 0], [0.12, 1.34, 0], 0.24, 0.42, skin, MAT.skin)
    beam(B, [0.1, 1.28, 0.2], [0.2, 1.1, 0.8], 0.1, 0.1, skin, MAT.skin)
    beam(B, [0.1, 1.28, -0.2], [0.16, 1.2, -0.76], 0.1, 0.1, skin, MAT.skin)
    B.blob(0.16, 1.5, 0, 0.13, 0.15, 0.13, hair, MAT.skin, 4, false)
  } else if (pose === 'sit') {
    // astride, toward the tail, looking over the nose; legs hang in the water
    for (const f of [1, -1]) {
      beam(B, [0.12 * f, 0.04, -0.42], [0.22 * f, -0.06, -0.02], 0.15, 0.15, skin, MAT.skin)
      beam(B, [0.22 * f, -0.06, -0.02], [0.24 * f, -0.5, 0.08], 0.13, 0.13, skin, MAT.skin)
      beam(B, [0.25 * f, 0.56, -0.44], [0.2 * f, 0.1, -0.16], 0.1, 0.1, skin, MAT.skin)
    }
    B.box(0, -0.02, -0.45, 0.42, 0.2, 0.3, cloth, MAT.plain)
    B.box(0, 0.12, -0.46, 0.42, 0.52, 0.24, skin, MAT.skin, 0, 0.85)
    B.blob(0, 0.82, -0.44, 0.13, 0.15, 0.13, hair, MAT.skin, 5, false)
  } else {
    // prone, head up and forward; the arms are their own instances so they can paddle
    for (const f of [1, -1]) beam(B, [0.1 * f, 0.08, -0.32], [0.1 * f, 0.07, -1.25], 0.15, 0.14, skin, MAT.skin)
    B.box(0, 0, -0.3, 0.4, 0.2, 0.3, cloth, MAT.plain)
    beam(B, [0, 0.11, -0.16], [0, 0.17, 0.52], 0.42, 0.24, skin, MAT.skin)
    B.blob(0, 0.32, 0.72, 0.13, 0.14, 0.15, hair, MAT.skin, 6, false)
  }
  return B.geometry()
}

/** One arm hanging from its shoulder at the origin. */
function arm(rand) {
  const B = new Builder()
  beam(B, [0, 0, 0], [0, -0.62, 0], 0.1, 0.1, col('#7a4b30', 0.1, rand), MAT.skin)
  return B.geometry()
}

function surfboard(rand) {
  const B = new Builder()
  const wood = col('#6b4630', 0.1, rand)
  // a long alaia of koa, its nose rounded off
  B.box(0, -0.12, -0.2, 0.56, 0.12, 3.2, wood, MAT.wood)
  B.hexa([[-0.28, -0.12, 1.4], [0.28, -0.12, 1.4], [0.1, -0.11, 1.85], [-0.1, -0.11, 1.85]], [[-0.28, 0, 1.4], [0.28, 0, 1.4], [0.1, -0.03, 1.85], [-0.1, -0.03, 1.85]], wood, MAT.wood)
  return B.geometry()
}

/** A papa hōlua: two long runners turned up at the nose, crossbars and a narrow deck. */
function holuaSled(B, rand) {
  const wood = col('#5e3d27', 0.1, rand)
  const pale = col('#9c7a52', 0.1, rand)
  for (const f of [1, -1]) {
    B.box(0.09 * f, 0, -0.3, 0.05, 0.1, 3.0, wood, MAT.wood)
    beam(B, [0.09 * f, 0.05, 1.18], [0.09 * f, 0.22, 1.8], 0.05, 0.1, wood, MAT.wood)
  }
  for (const z of [-1.6, -0.95, -0.3, 0.35, 1.0]) B.box(0, 0.1, z, 0.3, 0.03, 0.07, wood, MAT.wood)
  B.box(0, 0.13, -0.2, 0.24, 0.03, 2.4, pale, MAT.kapa)
}
const SLED_DECK = 0.16 // m

function sled(rand) {
  const B = new Builder()
  holuaSled(B, rand)
  return B.geometry()
}

/** A sledder down on the sled, head first, hands on the runners up by the nose. */
function sledder(rand) {
  const B = new Builder()
  holuaSled(B, rand)
  const body = surfer('prone', rand)
  const p = body.attributes.position.array
  const n = body.attributes.normal.array
  const c = body.attributes.color.array
  const m = body.attributes.aMat.array
  for (let i = 0; i < p.length; i += 3) {
    B.pos.push(p[i], p[i + 1] + SLED_DECK, p[i + 2] + 0.5)
    B.nor.push(n[i], n[i + 1], n[i + 2])
    B.col.push(c[i], c[i + 1], c[i + 2])
    B.mat.push(m[i / 3])
  }
  const skin = col('#7a4b30', 0.1, rand)
  for (const f of [1, -1]) beam(B, [0.25 * f, SLED_DECK + 0.2, 0.95], [0.12 * f, SLED_DECK + 0.02, 1.5], 0.1, 0.1, skin, MAT.skin)
  return B.geometry()
}

function bird(rand) {
  const B = new Builder()
  const c = col('#1d1d22', 0.1, rand)
  // ʻiwa: long, sharply bent wings, thin sheets seen from above and below
  const wing = [
    [[0, 0, 0.6], [-1.1, 0.25, -0.1], [0, 0, -0.3]],
    [[0, 0, 0.6], [0, 0, -0.3], [1.1, 0.25, -0.1]],
    [[-1.1, 0.25, -0.1], [-2.0, -0.1, -0.5], [-0.6, 0.15, -0.25]],
    [[1.1, 0.25, -0.1], [0.6, 0.15, -0.25], [2.0, -0.1, -0.5]],
    [[0, 0, -0.3], [-0.25, 0, -1.0], [0.25, 0, -1.0]],
  ]
  for (const [a, b, d] of wing) {
    B.tri(a, b, d, c, MAT.plain)
    B.tri(a, d, b, c, MAT.plain)
  }
  return B.geometry()
}

/**
 * The gap between two segments in x/z, ab and cd (boards seen from above),
 * after Ericson's closest points: `out.d`, and the vector from the closest
 * point on cd to the closest point on ab in out.x, out.z.
 */
function segGap(ax, az, bx, bz, cx, cz, dx, dz, out) {
  const ux = bx - ax
  const uz = bz - az
  const vx = dx - cx
  const vz = dz - cz
  const wx = ax - cx
  const wz = az - cz
  const a = ux * ux + uz * uz
  const b = ux * vx + uz * vz
  const c = vx * vx + vz * vz
  const d = ux * wx + uz * wz
  const e = vx * wx + vz * wz
  const D = a * c - b * b
  const clamp = (x) => Math.max(0, Math.min(1, x))
  let s = D > 1e-12 ? clamp((b * e - c * d) / D) : 0
  let t = (b * s + e) / c
  if (t < 0) {
    t = 0
    s = clamp(-d / a)
  } else if (t > 1) {
    t = 1
    s = clamp((b - d) / a)
  }
  out.x = wx + ux * s - vx * t
  out.z = wz + uz * s - vz * t
  out.d = Math.hypot(out.x, out.z)
  return out
}

const smokeVertex = /* glsl */ `
in float aAge;
in float aSeed;
uniform float uTime;
uniform vec2 uWindVec;
out float vAlpha;
void main() {
  float t = fract(uTime * 0.05 + aSeed);
  vec3 p = position;
  p.y += t * 0.55;
  p.xz += uWindVec * t * t * 0.35 + vec2(sin(uTime * 0.7 + aSeed * 20.0), cos(uTime * 0.6 + aSeed * 13.0)) * 0.02 * t;
  vec4 mv = viewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (14.0 + 60.0 * t) / max(-mv.z, 0.2) * 3.0;
  vAlpha = (1.0 - t) * smoothstep(0.0, 0.08, t) * 0.32;
}
`
const smokeFragment = /* glsl */ `
uniform vec3 uSkyColor;
uniform vec3 uSunColor;
in float vAlpha;
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float d = dot(q, q);
  if (d > 1.0) discard;
  float a = vAlpha * (1.0 - d);
  gl_FragColor = vec4((uSkyColor * 0.8 + uSunColor * 0.25) * 0.9, a);
}
`

export class Life {
  constructor(app) {
    this.app = app
    this._m = new THREE.Matrix4()
    this._q = new THREE.Quaternion()
    this._p = new THREE.Vector3()
    this._s = new THREE.Vector3()
    this._e = new THREE.Euler()
    this._c = new THREE.Color()
    const meta = app.island.meta
    const sites = meta.sites
    const rand = mulberry32(meta.seed + 2024)
    this.rand = rand
    this.group = new THREE.Group()
    this.mat = objectMaterial(app.shared, { fade: [24, 34] })
    const T = app.terrain
    const ground = (x, z) => Math.max(0, T.heightAt(x, z))

    // --- people about their work ------------------------------------------------------
    // (surfers, sledders and the hōlua crowd draw on their own sequence, and
    // everyone else here on another, so each stays put when the other changes)
    const own = mulberry32(meta.seed + 2025)
    const track = app.features.holuaPath
    this.frand = mulberry32(meta.seed + 2026)
    this.spot = { x: 0, z: 0 }
    this.folk = []
    this.folkSites = []
    this.placeFolk(sites, own, track)
    // (they were once placed from the main sequence, so draw from it as many
    // numbers as that took, and the fishing canoes, the voyager, the birds and
    // the smoke placed from it next come out just where they always have)
    burnPlaced(rand, sites)
    this.buildFolk(rand)

    // --- the Makahiki procession -----------------------------------------------------------
    this.trail = meta.trail.slice()
    let area = 0
    for (let i = 0; i < this.trail.length; i++) {
      const a = this.trail[i]
      const b = this.trail[(i + 1) % this.trail.length]
      area += a[0] * b[1] - b[0] * a[1]
    }
    // clockwise seen from above with north up, i.e. positive area in x/z
    if (area < 0) this.trail.reverse()
    this.trailLen = [0]
    for (let i = 1; i <= this.trail.length; i++) {
      const a = this.trail[i - 1]
      const b = this.trail[i % this.trail.length]
      this.trailLen.push(this.trailLen[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]))
    }
    // start the procession just before the ahu nearest the chief's centre
    const alii = sites.alii || sites.villages[0]
    let s0 = 0
    let bd = Infinity
    for (let i = 0; i < this.trail.length; i++) {
      const d = Math.hypot(this.trail[i][0] - alii.x, this.trail[i][1] - alii.z)
      if (d < bd) {
        bd = d
        s0 = this.trailLen[i]
      }
    }
    this.procS = s0 - 0.6
    const B = new Builder()
    akuaLoa(B, rand)
    this.akua = new THREE.Mesh(B.geometry(), this.mat)
    this.akua.frustumCulled = false
    this.group.add(this.akua)

    // --- canoes out on the fishing grounds, and a voyager ------------------------------------------
    this.boats = []
    const boatGeo = (() => {
      const b = new Builder()
      waa(b, rand, 8)
      return b.geometry()
    })()
    const sitGeo = person('sit', rand)
    const model = meta.ahupuaa.find((a) => a.id === sites.model)
    for (let k = 0; k < 4; k++) {
      const c = sites.canoes[k % sites.canoes.length]
      const base = k < 3 && model ? model.mouth : [c.x, c.z]
      const dirSea = k < 3 ? Math.atan2(model.mouth[1] - model.topZ, model.mouth[0] - model.topX) : c.dir
      const r = 5 + rand() * 5
      const ox = base[0] + Math.cos(dirSea) * r + (rand() - 0.5) * 3
      const oz = base[1] + Math.sin(dirSea) * r + (rand() - 0.5) * 3
      if (T.heightAt(ox, oz) > -0.02) continue
      const g = new THREE.Group()
      const hull = new THREE.Mesh(boatGeo, this.mat)
      hull.scale.setScalar(S)
      g.add(hull)
      for (const off of [-1.6, 1.4]) {
        const p = new THREE.Mesh(sitGeo, this.mat)
        p.scale.setScalar(S)
        p.position.set(off * S, 0.45 * S, 0)
        p.rotation.y = Math.PI / 2
        g.add(p)
      }
      g.position.set(ox, 0, oz)
      g.rotation.y = rand() * 6.28
      this.group.add(g)
      this.boats.push({ g, x: ox, z: oz, ph: rand() * 6.28, drift: rand() * 6.28, crew: 2 })
    }
    const kb = new Builder()
    kaulua(kb, rand)
    this.voyager = new THREE.Mesh(kb.geometry(), this.mat)
    this.voyager.scale.setScalar(S)
    this.voyager.frustumCulled = false
    this.group.add(this.voyager)
    this.voyagerS = 0

    // --- surfers on the breaks -------------------------------------------------------------------------
    // Each break is a stretch of reef edge that a set wave peels along. A few
    // surfers sit out past it; when a set comes, one or two paddle into a wave,
    // ride it down the line, kick out or wipe out, and paddle the long way back.
    this.breaks = []
    this.surfers = []
    for (const site of sites.surf) {
      const brk = this.layBreak(site, T, sites.ponds)
      if (!brk) continue
      this.breaks.push(brk)
      // three places in the lineup, strung along the break well over a
      // board's length apart (along it square to seaward, which the line of
      // the reef need not be), each a little further out or in than the next
      let ax = brk.tx[0] - (brk.tx[0] * brk.nx[0] + brk.tz[0] * brk.nz[0]) * brk.nx[0]
      let az = brk.tz[0] - (brk.tx[0] * brk.nx[0] + brk.tz[0] * brk.nz[0]) * brk.nz[0]
      const al = Math.hypot(ax, az) || 1
      ax /= al
      az /= al
      for (let k = 0; k < 3; k++) {
        const u = k - 1
        const out = own() * 0.04
        const sx = brk.lineX + ax * u * 0.11 + brk.nx[0] * out
        const sz = brk.lineZ + az * u * 0.11 + brk.nz[0] * out
        const sf = { brk, state: 'sit', x: sx, z: sz, slotX: sx, slotZ: sz, head: brk.seaHead + (own() - 0.5) * 0.3, look: (own() - 0.5) * 0.3, since: -own() * 60 }
        Object.assign(sf, { s: 0, ph: own() * 6.28, scale: 0.92 + own() * 0.2, pace: 0.85 + own() * 0.3, tint: own() < 0.3 ? 2.2 : 0.75 + own() * 0.3, wave: 0, take: 0, lead: 0.05, tTake: 0, a0: 0, dur: 0, fall: false, t: 0, sx: 0, sz: 0, fx: 0, fz: 0, wx: 0, wz: 0, leg: 0 })
        Object.assign(sf, { pose: 'sit', pitch: 0, roll: 0, stroke: 0, tilt: true, tried: false })
        brk.surfers.push(sf)
        this.surfers.push(sf)
      }
    }
    const nSurf = Math.max(1, this.surfers.length)
    const dynamic = (geo, count) => {
      const mesh = new THREE.InstancedMesh(geo, this.mat, count)
      mesh.frustumCulled = false
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      mesh.count = 0
      this.group.add(mesh)
      return mesh
    }
    this.boards = dynamic(surfboard(own), nSurf)
    // dark oiled koa or pale wiliwili, board by board
    this.boards.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(nSurf * 3).fill(1), 3)
    this.surfPose = { ride: dynamic(surfer('ride', own), nSurf), sit: dynamic(surfer('sit', own), nSurf), prone: dynamic(surfer('prone', own), nSurf) }
    this.arms = dynamic(arm(own), nSurf * 2)
    this._sw = { age: 0, height: 0, next: 0, id: 0 }
    this._sep = { d: 0, x: 0, z: 0 }
    this._mb = new THREE.Matrix4()
    this._ml = new THREE.Matrix4()
    this._ma = new THREE.Matrix4()
    this.view = { x: 0, z: 0, dist: Infinity, remain: 0 }
    this.counts = { board: 0, ride: 0, sit: 0, prone: 0, arm: 0 }

    // --- the hōlua ------------------------------------------------------------------------------------------
    // Riders take turns: one lies down on the sled at the top and goes; at the
    // foot they get up, shoulder the sled and walk all the way back up beside
    // the track, while the next one waits a while and then goes.
    this.holua = null
    if (track && track.length > 1) {
      const n = track.length
      const h = { x: new Float32Array(n), y: new Float32Array(n), z: new Float32Array(n), n, riders: [], runner: null, time: 0, next: 6 + own() * 20, watching: false }
      for (let k = 0; k < n; k++) {
        h.x[k] = track[k][0]
        h.y[k] = track[k][1] + TRACK_TOP
        h.z[k] = track[k][2]
      }
      h.len = Math.hypot(h.x[n - 1] - h.x[0], h.z[n - 1] - h.z[0])
      h.ds = h.len / (n - 1)
      h.dx = (h.x[n - 1] - h.x[0]) / h.len
      h.dz = (h.z[n - 1] - h.z[0]) / h.len
      h.head = Math.atan2(h.dx, h.dz)
      this.clearTrack(h)
      const R = 10
      for (let k = 0; k < R; k++) {
        // waiting places at the top, either side of the start
        const side = k % 2 ? 1 : -1
        const back = (k >> 1) * 0.035
        // (each walks back up on the side their place is, so nobody crosses the head of the track)
        const r = { state: k < 2 ? 'wait' : 'walk', s: 0, v: 0, t: 0, since: -k, side, ph: own() * 6.28, pace: 0.9 + own() * 0.2 }
        r.spotS = -0.02 - back
        r.spotOff = side * (0.09 + back * 0.6)
        // the way there from the top of the walk-back lane: out past
        // everyone else's place and the sleds laid beside it, back, then in
        r.wayOff = side * (0.14 + back * 0.6)
        // the rest are already somewhere on the long walk back up
        r.s = k < 2 ? 0 : h.len * (0.1 + (0.85 * (k - 2)) / (R - 2))
        h.riders.push(r)
      }
      // a practice run, to know when a sled reaches each point of the track
      h.tAt = new Float32Array(n)
      h.vAt = new Float32Array(n)
      const run = { s: SLED_HALF, v: 1.5 }
      let t = 0
      let k = 0
      for (let done = false; k < n && t < 600; t += 0.05) {
        while (k < n && k * h.ds <= run.s) {
          h.tAt[k] = t
          h.vAt[k] = run.v
          k++
        }
        if (done) break
        done = this.slide(h, run, 0.05)
      }
      for (; k < n; k++) {
        h.tAt[k] = t
        h.vAt[k] = 0
      }
      this.holua = h
      this._pose = { y: 0, pitch: 0 }
      this.sleds = dynamic(sled(own), R)
      this.sledders = dynamic(sledder(own), 1)
    }

    // --- ʻiwa soaring over the coast ---------------------------------------------------------------------
    this.birds = new THREE.InstancedMesh(bird(rand), this.mat, 12)
    this.birds.frustumCulled = false
    this.birds.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    this.group.add(this.birds)
    this.birdCentres = []
    for (let k = 0; k < 12; k++) {
      const v = sites.villages[Math.floor(rand() * sites.villages.length)]
      this.birdCentres.push({ x: v.x + (rand() - 0.5) * 6, z: v.z + (rand() - 0.5) * 6, r: 0.6 + rand() * 1.4, h: 0.9 + rand() * 1.4, ph: rand() * 6.28, sp: 0.08 + rand() * 0.06 })
    }

    // --- imu smoke ---------------------------------------------------------------------------------------
    const pts = []
    const seeds = []
    for (const v of sites.villages) {
      for (let k = 0; k < 14; k++) {
        pts.push(v.x + 0.05, ground(v.x, v.z) + 0.01, v.z + 0.05)
        seeds.push(k / 14 + rand() * 0.05)
      }
    }
    const sg = new THREE.BufferGeometry()
    sg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
    sg.setAttribute('aSeed', new THREE.Float32BufferAttribute(seeds, 1))
    sg.setAttribute('aAge', new THREE.Float32BufferAttribute(new Float32Array(seeds.length), 1))
    this.smoke = new THREE.Points(
      sg,
      new THREE.ShaderMaterial({
        vertexShader: smokeVertex,
        fragmentShader: smokeFragment,
        uniforms: { uTime: app.shared.uniforms.uTime, uWindVec: app.shared.uniforms.uWindVec, uSkyColor: app.shared.uniforms.uSkyColor, uSunColor: app.shared.uniforms.uSunColor },
        transparent: true,
        depthWrite: false,
      }),
    )
    this.smoke.frustumCulled = false
    this.smoke.renderOrder = 2
    this.group.add(this.smoke)
  }

  /**
   * Find a break's line near a generator surf spot: the reef edge where the
   * water deepens past BREAK_DEPTH, followed the way a set wave peels along it
   * (toward where the swell arrives later) for as long as there is open reef
   * flat inside it and no fishpond wall in the way. Resampled evenly; `g` is
   * how far the swell has to travel past the start to break at each point.
   */
  layBreak(site, T, ponds) {
    const sd = this.app.ocean.swellDir
    const depth = (x, z) => -T.metresAt(x, z)
    const e = 0.03
    const gradX = (x, z) => (depth(x + e, z) - depth(x - e, z)) / (2 * e)
    const gradZ = (x, z) => (depth(x, z + e) - depth(x, z - e)) / (2 * e)
    const cx = Math.cos(site.dir)
    const cz = Math.sin(site.dir)
    let x0 = null
    let z0 = 0
    for (let d = 0; d < 1.6; d += 0.01) {
      if (depth(site.x + cx * d, site.z + cz * d) >= BREAK_DEPTH) {
        x0 = site.x + cx * d
        z0 = site.z + cz * d
        break
      }
    }
    if (x0 === null) return null
    const clear = (x, z, nx, nz) => {
      // water just inside the line (a rock further in is fine; a beach is not)
      if (depth(x - nx * 0.1, z - nz * 0.1) < 0.02) return false
      for (const p of ponds) {
        if (Math.hypot(p.cx - x, p.cz - z) > p.r + 1.5) continue
        if (insidePoly(p.wall, x, z)) return false
        for (const w of p.wall) if (Math.hypot(w[0] - x, w[1] - z) < 0.25) return false
      }
      return true
    }
    const follow = (sign) => {
      const out = []
      let x = x0
      let z = z0
      for (let k = 0; k < 70; k++) {
        const ax = gradX(x, z)
        const az = gradZ(x, z)
        const gl = Math.hypot(ax, az)
        if (gl < 4) break
        let tx = -az / gl
        let tz = ax / gl
        if (tx * sd[0] + tz * sd[1] < 0) {
          tx = -tx
          tz = -tz
        }
        // where the edge turns to face the swell square on, a wave would
        // close out all at once rather than peel
        if (tx * sd[0] + tz * sd[1] < 0.3) break
        x += tx * 0.03 * sign
        z += tz * 0.03 * sign
        for (let it = 0; it < 4; it++) {
          const bx = gradX(x, z)
          const bz = gradZ(x, z)
          const g2 = bx * bx + bz * bz
          if (g2 < 1) break
          const dd = BREAK_DEPTH - depth(x, z)
          x += (bx * dd) / g2
          z += (bz * dd) / g2
        }
        if (!clear(x, z, ax / gl, az / gl)) break
        out.push([x, z])
      }
      return out
    }
    if (!clear(x0, z0, cx, cz)) return null
    const up = follow(-1).reverse()
    const line = [...up, [x0, z0], ...follow(1)]
    const arc = [0]
    for (let k = 1; k < line.length; k++) arc.push(arc[k - 1] + Math.hypot(line[k][0] - line[k - 1][0], line[k][1] - line[k - 1][1]))
    const total = arc[arc.length - 1]
    if (total < 0.5) return null
    // ride the stretch that starts at the generator's spot if there is room
    // down the line, otherwise far enough up it that the ride fits
    const ride = Math.min(1.4, total)
    const s0 = Math.min(arc[up.length], total - ride)
    const step = 0.03
    const n = Math.floor(ride / step) + 1
    const brk = { n, step, len: (n - 1) * step, x: new Float32Array(n), z: new Float32Array(n), tx: new Float32Array(n), tz: new Float32Array(n), nx: new Float32Array(n), nz: new Float32Array(n), g: new Float32Array(n), surfers: [], called: -1, lastT: 0, watching: false, eager: false }
    let j = 0
    for (let k = 0; k < n; k++) {
      const s = s0 + k * step
      while (j < arc.length - 2 && arc[j + 1] < s) j++
      const f = Math.max(0, Math.min(1, (s - arc[j]) / Math.max(1e-6, arc[j + 1] - arc[j])))
      brk.x[k] = line[j][0] + (line[j + 1][0] - line[j][0]) * f
      brk.z[k] = line[j][1] + (line[j + 1][1] - line[j][1]) * f
    }
    for (let k = 0; k < n; k++) {
      const ax = gradX(brk.x[k], brk.z[k])
      const az = gradZ(brk.x[k], brk.z[k])
      const gl = Math.hypot(ax, az) || 1
      brk.nx[k] = ax / gl
      brk.nz[k] = az / gl
      const a = Math.max(0, k - 1)
      const b = Math.min(n - 1, k + 1)
      const tl = Math.hypot(brk.x[b] - brk.x[a], brk.z[b] - brk.z[a]) || 1
      brk.tx[k] = (brk.x[b] - brk.x[a]) / tl
      brk.tz[k] = (brk.z[b] - brk.z[a]) / tl
      // never let it run backwards against the swell, so it can be inverted
      const g = (brk.x[k] - brk.x[0]) * sd[0] + (brk.z[k] - brk.z[0]) * sd[1]
      brk.g[k] = k ? Math.max(g, brk.g[k - 1] + 1e-4) : 0
    }
    // the lineup: just out past the peak, where the water is deep enough that
    // nothing breaks, and near enough to paddle into a wave from in the few
    // seconds a set wave gives (LEAD)
    let lx = brk.x[0] + brk.nx[0] * 0.1
    let lz = brk.z[0] + brk.nz[0] * 0.1
    for (let k = 0; k < 3 && depth(lx, lz) < BREAK_DEPTH + 2; k++) {
      lx += brk.nx[0] * 0.02
      lz += brk.nz[0] * 0.02
    }
    brk.lineX = lx
    brk.lineZ = lz
    brk.seaHead = Math.atan2(brk.nx[0], brk.nz[0])
    return brk
  }

  /**
   * Hōlua grounds are kept clear: no tree on the causeway, in the lanes the
   * riders walk back up, or where the crowd stands. The forest reads this mask
   * as it builds each tile, which it first does on the first frame, after
   * everything is constructed (waterfalls.js clears its falls the same way).
   */
  clearTrack(h) {
    const veg = this.app.vegetation
    if (!veg || !veg.cleared) return
    const m = veg.cleared
    const N = HYDRO_RES
    const cell = WORLD / N
    // a cell's trees stand anywhere in it, so take every cell that reaches
    // into the band, out to 0.24 either side of the centre line (the crowd
    // stands to 0.2) and from behind the waiting places to past the foot
    const reach = 0.24 + 0.5 * cell * (Math.abs(h.dx) + Math.abs(h.dz))
    const s0 = -0.2 - reach
    const s1 = h.len + reach
    const xs = [h.x[0] + h.dx * s0, h.x[0] + h.dx * s1]
    const zs = [h.z[0] + h.dz * s0, h.z[0] + h.dz * s1]
    const i0 = Math.max(0, Math.floor((Math.min(...xs) - reach + HALF) / cell))
    const i1 = Math.min(N - 1, Math.floor((Math.max(...xs) + reach + HALF) / cell))
    const j0 = Math.max(0, Math.floor((Math.min(...zs) - reach + HALF) / cell))
    const j1 = Math.min(N - 1, Math.floor((Math.max(...zs) + reach + HALF) / cell))
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const px = -HALF + (i + 0.5) * cell - h.x[0]
        const pz = -HALF + (j + 0.5) * cell - h.z[0]
        const s = px * h.dx + pz * h.dz
        if (s > s0 && s < s1 && Math.abs(pz * h.dx - px * h.dz) < reach) m[j * N + i] = 1
      }
    }
    if (veg.tiles && veg.tiles.size) {
      veg.tiles.clear()
      veg.lastSelection = ''
    }
  }

  /** The surfed stretch of reef nearest (x, z), if there is one within a few hundred metres. */
  breakNear(x, z) {
    let best = null
    let bd = 3
    for (const brk of this.breaks) {
      const d = Math.hypot(brk.x[0] - x, brk.z[0] - z)
      if (d < bd) {
        bd = d
        best = brk
      }
    }
    return best
  }

  /** Arc length along a break where the swell has travelled g past its start. */
  breakS(brk, g) {
    const G = brk.g
    if (g <= 0) return 0
    if (g >= G[brk.n - 1]) return brk.len
    let lo = 0
    let hi = brk.n - 1
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1
      if (G[mid] <= g) lo = mid
      else hi = mid
    }
    return (lo + (g - G[lo]) / (G[hi] - G[lo])) * brk.step
  }

  // --- people about their work ---------------------------------------------------------

  /**
   * Everyone who stays about their work, placed from the generator's sites as
   * they stand now: in the loʻi, among the houses of each kauhale, at the
   * canoes, on the fishpond walls, on the heiau court and round the hōlua.
   * Nobody is put in a stream, a house, a wall, the sea or a paddy they don't
   * work. Each site's people are listed together, so that only the sites near
   * the camera are moved, and their instances lie together in the buffers.
   */
  placeFolk(sites, own, track) {
    const T = this.app.terrain
    const r = this.frand
    const { open, room, take, clearWalk, linesClear, plantsClear } = this.openGround()
    // (kept for the walks and steps people take later)
    this.open = open
    this.clearWalk = clearWalk
    this.linesClear = linesClear
    let site = null
    const begin = (x, z) => {
      site = { x, z, y: Math.max(0, T.heightAt(x, z)), r: 0, i0: this.folk.length, i1: 0 }
      this.folkSites.push(site)
    }
    const end = () => {
      site.i1 = this.folk.length
      for (let i = site.i0; i < site.i1; i++) site.r = Math.max(site.r, Math.hypot(this.folk[i].x - site.x, this.folk[i].z - site.z))
      if (site.i1 === site.i0) this.folkSites.pop()
    }
    const add = (kind, x, z, yaw, o = {}) => {
      const p = this.figure(kind, x, z, yaw, o)
      this.folk.push(p)
      return p
    }
    const pick = (list, test) => {
      for (let k = 0; k < 30 && list.length; k++) {
        const q = list[Math.floor(r() * list.length)]
        if (test(q)) return q
      }
      return null
    }

    // --- the kauhale: at work by the house walls, sitting together, talking,
    // standing about, and a few going about between the houses
    for (const v of sites.villages) {
      begin(v.x, v.z)
      const big = v.model || v.alii
      const spots = []
      for (const h of sites.houses) {
        if (h.village !== v.id || Math.hypot(h.x - v.x, h.z - v.z) > 1.6) continue
        const [L, W] = HOUSE[h.kind] || HOUSE.noa
        const sc = h.scale || 1
        const c = Math.cos(h.rot)
        const s = Math.sin(h.rot)
        // (out past the paepae, which reaches 0.9 m beyond the walls)
        const ex = ((L * sc) / 2 + 1.7) * S
        const ez = ((W * sc) / 2 + 1.7) * S
        const q = (L * sc * S) / 4
        for (const [lx, lz, wall] of [[ex, 0, false], [-ex, 0, false], [q, ez, true], [-q, ez, true], [q, -ez, true], [-q, -ez, true]]) {
          const nx = wall ? 0 : Math.sign(lx)
          const nz = wall ? Math.sign(lz) : 0
          spots.push({ x: h.x + lx * c - lz * s, z: h.z + lx * s + lz * c, yaw: Math.atan2(nx * c - nz * s, nx * s + nz * c), wall })
        }
      }
      const free = []
      for (let k = 0; k < 40; k++) {
        const a = r() * Math.PI * 2
        const d = Math.sqrt(r()) * 0.6
        free.push({ x: v.x + Math.cos(a) * d, z: v.z + Math.sin(a) * d, yaw: r() * Math.PI * 2, wall: false })
      }
      const ok = (q, rr = 0.012, steep = 0.35) => open(q.x, q.z, rr, steep) && room(q.x, q.z, rr)
      // pounding poi or beating kapa by a house wall, the board out in front
      const work = (kind) => {
        const q = pick(spots, (q) => {
          if (!q.wall || !ok(q, 0.011, 0.2)) return false
          const bx = q.x + Math.sin(q.yaw) * 0.5 * S
          const bz = q.z + Math.cos(q.yaw) * 0.5 * S
          return open(bx, bz, 0.012, 0.2) && room(bx, bz, 0.012)
        })
        if (!q) return
        add(kind, q.x, q.z, q.yaw, { body: 'seat' })
        take(q.x, q.z, 0.011)
        take(q.x + Math.sin(q.yaw) * 0.5 * S, q.z + Math.cos(q.yaw) * 0.5 * S, 0.012)
      }
      if (big || r() < 0.4) work('poi')
      if (big) work('kapa')
      // sitting together in a ring, facing in
      const ring = (m) => {
        const g = pick(free, (q) => ok(q, 0.034, 0.2))
        if (!g) return
        const a0 = r() * Math.PI * 2
        for (let k = 0; k < m; k++) {
          const a = a0 + (k / m) * Math.PI * 2 + (r() - 0.5) * 0.5
          const x = g.x + Math.sin(a) * 0.019
          const z = g.z + Math.cos(a) * 0.019
          if (!open(x, z, 0.008, 0.2) || !room(x, z, 0.008)) continue
          add('sit', x, z, a + Math.PI + (r() - 0.5) * 0.4, { body: 'sit' })
          take(x, z, 0.009)
        }
      }
      if (big) ring(3)
      else if (r() < 0.5) ring(2)
      // someone sitting out in front of a house
      const q0 = pick(spots, (q) => !q.wall && ok(q, 0.009, 0.2))
      if (q0) {
        add('sit', q0.x, q0.z, q0.yaw + (r() - 0.5) * 0.6, { body: 'sit' })
        take(q0.x, q0.z, 0.009)
      }
      // two talking, face to face
      const pair = () => {
        for (let tries = 0; tries < 10; tries++) {
          const q = pick(r() < 0.5 ? spots : free, (q) => ok(q, 0.011))
          if (!q) return
          const a = r() * Math.PI * 2
          const x = q.x + Math.sin(a) * 0.021
          const z = q.z + Math.cos(a) * 0.021
          if (!open(x, z, 0.011) || !room(x, z, 0.011)) continue
          add('talk', q.x, q.z, a)
          add('talk', x, z, a + Math.PI)
          take(q.x, q.z, 0.011)
          take(x, z, 0.011)
          return
        }
      }
      for (let k = v.alii ? 2 : big || r() < 0.5 ? 1 : 0; k > 0; k--) pair()
      // someone standing about by a house
      const q1 = pick(spots, (q) => ok(q, 0.011))
      if (q1) {
        add('idle', q1.x, q1.z, q1.yaw + (r() - 0.5) * 0.8)
        take(q1.x, q1.z, 0.011)
      }
      // and some going from house to house, between stopping places by the
      // houses and out in the open (the walks between them are found clear
      // of everything and everyone else when they set off)
      const nodes = [...spots, ...free]
      for (let i = nodes.length - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1))
        const t = nodes[i]
        nodes[i] = nodes[j]
        nodes[j] = t
      }
      const keep = []
      for (const q of nodes) {
        if (keep.length >= (big ? 30 : 12)) break
        if (!keep.some((o) => Math.hypot(o.x - q.x, o.z - q.z) < 0.04) && ok(q, 0.01)) keep.push(q)
      }
      const g = { n: keep.length, x: new Float32Array(keep.length), z: new Float32Array(keep.length), yaw: new Float32Array(keep.length), busy: new Uint8Array(keep.length), walkers: [] }
      keep.forEach((q, i) => {
        g.x[i] = q.x
        g.z[i] = q.z
        g.yaw[i] = q.yaw
      })
      for (let k = big ? 3 : 1, i = 0; k > 0 && i < g.n; k--, i++) {
        g.busy[i] = 1
        const p = add('walk', g.x[i], g.z[i], g.yaw[i], { home: g, steps: 64 })
        p.spot = i
        g.walkers.push(p)
      }
      end()
    }

    // --- the loʻi: bent to the kalo, straightening up, wading to the next
    // patch; and someone carrying kalo along a bank
    for (const l of sites.loi) {
      const wet = l.paddies.filter((p) => p.flood)
      if (!wet.length) continue
      let cx = 0
      let cz = 0
      for (const p of l.paddies) {
        cx += p.c[0] / l.paddies.length
        cz += p.c[1] / l.paddies.length
      }
      begin(cx, cz)
      // most of the work is going on round where the terraces lie thickest
      const mid = this.thickest(l)
      const busy = wet.filter((q) => Math.hypot(q.c[0] - mid.c[0], q.c[1] - mid.c[1]) < 1.5)
      const mates = []
      for (let k = l.model ? 16 : 5; k > 0; k--) {
        const pool = busy.length && r() < 0.6 ? busy : wet
        const pd = pool[Math.floor(r() * pool.length)]
        if (!this.spotIn(pd, mates, r, null)) continue
        const w = add('loi', this.spot.x, this.spot.z, r() * Math.PI * 2, { floor: (pd.level - 0.25) * Y_PER_M, home: pd, steps: 24 })
        w.mates = mates
        mates.push(w)
      }
      const bank = l.model || r() < 0.4 ? this.bankWalk(l, mid.c[0], mid.c[1], linesClear, plantsClear) : null
      if (bank) {
        const p = add('carry', bank.ax, bank.az, Math.atan2(bank.bx - bank.ax, bank.bz - bank.az), { floor: bank.y, steps: 72 })
        Object.assign(p, bank)
      }
      end()
    }

    // --- canoe crews, along the hulls; at home, one mending a net
    for (const c of sites.canoes) {
      begin(c.x, c.z)
      const cs = Math.cos(c.dir)
      const sn = Math.sin(c.dir)
      const yawOf = (nx, nz) => Math.atan2(nx * cs - nz * sn, nx * sn + nz * cs)
      // (the canoes lie side by side 0.09 apart, each with its ama 0.038 off to
      // port: a lane to starboard of each, and one past the first one's ama)
      const lanes = []
      for (let k = 0; k < c.n; k++) {
        const zk = (k - (c.n - 1) / 2) * 0.09
        lanes.push([zk + 0.017, -1])
        if (k === 0) lanes.push([zk - 0.06, 1])
      }
      const home = c.village === sites.model
      const crew = []
      for (let k = home ? 4 : 2; k > 0; k--) {
        for (let tries = 0; tries < 10; tries++) {
          const [lz, f] = lanes[Math.floor(r() * lanes.length)]
          const lx = (r() - 0.5) * 0.1
          const x = c.x + lx * cs - lz * sn
          const z = c.z + lx * sn + lz * cs
          if (!open(x, z, 0.008) || !room(x, z, 0.014)) continue
          const p = add('crew', x, z, yawOf(0, f), { steps: 24 })
          p.face = yawOf(0, f)
          p.sea = yawOf(1, 0)
          p.home = { x: c.x, z: c.z, cs, sn, lz, crew }
          crew.push(p)
          take(x, z, 0.012)
          break
        }
      }
      if (home) {
        for (let tries = 0; tries < 20; tries++) {
          const lx = -0.115 - r() * 0.055
          const lz = (r() - 0.5) * (c.n * 0.09 + 0.1)
          const x = c.x + lx * cs - lz * sn
          const z = c.z + lx * sn + lz * cs
          const yaw = yawOf(1, 0) + (r() - 0.5) * 0.8
          const nx = x + Math.sin(yaw) * 0.95 * S
          const nz = z + Math.cos(yaw) * 0.95 * S
          if (!open(x, z, 0.01, 0.2) || !room(x, z, 0.012) || !open(nx, nz, 0.014, 0.15) || !room(nx, nz, 0.014)) continue
          add('mend', x, z, yaw, { body: 'seat' })
          take(x, z, 0.012)
          take(nx, nz, 0.014)
          break
        }
      }
      end()
    }

    // --- the keeper of each fishpond, on the wall beside its mākāhā
    for (const pd of sites.ponds) {
      const g = this.gateSpot(pd)
      begin(g.x, g.z)
      add('keeper', g.x, g.z, g.yaw, { floor: POND_WALL_TOP })
      end()
    }

    // --- kahuna on the court of the luakini, between the lele and the wall,
    // facing the ʻanuʻu (placeHeiau in structures.js lays the court out)
    for (const h of sites.heiau) {
      if (!(h.model || h.kind === 'luakini')) continue
      const big = h.kind === 'luakini'
      const k = big ? 1 : 0.6
      // (the court's floor as the sites give it, if they do; otherwise as
      // placeHeiau builds it: 4.8 m up on the ground at its middle, or 2.4 m
      // for a smaller heiau's two tiers)
      const court = h.court ?? Math.max(0, T.heightAt(h.x, h.z)) + (big ? 4.8 : 2.4) * S
      const c = Math.cos(h.rot)
      const s = Math.sin(h.rot)
      begin(h.x, h.z)
      const placed = []
      for (let n = 0, tries = 0; n < 3 && tries < 30; tries++) {
        const lx = (0.6 + r() * 3.4) * k * S
        const lz = -(1.6 + r() * 4) * k * S
        const x = h.x + lx * c - lz * s
        const z = h.z + lx * s + lz * c
        if (placed.some((q) => Math.hypot(q[0] - x, q[1] - z) < 0.02)) continue
        placed.push([x, z])
        add('priest', x, z, Math.atan2(-c, -s) + (r() - 0.5) * 0.6, { floor: court, tint: 2.4 })
        n++
      }
      end()
    }

    // --- the hōlua: a crowd at the foot of the run, a few along it and at the
    // top, all standing back past the lane the riders walk up in (|off| 0.09)
    if (track && track.length > 1) {
      const a = track[0]
      const b = track[track.length - 1]
      const len = Math.hypot(b[0] - a[0], b[2] - a[2])
      const dx = (b[0] - a[0]) / len
      const dz = (b[2] - a[2]) / len
      begin((a[0] + b[0]) / 2, (a[2] + b[2]) / 2)
      // (on the ground as it is drawn: on this steep, folded slope the
      // terrain mesh stands well off the smooth heightAt in places)
      const watch = (along, side, pose) => {
        const x = a[0] + dx * along - dz * side
        const z = a[2] + dz * along + dx * side
        const yaw = Math.atan2(dz * side, -dx * side) + (own() - 0.5) * 0.6
        if (pose === 'sit') add('sit', x, z, yaw, { body: 'sit' })
        else add('watch', x, z, yaw)
      }
      for (let k = 0; k < 16; k++) watch(len - 0.05 - own() * 0.7, (k % 2 ? -1 : 1) * (0.125 + own() * 0.075), own() < 0.6 ? 'stand' : 'sit')
      for (let k = 0; k < 4; k++) watch(len * (0.35 + own() * 0.4), (own() < 0.5 ? -1 : 1) * (0.125 + own() * 0.075), 'sit')
      for (let k = 0; k < 3; k++) watch(0.04 + own() * 0.12, -(0.13 + own() * 0.07), 'stand')
      end()
    }
  }

  /**
   * What people keep clear of: streams (as drawn) and ʻauwai, pond walls, the
   * hōlua and the puʻuhonua wall; houses, heiau and canoes; planted trees and
   * the forest; paddies; the sea; and slopes too steep to stand about on.
   */
  openGround() {
    const app = this.app
    const T = app.terrain
    const meta = app.island.meta
    const sites = meta.sites
    const veg = app.vegetation
    const C = 0.25
    const key = (i, j) => (i + 2048) * 4096 + j + 2048
    const cellOf = (x, z) => key(Math.floor(x / C), Math.floor(z / C))
    const insert = (grid, x0, z0, x1, z1, item) => {
      for (let i = Math.floor(x0 / C); i <= Math.floor(x1 / C); i++) {
        for (let j = Math.floor(z0 / C); j <= Math.floor(z1 / C); j++) {
          const k = key(i, j)
          const list = grid.get(k)
          if (list) list.push(item)
          else grid.set(k, [item])
        }
      }
    }
    // only what lies near somewhere people are (the island has a great many
    // stream reaches nobody stands beside)
    const NG = Math.ceil(WORLD) + 2
    const near = new Uint8Array(NG * NG)
    const nearAt = (x, z) => (Math.floor(x + HALF) + 1) * NG + Math.floor(z + HALF) + 1
    const mark = (x, z, rr) => {
      for (let i = Math.floor(x - rr); i <= Math.floor(x + rr); i++) for (let j = Math.floor(z - rr); j <= Math.floor(z + rr); j++) near[nearAt(i, j)] = 1
    }
    for (const v of sites.villages) mark(v.x, v.z, 2.3)
    for (const c of sites.canoes) mark(c.x, c.z, 0.8)
    // (in the loʻi, the banks someone might carry kalo along, and the paddies
    // people work, which a stream may run beside or through)
    for (const l of sites.loi) {
      mark(this.thickest(l).c[0], this.thickest(l).c[1], 1.2)
      for (const p of l.paddies) if (p.flood) mark(p.c[0], p.c[1], 0.3)
    }
    const nearby = (x, z) => near[nearAt(x, z)] === 1
    // lines, with how far either side of them to keep: x0, z0, x1, z1, half
    const lines = []
    const lineGrid = new Map()
    const line = (ax, az, bx, bz, half) => {
      // (anywhere along it: a long reach can cross somewhere people are with
      // both its ends well away)
      const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / 0.5))
      let near = false
      for (let k = 0; k <= n && !near; k++) near = nearby(ax + ((bx - ax) * k) / n, az + ((bz - az) * k) / n)
      if (!near) return
      const m = half + 0.04
      insert(lineGrid, Math.min(ax, bx) - m, Math.min(az, bz) - m, Math.max(ax, bx) + m, Math.max(az, bz) + m, lines.length)
      lines.push(ax, az, bx, bz, half)
    }
    // the stream ribbons, as wide as streams.js draws them at their whitest
    for (const s of app.wailele?.lines || layStreams(meta, app.island.data)) {
      const half = Math.min(0.11, 0.009 * Math.sqrt(s.lineA) + 0.012) * 1.4 + 0.008
      for (let i = 1; i < s.pts.length; i++) line(s.pts[i - 1][0], s.pts[i - 1][1], s.pts[i][0], s.pts[i][1], half)
    }
    for (const l of sites.loi) {
      for (const a of l.auwai) {
        for (let i = 1; i < a.length; i++) if (Math.hypot(a[i][0] - a[i - 1][0], a[i][1] - a[i - 1][1]) < 1.2) line(a[i - 1][0], a[i - 1][1], a[i][0], a[i][1], 0.013)
      }
    }
    for (const p of sites.ponds) for (let i = 1; i < p.wall.length; i++) line(p.wall[i - 1][0], p.wall[i - 1][1], p.wall[i][0], p.wall[i][1], 0.06)
    const track = app.features.holuaPath
    if (track) for (let i = 1; i < track.length; i++) line(track[i - 1][0], track[i - 1][2], track[i][0], track[i][2], 0.065)
    const pw = app.features.puuhonuaWall
    if (pw) line(pw.a[0], pw.a[2], pw.b[0], pw.b[2], 0.05)
    // footprints: x, z, cos and sin of the turn, and the extent either way along and across
    const boxes = []
    const boxGrid = new Map()
    const box = (x, z, rot, x0, x1, z0, z1) => {
      const m = Math.hypot(Math.max(-x0, x1), Math.max(-z0, z1)) + 0.04
      insert(boxGrid, x - m, z - m, x + m, z + m, boxes.length)
      boxes.push(x, z, Math.cos(rot), Math.sin(rot), x0, x1, z0, z1)
    }
    for (const h of sites.houses) {
      const [L, W] = HOUSE[h.kind] || HOUSE.noa
      const sc = h.scale || 1
      const hx = ((L * sc + 1.8) / 2) * S
      const hz = ((W * sc + 1.8) / 2) * S
      box(h.x, h.z, h.rot, -hx, hx, -hz, hz)
    }
    // each heiau's whole platform, its terraces too, as gen/footing.js laid
    // it out (if the features publish it; otherwise the base alone)
    const platforms = (app.features.footings || []).filter((f) => f.box && (f.kind === 'heiau' || f.kind === 'luakini'))
    for (const f of platforms) box(f.box.x, f.box.z, Math.atan2(f.box.s, f.box.c), -f.box.hx, f.box.hx, -f.box.hz, f.box.hz)
    if (!platforms.length) {
      for (const h of sites.heiau) {
        const big = h.kind === 'luakini'
        const hx = ((big ? 44 : 26) / 2) * S
        const hz = ((big ? 30 : 18) / 2) * S
        box(h.x, h.z, h.rot, -hx, hx, -hz, hz)
      }
    }
    for (const c of sites.canoes) {
      // hulls with their booms and ama, the canoe shed behind, and the
      // voyaging canoe beside them at the chief's landing
      for (let k = 0; k < c.n; k++) {
        const zk = (k - (c.n - 1) / 2) * 0.09
        box(c.x, c.z, c.dir, -0.095, 0.095, zk - 0.043, zk + 0.008)
      }
      // (the shed where the sites say it stands, if they do; otherwise where
      // features/index.js puts it, 0.32 straight back from the canoes)
      if (c.house) {
        const sh = c.shed || { x: c.x - Math.cos(c.dir) * 0.32, z: c.z - Math.sin(c.dir) * 0.32, rot: c.dir }
        box(sh.x, sh.z, sh.rot, -0.135, 0.135, -0.055, 0.055)
      }
    }
    const landing = sites.alii && sites.canoes.find((c) => c.village === sites.alii.id)
    if (landing) box(landing.x, landing.z, landing.dir, -0.16, 0.16, 0.4, 0.5)
    // the keeper's hale by each pond: where the sites say (null: none), or
    // else by the first gate, as features/index.js builds it, turned any which way
    for (const p of sites.ponds) {
      if (p.keeper) box(p.keeper.x, p.keeper.z, p.keeper.rot, -2.9 * S, 2.9 * S, -2.4 * S, 2.4 * S)
      else if (p.keeper === undefined) {
        const g = p.wall[Math.round(p.gates[0] * (p.wall.length - 1))]
        box(g[0] - p.ax * 0.12, g[1] - p.az * 0.12, 0, -0.066, 0.066, -0.066, 0.066)
      }
    }
    // each village's imu, a low pile of stones 2.6 m across (null: none)
    for (const v of sites.villages) if (v.imu) box(v.imu.x, v.imu.z, 0, -1.3 * S, 1.3 * S, -1.3 * S, 1.3 * S)
    // the salt pans: four by three clay beds 6.6 × 5.4 m, 11 and 9 m apart
    for (const sp of sites.saltpans || []) box(sp.x, sp.z, sp.dir + Math.PI / 2, -0.22, 0.22, -0.135, 0.135)
    // the puʻuhonua's heiau, its kiʻi along the shore and the refugees' houses
    // (where the sites say, or else as features/index.js buildPuuhonua lays them out)
    const pu = sites.puuhonua
    if (pu) {
      const dx = Math.cos(pu.dir)
      const dz = Math.sin(pu.dir)
      const ph = pu.heiau === undefined ? { x: pu.x - dx * 0.5, z: pu.z - dz * 0.5, rot: pu.dir } : pu.heiau
      if (ph) box(ph.x, ph.z, ph.rot, -13 * S, 13 * S, -9 * S, 9 * S)
      box(pu.x - dx * 0.05, pu.z - dz * 0.05, pu.dir, -0.02, 0.02, -0.33, 0.33)
      for (let k = 0; k < 3; k++) {
        const q = pu.houses ? pu.houses[k] : { x: pu.x - dx * 1.1 - dz * (k - 1) * 0.6, z: pu.z - dz * 1.1 + dx * (k - 1) * 0.6, rot: pu.dir + Math.PI / 2 }
        if (q) box(q.x, q.z, q.rot, -3.9 * S, 3.9 * S, -2.9 * S, 2.9 * S)
      }
    }
    const plants = new Map()
    if (veg && veg.fixed) {
      for (const kind in veg.fixed) {
        const rr = PLANT_R[kind] || 0.8
        for (const q of veg.fixed[kind]) {
          if (!nearby(q.x, q.z)) continue
          const rad = rr * q.s
          insert(plants, q.x - rad - 0.04, q.z - rad - 0.04, q.x + rad + 0.04, q.z + rad + 0.04, [q.x, q.z, rad])
        }
      }
    }
    const loiBox = sites.loi.map((l) => {
      let x0 = Infinity
      let x1 = -Infinity
      let z0 = Infinity
      let z1 = -Infinity
      for (const p of l.paddies) {
        for (const q of p.poly) {
          x0 = Math.min(x0, q[0])
          x1 = Math.max(x1, q[0])
          z0 = Math.min(z0, q[1])
          z1 = Math.max(z1, q[1])
        }
      }
      return [x0, x1, z0, z1]
    })
    // (where vegetation.js grows no forest, as buildTile decides it: off its
    // land texture, on sand or fields, cleared, or low by the sea)
    const N = HYDRO_RES
    const noTree = (x, z) => {
      if (!veg) return true
      const i = Math.floor(((x + HALF) / WORLD) * N)
      const j = Math.floor(((z + HALF) / WORLD) * N)
      if (i < 0 || j < 0 || i >= N || j >= N) return true
      const k = j * N + i
      return veg.land[k * 4 + 1] > 0.2 * 255 || veg.land[k * 4 + 3] > 0.3 * 255 || veg.cleared[k] === 1 || T.metresAt(x, z) < 3
    }
    // (indexed loops: these run again later, whenever someone sets off, and allocate nothing)
    const linesClear = (x, z, rr) => {
      const list = lineGrid.get(cellOf(x, z))
      if (!list) return true
      for (let i = 0; i < list.length; i++) {
        const k = list[i]
        if (segDist(x, z, lines[k], lines[k + 1], lines[k + 2], lines[k + 3]) < lines[k + 4] + rr) return false
      }
      return true
    }
    const plantsClear = (x, z, rr) => {
      const list = plants.get(cellOf(x, z))
      if (!list) return true
      for (let i = 0; i < list.length; i++) if (Math.hypot(list[i][0] - x, list[i][1] - z) < list[i][2] + rr) return false
      return true
    }
    const boxesClear = (x, z, rr) => {
      const list = boxGrid.get(cellOf(x, z))
      if (list) {
        for (let i = 0; i < list.length; i++) {
          const k = list[i]
          const dx = x - boxes[k]
          const dz = z - boxes[k + 1]
          const lx = dx * boxes[k + 2] + dz * boxes[k + 3]
          const lz = -dx * boxes[k + 3] + dz * boxes[k + 2]
          if (lx > boxes[k + 4] - rr && lx < boxes[k + 5] + rr && lz > boxes[k + 6] - rr && lz < boxes[k + 7] + rr) return false
        }
      }
      return true
    }
    const open = (x, z, rr, steep = 0.35) => {
      if (T.metresAt(x, z) < 0.6) return false
      if (!plantsClear(x, z, rr) || !boxesClear(x, z, rr)) return false
      if (!noTree(x, z) || !noTree(x + 0.015, z) || !noTree(x - 0.015, z) || !noTree(x, z + 0.015) || !noTree(x, z - 0.015)) return false
      const e = 0.012
      const gx = T.metresAt(x + e, z) - T.metresAt(x - e, z)
      const gz = T.metresAt(x, z + e) - T.metresAt(x, z - e)
      if (Math.hypot(gx, gz) / ((2 * e) / METRE) > steep) return false
      if (!linesClear(x, z, rr)) return false
      for (let i = 0; i < sites.loi.length; i++) {
        const b = loiBox[i]
        if (x < b[0] - 0.05 || x > b[1] + 0.05 || z < b[2] - 0.05 || z > b[3] + 0.05) continue
        const ps = sites.loi[i].paddies
        for (let k = 0; k < ps.length; k++) {
          const p = ps[k]
          if (Math.abs(p.c[0] - x) > 0.45 || Math.abs(p.c[1] - z) > 0.45) continue
          if (insidePoly(p.poly, x, z) || edgeDist(p.poly, x, z) < rr + 0.006) return false
        }
      }
      return true
    }
    // everyone placed so far (x, z, radius), so nobody stands in anybody
    const taken = new Map()
    const room = (x, z, rr) => {
      const list = taken.get(cellOf(x, z))
      if (!list) return true
      for (let i = 0; i < list.length; i++) if (Math.hypot(list[i][0] - x, list[i][1] - z) < rr + list[i][2]) return false
      return true
    }
    const take = (x, z, rr) => insert(taken, x - rr - 0.04, z - rr - 0.04, x + rr + 0.04, z + rr + 0.04, [x, z, rr])
    const clearWalk = (ax, az, bx, bz) => {
      const n = Math.ceil(Math.hypot(bx - ax, bz - az) / 0.014)
      for (let k = 1; k < n; k++) {
        const x = ax + ((bx - ax) * k) / n
        const z = az + ((bz - az) * k) / n
        if (!open(x, z, 0.008) || !room(x, z, 0.008)) return false
      }
      return true
    }
    return { open, room, take, clearWalk, linesClear, plantsClear, boxesClear }
  }

  /** The paddy where a loʻi's terraces lie thickest, as the tour looks at them (from every fourth one). */
  thickest(l) {
    this.thick = this.thick || new Map()
    if (this.thick.has(l)) return this.thick.get(l)
    let mid = l.paddies[0]
    let most = -1
    for (let i = 0; i < l.paddies.length; i += 4) {
      const q = l.paddies[i]
      let n = 0
      for (const o of l.paddies) if (Math.abs(o.c[0] - q.c[0]) < 1.6 && Math.abs(o.c[1] - q.c[1]) < 1.6 && Math.hypot(o.c[0] - q.c[0], o.c[1] - q.c[1]) < 1.6) n++
      if (n > most) {
        most = n
        mid = q
      }
    }
    this.thick.set(l, mid)
    return mid
  }

  /**
   * A place to stand in a paddy, well in from its banks, out of any stream
   * or ditch, and clear of the others working it (for someone already in
   * it, `from`, a few steps away), into this.spot; false if there is none.
   */
  spotIn(pd, mates, r, from) {
    let x0 = Infinity
    let x1 = -Infinity
    let z0 = Infinity
    let z1 = -Infinity
    for (const q of pd.poly) {
      x0 = Math.min(x0, q[0])
      x1 = Math.max(x1, q[0])
      z0 = Math.min(z0, q[1])
      z1 = Math.max(z1, q[1])
    }
    for (let k = 0; k < 14; k++) {
      let x
      let z
      if (from) {
        const a = r() * Math.PI * 2
        const d = 0.025 + r() * 0.045
        x = from.x + Math.sin(a) * d
        z = from.z + Math.cos(a) * d
      } else {
        x = x0 + r() * (x1 - x0)
        z = z0 + r() * (z1 - z0)
      }
      if (!insidePoly(pd.poly, x, z) || edgeDist(pd.poly, x, z) < 0.016 || !this.linesClear(x, z, 0.006)) continue
      // (and the way there, through the middle of it, out of any stream that runs through it)
      if (from && edgeDist(pd.poly, (x + from.x) / 2, (z + from.z) / 2) < 0.016) continue
      if (from && (!this.linesClear((x + from.x) / 2, (z + from.z) / 2, 0.006) || !this.linesClear((x * 3 + from.x) / 4, (z * 3 + from.z) / 4, 0.006) || !this.linesClear((x + from.x * 3) / 4, (z + from.z * 3) / 4, 0.006))) continue
      // (nobody else there or making for it, nor in the way there or
      // wading across it: each one's way runs from x, z to tx, tz)
      let clear = true
      for (let i = 0; i < mates.length && clear; i++) {
        const o = mates[i]
        clear = o === from || (Math.hypot(o.x - x, o.z - z) >= 0.03 && Math.hypot(o.tx - x, o.tz - z) >= 0.03 && (!from || segSeg(o.x, o.z, o.tx, o.tz, from.x, from.z, x, z) >= 0.014))
      }
      if (!clear) continue
      this.spot.x = x
      this.spot.z = z
      return true
    }
    return false
  }

  /**
   * A stretch of bank for someone to carry kalo along: one side of a paddy,
   * long and near the middle of the complex, whose top (this paddy's bank, or
   * a higher neighbour's where theirs runs along it, as features/loi.js builds
   * them: 0.35 m over the water) stays level, with no stream, ditch or tree on it.
   */
  bankWalk(l, cx, cz, linesClear, plantsClear) {
    const T = this.app.terrain
    const bounds = (p) => {
      const b = [Infinity, -Infinity, Infinity, -Infinity]
      for (const q of p.poly) {
        b[0] = Math.min(b[0], q[0])
        b[1] = Math.max(b[1], q[0])
        b[2] = Math.min(b[2], q[1])
        b[3] = Math.max(b[3], q[1])
      }
      return b
    }
    const box = new Map(l.paddies.map((p) => [p, bounds(p)]))
    const near = l.paddies
      .map((p) => [Math.hypot(p.c[0] - cx, p.c[1] - cz), p])
      .sort((a, b) => a[0] - b[0])
      .slice(0, 16)
    let best = null
    let bs = -Infinity
    for (const [, p] of near) {
      const pb = box.get(p)
      // (the paddies beside it)
      const next = l.paddies.filter((q) => {
        const qb = box.get(q)
        return q !== p && qb[0] < pb[1] + 0.02 && qb[1] > pb[0] - 0.02 && qb[2] < pb[3] + 0.02 && qb[3] > pb[2] - 0.02
      })
      const poly = p.poly
      for (let i = 0; i < poly.length; i++) {
        const a = poly[i]
        const b = poly[(i + 1) % poly.length]
        const len = Math.hypot(b[0] - a[0], b[1] - a[1])
        if (len < 0.12) continue
        let lo = Infinity
        let hi = -Infinity
        let ok = true
        for (let s = 0.15; s < 0.9 && ok; s += 0.35) {
          const x = a[0] + (b[0] - a[0]) * s
          const z = a[1] + (b[1] - a[1]) * s
          let top = (p.level + 0.35) * Y_PER_M
          for (const q of next) if (edgeDist(q.poly, x, z) < 0.008 || insidePoly(q.poly, x, z)) top = Math.max(top, (q.level + 0.35) * Y_PER_M)
          top = Math.max(top, drawnHeight(T, x, z))
          lo = Math.min(lo, top)
          hi = Math.max(hi, top)
          ok = hi - lo < 0.0012 && linesClear(x, z, 0.01) && plantsClear(x, z, 0.01)
        }
        if (!ok) continue
        const sc = len - Math.hypot((a[0] + b[0]) / 2 - cx, (a[1] + b[1]) / 2 - cz) * 0.3
        if (sc > bs) {
          bs = sc
          // (stopping short of the corners)
          const ux = (b[0] - a[0]) / len
          const uz = (b[1] - a[1]) / len
          best = { ax: a[0] + ux * 0.03, az: a[1] + uz * 0.03, bx: b[0] - ux * 0.03, bz: b[1] - uz * 0.03, y: hi }
        }
      }
    }
    return best
  }

  /** On the top of a fishpond's wall, beside its first mākāhā, facing it (as features/index.js builds them). */
  gateSpot(pd) {
    const pts = pd.wall
    const n = pts.length
    const cum = [0]
    for (let k = 1; k < n; k++) cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]))
    const f = pd.gates[0] * (n - 1)
    const i = Math.min(n - 2, Math.floor(f))
    const g = cum[i] + (cum[i + 1] - cum[i]) * (f - i)
    const at = (d) => {
      let k = 0
      while (k < n - 2 && cum[k + 1] < d) k++
      const u = (d - cum[k]) / Math.max(1e-9, cum[k + 1] - cum[k])
      return [pts[k][0] + (pts[k + 1][0] - pts[k][0]) * u, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * u]
    }
    // (the opening is 0.06 across: just back from its edge, so that bending
    // down to it his hands are at the grate)
    const d = g > 0.06 ? g - 0.036 : g + 0.036
    const [x, z] = at(d)
    const [gx, gz] = at(g)
    return { x, z, yaw: Math.atan2(gx - x, gz - z) }
  }

  /** A figure: what it does (kind), how it is drawn (body: rig standing, seat at work sitting down, sit), where. */
  figure(kind, x, z, yaw, o) {
    const r = this.frand
    const body = o.body || 'rig'
    const p = {
      kind,
      body,
      x,
      z,
      yaw,
      base: yaw,
      tint: o.tint ?? 0.86 + r() * 0.26,
      // a level the feet keep to (a paddy's floor, a bank, a wall, a court), or the ground
      floor: o.floor ?? null,
      y: 0,
      lx: 0,
      lz: 0,
      ly: 0,
      rx: 0,
      rz: 0,
      ry: 0,
      torso: -1,
      leg: -1,
      arm: -1,
      tool: -1,
      pack: -1,
      sit: -1,
      // planned steps, the step under way, when they began, how far they reach
      steps: body === 'rig' ? new Float32Array(REC * ((o.steps || 12) + 1)) : null,
      n: 0,
      k: 0,
      m0: 0,
      gait: STROLL,
      span: 0,
      tx: x,
      tz: z,
      bend: new Ease(),
      crouch: new Ease(),
      shift: new Ease(),
      twist: new Ease(),
      reach: new Ease(),
      gest: new Ease(),
      state: '',
      until: r() * 5,
      wake: 0,
      idle: 0,
      drawn: false,
      ph: r() * 100,
      side: r() < 0.7 ? RIGHT : LEFT,
      home: o.home ?? null,
      mates: null,
      spot: -1,
      prev: -1,
      face: yaw,
      sea: yaw,
      ax: x,
      az: z,
      bx: x,
      bz: z,
    }
    if (body === 'rig') {
      this.restFeet(p)
      p.y = (p.ly + p.ry) / 2
    } else p.y = this.footY(p, x, z)
    return p
  }

  footY(p, x, z) {
    return p.floor !== null ? p.floor : Math.max(0, drawnHeight(this.app.terrain, x, z))
  }

  /** Feet side by side under the hips. */
  restFeet(p) {
    const w = FOOT_W * S
    p.lx = p.x + Math.cos(p.yaw) * w
    p.lz = p.z - Math.sin(p.yaw) * w
    p.rx = p.x - Math.cos(p.yaw) * w
    p.rz = p.z + Math.sin(p.yaw) * w
    p.ly = this.footY(p, p.lx, p.lz)
    p.ry = this.footY(p, p.rx, p.rz)
  }

  /** The instanced parts everyone is drawn with, and the still things the sitting workers have before them. */
  buildFolk(rand) {
    const own = this.frand
    const parts = rigParts(own)
    let nt = 0
    let nl = 0
    let na = 0
    let ns = 0
    let nk = 0
    let np = 0
    for (const p of this.folk) {
      if (p.body === 'sit') {
        p.sit = ns++
        continue
      }
      p.torso = nt++
      p.arm = na
      na += 2
      if (p.body === 'rig') {
        p.leg = nl
        nl += 2
      }
      if (p.kind === 'poi' || p.kind === 'kapa') p.tool = nk++
      if (p.kind === 'carry') p.pack = np++
    }
    const mesh = (geo, count) => {
      const m = new THREE.InstancedMesh(geo, this.mat, Math.max(1, count))
      m.count = count
      m.visible = count > 0
      // three makes the colour buffer on the first setColorAt, filled with
      // black, so anyone placed before that would stay a silhouette
      m.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(Math.max(1, count) * 3).fill(1), 3)
      m.frustumCulled = false
      m.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      // (the stretch of the buffer touched this frame, uploaded alone)
      m.userData = { lo: Infinity, hi: -1, range: { start: 0, count: 0 } }
      this.group.add(m)
      return m
    }
    // the procession and the hōlua riders are drawn standing (see update);
    // these two take their colours from the main sequence, as they always
    // have, with the three of the bent figure that came between them
    const stand = person('stand', rand)
    for (let k = 0; k < 3; k++) rand()
    this.poseMeshes = { stand: mesh(stand, 40), sit: mesh(person('sit', rand), ns) }
    this.parts = { torso: mesh(parts.torso, nt), thigh: mesh(parts.thigh, nl), shin: mesh(parts.shin, nl), arm: mesh(parts.arm, na), tool: mesh(handTool(), nk), pack: mesh(auamo(own), np) }
    this.partList = [...Object.values(this.parts), this.poseMeshes.sit]
    this._frame = 0
    this._pv = new THREE.Matrix4()
    this._fr = new THREE.Frustum()
    this._sph = new THREE.Sphere(new THREE.Vector3(), 0.04)
    this._A = new THREE.Vector3()
    this._B = new THREE.Vector3()
    this._H = new THREE.Vector3()
    this._X = new THREE.Vector3()
    this._Y = new THREE.Vector3()
    this._Z = new THREE.Vector3()
    this._tL = new THREE.Vector3()
    this._tU = new THREE.Vector3()
    this._tF = new THREE.Vector3()
    this._hand = new THREE.Vector3()
    this._J = new THREE.Vector3()
    this._K = new THREE.Vector3()
    this._N = new THREE.Vector3()
    this._Sh = new THREE.Vector3()
    this._D = new THREE.Vector3()
    this._Fw = new THREE.Vector3()
    const stone = new THREE.Color('#5d5650')
    const wood = new THREE.Color('#5a3a22')
    const B = new Builder()
    for (const p of this.folk) {
      const c = this._c.setRGB(p.tint, p.tint, p.tint)
      if (p.sit >= 0) this.poseMeshes.sit.setColorAt(p.sit, c)
      if (p.torso >= 0) this.parts.torso.setColorAt(p.torso, c)
      for (let k = 0; k < 2; k++) {
        if (p.arm >= 0) this.parts.arm.setColorAt(p.arm + k, c)
        if (p.leg >= 0) {
          this.parts.thigh.setColorAt(p.leg + k, c)
          this.parts.shin.setColorAt(p.leg + k, c)
        }
      }
      if (p.tool >= 0) this.parts.tool.setColorAt(p.tool, p.kind === 'poi' ? stone : wood)
      if (p.body === 'seat') {
        // (Builder turns the other way about y)
        B.at(p.x, p.y, p.z, -p.yaw)
        lap(B, parts.cloth)
        if (p.kind === 'poi') poiBoard(B, own)
        else if (p.kind === 'kapa') kua(B, own)
        else spreadNet(B, own)
        B.done()
      }
      this.start(p)
      this.pose(p, 0)
      p.drawn = false
    }
    for (const m of [this.poseMeshes.stand, ...this.partList]) {
      m.userData.lo = Infinity
      m.userData.hi = -1
      m.instanceMatrix.needsUpdate = true
    }
    this.props = new THREE.Mesh(B.geometry(), this.mat)
    this.props.frustumCulled = false
    this.group.add(this.props)
  }

  /** Each begins somewhere in what they do, out of step with the rest. */
  start(p) {
    const r = this.frand
    if (p.kind === 'loi' && r() < 0.75) {
      p.state = 'work'
      p.bend.set(1.0 + r() * 0.2)
      p.reach.set(1)
      p.crouch.set(0.35 + r() * 0.15)
      p.idle = Math.floor(r() * 5)
    } else if (p.kind === 'crew' && r() < 0.5) {
      p.state = 'work'
      p.bend.set(0.55 + r() * 0.25)
      p.reach.set(1)
      p.idle = Math.floor(r() * 4)
    } else if (p.kind === 'carry' && r() < 0.6) {
      p.state = 'rest'
      p.gest.set(1)
      p.idle = 1 + Math.floor(r() * 3)
    } else if (p.body === 'seat') {
      p.state = r() < 0.7 ? 'work' : 'rest'
      p.reach.set(p.state === 'work' ? 1 : 0)
      p.ph = -r() * 10
      p.until = 2 + r() * 15
      p.wake = p.state === 'work' ? p.until : 0
    }
    if (p.body === 'rig' && p.state !== 'work') p.shift.set((r() - 0.5) * 1.2)
  }

  // --- what each of them does next ---

  think(p, t) {
    if (p.n && t - p.m0 >= p.steps[p.n * REC + 10]) this.settle(p)
    if (t < p.until) return
    p.drawn = false
    const r = this.frand
    switch (p.kind) {
      case 'loi':
        return this.thinkLoi(p, t, r)
      case 'walk':
        return this.thinkWalk(p, t, r)
      case 'talk':
        return this.thinkTalk(p, t, r)
      case 'crew':
        return this.thinkCrew(p, t, r)
      case 'keeper':
        return this.thinkKeeper(p, t, r)
      case 'carry':
        return this.thinkCarry(p, t, r)
      case 'poi':
      case 'kapa':
      case 'mend':
        return this.thinkSeat(p, t, r)
      case 'sit':
        return this.thinkSit(p, t, r)
      default:
        return this.thinkStand(p, t, r)
    }
  }

  /** Standing about: a shift of weight onto the other foot, back to both, or a look aside. */
  fidget(p, t, r, k = 1) {
    const c = p.shift.b
    const u = r()
    let e = t
    if (u < 0.6) e = p.shift.to((c > 0.3 ? -1 : c < -0.3 ? 1 : r() < 0.5 ? -1 : 1) * (0.45 + r() * 0.55) * k, t, 1.3 + r() * 0.9)
    else if (u < 0.8) e = p.shift.to(0, t, 1.2 + r() * 0.6)
    else e = p.twist.to(Math.abs(p.twist.b) > 0.1 ? 0 : (r() - 0.5) * 0.7 * k, t, 1.4 + r())
    p.wake = e
    p.until = e + 2 + r() * 6
  }

  /** Turn on the spot to face yaw, stepping round; returns when done. */
  turnTo(p, t, yaw) {
    const e = this.plan(p, t, p.x, p.z, yaw, SHUFFLE)
    p.wake = e
    return e
  }

  thinkStand(p, t, r) {
    // kahuna stand near still; the crowd at the hōlua keep facing the run
    const k = p.kind === 'priest' ? 0.5 : p.kind === 'watch' ? 0.8 : 1
    const range = p.kind === 'priest' ? 0.6 : p.kind === 'watch' ? 0.35 : 1.1
    if (r() < (p.kind === 'priest' ? 0.3 : 0.15)) {
      p.until = this.turnTo(p, t, p.base + (r() - 0.5) * 2 * range) + 2 + r() * 4
      return
    }
    this.fidget(p, t, r, k)
    if (p.kind === 'priest') p.until += 4 + r() * 8
  }

  thinkTalk(p, t, r) {
    if (p.state === 'gesture') {
      p.state = ''
      const e = p.gest.to(0, t, 0.9)
      p.wake = e
      p.until = e + 1.5 + r() * 4
      return
    }
    const u = r()
    if (u < 0.25) {
      // a word, with a hand
      p.state = 'gesture'
      p.side = r() < 0.7 ? RIGHT : LEFT
      p.wake = p.gest.to(0.5 + r() * 0.5, t, 0.8)
      p.until = p.wake + 0.8 + r() * 2
    } else if (u < 0.32) {
      // half turning away a while, then back toward the other
      const away = Math.abs(wrapAngle(p.yaw - p.base)) < 0.2
      p.until = this.turnTo(p, t, away ? p.base + (r() < 0.5 ? -1 : 1) * (0.4 + r() * 0.4) : p.base) + 2 + r() * 5
    } else this.fidget(p, t, r)
  }

  thinkWalk(p, t, r) {
    const g = p.home
    if (p.state !== 'stop') {
      p.state = 'stop'
      p.idle = 1 + Math.floor(r() * 3)
    }
    if (p.idle > 0) {
      p.idle--
      this.fidget(p, t, r)
      return
    }
    // on to another stopping place nearby (not straight back, nor one
    // someone else is at or making for), if the way there is clear, and
    // crosses no one else's on the move
    let j = -1
    for (let k = 0; k < 6 && j < 0; k++) {
      const c = Math.floor(r() * g.n)
      const d = Math.hypot(g.x[c] - p.x, g.z[c] - p.z)
      if (c === p.prev || g.busy[c] || d < 0.06 || d > 0.34) continue
      let clear = true
      for (let i = 0; i < g.walkers.length && clear; i++) {
        const o = g.walkers[i]
        clear = o === p || segSeg(o.x, o.z, o.tx, o.tz, p.x, p.z, g.x[c], g.z[c]) >= 0.012
      }
      if (clear && this.clearWalk(p.x, p.z, g.x[c], g.z[c])) j = c
    }
    if (j < 0) {
      this.fidget(p, t, r)
      return
    }
    g.busy[p.spot] = 0
    g.busy[j] = 1
    p.prev = p.spot
    p.spot = j
    p.shift.to(0, t, 0.6)
    p.twist.to(0, t, 0.6)
    p.tx = g.x[j]
    p.tz = g.z[j]
    p.until = p.wake = this.plan(p, t, p.tx, p.tz, g.yaw[j] + (r() - 0.5) * 0.8, STROLL)
    p.state = 'go'
  }

  /** Bent at some work: the hands busy at it a while, then still a while. */
  handsAt(p, t, r) {
    p.idle--
    const on = p.gest.b < 0.5
    p.gest.to(on ? 1 : 0, t, 0.8)
    p.until = t + (on ? 3 + r() * 5 : 2 + r() * 6)
    p.wake = on ? p.until : t + 0.8
  }

  thinkLoi(p, t, r) {
    if (p.state === 'work' && p.idle > 0) return this.handsAt(p, t, r)
    if (p.state === 'work') {
      // up for a breather, and a look round
      const e = p.bend.to(0.04, t, 1.8 + r() * 0.6)
      p.reach.to(0, t, 1.3)
      p.crouch.to(0, t, 1.8)
      p.twist.to((r() - 0.5) * 0.8, e - 0.4, 1.6)
      p.state = 'up'
      p.wake = e + 1.3
      p.until = e + 2.5 + r() * 6
      return
    }
    p.twist.to(0, t, 0.8)
    if (p.state === 'up' && r() < 0.45) {
      // a few steps through the water to the next patch
      if (this.spotIn(p.home, p.mates, r, p)) {
        p.tx = this.spot.x
        p.tz = this.spot.z
        p.until = p.wake = this.plan(p, t, p.tx, p.tz, r() * Math.PI * 2, WADE)
        p.state = 'wade'
        return
      }
    }
    // (back) down to the kalo
    // (the knees well bent, the back not quite level, and the hands down
    // among the kalo ahead of the feet)
    const e = p.bend.to(1.0 + r() * 0.2, t, 1.8 + r() * 0.6)
    p.reach.to(1, t + 0.5, 1.4)
    p.crouch.to(0.35 + r() * 0.15, t, 1.8)
    p.gest.to(0, t, 0.5)
    p.state = 'work'
    p.idle = 2 + Math.floor(r() * 5)
    p.wake = e
    p.until = e + 0.5 + r() * 3
  }

  thinkCrew(p, t, r) {
    if (p.state === 'work' && p.idle > 0) return this.handsAt(p, t, r)
    if (p.state === 'work') {
      // up from the hull a while
      const e = p.bend.to(0.04, t, 1.5)
      p.reach.to(0, t, 1.2)
      p.state = 'stand'
      p.idle = Math.floor(r() * 2)
      p.wake = e
      p.until = e + 1 + r() * 3
      return
    }
    if (p.idle > 0) {
      p.idle--
      this.fidget(p, t, r)
      return
    }
    if (p.state === 'look') {
      // back round to the canoe
      p.state = 'stand'
      p.until = this.turnTo(p, t, p.face) + 1 + r() * 2
      return
    }
    const u = r()
    if (u < 0.25 && this.crewStep(p, t, r)) return
    if (u < 0.4) {
      // a look out to sea
      p.state = 'look'
      p.until = this.turnTo(p, t, p.sea + (r() - 0.5) * 0.8) + 3 + r() * 5
      return
    }
    if (Math.abs(wrapAngle(p.yaw - p.face)) > 0.2) {
      p.until = this.turnTo(p, t, p.face)
      return
    }
    // bent over the hull, at its lashings
    p.shift.to(0, t, 0.8)
    const e = p.bend.to(0.55 + r() * 0.25, t, 1.6)
    p.reach.to(1, t + 0.3, 1.3)
    p.gest.to(0, t, 0.5)
    p.state = 'work'
    p.idle = 2 + Math.floor(r() * 4)
    p.wake = e
    p.until = e + 0.5 + r() * 2
  }

  /** A few steps along the lane beside the hull, to somewhere else on it. */
  crewStep(p, t, r) {
    const h = p.home
    const dx = p.x - h.x
    const dz = p.z - h.z
    const lx0 = dx * h.cs + dz * h.sn
    for (let k = 0; k < 6; k++) {
      const lx = Math.max(-0.055, Math.min(0.055, lx0 + (r() < 0.5 ? -1 : 1) * (0.02 + r() * 0.035)))
      if (Math.abs(lx - lx0) < 0.015) continue
      const x = h.x + lx * h.cs - h.lz * h.sn
      const z = h.z + lx * h.sn + h.lz * h.cs
      // (open ground all the way, and nobody else of the crew there or going
      // there, standing in the way or walking across it: each one's way runs
      // from x, z to tx, tz, and is just where they stand when they stand still)
      let open = true
      for (let u = 0; u <= 1 && open; u += 0.25) open = this.open(p.x + (x - p.x) * u, p.z + (z - p.z) * u, 0.008)
      if (!open) continue
      let clear = true
      for (let i = 0; i < h.crew.length && clear; i++) {
        const o = h.crew[i]
        clear = o === p || (Math.hypot(o.x - x, o.z - z) >= 0.022 && Math.hypot(o.tx - x, o.tz - z) >= 0.022 && segSeg(o.x, o.z, o.tx, o.tz, p.x, p.z, x, z) >= 0.012)
      }
      if (!clear) continue
      p.tx = x
      p.tz = z
      p.state = 'stand'
      p.idle = 1
      p.until = p.wake = this.plan(p, t, x, z, p.face, STROLL)
      return true
    }
    return false
  }

  thinkKeeper(p, t, r) {
    if (p.state === 'down') {
      const e = p.crouch.to(0, t, 1.5)
      p.bend.to(0.04, t, 1.5)
      p.reach.to(0, t, 1.1)
      p.state = 'up'
      p.idle = 2 + Math.floor(r() * 3)
      p.wake = e
      p.until = e + 1
      return
    }
    if (p.idle > 0) {
      p.idle--
      this.fidget(p, t, r, 0.7)
      return
    }
    // down on his heels to see to the mākāhā
    p.shift.to(0, t, 0.6)
    const e = p.crouch.to(1, t, 1.6)
    p.bend.to(0.45, t, 1.6)
    p.reach.to(1, t + 0.6, 1.2)
    p.state = 'down'
    p.wake = e + 0.6
    p.until = e + 4 + r() * 7
  }

  thinkCarry(p, t, r) {
    if (p.state === 'go' || (p.state === 'rest' && p.idle === 0)) {
      // down on his heels, to set the load down on the bank ahead at the end
      // of it, or later to take it up again
      p.shift.to(0, t, 0.8)
      p.twist.to(0, t, 0.8)
      const e = p.crouch.to(0.85, t, 1.4)
      p.bend.to(0.55, t, 1.4)
      p.reach.to(1, t + 0.2, 1.1)
      if (p.state === 'go') p.gest.to(1, t + 0.3, 1.1)
      p.state = p.state === 'go' ? 'set' : 'lift'
      p.until = p.wake = e + 0.4
      return
    }
    if (p.state === 'set' || p.state === 'lift') {
      // up again: to stand by it a good while, looking out over the loʻi,
      // or with it back on his shoulder
      const e = p.crouch.to(0, t, 1.4)
      p.bend.to(0.04, t, 1.4)
      p.reach.to(0, t, 1)
      if (p.state === 'lift') p.gest.to(0, t, 1.2)
      p.wake = e
      if (p.state === 'set') {
        p.state = 'rest'
        p.idle = 3 + Math.floor(r() * 3)
        p.until = e + 1 + r() * 3
      } else {
        p.state = 'up'
        p.until = e + 0.5
      }
      return
    }
    if (p.state === 'rest') {
      p.idle--
      this.fidget(p, t, r)
      return
    }
    // along the bank to the other end
    const atA = Math.hypot(p.x - p.ax, p.z - p.az) < Math.hypot(p.x - p.bx, p.z - p.bz)
    const tx = atA ? p.bx : p.ax
    const tz = atA ? p.bz : p.az
    p.until = p.wake = this.plan(p, t, tx, tz, null, CARRY)
    p.state = 'go'
  }

  thinkSeat(p, t, r) {
    if (p.state === 'work') {
      p.reach.to(0, t, 1.2)
      p.state = 'rest'
      p.wake = t + 1.3
      p.until = t + 4 + r() * 9
    } else {
      p.reach.to(1, t, 1)
      p.state = 'work'
      p.ph = t
      p.until = t + 12 + r() * 20
      p.wake = p.until
    }
  }

  thinkSit(p, t, r) {
    // a shift of seat, and a turn to one side or back
    p.twist.to(Math.max(-0.7, Math.min(0.7, p.twist.b + (r() - 0.5) * 0.9)), t, 2 + r())
    const e = p.shift.to((r() - 0.5) * 1.4, t, 1.8 + r())
    p.wake = Math.max(e, p.twist.t0 + p.twist.d)
    p.until = t + 10 + r() * 25
  }

  // --- steps ---

  /** Record k of p's planned steps. */
  rec(s, k, px, pz, yaw, lx, lz, ly, rx, rz, ry, foot, t, lift) {
    const o = k * REC
    s[o] = px
    s[o + 1] = pz
    s[o + 2] = yaw
    s[o + 3] = lx
    s[o + 4] = lz
    s[o + 5] = ly
    s[o + 6] = rx
    s[o + 7] = rz
    s[o + 8] = ry
    s[o + 9] = foot
    s[o + 10] = t
    s[o + 11] = lift
  }

  /**
   * Plan the steps from where p stands to (tx, tz): a turn on the spot first
   * if it is facing much another way, a half step off, strides of about
   * gait.step with the body carried just as far as each stride goes, a last
   * step to bring the feet together, and a turn at the end to face endYaw (if
   * not null). Returns when they will be done.
   */
  plan(p, t, tx, tz, endYaw, gait) {
    const s = p.steps
    const max = s.length / REC - 1
    this.rec(s, 0, p.x, p.z, p.yaw, p.lx, p.lz, p.ly, p.rx, p.rz, p.ry, -1, 0, 0)
    let k = 0
    const dx = tx - p.x
    const dz = tz - p.z
    const D = Math.hypot(dx, dz)
    if (D > 0.003) {
      const head = Math.atan2(dx, dz)
      if (Math.abs(wrapAngle(head - p.yaw)) > 0.3) k = this.turnSteps(p, k, head)
      const ux = dx / D
      const uz = dz / D
      const n = Math.max(1, Math.min(Math.round(D / (gait.step * S)), max - k - 8))
      const lam = D / n
      const w = FOOT_W * S
      // the foot further back goes first
      const o = k * REC
      let left = (s[o + 3] - p.x) * ux + (s[o + 4] - p.z) * uz <= (s[o + 6] - p.x) * ux + (s[o + 7] - p.z) * uz
      for (let j = 1; j <= n + 1; j++) {
        const a = k * REC
        const along = Math.min(j, n) * lam
        const hip = j <= n ? (j - 0.5) * lam : D
        const sg = left ? 1 : -1
        const fx = p.x + ux * along + uz * w * sg
        const fz = p.z + uz * along - ux * w * sg
        const fy = this.footY(p, fx, fz)
        k++
        this.rec(s, k, p.x + ux * hip, p.z + uz * hip, head, left ? fx : s[a + 3], left ? fz : s[a + 4], left ? fy : s[a + 5], left ? s[a + 6] : fx, left ? s[a + 7] : fz, left ? s[a + 8] : fy, left ? LEFT : RIGHT, s[a + 10] + gait.tau, gait.lift)
        left = !left
      }
    }
    if (endYaw !== null) k = this.turnSteps(p, k, endYaw)
    p.n = k
    p.k = 1
    p.m0 = t
    p.gait = k ? gait : p.gait
    p.span = D
    p.drawn = false
    return t + s[k * REC + 10]
  }

  /** Steps turning on the spot from record k to face yaw, each foot in turn, the one on that side first. */
  turnSteps(p, k, yaw) {
    const s = p.steps
    const max = s.length / REC - 1
    const o = k * REC
    const px = s[o]
    const pz = s[o + 1]
    const y0 = s[o + 2]
    const d = wrapAngle(yaw - y0)
    if (Math.abs(d) < 0.05) return k
    const n = Math.ceil(Math.abs(d) / 0.6)
    const w = FOOT_W * S
    let left = d > 0
    for (let j = 1; j <= n + 1 && k < max; j++) {
      const a = k * REC
      const y = y0 + (d * Math.min(j, n)) / n
      const sg = left ? 1 : -1
      const fx = px + Math.cos(y) * w * sg
      const fz = pz - Math.sin(y) * w * sg
      const fy = this.footY(p, fx, fz)
      k++
      this.rec(s, k, px, pz, y, left ? fx : s[a + 3], left ? fz : s[a + 4], left ? fy : s[a + 5], left ? s[a + 6] : fx, left ? s[a + 7] : fz, left ? s[a + 8] : fy, left ? LEFT : RIGHT, s[a + 10] + SHUFFLE.tau, SHUFFLE.lift)
      left = !left
    }
    return k
  }

  /** The steps are done: stand where they ended. */
  settle(p) {
    const s = p.steps
    const o = p.n * REC
    p.x = s[o]
    p.z = s[o + 1]
    p.yaw = s[o + 2]
    p.lx = s[o + 3]
    p.lz = s[o + 4]
    p.ly = s[o + 5]
    p.rx = s[o + 6]
    p.rz = s[o + 7]
    p.ry = s[o + 8]
    p.y = (p.ly + p.ry) / 2
    p.n = 0
    p.span = 0
  }

  // --- drawing them ---

  /**
   * Move the people near enough to be seen. Each site's people decide what to
   * do next when the time comes; a figure is posed only while something about
   * it is changing and it is in view, and those further off only every few
   * frames (their moves are slow, and only a few pixels across).
   */
  updateFolk(t) {
    const cam = this.app.camera
    const cp = cam.position
    // (as the camera is this frame, not the last, so nobody comes into view
    // still posed as they were when they went out of it)
    cam.updateMatrixWorld()
    this._pv.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse)
    this._fr.setFromProjectionMatrix(this._pv)
    const f = ++this._frame
    const folk = this.folk
    for (let j = 0; j < this.folkSites.length; j++) {
      const site = this.folkSites[j]
      // (squared: Math.hypot would make garbage every frame)
      const sx = site.x - cp.x
      const sy = site.y - cp.y
      const sz = site.z - cp.z
      const reach = 12 + site.r
      if (sx * sx + sy * sy + sz * sz > reach * reach) continue
      for (let i = site.i0; i < site.i1; i++) {
        const p = folk[i]
        this.think(p, t)
        if (p.drawn) continue
        // (someone about 30/d pixels tall, d roughly how far off)
        const d = Math.abs(p.x - cp.x) + Math.abs(p.y - cp.y) + Math.abs(p.z - cp.z)
        if ((f + i) % (d < 1.5 ? 1 : d < 4 ? 2 : d < 8 ? 3 : 5)) continue
        this._sph.center.set(p.x, p.y + 0.015, p.z)
        this._sph.radius = 0.035 + p.span
        if (!this._fr.intersectsSphere(this._sph)) continue
        this.pose(p, t)
        // (still from here on, until it next decides something)
        p.drawn = t > p.wake && !p.n
      }
    }
    for (let k = 0; k < this.partList.length; k++) this.flush(this.partList[k])
  }

  pose(p, t) {
    if (p.body === 'rig') this.poseRig(p, t)
    else if (p.body === 'seat') this.poseSeat(p, t)
    else {
      const m = this.poseMeshes.sit
      this.setInstance(m, p.sit, p.x, p.y, p.z, p.yaw + p.twist.at(t), S, p.tint, 0, p.shift.at(t) * 0.05)
      this.mark(m, p.sit)
    }
  }

  /** A standing figure: where its steps have it, its hips over its feet, its legs reaching down to them. */
  poseRig(p, t) {
    if (p.n && t - p.m0 >= p.steps[p.n * REC + 10]) this.settle(p)
    let px = p.x
    let pz = p.z
    let yaw = p.yaw
    let lx = p.lx
    let lz = p.lz
    let ly = p.ly
    let rx = p.rx
    let rz = p.rz
    let ry = p.ry
    let liftL = 0
    let liftR = 0
    let sway = 0
    let moving = 0
    if (p.n) {
      const s = p.steps
      const e = t - p.m0
      while (p.k < p.n && e >= s[p.k * REC + 10]) p.k++
      const b = p.k * REC
      const a = b - REC
      const u = Math.max(0, Math.min(1, (e - s[a + 10]) / Math.max(1e-3, s[b + 10] - s[a + 10])))
      // the body on at an even pace through the step, the moving foot
      // swinging through and down; the other stays exactly where it is
      const w = u * u * (3 - 2 * u)
      px = s[a] + (s[b] - s[a]) * u
      pz = s[a + 1] + (s[b + 1] - s[a + 1]) * u
      yaw = s[a + 2] + wrapAngle(s[b + 2] - s[a + 2]) * u
      lx = s[a + 3] + (s[b + 3] - s[a + 3]) * w
      lz = s[a + 4] + (s[b + 4] - s[a + 4]) * w
      ly = s[a + 5] + (s[b + 5] - s[a + 5]) * w
      rx = s[a + 6] + (s[b + 6] - s[a + 6]) * w
      rz = s[a + 7] + (s[b + 7] - s[a + 7]) * w
      ry = s[a + 8] + (s[b + 8] - s[a + 8]) * w
      const h = s[b + 11] * Math.sin(Math.PI * u)
      if (s[b + 9] === LEFT) liftL = h
      else liftR = h
      // (the hips over onto the foot that is down)
      sway = 0.02 * Math.sin(Math.PI * u) * (s[b + 9] === LEFT ? -1 : 1)
      moving = s[b] !== s[a] || s[b + 1] !== s[a + 1] ? 1 : 0
    }
    const bend = p.bend.at(t)
    const crouch = p.crouch.at(t)
    const shift = p.shift.at(t)
    const twist = p.twist.at(t)
    const reach = p.reach.at(t)
    const fs = Math.sin(yaw)
    const fc = Math.cos(yaw)
    // the hips: between the feet, over onto one of them, back as the body bends forward
    const side = (shift * 0.045 + sway) * S
    const back = -(0.1 * Math.sin(bend) + 0.12 * crouch) * S
    const hx = px + fc * side + fs * back
    const hz = pz - fs * side + fc * back
    const jw = HIP_W * S
    const jlx = hx + fc * jw
    const jlz = hz - fs * jw
    const jrx = hx - fc * jw
    const jrz = hz + fs * jw
    const aly = ly + (ANKLE + liftL) * S
    const ary = ry + (ANKLE + liftR) * S
    // and no higher than both legs reach
    const far = (THIGH + SHIN) * 0.998 * S
    const hy = Math.min(
      (ly + ry) / 2 + (HIP_H - 0.05 * (1 - Math.cos(bend)) - 0.36 * crouch) * S,
      aly + Math.sqrt(Math.max(0, far * far - (lx - jlx) * (lx - jlx) - (lz - jlz) * (lz - jlz))),
      ary + Math.sqrt(Math.max(0, far * far - (rx - jrx) * (rx - jrx) - (rz - jrz) * (rz - jrz))),
    )
    // the knees forward (and out, crouching)
    const sp = 0.45 * crouch
    // (points passed in scratch vectors: numbers passed to a helper the
    // engine doesn't inline are boxed, garbage every frame)
    this.leg(p.leg, this._J.set(jlx, hy, jlz), this._K.set(lx, aly, lz), this._N.set(fs + fc * sp, 0, fc - fs * sp))
    this.leg(p.leg + 1, this._J.set(jrx, hy, jrz), this._K.set(rx, ary, rz), this._N.set(fs - fc * sp, 0, fc + fs * sp))
    const ty = yaw + twist
    this.axes(ty, bend + 0.05 * moving, -shift * 0.03)
    this._A.set(hx, hy, hz)
    this.basis(this.parts.torso, p.torso, this._tL, this._tU, this._tF, this._A)
    // arms, as directions from the shoulder (left, up, forward): hanging,
    // each swinging forward as the other side's foot does
    const g = p.gait.swing * moving
    const al = Math.max(-1, Math.min(1, ((rx - hx) * fs + (rz - hz) * fc) / (0.25 * S))) * g
    const ar = Math.max(-1, Math.min(1, ((lx - hx) * fs + (lz - hz) * fc) / (0.25 * S))) * g
    let a0 = 0.07
    let a1 = -1
    let a2 = 0.04 + al * 0.6
    let b0 = -0.07
    let b1 = -1
    let b2 = 0.04 + ar * 0.6
    if (reach > 0) {
      // at work: the hands down in the kalo, at the hull's lashings, at the grate
      let w0 = 0.1
      let w1 = -0.93
      let w2 = 0.36
      if (p.kind === 'loi') {
        w0 = 0.12
        w1 = -0.85
        w2 = 0.52
      } else if (p.kind === 'crew') {
        w0 = 0.13
        w1 = -0.72
        w2 = 0.68
      } else if (p.kind === 'keeper') {
        w0 = 0.12
        w1 = -0.78
        w2 = 0.6
      }
      // (now and then working at something, the hands by turns)
      // (a carrier's gest is his load, set down or not)
      const o = p.kind === 'keeper' || p.kind === 'carry' ? 0 : 0.13 * Math.sin(t * 1.7 + p.ph) * p.gest.at(t)
      a0 += (w0 - a0) * reach
      a1 += (w1 - a1) * reach
      a2 += (w2 + o - a2) * reach
      b0 += (-w0 - b0) * reach
      b1 += (w1 - b1) * reach
      b2 += (w2 - o - b2) * reach
    }
    if (p.kind === 'talk') {
      // a hand out toward the other, saying something
      const k = p.gest.at(t)
      if (p.side === RIGHT) {
        b0 += (-0.22 - b0) * k
        b1 += (-0.4 - b1) * k
        b2 += (0.88 - b2) * k
      } else {
        a0 += (0.22 - a0) * k
        a1 += (-0.4 - a1) * k
        a2 += (0.88 - a2) * k
      }
    } else if (p.kind === 'carry') {
      // a hand up on the pole, ahead of the shoulder it rests on (until it is set down)
      const k = 1 - p.gest.at(t)
      b0 += (-0.04 - b0) * k
      b1 += (0.1 - b1) * k
      b2 += (0.99 - b2) * k
    }
    const tL = this._tL
    const tU = this._tU
    const sw = SHOULDER_W * S
    const sh = SHOULDER_H * S
    const ux = tU.x * sh
    const uy = tU.y * sh
    const uz = tU.z * sh
    this._Fw.set(Math.sin(ty), 0, Math.cos(ty))
    this.arm(p.arm, this._Sh.set(hx + tL.x * sw + ux, hy + tL.y * sw + uy, hz + tL.z * sw + uz), this._D.set(a0, a1, a2), this._Fw)
    this.arm(p.arm + 1, this._Sh.set(hx - tL.x * sw + ux, hy - tL.y * sw + uy, hz - tL.z * sw + uz), this._D.set(b0, b1, b2), this._Fw)
    if (p.pack >= 0) {
      // the ʻauamo across the right shoulder, or set down on the bank ahead,
      // a little aslant along it, clear of his feet, the bundles of kalo on
      // the ground (they hang 0.44 m under the pole)
      const k = 0.22 * S
      const up = (SHOULDER_H + 0.05) * S
      this._A.set(hx - tL.x * k + tU.x * up, hy - tL.y * k + tU.y * up, hz - tL.z * k + tU.z * up)
      const down = p.gest.at(t)
      if (down > 0) {
        const ps = Math.sin(p.yaw + 0.2)
        const pc = Math.cos(p.yaw + 0.2)
        this._A.lerp(this._B.set(p.x + Math.sin(p.yaw) * 1.2 * S, p.floor + 0.44 * S, p.z + Math.cos(p.yaw) * 1.2 * S), down)
        this._X.set(pc, 0, -ps).lerp(tL, 1 - down)
        this._Y.set(0, 1, 0).lerp(tU, 1 - down)
        this._Z.set(ps, 0, pc).lerp(this._tF, 1 - down)
        this.basis(this.parts.pack, p.pack, this._X, this._Y, this._Z, this._A)
      } else this.basis(this.parts.pack, p.pack, tL, tU, this._tF, this._A)
    }
  }

  /** Someone sitting at their work: pounding poi, beating kapa, mending a net, or resting from it. */
  poseSeat(p, t) {
    const reach = p.reach.at(t)
    const fs = Math.sin(p.yaw)
    const fc = Math.cos(p.yaw)
    const hx = p.x
    const hy = p.y + SEAT_H * S
    const hz = p.z
    let lift = 0
    let bend
    if (p.kind === 'poi') {
      // the pounder lifted slowly, let fall onto the kalo, a beat, again
      const f = ((((t - p.ph) / 1.7) % 1) + 1) % 1
      lift = (f < 0.55 ? smoothstep(0, 0.55, f) : f < 0.68 ? 1 - ((f - 0.55) / 0.13) ** 2 : 0) * reach
      bend = 0.14 + 0.26 * reach - 0.14 * lift
    } else if (p.kind === 'kapa') {
      // the beater raised and brought down, steadily, on the bark
      const f = ((((t - p.ph) / 1.05) % 1) + 1) % 1
      lift = (f < 0.6 ? smoothstep(0, 0.6, f) : f < 0.72 ? 1 - ((f - 0.6) / 0.12) ** 2 : 0) * reach
      bend = 0.14 + 0.22 * reach - 0.05 * lift
    } else bend = 0.14 + 0.34 * reach
    this.axes(p.yaw, bend, 0)
    this._A.set(hx, hy, hz)
    this.basis(this.parts.torso, p.torso, this._tL, this._tU, this._tF, this._A)
    const tL = this._tL
    const tU = this._tU
    const sw = SHOULDER_W * S
    const sh = SHOULDER_H * S
    const slx = hx + tL.x * sw + tU.x * sh
    const sly = hy + tL.y * sw + tU.y * sh
    const slz = hz + tL.z * sw + tU.z * sh
    const srx = hx - tL.x * sw + tU.x * sh
    const sry = hy - tL.y * sw + tU.y * sh
    const srz = hz - tL.z * sw + tU.z * sh
    // where the hands go (left, up, forward of the hips): resting on the knees,
    // or at the work, as far into it as it has got (reach)
    let alx = 0.25
    let aly = -0.06
    let alz = 0.2
    let arx = -0.25
    let ary = -0.06
    let arz = 0.2
    if (p.kind === 'poi') {
      // both hands on the pounder, over the board
      const up = 0.17 + 0.3 * lift
      alx += (0.045 - alx) * reach
      aly += (up - aly) * reach
      alz += (0.54 - alz) * reach
      arx += (-0.045 - arx) * reach
      ary += (up - ary) * reach
      arz += (0.54 - arz) * reach
    } else if (p.kind === 'kapa') {
      // the left hand holding the bark on the kua
      alx += (0.17 - alx) * reach
      aly += (-0.03 - aly) * reach
      alz += (0.45 - alz) * reach
    } else {
      // both hands down at the net, knotting
      const o = 0.04 * Math.sin(t * 1.5 + p.ph) * reach
      alx += (0.13 - alx) * reach
      aly += (-0.15 - aly) * reach
      alz += (0.46 + o - alz) * reach
      arx += (-0.13 - arx) * reach
      ary += (-0.15 - ary) * reach
      arz += (0.46 - o - arz) * reach
    }
    this._Fw.set(fs, 0, fc)
    const hand = this._hand.copy(this.armTo(p.arm, this._Sh.set(slx, sly, slz), this._D.set(hx + (fc * alx + fs * alz) * S, hy + aly * S, hz + (-fs * alx + fc * alz) * S), this._Fw))
    if (p.kind === 'kapa') {
      // the right arm swung up and brought down so the beater, on past the
      // hand, comes down flat on the bark
      const qx = hx + (fc * arx + fs * arz) * S
      const qy = hy + ary * S
      const qz = hz + (-fs * arx + fc * arz) * S
      // (struck: toward the bark, the arm short of it by the beater's length)
      let dx = hx + (fc * -0.05 + fs * 0.46) * S - srx
      let dy = hy - 0.03 * S - sry
      let dz = hz + (-fs * -0.05 + fc * 0.46) * S - srz
      const l = Math.sqrt(dx * dx + dy * dy + dz * dz)
      const len = Math.min(ARM * S, l - 0.2 * S)
      // (raised: out level in front)
      const ux = fc * 0.12 + fs * 0.98
      const uz = -fs * 0.12 + fc * 0.98
      const k = lift * reach
      dx = (dx / l) * (1 - k) + ux * k
      dy = (dy / l) * (1 - k) + 0.08 * k
      dz = (dz / l) * (1 - k) + uz * k
      const m = (len + (ARM * S - len) * k) / Math.sqrt(dx * dx + dy * dy + dz * dz)
      const tx = srx + dx * m
      const ty = sry + dy * m
      const tz = srz + dz * m
      this.armTo(p.arm + 1, this._Sh.set(srx, sry, srz), this._D.set(qx + (tx - qx) * reach, qy + (ty - qy) * reach, qz + (tz - qz) * reach), this._Fw)
    } else this.armTo(p.arm + 1, this._Sh.set(srx, sry, srz), this._D.set(hx + (fc * arx + fs * arz) * S, hy + ary * S, hz + (-fs * arx + fc * arz) * S), this._Fw)
    if (p.kind === 'poi') {
      // the pounder upright between the hands, or set down at the end of the board
      hand.add(this._B).multiplyScalar(0.5)
      const k = 1 - reach
      hand.x += (hx + (fc * -0.32 + fs * 0.5) * S - hand.x) * k
      hand.y += (hy + (0.09 + 0.22 - SEAT_H) * S - hand.y) * k
      hand.z += (hz + (-fs * -0.32 + fc * 0.5) * S - hand.z) * k
      this._X.set(fc, 0, -fs)
      this._Y.set(0, 1, 0)
      this._Z.set(fs, 0, fc)
      this.basis(this.parts.tool, p.tool, this._X, this._Y, this._Z, hand, 1.5 * S, 0.8 * S, 1.5 * S)
    } else if (p.kind === 'kapa') {
      // the beater on from the right hand, along the arm, or laid down along
      // the end of the kua
      const k = 1 - reach
      if (k > 0) {
        this._Y.lerp(this._A.set(-fc, 0, fs), k).normalize()
        this._Z.set(0, 1, 0).addScaledVector(this._Y, -this._Y.y).normalize()
        this._X.crossVectors(this._Y, this._Z)
        this._B.x += (hx + (fc * -0.6 + fs * 0.48) * S - this._B.x) * k
        this._B.y += (hy + (0.195 - SEAT_H) * S - this._B.y) * k
        this._B.z += (hz + (-fs * -0.6 + fc * 0.48) * S - this._B.z) * k
      }
      this.basis(this.parts.tool, p.tool, this._X, this._Y, this._Z, this._B)
    }
  }

  /** An arm from the shoulder Sh toward the point T, reaching it if it can (shortened a little if it is nearer than the arm is long), of a figure facing Fw. Returns the hand. */
  armTo(i, Sh, T, Fw) {
    const sx = Sh.x
    const sy = Sh.y
    const sz = Sh.z
    const fs = Fw.x
    const fc = Fw.z
    const dx = T.x - sx
    const dy = T.y - sy
    const dz = T.z - sz
    const l = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6
    // (an elbow would bend; a straight arm can only be a little shorter)
    const len = Math.max(0.7 * ARM * S, Math.min(ARM * S, l))
    this._A.set(sx, sy, sz)
    this._B.set(sx + (dx / l) * len, sy + (dy / l) * len, sz + (dz / l) * len)
    if (Math.abs(fs * dx + fc * dz) > 0.85 * l) this._H.set(0, 1, 0)
    else this._H.set(fs, 0, fc)
    this.limb(this.parts.arm, i, this._A, this._B, this._H, len / ARM)
    return this._B
  }

  /** Torso axes: turned to yaw, bent forward by pitch, leaning onto its left by roll. */
  axes(yaw, pitch, roll) {
    const sy = Math.sin(yaw)
    const cy = Math.cos(yaw)
    const sp = Math.sin(pitch)
    const cp = Math.cos(pitch)
    const sr = Math.sin(roll)
    const cr = Math.cos(roll)
    // up tipped toward forward, then both tipped toward the left
    const ux = sy * sp
    const uy = cp
    const uz = cy * sp
    this._tU.set(ux * cr + cy * sr, uy * cr, uz * cr - sy * sr)
    this._tL.set(cy * cr - ux * sr, -uy * sr, -sy * cr - uz * sr)
    this._tF.set(sy * cp, -sp, cy * cp)
  }

  /**
   * A leg from the hip joint J to the ankle A, bending at the knee (which
   * goes toward K, a direction in x/z): the two-bone solve.
   */
  leg(i, J, A, K) {
    const L1 = THIGH * S
    const L2 = SHIN * S
    const jx = J.x
    const jy = J.y
    const jz = J.z
    const kx = K.x
    const kz = K.z
    let dx = A.x - jx
    let dy = A.y - jy
    let dz = A.z - jz
    let D = Math.sqrt(dx * dx + dy * dy + dz * dz)
    const lim = (L1 + L2) * 0.9999
    if (D > lim) {
      const k = lim / D
      dx *= k
      dy *= k
      dz *= k
      D = lim
    }
    D = Math.max(D, 1e-6)
    const ux = dx / D
    const uy = dy / D
    const uz = dz / D
    const a = (L1 * L1 - L2 * L2 + D * D) / (2 * D)
    const b = Math.sqrt(Math.max(0, L1 * L1 - a * a))
    // the knee out square to the line from hip to ankle, toward k
    const dp = kx * ux + kz * uz
    let nx = kx - dp * ux
    let ny = -dp * uy
    let nz = kz - dp * uz
    const nl = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1
    nx /= nl
    ny /= nl
    nz /= nl
    this._A.set(jx, jy, jz)
    this._B.set(jx + ux * a + nx * b, jy + uy * a + ny * b, jz + uz * a + nz * b)
    this._H.set(kx, 0, kz)
    this.limb(this.parts.thigh, i, this._A, this._B, this._H)
    this._A.set(jx + dx, jy + dy, jz + dz)
    this.limb(this.parts.shin, i, this._B, this._A, this._H)
  }

  /** An arm from the shoulder Sh, in direction D (x left, y up, z forward) of a figure facing Fw. Returns the hand. */
  arm(i, Sh, D, Fw) {
    const sx = Sh.x
    const sy = Sh.y
    const sz = Sh.z
    const fs = Fw.x
    const fc = Fw.z
    let dx = fc * D.x + fs * D.z
    let dy = D.y
    let dz = -fs * D.x + fc * D.z
    const l = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1
    const k = (ARM * S) / l
    dx *= k
    dy *= k
    dz *= k
    this._A.set(sx, sy, sz)
    this._B.set(sx + dx, sy + dy, sz + dz)
    // (its front forward, or up when it points that way)
    if (Math.abs(fs * dx + fc * dz) > 0.85 * ARM * S) this._H.set(0, 1, 0)
    else this._H.set(fs, 0, fc)
    this.limb(this.parts.arm, i, this._A, this._B, this._H)
    return this._B
  }

  /** A limb hanging from top to bot, its front turned toward hint (sy: its scale along itself). */
  limb(mesh, i, top, bot, hint, sy = S) {
    const Y = this._Y.subVectors(top, bot).normalize()
    const Z = this._Z.copy(hint).addScaledVector(Y, -hint.dot(Y))
    if (Z.lengthSq() < 1e-8) {
      // (the hint along the limb itself: any direction square to it will do)
      if (Math.abs(Y.x) < 0.9) Z.set(1, 0, 0).addScaledVector(Y, -Y.x)
      else Z.set(0, 0, 1).addScaledVector(Y, -Y.z)
    }
    Z.normalize()
    this.basis(mesh, i, this._X.crossVectors(Y, Z), Y, Z, top, S, sy, S)
  }

  /** Instance i of mesh: columns X, Y, Z scaled, at P, written straight into its buffer. */
  basis(mesh, i, X, Y, Z, P, sx = S, sy = S, sz = S) {
    const e = mesh.instanceMatrix.array
    const o = i * 16
    e[o] = X.x * sx
    e[o + 1] = X.y * sx
    e[o + 2] = X.z * sx
    e[o + 3] = 0
    e[o + 4] = Y.x * sy
    e[o + 5] = Y.y * sy
    e[o + 6] = Y.z * sy
    e[o + 7] = 0
    e[o + 8] = Z.x * sz
    e[o + 9] = Z.y * sz
    e[o + 10] = Z.z * sz
    e[o + 11] = 0
    e[o + 12] = P.x
    e[o + 13] = P.y
    e[o + 14] = P.z
    e[o + 15] = 1
    this.mark(mesh, i)
  }

  mark(mesh, i) {
    const u = mesh.userData
    if (i < u.lo) u.lo = i
    if (i > u.hi) u.hi = i
  }

  /** Upload just the stretch of a mesh's instances touched this frame (merged with any still waiting to go). */
  flush(mesh) {
    const u = mesh.userData
    if (u.hi < u.lo) return
    const attr = mesh.instanceMatrix
    const r = u.range
    const s = u.lo * 16
    const e = (u.hi + 1) * 16
    if (attr.updateRanges.length) {
      const e0 = r.start + r.count
      r.start = Math.min(r.start, s)
      r.count = Math.max(e0, e) - r.start
    } else {
      r.start = s
      r.count = e - s
      attr.updateRanges.push(r)
    }
    attr.needsUpdate = true
    u.lo = Infinity
    u.hi = -1
  }

  setInstance(mesh, i, x, y, z, rot, scale, tint = 1, tilt = 0, roll = 0) {
    this._p.set(x, y, z)
    this._e.set(tilt, rot, roll, 'YXZ')
    this._q.setFromEuler(this._e)
    this._s.setScalar(scale)
    this._m.compose(this._p, this._q, this._s)
    mesh.setMatrixAt(i, this._m)
    if (tint !== 1 || mesh.instanceColor) mesh.setColorAt(i, this._c.setRGB(tint, tint, tint))
  }

  /** Put the procession just short of a point on the trail (the ahu). */
  walkTo(x, z) {
    let best = 0
    let bd = Infinity
    for (let i = 0; i < this.trail.length; i++) {
      const d = Math.hypot(this.trail[i][0] - x, this.trail[i][1] - z)
      if (d < bd) {
        bd = d
        best = this.trailLen[i]
      }
    }
    this.procS = best - 0.12
  }

  trailPoint(s) {
    const L = this.trailLen[this.trailLen.length - 1]
    s = ((s % L) + L) % L
    let lo = 0
    let hi = this.trailLen.length - 1
    while (lo < hi - 1) {
      const mid = (lo + hi) >> 1
      if (this.trailLen[mid] <= s) lo = mid
      else hi = mid
    }
    const a = this.trail[lo % this.trail.length]
    const b = this.trail[(lo + 1) % this.trail.length]
    const t = (s - this.trailLen[lo]) / Math.max(1e-6, this.trailLen[lo + 1] - this.trailLen[lo])
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.atan2(b[0] - a[0], b[1] - a[1])]
  }

  /** Where the camera is headed (the end of a flight, if one is under way), and how soon. */
  watch() {
    const rig = this.app.rig
    const f = rig.flight
    const v = this.view
    const goal = f ? f.dest : rig.goal
    v.x = goal.target.x
    v.z = goal.target.z
    v.dist = goal.distance
    v.remain = f ? (1 - f.t) * f.duration : 0
    return v
  }

  update(dt, time) {
    const app = this.app
    const T = app.terrain
    const cam = app.camera.position
    // someone setting off to watch the surf or the hōlua should see something
    // happen soon after they get there, so this looks ahead to where the camera
    // is going even while it is still up in the air
    const view = this.watch()
    const f = app.rig.flight
    for (const brk of this.breaks) {
      const watching = Math.hypot(view.x - brk.x[0], view.z - brk.z[0]) < 1.6 && view.dist < 5
      if (watching && !brk.watching) brk.due = true
      // (once the camera is well on its way, not while it still looks at
      // wherever it set off from, where the sets would be seen to jump)
      if (!watching) brk.due = false
      else if (brk.due && (!f || f.t > 0.3)) {
        brk.due = false
        this.hurrySet(brk, view.remain)
      }
      brk.watching = watching
    }
    const h = this.holua
    if (h) {
      h.time += dt
      const along = Math.max(0, Math.min(h.len, (view.x - h.x[0]) * h.dx + (view.z - h.z[0]) * h.dz))
      const watching = Math.hypot(view.x - h.x[0] - h.dx * along, view.z - h.z[0] - h.dz * along) < 2 && view.dist < 16
      if (watching && !h.watching) this.holuaFor(h, view)
      h.watching = watching
    }
    const near = cam.y - Math.max(0, T.heightAt(cam.x, cam.z)) < 30
    this.group.visible = near
    if (!near) {
      // a sled keeps going while nobody is low enough to see it, so a run put
      // under way for someone flying in from high up still comes down on cue
      if (h && h.runner && h.runner.state === 'run') this.slide(h, h.runner, dt)
      return
    }

    this.updateFolk(time)

    // procession: walking pace, sped up a little with the clock
    const makahiki = app.season === 'hooilo'
    const standMesh = this.poseMeshes.stand
    let n = 0
    this.akua.visible = makahiki
    if (makahiki) {
      this.procS += dt * 0.0035 * Math.max(1, Math.min(8, app.clock.speed / 20))
      for (let k = 0; k < 11; k++) {
        const [x, z, rot] = this.trailPoint(this.procS - k * 0.035)
        const y = Math.max(0, T.heightAt(x, z)) + Math.abs(Math.sin(time * 4.2 + k)) * 0.0012
        this.setInstance(standMesh, n++, x, y, z, rot, S, k === 5 ? 2.2 : 1)
        if (k === 5) {
          this.akua.position.set(x, y, z)
          this.akua.rotation.y = rot
          this.akua.scale.setScalar(S)
        }
      }
    }
    n = this.updateHolua(dt, time, n)
    standMesh.count = n
    standMesh.instanceMatrix.needsUpdate = true
    if (standMesh.instanceColor) standMesh.instanceColor.needsUpdate = true
    this.updateSurf(dt, time)

    // fishing canoes bob and drift on their grounds
    for (const bt of this.boats) {
      bt.g.position.x = bt.x + Math.sin(time * 0.05 + bt.drift) * 0.6
      bt.g.position.z = bt.z + Math.cos(time * 0.04 + bt.drift) * 0.6
      bt.g.position.y = Math.sin(time * 1.3 + bt.ph) * 0.0015
      bt.g.rotation.z = Math.sin(time * 1.1 + bt.ph) * 0.04
      bt.g.rotation.y += dt * 0.02
    }
    // the voyager sails a long loop well offshore
    this.voyagerS += dt * 0.004
    const vr = 155
    const va = this.voyagerS
    this.voyager.position.set(Math.cos(va) * vr * 0.95 + 10, Math.sin(time * 0.9) * 0.002, Math.sin(va) * vr * 0.7)
    this.voyager.rotation.y = -va - Math.PI / 2
    this.voyager.rotation.x = 0.06

    // ʻiwa wheel on the thermals
    for (let k = 0; k < this.birdCentres.length; k++) {
      const c = this.birdCentres[k]
      const a = c.ph + time * c.sp
      const x = c.x + Math.cos(a) * c.r
      const z = c.z + Math.sin(a) * c.r
      const y = Math.max(0, T.heightAt(x, z)) + c.h + Math.sin(time * 0.3 + k) * 0.1
      this.setInstance(this.birds, k, x, y, z, -a, S * 1.4, 1, 0.3)
    }
    this.birds.count = this.birdCentres.length
    this.birds.instanceMatrix.needsUpdate = true
  }

  // --- surf -------------------------------------------------------------------------------------------

  /**
   * Someone is on their way to watch this break: whoever is at the front of
   * the lineup will not let the next wave go by. If nobody is on a wave or
   * paddling for one and it is in a lull, the swell clock is pushed on so the next set arrives
   * a few seconds after they do (it only ever moves forward, only between
   * sets, and only while the camera is in the air, so nothing seen jumps);
   * if a wave has just gone through, or is nearly there, someone still goes
   * for it, further down the line if that is where they can still catch it.
   */
  hurrySet(brk, remain) {
    brk.eager = true
    let busy = false
    for (const sf of brk.surfers) if (sf.state === 'go' || sf.state === 'ride') busy = true
    // (with everyone still well inside paddling back, an early set would go by unridden)
    if (busy || !this.nextUp(brk, true)) return
    const oc = this.app.ocean
    const tp = oc.swellTimeAt(brk.x[0], brk.z[0])
    const sw = swellAt(tp, this._sw)
    // The last wave's white water has all but gone by age 7 (see the shader).
    // The next is brought on to reach the peak 8 s after they land, so
    // whoever goes is seen sprint-paddling for it first; this break is told
    // of the move, so it does not take it for a jump and let the wave by.
    if (remain >= 1.2 && sw.age > 7 && sw.next > remain + 9) {
      const by = sw.next - (remain + 8)
      oc.swellT += by
      brk.lastT += by
    } else if (sw.next <= LEAD) this.catchLate(brk, tp, tp + sw.next)
    else if (sw.age < 8) this.catchLate(brk, tp, tp - sw.age)
  }

  /**
   * A wave that reaches the peak at swell time waveT was let go (or has not
   * been called yet): the front of the lineup goes for it after all, from
   * the peak if there is still time to paddle there, otherwise further down
   * the line where it has yet to break.
   */
  catchLate(brk, tp, waveT) {
    const take = tp > waveT ? this.breakS(brk, SWELL.speed * (tp - waveT)) + 0.14 : 0
    // whoever is next up, or failing that whoever else can still get to it
    // (sitting nearer the shoulder, or nearly back out)
    for (let tries = 0; tries < brk.surfers.length; tries++) {
      const first = this.nextUp(brk, true)
      if (!first) break
      first.tried = true
      if (this.goFor(first, brk, waveT, take)) {
        brk.eager = false
        break
      }
    }
    for (const sf of brk.surfers) sf.tried = false
  }

  /**
   * Who goes next: whoever has sat in the lineup longest. For a visitor who
   * has just come to watch (`wide`), failing anyone sitting there, whoever is
   * out past the break on the way back to it and nearest.
   */
  nextUp(brk, wide) {
    let best = null
    for (const sf of brk.surfers) if (sf.state === 'sit' && !sf.tried && (!best || sf.since < best.since)) best = sf
    if (best || !wide) return best
    let bd = Infinity
    for (const sf of brk.surfers) {
      if (sf.state !== 'back' || sf.leg < 1 || sf.tried) continue
      const d = Math.hypot(sf.x - brk.lineX, sf.z - brk.lineZ)
      if (d < bd) {
        bd = d
        best = sf
      }
    }
    return best
  }

  /** A set wave is LEAD seconds out from the peak: does anyone go? */
  callWave(brk, waveT, height, last) {
    const rand = this.rand
    // the bigger the wave, the likelier someone takes it; nobody lets the
    // last of a set go by, with the long wait for the next to come
    if (!brk.eager && !last && rand() > 0.25 + 0.7 * (height - 0.5) * 2) return
    // whoever has sat longest goes; now and then someone shares it further
    // down the line. Someone always sits a set out in the lineup, unless a
    // visitor has just come to watch and it is the last one there.
    let sitting = 0
    for (const sf of brk.surfers) if (sf.state === 'sit') sitting++
    const first = this.nextUp(brk, brk.eager)
    if (!first || (sitting < 2 && !brk.eager)) return
    if (!this.goFor(first, brk, waveT, 0)) return
    brk.eager = false
    if (sitting > 2 && rand() < 0.35) {
      // (whoever sits nearest the shoulder, where they would take off)
      const take = Math.max(0.16 + rand() * 0.1, first.take + 0.12)
      const k = Math.min(brk.n - 1, Math.round(take / brk.step))
      let second = null
      let best = Infinity
      for (const sf of brk.surfers) {
        const d = Math.hypot(sf.x - brk.x[k], sf.z - brk.z[k])
        if (sf !== first && sf.state === 'sit' && d < best) {
          best = d
          second = sf
        }
      }
      if (second) this.goFor(second, brk, waveT, take)
    }
  }

  /**
   * Go for the wave that reaches the peak at swell time waveT, taking off at
   * arc length `take` or, if they cannot paddle there in time, at the first
   * place further down the line they can reach before it breaks there. False
   * (and they stay put) if there is no such place.
   */
  goFor(sf, brk, waveT, take) {
    const now = brk.lastT - waveT
    for (let k = Math.ceil(take / brk.step - 1e-6); k < brk.n; k++) {
      const s = k * brk.step
      if (s > brk.len - 0.35) return false
      // how far ahead of the white water they ride: whoever takes off down
      // the line catches it further out on the shoulder, before it breaks
      // there, and stays out ahead of anyone who took off at the peak
      const lead = s > 0.02 ? 0.14 : 0.05
      const tTake = this.breakG(brk, Math.max(0, s - lead)) / SWELL.speed
      const fx = brk.x[k] + brk.nx[k] * FACE
      const fz = brk.z[k] + brk.nz[k] * FACE
      const need = Math.hypot(fx - sf.x, fz - sf.z) / (SPRINT * sf.pace)
      if (tTake - now < need) continue
      const rand = this.rand
      Object.assign(sf, { state: 'go', wave: waveT, take: s, s, lead, tTake, a0: tTake - need, sx: sf.x, sz: sf.z, fx, fz })
      sf.dur = 10 + rand() * 10
      sf.fall = rand() < 0.35
      sf.goofy = rand() < 0.5
      return true
    }
    return false
  }

  /** How far the swell travels past a break's start to break at arc length s. */
  breakG(brk, s) {
    const f = Math.max(0, Math.min(brk.n - 1.001, s / brk.step))
    const k = f | 0
    return brk.g[k] + (brk.g[k + 1] - brk.g[k]) * (f - k)
  }

  /**
   * Off a wave (or never on it): the long way back, out past the break where
   * they are, round the outside of the lineup, and in to their place from
   * seaward, so they never paddle through the people sitting there.
   */
  paddleBack(sf, brk) {
    const k = Math.min(brk.n - 1, Math.max(0, Math.round(sf.s / brk.step)))
    sf.state = 'back'
    sf.leg = 0
    sf.wx = sf.x + brk.nx[k] * 0.2
    sf.wz = sf.z + brk.nz[k] * 0.2
  }

  updateSurf(dt, time) {
    const oc = this.app.ocean
    const sw = this._sw
    const c = this.counts
    c.board = c.ride = c.sit = c.prone = c.arm = 0
    for (const brk of this.breaks) {
      const tp = oc.swellTimeAt(brk.x[0], brk.z[0])
      // a jump in the swell clock (or a stretch with nobody near enough to
      // draw) leaves anyone caught on a wave to paddle back from where they are
      const jumped = Math.abs(tp - brk.lastT - dt) > 1
      brk.lastT = tp
      swellAt(tp + LEAD, sw)
      if (sw.age <= LEAD && sw.id !== brk.called) {
        brk.called = sw.id
        const waveT = tp + LEAD - sw.age
        const height = sw.height
        // (the last of a set, with a long lull to come after it)
        const last = swellAt(waveT + 0.01, sw).next > 30
        if (!jumped) this.callWave(brk, waveT, height, last)
      }
      for (const sf of brk.surfers) {
        if (jumped && (sf.state === 'go' || sf.state === 'ride')) this.paddleBack(sf, brk)
        this.stepSurfer(sf, brk, tp, dt, time)
      }
      this.separate(brk, dt)
      for (const sf of brk.surfers) this.drawSurfer(sf, time)
    }
    for (const key in this.surfPose) {
      const mesh = this.surfPose[key]
      mesh.count = c[key]
      mesh.visible = c[key] > 0
      mesh.instanceMatrix.needsUpdate = true
    }
    this.boards.count = c.board
    this.boards.visible = c.board > 0
    this.boards.instanceMatrix.needsUpdate = true
    this.boards.instanceColor.needsUpdate = true
    this.arms.count = c.arm
    this.arms.visible = c.arm > 0
    this.arms.instanceMatrix.needsUpdate = true
  }

  /**
   * Nobody paddles through anybody else: two boards closer than BOARD_GAP,
   * edge to edge, ease apart. Whoever is on a wave, or committed to one,
   * keeps their line and the other gives way.
   */
  separate(brk, dt) {
    const list = brk.surfers
    const o = this._sep
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i]
        const b = list[j]
        const fa = a.state === 'ride' || a.state === 'go'
        const fb = b.state === 'ride' || b.state === 'go'
        if (fa && fb) continue
        const ha = BOARD_HALF * a.scale
        const hb = BOARD_HALF * b.scale
        const ux = Math.sin(a.head) * ha
        const uz = Math.cos(a.head) * ha
        const vx = Math.sin(b.head) * hb
        const vz = Math.cos(b.head) * hb
        segGap(a.x - ux, a.z - uz, a.x + ux, a.z + uz, b.x - vx, b.z - vz, b.x + vx, b.z + vz, o)
        if (o.d >= BOARD_GAP) continue
        let nx = o.x
        let nz = o.z
        let l = o.d
        // (boards lying across each other: apart along the line between them)
        if (l < 1e-4) {
          nx = a.x - b.x
          nz = a.z - b.z
          l = Math.hypot(nx, nz)
          if (l < 1e-6) {
            nx = brk.tx[0]
            nz = brk.tz[0]
            l = 1
          }
        }
        const push = Math.min(BOARD_GAP - o.d, 0.04 * dt) / l
        const wa = fa ? 0 : fb ? 1 : 0.5
        a.x += nx * push * wa
        a.z += nz * push * wa
        b.x -= nx * push * (1 - wa)
        b.z -= nz * push * (1 - wa)
      }
    }
  }

  stepSurfer(sf, brk, tp, dt, time) {
    const A = tp - sf.wave // seconds since the wave sf went for reached the peak
    let pose = 'sit'
    let head = sf.head
    let turn = 2.5
    let pitch = 0
    let roll = 0
    let stroke = 0
    // (sitting up or lying on a board: rocked by each set wave as it passes under)
    sf.tilt = true
    if (sf.state === 'go' && A >= sf.tTake) {
      sf.state = 'ride'
      sf.s = sf.take
    }
    if (sf.state === 'sit') {
      // waiting, drifting a little about the spot, looking out for the next set
      sf.x += (sf.slotX + Math.sin(time * 0.05 + sf.ph) * 0.012 - sf.x) * Math.min(1, dt * 0.3)
      sf.z += (sf.slotZ + Math.cos(time * 0.04 + sf.ph) * 0.012 - sf.z) * Math.min(1, dt * 0.3)
      head = brk.seaHead + sf.look + Math.sin(time * 0.05 + sf.ph) * 0.15
      turn = 0.5
      pitch = -0.12
    } else if (sf.state === 'go') {
      const k = Math.min(brk.n - 1, Math.round(sf.take / brk.step))
      const toward = Math.atan2(sf.fx - sf.sx, sf.fz - sf.sz)
      if (A < sf.a0) {
        // seen it coming: the board swung round toward where it will stand
        // up, waiting for it to get close enough to go
        head = toward
        turn = 1.2
        pitch = -0.12
      } else {
        // then down flat and sprinting for it, a quick start and an even
        // pace, angling down the line in the last strokes as it lifts them
        const t = Math.min(1, (A - sf.a0) / Math.max(1e-3, sf.tTake - sf.a0))
        const u = (t < 0.2 ? (t * t) / 0.4 : t - 0.1) / 0.9
        sf.x = sf.sx + (sf.fx - sf.sx) * u
        sf.z = sf.sz + (sf.fz - sf.sz) * u
        const along = Math.atan2(brk.tx[k] * 0.55 - brk.nx[k] * 0.85, brk.tz[k] * 0.55 - brk.nz[k] * 0.85)
        head = toward + wrapAngle(along - toward) * smoothstep(0.6, 1, t)
        turn = 2.2
        pose = 'prone'
        stroke = 1.4
        pitch = -0.04
        sf.tilt = t < 0.6
      }
    } else if (sf.state === 'ride') {
      sf.tilt = false
      const r = A - sf.tTake
      // just ahead of where the wave is breaking: on the shoulder, in front of the white water
      // (no faster than a board goes: a section that peels quicker than that
      // closes out on whoever is on it)
      const sB = this.breakS(brk, SWELL.speed * A)
      // and never up onto someone further down the line on the same wave,
      // or through them where they have just kicked out or gone down
      let cap = brk.len
      for (const o of brk.surfers) if (o !== sf && (o.state === 'ride' || o.state === 'out' || o.state === 'fall') && o.wave === sf.wave && o.s > sf.s) cap = Math.min(cap, o.s - 0.08)
      sf.s = Math.max(sf.s, Math.min(sB + sf.lead * smoothstep(0, 1.5, r), sf.s + 0.13 * dt, cap))
      const f = Math.min(brk.n - 1.001, sf.s / brk.step)
      const k = f | 0
      const w = f - k
      const px = brk.x[k] + (brk.x[k + 1] - brk.x[k]) * w
      const pz = brk.z[k] + (brk.z[k + 1] - brk.z[k]) * w
      const nx = brk.nx[k]
      const nz = brk.nz[k]
      // drop down the face from just outside the line where it picked them
      // up, then trim up and down it
      const trim = smoothstep(1, 3, r)
      const off = FACE + (-0.03 - FACE) * smoothstep(0, 1.2, r) + 0.012 * Math.sin(r * 1.6 + sf.ph) * trim
      sf.x = px + nx * off
      sf.z = pz + nz * off
      const beta = 0.9 * Math.exp(-r * 1.4) + 0.12 - 0.3 * Math.cos(r * 1.6 + sf.ph) * trim
      const cb = Math.cos(beta)
      const sb = Math.sin(beta)
      head = Math.atan2(brk.tx[k] * cb - nx * sb, brk.tz[k] * cb - nz * sb)
      turn = 5
      pose = 'ride'
      pitch = 0.06 * Math.exp(-r)
      roll = 0.12 * Math.sin(beta)
      if (r >= sf.dur || sf.s >= brk.len - 0.01 || sB > sf.s + 0.08) {
        // kick out over the back of it, or go down with it
        sf.state = sf.fall || sB > sf.s + 0.08 ? 'fall' : 'out'
        sf.t = 0
      }
    } else if (sf.state === 'out' || sf.state === 'fall') {
      sf.t += dt
      const k = Math.min(brk.n - 1, Math.round(sf.s / brk.step))
      if (sf.state === 'out') {
        sf.x += brk.nx[k] * dt * 0.01
        sf.z += brk.nz[k] * dt * 0.01
        head = brk.seaHead
        turn = 1.8
        pose = sf.t < 0.6 ? 'ride' : 'sit'
        pitch = -0.12
        sf.tilt = sf.t > 0.6
      } else {
        // the board tumbles shoreward in the white water; the rider surfaces after it
        sf.x -= brk.nx[k] * dt * 0.02
        sf.z -= brk.nz[k] * dt * 0.02
        pose = sf.t < 1.8 ? null : 'prone'
        roll = Math.PI * smoothstep(0, 0.5, sf.t) * (1 - smoothstep(1.2, 1.8, sf.t))
        pitch = 0.4 * Math.sin(Math.min(sf.t, 1.8) * 3.5)
        turn = 0
        sf.tilt = false
      }
      if (sf.t > 2.6) this.paddleBack(sf, brk)
    } else if (sf.state === 'back') {
      // out past the break, round outside the lineup, then in to the place
      const tx = sf.leg === 0 ? sf.wx : sf.slotX + (sf.leg === 1 ? brk.nx[0] * 0.12 : 0)
      const tz = sf.leg === 0 ? sf.wz : sf.slotZ + (sf.leg === 1 ? brk.nz[0] * 0.12 : 0)
      const dx = tx - sf.x
      const dz = tz - sf.z
      const d = Math.hypot(dx, dz)
      const v = 0.017 * sf.pace * (sf.leg === 2 ? 0.6 : 1)
      if (d < v * dt + 0.003) {
        if (sf.leg === 2) {
          sf.state = 'sit'
          sf.since = time
        } else sf.leg++
      } else {
        sf.x += (dx / d) * v * dt
        sf.z += (dz / d) * v * dt
        head = Math.atan2(dx, dz)
      }
      turn = 1.5
      pose = 'prone'
      stroke = sf.leg === 2 ? 0.6 : 0.85
      pitch = -0.04
    }
    sf.head += wrapAngle(head - sf.head) * Math.min(1, dt * turn)
    sf.pose = pose
    sf.pitch = pitch
    sf.roll = roll
    sf.stroke = stroke
  }

  drawSurfer(sf, time) {
    // riding the small chop; the sea's surface is drawn flat, so a set wave
    // passing under tips the board (nose up on its face, down on its back)
    // instead of lifting it
    const y = 0.0012 + Math.sin(time * 1.7 + sf.ph) * 0.0004
    let pitch = sf.pitch
    let roll = sf.roll
    if (sf.pose !== 'ride') {
      pitch += Math.sin(time * 1.1 + sf.ph) * 0.03
      roll += Math.sin(time * 0.9 + sf.ph * 1.3) * 0.04
    }
    if (sf.tilt) {
      const oc = this.app.ocean
      const sw = swellAt(oc.swellTimeAt(sf.x, sf.z), this._sw)
      const sd = oc.swellDir
      // the shader's set-wave slope (ocean.glsl.js), along the board
      const k = (swellRidge(sw.age) * sw.height + swellRidge(-sw.next)) * (0.014 / SWELL.speed)
      pitch += k * (sd[0] * Math.sin(sf.head) + sd[1] * Math.cos(sf.head))
    }
    const c = this.counts
    const sc = S * sf.scale
    this.setInstance(this.boards, c.board++, sf.x, y, sf.z, sf.head, sc, sf.tint, pitch, roll)
    const pose = sf.pose
    if (!pose) return
    this.setInstance(this.surfPose[pose], c[pose]++, sf.x, y, sf.z, sf.head + (pose === 'ride' && sf.goofy ? Math.PI : 0), sc, 1, pitch, roll)
    if (pose === 'prone') {
      // arms in turn: reach forward, pull back under the board, then swing
      // forward again out to the side, clear of the water
      this._mb.copy(this._m)
      for (let side = 1; side >= -1; side -= 2) {
        const p = (time * sf.stroke + sf.ph + (side > 0 ? 0 : 0.5)) % 1
        const q = (p - 0.55) / 0.45
        const a = p < 0.55 ? 1.3 - (1.6 * p) / 0.55 : -0.3 + 1.6 * q
        const lift = p < 0.55 ? 0 : Math.sin(Math.PI * q) * 1.1
        this._ml.makeRotationZ(side * lift)
        this._ma.makeRotationX(-a)
        this._ml.multiply(this._ma).setPosition(0.25 * side, 0.2, 0.45)
        this._ma.multiplyMatrices(this._mb, this._ml)
        this.arms.setMatrixAt(c.arm++, this._ma)
      }
    }
  }

  // --- hōlua -------------------------------------------------------------------------------------------

  /** Height of the track's top at arc length s. */
  trackY(h, s) {
    const f = Math.max(0, Math.min(h.n - 1.001, s / h.ds))
    const k = f | 0
    return h.y[k] + (h.y[k + 1] - h.y[k]) * (f - k)
  }

  /**
   * A sled on the track at s: resting on it front and back (and never through
   * it over a hump), pitched with it. Writes y and pitch into `out`.
   */
  sledOnTrack(h, s, out) {
    const yf = this.trackY(h, s + SLED_HALF)
    const yb = this.trackY(h, s - SLED_HALF)
    out.y = Math.max((yf + yb) / 2, this.trackY(h, s))
    out.pitch = Math.atan2(yb - yf, SLED_HALF * 2)
    return out
  }

  /**
   * Slide a sled (`r.s` along the track, `r.v` in m/s) on for dt seconds:
   * down the slope under gravity, against sliding friction and the air, the
   * rider dragging hands and feet to a stop on the last stretch. True once stopped.
   */
  slide(h, r, dt) {
    const s1 = h.len - SLED_HALF - 0.005
    const steps = Math.ceil(dt / 0.02)
    const st = dt / steps
    for (let i = 0; i < steps; i++) {
      const slope = ((this.trackY(h, r.s + 0.02) - this.trackY(h, r.s - 0.02)) / 0.04) * (METRE / Y_PER_M)
      const th = Math.atan(-slope)
      let a = 9.8 * Math.sin(th) - 0.11 * 9.8 * Math.cos(th) - 0.003 * r.v * r.v
      const rem = (s1 - r.s) / METRE
      const brake = (r.v * r.v) / (2 * Math.max(rem, 0.5))
      if (brake > 2.5) a = Math.min(a, -brake)
      r.v = Math.max(r.v + a * st, rem > 1 ? 1.5 : 0)
      r.s = Math.min(s1, r.s + r.v * Math.cos(th) * st * METRE)
    }
    return r.s >= s1 - 1e-4 || r.v <= 0
  }

  /**
   * Someone is on their way to watch the hōlua. While they are still in the
   * air (and the track out of their sight), a run is put under way, or the one
   * already going is moved on down the track, timed to come down the last
   * stretch, past the crowd, a few seconds after they arrive. A sled already
   * on that last stretch is left to come in. If they are here already, the
   * next rider just goes now.
   */
  holuaFor(h, view) {
    const cam = this.app.camera.position
    const far = Math.hypot(cam.x - (h.x[0] + h.x[h.n - 1]) / 2, cam.z - (h.z[0] + h.z[h.n - 1]) / 2) > 7
    let wait = null
    for (const q of h.riders) if (q.state === 'wait' && (!wait || q.since < wait.since)) wait = q
    // (or failing that, whoever is furthest back up the walk, so long as
    // that is well up out of sight of the foot, where the camera is going)
    if (!wait) for (const q of h.riders) if ((q.state === 'home' || (q.state === 'walk' && q.s < h.len - 3)) && (!wait || q.s < wait.s)) wait = q
    let r = h.runner
    if (!far || view.remain < 1.5) {
      if (!r) h.next = Math.min(h.next, h.time)
      return
    }
    const kf = Math.round((h.len - 1.3) / h.ds)
    // (a sled that will have stopped before they get here counts as stopped)
    if (r && r.state === 'run' && r.s >= kf * h.ds && h.tAt[h.n - 1] - h.tAt[Math.min(h.n - 1, Math.round(r.s / h.ds))] > view.remain + 1.5) return
    if (!r || r.state === 'rest' || (r.state === 'run' && r.s >= kf * h.ds)) {
      // a sled lying at the foot would only be seen picked up and carried
      // off: that rider is already on the way back up, and the next one goes
      if (!wait) return
      if (r) r.state = 'rise'
      r = wait
    }
    // nobody standing about at the foot where the sled will come to a stop
    for (const q of h.riders) {
      if (q.state === 'rise' || (q.state === 'walk' && q.s > h.len - 0.3)) {
        q.state = 'walk'
        q.s = Math.min(q.s, h.len - 0.3)
        q.t = 0
      }
    }
    const lead = h.tAt[kf] - (view.remain + 5)
    let k = 0
    while (k < kf && h.tAt[k] < lead) k++
    const s = Math.max(SLED_HALF, k * h.ds)
    // (only ever on down the track, never back up it)
    if (r.state !== 'run' || r.s < s) {
      r.s = s
      r.v = h.vAt[k]
    }
    r.state = 'run'
    r.t = 0
    h.runner = r
  }

  updateHolua(dt, time, n) {
    const h = this.holua
    if (!h) return n
    const rand = this.rand
    // the next rider goes once the last one is up off the sled and a while has passed
    if (!h.runner && h.time >= h.next) {
      let r = null
      for (const q of h.riders) if (q.state === 'wait' && (!r || q.since < r.since)) r = q
      if (r) {
        r.state = 'walkin'
        r.t = 0
        h.runner = r
      }
    }
    this._ns = 0
    for (const r of h.riders) n = this.stepRider(r, h, dt, time, n, rand)
    const st = h.runner ? h.runner.state : null
    this.sledders.count = st === 'set' || st === 'run' || st === 'rest' ? 1 : 0
    this.sledders.visible = this.sledders.count > 0
    this.sleds.count = this._ns
    this.sleds.visible = this._ns > 0
    this.sleds.instanceMatrix.needsUpdate = true
    this.sledders.instanceMatrix.needsUpdate = true
    return n
  }

  /**
   * How high someone stands at (s along the track, off to the side of it):
   * on the causeway's top within its width, on the ground (as drawn) past the
   * foot of its walls, on the battered face in between.
   */
  standY(h, s, off, x, z) {
    const g = drawnHeight(this.app.terrain, x, z)
    if (s < 0 || s > h.len) return g
    return g + (Math.max(g, this.trackY(h, s)) - g) * smoothstep(0.056, 0.032, Math.abs(off))
  }

  stepRider(r, h, dt, time, n, rand) {
    const T = this.app.terrain
    const stand = this.poseMeshes.stand
    const pose = this._pose
    const lx = -h.dz
    const lz = h.dx
    r.t += dt
    // the start, a sled's length in from the top of the track
    const s0 = SLED_HALF
    if (r.state === 'rest' && r.t > 2) {
      r.state = 'rise'
      r.t = 0
      h.runner = null
      h.next = h.time + 25 + rand() * 55
    }
    // where someone is, standing or walking, from (s, off)
    let ws = 0
    let off = 0
    let rot = 0
    let carrying = true
    if (r.state === 'wait') {
      // standing about at the top, the sled on the grass beside them, laid
      // across the slope so it stays put
      ws = r.spotS
      off = r.spotOff
      rot = h.head + Math.sin(time * 0.1 + r.ph) * 0.5
      carrying = false
      const sx = h.x[0] + h.dx * (ws - 0.012) + lx * off
      const sz = h.z[0] + h.dz * (ws - 0.012) + lz * off
      const yf = drawnHeight(T, sx + lx * SLED_HALF, sz + lz * SLED_HALF)
      const yb = drawnHeight(T, sx - lx * SLED_HALF, sz - lz * SLED_HALF)
      this.setInstance(this.sleds, this._ns++, sx, (yf + yb) / 2, sz, Math.atan2(lx, lz), S, 1, Math.atan2(yb - yf, SLED_HALF * 2))
    } else if (r.state === 'walkin') {
      // carry the sled forward past the places in front of theirs, in
      // beside the head of the track, clear of its wall, then step up onto
      // it from the side, where the battered face lifts them a bit at a time
      const sa = s0 * 0.5
      const oa = 0.065 * r.side
      const l1 = sa - r.spotS
      const l2 = Math.abs(r.spotOff - oa)
      const d = r.t * 0.022 * r.pace
      const up = (l1 + l2) / (0.022 * r.pace)
      if (d < l1) {
        ws = r.spotS + d
        off = r.spotOff
        rot = h.head
      } else if (d < l1 + l2) {
        ws = sa
        off = r.spotOff + (oa - r.spotOff) * ((d - l1) / l2)
        rot = Math.atan2(lx * (oa - r.spotOff), lz * (oa - r.spotOff))
      } else {
        ws = sa
        off = oa + (0.016 * r.side - oa) * smoothstep(up, up + 1.6, r.t)
        rot = h.head
      }
      if (r.t > up + 1.6) {
        r.state = 'set'
        r.t = 0
        r.s = s0
        r.v = 0
      }
    } else if (r.state === 'set' || r.state === 'run' || r.state === 'rest') {
      if (r.state === 'set' && r.t > 1.6) {
        // a run and a dive, and away
        r.state = 'run'
        r.v = 1.5
      }
      if (r.state === 'run' && this.slide(h, r, dt)) {
        r.state = 'rest'
        r.t = 0
      }
      this.sledOnTrack(h, r.s, pose)
      this.setInstance(this.sledders, 0, h.x[0] + h.dx * r.s, pose.y, h.z[0] + h.dz * r.s, h.head, S, 1, pose.pitch)
      return n
    } else if (r.state === 'rise') {
      // up off the sled, a moment to get their breath, then pick it up
      this.sledOnTrack(h, r.s, pose)
      this.setInstance(this.sleds, this._ns++, h.x[0] + h.dx * r.s, pose.y, h.z[0] + h.dz * r.s, h.head, S, 1, pose.pitch)
      ws = r.s
      off = 0.016 * r.side
      rot = h.head + Math.PI + r.side * 1.2
      carrying = false
      if (r.t > 3) {
        r.state = 'walk'
        r.t = 0
      }
    } else if (r.state === 'walk') {
      // the long climb back, down off the causeway and up beside it, slower
      // where it is steep, and never up through whoever is just ahead
      const slope = (this.trackY(h, r.s - 0.02) - this.trackY(h, r.s + 0.02)) / 0.04
      let ahead = -1
      // (or someone just off the top of the lane, on their way over to their place)
      for (const q of h.riders) if (q !== r && (q.state === 'walk' || (q.state === 'home' && q.t < 2)) && q.side === r.side && q.s < r.s && q.s > ahead) ahead = q.s
      r.s = Math.max(0, ahead + 0.03, r.s - (0.022 * r.pace * dt) / (1 + 1.2 * Math.abs(slope)))
      ws = r.s
      off = (0.016 + 0.074 * smoothstep(0, 0.15, h.len - r.s)) * r.side
      rot = h.head + Math.PI
      if (r.s <= 0) {
        r.state = 'home'
        r.t = 0
      }
    } else {
      // 'home': over to their place at the top, round the outside of
      // everyone already waiting there: out, back past them, then in
      const o0 = 0.09 * r.side
      const l1 = Math.abs(r.wayOff - o0)
      const l2 = -r.spotS
      const l3 = Math.abs(r.wayOff - r.spotOff)
      const d = r.t * 0.02 * r.pace
      let ds = 0
      let doff = 0
      if (d < l1) {
        off = o0 + (r.wayOff - o0) * (d / l1)
        doff = r.wayOff - o0
      } else if (d < l1 + l2) {
        ws = l1 - d
        off = r.wayOff
        ds = -1
      } else {
        ws = r.spotS
        off = r.wayOff + (r.spotOff - r.wayOff) * Math.min(1, (d - l1 - l2) / l3)
        doff = r.spotOff - r.wayOff
      }
      rot = Math.atan2(h.dx * ds + lx * doff, h.dz * ds + lz * doff)
      if (d >= l1 + l2 + l3) {
        r.state = 'wait'
        r.since = time
      }
    }
    const x = h.x[0] + h.dx * ws + lx * off
    const z = h.z[0] + h.dz * ws + lz * off
    const y = this.standY(h, ws, off, x, z)
    if (!carrying) {
      this.setInstance(stand, n++, x, y, z, rot, S)
      return n
    }
    return this.carry(stand, n, x, y, z, rot, time, r)
  }

  /** Someone walking with a sled on the shoulder. */
  carry(stand, n, x, y, z, rot, time, r) {
    y += Math.abs(Math.sin(time * 4.5 + r.ph)) * 0.0006
    this.setInstance(stand, n++, x, y, z, rot, S)
    this._mb.copy(this._m)
    this._ml.makeRotationX(-0.3).setPosition(0.3, 1.36, -0.2)
    this._ma.multiplyMatrices(this._mb, this._ml)
    this.sleds.setMatrixAt(this._ns++, this._ma)
    return n
  }
}
