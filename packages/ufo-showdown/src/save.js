// The hangar that outlives a game: stars in the wallet, what's been bought,
// what each player has equipped, and how far through the missions they've got.
//
// It lives in this browser's localStorage. Storage can be missing or refuse to
// write (private windows, blocked site data, an embedded preview), so every
// read and write is guarded and the game simply plays on from memory then.

const KEY = 'ufo-showdown/save/v1'

export function defaultSave() {
  return {
    v: 1,
    stars: 0,
    earned: 0, // every star ever won, for bragging rights
    ships: ['striker'],
    paints: ['team'],
    upgrades: { cargo: 0, armor: 0, magnet: 0, drones: 0 },
    starters: { speed: 0, rapid: 0, triple: 0, shield: 0 }, // level owned
    startersOn: { speed: true, rapid: true, triple: true, shield: true },
    equip: [
      { ship: 'striker', paint: 'team' },
      { ship: 'striker', paint: 'team' },
    ],
    missions: { unlocked: 1, cleared: {}, best: {} },
    players: 1,
  }
}

// Fill in anything an older or hand-edited save is missing, and drop values of
// the wrong shape, so the rest of the game can trust what it reads.
export function normalize(raw) {
  const d = defaultSave()
  if (!raw || typeof raw !== 'object') return d
  const num = (v, fallback) => (Number.isFinite(v) && v >= 0 ? Math.floor(v) : fallback)
  const list = (v, fallback) => (Array.isArray(v) ? [...new Set([...fallback, ...v.filter((x) => typeof x === 'string')])] : fallback)
  const levels = (v, fallback) => {
    const out = { ...fallback }
    if (v && typeof v === 'object') for (const k in out) out[k] = Math.min(3, num(v[k], out[k]))
    return out
  }
  const s = {
    v: 1,
    stars: num(raw.stars, 0),
    earned: num(raw.earned, 0),
    ships: list(raw.ships, d.ships),
    paints: list(raw.paints, d.paints),
    upgrades: levels(raw.upgrades, d.upgrades),
    starters: levels(raw.starters, d.starters),
    startersOn: { ...d.startersOn },
    equip: d.equip.map((e, i) => {
      const r = Array.isArray(raw.equip) ? raw.equip[i] : null
      return { ship: typeof r?.ship === 'string' ? r.ship : e.ship, paint: typeof r?.paint === 'string' ? r.paint : e.paint }
    }),
    missions: {
      unlocked: Math.max(1, num(raw.missions?.unlocked, 1)),
      cleared: { ...(raw.missions?.cleared ?? {}) },
      best: { ...(raw.missions?.best ?? {}) },
    },
    players: raw.players === 2 ? 2 : 1,
  }
  if (raw.startersOn && typeof raw.startersOn === 'object') {
    for (const k in s.startersOn) if (typeof raw.startersOn[k] === 'boolean') s.startersOn[k] = raw.startersOn[k]
  }
  // never fly something you don't own
  for (const e of s.equip) {
    if (!s.ships.includes(e.ship)) e.ship = 'striker'
    if (!s.paints.includes(e.paint)) e.paint = 'team'
  }
  return s
}

export function loadSave() {
  try {
    const text = window.localStorage.getItem(KEY)
    return normalize(text ? JSON.parse(text) : null)
  } catch {
    return defaultSave()
  }
}

export function writeSave(save) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(save))
    return true
  } catch {
    return false
  }
}
