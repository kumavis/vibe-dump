// Register / panel layout helpers — how a Shang mould section was laid out
// (research/01 §5): horizontal registers separated by bowstrings or plain
// bands; in each register, units centred on the section's centre line (a
// flange or seam), creatures in narrow friezes facing that line in mirrored
// pairs; leiwen packed into whatever is left. Everything is in panel mm.
//
//   drawMotif(panel, motif, rect, params, { preset, ground, margin })   one unit (the atlas call)
//   frieze(panel, rect, { unit, count, facing, gap, centre, … })        a band of units marching to the centre
//   mirrorPair(panel, rect, unit, opts)                                  two units facing the centre line
//   register(panel, rect, rows, { separator })                           split a wall into registers
//   bladeRow(panel, rect, { count, direction, … })                       rising / hanging blades
//   frame(panel, rect, { width, top, bottom, sides, … })                 a bordered frame around a plain field
//   bowstrings(panel, rect, { count, … })                                raised ribs (弦纹)
//   registers / inset / bossRow / borderLine                             small utilities

import { getMotif, resolveMotifParams } from './motifs/index.js'

// --------------------------------------------------------------- one unit

const isSym = (m, p) => (typeof m.symmetric === 'function' ? m.symmetric(p) : m.symmetric !== false)

/**
 * Draw one motif unit into rect: motif.draw (left half) → leiwen ground on the
 * left half → mirror. Motifs whose `symmetric` is false (or a function of the
 * params returning false) draw the whole rect and are not mirrored; motifs
 * with `ground: false` get no leiwen. A motif's `groundOptions(p, rect)`
 * supplies default leiwen options (e.g. pitch scaled to a frieze), `ground`
 * overrides them.
 * @returns the resolved params actually used
 */
export function drawMotif(panel, motif, rect, params = {}, { preset, ground = {}, margin = 0.6 } = {}) {
  const m = getMotif(motif)
  const p = resolveMotifParams(m, params, preset)
  const symmetric = isSym(m, p)
  m.draw(panel, rect, p)
  if (ground !== false && m.ground !== false) {
    const half = symmetric ? { x: rect.x, y: rect.y, w: rect.w / 2, h: rect.h } : rect
    panel.fillGround({ ...(m.groundOptions?.(p, rect) || {}), ...ground }, { rect: half, margin })
  }
  if (symmetric) panel.mirrorX(rect)
  return p
}

/** Unit spec: 'kui' | { motif, params?, preset?, w? (mm, or fraction of the band if ≤ 1) } */
function unitSpec(u) {
  return typeof u === 'string' ? { motif: u } : u
}

// --------------------------------------------------------------- friezes

/**
 * A narrow band of units (kui, birds, cicadas, whorl–kui alternations …).
 *
 *   unit     a unit spec or an array of them (cycled: ['whorl', 'kui'])
 *   count    units in the band (centre slot included)
 *   facing   'centre' (default; left half faces right, mirrored — the Shang rule),
 *            'left' | 'right' (a procession, all one way)
 *   gap      mm between units
 *   centre   a unit spec for the middle slot when facing 'centre' and count is
 *            odd ('flange' or null leaves it as ground), e.g. { motif: 'taotie', preset: … }
 *   params / preset   applied to every unit (a unit spec's own win)
 *   ground   leiwen options (false: none), margin mm
 *
 * Units honour params.facing ('left'|'right') and arrangement 'single'.
 * Legacy form frieze(panel, rect, motif, count, params, opts) still works.
 * @returns { slots: [{ rect, spec }] }
 */
