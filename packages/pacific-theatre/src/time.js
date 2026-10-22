// Time (ENGINEERING.md §4): instants in milliseconds UTC, zones as ISO
// offsets, the table's WarClock and a box's BattleClock.
//
// Replaces holo-i-ke-au's time.js (b480c27) rather than patching it: that one
// kept only eras with a numeric year, read dates to fractional years at month
// resolution, and read a battle time "10:22" as the year 10. This module
// imports nothing, so the sim and the checks use it as it is.
//
// Zones are ISO offsets, minutes east of UTC: +09:00 is Tokyo; the US Navy's
// "zone +12" is -12:00 (its zone description is what you add to local time to
// get Greenwich time, the opposite sign); Hawaiʻi kept -10:30 in 1941. Data
// writes the navy's form only in a clock's name, never in a zone field. Bare
// dates mean the start of that day (month, year) in the zone of the thing
// dated, because a day-precision event in zone +11 belongs to its own civil
// day, not to UTC's. A time must carry its offset: Date.parse would read
// "1942-06-04T04:30" in the viewer's own zone.

export const DAY = 86400000
const HOUR = 3600000
const MINUTE = 60000
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const ISO = /^(\d{4})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}(?:\.\d+)?))?(Z|[+-]\d{2}:\d{2})?)?)?)?$/
const CLOCK = /^(\d{1,2}):(\d{2})(?::(\d{2}(?:\.\d+)?))?$/

/** "+09:00" → 540, "-10:30" → -630, "Z" → 0 (minutes east of UTC). Throws on anything else. */
export function zoneMinutes(z) {
  if (z === 'Z') return 0
  const m = /^([+-])(\d{2}):(\d{2})$/.exec(String(z))
  if (!m || +m[2] > 14 || +m[3] > 59) throw new Error(`zone “${z}”: write it as an ISO offset, e.g. -12:00 for the navy's zone +12`)
  return (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]))
}

/** The parts of an ISO date or instant, validated, and the resolution it is written to. */
function isoParts(s) {
  const m = ISO.exec(String(s))
  if (!m) throw new Error(`“${s}” is not an ISO date (YYYY, YYYY-MM, YYYY-MM-DD) or instant (YYYY-MM-DDTHH:MM[:SS]±HH:MM)`)
  const [, Y, Mo, D, h, mi, se, z] = m
  if (h !== undefined && z === undefined) throw new Error(`“${s}” has a time but no offset: write the zone (Z or ±HH:MM)`)
  const y = +Y
  const mo = Mo === undefined ? 1 : +Mo
  const d = D === undefined ? 1 : +D
  if (mo < 1 || mo > 12) throw new Error(`“${s}”: month ${mo}`)
  const dim = new Date(Date.UTC(y, mo, 0)).getUTCDate()
  if (d < 1 || d > dim) throw new Error(`“${s}”: day ${d}`)
  if (h !== undefined && (+h > 23 || +mi > 59 || (se !== undefined && +se >= 60))) throw new Error(`“${s}”: time out of range`)
  const res = h !== undefined ? 'minute' : D !== undefined ? 'day' : Mo !== undefined ? 'month' : 'year'
  return { y, mo, d, h: h === undefined ? 0 : +h, mi: mi === undefined ? 0 : +mi, se: se === undefined ? 0 : +se, z, res }
}

/**
 * An ISO date or instant → ms UTC. "YYYY", "YYYY-MM", "YYYY-MM-DD" mean the
 * start of that period in `zone` (UTC if none); "YYYY-MM-DDTHH:MM[:SS]" with
 * Z or ±HH:MM is exact, and without an offset throws.
 */
export function parseInstant(s, { zone = null } = {}) {
  const p = isoParts(s)
  const off = p.z !== undefined ? zoneMinutes(p.z) : zone ? zoneMinutes(zone) : 0
  return Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi, 0) + Math.round(p.se * 1000) - off * MINUTE
}

/** The resolution an ISO string is written to: 'year' | 'month' | 'day' | 'minute'. */
export function resolutionOf(s) {
  return isoParts(s).res
}

const ORDER = ['minute', 'hour', 'day', 'month', 'year']

