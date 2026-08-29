// Wages, bills, the lifestyle ratchet, and the quit decision.
//
// The quit decision is the mechanic the whole model exists to observe. Three
// properties matter and are enforced here: it is gradual (hours, not a binary),
// it is hysteretic (leaving needs sustained income, returning needs only an
// empty account), and it is costly to reverse (the shift is gone, and re-entry
// carries a cooldown and a wage penalty).

import {
  EMPLOYMENT, JOB_FULL, LIFESTYLE_TIERS,
  monthlyBurn, monthlyFullWage
} from './population.mjs'

export const DAYS_PER_MONTH = 30

const EFFORT_BY_STATE = {
  [EMPLOYMENT.FULLTIME]: JOB_FULL,
  [EMPLOYMENT.REDUCED]: JOB_FULL * 0.5,
  [EMPLOYMENT.CRAFT]: 0
}

/** Redistribute the effort budget after a change of employment state. */
export function setEmployment (agent, state) {
  agent.employment = state
  const job = EFFORT_BY_STATE[state]
  const p = agent.preferred
  const discretionary = Math.max(1 - job - p.rest, 0)
  const wants = p.craft + p.hustle + p.curate
  // Preferences are a target, not a ratio to be scaled up: freed-up time beyond
  // what someone actually wants to do becomes rest, it does not inflate craft.
  const share = wants > 1e-6 ? Math.min(1, discretionary / wants) : 0
  agent.effort = {
    job,
    craft: p.craft * share,
    hustle: p.hustle * share,
    curate: p.curate * share,
    rest: p.rest + Math.max(discretionary - wants * share, 0)
  }
}

export function dailyWage (agent) {
  if (agent.effort.job <= 0) return 0
  return (monthlyFullWage(agent) / DAYS_PER_MONTH) * (agent.effort.job / JOB_FULL)
}

/**
 * Monthly settlement for one agent: pay the bills, sell RAIN if short, ratchet
 * lifestyle, and revisit the employment decision.
 */
export function monthlySettlement (agent, ctx) {
  const { pool, config, tick, log } = ctx
  const burn = monthlyBurn(agent)

  // 1. bills, covered from USD first and RAIN second
  let shortfall = burn - agent.usd
  if (shortfall > 0 && agent.rain > 0 && pool) {
    const rainToSell = pool.rainForUsd(shortfall * 1.02, agent.rain)
    if (rainToSell > 0) {
      const { usdOut, slippage } = pool.sell(rainToSell)
      agent.rain -= rainToSell
      agent.usd += usdOut
      agent.cum.rainSoldUsd += usdOut
      ctx.stats.forcedSellUsd += usdOut
      ctx.stats.worstSlippage = Math.min(ctx.stats.worstSlippage, slippage)
    }
  }
  agent.usd -= burn
  let distressed = false
  if (agent.usd < 0) {
    distressed = true
    agent.usd = 0
  }

  // 2. income bookkeeping (used by the ratchet and the quit rule)
  const monthlyIncome = monthlyFullWage(agent) * (agent.effort.job / JOB_FULL) + agent.rainIncomeEma * DAYS_PER_MONTH
  agent.incomeEma3mo += (monthlyIncome - agent.incomeEma3mo) * (1 / 3)

  // 3. lifestyle ratchet: easy up, painful down
  if (agent.lifestyleTier < 4 &&
      agent.incomeEma3mo > 1.4 * burn &&
      ctx.rng.next() < agent.traits.statusSeeking * config.ratchetChance) {
    agent.lifestyleTier++
    log(agent, tick, `lifestyle up to T${agent.lifestyleTier} ($${LIFESTYLE_TIERS[agent.lifestyleTier]}/mo)`)
  }
  const runwayMonths = runway(agent)
  if (agent.lifestyleTier > 0 && (distressed || runwayMonths < 2)) {
    if (agent.downgradeDelay === undefined) agent.downgradeDelay = 1
    else if (agent.downgradeDelay > 0) agent.downgradeDelay--
    else {
      agent.lifestyleTier--
      agent.downgradeDelay = undefined
      log(agent, tick, `lifestyle DOWN to T${agent.lifestyleTier} — could not carry it`)
    }
  } else {
    agent.downgradeDelay = undefined
  }

  // 4. employment decision
  employmentDecision(agent, ctx, distressed)

  if (agent.reentryCooldown > 0) agent.reentryCooldown--
  if (agent.reentryCooldown === 0 && agent.wagePenalty < 1) {
    agent.wagePenalty = Math.min(1, agent.wagePenalty + 0.02)
  }
}

/**
 * Months of savings at the current deficit. Floored at 5% of burn so that an
 * agent who is currently in surplus reports a large-but-finite runway rather
 * than dividing by ~zero.
 */
export function runway (agent) {
  const burn = monthlyBurn(agent)
  const other = monthlyFullWage(agent) * (agent.effort.job / JOB_FULL) + agent.rainIncomeEma * DAYS_PER_MONTH
  const gap = Math.max(burn - other, burn * 0.05)
  return Math.min(agent.usd / gap, 600)
}