export function frieze(panel, rect, a, b, c, d) {
  if (typeof a === 'string' || (a && typeof a.draw === 'function')) {
    // legacy: repeat a motif `count` times, each unit drawn on its own
    const count = b, params = c || {}, opts = d || {}
    const w = rect.w / count
    for (let i = 0; i < count; i++) drawMotif(panel, a, { x: rect.x + i * w, y: rect.y, w, h: rect.h }, params, opts)
    return { slots: [] }
  }
  const o = { unit: 'kui', count: 2, facing: 'centre', gap: 0, centre: null, params: {}, preset: undefined, ground: {}, margin: 0.6, ...(a || {}) }
  const units = (Array.isArray(o.unit) ? o.unit : [o.unit]).map(unitSpec)
  const n = Math.max(1, o.count | 0)
  const specs = []
  for (let i = 0; i < n; i++) specs.push(units[i % units.length])
  const centred = o.facing === 'centre'
  const mid = centred && n % 2 === 1 ? (n - 1) / 2 : -1
  if (mid >= 0) specs[mid] = o.centre ? unitSpec(o.centre) : null
  // slot widths: explicit w (mm or fraction) else share the rest equally
  const gaps = o.gap * (n - 1)
  let fixed = 0, free = 0
  const ws = specs.map((s) => {
    const w = s?.w
    if (w == null) { free++; return null }
    const mm = w <= 1 ? w * (rect.w - gaps) : w
    fixed += mm
    return mm
  })
  const share = free ? Math.max(0, rect.w - gaps - fixed) / free : 0
  const slots = []
  let x = rect.x
  for (let i = 0; i < n; i++) {
    const w = ws[i] ?? share
    slots.push({ rect: { x, y: rect.y, w, h: rect.h }, spec: specs[i], i })
    x += w + o.gap
  }
  const axis = rect.x + rect.w / 2
  let deferred = null
  for (const s of slots) {
    if (!s.spec) continue
    const m = getMotif(s.spec.motif)
    const facing = !centred ? o.facing : s.rect.x + s.rect.w / 2 < axis - 1e-6 ? 'right' : s.i === mid ? null : 'left'
    if (centred && facing === 'left') continue // the mirror makes the right half
    const p = resolveMotifParams(m, { ...o.params, ...(s.spec.params || {}), ...(facing ? { facing, arrangement: 'single' } : {}) }, s.spec.preset ?? o.preset)
    if (centred && s.i === mid && !isSym(m, p)) {
      // a rotational centre unit (a whorl) cannot be mirrored: draw it now so the
      // ground packs around it, and again over its own footprint after the mirror
      deferred = { m, p, rect: s.rect, snap: snapshot(panel, s.rect) }
    }
    m.draw(panel, s.rect, p)
    // a symmetric unit (whorl–taotie centre, a pair) drawn on its own is mirrored about its own axis;
    // the centre slot of a centred frieze is mirrored with the whole band below
    if (isSym(m, p) && !(centred && s.i === mid)) panel.mirrorX(s.rect)
  }
  const half = centred ? { ...rect, w: rect.w / 2 } : rect
  if (o.ground !== false) {
    const first = specs.find(Boolean)
    const gm = first ? getMotif(first.motif) : null
    const gp = gm ? resolveMotifParams(gm, o.params, first.preset ?? o.preset) : {}
    panel.fillGround({ ...(gm?.groundOptions?.(gp, rect) || {}), ...o.ground }, { rect: half, margin: o.margin })
  }
  if (centred) panel.mirrorX(rect)
  if (deferred) {
    restoreFootprint(panel, deferred.snap)
    deferred.m.draw(panel, deferred.rect, deferred.p)
  }
  return { slots }
}

/** Copy of field + groove inside rect (to find and undo one unit's footprint). */
function snapshot(panel, r) {
  const { cols, ppmm } = panel
  const x0 = Math.max(0, Math.floor(r.x * ppmm)), x1 = Math.min(cols, Math.ceil((r.x + r.w) * ppmm))
  const y0 = Math.max(0, Math.floor(r.y * ppmm)), y1 = Math.min(panel.rows, Math.ceil((r.y + r.h) * ppmm))
  const w = x1 - x0
  const f = new Float32Array(w * (y1 - y0)), g = new Float32Array(w * (y1 - y0))
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    f[(y - y0) * w + x - x0] = panel.field[y * cols + x]
    g[(y - y0) * w + x - x0] = panel.groove[y * cols + x]
  }
  return { x0, x1, y0, y1, w, f, g, after: null }
}

/** Put back the pre-draw state wherever the unit raised the surface (its footprint, after mirroring). */
function restoreFootprint(panel, s) {
  const { cols } = panel
  for (let y = s.y0; y < s.y1; y++) for (let x = s.x0; x < s.x1; x++) {
    const i = y * cols + x, j = (y - s.y0) * s.w + x - s.x0
    if (panel.field[i] > s.f[j] + 0.03) { panel.field[i] = s.f[j]; panel.groove[i] = s.g[j] }
  }
}

