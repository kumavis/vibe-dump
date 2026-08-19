// The deformation pipeline: record → skeleton → operators → pen → drawable glyph.
//
// Stage order is deliberate and fixed. Component surgery happens before region
// warping (so the warp measures the *repacked* glyph), shape work before the
// whole-glyph distortions, and crown shyness last of all — it needs to see the
// final positions to know what is actually crowding what.
import { buildSkeleton, recomputeBounds, recomputeLengths, EM } from './skeleton.js'
import { mulberry32, makeNoise2D, hashString } from '../geom/path.js'
import * as layout from './ops/layout.js'
import * as warp from './ops/warp.js'
import * as structure from './ops/structure.js'
import * as frame from './ops/frame.js'
import * as noiseOp from './ops/noise.js'
import * as shyness from './ops/shyness.js'
import * as fit from './ops/fit.js'
import * as nib from './nib.js'

export { EM }

export const STAGES = [
  { id: 'layout', label: 'Components', section: 'Components & radicals', mod: layout },
  { id: 'warp', label: 'Region warp', section: 'Region warp', mod: warp },
  { id: 'structure', label: 'Stroke shape', section: 'Stroke shape', mod: structure },
  { id: 'frame', label: 'Frame', section: 'Frame & distortion', mod: frame },
  { id: 'noise', label: 'Noise', section: 'Noise & hand', mod: noiseOp },
  { id: 'shyness', label: 'Crown shyness', section: 'Crown shyness', mod: shyness },
  { id: 'fit', label: 'Fit', section: 'Fit', mod: fit },
]

export const NIB = { id: 'nib', label: 'Pen', section: 'The pen', mod: nib }

// makeNoise2D allocates a 256×256 lattice, so it must never run per glyph.
const noiseCache = new Map()
function noiseFor(seed) {
  let n = noiseCache.get(seed)
  if (!n) {
    if (noiseCache.size > 8) noiseCache.clear()
    n = makeNoise2D(seed)
    noiseCache.set(seed, n)
  }
  return n
}

/**
 * Per-glyph render context. `quality` below 1 tells expensive operators (crown
 * shyness especially) to cut their iteration counts for thumbnail grids.
 */
export function makeCtx(record, P, { time = 0, quality = 1, corpus = null } = {}) {
  const baseSeed = (P.nzSeed ?? 1) | 0
  const glyphSeed = (baseSeed ^ hashString(record.char)) >>> 0
  return {
    rng: mulberry32(glyphSeed),
    noise: noiseFor(baseSeed & 1023),
    corpus,
    record,
    time,
    seed: baseSeed,
    glyphSeed,
    quality,
  }
}

/**
 * Run the whole pipeline for one character. Returns a Skeleton whose points and
 * half-widths are final and ready to outline.
 */
export function buildGlyph(record, P, opts = {}) {
  const skel = buildSkeleton(record, { density: P.stSampleDensity ?? opts.density ?? 1 })
  const ctx = makeCtx(record, P, opts)
  const skip = opts.skipStages || null
  for (const st of STAGES) {
    if (skip && skip.has(st.id)) continue
    st.mod.apply(skel, P, ctx)
  }
  recomputeLengths(skel)
  recomputeBounds(skel)
  nib.applyNib(skel, P, ctx)
  skel.ctx = ctx
  return skel
}

/** Everything the pipeline knows how to be parameterised by, in panel order. */
export function pipelineParams() {
  const out = []
  for (const st of STAGES) for (const p of st.mod.params || []) out.push({ ...p, section: st.section, stage: st.id })
  for (const p of NIB.mod.params || []) out.push({ ...p, section: NIB.section, stage: 'nib' })
  return out
}
