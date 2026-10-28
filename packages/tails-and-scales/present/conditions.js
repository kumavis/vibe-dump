// The conditions (V3a, DESIGN §1.3, §2.11): what the rules put on a unit
// that a player wants explained, above all why it can't shoot or charge
// now, each with its icon, its word on the card and its tip, one or two
// plain sentences saying what it is, what it stops and when it ends. One
// table, keyed by the rules' own names (core/units.js's flags, `mesmerized`,
// the queries' engaged and in cover, the type's noCharge), read by the
// label (view/units.js), the card (ui/card.js, through
// present/hud-model.js's cardStatus), the chips (ui/chips.js) and the
// tooltip (ui/tooltip.js, wired by app/boot.js). Pure, like the rest of
// present/: nothing here decides a rule. canShoot and canCharge
// (core/actions/shoot.js, charge.js) do, and `blocks` only says which of
// them a condition is a reason for; sim/input-check.mjs's tips lane reads
// their source and holds every term that refuses to a condition here, and
// every field the core sets on a unit to CONDITIONS or HIDDEN, so a rule
// that adds one fails it until it is explained.
//
//   CONDITIONS[k] = { icon, title, kind, blocks(t), lifts?, tip(t, ctx) }
//     icon      its glyph, in the game's style (the role and weapon glyphs,
//               the order badges): on the label and the chip while it
//               matters, and ahead of its word on the card; every one has one
//     title     its name, bold at the head of its tip
//     kind      'state'  something the unit is under: on its label while it
//                        matters (labelConds) and on its card
//               'deed'   something it did this turn: on its card, and on its
//                        label in its own turn where it keeps it from
//                        shooting or charging (fell back, advanced, a charge
//                        failed)
//               'trait'  something its type always is: a line of the card's
//                        abilities, and on the label while it matters
//     blocks(t) which of 'shoot' and 'charge' it stops for a unit of type t
//               ([]: none; t null, the type unknown: every one it can stop)
//     lifts     (advanced) the type and weapon flags that take a block
//               away (canShoot's assault, canCharge's chargeAfterAdvance)
//     tip(t, ctx)  its tip's HTML: `ctx` { own (the unit's seat's turn on
//               the table), y (its height), advRoll, lost }
//
//   labelConds(t, side, mu, f, M)  the conditions a unit's label shows, in
//                                  order (its chip's too, but its height)
//   cardConds(t, mu, f)       those its card's status line words: [{ k, word }]
//   tipOf(k, t, ctx)          condition k's tip, its icon and title ahead
//   ctxOf(side, mu, f, M)     the tip's context for a unit as shown
//   unitTip(t, mu, ks, ctx)   a unit's own tip: its name and what of it
//                             stands, then the tips of conditions `ks` (a
//                             hover over its figure, input/human.js, or its
//                             chip)
//
// `mu` is the unit as shown (the mirror's: present/mirror.js), `f` its facts
// (present/hud-model.js's factOf: what it did this turn, its cover, the
// match's while the table has caught up, else the record of the last action
// played), `M` the mirror (its stage, the seat whose turn it is, the phase).
// A deed's condition (fell back, advanced, a charge failed) is on a label
// only in its own seat's turn, where it is the reason it can't act: the
// facts keep it through the other seat's turn, as the card tells it.

// a unit standing higher than this (the nav's 0.4" step: view/units.js's
// RAISED) is on high ground
export const HIGH_GROUND = 0.4

const any = (t, k) => !t || !!k
// what a unit of type t may still do, said after a block: its weapon's name
const gun = (t) => (t?.ranged ? t.ranged.name : 'its weapon')
// a list of verbs, "shoot or charge"
const or = (xs) => xs.join(' or ')
const inches = (n) => `${+(+n).toFixed(1)}"`

