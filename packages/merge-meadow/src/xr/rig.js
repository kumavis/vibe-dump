// PlayerRig: one object graph for desktop and XR (research: webxr).
//   root (Group)                <- locomotion + yaw; the one thing a mount's seat adopts
//   ├─ head (the camera)        desktop: (0, EYE_HEIGHT, 0) + pitch; XR: the headset pose
//   ├─ hands[i].ray             renderer.xr.getController(i)      (target-ray space)
//   ├─ hands[i].grip            renderer.xr.getControllerGrip(i)  (grip space)
//   └─ hands[i].hand            renderer.xr.getHand(i)            (25 joints with hand-tracking)
// Rules the spike paid for: never move the camera, move the root; desktop yaw is
// on the root and pitch on the head; snap turn pivots around the head; teleport
// puts the head, not the root, over the target; riding is seat.add(root).
import * as THREE from 'three'

export const EYE_HEIGHT = 1.6
const r3 = (v) => Math.round(v * 1000) / 1000
const r4 = (v) => Math.round(v * 10000) / 10000

// [x, y, z, qx, qy, qz, qw] of an object's local transform (rig space for head and
// hands), rounded to mm and 1e-4 so presence frames stay small and comparable
export function packPose (o) {
  const p = o.position; const q = o.quaternion
  return [r3(p.x), r3(p.y), r3(p.z), r4(q.x), r4(q.y), r4(q.z), r4(q.w)]
}

// world-space [x, z] for a forward/strafe intent relative to a yaw: what WASD and
// the left stick mean, both for walking the rig and for steering a mount
export function moveVector (yaw, forward, strafe) {
  const x = Math.sin(yaw) * -forward + Math.cos(yaw) * strafe
  const z = Math.cos(yaw) * -forward - Math.sin(yaw) * strafe
  return [x, z]
}

const tmpV = new THREE.Vector3(); const tmpV2 = new THREE.Vector3(); const tmpQ = new THREE.Quaternion(); const tmpE = new THREE.Euler()

export class PlayerRig {
  constructor (renderer, camera) {
    this.renderer = renderer
    this.root = new THREE.Group(); this.root.name = 'player-rig'
    this.head = camera
    this.head.position.set(0, EYE_HEIGHT, 0)
    this.root.add(this.head)
    this.pitch = 0
    this.mountedOn = null
    this.scene = null
    this.hands = [0, 1].map((i) => {
      const ray = renderer.xr.getController(i)
      const grip = renderer.xr.getControllerGrip(i)
      const hand = renderer.xr.getHand(i)
      const h = { index: i, ray, grip, hand, connected: false, handedness: null, gamepad: null, inputSource: null, isHand: false }
      ray.addEventListener('connected', (e) => {
        h.connected = true; h.inputSource = e.data; h.handedness = e.data?.handedness ?? null
        h.gamepad = e.data?.gamepad ?? null; h.isHand = !!e.data?.hand
      })
      ray.addEventListener('disconnected', () => { h.connected = false; h.inputSource = h.gamepad = null; h.isHand = false })
      this.root.add(ray, grip, hand)
      return h
    })
    // three leaves the last headset pose decomposed into the camera when a session
    // ends; desktop must get its eye height and pitch back
    let saved = null
    renderer.xr.addEventListener?.('sessionstart', () => {
      saved = { pitch: this.pitch }
      this.head.position.set(0, 0, 0); this.head.rotation.set(0, 0, 0)
    })
    renderer.xr.addEventListener?.('sessionend', () => {
      this.pitch = saved?.pitch ?? 0
      this.head.position.set(0, EYE_HEIGHT, 0); this.head.rotation.set(this.pitch, 0, 0, 'YXZ')
    })
  }

  get presenting () { return !!this.renderer.xr.isPresenting }
  hand (handedness) { return this.hands.find((h) => h.connected && h.handedness === handedness) ?? null }

  // desktop look: yaw on the root (so locomotion and the body follow), pitch on the head
  look (dYaw, dPitch) {
    this.root.rotation.y += dYaw
    if (!this.presenting) {
      this.pitch = THREE.MathUtils.clamp(this.pitch + dPitch, -1.45, 1.45)
      this.head.rotation.set(this.pitch, 0, 0, 'YXZ')
    }
  }

