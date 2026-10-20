// The dice tray (DESIGN §1.3): every roll shown as it is made. A `tray.open`
// event clears it under a title (an attack, a charge, the roll-off), and
// each `dice` event adds a row of dice, coloured by what passed, which the
// table waits on (PACE.dice: longer for more dice) before it plays on.
import { passes } from '../core/rules.js'
import { PACE } from '../present/pace.js'
import { clock, wait } from '../view/clock.js'
import { sfx } from '../view/sfx.js'

const PIPS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8] }
function dieEl(v, cls) {
  const d = document.createElement('div')
  d.className = `die ${cls}`
  for (let i = 0; i < 9; i++) {
    const p = document.createElement('i')
    if (PIPS[v].includes(i)) p.className = 'on'
    d.appendChild(p)
  }
  return d
}

export class Tray {
  constructor(el) {
    this.el = el
  }

  clear(title) {
    this.el.innerHTML = ''
    const t = document.createElement('div')
    t.className = 'tray-title'
    t.textContent = title
    this.el.appendChild(t)
    this.el.classList.add('show')
  }

  // out of sight (a phase begins; a new table)
  hide() {
    this.el.classList.remove('show')
  }

  // `need` 0 means "just show the dice"; save rows colour passes as blocked.
  async row(label, dice, need, { sum = false, pass, note = '', save = false } = {}) {
    sfx.dice(dice.length)
    const row = document.createElement('div')
    row.className = 'tray-row'
    const l = document.createElement('span')
    l.className = 'lbl'
    l.textContent = label
    row.appendChild(l)
    const box = document.createElement('span')
    box.className = 'dice'
    row.appendChild(box)
    const shown = dice.slice(0, 30)
    shown.forEach((v, i) => {
      const cls = need ? (v >= need ? (save ? 'saved' : 'ok') : 'fail') : pass === false ? 'fail' : pass ? 'ok' : 'plain'
      const d = dieEl(v, cls)
      d.style.animationDelay = `${(i * 0.025) / clock.speed}s`
      box.appendChild(d)
    })
    const res = document.createElement('span')
    res.className = 'res'
    if (need) {
      const k = passes(dice, need)
      res.textContent = save ? `${k} saved` : `${k} ✓`
      if (dice.length > 30) res.textContent += ` (of ${dice.length})`
    } else if (sum) {
      res.textContent = note || `= ${dice.reduce((a, b) => a + b, 0)}`
      if (pass === true) res.classList.add('good')
      if (pass === false) res.classList.add('bad')
    }
    row.appendChild(res)
    this.el.appendChild(row)
    while (this.el.children.length > 7) this.el.children[1].remove()
    await wait(PACE.dice(dice.length))
  }
}
