import { mul3, apply3, euler, add3, sub3, scale3, norm3 } from './mat.js'

// The figure is never rendered in 3D. It's a skeleton of joints dressed in
// capsules and ellipsoids, and each frame every shape is projected flat: a
// cone-capsule's silhouette is a 2D tapered capsule, an ellipsoid's is an
// ellipse. The shader unions those 2D shapes into one signed distance field —
// the silhouette — which is all a black cutout needs, and which also tells the
// light exactly how far it is from the edge it pours out of.
//
// Body frame: +x the figure's left, +y up the spine, +z the way it faces.
// Right-side joints are written in left-side terms and mirrored.

const MAX_PRIMS = 190

// index, middle, ring, little: knuckle z, two phalanx lengths (m)
const FINGERS = [
  [0.027, 0.044, 0.04],
  [0.009, 0.048, 0.045],
  [-0.01, 0.045, 0.041],
  [-0.027, 0.035, 0.031],
]

// [name, parent, offset in the parent's frame (m)]
const SKELETON = [
  ['pelvis', null, [0, 0, 0]],
  ['spine', 'pelvis', [0, 0.1, -0.01]],
  ['chest', 'spine', [0, 0.17, 0]],
  ['neck', 'chest', [0, 0.25, -0.025]],
  ['head', 'neck', [0, 0.1, 0.012]],
]
for (const s of ['L', 'R']) {
  const m = s === 'L' ? 1 : -1
  SKELETON.push(
    ['clav' + s, 'chest', [0.02 * m, 0.215, -0.01]],
    ['shoulder' + s, 'clav' + s, [0.155 * m, 0, -0.005]],
    ['elbow' + s, 'shoulder' + s, [0, -0.29, 0]],
    ['wrist' + s, 'elbow' + s, [0, -0.25, 0]],
    ['hip' + s, 'pelvis', [0.092 * m, -0.07, 0]],
    ['knee' + s, 'hip' + s, [0, -0.43, 0]],
    ['ankle' + s, 'knee' + s, [0, -0.42, 0]],
  )
  FINGERS.forEach(([z, l1], i) => {
    SKELETON.push([`f${i}a${s}`, 'wrist' + s, [0, -0.092 + Math.abs(z) * 0.18, z]])
    SKELETON.push([`f${i}b${s}`, `f${i}a${s}`, [0, -l1, 0]])
  })
  SKELETON.push(['thumbA' + s, 'wrist' + s, [-0.006 * m, -0.022, 0.03]])
  SKELETON.push(['thumbB' + s, 'thumbA' + s, [0, -0.046, 0]])
}

