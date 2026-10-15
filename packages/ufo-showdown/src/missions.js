// The galaxy map, in the order missions unlock. Clearing one opens the next.
//
//   level       which level runs the main part of the mission ('waves' is the
//               classic saucer formations; the others come from content packs)
//   waves       for 'waves' levels: the formations, in order
//   fire        how trigger-happy the saucers are (1 = Mothership-level)
//   boss        the boss that ends it, or null for a mission without one
//   difficulty  1–5, shown on the map as danger pips and scaling the rewards
//   bonus       points every surviving ship gets for beating the boss
//   tag         a word for the map card when the mission has no boss
//   doneTitle   the end panel's title, if not "Mission complete!"

export const MISSIONS = [
  {
    id: 'rim',
    name: 'The Outer Rim',
    blurb: 'Saucer patrols — and their boss, Captain Zorb.',
    level: 'waves',
    waves: ['snake', 'rain', 'sweep', 'snake', 'rain', 'sweep', 'snake'],
    fire: 0.75,
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
    fire: 0.75,
    boss: 'krax',
    difficulty: 2,
    bonus: 6000,
    tint: ['#5a3a1f', '#1f2f4a'],
  },
  {
    id: 'race',
    name: 'Hyperspace Run',
    blurb: 'Rocket through hyperspace, faster and faster. Pick your path through the rings and dodge the bombs!',
    level: 'race',
    fire: 1,
    boss: null,
    difficulty: 2,
    bonus: 0,
    tag: 'Race',
    doneTitle: 'You made it through!',
    tint: ['#1f5a6e', '#3b1f7a'],
  },
  {
    id: 'storm',
    name: 'Saucer Storm',
    blurb: 'Zigzaggers, divers, and General Blorp with his sweeping lasers.',
    level: 'waves',
    waves: ['vee', 'snake', 'divers', 'sweep', 'vee', 'divers', 'rain', 'vee'],
    fire: 1,
    boss: 'blorp',
    difficulty: 3,
    bonus: 8000,
    tint: ['#6e1f5a', '#1f2f7a'],
  },
  {
    id: 'nebula',
    name: 'The Dark Nebula',
    blurb: 'Thick space fog — you only see saucers when they get close. Something with a lot of arms lives in there.',
    level: 'nebula',
    fire: 1,
    boss: 'octopus',
    difficulty: 3,
    bonus: 9000,
    tint: ['#2a1f5a', '#1f4a4a'],
  },
  {
    id: 'ion',
    name: 'Ion Storm',
    blurb: 'Lightning strikes the battlefield. Light up the beacons to zap the Storm Eye.',
    level: 'ion',
    fire: 1.1,
    boss: 'stormeye',
    difficulty: 4,
    bonus: 11000,
    tint: ['#1f3a6e', '#4a1f6e'],
  },
  {
    id: 'swarm',
    name: 'Total Mayhem',
    blurb: 'So. Many. Saucers. Blast through the biggest swarm in the galaxy, then face the Hive Queen.',
    level: 'swarm',
    fire: 1.1,
    boss: 'hivequeen',
    difficulty: 4,
    bonus: 13000,
    tint: ['#6e3a1f', '#5a1f4a'],
  },
  {
    id: 'mother',
    name: 'The Mothership',
    blurb: 'The final battle. Knock out the turrets and beat Supreme Commander Zyx.',
    level: 'waves',
    waves: ['gunners', 'snake', 'divers', 'vee', 'gunners', 'sweep', 'divers', 'vee', 'gunners'],
    fire: 1.2,
    boss: 'mothership',
    difficulty: 5,
    bonus: 15000,
    tint: ['#1f6e5a', '#4a1f7a'],
    final: true,
  },
]

export const missionIndex = (id) => MISSIONS.findIndex((m) => m.id === id)
