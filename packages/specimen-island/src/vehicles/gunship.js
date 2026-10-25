import * as THREE from 'three'
import { clamp, dampAngle, lerp, yawDirX, yawDirZ, yawTo } from '../core/mathx.js'
import { GUNSHIP } from '../data/vehicles.js'
import { MISSILES } from '../data/missiles.js'
import { paintedMetal } from '../world/textures.js'
import { Seeker, missileModel } from '../game/missiles.js'
import { Helicopter } from './helicopter.js'
import { Parts, findWinchSpot } from './jeep.js'

// The attack helicopter the garrison left behind: the station heli's flight
// model with the GUNSHIP tune (faster, twitchier, thirstier, armoured), a
// tandem two-seat cockpit, and eight heat-seeking missiles on its stub
// wings. Hold RMB / LT and the seeker looks along your sight for something
// hot; a rising tone builds to a steady one when it locks. LMB / RT fires —
// at the lock, or straight ahead when there is none. Empty rails are loaded
// at the munitions point beside its pad, with it parked on the pad.
//
// Every missile is billed to the ledger and anything it kills is the
// player's kill (game/missiles.js, game/blast.js): the loudest way there is
// to do field biology.

const _sight = new THREE.Vector3()
const _probe = { x: 0, z: 0 }

export class Gunship extends Helicopter {
  // On the military base's pad (poi.milbase.pad / padYaw) when the island has
  // one; else on the nearest clear, level patch to tune.spawn, with room all
  // round for the rotor (findPad).
  static atBase(G, tune = GUNSHIP) {
    const base = G.island.poi.milbase
    if (base?.pad) return new Gunship(G, base.pad.clone(), base.padYaw ?? 0, tune)
    const spot = findPad(G, tune.spawn)
    return new Gunship(G, spot.pos, spot.yaw, tune)
  }

  constructor(G, pos, yaw, tune = GUNSHIP) {
    super(G, pos, yaw, tune)
    this.weapon = MISSILES[tune.weapons.missile]
    this.missiles = tune.weapons.rails.length
    this.reloadT = 0
    this.seeker = new Seeker(G, this)
    this.home = pos.clone()
    this.homeYaw = yaw
    this.buildRearmPoint()
  }

  boardLabel() {
    const base = super.boardLabel()
    return this.fuel > this.tune.dry ? `${base} · ${this.missiles}/${this.tune.weapons.rails.length} missiles` : base
  }

  // Its own pad is only where it rearms: there is no pump there, so it is not
  // one of pads() — run dry at home and the reserve tank gets it to the Field
  // Lab pump like anywhere else.
  atHome() {
    return this.onGround && this.pos.distanceTo(this.home) <= this.tune.rearm.range
  }

  // Armour: only a share of every hit reaches the hull.
  damage(amount, at = null, injure = true) {
    super.damage(amount * (this.tune.armour ?? 1), at, injure)
  }

  onExit(force) {
    super.onExit(force)
    this.seeker.reset()
    this.G.audio?.setSeeker('off')
  }
  onDestroyed() {
    super.onDestroyed()
    this.seeker.reset()
    this.G.audio?.setSeeker('off')
  }

  update(dt, input) {
    super.update(dt, input)
    this.reloadT = Math.max(0, this.reloadT - dt)
    // from the pilot's seat: no glass in the way, and the rotor overhead a blur
    const inside = this.inside
    this.glass.visible = !inside
    if (inside && this.rpm >= 0.85) for (const c of this.rotor.children) if (c.isGroup) c.visible = false
    if (!this.occupied) return
    // the seeker looks where the pilot looks: along the camera, out of the nose turret
    const sk = this.seeker
    this.modelPoint(this.tune.sensor, sk.origin)
    this.G.camera.getWorldDirection(sk.axis)
    sk.update(dt, this.health > 0 && input.down('aim'))
    if (input.pressed('fire')) this.fire()
    this.G.audio?.setSeeker(sk.mode, sk.progress)
  }

