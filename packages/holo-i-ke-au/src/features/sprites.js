// The battle's figures as pixel art (DESIGN.md §8, the tone rule): small
// people of 8 by 16 pixels, drawn here as rows of palette letters and put
// together into one sheet when the district is built (features/soldiers.js
// draws them, a whole number of screen pixels to each of these).
//
// Each figure is drawn once, facing right (the shader mirrors it to face
// left), as a body and what it carries: a warrior with an ihe, the spear; one
// with a club; one with a musket (both sides had some in 1795, Kamehameha's
// more); and the two who serve Kamehameha's field piece, one with the
// rammer and one with the linstock, beside the piece itself. Each has a walk
// of four frames, a run of four, a stand of two and an engage of three: the
// thrust, the swing, the musket levelled and fired with one frame of flash,
// the ramming, the match put to the touch-hole, and the piece's own flash and
// smoke. Nobody falls and nobody bleeds; there is no frame for it.
//
// The sides are told apart by dress, by palette: the malo and the kīhei in
// the colours the app gives each side (Hawaiʻi amber, Oʻahu violet, Maui
// rust; none of them blue, which on this ground reads as water), and their
// chiefs in feather cloak and helmet, Hawaiʻi's red and yellow, Oʻahu's
// yellow and black, Maui's red and black. Skin, hair and wood are the app's
// muted earth tones, and every body has a dark outline worked out here, so a
// figure holds up against the ground at two pixels to the pixel.

export const SPRITE_W = 8
export const SPRITE_H = 16

/** The four animations, each a run of frames in a row of the sheet: [first, count]. */
export const ANIM = { walk: [0, 4], run: [4, 4], idle: [8, 2], engage: [10, 3] }
export const FRAMES = 13

export const SIDES = ['hawaii', 'oahu', 'maui']
export const DRESS = ['bare', 'kihei', 'chief']
export const KINDS = ['spear', 'club', 'musket', 'rammer', 'linstock', 'gun']

// --- the palette letters ----------------------------------------------------------
//
//   .  nothing          o  outline (added round every body, never drawn by hand)
//   h  hair / helmet    H  the helmet's crest (a chief's only)
//   s  skin             d  skin in shade        e  the eye
//   t  chest            T  chest in shade       (a chief's cloak and its pattern)
//   k  kīhei on the body                        K  kīhei hanging free behind
//   C  a cloak's hem (a chief's only)
//   m  malo             n  malo in shade
//   w  wood             W  dark wood (spear point, club head, stock, carriage)
//   g  iron, lit        G  iron
//   f  flash, white     F  flash, orange; the match's glow
//   S  smoke            Z  smoke in shade
const BODY = 'hHsdetTkKCmn'
const GUN_BODY = 'gGwW'

const EARTH = {
  o: '#2a201b',
  h: '#30241e',
  s: '#a5704b',
  d: '#7b5035',
  e: '#2a201b',
  w: '#97734a',
  W: '#5b3d27',
  g: '#7d8186',
  G: '#4a4d52',
  f: '#fff4c4',
  F: '#f2a03c',
  S: '#ddd6ca',
  Z: '#b5ad9f',
}

// each side's dress: malo, its shade, the kīhei, and a chief's cloak, its pattern and the crest
const SIDE_DRESS = {
  hawaii: { m: '#b9791f', n: '#8a5717', kihei: '#d9a548', cloak: '#b03a2c', pattern: '#e3b23e', helmet: '#e3b23e', crest: '#b03a2c' },
  oahu: { m: '#76609e', n: '#544377', kihei: '#a58fcb', cloak: '#dcb03c', pattern: '#2e2824', helmet: '#2e2824', crest: '#dcb03c' },
  maui: { m: '#a84b22', n: '#7c3518', kihei: '#cf7f4c', cloak: '#a4342a', pattern: '#2e2824', helmet: '#a4342a', crest: '#2e2824' },
}

/** The colours of side × dress, by palette letter (null: nothing drawn). */
export function palette(side, dress) {
  const S = SIDE_DRESS[side]
  const p = { ...EARTH, m: S.m, n: S.n, t: EARTH.s, T: EARTH.d, k: EARTH.s, K: null, C: null, H: null }
  if (dress === 'kihei') {
    p.k = S.kihei
    p.K = S.kihei
  } else if (dress === 'chief') {
    p.t = S.cloak
    p.T = S.pattern
    p.k = S.cloak
    p.K = S.cloak
    p.C = S.cloak
    p.h = S.helmet
    p.H = S.crest
  }
  return p
}

