// How each character looks on stage, keyed by cast id (src/cast.js holds who they are and how they
// sound; this file holds only visuals). Any id not listed gets lookFor()'s default: a signature
// hue picked from GUEST_HUES by the id's hash and a hoodie.
//
// A look:
//   color     the character's signature colour (caption name, chyron, costume trim)
//   head      overrides for the 3D head's palette (see engine/palette.js headPalette); by default the
//             head's structure is drawn in `color`, the articulators in chimera's slot colours
//   costume   { kind, color, trim, … } — kinds: tux, band, announcer, suit, hoodie, cardigan,
//             labcoat, turtleneck, tee, terminal (an AI agent's boxy bot body). See stage/costumes.js.
//   scale     head size multiplier (1 = adult)
//   handle    shown on chyrons (cast.js's `handle` wins)
//   fx        a default puppet effect: 'hologram' | 'monitor' (see show.puppet(id).fx)
//   prop      a prop that stands beside them: 'contraption' (unveil with show.puppet(id).prop({ unveil }))
//
// Segment authors: add your guests here (or pass a look to show.puppet(id).dress({...}) at runtime).
import { headPalette } from './engine/palette.js'
import { hashSeed } from './kit/ease.js'

const look = (color, costume, extra = {}) => ({ color, head: headPalette(extra.headColor ?? color, extra.headOver), costume, scale: 1, ...extra })

export const LOOKS = {
  larry: look('#ffc861', { kind: 'tux', color: '#ffd27a', shirt: '#fff3d6', tie: '#ffb340', square: '#ff73cf' }, {
    handle: '@larry.nx',
    headOver: { blueMid: '#e4ab50', blueDim: '#a3762f', frame: '#4a3514' },
  }),
  sibyl: look('#c9d8ff', { kind: 'announcer', color: '#9fb7ff', trim: '#eef6f8' }, { handle: '@sibyl.ant' }),
  // Hy Oid & The Formants: matching bandstand jackets in magenta with gold trim, each head its own hue
  hy: look('#ff73cf', { kind: 'band', color: '#ff5fd2', trim: '#ffc861', monogram: 'F' }, { handle: '@hyoid.band' }),
  al: look('#58f0e8', { kind: 'band', color: '#ff5fd2', trim: '#ffc861', monogram: 'F' }, { handle: '@alveolar.band' }),
  dee: look('#b6ff5c', { kind: 'band', color: '#ff5fd2', trim: '#ffc861', monogram: 'F' }, { handle: '@deephthong.band' }),
  pete: look('#ff9a5c', { kind: 'band', color: '#ff5fd2', trim: '#ffc861', monogram: 'F' }, { handle: '@plosivepete.band' }),

  // ---- the correspondents
  eppy: look('#ff7a2e', { kind: 'blazer', color: '#ff7a2e', trim: '#ffc861', crest: true, holds: 'headset' }),
  bot: look('#5effc8', { kind: 'terminal', color: '#5effc8', model: 'WEBSITE-BOT', text: ['> npm create site', '> it builds!', '> deploy: yes', '> PARTY!'], holds: 'popper' }, { scale: 0.85 }),

  // ---- guests (puppets playing posting personas — the chyron says so)
  norvid: look('#9a6bff', { kind: 'featherCoat', color: '#5a3d9e', trim: '#b98cff', holds: 'clipboard', clipText: 'LIST OF' }),
  abel: look('#3fd17a', { kind: 'cardigan', color: '#3fd17a', shirt: '#b6ff5c', trim: '#eef6f8' }, { prop: 'contraption' }),
  samantha: look('#34e0ff', { kind: 'blazer', color: '#34e0ff', shirt: '#eef6f8', trim: '#ffffff', holds: 'clicker' }),
  void: look('#d8dde3', { kind: 'terminal', color: '#d8dde3', model: 'VOID', text: ['> observe', '> decelerate clock', '> respond: 1/day', '> .'] }, { headOver: { green: '#c8f7ff', red: '#9aa3ad', pink: '#e6e9ee' } }),
  prerat: look('#9ccfff', { kind: 'hoodie', color: '#9ccfff', trim: '#d6ecff', logo: false }, { fx: 'hologram' }),
  borjev: look('#c8956a', { kind: 'terminal', color: '#c8956a', model: 'BORJEV', text: ['> opt-in only', '> consent: y', '> hello'] }, { scale: 0.62 }),
}

/** signature hues handed to guests nobody has styled yet */
export const GUEST_HUES = ['#58f0e8', '#a98bff', '#b6ff5c', '#ff7a5c', '#ff5fd2', '#7cc4ff', '#5be381', '#f08cff']

/** costume kinds a guest can wear (see stage/costumes.js for the parameters each takes) */
export const COSTUME_KINDS = ['tux', 'band', 'announcer', 'suit', 'blazer', 'hoodie', 'cardigan', 'labcoat', 'turtleneck', 'tee', 'featherCoat', 'terminal']

/** the look for any cast id (unknown ids get a deterministic default) */
export function lookFor(id) {
  if (LOOKS[id]) return LOOKS[id]
  const h = hashSeed(id)
  const color = GUEST_HUES[h % GUEST_HUES.length]
  const l = look(color, { kind: 'hoodie', color })
  LOOKS[id] = l
  return l
}

/** register or replace a look at runtime (segments may call this from setup) */
export function defineLook(id, spec) {
  const color = spec.color ?? lookFor(id).color
  LOOKS[id] = { ...look(color, { kind: 'hoodie', color }, { headColor: spec.headColor, headOver: spec.headOver }), ...spec, head: spec.head ?? headPalette(spec.headColor ?? color, spec.headOver) }
  return LOOKS[id]
}
