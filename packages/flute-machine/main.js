// Wiring: controls, transport, export.

import { FluteEngine } from './src/engine.js'
import { Player } from './src/player.js'
import { Visualizer } from './src/visualizer.js'
import { PRESETS, PRESET_BY_ID, DEFAULT_SETTINGS, Improviser } from './src/generator.js'
import { midiToName, REGISTERS } from './src/theory.js'
import { encodeWav, downloadBlob } from './src/wav.js'
import { encodeMidi } from './src/midi.js'
import { toSession, fromSession, stamp } from './src/session.js'
import { randomSeed } from './src/rng.js'

const $ = (id) => document.getElementById(id)
const clamp = (x, a, b) => (x < a ? a : x > b ? b : x)

const state = {
  preset: 'ambient',
  settings: { ...DEFAULT_SETTINGS, ...PRESET_BY_ID.ambient.settings },
  tone: { breathiness: 0.3, vibrato: 0.45, brightness: 0.5 },
  seed: randomSeed(),
  volume: 0.75,
  droneLock: false,
  savedRange: null,
}

const engine = new FluteEngine()
const player = new Player(engine)
const viz = new Visualizer($('stage'))
viz.setRange(state.settings.registerLow, state.settings.registerHigh)
viz.start()

// --------------------------------------------------------------- feedback

let toastTimer = null
function toast(message, isError = false) {
  const el = $('toast')
  el.textContent = message
  el.classList.toggle('is-error', isError)
  el.classList.add('is-shown')
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => el.classList.remove('is-shown'), 2600)
}

function setStatus() {
  const s = state.settings
  const scaleName = (s.scale || '').replace(/-/g, ' ')
  const key = `${midiToName(60 + (s.root % 12)).replace(/\d+$/, '')} ${scaleName}`
  const playing = player.playing
  $('status').textContent = `${key} · ${playing ? 'breathing' : 'resting'}`

  const n = player.score.length
  const dur = player.scoreDuration
  $('scoreInfo').textContent = n
    ? `${n} note${n === 1 ? '' : 's'} · ${formatTime(dur)} recorded`
    : 'nothing recorded yet'

  const has = n > 0
  for (const id of ['save', 'midi', 'wav']) $(id).disabled = !has
}

const formatTime = (s) => {
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
  return m ? `${m}m ${String(r).padStart(2, '0')}s` : `${r}s`
}

// ----------------------------------------------------------------- knobs

const KNOBS = [
  { key: 'density', label: 'Density', target: 'settings', hint: 'how much of the time there is sound' },
  { key: 'breathiness', label: 'Breath', target: 'both', hint: 'air against tone' },
  { key: 'motion', label: 'Motion', target: 'settings', hint: 'restlessness' },
  { key: 'pace', label: 'Pace', target: 'settings', hint: 'note length' },
  { key: 'vibrato', label: 'Vibrato', target: 'both', hint: 'depth of the wobble' },
  { key: 'space', label: 'Space', target: 'settings', hint: 'size of the room' },
]

function drawKnob(canvas, value) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const size = 54
  canvas.width = size * dpr
  canvas.height = size * dpr
  canvas.style.width = `${size}px`
  canvas.style.height = `${size}px`
  const c = canvas.getContext('2d')
  c.setTransform(dpr, 0, 0, dpr, 0, 0)
  c.clearRect(0, 0, size, size)

  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 6
  const start = Math.PI * 0.75
  const sweep = Math.PI * 1.5

  c.lineCap = 'round'
  c.lineWidth = 3
  c.strokeStyle = 'rgba(190,215,255,0.12)'
  c.beginPath()
  c.arc(cx, cy, r, start, start + sweep)
  c.stroke()

  const grad = c.createLinearGradient(0, 0, size, 0)
  grad.addColorStop(0, '#ffb26b')
  grad.addColorStop(1, '#7ed6ff')
  c.strokeStyle = grad
  c.lineWidth = 3
  c.beginPath()
  c.arc(cx, cy, r, start, start + sweep * clamp(value, 0, 1))
  c.stroke()

  const a = start + sweep * clamp(value, 0, 1)
  c.strokeStyle = 'rgba(232,240,251,0.9)'
  c.lineWidth = 2
  c.beginPath()
  c.moveTo(cx + Math.cos(a) * (r - 8), cy + Math.sin(a) * (r - 8))
  c.lineTo(cx + Math.cos(a) * (r - 1), cy + Math.sin(a) * (r - 1))
  c.stroke()
}

