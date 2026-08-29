// Trace formatting. The point of this run is to be read, so the trace is the
// product: a periodic table, the stories of a few named people, and a closing
// report that answers the one question the model exists for.

import { PERSONAS, EMPLOYMENT } from './population.mjs'
import { spearman } from './metrics.mjs'

const money = (x, digits = 0) => {
  const abs = Math.abs(x)
  if (abs >= 1e6) return `${(x / 1e6).toFixed(1)}M`
  if (abs >= 1e3) return `${(x / 1e3).toFixed(abs >= 1e4 ? 0 : 1)}k`
  return x.toFixed(digits)
}
const pct = (x, digits = 0) => `${(x * 100).toFixed(digits)}%`
const sign = (x, digits = 2) => (x >= 0 ? '+' : '') + x.toFixed(digits)

const COLUMNS = [
  ['mo', 4, (r) => String(r.month)],
  ['price', 8, (r) => r.price.toFixed(4)],
  ['pool$', 7, (r) => money(r.poolUsd)],
  ['mint$/mo', 9, (r) => money(r.issuanceUsdPerMonth)],
  ['buy$/mo', 8, (r) => money(r.patronInflowMonth)],
  ['rent$/mo', 9, (r) => money(r.forcedSellMonth)],
  ['trim$/mo', 9, (r) => money(r.rebalanceSellMonth)],
  ['FT', 4, (r) => String(r.fullTime)],
  ['PT', 4, (r) => String(r.reduced)],
  ['craft', 6, (r) => String(r.fullCraft)],
  ['rent', 5, (r) => String(r.rentier)],
  ['back', 5, (r) => String(r.returned)],
  ['craft~end', 10, (r) => sign(r.endCraftCorr)],
  ['hustl~end', 10, (r) => sign(r.endHustleCorr)],
  ['legib~end', 10, (r) => sign(r.endLegibilityCorr)],
  ['recip', 6, (r) => pct(r.reciprocityRate)],
  ['giniR', 6, (r) => r.giniRain.toFixed(3)],
  ['self', 5, (r) => pct(r.selfWeight)],
  ['out', 5, (r) => r.totalOutput.toFixed(1)]
]

export function header (config) {
  const lines = []
  lines.push('')
  lines.push('  RAINDROP OVER A SMALL-CITY ECONOMY')
  lines.push(`  seed ${config.seed} · ${config.agents} agents · ${config.years}y · ` +
    (config.raindrop
      ? `α=${config.alpha} (weight on balances) · issuance ${(config.issuanceWeekly * 100).toFixed(3)}%/wk · κ=${config.kappa}`
      : 'COUNTERFACTUAL — no Raindrop'))
  if (config.collective > 0) lines.push(`  red team: mutual-trust bloc of ${config.collective}`)
  lines.push('')
  return lines.join('\n')
}

export function tableHeader () {
  const head = COLUMNS.map(([name, w]) => name.padStart(w)).join('')
  return `${head}\n${'-'.repeat(head.length)}`
}

export function tableRow (r) {
  return COLUMNS.map(([, w, get]) => get(r).padStart(w)).join('')
}

export function legend () {
  return [
    '',
    '  FT/PT/craft  agents at full-time work, reduced hours, and full-time craft',
    '  rent         left the workforce but are not making anything — rentiers',
    '  back         agents who have been forced back to work at least once',
    '  craft~end    rank correlation of cumulative ENDORSEMENT with true craft, where',
    '               endorsement is other people\'s trust weighted by their own standing —',
    '               your balance and your self-trust both removed.',
    '  hustl~end    ...and with hustle. If hustle wins, the mechanism pays for marketing.',
    '  legib~end    ...and with legibility: how much of the work survives a post at all.',
    '               Positive means research and maintenance lose to things that photograph.',
    '  self         share of issuance decided by self-directed trust',
    '  out          total daily craft output across the population (smoothed)',
    ''
  ].join('\n')
}

/**
 * The most examinable thing in the trace: name the people trust actually lifted
 * above their stake, and the people it taxed, with the traits that explain why.
 */
