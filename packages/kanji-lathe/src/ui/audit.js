// Closing the loop between the art and the metric.
//
// The legibility score is only interesting if you can act on it. "Push it" takes
// the design you have and asks how far the same idea can be driven before the
// character stops reading; the weakest-glyph scan tells you which of the thousand
// broke first, which is exactly the question a type designer proofs for.
import { buildGlyph } from '../engine/pipeline.js'
import { computeMetrics } from '../engine/metrics.js'
import { SPECS, DEFAULTS } from '../params.js'
import { clamp } from '../geom/path.js'

/** A spread of complexities — cheap to score, representative of the corpus. */
export function probeSet(corpus, n = 9) {
  const sorted = [...corpus.chars].sort((a, b) => a.strokeCount - b.strokeCount)
  const out = []
  for (let i = 0; i < n; i++) out.push(sorted[Math.round(((sorted.length - 1) * i) / (n - 1))])
  return out
}

/** Mean legibility of a parameter set over a probe set. */
export function scoreParams(P, probes) {
  let sum = 0
  let n = 0
  for (const rec of probes) {
    try {
      const skel = buildGlyph(rec, P, { quality: 0.7 })
      sum += computeMetrics(skel, P, skel.ctx).legibility
      n++
    } catch {
      sum += 0
      n++
    }
  }
  return n ? sum / n : 0
}

/**
 * Scale every deviation-from-default by k. Selects, toggles and colours are the
 * design's identity rather than its intensity, so they ride along untouched.
 */
export function scaleDeviation(P, k) {
  const out = { ...P }
  for (const spec of SPECS) {
    if (spec.stage === 'render') continue
    const d = DEFAULTS[spec.id]
    if (spec.type === 'range') {
      const v = d + (P[spec.id] - d) * k
      out[spec.id] = clamp(v, spec.min, spec.max)
    } else if (spec.type === 'curve') {
      out[spec.id] = P[spec.id].map((x, i) => clamp(d[i] + (x - d[i]) * k, 0, 1))
    }
  }
  return out
}

/**
 * Binary-search the largest intensity whose mean legibility still clears `floor`.
 * If the design already fails at its current setting the search runs the other
 * way and pulls it back, so the button is useful in both directions.
 */
export function pushIt(app, floor = 0.6, { maxK = 3, steps = 9 } = {}) {
  const probes = probeSet(app.corpus)
  const base = app.P
  const at1 = scoreParams(base, probes)
  let lo = 0
  let hi = maxK
  // If even the untouched design fails, there is nothing to push — pull instead.
  if (at1 < floor) hi = 1
  else if (scoreParams(scaleDeviation(base, maxK), probes) >= floor) {
    return { P: scaleDeviation(base, maxK), k: maxK, score: at1, capped: true }
  }
  for (let i = 0; i < steps; i++) {
    const mid = (lo + hi) / 2
    if (scoreParams(scaleDeviation(base, mid), probes) >= floor) lo = mid
    else hi = mid
  }
  const P = scaleDeviation(base, lo)
  return { P, k: lo, score: scoreParams(P, probes), capped: false }
}

/**
 * Score the whole corpus in slices so the panel keeps painting. Returns the
 * `count` least legible characters under the current design.
 */
export function auditCorpus(app, count, onProgress) {
  return new Promise((resolve) => {
    const chars = app.corpus.chars
    const scored = []
    let i = 0
    const step = () => {
      const t = performance.now()
      while (i < chars.length && performance.now() - t < 16) {
        const rec = chars[i++]
        let leg = 0
        try {
          const skel = buildGlyph(rec, app.P, { quality: 0.5 })
          leg = computeMetrics(skel, app.P, skel.ctx).legibility
        } catch {
          leg = 0
        }
        scored.push({ rec, leg })
      }
      onProgress?.(i / chars.length)
      if (i < chars.length) requestAnimationFrame(step)
      else {
        scored.sort((a, b) => a.leg - b.leg)
        const mean = scored.reduce((a, s) => a + s.leg, 0) / scored.length
        resolve({ worst: scored.slice(0, count), mean, total: scored.length, all: scored })
      }
    }
    requestAnimationFrame(step)
  })
}
