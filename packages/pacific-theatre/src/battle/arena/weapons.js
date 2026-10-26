// The arena's weapons (ROUND-3.md §3 "Weapons"): shells flown by the record's
// ballistics (sim/ballistics.js, sim/guns.js, by import) with a third of the
// historical dispersion, the AI's lead solved exactly; AA as the record's
// hazard model (sim/aa.js) three times over, with tracer, and the player's AA
// as round two's director; torpedoes at one and a half times their speed
// with a 6 km run; bombs; hit boxes one and a half times the hull. A hit on a
// ship already going down registers nothing.
//
// The AI's guns walk their range in (research/engine-3.md §5): the lead on
// the target's motion is exact, the range is not at the first salvo and
// closes salvo by salvo, and a target that turns hard spoils it again; the
// splashes walking onto a ship are the gunnery the player sees and evades.

import { A } from './params.js'
import { hitShip, hitAircraft, shellDamage, WEAPON_DAMAGE, zoneWord } from './damage.js'
import { Projectiles, KIND, FLAG, flyShell, flyLight, runTorpedo, bulletK, bombK, muzzle, layOn } from '../sim/guns.js'
import { shellOf, bombImpact } from '../sim/ballistics.js'
import { segmentBox, segmentPoint } from '../sim/collide.js'
import { shipLambda, aaReach, eraFactor, fRange } from '../sim/aa.js'
import { leadOn, directorEye } from '../sim/ai.js'
import { arcCovers } from '../sim/units.js'
import { FX, dyeCode } from '../sim/effects.js'
import { DEG } from './physics.js'

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const KN = 0.514444
const prev = [0, 0, 0]
const hitOut = { s: 0, lx: 0, ly: 0, lz: 0 }
export { KIND, FLAG }

export const createProjectiles = () => new Projectiles(4096)

/** A weapon's index in the arena's list (the shells' drag model kept beside it). */
export function weaponIdx(ar, w) {
  if (!w) return -1
  let i = ar.weaponIndex.get(w.id)
  if (i == null) {
    i = ar.weaponList.length
    ar.weaponList.push({ w, shell: w.kind === 'gun' || w.kind === 'aa' ? shellOf(w) : null })
    ar.weaponIndex.set(w.id, i)
  }
  return i
}

// --- ship guns -----------------------------------------------------------------------------------------------

/** A mount's world position. */
export function mountPos(ar, i, mt, out = [0, 0, 0]) {
  const s = ar.state
  const h = s.heading[i] * DEG
  const c = Math.cos(h)
  const sn = Math.sin(h)
  out[0] = s.pos[3 * i] + c * mt.x - sn * mt.z
  out[1] = mt.y
  out[2] = s.pos[3 * i + 2] + sn * mt.x + c * mt.z
  return out
}

/** Whether a mount's arc covers a world point. */
export function bears(ar, i, mt, tx, tz) {
  const s = ar.state
  const brg = (Math.atan2(tx - s.pos[3 * i], -(tz - s.pos[3 * i + 2])) / DEG + 360) % 360
  return arcCovers(mt.arc, (brg - s.heading[i] + 360) % 360)
}

/** The point to lay a battery on to meet ship ti: its position at the time of flight (the lead, solved exactly). */
export function leadPoint(ar, i, ti, bg) {
  const s = ar.state
  const tbl = bg.battery.table
  let ax = s.pos[3 * ti]
  let az = s.pos[3 * ti + 2]
  let tof = 0
  for (let k = 0; k < 3; k++) {
    const lay = layOn(tbl, s.pos[3 * i], s.pos[3 * i + 2], ax, az)
    if (!lay) return null
    tof = lay.tof
    ax = s.pos[3 * ti] + s.vel[3 * ti] * tof
    az = s.pos[3 * ti + 2] + s.vel[3 * ti + 2] * tof
  }
  return { x: ax, z: az, tof }
}

/**
 * Fire mounts at a point (px, pz): each laid with own motion allowed for,
 * each shell about the point with a third of the gun's dispersion. Returns
 * the shells fired and the longest time of flight.
 */
export function fireMounts(ar, i, bg, mounts, px, pz, { player = false, target = -1 } = {}) {
  const s = ar.state
  const b = bg.battery
  const w = b.weapon
  const tbl = b.table
  const disp = w.dispersion || { rangePct: 1.3, mils: 2.5 }
  const g = ar.rngs.gun
  const vx = s.vel[3 * i]
  const vz = s.vel[3 * i + 2]
  const mp = [0, 0, 0]
  let fired = 0
  let tofMax = 0
  for (const mt of mounts) {
    mountPos(ar, i, mt, mp)
    let lay = layOn(tbl, mp[0], mp[2], px, pz)
    if (!lay) continue
    const keep = lay.range / Math.max(1, w.mvMs * Math.cos(lay.el * DEG) * lay.tof)
    lay = layOn(tbl, mp[0], mp[2], px - vx * lay.tof * keep, pz - vz * lay.tof * keep) || lay
    mt.bearing = (lay.az - s.heading[i] + 360) % 360
    mt.elev = lay.el
    mt.readyAt = ar.t + b.reloadS
    tofMax = Math.max(tofMax, lay.tof)
    for (let k = 0; k < b.barrels; k++) {
      const sR = (((disp.rangePct / 100) * lay.range) / 3.5) * A.shellDispersionK
      const dEl = (g.gauss() * sR) / Math.max(1, lay.dRdE)
      const dAz = ((g.gauss() * disp.mils) / 3.5 / 1000 / DEG) * A.shellDispersionK
      const [ux, uy, uz] = muzzle(w.mvMs, lay.az + dAz, lay.el + dEl, vx, vz)
      const p = ar.projectiles.spawn(KIND.shell, mp[0], mp[1], mp[2], ux, uy, uz, { calibreMm: w.calibreMm, owner: i, weapon: bg.wi, t: ar.t, target, flags: player ? FLAG.player : 0 })
      if (p >= 0) fired++
    }
    ar.fx(FX.flash, mp[0], mp[1] + 2, mp[2], { unit: i, dx: Math.sin(lay.az * DEG), dz: -Math.cos(lay.az * DEG), size: w.calibreMm / 100 })
  }
  return { fired, tof: tofMax }
}

