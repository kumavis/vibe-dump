// The gazetteer check (DATA.md §§3–4, §10; ENGINEERING.md §13, content workflow): chapters.json,
// clocks.json, sources.json, places.json, events.json and table/labels.json against their schema and the
// rules: ids and references, instants with offsets inside their containers, the clocks' offsets in the
// instants, the source readings' conversions recomputed, numbers only in tellings, the copy and voice
// rules, kinds and flags, the islands' held intervals, the frozen boxes' events.
import {
  checkIds, resolver, checkVocab, instant, checkZone, checkWhen, checkCopy, checkVoice, checkNoNumbers,
  checkJapaneseNames, wrapLon, ID, TableProjection, V1_PROJECTION,
} from './common.mjs'
import { parseInstant, spanOf, zoneMinutes } from '../../src/time.js'

/** Numbers that are names, not counts (DATA.md §10's allow-list, extended for this record). */
export const ALLOW = [
  /\b[A-Z]{1,2}-\d{1,3}[A-Z]?s?\b/g, // B-29s, P-38s, B-25, I-58, PT-109
  /\bExecutive Order \d{3,5}\b/g,
  /\bGeneral Order No\. \d\b/g,
  /\bOrder No\. \d{1,2}\b/g,
  /\bPC \d{3,4}\b/g,
  /\bUnit 731\b/g,
  /\b\d{1,2}(?:st|nd|rd|th) parallel\b/g,
  /\bzone (?:plus|minus) \d{1,2}\b/gi, // the navy's zone descriptions: zone plus 12, zone minus 11
  /\b\d{1,2}½? hours? (?:ahead|behind)\b/g, // a zone note's difference between clocks (DATA.md §4's own example)
]
/** Japanese personal names the record uses, to hold the app's voice to family name first. */
export const JAPANESE_NAMES = [
  ['Yamamoto', 'Isoroku'], ['Nagumo', 'Chūichi'], ['Nagumo', 'Chuichi'], ['Yamaguchi', 'Tamon'], ['Kurita', 'Takeo'], ['Ozawa', 'Jisaburō'], ['Ozawa', 'Jisaburo'],
  ['Nishimura', 'Shōji'], ['Itō', 'Seiichi'], ['Fuchida', 'Mitsuo'], ['Genda', 'Minoru'], ['Tomonaga', 'Jōichi'], ['Kobayashi', 'Michio'], ['Iida', 'Fusata'],
  ['Yoshioka', 'Masamitsu'], ['Harada', 'Kaname'], ['Mikawa', 'Gun\'ichi'], ['Mikawa', 'Gunichi'], ['Kondō', 'Nobutake'], ['Kondo', 'Nobutake'], ['Tanaka', 'Raizō'],
  ['Kuribayashi', 'Tadamichi'], ['Suzuki', 'Kantarō'], ['Shigemitsu', 'Mamoru'], ['Umezu', 'Yoshijirō'], ['Seki', 'Yukio'], ['Abe', 'Hiroaki'], ['Yamashita', 'Tomoyuki'],
  ['Tōjō', 'Hideki'], ['Tojo', 'Hideki'], ['Konoye', 'Fumimaro'], ['Konoe', 'Fumimaro'], ['Matsuoka', 'Yōsuke'], ['Nomura', 'Kichisaburō'], ['Kurusu', 'Saburō'],
].map(([family, given]) => ({ family, given }))
const KINDS_WITH_HELD = new Set(['island', 'atoll'])
/** The table's lon/lat box (DATA.md §1). */
const BOUNDS = [78, -42, 205, 56]

/**
 * Whether [lon, lat] falls on the table: inside the projected rectangle the texels cover (DATA.md §2,
 * the manifest's `extent` under its `projection`), or, before the bake has written a manifest, inside
 * the rectangle that encloses the theatre box's projected edges, which is what the bake computes. A
 * place inside the lon/lat box is always on the table; one outside it may still be, in the corners.
 */
