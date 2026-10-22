// The routes check (DATA.md §5, §10; ENGINEERING.md §13, content workflow): routes.json against its
// schema and the rules: ids and references (chapter, event, places, sources, box units), the when and
// the waypoints' instants with their offsets, inside the route's span and in order along it, the source
// readings' conversions recomputed, a report route's dated waypoints, a chart route's public-domain chart,
// no route for the atomic missions, numbers only in tellings, the copy and voice rules, the points on the
// table, the sea rule against table/coast.json (skipped with a warning where the bake has not written it),
// and a box battle's fleet routes against its units' tracks at the battle's start (within 20 km).
import {
  checkIds, resolver, checkVocab, instant, checkWhen, checkCopy, checkVoice, checkNoNumbers,
  checkJapaneseNames, kmBetween, landIndex, wrapLon, battleClock, VOCAB,
} from './common.mjs'
import { ALLOW as GAZ_ALLOW, JAPANESE_NAMES, checkReading, tableTest } from './gazetteer.mjs'
import { parseInstant, spanOf } from '../../src/time.js'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Numbers that are names or directions, not counts: units, positions, courses and bearings. */
const ALLOW = [
  ...GAZ_ALLOW,
  /\b(?:Carrier|Cruiser|Destroyer|Battleship) Division \d{1,2}\b/g, // Carrier Division 2
  /\bTask Forces? \d{1,2}(?: and \d{1,2})?\b/g, // Task Forces 16 and 17
  /\b\d{1,3}(?:\.\d+)?°(?:\s?\d{1,2}(?:\.\d+)?′)?(?:\s?\(T\))?(?:\s?[NSEW]\b)?/g, // 9°20′ S, course 020°, 013° (T)
  /\b\d{1,2}(?:\.\d+)?′/g, // the minutes of a position whose degrees common.mjs has already passed
]
/**
 * A waypoint note reads a position off its source, so it may also quote the source's clock and the
 * chart's labels ("0130/5", "00/23", "N/28", "DEP 1930 20", "3 DEC"), a speed, a distance from a
 * place, and the page it comes from. Counts are refused there as anywhere.
 */
