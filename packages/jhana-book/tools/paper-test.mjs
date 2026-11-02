// paper-test.mjs — invariant checks for src/paper.js (DESIGN.md, "Invariants").
//
//   cd packages/jhana-book && node tools/paper-test.mjs
//
// Spread space is the group itself (identity), so world coords == hinge coords
// of the root. Prints PASS/FAIL per check; exits 1 on any failure.

import * as THREE from 'three'
import { Paper } from '../src/paper.js'

const PI = Math.PI
let failures = 0
const results = []

function check(name, fn) {
  let problems
  try {
    problems = fn() || []
  } catch (e) {
    problems = [`threw: ${e.stack}`]
  }
  if (problems.length) {
    failures++
    console.log(`FAIL  ${name}`)
    for (const p of problems.slice(0, 12)) console.log(`        ${p}`)
    if (problems.length > 12) console.log(`        … ${problems.length - 12} more`)
  } else console.log(`PASS  ${name}`)
  results.push([name, problems.length === 0])
}

// ---- helpers ---------------------------------------------------------------

const f = (v) => (typeof v === 'number' ? v.toFixed(5) : `(${v.x.toFixed(4)}, ${v.y.toFixed(4)}, ${v.z.toFixed(4)})`)
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol
const origin = (o) => new THREE.Vector3().setFromMatrixPosition(o.matrixWorld)
const axis = (o, i) => new THREE.Vector3().setFromMatrixColumn(o.matrixWorld, i).normalize()
const toLocal = (o, p) => p.clone().applyMatrix4(o.matrixWorld.clone().invert())
const localToWorld = (o, x, y, z) => new THREE.Vector3(x, y, z).applyMatrix4(o.matrixWorld)
const finiteMatrix = (m) => m.elements.every(Number.isFinite)

function pose(rig, theta) {
  rig.paper.update(theta)
  rig.group.updateMatrixWorld(true)
}

function allFrames(group) {
  const out = []
  group.traverse((o) => {
    if (o !== group && !o.isMesh) out.push(o)
  })
  return out
}

// A rig with one of everything, including every nesting the brief asks for.
function buildRig() {
  const group = new THREE.Group()
  const paper = new Paper(group)
  const R = {}
  R.tent = paper.parallelFold({ a: 0.35, b: 0.35, p: 0.5, q: 0.5, z0: -0.68, z1: -0.55 })
  R.step = paper.parallelFold({ a: 0.2, b: 0.5, p: 0.6, q: 0.3 }) // a + p = b + q
  R.stepR = paper.parallelFold({ a: 0.5, b: 0.15, p: 0.25, q: 0.6 })
  R.vFar = paper.vFold({ z: 0.3, alpha: 0.5, gamma: 1.2, length: 0.4, toward: 'far' })
  R.vNear = paper.vFold({ z: -0.2, alpha: 0.3, gamma: PI / 2, length: 0.6, toward: 'near' })
  R.hang = paper.parallelFold({ on: R.tent.inner, a: 0.12, b: 0.12, p: 0.15, q: 0.15 })
  R.hangStep = paper.parallelFold({ on: R.step.inner, a: 0.1, b: 0.2, p: 0.25, q: 0.15 }) // a + p = b + q
  R.roof = paper.parallelFold({ on: R.tent.outer, a: 0.15, b: 0.15, p: 0.25, q: 0.25 })
  R.roofStep = paper.parallelFold({ on: R.tent.outer, a: 0.1, b: 0.2, p: 0.25, q: 0.35 }) // p − a = q − b
  R.vIn = paper.vFold({ on: R.tent.inner, z: -0.6, alpha: 0.4, gamma: 1.1, length: 0.2 })
  R.vOnV = paper.vFold({ on: R.vFar.inner, z: 0.1, alpha: 0.3, gamma: 1.0, length: 0.15, toward: 'near' })
  R.vOut = paper.vFold({ on: R.tent.outer, z: -0.58, alpha: 0.4, gamma: 1.2, length: 0.15, toward: 'far' }) // θ > π
  R.inV = paper.parallelFold({ on: R.vFar.inner, a: 0.08, b: 0.08, p: 0.1, q: 0.1, z0: 0.05, z1: 0.2 })
  R.flapR = paper.flap({ side: 'right', x: 0.6, z: 0.2, alpha: 0.4, length: 0.25, lift: (th) => 1.2 * Math.sin(th / 2) ** 2 })
  R.flapL = paper.flap({ side: 'left', x: 0.6, z: 0.2, alpha: 0.4, length: 0.25, lift: (th) => 1.2 * Math.sin(th / 2) ** 2 })
  R.flapT = paper.flap({ on: R.tent, side: 'left', x: 0.25, length: 0.15, lift: (th) => 0.8 * (th / PI) })
  R.flapO = paper.flap({ on: R.tent.outer, side: 'right', x: 0.1, length: 0.1, lift: (th) => 0.5 * (2 * PI - th) / PI })
  const parallels = {
    tent: { fold: R.tent, on: paper.root, a: 0.35, b: 0.35, p: 0.5, q: 0.5 },
    step: { fold: R.step, on: paper.root, a: 0.2, b: 0.5, p: 0.6, q: 0.3 },
    stepR: { fold: R.stepR, on: paper.root, a: 0.5, b: 0.15, p: 0.25, q: 0.6 },
    hang: { fold: R.hang, on: R.tent.inner, a: 0.12, b: 0.12, p: 0.15, q: 0.15 },
    hangStep: { fold: R.hangStep, on: R.step.inner, a: 0.1, b: 0.2, p: 0.25, q: 0.15 },
    roof: { fold: R.roof, on: R.tent.outer, a: 0.15, b: 0.15, p: 0.25, q: 0.25 },
    roofStep: { fold: R.roofStep, on: R.tent.outer, a: 0.1, b: 0.2, p: 0.25, q: 0.35 },
    inV: { fold: R.inV, on: R.vFar.inner, a: 0.08, b: 0.08, p: 0.1, q: 0.1 },
  }
  const vfolds = {
    vFar: { fold: R.vFar, on: paper.root, z: 0.3, alpha: 0.5, gamma: 1.2, length: 0.4, s: -1 },
    vNear: { fold: R.vNear, on: paper.root, z: -0.2, alpha: 0.3, gamma: PI / 2, length: 0.6, s: 1 },
    vIn: { fold: R.vIn, on: R.tent.inner, z: -0.6, alpha: 0.4, gamma: 1.1, length: 0.2, s: -1 },
    vOnV: { fold: R.vOnV, on: R.vFar.inner, z: 0.1, alpha: 0.3, gamma: 1.0, length: 0.15, s: 1 },
    vOut: { fold: R.vOut, on: R.tent.outer, z: -0.58, alpha: 0.4, gamma: 1.2, length: 0.15, s: -1 },
  }
  const flaps = { flapR: R.flapR, flapL: R.flapL, flapT: R.flapT, flapO: R.flapO }
  // touch every outer so its frames exist and get tested
  for (const k of Object.keys(parallels)) void parallels[k].fold.outer
  for (const k of Object.keys(vfolds)) void vfolds[k].fold.outer
  void paper.root.outside
  return { group, paper, R, parallels, vfolds, flaps }
}

