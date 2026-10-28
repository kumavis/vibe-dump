// How the shooting looks (DESIGN §1.1): the events of core/actions/shoot.js
// played on the table. A volley's projectiles, each weapon's in its own
// style (its `fx`, a presentation key the rules never read); a blast
// weapon's template, its marker held where it is aimed until the throw, its
// scatter, the war machine's or the grenadier's throw, and where it lands;
// a spell's cast, fizzle, thorns and mesmerizing gaze. It plays them with
// fx (view/effects/fx.js) over the figures (view/units.js), as the
// EventPlayer hands them over (view/player.js).
//
// The marker and the thorns are view state the mirror doesn't hold: a new
// table takes them away, and so does a snap (clear(): DESIGN §2.4), which
// drops the blast.fire or spell.fade that would have.
//
// R7 moved it out of main.js (volleyFx, projGeo, projectileStyle,
// artilleryFire and the shooting's handlers) unchanged, but that a glowing
// projectile's material is one per colour, shared by every shot (main.js
// made one per shot and never freed it), and an eruption's thorns are
// freed once gone.
import * as THREE from 'three'
import { M } from '../models/kit.js'
import { tween, wait, easeOut, lerp } from '../clock.js'
import { eyeY, chestY } from '../../core/queries.js'
import { sfx } from '../sfx.js'

// (Made with the view, never as the module loads: three.js draws
// Math.random for every object's uuid, and the mat, the wood and the tufts
// are painted from Math.random at load, after these were made before R7.)
const projShapes = () => ({
  acorn: new THREE.SphereGeometry(0.07, 6, 5),
  dart: new THREE.ConeGeometry(0.03, 0.3, 4).rotateX(Math.PI / 2),
  javelin: new THREE.CylinderGeometry(0.02, 0.02, 0.9, 4).rotateX(Math.PI / 2),
  spit: new THREE.IcosahedronGeometry(0.08, 0),
  bomb: new THREE.SphereGeometry(0.11, 8, 6),
  pinecone: new THREE.ConeGeometry(0.2, 0.42, 7),
  acid: new THREE.SphereGeometry(0.24, 12, 8),
})

// A glowing projectile's material, one per colour and never freed, as the
// kit's are (view/models/kit.js's M): freeing it as each shot landed would
// drop the shader program only it uses, to be compiled and linked again at
// the next spit or acid volley's first frame (DESIGN §2.11's frame
// budget). Made at the first such shot, never as the module loads (the
// uuid's Math.random draws, above).
const GLOW = new Map()
const glow = (c) => GLOW.get(c) ?? GLOW.set(c, new THREE.MeshBasicMaterial({ color: c, toneMapped: false })).get(c)

export class Shots {
  // `units`: the figures (view/units.js); (F7a) `floorAt(x, z)`: the height
  // of the walkable top the table shows there (view/terrain.js's: a deck's,
  // 0 on the ground), which a template marks, lands and scorches on
  constructor({ scene, fx, units, floorAt = () => 0 }) {
    this.scene = scene
    this.effects = fx
    this.units = units
    this.floorAt = floorAt
    // each projectile style's shape, shared by every shot
    this.projGeo = projShapes()
    // the thorns of an eruption share a shape (made at the first)
    this.thorn = null
    this.blastMarker = null
    // an eruption's thorns, by caster, until its spell.fade
    this.spikesOf = new Map()
  }

