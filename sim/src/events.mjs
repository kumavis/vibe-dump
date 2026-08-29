// Interaction events, beliefs, and delegation rewrites.
//
// Trust does not update on a timer. It updates when something happens between
// two people, and the four event types differ enormously in how much they
// reveal and how much promotion can distort them. This asymmetry is the whole
// experiment: exposure is the channel hustle games, collaboration is the
// channel it cannot.

import { clamp01 } from './rng.mjs'
import { trueOutput } from './population.mjs'

export const EVENT_KINDS = {
  exposure: { info: 0.35, kappa: 1.0, noise: 0.45 },
  collaboration: { info: 1.0, kappa: 0.05, noise: 0.15 },
  patronage: { info: 0.6, kappa: 0.4, noise: 0.3 },
  referral: { info: 0.5, kappa: 0.0, noise: 0.35 } // bias inherited from source
}

/** Fold one observation into i's belief about j. */
function observe (rng, observer, subject, kind, config, inheritedSignal) {
  const spec = EVENT_KINDS[kind]
  const y = trueOutput(subject)

  let signal
  if (kind === 'referral' && inheritedSignal !== undefined) {
    // A referral carries the sourcing agent's belief, bias and all.
    signal = inheritedSignal
  } else {
    const promoted = y * (1 + config.kappa * spec.kappa * subject.traits.hustle * subject.effort.hustle)
    const sd = spec.noise * (1 - observer.traits.taste) * config.signalNoise
    signal = promoted + rng.normal(0, sd)
  }

  const prior = observer.beliefs.get(subject.id)
  const weight = spec.info
  if (prior === undefined) {
    observer.beliefs.set(subject.id, { value: signal, evidence: weight, lastSeen: 0 })
    observer.driftSinceRewrite += Math.abs(signal) * 0.5
    return
  }
  // Information-weighted EMA: more evidence means slower revision.
  const lr = weight / (prior.evidence + weight)
  const delta = lr * (signal - prior.value)
  prior.value += delta
  prior.evidence = Math.min(prior.evidence + weight, config.maxEvidence)
  observer.driftSinceRewrite += Math.abs(delta)
}

/**
 * Generate one day of interaction events across the population.
 * Returns per-kind counts for the trace.
 */
export function generateEvents (rng, agents, config, tick) {
  const n = agents.length
  const counts = { exposure: 0, collaboration: 0, patronage: 0, referral: 0 }

  // --- exposure: broadcast reach, scaled by hustle effort ---
  // Attention weights: who is available to be reached at all.
  const attention = agents.map((a) => 0.2 + a.traits.social)
  const attentionTotal = attention.reduce((s, v) => s + v, 0)

  for (let j = 0; j < n; j++) {
    const subject = agents[j]
    const reach = subject.traits.social * subject.effort.hustle * config.exposureRate
    let k = Math.floor(reach)
    if (rng.next() < reach - k) k++
    for (let e = 0; e < k; e++) {
      const i = rng.weightedIndex(attention, attentionTotal)
      if (i === j) continue
      observe(rng, agents[i], subject, 'exposure', config)
      counts.exposure++
    }
  }

  // --- collaboration: the high-signal, low-bias channel ---
  // Pairs form in proportion to craft effort. People stuck in day jobs have
  // little craft effort, so they collaborate rarely and learn about each other
  // only through the biased channel above. That coupling is deliberate.
  const collabWeight = agents.map((a) => a.effort.craft * (0.3 + a.traits.social))
  const collabTotal = collabWeight.reduce((s, v) => s + v, 0)
  const collabCount = Math.round(n * config.collabRate)
  if (collabTotal > 1e-9) {
    for (let c = 0; c < collabCount; c++) {
      const i = rng.weightedIndex(collabWeight, collabTotal)
      const j = rng.weightedIndex(collabWeight, collabTotal)
      if (i === j) continue
      observe(rng, agents[i], agents[j], 'collaboration', config)
      observe(rng, agents[j], agents[i], 'collaboration', config)
      counts.collaboration += 2
    }
  }

  // --- patronage: you paid for it, you consumed it ---
  const supplyWeight = agents.map((a) => trueOutput(a) * (0.3 + a.traits.social) + 1e-6)
  const supplyTotal = supplyWeight.reduce((s, v) => s + v, 0)
  for (let i = 0; i < n; i++) {
    const buyer = agents[i]
    const rate = buyer.traits.affinity * config.patronageRate
    let k = Math.floor(rate)
    if (rng.next() < rate - k) k++
    for (let e = 0; e < k; e++) {
      const j = rng.weightedIndex(supplyWeight, supplyTotal)
      if (i === j) continue
      observe(rng, buyer, agents[j], 'patronage', config)
      counts.patronage++
    }
  }

  // --- referral: how the graph reaches past your own neighbourhood ---
  for (let i = 0; i < n; i++) {
    const agent = agents[i]
    if (agent.trustRow.length === 0) continue
    if (rng.next() > config.referralRate * (0.3 + agent.traits.social)) continue
    const via = agents[agent.trustRow[rng.int(agent.trustRow.length)].j]
    if (via.beliefs.size === 0) continue
    const entries = [...via.beliefs.entries()]
    const [subjectId, belief] = entries[rng.int(entries.length)]
    if (subjectId === i) continue
    observe(rng, agent, agents[subjectId], 'referral', config, belief.value)
    counts.referral++
  }

  return counts
}