/** ms → its wall-clock parts in a zone. */
function wall(ms, zone) {
  const d = new Date(ms + zoneMinutes(zone ?? 'Z') * MINUTE)
  return { y: d.getUTCFullYear(), mo: d.getUTCMonth(), d: d.getUTCDate(), h: d.getUTCHours(), mi: d.getUTCMinutes(), se: d.getUTCSeconds() }
}

/** The start of the `unit` holding ms, in zone, and the start of the next one. */
function bracket(ms, unit, zone) {
  const off = zoneMinutes(zone ?? 'Z') * MINUTE
  const w = wall(ms, zone)
  let a
  let b
  if (unit === 'minute') {
    a = Date.UTC(w.y, w.mo, w.d, w.h, w.mi) - off
    b = a + MINUTE
  } else if (unit === 'hour') {
    a = Date.UTC(w.y, w.mo, w.d, w.h) - off
    b = a + HOUR
  } else if (unit === 'day') {
    a = Date.UTC(w.y, w.mo, w.d) - off
    b = a + DAY
  } else if (unit === 'month') {
    a = Date.UTC(w.y, w.mo, 1) - off
    b = Date.UTC(w.y, w.mo + 1, 1) - off
  } else {
    a = Date.UTC(w.y, 0, 1) - off
    b = Date.UTC(w.y + 1, 0, 1) - off
  }
  return [a, b]
}

/**
 * [from, to) of a `when` ({ from, to?, precision, zone? }) in ms UTC, widened
 * to whole units of its precision (minute, hour, day, month) or of what the
 * strings are written to, whichever is coarser: a day-precision event of
 * 1942-06-04 in zone -12:00 spans that whole civil day there.
 */
export function spanOf(when) {
  if (!when?.from) throw new Error('a when needs a from')
  const zone = when.zone ?? null
  const unitOf = (s) => {
    const r = resolutionOf(s)
    const p = ORDER.includes(when.precision) ? when.precision : r
    return ORDER.indexOf(p) > ORDER.indexOf(r) ? p : r
  }
  const a = bracket(parseInstant(when.from, { zone }), unitOf(when.from), zone)[0]
  const toS = when.to ?? when.from
  const b = bracket(parseInstant(toS, { zone }), unitOf(toS), zone)[1]
  return [a, Math.max(b, a + MINUTE)]
}

/** "UTC−12", "UTC+9", "UTC−10:30", "UTC" (a real minus sign, as a card prints it). */
export function zoneLabel(zone) {
  const m = zoneMinutes(zone ?? 'Z')
  if (!m) return 'UTC'
  const a = Math.abs(m)
  return `UTC${m < 0 ? '−' : '+'}${Math.floor(a / 60)}${a % 60 ? `:${String(a % 60).padStart(2, '0')}` : ''}`
}

const pad = (n) => String(n).padStart(2, '0')
const dayText = (w) => `${w.d} ${MONTHS[w.mo]} ${w.y}`

/**
 * How a time reads on a card, in the zone of its clock: "4 June 1942, 10:22
 * (UTC−12)", "4–7 June 1942", "June 1942". `when` is a when object or ms UTC;
 * `zone` overrides when.zone; `name` replaces the "(UTC−12)" with a clock's
 * own name.
 */
