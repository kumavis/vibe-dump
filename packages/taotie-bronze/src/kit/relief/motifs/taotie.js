// The taotie mask (饕餮纹 / 兽面纹), late Shang, Anyang — research/01 §2, §3.3, §7, §8.
//
// A taotie is two profile creatures meeting at the central axis (a flange or a
// mould seam) that together read as one frontal face. It is built here the way
// the mould carver built it: as a RIGHT half laid out from the axis, component
// by component, in the normalised half-mask space of shapes.halfMaskFrame, then
// mirrored (compose.drawMotif paints the left half, packs leiwen around it and
// mirrors the panel).
//
// Every component is its own function in ./taotie/parts.js, exported here as
// `taotieParts`, so an artifact can lay a specific vessel's mask out by hand:
//
//   import { taotieContext, taotieParts as T, renderTaotie } from '…/motifs/taotie.js'
//   const C = taotieContext(panel, rect, resolveMotifParams('taotie', overrides, 'fangyi-body'))
//   T.eye(C, { eye: 'square' }); T.horn(C, { horn: 'ram', size: 1.2 }); T.jaw(C); T.edge(C)
//   renderTaotie(panel, C)            // then panel.fillGround(…) + panel.mirrorX(rect) as compose does
//
// Proportions: anchors are fractions of the panel height (y) and of a face
// module s = min(H, hw / 0.66) (x), while band widths, eye and curl radii are
// multiples of s. So a tall gu-waist panel stretches the face's layout without
// fattening its bands, and a 4:1 frieze grows a longer body with more quills
// instead of a bigger face. Line work (lineWeight, echoInset) is in mm and
// does not change with panel size.

import { taotieContext, Sheet, HORN_TYPES } from './taotie/parts.js'
import * as parts from './taotie/parts.js'
import { renderTaotie } from './taotie/render.js'

export { taotieContext, renderTaotie, Sheet, HORN_TYPES }

/** Every component, callable on its own: part(C, opts). */
export const taotieParts = {
  nose: parts.nose,
  crest: parts.crest,
  nostril: parts.nostril,
  jaw: parts.jaw,
  fangs: parts.fangs,
  lowerJaw: parts.lowerJaw,
  eye: parts.eye,
  brow: parts.brow,
  horn: parts.horn,
  ear: parts.ear,
  body: parts.body,
  quills: parts.quills,
  leg: parts.leg,
  kuiHead: parts.kuiHead,
  edge: parts.edge,
  fragments: parts.fragments,
}

const E = (options, def, label) => ({ type: 'enum', options, default: def, label })
const R = (min, max, step, def, label, unit) => ({ type: 'range', min, max, step, default: def, label, ...(unit ? { unit } : {}) })

