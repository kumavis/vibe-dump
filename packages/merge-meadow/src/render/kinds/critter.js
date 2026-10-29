// critter: { rig: quadruped|biped, length, height, color, head, tail }
// The animated look with zero assets (design §8): a procedural low-poly rig built
// in code. ONE SkinnedMesh per critter (one draw call): boxes and cones rigidly
// skinned (weight 1) to 8 bones, vertex-colour shading so the colour lives in a
// ref-counted material while the geometry and the idle/walk/run/attack/die clips
// are shared by every critter with the same (quantised) proportions. The body
// plan is `rig`, not `kind`: representation is flat and `kind` is 'critter'.
import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import { makeAnimator } from '../animation.js'
import { stdMatKey, stdMat, tintColor, normColor } from '../resources.js'
import { kindProp, defaultsOf, anchorPoint, finite } from './common.js'

const schema = {
  type: 'object',
  properties: {
    kind: kindProp('critter'),
    rig: { enum: ['quadruped', 'biped'], title: 'body plan', default: 'quadruped', 'x-immutable': true },
    length: { type: 'number', minimum: 0.2, maximum: 12, step: 0.05, title: 'length (m)', default: 1.2 },
    height: { type: 'number', minimum: 0.2, maximum: 12, step: 0.05, title: 'height (m)', default: 0.9 },
    color: { type: 'string', format: 'color', title: 'colour', default: '#eeeeee' },
    head: { type: 'number', minimum: 0, maximum: 3, step: 0.05, title: 'head size', default: 1 },
    tail: { type: 'number', minimum: 0, maximum: 3, step: 0.05, title: 'tail length', default: 0.5 },
  },
}

// proportions are quantised to 5 cm / 0.05 so 300 near-identical critters share
// a handful of templates instead of building 300 (a template is ~1-3 ms)
const q = (v) => Math.round(v * 20) / 20
const num = (v, d, lo, hi) => q(Math.min(hi, Math.max(lo, finite(v, d))))
export function rigParams (d = {}) {
  return { rig: String(d.rig) === 'biped' ? 'biped' : 'quadruped', L: num(d.length, 1.2, 0.2, 12), H: num(d.height, 0.9, 0.2, 12), h: num(d.head, 1, 0, 3), t: num(d.tail, 0.5, 0, 3) }
}
export const critterKey = (p) => `critter:${p.rig}:${p.L}:${p.H}:${p.h}:${p.t}`
export const critterStats = { templates: 0, templateMs: [], instanceMs: [] }
const now = () => globalThis.performance?.now() ?? 0
const matData = (d) => ({ color: tintColor(normColor(d.color, '#eeeeee'), d.tint), roughness: 0.85, flat: true, vc: true })

// ---- rig layout: bones [name, parentIndex, [x,y,z] rest position in mesh space] ----
function layout ({ rig, L, H, h, t }) {
  if (rig === 'quadruped') {
    const leg = 0.5 * H, bh = 0.32 * H, bw = 0.38 * Math.min(L, 1.2 * H), bl = 0.7 * L, hy = leg + bh / 2
    const hs = 0.3 * H * h, tl = 0.3 * L * t
    return { leg, bh, bw, bl, hy, hs, tl, bones: [
      ['root', -1, [0, 0, 0]], ['hips', 0, [0, hy, 0]], ['head', 1, [0, hy + bh * 0.35, bl / 2]], ['tail', 1, [0, hy + bh * 0.3, -bl / 2]],
      ['leg_fl', 1, [bw * 0.33, leg, bl * 0.38]], ['leg_fr', 1, [-bw * 0.33, leg, bl * 0.38]], ['leg_bl', 1, [bw * 0.33, leg, -bl * 0.38]], ['leg_br', 1, [-bw * 0.33, leg, -bl * 0.38]],
    ] }
  }
  const leg = 0.45 * H, bh = 0.34 * H, bw = 0.3 * H, bl = 0.45 * L, hy = leg + 0.12 * H
  const hs = 0.32 * H * h, tl = 0.5 * L * t
  return { leg, bh, bw, bl, hy, hs, tl, bones: [
    ['root', -1, [0, 0, 0]], ['hips', 0, [0, hy, 0]], ['head', 1, [0, hy + bh * 0.55, bl * 0.5]], ['tail', 1, [0, hy + bh * 0.1, -bl * 0.45]],
    ['leg_l', 1, [bw * 0.38, hy, -bl * 0.05]], ['leg_r', 1, [-bw * 0.38, hy, -bl * 0.05]], ['arm_l', 1, [bw * 0.45, hy, bl * 0.35]], ['arm_r', 1, [-bw * 0.45, hy, bl * 0.35]],
  ] }
}

