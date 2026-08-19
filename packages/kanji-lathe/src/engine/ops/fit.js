// Final stage: put the deformed glyph back on its em square.
//
// Everything upstream is free to fling points anywhere; this is what keeps a
// wildly warped glyph sitting in a text line next to its neighbours. The
// defaults deliberately do almost nothing — KanjiVG already positions each
// character with its own intended extent, and normalising every glyph to the
// margins would inflate 一 to the size of 鑑.
import { clamp, lerp } from '../../geom/path.js'
import { recomputeBounds } from '../skeleton.js'

export const params = [
  {
    id: 'ftFit',
    label: 'Refit',
    group: 'Fit',
    type: 'select',
    default: 'clamp',
    options: [
      { value: 'none', label: 'None — let it spill' },
      { value: 'clamp', label: 'Only if it overflows' },
      { value: 'fit', label: 'Always refit to margins' },
    ],
    hint: 'How the deformed glyph is put back inside the em square. "Only if it overflows" leaves the original proportions of every character alone.',
  },
  { id: 'ftMargin', label: 'Margin', group: 'Fit', type: 'range', min: 0, max: 0.3, step: 0.005, default: 0.03, unit: 'em', hint: 'Inset from the em square.' },
  {
    id: 'ftSquareness',
    label: 'Squareness',
    group: 'Fit',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'When refitting: 0 keeps the glyph proportions, 1 stretches every character to fill a perfect square. CJK type is square by nature, so 1 is a legitimate — if brutal — design decision.',
  },
  { id: 'ftOptical', label: 'Optical centring', group: 'Fit', type: 'range', min: 0, max: 1, step: 0.01, default: 0, hint: 'Centre on the ink centroid rather than the bounding box, so a heavy half pulls the glyph toward it.' },
  { id: 'ftShiftX', label: 'Shift X', group: 'Fit', type: 'range', min: -0.3, max: 0.3, step: 0.005, default: 0, bipolar: true, unit: 'em' },
  { id: 'ftShiftY', label: 'Shift Y', group: 'Fit', type: 'range', min: -0.3, max: 0.3, step: 0.005, default: 0, bipolar: true, unit: 'em' },
  {
    id: 'ftAdvance',
    label: 'Advance width',
    group: 'Fit',
    type: 'range',
    min: 0.55,
    max: 1.45,
    step: 0.01,
    default: 1,
    unit: 'em',
    hint: 'Set-width used by the text proof and the exported font. Below 1 the glyphs overlap — a condensed setting.',
  },
]

/** Ink centroid weighted by polyline length, so long strokes count for more. */
function centroid(skel) {
  let sx = 0
  let sy = 0
  let sw = 0
  for (const s of skel.strokes) {
    if (!s.alive) continue
    for (let i = 1; i < s.n; i++) {
      const x0 = s.pts[i * 2 - 2]
      const y0 = s.pts[i * 2 - 1]
      const x1 = s.pts[i * 2]
      const y1 = s.pts[i * 2 + 1]
      const w = Math.hypot(x1 - x0, y1 - y0)
      sx += ((x0 + x1) / 2) * w
      sy += ((y0 + y1) / 2) * w
      sw += w
    }
  }
  return sw > 1e-6 ? [sx / sw, sy / sw] : [skel.em / 2, skel.em / 2]
}

export function apply(skel, P, ctx) {
  const em = skel.em
  recomputeBounds(skel)
  const b = skel.bbox
  const bw = Math.max(1e-3, b.x1 - b.x0)
  const bh = Math.max(1e-3, b.y1 - b.y0)

  const box = Math.max(1, em - 2 * clamp(P.ftMargin ?? 0.03, 0, 0.45) * em)
  const mode = P.ftFit ?? 'clamp'
  const sq = clamp(P.ftSquareness ?? 0, 0, 1)

  // Two candidate scalings: uniform (keeps proportions) and full stretch (makes
  // the bounding box exactly square). Squareness blends between them.
  const iso = Math.min(box / bw, box / bh)
  let sx = lerp(iso, box / bw, sq)
  let sy = lerp(iso, box / bh, sq)
  if (mode === 'none') {
    sx = sy = 1
  } else if (mode === 'clamp') {
    // shrink-to-fit only; never inflate a small character
    const k = Math.min(1, iso)
    sx = k === 1 ? 1 : lerp(k, box / bw, sq)
    sy = k === 1 ? 1 : lerp(k, box / bh, sq)
  }

  const cx = b.x0 + bw / 2
  const cy = b.y0 + bh / 2

  // Scaling always pivots on the glyph's own centre. Only "fit" re-centres the
  // glyph on the em — clamping a glyph that overflows should not also shove the
  // deliberately off-centre ones (氵 on the left, 亠 near the top) to the middle.
  const recentre = mode === 'fit'
  let ox = cx
  let oy = cy
  const optical = clamp(P.ftOptical ?? 0, 0, 1)
  if (optical > 0) {
    // Centring on the ink centroid instead of the bbox: a heavy half pulls the
    // glyph toward it, which is how a punchcutter would have judged it by eye.
    const [gx, gy] = centroid(skel)
    ox = lerp(cx, gx, optical)
    oy = lerp(cy, gy, optical)
  }

  const dx = (P.ftShiftX ?? 0) * em
  const dy = (P.ftShiftY ?? 0) * em
  const tx = (recentre || optical > 0 ? em / 2 : ox) + dx
  const ty = (recentre || optical > 0 ? em / 2 : oy) + dy
  if (sx === 1 && sy === 1 && tx === ox && ty === oy) return

  for (const s of skel.strokes) {
    if (!s.alive) continue
    for (let i = 0; i < s.n; i++) {
      s.pts[i * 2] = (s.pts[i * 2] - ox) * sx + tx
      s.pts[i * 2 + 1] = (s.pts[i * 2 + 1] - oy) * sy + ty
    }
  }
  recomputeBounds(skel)
  void ctx
}
