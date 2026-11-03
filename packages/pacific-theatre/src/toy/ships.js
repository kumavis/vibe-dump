// Ships, bombs and the torpedo (TOY.md §3 "Weapons", "Enemies"): destroyers
// and cruisers steer for the carrier, stand off and shell her, and throw
// flak at the player that is slow enough to see coming and dodge (it bursts
// where they guessed you would be). The player's lock-on: a ship held in the
// reticle for most of a second is locked; bombs (three) and the torpedo (one,
// armed only low over the water) then home a little onto her. Bombs and the
// torpedo come back every twenty seconds, or at once through the ring over
// the carrier.

import { bearingTo, wrapPi, forward } from './world.js'
import { fire, hurt, pointWorld, strike } from './combat.js'

export const SHIPS = {
  destroyer: { hp: 150, armour: 0.3, speed: 7, standoff: 280, gunEvery: 4.5, gunDmg: 4, flakEvery: 2.8 },
  cruiser: { hp: 260, armour: 0.25, speed: 5.5, standoff: 340, gunEvery: 3.4, gunDmg: 6, flakEvery: 1.8 },
  boss: { hp: 9999, armour: 0.1, speed: 5, standoff: 380, gunEvery: 5.5, gunDmg: 14, flakEvery: 0.9 },
}
export const FLAK = { speed: 170, radius: 26, dmg: 12, error: 26, range: 650 }
export const ORD = { bombs: 3, reload: 20, bombDmg: 50, torpDmg: 100, armBelow: 45, lockTime: 0.7, lockCone: 0.3, lockRange: 400, hold: 1.5 }

/** A ship of a role coming in from a bearing (from the arena's middle) at a distance. */
export function spawnShip(world, role, { from = Math.PI / 2, dist = 640, notch = 0, offset = 0 } = {}) {
  const S = SHIPS[role]
  const x = Math.sin(from) * dist + Math.cos(from) * offset
  const z = -Math.cos(from) * dist + Math.sin(from) * offset
  const hp = Math.round(S.hp * (1 + 0.1 * notch))
  const th = world.spawn(role, { enemy: true, x, y: 0, z, yaw: Math.atan2(-x, z), v: S.speed, hp, hpMax: hp, armour: S.armour, notch, gunCd: 2 + world.random() * 2, flakCd: 2 + world.random(), name: world.side[role].name })
  return th
}

/** Every enemy ship, once a step: steer for the carrier, stand off, shell her, flak at the player. */
export function shipsAI(world, dt) {
  const me = world.me
  const cv = world.carrier
  for (const th of world.things) {
    if (th.kind !== 'ship' || !th.enemy || th.alive !== 1) continue
    const S = SHIPS[th.role]
    const tgt = cv && cv.alive === 1 ? cv : { x: 0, z: 0 }
    const d = Math.hypot(tgt.x - th.x, tgt.z - th.z)
    let want = bearingTo(th, tgt)
    // inside the stand-off: put her on the beam and circle
    if (d < S.standoff) want += (th.slot % 2 ? 1 : -1) * Math.PI * 0.5 * Math.min(1, (S.standoff - d) / 80 + 0.6)
    const diff = wrapPi(want - th.yaw)
    th.yaw = wrapPi(th.yaw + Math.max(-1, Math.min(1, diff)) * 0.12 * dt)
    th.v = S.speed
    th.x += Math.sin(th.yaw) * th.v * dt
    th.z -= Math.cos(th.yaw) * th.v * dt
    // the guns at the carrier
    th.gunCd -= dt
    if (th.gunCd <= 0 && cv?.alive === 1 && d < 750 && !th.silent) {
      th.gunCd = S.gunEvery * (1 - 0.05 * th.notch) * (0.8 + world.random() * 0.4)
      shellCarrier(world, th, S.gunDmg)
    }
    // flak at the player
    th.flakCd -= dt
    if (me && me.alive === 1 && !me.down && th.flakCd <= 0) {
      const dm = Math.hypot(me.x - th.x, me.y, me.z - th.z)
      if (dm < FLAK.range && dm > 40) {
        th.flakCd = S.flakEvery * (1 - 0.06 * th.notch) * (0.8 + world.random() * 0.4)
        flakAt(world, th, me)
      }
    }
  }
}