  // One missile off the next rail: at the locked target, or unguided at the
  // middle of the screen (the sight mark).
  fire() {
    const G = this.G
    if (this.reloadT > 0 || this.destroyed) return
    const rails = this.tune.weapons.rails
    if (this.missiles <= 0) {
      G.audio?.play('empty')
      G.toast('Rails empty — rearm at the munitions point beside the gunship pad.', 'warn')
      return
    }
    const i = rails.length - this.missiles
    this.railMissiles[i].visible = false
    const from = this.modelPoint(rails[i], new THREE.Vector3())
    const target = this.seeker.locked ? this.seeker.target : null
    // locked, it leaves along the sight and steers itself; unguided, it is
    // aimed off the rail to cross the sight where the sight meets the ground
    const dir = target ? _sight.copy(this.seeker.axis) : G.missiles.boresight(from, this.vel, G.camera.position, this.seeker.axis, this.weapon, _sight)
    G.missiles.launch(this, from, this.vel, dir, target, this.weapon)
    this.missiles--
    this.reloadT = this.weapon.reload
    if (!target) G.toast('No lock — missile away unguided.', 'info', 2.5)
  }

  rearm() {
    const G = this.G
    this.missiles = this.tune.weapons.rails.length
    for (const m of this.railMissiles) m.visible = true
    G.audio?.play('rearm', { pos: this.pos })
    G.toast(`Gunship rearmed — ${this.missiles} missiles on the rails. Every launch is charged to the ledger.`, 'info', 6)
    G.events.emit('vehicle:rearmed', { vehicle: this, missiles: this.missiles })
  }

  // Third person behind the rotor on the line of the pilot's sight: the middle
  // of the screen is where the seeker looks (mouse up/down raises and lowers
  // it) and the gunship sits below it rather than over the target.
  chaseCamera(cam, dt) {
    const C = this.tune.chase
    this.camYaw = dampAngle(this.camYaw, this.yaw, 3, dt)
    const e = this.lookPitch
    const fx = yawDirX(this.camYaw) * Math.cos(e)
    const fy = Math.sin(e)
    const fz = yawDirZ(this.camYaw) * Math.cos(e)
    const cx = this.pos.x - fx * C.back
    const cz = this.pos.z - fz * C.back
    const cy = Math.max(this.pos.y + C.up - fy * C.back, this.G.island.heightAt(cx, cz) + 1.5)
    const k = Math.min(1, dt * 8)
    cam.position.set(lerp(cam.position.x, cx, k), lerp(cam.position.y, cy, k), lerp(cam.position.z, cz, k))
    cam.rotation.set(clamp(e, -1.2, 1), this.camYaw, 0)
  }

  // ------------------------------------------------------------ munitions point
  // A trolley of missile crates at the edge of the pad (tune.rearm.at, in the
  // pad's frame — or the first clear spot round the pad at that distance,
  // level with the pad if any is), registered here rather than with the
  // base's prefab so the gunship brings it wherever it is parked.
  buildRearmPoint() {
    const G = this.G
    const R = this.tune.rearm
    const c = Math.cos(this.homeYaw)
    const s = Math.sin(this.homeYaw)
    const r = Math.hypot(R.at[0], R.at[1])
    const a0 = Math.atan2(R.at[0], R.at[1])
    let spot = null
    for (let k = 0; k < 12; k++) {
      const a = a0 + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * (Math.PI / 6)
      const lx = Math.sin(a) * r
      const lz = Math.cos(a) * r
      const px = this.home.x + lx * c + lz * s
      const pz = this.home.z - lx * s + lz * c
      const py = G.physics.groundAt(px, pz, this.home.y + 2)
      _probe.x = px
      _probe.z = pz
      if (G.physics.collideCircle(_probe, 1.2, py + 0.3, py + 1.6) || G.island.depthAt(px, pz) >= 0.1) continue
      spot ||= [px, py, pz]
      if (Math.abs(py - this.home.y) < R.level) {
        spot = [px, py, pz]
        break
      }
    }
    // nowhere clear round the pad at all: the designed spot regardless
    if (!spot) {
      const px = this.home.x + R.at[0] * c + R.at[1] * s
      const pz = this.home.z - R.at[0] * s + R.at[1] * c
      spot = [px, G.physics.groundAt(px, pz, this.home.y + 2), pz]
    }
    const [x, y, z] = spot
    const olive = drab(0x525a3a)
    const dark = new THREE.MeshLambertMaterial({ color: 0x22251f })
    const yellow = new THREE.MeshLambertMaterial({ color: 0xc9a634 })
    const g = new THREE.Group()
    const P = new Parts()
    P.box(dark, 1.9, 0.08, 0.95, 0, 0.42, 0) // bed
    for (const sx of [-0.85, 0.85]) for (const sz of [-0.38, 0.38]) P.cyl(dark, 0.14, 0.14, 0.08, 10, sx, 0.16, sz, 0, 0, Math.PI / 2)
    for (const sx of [-0.85, 0.85]) P.box(dark, 0.06, 0.26, 0.8, sx, 0.29, 0)
    P.tube(dark, 0.025, [-0.95, 0.46, 0], [-1.55, 0.95, 0]) // tow bar
    for (const k of [0, 1]) {
      P.box(olive, 1.75, 0.34, 0.4, 0, 0.64 + k * 0.36, -0.2 + k * 0.08) // missile crates
      P.box(yellow, 1.76, 0.05, 0.41, 0, 0.7 + k * 0.36, -0.2 + k * 0.08)
    }
    P.box(olive, 0.5, 0.45, 0.35, 0.6, 0.69, 0.27)
    P.build(g)
    const spare = missileModel()
    spare.position.set(-0.2, 0.62, 0.27)
    spare.rotation.y = Math.PI / 2
    g.add(spare)
    g.traverse((o) => {
      if (o.isMesh) o.castShadow = o.receiveShadow = true
    })
    g.position.set(x, y, z)
    g.rotation.y = this.homeYaw
    G.scene.add(g)
    G.physics.addBox(x, z, 1.0, 0.5, this.homeYaw, y, y + 1.25, { walkable: false, tag: 'prop' })
    this.rearmPoint = new THREE.Vector3(x, y, z)
    const n = this.tune.weapons.rails.length
    G.interact.add({
      id: 'gunshipRearm',
      x,
      y: y + 1.0,
      z,
      radius: 2.6,
      hold: R.hold,
      label: () => (this.missiles < n ? `Rearm the gunship (${this.missiles}/${n} missiles)` : `Gunship munitions — rails full (${n}/${n})`),
      enabled: () => {
        if (this.occupied) return 'In use'
        if (!this.atHome()) return 'Park the gunship on its pad to rearm it'
        if (this.missiles >= n) return 'Rails full'
        return true
      },
      onUse: () => this.rearm(),
    })
  }

