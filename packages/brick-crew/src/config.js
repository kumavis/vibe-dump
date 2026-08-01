// ---------------------------------------------------------------------------
// Brick Crew — shared constants. 1 world unit = 1 metre.
//
// Everything in the app measures itself against these numbers: the masonry
// module lays bricks on this grid, the props are sized to it, and the sim
// walks robots between the landmarks in SITE. Change a number here and the
// whole site follows.
// ---------------------------------------------------------------------------

/** A single brick, in metres (length along the run, height, wall thickness). */
export const BRICK = { L: 0.4, H: 0.16, D: 0.2 }
/** Mortar joint. Bricks are drawn one joint shorter than their pitch. */
export const MORTAR = 0.02
/** Nominal centre-to-centre spacing along a run. */
export const PITCH = BRICK.L + MORTAR // 0.42
/** Course height (brick + bed joint). */
export const COURSE = BRICK.H + MORTAR // 0.18

/** The house the crew is putting up. */
export const HOUSE = {
  w: 5.04, // exterior extent along X (the ridge runs this way)
  d: 4.18, // exterior extent along Z
  t: BRICK.D, // single-leaf wall thickness
  wallCourses: 14, // 2.52 m to the wall plate
  gableCourses: 7, // 1.26 m more to the ridge
  eaveOverhang: 0.3, // roof projection past the long walls, in Z
}

/** Wall-top height, ridge height, and the pitch those two imply. */
export const EAVE_Y = HOUSE.wallCourses * COURSE // 2.52
export const RIDGE_RISE = HOUSE.gableCourses * COURSE // 1.26
export const RIDGE_Y = EAVE_Y + RIDGE_RISE // 3.78
export const ROOF_RUN = HOUSE.d / 2 // 2.09
export const ROOF_PITCH = Math.atan2(RIDGE_RISE, ROOF_RUN) // ~31.1 deg
/** Wall centreline offsets (bricks sit on these lines). */
export const WALL_Z = HOUSE.d / 2 - HOUSE.t / 2 // 1.99 — long walls, at z = +/-
export const WALL_X = HOUSE.w / 2 - HOUSE.t / 2 // 2.42 — gable walls, at x = +/-

/** External chimney breast, flush against the east gable. */
export const CHIMNEY = {
  side: 1,
  x: HOUSE.w / 2 + BRICK.D / 2, // 2.62, hard against the outer face
  z: -0.9,
  depth: BRICK.D, // footprint along X
  runLen: 0.82, // footprint along Z
  // 22 courses is 3.96 m: the stack has to clear the 3.78 m ridge or it just
  // reads as more gable wall, and it can't go much higher than the top deck
  // plus a mason's reach.
  courses: 22,
}

/** Scaffold decks. Masons climb to the lowest deck they can work from. */
export const DECKS = [
  { y: 0 }, // feet on the dirt
  { y: 1.44 },
  { y: 2.7 },
]
/** How far above its own feet a robot can set a brick. */
export const REACH = 1.7
/** How far below its feet it will still work (stops masons laying from a deck they tower over). */
export const DROP = 1.25
/** How far a mason stands back from the face they are laying, on the ground. */
export const LAY_STANDOFF = 0.72

/**
 * Scaffold ring. A rectangle of decking standing off the wall faces; masons
 * walk its centreline, so `rx`/`rz` double as the standing line on a deck.
 */
const SCAFFOLD_STANDOFF = 0.85
export const SCAFFOLD = {
  rx: HOUSE.w / 2 + SCAFFOLD_STANDOFF, // 3.37
  rz: HOUSE.d / 2 + SCAFFOLD_STANDOFF, // 2.94
  deckW: 0.6,
  /** Ladder run, on the west leg of the ring. */
  ladder: { x: -(HOUSE.w / 2 + SCAFFOLD_STANDOFF), z: 2.05 },
}

/** Landmarks. Everything the crew walks between lives here. */
export const SITE = {
  trailer: { x: -7.9, z: 3.6, rot: 0.62 },
  /** Brick pallets the haulers load from. */
  pallets: [
    { x: 8.2, z: -3.0 },
    { x: 8.2, z: -1.2 },
    { x: 8.2, z: 0.6 },
  ],
  /** The mason supply pile — bricks land here, masons draw from here. */
  stack: { x: 0.0, z: 4.15 },
  mixer: { x: 3.4, z: 5.1 },
  timber: { x: -4.9, z: -3.4 },
  dumpster: { x: 8.6, z: 5.2 },
  privy: { x: -8.6, z: -2.2 },
  /** Gate in the hoarding, on the road side. */
  gate: { x: 0, z: 7.0 },
  roadZ: 9.7,
  /** Site hoarding. The gate is the gap in the z1 run. */
  fence: { x0: -11.2, x1: 10.2, z0: -6.6, z1: 7.0, gapX0: -1.7, gapX1: 1.7 },
  /** Where a crew lines up during handover. */
  muster: { x: -5.4, z: 5.9 },
  /** Off-site marker crews walk to when they clock off. */
  offsite: { x: 17.0, z: 9.7 },
  arrival: { x: -17.0, z: 9.7 },
}

/** Wall clock: a shift is five real minutes. */
export const SHIFT_SECONDS = 300

/** Crew liveries, cycled one per shift. */
export const CREWS = [
  { name: 'Redline', accent: 0xd8442f, hat: 0xf4b41a },
  { name: 'Bluecap', accent: 0x2f6fd8, hat: 0xe8ecef },
  { name: 'Greenfield', accent: 0x2f9e5a, hat: 0x8fd14f },
  { name: 'Violet', accent: 0x7a4bd8, hat: 0xf07acc },
  { name: 'Copper', accent: 0xc46a1f, hat: 0xf4e0a1 },
]

/** Crew composition. One entry per robot on shift. */
export const ROSTER = [
  { role: 'foreman', n: 1 },
  { role: 'barrow', n: 2 },
  { role: 'carrier', n: 2 },
  { role: 'mason', n: 6 },
]

/** How much a hauler moves in one trip, and how much a mason carries to the wall. */
export const LOAD = { barrow: 8, carrier: 3, mason: 6 }
/** Units the supply stack can hold before haulers stop topping it up. */
export const STACK_CAP = 70

/** Movement + work rates, tuned so a house tops out in roughly eleven minutes. */
export const RATE = {
  walk: 2.1, // m/s unladen
  walkLaden: 1.75, // m/s with a barrow or an armful
  climb: 2.0, // m/s up a ladder
  layTime: 0.9, // seconds spent setting one unit
  pickTime: 0.2, // seconds per unit when loading up
}
/** How close two masons will work on the same face before one waits. */
export const WORK_SPACING = 0.8

/** How far into the build the site already is when the page loads. */
export const PREROLL_SECONDS = 260

/** Materials palette. */
export const COLORS = {
  brick: [0xa8412c, 0x9c3a28, 0xb4523a, 0x8f3524, 0xbb6046],
  mortar: 0xcfc7b6,
  lintel: 0x7c7c76,
  timber: 0xb98a4e,
  tile: [0x4a4f57, 0x555b64, 0x41464d],
  dirt: 0xb09272,
  grass: 0x7fa25c,
}
