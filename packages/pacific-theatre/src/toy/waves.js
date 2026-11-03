// The spawner (TOY.md §3 "Waves"), the same for both sides with the names
// mirrored: 0:00 three fighters; 0:30 two destroyers from the east and three
// fighters; 1:00 a cruiser with flak and five fighters; 1:30 four fighters
// that go for the carrier; 2:00 the battleship with three turrets as weak
// points and her magazine, her secondary flak and her shells on the carrier;
// 3:00 the end if she is still afloat. Difficulty rises a notch each wave. A
// pair of fighters comes at the player whenever the sky goes empty, so there
// is never long without a target; the carrier lost ends it early.

import { bearingTo, wrapPi } from './world.js'
import { spawnFlight } from './enemies.js'
import { spawnShip } from './ships.js'
import { addScore, destroy, pointWorld, SCORE } from './combat.js'

export const DURATION = 180
export const BOSS = { turret: 90, magazine: 120, turretRadius: 15, magazineRadius: 20 }
const MAX_FIGHTERS = 12
const MAX_SHIPS = 6

const fightersAlive = (w) => w.things.filter((t) => t.role === 'fighter' && t.alive === 1).length
const shipsAlive = (w) => w.things.filter((t) => t.kind === 'ship' && t.enemy && t.alive === 1).length

/** A flight, no more than the arena holds (TOY.md §2: at most 12 enemy aircraft at once). */
function flight(w, n, opts) {
  return spawnFlight(w, Math.max(0, Math.min(n, MAX_FIGHTERS - fightersAlive(w))), { notch: w.notch, ...opts })
}

function ship(w, role, opts) {
  if (shipsAlive(w) >= MAX_SHIPS) return null
  return spawnShip(w, role, { notch: w.notch, ...opts })
}

export function waveList(side) {
  const F = side.fighter.plural
  const D = side.destroyer.name
  return [
    { at: 0.4, name: 'Wave 1', sub: `Three ${F}`, run: (w) => flight(w, 3, { from: w.me ? w.me.yaw : 0, dist: 470, y: 85, around: { x: w.me?.x ?? 0, z: w.me?.z ?? 140 } }) },
    {
      at: 30,
      name: 'Wave 2',
      sub: `Two ${D === 'destroyer' ? 'destroyers' : `${D}s`} from the east`,
      run: (w) => {
        ship(w, 'destroyer', { from: Math.PI / 2, dist: 640, offset: -90 })
        ship(w, 'destroyer', { from: Math.PI / 2, dist: 690, offset: 90 })
        flight(w, 3, { from: Math.PI / 2 + 0.3, dist: 560, y: 110 })
      },
    },
    {
      at: 60,
      name: 'Wave 3',
      sub: `A cruiser and five ${F}`,
      run: (w) => {
        ship(w, 'cruiser', { from: Math.PI * 0.75, dist: 660 })
        flight(w, 5, { from: Math.PI * 0.75 + 0.4, dist: 560, y: 120 })
      },
    },
    {
      at: 90,
      name: 'Wave 4',
      sub: `${F} going for the carrier!`,
      run: (w) => {
        flight(w, 2, { from: -Math.PI * 0.6, dist: 600, y: 60, mission: 'carrier' })
        flight(w, 2, { from: Math.PI * 0.9, dist: 620, y: 60, mission: 'carrier' })
      },
    },
    { at: 120, name: side.boss.name, sub: 'Knock out her three turrets!', boss: true, run: (w) => spawnBoss(w) },
  ]
}