/** The AI's ranging on a target (the walk-in): a solution per target, improved by each fall it has seen. */
function solutionOn(ar, x, ti, key = ti) {
  x.sol ||= new Map()
  let sol = x.sol.get(key)
  const s = ar.state
  if (!sol) {
    sol = { pct: A.aiGun.startPct, mils: A.aiGun.startMils, ref: s.heading[ti], own: s.heading[ar._self], seenAt: -1 }
    x.sol.set(key, sol)
  }
  // a fall seen since the last salvo walks the range in
  if (sol.seenAt >= 0 && ar.t >= sol.seenAt) {
    sol.pct = Math.max(A.aiGun.floorPct, sol.pct * (1 - A.aiGun.improve))
    sol.mils = Math.max(A.aiGun.floorMils, sol.mils * (1 - A.aiGun.improve))
    sol.seenAt = -1
  }
  // a hard turn by the target, or by the firing ship herself, spoils the solution
  const turn = Math.abs(((s.heading[ti] - sol.ref + 540) % 360) - 180)
  const own = Math.abs(((s.heading[ar._self] - sol.own + 540) % 360) - 180)
  if (turn > A.aiGun.resetTurnDeg || own > A.aiGun.resetTurnDeg) {
    sol.pct += (A.aiGun.startPct - sol.pct) * A.aiGun.resetShare
    sol.mils += (A.aiGun.startMils - sol.mils) * A.aiGun.resetShare
    sol.ref = s.heading[ti]
    sol.own = s.heading[ar._self]
  }
  return sol
}

/**
 * Whether the AI may fire this battery at ti now: while it is still ranging
 * (its error above the floor) a battery waits to see its last salvo fall.
 */
export function aiMayFire(ar, i, ti, key = ti) {
  const sol = ar._X[i].sol?.get(key)
  if (!sol) return true
  return sol.seenAt < 0 || ar.t >= sol.seenAt || sol.mils <= A.aiGun.floorMils * 1.3
}

/** One AI salvo from a battery at ship ti: the exact lead, the walk-in error, the dispersion. */
export function aiSalvo(ar, i, bg, mounts, ti) {
  const lp = leadPoint(ar, i, ti, bg)
  if (!lp) return 0
  const x = ar._X[i]
  const s = ar.state
  // (a solution per battery and target: each battery's director spots its own falls)
  const key = `${bg.battery.index}:${ti}`
  if (!aiMayFire(ar, i, ti, key)) return 0
  ar._self = i
  const sol = solutionOn(ar, x, ti, key)
  const g = ar.rngs.gun
  const R = Math.hypot(lp.x - s.pos[3 * i], lp.z - s.pos[3 * i + 2])
  const eR = g.gauss() * (sol.pct / 100) * R
  const eD = g.gauss() * (sol.mils / 1000) * R
  const ux = (lp.x - s.pos[3 * i]) / Math.max(1, R)
  const uz = (lp.z - s.pos[3 * i + 2]) / Math.max(1, R)
  const px = lp.x + ux * eR - uz * eD
  const pz = lp.z + uz * eR + ux * eD
  const r = fireMounts(ar, i, bg, mounts, px, pz, { target: ti })
  // the AI's salvo fire: a light battery no oftener than every 6 s, a medium one every 10 s (by director, not by the gun's own rate)
  const cal = bg.battery.weapon.calibreMm
  const minS = cal < 150 ? A.aiGun.minIntervalS.light : cal < 250 ? A.aiGun.minIntervalS.medium : 0
  if (minS) for (const mt of mounts) mt.readyAt = Math.max(mt.readyAt, ar.t + minS)
  if (r.fired && sol.seenAt < 0) sol.seenAt = ar.t + r.tof
  return r.fired
}

// --- torpedoes ---------------------------------------------------------------------------------------------------

/** A torpedo weapon's arcade speed (m/s): its fastest setting, × 1.5. */
export function torpedoSpeed(w) {
  const kn = w?.settings?.[0]?.speedKn ?? w?.speedKn ?? 40
  return kn * KN * A.torpedoSpeedK
}