  // ------------------------------------------------------------ model
  // Local frame as the station heli: nose to -Z, skids on y = 0. A slim
  // fuselage with the gunner's canopy low in front and the pilot's raised
  // behind, twin turbines on the spine, stub wings carrying the rails, a
  // four-blade rotor, and faded markings on a dark olive skin.
  buildModel() {
    const T = this.tune
    const L = (o) => new THREE.MeshLambertMaterial(o)
    const olive = drab(0x4a5434)
    const dark = L({ color: 0x20231f })
    const black = L({ color: 0x121312 })
    const sensor = new THREE.MeshPhongMaterial({ color: 0x1a1f24, shininess: 90, specular: 0x667788 })
    const glass = new THREE.MeshPhongMaterial({ color: 0x2a3a3a, transparent: true, opacity: 0.6, shininess: 120, specular: 0x99bbbb, depthWrite: false })
    const frame = L({ color: 0x1b1d1a })
    const g = new THREE.Group()
    g.rotation.order = 'YXZ'
    const P = new Parts()

    // fuselage: a slim keel, the rounded nose, the spine behind the cockpit
    P.box(olive, 1.12, 1.05, 4.3, 0, 1.12, -0.55)
    P.add(olive, new THREE.SphereGeometry(1, 16, 10).scale(0.56, 0.52, 1.05), 0, 1.12, -2.7)
    P.box(olive, 0.92, 0.62, 2.3, 0, 1.92, 0.65) // spine, from behind the pilot's seat
    P.box(olive, 0.98, 0.3, 1.45, 0, 1.6, -1.225) // cockpit sills
    // tandem canopies: the gunner low in front, the pilot raised behind, each
    // on a dark frame (the pilot's open at the top front, so his sight is clear)
    P.box(glass, 0.9, 0.5, 1.15, 0, 1.97, -2.05, 0.12)
    P.box(glass, 0.9, 0.74, 1.05, 0, 2.19, -0.92, 0.06)
    canopyFrame(P, frame, [0.9, 0.5, 1.15], [0, 1.97, -2.05], 0.12, FRAME_EDGES)
    canopyFrame(P, frame, [0.9, 0.74, 1.05], [0, 2.19, -0.92], 0.06, FRAME_EDGES.slice(0, -1))
    // the front seat: the gunner's instrument shroud and his empty seat, seen
    // over the pilot's own glare shield and panel (T.seat looks out over them)
    P.box(dark, 0.7, 0.08, 0.3, 0, 1.98, -2.32)
    P.box(dark, 0.42, 0.5, 0.08, 0, 1.86, -1.62)
    P.box(black, 0.26, 0.16, 0.1, 0, 2.1, -1.62)
    P.box(dark, 0.8, 0.045, 0.2, 0, 2.15, -1.37) // the pilot's glare shield
    P.box(dark, 0.78, 0.35, 0.04, 0, 1.8, -1.17)
    P.box(dark, 0.86, 0.03, 0.67, 0, 1.765, -0.835) // his footwell
    // chin turret: the seeker's window, and a cannon under it
    P.add(sensor, new THREE.SphereGeometry(0.27, 14, 10), 0, T.sensor[1], T.sensor[2])
    P.cyl(dark, 0.07, 0.07, 1.3, 8, 0, 0.62, -2.6, Math.PI / 2)
    P.box(dark, 0.3, 0.22, 0.4, 0, 0.66, -1.95)
    // twin turbines, intakes forward, exhausts kicked up and out at the back
    for (const sx of [-1, 1]) {
      P.cyl(olive, 0.31, 0.33, 1.9, 12, sx * 0.66, 2.0, 0.72, Math.PI / 2)
      P.cyl(black, 0.25, 0.25, 0.06, 12, sx * 0.66, 2.0, -0.25, Math.PI / 2)
      P.cyl(dark, 0.2, 0.26, 0.45, 10, sx * 0.72, 2.1, 1.8, Math.PI / 2 - 0.35, 0, -sx * 0.25)
    }
    P.cyl(dark, 0.1, 0.13, 0.75, 8, 0, 2.6, 0.3) // rotor mast
    // tail boom, fin and tail plane
    P.add(olive, new THREE.CylinderGeometry(0.2, 0.42, 5.6, 12).rotateX(Math.PI / 2), 0, 1.78, 4.25)
    P.box(olive, 0.12, 1.7, 1.0, -0.02, 2.4, 7.25, -0.32)
    P.box(olive, 1.6, 0.06, 0.5, 0, 1.68, 6.95)
    for (const sx of [-0.8, 0.8]) P.box(olive, 0.05, 0.36, 0.4, sx, 1.75, 6.98)
    // stub wings with a touch of anhedral, two pylons a side, the launch rails
    for (const sx of [-1, 1]) {
      P.box(olive, 2.0, 0.1, 0.95, sx * 1.5, 1.4, 0.35, 0, 0, sx * -0.05)
      for (const px of [1.75, 2.25]) {
        P.box(dark, 0.08, 0.2, 0.6, sx * px, 1.22, 0.25)
        P.box(dark, 0.22, 0.04, 1.5, sx * px, 1.12, 0.15)
        P.box(dark, 0.22, 0.04, 1.5, sx * px, 0.86, 0.15)
        P.box(dark, 0.04, 0.3, 1.3, sx * px, 0.98, 0.15)
      }
    }
    // skids on their cross tubes, toes turned up
    for (const sx of [-1, 1]) {
      P.cyl(dark, 0.06, 0.06, 3.7, 8, sx * 0.98, 0.08, -0.45, Math.PI / 2)
      P.cyl(dark, 0.06, 0.06, 0.5, 8, sx * 0.98, 0.2, -2.45, Math.PI / 2 - 0.6)
      for (const z of [-1.55, 0.7]) P.tube(dark, 0.05, [sx * 0.98, 0.08, z], [sx * 0.45, 0.66, z])
    }
    P.build(g)
    // the canopy glass, which the pilot's own view looks out through rather than at
    this.glass = g.children.find((o) => o.material === glass)
    // the pilot's instruments, tilted up to his eye and lit from within
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(0.74, 0.24), new THREE.MeshBasicMaterial({ map: instrumentPanel(), color: 0xb8b8b8 }))
    panel.position.set(0, 2.02, -1.24)
    panel.rotation.x = -0.5
    g.add(panel)

