// EigenTrust, in the original Kamvar/Schlosser/Garcia-Molina form:
//
//     t <- (1 - alpha) * C^T t + alpha * p
//
// alpha is the weight on the PRE-TRUST vector p (high alpha leans on balances,
// low alpha leans on the trust graph). Raindrop sets p = b, the normalised RAIN
// balance distribution.
//
// Conventions pinned for this model:
//   - rows are row-stochastic
//   - a row with no outgoing delegations is SELF-TRUST (e_i), not a fallback to p
//   - self-trust is allowed and is the default; the diagonal is not zeroed
//
// Because self-loops are permitted, C^T has repeated unit eigenvalues (every
// self-truster is a closed class) and the alpha -> 0 limit is degenerate. The
// alpha * p term is what makes the fixed point unique, so alpha must stay
// meaningfully above zero.

/**
 * @param {Array<Array<{j:number,w:number}>>} rows sparse row-stochastic C.
 *        An empty row is treated as self-trust.
 * @param {Float64Array} pre normalised pre-trust vector p (sums to 1)
 * @param {number} alpha weight on p, in (0, 1]
 * @param {object} [opts]
 * @param {Float64Array} [opts.warmStart] previous solution; the graph trickles,
 *        so warm-starting cuts convergence to a handful of iterations
 * @param {number} [opts.tol] L1 convergence tolerance
 * @param {number} [opts.maxIter]
 * @returns {{ g: Float64Array, iterations: number, residual: number }}
 */
export function eigenTrust (rows, pre, alpha, opts = {}) {
  const n = pre.length
  const tol = opts.tol ?? 1e-10
  const maxIter = opts.maxIter ?? 200

  let t = opts.warmStart && opts.warmStart.length === n
    ? Float64Array.from(opts.warmStart)
    : Float64Array.from(pre)

  let next = new Float64Array(n)
  let iterations = 0
  let residual = Infinity

  for (; iterations < maxIter; iterations++) {
    next.fill(0)

    // propagate: next[j] += t[i] * w for every edge i -> j
    for (let i = 0; i < n; i++) {
      const row = rows[i]
      const ti = t[i]
      if (ti === 0) continue
      if (row === undefined || row.length === 0) {
        next[i] += ti // empty row == self-trust
        continue
      }
      for (let e = 0; e < row.length; e++) next[row[e].j] += ti * row[e].w
    }

    residual = 0
    for (let k = 0; k < n; k++) {
      const v = (1 - alpha) * next[k] + alpha * pre[k]
      residual += Math.abs(v - t[k])
      next[k] = v
    }

    const swap = t; t = next; next = swap
    if (residual < tol) { iterations++; break }
  }

  // Guard against drift from repeated float ops.
  let sum = 0
  for (let k = 0; k < n; k++) sum += t[k]
  if (sum > 0 && Math.abs(sum - 1) > 1e-12) {
    for (let k = 0; k < n; k++) t[k] /= sum
  }

  return { g: t, iterations, residual }
}

/** Build the normalised pre-trust vector from raw balances. */
export function preTrustFromBalances (balances, out) {
  const n = balances.length
  const p = out ?? new Float64Array(n)
  let total = 0
  for (let i = 0; i < n; i++) total += balances[i]
  if (total <= 0) {
    p.fill(1 / n)
    return p
  }
  for (let i = 0; i < n; i++) p[i] = balances[i] / total
  return p
}
