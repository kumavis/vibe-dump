import '@fontsource/patrick-hand/latin-400.css'
import '@fontsource/nunito/latin-400.css'
import '@fontsource/nunito/latin-700.css'
import '@fontsource/nunito/latin-800.css'
import './style.css'

import { CORES, NEEDS, FAMILIES, THOUGHT_WORDS } from './data.js'
import { Sheet, ease } from './fold.js'
import { G, baseMarkup, buildCores, buildCovers, buildCloserFan, buildNeedsFan, faceMarkup, bbox } from './wheel.js'
import { flowerMarkup, gardenMarkup } from './flowers.js'

const $ = (s, root = document) => root.querySelector(s)
const stage = $('#stage')
const note = $('#note')
const panel = $('#panel')

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches
const SLOW = REDUCED ? 0.3 : 1
const FINE = matchMedia('(hover: hover) and (pointer: fine)')

const coreById = new Map(CORES.map((c) => [c.id, c]))
const LEVEL = { core: 1, closer: 2, need: 3 }

// ------------------------------------------------------------------ paper --

// A tile of paper grain — specks and a few fibres — laid over every flap.
function grainTile() {
  const n = 160
  const cv = document.createElement('canvas')
  cv.width = cv.height = n
  const g = cv.getContext('2d')
  let s = 1234567
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  const img = g.createImageData(n, n)
  for (let i = 0; i < n * n; i++) {
    const v = rand()
    img.data[i * 4] = v > 0.5 ? 70 : 255
    img.data[i * 4 + 1] = v > 0.5 ? 45 : 255
    img.data[i * 4 + 2] = v > 0.5 ? 20 : 250
    img.data[i * 4 + 3] = Math.abs(v - 0.5) * 34
  }
  g.putImageData(img, 0, 0)
  g.lineCap = 'round'
  for (let i = 0; i < 36; i++) {
    const x = rand() * n, y = rand() * n, a = rand() * Math.PI * 2, l = 6 + rand() * 18
    g.strokeStyle = `rgba(90,60,30,${0.04 + rand() * 0.05})`
    g.lineWidth = 0.6
    g.beginPath()
    g.moveTo(x, y)
    g.quadraticCurveTo(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l)
    g.stroke()
  }
  return cv.toDataURL()
}

$('#grain image').setAttribute('href', grainTile())
$('#under').innerHTML = baseMarkup()
$('#garden').innerHTML = gardenMarkup()

const sheet = new Sheet($('#sheet'))

// ------------------------------------------------------------------ state --

const state = { core: null, closer: null, need: null, pin: 0 }
let cores = new Map() // id → Flap
let covers = []
let closerFan = null
let needsFan = null
let introDone = false
const afterIntro = []
let observation = ''

function current() {
  const core = state.core ? coreById.get(state.core) : null
  const closer = core && state.closer ? core.closer.find((c) => c.id === state.closer) : null
  const need = closer && state.need ? NEEDS[state.need] : null
  return { core, closer, need }
}

// ------------------------------------------------------------------- fans --

function openFan(fan) {
  fan.root.to(0, { dur: 440 * SLOW, curve: ease.out })
  for (const f of fan.flaps) {
    if (f === fan.root) continue
    f.to(0, { dur: 360 * SLOW, delay: (210 + (f.order - 1) * 150) * SLOW, curve: ease.out })
  }
}

function closeFan(fan) {
  if (!fan) return
  const deepest = Math.max(...fan.flaps.map((f) => f.order))
  for (const f of fan.flaps) {
    f.closing = true
    f.el.classList.add('closing')
    if (f !== fan.root) f.to(180, { dur: 230 * SLOW, delay: (deepest - f.order) * 45 * SLOW, curve: ease.inOut })
  }
  fan.root.to(90, {
    dur: 250 * SLOW,
    delay: (Math.max(0, deepest - 1) * 45 + 120) * SLOW,
    curve: ease.inOut,
    done: () => sheet.remove(fan.root),
  })
}

function closeNeeds() {
  closeFan(needsFan)
  needsFan = null
}

function closeCloser() {
  closeFan(closerFan)
  closerFan = null
}

// -------------------------------------------------------------- selection --

