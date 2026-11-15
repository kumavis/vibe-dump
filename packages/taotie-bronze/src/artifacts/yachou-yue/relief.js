// Yachou yue — the face in relief, traced from the CC0 head-on photograph flattened to plate mm
// (reference/yachou-yue/faces/face-mask.jpg, 8 px/mm; plate frame as form.js) and checked against the
// owner's evenly lit head-on press image (private, never committed). Heights are read off the low
// oblique photograph (three-quarter.jpg) against the 8.5 mm plate edge — dossier § Relief.
//
// The face is SCULPTURAL and cast in broad FLAT-TOPPED masses with steep walls, not round tubes: a hooked
// brow band over a slit and a sloping lid, broad flat eye rings that run down into a teardrop, thick ear
// rings round ragged holes, a leaf-shaped crest, hooded cheek curls over deep pockets, a nose bulb with
// hollow volute nostrils, and a mouth whose heavy rim stands round a DEEP recess — the teeth stand low in
// it, in the shadow of the gum. No ground pattern. Openings are cut by the geometry (form.js, traced.js);
// each raised part is drawn a little past the opening it frames, so the cut wall runs straight up.
//
// Coordinates here are MASK-local (x = 0 on the face's own axis, which sits MASK_DX right of the plate's);
// traced openings come in plate x and are shifted into this frame where a ring has to follow them.

import { EYE, EAR_C, MASK_DX, smoothOpen, smoothClosed, circle } from './form.js'
import { EAR_CUT_L, EAR_CUT_R, BROW_CUT_L } from './traced.js'

/** the panel lies over the whole plate; front and back both read it at the same plate x (form and holes line up) */
export const RECT = { x: -178, y: -3, w: 356, h: 333 }

const SIDES = [1, -1]
const mir = (pts, s) => pts.map(([x, y]) => [s * x, y])
const local = (pts) => pts.map(([x, y]) => [x - MASK_DX, y])

function path(ctx, pts, closed = false) {
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  if (closed) ctx.closePath()
}

/** draw(ctx) in mask-local mm on a panel whose origin is RECT's corner */
const P = (fn) => (ctx) => {
  ctx.save()
  ctx.translate(-RECT.x + MASK_DX, -RECT.y)
  ctx.fillStyle = '#fff'
  ctx.strokeStyle = '#fff'
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  fn(ctx)
  ctx.restore()
}

const fillPoly = (pts) => (ctx) => { ctx.beginPath(); path(ctx, pts, true); ctx.fill() }
function stroke(pts, w) {
  return (ctx) => {
    ctx.lineWidth = w
    ctx.beginPath()
    path(ctx, pts)
    ctx.stroke()
  }
}

// ------------------------------------------------------------------ traced outlines (right side, x > 0, mask-local)

// brow: the hooked band over the slit — its outer end turns down beside the slit's end, its inner end
// swells and stops blunt beside the crest (face-mask: band ≈ 8 mm, flat top lit, steep under-face)
const BROW = smoothOpen([[93.2, 212.5], [95.0, 221.5], [93.0, 229.5], [86, 233.6], [72, 234.6], [58, 233.6], [47.5, 231],
  [41.6, 226], [39.6, 219.5], [40, 214.5]], 6)
const BROW_W = 8.4
// the lid under the slit: a smooth convex sweep (the press image), its lower edge a long shallow curve; in
// Gary Todd's top-lit photograph it lies in the brow band's shadow
const BROW_LID = (yLow) => [[91.5, Math.max(yLow, 214)], [80, yLow + 1.5], [62, yLow], [48, yLow + 0.8], [42.5, yLow + 3],
  [42, 222], [47, 228.6], [70, 230.6], [87, 230], [91.5, 225]]

