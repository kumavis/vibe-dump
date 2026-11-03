// The toy's camera (TOY.md §3): a chase camera a little loose behind the
// player, with shake that dies away, and a quick cut to a sinking for the
// slow-motion second and back.

import * as THREE from 'three'

const _v = new THREE.Vector3()
const _look = new THREE.Vector3()

export class ChaseCamera {
  constructor(camera) {
    this.camera = camera
    this.pos = new THREE.Vector3(0, 80, 200)
    this.look = new THREE.Vector3()
    this.shakeAmp = 0
    this.cutTo = null // { x, y, z, until, from }
    this.time = 0
    this.roll = 0
  }

  shake(a) {
    this.shakeAmp = Math.min(1.2, Math.max(this.shakeAmp, a))
  }

  /** Look at a point (a sinking ship) from a little off it for `seconds` of the screen's time. */
  cut(x, y, z, seconds = 1.3, L = 120) {
    this.cutTo = { x, y, z, L, until: this.time + seconds }
  }

  /** me: the player's thing in box metres ({ x, y, z, yaw, pitch, roll }); dt: the screen's seconds. */
  update(me, dt) {
    this.time += dt
    const cam = this.camera
    if (this.cutTo && this.time < this.cutTo.until) {
      const c = this.cutTo
      const d = c.L * 1.1 + 90
      cam.position.set(c.x + d * 0.7, c.y + 45 + c.L * 0.15, c.z + d * 0.7)
      cam.up.set(0, 1, 0)
      cam.lookAt(c.x, c.y + 8, c.z)
      this.snap = true
    } else if (me) {
      this.cutTo = null
      const fx = Math.sin(me.yaw)
      const fz = -Math.cos(me.yaw)
      // behind and above, looking well ahead: the player sits a little below the middle, the reticle over the nose
      _v.set(me.x - fx * 26, me.y + 8 - Math.sin(me.pitch) * 14, me.z - fz * 26)
      _look.set(me.x + fx * 60, me.y + Math.sin(me.pitch) * 40 + 3, me.z + fz * 60)
      const k = this.snap ? 1 : 1 - Math.exp(-dt * 7)
      const kl = this.snap ? 1 : 1 - Math.exp(-dt * 10)
      this.snap = false
      this.pos.lerp(_v, k)
      this.look.lerp(_look, kl)
      if (this.pos.y < 3) this.pos.y = 3
      cam.position.copy(this.pos)
      this.roll += (me.roll * 0.35 - this.roll) * (1 - Math.exp(-dt * 4))
      cam.up.set(Math.cos(me.yaw) * Math.sin(this.roll), Math.cos(this.roll), Math.sin(me.yaw) * Math.sin(this.roll))
      cam.lookAt(this.look)
    }
    if (this.shakeAmp > 0.003) {
      const a = this.shakeAmp * 0.03
      const t = this.time * 41
      cam.rotateX(Math.sin(t) * a)
      cam.rotateY(Math.sin(t * 1.37 + 1.1) * a)
      cam.rotateZ(Math.sin(t * 0.71 + 2.3) * a * 0.7)
      this.shakeAmp *= Math.exp(-dt / 0.3)
    } else this.shakeAmp = 0
    cam.updateMatrixWorld()
  }
}
