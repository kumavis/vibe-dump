// The box's bar (ENGINEERING.md §§8–11, ROUND-2.md §1.1–1.2, §5): while a
// box is open the table's timeline is hidden and this bar takes its place at
// the foot of the screen.
//
// Watching: back to the table, the battle's stops (back, where, on), the
// stop strip (the clock's span with a tick for each stop and a mark for each
// of the record's turning points, the bookmarks: hover gives the title, a
// click takes it; a click on the strip itself goes to that time), play or
// pause, the speed, Units (the unit list), the briefing, the setting
// (Assisted or Pilot) and the Sources and credits.
//
// While a unit is held: Give the controls back (Release), the station bar
// (the unit's stations, the one held marked; Tab cycles them, in link.js),
// the clock and the strip, the speed list for the unit's kind (×0.5, ×1, ×2
// for an aircraft in Assisted), the setting and Units. At a bookmark's
// checkpoint it offers to keep going or the card, as before.
//
// On a phone (style.css's phone layout: 700 px wide or less, or a coarse
// pointer) the held bar is one row at the top: the clock at its left end,
// Release, the stations as pills and a ⋯ that opens the rest (the speeds,
// the setting, Units and the strip with its bookmarks) as a sheet beneath
// it. The bar says where it stands to the box's HUD and touch controls,
// which share the screen with it, through three variables on the document
// (--pt-head: the line under a bar at the top; --pt-head-end: its right
// edge; --pt-foot: the height of a bar at the foot).
//
// A plain DOM template fed by plain objects and raising callbacks, so the UI
// never imports the sim (src/link.js feeds it from Battle).

import { h, esc } from './dom.js'
import { icon } from './icons.js'
import { ASSIST, ASSIST_LABEL } from './roles.js'

const PLAY = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>'
const PAUSE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5.5" width="4" height="13" rx="1"/><rect x="13.5" y="5.5" width="4" height="13" rx="1"/></svg>'
const MORE = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><circle cx="5.5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="18.5" cy="12" r="1.8"/></svg>'
const scaleText = (v) => `×${v === 0.5 ? '½' : v}`

