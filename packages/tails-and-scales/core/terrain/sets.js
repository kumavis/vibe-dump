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
// board. New pieces only ever go into new sets, picked by setup.terrain (F7a
// adds `fortified`, with three fields of its own, each reaching a branch of
// scatter's that no other set does: `works`, the fort phase's and `scale`;
// F8b adds `open`, which shares F7a's `scale`, the area scaling, and reaches
// no branch of its own). RULES_ID (core/version.js) hashes this table.
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
  // (F7a, DESIGN §4.2.4) Fortifications to climb: each seat's own rampart at
  // its zone's front, mirrored pairs of ramparts, bastions, watchtowers and
  // timber platforms in no-man's land, and the keep round the centre
  // objective on half the boards; fewer features, spaced wider, round them.
  // Played on every mission, its counts scaled by the table's area.
  fortified: {
    // round the centre objective: the keep under 0.5, the ruined tower ring
    // under 0.8, else open ground
    centre: [['keep', 0.5], ['tower', 0.8]],
    // on a table larger than classic's (Field, Grand) the box of rock piles
    // stands where the tower ring would, as on `open`: the ring's doors are
    // about 1.25" wide, so no squad walks in and none controls the objective
    // inside it (terrain-check's connectivity rows failed on every Field and
    // Grand board it stood on). The same one draw picks it, so the keep
    // stands on the same boards; the Skirmish's boards are untouched.
    largeCentre: [['keep', 0.5], ['rockbox', 0.8]],
    // a rampart per seat on its zone's front edge (recipes.js works)
    works: 1,
    // the fort phase, before the features: forts[0] + a draw below forts[1]
    // mirrored pairs (area-scaled) in at most fortAttempts tries, each clear
    // of both zones, of its own mirror, of every objective by its radius +
    // fortObjectiveGap and of everything placed by both radii + fortGap
    forts: [1, 1],
    fortAttempts: 600,
    fortGap: 3.2,
    fortObjectiveGap: 1.5,
    // [fortification, footprint radius, weight] (each radius its recipe's
    // footprint: recipes.js FOOTPRINT)
    fortKinds: [
      ['rampart', 7.1, 3],
      ['bastion', 6.3, 2],
      ['watchtower', 4.8, 1.5],
      ['platform', 4.3, 1.5],
    ],
    // these turn their fronts toward the other side's zone (±0.3)
    facing: ['rampart', 'bastion'],
    kinds: [
      ['ruin', 3.2, 3],
      ['wall', 3.6, 1],
      ['forest', 3.2, 2],
      ['hedgerow', 3.4, 2],
      ['rocks', 2.0, 1.5],
      ['barricade', 2.0, 2],
    ],
    pairs: [4, 3],
    attempts: 1200,
    mirror: 'point',
    margin: 0.5,
    selfGap: 1.4,
    deployMargin: 1,
    bigNotInDeploy: 2.1,
    notInDeploy: ['forest'],
    objectiveGap: 2.6,
    gap: 3.2,
    // the pair counts and attempts scale with the table's area (40 × 28: 1)
    scale: 'area',
  },
  // (F8b, DESIGN §4.2.3) The larger tables' battlefield: classic's feature
  // table, the pair count and attempts scaled with the table's area
  // (`scale`: classic's density, so 24-35 pairs at Grand's 80×56 and 13-18
  // at Field's 60×40), spaced wider (objectiveGap 2.6, gap 3.2) so a round
  // hull of r 1.5 finds a lane from zone to zone and a squad of r 1.18
  // controls every objective (sim/terrain-check.mjs's connectivity rows:
  // 500 of 500 boards at each size, at the gap's starting value).
  // The centre rule is classic's without the ruined tower ring: its doors
  // are about 1.25" wide, so no squad (r 0.89-1.18) gets inside, and the
  // nearest an r 1.18 one stands is 4.6-4.8" from the objective, past the
  // 4.18" it needs to control it (on the 55% of classic boards with the
  // tower only a lone hero walks in). So the box of rock piles under 0.8,
  // as in classic, and open ground above.
  open: {
    centre: [['rockbox', 0.8]],
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
    mirror: 'point',
    margin: 0.5,
    selfGap: 1.4,
    deployMargin: 1,
    bigNotInDeploy: 2.1,
    notInDeploy: ['forest'],
    objectiveGap: 2.6,
    gap: 3.2,
    // the pair counts and attempts scale with the table's area (40 × 28: 1)
    scale: 'area',
  },
}))
for (const name of Object.keys(SETS)) checkSet(name, SETS[name])
