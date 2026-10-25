import * as THREE from 'three'
import { WEAPONS, ZONES, ARMOR, THROWABLES } from '../data/weapons.js'
import { damp } from '../core/mathx.js'
import { ViewModels } from './viewmodels.js'

// The weapon system: selection, aiming, firing, reloading, the scanner's
// hold-to-scan, the field camera (player/photos.js grades the shots), the
// jumbo syringe's jab, thrown stones and flares, medkits. Every shot
// announces itself on the bus as a noise — loud guns are heard across half the
// island.

const _dir = new THREE.Vector3()
const _right = new THREE.Vector3()
const _up = new THREE.Vector3()

export class Weapons {
  constructor(G) {
    this.G = G
    this.current = 'scanner'
    // rounds loaded in each weapon that takes ammo: the pistol comes loaded,
    // the rest load from whatever is found with them
    this.mag = Object.fromEntries(Object.values(WEAPONS).filter((w) => w.ammo).map((w) => [w.id, 0]))
    this.mag.pistol = WEAPONS.pistol.mag
    this.jabT = 0 // a jab in flight: seconds until the needle goes in
    this.aim = 0
    this.fireCool = 0
    this.reloadT = 0
    this.switchT = 0
    this.pending = null
    this.vm = new ViewModels(G)
    this.scan = { target: null, progress: 0 }
    this.throwCool = 0
    this.baseFov = 72
    this.camZoom = WEAPONS.camera.zoom // the camera's zoom when raised; the wheel sets it
    this.camZoomNow = this.camZoom // ...and where the zoom ring actually is
    G.events.on('weapon:gained', ({ weapon }) => {
      if (this.mag[weapon] === 0 && weapon !== 'scanner') {
        const def = WEAPONS[weapon]
        const take = Math.min(def.mag, G.inventory.count(def.ammo))
        G.inventory.take(def.ammo, take)
        this.mag[weapon] = take
      }
    })
  }

  get def() {
    return WEAPONS[this.current]
  }

  owned() {
    return Object.values(WEAPONS)
      .filter((w) => this.G.inventory.weapons.has(w.id))
      .sort((a, b) => a.slot - b.slot)
  }

  select(id) {
    if (id === this.current || !this.G.inventory.weapons.has(id)) return
    this.pending = id
    this.switchT = 0.32
    this.reloadT = 0
    this.jabT = 0
    this.scan.progress = 0
    this.G.audio?.play('switch')
  }

  zoomFactor() {
    // aboard, a vehicle with a sight (the tank's gunner's sight) sets the zoom
    const v = this.G.vehicle
    if (v) return v.sightZoom || 1
    const d = this.def
    const max = d.kind === 'camera' ? this.camZoomNow : d.zoom || 1
    return 1 + (max - 1) * this.aim
  }

  // The camera is up at the eye: the DOM viewfinder replaces the view model.
  raised() {
    return this.def.kind === 'camera' && this.aim > 0.55 && this.switchT <= 0
  }

  scoped() {
    return !!this.def.scope && this.aim > 0.92 && this.switchT <= 0
  }

  canFire() {
    const p = this.G.player
    return p.alive && !p.swimming && !this.G.vehicle && this.switchT <= 0 && this.reloadT <= 0
  }

