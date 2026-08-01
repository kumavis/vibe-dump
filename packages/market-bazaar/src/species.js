import { pick, range, chance, irange } from './rng.js'

// ---------------------------------------------------------------------------
// Species → appearance parameters. Everything the rig and body builders need
// to make one unique individual: proportions, palette, features. Pure data,
// no three.js. Attribute/backstory generation lives in persona.js; this file
// is only about what a character LOOKS like.
// ---------------------------------------------------------------------------

const SKIN = {
  human: [0xe8b48c, 0xd49a6a, 0xb07a4e, 0x8a5a38, 0x6e4428, 0xf0c8a0],
  alien: [0x6fbf6a, 0x4da8a0, 0x7a6fd4, 0x5a9ad4, 0x9ad45a, 0x50c8b4],
  monster: [0x8a6a42, 0x6a7a52, 0x707a86, 0xa06a4a, 0x5a6a5a, 0x96784f],
  devil: [0xc0392b, 0x8e2a3a, 0x7a2a5a, 0xd4502a, 0xa03050],
}

const CLOTH = [0xc0392b, 0xe6a817, 0x189e93, 0x7d4fbe, 0xc2527f, 0x3a6ea5, 0x8a9a2a, 0xb85a30]
const CLOTH_DARK = [0x4a3a5a, 0x3a4a3a, 0x5a3a2a, 0x2a3a5a, 0x5a2a2a]
const HAIR = [0x241a12, 0x4a2a12, 0x8a4a1e, 0x8a8a92, 0xe8e0d0, 0x1e2a42, 0x5a2a3a]
const EYE_GLOW = [0xffd24a, 0xff7a3a, 0xfff0a0]
const EYE_IRIS = [0x3a2a1a, 0x2a4a6a, 0x2a5a3a, 0x5a3a1a, 0x6a2a4a]

/**
 * @param {() => number} rng
 * @param {'human'|'alien'|'monster'|'devil'} species
 * @param {'vendor'|'customer'|'busker'} role
 */
