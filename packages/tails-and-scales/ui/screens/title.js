// The title screen (DESIGN §1.3): the war room. Its mode buttons start a
// battle, its battlefield box and New battlefield pick the board the title
// shows (and the battle is fought on), and a URL's ?races that names no two
// races gets a line on its card saying why the classic matchup is up. (N3)
// The last online battle this browser was in, still going when the page
// last saw it (app/online.js notes it), gets a Continue button: its link,
// without having kept it. (V2) Three settings under the replay link: Figures
// (the figure style drawn, view/models/cache.js: 'new' or 'classic'; a click
// keeps the other and reloads the page, which builds every figure in it),
// Quality (view/stage.js's: auto, high, medium or low, each click the next,
// drawn at once, as a tap on the perf overlay does) and Perf overlay
// (ui/perf.js: on or off at once, as the battle's 📈).
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

  // (F6) out of the way of the battle-setup panel, the battle not yet on
  away() {
    $('#title').classList.add('hidden')
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
  // draws a board's table; `start(mode)` a mode's battle ((F6) through the
  // battle-setup panel: app/boot.js); (N2)
  // `online()` a new online match (app/online.js); (N3) `replay(text)` a
  // replay file's text watched (app/boot.js); (V2) `figures` the figure
  // style ({ style, styles, choose(style) }: app/boot.js keeps the choice and
  // reloads), `quality` the quality ({ listen(fn(label)), next() }: app/
  // boot.js keeps it and draws it) and `perf` the perf overlay (ui/perf.js)
  wire({ S, showTable, start, online, replay, figures = null, quality = null, perf = null }) {
    this.continued()
    if (figures) {
      const b = $('#figures'), next = figures.styles[(figures.styles.indexOf(figures.style) + 1) % figures.styles.length]
      b.textContent = `🎨 Figures: ${figures.style}`
      b.title = `The figures drawn: ${figures.style} (click: ${next}; the page reloads)`
      b.onclick = () => figures.choose(next)
    }
    if (quality) {
      const b = $('#qualityTitle')
      quality.listen((label) => (b.textContent = `⚙️ Quality: ${label}`))
      b.title = 'How the table is drawn: auto (medium on a touch screen, else high), high, medium or low (click: the next)'
      b.onclick = () => {
        unlock()
        sfx.click()
        quality.next()
      }
    }
    if (perf) {
      const b = $('#perfTitle')
      perf.listen((on) => (b.textContent = `📈 Perf overlay: ${on ? 'on' : 'off'}`))
      b.title = 'The frame rate, frame time, draw calls and triangles over the table (click: on or off)'
      b.onclick = () => {
        unlock()
        sfx.click()
        perf.toggle()
      }
    }
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
