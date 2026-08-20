// Kanji Lathe — wiring. Holds the parameter state, decides what needs
// redrawing, and hands the views a cached, fully-built skeleton.
import { loadCorpus } from './data/loader.js'
import { buildGlyph } from './engine/pipeline.js'
import { freshParams, deserialize, serialize, geometryKey, normalize, randomize, changedCount, SPECS, BY_ID } from './params.js'
import { PRESETS } from './presets.js'
import { buildControls } from './ui/controls.js'
import { createStage } from './ui/stage.js'
import { createSheet } from './ui/sheet.js'
import { createProof } from './ui/proof.js'
import { createEvolve } from './ui/evolve.js'
import { createInspector } from './ui/inspect.js'
import { wireExport } from './ui/exporter.js'
import { toast } from './ui/canvas-util.js'
import { pushIt, auditCorpus } from './ui/audit.js'
import { mulberry32 } from './geom/path.js'

const $ = (id) => document.getElementById(id)

const DEFAULT_TEXT = '日本語の活字は千年のあいだ手で彫られてきた。\nこの道具は千の漢字を数値で彫り直す。'

async function boot() {
  let corpus
  try {
    corpus = await loadCorpus(
      new URL('./corpus-core.json', location.href).href,
      new URL('./corpus-ext.json', location.href).href,
    )
  } catch (err) {
    const bootEl = $('boot')
    bootEl.classList.add('is-error')
    bootEl.querySelector('.boot__text').textContent = 'could not load the kanji corpus — ' + err.message
    return
  }

  const app = {
    corpus,
    P: freshParams(),
    char: '海',
    presetName: 'Skeleton',
    view: 'single',
    hotStroke: null,
    evolveAmount: 0.35,
    sheet: { from: 1, count: 120, cell: 92, set: 'kanji' },
    proof: { text: DEFAULT_TEXT, size: 72, track: 4, useFont: false },
  }

  // ── glyph cache ────────────────────────────────────────────────────────────
  // Keyed on geometry parameters only, so playing the writing animation (a
  // render-only parameter) never rebuilds a single skeleton.
  let cache = new Map()
  let cacheKey = null

  function glyphFor(record, quality = 1) {
    const key = geometryKey(app.P)
    if (key !== cacheKey) {
      cache = new Map()
      cacheKey = key
    }
    const k = record.char + '@' + quality
    let skel = cache.get(k)
    if (!skel) {
      skel = buildGlyph(record, app.P, { quality })
      if (cache.size > 1400) cache.clear()
      cache.set(k, skel)
    }
    return skel
  }

  // defineProperty, not Object.assign: assign would *invoke* the getter once and
  // copy its value, freezing app.record on whatever character was current.
  Object.defineProperty(app, 'record', {
    get: () => corpus.byChar.get(app.char) || corpus.chars[0],
    enumerable: true,
  })

  Object.assign(app, {
    glyphFor,
    glyph: (quality = 1) => glyphFor(app.record, quality),
    setChar(ch, { focus = true } = {}) {
      if (!corpus.byChar.has(ch)) return
      // Picking a character is a request to look at it; anything else leaves you
      // staring at a specimen sheet wondering whether the click registered.
      if (focus && app.view !== 'single') switchView('single')
      if (ch === app.char) return
      app.char = ch
      inspector.onCharChange()
      invalidate('char')
    },
    /** Pull in the long tail of kanji, reporting progress to the caller. */
    async loadExtended(onState) {
      if (corpus.extended) return true
      onState?.('loading')
      try {
        await corpus.loadExtended()
        inspector.renderResults()
        invalidate('corpus')
        onState?.('done')
        return true
      } catch (err) {
        onState?.('failed')
        toast('Could not load the extended character set: ' + err.message, true)
        return false
      }
    },
    setHotStroke(i) {
      if (app.hotStroke === i) return
      app.hotStroke = i
      inspector.highlight(i)
      if (app.view === 'single') schedule()
    },
    set(id, value) {
      if (app.P[id] === value) return
      app.P = { ...app.P, [id]: value }
      app.presetName = null
      panel.sync()
      invalidate('params')
    },
    setAll(P) {
      app.P = normalize(P)
      panel.sync()
      invalidate('params')
    },
  })

  // ── views ──────────────────────────────────────────────────────────────────
  const dom = {
    charInput: $('charInput'),
    charSearch: $('charSearch'),
    charResults: $('charResults'),
    charCard: $('charCard'),
    legFill: $('legFill'),
    metricStats: $('metricStats'),
    strokeList: $('strokeList'),
    btnExport: $('btnExport'),
    exportMenu: $('exportMenu'),
    sheetCanvas: $('sheetCanvas'),
  }

  const inspector = createInspector(dom, app)
  const stage = createStage($('glyphCanvas'), app)
  const sheet = createSheet($('sheetCanvas'), $('sheetStatus'), app)
  const proof = createProof($('proofCanvas'), $('proofStatus'), app)
  const evolve = createEvolve($('evolveGrid'), app)
  const panel = buildControls($('controls'), () => app.P, (id, v) => app.set(id, v))
  wireExport(dom, app)

  // ── render scheduling ──────────────────────────────────────────────────────
  let pending = false
  let dirty = new Set(['all'])

  function invalidate(reason) {
    dirty.add(reason)
    schedule()
    queueHash()
  }

  function schedule() {
    if (pending) return
    pending = true
    requestAnimationFrame(render)
  }

  function render() {
    pending = false
    const was = dirty
    dirty = new Set()
    try {
      if (app.view === 'single') {
        stage.draw()
        const skel = app.glyph()
        inspector.onRender(skel)
        updateHud(skel)
      } else if (app.view === 'sheet') sheet.draw()
      else if (app.view === 'proof') proof.draw()
      else if (app.view === 'evolve') {
        if (was.has('params') || was.has('char') || was.has('all')) evolve.repopulate()
        else evolve.draw()
      }
    } catch (err) {
      // A broken operator should degrade the stage, not take the app down.
      console.error(err)
      toast('Render error: ' + err.message, true)
    }
  }

  const hudChar = $('hudChar')
  const hudMeta = $('hudMeta')
  function updateHud(skel) {
    const rec = app.record
    hudChar.textContent = `${rec.char}  ·  #${rec.freq}  ·  ${rec.meanings[0] || ''}`
    const n = changedCount(app.P)
    hudMeta.textContent = [
      `${app.presetName || 'custom'}${n ? ` · ${n} control${n === 1 ? '' : 's'} moved` : ''}`,
      `${skel.strokes.filter((s) => s.alive).length}/${skel.strokeCount} strokes · ${skel.groups.length} components`,
    ].join('\n')
  }

  // ── url state ──────────────────────────────────────────────────────────────
  let hashTimer = 0
  function queueHash() {
    clearTimeout(hashTimer)
    hashTimer = setTimeout(() => {
      const h = serialize(app.P) + '|' + app.char
      // Embedded in a sandboxed frame the history API throws; the design is
      // still fully described by the panel, so losing the link is survivable.
      try {
        history.replaceState(null, '', '#' + h)
      } catch {}
    }, 400)
  }

  function restoreFromHash() {
    const raw = decodeURIComponent(location.hash.replace(/^#/, ''))
    if (!raw) return false
    const [ps, ch] = raw.split('|')
    app.P = deserialize(ps)
    if (ch && corpus.byChar.has(ch)) app.char = ch
    app.presetName = null
    return true
  }

  // ── chrome ─────────────────────────────────────────────────────────────────
  const presetSelect = $('presetSelect')
  for (const p of PRESETS) {
    const opt = document.createElement('option')
    opt.value = p.name
    opt.textContent = p.name
    presetSelect.appendChild(opt)
  }
  presetSelect.addEventListener('change', () => {
    const p = PRESETS.find((x) => x.name === presetSelect.value)
    if (!p) return
    app.setAll({ ...freshParams(), ...p.params })
    app.presetName = p.name
  })

  $('btnRandom').addEventListener('click', () => {
    const rnd = mulberry32((Math.random() * 1e9) | 0)
    app.setAll(randomize(app.P, 0.7, rnd))
    app.presetName = null
    presetSelect.value = ''
    toast('Rolled a new design')
  })
  $('btnReset').addEventListener('click', () => {
    app.setAll(freshParams())
    app.presetName = 'Skeleton'
    presetSelect.value = 'Skeleton'
  })

  let collapsed = false
  $('btnCollapse').addEventListener('click', () => {
    collapsed = !collapsed
    panel.setCollapsed(collapsed)
  })
  $('paramSearch').addEventListener('input', (ev) => panel.filter(ev.target.value))

  function switchView(view) {
    if (app.view === view) return
    app.view = view
    for (const t of $('tabs').children) t.classList.toggle('is-active', t.dataset.view === view)
    for (const v of document.querySelectorAll('.stage__view')) v.hidden = v.dataset.view !== view
    sheet.stop()
    proof.stop()
    invalidate('view')
  }
  for (const tab of $('tabs').children) tab.addEventListener('click', () => switchView(tab.dataset.view))

  // specimen sheet controls
  for (const [id, key] of [['sheetFrom', 'from'], ['sheetCount', 'count'], ['sheetCell', 'cell']]) {
    $(id).addEventListener('change', () => {
      app.sheet[key] = Number($(id).value)
      invalidate('sheet')
    })
  }
  $('sheetSet').addEventListener('change', () => {
    app.sheet.set = $('sheetSet').value
    invalidate('sheet')
  })
  // text proof controls
  $('proofText').value = DEFAULT_TEXT
  $('proofText').addEventListener('input', () => {
    app.proof.text = $('proofText').value
    invalidate('proof')
  })
  for (const [id, key] of [['proofSize', 'size'], ['proofTrack', 'track']]) {
    $(id).addEventListener('change', () => {
      app.proof[key] = Number($(id).value)
      invalidate('proof')
    })
  }
  $('proofFont').addEventListener('change', () => {
    app.proof.useFont = $('proofFont').checked
    invalidate('proof')
  })
  $('evolveAmt').addEventListener('input', () => {
    app.evolveAmount = Number($('evolveAmt').value)
  })
  $('btnRepopulate').addEventListener('click', () => evolve.repopulate())

  // push & proof
  $('btnPush').addEventListener('click', () => {
    const floor = Math.max(0.2, Math.min(0.98, Number($('pushFloor').value) || 0.62))
    const btn = $('btnPush')
    btn.disabled = true
    btn.textContent = 'Pushing…'
    // let the button repaint before the search blocks the thread
    setTimeout(() => {
      try {
        const { P, k, score } = pushIt(app, floor)
        app.setAll(P)
        app.presetName = null
        presetSelect.value = ''
        toast(`Pushed to ${k.toFixed(2)}× — legibility ${(score * 100) | 0}%`)
      } catch (err) {
        toast('Push failed: ' + err.message, true)
      } finally {
        btn.disabled = false
        btn.textContent = 'Push it'
      }
    }, 30)
  })

  const auditOut = $('auditOut')
  $('btnAudit').addEventListener('click', async () => {
    const btn = $('btnAudit')
    btn.disabled = true
    auditOut.textContent = ''
    const note = document.createElement('div')
    note.className = 'audit__note'
    note.textContent = 'scoring 1,000 glyphs…'
    auditOut.appendChild(note)
    try {
      const { worst, mean, total } = await auditCorpus(app, 18, (p) => {
        note.textContent = `scoring… ${Math.round(p * 100)}%`
      })
      note.textContent = `${total.toLocaleString()} scored · mean ${(mean * 100).toFixed(1)}% · weakest ${worst.length}:`
      for (const w of worst) {
        const b = document.createElement('button')
        b.textContent = w.rec.char
        b.title = `${w.rec.meanings.join(', ')} — ${(w.leg * 100).toFixed(0)}%`
        b.addEventListener('click', () => app.setChar(w.rec.char))
        auditOut.appendChild(b)
      }
    } catch (err) {
      note.textContent = 'audit failed: ' + err.message
    } finally {
      btn.disabled = false
    }
  })

  // writing animation transport
  let playing = false
  let animStart = 0
  const scrub = $('writeScrub')
  const btnPlay = $('btnPlay')
  function tick(t) {
    if (!playing) return
    const dur = 2600
    const k = Math.min(1, (t - animStart) / dur)
    // bypass app.set(): rdWriteAnim is render-only, so the glyph cache survives
    // and syncing 200 widgets every frame would cost more than the drawing does
    app.P = { ...app.P, rdWriteAnim: k }
    scrub.value = String(k)
    stage.draw()
    if (k >= 1) {
      playing = false
      btnPlay.textContent = '▶ Write'
      panel.sync()
    } else requestAnimationFrame(tick)
  }
  btnPlay.addEventListener('click', () => {
    playing = !playing
    btnPlay.textContent = playing ? '■ Stop' : '▶ Write'
    if (playing) {
      animStart = performance.now()
      requestAnimationFrame(tick)
    }
  })
  scrub.addEventListener('input', () => {
    playing = false
    btnPlay.textContent = '▶ Write'
    app.set('rdWriteAnim', Number(scrub.value))
  })

  window.addEventListener('keydown', (ev) => {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(ev.target.tagName)) return
    if (ev.key === 'r' || ev.key === 'R') $('btnRandom').click()
    if (ev.key === ' ') {
      ev.preventDefault()
      btnPlay.click()
    }
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
      // walk within the current script, so arrowing through kana does not
      // suddenly dump you in the middle of the frequency list
      const list = app.record.script === 'kanji' ? corpus.kanji : corpus.kana
      const i = list.findIndex((c) => c.char === app.char)
      const n = list.length
      app.setChar(list[(i + (ev.key === 'ArrowRight' ? 1 : n - 1)) % n].char)
    }
  })

  let resizeTimer = 0
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => invalidate('resize'), 120)
  })

  // ── go ─────────────────────────────────────────────────────────────────────
  if (!restoreFromHash()) {
    const start = PRESETS.find((p) => p.name === 'Crown Shy') || PRESETS[0]
    app.P = { ...freshParams(), ...start.params }
    app.presetName = start.name
    presetSelect.value = start.name
  }
  panel.sync()
  inspector.onCharChange()
  $('boot').remove()
  $('app').hidden = false
  invalidate('all')

  // a tiny sanity net: presets referencing a parameter that no longer exists
  // should be loud in development rather than silently doing nothing
  if (import.meta.env?.DEV) {
    for (const p of PRESETS) {
      for (const k of Object.keys(p.params)) if (!BY_ID.has(k)) console.warn(`preset "${p.name}" sets unknown parameter ${k}`)
    }
    console.info(`${SPECS.length} parameters across ${new Set(SPECS.map((s) => s.section)).size} sections`)
  }
}

boot()
