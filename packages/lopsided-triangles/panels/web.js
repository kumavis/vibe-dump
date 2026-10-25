// Chapter 2: the web of reductions (after Figure 1 of the paper). Arrows
// point from a problem to one it reduces to. Plugging the new algorithm into
// the bottom box sends the speedup up every arrow, against their direction.

import { $, $$, el, svg, reducedMotion } from '../util.js'

const W = 860
const H = 560

// kind: 'engine' (the thin matrix theorem), 'core' (the orange box), 'fast'
// (gets a faster algorithm), 'gray' (hard only by a one-way reduction),
// 'unaffected'. wave: when it lights up after the button is pressed.
const NODES = [
  {
    id: 'hard3',
    kind: 'gray',
    x: 20, y: 18, w: 210, h: 62,
    title: '3SUM-hard problems',
    sub: 'collinear points, motion planning…',
    was: 'hard if 3SUM is',
    info: {
      text: 'Problems shown hard by reductions from 3SUM. The reductions run the other way, so the new algorithm says nothing about them; it only removes their evidence of hardness.',
      items: ['three collinear points, minimum-area triangle', 'point covering, motion planning, polygon containment', 'jumbled indexing, local alignment', 'set disjointness data structures for large universes', 'approximate distance oracles'],
      now: 'open again',
    },
  },
  {
    id: 'balanced',
    kind: 'gray',
    x: 250, y: 18, w: 200, h: 62,
    title: 'All-Edges Sparse Triangle',
    sub: 'balanced, m edges',
    was: 'm^{4/3} conjectured',
    info: {
      text: 'The balanced case, with three parts of about the same size. It is the target of several lower-bound reductions from 3SUM and Exact Triangle. The new algorithm does not speed it up, and the authors suggest it as a replacement hypothesis.',
      items: ['m^{4/3−o(1)} is still the conjecture'],
      now: 'not sped up',
    },
  },
  {
    id: 'dynamic',
    kind: 'gray',
    x: 470, y: 18, w: 200, h: 62,
    title: 'Dynamic graph problems',
    sub: 'reachability, shortest paths, …',
    was: 'hard if 3SUM or APSP is',
    info: {
      text: 'Conditional lower bounds for dynamic problems that came from 3SUM, APSP or All-Edges Sparse Triangle. They are no longer evidence of hardness.',
      items: ['reachability, shortest paths', 'subgraph connectivity, matching'],
      now: 'evidence gone',
    },
  },
  {
    id: 'sum3',
    kind: 'fast',
    wave: 3,
    x: 40, y: 128, w: 230, h: 66,
    title: '3SUM class',
    sub: '3SUM, GeomBase, 3AP, #3SUM, …',
    was: 'n²',
    now: 'n^{1.9992}',
    info: {
      text: 'Problems equivalent to 3SUM under fine-grained reductions. All get their first truly subquadratic algorithms.',
      items: ['3SUM: O(n^{1.9992}), deterministic', 'real 3SUM: O(n^{1.998}) expected', 'three-set 3SUM, GeomBase, All-Numbers 3SUM', 'Convolution-3SUM, 3-linear degeneracy testing (3AP)', '#3SUM (counting)', 'MonoConvolution: O(n^{1.4999})'],
    },
  },
  {
    id: 'minconv',
    kind: 'fast',
    wave: 4,
    x: 316, y: 128, w: 220, h: 66,
    title: '(min,+)-convolution class',
    sub: 'Knapsack, Superadditivity, …',
    was: 'n²',
    now: 'n^{2−δ}',
    info: {
      text: '(min,+)-convolution reduces to both 3SUM and APSP, so either speedup reaches it.',
      items: ['Superadditivity Testing, Maximum Consecutive Subsums, Tree Sparsity', 'Unbounded Knapsack: Õ(n + t^{2−δ})', '0/1 Knapsack: Õ(n + t^{2−δ}), randomized', 'Approximate Subset Sum: Õ(n + (1/ε)^{2−δ})'],
    },
  },
  {
    id: 'apsp',
    kind: 'fast',
    wave: 3,
    x: 582, y: 128, w: 258, h: 66,
    title: 'APSP class',
    sub: 'APSP, (min,+)-product, Radius, …',
    was: 'n³',
    now: 'n^{2.9995}',
    info: {
      text: 'Problems equivalent to APSP under subcubic reductions. All get their first truly subcubic algorithms.',
      items: ['APSP and (min,+)-product: O(n^{2.99942})', 'real APSP: O(n^{2.998}) expected', 'Negative Triangle, Minimum Weight Cycle', 'Replacement Paths, Second Shortest Simple Path', 'Radius, Median, Betweenness Centrality', 'Metricity, (min,+)-product verification', 'Tree Edit Distance, Maximum Subarray, Wiener Index'],
    },
  },
  {
    id: 'zk',
    kind: 'fast',
    wave: 3,
    x: 20, y: 252, w: 168, h: 62,
    title: 'Zero-Weight k-Clique',
    sub: 'by folding to triangles',
    was: 'n^{k}',
    now: 'n^{k−ε}',
    info: {
      text: 'Group the vertices into three parts of k/3 vertices each, and a k-clique becomes a triangle. The new Exact Triangle algorithm gives the first n^{k−ε} algorithm.',
      items: ['Zero-Weight k-Clique: O(n^{k−0.0017⌊k/3⌋})'],
    },
  },
  {
    id: 'exact',
    kind: 'fast',
    wave: 2,
    x: 300, y: 248, w: 230, h: 70,
    title: 'Exact Triangle',
    sub: 'a triangle of total weight 0?',
    was: 'n³',
    now: 'n^{2.9983}',
    info: {
      text: 'Given a tripartite graph with integer edge weights, is there a triangle whose three weights sum to zero? 3SUM and APSP both reduce to it.',
      items: ['Exact Triangle: O(n^{2.9983}), deterministic', '#Exact Triangle (counting) too', 'real weights: O(n^{2.998}) expected'],
    },
  },
  {
    id: 'mk',
    kind: 'fast',
    wave: 4,
    x: 582, y: 252, w: 125, h: 62,
    title: 'Min/Max k-Clique',
    sub: 'folding',
    was: 'n^{k}',
    now: 'n^{k−ε}',
    info: {
      text: 'The minimum- or maximum-weight k-clique, by the same folding, now through APSP.',
      items: ['Min- and Max-Weight k-Clique: O(n^{k−ε})'],
    },
  },
  {
    id: 'dapsp',
    kind: 'fast',
    wave: 4,
    x: 718, y: 252, w: 122, h: 62,
    title: 'Directed\nunweighted APSP',
    sub: '',
    was: 'n^{2.5275}',
    now: 'faster',
    info: {
      text: 'Zwick\'s algorithm, Õ(n^{2+μ}) ≤ O(n^{2.5275}), had not been improved in over two decades except through faster rectangular matrix multiplication.',
      items: ['O(n^{2+μ−ε′′}) for a constant ε′′ > 0'],
    },
  },
  {
    id: 'real',
    kind: 'fast',
    wave: 2,
    x: 20, y: 372, w: 168, h: 62,
    title: 'Real-valued problems',
    sub: 'real 3SUM, APSP, (min,+)',
    was: 'n², n³',
    now: 'Las Vegas',
    info: {
      text: 'With real numbers, the reduction uses only additions, subtractions and comparisons (Fredman\'s trick), then counts triangles. The algorithms are randomized (Las Vegas).',
      items: ['3SUM: O(n^{1.998}) expected', 'APSP, (min,+)-product, Exact Triangle: O(n^{2.998}) expected'],
    },
  },
  {
    id: 'lop',
    kind: 'core',
    wave: 1,
    x: 270, y: 368, w: 290, h: 74,
    title: 'Lopsided All-Edges Sparse Triangle',
    sub: 'middle part of n^{ε} vertices',
    was: 'n²',
    now: 'n^{2−δ} for ε < 0.12',
    info: {
      text: 'Two parts of n vertices, a middle part of D = n^{ε} vertices, and query pairs W. For each pair, is there a common neighbour in the middle? Every reduction in this figure ends here.',
      items: ['|W|·D + n² before', 'O(|W| D^{0.437} + n²/D^{0.063}) now, for D ≤ n^{1/18}', 'truly subquadratic for every ε < 0.12'],
    },
  },
  {
    id: 'xor',
    kind: 'fast',
    wave: 2,
    x: 584, y: 372, w: 104, h: 62,
    title: '3XOR',
    sub: '',
    was: 'n²',
    now: 'n^{2−δ}',
    info: {
      text: 'Three lists of bit vectors: are there a, b, c with a ⊕ b ⊕ c = 0? Not known to reduce to 3SUM, but the same approach works.',
      items: ['first truly subquadratic algorithm'],
    },
  },
  {
    id: 'omv',
    kind: 'fast',
    wave: 2,
    dashed: true,
    x: 600, y: 486, w: 150, h: 62,
    title: 'Hinted OMv',
    sub: 'thin hints',
    was: 'conjectured optimal',
    now: 'refuted',
    info: {
      text: 'Online Matrix–Vector multiplication with a hint of the vectors to come. The data-structure version of the new algorithm refutes three conjectures of van den Brand, Nanongkai and Saranurak when the hints are thin.',
      items: ['v-hinted Mv, Mv-hinted Mv, uMv-hinted uMv: refuted for hint dimension n^τ, τ < 0.1204'],
    },
  },
  {
    id: 'thin',
    kind: 'engine',
    wave: 0,
    x: 270, y: 486, w: 290, h: 66,
    title: 'Certain entries of a thin product',
    sub: 'XY at positions W',
    was: 'N²',
    now: 'N²/D^{0.063}',
    info: {
      text: 'The new algorithm. X is N×D, Y is D×N, and only the entries at the positions in W are wanted. The lopsided triangle problem is this problem in graph language.',
      items: ['O(N²/D^{0.063}) for |W| ≤ N²/√D and D ≤ N^{1/18}', 'any single entry in O(D^{0.437}) after preprocessing'],
    },
  },
  {
    id: 'unaff',
    kind: 'unaffected',
    x: 20, y: 462, w: 200, h: 88,
    title: 'Unaffected',
    lines: ['SETH · Orthogonal Vectors', 'OMv · 3SUM-Indexing', 'k-SUM for k ≥ 4'],
    info: {
      text: 'Hypotheses not known to reduce to triangle problems. Nothing in the paper speeds them up.',
      items: ['Strong Exponential Time Hypothesis', 'Orthogonal Vectors', 'OMv without hints', 'k-SUM and k-XOR for k ≥ 4', '3SUM-Indexing'],
    },
  },
]