// Shapes, in their joint's frame. cap: [joint, a, b, ra, rb, k, group];
// ell: [joint, centre, radii, k, group, euler?]. k is the blend radius (m).
function shapes() {
  const S = []
  const cap = (j, a, b, ra, rb, k, g) => S.push({ type: 0, j, a, b, ra, rb, k, g })
  const ell = (j, c, r, k, g, e) => S.push({ type: 1, j, c, r, k, g, e })

  // torso, back to front so the big masses land first
  ell('pelvis', [0, 0, -0.005], [0.16, 0.11, 0.105], 0.05, 'torso')
  ell('pelvis', [0, -0.06, -0.05], [0.145, 0.1, 0.085], 0.04, 'torso')
  ell('pelvis', [0, 0.03, 0.035], [0.13, 0.09, 0.07], 0.04, 'torso')
  ell('spine', [0, 0.08, 0], [0.13, 0.13, 0.088], 0.05, 'torso')
  ell('chest', [0, 0.12, -0.005], [0.148, 0.16, 0.102], 0.05, 'torso')
  ell('chest', [0, 0.165, 0.035], [0.145, 0.08, 0.075], 0.03, 'torso')
  ell('chest', [0, 0.17, -0.048], [0.145, 0.09, 0.07], 0.03, 'torso')
  cap('chest', [-0.14, 0.235, -0.02], [0.14, 0.235, -0.02], 0.05, 0.05, 0.04, 'torso')
  cap('neck', [0, -0.02, 0], [0, 0.11, 0.012], 0.05, 0.044, 0.03, 'torso')

  // head: skull, face, jaw, and the profile features that make it a person
  ell('head', [0, 0.1, -0.015], [0.074, 0.095, 0.1], 0.02, 'head')
  ell('head', [0, 0.052, 0.042], [0.062, 0.075, 0.062], 0.02, 'head')
  ell('head', [0, 0.004, 0.068], [0.042, 0.028, 0.034], 0.015, 'head')
  ell('head', [0, 0.112, 0.082], [0.058, 0.018, 0.022], 0.012, 'head')
  cap('head', [0, 0.092, 0.098], [0, 0.056, 0.121], 0.01, 0.0115, 0.008, 'head')
  ell('head', [0, 0.03, 0.094], [0.024, 0.014, 0.013], 0.008, 'head')
  ell('head', [0, 0.105, -0.06], [0.082, 0.092, 0.082], 0.02, 'head') // hair over the occiput

  for (const s of ['L', 'R']) {
    const arm = 'arm' + s, hand = 'hand' + s, leg = 'leg' + s
    ell('shoulder' + s, [0.004, -0.04, 0], [0.05, 0.08, 0.054], 0.03, arm)
    cap('shoulder' + s, [0, 0, 0], [0, -0.29, 0], 0.043, 0.033, 0.03, arm)
    ell('shoulder' + s, [0, -0.15, 0.01], [0.038, 0.1, 0.04], 0.02, arm)
    cap('elbow' + s, [0, 0, 0], [0, -0.25, 0], 0.034, 0.022, 0.02, arm)
    ell('elbow' + s, [0, -0.07, 0], [0.033, 0.09, 0.038], 0.02, arm)

    ell('wrist' + s, [0, -0.05, 0], [0.015, 0.05, 0.04], 0.012, hand)
    ell('wrist' + s, [-0.004, -0.036, 0.024], [0.016, 0.03, 0.02], 0.01, hand)
    FINGERS.forEach(([, l1, l2], i) => {
      const r = i === 3 ? 0.0075 : 0.0088
      cap(`f${i}a${s}`, [0, 0, 0], [0, -l1, 0], r, r * 0.86, 0.005, hand)
      cap(`f${i}b${s}`, [0, 0, 0], [0, -l2, 0], r * 0.86, r * 0.62, 0.004, hand)
    })
    cap('thumbA' + s, [0, 0, 0], [0, -0.046, 0], 0.012, 0.0095, 0.008, hand)
    cap('thumbB' + s, [0, 0, 0], [0, -0.034, 0], 0.0095, 0.007, 0.004, hand)

    cap('hip' + s, [0, 0, 0], [0, -0.43, 0], 0.082, 0.05, 0.04, leg)
    ell('hip' + s, [0, -0.17, 0.015], [0.072, 0.19, 0.078], 0.03, leg)
    cap('knee' + s, [0, 0, 0], [0, -0.41, 0], 0.048, 0.029, 0.025, leg)
    ell('knee' + s, [0, -0.12, -0.028], [0.046, 0.13, 0.052], 0.02, leg)
    ell('ankle' + s, [0, -0.035, -0.025], [0.032, 0.035, 0.04], 0.015, leg)
    cap('ankle' + s, [0, -0.045, -0.01], [0, -0.068, 0.155], 0.032, 0.021, 0.015, leg)
  }
  return S
}

