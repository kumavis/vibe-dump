// The enemy aircraft (TOY.md §3 "Enemies"): flights that fly simple pursuits
// with telegraphed turns, line up, warn (the HUD marks the one lining up on
// you before it fires), fire a burst of tracer that mostly misses, then break
// away so the player gets a go. Some flights go for the carrier instead: low
// and straight, a bomb from close in, then round again.

import { fly, bearingTo, wrapPi, ARENA } from './world.js'
import { fire, hurt } from './combat.js'

export const FIGHTER = { hp: 22, speed: 45, yawRate: 1.05, radius: 9.5, warn: 0.75, burst: 1.1, interval: 0.11, spread: 0.05, dmg: 4, range: 380 }

/** A flight of n fighters coming in from a bearing (from the arena's middle) at a distance, toward the middle. */
export function spawnFlight(world, n, { from = 0, dist = 520, y = 90, mission = 'me', notch = 0, around = null } = {}) {
  const out = []
  const cx = around ? around.x : 0
  const cz = around ? around.z : 0
  const bx = cx + Math.sin(from) * dist
  const bz = cz - Math.cos(from) * dist
  const head = Math.atan2(cx - bx, -(cz - bz))
  for (let k = 0; k < n; k++) {
    // a loose V: the leader ahead, the others behind and to each side
    const side = k === 0 ? 0 : k % 2 ? 1 : -1
    const back = Math.ceil(k / 2) * 30
    const rx = Math.cos(head) * side * back
    const rz = Math.sin(head) * side * back
    const th = world.spawn('fighter', {
      enemy: true,
      x: bx + rx - Math.sin(head) * back,
      z: bz + rz + Math.cos(head) * back,
      y: y + side * 6,
      yaw: head,
      v: FIGHTER.speed,
      hp: Math.round(FIGHTER.hp * (1 + 0.12 * notch)),
      hpMax: Math.round(FIGHTER.hp * (1 + 0.12 * notch)),
      radius: FIGHTER.radius,
      mission,
      notch,
      ai: { state: 'in', t: 0, lineT: 0, burstT: 0, cd: 0, breakDir: side || 1, jink: world.random() * 6 },
      name: world.side.fighter.name,
    })
    if (th) out.push(th)
  }
  return out
}

