import { pick, range, chance, clamp01 } from './rng.js'
import { goodById } from './goods.js'

// ---------------------------------------------------------------------------
// Personas: who a character IS. Name, backstory, temperament. The attribute
// vector is what the economy actually consumes — greed, patience, charm and
// temper each measurably bend haggling (see economy.js checks) — while the
// backstory is written FROM those numbers, so the prose in the inspector
// panel and the behaviour on the plaza agree with each other.
// ---------------------------------------------------------------------------

const SYLL = {
  human: { a: ['Se', 'Mi', 'Ta', 'Jo', 'Ru', 'Al', 'Be', 'Ka', 'Fen', 'Or'], b: ['ra', 'fa', 'rin', 'mal', 'dan', 'sha', 'lo', 'ver', 'na', 'bel'] },
  alien: { a: ["Zx'", "Vr'", 'Xel', 'Qui', 'Ilx', "Th'", 'Zzi', 'Oorv'], b: ['eek', 'ilith', 'oon', 'ax', 'ubi', 'esh', 'arn', 'ptic'] },
  monster: { a: ['Grub', 'Thok', 'Marg', 'Bruk', 'Snag', 'Hurl', 'Dreg', 'Gnash'], b: ['bins', 'ka', 'oth', 'nar', 'tusk', 'maw', 'gut', 'jaw'] },
  devil: { a: ['Mala', 'Bez', 'Vex', 'Aszh', 'Cro', 'Nihil', 'Mor', 'Sar'], b: ['chor', 'reth', 'ius', 'avel', 'goth', 'issa', 'dane', 'quel'] },
}

const ORIGIN = {
  human: [
    'walked here from the salt flats with one boot',
    'jumped ship from a spice freighter and never looked back',
    'was born under this very awning during the Long Eclipse',
    'used to keep the ledgers for a duke who is now a toad',
  ],
  alien: [
    'crash-landed in the fountain three seasons ago and stayed for the smells',
    'is saving up for a return ticket to a moon that no longer exists',
    'reads four currencies at once and dreams in a fifth',
    'molted last spring and sold the old shell at a shameful discount',
  ],
  monster: [
    'was banned from two other markets for enthusiastic sneezing',
    'once guarded a bridge, but the tolls dried up',
    'ate the previous owner of this pitch (a misunderstanding)',
    'sharpened teeth on shipwrecks before going respectable',
  ],
  devil: [
    'is on sabbatical from the Third Circle collections office',
    'holds the notarised deed to at least one patron soul here',
    'retired from cursing after the guild dues got absurd',
    'came up through contract law and it shows',
  ],
}

const QUIRK = [
  'counts change twice, loudly',
  'claims every item once belonged to a minor king',
  'hums when a deal is going well',
  'keeps a lucky coin nailed to the counter',
  'will not trade during moonrise',
  'smells lies (allegedly)',
  'names every coin before spending it',
  'collects arguments the way others collect stamps',
  'tips buskers only in prime numbers',
  'insists the fountain whispers market tips',
]

const CUSTOMER_JOB = [
  'off-shift dock hauler', 'apprentice moth-wrangler', 'retired sky-ferry pilot', 'fountain-cleaner third class',
  'freelance rumor courier', 'night-soil alchemist', 'assistant to a sleeping wizard', 'union bell-ringer',
  'map-seller between maps', 'chaperone of caravan cats',
]

// Conjugated for "they" — every template splices this after a plural pronoun.
function attrLine(attrs) {
  const bits = []
  if (attrs.greed > 0.66) bits.push('drive a merciless bargain')
  else if (attrs.greed < 0.33) bits.push('barely care about the coin')
  if (attrs.patience > 0.66) bits.push('will haggle until the moons set')
  else if (attrs.patience < 0.33) bits.push('walk away fast')
  if (attrs.charm > 0.66) bits.push('could sell fog to a cloud')
  if (attrs.temper > 0.66) bits.push('flare up when lowballed')
  return bits.length ? bits.join(', ') : 'are, by bazaar standards, reasonable'
}

/**
 * @param {() => number} rng
 * @param {{species:string, role:string, goodIds?:string[]}} o
 */
export function generatePersona(rng, { species, role, goodIds = [] }) {
  const s = SYLL[species]
  let name = pick(rng, s.a) + pick(rng, s.b)
  if (species === 'human' && chance(rng, 0.3)) name = pick(rng, ['Old ', 'Young ', 'Honest ']) + name

  const bias = {
    human: { greed: 0, patience: 0, charm: 0.05, temper: 0 },
    alien: { greed: -0.05, patience: 0.15, charm: 0, temper: -0.1 },
    monster: { greed: 0, patience: -0.15, charm: -0.1, temper: 0.25 },
    devil: { greed: 0.2, patience: 0.1, charm: 0.15, temper: 0.05 },
  }[species]
  const attrs = {
    greed: clamp01(range(rng, 0.15, 0.85) + bias.greed + (role === 'vendor' ? 0.1 : 0)),
    patience: clamp01(range(rng, 0.15, 0.85) + bias.patience),
    charm: clamp01(range(rng, 0.15, 0.85) + bias.charm),
    temper: clamp01(range(rng, 0.15, 0.85) + bias.temper),
  }
  const wealth = clamp01(range(rng, 0.1, 0.9) + (role === 'vendor' ? 0.15 : 0) + (species === 'devil' ? 0.1 : 0))

  let title
  if (role === 'vendor') {
    const g = goodById(goodIds[0])
    title = `${g.name} monger`
  } else if (role === 'busker') {
    title = 'street musician'
  } else {
    title = pick(rng, CUSTOMER_JOB)
  }

  const origin = pick(rng, ORIGIN[species])
  const quirk = pick(rng, QUIRK)
  const trade =
    role === 'vendor'
      ? `Now they hawk ${goodIds.map((id) => goodById(id).name.toLowerCase()).join(' and ')} and ${attrLine(attrs)}.`
      : role === 'busker'
        ? `Now they play for coins and ${attrLine(attrs)}.`
        : `By day ${/^[aeiou]/i.test(title) ? 'an' : 'a'} ${title}; at the stalls they ${attrLine(attrs)}.`
  const backstory = `${name} ${origin}. ${trade} ${name} ${quirk}.`

  return { name, title, backstory, attrs, wealth, quirk }
}
