import * as THREE from 'three'
import { clamp, damp, dampAngle, lerp, yawDirX, yawDirZ } from '../core/mathx.js'
import { paintedMetal } from '../world/textures.js'

// The station's old helicopter. Arcade flight: Space/Shift collective, W/S
// pitch to fly forward/back, A/D slide, mouse yaws. It needs fuel (the pad's
// pump needs the lab generator), lands on anything flat, and is very loud —
// every animal for 150 m hears it coming.

export class Helicopter {
  constructor(G, pos, yaw) {
    this.G = G
    this.pos = pos.clone()
    this.vel = new THREE.Vector3()
    this.yaw = yaw
    this.pitch = 0
    this.roll = 0
    this.rpm = 0
    this.fuel = 0
    this.health = 100
    this.piloted = false
    this.onGround = true
    this.view = 'chase'
    this.camYaw = yaw
    this.camPitch = -0.15
    this.noiseT = 0
    this.rotorAngle = 0
    this.lookPitch = 0
    this.buildModel()
    this.collider = null
    this.parkCollider()
    G.interact.add({
      id: 'heli',
      label: () => (this.fuel > 0.02 ? 'Board helicopter' : 'Helicopter — tank is dry'),
      hold: 0,
      radius: 4.2,
      dynamic: () => ({ x: this.pos.x, y: this.pos.y + 1.2, z: this.pos.z }),
      enabled: () => {
        if (this.piloted) return 'In use'
        if (this.fuel <= 0.02) return G.flags.get('labPower') ? 'Refuel at the pad pump' : 'No fuel — the pump needs power'
        return true
      },
      onUse: () => this.enter(),
    })
  }

