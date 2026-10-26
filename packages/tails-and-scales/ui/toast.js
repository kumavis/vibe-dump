// A short note across the bottom of the screen, gone after a few seconds
// ((N2) "History changed: 2 moves undone", app/flow.js).
//
// (F8b) One-time tips (DESIGN §4.2.7's discoverability): tip(name, text)
// shows its note the first time only, on this browser (localStorage
// 'ts.tips', the names seen). Storage that throws or is gone (a private
// window, blocked site data) shows each tip once per page instead, never an
// error. The game's tips (TIPS): 'select' (a seat with more than 10 units
// on its turn), 'pin' (the first group pin), 'order' (the first standing
// order).
const TIPS_KEY = 'ts.tips'

export class Toast {
  constructor(el) {
    this.el = el
    this.timer = 0
    // (the tips seen on this page, whatever the storage says)
    this.seen = new Set()
  }

  show(text, ms = 4000) {
    this.el.textContent = text
    this.el.classList.add('show')
    clearTimeout(this.timer)
    this.timer = setTimeout(() => this.el.classList.remove('show'), ms)
  }

  // The tip `name`, unless this browser has seen it: true if shown.
  tip(name, text = TIPS[name], ms = 6000) {
    if (this.seen.has(name)) return false
    this.seen.add(name)
    let kept = []
    try {
      kept = JSON.parse(localStorage.getItem(TIPS_KEY) ?? '[]')
      if (!Array.isArray(kept)) kept = []
    } catch {}
    if (kept.includes(name)) return false
    try {
      localStorage.setItem(TIPS_KEY, JSON.stringify([...kept, name]))
    } catch {}
    this.show(text, ms)
    return true
  }
}

// the tips' words
export const TIPS = Object.freeze({
  select: 'Shift-drag (▭ on touch) to select a group',
  pin: 'Click the flag (or Enter) to send them',
  order: 'Orders act when you press End, or now with Go',
})
