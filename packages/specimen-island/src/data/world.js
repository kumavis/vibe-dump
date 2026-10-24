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
    // Out on the west shelf, where nothing else goes: the supply boat runs
    // south from the dock, the river mouth is south-east, every tower and road
    // is inland. It stands where the seabed along `dir` (from the island
    // centre) first lies `depth` m down, and its pier runs back to the beach
    // about 450 m west of the Field Lab's helipad. `clear` keeps the plants off
    // that beach: that many metres either side of the pier and inland of it.
    { id: 'sealab', name: 'Foundation Sea Lab', offshore: { dir: [-1, 0.035], depth: 19.5 }, clear: 9, icon: 'sealab' },
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

  // Cleared lots for small prefabs beside a POI: plants are kept off a circle
  // of radius `r` before anything grows, and world/structures.js builds on it.
  // { at, gate: true } stands outside a fenced POI's gate, `along` metres
  // round from the gate's middle (+ is the way its fence segments count) and
  // `out` metres beyond the fence, facing out along the road that comes in.
  lots: [{ id: 'keeperShed', at: 'paddock', gate: true, along: 10.5, out: 9, r: 5 }],

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

  // The seabed off the coast (Island.shapeSeabed). It is only reshaped where
  // the bed already lies deeper than below[0] m, fully past below[1], so no
  // beach, shallows or coastline moves. A reef rises to its crown `top` (m,
  // never above -6) over radius `r`, broken up by ridged noise (`rough`); the
  // trench is cut `depth` m into the bed along its points, `width` wide with
  // steep walls; dunes are sand waves (`height` m, `length` m apart) and the
  // swell rolls the deep flat beyond the shelf.
  seabed: {
    below: [-4, -9],
    dunes: { height: 0.6, length: 24 },
    swell: { height: 2.6, scale: 0.006 },
    reefs: [
      // round the sea lab
      { x: -845, z: -70, r: 46, top: -9, rough: 0.5 },
      { x: -770, z: 96, r: 26, top: -8, rough: 0.4 },
      { x: -905, z: 92, r: 18, top: -11, rough: 0.6 },
      { x: -760, z: -96, r: 20, top: -9, rough: 0.5 },
      { x: -930, z: -20, r: 24, top: -13, rough: 0.6 },
      // elsewhere round the island, for whoever takes the sub that far
      { x: 70, z: 835, r: 30, top: -10, rough: 0.5 },
      { x: 800, z: -70, r: 40, top: -9, rough: 0.5 },
      { x: -120, z: -830, r: 34, top: -10, rough: 0.5 },
      { x: 620, z: 610, r: 22, top: -10, rough: 0.6 },
    ],
    trench: { points: [[-815, 112], [-860, 150], [-910, 205], [-960, 268], [-1010, 330]], width: 26, depth: 21 },
  },
}
