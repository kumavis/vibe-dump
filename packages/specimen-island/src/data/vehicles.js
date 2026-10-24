// Vehicle tuning: the numbers a designer would tweak about the helicopter, the
// ranger jeep, the trail bike and Camp Halvorsen's humvee and tank (handling,
// damage, hitboxes, sounds, recovery, the tank's tracks and gun). The flight,
// suspension and track models in vehicles/*.js read these tables; only small
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

// The security detachment's armoured utility vehicle, left in Camp
// Halvorsen's motor pool: the jeep's handling, heavier and wider, on big
// tyres, with a closed cab that keeps most of a blow off the driver. Its roof
// gun rusted solid years ago.
export const HUMVEE = {
  ...JEEP,
  kind: 'humvee', name: 'humvee', hudName: 'HUMVEE', mapLabel: 'HUMVEE',
  exitBlocked: 'Stop the humvee first',
  mass: 3500, visibility: 1.7,
  armour: 0.6, // every hull hit, relative to the jeep's (Vehicle.damage)
  strikeMul: 0.45, strikeThrough: 0.1, // a closed, armoured cab
  paint: [92, 98, 66], // faded olive drab
  // body: 4.9 m long, 2.2 m wide, roof at 1.9 m
  halfLength: 2.45, halfWidth: 1.1,
  wheel: { r: 0.47, width: 0.36, x: 0.93, z: 1.66, travel: 0.22 },
  top: { road: 21, offroad: 14, reverse: 6 },
  accel: 5.4, reverseAccel: 5, brake: 13, handbrake: 8,
  coverDrag: 0.22, // it bulls through more undergrowth than the jeep
  steer: { max: 0.55, falloff: 10, rate: 6 },
  grip: { road: 15, offroad: 11, handbrake: 1.4, redirect: 0.9 },
  handbrakeYaw: 0.7,
  stepUp: 0.85,
  bump: { road: 0.008, offroad: 0.05 },
  suspension: { k: 62, c: 12, liftK: 110, liftC: 15 },
  wade: 1.0,
  hitbox: [{ z: -1.5, r: 1.1 }, { z: 0, r: 1.1 }, { z: 1.5, r: 1.1 }],
  hitY: [0.4, 1.9],
  impact: { min: 4.5, k: 2.4, bounce: 0.3, scrub: 0.8, maxHit: 50 },
  creatures: { ...JEEP.creatures, smallMass: 500, hitK: 8, heavyK: 2.6 },
  noise: { idle: 30, max: 90, every: 0.5 },
  door: { x: 1.3, y: 1.1, z: 0.0, radius: 2.8 },
  exits: [[-2.0, 0.0], [2.0, 0.0], [0, 3.4], [0, -3.4], [-2.0, -1.8], [2.0, 1.8]],
  parked: [
    { x: 0, z: 0, hx: 1.1, hz: 2.45, y0: 0.35, y1: 1.95 }, // body, cab and wheels
    { x: 0, z: 0.1, hx: 0.5, hz: 0.5, y0: 1.95, y1: 2.6 }, // the roof gun's shield
  ],
  enginePoint: [0, 1.25, -1.7],
  seat: [-0.5, 1.75, 0.05],
  chase: { back: 8.5, up: 3.2, lookAhead: 4, follow: 4 },
  toasts: {
    50: 'Humvee hull at 50% — the armour is holding, the engine less so.',
    25: 'Humvee hull at 25%! Coolant everywhere — get it out of trouble.',
    0: 'The humvee is wrecked. Climb out and hold E beside it to patch it up.',
    fieldRepaired: 'Drive it to the pump on the field lab helipad for a proper service.',
    stuck: 'Stuck. Climb out and hold E beside the humvee to winch it free.',
  },
}