    // the missiles on their rails, hidden as they are fired
    this.railMissiles = T.weapons.rails.map(([x, y, z]) => {
      const m = missileModel()
      m.position.set(x, y, z)
      g.add(m)
      return m
    })

    // faded markings: a roundel either side of the boom, the serial on the fin
    const decal = markings()
    for (const sx of [-1, 1]) {
      const r = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), new THREE.MeshLambertMaterial({ map: decal.roundel, transparent: true, depthWrite: false }))
      r.position.set(sx * 0.37, 1.8, 3.2)
      r.rotation.y = (sx * Math.PI) / 2
      g.add(r)
      const n = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.32), new THREE.MeshLambertMaterial({ map: decal.serial, transparent: true, depthWrite: false }))
      n.position.set(sx * 0.075 - 0.02, 2.35, 7.3)
      n.rotation.y = (sx * Math.PI) / 2
      g.add(n)
    }

    // main rotor: four blades on the hub; each arm a group so the blur can thin them
    const rotor = new THREE.Group()
    rotor.position.set(0, 3.02, 0.3)
    const blade = new THREE.BoxGeometry(0.42, 0.05, 6.2).translate(0, 0, 3.25)
    for (let i = 0; i < 4; i++) {
      const arm = new THREE.Group()
      arm.rotation.y = (i * Math.PI) / 2
      arm.add(new THREE.Mesh(blade, black))
      rotor.add(arm)
    }
    rotor.add(new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.22, 10), dark))
    const disc = new THREE.Mesh(new THREE.CircleGeometry(6.5, 36), new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }))
    disc.rotation.x = -Math.PI / 2
    rotor.add(disc)
    g.add(rotor)
    // tail rotor on the left of the fin, four blades (two crossed bars) turning about X
    const tail = new THREE.Group()
    tail.position.set(-0.2, 2.75, 7.45)
    for (let i = 0; i < 2; i++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.5, 0.14), black)
      b.rotation.x = (i * Math.PI) / 2
      tail.add(b)
    }
    g.add(tail)
    g.traverse((o) => {
      if (o.isMesh && o !== disc && !o.material.transparent) o.castShadow = true
    })
    this.disc = disc
    this.rotor = rotor
    this.tail = tail
    this.model = g
    this.G.scene.add(g)
    this.sync()
  }
}

