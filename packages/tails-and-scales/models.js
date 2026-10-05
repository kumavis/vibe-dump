import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// ---------------------------------------------------------------------------
// The miniatures. Every model is assembled from primitives in a chunky,
// faceted "painted plastic" style and stands on a round base with a rim in its
// army's colour. Models face +z; the origin is the centre of the base on the
// table. `userData.anim` holds the bits main.js wiggles: the bobbing body, the
// tail, the weapon arm, a trebuchet's throwing arm.
// ---------------------------------------------------------------------------

const mats = new Map()
export function M(color, opts = {}) {
  const key = color + JSON.stringify(opts)
  if (!mats.has(key)) mats.set(key, new THREE.MeshStandardMaterial({ color, roughness: 0.72, flatShading: true, ...opts }))
  return mats.get(key)
}
const glowMat = (color) => M(color, { emissive: color, emissiveIntensity: 1.6, roughness: 0.3 })
const metal = (color) => M(color, { metalness: 0.65, roughness: 0.35 })

const G = {
  ico: new THREE.IcosahedronGeometry(1, 1),
  ico0: new THREE.IcosahedronGeometry(1, 0),
  sph: new THREE.SphereGeometry(1, 10, 8),
  box: new THREE.BoxGeometry(1, 1, 1),
  cyl: new THREE.CylinderGeometry(1, 1, 1, 10),
  cone: new THREE.ConeGeometry(1, 1, 8),
  cap: new THREE.SphereGeometry(1, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2),
  // closes a `cap` from underneath: same 12 rim vertices, facing down
  brim: new THREE.CircleGeometry(1, 12).rotateX(Math.PI / 2),
  oct: new THREE.OctahedronGeometry(1, 0),
}

function part(geo, mat, x = 0, y = 0, z = 0, sx = 1, sy = sx, sz = sx) {
  const m = new THREE.Mesh(geo, mat)
  m.position.set(x, y, z)
  m.scale.set(sx, sy, sz)
  m.castShadow = true
  return m
}
// A cylinder from point a to point b.
function rod(a, b, r, mat) {
  const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b)
  const m = part(G.cyl, mat)
  m.position.copy(A).add(B).multiplyScalar(0.5)
  m.scale.set(r, A.distanceTo(B), r)
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize())
  return m
}

export function base(r, sideColor) {
  const g = new THREE.Group()
  const b = part(new THREE.CylinderGeometry(r, r * 1.05, 0.09, 28), M('#262422'), 0, 0.045, 0)
  b.receiveShadow = true
  const top = part(new THREE.CylinderGeometry(r * 0.96, r * 0.96, 0.012, 28), M('#4c5e2c', { flatShading: false }), 0, 0.094, 0)
  top.receiveShadow = true
  const rim = part(new THREE.TorusGeometry(r * 1.02, 0.028, 4, 32).rotateX(Math.PI / 2), M(sideColor, { emissive: sideColor, emissiveIntensity: 0.35 }), 0, 0.07, 0)
  g.add(b, top, rim)
  // flock: a few tufts of static grass
  for (let i = 0; i < Math.round(r * 9); i++) {
    const a = Math.random() * 6, d = Math.sqrt(Math.random()) * r * 0.85
    g.add(part(G.cone, M('#6a8a3a'), Math.cos(a) * d, 0.13, Math.sin(a) * d, 0.035, 0.08, 0.035))
  }
  return g
}

// Tapered tube along a curve: the serpent bodies.
function taperTube(points, r0, r1, mat, radial = 8, segs = 40) {
  const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)))
  const frames = curve.computeFrenetFrames(segs, false)
  const pos = [], idx = []
  for (let i = 0; i <= segs; i++) {
    const t = i / segs
    const P = curve.getPointAt(t)
    const r = r0 + (r1 - r0) * Math.pow(t, 0.6)
    const N = frames.normals[i], Bn = frames.binormals[i]
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2
      const cx = Math.cos(a), sx = Math.sin(a)
      pos.push(P.x + r * (cx * N.x + sx * Bn.x), P.y + r * (cx * N.y + sx * Bn.y), P.z + r * (cx * N.z + sx * Bn.z))
    }
  }
  // Each ring winds counter-clockwise about the tangent (three's Frenet
  // binormal is T×N), so this order puts the front faces on the outside.
  for (let i = 0; i < segs; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j, b = a + radial + 1
      idx.push(a, a + 1, b, b, a + 1, b + 1)
    }
  }
  // close the tail tip with a little fan facing back along the curve
  const tip = curve.getPointAt(0)
  const c = pos.length / 3
  pos.push(tip.x, tip.y, tip.z)
  for (let j = 0; j < radial; j++) idx.push(c, j + 1, j)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  const m = new THREE.Mesh(geo, mat)
  m.castShadow = true
  return m
}