function panelFramesOf(rig) {
  const out = [rig.paper.root.left, rig.paper.root.right]
  for (const k of Object.keys(rig.parallels)) {
    const fd = rig.parallels[k].fold
    out.push(fd.left, fd.right, fd.inner.left, fd.inner.right, fd.outer.left, fd.outer.right)
  }
  for (const k of Object.keys(rig.vfolds)) {
    const fd = rig.vfolds[k].fold
    out.push(fd.left, fd.right, fd.inner.left, fd.inner.right, fd.outer.left, fd.outer.right)
  }
  for (const k of Object.keys(rig.flaps)) out.push(rig.flaps[k].panel)
  return out
}

const thetas = (step) => {
  const out = []
  for (let t = 0; t <= PI + 1e-12; t += step) out.push(Math.min(t, PI))
  if (out[out.length - 1] < PI) out.push(PI)
  return out
}

// ---- 1. flat at θ = 0 --------------------------------------------------------

check('1. flat at θ=0: every panel normal ∥ ±x, every frame origin/crease point on x=0', () => {
  const rig = buildRig()
  pose(rig, 0)
  const bad = []
  for (const fr of panelFramesOf(rig)) {
    const n = axis(fr, 1)
    if (!near(Math.abs(n.x), 1, 1e-6)) bad.push(`${fr.name} normal ${f(n)}`)
  }
  for (const fr of allFrames(rig.group)) {
    const o = origin(fr)
    const tol = fr.userData.kind === 'flap' ? 0.0021 : 1e-6 // flaps hinge 0.002 above their host
    if (Math.abs(o.x) > tol) bad.push(`${fr.name} origin ${f(o)}`)
  }
  for (const k of Object.keys(rig.vfolds)) {
    const v = rig.vfolds[k]
    const end = localToWorld(v.fold.inner.crease, 0, 0, v.length)
    if (Math.abs(end.x) > 1e-6) bad.push(`${k} crease end ${f(end)}`)
  }
  for (const k of Object.keys(rig.parallels)) {
    const th = rig.parallels[k].fold.theta
    if (Math.abs(th) > 1e-6) bad.push(`${k}.theta = ${th} at book θ=0`)
  }
  for (const k of Object.keys(rig.vfolds)) {
    const th = rig.vfolds[k].fold.theta
    if (Math.abs(th) > 1e-6) bad.push(`${k}.theta = ${th} at book θ=0`)
  }
  for (const k of Object.keys(rig.flaps)) if (rig.flaps[k].angle !== 0) bad.push(`${k}.angle ≠ 0`)
  return bad
})

check('1b. closed tent lies flat up to 0.85 from the spine; open tent is 0.357 high', () => {
  const rig = buildRig()
  const bad = []
  pose(rig, 0)
  const r = origin(rig.R.tent.ridge)
  if (!near(r.y, 0.85, 1e-9)) bad.push(`closed ridge y = ${r.y}`)
  pose(rig, PI)
  const h = rig.R.tent.height
  if (!near(h, Math.sqrt(0.25 - 0.35 * 0.35), 1e-9)) bad.push(`open height = ${h}`)
  return bad
})

