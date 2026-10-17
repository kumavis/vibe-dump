import '@fontsource/patrick-hand/latin-400.css'
import '@fontsource/nunito/latin-400.css'
import '@fontsource/nunito/latin-700.css'
import '@fontsource/nunito/latin-800.css'
import './style.css'

import { FAMILIES } from './data.js'
import { content, startLang, saveLang, LANGS } from './i18n.js'
import { Sheet, ease } from './fold.js'
import { G, baseMarkup, buildCores, buildCovers, buildCloserFan, buildNeedsFan, bbox } from './wheel.js'
import { flowerMarkup, gardenMarkup } from './flowers.js'

const $ = (s, root = document) => root.querySelector(s)
const stage = $('#stage')
const choices = $('#choices')
const fortune = $('#fortune')
const about = $('#about')
const nvcLink = $('#nvc-link')

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches
const SLOW = REDUCED ? 0.3 : 1

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

// --------------------------------------------------------------- language --

let lang = startLang()
let C = content(lang) // { cores, needs, thoughts, ui } in the current language
const coreOf = (id) => C.cores.find((c) => c.id === id) ?? null

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
$('#under').innerHTML = baseMarkup(C.cores, flowerMarkup)
$('#garden').innerHTML = gardenMarkup()

const sheet = new Sheet($('#sheet'))

// ------------------------------------------------------------------ state --

const state = { opened: false, core: null, closer: null, need: null }
let cores = new Map() // id → the core's triangle Flap
let covers = []
// Folded-up fans stay attached to their parent while they fold away, so a
// quick change of mind can open the same paper again instead of a copy.
const closerFans = new Map() // core id → fan
const needsFans = new Map() // "core/closer" → fan
let introDone = false // the corner flaps have finished opening
const afterIntro = []
let observation = ''
let seenFortune = false

const needsKey = (core, closer) => `${core}/${closer}`
const openCloserFan = () => (state.core ? closerFans.get(state.core) : null)
const openNeedsFan = () => (state.closer ? needsFans.get(needsKey(state.core, state.closer)) : null)

function current() {
  const core = state.core ? coreOf(state.core) : null
  const closer = core && state.closer ? core.closer.find((c) => c.id === state.closer) : null
  const need = closer && state.need ? C.needs[state.need] : null
  return { core, closer, need }
}

// ----------------------------------------------------------------- folding --

// Opening goes from the inside out. Folding up goes the other way, strictly:
// the outermost ring of paper folds in first, and each ring waits for the one
// outside it to finish — petals, then words, then the triangle.
const FOLD = 150

/** How long until this flap and everything it hangs from stop moving. */
function settleIn(f) {
  const now = performance.now()
  let end = now
  for (let p = f; p; p = p.parent) {
    let t = now
    for (const tw of p.tweens) {
      t = (tw.at ?? t + tw.delay) + tw.dur
      end = Math.max(end, t)
    }
  }
  return end - now
}

/** Unfold a fan: its first flap off the parent, then the rest sideways. */
function unfold(fan, delay) {
  for (const f of fan.flaps) {
    f.closing = false
    f.el.classList.remove('closing')
    const at = f === fan.root ? delay : delay + 220 + (f.order - 1) * 140
    f.to(0, { dur: (f === fan.root ? 400 : 340) * SLOW, delay: at * SLOW, curve: ease.out })
  }
}

/** Fold a fan back up, outermost flaps first; returns when it's done (ms). */
function refold(fan, delay = 0) {
  const deepest = Math.max(...fan.flaps.map((f) => f.order))
  for (const f of fan.flaps) {
    f.closing = true
    f.el.classList.add('closing')
    const ring = deepest - f.order
    f.to(180, { dur: FOLD * SLOW, delay: (delay + ring * FOLD) * SLOW, curve: ease.inOut })
  }
  return delay + (deepest + 1) * FOLD
}

function makeCloserFan(core) {
  const T = cores.get(core.id)
  const fan = buildCloserFan(sheet, core, T)
  // Folded inside the triangle, the words only show once it has swung past
  // upright — before that they'd be peeking out from under the square.
  fan.root.gate = () => T.angle < 92
  closerFans.set(core.id, fan)
  return fan
}