export function generateAppearance(rng, species, role) {
  const a = {
    species,
    role,
    // --- proportions (consumed by rig.js) ---
    height: 1.7,
    legginess: range(rng, 0.35, 0.65),
    headSize: 0.11,
    shoulderW: 0.19,
    hipW: 0.09,
    armLen: 0.56,
    neckLen: 0.05,
    hunch: range(rng, 0, 0.15),
    footLen: 0.13,
    tailSegs: 0,
    tailLen: 0,
    antennae: false,
    // --- features ---
    limbThick: 0.042,
    belly: range(rng, 0.1, 0.5),
    eyeCount: 2,
    eyeScale: 1,
    eyeGlow: false,
    snout: 0,
    fangs: false,
    horns: null, // {style:'straight'|'curved'|'ram', size}
    earStyle: 'round',
    hat: 'none',
    beard: 0,
    tailSpade: false,
    instrument: null, // buskers: 'drum' | 'flute'
    // --- individuation: hair + accessories (assigned per species below) ---
    hairStyle: 'none', // bob|bun|ponytail|braids|topknot|mane|crest
    hairColor: pick(rng, HAIR),
    earrings: false,
    necklace: 'none', // 'pendant' | 'teeth'
    glasses: false,
    eyepatch: false,
    sash: false,
    satchel: false,
    beltPouches: false,
    headscarf: false,
    cuffs: chance(rng, 0.4),
    collar: false,
    cape: false,
    stripes: chance(rng, 0.3),
    // --- palette ---
    skin: pick(rng, SKIN[species]),
    cloth: pick(rng, CLOTH),
    cloth2: pick(rng, CLOTH_DARK),
    accent: pick(rng, CLOTH),
    eye: pick(rng, EYE_IRIS),
    robe: chance(rng, 0.35), // long tunic vs short
  }

  if (species === 'human') {
    a.height = range(rng, 1.55, 1.85)
    a.headSize = range(rng, 0.1, 0.115)
    a.shoulderW = range(rng, 0.17, 0.21)
    a.armLen = a.height * range(rng, 0.31, 0.34)
    a.belly = range(rng, 0.1, 0.7)
    a.hat = pick(rng, ['none', 'brim', 'cone', 'fez', 'brim', 'none'])
    a.beard = chance(rng, 0.4) ? range(rng, 0.4, 1) : 0
    a.earStyle = 'round'
  } else if (species === 'alien') {
    a.height = range(rng, 1.35, 1.75)
    a.headSize = range(rng, 0.125, 0.15)
    a.shoulderW = range(rng, 0.14, 0.17)
    a.hipW = range(rng, 0.07, 0.09)
    a.armLen = a.height * range(rng, 0.34, 0.38)
    a.limbThick = range(rng, 0.028, 0.038)
    a.belly = range(rng, 0, 0.3)
    a.antennae = chance(rng, 0.7)
    a.eyeCount = pick(rng, [2, 2, 2, 3])
    a.eyeScale = range(rng, 1.5, 2.1)
    a.earStyle = chance(rng, 0.5) ? 'fin' : 'none'
    a.neckLen = range(rng, 0.055, 0.085)
    if (chance(rng, 0.25)) {
      a.tailSegs = 3
      a.tailLen = range(rng, 0.3, 0.45)
    }
  } else if (species === 'monster') {
    a.height = range(rng, 1.85, 2.25)
    a.headSize = range(rng, 0.12, 0.14)
    a.shoulderW = range(rng, 0.24, 0.3)
    a.hipW = range(rng, 0.1, 0.13)
    a.armLen = a.height * range(rng, 0.34, 0.37)
    a.limbThick = range(rng, 0.06, 0.08)
    a.belly = range(rng, 0.4, 0.9)
    a.hunch = range(rng, 0.45, 0.85)
    a.eyeCount = chance(rng, 0.3) ? 1 : 2
    a.eyeScale = a.eyeCount === 1 ? 1.9 : range(rng, 0.9, 1.2)
    a.snout = range(rng, 0.5, 1)
    a.fangs = chance(rng, 0.8)
    a.earStyle = 'point'
    if (chance(rng, 0.55)) a.horns = { style: pick(rng, ['straight', 'curved']), size: range(rng, 0.7, 1.2) }
    if (chance(rng, 0.45)) {
      a.tailSegs = 4
      a.tailLen = range(rng, 0.45, 0.7)
    }
    a.robe = chance(rng, 0.2)
  } else if (species === 'devil') {
    a.height = range(rng, 1.6, 1.95)
    a.headSize = range(rng, 0.105, 0.12)
    a.shoulderW = range(rng, 0.17, 0.2)
    a.armLen = a.height * range(rng, 0.32, 0.35)
    a.limbThick = range(rng, 0.036, 0.046)
    a.belly = range(rng, 0, 0.35)
    a.eyeGlow = true
    a.eye = pick(rng, EYE_GLOW)
    a.snout = range(rng, 0.1, 0.35)
    a.fangs = chance(rng, 0.5)
    a.horns = { style: pick(rng, ['curved', 'ram', 'straight']), size: range(rng, 0.8, 1.3) }
    a.earStyle = 'point'
    a.beard = chance(rng, 0.6) ? range(rng, 0.5, 1) : 0
    a.tailSegs = 4
    a.tailLen = range(rng, 0.5, 0.75)
    a.tailSpade = true
    a.robe = chance(rng, 0.5)
  }

  // --- individuation pass: hair + accessories, weighted by species/role ----
  if (species === 'human') {
    if (a.hat === 'none' && chance(rng, 0.28)) a.headscarf = true
    a.hairStyle =
      a.hat !== 'none' || a.headscarf
        ? pick(rng, ['ponytail', 'braids', 'none', 'none'])
        : pick(rng, ['bob', 'bun', 'ponytail', 'braids', 'topknot', 'none'])
    a.earrings = chance(rng, 0.35)
    a.eyepatch = chance(rng, 0.08)
  } else if (species === 'alien') {
    if (!a.antennae && chance(rng, 0.55)) a.hairStyle = 'crest'
    a.earrings = a.earStyle !== 'none' && chance(rng, 0.2)
    a.glasses = a.eyeCount === 2 && chance(rng, 0.3)
  } else if (species === 'monster') {
    if (chance(rng, 0.5)) a.hairStyle = 'mane'
    a.earrings = chance(rng, 0.3)
    a.eyepatch = a.eyeCount === 2 && chance(rng, 0.18)
    if (chance(rng, 0.4)) a.necklace = 'teeth'
    if (a.hat === 'none' && chance(rng, 0.12)) a.headscarf = true
  } else if (species === 'devil') {
    a.hairStyle = pick(rng, ['none', 'none', 'topknot', 'bob'])
    a.earrings = chance(rng, 0.6)
    if (chance(rng, 0.5)) a.necklace = 'pendant'
    a.eyepatch = chance(rng, 0.1)
    a.cape = chance(rng, 0.35)
  }
  if (a.eyepatch) a.glasses = false
  if (a.necklace === 'none' && chance(rng, role === 'vendor' ? 0.45 : 0.25)) a.necklace = 'pendant'
  else if (a.necklace === 'none' && chance(rng, 0.35)) a.collar = true
  a.sash = chance(rng, role === 'customer' ? 0.25 : 0.18)
  a.satchel = !a.sash && chance(rng, role === 'customer' ? 0.45 : role === 'busker' ? 0.3 : 0.1)
  a.beltPouches = chance(rng, role === 'vendor' ? 0.6 : 0.2)
  if (role === 'vendor' && !a.cape && chance(rng, 0.2)) a.cape = true

  if (role === 'busker') {
    a.sash = true
    a.satchel = false
    a.instrument = chance(rng, 0.5) ? 'drum' : 'flute'
    a.cloth = pick(rng, [0xe6a817, 0xc2527f, 0x189e93]) // buskers dress loud
    a.hat = a.species === 'human' ? 'cone' : a.hat
  }
  // (no fez for three-eyed aliens — it sits through the third eye)
  if (role === 'vendor' && a.hat === 'none' && a.eyeCount !== 3 && chance(rng, 0.5)) a.hat = 'fez'

  return a
}

/** All species, for random draws with rough crowd weighting. */
export const SPECIES = ['human', 'human', 'alien', 'alien', 'monster', 'devil']

/** Small display glyph per species for the UI panel. */
export const SPECIES_LABEL = {
  human: 'Human',
  alien: 'Alien',
  monster: 'Monster',
  devil: 'Devil',
}
