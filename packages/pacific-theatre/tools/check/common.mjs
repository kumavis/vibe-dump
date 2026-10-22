// What every check module shares (ENGINEERING.md §12, DATA.md §10): the
// context (the data directory, loading, the problem and warning lists, the
// counts, the frozen ids), the id and reference helpers, instant parsing
// through src/time.js's own rules, distances across 180°, a land index for
// the sea rule, and the copy and voice rules as reusable matchers. Then
// core(), the checks every dataset passes whoever wrote it: every JSON file
// parses, and every id the files carry that ids.json freezes matches it
// (boxes with their footprints, sizes and recomputed placements, chapters,
// keyframes, clocks, kits).
//
// A module in tools/check/ (packs, gazetteer, routes, fronts, kits, battle:
// one per owning workflow) exports a default function check(ctx), sync or
// async, which reads what it needs with ctx.load and reports with ctx.bad,
// ctx.warn and ctx.count. tools/check-data.mjs runs core() and then every
// module present.
//
// The helpers are holo-i-ke-au's tools/check-data.mjs's (b480c27), split out
// and fixed for the Pacific: kmBetween wraps Δλ (179° to −179° is 2°, not
// 358°), the land test has a grid index (Natural Earth's Australia alone is
// tens of thousands of vertices), and the no-numbers rule allows battle-clock
// times, hull numbers, unit designators, calibres, zones and type numbers.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseInstant, zoneMinutes, spanOf, BattleClock } from '../../src/time.js'
import { wrapLon, TableProjection, TangentProjection, placement } from '../lib/geo.mjs'
import { readPNG } from '../lib/png.mjs'

const here = dirname(fileURLToPath(import.meta.url))
export const IDS = JSON.parse(readFileSync(join(here, 'ids.json'), 'utf8'))
export const VOCAB = IDS.vocab
export const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
/** The v1 table projection (DATA.md §1). */
export const V1_PROJECTION = { kind: 'aeqd', lon0: 141.5, lat0: 7.0, unit: 1000 }

// ---------------------------------------------------------------------------
// The context

/**
 * dir: the data directory (public/data, or test-data). A dataset whose
 * manifest says `test: true` is checked against ids.json's `fixtures` (with
 * the frozen clocks and vocabularies); any other against the real ids.
 */
export function createContext(dir) {
  const problems = []
  const warnings = []
  const counts = {}
  const cache = new Map()
  const ctx = {
    dir,
    ids: IDS,
    vocab: VOCAB,
    problems,
    warnings,
    counts,
    module: 'core',
    bad: (where, msg) => problems.push(`[${ctx.module}] ${where}: ${msg}`),
    warn: (where, msg) => warnings.push(`[${ctx.module}] ${where}: ${msg}`),
    count: (key, n = 1) => {
      counts[key] = (counts[key] || 0) + n
    },
    path: (rel) => join(dir, rel),
    exists: (rel) => existsSync(join(dir, rel)),
    /** Parsed JSON at rel (cached); undefined when absent (a problem unless optional), null when it does not parse (a problem). */
    load(rel, { optional = true } = {}) {
      if (cache.has(rel)) return cache.get(rel)
      const p = join(dir, rel)
      let v
      if (!existsSync(p)) {
        if (!optional) ctx.bad(rel, 'file is missing')
        v = undefined
      } else {
        try {
          v = JSON.parse(readFileSync(p, 'utf8'))
        } catch (e) {
          ctx.bad(rel, `does not parse: ${e.message}`)
          v = null
        }
      }
      cache.set(rel, v)
      return v
    },
    /** A file that is one list, or wraps one ({ boxes: [...] }); [] when absent. */
    list(rel, key) {
      const v = ctx.load(rel)
      return Array.isArray(v) ? v : Array.isArray(v?.[key]) ? v[key] : []
    },
  }
  const manifest = ctx.load('manifest.json')
  ctx.test = manifest?.test === true || ctx.load('boxes/manifest.json')?.test === true
  const F = IDS.fixtures
  ctx.frozen = ctx.test
    ? { boxes: F.boxes, chapters: F.chapters, keyframes: F.keyframes, kits: F.kits, clocks: IDS.clocks }
    : { boxes: IDS.boxes, chapters: IDS.chapters, keyframes: IDS.keyframes, kits: IDS.kits, clocks: IDS.clocks }
  return ctx
}