function selectCore(id) {
  const core = coreById.get(id)
  if (!core) return
  if (state.core === id) {
    if (state.closer) collapseTo(1)
    return
  }
  closeNeeds()
  closeCloser()
  Object.assign(state, { core: id, closer: null, need: null })
  closerFan = buildCloserFan(sheet, core)
  openFan(closerFan)
  changed()
}

function selectCloser(id) {
  const { core } = current()
  if (!core || !closerFan) return
  const index = core.closer.findIndex((c) => c.id === id)
  if (index < 0) return
  if (state.closer === id) {
    if (state.need) collapseTo(2)
    return
  }
  closeNeeds()
  Object.assign(state, { closer: id, need: null })
  const [a0, a1] = closerFan.flaps[index].slot
  const needs = core.closer[index].needs.map((name) => ({ name, ...NEEDS[name] }))
  needsFan = buildNeedsFan(sheet, (a0 + a1) / 2, needs, FAMILIES)
  openFan(needsFan)
  changed()
}

function selectNeed(name) {
  const { closer } = current()
  if (!closer || !closer.needs.includes(name) || state.need === name) return
  state.need = name
  changed({ unfold: true })
}

function collapseTo(level) {
  if (level < 3) state.need = null
  if (level < 2) {
    closeNeeds()
    state.closer = null
  }
  if (level < 1) {
    closeCloser()
    state.core = null
  }
  state.pin = Math.min(state.pin, level)
  changed()
}

function pick(kind, id, how) {
  if (kind === 'core') selectCore(id)
  else if (kind === 'closer') selectCloser(id)
  else if (kind === 'need') selectNeed(id)
  if (how !== 'hover') {
    state.pin = LEVEL[kind]
    renderPin()
  }
}

function changed({ unfold = false } = {}) {
  refreshLifts()
  renderPanel(unfold)
  writeHash()
  retarget()
}

// ------------------------------------------------------------ hover & lift --

let hover = null // the Flap under the pointer, or under a hovered chip
const rippling = new Set()

function refreshLifts() {
  const { core } = current()
  for (const f of cores.values()) {
    const sel = state.core === f.id
    f.liftTarget = hover === f ? 15 : rippling.has(f) ? 17 : sel ? 9 : 0
    f.el.classList.toggle('sel', sel)
    f.el.classList.toggle('dim', !!core && !sel)
    f.el.classList.toggle('hov', hover === f)
  }
  for (const fan of [closerFan, needsFan]) {
    if (!fan) continue
    const chosen = fan === closerFan ? state.closer : state.need
    for (const f of fan.flaps) {
      const sel = chosen === f.el.dataset.id
      f.liftTarget = hover === f ? 11 : sel ? 8 : 0
      f.el.classList.toggle('sel', sel)
      f.el.classList.toggle('dim', !!chosen && !sel)
      f.el.classList.toggle('hov', hover === f)
    }
  }
}

function setHover(f) {
  if (f === hover) return
  hover = f
  refreshLifts()
}

function flapFor(kind, id) {
  if (kind === 'core') return cores.get(id) ?? null
  const fan = kind === 'closer' ? closerFan : kind === 'need' ? needsFan : null
  return fan?.flaps.find((f) => f.el.dataset.id === id) ?? null
}

// Hover unfolds, after a short dwell so a pointer passing over the paper on its
// way somewhere doesn't rearrange it. Changing a choice you've already made
// waits longer than making one. A click pins that choice: hovering can still
// explore deeper, but won't change it until you click elsewhere.
let dwell = { flap: null, timer: 0 }

function dwellFor(f) {
  const kind = f.el.dataset.kind
  const id = f.el.dataset.id
  if (LEVEL[kind] <= state.pin) return null
  if (kind === 'core') return state.core === id ? null : state.core ? (state.closer ? 520 : 320) : 140
  if (kind === 'closer') return state.closer === id ? null : state.closer ? (state.need ? 420 : 300) : 170
  if (kind === 'need') return state.need === id ? null : state.need ? 220 : 150
  return null
}

function scheduleDwell(f) {
  if (f === dwell.flap) return
  clearTimeout(dwell.timer)
  dwell = { flap: f, timer: 0 }
  if (!f || !introDone) return
  const ms = dwellFor(f)
  if (ms == null) return
  dwell.timer = setTimeout(() => {
    if (f.closing || camBusy) return
    pick(f.el.dataset.kind, f.el.dataset.id, 'hover')
  }, ms)
}

