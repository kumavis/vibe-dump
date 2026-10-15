import * as THREE from 'three'
import { skinTexture } from '../world/textures.js'
import { hashString } from '../core/rng.js'
import { lerp, smoothstep } from '../core/mathx.js'

// Procedural dinosaur rigs. A species' `body` block becomes a bone hierarchy
// and one skinned mesh: continuous tubes for torso, neck, tail and limbs with
// soft weights across joints, plus rigid features (frills, plates, horns). One
// draw call per animal; the bones are what the animator moves.
//
// Rig space: +Z forward, +Y up, +X is the animal's left. Units are metres at
// scale 1; individuals are scaled on the mesh.

const WHITE_V = 0.975 // texture strip that is pure white (features use vertex colour)

class SkinGeo {
  constructor() {
    this.pos = []
    this.nor = []
    this.uv = []
    this.col = []
    this.si = []
    this.sw = []
    this.idx = []
  }
  vertex(p, n, u, v, c, weights) {
    this.pos.push(p.x, p.y, p.z)
    this.nor.push(n.x, n.y, n.z)
    this.uv.push(u, v)
    this.col.push(c.r, c.g, c.b)
    const w = weights.slice(0, 4)
    while (w.length < 4) w.push([0, 0])
    let sum = 0
    for (const [, ww] of w) sum += ww
    for (const [b, ww] of w) {
      this.si.push(b)
      this.sw.push(sum > 0 ? ww / sum : 0)
    }
    return this.pos.length / 3 - 1
  }
  tri(a, b, c) {
    this.idx.push(a, b, c)
  }
  build() {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3))
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3))
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2))
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3))
    g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(this.si, 4))
    g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(this.sw, 4))
    g.setIndex(this.idx)
    return g
  }
}

const WHITE = new THREE.Color(1, 1, 1)
const _p = new THREE.Vector3()
const _n = new THREE.Vector3()
const _m3 = new THREE.Matrix3()

// rings: [{ m: Matrix4 (ring lies in local XY, axis +Z), rx, ry, v, w: weights }]
function tube(g, rings, sides, { capStart = true, capEnd = true, color = WHITE } = {}) {
  const first = []
  let prev = null
  for (let r = 0; r < rings.length; r++) {
    const ring = rings[r]
    _m3.getNormalMatrix(ring.m)
    const cur = []
    for (let k = 0; k <= sides; k++) {
      const phi = (k / sides) * Math.PI * 2
      _p.set(Math.sin(phi) * ring.rx, Math.cos(phi) * ring.ry, 0).applyMatrix4(ring.m)
      _n.set(Math.sin(phi) / ring.rx, Math.cos(phi) / ring.ry, 0).applyMatrix3(_m3).normalize()
      cur.push(g.vertex(_p, _n, k / sides, ring.v, color, ring.w))
    }
    if (prev) {
      for (let k = 0; k < sides; k++) {
        g.tri(prev[k], cur[k], prev[k + 1])
        g.tri(cur[k], cur[k + 1], prev[k + 1])
      }
    } else first.push(...cur)
    prev = cur
  }
  const cap = (ring, verts, flip) => {
    _m3.getNormalMatrix(ring.m)
    _p.set(0, 0, 0).applyMatrix4(ring.m)
    _n.set(0, 0, flip ? -1 : 1).applyMatrix3(_m3).normalize()
    // pull the cap centre out a little so ends are rounded, not flat
    const c = g.vertex(_p.clone().addScaledVector(_n, Math.min(ring.rx, ring.ry) * 0.6), _n, 0.5, ring.v, color, ring.w)
    for (let k = 0; k < sides; k++) {
      if (flip) g.tri(c, verts[k], verts[k + 1])
      else g.tri(c, verts[k + 1], verts[k])
    }
  }
  if (capStart) cap(rings[0], first, true)
  if (capEnd) cap(rings[rings.length - 1], prev, false)
}

// A rigid three.js primitive bound to one bone.
function rigid(g, geo, matrix, boneIdx, color, uvMode = 'white', vRange = [0.5, 0.6]) {
  const src = geo.index ? geo : geo
  const pos = src.attributes.position
  const nor = src.attributes.normal
  const uv = src.attributes.uv
  _m3.getNormalMatrix(matrix)
  const base = g.pos.length / 3
  for (let i = 0; i < pos.count; i++) {
    _p.fromBufferAttribute(pos, i).applyMatrix4(matrix)
    _n.fromBufferAttribute(nor, i).applyMatrix3(_m3).normalize()
    let u = 0.5
    let v = WHITE_V
    if (uvMode === 'skin' && uv) {
      u = uv.getX(i)
      v = vRange[0] + uv.getY(i) * (vRange[1] - vRange[0])
    }
    g.vertex(_p, _n, u, v, color, [[boneIdx, 1]])
  }
  if (src.index) {
    const ix = src.index.array
    for (let i = 0; i < ix.length; i += 3) g.tri(base + ix[i], base + ix[i + 1], base + ix[i + 2])
  } else {
    for (let i = 0; i < pos.count; i += 3) g.tri(base + i, base + i + 1, base + i + 2)
  }
  geo.dispose()
}

