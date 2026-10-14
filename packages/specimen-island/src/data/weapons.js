// Weapons and tools. The weapon system, view models, HUD and AI noise model
// all read from here, so tuning a gun is editing a number.
//
// kind:
//   projectile  physical dart with travel time and drop; carries `dose`
//   hitscan     instant bullet(s); carries `damage` — lethal, and costs points
//   scanner     hold fire on a creature to catalogue it
//
// noise is the radius (m) at which creatures hear the shot.

export const WEAPONS = {
  scanner: {
    slot: 1,
    name: 'Field Scanner',
    short: 'SCAN',
    kind: 'scanner',
    range: 85,
    zoom: 1.6,
    noise: 0,
  },
  pistol: {
    slot: 2,
    name: 'Tranq Pistol',
    short: 'T-PST',
    kind: 'projectile',
    dose: 12,
    speed: 62,
    gravity: 9.8,
    mag: 6,
    ammo: 'pistolDart',
    reload: 2.0,
    rof: 0.32,
    noise: 6,
    spread: 0.012,
    aimSpread: 0.004,
    zoom: 1.35,
    recoil: 0.012,
    lethal: false,
  },
  rifle: {
    slot: 3,
    name: 'Tranq Rifle',
    short: 'T-RFL',
    kind: 'projectile',
    dose: 40,
    speed: 105,
    gravity: 9.8,
    mag: 1,
    ammo: 'rifleDart',
    reload: 1.5,
    rof: 0.4,
    noise: 9,
    spread: 0.01,
    aimSpread: 0.0006,
    zoom: 4,
    scope: true,
    recoil: 0.025,
    lethal: false,
  },
  hunting: {
    slot: 4,
    name: 'Hunting Rifle',
    short: 'RIFLE',
    kind: 'hitscan',
    damage: 110,
    mag: 5,
    ammo: 'rifleRound',
    reload: 2.6,
    rof: 1.0,
    noise: 320,
    spread: 0.012,
    aimSpread: 0.0005,
    zoom: 4.5,
    scope: true,
    recoil: 0.07,
    range: 600,
    lethal: true,
  },
  shotgun: {
    slot: 5,
    name: 'Pump Shotgun',
    short: 'SHTGN',
    kind: 'hitscan',
    pellets: 9,
    damage: 17,
    mag: 4,
    ammo: 'shell',
    reload: 2.6,
    rof: 0.8,
    noise: 260,
    spread: 0.055,
    aimSpread: 0.04,
    zoom: 1.2,
    recoil: 0.1,
    range: 70,
    lethal: true,
  },
}

// How a hit lands on each body zone. Darts in armour break and do nothing.
export const ZONES = {
  head: { dose: 1.4, damage: 2.2, label: 'HEAD' },
  neck: { dose: 1.35, damage: 1.4, label: 'NECK' },
  torso: { dose: 1.0, damage: 1.0, label: 'BODY' },
  limb: { dose: 0.75, damage: 0.6, label: 'LEG' },
  tail: { dose: 0.5, damage: 0.5, label: 'TAIL' },
}
export const ARMOR = { dose: 0, damage: 0.25, label: 'ARMOUR' }

export const THROWABLES = {
  stone: { item: 'stone', speed: 19, noise: 18, label: 'Stone' },
  flare: { item: 'flare', speed: 15, noise: 6, label: 'Flare', burn: 22, fear: 14 },
}

for (const id in WEAPONS) WEAPONS[id].id = id