// ---------------------------------------------------------------------------
// Ids, references, vocabularies

/** Every item has a unique kebab-case ASCII id; returns id → item. */
export function checkIds(ctx, list, file) {
  const seen = new Set()
  for (const [i, x] of (list || []).entries()) {
    const at = `${file}[${i}]`
    if (typeof x?.id !== 'string') {
      ctx.bad(at, 'has no id')
      continue
    }
    if (!ID.test(x.id)) ctx.bad(`${file} ${x.id}`, 'id is not kebab-case ASCII')
    if (seen.has(x.id)) ctx.bad(`${file} ${x.id}`, 'id is not unique')
    seen.add(x.id)
  }
  return new Map((list || []).filter((x) => typeof x?.id === 'string').map((x) => [x.id, x]))
}

/** A resolver for one kind of reference: ref(at, id) is true when id is in the map, and reports it when not. */
export function resolver(ctx, map, kind, file) {
  return (at, id) => {
    if (id === null || id === undefined) return false
    if (map.has(id)) return true
    ctx.bad(at, `${kind} “${id}” is not in ${file}`)
    return false
  }
}

/** value is one of VOCAB[name] (or each of a list is). */
export function checkVocab(ctx, at, field, value, name) {
  const V = VOCAB[name]
  if (!V) throw new Error(`no vocabulary ${name} in ids.json`)
  for (const v of Array.isArray(value) ? value : [value]) if (!V.includes(v)) ctx.bad(at, `${field} “${v}” is not one of ${V.join(' | ')}`)
}

// ---------------------------------------------------------------------------
// Time, through src/time.js's own rules

/** An ISO date or instant → ms UTC, or null with a problem (a time without its offset is one, DATA.md §4). */
export function instant(ctx, at, s, { zone = null, needOffset = false } = {}) {
  try {
    if (needOffset && /T/.test(String(s)) === false && /:\d\d/.test(String(s))) throw new Error('a time with no date')
    return parseInstant(s, { zone })
  } catch (e) {
    ctx.bad(at, e.message)
    return null
  }
}

/** An ISO offset is valid (±HH:MM or Z); the navy's own "zone +12" is not one. */
export function checkZone(ctx, at, zone) {
  try {
    zoneMinutes(zone)
    return true
  } catch (e) {
    ctx.bad(at, e.message)
    return false
  }
}

/** A `when` (DATA.md §4): from (and to) parse in its zone, a precision of the vocabulary, from before to; returns [from, to) ms or null. */
export function checkWhen(ctx, at, when, { clocks = null } = {}) {
  if (!when || typeof when !== 'object') {
    ctx.bad(at, 'has no when')
    return null
  }
  if (!VOCAB.datePrecision.includes(when.precision)) ctx.bad(at, `when.precision “${when.precision}” is not one of ${VOCAB.datePrecision.join(' | ')}`)
  let zone = when.zone ?? null
  if (when.clock) {
    const c = clocks?.get(when.clock)
    if (clocks && !c) ctx.bad(at, `when.clock “${when.clock}” is not in clocks.json`)
    zone ??= c?.offset ?? null
  }
  if (zone) checkZone(ctx, `${at} when.zone`, zone)
  const a = instant(ctx, `${at} when.from`, when.from, { zone })
  const b = when.to ? instant(ctx, `${at} when.to`, when.to, { zone }) : a
  if (a === null || b === null) return null
  if (b < a) ctx.bad(at, `when.to (${when.to}) is before when.from (${when.from})`)
  try {
    return spanOf({ ...when, zone })
  } catch (e) {
    ctx.bad(at, e.message)
    return null
  }
}

/** A battle clock from battle.json's `clock`, or null with a problem. */
export function battleClock(ctx, at, clock) {
  try {
    checkZone(ctx, `${at} clock.zone`, clock?.zone)
    return new BattleClock(clock)
  } catch (e) {
    ctx.bad(at, `clock: ${e.message}`)
    return null
  }
}