// ------------------------------------------------------------ somewhere to park

// With no base on the island: the clear-ground search the jeep uses round
// S.x, S.z, if what it finds is clear under the whole rotor disc; failing
// that, rings out to S.search taking the nearest spot that is (padCost 0), or
// on an island with none the best of them — never the raw point, which on a
// rough seed is a jungle slope with a palm through the rotor.
function findPad(G, S) {
  const isl = G.island
  const from = new THREE.Vector3(S.x, isl.heightAt(S.x, S.z), S.z)
  const strict = findWinchSpot(G, from, S.range, S.clearance)
  if (strict && padCost(G, strict.pos.x, strict.pos.z, S.pad) === 0) return strict
  let best = null
  let bestCost = Infinity
  for (let r = S.step; r <= S.search; r += S.step) {
    const n = Math.max(8, Math.round((2 * Math.PI * r) / S.step))
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      const x = S.x + Math.sin(a) * r
      const z = S.z + Math.cos(a) * r
      const cost = padCost(G, x, z, S.pad)
      if (cost < bestCost) {
        bestCost = cost
        best = { pos: new THREE.Vector3(x, isl.heightAt(x, z), z), yaw: yawTo(S.x, S.z, x, z) }
        if (cost === 0) return best
      }
    }
  }
  return best || { pos: from, yaw: 0 }
}

// How bad a pad (x, z) would be, 0 for a good one: ground under the disc
// (centre and two rings) more than P.level off level, trunks or walls within
// P.radius standing into the rotor's sweep, road underneath; wet ground, a
// roof overhead or the island's edge rule it out.
function padCost(G, x, z, P) {
  const isl = G.island
  if (Math.abs(x) > isl.half - P.edge || Math.abs(z) > isl.half - P.edge) return Infinity
  const y = isl.heightAt(x, z)
  if (G.physics.ceilingAt(x, z, y + 0.5) < y + 5) return Infinity
  let spread = 0
  let road = 0
  for (let k = 0; k <= 16; k++) {
    const r = k === 0 ? 0 : k <= 8 ? P.radius / 2 : P.radius
    const a = (k * Math.PI) / 4
    const px = x + Math.sin(a) * r
    const pz = z + Math.cos(a) * r
    if (isl.depthAt(px, pz) > 0) return Infinity
    spread = Math.max(spread, Math.abs(isl.heightAt(px, pz) - y))
    if (isl.sample(isl.road, px, pz) > 0.05) road++
  }
  let blocked = 0
  for (const c of G.physics.nearby(x, z, P.radius + 2)) {
    if (c.y1 < y + 0.4 || c.y0 > y + 4) continue
    let d
    if (c.type === 'cyl') d = Math.hypot(x - c.x, z - c.z) - c.r
    else {
      const [lx, lz] = G.physics.toLocal(c, x, z)
      d = Math.hypot(Math.max(0, Math.abs(lx) - c.hx), Math.max(0, Math.abs(lz) - c.hz))
    }
    if (d < P.radius) blocked++
  }
  return Math.max(0, spread - P.level) * 4 + blocked * 3 + road * 2
}