export function formatWhen(when, { zone, name } = {}) {
  if (typeof when === 'number') when = { at: when, precision: 'minute' }
  const z = zone ?? when.zone ?? 'Z'
  const resOf = (s) => {
    const r = resolutionOf(s)
    const p = ORDER.includes(when.precision) ? when.precision : r
    return ORDER.indexOf(p) > ORDER.indexOf(r) ? p : r
  }
  const a = when.at ?? parseInstant(when.from, { zone: z })
  const resA = when.at !== undefined ? when.precision || 'minute' : resOf(when.from)
  const hasTo = when.to && when.to !== when.from
  const b = hasTo ? parseInstant(when.to, { zone: z }) : null
  const resB = hasTo ? resOf(when.to) : null
  const wa = wall(a, z)
  const timed = (r) => r === 'minute' || r === 'hour'
  const suffix = timed(resA) || (hasTo && timed(resB)) ? ` (${name || zoneLabel(z)})` : ''
  const one = (w, r) => {
    if (r === 'year') return String(w.y)
    if (r === 'month') return `${MONTHS[w.mo]} ${w.y}`
    if (r === 'day') return dayText(w)
    return `${dayText(w)}, ${pad(w.h)}:${pad(r === 'hour' ? 0 : w.mi)}`
  }
  if (!hasTo) return one(wa, resA) + suffix
  const wb = wall(b, z)
  if (timed(resA) && timed(resB) && wa.y === wb.y && wa.mo === wb.mo && wa.d === wb.d) {
    return `${dayText(wa)}, ${pad(wa.h)}:${pad(wa.mi)}–${pad(wb.h)}:${pad(wb.mi)}${suffix}`
  }
  if (resA === 'day' && resB === 'day') {
    if (wa.y === wb.y && wa.mo === wb.mo) return `${wa.d}–${wb.d} ${MONTHS[wa.mo]} ${wa.y}`
    if (wa.y === wb.y) return `${wa.d} ${MONTHS[wa.mo]} – ${wb.d} ${MONTHS[wb.mo]} ${wa.y}`
  }
  if (resA === 'month' && resB === 'month' && wa.y === wb.y) return `${MONTHS[wa.mo]} – ${MONTHS[wb.mo]} ${wa.y}`
  return `${one(wa, resA)} – ${one(wb, resB)}${suffix}`
}

/**
 * The table's time (DESIGN §5.5), owned by App. `s` is the slider, 0..1: the
 * prologue takes [0, prologueShare] and the war's days the rest, linearly, so
 * the ten-year prologue does not take three quarters of the slider. The
 * window of pins and routes is an eighth of the chapter either side, clamped
 * to a week and three weeks (never zero at a chapter's edge, where the tour's
 * first step of every chapter stands), and the whole prologue inside it.
 * chapters: chapters.json (from/to abut; `to` is the next chapter's `from`).
 * keyframes: fronts/manifest.json's, else the chapters' own.
 */
export class WarClock {
  constructor(chapters, { prologueShare = 0.1, keyframes = null, windowMinDays = 7, windowMaxDays = 21 } = {}) {
    if (!chapters?.length) throw new Error('WarClock needs chapters')
    this.chapters = chapters
      .map((c) => ({ ...c, fromMs: parseInstant(c.from), toMs: parseInstant(c.to) }))
      .sort((a, b) => a.fromMs - b.fromMs)
    const C = this.chapters
    const first = C[0]
    const last = C[C.length - 1]
    this.prologue = first.id === 'prologue' && C.length > 1 ? first : null
    this.knots = this.prologue
      ? [
          [0, first.fromMs],
          [prologueShare, first.toMs],
          [1, last.toMs],
        ]
      : [
          [0, first.fromMs],
          [1, last.toMs],
        ]
    this.windowMin = windowMinDays * DAY
    this.windowMax = windowMaxDays * DAY
    const kf = keyframes || [...new Set(C.map((c) => c.keyframe).filter(Boolean))].map((d) => ({ id: d, date: d }))
    this.keyframes = kf.map((k) => ({ ...k, ms: parseInstant(k.date ?? k.id) })).sort((a, b) => a.ms - b.ms)
    this.s = 0
    this.listeners = []
  }

  get start() {
    return this.knots[0][1]
  }

  get end() {
    return this.knots[this.knots.length - 1][1]
  }

  /** ms UTC at slider position s. */
  dateAt(s) {
    const K = this.knots
    const v = Math.max(0, Math.min(1, s))
    for (let i = 0; i + 1 < K.length; i++) {
      const [s0, t0] = K[i]
      const [s1, t1] = K[i + 1]
      if (v <= s1 || i + 2 === K.length) return t0 + ((v - s0) / Math.max(1e-12, s1 - s0)) * (t1 - t0)
    }
    return K[K.length - 1][1]
  }

  /** Slider position of ms UTC, clamped to the ends. */
  sAt(ms) {
    const K = this.knots
    if (ms <= K[0][1]) return 0
    for (let i = 0; i + 1 < K.length; i++) {
      const [s0, t0] = K[i]
      const [s1, t1] = K[i + 1]
      if (ms <= t1) return s0 + ((ms - t0) / Math.max(1, t1 - t0)) * (s1 - s0)
    }
    return 1
  }

