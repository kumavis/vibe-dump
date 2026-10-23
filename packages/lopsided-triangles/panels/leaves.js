// Chapter 8: the 100 leaves under one entry (Figure 6 of the paper), and the
// entries a chosen leaf also feeds: one in each product X_Q Y_Q whose set Q
// contains the levels where the leaf chose P0.

import { $, el } from '../util.js'
import { subsets, outputsOf, leafOrder, digits, undigits, choose } from '../algo.js'
import { L, M, shared, setShared, onShared, strings, sortedQ, fromOutput, OUT_NAMES, TERM_NAMES } from '../state.js'

const N0 = 3 ** (L - M)
const QS = subsets(L, M) // the tile uses the first nine, row by row
const USED = 9
const qLabel = (Q) => `{${Q.map((l) => l + 1).join(',')}}`

export function initLeaves() {
  const root = $('#leaves')
  if (!root) return
  const left = el('div', {})
  const side = el('div', { class: 'lside' })
  root.append(left, side)

  let selRow = 2 // P13 at the first level of Q
  let selCol = 4 // P22 at the second

  function leafAt(wd, q, r, c) {
    const d = wd.slice()
    d[q[0]] = r
    d[q[1]] = c
    return d
  }

  function render() {
    const { w: wd } = strings()
    const q = sortedQ()
    const wCode = undigits(wd, 10)

    // ── the 10×10 grid of leaves under w
    const head = el(
      'p',
      { class: 'cap', style: 'margin:0 0 8px' },
      'Entry ',
      el('code', {}, wd.map((d) => OUT_NAMES[d]).join(' ')),
      ` has ${'z0'} at levels ${q[0] + 1} and ${q[1] + 1}. Its leaves pick any product there, and the matching `,
      el('code', {}, 'P'),
      ' everywhere else.',
    )
    const grid = el('div', { class: 'lgrid', role: 'grid', 'aria-label': 'The 100 leaves under this entry' })
    grid.append(el('span', { class: 'h', style: 'text-align:right;padding-right:4px' }, `${q[0] + 1}↓ ${q[1] + 1}→`))
    for (let c = 0; c < 10; c++) grid.append(el('span', { class: 'h' }, TERM_NAMES[c]))
    for (let r = 0; r < 10; r++) {
      grid.append(el('span', { class: 'h v' }, TERM_NAMES[r]))
      for (let c = 0; c < 10; c++) {
        const order = (r !== 9 ? 1 : 0) + (c !== 9 ? 1 : 0)
        const serves = choose(L - M + order, order)
        const b = el(
          'button',
          {
            type: 'button',
            class: `leafbtn o${order} ${r === selRow && c === selCol ? 'sel' : ''}`,
            'aria-label': `leaf with ${TERM_NAMES[r]} at level ${q[0] + 1} and ${TERM_NAMES[c]} at level ${q[1] + 1}, order ${order}, feeds ${serves} entries`,
            'aria-pressed': String(r === selRow && c === selCol),
          },
          String(serves),
        )
        b.addEventListener('click', () => {
          selRow = r
          selCol = c
          render()
        })
        grid.append(b)
      }
    }
    const key = el(
      'div',
      { class: 'lkey' },
      el('span', {}, el('i', { style: 'background:var(--order-0)' }), 'order 0: 1 private leaf'),
      el('span', {}, el('i', { style: 'background:var(--order-1)' }), 'order 1: 18 leaves, each feeds 5'),
      el('span', {}, el('i', { style: 'background:var(--order-2)' }), 'order 2: 81 leaves, each feeds 15'),
    )
    left.replaceChildren(head, grid, key)

    // ── the chosen leaf and every entry it feeds
    const leaf = leafAt(wd, q, selRow, selCol)
    const tau = undigits(leaf, 10)
    const order = leafOrder(tau, L, M)
    const outs = outputsOf(tau, L, M)
    const zeros = leaf.map((t, l) => (t === 9 ? l + 1 : null)).filter(Boolean)

    const leafLine = el(
      'div',
      { class: 'strline' },
      ...leaf.map((t, l) => el('span', { class: `cell ${q.includes(l) ? 'in' : ''}` }, TERM_NAMES[t])),
    )
    const explain = el('p', {
      class: 'readout',
      html:
        order === 0
          ? `This is the <b>private leaf</b> of the entry. It chooses <code>P0</code> on both levels of <var>Q</var>, and every other entry would need a different product on one of them, so no other entry uses it.`
          : order === 1
            ? `A leaf of <b>order 1</b>. It chooses <code>P0</code> only at level ${zeros[0]}, so it feeds every entry whose <var>Q</var> contains level ${zeros[0]} and that agrees with it elsewhere: ` +
              `<span class="binom"><span><span>${L - M + 1}</span><span>1</span></span></span> = ${outs.length} entries, one in each of ${outs.length} products.`
            : `A leaf of <b>order 2</b>. It never chooses <code>P0</code>, so it feeds an entry in every product: whichever two levels form <var>Q</var>, the entry with <code>z0</code> there and the leaf's <code>z</code>'s elsewhere uses it. ` +
              `That is <span class="binom"><span><span>${L}</span><span>2</span></span></span> = ${outs.length} entries.`,
    })

    const prods = el('div', { class: 'prods', role: 'img', 'aria-label': `The ${QS.length} products of one run, with the entries this leaf feeds marked` })
    const servedBy = new Map()
    for (const o of outs) {
      const od = digits(o, L, 10)
      const Q = []
      let row = 0
      let col = 0
      od.forEach((d, l) => {
        if (d === 9) Q.push(l)
        else {
          row = row * 3 + Math.floor(d / 3)
          col = col * 3 + (d % 3)
        }
      })
      servedBy.set(Q.join(','), { o, od, row, col })
    }
    QS.forEach((Q, i) => {
      const hit = servedBy.get(Q.join(','))
      const box = el('div', { class: `prod ${i >= USED ? 'unused' : ''} ${hit ? 'served' : ''}`, title: `X_Q Y_Q for Q = ${qLabel(Q)}${i >= USED ? ' (not used by the tile)' : ''}` }, el('span', { class: 'q' }, qLabel(Q)))
      if (hit) {
        const dot = el('span', { class: `dot ${hit.o === wCode ? 'self' : ''}` })
        dot.style.left = `${((hit.col + 0.5) / N0) * 100}%`
        dot.style.top = `${((hit.row + 0.5) / N0) * 100}%`
        box.append(dot)
      }
      prods.append(box)
    })

    const list = el('div', { class: 'outlist', role: 'list' })
    for (const o of outs) {
      const od = digits(o, L, 10)
      const Q = od.map((d, l) => (d === 9 ? l : -1)).filter((l) => l >= 0)
      const qi = QS.findIndex((x) => x.join(',') === Q.join(','))
      const { row, col } = servedBy.get(Q.join(','))
      const where =
        qi < USED
          ? `XY[${Math.floor(qi / 3) * N0 + row + 1}, ${(qi % 3) * N0 + col + 1}]`
          : 'unused product'
      const line = el(
        'div',
        { role: 'listitem', class: o === wCode ? 'me' : qi >= USED ? 'dim' : '' },
        el('a', { href: '#ch-leaves', style: 'color:inherit;text-decoration:none' }, od.map((d) => OUT_NAMES[d].padEnd(3, ' ')).join(' ')),
        `  Q=${qLabel(Q)}  ${where}${o === wCode ? '  ← this entry' : ''}`,
      )
      line.querySelector('a').addEventListener('click', (ev) => {
        ev.preventDefault()
        // make that entry the one under study, keeping the same leaf selected
        const next = fromOutput(od)
        const nq = next.Q.slice().sort((a, b) => a - b)
        selRow = leaf[nq[0]]
        selCol = leaf[nq[1]]
        setShared(next, 'leaves')
      })
      list.append(line)
    }

    side.replaceChildren(
      el('p', { class: 'cap', style: 'margin:0' }, 'The chosen leaf, one product per level:'),
      leafLine,
      explain,
      el('p', { class: 'cap', style: 'margin:0' }, `The ${QS.length} products of one run, each ${N0}×${N0}. Dashed: the six the 3×3 tile leaves empty.`),
      prods,
      el('p', { class: 'cap', style: 'margin:0' }, 'The entries it feeds. Click one to study that entry instead.'),
      list,
    )
  }

  onShared(render)
  render()
}