function whoGotLifted (agents, k = 8) {
  const rows = agents
    .filter((a) => a.cum.proRata > 0)
    .map((a) => ({ a, amp: a.cum.rainReceived / a.cum.proRata }))
    .sort((x, y) => y.amp - x.amp)

  const fmt = (r) => '    ' +
    r.a.name.padEnd(14) +
    r.a.personaLabel.padEnd(17) +
    `${r.amp.toFixed(2)}x`.padStart(8) +
    `craft ${r.a.traits.craft.toFixed(2)}`.padStart(13) +
    `hustle ${r.a.traits.hustle.toFixed(2)}`.padStart(14) +
    `social ${r.a.traits.social.toFixed(2)}`.padStart(14) +
    `  trusted by ${countTrustedBy(agents, r.a.id)}`

  const out = ['  WHO TRUST LIFTED (amplification over a pure staking yield)']
  for (const r of rows.slice(0, k)) out.push(fmt(r))
  out.push('  ...and who it taxed')
  for (const r of rows.slice(-3)) out.push(fmt(r))
  return out.join('\n')
}

function countTrustedBy (agents, id) {
  let n = 0
  for (const a of agents) {
    if (a.id === id) continue
    if (a.trustRow.some((e) => e.j === id)) n++
  }
  return n
}

function personaTable (agents) {
  const groups = new Map()
  for (const a of agents) {
    if (!groups.has(a.persona)) groups.set(a.persona, [])
    groups.get(a.persona).push(a)
  }
  const rows = []
  for (const [key, list] of groups) {
    const n = list.length
    const mean = (f) => list.reduce((s, a) => s + f(a), 0) / n
    rows.push({
      key,
      label: PERSONAS[key].label,
      n,
      craft: mean((a) => a.traits.craft),
      hustle: mean((a) => a.traits.hustle),
      received: mean((a) => a.cum.rainReceived),
      amp: mean((a) => a.cum.rainReceived / Math.max(a.cum.proRata, 1e-9)),
      soldUsd: mean((a) => a.cum.rainSoldUsd),
      spentUsd: mean((a) => a.cum.usdSpentOnRain),
      free: list.filter((a) => a.employment !== EMPLOYMENT.FULLTIME).length,
      back: list.filter((a) => a.cum.forcedReturns > 0).length
    })
  }
  rows.sort((a, b) => b.received - a.received)

  const out = []
  out.push('  persona            n   craft  hustle   RAIN recvd    amp    sold $   bought $   free  back')
  out.push('  ' + '-'.repeat(90))
  for (const r of rows) {
    out.push('  ' +
      r.label.padEnd(18) +
      String(r.n).padStart(3) +
      r.craft.toFixed(2).padStart(8) +
      r.hustle.toFixed(2).padStart(8) +
      money(r.received).padStart(13) +
      `${r.amp.toFixed(2)}x`.padStart(8) +
      money(r.soldUsd).padStart(10) +
      money(r.spentUsd).padStart(11) +
      String(r.free).padStart(7) +
      String(r.back).padStart(6))
  }
  return out.join('\n')
}

/** Choose the agents whose stories are worth telling. */
export function pickFollowed (agents, count) {
  const byReceived = [...agents].sort((a, b) => b.cum.rainReceived - a.cum.rainReceived)
  const picks = new Set()
  const add = (a) => { if (a) picks.add(a) }

  add(byReceived[0]) // the biggest earner, whoever it turns out to be
  add([...agents].filter((a) => a.persona === 'painter').sort((a, b) => b.cum.rainReceived - a.cum.rainReceived)[0])
  add([...agents].filter((a) => a.persona === 'painter' && a.traits.craft > 0.8).sort((a, b) => a.cum.rainReceived - b.cum.rainReceived)[0])
  add([...agents].filter((a) => a.persona === 'hacker').sort((a, b) => b.cum.rainReceived - a.cum.rainReceived)[0])
  add([...agents].filter((a) => a.cum.forcedReturns > 0).sort((a, b) => b.cum.forcedReturns - a.cum.forcedReturns)[0])
  add([...agents].filter((a) => a.persona === 'connector').sort((a, b) => b.cum.rainReceived - a.cum.rainReceived)[0])

  return [...picks].filter(Boolean).slice(0, count)
}

