// Component-level surgery — the first deformation stage. Everything here moves
// whole KanjiVG components by transforming their stroke ranges, so a component
// keeps its internal shape and only its box changes: repacking a kanji rather
// than scaling it.
//
// Three levels of the component tree exist, and every control below commits to
// exactly one of them:
//   top-level — the children of the root group, plus any strokes the root draws
//               itself: the two or three boxes a reader parses first
//               (left/right, top/bottom, enclosure/contents). Packing controls
//               live here — cell fit, explode, other-scale.
//   tree-wide — every group, walked depth-first so a parent's transform is
//               already baked into its children's live bounds. Transforms
//               therefore compound down the chain, which is the whole point of
//               the depth and position scales.
//   leaf      — the innermost group of each stroke (stroke.group). Unlike the
//               set of childless groups this is a true partition of the glyph,
//               so scatter controls (jitter, split-order) leave no stroke
//               behind when a component breaks away from its parent.
//
// Group bounds are read live off the points rather than from group.bbox,
// because stages compound and a cached box goes stale the moment an ancestor
// moves. recomputeBounds() refreshes group.bbox for downstream stages.
import { clamp, lerp, mulberry32 } from '../../geom/path.js'
import { affineStrokes, xformAbout, recomputeBounds } from '../skeleton.js'

const DEG = Math.PI / 180

// The canonical grid cell each kvg position code claims, in em fractions.
// Enclosure codes (tare/kamae/nyo, and their `A`/`K`/`N` contents) and
// unpositioned components own the whole box — that is what enclosing means.
const CELLS = {
  l: [0, 0, 0.5, 1],
  r: [0.5, 0, 1, 1],
  t: [0, 0, 1, 0.5],
  b: [0, 0.5, 1, 1],
  m: [0.25, 0.25, 0.75, 0.75],
}
const FULL_CELL = [0, 0, 1, 1]

// Lowercase = the wrapping element itself; uppercase = what it wraps.
const ENCLOSERS = { a: 1, k: 1, n: 1 }

