// The people of a departure or a landing, as pixel art (DESIGN.md §8, the
// tone rule, and §14): the crowd on the shore and the crews aboard, in the
// same 8 by 16 pixel figures as the battles' people (sprites.js), drawn by
// the same shader (render/shaders/sprite.glsl.js) at the same whole-number
// scale, but in the dress of their time and doing quiet things: standing,
// walking, waving, chanting, a conch raised, a paddle pulled.
//
// Each figure is drawn three ways, as the soldiers are: from the side,
// facing right (the shader mirrors it to face left), from the front and from
// behind. Each facing has twelve frames: a walk of four, a stand of two
// (a hand shifts), a wave of two (an arm up, the hand swaying), a chant of
// two (the arms out and up; for one who carries a conch, the shell raised to
// the mouth and lifted), and a paddle of two (the catch and the pull, for one
// seated in a canoe; the other frames are the same seat at rest).
//
// The dress, by `dress` (DATA.md "Vessels and crowds"): `1970s`, aloha
// shirts in a handful of prints, shorts, a man bare to the waist, muʻumuʻu,
// children, a few with lei and a few with conch shells; `kingdom`, shirts and
// trousers, the holokū; `precontact`, the malo and the pāʻū, a kīhei over
// the shoulders. The prints are a pixel of pattern colour here and there:
// at this size a shirt is its colour and a fleck.

export const W = 8
export const H = 16
/** Frames within a facing: [first, count]. */
export const ANIM = { walk: [0, 4], idle: [4, 2], wave: [6, 2], chant: [8, 2], paddle: [10, 2] }
export const FRAMES = 12
export const FACINGS = ['side', 'front', 'back']
export const BODIES = ['man', 'woman', 'boy', 'girl', 'conch', 'paddler']
export const DRESSES = ['1970s', 'kingdom', 'precontact']

// --- the palette letters ----------------------------------------------------------
//   o  outline (worked out round the body)
//   h  hair            s  skin           d  skin in shade      e  the eye
//   t  the top: shirt, dress, kīhei      T  its print, or its shade
//   u  the bottom: shorts, trousers, malo, pāʻū                U  its shade
//   r  a long skirt (muʻumuʻu, holokū)   R  its print
//   l  a lei
//   c  a conch shell   C  its shade       w  a paddle's shaft   W  its blade
const BODY = 'hsdetTuUrRl'
const EARTH = { o: '#2a201b', h: '#2a201b', s: '#a5704b', d: '#7b5035', e: '#2a201b', c: '#efe2c8', C: '#d29a86', w: '#97734a', W: '#5b3d27' }