// nose crest: a broad leaf-shaped V — each arm a wedge with a flat lit top edge, its underside sweeping
// back to the stem
// (the two arms rise from a notch on the axis at y ≈ 222 to blunt tips at ≈ 231: a Y, not a T)
const CREST_ARM = [[0.8, 222.4], [4.5, 224.6], [10, 228], [16, 230.6], [20.6, 231.6], [22.6, 230.4], [21.6, 228], [15.5, 223.6],
  [8.5, 218], [4, 213.6], [0.8, 212.8]]

// mouth: the rim box, upper corners lifting into horns
const MOUTH_OUT = [[0, 137.6], [22, 138.4], [38, 140.4], [48, 144.2], [54.5, 148.8], [59.5, 151.2], [62.2, 147.5],
  [62.6, 136], [62, 118], [60.3, 104.5], [56.5, 97.8], [46, 94.8], [24, 93.6], [0, 93.3]]
// the deep recess inside it: the two corner pits and the trough round the teeth, bounded above by the gum
const MOUTH_IN = [[0, 122.4], [30, 122.6], [42, 123.6], [46.4, 127.5], [47.2, 147], [50.5, 149.6], [54.6, 147.6], [56, 131],
  [55.6, 114], [52.6, 108.4], [44, 105.8], [20, 104.8], [0, 104.6]]
// the step inside the lower lip (the lit inner rim of the photograph) — the recess is cut in two stages
const MOUTH_STEP = [[0, 122.4], [30, 122.6], [42, 123.6], [46.4, 127.5], [47.2, 147], [50.5, 149.6], [54.6, 147.6], [56, 131],
  [55.6, 114], [53.4, 106.6], [44, 103.4], [20, 102.4], [0, 102.2]]

// ear: a thick ring round the traced hole, its lower end swelling into a lobe (offsets from the hole centre)
const EAR_RING = [[-6, 19.5], [0, 22.4], [6, 20.4], [9, 12], [9.6, 0], [8.4, -12], [5.6, -20.4], [-1.5, -24.6], [-8.6, -22],
  [-11, -14], [-9, -5], [-7.6, 6], [-8.2, 15]]

const half2full = (half) => smoothClosed(mir(half, 1).concat(mir(half.slice(1, -1).reverse(), -1)), 4)