// ---- 2. rigid lengths + attachment --------------------------------------------

check('2. rigid: glue→crease lengths constant, glue lines stay on the parent panels (all θ)', () => {
  const rig = buildRig()
  const bad = []
  for (const th of thetas(0.01)) {
    pose(rig, th)
    for (const k of Object.keys(rig.parallels)) {
      const { fold, on, a, b, p, q } = rig.parallels[k]
      const C = origin(fold.ridge)
      const GL = origin(fold.left)
      const GR = origin(fold.right)
      if (!near(GL.distanceTo(C), p, 1e-9)) bad.push(`${k} θ=${th.toFixed(3)} |GL−C| = ${GL.distanceTo(C)} ≠ ${p}`)
      if (!near(GR.distanceTo(C), q, 1e-9)) bad.push(`${k} θ=${th.toFixed(3)} |GR−C| = ${GR.distanceTo(C)} ≠ ${q}`)
      // the crease sits at body distance p / q in the panel frames (orientation + dir)
      const cl = toLocal(fold.left, C)
      const cr = toLocal(fold.right, C)
      if (cl.distanceTo(new THREE.Vector3(p * fold.left.userData.dir, 0, 0)) > 1e-9) bad.push(`${k} crease in left frame ${f(cl)}`)
      if (cr.distanceTo(new THREE.Vector3(q * fold.right.userData.dir, 0, 0)) > 1e-9) bad.push(`${k} crease in right frame ${f(cr)}`)
      // glue points on the parent hinge's panels at a, b from its crease
      const gl = toLocal(on.left, GL)
      const gr = toLocal(on.right, GR)
      if (gl.distanceTo(new THREE.Vector3(-a, 0, 0)) > 1e-9) bad.push(`${k} glue L in on.left ${f(gl)}`)
      if (gr.distanceTo(new THREE.Vector3(b, 0, 0)) > 1e-9) bad.push(`${k} glue R in on.right ${f(gr)}`)
      // panels' glue lines run along the parent's +z
      const zl = axis(fold.left, 2).applyMatrix3(new THREE.Matrix3().setFromMatrix4(on.crease.matrixWorld).invert())
      if (Math.abs(zl.z - 1) > 1e-9 && on.crease !== rig.group) bad.push(`${k} glue line not ∥ parent z`)
    }
    for (const k of Object.keys(rig.vfolds)) {
      const v = rig.vfolds[k]
      const { fold, on, z, alpha, gamma, length } = v
      const apex = localToWorld(on.crease, 0, 0, z)
      const K = localToWorld(fold.inner.crease, 0, 0, length)
      for (const side of ['left', 'right']) {
        const pf = fold[side]
        const dir = pf.userData.dir
        if (origin(pf).distanceTo(apex) > 1e-9) bad.push(`${k}.${side} origin not at apex`)
        // crease end at (dir·L sin γ, 0, L cos γ) in the panel frame — rigid panel
        const kl = toLocal(pf, K)
        const want = new THREE.Vector3(dir * length * Math.sin(gamma), 0, length * Math.cos(gamma))
        if (kl.distanceTo(want) > 1e-9) bad.push(`${k}.${side} θ=${th.toFixed(3)} crease end ${f(kl)} ≠ ${f(want)}`)
        // glue line lies in the host panel, at alpha from the crease axis, on the body side
        const host = on[side]
        const gEnd = toLocal(host, localToWorld(pf, 0, 0, 1))
        const g0 = toLocal(host, origin(pf))
        const gd = gEnd.sub(g0)
        if (Math.abs(gd.y) > 1e-9) bad.push(`${k}.${side} glue line leaves host plane (y=${gd.y})`)
        if (!near(Math.abs(gd.z), Math.cos(alpha), 1e-9) || gd.x * host.userData.dir < -1e-12)
          bad.push(`${k}.${side} glue dir in host ${f(gd)}`)
        if (Math.sign(gd.z) !== v.s && Math.cos(alpha) > 1e-9) bad.push(`${k}.${side} glue runs the wrong way along z`)
      }
    }
  }
  return bad
})

check('2b. flaps: lift angle between host normal and flap normal equals lift(θ)', () => {
  const rig = buildRig()
  const bad = []
  for (const th of thetas(0.05)) {
    pose(rig, th)
    for (const k of Object.keys(rig.flaps)) {
      const fl = rig.flaps[k]
      const host = fl.panel.parent
      const ang = axis(fl.panel, 1).angleTo(axis(host, 1))
      if (!near(ang, Math.abs(fl.angle), 1e-6)) bad.push(`${k} θ=${th.toFixed(2)} normal angle ${ang} vs lift ${fl.angle}`)
      // the body rises toward the host's +y
      const body = axis(fl.panel, 0).multiplyScalar(fl.panel.userData.dir)
      const up = body.dot(axis(host, 1))
      if (fl.angle > 1e-6 && up <= 0) bad.push(`${k} θ=${th.toFixed(2)} body does not rise (${up})`)
    }
  }
  return bad
})