// ---- geometry: parts [geometry, boneIndex, shade, [x,y,z] centre, [rx,ry,rz]] ------
function part(geo, bone, shade, at, rot) {
  const g = geo.index ? geo.toNonIndexed() : geo
  if (g !== geo) geo.dispose()
  if (rot) g.rotateX(rot[0]).rotateY(rot[1]).rotateZ(rot[2])
  g.translate(...at)
  const n = g.attributes.position.count
  g.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(n * 3).fill(shade), 3))
  g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(new Uint16Array(n * 4).map((_, i) => (i % 4 ? 0 : bone)), 4))
  g.setAttribute('skinWeight', new THREE.Float32BufferAttribute(new Float32Array(n * 4).map((_, i) => (i % 4 ? 0 : 1)), 4))
  g.deleteAttribute('uv')
  return g
}
const box = (x, y, z) => new THREE.BoxGeometry(x, y, z)
function buildGeometry(p, Lo) {
  const { bones, leg, bh, bw, bl, hy, hs, tl } = Lo, B = (i) => bones[i][2], add = (a, b) => a.map((v, i) => v + b[i])
  const parts = [part(box(bw, bh, bl), 1, 1, B(1))]
  if (hs > 0) {
    const hd = B(2), long = p.rig === 'biped' ? 1.4 : 1.05
    parts.push(part(box(hs * 0.8, hs * 0.8, hs * long), 2, 1, add(hd, [0, hs * 0.25, hs * long * 0.45])))
    parts.push(part(box(hs * 0.6, hs * 0.35, hs * 0.5), 2, 0.8, add(hd, [0, hs * 0.0, hs * long * 0.95]))) // snout / jaw
    for (const s of [1, -1]) parts.push(part(box(hs * 0.12, hs * 0.16, hs * 0.16), 2, 0.04, add(hd, [s * hs * 0.41, hs * 0.42, hs * long * 0.7]))) // eyes
  }
  if (tl > 0) parts.push(part(new THREE.ConeGeometry(Math.min(bw, bh) * 0.28, tl, 6), 3, 0.9, add(B(3), [0, -tl * 0.12, -tl / 2]), [-Math.PI / 2 - 0.25, 0, 0]))
  if (p.rig === 'quadruped') {
    for (let i = 4; i < 8; i++) {
      parts.push(part(box(bw * 0.22, leg, bw * 0.22), i, 0.75, add(B(i), [0, -leg / 2, 0])))
      parts.push(part(box(bw * 0.26, leg * 0.14, bw * 0.28), i, 0.25, add(B(i), [0, -leg + leg * 0.07, 0.01]))) // hoof
    }
  } else {
    const legLen = B(4)[1]
    for (const i of [4, 5]) {
      parts.push(part(box(bw * 0.3, legLen, bw * 0.34), i, 0.8, add(B(i), [0, -legLen / 2, 0])))
      parts.push(part(box(bw * 0.32, legLen * 0.1, bw * 0.7), i, 0.5, add(B(i), [0, -legLen + legLen * 0.05, bw * 0.2]))) // foot
    }
    for (const i of [6, 7]) parts.push(part(box(bw * 0.1, bh * 0.45, bw * 0.1), i, 0.8, add(B(i), [0, -bh * 0.2, bw * 0.05]), [0.6, 0, 0]))
  }
  const g = mergeGeometries(parts); for (const q of parts) q.dispose()
  g.computeBoundingSphere(); g.computeBoundingBox(); g.name = critterKey(p)
  return g
}

