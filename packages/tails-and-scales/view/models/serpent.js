// The Coil of Ssithra's miniatures (DESIGN §1.1: models.js's serpent-folk,
// R7): the naga body every one of them is built on, and the six unit types
// (data/races/serpent.js's units, by key; the race's look.models names this
// kit). userData.anim holds the bits the view wiggles: the swaying body, the
// head and tongue, an engine's throwing arm and its glowing globe.
import * as THREE from 'three'
import { M, glowMat, metal, G, part, rod, taperTube, spear, roundShield, hold, wheel } from './kit.js'

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

// ── The six unit types ──────────────────────────────────────────────────────
export const BUILDERS = {
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

// The builders that draw Math.random themselves, which view/models/cache.js
// makes no template of: none here (the squirrel kit's DRAWS).
export const DRAWS = new Set()
