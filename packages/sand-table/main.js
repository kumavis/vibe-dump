import { dataBase } from './src/config.js'
import { loadData, PackDecoder } from './src/data/load.js'
import { App } from './src/app.js'
import { UI } from './src/ui/ui.js'

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

async function start() {
  const t0 = performance.now()
  progress('reading the gazetteer', 0.05)
  const data = await loadData(dataBase(), warn)
  if (!data.packs.length) throw new Error('the manifest lists no packs')
  const app = new App(document.getElementById('scene'), data, { warn })
  window.__app = app
  const decoder = new PackDecoder(2, warn)

  // the archipelago first: everything is laid over it
  progress('raising the islands', 0.25)
  const arch = app.world.archPack
  arch.data = await decoder.decode(arch)
  progress('placing the boundaries', 0.8)
  await new Promise((r) => setTimeout(r, 0))
  app.start()
  const ui = new UI(app)
  app.ui = ui
  console.log(`archipelago ready in ${((performance.now() - t0) / 1000).toFixed(1)} s`)

  // let a few frames land (shaders compile) before lifting the curtain
  progress('', 1)
  let frames = 0
  const reveal = () => {
    if (++frames < 4) return requestAnimationFrame(reveal)
    boot.classList.add('gone')
    setTimeout(() => boot.remove(), 1200)
    loadIslands(app, ui, decoder)
    // the patches (the reefs before the harbours were dredged and filled),
    // and the district close-ups' manifest and features, behind it all
    // (their packs stream when the camera comes down to them, with the
    // patches of their own)
    app.patches.load().catch((err) => {
      warn(`patches: ${err.message}`)
      app.patches.resolveReady([])
    })
    app.districts.load().catch((err) => warn(`districts: ${err.message}`))
  }
  requestAnimationFrame(reveal)
}

/** The island packs, in the background, nearest the camera first. */
async function loadIslands(app, ui, decoder) {
  const t = app.rig.state.target
  const dist = (p) => Math.hypot((p.rect.x0 + p.rect.x1) / 2 - t.x, (p.rect.z0 + p.rect.z1) / 2 - t.z)
  const queue = [...app.world.islandPacks].sort((a, b) => dist(a) - dist(b))
  let done = 0
  ui.setLoading(queue.length ? `· ${queue.length} islands to come` : '')
  await Promise.all(
    queue.map(async (p) => {
      try {
        p.data = await decoder.decode(p)
        app.addIsland(p)
      } catch (err) {
        warn(`${p.id}: ${err.message}`)
      }
      done++
      ui.setLoading(done < queue.length ? `· ${queue.length - done} islands to come` : '')
    }),
  )
  decoder.dispose()
  app.islandsLoaded = true
  // then the land layers, in their own worker, behind everything else
  app.land.load()
}

start().catch((err) => {
  console.error(err)
  stageEl.textContent = 'something went wrong — see the console'
  bar.style.background = '#c0584a'
})
