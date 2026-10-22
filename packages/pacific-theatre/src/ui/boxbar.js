// The box's bar (ENGINEERING.md §§8–11): while a box is open the table's
// timeline is hidden and this bar takes its place at the foot of the screen.
// Watching: back to the table, the battle's stops (back, where, on), play or
// pause, the watch speed, the briefing (the moments on offer) and the
// Sources and credits. In a moment it stands aside, except at the
// checkpoint, where it offers to keep going or the card. A plain DOM
// template fed by plain objects and raising callbacks, so the UI never
// imports the sim (src/link.js feeds it from Battle).

import { h, esc } from './dom.js'
import { icon } from './icons.js'

const PLAY = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>'
const PAUSE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5.5" width="4" height="13" rx="1"/><rect x="13.5" y="5.5" width="4" height="13" rx="1"/></svg>'

export class BoxBar {
  /** on: { leave, step(dir), play, pause, speed(dir), briefing, credits, keepGoing, card } */
  constructor(root, on) {
    this.on = on
    this.el = h('div', { class: 'boxbar', hidden: '' })
    this.el.innerHTML = `
      <div class="bb-watch">
        <button class="nav bb-leave" title="Back to the table (Esc)">${icon('prev', 16)}<span>The table</span></button>
        <span class="bb-sep"></span>
        <button class="nav bb-prev" aria-label="The stop before" title="The stop before (←)">${icon('prev', 16)}</button>
        <span class="bb-stop"><b class="bb-clock"></b><em class="bb-where"></em></span>
        <button class="nav bb-next" aria-label="The next stop" title="The next stop (→)">${icon('next', 16)}</button>
        <span class="bb-sep"></span>
        <button class="nav bb-play" aria-label="Play or pause"></button>
        <button class="nav bb-speed" title="Watch speed"></button>
        <span class="bb-sep"></span>
        <button class="nav bb-brief" title="The briefing and its moments">${icon('take', 16)}<span>Moments</span></button>
        <button class="nav bb-credits" aria-label="Sources and credits" title="Sources and credits">${icon('sources', 16)}</button>
      </div>
      <div class="bb-check">
        <span class="bb-check-t">Checkpoint</span>
        <button class="nav finish bb-go">Keep going</button>
        <button class="nav bb-card">The card</button>
      </div>`
    root.appendChild(this.el)
    this.$ = (s) => this.el.querySelector(s)
    this.el.addEventListener('click', (e) => {
      const b = e.target.closest('button')
      if (!b) return
      const c = b.classList
      if (c.contains('bb-leave')) on.leave()
      else if (c.contains('bb-prev')) on.step(-1)
      else if (c.contains('bb-next')) on.step(1)
      else if (c.contains('bb-play')) (this.state?.running ? on.pause : on.play)()
      else if (c.contains('bb-speed')) on.speed(e.shiftKey ? -1 : 1)
      else if (c.contains('bb-brief')) on.briefing()
      else if (c.contains('bb-credits')) on.credits()
      else if (c.contains('bb-go')) on.keepGoing()
      else if (c.contains('bb-card')) on.card()
    })
    this.key = ''
  }

  /** state: null (hidden) or { mode: 'watch' | 'moment' | 'checkpoint', clock, where, stop: [i, n], running, scale } */
  set(state) {
    this.state = state
    const key = JSON.stringify(state)
    if (key === this.key) return
    this.key = key
    this.el.hidden = !state || state.mode === 'moment'
    if (!state) return
    this.el.dataset.mode = state.mode
    this.$('.bb-clock').textContent = state.clock || ''
    this.$('.bb-where').textContent = state.where || ''
    const [i, n] = state.stop || [-1, 0]
    this.$('.bb-prev').disabled = !(n && i > 0)
    this.$('.bb-next').disabled = !(n && i < n - 1)
    this.$('.bb-play').innerHTML = state.running ? PAUSE : PLAY
    this.$('.bb-play').title = state.running ? 'Pause' : 'Play'
    this.$('.bb-speed').innerHTML = `<span>×${esc(state.scale ?? 1)}</span>`
  }
}