// Hair: locks rooted over the crown, back and sides of the skull (head frame).
function hairRoots() {
  const roots = []
  const c = [0, 0.1, -0.015]
  const r = [0.08, 0.1, 0.105]
  const n = 15
  for (let i = 0; i < n; i++) {
    const u = (i + 0.5) / n
    // a spiral over the back of the skull, crown → nape, swinging side to side
    const theta = -0.2 + u * 2.1
    const phi = Math.sin(i * 2.399) * 1.15
    const dir = norm3([Math.sin(phi), Math.cos(theta), -Math.sin(theta) * Math.cos(phi) * 0.9])
    const p = [c[0] + dir[0] * r[0] * 0.9, c[1] + dir[1] * r[1] * 0.9, c[2] + dir[2] * r[2] * 0.9]
    // neighbouring locks share most of their phase, so they move in clumps
    // that merge near the scalp and come apart into strands at the ends
    const clump = Math.floor(i / 3)
    roots.push({
      p,
      n: dir,
      len: 0.26 + 0.3 * ((i * 0.618 + clump * 0.3) % 1),
      width: 0.015 + 0.011 * ((i * 0.382) % 1),
      seed: clump * 2.71 + (i % 3) * 0.23 + 0.7,
    })
  }
  return roots
}

// Slow, smooth, deterministic wandering — a sum of incommensurate sines.
function drift(seed, t) {
  return (
    Math.sin(t * 0.097 + seed * 1.7) * 0.5 +
    Math.sin(t * 0.181 + seed * 3.1) * 0.3 +
    Math.sin(t * 0.293 + seed * 5.3) * 0.2
  )
}

const OPEN = {
  spine: [-0.1, 0, 0.03],
  chest: [-0.12, 0.05, 0.03],
  neck: [-0.15, 0.25, 0.05],
  head: [-0.3, 0.55, 0.1],
  clavL: [0, 0, 0.12],
  shoulderL: [-0.3, 1.1, 1.3],
  elbowL: [-0.85, 0, 0],
  wristL: [0.35, 0, 0.1],
  clavR: [0, 0, 0.1],
  shoulderR: [-0.2, 0.5, 0.85],
  elbowR: [-0.6, 0, 0],
  wristR: [0.3, 0, 0.15],
  hipL: [-0.3, 0.1, 0.2],
  kneeL: [0.7, 0, 0],
  ankleL: [1.0, 0, 0],
  hipR: [-0.8, 0.75, 0.3],
  kneeR: [1.55, 0, 0],
  ankleR: [0.95, 0, 0],
}
const CURL = {
  spine: [0.22, 0, 0.05],
  chest: [0.18, -0.1, 0.02],
  neck: [0.15, 0.2, 0],
  head: [0.1, 0.45, 0.05],
  clavL: [0, 0, 0.05],
  shoulderL: [-0.95, 0.6, 0.55],
  elbowL: [-1.35, 0, 0],
  wristL: [0.4, 0, 0.1],
  clavR: [0, 0, 0.05],
  shoulderR: [-0.7, 0.3, 0.45],
  elbowR: [-1.5, 0, 0],
  wristR: [0.35, 0, 0.1],
  hipL: [-1.35, 0.25, 0.15],
  kneeL: [1.95, 0, 0],
  ankleL: [0.8, 0, 0],
  hipR: [-1.1, 0.4, 0.22],
  kneeR: [1.7, 0, 0],
  ankleR: [0.85, 0, 0],
}
const SURRENDER = {
  spine: [-0.2, 0, 0.02],
  chest: [-0.2, 0.05, 0.02],
  neck: [-0.2, 0.3, 0.03],
  head: [-0.42, 0.5, 0.05],
  clavL: [0, 0, 0.25],
  shoulderL: [-2.5, 0.5, 0.45],
  elbowL: [-0.45, 0, 0],
  wristL: [0.25, 0, 0.1],
  clavR: [0, 0, 0.22],
  shoulderR: [-2.25, 0.2, 0.6],
  elbowR: [-0.6, 0, 0],
  wristR: [0.3, 0, 0.1],
  hipL: [-0.12, 0.05, 0.12],
  kneeL: [0.55, 0, 0],
  ankleL: [1.05, 0, 0],
  hipR: [-0.35, 0.5, 0.2],
  kneeR: [1.0, 0, 0],
  ankleR: [1.0, 0, 0],
}

