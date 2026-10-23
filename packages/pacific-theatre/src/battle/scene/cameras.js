// The box's cameras (ENGINEERING.md §7; R7 §4.10): the free orbit (the
// Hawaiian rig in metres) for watching, an orbit that follows a unit, the
// chase camera behind an aircraft (18 m behind and 4 up for a fighter, 25
// and 5 for a bomber; a ship's high chase 300 m behind and 100 up), the
// bridge at the kit's eye height, the director with its zoom sights (4×,
// 8×, 16×: fields of 15°, 7.5°, 3.75°) laid along the main battery's aim, and
// the bomb sight down the nose. Only one drives the camera at a time; the
// rig is disabled while another does (App's setMode turns it off in a
// moment as well). Round two (ROUND-2 §4): 'gun' looks along a gun
// station's aim (the AA director's from the ship's deck, the gunner's from
// the aircraft), and 'bombsight' down at the level sight's predicted
// impact with the aircraft's track up the screen.

import * as THREE from 'three'

const V = new THREE.Vector3()
const W = new THREE.Vector3()
const Q = new THREE.Quaternion()
const F = new THREE.Vector3()
const U = new THREE.Vector3()
const DEG = Math.PI / 180

export const CAMERA_MODES = ['free', 'orbit', 'chase', 'bridge', 'director', 'sight', 'gun', 'bombsight']
export const ZOOMS = [1, 4, 8, 16]

export class Cameras {
  constructor(box) {
    this.box = box
    this.camera = box.camera
    this.mode = 'free'
    this.unit = -1
    this.zoom = 1
    this.look = { yaw: 0, pitch: 0 }
    this.pos = new THREE.Vector3()
    this.has = false
    this.baseFov = 42
  }

  set(mode, opts = {}) {
    if (!CAMERA_MODES.includes(mode)) throw new Error(`camera mode “${mode}”: one of ${CAMERA_MODES.join(', ')}`)
    const prev = this.mode
    this.mode = mode
    if (opts.unitIndex != null) this.unit = opts.unitIndex
    if (opts.zoom != null) this.zoom = opts.zoom
    this.has = false
    this.look.yaw = 0
    this.look.pitch = 0
    const rig = this.box.rig
    if (mode === 'free' || mode === 'orbit') {
      // back to the rig: where the camera is, as an orbit about the unit or the point looked at
      const s = this.box.sim?.state
      const i = this.unit
      if (mode === 'orbit' && s && i >= 0) {
        const pose = {
          target: { x: s.pos[3 * i], z: s.pos[3 * i + 2] },
          distance: opts.distance ?? (prev === 'free' || prev === 'orbit' ? rig.goal.distance : 1500),
          yaw: opts.bearing != null ? Math.PI - opts.bearing * DEG : rig.goal.yaw,
          pitch: opts.pitch ?? rig.goal.pitch,
        }
        rig.jump(pose)
      } else if (opts.target) {
        rig.flyTo({ target: { x: opts.target.x, y: 0, z: opts.target.z }, distance: opts.distance, yaw: opts.bearing != null ? Math.PI - opts.bearing * DEG : undefined, pitch: opts.pitch }, opts.duration ?? 2)
      }
      this.camera.fov = this.baseFov
      this.camera.updateProjectionMatrix()
    }
  }

  get rigDriven() {
    return this.mode === 'free' || this.mode === 'orbit'
  }

  /** Free look in the bridge and the director (the controls' look counter, radians). */
  addLook(dyaw, dpitch) {
    this.look.yaw += dyaw
    this.look.pitch = Math.max(-0.6, Math.min(0.6, this.look.pitch + dpitch))
  }

  cycleZoom() {
    const i = ZOOMS.indexOf(this.zoom)
    this.zoom = ZOOMS[(i + 1) % ZOOMS.length]
    return this.zoom
  }