export function stories (agents, count) {
  const followed = pickFollowed(agents, count)
  const out = ['', '  LIVES', '  ' + '-'.repeat(84)]
  for (const a of followed) {
    const state = a.employment === EMPLOYMENT.CRAFT
      ? 'full-time craft'
      : a.employment === EMPLOYMENT.REDUCED ? 'part-time work' : 'full-time work'
    out.push('')
    out.push(`  ${a.name}  (${a.personaLabel})  craft ${a.traits.craft.toFixed(2)} · hustle ${a.traits.hustle.toFixed(2)} · taste ${a.traits.taste.toFixed(2)}`)
    out.push(`    ended: ${state}, T${a.lifestyleTier} lifestyle, $${money(a.usd)} saved, ${money(a.cum.rainReceived)} RAIN received, $${money(a.cum.rainSoldUsd)} realised`)
    if (a.story.length === 0) {
      out.push('    (nothing ever happened to them)')
      continue
    }
    for (const ev of a.story.slice(0, 12)) {
      out.push(`    mo ${String(ev.month).padStart(3)}  ${ev.message}`)
    }
    if (a.story.length > 12) out.push(`    ... and ${a.story.length - 12} more`)
  }
  return out.join('\n')
}

export function summary (model) {
  const { state, agents, config } = model
  const last = state.reports[state.reports.length - 1]
  const out = ['', '  WHERE IT ENDED', '  ' + '-'.repeat(84), '']

  if (!config.raindrop) {
    out.push('  Counterfactual arm: no issuance, no token, no trust graph.')
    out.push(`  Full-time craft: ${last.fullCraft}   part-time: ${last.reduced}   full-time work: ${last.fullTime}`)
    out.push(`  Talented (craft > 0.7) not stuck in a full-time job: ${last.talentedFree} of ${last.talented}`)
    out.push(`  Mean gap between preferred and actual craft effort: ${last.welfareGap.toFixed(3)}`)
    out.push('')
    return out.join('\n')
  }

  const received = agents.map((a) => a.cum.rainReceived)
  const craft = agents.map((a) => a.traits.craft)
  const hustle = agents.map((a) => a.traits.hustle)
  const social = agents.map((a) => a.traits.social)
  const verdict = last.endCraftCorr > last.endHustleCorr ? 'craft' : 'HUSTLE'

  out.push(`  THE HEADLINE — endorsement tracked ${verdict}.`)
  out.push("    endorsement = others' trust weighted by their standing; balance removed:")
  out.push(`      craft ρ = ${sign(last.endCraftCorr)}   hustle ρ = ${sign(last.endHustleCorr)}` +
    `   taste ρ = ${sign(last.endTasteCorr)}   legibility ρ = ${sign(last.endLegibilityCorr)}` +
    `   social ρ = ${sign(last.endSocialCorr)}`)
  out.push('    amplification over a pure staking yield (ratio — heavy-tailed for small holders):')
  out.push(`      craft ρ = ${sign(last.ampCraftCorr)}   hustle ρ = ${sign(last.ampHustleCorr)}`)
  out.push('    gross RAIN received, which the pro-rata component dominates:')
  out.push(`      craft ρ = ${sign(spearman(received, craft))}   hustle ρ = ${sign(spearman(received, hustle))}` +
    `   social ρ = ${sign(spearman(received, social))}`)
  out.push('')
  out.push(whoGotLifted(agents))
  out.push('')
  out.push(`  Carrying capacity: ${last.fullCraft} agents on full-time craft, ${last.reduced} on reduced hours, ${last.rentier} rentiers.`)
  out.push(`    of the ${last.talented} with craft > 0.7, ${last.talentedFree} escaped full-time work`)
  out.push(`    ${last.invisibleTalent} high-craft agents were never observed by anyone`)
  out.push(`    ${last.returned} agents were forced back to work at least once`)
  out.push('')
  out.push('  Money in, money out (final month):')
  out.push(`    patron + curation buying   $${money(last.patronInflowMonth)}/mo`)
  out.push(`    forced selling for rent    $${money(last.forcedSellMonth)}/mo`)
  out.push(`    voluntary position trims   $${money(last.rebalanceSellMonth)}/mo`)
  out.push(`    issuance at market price   $${money(last.issuanceUsdPerMonth)}/mo`)
  out.push(`    RAIN price ${last.price.toFixed(4)} (opened ${(config.poolUsd / config.poolRain).toFixed(4)}) · pool $${money(last.poolUsd)}`)
  if (config.burnBps > 0) {
    out.push(`    base-fee burn (${config.burnBps}bps): ${money(last.burnedTotal)} RAIN destroyed vs ${money(last.mintedTotal)} minted ` +
      `— burn covered ${pct(last.burnCoverage, 1)} of issuance`)
  }
  out.push('')
  out.push('  Discovery — who the feed made visible:')
  out.push(`    followers: gini ${last.followerGini.toFixed(3)}, top 5% hold ${pct(last.followerTop, 1)} of all follows, mean ${last.meanFollowers.toFixed(0)}`)
  out.push(`    followers ~ craft ρ = ${sign(last.followerCraftCorr)}   ~ hustle ρ = ${sign(last.followerHustleCorr)}   ~ legibility ρ = ${sign(last.followerLegibilityCorr)}`)
  out.push(`    amplification ~ legibility ρ = ${sign(last.ampLegibilityCorr)}  ` +
    '(positive means the money is funding presentability, not quality)')
  out.push(`    ${last.invisibleTalent} high-craft agents were seen by fewer than 3 people`)
  out.push('')
  out.push('    field        n   mean craft   followers   amplification   escaped f/t')
  out.push('    ' + '-'.repeat(66))
  for (const [name, f] of Object.entries(last.byField).sort((a, b) => b[1].amp - a[1].amp)) {
    out.push('    ' +
      name.padEnd(11) +
      String(f.n).padStart(3) +
      f.craft.toFixed(2).padStart(13) +
      f.followers.toFixed(0).padStart(12) +
      `${f.amp.toFixed(2)}x`.padStart(16) +
      String(f.freed).padStart(14))
  }
  out.push('')
  out.push('  Trust graph:')
  out.push(`    reciprocity ${pct(last.reciprocityRate, 1)} of delegations · reciprocity~craft ρ = ${sign(last.reciprocityCraftCorr)}`)
  out.push(`    ${pct(last.selfWeight, 1)} of issuance decided by self-directed trust`)
  out.push(`    ${pct(last.staleWeight, 1)} decided by delegations older than a year ` +
    `(weighted mean age ${(last.meanTrustAge / 30).toFixed(1)} months)`)
  out.push(`    cost of endorsing: a delegator gives up ${pct(last.endorsementCost, 1)} of their own allocation`)
  out.push('')
  out.push('  Distribution:')
  out.push(`    gini(RAIN) ${last.giniRain.toFixed(3)} · gini(USD) ${last.giniUsd.toFixed(3)} · top 1% hold ${pct(last.topRainShare, 1)} of RAIN`)
  out.push('')
  out.push(personaTable(agents))
  out.push('')

  const failures = state.invariantFailures
  if (failures.length === 0) {
    out.push('  invariants: OK  (sum(g)=1, sum(g-b)=0, no negative balances)')
  } else {
    out.push(`  INVARIANT FAILURES (${failures.length}):`)
    for (const f of failures.slice(0, 5)) out.push(`    tick ${f.tick}: ${f.what} ${f.value ?? ''}`)
  }
  const ev = state.stats.events
  const fs = state.feed.stats
  out.push(`  feed: ${money(fs.posts)} posts · ${money(fs.impressions)} impressions ` +
    `(${pct(fs.impressions > 0 ? fs.curatedImpressions / fs.impressions : 0, 1)} vetted) · ${money(fs.follows)} follows`)
  out.push(`  curation: ${money(fs.digs)} posts dug through · ${money(fs.boosts)} boosted · ${money(fs.rescued)} first surfaced by a curator`)
  out.push(`  direct: ${money(ev.collaboration)} collab · ${money(ev.patronage)} patronage · ${money(ev.referral)} referral`)
  out.push(`  trust rows rewritten: ${state.stats.rewrites} · EigenTrust last converged in ${state.stats.etIterations} iterations`)
  out.push('')
  return out.join('\n')
}