export const schema = {
  style: E(['relief', 'flush'], 'relief', 'Style (V relief / IV flush)'),
  carving: E(['dense', 'sparse', 'none'], 'dense', 'Plateau line work (V-a / V-b)'),
  // face
  nose: E(['ridge', 'plain', 'flange', 'stack', 'none'], 'ridge', 'Nose'),
  nostril: E(['scroll', 'bulb', 'none'], 'scroll', 'Nostrils'),
  crest: E(['lozenge', 'shield', 'cicada', 'hooks', 'none'], 'lozenge', 'Forehead crest'),
  eye: E(['chen', 'oval', 'round', 'square'], 'chen', 'Eye'),
  eyeSize: R(0.6, 1.6, 0.05, 1, 'Eye size'),
  eyeX: R(0.18, 0.36, 0.01, 0.27, 'Eye x (face units)'),
  eyeY: R(0.3, 0.62, 0.01, 0.5, 'Eye height'),
  pupil: E(['slit', 'dot', 'ring', 'none'], 'slit', 'Pupil'),
  brow: E(['none', 'band', 'hooked', 'kui', 'L'], 'none', 'Brow'),
  horn: E(HORN_TYPES.concat('none'), 'c', 'Horn'),
  hornSize: R(0.6, 1.5, 0.05, 1, 'Horn size'),
  hornTip: R(0, 1, 0.05, 0, 'Horn tip high relief'),
  ear: E(['leaf', 'c', 'none'], 'leaf', 'Ear (when no body)'),
  jaw: E(['hooked', 'double', 'split', 'fanged', 'none'], 'hooked', 'Jaw'),
  lipY: R(0.08, 0.36, 0.01, 0.15, 'Lip height'),
  mouthCorner: R(0.25, 0.7, 0.01, 0.38, 'Mouth corner x'),
  jawTurns: R(0.5, 1.6, 0.05, 0.85, 'Jaw curl turns'),
  // body
  body: E(['band', 'kui', 'dissolved', 'none'], 'band', 'Body'),
  tail: E(['up', 'down', 'forked', 'spiral'], 'up', 'Tail'),
  leg: { type: 'bool', default: true, label: 'Leg & claw' },
  claw: R(2, 3, 1, 3, 'Claw toes'),
  quills: R(0, 6, 1, 3, 'Dorsal quills'),
  edge: E(['none', 'scrolls', 'kui'], 'none', 'Outer edge filler'),
  // proportion & hand
  square: R(0, 1, 0.05, 0.55, 'Squareness (云纹 → 雷纹)'),
  bandWidth: R(0.6, 2, 0.05, 1, 'Band width'),
  spread: R(0.7, 1.4, 0.05, 1, 'Face spread'),
  taper: R(-0.6, 0.95, 0.05, 0, 'Panel taper'),
  invert: { type: 'bool', default: false, label: 'Inverted (lid)' },
  crown: R(0, 0.5, 0.05, 0, 'Plateau crown (V-b)'),
  irregularity: R(0, 2, 0.1, 1, 'Hand irregularity'),
  seed: R(0, 99, 1, 0, 'Seed'),
  lineWeight: R(0.3, 1.6, 0.05, 0.6, 'Line weight', 'mm'),
  echoInset: R(0.6, 3, 0.05, 1.4, 'Contour echo inset', 'mm'),
  relief: {
    type: 'group',
    label: 'Relief levels',
    fields: {
      motif: R(0.2, 6, 0.1, 1.5, 'Motif (L1)', 'mm'),
      boss: R(0.5, 10, 0.1, 3.4, 'Boss (L2)', 'mm'),
      groove: R(0.1, 1.2, 0.05, 0.45, 'Groove', 'mm'),
    },
  },
}

/**
 * Presets: the canonical Anyang configurations (research/01 §2.14, T1–T10)
 * and named matches for the masks on the four vessels we recreate.
 */
