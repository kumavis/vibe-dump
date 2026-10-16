// Chapter 7: strings of variables index the entries of thin matrices
// (Figure 4 of the paper). Pick which two levels are inner, change any
// variable, and see which row and column of X_Q, Y_Q and X_Q Y_Q it names.

import { $, el, color, fitCanvas, onResize, onTheme } from '../util.js'
import { L, M, shared, setShared, onShared, strings, positions, sortedQ, LEFT_NAMES, RIGHT_NAMES, OUT_NAMES } from '../state.js'

const N0 = 3 ** (L - M)
const D = 4 ** M

export function initStrings() {
  const root = $('#strs')
  if (!root) return

  const ui = el('div', { class: 'strs__ui' })
  const mats = el('div', { class: 'strs__mats' })
  root.append(ui, mats)

  const grid = el('div', { class: 'strgrid', role: 'group', 'aria-label': 'Strings of six levels' })
  const lvlBtns = []
  const uBtns = []
  const vBtns = []
  const wCells = []
  grid.append(el('span', { class: 'rowlab' }, 'level'))
  for (let l = 0; l < L; l++) {
    const b = el('button', { type: 'button', class: 'lvl', 'aria-pressed': 'false' }, String(l + 1))
    b.addEventListener('click', () => toggleLevel(l))
    grid.append(b)
    lvlBtns.push(b)
  }
  grid.append(el('span', { class: 'rowlab', html: 'left <var>u</var>' }))
  for (let l = 0; l < L; l++) {
    const b = el('button', { type: 'button', class: 'cell' })
    b.addEventListener('click', () => cycle('u', l))
    grid.append(b)
    uBtns.push(b)
  }
  grid.append(el('span', { class: 'rowlab', html: 'right <var>v</var>' }))
  for (let l = 0; l < L; l++) {
    const b = el('button', { type: 'button', class: 'cell' })
    b.addEventListener('click', () => cycle('v', l))
    grid.append(b)
    vBtns.push(b)
  }
  grid.append(el('span', { class: 'rowlab', html: 'output <var>w</var>' }))
  for (let l = 0; l < L; l++) {
    const c = el('span', { class: 'cell' })
    grid.append(c)
    wCells.push(c)
  }
  const explain = el('p', { class: 'readout', 'aria-live': 'polite' })
  ui.append(grid, explain)

  const cv = el('canvas', { 'aria-label': 'The matrices X_Q, Y_Q and their product, with the named entries marked' })
  const legend = el('p', { class: 'cap' })
  const tiles = el('div', { class: 'facts-mini' })
  mats.append(cv, legend, tiles)
  const tile = (label, value, note) =>
    el('div', { class: 'tile' }, el('span', { class: 'tile__label', html: label }), el('span', { class: 'tile__value', html: value }), note ? el('span', { class: 'tile__note', html: note }) : null)
  tiles.append(
    tile('rows of <var>X<sub>Q</sub></var>', `3<sup>${L - M}</sup> = ${N0}`, 'one per choice of <var>x</var>’s'),
    tile('inner dimension', `4<sup>${M}</sup> = ${D}`, 'one per choice of <var>p</var>’s'),
    tile('products per run', `<span class="binom"><span><span>6</span><span>2</span></span></span> = 15`, 'one per set <var>Q</var>'),
    tile('leaves per run', '10<sup>6</sup>', 'for 15·81² = 98,415 entries'),
  )

  function toggleLevel(l) {
    if (shared.Q.includes(l)) return
    // keep exactly m inner levels: the oldest one leaves
    setShared({ Q: [...shared.Q.slice(1), l] }, 'strings')
  }
  function cycle(side, l) {
    const inner = shared.Q.includes(l)
    if (side === 'u') {
      if (inner) shared.uP[l] = (shared.uP[l] + 1) % 4
      else shared.uX[l] = (shared.uX[l] + 1) % 3
    } else {
      if (inner) shared.vQ[l] = (shared.vQ[l] + 1) % 4
      else shared.vY[l] = (shared.vY[l] + 1) % 3
    }
    setShared({}, 'strings')
  }

  function draw() {
    const pos = positions()
    const width = Math.min(mats.clientWidth, 420)
    const s = Math.max(2, Math.floor(((width - 8) / (D + N0)) * 4) / 4)
    const gap = 8
    const labelH = 0
    const W = D * s + gap + N0 * s
    const H = labelH + D * s + gap + N0 * s
    cv.style.width = `${W}px`
    cv.style.height = `${H}px`
    const { ctx } = fitCanvas(cv, W, H)
    ctx.clearRect(0, 0, W, H)
    const tikz = color('tikz')
    const tline = color('tikz-line')
    const acc = color('accent')
    const wanted = color('wanted')
    const band = (c, a) => {
      ctx.globalAlpha = a
      return c
    }
    const paper = color('paper')
    const yX = labelH + D * s + gap
    const xY = D * s + gap
    const yY = labelH
    const rect = (x, y, w, h, fill, stroke) => {
      ctx.fillStyle = fill
      ctx.fillRect(x, y, w, h)
      if (stroke) {
        ctx.strokeStyle = stroke
        ctx.lineWidth = 1
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1)
      }
    }
    // X_Q (N0 × D), left of the product
    rect(0, yX, D * s, N0 * s, tikz, tline)
    rect(0, yX + pos.uRow * s, D * s, s, band(acc, 0.35))
    rect(pos.uCol * s, yX, s, N0 * s, band(acc, 0.35))
    ctx.globalAlpha = 1
    // Y_Q (D × N0), above it
    rect(xY, yY, N0 * s, D * s, tikz, tline)
    rect(xY, yY + pos.vRow * s, N0 * s, s, band(acc, 0.35))
    rect(xY + pos.vCol * s, yY, s, D * s, band(acc, 0.35))
    ctx.globalAlpha = 1
    // the product: its entry is the inner product of the shaded row and column
    rect(xY, yX, N0 * s, N0 * s, paper, tline)
    rect(xY, yX + pos.wRow * s, N0 * s, s, band(wanted, 0.3))
    rect(xY + pos.wCol * s, yX, s, N0 * s, band(wanted, 0.3))
    ctx.globalAlpha = 1
    // the row of X_Q and column of Y_Q that the entry multiplies
    ctx.strokeStyle = wanted
    ctx.lineWidth = 1.5
    ctx.strokeRect(0.75, yX + pos.wRow * s + 0.75, D * s - 1.5, s - 1.5)
    ctx.strokeRect(xY + pos.wCol * s + 0.75, yY + 0.75, s - 1.5, D * s - 1.5)
    // the three named entries
    const dot = (x, y, fill) => {
      const r = Math.max(3, s * 1.1)
      ctx.beginPath()
      ctx.arc(x + s / 2, y + s / 2, r, 0, Math.PI * 2)
      ctx.fillStyle = fill
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = paper
      ctx.stroke()
    }
    dot(pos.uCol * s, yX + pos.uRow * s, acc)
    dot(xY + pos.vCol * s, yY + pos.vRow * s, acc)
    dot(xY + pos.wCol * s, yX + pos.wRow * s, wanted)
  }

  function render() {
    const { u, v, w } = strings()
    const q = sortedQ()
    lvlBtns.forEach((b, l) => {
      const inner = q.includes(l)
      b.classList.toggle('in', inner)
      b.setAttribute('aria-pressed', String(inner))
      b.title = inner ? 'inner level (in Q)' : 'outer level: click to move it into Q'
    })
    uBtns.forEach((b, l) => {
      b.textContent = LEFT_NAMES[u[l]]
      b.classList.toggle('in', q.includes(l))
    })
    vBtns.forEach((b, l) => {
      b.textContent = RIGHT_NAMES[v[l]]
      b.classList.toggle('in', q.includes(l))
    })
    wCells.forEach((c, l) => {
      c.textContent = OUT_NAMES[w[l]]
      c.classList.toggle('in', q.includes(l))
    })
    const pos = positions()
    const match = q.every((l) => shared.uP[l] === shared.vQ[l])
    const qText = `{${q.map((l) => l + 1).join(', ')}}`
    const nm = (names, ds, levels) => levels.map((l) => names[ds[l]]).join(' ')
    const outer = [...Array(L).keys()].filter((l) => !q.includes(l))
    explain.innerHTML =
      `With <var>Q</var> = ${qText}: ` +
      `<var>u</var> is entry (${pos.uRow + 1}, ${pos.uCol + 1}) of <var>X<sub>Q</sub></var>, its outer part <code>${nm(LEFT_NAMES, u, outer)}</code> naming the row and its inner part <code>${nm(LEFT_NAMES, u, q)}</code> the column. ` +
      `<var>v</var> is entry (${pos.vRow + 1}, ${pos.vCol + 1}) of <var>Y<sub>Q</sub></var>. ` +
      `<var>w</var> is entry (${pos.wRow + 1}, ${pos.wCol + 1}) of <var>X<sub>Q</sub>Y<sub>Q</sub></var>, a sum of ${D} products along the shaded row and column. ` +
      (match
        ? `The inner parts of <var>u</var> and <var>v</var> carry the same indices, so <var>X<sub>Q</sub></var>[${pos.uRow + 1}, ${pos.uCol + 1}] · <var>Y<sub>Q</sub></var>[${pos.vRow + 1}, ${pos.vCol + 1}] is one of them.`
        : `Their inner parts carry different indices, so this pair is not multiplied for <var>w</var>; make them match to put it in the sum.`)
    legend.innerHTML =
      `Left, <var>X<sub>Q</sub></var> (${N0}×${D}); top, <var>Y<sub>Q</sub></var> (${D}×${N0}); ` +
      `bottom right, their product (${N0}×${N0}). Blue marks the entries <var>u</var> and <var>v</var> name; orange marks <var>w</var>.`
    draw()
  }

  onShared(render)
  onResize(mats, draw)
  onTheme(draw)
  render()
}
