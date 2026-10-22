// The table's clock (ENGINEERING.md §4, DESIGN.md §5.5): a slider over the
// WarClock's `s`, the ten-year prologue in its first tenth and the war's
// days linear after, each chapter a tick at its first day with its short
// name, the years marked under the rail, and over it the chapter's name and
// the date reached ("The turn · 4 June 1942"). Back and Next beside it walk
// the chapter tour (tour.js), which moves the date as it goes, easing it
// toward each step's; above the bar, small, the pill says where the tour
// stands ("Chapter 3 of 7 · The turn · 2 of 9"), as the chapter's card names
// it. The slider and the ticks stay free for wandering, and taking them
// leaves the tour until the next Next. While a box is open the bar is hidden
// (ui.js): the box has its own clock in the HUD.
//
// Adapted from holo-i-ke-au's ui/timeline.js (b480c27): the DOM, the pill,
// Back and Next and the easing are kept; the eras' evenly spaced ticks became
// the chapters' dated ones (WarClock.sAt), the years became dates in ms.

import { h, $, esc } from './dom.js'
import { icon } from './icons.js'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

/**
 * "4 June 1942" for ms UTC, read in `zone` (±HH:MM; UTC when none). The
 * table's date is a day read in UTC (ENGINEERING §9's #date); while the tour
 * stands on an event the clock reads in that event's own zone, as its card
 * does, so a Tokyo-time day is not printed as the UTC day before.
 */
export function dayLabel(ms, zone = null) {
  const m = zone ? /^([+-])(\d{2}):(\d{2})$/.exec(zone) : null
  const off = m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) * 60000 : 0
  const d = new Date(ms + off)
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

/** A chapter's name as the clock and the pill print it. */
export const chapterShort = (c) => c.short || String(c.label || c.id).replace(/^the /, '').replace(/^./, (m) => m.toUpperCase())

