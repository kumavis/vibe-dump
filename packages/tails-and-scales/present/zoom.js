// Semantic zoom (F8b, DESIGN §4.2.7 "Drawing at scale" 4): how much the
// table says about each unit, chosen from how many screen pixels an inch of
// the table takes at the camera's target. Pure: numbers in, a tier out, no
// three.js and no DOM, so sim/ holds the rule in Node and the view
// (view/units.js) and the chips (ui/chips.js) ask the same function.
//
//   pxPerInch = screenH / (2 · d · tan(fov / 2))
//
// with d the camera's distance to its target and fov the vertical field of
// view: at the target, the screen's height spans 2 · d · tan(fov / 2)
// inches of the table (as a plane square to the view; the ground, seen
// slanted, is foreshortened, but the target is where the player looks, and
// the tiers are wide).
//
//   Close      ≥ 12 px/inch   today's labels (name, count, status) and rings
//   Tactical   6-12           short labels (the role's glyph, the count, the
//                             order badge) and today's rings
//   Strategic  < 6            chips only (ui/chips.js); rings hidden, the
//                             chip's border carrying the state
//
// Classic is unchanged because the view keys the tiers on a board larger
// than classic's (view/units.js's zoom, as LOD and the tiles are), not
// because its views are all Close: at rest they read 15.8-24.7 px per inch
// on a laptop (1280×696 to 1280×800), but 8.3-11.0 on a 412×915 portrait
// phone (its broadside 8.3, its overview 9.0, behind a seat 11.0), which
// would be Tactical; on classic's board the labels stay Close on every
// screen (camera-check holds it). A Grand overview is Tactical on a desktop
// screen (about 11.5) and Strategic on a portrait phone. (F8b's review: the
// 13.6 this note once gave for classic's portrait view was never measured.)
// To keep a camera resting on a boundary from flickering between two tiers,
// a tier is left only once pxPerInch is HYST past its edge (tierOf's
// `from`).

export const TIERS = Object.freeze(['close', 'tactical', 'strategic'])
// the tiers' lower edges, in px per inch
export const CLOSE = 12
export const TACTICAL = 6
// how far past an edge pxPerInch must go before the tier changes (2%: a
// Grand overview on a 16:10 screen, about 11.5 px per inch, reads Tactical
// however the camera came there)
export const HYST = 0.02

// pixels per inch at the camera's target: `screenH` the drawing's height in
// CSS pixels, `d` the camera's distance to its target, `fov` the vertical
// field of view in degrees (three.js's PerspectiveCamera.fov)
export function pxPerInch(screenH, d, fov) {
  if (!(d > 0) || !(screenH > 0)) return Infinity
  return screenH / (2 * d * Math.tan((fov * Math.PI) / 360))
}

// The tier for `ppi` pixels per inch; `from` the tier shown now (or null),
// which it keeps until ppi has gone HYST beyond the edge it would cross.
export function tierOf(ppi, from = null) {
  const plain = ppi >= CLOSE ? 'close' : ppi >= TACTICAL ? 'tactical' : 'strategic'
  if (!from || from === plain) return plain
  const lo = from === 'close' ? CLOSE : from === 'tactical' ? TACTICAL : -Infinity
  const hi = from === 'close' ? Infinity : from === 'tactical' ? CLOSE : TACTICAL
  return ppi >= lo * (1 - HYST) && ppi < hi * (1 + HYST) ? from : plain
}

// The role's glyph a short label and a chip carry (DESIGN §4.2.7's six:
// ⚔ ➶ ★ ✈ ⛭ ▣): by the unit's slot role (data/schema.js's ROLES) where it
// says enough (a Hero, a Fast unit, Artillery, a Monster), else (Troops and
// Elite) by how the AI plays it: a shooter's bow, everyone else's blade.
// ((F9a) a Vehicle a big unit's ▣, as a Monster's)
export const GLYPHS = Object.freeze({ Hero: '★', Fast: '✈', Artillery: '⛭', Monster: '▣', Vehicle: '▣', shooter: '➶', melee: '⚔' })
export const glyphOf = (t) => GLYPHS[t?.role] ?? (t?.ai === 'shooter' ? GLYPHS.shooter : GLYPHS.melee)

// Chips within `px` of each other on screen stack into one cluster ("×3").
// `pts`: [{ id, x, y }] in screen pixels, in the order the chips are drawn
// (each unit's own order, so the same table always clusters alike). Greedy
// and stable: each chip joins the first cluster whose first chip lies
// within px, or starts one; a cluster's place is its members' mean.
// Returns [{ ids, x, y }].
export function clusters(pts, px = 18) {
  const out = []
  const r2 = px * px
  for (const p of pts) {
    const c = out.find((q) => (q.x0 - p.x) * (q.x0 - p.x) + (q.y0 - p.y) * (q.y0 - p.y) <= r2)
    if (c) {
      c.ids.push(p.id)
      c.sx += p.x
      c.sy += p.y
    } else out.push({ ids: [p.id], x0: p.x, y0: p.y, sx: p.x, sy: p.y })
  }
  return out.map((c) => ({ ids: c.ids, x: c.sx / c.ids.length, y: c.sy / c.ids.length }))
}
