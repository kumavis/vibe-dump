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

const coreById = new Map(CORES.map((c) => [c.id, c]))

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
$('#under').innerHTML = baseMarkup(CORES, flowerMarkup)
$('#garden').innerHTML = gardenMarkup()

const sheet = new Sheet($('#sheet'))

// ------------------------------------------------------------------ state --

const state = { core: null, closer: null, need: null }
let cores = new Map() // id → the core's triangle Flap
let covers = []
// Folded-up fans stay attached to their parent while they fold away, so a
// quick change of mind can open the same paper again instead of a copy.
const closerFans = new Map() // core id → fan
const needsFans = new Map() // "core/closer" → fan
let introDone = false
const afterIntro = []
let observation = ''

const needsKey = (core, closer) => `${core}/${closer}`

function current() {
  const core = state.core ? coreById.get(state.core) : null
  const closer = core && state.closer ? core.closer.find((c) => c.id === state.closer) : null
  const need = closer && state.need ? NEEDS[state.need] : null
  return { core, closer, need }
}

const openCloserFan = () => (state.core ? closerFans.get(state.core) : null)
const openNeedsFan = () => (state.closer ? needsFans.get(needsKey(state.core, state.closer)) : null)

// ----------------------------------------------------------------- folding --

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

/** Fold a fan back up onto its parent; returns how long that takes (ms). */
function refold(fan, delay = 0) {
  const deepest = Math.max(...fan.flaps.map((f) => f.order))
  for (const f of fan.flaps) {
    f.closing = true
    f.el.classList.add('closing')
    if (f !== fan.root) f.to(180, { dur: 230 * SLOW, delay: (delay + (deepest - f.order) * 40) * SLOW, curve: ease.inOut })
  }
  const rootAt = delay + Math.max(0, deepest - 1) * 40 + 110
  fan.root.to(180, { dur: 260 * SLOW, delay: rootAt * SLOW, curve: ease.inOut })
  return rootAt + 260
}

function openCore(core) {
  const T = cores.get(core.id)
  let fan = closerFans.get(core.id)
  if (!fan) {
    fan = buildCloserFan(sheet, core, T)
    // Folded inside the triangle, the words only show once it has swung past
    // upright — before that they'd be peeking out from under the square.
    fan.root.gate = () => T.angle < 92
    closerFans.set(core.id, fan)
  }
  T.to(0, { dur: 460 * SLOW, curve: ease.inOut })
  unfold(fan, 330)
}

