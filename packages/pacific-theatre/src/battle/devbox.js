// Dev-only: battle.html's box page (not in the build). Boots App (src/app.js)
// on the data (?data=./test-data/ by default) without the table, and goes
// straight into a box with the real Battle, from: 'url' (no fly-down):
//
//   battle.html?box=test-box&t=10:20&moment=test-dive[&data=./test-data/][&speed=4][&aid=guided]
//
// A small panel offers the box's moments ("Take the controls"), its stops,
// the watch speeds and leaving. window.__app and window.__battle are the
// tools' handles (tools/smoke-battle.mjs drives the page through them).

import * as THREE from 'three'
import { dataBase } from '../config.js'

const PANEL_STYLE = `
#dev-panel { position: fixed; right: 12px; top: 210px; z-index: 40; display: flex; flex-direction: column; gap: 4px; font: 12px/1.3 Inter, system-ui, sans-serif; max-width: 240px; }
#dev-panel button { pointer-events: auto; cursor: pointer; text-align: left; padding: 5px 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,.25); background: rgba(14,18,22,.7); color: #e9e4d6; font: inherit; }
#dev-panel button:hover { background: rgba(40,48,56,.85); }
#dev-panel .row { display: flex; gap: 4px; flex-wrap: wrap; }
#dev-panel .row button { flex: 1; text-align: center; }
#dev-panel h4 { margin: 6px 0 2px; font-weight: 600; opacity: .8; }
`

/** App's frame loop without the table: an idle scene until the box is in. */
function startWithoutTable(app) {
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
    rig: { goal: { target: { x: 0, z: 0 }, distance: 1, yaw: 0, pitch: 0 }, state: { distance: 1 }, enabled: false, pose: () => ({ target: { x: 0, y: 0, z: 0 }, distance: 1, yaw: 0, pitch: 0 }) },
  }
  app.idle = idle
  app.setActive(idle)
  app.mode = 'watch'
  const gl = app.renderer.getContext()
  const dbg = gl.getExtension('WEBGL_debug_renderer_info')
  app.gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : ''
  app.software = /swiftshader|llvmpipe|software/i.test(app.gpu)
  app.quality = { level: 2, cap: 3, avg: 16, since: 0, raisedAt: -1e9, fixed: app.software || app.params.has('fixedq') }
  if (app.params.get('q')) app.quality.level = Number(app.params.get('q'))
  app.applyQuality()
  app.resize()
  addEventListener('resize', () => app.resize())
  app.last = performance.now()
  app.frame = app.frame.bind(app)
  requestAnimationFrame(app.frame)
}

export async function bootBox(params, status) {
  const { loadData } = await import('../data/load.js')
  const { App } = await import('../app.js')
  const warnings = []
  const warn = (m) => {
    warnings.push(m)
    console.warn(m)
  }
  if (!params.get('data')) {
    // the dev page runs on the fixtures unless told otherwise
    const u = new URL(location.href)
    u.searchParams.set('data', './test-data/')
    history.replaceState(null, '', u)
  }
  status('reading the record')
  const data = await loadData(dataBase(), warn)
  const app = new App(document.getElementById('scene'), data, { warn })
  app.warnings = warnings
  window.__app = app
  window.__battle = app.battle
  startWithoutTable(app)
  const boxId = params.get('box') || data.boxes[0]?.id
  if (!boxId) throw new Error('no box in boxes/manifest.json')
  if (params.get('aid')) app.battle.setAid(params.get('aid'))
  status(`entering ${boxId}`)
  const t0 = performance.now()
  await app.battle.enter(boxId, { t: params.get('t'), momentId: params.get('moment'), from: 'url' })
  if (params.get('speed')) app.battle.play(Number(params.get('speed')))
  app.ready = true
  status(`${boxId}: in ${((performance.now() - t0) / 1000).toFixed(1)} s`)
  panel(app, params)
}

function panel(app, params) {
  if (!document.getElementById('dev-panel-style')) {
    const st = document.createElement('style')
    st.id = 'dev-panel-style'
    st.textContent = PANEL_STYLE
    document.head.appendChild(st)
  }
  const el = document.createElement('div')
  el.id = 'dev-panel'
  document.body.appendChild(el)
  const battle = app.battle
  const sim = () => battle.sim
  const add = (parent, label, fn) => {
    const b = document.createElement('button')
    b.textContent = label
    b.addEventListener('click', (e) => {
      e.stopPropagation()
      fn()
    })
    parent.appendChild(b)
    return b
  }
  const head = (t) => {
    const h = document.createElement('h4')
    h.textContent = t
    el.appendChild(h)
  }
  const record = sim()?.record
  if (record?.moments.size) {
    head('Moments')
    for (const m of record.moments.values()) {
      const b = add(el, `Take the controls: ${m.title}`, () => {
        battle.takeMoment(m.id).then((r) => console.info('[battle] after', JSON.stringify(r.score), JSON.stringify(r.outcome.diverged)))
      })
      if (params.get('moment') === m.id) b.style.borderColor = '#f0c878'
    }
    add(el, 'Release the controls', () => battle.release())
  }
  if (record?.stops.length) {
    head('Stops')
    for (const s of record.stops) add(el, `${sim().clock.label(s.t)} ${s.text.slice(0, 40)}`, () => {
      battle.scrub(s.t, { answer: 'yes' })
      battle.lookAtStop(s)
    })
  }
  head('Watch')
  const row = document.createElement('div')
  row.className = 'row'
  el.appendChild(row)
  for (const k of [0, 1, 4, 15, 60]) add(row, k ? `×${k}` : 'pause', () => (k ? battle.play(k) : battle.pause()))
  add(el, 'Leave the box', () => battle.leave())
}