  // A projectile in a weapon's style: its mesh, arc, speed, spin, trail.
  projectileStyle(kind) {
    const fx = this.effects, projGeo = this.projGeo
    switch (kind) {
      case 'acorn': return { mesh: new THREE.Mesh(projGeo.acorn, M('#8a5a2a')), arc: 0.08, speed: 28 }
      case 'dart': return { mesh: new THREE.Mesh(projGeo.dart, M('#4a6a2a')), arc: 0.03, speed: 34, spin: 0 }
      case 'javelin': return { mesh: new THREE.Mesh(projGeo.javelin, M('#8a6a3a')), arc: 0.18, speed: 20, spin: 0 }
      // ((F9a) a War-Cart's bolt: flat and fast, a streak of splinters
      // behind it; its shape made at the first bolt shot, never with the
      // others as the view is made: one object more then would shift the
      // Math.random draws the title is painted from, its uuid's)
      case 'bolt': return { mesh: new THREE.Mesh((projGeo.bolt ??= new THREE.CylinderGeometry(0.025, 0.025, 0.75, 5).rotateX(Math.PI / 2)), M('#5a4430')), arc: 0.05, speed: 40, spin: 0, trail: (p) => Math.random() < 0.4 && fx.mote({ x: p.x, y: p.y, z: p.z, size: 0.035, color: '#e8d8b0', life: 0.25, g: 4 }) }
      case 'spit': return { mesh: new THREE.Mesh(projGeo.spit, glow('#9aff5a')), arc: 0.12, speed: 18, trail: (p) => fx.mote({ x: p.x, y: p.y, z: p.z, size: 0.04, color: '#7aef4a', life: 0.4, g: 6 }) }
      case 'bomb': return { mesh: new THREE.Mesh(projGeo.bomb, M('#7a4a22')), arc: 0.45, speed: 14, trail: (p) => fx.mote({ x: p.x, y: p.y + 0.1, z: p.z, size: 0.05, color: '#ffb030', life: 0.3, g: -1 }) }
      case 'pinecone': return { mesh: new THREE.Mesh(projGeo.pinecone, M('#6b4a26', { emissive: '#ff5a10', emissiveIntensity: 0.6 })), arc: 0.55, speed: 18, trail: (p) => { fx.mote({ x: p.x, y: p.y, z: p.z, size: 0.12, color: Math.random() < 0.5 ? '#ff8a2a' : '#ffd36e', life: 0.4, g: -2 }); fx.smoke({ x: p.x, y: p.y, z: p.z, size: 0.14, color: '#3a3430', life: 0.9 }) } }
      case 'acid': return { mesh: new THREE.Mesh(projGeo.acid, glow('#8aff5a')), arc: 0.5, speed: 15, trail: (p) => fx.mote({ x: p.x, y: p.y, z: p.z, size: 0.1, color: Math.random() < 0.5 ? '#5be04a' : '#c8ff8a', life: 0.5, g: 8 }) }
    }
    return { mesh: new THREE.Mesh(projGeo.acorn, M('#888')) }
  }

  // fly one projectile in a weapon's style
  fly(a, b, kind) {
    return this.effects.projectile(a, b, this.projectileStyle(kind))
  }

  // A volley: projectiles for a non-blast volley — a handful, not one per
  // shot (e.n), from the shooters standing to the figures they shoot at.
  async volley(e) {
    const units = this.units, fx = this.effects
    const u = units.unit(e.u), target = units.unit(e.tg), uv = units.get(e.u), gen = units.gen
    // (nothing of a table since replaced)
    const gone = () => units.gone(e.u, uv, gen)
    const shooters = units.standing(e.u)
    const victims = units.standing(e.tg)
    const flights = []
    const n = Math.min(10, e.n)
    for (let i = 0; i < n; i++) {
      const s = shooters[i % shooters.length]
      const v = victims[(Math.random() * victims.length) | 0]
      // ((F7a) each figure from the height it stands at: a deck's top)
      const a = { x: s.x, y: (s.y ?? 0) + eyeY(u) * 0.8 + s.lift, z: s.z }
      const b = { x: v.x + (Math.random() - 0.5) * 0.6, y: (v.y ?? 0) + chestY(target) * 0.8, z: v.z + (Math.random() - 0.5) * 0.6 }
      flights.push(wait(i * 0.06).then(() => {
        if (gone()) return
        sfx.shot()
        return this.fly(a, b, e.fx)
      }).then(() => {
        if (gone()) return
        for (let k = 0; k < 5; k++) fx.mote({ x: b.x, y: b.y, z: b.z, vx: (Math.random() - 0.5) * 4, vy: Math.random() * 3, vz: (Math.random() - 0.5) * 4, size: 0.05, color: e.fx === 'spit' ? '#9aff5a' : '#ffe0a0', life: 0.35, g: 10 })
      }))
    }
    await Promise.all(flights)
  }

  // Blast weapons: the template's marker where it is aimed, held on the
  // table until the template is thrown (blast.aim); on a miss, its scatter
  // (blast.scatter); the throw (blast.fire); then where it lands
  // (blast.land).
  aimed(e) {
    this.blastMarker = this.effects.ring(e.x, e.z, e.r, '#ffffff', { hold: true, fill: 0.12, y: this.floorAt(e.x, e.z) })
  }

