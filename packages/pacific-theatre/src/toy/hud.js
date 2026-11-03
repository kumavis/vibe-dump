// The toy's HUD (TOY.md §2 "Loud feedback"): DOM over the canvas, fed each
// frame from the world and its events.

import './toy.css'

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

export class ToyHud {
  constructor(root, toy) {
    this.root = root
    this.toy = toy
    root.innerHTML = `
      <div class="toy-reticle" aria-hidden="true"></div>
      <div class="toy-warn" role="status"></div>
      <div class="toy-screen" hidden></div>`
    this.el = {
      reticle: root.querySelector('.toy-reticle'),
      warn: root.querySelector('.toy-warn'),
      screen: root.querySelector('.toy-screen'),
    }
    this.el.screen.addEventListener('click', (e) => {
      const b = e.target.closest('button')
      if (!b) return
      if (b.dataset.side) toy.start(b.dataset.side)
      else if (b.dataset.act === 'resume') toy.pause(false)
      else if (b.dataset.act === 'leave') toy.leave()
    })
  }

  bind(world) {
    this.world = world
  }

  startScreen(side) {
    const s = this.el.screen
    s.hidden = false
    s.innerHTML = `<div class="toy-card"><h1>Hold the line</h1>
      <div class="toy-sides"><button data-side="us"${side === 'us' ? ' class="focus"' : ''}>United States</button><button data-side="jp"${side === 'jp' ? ' class="focus"' : ''}>Japan</button></div></div>`
    s.querySelector('.focus')?.focus()
  }

  pauseScreen(on) {
    const s = this.el.screen
    s.hidden = !on
    if (on) s.innerHTML = `<div class="toy-card"><h2>Paused</h2><div class="toy-sides"><button data-act="resume" class="focus">Resume</button><button data-act="leave">Leave</button></div></div>`
    if (on) s.querySelector('.focus')?.focus()
  }

  hideScreens() {
    this.el.screen.hidden = true
  }

  update(dt, w) {
    const me = w.me
    this.el.warn.textContent = me?.edge ? 'Turning back' : ''
    this.el.warn.classList.toggle('on', !!me?.edge)
    w.events.length = 0
  }

  dispose() {
    this.root.innerHTML = ''
  }
}
export { esc }
