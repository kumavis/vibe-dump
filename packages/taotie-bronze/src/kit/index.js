// Taotie Kit — public surface. Artifacts receive this module as `kit` in
// build(kit, opts); the app imports from here too. Nothing in src/kit may
// import from src/artifacts or src/app.

export { Rng, rng, mulberry32, hashString, mixSeed } from './util/rng.js'
export { createCanvas, setCanvasFactory } from './util/canvas.js'

export { ReliefPanel, PROFILES } from './relief/panel.js'
export { ReliefMap, bakeRelief, blur } from './relief/bake.js'
export { edt, nearestFeature, signedDistance } from './relief/edt.js'
export { leiwenFill, leiwenFillMask, leiwenOptions, LEIWEN_DEFAULTS } from './relief/leiwen.js'
export { smoothPath, polyPath } from './relief/shapes.js'
export * as shapes from './relief/shapes.js'
export { roundStroke, roundPlate, roundPoly, carve, pillowBoss, pillowOutline, elementContour, paintElements } from './relief/rounded.js'
export { lozengeFill, lozengeOptions, LOZENGE_DEFAULTS } from './relief/lozenge.js'
export { taotieParts, taotieContext, buildTaotie, renderTaotie } from './relief/motifs/taotie.js'
export { MOTIFS, registerMotif, getMotif, resolveMotifParams, motifDefaults } from './relief/motifs/index.js'
export { drawMotif, registers, inset, frieze, bossRow, borderLine } from './relief/compose.js'
export { register, mirrorPair, bladeRow, frame, bowstrings, bossField } from './relief/compose.js'
export * as companions from './relief/motifs/_strokes.js'

export { buildSurface, quadSurface } from './geometry/surface.js'
export { lathe, latheSurface, profileCurve } from './geometry/lathe.js'
export { fangBody } from './geometry/fang.js'
export { flange } from './geometry/flange.js'
export { Profile, profile, profileFromTable } from './geometry/profile.js'
export { latheFlanges, revolve, parseSectors } from './geometry/lathe.js'
export { flangeOutline, edgePath } from './geometry/flange.js'
export { animalHead, mountOnLathe, headSDF, meshSDF, HEAD_DEFAULTS } from './geometry/heads.js'
export { columnarLeg, loopHandle, ringFoot } from './geometry/parts.js'
export { fangLayout, fangSection, SIDES as FANG_SIDES, CORNERS as FANG_CORNERS } from './geometry/fang.js'
export { columnLeg, bladeLeg, legRadius, legPanelSize } from './geometry/legs.js'
export { uprightHandle, handleLayout } from './geometry/handles.js'
export { hippedLid, hippedLidLayout, roofKnob } from './geometry/lid.js'

export {
  PatinaMaterial,
  patina,
  setPatina,
  getPatina,
  setPatinaMode,
  setPatinaVessel,
  PATINA_PARAMS,
  PATINA_PRESETS,
  PATINA_PRESET_GROUPS,
  PATINA_MODES,
} from './material/patina.js'
