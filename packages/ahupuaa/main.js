import { SEED } from './src/config.js'
import { App } from './src/app.js'
import { UI } from './src/ui/ui.js'

const boot = document.getElementById('boot')
const bar = boot.querySelector('.boot-bar span')
const stageEl = boot.querySelector('.boot-stage')

// What the loader says while each part of the generator runs.
const STAGES = {
  shape: ['raising the shields', 0.02, 0.1],
  erode: ['the rain carves valleys', 0.1, 0.42],
  valleys: ['filling the valley floors', 0.42, 0.55],
  coast: ['growing the reef', 0.55, 0.7],
  divide: ['tracing the ridgelines', 0.66, 0.7],
  detail: ['shaping the ridges', 0.7, 0.8],
  people: ['the people arrive', 0.8, 0.86],
  light: ['reading the light', 0.86, 0.94],
  sky: ['gathering clouds', 0.94, 0.99],
  done: ['', 1, 1],
}

function generate(seed) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./src/gen/worker.js', import.meta.url), { type: 'module' })
    worker.onmessage = (e) => {
      const m = e.data
      if (m.type === 'progress') {
        const s = STAGES[m.stage]
        if (!s) return
        stageEl.textContent = s[0]
        bar.style.width = `${(s[1] + (s[2] - s[1]) * m.p) * 100}%`
      } else if (m.type === 'done') {
        worker.terminate()
        resolve({ data: m.data, meta: m.meta })
      } else if (m.type === 'error') {
        worker.terminate()
        reject(new Error(m.message))
      }
    }
    worker.onerror = (e) => reject(e)
    worker.postMessage({ seed })
  })
}

async function start() {
  const t0 = performance.now()
  const island = await generate(SEED)
  console.log(`island generated in ${((performance.now() - t0) / 1000).toFixed(1)} s`)
  const app = new App(document.getElementById('scene'), island)
  const ui = new UI(app)
  window.__app = app
  app.ui = ui
  // let a couple of frames land (shaders compile, clouds fill in) before lifting the curtain
  let frames = 0
  const reveal = () => {
    if (++frames < 4) return requestAnimationFrame(reveal)
    boot.classList.add('gone')
    setTimeout(() => boot.remove(), 1200)
    if (!new URLSearchParams(location.search).has('cam')) ui.start()
  }
  requestAnimationFrame(reveal)
}

start().catch((err) => {
  console.error(err)
  stageEl.textContent = 'something went wrong — see the console'
})