// Which pose the body is drifting toward. Mostly open; now and then it curls
// in, now and then it lets its arms go overhead. Weights always sum to one.
function poseKeys(t) {
  if (typeof t === 'string') return { open: t === 'open' ? 1 : 0, curl: t === 'curl' ? 1 : 0, surrender: t === 'surrender' ? 1 : 0 }
  const c = 0.5 + 0.5 * Math.sin(t / 53 - 1.4)
  const a = 0.5 + 0.5 * Math.sin(t / 71 - 1.57)
  const curl = Math.pow(c, 3) * 0.85
  const surrender = Math.pow(a, 3) * 0.85 * (1 - curl)
  return { open: 1 - curl - surrender, curl, surrender }
}

export class Figure {
  constructor() {
    this.joints = SKELETON.map(([name, parent, offset]) => ({
      name,
      parent,
      offset,
      side: name.endsWith('R') ? -1 : 1,
      rot: [0, 0, 0],
      R: null,
      p: null,
    }))
    this.byName = Object.fromEntries(this.joints.map((j) => [j.name, j]))
    this.shapes = shapes()
    this.roots = hairRoots()
    this.data = new Float32Array(MAX_PRIMS * 8)
    this.groups = []
    this.count = 0
    this.hair = []
  }

  // Pose the body. `t` is story time (it stops when time stops); `wind` is how
  // hard the fall is pulling at it; `reach` is the one deliberate gesture.
  pose(t, { wind = 1, reach = 0, wall = t, orient, preset }) {
    const J = this.byName
    const d = (seed) => drift(seed, t)
    const w = Math.max(0, wind)
    const breath = Math.sin(wall * 0.9) * 0.015

    // Three poses the body drifts between over minutes, every channel also
    // wandering on its own slow sine. [x flex, y twist, z splay] per joint.
    //   open      arched back, head dropped and turned, arms open, a leg folded
    //   curl      drawn in, knees up, arms loose in front — asleep in the fall
    //   surrender arched hard, arms trailing overhead
    const keys = poseKeys(preset === 'open' || preset === 'curl' || preset === 'surrender' ? preset : t)
    const P = {}
    for (const name of Object.keys(OPEN)) {
      P[name] = [0, 1, 2].map((i) => OPEN[name][i] * keys.open + CURL[name][i] * keys.curl + SURRENDER[name][i] * keys.surrender)
    }
    P.spine[0] += breath
    P.chest[0] += breath
    // the fall pulls the limbs up and out
    P.shoulderL[0] -= w * 0.15
    P.shoulderL[2] += w * 0.12
    P.shoulderR[0] -= w * 0.12
    P.shoulderR[2] += w * 0.15
    P.hipL[0] -= w * 0.08
    P.hipR[0] -= w * 0.08
    const A = {
      spine: [0.06, 0.05, 0.04],
      chest: [0.05, 0.06, 0.03],
      neck: [0.08, 0.15, 0.05],
      head: [0.12, 0.25, 0.08],
      clavL: [0, 0, 0.05],
      shoulderL: [0.3, 0.3, 0.2],
      elbowL: [0.3, 0, 0],
      wristL: [0.2, 0.2, 0.15],
      clavR: [0, 0, 0.05],
      shoulderR: [0.3, 0.3, 0.2],
      elbowR: [0.35, 0, 0],
      wristR: [0.2, 0.2, 0.1],
      hipL: [0.2, 0.15, 0.1],
      kneeL: [0.3, 0, 0],
      ankleL: [0.15, 0, 0],
      hipR: [0.2, 0.15, 0.1],
      kneeR: [0.3, 0, 0],
      ankleR: [0.15, 0, 0],
    }
    let seed = 1
    for (const j of this.joints) {
      const base = P[j.name], amp = A[j.name]
      if (preset === 'stand' || !base) {
        j.rot = [0, 0, 0]
        continue
      }
      j.rot = base.map((b, i) => b + d(seed++ * 3.7 + i) * amp[i])
    }
    if (preset !== 'stand') {
      // The reach: the near arm straightens and the hand opens.
      const mix = (a, b) => a + (b - a) * reach
      const eR = J.elbowR.rot, wR = J.wristR.rot
      J.elbowR.rot = [mix(eR[0], -0.12), 0, 0]
      J.wristR.rot = [mix(wR[0], -0.3), wR[1], wR[2]]
      J.head.rot[1] -= reach * 0.2

      for (const s of ['L', 'R']) {
        const o = s === 'L' ? 0 : 50
        const open = s === 'R' ? reach : 0
        for (let i = 0; i < 4; i++) {
          const spread = (1.5 - i) * (0.12 + open * 0.1) + d(30 + o + i) * 0.05
          const curl = (0.3 + i * 0.08 + d(35 + o + i) * 0.12) * (1 - open * 0.75)
          J[`f${i}a${s}`].rot = [spread, 0, -curl]
          J[`f${i}b${s}`].rot = [0, 0, -curl * 1.3]
        }
        J['thumbA' + s].rot = [-0.75 - open * 0.25 + d(40 + o) * 0.1, 0, -0.3]
        J['thumbB' + s].rot = [0, 0, -0.3 * (1 - open)]
      }
    }

    this.fk(orient)
    if (preset !== 'stand') this.aimReach(reach, wall)

    // Recentre on the torso so the figure hangs in the middle of the frame and
    // the light can sit squarely behind it.
    const key = ['pelvis', 'chest', 'chest', 'head', 'kneeL', 'kneeR', 'elbowL', 'elbowR']
    const c = [0, 0, 0]
    for (const k of key) for (let i = 0; i < 3; i++) c[i] += J[k].p[i] / key.length
    for (const j of this.joints) j.p = sub3(j.p, c)
    this.torso = scale3(add3(J.chest.p, J.pelvis.p), 0.5)

    this.poseHair(t, w)
  }

