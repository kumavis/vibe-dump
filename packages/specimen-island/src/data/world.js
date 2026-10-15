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
    { id: 'paddock', name: 'Old Paddock C', x: 210, z: -280, flat: 0, icon: 'fence', fence: { radius: 58, sides: 16, gate: 2 } },
    { id: 'summit', name: 'Summit Relay', summit: true, flat: 16, icon: 'relay' },
  ],

  // Dirt roads, as control points: a POI id (its centre), a bare [x, z]
  // waypoint, or an anchor so a road meets a place at its doorstep instead of
  // driving into it — { at, local: [x, z] } in the POI's own frame (+Z is the
  // side it faces), { at, stop: m } pulls up that far short of its centre, and
  // { at, gate: true } ends outside a fenced POI's gate. Bridges are dropped
  // automatically wherever a road crosses the river.
  roads: [
    ['dock', { at: 'station', local: [0, 18] }, { at: 'station', local: [-22, 10] }, [-60, 470], [-170, 300], 'fieldlab'],
    [{ at: 'station', local: [12, 14] }, [120, 470], [250, 340], [330, 180], [345, 60], [352, -30], [290, -150], { at: 'paddock', gate: true }],
    ['fieldlab', [-380, 40], { at: 'westtower', stop: 12 }],
    [{ at: 'station', local: [12, 14] }, [200, 520], { at: 'southtower', stop: 12 }],
  ],

  // Abandoned vehicles by the roads: which road, how far along it (0..1), what,
  // and whether a supply crate sits by it. Each takes a dry, level spot on
  // either verge near there, cleared of trees (Island.placeWrecks).
  wrecks: [
    { road: 0, at: 0.55, kind: 'truck', crate: true },
    { road: 1, at: 0.22, kind: 'jeep', crate: false },
    { road: 1, at: 0.62, kind: 'jeep', crate: true },
    { road: 2, at: 0.5, kind: 'truck', crate: true },
    { road: 3, at: 0.6, kind: 'jeep', crate: false },
  ],

  wind: { angle: 0.6, strength: 0.6 }, // radians; gusts wobble around this
}
