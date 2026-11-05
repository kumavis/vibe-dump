// The turn banner (DESIGN §1.3): a phase begun (its seat and phase), a
// round scored (its score), across the middle of the screen, which the
// table waits on before it plays on.
//
// (F11b, DESIGN §4.2.8.1) And the deployment's points banner: both armies'
// totals as the battle's lists field them ("Bushtails 970 pts · 14 units vs
// Serpents 990 pts · 14 units"), a line under the HUD as the deployment
// begins, fading after a few seconds (style.css). The table never waits on
// it, and it takes no pointer, so nothing about the deployment's play or
// its clicks changes; it is built from the setup (app/flow.js), never a
// battle-log line (the trace is pinned).
import { wait } from '../view/clock.js'

export class Banner {
  constructor(el) {
    this.el = el
  }

  // `a` over `b`, `ink` the first line's colour ('' for the stylesheet's);
  // played for `seconds` (game time)
  async show(a, b, ink, seconds) {
    const el = this.el
    el.innerHTML = `<div class="b1">${a}</div><div class="b2">${b}</div>`
    el.querySelector('.b1').style.color = ink
    el.classList.remove('show')
    void el.offsetWidth
    el.classList.add('show')
    await wait(seconds)
  }

  // (N3) gone at once: a replay's jump to another move
  hide() {
    this.el.classList.remove('show')
  }
}

// (F11b) the deployment's points banner
export class ArmyBanner {
  constructor(el) {
    this.el = el
  }

  show(text) {
    const el = this.el
    if (!el) return
    el.textContent = text
    el.classList.remove('show')
    void el.offsetWidth
    el.classList.add('show')
  }

  hide() {
    this.el?.classList.remove('show')
  }
}
