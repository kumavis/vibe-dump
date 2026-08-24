import { h, $, fmt } from './dom.js'
import { createStage } from './stage.js'
import { FONT_LIST, faceRatio, faceBox } from './metrics.js'
import { store } from './store.js'

export function mountFaces () {
  const grid = $('#face-grid')
  const sorted = [...FONT_LIST].sort((a, b) => (faceRatio(b) ?? 0) - (faceRatio(a) ?? 0))

  const cards = sorted.map((font) => {
    const stage = createStage({
      font, text: '永', stageEm: 1.55,
      layers: ['em', 'face'], tags: false,
    })
    const face = faceBox(font)
    const ratio = faceRatio(font) ?? 0

    const bar = h('i', { style: { transform: 'scaleX(0)' } })
    const card = h('div', {
      class: `face-card${font.key === store.font.key ? ' on' : ''}`,
      'data-font': font.key,
      role: 'button', tabindex: '0',
      title: `Use ${font.family} everywhere on this page`,
      onClick: () => store.setFont(font),
      onKeydown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); store.setFont(font) } },
    },
      h('div', { class: 'face-card-head' },
        h('b', {}, font.family),
        h('span', {}, font.labelJa)),
      stage.root,
      h('div', { class: 'ratio' },
        h('div', { class: 'ratio-bar' }, bar),
        h('div', { class: 'ratio-num' },
          h('span', {}, '字面率'),
          h('b', {}, `${ratio.toFixed(1)}%`)),
        h('div', { class: 'ratio-num' },
          h('span', {}, font.labelEn),
          h('span', {}, `${fmt(face?.over ?? 0, 3)} … ${fmt(face?.under ?? 0, 3)}`))),
    )

    // Grow the bars once the section scrolls into view.
    requestAnimationFrame(() => {
      bar.style.transition = 'transform 1.1s cubic-bezier(.2,.8,.2,1)'
      bar.style.transform = `scaleX(${ratio / 100})`
    })
    return card
  })

  grid.append(...cards)
  store.onFont((font) => {
    for (const card of cards) card.classList.toggle('on', card.dataset.font === font.key)
  })
}
