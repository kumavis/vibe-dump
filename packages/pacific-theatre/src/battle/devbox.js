// Dev-only: battle.html's box page (not in the build). Boots App (src/app.js)
// on the data (?data=./test-data/ by default) without the table, and goes
// straight into a box with the real Battle, from: 'url' (no fly-down):
//
//   battle.html?box=test-box&t=10:20&moment=test-dive[&data=./test-data/][&speed=4][&aid=guided]
//   battle.html?box=pearl-harbor&data=./data/&t=07:58&unit=nevada&station=aa[&assist=pilot]
//       takes a unit at a station at t (ROUND-2 §4) without the UI: unit is a
//       ship's id, an aircraft's slot id (kaga-level#3) or a group's id (any
//       of its aircraft but the leader, or a spare beside it)
//
//   battle.html?wargame=test-box&side=us[&data=./test-data/][&seed=1]
//       round three (ROUND-3 §4): the box entered as a wargame through
//       Battle.enterWargame, the side's first unit taken; the panel offers the
//       hops, the stations, play again, the other side and a forced end
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
  const wargame = params.get('wargame')
  if (wargame) {
    status(`entering the wargame ${wargame}`)
    const t0 = performance.now()
    await app.battle.enterWargame(wargame, { side: params.get('side') || 'us', from: 'url', seed: params.get('seed') })
    app.ready = true
    status(`${wargame} as ${app.battle.wargame.side}: in ${((performance.now() - t0) / 1000).toFixed(1)} s`)
    wargamePanel(app)
    return
  }
  const boxId = params.get('box') || data.boxes[0]?.id
  if (!boxId) throw new Error('no box in boxes/manifest.json')
  if (params.get('aid')) app.battle.setAid(params.get('aid'))
  if (params.get('assist')) app.battle.assist = params.get('assist')
  status(`entering ${boxId}`)
  const t0 = performance.now()
  await app.battle.enter(boxId, { t: params.get('t'), momentId: params.get('moment'), from: 'url' })
  if (params.get('speed')) app.battle.play(Number(params.get('speed')))
  const unit = params.get('unit')
  if (unit) {
    const sim = app.battle.sim
    const role = sim.record.groupById.has(unit) ? { group: unit } : { unit }
    if (params.get('station')) role.station = params.get('station')
    if (params.get('index') != null && role.group) role.index = Number(params.get('index'))
    try {
      app.battle.take(role).then((r) => console.info('[battle] after', JSON.stringify(r.sortie)))
    } catch (err) {
      status(`${unit}: ${err.message}`)
      console.info('[battle] not taken:', err.message)
    }
  }
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
  head('Take over')
  const row2 = document.createElement('div')
  row2.className = 'row'
  el.appendChild(row2)
  add(row2, 'Selected', () => {
    const i = battle.selected
    if (i == null) return status('select a unit first (a click in the box, or Tab)')
    try {
      battle.take(sim().roleOf(i)).then((r) => console.info('[battle] after', JSON.stringify(r.sortie)))
    } catch (err) {
      status(err.message)
    }
  })
  add(row2, 'Tab station', () => battle.cycleStation())
  add(row2, 'Release', () => battle.release())
  const as = add(el, `Assist: ${battle.assist}`, () => {
    battle.assist = battle.assist === 'assisted' ? 'pilot' : 'assisted'
    as.textContent = `Assist: ${battle.assist}`
  })
  head('Watch')
  const row = document.createElement('div')
  row.className = 'row'
  el.appendChild(row)
  for (const k of [0, 1, 4, 15, 60]) add(row, k ? `×${k}` : 'pause', () => (k ? battle.play(k) : battle.pause()))
  add(el, 'Leave the box', () => battle.leave())
}

/** The wargame's dev panel: the hops, the stations, play again, the other side, a forced end. */
function wargamePanel(app) {
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
  head('Hop')
  const row = document.createElement('div')
  row.className = 'row'
  el.appendChild(row)
  for (const [k, label] of [['carrier', '1 carrier'], ['capital', '2 capital'], ['destroyer', '3 destroyer'], ['aircraft', '4 aircraft'], ['next', 'Tab next']]) add(row, label, () => battle.hop(k))
  head('Station')
  add(el, 'Next station', () => battle.cycleStation())
  add(el, 'Release', () => battle.release())
  head('Game')
  add(el, 'Play again', () => battle.restart())
  add(el, 'Play the other side', () => battle.restart({ side: battle.wargame.side === 'jp' ? 'us' : 'jp' }))
  add(el, 'End now', () => battle.endNow())
  const info = document.createElement('div')
  info.style.cssText = 'font: 11px/1.35 Inter, system-ui, sans-serif; color: #e9e4d6; background: rgba(14,18,22,.7); padding: 6px 8px; border-radius: 4px; white-space: pre-line'
  el.appendChild(info)
  setInterval(() => {
    const a = battle.arena
    if (!a) return
    const o = a.objective
    const ph = a.phase
    const st = a.strength
    const t = a.tally
    info.textContent = [
      `${a.clock.label(a.t)} of ${a.clock.label(a.durationS)}`,
      `goal: ${o?.text ?? ''} (${o?.line ?? ''}, ${o?.status ?? ''})`,
      ph ? `phase: ${ph.title} — ${ph.line}, ${Math.ceil(ph.remainingS)} s (${ph.status})` : '',
      `strength jp ${(st.jp.fraction * 100).toFixed(0)} % · us ${(st.us.fraction * 100).toFixed(0)} %`,
      `tally jp sunk ${t.jp.sunk} down ${t.jp.downed} · us sunk ${t.us.sunk} down ${t.us.downed}`,
      `yours: hits ${t.player.hits} sunk ${t.player.sunk} down ${t.player.downed} lost ${t.player.lost}`,
      a.respawn ? a.respawn.line : '',
      a.result ? `end: ${a.result.line}` : '',
    ].filter(Boolean).join('\n')
  }, 500)
}
