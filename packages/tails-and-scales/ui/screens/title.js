// The title screen (DESIGN §1.3): the war room. Its mode buttons start a
// battle, its battlefield box and New battlefield pick the board the title
// shows (and the battle is fought on), and a URL's ?races that names no two
// races gets a line on its card saying why the classic matchup is up. (N3)
// The last online battle this browser was in, still going when the page
// last saw it (app/online.js notes it), gets a Continue button: its link,
// without having kept it.
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
    this.continued()
  }

  // (N3) Continue: the last online battle noted (localStorage['ts.last']),
  // if it was going on within the last three days, by its link (the
  // fragment the page routes from: app/boot.js)
  continued() {
    let last = null
    try {
      last = JSON.parse(localStorage.getItem('ts.last') ?? 'null')
    } catch {}
    const ok = !!last && last.status === 'live' && Date.now() - last.at < 3 * 864e5 && /^[A-Za-z0-9]{8,64}$/.test(last.id) && /^[0-9a-z]{8}$/.test(last.dev) && (last.sync === null || /^wss?:\/\/\S+$/.test(last.sync))
    const b = $('#continue')
    b.classList.toggle('hidden', !ok)
    if (!ok) return
    b.querySelector('small').textContent = [typeof last.vs === 'string' ? `against ${last.vs}` : 'watching', Number.isInteger(last.round) ? `round ${last.round}` : ''].filter(Boolean).join(' · ')
    b.onclick = () => {
      unlock()
      sfx.click()
      location.hash = `m=${last.id}&dev=${last.dev}${last.sync ? `&sync=${encodeURIComponent(last.sync)}` : ''}`
    }
  }

  // `S`: the title's state ({ seed }, the board on show); `showTable(seed)`
  // draws a board's table; `start(mode)` a battle (app/flow.js); (N2)
  // `online()` a new online match (app/online.js); (N3) `replay(text)` a
  // replay file's text watched (app/boot.js)
  wire({ S, showTable, start, online, replay }) {
    this.continued()
    const file = $('#replayFile')
    $('#openReplay').onclick = () => {
      unlock()
      sfx.click()
      file.value = ''
      file.click()
    }
    file.onchange = async () => {
      const f = file.files?.[0]
      if (f) replay(await f.text())
    }
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
