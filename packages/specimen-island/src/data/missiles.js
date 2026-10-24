// Guided missiles, as data: the airframe and motor of each missile, the
// launcher's seeker that finds a lock, and how hot everything on the island
// looks to it. game/guidance.js does the maths, game/missiles.js flies them,
// and every warhead goes off through game/blast.js (`blast` names a BLASTS
// preset).
//
// Units are metres, seconds and radians. Speeds are m/s; `accel` is m/s².

export const MISSILES = {
  // A short-range infrared missile off the gunship's rails.
  heatseeker: {
    name: 'IR missile',
    hudName: 'MSL',
    blast: 'missile',
    cost: 50, // the Foundation bills every launch to the ledger, hit or miss
    reload: 0.5, // s between launches (the rails alternate sides)
    // off the rail: it falls clear of the airframe before the motor lights
    drop: 0.28,
    eject: 4, // m/s pushed down off the rail
    gravity: 9.8,
    motor: { burn: 2.4, accel: 120 }, // s of boost, thrust
    maxSpeed: 230,
    drag: 0.12, // share of speed lost per second once the motor is out
    stall: 40, // it never coasts slower than this
    life: 9, // s from launch, then the warhead self-destructs
    arm: 0.6, // s before the warhead arms: an earlier impact is a dud
    // guidance: proportional navigation with constant `nav`, a little pure
    // pursuit so a slow missile off the rail still swings onto the target,
    // and an airframe that turns no faster than `turn`
    nav: 4,
    pursuit: 1.2,
    turn: 1.7,
    gimbal: 0.75, // half-angle off the nose its own seeker can see
    fuse: 2.5, // proximity fuse, metres beyond the target's girth: it fires at the closest pass inside that
    // the smoke: a ribbon through every point it passes, `width` at the motor
    // and spreading `spread` m/s, fading over `life`; puffs along it give it
    // body (fewer once the motor is out: `coast`)
    trail: { width: 0.35, spread: 1.3, life: 3.5, alpha: 0.7, puffs: { spacing: 5, size: 0.9, grow: 1.4, life: 2.4, coast: 0.4 } },
  },
}

// The launcher's seeker: a cone ahead of the aircraft, along the pilot's
// sight, that looks for the strongest heat source in line of sight.
export const SEEKER = {
  cone: 0.2, // half-angle of the lock cone
  range: 750,
  // what it reads off a source: heat / (1 + (d / falloff)²), a little
  // weaker towards the edge of the cone (by up to `offAxis`)
  falloff: 150,
  offAxis: 0.35,
  minSignal: 0.1, // weaker than this and it hears nothing but its own growl
  lockTime: 1.1, // s to lock a strong source
  strong: 5, // a source this many times minSignal locks at full speed;
  slowest: 0.4, // a faint one no slower than this fraction of it
  decoy: 1.25, // to steal a held lock a source must read this much hotter than the target did,
  gate: 0.12, // and be within this angle of it: the tracking window round the target
  grace: 0.45, // s a lock survives with its target out of sight
  scan: 0.1, // s between the launcher's sweeps
  missileScan: 0.08, // and a missile's own
}

// Heat signatures. An animal's scales with its body: k · (mass / ref)^exp,
// so a triceratops reads ~3, a raptor ~0.2 and a compy next to nothing;
// leaves hide some of it. A burning flare outshines anything alive. An engine
// reads its vehicle's `heat` (data/vehicles.js; `vehicle.default` if it has
// none) times how warm it is: it heats over `warm` seconds of running and
// cools over `cool` once stopped, so a parked jeep stays a target a while.
export const HEAT = {
  creature: { k: 1, ref: 1000, exp: 2 / 3, canopy: 0.6 },
  flare: 14,
  flareFade: 3, // s: a dying flare fades over its last seconds
  vehicle: { default: 4, running: 0.05, warm: 25, cool: 240 },
}