// --- drawing by parts -------------------------------------------------------------
//
// A frame is the body (a head, a chest with its arm, and legs) with what it
// carries laid over it, and sometimes under it. Parts are sparse: { row: '8 letters' }.

const blank = (w = SPRITE_W) => Array.from({ length: SPRITE_H }, () => '.'.repeat(w))
/** Lay parts over each other, later over earlier; '.' leaves what is under it. */
function lay(w, ...parts) {
  const g = blank(w).map((r) => r.split(''))
  for (const part of parts) {
    if (!part) continue
    for (const [row, str] of Object.entries(part)) {
      for (let x = 0; x < str.length; x++) if (str[x] !== '.') g[row][x] = str[x]
    }
  }
  return g.map((r) => r.join(''))
}
/** A part moved right by dx and down by dy (any width). */
function shift(part, dx = 0, dy = 0) {
  const out = {}
  for (const [row, str] of Object.entries(part)) {
    const r = Number(row) + dy
    if (r < 0 || r >= SPRITE_H) continue
    out[r] = dx >= 0 ? '.'.repeat(dx) + str.slice(0, str.length - dx) : str.slice(-dx) + '.'.repeat(-dx)
  }
  return out
}
/** A frame: under (drawn behind the body), the body's parts, over (in front). */
const frame = (body, over = null, under = null) => ({ body: lay(SPRITE_W, ...body), over: over && lay(SPRITE_W, over), under: under && lay(SPRITE_W, under) })

// heads: upright, and leaning into a run
const HEAD = { 0: '..HHH...', 1: '..hhh...', 2: '..hse...', 3: '..sss...', 4: '...d....' }
const HEAD_LEAN = shift(HEAD, 1)

// chests (the back edge K is the kīhei hanging free, or a cloak's fall)
const CHEST = { 5: '.Kktt...', 6: '.Kktt...', 7: '.KktT...', 8: '.CkTt...' }
const CHEST_LEAN = shift(CHEST, 1)
// the near arm: hanging, its hand at the hip; bent, the hand at the chest; reaching out; drawn back; raised
const ARM_DOWN = { 5: '.....s..', 6: '.....s..', 7: '.....s..' }
const ARM_GRIP = { 5: '.....s..', 6: '.....s..' }
const ARM_OUT = { 5: '....ss..', 6: '......s.' }
const ARM_BACK = { 5: '....s...', 6: '...ss...' }
const ARM_UP = { 1: '....s...', 2: '.....s..', 3: '.....s..', 4: '....s...' }

// legs, from the malo down (row 15 is left for the outline under the feet); the
// malo's flap hangs between them, and a chief's cloak falls behind (C)
const MALO = { 9: '.Cmmn...' }
const STAND = { ...MALO, 10: '.Cdns...', 11: '..d.s...', 12: '..d.s...', 13: '..d.s...', 14: '..ddss..' }
const WALK = [
  { ...MALO, 10: '.Cdns...', 11: '..d..s..', 12: '.d...s..', 13: '.d...s..', 14: '.d...ss.' },
  { ...MALO, 10: '.C.dn...', 11: '...ds...', 12: '...ds...', 13: '...dss..', 14: '...dd...' },
  { ...MALO, 10: '.Csnd...', 11: '..s..d..', 12: '.s...d..', 13: '.s...d..', 14: '.s...dd.' },
  { ...MALO, 10: '.C.sn...', 11: '...sd...', 12: '...sd...', 13: '...sdd..', 14: '...ss...' },
]
const MALO_LEAN = shift(MALO, 1)
const RUN = [
  { ...MALO_LEAN, 10: '..Cdns..', 11: '..d...s.', 12: '.d....s.', 13: 'd.....s.', 14: '......ss' },
  { ...MALO_LEAN, 10: '..C.dn..', 11: '...dss..', 12: '...d..s.', 13: '..dd....', 14: '........' },
  { ...MALO_LEAN, 10: '..Csnd..', 11: '..s...d.', 12: '.s....d.', 13: 's.....d.', 14: '......dd' },
  { ...MALO_LEAN, 10: '..C.sn..', 11: '...sdd..', 12: '...s..d.', 13: '..ss....', 14: '........' },
]
// a fighting stance, and the lunge of a blow
const BRACE = { ...MALO, 10: '.Cdns...', 11: '..d..s..', 12: '.d...s..', 13: '.d...s..', 14: '.dd..ss.' }
const LUNGE = { ...MALO_LEAN, 10: '..Cdns..', 11: '..d...s.', 12: '.d....s.', 13: '.d.....s', 14: 'dd.....s' }

