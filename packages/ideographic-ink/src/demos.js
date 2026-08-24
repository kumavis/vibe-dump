// The payoff: once the character face is a number you hold, it becomes an
// anchor. Each demo below is driven by the same BASE-table metrics the rest of
// the page draws — nothing here is eyeballed.
import { h, $, fmt } from './dom.js'
import { FONT_METRICS, usedMetrics, emBox, faceBox, edgePosition, inkExtents } from './metrics.js'
import { store } from './store.js'

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// One rAF loop for every demo on the page.
const tickers = new Set()
let running = false
function tick (now) {
  for (const fn of tickers) fn(now / 1000)
  if (tickers.size) requestAnimationFrame(tick)
  else running = false
}
function addTicker (fn) {
  tickers.add(fn)
  if (!running) { running = true; requestAnimationFrame(tick) }
  return () => tickers.delete(fn)
}

function card ({ ja, en, blurb, dark, body, foot }) {
  return h('div', { class: `demo${dark ? ' dark' : ''}` },
    h('div', { class: 'demo-head' },
      h('h3', {}, h('b', {}, ja), en),
      h('p', {}, blurb)),
    h('div', { class: 'demo-body' }, body),
    h('div', { class: 'demo-foot' }, ...foot),
  )
}

// ── 1 · ink rises through the em box ──────────────────────────────────────
function inkRise () {
  const font = FONT_METRICS['yuji-syuku']
  const box = emBox(font)
  const face = faceBox(font)
  const STAGE = 1.6
  const used = usedMetrics(font)
  const base = (STAGE - (used.ascent + used.descent)) / 2 + used.ascent

  const stage = h('div', {
    class: 'stage rise-stage',
    vars: { '--stage-em': String(STAGE), '--base': String(base), '--fs': 'clamp(96px, 15vw, 124px)' },
  })
  const faint = h('div', { class: 'stage-glyph rise-faint' }, '墨')
  const fill = h('div', { class: 'stage-glyph rise-fill' }, '墨')
  const level = h('div', { class: 'mrule rise-level' })
  const tickTop = h('div', { class: 'mrule m-face', vars: { '--y1': String(face.over) } },
    h('div', { class: 'mtag mtag--rule' }, 'icft'))
  const tickBottom = h('div', { class: 'mrule m-face', vars: { '--y1': String(face.under) } },
    h('div', { class: 'mtag mtag--rule' }, 'icfb'))
  for (const el of [faint, fill]) el.style.fontFamily = `"${font.family}"`
  stage.append(tickTop, tickBottom, faint, fill, level)

  const readout = h('span', { class: 'badge' })

  const setLevel = (y) => {
    const top = (base - y) // em from the stage top
    fill.style.clipPath = `inset(calc(${top} * 1em) 0 0 0)`
    level.style.setProperty('--y1', String(y))
    const pct = ((y - face.under) / face.height) * 100
    readout.textContent = `ink line ${fmt(y, 3)}em · ${
      y < face.under ? 'below the face' : y > face.over ? 'above the face' : `${pct.toFixed(0)}% up the 字面`}`
  }

  if (reduced) setLevel(face.over)
  else addTicker((t) => {
    const p = (Math.sin(t * 0.55) + 1) / 2
    setLevel(box.under + p * (box.over - box.under))
  })

  return card({
    ja: '墨満', en: 'Ink rise',
    blurb: 'The fill sweeps the full em box. The two red rules are where this brush face declares its ink should live — 71% of the square, the lowest of the six.',
    body: stage,
    foot: [readout, h('span', { class: 'badge' }, 'Yuji Syuku · 字面率 71.0%')],
  })
}

// ── 2 · a highlighter that knows where the ink is ─────────────────────────
function marker () {
  const wrap = h('div', { class: 'marker' })
  const swipe = h('div', { class: 'swipe' })
  const text = h('div', { class: 'mtxt' }, '花鳥風月')
  wrap.append(swipe, text)

  const state = { mode: 'face', auto: !reduced }
  const label = h('span', { class: 'badge' })
  const button = h('button', {
    class: 'btn', type: 'button',
    onClick: () => {
      state.auto = false
      state.mode = state.mode === 'face' ? 'text' : 'face'
      button.textContent = 'compare'
      apply()
    },
  }, 'compare')

  function apply () {
    const font = store.font
    const used = usedMetrics(font)
    const face = faceBox(font) ?? { over: used.ascent, under: -used.descent }
    const lh = 2.2
    const base = (lh - (used.ascent + used.descent)) / 2 + used.ascent
    const over = state.mode === 'face' ? face.over : used.ascent
    const under = state.mode === 'face' ? face.under : -used.descent
    wrap.style.fontFamily = `"${font.family}"`
    text.style.fontFamily = `"${font.family}"`
    swipe.style.top = `${(base - over)}em`
    swipe.style.height = `${(over - under)}em`
    label.textContent = state.mode === 'face'
      ? `字面 · ${fmt(over - under, 3)}em tall`
      : `line box · ${fmt(over - under, 3)}em tall`
    label.className = `badge ${state.mode === 'face' ? 'good' : 'warn'}`
  }

  if (state.auto) {
    let last = 0
    addTicker((t) => {
      if (t - last < 2.4) return
      last = t
      if (!state.auto) return
      state.mode = state.mode === 'face' ? 'text' : 'face'
      apply()
    })
  }
  store.onFont(apply)
  apply()

  return card({
    ja: '蛍光', en: 'Honest highlighter',
    blurb: 'A highlight sized to the line box swallows the gaps between lines. Sized to the character face it hugs the writing — the same fix as a marker pen held by someone who can see.',
    body: wrap,
    foot: [label, button],
  })
}

