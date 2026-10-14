// The power-ups a ship carries. Shield, triple shot, rapid fire and speed each
// take a slot, and a ship has three. Catching one you already carry stacks it
// in its own slot — stronger, and with more time on the clock — up to ×3.
// Catching a fourth kind with every slot full bumps the oldest one out, so the
// HUD reads left to right from first caught to last.
//
// Hearts and novas are spent the moment they're caught and never take a slot.
// Kept free of the canvas and the game loop so the rules can be checked alone.

export const MAX_SLOTS = 3
export const MAX_LEVEL = 3

// Seconds each pickup adds. The shield has no clock: it lasts until it's hit,
// once per level.
export const DURATION = { triple: 12, rapid: 12, speed: 10 }
export const MAX_TIME = 30

export const SLOTTED = new Set(['shield', 'triple', 'rapid', 'speed'])

// What each level buys. Index 0 is "not carrying it".
export const FIRE_DELAY = [0.2, 0.12, 0.085, 0.065]
export const SHIP_SPEED = [440, 600, 700, 780]
export const SPREADS = [
  [0],
  [-0.2, 0, 0.2],
  [-0.3, -0.15, 0, 0.15, 0.3],
  [-0.36, -0.24, -0.12, 0, 0.12, 0.24, 0.36],
]

// Put `type` into `slots` (mutated in place). Returns the slot it landed in,
// whether it stacked onto one already there, whether that slot was already
// maxed out, and the slot it bumped, if any.
export function addPower(slots, type) {
  const have = slots.find((s) => s.type === type)
  if (have) {
    const capped = have.level >= MAX_LEVEL
    have.level = Math.min(MAX_LEVEL, have.level + 1)
    if (type in DURATION) {
      have.time = Math.min(MAX_TIME, have.time + DURATION[type])
      have.full = Math.max(have.full, have.time)
    }
    return { slot: have, stacked: true, capped, dropped: null }
  }
  const dropped = slots.length >= MAX_SLOTS ? slots.shift() : null
  const time = DURATION[type] ?? Infinity
  // `full` is what the HUD's timer ring measures against: the most time this
  // slot has held, so a fresh pickup and a fresh top-up both read as a full ring.
  const slot = { type, level: 1, time, full: time }
  slots.push(slot)
  return { slot, stacked: false, capped: false, dropped }
}

// Run the clocks down and drop whatever ran out.
export function tickPowers(slots, dt) {
  for (let i = slots.length - 1; i >= 0; i--) {
    const s = slots[i]
    if (!(s.type in DURATION)) continue
    s.time -= dt
    if (s.time <= 0) slots.splice(i, 1)
  }
}

export function powerLevel(slots, type) {
  const s = slots.find((x) => x.type === type)
  return s ? s.level : 0
}

// A hit lands: if a shield is up, it soaks the hit and loses one level.
export function absorbHit(slots) {
  const i = slots.findIndex((s) => s.type === 'shield')
  if (i < 0) return false
  if (--slots[i].level <= 0) slots.splice(i, 1)
  return true
}