// ---- 3. continuity ------------------------------------------------------------

check('3. continuity: θ in 1e-3 steps moves every frame by O(1e-3) (no branch flips)', () => {
  const rig = buildRig()
  const frames = allFrames(rig.group)
  const bad = []
  let prev = null
  let maxPos = 0
  let maxRot = 0
  let worst = ''
  for (const th of thetas(1e-3)) {
    pose(rig, th)
    const cur = frames.map((o) => o.matrixWorld.clone())
    if (prev) {
      for (let i = 0; i < frames.length; i++) {
        const a = prev[i].elements
        const b = cur[i].elements
        const dp = Math.hypot(a[12] - b[12], a[13] - b[13], a[14] - b[14])
        let dr = 0
        for (const j of [0, 1, 2, 4, 5, 6, 8, 9, 10]) dr = Math.max(dr, Math.abs(a[j] - b[j]))
        if (dp > maxPos) {
          maxPos = dp
          worst = `${frames[i].name} @θ=${th.toFixed(3)}`
        }
        maxRot = Math.max(maxRot, dr)
        if (dp > 0.02 || dr > 0.05) bad.push(`${frames[i].name} jumps at θ=${th.toFixed(4)}: dpos ${dp.toExponential(2)}, drot ${dr.toExponential(2)}`)
      }
    }
    prev = cur
  }
  console.log(`        (max per-step move ${maxPos.toExponential(2)} [${worst}], max basis change ${maxRot.toExponential(2)})`)
  return bad
})

check('3b. continuity of derived angles: fold.theta / height never jump; outside faces stay outside', () => {
  const rig = buildRig()
  const bad = []
  const all = { ...Object.fromEntries(Object.entries(rig.parallels).map(([k, v]) => [k, v.fold])), ...Object.fromEntries(Object.entries(rig.vfolds).map(([k, v]) => [k, v.fold])) }
  const prev = {}
  for (const th of thetas(1e-3)) {
    pose(rig, th)
    for (const k of Object.keys(all)) {
      const fd = all[k]
      if (prev[k]) {
        if (Math.abs(fd.theta - prev[k].theta) > 0.02) bad.push(`${k}.theta jumps at ${th.toFixed(4)}`)
        if (Math.abs(fd.height - prev[k].height) > 0.02) bad.push(`${k}.height jumps at ${th.toFixed(4)}`)
      }
      prev[k] = { theta: fd.theta, height: fd.height }
      // outside faces: fold panel +y · inner +y ≤ 0
      const yin = axis(fd.inner.crease, 1)
      for (const side of ['left', 'right']) {
        const d = axis(fd[side], 1).dot(yin)
        if (d > 1e-9) bad.push(`${k}.${side} +y faces into the fold at θ=${th.toFixed(3)} (${d})`)
      }
      // inner/outer are the same crease reversed
      if (axis(fd.inner.crease, 1).dot(axis(fd.ridge, 1)) > -1 + 1e-9) bad.push(`${k} ridge is not inner reversed`)
      if (!near(fd.outer.theta, 2 * PI - fd.inner.theta, 1e-12)) bad.push(`${k} θ_out ≠ 2π − θ_in`)
    }
  }
  return bad
})

// ---- 4. nesting ---------------------------------------------------------------

