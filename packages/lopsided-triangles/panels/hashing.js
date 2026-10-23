// Chapter 4: hashing Exact Triangle into the lopsided problem (paper §3.2).
// For one query pair (a, b): every vertex c of the third side becomes p
// middle vertices (c, σ). a is joined to (c, w(a,c) + ρ) and b to
// (c, −w(b,c)), so they share a neighbour exactly when the triangle's
// weight S(a, b, c) is a multiple of p.

import { $, el, svg, rng, randInt, signed } from '../util.js'
import { frame, linear, colPath } from '../chart.js'

const N = 6
const PRIMES = [2, 3, 5, 7, 11, 13]
const WMAX = 40
const mod = (x, p) => ((x % p) + p) % p

function instance(seed) {
  const r = rng(seed)
  const wAB = Array.from({ length: N }, () => Array.from({ length: N }, () => randInt(r, -WMAX, WMAX)))
  const wBC = Array.from({ length: N }, () => Array.from({ length: N }, () => randInt(r, -WMAX, WMAX)))
  const wAC = Array.from({ length: N }, () => Array.from({ length: N }, () => randInt(r, -WMAX, WMAX)))
  const S = (a, b, c) => wAB[a][b] + wBC[b][c] + wAC[a][c]
  // plant exactly one zero triangle
  const pa = randInt(r, 0, N - 1)
  const pb = randInt(r, 0, N - 1)
  const pc = randInt(r, 0, N - 1)
  wAB[pa][pb] = -(wBC[pb][pc] + wAC[pa][pc])
  if (Math.abs(wAB[pa][pb]) > 2 * WMAX) return null
  let zeros = 0
  for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) for (let c = 0; c < N; c++) if (S(a, b, c) === 0) zeros++
  if (zeros !== 1) return null
  const falsePos = (p) => {
    let f = 0
    for (let a = 0; a < N; a++) for (let b = 0; b < N; b++) for (let c = 0; c < N; c++) {
      const s = S(a, b, c)
      if (s !== 0 && mod(s, p) === 0) f++
    }
    return f
  }
  return { wAB, wBC, wAC, S, planted: [pa, pb, pc], falsePos }
}

// The opening example: the hidden pair shows its zero triangle and, at p = 5,
// at least one false positive beside it.
function firstGood(from) {
  for (let seed = from; seed < from + 5000; seed++) {
    const inst = instance(seed)
    if (!inst) continue
    const [a, b] = inst.planted
    let fp = 0
    for (let c = 0; c < N; c++) {
      const s = inst.S(a, b, c)
      if (s !== 0 && mod(s, 5) === 0) fp++
    }
    if (fp >= 1 && fp <= 2) return { seed, inst }
  }
  return { seed: from, inst: instance(from) }
}

