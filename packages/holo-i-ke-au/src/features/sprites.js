// The battle's figures as pixel art (DESIGN.md §8, the tone rule): small
// people of 8 by 16 pixels, drawn here as rows of palette letters and put
// together into one sheet when the district is built (features/soldiers.js
// draws them, a whole number of screen pixels to each of these).
//
// Each figure is drawn three ways: from the side, facing right (the shader
// mirrors it to face left), from the front and from behind, so a figure
// faces the way it moves or aims as the camera sees it, and a retreat up the
// valley is seen from behind. What each carries follows the record
// (RESEARCH.md §12): the ihe, the spear; the club; the sling, whirled and let
// go, its stone flying a few pixels; the pāhoa, the dagger of the close
// fight; the musket, levelled and fired with one frame of flash; and the two
// who serve Kamehameha's field piece, one with the rammer and one with the
// linstock, beside the piece itself, which has a side, a muzzle and a breech
// of its own: from the front the muzzle and its flash, from behind the
// carriage and the trail. Each figure has, in each facing, a walk of four
// frames, a run of four, a stand of two, an engage of four (the thrust, the
// swing, the stab, the whirl and the throw, the musket and the gun fired, the
// ramming, the match put to the touch-hole) and a leap of three: the jump and
// a tumble of two frames, for the pali. Nobody bleeds and nobody lies on the
// ground; there is no frame for it.
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

/** The five animations, each a run of frames within a facing: [first, count]. */
export const ANIM = { walk: [0, 4], run: [4, 4], idle: [8, 2], engage: [10, 4], fall: [14, 3] }
export const FRAMES = 17
/** The facings drawn, each a block of FRAMES cells across the sheet (left is right mirrored). */
export const FACINGS = ['side', 'front', 'back']

export const SIDES = ['hawaii', 'oahu', 'maui']
export const DRESS = ['bare', 'kihei', 'chief']
export const KINDS = ['spear', 'club', 'musket', 'sling', 'dagger', 'rammer', 'linstock', 'gun']
/** Cells wider than a figure: the field piece, and the slinger, whose stone flies clear of him. */
export const WIDTH = { gun: 16, sling: 16 }

// --- the palette letters ----------------------------------------------------------
//
//   .  nothing          o  outline (added round every body, never drawn by hand)
//   h  hair / helmet    H  the helmet's crest (a chief's only)
//   s  skin             d  skin in shade        e  the eye
//   t  chest            T  chest in shade       (a chief's cloak and its pattern)
//   k  kīhei on the body                        K  kīhei hanging free behind
//   C  a cloak (a chief's only)                 P  the cloak's pattern (a chief's only)
//   m  malo             n  malo in shade
//   w  wood             W  dark wood (spear point, club head, stock, carriage)
//   g  iron, lit; a stone                       G  iron            b  the bore
//   c  cord (the sling)
//   f  flash, white     F  flash, orange; the match's glow
//   S  smoke            Z  smoke in shade
const BODY = 'hHsdetTkKCPmn'
const GUN_BODY = 'gGwWb'