/** Every fighter, once a step. */
export function fighters(world, dt) {
  const me = world.me
  for (const th of world.things) {
    if (th.role !== 'fighter' || th.alive !== 1) continue
    const ai = th.ai
    ai.t += dt
    ai.cd -= dt
    th.aiming = false
    const meOk = me && me.alive === 1 && !me.down
    const goCarrier = th.mission === 'carrier' && world.carrier?.alive === 1
    const tgt = goCarrier ? world.carrier : meOk ? me : world.carrier?.alive === 1 ? world.carrier : null
    let sx = 0
    let sy = 0
    const speed = FIGHTER.speed * (1 + 0.04 * th.notch)
    if (!tgt) {
      fly(world, th, 0.3, 0, dt, { speed, yawRate: FIGHTER.yawRate })
      continue
    }
    const d = Math.hypot(tgt.x - th.x, (tgt.y || 0) - th.y, tgt.z - th.z)
    const want = bearingTo(th, tgt)
    const diff = wrapPi(want - th.yaw)
    if (ai.state === 'in' && ai.t > 1.5) ai.state = 'chase'
    if (ai.state === 'break') {
      // the break: a hard turn away and a climb, then back at it
      sx = ai.breakDir
      sy = th.y < 120 ? 0.7 : 0
      if (ai.t > 2.6) {
        ai.state = 'chase'
        ai.t = 0
      }
    } else if (goCarrier) {
      // the carrier: down low and straight at her, a bomb from close in, then away
      sx = Math.max(-1, Math.min(1, diff * 2.2))
      sy = Math.max(-1, Math.min(1, (40 - th.y) / 40))
      if (d < 150 && Math.abs(diff) < 0.35 && ai.cd <= 0) {
        ai.cd = 6
        dropOnCarrier(world, th)
        ai.state = 'break'
        ai.t = 0
        ai.breakDir = world.random() < 0.5 ? -1 : 1
      }
    } else {
      // the chase: turn toward the target with a little weave (the turn shows before it comes), match its height
      const weave = Math.sin(ai.t * 1.3 + ai.jink) * 0.25
      sx = Math.max(-1, Math.min(1, diff * 2 + weave))
      sy = Math.max(-1, Math.min(1, ((tgt.y || 40) - th.y) / 50))
      const lined = tgt === me && Math.abs(diff) < 0.4 && d < FIGHTER.range + 60
      if (lined) {
        ai.lineT += dt
        th.aiming = true
        if (ai.lineT > FIGHTER.warn - 0.05 * th.notch && Math.abs(diff) < 0.25 && d < FIGHTER.range) {
          ai.burstT += dt
          if (ai.cd <= 0) {
            ai.cd = FIGHTER.interval
            shootAt(world, th, tgt)
          }
          if (ai.burstT > FIGHTER.burst) {
            ai.state = 'break'
            ai.t = 0
            ai.lineT = 0
            ai.burstT = 0
            ai.breakDir = diff > 0 ? -1 : 1
          }
        }
      } else {
        ai.lineT = Math.max(0, ai.lineT - dt * 2)
        ai.burstT = 0
      }
      if (d < 55) {
        ai.state = 'break'
        ai.t = 0
        ai.breakDir = diff > 0 ? -1 : 1
      }
    }
    // keep apart from each other a little
    for (const o of world.things) {
      if (o === th || o.role !== 'fighter' || o.alive !== 1) continue
      const dx = o.x - th.x
      const dz = o.z - th.z
      const dd = dx * dx + dz * dz
      if (dd < 900 && Math.abs(o.y - th.y) < 20) sy += th.y > o.y ? 0.3 : -0.3
    }
    fly(world, th, sx, sy, dt, { speed, yawRate: FIGHTER.yawRate * (1 + 0.05 * th.notch) })
    th.y = Math.max(ARENA.floor + 4, th.y)
  }
}

/** A round of tracer at the target with a poor aim (the spread narrows a little each wave). */
function shootAt(world, th, tgt) {
  const d = Math.hypot(tgt.x - th.x, tgt.y - th.y, tgt.z - th.z) || 1
  const spread = FIGHTER.spread * (1 - 0.06 * th.notch)
  const r = () => (world.random() - 0.5) * 2 * spread
  const sp = 380
  const dx = (tgt.x - th.x) / d + r()
  const dy = (tgt.y - th.y) / d + r()
  const dz = (tgt.z - th.z) / d + r()
  const n = Math.hypot(dx, dy, dz)
  fire(world, { x: th.x + (dx / n) * 6, y: th.y + (dy / n) * 6, z: th.z + (dz / n) * 6, vx: (dx / n) * sp, vy: (dy / n) * sp, vz: (dz / n) * sp, life: 1.2, by: 'them', dmg: FIGHTER.dmg, r: 0 })
}

/** A bomb on the carrier from a fighter run in close: it lands near her, and mostly on her. */
function dropOnCarrier(world, th) {
  const c = world.carrier
  const hitIt = world.random() < 0.7
  fire(world, {
    kind: 'bomb',
    look: 2,
    x: th.x,
    y: th.y - 2,
    z: th.z,
    vx: (c.x - th.x) / 1.8 + (hitIt ? 0 : 30),
    vy: -2,
    vz: (c.z - th.z) / 1.8,
    life: 6,
    by: 'them',
    dmg: 16,
    r: 4,
    only: 'ship',
    update: (w, s, dt) => (s.vy -= 9.8 * dt * 2),
    onHit: (w, s, t, h) => {
      w.emit('boom', { x: h.x, y: h.y, z: h.z, size: 0.8 })
      hurt(w, t, s.dmg, { by: 'them', x: h.x, y: h.y, z: h.z, weapon: 'bomb' })
    },
    onWater: (w, s) => w.emit('splash', { x: s.x, z: s.z, big: true }),
  })
}
