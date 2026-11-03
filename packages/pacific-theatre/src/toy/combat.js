// Guns, shots, hits and what they are worth (TOY.md §2 "Generous", "Loud
// feedback"): the player's guns with a heat bar that cools and an aim that
// walks onto a target in a wide cone; shots as plain objects swept against
// big hit shapes (a sphere for an aircraft, a capsule along a ship); damage,
// the combo (×2 to ×5, fading when the hits stop), the score; the player's
// health that comes back when nothing is hitting it, the three lives and the
// two-second respawn over the carrier.

import { forward, ARENA } from './world.js'

export const GUN = {
  interval: 1 / 14, // s between rounds (two guns, alternating)
  speed: 430, // m/s
  life: 1.1, // s (about 470 m)
  heat: 0.042, // per round
  coolFiring: 0.1, // per second while the trigger is held
  cool: 0.55, // per second off it
  unjam: 0.35, // an overheated gun fires again below this
  damage: 4,
  assist: 0.2, // rad: inside this the rounds go where the target will be
  assistRange: 520,
}
export const PLAYER = { hp: 100, regenDelay: 2.2, regen: 16, lives: 3, respawn: 2, shield: 2.2, radius: 5.5 }
export const SCORE = { hit: 10, fighter: 100, destroyer: 500, cruiser: 800, turret: 400, boss: 2500 }
export const COMBO = { window: 2.6, perStep: 8, max: 5 }

const _f = { x: 0, y: 0, z: 0 }

/** A shot into the world: { x, y, z, vx, vy, vz, life, by: 'me' | 'them', dmg, kind, look } (look: the streak family, 1 tracer, 0 shell, 2 bomb, 3 torpedo). */
export function fire(world, s) {
  if (world.shots.length >= 480) world.shots.shift()
  const shot = { age: 0, look: 1, kind: 'bullet', r: 0, ...s }
  world.shots.push(shot)
  return shot
}

/** Where a target will be when a round from p at `speed` reaches it (one pass of the lead). */
export function lead(p, th, speed) {
  const d = Math.hypot(th.x - p.x, th.y - p.y, th.z - p.z)
  const tof = d / speed
  forward(th, _f)
  return { x: th.x + _f.x * th.v * tof, y: th.y + _f.y * th.v * tof, z: th.z + _f.z * th.v * tof, d }
}

/** The things the player's rounds can strike: enemy aircraft, enemy ships, their weak points. */
export function enemyTargets(world) {
  return world.things.filter((th) => th.alive === 1 && th.enemy)
}

/** The player's guns, once a step. */
export function playerGuns(world, dt) {
  const me = world.me
  const g = (world.gun ||= { heat: 0, cd: 0, jam: false, side: 1, shots: 0, hits: 0 })
  const firing = world.input.fire && me && me.alive === 1 && !me.down
  g.cd -= dt
  if (g.jam && g.heat < GUN.unjam) g.jam = false
  if (firing && !g.jam) {
    while (g.cd <= 0) {
      g.cd += GUN.interval
      shootOnce(world, me, g)
      g.heat += GUN.heat
      if (g.heat >= 1) {
        g.heat = 1
        g.jam = true
        world.emit('jam', {})
        break
      }
    }
    g.heat = Math.max(0, g.heat - GUN.coolFiring * dt)
  } else {
    g.cd = Math.max(0, g.cd)
    g.heat = Math.max(0, g.heat - GUN.cool * dt)
  }
}