function makeNeedsFan(core, index) {
  const word = closerFans.get(core.id).flaps[index]
  const needs = core.closer[index].needs.map((key) => C.needs[key])
  const fan = buildNeedsFan(sheet, word, needs, FAMILIES)
  needsFans.set(needsKey(core.id, core.closer[index].id), fan)
  return fan
}

function openCore(core) {
  const fan = closerFans.get(core.id) ?? makeCloserFan(core)
  cores.get(core.id).to(0, { dur: 460 * SLOW, curve: ease.inOut })
  unfold(fan, 330)
}

function closeCore(id) {
  const T = cores.get(id)
  const fan = closerFans.get(id)
  let wait = 0
  for (const key of needsFans.keys()) if (key.startsWith(`${id}/`)) wait = Math.max(wait, closeNeeds(key))
  if (fan) wait = refold(fan, wait)
  T.to(180, {
    dur: 300 * SLOW,
    delay: wait * SLOW,
    curve: ease.inOut,
    done: () => {
      // Only if nobody opened it again while it was folding.
      if (state.core === id || !fan) return
      sheet.remove(fan.root)
      closerFans.delete(id)
      for (const key of [...needsFans.keys()]) if (key.startsWith(`${id}/`)) needsFans.delete(key)
    },
  })
}

function openNeeds(core, index) {
  const key = needsKey(core.id, core.closer[index].id)
  const fan = needsFans.get(key) ?? makeNeedsFan(core, index)
  // Wait for the word itself to finish opening out.
  unfold(fan, settleIn(closerFans.get(core.id).flaps[index]) / SLOW)
}

function closeNeeds(key) {
  const fan = needsFans.get(key)
  if (!fan) return 0
  const took = refold(fan)
  const root = fan.root
  root.tweens[0].done = () => {
    if (needsKey(state.core, state.closer) === key) return
    sheet.remove(root)
    needsFans.delete(key)
  }
  return took
}

/** Unfold the four corner flaps to show the feelings inside. */
function open() {
  if (state.opened) return
  state.opened = true
  covers.forEach((f, i) => {
    f.el.removeAttribute('data-pick')
    f.to(-7, { dur: 820 * SLOW, delay: i * 90 * SLOW, curve: ease.back })
  })
  setTimeout(() => {
    introDone = true
    for (const fn of afterIntro.splice(0)) fn()
  }, (90 * 3 + 600) * SLOW)
  changed()
}

// -------------------------------------------------------------- selection --

function selectCore(id) {
  const core = coreOf(id)
  if (!core) return
  if (state.core === id) return collapseTo(state.closer ? 1 : 0)
  if (state.core) closeCore(state.core)
  Object.assign(state, { core: id, closer: null, need: null })
  openCore(core)
  changed()
}

function selectCloser(id) {
  const { core } = current()
  if (!core) return
  const index = core.closer.findIndex((c) => c.id === id)
  if (index < 0) return
  if (state.closer === id) return collapseTo(state.need ? 2 : 1)
  if (state.closer) closeNeeds(needsKey(state.core, state.closer))
  Object.assign(state, { closer: id, need: null })
  openNeeds(core, index)
  changed()
}

function selectNeed(key) {
  const { closer } = current()
  if (!closer || !closer.needs.includes(key)) return
  state.need = key
  seenFortune = true
  changed()
}

function collapseTo(level) {
  if (level < 3) state.need = null
  if (level < 2 && state.closer) {
    closeNeeds(needsKey(state.core, state.closer))
    state.closer = null
  }
  if (level < 1 && state.core) {
    const id = state.core
    state.core = null
    closeCore(id)
  }
  changed()
}

function pick(kind, id) {
  if (kind === 'core') selectCore(id)
  else if (kind === 'closer') selectCloser(id)
  else if (kind === 'need') selectNeed(id)
}

function changed() {
  refreshLifts()
  renderChoices()
  renderFortune()
  nvcLink.hidden = !seenFortune
  writeHash()
  retarget()
}

// ------------------------------------------------------------ hover & lift --

