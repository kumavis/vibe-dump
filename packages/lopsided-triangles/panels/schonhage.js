// Chapter 6: Schönhage's identity (Lemma 6), live. Ten products give the nine
// entries of an outer product, each with an error, and the inner product of
// two 4-vectors exactly.

import { $, el, signed, rng, randInt } from '../util.js'
import { applyIdentity, hats } from '../algo.js'

const sub = (name, s) => `<var>${name}</var><sub>${s}</sub>`
const hat = (name, s) => `<var>${name}̂</var><sub>${s}</sub>`
const paren = (x) => (x < 0 ? `(${signed(x)})` : String(x))

export function initSchonhage() {
  const inBox = $('#sch-inputs')
  const termBox = $('#sch-terms')
  const outBox = $('#sch-outputs')
  if (!inBox) return
  const r = rng(1981)
  const state = {
    x: [3, -1, 2],
    y: [1, 4, -2],
    p: [
      [2, -3],
      [1, 5],
    ],
    q: [
      [4, 1],
      [-2, 3],
    ],
  }

  // ── inputs
  const inputs = []
  const numIn = (get, set, kind, label) => {
    const n = el('input', { class: `num-in ${kind}`, type: 'number', min: -9, max: 9, step: 1, 'aria-label': label })
    n.addEventListener('input', () => {
      const val = Math.max(-99, Math.min(99, Math.round(Number(n.value) || 0)))
      set(val)
      render()
    })
    inputs.push([n, get])
    return n
  }
  const vecRow = (name, key) =>
    el(
      'div',
      { class: 'vec' },
      el('span', { class: 'lab', html: `<var>${name}</var>` }),
      ...[0, 1, 2].map((i) => numIn(() => state[key][i], (v) => (state[key][i] = v), 'outer', `${name}${i + 1}`)),
    )
  const matRow = (name, key) =>
    el(
      'div',
      { class: 'vec' },
      el('span', { class: 'lab', html: `<var>${name}</var>` }),
      el(
        'div',
        { class: 'grid2' },
        ...[0, 1].flatMap((i) => [0, 1].map((j) => numIn(() => state[key][i][j], (v) => (state[key][i][j] = v), 'inner', `${name}${i + 1}${j + 1}`))),
      ),
    )
  const hatBox = el('div', { class: 'hats' })
  inBox.append(
    el('h4', {}, 'Outer-product inputs'),
    vecRow('x', 'x'),
    vecRow('y', 'y'),
    el('h4', { style: 'margin-top:12px' }, 'Inner-product inputs'),
    matRow('p', 'p'),
    matRow('q', 'q'),
    el('h4', { style: 'margin-top:12px' }, 'Padded to 3×3'),
    hatBox,
  )

  // ── the ten product cards
  const cards = []
  const grid = el('div', { class: 'terms' })
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      const v = el('div', { class: 'term__v' })
      const card = el(
        'div',
        { class: 'term' },
        el('div', { class: 'term__name', html: `${sub('P', `${i + 1}${j + 1}`)}` }),
        el('div', { class: 'term__f', html: `(${sub('x', i + 1)} + ${hat('p', `${i + 1}${j + 1}`)})(${sub('y', j + 1)} + ${hat('q', `${i + 1}${j + 1}`)})` }),
        v,
      )
      grid.append(card)
      cards.push(v)
    }
  const v0 = el('div', { class: 'term__v' })
  grid.append(
    el(
      'div',
      { class: 'term term--p0' },
      el('div', { class: 'term__name', html: `${sub('P', 0)}` }),
      el('div', { class: 'term__f', html: `−(${sub('x', 1)} + ${sub('x', 2)} + ${sub('x', 3)})(${sub('y', 1)} + ${sub('y', 2)} + ${sub('y', 3)})` }),
      v0,
    ),
  )
  cards.push(v0)
  termBox.append(el('h4', {}, 'The ten products'), grid, el('p', { class: 'count', style: 'margin:8px 0 0' }, 'Ten multiplications. Computing the two products separately takes 9 + 4 = 13.'))

  // ── outputs
  const zcells = []
  const zgrid = el('div', { class: 'zgrid' })
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) {
      const c = el('div', { class: 'zc' })
      zgrid.append(c)
      zcells.push(c)
    }
  const z0box = el('div', { class: 'z0' })
  outBox.append(
    el('h4', {}, 'Outer product, with error'),
    el('p', { class: 'count', style: 'margin:-2px 0 8px', html: `${sub('z', '<var>ij</var>')} = ${sub('P', '<var>ij</var>')}` }),
    zgrid,
    el('h4', { style: 'margin-top:14px' }, 'Inner product, exact'),
    z0box,
  )

  function render() {
    for (const [n, get] of inputs) if (document.activeElement !== n) n.value = get()
    const { x, y, p, q } = state
    const res = applyIdentity(state)
    const { ph, qh } = hats(p, q)

    // p̂ with its column sums, q̂ with its row sums
    const hatGrid = (m, name, colSums) => {
      const g = el('div', { class: 'hatgrid' })
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const padded = name === 'p' ? i === 2 || j === 2 : i === 2 || j === 2
          g.append(el('span', { class: padded ? 'pad' : '' }, signed(m[i][j])))
        }
        g.append(colSums ? el('span', {}) : el('span', { class: 'sumr', title: 'row sum' }, signed(m[i][0] + m[i][1] + m[i][2])))
      }
      if (colSums) {
        for (let j = 0; j < 3; j++) g.append(el('span', { class: 'sum', title: 'column sum' }, signed(m[0][j] + m[1][j] + m[2][j])))
        g.append(el('span', {}))
      }
      return el('div', {}, el('div', { class: 'hname', html: `<var>${name}̂</var> ${colSums ? '<span class="count">columns sum to 0</span>' : '<span class="count">rows sum to 0</span>'}` }), g)
    }
    hatBox.replaceChildren(hatGrid(ph, 'p', true), hatGrid(qh, 'q', false))

    // product cards
    for (let k = 0; k < 10; k++) cards[k].innerHTML = `${paren(res.phi[k])} × ${paren(res.psi[k])} = <b>${signed(res.prod[k])}</b>`

    // outer product cells
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++) {
        const k = 3 * i + j
        const want = x[i] * y[j]
        const err = res.z[k] - want
        const c = zcells[k]
        c.className = `zc ${err === 0 ? 'exact' : 'off'}`
        c.innerHTML =
          `${sub('z', `${i + 1}${j + 1}`)} = <b>${signed(res.z[k])}</b><br>` +
          `<span class="want">${sub('x', i + 1)}${sub('y', j + 1)} = ${signed(want)}</span><br>` +
          (err === 0 ? '<span class="want">no error</span>' : `<span class="err">error ${err > 0 ? '+' : ''}${signed(err)}</span>`)
      }

    const inner = p[0][0] * q[0][0] + p[0][1] * q[0][1] + p[1][0] * q[1][0] + p[1][1] * q[1][1]
    z0box.innerHTML =
      `${sub('z', 0)} = ${sub('P', 0)} + Σ ${sub('P', '<var>ij</var>')} = <span class="big">${signed(res.z0)}</span><br>` +
      `<span class="count">${sub('p', 11)}${sub('q', 11)} + ${sub('p', 12)}${sub('q', 12)} + ${sub('p', 21)}${sub('q', 21)} + ${sub('p', 22)}${sub('q', 22)} = ` +
      `${paren(p[0][0])}·${paren(q[0][0])} + ${paren(p[0][1])}·${paren(q[0][1])} + ${paren(p[1][0])}·${paren(q[1][0])} + ${paren(p[1][1])}·${paren(q[1][1])} = ${signed(inner)}</span> ` +
      (res.z0 === inner ? '<span class="ok">✓ exact</span>' : '<span class="no">✗</span>')
  }

  $('#sch-rand').addEventListener('click', () => {
    for (let i = 0; i < 3; i++) {
      state.x[i] = randInt(r, -6, 6)
      state.y[i] = randInt(r, -6, 6)
    }
    for (let i = 0; i < 2; i++)
      for (let j = 0; j < 2; j++) {
        state.p[i][j] = randInt(r, -6, 6)
        state.q[i][j] = randInt(r, -6, 6)
      }
    render()
  })
  $('#sch-outer').addEventListener('click', () => {
    if (state.x.every((v) => v === 0) && state.y.every((v) => v === 0)) {
      state.x = [3, -1, 2]
      state.y = [1, 4, -2]
    }
    state.p = [[0, 0], [0, 0]]
    state.q = [[0, 0], [0, 0]]
    render()
  })
  $('#sch-inner').addEventListener('click', () => {
    if (state.p.flat().every((v) => v === 0) && state.q.flat().every((v) => v === 0)) {
      state.p = [[2, -3], [1, 5]]
      state.q = [[4, 1], [-2, 3]]
    }
    state.x = [0, 0, 0]
    state.y = [0, 0, 0]
    render()
  })
  render()
}