export function tableTest(manifest) {
  const proj = new TableProjection(manifest?.projection?.lon0 !== undefined ? manifest.projection : V1_PROJECTION)
  let ex = manifest?.table?.extent
  if (!Array.isArray(ex) || ex.length !== 4) {
    const b = manifest?.table?.bounds || BOUNDS
    ex = [Infinity, Infinity, -Infinity, -Infinity]
    const grow = (lon, lat) => {
      const [x, z] = proj.toWorld([lon, lat])
      ex = [Math.min(ex[0], x), Math.min(ex[1], z), Math.max(ex[2], x), Math.max(ex[3], z)]
    }
    for (let l = b[0]; l <= b[2]; l += 0.25) grow(l, b[1]), grow(l, b[3])
    for (let a = b[1]; a <= b[3]; a += 0.25) grow(b[0], a), grow(b[2], a)
  }
  return (c) => {
    const [x, z] = proj.toWorld(c)
    return x >= ex[0] && x <= ex[2] && z >= ex[1] && z <= ex[3]
  }
}

const cites = (list) => (list || []).map((s) => (typeof s === 'string' ? s : s?.id))
const strings = (...xs) => xs.filter((x) => typeof x === 'string')

export default function check(ctx) {
  const chapters = ctx.load('chapters.json')
  const clocksL = ctx.load('clocks.json')
  const sourcesL = ctx.load('sources.json')
  const placesL = ctx.load('places.json')
  const eventsL = ctx.load('events.json')
  const routesL = ctx.load('routes.json')
  const labelsL = ctx.load('table/labels.json')
  const fronts = ctx.load('fronts/manifest.json')
  const onTable = tableTest(ctx.load('manifest.json'))
  if (![chapters, clocksL, sourcesL, placesL, eventsL, labelsL].some((x) => x !== undefined)) return ctx.warn('gazetteer', 'no gazetteer files here')
  const list = (v) => (Array.isArray(v) ? v : [])

  // --- sources -----------------------------------------------------------------------------
  const sources = checkIds(ctx, list(sourcesL), 'sources.json')
  for (const s of list(sourcesL)) {
    const at = `sources.json ${s.id}`
    for (const k of ['title', 'url', 'access', 'language', 'licence']) if (s[k] === undefined || s[k] === null || s[k] === '') ctx.bad(at, `has no ${k}`)
    if (typeof s.opened !== 'boolean') ctx.bad(at, 'opened must be true or false')
    if (s.access) checkVocab(ctx, at, 'access', s.access, 'sourceAccess')
    if (s.read) checkVocab(ctx, at, 'read', s.read, 'sourceRead')
    else if (s.opened) ctx.warn(at, 'opened: true and no read')
    if (s.language) checkVocab(ctx, at, 'language', s.language, 'sourceLanguage')
    if (s.licence) checkVocab(ctx, at, 'licence', s.licence, 'sourceLicence')
    if (!('ref' in s)) ctx.bad(at, 'has no ref (null where the archive has none)')
    if (typeof s.tertiary !== 'boolean') ctx.bad(at, 'tertiary must be true or false')
    if (s.licence === 'nids-permission' && !s.ref) ctx.bad(at, 'a NIDS-held source is cited by its RefCode: ref is empty')
    if (s.licence === 'copyright-cite-only' && /archive\.org\/details\/husno/i.test(s.url || '')) ctx.bad(at, 'links an unlicensed upload of a copyrighted work')
    if (s.year !== null && s.year !== undefined && !Number.isInteger(s.year)) ctx.bad(at, `year ${s.year} is not a year`)
    ctx.count(s.opened ? 'sources opened' : 'sources not opened')
  }
  const refSource = resolver(ctx, sources, 'source', 'sources.json')
  const opened = (id) => sources.get(id)?.opened === true
  const checkCites = (at, list, { card = true } = {}) => {
    const ids = cites(list)
    for (const id of ids) refSource(at, id)
    if (card && ids.length && !ids.some(opened)) ctx.bad(at, 'cites no source that was opened')
    if (card && !ids.length) ctx.bad(at, 'cites no source')
  }

  // --- clocks ------------------------------------------------------------------------------
  const clocks = checkIds(ctx, list(clocksL), 'clocks.json')
  for (const c of list(clocksL)) {
    const at = `clocks.json ${c.id}`
    if (!c.name) ctx.bad(at, 'has no name')
    if (c.side) checkVocab(ctx, at, 'side', c.side, 'sides')
    else ctx.bad(at, 'has no side')
    if (!c.used) ctx.bad(at, 'says nothing of the documents that used it (used)')
    if (/^[+-]\d/.test(c.name || '') || /\bzone\b.*[+-]\d/.test(c.offset || '')) ctx.bad(at, 'writes the navy form where an ISO offset belongs')
    for (const id of cites(c.sources)) refSource(at, id)
    checkCopy(ctx, `${at} note`, c.note)
    checkNoNumbers(ctx, `${at} note`, c.note, { allow: ALLOW })
  }

  // --- chapters ----------------------------------------------------------------------------
  const chapterMap = checkIds(ctx, list(chapters), 'chapters.json')
  const spans = new Map()
  const C = list(chapters)
  for (const [i, c] of C.entries()) {
    const at = `chapters.json ${c.id}`
    for (const k of ['label', 'short', 'from', 'to', 'keyframe', 'note']) if (!c[k]) ctx.bad(at, `has no ${k}`)
    const a = instant(ctx, `${at} from`, c.from)
    const b = instant(ctx, `${at} to`, c.to)
    if (a !== null && b !== null) {
      if (b <= a) ctx.bad(at, `to (${c.to}) is not after from (${c.from})`)
      spans.set(c.id, [a, b])
    }
    if (i > 0 && C[i - 1].to !== c.from) ctx.bad(at, `does not abut the chapter before (${C[i - 1].id} ends ${C[i - 1].to}, this begins ${c.from})`)
    if (c.keyframe && fronts?.keyframes && !fronts.keyframes.some((k) => k.id === c.keyframe)) ctx.bad(at, `keyframe ${c.keyframe} is not in fronts/manifest.json`)
    checkCites(at, c.sources)
    checkCopy(ctx, `${at} note`, c.note)
    checkVoice(ctx, `${at} note`, c.note)
    checkNoNumbers(ctx, `${at} note`, c.note, { allow: ALLOW })
    checkJapaneseNames(ctx, `${at} note`, c.note, JAPANESE_NAMES)
    if (/[A-Z]/.test((c.label || '').slice(0, 1)) && !/^[A-Z][a-z]+ /.test(c.label)) ctx.warn(at, 'label in the Hawaiian voice begins in lower case')
  }
  const refChapter = resolver(ctx, chapterMap, 'chapter', 'chapters.json')

  // --- places ------------------------------------------------------------------------------
  const places = checkIds(ctx, list(placesL), 'places.json')
  for (const p of list(placesL)) {
    const at = `places.json ${p.id}`
    if (!p.name) ctx.bad(at, 'has no name')
    if (p.kind) checkVocab(ctx, at, 'kind', p.kind, 'placeKinds')
    else ctx.bad(at, 'has no kind')
    if (p.placePrecision) checkVocab(ctx, at, 'placePrecision', p.placePrecision, 'placePrecision')
    else ctx.bad(at, 'has no placePrecision')
    if (p.ja && (typeof p.ja.kanji !== 'string' || typeof p.ja.romaji !== 'string')) ctx.bad(at, 'ja needs kanji and romaji')
    if (p.ja?.verify) ctx.count('ja readings to verify')
    const g = p.geometry
    const coords = []
    const walk = (c) => (Array.isArray(c) && typeof c[0] === 'number' ? coords.push(c) : Array.isArray(c) && c.forEach(walk))
    if (!g || !['Point', 'LineString', 'Polygon', 'MultiPolygon'].includes(g.type)) ctx.bad(at, `geometry ${g?.type} is not a Point, LineString or Polygon`)
    else walk(g.coordinates)
    for (const c of coords) if (!(Number.isFinite(c[0]) && Number.isFinite(c[1]) && Math.abs(c[1]) <= 90)) ctx.bad(at, `coordinate ${JSON.stringify(c)} is not [lon, lat]`)
    if (g?.type === 'Polygon') for (const r of g.coordinates) if (r.length < 4 || r[0][0] !== r[r.length - 1][0] || r[0][1] !== r[r.length - 1][1]) ctx.bad(at, 'a polygon ring is not closed')
    if (coords.length) {
      const [lon, lat] = coords[0]
      const inside = onTable([lon, lat])
      if (p.placePrecision === 'off') {
        // the fixtures mark a place on the table off to exercise the edge marker; counted, not refused
        if (inside) ctx.count('places marked off though the table reaches them')
        if (p.bearing !== undefined && typeof p.bearing !== 'string') ctx.bad(at, 'bearing, where given, is words ("west, toward India")')
        ctx.count('places off the table')
      } else if (!inside) ctx.bad(at, `lies off the table (${lon}, ${lat}) but is not marked off`)
    }
    // held intervals: every island and atoll, and any place that carries them
    if (KINDS_WITH_HELD.has(p.kind) && !Array.isArray(p.held)) ctx.bad(at, `is an ${p.kind} with no held intervals`)
    if (Array.isArray(p.held)) {
      let prevTo = null
      for (const [i, h] of p.held.entries()) {
        const hat = `${at} held[${i}]`
        checkVocab(ctx, hat, 'by', h.by, 'sides')
        const a = instant(ctx, `${hat} from`, h.from)
        const b = h.to ? instant(ctx, `${hat} to`, h.to) : null
        if (a !== null && b !== null && b < a) ctx.bad(hat, `to ${h.to} is before from ${h.from}`)
        if (prevTo !== null && a !== null && a < prevTo) ctx.bad(hat, `begins (${h.from}) before the interval before it ends`)
        if (h.cutOff) {
          const c = instant(ctx, `${hat} cutOff`, h.cutOff)
          if (c !== null && a !== null && (c < a || (b !== null && c > b))) ctx.bad(hat, `cutOff ${h.cutOff} falls outside ${h.from} – ${h.to}`)
          if (h.by !== 'jp') ctx.warn(hat, 'a cut-off garrison that is not Japanese')
          ctx.count('cut-off garrisons')
        }
        if (h.note) checkNoNumbers(ctx, `${hat} note`, h.note, { allow: ALLOW })
        prevTo = b ?? prevTo
      }
      ctx.count('places with held intervals')
    }
    checkCites(at, p.sources, { card: false })
    if (!cites(p.sources).length) ctx.bad(at, 'cites no source')
    ctx.count('places')
  }
  const refPlace = resolver(ctx, places, 'place', 'places.json')

  // --- events ------------------------------------------------------------------------------
  const events = checkIds(ctx, list(eventsL), 'events.json')
  const routes = new Map(list(routesL).filter((r) => r?.id).map((r) => [r.id, r]))
  const frozenBoxes = ctx.frozen.boxes
  const boxEvents = new Map(Object.entries(frozenBoxes).map(([id, b]) => [b.event, id]))
  const cardOnly = new Set(ctx.vocab.cardOnlyKinds)
  for (const e of list(eventsL)) {
    const at = `events.json ${e.id}`
    for (const k of ['title', 'when', 'chapter', 'where', 'kind', 'flag', 'tier', 'sides', 'zoom', 'summary', 'sources', 'confidence', 'tellings', 'routes', 'stops']) if (e[k] === undefined) ctx.bad(at, `has no ${k}`)
    refChapter(at, e.chapter)
    checkVocab(ctx, at, 'kind', e.kind, 'eventKinds')
    checkVocab(ctx, at, 'flag', e.flag, 'eventFlags')
    checkVocab(ctx, at, 'tier', e.tier, 'eventTiers')
    checkVocab(ctx, at, 'zoom', e.zoom || [], 'zooms')
    checkVocab(ctx, at, 'sides', e.sides || [], 'sides')
    for (const s of e.alsoSides || []) if (!ID.test(s)) ctx.bad(at, `alsoSides code “${s}” is not kebab-case`)
    if ((e.alsoSides || []).length) ctx.count('events naming peoples not in the frozen sides')
    for (const k of ['date', 'place', 'numbers']) if (e.confidence?.[k]) checkVocab(ctx, at, `confidence.${k}`, e.confidence[k], 'confidence')
    if (e.ja && (typeof e.ja.kanji !== 'string' || typeof e.ja.romaji !== 'string')) ctx.bad(at, 'ja needs kanji and romaji')
    if (e.ja?.verify) ctx.count('ja readings to verify')
    // DATA.md §10's warning; the fixtures are not content, so there it is only counted
    if (!e.ja && (e.sides || []).includes('jp')) {
      if (ctx.test) ctx.count('events with Japan as a side and no ja')
      else ctx.warn(at, 'has no ja though Japan is a side')
    }

    // when: zone from the clock, instants with offsets agreeing with it, inside the chapter
    const w = e.when
    const span = checkWhen(ctx, at, w, { clocks })
    if (w && !w.clock && !w.zone) ctx.bad(at, 'when names neither a clock nor a zone')
    const clockOff = w?.clock ? clocks.get(w.clock)?.offset : null
    for (const k of ['from', 'to']) {
      const s = w?.[k]
      const m = typeof s === 'string' ? /T\d{2}:\d{2}(?::\d{2})?(Z|[+-]\d{2}:\d{2})$/.exec(s) : null
      if (m && clockOff && zoneMinutes(m[1]) !== zoneMinutes(clockOff)) ctx.bad(at, `when.${k} ${s} is not on its clock ${w.clock} (${clockOff})`)
      if (m && w.zone && !w.clock && zoneMinutes(m[1]) !== zoneMinutes(w.zone)) ctx.bad(at, `when.${k} ${s} is not in its zone ${w.zone}`)
    }
    for (const [i, alt] of (w?.alt || []).entries()) {
      const aat = `${at} when.alt[${i}]`
      if (alt.clock && !clocks.has(alt.clock)) ctx.bad(aat, `clock ${alt.clock} is not in clocks.json`)
      if (!alt.clock && !alt.zone) ctx.bad(aat, 'names neither a clock nor a zone')
      if (alt.zone) checkZone(ctx, aat, alt.zone)
      instant(ctx, `${aat} from`, alt.from, { zone: alt.zone ?? clocks.get(alt.clock)?.offset })
    }
    for (const [i, r] of (w?.readings || []).entries()) checkReading(ctx, `${at} when.readings[${i}]`, r, refSource)
    if (span && e.chapter && spans.has(e.chapter)) {
      const [c0, c1] = spans.get(e.chapter)
      if (span[1] <= c0 || span[0] >= c1) ctx.warn(at, `falls outside its chapter ${e.chapter} (${chapterMap.get(e.chapter).from} – ${chapterMap.get(e.chapter).to})`)
    }
    if (w?.zoneNote) {
      checkCopy(ctx, `${at} zoneNote`, w.zoneNote)
      checkNoNumbers(ctx, `${at} zoneNote`, w.zoneNote, { allow: ALLOW })
    }

    // where
    if (!Array.isArray(e.where)) ctx.bad(at, 'where must be a list')
    else if (!e.where.length) ctx.count('events with no pin')
    for (const [i, x] of (e.where || []).entries()) {
      refPlace(`${at} where[${i}]`, x.place)
      if (typeof x.role !== 'string') ctx.bad(`${at} where[${i}]`, 'has no role')
    }

    // flags, boxes and the card-only kinds
    if (e.flag === 'box' && !e.box) ctx.bad(at, 'flag box with no box')
    if (e.box && e.flag !== 'box' && e.flag !== 'view') ctx.bad(at, `box ${e.box} on a ${e.flag} event`)
    if (e.box) {
      if (!frozenBoxes[e.box]) ctx.bad(at, `box ${e.box} is not a frozen box`)
      else if (frozenBoxes[e.box].event !== e.id) ctx.bad(at, `box ${e.box} belongs to event ${frozenBoxes[e.box].event} (ids.json)`)
      if (!(e.zoom || []).includes('box')) ctx.bad(at, 'has a box but no box zoom')
    } else if ((e.zoom || []).includes('box')) ctx.bad(at, 'has a box zoom but no box')
    if (e.flag === 'view' && !e.box) ctx.bad(at, 'flag view with no box to play')
    if (cardOnly.has(e.kind)) {
      if (e.flag !== 'cards' || e.box) ctx.bad(at, `kind ${e.kind} is always cards, never a box`)
      for (const s of e.stops || []) if (s.zoom && s.zoom !== 'table') ctx.bad(at, `kind ${e.kind} has a stop below the table`)
    }
    if (e.candidate && !['box', 'view'].includes(e.candidate)) ctx.bad(at, `candidate “${e.candidate}” is not box or view`)

    // stops: the table's only; the box's live in battle.json
    for (const [i, s] of (e.stops || []).entries()) {
      const sat = `${at} stops[${i}]`
      // DATA.md §5: table stops only. The fixtures' box event still carries two box stops (t and a
      // camera), which the tour does not read from here; counted, not refused, so the fixtures pass.
      if (s.zoom === 'box' && e.box && s.t) ctx.count('box stops left on an event card (§5 keeps them in battle.json)')
      else if (s.zoom !== 'table') ctx.bad(sat, `zoom ${s.zoom}: an event's stops are table stops (a box's are in its battle.json)`)
      refPlace(sat, s.place)
      if (!s.text) ctx.bad(sat, 'has no text')
    }

    // sources, tellings, routes
    checkCites(at, e.sources)
    for (const [i, t] of (e.tellings || []).entries()) {
      refSource(`${at} tellings[${i}]`, t.source)
      if (typeof t.says !== 'string' || !t.says) ctx.bad(`${at} tellings[${i}]`, 'says nothing')
      checkVoice(ctx, `${at} tellings[${i}]`, t.says, { quote: true })
      if (typeof t.says === 'string' && /\*verify\*/.test(t.says)) ctx.bad(`${at} tellings[${i}]`, "carries a *verify* mark in the card's text; it belongs in notes")
    }
    if (typeof w?.zoneNote === 'string' && /\*verify\*/.test(w.zoneNote)) ctx.bad(`${at} zoneNote`, "carries a *verify* mark in the card's text; it belongs in notes")
    if (routesL !== undefined) for (const id of e.routes || []) if (!routes.has(id)) ctx.bad(at, `route “${id}” is not in routes.json`)
    if (['hiroshima-1945', 'nagasaki-1945'].includes(e.id) && (e.routes || []).length) ctx.bad(at, 'no route is drawn for the atomic missions (R3 D8)')

    // the copy and voice rules, the numbers rule, family names first
    const texts = strings(e.title, e.gloss, e.summary, ...(e.stops || []).map((s) => s.text), w?.zoneNote)
    const card = texts.join(' ')
    for (const [k, t] of [['title', e.title], ['gloss', e.gloss], ['summary', e.summary], ...(e.stops || []).map((s, i) => [`stops[${i}]`, s.text])]) {
      if (typeof t !== 'string') continue
      checkCopy(ctx, `${at} ${k}`, t)
      checkVoice(ctx, `${at} ${k}`, t, { card })
      checkNoNumbers(ctx, `${at} ${k}`, t, { allow: ALLOW })
      checkJapaneseNames(ctx, `${at} ${k}`, t, JAPANESE_NAMES)
      if (/\*verify\*/.test(t)) ctx.bad(`${at} ${k}`, 'carries a *verify* mark in the card\'s text; it belongs in notes')
    }
    if (/\bgave (?:his|her|their) li(?:fe|ves)\b/i.test(card)) ctx.bad(at, 'a glory phrase in the app\'s voice')
    ctx.count('events')
    ctx.count(`events in ${e.chapter}`)
    ctx.count(`events of kind ${e.kind}`)
    if (e.tier === 1) ctx.count('tier-1 events')
  }
  // every frozen box's event exists
  if (eventsL !== undefined) for (const [ev, box] of boxEvents) if (!events.has(ev)) ctx.bad('events.json', `has no ${ev}, the event of the frozen box ${box}`)

  // --- labels --------------------------------------------------------------------------------
  const L = list(labelsL)
  let prev = null
  for (const [i, l] of L.entries()) {
    const at = `table/labels.json[${i}] ${l.text}`
    if (typeof l.text !== 'string' || !l.text) ctx.bad(at, 'has no text')
    checkVocab(ctx, at, 'kind', l.kind, 'labelKinds')
    checkVocab(ctx, at, 'rank', l.rank, 'labelRanks')
    if (!Array.isArray(l.lonlat) || !Number.isFinite(l.lonlat[0]) || !Number.isFinite(l.lonlat[1])) ctx.bad(at, 'lonlat is not [lon, lat]')
    else if (!onTable(l.lonlat)) ctx.bad(at, `lies off the table at ${l.lonlat}`)
    if (l.today !== undefined && l.today !== null && (typeof l.today !== 'string' || l.today === l.text)) ctx.bad(at, 'today is the name today where it differs, or absent')
    if (/[ÜÖÄüöä]/.test(l.text || '')) ctx.bad(at, 'looks like a Natural Earth string (its Ü/Ö for Ū/Ō); labels are the gazetteer\'s')
    if (/^[A-Z\s.]+$/.test(l.text || '') && (l.text || '').length > 3) ctx.bad(at, 'an all-capitals label, as Natural Earth writes them')
    if (l.ja !== undefined && l.ja !== null && typeof l.ja !== 'string') ctx.bad(at, 'ja is the Japanese name as a string')
    // (from and to: the days a name holds, a day each, from before to; DATA.md §3)
    for (const k of ['from', 'to']) if (l[k] !== undefined && !(typeof l[k] === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(l[k]) && Number.isFinite(Date.parse(l[k])))) ctx.bad(at, `${k} is a day (YYYY-MM-DD)`)
    if (typeof l.from === 'string' && typeof l.to === 'string' && !(l.from < l.to)) ctx.bad(at, `from ${l.from} is not before to ${l.to}`)
    if (l.from !== undefined || l.to !== undefined) ctx.count('labels with dates')
    checkCopy(ctx, at, l.text)
    checkVoice(ctx, at, l.text)
    if (prev && (prev.rank > l.rank || (prev.rank === l.rank && prev.text.localeCompare(l.text) > 0))) ctx.bad(at, 'labels.json is not sorted by rank then text (DATA.md §12)')
    prev = l
    ctx.count('labels')
  }
}

