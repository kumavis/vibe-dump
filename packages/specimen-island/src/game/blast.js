import * as THREE from 'three'
import { BLASTS } from '../data/blasts.js'
import { clamp } from '../core/mathx.js'

// One explosion at `at`: fire (or a waterspout), smoke and debris, a bang the
// whole valley hears, damage falling off with distance to every animal, the
// player and every vehicle inside the radius, and camera shake for whoever is
// near. `kind` is a BLASTS entry; `opts.weapon` names what fired it for the
// ledger (an animal it kills is the player's kill), `opts.exclude` is a
// vehicle that should not take its own blast (the gun that fired it).
//
// It is a plain function over G rather than a system with state: the bang is
// over in a frame, and the particles live on in G.fx.

const _p = new THREE.Vector3()

export function blast(G, at, kind, opts = {}) {
  const B = BLASTS[kind]
  if (!B) throw new Error(`unknown blast '${kind}'`)
  const wet = G.island.depthAt(at.x, at.z) > 0.3 && at.y < G.island.waterAt(at.x, at.z) + 0.6
  G.fx?.explosion(at, B.size, wet)
  G.audio?.play('explosion', { pos: at, intensity: clamp(B.size, 0.3, 1.5), wet })
  G.events.emit('noise', { x: at.x, y: at.y, z: at.z, radius: B.noise, source: opts.source || 'player', kind: 'gunshot' })

  const falloff = (d) => clamp(1 - d / B.radius, 0, 1)
  const hits = { creatures: [], player: 0, vehicles: [] }

  // animals: measured from the body's centre, less its girth
  for (const c of G.ecology.active) {
    if (!c.vitals.alive) continue
    const ctr = c.center()
    const k = falloff(Math.max(0, ctr.distanceTo(at) - c.radius))
    if (k <= 0) continue
    const damage = B.damage * k
    c.takeHit(G, { damage, zone: 'torso', from: at, cause: 'weapon', weapon: opts.weapon || kind })
    hits.creatures.push({ creature: c, damage })
  }

  // vehicles take it on the hull; whoever is inside is hurt through it
  for (const v of G.vehicles || []) {
    if (v === opts.exclude || v.destroyed) continue
    v.modelPoint([0, 1, 0], _p)
    const k = falloff(Math.max(0, _p.distanceTo(at) - 1.5))
    if (k <= 0) continue
    const amount = B.damage * B.vehicle * k
    v.damage(amount, at)
    hits.vehicles.push({ vehicle: v, amount })
  }

  // the player on foot
  const P = G.player
  if (!G.vehicle && P.alive) {
    _p.copy(P.pos)
    _p.y += 0.9
    const k = falloff(_p.distanceTo(at))
    if (k > 0) {
      hits.player = B.damage * k * 0.25 // a person is not a dinosaur: a near miss throws you, a hit kills you
      P.damage(hits.player, at, B.knock * k)
    }
  }

  // the shake is felt by whoever is watching, wherever they are
  const eye = G.vehicle ? G.vehicle.pos : P.pos
  G.shake?.add(B.shake * clamp(1 - eye.distanceTo(at) / B.shakeRadius, 0, 1))

  G.events.emit('blast', { x: at.x, y: at.y, z: at.z, kind, radius: B.radius, weapon: opts.weapon || kind, wet })
  return hits
}
