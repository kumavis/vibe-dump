// The worked examples. Each entry carries only its fusion rules — every number
// the page shows about it (dimensions, duals, grading, dimension of the
// category) is computed from those in fusion.js.
//
// Fusion rules are written as a table of strings: `rules[i][j]` lists the
// simple objects occurring in X_i ⊗ X_j, with repeats for multiplicity. That
// is readable enough to check against a character table by eye, which matters
// more here than compactness.

import { fpDims, globalFPdim, duals, universalGrading, groupName, characters } from './fusion.js'

/** Verlinde fusion rules for SU(2) at level k: labels 0…k, spins a/2. */
function verlinde(k) {
  const labels = Array.from({ length: k + 1 }, (_, a) => `X${sub(a)}`)
  const rules = labels.map((_, a) =>
    labels.map((__, b) => {
      const out = []
      for (let c = Math.abs(a - b); c <= Math.min(a + b, 2 * k - a - b); c += 2) out.push(labels[c])
      return out
    }),
  )
  return { labels, rules }
}

const sub = (n) => String(n).replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[+d])

/** Abelian group category: simple objects are the group elements. */
function pointed(labels, mul) {
  return {
    labels,
    rules: labels.map((_, i) => labels.map((__, j) => [labels[mul(i, j)]])),
  }
}

const RAW = [
  {
    id: 'fib',
    name: 'Fibonacci',
    blurb: 'The smallest fusion category whose dimensions are irrational. One nontrivial object that absorbs itself.',
    labels: ['1', 'τ'],
    rules: [
      [['1'], ['τ']],
      [['τ'], ['1', 'τ']],
    ],
    fpNotes: { 'τ': 'φ = (1+√5)/2' },
    globalNote:
      'FPdim(C) = (5+√5)/2 ≈ 3.618 is irrational, so the integrality theorem says nothing. Pivotality is known anyway: Fibonacci is unitary, hence pseudo-unitary.',
  },
  {
    id: 'ising',
    name: 'Ising',
    blurb: 'A fermion ψ and a spin field σ. The σ object has dimension √2 and is not invertible.',
    labels: ['1', 'ψ', 'σ'],
    rules: [
      [['1'], ['ψ'], ['σ']],
      [['ψ'], ['1'], ['σ']],
      [['σ'], ['σ'], ['1', 'ψ']],
    ],
    fpNotes: { 'σ': '√2' },
    globalNote: 'FPdim(C) = 4, an integer — pseudo-unitary by Proposition 8.24, so pivotal.',
  },
  {
    id: 'vecz3',
    name: 'Vec(Z/3)',
    blurb: 'Z/3-graded vector spaces. Every simple object is invertible — a pointed category — which is as plain as a fusion category gets past Vec itself.',
    labels: ['1', 'a', 'a²'],
    rules: pointed(['1', 'a', 'a²'], (i, j) => (i + j) % 3).rules,
    globalNote: 'FPdim(C) = 3. Pointed categories are integral, hence pseudo-unitary, hence pivotal.',
  },
  {
    id: 'reps3',
    name: 'Rep(S₃)',
    blurb: 'Representations of the symmetric group on three letters: trivial, sign, and the 2-dimensional standard one.',
    labels: ['1', 'ε', 'V'],
    rules: [
      [['1'], ['ε'], ['V']],
      [['ε'], ['1'], ['V']],
      [['V'], ['V'], ['1', 'ε', 'V']],
    ],
    globalNote:
      'FPdim(C) = 6. Rep(G) for a finite group is pivotal outright — the double dual is the identity functor.',
  },
  {
    id: 'repd4',
    name: 'Rep(D₄)',
    blurb: 'Four characters and one 2-dimensional representation of the symmetries of a square.',
    labels: ['1', 'α', 'β', 'αβ', 'm'],
    rules: [
      [['1'], ['α'], ['β'], ['αβ'], ['m']],
      [['α'], ['1'], ['αβ'], ['β'], ['m']],
      [['β'], ['αβ'], ['1'], ['α'], ['m']],
      [['αβ'], ['β'], ['α'], ['1'], ['m']],
      [['m'], ['m'], ['m'], ['m'], ['1', 'α', 'β', 'αβ']],
    ],
    globalNote: 'FPdim(C) = 8. Integral, so settled.',
  },
  {
    id: 'reps4',
    name: 'Rep(S₄)',
    blurb: 'Five irreducibles of dimensions 1, 1, 2, 3, 3 — the first example here with two distinct objects of the same dimension above 1.',
    labels: ['1', 'ε', 'V', 'W', 'W′'],
    rules: [
      [['1'], ['ε'], ['V'], ['W'], ['W′']],
      [['ε'], ['1'], ['V'], ['W′'], ['W']],
      [['V'], ['V'], ['1', 'ε', 'V'], ['W', 'W′'], ['W', 'W′']],
      [['W'], ['W′'], ['W', 'W′'], ['1', 'V', 'W', 'W′'], ['ε', 'V', 'W', 'W′']],
      [['W′'], ['W'], ['W', 'W′'], ['ε', 'V', 'W', 'W′'], ['1', 'V', 'W', 'W′']],
    ],
    globalNote: 'FPdim(C) = 24. Integral, so settled.',
  },
  {
    id: 'tyz3',
    name: 'TY(Z/3)',
    blurb: 'Tambara–Yamagami: three invertible objects plus one object m that squares to all of them at once.',
    labels: ['1', 'a', 'a²', 'm'],
    rules: [
      [['1'], ['a'], ['a²'], ['m']],
      [['a'], ['a²'], ['1'], ['m']],
      [['a²'], ['1'], ['a'], ['m']],
      [['m'], ['m'], ['m'], ['1', 'a', 'a²']],
    ],
    fpNotes: { 'm': '√3' },
    globalNote:
      'FPdim(C) = 6 even though FPdim(m) = √3 is irrational. Weakly integral is enough for Proposition 8.24.',
  },
  {
    id: 'su2-4',
    name: 'SU(2) level 4',
    blurb: 'The Verlinde category of the affine algebra at level 4 — five objects, dimensions built from sines.',
    ...verlinde(4),
    globalNote:
      'FPdim(C) = 12 — weakly integral, though not integral: two of its five objects have dimension √3. Proposition 8.24 only asks about the total.',
  },
  {
    id: 'su2-3',
    name: 'SU(2) level 3',
    blurb: 'Level 3 instead of 4: four objects, and the golden ratio turns up again.',
    ...verlinde(3),
    fpNotes: { 'X₁': 'φ', 'X₂': 'φ' },
    globalNote:
      'FPdim(C) = 4 + 2φ ≈ 7.236, irrational. The integrality theorem is silent here; unitarity settles it instead.',
  },
]

