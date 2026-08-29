// Every number the model reads, in one place, with the reasoning attached.
// Calibration target: a mid-size US city, present day, monthly figures a reader
// should recognise.

export const DEFAULTS = {
  // --- run ---
  seed: 1,
  agents: 400,
  years: 10,
  collective: 0, // red-team bloc size, carved out of the lifers
  raindrop: true, // false runs the counterfactual: same people, no issuance

  // --- Raindrop ---
  alpha: 0.5, // weight on PRE-TRUST (Kamvar convention). High = balance-led.
  issuanceWeekly: 0.0015, // 0.15%/wk ~= 7.8%/yr
  rainSupply: 10_000_000,
  poolRain: 2_000_000,
  poolUsd: 200_000, // => $0.10 opening price, $1.0M fully diluted, deliberately thin
  feeBps: 30, // liquidity fee — stays in the pool
  // EIP-1559-style base fee on the RAIN leg of every transaction, burned rather
  // than paid to anyone. The paper's deflationary lever. Note it scales with
  // ACTIVITY, and activity here is dominated by artists selling for rent — so a
  // burn is a partial automatic stabiliser: the more successful the mechanism
  // is at freeing people, the harder it contracts supply against their selling.
  burnBps: 0,

  // --- trust formation ---
  softmaxTemp: 0.35,
  selfWeightMax: 0.6, // a fully sophisticated agent keeps this much on itself
  reciprocityBonus: 0.15,
  rewriteThreshold: 0.12, // accumulated belief drift needed to bother rewriting
  rewriteChance: 0.15, // ...and even then, not today necessarily
  baseReviewRate: 0.004, // daily chance of revisiting anyway, scaled by (1-stickiness)
  rankScale: 0.15, // maps a rank percentile into belief units
  // Trust is granted at the margin and decays rather than being replaced: a new
  // endorsement dilutes everything already in the row by this fraction, so old
  // delegations fade over several updates instead of vanishing at a rewrite.
  trustDecayOnUpdate: 0.30,
  newDelegationsPerUpdate: 2,
  minTrustWeight: 0.02, // dust threshold; below this an edge drops off
  // Scales every agent's `corrective` trait — how much they delegate to the
  // UNDERSERVED (believed in but not currently well funded) rather than to the
  // best. 0 turns the behaviour off entirely and leaves only herding.
  correctiveScale: 1.0,

  // --- discovery: the feed ---
  // algoShare 0 is a pure chronological follow feed; 1 is pure recommender.
  // This is the parameter the discovery layer exists to sweep.
  algoShare: 0.55,
  algoGamma: 1.4, // >1 amplifies: twice as engaging gets more than twice the reach
  algoPackagingWeight: 1.2, // how much packaging drives the engagement the algo ranks on
  feedSize: 7, // posts consumed per agent per day, scaled by social
  postRate: 0.35,
  postTtl: 4, // days a post stays in circulation
  initialFollows: 8,
  maxFollowing: 150,
  followRate: 0.05,
  reshareRate: 0.02,
  engageScale: 0.35,
  engageWeight: 0.02,
  reshareWeight: 0.08,

  // --- direct interaction ---
  kappa: 1.6, // how much packaging inflates perceived output. THE parameter.
  signalNoise: 0.35,
  collabRate: 0.06, // collaborating pairs per agent per day
  patronageRate: 0.08,
  referralRate: 0.01,
  maxEvidence: 12,

  // --- employment ---
  coverToReduce: 0.40, // RAIN must cover this share of burn to cut hours
  coverToQuit: 0.90, // ...and this share to leave entirely
  runwayMonths: 4, // scaled by (1 - riskTolerance)
  // How hard it is to get the shift back. Both are headline sensitivities, not
  // background constants: together they decide whether quitting is a reversible
  // experiment or a cliff.
  reentryCooldownMonths: 3, // months before you can step out again
  reentryWagePenalty: 0.10, // permanent-ish wage haircut per forced return
  ratchetChance: 0.35,

  // --- demand for RAIN ---
  patronPropensity: 0.055, // share of monthly surplus a fully-affine agent gives
  curationPropensity: 0.02, // ...plus this much to buy pre-trust weight
  buyChance: 1.0,
  outputReference: 12, // network output that counts as "the scene is healthy"
  // Voluntary selling: agents trim RAIN back toward an affinity-scaled share of
  // net worth. Without it there is no sell pressure from solvent holders.
  rebalanceChance: 0.5,
  rebalanceSpeed: 0.25,
  speculatorUsd: 60_000,
  specThreshold: 0.06,
  specAggression: 0.12,

  // --- tracing ---
  reportEveryMonths: 6,
  followCount: 6
}

export function parseArgs (argv) {
  const cfg = { ...DEFAULTS }
  const rest = []
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (!arg.startsWith('--')) { rest.push(arg); continue }
    const [rawKey, inlineValue] = arg.slice(2).split('=')
    const key = rawKey.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
    if (key === 'noRaindrop') { cfg.raindrop = false; continue }
    if (key === 'help') { cfg.help = true; continue }
    if (key === 'jsonl') { cfg.jsonl = inlineValue ?? true; continue }
    if (key === 'quiet') { cfg.quiet = true; continue }
    const value = inlineValue !== undefined ? inlineValue : argv[++i]
    if (value === undefined) continue
    const num = Number(value)
    cfg[key] = Number.isFinite(num) && value.trim() !== '' ? num : value
  }
  cfg._rest = rest
  return cfg
}

export const USAGE = `
raindrop sim — a small-city economy with Raindrop issuance layered on top

  node sim/run.mjs [options]

  --seed N              rng seed (default ${DEFAULTS.seed})
  --agents N            population (default ${DEFAULTS.agents})
  --years N             simulated years (default ${DEFAULTS.years})
  --alpha F             EigenTrust weight on pre-trust/balances (default ${DEFAULTS.alpha})
  --issuance-weekly F   fraction of supply minted per week (default ${DEFAULTS.issuanceWeekly})
  --burn-bps N          EIP-1559 base-fee burn, bps of the RAIN leg (default ${DEFAULTS.burnBps})
  --reentry-cooldown-months N   months locked out after a forced return (default ${DEFAULTS.reentryCooldownMonths})
  --reentry-wage-penalty F      wage haircut per forced return (default ${DEFAULTS.reentryWagePenalty})
  --kappa F             how much packaging inflates perceived output (default ${DEFAULTS.kappa})
  --algo-share F        share of the feed from the recommender vs follows (default ${DEFAULTS.algoShare})
  --algo-gamma F        engagement amplification exponent (default ${DEFAULTS.algoGamma})
  --trust-decay-on-update F  how much old trust fades per new endorsement (default ${DEFAULTS.trustDecayOnUpdate})
  --patron-propensity F share of surplus patrons spend on RAIN (default ${DEFAULTS.patronPropensity})
  --collective N        plant a mutual-trust bloc of N agents (default 0)
  --no-raindrop         counterfactual: same population, no issuance, no token
  --report-every-months N   trace cadence (default ${DEFAULTS.reportEveryMonths})
  --follow-count N      how many named agents to narrate (default ${DEFAULTS.followCount})
  --jsonl [path]        emit one JSON object per report row (stdout if no path)
  --quiet               suppress the human-readable trace
`
