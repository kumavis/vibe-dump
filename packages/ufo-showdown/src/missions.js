// The galaxy map, in the order missions unlock. Clearing one opens the next.
//
//   level       which level runs the main part of the mission ('waves' is the
//               classic saucer formations; the others come from content packs)
//   waves       for 'waves' levels: the formations, in order
//   fire        how trigger-happy the saucers are (1 = Mothership-level)
//   boss        the boss that ends it, or null for a mission without one
//   difficulty  1–5, shown on the map as danger pips and scaling the rewards
//   bonus       points every surviving ship gets for beating the boss

export const MISSIONS = [
  {
    id: 'rim',
    name: 'The Outer Rim',
    blurb: 'Saucer patrols — and their boss, Captain Zorb.',
    level: 'waves',
    waves: ['snake', 'rain', 'sweep', 'snake', 'rain', 'sweep', 'snake'],
    fire: 0.6,
    boss: 'zorb',
    difficulty: 1,
    bonus: 5000,
    tint: ['#3b1f7a', '#0f3a6e'],
  },
  {
    id: 'belt',
    name: 'Asteroid Belt',
    blurb: 'Blast a path through the rocks, then carry power cores to your Ion Cannon to crack Krax.',
    level: 'asteroids',
    fire: 0.6,
    boss: 'krax',
    difficulty: 2,
    bonus: 6000,
    tint: ['#5a3a1f', '#1f2f4a'],
  },
  {
    id: 'race',
    name: 'Ring Race',
    blurb: 'Bonus round! Fly through as many rings as you can before time runs out.',
    level: 'race',
    fire: 0,
    boss: null,
    difficulty: 1,
    bonus: 0,
    tint: ['#1f5a6e', '#3b1f7a'],
  },
  {
    id: 'storm',
    name: 'Saucer Storm',
    blurb: 'Zigzaggers, divers, and General Blorp with his sweeping lasers.',
    level: 'waves',
    waves: ['vee', 'snake', 'divers', 'sweep', 'vee', 'divers', 'rain', 'vee'],
    fire: 0.85,
    boss: 'blorp',
    difficulty: 3,
    bonus: 8000,
    tint: ['#6e1f5a', '#1f2f7a'],
  },
  {
    id: 'nebula',
    name: 'The Dark Nebula',
    blurb: 'Thick space fog — you only see saucers when they get close. Something big hides in there.',
    level: 'nebula',
    fire: 0.85,
    boss: 'phantom',
    difficulty: 3,
    bonus: 9000,
    tint: ['#2a1f5a', '#1f4a4a'],
  },
  {
    id: 'ion',
    name: 'Ion Storm',
    blurb: 'Lightning strikes the battlefield. Light up the beacons to zap the Storm Eye.',
    level: 'ion',
    fire: 0.9,
    boss: 'stormeye',
    difficulty: 4,
    bonus: 11000,
    tint: ['#1f3a6e', '#4a1f6e'],
  },
  {
    id: 'mother',
    name: 'The Mothership',
    blurb: 'The final battle. Knock out the turrets and beat Supreme Commander Zyx.',
    level: 'waves',
    waves: ['gunners', 'snake', 'divers', 'vee', 'gunners', 'sweep', 'divers', 'vee', 'gunners'],
    fire: 1,
    boss: 'mothership',
    difficulty: 5,
    bonus: 15000,
    tint: ['#1f6e5a', '#4a1f7a'],
    final: true,
  },
]

export const missionIndex = (id) => MISSIONS.findIndex((m) => m.id === id)
