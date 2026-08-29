// Direct interaction (the channels that are not the feed) and delegation.
//
// Feed discovery lives in src/social.mjs. What remains here is the part of the
// world you learn about by being in it: working with someone, paying for their
// work, or being told about them by someone you already trust.

import { clamp01 } from './rng.mjs'
import { observe } from './perception.mjs'
import { trueOutput } from './population.mjs'

/**
 * One day of direct interaction. Returns per-kind counts for the trace.
 */
export function generateEvents (rng, agents, config, tick) {
  const n = agents.length
  const counts = { collaboration: 0, patronage: 0, referral: 0 }

  // --- collaboration: the high-signal, low-bias channel ---
  // Pairs form in proportion to craft effort, and legibility does not apply:
  // you were in the room, you saw the work. People stuck in day jobs have
  // little craft effort, so they collaborate rarely and learn about each other
  // only through the feed. That coupling is the point.
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

  // --- patronage: you paid for it and consumed it ---
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
 * Delegation.
 *
 * Two things distinguish this from "rewrite the row with your current top-k":
 *
 * 1. TRUST IS MARGINAL, NOT ABSOLUTE. The paper defines a delegation as saying
 *    this account would further the network's goals *if granted additional
 *    allocation* — which is a claim about the margin, not the level. So a
 *    delegator with `corrective` weight ranks candidates by how underserved
 *    they are: believed-in but not currently well funded. That is the direct
 *    counterweight to `conformity`, which chases whoever is already ranked
 *    highly. Both act on the same public-rank term with opposite signs.
 *
 * 2. TRUST DECAYS RATHER THAN BEING REPLACED. Assigning new trust dilutes what
 *    you granted before instead of wiping it, so old endorsements fade out over
 *    several updates. Rows carry a tail of stale small weights, turnover is
 *    gradual, and the graph is path dependent — all of which is both more
 *    realistic for a system where you sign a transaction to add an edge, and
 *    materially different from a clean rewrite for the snapshot-problem claim.
 */
export function updateTrust (rng, agents, config, tick, g) {
  const n = agents.length
  let rewrites = 0

  // Conformity and correctiveness weigh "how well funded is this person
  // already". Rank has to enter as a PERCENTILE, not as raw g: allocation
  // shares span orders of magnitude, so feeding g in directly makes the term
  // dwarf every belief and collapses the population onto whoever holds the
  // most — rank feeding delegation feeding rank, with merit nowhere in it.
  let publicRank = null
  if (g) {
    const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => g[a] - g[b])
    publicRank = new Float64Array(n)
    for (let r = 0; r < n; r++) publicRank[order[r]] = r / Math.max(n - 1, 1)
  }

  const trustedBy = Array.from({ length: n }, () => new Set())
  for (const a of agents) for (const e of a.trustRow) trustedBy[e.j].add(a.id)

  for (const agent of agents) {
    agent.trustRowAge++
    if (agent.beliefs.size === 0) continue

    const threshold = config.rewriteThreshold * (0.2 + agent.traits.stickiness * 2.5)
    // Belief evidence saturates, so drift alone eventually stops accumulating
    // and the graph freezes with whatever it happened to settle on in year one.
    // A slow base review rate keeps delegations alive without making anyone
    // attentive — this is the difference between a stale graph and a dead one.
    const triggered = agent.driftSinceRewrite >= threshold
    const reviewing = rng.next() < config.baseReviewRate * (1 - agent.traits.stickiness)
    if (!triggered && !reviewing) continue
    if (triggered && !reviewing && rng.next() > config.rewriteChance) continue

    const conformity = agent.traits.conformity
    const corrective = clamp01(agent.traits.corrective * config.correctiveScale)
    const scored = []
    for (const [j, belief] of agent.beliefs) {
      if (j === agent.id) continue
      const rank = publicRank ? publicRank[j] : 0.5
      // herding pulls toward the already-funded, correctiveness pushes away
      const crowd = (conformity - corrective) * rank * config.rankScale
      const reciprocal = trustedBy[agent.id].has(j) ? config.reciprocityBonus : 0
      scored.push({
        j,
        score: (1 - conformity) * belief.value + crowd +
          reciprocal * agent.traits.sophistication
      })
    }
    if (scored.length === 0) continue

    scored.sort((a, b) => b.score - a.score)
    const picks = scored.slice(0, config.newDelegationsPerUpdate).filter((s) => s.score > 0)
    if (picks.length === 0) {
      agent.driftSinceRewrite = 0
      continue
    }

    applyDelegations(agent, picks, config, tick)
    agent.driftSinceRewrite = 0
    agent.trustRowAge = 0
    agent.lastRewriteTick = tick
    rewrites++
  }

  return rewrites
}

/**
 * Blend new endorsements into an existing row: everything already there fades
 * by `trustDecayOnUpdate`, the new picks take up the freed weight, entries that
 * fall below the dust threshold drop off, and the row is renormalised with the
 * agent's self-weight held back.
 */
function applyDelegations (agent, picks, config, tick) {
  const selfWeight = clamp01(agent.traits.sophistication * config.selfWeightMax)
  const decay = config.trustDecayOnUpdate

  const weights = new Map()
  for (const e of agent.trustRow) {
    if (e.j === agent.id) continue
    weights.set(e.j, { w: e.w * (1 - decay), since: e.since ?? tick })
  }

  // Freed weight is split across the new picks, softmaxed by score.
  const maxScore = picks[0].score
  const exps = picks.map((p) => Math.exp((p.score - maxScore) / config.softmaxTemp))
  const expTotal = exps.reduce((s, v) => s + v, 0)
  picks.forEach((p, idx) => {
    const share = decay * (exps[idx] / expTotal)
    const prior = weights.get(p.j)
    if (prior) prior.w += share
    else weights.set(p.j, { w: share, since: tick })
  })

  let total = 0
  for (const [j, entry] of weights) {
    if (entry.w < config.minTrustWeight) weights.delete(j)
    else total += entry.w
  }
  if (total <= 0) { agent.trustRow = []; return }

  const outward = 1 - selfWeight
  const row = []
  for (const [j, entry] of weights) {
    row.push({ j, w: outward * (entry.w / total), since: entry.since })
  }
  if (selfWeight > 1e-9) row.push({ j: agent.id, w: selfWeight, since: tick })
  agent.trustRow = row
}

/** Weighted mean age of an agent's outgoing delegations, in ticks. */
export function trustAge (agent, tick) {
  let acc = 0
  let total = 0
  for (const e of agent.trustRow) {
    if (e.j === agent.id) continue
    acc += e.w * (tick - (e.since ?? tick))
    total += e.w
  }
  return total > 0 ? acc / total : 0
}