  update(dt, input) {
    const G = this.G
    const p = G.player
    this.fireCool -= dt
    this.throwCool -= dt
    const active = p.alive && !G.vehicle

    if (active) {
      // selection
      const list = this.owned()
      for (const w of list) if (input.pressed('slot' + w.slot)) this.select(w.id)
      // with the camera raised the wheel is the zoom ring
      const zoomRing = this.def.kind === 'camera' && this.aim > 0.5 && !this.pending
      if (zoomRing && (input.pressed('nextWeapon') || input.pressed('prevWeapon'))) {
        const d = this.def
        this.camZoom = Math.min(d.zoom, Math.max(d.zoomMin, this.camZoom + (input.pressed('prevWeapon') ? d.zoomStep : -d.zoomStep)))
      } else if (input.pressed('nextWeapon') || input.pressed('prevWeapon')) {
        const i = list.findIndex((w) => w.id === (this.pending || this.current))
        const n = list.length
        const j = (i + (input.pressed('nextWeapon') ? 1 : -1) + n) % n
        this.select(list[j].id)
      }
    }
    if (this.switchT > 0) {
      this.switchT -= dt
      if (this.switchT <= 0.16 && this.pending) {
        this.current = this.pending
        this.pending = null
      }
    }

    const def = this.def
    const wantAim = active && input.down('aim') && this.switchT <= 0 && !p.swimming
    this.aim = damp(this.aim, wantAim ? 1 : 0, def.aimRate || 12, dt)
    this.camZoomNow = damp(this.camZoomNow, this.camZoom, 6, dt)
    G.camera.fov = this.baseFov / this.zoomFactor()
    G.camera.updateProjectionMatrix()

    // reload
    if (this.reloadT > 0) {
      this.reloadT -= dt
      if (this.reloadT <= 0) {
        const need = def.mag - this.mag[def.id]
        const take = Math.min(need, G.inventory.count(def.ammo))
        G.inventory.take(def.ammo, take)
        this.mag[def.id] += take
      }
    } else if (active && def.ammo && input.pressed('reload')) this.startReload()

    // fire
    if (def.kind === 'scanner') this.updateScanner(dt, input, active)
    else if (def.kind === 'camera') G.photos.update(dt, input, active && this.switchT <= 0 && !p.swimming)
    else if (active && input.pressed('fire') && this.fireCool <= 0) {
      if (!this.canFire()) {
        /* busy */
      } else if (this.mag[def.id] > 0) {
        if (def.kind === 'melee') this.jab(def)
        else this.fire(def)
      } else {
        G.audio?.play('empty')
        this.startReload()
      }
    }
    if (this.jabT > 0) {
      this.jabT -= dt
      if (this.jabT <= 0 && active && def.kind === 'melee') this.landJab(def)
    }

    // gadgets
    if (active && this.throwCool <= 0) {
      if (input.pressed('throwStone')) this.throwIt('stone')
      if (input.pressed('throwFlare')) this.throwIt('flare')
    }
    if (active && input.pressed('medkit')) {
      if (p.health >= 100) G.toast('Already at full health', 'info')
      else if (G.inventory.take('medkit')) {
        p.heal(45)
        G.audio?.play('medkit')
        G.toast('Patched up (+45)', 'info')
      } else G.toast('No medkits', 'warn')
    }

    // view model
    const hs = Math.hypot(p.vel.x, p.vel.z)
    this.vm.update(dt, {
      id: G.vehicle ? null : this.current,
      aim: this.aim,
      bob: p.bob,
      moving: p.onGround ? Math.min(1, hs / 5) : 0,
      sprint: input.down('sprint') && hs > 5,
      look: p.lastLook || { dx: 0, dy: 0 },
      reloading: this.reloadT > 0,
      switching: this.switchT > 0,
      hidden: !p.alive || p.swimming || this.scoped() || this.raised(),
      loaded: this.mag[this.current] > 0 && this.reloadT <= 0,
      light: G.sky.light,
    })
  }

  startReload() {
    const def = this.def
    if (!def.ammo || this.reloadT > 0) return
    if (this.mag[def.id] >= def.mag) return
    if (this.G.inventory.count(def.ammo) <= 0) {
      this.G.toast(`Out of ${def.name} ammo`, 'warn')
      return
    }
    this.reloadT = def.reload
    this.G.audio?.play('reload')
  }

  aimRay(spread) {
    const cam = this.G.camera
    _dir.set(0, 0, -1).applyQuaternion(cam.quaternion)
    _right.set(1, 0, 0).applyQuaternion(cam.quaternion)
    _up.set(0, 1, 0).applyQuaternion(cam.quaternion)
    const a = Math.random() * Math.PI * 2
    const r = Math.sqrt(Math.random()) * spread
    return _dir.clone().addScaledVector(_right, Math.cos(a) * r).addScaledVector(_up, Math.sin(a) * r).normalize()
  }