  buildModel() {
    const g = new THREE.Group()
    const paint = new THREE.MeshLambertMaterial({ map: paintedMetal([200, 112, 46]) })
    const white = new THREE.MeshLambertMaterial({ map: paintedMetal([214, 210, 196]) })
    const dark = new THREE.MeshLambertMaterial({ color: 0x2a2a2a })
    const glass = new THREE.MeshPhongMaterial({ color: 0x223a44, transparent: true, opacity: 0.55, shininess: 120, specular: 0x99bbcc })
    const cabin = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), paint)
    cabin.scale.set(1.15, 1.05, 1.75)
    cabin.position.set(0, 1.55, 0.2)
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12, 0, Math.PI * 2, 0, Math.PI * 0.62), glass)
    bubble.scale.set(1.12, 1.0, 1.25)
    bubble.rotation.x = -Math.PI / 2 + 0.25
    bubble.position.set(0, 1.75, -0.55)
    const stripe = new THREE.Mesh(new THREE.CylinderGeometry(1.16, 1.16, 0.25, 18, 1, true), white)
    stripe.rotation.x = Math.PI / 2
    stripe.scale.set(1, 1, 0.92)
    stripe.position.set(0, 1.35, 0.9)
    const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.36, 5.6, 10), paint)
    boom.rotation.x = Math.PI / 2
    boom.position.set(0, 1.8, 4.3)
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.3, 0.8), white)
    fin.position.set(0, 2.3, 6.9)
    fin.rotation.x = -0.35
    const tailWing = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.4), white)
    tailWing.position.set(0, 1.85, 6.1)
    const engine = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.6, 1.6), dark)
    engine.position.set(0, 2.6, 1.0)
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.6, 8), dark)
    mast.position.set(0, 3.1, 0.4)
    g.add(cabin, bubble, stripe, boom, fin, tailWing, engine, mast)
    for (const s of [-1, 1]) {
      const skid = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.6, 6), dark)
      skid.rotation.x = Math.PI / 2
      skid.position.set(s * 1.05, 0.08, 0.2)
      g.add(skid)
      for (const z of [-0.7, 1.1]) {
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.75, 5), dark)
        strut.position.set(s * 0.9, 0.42, z)
        strut.rotation.z = s * 0.35
        g.add(strut)
      }
    }
    // main rotor
    const rotor = new THREE.Group()
    rotor.position.set(0, 3.42, 0.4)
    for (let i = 0; i < 2; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 5.4), dark)
      blade.position.z = 2.75
      const arm = new THREE.Group()
      arm.rotation.y = i * Math.PI
      arm.add(blade)
      rotor.add(arm)
    }
    const disc = new THREE.Mesh(new THREE.CircleGeometry(5.5, 32), new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }))
    disc.rotation.x = -Math.PI / 2
    rotor.add(disc)
    this.disc = disc
    g.add(rotor)
    const tail = new THREE.Group()
    tail.position.set(0.12, 2.25, 7.0)
    for (let i = 0; i < 2; i++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.1, 0.12), dark)
      b.rotation.x = i * Math.PI
      b.position.y = 0
      tail.add(b)
    }
    g.add(tail)
    g.traverse((o) => {
      if (o.isMesh && o !== disc) o.castShadow = true
    })
    this.rotor = rotor
    this.tail = tail
    this.model = g
    g.rotation.order = 'YXZ'
    this.G.scene.add(g)
    this.sync()
  }

  parkCollider() {
    if (this.collider) this.G.physics.remove(this.collider)
    this.collider = this.G.physics.addBox(this.pos.x, this.pos.z, 1.3, 2.2, this.yaw, this.pos.y + 0.2, this.pos.y + 2.6, { walkable: false, tag: 'heli' })
  }

  enter() {
    const G = this.G
    this.piloted = true
    if (this.collider) {
      G.physics.remove(this.collider)
      this.collider = null
    }
    this.camYaw = this.yaw
    G.events.emit('heli:enter', {})
    G.toast('Space: climb · Shift: descend · W/S: pitch · A/D: slide · Mouse: turn · V: camera · E: exit (landed)', 'info', 7)
  }

  exit() {
    const G = this.G
    if (!this.onGround || this.vel.length() > 2.5) {
      G.toast('Land first', 'warn')
      return
    }
    this.piloted = false
    const side = new THREE.Vector3(Math.cos(this.yaw) * 2.6, 0, -Math.sin(this.yaw) * 2.6)
    const p = this.pos.clone().sub(side)
    p.y = G.physics.groundAt(p.x, p.z, this.pos.y + 2)
    G.player.teleport(p, this.yaw)
    G.player.pitch = 0
    this.parkCollider()
    G.events.emit('heli:exit', {})
  }

  damage(n) {
    this.health = Math.max(0, this.health - n)
    this.G.player.shake = Math.min(1, this.G.player.shake + n / 40)
    if (this.health <= 0 && this.piloted) this.G.toast('Engine failure! Autorotating...', 'warn')
  }

  update(dt, input) {
    const G = this.G
    const isl = G.island
    const working = this.fuel > 0 && this.health > 0
    this.rpm = damp(this.rpm, this.piloted && working ? 1 : 0, this.piloted ? 0.7 : 0.4, dt)
    this.rotorAngle += this.rpm * dt * 38
    this.rotor.rotation.y = this.rotorAngle
    this.tail.rotation.x = this.rotorAngle * 1.7
    this.disc.material.opacity = clamp((this.rpm - 0.5) * 0.5, 0, 0.22)
    for (const c of this.rotor.children) if (c.isGroup) c.visible = this.rpm < 0.85 || Math.random() < 0.5

    let fz = 0
    let fx = 0
    let coll = 0
    if (this.piloted) {
      fz = input.axis('back', 'forward')
      fx = input.axis('left', 'right')
      coll = (input.down('ascend') ? 1 : 0) - (input.down('descend') ? 1 : 0)
      const look = input.look()
      G.player.lastLook = look
      this.yaw -= look.dx * 1.1 * Math.max(0.15, this.rpm)
      this.lookPitch = clamp(this.lookPitch - look.dy, -0.9, 0.6)
      if (input.pressed('camera')) this.view = this.view === 'chase' ? 'cockpit' : 'chase'
      if (input.pressed('interact')) this.exit()
      this.fuel = Math.max(0, this.fuel - dt / 420)
      if (this.fuel <= 0 && working) G.toast('Out of fuel!', 'warn')
    }
    const lift = this.rpm
    const pitchT = this.onGround ? 0 : fz * 0.32
    const rollT = this.onGround ? 0 : fx * 0.28
    this.pitch = damp(this.pitch, pitchT, 3, dt)
    this.roll = damp(this.roll, rollT, 3, dt)
    // forces: tilt pushes, collective lifts, air drags
    const fwdX = yawDirX(this.yaw)
    const fwdZ = yawDirZ(this.yaw)
    const rightX = Math.cos(this.yaw)
    const rightZ = -Math.sin(this.yaw)
    const ax = (fwdX * this.pitch + rightX * this.roll) * 42 * lift
    const az = (fwdZ * this.pitch + rightZ * this.roll) * 42 * lift
    let ay = -9.8 + 9.8 * lift + coll * 9 * lift
    if (!working && !this.onGround) ay = -6 - this.vel.y * 0.8 // autorotation
    this.vel.x += (ax - this.vel.x * 0.33) * dt
    this.vel.z += (az - this.vel.z * 0.33) * dt
    this.vel.y += (ay - this.vel.y * 1.1) * dt
    this.pos.addScaledVector(this.vel, dt)
    this.pos.y = Math.min(this.pos.y, 430)
    this.pos.x = clamp(this.pos.x, -isl.half + 30, isl.half - 30)
    this.pos.z = clamp(this.pos.z, -isl.half + 30, isl.half - 30)

    // trunks, walls, masts
    const before = this.pos.clone()
    if (G.physics.collideCircle(this.pos, 2.2, this.pos.y + 0.3, this.pos.y + 3.4)) {
      const sp = this.vel.length()
      if (sp > 6) this.damage((sp - 6) * 4)
      const push = this.pos.clone().sub(before)
      if (push.lengthSq() > 0) {
        push.normalize()
        const vn = this.vel.dot(push)
        if (vn < 0) this.vel.addScaledVector(push, -vn * 1.4)
      }
    }
    // ground / water contact
    const gnd = Math.max(G.physics.groundAt(this.pos.x, this.pos.z, this.pos.y + 1.5), isl.waterAt(this.pos.x, this.pos.z) - 0.2)
    if (this.pos.y <= gnd) {
      const impact = -this.vel.y
      if (impact > 5.5) this.damage((impact - 5.5) * 14)
      this.pos.y = gnd
      if (this.vel.y < 0) this.vel.y = 0
      this.vel.x *= Math.max(0, 1 - dt * 4)
      this.vel.z *= Math.max(0, 1 - dt * 4)
      this.onGround = true
    } else this.onGround = this.pos.y - gnd < 0.05
    const agl = this.pos.y - gnd
    if (this.piloted && agl > 8 && !G.flags.get('heliFlown')) G.flags.set('heliFlown')

    // noise, dust and rotor wash
    if (this.rpm > 0.3) {
      this.noiseT -= dt
      if (this.noiseT <= 0) {
        this.noiseT = 0.6
        G.events.emit('noise', { x: this.pos.x, y: this.pos.y, z: this.pos.z, radius: 150 * this.rpm * clamp(1.4 - agl / 150, 0.3, 1), source: 'player', kind: 'vehicle' })
      }
      if (agl < 14 && Math.random() < this.rpm) G.fx.rotorDust({ x: this.pos.x, y: gnd, z: this.pos.z }, 6)
      if (this.piloted) G.veg.setPush(this.pos.x, this.pos.z, 22, this.rpm * clamp(1.5 - agl / 25, 0, 1.5))
    }
    G.audio?.setRotor(this.rpm, this.pos, this.piloted && this.view === 'cockpit')
    this.sync()
  }

  sync() {
    this.model.position.copy(this.pos)
    this.model.rotation.set(-this.pitch, this.yaw, -this.roll)
  }

  // Third-person chase cam or cockpit seat.
  updateCamera(cam, dt) {
    if (this.view === 'cockpit') {
      const seat = new THREE.Vector3(-0.35, 1.9, -0.55).applyEuler(this.model.rotation).add(this.pos)
      cam.position.copy(seat)
      cam.rotation.order = 'YXZ'
      cam.rotation.set(this.pitch * 0.6 + this.lookPitch * 0.8, this.yaw, -this.roll * 0.8)
    } else {
      this.camYaw = dampAngle(this.camYaw, this.yaw, 3, dt)
      const back = 15
      const up = 5.5 + this.lookPitch * -6
      const cx = this.pos.x - yawDirX(this.camYaw) * back
      const cz = this.pos.z - yawDirZ(this.camYaw) * back
      let cy = this.pos.y + up
      cy = Math.max(cy, this.G.island.heightAt(cx, cz) + 1.5)
      cam.position.set(lerp(cam.position.x, cx, Math.min(1, dt * 8)), lerp(cam.position.y, cy, Math.min(1, dt * 8)), lerp(cam.position.z, cz, Math.min(1, dt * 8)))
      cam.lookAt(this.pos.x + yawDirX(this.camYaw) * 8, this.pos.y + 1.5, this.pos.z + yawDirZ(this.camYaw) * 8)
    }
    cam.updateMatrixWorld()
  }
}