  // (it moves its own marker only: a table since replaced has taken that away)
  async scattered(e) {
    const marker = this.blastMarker
    const y0 = this.floorAt(e.from.x, e.from.z), y1 = this.floorAt(e.to.x, e.to.z)
    this.effects.text({ x: e.from.x, y: y0 + 1.5, z: e.from.z }, `scatter ${e.d}"`, '#ffd36e', { size: 15 })
    await tween(0.35, (t) => marker?.position.set(lerp(e.from.x, e.to.x, t), lerp(y0, y1, t) + 0.05, lerp(e.from.z, e.to.z, t)), easeOut)
  }

  async fired(e) {
    const units = this.units, v = units.get(e.u), gen = units.gen
    await this.artilleryFire(e)
    // (nothing of a table since replaced, whose marker went with it)
    if (units.gone(e.u, v, gen)) return
    this.blastMarker?.userData.remove()
    this.blastMarker = null
  }

  // The throw: a war machine's arm (or the acid engine's globe) swings, a
  // grenadier winds up, and the shot flies from the first figure standing.
  async artilleryFire(e) {
    const units = this.units
    const u = units.unit(e.u), v = units.get(e.u), gen = units.gen, land = e.to
    // (nothing of a table since replaced)
    const gone = () => units.gone(e.u, v, gen)
    const src = units.standing(e.u)[0]
    const anim = src.mesh.userData.anim
    if (anim?.throwArm) {
      const r0 = anim.rest
      sfx.thwack()
      tween(0.25, (k) => (anim.throwArm.rotation.x = r0 - 2.1 * easeOut(k))).then(() => tween(0.8, (k) => (anim.throwArm.rotation.x = r0 - 2.1 * (1 - k))))
      if (anim.globe) anim.globe.visible = false
      await wait(0.15)
      if (gone()) return
    } else {
      // a grenadier winds up
      src.lunge = 1
      src.lungeDir = Math.atan2(land.x - src.x, land.z - src.z)
    }
    const a = { x: src.x, y: (src.y ?? 0) + (u.t.big ? 1.8 : 0.9), z: src.z }, b = { x: land.x, y: this.floorAt(land.x, land.z) + 0.15, z: land.z }
    sfx.shot()
    await this.fly(a, b, e.fx)
    if (gone()) return
    if (anim?.globe) anim.globe.visible = true
  }

  // Where a template lands: an explosion and a boom (a thornburst's thorns
  // have made their own), and the template's ring, which fades.
  // ((F7a) on the top it lands on: a deck's, or the ground)
  landed(e) {
    const fx = this.effects, y = this.floorAt(e.x, e.z)
    // ((F19a) a powder keg's blast: its own, bigger bang)
    if (e.fx === 'keg') return this.kegLanded(e, y)
    if (e.fx !== 'thorns') {
      fx.explode(e.x, e.z, e.r, e.fx === 'acid' ? 'acid' : 'fire', y)
      sfx.boom(e.r / 2)
    }
    fx.ring(e.x, e.z, e.r, e.fx === 'acid' ? '#8aff5a' : '#ff9a4a', { life: 1.4, fill: 0.2, y })
  }

  // (F19a) A powder keg set off (keg.fuse): its fuse fizzes, sparks spitting
  // off the barrel's top where it stood, and the table waits a beat on it
  // before the bang (its blast.land, next: kegLanded).
  fused(e) {
    const fx = this.effects, y = this.floorAt(e.x, e.z) + 1.3
    sfx.fizzle()
    for (let i = 0; i < 18; i++) {
      const a = Math.random() * Math.PI * 2, s = 0.5 + Math.random() * 1.5
      fx.mote({ x: e.x, y, z: e.z, vx: Math.cos(a) * s, vy: 1 + Math.random() * 2.5, vz: Math.sin(a) * s, size: 0.05 + Math.random() * 0.05, color: i % 2 ? '#ffd36e' : '#ff7a1a', life: 0.3 + Math.random() * 0.4, g: 4 })
    }
    fx.smoke({ x: e.x, y, z: e.z, size: 0.2, color: '#5a5048', life: 0.8 })
    return wait(0.4)
  }

  // (F19a) A powder keg's blast landing (blast.land, fx 'keg'): fx's
  // kegBlast, a deep boom and a hot ring the size of its blast.
  kegLanded(e, y) {
    this.effects.kegBlast(e.x, e.z, e.r, y)
    sfx.boom(e.r)
    this.effects.ring(e.x, e.z, e.r, '#ffb347', { life: 1.8, fill: 0.28, y })
  }

  // A spell cast (its sound), or fizzled (a sound and the word over the
  // caster).
  cast() {
    sfx.magic()
  }
  fizzled(e) {
    sfx.fizzle()
    this.effects.text(this.units.top(e.u), 'Fizzle…', '#c8b8ff')
  }

