// The sim's tunable numbers in one place (ENGINEERING.md §5: "the
// parameters the kits carry and config.js scales"; R7 gives the numbers).
// They live here rather than in src/config.js, which no workflow owns after
// the fork; the integrator may move them. Every value names where it came
// from: R7 (research/R7-game-design.md) by section, R6, or the engine's own
// calibration (research/engine.md, where the batches that tuned it are
// listed). "verify" marks a number no source gave.

export const P = {
  // --- time (ENGINEERING §2, §5) -------------------------------------------------
  step: 1 / 60,
  maxSteps: 8,
  // the threats that drop a compressed time scale back to the moment's own (R7 §4.1)
  threat: { aircraftM: 8000, salvoNearM: 1000, torpedoNearM: 3000, ownSalvoLastS: 5, shipNearM: 5000 },
  watchMaxScale: 60,
  flyHomeMaxScale: 32,

  // --- ships (R7 §4.4) ----------------------------------------------------------------
  ship: {
    effPower: 0.6, // Peff = 0.6 × shp
    addedMass: 1.05, // full load + 5 % added mass
    reverseThrust: 0.6, // back full: 60 % of forward thrust
    rudderMaxDeg: 35,
    nomotoTK: 3, // T ≈ 3L/V
    radiusK: 0.45, // steady radius = 0.45 × tactical diameter
    turnSpeedLoss: 0.32, // steady speed lost in a hard turn (R7: 25–40 %), as drag ∝ r²
    telegraphSteps: [-0.6, 0, 1 / 3, 2 / 3, 0.85, 1, 1.05], // back full, stop, one third, two thirds, standard, full, flank (fractions of top speed)
    helmSteps: [-1, -0.5, 0, 0.5, 1],
  },

  // --- aircraft (R7 §4.2) -------------------------------------------------------------------
  air: {
    eta: 0.8,
    stallNoseDeg: -20, // the nose drops toward this in a stall
    stallNoseRateDegS: 30,
    stallRollAuthority: 0.3,
    stallRecover: 1.15, // × Vs
    rollLagS: 0.12, // the roll rate's first-order lag
    breakAfterS: 3, // seconds above vBreak before a control surface fails
    blackout: { narrowG: 4.5, narrowS: 2, darkG: 6, darkS: 3, backG: 3, backS: 3 },
    gunConvergenceM: 250,
    instructorGain: 6, // load factor per radian of pointing error
    maxCLFrac: 0.9, // the instructor never pulls past 0.9 of the stall CL
    fuelFlowK: 1, // endurance runs at 1 s per s at cruise power, faster above
  },

  // --- AA (R7 §4.6) ----------------------------------------------------------------------------
  aa: {
    era: { 'us-1941': 0.5, 'us-1942': 0.85, 'us-1943': 0.95, 'us-1944': 1.0, 'jp-1941': 0.6, 'jp-1942': 0.6, 'jp-1943': 0.6, 'jp-1944': 0.65 }, // fitted by R7 to the record; jp-1944 the engine's guess (verify)
    fullWithin: 0.3, // f(range) is 1 inside 30 % of the effective range, falling to 0 at it
    aspect: { dive: 0.8, headOn: 0.8, crossing: 1.0, torpedo: 1.1 },
    alertRampS: 60, // the alertness ramp from the first sighting (R7: the SBDs on Kaga)
    hitsPerKill: 2.5, // hit events drawn at λ / pKill: each does damage of the weapon's class (R7: "hit events rather than a kill")
    burstDamage: { light: 0.3, medium: 0.6, heavy: 0.8 },
    directS: 5, // Space directs every bearing mount at the pointer's aircraft for 5 s
    bearingShare: 0.5, // of a side-mounted fit, the share that bears on one side
  },

  // --- the group rule (ENGINEERING §5; R7 §4.7) --------------------------------------------------------
  group: {
    baseRate: { dive: { cv: 0.3, cvl: 0.3, cve: 0.3, bb: 0.25, ca: 0.2, cl: 0.2, dd: 0.15, de: 0.15, default: 0.2 }, torpedo: 0.15, level: 0.02, strafe: 0, default: 0.1 },
    minShare: 0.25, // below 0.25 × Srec the beat does not fire
  },

  // --- AI gunnery (ENGINEERING §5, R7 §4.4 and §4.7; tuned to R7 §8's Washington case) -------------------
  aiGun: {
    startRangePct: 2.5,
    startMils: 3,
    improve: 0.3, // per corrected salvo
    floorRangePct: 1.0,
    floorMils: 1.5,
    resetTurnDeg: 20,
    resetSpeedKn: 5,
    resetShare: 0.5,
    // a salvo is corrected only when its fall was seen (a lit target, daylight within sight, or a radar that sees splashes)
    spotNightRadar: false, // Washington's fire-control radar saw no splashes (R5 §3.7)
    leadLagS: 60, // the director's estimate of course and speed lags 30–60 s (R7); the upper end, from the calibration
    // the engine's, from the calibration (research/engine.md): R7 §8's bands are per round; a salvo's shells share one error
    turretShare: 0.87, // the share of the solution error each turret draws for itself (√(1 − 0.5²)); the rest is the salvo's
    blindFactor: 2.2, // the error while no fall of shot has been seen and none can be (radar ranges alone, at night): 2.5 % → 5.5 %
    turnPenalty: 4, // after a turn or speed change the error is × (1 + 4·e^(−Δt / leadLagS)) while the director re-establishes the track
  },
  aiEvade: { maxTurnDeg: 30, maxSpeedKn: 5, returnS: 180, towardShare: 0.5 },
  aiDive: { cepVeteranM: 25, cepGreenM: 40 }, // dive-bombing aim error σ at release (R7 §4.7)
  aiTorpedo: { leadErrDeg: 3 },
  cap: { reactionS: [0.6, 1.0], leadMils: [2, 4], maxG: [5, 6], burstS: [1, 2], fireRangeM: 300, leadTolDeg: 1, engageRadiusM: 12000 },

  // --- torpedoes -------------------------------------------------------------------------------------------
  torpedo: { failDefault: 0.1, spreadNarrowDeg: 1, spreadWideDeg: 3, hitDepthM: 4 }, // failDefault: a verify default where no source gave a rate (DATA.md §8)

  // --- damage (R7 §4.8; tuned by the calibration tests, research/engine.md) --------------------------------------
  damage: {
    fireFight: 0.0005, // per burning zone per s × (1 + 6H)
    fireZoneCap: 0.06, // a zone's fire adds at most this + H to fight (the engine's: R7's rate alone runs away on any ship)
    fireSpread: { carrier: 1 / 120, other: 1 / 1800 }, // carrier: × H, per s, to a neighbour (other: R7's 1/900, halved)
    fireOut: { 'us-1942': 1 / 600, 'jp-1942': 1 / 900, 'us-1944': 1 / 400, 'jp-1944': 1 / 900, 'us-1941': 1 / 700, default: 1 / 800 },
    holeFlood: 2.0e-5, // float per s per hole (R7), × (1 + progressiveFlood × float)
    holePatch: { us: 1 / 1200, jp: 1 / 2400 },
    progressiveFlood: 1.5, // an unpatched hole floods faster as the ship settles: × (1 + 1.5 float) (the engine's, for Kirishima)
    holeList: 0.0025, // degrees per s of list per unpatched side hole, scaled by its size (9° an hour; the Kirishima calibration)
    counterflood: { us: 1 / 60, jp: 0.5 / 60 }, // degrees per s
    dcFloor: 0.15, // damage control's efficiency at fight 1 (it falls with fight)
    capsizeListDeg: 35,
    abandonListDeg: 20,
    founderS: [180, 600],
    doomedFires: 3,
    doomedH: 0.4,
    sinkAfterDoomedS: { carrier: [4 * 3600, 9 * 3600], other: [1800, 4 * 3600] },
    magazineChance: 0.01, // per heavy AP shell into a magazine zone inside 10 km
    crippledSpeed: 0.5,
    bowLostKn: 12,
    engineRepairS: [3000, 5400], // a stopped plant: R7's Yorktown, 60–80 min
    systemRepairS: [300, 1200],
    aircraftFireChance: { none: 0.15, 'self-sealing': 0.03 },
    aircraftFireBurnS: [8, 25],
  },

  // --- sight (R7 §4.9, R5 §6.2; verify) -------------------------------------------------------------------------
  sight: {
    dayM: 40000, // capped by the weather's visibility
    nightUnlitBigM: 8000,
    nightUnlitSmallM: 4500,
    nightLitM: 16000,
    radar: { sg: 17000, sc: 25000, fc: 18000, type22: 12000 },
    flashRevealS: 8,
    smokeRadiusM: 400,
    squallVisM: 2500,
  },

  // --- round two: assisted flight (ROUND-2 §1.2, §3; research/engine-2.md) ------------------------------------------
  // Applied in the player's aircraft physics step only, as limits and holds on the commanded state; in 'pilot'
  // the step is the first build's. The numbers named in ROUND-2 §1.2 are the contract's; the rest the engine's.
  assist: {
    bankDeg: 60, // the bank limit (§1.2)
    pitchUpDeg: 25, // the path angle limits (§1.2): +25° / −30°
    pitchDownDeg: 30,
    diveDeg: 80, // a dive bomber on its dive may go to 80° (its weapon run; the limit above would forbid the dive)
    clFrac: 0.82, // the angle-of-attack limiter: the commanded lift never past 0.82 of CLmax (the stall at 1.0)
    lowSpeed: 1.25, // below 1.25 Vs the limiter pushes the nose and opens the throttle
    overspeed: 0.9, // above 0.9 of vShake the limiter closes the throttle, opens the brakes and lifts the nose
    holdGain: 0.012, // height hold: the path angle asked per metre off the held height (rad/m), within ±holdMaxDeg
    holdMaxDeg: 8,
    levelGain: 2.5, // wings levelled at 2.5 × the bank (rad/s per rad) when the roll axis is centred
    gainSpeedRef: 1.0, // the instructor's gain × min(1, vCruise × gainSpeedRef / V), at least gainFloor
    gainFloor: 0.45,
    floorLandM: 60, // the floor (§1.2): never under 60 m over land, 15 m over the sea
    floorSeaM: 15,
    floorRunLandM: 15, // on a weapon run below the floor it is suspended to these
    floorRunSeaM: 10,
    floorLookS: [0, 1, 2, 3, 4.5, 6], // the floor looks ahead along the path
    shipClearM: 25, // and over a ship's top
    torpedoRunM: 1500, // the weapon envelope assist: a torpedo run's last 1,500 m (§1.2)
    torpedoGlideDeg: 5, // ...and above it the height is held no higher than a 5° glide to the run's start
    diveLastM: 800, // a dive's last 800 m of height (§1.2)
    levelLastS: 20, // a level run's last 20 s (§1.2)
    windowK: 2, // the release cue's window in Assisted: twice the record's (§1.2)
    torpedoWindowM: [300, 1500], // the record's drop window (range to the target), R7 §4.3 and §5
    halfTime: 0.5, // an aircraft take-over in Assisted runs the battle at 0.5×
    // what is aimed at the player's aircraft in Assisted: Guided's rule (R7 §4.5, "halves only what is aimed at the
    // player"), so a casual pilot reaches a bookmark's checkpoint (ROUND-2 §6 part 5): the AA's λ on it halved, at most
    // two fighters on it at once, each with three times the lead error and half again the reaction time, pulling clear
    // after each burst, their rounds doing half (the engine's)
    fightersOnPlayer: 2,
    hitsOnPlayerK: 0.5, // a fighter's rounds on the player's aircraft do half their damage
    fighterLeadK: 3,
    fighterBreakS: 5, // after each burst it pulls clear for 5 s, and fires again no sooner than 2 s after that
    fighterReactionK: 1.5,
  },
  // the gunner station (ROUND-2 §3): a rear gun's hazard on the fighter it is aimed at (the engine's estimate, verify)
  gunner: {
    lambda: { light: 0.006, heavy: 0.012 }, // per barrel per s inside fullWithin of rangeM: rifle calibre, 12.7 mm
    rangeM: 700,
    coneMil: 80, // the lead-error cone (§3: machine guns, 80 mil)
    arcFromTailDeg: 80, // the rear gun bears within 80° of the tail
    minUpDot: -0.35, // and not far below the tail plane
  },
  // the AA director station (ROUND-2 §3): the lead-error cones
  aaStation: { coneHeavyMil: 40, coneLightMil: 80, tracerS: 0.12, aimedWithinDeg: 8 },

  // --- capacities (ENGINEERING §5) -------------------------------------------------------------------------------
  spares: 64,
  projectileCap: 4096,
  effectsCap: 2048,
}

/** The era key of a side and a year: 'us-1942', 'jp-1944'. */
export const eraKey = (side, year) => `${side === 'jp' ? 'jp' : 'us'}-${Math.max(1941, Math.min(1944, year))}`