// ------------------------------------------------------------- templates

const templates = new Map()

function addBone(T, name, parent, pos, rot = [0, 0, 0]) {
  const b = new THREE.Bone()
  b.name = name
  b.position.set(...pos)
  b.rotation.set(...rot)
  b.userData.rest = { px: pos[0], py: pos[1], pz: pos[2], rx: rot[0], ry: rot[1], rz: rot[2] }
  T.bones.push(b)
  T.index[name] = T.bones.length - 1
  if (parent) T.bones[T.index[parent]].add(b)
  return b
}

function legChain(T, prefix, parent, at, angles, ratios, V) {
  // angles: absolute pitch from straight down (+ = backward); lengths solved so
  // the chain spans the vertical distance V
  let denom = 0
  for (let i = 0; i < angles.length; i++) denom += ratios[i] * Math.cos(angles[i])
  const k = V / denom
  const lens = ratios.map((r) => r * k)
  let prevAbs = 0
  let par = parent
  let pos = at
  const names = []
  for (let i = 0; i < angles.length; i++) {
    const name = `${prefix}${i}`
    addBone(T, name, par, pos, [angles[i] - prevAbs, 0, 0])
    prevAbs = angles[i]
    par = name
    pos = [0, -lens[i], 0]
    names.push(name)
  }
  return { names, lens }
}

function buildTemplate(species) {
  const B = species.body
  const T = { bones: [], index: {}, legs: [], arms: [], neck: [], tail: [] }
  const quad = B.plan === 'quad'
  const hipH = B.hipH
  const shoulderH = quad ? B.shoulderH : hipH
  addBone(T, 'root', null, [0, 0, 0])
  addBone(T, 'hips', 'root', [0, hipH, 0])
  const chestZ = B.torsoLen * 0.6
  const chestY = quad ? shoulderH - hipH : B.torsoH * 0.05
  addBone(T, 'chest', 'hips', [0, chestY, chestZ])

  // neck
  const nN = B.neck.n
  const nL = B.neck.len / nN
  const neckBase = quad ? [0, B.torsoH * 0.3, B.torsoLen * 0.42] : [0, B.torsoH * 0.35, B.torsoLen * 0.42]
  let parent = 'chest'
  let pitchSum = 0
  for (let i = 0; i < nN; i++) {
    const rx = i === 0 ? -B.neck.rise : (B.neck.rise * 0.55) / Math.max(1, nN - 1)
    pitchSum += rx
    addBone(T, `neck${i}`, parent, i === 0 ? neckBase : [0, 0, nL], [rx, 0, 0])
    T.neck.push(`neck${i}`)
    parent = `neck${i}`
  }
  addBone(T, 'head', parent, [0, 0, nL], [-pitchSum * 0.85 + 0.08, 0, 0])
  addBone(T, 'jaw', 'head', [0, -B.head.h * 0.32, B.head.len * 0.05], [0.04, 0, 0])
  addBone(T, 'eyes', 'head', [0, B.head.h * 0.3, B.head.len * 0.22])

  // tail
  const tN = B.tail.n
  const tL = B.tail.len / tN
  parent = 'hips'
  for (let i = 0; i < tN; i++) {
    addBone(T, `tail${i}`, parent, i === 0 ? [0, B.torsoH * 0.18, -B.pelvisLen] : [0, 0, -tL], [i === 0 ? B.tail.rise : -0.035, 0, 0])
    T.tail.push(`tail${i}`)
    parent = `tail${i}`
  }

  // hind legs
  const hipW = B.torsoR * (quad ? 0.72 : 0.62)
  for (const side of [1, -1]) {
    const s = side > 0 ? 'L' : 'R'
    if (quad) {
      const leg = legChain(T, `hleg${s}`, 'hips', [side * hipW, 0, 0], [-0.22, 0.24, -0.04], [0.45, 0.42, 0.13], hipH * 0.95)
      T.legs.push({ ...leg, side, front: false, kind: 'quadHind' })
    } else {
      const leg = legChain(T, `hleg${s}`, 'hips', [side * hipW, -B.torsoH * 0.05, 0], [-0.5, 0.62, -0.25], [0.38, 0.36, 0.26], hipH * 0.97)
      addBone(T, `toe${s}`, leg.names[2], [0, -leg.lens[2], 0], [-Math.PI / 2 + 0.25, 0, 0])
      leg.toe = `toe${s}`
      T.legs.push({ ...leg, side, front: false, kind: 'biped' })
    }
  }
  // front legs or arms
  if (quad) {
    const shW = B.torsoR * 0.66
    for (const side of [1, -1]) {
      const s = side > 0 ? 'L' : 'R'
      const leg = legChain(T, `fleg${s}`, 'chest', [side * shW, 0, B.torsoLen * 0.3], [0.14, -0.12, 0.0], [0.48, 0.4, 0.12], shoulderH * 0.95)
      T.legs.push({ ...leg, side, front: true, kind: 'quadFront' })
    }
  } else {
    const armL = B.armLen
    for (const side of [1, -1]) {
      const s = side > 0 ? 'L' : 'R'
      addBone(T, `arm${s}0`, 'chest', [side * B.torsoR * 0.72, -B.torsoH * 0.25, B.torsoLen * 0.3], [-0.5, 0, side * 0.15])
      addBone(T, `arm${s}1`, `arm${s}0`, [0, -armL * 0.5, 0], [-0.9, 0, 0])
      T.arms.push({ names: [`arm${s}0`, `arm${s}1`], side, len: armL })
    }
  }

  // world matrices in bind pose
  const root = T.bones[0]
  root.updateMatrixWorld(true)
  T.world = T.bones.map((b) => b.matrixWorld.clone())
  T.headBack = headBack(B.head, T.bones[T.index.jaw].position)

  T.geometry = buildGeometry(species, T)
  T.material = new THREE.MeshLambertMaterial({
    map: skinTexture(B.colors, B.colors.pattern, hashString(species.id) % 100000),
    vertexColors: true,
  })
  T.hits = hitDefs(species, T)
  T.dims = {
    hipH,
    length: B.torsoLen + B.pelvisLen + B.tail.len + B.neck.len * Math.cos(B.neck.rise) + B.head.len,
    height: Math.max(shoulderH + B.neck.len * Math.sin(Math.max(0, B.neck.rise)) + B.head.h, hipH + B.torsoH),
    radius: B.torsoR,
  }
  T.boneInverses = T.world.map((m) => m.clone().invert())
  return T
}

