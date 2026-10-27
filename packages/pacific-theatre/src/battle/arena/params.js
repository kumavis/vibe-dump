// The arena's numbers (ROUND-3.md §1, §3) in one place. The marks, as in the
// record sim's params.js: *contract* = ROUND-3's number; *estimate* = the
// arena's own, set by the headless balance runs (tools/smoke-arena.mjs) and
// by looking at the box, never sourced; research/engine-3.md says why each
// is what it is. Nothing here touches the record's sim.

export const A = {
  // --- time --------------------------------------------------------------------------------------
  step: 1 / 60,
  maxSteps: 8,
  thinkS: 0.25, // a unit's AI decides four times a second, staggered by slot
  admiralS: 2, // contract: the admiral ticks every 2 s
  aaS: 0.1, // the AA hazard is drawn ten times a second

  // --- the arena (contract: 6 km across) -------------------------------------------------------------
  placeM: 2500, // each side's guide starts this far from the centre on its bearing: the enemy 5 km away (contract)
  coreSpacingM: { carrier: 520, capital: 650 }, // the core's ships in rows behind the guide
  edgeM: 450, // a ship this near the edge turns in; the guide's course bends at twice it
  airEdgeM: 150, // an aircraft beyond the edge by this turns back, and a fighter lets go of a fight beyond it by twice this (the smoke test fails one beyond 1 km)

  // --- aircraft (contract: point-to-fly, no stall, half to full of the top speed, auto-level, a floor) -----
  air: {
    band: [0.5, 1.0], // contract: the speed band, × the kit's top speed
    speedTauS: 3, // the speed follows the throttle with this lag
    gravityK: 0.55, // a climb bleeds speed and a dive adds it (× g sin γ)
    // turn rates by class (contract: fighters fast, bombers slow): 360° / the kit's turnS × boost, within the class's band
    turnBoost: 1.35,
    turnBand: { fighter: [20, 34], dive: [15, 25], torpedo: [13, 22], level: [10, 16], patrol: [8, 14], bomber: [7, 12] },
    pitchDegS: { fighter: 45, dive: 34, torpedo: 26, level: 18, patrol: 14, bomber: 14 },
    rollDegS: { fighter: 140, dive: 100, torpedo: 80, level: 55, patrol: 40, bomber: 40 },
    climbDeg: { fighter: 40, dive: 30, torpedo: 25, level: 18, patrol: 15, bomber: 15 },
    diveDeg: { fighter: 60, dive: 80, torpedo: 45, level: 30, patrol: 25, bomber: 25 },
    bankMaxDeg: 80,
    levelS: 0.6, // auto-level: the bank decays with this time constant when the stick is centred
    holdS: 1.6, // and the path angle toward level
    floorSeaM: 18, // contract "a floor over sea and land"
    floorLandM: 60,
    floorLookS: 2.5,
    hp: { fighter: 2, other: 1 }, // contract: aircraft 1 hit (fighters 2 bursts)
  },

  // --- ships (contract: three times the real turn rate and twice the acceleration) -------------------------
  ship: { turnK: 3, accelK: 2, rudderK: 3, nomotoK: 10 }, // (the yaw lag and the rudder quickened with the rate: T = 3L/V is 27 s for a carrier at 18 kn even at a third)

  // --- weapons (contract) -------------------------------------------------------------------------------------
  shellDispersionK: 0.3, // contract: × the historical dispersion
  hitBoxK: 1.5, // contract: hit boxes 1.5× the hull
  torpedoSpeedK: 1.5, // contract: torpedoes at 1.5× their speed
  torpedoRunM: 6000, // contract: a 6 km run
  torpedoArmM: 150, // estimate: armed after 150 m (the wide window)
  aaK: 3, // contract: AA as the hazard model × 3
  // the AI's ranging (estimate; research/engine-3.md §5: the lead is solved exactly, the range is walked in)
  // (the intervals 45 s and 50 s for the medium and heavy guns are the integrator's, from the balance runs: research/engine-3.md §8)
  aiGun: { startPct: 40, startMils: 80, improve: 0.2, floorPct: 22, floorMils: 35, resetTurnDeg: 20, resetShare: 1, turretShare: 0.87, secondaryM: 4500, minIntervalS: { light: 30, medium: 45, heavy: 50 }, lightM: 2500, goalK: 0.55 },
  chaseS: [10, 18], // a ship under fire (a fall within 250 m in the last 20 s) weaves ±chaseDeg: it chases the salvos
  chaseDeg: 30,
  // the AI's air-to-air bursts (estimate)
  burst: { rangeM: 380, coneDeg: 7, pHit: 0.55, breakS: [1.2, 2.6], rearRangeM: 450, rearP: 0.12, rearEveryS: 1.4 },
  // the player's rounds: each tracer projectile stands for a few rounds and carries this share of a hit (estimate)
  playerRound: { every: 0.06, hitShare: { mg: 0.34, cannon: 0.6 }, lifeS: 1.6, aircraftR: 1.5 },
  bombHitDamage: 2,

  // --- damage (contract) -------------------------------------------------------------------------------------
  hp: { cve: 10, dd: 6, de: 6, ca: 14, cl: 14, bb: 30, cv: 18, cvl: 14, default: 8 },
  sinkS: 20, // contract: sinking at zero over 20 s
  fireAt: 0.5, // contract: fire under half
  listAt: 0.25, // contract: listing under a quarter
  magazineP: 0.03, // estimate: a heavy shell's chance of a magazine
  listDeg: [7, 13],
  listedSpeedCap: 0.65,

  // --- the AI (contract numbers where ROUND-3 §3 gives them) ---------------------------------------------------
  strike: { approachM: 1500, pushOverM: 1200, torpedoRunM: 800, torpedoAltM: 40, approachAltM: 1500, releaseAltM: 380, rearmS: 40, launchEveryS: 3, diveCorrect: 0.8 },
  cap: { altM: 1500, radiusM: 1200, interceptM: 3000 },
  escortEngageM: 1500,
  ddAttackM: 4000, // contract: the destroyers go in when the enemy's main body is within 4 km
  ddAttackAfterS: 300, // contract: or when losing after the fifth minute
  ddFireM: [1500, 2600], // estimate: the range band a destroyer fires its spread in
  torpedoSpreadDeg: 4,
  torpedoReloadS: 90,
  evadeTorpedoM: 2000, // a ship that sees a torpedo track within this combs it
  zigzagS: [12, 22],
  zigzagDeg: 40,
  smokeS: 150, // a screen's life (drawn, drifting); it hides only while thick
  smokeThickS: 100,
  smokeDrawM: 150, // a smoke trail is drawn a line at a time, every this many metres (the hiding is by every segment)
  smokeR: 250,
  smokeFirstS: 90, // the weaker side's smoke from the start
  smokeWindowS: 60, // a side pressed makes smoke this long, and not again for as long after
  smokeLayers: 2, // escorts laying smoke at once, a side (the carriers make their own only while their main body is being hit)
  squallSeeOutM: 2000, // a ship inside a squall sees out this far (and is seen from no further than squall.hideM)
  rangeFor: (aggression) => 5600 - 3000 * aggression, // the range the admiral keeps to the enemy's main body (0.6: 3.8 km)
  pressFromS: 120, // an admiral's `press` (the integrator's, for the balance) raises its aggression from here to the end of the clock
  freeTorpedoS: 120, // a cruiser or destroyer outside an attack fires at a carrier or capital ship on its beam no oftener than this
  surviveRangeM: 5200, // a side that must keep its ships afloat keeps away (beyond the arena's width: it runs, and the edge turns it)
  waveBase: 3, // the first wave: at least three, or a sixth of the strike aircraft a side has
  waveShare: 1 / 6,
  turnedFireM: 2500, // a side that has turned away fires only at what comes within 2.5 km
  squall: { radiusM: [700, 1000], lastS: [150, 220], hideM: 1000 },
  // the night's lights (estimate; the project manager's decision 36: the arena draws the searchlights its phases name, and
  // the star shells of a scenario's `starShells`): a cruiser's beam on the nearest capital ship, one a side at a time
  night: { firstBeamS: 30, beamM: 5000, beamS: 40, beamGapS: 50, firstStarS: 8, starM: 5500, starS: 45, starEveryS: 30 }, // the box's squalls, brought into the arena (research/engine-3.md §6)
  capShare: 0.5, // of the fighters, the share kept on combat air patrol
  firstStrikeS: 12,
  maxAirborne: 30, // a side's aircraft in the air at once, when the scenario does not say (content-3's maxAirborne: 30)
  // a strafing run (content-3's `strafe` profile; the contract's damage table has no entry for guns on a ship, so a
  // strafed ship takes no damage: her AA at half for ten seconds and an escort carrier launching nothing for as long,
  // the project manager's decision 34; research/engine-3.md §4.3)
  strafe: { approachAltM: 600, openM: 1500, fireM: 900, breakM: 300, suppressS: 10, aaK: 0.5, everyS: 0.5 },

  // --- the player ---------------------------------------------------------------------------------------------------
  respawnS: 2, // contract
  snapshotsMax: 6, // contract
}