export const presets = {
  // ---- §2.14 canonical configurations
  'T1-classic': {},
  'T2-ram': { horn: 'ram', square: 0.65, quills: 2 },
  'T3-ox-heavy': {
    horn: 'buffalo', eye: 'round', pupil: 'ring', crest: 'shield', body: 'none', ear: 'none', jaw: 'fanged', nostril: 'bulb',
    carving: 'sparse', crown: 0.3, hornTip: 0.6, bandWidth: 1.25, square: 0.3, relief: { motif: 2.4, boss: 5 },
  },
  'T4-bottle-horn': { horn: 'bottle', body: 'none', ear: 'none', edge: 'kui' },
  'T5-kui-horn': { horn: 'kui', crest: 'hooks', body: 'none', ear: 'leaf' },
  'T6-t-horn': { horn: 't', body: 'none', ear: 'none', edge: 'kui', brow: 'band' },
  'T7-dissolved': { body: 'dissolved', horn: 'zigzag', nose: 'plain', brow: 'band', square: 0.75, quills: 2 },
  'T8-two-kui': { body: 'kui', horn: 't', nose: 'flange', crest: 'none', eye: 'chen', quills: 2, square: 0.7 },
  'T9-flat-band': { style: 'flush', horn: 'c', lineWeight: 0.7, bandWidth: 1.2, relief: { motif: 0.4, boss: 1.4, groove: 0.45 } },
  'T10-blade': { taper: 0.92, body: 'none', ear: 'none', horn: 'c', hornSize: 0.8, nose: 'plain', crest: 'none', spread: 0.85 },

  // ---- the four vessels
  // Houmuwu ding: border frieze of the walls — two long kui meeting at the
  // central flange, squared hooks, round boss eye with a sunk pupil
  'houmuwu-frieze': {
    body: 'kui', horn: 't', nose: 'flange', crest: 'none', eye: 'round', pupil: 'dot', eyeSize: 0.85, tail: 'up', quills: 2, leg: true, claw: 2,
    square: 0.85, bandWidth: 1.15, lineWeight: 1.0, echoInset: 2.0, relief: { motif: 2.6, boss: 5, groove: 0.75 },
  },
  // Houmuwu ding: the mask on the top of each leg, centred on its corner flange —
  // heavy rounded C-horn, oval boss eye with ring, big nostril scroll; V-b sculptural
  'houmuwu-leg': {
    body: 'none', horn: 'c', hornSize: 1.0, hornTip: 0.5, nose: 'flange', crest: 'none', eye: 'oval', pupil: 'ring', eyeSize: 1.15, ear: 'none', nostril: 'none',
    jaw: 'double', lipY: 0.24, mouthCorner: 0.42, jawTurns: 1.15,
    carving: 'sparse', crown: 0.35, square: 0.12, bandWidth: 1.55, lineWeight: 1.1, echoInset: 2.4, relief: { motif: 3.6, boss: 7.5, groove: 0.8 },
  },
  // Met fangyi 1974.268.2, body faces: a dissolved mask — big squared inward horn
  // across the top, rounded-square slit boss eye well out from the flange, a Γ
  // beside it, the squared jaw spiral below, a column of scroll islands outside
  'fangyi-body': {
    body: 'dissolved', horn: 'ram', hornSize: 1.15, nose: 'none', crest: 'none', nostril: 'none', eye: 'square', pupil: 'slit', eyeSize: 1.1,
    eyeX: 0.36, eyeY: 0.47, brow: 'L', jaw: 'hooked', lipY: 0.3, mouthCorner: 0.62, jawTurns: 1.3, ear: 'none', edge: 'scrolls',
    square: 0.92, bandWidth: 1.6, spread: 0.92, lineWeight: 0.55, echoInset: 1.1, relief: { motif: 1.6, boss: 3.2, groove: 0.4 },
  },
  // Met fangyi 1974.268.2, lid: the same mask upside down on the hip-roof
  // trapezoid (narrow at the ridge, which is the mask's mouth end)
  'fangyi-lid': {
    body: 'dissolved', horn: 'ram', hornSize: 1.1, nose: 'none', crest: 'none', nostril: 'none', eye: 'square', pupil: 'slit', eyeX: 0.36, eyeY: 0.5,
    brow: 'L', jaw: 'hooked', lipY: 0.27, mouthCorner: 0.55, jawTurns: 1.1, ear: 'none', edge: 'scrolls', invert: true, taper: -0.3,
    square: 0.92, bandWidth: 1.6, spread: 0.95, lineWeight: 0.55, echoInset: 1.1, relief: { motif: 1.5, boss: 3, groove: 0.4 },
  },
  // Met zun 43.25.1, belly: flat squared bands on leiwen (Style IV), a small round
  // boss eye set low, big inward-curled squared horns, body fragments outside
  'zun-belly': {
    style: 'flush', body: 'dissolved', horn: 'ram', hornSize: 1.15, nose: 'flange', crest: 'none', eye: 'round', pupil: 'none', eyeSize: 0.62,
    eyeX: 0.3, eyeY: 0.42, jaw: 'hooked', lipY: 0.2, mouthCorner: 0.45, nostril: 'none', brow: 'L', quills: 1, leg: false,
    square: 0.92, bandWidth: 1.3, lineWeight: 0.55, relief: { motif: 0.4, boss: 1.8, groove: 0.4 },
  },
  // Met zun 43.25.1, foot: tall squared horns rising beside the eyes and hooking
  // over to the axis, small round boss eyes, scroll column outside; flaring panel
  'zun-foot': {
    style: 'flush', body: 'none', horn: 'crook', nose: 'flange', crest: 'none', eye: 'round', pupil: 'none', eyeSize: 0.62, eyeX: 0.3, eyeY: 0.4,
    jaw: 'hooked', lipY: 0.17, nostril: 'none', ear: 'none', edge: 'scrolls', taper: 0.18, square: 0.92, bandWidth: 1.3, spread: 0.9,
    lineWeight: 0.5, relief: { motif: 0.4, boss: 1.6, groove: 0.35 },
  },
  // Met gu 1985.214.4, waist (腹): a tall narrow mask between flanges, round boss
  // eyes low, crook horns stretched up the panel
  'gu-waist': {
    body: 'none', horn: 'crook', nose: 'flange', crest: 'none', eye: 'round', pupil: 'dot', eyeSize: 0.8, eyeX: 0.3, eyeY: 0.36,
    jaw: 'hooked', lipY: 0.12, nostril: 'none', ear: 'none', square: 0.9, bandWidth: 1.05, carving: 'sparse', lineWeight: 0.45, echoInset: 0.9,
    relief: { motif: 0.8, boss: 2, groove: 0.3 },
  },
  // Met gu 1985.214.4, foot (圈足): trapezoid narrowing upward; a crook horn rising
  // beside the eye and hooking over to the axis, rounded-square boss eye with a
  // dot pupil, C-ear, squared jaw spiral; broad flat bands, low relief
  'gu-foot': {
    style: 'flush', body: 'none', horn: 'crook', nose: 'flange', crest: 'none', eye: 'square', pupil: 'dot', eyeSize: 0.85, eyeX: 0.33, eyeY: 0.47,
    jaw: 'hooked', lipY: 0.2, mouthCorner: 0.5, jawTurns: 1.2, nostril: 'none', ear: 'c', taper: 0.3, square: 0.95, bandWidth: 1.3,
    lineWeight: 0.45, relief: { motif: 0.35, boss: 1.6, groove: 0.3 },
  },
}