function M(px, py, pz, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
  return new THREE.Matrix4().compose(new THREE.Vector3(px, py, pz), new THREE.Quaternion().setFromEuler(new THREE.Euler(rx, ry, rz)), new THREE.Vector3(sx, sy, sz))
}

// The head's two tubes as profiles, read by the head itself and by the neck
// that has to meet it. Skull rows: [z (x len), half-width (x w), height
// (x h, x SKULL_H for the half-height), centre lift (x h)] in head space. Jaw
// rows: [z (x len), half-width (x w), half-height (x h)] along the jaw bone,
// JAW_DROP (x h) below it.
const SKULL_H = 0.62
const JAW_DROP = 0.1
function skullProfile(H) {
  return [
    [-0.18, 0.75, 0.75, 0.12],
    [0.05, 1.0, 1.0, 0.1],
    [0.35, 0.92, 0.9, 0.05],
    [0.7, 0.7 * (0.5 + H.taper * 0.5), 0.62 * (0.5 + H.taper * 0.5), 0],
    [1.0, H.taper * 0.85, H.taper * 0.55, -0.05],
  ]
}
function jawProfile(H) {
  return [
    [0.0, 0.78, 0.36],
    [0.45, 0.68, 0.3],
    [0.92, 0.5 * H.taper + 0.1, 0.18],
  ]
}

// Where the neck meets the head: skull and jaw together, seen end-on at the
// head bone, as an ellipse { rx, ry, y } in head space, a touch inside them so
// they still draw the outline. The neck used to end in its own girth, a collar
// two or three times the head's on the long-necked browsers.
function headBack(H, jawAt) {
  const [a, b] = skullProfile(H)
  const f = -a[0] / (b[0] - a[0]) // the skull's section at z = 0
  const half = H.h * lerp(a[2], b[2], f) * SKULL_H
  const lift = H.h * lerp(a[3], b[3], f)
  const jawLow = jawAt.y - H.h * (JAW_DROP + jawProfile(H)[0][2])
  const top = lift + half
  const low = Math.min(lift - half, jawLow)
  const inset = 0.96
  return { rx: H.w * lerp(a[1], b[1], f) * inset, ry: ((top - low) / 2) * inset, y: (top + low) / 2 }
}

// The neck's cross-section at s in [0, n] (bone index + fraction along it):
// its own taper out of the chest, eased into the back of the head, its centre
// drifting to the head section's. Shared by the skin, the quills and the hit
// spheres so the three agree.
function neckSection(B, T, s) {
  const t = s / T.neck.length
  const e = smoothstep(0, 1, t)
  const hb = T.headBack
  return {
    rx: lerp(B.neck.r * (1.3 - 0.4 * t), hb.rx, e),
    ry: lerp(B.neck.r * (1.45 - 0.45 * t), hb.ry, e),
    y: hb.y * e,
  }
}

