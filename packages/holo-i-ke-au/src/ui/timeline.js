// The year control: a slider over the era keyframes (time.js), each era a tick
// with its year, and over it the nearest era's label with the year reached,
// "in the time of ʻUmi · c. 1600". Back and Next beside the label walk the
// chapter tour (tour.js), which moves the year as it goes, easing it toward
// each step's date; above the bar, small, is where the tour stands, the
// chapter named as its card names it (card.js). The
// slider and the ticks stay free for wandering, and taking them leaves the
// tour until the next Next.

import { h, $, esc } from './dom.js'
import { icon } from './icons.js'
import { formatYear } from '../time.js'

export class TimelineBar {
  constructor(root, app, ui) {
    this.app = app
    this.ui = ui
    this.tl = app.timeline
    this.tween = null
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
    // every tick carries its year; labelTicks() shows as many as fit (the
    // track may run on past the last to now: time.js)
    this.tl.eras.forEach((e, i) => {
      const left = n > 1 ? (i / this.tl.max) * 100 : 50
      const t = h('button', { class: 'tl-tick', style: `left:${left}%`, title: `${e.label} · ${formatYear(e.year, e.yearPrecision)}`, 'aria-label': e.label, 'data-i': i })
      t.innerHTML = `<i></i><span>${esc(formatYear(e.year, e.yearPrecision).replace('c. ', ''))}</span>`
      ticks.appendChild(t)
    })
    this.labelTicks()
    addEventListener('resize', () => this.labelTicks())
    document.fonts?.ready.then(() => this.labelTicks())
    this.input.addEventListener('input', () => {
      this.tween = null
      this.tl.set(Number(this.input.value))
      this.ui.onScrub()
    })
    ticks.addEventListener('click', (e) => {
      const t = e.target.closest('.tl-tick')
      if (!t) return
      this.easeTo(Number(t.dataset.i), 0.9)
      this.ui.onScrub(Number(t.dataset.i))
    })
    this.nextBtn.addEventListener('click', () => {
      this.el.classList.remove('invite')
      this.ui.tour.next()
    })
    this.backBtn.addEventListener('click', () => this.ui.tour.back())
    this.tl.onChange(() => this.refresh())
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

  easeToYear(y, dur) {
    this.easeTo(this.tl.sAtYear(y), dur)
  }

  /** Skip to the end of the easing (the tools). */
  finish() {
    if (!this.tween) return
    this.tl.set(this.tween.to)
    this.tween = null
  }

  update(dt) {
    const w = this.tween
    if (!w) return
    w.t = Math.min(1, w.t + dt / w.dur)
    const e = w.t < 0.5 ? 2 * w.t * w.t : 1 - Math.pow(-2 * w.t + 2, 2) / 2
    this.tl.set(w.from + (w.to - w.from) * e)
    if (w.t >= 1) this.tween = null
  }

  refresh() {
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

  /** Where the tour stands, and what Back and Next can do from there. */
  refreshTour(tour) {
    // (called as the slider moves while off the tour: only redrawn when it reads differently)
    const key = `${tour.active}:${tour.chapter}:${tour.step}:${tour.stop}:${tour.active ? '' : tour.nearestChapter()}:${tour.atEnd}`
    if (key === this.tourKey) return
    this.tourKey = key
    const at = tour.describe()
    this.backBtn.disabled = !at || tour.atStart
    this.nextBtn.disabled = !at || tour.atEnd
    this.el.classList.toggle('off-tour', !!at && !at.active)
    this.tourEl.classList.toggle('opening', !!at?.opening)
    if (!at) {
      this.tourEl.innerHTML = ''
      return
    }
    this.tourEl.innerHTML = at.active
      ? `<span class="tl-ch">Chapter <b>${at.number}</b> of ${at.of}</span><i>·</i><em>${esc(at.name)}</em>${at.step ? `<i>·</i><span>${esc(at.step)}</span>` : ''}`
      : `<span>Next resumes at ${esc(at.chapter.toLowerCase())}</span><i>·</i><em>${esc(at.name)}</em>`
    this.nextBtn.title = at.active ? 'Next (→ or space)' : `Back to the tour: ${at.chapter.toLowerCase()}, ${at.name}`
  }
}
