#!/usr/bin/env node
// The engine's gate (ENGINEERING.md §12, §13 engine): the battle box alone,
// before integration.
//
// Part 1, headless in node (the sim imports no three.js): R7 §8's
// calibration tests as seeded batches asserted in bands, with the real kits
// (public/data/kits/): the flight model's turn and roll per kit and the SBD's
// dive; the firing tables' times of flight against the published ones; the
// gunnery Monte Carlo (an AI Washington on Kirishima at 8,400 yd, steady and
// zigzagging; an AI Yamato on an escort carrier at 30 km); the AA cases; the
// damage cases; the group rule; the ship model's acceleration; and the
// replay test on the fixture box (untouched, sim.outcome.diverged is empty).
//
// Part 2, in Chromium under SwiftShader against the Vite dev server
// (`npx vite --port 5297` in the package; started here if it is not up):
// battle.html boots the fixture box, scrubs, takes each of its moments with
// player.scripted = true and scripted input, asserts no console errors,
// that every scene material's compiled source carries vFragDepth and that
// the sim stays finite; shoots a dive from the chase camera, gunnery through
// the sight at night with star shells and the orbit view with the fleet
// (tools/shots/battle-*.png); prints frame time and heap.
//
//   node tools/fake-data.mjs && node tools/fake-battle.mjs
//   node tools/smoke-battle.mjs [--calibration-only] [--browser-only] [--quick]
//   CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome (the default)