const EARTH = {
  o: '#2a201b',
  h: '#30241e',
  s: '#a5704b',
  d: '#7b5035',
  e: '#2a201b',
  w: '#97734a',
  W: '#5b3d27',
  g: '#8a8e93',
  G: '#4a4d52',
  b: '#16110e',
  c: '#cdb98e',
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

/** The colours of side × dress, by palette letter (null: nothing drawn, and what is under it shows). */
export function palette(side, dress) {
  const S = SIDE_DRESS[side]
  const p = { ...EARTH, m: S.m, n: S.n, t: EARTH.s, T: EARTH.d, k: EARTH.s, K: null, C: null, P: null, H: null }
  if (dress === 'kihei') {
    p.k = S.kihei
    p.K = S.kihei
  } else if (dress === 'chief') {
    p.t = S.cloak
    p.T = S.pattern
    p.k = S.cloak
    p.K = S.cloak
    p.C = S.cloak
    p.P = S.pattern
    p.h = S.helmet
    p.H = S.crest
  }
  return p
}

// --- drawing by parts -------------------------------------------------------------
//
// A frame is a body (a head, a chest, the arms, the legs: parts laid one over
// another, the later over the earlier, a letter with no colour in a dress
// letting the one under it show) with what it carries laid over it, and
// sometimes under it. Parts are sparse: { row: 'letters' }, '.' for nothing.

/** A part moved right by dx and down by dy (strings grow; the cell clips them). */
function at(part, dx = 0, dy = 0) {
  const out = {}
  for (const [row, str] of Object.entries(part)) {
    const r = Number(row) + dy
    if (r < 0 || r >= SPRITE_H) continue
    out[r] = dx >= 0 ? '.'.repeat(dx) + str : str.slice(-dx)
  }
  return out
}
/** Parts laid into one, later over earlier. */
function merge(...parts) {
  const out = {}
  for (const part of parts) {
    if (!part) continue
    for (const [row, str] of Object.entries(part)) {
      const cur = (out[row] || '').padEnd(str.length, '.').split('')
      for (let x = 0; x < str.length; x++) if (str[x] !== '.') cur[x] = str[x]
      out[row] = cur.join('')
    }
  }
  return out
}
/** A frame: the body's parts, what is carried over it and under it. */
const frame = (body, over = null, under = null) => ({ body, over: over ? [over] : [], under: under ? [under] : [] })

// ===================================================================================
// The side, facing right
// ===================================================================================

const HEAD = { 0: '..HHH...', 1: '..hhh...', 2: '..hse...', 3: '..sss...', 4: '...d....' }
const HEAD_LEAN = at(HEAD, 1)
// (the back edge K is the kīhei hanging free, or a cloak's fall)
const CHEST = { 5: '.Kktt...', 6: '.Kktt...', 7: '.KktT...', 8: '.CkTt...' }
const CHEST_LEAN = at(CHEST, 1)
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
const MALO_LEAN = at(MALO, 1)
const RUN = [
  { ...MALO_LEAN, 10: '..Cdns..', 11: '..d...s.', 12: '.d....s.', 13: 'd.....s.', 14: '......ss' },
  { ...MALO_LEAN, 10: '..C.dn..', 11: '...dss..', 12: '...d..s.', 13: '..dd....', 14: '........' },
  { ...MALO_LEAN, 10: '..Csnd..', 11: '..s...d.', 12: '.s....d.', 13: 's.....d.', 14: '......dd' },
  { ...MALO_LEAN, 10: '..C.sn..', 11: '...sdd..', 12: '...s..d.', 13: '..ss....', 14: '........' },
]
// a fighting stance, and the lunge of a blow
const BRACE = { ...MALO, 10: '.Cdns...', 11: '..d..s..', 12: '.d...s..', 13: '.d...s..', 14: '.dd..ss.' }
const LUNGE = { ...MALO_LEAN, 10: '..Cdns..', 11: '..d...s.', 12: '.d....s.', 13: '.d.....s', 14: 'dd.....s' }
// the leap: off the edge with the arms flung up and forward, the legs trailing
const ARM_FLUNG = { 1: '......s.', 2: '......s.', 3: '.....s..', 4: '.....s..' }
const LEGS_LEAP = { 9: '..Cmmn..', 10: '..Cdns..', 11: '.dd...s.', 12: 'd.....s.', 13: '.....s..' }

// the tumble: a body curled on itself (8 by 8), turned a quarter and a half
const TUCK = {
  side: ['........', '...hhh..', '...hse..', '.Kktsss.', '.KktTds.', '.Cmmdds.', '...ddss.', '........'],
  front: ['........', '..hhhh..', '..sees..', '.sktTks.', '.sddsss.', '..mmmm..', '..dssd..', '........'],
  back: ['........', '..hhhh..', '..hhhh..', '.skkTts.', '.sCCCCs.', '..mmmm..', '..dssd..', '........'],
}
/** A curled body turned by quarter turns, set in the middle of the cell. */
function tumble(rows, q) {
  let g = rows.map((r) => r.split(''))
  for (let i = 0; i < q; i++) g = g[0].map((_, x) => g.map((row) => row[x]).reverse())
  const part = {}
  g.forEach((row, y) => (part[y + 5] = row.join('')))
  return part
}

// ===================================================================================
// The front, toward the eye (the weapon hand on the left of the screen)
// ===================================================================================

const HEAD_F = { 0: '...HH...', 1: '..hhhh..', 2: '..hssh..', 3: '..ssss..', 4: '...dd...' }
const CHEST_F = { 5: '..kktt..', 6: '..tkkT..', 7: '..ttkk..', 8: '..tTTt..' }
// a chief's cloak over the shoulders, open in front
const CLOAK_F = { 5: '.CC..CC.', 6: '.CP..PC.', 7: '.CC..CC.', 8: '.CC..CC.', 9: '.C....C.', 10: '.C....C.' }
const ARMS_F = { 5: '.s....s.', 6: '.s....s.', 7: '.s....s.' }
const FREE_F = { 5: '......s.', 6: '......s.', 7: '......s.' }
const GRIP_F = { 5: '.s......', 6: '.s......' }
const UP_F = { 1: '.s......', 2: '.s......', 3: '.s......', 4: '.s......' }
const FWD_F = { 5: '.s......', 6: '..s.....' }
const BOTH_FWD_F = { 5: '.s....s.', 6: '..s..s..' }
// legs from the front and from behind: the thighs together, shaded where they meet, the shins apart
const legs = (malo, rows) => ({ 9: '..mmmm..', 10: malo, ...rows })
const STAND_L = { 11: '..sdds..', 12: '..sdds..', 13: '..s..s..', 14: '.ss..ss.' }
const WALK_L = [
  { 11: '..sdds..', 12: '..s.ss..', 13: '..s.ss..', 14: '.ss.....' },
  STAND_L,
  { 11: '..sdds..', 12: '..ss.s..', 13: '..ss.s..', 14: '.....ss.' },
  STAND_L,
]
const RUN_L = [
  { 11: '..sdds..', 12: '..s.ss..', 13: '..s.....', 14: '.ss.....' },
  { 11: '..sdds..', 12: '.s....s.', 13: '.s....s.', 14: '........' },
  { 11: '..sdds..', 12: '..ss.s..', 13: '.....s..', 14: '.....ss.' },
  { 11: '..sdds..', 12: '.s....s.', 13: '.s....s.', 14: '........' },
]
const BRACE_L = { 11: '..sdds..', 12: '.sd..ds.', 13: '.s....s.', 14: 'ss....ss' }
const LEAP_L = { 11: '.sd..ds.', 12: 's......s', 13: '........' }
const STAND_F = legs('..smnd..', STAND_L)
const WALK_F = WALK_L.map((l) => legs('..smnd..', l))
const RUN_F = RUN_L.map((l) => legs('..smnd..', l))
const PUMP_F = [
  { 5: '.s....s.', 6: '.s.....s' },
  { 5: '.s....s.', 6: '.s....s.' },
  { 5: '.s....s.', 6: 's.....s.' },
  { 5: '.s....s.', 6: '.s....s.' },
]
const BRACE_F = legs('..smnd..', BRACE_L)
const LEAP_F = legs('..smnd..', LEAP_L)
const FLUNG_F = { 1: 's......s', 2: 's......s', 3: '.s....s.', 4: '.s....s.' }

// ===================================================================================
// The back, away from the eye (the weapon hand on the right of the screen)
// ===================================================================================

const HEAD_B = { 0: '...HH...', 1: '..hhhh..', 2: '..hhhh..', 3: '..hhhh..', 4: '...dd...' }
const CHEST_B = { 5: '..tttt..', 6: '..tTTt..', 7: '..tTTt..', 8: '..tttt..' }
// the kīhei across the back from one shoulder (for the bare, skin); a chief's cloak to the knees
const KIHEI_B = { 5: '..kkk...', 6: '..kkkk..', 7: '...kkk..', 8: '....kk..' }
const CLOAK_B = { 5: '.CCCCCC.', 6: '.CPCCPC.', 7: '.CCPPCC.', 8: '.CPCCPC.', 9: '.CCCCCC.', 10: '..CCCC..' }
const ARMS_B = { 5: '.s....s.', 6: '.s....s.', 7: '.s....s.' }
const FREE_B = { 5: '.s......', 6: '.s......', 7: '.s......' }
const GRIP_B = { 5: '......s.', 6: '......s.' }
const UP_B = { 1: '......s.', 2: '......s.', 3: '......s.', 4: '......s.' }
// reaching forward, away from the eye: the hand goes up the screen past the shoulder
const FWD_B = { 3: '......s.', 4: '......s.', 5: '......s.' }
const BACK_B = { 5: '......s.', 6: '.......s', 7: '.......s' }
const BOTH_FWD_B = { 3: '.s....s.', 4: '.s....s.', 5: '.s....s.' }
const STAND_B = legs('..dnms..', STAND_L)
const WALK_B = WALK_L.map((l) => legs('..dnms..', l))
const RUN_B = RUN_L.map((l) => legs('..dnms..', l))
const PUMP_B = [
  { 5: '.s....s.', 6: 's.....s.' },
  { 5: '.s....s.', 6: '.s....s.' },
  { 5: '.s....s.', 6: '.s.....s' },
  { 5: '.s....s.', 6: '.s....s.' },
]
const BRACE_B = legs('..dnms..', BRACE_L)
const LEAP_B = legs('..dnms..', LEAP_L)
const FLUNG_B = FLUNG_F

// ===================================================================================
// Bodies by facing: what every kind is built on
// ===================================================================================

/**
 * The body of a facing in a pose: { head, chest, legs } parts. `arm` is the
 * weapon arm (and the free arm where the facing shows it), `lean` the run's
 * and the lunge's lean (the side leans forward; the front and back drop a pixel).
 */
const BODY_OF = {
  side: (legs, arm, lean = false) => (lean ? [HEAD_LEAN, CHEST_LEAN, arm, legs] : [HEAD, CHEST, arm, legs]),
  front: (legs, arm, lean = false) => (lean ? [legs, at(HEAD_F, 0, 1), at(CHEST_F, 0, 1), at(CLOAK_F, 0, 1), at(arm, 0, 1)] : [legs, HEAD_F, CHEST_F, CLOAK_F, arm]),
  back: (legs, arm, lean = false) => (lean ? [legs, at(HEAD_B, 0, 1), at(CHEST_B, 0, 1), at(KIHEI_B, 0, 1), at(CLOAK_B, 0, 1), at(arm, 0, 1)] : [legs, HEAD_B, CHEST_B, KIHEI_B, CLOAK_B, arm]),
}
const POSES = {
  side: { stand: STAND, walk: WALK, run: RUN, brace: BRACE, lunge: LUNGE, leap: LEGS_LEAP, flung: ARM_FLUNG },
  front: { stand: STAND_F, walk: WALK_F, run: RUN_F, brace: BRACE_F, lunge: BRACE_F, leap: LEAP_F, flung: FLUNG_F },
  back: { stand: STAND_B, walk: WALK_B, run: RUN_B, brace: BRACE_B, lunge: BRACE_B, leap: LEAP_B, flung: FLUNG_B },
}
// the arms each facing shows: the weapon arm hanging, gripping, out, back, up; and the free arm
const ARMS = {
  side: { down: ARM_DOWN, grip: ARM_GRIP, out: ARM_OUT, back: ARM_BACK, up: ARM_UP, free: null, pump: null },
  front: { down: ARMS_F, grip: merge(FREE_F, GRIP_F), out: merge(FREE_F, FWD_F), back: merge(FREE_F, GRIP_F), up: merge(FREE_F, UP_F), both: BOTH_FWD_F, pump: PUMP_F },
  back: { down: ARMS_B, grip: merge(FREE_B, GRIP_B), out: merge(FREE_B, FWD_B), back: merge(FREE_B, BACK_B), up: merge(FREE_B, UP_B), both: BOTH_FWD_B, pump: PUMP_B },
}

/**
 * Every kind of figure, in one facing: its 17 frames from what it carries.
 * `carry` gives, per facing, the overlays: walk, run, idle (two), engage
 * (four, each [arm, legs: 'brace' | 'lunge', over, under]) and the leap.
 */
function figure(facing, carry) {
  const B = BODY_OF[facing]
  const P = POSES[facing]
  const A = ARMS[facing]
  const c = carry[facing]
  const out = []
  const side = facing === 'side'
  // walk: the arm the weapon wants, the legs stepping
  for (let i = 0; i < 4; i++) out.push(frame(B(P.walk[i], A[c.walk.arm] || A.down), c.walk.over, c.walk.under))
  // run: leaning, the weapon carried as a runner carries it; front and back pump the free arm
  for (let i = 0; i < 4; i++) {
    const arm = side ? at(A[c.run.arm] || A.down, 1) : merge(A.pump[i], c.run.arm === 'grip' ? (facing === 'front' ? GRIP_F : GRIP_B) : null)
    out.push(frame(B(P.run[i], arm, side), c.run.over, c.run.under))
  }
  // stand: two frames
  for (const s of c.idle) out.push(frame(B(P.stand, A[s.arm] || A.down), s.over, s.under))
  // engage: four frames
  for (const [arm, legs, over, under] of c.engage) out.push(frame(B(P[legs], A[arm] || A.down, legs === 'lunge'), over, under))
  // the leap and its tumble (the weapon let go)
  out.push(frame(B(P.leap, P.flung, side), c.leap || null))
  out.push(frame([tumble(TUCK[facing], 1)]))
  out.push(frame([tumble(TUCK[facing], 2)]))
  return out
}

// --- the warrior with an ihe ------------------------------------------------------------
const spearUp = (top, bottom, x = 6) => {
  const p = {}
  for (let r = top; r <= bottom; r++) p[r] = '.'.repeat(x) + 'w'
  p[top] = '.'.repeat(x) + 'W'
  return p
}
const SPEAR = {
  side: {
    // walk: carried upright, clear of the feet; run: levelled at the hip, the point ahead
    walk: { arm: 'down', over: spearUp(0, 10) },
    run: { arm: 'down', over: { 8: 'wwwwwwwW' } },
    // stand: the butt on the ground, the point leaning a little and back
    idle: [
      { arm: 'down', over: spearUp(0, 14) },
      { arm: 'grip', over: { ...spearUp(1, 14), 0: '.......W', 1: '......w.' } },
    ],
    // engage: drawn back, thrust, recovered
    engage: [
      ['back', 'brace', { 6: 'wwwwW...' }],
      ['out', 'lunge', { 6: '..wwwwwW' }],
      ['grip', 'brace', { 1: '.......W', 2: '......w.', 3: '......w.', 4: '.....w..', 5: '.....w..', 6: '....w...', 7: '....w...' }],
      ['grip', 'brace', { 1: '.......W', 2: '......w.', 3: '......w.', 4: '.....w..', 5: '.....w..', 6: '....w...', 7: '....w...' }],
    ],
    leap: { 0: '.......W', 1: '......w.', 2: '.....w..', 3: '....w...' },
  },
  front: {
    walk: { arm: 'grip', over: spearUp(0, 11, 0) },
    // (levelled at the eye: the point before him, the shaft behind)
    run: { arm: 'grip', over: { 7: '..w.....', 8: '..W.....' } },
    idle: [
      { arm: 'grip', over: spearUp(0, 14, 0) },
      { arm: 'down', over: { ...spearUp(1, 14, 0), 0: '.W......' } },
    ],
    engage: [
      // raised over the shoulder, the point at the eye; driven at it; held across
      ['up', 'brace', { 0: '....w...', 1: '...w....', 2: '..w.....', 3: '.w......', 4: 'W.......' }],
      ['out', 'lunge', { 7: '..w.....', 8: '.WW.....', 9: '..W.....' }],
      ['grip', 'brace', spearUp(0, 12, 0)],
      ['grip', 'brace', spearUp(0, 12, 0)],
    ],
    leap: { 0: 'W.......', 1: 'w.......', 2: '.w......' },
  },
  back: {
    walk: { arm: 'grip', over: spearUp(0, 11, 7) },
    // (levelled away from the eye: the shaft rising up the screen past his shoulder)
    run: { arm: 'grip', over: { 2: '.......W', 3: '.......w', 4: '......w.', 5: '......w.' } },
    idle: [
      { arm: 'grip', over: spearUp(0, 14, 7) },
      { arm: 'down', over: { ...spearUp(1, 14, 7), 0: '......W.' } },
    ],
    engage: [
      // drawn back, the butt toward the eye; the arm thrust forward, the point up and away; recovered
      ['back', 'brace', { 2: '.......W', 3: '.......w', 4: '.......w', 5: '......w.', 6: '......w.', 7: '......w.', 8: '.....w..', 9: '.....w..' }],
      ['out', 'lunge', { 0: '......W.', 1: '......w.', 2: '......w.' }],
      ['grip', 'brace', spearUp(0, 12, 7)],
      ['grip', 'brace', spearUp(0, 12, 7)],
    ],
    leap: { 0: '.......W', 1: '.......w', 2: '......w.' },
  },
}

// --- the warrior with a club --------------------------------------------------------------
const CLUB = {
  side: {
    // walk: on the shoulder, its head behind; run: held up before him
    walk: { arm: 'grip', over: { 5: 'WWwwww..' } },
    run: { arm: 'grip', over: { 1: '......WW', 2: '......WW', 3: '......w.', 4: '......w.', 5: '......w.' } },
    // stand: hanging from the hand, a little swung
    idle: [
      { arm: 'down', over: { 7: '......w.', 8: '......w.', 9: '......WW', 10: '......WW' } },
      { arm: 'down', over: { 7: '......w.', 8: '......w.', 9: '.....WW.', 10: '.....WW.' } },
    ],
    // engage: raised behind the head, brought down, followed through
    engage: [
      ['up', 'brace', null, { 0: 'WWwww...', 1: 'WW......' }],
      ['out', 'lunge', { 6: '.......w', 7: '......WW', 8: '......WW' }],
      ['down', 'brace', { 8: '......w.', 9: '......w.', 10: '.....WW.', 11: '.....WW.' }],
      ['down', 'brace', { 8: '......w.', 9: '......w.', 10: '.....WW.', 11: '.....WW.' }],
    ],
    leap: { 0: '......WW', 1: '......WW' },
  },
  front: {
    walk: { arm: 'grip', over: { 3: 'WW......', 4: 'Ww......' } },
    run: { arm: 'grip', over: { 1: '.WW.....', 2: '.WW.....', 3: '.w......', 4: '.w......' } },
    idle: [
      { arm: 'down', over: { 8: '.w......', 9: '.w......', 10: 'WW......', 11: 'WW......' } },
      { arm: 'down', over: { 8: '.w......', 9: 'w.......', 10: 'WW......', 11: 'W.......' } },
    ],
    engage: [
      // raised behind the head; brought down before him, at the eye; swung through low
      ['up', 'brace', null, { 0: '..wwWW..', 1: '....WW..' }],
      ['out', 'lunge', { 6: '..WW....', 7: '..WW....' }],
      ['down', 'brace', { 8: '.w......', 9: '.w......', 10: 'WW......', 11: 'WW......' }],
      ['down', 'brace', { 8: '.w......', 9: '.w......', 10: 'WW......', 11: 'WW......' }],
    ],
    leap: { 0: 'WW......', 1: 'WW......' },
  },
  back: {
    walk: { arm: 'grip', over: { 3: '......WW', 4: '......wW' } },
    run: { arm: 'grip', over: { 1: '.....WW.', 2: '.....WW.', 3: '......w.', 4: '......w.' } },
    idle: [
      { arm: 'down', over: { 8: '......w.', 9: '......w.', 10: '......WW', 11: '......WW' } },
      { arm: 'down', over: { 8: '......w.', 9: '.......w', 10: '......WW', 11: '.......W' } },
    ],
    engage: [
      // raised back over the head, toward the eye; swung over and down away from it, the arm
      // reaching forward and the head of the club gone before him; followed through low
      ['up', 'brace', { 0: '..WWww..', 1: '..WW....' }],
      ['out', 'lunge', { 1: '......W.', 2: '......W.' }],
      ['down', 'brace', { 8: '......w.', 9: '......w.', 10: '......WW', 11: '......WW' }],
      ['down', 'brace', { 8: '......w.', 9: '......w.', 10: '......WW', 11: '......WW' }],
    ],
    leap: { 0: '......WW', 1: '......WW' },
  },
}

// --- the warrior with a musket ---------------------------------------------------------
const musketUp = (top, x = 6) => {
  const p = {}
  const pad = '.'.repeat(x)
  for (let r = top; r < top + 6; r++) p[r] = pad + 'G'
  p[top] = pad + 'g'
  for (let r = top + 6; r <= 14; r++) p[r] = pad + 'W'
  return p
}
const MUSKET = {
  side: {
    // walk: sloped on the shoulder, the barrel up behind the head; run: carried across the body
    walk: { arm: 'grip', over: { 6: '.....W..', 7: '.....WW.' }, under: { 0: '.g......', 1: '.G......', 2: '.G......', 3: '..G.....', 4: '..G.....', 5: '...G....', 6: '....G...' } },
    run: { arm: 'grip', over: { 1: '.......g', 2: '......G.', 3: '......G.', 4: '.....G..', 5: '.....W..', 6: '....W...', 7: '...W....' } },
    // stand: grounded beside the foot
    idle: [
      { arm: 'grip', over: musketUp(3) },
      { arm: 'down', over: musketUp(3) },
    ],
    // engage: levelled at the shoulder; fired (it kicks back a pixel, and the flash); lowered in its smoke
    engage: [
      ['out', 'brace', { 4: '..WWGGGg' }],
      ['out', 'brace', { 3: '.......F', 4: '.WWGGGgf', 5: '.......F' }],
      ['grip', 'brace', { 0: '......SS', 1: '.....SSZ', 2: '......Z.', 5: '.....W..', 6: '......G.', 7: '......G.' }, { 2: '.......g' }],
      ['grip', 'brace', { 0: '.....SS.', 1: '....SZ..', 5: '.....W..', 6: '......G.', 7: '......G.' }, { 2: '.......g' }],
    ],
    leap: { 0: '......g.', 1: '......G.', 2: '.....W..' },
  },
  front: {
    walk: { arm: 'grip', over: { 6: '.W......' }, under: { 0: 'g.......', 1: 'G.......', 2: 'G.......', 3: '.G......', 4: '.G......', 5: '.G......' } },
    run: { arm: 'grip', over: { 4: '......g.', 5: '.....G..', 6: '....G...', 7: '...W....', 8: '..W.....' } },
    idle: [
      { arm: 'grip', over: musketUp(3, 0) },
      { arm: 'down', over: musketUp(3, 0) },
    ],
    engage: [
      // levelled at the eye: the muzzle before his face; fired, the flash toward the eye; lowered in its smoke
      ['both', 'brace', { 3: '.gg.....', 4: '.gb.....', 5: '..W.....' }],
      ['both', 'brace', { 1: '.F......', 2: 'FfF.....', 3: 'fffF....', 4: 'FfF.....', 5: '.F......' }],
      ['grip', 'brace', { 0: '.SSZ....', 1: 'SZSS....', 2: '.SZ.....' }, musketUp(5, 0)],
      ['grip', 'brace', { 0: 'SZ......', 1: '.S......' }, musketUp(5, 0)],
    ],
    leap: { 0: 'g.......', 1: 'G.......', 2: '.W......' },
  },
  back: {
    walk: { arm: 'grip', over: { 6: '......W.' }, under: { 0: '.......g', 1: '.......G', 2: '.......G', 3: '......G.', 4: '......G.', 5: '......G.' } },
    run: { arm: 'grip', over: { 4: '.g......', 5: '..G.....', 6: '...G....', 7: '....W...', 8: '.....W..' } },
    idle: [
      { arm: 'grip', over: musketUp(3, 7) },
      { arm: 'down', over: musketUp(3, 7) },
    ],
    engage: [
      // levelled away: the barrel up the screen from his cheek; fired, the flash at its far end; smoke
      ['both', 'brace', { 1: '......g.', 2: '......G.', 3: '......G.', 4: '......W.' }],
      ['both', 'brace', { 0: '.....FfF', 1: '......f.', 2: '......G.', 3: '......G.', 4: '......W.' }],
      ['grip', 'brace', { 0: '....SSZ.', 1: '.....ZSS', 2: '......S.' }, musketUp(5, 7)],
      ['grip', 'brace', { 0: '.....ZS.', 1: '......S.' }, musketUp(5, 7)],
    ],
    leap: { 0: '.......g', 1: '.......G', 2: '......W.' },
  },
}

// --- the slinger: a figure in a cell twice its width, so the stone can fly clear -------------
// (drawn in the figure's own eight columns, then set four in; the cord and the stone in the
// cell's sixteen: a figure's column x is the cell's x + 4)
const SLING = {
  side: {
    // the sling hanging from the hand, its pouch at the knee
    walk: { arm: 'down', over: { 8: '.........c', 9: '.........c', 10: '.........cg' } },
    run: { arm: 'down', over: { 8: '.......cc.', 9: '......g...' } },
    idle: [
      { arm: 'down', over: { 8: '.........c', 9: '.........c', 10: '.........cg' } },
      { arm: 'down', over: { 8: '.........c', 9: '..........c', 10: '..........cg' } },
    ],
    // engage: whirled round over the head, the stone behind, then before; let go, the stone away; and on
    engage: [
      ['up', 'brace', null, { 0: '.....gccc' }],
      ['up', 'brace', { 0: '........ccg' }],
      ['out', 'lunge', { 4: '.............g', 5: '...........c' }],
      ['out', 'brace', { 3: '...............g', 6: '..........c', 7: '..........c' }],
    ],
    leap: { 0: '..........c', 1: '..........c' },
  },
  front: {
    walk: { arm: 'grip', over: { 7: '.....c', 8: '.....c', 9: '....gc' } },
    run: { arm: 'grip', over: { 7: '....c.', 8: '...cg.' } },
    idle: [
      { arm: 'down', over: { 8: '.....c', 9: '.....c', 10: '....gc' } },
      { arm: 'down', over: { 8: '.....c', 9: '....c.', 10: '...gc.' } },
    ],
    // (let go at the eye: the stone comes down the screen toward it)
    engage: [
      ['up', 'brace', null, { 0: '..gccc' }],
      ['up', 'brace', { 0: '.....ccccg' }],
      ['out', 'lunge', { 8: '...g', 7: '....c' }],
      ['out', 'brace', { 11: '.g', 8: '.....c' }],
    ],
    leap: { 0: '.....c', 1: '.....c' },
  },
  back: {
    walk: { arm: 'grip', over: { 7: '..........c', 8: '..........c', 9: '..........cg' } },
    run: { arm: 'grip', over: { 7: '...........c', 8: '...........gc' } },
    idle: [
      { arm: 'down', over: { 8: '..........c', 9: '..........c', 10: '..........cg' } },
      { arm: 'down', over: { 8: '..........c', 9: '...........c', 10: '...........cg' } },
    ],
    // (let go away from the eye: the stone goes up the screen past his shoulder)
    engage: [
      ['up', 'brace', { 0: '.....gcccc' }],
      ['up', 'brace', null, { 0: '..........cccg' }],
      ['out', 'lunge', { 1: '............g', 2: '...........c' }],
      ['out', 'brace', { 0: '..............g', 4: '...........c' }],
    ],
    leap: { 0: '..........c', 1: '..........c' },
  },
}

// --- the warrior with a pāhoa, the dagger of the close fight ------------------------------
const DAGGER = {
  side: {
    walk: { arm: 'down', over: { 8: '.....W..', 9: '.....g..' } },
    run: { arm: 'grip', over: { 6: '......Wg' } },
    idle: [
      { arm: 'down', over: { 8: '.....W..', 9: '.....g..' } },
      { arm: 'grip', over: { 4: '......g.', 5: '......W.' } },
    ],
    // engage: raised over the shoulder, struck down and forward, held before him
    engage: [
      ['up', 'brace', { 0: '....Wg..' }],
      ['out', 'lunge', { 6: '.......W', 7: '.......g' }],
      ['grip', 'brace', { 4: '......g.', 5: '......W.' }],
      ['grip', 'brace', { 4: '......g.', 5: '......W.' }],
    ],
    leap: null,
  },
  front: {
    walk: { arm: 'down', over: { 8: '.W......', 9: '.g......' } },
    run: { arm: 'grip', over: { 6: '..g.....' } },
    idle: [
      { arm: 'down', over: { 8: '.W......', 9: '.g......' } },
      { arm: 'grip', over: { 4: '.g......', 5: '.W......' } },
    ],
    engage: [
      ['up', 'brace', { 0: '.g......' }],
      ['out', 'lunge', { 7: '..W.....', 8: '..gg....' }],
      ['grip', 'brace', { 4: '.g......', 5: '.W......' }],
      ['grip', 'brace', { 4: '.g......', 5: '.W......' }],
    ],
    leap: null,
  },
  back: {
    walk: { arm: 'down', over: { 8: '......W.', 9: '......g.' } },
    run: { arm: 'grip', over: { 4: '......g.' } },
    idle: [
      { arm: 'down', over: { 8: '......W.', 9: '......g.' } },
      { arm: 'grip', over: { 3: '......g.', 4: '......W.' } },
    ],
    // (struck away from the eye: the arm goes forward, up the screen, the blade before it)
    engage: [
      ['up', 'brace', { 0: '......g.' }],
      ['out', 'lunge', { 1: '......g.', 2: '......W.' }],
      ['grip', 'brace', { 3: '......g.', 4: '......W.' }],
      ['grip', 'brace', { 3: '......g.', 4: '......W.' }],
    ],
    leap: null,
  },
}

// --- the field piece's crew: the rammer and the linstock ---------------------------------
// (beside the piece; in the front and the back they are turned, by mirroring, so the tool is
// on the piece's side)
const rammerUp = (top, bottom, x = 6) => {
  const p = {}
  for (let r = top; r <= bottom; r++) p[r] = '.'.repeat(x) + 'w'
  p[top] = '.'.repeat(Math.max(0, x - 1)) + (x > 0 ? 'WW' : 'W')
  return p
}
const RAMMER = {
  side: {
    walk: { arm: 'down', over: rammerUp(0, 10) },
    run: { arm: 'down', over: { 7: 'wwwwwwWW' } },
    idle: [
      { arm: 'down', over: rammerUp(0, 14) },
      { arm: 'grip', over: rammerUp(1, 14) },
    ],
    // engage: the rammer run into the muzzle, pushed home, drawn out
    engage: [
      ['out', 'brace', { 6: '..wwwwWW' }],
      ['out', 'lunge', { 6: '...wwwwW' }],
      ['back', 'brace', { 6: 'wwwwwW..' }],
      ['back', 'brace', { 6: 'wwwwwW..' }],
    ],
  },
  front: {
    walk: { arm: 'grip', over: rammerUp(0, 11, 0) },
    run: { arm: 'grip', over: { 6: 'WWwwww..' } },
    idle: [
      { arm: 'grip', over: rammerUp(0, 14, 0) },
      { arm: 'down', over: rammerUp(1, 14, 0) },
    ],
    // (the piece to his left on the screen: the rod run across toward it, pushed, drawn)
    engage: [
      ['both', 'brace', { 5: 'WW......', 6: '.wwww...' }],
      ['both', 'lunge', { 7: 'Wwwww...' }],
      ['grip', 'brace', rammerUp(0, 12, 0)],
      ['grip', 'brace', rammerUp(0, 12, 0)],
    ],
  },
  back: {
    walk: { arm: 'grip', over: rammerUp(0, 11, 7) },
    run: { arm: 'grip', over: { 6: '..wwwwWW' } },
    idle: [
      { arm: 'grip', over: rammerUp(0, 14, 7) },
      { arm: 'down', over: rammerUp(1, 14, 7) },
    ],
    // (the piece ahead of him and to the right: the rod pushed forward and up the screen into it)
    engage: [
      ['both', 'brace', { 2: '......WW', 3: '......w.', 4: '......w.', 5: '.....w..', 6: '.....w..' }],
      ['both', 'lunge', { 0: '......WW', 1: '......w.', 2: '......w.', 3: '.....w..' }],
      ['grip', 'brace', rammerUp(0, 12, 7)],
      ['grip', 'brace', rammerUp(0, 12, 7)],
    ],
  },
}
const linstockUp = (top, bottom, x = 6) => {
  const p = {}
  for (let r = top; r <= bottom; r++) p[r] = '.'.repeat(x) + 'w'
  p[top] = '.'.repeat(x) + 'F'
  return p
}
const LINSTOCK = {
  side: {
    walk: { arm: 'down', over: linstockUp(0, 10) },
    run: { arm: 'down', over: { 4: '.......F', 5: '......w.', 6: '.....w..', 7: '....w...', 8: '...w....' } },
    idle: [
      { arm: 'down', over: linstockUp(0, 14) },
      { arm: 'down', over: { ...linstockUp(1, 14), 0: '......f.' } },
    ],
    // engage: the match brought down toward the touch-hole, put to it, lifted clear
    engage: [
      ['out', 'brace', { 7: '......w.', 8: '......w.', 9: '.......w', 10: '.......F' }],
      ['out', 'lunge', { 7: '.......w', 8: '.......w', 9: '.......w', 10: '.......w', 11: '.......f' }],
      ['grip', 'brace', linstockUp(0, 9)],
      ['grip', 'brace', linstockUp(0, 9)],
    ],
  },
  front: {
    walk: { arm: 'grip', over: linstockUp(0, 11, 0) },
    run: { arm: 'grip', over: { 3: 'F.......', 4: '.w......', 5: '..w.....' } },
    idle: [
      { arm: 'grip', over: linstockUp(0, 14, 0) },
      { arm: 'down', over: { ...linstockUp(1, 14, 0), 0: 'f.......' } },
    ],
    engage: [
      ['grip', 'brace', { 6: '.w......', 7: 'w.......', 8: 'F.......' }],
      ['out', 'lunge', { 7: '.w......', 8: 'w.......', 9: 'f.......' }],
      ['grip', 'brace', linstockUp(0, 9, 0)],
      ['grip', 'brace', linstockUp(0, 9, 0)],
    ],
  },
  back: {
    walk: { arm: 'grip', over: linstockUp(0, 11, 7) },
    run: { arm: 'grip', over: { 3: '.......F', 4: '......w.', 5: '.....w..' } },
    idle: [
      { arm: 'grip', over: linstockUp(0, 14, 7) },
      { arm: 'down', over: { ...linstockUp(1, 14, 7), 0: '.......f' } },
    ],
    engage: [
      ['grip', 'brace', { 4: '.......F', 5: '......w.', 6: '......w.' }],
      ['out', 'lunge', { 3: '.......f', 4: '......w.', 5: '......w.' }],
      ['grip', 'brace', linstockUp(0, 9, 7)],
      ['grip', 'brace', linstockUp(0, 9, 7)],
    ],
  },
}

// --- the field piece (16 wide): a small gun on a two-wheeled carriage -------------------
// From the side, its near wheel in front of the barrel and the trail down behind; from the
// front, the muzzle between the wheels, and its flash toward the eye; from behind, the breech,
// the wheels and the trail coming down toward the eye.
const GW = 16
const PIECE = {
  9: '....gggggggggg..',
  10: '..GGGGWWWGGGGG..',
  11: '...WWW.w.W...G..',
  12: '..WW.WwwwW......',
  13: '.WW..W.w.W......',
  14: 'WW....WWW.......',
}
// (the wheel turned an eighth, for hauling)
const PIECE_TURN = { ...PIECE, 11: '...WWWw.wW...G..', 12: '..WW.W.w.W......', 13: '.WW..Ww.wW......' }
const PIECE_F = {
  8: '..ww..gggg..ww..',
  9: '..WW..gbbg..WW..',
  10: '..WW.WgbbgW.WW..',
  11: '..WWWWWggWWWWW..',
  12: '..WW..W..W..WW..',
  13: '..ww........ww..',
}
const PIECE_B = {
  8: '..ww...gg...ww..',
  9: '..WW..GggG..WW..',
  10: '..WW.WGGGGW.WW..',
  11: '..WWWWWWWWWWWW..',
  12: '..WW...WW...WW..',
  13: '..ww...WW...ww..',
  14: '.......WW.......',
}
const pieceFrame = (piece, extra = null, dx = 0, dy = 0) => ({ body: [at(piece, dx, dy)], over: extra ? [extra] : [], under: [] })
const GUN = {
  side: [
    // walk, run (hauled: the wheel turning), stand
    ...[0, 1, 0, 1, 0, 1, 0, 1, 0, 0].map((t) => pieceFrame(t ? PIECE_TURN : PIECE)),
    // engage: fired (the flash), kicked back in its smoke, the smoke drifting off, gone
    pieceFrame(PIECE, { 8: '..............F.', 9: '..............fF', 10: '..............ff', 11: '..............F.' }),
    pieceFrame(PIECE, { 6: '............SS..', 7: '...........SSSS.', 8: '..........SSSZS.', 9: '...........ZSS..', 10: '............Z...' }, -1),
    pieceFrame(PIECE, { 3: '...........SS...', 4: '..........SZSS..', 5: '...........ZS...' }),
    pieceFrame(PIECE, { 2: '............S...' }),
  ],
  front: [
    ...[0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(() => pieceFrame(PIECE_F)),
    // (the flash comes at the eye, over the whole muzzle; it kicks back, away, a pixel up)
    pieceFrame(PIECE_F, { 5: '.......FF.......', 6: '.....FfffF......', 7: '....FfffffF.....', 8: '...FfffffffF....', 9: '....FfffffF.....', 10: '.....FfffF......', 11: '.......FF.......' }),
    pieceFrame(PIECE_F, { 4: '......SSZ.......', 5: '....SSSSSS......', 6: '...SZSSSSZS.....', 7: '....SSZSS.......', 8: '......S.........' }, 0, -1),
    pieceFrame(PIECE_F, { 1: '.......SS.......', 2: '.....SZSSS......', 3: '......ZS........' }),
    pieceFrame(PIECE_F, { 0: '......S.........' }),
  ],
  back: [
    ...[0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(() => pieceFrame(PIECE_B)),
    // (the flash at the far end of the barrel, beyond the breech; it kicks back toward the eye)
    pieceFrame(PIECE_B, { 4: '.......FF.......', 5: '......FffF......', 6: '.......ff.......', 7: '.......FF.......' }),
    pieceFrame(PIECE_B, { 3: '......SSZ.......', 4: '.....SZSSS......', 5: '......SSZ.......' }, 0, 1),
    pieceFrame(PIECE_B, { 0: '......SS........', 1: '.....SZSS.......', 2: '......Z.........' }),
    pieceFrame(PIECE_B, { 0: '.......S........' }),
  ],
}
// (the gun has no leap: three empty cells)
for (const f of FACINGS) GUN[f].push(...[0, 1, 2].map(() => ({ body: [], over: [], under: [] })))

const CARRY = { spear: SPEAR, club: CLUB, musket: MUSKET, sling: SLING, dagger: DAGGER, rammer: RAMMER, linstock: LINSTOCK }

/** Every kind's frames: ART[kind][facing] → FRAMES frames. */
export const ART = {}
for (const kind of KINDS) {
  ART[kind] = {}
  for (const facing of FACINGS) {
    if (kind === 'gun') ART.gun[facing] = GUN[facing]
    else {
      const frames = figure(facing, CARRY[kind])
      // (a figure in a wide cell: its body four columns in; its cord and stone were drawn in the cell's own)
      ART[kind][facing] = WIDTH[kind] ? frames.map((fr) => ({ body: fr.body.map((p) => at(p, 4)), over: fr.over, under: fr.under })) : frames
    }
  }
}

/** The rows of the sheet: each kind in the dresses it is drawn in. */
function rowsWanted() {
  const rows = []
  for (const side of SIDES) {
    for (const dress of ['bare', 'kihei']) for (const kind of ['spear', 'club', 'musket', 'sling', 'dagger']) rows.push({ kind, side, dress })
    for (const kind of ['spear', 'club']) rows.push({ kind, side, dress: 'chief' })
  }
  rows.push({ kind: 'rammer', side: 'hawaii', dress: 'bare' }, { kind: 'linstock', side: 'hawaii', dress: 'kihei' }, { kind: 'gun', side: 'hawaii', dress: 'bare' })
  return rows
}

export const GLOW = 200
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]

/** Parts laid into rows for a dress: the topmost letter that has a colour in it wins. */
function resolve(parts, w, pal) {
  const g = Array.from({ length: SPRITE_H }, () => new Array(w).fill('.'))
  for (const part of parts) {
    for (const [row, str] of Object.entries(part)) {
      const r = Number(row)
      if (r < 0 || r >= SPRITE_H) continue
      for (let x = 0; x < Math.min(w, str.length); x++) {
        const c = str[x]
        if (c !== '.' && pal[c]) g[r][x] = c
      }
    }
  }
  return g
}

/** One frame in colour: RGBA rows, with the outline worked out round the body. */
function paint(fr, w, pal, outlined) {
  const body = resolve(fr.body, w, pal)
  const over = resolve(fr.over, w, pal)
  const under = resolve(fr.under, w, pal)
  const solid = (x, y) => y >= 0 && y < SPRITE_H && x >= 0 && x < w && outlined.includes(body[y][x])
  const px = new Uint8Array(w * SPRITE_H * 4)
  // (a flash and a match's glow are marked with a lower alpha: the shader draws them as their own light)
  const put = (x, y, c) => {
    if (c === '.') return
    const col = pal[c]
    if (!col) return
    px.set([...hex(col), c === 'f' || c === 'F' ? GLOW : 255], (y * w + x) * 4)
  }
  for (let y = 0; y < SPRITE_H; y++) {
    for (let x = 0; x < w; x++) {
      put(x, y, under[y][x])
      if (!solid(x, y) && (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1))) put(x, y, 'o')
      put(x, y, body[y][x])
      put(x, y, over[y][x])
    }
  }
  return px
}

/**
 * The sheet: every row a kind in one side's dress; across it, the side, the
 * front and the back, each FRAMES cells. { width, height, data (RGBA, row 0
 * at the top), rows, facingW (cells to a facing), cell(kind, side, dress,
 * anim, frame, facing) → [x, y, w, h] in sheet pixels, at(kind, side, dress)
 * → { y, w } }.
 */
export function buildSheet() {
  const rows = rowsWanted()
  const width = FACINGS.length * FRAMES * 16
  const height = rows.length * SPRITE_H
  const data = new Uint8Array(width * height * 4)
  const index = new Map()
  rows.forEach((r, ri) => {
    const w = WIDTH[r.kind] || SPRITE_W
    r.w = w
    const pal = palette(r.side, r.dress)
    const outlined = r.kind === 'gun' ? GUN_BODY : BODY
    FACINGS.forEach((facing, fc) => {
      ART[r.kind][facing].forEach((fr, fi) => {
        const px = paint(fr, w, pal, outlined)
        const x0 = (fc * FRAMES + fi) * w
        for (let y = 0; y < SPRITE_H; y++) data.set(px.subarray(y * w * 4, (y + 1) * w * 4), ((ri * SPRITE_H + y) * width + x0) * 4)
      })
    })
    index.set(`${r.kind}/${r.side}/${r.dress}`, { y: ri * SPRITE_H, w })
  })
  const find = (kind, side, dress) => index.get(`${kind}/${side}/${dress}`) || index.get(`${kind}/${side}/bare`) || index.get(`${kind}/hawaii/bare`) || index.get(`${kind}/hawaii/kihei`)
  const cell = (kind, side, dress, anim, f, facing = 0) => {
    const row = find(kind, side, dress)
    const [first, n] = ANIM[anim]
    return [(facing * FRAMES + first + (f % n)) * row.w, row.y, row.w, SPRITE_H]
  }
  return { width, height, data, rows, facingW: FRAMES, cell, at: find, has: (kind, side, dress) => index.has(`${kind}/${side}/${dress}`) }
}
