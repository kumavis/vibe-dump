// Personas and population generation.
//
// A persona is a centre of mass in trait space, not a fixed point: every trait
// is drawn from a beta centred on the persona's value, so each Barista Painter
// is a different person.

import { clamp01 } from './rng.mjs'

// Monthly *net* income at full-time hours, before the jobSkill multiplier.
export const OCCUPATIONS = {
  barista: 1950,
  retail: 1800,
  gig: 2400,
  teacher: 3700,
  juniorDev: 4700,
  staffEng: 9800
}

// Monthly burn by lifestyle tier 0..4.
export const LIFESTYLE_TIERS = [1500, 2300, 3600, 5800, 9500]

// Fraction of the effort budget a full-time job consumes.
export const JOB_FULL = 0.70

export const PERSONAS = {
  painter: {
    label: 'Barista Painter',
    share: 0.12,
    occupation: 'barista',
    tier: 1,
    rainWeight: 0.5,
    traits: { craft: 0.85, hustle: 0.20, taste: 0.55, jobSkill: 0.30, social: 0.45, riskTolerance: 0.45, vocation: 0.90, stickiness: 0.55, conformity: 0.35, statusSeeking: 0.30, opportunism: 0.10, affinity: 0.65, sophistication: 0.25 },
    preferred: { job: 0.05, craft: 0.60, hustle: 0.10, curate: 0.05, rest: 0.20 }
  },
  connector: {
    label: 'Scene Connector',
    share: 0.05,
    occupation: 'gig',
    tier: 1,
    rainWeight: 3,
    traits: { craft: 0.30, hustle: 0.55, taste: 0.90, jobSkill: 0.45, social: 0.95, riskTolerance: 0.55, vocation: 0.70, stickiness: 0.15, conformity: 0.20, statusSeeking: 0.45, opportunism: 0.20, affinity: 0.90, sophistication: 0.55 },
    preferred: { job: 0.10, craft: 0.20, hustle: 0.20, curate: 0.30, rest: 0.20 }
  },
  hacker: {
    label: 'Growth Hacker',
    share: 0.06,
    occupation: 'gig',
    tier: 2,
    rainWeight: 1.5,
    traits: { craft: 0.22, hustle: 0.95, taste: 0.25, jobSkill: 0.50, social: 0.80, riskTolerance: 0.80, vocation: 0.25, stickiness: 0.20, conformity: 0.55, statusSeeking: 0.85, opportunism: 0.75, affinity: 0.35, sophistication: 0.90 },
    preferred: { job: 0.05, craft: 0.15, hustle: 0.55, curate: 0.05, rest: 0.20 }
  },
  patron: {
    label: 'Staff Engineer',
    share: 0.15,
    occupation: 'staffEng',
    tier: 3,
    rainWeight: 5,
    traits: { craft: 0.35, hustle: 0.30, taste: 0.55, jobSkill: 0.92, social: 0.55, riskTolerance: 0.35, vocation: 0.40, stickiness: 0.45, conformity: 0.40, statusSeeking: 0.50, opportunism: 0.10, affinity: 0.70, sophistication: 0.65 },
    preferred: { job: 0.45, craft: 0.20, hustle: 0.05, curate: 0.10, rest: 0.20 }
  },
  whale: {
    label: 'Early Whale',
    share: 0.02,
    occupation: 'gig',
    tier: 3,
    rainWeight: 40,
    traits: { craft: 0.10, hustle: 0.20, taste: 0.30, jobSkill: 0.40, social: 0.30, riskTolerance: 0.60, vocation: 0.30, stickiness: 0.97, conformity: 0.50, statusSeeking: 0.60, opportunism: 0.40, affinity: 0.15, sophistication: 0.80 },
    preferred: { job: 0.20, craft: 0.10, hustle: 0.05, curate: 0.05, rest: 0.60 }
  },
  burnout: {
    label: 'The Burnout',
    share: 0.08,
    occupation: 'juniorDev',
    tier: 3,
    rainWeight: 1,
    traits: { craft: 0.75, hustle: 0.30, taste: 0.60, jobSkill: 0.65, social: 0.40, riskTolerance: 0.12, vocation: 0.65, stickiness: 0.70, conformity: 0.40, statusSeeking: 0.70, opportunism: 0.10, affinity: 0.55, sophistication: 0.40 },
    preferred: { job: 0.15, craft: 0.50, hustle: 0.05, curate: 0.05, rest: 0.25 }
  },
  lifer: {
    label: 'The Lifer',
    share: 0.45,
    occupation: 'retail',
    tier: 1,
    rainWeight: 1,
    traits: { craft: 0.25, hustle: 0.20, taste: 0.40, jobSkill: 0.45, social: 0.40, riskTolerance: 0.25, vocation: 0.35, stickiness: 0.95, conformity: 0.55, statusSeeking: 0.40, opportunism: 0.15, affinity: 0.10, sophistication: 0.30 },
    preferred: { job: 0.50, craft: 0.05, hustle: 0.02, curate: 0.03, rest: 0.40 }
  },
  mixed: {
    label: 'Mixed',
    share: 0.07,
    occupation: 'teacher',
    tier: 2,
    rainWeight: 1,
    traits: { craft: 0.50, hustle: 0.50, taste: 0.50, jobSkill: 0.50, social: 0.50, riskTolerance: 0.50, vocation: 0.50, stickiness: 0.60, conformity: 0.50, statusSeeking: 0.50, opportunism: 0.20, affinity: 0.45, sophistication: 0.50 },
    preferred: { job: 0.35, craft: 0.25, hustle: 0.08, curate: 0.07, rest: 0.25 }
  },
  // Red team. Off by default; --collective N moves N agents into it.
  collective: {
    label: 'The Collective',
    share: 0,
    occupation: 'gig',
    tier: 1,
    rainWeight: 1.5,
    traits: { craft: 0.40, hustle: 0.65, taste: 0.45, jobSkill: 0.45, social: 0.55, riskTolerance: 0.65, vocation: 0.60, stickiness: 0.30, conformity: 0.30, statusSeeking: 0.55, opportunism: 0.60, affinity: 0.60, sophistication: 0.85 },
    preferred: { job: 0.10, craft: 0.40, hustle: 0.25, curate: 0.05, rest: 0.20 }
  }
}

