import { clamp, damp, wrapAngle } from '../core/mathx.js'

// Procedural animation over a rig. The brain never touches bones; it sets a
// handful of intents (speed, look target, graze, roar, attack, down...) and the
// animator turns them into gait cycles, head tracking and poses. Every bone is
// rebuilt from its rest pose each frame, so layers never drift.

export class Animator {
  constructor(rig, species, rng) {
    this.rig = rig
    this.sp = species
    this.B = species.body
    this.t = rng.range(0, 100)
    this.phase = rng.range(0, Math.PI * 2)
    this.side = rng.chance(0.5) ? 1 : -1 // which flank it falls onto
    // intents (0..1 unless noted) — written by the brain
    this.speed = 0 // m/s in rig units
    this.turn = 0 // rad/s
    this.lookYaw = 0 // desired head yaw relative to body
    this.lookPitch = 0
    this.graze = 0
    this.alert = 0
    this.roar = 0
    this.attack = 0
    this.down = 0
    this.dead = false
    this.drowsy = 0
    this.crouch = 0
    this.eat = 0
    this.sniff = 0 // nose down, snuffling: a hunter searching for something it lost
    // smoothed copies
    this.s = { graze: 0, alert: 0, roar: 0, attack: 0, down: 0, drowsy: 0, crouch: 0, lookYaw: 0, lookPitch: 0, amp: 0, eat: 0, turn: 0, sniff: 0 }
    const legLen = this.B.hipH
    this.stride = legLen * (this.B.plan === 'quad' ? 1.5 : 1.7)
  }

