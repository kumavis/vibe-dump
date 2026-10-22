// Units and the kits as the sim reads them (ENGINEERING.md §5: data has knots
// and km/h, the sim m/s, converted once here). A kit model holds everything
// the models need, derived once at createSim: a ship's physical time constant
// from its displacement and power, its Nomoto gain from its tactical
// diameter, each battery's mounts with their arcs and firing table, its AA
// fit at the battle's date with each weapon's kill rate; an aircraft's polar,
// power, limits and roll table. Kits in the Stage 0 fixture schema (inline
// gun numbers, no aero block) are read too, their missing numbers derived
// and warned about.

import { firingTable, fitFormFactor } from './ballistics.js'
import { deckTop, halfBeam, flightDeckTop, shipHeight, mid } from '../kits/blocks.js'
import { P } from './params.js'

export const KN = 0.514444
export const KMH = 1 / 3.6
export const DEG = Math.PI / 180
export const G = 9.80665
export const rho = (h) => {
  const T = 288.15 - 0.0065 * Math.min(11000, Math.max(-500, h))
  return (101325 * Math.pow(T / 288.15, 5.2559)) / (287.05 * T)
}
export const RHO0 = rho(0)
/** Whether a relative bearing (deg, clockwise from the bow) lies in an arc [from, to] taken clockwise. */
export const arcCovers = (arc, b) => {
  const w = (((arc[1] - arc[0]) % 360) + 360) % 360
  const d = (((b - arc[0]) % 360) + 360) % 360
  return d <= w
}
const toMs = (d) => (d == null ? null : typeof d === 'number' ? d : Date.parse(String(d).length <= 7 ? `${d}-01T00:00Z` : String(d).length <= 10 ? `${d}T00:00Z` : d))
const inPeriod = (ms, from, to) => ms >= toMs(from) && ms < toMs(to)

const TABLES = new Map() // weapon id + height → firing table (the page's life)
const FITTED = new Map()

/** A gun's firing table at a mount height (cached for the page). */
export function tableFor(w, h0 = 10, maxElevDeg = 45) {
  const key = `${w.id}:${Math.round(h0)}:${Math.round(maxElevDeg)}`
  let t = TABLES.get(key)
  if (!t) {
    t = firingTable(w, { h0, maxElevDeg: Math.min(maxElevDeg, w.maxRangeElevDeg ?? 45), stepDeg: 0.5, dt: 1 / 30 })
    TABLES.set(key, t)
  }
  return t
}

/** A gun weapon from weapons.json, or one made from a fixture kit's inline numbers. */
function gunWeapon(g, weapons, warn, kitId) {
  if (g.weapon && weapons.has(g.weapon)) return weapons.get(g.weapon)
  if (g.weapon) warn?.(`kit ${kitId}: weapon ${g.weapon} is not in weapons.json; using the kit's own numbers`)
  const cal = g.calibreMm ?? 127
  const key = `inline:${cal}:${g.shellKg}:${g.mvMs}:${g.rangeM}`
  let w = FITTED.get(key)
  if (!w) {
    w = { id: key, kind: 'gun', calibreMm: cal, shellKg: g.shellKg ?? Math.max(1, (cal / 10) ** 3 / 40), mvMs: g.mvMs ?? 800, maxRangeM: g.rangeM ?? cal * 120, maxRangeElevDeg: 45, rofRpm: g.rofRpm ?? 4, dispersion: { rangePct: 1.3, mils: 2.5 }, shell: cal >= 200 ? 'ap' : 'he' }
    w.formFactor = fitFormFactor(w, { dt: 0.05 })
    FITTED.set(key, w)
  }
  return w
}