function shootOnce(world, me, g) {
  forward(me, _f)
  let dx = _f.x
  let dy = _f.y
  let dz = _f.z
  // the aim walks onto the best target in the cone: the nearest to the nose, weighed by range
  let best = null
  let bestScore = Infinity
  for (const th of world.things) {
    if (th.alive !== 1 || !th.enemy) continue
    const pts = th.points ? th.points.filter((p) => p.hp > 0 && p.open) : [th]
    for (const p of pts) {
      const P = p === th ? th : pointWorld(th, p)
      const L = lead(me, p === th ? th : { ...P, yaw: th.yaw, pitch: 0, v: th.v }, GUN.speed)
      if (L.d > GUN.assistRange + (th.kind === 'ship' ? 150 : 0)) continue
      const ax = (L.x - me.x) / L.d
      const ay = (L.y - me.y) / L.d
      const az = (L.z - me.z) / L.d
      const ang = Math.acos(Math.max(-1, Math.min(1, ax * dx + ay * dy + az * dz)))
      const cone = GUN.assist * (th.kind === 'ship' ? 0.8 : 1)
      if (ang > cone) continue
      const sc = ang + L.d / 3000
      if (sc < bestScore) {
        bestScore = sc
        best = { ax, ay, az, ang, cone }
      }
    }
  }
  if (best) {
    // fully on inside two thirds of the cone, easing out to the nose at its edge
    const k = Math.min(1, Math.max(0, (best.cone - best.ang) / (best.cone / 3)))
    dx += (best.ax - dx) * k
    dy += (best.ay - dy) * k
    dz += (best.az - dz) * k
    const n = Math.hypot(dx, dy, dz)
    dx /= n
    dy /= n
    dz /= n
  }
  const sp = (world.random() - 0.5) * 0.012
  g.side = -g.side
  const rx = Math.cos(me.yaw) * 2.6 * g.side
  const rz = Math.sin(me.yaw) * 2.6 * g.side
  fire(world, { x: me.x + rx + dx * 4, y: me.y - 0.3 + dy * 4, z: me.z + rz + dz * 4, vx: (dx + sp) * GUN.speed, vy: (dy + sp) * GUN.speed, vz: (dz - sp) * GUN.speed, life: GUN.life, by: 'me', dmg: GUN.damage })
  g.shots++
  world.stats.shots = (world.stats.shots || 0) + 1
}

/** A weak point's place in the arena (its `at` in the ship's model frame, bow toward −z). */
export function pointWorld(th, p) {
  const s = Math.sin(th.yaw)
  const c = Math.cos(th.yaw)
  const [ax, ay, az] = p.at
  // model x (starboard) and z (aft) turned by the heading: forward is (sin, −cos), starboard (cos, sin)
  return { x: th.x + ax * c - az * s, y: Math.max(th.y, 0) + ay + 3, z: th.z + ax * s + az * c }
}

/** The squared distance from point q to the segment a→b, and where along it (0..1). */
function segDist2(ax, ay, az, bx, by, bz, qx, qy, qz) {
  const vx = bx - ax
  const vy = by - ay
  const vz = bz - az
  const L = vx * vx + vy * vy + vz * vz || 1e-9
  let u = ((qx - ax) * vx + (qy - ay) * vy + (qz - az) * vz) / L
  u = u < 0 ? 0 : u > 1 ? 1 : u
  const dx = ax + vx * u - qx
  const dy = ay + vy * u - qy
  const dz = az + vz * u - qz
  return [dx * dx + dy * dy + dz * dz, u]
}

/** A shot's sweep this step against a thing: the hit point, the weak point struck, or null. */
export function strike(shot, x0, y0, z0, th) {
  const x1 = shot.x
  const y1 = shot.y
  const z1 = shot.z
  if (th.kind === 'aircraft') {
    const r = (th.radius || 9) + shot.r
    const [d2, u] = segDist2(x0, y0, z0, x1, y1, z1, th.x, th.y, th.z)
    return d2 < r * r ? { x: x0 + (x1 - x0) * u, y: y0 + (y1 - y0) * u, z: z0 + (z1 - z0) * u, part: null } : null
  }
  // a ship: her weak points first (big glowing spheres), then her hull as a capsule along her length, deck high
  if (th.points) {
    for (const p of th.points) {
      if (p.hp <= 0 || !p.open) continue
      const P = pointWorld(th, p)
      const r = p.radius + shot.r
      const [d2, u] = segDist2(x0, y0, z0, x1, y1, z1, P.x, P.y, P.z)
      if (d2 < r * r) return { x: x0 + (x1 - x0) * u, y: y0 + (y1 - y0) * u, z: z0 + (z1 - z0) * u, part: p }
    }
  }
  const m = th.model
  const hx = Math.sin(th.yaw) * m.L * 0.46
  const hz = -Math.cos(th.yaw) * m.L * 0.46
  const r = m.B * 0.5 + 5 + shot.r
  const cy = Math.max(th.y, 0) + m.deck * 0.6
  // (the closest approach between the shot's sweep and the keel line, sampled: the sweep is a few metres a step)
  for (let k = 0; k <= 2; k++) {
    const qx = x0 + ((x1 - x0) * k) / 2
    const qy = y0 + ((y1 - y0) * k) / 2
    const qz = z0 + ((z1 - z0) * k) / 2
    if (qy > cy + m.H * 0.7 + shot.r || qy < -3) continue
    const [d2] = segDist2(th.x - hx, cy, th.z - hz, th.x + hx, cy, th.z + hz, qx, Math.min(Math.max(qy, cy - 4), cy + 4), qz)
    if (d2 < r * r) return { x: qx, y: Math.max(qy, 1), z: qz, part: null }
  }
  return null
}