// ── 3 · a poster you can only set with real metrics ───────────────────────
function stack () {
  const font = FONT_METRICS['rampart-one']
  const rows = ['花', '鳥', '風', '月']
  const wrap = h('div', { class: 'stack' })
  const els = rows.map((r) => {
    const el = h('span', { class: 'row' }, r)
    el.style.fontFamily = `"${font.family}"`
    return el
  })
  wrap.append(...els)

  const slider = h('input', { type: 'range', min: '0', max: '100', value: '0', class: 'stack-range' })
  const readout = h('span', { class: 'badge' })

  const used = usedMetrics(font)
  const box = emBox(font)
  const face = faceBox(font)
  const lh = 1.15

  function apply () {
    const p = slider.value / 100
    // Interpolate the edge pair from the content area toward the character
    // face, and trim to wherever we currently are.
    const over = used.ascent + p * (face.over - used.ascent)
    const under = -used.descent + p * (face.under + used.descent)
    const half = (lh - (used.ascent + used.descent)) / 2
    const top = half + used.ascent - over
    const bottom = half + used.descent + under
    for (const el of els) {
      el.style.lineHeight = String(lh)
      el.style.marginBlockStart = `${-top}em`
      el.style.marginBlockEnd = `${-bottom}em`
    }
    const pitch = lh - top - bottom
    readout.textContent = `row pitch ${fmt(pitch, 3)}em · ${
      p < 0.02 ? 'untrimmed' : p > 0.98 ? 'flush to 字面' : `${(p * 100).toFixed(0)}% toward 字面`}`
    // Mark where the em box would land, for reference.
    wrap.style.setProperty('--em-pitch', fmt(box.over - box.under, 3))
  }
  slider.addEventListener('input', apply)
  apply()

  return card({
    ja: '積層', en: 'Stack it flush',
    blurb: 'Drag to pull four display glyphs from their default leading down onto their own ink. There is no magic number to guess — the stopping point is written in the font.',
    dark: true,
    body: wrap,
    foot: [slider, readout],
  })
}

// ── 4 · animating a property that cannot animate ──────────────────────────
function breathing () {
  const wrap = h('div', { class: 'breathe' })
  const box = h('div', { class: 'bx' })
  const text = h('div', { class: 'bt' }, '呼吸')
  wrap.append(box, text)
  const readout = h('span', { class: 'badge' })

  // Cycle through three edge pairs, tweening the numbers between them.
  const KEYS = [
    ['text', 'text'],
    ['ideographic', 'ideographic'],
    ['ideographic-ink', 'ideographic-ink'],
  ]

  function apply (t) {
    const font = store.font
    const used = usedMetrics(font)
    const lh = 1.7
    const base = (lh - (used.ascent + used.descent)) / 2 + used.ascent
    wrap.style.fontFamily = `"${font.family}"`
    text.style.lineHeight = String(lh)

    const cycle = reduced ? 1.5 : (t * 0.28) % KEYS.length
    const i = Math.floor(cycle)
    const f = 0.5 - 0.5 * Math.cos(Math.min(1, (cycle - i) * 1.6) * Math.PI)
    const a = KEYS[i]
    const b = KEYS[(i + 1) % KEYS.length]
    const lerp = (x, y) => x + (y - x) * f
    const over = lerp(edgePosition(font, a[0], 'over'), edgePosition(font, b[0], 'over'))
    const under = lerp(edgePosition(font, a[1], 'under'), edgePosition(font, b[1], 'under'))

    box.style.top = `${base - over}em`
    box.style.height = `${over - under}em`
    box.style.width = `${inkExtents(font, '呼吸')?.advance ?? 2}em`
    readout.textContent = `over ${fmt(over, 3)} · under ${fmt(under, 3)} · ${fmt(over - under, 3)}em`
  }

  if (reduced) apply(0)
  else addTicker(apply)
  store.onFont(() => apply(performance.now() / 1000))

  return card({
    ja: '呼吸', en: 'Breathe between edges',
    blurb: 'text-box-edge takes keywords, and keywords are discrete — CSS cannot tween one into another. Metrics are numbers, and numbers tween. This box is drifting continuously between all three edge pairs.',
    body: wrap,
    foot: [readout, h('span', { class: 'badge warn' }, 'not expressible in CSS today')],
  })
}

export function mountDemos () {
  $('#demos').append(inkRise(), marker(), stack(), breathing())
}
