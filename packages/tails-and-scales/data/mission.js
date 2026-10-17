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
