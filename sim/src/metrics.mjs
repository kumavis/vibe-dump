// Measures. The headline is craftCorr vs hustleCorr: is the money reaching the
// work, or reaching the marketing?

import { EMPLOYMENT, monthlyBurn } from './population.mjs'
import { trustAge } from './events.mjs'

function ranks (values) {
  const idx = values.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0])
  const r = new Array(values.length)
  let i = 0
  while (i < idx.length) {
    let j = i
    while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++
    const avg = (i + j) / 2 + 1
    for (let k = i; k <= j; k++) r[idx[k][1]] = avg
    i = j + 1
  }
  return r
}

export function pearson (a, b) {
  const n = a.length
  if (n < 2) return 0
  let ma = 0; let mb = 0
  for (let i = 0; i < n; i++) { ma += a[i]; mb += b[i] }
  ma /= n; mb /= n
  let num = 0; let da = 0; let db = 0
  for (let i = 0; i < n; i++) {
    const x = a[i] - ma
    const y = b[i] - mb
    num += x * y; da += x * x; db += y * y
  }
  const den = Math.sqrt(da * db)
  return den < 1e-12 ? 0 : num / den
}

/** Rank correlation — robust to the heavy tails these quantities all have. */
export function spearman (a, b) {
  return pearson(ranks(a), ranks(b))
}

export function gini (values) {
  const v = [...values].filter((x) => x >= 0).sort((a, b) => a - b)
  const n = v.length
  if (n === 0) return 0
  let total = 0
  let weighted = 0
  for (let i = 0; i < n; i++) { total += v[i]; weighted += (i + 1) * v[i] }
  if (total <= 0) return 0
  return Math.max(0, (2 * weighted) / (n * total) - (n + 1) / n)
}

export function topShare (values, frac) {
  const v = [...values].sort((a, b) => b - a)
  const k = Math.max(1, Math.round(v.length * frac))
  const total = v.reduce((s, x) => s + x, 0)
  if (total <= 0) return 0
  return v.slice(0, k).reduce((s, x) => s + x, 0) / total
}

/** Fraction of delegations that point at someone who points back. */
export function reciprocity (agents) {
  const trusts = agents.map((a) => new Set(a.trustRow.filter((e) => e.j !== a.id).map((e) => e.j)))
  let edges = 0
  let mutual = 0
  const perAgent = agents.map(() => 0)
  for (const a of agents) {
    const out = trusts[a.id]
    if (out.size === 0) continue
    let m = 0
    for (const j of out) {
      edges++
      if (trusts[j].has(a.id)) { mutual++; m++ }
    }
    perAgent[a.id] = m / out.size
  }
  return { rate: edges === 0 ? 0 : mutual / edges, perAgent }
}

