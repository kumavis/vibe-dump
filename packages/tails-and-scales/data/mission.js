// The missions a battle can be fought for (DESIGN §1.1): where the
// objectives stand, how many rounds a battle lasts when its setup names
// none, and how deep each seat's deployment zone runs from its edge.
//
// Consensus data, like the races: RULES_ID (core/version.js) hashes every
// mission whole, so a match started under a mission whose objectives have
// since moved is told apart instead of silently playing another battle.
// There is one mission today, `classic`, which every setup plays (a setup
// field picks one once there is a second). The rounds and the depth are the
// ruleset's own ROUNDS and BOARD.deploy (core/rules.js), which the constants
// hash too.
import { BOARD, ROUNDS } from '../core/rules.js'
import { deepFreeze } from '../core/util.js'

// A registry with no prototype, so a mission named like an Object.prototype
// member (from a URL, or a lobby a peer writes) finds nothing.
export const MISSIONS = deepFreeze(Object.assign(Object.create(null), {
  classic: {
    // the centre, and one pair in each half, the table's point mirror
    objectives: [
      { x: 0, z: 0 },
      { x: -9, z: 8 },
      { x: 9, z: -8 },
      { x: -9, z: -8 },
      { x: 9, z: 8 },
    ],
    rounds: ROUNDS,
    deploy: BOARD.deploy,
  },
}))

// The classic matchup: the Bushtails in seat 0, the Coil in seat 1. The
// page's default seat races (main.js names them in every title-screen mode's
// setup unless ?races= picks another pair; data-check pairs the legacy
// sides with them), beside the mission they are fought over. Presentation's
// default, not a rule: a setup names its seats' races itself, and
// createMatch (core/index.js fullSetup) refuses one that doesn't rather than
// fill them in from here; sim/'s corpus setups name theirs too. RULES_ID
// hashes the races' data and the missions, never this pairing.
export const CLASSIC = Object.freeze(['squirrel', 'serpent'])