/** Two units meeting at rect's centre line (the default neck/foot frieze section). */
export function mirrorPair(panel, rect, unit = 'kui', opts = {}) {
  return frieze(panel, rect, { ...opts, unit, count: 2, facing: 'centre' })
}

// --------------------------------------------------------------- bands & borders

/**
 * Raised bowstrings (弦纹, §4.6): `count` ribs centred in rect (horizontal),
 * width / height / spacing in mm. profile 'ridge' (rounded) or 'plateau' (flat-topped).
 */
export function bowstrings(panel, rect, { count = 2, width = 1.5, height = 0.8, spacing, profile = 'ridge', vertical = false } = {}) {
  const span = vertical ? rect.w : rect.h
  const sp = spacing ?? Math.min(span / Math.max(1, count), width * 3)
  const total = sp * (count - 1)
  const c0 = (vertical ? rect.x + rect.w / 2 : rect.y + rect.h / 2) - total / 2
  panel.raise((ctx) => {
    for (let i = 0; i < count; i++) {
      const c = c0 + i * sp
      ctx.beginPath()
      if (vertical) ctx.rect(c - width / 2, rect.y, width, rect.h)
      else ctx.rect(rect.x, c - width / 2, rect.w, width)
      ctx.fill()
    }
  }, { height, profile, ...(profile === 'plateau' ? { shoulder: Math.min(0.4, width * 0.3) } : {}) })
}

/** Height (mm) a separator spec takes up. */
function sepHeight(s) {
  if (!s || s.kind === 'none') return 0
  if (s.h != null) return s.h
  if (s.kind === 'bowstrings') {
    const w = s.width ?? 1.5
    return (s.count ?? 2) * (s.spacing ?? w * 3) + (s.pad ?? 1)
  }
  if (s.kind === 'line') return (s.width ?? 1.4) + (s.pad ?? 1.5)
  return 4 // plain
}

function drawSep(panel, r, s) {
  if (!s || s.kind === 'none' || s.kind === 'plain') return
  if (s.kind === 'bowstrings') bowstrings(panel, r, s)
  else if (s.kind === 'line') borderLine(panel, { x: r.x, y: r.y + r.h / 2, w: r.w, h: 0 }, { width: s.width ?? 1.4, height: s.height ?? 0.7, sides: 'b' })
}

/**
 * Split rect into horizontal registers, TOP → BOTTOM (the order of research/01 §5.1),
 * with separators between them.
 *
 *   rows: [{ name?, h? (mm) | weight? (share of the rest, default 1),
 *            motif?, params?, preset?            → drawMotif
 *            frieze?: {…frieze opts}             → frieze
 *            blades?: {…bladeRow opts}           → bladeRow
 *            draw?(panel, rect)                  → anything
 *            plain?: true                        → left plain (no ground)
 *            sep?: separator below this row (overrides opts.separator) }]
 *   separator: { kind: 'bowstrings', count, width, height, spacing } | { kind: 'line' }
 *              | { kind: 'plain', h } | { kind: 'none' }        (default 2 bowstrings)
 *   edges: true → also a separator above the first and below the last row
 *   inset: mm kept clear between a row and its separators (default 0.8)
 *
 * @returns { rows: [rect], byName: { name: rect } }
 */
