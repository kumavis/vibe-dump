// The kits check (DATA.md §8, §10; ENGINEERING.md §13 engine): kits/ships.json,
// kits/aircraft.json and kits/weapons.json. Every field DATA.md §8 names is
// present; every weapon id a kit names resolves in weapons.json, and every
// weapon carries what its kind needs (ballistics for a gun, a kill rate for
// an AA weapon, settings and a dated failure rate for a torpedo, a mass for a
// bomb); every block kind and shape, hull bow and stern, wing, tail, canopy,
// gear, cowl and engine kind is in the frozen vocabulary (tools/check/ids.json)
// and the generator knows it (src/battle/kits/blocks.js); every colour is in
// the palette (src/battle/kits/palette.js); every source a kit or weapon
// cites is in sources.json (sources-engine.json merged into it at the
// integration; a fragment that comes back is still checked); every insignia is flown
// inside its dates; and the units are plausible (metres, knots, tonnes,
// km/h).
//
// On the Stage 0 fixtures (test-data, test: true), whose kits predate
// weapons.json and the aero block, the schema checks are warnings and the
// vocabulary, dates and units are checked as for the real kits.

import { checkIds, VOCAB, instant } from './common.mjs'
import { BLOCK_KINDS, SHAPES, BOWS, STERNS, assertVocab, span } from '../../src/battle/kits/blocks.js'
import { PALETTE_NAMES, SCHEME_NAMES, DECKS, AIRCRAFT_COLOURS, DECK_MARKINGS } from '../../src/battle/kits/palette.js'

// US national insignia periods (R6 Table A7, from Wikipedia citing Bell, Doll and Archer); the IJN ones are R6's E
const INSIGNIA_DATES = {
  'star-red-centre': ['1919-08-19', '1942-05-15'],
  'star-no-red': ['1942-05-15', '1943-06-28'],
  'star-bar-red-outline': ['1943-06-28', '1943-08-14'],
  'star-bar-blue': ['1943-08-14', '1947-01-14'],
  hinomaru: ['1920-01-01', '1946-01-01'],
  'hinomaru-white-surround': ['1942-06-01', '1945-09-03'],
  'roundel-raaf': ['1939-09-01', '1956-01-01'],
  'roundel-rnzaf': ['1939-09-01', '1970-01-01'],
}

const SHIP_FIELDS = ['id', 'class', 'type', 'side', 'ships', 'loa', 'beam', 'draught', 'displacement', 'speedKn', 'turn', 'hull', 'blocks', 'blocksPrecision', 'guns', 'aa', 'torpedoes', 'shp', 'shpPrecision', 'armour', 'displacementFullT', 'crippledAt', 'fatal', 'systems', 'colour', 'silhouette', 'sources']
const AIRCRAFT_FIELDS = ['id', 'name', 'ja', 'type', 'side', 'crew', 'span', 'length', 'height', 'weightKg', 'wingM2', 'engine', 'speedKmh', 'climbMs', 'ceilingM', 'rangeKm', 'enduranceS', 'fatal', 'aero', 'handling', 'guns', 'payload', 'torpedo', 'shape', 'colours', 'sources']
const AERO_FIELDS = ['cd0', 'clMax', 'k', 'gLimit', 'vShakeMs', 'vBreakMs', 'diveDrag', 'rollTable']
const SYSTEMS = ['rudder', 'engines', 'turrets', 'directors', 'radar', 'flight-deck', 'aa-fwd', 'aa-aft', 'bow', 'searchlights', 'torpedoes']
const SENSORS = ['sc', 'sg', 'fc', 'type22']
const num = (v) => typeof v === 'number' && Number.isFinite(v)

