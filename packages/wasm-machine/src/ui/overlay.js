// Cross-pane motion: values flying between the operand stack and locals /
// globals / memory, and the ribbon from an address operand to the bytes it
// touched. A fixed layer above the app; nothing here when motion is off.
import { h, s } from './dom.js'

const EASE = 'cubic-bezier(.3,.7,.2,1)'

export class Overlay {
  constructor() {
    this.svg = s('svg', { class: 'fx-svg', 'aria-hidden': 'true' })
    this.el = h('div', { class: 'fx-layer', 'aria-hidden': 'true' }, this.svg)
    this.live = new Set()
  }

  finishAll() {
    for (const a of this.live) a.finish()
    this.live.clear()
  }

  _track(a, cleanup) {
    this.live.add(a)
    a.onfinish = a.oncancel = () => {
      this.live.delete(a)
      cleanup()
    }
  }

  /** A copy of a value travelling from one rect to another. `hide` is revealed on landing. */
  fly(from, to, { html, cls = '', dur = 280, delay = 0, hide = null } = {}) {
    if (!from || !to || !dur) return
    if (!from.width || !to.width) return // a pane that is not on screen (phone tabs)
    // the ghost has the destination's size, centred on the source
    const x0 = from.left + from.width / 2 - to.width / 2
    const y0 = from.top + from.height / 2 - to.height / 2
    const g = h('div', { class: 'fx-ghost ' + cls, html })
    Object.assign(g.style, { left: x0 + 'px', top: y0 + 'px', width: to.width + 'px', height: to.height + 'px' })
    this.el.appendChild(g)
    if (hide) hide.style.visibility = 'hidden'
    const dx = to.left - x0
    const dy = to.top - y0
    const lift = -Math.min(40, Math.abs(dx) * 0.15 + 10)
    const a = g.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 0.95 },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 + lift}px) scale(1.04)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(1)`, opacity: 0.9 },
    ], { duration: dur, delay, easing: EASE, fill: 'both' })
    this._track(a, () => {
      g.remove()
      if (hide) hide.style.visibility = ''
    })
  }

  /** A curved link from one rect to another that draws in and fades. */
  ribbon(from, to, { dur = 420, cls = '' } = {}) {
    if (!from || !to || !dur) return
    const x1 = from.right
    const y1 = from.top + from.height / 2
    const x2 = to.left + to.width / 2
    const y2 = to.top + to.height / 2
    const mx = (x1 + x2) / 2
    const d = `M${x1} ${y1} C${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
    const p = s('path', { d, class: 'fx-ribbon ' + cls })
    const dot = s('circle', { cx: x2, cy: y2, r: 3, class: 'fx-ribbon-dot ' + cls })
    this.svg.append(p, dot)
    const len = Math.hypot(x2 - x1, y2 - y1) * 1.3 + 20
    p.style.strokeDasharray = len
    const a = p.animate([{ strokeDashoffset: len, opacity: 1 }, { strokeDashoffset: 0, opacity: 1, offset: 0.45 }, { strokeDashoffset: 0, opacity: 0 }], { duration: dur * 1.8, easing: EASE, fill: 'both' })
    dot.animate([{ opacity: 0 }, { opacity: 1, offset: 0.45 }, { opacity: 0 }], { duration: dur * 1.8, fill: 'both' })
    this._track(a, () => {
      p.remove()
      dot.remove()
    })
  }
}
