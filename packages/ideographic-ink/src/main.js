import { h, $, fmt } from './dom.js'
import { FONT_LIST, usedMetrics, emBox, faceBox, clearMeasurementCache } from './metrics.js'
import { createStage } from './stage.js'
import { store } from './store.js'
import { mountAnatomy } from './anatomy.js'
import { mountPlayground } from './playground.js'
import { mountFaces } from './faces.js'
import { mountVertical } from './vertical.js'
import { mountDemos } from './demos.js'
import { mountSupport } from './support.js'

function mountHero () {
  const stage = createStage({
    font: store.font, text: '永', stageEm: 2.05,
    layers: ['text', 'em', 'face', 'baseline'],
  })
  stage.root.classList.add('hero-glyph')
  stage.root.style.setProperty('--fs', 'clamp(104px, 14vw, 175px)')
  $('#hero-stage').append(stage.root)
  store.onFont((f) => stage.setFont(f))

  const stats = $('#hero-stats')
  function renderStats () {
    const font = store.font
    const used = usedMetrics(font)
    const box = emBox(font)
    const face = faceBox(font)
    const rows = [
      ['--c-text', `${fmt(used.ascent + used.descent, 3)}em`, 'content area'],
      ['--c-em', `${fmt(box.over - box.under, 3)}em`, '仮想ボディ · em box'],
      ['--c-face', `${fmt(face?.height ?? 0, 3)}em`, '字面 · character face'],
    ]
    stats.replaceChildren(...rows.map(([color, value, label]) =>
      h('div', { class: 'stat', style: { borderLeftColor: `var(${color})`, color: `var(${color})` } },
        h('b', { style: { color: 'var(--ink)' } }, value),
        h('span', {}, label))))
  }
  store.onFont(renderStats)
  renderStats()
}

function mountRail () {
  const links = [...document.querySelectorAll('.rail a[href^="#"]')]
  const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]))
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      for (const a of links) a.classList.remove('on')
      byId.get(entry.target.id)?.classList.add('on')
    }
  }, { rootMargin: '-45% 0px -50% 0px' })
  for (const id of byId.keys()) {
    const section = document.getElementById(id)
    if (section) observer.observe(section)
  }
}

async function boot () {
  // Every measurement below depends on the real faces being resident, so wait
  // for them rather than measuring a fallback and caching the wrong numbers.
  try {
    await Promise.all(FONT_LIST.map((f) => document.fonts.load(`400 100px "${f.family}"`, '永日字面花鳥風月墨呼吸')))
    await document.fonts.ready
  } catch { /* fall back to the font-table metrics */ }
  clearMeasurementCache()

  mountHero()
  mountAnatomy()
  mountPlayground()
  mountFaces()
  mountVertical()
  mountDemos()
  mountSupport()
  mountRail()
  document.body.classList.add('ready')
}

boot()