export default function check(ctx) {
  const weaponsFile = ctx.load('kits/weapons.json')
  const shipsFile = ctx.load('kits/ships.json')
  const aircraftFile = ctx.load('kits/aircraft.json')
  if (shipsFile === undefined && aircraftFile === undefined) return ctx.warn('kits', 'no kits here yet')
  const soft = ctx.test
  const need = soft ? ctx.warn : ctx.bad

  // --- the generator's vocabulary is the frozen one ---------------------------------
  const same = (a, b) => a.length === b.length && a.every((x) => b.includes(x))
  if (!same(BLOCK_KINDS, VOCAB.blockKinds)) ctx.bad('src/battle/kits/blocks.js', `BLOCK_KINDS differs from ids.json blockKinds`)
  if (!same(SHAPES.funnel, VOCAB.funnelShapes) || !same(SHAPES.turret, VOCAB.turretShapes) || !same(SHAPES.pagoda, VOCAB.pagodaShapes)) ctx.bad('src/battle/kits/blocks.js', 'SHAPES differ from ids.json')
  if (!same(BOWS, VOCAB.hullBows) || !same(STERNS, VOCAB.hullSterns)) ctx.bad('src/battle/kits/blocks.js', 'bows or sterns differ from ids.json')

  // --- sources ---------------------------------------------------------------------
  const srcIds = new Set()
  for (const f of ['sources.json', 'sources-engine.json', 'sources-battles.json']) {
    const v = ctx.load(f)
    const list = Array.isArray(v) ? v : Array.isArray(v?.sources) ? v.sources : []
    for (const s of list) if (s?.id) srcIds.add(s.id)
  }
  const engineSources = ctx.load('sources-engine.json')
  if (engineSources !== undefined) {
    if (!Array.isArray(engineSources)) ctx.bad('sources-engine.json', 'must be an array (sources.json\'s schema)')
    else {
      checkIds(ctx, engineSources, 'sources-engine.json')
      for (const s of engineSources) {
        for (const k of ['title', 'url', 'access', 'opened', 'read', 'language', 'licence']) if (s[k] === undefined) ctx.bad(`sources-engine.json ${s.id}`, `has no ${k}`)
        if (s.access && !VOCAB.sourceAccess.includes(s.access)) ctx.bad(`sources-engine.json ${s.id}`, `access “${s.access}”`)
        if (s.read && !VOCAB.sourceRead.includes(s.read)) ctx.bad(`sources-engine.json ${s.id}`, `read “${s.read}”`)
        if (s.licence && !VOCAB.sourceLicence.includes(s.licence)) ctx.bad(`sources-engine.json ${s.id}`, `licence “${s.licence}”`)
        if (s.language && !VOCAB.sourceLanguage.includes(s.language)) ctx.bad(`sources-engine.json ${s.id}`, `language “${s.language}”`)
      }
      ctx.count('engine sources', engineSources.length)
    }
  }
  const cites = (at, list) => {
    if (!Array.isArray(list) || !list.length) return need(at, 'cites no source')
    for (const s of list) {
      const id = typeof s === 'string' ? s : s?.id
      if (!id) ctx.bad(at, 'a source with no id')
      else if (srcIds.size && !srcIds.has(id)) need(at, `source “${id}” is not in sources.json`)
    }
  }

  // --- weapons ---------------------------------------------------------------------
  const weapons = new Map()
  if (weaponsFile !== undefined && weaponsFile !== null) {
    if (!Array.isArray(weaponsFile)) ctx.bad('kits/weapons.json', 'must be an array')
    else {
      for (const [id, w] of checkIds(ctx, weaponsFile, 'kits/weapons.json')) weapons.set(id, w)
      for (const w of weaponsFile) {
        const at = `kits/weapons.json ${w.id}`
        if (!['gun', 'aa', 'mg', 'cannon', 'torpedo', 'bomb'].includes(w.kind)) ctx.bad(at, `kind “${w.kind}”`)
        if (w.kind === 'gun') {
          for (const k of ['calibreMm', 'shellKg', 'mvMs', 'maxRangeM', 'rofRpm', 'formFactor']) if (!num(w[k])) ctx.bad(at, `${k} is not a number`)
          if (num(w.calibreMm) && (w.calibreMm < 20 || w.calibreMm > 470)) ctx.bad(at, `calibre ${w.calibreMm} mm`)
          if (num(w.mvMs) && (w.mvMs < 300 || w.mvMs > 1100)) ctx.bad(at, `muzzle velocity ${w.mvMs} m/s`)
          if (num(w.formFactor) && (w.formFactor < 0.6 || w.formFactor > 2.5)) ctx.bad(at, `form factor ${w.formFactor}`)
          if (!w.dispersion || !num(w.dispersion.rangePct) || !num(w.dispersion.mils)) ctx.bad(at, 'dispersion { rangePct, mils } missing')
          for (const [r, t] of w.tof || []) if (!(num(r) && num(t) && t > 0 && r > 0)) ctx.bad(at, `tof row [${r}, ${t}]`)
        }
        if (w.kind === 'aa' || w.aa) {
          const a = w.aa || {}
          if (!num(a.lambdaBarrel) || a.lambdaBarrel <= 0 || a.lambdaBarrel > 2e-3) ctx.bad(at, `aa.lambdaBarrel ${a.lambdaBarrel}`)
          if (!num(a.rangeM) || a.rangeM < 500 || a.rangeM > 12000) ctx.bad(at, `aa.rangeM ${a.rangeM}`)
          if (a.vt && (!num(a.vt.lambdaBarrel) || instant(ctx, at, a.vt.from) == null)) ctx.bad(at, 'aa.vt needs from and lambdaBarrel')
        }
        if (w.kind === 'mg' || w.kind === 'cannon') {
          for (const k of ['calibreMm', 'mvMs', 'rofRpm']) if (!num(w[k])) ctx.bad(at, `${k} is not a number`)
          if (!w.vsAircraft || !num(w.vsAircraft.protected) || !num(w.vsAircraft.unprotected)) ctx.bad(at, 'vsAircraft { protected, unprotected } missing')
        }
        if (w.kind === 'torpedo') {
          if (!num(w.warheadKg)) ctx.bad(at, 'warheadKg missing')
          if (w.air) for (const k of ['speedKn', 'rangeM', 'dropSpeedKn', 'dropAltM']) if (!num(w[k])) ctx.bad(at, `an aerial torpedo needs ${k}`)
          if (!w.air && !(Array.isArray(w.settings) && w.settings.length && w.settings.every((s) => num(s.speedKn) && num(s.rangeM)))) ctx.bad(at, 'settings [{ speedKn, rangeM }] missing')
          if (!num(w.armRunM)) ctx.bad(at, 'armRunM missing')
          if (!Array.isArray(w.failRate) || !w.failRate.length) ctx.bad(at, 'failRate (dated) missing')
          for (const f of w.failRate || []) {
            if (instant(ctx, at, f.from) == null || instant(ctx, at, f.to) == null) ctx.bad(at, 'failRate entry without from and to')
            if (f.rate === null && !f.note) ctx.bad(at, 'a null failRate needs a note (DATA.md §8)')
            if (f.rate !== null && !(num(f.rate) && f.rate >= 0 && f.rate < 1)) ctx.bad(at, `failRate ${f.rate}`)
          }
        }
        if (w.kind === 'bomb' && !(num(w.massKg) && w.massKg > 0 && w.massKg < 2000)) ctx.bad(at, `massKg ${w.massKg}`)
        cites(at, w.sources)
      }
      ctx.count('weapons', weaponsFile.length)
    }
  }
  const weapon = (at, id, kinds) => {
    if (typeof id !== 'string') return need(at, 'names no weapon id')
    if (!weapons.size) return
    const w = weapons.get(id)
    if (!w) return ctx.bad(at, `weapon “${id}” is not in kits/weapons.json`)
    if (kinds && !kinds.some((k) => (k === 'aa' ? w.kind === 'aa' || w.aa : w.kind === k))) ctx.bad(at, `weapon “${id}” is a ${w.kind}, not ${kinds.join(' or ')}`)
  }

  // --- ships -----------------------------------------------------------------------
  const ships = Array.isArray(shipsFile) ? shipsFile : []
  for (const k of ships) {
    const at = `kits/ships.json ${k.id}`
    for (const f of SHIP_FIELDS) if (k[f] === undefined) need(at, `has no ${f}`)
    if (!VOCAB.shipTypes.includes(k.type)) ctx.bad(at, `type “${k.type}”`)
    if (!VOCAB.kitSides.includes(k.side)) ctx.bad(at, `side “${k.side}”`)
    try {
      assertVocab(k)
    } catch (e) {
      ctx.bad(at, e.message)
    }
    if (!(num(k.loa) && k.loa > 10 && k.loa < 300)) ctx.bad(at, `loa ${k.loa} m`)
    if (!(num(k.beam) && k.beam > 1 && k.beam < k.loa / 3)) ctx.bad(at, `beam ${k.beam} m`)
    if (!(num(k.draught) && k.draught > 0.5 && k.draught < 15)) ctx.bad(at, `draught ${k.draught} m`)
    if (!(num(k.speedKn) && k.speedKn > 5 && k.speedKn < 45)) ctx.bad(at, `speed ${k.speedKn} kn`)
    const d = k.displacement || {}
    if (!(num(d.standard) && num(d.full) && d.full >= d.standard * 0.99)) need(at, `displacement ${JSON.stringify(d)} (tonnes; full ≥ standard)`)
    if (num(k.displacementFullT) && num(d.full) && Math.abs(k.displacementFullT - d.full) > 1) ctx.warn(at, 'displacementFullT differs from displacement.full')
    if (!soft) {
      if (!(num(k.shp) && k.shp >= 100 && k.shp < 260000)) ctx.bad(at, `shp ${k.shp}`)
      if (!['sourced', 'estimated'].includes(k.shpPrecision)) ctx.bad(at, `shpPrecision “${k.shpPrecision}”`)
      if (!['measured', 'estimated'].includes(k.blocksPrecision)) ctx.bad(at, `blocksPrecision “${k.blocksPrecision}”`)
      const t = k.turn || {}
      if (!(num(t.tacticalDiameterM) && t.tacticalDiameterM > k.loa * 1.5 && t.tacticalDiameterM < k.loa * 8)) ctx.bad(at, `turn.tacticalDiameterM ${t.tacticalDiameterM}`)
      if (!(num(t.rudderS) && t.rudderS >= 5 && t.rudderS <= 60)) ctx.bad(at, `turn.rudderS ${t.rudderS}`)
      if (!['rule', 'sourced', 'estimate'].includes(t.turnPrecision)) ctx.bad(at, `turn.turnPrecision “${t.turnPrecision}”`)
      if (!(num(k.crippledAt) && k.crippledAt > 0 && k.crippledAt < 1)) ctx.bad(at, `crippledAt ${k.crippledAt}`)
      for (const s of k.systems || []) if (!SYSTEMS.includes(s)) ctx.bad(at, `system “${s}”`)
      for (const s of k.sensors || []) if (!SENSORS.includes(s.kind) || instant(ctx, at, s.from) == null) ctx.bad(at, `sensor ${JSON.stringify(s)}`)
    }
    if (!(num(k.fatal) && k.fatal > 0 && k.fatal <= 1.5)) need(at, `fatal ${k.fatal}`)
    const h = k.hull || {}
    if (!(Array.isArray(h.freeboard) && h.freeboard.length === 2 && h.freeboard.every((v) => num(v) && v > 0 && v < 25))) ctx.bad(at, `hull.freeboard ${JSON.stringify(h.freeboard)}`)
    if (!(num(h.sheer) && h.sheer >= 0 && h.sheer <= 1)) ctx.bad(at, `hull.sheer ${h.sheer}`)
    for (const [i, b] of (k.blocks || []).entries()) {
      const bat = `${at} block ${i} (${b.kind})`
      for (const f of ['w', 'h']) if (b[f] !== undefined && !(num(b[f]) && b[f] > 0 && b[f] < 120)) ctx.bad(bat, `${f} ${b[f]}`)
      if (!soft) for (const f of ['w', 'l', 'h']) if (!num(b[f])) ctx.bad(bat, `has no ${f}`)
      const [a, c] = span(b)
      if (c < a) ctx.bad(bat, 'at runs backwards')
    }
    if (k.type === 'cv' || k.type === 'cvl' || k.type === 'cve') {
      if (!(k.blocks || []).some((b) => b.kind === 'flight-deck')) ctx.bad(at, 'a carrier with no flight-deck block')
    }
    for (const [i, g] of (k.guns || []).entries()) {
      const gat = `${at} guns[${i}]`
      if (soft && g.weapon === undefined) {
        ctx.warn(gat, 'names no weapon (the fixture schema)')
        continue
      }
      weapon(gat, g.weapon, ['gun'])
      if (!Array.isArray(g.at) || !g.at.every((v) => num(v) && v >= 0 && v <= 1)) ctx.bad(gat, `at ${JSON.stringify(g.at)}`)
      if (!SIDES_OK(g.side)) ctx.bad(gat, `side “${g.side}”`)
      for (const f of ['turrets', 'mounts', 'barrels', 'traverseDegS']) if (!num(g[f])) ctx.bad(gat, `${f} is not a number`)
      if (!(Array.isArray(g.elevationDeg) && g.elevationDeg.length === 2)) ctx.bad(gat, 'elevationDeg [lo, hi] missing')
      if (!(Array.isArray(g.arcDeg) && g.arcDeg.length === 2)) need(gat, 'arcDeg [from, to] missing')
      const per = g.side === 'both' ? 2 : 1
      if (num(g.mounts) && Array.isArray(g.at) && g.mounts > g.at.length * per) ctx.warn(gat, `${g.mounts} mounts at ${g.at.length} positions${per === 2 ? ' a side' : ''}: some share a position`)
    }
    const aaList = (aa, where) => {
      for (const [i, a] of (aa || []).entries()) {
        if (soft && a.weapon === undefined) {
          ctx.warn(`${where}[${i}]`, 'names no weapon (the fixture schema)')
          continue
        }
        weapon(`${where}[${i}]`, a.weapon, ['aa'])
        if (!(num(a.mounts) && num(a.barrels))) ctx.bad(`${where}[${i}]`, 'mounts and barrels')
      }
    }
    aaList(k.aa, `${at} aa`)
    for (const [i, f] of (k.aaFits || []).entries()) {
      if (instant(ctx, at, f.from) == null || instant(ctx, at, f.to) == null) ctx.bad(`${at} aaFits[${i}]`, 'from and to')
      aaList(f.aa, `${at} aaFits[${i}].aa`)
    }
    if (k.torpedoes) {
      if (soft && k.torpedoes.weapon === undefined) ctx.warn(`${at} torpedoes`, 'names no weapon (the fixture schema)')
      else weapon(`${at} torpedoes`, k.torpedoes.weapon, ['torpedo'])
    }
    // colours
    const colourCheck = (c, where) => {
      if (!c) return need(where, 'missing')
      if (!SCHEME_NAMES.includes(c.hull)) ctx.bad(where, `hull colour “${c.hull}” is not in palette.js`)
      if (!DECKS.includes(c.deck)) ctx.bad(where, `deck “${c.deck}” is not in palette.js`)
      if (!DECK_MARKINGS.includes(c.deckMarking ?? null)) ctx.bad(where, `deckMarking “${c.deckMarking}”`)
    }
    colourCheck(k.colour, `${at} colour`)
    let prevTo = null
    for (const [i, c] of (k.colours || []).entries()) {
      colourCheck(c, `${at} colours[${i}]`)
      const a = instant(ctx, at, c.from)
      const b = instant(ctx, at, c.to)
      if (a == null || b == null || !(b > a)) ctx.bad(`${at} colours[${i}]`, 'from and to')
      if (prevTo != null && a != null && a < prevTo) ctx.bad(`${at} colours[${i}]`, 'overlaps the one before')
      prevTo = b
    }
    if (k.silhouette?.source && srcIds.size && !srcIds.has(k.silhouette.source)) need(at, `silhouette.source “${k.silhouette.source}” is not a source`)
    cites(at, k.sources)
    if (k.tokko && k.type !== 'ss-midget') ctx.warn(at, 'tokko on a kit that is not the midget submarine')
  }
  if (ships.length) ctx.count('ship kits checked', ships.length)

  // --- aircraft ----------------------------------------------------------------------
  const aircraft = Array.isArray(aircraftFile) ? aircraftFile : []
  for (const k of aircraft) {
    const at = `kits/aircraft.json ${k.id}`
    for (const f of AIRCRAFT_FIELDS) if (k[f] === undefined) need(at, `has no ${f}`)
    if (!VOCAB.aircraftTypes.includes(k.type)) ctx.bad(at, `type “${k.type}”`)
    if (!VOCAB.kitSides.includes(k.side)) ctx.bad(at, `side “${k.side}”`)
    const s = k.shape || {}
    if (!VOCAB.wingShapes.includes(s.wing)) ctx.bad(at, `shape.wing “${s.wing}”`)
    if (!VOCAB.tailShapes.includes(s.tail)) ctx.bad(at, `shape.tail “${s.tail}”`)
    if (!VOCAB.canopyShapes.includes(s.canopy)) ctx.bad(at, `shape.canopy “${s.canopy}”`)
    if (!VOCAB.gearShapes.includes(s.gear)) ctx.bad(at, `shape.gear “${s.gear}”`)
    if (!VOCAB.cowlShapes.includes(s.cowl)) ctx.bad(at, `shape.cowl “${s.cowl}”`)
    if (s.floats !== undefined && !['single', 'twin', 'boat'].includes(s.floats)) ctx.bad(at, `shape.floats “${s.floats}”`)
    if (!VOCAB.engineKinds.includes(k.engine?.kind)) ctx.bad(at, `engine.kind “${k.engine?.kind}”`)
    if (!(num(k.span) && k.span > 5 && k.span < 45)) ctx.bad(at, `span ${k.span} m`)
    if (!(num(k.length) && k.length > 4 && k.length < 35)) ctx.bad(at, `length ${k.length} m`)
    const sp = k.speedKmh || {}
    if (!(num(sp.max) && sp.max > 150 && sp.max < 800)) ctx.bad(at, `speedKmh.max ${sp.max}`)
    if (!(num(sp.stall) && sp.stall > 60 && sp.stall < sp.max)) need(at, `speedKmh.stall ${sp.stall}`)
    if (!(num(k.enduranceS) && k.enduranceS >= 300)) ctx.bad(at, `enduranceS ${k.enduranceS}`)
    if (!soft) {
      const a = k.aero || {}
      for (const f of AERO_FIELDS) if (a[f] === undefined) ctx.bad(at, `aero has no ${f}`)
      if (num(a.cd0) && (a.cd0 < 0.008 || a.cd0 > 0.06)) ctx.bad(at, `aero.cd0 ${a.cd0}`)
      if (num(a.k) && (a.k < 0.01 || a.k > 0.2)) ctx.bad(at, `aero.k ${a.k}`)
      if (num(a.vShakeMs) && num(a.vBreakMs) && !(a.vBreakMs > a.vShakeMs)) ctx.bad(at, 'aero.vBreakMs must exceed vShakeMs')
      if (!Array.isArray(a.rollTable) || a.rollTable.length < 2 || !a.rollTable.every((r, i, arr) => num(r[0]) && num(r[1]) && r[1] > 0 && r[1] < 150 && (i === 0 || r[0] > arr[i - 1][0]))) ctx.bad(at, 'aero.rollTable must be [[m/s, deg/s], ...] rising in speed')
      if (!num(k.handling?.turnS)) ctx.bad(at, 'handling.turnS missing')
      if (!num(k.wingM2)) ctx.bad(at, 'wingM2 missing')
      if (!['none', 'self-sealing'].includes(k.protection)) ctx.bad(at, `protection “${k.protection}”`)
    }
    for (const [i, g] of (k.guns || []).entries()) {
      if (soft && g.weapon === undefined) {
        ctx.warn(`${at} guns[${i}]`, 'names no weapon (the fixture schema)')
        continue
      }
      weapon(`${at} guns[${i}]`, g.weapon, ['mg', 'cannon'])
      if (!(num(g.count) && num(g.rounds))) ctx.bad(`${at} guns[${i}]`, 'count and rounds')
    }
    for (const [i, p] of (k.payload || []).entries()) {
      if (soft && p.weapon === undefined) {
        ctx.warn(`${at} payload[${i}]`, 'names no weapon (the fixture schema)')
        continue
      }
      weapon(`${at} payload[${i}]`, p.weapon, ['bomb'])
    }
    if (k.torpedo) {
      if (soft && k.torpedo.weapon === undefined) ctx.warn(`${at} torpedo`, 'names no weapon (the fixture schema)')
      else weapon(`${at} torpedo`, k.torpedo.weapon, ['torpedo'])
    }
    for (const t of k.torpedoes || []) weapon(`${at} torpedoes`, t.weapon, ['torpedo'])
    for (const p of k.payloadAlternatives || []) weapon(`${at} payloadAlternatives`, p.weapon, ['bomb'])
    // colours and insignia by date
    let prevTo = null
    for (const [i, c] of (k.colours || []).entries()) {
      const cat = `${at} colours[${i}]`
      if (!AIRCRAFT_COLOURS.includes(c.upper) || !AIRCRAFT_COLOURS.includes(c.lower)) ctx.bad(cat, `colours “${c.upper}”/“${c.lower}” not in palette.js`)
      if (!VOCAB.insignia.includes(c.insignia)) ctx.bad(cat, `insignia “${c.insignia}”`)
      const a = instant(ctx, cat, c.from)
      const b = instant(ctx, cat, c.to)
      if (a == null || b == null || !(b > a)) {
        ctx.bad(cat, 'from and to')
        continue
      }
      if (prevTo != null && a < prevTo) ctx.bad(cat, 'overlaps the one before')
      prevTo = b
      const dates = INSIGNIA_DATES[c.insignia]
      if (dates) {
        // (a month-precision date is held to the month: "1942-05" may start the May of the 15 May order)
        const month = (s) => /^\d{4}-\d{2}$/.test(s)
        const lo = instant(ctx, cat, month(c.from) ? dates[0].slice(0, 7) : dates[0])
        const hi = instant(ctx, cat, dates[1])
        const hiM = month(c.to) ? instant(ctx, cat, dates[1].slice(0, 7)) + 31 * 86400000 : hi
        if (a < lo || b > hiM) need(cat, `${c.insignia} flown ${c.from} to ${c.to}, outside its dates ${dates[0]} to ${dates[1]}`)
      }
      ctx.count('insignia periods')
    }
    if (!(k.colours || []).length) need(at, 'no colours')
    cites(at, k.sources)
  }
  if (aircraft.length) ctx.count('aircraft kits checked', aircraft.length)

  // every weapon some kit uses
  if (weapons.size && !soft) {
    const used = new Set()
    for (const k of ships) {
      for (const g of k.guns || []) used.add(g.weapon)
      for (const a of k.aa || []) used.add(a.weapon)
      for (const f of k.aaFits || []) for (const a of f.aa) used.add(a.weapon)
      if (k.torpedoes) used.add(k.torpedoes.weapon)
    }
    for (const k of aircraft) {
      for (const g of k.guns || []) used.add(g.weapon)
      for (const p of k.payload || []) used.add(p.weapon)
      if (k.torpedo) used.add(k.torpedo.weapon)
      for (const t of k.torpedoes || []) used.add(t.weapon)
      for (const p of k.payloadAlternatives || []) used.add(p.weapon)
    }
    for (const id of weapons.keys()) if (!used.has(id)) ctx.warn(`kits/weapons.json ${id}`, 'no kit uses it')
  }
  // (the frozen ids, types and sides are core()'s; colours names: the palette)
  void PALETTE_NAMES
}

const SIDES_OK = (s) => ['centre', 'both', 'port', 'starboard'].includes(s)
