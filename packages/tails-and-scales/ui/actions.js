// The action buttons (DESIGN §1.3, §2.11): End (Begin battle in the
// deployment), Auto, Advance and Shortest move. Each press is an intent the
// local human turns into a command (input/human.js), and each button shows,
// reads and goes disabled as the HUD model says (present/hud-model.js: a
// slice's show or label null leaves it as it was). (Each button's handler
// returns why it sent nothing, null once it sent: the ?debug block's hooks
// press them.)
import { sfx, unlock } from '../view/sfx.js'

const $ = (s) => document.querySelector(s)

export class Actions {
  render(m) {
    const end = $('#endPhase'), auto = $('#autoPhase'), adv = $('#advance')
    end.style.display = m.end.show ? '' : 'none'
    auto.style.display = m.auto.show ? '' : 'none'
    $('#closestSpot').style.display = m.shortest.show ? '' : 'none'
    if (m.end.label !== null) end.textContent = m.end.label
    end.disabled = m.end.busy
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
    // Auto: the AI plays out the rest of the phase for the seat
    $('#autoPhase').onclick = () => human.auto()
    // Advance: a D6 more inches for the unit picked up
    $('#advance').onclick = () => human.advanceSel()
  }
}