// ---- clips: sampled keyframes from a pose function f(phase) -> {bone: [rx,ry,rz], hipsDy, hipsDz, rootRz, rootDy}
const E = new THREE.Euler(), Q = new THREE.Quaternion()
function clip(name, dur, Lo, f, keys = 16) {
  const names = Lo.bones.map((b) => b[0]), times = [], rot = Object.fromEntries(names.map((n) => [n, []])), hips = [], root = []
  for (let k = 0; k <= keys; k++) {
    const ph = k / keys, P = f(ph); times.push(ph * dur)
    for (const n of names) { const r = P[n] || [0, 0, 0]; Q.setFromEuler(E.set(r[0], r[1], r[2])); rot[n].push(Q.x, Q.y, Q.z, Q.w) }
    hips.push(0, Lo.hy + (P.hipsDy || 0), P.hipsDz || 0)
    root.push(0, P.rootDy || 0, 0)
  }
  const tracks = names.filter((n) => rot[n].some((v, i) => (i % 4 === 3 ? v !== 1 : v !== 0))).map((n) => new THREE.QuaternionKeyframeTrack(n + '.quaternion', times, rot[n]))
  tracks.push(new THREE.VectorKeyframeTrack('hips.position', times, hips), new THREE.VectorKeyframeTrack('root.position', times, root))
  return new THREE.AnimationClip(name, dur, tracks)
}
function buildClips(p, Lo) {
  const S = (ph, m = 1) => Math.sin(2 * Math.PI * ph * m), H = p.H, quad = p.rig === 'quadruped'
  const gait = (A, bob, pitch, bound) => (ph) => {
    const a = A * S(ph), o = {}
    if (quad) { o.leg_fl = [a, 0, 0]; o.leg_br = [bound ? -a : a, 0, 0]; o.leg_fr = [bound ? a : -a, 0, 0]; o.leg_bl = [-a, 0, 0] }
    else { o.leg_l = [a, 0, 0]; o.leg_r = [-a, 0, 0]; o.arm_l = [-a * 0.4, 0, 0]; o.arm_r = [a * 0.4, 0, 0] }
    o.hips = [pitch * S(ph), quad ? 0 : 0.06 * S(ph), quad ? 0 : 0.04 * S(ph)] // biped: yaw + roll sway
    o.head = [0.06 * S(ph, 2) - pitch * 0.5, 0, 0]; o.tail = [0.1 * S(ph, 2), 0.3 * S(ph), 0]
    o.hipsDy = bob * H * Math.abs(S(ph))
    return o
  }
  return [
    clip('idle', 2.4, Lo, (ph) => ({ head: [0.06 * S(ph), 0.25 * S(ph * 0.5 + 0.1), 0], tail: [0, 0.35 * S(ph, 2), 0], hipsDy: 0.012 * H * S(ph, 2), hips: [0.02 * S(ph, 2), 0, 0] })),
    clip('walk', quad ? 0.9 : 1.1, Lo, gait(quad ? 0.45 : 0.55, 0.03, 0.02, false)),
    clip('run', quad ? 0.45 : 0.6, Lo, gait(quad ? 0.8 : 0.9, 0.08, 0.1, quad)),
    clip('attack', 0.8, Lo, (ph) => { const s = Math.sin(Math.PI * Math.min(1, ph * 1.6)); return { head: [0.55 * s, 0, 0], hips: [0.12 * s, 0, 0], hipsDz: 0.12 * p.L * s, tail: [-0.2 * s, 0, 0] } }),
    clip('die', 1.0, Lo, (ph) => { const s = Math.min(1, ph * 1.4), e = 1 - (1 - s) ** 3; const legs = quad ? ['leg_fl', 'leg_fr', 'leg_bl', 'leg_br'] : ['leg_l', 'leg_r']; const o = { root: [0, 0, (Math.PI / 2) * e], rootDy: Lo.bw * 0.5 * e, head: [-0.3 * e, 0, 0], tail: [0, 0.2 * e, 0] }; for (const l of legs) o[l] = [0.35 * e, 0, 0]; return o }, 12),
  ]
}