const over = (rows) => rows

// --- the warrior with an ihe ------------------------------------------------------------
const spearUp = (top, bottom) => {
  const p = {}
  for (let r = top; r <= bottom; r++) p[r] = '......w.'
  p[top] = '......W.'
  return p
}
const SPEAR_LEVEL = (x0, x1, row) => ({ [row]: '.'.repeat(x0) + 'w'.repeat(x1 - x0) + 'W' + '.'.repeat(Math.max(0, 7 - x1)) })
const spear = [
  // walk: carried upright, clear of the feet
  ...WALK.map((legs) => frame([HEAD, CHEST, ARM_DOWN, legs], spearUp(0, 10))),
  // run: levelled at the hip, the point ahead
  ...RUN.map((legs) => frame([HEAD_LEAN, CHEST_LEAN, shift(ARM_DOWN, 1), legs], over({ 8: 'wwwwwwwW' }))),
  // stand: the butt on the ground, the point leaning a little and back
  frame([HEAD, CHEST, ARM_DOWN, STAND], spearUp(0, 14)),
  frame([HEAD, CHEST, ARM_GRIP, STAND], { ...spearUp(1, 14), 0: '.......W', 1: '......w.' }),
  // engage: drawn back, thrust, recovered
  frame([HEAD, CHEST, ARM_BACK, BRACE], SPEAR_LEVEL(0, 4, 6)),
  frame([HEAD_LEAN, CHEST_LEAN, ARM_OUT, LUNGE], SPEAR_LEVEL(2, 7, 6)),
  frame([HEAD, CHEST, ARM_GRIP, BRACE], over({ 1: '.......W', 2: '......w.', 3: '......w.', 4: '.....w..', 5: '.....w..', 6: '....w...', 7: '....w...' })),
]

// --- the warrior with a club --------------------------------------------------------------
const club = [
  // walk: on the shoulder, its head behind
  ...WALK.map((legs) => frame([HEAD, CHEST, ARM_GRIP, legs], over({ 5: 'WWwwww..' }))),
  // run: held up before him
  ...RUN.map((legs) => frame([HEAD_LEAN, CHEST_LEAN, shift(ARM_GRIP, 1), legs], over({ 1: '......WW', 2: '......WW', 3: '......w.', 4: '......w.', 5: '......w.' }))),
  // stand: hanging from the hand, a little swung
  frame([HEAD, CHEST, ARM_DOWN, STAND], over({ 7: '......w.', 8: '......w.', 9: '......WW', 10: '......WW' })),
  frame([HEAD, CHEST, ARM_DOWN, STAND], over({ 7: '......w.', 8: '......w.', 9: '.....WW.', 10: '.....WW.' })),
  // engage: raised behind the head, brought down, followed through
  frame([HEAD, CHEST, ARM_UP, BRACE], null, { 0: 'WWwww...', 1: 'WW......' }),
  frame([HEAD_LEAN, CHEST_LEAN, ARM_OUT, LUNGE], over({ 6: '.......w', 7: '......WW', 8: '......WW' })),
  frame([HEAD_LEAN, CHEST_LEAN, shift(ARM_DOWN, 1), BRACE], over({ 8: '......w.', 9: '......w.', 10: '.....WW.', 11: '.....WW.' })),
]

