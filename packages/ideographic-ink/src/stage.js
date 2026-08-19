// A reusable "one glyph, drawn with its metrics" stage.
//
// Everything is positioned in em off the alphabetic baseline, and the baseline
// itself is placed by giving the text a line-height equal to the stage height —
// which puts it exactly where the browser's own half-leading maths puts it, so
// the overlay and the glyph can never drift apart.
import { h, fmt } from './dom.js'
import { usedMetrics, inkExtents, emBox, faceBox } from './metrics.js'

export const LAYERS = [
  {
    id: 'text',
    color: 'var(--c-text)',
    css: 'text',
    name: 'Content area',
    note: 'What the browser reserves for the line',
  },
  {
    id: 'em',
    color: 'var(--c-em)',
    css: 'ideographic',
    name: 'Em box',
    note: 'BASE ideo — the 1em square',
  },
  {
    id: 'face',
    color: 'var(--c-face)',
    css: 'ideographic-ink',
    name: 'Character face',
    note: 'BASE icft / icfb',
  },
  {
    id: 'glyph',
    color: 'var(--c-glyph)',
    css: '—',
    name: 'This glyph’s ink',
    note: 'Canvas actualBoundingBox',
  },
  {
    id: 'latin',
    color: 'var(--c-latin)',
    css: 'cap / ex',
    name: 'Cap & x-height',
    note: 'Latin-only edges',
  },
  {
    id: 'baseline',
    color: 'var(--ink-3)',
    css: 'alphabetic',
    name: 'Baseline',
    note: 'Where Latin sits',
  },
]

const DEFAULT_LAYERS = ['text', 'em', 'face', 'baseline']

export function createStage ({ font, text = '永', stageEm = 1.98, layers = DEFAULT_LAYERS, tags = true }) {
  const root = h('div', { class: 'stage', vars: { '--stage-em': String(stageEm) } })
  const glyph = h('div', { class: 'stage-glyph' })
  const overlay = h('div', { class: 'stage-overlay' })
  root.append(overlay, glyph)

  const state = { font, text, layers: new Set(layers), stageEm }

  function geometry () {
    const f = state.font
    const used = usedMetrics(f)
    const base = (state.stageEm - (used.ascent + used.descent)) / 2 + used.ascent
    const box = emBox(f)
    const face = faceBox(f)
    const ink = inkExtents(f, state.text)
    // Centre the em box on the run of text rather than on one glyph, so the
    // square still frames a two-character sample.
    const halfAdvance = (ink?.advance ?? 1) / 2
    return { used, base, box, face, ink, halfAdvance }
  }

  function rect ({ cls, y1, y2, x1, x2, full, tag, tagPos = 'tr', tagOffset = 0, on }) {
    const node = h('div', {
      class: `mrect ${cls}${on ? '' : ' layer-off'}${full ? ' full' : ''}`,
      vars: {
        '--y1': String(y1), '--y2': String(y2),
        '--x1': String(x1 ?? 0), '--x2': String(x2 ?? 0),
        // Tags sit outside the *em box*, so a narrow face doesn't tuck its
        // label under the square next to it.
        '--tagoff': `${tagOffset}em`,
      },
      style: full ? { left: '0', width: '100%' } : null,
    })
    if (tag && tags) node.append(h('div', { class: `mtag mtag--${tagPos}`, html: tag }))
    return node
  }

  function rule ({ cls, y1, tag, on, style }) {
    const node = h('div', {
      class: `mrule ${cls}${on ? '' : ' layer-off'}`,
      vars: { '--y1': String(y1) },
      style,
    })
    if (tag && tags) node.append(h('div', { class: 'mtag mtag--rule', html: tag }))
    return node
  }

  function render () {
    const f = state.font
    const { used, base, box, face, ink, halfAdvance } = geometry()
    const on = (id) => state.layers.has(id)
    root.style.setProperty('--base', String(base))
    glyph.style.fontFamily = `"${f.family}"`
    glyph.textContent = state.text

    const parts = []

    parts.push(rect({
      cls: 'm-text box dash',
      y1: used.ascent, y2: -used.descent, full: true,
      on: on('text'),
      tag: `<b>text</b> <i>${fmt(used.ascent, 3)} / −${fmt(used.descent, 3)}</i>`,
      tagPos: 'in',
    }))

    parts.push(rect({
      cls: 'm-em box thick tint',
      y1: box.over, y2: box.under, x1: -halfAdvance, x2: halfAdvance,
      on: on('em'),
      tag: `<b>ideographic</b><br><i>仮想ボディ · ${fmt(box.over - box.under, 3)}em</i>`,
      tagPos: 'tr',
    }))

    if (face) {
      parts.push(rect({
        cls: 'm-face box thick',
        y1: face.over, y2: face.under,
        x1: -halfAdvance + face.left, x2: -halfAdvance + face.right,
        on: on('face'),
        tag: `<b>ideographic-ink</b><br><i>字面 · ${fmt(face.height, 3)}em</i>`,
        tagPos: 'br',
        tagOffset: 2 * halfAdvance - face.right,
      }))
    }

    if (ink) {
      parts.push(rect({
        cls: 'm-glyph box dot',
        y1: ink.over, y2: ink.under,
        x1: -halfAdvance + ink.left, x2: -halfAdvance + ink.right,
        on: on('glyph'),
        tag: `<b>measured ink</b><br><i>${fmt(ink.over - ink.under, 3)}em</i>`,
        tagPos: 'bl',
        tagOffset: ink.left,
      }))
    }

    parts.push(rule({
      cls: 'm-latin', y1: f.capHeight ?? 0, on: on('latin'),
      tag: `<b>cap</b> <i>${fmt(f.capHeight ?? 0, 3)}</i>`,
    }))
    parts.push(rule({
      cls: 'm-latin', y1: f.xHeight ?? 0, on: on('latin'),
      tag: `<b>ex</b> <i>${fmt(f.xHeight ?? 0, 3)}</i>`,
    }))
    parts.push(rule({
      cls: 'm-base', y1: 0, on: on('baseline'),
      style: { color: 'var(--ink-3)' },
      tag: '<b>alphabetic</b> <i>romn</i>',
    }))

    overlay.replaceChildren(...parts)
  }

  render()

  return {
    root,
    geometry,
    setFont (f) { state.font = f; render() },
    setText (t) { state.text = t; render() },
    setLayers (ids) { state.layers = new Set(ids); render() },
    toggleLayer (id, on) { on ? state.layers.add(id) : state.layers.delete(id); render() },
    get state () { return state },
    render,
  }
}