/** A battle-clock time (10:22, 10:22:30, 24:07 or an ISO instant) → seconds since from, inside the clock (DATA.md §9), or null. */
export function battleTime(ctx, at, clock, t, { inside = true } = {}) {
  if (!clock) return null
  let s
  try {
    s = clock.parse(t)
  } catch (e) {
    ctx.bad(at, e.message)
    return null
  }
  if (inside && (s < 0 || s > clock.duration)) ctx.bad(at, `t ${t} falls outside the clock (${clock.label(0)} to ${clock.label(clock.duration)})`)
  return s
}

/**
 * A fix taken from a source on another clock (DATA.md §4, §9) carries
 * sourceClock (HHMM), sourceZone and, where the date differs, sourceDate:
 * recompute the conversion and say where it disagrees (by more than a minute).
 */
export function checkSourceClock(ctx, at, item, clock) {
  if (!item?.sourceClock || !clock) return
  const m = /^(\d{2}):?(\d{2})$/.exec(String(item.sourceClock))
  if (!m) return ctx.bad(at, `sourceClock “${item.sourceClock}” is not HHMM`)
  if (!item.sourceZone) return ctx.bad(at, 'a sourceClock needs its sourceZone')
  if (!checkZone(ctx, `${at} sourceZone`, item.sourceZone)) return
  const tS = battleTime(ctx, at, clock, item.t, { inside: false })
  if (tS === null) return
  const local = new Date(clock.utc(tS) + zoneMinutes(item.sourceZone) * 60000)
  const pad = (n) => String(n).padStart(2, '0')
  const wantMin = local.getUTCHours() * 60 + local.getUTCMinutes()
  const gotMin = +m[1] * 60 + +m[2]
  const diff = (((wantMin - gotMin) % 1440) + 1440) % 1440
  if (Math.min(diff, 1440 - diff) > 1) ctx.bad(at, `sourceClock ${m[1]}${m[2]} ${item.sourceZone} is ${pad(local.getUTCHours())}${pad(local.getUTCMinutes())} for t ${item.t} in ${clock.zone}`)
  if (item.sourceDate) {
    const d = `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}-${pad(local.getUTCDate())}`
    if (d !== item.sourceDate) ctx.bad(at, `sourceDate ${item.sourceDate} is ${d} for t ${item.t} in ${clock.zone}`)
  }
}

// ---------------------------------------------------------------------------
// Space

/** Kilometres between two [lon, lat], equirectangular at their mean latitude, Δλ wrapped. */
export function kmBetween(a, b) {
  const kx = 111.32 * Math.cos((((a[1] + b[1]) / 2) * Math.PI) / 180)
  return Math.hypot((wrapLon(b[0], a[0]) - a[0]) * kx, (a[1] - b[1]) * 110.574)
}

/** The rings of a Polygon or MultiPolygon as [outer, ...holes] lists. */
const polysOf = (g) => (g?.type === 'Polygon' ? [g.coordinates] : g?.type === 'MultiPolygon' ? g.coordinates : [])

/**
 * A land test over polygons (coast.json's features, normalised about lon0):
 * test([lon, lat]) → the feature's kind (or 'land'), or null at sea; and
 * test.depth([lon, lat]) → metres to the nearest edge. A grid of 1° cells
 * holds each polygon's index, so a test looks at a handful of rings.
 */