// --- parts ----------------------------------------------------------------------
/** A part moved right by dx and down by dy. */
function at(part, dx = 0, dy = 0) {
  const out = {}
  for (const [row, str] of Object.entries(part)) {
    const r = Number(row) + dy
    if (r < 0 || r >= H) continue
    out[r] = dx >= 0 ? '.'.repeat(dx) + str : str.slice(-dx)
  }
  return out
}
/** A part mirrored across the cell (the front's arms, seen from behind). */
function flip(part) {
  const out = {}
  for (const [row, str] of Object.entries(part)) out[row] = str.padEnd(W, '.').split('').reverse().join('')
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
/** Swap letters in a part (a shorts leg drawn as trousers, skin as cloth). */
function swap(part, map) {
  const out = {}
  for (const [row, str] of Object.entries(part)) out[row] = str.replace(/./g, (c) => map[c] ?? c)
  return out
}

// --- heads ----------------------------------------------------------------------
const HEAD = {
  side: { 1: '..hhh...', 2: '..hse...', 3: '..sss...', 4: '...d....' },
  front: { 1: '..hhhh..', 2: '..hssh..', 3: '..ssss..', 4: '...dd...' },
  back: { 1: '..hhhh..', 2: '..hhhh..', 3: '..hhhh..', 4: '...dd...' },
}
// long hair to the shoulders, and down the back
const HAIR_LONG = {
  side: { 1: '.hhhh...', 2: '.hhse...', 3: '.hsss...', 4: '.h.d....', 5: '.h......' },
  front: { 1: '..hhhh..', 2: '.hhsshh.', 3: '.hssssh.', 4: '.h.dd.h.' },
  back: { 1: '..hhhh..', 2: '.hhhhhh.', 3: '.hhhhhh.', 4: '.hhhhhh.', 5: '..hhhh..', 6: '..hhhh..' },
}

// --- tops ------------------------------------------------------------------------
const TOP = {
  side: { 5: '..ttt...', 6: '..tTt...', 7: '..ttT...', 8: '..ttt...' },
  front: { 5: '..tTtt..', 6: '..ttTt..', 7: '..Tttt..', 8: '..tttT..' },
  back: { 5: '..tttt..', 6: '..tTtt..', 7: '..ttTt..', 8: '..tttt..' },
}
const LEI = {
  side: { 5: '..lll...', 6: '...l....' },
  front: { 5: '..llll..', 6: '...ll...' },
  back: { 5: '..llll..' },
}

// --- arms, by facing: hanging (two ways), the wave (two), the chant (two), the conch (two) ---
const ARMS_F = {
  idle: [{ 5: '.t....t.', 6: '.s....s.', 7: '.s....s.' }, { 5: '.t....t.', 6: '.s....s.', 7: '..s...s.' }],
  wave: [
    { 1: 's.......', 2: 's.......', 3: '.s......', 4: '.s......', 5: '.t....t.', 6: '......s.', 7: '......s.' },
    { 1: '..s.....', 2: '.s......', 3: '.s......', 4: '.s......', 5: '.t....t.', 6: '......s.', 7: '......s.' },
  ],
  chant: [
    { 5: '.t....t.', 6: 's......s' },
    { 3: 's......s', 4: '.s....s.', 5: '.t....t.' },
  ],
  conch: [
    { 2: '.cc.....', 3: '.cCs....', 4: '..s.....', 5: '.t....t.', 6: '......s.', 7: '......s.' },
    { 1: '.c......', 2: '.ccs....', 3: '..Cs....', 4: '..s.....', 5: '.t....t.', 6: '......s.', 7: '......s.' },
  ],
}
const ARMS_B = {
  idle: ARMS_F.idle.map(flip),
  wave: ARMS_F.wave.map(flip),
  chant: ARMS_F.chant.map(flip),
  // (from behind, the shell over the shoulder, the hands up to it)
  conch: [
    { 2: '......c.', 3: '.....sc.', 4: '.....s..', 5: '.t....t.', 6: '.s......', 7: '.s......' },
    { 1: '......c.', 2: '.....sc.', 3: '.....s..', 4: '.....s..', 5: '.t....t.', 6: '.s......', 7: '.s......' },
  ],
}
const ARMS_S = {
  idle: [{ 5: '....t...', 6: '....s...', 7: '....s...' }, { 5: '....t...', 6: '....s...', 7: '.....s..' }],
  wave: [
    { 1: '.....s..', 2: '.....s..', 3: '....s...', 4: '....s...', 5: '....t...' },
    { 1: '......s.', 2: '.....s..', 3: '.....s..', 4: '....s...', 5: '....t...' },
  ],
  chant: [{ 5: '....tt..', 6: '......s.' }, { 4: '......s.', 5: '....tt..' }],
  conch: [
    { 2: '.....cc.', 3: '....sC..', 4: '....s...', 5: '....t...' },
    { 1: '......c.', 2: '.....cc.', 3: '....sC..', 4: '....s...', 5: '....t...' },
  ],
}
const ARMS = { side: ARMS_S, front: ARMS_F, back: ARMS_B }
// walking: the arms swing a little
const SWING = {
  side: [{ 5: '....t...', 6: '.....s..', 7: '.....s..' }, ARMS_S.idle[0], { 5: '...t....', 6: '...s....', 7: '..s.....' }, ARMS_S.idle[0]],
  front: [ARMS_F.idle[0], ARMS_F.idle[0], ARMS_F.idle[0], ARMS_F.idle[0]],
  back: [ARMS_B.idle[0], ARMS_B.idle[0], ARMS_B.idle[0], ARMS_B.idle[0]],
}

// --- legs, by what is worn below ----------------------------------------------------
// shorts: the cloth to the knee, the shins bare
const SHORTS = {
  side: {
    stand: { 9: '..uuu...', 10: '..uUu...', 11: '..s.s...', 12: '..s.s...', 13: '..s.s...', 14: '..ssss..' },
    walk: [
      { 9: '..uuu...', 10: '.uuUu...', 11: '..d..s..', 12: '.d...s..', 13: '.d...s..', 14: '.d...ss.' },
      { 9: '..uuu...', 10: '..uUu...', 11: '...ds...', 12: '...ds...', 13: '...dss..', 14: '...dd...' },
      { 9: '..uuu...', 10: '.uuUu...', 11: '..s..d..', 12: '.s...d..', 13: '.s...d..', 14: '.s...dd.' },
      { 9: '..uuu...', 10: '..uUu...', 11: '...sd...', 12: '...sd...', 13: '...sdd..', 14: '...ss...' },
    ],
  },
  front: {
    stand: { 9: '..uuuu..', 10: '..uUUu..', 11: '..s..s..', 12: '..s..s..', 13: '..s..s..', 14: '.ss..ss.' },
    walk: [
      { 9: '..uuuu..', 10: '..uUUu..', 11: '..s..s..', 12: '..s.s...', 13: '..s.s...', 14: '.ss.....' },
      { 9: '..uuuu..', 10: '..uUUu..', 11: '..s..s..', 12: '..s..s..', 13: '..s..s..', 14: '.ss..ss.' },
      { 9: '..uuuu..', 10: '..uUUu..', 11: '..s..s..', 12: '...s.s..', 13: '...s.s..', 14: '.....ss.' },
      { 9: '..uuuu..', 10: '..uUUu..', 11: '..s..s..', 12: '..s..s..', 13: '..s..s..', 14: '.ss..ss.' },
    ],
  },
}
SHORTS.back = SHORTS.front
// trousers: the same legs in cloth, the feet dark
const TROUSERS = {}
for (const f of ['side', 'front']) {
  const m = { s: 'u', d: 'U' }
  const t = (p) => {
    const q = swap(p, m)
    return { ...q, 14: (p[14] || '').replace(/[sd]/g, 'd') }
  }
  TROUSERS[f] = { stand: t(SHORTS[f].stand), walk: SHORTS[f].walk.map(t) }
}
TROUSERS.back = TROUSERS.front
// the malo: a band at the waist and the flap, the legs bare from the hip
const MALO = {}
for (const f of ['side', 'front']) {
  const t = (p) => ({ ...p, 10: p[10].replace(/u/g, 's').replace(/U/g, 'u') })
  MALO[f] = { stand: t(SHORTS[f].stand), walk: SHORTS[f].walk.map(t) }
}
MALO.back = MALO.front
// a long skirt to the ankle (the muʻumuʻu, the holokū), the feet under it
const SKIRT = {
  side: {
    stand: { 9: '..rrr...', 10: '..rRr...', 11: '.rrrr...', 12: '.rRrr...', 13: '.rrrrr..', 14: '..s.s...' },
    walk: [
      { 9: '..rrr...', 10: '..rRr...', 11: '.rrrr...', 12: '.rRrrr..', 13: 'rrrrrr..', 14: '.s...s..' },
      { 9: '..rrr...', 10: '..rRr...', 11: '.rrrr...', 12: '.rRrr...', 13: '.rrrrr..', 14: '...ss...' },
      { 9: '..rrr...', 10: '..rRr...', 11: '.rrrr...', 12: '.rRrrr..', 13: 'rrrrrr..', 14: '.d...s..' },
      { 9: '..rrr...', 10: '..rRr...', 11: '.rrrr...', 12: '.rRrr...', 13: '.rrrrr..', 14: '...sd...' },
    ],
  },
  front: {
    stand: { 9: '..rrrr..', 10: '..rRrr..', 11: '.rrrrRr.', 12: '.rRrrrr.', 13: '.rrrRrr.', 14: '..s..s..' },
    walk: [
      { 9: '..rrrr..', 10: '..rRrr..', 11: '.rrrrRr.', 12: '.rRrrrr.', 13: '.rrrRrr.', 14: '..s.....' },
      { 9: '..rrrr..', 10: '..rRrr..', 11: '.rrrrRr.', 12: '.rRrrrr.', 13: '.rrrRrr.', 14: '..s..s..' },
      { 9: '..rrrr..', 10: '..rRrr..', 11: '.rrrrRr.', 12: '.rRrrrr.', 13: '.rrrRrr.', 14: '.....s..' },
      { 9: '..rrrr..', 10: '..rRrr..', 11: '.rrrrRr.', 12: '.rRrrrr.', 13: '.rrrRrr.', 14: '..s..s..' },
    ],
  },
}
SKIRT.back = SKIRT.front
// the pāʻū: a skirt to the knee, the shins bare
const PAU = {}
for (const f of ['side', 'front']) {
  const t = (p, q) => ({ ...p, 13: q[13], 14: q[14] })
  PAU[f] = { stand: t(SKIRT[f].stand, SHORTS[f].stand), walk: SKIRT[f].walk.map((p, i) => t(p, SHORTS[f].walk[i])) }
}
PAU.back = PAU.front
const BOTTOMS = { shorts: SHORTS, trousers: TROUSERS, malo: MALO, skirt: SKIRT, pau: PAU }

// --- seated, paddling (a waʻa's crew): the head and body above the hull, the paddle --------
const SEAT = {
  side: { 6: '..hhh...', 7: '..hse...', 8: '..sss...', 9: '..ttt...', 10: '..tTt...', 11: '..ttt...', 12: '.uuuuu..', 13: '.uUuuu..' },
  front: { 6: '..hhhh..', 7: '..hssh..', 8: '..ssss..', 9: '..tTtt..', 10: '..ttTt..', 11: '..tttt..', 12: '.uuuuuu.', 13: '.uUuuUu.' },
  back: { 6: '..hhhh..', 7: '..hhhh..', 8: '..hhhh..', 9: '..tttt..', 10: '..tTtt..', 11: '..tttt..', 12: '.uuuuuu.', 13: '.uUuuUu.' },
}
// the catch, reaching forward, the blade in ahead; the pull, the blade back at the hip
const STROKE = {
  side: [
    { 7: '.....w..', 8: '....sw..', 9: '...s..w.', 10: '......w.', 11: '......w.', 12: '......W.', 13: '......WW' },
    { 7: '...w....', 8: '...ws...', 9: '..s.w...', 10: '....w...', 11: '....w...', 12: '....W...', 13: '...WW...' },
  ],
  front: [
    { 6: '......w.', 7: '......w.', 8: '.s...sw.', 9: '..s..w..', 10: '......w.', 11: '......w.', 12: '......W.', 13: '......W.' },
    { 8: '......w.', 9: '.s...sw.', 10: '..s...w.', 11: '......w.', 12: '......W.', 13: '......W.', 14: '......W.' },
  ],
}
STROKE.back = STROKE.front.map(flip)
const REST = { side: { 9: '....s...', 10: '....sww.', 11: '......WW' }, front: { 9: '.s....s.', 10: '..swwww.', 11: '......W.' }, back: { 9: '.s....s.', 10: '.wwwws..', 11: '.W......' } }

/**
 * A body's twelve frames in one facing, each { body, over } (over: carried,
 * not outlined): `look` is { hair, bottom, lei }.
 */
function frames(body, facing, look) {
  const out = []
  if (body === 'paddler') {
    const seat = SEAT[facing]
    for (let i = 0; i < 10; i++) out.push({ body: [seat], over: [REST[facing]] })
    for (const s of STROKE[facing]) out.push({ body: [seat], over: [s] })
    return out
  }
  const child = body === 'boy' || body === 'girl'
  const head = look.hair === 'long' ? HAIR_LONG[facing] : HEAD[facing]
  const top = merge(TOP[facing], look.lei ? LEI[facing] : null)
  const legs = BOTTOMS[look.bottom][facing]
  const arms = ARMS[facing]
  const up = (p) => (child ? childOf(p) : p)
  // (a child: the head and the body four rows down, the body a row shorter, the legs short)
  const kidLegs = (p) => ({ 12: p[9], 13: p[13], 14: p[14] })
  const L = (p) => (child ? kidLegs(p) : p)
  const fr = (armPart, legPart, over = null) => ({ body: [L(legPart), up(head), up(top), up(armPart)], over: over ? [up(over)] : [] })
  const carry = body === 'conch'
  // the shell hangs at the side while not raised
  const hang = carry ? (facing === 'side' ? { 8: '.....c..', 9: '.....C..' } : facing === 'front' ? { 8: '.c......', 9: '.C......' } : { 8: '......c.', 9: '......C.' }) : null
  for (let i = 0; i < 4; i++) out.push(fr(SWING[facing][i], legs.walk[i], hang))
  for (let i = 0; i < 2; i++) out.push(fr(arms.idle[i], legs.stand, hang))
  for (let i = 0; i < 2; i++) out.push(fr(arms.wave[i], legs.stand, hang))
  for (let i = 0; i < 2; i++) out.push(carry ? splitConch(arms.conch[i], legs.stand, up, L, head, top) : fr(arms.chant[i], legs.stand))
  // (no paddle out of a canoe: the stand again)
  for (let i = 0; i < 2; i++) out.push(fr(arms.idle[i], legs.stand, hang))
  return out
}
/** A child's upper body: four rows down, the chest a row shorter. */
function childOf(part) {
  const out = {}
  for (const [row, str] of Object.entries(part)) {
    const r = Number(row)
    if (r === 8) continue
    const to = r + 4
    if (to < 12) out[to] = str
  }
  return out
}
/** The conch raised: the shell (c, C) drawn over, unoutlined; the arms in the body. */
function splitConch(part, legs, up, L, head, top) {
  const arm = {}
  const shell = {}
  for (const [row, str] of Object.entries(part)) {
    arm[row] = str.replace(/[cC]/g, '.')
    shell[row] = str.replace(/[^cC]/g, '.')
  }
  return { body: [L(legs), up(head), up(top), up(arm)], over: [up(shell)] }
}

// --- the dresses: rows of the sheet --------------------------------------------------
const SHIRTS = [
  ['#b23a2e', '#f1dca4'],
  ['#3e6fa6', '#e9e3c9'],
  ['#3f7a4d', '#efe3a8'],
  ['#d8b23c', '#8f3a24'],
  ['#e7e1d3', '#6f97bf'],
  ['#2f8c8a', '#f0e6c8'],
]
const SHORTS_C = [
  ['#a08f66', '#7d6e4c'],
  ['#3e506d', '#2c3a52'],
  ['#d9d3c4', '#b5ae9f'],
]
const MUUMUU = [
  ['#d36b82', '#f5e6d0'],
  ['#4b78b5', '#f0f0e6'],
  ['#e0b84a', '#a8452b'],
  ['#7b4e8e', '#f1d7a8'],
  ['#ece6d8', '#c4473f'],
  ['#d97a3a', '#f6e8c8'],
]
const LEIS = ['#f2d14e', '#f4f0e0', '#e04f6a', '#e8a0c0']

/** Every row: { body, dress, pal (letter → colour), look }. */
function rowsWanted() {
  const rows = []
  const row = (body, dress, look, colours) => rows.push({ body, dress, look, pal: { ...EARTH, l: null, r: null, R: null, ...colours } })
  // 1970s
  SHIRTS.forEach(([t, T], i) => row('man', '1970s', { bottom: 'shorts' }, { t, T, u: SHORTS_C[i % 3][0], U: SHORTS_C[i % 3][1] }))
  row('man', '1970s', { bottom: 'shorts' }, { t: EARTH.s, T: EARTH.d, u: SHORTS_C[1][0], U: SHORTS_C[1][1] })
  row('man', '1970s', { bottom: 'trousers' }, { t: SHIRTS[4][0], T: SHIRTS[4][1], u: '#5a5048', U: '#463e38' })
  row('man', '1970s', { bottom: 'shorts', lei: true }, { t: SHIRTS[0][0], T: SHIRTS[0][1], u: SHORTS_C[0][0], U: SHORTS_C[0][1], l: LEIS[0] })
  row('man', '1970s', { bottom: 'shorts', lei: true }, { t: SHIRTS[4][0], T: SHIRTS[4][1], u: SHORTS_C[1][0], U: SHORTS_C[1][1], l: LEIS[3] })
  MUUMUU.forEach(([r, R], i) => row('woman', '1970s', { bottom: 'skirt', hair: 'long', lei: i === 1 || i === 4 }, { t: r, T: R, r, R, l: i === 1 ? LEIS[1] : LEIS[2] }))
  row('boy', '1970s', { bottom: 'shorts' }, { t: SHIRTS[3][0], T: SHIRTS[3][1], u: SHORTS_C[1][0], U: SHORTS_C[1][1] })
  row('boy', '1970s', { bottom: 'shorts' }, { t: SHIRTS[1][0], T: SHIRTS[1][1], u: SHORTS_C[0][0], U: SHORTS_C[0][1] })
  row('girl', '1970s', { bottom: 'skirt', hair: 'long' }, { t: MUUMUU[0][0], T: MUUMUU[0][1], r: MUUMUU[0][0], R: MUUMUU[0][1] })
  row('girl', '1970s', { bottom: 'skirt', hair: 'long' }, { t: MUUMUU[2][0], T: MUUMUU[2][1], r: MUUMUU[2][0], R: MUUMUU[2][1] })
  row('conch', '1970s', { bottom: 'shorts' }, { t: EARTH.s, T: EARTH.d, u: '#7a2f28', U: '#5a221d' })
  row('conch', '1970s', { bottom: 'shorts', lei: true }, { t: SHIRTS[4][0], T: SHIRTS[4][1], u: SHORTS_C[0][0], U: SHORTS_C[0][1], l: LEIS[0] })
  row('paddler', '1970s', {}, { t: EARTH.s, T: EARTH.d, u: '#7a2f28', U: '#5a221d' })
  row('paddler', '1970s', {}, { t: SHIRTS[4][0], T: SHIRTS[4][1], u: SHORTS_C[1][0], U: SHORTS_C[1][1] })
  // kingdom
  row('man', 'kingdom', { bottom: 'trousers' }, { t: '#e6e0d0', T: '#cfc8b6', u: '#3b3530', U: '#2a2522' })
  row('man', 'kingdom', { bottom: 'trousers' }, { t: '#5c7393', T: '#465a75', u: '#8f8162', U: '#71654c' })
  row('woman', 'kingdom', { bottom: 'skirt', hair: 'long' }, { t: '#2c2728', T: '#4a4245', r: '#2c2728', R: '#4a4245' })
  row('woman', 'kingdom', { bottom: 'skirt', hair: 'long' }, { t: '#e8e2d4', T: '#cbc4b3', r: '#e8e2d4', R: '#cbc4b3' })
  row('woman', 'kingdom', { bottom: 'skirt', hair: 'long' }, { t: '#8c2f2a', T: '#6e2420', r: '#8c2f2a', R: '#6e2420' })
  row('boy', 'kingdom', { bottom: 'shorts' }, { t: '#e6e0d0', T: '#cfc8b6', u: '#3b3530', U: '#2a2522' })
  row('girl', 'kingdom', { bottom: 'skirt', hair: 'long' }, { t: '#e8e2d4', T: '#cbc4b3', r: '#e8e2d4', R: '#cbc4b3' })
  row('conch', 'kingdom', { bottom: 'malo' }, { t: EARTH.s, T: EARTH.d, u: '#9a6a3a', U: '#7a5230' })
  row('paddler', 'kingdom', {}, { t: EARTH.s, T: EARTH.d, u: '#9a6a3a', U: '#7a5230' })
  // precontact
  row('man', 'precontact', { bottom: 'malo' }, { t: EARTH.s, T: EARTH.d, u: '#9a6a3a', U: '#7a5230' })
  row('man', 'precontact', { bottom: 'malo' }, { t: '#b8946a', T: '#8d6b47', u: '#b07a3e', U: '#8a5f30' })
  row('woman', 'precontact', { bottom: 'pau', hair: 'long' }, { t: '#b8946a', T: '#8d6b47', r: '#a5774a', R: '#83603c' })
  row('woman', 'precontact', { bottom: 'pau', hair: 'long', lei: true }, { t: '#c9a77a', T: '#9e7f58', r: '#b08a5a', R: '#8a6a44', l: '#6f8f3a' })
  row('boy', 'precontact', { bottom: 'malo' }, { t: EARTH.s, T: EARTH.d, u: '#9a6a3a', U: '#7a5230' })
  row('girl', 'precontact', { bottom: 'pau', hair: 'long' }, { t: EARTH.s, T: EARTH.d, r: '#a5774a', R: '#83603c' })
  row('conch', 'precontact', { bottom: 'malo' }, { t: EARTH.s, T: EARTH.d, u: '#9a6a3a', U: '#7a5230' })
  row('paddler', 'precontact', {}, { t: EARTH.s, T: EARTH.d, u: '#9a6a3a', U: '#7a5230' })
  return rows
}

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]