function buildKnobs() {
  const host = $('knobs')
  host.innerHTML = ''
  for (const k of KNOBS) {
    const btn = document.createElement('button')
    btn.className = 'knob'
    btn.type = 'button'
    btn.setAttribute('role', 'slider')
    btn.setAttribute('aria-label', `${k.label} — ${k.hint}`)
    btn.setAttribute('aria-valuemin', '0')
    btn.setAttribute('aria-valuemax', '100')

    const canvas = document.createElement('canvas')
    canvas.className = 'knob__dial'
    const label = document.createElement('span')
    label.className = 'knob__label'
    label.textContent = k.label
    const value = document.createElement('span')
    value.className = 'knob__value'

    btn.append(canvas, label, value)
    host.append(btn)

    const read = () => (k.target === 'settings' ? state.settings[k.key] : state.tone[k.key] ?? state.settings[k.key])

    const write = (v) => {
      v = clamp(v, 0, 1)
      if (k.target === 'settings' || k.target === 'both') state.settings[k.key] = v
      if (k.target === 'tone' || k.target === 'both') state.tone[k.key] = v
      render()
      applyLive(k.key)
    }

    const render = () => {
      const v = read()
      drawKnob(canvas, v)
      value.textContent = String(Math.round(v * 100))
      btn.setAttribute('aria-valuenow', String(Math.round(v * 100)))
    }

    k.render = render
    render()

    // Drag vertically, or use the arrow keys.
    let dragging = false
    let lastY = 0
    btn.addEventListener('pointerdown', (e) => {
      dragging = true
      lastY = e.clientY
      btn.setPointerCapture(e.pointerId)
      e.preventDefault()
    })
    btn.addEventListener('pointermove', (e) => {
      if (!dragging) return
      const dy = lastY - e.clientY
      lastY = e.clientY
      write(read() + dy / 160)
    })
    const end = (e) => {
      dragging = false
      try {
        btn.releasePointerCapture(e.pointerId)
      } catch {}
    }
    btn.addEventListener('pointerup', end)
    btn.addEventListener('pointercancel', end)
    btn.addEventListener('keydown', (e) => {
      const step = e.shiftKey ? 0.01 : 0.05
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') write(read() + step)
      else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') write(read() - step)
      else if (e.key === 'Home') write(0)
      else if (e.key === 'End') write(1)
      else return
      e.preventDefault()
    })
  }
}

const renderKnobs = () => KNOBS.forEach((k) => k.render && k.render())

/** Changes that can take effect without restarting the phrase stream. */
function applyLive(key) {
  if (!engine.ready) return
  if (key === 'breathiness' || key === 'vibrato') engine.setTone(state.tone)
  if (key === 'space') engine.setSpace(state.settings.space)
  if (player.improviser) player.improviser.settings = state.settings
}

// -------------------------------------------------------------- presets

function buildPresets() {
  const host = $('presets')
  host.innerHTML = ''
  for (const p of PRESETS) {
    const b = document.createElement('button')
    b.className = 'chip' + (p.settings.registerHigh <= 66 ? ' chip--low' : '')
    b.type = 'button'
    b.textContent = p.name
    b.title = p.blurb
    b.setAttribute('aria-pressed', String(p.id === state.preset))
    b.addEventListener('click', () => applyPreset(p.id, true))
    host.append(b)
  }
}

function applyPreset(id, restart) {
  const p = PRESET_BY_ID[id]
  if (!p) return
  state.preset = id
  state.settings = { ...DEFAULT_SETTINGS, ...p.settings }
  state.tone.breathiness = state.settings.breathiness
  state.tone.vibrato = state.settings.vibrato
  state.droneLock = state.settings.registerHigh <= 66
  $('droneLock').checked = state.droneLock

  syncControls()
  buildPresets()
  if (engine.ready) {
    engine.setTone(state.tone)
    engine.setSpace(state.settings.space)
  }
  if (restart && player.playing) startPlaying()
  setStatus()
}

// ------------------------------------------------------------- register