check('4. nesting: inner/outer hinges describe the parent fold\'s panels (left/right as documented)', () => {
  const rig = buildRig()
  const bad = []
  for (const th of thetas(0.01)) {
    pose(rig, th)
    for (const k of ['tent', 'step', 'stepR']) {
      const { fold, p, q } = rig.parallels[k]
      const GL = origin(fold.left)
      const GR = origin(fold.right)
      // inner (+y into the fold): right = physical LEFT panel, left = physical RIGHT
      const a1 = toLocal(fold.inner.right, GL)
      const a2 = toLocal(fold.inner.left, GR)
      if (a1.distanceTo(new THREE.Vector3(p, 0, 0)) > 1e-9) bad.push(`${k} θ=${th.toFixed(2)} inner.right ↛ physical left: ${f(a1)}`)
      if (a2.distanceTo(new THREE.Vector3(-q, 0, 0)) > 1e-9) bad.push(`${k} θ=${th.toFixed(2)} inner.left ↛ physical right: ${f(a2)}`)
      // outer (+y out): left = physical left, right = physical right
      const b1 = toLocal(fold.outer.left, GL)
      const b2 = toLocal(fold.outer.right, GR)
      if (b1.distanceTo(new THREE.Vector3(-p, 0, 0)) > 1e-9) bad.push(`${k} outer.left ↛ physical left: ${f(b1)}`)
      if (b2.distanceTo(new THREE.Vector3(q, 0, 0)) > 1e-9) bad.push(`${k} outer.right ↛ physical right: ${f(b2)}`)
      // hinge panel frames' normals face their hinge's +y side
      const yi = axis(fold.inner.crease, 1)
      const yo = axis(fold.outer.crease, 1)
      for (const s of ['left', 'right']) {
        if (th > 1e-3 && axis(fold.inner[s], 1).dot(yi) <= 0) bad.push(`${k}.inner.${s} +y faces away from inner +y`)
        if (th > 1e-3 && axis(fold.outer[s], 1).dot(yo) <= 0) bad.push(`${k}.outer.${s} +y faces away from outer +y`)
      }
    }
    // nested glue points lie in the planes of the physical parent panels
    const T = rig.R.tent
    for (const [k, nest, physL, physR] of [
      ['hang', rig.R.hang, T.right, T.left], // inner: left glue on physical right
      ['roof', rig.R.roof, T.left, T.right], // outer: left glue on physical left
      ['roofStep', rig.R.roofStep, T.left, T.right],
    ]) {
      const gl = toLocal(physL, origin(nest.left))
      const gr = toLocal(physR, origin(nest.right))
      if (Math.abs(gl.y) > 1e-9 || Math.abs(gr.y) > 1e-9) bad.push(`${k} θ=${th.toFixed(2)} glue off the parent panel (${gl.y}, ${gr.y})`)
      if (gl.x * physL.userData.dir < -1e-9 || gr.x * physR.userData.dir < -1e-9) bad.push(`${k} glue outside the parent panel body`)
    }
    // the hanging fold hangs (crease below the tent's crease); the roof rises above the ridge
    if (th > 0.05) {
      const ridgeY = origin(T.ridge).y
      if (!(origin(rig.R.hang.ridge).y < ridgeY)) bad.push(`hang does not hang at θ=${th.toFixed(2)}`)
      if (!(origin(rig.R.roof.ridge).y > ridgeY)) bad.push(`roof does not rise above the ridge at θ=${th.toFixed(2)}`)
    }
  }
  // closed: nested-on-outer sticks out p − a beyond the parent's ridge
  pose(rig, 0)
  const dy = origin(rig.R.roof.ridge).y - origin(rig.R.tent.ridge).y
  if (!near(dy, 0.1, 1e-9)) bad.push(`closed roof sticks out ${dy}, want 0.1`)
  const dys = origin(rig.R.roofStep.ridge).y - origin(rig.R.tent.ridge).y
  if (!near(dys, 0.15, 1e-9)) bad.push(`closed roofStep sticks out ${dys}, want 0.15`)
  if (rig.paper.root.outside.outside !== rig.paper.root) bad.push('outside.outside !== hinge')
  if (!near(rig.paper.root.outside.theta, 2 * PI, 1e-12)) bad.push('root.outside.theta ≠ 2π − θ')
  return bad
})

// ---- 5. no NaN ----------------------------------------------------------------

check('5. no NaN for valid and degenerate inputs, any θ (including NaN/out-of-range θ)', () => {
  const group = new THREE.Group()
  const paper = new Paper(group)
  const folds = [
    paper.parallelFold({ a: 0, b: 0, p: 0, q: 0 }),
    paper.parallelFold({ a: 0.3, b: 0.3, p: 0.2, q: 0.6 }), // a = b, p ≠ q: no flat state
    paper.parallelFold({ a: 0.5, b: 0.5, p: 0.1, q: 0.1 }), // too short to reach
    paper.parallelFold({ a: 0.1, b: 0.1, p: 0, q: 0.3 }),
    paper.parallelFold({ a: 5, b: 0.01, p: 0.2, q: 9 }),
    paper.parallelFold({ a: -1, b: NaN, p: -2, q: Infinity }),
    paper.parallelFold({}),
    paper.parallelFold(),
  ]
  const vs = [
    paper.vFold({ alpha: 0, gamma: 0 }),
    paper.vFold({ alpha: 0.8, gamma: 0.5 }), // alpha > gamma
    paper.vFold({ alpha: 0.5, gamma: 0.5 }), // alpha = gamma
    paper.vFold({ alpha: PI / 2, gamma: PI / 2, toward: 'near' }),
    paper.vFold({ alpha: 0.3, gamma: 2.5 }), // gamma > π/2
    paper.vFold({ alpha: -1, gamma: 9, length: -1, toward: 'sideways' }),
    paper.vFold({ alpha: NaN, gamma: NaN, z: NaN, length: NaN }),
    paper.vFold(),
  ]
  const nests = []
  for (const fd of [...folds, ...vs]) {
    nests.push(paper.parallelFold({ on: fd.inner, a: 0.1, p: 0.1 }))
    nests.push(paper.parallelFold({ on: fd.outer, a: 0.1, p: 0.2 }))
    nests.push(paper.vFold({ on: fd.inner, alpha: 0.3, gamma: 1 }))
    paper.flap({ on: fd, side: 'left', lift: () => NaN })
    paper.flap({ on: fd.outer, side: 'right', lift: 0.3 })
  }
  paper.flap({ x: NaN, z: NaN, alpha: NaN, length: NaN, lift: (th) => th / 0 - Infinity })
  void paper.root.outside.outside.outside
  const bad = []
  for (const th of [...thetas(0.01), 1e-15, PI - 1e-15, NaN, -1, 10, Infinity]) {
    paper.update(th)
    group.updateMatrixWorld(true)
    group.traverse((o) => {
      if (!finiteMatrix(o.matrixWorld)) bad.push(`${o.name} non-finite at θ=${th}`)
    })
    for (const fd of [...folds, ...vs, ...nests]) {
      if (!Number.isFinite(fd.theta) || !Number.isFinite(fd.height)) bad.push(`theta/height NaN at θ=${th}`)
      if (fd.theta < -1e-12 || fd.theta > PI + 1e-12) bad.push(`fold.theta ${fd.theta} outside [0, π]`)
    }
  }
  if (!Number.isFinite(paper.root.theta) || paper.root.theta !== PI) bad.push(`root.theta after bad input: ${paper.root.theta}`)
  // cards on every kind of frame, every shape, thin and thick
  const star = new THREE.Shape()
  star.moveTo(0, 0)
  star.lineTo(0.2, 0.05)
  star.quadraticCurveTo(0.3, 0.2, 0.05, 0.3)
  star.lineTo(0, 0)
  const frames = []
  group.traverse((o) => {
    if (o !== group && !o.isMesh && o.userData.dir) frames.push(o)
  })
  for (const fr of frames.slice(0, 60)) {
    for (const shape of ['rect', 'tri', 'quad', undefined, star, 'bogus']) {
      for (const thickness of [0, 0.01]) {
        const mesh = paper.card(fr, { shape, thickness })
        const a = mesh.geometry.attributes
        if (![...a.position.array, ...a.normal.array, ...a.uv.array].every(Number.isFinite)) bad.push(`card NaN on ${fr.name} (${shape})`)
        fr.remove(mesh)
      }
    }
  }
  paper.dispose()
  return bad
})