// ── Squirrel-folk ───────────────────────────────────────────────────────────
function squirrel({ fur = '#c96a2d', belly = '#f1dcb5', hat = 'acorn', hatColor = '#6e4a2a', tailUp = 1 } = {}) {
  const root = new THREE.Group()
  const body = new THREE.Group()
  root.add(body)
  const F = M(fur), B = M(belly), dark = M('#1b1410')
  // feet & haunches
  for (const s of [-1, 1]) {
    body.add(part(G.ico, F, s * 0.1, 0.05, 0.07, 0.08, 0.045, 0.13))
    body.add(part(G.ico, F, s * 0.12, 0.17, -0.02, 0.14))
  }
  body.add(part(G.ico, F, 0, 0.38, 0, 0.21, 0.28, 0.19))
  body.add(part(G.ico, B, 0, 0.36, 0.1, 0.14, 0.2, 0.09))
  // head
  const head = new THREE.Group()
  head.position.set(0, 0.72, 0.05)
  body.add(head)
  head.add(part(G.ico, F, 0, 0, 0, 0.17))
  head.add(part(G.ico, B, 0, -0.05, 0.12, 0.09, 0.075, 0.08))
  head.add(part(G.sph, dark, 0, -0.02, 0.2, 0.028))
  for (const s of [-1, 1]) {
    head.add(part(G.sph, dark, s * 0.075, 0.04, 0.13, 0.034))
    head.add(part(G.sph, M('#ffffff'), s * 0.068, 0.055, 0.155, 0.01))
    const ear = part(G.cone, F, s * 0.09, 0.16, -0.02, 0.05, 0.13, 0.04)
    ear.rotation.z = -s * 0.25
    head.add(ear)
    const tuft = part(G.cone, M(shade(fur, -0.25)), s * 0.1, 0.25, -0.02, 0.025, 0.07, 0.02)
    tuft.rotation.z = -s * 0.3
    head.add(tuft)
  }
  if (hat === 'acorn') {
    head.add(part(G.cap, M(hatColor), 0, 0.07, 0, 0.19, 0.13, 0.19))
    head.add(part(G.brim, M(hatColor), 0, 0.07, 0, 0.19, 1, 0.19))
    head.add(part(G.cyl, M(shade(hatColor, -0.2)), 0, 0.22, 0, 0.02, 0.06, 0.02))
  }
  // tail: a chain of fluffy lumps along a rising curl
  const tail = new THREE.Group()
  tail.position.set(0, 0.22, -0.18)
  body.add(tail)
  const curve = new THREE.CatmullRomCurve3([
    [0, 0, 0], [0, 0.2, -0.26], [0, 0.55 * tailUp, -0.32], [0, 0.82 * tailUp, -0.22], [0, 0.93 * tailUp, -0.02],
  ].map((p) => new THREE.Vector3(...p)))
  // twelve overlapping lumps, fattest in the middle, paler toward the tip
  const T = M(shade(fur, 0.08)), tip = M(shade(fur, 0.2))
  const N = 12
  for (let i = 0; i < N; i++) {
    const k = i / (N - 1)
    const r = 0.085 + Math.sin(Math.min(1, k * 1.15) * Math.PI) * 0.11
    const p = curve.getPointAt(k)
    tail.add(part(G.ico, k > 0.75 ? tip : T, p.x, p.y, p.z, r, r * 1.1, r))
  }
  // arms (pivot at the shoulder; the hand is the end of the arm)
  const arms = []
  for (const s of [-1, 1]) {
    const arm = new THREE.Group()
    arm.position.set(s * 0.17, 0.52, 0.04)
    arm.add(part(G.ico, F, 0, -0.1, 0, 0.05, 0.12, 0.05))
    const hand = new THREE.Group()
    hand.position.set(0, -0.21, 0)
    hand.add(part(G.ico, F, 0, 0, 0, 0.045))
    arm.add(hand)
    arm.userData.hand = hand
    arm.rotation.x = -0.9
    body.add(arm)
    arms.push(arm)
  }
  root.userData.anim = { kind: 'squirrel', body, tail, head, armL: arms[0], armR: arms[1] }
  return root
}

