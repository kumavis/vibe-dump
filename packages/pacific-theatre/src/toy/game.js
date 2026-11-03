// A game of the toy: the world with its modules in order (the carrier, the
// player's flight and guns, the enemies, the shots, the wreckage, the
// player's life, the spawner: waves.js) and what the checklist of TOY.md §2 measures
// as it runs (the first enemy in sight, the first hit, the first explosion,
// the longest gap without a target in view).

import { World, fly, steamCarrier, ARENA, wrapPi } from './world.js'
import { playerGuns, moveShots, wreckage, playerLife, pointWorld, PLAYER } from './combat.js'
import { fighters } from './enemies.js'
import { shipsAI, lockOn, ordnance, ORD } from './ships.js'
import { spawner, DURATION } from './waves.js'

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
    if (!st.inSight) {
      const gap = world.t - st.gapFrom
      if (gap > st.longestGap) {
        st.longestGap = gap
        st.longestGapAt = st.gapFrom
      }
    }
    st.inSight = true
  } else if (st.inSight || world.t < 0.02) {
    st.inSight = false
    st.gapFrom = world.t
  }
  st.inSightNow = seen
}

export function newGame(side, kits, opts = {}) {
  const w = new World(side, kits, opts)
  w.notch = 0
  w.duration = DURATION
  w.pointOf = pointWorld
  w.lives = PLAYER.lives
  w.score = 0
  w.ammo = { bombs: ORD.bombs, bombsMax: ORD.bombs, torpedo: 1, reloadIn: ORD.reload, armed: false }
  w.carrier = w.spawn('carrier', { hp: 1000, hpMax: 1000, phase: 0, name: side.carrier.name })
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
      if (!me || me.alive !== 1 || me.down) return
      fly(world, me, world.input.sx, world.input.sy, dt)
      // a ship is solid like the sea: over her, the aircraft is lifted clear of her masts
      for (const th of world.things) {
        if (th.kind !== 'ship' || th.alive !== 1) continue
        const dx = me.x - th.x
        const dz = me.z - th.z
        const along = dx * Math.sin(th.yaw) - dz * Math.cos(th.yaw)
        const across = dx * Math.cos(th.yaw) + dz * Math.sin(th.yaw)
        const top = th.model.H + 5
        if (Math.abs(along) < th.model.L * 0.5 + 4 && Math.abs(across) < th.model.B * 0.5 + 8 && me.y < top) {
          me.y += Math.min(top - me.y, 40 * dt)
          if (me.pitch < 0.2) me.pitch = 0.2
        }
      }
    },
    playerGuns,
    lockOn,
    ordnance,
    fighters,
    shipsAI,
    moveShots,
    wreckage,
    playerLife,
    spawner,
    sight,
  )
  w.writeState()
  return w
}
