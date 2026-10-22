// The HUD (DESIGN §1.3, §2.11): the score, the round, the phase and the
// seat whose turn the table shows, and the hint line, put on the page from
// the HUD model (present/hud-model.js); and the HUD's tools (the speed, the
// camera's next view and follow, the sound, the log's fold).
import { clock } from '../view/clock.js'
import { unlock, toggleMute, isMuted } from '../view/sfx.js'

const $ = (s) => document.querySelector(s)

export class Hud {
  render(m) {
    $('#vp0').textContent = m.vp[0]
    $('#vp1').textContent = m.vp[1]
    $('#round').textContent = m.round
    document.querySelectorAll('#phases .ph').forEach((el) => {
      el.classList.toggle('on', el.dataset.k === m.phase)
    })
    $('#sideA').classList.toggle('active', m.active === 0)
    $('#sideB').classList.toggle('active', m.active === 1)
    $('#hint').textContent = m.hint
    $('#hint').style.display = m.hint ? '' : 'none'
  }

  // The tools: the animation speed (1×, 2×, 4×), the camera's next view and
  // its following the action (`rig`, view/camera.js), the sound, and the
  // battle log folded.
  wire({ rig }) {
    const SPEEDS = [1, 2, 4]
    $('#speed').onclick = () => {
      clock.speed = SPEEDS[(SPEEDS.indexOf(clock.speed) + 1) % SPEEDS.length]
      $('#speed').textContent = `⏩ ${clock.speed}×`
    }
    $('#view').onclick = () => rig.nextView()
    $('#follow').onclick = () => {
      rig.follow = !rig.follow
      $('#follow').classList.toggle('off', !rig.follow)
    }
    $('#mute').textContent = isMuted() ? '🔇' : '🔊'
    $('#mute').onclick = () => {
      unlock()
      $('#mute').textContent = toggleMute() ? '🔇' : '🔊'
    }
    $('#logToggle').onclick = () => $('#log').classList.toggle('collapsed')
  }
}