  muzzleWorld() {
    const cam = this.G.camera
    const off = new THREE.Vector3(0.12 * (1 - this.aim), -0.08 * (1 - this.aim) - 0.03, -0.5)
    return off.applyQuaternion(cam.quaternion).add(cam.position)
  }

  fire(def) {
    const G = this.G
    const p = G.player
    this.mag[def.id]--
    this.fireCool = def.rof
    const moving = Math.hypot(p.vel.x, p.vel.z) / 4
    const spread = (def.spread + (def.aimSpread - def.spread) * this.aim) * (1 + moving * 0.8) * (p.crouching ? 0.7 : 1)
    const cam = G.camera
    if (def.kind === 'projectile') {
      const dir = this.aimRay(spread)
      // launch from the eye so the dart flies where the reticle points
      const start = cam.position.clone().addScaledVector(dir, 0.4)
      G.projectiles.spawnDart(start, dir.multiplyScalar(def.speed), def)
    } else {
      const pellets = def.pellets || 1
      for (let i = 0; i < pellets; i++) this.hitscan(def, this.aimRay(spread))
      G.fx.muzzle(this.muzzleWorld(), true)
    }
    p.recoil += def.recoil
    this.vm.fire(def.recoil * 8)
    G.audio?.play(def.id, { pos: p.pos })
    G.events.emit('noise', { x: p.pos.x, y: p.pos.y, z: p.pos.z, radius: def.noise, source: 'player', kind: def.noise > 60 ? 'gunshot' : 'shot' })
    G.events.emit('weapon:fired', { weapon: def.id })
    this.autoReload(def)
  }

  // an emptied weapon reloads itself a beat later, if there is more ammo
  autoReload(def) {
    if (this.mag[def.id] === 0 && this.G.inventory.count(def.ammo) > 0) setTimeout(() => this.current === def.id && this.startReload(), 350)
  }

  // A thrust of the jumbo syringe. The pole swings out and the needle goes in
  // `thrust` seconds later, wherever the view points by then (landJab); the
  // swing itself is all a whiff costs.
  jab(def) {
    const G = this.G
    const p = G.player
    this.fireCool = def.thrust + def.recover
    this.jabT = def.thrust
    this.vm.thrust(def.thrust, def.thrust + def.recover)
    G.audio?.play(def.id, { pos: p.pos })
    G.events.emit('noise', { x: p.pos.x, y: p.pos.y, z: p.pos.z, radius: def.noise, source: 'player', kind: 'shot' })
    G.events.emit('weapon:fired', { weapon: def.id })
  }

  // The needle at full reach: an animal on the view ray within reach takes the
  // whole cartridge (or the zone's share, for a melee weapon with zones). It
  // lands as a dart does — the same takeHit and dart:hit — so hit markers, the
  // animal's sting-and-flee, stats and scoring need nothing new.
  landJab(def) {
    const G = this.G
    const o = G.camera.position
    const dir = this.aimRay(0)
    const hit = G.ecology.raycast(o, dir, def.reach, def.pad)
    if (!hit || !hit.creature.vitals.alive || G.physics.raycast(o.x, o.y, o.z, dir.x, dir.y, dir.z, hit.t)) return
    const c = hit.creature
    const p = o.clone().addScaledVector(dir, hit.t)
    const zone = hit.zone === 'armor' ? ARMOR : ZONES[hit.zone]
    if (zone.dose <= 0) {
      // the needle skids off the plates: nothing goes in and the cartridge is
      // kept, but the animal felt it
      G.fx.sparks(p)
      G.audio?.play('ricochet', { pos: p })
      c.perception.alertTo(G.player.pos, c.perception.awareness + 0.5)
      G.events.emit('dart:hit', { creature: c, zone: zone.label, dose: 0 })
      return
    }
    const dose = def.dose * (def.zones === false ? 1 : zone.dose)
    this.mag[def.id]--
    c.takeHit(G, { dose, zone: hit.zone, weapon: def.id, from: G.player.pos })
    G.events.emit('dart:hit', { creature: c, zone: zone.label, dose })
    G.fx.dartHit(p)
    G.audio?.play('inject', { pos: p })
    this.autoReload(def)
  }