  update(dt) {
    const s = this.s
    this.t += dt
    const k = (name, rate = 6) => (s[name] = damp(s[name], this[name], rate, dt))
    k('graze', 3)
    k('alert', 5)
    k('roar', 8)
    k('attack', 14)
    k('down', this.down > s.down ? 1.6 : 0.8)
    k('drowsy', 2)
    k('crouch', 4)
    k('eat', 4)
    k('sniff', 2.5)
    k('turn', 4)
    s.lookYaw = damp(s.lookYaw, clamp(this.lookYaw, -1.2, 1.2), 5, dt)
    s.lookPitch = damp(s.lookPitch, clamp(this.lookPitch, -0.7, 0.6), 5, dt)

    const B = this.B
    const R = this.rig
    const walk = this.sp.speed.walk
    const up = 1 - s.down
    const ampTarget = clamp((this.speed / walk) * 0.3, 0, 0.6) * up
    s.amp = damp(s.amp, ampTarget, 6, dt)
    const amp = s.amp
    const stride = this.stride * (1 + clamp(this.speed / walk - 1, 0, 4) * 0.25)
    this.phase += (this.speed / stride) * Math.PI * 2 * dt
    const p = this.phase
    const t = this.t

    // ---- body
    const root = R.bones.root
    const hips = R.bones.hips
    const rest = (b) => b.userData.rest
    const hr = rest(hips)
    const biped = B.plan === 'biped'
    const bob = biped ? -Math.cos(p * 2) * 0.035 * B.hipH * (amp / 0.6) : -Math.cos(p * 2) * 0.02 * B.hipH * (amp / 0.6)
    const breath = Math.sin(t * (this.dead ? 0 : s.down > 0.5 ? 1.6 : 2.4)) * (this.dead ? 0 : 1)
    hips.position.set(hr.px, hr.py + bob - s.crouch * 0.14 * B.hipH - s.drowsy * 0.04 * B.hipH, hr.pz)
    hips.rotation.set(hr.rx + s.crouch * 0.05 + breath * 0.006, hr.ry + (biped ? Math.sin(p) * 0.05 * amp : 0) + s.drowsy * Math.sin(t * 0.8) * 0.05, hr.rz + Math.sin(p) * 0.04 * amp)
    const chest = R.bones.chest
    const cr = rest(chest)
    chest.rotation.set(cr.rx + breath * 0.012, cr.ry - s.turn * 0.05, cr.rz)

    // lying down: roll onto a flank and settle the body on the ground
    const roll = 1.42 * s.down
    root.rotation.set(0, 0, roll * this.side)
    root.position.set(this.side * B.hipH * Math.sin(roll) * 0.92, s.down * (B.torsoR * 0.95 - B.hipH * Math.cos(1.42)) + s.down * breath * 0.01 * B.torsoR, 0)

    // ---- legs
    for (const leg of R.legs) {
      const off = legPhase(leg, biped)
      const lp = p + off
      const swing = Math.sin(lp) * amp
      const lift = Math.max(0, -Math.cos(lp)) * amp
      const [a, b, c] = leg.bones
      const limp = s.down
      const ra = rest(a)
      const rb = rest(b)
      const rc = rest(c)
      if (leg.kind === 'biped') {
        a.rotation.x = (ra.rx + swing - s.crouch * 0.35) * (1 - limp * 0.7)
        b.rotation.x = (rb.rx + lift * 1.3 + s.crouch * 0.55) * (1 - limp * 0.5)
        c.rotation.x = (rc.rx - lift * 1.0 - s.crouch * 0.3) * (1 - limp * 0.5)
        if (leg.toeBone) leg.toeBone.rotation.x = rest(leg.toeBone).rx + lift * 0.9
      } else if (leg.kind === 'quadHind') {
        a.rotation.x = (ra.rx + swing) * (1 - limp * 0.6)
        b.rotation.x = (rb.rx + lift * 1.1) * (1 - limp * 0.6) + limp * 0.3
        c.rotation.x = rc.rx - lift * 0.5
      } else {
        a.rotation.x = (ra.rx + swing) * (1 - limp * 0.6)
        b.rotation.x = (rb.rx - lift * 1.2) * (1 - limp * 0.6) - limp * 0.3
        c.rotation.x = rc.rx + lift * 0.6
      }
      a.rotation.z = ra.rz + limp * leg.side * 0.25
    }
    for (const arm of R.arms) {
      const [a, b] = arm.bones
      a.rotation.x = rest(a).rx + Math.sin(p + Math.PI) * 0.15 * amp - s.attack * 0.6 + s.down * 0.4
      b.rotation.x = rest(b).rx - s.attack * 0.3
    }

    // ---- tail: idle sway, follows turns, lifts when running
    const n = R.tail.length
    R.tail.forEach((bone, i) => {
      const r = rest(bone)
      const f = (i + 1) / n
      const sway = Math.sin(t * 1.5 - i * 0.55) * (0.05 + 0.05 * amp) * (0.4 + f)
      const swipe = this.sp.attack?.kind === 'tail' ? s.attack * Math.sin(t * 9) * 0.35 : 0
      bone.rotation.y = r.ry + sway * up + s.turn * 0.1 + swipe
      bone.rotation.x = (r.rx + Math.sin(t * 1.1 - i * 0.4) * 0.015 + (i === 0 ? amp * 0.08 : 0) + s.crouch * (i === 0 ? -0.06 : 0)) * (1 - s.down * 0.85)
    })

    // ---- neck + head
    const nn = R.neck.length
    const grazeAngle = this.sp.browse ? -0.25 : biped ? 1.25 : 0.95
    // sniffing: the head held low over the ground, jerking with each draw of breath
    const snuff = s.sniff * (0.6 * grazeAngle + Math.max(0, Math.sin(t * 7)) * 0.06)
    const pitchAdd = s.graze * grazeAngle - s.alert * 0.3 - s.roar * 0.45 + s.attack * 0.35 + s.drowsy * 0.6 + s.crouch * 0.25 + snuff + s.lookPitch
    const yawAdd = s.lookYaw + s.drowsy * Math.sin(t * 0.7) * 0.25
    R.neck.forEach((bone, i) => {
      const r = rest(bone)
      bone.rotation.x = (r.rx + pitchAdd / nn) * (1 - s.down * 0.7) + Math.sin(t * 0.9 + i) * 0.01
      bone.rotation.y = r.ry + (yawAdd / (nn + 1)) * up
      bone.rotation.z = r.rz
    })
    const head = R.bones.head
    const hdr = rest(head)
    head.rotation.x = hdr.rx - s.roar * 0.15 + s.eat * Math.sin(t * 6) * 0.05
    head.rotation.y = hdr.ry + (yawAdd / (nn + 1)) * up
    const jaw = R.bones.jaw
    const jaws = Math.max(s.roar * 0.85, s.attack * 0.7, s.eat * (0.25 + 0.25 * Math.sin(t * 7)), this.dead ? 0.2 : 0)
    jaw.rotation.x = rest(jaw).rx + jaws
    const eyes = R.bones.eyes
    const shut = s.down > 0.6 || this.dead
    const blink = !shut && Math.sin(t * 0.7) > 0.995
    const es = shut || blink ? 0.05 : 1
    eyes.scale.set(1, es, 1)
  }

  // world-space yaw offset for the look target, clamped by the caller
  setLook(bodyYaw, targetYaw, pitch = 0) {
    this.lookYaw = wrapAngle(targetYaw - bodyYaw)
    this.lookPitch = pitch
  }
}

function legPhase(leg, biped) {
  if (biped) return leg.side > 0 ? 0 : Math.PI
  // lateral-sequence walk: LH, LF, RH, RF a quarter cycle apart
  if (!leg.front) return leg.side > 0 ? 0 : Math.PI
  return leg.side > 0 ? Math.PI / 2 : (Math.PI * 3) / 2
}
