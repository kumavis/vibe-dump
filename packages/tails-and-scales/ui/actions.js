// The action buttons (DESIGN §1.3, §2.11): End (Begin battle in the
// deployment), Auto, Advance and Shortest move; (F10c) ▶ Go and Orders N;
// (F12) ↶ Undo (app/boot.js wires it: the flow's). Each press is an intent the
// local human turns into a command (input/human.js), and each button shows,
// reads and goes disabled as the HUD model says (present/hud-model.js: a
// slice's show or label null leaves it as it was). (Each button's handler
// returns why it sent nothing, null once it sent: the ?debug block's hooks
// press them.) ((V3b) The row wraps upward in rows rather than off the
// screen (style.css's #actions: a phone's movement phase holds more buttons
// than a row, and ↶ Undo, the first, went off its left edge), and its height
// is published as --actions-h on the page's root, for what stands on it (the
// group bar; the card and the dice tray on a phone and a narrow screen): a
// ResizeObserver's, so nothing is measured per frame.)
import { sfx, unlock } from '../view/sfx.js'

const $ = (s) => document.querySelector(s)

export class Actions {
  constructor() {
    const el = $('#actions')
    if (!el || typeof ResizeObserver !== 'function') return
    let h = -1
    new ResizeObserver(() => {
      if (el.offsetHeight === h) return
      h = el.offsetHeight
      document.documentElement.style.setProperty('--actions-h', `${h}px`)
    }).observe(el)
  }

  render(m) {
    const end = $('#endPhase'), auto = $('#autoPhase'), adv = $('#advance'), go = $('#goOrders'), ords = $('#ordersN')
    end.style.display = m.end.show ? '' : 'none'
    auto.style.display = m.auto.show ? '' : 'none'
    // (F10c) ▶ Go (N): the standing orders now; Orders N: how many hold one
    if (m.go) {
      go.style.display = m.go.show ? '' : 'none'
      go.textContent = `▶ Go (${m.go.n})`
      go.disabled = m.go.busy
    }
    ords.style.display = m.ordersN ? '' : 'none'
    ords.textContent = `Orders ${m.ordersN}`
    // (F12) ↶ Undo: up beside End in a game played here alone, enabled
    // while there is something of the seat's to take back
    if (m.undo) {
      const undo = $('#undo')
      undo.style.display = m.undo.show ? '' : 'none'
      undo.disabled = m.undo.busy
    }
    $('#closestSpot').style.display = m.shortest.show ? '' : 'none'
    if (m.end.label !== null) end.textContent = m.end.label
    end.disabled = m.end.busy
    // (F3) neutral while units can still act, lit once nothing is left
    end.classList.toggle('ready', m.end.lit)
    // (F10c) Auto-End counting down on it
    end.classList.toggle('counting', !!m.end.counting)
    auto.disabled = m.auto.busy
    adv.disabled = m.advance.busy
    if (m.advance.show !== null) adv.style.display = m.advance.show ? '' : 'none'
    if (m.advance.label !== null) adv.textContent = m.advance.label
  }

  // `human`: the local human (input/human.js)
  wire(human) {
    // End: the deployment done, or the phase over
    $('#endPhase').onclick = () => {
      unlock()
      sfx.click()
      return human.end()
    }
    // Shortest move: the charge ends where the AI's would.
    $('#closestSpot').onclick = () => {
      sfx.click()
      return human.takeShortest()
    }
    // Auto: the AI plays out the rest of the phase for the seat (after its
    // standing orders, F10c)
    $('#autoPhase').onclick = () => human.auto()
    // (F10c) Go: the standing orders now, the phase left open; Orders N:
    // pick up every unit holding one
    $('#goOrders').onclick = () => {
      sfx.click()
      return human.go()
    }
    $('#ordersN').onclick = () => human.standing?.pickOrdered()
    // Advance: a D6 more inches for the unit picked up
    $('#advance').onclick = () => human.advanceSel()
  }
}