function closeCore(id) {
  const T = cores.get(id)
  const fan = closerFans.get(id)
  let wait = 0
  for (const key of needsFans.keys()) if (key.startsWith(`${id}/`)) wait = Math.max(wait, closeNeeds(key))
  if (fan) wait = refold(fan, wait)
  T.to(180, {
    dur: 380 * SLOW,
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
  const word = closerFans.get(core.id).flaps[index]
  const key = needsKey(core.id, core.closer[index].id)
  let fan = needsFans.get(key)
  if (!fan) {
    const needs = core.closer[index].needs.map((name) => ({ name, ...NEEDS[name] }))
    fan = buildNeedsFan(sheet, word, needs, FAMILIES)
    needsFans.set(key, fan)
  }
  // Wait for the word itself to finish opening out.
  unfold(fan, settleIn(word) / SLOW)
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

// -------------------------------------------------------------- selection --

function selectCore(id) {
  const core = coreById.get(id)
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

function selectNeed(name) {
  const { closer } = current()
  if (!closer || !closer.needs.includes(name)) return
  if (state.need === name) return collapseTo(2)
  state.need = name
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
  renderPanel()
  writeHash()
  retarget()
}

// ------------------------------------------------------------ hover & lift --

// Hovering only hints: a folded triangle starts to peel up from its inner
// corner, a word or petal tilts up off the table. Nothing opens until a click.
let hover = null // the Flap under the pointer, or under a hovered chip
const rippling = new Set()

function refreshLifts() {
  const { core } = current()
  for (const f of cores.values()) {
    const sel = state.core === f.id
    // Negative: folded over, the way up off the table is back toward open.
    f.liftTarget = sel ? 0 : hover === f ? -20 : rippling.has(f) ? -17 : 0
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
  if (!f || !introDone) return
  pick(f.el.dataset.kind, f.el.dataset.id)
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
    // Frame what's open, keeping clear of the title strip along the top.
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
  const k = snap ? 1 : REDUCED ? 0.3 : 0.085
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

// The fill-in NVC sentence after the "When ___," blank.
function sentence(core, closer, name) {
  const need = NEEDS[name]
  const word = closer.word.toLowerCase()
  const what = esc(said(name))
  if (core.met) {
    const tail = what.startsWith('to ') ? `to <b>${what.slice(3)}</b>` : `for <b>${what}</b>`
    return `I felt <b>${word}</b>, because it met my need ${tail}. Thank you!`
  }
  return `I feel <b>${word}</b>, because I need <b>${what}</b>. Would you be willing to ${esc(need.ask)}?`
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
  const lead = core.met ? `Feeling ${word} says this need is being met:` : `Under ${word} there may be a need for`
  const steps = core.met
    ? [
        ['Savor', 'Notice where the feeling sits in your body, and what helped it happen.'],
        ['Thank', 'If someone helped meet this need, tell them.'],
      ]
    : [
        ['Try', esc(need.try)],
        ['Ask', `“Would you be willing to ${esc(need.ask)}?”`],
      ]
  const others = closer.needs.filter((n) => n !== name)
  return `
    <article class="fortune" style="--c:${fam.color}">
      <p class="label">${lead}</p>
      <h2 class="need"><svg class="fortune-flower" viewBox="-50 -50 100 100" aria-hidden="true">${flowerMarkup(fam.color, { petals: 8, r: 46, turn: -90 })}</svg>${esc(name)}</h2>
      <p class="means">${esc(need.means)}</p>
      <dl class="steps">${steps.map(([k, v]) => `<dt class="label">${k}</dt><dd>${v}</dd>`).join('')}</dl>
      <div class="say">
        <p class="label">Say it the NVC way</p>
        <p class="said">When <input id="obs" type="text" autocomplete="off" aria-label="What happened, just the facts" placeholder="this happened">, <span id="said">${sentence(core, closer, name)}</span></p>
        <button class="copy" id="copy" type="button">Copy</button>
      </div>
    </article>
    <p class="label also">Other needs under ${word}</p>
    <div class="chips">${needChips(others)}</div>`
}

let shownNeed = null

function renderPanel() {
  const { core, closer, need } = current()
  let body
  if (!core) body = introNote()
  else if (!closer) body = coreNote(core)
  else if (!need) body = closerNote(core, closer)
  else body = fortuneNote(core, closer, state.need)
  note.innerHTML = crumbs() + body

  const obs = $('#obs', note)
  if (obs) {
    obs.value = observation
    const fit = () => (obs.style.width = `${Math.max(obs.placeholder.length, obs.value.length) + 1}ch`)
    fit()
    obs.addEventListener('input', () => {
      observation = obs.value
      fit()
    })
    $('#copy', note).addEventListener('click', async (e) => {
      const text = `When ${observation.trim() || '…'}, ${plain($('#said', note).innerHTML)}`
      try {
        await navigator.clipboard.writeText(text)
        e.target.textContent = 'Copied'
      } catch {
        // No clipboard here: select the sentence so the reader can copy it.
        const range = document.createRange()
        range.selectNodeContents($('.said', note))
        getSelection().removeAllRanges()
        getSelection().addRange(range)
        e.target.textContent = 'Selected — copy it'
      }
      setTimeout(() => (e.target.textContent = 'Copy'), 1600)
    })
  }
  // On a small screen the note sits under the paper; bring a new fortune up.
  if (need && state.need !== shownNeed && panel.scrollHeight > panel.clientHeight) {
    panel.scrollTo({ top: 0, behavior: REDUCED ? 'auto' : 'smooth' })
  }
  shownNeed = state.need
}

// Chips in the panel do what the paper does, and point at their flap.
note.addEventListener('click', (e) => {
  const b = e.target.closest('button')
  if (!b) return
  if (b.dataset.level != null) return collapseTo(Number(b.dataset.level))
  if (b.dataset.core) return whenReady(() => pick('core', b.dataset.core))
  if (b.dataset.closer) return pick('closer', b.dataset.closer)
  if (b.dataset.need) return pick('need', b.dataset.need)
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
    go([c, cl])
  })
}

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
    if (!coreById.has(c)) return
    if (state.core !== c) pick('core', c)
    if (cl && state.closer !== cl) pick('closer', cl)
    if (n && state.need !== n) pick('need', n)
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
  if (path.length) go(path)
}

$('#refold').addEventListener('click', () => {
  collapseTo(0)
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