function shellCarrier(world, th, dmg) {
  const cv = world.carrier
  const from = th.gunFrom ? th.gunFrom(world) : { x: th.x, y: 12, z: th.z }
  world.emit('muzzle', { x: from.x, y: from.y, z: from.z, size: th.role === 'boss' ? 26 : 12 })
  const onTarget = world.random() < 0.62
  const tx = cv.x + (onTarget ? (world.random() - 0.5) * 30 : (world.random() - 0.5) * 160)
  const tz = cv.z + (onTarget ? (world.random() - 0.5) * 30 : (world.random() - 0.5) * 160)
  const T = 2.4
  fire(world, {
    kind: 'shell',
    look: 0,
    x: from.x,
    y: from.y,
    z: from.z,
    vx: (tx - from.x) / T,
    vy: (0 - from.y) / T + 0.5 * 30 * T,
    vz: (tz - from.z) / T,
    life: T + 1,
    by: 'them',
    dmg,
    r: 3,
    only: 'ship',
    update: (w, s, dt) => (s.vy -= 30 * dt),
    onHit: (w, s, t, h) => hurt(w, t, s.dmg, { by: 'them', x: h.x, y: h.y, z: h.z, weapon: 'shell' }),
    onWater: (w, s) => w.emit('shell-splash', { x: s.x, z: s.z }),
  })
}

/** A flak shell: slow tracer to where she guessed the player will be, bursting there. */
function flakAt(world, th, me) {
  const from = th.flakFrom ? th.flakFrom(world) : { x: th.x, y: (th.model?.deck ?? 8) + 6, z: th.z }
  const d = Math.hypot(me.x - from.x, me.y - from.y, me.z - from.z)
  const T = d / FLAK.speed
  const f = forward(me)
  const e = FLAK.error * (1 - 0.06 * th.notch)
  const ax = me.x + f.x * me.v * T + (world.random() - 0.5) * 2 * e
  const ay = Math.max(15, me.y + f.y * me.v * T + (world.random() - 0.5) * e)
  const az = me.z + f.z * me.v * T + (world.random() - 0.5) * 2 * e
  const L = Math.hypot(ax - from.x, ay - from.y, az - from.z) || 1
  const fuse = L / FLAK.speed
  world.flakNear = Math.max(world.flakNear || 0, world.t + fuse)
  fire(world, {
    kind: 'flak',
    look: 1,
    x: from.x,
    y: from.y,
    z: from.z,
    vx: ((ax - from.x) / L) * FLAK.speed,
    vy: ((ay - from.y) / L) * FLAK.speed,
    vz: ((az - from.z) / L) * FLAK.speed,
    life: fuse + 1,
    fuse,
    by: 'them',
    dmg: 0,
    inert: true, // (it strikes nothing on the way: it bursts at its fuse)
    burst: (w, s) => {
      const m = w.me
      const dd = m && m.alive === 1 ? Math.hypot(m.x - s.x, m.y - s.y, m.z - s.z) : 1e9
      w.emit('flak', { x: s.x, y: s.y, z: s.z, near: dd < FLAK.radius * 1.6 })
      if (dd < FLAK.radius) hurt(w, m, Math.round(FLAK.dmg * (1 - (dd / FLAK.radius) * 0.6)), { by: 'them', x: s.x, y: s.y, z: s.z, weapon: 'flak' })
    },
  })
}

