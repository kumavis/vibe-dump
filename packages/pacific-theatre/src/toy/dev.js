// Dev-only: toy.html (not in the build). Boots App on the real data
// (?data=./data/ unless told otherwise) without the table, and enters the toy
// straight from the URL:
//
//   toy.html?box=samar&side=us[&seed=7][&start][&touch]
//
// ?start skips the start screen. window.__app and window.__toy are the
// tools' handles (tools/smoke-toy.mjs drives the page through them).

import * as THREE from 'three'
import { dataBase } from '../config.js'
import { loadData } from '../data/load.js'
import { App } from '../app.js'
import { Toy } from './index.js'

const status = (t) => (document.getElementById('dev-status').textContent = t)
const params = new URLSearchParams(location.search)
if (!params.get('data')) {
  const u = new URL(location.href)
  u.searchParams.set('data', './data/')
  history.replaceState(null, '', u)
}

/** App's frame loop with an idle scene in place of the table (battle.html's dev page does the same). */
function startIdle(app) {
  const idle = {
    name: 'idle',
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 1, 1e6),
    skyPlace: { lat: 0, lon: 0 },
    skyInstant: () => Date.UTC(1942, 5, 4, 22),
    update() {},
    fog: () => ({ density: 0, falloff: 1 }),
    settle() {},
    setRange() {},
    stats: () => ({ scene: 'idle' }),
    rig: { goal: { target: { x: 0, z: 0 }, distance: 1, yaw: 0, pitch: 0 }, state: { distance: 1 }, enabled: false },
  }
  app.idle = idle
  app.setActive(idle)
  const gl = app.renderer.getContext()
  const dbg = gl.getExtension('WEBGL_debug_renderer_info')
  app.gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : ''
  app.software = /swiftshader|llvmpipe|software/i.test(app.gpu)
  app.quality = { level: 2, cap: 3, avg: 16, since: 0, raisedAt: -1e9, fixed: app.software || app.params.has('fixedq') }
  if (app.software) app.pipeline.setSamples(0)
  app.applyQuality()
  app.resize()
  addEventListener('resize', () => app.resize())
  app.last = performance.now()
  app.frame = app.frame.bind(app)
  requestAnimationFrame(app.frame)
}

async function boot() {
  status('reading the record')
  const warn = (m) => console.warn(m)
  const data = await loadData(dataBase(), warn)
  const app = new App(document.getElementById('scene'), data, { warn })
  window.__app = app
  startIdle(app)
  app.mode = 'watch'
  const toy = new Toy(app)
  app.toy = toy
  window.__toy = toy
  if (params.get('seed')) toy.seed = Number(params.get('seed'))
  const box = params.get('box') || 'samar'
  status(`entering the toy over ${box}`)
  const t0 = performance.now()
  await toy.enter(box, { side: params.get('side') || 'us', from: 'url' })
  if (params.has('start')) await toy.start(params.get('side') || 'us')
  app.ready = true
  status('')
  console.info(`[toy] in ${((performance.now() - t0) / 1000).toFixed(1)} s`)
}

boot().catch((err) => {
  console.error(err)
  status(`toy: ${err.message}`)
})
