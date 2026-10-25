// A short note across the bottom of the screen, gone after a few seconds
// ((N2) "History changed: 2 moves undone", app/flow.js).
export class Toast {
  constructor(el) {
    this.el = el
    this.timer = 0
  }

  show(text, ms = 4000) {
    this.el.textContent = text
    this.el.classList.add('show')
    clearTimeout(this.timer)
    this.timer = setTimeout(() => this.el.classList.remove('show'), ms)
  }
}
