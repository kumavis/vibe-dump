// The single goods catalog. Everything that mentions a good — stall props,
// haggle bubbles, ledgers, backstories — keys off `id` and reads its display
// facts from here. (See docs/FRAMES.md: this file is a shared contract; the
// world and economy modules both import it and neither may invent goods.)
//
// `baseValue` is the "fair" price in whole coins that beliefs start near.
// `icon` names a painter in src/icons.js. `color` is the prop/crate accent.

export const GOODS = [
  { id: 'apple',  name: 'Sun Apples',     icon: 'apple',  baseValue: 6,  color: 0xd9433b },
  { id: 'fish',   name: 'Moon Eels',      icon: 'fish',   baseValue: 9,  color: 0x6fb7c9 },
  { id: 'bread',  name: 'Ember Loaves',   icon: 'bread',  baseValue: 5,  color: 0xc98f4e },
  { id: 'spice',  name: 'Crimson Spice',  icon: 'spice',  baseValue: 14, color: 0xc2452c },
  { id: 'potion', name: 'Murk Tonics',    icon: 'potion', baseValue: 18, color: 0x7fd48a },
  { id: 'gem',    name: 'Void Gems',      icon: 'gem',    baseValue: 30, color: 0x8f6fd4 },
  { id: 'lamp',   name: 'Wisp Lamps',     icon: 'lamp',   baseValue: 16, color: 0xe8b64c },
  { id: 'rug',    name: 'Dream Rugs',     icon: 'rug',    baseValue: 22, color: 0xb85a8f },
  { id: 'scroll', name: 'Curse Scrolls',  icon: 'scroll', baseValue: 12, color: 0xd8cfae },
  { id: 'skull',  name: 'Chatter Skulls', icon: 'skull',  baseValue: 25, color: 0xcfd6d2 },
]

export const GOODS_BY_ID = Object.fromEntries(GOODS.map((g) => [g.id, g]))

export function goodById(id) {
  const g = GOODS_BY_ID[id]
  if (!g) throw new Error(`market-bazaar: unknown good "${id}"`)
  return g
}
