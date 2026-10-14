// Island layout. Everything here is design data: move a POI, add a road, bend
// the river — the generator, physics, map and compass all pick it up.
//
// Coordinates are metres, origin at the island centre, -Z is north.

export const WORLD = {
  seed: 20261014,
  size: 2000, // terrain square, metres
  seg: 400, // terrain quads per side (5 m cells)
  radius: 840, // nominal coastline radius
  seaLevel: 0,

  mountain: { x: -60, z: -450, height: 175, spread: 250, crater: 24 },
  plains: { x: 300, z: -60, radius: 280, height: 11 },

  // The river is drawn source -> mouth. Its surface is forced downhill so the
  // water always runs to the sea, carving a gorge through anything in the way.
  river: {
    points: [
      [-30, -290],
      [30, -190],
      [110, -60],
      [150, 70],
      [200, 180],
      [270, 290],
      [380, 400],
      [470, 490],
      [560, 580],
      [700, 700],
    ],
    widthStart: 5,
    widthEnd: 22,
    depth: 1.8,
  },

  lake: { x: -400, z: 310, radius: 70 },

  // Points of interest. `flat` flattens the ground to build on; `height` pins it.
  pois: [
    { id: 'dock', name: 'Supply Dock', coast: { x: 40, dir: [0, 1] }, flat: 22, icon: 'dock' },
    { id: 'station', name: 'Ranger Station Alpha', inland: { from: 'dock', dist: 120 }, flat: 30, icon: 'station' },
    { id: 'fieldlab', name: 'Foundation Field Lab', x: -270, z: 150, flat: 62, icon: 'lab' },
    { id: 'easttower', name: 'East Plains Tower', x: 330, z: -30, flat: 10, icon: 'tower' },
    { id: 'westtower', name: 'West Jungle Tower', x: -480, z: -80, flat: 10, icon: 'tower' },
    { id: 'southtower', name: 'Marsh Tower', x: 300, z: 470, flat: 10, icon: 'tower' },
    { id: 'paddock', name: 'Old Paddock C', x: 210, z: -280, flat: 0, icon: 'fence' },
    { id: 'summit', name: 'Summit Relay', summit: true, flat: 16, icon: 'relay' },
  ],

  // Dirt roads as POI ids and bare waypoints. Bridges are dropped automatically
  // wherever a road crosses the river.
  roads: [
    ['dock', 'station', [-60, 470], [-170, 300], 'fieldlab'],
    ['station', [120, 470], [250, 340], [330, 180], [345, 60], 'easttower', [290, -150], 'paddock'],
    ['fieldlab', [-380, 40], 'westtower'],
    ['station', [200, 520], 'southtower'],
  ],

  wind: { angle: 0.6, strength: 0.6 }, // radians; gusts wobble around this
}
