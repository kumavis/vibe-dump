import * as THREE from 'three'
import { clamp, damp, dampAngle, lerp, yawDirX, yawDirZ } from '../core/mathx.js'
import { paintedMetal } from '../world/textures.js'
import { HELI, VEHICLE_FX } from '../data/vehicles.js'
import { Vehicle } from './vehicle.js'

// The station's old helicopter. Arcade flight: Space/Shift collective, W/S
// pitch to fly forward/back, A/D slide, mouse yaws. It needs fuel (the pad's
// pump needs the lab generator), lands on anything flat — a healthy rotor
// cushions the last few metres, so holding Shift sets you down — and is very
// loud: every animal for 150 m hears it coming.
//
// Parked, it is a cabin + boom + tail of colliders traced off the model; in
// flight the cabin, the whole boom and the tail rotor test the trunks and
// walls they pass, so clipping a tree with the tail hurts and spins you.
// Damage is loud and visible (see Vehicle.damage); below 20% hull the engine
// sputters, at 0 it autorotates. The pad pump services it back to new; dry
// anywhere else, its reserve tank can be hand-pumped through to limp home.

const _c = { x: 0, z: 0 }
const _n = new THREE.Vector3()
const _seat = new THREE.Vector3()
const _contacts = new Map()
let _only = null
const onlyThat = (c) => c === _only

export class Helicopter extends Vehicle {
  constructor(G, pos, yaw) {
    super(G, HELI, pos, yaw)
    this.rpm = 0
    this.fuel = 0
    this.spin = 0 // yaw rate left over from a tail strike
    this.sputter = 0
    this.sputterT = 0
    this.rotorAngle = 0
    this.reserveAction = { label: 'Tank dry — hand-pump the reserve tank through', hold: HELI.reserve.hold, use: () => this.pumpReserve() }
    this.buildModel()
    this.park()
    this.registerBoard('heli')
  }

