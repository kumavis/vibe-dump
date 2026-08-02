// ---------------------------------------------------------------------------
// The crew.
//
// Boxy painted-metal robots in full site PPE: hard hat, hi-vis vest with two
// reflective bands, work boots, tool belt. The rig is deliberately plain —
// hips, torso, head and four two-bone limbs — because every pose in the app is
// just a set of joint rotations blended on top of a walk cycle.
//
// group origin is at the soles, +Z is the way the robot faces.
// ---------------------------------------------------------------------------

import * as THREE from 'three'
import { BRICK, MORTAR, COLORS } from './config.js'

const BOX = new THREE.BoxGeometry(1, 1, 1)
const CYL = new THREE.CylinderGeometry(0.5, 0.5, 1, 12)
const SPH = new THREE.SphereGeometry(0.5, 12, 8)

const _c = new THREE.Color()

/** Slightly scuffed paint: nudge lightness and saturation per robot. */
function scuff(hex, rng, amt = 0.08) {
  _c.setHex(hex)
  const hsl = {}
  _c.getHSL(hsl)
  _c.setHSL(
    hsl.h + (rng() - 0.5) * 0.02,
    Math.max(0, Math.min(1, hsl.s + (rng() - 0.5) * 0.12)),
    Math.max(0.04, Math.min(0.96, hsl.l + (rng() - 0.5) * amt)),
  )
  return _c.getHex()
}

function mat(color, opts = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.72, metalness: 0.12, ...opts })
}

/** A box part. Meshes are always leaves so pivots stay unscaled. */
function part(parent, material, sx, sy, sz, x = 0, y = 0, z = 0, geo = BOX) {
  const m = new THREE.Mesh(geo, material)
  m.scale.set(sx, sy, sz)
  m.position.set(x, y, z)
  m.castShadow = true
  parent.add(m)
  return m
}

function pivot(parent, x = 0, y = 0, z = 0) {
  const o = new THREE.Object3D()
  o.position.set(x, y, z)
  parent.add(o)
  return o
}

const lerp = (a, b, t) => a + (b - a) * t
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

/**
 * A tidy armful of whatever the robot has been sent to fetch. A mason carrying
 * rafters should be carrying rafters, not bricks — that is the whole point of
 * making them go to the right stock.
 */
export function buildCarryStack(matKey, count, colorList = COLORS.brick) {
  const g = new THREE.Group()
  const piece = {
    brick: { size: [BRICK.L - MORTAR, BRICK.H - MORTAR, BRICK.D - MORTAR], perRow: 2, gap: 0.012, color: null },
    cast: { size: [0.9, 0.07, 0.26], perRow: 1, gap: 0.02, color: COLORS.lintel },
    timber: { size: [1.5, 0.09, 0.14], perRow: 1, gap: 0.02, color: COLORS.timber },
    tile: { size: [0.44, 0.045, 0.38], perRow: 1, gap: 0.015, color: COLORS.tile[0] },
    joinery: { size: [0.8, 0.06, 0.62], perRow: 1, gap: 0.02, color: 0xe6eef4 },
  }[matKey] || { size: [0.3, 0.1, 0.2], perRow: 2, gap: 0.01, color: 0x999999 }

  const [pl, ph, pd] = piece.size
  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / piece.perRow)
    const col = i % piece.perRow
    const color = piece.color ?? colorList[i % colorList.length]
    const m = new THREE.Mesh(BOX, mat(color, { roughness: 0.9, metalness: 0 }))
    if (matKey === 'brick') {
      m.scale.set(pl * 0.92, ph, pd * 0.92)
      m.position.set((col - (piece.perRow - 1) / 2) * (pd * 1.02), row * (ph + piece.gap), ((i * 37) % 7) * 0.004 - 0.012)
      m.rotation.y = Math.PI / 2 + (((i * 13) % 5) - 2) * 0.012
    } else {
      // long stock rides across the arms
      m.scale.set(pl, ph, pd)
      m.position.set(0, row * (ph + piece.gap), (((i * 11) % 5) - 2) * 0.012)
      m.rotation.y = (((i * 7) % 5) - 2) * 0.006
    }
    m.castShadow = true
    g.add(m)
  }
  return g
}

