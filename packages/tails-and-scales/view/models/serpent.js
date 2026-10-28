// The Coil of Ssithra's figures in the 'new' style (V2, view/models/cache.js's
// KITS): smooth and glossy (view/models/gloss/: serpents.js's six units, the
// look prototype of proto/scales/, its runtime moved here), each built at one
// level of detail, DETAIL, and baked by bake.js into a few glossy classes. The
// classic figures are view/models/classic/serpent.js; these keep its parts
// (the coil, torso, head, hood, arms and gear), colours, silhouette and
// userData.anim (body, head, tongue, armL, armR; the engine's wheels,
// throwArm, rest and globe; the hierophant's gem) with the same `keep` marks,
// so view/units.js and view/effects/shots.js animate them unchanged.
//
// DETAIL (serpents.js's `detail`: 1 the close-up figure, 19-31k triangles;
// 0.5 the ~60 px one, 4.7-9k; 0.3 the ~28 px one, 2.7-6.3k, within 1.2x the
// classic figure's) is one level for every figure a page draws: a unit is
// built once (cache.js's template, cloned for each figure, the race picker's
// diorama included), and a figure seen at 28 px on the classic table is
// seen at 60-140 px zoomed in, so one template serves every size. 0.5: it
// keeps what a close look reads (the claws, the eyes' catchlights, the
// nostrils, the hood's banding; the belly's scutes an even wash, not
// geometry), where 0.3 loses the hood's banding and coarsens the coil, and
// at 28 px the shader's own level of detail (gloss.js: the figure's
// footprint on screen) has calmed the gloss, faded the markings and dropped
// the scales anyway. Measured against detail 1 (V2, every unit from the
// table's camera and from behind, 36 shots): the mean colour difference
// over the figure's pixels is 6.1 / 5.2 / 4.7 levels at ~140 / 60 / 28 px
// for 0.5 and 9.1 / 7.5 / 6.4 for 0.3, its near-white glints within 2 of
// detail 1's at 28 px; the classic army of 24 Ssithra is 137k triangles
// (0.3: 72k; 1: 617k; the classic figures: 64k), a unit's cold build a
// median 57 ms in Chromium (46-97; detail 1: 91, 71-164). DESIGN §1.1's
// (V2) note.
//
//   BUILDERS[unit]()   the unit's miniature (a fresh build: cache.js keeps it
//                      as the template and clones it)
//   DRAWS              none here: no builder draws Math.random
//   DETAIL             the level of detail every figure is built at
import { buildSerpent, KEYS } from './gloss/serpents.js'

export const DETAIL = 0.5

// (serpents.js's buildSerpent returns the figure's group with what the
// prototype's sheet measured; the figure keeps none of its build helpers)
function build(unit) {
  const fig = buildSerpent(unit, { detail: DETAIL }).group
  delete fig.userData.backAt
  delete fig.userData.spineAt
  return fig
}
export const BUILDERS = Object.freeze(Object.fromEntries(KEYS.map((unit) => [unit, () => build(unit)])))

// The builders that draw Math.random themselves, which view/models/cache.js
// makes no template of: none here.
export const DRAWS = new Set()