  fk(root) {
    const J = this.byName
    for (const j of this.joints) {
      const local = euler(j.rot[0], j.rot[1] * j.side, j.rot[2] * j.side)
      if (!j.parent) {
        j.R = mul3(root, local)
        j.p = [0, 0, 0]
      } else {
        const P = J[j.parent]
        j.R = mul3(P.R, local)
        j.p = add3(P.p, apply3(P.R, j.offset))
      }
    }
    this.root = root
  }

  // During the reach the near arm lifts toward world-up — back toward where
  // the body fell from — whichever way the body happens to be turned. A coarse
  // search over the shoulder, eased between frames so the arm never snaps.
  aimReach(reach, wall) {
    const J = this.byName
    const sh = J.shoulderR
    const dt = this.reachWall === undefined ? 0 : Math.min(0.1, Math.max(0, wall - this.reachWall))
    this.reachWall = wall
    if (!this.reachAim) this.reachAim = sh.rot.slice()
    if (reach > 0.001) {
      const C = J.clavR.R
      const twist = sh.rot[1]
      let best = null, bestScore = -1e9
      const score = (x, z) => {
        const R = mul3(C, euler(x, -twist, -z))
        // arm direction is the shoulder frame's -y; a little toward the lens
        // so it reads, but never straight at it
        const dy = -R[4], dz = -R[7]
        return dy + 0.12 * dz - 0.04 * (Math.abs(x - sh.rot[0]) + Math.abs(z - sh.rot[2]))
      }
      // Search the whole range once, when the reach begins; after that, only
      // refine from where it already is. The range covers the sphere of arm
      // directions twice, so a fresh search can hop between two far-apart
      // answers of nearly equal score — and the arm would whip between them.
      if (!this.reachGoal) {
        for (let x = -3.0; x <= 0.6; x += 0.2)
          for (let z = -0.2; z <= 2.6; z += 0.2) {
            const v = score(x, z)
            if (v > bestScore) (bestScore = v), (best = [x, z])
          }
      } else {
        best = this.reachGoal.slice()
        bestScore = score(best[0], best[1])
      }
      for (const step of [0.08, 0.08, 0.03, 0.03])
        for (const dx of [-step, 0, step])
          for (const dz of [-step, 0, step]) {
            const v = score(best[0] + dx, best[1] + dz)
            if (v > bestScore) (bestScore = v), (best = [best[0] + dx, best[1] + dz])
          }
      this.reachGoal = best
      const ease = 1 - Math.exp(-dt / 0.45)
      this.reachAim[0] += (this.reachGoal[0] - this.reachAim[0]) * ease
      this.reachAim[2] += (this.reachGoal[1] - this.reachAim[2]) * ease
    } else {
      this.reachAim = sh.rot.slice()
      this.reachGoal = null
    }
    const r = reach * reach * (3 - 2 * reach)
    sh.rot = [sh.rot[0] + (this.reachAim[0] - sh.rot[0]) * r, sh.rot[1], sh.rot[2] + (this.reachAim[2] - sh.rot[2]) * r]
    this.fk(this.root)
  }

