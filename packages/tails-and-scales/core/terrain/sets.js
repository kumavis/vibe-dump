// Terrain sets: which features a battlefield is scattered from, and how.
//
// A set is data: the centre rule (one draw picks what stands round the
// centre objective: the first entry whose threshold the draw is under, or
// nothing), the feature table ([feature, footprint radius, weight]), how
// many mirrored pairs to place (pairs[0] + a draw below pairs[1]) in at most
// `attempts` tries, and the spacing rules every placement must pass. The
// features themselves are recipes (core/terrain/recipes.js): code that draws
// from the layout stream.
//
// `classic` is the battlefield every game so far has been played on, and it
// is frozen: its table is read in order, one weighted draw per attempt, so
// adding a feature to it (or reordering it) would change every classic
// board. New pieces only ever go into new sets, picked by setup.terrain (F7
// adds `fortified`). RULES_ID (core/version.js) hashes this table.
//
// Every set is checked as this module loads (recipes.js checkSet): each
// feature and centre piece it names exists, the numbers are numbers, the
// centre thresholds rise. A slip in a new set then fails at once, on every
// board, rather than only on the boards whose draws happen to reach it.
import { deepFreeze } from '../util.js'
import { checkSet } from './recipes.js'

export const SETS = deepFreeze(Object.assign(Object.create(null), {
  classic: {
    // round the centre objective: a ruined tower ring under 0.55, a box of
    // rock piles under 0.8, else open ground
    centre: [['tower', 0.55], ['rockbox', 0.8]],
    kinds: [
      ['ruin', 3.2, 4],
      ['wall', 3.6, 2],
      ['forest', 3.2, 3],
      ['hedgerow', 3.4, 2],
      ['rocks', 2.0, 2],
      ['barricade', 2.0, 2],
      ['mushrooms', 2.0, 1.5],
      ['obelisk', 1.6, 1],
    ],
    pairs: [6, 3],
    attempts: 1200,
    // every feature is placed twice, the copy turned half round the centre
    mirror: 'point',
    // how far a footprint stays inside the table edge
    margin: 0.5,
    // a feature and its own mirror image mustn't overlap: |p| ≥ r + selfGap
    selfGap: 1.4,
    // within deployMargin of a deployment zone (or in it) only small
    // features, and none of notInDeploy, may stand
    deployMargin: 1,
    bigNotInDeploy: 2.1,
    notInDeploy: ['forest'],
    // clear of every objective by r + objectiveGap, and of every feature
    // placed so far (and its mirror) by both radii plus gap
    objectiveGap: 2.2,
    gap: 2.1,
  },
}))
for (const name of Object.keys(SETS)) checkSet(name, SETS[name])