// [from, to, kind]: from reduces to `to`. 'gray' arrows mean `to` was shown
// hard by a reduction from `from`.
const EDGES = [
  ['lop', 'thin', 'solid'],
  ['exact', 'lop', 'solid'],
  ['real', 'lop', 'solid'],
  ['xor', 'lop', 'solid'],
  ['omv', 'lop', 'dashed'],
  ['sum3', 'exact', 'solid'],
  ['apsp', 'exact', 'solid'],
  ['zk', 'exact', 'solid'],
  ['minconv', 'sum3', 'solid'],
  ['minconv', 'apsp', 'solid'],
  ['mk', 'apsp', 'solid'],
  ['dapsp', 'apsp', 'solid'],
  ['sum3', 'hard3', 'gray'],
  ['sum3', 'balanced', 'gray'],
  ['sum3', 'dynamic', 'gray'],
  ['apsp', 'dynamic', 'gray'],
]

// "n^{2.9995}" → [base, exponent] for SVG and HTML.
function mathParts(s) {
  const out = []
  const re = /([^^]*)\^\{([^}]*)\}/g
  let last = 0
  let mm
  while ((mm = re.exec(s))) {
    out.push([mm[1], mm[2]])
    last = re.lastIndex
  }
  if (last < s.length) out.push([s.slice(last), null])
  return out
}
function mathSvg(s, attrs) {
  const t = svg('text', attrs)
  for (const [base, exp] of mathParts(s)) {
    if (base) t.append(svg('tspan', { text: base }))
    if (exp != null) {
      t.append(svg('tspan', { dy: -5, 'font-size': '0.72em', text: exp }))
      t.append(svg('tspan', { dy: 5, text: ' ' }))
    }
  }
  return t
}
function mathHtml(s) {
  const span = el('span', {})
  for (const [base, exp] of mathParts(s)) {
    if (base) span.append(base)
    if (exp != null) span.append(el('sup', {}, exp))
  }
  return span
}

