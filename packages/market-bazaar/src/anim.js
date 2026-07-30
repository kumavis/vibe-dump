import * as THREE from 'three'
import { hashU32 } from './rng.js'

// ---------------------------------------------------------------------------
// Procedural animation. No baked clips: every frame composes
//
//   base stance (species) → locomotion (walk/idle) → gesture layer (slerp)
//   → head aim → jaw chatter
//
// onto the bone quaternions. Rotations are quaternions composed about FIXED
// PARENT AXES (FRAMES.md): X(-θ) on a thigh/upperarm swings it forward
// (chains descend -Y in bind pose), Z rotates it sideways, Y rolls.
// All bones' rest rotations are identity, so "reset" is quaternion.identity().
// ---------------------------------------------------------------------------

const AX = new THREE.Vector3(1, 0, 0)
const AY = new THREE.Vector3(0, 1, 0)
const AZ = new THREE.Vector3(0, 0, 1)
const _q = new THREE.Quaternion()
const _q2 = new THREE.Quaternion()

/** bone.quaternion = rotations listed first applied first, about parent axes. */
function rot(bone, x, y = 0, z = 0) {
  if (!bone) return
  bone.quaternion.setFromAxisAngle(AX, x)
  if (y) {
    _q.setFromAxisAngle(AY, y)
    bone.quaternion.premultiply(_q)
  }
  if (z) {
    _q.setFromAxisAngle(AZ, z)
    bone.quaternion.premultiply(_q)
  }
}

/** Slerp bone toward the pose rot(x,y,z) by weight w (leaves base at w=0). */
function blendRot(bone, w, x, y = 0, z = 0) {
  if (!bone || w <= 0) return
  _q2.setFromAxisAngle(AX, x)
  if (y) {
    _q.setFromAxisAngle(AY, y)
    _q2.premultiply(_q)
  }
  if (z) {
    _q.setFromAxisAngle(AZ, z)
    _q2.premultiply(_q)
  }
  bone.quaternion.slerp(_q2, w)
}

export const GESTURES = [
  'none', 'talk', 'offer', 'refuse', 'agree', 'angry', 'browse', 'wave', 'bow', 'drum', 'flute', 'clap',
]

/**
 * @param {{byName: Record<string, THREE.Bone>}} rig
 * @param {object} a appearance (species drives stance + secondary motion)
 */
