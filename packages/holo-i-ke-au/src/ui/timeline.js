// The year control: a slider over the era keyframes (time.js), each era a tick
// with its year, and over it the nearest era's label with the year reached,
// "in the time of ʻUmi · c. 1600". Back and Next beside the label walk the
// chapter tour (tour.js), which moves the year as it goes, easing it toward
// each step's date; above the bar, small, is where the tour stands, the
// chapter named as its card names it (card.js). The
// slider and the ticks stay free for wandering, and taking them leaves the
// tour until the next Next.
//
// While the tour is in the prologue the same bar is the prologue's clock
// (time.js GeoClock): a log scale in millions of years from the oldest stage
// to now, ticked at the round ages it spans, its label the prologue chapter
// nearest and the age reached ("about 2.1 million years ago"). The years'
// track, its ticks and its label are put back as the tour crosses into
// chapter 1, where they were.

import { h, $, esc } from './dom.js'
import { icon } from './icons.js'
import { formatYear, formatAge, formatAgeShort } from '../time.js'

export class TimelineBar {
  constructor(root, app, ui) {
    this.app = app
    this.ui = ui
    this.tl = app.timeline
    this.geo = app.geoClock
    this.tween = null
    // 'years', or 'ma' while the tour is in the prologue
    this.mode = 'years'
    const n = this.tl.n
    this.el = h('div', { class: 'timeline', role: 'group', 'aria-label': 'Time' })
    if (n < 2) this.el.classList.add('single')
    if (n < 1) this.el.hidden = true
    this.el.innerHTML = `
      <div class="tl-tour" aria-live="polite"></div>
      <div class="tl-head">
        <div class="tl-nav">
          <button class="tl-back" aria-label="Back" title="Back (←)">${icon('prev', 16)}</button>
          <button class="tl-next" aria-label="Next" title="Next (→ or space)"><span>Next</span>${icon('next', 16)}</button>
        </div>
        <div class="tl-label"><b class="tl-era"></b><span class="tl-year"></span></div>
      </div>
      <div class="tl-track">
        <div class="tl-rail"><span></span></div>
        <div class="tl-ticks"></div>
        <input class="tl-input" type="range" min="0" max="${this.tl.max}" step="0.001" aria-label="Year" />
      </div>`
    root.appendChild(this.el)
    this.input = $('.tl-input', this.el)
    this.backBtn = $('.tl-back', this.el)
    this.nextBtn = $('.tl-next', this.el)
    this.tourEl = $('.tl-tour', this.el)
    const ticks = $('.tl-ticks', this.el)
    this.ticksEl = ticks
    this.yearTicks()
    addEventListener('resize', () => this.labelTicks())
    document.fonts?.ready.then(() => this.labelTicks())
    this.input.addEventListener('input', () => {
      this.tween = null
      if (this.mode === 'ma') {
        this.geo.setU(Number(this.input.value))
        this.ui.onScrubAge()
        return
      }
      this.tl.set(Number(this.input.value))
      this.ui.onScrub()
    })
    ticks.addEventListener('click', (e) => {
      const t = e.target.closest('.tl-tick')
      if (!t) return
      if (this.mode === 'ma') {
        this.easeToAge(Number(t.dataset.age), 0.9)
        this.ui.onScrubAge(Number(t.dataset.age))
        return
      }
      this.easeTo(Number(t.dataset.i), 0.9)
      this.ui.onScrub(Number(t.dataset.i))
    })
    this.nextBtn.addEventListener('click', () => {
      this.el.classList.remove('invite')
      this.ui.tour.next()
    })
    this.backBtn.addEventListener('click', () => this.ui.tour.back())
    this.tl.onChange(() => this.refresh())
    this.geo?.onChange(() => this.refresh())
    this.refresh()
  }