export function landIndex(fc, { lon0 = V1_PROJECTION.lon0, cell = 1 } = {}) {
  const polys = []
  const grid = new Map()
  const key = (i, j) => `${i},${j}`
  for (const f of fc?.features || []) {
    for (const poly of polysOf(f.geometry)) {
      const rings = poly.map((r) => r.map(([x, y]) => [wrapLon(x, lon0), y]))
      const xs = rings[0].map((c) => c[0])
      const ys = rings[0].map((c) => c[1])
      const box = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]
      const k = polys.push({ rings, box, kind: f.properties?.kind || 'land' }) - 1
      for (let i = Math.floor(box[0] / cell); i <= Math.floor(box[2] / cell); i++) {
        for (let j = Math.floor(box[1] / cell); j <= Math.floor(box[3] / cell); j++) {
          const c = key(i, j)
          if (!grid.has(c)) grid.set(c, [])
          grid.get(c).push(k)
        }
      }
    }
  }
  const inRing = (r, x, y) => {
    let c = false
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      if (r[i][1] > y !== r[j][1] > y && x < ((r[j][0] - r[i][0]) * (y - r[i][1])) / (r[j][1] - r[i][1]) + r[i][0]) c = !c
    }
    return c
  }
  const near = (x, y) => grid.get(key(Math.floor(x / cell), Math.floor(y / cell))) || []
  const test = ([lon, lat]) => {
    const x = wrapLon(lon, lon0)
    for (const k of near(x, lat)) {
      const p = polys[k]
      const [x0, y0, x1, y1] = p.box
      if (x < x0 || x > x1 || lat < y0 || lat > y1) continue
      if (inRing(p.rings[0], x, lat) && !p.rings.slice(1).some((h) => inRing(h, x, lat))) return p.kind
    }
    return null
  }
  test.depth = ([lon, lat]) => {
    const x = wrapLon(lon, lon0)
    const kx = 111320 * Math.cos((lat * Math.PI) / 180)
    let best = Infinity
    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        for (const k of grid.get(key(Math.floor(x / cell) + di, Math.floor(lat / cell) + dj)) || []) {
          for (const r of polys[k].rings) {
            for (let i = 0; i + 1 < r.length; i++) {
              const ax = (r[i][0] - x) * kx
              const ay = (r[i][1] - lat) * 110574
              const bx = (r[i + 1][0] - x) * kx
              const by = (r[i + 1][1] - lat) * 110574
              const dx = bx - ax
              const dy = by - ay
              const t = Math.max(0, Math.min(1, -(ax * dx + ay * dy) / (dx * dx + dy * dy || 1)))
              best = Math.min(best, Math.hypot(ax + dx * t, ay + dy * t))
            }
          }
        }
      }
    }
    return best
  }
  test.count = polys.length
  return test
}

// ---------------------------------------------------------------------------
// The copy and voice rules (DATA.md §10; R8 §5.5), as matchers

const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December'

/** Text that announces what the app does not draw, show or offer: the rule is practised, not announced. */
export const ANNOUNCES = /this app|does not place|not drawn|nothing is drawn|is not shown|not depicted|not shown|we do not|never shown/i

/** One user-facing text field held to the copy rule. */
export function checkCopy(ctx, at, text) {
  if (typeof text !== 'string') return
  ctx.count('copy fields')
  const m = text.match(ANNOUNCES)
  if (m) ctx.bad(at, `says what the app does not show (“${m[0]}”); the rule is practised, not announced`)
}

