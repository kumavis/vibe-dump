// The Dark Nebula: stealth saucers in thick space fog, and the Gloomtopus,
// the big octopus that lives in it. See ../README.md for how a content pack
// plugs in.
//
//   fog.js      the fog itself, the pools of light cut into it, and ink
//   level.js    the waves, the crystals, and what shows through the fog
//   lurker.js   the stealth saucer that cloaks, creeps and ambushes
//   octopus.js  the boss: its attacks and what it shows through the fog
//   octoart.js  the boss's art
//   draw.js     the rest of the pack's art

import { nebulaLevel } from './level.js'
import { lurker } from './lurker.js'
import { octopus } from './octopus.js'

export default {
  levels: { nebula: nebulaLevel },
  bosses: { octopus },
  enemies: { nebulaLurker: lurker },
}
