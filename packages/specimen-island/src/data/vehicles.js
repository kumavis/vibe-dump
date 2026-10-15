// Vehicle tuning: everything a designer would tweak about the helicopter and
// the ranger jeep. vehicles/*.js only read these tables.
//
// Local frames match the models: forward is -Z, +X is the right-hand side,
// y = 0 is where the wheels / skids touch the ground. Parked boxes are
// { x, z, hx, hz, y0, y1 } (centre, half extents, height span). The heli's
// flight parts are circles { x, z, r, y0, y1 }, or a tapered capsule
// { z0, z1, r0, r1, y0, y1 } along the centreline; the jeep's hitbox is circles
// { z, r } along its spine, all spanning hitY. Speeds are m/s, damage is hull
// points (hull is 0..100).

// Feedback shared by every vehicle when it gets hurt — the bit the playtest
// said was missing ("I couldn't tell it had taken damage").
export const VEHICLE_FX = {
  // camera shake per hull point lost lives in data/shake.js, with the rest of the shake
  vignettePerHp: 1 / 24, // red HUD vignette pulse
  flashTime: 1.4, // seconds the HUD hull readout flashes red
  sparksPerHp: 1 / 7, // spark bursts per hull point (1..6)
  // Impact sparks: big and slow enough to read at chase distance, flung up
  // over the cabin, from a point pushed out of the hull towards the outside.
  sparks: { n: 12, spread: 5, up: 6, life: 0.7, size: 0.22, gravity: 9, push: 0.45, flash: 40, flashTime: 0.08 },
  milestones: [50, 25], // a toast as the hull crosses each (only with someone aboard)
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
  strikeThrough: 0, // share of a blow that reaches the pilot through the hull: a closed cabin
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
  // two boxes, the tail boom, the tail plane, and the fin with its rotor.
  parked: [
    { x: 0, z: 0.2, hx: 1.15, hz: 1.15, y0: 0.3, y1: 2.95 },
    { x: 0, z: 0.2, hx: 0.8, hz: 1.78, y0: 0.3, y1: 2.95 },
    { x: 0, z: 3.85, hx: 0.36, hz: 2.0, y0: 1.4, y1: 2.2 },
    { x: 0, z: 6.1, hx: 0.72, hz: 0.24, y0: 1.45, y1: 2.0 },
    { x: 0.05, z: 6.83, hx: 0.2, hz: 0.5, y0: 1.5, y1: 3.05 },
  ],
  // In flight: the cabin, the whole boom as one tapered capsule, the tail
  // rotor and the tail-plane tips. Parts in the same `group` resolve as one
  // contact per frame (the deepest), so a trunk touching the boom and the
  // tail at once is charged once.
  flight: [
    { part: 'cabin', group: 'cabin', x: 0, z: 0.2, r: 1.6, y0: 0.3, y1: 3.3 },
    { part: 'boom', group: 'tail', z0: 1.8, z1: 6.3, r0: 0.36, r1: 0.2, y0: 1.4, y1: 2.2 },
    { part: 'tail', group: 'tail', x: 0, z: 6.6, r: 0.65, y0: 1.5, y1: 3.0 },
    { part: 'tail', group: 'tail', x: -0.55, z: 6.1, r: 0.2, y0: 1.7, y1: 2.0 },
    { part: 'tail', group: 'tail', x: 0.55, z: 6.1, r: 0.2, y0: 1.7, y1: 2.0 },
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
  // Ground cushion: below `agl` metres a healthy rotor eases the sink rate
  // down to `sink` at the skids, so holding Shift sets you down rather than
  // slamming you in. A dead or coughing engine gets no cushion.
  cushion: { agl: 6, sink: 2.5, from: 8.5, rpm: 0.85 },
  enginePoint: [0, 2.95, 1.4],
  seat: [-0.35, 1.9, -0.55],
  chase: { back: 15, up: 5.5 },
  noise: { radius: 150, every: 0.6 },
  fuelBurn: 1 / 420, // tank per second with the rotor turning
  dry: 0.02, // the tank reads empty below this
  // Dry away from the pad, the reserve tank can be hand-pumped through:
  // enough to limp home (about 40 s of flight).
  reserve: { hold: 6, fuel: 0.1 },
  serviceRange: 14, // the pad pump reaches it this close to the pad
  toasts: {
    50: 'Helicopter hull at 50% — the airframe is groaning. Set down and service it at the pad.',
    25: 'Helicopter hull at 25%! Warning lights everywhere — land now.',
    0: 'Engine failure! Autorotating...',
    grounded: 'The helicopter is wrecked. Climb out and hold E beside it to patch it up.',
    fieldRepaired: 'Fly it back to the pad pump for a proper service.',
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
  strikeThrough: 0.35, // the cab is open: this share of every blow reaches the driver
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
  reverseAccel: 6.5, // as strong as first gear: it has to back out of whatever it nosed into
  brake: 15,
  handbrake: 9,
  coast: 1.1, // engine braking with no throttle
  rolling: { road: 0.25, offroad: 0.9 }, // m/s² of rolling resistance
  coverDrag: 0.35, // dense undergrowth slows you this fraction
  steer: { max: 0.6, falloff: 9, rate: 7 }, // wheel angle, the speed it halves at, slew rate
  // How fast the tyres kill sideways slip (per second), and the share of it
  // they turn back into forward speed rather than scrub off. The locked rear
  // wheels of a handbrake turn hold almost nothing, so the tail steps out.
  grip: { road: 16, offroad: 10, handbrake: 1.3, redirect: 0.9 },
  handbrakeYaw: 0.9, // extra rotation when you yank the handbrake in a turn
  gears: [0, 0.22, 0.45, 0.72, 1.01], // fractions of road top speed
  // ground following
  stepUp: 0.7, // highest kerb a wheel climbs
  bump: { road: 0.01, offroad: 0.07 }, // metres of washboard under each wheel
  suspension: { k: 70, c: 11, liftK: 120, liftC: 14 },
  follow: { down: 15, up: 3 }, // m/s the body tracks the ground's fall / climb; faster climbs throw it
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
  // One beam from between the lamps (a light per lamp would cost every lit
  // pixel on the island twice); it only exists in the scene while it is on.
  lights: { intensity: 720, range: 80, angle: 0.55, penumbra: 0.6, decay: 1.1, warmRange: 60 },
  // Stuck: this long with the throttle down and going nowhere, or nosed into
  // water it can't ford, and the board prompt offers to winch it out onto
  // the nearest clear, dry ground within `range`.
  winch: { stuckAfter: 4, hold: 4, range: 40 },
  serviceRange: 22, // the pad pump reaches it this close to the pad
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
    fieldRepaired: 'Drive it to the pump on the field lab helipad for a proper service.',
    stuck: 'Stuck. Climb out and hold E beside the jeep to winch it free.',
  },
}
