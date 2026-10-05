// People, canoes, surfers, birds and smoke — the island's day going on.
//
// Everyone is a little instanced figure in one of a few poses, moved on the CPU
// each frame (there are only a few hundred of them). Most stay where the work
// is: bent over in the loʻi, sitting in the kauhale, on the heiau court. Some go
// somewhere: canoes work the fishing grounds past the reef, surfers wait out the
// lulls and ride the sets, sledders run the hōlua, a voyaging canoe sails the
// coast, and in the Makahiki season Lono's akua loa is carried clockwise around
// the island on the shore trail, the land always on the bearers' right.

import * as THREE from 'three'
import { HALF, HYDRO_RES, METRE, WORLD, Y_PER_M } from '../config.js'
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
  } else if (pose === 'bend') {
    B.box(-0.12, 0, 0, 0.16, 0.8, 0.18, skin, MAT.skin, 0, 0.8)
    B.box(0.12, 0, 0, 0.16, 0.8, 0.18, skin, MAT.skin, 0, 0.8)
    B.box(0, 0.72, 0.05, 0.42, 0.3, 0.3, cloth, MAT.plain)
    // torso tipped forward toward +z, hands down in the water
    B.hexa([[-0.22, 0.75, 0.05], [0.22, 0.75, 0.05], [0.2, 0.8, 0.62], [-0.2, 0.8, 0.62]], [[-0.22, 0.95, 0.05], [0.22, 0.95, 0.05], [0.2, 1.05, 0.62], [-0.2, 1.05, 0.62]], skin, MAT.skin)
    B.box(0, 0.78, 0.62, 0.4, 0.27, 0.1, skin, MAT.skin)
    B.box(-0.24, 0.35, 0.6, 0.1, 0.5, 0.1, skin, MAT.skin)
    B.box(0.24, 0.35, 0.6, 0.1, 0.5, 0.1, skin, MAT.skin)
    B.blob(0, 1.02, 0.8, 0.13, 0.14, 0.14, col('#3a2418', 0.1, rand), MAT.skin, 2, false)
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

    // --- people who stay put -------------------------------------------------------
    this.people = { stand: [], bend: [], sit: [] }
    const add = (pose, x, z, rot, y = null, tint = 1) => this.people[pose].push({ x, z, y: y ?? ground(x, z), rot, ph: rand() * 6.28, tint })
    for (const l of sites.loi) {
      const n = l.model ? 16 : 5
      for (let k = 0; k < n; k++) {
        const p = l.paddies[Math.floor(rand() * l.paddies.length)]
        if (!p.flood) continue
        // somewhere out in the paddy, between its middle and an edge
        const q = p.poly[Math.floor(rand() * p.poly.length)]
        const u = rand() * 0.7
        let x = p.c[0] + (q[0] - p.c[0]) * u
        let z = p.c[1] + (q[1] - p.c[1]) * u
        if (!insidePoly(p.poly, x, z)) [x, z] = p.c
        add('bend', x, z, rand() * 6.28, (p.level - 0.25) * 0.013)
      }
    }
    for (const v of sites.villages) {
      const n = v.model ? 12 : v.alii ? 14 : 4
      for (let k = 0; k < n; k++) {
        const a = rand() * 6.28
        const r = 0.04 + rand() * 0.25
        add(rand() < 0.5 ? 'sit' : 'stand', v.x + Math.cos(a) * r, v.z + Math.sin(a) * r, rand() * 6.28)
      }
    }
    for (const h of sites.heiau.filter((x) => x.model || x.kind === 'luakini')) {
      for (let k = 0; k < 3; k++) add('stand', h.x + (rand() - 0.5) * 0.12, h.z + (rand() - 0.5) * 0.08, h.rot + Math.PI, ground(h.x, h.z) + 0.07, 2.4)
    }
    for (const c of sites.canoes) {
      for (let k = 0; k < (c.village === sites.model ? 5 : 2); k++) add('stand', c.x + (rand() - 0.5) * 0.2, c.z + (rand() - 0.5) * 0.2, c.dir + Math.PI + (rand() - 0.5))
    }
    for (const p of sites.ponds) {
      const g = p.wall[Math.round(p.gates[0] * (p.wall.length - 1))]
      add('stand', g[0] - p.ax * 0.02, g[1] - p.az * 0.02, Math.atan2(p.az, p.ax), 0.02)
    }
    // the hōlua: a crowd at the foot of the run, a few along it and at the top,
    // all standing back past the lane the riders walk up in (|off| 0.09)
    // (surfers and sledders draw on their own sequence, so everything else is
    // placed just as it was before they came)
    const own = mulberry32(meta.seed + 2025)
    const track = app.features.holuaPath
    if (track && track.length > 1) {
      const a = track[0]
      const b = track[track.length - 1]
      const len = Math.hypot(b[0] - a[0], b[2] - a[2])
      const dx = (b[0] - a[0]) / len
      const dz = (b[2] - a[2]) / len
      // (on the ground as it is drawn: on this steep, folded slope the
      // terrain mesh stands well off the smooth heightAt in places)
      const watch = (along, side, pose) => {
        const x = a[0] + dx * along - dz * side
        const z = a[2] + dz * along + dx * side
        this.people[pose].push({ x, z, y: Math.max(0, drawnHeight(T, x, z)), rot: Math.atan2(dz * side, -dx * side) + (own() - 0.5) * 0.6, ph: 0, tint: 1 })
      }
      for (let k = 0; k < 16; k++) watch(len - 0.05 - own() * 0.7, (k % 2 ? -1 : 1) * (0.125 + own() * 0.075), own() < 0.6 ? 'stand' : 'sit')
      for (let k = 0; k < 4; k++) watch(len * (0.35 + own() * 0.4), (own() < 0.5 ? -1 : 1) * (0.125 + own() * 0.075), 'sit')
      for (let k = 0; k < 3; k++) watch(0.04 + own() * 0.12, -(0.13 + own() * 0.07), 'stand')
    }
    this.poseMeshes = {}
    for (const pose of ['stand', 'bend', 'sit']) {
      const list = this.people[pose]
      const count = Math.max(1, list.length + (pose === 'stand' ? 40 : 0))
      const mesh = new THREE.InstancedMesh(person(pose, rand), this.mat, count)
      // three makes the colour buffer on the first setColorAt, filled with
      // black, so anyone placed before that would stay a silhouette
      mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(count * 3).fill(1), 3)
      mesh.frustumCulled = false
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      this.group.add(mesh)
      this.poseMeshes[pose] = mesh
    }
    this.writeStatic()

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

  writeStatic() {
    for (const pose in this.people) {
      const mesh = this.poseMeshes[pose]
      const list = this.people[pose]
      for (let i = 0; i < list.length; i++) this.setInstance(mesh, i, list[i].x, list[i].y, list[i].z, list[i].rot, S, list[i].tint)
      mesh.count = list.length
      mesh.instanceMatrix.needsUpdate = true
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
    }
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

    // procession: walking pace, sped up a little with the clock
    const makahiki = app.season === 'hooilo'
    const standMesh = this.poseMeshes.stand
    let n = this.people.stand.length
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