export function register(panel, rect, rows, { separator = { kind: 'bowstrings', count: 2 }, edges = false, inset: pad = 0.8, ground = {} } = {}) {
  const seps = rows.map((r, i) => (i < rows.length - 1 ? (r.sep ?? separator) : null))
  const edgeH = edges ? sepHeight(separator) : 0
  let used = 2 * edgeH
  for (let i = 0; i < rows.length; i++) used += sepHeight(seps[i]) + (rows[i].h ?? 0)
  const wsum = rows.reduce((a, r) => a + (r.h == null ? r.weight ?? 1 : 0), 0)
  const rest = Math.max(0, rect.h - used)
  let y = rect.y + rect.h
  const out = []
  const byName = {}
  if (edges) {
    drawSep(panel, { x: rect.x, y: y - edgeH, w: rect.w, h: edgeH }, separator)
    y -= edgeH
  }
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    const h = row.h ?? (rest * (row.weight ?? 1)) / (wsum || 1)
    const r = { x: rect.x, y: y - h, w: rect.w, h }
    const inner = { x: r.x, y: r.y + (seps[i] || (edges && i === rows.length - 1) ? pad : 0), w: r.w, h: 0 }
    inner.h = r.y + r.h - (i > 0 || edges ? pad : 0) - inner.y
    out.push(inner)
    if (row.name) byName[row.name] = inner
    if (row.draw) row.draw(panel, inner)
    else if (row.frieze) frieze(panel, inner, { ground, ...row.frieze })
    else if (row.blades) bladeRow(panel, inner, row.blades)
    else if (row.motif) drawMotif(panel, row.motif, inner, row.params || {}, { preset: row.preset, ground: row.ground ?? ground })
    y -= h
    if (seps[i]) {
      const sh = sepHeight(seps[i])
      drawSep(panel, { x: rect.x, y: y - sh, w: rect.w, h: sh }, seps[i])
      y -= sh
    }
  }
  if (edges) drawSep(panel, { x: rect.x, y: y - edgeH, w: rect.w, h: edgeH }, separator)
  return { rows: out, byName }
}

/**
 * A row of blades (蕉叶纹, §4.3) across rect: `count` blades, each one
 * rect.w/count wide (minus gap), rising from rect's bottom or hanging from its top.
 * opts: { count = 4, direction 'rising'|'hanging', gap mm, params, preset,
 *         between: 'plain' | 'leiwen' (ground between blades; Met gu/zun: plain) }
 */
export function bladeRow(panel, rect, { count = 4, direction = 'rising', gap = 0, params = {}, preset, between = 'plain', ground = {} } = {}) {
  const w = (rect.w - gap * (count - 1)) / count
  const rects = []
  for (let i = 0; i < count; i++) {
    const r = { x: rect.x + i * (w + gap), y: rect.y, w, h: rect.h }
    rects.push(r)
    drawMotif(panel, 'blade', r, { ...params, direction }, { preset, ground })
  }
  if (between === 'leiwen') {
    const m = getMotif('blade')
    const p = resolveMotifParams(m, { ...params, direction }, preset)
    const avoid = panel.mask((ctx) => { for (const r of rects) m.outline(ctx, r, p) })
    panel.fillGround({ ...(m.groundOptions?.(p, rect) || {}), ...ground }, { rect, avoid, margin: 0.6 })
  }
  return rects
}

/**
 * A bordered frame around a field (fangding walls: a plain centre framed by
 * kui friezes, or by rows of bosses). Returns the inner field rect.
 *   width   band width (mm) — number, or { t, b, l, r }
 *   top / bottom   a frieze opts object (default: a kui pair facing the centre), or 'plain' | 'bosses'
 *   sides  'kui' (vertical kui, heads toward `sideHeads` 'up'|'down') | 'bosses' | 'plain'
 *   line   raised border line around the outside and the field (default true)
 *   bosses { radius, height, spacing, rows } for the boss variant (§4.5 fangding U-frame)
 */
export function frame(panel, rect, { width = 20, top, bottom, sides = 'kui', sideHeads = 'down', line = true, lineWidth = 1.4, lineHeight = 0.7, params = {}, preset, bosses = {}, ground = {} } = {}) {
  const W = typeof width === 'number' ? { t: width, b: width, l: width, r: width } : { t: 20, b: 20, l: 20, r: 20, ...width }
  const inner = { x: rect.x + W.l, y: rect.y + W.b, w: rect.w - W.l - W.r, h: rect.h - W.t - W.b }
  const band = (spec, r) => {
    if (spec === 'plain') return
    if (spec === 'bosses') return bossField(panel, r, bosses)
    frieze(panel, r, { unit: 'kui', count: 2, facing: 'centre', params, preset, ground, ...(spec || {}) })
  }
  const pad = line ? lineWidth * 1.4 : 0
  if (W.t) band(top, { x: inner.x, y: inner.y + inner.h + pad * 0.5, w: inner.w, h: W.t - pad })
  if (W.b) band(bottom ?? top, { x: inner.x, y: rect.y + pad * 0.5, w: inner.w, h: W.b - pad })
  for (const side of ['l', 'r']) {
    if (!W[side]) continue
    const r = side === 'l'
      ? { x: rect.x + pad * 0.5, y: rect.y + pad * 0.5, w: W.l - pad, h: rect.h - pad }
      : { x: rect.x + rect.w - W.r + pad * 0.5, y: rect.y + pad * 0.5, w: W.r - pad, h: rect.h - pad }
    if (sides === 'plain') continue
    if (sides === 'bosses') { bossField(panel, r, bosses); continue }
    drawMotif(panel, 'kui', r, { ...params, arrangement: 'single', orient: sideHeads, facing: side === 'l' ? 'right' : 'left' }, { preset, ground })
  }
  if (line) {
    borderLine(panel, rect, { width: lineWidth, height: lineHeight, sides: 'tblr' })
    borderLine(panel, inner, { width: lineWidth, height: lineHeight, sides: 'tblr' })
  }
  return inner
}