export const params = [
  {
    id: 'lyRadicalScale',
    label: 'Radical size',
    group: 'Radical',
    type: 'range',
    min: 0.4,
    max: 2,
    step: 0.01,
    default: 1,
    hint: 'Scale the radical component about its own centre, leaving the rest of the glyph put.',
  },
  {
    id: 'lyRadicalWeight',
    label: 'Radical weight',
    group: 'Radical',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Ink-weight hint for the nib: positive fattens the radical and thins everything else.',
  },
  {
    id: 'lyRadicalShiftX',
    label: 'Radical shift X',
    group: 'Radical',
    type: 'range',
    min: -0.3,
    max: 0.3,
    step: 0.005,
    default: 0,
    unit: 'em',
    bipolar: true,
    hint: 'Slide the radical horizontally.',
  },
  {
    id: 'lyRadicalShiftY',
    label: 'Radical shift Y',
    group: 'Radical',
    type: 'range',
    min: -0.3,
    max: 0.3,
    step: 0.005,
    default: 0,
    unit: 'em',
    bipolar: true,
    hint: 'Slide the radical vertically.',
  },
  {
    id: 'lyRadicalRotate',
    label: 'Radical rotate',
    group: 'Radical',
    type: 'range',
    min: -30,
    max: 30,
    step: 0.5,
    default: 0,
    unit: '°',
    bipolar: true,
    hint: 'Spin the radical about its own centre.',
  },
  {
    id: 'lyOtherScale',
    label: 'Non-radical size',
    group: 'Components',
    type: 'range',
    min: 0.4,
    max: 2,
    step: 0.01,
    default: 1,
    hint: 'Scale every top-level component that is not the radical — the counterweight to radical size.',
  },
  {
    id: 'lyDepthScale',
    label: 'Depth scale',
    group: 'Components',
    type: 'range',
    min: -0.5,
    max: 0.5,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Compounds per level of nesting: deeper components shrink (negative) or swell (positive).',
  },
  {
    id: 'lyExplode',
    label: 'Explode',
    group: 'Components',
    type: 'range',
    min: -0.4,
    max: 0.6,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Push top-level components away from the glyph centre, or collapse them into it.',
  },
  {
    id: 'lyEnclosureBreath',
    label: 'Enclosure breath',
    group: 'Components',
    type: 'range',
    min: -0.3,
    max: 0.4,
    step: 0.01,
    default: 0,
    bipolar: true,
    hint: 'Tare / kamae / nyo wrappers open away from their contents, or clamp down on them.',
  },
  {
    id: 'lySplitOrder',
    label: 'Split by order',
    group: 'Components',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'Shear the glyph in time: each component slides along the writing direction by its rank in stroke order.',
  },
  {
    id: 'lyJitterAmt',
    label: 'Jitter shift',
    group: 'Components',
    type: 'range',
    min: 0,
    max: 0.3,
    step: 0.005,
    default: 0,
    unit: 'em',
    hint: 'Seeded per-component displacement — the same glyph always breaks the same way.',
  },
  {
    id: 'lyJitterRot',
    label: 'Jitter rotate',
    group: 'Components',
    type: 'range',
    min: 0,
    max: 25,
    step: 0.5,
    default: 0,
    unit: '°',
    hint: 'Seeded per-component rotation, on the same seed as the jitter shift.',
  },
  {
    id: 'lyCellFit',
    label: 'Cell fit',
    group: 'Cell grid',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'Force each top-level component into the grid cell its kvg position implies. Any kanji reads as a rigid modular system.',
  },
  {
    id: 'lyCellGutter',
    label: 'Cell gutter',
    group: 'Cell grid',
    type: 'range',
    min: 0,
    max: 0.2,
    step: 0.005,
    default: 0,
    unit: 'em',
    when: (P) => P.lyCellFit > 0,
    hint: 'Inset applied to every cell before fitting.',
  },
  {
    id: 'lyCellAspect',
    label: 'Cell stretch',
    group: 'Cell grid',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    when: (P) => P.lyCellFit > 0,
    hint: '0 keeps each component’s proportions inside its cell, 1 stretches it to fill.',
  },
  {
    id: 'lyPosScaleL',
    label: 'Left components',
    group: 'Cell grid',
    type: 'range',
    min: 0.5,
    max: 1.6,
    step: 0.01,
    default: 1,
    hint: 'Scale every component KanjiVG marks as left-hand, at any depth.',
  },
  {
    id: 'lyPosScaleR',
    label: 'Right components',
    group: 'Cell grid',
    type: 'range',
    min: 0.5,
    max: 1.6,
    step: 0.01,
    default: 1,
    hint: 'Scale every component KanjiVG marks as right-hand, at any depth.',
  },
  {
    id: 'lyPosScaleT',
    label: 'Top components',
    group: 'Cell grid',
    type: 'range',
    min: 0.5,
    max: 1.6,
    step: 0.01,
    default: 1,
    hint: 'Scale every component KanjiVG marks as top, at any depth.',
  },
  {
    id: 'lyPosScaleB',
    label: 'Bottom components',
    group: 'Cell grid',
    type: 'range',
    min: 0.5,
    max: 1.6,
    step: 0.01,
    default: 1,
    hint: 'Scale every component KanjiVG marks as bottom, at any depth.',
  },
]

/** Read one parameter defensively: a missing or NaN value falls back to default. */
const rd = (v, d, lo, hi) => clamp(Number.isFinite(v) ? v : d, lo, hi)