const AA_INLINE = { '127mm': ['jp-127-t89', 'us-5-38-mk12'], '25mm': ['jp-25-t96'], '28mm': ['us-28-1-1in'], '20mm': ['us-20-oerlikon'], '40mm': ['us-40-bofors'], '50cal': ['us-50cal-m2'] }
/** An AA weapon, its kill rate and range at the date (the VT fuze from 1943). */
function aaWeapon(a, weapons, side, ms) {
  let w = a.weapon && weapons.get(a.weapon)
  if (!w && a.kind) {
    const ids = AA_INLINE[a.kind] || []
    w = ids.map((id) => weapons.get(id)).find(Boolean)
    if (!w) {
      const cal = parseFloat(a.kind)
      const lam = cal >= 100 ? 2.4e-4 : cal >= 35 ? 6e-4 : cal >= 20 ? 3.5e-4 : 2.5e-4
      w = { id: `inline-aa:${a.kind}`, kind: 'aa', calibreMm: cal, aa: { lambdaBarrel: lam, rangeM: cal >= 100 ? 6500 : cal >= 35 ? 3000 : 1800, roundsPerS: 1 } }
    }
  }
  if (!w?.aa) return null
  const vt = w.aa.vt && ms != null && ms >= toMs(w.aa.vt.from)
  return { weapon: w, lambda: vt ? w.aa.vt.lambdaBarrel : w.aa.lambdaBarrel, rangeM: w.aa.rangeM, heavy: w.calibreMm >= 75, cls: w.calibreMm >= 75 ? 'heavy' : w.calibreMm >= 30 ? 'medium' : 'light' }
}