// While the camera glides the paper slides under a pointer that hasn't moved;
// that's not the person choosing anything. Once it stops, wait for them to
// actually move before hover picks again.
let still = null // pointer position when the camera settled
let pointer = null
function settled() {
  clearTimeout(dwell.timer)
  dwell = { flap: null, timer: 0 }
  still = pointer
}

function flapAt(target) {
  const g = target?.closest?.('[data-pick]')
  const f = g?.__flap ?? null
  return f && !f.closing ? f : null
}

stage.addEventListener('pointermove', (e) => {
  if (e.pointerType === 'touch') return
  pointer = [e.clientX, e.clientY]
  const f = flapAt(e.target)
  setHover(f)
  if (camBusy) return
  if (still && Math.hypot(pointer[0] - still[0], pointer[1] - still[1]) < 8) return
  still = null
  scheduleDwell(f)
})
stage.addEventListener('pointerleave', () => {
  setHover(null)
  scheduleDwell(null)
})
stage.addEventListener('click', (e) => {
  const f = flapAt(e.target)
  if (!f) {
    if (state.pin) {
      state.pin = 0
      renderPin()
    }
    return
  }
  if (!introDone) return
  clearTimeout(dwell.timer)
  pick(f.el.dataset.kind, f.el.dataset.id, 'click')
})

addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || e.target.closest?.('input')) return
  if (state.need) collapseTo(2)
  else if (state.closer) collapseTo(1)
  else if (state.core) collapseTo(0)
})

// The fortune teller's own idle motion: two opposite corners lift, then the
// other two — paku, paku — while nobody has picked anything yet.
const QUADS = [
  ['scared', 'angry', 'loving', 'calm'],
  ['excited', 'happy', 'tired', 'sad'],
]
function pakupaku() {
  if (!introDone || state.core || hover || REDUCED) return
  QUADS.forEach((ids, beat) => {
    setTimeout(() => {
      for (const id of ids) rippling.add(cores.get(id))
      refreshLifts()
      setTimeout(() => {
        for (const id of ids) rippling.delete(cores.get(id))
        refreshLifts()
      }, 230)
    }, beat * 380)
  })
}
setInterval(pakupaku, 4200)

// ---------------------------------------------------------------- camera --

// Before anything is chosen the camera leans in on the square. On a big screen
// it pulls back to the whole wheel as soon as something unfolds and then stays
// put. On a small one it keeps following the unfolding — the square, then the
// open fan, then the needs — so the words stay big enough to read.
const FULL = 2 * (G.R2T + 18)
const IDLE = 2 * (2 * G.H + 34) // the square with its four petals open
const view = { x: -FULL / 2, y: -FULL / 2, w: FULL, h: FULL }
let goal = { ...view }
let snap = true
let camBusy = false

function focusPolys() {
  const H = G.H + 26
  const square = [[-H, -H], [H, H]]
  if (state.closer && needsFan && closerFan) {
    const sel = closerFan.flaps.find((f) => f.el.dataset.id === state.closer)
    return [sel.poly, ...needsFan.flaps.map((f) => f.poly)]
  }
  if (state.core && closerFan) return [square, ...closerFan.flaps.map((f) => f.poly)]
  return [square]
}

function retarget() {
  const r = stage.getBoundingClientRect()
  if (!r.width || !r.height) return
  const short = Math.min(r.width, r.height)
  const all = short / FULL
  let s = all, cx = 0, cy = 0
  if (all >= 0.6) {
    if (!state.core) s = short / IDLE
  } else {
    const b = bbox(focusPolys())
    const m = 20
    s = Math.min(r.width / (b.x1 - b.x0 + 2 * m), r.height / (b.y1 - b.y0 + 2 * m), 1.3)
    cx = (b.x0 + b.x1) / 2
    cy = (b.y0 + b.y1) / 2
  }
  goal = { x: cx - r.width / s / 2, y: cy - r.height / s / 2, w: r.width / s, h: r.height / s }
}

new ResizeObserver(() => {
  retarget()
  snap = true
}).observe(stage)