export const CONDITIONS = Object.freeze({
  mesmerized: {
    icon: '🌀', title: 'Mesmerized', kind: 'state',
    blocks: () => ['shoot', 'charge'],
    tip: (t, c) => `A spell holds it: it can't shoot or charge, and hits at −1 in a fight. It wears off at the end of ${c?.own ? 'this turn' : 'its own next turn'}.`,
  },
  engaged: {
    icon: '⚔', title: 'In combat', kind: 'state',
    blocks: () => ['shoot', 'charge'],
    tip: () => `An enemy is within 1": it can't shoot or charge, and it fights in the Fight phase. It ends when the fight does, or when it falls back in its Movement.`,
  },
  fellBack: {
    icon: '↩', title: 'Fell back', kind: 'deed',
    blocks: () => ['shoot', 'charge'],
    tip: () => `It walked out of a fight this turn, so it can't shoot or charge until its next turn.`,
  },
  advanced: {
    icon: '💨', title: 'Advanced', kind: 'deed',
    // (canShoot: a weapon with no `assault`; canCharge: a type without
    // `chargeAfterAdvance`, and one that never charges has nothing to lose)
    blocks: (t) => [...(any(t, t?.ranged && !t.ranged.assault) ? ['shoot'] : []), ...(any(t, !t?.chargeAfterAdvance && !t?.noCharge) ? ['charge'] : [])],
    lifts: Object.freeze(['assault', 'chargeAfterAdvance']),
    tip: (t, c) => {
      const no = CONDITIONS.advanced.blocks(t)
      const ran = `It ran ${c?.advRoll ? `${inches(c.advRoll)} farther (its D6)` : 'a D6" farther'} this turn`
      const yet = [...(t?.ranged?.assault ? [`its ${gun(t)} may still shoot (assault)`] : []), ...(t?.chargeAfterAdvance ? ['it may still charge'] : [])]
      return no.length ? `${ran}, so it can't ${or(no)} until its next turn${yet.length ? `; ${yet.join(', and ')}` : ''}.` : `${ran}; ${yet.join(', and ') || 'it gives up nothing for it'}.`
    },
  },
  chargeTried: {
    icon: '✖', title: 'Charge failed', kind: 'deed',
    blocks: () => ['charge'],
    tip: () => `Its charge roll fell short this turn, so it can't try another until its next turn.`,
  },
  noCharge: {
    icon: '🚫', title: 'Never charges', kind: 'trait',
    blocks: () => ['charge'],
    tip: () => `A war machine stays put in the Charge phase. It shoots as ever, and fights when an enemy comes to it.`,
  },
  cover: {
    icon: '🛡', title: 'In cover', kind: 'state',
    blocks: () => [],
    tip: () => `Half its models or more stand in scenery: shots at it save 1 better (a 4+ save is a 3+). Fliers never take cover.`,
  },
  high: {
    icon: '▲', title: 'High ground', kind: 'state',
    blocks: () => [],
    tip: () => `It stands on a deck or a stair: it sees over hedges and ruins, and its lobbed shots carry farther. It ends when it comes down.`,
  },
  lost: {
    icon: '💔', title: 'Losses', kind: 'state',
    blocks: () => [],
    tip: (t, c) => `It lost ${c?.lost ? `${c.lost} model${c.lost > 1 ? 's' : ''}` : 'models'} this turn: at the turn's end it tests its nerve, a D6 plus its losses against its Leadership, and one model flees for each point over.`,
  },
  moved: {
    icon: '👣', title: 'Moved', kind: 'deed',
    blocks: () => [],
    tip: (t) => `It has made its move this turn.${t?.ranged?.heavy ? ` Its ${gun(t)} is heavy: −1 to hit after moving.` : ''}`,
  },
  shot: {
    icon: '➹', title: 'Shot', kind: 'deed',
    blocks: () => ['shoot'],
    tip: (t) => `It has fired this turn.${t && !t.noCharge ? ' It may still charge.' : ''}`,
  },
  charged: {
    icon: '⚡', title: 'Charged', kind: 'deed',
    blocks: () => ['charge'],
    tip: () => `It charged home this turn, and strikes first in the Fight phase.`,
  },
  // (F9a) a rider: aboard its hull, and stepped off one that moved
  aboard: {
    icon: '▣', title: 'Aboard', kind: 'state',
    blocks: () => ['shoot', 'charge'],
    tip: () => `It rides inside a vehicle: it can't move, shoot or charge until it steps off, which is its move for the turn. Its hull's guns fire for it.`,
  },
  rode: {
    icon: '⤓', title: 'Stepped off', kind: 'deed',
    blocks: () => ['charge'],
    tip: () => `It stepped off a vehicle that moved this turn, so it can't charge until its next turn. It may still shoot.`,
  },
})

// The fields the rules set on a unit, or the facts carry, that no player is
// shown, each with why (sim/input-check.mjs's tips lane: every one the core
// sets is a condition or here).
export const HIDDEN = Object.freeze({
  riders: "(F9a) a transport's riders: its label and its card list them",
  advRoll: "the advance's roll: told with `advanced`, its inches",
  chargeTarget: 'whom a charge reached: the fight strikes it first, as the battle log tells',
  fought: "the fight phase's own tally of who has struck, cleared as the phase ends",
  side: 'the seat: the label and the card are in its colour',
})