function syncControls() {
  const lo = state.settings.registerLow
  const hi = state.settings.registerHigh
  $('rangeLo').value = lo
  $('rangeHi').value = hi
  $('rangeOut').textContent = `${midiToName(lo)} — ${midiToName(hi)}`
  const min = +$('rangeLo').min
  const max = +$('rangeLo').max
  const a = ((lo - min) / (max - min)) * 100
  const b = ((hi - min) / (max - min)) * 100
  const span = $('rangeSpan')
  span.style.left = `${a}%`
  span.style.width = `${Math.max(0, b - a)}%`
  viz.setRange(lo, hi)
  renderKnobs()
  $('breathe').classList.toggle('is-low', hi <= 66)
}

function onRangeInput() {
  let lo = +$('rangeLo').value
  let hi = +$('rangeHi').value
  // Keep the handles from crossing, and keep at least a fifth between them so
  // there is always something to play.
  if (hi - lo < 7) {
    if (document.activeElement === $('rangeLo')) hi = Math.min(96, lo + 7)
    else lo = Math.max(43, hi - 7)
  }
  state.settings.registerLow = lo
  state.settings.registerHigh = hi
  state.droneLock = false
  $('droneLock').checked = false
  syncControls()
  if (player.improviser) player.improviser.settings = state.settings
}

function buildTicks() {
  const host = $('ticks')
  host.innerHTML = ''
  for (const oct of [2, 3, 4, 5, 6, 7]) {
    const s = document.createElement('span')
    s.textContent = `C${oct}`
    host.append(s)
  }
}

// ------------------------------------------------------------- transport

async function ensureAudio() {
  if (!engine.ready) {
    await engine.init({ space: state.settings.space, gain: state.volume, seed: state.seed })
    viz.setAnalyser(engine.analyser)
    viz.sampleRate = engine.ctx.sampleRate
    if (!engine.usingWorklet) {
      toast('Using the simple voice — worklets are blocked here')
    }
  }
  await engine.resume()
}

async function startPlaying() {
  await ensureAudio()
  engine.setTone(state.tone)
  engine.setSpace(state.settings.space)
  engine.setGain(state.volume)
  player.start({ ...state.settings, mode: 'endless' }, state.seed)
  $('breathe').classList.add('is-playing')
  $('breathe').querySelector('.breathe__label').textContent = 'Rest'
  $('breathe').setAttribute('aria-label', 'Stop playing')
  setStatus()
}

function stopPlaying() {
  player.stop()
  $('breathe').classList.remove('is-playing')
  $('breathe').querySelector('.breathe__label').textContent = 'Breathe'
  $('breathe').setAttribute('aria-label', 'Start playing')
  setStatus()
}

async function puff() {
  await ensureAudio()
  engine.setTone(state.tone)
  engine.setGain(state.volume)
  const burst = {
    ...state.settings,
    ...PRESET_BY_ID.smatterings.settings,
    // A puff stays inside whatever register the user has chosen, so it works
    // as a short low gesture too.
    registerLow: state.settings.registerLow,
    registerHigh: state.settings.registerHigh,
    space: state.settings.space,
    mode: 'burst',
    burstPhrases: 1,
  }
  const seed = randomSeed()
  if (player.playing) {
    // Layer the flurry over what is already playing rather than cutting it.
    const im = new Improviser(burst, seed)
    const phrase = im.nextPhrase()
    const notes = phrase.notes.map((n) => ({
      t: n.time,
      d: n.duration,
      midi: n.midi,
      vel: n.velocity,
      slur: !!n.slur,
      bendCents: n.bendCents || 0,
      portamento: n.portamento || 0,
      flutter: n.flutter || 0,
    }))
    const at = engine.currentTime + 0.08
    engine.schedule(notes, at)
    const base = player.elapsed + 0.08
    player.score.push(...notes.map((n) => ({ ...n, t: n.t + base })))
    for (const n of notes) setTimeout(() => viz.noteOn(n.midi, n.vel), n.t * 1000)
  } else {
    player.start(burst, seed)
  }
  setStatus()
}

// ---------------------------------------------------------------- export

async function exportWav() {
  const score = player.score
  if (!score.length) return
  const btn = $('wav')
  btn.disabled = true
  const was = btn.textContent
  btn.textContent = 'Rendering'
  try {
    const buffer = await FluteEngine.renderOffline(score, {
      space: state.settings.space,
      tone: state.tone,
      seed: state.seed,
      sampleRate: 48000,
    })
    downloadBlob(encodeWav(buffer), stamp('wav'))
    toast(`WAV exported — ${formatTime(buffer.duration)}`)
  } catch (err) {
    console.error(err)
    toast(`Could not render: ${err.message}`, true)
  } finally {
    btn.textContent = was
    btn.disabled = false
    setStatus()
  }
}