const NOTE_ALLOW = [
  /\b(?:DEP|ARR|SORTIE)\s[0-2]\d[0-5]\d(?:[–-][0-2]\d[0-5]\d)?\s\d{1,2}\b/g, // the chart's departures and arrivals, with the day
  ...ALLOW,
  /\b[0-2]\d[0-5]\d(?:[–-][0-2]\d[0-5]\d)?(?:\/(?:\d{1,2}|\?))?\b/g, // 0130/5, 0800–1500
  /\b\d{2}\/(?:\d{1,2}\b|\?)/g, // 00/23, 08/?
  /\b[A-Z]\/\d{1,2}\b/g, // N/28
  /\b\d{1,2} (?:JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)\b/g, // the chart's dates
  /\b\d{1,2}(?:\.\d)? knots\b/g,
  /\b\d{1,4} (?:nautical )?miles\b/g,
  /\b(?:App\.|n\.|pp?\.)\s?\d{1,4}\b/g,
  /§\s?\d+(?:\.\d+)*/g,
]
/** The atomic missions have no route (R3 D8). */
const ATOMIC_EVENTS = new Set(['hiroshima-1945', 'nagasaki-1945'])
const ATOMIC_WORDS = /\b(?:Enola Gay|Bockscar|Bock's Car|atomic|Little Boy|Fat Man)\b/i
/** The sea rule's slack at a route's ends (DATA.md §5), km; the step along a leg, km. */
const END_SLACK_KM = 10
const STEP_KM = 1
/** How far a box battle's fleet route may stand from its units' tracks at the battle's start, km. */
const UNIT_SLACK_KM = 20
/** Where the battle workflow's check is present, it holds routes and tracks together (once, not twice). */
const BATTLE_CHECK = existsSync(join(dirname(fileURLToPath(import.meta.url)), 'battle.mjs'))

const cites = (list) => (list || []).map((s) => (typeof s === 'string' ? s : s?.id))
const isLonLat = (c) => Array.isArray(c) && c.length >= 2 && Number.isFinite(c[0]) && Number.isFinite(c[1]) && Math.abs(c[1]) <= 90

/** Points made continuous across 180 (each longitude within 180° of the one before), as the app draws them. */
function continuous(points) {
  const out = []
  for (const p of points) out.push(out.length ? [wrapLon(p[0], out[out.length - 1][0]), p[1]] : [wrapLon(p[0], 141.5), p[1]])
  return out
}

/** A unit's position from its track at battle-clock seconds s (clamped to the track's ends), or null. */
function unitAt(clock, unit, units, s, depth = 0) {
  if (Array.isArray(unit?.track) && unit.track.length) {
    const fixes = unit.track
      .map((f) => {
        try {
          return { s: clock.parse(f.t), c: f.lonlat }
        } catch {
          return null
        }
      })
      .filter((f) => f && isLonLat(f.c))
      .sort((a, b) => a.s - b.s)
    if (!fixes.length) return null
    if (s <= fixes[0].s) return fixes[0].c
    for (let k = 0; k + 1 < fixes.length; k++) {
      const a = fixes[k]
      const b = fixes[k + 1]
      if (s <= b.s) {
        const g = b.s > a.s ? (s - a.s) / (b.s - a.s) : 0
        const bx = wrapLon(b.c[0], a.c[0])
        return [a.c[0] + (bx - a.c[0]) * g, a.c[1] + (b.c[1] - a.c[1]) * g]
      }
    }
    return fixes[fixes.length - 1].c
  }
  // a stationed unit stands where its guide does (the station's few kilometres are inside the slack)
  if (unit?.station?.guide && depth < 4) return unitAt(clock, units.get(unit.station.guide), units, s, depth + 1)
  return null
}

export default function check(ctx) {
  const routesL = ctx.load('routes.json')
  if (routesL === undefined) return
  if (!Array.isArray(routesL)) return ctx.bad('routes.json', 'is not a list')
  const list = (v) => (Array.isArray(v) ? v : [])
  const byId = (v) => new Map(list(v).filter((x) => x && typeof x.id === 'string').map((x) => [x.id, x]))
  const chapters = byId(ctx.load('chapters.json'))
  const clocks = byId(ctx.load('clocks.json'))
  const sources = byId(ctx.load('sources.json'))
  const places = byId(ctx.load('places.json'))
  const events = byId(ctx.load('events.json'))
  const onTable = tableTest(ctx.load('manifest.json'))
  const refChapter = resolver(ctx, chapters, 'chapter', 'chapters.json')
  const refEvent = resolver(ctx, events, 'event', 'events.json')
  const refPlace = resolver(ctx, places, 'place', 'places.json')
  const refSource = resolver(ctx, sources, 'source', 'sources.json')
  const opened = (id) => sources.get(id)?.opened === true
  const pdChart = (id) => VOCAB.imageLicences.includes(sources.get(id)?.licence)

  // the sea rule's land: coast.json's polygons (landIndex unwraps a polygon across the seam vertex to vertex)
  const coast = ctx.load('table/coast.json')
  let land = null
  if (coast === undefined) ctx.warn('routes.json', 'no table/coast.json here (the bake writes it): the sea rule is skipped')
  else land = landIndex(coast)

  const routes = checkIds(ctx, routesL, 'routes.json')
  for (const r of routesL) {
    if (!r || typeof r !== 'object') continue
    const at = `routes.json ${r.id}`
    for (const k of ['title', 'gloss', 'kind', 'side', 'medium', 'when', 'chapter', 'points', 'pointPrecision', 'direction', 'waypoints', 'summary', 'sources', 'confidence', 'tellings']) {
      if (r[k] === undefined || r[k] === null || r[k] === '') ctx.bad(at, `has no ${k}`)
    }
    for (const k of ['event', 'from', 'to']) if (!(k in r)) ctx.bad(at, `has no ${k} (null where there is none)`)
    if (r.kind) checkVocab(ctx, at, 'kind', r.kind, 'routeKinds')
    if (r.medium) checkVocab(ctx, at, 'medium', r.medium, 'routeMedium')
    if (r.pointPrecision) checkVocab(ctx, at, 'pointPrecision', r.pointPrecision, 'pointPrecision')
    if (r.direction) checkVocab(ctx, at, 'direction', r.direction, 'routeDirections')
    if (r.side !== undefined) {
      if (typeof r.side !== 'string') ctx.bad(at, 'side is one value')
      else checkVocab(ctx, at, 'side', r.side, 'sides')
    }
    for (const k of ['date', 'place', 'course']) if (r.confidence?.[k]) checkVocab(ctx, at, `confidence.${k}`, r.confidence[k], 'confidence')

    // when, and the chapter and event it belongs to
    const span = checkWhen(ctx, at, r.when, { clocks })
    const zone = r.when?.zone ?? clocks.get(r.when?.clock)?.offset ?? null
    if (r.chapter) {
      refChapter(at, r.chapter)
      const c = chapters.get(r.chapter)
      if (c && span) {
        try {
          const cs = [parseInstant(c.from), parseInstant(c.to)]
          if (span[1] <= cs[0] || span[0] >= cs[1]) ctx.warn(at, `its span lies outside its chapter ${r.chapter}`)
        } catch {
          // the gazetteer reports a chapter that does not parse
        }
      }
    }
    const ev = r.event ? events.get(r.event) : null
    if (r.event) {
      refEvent(at, r.event)
      if (ev && Array.isArray(ev.routes) && !ev.routes.includes(r.id)) ctx.count('routes their event does not list')
    }
    if (r.event && ATOMIC_EVENTS.has(r.event)) ctx.bad(at, 'a route for an atomic mission: none is drawn (R3 D8)')
    if (ATOMIC_WORDS.test(`${r.id} ${r.title} ${r.gloss}`)) ctx.bad(at, 'names an atomic mission: none is drawn (R3 D8)')
    for (const k of ['from', 'to']) if (r[k]) refPlace(`${at} ${k}`, r[k])

    // points
    const raw = list(r.points)
    if (raw.length < 2) ctx.bad(at, 'needs at least two points')
    const bad = raw.findIndex((c) => !isLonLat(c))
    if (bad >= 0) ctx.bad(at, `points[${bad}] ${JSON.stringify(raw[bad])} is not [lon, lat]`)
    const pts = bad >= 0 ? [] : continuous(raw)
    for (const [i, c] of pts.entries()) if (!onTable(c)) ctx.bad(at, `points[${i}] ${JSON.stringify(raw[i])} lies off the table`)
    for (const [i, s] of list(r.schematicSegments).entries()) {
      if (!Number.isInteger(s) || s < 0 || s > pts.length - 2) ctx.bad(at, `schematicSegments[${i}] ${s} is not a leg of the route`)
    }
    if (r.schematicSegments !== undefined && !Array.isArray(r.schematicSegments)) ctx.bad(at, 'schematicSegments must be a list of leg indices')

    // waypoints: on a point, in order, with offsets, inside the span, the source readings recomputed
    const timed = []
    let prevAt = -1
    let prevMs = -Infinity
    for (const [i, w] of list(r.waypoints).entries()) {
      const wat = `${at} waypoints[${i}]`
      if (!Number.isInteger(w?.at) || w.at < 0 || (pts.length && w.at > pts.length - 1)) ctx.bad(wat, `at ${w?.at} is not a point of the route`)
      else if (w.at < prevAt) ctx.bad(wat, `at ${w.at} comes before the waypoint ahead of it (${prevAt})`)
      if (w?.precision) checkVocab(ctx, wat, 'precision', w.precision, 'datePrecision')
      if (w?.source) refSource(wat, w.source)
      if (typeof w?.t !== 'string') ctx.bad(wat, 'has no t')
      else {
        const ms = instant(ctx, `${wat} t`, w.t, { zone: w.zone ?? zone })
        if (ms !== null) {
          if (/T\d{2}:\d{2}/.test(w.t) && !/(?:Z|[+-]\d{2}:\d{2})$/.test(w.t)) ctx.bad(wat, `t ${w.t} has a time and no offset`)
          // a bare date stands for its whole day: it is out of order only if the day ends before the waypoint ahead
          let end = ms
          try {
            end = spanOf({ from: w.t, zone: w.zone ?? zone ?? undefined, precision: w.precision || (/T/.test(w.t) ? 'minute' : 'day') })[1]
          } catch {
            // instant() has reported it
          }
          if (end < prevMs) ctx.bad(wat, `t ${w.t} is before the waypoint ahead of it`)
          if (span && (ms < span[0] - 864e5 || ms > span[1] + 864e5)) ctx.bad(wat, `t ${w.t} falls outside the route's when`)
          if (Number.isInteger(w.at)) timed.push({ at: w.at, ms })
          prevMs = Math.max(prevMs, ms)
        }
      }
      if (w?.sourceClock) checkReading(ctx, wat, w, refSource)
      if (w?.note !== undefined) {
        checkCopy(ctx, `${wat} note`, w.note)
        checkVoice(ctx, `${wat} note`, w.note, { card: `${r.summary || ''} ${w.note}` })
        checkNoNumbers(ctx, `${wat} note`, w.note, { allow: NOTE_ALLOW })
        if (typeof w.note === 'string' && /\*verify\*/.test(w.note)) ctx.bad(`${wat} note`, "carries a *verify* mark in the card's text; it belongs in notes")
        checkJapaneseNames(ctx, `${wat} note`, w.note, JAPANESE_NAMES)
      }
      if (Number.isInteger(w?.at)) prevAt = Math.max(prevAt, w.at)
    }
    if (r.pointPrecision === 'report' && timed.length < 2) ctx.bad(at, 'a report route needs dated waypoints')

    // a chart route is read off a named public-domain chart
    if (r.pointPrecision === 'chart') {
      const named = list(r.sources).some((s) => typeof s === 'object' && s?.id && pdChart(s.id) && s.where)
      const viaWaypoint = list(r.waypoints).some((w) => w?.source && pdChart(w.source))
      if (!named && !viaWaypoint) ctx.bad(at, 'a chart route cites no public-domain chart by name (a source with a pd-us-gov or pdm licence and a where)')
      else ctx.count('chart routes')
    }

    // sources and tellings
    const ids = cites(r.sources)
    for (const id of ids) refSource(at, id)
    if (!ids.length) ctx.bad(at, 'cites no source')
    else if (!ids.some(opened)) ctx.bad(at, 'cites no source that was opened')
    for (const [i, t] of list(r.tellings).entries()) {
      refSource(`${at} tellings[${i}]`, t?.source)
      if (typeof t?.says !== 'string' || !t.says) ctx.bad(`${at} tellings[${i}]`, 'says nothing')
      checkVoice(ctx, `${at} tellings[${i}]`, t?.says, { quote: true })
    }

    // the copy, the voice, the numbers
    const card = [r.title, r.gloss, r.summary, ...list(r.waypoints).map((w) => w?.note)].filter((x) => typeof x === 'string').join(' ')
    for (const [k, t] of [['title', r.title], ['gloss', r.gloss], ['summary', r.summary]]) {
      checkCopy(ctx, `${at} ${k}`, t)
      checkVoice(ctx, `${at} ${k}`, t, { card })
      checkNoNumbers(ctx, `${at} ${k}`, t, { allow: ALLOW })
      checkJapaneseNames(ctx, `${at} ${k}`, t, JAPANESE_NAMES)
      if (typeof t === 'string' && /\*verify\*/.test(t)) ctx.bad(`${at} ${k}`, "carries a *verify* mark in the card's text; it belongs in notes")
    }

    // the sea rule
    const seaKind = VOCAB.routeSeaKinds.includes(r.kind) && !((r.kind === 'strike' || r.kind === 'lane') && r.medium === 'air')
    if (land && seaKind && pts.length >= 2) {
      const a0 = pts[0]
      const z0 = pts[pts.length - 1]
      let reefNoted = false
      for (let k = 0; k + 1 < pts.length; k++) {
        const a = pts[k]
        const b = pts[k + 1]
        const n = Math.max(1, Math.ceil(kmBetween(a, b) / STEP_KM))
        for (let s = 0; s <= n; s++) {
          const c = [a[0] + ((b[0] - a[0]) * s) / n, a[1] + ((b[1] - a[1]) * s) / n]
          if (kmBetween(c, a0) <= END_SLACK_KM || kmBetween(c, z0) <= END_SLACK_KM) continue
          const hit = land(c)
          if (!hit) continue
          if (hit === 'reef') {
            if (!reefNoted) ctx.warn(at, `leg ${k} crosses a reef at ${c.map((v) => v.toFixed(3)).join(', ')}`)
            reefNoted = true
            continue
          }
          ctx.bad(at, `leg ${k} crosses ${hit} at ${wrapLon(c[0], 0).toFixed(3)}, ${c[1].toFixed(3)} (the sea rule, DATA.md §5)`)
          break
        }
      }
      ctx.count('routes held to the sea')
    }

    // a box battle's fleet routes and the units they stand for
    if (r.units !== undefined) {
      if (!Array.isArray(r.units) || r.units.some((u) => typeof u !== 'string')) ctx.bad(at, 'units must be a list of unit ids')
      else if (!ev?.box) ctx.bad(at, `carries units though its event ${r.event} has no box`)
      else {
        const battle = ctx.load(`boxes/${ev.box}/battle.json`)
        if (battle === undefined) ctx.count('route units not compared (no battle.json here yet)')
        else {
          const units = new Map(list(battle.units).filter((u) => u?.id).map((u) => [u.id, u]))
          if (BATTLE_CHECK) {
            // the battle workflow's tools/check/battle.mjs resolves these ids and compares the tracks itself
            ctx.count('route units left to the battle check')
          } else {
            for (const u of r.units) if (!units.has(u)) ctx.bad(at, `unit ${u} is not in boxes/${ev.box}/battle.json`)
            const clock = battle.clock ? battleClock(ctx, `boxes/${ev.box}/battle.json`, battle.clock) : null
            if (clock && r.kind === 'fleet') {
              // at the battle's start (DATA.md §5): the route's waypoint nearest the clock's start (its last
              // point if it has none), against each unit's position at t = 0 (its first fix if it begins later)
              let here = null
              let best = Infinity
              for (const w of timed) {
                const d = Math.abs(w.ms - clock.fromMs)
                if (d < best) {
                  best = d
                  here = pts[w.at]
                }
              }
              here ??= pts[pts.length - 1]
              if (here) {
                for (const u of r.units) {
                  const there = units.has(u) ? unitAt(clock, units.get(u), units, 0) : null
                  if (!there) continue
                  const d = kmBetween(here, there)
                  if (d > UNIT_SLACK_KM) ctx.bad(at, `stands ${Math.round(d)} km from unit ${u}'s track at the battle's start (more than ${UNIT_SLACK_KM} km)`)
                }
                ctx.count('fleet routes compared with their units')
              }
            }
          }
        }
      }
    } else if (r.kind === 'fleet' && ev?.box) ctx.count('fleet routes of a box battle with no units')

    ctx.count('routes')
    ctx.count(`routes of kind ${r.kind}`)
    ctx.count(`routes of precision ${r.pointPrecision}`)
  }
  // (every route an event lists is resolved by the gazetteer, which owns events.json)
  return routes
}