export class TimelineBar {
  constructor(root, app, ui) {
    this.app = app
    this.ui = ui
    this.clock = app.clock
    this.tween = null
    // the zone the date reads in: the tour's event's, or none (UTC)
    this.zone = null
    const C = this.clock.chapters
    this.el = h('div', { class: 'timeline', role: 'group', 'aria-label': 'The date' })
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
        <div class="tl-rail"><i class="tl-pro"></i><span></span></div>
        <div class="tl-years"></div>
        <div class="tl-ticks"></div>
        <input class="tl-input" type="range" min="0" max="1" step="0.0001" aria-label="Date" />
      </div>`
    root.appendChild(this.el)
    this.input = $('.tl-input', this.el)
    this.backBtn = $('.tl-back', this.el)
    this.nextBtn = $('.tl-next', this.el)
    this.tourEl = $('.tl-tour', this.el)
    // the prologue's compressed stretch, shaded on the rail
    const pro = this.clock.prologue
    const proEl = $('.tl-pro', this.el)
    if (pro) proEl.style.width = `${this.clock.sAt(pro.toMs) * 100}%`
    else proEl.remove()
    // the chapters' ticks at their first days, labelled where there is room
    const ticks = $('.tl-ticks', this.el)
    const width = Math.min(620, innerWidth - 60)
    let lastRight = -Infinity
    C.forEach((c, i) => {
      const s = this.clock.sAt(c.fromMs)
      const name = chapterShort(c)
      const t = h('button', { class: 'tl-tick', style: `left:${(s * 100).toFixed(3)}%`, title: `${name} · from ${dayLabel(c.fromMs)}`, 'aria-label': name, 'data-i': i, 'data-chapter': c.id })
      const px = s * width
      const w = name.length * 6.2 + 10
      const room = px - w / 2 > lastRight
      if (room) lastRight = px + w / 2
      t.innerHTML = `<i></i>${room ? `<span>${esc(name)}</span>` : ''}`
      ticks.appendChild(t)
    })
    // the years, small, under the rail: the war's from its first January, and the prologue's first
    const years = $('.tl-years', this.el)
    const y0 = new Date(C[0].fromMs).getUTCFullYear()
    const y1 = new Date(C[C.length - 1].toMs).getUTCFullYear()
    const firstWarYear = pro ? new Date(pro.toMs).getUTCFullYear() + 1 : y0 + 1
    const marks = pro ? [y0] : []
    for (let y = firstWarYear; y <= y1; y++) marks.push(y)
    for (const y of marks) {
      const s = this.clock.sAt(Date.UTC(y, 0, 1))
      if (s <= 0.0 && y !== y0) continue
      years.appendChild(h('span', { style: `left:${(s * 100).toFixed(3)}%` }, String(y)))
    }
    this.input.addEventListener('input', () => {
      this.tween = null
      this.clock.setS(Number(this.input.value))
      this.ui.onScrub()
    })
    ticks.addEventListener('click', (e) => {
      const t = e.target.closest('.tl-tick')
      if (!t) return
      // a chapter's tick opens the chapter, as the tour does
      this.el.classList.remove('invite')
      this.ui.tour.goTo(Number(t.dataset.i), -1)
    })
    this.nextBtn.addEventListener('click', () => {
      this.el.classList.remove('invite')
      this.ui.tour.next()
    })
    this.backBtn.addEventListener('click', () => this.ui.tour.back())
    this.clock.onChange(() => this.refresh())
    this.refresh()
  }

  /** Ease the slider to position s over `dur` seconds. */
  easeTo(s, dur = 1) {
    const to = Math.max(0, Math.min(1, s))
    this.tween = { from: this.clock.s, to, t: 0, dur }
  }

  easeToDate(ms, dur) {
    this.easeTo(this.clock.sAt(ms), dur)
  }

  /** Skip to the end of the easing (the tools). */
  finish() {
    if (!this.tween) return
    this.clock.setS(this.tween.to)
    this.tween = null
  }

  update(dt) {
    const w = this.tween
    if (!w) return
    w.t = Math.min(1, w.t + dt / w.dur)
    const e = w.t < 0.5 ? 2 * w.t * w.t : 1 - Math.pow(-2 * w.t + 2, 2) / 2
    this.clock.setS(w.from + (w.to - w.from) * e)
    if (w.t >= 1) this.tween = null
  }

  refresh() {
    const clock = this.clock
    const ms = clock.date
    const c = clock.chapterAt(ms)
    $('.tl-era', this.el).textContent = c ? chapterShort(c) : ''
    $('.tl-year', this.el).textContent = dayLabel(ms, this.zone)
    if (document.activeElement !== this.input) this.input.value = String(clock.s)
    $('.tl-rail span', this.el).style.width = `${clock.s * 100}%`
    const on = c ? clock.chapters.indexOf(c) : -1
    for (const t of this.el.querySelectorAll('.tl-tick')) t.classList.toggle('on', Number(t.dataset.i) === on)
  }

  /** Where the tour stands, and what Back and Next can do from there. */
  refreshTour(tour) {
    // (called as the slider moves while off the tour: only redrawn when it reads differently)
    const key = `${tour.active}:${tour.chapter}:${tour.step}:${tour.stop}:${tour.active ? '' : tour.nearestChapter()}:${tour.atEnd}:${tour.atStart}`
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
      ? `<span class="tl-ch">${at.numbered ? `Chapter <b>${at.number}</b> of ${at.of}` : `<b>${esc(at.chapter)}</b>`}</span>${at.name !== at.chapter ? `<i>·</i><em>${esc(at.name)}</em>` : ''}${at.step ? `<i>·</i><span>${esc(at.step)}</span>` : ''}`
      : `<span>Next resumes at ${esc(at.chapter.toLowerCase())}</span>${at.name !== at.chapter ? `<i>·</i><em>${esc(at.name)}</em>` : ''}`
    this.nextBtn.title = at.active ? 'Next (→ or space)' : `Back to the tour: ${at.chapter.toLowerCase()}, ${at.name}`
  }
}