// ── Serpent-folk ────────────────────────────────────────────────────────────
function naga({ scale = '#3f8f4a', belly = '#d9cf86', hood = null, hoodSize = 1, long = false, thick = 1 } = {}) {
  const root = new THREE.Group()
  const body = new THREE.Group()
  root.add(body)
  const S = M(scale), B = M(belly)
  // lower body: a coil on the base, or a long S-curve trailing behind
  let pts
  if (long) {
    pts = [[0.05, 0.05, -0.9], [-0.18, 0.06, -0.62], [0.16, 0.07, -0.34], [-0.06, 0.1, -0.08], [0, 0.26, 0.02], [0, 0.4, 0.03]]
  } else {
    pts = []
    for (let i = 0; i <= 10; i++) {
      const t = i / 10
      const a = -0.6 + t * Math.PI * 2.3
      const r = 0.3 - t * 0.17
      pts.push([Math.cos(a) * r, 0.06 + t * 0.1, Math.sin(a) * r - 0.04])
    }
    pts.push([0, 0.3, 0.02], [0, 0.42, 0.03])
  }
  body.add(taperTube(pts, 0.025, 0.115 * thick, S))
  // torso
  const torso = part(new THREE.CapsuleGeometry(0.12 * thick, 0.2, 3, 8), S, 0, 0.53, 0.04)
  torso.rotation.x = 0.12
  body.add(torso)
  body.add(part(G.ico, B, 0, 0.5, 0.12 * thick, 0.085 * thick, 0.17, 0.05))
  // head
  const head = new THREE.Group()
  head.position.set(0, 0.79, 0.08)
  body.add(head)
  if (hood) {
    const h = part(G.ico, M(hood), 0, -0.02, -0.07, 0.21 * hoodSize, 0.24 * hoodSize, 0.05)
    head.add(h)
    // eye-spots on the back of the hood
    for (const s of [-1, 1]) head.add(part(G.sph, M(belly), s * 0.08 * hoodSize, 0.02, -0.12, 0.035 * hoodSize, 0.035 * hoodSize, 0.01))
  }
  head.add(part(G.ico, S, 0, 0, 0.02, 0.11, 0.09, 0.15))
  head.add(part(G.ico, B, 0, -0.04, 0.06, 0.08, 0.04, 0.11))
  for (const s of [-1, 1]) {
    head.add(part(G.sph, M('#ffd23a', { emissive: '#b08000', emissiveIntensity: 0.4 }), s * 0.065, 0.035, 0.09, 0.03))
    head.add(part(G.sph, M('#111111'), s * 0.079, 0.037, 0.1, 0.008, 0.024, 0.012))
  }
  const tongue = new THREE.Group()
  tongue.position.set(0, -0.03, 0.16)
  for (const s of [-1, 1]) {
    const f = part(G.cyl, M('#d0304a'), s * 0.012, 0, 0.05, 0.008, 0.1, 0.008)
    f.rotation.x = Math.PI / 2
    f.rotation.z = s * 0.3
    tongue.add(f)
  }
  tongue.scale.setScalar(0.001)
  head.add(tongue)
  // arms
  const arms = []
  for (const s of [-1, 1]) {
    const arm = new THREE.Group()
    arm.position.set(s * 0.15 * thick, 0.64, 0.05)
    arm.add(part(G.ico, S, 0, -0.1, 0, 0.045 * thick, 0.12, 0.045 * thick))
    const hand = new THREE.Group()
    hand.position.set(0, -0.21, 0)
    hand.add(part(G.ico, S, 0, 0, 0, 0.042 * thick))
    arm.add(hand)
    arm.userData.hand = hand
    arm.rotation.x = -0.9
    body.add(arm)
    arms.push(arm)
  }
  root.userData.anim = { kind: 'naga', body, head, tongue, armL: arms[0], armR: arms[1] }
  return root
}

// ── Kit ─────────────────────────────────────────────────────────────────────
const wood = () => M('#7a5232')
function spear(len = 1.1, tip = '#c9a24a') {
  const g = new THREE.Group()
  g.add(part(G.cyl, wood(), 0, 0, 0, 0.022, len, 0.022))
  g.add(part(G.cone, metal(tip), 0, len / 2 + 0.07, 0, 0.04, 0.14, 0.04))
  return g
}
function roundShield(r, color, boss) {
  const g = new THREE.Group()
  const s = part(G.cyl, color, 0, 0, 0, r, 0.04, r)
  s.rotation.x = Math.PI / 2
  g.add(s)
  g.add(part(G.sph, boss, 0, 0, 0.03, r * 0.25, r * 0.25, r * 0.15))
  return g
}
const shade = (hex, k) => {
  const c = new THREE.Color(hex)
  const hsl = {}
  c.getHSL(hsl)
  c.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l + k)))
  return '#' + c.getHexString()
}
function hold(arm, obj, rx = 0.9) {
  arm.userData.hand.add(obj)
  obj.rotation.x = rx
}

