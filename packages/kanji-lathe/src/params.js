// The parameter system: collect every module's declared controls into one flat
// schema, derive defaults, and move values in and out of URLs and presets.
//
// Modules own their own parameters (see ENGINE.md) — nothing here knows what any
// individual control does, which is what makes adding a new operator a one-file
// change.
import { pipelineParams } from './engine/pipeline.js'
import * as renderer from './render/canvas.js'
import { CURVE_N } from './engine/curve.js'
import { FONT_STYLES } from './engine/outline-style.js'

/** Controls that belong to the app rather than to any one operator. */
const APP_PARAMS = [
  {
    id: 'enDensity',
    label: 'Sample density',
    group: 'Engine',
    section: 'Engine',
    stage: 'engine',
    type: 'range',
    min: 0.4,
    max: 2.5,
    step: 0.05,
    default: 1,
    hint: 'How finely each stroke is sampled before deformation. Higher gives smoother warps and slower renders.',
  },
  {
    id: 'rdFontStyle',
    label: 'Font outline',
    group: 'Export',
    section: 'Export',
    stage: 'export',
    type: 'select',
    default: 'auto',
    options: FONT_STYLES,
    hint: 'What the exported SVG and TrueType carry. A font can only hold filled contours, so hollow and contour rings are built by outlining each stroke a second time at a narrower width and winding it backwards — the fill rule then punches the hole. Colour and glow modes have no equivalent and flatten to solid.',
  },
]

export const SPECS = [
  ...APP_PARAMS,
  ...pipelineParams(),
  ...(renderer.params || []).map((p) => ({ ...p, section: 'Render', stage: 'render' })),
]

export const BY_ID = new Map(SPECS.map((s) => [s.id, s]))

export const DEFAULTS = Object.freeze(
  Object.fromEntries(SPECS.map((s) => [s.id, s.type === 'curve' ? [...s.default] : s.default])),
)

/** Sections in panel order, each with its groups in declaration order. */
export const SECTIONS = (() => {
  const sections = []
  const byName = new Map()
  for (const spec of SPECS) {
    const name = spec.section || 'Other'
    let sec = byName.get(name)
    if (!sec) {
      sec = { name, groups: [], byGroup: new Map() }
      byName.set(name, sec)
      sections.push(sec)
    }
    const gName = spec.group || name
    let grp = sec.byGroup.get(gName)
    if (!grp) {
      grp = { name: gName, params: [] }
      sec.byGroup.set(gName, grp)
      sec.groups.push(grp)
    }
    grp.params.push(spec)
  }
  return sections
})()

export function freshParams() {
  const P = {}
  for (const s of SPECS) P[s.id] = s.type === 'curve' ? [...s.default] : s.default
  return P
}

export function isDefault(P, id) {
  const spec = BY_ID.get(id)
  if (!spec) return true
  const v = P[id]
  if (spec.type === 'curve') return Array.isArray(v) && v.every((x, i) => Math.abs(x - spec.default[i]) < 1e-6)
  return v === spec.default
}

export function changedCount(P) {
  let n = 0
  for (const s of SPECS) if (!isDefault(P, s.id)) n++
  return n
}

// ── URL / preset serialisation ───────────────────────────────────────────────
// Only non-default values travel, so a shared link stays short and keeps working
// when new parameters are added later.

const encVal = (spec, v) => {
  if (spec.type === 'curve') return v.map((x) => Math.round(x * 100)).join('.')
  if (spec.type === 'toggle') return v ? '1' : '0'
  if (spec.type === 'select' || spec.type === 'color') return String(v)
  return String(Math.round(Number(v) * 10000) / 10000)
}

const decVal = (spec, s) => {
  if (spec.type === 'curve') {
    const parts = s.split('.').map((x) => Number(x) / 100)
    return parts.length === CURVE_N && parts.every(Number.isFinite) ? parts : [...spec.default]
  }
  if (spec.type === 'toggle') return s === '1'
  if (spec.type === 'select') return spec.options?.some((o) => String(o.value) === s) ? s : spec.default
  if (spec.type === 'color') return /^#[0-9a-fA-F]{3,8}$/.test(s) ? s : spec.default
  const n = Number(s)
  return Number.isFinite(n) ? clampSpec(spec, n) : spec.default
}

function clampSpec(spec, n) {
  if (spec.min !== undefined) n = Math.max(spec.min, n)
  if (spec.max !== undefined) n = Math.min(spec.max, n)
  return n
}

export function serialize(P) {
  const parts = []
  for (const spec of SPECS) {
    if (isDefault(P, spec.id)) continue
    parts.push(spec.id + '~' + encVal(spec, P[spec.id]))
  }
  return parts.join('_')
}