  get date() {
    return this.dateAt(this.s)
  }

  setS(s) {
    const v = Math.max(0, Math.min(1, s))
    if (v === this.s) return
    this.s = v
    for (const f of this.listeners) f(this)
  }

  setDate(ms) {
    this.setS(this.sAt(ms))
  }

  /** Calls fn(clock) on every change; returns a function that stops it. */
  onChange(fn) {
    this.listeners.push(fn)
    return () => {
      this.listeners = this.listeners.filter((f) => f !== fn)
    }
  }

  /** The chapter holding ms (the first or last beyond the ends). */
  chapterAt(ms = this.date) {
    const C = this.chapters
    for (const c of C) if (ms >= c.fromMs && ms < c.toMs) return c
    return ms < C[0].fromMs ? C[0] : C[C.length - 1]
  }

  /** [from, to] whose pins and routes show at ms: ±clamp(chapter / 8, 7 d, 21 d); the whole prologue inside it. */
  windowAt(ms = this.date) {
    const c = this.chapterAt(ms)
    if (c === this.prologue) return [c.fromMs, c.toMs]
    const h = Math.min(this.windowMax, Math.max(this.windowMin, (c.toMs - c.fromMs) / 8))
    return [ms - h, ms + h]
  }

  /** The front keyframes either side of ms and how far between them (0..1), for the cross-fade. */
  frontPair(ms = this.date) {
    const K = this.keyframes
    if (!K.length) return { a: null, b: null, t: 0 }
    if (ms <= K[0].ms) return { a: K[0], b: K[0], t: 0 }
    for (let i = 0; i + 1 < K.length; i++) {
      if (ms < K[i + 1].ms) return { a: K[i], b: K[i + 1], t: (ms - K[i].ms) / (K[i + 1].ms - K[i].ms) }
    }
    const z = K[K.length - 1]
    return { a: z, b: z, t: 0 }
  }
}

/**
 * A box's time (DATA.md §9 `clock`), owned by the sim: `t` is seconds since
 * `from`. A battle-clock time "10:22" or "10:22:30" is on the date of `from`
 * in the clock's zone, and "24:07" is seven minutes past midnight the next
 * day (a battle that crosses midnight may write either that or a full ISO
 * instant with its offset).
 */
export class BattleClock {
  constructor({ zone, from, to }) {
    this.zone = zone
    this.off = zoneMinutes(zone) * MINUTE
    this.fromMs = parseInstant(from, { zone })
    this.toMs = parseInstant(to, { zone })
    if (!(this.toMs > this.fromMs)) throw new Error(`clock: to (${to}) is not after from (${from})`)
    const w = wall(this.fromMs, zone)
    this.day0 = Date.UTC(w.y, w.mo, w.d) - this.off // midnight of from's date, in the zone
    this.t = 0
  }

  /** Seconds from `from` to `to`. */
  get duration() {
    return (this.toMs - this.fromMs) / 1000
  }

  /** '10:22' | '10:22:30' | '24:07' | an ISO instant → seconds since `from`. */
  parse(s) {
    if (typeof s === 'number') return s
    const m = CLOCK.exec(String(s).trim())
    if (m) {
      const [, h, mi, se = '0'] = m
      if (+mi > 59 || +se >= 60) throw new Error(`battle time “${s}” out of range`)
      return (this.day0 + ((+h * 60 + +mi) * 60 + +se) * 1000 - this.fromMs) / 1000
    }
    return (parseInstant(s, { zone: this.zone }) - this.fromMs) / 1000
  }

  /** ms UTC at t. */
  utc(t = this.t) {
    return this.fromMs + t * 1000
  }

  /** '10:22' on the clock's wall at t ('10:22:30' with seconds: true). */
  label(t = this.t, { seconds = false } = {}) {
    const w = wall(this.utc(t), this.zone)
    return `${pad(w.h)}:${pad(w.mi)}${seconds ? `:${pad(w.se)}` : ''}`
  }

  /** '4 June 1942' on the clock's wall at t. */
  dateLabel(t = this.t) {
    return dayText(wall(this.utc(t), this.zone))
  }

  /** t clamped into the clock. */
  clamp(t) {
    return Math.max(0, Math.min(this.duration, t))
  }
}