// condition k's tip: its icon and title, bold, then what it is, as the
// card's abilities read ("Sidewind — may charge after Advancing.")
export function tipOf(k, t = null, ctx = {}) {
  const c = CONDITIONS[k]
  if (!c) return ''
  const head = k === 'high' && ctx?.y > HIGH_GROUND ? `${c.title}, ${inches(ctx.y)} up` : k === 'advanced' && ctx?.advRoll ? `${c.title} +${ctx.advRoll}"` : c.title
  const text = c.tip(t, ctx)
  return `<b>${c.icon ? `${c.icon} ` : ''}${head}</b> — ${text[0].toLowerCase()}${text.slice(1)}`
}

// whether it is unit `side`'s seat's turn on the table
const ownTurn = (M, side) => M?.stage === 'battle' && M.active === side

// The tip's context for a unit as shown: its seat's turn, its height, its
// advance's roll and its losses.
export const ctxOf = (side, mu, f, M) => ({ own: ownTurn(M, side), y: mu?.y ?? 0, advRoll: f?.advRoll, lost: f?.lost ?? 0 })

// The conditions a unit of type `t` and seat `side` shows on its label,
// in order: mesmerized, in combat, and in its own seat's turn what it did
// that keeps it from shooting or charging (fell back, advanced where that
// costs it something, a charge failed), the war machine's in its Charge
// phase; then its height. A unit fallen shows none.
export function labelConds(t, side, mu, f, M) {
  if (!(mu?.alive > 0)) return []
  const out = []
  if (mu.mesmerized) out.push('mesmerized')
  if (mu.engaged) out.push('engaged')
  if (ownTurn(M, side) && f) {
    if (f.fellBack) out.push('fellBack')
    else if (f.advanced && CONDITIONS.advanced.blocks(t).length) out.push('advanced')
    if (f.chargeTried && !f.charged) out.push('chargeTried')
    // ((F9a) stepped off a hull that moved: no charge this turn)
    if (f.rode && !f.charged && !t?.noCharge) out.push('rode')
  }
  if (t?.noCharge && ownTurn(M, side) && M.phase === 'charge') out.push('noCharge')
  if ((mu.y ?? 0) > HIGH_GROUND) out.push('high')
  return out
}

// A unit's tip: its name and what of it stands (the line a hover over its
// figure always gave; `extra` goes on it: (F9a) a transport's riders aboard,
// a rider's hull), then each of conditions `ks` told, a line each.
export function unitTip(t, mu, ks = [], ctx = {}, extra = '') {
  const line = `${t.name} · ${t.models > 1 ? `${mu.alive}/${t.models} models` : `${mu.models[0].w}/${t.W} wounds`}${extra}`
  return [line, ...ks.map((k) => tipOf(k, t, ctx))].join('<br>')
}

// The card's status line after what of the unit stands: [{ k, word }], each
// its condition's (k null: a word no tip explains). What it did this turn
// (fell back, advanced, moved; shot; charged or a charge failed), then what
// it is under (mesmerized, in combat, in cover, its losses). Its height is
// the card's own span (ui/card.js), and a war machine's never charging a
// line of its abilities (statsHtml).
export function cardConds(t, mu, f) {
  const out = []
  const put = (k, word) => out.push({ k, word: CONDITIONS[k]?.icon ? `${CONDITIONS[k].icon} ${word}` : word })
  if (f?.moved) f.fellBack ? put('fellBack', 'fell back') : f.advanced ? put('advanced', `advanced +${f.advRoll}"`) : f.rode ? put('rode', 'stepped off') : put('moved', 'moved')
  if (f?.shot) put('shot', 'shot')
  if (f?.charged) put('charged', 'charged')
  else if (f?.chargeTried) put('chargeTried', 'charge failed')
  if (mu.mesmerized) put('mesmerized', 'mesmerized')
  if (mu.alive > 0 && mu.aboard) put('aboard', 'aboard')
  if (mu.alive > 0 && mu.engaged) put('engaged', 'in combat')
  if (mu.alive > 0 && f?.cover) put('cover', 'in cover')
  if (mu.alive > 0 && f?.lost > 0 && t?.models > 1) put('lost', `lost ${f.lost}`)
  return out
}
