// The Bushtail Clans' miniatures (DESIGN §1.1: models.js's squirrel-folk,
// R7): the squirrel body every one of them is built on, and the six unit
// types (data/races/squirrel.js's units, by key; the race's look.models
// names this kit). userData.anim holds the bits the view wiggles: the
// bobbing body, the tail, the weapon arm, a trebuchet's throwing arm.
// ((V2) squirrel() is exported too: the body alone is each splat-fur
// Bushtail's shadow, view/models/squirrel.js.)
import * as THREE from 'three'
import { M, glowMat, metal, G, part, rod, shade, wood, roundShield, hold, wheel } from '../kit.js'

// ── Squirrel-folk ───────────────────────────────────────────────────────────
export function squirrel({ fur = '#c96a2d', belly = '#f1dcb5', hat = 'acorn', hatColor = '#6e4a2a', tailUp = 1 } = {}) {
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

// ── The six unit types ──────────────────────────────────────────────────────
export const BUILDERS = {
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
    bomb.add(part(G.brim, M('#4f3a22'), 0, 0.03, 0, 0.065, 1, 0.065))
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
    // (heaped at random: each trebuchet its own, so view/models/cache.js
    // builds every one afresh rather than cloning a template)
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
}

// The builders that draw Math.random themselves (a trebuchet's heap of
// acorns: each its own), which view/models/cache.js makes no template of.
export const DRAWS = new Set([BUILDERS.trebuchet])