/** A plaque size (mm) that shows each preset at the aspect of the panel it was matched on. */
export const presetPlaques = {
  'houmuwu-frieze': { w: 320, h: 80 },
  'houmuwu-leg': { w: 170, h: 130 },
  'fangyi-body': { w: 150, h: 120 },
  'fangyi-lid': { w: 190, h: 100 },
  'zun-belly': { w: 200, h: 100 },
  'zun-foot': { w: 150, h: 100 },
  'gu-waist': { w: 60, h: 66 },
  'gu-foot': { w: 90, h: 64 },
  'T8-two-kui': { w: 280, h: 80 },
  'T10-blade': { w: 80, h: 160 },
}

/** Legacy / loose values → the current vocabulary (booleans from the first-pass schema). */
export function normalizeParams(p) {
  const q = { ...p }
  if (q.ear === true) q.ear = 'leaf'
  if (q.ear === false) q.ear = 'none'
  if (q.crest === true) q.crest = 'lozenge'
  if (q.crest === false) q.crest = 'none'
  if (q.quills === true) q.quills = 3
  if (q.quills === false) q.quills = 0
  q.relief = { motif: 1.5, boss: 3.4, groove: 0.45, ...(q.relief || {}) }
  for (const [k, s] of Object.entries(schema)) if (q[k] === undefined && s.type !== 'group') q[k] = s.default
  return q
}

/**
 * Lay out the whole mask from params into C.sheet (no drawing).
 * The order matters: later parts fit themselves around earlier ones' marks.
 */
export function buildTaotie(C) {
  const T = taotieParts
  const p = C.p
  if (p.body === 'kui') {
    if (p.nose !== 'none') T.nose(C, { nose: p.nose, from: 0.3, to: 0.72, width: 0.55 })
    T.kuiHead(C)
    T.horn(C, { rootX: 0.25 })
    if (!T.body(C)) T.ear(C)
  } else {
    T.crest(C)
    T.nose(C)
    T.nostril(C)
    T.jaw(C)
    T.eye(C)
    T.brow(C)
    T.horn(C)
    const hasBody = T.body(C)
    if (!hasBody) T.ear(C)
    if (hasBody && p.body === 'dissolved') T.fragments(C)
  }
  T.edge(C)
  return C
}

/**
 * Draw the LEFT half of a taotie into rect (panel mm). The caller mirrors
 * (compose.drawMotif does: draw → ground → mirrorX(rect)).
 */
export function draw(panel, rect, params) {
  const p = normalizeParams(params)
  const C = taotieContext(panel, rect, p)
  buildTaotie(C)
  renderTaotie(panel, C)
  return C
}

export default { name: 'taotie', label: 'Taotie mask', schema, presets, presetPlaques, draw, plaque: { w: 240, h: 120 } }