  /** Every era a tick with its year; labelTicks() shows as many as fit (the track may run on past the last to now: time.js). */
  yearTicks() {
    const n = this.tl.n
    this.ticksEl.innerHTML = ''
    this.tl.eras.forEach((e, i) => {
      const left = n > 1 ? (i / this.tl.max) * 100 : 50
      const t = h('button', { class: 'tl-tick', style: `left:${left}%`, title: `${e.label} · ${formatYear(e.year, e.yearPrecision)}`, 'aria-label': e.label, 'data-i': i })
      t.innerHTML = `<i></i><span>${esc(formatYear(e.year, e.yearPrecision).replace('c. ', ''))}</span>`
      this.ticksEl.appendChild(t)
    })
    this.labelTicks()
  }

  /** The prologue's ticks: the round ages its log track spans, the oldest named in Ma, and now. */
  ageTicks() {
    const g = this.geo
    this.ticksEl.innerHTML = ''
    g.ticks().forEach((a, i) => {
      const label = a === 0 ? 'now' : i === 0 ? `${a} Ma` : String(a)
      const t = h('button', { class: 'tl-tick', style: `left:${g.uAt(a) * 100}%`, title: formatAge(a), 'aria-label': formatAge(a), 'data-age': a })
      t.innerHTML = `<i></i><span>${esc(label)}</span>`
      this.ticksEl.appendChild(t)
    })
    this.labelTicks()
  }

  /** The bar as the years' track, or (in the prologue) as the clock in Ma. */
  setMode(mode) {
    const m = mode === 'ma' && this.geo ? 'ma' : 'years'
    if (m === this.mode) return
    this.mode = m
    this.tween = null
    this.el.classList.toggle('ma', m === 'ma')
    this.el.classList.remove('single')
    if (m === 'ma') {
      this.input.max = '1'
      this.input.setAttribute('aria-label', 'Age')
      this.ageTicks()
    } else {
      this.input.max = String(this.tl.max)
      this.input.setAttribute('aria-label', 'Year')
      if (this.tl.n < 2) this.el.classList.add('single')
      this.yearTicks()
    }
    this.tourKey = null
    this.refresh()
  }

  /**
   * Name as many ticks as fit: the first and the last always, and between
   * them each whose year clears the last one named by a few pixels and
   * leaves room for the end's, so no two labels touch (twelve eras on a
   * phone: every other one, and the one before the end let go). Measured,
   * so it holds at any width and size of type; again as the window changes.
   */
  labelTicks() {
    const spans = [...this.el.querySelectorAll('.tl-tick span')]
    for (const s of spans) s.hidden = false
    const box = spans.map((s) => s.getBoundingClientRect())
    // (not laid out yet: every label stays until there is a width to measure)
    if (!box.some((b) => b.width > 0)) return
    const GAP = 6
    const last = box.length - 1
    let edge = -Infinity
    spans.forEach((s, i) => {
      const b = box[i]
      const keep = i === 0 || i === last || (b.left >= edge + GAP && b.right <= box[last].left - GAP)
      s.hidden = !keep
      if (keep) edge = b.right
    })
  }

  /** Ease the slider to timeline position s over `dur` seconds. */
  easeTo(s, dur = 1) {
    const to = Math.max(0, Math.min(this.tl.max, s))
    this.tween = { from: this.tl.s, to, t: 0, dur }
  }

  /** Ease the prologue's clock to age A (Ma), evenly along its log track. */
  easeToAge(A, dur = 1) {
    this.tween = { from: this.geo.u, to: this.geo.uAt(A), t: 0, dur, ma: true, age: A }
  }

  easeToYear(y, dur) {
    this.easeTo(this.tl.sAtYear(y), dur)
  }

  /** Skip to the end of the easing (the tools). */
  finish() {
    const w = this.tween
    if (!w) return
    if (w.ma) this.geo.set(w.age)
    else this.tl.set(w.to)
    this.tween = null
  }