/** The lock-on: a ship (or an open weak point) held in the reticle for most of a second. */
export function lockOn(world, dt) {
  const me = world.me
  const lk = (world.lock ||= { th: null, part: null, progress: 0, locked: false, hold: 0, weapon: null })
  if (!me || me.alive !== 1 || me.down) {
    lk.th = null
    lk.locked = false
    lk.progress = 0
    return
  }
  let best = null
  let bestA = ORD.lockCone
  let bestPart = null
  for (const th of world.things) {
    if (th.kind !== 'ship' || !th.enemy || th.alive !== 1) continue
    const cands = th.points?.some((p) => p.open && p.hp > 0) ? th.points.filter((p) => p.open && p.hp > 0).map((p) => ({ P: pointWorld(th, p), p })) : [{ P: th, p: null }]
    for (const { P, p } of cands) {
      const d = Math.hypot(P.x - me.x, P.z - me.z)
      if (d > ORD.lockRange || d < 50) continue
      const a = Math.abs(wrapPi(Math.atan2(P.x - me.x, -(P.z - me.z)) - me.yaw))
      // (a long ship is easier to hold: the cone opens with her length at the range)
      const cone = a - Math.atan2((th.model?.L ?? 100) * 0.25, d)
      if (cone < bestA) {
        bestA = cone
        best = th
        bestPart = p
      }
    }
  }
  if (best && (best === lk.th || !lk.locked)) {
    if (best !== lk.th) {
      lk.th = best
      lk.progress = 0
      lk.locked = false
    }
    lk.part = bestPart
    lk.progress = Math.min(1, lk.progress + dt / ORD.lockTime)
    lk.hold = ORD.hold
    if (lk.progress >= 1 && !lk.locked) {
      lk.locked = true
      world.emit('locked', { th: best })
    }
  } else {
    lk.hold -= dt
    if (lk.hold <= 0 || !lk.th || lk.th.alive !== 1) {
      lk.th = null
      lk.part = null
      lk.locked = false
      lk.progress = 0
    }
  }
  const am = world.ammo
  am.armed = am.torpedo > 0 && me.y < ORD.armBelow
  lk.weapon = am.armed ? 'torpedo' : am.bombs > 0 ? 'bomb' : null
  // in range: a torpedo always (it runs on); a bomb when it can fall that far, bent by its homing
  if (lk.th) {
    const P = lk.part ? pointWorld(lk.th, lk.part) : lk.th
    const d = Math.hypot(P.x - me.x, P.z - me.z)
    const tf = Math.sqrt((2 * Math.max(1, me.y)) / 19.6)
    lk.inRange = lk.weapon === 'torpedo' || (lk.weapon === 'bomb' && d < me.v * tf + 35 * tf * tf + 30)
  } else lk.inRange = false
}

/** Drops (the second button), the reload, the ring over the carrier. */
export function ordnance(world, dt) {
  const am = (world.ammo ||= { bombs: ORD.bombs, bombsMax: ORD.bombs, torpedo: 1, reloadIn: ORD.reload, armed: false })
  const me = world.me
  const cv = world.carrier
  // the reload: everything back every twenty seconds, or at once through the ring
  const full = am.bombs >= am.bombsMax && am.torpedo > 0
  if (!full) {
    am.reloadIn -= dt
    if (am.reloadIn <= 0) reload(world, false)
  } else am.reloadIn = ORD.reload
  if (cv && cv.alive === 1) {
    world.ring = { x: cv.x, y: 55, z: cv.z, yaw: cv.yaw, ready: !full }
    if (!full && me && me.alive === 1 && Math.hypot(me.x - cv.x, me.y - 55, me.z - cv.z) < 30) reload(world, true)
  } else world.ring = null
  // the drops
  while (world.input.drop > 0) {
    world.input.drop--
    if (!me || me.alive !== 1 || me.down) continue
    const lk = world.lock
    const target = lk?.locked ? lk.th : null
    if (am.armed && (target || am.bombs === 0)) launchTorpedo(world, me, target)
    else if (am.bombs > 0) dropBomb(world, me, target, lk?.part)
    else world.emit('empty', {})
  }
}

function reload(world, ring) {
  const am = world.ammo
  am.bombs = am.bombsMax
  am.torpedo = 1
  am.reloadIn = ORD.reload
  world.emit('reload', { ring })
}