function resolve(parts, pal) {
  const g = Array.from({ length: H }, () => new Array(W).fill('.'))
  for (const part of parts) {
    if (!part) continue
    for (const [row, str] of Object.entries(part)) {
      const r = Number(row)
      if (r < 0 || r >= H) continue
      for (let x = 0; x < Math.min(W, str.length); x++) {
        const c = str[x]
        if (c !== '.' && pal[c]) g[r][x] = c
      }
    }
  }
  return g
}

/** One frame in colour: RGBA rows, the outline worked out round the body. */
function paint(fr, pal) {
  const body = resolve(fr.body, pal)
  const over = resolve(fr.over, pal)
  const solid = (x, y) => y >= 0 && y < H && x >= 0 && x < W && BODY.includes(body[y][x])
  const px = new Uint8Array(W * H * 4)
  const put = (x, y, c) => {
    if (c === '.' || !pal[c]) return
    px.set([...hex(pal[c]), 255], (y * W + x) * 4)
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!solid(x, y) && (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1))) put(x, y, 'o')
      put(x, y, body[y][x])
      put(x, y, over[y][x])
    }
  }
  return px
}

/**
 * The sheet: a row for each body in each dress and colouring; across it the
 * side, the front and the back, FRAMES cells each. { width, height, data,
 * rows, of(body, dress) → the rows that body has in that dress (falling back
 * to 1970s), cell(row, anim, frame, facing) → [x, y, w, h] }.
 */
export function buildPeopleSheet() {
  const rows = rowsWanted()
  const width = FACINGS.length * FRAMES * W
  const height = rows.length * H
  const data = new Uint8Array(width * height * 4)
  rows.forEach((r, ri) => {
    r.y = ri * H
    FACINGS.forEach((facing, fc) => {
      frames(r.body, facing, r.look).forEach((fr, fi) => {
        const px = paint(fr, r.pal)
        const x0 = (fc * FRAMES + fi) * W
        for (let y = 0; y < H; y++) data.set(px.subarray(y * W * 4, (y + 1) * W * 4), ((r.y + y) * width + x0) * 4)
      })
    })
  })
  const of = (body, dress) => {
    const list = rows.filter((r) => r.body === body && r.dress === dress)
    return list.length ? list : rows.filter((r) => r.body === body && r.dress === '1970s')
  }
  const cell = (row, anim, f, facing = 0) => {
    const [first, n] = ANIM[anim]
    return [(facing * FRAMES + first + (f % n)) * W, row.y, W, H]
  }
  return { width, height, data, rows, of, cell }
}