/** Free nipples (乳钉) on a grid filling rect — the fangding U-frame variant (§4.5). */
export function bossField(panel, rect, { radius, height, spacing, rows } = {}) {
  const short = Math.min(rect.w, rect.h)
  const n = rows ?? Math.max(1, Math.round(short / (spacing ?? short)))
  const sp = spacing ?? short / n
  const r = radius ?? sp * 0.28
  const h = height ?? r * 0.9
  const nx = Math.max(1, Math.floor(rect.w / sp)), ny = Math.max(1, Math.floor(rect.h / sp))
  const dx = rect.w / nx, dy = rect.h / ny
  panel.raise((ctx) => {
    for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
      ctx.beginPath()
      ctx.arc(rect.x + (i + 0.5) * dx, rect.y + (j + 0.5) * dy, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }, { height: h, profile: (s, w) => Math.pow(Math.min(1, s / w), 0.8), shoulder: r })
}

// --------------------------------------------------------------- small utilities

/** Stack named registers bottom-up: [{ name, h }] (mm) → { name: rect }. */
export function registers(rect, spec) {
  const out = {}
  let y = rect.y
  for (const r of spec) {
    out[r.name] = { x: rect.x, y, w: rect.w, h: r.h }
    y += r.h
  }
  return out
}

/** Inset a rect by mm (number or {l,r,t,b}). */
export function inset(rect, m) {
  const o = typeof m === 'number' ? { l: m, r: m, t: m, b: m } : { l: 0, r: 0, t: 0, b: 0, ...m }
  return { x: rect.x + o.l, y: rect.y + o.b, w: rect.w - o.l - o.r, h: rect.h - o.t - o.b }
}

/**
 * A row of bosses ("nipples", rupi) from a to b. Shang fangding frame their
 * walls with these, cast as hemispheres standing proud of the ground.
 */
export function bossRow(panel, a, b, { count, radius = 4, height = 3 } = {}) {
  const n = count ?? Math.max(1, Math.floor(Math.hypot(b[0] - a[0], b[1] - a[1]) / (radius * 3)))
  panel.raise((ctx) => {
    for (let i = 0; i < n; i++) {
      const t = n === 1 ? 0.5 : (i + 0.5) / n
      ctx.beginPath()
      ctx.arc(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }, { height, profile: 'dome' })
}

/** A raised border line around (or along one side of) a rect. Thread relief framing a register. */
export function borderLine(panel, rect, { width = 1.2, height = 0.6, sides = 'tb' } = {}) {
  panel.raise((ctx) => {
    ctx.lineWidth = width
    ctx.lineCap = 'butt'
    ctx.beginPath()
    if (sides.includes('b')) { ctx.moveTo(rect.x, rect.y); ctx.lineTo(rect.x + rect.w, rect.y) }
    if (sides.includes('t')) { ctx.moveTo(rect.x, rect.y + rect.h); ctx.lineTo(rect.x + rect.w, rect.y + rect.h) }
    if (sides.includes('l')) { ctx.moveTo(rect.x, rect.y); ctx.lineTo(rect.x, rect.y + rect.h) }
    if (sides.includes('r')) { ctx.moveTo(rect.x + rect.w, rect.y); ctx.lineTo(rect.x + rect.w, rect.y + rect.h) }
    ctx.stroke()
  }, { height, profile: 'ridge' })
}