  hitscan(def, dir) {
    const G = this.G
    const o = G.camera.position
    const range = def.range || 300
    const hitC = G.ecology.raycast(o, dir, range)
    const hitW = G.physics.raycast(o.x, o.y, o.z, dir.x, dir.y, dir.z, hitC ? hitC.t : range)
    const end = o.clone().addScaledVector(dir, hitW ? hitW.t : hitC ? hitC.t : range)
    if (Math.random() < 0.5) G.fx.tracer(this.muzzleWorld(), end)
    if (hitC && (!hitW || hitC.t < hitW.t)) {
      const zone = hitC.zone === 'armor' ? ARMOR : ZONES[hitC.zone]
      const dmg = def.damage * zone.damage
      hitC.creature.takeHit(G, { damage: dmg, zone: hitC.zone, weapon: def.id, from: G.player.pos })
      G.fx.blood(end)
      G.events.emit('dart:hit', { creature: hitC.creature, zone: zone.label, damage: dmg })
      G.audio?.play('fleshHit', { pos: end })
    } else if (hitW) {
      if (G.island.waterAt(end.x, end.z) > end.y - 0.1) G.fx.splash(end)
      else G.fx.dust(end, 6)
    }
  }

  updateScanner(dt, input, active) {
    const G = this.G
    const def = this.def
    const s = this.scan
    let info = { line1: 'NO TARGET', line2: 'Hold [LMB] on an animal', line3: '' }
    if (active && this.switchT <= 0) {
      const o = G.camera.position
      const dir = this.aimRay(0)
      const hit = G.ecology.raycast(o, dir, def.range)
      const blocked = hit && G.physics.raycast(o.x, o.y, o.z, dir.x, dir.y, dir.z, hit.t)
      const c = hit && !blocked ? hit.creature : null
      if (c) {
        const known = G.science.known(c.sp.id)
        info = {
          line1: known ? c.sp.name.toUpperCase() : 'UNKNOWN SPECIES',
          line2: c.rec.scanned ? 'CATALOGUED' : `${Math.round(hit.t)} m — hold to scan`,
          line3: known ? `${c.sp.temperament.toUpperCase()}  KO ${c.sp.sedation.ko}u` : '',
        }
        if (input.down('fire') && !c.rec.scanned) {
          if (s.target !== c) {
            s.target = c
            s.progress = 0
          }
          s.progress += dt / (1.0 + hit.t / 50)
          info.progress = s.progress
          if (s.progress >= 1) {
            G.science.scan(c)
            s.progress = 0
            s.target = null
          }
        } else s.progress = Math.max(0, s.progress - dt)
      } else s.progress = Math.max(0, s.progress - dt * 2)
    }
    this.scanning = s.progress > 0
    this.vm.drawScreen(info)
  }

  throwIt(kind) {
    const G = this.G
    const def = THROWABLES[kind]
    if (!G.inventory.take(def.item)) {
      G.toast(`No ${def.label.toLowerCase()}s left`, 'warn')
      return
    }
    this.throwCool = 0.6
    const dir = this.aimRay(0)
    dir.y += 0.18
    dir.normalize()
    const start = G.camera.position.clone().addScaledVector(dir, 0.5)
    G.projectiles.throw(kind, start, dir.multiplyScalar(def.speed).add(G.player.vel.clone().multiplyScalar(0.5)))
    G.audio?.play('throw')
    this.vm.fire(0.4)
  }
}