function buildGeometry(species, T) {
  const B = species.body
  const g = new SkinGeo()
  const I = T.index
  const W = (name) => T.world[I[name]]
  const quad = B.plan === 'quad'
  const sides = 12
  const accent = new THREE.Color(B.colors.accent)
  const ivory = new THREE.Color('#e8dfc0')
  const dark = new THREE.Color('#14100a')
  const stripe = new THREE.Color(B.colors.stripe)

  // ---- torso: straight-ish tube from rump to shoulders, hips <-> chest weights
  const z0 = -B.pelvisLen
  const z1 = B.torsoLen * 1.05
  const chestZ = B.torsoLen * 0.6
  const hipY = B.hipH + B.torsoH * (quad ? 0.18 : 0.08)
  const frontY = (quad ? B.shoulderH + B.torsoH * 0.22 : B.hipH + B.torsoH * 0.12) + 0
  const deep = B.torsoH * (quad ? 1 : 1.05)
  const tailR = B.tail.r / Math.max(B.torsoR, B.torsoH)
  // The front end is the neck's base section, on each axis: one ratio for
  // both left a narrow body's shoulders inside a rounder neck, which stood
  // out of them like a sleeve.
  const neckBase = neckSection(B, T, 0)
  const profile = (front) => [
    [0, Math.max(0.3, tailR * 1.2)],
    [0.2, 0.86],
    [0.45, 1.0],
    [0.7, 0.96],
    [0.88, 0.75],
    [1, Math.max(0.28, front)],
  ]
  const profX = profile(neckBase.rx / B.torsoR)
  const profY = profile(neckBase.ry / deep)
  const shape = (t, prof) => {
    for (let i = 0; i < prof.length - 1; i++) {
      if (t <= prof[i + 1][0]) {
        const k = (t - prof[i][0]) / (prof[i + 1][0] - prof[i][0])
        const s = k * k * (3 - 2 * k)
        return prof[i][1] + (prof[i + 1][1] - prof[i][1]) * s
      }
    }
    return prof[prof.length - 1][1]
  }
  const torsoT = (z) => Math.max(0, Math.min(1, (z - z0) / (z1 - z0)))
  const torsoY = (z) => hipY + (frontY - hipY) * torsoT(z)
  const torsoTop = (z) => torsoY(z) + deep * shape(torsoT(z), profY)
  const torsoSide = (z) => B.torsoR * shape(torsoT(z), profX)
  const torsoBone = (z) => (z < chestZ * 0.55 ? I.hips : I.chest)
  const torsoWeights = (z) => {
    const wChest = Math.max(0, Math.min(1, (z - chestZ * 0.15) / (chestZ * 0.85)))
    const w = [
      [I.hips, 1 - wChest],
      [I.chest, wChest],
    ]
    if (z < -B.pelvisLen * 0.4) w.push([I.tail0, ((-B.pelvisLen * 0.4 - z) / (B.pelvisLen * 0.6)) * 0.4])
    if (z > B.torsoLen * 0.9) w.push([I.neck0, ((z - B.torsoLen * 0.9) / (B.torsoLen * 0.15)) * 0.35])
    return w
  }
  const rings = []
  const N = 10
  for (let r = 0; r <= N; r++) {
    const t = r / N
    const z = z0 + (z1 - z0) * t
    rings.push({ m: M(0, torsoY(z), z), rx: B.torsoR * shape(t, profX), ry: deep * shape(t, profY), v: 0.12 + t * 0.4, w: torsoWeights(z) })
  }
  tube(g, rings, sides)

  // ---- neck chain, blending into the chest and on into the head
  {
    const rs = []
    const n = T.neck.length
    const nL = B.neck.len / n
    const per = n > 3 ? 2 : 3
    const hb = T.headBack
    // the last ring is the head's own back section, carried mostly by the
    // head like the skull's first ring, so the two agree as the head turns
    const neckEnd = [[I.head, 0.7], [I[T.neck[n - 1]], 0.3]]
    for (let i = 0; i < n; i++) {
      for (let k = 0; k < per; k++) {
        const u = (k / per) * nL
        const s = i + k / per
        const t = s / n
        const w = chainWeights(s, n, (j) => I[T.neck[j]], I.chest, I.head)
        const sec = neckSection(B, T, s)
        rs.push({ m: W(T.neck[i]).clone().multiply(M(0, sec.y, u)), rx: sec.rx, ry: sec.ry, v: 0.55 + t * 0.2, w })
      }
    }
    rs.push({ m: W('head').clone().multiply(M(0, hb.y, 0)), rx: hb.rx, ry: hb.ry, v: 0.75, w: neckEnd })
    // capped inside the head: the jaw's rounded back leaves the end open to view
    tube(g, rs, 10, { capStart: false, capEnd: true })
  }

  // ---- head and jaw
  const H = B.head
  {
    const hm = W('head')
    const rs = skullProfile(H).map(([z, sx, sy, oy], i) => ({
      m: hm.clone().multiply(M(0, H.h * oy, H.len * z)),
      rx: H.w * sx,
      ry: H.h * sy * SKULL_H,
      v: 0.76 + i * 0.03,
      w: i === 0 ? [[I.head, 0.7], [I[T.neck[T.neck.length - 1]], 0.3]] : [[I.head, 1]],
    }))
    tube(g, rs, 10)
    const jm = W('jaw')
    tube(
      g,
      jawProfile(H).map(([z, sx, sy]) => ({ m: jm.clone().multiply(M(0, -H.h * JAW_DROP, H.len * z)), rx: H.w * sx, ry: H.h * sy, v: 0.86, w: [[I.jaw, 1]] })),
      8,
    )
    // eyes
    const er = Math.max(0.012, H.w * 0.2)
    for (const s of [1, -1]) rigid(g, new THREE.SphereGeometry(er, 8, 6), W('eyes').clone().multiply(M(s * H.w * 0.78, 0, 0)), I.eyes, dark)
    // teeth
    if (B.features.includes('teeth')) {
      const n = 7
      for (let i = 0; i < n; i++) {
        const z = H.len * (0.25 + (i / n) * 0.7)
        for (const s of [1, -1]) {
          const t = new THREE.ConeGeometry(H.w * 0.07, H.h * 0.18, 4)
          rigid(g, t, hm.clone().multiply(M(s * H.w * (0.75 - (i / n) * 0.35), -H.h * 0.42, z, Math.PI, 0, 0)), I.head, ivory)
        }
      }
    }
    if (B.features.includes('beak')) {
      rigid(g, new THREE.ConeGeometry(H.w * H.taper * 0.7, H.len * 0.18, 6), hm.clone().multiply(M(0, -H.h * 0.06, H.len * 1.02, Math.PI / 2, 0, 0, 1, 1, 0.6)), I.head, new THREE.Color('#2a2420'))
    }
    if (B.features.includes('frill')) {
      const f = new THREE.CylinderGeometry(H.len * 0.78, H.len * 0.78, 0.07, 14, 1, false, 0, Math.PI)
      rigid(g, f, hm.clone().multiply(M(0, H.h * 0.25, -H.len * 0.02, -1.0, 0, 0)).multiply(M(0, 0, 0, Math.PI / 2, Math.PI / 2, 0)), I.head, accent)
      for (let i = 0; i < 9; i++) {
        const a = -Math.PI / 2 + (i / 8) * Math.PI
        const spike = new THREE.ConeGeometry(H.len * 0.05, H.len * 0.16, 4)
        const local = new THREE.Vector3(Math.sin(a) * H.len * 0.8, Math.cos(a) * H.len * 0.8, 0)
        rigid(g, spike, hm.clone().multiply(M(0, H.h * 0.25, -H.len * 0.02, -1.0, 0, 0)).multiply(M(local.x, local.y, 0, 0, 0, -a)), I.head, ivory)
      }
    }
    if (B.features.includes('horns')) {
      for (const s of [1, -1]) {
        const horn = new THREE.ConeGeometry(H.w * 0.16, H.len * 0.7, 6)
        horn.translate(0, H.len * 0.35, 0)
        rigid(g, horn, hm.clone().multiply(M(s * H.w * 0.45, H.h * 0.42, H.len * 0.22, 1.05, 0, -s * 0.12)), I.head, ivory)
      }
      const nh = new THREE.ConeGeometry(H.w * 0.12, H.len * 0.22, 6)
      nh.translate(0, H.len * 0.11, 0)
      rigid(g, nh, hm.clone().multiply(M(0, H.h * 0.26, H.len * 0.82, 0.6, 0, 0)), I.head, ivory)
    }
    if (B.features.includes('crest')) {
      const c = new THREE.CylinderGeometry(H.w * 0.28, H.w * 0.42, H.len * 1.5, 7)
      c.translate(0, H.len * 0.75, 0)
      rigid(g, c, hm.clone().multiply(M(0, H.h * 0.3, H.len * 0.35, -1.2, 0, 0)), I.head, accent)
    }
    if (B.features.includes('twinCrest')) {
      for (const s of [1, -1]) {
        const c = new THREE.CylinderGeometry(H.len * 0.42, H.len * 0.42, 0.015, 10, 1, false, 0, Math.PI)
        rigid(g, c, hm.clone().multiply(M(s * H.w * 0.28, H.h * 0.28, H.len * 0.45, 0, 0, Math.PI / 2)).multiply(M(0, 0, 0, 0, 0, 0, 1, 1, 0.55)), I.head, accent)
      }
    }
    if (B.features.includes('nasalCrest')) {
      rigid(g, new THREE.SphereGeometry(H.w * 0.75, 8, 6), hm.clone().multiply(M(0, H.h * 0.42, H.len * 0.3, 0, 0, 0, 1, 0.8, 1.4)), I.head, WHITE, 'skin', [0.8, 0.82])
    }
  }

  // ---- tail chain
  {
    const n = T.tail.length
    const tL = B.tail.len / n
    const rs = []
    // The tail grows out of the rump: its first ring is the torso's last one
    // (it used to plug into a bigger rump, with a seam round the join), and
    // its centre and girth ease into the tail's own over the first bone.
    const rump = { rx: B.torsoR * shape(0, profX), ry: deep * shape(0, profY), dy: hipY - new THREE.Vector3().setFromMatrixPosition(W(T.tail[0])).y }
    rs.push({ m: M(0, hipY, z0, 0, Math.PI, 0), rx: rump.rx, ry: rump.ry, v: 0.12, w: torsoWeights(z0) })
    for (let i = 0; i < n; i++) {
      for (let k = 0; k < 2; k++) {
        const s = i + k / 2
        if (s === 0) continue
        const t = s / n
        const e = smoothstep(0, 1, s)
        const r = B.tail.r * Math.pow(1 - t, 0.85) + B.tail.r * 0.06
        const w = chainWeights(s, n, (j) => I[T.tail[j]], I.hips, null)
        const m = new THREE.Matrix4().makeTranslation(0, rump.dy * (1 - e), 0).multiply(W(T.tail[i])).multiply(M(0, 0, -(k / 2) * tL, 0, Math.PI, 0))
        rs.push({ m, rx: lerp(rump.rx, r * 0.9, e), ry: lerp(rump.ry, r, e), v: 0.12 - t * 0.1, w })
      }
    }
    rs.push({ m: W(T.tail[n - 1]).clone().multiply(M(0, 0, -tL, 0, Math.PI, 0)), rx: B.tail.r * 0.05, ry: B.tail.r * 0.06, v: 0.01, w: [[I[T.tail[n - 1]], 1]] })
    tube(g, rs, 10, { capStart: false })
    if (B.features.includes('club')) {
      rigid(g, new THREE.SphereGeometry(B.tail.r * 1.4, 10, 8), W(T.tail[n - 1]).clone().multiply(M(0, 0, -tL * 0.8, 0, 0, 0, 1.3, 0.7, 1)), I[T.tail[n - 1]], stripe)
    }
    if (B.features.includes('thagomizer')) {
      for (const s of [1, -1]) {
        for (let k = 0; k < 2; k++) {
          const sp = new THREE.ConeGeometry(B.tail.r * 0.18, B.tail.r * 2.2, 5)
          sp.translate(0, B.tail.r * 1.1, 0)
          rigid(g, sp, W(T.tail[n - 1 - k]).clone().multiply(M(s * B.tail.r * 0.1, B.tail.r * 0.15, -tL * 0.5, -0.5, 0, s * 1.0)), I[T.tail[n - 1 - k]], ivory)
        }
      }
    }
    if (B.features.includes('plates')) {
      // along the back, largest over the hips, then down the tail
      for (let k = 0; k < 6; k++) {
        const z = -B.pelvisLen * 0.6 + (k / 5) * (B.torsoLen * 0.95)
        const hgt = B.torsoH * 0.9 * (1 - Math.abs(k - 1.5) * 0.12)
        rigid(g, new THREE.OctahedronGeometry(1, 0), M((k % 2 ? 1 : -1) * 0.08, torsoTop(z) + hgt * 0.3, z, 0, 0, 0, 0.05, hgt * 0.6, hgt * 0.55), torsoBone(z), accent)
      }
      for (let k = 0; k < 4; k++) {
        const hgt = B.torsoH * 0.9 * (0.7 - k * 0.13)
        const r = B.tail.r * Math.pow(1 - (k + 0.4) / n, 0.85)
        rigid(g, new THREE.OctahedronGeometry(1, 0), W(T.tail[k]).clone().multiply(M((k % 2 ? 1 : -1) * 0.06, r * 0.8 + hgt * 0.4, -tL * 0.4, 0, 0, 0, 0.05, hgt * 0.6, hgt * 0.55)), I[T.tail[k]], accent)
      }
    }
    if (B.features.includes('armor')) {
      for (let k = 0; k < 18; k++) {
        const row = k % 3
        const col = Math.floor(k / 3)
        const z = -B.pelvisLen * 0.6 + (col / 5) * B.torsoLen * 1.1
        const x = (row - 1) * torsoSide(z) * 0.55
        const y = torsoTop(z) - (row === 1 ? 0.04 : B.torsoH * 0.16)
        const cone = new THREE.ConeGeometry(B.torsoR * 0.14, B.torsoH * 0.35, 5)
        rigid(g, cone, M(x, y, z, 0, 0, (1 - row) * 0.6), torsoBone(z), stripe)
      }
      for (const s of [1, -1]) {
        for (let k = 0; k < 5; k++) {
          const z = -B.pelvisLen * 0.4 + (k / 4) * B.torsoLen
          const sp = new THREE.ConeGeometry(B.torsoR * 0.1, B.torsoR * 0.45, 4)
          rigid(g, sp, M(s * torsoSide(z) * 0.98, torsoY(z), z, 0, 0, -s * 1.4), torsoBone(z), ivory)
        }
      }
    }
    if (B.features.includes('quills')) {
      T.neck.forEach((nb, i) => {
        // rooted just under the skin, which narrows toward the head
        const sec = neckSection(B, T, i + 0.5)
        const q = new THREE.ConeGeometry(B.neck.r * 0.35, B.neck.r * 2.2, 4)
        q.translate(0, B.neck.r * 1.1, 0)
        rigid(g, q, W(nb).clone().multiply(M(0, sec.y + sec.ry * 0.85, (B.neck.len / T.neck.length) * 0.5, -0.9, 0, 0)), I[nb], accent)
      })
      for (let k = 0; k < 4; k++) {
        const z = -B.pelvisLen * 0.5 + (k / 3) * B.torsoLen
        const q = new THREE.ConeGeometry(B.neck.r * 0.4, B.neck.r * 2.4, 4)
        q.translate(0, B.neck.r * 1.2, 0)
        rigid(g, q, M(0, torsoTop(z) - 0.03, z, -1.1, 0, 0), torsoBone(z), accent)
      }
    }
  }

  // Where a limb grows out of the body: a ring above the joint at the torso's
  // mid-height, drawn in toward the midline until it fits inside, carried
  // mostly by the body. The limb's open top used to stand proud of the flank,
  // a flat cut across the thigh.
  const limbRoot = (bone, rx, rz, parent) => {
    const at = new THREE.Vector3().setFromMatrixPosition(W(bone))
    const room = torsoSide(at.z) * 0.9
    const r = Math.min(rx, room)
    const x = Math.sign(at.x) * Math.min(Math.abs(at.x), room - r)
    return { m: M(x, torsoY(at.z), at.z, Math.PI / 2, 0, 0), rx: r, ry: rz, v: 0.3, w: [[parent, 0.75], [I[bone], 0.25]] }
  }

  // ---- legs
  for (const leg of T.legs) {
    const n = leg.names.length
    const rs = []
    const r0 = leg.front ? B.frontR || B.legR * 0.8 : B.legR
    const radii = leg.kind === 'biped' ? [1.25, 0.8, 0.5, 0.36, 0.3] : leg.kind === 'quadHind' ? [1.2, 0.85, 0.7, 0.65] : [1.05, 0.8, 0.7, 0.72]
    // the thigh muscle swells out of the body
    rs.push(limbRoot(leg.names[0], r0 * 1.05, r0 * 1.25, leg.front ? I.chest : I.hips))
    for (let i = 0; i < n; i++) {
      const L = leg.lens[i]
      const steps = i === 0 ? 2 : 2
      for (let k = 0; k < steps; k++) {
        const s = i + k / steps
        const rr = r0 * lerpArr(radii, s / n)
        const w = chainWeights(s, n, (j) => I[leg.names[j]], leg.front ? I.chest : I.hips, null)
        rs.push({ m: W(leg.names[i]).clone().multiply(M(0, -(k / steps) * L, 0, Math.PI / 2, 0, 0)), rx: rr * 0.85, ry: i === 0 ? rr * 1.15 : rr, v: 0.25 - s * 0.03, w })
      }
    }
    const last = leg.names[n - 1]
    rs.push({ m: W(last).clone().multiply(M(0, -leg.lens[n - 1], 0, Math.PI / 2, 0, 0)), rx: r0 * radii[radii.length - 1] * 0.85, ry: r0 * radii[radii.length - 1], v: 0.14, w: [[I[last], 1]] })
    tube(g, rs, 8, { capStart: false })
    if (leg.kind === 'biped') {
      const tm = W(leg.toe)
      const toeL = B.hipH * 0.2
      for (const a of [-0.35, 0, 0.35]) {
        const toe = new THREE.ConeGeometry(r0 * 0.22, toeL, 5)
        toe.translate(0, -toeL / 2, 0)
        rigid(g, toe, tm.clone().multiply(M(0, 0, 0, 0, 0, a)), I[leg.toe], stripe)
      }
      if (B.features.includes('sickle')) {
        const c = new THREE.ConeGeometry(r0 * 0.12, toeL * 0.7, 4)
        c.translate(0, toeL * 0.35, 0)
        rigid(g, c, tm.clone().multiply(M(leg.side * r0 * 0.2, -toeL * 0.15, r0 * 0.25, 0.4, 0, 0)), I[leg.toe], ivory)
      }
    } else {
      const pad = new THREE.CylinderGeometry(r0 * 0.75, r0 * 0.85, B.hipH * 0.07, 10)
      rigid(g, pad, W(last).clone().multiply(M(0, -leg.lens[n - 1] + B.hipH * 0.02, r0 * 0.1)), I[last], stripe)
    }
  }
  // ---- arms
  for (const arm of T.arms) {
    const r0 = Math.max(0.015, B.legR * 0.33)
    const rs = [limbRoot(arm.names[0], r0 * 1.2, r0 * 1.3, I.chest)]
    for (let i = 0; i < 2; i++) {
      for (let k = 0; k < 2; k++) {
        const s = i + k / 2
        rs.push({ m: W(arm.names[i]).clone().multiply(M(0, -(k / 2) * arm.len * 0.5, 0, Math.PI / 2, 0, 0)), rx: r0 * (1.2 - s * 0.25), ry: r0 * (1.3 - s * 0.25), v: 0.3, w: chainWeights(s, 2, (j) => I[arm.names[j]], I.chest, null) })
      }
    }
    rs.push({ m: W(arm.names[1]).clone().multiply(M(0, -arm.len * 0.5, 0, Math.PI / 2, 0, 0)), rx: r0 * 0.6, ry: r0 * 0.6, v: 0.3, w: [[I[arm.names[1]], 1]] })
    tube(g, rs, 6, { capStart: false })
    for (const a of [-0.3, 0, 0.3]) {
      const claw = new THREE.ConeGeometry(r0 * 0.35, arm.len * 0.22, 4)
      claw.translate(0, -arm.len * 0.11, 0)
      rigid(g, claw, W(arm.names[1]).clone().multiply(M(0, -arm.len * 0.5, 0, 0.3, 0, a)), I[arm.names[1]], ivory)
    }
  }
  const geo = g.build()
  return geo
}