  // world yaw of where the head faces (the frame WASD and sticks move in)
  headYaw () {
    this.head.getWorldQuaternion(tmpQ)
    return tmpE.setFromQuaternion(tmpQ, 'YXZ').y
  }

  // rotate the root, then slide it so the head stays where it was: room-scale
  // players standing off-centre are not swung sideways
  snapTurn (angle) {
    this.root.updateMatrixWorld(true)
    const before = this.head.getWorldPosition(tmpV)
    this.root.rotation.y += angle
    this.root.updateMatrixWorld(true)
    const after = this.head.getWorldPosition(tmpV2)
    const delta = before.sub(after)
    if (this.root.parent) delta.applyQuaternion(this.root.parent.getWorldQuaternion(tmpQ).invert())
    delta.y = 0
    this.root.position.add(delta)
    this.root.updateMatrixWorld(true)
  }

  // along the floor relative to the head's yaw; no-op while riding (the mount moves)
  move (forward, strafe, dt, speed = 3) {
    if (this.mountedOn || (!forward && !strafe)) return
    const [x, z] = moveVector(this.headYaw(), forward, strafe)
    const d = tmpV.set(x * speed * dt, 0, z * speed * dt)
    if (this.root.parent) d.applyQuaternion(this.root.parent.getWorldQuaternion(tmpQ).invert())
    this.root.position.add(d)
  }

  // put the head, not the root, over a world point
  teleport (v3) {
    if (this.mountedOn) return
    const headLocal = tmpV.copy(this.head.position).applyQuaternion(this.root.quaternion)
    this.root.position.set(v3.x - headLocal.x, v3.y, v3.z - headLocal.z)
  }

  // riding = the seat adopts the root with an identity local pose; head and hands
  // keep tracking in rig space, so the XR camera follows the mount for free
  mount (seatObject3d) {
    if (!seatObject3d) return false
    let top = seatObject3d; while (top.parent) top = top.parent
    this.scene = top.isScene ? top : (this.root.parent?.isScene ? this.root.parent : this.scene)
    this.mountedOn = seatObject3d
    seatObject3d.add(this.root)
    this.root.position.set(0, 0, 0); this.root.rotation.set(0, 0, 0)
    return true
  }

  dismount () {
    if (!this.mountedOn) return false
    const scene = this.scene ?? (() => { let t = this.root; while (t.parent) t = t.parent; return t })()
    this.root.updateMatrixWorld(true)
    scene.attach(this.root) // keep the world pose
    const e = tmpE.setFromQuaternion(this.root.quaternion, 'YXZ')
    this.root.rotation.set(0, e.y, 0)
    this.root.position.y = 0
    this.mountedOn = null
    return true
  }

  // once a frame: a seat that left the scene (its mount despawned) drops the rider
  // where it was instead of leaving the camera in a detached subtree
  update () {
    if (!this.mountedOn) return
    let top = this.mountedOn; while (top.parent) top = top.parent
    if (top === this.scene) return
    this.mountedOn = null
    if (!this.scene) return
    if (this.root.parent !== this.scene) { this.root.updateMatrixWorld(true); this.scene.attach(this.root) }
    const e = tmpE.setFromQuaternion(this.root.quaternion, 'YXZ')
    this.root.rotation.set(0, e.y, 0); this.root.position.y = 0
  }

  // Pose for presence: p and yaw are the root's WORLD position and yaw (where the
  // body stands); head and hands are [x,y,z,qx,qy,qz,qw] in RIG space, so a remote
  // avatar is (p, yaw) * part and never needs the mount's pose in the same packet.
  // Desktop players get a synthesised right hand so their avatars look alive too.
  pose () {
    this.root.updateMatrixWorld(true)
    const p = this.root.getWorldPosition(tmpV)
    const yaw = tmpE.setFromQuaternion(this.root.getWorldQuaternion(tmpQ), 'YXZ').y
    const xr = this.presenting
    const hands = this.hands.map((h) => (xr && h.connected ? packPose(h.grip) : null))
    if (!xr) hands[1] = [0.25, r3(EYE_HEIGHT - 0.4), -0.35, 0, 0, 0, 1]
    return { p: [r3(p.x), r3(p.y), r3(p.z)], yaw: r4(yaw), head: packPose(this.head), hands, mode: xr ? 'xr' : 'desktop', mounted: !!this.mountedOn }
  }
}
