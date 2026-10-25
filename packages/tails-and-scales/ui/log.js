// The battle log (DESIGN §1.3). Every line is traced as the match logs it
// (core/journal.js: the trace is the match's replayable fingerprint), then
// shown here as its `log` event plays, the destroyed-unit lines held back
// until an attack ends following it. The newest line is on top, and the log
// keeps the last 80.
export class BattleLog {
  // `listener()`: the ?debug block's trace listener, or null (app/flow.js)
  constructor(list, listener = () => null) {
    this.list = list
    this.listener = listener
  }

  // A line into the battle log. `at` is the trace's length when it was
  // logged (or flushed); under ?debug the entry carries it (data-at), and
  // the page's trace has reached it before the entry lands (the ?debug
  // block's listener).
  write(side, html, cls, at) {
    const list = this.list
    const e = document.createElement('div')
    e.className = `entry s${side} ${cls}`
    e.innerHTML = html
    const tl = this.listener()
    if (tl) {
      tl.reach(at)
      e.dataset.at = at
    }
    list.prepend(e)
    while (list.children.length > 80) list.lastChild.remove()
  }

  // empty (a new table)
  clear() {
    this.list.innerHTML = ''
  }
}