// ---- handedness / dir conventions --------------------------------------------

check('H. handedness & dir conventions at θ=π (pages, folds, ridge, inner, V, flap)', () => {
  const rig = buildRig()
  pose(rig, PI)
  const bad = []
  const { root } = rig.paper
  const X = new THREE.Vector3(1, 0, 0)
  const Y = new THREE.Vector3(0, 1, 0)
  const Z = new THREE.Vector3(0, 0, 1)
  const is = (v, w, label, tol = 1e-9) => {
    if (v.distanceTo(w) > tol) bad.push(`${label}: ${f(v)} ≠ ${f(w)}`)
  }
  is(axis(root.right, 0), X, 'root.right +x')
  is(axis(root.right, 1), Y, 'root.right +y')
  is(axis(root.right, 2), Z, 'root.right +z')
  is(axis(root.left, 0).multiplyScalar(root.left.userData.dir), X.clone().negate(), 'root.left body side (dir·x)')
  is(axis(root.left, 1), Y, 'root.left +y')
  if (root.right.userData.dir !== 1 || root.left.userData.dir !== -1) bad.push('page dirs')
  // a placed point at x = 0.5 lands on the body of either page
  const pr = rig.paper.place(root.right, { x: 0.5, y: 0.002 })
  const pl = rig.paper.place(root.left, { x: 0.5, y: 0.002 })
  rig.group.updateMatrixWorld(true)
  is(origin(pr), new THREE.Vector3(0.5, 0.002, 0), 'place(root.right, x .5)')
  is(origin(pl), new THREE.Vector3(-0.5, 0.002, 0), 'place(root.left, x .5)')
  for (const k of ['tent', 'step', 'stepR', 'roof']) {
    const fd = rig.parallels[k].fold
    if (axis(fd.left, 1).y <= 0) bad.push(`${k}.left +y does not point up: ${f(axis(fd.left, 1))}`)
    if (axis(fd.right, 1).y <= 0) bad.push(`${k}.right +y does not point up: ${f(axis(fd.right, 1))}`)
    if (axis(fd.ridge, 1).y <= 0.5) bad.push(`${k}.ridge +y not up: ${f(axis(fd.ridge, 1))}`)
    if (axis(fd.inner.crease, 1).y >= -0.5) bad.push(`${k}.inner.crease +y not down: ${f(axis(fd.inner.crease, 1))}`)
  }
  const T = rig.R.tent
  is(axis(T.ridge, 1), Y, 'tent.ridge +y')
  is(axis(T.ridge, 0), X, 'tent.ridge +x (= y × z)')
  is(axis(T.inner.crease, 1), Y.clone().negate(), 'tent.inner +y')
  is(axis(T.inner.crease, 2), Z, 'tent.inner +z keeps the parent z')
  // tent.left: glued on the left page, +y up-left (outside), body toward the ridge
  if (!(axis(T.left, 1).x < 0)) bad.push('tent.left outside face does not face −x')
  if (!(axis(T.right, 1).x > 0)) bad.push('tent.right outside face does not face +x')
  // hang hangs: its ridge (+y out of it) points down, toward the parent inner +y
  if (!(axis(rig.R.hang.ridge, 1).y < -0.5)) bad.push('hang.ridge +y not down')
  // V far: inner opens toward −z, right panel's outside face toward +x, up-ish
  const vf = rig.R.vFar
  if (!(axis(vf.inner.crease, 1).z < 0)) bad.push(`vFar inner +y ${f(axis(vf.inner.crease, 1))} not toward −z`)
  if (!(axis(vf.right, 1).x > 0 && axis(vf.right, 1).y > 0)) bad.push(`vFar.right +y ${f(axis(vf.right, 1))}`)
  if (!(axis(vf.left, 1).x < 0 && axis(vf.left, 1).y > 0)) bad.push(`vFar.left +y ${f(axis(vf.left, 1))}`)
  if (!(axis(vf.ridge, 1).z > 0)) bad.push('vFar ridge +y not toward +z (the reader)')
  if (!(origin(vf.right).z === 0.3)) bad.push('vFar apex z')
  const vn = rig.R.vNear
  if (!(axis(vn.inner.crease, 1).z > 0)) bad.push(`vNear inner +y ${f(axis(vn.inner.crease, 1))} not toward +z`)
  if (!(axis(vn.right, 1).x > 0)) bad.push(`vNear.right +y ${f(axis(vn.right, 1))} not outside`)
  is(axis(vn.inner.crease, 2), Y, 'vNear (γ=π/2) crease straight up', 1e-9)
  if (!near(vn.theta, 2 * 0.3, 1e-9)) bad.push(`vNear θ_V = ${vn.theta}, want 2α at θ=π, γ=π/2`)
  if (!near(vn.height, 0.6, 1e-9)) bad.push(`vNear height ${vn.height}`)
  // V-fold right panel is on the parent's +x side
  const vr = localToWorld(vf.right, vf.right.userData.dir * 0.1, 0, 0.1)
  if (!(vr.x > 0)) bad.push('vFar.right body not on +x')
  // flap: body rises, +y tilted toward the spine on the right page
  const fr = rig.R.flapR
  const body = axis(fr.panel, 0).multiplyScalar(fr.panel.userData.dir)
  if (!(body.y > 0)) bad.push('flapR body does not rise')
  const fl = rig.R.flapL
  const bodyL = axis(fl.panel, 0).multiplyScalar(fl.panel.userData.dir)
  if (!(bodyL.y > 0 && bodyL.x < 0)) bad.push(`flapL body ${f(bodyL)}`)
  // left/right flaps with equal settings mirror each other across x = 0
  const oR = origin(fr.panel)
  const oL = origin(fl.panel)
  if (Math.abs(oR.x + oL.x) > 1e-9 || Math.abs(oR.y - oL.y) > 1e-9 || Math.abs(oR.z - oL.z) > 1e-9) bad.push('flap hinge points not mirrored')
  const bR = body.clone()
  if (Math.abs(bR.x + bodyL.x) > 1e-9 || Math.abs(bR.y - bodyL.y) > 1e-9 || Math.abs(bR.z - bodyL.z) > 1e-9) bad.push(`flap bodies not mirrored ${f(bR)} vs ${f(bodyL)}`)
  // every frame is a proper rotation (right-handed, x = y × z)
  for (const o of allFrames(rig.group)) {
    const det = new THREE.Matrix3().setFromMatrix4(o.matrixWorld).determinant()
    if (!near(det, 1, 1e-9)) bad.push(`${o.name} det ${det}`)
  }
  return bad
})