function bonesFor (T) {
  const bones = T.Lo.bones.map(([name, par, at], i, all) => {
    const b = new THREE.Bone(); b.name = name
    const pp = par < 0 ? [0, 0, 0] : all[par][2]
    b.position.set(at[0] - pp[0], at[1] - pp[1], at[2] - pp[2])
    return b
  })
  T.Lo.bones.forEach(([, par], i) => { if (par >= 0) bones[par].add(bones[i]) })
  return bones
}

function template (p) {
  const t0 = now(); const Lo = layout(p)
  // rest-pose bone world positions -> inverse bind matrices (bind matrix = identity)
  const boneInverses = Lo.bones.map((b) => new THREE.Matrix4().makeTranslation(-b[2][0], -b[2][1], -b[2][2]))
  const T = { Lo, geometry: buildGeometry(p, Lo), clips: buildClips(p, Lo), boneInverses }
  critterStats.templates++; critterStats.templateMs.push(+(now() - t0).toFixed(3))
  return T
}

function skin (T, material) {
  const bones = bonesFor(T)
  const mesh = new THREE.SkinnedMesh(T.geometry, material)
  mesh.name = 'body'
  mesh.add(bones[0]); mesh.bind(new THREE.Skeleton(bones, T.boneInverses), new THREE.Matrix4())
  return { mesh, bones }
}

// An uncached build with its own geometry and material, for exporting a test
// asset (the harness turns it into a .glb for the `model` kind). Never cached.
export function standalone (d) {
  const T = template(rigParams(d))
  const { mesh } = skin(T, stdMat(matData(d))())
  const root = new THREE.Group(); root.name = 'asset'; root.add(mesh)
  return { root, clips: T.clips, dispose () { T.geometry.dispose(); mesh.material.dispose(); mesh.skeleton.dispose() } }
}

export default {
  schema,
  defaults: defaultsOf(schema),
  create (d, { res }) {
    const t0 = now(); const p = rigParams(d); const g = new THREE.Group()
    const T = res.use(g, critterKey(p), () => template(p), (T) => T.geometry.dispose())
    const { mesh, bones } = skin(T, res.use(g, stdMatKey(matData(d)), stdMat(matData(d))))
    g.add(mesh)
    g.userData.mesh = mesh; g.userData.rig = critterKey(p); g.userData.matKey = stdMatKey(matData(d)); g.userData.pick = 'box'
    // the seat rides the hips bone, so a rider bobs with the gait
    const Lo = T.Lo; const hips = bones[1]; const head = bones[2]
    g.userData.seat = anchorPoint(hips, 'seat', 0, Lo.bh / 2, 0)
    g.userData.head = anchorPoint(head, 'head', 0, Lo.hs * 0.7, Lo.hs * 0.5)
    g.userData.anim = makeAnimator(g, T.clips)
    critterStats.instanceMs.push(+(now() - t0).toFixed(3))
    return g
  },
  update (g, d, prev, { res }) {
    if (critterKey(rigParams(d)) !== g.userData.rig) return false // proportions changed: a new rig
    const k = stdMatKey(matData(d))
    g.userData.mesh.material = res.swap(g, g.userData.matKey, k, stdMat(matData(d))); g.userData.matKey = k
  },
  animate (g, state, mapping, dt) { const a = g.userData.anim; a.set(state); a.update(dt) },
  dispose (g) { g.userData.anim.dispose(); g.userData.mesh.skeleton.dispose() },
  anchors: (g) => ({ seat: g.userData.seat, head: g.userData.head }),
}
