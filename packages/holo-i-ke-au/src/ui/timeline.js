// The year control: a slider over the era keyframes (time.js), each era a tick
// with its year, and over it the nearest era's label with the year reached,
// "in the time of ʻUmi · c. 1600". A play button sweeps forward through the
// eras; the tour (card.js) moves it too, easing toward a stop's year.

import { h, $, esc } from './dom.js'
import { icon } from './icons.js'
import { formatYear } from '../time.js'

export class TimelineBar {
  constructor(root, app) {
    this.app = app
    this.tl = app.timeline
    this.playing = false
    this.tween = null
    const n = this.tl.n
    this.el = h('div', { class: 'timeline', role: 'group', 'aria-label': 'Time' })
    if (n < 2) this.el.classList.add('single')
    if (n < 1) this.el.hidden = true
    this.el.innerHTML = `
      <div class="tl-head">
        <button class="tl-play" aria-label="Play through the eras" title="Play through the eras">${icon('play', 16)}</button>
        <div class="tl-label" aria-live="polite"><b class="tl-era"></b><span class="tl-year"></span></div>
      </div>
      <div class="tl-track">
        <div class="tl-rail"><span></span></div>
        <div class="tl-ticks"></div>
        <input class="tl-input" type="range" min="0" max="${Math.max(0, n - 1)}" step="0.001" aria-label="Year" />
      </div>`
    root.appendChild(this.el)
    this.input = $('.tl-input', this.el)
    this.playBtn = $('.tl-play', this.el)
    const ticks = $('.tl-ticks', this.el)
    // label every tick if there's room, else every other one, and so on
    const every = Math.max(1, Math.ceil((n * 46) / Math.min(620, innerWidth - 60)))
    this.tl.eras.forEach((e, i) => {
      const left = n > 1 ? (i / (n - 1)) * 100 : 50
      const t = h('button', { class: 'tl-tick', style: `left:${left}%`, title: `${e.label} · ${formatYear(e.year, e.yearPrecision)}`, 'aria-label': e.label, 'data-i': i })
      t.innerHTML = `<i></i>${i % every === 0 || i === n - 1 ? `<span>${esc(formatYear(e.year, e.yearPrecision).replace('c. ', ''))}</span>` : ''}`
      ticks.appendChild(t)
    })
    this.input.addEventListener('input', () => {
      this.stop()
      this.tl.set(Number(this.input.value))
    })
    ticks.addEventListener('click', (e) => {
      const t = e.target.closest('.tl-tick')
      if (t) this.easeTo(Number(t.dataset.i), 0.9)
    })
    this.playBtn.addEventListener('click', () => (this.playing ? this.stop() : this.play()))
    addEventListener('keydown', (e) => {
      if (e.target.closest?.('input, textarea')) return
      if (e.key === ',' || e.key === '<') this.easeTo(Math.ceil(this.tl.s - 0.01) - 1, 0.7)
      if (e.key === '.' || e.key === '>') this.easeTo(Math.floor(this.tl.s + 0.01) + 1, 0.7)
    })
    this.tl.onChange(() => this.refresh())
    this.refresh()
  }

  play() {
    if (this.tl.s >= this.tl.max - 0.001) this.tl.set(0)
    this.playing = true
    this.tween = null
    this.playBtn.innerHTML = icon('pause', 16)
    this.playBtn.classList.add('on')
  }

  stop() {
    this.playing = false
    this.playBtn.innerHTML = icon('play', 16)
    this.playBtn.classList.remove('on')
  }

  /** Ease the slider to timeline position s over `dur` seconds. */
  easeTo(s, dur = 1) {
    this.stop()
    const to = Math.max(0, Math.min(this.tl.max, s))
    this.tween = { from: this.tl.s, to, t: 0, dur }
  }

  easeToYear(y, dur) {
    this.easeTo(this.tl.sAtYear(y), dur)
  }

  update(dt) {
    if (this.playing) {
      // about four seconds an era, pausing a moment on each keyframe
      const s = this.tl.s
      const near = Math.abs(s - Math.round(s))
      const speed = 0.25 * (0.3 + 0.7 * Math.min(1, near * 6 + 0.15))
      this.tl.set(s + dt * speed)
      if (this.tl.s >= this.tl.max) this.stop()
    } else if (this.tween) {
      const w = this.tween
      w.t = Math.min(1, w.t + dt / w.dur)
      const e = w.t < 0.5 ? 2 * w.t * w.t : 1 - Math.pow(-2 * w.t + 2, 2) / 2
      this.tl.set(w.from + (w.to - w.from) * e)
      if (w.t >= 1) this.tween = null
    }
  }

  refresh() {
    const tl = this.tl
    const era = tl.era
    $('.tl-era', this.el).textContent = era ? era.label : ''
    // the year reached, as precise as the nearest keyframe allows
    $('.tl-year', this.el).textContent = era ? formatYear(tl.year, era.yearPrecision ?? 1) : ''
    if (document.activeElement !== this.input) this.input.value = String(tl.s)
    const f = tl.max > 0 ? tl.s / tl.max : 0
    $('.tl-rail span', this.el).style.width = `${f * 100}%`
    const near = Math.round(tl.s)
    for (const t of this.el.querySelectorAll('.tl-tick')) t.classList.toggle('on', Number(t.dataset.i) === near)
  }
}
