// Vehicle tuning: everything a designer would tweak about the helicopter and
// the ranger jeep. vehicles/*.js only read these tables.
//
// Local frames match the models: forward is -Z, +X is the right-hand side,
// y = 0 is where the wheels / skids touch the ground. Boxes are
// { x, z, hx, hz, y0, y1 } (centre, half extents, height span); circles are
// { x, z, r, y0, y1 }. Speeds are m/s, damage is hull points (hull is 0..100).

// Feedback shared by every vehicle when it gets hurt — the bit the playtest
// said was missing ("I couldn't tell it had taken damage").
export const VEHICLE_FX = {
  shakePerHp: 1 / 20, // camera shake per hull point lost
  shakeMax: 1.4,
  shakeDecay: 1.5, // per second
  vignettePerHp: 1 / 24, // red HUD vignette pulse
  flashTime: 1.4, // seconds the HUD hull readout flashes red
  sparksPerHp: 1 / 7, // spark bursts per hull point (1..6)
  milestones: [50, 25], // a toast as the hull crosses each
  smokeBelow: 50, // black engine smoke under this hull
  warnBelow: 30, // warning beep loop under this hull
  criticalBelow: 20, // the engine sputters under this hull
  injury: { above: 30, k: 0.35 }, // one hit bigger than this hurts whoever is inside
  // A wrecked vehicle can be patched up where it lies, enough to limp home.
  fieldRepair: { hold: 8, to: 30 },
  // Where the player may be put down on exit, tried in order (door sides first).
  exitClearance: 0.5,
}

export const HELI = {
  kind: 'heli',
  name: 'helicopter',
  hudName: 'HELICOPTER',
  exitBlocked: 'Land first',
  hull: 100,
  visibility: 2, // stealth: you are the loudest, most visible thing on the island
  strikeMul: 0.5, // a dinosaur blow on the airframe, relative to on foot
  exitSpeed: 2.5,
  seatView: 'cockpit',
  load: { radius: 300, unload: 360 }, // ecology streaming while aboard
  door: { x: 1.35, y: 1.2, z: -0.3, radius: 3.6 },
  exits: [
    [-2.4, -0.3],
    [2.4, -0.3],
    [-2.4, 1.6],
    [2.4, 1.6],
    [0, -3.0],
  ],
  // Parked colliders, traced off the model: an ellipsoid cabin as a cross of
  // two boxes, the tail boom, and the fin / tail plane / tail rotor.
  parked: [
    { x: 0, z: 0.2, hx: 1.15, hz: 1.15, y0: 0.3, y1: 2.95 },
    { x: 0, z: 0.2, hx: 0.8, hz: 1.78, y0: 0.3, y1: 2.95 },
    { x: 0, z: 3.75, hx: 0.36, hz: 1.85, y0: 1.4, y1: 2.2 },
    { x: 0, z: 6.6, hx: 0.72, hz: 0.72, y0: 1.45, y1: 3.0 },
  ],
  // In flight: the cabin, the middle of the boom and the tail rotor.
  flight: [
    { part: 'cabin', x: 0, z: 0.2, r: 1.6, y0: 0.3, y1: 3.3 },
    { part: 'boom', x: 0, z: 3.9, r: 0.4, y0: 1.4, y1: 2.2 },
    { part: 'tail', x: 0, z: 6.6, r: 0.65, y0: 1.5, y1: 3.0 },
  ],
  impact: {
    cabin: { min: 6, k: 3.5 }, // per m/s of closing speed over min
    boom: { min: 3, k: 3.5 },
    tail: { min: 2, k: 4 }, // a tail-rotor strike is never gentle
    maxHit: 55, // one trunk never takes it all: there is always a chance to set down
    bounce: 0.4,
    spin: 2.2, // yaw kick from a tail strike
    terrain: { min: 5.5, k: 14 }, // closing speed into the ground (landing or hillside)
  },
  enginePoint: [0, 2.95, 1.4],
  seat: [-0.35, 1.9, -0.55],
  chase: { back: 15, up: 5.5 },
  noise: { radius: 150, every: 0.6 },
  fuelBurn: 1 / 420, // tank per second of flight
  toasts: {
    50: 'Helicopter hull at 50% — the airframe is groaning. Set down and service it at the pad.',
    25: 'Helicopter hull at 25%! Warning lights everywhere — land now.',
    0: 'Engine failure! Autorotating...',
  },
}

