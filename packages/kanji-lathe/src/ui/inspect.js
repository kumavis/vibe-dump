// The right-hand column: pick a character, read what it is, and watch what the
// current design is costing in legibility.
import { computeMetrics } from '../engine/metrics.js'

const el = (tag, cls, text) => {
  const n = document.createElement(tag)
  if (cls) n.className = cls
  if (text != null) n.textContent = text
  return n
}

export function createInspector(dom, app) {
  const { charInput, charSearch, charResults, charCard, legFill, metricStats, strokeList } = dom

  charInput.addEventListener('input', () => {
    const ch = [...charInput.value].find((c) => app.corpus.byChar.has(c))
    if (ch) app.setChar(ch)
  })
  charSearch.addEventListener('input', () => renderResults())

  function renderResults() {
    const q = charSearch.value.trim().toLowerCase()
    let list
    if (!q) list = app.corpus.chars.slice(0, 120)
    else if (app.corpus.byChar.has(q)) list = [app.corpus.byChar.get(q)]
    else
      list = app.corpus.chars
        .filter(
          (c) =>
            c.char === q ||
            c.meanings.some((m) => m.toLowerCase().includes(q)) ||
            c.on.some((r) => r.toLowerCase().includes(q)) ||
            c.kun.some((r) => r.toLowerCase().includes(q)),
        )
        .slice(0, 120)
    charResults.textContent = ''
    for (const rec of list) {
      const b = el('button', rec.char === app.char ? 'is-current' : null, rec.char)
      b.title = `#${rec.freq} · ${rec.meanings.join(', ')}`
      b.addEventListener('click', () => app.setChar(rec.char))
      charResults.appendChild(b)
    }
  }

  function renderCard() {
    const rec = app.record
    charCard.textContent = ''
    const wrap = el('div', 'glyphInfo')
    wrap.appendChild(el('div', 'glyphInfo__char', rec.char))
    const body = el('div', 'glyphInfo__body')
    body.appendChild(el('div', 'glyphInfo__mean', rec.meanings.join(', ') || '—'))
    const read = el('div', 'glyphInfo__read')
    read.textContent = [rec.on.join('・'), rec.kun.join('・')].filter(Boolean).join('  /  ')
    body.appendChild(read)
    const tags = el('div', 'glyphInfo__tags')
    tags.appendChild(el('span', 'tag', 'rank ' + rec.freq))
    tags.appendChild(el('span', 'tag', rec.strokeCount + ' strokes'))
    if (rec.grade) tags.appendChild(el('span', 'tag', rec.grade <= 6 ? 'grade ' + rec.grade : 'secondary'))
    if (rec.jlpt) tags.appendChild(el('span', 'tag', 'JLPT N' + (5 - rec.jlpt + 1)))
    const rad = rec.radicalGroup
    if (rad && rad.element) tags.appendChild(el('span', 'tag', 'radical ' + rad.element))
    body.appendChild(tags)
    wrap.appendChild(body)
    charCard.appendChild(wrap)
  }

  function renderStrokes(skel) {
    strokeList.textContent = ''
    for (const s of skel.strokes) {
      const li = el('li')
      li.dataset.stroke = String(s.i)
      li.appendChild(el('span', 'strokes__i', String(s.i + 1)))
      li.appendChild(el('span', 'strokes__glyph', s.base || '·'))
      const name = s.name + (s.hook ? ' ·hook' : '') + (s.alive ? '' : ' ·dropped')
      li.appendChild(el('span', 'strokes__name', name))
      const grp = skel.groups[s.group]
      li.appendChild(el('span', 'strokes__comp', grp ? grp.element || '' : ''))
      li.addEventListener('pointerenter', () => app.setHotStroke(s.i))
      li.addEventListener('pointerleave', () => app.setHotStroke(null))
      strokeList.appendChild(li)
    }
  }

  function renderMetrics(skel) {
    let m
    try {
      m = computeMetrics(skel, app.P, skel.ctx)
    } catch (err) {
      metricStats.textContent = 'metrics unavailable'
      return
    }
    const pct = Math.round(m.legibility * 100)
    legFill.style.width = pct + '%'
    legFill.style.background = pct > 75 ? 'var(--ok)' : pct > 45 ? 'var(--warn)' : 'var(--bad)'
    const rows = [
      ['legibility', pct + '%'],
      ['shape match', Math.round(m.shapeMatch * 100) + '%'],
      ['topology', Math.round(m.topology * 100) + '%'],
      ['ink (gray)', (m.gray * 100).toFixed(1) + '%'],
      ['coverage', Math.round(m.coverage * 100) + '%'],
      ['min gap', (m.minGap / skel.em).toFixed(3) + ' em'],
      ['crowding', Math.round(m.crowding * 100) + '%'],
      ['strokes', skel.strokeCount - m.strokesDropped + ' / ' + skel.strokeCount],
    ]
    metricStats.textContent = ''
    for (const [k, v] of rows) {
      metricStats.appendChild(el('dt', null, k))
      metricStats.appendChild(el('dd', null, v))
    }
  }

  function highlight(i) {
    for (const li of strokeList.children) li.classList.toggle('is-hot', Number(li.dataset.stroke) === i)
  }

  return {
    onCharChange() {
      charInput.value = app.char
      renderCard()
      renderResults()
    },
    onRender(skel) {
      renderStrokes(skel)
      renderMetrics(skel)
    },
    highlight,
    renderResults,
  }
}