function exportMidi() {
  const score = player.score
  if (!score.length) return
  const notes = score.map((n) => ({ time: n.t, duration: n.d, midi: n.midi, velocity: n.vel }))
  downloadBlob(encodeMidi(notes), stamp('mid'))
  toast(`MIDI exported — ${notes.length} notes`)
}

function saveSession() {
  const score = player.score
  if (!score.length) return
  const doc = toSession({
    score,
    settings: state.settings,
    seed: state.seed,
    presetId: state.preset,
    tone: state.tone,
  })
  downloadBlob(new Blob([JSON.stringify(doc, null, 1)], { type: 'application/json' }), stamp('json'))
  toast('Session saved')
}

async function loadSession(file) {
  try {
    const parsed = fromSession(JSON.parse(await file.text()))
    state.settings = parsed.settings
    state.tone = parsed.tone
    state.seed = parsed.seed
    state.preset = parsed.presetId ?? state.preset
    syncControls()
    buildPresets()
    await ensureAudio()
    engine.setTone(state.tone)
    engine.setSpace(state.settings.space)
    engine.setGain(state.volume)
    player.play(parsed.notes)
    $('breathe').classList.add('is-playing')
    $('breathe').querySelector('.breathe__label').textContent = 'Rest'
    toast(`Playing "${parsed.title}" — ${parsed.notes.length} notes`)
    setStatus()
  } catch (err) {
    console.error(err)
    toast(err.message || 'Could not read that file', true)
  }
}

// ------------------------------------------------------------------ wire

buildPresets()
buildKnobs()
buildTicks()
syncControls()
setStatus()

$('breathe').addEventListener('click', () => {
  if (player.playing) stopPlaying()
  else startPlaying()
})

$('puff').addEventListener('click', puff)

$('rangeLo').addEventListener('input', onRangeInput)
$('rangeHi').addEventListener('input', onRangeInput)

$('droneLock').addEventListener('change', (e) => {
  state.droneLock = e.target.checked
  if (state.droneLock) {
    state.savedRange = [state.settings.registerLow, state.settings.registerHigh]
    const drone = REGISTERS.find((r) => r.id === 'drone')
    state.settings.registerLow = drone.lo
    state.settings.registerHigh = drone.hi
  } else if (state.savedRange) {
    state.settings.registerLow = state.savedRange[0]
    state.settings.registerHigh = state.savedRange[1]
  }
  syncControls()
  if (player.improviser) player.improviser.settings = state.settings
})

$('volume').addEventListener('input', (e) => {
  state.volume = +e.target.value
  engine.setGain(state.volume)
})

$('dice').addEventListener('click', () => {
  state.seed = randomSeed()
  toast(`New seed ${state.seed.toString(16)}`)
  if (player.playing) startPlaying()
})

$('save').addEventListener('click', saveSession)
$('midi').addEventListener('click', exportMidi)
$('wav').addEventListener('click', exportWav)
$('load').addEventListener('click', () => $('file').click())
$('file').addEventListener('change', (e) => {
  const f = e.target.files?.[0]
  if (f) loadSession(f)
  e.target.value = ''
})

player.onPhrase = (phrase, at) => {
  const delay = Math.max(0, at - player.elapsed)
  for (const n of phrase.notes) {
    setTimeout(() => viz.noteOn(n.midi, n.velocity), (delay + n.time) * 1000)
  }
  if (phrase.info) {
    state.settings.scale = phrase.info.scale
    state.settings.root = phrase.info.root
  }
  setStatus()
}

player.onStop = () => {
  $('breathe').classList.remove('is-playing')
  $('breathe').querySelector('.breathe__label').textContent = 'Breathe'
  setStatus()
}

// Space bar is the transport; it is the only shortcut worth having.
window.addEventListener('keydown', (e) => {
  if (e.code !== 'Space' || e.target.closest('input, button')) return
  e.preventDefault()
  if (player.playing) stopPlaying()
  else startPlaying()
})

setInterval(setStatus, 1000)

// A deliberate handle on the running machine — for the browser test harness,
// and for anyone who wants to drive it from the console.
window.__flute = { engine, player, viz, state, FluteEngine, toSession, fromSession, Improviser }
