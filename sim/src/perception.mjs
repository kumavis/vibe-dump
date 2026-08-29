// What an agent believes about another agent, and how an observation changes it.
//
// Shared by the two discovery paths — the feed (src/social.mjs) and direct
// interaction (src/events.mjs) — which is the whole point: they write into the
// same beliefs through channels with very different bias.

import { trueOutput } from './population.mjs'

export const EVENT_KINDS = {
  // Seeing a post. Heavily biased by packaging, and gated by legibility: only
  // the part of the work that survives compression into a post is visible.
  exposure: { info: 0.35, kappa: 1.0, noise: 0.45 },
  // Working alongside someone. High information, almost no packaging bias, and
  // legibility does not apply — you saw the work itself.
  collaboration: { info: 1.0, kappa: 0.05, noise: 0.15 },
  patronage: { info: 0.6, kappa: 0.4, noise: 0.3 },
  referral: { info: 0.5, kappa: 0.0, noise: 0.35 }
}

/**
 * Fold one observation of `subject` into `observer`'s belief.
 *
 * @param inheritedSignal for referrals: the sourcing agent's belief, bias and all
 * @param visible         for feed exposure: the pre-computed visible substance
 *                        of the post, already gated by legibility
 */
export function observe (rng, observer, subject, kind, config, inheritedSignal, visible) {
  const spec = EVENT_KINDS[kind]

  let signal
  if (kind === 'referral' && inheritedSignal !== undefined) {
    signal = inheritedSignal
  } else {
    const substance = visible !== undefined ? visible : trueOutput(subject)
    const promoted = substance +
      config.kappa * spec.kappa * subject.traits.hustle * subject.effort.hustle
    const sd = spec.noise * (1 - observer.traits.taste) * config.signalNoise
    signal = promoted + rng.normal(0, sd)
  }

  const prior = observer.beliefs.get(subject.id)
  const weight = spec.info
  if (prior === undefined) {
    observer.beliefs.set(subject.id, { value: signal, evidence: weight })
    observer.driftSinceRewrite += Math.abs(signal) * 0.5
    return signal
  }
  const lr = weight / (prior.evidence + weight)
  const delta = lr * (signal - prior.value)
  prior.value += delta
  prior.evidence = Math.min(prior.evidence + weight, config.maxEvidence)
  observer.driftSinceRewrite += Math.abs(delta)
  return prior.value
}