export function createAnimator(rig, a) {
  const b = rig.byName
  const idleSeed = (hashU32(Math.floor(a.height * 1000) + a.skin) / 4294967296) * 100
  const legLen = b.hips.position.y
  const stride = Math.max(legLen * 0.75, 0.3)
  const hipsRestY = b.hips.position.y

  let phase = idleSeed % (Math.PI * 2)
  let gesture = 'none'
  let gestureW = 0
  let gestureT = 0
  let lookYaw = 0
  let lookPitch = 0

  const baseHunch = a.hunch

  /**
   * @param {number} t   global seconds
   * @param {number} dt
   * @param {object} c   control: {speed, gesture, speaking, lookYaw, lookPitch}
   */
  function update(t, dt, c) {
    const speed = c.speed || 0
    const walk = Math.min(speed / 0.9, 1) // 0 idle → 1 full walk
    phase += ((Math.PI * 2 * speed) / stride) * dt
    const it = t * 0.9 + idleSeed // idle clock, desynced per character

    // gesture envelope
    if (c.gesture !== gesture) {
      gesture = c.gesture || 'none'
      gestureT = 0
    } else {
      gestureT += dt
    }
    const targetW = gesture === 'none' ? 0 : 1
    gestureW += (targetW - gestureW) * Math.min(1, dt * 7)
    const gw = gestureW

    // ---- base + locomotion -----------------------------------------------
    const s = Math.sin(phase)
    const sO = Math.sin(phase + Math.PI)
    const thighA = 0.52 * walk
    const breathe = Math.sin(it * 0.85) * 0.02
    const sway = Math.sin(it * 0.5) * 0.02 * (1 - walk)

    // hips: bob while walking, subtle weight shift while idle
    b.hips.position.y = hipsRestY - Math.abs(Math.sin(phase)) * 0.028 * walk * legLen + breathe * 0.15
    rot(b.hips, 0.04 * walk, Math.sin(phase) * 0.06 * walk, sway + Math.sin(phase) * 0.04 * walk)

    // legs (left forward at sin>0); knee bends during its swing half
    const bendL = Math.max(0, Math.sin(phase + Math.PI * 0.6)) * 0.95 * walk
    const bendR = Math.max(0, Math.sin(phase + Math.PI * 1.6)) * 0.95 * walk
    rot(b.thighL, -thighA * s + 0.02, 0, 0.02)
    rot(b.thighR, -thighA * sO + 0.02, 0, -0.02)
    rot(b.shinL, bendL)
    rot(b.shinR, bendR)
    // feet: level the sole against thigh+shin, with a toe-off flick
    rot(b.footL, thighA * s * 0.55 - bendL * 0.75)
    rot(b.footR, thighA * sO * 0.55 - bendR * 0.75)
    rot(b.toeL, Math.max(0, -Math.sin(phase)) * 0.25 * walk)
    rot(b.toeR, Math.max(0, -Math.sin(phase + Math.PI)) * 0.25 * walk)

    // spine: hunch + counter-rotation + breathing
    rot(b.spine01, baseHunch * 0.22 + 0.03 * walk + breathe * 0.4, -Math.sin(phase) * 0.05 * walk, 0)
    rot(b.chest, baseHunch * 0.3 + breathe, -Math.sin(phase) * 0.07 * walk, 0)
    rot(b.neck, -baseHunch * 0.2, 0, 0)

    // arms: hang + counter-swing; idle micro-sway
    const armSwing = 0.45 * walk
    rot(b.clavicleL, 0, 0, 0.04)
    rot(b.clavicleR, 0, 0, -0.04)
    rot(b.upperarmL, armSwing * sO + Math.sin(it * 0.7) * 0.03, 0, 0.1 + sway)
    rot(b.upperarmR, armSwing * s + Math.cos(it * 0.8) * 0.03, 0, -0.1 - sway)
    rot(b.forearmL, -0.18 - Math.max(0, armSwing * sO) * 0.5)
    rot(b.forearmR, -0.18 - Math.max(0, armSwing * s) * 0.5)
    rot(b.handL, -0.05)
    rot(b.handR, -0.05)

    // head idles: slow look-around when standing
    const idleYaw = (1 - walk) * Math.sin(it * 0.35) * 0.25
    rot(b.head, -baseHunch * 0.28 + Math.sin(it * 0.6) * 0.03, idleYaw, 0)

    // tail sway
    if (b.tail0) {
      const tw = Math.sin(it * 1.1) * 0.18 + Math.sin(phase) * 0.12 * walk
      for (let i = 0; i < 5; i++) {
        const bone = b['tail' + i]
        if (!bone) break
        rot(bone, -0.06, tw * (0.5 + i * 0.35), 0)
      }
    }
    // ears + antennae jiggle
    if (b.earL) {
      rot(b.earL, 0, 0, Math.sin(it * 2.1) * 0.06 + walk * Math.sin(phase * 2) * 0.05)
      rot(b.earR, 0, 0, -Math.sin(it * 2.3) * 0.06 - walk * Math.sin(phase * 2) * 0.05)
    }
    if (b.antL0) {
      rot(b.antL0, Math.sin(it * 1.7) * 0.1 - walk * 0.15, 0, 0.1 + Math.sin(it * 1.3) * 0.08)
      rot(b.antL1, Math.sin(it * 1.9) * 0.15, 0, 0.12)
      rot(b.antR0, Math.sin(it * 1.8) * 0.1 - walk * 0.15, 0, -0.1 - Math.sin(it * 1.4) * 0.08)
      rot(b.antR1, Math.sin(it * 2.0) * 0.15, 0, -0.12)
    }

    // ---- gesture layer ---------------------------------------------------
    if (gw > 0.001) {
      const g = gesture
      const gt = gestureT
      if (g === 'talk') {
        const w1 = Math.sin(gt * 5.2)
        const w2 = Math.sin(gt * 4.1 + 1.7)
        blendRot(b.upperarmR, gw, -0.55 + w1 * 0.12, 0, -0.28)
        blendRot(b.forearmR, gw, -1.5 + w1 * 0.3, 0.25 * w2, 0)
        blendRot(b.upperarmL, gw * 0.7, -0.25 + w2 * 0.1, 0, 0.18)
        blendRot(b.forearmL, gw * 0.7, -0.9 + w2 * 0.25)
        blendRot(b.head, gw * 0.5, 0.05 + w1 * 0.04, lookYaw * 0.5, 0)
      } else if (g === 'offer') {
        blendRot(b.upperarmR, gw, -1.05, -0.15, -0.1)
        blendRot(b.forearmR, gw, -0.35, 0, 0.35) // palm turned up
        blendRot(b.handR, gw, -0.3)
        blendRot(b.chest, gw * 0.4, baseHunch * 0.3 + 0.08)
      } else if (g === 'refuse') {
        const shake = Math.sin(gt * 6.5) * 0.32
        blendRot(b.head, gw, -baseHunch * 0.28, shake, 0)
        blendRot(b.upperarmR, gw, -0.5, 0, -0.55)
        blendRot(b.forearmR, gw, -1.15, 0, -0.6)
        blendRot(b.upperarmL, gw, -0.5, 0, 0.55)
        blendRot(b.forearmL, gw, -1.15, 0, 0.6)
      } else if (g === 'agree') {
        const nod = Math.abs(Math.sin(gt * 4.5)) * 0.3
        blendRot(b.head, gw, -baseHunch * 0.28 + nod, 0, 0)
        blendRot(b.upperarmR, gw, -0.95, -0.2, 0)
        blendRot(b.forearmR, gw, -0.5 + Math.sin(gt * 4.5) * 0.12)
      } else if (g === 'angry') {
        const shake = Math.sin(gt * 9) * 0.1
        blendRot(b.upperarmL, gw, -1.2 + shake, 0, 0.9)
        blendRot(b.upperarmR, gw, -1.2 - shake, 0, -0.9)
        blendRot(b.forearmL, gw, -2.0)
        blendRot(b.forearmR, gw, -2.0)
        blendRot(b.chest, gw, baseHunch * 0.3 + 0.14, 0, 0)
        blendRot(b.head, gw, 0.12 + shake * 0.5, 0, 0)
      } else if (g === 'browse') {
        blendRot(b.upperarmR, gw, -0.75, -0.35, 0)
        blendRot(b.forearmR, gw, -1.95, 0.2, 0)
        blendRot(b.head, gw, 0.28, lookYaw * 0.4, 0.06)
        blendRot(b.spine01, gw * 0.5, baseHunch * 0.22 + 0.1)
      } else if (g === 'wave') {
        const wv = Math.sin(gt * 7)
        blendRot(b.upperarmR, gw, -0.4, 0, -2.45)
        blendRot(b.forearmR, gw, -0.5, 0, -0.4 + wv * 0.45)
        blendRot(b.head, gw * 0.4, -0.08, 0, 0)
      } else if (g === 'bow') {
        blendRot(b.spine01, gw, baseHunch * 0.22 + 0.5)
        blendRot(b.chest, gw, baseHunch * 0.3 + 0.25)
        blendRot(b.head, gw, 0.15)
        blendRot(b.upperarmR, gw, -0.35, 0, -0.3)
        blendRot(b.upperarmL, gw, 0.25, 0, 0.4)
      } else if (g === 'drum') {
        const h1 = Math.sin(gt * 8.5)
        const h2 = Math.sin(gt * 8.5 + Math.PI)
        blendRot(b.upperarmL, gw, -0.55, 0.3, 0.35)
        blendRot(b.upperarmR, gw, -0.55, -0.3, -0.35)
        blendRot(b.forearmL, gw, -1.15 + Math.max(0, h1) * 0.55)
        blendRot(b.forearmR, gw, -1.15 + Math.max(0, h2) * 0.55)
        blendRot(b.head, gw * 0.6, 0.05 + h1 * 0.05, 0, Math.sin(gt * 2.1) * 0.12)
      } else if (g === 'flute') {
        blendRot(b.upperarmR, gw, -0.95, -0.55, -0.25)
        blendRot(b.forearmR, gw, -2.05, 0, -0.35)
        blendRot(b.upperarmL, gw, -0.85, 0.55, 0.25)
        blendRot(b.forearmL, gw, -2.15, 0, 0.35)
        blendRot(b.chest, gw * 0.5, baseHunch * 0.3, 0, Math.sin(gt * 1.7) * 0.08)
        blendRot(b.head, gw, 0.12, 0, Math.sin(gt * 1.9) * 0.06)
      } else if (g === 'clap') {
        const cl = Math.abs(Math.sin(gt * 6))
        blendRot(b.upperarmL, gw, -0.85, 0.5 * cl, 0.3)
        blendRot(b.upperarmR, gw, -0.85, -0.5 * cl, -0.3)
        blendRot(b.forearmL, gw, -1.35)
        blendRot(b.forearmR, gw, -1.35)
        blendRot(b.head, gw * 0.4, -0.05, 0, Math.sin(gt * 3) * 0.08)
      }
    }

    // ---- head aim (after gestures, clamped) ------------------------------
    const ty = THREE.MathUtils.clamp(c.lookYaw ?? 0, -1.1, 1.1)
    const tp = THREE.MathUtils.clamp(c.lookPitch ?? 0, -0.5, 0.6)
    lookYaw += (ty - lookYaw) * Math.min(1, dt * 6)
    lookPitch += (tp - lookPitch) * Math.min(1, dt * 6)
    if (Math.abs(lookYaw) > 0.01 || Math.abs(lookPitch) > 0.01) {
      _q.setFromAxisAngle(AY, lookYaw)
      b.head.quaternion.premultiply(_q)
      _q.setFromAxisAngle(AX, lookPitch)
      b.head.quaternion.premultiply(_q)
    }

    // ---- jaw: chatter while speaking, else closed ------------------------
    const chatter = c.speaking ? Math.max(0, Math.sin(t * 11 + idleSeed)) * 0.3 + 0.05 : 0
    rot(b.jaw, chatter)
  }

  return { update, get phase() { return phase } }
}