/** A ship kit as the sim reads it. date: ms UTC of the battle. */
export function shipModel(kit, weapons, date, warn) {
  const vmax = (kit.speedKn || 25) * KN
  const fullT = kit.displacementFullT ?? kit.displacement?.full ?? kit.displacement?.standard ?? 2000
  const mass = P.ship.addedMass * fullT * 1000
  let shp = kit.shp
  if (!shp) {
    // (a fixture kit: the power that gives a typical time constant for its type)
    const tauGuess = { bb: 180, cv: 150, cve: 270, ca: 80, cl: 70, dd: 38, de: 50 }[kit.type] ?? 120
    shp = (mass * vmax * vmax) / tauGuess / (P.ship.effPower * 745.7)
    warn?.(`kit ${kit.id}: no shp; ${Math.round(shp)} assumed from a time constant of ${tauGuess} s`)
  }
  const peff = P.ship.effPower * shp * 745.7
  const td = kit.turn?.tacticalDiameterM ?? (kit.type === 'bb' ? 3.15 : kit.type === 'dd' || kit.type === 'de' ? 4 : 3.5) * kit.loa
  const rudderS = kit.turn?.rudderS ?? (['bb', 'cv', 'cvl', 'cve'].includes(kit.type) ? 30 : ['ca', 'cl'].includes(kit.type) ? 20 : 15)
  const fdt = flightDeckTop(kit)
  const top = shipHeight(kit)
  // batteries: every mount's position, arc and resting bearing
  const batteries = []
  for (const [bi, g] of (kit.guns || []).entries()) {
    const w = gunWeapon(g, weapons, warn, kit.id)
    const sides = g.side === 'both' ? ['port', 'starboard'] : [g.side || 'centre']
    const total = g.mounts ?? g.turrets ?? g.at.length
    const mounts = []
    for (const f of g.at) {
      for (const sd of sides) {
        if (mounts.length >= total) break
        const hb = halfBeam(kit, f)
        const x = sd === 'starboard' ? hb * 0.7 : sd === 'port' ? -hb * 0.7 : 0
        let y = deckTop(kit, f) + 2.5
        if (fdt != null && sd !== 'centre') y = Math.max(y, fdt - 2)
        // a battery's arcDeg is a forward (or starboard) mount's: an aft centre
        // mount's is turned 180°, a port mount's mirrored
        let arc = g.arcDeg ? [...g.arcDeg] : sd === 'centre' ? [210, 150] : [20, 160]
        if (sd === 'centre' && f >= 0.5 && arcCovers(arc, 0) && !arcCovers(arc, 180)) arc = [(arc[0] + 180) % 360, (arc[1] + 180) % 360]
        if (sd === 'port') arc = [(360 - arc[1]) % 360, (360 - arc[0]) % 360]
        mounts.push({ f, side: sd, x, y, z: (f - 0.5) * kit.loa, arc, rest: f < 0.5 ? 0 : 180 })
      }
    }
    const h0 = mounts.length ? mounts.reduce((s, m) => s + m.y, 0) / mounts.length : 10
    const maxE = Math.min(g.elevationDeg?.[1] ?? 45, w.maxRangeElevDeg ?? 45)
    batteries.push({
      index: bi,
      role: g.role,
      weapon: w,
      barrels: g.barrels ?? 1,
      turrets: g.turrets ?? 0,
      mounts,
      traverseDegS: g.traverseDegS ?? (w.calibreMm >= 300 ? 3 : w.calibreMm >= 150 ? 5 : 15),
      elevationDeg: g.elevationDeg ?? [-5, 45],
      reloadS: 60 / (w.rofRpm || g.rofRpm || 2),
      h0,
      maxElevDeg: maxE,
      get table() {
        return tableFor(w, h0, maxE)
      },
    })
  }
  // AA at the date
  let aaList = kit.aa || []
  for (const f of kit.aaFits || []) if (date != null && inPeriod(date, f.from, f.to)) aaList = f.aa
  const aa = []
  for (const a of aaList) {
    const m = aaWeapon(a, weapons, kit.side, date)
    if (!m) continue
    const barrels = (a.mounts ?? 1) * (a.barrels ?? 1)
    aa.push({ ...m, barrels })
  }
  // dual-purpose batteries (the 5"/38 of a destroyer) fire at aircraft too
  for (const b of batteries) {
    if (!b.weapon.aa || aa.some((x) => x.weapon.id === b.weapon.id)) continue
    const m = aaWeapon({ weapon: b.weapon.id }, weapons, kit.side, date)
    if (m) aa.push({ ...m, barrels: b.mounts.length * b.barrels, dualPurpose: true })
  }
  const torp = kit.torpedoes ? { ...kit.torpedoes, weapon: weapons.get(kit.torpedoes.weapon) || torpedoInline(kit.torpedoes) } : null
  const sensors = (kit.sensors || []).filter((s) => date == null || date >= toMs(s.from)).map((s) => s.kind)
  return {
    kind: 'ship',
    id: kit.id,
    kit,
    type: kit.type,
    side: kit.side,
    L: kit.loa,
    B: kit.beam,
    T: kit.draught,
    top,
    deck: deckTop(kit, 0.5),
    fdTop: fdt,
    vmax,
    mass,
    shp,
    peff,
    tmax: peff / vmax,
    tau: (mass * vmax * vmax) / peff,
    td,
    radius: P.ship.radiusK * td,
    rudderS,
    batteries,
    aa,
    torp,
    belt: kit.armour?.beltMm ?? 0,
    deckMm: kit.armour?.deckMm ?? 0,
    crippledAt: kit.crippledAt ?? 0.5,
    fatal: kit.fatal ?? 1,
    systems: kit.systems || ['rudder', 'engines', 'bow'],
    sensors,
    carrier: ['cv', 'cvl', 'cve'].includes(kit.type),
    unarmoured: (kit.armour?.beltMm ?? 0) < 25,
    dyes: kit.dyes || {},
    hospital: !!kit.hospital,
    tokko: !!kit.tokko,
    // the collider: an oriented box, waterline to superstructure, a little inside the hull's ends
    half: { x: kit.beam / 2, z: (kit.loa / 2) * 0.97, yLo: -kit.draught, yHi: (fdt ?? deckTop(kit, 0.5)) + 1 },
    sup: superstructureBox(kit, fdt ?? deckTop(kit, 0.5), top),
  }
}

