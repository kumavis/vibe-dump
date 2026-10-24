// Vehicle tuning: the numbers a designer would tweak about the helicopter and
// the ranger jeep (handling, damage, hitboxes, sounds, recovery). The flight
// and suspension models in vehicles/*.js read these tables; only small
// smoothing constants stay inline there.
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


// A compact trail bike. The gyroscope is always on: at rest it holds the
// frame upright; in motion it limits lean and damps wobble. The shared ground
// solver samples the left/right edges of each of its two tyres.
export const MOTORBIKE = {
  ...JEEP,
  kind: 'motorbike', name: 'motorbike', hudName: 'TRAIL BIKE',
  exitBlocked: 'Stop the motorbike first',
  mass: 240, visibility: 1.25, strikeMul: 0.9, strikeThrough: 0.7,
  halfLength: 1.25, halfWidth: 0.38,
  wheel: { r: 0.38, width: 0.18, x: 0.09, z: 0.85, travel: 0.14 },
  top: { road: 24, offroad: 15, reverse: 3 },
  accel: 8, reverseAccel: 3, brake: 18, handbrake: 22,
  steer: { max: 0.5, falloff: 8, rate: 6 },
  grip: { road: 20, offroad: 15, handbrake: 12, redirect: 0.95 },
  handbrakeYaw: 0,
  bump: { road: 0.006, offroad: 0.035 },
  suspension: { k: 65, c: 14, liftK: 120, liftC: 18 },
  stabilizer: { maxLean: 0.38, response: 7, gravity: 9.8 },
  wade: 0.5,
  hitbox: [{ z: -0.8, r: 0.38 }, { z: 0, r: 0.38 }, { z: 0.8, r: 0.38 }],
  hitY: [0.25, 1.45],
  creatures: { ...JEEP.creatures, smallMass: 70, hitK: 4 },
  noise: { idle: 16, max: 65, every: 0.5 },
  lights: { ...JEEP.lights, intensity: 430, range: 65, angle: 0.48 },
  door: { x: 0.55, y: 0.9, z: 0.2, radius: 2.3 },
  exits: [[-1.3, 0.2], [1.3, 0.2], [0, 2], [0, -2]],
  parked: [{ x: 0, z: 0, hx: 0.38, hz: 1.25, y0: 0.25, y1: 1.4 }],
  seat: [0, 1.7, 0.2],
  enginePoint: [0, 0.65, 0],
  chase: { back: 5.4, up: 2.7, lookAhead: 3, follow: 5 },
  toasts: {
    50: 'Motorbike at 50% — the engine is rattling. The stabilizer is still holding.',
    25: 'Motorbike at 25%! Stop and repair it before the engine gives out.',
    0: 'Motorbike wrecked. Dismount and hold the interact button beside it to repair.',
    fieldRepaired: 'Ride to the field lab pump for a full service.',
    stuck: 'Stuck. Dismount and hold the interact button beside the bike to recover it.',
  },
}

// The sea lab's research submersible: a yellow two-tonne boat with an acrylic
// bubble for a bow. Local frame as the others: forward is -Z, y = 0 is the
// bottom of its skids. Its depth is the ballast model in vehicles/ballast.js.
export const SUB = {
  kind: 'sub',
  name: 'submersible',
  hudName: 'SUBMERSIBLE',
  mapLabel: 'SUB',
  exitBlocked: 'Surface and stop first — or bring her up in the moon pool',
  hull: 100,
  mass: 2600,
  visibility: 0.4, // a land animal has no idea what it is looking at
  strikeMul: 0.4,
  strikeThrough: 0,
  exitSpeed: 0.8,
  seatView: 'seat',
  load: { radius: 200, unload: 260 },
  halfLength: 2.4,
  halfWidth: 1.3,
  // The float body: its share under water grows from y0 to y1 over the keel.
  // Neutral she floats with her waterline at y1, the seat's eye 0.35 m clear.
  float: { y0: 0.1, y1: 1.0 },
  // reserve: extra lift of blown tanks (share of her weight); rate and trim:
  // how fast Space/Shift move the ballast and letting go trims it back (per
  // second) — to neutral under water, to `float` once she is breaking the
  // surface, so she stays up riding high; drag: water drag on her climb or
  // dive (about 1.5 m/s at most)
  ballast: { reserve: 0.25, rate: 0.9, trim: 0.6, float: 0.6, drag: 1.3, drag2: 0.25 },
  // thrust: forward and reverse push (m/s²), linear and quadratic drag (about
  // 4.8 m/s flat out), how fast sideways drift dies, yaw rate and response
  thrust: { forward: 1.6, reverse: 0.4, drag: 0.12, drag2: 0.045, side: 2.4, yaw: 0.7, response: 2.5 },
  // Collisions: circles along the spine spanning hitY over the keel against
  // piles and walls; keel points that feel the seabed. A rise under one
  // shallower than `climb` lifts her over it, anything steeper is a wall.
  hitbox: [
    { z: -1.35, r: 0.98 },
    { z: 0.1, r: 1.0 },
    { z: 1.6, r: 0.85 },
  ],
  hitY: [0.15, 2.35],
  keel: [
    [0, -2.1],
    [0, 2.3],
    [-0.9, 0],
    [0.9, 0],
    [0, 0],
  ],
  climb: 0.6,
  impact: { min: 2.0, k: 9, bounce: 0.25, maxHit: 45 },
  bottom: { min: 1.7, k: 10 }, // settling onto the bed faster than this hurts
  // the moon pool's cradle eases her in once she is surfaced, slow and inside it
  dock: { speed: 1.4, pull: 1.2 },
  // Stranded (beached, or wedged under something for `stuckAfter` s): the
  // board prompt has the station tow her home to the cradle.
  recover: { hold: 5, stuckAfter: 5 },
  sonar: { cooldown: 2.5, show: 6, range: 160 },
  noise: { idle: 5, max: 16, every: 0.7 },
  // one beam from the lamp bar under the bow; only in the scene while it's on
  lights: { intensity: 1100, range: 46, angle: 0.62, penumbra: 0.55, decay: 1.15, warmRange: 60 },
  // the hatch, offered on whichever shoulder of the hull you are beside
  door: { x: 0.8, y: 1.9, z: -0.2, radius: 3.8 },
  exits: [
    [-2.5, 0],
    [2.5, 0],
    [0, -3.6],
    [0, 3.6],
  ],
  parked: [{ x: 0, z: 0.1, hx: 1.15, hz: 2.3, y0: 0.1, y1: 2.0 }],
  enginePoint: [0, 1.2, 2.4],
  seat: [0, 1.35, -1.25],
  chase: { back: 9, up: 3, lookAhead: 4, follow: 3 },
  toasts: {
    50: 'Submersible hull at 50% — she is weeping at the seals. Take her back to the moon pool.',
    25: 'Submersible hull at 25%! Alarms on every panel — surface now.',
    0: 'Hull breach! The emergency ballast has blown — she is coming up.',
    grounded: 'The submersible is crippled. Climb out and hold E beside her to patch the hull.',
    fieldRepaired: 'Bring her back to the moon pool and winch her up for a proper service.',
    stranded: 'She is stranded. Climb out and hold E beside her to have the station tow her home.',
  },
}
