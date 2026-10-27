// Hazards (F19, DESIGN §4.2.3): scenery that does something when it breaks.
//
// Consensus data, like the races and the missions: RULES_ID
// (core/version.js) hashes it, less its presentation (`name`, `fx`), so a
// match started under a keg of other strength is told apart instead of
// silently playing another battle.
//
// (F19a) The powder keg: a barrel of black powder (core/terrain/recipes.js's
// `keg`, the `keg` set's centre piece) with `hp` hit points, which goes off
// at zero, however it got there (a template's blast, acid, a wrecker's
// walk: core/actions/shoot.js kegsGoOff). Its going off is a blast at its
// place with this weapon's profile, landed as a template lands
// (blastLands: whoever is under it, friend and foe, and the scenery round
// it, by `scenery` as a template chews it). Tuned so a keg kills about
// half a squad standing on it (sim/data-check.mjs prints what it does
// to each unit, by rules.js's expected: four Nutkin of six, two or three
// of most squads, a third of an Oak Guard's) and chews the walls round it;
// and two hit points, so the acorns' template (1 to scenery) only cracks
// it, the Thornburst's (2, 1) sets it off from its core alone, and the
// pinecone's (3 in its core, 2 at its rim), the acid globe's (4, 2) and
// another keg's (4, 2) anywhere under them (core/terrain/terrain.js
// blast's damage model), as a wrecker's smash (99) does.
// `name` is the battle log's ("Powder keg hits Nutkin: …"), `fx` the
// view's explosion (view/effects/shots.js); the rules read neither.
import { deepFreeze } from '../core/util.js'

export const HAZARDS = deepFreeze(Object.assign(Object.create(null), {
  keg: { name: 'Powder keg', hp: 2, S: 5, AP: 1, D: 2, blast: 3, scenery: 4, fx: 'keg' },
}))

// A hazard the rules can play, or an Error naming what is wrong with it,
// checked as the module loads, as the missions and terrain sets are: its
// hit points a whole number above 0, its profile a template's (the numbers
// blastLands reads: S, D and the scenery damage whole numbers above 0, AP
// a whole number, 0 or more, a blast radius a number above 0), and no
// field but these and its name and look.
const FIELDS = Object.freeze(['name', 'hp', 'S', 'AP', 'D', 'blast', 'scenery', 'fx'])
export function checkHazard(name, h) {
  const bad = (why) => {
    throw new Error(`hazard "${name}": ${why}`)
  }
  if (!h || typeof h !== 'object') bad('is not a record')
  for (const k of Object.keys(h)) if (!FIELDS.includes(k)) bad(`takes no field "${k}"`)
  if (!Number.isInteger(h.hp) || h.hp < 1) bad(`hp ${h.hp} must be a whole number above 0`)
  for (const k of ['S', 'D', 'scenery']) if (!(Number.isInteger(h[k]) && h[k] > 0)) bad(`${k} ${h[k]} must be a whole number above 0`)
  if (!(Number.isInteger(h.AP) && h.AP >= 0)) bad(`AP ${h.AP} must be a whole number, 0 or more`)
  if (!(Number.isFinite(h.blast) && h.blast > 0)) bad(`blast ${h.blast} must be a number above 0`)
}
for (const name of Object.keys(HAZARDS)) checkHazard(name, HAZARDS[name])