function anchor(n, side) {
  if (side === 'top') return [n.x + n.w / 2, n.y]
  if (side === 'bottom') return [n.x + n.w / 2, n.y + n.h]
  if (side === 'left') return [n.x, n.y + n.h / 2]
  return [n.x + n.w, n.y + n.h / 2]
}

// Route an arrow from one box to another: leave from the side facing it.
function route(a, b) {
  const acx = a.x + a.w / 2
  const acy = a.y + a.h / 2
  const bcx = b.x + b.w / 2
  const bcy = b.y + b.h / 2
  const dy = bcy - acy
  const dx = bcx - acx
  let p
  let q
  if (Math.abs(dy) > 40) {
    p = dy > 0 ? [Math.max(a.x + 12, Math.min(a.x + a.w - 12, bcx)), a.y + a.h] : [Math.max(a.x + 12, Math.min(a.x + a.w - 12, bcx)), a.y]
    q = dy > 0 ? [Math.max(b.x + 12, Math.min(b.x + b.w - 12, acx)), b.y] : [Math.max(b.x + 12, Math.min(b.x + b.w - 12, acx)), b.y + b.h]
  } else {
    p = anchor(a, dx > 0 ? 'right' : 'left')
    q = anchor(b, dx > 0 ? 'left' : 'right')
  }
  return [p, q]
}