/** Live bounds over a flat list of [from,to) stroke ranges, or null if empty. */
function rangeBox(skel, ranges) {
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (let r = 0; r < ranges.length; r += 2) {
    for (let k = ranges[r]; k < ranges[r + 1]; k++) {
      const s = skel.strokes[k]
      if (!s || !s.alive) continue
      const p = s.pts
      for (let i = 0; i < p.length; i += 2) {
        const x = p[i]
        const y = p[i + 1]
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
  }
  if (!(x0 <= x1) || !(y0 <= y1)) return null
  return { x0, y0, x1, y1 }
}

/** Scale/rotate a set of stroke ranges about `box`'s centre, then translate. */
function xformBox(skel, ranges, box, sx, sy, rot, tx, ty) {
  const cx = (box.x0 + box.x1) / 2
  const cy = (box.y0 + box.y1) / 2
  const m = xformAbout(cx, cy, sx, sy, rot)
  m[4] += tx
  m[5] += ty
  for (let r = 0; r < ranges.length; r += 2) affineStrokes(skel, ranges[r], ranges[r + 1], m)
}

/**
 * Top-level components: the root's children, merged by position code, plus the
 * strokes the root owns directly. KanjiVG splits some wrappers across two
 * stroke ranges (the 囗 of 国 is written first and last), and those halves have
 * to travel as one box or the enclosure tears. A root with no children is
 * itself the glyph's single component. The result is a true partition of the
 * root's stroke range — no stroke is ever left behind.
 */
function topComponents(skel) {
  const gs = skel.groups
  const root = gs[0]
  if (!root) return []
  const ids = root.children && root.children.length ? root.children : [0]
  const n = skel.strokes.length
  const covered = new Uint8Array(n)
  const byCode = new Map()
  const out = []
  for (const id of ids) {
    const g = gs[id]
    if (!g || g.to <= g.from) continue
    for (let k = Math.max(0, g.from); k < Math.min(n, g.to); k++) covered[k] = 1
    const code = g.positionCode || ''
    const merged = code ? byCode.get(code) : null
    if (merged) {
      merged.ranges.push(g.from, g.to)
      continue
    }
    const c = { code, ranges: [g.from, g.to] }
    if (code) byCode.set(code, c)
    out.push(c)
  }
  // Strokes the root draws itself sit in no child group at all — the 亠二 above
  // the 口 of 言, the top six strokes of 馬, two of the three strokes of 与.
  // Left out of the partition they would stand still while every real component
  // moved, tearing the glyph; each contiguous run of them is therefore its own
  // unpositioned component.
  const lo = Math.max(0, root.from)
  const hi = Math.min(n, root.to)
  for (let k = lo; k < hi; k++) {
    if (covered[k]) continue
    let e = k + 1
    while (e < hi && !covered[e]) e++
    out.push({ code: '', ranges: [k, e] })
    k = e
  }
  return out
}

/**
 * Leaf components: strokes bucketed by their innermost group, in stroke order.
 * Contiguous runs are collapsed so each component is a handful of ranges.
 */
function leafComponents(skel) {
  const map = new Map()
  const out = []
  const st = skel.strokes
  for (let i = 0; i < st.length; i++) {
    // an ungrouped stroke stands alone rather than joining an arbitrary bucket
    const key = st[i].group >= 0 ? st[i].group : -1 - i
    let c = map.get(key)
    if (!c) {
      c = { code: '', ranges: [] }
      map.set(key, c)
      out.push(c)
    }
    const n = c.ranges.length
    if (n && c.ranges[n - 1] === i) c.ranges[n - 1] = i + 1
    else c.ranges.push(i, i + 1)
  }
  return out
}

/**
 * The stroke ranges of the radical. KanjiVG can tag several groups as radical
 * (a nested one, or both halves of a split wrapper); we take the first in
 * depth-first order as the primary and pull in only its identical twins.
 */
function radicalRanges(skel) {
  const gs = skel.groups
  let primary = null
  for (const g of gs) {
    if (g.isRadical) {
      primary = g
      break
    }
  }
  if (!primary) return null
  const ranges = []
  for (const g of gs) {
    if (!g.isRadical) continue
    if (g === primary || (g.element && g.element === primary.element && g.depth === primary.depth)) {
      if (g.to > g.from) ranges.push(g.from, g.to)
    }
  }
  return ranges.length ? ranges : null
}

/** True if any stroke of `ranges` is marked in `mask`. */
function touchesMask(ranges, mask) {
  for (let r = 0; r < ranges.length; r += 2) {
    for (let k = ranges[r]; k < ranges[r + 1]; k++) if (mask[k]) return true
  }
  return false
}

/**
 * Ink-weight hint for the nib stage. Written unconditionally so a sweep of the
 * slider never leaves a stale multiplier behind; 1 everywhere is the identity.
 */
function applyWeight(skel, radical, amt) {
  const st = skel.strokes
  if (amt === 0 || !radical) {
    for (let i = 0; i < st.length; i++) st[i].wMul = 1
    return
  }
  const hi = Math.max(0.05, 1 + amt)
  const lo = Math.max(0.05, 1 - 0.5 * amt)
  for (let i = 0; i < st.length; i++) st[i].wMul = lo
  for (let r = 0; r < radical.length; r += 2) {
    for (let k = radical[r]; k < radical[r + 1]; k++) if (st[k]) st[k].wMul = hi
  }
}

/** Lerp each top-level component from its natural box toward its grid cell. */
function cellFit(skel, comps, em, t, gutter, aspect) {
  // components below this size are treated as points: fitting them would divide
  // by ~0 and blow a dot up into a whole cell
  const minExt = em * 0.01
  const gut = gutter * em
  for (const c of comps) {
    const b = rangeBox(skel, c.ranges)
    if (!b) continue
    // Array.isArray, not a bare lookup: position codes come straight out of the
    // SVG, and an unrecognised one must land on FULL_CELL rather than fetch
    // something off Object.prototype and scale the component by NaN.
    const cell = Array.isArray(CELLS[c.code]) ? CELLS[c.code] : FULL_CELL
    let x0 = cell[0] * em + gut
    let x1 = cell[2] * em - gut
    let y0 = cell[1] * em + gut
    let y1 = cell[3] * em - gut
    if (x1 - x0 < 1) {
      const mid = (x0 + x1) / 2
      x0 = mid - 0.5
      x1 = mid + 0.5
    }
    if (y1 - y0 < 1) {
      const mid = (y0 + y1) / 2
      y0 = mid - 0.5
      y1 = mid + 0.5
    }
    const bw = b.x1 - b.x0
    const bh = b.y1 - b.y0
    let sx = bw > minExt ? (x1 - x0) / bw : 1
    let sy = bh > minExt ? (y1 - y0) / bh : 1
    if (aspect < 1) {
      const u = Math.min(sx, sy)
      sx = lerp(u, sx, aspect)
      sy = lerp(u, sy, aspect)
    }
    xformBox(
      skel,
      c.ranges,
      b,
      lerp(1, sx, t),
      lerp(1, sy, t),
      0,
      t * ((x0 + x1) / 2 - (b.x0 + b.x1) / 2),
      t * ((y0 + y1) / 2 - (b.y0 + b.y1) / 2)
    )
  }
}

/**
 * Per-position and per-depth scaling, both tree-wide. Groups arrive depth-first
 * so an ancestor is always transformed before its descendants, and the factors
 * multiply down the chain — a right-hand component inside a bottom component
 * takes both, which is what makes the depth control feel fractal.
 */
function treeScale(skel, byPos, depthStep) {
  const one = [0, 0]
  for (const g of skel.groups) {
    if (g.to <= g.from) continue
    let f = 1
    if (g.depth > 0 && depthStep !== 1) f *= depthStep
    const pf = byPos[g.positionCode]
    if (pf > 0) f *= pf
    if (f === 1) continue
    one[0] = g.from
    one[1] = g.to
    const b = rangeBox(skel, one)
    if (!b) continue
    xformBox(skel, one, b, f, f, 0, 0, 0)
  }
}

/** Wrappers breathe about their contents' centre, so they open away from them. */
function enclosureBreath(skel, amt) {
  const f = 1 + amt
  for (const g of skel.groups) {
    if (!g.children || g.children.length < 2) continue
    const enc = []
    const inner = []
    for (const id of g.children) {
      const c = skel.groups[id]
      if (!c || c.to <= c.from) continue
      const dst = ENCLOSERS[c.positionCode] === 1 ? enc : inner
      dst.push(c.from, c.to)
    }
    if (!enc.length || !inner.length) continue
    const pivot = rangeBox(skel, inner)
    if (!pivot) continue
    xformBox(skel, enc, pivot, f, f, 0, 0, 0)
  }
}

export function apply(skel, P, ctx) {
  if (!skel || !skel.strokes || !skel.strokes.length) return
  const em = skel.em > 0 ? skel.em : 1024
  const p = P || {}

  const radScale = rd(p.lyRadicalScale, 1, 0.4, 2)
  const radWeight = rd(p.lyRadicalWeight, 0, -1, 1)
  const radShiftX = rd(p.lyRadicalShiftX, 0, -0.3, 0.3)
  const radShiftY = rd(p.lyRadicalShiftY, 0, -0.3, 0.3)
  const radRot = rd(p.lyRadicalRotate, 0, -30, 30)
  const otherScale = rd(p.lyOtherScale, 1, 0.4, 2)
  const depth = rd(p.lyDepthScale, 0, -0.5, 0.5)
  const explode = rd(p.lyExplode, 0, -0.4, 0.6)
  const breath = rd(p.lyEnclosureBreath, 0, -0.3, 0.4)
  const split = rd(p.lySplitOrder, 0, 0, 1)
  const jitAmt = rd(p.lyJitterAmt, 0, 0, 0.3)
  const jitRot = rd(p.lyJitterRot, 0, 0, 25)
  const fit = rd(p.lyCellFit, 0, 0, 1)
  const gutter = rd(p.lyCellGutter, 0, 0, 0.2)
  const aspect = rd(p.lyCellAspect, 0, 0, 1)
  const byPos = {
    l: rd(p.lyPosScaleL, 1, 0.5, 1.6),
    r: rd(p.lyPosScaleR, 1, 0.5, 1.6),
    t: rd(p.lyPosScaleT, 1, 0.5, 1.6),
    b: rd(p.lyPosScaleB, 1, 0.5, 1.6),
  }

  const radical = radicalRanges(skel)
  applyWeight(skel, radical, radWeight)

  const depthStep = 1 + depth * 0.35
  const posActive = byPos.l !== 1 || byPos.r !== 1 || byPos.t !== 1 || byPos.b !== 1
  const radActive = radScale !== 1 || radShiftX !== 0 || radShiftY !== 0 || radRot !== 0
  const moves =
    fit > 0 || posActive || depthStep !== 1 || radActive || otherScale !== 1 || breath !== 0 || explode !== 0 || split > 0 || jitAmt > 0 || jitRot > 0
  if (!moves) return

  recomputeBounds(skel)
  const tops = topComponents(skel)

  // The rigid grid goes down first; every later control then modulates it,
  // rather than being flattened by it.
  if (fit > 0) cellFit(skel, tops, em, fit, gutter, aspect)
  if (posActive || depthStep !== 1) treeScale(skel, posActive ? byPos : {}, depthStep)

  if (radActive && radical) {
    const b = rangeBox(skel, radical)
    if (b) xformBox(skel, radical, b, radScale, radScale, radRot * DEG, radShiftX * em, radShiftY * em)
  }

  if (otherScale !== 1) {
    const mask = new Uint8Array(skel.strokes.length)
    if (radical) {
      for (let r = 0; r < radical.length; r += 2) for (let k = radical[r]; k < radical[r + 1]; k++) mask[k] = 1
    }
    for (const c of tops) {
      if (touchesMask(c.ranges, mask)) continue
      const b = rangeBox(skel, c.ranges)
      if (b) xformBox(skel, c.ranges, b, otherScale, otherScale, 0, 0, 0)
    }
  }

  if (breath !== 0) enclosureBreath(skel, breath)

  if (explode !== 0 && tops.length > 1) {
    const boxes = tops.map((c) => rangeBox(skel, c.ranges))
    let gx0 = Infinity
    let gy0 = Infinity
    let gx1 = -Infinity
    let gy1 = -Infinity
    for (const b of boxes) {
      if (!b) continue
      if (b.x0 < gx0) gx0 = b.x0
      if (b.x1 > gx1) gx1 = b.x1
      if (b.y0 < gy0) gy0 = b.y0
      if (b.y1 > gy1) gy1 = b.y1
    }
    if (gx0 <= gx1) {
      const cx = (gx0 + gx1) / 2
      const cy = (gy0 + gy1) / 2
      for (let i = 0; i < tops.length; i++) {
        const b = boxes[i]
        if (!b) continue
        xformBox(skel, tops[i].ranges, b, 1, 1, 0, explode * ((b.x0 + b.x1) / 2 - cx), explode * ((b.y0 + b.y1) / 2 - cy))
      }
    }
  }

  if (split > 0 || jitAmt > 0 || jitRot > 0) {
    const leaves = leafComponents(skel)

    if (split > 0 && leaves.length > 1) {
      // Shear along the direction this glyph is actually written in: first
      // component's centre to last. Coincident components fall back to
      // left-to-right, the default reading direction.
      const first = rangeBox(skel, leaves[0].ranges)
      const last = rangeBox(skel, leaves[leaves.length - 1].ranges)
      let ax = 1
      let ay = 0
      if (first && last) {
        const dx = (last.x0 + last.x1) / 2 - (first.x0 + first.x1) / 2
        const dy = (last.y0 + last.y1) / 2 - (first.y0 + first.y1) / 2
        const L = Math.hypot(dx, dy)
        if (L > 1) {
          ax = dx / L
          ay = dy / L
        }
      }
      const reach = split * 0.45 * em
      for (let i = 0; i < leaves.length; i++) {
        const f = i / (leaves.length - 1) - 0.5
        const b = rangeBox(skel, leaves[i].ranges)
        if (b) xformBox(skel, leaves[i].ranges, b, 1, 1, 0, ax * reach * f, ay * reach * f)
      }
    }

    if (jitAmt > 0 || jitRot > 0) {
      const rng = ctx && typeof ctx.rng === 'function' ? ctx.rng : mulberry32(((skel.seed >>> 0) ^ 0x9e3779b9) >>> 0)
      for (const c of leaves) {
        // draw all three every time so the sequence depends only on component
        // count, never on which of the two sliders is live
        const dx = (rng() * 2 - 1) * jitAmt * em
        const dy = (rng() * 2 - 1) * jitAmt * em
        const rot = (rng() * 2 - 1) * jitRot * DEG
        const b = rangeBox(skel, c.ranges)
        if (b) xformBox(skel, c.ranges, b, 1, 1, rot, dx, dy)
      }
    }
  }

  recomputeBounds(skel)
}
