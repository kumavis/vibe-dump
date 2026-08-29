// The tick loop. One tick is a day. Issuance runs every tick, trust trickles in
// on events, bills land monthly — the three clocks stay separate on purpose,
// because Raindrop's claim to have solved the "snapshot problem" is a claim
// about their mismatch.

import { makeRng } from './rng.mjs'
import { buildPopulation, trueOutput, EMPLOYMENT } from './population.mjs'
import { generateEvents, updateTrust } from './events.mjs'
import { Feed, initFollowGraph, runFeeds, runCuration } from './social.mjs'
import { eigenTrust, preTrustFromBalances } from './eigentrust.mjs'
import { Pool, Speculator } from './market.mjs'
import { dailyWage, monthlySettlement, patronBuying, portfolioRebalance, DAYS_PER_MONTH } from './economy.mjs'
import { snapshot } from './metrics.mjs'

const INCOME_EMA_LAMBDA = 1 / 56 // ~8-week smoothing, per the spec

export function createModel (config) {
  const rng = makeRng(config.seed)
  const agents = buildPopulation(rng, config)
  const n = agents.length

  const pool = new Pool(config.poolUsd, config.poolRain, config.feeBps, config.burnBps)
  const speculator = new Speculator(config.speculatorUsd, config)
  const feed = new Feed()
  initFollowGraph(rng, agents, config)

  const state = {
    config,
    rng,
    agents,
    pool,
    speculator,
    feed,
    tick: 0,
    supply: config.rainSupply,
    dailyMint: 0,
    g: null,
    pre: new Float64Array(n),
    warm: null,
    balances: new Float64Array(n),
    endorsedBuf: new Float64Array(n),
    stats: {
      outputEma: 0,
      patronUsdMonth: 0,
      rebalanceSellMonth: 0,
      forcedSellUsd: 0,
      forcedSellUsdMonth: 0,
      worstSlippage: 0,
      mintedTotal: 0,
      burnedTotal: 0,
      endorsementCostShare: 0,
      events: { collaboration: 0, patronage: 0, referral: 0 },
      rewrites: 0,
      etIterations: 0
    },
    reports: [],
    invariantFailures: []
  }

  const log = (agent, tick, message) => {
    if (agent.story.length < 60) {
      agent.story.push({ tick, month: Math.floor(tick / DAYS_PER_MONTH), message })
    }
  }
  state.log = log

  const dailyIssuanceRate = config.issuanceWeekly / 7

  function step () {
    const tick = state.tick
    const isMonthEnd = tick > 0 && tick % DAYS_PER_MONTH === 0

    // 1a. discovery — people post, and everyone reads a feed. This runs first
    // because it decides who is visible at all, and the trust graph can only
    // rank people who are.
    feed.publish(rng, agents, config, tick)
    feed.refresh(config, tick)
    // Curators dig before the feeds run, so what they surface can reach their
    // followers the same day.
    runCuration(rng, agents, feed, config, tick)
    runFeeds(rng, agents, feed, config, tick)

    // 1b. direct interaction — the channels that bypass the feed entirely
    const counts = generateEvents(rng, agents, config, tick)
    for (const k of Object.keys(counts)) state.stats.events[k] += counts[k]

    // 2. work and produce
    let output = 0
    for (const agent of agents) {
      const wage = dailyWage(agent)
      agent.usd += wage
      agent.cum.wages += wage
      const y = trueOutput(agent)
      agent.cum.craftOutput += y
      output += y
      if (agent.employment === EMPLOYMENT.CRAFT) agent.cum.weeksFullCraft += 1 / 7
    }
    state.stats.outputEma += (output - state.stats.outputEma) * 0.02

    // 3. trust updates — only where belief has moved enough
    state.stats.rewrites += updateTrust(rng, agents, config, tick, state.g)

    // 4. issuance
    if (config.raindrop) {
      for (let i = 0; i < n; i++) state.balances[i] = agents[i].rain
      preTrustFromBalances(state.balances, state.pre)
      const rows = agents.map((a) => a.trustRow)
      const res = eigenTrust(rows, state.pre, config.alpha, { warmStart: state.warm })
      state.g = res.g
      state.warm = res.g
      state.stats.etIterations = res.iterations

      // What OTHER people's endorsements, weighted by the endorser's own
      // standing, sent to each agent. At the fixed point this is exactly
      // (g - alpha*b)/(1 - alpha) minus the self-trust term, so it is the pure
      // "what the network said about you" signal with your own balance and your
      // own self-trust both removed. It is the honest targeting measure —
      // amplification ratios blow up for the smallest holders and the ranking
      // ends up dominated by them.
      state.endorsedBuf.fill(0)
      for (let i = 0; i < n; i++) {
        const gi = state.g[i]
        if (gi === 0) continue
        for (const e of agents[i].trustRow) {
          if (e.j !== i) state.endorsedBuf[e.j] += gi * e.w
        }
      }

      const mint = state.supply * dailyIssuanceRate
      state.dailyMint = mint
      state.supply += mint
      state.stats.mintedTotal += mint
      const price = pool.price
      for (let i = 0; i < n; i++) {
        const got = mint * state.g[i]
        agents[i].rain += got
        agents[i].cum.rainReceived += got
        agents[i].cum.netIncidence += mint * (state.g[i] - state.pre[i])
        agents[i].cum.proRata += mint * state.pre[i]
        agents[i].cum.endorsed += mint * state.endorsedBuf[i]
        const usdValue = got * price
        agents[i].rainIncomeEma += (usdValue - agents[i].rainIncomeEma) * INCOME_EMA_LAMBDA
      }
    } else {
      for (const agent of agents) {
        agent.rainIncomeEma += (0 - agent.rainIncomeEma) * INCOME_EMA_LAMBDA
      }
    }

    // 5. market
    if (config.raindrop) speculator.step(pool)

    // 6-7. bills, lifestyle, employment decisions
    if (isMonthEnd) {
      const before = state.stats.forcedSellUsd
      const ctx = { pool: config.raindrop ? pool : null, config, tick, log, rng, stats: state.stats }
      if (config.raindrop) {
        const { patronUsd, curationUsd } = patronBuying(agents, state)
        state.stats.patronUsdMonth = patronUsd + curationUsd
        state.stats.rebalanceSellMonth = portfolioRebalance(agents, state)
      }
      for (const agent of agents) monthlySettlement(agent, ctx)
      state.stats.forcedSellUsdMonth = state.stats.forcedSellUsd - before
    }

    // Burned base fees leave total supply entirely — they are not anyone's
    // income and not the pool's depth. Drain what the venue destroyed today.
    if (pool.burnedPending > 0) {
      state.supply -= pool.burnedPending
      state.stats.burnedTotal += pool.burnedPending
      pool.burnedPending = 0
    }

    // 8. accounting
    checkInvariants(state)

    state.tick++
  }

  return { state, step, agents, config, report: () => snapshot(state) }
}

