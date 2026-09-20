// Everything on this page that claims to be a fact about a fusion category is
// derived here, from one piece of data: the tensor of fusion multiplicities
//
//     N[i][j][k] = dim Hom(X_k, X_i ⊗ X_j)
//
// for the simple objects X_0 = 1, X_1, …, X_{n-1}. Nothing below reads a
// hand-written dimension or grading — duals, Frobenius–Perron dimensions, the
// adjoint subcategory and the universal grading group are all computed from N,
// so a typo in a fusion rule shows up as a failed invariant rather than as a
// plausible wrong number. `audit()` at the bottom is the check.

/** Matrix of left multiplication by X_i, as (M_i)[k][j] = N[i][j][k]. */
export function multMatrix(N, i) {
  const n = N.length
  return Array.from({ length: n }, (_, k) => Array.from({ length: n }, (_, j) => N[i][j][k]))
}

/**
 * The Frobenius–Perron dimensions, as the Perron eigenvector of Σ_i M_i
 * normalised at the unit object.
 *
 * That vector is the FPdim vector rather than merely proportional to it: the
 * unit-object component of M_i d = f_i d reads Σ_j N[i][j][0] d_j = f_i, and
 * N[i][j][0] is 1 exactly when X_j is the dual of X_i, so d_{i*} = f_i = f_{i*}.
 * Σ_i M_i has strictly positive entries (for any j, k some X_i contains X_k in
 * X_i ⊗ X_j), so the iteration converges.
 */
export function fpDims(N) {
  const n = N.length
  const Z = Array.from({ length: n }, () => new Array(n).fill(0))
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) Z[k][j] += N[i][j][k]
  let d = new Array(n).fill(1)
  for (let step = 0; step < 4000; step++) {
    const e = new Array(n).fill(0)
    for (let k = 0; k < n; k++) for (let j = 0; j < n; j++) e[k] += Z[k][j] * d[j]
    const s = e[0]
    for (let k = 0; k < n; k++) e[k] /= s
    let delta = 0
    for (let k = 0; k < n; k++) delta = Math.max(delta, Math.abs(e[k] - d[k]))
    d = e
    if (delta < 1e-15) break
  }
  return d
}

/** FPdim(C) = Σ FPdim(X_i)². */
export const globalFPdim = (d) => d.reduce((s, v) => s + v * v, 0)

/** i ↦ i*, read off the unique X_j whose product with X_i contains the unit. */
export function duals(N) {
  return N.map((row) => row.findIndex((col) => col[0] > 0))
}

/**
 * The simple objects of the adjoint subcategory C_ad: everything occurring in
 * some X ⊗ X*, closed under ⊗.
 */
export function adjointSimples(N) {
  const n = N.length
  const dual = duals(N)
  const inAd = new Array(n).fill(false)
  for (let i = 0; i < n; i++) for (let k = 0; k < n; k++) if (N[i][dual[i]][k] > 0) inAd[k] = true
  for (let pass = 0; pass < n + 2; pass++) {
    let grew = false
    for (let i = 0; i < n; i++) {
      if (!inAd[i]) continue
      for (let j = 0; j < n; j++) {
        if (!inAd[j]) continue
        for (let k = 0; k < n; k++) if (N[i][j][k] > 0 && !inAd[k]) { inAd[k] = true; grew = true }
      }
    }
    if (!grew) break
  }
  return inAd
}

/**
 * The universal grading group U(C): the finest group grading of C, whose
 * trivial component is C_ad. Simples sit in the same component when one occurs
 * in the other tensored with something adjoint, and the components multiply.
 *
 * This is the group whose characters are the tensor automorphisms of the
 * identity functor (Drinfeld–Gelaki–Nikshych–Ostrik), so its size is the number
 * of pivotal structures a category has — once it is known to have one at all.
 */
export function universalGrading(N) {
  const n = N.length
  const inAd = adjointSimples(N)
  const grade = new Array(n).fill(-1)
  let count = 0
  for (let start = 0; start < n; start++) {
    if (grade[start] >= 0) continue
    const g = count++
    const stack = [start]
    grade[start] = g
    while (stack.length) {
      const x = stack.pop()
      for (let a = 0; a < n; a++) {
        if (!inAd[a]) continue
        for (const [p, q] of [[a, x], [x, a]]) {
          for (let y = 0; y < n; y++) {
            if (N[p][q][y] > 0 && grade[y] < 0) { grade[y] = g; stack.push(y) }
          }
        }
      }
    }
  }
  // Component of the unit first, so the group's identity is element 0.
  const order = [grade[0], ...[...Array(count).keys()].filter((g) => g !== grade[0])]
  const relabel = new Array(count)
  order.forEach((g, idx) => { relabel[g] = idx })
  const gradeOf = grade.map((g) => relabel[g])

  const table = Array.from({ length: count }, () => new Array(count).fill(-1))
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      for (let k = 0; k < n; k++) {
        if (N[i][j][k] > 0) table[gradeOf[i]][gradeOf[j]] = gradeOf[k]
      }
    }
  }
  const members = Array.from({ length: count }, () => [])
  gradeOf.forEach((g, i) => members[g].push(i))
  return { grade: gradeOf, size: count, table, members, inAd }
}