function wheel(r, x, y, z) {
  const w = new THREE.Group()
  const rim = part(G.cyl, M('#5a3a22'), 0, 0, 0, r, 0.1, r)
  rim.rotation.z = Math.PI / 2
  const hub = part(G.cyl, metal('#444'), 0, 0, 0, r * 0.3, 0.13, r * 0.3)
  hub.rotation.z = Math.PI / 2
  w.add(rim, hub)
  w.position.set(x, y, z)
  return w
}

// ── The twelve unit types ───────────────────────────────────────────────────
const BUILDERS = {
  nutkin() {
    const m = squirrel({ fur: '#cf6d2a', hatColor: '#6a4a26' })
    const a = m.userData.anim
    // leaf cloak
    const cloak = part(G.cone, M('#5f8f2e'), 0, 0.45, -0.06, 0.25, 0.42, 0.2)
    cloak.rotation.x = 0.15
    a.body.add(cloak)
    // slingshot
    const sl = new THREE.Group()
    sl.add(rod([0, -0.08, 0], [0, 0.04, 0], 0.018, wood()))
    sl.add(rod([0, 0.04, 0], [-0.05, 0.13, 0], 0.014, wood()))
    sl.add(rod([0, 0.04, 0], [0.05, 0.13, 0], 0.014, wood()))
    hold(a.armR, sl, 1.4)
    a.armR.rotation.x = -1.3
    return m
  },
  grenadier() {
    const m = squirrel({ fur: '#a9552a', hatColor: '#4f3a22' })
    const a = m.userData.anim
    const strap = part(new THREE.TorusGeometry(0.21, 0.025, 4, 16), M('#4a3020'), 0, 0.4, 0.02)
    strap.rotation.set(0.1, 0, 0.75)
    strap.scale.z = 0.8
    a.body.add(strap)
    for (let i = 0; i < 4; i++) {
      const t = -0.7 + i * 0.45
      a.body.add(part(G.sph, M('#8a5a2a'), Math.sin(t) * 0.21 * 0.7, 0.4 + Math.cos(t) * 0.21 * 0.7, 0.17, 0.045, 0.055, 0.045))
    }
    // goggles
    for (const s of [-1, 1]) a.head.add(part(new THREE.TorusGeometry(0.04, 0.012, 4, 10), metal('#c9a24a'), s * 0.07, 0.07, 0.14))
    // lit acorn bomb, arm cocked back
    const bomb = new THREE.Group()
    bomb.add(part(G.sph, M('#8a5a2a'), 0, 0, 0, 0.06, 0.07, 0.06))
    bomb.add(part(G.cap, M('#4f3a22'), 0, 0.03, 0, 0.065, 0.04, 0.065))
    bomb.add(part(G.sph, glowMat('#ffb030'), 0, 0.1, 0, 0.022))
    hold(a.armR, bomb, 0)
    a.armR.rotation.x = 2.3
    return m
  },
  oakguard() {
    const m = squirrel({ fur: '#8a5a35', hatColor: '#5a3c22' })
    const a = m.userData.anim
    a.body.add(part(G.ico, M('#5b4330'), 0, 0.42, 0.05, 0.2, 0.22, 0.16))
    // plume
    const plume = part(G.cone, M('#c0302a'), 0, 0.3, -0.05, 0.03, 0.18, 0.08)
    plume.rotation.x = -0.5
    a.head.add(plume)
    const sh = roundShield(0.22, M('#6b4a2e'), M('#3e7a2a'))
    hold(a.armL, sh, 0.9)
    sh.position.set(-0.02, 0, 0.08)
    a.armL.rotation.set(-0.6, 0, 0.3)
    const hal = new THREE.Group()
    hal.add(part(G.cyl, wood(), 0, 0.2, 0, 0.022, 1.15, 0.022))
    hal.add(part(G.box, metal('#a8b0b8'), 0.07, 0.62, 0, 0.12, 0.16, 0.02))
    hal.add(part(G.cone, M('#6b4a26'), 0, 0.85, 0, 0.06, 0.18, 0.06))
    hold(a.armR, hal, 0.9)
    return m
  },
  glider() {
    const m = squirrel({ fur: '#9a8a78', belly: '#efe5d5', hat: 'none', tailUp: 0.25 })
    const a = m.userData.anim
    for (const s of [-1, 1]) a.head.add(part(new THREE.TorusGeometry(0.045, 0.015, 4, 10), metal('#c9a24a'), s * 0.07, 0.07, 0.14))
    a.head.add(part(G.cap, M('#6b4a2e'), 0, 0.06, -0.01, 0.18, 0.11, 0.18))
    a.head.add(part(G.brim, M('#6b4a2e'), 0, 0.06, -0.01, 0.18, 1, 0.18))
    // arms flung wide, the patagium stretched from wrist to ankle
    a.armL.rotation.set(-0.2, 0, -1.25)
    a.armR.rotation.set(-0.2, 0, 1.25)
    const mem = M(shade('#9a8a78', -0.12), { side: THREE.DoubleSide })
    for (const s of [-1, 1]) {
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.Float32BufferAttribute([
        s * 0.15, 0.52, 0.02, s * 0.42, 0.45, 0.02, s * 0.2, 0.1, 0.0,
        s * 0.15, 0.52, 0.02, s * 0.2, 0.1, 0.0, s * 0.12, 0.25, 0.0,
      ], 3))
      geo.computeVertexNormals()
      const w = new THREE.Mesh(geo, mem)
      w.castShadow = true
      a.body.add(w)
    }
    // fly them on a clear flight stand
    a.body.position.y = 0.7
    a.body.rotation.x = 0.55
    a.lift = 0.7
    m.add(part(G.cyl, M('#cfe8ff', { transparent: true, opacity: 0.35 }), 0, 0.42, 0, 0.025, 0.66, 0.025))
    a.tail.rotation.x = -0.6
    return m
  },
  trebuchet() {
    const root = new THREE.Group()
    const body = new THREE.Group()
    root.add(body)
    const W = M('#7a5232'), Wd = M('#5f3e24')
    for (const s of [-1, 1]) {
      body.add(part(G.box, Wd, s * 0.38, 0.2, 0, 0.1, 0.1, 1.6))
      body.add(rod([s * 0.38, 0.2, -0.55], [s * 0.38, 1.25, 0], 0.045, W))
      body.add(rod([s * 0.38, 0.2, 0.55], [s * 0.38, 1.25, 0], 0.045, W))
    }
    body.add(part(G.box, Wd, 0, 0.2, 0.6, 0.86, 0.08, 0.1))
    body.add(part(G.box, Wd, 0, 0.2, -0.6, 0.86, 0.08, 0.1))
    const axle = part(G.cyl, metal('#555'), 0, 1.25, 0, 0.04, 0.9, 0.04)
    axle.rotation.z = Math.PI / 2
    body.add(axle)
    const wheels = []
    for (const s of [-1, 1]) for (const z of [-0.6, 0.6]) {
      const w = wheel(0.17, s * 0.5, 0.17, z)
      body.add(w)
      wheels.push(w)
    }
    // the throwing arm pivots on the axle; the counterweight is a bucket of acorns
    const arm = new THREE.Group()
    arm.position.set(0, 1.25, 0)
    arm.add(part(G.box, W, 0, 0, 0.35, 0.08, 0.08, 1.7))
    const bucket = part(G.box, Wd, 0, -0.18, -0.45, 0.32, 0.3, 0.3)
    arm.add(bucket)
    for (let i = 0; i < 5; i++) arm.add(part(G.sph, M('#8a5a2a'), (Math.random() - 0.5) * 0.2, -0.02, -0.45 + (Math.random() - 0.5) * 0.2, 0.06))
    const pine = part(G.cone, M('#6b4a26'), 0, 0, 1.25, 0.11, 0.24, 0.11)
    pine.rotation.x = Math.PI / 2
    arm.add(pine)
    arm.add(part(G.sph, glowMat('#ff8a2a'), 0, 0.06, 1.25, 0.05))
    arm.rotation.x = 0.75 // sling end low and toward the back... loaded
    arm.rotation.y = Math.PI
    body.add(arm)
    for (const s of [-1, 1]) {
      const crew = squirrel({ fur: '#c96a2d' })
      crew.scale.setScalar(0.72)
      crew.position.set(s * 0.72, 0.05, -0.25)
      crew.rotation.y = -s * 0.5
      crew.userData.anim.armR.rotation.x = -2.2
      body.add(crew)
    }
    arm.userData.keep = true
    for (const w of wheels) w.userData.keep = true
    root.userData.anim = { kind: 'machine', body, wheels, throwArm: arm, rest: 0.75 }
    return root
  },
  elder() {
    const m = squirrel({ fur: '#a9a197', belly: '#f4efe6', hat: 'none' })
    const a = m.userData.anim
    m.scale.setScalar(1.28)
    const robe = part(new THREE.ConeGeometry(0.3, 0.55, 10, 1, true), M('#5a6b34', { side: THREE.DoubleSide }), 0, 0.3, 0)
    a.body.add(robe)
    a.head.add(part(G.cone, M('#f4efe6'), 0, -0.14, 0.15, 0.06, 0.16, 0.04).rotateX(Math.PI))
    for (let i = 0; i < 7; i++) {
      const t = (i / 7) * Math.PI * 2
      const leaf = part(G.cone, M(i % 2 ? '#d08a2c' : '#6aa646'), Math.cos(t) * 0.15, 0.12, Math.sin(t) * 0.15, 0.035, 0.12, 0.02)
      leaf.rotation.set(Math.sin(t) * 0.4, 0, -Math.cos(t) * 0.4)
      a.head.add(leaf)
    }
    const staff = new THREE.Group()
    staff.add(part(G.cyl, M('#5a3d24'), 0, 0.25, 0, 0.025, 1.0, 0.025))
    staff.add(part(G.oct, glowMat('#7dff8a'), 0, 0.82, 0, 0.07, 0.11, 0.07))
    for (let i = 0; i < 3; i++) {
      const t = (i / 3) * Math.PI * 2
      staff.add(rod([0, 0.7, 0], [Math.cos(t) * 0.07, 0.86, Math.sin(t) * 0.07], 0.012, M('#5a3d24')))
    }
    hold(a.armL, staff, 0.9)
    a.armL.rotation.x = -0.6
    a.gem = staff.children[1]
    a.gem.userData.keep = true
    return m
  },

  scaleguard() {
    const m = naga({ scale: '#3f8f4a', belly: '#d9cf86' })
    const a = m.userData.anim
    a.head.add(part(G.cap, metal('#b8862e'), 0, 0.04, 0.01, 0.12, 0.09, 0.15))
    a.head.add(part(G.brim, metal('#b8862e'), 0, 0.04, 0.01, 0.12, 1, 0.15))
    a.head.add(part(G.box, metal('#b8862e'), 0, 0.12, -0.02, 0.015, 0.06, 0.18))
    hold(a.armR, spear(1.15), 0.9)
    const sh = roundShield(0.2, metal('#a8762a'), metal('#e0b050'))
    hold(a.armL, sh, 0.9)
    sh.position.z = 0.06
    a.armL.rotation.set(-0.7, 0, 0.35)
    return m
  },
  spitter() {
    const m = naga({ scale: '#2f8f86', belly: '#e0d890', hood: '#5a2f7a', hoodSize: 1.45 })
    const a = m.userData.anim
    a.head.add(part(G.sph, glowMat('#8aff5a'), 0, -0.04, 0.16, 0.035))
    a.body.add(part(G.ico, M('#7a8a3a'), 0.17, 0.38, 0.05, 0.08, 0.1, 0.08))
    a.body.add(part(G.sph, glowMat('#8aff5a'), 0.17, 0.48, 0.05, 0.03))
    a.armL.rotation.x = -0.5
    a.armR.rotation.x = -0.5
    return m
  },
  sidewinder() {
    const m = naga({ scale: '#c2a061', belly: '#efe0b0', long: true })
    const a = m.userData.anim
    for (let i = 0; i < 6; i++) a.body.add(part(G.oct, M('#6b4a2a'), 0, 0.12 + i * 0.07, -0.05 - i * 0.02, 0.04, 0.03, 0.04))
    for (const s of [-1, 1]) {
      const horn = part(G.cone, M('#8a6a3a'), s * 0.06, 0.08, 0.05, 0.02, 0.07, 0.02)
      horn.rotation.z = -s * 0.4
      a.head.add(horn)
      const sick = part(new THREE.TorusGeometry(0.13, 0.014, 4, 12, Math.PI * 0.9), metal('#c8ccd0'), 0, 0.08, 0.08)
      sick.rotation.y = Math.PI / 2
      hold(s < 0 ? a.armL : a.armR, sick, 0.4)
    }
    a.armL.rotation.set(-1.3, 0, 0.3)
    a.armR.rotation.set(-1.3, 0, -0.3)
    a.body.rotation.x = 0.12
    return m
  },
  brute() {
    const m = naga({ scale: '#4f6e2a', belly: '#c8b870', thick: 1.35 })
    const a = m.userData.anim
    m.scale.setScalar(2.15)
    for (let i = 0; i < 7; i++) {
      const sp = part(G.cone, M('#e8dcc0'), 0, 0.45 + i * 0.06, -0.12 - (i < 3 ? 0 : (i - 3) * 0.01), 0.02, 0.07, 0.02)
      sp.rotation.x = -1.1
      a.body.add(sp)
    }
    for (const s of [-1, 1]) {
      const horn = part(G.cone, M('#e8dcc0'), s * 0.07, 0.08, -0.03, 0.025, 0.12, 0.025)
      horn.rotation.set(-0.6, 0, -s * 0.6)
      a.head.add(horn)
      a.body.add(part(new THREE.TorusGeometry(0.06, 0.015, 4, 10).rotateX(Math.PI / 2), metal('#b8862e'), s * 0.2, 0.5, 0.05))
    }
    a.armL.rotation.set(-1.2, 0, 0.5)
    a.armR.rotation.set(-1.2, 0, -0.5)
    return m
  },
  engine() {
    const root = new THREE.Group()
    const body = new THREE.Group()
    root.add(body)
    const W = M('#4a3a2a'), Wd = M('#3a2c20')
    body.add(part(G.box, W, 0, 0.36, 0, 0.8, 0.22, 1.35))
    const wheels = []
    for (const s of [-1, 1]) for (const z of [-0.45, 0.45]) {
      const w = wheel(0.21, s * 0.47, 0.21, z)
      body.add(w)
      wheels.push(w)
    }
    // the basilisk figurehead
    const skull = part(G.ico, M('#d8cfb0'), 0, 0.55, 0.78, 0.2, 0.16, 0.28)
    body.add(skull)
    for (const s of [-1, 1]) {
      body.add(part(G.cone, M('#f4ecd8'), s * 0.09, 0.43, 0.92, 0.025, 0.12, 0.025).rotateX(Math.PI))
      body.add(part(G.sph, glowMat('#8aff5a'), s * 0.1, 0.62, 0.88, 0.035))
    }
    // the throwing arm & its glowing globe
    for (const s of [-1, 1]) body.add(rod([s * 0.3, 0.45, -0.3], [s * 0.2, 1.05, -0.1], 0.04, Wd))
    const arm = new THREE.Group()
    arm.position.set(0, 1.05, -0.1)
    arm.add(part(G.box, W, 0, 0, 0.35, 0.08, 0.08, 0.9))
    // an open bowl, seen from its open side: draw the inside too
    arm.add(part(G.cap, M('#3a2c20', { side: THREE.DoubleSide }), 0, 0.02, 0.8, 0.14, 0.08, 0.14).rotateX(Math.PI))
    const globe = part(G.sph, M('#7dff5a', { emissive: '#4ad02a', emissiveIntensity: 1.1, transparent: true, opacity: 0.85, roughness: 0.15 }), 0, 0.12, 0.8, 0.14)
    globe.userData.keep = true
    arm.add(globe)
    arm.rotation.x = -0.55
    body.add(arm)
    for (let i = 0; i < 3; i++) body.add(part(G.sph, M('#7dff5a', { emissive: '#3ab02a', emissiveIntensity: 0.9 }), -0.2 + i * 0.2, 0.55, -0.55, 0.08))
    for (const s of [-1, 1]) {
      const crew = naga({ scale: '#3f8f4a', belly: '#d9cf86' })
      crew.scale.setScalar(0.72)
      crew.position.set(s * 0.72, 0.05, -0.35)
      crew.rotation.y = -s * 0.5
      body.add(crew)
    }
    arm.userData.keep = true
    for (const w of wheels) w.userData.keep = true
    root.userData.anim = { kind: 'machine', body, wheels, throwArm: arm, rest: -0.55, globe }
    return root
  },
  hierophant() {
    const m = naga({ scale: '#5e3a8c', belly: '#e6c870', hood: '#3a2060', hoodSize: 1.7 })
    const a = m.userData.anim
    m.scale.setScalar(1.32)
    for (let i = 0; i < 5; i++) {
      const t = (i / 4 - 0.5) * 1.6
      const sp = part(G.cone, metal('#e0b040'), Math.sin(t) * 0.1, 0.12 + Math.cos(t) * 0.04, -0.02, 0.02, 0.12, 0.02)
      sp.rotation.z = -t * 0.5
      a.head.add(sp)
    }
    for (const s of [-1, 1]) a.body.add(part(new THREE.TorusGeometry(0.05, 0.014, 4, 10).rotateX(Math.PI / 2), metal('#e0b040'), s * 0.15, 0.45, 0.05))
    const staff = new THREE.Group()
    staff.add(part(G.cyl, M('#2a1a40'), 0, 0.25, 0, 0.022, 1.0, 0.022))
    staff.add(part(G.sph, glowMat('#c070ff'), 0, 0.82, 0, 0.08))
    staff.add(part(new THREE.TorusGeometry(0.1, 0.012, 4, 14), metal('#e0b040'), 0, 0.82, 0))
    hold(a.armL, staff, 0.9)
    a.armL.rotation.x = -0.6
    a.gem = staff.children[1]
    a.gem.userData.keep = true
    return m
  },
}

