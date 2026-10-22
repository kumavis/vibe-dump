// The kits' colours (ENGINEERING.md §6 paletteFor): the names kits/ships.json
// and kits/aircraft.json use, as linear RGB for the vertex colours. Pure JS.
//
// None of these is from a primary paint chip (R6 Table S8 and A6: SHIPS-2 and
// the IJN arsenal greys were not reached); they are the engine's readings of
// the usual descriptions, marked verify in research/engine.md. The US
// measures are schemes of several colours: schemeFor() gives the bands a hull
// is painted in (lower to upper) and whether it is a dazzle pattern.

const hex = (h) => {
  const v = parseInt(h.replace('#', ''), 16)
  const c = [(v >> 16) & 255, (v >> 8) & 255, v & 255].map((x) => x / 255)
  return c.map((x) => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)))
}

const COLOURS = {
  // Imperial Japanese Navy hulls: the four arsenals' warship grey, Kure the darkest by the usual telling
  'ijn-kure-grey': '#6a6e70',
  'ijn-sasebo-grey': '#767b7b',
  'ijn-maizuru-grey': '#7c8180',
  'ijn-yokosuka-grey': '#80868a',
  'ijn-black': '#222527',
  // US Navy paints (SHIPS-2's names)
  'dark-grey-5d': '#4c5257',
  'light-grey-5l': '#9ea3a4',
  'sea-blue-5s': '#38495c',
  'navy-blue-5n': '#2d3846',
  'ocean-grey-5o': '#5d676f',
  'haze-grey-5h': '#8b939a',
  'pale-grey-5p': '#b9bebf',
  'dull-black-bk': '#1b1e21',
  'hospital-white': '#e6e7e1',
  'hospital-green': '#3e7a4c',
  // decks
  wood: '#9b7d57',
  linoleum: '#6a4934',
  'deck-grey': '#5b6066',
  'deck-blue': '#2f3b4a',
  'blue-stain': '#2f3b4a',
  'flight-deck-line': '#e8e6dc',
  // aircraft
  'ijn-ameiro': '#a9ab90',
  'ijn-green': '#3a4733',
  'ijn-grey': '#9b9f9b',
  'ijn-cowl': '#1d2124',
  'blue-grey': '#5f7381',
  'light-grey': '#b3b8b9',
  'sea-blue': '#2e3e56',
  'intermediate-blue': '#4c6584',
  'insignia-white': '#e8eae6',
  'glossy-sea-blue': '#1e293b',
  'olive-drab': '#4e4b33',
  'neutral-grey': '#878b89',
  white: '#ececE6',
  'natural-metal': '#b1b5b9',
  canopy: '#3a4a58',
  prop: '#202326',
  // effects
  'smoke-black': '#202020',
}

const LINEAR = Object.fromEntries(Object.entries(COLOURS).map(([k, v]) => [k, hex(v)]))

/** A named colour as linear [r, g, b]; throws on a name the kits may not use. */
export function paletteFor(name) {
  const c = LINEAR[name] ?? (SCHEMES[name] ? LINEAR[SCHEMES[name].bands[0]] : null)
  if (!c) throw new Error(`palette: no colour “${name}”`)
  return c
}

/**
 * The hull schemes: bands of colour from the waterline up, as fractions of
 * the height to the funnel tops, and dazzle for the 1944 designs. The IJN
 * greys are one band.
 */
export const SCHEMES = {
  'ijn-kure-grey': { bands: ['ijn-kure-grey'] },
  'ijn-sasebo-grey': { bands: ['ijn-sasebo-grey'] },
  'ijn-maizuru-grey': { bands: ['ijn-maizuru-grey'] },
  'ijn-yokosuka-grey': { bands: ['ijn-yokosuka-grey'] },
  'ijn-black': { bands: ['ijn-black'] },
  // Measure 1: Dark Gray 5-D to the funnel tops, Light Gray 5-L above
  'ms-1': { bands: ['dark-grey-5d', 'light-grey-5l'], splits: [0.85] },
  // Measure 11: Sea Blue 5-S on all vertical surfaces
  'ms-11': { bands: ['sea-blue-5s'] },
  // Measure 12: Navy Blue to the main deck, Ocean Gray to the funnel tops' level, Haze Gray above
  'ms-12': { bands: ['navy-blue-5n', 'ocean-grey-5o', 'haze-grey-5h'], splits: [0.25, 0.75] },
  // Measure 21: Navy Blue 5-N on all vertical surfaces
  'ms-21': { bands: ['navy-blue-5n'] },
  // Measure 22: Navy Blue below the lowest point of the main deck, Haze Gray above
  'ms-22': { bands: ['navy-blue-5n', 'haze-grey-5h'], splits: [0.22] },
  // Measure 32: a dazzle design in dark, medium and light colours
  'ms-32': { bands: ['dull-black-bk', 'ocean-grey-5o', 'pale-grey-5p'], dazzle: true },
  'hospital-white': { bands: ['hospital-white'], stripe: 'hospital-green' },
  // (the names ENGINEERING §6 and the Stage 0 fixtures use, as aliases)
  'ms-21-navy-blue': { bands: ['navy-blue-5n'] },
  'blue-grey': { bands: ['blue-grey'] },
}

/** A hull measure's scheme; throws on an unknown one. */
export function schemeFor(name) {
  const s = SCHEMES[name]
  if (!s) throw new Error(`palette: no hull scheme “${name}”`)
  return { ...s, colours: s.bands.map((b) => LINEAR[b]), stripeColour: s.stripe ? LINEAR[s.stripe] : null }
}

export const PALETTE_NAMES = Object.keys(COLOURS)
export const SCHEME_NAMES = Object.keys(SCHEMES)
/** The deck colours a kit may name. */
export const DECKS = ['wood', 'linoleum', 'deck-grey', 'deck-blue', 'ijn-black', 'blue-stain']
/** The aircraft colours a kit may name. */
export const AIRCRAFT_COLOURS = ['ijn-ameiro', 'ijn-green', 'ijn-grey', 'blue-grey', 'light-grey', 'sea-blue', 'intermediate-blue', 'insignia-white', 'glossy-sea-blue', 'olive-drab', 'neutral-grey', 'white', 'natural-metal']
/** Deck markings a carrier may carry. */
export const DECK_MARKINGS = [null, 'hinomaru-forward']