function dropBomb(world, me, target, part) {
  world.ammo.bombs--
  world.stats.drops = (world.stats.drops || 0) + 1
  const f = forward(me)
  fire(world, {
    kind: 'bomb',
    look: 2,
    x: me.x,
    y: me.y - 2,
    z: me.z,
    vx: f.x * me.v,
    vy: f.y * me.v * 0.5 - 2,
    vz: f.z * me.v,
    life: 12,
    by: 'me',
    dmg: ORD.bombDmg,
    r: 9,
    only: 'ship',
    update: (w, s, dt) => {
      s.vy -= 19.6 * dt
      // it homes a little: its run along the sea bent toward where she will be when it lands
      const t = s.target
      if (t && t.alive === 1) {
        const P = s.part && s.part.hp > 0 ? pointWorld(t, s.part) : t
        const tf = Math.max(0.2, (s.vy + Math.sqrt(Math.max(0, s.vy * s.vy + 2 * 19.6 * s.y))) / 19.6)
        const wx = (P.x + Math.sin(t.yaw) * t.v * tf - s.x) / tf
        const wz = (P.z - Math.cos(t.yaw) * t.v * tf - s.z) / tf
        const k = Math.min(1, dt * 2.5)
        s.vx += Math.max(-70 * dt, Math.min(70 * dt, (wx - s.vx) * k))
        s.vz += Math.max(-70 * dt, Math.min(70 * dt, (wz - s.vz) * k))
      }
    },
    target,
    part,
    onHit: (w, s, t, h) => {
      w.stats.ordHits = (w.stats.ordHits || 0) + 1
      hurt(w, t, s.dmg, { by: 'me', x: h.x, y: h.y, z: h.z, part: h.part, weapon: 'bomb' })
    },
    onWater: (w, s) => {
      // (a near miss alongside still counts a little: generous)
      for (const t of w.things) {
        if (t.kind !== 'ship' || !t.enemy || t.alive !== 1) continue
        const h = strike({ x: s.x, y: 2, z: s.z, r: 16 }, s.x, 6, s.z, t)
        if (h) {
          w.stats.ordHits = (w.stats.ordHits || 0) + 1
          return hurt(w, t, Math.round(s.dmg * 0.5), { by: 'me', x: s.x, y: 3, z: s.z, part: h.part, weapon: 'bomb' })
        }
      }
      w.emit('shell-splash', { x: s.x, z: s.z })
    },
  })
  world.emit('drop', { weapon: 'bomb' })
}

function launchTorpedo(world, me, target) {
  world.ammo.torpedo = 0
  world.stats.drops = (world.stats.drops || 0) + 1
  const yaw = me.yaw
  fire(world, {
    kind: 'torpedo',
    look: 3,
    x: me.x + Math.sin(yaw) * 20,
    y: 0.6,
    z: me.z - Math.cos(yaw) * 20,
    vx: Math.sin(yaw) * 48,
    vy: 0,
    vz: -Math.cos(yaw) * 48,
    life: 22,
    by: 'me',
    dmg: ORD.torpDmg,
    r: 6,
    only: 'ship',
    target,
    update: (w, s, dt) => {
      // it runs at the sea's surface and turns a little toward her
      s.y = 0.6
      s.vy = 0
      const t = s.target
      if (!t || t.alive !== 1) return
      const cur = Math.atan2(s.vx, -s.vz)
      const want = Math.atan2(t.x - s.x, -(t.z - s.z))
      const nyaw = cur + Math.max(-0.6 * dt, Math.min(0.6 * dt, wrapPi(want - cur)))
      s.vx = Math.sin(nyaw) * 48
      s.vz = -Math.cos(nyaw) * 48
    },
    onHit: (w, s, t, h) => {
      w.stats.ordHits = (w.stats.ordHits || 0) + 1
      w.emit('boom', { x: h.x, y: 2, z: h.z, size: 1.6 })
      hurt(w, t, s.dmg, { by: 'me', x: h.x, y: 4, z: h.z, part: h.part, weapon: 'torpedo' })
    },
  })
  world.emit('drop', { weapon: 'torpedo' })
}
