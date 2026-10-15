// The Dark Nebula: saucers in thick space fog, and the Phantom that haunts
// it. See ../README.md for how a content pack plugs in.
//
//   fog.js      the fog itself, and the pools of light cut into it
//   level.js    the waves, the fireflies, and what shows through the fog
//   lurker.js   the stealth saucer that only lights up to shoot
//   phantom.js  the boss and its echoes
//   draw.js     the pack's art

import { nebulaLevel } from './level.js'
import { lurker } from './lurker.js'
import { phantom, phantomEcho } from './phantom.js'

export default {
  levels: { nebula: nebulaLevel },
  bosses: { phantom, octopus: phantom }, // octopus: stand-in until the octopus boss lands
  enemies: { nebulaLurker: lurker, phantomEcho },
}