/**
 * Rewrite the delegation rows of agents whose beliefs have moved enough to be
 * worth acting on. Returns the number of rows rewritten this tick.
 *
 * The self-weight is where §02's Consequence 2 bites: delegating outward costs
 * (1 - alpha) of your own issuance share, so a *sophisticated* agent keeps some
 * weight on itself and preferentially endorses agents who endorse it back. A
 * naive agent ignores the cost entirely.
 */
export function updateTrust (rng, agents, config, tick, g) {
  const n = agents.length
  let rewrites = 0

  // Conformity weighs "who is already highly ranked" against own belief. Rank
  // has to enter as a PERCENTILE, not as raw g: allocation shares span orders of
  // magnitude, so feeding g in directly makes the conformity term dwarf every
  // belief and collapses the whole population onto whoever holds the most —
  // rank feeding delegation feeding rank, with merit nowhere in the loop.
  let publicRank = null
  if (g) {
    const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => g[a] - g[b])
    publicRank = new Float64Array(n)
    for (let r = 0; r < n; r++) publicRank[order[r]] = r / Math.max(n - 1, 1)
  }

  // Who currently trusts me? Needed for the reciprocity term.
  const trustedBy = Array.from({ length: n }, () => new Set())
  for (const a of agents) for (const e of a.trustRow) trustedBy[e.j].add(a.id)

  for (const agent of agents) {
    agent.trustRowAge++
    if (agent.beliefs.size === 0) continue

    // stickiness is a threshold on accumulated belief drift, not a timer
    const threshold = config.rewriteThreshold * (0.2 + agent.traits.stickiness * 2.5)
    if (agent.driftSinceRewrite < threshold) continue
    // even a triggered agent may not get round to it today
    if (rng.next() > config.rewriteChance) continue

    const conformity = agent.traits.conformity
    const scored = []
    for (const [j, belief] of agent.beliefs) {
      if (j === agent.id) continue
      const rank = publicRank ? publicRank[j] : 0
      const merit = (1 - conformity) * belief.value + conformity * rank * config.rankScale
      const reciprocal = trustedBy[agent.id].has(j) ? config.reciprocityBonus : 0
      scored.push({ j, score: merit + reciprocal * agent.traits.sophistication })
    }
    if (scored.length === 0) continue

    scored.sort((a, b) => b.score - a.score)
    const k = Math.min(config.delegationK, scored.length)
    const top = scored.slice(0, k).filter((s) => s.score > 0)
    if (top.length === 0) {
      agent.trustRow = []
      agent.driftSinceRewrite = 0
      agent.trustRowAge = 0
      continue
    }

    // Softmax over the surviving candidates.
    const maxScore = top[0].score
    const exps = top.map((s) => Math.exp((s.score - maxScore) / config.softmaxTemp))
    const expTotal = exps.reduce((s, v) => s + v, 0)

    // A sophisticated agent prices the cost of endorsing and holds some weight
    // back on itself; a naive one delegates everything.
    const selfWeight = clamp01(agent.traits.sophistication * config.selfWeightMax)
    const outward = 1 - selfWeight

    const row = top.map((s, idx) => ({ j: s.j, w: outward * (exps[idx] / expTotal) }))
    if (selfWeight > 1e-9) row.push({ j: agent.id, w: selfWeight })

    agent.trustRow = row
    agent.driftSinceRewrite = 0
    agent.trustRowAge = 0
    agent.lastRewriteTick = tick
    rewrites++
  }

  return rewrites
}

/** Sparse row-stochastic C for the whole population. Empty row == self-trust. */
export function buildTrustRows (agents) {
  return agents.map((a) => a.trustRow)
}
