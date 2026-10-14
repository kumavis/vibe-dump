// Weapons and tools. The weapon system, view models, HUD and AI noise model
// all read from here, so tuning a gun is editing a number.
//
// kind:
//   projectile  physical dart with travel time and drop; carries `dose`
//   hitscan     instant bullet(s); carries `damage` — lethal, and costs points
//   scanner     hold fire on a creature to catalogue it
//   camera      aim zooms, fire takes a photograph (scored by player/photos.js
//               with the PHOTO table below)
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
  camera: {
    slot: 6,
    name: 'Field Camera',
    short: 'CAM',
    kind: 'camera',
    zoom: 4, // RMB glides 1x -> zoom; the wheel sets it while aiming
    zoomMin: 1.5,
    zoomStep: 0.5,
    aimRate: 3.2, // slower than a gun's snap to sights: a lens zooming
    rof: 1.0, // shutter cooldown
    noise: 4,
    range: 180,
    lethal: false,
  },
}

// Wildlife photography: how player/photos.js grades a frame. A shot's quality
// (0-100) is the product of the core factors times (1 + bonuses):
//   fill     subject size relative to the frame (bounding box of its hit spheres)
//   vis      share of sampled body spheres in plain view (physics ray + ID render)
//   crop     share of the subject's box inside the frame (head out costs extra)
//   comp     centred, or better, on a rule-of-thirds point
//   steady   the camera turning or the photographer moving blurs the shot
// Bonuses: what the animal is doing, herd-mates of the same species in frame,
// and an animal that has not noticed you.
export const PHOTO = {
  frame: { aspect: 1.6, fill: 0.84 }, // the viewfinder rectangle, share of the screen
  image: { w: 320, h: 200, quality: 0.82 }, // album JPEGs
  preview: 2.5, // seconds the polaroid stays up
  liveRate: 0.2, // seconds between viewfinder estimates
  scale: 0.82, // a technically perfect shot of an animal doing nothing
  minQuality: 6, // below this there is nothing recognisable in frame
  stars: [40, 70], // quality for two and three stars (one star from minQuality)
  fill: { min: 0.02, sweet: [0.25, 0.6], big: 1.2, bigScore: 0.55, hugeScore: 0.3 },
  headWeight: 2, // in the visibility sample (head, neck, chest, hips, tail, two legs)
  visFloor: 0.15, // a glimpse this small of an animal is not a photo of it
  idBuffer: { w: 320 }, // the small ID render that sees plants without colliders
  cropHeadOut: 0.65,
  thirds: { centre: 0.9, falloff: 0.32, weight: 0.4 },
  steady: { turn: 0.5, move: 0.12, walk: 0.8, floor: 0.3 },
  pose: {
    roar: 0.3,
    charge: 0.3,
    attack: 0.3,
    spit: 0.3,
    threaten: 0.25,
    hunt: 0.2,
    running: 0.18,
    flee: 0.15,
    feed: 0.15,
    graze: 0.1,
    alert: 0.05,
    investigate: 0.05,
    groggy: -0.15,
    down: -0.5,
    dead: -0.75,
  },
  group: { each: 0.08, max: 0.24, minFill: 0.04, minVis: 0.4 },
  unaware: 0.15,
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
