import { h, $ } from './dom.js'
import { NATIVE } from './metrics.js'

const ROWS = [
  ['text-box-trim: trim-both', 'CSS Inline 3', () => NATIVE.trim],
  ['text-box (shorthand)', 'CSS Inline 3', () => NATIVE.shorthand],
  ['text-box-edge: text', 'CSS Inline 3', () => NATIVE.edge.text],
  ['text-box-edge: cap', 'CSS Inline 3', () => NATIVE.edge.cap],
  ['text-box-edge: ex', 'CSS Inline 3', () => NATIVE.edge.ex],
  ['text-box-edge: alphabetic', 'CSS Inline 3', () => NATIVE.edge.alphabetic],
  ['text-box-edge: ideographic', 'deferred', () => NATIVE.edge.ideographic],
  ['text-box-edge: ideographic-ink', 'deferred', () => NATIVE.edge['ideographic-ink']],
]

const POLYFILL = `// text-box-trim, done by hand — the whole of it.
//
// A line box is  half-leading + ascent + descent + half-leading.
// Trimming means deleting everything above the over edge and below
// the under edge, which is a negative margin on each side.

const { ascent, descent } = usedMetrics(font)   // canvas fontBoundingBox
const half = (lineHeight - (ascent + descent)) / 2

const top    = half + ascent  - overEdge        // em to remove above
const bottom = half + descent + underEdge       // em to remove below

el.style.marginBlockStart = \`\${-top}em\`
el.style.marginBlockEnd   = \`\${-bottom}em\`

// The edges themselves, in em above the alphabetic baseline:
//
//   text             ascent                     / -descent
//   cap              OS/2 sCapHeight
//   ex               OS/2 sxHeight
//   alphabetic                                  / 0
//   ideographic      BASE ideo + 1em            / BASE ideo
//   ideographic-ink  BASE icft                  / BASE icfb
//
// The last two need the font binary: no browser API reports icft/icfb,
// and ideographicBaseline only gives you ideo.`

export function mountSupport () {
  const tbody = $('#support-table tbody')
  tbody.replaceChildren(...ROWS.map(([value, spec, test]) => {
    const ok = test()
    return h('tr', {},
      h('td', {}, value),
      h('td', { style: { fontSize: '.74rem', color: 'var(--ink-3)' } }, spec),
      h('td', { class: ok ? 'yes' : 'no', style: { fontFamily: 'var(--mono)', fontSize: '.74rem' } },
        ok ? '✓ supported' : '✗ not supported'),
    )
  }))
  $('#polyfill-src').textContent = POLYFILL
}
