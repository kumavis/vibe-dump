import { h, $, fmt } from './dom.js'
import { createStage, LAYERS } from './stage.js'
import { usedMetrics, emBox, faceBox } from './metrics.js'
import { store } from './store.js'

const GLYPHS = ['永', '字', '日', '花', 'の', 'ア', '東京', 'Ag']

export function mountAnatomy () {
  const host = $('#anatomy-stage')
  const stage = createStage({ font: store.font, text: '永' })
  host.replaceWith(stage.root)
  stage.root.id = 'anatomy-stage'

  // size ----------------------------------------------------------------
  const size = $('#anatomy-size')
  const sizeOut = $('#anatomy-size-out')
  const applySize = () => {
    stage.root.style.setProperty('--fs', `${size.value}px`)
    sizeOut.textContent = `${size.value}px`
  }
  size.addEventListener('input', applySize)
  applySize()

  // glyph picker --------------------------------------------------------
  const glyphHost = $('#anatomy-glyphs')
  const glyphButtons = GLYPHS.map((g) => h('button', {
    class: `glyph-btn${g === '永' ? ' on' : ''}`,
    type: 'button',
    style: g.length > 1 ? { width: 'auto', padding: '0 .5rem', fontSize: '.95rem' } : null,
    onClick: () => {
      for (const b of glyphButtons) b.classList.toggle('on', b.textContent === g)
      stage.setText(g)
      refreshTable()
    },
  }, g))
  glyphHost.append(...glyphButtons)

  // layer toggles -------------------------------------------------------
  const enabled = new Set(['text', 'em', 'face', 'baseline'])
  const layerHost = $('#anatomy-layers')
  for (const layer of LAYERS) {
    const btn = h('button', {
      class: 'layer', type: 'button',
      'aria-pressed': String(enabled.has(layer.id)),
      style: { color: layer.color },
      onClick: () => {
        enabled.has(layer.id) ? enabled.delete(layer.id) : enabled.add(layer.id)
        btn.setAttribute('aria-pressed', String(enabled.has(layer.id)))
        stage.setLayers([...enabled])
      },
    },
      h('span', { class: `swatch${layer.id === 'em' || layer.id === 'face' ? ' filled' : ''}` }),
      h('span', { class: 'name' },
        h('span', {}, layer.name),
        h('em', {}, `${layer.css}  ·  ${layer.note}`)),
      h('span', { class: 'dot' }),
    )
    layerHost.append(btn)
  }
  stage.setLayers([...enabled])

  // values table --------------------------------------------------------
  const tbody = $('#anatomy-table tbody')
  const note = $('#anatomy-note')

  function refreshTable () {
    const f = store.font
    const used = usedMetrics(f)
    const box = emBox(f)
    const face = faceBox(f)
    const raw = f.baseRaw.horiz || {}
    const upm = f.unitsPerEm

    const rows = [
      ['text ↑', 'hhea ascender', used.ascent, Math.round(used.ascent * upm), 'text'],
      ['text ↓', 'hhea descender', -used.descent, -Math.round(used.descent * upm), 'text'],
      ['cap', 'OS/2 sCapHeight', f.capHeight, Math.round((f.capHeight ?? 0) * upm), 'latin'],
      ['ex', 'OS/2 sxHeight', f.xHeight, Math.round((f.xHeight ?? 0) * upm), 'latin'],
      ['alphabetic', 'BASE romn', 0, raw.romn ?? 0, 'baseline'],
      ['ideographic ↑', 'BASE idtp *', box.over, '—', 'em'],
      ['ideographic ↓', 'BASE ideo', box.under, raw.ideo, 'em'],
      ['ideographic-ink ↑', 'BASE icft', face?.over, raw.icft, 'face'],
      ['ideographic-ink ↓', 'BASE icfb', face?.under, raw.icfb, 'face'],
    ]

    const colorOf = { text: 'var(--c-text)', latin: 'var(--c-latin)', em: 'var(--c-em)', face: 'var(--c-face)', baseline: 'var(--ink-3)' }

    tbody.replaceChildren(...rows.map(([css, tag, em, units, key]) => h('tr', {
      'data-c': key, style: { color: colorOf[key] },
    },
      h('td', { style: { color: 'var(--ink)' } }, css),
      h('td', {}, tag),
      h('td', { style: { color: 'var(--ink)' } }, em == null ? '—' : fmt(em, 3)),
      h('td', { style: { color: 'var(--ink-3)' } }, units == null ? '—' : String(units)),
    )))

    const bits = [
      `* No face here stores an <code>idtp</code> baseline, so the ideographic
       <em>over</em> edge is synthesized as <code>ideo + 1em</code> — the em box.`,
    ]
    if ((raw.romn ?? 0) !== 0) {
      bits.push(`This font sets <code>romn = ${raw.romn}</code>, so its stored
        units sit ${raw.romn} off the alphabetic baseline; the em column is
        normalised against it.`)
    }
    bits.push(`Content area is ${used.measured ? 'measured from this browser' : 'taken from the font tables'}:
      <b>${fmt(used.ascent + used.descent, 3)}em</b> per line, against an em box of
      <b>1.000em</b> and a face of <b>${face ? fmt(face.height, 3) : '—'}em</b>.`)
    note.innerHTML = bits.join(' ')
  }

  store.onFont((font) => { stage.setFont(font); refreshTable() })
  refreshTable()

  return stage
}
