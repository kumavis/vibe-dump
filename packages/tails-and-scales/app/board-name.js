// The board's name on screen (DESIGN §4.3, S4): every board has one,
// seeded as the battlefield's dressing is (view/dressing/place.js nameOf,
// from its theme's syllables: "Watchgate"), and the battle-setup panel,
// the battle log's header and the replay bar name the board by it.
//
// It is the view's alone: worked out from the setup's board seed, mission
// and terrain set and the table as the match makes it (themeOf reads the
// rules terrain on it), the very name the dressing's plan carries
// (plan.name), but without drawing anything, so a page that draws no
// dressing (?dress=0, the 'low' quality, ?lowfi) names the board alike.
// Nothing of the match reads it, and it is never kept or sent: not in a
// setup, a log entry, a lobby, a replay file or the browser's storage.
//
//   boardNameOf(setup, made)   the name of the board `setup` ({ board,
//       mission, terrain }; fullSetup's defaults for what it leaves out) is
//       fought on; `made`, a match of that setup as createMatch made it
//       (the title's backdrop: app/flow.js showTable), saves making one.
//       null for a setup the rules can't play (a peer's, say): nothing is
//       better shown than a wrong name.
import { createMatch, fullSetup } from '../core/index.js'
import { CLASSIC } from '../data/mission.js'
import { nameOf, themeOf, dressSeed } from '../view/dressing/place.js'

// (a name for each table asked of the page: a setup's name never changes,
// and making its table costs a few milliseconds)
const NAMES = new Map()

export function boardNameOf(setup, made = null) {
  let s
  try {
    s = made?.setup ?? fullSetup({ board: setup?.board, mission: setup?.mission, terrain: setup?.terrain, dice: 0, seats: CLASSIC.map((race) => ({ race, ctrl: 'human' })) })
  } catch {
    return null
  }
  const key = `${s.board >>> 0}|${s.mission}|${s.terrain}`
  if (NAMES.has(key)) return NAMES.get(key)
  // (the table as made: the theme reads the terrain before anything on it
  // broke; the races and armies at it draw nothing on the board)
  const G = made ?? createMatch(s, { out: null })
  const name = nameOf(dressSeed(s), themeOf({ set: s.terrain, chunks: G.terrain.chunks }))
  NAMES.set(key, name)
  return name
}