  update(dt) {
    const box = this.box
    const cam = this.camera
    const sim = box.sim
    if (this.rigDriven || !sim) {
      if (this.mode === 'orbit' && sim && this.unit >= 0 && sim.state.alive[this.unit]) {
        const s = sim.state
        const i = this.unit
        box.rig.goal.target.x = s.pos[3 * i]
        box.rig.goal.target.z = s.pos[3 * i + 2]
      }
      box.rig.update(dt)
      return
    }
    const s = sim.state
    const i = this.unit
    if (i < 0 || !s.alive[i]) {
      this.set('free')
      return
    }
    const x = s.pos[3 * i]
    const y = s.pos[3 * i + 1]
    const z = s.pos[3 * i + 2]
    Q.set(s.quat[4 * i], s.quat[4 * i + 1], s.quat[4 * i + 2], s.quat[4 * i + 3])
    const u = sim.slots[i]
    const X = sim._X[i]
    const m = X.model
    let fov = this.baseFov
    if (this.mode === 'chase') {
      const air = u.kind === 'aircraft'
      const big = air && (m.type !== 'fighter')
      const back = air ? (big ? 25 : 18) : 300
      const up = air ? (big ? 5 : 4) : 100
      // the chase frame: the path, without the roll
      const vx = s.vel[3 * i]
      const vy = s.vel[3 * i + 1]
      const vz = s.vel[3 * i + 2]
      const sp = Math.hypot(vx, vy, vz)
      if (sp > 1) F.set(vx / sp, vy / sp, vz / sp)
      else F.set(Math.sin(s.heading[i] * DEG), 0, -Math.cos(s.heading[i] * DEG))
      if (!air) F.set(F.x, 0, F.z).normalize()
      V.set(x, y, z).addScaledVector(F, -back)
      V.y += up
      const k = this.has ? 1 - Math.exp(-dt / 0.15) : 1
      this.pos.lerp(V, k)
      this.has = true
      cam.position.copy(this.pos)
      W.set(x, y, z).addScaledVector(F, air ? 60 : 400)
      cam.up.set(0, 1, 0)
      cam.lookAt(W)
      fov = air ? 65 : 55
    } else if (this.mode === 'gun') {
      // along the gun station's aim: the AA director's on the ship, the gunner's in the aircraft
      const inp = sim.player?.unitIndex === i ? sim.player.input : null
      const air = u.kind === 'aircraft'
      if (air) {
        F.set(0, 0, -1).applyQuaternion(Q)
        U.set(0, 1, 0).applyQuaternion(Q)
        cam.position.set(x, y, z).addScaledVector(F, -2.5).addScaledVector(U, 1.4)
      } else cam.position.set(x, y + (m.deck ?? 8) + 7, z)
      const az = ((inp?.aimAz ?? s.heading[i] + (air ? 180 : 90)) * DEG) + this.look.yaw
      const el = Math.max(-0.2, Math.min(1.5, (inp?.aimEl ?? 10) * DEG + this.look.pitch))
      W.set(cam.position.x + Math.sin(az) * Math.cos(el) * 1000, cam.position.y + Math.sin(el) * 1000, cam.position.z - Math.cos(az) * Math.cos(el) * 1000)
      cam.up.set(0, 1, 0)
      cam.lookAt(W)
      fov = (air ? 60 : 50) / Math.max(1, this.zoom)
    } else if (this.mode === 'bombsight') {
      // the level sight: down at the predicted impact, the aircraft's track up the screen
      const st = sim.player?.unitIndex === i ? sim.player.state : null
      const h = s.heading[i] * DEG
      cam.position.set(x, y - 2, z)
      const c = st?.sight || st?.ccip
      if (c) W.set(c.x, 0, c.z)
      else W.set(x + Math.sin(h) * y * 0.6, 0, z - Math.cos(h) * y * 0.6)
      cam.up.set(Math.sin(h), 0, -Math.cos(h))
      cam.lookAt(W)
      fov = 34 / Math.max(1, this.zoom)
    } else if (this.mode === 'sight') {
      // down the nose, with the aircraft's roll
      F.set(0, 0, -1).applyQuaternion(Q)
      U.set(0, 1, 0).applyQuaternion(Q)
      cam.position.set(x, y, z).addScaledVector(U, 1.2).addScaledVector(F, 1.5)
      cam.up.copy(U)
      cam.lookAt(W.copy(cam.position).add(F))
      fov = 25
    } else {
      // the bridge and the director: an eye on the ship, its look free or laid along the aim
      const sup = m.sup || { yHi: m.top * 0.6, z0: -m.L * 0.15 }
      const h = s.heading[i] * DEG
      const fx = Math.sin(h)
      const fz = -Math.cos(h)
      const eyeY = this.mode === 'director' ? sup.yHi * 1.05 : sup.yHi * 0.8
      const along = -(sup.z0 ?? 0) + 3
      cam.position.set(x + fx * along, y + eyeY, z + fz * along)
      let az = s.heading[i] + this.look.yaw / DEG
      let el = this.look.pitch
      if (this.mode === 'director') {
        const inp = sim.player?.unitIndex === i ? sim.player.input : null
        if (inp && inp.aimAz != null) az = inp.aimAz + this.look.yaw / DEG
        const R = inp?.aimRange ?? 8000
        el = -Math.atan2(eyeY, R) + this.look.pitch
        fov = 60 / Math.max(1, this.zoom)
      } else fov = 60
      const a = az * DEG
      W.set(cam.position.x + Math.sin(a) * Math.cos(el) * 1000, cam.position.y + Math.sin(el) * 1000, cam.position.z - Math.cos(a) * Math.cos(el) * 1000)
      cam.up.set(0, 1, 0)
      cam.lookAt(W)
    }
    // never under the sea or the ground
    const g = box.ground.heightAt(cam.position.x, cam.position.z)
    if (cam.position.y < g + 1.5) cam.position.y = g + 1.5
    if (Math.abs(cam.fov - fov) > 0.01) cam.fov = fov
    cam.near = 0.5
    cam.far = 450000
    cam.updateProjectionMatrix()
    cam.updateMatrixWorld()
  }
}