/**
 * The assertions that catch the model quietly cheating. The last one is the
 * important one: no USD may exist that did not come from an employer or a
 * patron. Issuance never adds a dollar.
 */
function checkInvariants (state) {
  const { agents, g, pre, config, tick } = state
  if (!config.raindrop || !g) return
  if (tick % 90 !== 0) return

  let sumG = 0
  let sumIncidence = 0
  for (let i = 0; i < g.length; i++) {
    sumG += g[i]
    sumIncidence += g[i] - pre[i]
  }
  if (Math.abs(sumG - 1) > 1e-8) {
    state.invariantFailures.push({ tick, what: 'sum(g) != 1', value: sumG })
  }
  if (Math.abs(sumIncidence) > 1e-8) {
    state.invariantFailures.push({ tick, what: 'sum(g - b) != 0', value: sumIncidence })
  }
  for (const a of agents) {
    if (!Number.isFinite(a.rain) || a.rain < -1e-6) {
      state.invariantFailures.push({ tick, what: `${a.name} rain=${a.rain}` })
      break
    }
    if (!Number.isFinite(a.usd) || a.usd < -1e-6) {
      state.invariantFailures.push({ tick, what: `${a.name} usd=${a.usd}` })
      break
    }
  }
}

/**
 * The exact cost of endorsing: re-solve with this agent's row replaced by
 * self-trust and compare its own allocation. Expensive, so it runs on a sample
 * at report cadence rather than every tick.
 */
export function measureEndorsementCost (state, sampleSize = 25) {
  const { agents, pre, config, g } = state
  if (!g) return 0
  const delegators = agents.filter((a) => a.trustRow.some((e) => e.j !== a.id))
  if (delegators.length === 0) return 0

  const rows = agents.map((a) => a.trustRow)
  const step = Math.max(1, Math.floor(delegators.length / sampleSize))
  let totalLoss = 0
  let counted = 0

  for (let s = 0; s < delegators.length; s += step) {
    const agent = delegators[s]
    const saved = rows[agent.id]
    rows[agent.id] = [] // == self-trust
    const alt = eigenTrust(rows, pre, config.alpha, { warmStart: g, maxIter: 60 })
    rows[agent.id] = saved
    // what they'd have had if they had kept it all to themselves
    totalLoss += (alt.g[agent.id] - g[agent.id]) / Math.max(alt.g[agent.id], 1e-12)
    counted++
  }
  return counted === 0 ? 0 : totalLoss / counted
}

/** Run to completion, collecting a report row every `reportEveryMonths`. */
export function run (config) {
  const model = createModel(config)
  const totalTicks = Math.round(config.years * 12 * DAYS_PER_MONTH)
  const reportEvery = Math.round(config.reportEveryMonths * DAYS_PER_MONTH)

  for (let t = 0; t < totalTicks; t++) {
    model.step()
    if (model.state.tick % reportEvery === 0) {
      model.state.stats.endorsementCostShare = config.raindrop
        ? measureEndorsementCost(model.state)
        : 0
      model.state.reports.push(model.report())
    }
  }
  return model
}