/** Order of each group element, from a multiplication table with identity 0. */
export function elementOrders(table) {
  return table.map((_, g) => {
    let x = g
    let ord = 1
    while (x !== 0 && ord <= table.length) { x = table[x][g]; ord++ }
    return ord
  })
}

const isAbelian = (t) => t.every((row, i) => row.every((v, j) => v === t[j][i]))

/**
 * Name a small group by its invariant factors. Only the abelian case gets a
 * product name; the character group only sees the abelianisation anyway, and
 * every grading group this page displays is abelian.
 */
export function groupName(table) {
  const size = table.length
  if (size === 1) return 'trivial'
  const ords = elementOrders(table)
  if (!isAbelian(table)) return `order ${size}, non-abelian`
  const chains = []
  const build = (rest, chain) => {
    if (rest === 1) { if (chain.length) chains.push(chain); return }
    for (let d = 2; d <= rest; d++) {
      if (rest % d) continue
      if (chain.length && d % chain[chain.length - 1]) continue
      build(rest / d, [...chain, d])
    }
  }
  build(size, [])
  const signature = (list) => {
    const counts = new Map()
    const walk = (idx, ord) => {
      if (idx === list.length) { counts.set(ord, (counts.get(ord) || 0) + 1); return }
      for (let e = 0; e < list[idx]; e++) {
        const o = list[idx] / gcd(list[idx], e)
        walk(idx + 1, lcm(ord, o))
      }
    }
    walk(0, 1)
    return [...counts.entries()].sort((a, b) => a[0] - b[0]).map(([o, c]) => `${o}^${c}`).join(',')
  }
  const target = (() => {
    const counts = new Map()
    for (const o of ords) counts.set(o, (counts.get(o) || 0) + 1)
    return [...counts.entries()].sort((a, b) => a[0] - b[0]).map(([o, c]) => `${o}^${c}`).join(',')
  })()
  const hit = chains.find((c) => signature(c) === target)
  return hit ? hit.map((d) => `Z/${d}`).join(' × ') : `abelian of order ${size}`
}

const gcd = (a, b) => (b ? gcd(b, a % b) : a)
const lcm = (a, b) => (a / gcd(a, b)) * b

/**
 * All characters U → k^×, as phases in turns (λ = e^{2πiθ}).
 *
 * Every value is an e-th root of unity for e the exponent of the group, so for
 * groups this small it is cheaper to enumerate the candidate value assignments
 * and keep the homomorphisms than to hunt for invariant factors.
 */
export function characters(table) {
  const size = table.length
  const exp = elementOrders(table).reduce(lcm, 1)
  const out = []
  const phase = new Array(size).fill(0)
  const walk = (g) => {
    if (g === size) {
      for (let a = 0; a < size; a++) {
        for (let b = 0; b < size; b++) {
          const want = (phase[a] + phase[b]) % exp
          if (phase[table[a][b]] !== want) return
        }
      }
      out.push(phase.map((v) => v / exp))
      return
    }
    for (let v = 0; v < exp; v++) { phase[g] = v; walk(g + 1) }
  }
  if (Math.pow(exp, size - 1) > 2e5) return [new Array(size).fill(0)]
  walk(1)
  return out
}

/**
 * Sanity checks on a fusion tensor: unit, associativity, duality and the
 * Frobenius reciprocity symmetry N[i][j][k] = N[i*][k][j]. Used by the build
 * test, not by the page.
 */
export function audit(N) {
  const n = N.length
  const errs = []
  for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) {
    if (N[0][j][k] !== (j === k ? 1 : 0)) errs.push(`unit left ${j},${k}`)
    if (N[j][0][k] !== (j === k ? 1 : 0)) errs.push(`unit right ${j},${k}`)
  }
  // (X_i ⊗ X_j) ⊗ X_l and X_i ⊗ (X_j ⊗ X_l) must agree in the Grothendieck ring.
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let l = 0; l < n; l++) for (let t = 0; t < n; t++) {
    let left = 0
    let right = 0
    for (let m = 0; m < n; m++) left += N[i][j][m] * N[m][l][t]
    for (let m = 0; m < n; m++) right += N[j][l][m] * N[i][m][t]
    if (left !== right) errs.push(`assoc ${i},${j},${l};${t}: ${left} vs ${right}`)
  }
  const dual = duals(N)
  for (let i = 0; i < n; i++) {
    if (dual[i] < 0) errs.push(`no dual for ${i}`)
    else if (dual[dual[i]] !== i) errs.push(`dual not involutive at ${i}`)
    if (N[i][dual[i]][0] !== 1) errs.push(`unit multiplicity in ${i}⊗${i}* is not 1`)
  }
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) {
    if (N[i][j][k] !== N[dual[i]][k][j]) errs.push(`reciprocity ${i},${j},${k}`)
  }
  const d = fpDims(N)
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    let s = 0
    for (let k = 0; k < n; k++) s += N[i][j][k] * d[k]
    if (Math.abs(s - d[i] * d[j]) > 1e-9) errs.push(`FPdim homomorphism ${i},${j}`)
  }
  const U = universalGrading(N)
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++) {
    if (N[i][j][k] > 0 && U.table[U.grade[i]][U.grade[j]] !== U.grade[k]) errs.push(`grading ${i},${j},${k}`)
  }
  return errs
}