const SUPER = new Set(['bridge', 'pagoda', 'tower', 'funnel', 'island', 'deckhouse', 'hangar', 'cage-mast', 'tripod-mast', 'director', 'boat-deck'])
/** The superstructure as a second box over the hull (model frame: z toward the stern): { x, z0, z1, yLo, yHi, xc }. */
function superstructureBox(kit, deck, top) {
  let z0 = Infinity
  let z1 = -Infinity
  let island = 0
  for (const b of kit.blocks || []) {
    if (!SUPER.has(b.kind)) continue
    const [a, c] = Array.isArray(b.at) ? [Math.min(...b.at), Math.max(...b.at)] : [b.at, b.at]
    const half = (b.l ?? b.w ?? 8) / 2
    z0 = Math.min(z0, (a - 0.5) * kit.loa - half)
    z1 = Math.max(z1, (c - 0.5) * kit.loa + half)
    if (b.kind === 'island') island = b.side === 'port' ? -1 : 1
  }
  if (!Number.isFinite(z0)) {
    z0 = -0.15 * kit.loa
    z1 = 0.1 * kit.loa
  }
  const x = island ? kit.beam * 0.12 : kit.beam * 0.3
  return { x, z0, z1, xc: island * kit.beam * 0.38, yLo: deck, yHi: deck + Math.max(4, (top - deck) * 0.75) }
}

function torpedoInline(t) {
  const us = /mark|mk/i.test(t.type || '')
  return us
    ? { id: 'inline-mk15', kind: 'torpedo', calibreMm: 533, warheadKg: 224, settings: [{ speedKn: 45, rangeM: 5500 }, { speedKn: 33.5, rangeM: 9150 }, { speedKn: 26.5, rangeM: 13700 }], armRunM: 400, failRate: [] }
    : { id: 'inline-t93', kind: 'torpedo', calibreMm: 610, warheadKg: 490, settings: [{ speedKn: 49, rangeM: 20000 }, { speedKn: 41, rangeM: 32000 }], armRunM: 300, failRate: [] }
}

/** The polar from top speed (R7 §4.2's method) for a kit with no aero block. */
function derivePolar(kit) {
  const S = kit.wingM2 || (kit.span * kit.span) / 6
  const m = kit.weightKg?.loaded ?? 3000
  const W = m * G
  const AR = (kit.span * kit.span) / S
  const k = 1 / (Math.PI * 0.75 * AR)
  const hp = (kit.engine?.hp ?? 1000) * (kit.engine?.count ?? (kit.type === 'bomber' || kit.type === 'patrol' ? 2 : 1))
  const Pw = hp * 745.7 * P.air.eta
  const V = (kit.speedKmh?.max ?? 450) * KMH
  const alt = kit.speedKmh?.atAltM ?? 4000
  const q = 0.5 * rho(alt) * V * V
  const CL = W / (q * S)
  const cd0 = Math.max(0.012, Pw / V / (q * S) - k * CL * CL)
  return { S, m, k, cd0 }
}

