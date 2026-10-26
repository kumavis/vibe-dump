// Total Mayhem: so many saucers it's crazy, then the Hive Queen. See
// ../README.md for how a content pack plugs in.
//
//   level.js    the timeline, the rain that keeps the sky full, the HUD
//   bugs.js     the three kinds of bug, the shapes they fly in, the tally
//   queen.js    the boss
//   sprites.js  the bugs' art, baked once and stamped

import { swarmLevel } from './level.js'
import { swarmlet, swarmspitter, swarmbeetle } from './bugs.js'
import { hivequeen } from './queen.js'

export default {
  levels: { swarm: swarmLevel },
  bosses: { hivequeen },
  enemies: { swarmlet, swarmspitter, swarmbeetle },
}