function employmentDecision (agent, ctx, distressed) {
  const { config, tick, log } = ctx
  const burn = monthlyBurn(agent)
  const rainMonthly = agent.rainIncomeEma * DAYS_PER_MONTH
  const cover = rainMonthly / burn
  const months = runway(agent)
  const risk = agent.traits.riskTolerance
  // vocation raises willingness to take the leap; low risk tolerance raises the
  // runway demanded before doing it
  const runwayNeed = (1 - risk) * config.runwayMonths

  // --- forced return: the account is empty ---
  if (distressed || months < 1) {
    if (agent.employment === EMPLOYMENT.CRAFT) {
      setEmployment(agent, EMPLOYMENT.REDUCED)
      agent.reentryCooldown = ctx.rng.int(Math.max(1, config.reentryCooldownMonths)) + 1
      agent.wagePenalty *= (1 - config.reentryWagePenalty)
      agent.cum.forcedReturns++
      log(agent, tick, `FORCED BACK to part-time work (RAIN covered ${(cover * 100).toFixed(0)}% of burn)`)
      return
    }
    if (agent.employment === EMPLOYMENT.REDUCED) {
      setEmployment(agent, EMPLOYMENT.FULLTIME)
      agent.reentryCooldown = ctx.rng.int(Math.max(1, config.reentryCooldownMonths)) + 1
      agent.wagePenalty *= (1 - config.reentryWagePenalty)
      agent.cum.forcedReturns++
      log(agent, tick, 'FORCED BACK to full-time work')
      return
    }
    return
  }

  if (agent.reentryCooldown > 0) return

  // --- stepping out ---
  if (agent.employment === EMPLOYMENT.FULLTIME &&
      cover > config.coverToReduce &&
      months > 3 * runwayNeed &&
      agent.traits.vocation > 0.35) {
    setEmployment(agent, EMPLOYMENT.REDUCED)
    log(agent, tick, `cut to part-time — RAIN covers ${(cover * 100).toFixed(0)}% of burn, ${months.toFixed(1)}mo runway`)
    return
  }
  if (agent.employment === EMPLOYMENT.REDUCED &&
      cover > config.coverToQuit &&
      months > 6 * runwayNeed &&
      agent.traits.vocation > 0.35) {
    setEmployment(agent, EMPLOYMENT.CRAFT)
    log(agent, tick, `QUIT the day job — RAIN covers ${(cover * 100).toFixed(0)}% of burn, ${months.toFixed(1)}mo runway`)
  }
}

/**
 * Voluntary selling. Without this, issuance piles up in the accounts of people
 * who are solvent and never need to convert, there is no sell pressure at all,
 * and the price ramps forever — which flatters the mechanism for a reason that
 * has nothing to do with whether it works.
 *
 * Agents hold RAIN up to a share of net worth that rises with affinity: a
 * believer carries a big position, a whale with no interest in the scene
 * carries a small one and sells the rest down over time.
 */
export function portfolioRebalance (agents, ctx) {
  const { pool, config, rng } = ctx
  let soldUsd = 0
  const price = pool.price

  for (const agent of agents) {
    if (agent.rain <= 0) continue
    const rainValue = agent.rain * price
    const net = agent.usd + rainValue
    if (net <= 0) continue

    const target = 0.10 + 0.65 * agent.traits.affinity
    const excessUsd = rainValue - net * target
    if (excessUsd < Math.max(150, net * 0.03)) continue
    if (rng.next() > config.rebalanceChance) continue

    // Trim gradually rather than dumping — and opportunists trim faster.
    const speed = config.rebalanceSpeed * (0.6 + agent.traits.opportunism)
    const wanted = Math.min(excessUsd * speed, rainValue)
    const rainToSell = pool.rainForUsd(wanted, agent.rain)
    if (rainToSell <= 0) continue

    const { usdOut } = pool.sell(rainToSell)
    agent.rain -= rainToSell
    agent.usd += usdOut
    agent.cum.rainSoldUsd += usdOut
    soldUsd += usdOut
  }
  return soldUsd
}

/**
 * Patron, curation and speculative demand. This is the only place real
 * purchasing power enters the token economy — issuance never adds a dollar.
 */
export function patronBuying (agents, ctx) {
  const { pool, config, rng } = ctx
  let patronUsd = 0
  let curationUsd = 0

  const outputFactor = Math.max(0.3, Math.min(2.0, ctx.stats.outputEma / Math.max(config.outputReference, 1e-6)))

  for (const agent of agents) {
    const burn = monthlyBurn(agent)
    const wage = monthlyFullWage(agent) * (agent.effort.job / JOB_FULL)
    const surplus = wage - burn
    if (surplus <= 0) continue
    // keep a buffer before giving anything away
    if (agent.usd < burn * 2) continue

    const patron = surplus * agent.traits.affinity * config.patronPropensity * outputFactor
    // buying RAIN buys pre-trust weight, so curators have a non-speculative
    // reason to hold — this is the mechanism's built-in demand floor
    const curation = surplus * agent.traits.taste * agent.traits.affinity * config.curationPropensity

    const spend = Math.min(patron + curation, agent.usd - burn)
    if (spend <= 1) continue
    if (rng.next() > config.buyChance) continue

    const { rainOut } = pool.buy(spend)
    agent.usd -= spend
    agent.rain += rainOut
    agent.cum.usdSpentOnRain += spend
    patronUsd += spend * (patron / Math.max(patron + curation, 1e-9))
    curationUsd += spend * (curation / Math.max(patron + curation, 1e-9))
  }

  return { patronUsd, curationUsd }
}