/** Expand the string rules into the multiplicity tensor and derive everything. */
function build(entry) {
  const { labels, rules } = entry
  const n = labels.length
  const index = new Map(labels.map((l, i) => [l, i]))
  const N = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => {
      const row = new Array(n).fill(0)
      for (const term of rules[i][j]) {
        const k = index.get(term)
        if (k === undefined) throw new Error(`${entry.id}: unknown object ${term}`)
        row[k]++
      }
      return row
    }),
  )
  const d = fpDims(N)
  const U = universalGrading(N)
  const FP = globalFPdim(d)
  return {
    ...entry,
    N,
    labels,
    dims: d,
    dual: duals(N),
    fpdimC: FP,
    integral: Math.abs(FP - Math.round(FP)) < 1e-9,
    grading: U,
    gradingName: groupName(U.table),
    chars: characters(U.table),
  }
}

export const CATALOG = RAW.map(build)
export const byId = (id) => CATALOG.find((c) => c.id === id) || CATALOG[0]

/** Pretty-print a decomposition like `1 ⊕ ε ⊕ V`. */
export function decompose(cat, i, j) {
  const parts = []
  for (let k = 0; k < cat.labels.length; k++) {
    const m = cat.N[i][j][k]
    if (m === 1) parts.push(cat.labels[k])
    else if (m > 1) parts.push(`${m}·${cat.labels[k]}`)
  }
  return parts.join(' ⊕ ')
}