/** Shots fly, fall, run and strike, once a step. */
export function moveShots(world, dt) {
  const S = world.shots
  let w = 0
  const targets = world.things
  for (let i = 0; i < S.length; i++) {
    const s = S[i]
    const x0 = s.x
    const y0 = s.y
    const z0 = s.z
    s.age += dt
    if (s.update) s.update(world, s, dt)
    s.x += s.vx * dt
    s.y += s.vy * dt
    s.z += s.vz * dt
    let gone = s.age > s.life
    if (!gone && s.kind !== 'torpedo' && s.y < 0) {
      gone = true
      if (s.onWater) s.onWater(world, s)
      else if (s.kind === 'bullet' && world.random() < 0.15) world.emit('spray', { x: s.x, z: s.z })
    }
    if (!gone) {
      for (const th of targets) {
        if (th.alive !== 1) continue
        if (s.by === 'me' ? !th.enemy : th.enemy || th.alive !== 1) continue
        if (s.by !== 'me' && th.role === 'player' && (th.shield > world.t || th.down)) continue
        if (s.only && s.only !== th.kind) continue
        const h = strike(s, x0, y0, z0, th)
        if (!h) continue
        gone = true
        if (s.onHit) s.onHit(world, s, th, h)
        else hurt(world, th, s.dmg, { by: s.by, x: h.x, y: h.y, z: h.z, part: h.part, weapon: s.kind })
        break
      }
    }
    if (s.fuse != null && !gone && s.age >= s.fuse) {
      gone = true
      s.burst?.(world, s)
    }
    if (!gone) S[w++] = s
  }
  S.length = w
}

/** The combo: every hit keeps it alive and builds it; a pause lets it go. */
function comboHit(world, n = 1) {
  const c = (world.combo ||= { count: 0, mult: 1, until: 0, best: 1, bestCount: 0 })
  if (world.t > c.until) c.count = 0
  c.count += n
  c.until = world.t + COMBO.window
  c.mult = Math.min(COMBO.max, 1 + Math.floor(c.count / COMBO.perStep))
  c.best = Math.max(c.best, c.mult)
  c.bestCount = Math.max(c.bestCount, c.count)
}

export function addScore(world, base) {
  const m = world.combo && world.t <= world.combo.until ? world.combo.mult : 1
  const pts = Math.round(base * m)
  world.score = (world.score || 0) + pts
  return pts
}

/**
 * Damage: from the player's shots (score, combo, the numbers) or the enemy's
 * (the player's health, the carrier's). part: a weak point struck instead of
 * the hull (it takes the damage; the hull takes a quarter).
 */
export function hurt(world, th, dmg, { by = 'me', x = th.x, y = th.y, z = th.z, part = null, weapon = 'bullet' } = {}) {
  if (th.alive !== 1) return
  if (th.role === 'player' && (th.shield > world.t || th.down)) return
  let amount = dmg
  if (th.armour && !part) amount = Math.max(1, Math.round(dmg * th.armour))
  if (part) {
    part.hp = Math.max(0, part.hp - amount)
    th.hitT = world.t
    if (part.hp <= 0) world.emit('point-out', { th, part, x, y, z })
  } else th.hp -= amount
  th.hitT = world.t
  if (by === 'me') {
    if (!world.stats.firstHit) world.stats.firstHit = world.t
    world.stats.hits = (world.stats.hits || 0) + (weapon === 'bullet' ? 1 : 0)
    comboHit(world, weapon === 'bullet' ? 1 : 4)
    const pts = addScore(world, SCORE.hit * (weapon === 'bullet' ? 1 : 3))
    world.emit('hit', { x, y, z, amount, th, part: !!part, weapon, pts })
  } else {
    if (th.role === 'player') {
      th.hurtT = world.t
      world.emit('hurt', { amount, x, y, z })
    } else world.emit('struck', { th, amount, x, y, z, weapon })
  }
  if (part && part.hp <= 0 && th.onPointOut) th.onPointOut(world, part, by)
  if (th.hp <= 0 && th.alive === 1) destroy(world, th, by)
}

