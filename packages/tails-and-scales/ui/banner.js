// The turn banner (DESIGN §1.3): a phase begun (its seat and phase), a
// round scored (its score), across the middle of the screen, which the
// table waits on before it plays on.
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