  // A thornburst: motes from the caster's gem, thorns bursting up through
  // the turf over the template, and their own explosion; they stand until
  // the spell is done (spell.fade), then sink away.
  // ((F16) `quiet`: the caster veiled by the courtesy fog, its gem's motes
  // left out, the thorns where they burst seen)
  async thorns(e, { quiet = false } = {}) {
    const units = this.units, fx = this.effects
    const cv = units.get(e.u), gen = units.gen
    const gem = cv.models[0].mesh.userData.anim.gem
    if (gem && !quiet) {
      const p = new THREE.Vector3()
      gem.getWorldPosition(p)
      for (let i = 0; i < 20; i++) fx.mote({ x: p.x, y: p.y, z: p.z, vx: (Math.random() - 0.5) * 3, vy: Math.random() * 3, vz: (Math.random() - 0.5) * 3, size: 0.06, color: '#9aff7a', life: 0.8, g: -1 })
    }
    // thorns burst up through the turf
    const spikes = []
    this.thorn ??= new THREE.ConeGeometry(0.12, 1, 5)
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2, d = Math.sqrt(Math.random()) * e.r
      const s = new THREE.Mesh(this.thorn, M(i % 3 ? '#5a7a2a' : '#7a5a2a'))
      s.position.set(e.x + Math.cos(a) * d, -0.6, e.z + Math.sin(a) * d)
      s.rotation.set((Math.random() - 0.5) * 0.6, 0, (Math.random() - 0.5) * 0.6)
      s.scale.set(1, 0.6 + Math.random() * 1.1, 1)
      s.castShadow = true
      this.scene.add(s)
      spikes.push(s)
    }
    this.spikesOf.set(e.u, spikes)
    await tween(0.3, (k) => spikes.forEach((s) => (s.position.y = -0.6 + easeOut(k) * (0.3 + s.scale.y * 0.4))))
    // (nothing of a table since replaced: no scorch mark on the new one)
    if (units.gone(e.u, cv, gen)) return
    fx.explode(e.x, e.z, e.r, 'thorns')
  }

  faded(e) {
    const spikes = this.spikesOf.get(e.u) ?? []
    this.spikesOf.delete(e.u)
    tween(1.2, (k) => spikes.forEach((s) => (s.position.y -= 0.02 * k))).then(() => spikes.forEach((s) => this.scene.remove(s)))
  }

  // A mesmerizing gaze: a beam of motes from the caster's head to the
  // target's, then rings around the target; and the word over it.
  async gaze(e) {
    const units = this.units, fx = this.effects
    const tv = units.get(e.tg), gen = units.gen
    // (nothing of a table since replaced)
    const gone = () => units.gone(e.tg, tv, gen)
    const from = units.top(e.u), to = units.top(e.tg)
    const beam = []
    for (let i = 0; i <= 16; i++) {
      const k = i / 16
      beam.push(wait(k * 0.3).then(() => gone() || fx.mote({ x: lerp(from.x, to.x, k), y: lerp(from.y, to.y, k) + Math.sin(k * Math.PI) * 0.8, z: lerp(from.z, to.z, k), size: 0.09, color: '#c070ff', life: 0.7, g: 0 })))
    }
    await Promise.all(beam)
    if (gone()) return
    const at = units.shown(e.tg)
    for (let i = 0; i < 3; i++) fx.ring(at.pos.x, at.pos.z, at.r * (0.6 + i * 0.35), '#c070ff', { life: 1.2 + i * 0.3, fill: 0.08 })
  }
  mesmerized(e) {
    this.effects.text(this.units.top(e.tg), 'Mesmerized!', '#e0a0ff', { size: 20 })
  }

  // What the shooting holds outside the mirror now: a template's marker, an
  // eruption's thorns standing (for sim/'s snap check: nothing, once the
  // player has drained its queue).
  held() {
    return { marker: !!this.blastMarker, thorns: [...this.spikesOf.values()].reduce((n, spikes) => n + spikes.length, 0) }
  }

  // Whatever the shooting holds outside the mirror goes: a template's
  // marker, an eruption's thorns (a new table, a snap).
  clear() {
    this.blastMarker?.userData.remove()
    this.blastMarker = null
    for (const spikes of this.spikesOf.values()) for (const s of spikes) this.scene.remove(s)
    this.spikesOf.clear()
  }
}