function lerpArr(arr, t) {
  const f = t * (arr.length - 1)
  const i = Math.min(arr.length - 2, Math.floor(f))
  return arr[i] + (arr[i + 1] - arr[i]) * (f - i)
}

// Linear blend between neighbouring bones along a chain, parametrised by s in
// [0, n] (bone index + fraction). The chain's parent takes the first half bone.
function chainWeights(s, n, boneOf, parentIdx, childIdx) {
  const out = []
  const c = s - 0.5
  if (c < 0) {
    const w = -c
    out.push([boneOf(0), 1 - w])
    if (parentIdx != null) out.push([parentIdx, w])
    return out
  }
  const j = Math.floor(c)
  const f = c - j
  if (j >= n - 1) {
    out.push([boneOf(n - 1), 1 - (childIdx != null ? f * 0.5 : 0)])
    if (childIdx != null) out.push([childIdx, f * 0.5])
    return out
  }
  out.push([boneOf(j), 1 - f])
  out.push([boneOf(j + 1), f])
  return out
}

// Ray-cast spheres riding the bones: [{ bone, offset, r, zone }]
function hitDefs(species, T) {
  const B = species.body
  const out = []
  const armor = new Set(species.armor || [])
  const z = (name) => (armor.has(name) ? 'armor' : name)
  out.push({ bone: 'head', offset: new THREE.Vector3(0, 0, B.head.len * 0.45), r: Math.max(B.head.w, B.head.h) * 0.95, zone: 'head' })
  // the neck's girth along it, with spheres close enough to overlap where it
  // narrows toward the head (one oversized sphere a bone used to cover it)
  const nL = B.neck.len / T.neck.length
  T.neck.forEach((n, i) => {
    const per = Math.ceil(nL / (neckSection(B, T, i + 0.5).ry * 1.6))
    for (let k = 0; k < per; k++) {
      const f = (k + 0.5) / per
      const sec = neckSection(B, T, i + f)
      out.push({ bone: n, offset: new THREE.Vector3(0, sec.y, nL * f), r: Math.max(sec.rx, sec.ry) * 1.05, zone: 'neck' })
    }
  })
  out.push({ bone: 'chest', offset: new THREE.Vector3(0, B.torsoH * 0.2, 0), r: Math.max(B.torsoR, B.torsoH) * 0.95, zone: z('torso') })
  out.push({ bone: 'hips', offset: new THREE.Vector3(0, B.torsoH * 0.15, 0), r: Math.max(B.torsoR, B.torsoH) * 0.95, zone: z('torso') })
  T.tail.forEach((n, i) => {
    if (i % 2 === 0) out.push({ bone: n, offset: new THREE.Vector3(0, 0, -B.tail.len / T.tail.length), r: B.tail.r * Math.pow(1 - i / T.tail.length, 0.85) * 1.1 + 0.03, zone: z('tail') })
  })
  for (const leg of T.legs) {
    leg.names.forEach((n, i) => {
      if (i < 2) out.push({ bone: n, offset: new THREE.Vector3(0, -leg.lens[i] * 0.5, 0), r: (leg.front ? B.frontR || B.legR : B.legR) * (i ? 0.9 : 1.3), zone: 'limb' })
    })
  }
  return out
}