// The detachment's light tank. Tracked and skid-steered: W/S drive both
// tracks, A/D drive them against each other, so it turns on the spot. Slow,
// heavy and very hard to stop: it climbs what a jeep can't, fells saplings and
// palms, wades deep, and anything smaller than a hadrosaur goes under the
// tracks (a kill on the ledger, like the jeep's). The turret follows where
// you look and the gun lays itself on whatever is under the sight; LMB fires
// a high-explosive shell with travel time and drop that goes off through
// game/blast.js. It is the loudest thing on the island, and the tyrant comes
// to see what made the noise (data/species.js `lure`).
//
// Its local frame matches the others: forward is -Z, y = 0 under the tracks.
export const TANK = {
  ...JEEP,
  kind: 'tank', name: 'tank', hudName: 'TANK', mapLabel: 'TANK',
  exitBlocked: 'Stop the tank first',
  hull: 100,
  armour: 0.3, // hull hits (shells, rams, landings) count this much
  mass: 32000,
  visibility: 2,
  strikeMul: 0.15, strikeThrough: 0, // a dinosaur's blow barely scratches it
  exitSpeed: 1.0,
  load: { radius: 260, unload: 320 },
  paint: [86, 92, 60],
  // hull 7.2 m long, 3.4 m over the tracks; deck at 1.8 m, turret roof at 2.75
  halfLength: 3.6, halfWidth: 1.7,
  // the four corner contacts settle() parks it on, and the road wheels'
  // size (the tracks animate from them)
  wheel: { r: 0.36, width: 0.56, x: 1.38, z: 2.5, travel: 0.1 },
  track: { x: 1.38, width: 0.56, z: [-2.65, 0, 2.65], pitch: 0.17 }, // ground contacts along each track
  top: { road: 11, offroad: 8.5, reverse: 4 },
  accel: 2.6, reverseAccel: 2.2, brake: 7, coast: 1.6, handbrake: 9,
  rolling: { road: 0.4, offroad: 0.7 },
  coverDrag: 0.05, // undergrowth is nothing to it
  // skid steering: turn rate on the spot (rad/s), the share of it lost at
  // top speed, how fast the tracks spin up to it, and how hard the tracks
  // hold against sliding sideways
  turn: { pivot: 0.62, speedLoss: 0.45, rate: 1.6 },
  grip: { road: 22, offroad: 18, handbrake: 22, redirect: 0 },
  slopeK: 0.55, // share of a slope's pull the low gears and tracks don't hold off
  stepUp: 0.95,
  bump: { road: 0.004, offroad: 0.018 },
  suspension: { k: 90, c: 18, liftK: 160, liftC: 22 },
  follow: { down: 12, up: 4 },
  wade: 1.5,
  hitbox: [{ z: -2.0, r: 1.7 }, { z: -0.7, r: 1.7 }, { z: 0.7, r: 1.7 }, { z: 2.0, r: 1.7 }],
  hitY: [1.0, 2.6], // anything lower it rolls over or crushes
  impact: { min: 3, k: 2, bounce: 0.15, scrub: 0.6, maxHit: 40 },
  landing: { min: 6, k: 4 },
  // trees with a trunk this thin go over (world/vegetation.js fell); the
  // jungle giants stop it. Each one costs this share of its speed.
  fell: { trunk: 0.42, drag: 0.15 },
  creatures: { smallMass: 2600, hitMin: 0.8, hitK: 60, heavyMin: 2.5, heavyK: 1.2, bounce: 0.1 },
  noise: { idle: 70, max: 170, every: 0.5 },
  lights: { ...JEEP.lights, intensity: 600, range: 70 },
  // The main gun. The shell flies a ballistic arc at `muzzle` m/s and goes off
  // as BLASTS[blast] wherever it stops. The turret slews at `traverse` rad/s,
  // the gun elevates at `elevate` between `depress` and `raise` (radians, off
  // the hull's deck). `rounds` is the ready rack (Camp Halvorsen's ammo
  // bunker refills it within `rearm` m of its door); `start` is what the
  // detachment left in it. The shot itself is heard `noise` m away.
  gun: {
    blast: 'shell', weapon: 'tankGun',
    muzzle: 190, gravity: 9.8, life: 8, range: 900,
    reload: 5, rounds: 12, start: 6, rearm: 14,
    traverse: 0.9, elevate: 0.45, depress: -0.14, raise: 0.38,
    recoil: 0.45, kick: 0.9, shake: 0.9, noise: 450,
  },
  // the gunner's sight (RMB / LT): zoom per camera
  sight: { seat: 3.2, chase: 1.6 },
  door: { x: 2.1, y: 1.4, z: 0.4, radius: 3.4 },
  exits: [[-2.7, 0.4], [2.7, 0.4], [-2.7, -1.8], [2.7, -1.8], [0, 5.0], [0, -5.2]],
  parked: [
    { x: 0, z: 0, hx: 1.7, hz: 3.6, y0: 0.3, y1: 1.85 }, // hull and tracks
    { x: 0, z: 0.3, hx: 1.25, hz: 1.4, y0: 1.85, y1: 2.8 }, // turret
  ],
  enginePoint: [0, 1.9, 2.6],
  seat: [-0.45, 2.55, 0.0], // the gunner's sight, on the turret's left
  chase: { back: 12, up: 4.6, lookAhead: 6, follow: 10 },
  toasts: {
    50: 'Tank hull at 50% — the armour has taken a beating.',
    25: 'Tank hull at 25%! The engine deck is on fire.',
    0: 'The tank is knocked out. Climb out and hold E beside it to patch it up.',
    fieldRepaired: 'Drive it to the pump on the field lab helipad for a proper service.',
    stuck: 'Stuck. Climb out and hold E beside the tank to winch it free.',
    empty: 'Ready rack empty — Camp Halvorsen’s ammo bunker holds more shells.',
  },
}