  // Each lock leaves the scalp along its normal and bends into the wind — the
  // air rushing up past a falling body — with a wave travelling down it like a
  // flag. With no wind the wave is all there is, and the hair opens into a
  // slow halo, the way hair moves under water.
  poseHair(t, wind) {
    const head = this.byName.head
    const up = [0, 1, 0]
    // The wave swings across the wind along two fixed world axes. Anything
    // derived from the head's own frame flips sign somewhere in the body's
    // spin, and the hair would snap.
    const a1 = [1, 0, 0]
    const a2 = [0, 0, 1]
    const K = 7
    const pull = Math.min(1.4, wind)
    // The wave travels faster when the fall pulls harder. Its phase is
    // integrated, not t × speed: with t in the thousands, multiplying would
    // turn every change of speed into a lurch.
    const dt = this.hairT === undefined ? 0 : Math.max(0, t - this.hairT)
    this.hairT = t
    this.hairPhase = (this.hairPhase ?? t) + dt * (0.9 + 0.5 * pull)
    const wave = this.hairPhase
    this.hair = this.roots.map((root) => {
      const pts = [add3(head.p, apply3(head.R, root.p))]
      const n = apply3(head.R, root.n)
      const seg = root.len / K
      const s = root.seed
      let dir = n
      for (let i = 1; i <= K; i++) {
        const f = i / K
        const ph = s * 3.1 + wave - f * 3.4
        const amp = (0.25 + 0.95 * f) * (0.6 + 0.35 * (1 - Math.min(1, pull)))
        const swing = add3(scale3(a1, Math.sin(ph) * amp), scale3(a2, Math.sin(ph * 0.73 + s) * amp * 0.8))
        const raw = add3(add3(scale3(n, 0.7 * (1 - f) + 0.1), scale3(up, pull * (0.7 + 1.1 * f))), swing)
        // A root pointing down with little pull could cancel the lift to
        // nothing, and normalising near-zero flips the lock. The swing is
        // horizontal, so a floor on the rise keeps the vector honest.
        raw[1] = Math.max(raw[1], 0.15)
        const target = norm3(raw)
        dir = norm3(add3(scale3(dir, 0.35), scale3(target, 0.65 + 0.3 * f)))
        pts.push(add3(pts[pts.length - 1], scale3(dir, seg)))
      }
      return { pts, width: root.width }
    })
  }