export function buildModel(key, t, sideColor) {
  const root = new THREE.Group()
  root.add(base(t.base, sideColor))
  const fig = BUILDERS[key]()
  fig.position.y = t.big ? 0.09 : 0.06
  fig.userData.y0 = fig.position.y
  root.add(fig)
  root.userData.fig = fig
  root.userData.anim = fig.userData.anim
  root.userData.phase = Math.random() * 10
  bake(root.children[0])
  bake(fig)
  root.traverse((o) => {
    if (o.isMesh) o.castShadow = true
  })
  // baking replaced the base's meshes, so re-grant what part() can't know
  root.children[0].traverse((o) => {
    if (o.isMesh) o.receiveShadow = true
  })
  return root
}

// A miniature is ~40 primitives in a dozen colours. Bake everything that
// doesn't animate on its own into one vertex-coloured mesh per material class
// (plain, metal, glowing...), so a whole army costs a few hundred draw calls
// instead of several thousand. Subtrees marked `keep` (a trebuchet's arm, its
// wheels, a glowing gem) are baked separately and stay movable.
function flipWinding(geo) {
  for (const name of ['position', 'normal']) {
    const a = geo.getAttribute(name)
    for (let i = 0; i < a.count; i += 3) {
      const x = a.getX(i + 1), y = a.getY(i + 1), z = a.getZ(i + 1)
      a.setXYZ(i + 1, a.getX(i + 2), a.getY(i + 2), a.getZ(i + 2))
      a.setXYZ(i + 2, x, y, z)
    }
  }
}