let lastBox = ''
function moveCamera() {
  const k = snap ? 1 : REDUCED ? 0.3 : 0.085
  snap = false
  let moving = false
  for (const key of ['x', 'y', 'w', 'h']) {
    const d = goal[key] - view[key]
    if (Math.abs(d) > 0.5) moving = true
    view[key] = Math.abs(d) < 0.05 ? goal[key] : view[key] + d * k
  }
  if (camBusy && !moving) settled()
  camBusy = moving
  const box = `${view.x.toFixed(2)} ${view.y.toFixed(2)} ${view.w.toFixed(2)} ${view.h.toFixed(2)}`
  if (box !== lastBox) {
    lastBox = box
    stage.setAttribute('viewBox', box)
  }
}

function loop(now) {
  sheet.frame(now)
  moveCamera()
  requestAnimationFrame(loop)
}

// ------------------------------------------------------------------- panel --

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

function faceSvg(core, size = 30) {
  return `<svg class="face-ico" viewBox="-17 -17 34 34" width="${size}" height="${size}" aria-hidden="true">${faceMarkup(core.id, 0, 0, 16, core.color)}</svg>`
}

// How a need reads at the end of "because I need ___" — most read as they
// are, a few want a verb.
function said(name) {
  return NEEDS[name].said ?? name
}

function crumbs() {
  const { core, closer, need } = current()
  if (!core) return ''
  const parts = [`<button class="crumb" data-level="0">All feelings</button>`]
  parts.push(`<button class="crumb" data-level="1" style="--c:${core.color}">${core.word}</button>`)
  if (closer) parts.push(`<button class="crumb" data-level="2" style="--c:${core.color}">${closer.word}</button>`)
  if (need) parts.push(`<span class="crumb here" style="--c:${FAMILIES[need.family].color}">${esc(state.need)}</span>`)
  return `<nav class="crumbs" aria-label="Where you are">${parts.join('<span class="sep">›</span>')}</nav>`
}

function coreChips() {
  // Pleasant first, then painful, each in wheel order.
  const order = ['happy', 'excited', 'loving', 'calm', 'sad', 'angry', 'scared', 'tired']
  return order
    .map((id) => coreById.get(id))
    .map((c) => `<button class="chip" data-core="${c.id}" style="--c:${c.color}">${faceSvg(c, 26)}<span>${c.word}</span></button>`)
    .join('')
}

function introNote() {
  return `
    <p class="kicker">How are you feeling?</p>
    <h2 class="big">Touch the paper.</h2>
    <p>Start with the plainest word that fits. Its fold opens into closer words, and under those are the needs your feeling may be pointing to.</p>
    <div class="chips">${coreChips()}</div>`
}

function coreNote(core) {
  const chips = core.closer
    .map((c) => `<button class="chip" data-closer="${c.id}" style="--c:${core.color}"><span>${c.word}</span></button>`)
    .join('')
  const why = core.met
    ? `<b>Pleasant feelings</b> are a sign that some of your needs are being met right now.`
    : `<b>Painful feelings</b> are messengers: a need is asking for care. Nothing is wrong with you for feeling this.`
  return `
    <div class="head">${faceSvg(core, 54)}<div><p class="kicker">You feel</p><h2>${core.word}</h2></div></div>
    <p class="gist">${core.gist}</p>
    <p class="why" style="--c:${core.color}">${why}</p>
    <h3>Which word fits a little closer?</h3>
    <div class="chips">${chips}</div>`
}

function needChips(names) {
  return names
    .map((n) => {
      const fam = FAMILIES[NEEDS[n].family]
      return `<button class="chip need" data-need="${esc(n)}" style="--c:${fam.color}"><span>${esc(n)}</span></button>`
    })
    .join('')
}

function closerNote(core, closer) {
  const lead = core.met
    ? `Feeling <b>${closer.word.toLowerCase()}</b> can be a sign that needs like these are being met:`
    : `When you feel <b>${closer.word.toLowerCase()}</b>, you might be needing:`
  return `
    <div class="head">${faceSvg(core, 42)}<div><p class="kicker">${core.word}, more exactly</p><h2>${closer.word}</h2></div></div>
    <p class="gist">${closer.gist}.</p>
    <p>${lead}</p>
    <div class="chips">${needChips(closer.needs)}</div>
    <p class="aside">Needs are what every person shares. They aren't about any one person or any one way of getting them — so there's usually more than one way to meet them.</p>
    <h3 class="prompt">Touch a petal to unfold its fortune.</h3>`
}