  update(dt) {
    const w = this.tween
    if (!w) return
    w.t = Math.min(1, w.t + dt / w.dur)
    const e = w.t < 0.5 ? 2 * w.t * w.t : 1 - Math.pow(-2 * w.t + 2, 2) / 2
    if (w.ma) {
      // (landing on the age itself, not its round trip through the log)
      if (w.t >= 1) this.geo.set(w.age)
      else this.geo.setU(w.from + (w.to - w.from) * e)
    } else this.tl.set(w.from + (w.to - w.from) * e)
    if (w.t >= 1) this.tween = null
  }

  refresh() {
    if (this.mode === 'ma') return this.refreshAge()
    const tl = this.tl
    const era = tl.era
    $('.tl-era', this.el).textContent = era ? era.label : ''
    // the year reached, as precise as the nearest keyframe allows (and at
    // the end of a track that runs to now, this year)
    const atNow = tl.reachesNow && tl.s >= tl.max - 1e-3
    $('.tl-year', this.el).textContent = era ? formatYear(tl.year, atNow ? 1 : (era.yearPrecision ?? 1)) : ''
    if (document.activeElement !== this.input) this.input.value = String(tl.s)
    const f = tl.max > 0 ? tl.s / tl.max : 0
    $('.tl-rail span', this.el).style.width = `${f * 100}%`
    const near = Math.round(tl.s)
    for (const t of this.el.querySelectorAll('.tl-tick')) t.classList.toggle('on', Number(t.dataset.i) === near)
  }

  /** The clock: the prologue chapter nearest the age, and the age reached. */
  refreshAge() {
    const g = this.geo
    // (on the tour, its chapter; wandering, the one the age falls in)
    const tour = this.ui.tour
    const ch = tour?.active && tour.current?.prologue ? tour.current : tour?.prologueAt(g.age)
    $('.tl-era', this.el).textContent = ch ? ch.era.label : ''
    $('.tl-year', this.el).textContent = formatAge(g.age)
    if (document.activeElement !== this.input) this.input.value = String(g.u)
    $('.tl-rail span', this.el).style.width = `${g.u * 100}%`
    // (the tick nearest along the track)
    let near = null
    let best = Infinity
    for (const t of this.el.querySelectorAll('.tl-tick')) {
      const d = Math.abs(g.uAt(Number(t.dataset.age)) - g.u)
      if (d < best) [best, near] = [d, t]
    }
    for (const t of this.el.querySelectorAll('.tl-tick')) t.classList.toggle('on', t === near)
  }

  /** Where the tour stands, and what Back and Next can do from there. */
  refreshTour(tour) {
    // (called as the slider moves while off the tour: only redrawn when it reads differently)
    const key = `${tour.active}:${tour.chapter}:${tour.step}:${tour.stop}:${tour.active ? '' : tour.nearestChapter()}:${tour.atEnd}:${tour.atStart}`
    if (key === this.tourKey) return
    this.tourKey = key
    if (this.mode === 'ma') this.refreshAge()
    const at = tour.describe()
    this.backBtn.disabled = !at || tour.atStart
    this.nextBtn.disabled = !at || tour.atEnd
    this.el.classList.toggle('off-tour', !!at && !at.active)
    this.tourEl.classList.toggle('opening', !!at?.opening)
    if (!at) {
      this.tourEl.innerHTML = ''
      return
    }
    // (a prologue of one chapter is just "Prologue")
    const num = at.prologue && at.of < 2 ? '' : ` <b>${esc(at.number)}</b> of ${esc(at.ofLabel)}`
    this.tourEl.innerHTML = at.active
      ? `<span class="tl-ch">${esc(at.word)}${num}</span><i>·</i><em>${esc(at.name)}</em>${at.step ? `<i>·</i><span>${esc(at.step)}</span>` : ''}`
      : `<span>Next resumes at ${esc(at.resume)}</span><i>·</i><em>${esc(at.name)}</em>`
    this.nextBtn.title = at.active ? 'Next (→ or space)' : `Back to the tour: ${at.resume}, ${at.name}`
  }
}