// --- the warrior with a musket ---------------------------------------------------------
const musketUp = (top) => {
  const p = {}
  for (let r = top; r < top + 6; r++) p[r] = '......G.'
  p[top] = '......g.'
  for (let r = top + 6; r <= 14; r++) p[r] = '......W.'
  return p
}
const musket = [
  // walk: sloped on the shoulder, the barrel up behind the head
  ...WALK.map((legs) => frame([HEAD, CHEST, ARM_GRIP, legs], over({ 6: '.....W..', 7: '.....WW.' }), { 0: '.g......', 1: '.G......', 2: '.G......', 3: '..G.....', 4: '..G.....', 5: '...G....', 6: '....G...' })),
  // run: carried across the body
  ...RUN.map((legs) => frame([HEAD_LEAN, CHEST_LEAN, shift(ARM_GRIP, 1), legs], over({ 1: '.......g', 2: '......G.', 3: '......G.', 4: '.....G..', 5: '.....W..', 6: '....W...', 7: '...W....' }))),
  // stand: grounded beside the foot
  frame([HEAD, CHEST, ARM_GRIP, STAND], musketUp(3)),
  frame([HEAD, CHEST, ARM_DOWN, STAND], musketUp(3)),
  // engage: levelled at the shoulder; fired (it kicks back a pixel, and the flash); lowered in its smoke
  frame([HEAD, CHEST, ARM_OUT, BRACE], over({ 4: '..WWGGGg' })),
  frame([HEAD, CHEST, shift(ARM_OUT, -1), BRACE], over({ 3: '.......F', 4: '.WWGGGgf', 5: '.......F' })),
  frame([HEAD, CHEST, ARM_GRIP, BRACE], over({ 0: '......SS', 1: '.....SSZ', 2: '......Z.', 5: '.....W..', 6: '......G.', 7: '......G.' }), { 2: '.......g' }),
]

// --- the field piece's crew: the rammer and the linstock ---------------------------------
const rammerUp = (top, bottom) => {
  const p = {}
  for (let r = top; r <= bottom; r++) p[r] = '......w.'
  p[top] = '.....WW.'
  return p
}
const rammer = [
  ...WALK.map((legs) => frame([HEAD, CHEST, ARM_DOWN, legs], rammerUp(0, 10))),
  ...RUN.map((legs) => frame([HEAD_LEAN, CHEST_LEAN, shift(ARM_DOWN, 1), legs], over({ 7: 'wwwwwwWW' }))),
  frame([HEAD, CHEST, ARM_DOWN, STAND], rammerUp(0, 14)),
  frame([HEAD, CHEST, ARM_GRIP, STAND], rammerUp(1, 14)),
  // engage: the rammer run into the muzzle, pushed home, drawn out
  frame([HEAD, CHEST, ARM_OUT, BRACE], over({ 6: '..wwwwWW' })),
  frame([HEAD_LEAN, CHEST_LEAN, ARM_OUT, LUNGE], over({ 6: '...wwwwW' })),
  frame([HEAD, CHEST, ARM_BACK, BRACE], over({ 6: 'wwwwwW..' })),
]
const linstockUp = (top, bottom) => {
  const p = {}
  for (let r = top; r <= bottom; r++) p[r] = '......w.'
  p[top] = '......F.'
  return p
}
const linstock = [
  ...WALK.map((legs) => frame([HEAD, CHEST, ARM_DOWN, legs], linstockUp(0, 10))),
  ...RUN.map((legs) => frame([HEAD_LEAN, CHEST_LEAN, shift(ARM_DOWN, 1), legs], over({ 4: '.......F', 5: '......w.', 6: '.....w..', 7: '....w...', 8: '...w....' }))),
  frame([HEAD, CHEST, ARM_DOWN, STAND], linstockUp(0, 14)),
  frame([HEAD, CHEST, ARM_DOWN, STAND], { ...linstockUp(1, 14), 0: '......f.' }),
  // engage: the match brought down toward the touch-hole, put to it, lifted clear
  frame([HEAD, CHEST, ARM_OUT, BRACE], over({ 7: '......w.', 8: '......w.', 9: '.......w', 10: '.......F' })),
  frame([HEAD_LEAN, CHEST_LEAN, ARM_OUT, LUNGE], over({ 7: '.......w', 8: '.......w', 9: '.......w', 10: '.......w', 11: '.......f' })),
  frame([HEAD, CHEST, ARM_GRIP, BRACE], linstockUp(0, 9)),
]