  boardLabel() {
    return this.fuel > this.tune.dry ? 'Board helicopter' : 'Helicopter — tank is dry'
  }
  canBoard() {
    if (this.fuel <= this.tune.dry) return this.G.flags.get('labPower') ? 'Refuel at the pad pump' : 'No fuel — the pump needs power'
    return true
  }
  onPad() {
    return this.pos.distanceTo(this.G.island.poi.fieldlab.pad) <= this.tune.serviceRange
  }
  // Wrecked: the field repair. Dry anywhere but the pad: the reserve tank.
  recovery() {
    if (this.destroyed) return this.fieldRepairAction
    return this.fuel <= this.tune.dry && !this.onPad() ? this.reserveAction : null
  }
  pumpReserve() {
    const R = this.tune.reserve
    this.fuel = Math.max(this.fuel, R.fuel)
    this.G.audio?.play('pump', { pos: this.pos })
    this.G.toast(`Reserve tank pumped through — about ${Math.round(R.fuel / this.tune.fuelBurn)} s of flying. Head for the pad.`, 'info', 6)
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

  onEnter() {
    this.spin = 0
    this.G.toast('Space: climb · Shift: descend · W/S: pitch · A/D: slide · Mouse: turn · V: camera · E: exit (landed)', 'info', 7)
  }

  onExit() {
    this.spin = 0
  }

  onDestroyed() {
    this.sputter = 0
  }

  // The pad pump: a full tank and a sound airframe.
  needsService() {
    return super.needsService() || this.fuel < 0.98
  }
  service() {
    this.fuel = 1
    super.service()
  }

  update(dt, input) {
    const G = this.G
    const isl = G.island
    const T = this.tune
    const working = this.fuel > 0 && this.health > 0
    // a dying engine coughs: the rotor loses revs in random dips
    let rpmT = this.occupied && working ? 1 : 0
    if (working && this.health < VEHICLE_FX.criticalBelow && this.rpm > 0.3) {
      this.sputterT -= dt
      if (this.sputterT <= 0) {
        this.sputterT = 0.25 + Math.random() * 0.6
        this.sputter = Math.random() < 0.55 ? 0.18 + Math.random() * 0.25 : 0
        if (this.sputter) G.audio?.play('sputter', { pos: this.pos })
      }
      rpmT -= this.sputter
    } else this.sputter = 0
    this.rpm = damp(this.rpm, rpmT, this.occupied ? (this.sputter ? 2.5 : 0.7) : 0.4, dt)
    this.rotorAngle += this.rpm * dt * 38
    this.rotor.rotation.y = this.rotorAngle
    this.tail.rotation.x = this.rotorAngle * 1.7
    this.disc.material.opacity = clamp((this.rpm - 0.5) * 0.5, 0, 0.22)
    for (const c of this.rotor.children) if (c.isGroup) c.visible = this.rpm < 0.85 || Math.random() < 0.5

    let fz = 0
    let fx = 0
    let coll = 0
    if (this.occupied) {
      fz = input.axis('back', 'forward')
      fx = input.axis('left', 'right')
      coll = (input.down('ascend') ? 1 : 0) - (input.down('descend') ? 1 : 0)
      const look = input.look()
      G.player.lastLook = look
      this.yaw -= look.dx * 1.1 * Math.max(0.15, this.rpm)
      this.lookPitch = clamp(this.lookPitch - look.dy, -0.9, 0.6)
      if (input.pressed('camera')) this.toggleView()
      if (input.pressed('interact')) this.exit()
      // fuel burns while the rotor is turning, not while you sit in a wreck
      if (working && this.rpm > 0.3) this.fuel = Math.max(0, this.fuel - dt * T.fuelBurn)
      if (this.fuel <= 0 && working) G.toast('Out of fuel!', 'warn')
    }
    if (this.parked && !this.occupied && this.rpm < 0.01) {
      // sitting still with the rotor stopped: nothing to simulate
      this.updateCommon(dt, 0)
      G.audio?.setRotor(0, this.pos, false)
      this.sync()
      return
    }
    // leftover spin from a tail strike
    this.yaw += this.spin * dt
    this.spin = damp(this.spin, 0, this.onGround ? 6 : 1.2, dt)
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
    // ground cushion: near the ground a healthy rotor eases the sink rate, so
    // holding Shift all the way down is a landing, not a crash
    const C = T.cushion
    if (working && this.rpm > C.rpm && !this.onGround && this.vel.y < 0) {
      const below = this.pos.y - Math.max(G.physics.groundAt(this.pos.x, this.pos.z, this.pos.y + 1.5), isl.waterAt(this.pos.x, this.pos.z) - 0.2)
      if (below < C.agl) this.vel.y = Math.max(this.vel.y, -lerp(C.sink, C.from, Math.max(0, below) / C.agl))
    }
    this.pos.addScaledVector(this.vel, dt)
    this.pos.y = Math.min(this.pos.y, 430)
    this.pos.x = clamp(this.pos.x, -isl.half + 30, isl.half - 30)
    this.pos.z = clamp(this.pos.z, -isl.half + 30, isl.half - 30)

    this.collideStatics()

    // ground / water contact — closing speed into the surface, so flying into
    // a hillside hurts as much as dropping onto it
    const gnd = Math.max(G.physics.groundAt(this.pos.x, this.pos.z, this.pos.y + 1.5), isl.waterAt(this.pos.x, this.pos.z) - 0.2)
    if (this.pos.y <= gnd) {
      const onTerrain = Math.abs(gnd - isl.heightAt(this.pos.x, this.pos.z)) < 0.05
      if (onTerrain) isl.normalAt(this.pos.x, this.pos.z, _n)
      else _n.set(0, 1, 0)
      const closing = -this.vel.dot(_n)
      this.pos.y = gnd
      this.onGround = true // before the damage, so a wreck on touchdown says so
      const I = T.impact.terrain
      if (closing > I.min) this.damage((closing - I.min) * I.k, new THREE.Vector3(this.pos.x, gnd + 0.2, this.pos.z))
      if (this.vel.y < 0) this.vel.y = 0
      this.vel.x *= Math.max(0, 1 - dt * 4)
      this.vel.z *= Math.max(0, 1 - dt * 4)
    } else this.onGround = this.pos.y - gnd < 0.05
    const agl = this.pos.y - gnd
    if (this.occupied && agl > 8 && !G.flags.get('heliFlown')) G.flags.set('heliFlown')

    // noise, dust and rotor wash
    let noise = 0
    if (this.rpm > 0.3) {
      noise = T.noise.radius * this.rpm * clamp(1.4 - agl / 150, 0.3, 1)
      if (agl < 14 && Math.random() < this.rpm) G.fx.rotorDust({ x: this.pos.x, y: gnd, z: this.pos.z }, 6)
      if (this.occupied) G.veg.setPush(this.pos.x, this.pos.z, 22, this.rpm * clamp(1.5 - agl / 25, 0, 1.5))
    }
    this.updateCommon(dt, noise)
    G.audio?.setRotor(this.rpm, this.pos, this.inside)
    this.sync()
  }

  // Trunks, walls, masts — tested by the cabin, the boom and the tail rotor.
  // Each group of parts resolves only its deepest contact per frame: one
  // push, one bounce, one damage.
  collideStatics() {
    _contacts.clear()
    for (const s of this.tune.flight) {
      const c = s.z0 !== undefined ? this.capsuleContact(s) : this.circleContact(s)
      if (!c) continue
      const prev = _contacts.get(s.group)
      if (!prev || c.depth > prev.depth) _contacts.set(s.group, c)
    }
    for (const c of _contacts.values()) this.resolveContact(c)
  }

  // A circle part: where it is, and the push that clears it.
  circleContact(s) {
    const w = this.toWorld(s.x, s.z)
    const ox = w.x
    const oz = w.z
    _c.x = ox
    _c.z = oz
    if (!this.G.physics.collideCircle(_c, s.r, this.pos.y + s.y0, this.pos.y + s.y1, this.ownCollider)) return null
    const px = _c.x - ox
    const pz = _c.z - oz
    const depth = Math.hypot(px, pz)
    return depth < 1e-6 ? null : { s, ox, oz, px, pz, depth, r: s.r }
  }

  // The boom as a capsule tapering from r0 at z0 to r1 at z1: for each
  // nearby static, the point along the boom that digs into it deepest, then
  // the same push a circle there would get.
  capsuleContact(s) {
    const ph = this.G.physics
    const y0 = this.pos.y + s.y0
    const y1 = this.pos.y + s.y1
    const a = this.toWorld(0, s.z0)
    const ax = a.x
    const az = a.z
    const b = this.toWorld(0, s.z1)
    const ex = b.x - ax
    const ez = b.z - az
    const len2 = ex * ex + ez * ez
    let best = null
    const list = ph.nearby(ax + ex / 2, az + ez / 2, Math.sqrt(len2) / 2 + s.r0 + 2).slice()
    for (const col of list) {
      if (col.y1 <= y0 || col.y0 >= y1 || col.ref === this) continue
      // the boom point nearest the static: exact for a trunk, sampled for a box
      let t = 0
      if (col.type === 'cyl') t = clamp(((col.x - ax) * ex + (col.z - az) * ez) / len2, 0, 1)
      else {
        let worst = Infinity
        for (let i = 0; i <= 12; i++) {
          const ti = i / 12
          const [lx, lz] = ph.toLocal(col, ax + ex * ti, az + ez * ti)
          const d = Math.hypot(Math.max(0, Math.abs(lx) - col.hx), Math.max(0, Math.abs(lz) - col.hz)) - lerp(s.r0, s.r1, ti)
          if (d < worst) {
            worst = d
            t = ti
          }
        }
      }
      const r = lerp(s.r0, s.r1, t)
      const ox = ax + ex * t
      const oz = az + ez * t
      _c.x = ox
      _c.z = oz
      _only = col
      if (!ph.collideCircle(_c, r, y0, y1, onlyThat)) continue
      const px = _c.x - ox
      const pz = _c.z - oz
      const depth = Math.hypot(px, pz)
      if (depth > 1e-6 && (!best || depth > best.depth)) best = { s, ox, oz, px, pz, depth, r }
    }
    _only = null
    return best
  }

  // Push out, bounce, and charge the hit. The cabin takes the whole push; a
  // struck tail mostly swings aside — part translation, part yaw and spin.
  resolveContact({ s, ox, oz, px, pz, depth, r }) {
    const I = this.tune.impact
    const nx = px / depth
    const nz = pz / depth
    // velocity of this part, including any spin about the mast
    const lx = ox - this.pos.x
    const lz = oz - this.pos.z
    const vx = this.vel.x + this.spin * lz
    const vz = this.vel.z - this.spin * lx
    const closing = -(vx * nx + vz * nz)
    if (s.part === 'cabin') {
      this.pos.x += px
      this.pos.z += pz
    } else {
      this.pos.x += px * 0.4
      this.pos.z += pz * 0.4
      const r2 = lx * lx + lz * lz || 1
      const dYaw = (px * 0.6 * lz - pz * 0.6 * lx) / r2
      this.yaw += dYaw
      if (closing > 0.5) this.spin += Math.sign(dYaw || 1) * I.spin * Math.min(1, closing / 6)
    }
    const vn = this.vel.x * nx + this.vel.z * nz
    if (vn < 0) {
      this.vel.x -= nx * vn * (1 + I.bounce)
      this.vel.z -= nz * vn * (1 + I.bounce)
    }
    const k = I[s.part]
    this.lastHitPart = s.part
    if (closing > k.min) {
      const at = new THREE.Vector3(ox + px - nx * r, this.pos.y + (s.y0 + s.y1) / 2, oz + pz - nz * r)
      this.damage(Math.min(I.maxHit, (closing - k.min) * k.k), at)
    }
  }

  sync() {
    this.model.position.copy(this.pos)
    this.model.rotation.set(-this.pitch, this.yaw, -this.roll)
  }

  // Cockpit seat: the view tilts with the airframe.
  seatCamera(cam) {
    const s = this.tune.seat
    _seat.set(s[0], s[1], s[2]).applyEuler(this.model.rotation).add(this.pos)
    cam.position.copy(_seat)
    cam.rotation.set(-this.pitch * 0.6 + this.lookPitch * 0.8, this.yaw, -this.roll * 0.8)
    this.camYaw = this.yaw
  }

  // Third-person chase cam, swinging round behind the tail.
  chaseCamera(cam, dt) {
    const C = this.tune.chase
    this.camYaw = dampAngle(this.camYaw, this.yaw, 3, dt)
    const up = C.up + this.lookPitch * -6
    const cx = this.pos.x - yawDirX(this.camYaw) * C.back
    const cz = this.pos.z - yawDirZ(this.camYaw) * C.back
    let cy = this.pos.y + up
    cy = Math.max(cy, this.G.island.heightAt(cx, cz) + 1.5)
    const k = Math.min(1, dt * 8)
    cam.position.set(lerp(cam.position.x, cx, k), lerp(cam.position.y, cy, k), lerp(cam.position.z, cz, k))
    cam.lookAt(this.pos.x + yawDirX(this.camYaw) * 8, this.pos.y + 1.5, this.pos.z + yawDirZ(this.camYaw) * 8)
  }
}
