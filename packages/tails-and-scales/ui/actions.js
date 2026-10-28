// The action buttons (DESIGN §1.3, §2.11): End (Begin battle in the
// deployment), Auto, Advance and Shortest move; (F10c) ▶ Go and Orders N;
// (F12) ↶ Undo (app/boot.js wires it: the flow's); (V3c) the spell bar above
// them, a button a spell of the caster picked up (its key, its name, its
// cast and chance, its range and its one line; the one picked lit, one with
// nothing to cast on dimmed). Each press is an intent the
// local human turns into a command (input/human.js), and each button shows,
// reads and goes disabled as the HUD model says (present/hud-model.js: a
// slice's show or label null leaves it as it was). (Each button's handler
// returns why it sent nothing, null once it sent: the ?debug block's hooks
// press them.)
import { sfx, unlock } from '../view/sfx.js'

const $ = (s) => document.querySelector(s)

export class Actions {
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
    this.spellBar(m.spells)
  }

  // (V3c) the spell bar (present/hud-model.js spellBar), drawn again only
  // when what it shows changes
  spellBar(s) {
    const bar = $('#spellbar')
    if (!bar) return
    bar.classList.toggle('hidden', !s)
    const key = s ? JSON.stringify(s) : ''
    if (key === this.spellsShown) return
    this.spellsShown = key
    bar.innerHTML = ''
    if (!s) return
    for (const x of s.list) {
      const b = document.createElement('button')
      b.className = `spell${x.on ? ' on' : ''}${x.can ? '' : ' dim'}${x.ally ? ' ally' : ''}`
      b.dataset.sp = String(x.sp)
      b.title = `${x.name} (${x.key}): cast ${x.cast}+ on 2D6, ${x.pct}% · ${x.range}" · ${x.what}${x.can ? '' : ' · nothing to cast it on now'}`
      b.innerHTML = `<kbd>${x.key}</kbd><b>${x.name}</b><small>${x.cast}+ · ${x.pct}% · ${x.range}"</small><em>${x.what}</em>`
      b.onclick = () => {
        sfx.click()
        return this.human?.pickSpell(x.sp)
      }
      bar.appendChild(b)
    }
  }

  // `human`: the local human (input/human.js)
  wire(human) {
    // ((V3c) the spell bar's buttons pick its spells)
    this.human = human
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
