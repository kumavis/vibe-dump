// A game of the toy: the world with its modules in order (the carrier, the
// player's flight and guns, the enemies, the shots, the wreckage, the
// player's life, the spawner) and what the checklist of TOY.md §2 measures
// as it runs (the first enemy in sight, the first hit, the first explosion,
// the longest gap without a target in view).

import { World, fly, steamCarrier, ARENA, wrapPi } from './world.js'
import { playerGuns, moveShots, wreckage, playerLife, pointWorld, PLAYER } from './combat.js'
import { fighters, spawnFlight } from './enemies.js'
import { shipsAI, spawnShip, lockOn, ordnance, ORD } from './ships.js'

/** In view: an enemy within the chase camera's cone ahead of the player (about its field of view) and a kilometre. */
function sight(world) {
  const me = world.me
  const st = world.stats
  let seen = false
  if (me && me.alive === 1 && !me.down) {
    for (const th of world.things) {
      if (!th.enemy || th.alive !== 1) continue
      const dx = th.x - me.x
      const dz = th.z - me.z
      const d = Math.hypot(dx, dz)
      if (d > 1000) continue
      const ang = Math.abs(wrapPi(Math.atan2(dx, -dz) - me.yaw))
      if (ang < 0.75 || d < 60) {
        seen = true
        break
      }
    }
  } else seen = true // (a respawn's two seconds are not a gap in the action)
  if (seen && st.firstSight == null) st.firstSight = world.t
  if (seen) {
    if (!st.inSight) st.longestGap = Math.max(st.longestGap, world.t - st.gapFrom)
    st.inSight = true
  } else if (st.inSight || world.t < 0.02) {
    st.inSight = false
    st.gapFrom = world.t
  }
  st.inSightNow = seen
}

/** Something to shoot within a few seconds whenever the sky goes empty (TOY.md §2: never more than five seconds without a target). */
function refill(world) {
  const live = world.things.some((th) => th.enemy && th.alive === 1)
  if (live) {
    world.emptySince = null
    return
  }
  world.emptySince ??= world.t
  if (world.t - world.emptySince < 2.5) return
  world.emptySince = null
  const me = world.me
  // a pair ahead of the player, coming at it
  const ahead = me ? me.yaw + (world.random() - 0.5) * 0.6 : world.random() * 6.28
  const around = me ? { x: me.x, z: me.z } : null
  spawnFlight(world, 2, { from: ahead, dist: 420, y: Math.max(50, Math.min(140, me?.y ?? 90)), notch: world.notch || 0, around })
  world.emit('banner', { text: `${world.side.fighter.plural} inbound`, small: true })
}

export function newGame(side, kits, opts = {}) {
  const w = new World(side, kits, opts)
  w.notch = 0
  w.pointOf = pointWorld
  w.lives = PLAYER.lives
  w.score = 0
  w.ammo = { bombs: ORD.bombs, bombsMax: ORD.bombs, torpedo: 1, reloadIn: ORD.reload, armed: false }
  w.carrier = w.spawn('carrier', { hp: 600, hpMax: 600, phase: 0, name: side.carrier.name })
  steamCarrier(w, 0)
  w.me = w.spawn('player', { x: 0, y: 70, z: 140, yaw: 0, v: ARENA.speed, hp: PLAYER.hp, hpMax: PLAYER.hp, radius: PLAYER.radius, shield: 0 })
  w.end = (reason) => {
    if (w.over) return
    w.over = { reason, t: w.t }
    w.emit('over', { reason })
  }
  w.modules.push(
    (world, dt) => steamCarrier(world, dt),
    (world, dt) => {
      const me = world.me
      if (me && me.alive === 1 && !me.down) fly(world, me, world.input.sx, world.input.sy, dt)
    },
    playerGuns,
    lockOn,
    ordnance,
    fighters,
    shipsAI,
    moveShots,
    wreckage,
    playerLife,
    (world) => {
      if (world.t > 0.4 && !world.opened) {
        world.opened = true
        // the first three, straight ahead and coming at you (TOY.md §2: in your sights within five seconds)
        spawnFlight(world, 3, { from: 0, dist: 470, y: 85, notch: 0, around: { x: 0, z: 140 } })
        world.emit('banner', { text: 'Wave 1' })
      }
      if (world.t > 30 && !world.w2) {
        world.w2 = true
        spawnShip(world, 'destroyer', { from: Math.PI / 2, dist: 640, offset: -90, notch: 1 })
        spawnShip(world, 'destroyer', { from: Math.PI / 2, dist: 690, offset: 90, notch: 1 })
        world.emit('banner', { text: 'Wave 2', sub: 'Destroyers from the east' })
      }
      if (world.t > 60 && !world.w3) {
        world.w3 = true
        spawnShip(world, 'cruiser', { from: Math.PI * 0.8, dist: 660, notch: 2 })
        world.emit('banner', { text: 'Wave 3', sub: 'A cruiser' })
      }
      if (world.opened) refill(world)
    },
    sight,
  )
  w.writeState()
  return w
}