export function initWeb() {
  const root = $('#web-svg')
  if (!root) return
  const info = $('#web-info')
  const playBtn = $('#web-play')
  const segBtns = $$('#panel-web .seg button')
  const caption = $('#web-caption')
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]))

  root.setAttribute('viewBox', `0 0 ${W} ${H}`)
  const defs = svg('defs')
  const mk = (id, fill) =>
    svg('marker', { id, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, svg('path', { d: 'M0,0 L10,5 L0,10 z', fill }))
  defs.append(mk('ar-ink', 'var(--ink-2)'), mk('ar-gray', 'var(--ink-3)'), mk('ar-acc', 'var(--accent)'))
  root.append(defs)

  const edgeLayer = svg('g')
  const nodeLayer = svg('g')
  root.append(edgeLayer, nodeLayer)

  const edgeEls = EDGES.map(([from, to, kind]) => {
    const [p, q] = route(byId[from], byId[to])
    const line = svg('line', {
      class: 'we',
      x1: p[0], y1: p[1], x2: q[0], y2: q[1],
      stroke: kind === 'gray' ? 'var(--ink-3)' : 'var(--ink-2)',
      'stroke-width': kind === 'gray' ? 1 : 1.3,
      'stroke-dasharray': kind === 'dashed' ? '5 4' : kind === 'gray' ? '2 3' : null,
      'marker-end': kind === 'gray' ? 'url(#ar-gray)' : 'url(#ar-ink)',
    })
    edgeLayer.append(line)
    return { from, to, kind, line }
  })

  const nodeEls = NODES.map((n) => {
    const g = svg('g', { class: 'wn', tabindex: 0, role: 'button', 'aria-label': n.title })
    const rect = svg('rect', { x: n.x, y: n.y, width: n.w, height: n.h, rx: 5, 'stroke-width': n.kind === 'core' || n.kind === 'engine' ? 1.6 : 1.1 })
    if (n.kind === 'unaffected') rect.setAttribute('stroke-dasharray', '4 3')
    const titleLines = n.title.split('\n')
    const title = svg('text', { x: n.x + n.w / 2, y: n.y + 19, 'text-anchor': 'middle', 'font-family': 'var(--serif)', 'font-weight': 700, 'font-size': n.w < 130 ? 13 : 14.5 })
    titleLines.forEach((line, i) => title.append(svg('tspan', { x: n.x + n.w / 2, dy: i ? 14 : 0, text: line })))
    const kids = [rect, title]
    const below = n.y + 19 + 14 * (titleLines.length - 1)
    for (const [i, line] of (n.lines ?? (n.sub ? [n.sub] : [])).entries()) {
      kids.push(mathSvg(line, { x: n.x + n.w / 2, y: below + 17 + 16 * i, 'text-anchor': 'middle', 'font-family': 'var(--sans)', 'font-size': 12, fill: 'var(--ink-2)' }))
    }
    const bound = mathSvg(n.was ?? '', {
      x: n.x + n.w / 2,
      y: n.y + n.h - 9,
      'text-anchor': 'middle',
      'font-family': 'var(--serif)',
      'font-size': 14,
    })
    if (n.kind !== 'unaffected') kids.push(bound)
    g.append(...kids)
    nodeLayer.append(g)
    const pick = () => select(n.id)
    g.addEventListener('click', pick)
    g.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault()
        pick()
      }
    })
    return { n, g, rect, title, bound }
  })

  let mode = 'hard'
  let lit = new Set() // node ids that have received the speedup
  let selected = 'lop'
  let timers = []

  function paint() {
    for (const { n, rect, title, bound } of nodeEls) {
      const on = lit.has(n.id)
      let fill = 'var(--paper)'
      let stroke = 'var(--rule-2)'
      let text = 'var(--ink)'
      if (n.kind === 'core') {
        fill = 'var(--wanted-soft)'
        stroke = 'var(--wanted)'
      }
      if (n.kind === 'engine') {
        fill = on ? 'var(--tikz)' : 'var(--paper)'
        stroke = on ? 'var(--tikz-line)' : 'var(--rule-2)'
      }
      if (n.kind === 'fast' && on) {
        fill = 'var(--tikz)'
        stroke = 'var(--tikz-line)'
      }
      if (n.kind === 'gray' && mode === 'fast' && lit.size > 0) {
        fill = 'var(--gray-box)'
        text = 'var(--ink-3)'
      }
      if (n.kind === 'unaffected') {
        fill = 'transparent'
        stroke = 'var(--ink-3)'
      }
      if (n.id === selected) stroke = n.kind === 'core' ? 'var(--wanted)' : 'var(--accent)'
      rect.setAttribute('fill', fill)
      rect.setAttribute('stroke', stroke)
      rect.setAttribute('stroke-width', n.id === selected ? 2.4 : n.kind === 'core' || n.kind === 'engine' ? 1.6 : 1.1)
      title.setAttribute('fill', text)
      // bounds: before the speedup the old one, after it the new one
      if (n.kind !== 'unaffected') {
        const show = on && n.now ? n.now : n.was
        bound.replaceChildren()
        for (const [base, exp] of mathParts(show ?? '')) {
          if (base) bound.append(svg('tspan', { text: base }))
          if (exp != null) {
            bound.append(svg('tspan', { dy: -5, 'font-size': '0.72em', text: exp }))
            bound.append(svg('tspan', { dy: 5, text: ' ' }))
          }
        }
        bound.setAttribute('fill', on && n.now ? 'var(--accent-ink)' : n.kind === 'gray' && lit.size ? 'var(--ink-3)' : 'var(--ink-2)')
        bound.setAttribute('font-weight', on && n.now ? 700 : 400)
      }
    }
    for (const e of edgeEls) {
      const hot = mode === 'fast' && lit.has(e.to) && lit.has(e.from) && e.kind !== 'gray'
      e.line.setAttribute('stroke', hot ? 'var(--accent)' : e.kind === 'gray' ? 'var(--ink-3)' : 'var(--ink-2)')
      e.line.setAttribute('marker-end', hot ? 'url(#ar-acc)' : e.kind === 'gray' ? 'url(#ar-gray)' : 'url(#ar-ink)')
      e.line.setAttribute('stroke-width', hot ? 2 : e.kind === 'gray' ? 1 : 1.3)
      // reading as algorithms, the speed travels against the arrow
      e.line.setAttribute('opacity', mode === 'fast' && e.kind === 'gray' && lit.size ? 0.45 : 1)
    }
    segBtns.forEach((b) => b.setAttribute('aria-checked', String(b.dataset.mode === mode)))
    caption.textContent =
      mode === 'hard'
        ? 'Read as hardness: each arrow points from a problem to one it reduces to, so hardness flows along the arrows, downward. If 3SUM needs n², so does Exact Triangle, and so does the lopsided problem at the bottom.'
        : 'Read as algorithms: speed flows against the arrows, upward. Blue boxes get polynomially faster algorithms. Gray boxes were shown hard by reductions from 3SUM or APSP, so the speedup does not reach them; their evidence of hardness is simply gone.'
  }

  function select(id) {
    selected = id
    const n = byId[id]
    const head = el('h3', {}, n.title)
    const body = el('p', {}, mathHtml(n.info.text))
    const list = el('ul', {}, ...n.info.items.map((it) => el('li', {}, mathHtml(it))))
    const status = []
    if (n.kind === 'fast' || n.kind === 'core' || n.kind === 'engine') {
      status.push(
        el('p', {}, 'Before: ', mathHtml(n.was), '. ', lit.has(id) ? el('span', { class: 'now' }, 'Now: ', mathHtml(n.now), '.') : el('span', {}, 'Press the button to send the new algorithm up the web.')),
      )
    }
    info.replaceChildren(head, body, ...status, list)
    paint()
  }

  function play() {
    timers.forEach(clearTimeout)
    timers = []
    mode = 'fast'
    lit = new Set()
    paint()
    const delay = reducedMotion() ? 0 : 420
    for (let wave = 0; wave <= 4; wave++) {
      timers.push(
        setTimeout(() => {
          for (const n of NODES) if (n.wave === wave) lit.add(n.id)
          paint()
          select(selected)
        }, wave * delay + 60),
      )
    }
    playBtn.textContent = 'Play it again'
  }

  playBtn.addEventListener('click', play)
  segBtns.forEach((b) =>
    b.addEventListener('click', () => {
      mode = b.dataset.mode
      if (mode === 'hard') {
        timers.forEach(clearTimeout)
        lit = new Set()
        playBtn.textContent = 'Plug in the new algorithm'
      } else if (lit.size === 0) {
        play()
        return
      }
      paint()
      select(selected)
    }),
  )
  select('lop')
}
