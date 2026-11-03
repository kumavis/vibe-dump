// The toy's two sides (TOY.md §3): who you fly, what you guard, what comes at
// you. Kit ids are the record's (public/data/kits), so the low-poly models
// are the ones the box draws; the names are the machines', never people's.
// The United States side is Samar's escort carrier and her Wildcat against
// Zeros, destroyers, a cruiser and Yamato; Japan's is Akagi and her Zero
// against Wildcats, Fletchers, a cruiser and Washington (TOY.md §3, mirrored).

export const SIDES = {
  us: {
    code: 'us',
    name: 'United States',
    box: 'samar',
    colourDate: '1944-10-25',
    localTime: '07:40',
    player: { kit: 'fm-2', name: 'Wildcat' },
    fighter: { kit: 'a6m5', name: 'Zero', plural: 'Zeros' },
    carrier: { kit: 'casablanca', name: 'the escort carrier' },
    destroyer: { kit: 'kagero', name: 'destroyer' },
    cruiser: { kit: 'takao', name: 'cruiser' },
    boss: { kit: 'yamato', name: 'Yamato' },
  },
  jp: {
    code: 'jp',
    name: 'Japan',
    box: 'midway',
    colourDate: '1942-06-04',
    localTime: '10:10',
    player: { kit: 'a6m2', name: 'Zero' },
    fighter: { kit: 'f4f-4', name: 'Wildcat', plural: 'Wildcats' },
    carrier: { kit: 'akagi', name: 'Akagi' },
    destroyer: { kit: 'fletcher', name: 'Fletcher' },
    cruiser: { kit: 'new-orleans', name: 'cruiser' },
    boss: { kit: 'north-carolina', name: 'Washington' },
  },
}

/** The roles in slot order, with how many of each the arena holds at once (TOY.md §2: 12 aircraft and 6 ships at most). */
export const ROLES = [
  { role: 'player', kind: 'aircraft', cap: 1 },
  { role: 'fighter', kind: 'aircraft', cap: 16 },
  { role: 'carrier', kind: 'ship', cap: 1 },
  { role: 'destroyer', kind: 'ship', cap: 4 },
  { role: 'cruiser', kind: 'ship', cap: 2 },
  { role: 'boss', kind: 'ship', cap: 1 },
]

export const sideOf = (s) => (s === 'jp' || s === 'japan' ? 'jp' : 'us')
