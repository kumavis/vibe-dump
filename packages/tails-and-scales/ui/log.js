// The battle log (DESIGN §1.3). Every line is traced as the match logs it
// (core/journal.js: the trace is the match's replayable fingerprint), then
// shown here as its `log` event plays, the destroyed-unit lines held back
// until an attack ends following it. The newest line is on top, and the log
// keeps the last 80. (F15) Each line knows the entry it was logged in (its
// place among the battle's moves, `data-k`), and a click on it says so
// (app/replay.js's before: the battle as it stood before that move).
export class BattleLog {
  // `listener()`: the ?debug block's trace listener, or null (app/flow.js)
  constructor(list, listener = () => null) {
    this.list = list
    this.listener = listener
  }

  // (F15) `pick(k)`: a line clicked, logged in the battle's k-th move
  wire(pick) {
    this.list.addEventListener('click', (ev) => {
      const e = ev.target.closest?.('.entry[data-k]')
      if (e && this.list.contains(e)) pick(Number(e.dataset.k))
    })
  }

  // A line into the battle log. `at` is the trace's length when it was
  // logged (or flushed); under ?debug the entry carries it (data-at), and
  // the page's trace has reached it before the entry lands (the ?debug
  // block's listener). (F15) `k`, the place among the battle's moves of the
  // entry it was logged in (data-k: a click on the line scrubs to before
  // it); a line with none can't be clicked.
  write(side, html, cls, at, k) {
    const list = this.list
    const e = document.createElement('div')
    e.className = `entry s${side} ${cls}`
    e.innerHTML = html
    if (Number.isInteger(k) && k >= 0) {
      e.dataset.k = k
      e.title = 'Show the battle as it stood before this'
    }
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