/** The bearing (deg) a torpedo at speed v from (x, z) must run to meet ship ti on its course (null when it cannot). */
export function torpedoIntercept(ar, x, z, ti, v) {
  const s = ar.state
  const px = s.pos[3 * ti] - x
  const pz = s.pos[3 * ti + 2] - z
  const tvx = s.vel[3 * ti]
  const tvz = s.vel[3 * ti + 2]
  // |p + tv·t| = v·t
  const a = tvx * tvx + tvz * tvz - v * v
  const b = 2 * (px * tvx + pz * tvz)
  const c = px * px + pz * pz
  let t
  if (Math.abs(a) < 1e-6) t = -c / b
  else {
    const d = b * b - 4 * a * c
    if (d < 0) return null
    const r1 = (-b - Math.sqrt(d)) / (2 * a)
    const r2 = (-b + Math.sqrt(d)) / (2 * a)
    t = Math.min(r1, r2) > 0 ? Math.min(r1, r2) : Math.max(r1, r2)
  }
  if (!(t > 0)) return null
  const ix = px + tvx * t
  const iz = pz + tvz * t
  return { bearing: (Math.atan2(ix, -iz) / DEG + 360) % 360, t, range: Math.hypot(ix, iz) }
}

/** A ship's torpedoes: n of them fanned about a bearing. Returns the number in the water. */
export function fireShipTorpedoes(ar, i, bearing, n, spreadDeg, { player = false } = {}) {
  const x = ar._X[i]
  const tp = x.torp
  if (!tp || tp.left <= 0 || ar.t < tp.readyAt) return 0
  n = Math.min(n, tp.left)
  const s = ar.state
  const w = tp.weapon
  const wi = weaponIdx(ar, w)
  const v = torpedoSpeed(w)
  const h = s.heading[i] * DEG
  // from the beam on the side the bearing lies
  const rel = ((bearing - s.heading[i] + 540) % 360) - 180
  const side = rel >= 0 ? 1 : -1
  const ox = s.pos[3 * i] + Math.cos(h) * side * x.model.B * 0.5
  const oz = s.pos[3 * i + 2] + Math.sin(h) * side * x.model.B * 0.5
  let k = 0
  for (let j = 0; j < n; j++) {
    const b = (bearing + (j - (n - 1) / 2) * spreadDeg) * DEG
    const p = ar.projectiles.spawn(KIND.torpedo, ox, -2, oz, Math.sin(b) * v, 0, -Math.cos(b) * v, { calibreMm: w.calibreMm ?? 533, owner: i, weapon: wi, t: ar.t, flags: player ? FLAG.player : 0, life: A.torpedoRunM })
    if (p >= 0) {
      ar._torps.add(p)
      k++
    }
  }
  tp.left -= k
  tp.readyAt = ar.t + (tp.left > 0 && tp.left % tp.perSalvo === 0 ? A.torpedoReloadS : 4)
  if (k) ar.fx(FX.splash, ox, 0, oz, { unit: i, size: 6 })
  return k
}

// --- aircraft ordnance ----------------------------------------------------------------------------------------------

/** An aircraft's bomb: released with its velocity. Returns the projectile or −1. */
export function dropBomb(ar, i, { player = false } = {}) {
  const x = ar._X[i]
  const am = x.ammo
  if (!am || am.bombs <= 0) return -1
  const b = x.body
  const w = am.bomb || { id: 'arena-bomb', kind: 'bomb', massKg: 250 }
  const p = ar.projectiles.spawn(KIND.bomb, b.x, b.y - 2, b.z, b.vx, b.vy - 1, b.vz, { calibreMm: 300, owner: i, weapon: weaponIdx(ar, w), t: ar.t, flags: player ? FLAG.player : 0 })
  if (p >= 0) am.bombs--
  return p
}

/** An aircraft's torpedo: dropped into the water ahead of it (the arcade's wide window: below 150 m). */
export function dropTorpedo(ar, i, { player = false } = {}) {
  const x = ar._X[i]
  const am = x.ammo
  if (!am || am.torpedoes <= 0) return -1
  const b = x.body
  am.torpedoes--
  const w = x.model.torpedo
  const ground = ar.world.metresAt(b.x, b.z)
  if (b.y > 150 + Math.max(0, ground) || ground > -3) {
    // too high, or over the land: it breaks on the water
    ar.fx(FX.splash, b.x, 0, b.z, { unit: i, size: 10 })
    ar._onTorpedoBroke?.(i, player)
    return -1
  }
  const v = torpedoSpeed(w)
  const h = b.psi
  const p = ar.projectiles.spawn(KIND.torpedo, b.x, -2, b.z, Math.sin(h) * v, 0, -Math.cos(h) * v, { calibreMm: 450, owner: i, weapon: weaponIdx(ar, w), t: ar.t, flags: player ? FLAG.player : 0, life: A.torpedoRunM })
  if (p >= 0) ar._torps.add(p)
  ar.fx(FX.splash, b.x, 0, b.z, { unit: i, size: 12 })
  return p
}

/** Where a bomb released now falls ({ x, z, tof }), with the target's motion over the fall for the reticle. */
export function bombPoint(ar, i) {
  const b = ar._X[i].body
  const w = ar._X[i].ammo?.bomb
  return bombImpact(b.x, b.y, b.z, b.vx, b.vy, b.vz, { k: bombK(w?.massKg ?? 250), dt: 0.08 })
}