/** Kept for callers that only ever wanted bricks. */
export function buildBrickStack(count, colorList = COLORS.brick) {
  return buildCarryStack('brick', count, colorList)
}

/**
 * Build one robot.
 * opts = { role, accent, hatColor, seed, rng }
 */
export function buildRobot({ role = 'mason', accent = 0xd8442f, hatColor = 0xf4b41a, rng = Math.random } = {}) {
  const group = new THREE.Group()
  // Yaw first, then pitch about the robot's own X — so a robot standing on a
  // roof slope leans into the pitch instead of toppling sideways.
  group.rotation.order = 'YXZ'

  const isForeman = role === 'foreman'
  const scale = 0.94 + rng() * 0.14
  const chassis = scuff(role === 'barrow' ? 0x8d97a3 : 0x9aa4b0, rng, 0.14)
  const dark = scuff(0x3c4249, rng, 0.1)
  const hiviz = isForeman ? 0xf2f24a : 0xf0a020

  const matBody = mat(chassis, { roughness: 0.5, metalness: 0.45 })
  const matDark = mat(dark, { roughness: 0.65, metalness: 0.3 })
  const matVest = mat(hiviz, { roughness: 0.85, metalness: 0 })
  const matBand = mat(0xe8eef2, { roughness: 0.28, metalness: 0.15, emissive: 0x1a2026 })
  const matAccent = mat(accent, { roughness: 0.6, metalness: 0.2 })
  const matHat = mat(hatColor, { roughness: 0.42, metalness: 0.05 })
  const matVisor = new THREE.MeshStandardMaterial({
    color: 0x0d1b22,
    emissive: 0x49d8ff,
    emissiveIntensity: 1.35,
    roughness: 0.25,
    metalness: 0.4,
  })
  const matRubber = mat(0x23272b, { roughness: 0.95, metalness: 0 })
  const matSteel = mat(0xb9c2c9, { roughness: 0.3, metalness: 0.8 })

  // --- proportions ---------------------------------------------------------
  const hipY = 0.6 + rng() * 0.04
  const thighLen = 0.27
  const shinLen = 0.25
  const torsoH = 0.48 + rng() * 0.05
  const shoulderY = torsoH * 0.86
  const shoulderW = 0.19 + rng() * 0.03
  const upperLen = 0.23
  const foreLen = 0.21
  const bodyW = 0.36 + rng() * 0.05
  const bodyD = 0.24

  // Kit the merchant's line puts on, in the order it goes on.
  const kit = { boots: [], vest: [], hat: [] }

  const root = pivot(group, 0, hipY)
  const torso = pivot(root, 0, 0)

  // --- torso ---------------------------------------------------------------
  part(root, matDark, bodyW * 0.92, 0.11, bodyD * 0.95, 0, -0.02) // pelvis
  part(torso, matBody, bodyW, torsoH, bodyD, 0, torsoH / 2)
  // hi-vis vest, worn open at the front
  kit.vest.push(part(torso, matVest, bodyW + 0.035, torsoH * 0.62, bodyD + 0.035, 0, torsoH * 0.44))
  if (isForeman) kit.vest.push(part(torso, matVest, bodyW + 0.03, 0.2, bodyD + 0.03, 0, torsoH * 0.06))
  for (const y of [torsoH * 0.3, torsoH * 0.56]) {
    kit.vest.push(part(torso, matBand, bodyW + 0.045, 0.035, bodyD + 0.045, 0, y))
  }
  kit.vest.push(part(torso, matAccent, 0.1, 0.11, 0.02, bodyW * 0.28, torsoH * 0.72, bodyD / 2 + 0.02))
  // crew tag on the back, so a shift change is legible at a glance
  kit.vest.push(part(torso, matAccent, 0.14, 0.1, 0.02, 0, torsoH * 0.52, -bodyD / 2 - 0.03))
  // tool belt
  part(torso, matDark, bodyW + 0.04, 0.06, bodyD + 0.04, 0, 0.04)
  part(torso, matSteel, 0.05, 0.09, 0.04, bodyW * 0.42, 0.02, bodyD / 2 - 0.02)

  // --- head ----------------------------------------------------------------
  const neck = pivot(torso, 0, torsoH)
  part(neck, matDark, 0.09, 0.05, 0.09, 0, 0.02)
  const headH = 0.24
  part(neck, matBody, 0.29, headH, 0.24, 0, 0.04 + headH / 2)
  const visor = part(neck, matVisor, 0.22, 0.075, 0.02, 0, 0.05 + headH * 0.62, 0.125)
  // hard hat: shell, brim, and a crown rib
  const hatY = 0.04 + headH + 0.035
  kit.hat.push(part(neck, matHat, 0.3, 0.13, 0.27, 0, hatY, 0, SPH))
  kit.hat.push(part(neck, matHat, 0.34, 0.028, 0.36, 0, hatY - 0.055))
  kit.hat.push(part(neck, matAccent, 0.05, 0.1, 0.28, 0, hatY + 0.02))
  if (rng() < 0.45) {
    // little aerial
    kit.hat.push(part(neck, matSteel, 0.012, 0.16, 0.012, 0.1, hatY + 0.1))
    kit.hat.push(part(neck, matAccent, 0.035, 0.035, 0.035, 0.1, hatY + 0.19, 0, SPH))
  } else {
    kit.hat.push(part(neck, matBand, 0.09, 0.035, 0.05, 0, hatY + 0.04, 0.13)) // head torch
  }
  if (rng() < 0.4) {
    for (const s of [-1, 1]) part(neck, matDark, 0.05, 0.09, 0.09, s * 0.16, 0.05 + headH * 0.55) // ear defenders
  }

  // --- limbs ---------------------------------------------------------------
  function arm(side) {
    const sh = pivot(torso, side * (bodyW / 2 + 0.035), shoulderY)
    part(sh, matAccent, 0.09, 0.09, 0.09, 0, 0, 0, SPH)
    part(sh, matBody, 0.1, upperLen, 0.11, 0, -upperLen / 2)
    const el = pivot(sh, 0, -upperLen)
    part(el, matDark, 0.075, 0.075, 0.075, 0, 0, 0, SPH)
    part(el, matBody, 0.09, foreLen, 0.1, 0, -foreLen / 2)
    const hand = pivot(el, 0, -foreLen)
    part(hand, matDark, 0.1, 0.09, 0.11, 0, -0.03)
    return { sh, el, hand }
  }
  const armL = arm(-1)
  const armR = arm(1)

  function leg(side) {
    const hp = pivot(root, side * (bodyW * 0.26), -0.06)
    part(hp, matBody, 0.13, thighLen, 0.14, 0, -thighLen / 2)
    const kn = pivot(hp, 0, -thighLen)
    part(kn, matAccent, 0.13, 0.05, 0.13, 0, 0.01) // knee pad
    part(kn, matBody, 0.11, shinLen, 0.12, 0, -shinLen / 2)
    const ft = pivot(kn, 0, -shinLen)
    kit.boots.push(part(ft, matRubber, 0.15, 0.09, 0.26, 0, -0.045, 0.045))
    kit.boots.push(part(ft, matDark, 0.16, 0.03, 0.24, 0, -0.085, 0.04))
    return { hp, kn, ft }
  }
  const legL = leg(-1)
  const legR = leg(1)

  // --- held kit ------------------------------------------------------------
  const trowel = new THREE.Group()
  part(trowel, matDark, 0.025, 0.09, 0.025)
  const blade = part(trowel, matSteel, 0.075, 0.012, 0.19, 0, -0.06, 0.09)
  blade.rotation.x = 0.12
  trowel.position.set(0, -0.06, 0.02)
  trowel.rotation.x = -0.4
  trowel.visible = false
  armR.hand.add(trowel)

  let clipboard = null
  if (isForeman) {
    clipboard = new THREE.Group()
    part(clipboard, mat(0xc79a5c, { roughness: 0.9 }), 0.2, 0.01, 0.26)
    part(clipboard, mat(0xf3efe2, { roughness: 0.95 }), 0.17, 0.008, 0.22, 0, 0.011, -0.01)
    part(clipboard, matSteel, 0.07, 0.012, 0.03, 0, 0.02, 0.1)
    clipboard.position.set(0, -0.08, 0.06)
    clipboard.rotation.x = -0.5
    armL.hand.add(clipboard)
  }

  /** Where an armful of bricks rides — forearms tucked against the chest. */
  const handAnchor = pivot(torso, 0, torsoH * 0.42, bodyD / 2 + 0.16)
  /** Where the barrow handles sit relative to the robot. */
  const barrowAnchor = pivot(group, 0, 0.62, 0.42)

  group.traverse((o) => {
    if (o.isMesh) o.castShadow = true
  })
  group.scale.setScalar(scale)

  const height = (hipY + torsoH + 0.04 + headH + 0.14) * scale
  const gaitOffset = rng() * Math.PI * 2
  const bobAmp = 0.012 + rng() * 0.008
  let phase = gaitOffset
  let waveT = 0

  // Every joint the poses touch, so a fresh frame always starts from rest.
  const rest = () => ({
    hipL: 0, hipR: 0, kneeL: 0, kneeR: 0,
    shLX: 0, shRX: 0, shLZ: 0.06, shRZ: -0.06,
    elL: -0.12, elR: -0.12,
    torsoX: 0.03, torsoY: 0, rootY: 0, rootZ: 0,
  })
  const p = rest()

  function update(dt, s = {}) {
    const speed = s.speed ?? 0
    const moving = !!s.moving && speed > 0.02
    const carry = s.carry ?? 0
    const wPush = clamp01(s.push ?? 0)
    const wLay = clamp01(s.lay ?? 0)
    const wReach = clamp01(s.reach ?? 0)
    const wIdle = clamp01(s.idle ?? 0)
    const wWave = clamp01(s.wave ?? 0)
    const wPaint = clamp01(s.paint ?? 0)
    const wHaul = clamp01(s.haul ?? 0)
    const wCarry = carry > 0 ? 1 : 0

    Object.assign(p, rest())

    // --- walk cycle: stride scales with speed so the feet don't skate -------
    if (moving) {
      const stride = Math.min(0.72, 0.34 + speed * 0.26)
      phase += dt * (speed / 0.42) * Math.PI
      const a = Math.sin(phase)
      const b = Math.cos(phase)
      p.hipL = a * stride
      p.hipR = -a * stride
      p.kneeL = -Math.max(0, -a) * 0.9 - 0.12
      p.kneeR = -Math.max(0, a) * 0.9 - 0.12
      p.shLX = -a * stride * 0.55
      p.shRX = a * stride * 0.55
      p.rootY = Math.abs(b) * bobAmp - bobAmp * 0.5
      p.torsoY = a * 0.06
      p.torsoX = 0.05 + speed * 0.04
    } else {
      phase += dt * 1.1
      p.rootY = Math.sin(phase * 0.8) * 0.004
    }

    // --- blends, weakest first so the strongest intent wins -----------------
    if (wIdle > 0) {
      p.shLX = lerp(p.shLX, -0.15, wIdle)
      p.shRX = lerp(p.shRX, -0.15, wIdle)
      p.shLZ = lerp(p.shLZ, 0.75, wIdle)
      p.shRZ = lerp(p.shRZ, -0.75, wIdle)
      p.elL = lerp(p.elL, -1.55, wIdle)
      p.elR = lerp(p.elR, -1.55, wIdle)
      p.torsoY = lerp(p.torsoY, Math.sin(phase * 0.5) * 0.12, wIdle)
    }
    if (wCarry > 0) {
      p.shLX = lerp(p.shLX, -1.25, wCarry)
      p.shRX = lerp(p.shRX, -1.25, wCarry)
      p.shLZ = lerp(p.shLZ, 0.22, wCarry)
      p.shRZ = lerp(p.shRZ, -0.22, wCarry)
      p.elL = lerp(p.elL, -1.15, wCarry)
      p.elR = lerp(p.elR, -1.15, wCarry)
      p.torsoX = lerp(p.torsoX, -0.1, wCarry) // leaning back under the weight
    }
    if (wPush > 0) {
      p.shLX = lerp(p.shLX, -1.05, wPush)
      p.shRX = lerp(p.shRX, -1.05, wPush)
      p.shLZ = lerp(p.shLZ, 0.12, wPush)
      p.shRZ = lerp(p.shRZ, -0.12, wPush)
      p.elL = lerp(p.elL, -0.18, wPush)
      p.elR = lerp(p.elR, -0.18, wPush)
      p.torsoX = lerp(p.torsoX, 0.26, wPush)
    }
    if (wReach > 0) {
      p.shLX = lerp(p.shLX, -2.35, wReach)
      p.shRX = lerp(p.shRX, -2.5, wReach)
      p.elL = lerp(p.elL, -0.2, wReach)
      p.elR = lerp(p.elR, -0.15, wReach)
      p.torsoX = lerp(p.torsoX, -0.16, wReach)
      p.kneeL = lerp(p.kneeL, -0.05, wReach)
      p.kneeR = lerp(p.kneeR, -0.05, wReach)
    }
    if (wLay > 0) {
      // knees bent, weight forward, right hand setting the brick
      const dip = Math.sin(waveT * 3.4) * 0.12
      p.hipL = lerp(p.hipL, 0.42, wLay)
      p.hipR = lerp(p.hipR, 0.42, wLay)
      p.kneeL = lerp(p.kneeL, -0.78, wLay)
      p.kneeR = lerp(p.kneeR, -0.78, wLay)
      p.torsoX = lerp(p.torsoX, 0.46 + dip * 0.4, wLay)
      p.shRX = lerp(p.shRX, -0.62 + dip, wLay)
      p.shLX = lerp(p.shLX, -0.34, wLay)
      p.elR = lerp(p.elR, -0.5, wLay)
      p.elL = lerp(p.elL, -0.9, wLay)
      p.rootY = lerp(p.rootY, -0.1, wLay)
    }
    if (wHaul > 0) {
      // both arms straight out, leaning back under the weight of the thing
      p.shLX = lerp(p.shLX, -1.5, wHaul)
      p.shRX = lerp(p.shRX, -1.5, wHaul)
      p.shLZ = lerp(p.shLZ, 0.3, wHaul)
      p.shRZ = lerp(p.shRZ, -0.3, wHaul)
      p.elL = lerp(p.elL, -0.28, wHaul)
      p.elR = lerp(p.elR, -0.28, wHaul)
      p.torsoX = lerp(p.torsoX, -0.16, wHaul)
    }
    if (wPaint > 0) {
      // long strokes up and down the wall
      const stroke = Math.sin(waveT * 3.1)
      p.shRX = lerp(p.shRX, -1.55 + stroke * 0.62, wPaint)
      p.shRZ = lerp(p.shRZ, -0.16, wPaint)
      p.elR = lerp(p.elR, -0.34 - Math.max(0, stroke) * 0.3, wPaint)
      p.shLX = lerp(p.shLX, -0.5, wPaint)
      p.elL = lerp(p.elL, -1.3, wPaint)
      p.torsoX = lerp(p.torsoX, 0.06 + stroke * 0.05, wPaint)
      p.hipL = lerp(p.hipL, 0.1, wPaint)
      p.hipR = lerp(p.hipR, -0.1, wPaint)
    }
    if (wWave > 0) {
      waveT += dt
      p.shRX = lerp(p.shRX, -2.7, wWave)
      p.shRZ = lerp(p.shRZ, -0.5 + Math.sin(waveT * 7) * 0.45, wWave)
      p.elR = lerp(p.elR, -0.35, wWave)
    } else {
      waveT += dt
    }

    // --- commit -------------------------------------------------------------
    root.position.y = hipY + p.rootY
    root.position.z = p.rootZ
    torso.rotation.x = p.torsoX
    torso.rotation.y = p.torsoY * 0.5
    torso.rotation.z = 0
    legL.hp.rotation.x = p.hipL
    legR.hp.rotation.x = p.hipR
    legL.kn.rotation.x = p.kneeL
    legR.kn.rotation.x = p.kneeR
    armL.sh.rotation.set(p.shLX, 0, p.shLZ)
    armR.sh.rotation.set(p.shRX, 0, p.shRZ)
    armL.el.rotation.x = p.elL
    armR.el.rotation.x = p.elR
    group.rotation.x = s.tilt ?? 0

    trowel.visible = wLay > 0.25 && !isForeman && wPaint < 0.2
    visor.material.emissiveIntensity = 1.15 + Math.sin(waveT * 2.2 + gaitOffset) * 0.25
  }

  update(0, {})

  return { group, height, handAnchor, barrowAnchor, rightHand: armR.hand, kit, update, role }
}