/**
 * A timed reading from a source (DATA.md §4): { t (with its offset), sourceClock HHMM, sourceZone,
 * sourceDate?, source }: recompute the source's wall clock from t and say where it disagrees by more
 * than a minute.
 */
export function checkReading(ctx, at, r, refSource) {
  if (!r?.sourceClock) return
  if (r.source && refSource) refSource(at, r.source)
  const m = /^(\d{2}):?(\d{2})$/.exec(String(r.sourceClock))
  if (!m) return ctx.bad(at, `sourceClock “${r.sourceClock}” is not HHMM`)
  if (!r.sourceZone) return ctx.bad(at, 'a sourceClock needs its sourceZone')
  if (!checkZone(ctx, `${at} sourceZone`, r.sourceZone)) return
  if (!/T\d{2}:\d{2}/.test(String(r.t))) return ctx.bad(at, `t ${r.t} has no time to compare the sourceClock with`)
  let ms
  try {
    ms = parseInstant(r.t)
  } catch (e) {
    return ctx.bad(at, e.message)
  }
  const local = new Date(ms + zoneMinutes(r.sourceZone) * 60000)
  const pad = (n) => String(n).padStart(2, '0')
  const want = local.getUTCHours() * 60 + local.getUTCMinutes()
  const got = +m[1] * 60 + +m[2]
  const diff = (((want - got) % 1440) + 1440) % 1440
  if (Math.min(diff, 1440 - diff) > 1) ctx.bad(at, `sourceClock ${m[1]}${m[2]} ${r.sourceZone} is ${pad(local.getUTCHours())}${pad(local.getUTCMinutes())} for t ${r.t}`)
  if (r.sourceDate) {
    const d = `${local.getUTCFullYear()}-${pad(local.getUTCMonth() + 1)}-${pad(local.getUTCDate())}`
    if (d !== r.sourceDate) ctx.bad(at, `sourceDate ${r.sourceDate} is ${d} for t ${r.t}`)
  }
  ctx.count('source readings recomputed')
}

export { spanOf }