/** The player's guns: a stream of tracer projectiles along the nose (each a few rounds, a share of a hit). */
export function firePlayerGuns(ar, i, dt) {
  const x = ar._X[i]
  const am = x.ammo
  if (!am) return 0
  x.gunT = (x.gunT ?? 0) - dt
  if (x.gunT > 0) return 0
  x.gunT = A.playerRound.every
  const b = x.body
  let n = 0
  for (const g of am.guns) {
    if (!g.fixed || g.left <= 0) continue
    const w = g.weapon
    const mv = w.mvMs ?? 850
    const share = (w.calibreMm ?? 12.7) >= 20 ? A.playerRound.hitShare.cannon : A.playerRound.hitShare.mg
    const cg = Math.cos(b.gamma)
    const fx = cg * Math.sin(b.psi)
    const fy = Math.sin(b.gamma)
    const fz = -cg * Math.cos(b.psi)
    const sp = (ar.rngs.fx.next() - 0.5) * 0.004
    const p = ar.projectiles.spawn(KIND.bullet, b.x + fx * 6, b.y + fy * 6, b.z + fz * 6, b.vx + (fx + sp) * mv, b.vy + (fy + sp) * mv, b.vz + (fz - sp) * mv, { calibreMm: w.calibreMm ?? 12.7, owner: i, t: ar.t, flags: FLAG.player, life: A.playerRound.lifeS, aux: share * Math.min(2, g.count / 2) })
    if (p >= 0) n++
    g.left = Math.max(0, g.left - Math.round(((w.rofRpm ?? 800) / 60) * A.playerRound.every * g.count))
  }
  return n
}

/** An AI fighter's burst at aircraft j: tracer along the line, and a hit drawn from the geometry. Returns 'down' | 'hit' | null. */
export function aiBurst(ar, i, j, angleRad, range) {
  const s = ar.state
  const o = 3 * i
  const q = 3 * j
  ar.fx(FX.tracer, s.pos[o], s.pos[o + 1], s.pos[o + 2], { unit: i, dx: s.pos[q] - s.pos[o], dy: s.pos[q + 1] - s.pos[o + 1], dz: s.pos[q + 2] - s.pos[o + 2], size: 1, data: 1 })
  const x = ar._X[i]
  const am = x.ammo
  if (am) for (const g of am.guns) if (g.fixed) g.left = Math.max(0, g.left - Math.round(((g.weapon.rofRpm ?? 800) / 60) * 0.6 * g.count))
  const p = A.burst.pHit * Math.max(0, 1 - angleRad / (A.burst.coneDeg * DEG)) * (1 - 0.45 * clamp(range / A.burst.rangeM, 0, 1)) * (x.skill ?? 1)
  if (ar.rngs.ai.next() < p) return hitAircraft(ar, j, 1, i, 'guns')
  return null
}

// --- projectiles ----------------------------------------------------------------------------------------------------

function shipBoxHit(ar, i, ax, ay, az, bx, by, bz, yLo = null) {
  const m = ar._X[i].model
  const h = m.half
  const s = ar.state
  return segmentBox(ax, ay, az, bx, by, bz, s.pos[3 * i], s.pos[3 * i + 2], s.heading[i], h.x * A.hitBoxK, h.z * A.hitBoxK, yLo ?? h.yLo, h.yHi, hitOut)
}

/** The ships near a point (any side), as hit candidates. */
function shipsNear(ar, x, z, r) {
  const out = ar._near
  out.length = 0
  const s = ar.state
  for (const i of ar._ships) {
    if (s.alive[i] === 0) continue
    const L = ar._X[i].model.L * A.hitBoxK * 0.5 + r
    const dx = s.pos[3 * i] - x
    const dz = s.pos[3 * i + 2] - z
    if (dx * dx + dz * dz < L * L) out.push(i)
  }
  return out
}

export function stepProjectiles(ar, dt) {
  const pr = ar.projectiles
  if (!pr.count) return
  for (let p = 0; p < pr.capacity; p++) {
    if (!pr.alive[p]) continue
    const k = pr.kind[p]
    const o = 3 * p
    if (k === KIND.shell) {
      flyShell(pr, p, ar.weaponList[pr.weapon[p]].shell, dt, prev)
      shellHits(ar, p)
    } else if (k === KIND.bullet) {
      flyLight(pr, p, bulletK(pr.calibreMm[p]), dt, prev)
      pr.life[p] -= dt
      bulletHits(ar, p)
      if (pr.alive[p] && (pr.life[p] <= 0 || pr.pos[o + 1] < ar.world.heightAt(pr.pos[o], pr.pos[o + 2]))) {
        if (pr.pos[o + 1] < 1) ar.fx(FX.splash, pr.pos[o], 0, pr.pos[o + 2], { size: 2 })
        pr.kill(p)
      }
    } else if (k === KIND.bomb) {
      const w = ar.weaponList[pr.weapon[p]]?.w
      flyLight(pr, p, bombK(w?.massKg ?? 250), dt, prev)
      bombHits(ar, p)
    } else if (k === KIND.torpedo) {
      runTorpedo(pr, p, dt, prev)
      if (!(pr.flags[p] & FLAG.armed) && pr.aux[p] >= A.torpedoArmM) pr.flags[p] |= FLAG.armed
      torpedoHits(ar, p)
      if (pr.alive[p] && (pr.life[p] <= 0 || ar.world.metresAt(pr.pos[o], pr.pos[o + 2]) > -2)) {
        if (pr.life[p] > 0) ar.fx(FX.splash, pr.pos[o], 0, pr.pos[o + 2], { size: 8 })
        pr.kill(p)
        ar._torps.delete(p)
      }
    }
  }
}

