import * as THREE from 'three'
import { ZONES, ARMOR, THROWABLES } from '../data/weapons.js'

// Ballistic things the player launches: tranquilliser darts (which stick in
// whatever they hit, hide included), thrown stones (a noise somewhere else —
// the classic distraction) and flares (light and fear for twenty seconds).

const _o = new THREE.Vector3()
const _d = new THREE.Vector3()

function dartMesh() {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.11, 5), new THREE.MeshLambertMaterial({ color: 0xb0b4b8 }))
  body.rotation.x = Math.PI / 2
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.04, 6), new THREE.MeshLambertMaterial({ color: 0xff5a20, emissive: 0x401000 }))
  tail.rotation.x = -Math.PI / 2
  tail.position.z = 0.06
  g.add(body, tail)
  return g
}

export class Projectiles {
  constructor(G) {
    this.G = G
    this.darts = []
    this.stuck = []
    this.thrown = []
    this.flares = []
    this.flareLights = [0, 1].map(() => {
      const l = new THREE.PointLight(0xff4020, 0, 26, 1.8)
      G.scene.add(l)
      return l
    })
  }

  spawnDart(pos, vel, weapon) {
    const mesh = dartMesh()
    mesh.position.copy(pos)
    this.G.scene.add(mesh)
    this.darts.push({ mesh, pos: pos.clone(), vel: vel.clone(), weapon, life: 6 })
  }