const EMPLOYMENT = { FULLTIME: 'fulltime', REDUCED: 'reduced', CRAFT: 'craft' }
export { EMPLOYMENT }

function startingEffort (persona) {
  // Everyone starts working, whatever they'd rather be doing.
  const job = persona.key === 'whale' ? 0.2 : JOB_FULL
  const spare = 1 - job - 0.2
  const p = persona.preferred
  const craftShare = p.craft / Math.max(p.craft + p.hustle + p.curate, 1e-6)
  const hustleShare = p.hustle / Math.max(p.craft + p.hustle + p.curate, 1e-6)
  return {
    job,
    craft: spare * craftShare,
    hustle: spare * hustleShare,
    curate: Math.max(spare * (1 - craftShare - hustleShare), 0),
    rest: 0.2
  }
}

export function buildPopulation (rng, config) {
  const n = config.agents
  const keys = Object.keys(PERSONAS).filter((k) => PERSONAS[k].share > 0)

  // Deterministic quota per persona, remainder to `lifer`.
  const counts = {}
  let assigned = 0
  for (const k of keys) {
    counts[k] = Math.round(PERSONAS[k].share * n)
    assigned += counts[k]
  }
  counts.lifer += n - assigned

  const roster = []
  for (const k of keys) for (let i = 0; i < counts[k]; i++) roster.push(k)
  // Optional red-team bloc, carved out of the lifers.
  for (let i = 0; i < (config.collective ?? 0); i++) {
    const idx = roster.lastIndexOf('lifer')
    if (idx >= 0) roster[idx] = 'collective'
  }
  rng.shuffle(roster)

  const perPersonaCount = {}
  const agents = roster.map((key, id) => {
    const persona = { ...PERSONAS[key], key }
    perPersonaCount[key] = (perPersonaCount[key] ?? 0) + 1
    const t = {}
    for (const [name, mean] of Object.entries(persona.traits)) {
      t[name] = rng.trait(mean, 16)
    }
    // People mostly start living within their means. Take the persona's tier as
    // an aspiration and step it down to something the day job actually covers,
    // otherwise the whole population opens the run in deficit and dumps RAIN in
    // month one for reasons that have nothing to do with the mechanism.
    const wage = OCCUPATIONS[persona.occupation] * (0.7 + 0.6 * t.jobSkill)
    let tier = Math.max(0, Math.min(4, persona.tier + (rng.bool(0.25) ? (rng.bool(0.5) ? 1 : -1) : 0)))
    while (tier > 0 && LIFESTYLE_TIERS[tier] > wage * 0.92) tier--
    return {
      id,
      name: `${key}-${String(perPersonaCount[key]).padStart(2, '0')}`,
      persona: key,
      personaLabel: persona.label,
      traits: t,
      preferred: { ...persona.preferred },
      effort: startingEffort(persona),
      occupation: persona.occupation,
      employment: EMPLOYMENT.FULLTIME,
      wagePenalty: 1,
      reentryCooldown: 0,
      lifestyleTier: tier,
      usd: rng.lognormal(3100, 1.05),
      rain: 0, // filled below
      rainIncomeEma: 0,
      incomeEma3mo: 0,
      beliefs: new Map(), // id -> { value, evidence }
      driftSinceRewrite: 0,
      trustRow: [], // empty == self-trust
      trustRowAge: 0,
      lastRewriteTick: -1,
      // cumulative accounting
      cum: {
        craftOutput: 0,
        rainReceived: 0,
        // The redistributive part of issuance: what trust moved, net of the
        // pro-rata share this agent's balance would have earned anyway.
        netIncidence: 0,
        // What a pure staking yield would have paid them, for the ratio below.
        proRata: 0,
        rainSoldUsd: 0,
        usdSpentOnRain: 0,
        wages: 0,
        weeksFullCraft: 0,
        forcedReturns: 0,
        endorsementCost: 0
      },
      story: []
    }
  })

  // Initial RAIN: persona weight times a lognormal shock, normalised to the
  // circulating (non-pool) supply.
  const raw = agents.map((a) => PERSONAS[a.persona].rainWeight * rng.lognormal(1, 0.7))
  const rawTotal = raw.reduce((s, v) => s + v, 0)
  const circulating = config.rainSupply - config.poolRain
  agents.forEach((a, i) => { a.rain = (raw[i] / rawTotal) * circulating })

  return agents
}

export function monthlyFullWage (agent) {
  return OCCUPATIONS[agent.occupation] * (0.7 + 0.6 * agent.traits.jobSkill) * agent.wagePenalty
}

export function monthlyBurn (agent) {
  return LIFESTYLE_TIERS[agent.lifestyleTier]
}

export function trueOutput (agent) {
  const burnout = agent.effort.rest < 0.15 ? (0.15 - agent.effort.rest) * 3 : 0
  return agent.traits.craft * agent.effort.craft * clamp01(1 - burnout)
}