function sentence(core, closer, name) {
  const need = NEEDS[name]
  const when = observation.trim() ? esc(observation.trim()) : '<i>…</i>'
  const word = closer.word.toLowerCase()
  const what = esc(said(name))
  if (core.met) {
    const tail = what.startsWith('to ') ? `to <b>${what.slice(3)}</b>` : `for <b>${what}</b>`
    return `When ${when}, I felt <b>${word}</b>, because it met my need ${tail}. Thank you!`
  }
  return `When ${when}, I feel <b>${word}</b>, because I need <b>${what}</b>. Would you be willing to ${esc(need.ask)}?`
}

function plain(html) {
  const d = document.createElement('div')
  d.innerHTML = html
  return d.textContent.replace(/\s+/g, ' ').trim()
}

function fortuneNote(core, closer, name) {
  const need = NEEDS[name]
  const fam = FAMILIES[need.family]
  const word = closer.word.toLowerCase()
  const lead = core.met ? `Feeling <b>${word}</b> says your need for` : `Under <b>${word}</b> there may be a need for`
  const steps = core.met
    ? `<div class="step"><h3>Savor it</h3><p>Notice where the feeling sits in your body. What helped make it happen? Remembering is a way back here.</p></div>
       <div class="step"><h3>Say thank you</h3><p>If someone helped meet this need, tell them. Hearing it meets their needs too.</p></div>`
    : `<div class="step"><h3>Something to try</h3><p>${esc(need.try)}</p></div>
       <div class="step"><h3>Something to ask</h3><p class="ask">“Would you be willing to ${esc(need.ask)}?”</p></div>`
  const others = closer.needs.filter((n) => n !== name)
  return `
    <article class="fortune" style="--c:${fam.color}">
      <svg class="fortune-flower" viewBox="-50 -50 100 100" aria-hidden="true">${flowerMarkup(fam.color, { petals: 8, r: 46, turn: -90 })}</svg>
      <p class="kicker">Your fortune</p>
      <p class="lead">${lead}</p>
      <h2 class="need">${esc(name)}</h2>
      ${core.met ? '<p class="lead after">is being met.</p>' : ''}
      <p class="family"><span class="dot"></span>${fam.name} · <span>${esc(need.means)}</span></p>
      ${steps}
      <div class="sentence">
        <h3>Say it the NVC way</h3>
        <label class="obs">When… <input id="obs" type="text" autocomplete="off" placeholder="what happened? just the facts, like a camera"></label>
        <p id="said">${sentence(core, closer, name)}</p>
        <button class="copy" id="copy" type="button">Copy</button>
      </div>
    </article>
    <p class="also">Other needs under <b>${word}</b>:</p>
    <div class="chips">${needChips(others)}</div>`
}

function renderPanel(unfold) {
  const { core, closer, need } = current()
  let body
  if (!core) body = introNote()
  else if (!closer) body = coreNote(core)
  else if (!need) body = closerNote(core, closer)
  else body = fortuneNote(core, closer, state.need)
  note.innerHTML = crumbs() + body + `<p class="pin" id="pin" hidden></p>`
  note.dataset.level = need ? 3 : closer ? 2 : core ? 1 : 0
  renderPin()

  const obs = $('#obs', note)
  if (obs) {
    obs.value = observation
    obs.addEventListener('input', () => {
      observation = obs.value
      $('#said', note).innerHTML = sentence(core, closer, state.need)
    })
    $('#copy', note).addEventListener('click', async (e) => {
      const text = plain($('#said', note).innerHTML)
      try {
        await navigator.clipboard.writeText(text)
        e.target.textContent = 'Copied'
      } catch {
        e.target.textContent = 'Select & copy'
      }
      setTimeout(() => (e.target.textContent = 'Copy'), 1600)
    })
  }
  if (unfold) {
    const fortune = $('.fortune', note)
    fortune?.classList.add('unfold')
    // On a small screen the note sits under the paper; bring the fortune up.
    if (fortune && panel.scrollHeight > panel.clientHeight) panel.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' })
  }
}

function renderPin() {
  const el = $('#pin', note)
  if (!el) return
  const show = state.pin > 0 && FINE.matches
  el.hidden = !show
  if (show) el.innerHTML = `<span class="pin-dot"></span>Held by your click. Hovering won't change it — click empty paper to let it roam again.`
}

