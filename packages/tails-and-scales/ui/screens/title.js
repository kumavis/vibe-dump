// The title screen (DESIGN §1.3): the war room. Its mode buttons start a
// battle, its battlefield box and New battlefield pick the board the title
// shows (and the battle is fought on), and a URL's ?races that names no two
// races gets a line on its card saying why the classic matchup is up.
import { sfx, unlock } from '../../view/sfx.js'

const $ = (s) => document.querySelector(s)

export class TitleScreen {
  // a line on the title card, above the mode buttons
  note(text) {
    const note = document.createElement('p')
    note.className = 'small'
    note.textContent = text
    $('#title .modes').before(note)
  }

  // the battle is on: the title away, the HUD up (the battle log folded on
  // a narrow screen)
  hide() {
    $('#title').classList.add('hidden')
    document.body.classList.add('playing')
    if (innerWidth < 700) $('#log').classList.add('collapsed')
  }

  show() {
    $('#title').classList.remove('hidden')
    document.body.classList.remove('playing')
  }

  // `S`: the title's state ({ seed }, the board on show); `showTable(seed)`
  // draws a board's table; `start(mode)` a battle (app/flow.js); (N2)
  // `online()` a new online match (app/online.js)
  wire({ S, showTable, start, online }) {
    $('#online').onclick = () => {
      unlock()
      sfx.click()
      online()
    }
    $('#seed').value = S.seed
    $('#reroll').onclick = () => {
      S.seed = (Math.random() * 1e6) | 0
      $('#seed').value = S.seed
      showTable(S.seed)
    }
    $('#seed').onchange = () => {
      // (the table first: should it throw, S.seed still names the one on
      // show)
      const seed = (Number($('#seed').value) || 1) >>> 0
      showTable(seed)
      S.seed = seed
      $('#seed').value = seed
    }
    document.querySelectorAll('[data-mode]').forEach((b) => {
      b.onclick = () => {
        unlock()
        sfx.click()
        start(b.dataset.mode)
      }
    })
  }
}
