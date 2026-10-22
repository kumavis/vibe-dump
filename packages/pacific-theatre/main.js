// Boot (DESIGN.md §5.9): the manifest, the gazetteer and the record, then the
// table pack decoded, then the app and its interface, and four quiet frames
// for the shaders to compile before the curtain lifts. The table's URL
// (#date, #cam) is read once the table can draw; a URL that names a battle
// boots the table first.
//
// The boot screen carries R8 §7.4's lines in both languages and, in its
// footer, the Sources and credits (ENGINEERING §11), readable before anything
// has loaded: the panel is NOTICE.md's own text (src/ui/credits.js); once the
// table is up, the same panel opens as the card's `credits` mode.
//
// Adapted from holo-i-ke-au's main.js (b480c27): the progress bar, the warning
// list and the four frames before the reveal are kept; the island queue,
// patches, districts and land layers are gone.

import { dataBase } from './src/config.js'
import { loadData } from './src/data/load.js'
import { App } from './src/app.js'
import { UI } from './src/ui/ui.js'
import { creditsHTML } from './src/ui/credits.js'
import { link } from './src/link.js'

const boot = document.getElementById('boot')
const bar = boot.querySelector('.boot-bar span')
const stageEl = boot.querySelector('.boot-stage')
const progress = (text, f) => {
  stageEl.textContent = text
  bar.style.width = `${Math.round(f * 100)}%`
}
const warnings = []
const warn = (m) => {
  warnings.push(m)
  console.warn(m)
}

// the boot screen's footer: the credits, before any data
const creditsPanel = boot.querySelector('.boot-credits')
boot.querySelector('.boot-credits-link')?.addEventListener('click', () => {
  if (!creditsPanel.childElementCount) creditsPanel.innerHTML = `<div class="boot-credits-card"><h2>Sources and credits</h2>${creditsHTML(null)}</div>`
  boot.classList.toggle('reading')
})

async function start() {
  const t0 = performance.now()
  progress('reading the record', 0.05)
  const data = await loadData(dataBase(), warn)
  const app = new App(document.getElementById('scene'), data, { warn })
  app.warnings = warnings
  window.__app = app

  progress('laying out the table', 0.25)
  data.table.data = await app.decoder.decode(data.table)
  progress('inking the coasts', 0.85)
  await new Promise((r) => setTimeout(r, 0))
  app.start()
  link(app, new UI(app))
  console.log(`table ready in ${((performance.now() - t0) / 1000).toFixed(1)} s`)

  // let a few frames land (shaders compile) before lifting the curtain; one
  // reading the credits keeps them, as the card's panel
  progress('', 1)
  let frames = 0
  const reveal = () => {
    if (++frames < 4) return requestAnimationFrame(reveal)
    app.ready = true
    app.fromUrl()
    if (boot.classList.contains('reading')) app.ui.openCredits()
    boot.classList.add('gone')
    setTimeout(() => boot.remove(), 1200)
  }
  requestAnimationFrame(reveal)
}

start().catch((err) => {
  console.error(err)
  stageEl.textContent = 'something went wrong — see the console'
  bar.style.background = '#c0584a'
})
