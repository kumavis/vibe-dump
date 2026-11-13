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
export { taotieParts, taotieContext, buildTaotie, renderTaotie } from './relief/motifs/taotie.js'
export { MOTIFS, registerMotif, getMotif, resolveMotifParams, motifDefaults } from './relief/motifs/index.js'
export { drawMotif, registers, inset, frieze, bossRow, borderLine } from './relief/compose.js'

export { buildSurface, quadSurface } from './geometry/surface.js'
export { lathe, latheSurface, profileCurve } from './geometry/lathe.js'
export { fangBody } from './geometry/fang.js'
export { flange } from './geometry/flange.js'
export { columnarLeg, loopHandle, ringFoot } from './geometry/parts.js'

export {
  PatinaMaterial,
  patina,
  setPatina,
  getPatina,
  setPatinaMode,
  PATINA_PARAMS,
  PATINA_PRESETS,
  PATINA_MODES,
} from './material/patina.js'