export function drawFace(kit, panel, { back = false } = {}) {
  // ---- mouth: the whole box raised, then the recess cut in two stages; the gum stays at full height
  const box = half2full(MOUTH_OUT)
  panel.raise(P(fillPoly(box)), { height: 4.4, shoulder: 1.3, profile: 'plateau' })
  panel.sink(P(fillPoly(half2full(MOUTH_STEP))), { depth: 1.6, shoulder: 0.5, profile: 'u' })
  panel.sink(P(fillPoly(half2full(MOUTH_IN))), { depth: 1.9, shoulder: 0.7, profile: 'u' })
  // the gum's lower edge rounds over onto the teeth
  panel.sink(P(stroke([[-45.6, 128], [-41, 123.6], [0, 122.9], [41, 123.6], [45.6, 128]], 1.6)), { depth: 0.5, profile: 'u' })

  // ---- nose bulb: a broad pillow down to the gum, under it the bridge to the crest
  panel.raise(P(fillPoly(smoothClosed([[-26, 170], [-21, 177.4], [0, 178.6], [21, 177.4], [26, 170], [25.4, 158], [20, 146.5],
    [9, 141], [0, 140.4], [-9, 141], [-20, 146.5], [-25.4, 158]], 5))), { height: 4.2, shoulder: 7.5, profile: 'plateau' })
  // nostril volutes: domed knobs on the bulb, each hollowed by a pocket on its lower inner side
  panel.add(P((ctx) => { for (const s of SIDES) { ctx.beginPath(); path(ctx, circle([s * 13.2, 166.4], 8.2, 40), true); ctx.fill() } }),
    { height: 1.6, profile: 'dome' })

  // ---- crest arms + the stem, the cheek hoods
  panel.raise(P((ctx) => { for (const s of SIDES) fillPoly(mir(CREST_ARM, s))(ctx) }), { height: 4.4, shoulder: 1.3, profile: 'plateau' })
  panel.raise(P(stroke([[0, 216], [0, 175]], 4.8)), { height: 3.9, shoulder: 1.0, profile: 'plateau' })
  panel.raise(P((ctx) => {
    for (const s of SIDES) fillPoly(smoothClosed(mir([[6.4, 188], [9, 185], [22, 184.4], [26.4, 189], [26.8, 199], [24, 205],
      [16, 206.6], [9, 205.6], [6.2, 201]], s), 4))(ctx)
  }), { height: 4.2, shoulder: 2.6, profile: 'plateau' })

  // ---- eyes: broad flat rings round the holes; below each, a lower teardrop that slopes away toward the cheek
  panel.raise(P((ctx) => {
    for (const s of SIDES) {
      const [cx, cy] = [s * EYE.c[0], EYE.c[1]]
      ctx.beginPath()
      path(ctx, circle([cx, cy], 19.4, 72), true)
      path(ctx, circle([cx, cy], EYE.r - 1.0, 48).reverse(), true)
      ctx.fill('evenodd')
    }
  }), { height: 5.2, shoulder: 3.6, profile: 'plateau' })
  panel.raise(P((ctx) => {
    for (const s of SIDES) {
      const [cx, cy] = [s * EYE.c[0], EYE.c[1]]
      fillPoly(smoothClosed(mir([[EYE.c[0] - 16, cy - 5], [EYE.c[0] - 11, cy - 20], [EYE.c[0] - 1, cy - 27.5], [EYE.c[0] + 9, cy - 25.5],
        [EYE.c[0] + 17, cy - 14], [EYE.c[0] + 17, cy]], s), 5))(ctx)
      void cx
    }
  }), { height: 4.4, profile: (d) => Math.sin(Math.min(1, Math.max(0, d) / 11) * Math.PI / 2) })

  // ---- brows: the sloping lid, then the hooked band over it
  panel.raise(P((ctx) => { for (const s of SIDES) fillPoly(smoothClosed(mir(BROW_LID(206.5), s), 4))(ctx) }),
    { height: 2.7, profile: (d) => Math.sin(Math.min(1, Math.max(0, d) / 7.5) * Math.PI / 2) })
  panel.raise(P((ctx) => { for (const s of SIDES) stroke(mir(BROW, s), BROW_W)(ctx) }), { height: 4.6, shoulder: 1.6, profile: 'plateau' })

  // ---- ears: a ring round each traced hole (the holes are not alike, nor the rings)
  panel.raise(P((ctx) => {
    for (const s of SIDES) {
      const [cx, cy] = EAR_C[s]
      ctx.beginPath()
      path(ctx, smoothClosed(EAR_RING.map(([dx, dy]) => [cx + s * dx, cy + dy]), 4), true)
      path(ctx, local(s > 0 ? EAR_CUT_R : EAR_CUT_L), true)
      ctx.fill('evenodd')
    }
  }), { height: 4.6, shoulder: 3.0, profile: 'plateau' })

  // ---- everything sunk, in one pass: eye-ring bevels into the holes, the cheek pockets, the nostril pockets,
  // the stem's centre groove and its side grooves
  panel.sink(P((ctx) => {
    for (const s of SIDES) {
      ctx.beginPath(); path(ctx, circle([s * EYE.c[0], EYE.c[1]], EYE.r + 2.5, 48), true); ctx.fill()
    }
  }), { depth: 2.4, shoulder: 1.8, profile: 'u' })
  panel.sink(P((ctx) => {
    for (const s of SIDES) {
      // the cheek hood's pocket: under its arched top, open below and toward the stem
      fillPoly(smoothClosed(mir([[4.2, 180], [20.6, 180], [21.4, 189], [20, 195.6], [16, 198.4], [10, 198.6], [5.6, 196.6], [4.2, 192]], s), 4))(ctx)
      ctx.beginPath(); ctx.ellipse(s * 12.6, 163.2, 4.4, 3.2, s * -0.3, 0, 2 * Math.PI); ctx.fill()
    }
  }), { depth: 2.8, shoulder: 0.9, profile: 'u' })
  panel.sink(P((ctx) => {
    ctx.lineWidth = 0.9
    ctx.beginPath(); path(ctx, [[0.4, 222], [0.4, 178]]); ctx.stroke()
    for (const s of SIDES) {
      ctx.beginPath(); path(ctx, [[s * 3.1, 212], [s * 3.1, 176]]); ctx.stroke()
      // the volute: from the pocket, round the knob's top and out
      const sp = []
      for (let i = 0; i <= 40; i++) {
        const t = i / 40
        const a = s > 0 ? Math.PI * (-0.3 + 1.1 * t) : Math.PI * (1.3 - 1.1 * t)
        const r = 5.2 + 1.6 * t
        sp.push([s * 13.6 + r * Math.cos(a), 164.6 + r * Math.sin(a)])
      }
      ctx.beginPath(); path(ctx, sp); ctx.stroke()
    }
  }), { depth: 0.8, profile: 'u' })

  // ---- the clan sign 亞醜 in a sunk cartouche either side of the mouth
  inscriptions(panel, back)
}