/** The battleship: three turrets as weak points, then her magazine; her shells on the carrier, her secondaries' flak at you. */
export function spawnBoss(w) {
  const th = ship(w, 'boss', { from: Math.PI / 2, dist: 640 })
  if (!th) return null
  const m = th.model
  const turrets = (m.turrets || []).slice(0, 3)
  th.noHull = true
  th.points = turrets.map((t, k) => ({ name: 'turret', label: `Turret ${k + 1}`, at: t.at, battery: t.battery, j: t.j, rest: t.rest, radius: BOSS.turretRadius, hp: BOSS.turret, hpMax: BOSS.turret, open: true, bearing: t.rest ?? 0 }))
  th.points.push({ name: 'magazine', label: 'Magazine', at: [0, m.deck + 2, 0], radius: BOSS.magazineRadius, hp: BOSS.magazine, hpMax: BOSS.magazine, open: false })
  th.hpMax = th.points.reduce((a, p) => a + p.hpMax, 0)
  th.hp = th.hpMax
  th.name = w.side.boss.name
  th.gunFrom = (world) => {
    const live = th.points.filter((p) => p.name === 'turret' && p.hp > 0)
    const p = live[Math.floor(world.random() * live.length)] || th.points[0]
    return pointWorld(th, p)
  }
  th.flakFrom = () => ({ x: th.x, y: m.deck + 10, z: th.z })
  th.onPointOut = (world, part, by) => {
    part.bearing = (part.bearing ?? 0) + 40
    if (part.name === 'turret') {
      if (by === 'me') addScore(world, SCORE.turret)
      const left = th.points.filter((p) => p.name === 'turret' && p.hp > 0).length
      if (left === 0) {
        const mag = th.points.find((p) => p.name === 'magazine')
        mag.open = true
        world.emit('banner', { text: 'Her magazine is open!', sub: 'Bomb it, torpedo it, shoot it', small: true })
      } else world.emit('banner', { text: `${left} turret${left > 1 ? 's' : ''} left`, small: true })
    } else {
      // the magazine: the finale
      th.magazine = true
      world.emit('magazine', { x: th.x, y: 0, z: th.z })
      th.hp = 0
      destroy(world, th, by)
    }
  }
  w.boss = th
  return th
}

/** The boss's turrets track the player (and the dead ones hang askew); her bar is the sum of her weak points. */
function bossTick(w) {
  const th = w.boss
  if (!th || th.alive === 0) return
  const me = w.me
  const guns = (th.guns ||= {})
  for (const p of th.points) {
    if (p.name !== 'turret') continue
    if (p.hp > 0 && me && me.alive === 1) {
      const want = (wrapPi(bearingTo(th, me) - th.yaw) * 180) / Math.PI
      const d = ((want - p.bearing + 540) % 360) - 180
      p.bearing += Math.max(-1.2, Math.min(1.2, d * 0.05))
    }
    const g = (guns[p.battery] ||= { mounts: [] })
    g.mounts[p.j] = { bearing: p.bearing }
  }
  if (th.alive === 1) {
    th.hp = th.points.reduce((a, p) => a + p.hp, 0)
    const live = th.points.filter((p) => p.name === 'turret' && p.hp > 0).length
    th.silent = live === 0
    th.fire = (3 - live) / 3
  }
}

/** The spawner, once a step: the schedule, the empty-sky pairs, the end. */
export function spawner(w) {
  w.waves ||= waveList(w.side)
  w.waveAt ||= 0
  while (w.waveAt < w.waves.length && w.t >= w.waves[w.waveAt].at) {
    const wave = w.waves[w.waveAt++]
    w.notch = w.waveAt - 1
    w.waveName = wave.boss ? 'The battleship' : wave.name
    wave.run(w)
    w.emit('banner', { text: wave.name, sub: wave.sub, wave: w.waveAt })
    w.emit('wave', { n: w.waveAt, name: wave.name, boss: !!wave.boss })
  }
  bossTick(w)
  if (w.waveAt > 0 && !w.bossDoneT) refill(w)
  if (w.carrier && w.carrier.alive !== 1 && !w.over) w.end('carrier')
  if (w.boss && w.boss.alive !== 1 && !w.bossDoneT) {
    w.bossDoneT = w.t
    const left = Math.max(0, Math.round(DURATION - w.t))
    if (left > 0) {
      w.score += left * 25
      w.emit('banner', { text: `Time bonus +${left * 25}`, small: true })
    }
  }
  if (w.bossDoneT && w.t - w.bossDoneT > 3.5) w.end('boss')
  if (w.t >= DURATION) w.end('time')
}

/** Something to shoot within a few seconds whenever the sky goes empty (TOY.md §2: never more than five seconds without a target). */
function refill(w) {
  if (w.things.some((th) => th.enemy && th.alive === 1)) {
    w.emptySince = null
    return
  }
  w.emptySince ??= w.t
  if (w.t - w.emptySince < 2.5) return
  // (not just before a wave: it will bring its own)
  const next = w.waves[w.waveAt]
  if (next && next.at - w.t < 4) return
  w.emptySince = null
  const me = w.me
  const ahead = me ? me.yaw + (w.random() - 0.5) * 0.6 : w.random() * 6.28
  flight(w, 2, { from: ahead, dist: 420, y: Math.max(50, Math.min(140, me?.y ?? 90)), around: me ? { x: me.x, z: me.z } : null })
  w.emit('banner', { text: `${w.side.fighter.plural} inbound`, small: true })
}