export function getTemplate(species) {
  let T = templates.get(species.id)
  if (!T) templates.set(species.id, (T = buildTemplate(species)))
  return T
}

// One animal's rig: fresh bones, shared geometry and material.
export function createRig(species, scale) {
  const T = getTemplate(species)
  const bones = T.bones.map((src) => {
    const b = new THREE.Bone()
    b.name = src.name
    b.position.copy(src.position)
    b.rotation.copy(src.rotation)
    b.userData.rest = src.userData.rest
    return b
  })
  T.bones.forEach((src, i) => {
    if (src.parent && src.parent.isBone) bones[T.bones.indexOf(src.parent)].add(bones[i])
  })
  const mesh = new THREE.SkinnedMesh(T.geometry, T.material)
  mesh.add(bones[0])
  mesh.bind(new THREE.Skeleton(bones, T.boneInverses), new THREE.Matrix4())
  mesh.scale.setScalar(scale)
  mesh.castShadow = true
  mesh.receiveShadow = true
  const d = T.dims
  mesh.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, d.hipH, species.body.torsoLen * 0.3), Math.max(d.length, d.height) * 0.75)
  const byName = {}
  bones.forEach((b) => (byName[b.name] = b))
  const hits = T.hits.map((h) => ({ ...h, boneObj: byName[h.bone], world: new THREE.Vector3(), rWorld: h.r * scale }))
  return {
    mesh,
    bones: byName,
    template: T,
    hits,
    neck: T.neck.map((n) => byName[n]),
    tail: T.tail.map((n) => byName[n]),
    legs: T.legs.map((l) => ({ ...l, bones: l.names.map((n) => byName[n]), toeBone: l.toe ? byName[l.toe] : null })),
    arms: T.arms.map((a) => ({ ...a, bones: a.names.map((n) => byName[n]) })),
  }
}