// Hovering only hints: a folded flap starts to peel up from its inner corner,
// a word or petal tilts up off the table. Nothing opens until a click.
let hover = null // the Flap under the pointer, or under a focused choice
const rippling = new Set()

function refreshLifts() {
  const { core } = current()
  for (const f of covers) {
    // Negative: folded over, the way up off the table is back toward open.
    f.liftTarget = state.opened ? 0 : hover === f ? -15 : rippling.has(f) ? -11 : 0
  }
  for (const f of cores.values()) {
    const sel = state.core === f.id
    f.liftTarget = sel || !state.opened ? 0 : hover === f ? -20 : rippling.has(f) ? -17 : 0
    f.el.classList.toggle('sel', sel)
    f.el.classList.toggle('dim', !!core && !sel)
    f.el.classList.toggle('hov', hover === f && !sel)
  }
  for (const [fan, chosen] of [
    [openCloserFan(), state.closer],
    [openNeedsFan(), state.need],
  ]) {
    if (!fan) continue
    for (const f of fan.flaps) {
      const sel = chosen === f.el.dataset.id
      const isNeed = f.el.dataset.kind === 'need'
      f.liftTarget = hover === f && !sel ? 13 : sel && isNeed ? 8 : 0
      f.el.classList.toggle('sel', sel)
      f.el.classList.toggle('dim', !!chosen && !sel)
      f.el.classList.toggle('hov', hover === f && !sel)
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
  const fan = kind === 'closer' ? openCloserFan() : kind === 'need' ? openNeedsFan() : null
  return fan?.flaps.find((f) => f.el.dataset.id === id) ?? null
}

function flapAt(target) {
  const g = target?.closest?.('[data-pick]')
  const f = g?.__flap ?? null
  return f && !f.closing ? f : null
}

stage.addEventListener('pointermove', (e) => {
  if (e.pointerType === 'touch') return
  setHover(flapAt(e.target))
})
stage.addEventListener('pointerleave', () => setHover(null))
stage.addEventListener('click', (e) => {
  const f = flapAt(e.target)
  if (!f) return
  if (f.kind === 'cover') return open()
  if (introDone) pick(f.el.dataset.kind, f.el.dataset.id)
})

addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || fortune.open || about.open || e.target.closest?.('input')) return
  if (state.closer) collapseTo(1)
  else if (state.core) collapseTo(0)
})

// While it's shut, one flap at a time lifts its tip a little: something in
// here opens. Once open, two opposite corners of the inside lift, then the
// other two — paku, paku — until a feeling is chosen.
let nextCover = 0
setInterval(() => {
  if (state.opened || hover || REDUCED || !covers.length) return
  const f = covers[nextCover++ % covers.length]
  rippling.add(f)
  refreshLifts()
  setTimeout(() => {
    rippling.delete(f)
    refreshLifts()
  }, 650)
}, 2400)

const QUADS = [
  ['scared', 'angry', 'loving', 'calm'],
  ['excited', 'happy', 'tired', 'sad'],
]
setInterval(() => {
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
}, 4200)

// ---------------------------------------------------------------- camera --

// Shut, the fortune teller sits in the middle of the page. Open, the camera
// frames the diamond; once a feeling unfolds on a big screen it pulls back to
// the whole wheel and stays put. On a small screen it follows the unfolding —
// the open fan, then the needs — so the words stay big enough to read.
const FULL = 2 * (G.R2T + 18)
const IDLE = 2 * (2 * G.H + 40) // the square with its four corner flaps open
const view = { x: -FULL / 2, y: -FULL / 2, w: FULL, h: FULL }
let goal = { ...view }
let snap = true

function focusPolys() {
  const H = G.H + 26
  const square = [[-H, -H], [H, H]]
  const words = openCloserFan()
  const needs = openNeedsFan()
  if (words && needs) {
    const sel = words.flaps.find((f) => f.el.dataset.id === state.closer)
    return [sel.poly, ...needs.flaps.map((f) => f.poly)]
  }
  if (words) return [square, cores.get(state.core).poly, ...words.flaps.map((f) => f.poly)]
  const D = 2 * G.H + 20
  return [[[-D, -D], [D, D]]]
}