  // The same shapes in 3D, for the solid view (?solid): four texels each,
  // world space, no projection.
  //   cone     [a, ra] [b, rb] [k, 0|2, 0, -1] [0]         2 marks hair
  //   ellipsoid [c, k] [x axis, rx] [y axis, ry] [z axis, rz]
  // Group bounding spheres let the ray-march skip a hand it isn't near.
  pack3D() {
    const D = (this.data3 ??= new Float32Array(MAX_PRIMS * 16))
    const J = this.byName
    let n = 0
    const groups = new Map(), order = []
    const push = (g, rows, pts) => {
      if (n >= MAX_PRIMS) return
      rows.forEach((r, i) => D.set(r, n * 16 + i * 4))
      if (!groups.has(g)) {
        groups.set(g, { start: n, count: 0, lo: [1e9, 1e9, 1e9], hi: [-1e9, -1e9, -1e9], k: 0 })
        order.push(g)
      }
      const G = groups.get(g)
      G.count++
      for (const [p, r] of pts)
        for (let i = 0; i < 3; i++) {
          G.lo[i] = Math.min(G.lo[i], p[i] - r)
          G.hi[i] = Math.max(G.hi[i], p[i] + r)
        }
      G.k = Math.max(G.k, rows[2][3] < 0 ? rows[2][0] : rows[0][3])
      n++
    }
    for (const sh of this.shapes) {
      const j = J[sh.j]
      const m = j.side
      if (sh.type === 0) {
        const a = add3(j.p, apply3(j.R, [sh.a[0] * m, sh.a[1], sh.a[2]]))
        const b = add3(j.p, apply3(j.R, [sh.b[0] * m, sh.b[1], sh.b[2]]))
        push(sh.g, [[...a, sh.ra], [...b, sh.rb], [sh.k, 0, 0, -1], [0, 0, 0, 0]], [[a, sh.ra], [b, sh.rb]])
      } else {
        const c = add3(j.p, apply3(j.R, [sh.c[0] * m, sh.c[1], sh.c[2]]))
        let R = j.R
        if (sh.e) R = mul3(R, euler(sh.e[0], sh.e[1] * m, sh.e[2] * m))
        const col = (i) => [R[i], R[3 + i], R[6 + i]]
        const rmax = Math.max(...sh.r)
        push(sh.g, [[...c, sh.k], [...col(0), sh.r[0]], [...col(1), sh.r[1]], [...col(2), sh.r[2]]], [[c, rmax]])
      }
    }
    for (const { pts, width } of this.hair) {
      const m = pts.length - 1
      const rad = (f) => width * Math.pow(1 - f, 1.4) + 0.0016
      for (let i = 0; i < m; i++) {
        const r0 = rad(i / m), r1 = rad((i + 1) / m)
        push('hair', [[...pts[i], r0], [...pts[i + 1], r1], [Math.max(0.0025, r0 * 1.5), 2, 0, -1], [0, 0, 0, 0]], [[pts[i], r0], [pts[i + 1], r1]])
      }
    }
    this.count3 = n
    this.groups3 = order.map((g) => {
      const G = groups.get(g)
      const c = G.lo.map((v, i) => (v + G.hi[i]) / 2)
      const r = Math.hypot(G.hi[0] - G.lo[0], G.hi[1] - G.lo[1], G.hi[2] - G.lo[2]) / 2
      return { c, r, k: G.k, start: G.start, count: G.count }
    })
    return this
  }

  // A point on the body to aim a camera at, from the current pose (a
  // development aid; see ?look in main.js).
  lookPoint(name) {
    const J = this.byName
    const at = (j, local) => (J[j]?.p ? add3(J[j].p, apply3(J[j].R, local)) : null)
    if (name === 'face') return at('head', [0, 0.065, 0.07])
    if (name === 'hand' || name === 'handR') return at('wristR', [0, -0.085, 0])
    if (name === 'handL') return at('wristL', [0, -0.085, 0])
    if (name === 'foot' || name === 'footR') return at('ankleR', [0, -0.04, 0.03])
    if (name === 'footL') return at('ankleL', [0, -0.04, 0.03])
    if (name === 'hair') {
      const pts = this.hair.flatMap((l) => l.pts)
      if (!pts.length) return null
      return scale3(pts.reduce((a, b) => add3(a, b), [0, 0, 0]), 1 / pts.length)
    }
    return at(name, [0, 0, 0])
  }