export const JEEP = {
  kind: 'jeep',
  name: 'jeep',
  hudName: 'JEEP',
  exitBlocked: 'Stop the jeep first',
  hull: 100,
  mass: 1600, // kg, for shoving matches with dinosaurs
  visibility: 1.6,
  strikeMul: 0.6,
  exitSpeed: 1.2,
  seatView: 'seat',
  load: { radius: 250, unload: 310 },
  paint: [170, 154, 108], // sun-faded ranger khaki
  // body: 4.2 m bumper to spare wheel, 1.9 m over the wheels, 1.9 m to the roll bar
  halfLength: 2.1,
  halfWidth: 0.95,
  wheel: { r: 0.38, width: 0.27, x: 0.8, z: 1.3, travel: 0.16 },
  // engine and brakes
  top: { road: 20, offroad: 12, reverse: 6 },
  accel: 6.5,
  brake: 15,
  handbrake: 9,
  coast: 1.1, // engine braking with no throttle
  rolling: { road: 0.25, offroad: 0.9 }, // m/s² of rolling resistance
  coverDrag: 0.35, // dense undergrowth slows you this fraction
  steer: { max: 0.6, falloff: 9, rate: 7 }, // wheel angle, the speed it halves at, slew rate
  grip: { road: 9, offroad: 6, handbrake: 1.3 },
  handbrakeYaw: 0.9, // extra rotation when you yank the handbrake in a turn
  gears: [0, 0.22, 0.45, 0.72, 1.01], // fractions of road top speed
  // ground following
  stepUp: 0.7, // highest kerb a wheel climbs
  bump: { road: 0.01, offroad: 0.07 }, // metres of washboard under each wheel
  suspension: { k: 70, c: 11, liftK: 120, liftC: 14 },
  wade: 0.8, // deepest water it fords
  // collisions
  hitbox: [
    { z: -1.3, r: 0.95 },
    { z: 0, r: 0.95 },
    { z: 1.3, r: 0.95 },
  ],
  hitY: [0.35, 1.7],
  impact: { min: 4, k: 2.8, bounce: 0.35, scrub: 0.8, maxHit: 60 }, // maxHit: one smash never wrecks it outright
  landing: { min: 7, k: 6 },
  creatures: {
    smallMass: 400, // lighter than this and the jeep wins
    hitMin: 2.5, // closing speed before it hurts the animal
    hitK: 7, // animal damage per m/s
    heavyMin: 2, // closing speed before a big animal dents the jeep
    heavyK: 3.5,
    bounce: 0.3,
  },
  noise: { idle: 25, max: 80, every: 0.5 },
  lights: { intensity: 380, range: 80, angle: 0.5, penumbra: 0.6, decay: 1.1 },
  door: { x: 1.15, y: 1.0, z: 0.1, radius: 2.6 },
  exits: [
    [-1.8, 0.1],
    [1.8, 0.1],
    [0, 3.0],
    [0, -3.0],
    [-1.8, -1.6],
    [1.8, 1.6],
  ],
  parked: [
    { x: 0, z: -0.03, hx: 0.95, hz: 1.9, y0: 0.3, y1: 1.3 }, // tub, hood, wheels
    { x: 0, z: -2.0, hx: 0.62, hz: 0.12, y0: 0.4, y1: 1.15 }, // bull bar
    { x: 0, z: 2.0, hx: 0.4, hz: 0.14, y0: 0.62, y1: 1.4 }, // spare wheel
  ],
  enginePoint: [0, 1.3, -1.4],
  seat: [-0.4, 1.62, 0.34],
  chase: { back: 7.5, up: 2.9, lookAhead: 4, follow: 4 },
  // Parked at Ranger Station Alpha: tried in order, in the station's local
  // frame, until one is clear of the building, tank, crates and trees. It
  // faces the nearest stretch of road it can actually drive to.
  spawn: {
    candidates: [
      [-10.5, 2],
      [-10.5, -1.5],
      [-10.5, 5],
      [-11.5, 7.5],
      [11.5, -6.5],
      [10, 9.5],
      [-6, 12],
    ],
    roadRange: [10, 40],
  },
  toasts: {
    50: 'Jeep hull at 50% — something is rattling loose.',
    25: 'Jeep hull at 25%! The engine is smoking badly.',
    0: 'The jeep is wrecked. Climb out and hold E beside it to patch it up.',
  },
}
