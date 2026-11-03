// The toy's screens (TOY.md §3, §4): the start screen with the side choice,
// one line of controls and the label *A toy, not the record.*; the pause; the
// end screen with the numbers, the high score and *Play again* / *Other side*.
// Machines, never people: shot down, sunk, hit, lost.

import { SIDES } from './sides.js'

const PITCH = {
  us: 'A Wildcat over an escort carrier, against Zeros, destroyers, a cruiser and Yamato.',
  jp: 'A Zero over Akagi, against Wildcats, Fletchers, a cruiser and Washington.',
}
const ENDS = {
  time: { title: 'Time!', line: 'Three minutes, and the line held.' },
  boss: { title: 'Held!', line: 'The battleship is sunk.' },
  carrier: { title: 'The carrier is lost', line: 'She went down before the three minutes were up.' },
  lives: { title: 'Out of aircraft', line: 'All three lost.' },
}

const touchy = () => matchMedia?.('(pointer: coarse)')?.matches

export function controlsLine() {
  return touchy() ? 'Stick to steer · <b>fire</b> · <b>drop</b> (bombs, or the torpedo when low over the water)' : 'Steer: mouse, arrows or WASD · Fire: left button or Space · Drop: right button or Shift · Esc pauses'
}

export class Screens {
  constructor(el, toy, root) {
    this.el = el
    this.toy = toy
    this.root = root
    el.addEventListener('click', (e) => {
      const b = e.target.closest('button')
      if (!b) return
      e.stopPropagation()
      const a = b.dataset.act
      if (b.dataset.side) toy.start(b.dataset.side)
      else if (a === 'resume') toy.pause(false)
      else if (a === 'again') toy.start(toy.side)
      else if (a === 'other') toy.start(toy.side === 'jp' ? 'us' : 'jp')
      else if (a === 'leave') toy.leave()
    })
  }

  show(html) {
    this.el.innerHTML = html
    this.el.hidden = false
    this.root.classList.add('screen-up')
    this.el.querySelector('.focus')?.focus({ preventScroll: true })
  }

  hide() {
    this.el.hidden = true
    this.root.classList.remove('screen-up')
  }

  start(side) {
    const best = this.toy.best?.()
    this.show(`<div class="toy-card toy-start">
      <h1>Hold the line</h1>
      <p class="toy-pitch">Three minutes over your carrier. Shoot down the aircraft, bomb and torpedo the ships, and when the battleship comes, knock out her turrets one by one.</p>
      <div class="toy-sides">${['us', 'jp'].map((s) => `<button data-side="${s}" class="side${s === side ? ' focus' : ''}"><b>${SIDES[s].name}</b><span>${PITCH[s]}</span></button>`).join('')}</div>
      <p class="toy-keys">${controlsLine()}</p>
      ${best ? `<p class="toy-best">High score <b>${best}</b></p>` : ''}
      <p class="toy-label">A toy, not the record.</p>
      <div class="toy-row"><button data-act="leave" class="quiet">Back</button></div>
    </div>`)
  }

  pause(on) {
    if (!on) return this.hide()
    this.show(`<div class="toy-card"><h2>Paused</h2><p class="toy-keys">${controlsLine()}</p><div class="toy-row"><button data-act="resume" class="focus">Resume</button><button data-act="again">Restart</button><button data-act="leave" class="quiet">Leave</button></div></div>`)
  }

  /** data: { reason, score, best, newBest, combo, sunk, downed, accuracy, lost, side } */
  end(d) {
    const E = ENDS[d.reason] || ENDS.time
    const other = d.side === 'jp' ? 'us' : 'jp'
    this.show(`<div class="toy-card toy-end">
      <h2>${E.title}</h2>
      <p class="toy-pitch">${E.line}</p>
      <div class="toy-big">${d.score}</div>
      ${d.newBest ? '<p class="toy-new">New high score!</p>' : `<p class="toy-best">High score <b>${d.best}</b></p>`}
      <dl class="toy-nums-end">
        <div><dt>Best combo</dt><dd>×${d.combo}</dd></div>
        <div><dt>Ships sunk</dt><dd>${d.sunk}</dd></div>
        <div><dt>Aircraft shot down</dt><dd>${d.downed}</dd></div>
        <div><dt>Accuracy</dt><dd>${d.accuracy}%</dd></div>
      </dl>
      <div class="toy-row"><button data-act="again" class="focus">Play again</button><button data-act="other">Other side (${SIDES[other].name})</button><button data-act="leave" class="quiet">Leave</button></div>
    </div>`)
  }
}