  // Project every shape to pixels and pack them for the shader:
  // capsule  [ax, ay, bx, by] [ra, rb, 0|2, k]
  // ellipse  [cx, cy, cos, sin] [rx, ry, 1, k]
  // where type 2 marks hair, which the light treats as translucent.
  project(cam) {
    const D = this.data
    let n = 0
    const groups = new Map()
    const J = this.byName
    const order = []
    const push = (g, a, b) => {
      if (n >= MAX_PRIMS) return
      D.set(a, n * 8)
      D.set(b, n * 8 + 4)
      if (!groups.has(g)) {
        groups.set(g, { start: n, count: 0, minX: 1e9, minY: 1e9, maxX: -1e9, maxY: -1e9, k: 0 })
        order.push(g)
      }
      const G = groups.get(g)
      G.count++
      n++
      return G
    }
    const grow = (G, x, y, r) => {
      G.minX = Math.min(G.minX, x - r)
      G.maxX = Math.max(G.maxX, x + r)
      G.minY = Math.min(G.minY, y - r)
      G.maxY = Math.max(G.maxY, y + r)
    }

    // the body hangs at the origin; its scale on screen is set by that depth
    this.pxPerM = cam.pxPerUnit / cam.project([0, 0, 0])[2]

    const capsule = (pa, pb, ra, rb, k, g, hair) => {
      const A = cam.project(pa)
      const B = cam.project(pb)
      const rA = (ra * cam.pxPerUnit) / A[2]
      const rB = (rb * cam.pxPerUnit) / B[2]
      const kp = k * this.pxPerM
      const G = push(g, [A[0], A[1], B[0], B[1]], [rA, rB, hair ? 2 : 0, kp])
      if (!G) return
      grow(G, A[0], A[1], rA)
      grow(G, B[0], B[1], rB)
      G.k = Math.max(G.k, kp)
    }

    for (const s of this.shapes) {
      const j = J[s.j]
      const mirror = j.side
      if (s.type === 0) {
        const a = [s.a[0] * mirror, s.a[1], s.a[2]]
        const b = [s.b[0] * mirror, s.b[1], s.b[2]]
        capsule(add3(j.p, apply3(j.R, a)), add3(j.p, apply3(j.R, b)), s.ra, s.rb, s.k, s.g, false)
      } else {
        const c = add3(j.p, apply3(j.R, [s.c[0] * mirror, s.c[1], s.c[2]]))
        let R = j.R
        if (s.e) R = mul3(R, euler(s.e[0], s.e[1] * mirror, s.e[2] * mirror))
        // camera-space axes, each scaled by its radius
        const RC = mul3(cam.R, R)
        const ax = [0, 1, 2].map((i) => [RC[0 + i] * s.r[i], RC[3 + i] * s.r[i]])
        // covariance of the orthographic shadow, then perspective scale
        let a = 0, b = 0, cc = 0
        for (const [x, y] of ax) {
          a += x * x
          b += x * y
          cc += y * y
        }
        const P = cam.project(c)
        const sc = cam.pxPerUnit / P[2]
        a *= sc * sc
        b *= sc * sc
        cc *= sc * sc
        const mid = (a + cc) / 2
        const rad = Math.sqrt(((a - cc) / 2) ** 2 + b * b)
        const l1 = mid + rad, l2 = Math.max(mid - rad, 1e-6)
        const ang = 0.5 * Math.atan2(2 * b, a - cc)
        const rx = Math.sqrt(l1), ry = Math.sqrt(l2)
        const kp = s.k * this.pxPerM
        const G = push(s.g, [P[0], P[1], Math.cos(ang), Math.sin(ang)], [rx, ry, 1, kp])
        if (!G) continue
        grow(G, P[0], P[1], rx)
        G.k = Math.max(G.k, kp)
      }
    }

    for (const { pts, width } of this.hair) {
      const m = pts.length - 1
      const rad = (f) => width * Math.pow(1 - f, 1.4) + 0.0016
      for (let i = 0; i < m; i++) {
        const r0 = rad(i / m), r1 = rad((i + 1) / m)
        // blend generously near the scalp so the locks read as one mass, and
        // barely at all toward the tips, where blending would bead the strand
        capsule(pts[i], pts[i + 1], r0, r1, Math.max(0.0025, r0 * 1.5), 'hair', true)
      }
    }

    this.count = n
    this.groups = order.map((g) => {
      const G = groups.get(g)
      const cx = (G.minX + G.maxX) / 2, cy = (G.minY + G.maxY) / 2
      return { cx, cy, r: Math.hypot(G.maxX - G.minX, G.maxY - G.minY) / 2, start: G.start, count: G.count, k: G.k }
    })

    const T = cam.project(this.torso)
    this.torsoPx = T
    return this
  }
}