export function snapshot (state) {
  const { agents, pool, g, pre, tick, stats } = state
  const n = agents.length

  const craft = agents.map((a) => a.traits.craft)
  const hustle = agents.map((a) => a.traits.hustle)
  const taste = agents.map((a) => a.traits.taste)
  const received = agents.map((a) => a.cum.rainReceived)
  // Gross receipts are dominated by the pro-rata component — at alpha = 0.5,
  // half of every round is a straight staking yield on existing balances, which
  // buries whatever trust actually did. Cumulative net incidence isolates the
  // redistributive part, so this is the correlation that measures the mechanism
  // rather than the starting distribution.
  const incidence = agents.map((a) => a.cum.netIncidence)
  // Net incidence is still confounded by balance: whoever holds most has most
  // to lose by delegating, so incidence correlates with persona wealth rather
  // than with merit. The ratio of what an agent actually received to what a
  // pure staking yield would have paid them divides that out. Above 1 means
  // trust amplified you beyond your stake; below 1 means it taxed you.
  const amplification = agents.map((a) => a.cum.rainReceived / Math.max(a.cum.proRata, 1e-9))
  // Amplification is still a ratio, so it explodes for the smallest holders and
  // the ranking ends up dominated by them. Cumulative endorsement — other
  // people's trust weighted by their own standing — has no such denominator.
  // This is the targeting measure to trust.
  const endorsement = agents.map((a) => a.cum.endorsed)
  const rain = agents.map((a) => a.rain)
  const usd = agents.map((a) => a.usd)

  const rec = reciprocity(agents)

  // Employment split. Leaving the workforce is not the same as making things:
  // an agent living off pro-rata issuance with no craft effort is a rentier,
  // and counting them as "freed artists" would flatter the mechanism.
  let fullCraft = 0; let reduced = 0; let fullTime = 0
  let rentier = 0
  let returned = 0
  for (const a of agents) {
    if (a.employment === EMPLOYMENT.CRAFT) {
      if (a.effort.craft > 0.25) fullCraft++
      else rentier++
    } else if (a.employment === EMPLOYMENT.REDUCED) reduced++
    else fullTime++
    if (a.cum.forcedReturns > 0) returned++
  }

  // Liberation among the genuinely talented
  const talented = agents.filter((a) => a.traits.craft > 0.7)
  const talentedFree = talented.filter((a) => a.employment !== EMPLOYMENT.FULLTIME).length

  // How much of issuance is decided by stale or self-directed trust
  let selfWeight = 0
  let staleWeight = 0
  let ageAcc = 0
  let ageWeight = 0
  for (const a of agents) {
    const share = g ? g[a.id] : 0
    if (a.trustRow.length === 0) selfWeight += share
    else {
      const self = a.trustRow.find((e) => e.j === a.id)
      if (self) selfWeight += share * self.w
    }
    const age = trustAge(a, tick)
    if (age > 365) staleWeight += share
    if (a.trustRow.length > 0) { ageAcc += age * share; ageWeight += share }
  }

  // Talent nobody has ever observed
  const observedBy = new Array(n).fill(0)
  for (const a of agents) for (const j of a.beliefs.keys()) observedBy[j]++
  const topCraft = agents.filter((a) => a.traits.craft > 0.75)
  const invisible = topCraft.filter((a) => observedBy[a.id] < 3).length

  // --- the discovery layer ---
  // Attention is upstream of money: if the follower distribution tracks
  // packaging rather than work, the trust graph inherits that however good
  // everyone's taste is.
  const followers = agents.map((a) => a.followers.size)
  const legibility = agents.map((a) => a.traits.legibility)

  const byField = {}
  for (const a of agents) {
    const f = (byField[a.field] ??= { n: 0, amp: 0, followers: 0, craft: 0, freed: 0 })
    f.n++
    f.amp += a.cum.rainReceived / Math.max(a.cum.proRata, 1e-9)
    f.followers += a.followers.size
    f.craft += a.traits.craft
    if (a.employment !== EMPLOYMENT.FULLTIME) f.freed++
  }
  for (const f of Object.values(byField)) {
    f.amp /= f.n; f.followers /= f.n; f.craft /= f.n
  }

  const netIncidence = g && pre ? agents.map((a) => g[a.id] - pre[a.id]) : agents.map(() => 0)

  return {
    tick,
    month: Math.floor(tick / 30),
    price: pool.price,
    poolUsd: pool.usd,
    poolRain: pool.rain,
    supply: state.supply,
    issuanceUsdPerMonth: state.dailyMint * pool.price * 30,
    mintedTotal: stats.mintedTotal,
    burnedTotal: stats.burnedTotal,
    // How much of gross issuance the base-fee burn has clawed back. Above 1.0
    // the token is net deflationary despite continuous minting.
    burnCoverage: stats.mintedTotal > 0 ? stats.burnedTotal / stats.mintedTotal : 0,
    fullTime,
    reduced,
    fullCraft,
    rentier,
    returned,
    talented: talented.length,
    talentedFree,
    // gross receipts (includes the pro-rata staking component)
    craftCorr: spearman(received, craft),
    hustleCorr: spearman(received, hustle),
    tasteCorr: spearman(received, taste),
    // what trust actually redistributed, still balance-confounded
    incCraftCorr: spearman(incidence, craft),
    incHustleCorr: spearman(incidence, hustle),
    // endorsement received from others — the honest targeting measure
    endCraftCorr: spearman(endorsement, craft),
    endHustleCorr: spearman(endorsement, hustle),
    endTasteCorr: spearman(endorsement, taste),
    endLegibilityCorr: spearman(endorsement, legibility),
    endSocialCorr: spearman(endorsement, agents.map((a) => a.traits.social)),
    // amplification over a pure staking yield
    ampCraftCorr: spearman(amplification, craft),
    ampHustleCorr: spearman(amplification, hustle),
    ampTasteCorr: spearman(amplification, taste),
    ampSocialCorr: spearman(amplification, agents.map((a) => a.traits.social)),
    // Does the money track how *presentable* the work is, independent of how
    // good it is? A positive number here means the mechanism is funding
    // legibility — art over research, demos over maintenance.
    ampLegibilityCorr: spearman(amplification, legibility),
    amplification,

    // attention
    followerGini: gini(followers),
    followerTop: topShare(followers, 0.05),
    followerCraftCorr: spearman(followers, craft),
    followerHustleCorr: spearman(followers, hustle),
    followerLegibilityCorr: spearman(followers, legibility),
    meanFollowers: followers.reduce((s, v) => s + v, 0) / n,
    byField,
    // flattened so sweeps can aggregate them
    ampArt: byField.art?.amp ?? 0,
    ampResearch: byField.research?.amp ?? 0,
    ampInfra: byField.infra?.amp ?? 0,
    ampGeneral: byField.general?.amp ?? 0,
    flwArt: byField.art?.followers ?? 0,
    flwResearch: byField.research?.followers ?? 0,
    flwInfra: byField.infra?.followers ?? 0,
    meanTrustAge: ageWeight > 0 ? ageAcc / ageWeight : 0,
    reciprocityRate: rec.rate,
    reciprocityCraftCorr: spearman(rec.perAgent, craft),
    giniRain: gini(rain),
    giniUsd: gini(usd),
    topRainShare: topShare(rain, 0.01),
    selfWeight,
    staleWeight,
    invisibleTalent: invisible,
    totalOutput: stats.outputEma,
    patronInflowMonth: stats.patronUsdMonth,
    forcedSellMonth: stats.forcedSellUsdMonth,
    rebalanceSellMonth: stats.rebalanceSellMonth,
    endorsementCost: stats.endorsementCostShare ?? 0,
    welfareGap: agents.reduce((s, a) => s + Math.abs(a.preferred.craft - a.effort.craft), 0) / n,
    netIncidence,
    meanBurn: agents.reduce((s, a) => s + monthlyBurn(a), 0) / n
  }
}