function shellDye(ar, p) {
  const o = ar.projectiles.owner[p]
  if (o < 0 || ar.night) return 0
  const x = ar._X[o]
  return dyeCode(x.model?.dyes?.[ar.slots[o].name] ?? null)
}

function shellHits(ar, p) {
  const pr = ar.projectiles
  const o = 3 * p
  const x1 = pr.pos[o]
  const y1 = pr.pos[o + 1]
  const z1 = pr.pos[o + 2]
  if (y1 < 70) {
    for (const i of shipsNear(ar, x1, z1, 60)) {
      if (i === pr.owner[p] || ar.state.alive[i] !== 1) continue
      const sx = shipBoxHit(ar, i, prev[0], prev[1], prev[2], x1, y1, z1, ar._X[i].model.half.yLo * 0.5)
      if (sx < 0) continue
      const hx = prev[0] + (x1 - prev[0]) * sx
      const hy = prev[1] + (y1 - prev[1]) * sx
      const hz = prev[2] + (z1 - prev[2]) * sx
      const cal = pr.calibreMm[p]
      ar.fx(FX.hit, hx, Math.max(2, hy), hz, { unit: i, size: cal / 100 })
      const owner = pr.owner[p]
      const byPlayer = !!(pr.flags[p] & FLAG.player)
      if (owner >= 0 && ar.slots[owner].side === ar.slots[i].side) {
        pr.kill(p)
        return
      }
      const res = hitShip(ar, i, shellDamage(cal), { by: owner, weapon: 'shell', lz: hitOut.lz, lx: hitOut.lx, calibreMm: cal })
      if (res) ar._onShipHit(i, res, { by: owner, byPlayer, weapon: 'shell', calibreMm: cal })
      pr.kill(p)
      return
    }
  }
  if (y1 < 0) {
    const f = prev[1] / Math.max(1e-6, prev[1] - y1)
    const sx = prev[0] + (x1 - prev[0]) * f
    const sz = prev[2] + (z1 - prev[2]) * f
    const cal = pr.calibreMm[p]
    if (ar.world.metresAt(sx, sz) > 0) ar.fx(FX.explode, sx, ar.world.heightAt(sx, sz), sz, { size: cal / 200 })
    else ar.fx(FX.splash, sx, 0, sz, { size: cal / 6, data: shellDye(ar, p) })
    ar._onNearMiss(sx, sz, cal, pr.owner[p])
    pr.kill(p)
  }
}

function bulletHits(ar, p) {
  const pr = ar.projectiles
  const o = 3 * p
  const x1 = pr.pos[o]
  const y1 = pr.pos[o + 1]
  const z1 = pr.pos[o + 2]
  const owner = pr.owner[p]
  const side = owner >= 0 ? ar.slots[owner].side : null
  const s = ar.state
  for (const j of ar._air) {
    if (j === owner || s.alive[j] !== 1 || ar.slots[j].side === side) continue
    const dx = s.pos[3 * j] - x1
    const dy = s.pos[3 * j + 1] - y1
    const dz = s.pos[3 * j + 2] - z1
    if (dx * dx + dy * dy + dz * dz > 160000) continue
    const m = ar._X[j].model
    const r = Math.max(m.span, m.length) * 0.42 * A.playerRound.aircraftR
    if (segmentPoint(prev[0], prev[1], prev[2], x1, y1, z1, s.pos[3 * j], s.pos[3 * j + 1], s.pos[3 * j + 2], hitOut) < r * r) {
      const xj = ar._X[j]
      xj.acc = (xj.acc ?? 0) + pr.aux[p]
      ar.fx(FX.hit, x1, y1, z1, { unit: j, size: 0.1 })
      if (xj.acc >= 1) {
        xj.acc -= 1
        hitAircraft(ar, j, 1, owner, 'guns')
      }
      pr.kill(p)
      return
    }
  }
  // rounds into a ship register nothing beyond a flash
  if (y1 < 40) {
    for (const i of shipsNear(ar, x1, z1, 30)) {
      if (shipBoxHit(ar, i, prev[0], prev[1], prev[2], x1, y1, z1, 0) >= 0) {
        ar.fx(FX.hit, x1, Math.max(2, y1), z1, { unit: i, size: 0.1 })
        pr.kill(p)
        return
      }
    }
  }
}