/** `back`: the glyphs drawn mirror-reversed (unused while front and back share one map — see the artifact) */
function inscriptions(panel, back) {
  const C = { x: 88, y: 135.5, w: 24, h: 38 }
  panel.sink(P((ctx) => {
    for (const s of SIDES) ctx.fillRect(s * C.x - C.w / 2, C.y - C.h / 2, C.w, C.h)
  }), { depth: 0.55, shoulder: 0.3, profile: 'u' })
  panel.add(P((ctx) => {
    for (const s of SIDES) {
      const cx = s * C.x, cy = C.y
      ctx.save()
      if (back) { ctx.translate(cx, 0); ctx.scale(-1, 1); ctx.translate(-cx, 0) }
      ctx.lineWidth = 0.8
      ctx.strokeRect(cx - C.w / 2 + 1.0, cy - C.h / 2 + 1.0, C.w - 2.0, C.h - 2.0)
      // 亞: the cross-shaped frame (a square with its corners stepped in)
      const a = 9.0, b = 16.2, k = 3.6
      ctx.beginPath()
      path(ctx, [[cx - a + k, cy + b], [cx + a - k, cy + b], [cx + a - k, cy + b - k], [cx + a, cy + b - k], [cx + a, cy - b + k],
        [cx + a - k, cy - b + k], [cx + a - k, cy - b], [cx - a + k, cy - b], [cx - a + k, cy - b + k], [cx - a, cy - b + k],
        [cx - a, cy + b - k], [cx - a + k, cy + b - k]], true)
      ctx.lineWidth = 0.75
      ctx.stroke()
      // 醜 inside, as the photographs show it: a tall figure down the middle — a stack of five rounded lobes on a
      // spine (the masked head and body), splayed legs below — with the jar 酉 small beside it (drawn, not traced)
      ctx.lineWidth = 0.6
      ctx.beginPath(); path(ctx, [[cx, cy + 12.5], [cx, cy - 9]]); ctx.stroke()
      for (let i = 0; i < 5; i++) {
        const y = cy + 9.5 - i * 3.9
        ctx.beginPath(); ctx.ellipse(cx, y, 3.6 - i * 0.25, 1.6, 0, 0, 2 * Math.PI); ctx.stroke()
      }
      ctx.beginPath(); path(ctx, [[cx - 4, cy - 13.5], [cx, cy - 9], [cx + 4, cy - 13.5]]); ctx.stroke()
      const jx = cx - s * 6.2
      ctx.beginPath(); path(ctx, [[jx - 1.4, cy + 4], [jx + 1.4, cy + 4], [jx + 1.7, cy - 3], [jx - 1.7, cy - 3]], true); ctx.stroke()
      ctx.restore()
    }
  }), { height: 0.55, profile: 'ridge' })
}