/**
 * A key over everything that changes the GEOMETRY. Render-only parameters are
 * excluded so the write animation can run at 60fps without rebuilding glyphs.
 */
export function geometryKey(P) {
  const parts = []
  for (const spec of SPECS) {
    if (spec.stage === 'render') continue
    if (isDefault(P, spec.id)) continue
    parts.push(spec.id + '~' + encVal(spec, P[spec.id]))
  }
  return parts.join('_')
}

export function deserialize(str, base = freshParams()) {
  const P = { ...base }
  if (!str) return P
  for (const part of str.split('_')) {
    const i = part.indexOf('~')
    if (i < 1) continue
    const spec = BY_ID.get(part.slice(0, i))
    if (!spec) continue
    P[spec.id] = decVal(spec, part.slice(i + 1))
  }
  return P
}

/** Sanitise anything that arrives from a preset file or an old link. */
export function normalize(raw) {
  const P = freshParams()
  if (!raw || typeof raw !== 'object') return P
  for (const spec of SPECS) {
    const v = raw[spec.id]
    if (v === undefined || v === null) continue
    if (spec.type === 'curve') {
      if (Array.isArray(v) && v.length === CURVE_N && v.every((x) => Number.isFinite(x))) P[spec.id] = v.map((x) => Math.max(0, Math.min(1, x)))
    } else if (spec.type === 'toggle') P[spec.id] = !!v
    else if (spec.type === 'select') { if (spec.options?.some((o) => String(o.value) === String(v))) P[spec.id] = String(v) }
    else if (spec.type === 'color') { if (typeof v === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(v)) P[spec.id] = v }
    else if (Number.isFinite(Number(v))) P[spec.id] = clampSpec(spec, Number(v))
  }
  return P
}

// ── Exploration: randomise, mutate, cross, interpolate ────────────────────────

/** Parameters that would wreck a design if randomised — colours, modes, seeds. */
const NEVER_RANDOM = new Set(['rdInk', 'rdPaper', 'rdAccent', 'rdShowGrid', 'rdShowRef', 'rdShowOrder', 'rdWriteAnim', 'enDensity', 'ftAdvance'])

function randomValue(spec, rnd, amount, from) {
  if (spec.type === 'toggle') return rnd() < 0.5 * amount ? !from : from
  if (spec.type === 'select') return rnd() < amount ? spec.options[Math.floor(rnd() * spec.options.length)].value : from
  if (spec.type === 'curve') return spec.default.map((d, i) => Math.max(0, Math.min(1, (from?.[i] ?? d) + (rnd() * 2 - 1) * 0.5 * amount)))
  if (spec.type === 'seed') return Math.floor(rnd() * 100000)
  if (spec.type === 'color') return from
  const span = (spec.max - spec.min) * amount
  // bias toward the default so a light randomise stays usable
  const centre = from ?? spec.default
  return clampSpec(spec, centre + (rnd() * 2 - 1) * span * 0.5)
}

/** A fresh design: every parameter re-rolled around its default. */
export function randomize(P, amount, rnd, { keepRender = true } = {}) {
  const out = { ...P }
  for (const spec of SPECS) {
    if (NEVER_RANDOM.has(spec.id)) continue
    if (keepRender && spec.stage === 'render' && spec.id !== 'rdMode') continue
    out[spec.id] = randomValue(spec, rnd, amount, spec.type === 'curve' ? spec.default : spec.default)
  }
  return out
}

/** A nudge away from an existing design — the engine of the evolve panel. */
export function mutate(P, amount, rnd, { keepRender = true } = {}) {
  const out = { ...P }
  for (const spec of SPECS) {
    if (NEVER_RANDOM.has(spec.id)) continue
    if (keepRender && spec.stage === 'render') continue
    // only touch a subset each time, so mutations stay legible as changes
    if (rnd() > 0.45) continue
    out[spec.id] = randomValue(spec, rnd, amount, P[spec.id])
  }
  return out
}

/** Uniform crossover of two designs. */
export function cross(A, B, rnd) {
  const out = {}
  for (const spec of SPECS) out[spec.id] = rnd() < 0.5 ? A[spec.id] : B[spec.id]
  return out
}

/** Interpolate two designs — the basis of the preset morph slider. */
export function lerpParams(A, B, t) {
  const out = {}
  for (const spec of SPECS) {
    const a = A[spec.id]
    const b = B[spec.id]
    if (spec.type === 'range') out[spec.id] = clampSpec(spec, a + (b - a) * t)
    else if (spec.type === 'curve') out[spec.id] = a.map((x, i) => x + (b[i] - x) * t)
    else out[spec.id] = t < 0.5 ? a : b
  }
  return out
}