function bombHits(ar, p) {
  const pr = ar.projectiles
  const o = 3 * p
  const x1 = pr.pos[o]
  const y1 = pr.pos[o + 1]
  const z1 = pr.pos[o + 2]
  const owner = pr.owner[p]
  const byPlayer = !!(pr.flags[p] & FLAG.player)
  if (y1 < 60) {
    for (const i of shipsNear(ar, x1, z1, 40)) {
      if (ar.state.alive[i] !== 1) continue
      const sx = shipBoxHit(ar, i, prev[0], prev[1], prev[2], x1, y1, z1, 0)
      if (sx < 0) continue
      const hx = prev[0] + (x1 - prev[0]) * sx
      const hz = prev[2] + (z1 - prev[2]) * sx
      ar.fx(FX.explode, hx, 8, hz, { unit: i, size: 1.5 })
      ar.fx(FX.hit, hx, 8, hz, { unit: i, size: 1 })
      if (owner < 0 || ar.slots[owner].side !== ar.slots[i].side) {
        const res = hitShip(ar, i, WEAPON_DAMAGE.bomb, { by: owner, weapon: 'bomb', lz: hitOut.lz, lx: hitOut.lx })
        if (res) ar._onShipHit(i, res, { by: owner, byPlayer, weapon: 'bomb' })
      }
      pr.kill(p)
      return
    }
  }
  const ground = ar.world.heightAt(x1, z1)
  if (y1 <= ground) {
    if (ar.world.metresAt(x1, z1) > 0) ar.fx(FX.explode, x1, ground, z1, { size: 1.2 })
    else ar.fx(FX.splash, x1, 0, z1, { size: 25 })
    ar._onNearMiss(x1, z1, 300, owner)
    pr.kill(p)
  }
}

function torpedoHits(ar, p) {
  const pr = ar.projectiles
  const o = 3 * p
  const x1 = pr.pos[o]
  const z1 = pr.pos[o + 2]
  const owner = pr.owner[p]
  for (const i of shipsNear(ar, x1, z1, 30)) {
    if (i === owner || ar.state.alive[i] !== 1) continue
    const m = ar._X[i].model
    if (segmentBox(prev[0], -2, prev[2], x1, -2, z1, ar.state.pos[3 * i], ar.state.pos[3 * i + 2], ar.state.heading[i], m.half.x * A.hitBoxK, m.half.z * A.hitBoxK, -m.T - 2, 2, hitOut) < 0) continue
    const friend = owner >= 0 && ar.slots[owner].side === ar.slots[i].side
    // (a friendly hull: the torpedo passes under; an unarmed one runs on)
    if (friend) continue
    if (!(pr.flags[p] & FLAG.armed)) {
      ar.fx(FX.hit, x1, 0, z1, { unit: i, size: 0.2 })
      pr.kill(p)
      ar._torps.delete(p)
      return
    }
    const res = hitShip(ar, i, WEAPON_DAMAGE.torpedo, { by: owner, weapon: 'torpedo', lz: hitOut.lz, lx: hitOut.lx })
    if (res) ar._onShipHit(i, res, { by: owner, byPlayer: !!(pr.flags[p] & FLAG.player), weapon: 'torpedo' })
    pr.kill(p)
    ar._torps.delete(p)
    return
  }
}

// --- AA (the record's hazard × 3, with tracer) ---------------------------------------------------------------------

/** Every ship's AA on the other side's aircraft in reach, the fire shared among them. */
export function aaStep(ar, dt) {
  const s = ar.state
  const rng = ar.rngs.aa
  for (const i of ar._ships) {
    if (s.alive[i] !== 1) continue
    const x = ar._X[i]
    const m = x.model
    if (!m.aa.length) continue
    if (ar.player?.unitIndex === i && ar.player.station === 'aa') continue // the director has the guns
    const reach = x.aaReach ?? (x.aaReach = aaReach(m))
    const side = ar.slots[i].side
    const cx = s.pos[3 * i]
    const cz = s.pos[3 * i + 2]
    const inReach = ar._near
    inReach.length = 0
    for (const j of ar._air) {
      if (s.alive[j] !== 1 || ar.slots[j].side === side) continue
      const dx = s.pos[3 * j] - cx
      const dz = s.pos[3 * j + 2] - cz
      const dy = s.pos[3 * j + 1]
      const r2 = dx * dx + dz * dz + dy * dy
      if (r2 < reach * reach) inReach.push(j)
    }
    if (!inReach.length) continue
    const era = eraFactor(side, ar.year)
    const share = inReach.length
    const dmgK = x.hp / x.hpMax < A.fireAt ? 0.6 : 1
    for (const j of inReach) {
      const r = Math.hypot(s.pos[3 * j] - cx, s.pos[3 * j + 1], s.pos[3 * j + 2] - cz)
      const lam = (shipLambda(m, r) * era * A.aaK * dmgK) / share
      ar._X[j].underAA = ar.t + 1
      if (rng.next() < lam * dt) hitAircraft(ar, j, 1, i, 'aa')
    }
    // the eye: tracer toward one of them, flak about another
    x.aaFxT = (x.aaFxT ?? rng.next() * 0.4) - dt
    if (x.aaFxT <= 0) {
      x.aaFxT = 0.35 + rng.next() * 0.3
      const j = inReach[Math.floor(rng.next() * inReach.length)]
      const h = s.heading[i] * DEG
      const along = (rng.next() - 0.5) * m.L * 0.6
      const ox = cx + Math.sin(h) * along
      const oz = cz - Math.cos(h) * along
      const oy = (m.deck ?? 8) + 3
      const tx = s.pos[3 * j] + s.vel[3 * j] * 0.8 + rng.gauss() * 25
      const ty = s.pos[3 * j + 1] + rng.gauss() * 15
      const tz = s.pos[3 * j + 2] + s.vel[3 * j + 2] * 0.8 + rng.gauss() * 25
      ar.fx(FX.tracer, ox, oy, oz, { unit: i, dx: tx - ox, dy: ty - oy, dz: tz - oz, size: 1, data: 1 })
      if (m.aa.some((a) => a.heavy)) ar.fx(FX.flash, s.pos[3 * j] + rng.gauss() * 60, s.pos[3 * j + 1] + rng.gauss() * 30, s.pos[3 * j + 2] + rng.gauss() * 60, { unit: i, size: 1, data: 1 })
    }
  }
}

