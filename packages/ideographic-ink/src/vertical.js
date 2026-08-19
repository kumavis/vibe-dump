import { h, $, segmented, fmt } from './dom.js'
import { emBox, faceBox, usedMetrics } from './metrics.js'
import { store } from './store.js'

const LINES = ['春の雪', '静かに降る', '花と鳥と', '風と月と']

export function mountVertical () {
  const host = $('#vert')
  const state = { mode: 'none' }

  const stack = h('div', { class: 'vstack' })
  const stage = h('div', { class: 'vert-stage' }, stack)
  const readout = h('p', { class: 'footnote' })

  const control = segmented({
    label: 'trim the column to',
    accent: 'face',
    options: [
      { value: 'none', label: 'nothing' },
      { value: 'ideographic', label: 'em box' },
      { value: 'ideographic-ink', label: 'character face' },
    ],
    value: state.mode,
    onChange: (v) => { state.mode = v; render() },
  })

  const side = h('div', { class: 'vert-side' },
    control,
    h('p', { class: 'footnote' },
      'In ', h('code', {}, 'writing-mode: vertical-rl'), ' the over and under edges become ',
      'right and left. The bands are drawn from the same font metrics as everywhere ',
      'else on this page — the blue column is the em box, the red one the character ',
      'face — and trimming pulls the columns together by exactly the slack you can see. ',
      'Trim to the face and the gutter is gone entirely: that is the point. You take ',
      'the font’s built-in guess away, then set the gap you actually wanted.'),
    readout,
  )

  host.append(stage, side)

  function render () {
    const font = store.font
    const used = usedMetrics(font)
    const box = emBox(font)
    const face = faceBox(font)
    const boxW = box.over - box.under
    const faceW = face ? face.width : boxW

    stack.replaceChildren(...LINES.map((line) => {
      const col = h('div', { class: 'vcol' },
        h('div', { class: 'vband v-em', vars: { '--w': String(boxW) } }),
        face && h('div', { class: 'vband v-face', vars: { '--w': String(faceW) } }),
        h('div', { class: 'vtext' }, line),
      )
      col.style.fontFamily = `"${font.family}"`
      return col
    }))

    // Trimming a vertical column is the same maths, one axis over: the column's
    // inline size is its line-height, and the slack sits either side of the
    // chosen edge pair.
    const lineHeight = 2
    const slack = (target) => (lineHeight - target) / 2
    const trimmed = state.mode === 'none' ? 0
      : state.mode === 'ideographic' ? slack(boxW)
        : slack(faceW)

    for (const col of stack.children) {
      col.style.marginBlockStart = `${-trimmed}em`
      col.style.marginBlockEnd = `${-trimmed}em`
    }

    const gutter = lineHeight - 2 * trimmed
    readout.innerHTML = `Column pitch <b>${fmt(gutter, 3)}em</b> · em box
      <b>${fmt(boxW, 3)}em</b> · face <b>${fmt(faceW, 3)}em</b> · the browser
      reserves <b>${fmt(used.ascent + used.descent, 3)}em</b> per horizontal line
      of the same font.`
  }

  store.onFont(render)
  render()
}