// --- the field piece (16 wide): a small gun on a two-wheeled carriage, its near
// wheel in front of the barrel, the trail down behind ----------------------------------
const GW = 16
const PIECE = {
  9: '....gggggggggg..',
  10: '..GGGGWWWGGGGG..',
  11: '...WWW.w.W...G..',
  12: '..WW.WwwwW......',
  13: '.WW..W.w.W......',
  14: 'WW....WWW.......',
}
const pieceFrame = (extra = null, dx = 0) => ({ body: lay(GW, shift(PIECE, dx)), over: extra && lay(GW, extra), under: null })
const gun = [
  ...Array.from({ length: 10 }, () => pieceFrame()),
  // engage: fired (the flash), kicked back in its smoke, the smoke drifting off
  pieceFrame({ 8: '..............F.', 9: '..............fF', 10: '..............ff', 11: '..............F.' }),
  pieceFrame({ 6: '............SS..', 7: '...........SSSS.', 8: '..........SSSZS.', 9: '...........ZSS..', 10: '............Z...' }, -1),
  pieceFrame({ 3: '...........SS...', 4: '..........SZSS..', 5: '...........ZS...' }),
]

export const ART = { spear, club, musket, rammer, linstock, gun }
const WIDTH = { gun: GW }

/** What each kind carries is drawn for these dresses only (the rest of the sheet would be empty). */
function rowsWanted() {
  const rows = []
  for (const side of SIDES) {
    for (const dress of ['bare', 'kihei']) for (const kind of ['spear', 'club', 'musket']) rows.push({ kind, side, dress })
    rows.push({ kind: 'spear', side, dress: 'chief' })
  }
  rows.push({ kind: 'rammer', side: 'hawaii', dress: 'bare' }, { kind: 'linstock', side: 'hawaii', dress: 'kihei' }, { kind: 'gun', side: 'hawaii', dress: 'bare' })
  return rows
}

export const GLOW = 200
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]

/** One frame in colour: RGBA rows, with the outline worked out round the body. */
function paint(fr, w, pal, outlined) {
  const at = (rows, x, y) => (rows && y >= 0 && y < SPRITE_H && x >= 0 && x < w ? rows[y][x] : '.')
  const solid = (x, y) => {
    const c = at(fr.body, x, y)
    return c !== '.' && outlined.includes(c) && pal[c] !== null
  }
  const px = new Uint8Array(w * SPRITE_H * 4)
  // (a flash and a match's glow are marked with a lower alpha: the shader draws them as their own light)
  const put = (x, y, c) => {
    const col = pal[c]
    if (!col) return
    px.set([...hex(col), c === 'f' || c === 'F' ? GLOW : 255], (y * w + x) * 4)
  }
  for (let y = 0; y < SPRITE_H; y++) {
    for (let x = 0; x < w; x++) {
      put(x, y, at(fr.under, x, y))
      if (!solid(x, y) && (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1))) put(x, y, 'o')
      const c = at(fr.body, x, y)
      if (c !== '.' && pal[c] !== null) put(x, y, c)
      put(x, y, at(fr.over, x, y))
    }
  }
  return px
}

/**
 * The sheet: every row a kind in one side's dress, its 13 frames across.
 * { width, height, data (RGBA, row 0 at the top), rows, cell(kind, side,
 * dress, anim, frame) → [x, y, w, h] in sheet pixels }.
 */
export function buildSheet() {
  const rows = rowsWanted()
  const width = FRAMES * 16
  const height = rows.length * SPRITE_H
  const data = new Uint8Array(width * height * 4)
  const index = new Map()
  rows.forEach((r, ri) => {
    const w = WIDTH[r.kind] || SPRITE_W
    const pal = palette(r.side, r.dress)
    const outlined = r.kind === 'gun' ? GUN_BODY : BODY
    ART[r.kind].forEach((fr, fi) => {
      const px = paint(fr, w, pal, outlined)
      for (let y = 0; y < SPRITE_H; y++) data.set(px.subarray(y * w * 4, (y + 1) * w * 4), ((ri * SPRITE_H + y) * width + fi * w) * 4)
    })
    index.set(`${r.kind}/${r.side}/${r.dress}`, { y: ri * SPRITE_H, w })
  })
  const cell = (kind, side, dress, anim, f) => {
    const row = index.get(`${kind}/${side}/${dress}`) || index.get(`${kind}/${side}/bare`) || index.get(`${kind}/hawaii/bare`) || index.get(`${kind}/hawaii/kihei`)
    const [first, n] = ANIM[anim]
    return [(first + (f % n)) * row.w, row.y, row.w, SPRITE_H]
  }
  return { width, height, data, rows, cell, has: (kind, side, dress) => index.has(`${kind}/${side}/${dress}`) }
}