function retarget() {
  const r = stage.getBoundingClientRect()
  if (!r.width || !r.height) return
  const short = Math.min(r.width, r.height)
  const all = short / FULL
  let s, cx = 0, cy = 0
  if (!state.opened) {
    s = (short * (r.width < 600 ? 0.66 : 0.5)) / (2 * G.H)
  } else if (all >= 0.6) {
    s = state.core ? all : short / IDLE
  } else {
    // Frame what's open, keeping clear of a strip along the top.
    const b = bbox(focusPolys())
    const m = 20
    const top = 44
    s = Math.min(r.width / (b.x1 - b.x0 + 2 * m), (r.height - top) / (b.y1 - b.y0 + 2 * m), 1.3)
    cx = (b.x0 + b.x1) / 2
    cy = (b.y0 + b.y1) / 2 - top / 2 / s
  }
  goal = { x: cx - r.width / s / 2, y: cy - r.height / s / 2, w: r.width / s, h: r.height / s }
}

new ResizeObserver(() => {
  retarget()
  snap = true
}).observe(stage)

let lastBox = ''
function moveCamera() {
  const k = snap ? 1 : REDUCED ? 0.3 : 0.075
  snap = false
  for (const key of ['x', 'y', 'w', 'h']) {
    const d = goal[key] - view[key]
    view[key] = Math.abs(d) < 0.05 ? goal[key] : view[key] + d * k
  }
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

// ---------------------------------------------------------------- fortune --

function needChips(keys) {
  return keys
    .map((k) => {
      const n = C.needs[k]
      return `<button class="chip" type="button" data-need="${esc(k)}" style="--c:${FAMILIES[n.family].color}">${esc(n.name)}</button>`
    })
    .join('')
}

function sentence(core, closer, need) {
  const w = closer.word.toLowerCase()
  return core.met ? C.ui.met(w, need.said) : C.ui.unmet(w, need.said, need.ask)
}

function plain(html) {
  const d = document.createElement('div')
  d.innerHTML = html
  return d.textContent.replace(/\s+/g, ' ').trim()
}

// One path for the eye: a quiet lead-in, the need in big lettering, what it
// means, two short things to do, then the sentence to say.
function renderFortune() {
  const { core, closer, need } = current()
  if (!need) {
    if (fortune.open) fortune.close()
    return
  }
  const ui = C.ui
  const fam = FAMILIES[need.family]
  const w = closer.word.toLowerCase()
  const steps = core.met
    ? [
        [ui.savorLabel, ui.savor],
        [ui.thankLabel, ui.thank],
      ]
    : [
        [ui.tryLabel, esc(need.try)],
        [ui.askLabel, ui.asked(need.ask)],
      ]
  const others = closer.needs.filter((k) => k !== need.key)
  fortune.style.setProperty('--c', fam.color)
  fortune.innerHTML = `
    <div class="sheet-body" tabindex="-1">
      <button class="close" type="button" aria-label="${esc(ui.close)}">×</button>
      <p class="label">${core.met ? ui.leadMet(w) : ui.leadUnmet(w)}</p>
      <h2 class="need"><svg class="fortune-flower" viewBox="-50 -50 100 100" aria-hidden="true">${flowerMarkup(fam.color, { petals: 8, r: 46, turn: -90 })}</svg>${esc(need.name)}</h2>
      <p class="means">${esc(need.means)}</p>
      <dl class="steps">${steps.map(([k, v]) => `<dt class="label">${k}</dt><dd>${v}</dd>`).join('')}</dl>
      <div class="say">
        <p class="label">${ui.sayIt}</p>
        <p class="said">${ui.when[0]}<input id="obs" type="text" autocomplete="off" aria-label="${esc(ui.obsLabel)}" placeholder="${esc(ui.placeholder)}">${ui.when[1]}<span id="said">${sentence(core, closer, need)}</span></p>
        <button class="copy" id="copy" type="button">${ui.copy}</button>
      </div>
      <p class="label also">${ui.others(w)}</p>
      <div class="chips">${needChips(others)}</div>
    </div>`

  const obs = $('#obs', fortune)
  obs.value = observation
  const fit = () => (obs.style.width = `${Math.max(obs.placeholder.length, obs.value.length) * (lang === 'ja' ? 1.05 : 0.55) + 1}em`)
  fit()
  obs.addEventListener('input', () => {
    observation = obs.value
    fit()
  })
  $('#copy', fortune).addEventListener('click', async (e) => {
    const text = `${ui.when[0]}${observation.trim() || '…'}${ui.when[1]}${plain($('#said', fortune).innerHTML)}`
    try {
      await navigator.clipboard.writeText(text)
      e.target.textContent = ui.copied
    } catch {
      // No clipboard here: select the sentence so the reader can copy it.
      const range = document.createRange()
      range.selectNodeContents($('.said', fortune))
      getSelection().removeAllRanges()
      getSelection().addRange(range)
      e.target.textContent = ui.selected
    }
    setTimeout(() => (e.target.textContent = ui.copy), 1600)
  })
  if (!fortune.open) fortune.showModal()
  // The sheet's contents were just replaced; keep focus inside it, on the
  // sheet itself so Tab starts from the top and no ring appears for a mouse.
  $('.sheet-body', fortune).focus()
}

fortune.addEventListener('click', (e) => {
  // A click on the backdrop lands on the dialog itself.
  if (e.target === fortune || e.target.closest('.close')) return fortune.close()
  const b = e.target.closest('[data-need]')
  if (b) selectNeed(b.dataset.need)
})
fortune.addEventListener('close', () => {
  if (state.need) {
    state.need = null
    changed()
  }
})

// ------------------------------------------------------------------ about --

function renderAbout() {
  const rows = C.thoughts
    .map((t) => {
      const core = coreOf(t.feeling[0])
      const closer = core.closer.find((c) => c.id === t.feeling[1])
      const needs = t.needs.map((k) => C.needs[k].name)
      return `<li><button type="button" data-go="${t.feeling.join('/')}" style="--c:${core.color}">${C.ui.thought(t.label, closer.word.toLowerCase(), needs)}</button></li>`
    })
    .join('')
  about.innerHTML = `
    <div class="sheet-body" tabindex="-1">
      <button class="close" type="button" aria-label="${esc(C.ui.close)}">×</button>
      ${C.ui.about}
      <ul class="thoughts">${rows}</ul>
      <p class="small">${C.ui.aboutSmall}</p>
    </div>`
}

nvcLink.addEventListener('click', () => {
  renderAbout()
  about.showModal()
  $('.sheet-body', about).focus()
})
about.addEventListener('click', (e) => {
  if (e.target === about || e.target.closest('.close')) return about.close()
  const b = e.target.closest('[data-go]')
  if (!b) return
  about.close()
  go(b.dataset.go.split('/'))
})

// ---------------------------------------------------------------- choices --

// The same choices as the paper, as buttons: hidden until someone tabs to
// them, for keyboards and screen readers.
function renderChoices() {
  const ui = C.ui
  const { core, closer } = current()
  const had = choices.contains(document.activeElement)
  let label, buttons
  const btn = (attrs, text, color) => `<button type="button" ${attrs}${color ? ` style="--c:${color}"` : ''}>${esc(text)}</button>`
  if (!state.opened) {
    label = ui.title
    buttons = btn('data-act="open"', ui.open)
  } else if (!core) {
    label = ui.pickFeeling
    buttons = C.cores.map((c) => btn(`data-core="${c.id}"`, c.word, c.color)).join('')
  } else if (!closer) {
    label = ui.pickCloser
    buttons = btn('data-act="back"', ui.back) + core.closer.map((c) => btn(`data-closer="${c.id}"`, c.word, core.color)).join('')
  } else {
    label = ui.pickNeed
    buttons = btn('data-act="back"', ui.back) + closer.needs.map((k) => btn(`data-need="${esc(k)}"`, C.needs[k].name, FAMILIES[C.needs[k].family].color)).join('')
  }
  choices.setAttribute('aria-label', label)
  choices.innerHTML = buttons
  if (had) choices.querySelector('button')?.focus()
}

choices.addEventListener('click', (e) => {
  const b = e.target.closest('button')
  if (!b) return
  if (b.dataset.act === 'open') return open()
  if (b.dataset.act === 'back') return collapseTo(state.closer ? 1 : 0)
  whenReady(() => {
    if (b.dataset.core) pick('core', b.dataset.core)
    else if (b.dataset.closer) pick('closer', b.dataset.closer)
    else if (b.dataset.need) pick('need', b.dataset.need)
  })
})
choices.addEventListener('focusin', (e) => {
  const b = e.target.closest('button')
  setHover(b?.dataset.core ? flapFor('core', b.dataset.core) : b?.dataset.closer ? flapFor('closer', b.dataset.closer) : b?.dataset.need ? flapFor('need', b.dataset.need) : null)
})
choices.addEventListener('focusout', () => setHover(null))

// --------------------------------------------------------------- language --

function renderChrome() {
  document.documentElement.lang = lang
  document.title = C.ui.title
  stage.setAttribute('aria-label', C.ui.stage)
  nvcLink.textContent = C.ui.nvcLink
  for (const b of document.querySelectorAll('#lang button')) b.setAttribute('aria-pressed', String(b.dataset.lang === lang))
}

async function loadFonts() {
  // Labels are measured to fit their flap, so the faces have to be here first.
  // Don't wait forever for them, though.
  const faces = [document.fonts.load('20px "Patrick Hand"')]
  if (lang === 'ja') faces.push(document.fonts.load('20px "Klee One"', 'あ'))
  await Promise.race([Promise.all(faces), new Promise((r) => setTimeout(r, 1500))])
}

/** Draw all the paper for the current language, in the state it's in now. */
function build() {
  for (const r of [...sheet.roots]) sheet.remove(r)
  closerFans.clear()
  needsFans.clear()
  cores = new Map(buildCores(sheet, C.cores).map((f) => [f.id, f]))
  covers = buildCovers(sheet, C.ui.cover)
  if (state.opened) {
    for (const f of covers) {
      f.angle = -7
      f.el.removeAttribute('data-pick')
    }
  }
  const { core } = current()
  if (core) {
    cores.get(core.id).angle = 0
    for (const f of makeCloserFan(core).flaps) f.angle = 0
    if (state.closer) {
      const index = core.closer.findIndex((c) => c.id === state.closer)
      for (const f of makeNeedsFan(core, index).flaps) f.angle = 0
    }
  }
  hover = null
  renderChrome()
  refreshLifts()
  renderChoices()
}

async function setLang(next) {
  if (next === lang || !LANGS.includes(next)) return
  lang = next
  saveLang(next)
  C = content(next)
  await loadFonts()
  build()
  if (fortune.open) renderFortune()
  if (about.open) renderAbout()
}

$('#lang').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-lang]')
  if (b) setLang(b.dataset.lang)
})

// ------------------------------------------------------------------- hash --

function writeHash() {
  const parts = [state.core, state.closer, state.need].filter(Boolean).map(encodeURIComponent)
  const url = parts.length ? `#${parts.join('/')}` : location.pathname + location.search
  // A sandboxed host (the claude.ai artifact viewer) may refuse to touch its
  // history. The link is a convenience; the page works the same without it.
  try {
    history.replaceState(null, '', url)
  } catch {}
}

// Open a path like ['sad', 'lonely', 'companionship'] one fold at a time.
// Each step can start right away: a needs fan waits for its word to open.
function go(path) {
  whenReady(() => {
    const [c, cl, n] = path
    if (!coreOf(c)) return
    if (state.core !== c) pick('core', c)
    if (cl && state.closer !== cl) pick('closer', cl)
    if (n && state.need !== n) pick('need', n)
  })
}

function whenReady(fn) {
  if (introDone) return fn()
  afterIntro.push(fn)
  open()
}

// ------------------------------------------------------------------- start --

async function start() {
  await loadFonts()
  build()
  retarget()
  snap = true
  requestAnimationFrame(loop)
  const path = decodeURIComponent(location.hash.slice(1)).split('/').filter(Boolean)
  if (path.length) go(path)
}

start()