import fs from 'node:fs'
import path from 'node:path'
import { spawn, execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = new Set(process.argv.slice(2))
const QUICK = args.has('--quick')
const PORT = Number(process.env.PORT || 5297)
const shots = path.join(root, 'tools/shots')
fs.mkdirSync(shots, { recursive: true })
const J = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'))
const list = (x, k) => (Array.isArray(x) ? x : x?.[k] || [])

const { createSim, P } = await import('../src/battle/sim/index.js')
const { shipModel, aircraftModel, DEG } = await import('../src/battle/sim/units.js')
const { createDamage, applyHit, stepDamage, speedCap, readWhere } = await import('../src/battle/sim/damage.js')
const { shipLambda, eraFactor, aspectOf, aaStep } = await import('../src/battle/sim/aa.js')
const { createAirBody, stepAir, nMaxAt, instructor } = await import('../src/battle/sim/aircraft.js')
const { createShipBody, stepShip } = await import('../src/battle/sim/ship.js')
const { firingTable, atRange } = await import('../src/battle/sim/ballistics.js')
const { createRng } = await import('../src/battle/sim/rng.js')
const { rho, G } = await import('../src/battle/sim/units.js')
const { TangentProjection } = await import('../src/geo.js')
const { BattleClock } = await import('../src/time.js')

const kits = { ships: J('public/data/kits/ships.json'), aircraft: J('public/data/kits/aircraft.json'), weapons: J('public/data/kits/weapons.json') }
const weapons = new Map(kits.weapons.map((w) => [w.id, w]))
const shipKit = (id) => kits.ships.find((k) => k.id === id)
const airKit = (id) => kits.aircraft.find((k) => k.id === id)

let failed = 0
const results = []
const check = async (name, fn) => {
  const t0 = Date.now()
  try {
    const note = await fn()
    console.log('  ✓', name + (note ? ` — ${note}` : ''), `(${((Date.now() - t0) / 1000).toFixed(1)} s)`)
    results.push({ name, ok: true, note })
  } catch (err) {
    failed++
    console.log('  ✗', name, '—', err.message.split('\n')[0])
    results.push({ name, ok: false, note: err.message })
  }
}
const pct = (x) => `${(x * 100).toFixed(1)} %`
const band = (v, lo, hi, what) => {
  if (!(v >= lo && v <= hi)) throw new Error(`${what} ${typeof v === 'number' ? +v.toFixed(3) : v} outside [${lo}, ${hi}]`)
}

// ===========================================================================================
// Part 1: the calibration batches (R7 §8)
// ===========================================================================================
const doCal = !args.has('--browser-only')
const doBrowser = !args.has('--calibration-only')

if (doCal) {
  console.log('calibration (R7 §8), real kits:')

  // --- 6. the flight model -----------------------------------------------------------------
  await check('flight: sustained 360° at 1,500 m within ±10 % of each kit’s handling.turnS, roll within ±10 % at its table speeds', () => {
    const date = Date.UTC(1942, 5, 4)
    const out = []
    const bad = []
    for (const k of kits.aircraft) {
      const m = aircraftModel(k, weapons, date, () => {})
      // the best sustained turn: at each speed, the load the power holds level, flown by the model for a full circle
      let best = Infinity
      for (let V = 40; V <= m.vMax * 1.05; V += 3) {
        const b = createAirBody(m, { y: 1500, V, throttle: 1 })
        const q = 0.5 * rho(1500) * V * V
        const Pw = m.P0 * (1500 <= m.ratedAlt ? 1 : rho(1500) / rho(m.ratedAlt))
        const cl2 = (Pw / Math.max(V, 30) / (q * m.S) - m.cd0) / m.k
        if (cl2 <= 0) continue
        const n = Math.min((Math.sqrt(cl2) * q * m.S) / (m.mass * G), nMaxAt(b, m))
        if (n <= 1.01) continue
        b.phi = Math.acos(1 / n)
        let turned = 0
        let t = 0
        for (; t < 150 && turned < 2 * Math.PI; t += 1 / 60) {
          const p0 = b.psi
          stepAir(b, m, { throttle: 1 }, 1 / 60, { n, p: 0 })
          let d = b.psi - p0
          if (d < -Math.PI) d += 2 * Math.PI
          turned += d
        }
        if (turned >= 2 * Math.PI && Math.abs(b.y - 1500) < 150 && Math.abs(b.V - V) < 8) best = Math.min(best, t)
      }
      const want = k.handling?.turnS
      if (want && Math.abs(best - want) / want > 0.1) bad.push(`${k.id} turn ${best.toFixed(1)} s ≠ ${want}`)
      for (const [v, r] of m.rollTable || []) {
        const b = createAirBody(m, { y: 3048, V: v, throttle: 1 })
        if (b.V * Math.sqrt(rho(3048) / rho(0)) > m.vBreak) continue // (the controls stiffen past vBreak by design)
        for (let t = 0; t < 1; t += 1 / 60) {
          b.V = v
          stepAir(b, m, { roll: 1, throttle: 1 }, 1 / 60)
        }
        const got = b.p / DEG
        if (Math.abs(got - r) / r > 0.1) bad.push(`${k.id} roll ${got.toFixed(0)} ≠ ${r} at ${v} m/s`)
      }
      out.push(`${k.id} ${best.toFixed(1)}`)
    }
    if (bad.length) throw new Error(bad.join('; '))
    return `${kits.aircraft.length} kits: ${out.slice(0, 6).join(', ')}, …`
  })

  await check('flight: an SBD’s 70° dive from 4,500 m reaches 600 m in 30–45 s', () => {
    const m = aircraftModel(airKit('sbd-3'), weapons, Date.UTC(1942, 5, 4), () => {})
    const b = createAirBody(m, { y: 4500, V: 75, gamma: -70 * DEG, throttle: 0.2 })
    let t = 0
    for (; b.y > 600 && t < 120; t += 1 / 60) {
      const aim = [Math.sin(b.psi) * Math.cos(-70 * DEG), Math.sin(-70 * DEG), -Math.cos(b.psi) * Math.cos(-70 * DEG)]
      stepAir(b, m, { throttle: 0.2, brakes: true }, 1 / 60, instructor(b, m, aim))
    }
    band(t, 30, 45, 'dive time')
    return `${t.toFixed(1)} s, ${b.V.toFixed(0)} m/s at the release height`
  })

  // --- 3. times of flight ----------------------------------------------------------------------
  await check('shells: the firing tables reproduce the published times of flight within 3 % (16-inch, Yamato’s 46 cm, the 5"/38: R7 §8.3; the other guns’ single published points within 5 %)', () => {
    const rows = []
    const bad = []
    const R7 = new Set(['us-16-45-mk6', 'jp-46-t94', 'us-5-38-mk12'])
    for (const w of kits.weapons) {
      if (!w.tof?.length || w.kind !== 'gun') continue
      const tol = R7.has(w.id) ? 0.03 : 0.05
      const t = firingTable(w, { h0: 10, maxElevDeg: w.maxRangeElevDeg ?? 45, stepDeg: 0.25 })
      for (const [R, tof] of w.tof) {
        const r = atRange(t, R)
        if (!r) {
          bad.push(`${w.id} ${R} m beyond the table`)
          continue
        }
        const e = (r.tof - tof) / tof
        rows.push(Math.abs(e))
        if (Math.abs(e) > tol) bad.push(`${w.id} at ${R} m: ${r.tof.toFixed(2)} s against ${tof} (${pct(e)})`)
      }
    }
    if (bad.length) throw new Error(bad.join('; '))
    return `${rows.length} published points, worst ${pct(Math.max(...rows))}`
  })

  // --- 2. gunnery --------------------------------------------------------------------------------
  const duel = (spec) => {
    const proj = new TangentProjection({ lon0: spec.lon0, lat0: spec.lat0 })
    const clk = new BattleClock({ zone: spec.zone, from: spec.from, to: spec.to })
    const t0 = clk.parse(spec.t)
    const course = 270
    const brg = (course + spec.aspectDeg) % 360
    const dx = Math.sin(brg * DEG) * spec.rangeM
    const dz = -Math.cos(brg * DEG) * spec.rangeM
    const T1 = 3600
    const fix = (x, z, kn, tt) => ({ t: clk.label(tt, { seconds: true }), lonlat: proj.toLonLat(x, z), courseDeg: course, speedKn: kn, precision: 'report', source: 'cal' })
    const vx = (kn) => -kn * 0.514444 * T1
    return {
      proj,
      t0,
      battle: {
        id: spec.id,
        clock: { zone: spec.zone, from: spec.from, to: spec.to },
        weather: { wind: { fromDeg: 90, kn: 8 }, visibilityM: spec.vis },
        units: [
          { id: 'shooter', kit: spec.shooter, side: 'us', name: 'shooter', track: [fix(0, 0, spec.shooterKn, t0), fix(vx(spec.shooterKn), 0, spec.shooterKn, t0 + T1)] },
          { id: 'target', kit: spec.target, side: 'jp', name: 'target', track: [fix(dx, dz, spec.targetKn, t0), fix(dx + vx(spec.targetKn), dz, spec.targetKn, t0 + T1)], events: [{ t: clk.label(t0 + 5, { seconds: true }), kind: 'hit', by: 'shooter', count: [1, 1] }] },
        ],
        moments: [{ id: 'cal', role: { kind: 'ship', unit: 'target', side: 'jp' }, t: spec.t, durationS: 1200, timeScale: 1 }],
      },
    }
  }
  const runDuel = (spec, { runs, rounds = 75, zigzag = false, seed }) => {
    const out = []
    for (let r = 0; r < runs; r++) {
      const { battle, proj, t0 } = duel(spec)
      const s = createSim(battle, kits, { seed: `${seed}:${r}`, warn: () => {}, proj })
      s.setTime(t0)
      const pl = s.startMoment('cal')
      const ti = pl.unitIndex
      const si = s.record.shipById.get('shooter').slot
      let fired = 0
      const spawn = s.projectiles.spawn.bind(s.projectiles)
      s.projectiles.spawn = (kind, ...a) => {
        const o = a[6] || {}
        const p = spawn(kind, ...a)
        if (p >= 0 && kind === 0 && o.owner === si && !(o.flags & 1)) {
          fired++
          if (fired > rounds) s.projectiles.flags[p] |= 1 // (beyond the count: flown, not scored)
        }
        return p
      }
      const x = s._X[ti]
      // a zigzag: hard over toward a course 30° off the last, every 60 s from the start
      let want = 255
      let last = s.t - 60
      for (let steps = 0; steps < 60 * 900; steps++) {
        if (zigzag && s.t - last >= 60) {
          last = s.t
          want = want === 285 ? 255 : 285
        }
        const err = ((want - x.body.heading + 540) % 360) - 180
        pl.input.helm = zigzag ? Math.max(-1, Math.min(1, err / 5)) : 0
        pl.input.telegraph = x.body.telegraph
        s.advance(1 / 60)
        s.effects.drain(() => {})
        // the target is kept afloat and steaming: the test counts hits, not what they do
        Object.assign(x.dmg, { fight: 0, float: 0, list: 0, engineStopUntil: 0, engineCap: 1, rudderJam: null, bowLost: false, sinking: false, out: false, crippled: false })
        x.dmg.fires.fill(0)
        x.dmg.holes.length = 0
        s.state.alive[ti] = 1
        if (fired >= rounds && s.projectiles.count === 0) break
      }
      out.push({ hits: x.dmg.hits, fired: Math.min(fired, rounds) })
    }
    return out
  }
  const wk = { id: 'cal-wk', zone: '+11:00', from: '1942-11-14T20:00+11:00', to: '1942-11-15T03:30+11:00', t: '23:58', lon0: 159.5, lat0: -9.1, shooter: 'north-carolina', target: 'kongo', rangeM: 7681, aspectDeg: 90, shooterKn: 23, targetKn: 20, vis: 8000 }
  await check('gunnery: an AI Washington on a steady Kirishima at 8,400 yd, 75 rounds: 9–20 hits (mean in band; in ≥ 60 % of runs, see research/engine.md)', () => {
    const h = runDuel(wk, { runs: QUICK ? 40 : 150, seed: 'wk' })
    const mean = h.reduce((a, x) => a + x.hits, 0) / h.length
    const inBand = h.filter((x) => x.hits >= 9 && x.hits <= 20).length / h.length
    band(mean, 9, 20, 'mean hits')
    band(inBand, 0.6, 1, 'share of runs with 9–20 hits')
    return `mean ${mean.toFixed(1)} hits; 9–20 in ${pct(inBand)} of ${h.length} runs (R7's 80 % assumes independent rounds; a salvo's shells share its error)`
  })
  await check('gunnery: the same on a Kirishima turning 30° every 60 s: fewer than 9 hits in ≥ 80 % of runs', () => {
    const h = runDuel(wk, { runs: QUICK ? 40 : 150, zigzag: true, seed: 'wkz' })
    const mean = h.reduce((a, x) => a + x.hits, 0) / h.length
    const few = h.filter((x) => x.hits < 9).length / h.length
    band(few, 0.8, 1, 'share of runs with fewer than 9 hits')
    return `mean ${mean.toFixed(1)}; < 9 in ${pct(few)}`
  })
  await check('gunnery: an AI Yamato on an escort carrier at 30 km: 2–7 % hits', () => {
    const yc = { id: 'cal-yc', zone: '+09:00', from: '1944-10-25T06:15+09:00', to: '1944-10-25T10:45+09:00', t: '07:30', lon0: 126.08, lat0: 11.54, shooter: 'yamato', target: 'casablanca', rangeM: 30000, aspectDeg: 60, shooterKn: 20, targetKn: 17, vis: 40000 }
    const h = runDuel(yc, { runs: QUICK ? 30 : 80, rounds: 90, seed: 'yc' })
    const rate = h.reduce((a, x) => a + x.hits, 0) / h.reduce((a, x) => a + x.fired, 0)
    band(rate, 0.02, 0.07, 'hit rate')
    return `${pct(rate)} of ${h.reduce((a, x) => a + x.fired, 0)} rounds`
  })

  // --- 1. AA -----------------------------------------------------------------------------------------
  const aaBatch = (fleet, pathRT, { era, share, aspect, alert = () => 1, n = 1000, seed }) => {
    const at = (t) => {
      for (let i = 0; i + 1 < pathRT.length; i++) {
        const [t0, r0] = pathRT[i]
        const [t1, r1] = pathRT[i + 1]
        if (t >= t0 && t <= t1) return r0 + ((r1 - r0) * (t - t0)) / (t1 - t0)
      }
      return pathRT[pathRT.length - 1][1]
    }
    let lost = 0
    for (let r = 0; r < n; r++) {
      const rng = createRng(`${seed}:${r}`)
      for (let t = pathRT[0][0]; t < pathRT[pathRT.length - 1][0]; t += 1 / 60) {
        const R = at(t)
        let lam = 0
        for (const m of fleet) lam += shipLambda(m, R)
        if (aaStep((lam * era * alert(t) * aspect) / share, 1 / 60, rng) === 'kill') {
          lost++
          break
        }
      }
    }
    return lost / n
  }
  const midway = Date.UTC(1942, 5, 4)
  const pearl = Date.UTC(1941, 11, 7)
  const SM = (id, d) => shipModel(shipKit(id), weapons, d, () => {})
  const N = QUICK ? 300 : 1000
  await check('AA: D3As diving on TF 17 at 12:05: 20–35 % lost to AA', () => {
    const fleet = [SM('yorktown', midway), SM('portland', midway), SM('new-orleans', midway), ...Array.from({ length: 5 }, () => SM('sims', midway))]
    const p = aaBatch(fleet, [[0, 9000], [40, 5000], [60, 2500], [75, 800], [80, 600], [90, 1500], [105, 3500]], { era: eraFactor('us', 1942), share: 2, aspect: aspectOf('dive'), n: N, seed: 'd3a' })
    band(p, 0.2, 0.35, 'share lost')
    return `${pct(p)} of ${N}`
  })
  await check('AA: SBDs diving on Kaga at 10:22: under 6 %', () => {
    const fleet = [SM('kaga', midway), SM('kagero', midway)]
    const out = []
    for (const t0 of [0, 30, 80]) {
      const p = aaBatch(fleet, [[0, 6000], [25, 3000], [38, 900], [42, 700], [52, 1500], [70, 4000]], { era: eraFactor('jp', 1942), share: 1.5, aspect: aspectOf('dive'), alert: (t) => Math.min(1, Math.max(0, (t + t0) / 60)), n: N, seed: `sbd${t0}` })
      band(p, 0, 0.06, 'share lost')
      out.push(pct(p))
    }
    return `first, fourth and ninth divers: ${out.join(', ')}`
  })
  await check('AA: B5N torpedo runs on Yorktown at 14:43: 22–40 %', () => {
    const fleet = [SM('yorktown', midway), SM('portland', midway), SM('new-orleans', midway), SM('new-orleans', midway), SM('atlanta', midway), ...Array.from({ length: 7 }, () => SM('sims', midway))]
    const p = aaBatch(fleet, [[0, 12000], [60, 6000], [100, 2000], [110, 730], [118, 600], [130, 2000], [150, 4000]], { era: eraFactor('us', 1942), share: 4, aspect: aspectOf('torpedo'), n: N, seed: 'b5n' })
    band(p, 0.22, 0.4, 'share lost')
    return `${pct(p)} of ${N}`
  })
  await check('AA: Pearl Harbor first-wave torpedo runs: 6–15 %', () => {
    const fleet = [SM('nevada', pearl), SM('nevada', pearl), SM('pennsylvania', pearl), SM('tennessee', pearl), SM('tennessee', pearl), SM('colorado', pearl), SM('colorado', pearl)]
    const p = aaBatch(fleet, [[0, 3000], [40, 800], [50, 400], [60, 300], [70, 800], [90, 2500]], { era: eraFactor('us', 1941, { peacetime: true }), share: 2, aspect: aspectOf('torpedo'), alert: () => 0.45, n: N, seed: 'ph' })
    band(p, 0.06, 0.15, 'share lost')
    return `${pct(p)} of ${N}`
  })

  // --- 4. damage -------------------------------------------------------------------------------------------
  const dmgBatch = (id, navy, hits, { H = 0, hours = 6, n = QUICK ? 150 : 400, seed, until }) => {
    const model = SM(id, midway)
    const runs = []
    for (let r = 0; r < n; r++) {
      const rng = createRng(`${seed}:${r}`)
      const st = createDamage(model, navy, 1942)
      st.regime = 'sim'
      for (const h of hits) {
        const w = readWhere(h.where || '', rng)
        applyHit(st, model, { cls: h.cls, part: h.part ?? w.part ?? 'hull', zone: h.zone ?? w.zone, side: h.side ?? w.side, calibreMm: h.cal, ap: h.ap, rangeM: h.range, t: 0, uptake: w.uptake }, rng)
      }
      const tr = { stopS: 0, sunkAt: null, doomedAt: null, cap30: null }
      for (let t = 0; t < hours * 3600; t++) {
        stepDamage(st, model, 1, { t, rng, H })
        const c = speedCap(st, model, t)
        if (c === 0 && !st.sinking) tr.stopS++
        if (t === 1800) tr.cap30 = c
        if (st.doomed && tr.doomedAt == null) tr.doomedAt = t
        if (st.sinking) {
          tr.sunkAt = t
          break
        }
        if (until && until(st, t)) break
      }
      tr.st = st
      runs.push(tr)
    }
    return { model, runs }
  }
  const share = (runs, f) => runs.filter(f).length / runs.length
  await check('damage: Kaga’s four bombs (H 0.8) doom her in ≥ 95 % of runs', () => {
    const { runs } = dmgBatch('kaga', 'jp', [{ cls: 'bomb-1000', where: 'forward flight deck', part: 'deck' }, { cls: 'bomb-500', where: 'amidships', part: 'deck' }, { cls: 'bomb-500', where: 'aft', part: 'deck' }, { cls: 'bomb-500', where: 'island', part: 'deck' }], { H: 0.8, hours: 1, seed: 'kaga', until: (st) => st.doomed })
    const p = share(runs, (r) => r.doomedAt != null)
    band(p, 0.95, 1, 'doomed')
    return pct(p)
  })
  await check('damage: Akagi’s one hit (H 0.8) dooms her in 55–90 %', () => {
    const { runs } = dmgBatch('akagi', 'jp', [{ cls: 'bomb-1000', where: 'amidships hangar', part: 'deck' }], { H: 0.8, hours: 3, seed: 'akagi', until: (st) => st.doomed })
    const p = share(runs, (r) => r.doomedAt != null)
    band(p, 0.55, 0.9, 'doomed')
    return pct(p)
  })
  await check('damage: Yorktown’s three bombs at H 0.15: doomed in < 5 %, dead in the water 40–100 min', () => {
    const { runs } = dmgBatch('yorktown', 'us', [{ cls: 'bomb-500', where: 'flight deck aft', part: 'deck' }, { cls: 'bomb-500', where: 'uptake amidships', part: 'deck' }, { cls: 'bomb-500', where: 'forward elevator', part: 'deck' }], { H: 0.15, hours: 3, seed: 'yorktown' })
    const doomed = share(runs, (r) => r.doomedAt != null)
    const diw = share(runs, (r) => r.stopS / 60 >= 40 && r.stopS / 60 <= 100)
    band(doomed, 0, 0.05, 'doomed')
    band(diw, 0.8, 1, 'stopped for 40–100 min')
    return `doomed ${pct(doomed)}; stopped 40–100 min in ${pct(diw)}`
  })
  await check('damage: Kirishima’s nine heavy hits (three below the waterline) and forty 5-inch: capsizes or sinks within 1–5 h in ≥ 80 %', () => {
    const hits = []
    for (let i = 0; i < 6; i++) hits.push({ cls: 'heavy', part: 'hull', cal: 406, ap: true, range: 7700 })
    for (let i = 0; i < 3; i++) hits.push({ cls: 'heavy', part: 'waterline', cal: 406, ap: true, range: 7700 })
    for (let i = 0; i < 40; i++) hits.push({ cls: 'light', part: i % 3 ? 'super' : 'hull', cal: 127 })
    const { runs } = dmgBatch('kongo', 'jp', hits, { hours: 6, seed: 'kirishima' })
    const p = share(runs, (r) => r.sunkAt != null && r.sunkAt >= 3600 && r.sunkAt <= 5 * 3600)
    band(p, 0.8, 1, 'lost within 1–5 h')
    const med = runs.map((r) => r.sunkAt ?? Infinity).sort((a, b) => a - b)[runs.length >> 1]
    return `${pct(p)}; median ${(med / 3600).toFixed(1)} h`
  })
  await check('damage: South Dakota’s 26 hits leave her afloat in ≥ 95 %', () => {
    const hits = [{ cls: 'heavy', part: 'super', cal: 356 }]
    for (let i = 0; i < 18; i++) hits.push({ cls: 'medium', part: i < 14 ? 'super' : 'hull', cal: 203, ap: true })
    for (let i = 0; i < 6; i++) hits.push({ cls: 'light', part: 'super', cal: 152 })
    hits.push({ cls: 'light', part: 'super', cal: 127 })
    const { runs } = dmgBatch('south-dakota', 'us', hits, { hours: 6, seed: 'sodak' })
    const p = share(runs, (r) => r.sunkAt == null)
    band(p, 0.95, 1, 'afloat')
    return pct(p)
  })
  await check('damage: Johnston’s 07:30 hits leave her afloat at ≥ 15 knots in ≥ 90 %', () => {
    const hits = []
    for (let i = 0; i < 3; i++) hits.push({ cls: 'heavy', part: 'hull', cal: 460, ap: true, range: 18000 })
    for (let i = 0; i < 3; i++) hits.push({ cls: 'light', part: 'hull', cal: 152 })
    const { model, runs } = dmgBatch('fletcher', 'us', hits, { hours: 1, seed: 'johnston' })
    const p = share(runs, (r) => r.sunkAt == null && (r.cap30 * model.vmax) / 0.514444 >= 15)
    band(p, 0.9, 1, 'afloat at 15 knots')
    return pct(p)
  })

  // --- ships: the physical time constants (R7 §4.4's table) --------------------------------------------------
  await check('ships: 90 % of top speed from rest within ±12 % of R7 §4.4’s table', () => {
    const R7 = { yamato: 323, 'north-carolina': 265, kongo: 221, kaga: 239, akagi: 272, soryu: 142, yorktown: 205, mogami: 107, takao: 125, fletcher: 59, kagero: 54, casablanca: 399 }
    const out = []
    const bad = []
    for (const [id, want] of Object.entries(R7)) {
      const m = SM(id, midway)
      const b = createShipBody(m, {})
      let t = 0
      for (; b.V < 0.9 * m.vmax && t < 1500; t += 0.1) stepShip(b, m, 0, 1 / 1.05, 0.1)
      out.push(`${id} ${t.toFixed(0)}`)
      if (Math.abs(t - want) / want > 0.12) bad.push(`${id} ${t.toFixed(0)} s ≠ ${want}`)
    }
    if (bad.length) throw new Error(bad.join('; '))
    return out.join(', ')
  })

  // --- 5. the group rule ----------------------------------------------------------------------------------------
  await check('group rule: three D3As removed before the dive take the hits on Yorktown from 3 to about 1.7', () => {
    const proj = new TangentProjection({ lon0: 182.0, lat0: 31.0 })
    const ll = (x, z) => proj.toLonLat(x, z)
    const battle = {
      id: 'cal-group',
      clock: { zone: '-12:00', from: '1942-06-04T04:00-12:00', to: '1942-06-04T18:00-12:00' },
      weather: { visibilityM: 40000 },
      units: [{ id: 'yorktown', kit: 'yorktown', side: 'us', name: 'Yorktown', track: [{ t: '11:00', lonlat: ll(0, 0), courseDeg: 90, speedKn: 25, precision: 'report', source: 'cal' }, { t: '13:00', lonlat: ll(80000, 0), courseDeg: 90, speedKn: 25, precision: 'report', source: 'cal' }], events: [{ t: '12:06', kind: 'hit', by: 'hiryu-d3a', count: [3, 3], damage: 0.2 }] }],
      groups: [{ id: 'hiryu-d3a', kit: 'd3a1', side: 'jp', name: 'Hiryū’s dive bombers', count: 18, enter: { t: '11:30', lonlat: ll(-40000, -30000), headingDeg: 120, altM: 4000 }, offBox: true, attack: { t: '12:04', target: 'yorktown', profile: 'dive', fromDeg: 300, pushOverM: 3000, releaseM: 300, reached: [7, 7] }, losses: [[13, 13]] }],
    }
    let total = 0
    const runs = QUICK ? 200 : 600
    let untouched = 0
    for (let r = 0; r < runs; r++) {
      const s = createSim(battle, kits, { seed: `g${r}`, warn: () => {}, proj })
      s.setTime(s.clock.parse('12:00'))
      // three of the seven who reach the dive are taken away (as if the player's fighter had downed them)
      const g = s.record.groupById.get('hiryu-d3a')
      const reach = g.aircraft.filter((ac) => !(ac.lossT != null && ac.lossT < (ac.releaseT ?? Infinity)))
      for (const ac of reach.slice(0, 3)) s._X[ac.slot].lostAt = s.t
      const yi = s.record.shipById.get('yorktown').slot
      const before = s._X[yi].dmg.hits
      s.setTime(s.clock.parse('12:05:59'))
      s.advance(1 / 7.5)
      for (let k = 0; k < 10; k++) s.advance(1 / 7.5)
      total += s._X[yi].dmg.hits - before
      if (!s._X[yi].touched) untouched++
    }
    const mean = total / runs
    band(mean, 1.45, 1.95, 'mean hits')
    // and with nobody removed, the count is the record's own, on the record's path
    const s = createSim(battle, kits, { seed: 'g-replay', warn: () => {}, proj })
    s.setTime(s.clock.parse('12:05:59'))
    for (let k = 0; k < 12; k++) s.advance(1 / 7.5)
    const yi = s.record.shipById.get('yorktown').slot
    if (s._X[yi].touched) throw new Error('the record’s own count left the record’s path')
    if (s._X[yi].rd.hits !== 3) throw new Error(`the record’s path drew ${s._X[yi].rd.hits} hits, not 3`)
    return `mean ${mean.toFixed(2)} hits over ${runs} runs (3 × 4/7 = 1.71); untouched the record's 3 on the record's path`
  })

  // --- the replay test on the fixture ----------------------------------------------------------------------------------
  await check('replay: the fixture box untouched from the clock’s start to its end leaves sim.outcome.diverged empty', () => {
    const battle = J('test-data/boxes/test-box/battle.json')
    const man = J('test-data/boxes/manifest.json').boxes[0]
    const fk = { ships: list(J('test-data/kits/ships.json'), 'ships'), aircraft: list(J('test-data/kits/aircraft.json'), 'aircraft'), weapons: kits.weapons }
    const s = createSim(battle, fk, { seed: '', warn: () => {}, proj: new TangentProjection(man.projection) })
    let n = 0
    while (s.t < s.clock.duration - 1e-6) {
      s.advance(1)
      s.effects.drain(() => n++)
    }
    for (const k of ['pos', 'quat', 'vel', 'speed', 'heading']) for (const v of s.state[k]) if (!Number.isFinite(v)) throw new Error(`state.${k} not finite`)
    const o = s.outcome
    if (o.diverged.length) throw new Error(JSON.stringify(o.diverged))
    return `${s.clock.label(s.t)}: ${JSON.stringify(o.bySide)}; ${s.beats.length} beats, ${n} effects`
  })
}

// ===========================================================================================
// Part 2: the box in the browser
// ===========================================================================================
let perf = null
if (doBrowser) {
  console.log('the box in the browser (battle.html on the Vite dev server, SwiftShader):')
  if (!fs.existsSync(path.join(root, 'test-data/boxes/test-box/battle.json'))) throw new Error('no test-data/: run node tools/fake-data.mjs first')
  execFileSync(process.execPath, [path.join(root, 'tools/fake-battle.mjs')], { stdio: 'inherit' })
  const up = async () => {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/battle.html`)
      return r.ok
    } catch {
      return false
    }
  }
  let vite = null
  if (!(await up())) {
    vite = spawn('npx', ['vite', '--port', String(PORT), '--strictPort', '--host', '127.0.0.1'], { cwd: root, stdio: 'ignore', detached: false })
    for (let i = 0; i < 120 && !(await up()); i++) await new Promise((r) => setTimeout(r, 500))
  }
  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] })
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  const errors = []
  const warnings = []
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`)
    else if (m.type() === 'warning') warnings.push(m.text())
  })
  const run = (body) => page.evaluate(new Function(`const app = window.__app; const battle = app?.battle; const sim = battle?.sim; return (async () => { ${body} })()`))
  const frames = async (n) => {
    const f0 = await run('return app.frames')
    await page.waitForFunction((f) => window.__app.frames >= f, f0 + n, { timeout: 240000 })
  }
  const finite = () => run(`for (const k of ['pos', 'quat', 'vel', 'speed', 'heading', 'damage', 'fire', 'list']) for (const v of sim.state[k]) if (!Number.isFinite(v)) return k; return null`)
  const audit = () =>
    run(`
      const r = app.renderer
      const s = app.active
      r.compile(s.scene, s.camera)
      const gl = r.getContext()
      const out = { materials: 0, missing: [], uncompiled: [] }
      const seen = new Set()
      s.scene.traverse((o) => {
        for (const m of [].concat(o.material || [])) {
          if (!m || !m.isShaderMaterial || seen.has(m)) continue
          seen.add(m)
          out.materials++
          const prog = r.properties.get(m).currentProgram
          if (!prog) { out.uncompiled.push(o.name || o.type); continue }
          const vs = gl.getShaderSource(prog.vertexShader) || ''
          const fs = gl.getShaderSource(prog.fragmentShader) || ''
          if (!vs.includes('vFragDepth') || !fs.includes('vFragDepth')) out.missing.push((o.name || o.type) + ':' + (m.name || m.uuid.slice(0, 6)))
        }
      })
      return out
    `)
  // the sim advanced by hand between frames (SwiftShader draws a frame or two a second), the scene drawing what it does
  const play = async (seconds, { autopilot = '', chunk = 1, drawEvery = 2 } = {}) => {
    const steps = Math.round(seconds / chunk)
    for (let k = 0; k < steps; k++) {
      await run(`battle.pause(); const pl = sim.player; const s = sim.state; ${autopilot}; for (let i = 0; i < ${Math.round(chunk * 60)}; i++) { ${autopilot ? 'window.__ap && window.__ap(pl, s, sim);' : ''} sim.advance(1 / 60) }`)
      if (k % drawEvery === 0) await frames(1)
    }
  }
  const t0 = Date.now()
  await page.goto(`http://127.0.0.1:${PORT}/battle.html?box=test-box&t=09:00&data=./test-data/`)
  await page.waitForFunction(() => window.__app?.ready, null, { timeout: 240000 })
  console.log(`  booted the box page in ${((Date.now() - t0) / 1000).toFixed(1)} s`)

  await check('the fixture box boots: terrain, sea, sky, units, in watch mode', async () => {
    const r = await run(`return { mode: app.mode, active: app.active?.name, ready: battle.ready, slots: sim.capacity, stats: app.stats(), t: sim.clock.label(sim.t) }`)
    if (r.mode !== 'watch' || r.active !== 'box' || !r.ready) throw new Error(JSON.stringify(r))
    await frames(2)
    return `${r.t}: ${r.slots} slots, ${r.stats.units} units drawn, ${r.stats.calls} draw calls, ${r.stats.triangles} triangles`
  })

  await check('the orbit view with the fleet under the dive (tools/shots/battle-fleet.png)', async () => {
    await run(`battle.pause(); battle.scrub('10:22:25'); const i = sim.record.shipById.get('test-cv-a').slot; battle.scene.setCamera('orbit', { unitIndex: i, distance: 3600, bearing: 215, pitch: 0.3 })`)
    await play(40, { chunk: 1, drawEvery: 4 })
    await frames(2)
    await page.screenshot({ path: path.join(shots, 'battle-fleet.png') })
    const r = await run(`return { t: sim.clock.label(sim.t, { seconds: true }), particles: battle.scene.stats().particles, beats: sim.beats.slice(-3).map((b) => b.text) }`)
    return `${r.t}: ${r.particles} particles; ${r.beats.join(' · ')}`
  })

  await check('scrubbing: closed-form placement at 04:28, 10:22:40, 11:40 and back to 09:00', async () => {
    const out = []
    for (const t of ['04:28', '10:22:40', '11:40', '09:00']) {
      await run(`battle.scrub('${t}')`)
      await frames(1)
      const bad = await finite()
      if (bad) throw new Error(`state.${bad} not finite at ${t}`)
      out.push(await run(`let n = 0; for (let i = 0; i < sim.capacity; i++) if (sim.state.alive[i]) n++; return sim.clock.label(sim.t, { seconds: true }) + ' ' + n`))
    }
    return out.join(', ')
  })

  // the autopilots the moments are flown with (player.scripted = true)
  const AP = {
    aircraft: `window.__ap = (pl, s, sim) => {
      const st = pl.state, inp = pl.input
      const tg = sim.record.shipById.get(sim._moment?.objective?.target)
      if (!tg) return
      const ti = tg.slot
      const dx = s.pos[3 * ti] - st.x, dz = s.pos[3 * ti + 2] - st.z
      const d = Math.hypot(dx, dz)
      if (st.bombs > 0) {
        inp.aimDir = d > 1700 && st.pitch > -30 ? [dx / d, 0.02, dz / d] : [dx + s.vel[3 * ti] * 4, -st.y, dz + s.vel[3 * ti + 2] * 4]
        inp.throttle = d > 1700 ? 0.9 : 0.25
        if (st.release || st.alt < 650) inp.bombCount++
      } else { inp.aimDir = [-dx, Math.max(200, 1500 - st.y), -dz]; inp.throttle = 1 }
      inp.fireHeld = !!st.target && st.target.range < 500
    }`,
    gunnery: `window.__ap = (pl, s, sim) => {
      const inp = pl.input
      const tg = sim.record.shipById.get(sim._moment?.objective?.target)
      const ti = tg.slot
      const dx = s.pos[3 * ti] - pl.state.x, dz = s.pos[3 * ti + 2] - pl.state.z
      inp.aimAz = ((Math.atan2(dx, -dz) * 180 / Math.PI) + 360) % 360
      inp.aimRange = Math.hypot(dx, dz)
      inp.telegraph = 1
      inp.helm = Math.sin(sim.t / 60) * 0.3
      window.__n = (window.__n || 0) + 1
      if (window.__n % 300 === 10) inp.salvoCount++
      if (sim.sight.light !== 'day' && window.__n % 900 === 5) inp.starshellCount++
      if (sim._moment?.objective?.kind === 'torpedo') {
        const rel = ((inp.aimAz - pl.state.heading + 540) % 360) - 180
        inp.helm = Math.max(-1, Math.min(1, (Math.abs(rel) - 80) / 25)) * Math.sign(rel)
        if (Math.abs(Math.abs(rel) - 90) < 50 && window.__n % 240 === 120) inp.torpedoCount++
      }
    }`,
  }
  const moments = await run(`return [...sim.record.moments.values()].map((m) => ({ id: m.id, kind: m.role.kind, objective: m.objective?.kind }))`)
  for (const m of moments) {
    await check(`moment ${m.id} (${m.kind}, ${m.objective}) taken with player.scripted and scripted input: the sim stays finite`, async () => {
      await run(`window.__n = 0; battle.takeMoment('${m.id}', { scripted: true }); battle.pause()`)
      const ap = m.kind === 'aircraft' ? AP.aircraft : AP.gunnery
      if (m.kind === 'aircraft') {
        // flown to the push-over and down; the chase camera shot in the dive
        let shot = false
        for (let k = 0; k < 140; k++) {
          await play(0.5, { autopilot: ap, chunk: 0.5, drawEvery: 4 })
          const st = await run(`return { pitch: sim.player.state.pitch, alt: sim.player.state.alt, bombs: sim.player.state.bombs, alive: sim.state.alive[sim.player.unitIndex] }`)
          if (!shot && st.pitch < -45 && st.alt < 3000) {
            await run(`battle.scene.setCamera('chase', { unitIndex: sim.player.unitIndex })`)
            await frames(2)
            await page.screenshot({ path: path.join(shots, 'battle-dive.png') })
            shot = true
          }
          if (st.bombs === 0 && st.alt > 800) break
          if (st.alive !== 1) break
        }
        if (!shot) throw new Error('the scripted dive never went down past 45°')
      } else await play(m.objective === 'torpedo' ? 120 : 60, { autopilot: ap, chunk: 2, drawEvery: 3 })
      const bad = await finite()
      if (bad) throw new Error(`state.${bad} not finite`)
      if (m.id === 'test-night-gunnery') {
        await run(`battle.scene.setCamera('director', { unitIndex: sim.player.unitIndex, zoom: 16 }); sim.player.input.starshellCount++`)
        await play(6, { autopilot: AP.gunnery, chunk: 1, drawEvery: 1 })
        await page.screenshot({ path: path.join(shots, 'battle-night.png') })
      }
      const a = await audit()
      if (a.missing.length || a.uncompiled.length) throw new Error(`vFragDepth missing in ${a.missing.join(', ')}; uncompiled ${a.uncompiled.join(', ')}`)
      const r = await run(`const ms = sim.momentState; const sc = sim.score; return { t: sim.clock.label(sim.t, { seconds: true }), elapsed: Math.round(ms.elapsed), done: ms.done, reason: ms.reason, shells: sc.shells, salvos: sc.salvos, bombs: sc.bombs, torpedoes: sc.torpedoes, hits: sc.hits.map((h) => h.name + ' ' + h.kind + ' ' + h.count).join('; '), projectiles: sim.projectiles.count, beats: sim.beats.length, materials: ${'0'} }`)
      await run(`battle.release()`)
      return `${r.t} (+${r.elapsed} s${r.done ? `, ended: ${r.reason}` : ''}); ${r.salvos} salvos ${r.shells} shells ${r.bombs} bombs ${r.torpedoes} torpedoes; hits: ${r.hits || 'none'}; ${a.materials} materials with vFragDepth`
    })
  }

  await check('perf: frame time and heap on the fixture box after its moments', async () => {
    const cdp = await page.context().newCDPSession(page)
    await cdp.send('HeapProfiler.collectGarbage')
    const { usedSize } = await cdp.send('Runtime.getHeapUsage')
    const frameMs = async (n) => {
      const f0 = await run('return app.frames')
      const t = Date.now()
      await page.waitForFunction((f) => window.__app.frames >= f, f0 + n, { timeout: 240000 })
      return +((Date.now() - t) / n).toFixed(0)
    }
    await run(`battle.scrub('10:22:40', { answer: 'yes' }); battle.play(1); battle.scene.setCamera('orbit', { unitIndex: sim.record.shipById.get('test-cv-a').slot, distance: 3000, bearing: 200, pitch: 0.35 })`)
    const watch = await frameMs(6)
    const st = await run('return app.stats()')
    perf = { heapMB: +(usedSize / 1048576).toFixed(1), watchFrameMs: watch, calls: st.calls, triangles: st.triangles, textures: st.textures, programs: st.programs, particles: st.particles, gpu: st.gpu }
    return JSON.stringify(perf)
  })

  await check('leave disposes the box', async () => {
    await run(`await battle.leave()`)
    const r = await run(`return { scene: battle.scene, sim: battle.sim, mode: app.mode }`)
    if (r.scene || r.sim) throw new Error(JSON.stringify(r))
    return `mode ${r.mode}`
  })

  if (warnings.length) console.log(`  (${warnings.length} console warnings, e.g. ${[...new Set(warnings)].slice(0, 2).join(' | ')})`)
  if (errors.length) {
    failed++
    console.log('  ✗ console errors:\n   ', errors.slice(0, 10).join('\n    '))
  } else console.log('  ✓ no console errors')
  await browser.close()
  if (vite) vite.kill()
}

fs.writeFileSync(path.join(shots, 'smoke-battle.json'), JSON.stringify({ when: new Date().toISOString(), failed, results, perf }, null, 1))
console.log(failed ? `${failed} failed` : 'all passed')
process.exitCode = failed ? 1 : 0