// Chips in the panel do what the paper does, and point at their flap.
note.addEventListener('click', (e) => {
  const b = e.target.closest('button')
  if (!b) return
  if (b.dataset.level != null) return collapseTo(Number(b.dataset.level))
  if (b.dataset.core) return whenReady(() => pick('core', b.dataset.core, 'panel'))
  if (b.dataset.closer) return pick('closer', b.dataset.closer, 'panel')
  if (b.dataset.need) return pick('need', b.dataset.need, 'panel')
})
note.addEventListener('pointerover', (e) => {
  const b = e.target.closest?.('button.chip')
  if (!b) return
  const f = b.dataset.core ? flapFor('core', b.dataset.core) : b.dataset.closer ? flapFor('closer', b.dataset.closer) : b.dataset.need ? flapFor('need', b.dataset.need) : null
  setHover(f)
})
note.addEventListener('pointerout', (e) => {
  if (e.target.closest?.('button.chip') && !e.relatedTarget?.closest?.('button.chip')) setHover(null)
})

// ------------------------------------------------------------------- about --

function renderAbout() {
  const rows = THOUGHT_WORDS.map((t) => {
    const core = coreById.get(t.feeling[0])
    const closer = core.closer.find((c) => c.id === t.feeling[1])
    return `<li><button data-go="${t.feeling.join('/')}" style="--c:${core.color}"><span class="tw">“${t.word}”</span><span class="arrow">→</span><span>maybe <b>${closer.word.toLowerCase()}</b>, needing ${t.needs.map((n) => `<b>${esc(n)}</b>`).join(' or ')}</span></button></li>`
  }).join('')
  $('#thoughts').innerHTML = rows
  $('#thoughts').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-go]')
    if (!b) return
    const [c, cl] = b.dataset.go.split('/')
    go([c, cl], 'panel')
  })
}

// ------------------------------------------------------------------- hash --

function writeHash() {
  const parts = [state.core, state.closer, state.need].filter(Boolean).map(encodeURIComponent)
  const url = parts.length ? `#${parts.join('/')}` : location.pathname + location.search
  history.replaceState(null, '', url)
}

function go(path, how = 'hover') {
  whenReady(() => {
    const [c, cl, n] = path
    if (!coreById.has(c)) return
    if (state.core !== c) pick('core', c, how)
    else if (state.closer && state.closer !== cl) collapseTo(1)
    if (!cl) return
    setTimeout(() => {
      pick('closer', cl, how)
      if (n) setTimeout(() => pick('need', n, how), 380 * SLOW)
    }, (state.closer === cl ? 0 : 380) * SLOW)
  })
}

function whenReady(fn) {
  if (introDone) fn()
  else afterIntro.push(fn)
}

// ------------------------------------------------------------------- start --

async function start() {
  // Labels are measured to fit their flap, so the hand-lettered face has to be
  // here first. Don't wait forever for it, though.
  await Promise.race([document.fonts.load('20px "Patrick Hand"'), new Promise((r) => setTimeout(r, 1500))])

  cores = new Map(buildCores(sheet, CORES).map((f) => [f.id, f]))
  covers = buildCovers(sheet)
  renderPanel()
  renderAbout()
  retarget()
  snap = true
  requestAnimationFrame(loop)

  // The opening: four pastel flaps lying folded over the square spring open.
  covers.forEach((f, i) => {
    f.to(-7, { dur: 820 * SLOW, delay: (180 + i * 90) * SLOW, curve: ease.back })
  })
  setTimeout(() => {
    introDone = true
    for (const fn of afterIntro.splice(0)) fn()
  }, (180 + 90 * 3 + 600) * SLOW)

  const path = decodeURIComponent(location.hash.slice(1)).split('/').filter(Boolean)
  if (path.length) go(path, 'panel')
}

$('#refold').addEventListener('click', () => {
  collapseTo(0)
  state.pin = 0
  introDone = false
  covers.forEach((f, i) =>
    f
      .to(180, { dur: 520 * SLOW, delay: (3 - i) * 70 * SLOW, curve: ease.inOut })
      .then(-7, { dur: 820 * SLOW, delay: (220 + i * 90) * SLOW, curve: ease.back }),
  )
  setTimeout(() => {
    introDone = true
    for (const fn of afterIntro.splice(0)) fn()
  }, (900 + 90 * 3 + 600) * SLOW)
})

start()