/** An aircraft kit as the sim reads it. */
export function aircraftModel(kit, weapons, date, warn) {
  const a = kit.aero || {}
  let S = kit.wingM2
  let mass = a.massKg ?? kit.weightKg?.loaded
  let cd0 = a.cd0
  let k = a.k
  if (cd0 == null || k == null || S == null) {
    const d = derivePolar(kit)
    S = S ?? d.S
    mass = mass ?? d.m
    cd0 = cd0 ?? d.cd0
    k = k ?? d.k
    if (!kit.aero) warn?.(`kit ${kit.id}: no aero block; the polar derived from its top speed`)
  }
  const typeG = { fighter: 7, dive: 6.5, torpedo: 4.5, level: 3.5, patrol: 3, bomber: 3 }[kit.type] ?? 5
  const diveLimit = (kit.speedKmh?.diveLimit ?? 600) * KMH
  let rollTable = a.rollTable
  if (!rollTable) {
    const r = kit.handling?.rollDegS ?? { fighter: 70, dive: 50, torpedo: 40 }[kit.type] ?? 25
    rollTable = [
      [50, r * 0.7],
      [100, r],
      [160, r * 0.8],
    ]
  }
  const engines = kit.engine?.count ?? (kit.type === 'bomber' || kit.type === 'patrol' ? 2 : 1)
  const P0 = (kit.engine?.hp ?? 1000) * engines * 745.7 * (a.eta ?? P.air.eta)
  // torpedo by date
  let torpedoId = kit.torpedo?.weapon ?? null
  for (const t of kit.torpedoes || []) if (date != null && inPeriod(date, t.from, t.to)) torpedoId = t.weapon
  const torpedo = torpedoId ? weapons.get(torpedoId) || null : kit.torpedo ? { id: 'inline-air-torpedo', kind: 'torpedo', air: true, warheadKg: 200, speedKn: kit.torpedo.type === 'mark-13' ? 30 : 42, rangeM: 2000, dropSpeedKn: kit.torpedo.dropSpeedKn ?? 110, dropAltM: kit.torpedo.dropAltM ?? 30, armRunM: kit.torpedo.armRunM ?? 200, failRate: [] } : null
  const guns = (kit.guns || []).map((g) => {
    const w = (g.weapon && weapons.get(g.weapon)) || { id: `inline-mg:${g.calibreMm}`, kind: g.calibreMm >= 20 ? 'cannon' : 'mg', calibreMm: g.calibreMm ?? 12.7, mvMs: g.calibreMm >= 20 ? 650 : 850, rofRpm: g.calibreMm >= 20 ? 500 : 800, vsAircraft: g.calibreMm >= 20 ? { protected: 0.25, unprotected: 0.4 } : g.calibreMm >= 12 ? { protected: 0.06, unprotected: 0.12 } : { protected: 0.015, unprotected: 0.03 } }
    return { weapon: w, count: g.count ?? 1, position: g.position ?? 'nose', rounds: g.rounds ?? 300, fixed: ['nose', 'wing', 'cowl'].includes(g.position ?? 'nose') }
  })
  const payload = (kit.payload || []).map((p) => ({ weapon: (p.weapon && weapons.get(p.weapon)) || { id: `inline-bomb:${p.massKg}`, kind: 'bomb', massKg: p.massKg ?? 250, class: (p.massKg ?? 250) >= 400 ? 'bomb-1000' : (p.massKg ?? 250) >= 200 ? 'bomb-500' : 'bomb-100' }, count: p.count ?? 1 }))
  return {
    kind: 'aircraft',
    id: kit.id,
    kit,
    type: kit.type,
    side: kit.side,
    span: kit.span,
    length: kit.length,
    S,
    mass,
    massEmpty: kit.weightKg?.empty ?? mass * 0.7,
    cd0,
    k,
    clMax: a.clMax ?? 1.45,
    gLimit: a.gLimit ?? typeG,
    vShake: a.vShakeMs ?? diveLimit * 0.9,
    vBreak: a.vBreakMs ?? diveLimit,
    diveDrag: a.diveDrag ?? (kit.type === 'dive' ? 0.12 : 0),
    rollTable,
    turnLimit: a.turnLimitDegS ? a.turnLimitDegS * DEG : null,
    P0,
    ratedAlt: kit.engine?.ratedAltM ?? kit.speedKmh?.atAltM ?? 4000,
    ceiling: kit.ceilingM ?? 9000,
    vCruise: (kit.speedKmh?.cruise ?? 300) * KMH,
    vMax: (kit.speedKmh?.max ?? 450) * KMH,
    enduranceS: kit.enduranceS ?? 1800,
    protection: kit.protection ?? (kit.side === 'jp' ? 'none' : 'self-sealing'),
    fatal: kit.fatal ?? 1,
    guns,
    payload,
    torpedo,
    tokko: !!kit.tokko,
    half: { x: kit.span / 2, y: Math.max(1, (kit.height ?? 3) / 2), z: kit.length / 2 },
  }
}

/** The fraction along a hull of a point in its model frame, for zones. */
export const zoneOf = (model, zLocal) => Math.max(0, Math.min(3, Math.floor(((zLocal / model.L) + 0.5) * 4)))
export { mid }