export class BoxBar {
  /**
   * on: { leave, step(dir), play, pause, speed(dir), setSpeed(v), briefing, credits, keepGoing, card,
   *       units, station(name), release, assist(value), take(momentId), goStop(i), scrub(t) }
   */
  constructor(root, on) {
    this.on = on
    this.el = h('div', { class: 'boxbar', hidden: '' })
    this.el.innerHTML = `
      <div class="bb-watch">
        <button class="nav bb-leave" title="Back to the table (Esc)">${icon('prev', 16)}<span>The table</span></button>
        <button class="nav finish bb-release" title="Give the controls back (Backspace)">${icon('release', 16)}<span>Release</span></button>
        <span class="bb-sep bb-sep-a"></span>
        <div class="bb-stations" role="radiogroup" aria-label="Stations"></div>
        <button class="nav bb-prev" aria-label="The stop before" title="The stop before (←)">${icon('prev', 16)}</button>
        <span class="bb-stop"><b class="bb-clock"></b><em class="bb-where"></em><em class="bb-note"></em></span>
        <button class="nav bb-next" aria-label="The next stop" title="The next stop (→)">${icon('next', 16)}</button>
        <button class="nav bb-more" aria-label="More: the speed, the setting, Units and the clock" aria-expanded="false" title="The speed, the setting, Units and the clock">${MORE}</button>
        <div class="bb-sheet">
          <div class="bb-sheet-head"></div>
          <div class="bb-strip" aria-label="The battle's clock, its stops and the record's turning points">
            <div class="bb-track"><div class="bb-fill"></div><div class="bb-marks"></div><div class="bb-now"></div></div>
            <div class="bb-tip" hidden></div>
          </div>
          <span class="bb-sep"></span>
          <button class="nav bb-play" aria-label="Play or pause"></button>
          <button class="nav bb-speed" title="Watch speed"></button>
          <div class="bb-speeds" role="radiogroup" aria-label="Speed"></div>
          <span class="bb-sep"></span>
          <button class="nav bb-units" title="Units (L)">${icon('units', 16)}<span>Units</span></button>
          <button class="nav bb-brief" title="The briefing and the record’s turning points">${icon('take', 16)}<span>Briefing</span></button>
          <div class="assist bb-assist" role="radiogroup" aria-label="Flying"><span class="bb-lab" aria-hidden="true">Flying</span>${ASSIST.map((a) => `<button class="as-opt" role="radio" data-assist="${a}" title="${a === 'assisted' ? 'Assisted flight holds the aircraft for you' : 'Pilot is the real thing'}">${esc(ASSIST_LABEL[a])}</button>`).join('')}</div>
          <button class="nav bb-credits" aria-label="Sources and credits" title="Sources and credits">${icon('sources', 16)}</button>
        </div>
      </div>
      <div class="bb-check">
        <span class="bb-check-t">Checkpoint</span>
        <button class="nav finish bb-go">Keep going</button>
        <button class="nav bb-card">The card</button>
      </div>`
    root.appendChild(this.el)
    this.$ = (s) => this.el.querySelector(s)
    this.tip = this.$('.bb-tip')
    this.el.addEventListener('click', (e) => {
      const b = e.target.closest('button')
      const track = e.target.closest('.bb-track')
      if (!b && track) return this.scrubAt(e)
      if (!b) return
      const c = b.classList
      // (the sheet a phone's ⋯ opens closes once one of its choices is made, except a speed or the setting, which show their effect in it)
      if (c.contains('bb-more')) return this.sheet(!this.el.classList.contains('sheet'))
      if (this.el.classList.contains('sheet') && !b.dataset.scale && !b.dataset.assist && !b.dataset.station) this.sheet(false)
      if (c.contains('bb-leave')) on.leave()
      else if (c.contains('bb-release')) on.release?.()
      else if (c.contains('bb-prev')) on.step(-1)
      else if (c.contains('bb-next')) on.step(1)
      else if (c.contains('bb-play')) (this.state?.running ? on.pause : on.play)()
      else if (c.contains('bb-speed')) on.speed(e.shiftKey ? -1 : 1)
      else if (b.dataset.scale) on.setSpeed?.(Number(b.dataset.scale))
      else if (b.dataset.station) on.station?.(b.dataset.station)
      else if (b.dataset.assist) on.assist?.(b.dataset.assist)
      else if (b.dataset.take) on.take?.(b.dataset.take)
      else if (b.dataset.stop) on.goStop?.(Number(b.dataset.stop))
      else if (c.contains('bb-units')) on.units?.()
      else if (c.contains('bb-brief')) on.briefing()
      else if (c.contains('bb-credits')) on.credits()
      else if (c.contains('bb-go')) on.keepGoing()
      else if (c.contains('bb-card')) on.card()
    })
    // a mark's title on hover and on focus (the strip's own tooltip: the native one is slow and small)
    const show = (e) => {
      const m = e.target.closest?.('.bb-mark, .bb-tick')
      if (!m) return
      this.tip.textContent = m.dataset.tip || ''
      this.tip.hidden = false
      const r = m.getBoundingClientRect()
      const s = this.$('.bb-strip').getBoundingClientRect()
      this.tip.style.left = `${Math.round(r.left + r.width / 2 - s.left)}px`
    }
    const hide = (e) => {
      if (e.target.closest?.('.bb-mark, .bb-tick')) this.tip.hidden = true
    }
    const strip = this.$('.bb-strip')
    strip.addEventListener('pointerover', show)
    strip.addEventListener('pointerout', hide)
    strip.addEventListener('focusin', show)
    strip.addEventListener('focusout', hide)
    this.key = ''
    this.marksKey = ''
    this.listsKey = ''
    // a tap outside the bar closes the sheet; the bar's place is told to the HUD and the touch controls when it moves or resizes
    addEventListener('pointerdown', (e) => {
      if (this.el.classList.contains('sheet') && !this.el.contains(e.target)) this.sheet(false)
    }, true)
    this.placed = ''
    this.ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => this.publish()) : null
    this.ro?.observe(this.el)
    addEventListener('resize', () => this.publish())
  }

  /** The phone's sheet (⋯) open or closed. */
  sheet(open) {
    this.el.classList.toggle('sheet', open)
    this.$('.bb-more').setAttribute('aria-expanded', String(open))
  }

  /**
   * Where the bar stands, for the box's HUD and touch controls (scene/hud.js, controls/touch.js): --pt-head is the
   * line under a bar at the top (with a 6 px gap), --pt-head-end the bar's right edge (with 8), --pt-foot the room a
   * bar at the foot takes from the bottom; 0 for the side it is not on, and all three 0 while it is hidden.
   */
  publish() {
    let head = 0
    let end = 0
    let foot = 0
    if (!this.el.hidden) {
      const r = this.el.getBoundingClientRect()
      if (r.height > 0) {
        if (r.top + r.height / 2 < innerHeight / 2) {
          head = Math.ceil(r.bottom + 6)
          end = Math.ceil(r.right + 8)
        } else foot = Math.ceil(innerHeight - r.top)
      }
    }
    const key = `${head},${end},${foot}`
    if (key === this.placed) return
    this.placed = key
    const st = document.documentElement.style
    st.setProperty('--pt-head', `${head}px`)
    st.setProperty('--pt-head-end', `${end}px`)
    st.setProperty('--pt-foot', `${foot}px`)
  }

  /**
   * The strip's marks, once per box (or after a rebuild): duration in battle seconds,
   * stops [{ t, label, text }], bookmarks [{ id, t, title, label, side }].
   */
  setMarks(m) {
    const key = JSON.stringify(m)
    if (key === this.marksKey) return
    this.marksKey = key
    this.marks = m
    const dur = Math.max(1, m?.duration || 1)
    const pct = (t) => `${((Math.max(0, Math.min(dur, t)) / dur) * 100).toFixed(2)}%`
    const ticks = (m?.stops || []).map((s, i) => `<button class="bb-tick" data-stop="${i}" style="left:${pct(s.t)}" data-tip="${esc(`${s.label} · stop ${i + 1}`)}" aria-label="${esc(`Stop ${i + 1}, ${s.label}`)}"></button>`).join('')
    // (bookmarks a few minutes apart would sit on one another: a later one steps up a row, so each can be hovered and pressed)
    const rows = []
    const placed = [...(m?.bookmarks || [])].sort((a, b) => a.t - b.t).map((b) => {
      const at = (Math.max(0, Math.min(dur, b.t)) / dur) * 100
      let r = rows.findIndex((last) => at - last >= 4)
      if (r < 0) r = rows.length < 3 ? rows.length : rows.indexOf(Math.min(...rows))
      rows[r] = at
      return { ...b, row: r }
    })
    const marks = placed.map((b) => `<button class="bb-mark${b.side ? ` ${esc(b.side)}` : ''}" data-take="${esc(b.id)}" style="left:${pct(b.t)};--row:${b.row}" data-tip="${esc(`${b.label} · ${b.title}`)}" aria-label="${esc(`${b.title}, ${b.label}: take the controls`)}"></button>`).join('')
    this.$('.bb-marks').innerHTML = ticks + marks
  }

  scrubAt(e) {
    const tr = this.$('.bb-track').getBoundingClientRect()
    if (!this.marks || !(tr.width > 0)) return
    const u = Math.max(0, Math.min(1, (e.clientX - tr.left) / tr.width))
    this.on.scrub?.(u * this.marks.duration)
  }

  /**
   * state: null (hidden) or { mode: 'watch' | 'held' | 'checkpoint' | 'moment' (hidden), clock, where,
   *   stop: [i, n], running, scale, scales: [..], t, duration, assist, air (a held aircraft),
   *   held: { name, station, stations: [{ name, label }] } | null }
   */
  set(state) {
    this.state = state
    const key = JSON.stringify(state)
    if (key === this.key) return
    this.key = key
    this.el.hidden = !state || state.mode === 'moment'
    if (!state || this.el.dataset.mode !== state.mode) this.sheet(false)
    if (!state) return this.publish()
    const held = state.mode === 'held'
    this.el.dataset.mode = state.mode
    // (the seconds, the speed and a pause show on a phone, where the bar's clock stands in for the HUD's: style.css)
    const sec = state.clockS && state.clock && state.clockS.startsWith(state.clock) ? state.clockS.slice(state.clock.length) : ''
    this.$('.bb-clock').innerHTML = `${esc(state.clock || '')}<span class="bb-sec">${esc(sec)}</span>`
    this.$('.bb-where').textContent = state.where || ''
    this.$('.bb-sheet-head').textContent = held ? state.where || '' : ''
    this.$('.bb-note').textContent = [state.scale != null && state.scale !== 1 ? scaleText(state.scale) : '', state.running === false ? 'paused' : ''].filter(Boolean).join(' · ')
    const [i, n] = state.stop || [-1, 0]
    this.$('.bb-prev').disabled = held || !(n && i > 0)
    this.$('.bb-next').disabled = held || !(n && i < n - 1)
    this.$('.bb-play').innerHTML = state.running ? PAUSE : PLAY
    this.$('.bb-play').title = state.running ? 'Pause' : 'Play'
    const scales = state.scales || []
    // a short list is a row of buttons; watching's long one is the button that cycles it
    const list = scales.length > 1 && scales.length <= 4
    this.$('.bb-speed').hidden = list
    this.$('.bb-speed').innerHTML = `<span>${esc(scaleText(state.scale ?? 1))}</span>`
    const lists = JSON.stringify([scales, state.held?.stations, list])
    if (lists !== this.listsKey) {
      this.listsKey = lists
      this.$('.bb-speeds').innerHTML = list ? scales.map((v) => `<button class="bb-sp" role="radio" data-scale="${v}">${esc(scaleText(v))}</button>`).join('') : ''
      // (a phone's pills carry the station's short name where it has one: Main, AA, Tubes, Sight)
      this.$('.bb-stations').innerHTML = (state.held?.stations || []).map((s) => `<button class="bb-st" role="radio" data-station="${esc(s.name)}" title="${esc(`${s.label}${s.where ? `: ${s.where}` : ''} (Tab)`)}">${s.short && s.short !== s.label ? `<span class="bb-l">${esc(s.label)}</span><span class="bb-s">${esc(s.short)}</span>` : esc(s.label)}</button>`).join('')
    }
    this.$('.bb-speeds').hidden = !list
    for (const b of this.el.querySelectorAll('.bb-sp')) {
      const on = Number(b.dataset.scale) === state.scale
      b.classList.toggle('on', on)
      b.setAttribute('aria-checked', String(on))
    }
    for (const b of this.el.querySelectorAll('.bb-st')) {
      const on = b.dataset.station === state.held?.station
      b.classList.toggle('on', on)
      b.setAttribute('aria-checked', String(on))
      // (a phone's pills scroll where they outrun the row, a destroyer's four at 360 px: the one held brought into view
      // once each time it changes, and left to the hand after that)
      const box = b.parentElement
      if (on && this.inView !== b.dataset.station && box.clientWidth > 0) {
        this.inView = b.dataset.station
        if (box.scrollWidth > box.clientWidth + 1) box.scrollLeft = Math.max(0, Math.min(b.offsetLeft - box.offsetLeft - 8, box.scrollWidth - box.clientWidth))
      }
    }
    if (!held) this.inView = null
    this.$('.bb-stations').hidden = !(held && (state.held?.stations || []).length)
    for (const b of this.el.querySelectorAll('.bb-assist .as-opt')) {
      const on = b.dataset.assist === state.assist
      b.classList.toggle('on', on)
      b.setAttribute('aria-checked', String(on))
    }
    const dur = Math.max(1, state.duration || this.marks?.duration || 1)
    const p = `${((Math.max(0, Math.min(dur, state.t ?? 0)) / dur) * 100).toFixed(2)}%`
    this.$('.bb-fill').style.width = p
    this.$('.bb-now').style.left = p
    this.publish()
  }
}