const BIG_WORDS = /\b(hundreds?|thousands?|millions?|dozens?|scores of|per ?cent)\b/i
// a count spelled out: "four carriers", "twelve of the bombers" (the Hawaiian rule caught digits only)
const COUNT_WORDS = /\b(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\s+(?:(?:of\s+)?(?:the|their|his|its|our|her)\s+|[\w-]+\s+){0,2}(ships?|carriers?|battleships?|cruisers?|destroyers?|submarines?|transports?|aircraft|planes|bombers|fighters|men|sailors|crews?|soldiers|marines|airmen|pilots|people|dead|killed|wounded|tons|sorties|lives)\b/i
// what a number may stand for outside a count (DATA.md §10's allow-list)
const ALLOW = [
  /\b\d{1,2}:\d{2}(?::\d{2})?\b/g, // battle-clock times, 10:22, 24:07
  /\b(?:UTC|GMT)\s?[−+-]\s?\d{1,2}(?::\d{2})?\b/g, // UTC−12, UTC+9:30
  /\bzone\s?[−+-]\s?\d{1,2}\b/gi, // zone +12, zone −11
  /[−+-]\d{2}:\d{2}\b/g, // −10:30
  /\b(?:CV|CVL|CVE|BB|CA|CL|DD|DE|SS|AP|APD|LST|AK|AO|PT|AG)-\d{1,4}\b/g, // hull numbers CV-6, DD-445
  /\b(?:VB|VT|VF|VS|VP|VMF|VMSB|VMTB|VC|VMO)-\d{1,3}\b/g, // squadrons VB-6
  /\b(?:TF|TG|TU)\s?\d{1,3}(?:\.\d{1,2}){0,2}\b/g, // TF 16, TG 77.4.3
  /\bTaffy\s?\d\b/g,
  /\b(?:CarDiv|BatDiv|CruDiv|DesDiv|DesRon|Sentai|Kōkūtai|Kokutai)\s?\d{1,3}\b/g,
  /\b\d{1,2}(?:\.\d)?[-‑ ]inch\b/gi, // 16-inch, 5-inch
  /\b\d{1,3}(?:\.\d)?\s?(?:mm|cm)\b/g, // 127 mm, 46 cm
  /\b\d"\/\d{2}\b/g, // 5"/38
  /\b(?:Type|Mark|Mk\.?|Model)\s?\d{1,3}\b/g, // Type 93, Mark 15
  /\b[A-Z]{1,3}\d[A-Z]?\d?(?:-\d{1,2}[A-Z]?)?\b/g, // A6M2, B5N2, SBD-3, F4F-4, P-40B
  /\b\d{1,3}(?:st|nd|rd|th)\b/g, // ordinals: the 2nd Marine Division
  /\b\d{1,3}°\s?[NSEW]?\b/g, // latitudes in a line's name, 16° N
]

/**
 * Numbers belong in tellings and typed fields: a summary, stop, beat, note
 * or after-text may carry years, decades, days of a month, ranges of years,
 * and what ALLOW lists (times, zones, hull numbers, unit designators,
 * calibres, type numbers, ordinals), never a count. `allow`: more patterns.
 */
export function checkNoNumbers(ctx, at, text, { allow = [] } = {}) {
  if (typeof text !== 'string') return
  const w = text.match(BIG_WORDS)
  if (w) ctx.bad(at, `has the number word “${w[0]}”; counts go in tellings`)
  const c = text.match(COUNT_WORDS)
  if (c) ctx.bad(at, `counts in words (“${c[0]}”); counts go in tellings`)
  let t = text
  for (const re of [...ALLOW, ...allow]) t = t.replace(re, (m) => ' '.repeat(m.length))
  const re = /\d[\d,.]*/g
  let m
  while ((m = re.exec(t))) {
    const tok = m[0].replace(/[.,]$/, '')
    const after = t.slice(m.index + tok.length, m.index + tok.length + 1)
    const before = t.slice(Math.max(0, m.index - 12), m.index)
    const isYear = /^\d{4}$/.test(tok) && +tok >= 1850 && +tok <= 2099
    const isDecade = /^\d{4}$/.test(tok) && after === 's'
    const isDay = /^\d{1,2}$/.test(tok) && +tok >= 1 && +tok <= 31 && (new RegExp(`^[–-]?\\d{0,2}\\s?(${MONTHS})\\b`).test(t.slice(m.index + tok.length).trimStart()) || new RegExp(`(${MONTHS}) $`).test(before))
    const isRange = /^\d{4}$/.test(tok) && /[–-]$/.test(before)
    const isShortRange = /^\d{2}$/.test(tok) && /\d{4}[–-]$/.test(before)
    if (!(isYear || isDecade || isDay || isRange || isShortRange)) ctx.bad(at, `has the number “${tok}”; counts go in tellings`)
  }
}

/** Slurs, in either language, never in the app's voice (only inside a `quote` field). */
export const SLURS = [/\bJaps?\b/, /\bNips?\b/, /\bJappo?\b/i, /\bGooks?\b/i, /\bChinks?\b/i, /\bChinam[ae]n\b/i, /鬼畜米英/, /毛唐/, /チャンコロ/]
/** Glory words, never in the app's voice. */
export const GLORY = [/英霊/, /散華/, /gave their lives/i, /ultimate sacrifice/i, /\bheroes\b/i]
/** Never in an after-card. */
export const AFTER_WORDS = [/\bsaved\b/i, /\bwhat if\b/i, /\bvictor(?:y|ies)\b/i]

/**
 * The voice rules on one field. opts: { quote (the field is a quotation:
 * slurs and glory words are the source's), card (the whole card's text, for
 * the rules that look at the card: kamikaze without tokkō, internment
 * without the Justice Department camps), after (the field is an after-card's) }.
 */
export function checkVoice(ctx, at, text, { quote = false, card = null, after = false } = {}) {
  if (typeof text !== 'string') return
  if (!quote) {
    for (const re of SLURS) if (re.test(text)) ctx.bad(at, `a slur (“${text.match(re)[0]}”) in the app's voice; only a quote field may carry one`)
    for (const re of GLORY) if (re.test(text)) ctx.bad(at, `a glory word (“${text.match(re)[0]}”) in the app's voice`)
    const whole = card ?? text
    if (/\binternment\b/i.test(text) && !/Justice Department/i.test(whole)) ctx.warn(at, '“internment” outside a quote: only for the Justice Department camps')
    if (/\bkamikaze\b/i.test(text) && !/tokk[ōo]/i.test(whole)) ctx.bad(at, '“kamikaze” with no “tokkō” on the same card')
  }
  if (after) for (const re of AFTER_WORDS) if (re.test(text)) ctx.bad(at, `“${text.match(re)[0]}” in an after-card`)
}

/**
 * A Japanese personal name in the app's voice is written family name first.
 * names: [{ family, given }] the record uses; flags "given family".
 */
export function checkJapaneseNames(ctx, at, text, names) {
  if (typeof text !== 'string') return
  for (const { family, given } of names || []) if (new RegExp(`\\b${given}\\s+${family}\\b`).test(text)) ctx.bad(at, `“${given} ${family}”: write the family name first (${family} ${given})`)
}

/** Scores are in sortie terms: no number beside men, crew, lives, the dead, people, 人, 名 or 命 in a "your battle" line. */
export const PEOPLE_NUMBER = /\d[\d,.]*\s*(?:men|crew|lives|dead|killed|died|people|人|名|命)|(?:men|crew|lives|dead|killed|died|people)\s*[:：]?\s*\d/i
export function checkScoreLine(ctx, at, text) {
  if (typeof text === 'string' && PEOPLE_NUMBER.test(text)) ctx.bad(at, `a number beside people (“${text.match(PEOPLE_NUMBER)[0]}”): scores are in sortie terms`)
}

// ---------------------------------------------------------------------------
// core(): every dataset, whoever wrote it

/** Every .json and .geojson file under dir. */
function jsonFiles(dir, base = dir) {
  const out = []
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    if (statSync(p).isDirectory()) out.push(...jsonFiles(p, base))
    else if (/\.(geo)?json$/.test(f)) out.push(relative(base, p))
  }
  return out.sort()
}