export function initHashing() {
  const root = $('#hash-svg')
  if (!root) return
  const pairSel = $('#hash-pair')
  const primeBox = $('#hash-primes')
  const newBtn = $('#hash-new')
  const tableBox = $('#hash-table')
  const fpBox = $('#hash-fp')
  const readout = $('#hash-readout')

  let { seed, inst } = firstGood(2026)
  let p = 5
  let pair = inst.planted.slice(0, 2)

  for (let a = 0; a < N; a++)
    for (let b = 0; b < N; b++) pairSel.append(el('option', { value: `${a},${b}` }, `a${a + 1}, b${b + 1}`))
  const primeBtns = PRIMES.map((q) => {
    const btn = el('button', { type: 'button', role: 'radio', 'aria-checked': 'false' }, `p = ${q}`)
    btn.addEventListener('click', () => {
      p = q
      render()
    })
    primeBox.append(btn)
    return [q, btn]
  })
  pairSel.addEventListener('change', () => {
    pair = pairSel.value.split(',').map(Number)
    render()
  })
  newBtn.addEventListener('click', () => {
    ;({ seed, inst } = firstGood(seed + 1))
    pair = inst.planted.slice(0, 2)
    render()
  })

  function render() {
    const [a, b] = pair
    pairSel.value = `${a},${b}`
    primeBtns.forEach(([q, btn]) => btn.setAttribute('aria-checked', String(q === p)))
    const rho = mod(inst.wAB[a][b], p)
    const rows = Array.from({ length: N }, (_, c) => {
      const sa = mod(inst.wAC[a][c] + rho, p)
      const sb = mod(-inst.wBC[b][c], p)
      const s = inst.S(a, b, c)
      return { c, sa, sb, s, cand: sa === sb, zero: s === 0 }
    })

    // ── the middle part, one row per c and one column per residue σ
    const avail = root.parentElement.clientWidth || 500
    const VW = avail < 440 ? 380 : 500
    const rowH = 40
    const top = 46
    const VH = top + N * rowH + 18
    root.setAttribute('viewBox', `0 0 ${VW} ${VH}`)
    root.replaceChildren()
    const gx0 = VW < 450 ? 70 : 100
    const gx1 = VW - (VW < 450 ? 64 : 96)
    const cw = (gx1 - gx0) / p
    const cx = (sig) => gx0 + cw * (sig + 0.5)
    const cy = (c) => top + rowH * (c + 0.5)
    const ax = 22
    const bx = VW - 22
    const midY = top + (N * rowH) / 2
    const lines = svg('g')
    const grid = svg('g')
    const dots = svg('g')
    root.append(grid, lines, dots)
    // column labels
    const labelEvery = p > 7 ? (VW < 400 ? 3 : 1) : 1
    for (let sig = 0; sig < p; sig++) {
      if (sig % labelEvery) continue
      grid.append(svg('text', { x: cx(sig), y: top - 12, 'text-anchor': 'middle', 'font-family': 'var(--serif)', 'font-size': 13, fill: 'var(--ink-3)', text: sig }))
    }
    grid.append(svg('text', { x: gx0 - 10, y: top - 12, 'text-anchor': 'end', 'font-family': 'var(--mathit)', 'font-style': 'italic', 'font-size': 13, fill: 'var(--ink-3)', text: 'σ =' }))
    for (const row of rows) {
      const y = cy(row.c)
      grid.append(
        svg('rect', { x: gx0, y: y - rowH / 2 + 3, width: gx1 - gx0, height: rowH - 6, rx: 4, fill: row.cand ? (row.zero ? 'var(--wanted-soft)' : 'var(--bad-soft)') : 'var(--paper)', stroke: 'var(--rule)' }),
        svg('text', { x: gx0 - 10, y: y + 4.5, 'text-anchor': 'end', 'font-family': 'var(--mathit)', 'font-style': 'italic', 'font-size': 14, fill: 'var(--ink-2)' }, svg('tspan', { text: 'c' }), svg('tspan', { dy: 4, 'font-size': 10, text: row.c + 1 })),
      )
      for (let sig = 0; sig < p; sig++) grid.append(svg('circle', { cx: cx(sig), cy: y, r: 2.2, fill: 'var(--rule-2)' }))
      lines.append(
        svg('path', { d: `M${ax},${midY} C${ax + 40},${midY} ${cx(row.sa) - 60},${y} ${cx(row.sa)},${y}`, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 1.3, opacity: 0.75 }),
        svg('path', { d: `M${bx},${midY} C${bx - 40},${midY} ${cx(row.sb) + 60},${y} ${cx(row.sb)},${y}`, fill: 'none', stroke: 'var(--wanted)', 'stroke-width': 1.3, opacity: 0.75 }),
      )
      dots.append(svg('circle', { cx: cx(row.sa), cy: y, r: 6.5, fill: 'var(--accent)' }))
      dots.append(svg('circle', { cx: cx(row.sb), cy: y, r: row.cand ? 9.5 : 6.5, fill: row.cand ? 'none' : 'var(--wanted)', stroke: 'var(--wanted)', 'stroke-width': row.cand ? 3 : 0 }))
    }
    dots.append(
      svg('circle', { cx: ax, cy: midY, r: 10, fill: 'var(--accent)' }),
      svg('circle', { cx: bx, cy: midY, r: 10, fill: 'var(--wanted)' }),
      svg('text', { x: ax, y: midY + 28, 'text-anchor': 'middle', 'font-family': 'var(--mathit)', 'font-style': 'italic', 'font-size': 15, fill: 'var(--ink)' }, svg('tspan', { text: 'a' }), svg('tspan', { dy: 4, 'font-size': 10, text: a + 1 })),
      svg('text', { x: bx, y: midY + 28, 'text-anchor': 'middle', 'font-family': 'var(--mathit)', 'font-style': 'italic', 'font-size': 15, fill: 'var(--ink)' }, svg('tspan', { text: 'b' }), svg('tspan', { dy: 4, 'font-size': 10, text: b + 1 })),
    )

    // ── the arithmetic behind it
    const t = el('table', { class: 'htable' })
    t.append(
      el(
        'tr',
        {},
        el('th', {}, ''),
        el('th', { html: '<var>w</var>(<var>a</var>,<var>c</var>)' }),
        el('th', { html: '<var>w</var>(<var>b</var>,<var>c</var>)' }),
        el('th', { html: '<var>S</var>' }),
        el('th', {}, ''),
      ),
    )
    for (const row of rows) {
      const verdict = row.zero ? 'zero triangle' : row.cand ? `false positive, ${signed(row.s)} = ${row.s / p}·${p}` : ''
      t.append(
        el(
          'tr',
          { class: row.zero ? 'zero' : row.cand ? 'cand' : '' },
          el('td', { html: `<var>c</var><sub>${row.c + 1}</sub>` }),
          el('td', { class: 'num' }, signed(inst.wAC[a][row.c])),
          el('td', { class: 'num' }, signed(inst.wBC[b][row.c])),
          el('td', { class: 'num' }, signed(row.s)),
          el('td', { style: `color:${row.zero ? 'var(--wanted-ink)' : 'var(--bad)'};font-weight:600` }, verdict.replace('-', '−')),
        ),
      )
    }
    tableBox.replaceChildren(t)

    // ── false positives over the whole instance, for each prime
    const W = Math.max(260, Math.min(fpBox.clientWidth || 300, 460))
    const H = 160
    const mm = { l: 30, r: 8, t: 26, b: 30 }
    const fps = PRIMES.map((q) => inst.falsePos(q))
    const y = linear([0, Math.max(...fps) * 1.15 || 1], [H - mm.b, mm.t])
    const svgFp = frame(fpBox, W, H)
    svgFp.setAttribute('aria-label', `False positives for each prime: ${PRIMES.map((q, i) => `${q}: ${fps[i]}`).join(', ')}`)
    const band = (W - mm.l - mm.r) / PRIMES.length
    svgFp.append(svg('text', { class: 'label', x: mm.l - 22, y: 12, text: `false positives among all ${N ** 3} triangles` }))
    svgFp.append(svg('line', { x1: mm.l, x2: W - mm.r, y1: H - mm.b, y2: H - mm.b, stroke: 'var(--rule-2)' }))
    PRIMES.forEach((q, i) => {
      const x0 = mm.l + band * i + band / 2 - 11
      svgFp.append(
        svg('path', { d: colPath(x0, 22, H - mm.b, y(fps[i])), fill: q === p ? 'var(--accent)' : 'var(--rule-2)' }),
        svg('text', { x: x0 + 11, y: y(fps[i]) - 5, 'text-anchor': 'middle', 'font-size': 12, fill: 'var(--ink-2)', 'font-family': 'var(--sans)', text: fps[i] }),
        svg('text', { x: x0 + 11, y: H - mm.b + 17, 'text-anchor': 'middle', 'font-size': 12.5, fill: q === p ? 'var(--ink)' : 'var(--ink-3)', 'font-weight': q === p ? 600 : 400, 'font-family': 'var(--sans)', text: q }),
      )
    })
    svgFp.append(svg('text', { class: 'label', x: W - mm.r, y: H - 2, 'text-anchor': 'end', text: 'prime p' }))

    const cands = rows.filter((r) => r.cand)
    const fp = cands.filter((r) => !r.zero).length
    const z = cands.filter((r) => r.zero).length
    readout.innerHTML =
      `<var>ρ</var> = <var>w</var>(<var>a</var>,<var>b</var>) mod ${p} = ${signed(inst.wAB[a][b])} mod ${p} = ${rho}. ` +
      `The middle part has ${N}·${p} = ${N * p} vertices. ` +
      (cands.length === 0
        ? `No shared neighbour: no triangle through this pair has weight divisible by ${p}.`
        : `${cands.length} shared neighbour${cands.length > 1 ? 's' : ''}: ` +
          (z ? '<span class="ok">the hidden zero triangle</span>' : '') +
          (z && fp ? ' and ' : '') +
          (fp ? `<span class="no">${fp} false positive${fp > 1 ? 's' : ''}</span>, which the exact check throws out` : '') +
          '.')
  }
  render()
}