check('C. card(): geometry sits on the body side, +y normals, winding matches normals, UVs 0..1', () => {
  const rig = buildRig()
  pose(rig, PI)
  const { paper } = rig
  const bad = []
  const tri = new THREE.Vector3()
  const e1 = new THREE.Vector3()
  const e2 = new THREE.Vector3()
  const probe = (fr, opts, label, expect) => {
    const mesh = paper.card(fr, opts)
    const g = mesh.geometry
    const pos = g.attributes.position
    const nor = g.attributes.normal
    const uv = g.attributes.uv
    const dir = fr.userData.dir
    for (let i = 0; i < pos.count; i++) {
      if (pos.getX(i) * dir < -1e-9) bad.push(`${label}: vertex off the body side x=${pos.getX(i)}`)
      if (!opts.thickness && Math.abs(pos.getY(i)) > 1e-12) bad.push(`${label}: vertex off y=0`)
      if (!opts.thickness && Math.abs(nor.getY(i) - 1) > 1e-6) bad.push(`${label}: normal ${nor.getY(i)}`)
      if (uv.getX(i) < -1e-6 || uv.getX(i) > 1 + 1e-6 || uv.getY(i) < -1e-6 || uv.getY(i) > 1 + 1e-6) bad.push(`${label}: uv out of range`)
    }
    // geometric (winding) normal agrees with the normal attribute
    const idx = g.index ? g.index.array : [...Array(pos.count).keys()]
    for (let t = 0; t < idx.length; t += 3) {
      const [i0, i1, i2] = [idx[t], idx[t + 1], idx[t + 2]]
      e1.fromBufferAttribute(pos, i1).sub(tri.fromBufferAttribute(pos, i0))
      e2.fromBufferAttribute(pos, i2).sub(tri)
      const gn = e1.cross(e2)
      if (gn.lengthSq() < 1e-20) continue
      const an = new THREE.Vector3().fromBufferAttribute(nor, i0)
      if (gn.dot(an) <= 0) {
        bad.push(`${label}: triangle ${t / 3} winding disagrees with its normal`)
        break
      }
    }
    if (expect) expect(g, label)
    return mesh
  }
  const xRange = (lo, hi) => (g, label) => {
    g.computeBoundingBox()
    const b = g.boundingBox
    // float32 attributes, hence 1e-6
    if (!near(b.min.x, lo, 1e-6) || !near(b.max.x, hi, 1e-6)) bad.push(`${label}: x ∈ [${b.min.x}, ${b.max.x}] want [${lo}, ${hi}]`)
  }
  probe(paper.root.right, { length: 1, z0: -0.7, z1: 0.7 }, 'page right', xRange(0, 1))
  probe(paper.root.left, { length: 1, z0: -0.7, z1: 0.7 }, 'page left', xRange(-1, 0))
  probe(paper.root.right, {}, 'page right default', xRange(0, 1))
  for (const k of ['tent', 'step']) {
    const fd = rig.parallels[k].fold
    probe(fd.left, {}, `${k}.left`, xRange(0, rig.parallels[k].p))
    probe(fd.right, {}, `${k}.right`, xRange(-rig.parallels[k].q, 0))
    probe(fd.left, { thickness: 0.01 }, `${k}.left thick`)
    probe(fd.left, { shape: 'tri' }, `${k}.left tri`)
  }
  for (const k of Object.keys(rig.vfolds)) {
    const v = rig.vfolds[k]
    for (const side of ['left', 'right']) {
      const fr = v.fold[side]
      const dir = fr.userData.dir
      const K = new THREE.Vector3(dir * v.length * Math.sin(v.gamma), 0, v.length * Math.cos(v.gamma))
      const hasK = (g, label) => {
        const pos = g.attributes.position
        let found = false
        for (let i = 0; i < pos.count; i++) if (new THREE.Vector3().fromBufferAttribute(pos, i).distanceTo(K) < 1e-6) found = true
        if (!found) bad.push(`${label}: no vertex at the crease end ${f(K)}`)
      }
      probe(fr, {}, `${k}.${side} tri`, hasK)
      probe(fr, { shape: 'quad', z1: 0.1 }, `${k}.${side} quad`, hasK)
      probe(fr, { shape: 'quad', thickness: 0.005 }, `${k}.${side} quad thick`)
    }
  }
  const sh = new THREE.Shape()
  sh.moveTo(0, -0.1)
  sh.lineTo(0.3, 0)
  sh.absarc(0.3, 0.1, 0.1, -PI / 2, PI / 2, false)
  sh.lineTo(0, 0.1)
  probe(paper.root.left, { shape: sh }, 'custom shape on the left page')
  probe(paper.root.right, { shape: sh }, 'custom shape on the right page')
  probe(rig.R.tent.left, { shape: sh, thickness: 0.01 }, 'thick custom shape on tent.left')
  probe(rig.R.flapL.panel, { shape: 'tri' }, 'flap tri')
  probe(paper.place(paper.root.left, { x: 0.2, y: 0.002 }), { length: 0.3 }, 'card on a placed frame', xRange(-0.3, 0))
  // material cache
  if (paper.material({ color: '#abcdef' }) !== paper.material({ color: '#abcdef' })) bad.push('material cache miss')
  if (paper.material({ color: '#abcdef' }) === paper.material({ color: '#abcdee' })) bad.push('material cache collision')
  const tex = new THREE.Texture()
  if (paper.material({ map: tex }) !== paper.material({ map: tex })) bad.push('material cache with texture')
  // rng determinism
  const r1 = paper.rng(7)
  const r2 = paper.rng(7)
  for (let i = 0; i < 100; i++) {
    const v = r1()
    if (v !== r2() || v < 0 || v >= 1) bad.push('rng not deterministic / out of range')
  }
  return bad
})

check('P. posing allocates nothing: update() reuses the same objects and is idempotent', () => {
  const rig = buildRig()
  const frames = allFrames(rig.group)
  const before = frames.map((o) => [o.position, o.quaternion, o.rotation])
  pose(rig, 1.234)
  const m1 = frames.map((o) => o.matrixWorld.clone())
  pose(rig, 2.5)
  pose(rig, 1.234)
  const bad = []
  frames.forEach((o, i) => {
    if (o.position !== before[i][0] || o.quaternion !== before[i][1] || o.rotation !== before[i][2]) bad.push(`${o.name} replaced a transform object`)
    if (!o.matrixWorld.equals(m1[i])) {
      const d = Math.max(...o.matrixWorld.elements.map((v, j) => Math.abs(v - m1[i].elements[j])))
      if (d > 1e-12) bad.push(`${o.name} not idempotent (${d})`)
    }
  })
  if (allFrames(rig.group).length !== frames.length) bad.push('update() created frames')
  return bad
})

const passed = results.filter((r) => r[1]).length
console.log(`\n${passed}/${results.length} checks passed`)
process.exit(failures ? 1 : 0)