const classMats = new Map()
function classKey(m) {
  return [m.metalness, m.roughness, m.emissiveIntensity > 0 ? m.emissive.getHex() : 0, m.emissiveIntensity, m.transparent, m.opacity, m.side, m.flatShading].join('|')
}
function bake(root) {
  root.updateMatrixWorld(true)
  const inv = new THREE.Matrix4().copy(root.matrixWorld).invert()
  const rel = new THREE.Matrix4()
  const classes = new Map()
  const doomed = []
  const walk = (o) => {
    for (const c of o.children) {
      if (c.userData.keep) {
        bake(c)
        continue
      }
      if (c.isMesh) {
        const m = c.material
        const key = classKey(m)
        if (!classes.has(key)) classes.set(key, { m, geos: [] })
        const src = c.geometry.index ? c.geometry.toNonIndexed() : c.geometry
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', src.getAttribute('position').clone())
        geo.setAttribute('normal', src.getAttribute('normal').clone())
        geo.applyMatrix4(rel.multiplyMatrices(inv, c.matrixWorld))
        // Baking bakes the transform into the vertices, so three can no longer
        // flip front faces for a mirrored (negative-scale) part. Do it here.
        if (rel.determinant() < 0) flipWinding(geo)
        const n = geo.getAttribute('position').count
        const col = new Float32Array(n * 3)
        for (let i = 0; i < n; i++) col.set([m.color.r, m.color.g, m.color.b], i * 3)
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
        classes.get(key).geos.push(geo)
        doomed.push(c)
      }
      walk(c)
    }
  }
  walk(root)
  for (const c of doomed) c.parent.remove(c)
  for (const [key, { m, geos }] of classes) {
    if (!classMats.has(key)) {
      classMats.set(key, new THREE.MeshStandardMaterial({
        vertexColors: true, metalness: m.metalness, roughness: m.roughness, flatShading: m.flatShading,
        emissive: m.emissive, emissiveIntensity: m.emissiveIntensity, transparent: m.transparent, opacity: m.opacity, side: m.side,
      }))
    }
    root.add(new THREE.Mesh(mergeGeometries(geos), classMats.get(key)))
  }
}