const near = (a, b, tol) => Math.abs(a - b) <= tol

/** A pack's height PNG decodes, in the pack format (8-bit RGB), at the manifest's size. */
function checkPackImage(ctx, at, file, size) {
  if (!ctx.exists(file)) return ctx.bad(at, `${file} is missing`)
  try {
    const img = readPNG(ctx.path(file))
    if (img.channels !== 3) ctx.bad(at, `${file} has ${img.channels} channels; a pack is 8-bit RGB (DATA.md §2)`)
    if (img.width !== size[0] || img.height !== size[1]) ctx.bad(at, `${file} is ${img.width}×${img.height}; the manifest says ${size.join('×')}`)
    ctx.count('pack images')
  } catch (e) {
    ctx.bad(at, `${file}: ${e.message}`)
  }
}

export function core(ctx) {
  // every JSON file parses
  if (!existsSync(ctx.dir)) return ctx.bad(ctx.dir, 'no such directory')
  for (const f of jsonFiles(ctx.dir)) {
    ctx.load(f)
    ctx.count('files parsed')
  }
  const fz = ctx.frozen

  // the table's manifest
  const m = ctx.load('manifest.json')
  let table = null
  if (m === undefined) ctx.warn('manifest.json', 'not here (the bake writes it): the table and the boxes are not checked against it')
  else if (m) {
    const p = m.projection
    try {
      table = new TableProjection(p)
    } catch (e) {
      ctx.bad('manifest.json projection', e.message)
    }
    if (p && (p.kind !== V1_PROJECTION.kind || p.lon0 !== V1_PROJECTION.lon0 || p.lat0 !== V1_PROJECTION.lat0 || p.unit !== V1_PROJECTION.unit)) ctx.bad('manifest.json projection', `is ${JSON.stringify(p)}; v1 is ${JSON.stringify(V1_PROJECTION)} (DATA.md §1)`)
    const t = m.table
    if (!t) ctx.bad('manifest.json', 'has no table')
    else {
      for (const k of ['bounds', 'size', 'extent', 'height']) if (!t[k]) ctx.bad('manifest.json table', `has no ${k}`)
      if (t.height && !(Number.isFinite(t.height.scale) && Number.isFinite(t.height.offset))) ctx.bad('manifest.json table.height', 'needs scale and offset')
      if (t.size && t.extent) {
        const tx = (t.extent[2] - t.extent[0]) / t.size[0]
        const tz = (t.extent[3] - t.extent[1]) / t.size[1]
        if (!near(tx, tz, tx * 1e-3)) ctx.bad('manifest.json table', `texels are not square in projected space (${tx.toFixed(4)} × ${tz.toFixed(4)} km)`)
      }
      if (t.height?.file && t.size) checkPackImage(ctx, 'manifest.json table', t.height.file, t.size)
    }
  }

  // chapters and keyframes, in the frozen order
  const chapters = ctx.load('chapters.json')
  if (Array.isArray(chapters)) {
    const got = chapters.map((c) => c.id)
    if (JSON.stringify(got) !== JSON.stringify(fz.chapters)) ctx.bad('chapters.json', `ids are ${got.join(', ')}; frozen: ${fz.chapters.join(', ')}`)
    for (const c of chapters) if (c.keyframe && !fz.keyframes.includes(c.keyframe)) ctx.bad(`chapters.json ${c.id}`, `keyframe ${c.keyframe} is not a frozen keyframe (${fz.keyframes.join(', ')})`)
    ctx.count('chapters', chapters.length)
  } else if (chapters !== undefined && chapters !== null) ctx.bad('chapters.json', 'must be an array')
  const fronts = ctx.load('fronts/manifest.json')
  for (const k of fronts?.keyframes || []) if (!fz.keyframes.includes(k.id)) ctx.bad(`fronts/manifest.json ${k.id}`, 'is not a frozen keyframe')

  // clocks: the frozen ids with their offsets
  const clocks = ctx.load('clocks.json')
  if (Array.isArray(clocks)) {
    const seen = new Set()
    for (const c of clocks) {
      seen.add(c.id)
      if (!(c.id in fz.clocks)) ctx.bad(`clocks.json ${c.id}`, 'is not a frozen clock id')
      else if (c.offset !== fz.clocks[c.id]) ctx.bad(`clocks.json ${c.id}`, `offset ${c.offset}; frozen ${fz.clocks[c.id]}`)
      checkZone(ctx, `clocks.json ${c.id} offset`, c.offset)
    }
    for (const id of Object.keys(fz.clocks)) if (!seen.has(id)) ctx.warn('clocks.json', `has no ${id}`)
    ctx.count('clocks', clocks.length)
  }

  // boxes: the frozen footprints, sizes and exaggerations, and the placement recomputed
  const boxes = ctx.list('boxes/manifest.json', 'boxes')
  for (const b of boxes) {
    const at = `boxes/manifest.json ${b.id}`
    const f = fz.boxes[b.id]
    if (!f) {
      ctx.bad(at, `is not a frozen box (${Object.keys(fz.boxes).join(', ')})`)
      continue
    }
    const lon0 = b.projection?.lon0
    if (b.projection?.kind !== 'tangent') ctx.bad(at, 'projection.kind must be tangent')
    if (!near(wrapLon(lon0, f.lon0), f.lon0, 1e-6) || !near(b.projection?.lat0, f.lat0, 1e-6)) ctx.bad(at, `lon0, lat0 ${lon0}, ${b.projection?.lat0}; frozen ${f.lon0}, ${f.lat0}`)
    if (JSON.stringify(b.size) !== JSON.stringify(f.size)) ctx.bad(at, `size ${JSON.stringify(b.size)}; frozen ${JSON.stringify(f.size)}`)
    if ((b.exaggeration ?? 1) !== f.exaggeration) ctx.bad(at, `exaggeration ${b.exaggeration}; frozen ${f.exaggeration}`)
    if (Array.isArray(b.bounds) && b.size) {
      const dLon = (f.bounds[2] - f.bounds[0]) / f.size[0]
      const dLat = (f.bounds[3] - f.bounds[1]) / f.size[1]
      const w = wrapLon(b.bounds[0], f.bounds[0])
      const e = w + (b.bounds[2] - b.bounds[0])
      const off = [Math.abs(w - f.bounds[0]) / dLon, Math.abs(b.bounds[1] - f.bounds[1]) / dLat, Math.abs(e - f.bounds[2]) / dLon, Math.abs(b.bounds[3] - f.bounds[3]) / dLat]
      if (off.some((v) => v >= 1)) ctx.bad(at, `bounds ${JSON.stringify(b.bounds)} move more than a texel from the frozen ${JSON.stringify(f.bounds)}`)
      else if (off.some((v) => v > 1e-6)) ctx.warn(at, `bounds refined from the frozen ones by up to ${Math.max(...off).toFixed(3)} texel`)
    }
    if (table && b.projection) {
      const pl = placement({ projection: { ...b.projection, kind: 'tangent', unit: 1 } }, table)
      const mp = b.placement
      if (!mp) ctx.warn(at, 'has no placement (the bake writes it)')
      else {
        const dc = Math.hypot(mp.centre[0] - pl.centre[0], mp.centre[1] - pl.centre[1])
        const dj = Math.max(...pl.J.flat().map((v, i) => Math.abs(v - mp.jacobian.flat()[i]) / Math.abs(pl.scale)))
        if (dc > 0.01 || dj > 1e-5 || !near(mp.convergenceDeg, pl.convergenceDeg, 0.01)) ctx.bad(at, `placement differs from geo.js: centre by ${dc.toFixed(4)} km, Jacobian by ${dj.toExponential(1)}, convergence ${mp.convergenceDeg} against ${pl.convergenceDeg.toFixed(3)}`)
      }
    }
    if (b.height?.file && b.size) checkPackImage(ctx, at, b.height.file, b.size)
    if (b.battle && !ctx.exists(b.battle)) ctx.warn(at, `battle ${b.battle} is not here yet`)
    ctx.count('boxes')
  }

  // kits: the frozen ids with their types and nations
  for (const [file, kind] of [['kits/ships.json', 'ships'], ['kits/aircraft.json', 'aircraft']]) {
    const list = ctx.load(file)
    if (list === undefined || list === null) continue
    if (!Array.isArray(list)) {
      ctx.bad(file, 'must be an array')
      continue
    }
    checkIds(ctx, list, file)
    for (const k of list) {
      const f = fz.kits[kind][k.id]
      if (!f) ctx.warn(`${file} ${k.id}`, 'is not a frozen kit id (new kits go through the project manager)')
      else if (k.type !== f.type || k.nation !== f.nation) ctx.bad(`${file} ${k.id}`, `type ${k.type}, nation ${k.nation}; frozen ${f.type}, ${f.nation}`)
    }
    ctx.count(`${kind} kits`, list.length)
  }
}

/** Print what was found; returns the exit code. */
export function report(ctx) {
  for (const w of ctx.warnings) console.log(`  warning  ${w}`)
  for (const p of ctx.problems) console.log(`  PROBLEM  ${p}`)
  const counts = Object.entries(ctx.counts)
    .map(([k, v]) => `${v} ${k}`)
    .join(', ')
  if (ctx.problems.length) {
    console.log(`${ctx.problems.length} problem(s), ${ctx.warnings.length} warning(s) in ${ctx.dir}`)
    return 1
  }
  console.log(`clean: ${ctx.dir}${ctx.test ? ' (test fixtures)' : ''}: ${counts || 'nothing to check'}${ctx.warnings.length ? `; ${ctx.warnings.length} warning(s)` : ''}`)
  return 0
}

export { TangentProjection, TableProjection, placement, wrapLon }
