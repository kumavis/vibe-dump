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
  // its following the action (`rig`, view/camera.js), (V1) walks together
  // or one at a time (`player`, view/player.js: kept in this browser), the
  // sound, and the battle log folded; (F10c) and the standing orders' two
  // settings (`standing`, input/standing.js), kept in this browser:
  // Autopilot first (units on autopilot act as their seat's phase opens)
  // and Auto-End (End presses itself, after a 1.5 s countdown on it, once
  // every unit left is under orders).
  wire({ rig, player, standing = null }) {
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
    const KEY = 'tails-and-scales:oneAtATime'
    const batched = (on) => {
      player.batched = on
      $('#batch').classList.toggle('off', !on)
      $('#batch').title = on ? 'Units moved together walk together (click: one at a time)' : 'One unit walks at a time (click: units moved together walk together)'
    }
    let one = false
    try {
      one = localStorage.getItem(KEY) === '1'
    } catch {}
    batched(!one)
    $('#batch').onclick = () => {
      batched(!player.batched)
      try {
        localStorage.setItem(KEY, player.batched ? '0' : '1')
      } catch {}
    }
    const setting = (id, key, prop, on, off) => {
      const el = $(id)
      const show = (v) => {
        if (standing) standing[prop] = v
        el.classList.toggle('off', !v)
        el.title = v ? on : off
      }
      let v = false
      try {
        v = localStorage.getItem(key) === '1'
      } catch {}
      show(v)
      el.onclick = () => {
        show(!standing?.[prop])
        try {
          localStorage.setItem(key, standing?.[prop] ? '1' : '0')
        } catch {}
        // (Auto-End turned off stops its countdown; on, it looks at once)
        if (prop === 'autoEnd') standing?.recount()
      }
    }
    setting('#autoFirst', 'tails-and-scales:autopilotFirst', 'autoFirst', 'Autopilot first: on (units on autopilot act as your phase opens; click: off)', 'Autopilot first: off (click: units on autopilot act as your phase opens)')
    setting('#autoEnd', 'tails-and-scales:autoEnd', 'autoEnd', 'Auto-End: on (End presses itself once every unit left is under orders; click: off)', 'Auto-End: off (click: End presses itself once every unit left is under orders)')
    $('#mute').textContent = isMuted() ? '🔇' : '🔊'
    $('#mute').onclick = () => {
      unlock()
      $('#mute').textContent = toggleMute() ? '🔇' : '🔊'
    }
    $('#logToggle').onclick = () => $('#log').classList.toggle('collapsed')
  }
}