/** The direction an input aims (aimAz/aimEl, or aa as a world point) from an eye. */
function aimDirOf(inp, eye) {
  if (Array.isArray(inp.aa) && inp.aa.length === 3) {
    const d = [inp.aa[0] - eye[0], inp.aa[1] - eye[1], inp.aa[2] - eye[2]]
    const L = Math.hypot(d[0], d[1], d[2]) || 1
    return [d[0] / L, d[1] / L, d[2] / L]
  }
  const az = (inp.aimAz ?? 0) * DEG
  const el = clamp(inp.aimEl ?? 0, -10, 89) * DEG
  return [Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el)]
}

const angleMil = (a, b) => Math.acos(clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1)) * 1000

/** The aircraft of the other side nearest an aim's line within maxDeg and maxRange. */
function aimedAircraft(ar, i, eye, dir, maxDeg, maxRange) {
  const s = ar.state
  let best = -1
  let bestA = maxDeg * DEG
  for (const j of ar._air) {
    if (s.alive[j] !== 1 || ar.slots[j].side === ar.slots[i].side) continue
    const px = s.pos[3 * j] - eye[0]
    const py = s.pos[3 * j + 1] - eye[1]
    const pz = s.pos[3 * j + 2] - eye[2]
    const L = Math.hypot(px, py, pz)
    if (L > maxRange || L < 1) continue
    const a = Math.acos(clamp((px * dir[0] + py * dir[1] + pz * dir[2]) / L, -1, 1))
    if (a < bestA) {
      bestA = a
      best = j
    }
  }
  return best
}

/**
 * The player's AA director (round two's station): the ship's whole AA on the
 * aimed aircraft, scaled by the lead error (a cone full at 0 mil, none past 40
 * for the heavy mounts and 80 for the light), three times the record's
 * hazard. Writes pl.director for the HUD's sight.
 */
export function directorStep(ar, pl, i, dt) {
  const s = ar.state
  const inp = pl.input
  const x = ar._X[i]
  const m = x.model
  const eye = directorEye(s, i, m)
  const dir = aimDirOf(inp, eye)
  const reach = x.aaReach ?? (x.aaReach = aaReach(m))
  const j = aimedAircraft(ar, i, eye, dir, 8, reach)
  const firing = !!m.aa.length && (inp.fireHeld || ar.t < (pl.aaPulse ?? -1))
  if (inp.fireCount > (pl._fireSeen ?? 0)) {
    pl._fireSeen = inp.fireCount
    pl.aaPulse = ar.t + 0.5
  }
  const R = j >= 0 ? Math.hypot(s.pos[3 * j] - eye[0], s.pos[3 * j + 1] - eye[1], s.pos[3 * j + 2] - eye[2]) : null
  const d = { dir, eye, aimed: j, firing, cone: 0, reach, lead: null, leadLight: null, range: R, bears: true }
  pl.director = d
  if (j >= 0) {
    const ov = [s.vel[3 * i], 0, s.vel[3 * i + 2]]
    const heavy = m.aa.find((a) => a.heavy)
    const light = m.aa.find((a) => !a.heavy)
    if (heavy) d.lead = leadOn(ar, eye, ov, j, heavy.weapon?.mvMs ?? 790).point
    if (light) d.leadLight = leadOn(ar, eye, ov, j, light.weapon?.mvMs ?? 850).point
  }
  if (!firing) return
  pl.aaFxT = (pl.aaFxT ?? 0) - dt
  if (pl.aaFxT <= 0) {
    pl.aaFxT = 0.12
    const r = ar.rngs.fx
    const h = s.heading[i] * DEG
    const along = (r.next() - 0.5) * m.L * 0.6
    const side = dir[0] * Math.cos(h) + dir[2] * Math.sin(h) >= 0 ? 1 : -1
    const ox = s.pos[3 * i] + Math.sin(h) * along + Math.cos(h) * side * m.B * 0.4 + dir[0] * 40
    const oz = s.pos[3 * i + 2] - Math.cos(h) * along + Math.sin(h) * side * m.B * 0.4 + dir[2] * 40
    const oy = (m.deck ?? 8) + 3 + dir[1] * 40
    const L = Math.min(R ?? 2500, 2500)
    ar.fx(FX.tracer, ox, oy, oz, { unit: i, dx: eye[0] + dir[0] * L - ox, dy: eye[1] + dir[1] * L - oy, dz: eye[2] + dir[2] * L - oz, size: 1, data: 2 })
    if (m.aa.some((a) => a.heavy) && (R ?? 2500) > 600) ar.fx(FX.flash, eye[0] + dir[0] * (R ?? 2500), eye[1] + dir[1] * (R ?? 2500), eye[2] + dir[2] * (R ?? 2500), { unit: i, size: 1, data: 1 })
  }
  if (j < 0) return
  const ov = [s.vel[3 * i], 0, s.vel[3 * i + 2]]
  let lam = 0
  let best = 0
  for (const a of m.aa) {
    if (R > a.rangeM) continue
    const lead = leadOn(ar, eye, ov, j, a.weapon?.mvMs ?? (a.heavy ? 790 : 850))
    const c = Math.max(0, 1 - angleMil(dir, lead.dir) / (a.heavy ? 40 : 80))
    best = Math.max(best, c)
    lam += a.lambda * a.barrels * 0.5 * fRange(R, a.rangeM) * c
  }
  d.cone = best
  if (best <= 0) return
  lam *= eraFactor(ar.slots[i].side, ar.year) * A.aaK
  ar._X[j].underAA = ar.t + 1
  if (ar.rngs.aa.next() < lam * dt) hitAircraft(ar, j, 1, i, 'aa')
}

