// Time, as the design has it: keyframed eras, not a slider of years.
//
// The timeline runs over era index s (0 .. eras − 1), continuously; the year at
// s is interpolated between the keyframes' years. So the long pre-contact
// centuries and the crowded decades after 1778 each get a fair share of the
// slider, and a position always reads as "in the time of ʻUmi, about 1600"
// first and a number second. Events are dated in years (DATA.md §4), and show
// while their span overlaps the stretch of years around s (half an era either
// side).
//
// The last era may be the present's own: the coda runs from 1970 to now, its
// keyframe year the middle of that. When the last era's span (its year and
// yearPrecision after it) reaches the present, the track runs on past its
// tick to this year, at the spacing of the last two eras, so that a stop
// dated after the era's own year (a restoration of 2017) stands at its year,
// and the end of the timeline is now. Otherwise the track ends at the last
// era's tick, as it always has.

/** The year now, which a timeline whose last era reaches it runs to. */
export const PRESENT = new Date().getFullYear()

/** "1795-04" → 1795.25 (the start of April); a bare "1795" → 1795. */
function parseDate(v, end = false) {
  if (v === undefined || v === null) return null
  if (typeof v === 'number') return v + (end ? 1 : 0)
  const m = String(v).match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/)
  if (!m) return null
  const y = Number(m[1])
  if (m[2]) {
    const mo = Number(m[2]) - 1 + (end ? 1 : 0)
    return y + mo / 12
  }
  return y + (end ? 1 : 0)
}

const SPREAD = { day: 0, month: 0, year: 0, decade: 5, generation: 12, century: 50 }

/** An event's span in fractional years, widened by its precision when it gives only one date. */
export function eventSpan(ev) {
  const w = ev.when || {}
  let a = parseDate(w.from)
  let b = parseDate(w.to ?? w.from, true)
  if (a === null && b === null) return null
  if (a === null) a = b - 1
  if (b === null) b = a + 1
  const s = SPREAD[w.precision] ?? 0
  if (s && b - a <= 1.01) {
    a -= s
    b += s
  }
  return [a, b]
}

/** When an event begins, in fractional years: its `when.from` as written, not widened by its precision. */
export function eventStart(ev) {
  const w = ev.when || {}
  return parseDate(w.from) ?? parseDate(w.to)
}

const APPROX = ['generation', 'century', 'decade']

/** The year an event goes by in a list: "1893", or "c. 1100" when the date is a generation's guess. */
export function eventYear(ev) {
  const y = eventStart(ev)
  if (y === null) return ''
  return formatYear(Math.floor(y), APPROX.includes(ev.when?.precision) ? 10 : 1)
}

/** How an event's date reads on its card. */
export function formatWhen(ev) {
  const w = ev.when || {}
  const fmt = (v) => {
    const m = String(v ?? '').match(/(-?\d{1,4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/)
    if (!m) return String(v ?? '')
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const y = Number(m[1])
    const ys = y < 0 ? `${-y} BCE` : String(y)
    if (m[3]) return `${Number(m[3])} ${months[Number(m[2]) - 1]} ${ys}`
    if (m[2]) return `${months[Number(m[2]) - 1]} ${ys}`
    return ys
  }
  const approx = APPROX.includes(w.precision) ? 'c. ' : ''
  if (!w.to || w.to === w.from) return `${approx}${fmt(w.from)}`
  return `${approx}${fmt(w.from)} – ${fmt(w.to)}`
}

export class Timeline {
  constructor(eras, { now = PRESENT } = {}) {
    this.eras = [...eras].filter((e) => Number.isFinite(e.year)).sort((a, b) => a.year - b.year)
    this.s = 0
    this.listeners = []
    // the year the track ends at: the last era's, or now when that era reaches it
    const E = this.eras
    const last = E.at(-1)
    this.end = last ? last.year : 1800
    this.tail = 0
    if (E.length > 1 && last.year < now && last.year + (last.yearPrecision ?? 0) >= now) {
      this.end = now
      // (the track past the last tick, in eras, at the last spacing: yearAt carries on at it)
      this.tail = (now - last.year) / Math.max(1e-6, last.year - E.at(-2).year)
    }
  }

  get n() {
    return this.eras.length
  }

  /** The track's end: the last era's tick, or a little past it where the track runs on to now. */
  get max() {
    return Math.max(0, this.n - 1 + this.tail)
  }

  /** Whether the track runs past its last tick to the present. */
  get reachesNow() {
    return this.tail > 0
  }

  /** The era whose tick is nearest position s. */
  eraAt(s) {
    return this.eras[Math.round(Math.max(0, Math.min(this.n - 1, s)))] || null
  }

  /** Year at timeline position s; beyond the ends it carries on at the end spacing. */
  yearAt(s) {
    const E = this.eras
    if (!E.length) return 1800
    if (E.length === 1) return E[0].year + s * 50
    if (s <= 0) return E[0].year + s * (E[1].year - E[0].year)
    if (s >= E.length - 1) return E[E.length - 1].year + (s - E.length + 1) * (E[E.length - 1].year - E[E.length - 2].year)
    const i = Math.floor(s)
    return E[i].year + (s - i) * (E[i + 1].year - E[i].year)
  }

  /** Timeline position of a year (the inverse of yearAt, clamped to the ends). */
  sAtYear(y) {
    const E = this.eras
    if (E.length < 2) return 0
    if (y <= E[0].year) return 0
    for (let i = 0; i + 1 < E.length; i++) {
      if (y <= E[i + 1].year) return i + (y - E[i].year) / Math.max(1e-6, E[i + 1].year - E[i].year)
    }
    // (past the last tick, as far as the track runs)
    const n = E.length - 1
    return Math.min(this.max, n + (y - E[n].year) / Math.max(1e-6, E[n].year - E[n - 1].year))
  }

  get year() {
    return this.yearAt(this.s)
  }

  /** The keyframe nearest the current position. */
  get era() {
    return this.eraAt(this.s)
  }

  /** The two keyframes either side and how far between them (for the overlay's crossfade). */
  get pair() {
    const last = Math.max(0, this.n - 1)
    const s = Math.max(0, Math.min(last, this.s))
    const a = Math.floor(s)
    const b = Math.min(last, a + 1)
    return { a: this.eras[a], b: this.eras[b], t: s - a }
  }

  /** The stretch of years whose events show now: half an era either side. */
  get window() {
    return [this.yearAt(this.s - 0.5), this.yearAt(this.s + 0.5)]
  }

  set(s) {
    const v = Math.max(0, Math.min(this.max, s))
    if (v === this.s) return
    this.s = v
    for (const f of this.listeners) f(this)
  }

  setYear(y) {
    this.set(this.sAtYear(y))
  }

  onChange(f) {
    this.listeners.push(f)
  }
}

/** "c. 1600", "1795": how the year of an era reads beside its label. */
export function formatYear(y, precision = 1) {
  const r = Math.round(y)
  const ys = r < 0 ? `${-r} BCE` : String(r)
  return precision >= 10 ? `c. ${ys}` : ys
}