// The edges of a canopy box ([w, h, d] at [x, y, z], tipped rx about X) as
// frame tubes. Corners are numbered by bits: x+ (1), top (2), back (4). The
// front bow comes last, so slice(0, -1) leaves a canopy open at the top front.
const FRAME_EDGES = [
  [0, 2], [1, 3], [4, 6], [5, 7], // pillars
  [0, 4], [1, 5], // sills
  [2, 6], [3, 7], // roof rails
  [6, 7], // rear bow
  [2, 3], // front bow
]
const _e = new THREE.Euler()
function canopyFrame(P, mat, [w, h, d], [x, y, z], rx, edges) {
  _e.set(rx, 0, 0)
  const at = (i) => new THREE.Vector3(i & 1 ? w / 2 : -w / 2, i & 2 ? h / 2 : -h / 2, i & 4 ? d / 2 : -d / 2).applyEuler(_e).add(new THREE.Vector3(x, y, z)).toArray()
  for (const [a, b] of edges) P.tube(mat, 0.018, at(a), at(b))
}

// The pilot's panel: two dim green displays, flight and weapons.
function instrumentPanel() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 84
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#1b1e1b'
  ctx.fillRect(0, 0, 256, 84)
  for (const x of [14, 146]) {
    ctx.fillStyle = '#0b1a10'
    ctx.fillRect(x, 6, 96, 72)
    ctx.strokeStyle = '#5fe07a'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    if (x < 100) {
      // attitude: a horizon, a pitch ladder and the aircraft mark
      ctx.moveTo(x + 6, 44)
      ctx.lineTo(x + 90, 40)
      for (const dy of [-14, 14]) {
        ctx.moveTo(x + 36, 42 + dy)
        ctx.lineTo(x + 60, 42 + dy)
      }
      ctx.moveTo(x + 38, 42)
      ctx.lineTo(x + 46, 42)
      ctx.lineTo(x + 48, 46)
      ctx.lineTo(x + 50, 42)
      ctx.lineTo(x + 58, 42)
    } else {
      // the weapons page: the rails, two rows of four
      for (let i = 0; i < 4; i++) for (const row of [18, 46]) ctx.rect(x + 12 + i * 20, row, 12, 16)
    }
    ctx.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// Olive drab gone matt in the sun: light painted metal under an olive tint,
// so its chips read as dark worn patches rather than the rust of the others.
function drab(color) {
  return new THREE.MeshLambertMaterial({ map: paintedMetal([232, 232, 222]), color })
}

// Stencilled markings, sun-faded and flaking: a star roundel and the serial.
function markings() {
  const wear = (ctx, w, h, n) => {
    ctx.globalCompositeOperation = 'destination-out'
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = `rgba(0,0,0,${0.3 + Math.random() * 0.6})`
      ctx.beginPath()
      ctx.arc(Math.random() * w, Math.random() * h, 1 + Math.random() * 5, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalCompositeOperation = 'source-over'
  }
  const tex = (c) => {
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }
  const a = document.createElement('canvas')
  a.width = a.height = 128
  let ctx = a.getContext('2d')
  ctx.fillStyle = 'rgba(32, 36, 30, 0.75)'
  ctx.beginPath()
  ctx.arc(64, 64, 60, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(206, 202, 182, 0.7)'
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? 22 : 54
    const t = -Math.PI / 2 + (i * Math.PI) / 5
    ctx.lineTo(64 + Math.cos(t) * r, 64 + Math.sin(t) * r)
  }
  ctx.closePath()
  ctx.fill()
  wear(ctx, 128, 128, 70)
  const b = document.createElement('canvas')
  b.width = 256
  b.height = 96
  ctx = b.getContext('2d')
  ctx.fillStyle = 'rgba(206, 202, 182, 0.66)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = 'bold 54px "Courier New", monospace'
  ctx.fillText('04-117', 128, 50)
  wear(ctx, 256, 96, 90)
  return { roundel: tex(a), serial: tex(b) }
}