/** Shot down or sunk (or, for the player, lost). */
export function destroy(world, th, by = 'me') {
  if (th.kind === 'aircraft') {
    th.alive = 2
    th.down = true
    th.fallV = -6
    th.spin = (world.random() < 0.5 ? -1 : 1) * (1.5 + world.random())
    if (!world.stats.firstExplosion) world.stats.firstExplosion = world.t
    if (th.role === 'player') {
      world.lives = (world.lives ?? PLAYER.lives) - 1
      world.lost = (world.lost || 0) + 1
      th.respawnAt = world.t + PLAYER.respawn
      world.emit('lost', { x: th.x, y: th.y, z: th.z, slot: th.slot, lives: world.lives })
      if (world.combo) world.combo.until = 0
    } else {
      world.downed = (world.downed || 0) + 1
      if (by === 'me') comboHit(world, 4)
      const pts = by === 'me' ? addScore(world, SCORE.fighter) : 0
      world.emit('shotdown', { x: th.x, y: th.y, z: th.z, slot: th.slot, th, pts })
    }
    return
  }
  th.alive = 2
  th.sinkT = world.t
  th.sinkDur = th.magazine ? 6 : 8
  th.listDir = world.random() < 0.5 ? -1 : 1
  th.fire = 1
  if (!world.stats.firstExplosion) world.stats.firstExplosion = world.t
  if (th.enemy) {
    world.sunk = (world.sunk || 0) + 1
    if (by === 'me') comboHit(world, 8)
    const pts = addScore(world, SCORE[th.role] || 500)
    world.emit('sunk', { x: th.x, y: 0, z: th.z, th, pts })
  } else world.emit('carrier-lost', { x: th.x, z: th.z })
}

/** The falling and the sinking, once a step: aircraft spin down into the sea, ships settle and are gone. */
export function wreckage(world, dt) {
  for (const th of [...world.things]) {
    if (th.alive !== 2) continue
    if (th.kind === 'aircraft') {
      th.fallV -= 18 * dt
      th.roll += th.spin * dt
      th.pitch = Math.max(-1.1, th.pitch - 0.8 * dt)
      const c = Math.cos(th.pitch)
      th.x += Math.sin(th.yaw) * c * th.v * 0.8 * dt
      th.z -= Math.cos(th.yaw) * c * th.v * 0.8 * dt
      th.y += th.fallV * dt
      if (th.y <= 0) {
        world.emit('splash', { x: th.x, z: th.z, big: false })
        if (th.role === 'player') {
          th.alive = 0
          th.y = -50
        } else world.remove(th)
      }
    } else if (world.t - th.sinkT > th.sinkDur) {
      world.remove(th)
    }
  }
}

/** The player's health back when nothing is hitting it; the respawn over the carrier, two seconds after a loss. */
export function playerLife(world, dt) {
  const me = world.me
  if (!me) return
  if (me.alive === 1 && !me.down && me.hp < me.hpMax && world.t - (me.hurtT ?? -99) > PLAYER.regenDelay) me.hp = Math.min(me.hpMax, me.hp + PLAYER.regen * dt)
  if (me.down && me.respawnAt != null && world.t >= me.respawnAt) {
    if ((world.lives ?? 1) <= 0) {
      me.respawnAt = null
      world.end?.('lives')
      return
    }
    const c = world.carrier || { x: 0, z: 0, yaw: 0 }
    Object.assign(me, { alive: 1, down: false, hp: me.hpMax, x: c.x - Math.sin(c.yaw) * 60, z: c.z + Math.cos(c.yaw) * 60, y: 75, yaw: c.yaw, pitch: 0, roll: 0, shield: world.t + PLAYER.shield, respawnAt: null })
    world.gun && (world.gun.heat = 0)
    world.emit('respawn', {})
  }
}

export function lostPlayer(world, th, dmg) {
  hurt(world, th, dmg, { by: 'them' })
}

export { ARENA }