/**
 * A rear gun (the gunner's station, or the AI's gunner): aimed along
 * input.aimAz/aimEl (the player's) or at the nearest fighter astern (the
 * AI's), bearing within 80° of the tail; hits drawn on the aimed aircraft.
 */
export function rearGun(ar, i, dt, { player = null } = {}) {
  const s = ar.state
  const x = ar._X[i]
  const am = x.ammo
  const g = am?.guns.find((q) => !q.fixed && q.left > 0)
  const b = x.body
  const fwd = [Math.cos(b.gamma) * Math.sin(b.psi), Math.sin(b.gamma), -Math.cos(b.gamma) * Math.cos(b.psi)]
  const eye = [b.x, b.y + 1, b.z]
  let dir
  let j
  if (player) {
    dir = aimDirOf(player.input, eye)
    j = aimedAircraft(ar, i, eye, dir, 10, 700)
  } else {
    j = -1
    let bestR = A.burst.rearRangeM
    for (const k of ar._air) {
      if (s.alive[k] !== 1 || ar.slots[k].side === ar.slots[i].side) continue
      const px = s.pos[3 * k] - eye[0]
      const py = s.pos[3 * k + 1] - eye[1]
      const pz = s.pos[3 * k + 2] - eye[2]
      const L = Math.hypot(px, py, pz)
      if (L < bestR && (px * fwd[0] + py * fwd[1] + pz * fwd[2]) / L < -0.17) {
        bestR = L
        j = k
      }
    }
    dir = j >= 0 ? [(s.pos[3 * j] - eye[0]) / bestR, (s.pos[3 * j + 1] - eye[1]) / bestR, (s.pos[3 * j + 2] - eye[2]) / bestR] : [-fwd[0], -fwd[1], -fwd[2]]
  }
  const along = dir[0] * fwd[0] + dir[1] * fwd[1] + dir[2] * fwd[2]
  const bearsAft = along < Math.cos(100 * DEG) && dir[1] > -0.35
  const firing = !!g && bearsAft && (player ? player.input.fireHeld || ar.t < (player.gunPulse ?? -1) : j >= 0)
  if (player && player.input.fireCount > (player._fireSeen ?? 0)) {
    player._fireSeen = player.input.fireCount
    player.gunPulse = ar.t + 0.4
  }
  const R = j >= 0 ? Math.hypot(s.pos[3 * j] - eye[0], s.pos[3 * j + 1] - eye[1], s.pos[3 * j + 2] - eye[2]) : null
  if (player) {
    const lead = j >= 0 ? leadOn(ar, eye, [b.vx, b.vy, b.vz], j, g?.weapon?.mvMs ?? 850) : null
    player.gun = { dir, eye, bears: bearsAft, aimed: j, firing, cone: lead ? Math.max(0, 1 - angleMil(dir, lead.dir) / 80) : 0, rounds: g ? g.left : 0, lead: lead?.point ?? null, range: R }
  }
  if (!firing) return
  x.rearT = (x.rearT ?? 0) - dt
  if (x.rearT > 0) return
  x.rearT = player ? 0.1 : A.burst.rearEveryS
  g.left = Math.max(0, g.left - Math.round(((g.weapon.rofRpm ?? 800) / 60) * (player ? 0.1 : 0.6) * g.count))
  const L = Math.min(R ?? 600, 600)
  ar.fx(FX.tracer, eye[0], eye[1], eye[2], { unit: i, dx: dir[0] * L, dy: dir[1] * L, dz: dir[2] * L, size: 1, data: player ? 2 : 1 })
  if (j < 0 || R > 700) return
  let p
  if (player) {
    const lead = leadOn(ar, eye, [b.vx, b.vy, b.vz], j, g.weapon?.mvMs ?? 850)
    const c = Math.max(0, 1 - angleMil(dir, lead.dir) / 80)
    p = 0.35 * c * (1 - R / 700) * (0.1 / 1)
  } else p = A.burst.rearP * (1 - R / A.burst.rearRangeM)
  if (ar.rngs.ai.next() < p) hitAircraft(ar, j, 1, i, 'gunner')
}

export { bombK, zoneWord }
