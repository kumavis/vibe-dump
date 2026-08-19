import { h, $, segmented, fmt } from './dom.js'
import {
  OVER_EDGES, UNDER_EDGES, EDGE_INFO, FONT_LIST,
  trimOffsets, applyPolyfill, nativelySupported, NATIVE, cssFor,
} from './metrics.js'
import { store } from './store.js'

const SAMPLE_JA = ['静かな朝に雪が降り', '文字の箱を切り揃える']
const SAMPLE_MIX = ['CSS で 文字の箱 を', 'trim する Typography']

export function mountPlayground () {
  const state = {
    engine: 'polyfill',
    trim: 'trim-both',
    over: 'ideographic',
    under: 'ideographic',
    lineHeight: 1.8,
    latin: false,
  }

  const target = $('#pg-target')
  const ghost = $('#pg-ghost')
  const cssOut = $('#pg-css')
  const badges = $('#pg-badges')

  const copyBtn = h('button', {
    class: 'btn copy-btn', type: 'button',
    onClick: async () => {
      try {
        await navigator.clipboard.writeText(cssOut.textContent)
        copyBtn.textContent = 'copied'
        setTimeout(() => { copyBtn.textContent = 'copy' }, 1400)
      } catch { copyBtn.textContent = 'select it' }
    },
  }, 'copy')
  cssOut.parentElement.prepend(copyBtn)

  // ── controls ─────────────────────────────────────────────────────────
  const edgeOption = (value) => ({
    value,
    label: value,
    warn: NATIVE.edge[value] ? null : 'no engine implements this value yet',
    title: `${EDGE_INFO[value].ja} · ${EDGE_INFO[value].tag}\n${EDGE_INFO[value].blurb}`,
  })

  $('#pg-engine').replaceWith(segmented({
    label: 'Engine',
    options: [
      { value: 'polyfill', label: 'polyfill', title: 'This page does the trim with negative margins, from the font’s own metrics.' },
      { value: 'native', label: 'native CSS', title: 'Hand the declaration to the browser and see what it really does.' },
    ],
    value: state.engine,
    onChange: (v) => { state.engine = v; update() },
  }))

  $('#pg-trim').replaceWith(segmented({
    label: 'text-box-trim',
    options: ['none', 'trim-start', 'trim-end', 'trim-both'].map((v) => ({ value: v, label: v })),
    value: state.trim,
    onChange: (v) => { state.trim = v; update() },
  }))

  $('#pg-over').replaceWith(segmented({
    label: 'over edge', accent: 'em',
    options: OVER_EDGES.map(edgeOption),
    value: state.over,
    onChange: (v) => { state.over = v; update() },
  }))

  $('#pg-under').replaceWith(segmented({
    label: 'under edge', accent: 'em',
    options: UNDER_EDGES.map(edgeOption),
    value: state.under,
    onChange: (v) => { state.under = v; update() },
  }))

  const lh = $('#pg-lh')
  const lhOut = $('#pg-lh-out')
  lh.addEventListener('input', () => { state.lineHeight = lh.value / 100; update() })

  const fontSel = $('#pg-font')
  fontSel.append(...FONT_LIST.map((f) => h('option', { value: f.key, selected: f.key === store.font.key }, `${f.family} — ${f.labelJa}`)))
  fontSel.addEventListener('change', () => {
    store.setFont(FONT_LIST.find((f) => f.key === fontSel.value))
  })
  store.onFont((f) => { fontSel.value = f.key; update() })

  $('#pg-text-toggle').addEventListener('change', (e) => { state.latin = e.target.checked; update() })

  // ── render ───────────────────────────────────────────────────────────
  function update () {
    const font = store.font
    lhOut.textContent = state.lineHeight.toFixed(2)

    target.style.fontFamily = `"${font.family}"`
    target.style.lineHeight = String(state.lineHeight)
    target.style.fontSize = 'clamp(20px, 3.4vw, 34px)'
    const lines = state.latin ? SAMPLE_MIX : SAMPLE_JA
    target.replaceChildren(...lines.map((t) => h('span', { class: 'pg-line' }, t)))

    const supported = nativelySupported(state)
    const offsets = trimOffsets(font, state)
    let applied = { top: 0, bottom: 0 }

    // Always reset both mechanisms before choosing one.
    target.style.marginBlockStart = ''
    target.style.marginBlockEnd = ''
    target.style.textBoxTrim = ''
    target.style.textBoxEdge = ''

    if (state.engine === 'native') {
      target.style.textBoxTrim = state.trim
      target.style.textBoxEdge = state.over === state.under ? state.over : `${state.over} ${state.under}`
      if (supported && state.trim !== 'none') {
        applied = {
          top: state.trim === 'trim-end' ? 0 : offsets.top,
          bottom: state.trim === 'trim-start' ? 0 : offsets.bottom,
        }
      }
    } else {
      applied = applyPolyfill(target, font, state)
    }

    // The ghost is the line box as it would have been, drawn around the box
    // as it now is.
    requestAnimationFrame(() => {
      const fs = parseFloat(getComputedStyle(target).fontSize)
      const frame = target.closest('.pg-frame')
      const r = target.getBoundingClientRect()
      const fr = frame.getBoundingClientRect()
      ghost.style.display = applied.top || applied.bottom ? 'block' : 'none'
      ghost.style.top = `${r.top - fr.top - applied.top * fs}px`
      ghost.style.height = `${r.height + (applied.top + applied.bottom) * fs}px`
    })

    // ── the declaration ────────────────────────────────────────────────
    const decl = cssFor(state)
    const code = [
      `<span class="c">/* ${font.family} · line-height ${state.lineHeight.toFixed(2)} */</span>`,
      `<span class="k">.headline</span> {`,
      `  <span class="k">font-family</span>: <span class="v">"${font.family}"</span>;`,
      `  <span class="k">line-height</span>: <span class="v">${state.lineHeight.toFixed(2)}</span>;`,
      `  <span class="k">${decl.split(':')[0]}</span>:<span class="v">${decl.split(':').slice(1).join(':')}</span>`,
      `}`,
    ]
    if (state.engine === 'polyfill' && state.trim !== 'none') {
      code.push(
        '',
        `<span class="c">/* what this page actually applied */</span>`,
        `<span class="k">margin-block</span>: <span class="v">${fmt(-applied.top, 3)}em ${fmt(-applied.bottom, 3)}em</span>;`,
      )
    }
    cssOut.innerHTML = code.join('\n')

    // ── badges ─────────────────────────────────────────────────────────
    const removed = applied.top + applied.bottom
    const chips = []
    if (state.trim === 'none') {
      chips.push(['badge', 'nothing trimmed'])
    } else if (state.engine === 'native' && !supported) {
      const missing = [state.over, state.under].filter((e) => !NATIVE.edge[e])
      chips.push(['badge warn', NATIVE.trim
        ? `△ your browser ignores ${[...new Set(missing)].join(' + ')}`
        : '△ your browser has no text-box-trim'])
      chips.push(['badge', 'the box below is untouched'])
    } else {
      chips.push(['badge good', state.engine === 'native' ? '✓ native' : '✓ polyfilled'])
      chips.push(['badge', `−${fmt(removed, 3)}em removed (${(removed / (state.lineHeight * lines.length) * 100).toFixed(0)}% of the block)`])
    }
    badges.replaceChildren(...chips.map(([cls, text]) => h('span', { class: cls }, text)))
  }

  update()
  window.addEventListener('resize', update)
}