  throw(kind, pos, vel) {
    const def = THROWABLES[kind]
    const mesh =
      kind === 'flare'
        ? new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.22, 6), new THREE.MeshLambertMaterial({ color: 0xc02010, emissive: 0x801000 }))
        : new THREE.Mesh(new THREE.IcosahedronGeometry(0.06, 0), new THREE.MeshLambertMaterial({ color: 0x777066 }))
    mesh.position.copy(pos)
    this.G.scene.add(mesh)
    this.thrown.push({ kind, def, mesh, pos: pos.clone(), vel: vel.clone(), life: 8, bounces: 0, spin: new THREE.Vector3(Math.random() * 8, Math.random() * 8, 0) })
  }

  update(dt) {
    const G = this.G
    // --- darts
    for (let i = this.darts.length - 1; i >= 0; i--) {
      const dt_ = this.darts[i]
      const w = dt_.weapon
      dt_.life -= dt
      dt_.vel.y -= w.gravity * dt
      _o.copy(dt_.pos)
      _d.copy(dt_.vel).multiplyScalar(dt)
      const len = _d.length()
      _d.divideScalar(len || 1)
      const hitC = G.ecology.raycast(_o, _d, len)
      const hitW = G.physics.raycast(_o.x, _o.y, _o.z, _d.x, _d.y, _d.z, len)
      const water = G.island.waterAt(dt_.pos.x, dt_.pos.z)
      if (hitC && (!hitW || hitC.t < hitW.t)) {
        const p = _o.clone().addScaledVector(_d, hitC.t)
        this.dartHitsCreature(dt_, hitC, p)
        this.darts.splice(i, 1)
        continue
      }
      if (hitW) {
        const p = _o.clone().addScaledVector(_d, hitW.t)
        dt_.mesh.position.copy(p).addScaledVector(_d, -0.04)
        dt_.mesh.lookAt(p.clone().sub(_d))
        this.stuck.push({ mesh: dt_.mesh, t: 25 })
        G.fx.dust(p, 3)
        G.audio?.play('dartMiss', { pos: p })
        // a dart thudding into a tree is a noise somewhere that is not you
        G.events.emit('noise', { x: p.x, y: p.y, z: p.z, radius: 9, source: 'impact', kind: 'impact' })
        this.darts.splice(i, 1)
        continue
      }
      if (dt_.pos.y < water) {
        G.fx.splash(dt_.pos)
        this.remove(dt_.mesh)
        this.darts.splice(i, 1)
        continue
      }
      dt_.pos.addScaledVector(dt_.vel, dt)
      dt_.mesh.position.copy(dt_.pos)
      dt_.mesh.lookAt(_o.copy(dt_.pos).sub(dt_.vel))
      if (dt_.life <= 0) {
        this.remove(dt_.mesh)
        this.darts.splice(i, 1)
      }
    }
    for (let i = this.stuck.length - 1; i >= 0; i--) {
      const s = this.stuck[i]
      s.t -= dt
      if (s.t <= 0 || (s.creature && s.creature.disposed)) {
        if (s.mesh.parent) s.mesh.parent.remove(s.mesh)
        this.stuck.splice(i, 1)
      }
    }

    // --- thrown objects
    for (let i = this.thrown.length - 1; i >= 0; i--) {
      const t = this.thrown[i]
      t.life -= dt
      t.vel.y -= 14 * dt
      _o.copy(t.pos)
      _d.copy(t.vel).multiplyScalar(dt)
      const len = _d.length()
      _d.divideScalar(len || 1)
      const hit = G.physics.raycast(_o.x, _o.y, _o.z, _d.x, _d.y, _d.z, len + 0.05)
      const hitC = G.ecology.raycast(_o, _d, len)
      if (hitC && (!hit || hitC.t < hit.t) && t.bounces === 0) {
        // beaned it: that animal knows something is up
        const c = hitC.creature
        c.perception.alertTo(G.player.pos, c.perception.awareness + 0.5)
        t.vel.multiplyScalar(-0.2)
        t.bounces++
        this.land(t, _o.clone().addScaledVector(_d, hitC.t))
      } else if (hit) {
        const p = _o.clone().addScaledVector(_d, hit.t)
        t.pos.copy(p).addScaledVector(_d, -0.05)
        if (t.bounces === 0) this.land(t, p)
        t.bounces++
        t.vel.multiplyScalar(0.3)
        t.vel.y = Math.abs(t.vel.y) * 0.4
        if (t.vel.length() < 1 || t.bounces > 3) t.vel.set(0, 0, 0)
      } else t.pos.addScaledVector(t.vel, dt)
      const gnd = G.physics.groundAt(t.pos.x, t.pos.z, t.pos.y + 0.3)
      if (t.pos.y < gnd + 0.03) {
        t.pos.y = gnd + 0.03
        t.vel.set(0, 0, 0)
      }
      t.mesh.position.copy(t.pos)
      if (t.vel.lengthSq() > 0.1) {
        t.mesh.rotation.x += t.spin.x * dt
        t.mesh.rotation.y += t.spin.y * dt
      }
      if (t.kind === 'stone' && (t.life <= 0 || (t.vel.lengthSq() === 0 && t.life < 6))) {
        this.remove(t.mesh)
        this.thrown.splice(i, 1)
      } else if (t.kind === 'flare' && t.landed) {
        this.thrown.splice(i, 1)
        this.flares.push({ mesh: t.mesh, pos: t.pos, t: t.def.burn, fear: t.def.fear, puff: 0 })
      }
    }

    // --- burning flares
    for (const l of this.flareLights) l.intensity = 0
    for (let i = this.flares.length - 1; i >= 0; i--) {
      const f = this.flares[i]
      f.t -= dt
      f.puff -= dt
      if (f.puff <= 0) {
        f.puff = 0.06
        G.fx.flareSmoke(f.pos)
      }
      const li = this.flareLights[i % 2]
      if (li) {
        li.position.set(f.pos.x, f.pos.y + 0.6, f.pos.z)
        li.intensity = 80 * Math.min(1, f.t / 3) * (0.85 + Math.random() * 0.3)
      }
      if (f.t <= 0) {
        this.remove(f.mesh)
        this.flares.splice(i, 1)
      }
    }
  }

  land(t, p) {
    const G = this.G
    if (t.landed) return
    t.landed = true
    if (G.island.waterAt(p.x, p.z) > p.y) {
      G.fx.splash(p)
      if (t.kind === 'flare') t.def = { ...t.def, burn: 0.1 }
    }
    G.audio?.play(t.kind === 'flare' ? 'flare' : 'stone', { pos: p })
    G.events.emit('noise', { x: p.x, y: p.y, z: p.z, radius: t.def.noise, source: t.kind, kind: 'distraction' })
  }

  dartHitsCreature(d, hit, p) {
    const G = this.G
    const c = hit.creature
    const zone = hit.zone === 'armor' ? ARMOR : ZONES[hit.zone]
    const dose = d.weapon.dose * zone.dose
    if (dose <= 0) {
      G.fx.sparks(p)
      G.audio?.play('ricochet', { pos: p })
      G.events.emit('dart:hit', { creature: c, zone: 'ARMOUR', dose: 0 })
      this.remove(d.mesh)
      return
    }
    c.takeHit(G, { dose, zone: hit.zone, weapon: d.weapon.id, from: G.player.pos })
    G.events.emit('dart:hit', { creature: c, zone: zone.label, dose })
    G.fx.dartHit(p)
    G.audio?.play('dartHit', { pos: p })
    // stick it in the hide, riding the bone it struck
    d.mesh.position.copy(p)
    d.mesh.lookAt(p.clone().sub(d.vel))
    hit.sphere.boneObj.attach(d.mesh)
    this.stuck.push({ mesh: d.mesh, t: 60, creature: c })
  }

  remove(mesh) {
    if (mesh.parent) mesh.parent.remove(mesh)
  }

  // Hazards interface for the AI.
  nearestFlare(x, z) {
    let best = null
    for (const f of this.flares) {
      const d = Math.hypot(f.pos.x - x, f.pos.z - z)
      if (!best || d < best.d) best = { x: f.pos.x, z: f.pos.z, d, fear: f.fear }
    }
    return best
  }
  nearestFlareTo(x, z) {
    return this.nearestFlare(x, z)
  }
}
