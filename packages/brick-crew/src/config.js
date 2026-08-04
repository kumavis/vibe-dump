// ---------------------------------------------------------------------------
// Brick Crew — shared constants. 1 world unit = 1 metre.
//
// The street holds several plots and no two houses on it are the same, so the
// numbers that describe *a* house live in a variant and get expanded by
// houseGeom(). Everything downstream — the masonry plan, the scaffold, the
// navigation graph, the drawing — reads that expanded geometry rather than a
// global constant.
// ---------------------------------------------------------------------------

/** A single brick, in metres (length along the run, height, wall thickness). */
export const BRICK = { L: 0.4, H: 0.16, D: 0.2 }
/** Mortar joint. Bricks are drawn one joint shorter than their pitch. */
export const MORTAR = 0.02
/** Nominal centre-to-centre spacing along a run. */
export const PITCH = BRICK.L + MORTAR // 0.42
/** Course height (brick + bed joint). */
export const COURSE = BRICK.H + MORTAR // 0.18

/** How far above its own feet a robot can set a brick. */
export const REACH = 1.7
/** How far below its feet it will still work. */
export const DROP = 1.25
/** How far a mason stands back from the face it is laying, on the ground. */
export const LAY_STANDOFF = 0.72
/** How close two robots will work on the same face before one waits. */
export const WORK_SPACING = 0.8

/** The houses on the street. One per plot, cycled. */
export const HOUSE_TYPES = [
  { key: 'cottage', name: 'GABLE COTTAGE', w: 5.04, d: 4.18, wallCourses: 14, gableCourses: 7, eaveOverhang: 0.3 },
  { key: 'stack', name: 'THE LITTLE STACK', w: 4.2, d: 3.78, wallCourses: 16, gableCourses: 6, eaveOverhang: 0.26, garden: true },
  { key: 'lodge', name: 'BRICKWORKS LODGE', w: 5.88, d: 4.2, wallCourses: 12, gableCourses: 8, eaveOverhang: 0.36 },
  // long and low
  { key: 'barn', name: 'THE LONG BARN', w: 7.56, d: 4.0, wallCourses: 11, gableCourses: 6, eaveOverhang: 0.42 },
  // narrow and tall
  { key: 'tower', name: 'CHIMNEY HOUSE', w: 3.78, d: 3.6, wallCourses: 20, gableCourses: 6, eaveOverhang: 0.24 },
  // wide, deep and squat
  { key: 'hall', name: 'MASONS HALL', w: 6.72, d: 4.62, wallCourses: 13, gableCourses: 9, eaveOverhang: 0.34 },
  // a tall narrow one with a garden
  { key: 'stackTall', name: 'THE HIGH STACK', w: 4.2, d: 3.78, wallCourses: 18, gableCourses: 8, eaveOverhang: 0.28, garden: true },
]

/** What the roofers cover it with. Tiles are laid in three shades of it. */
export const ROOFS = [
  { name: 'Slate', color: 0x4a4f57 },
  { name: 'Charcoal', color: 0x34383e },
  { name: 'Clay', color: 0xa8562d },
  { name: 'Moss', color: 0x55704a },
  { name: 'Ash', color: 0x8d9299 },
  { name: 'Plum', color: 0x5d4159 },
  { name: 'Bronze', color: 0x7c6234 },
]

/** Three tiles off the same pallet are never quite the same shade. */
export function tileShades(base) {
  const r = (base >> 16) & 255
  const g = (base >> 8) & 255
  const b = base & 255
  const shift = (k) => {
    const f = (v) => Math.max(0, Math.min(255, Math.round(v + k)))
    return (f(r) << 16) | (f(g) << 8) | f(b)
  }
  return [base, shift(11), shift(-10)]
}

/** Paint the decorators bring. One per house, so the street reads as a street. */
export const PAINT = [
  { name: 'Chalk', color: 0xe9e2cf },
  { name: 'Sage', color: 0x9bba93 },
  { name: 'Cornflower', color: 0x8aa9d2 },
  { name: 'Terracotta', color: 0xd6835c },
  { name: 'Lilac', color: 0xb3a3c9 },
  { name: 'Mint', color: 0x8ccdb4 },
  { name: 'Butter', color: 0xe7c97a },
]

/**
 * Expand a house variant into everything the rest of the app measures against.
 * Nothing here is a global: two plots on the street hold two different geoms.
 */
export function houseGeom(type) {
  const t = BRICK.D
  const eaveY = type.wallCourses * COURSE
  const ridgeRise = type.gableCourses * COURSE
  const ridgeY = eaveY + ridgeRise
  const roofRun = type.d / 2
  const roofPitch = Math.atan2(ridgeRise, roofRun)
  const tanPitch = ridgeRise / roofRun
  const slopeLen = (roofRun + type.eaveOverhang) / Math.cos(roofPitch)
  // Two working lifts: one that reaches the wall plate, one for the gables,
  // the chimney and the roof.
  const decks = [{ y: 0 }, { y: Math.max(1.2, eaveY - 1.15) }, { y: eaveY + 0.18 }]
  return {
    ...type,
    t,
    eaveY,
    ridgeRise,
    ridgeY,
    roofRun,
    roofPitch,
    tanPitch,
    slopeLen,
    decks,
    /** Wall centrelines: long walls at z = +/-wallZ, gable walls at x = +/-wallX. */
    wallZ: type.d / 2 - t / 2,
    wallX: type.w / 2 - t / 2,
    /** Chimney breast, hard against the east gable, tall enough to clear the ridge. */
    chimney: {
      side: 1,
      x: type.w / 2 + t / 2,
      z: -Math.min(0.9, type.d / 2 - 0.7),
      depth: t,
      runLen: 0.82,
      courses: Math.ceil((ridgeY + 0.22) / COURSE),
    },
    /** Scaffold ring. Masons walk its centreline, so rx/rz are the standing line. */
    scaffold: {
      rx: type.w / 2 + 0.85,
      rz: type.d / 2 + 0.85,
      deckW: 0.6,
      ladder: { x: -(type.w / 2 + 0.85), z: Math.min(2.05, type.d / 2 - 0.1) },
    },
  }
}

/** Height of the roof plane (top of the rafters) at a given |z|. */
export const roofTopY = (g, zAbs) => g.eaveY + 0.12 + (g.roofRun - zAbs) * g.tanPitch
/** |z| of a point `sd` metres up the slope from the drip edge. */
export const slopeZ = (g, sd) => g.roofRun + g.eaveOverhang - sd * Math.cos(g.roofPitch)

/**
 * Materials. A mason has to fetch the right one for whatever it is setting —
 * you cannot lay a rafter out of the brick pile. Each has a stock by the house
 * and a delivery point out in the yard, both given relative to the plot.
 */
export const MATERIALS = [
  { key: 'brick', label: 'BRICK', color: 0xa8412c, cap: 56, load: { barrow: 8, carrier: 3, mason: 6 } },
  { key: 'cast', label: 'CAST', color: 0x7c7c76, cap: 12, load: { barrow: 4, carrier: 2, mason: 2 } },
  { key: 'timber', label: 'TIMBER', color: 0xb98a4e, cap: 14, load: { barrow: 4, carrier: 2, mason: 2 } },
  { key: 'tile', label: 'TILE', color: 0x4a4f57, cap: 26, load: { barrow: 6, carrier: 3, mason: 4 } },
  { key: 'joinery', label: 'JOINERY', color: 0x9fc4dd, cap: 10, load: { barrow: 3, carrier: 2, mason: 2 } },
]
/** Which stock each kind of item comes out of. */
export const MATERIAL_OF = {
  brick: 'brick',
  lintel: 'cast',
  sill: 'cast',
  plate: 'timber',
  rafter: 'timber',
  ridge: 'timber',
  tile: 'tile',
  cap: 'tile',
  floor: 'cast',
  frame: 'joinery',
  pane: 'joinery',
  door: 'joinery',
}

/** Plot-relative yard layout. The whole yard follows the crew down the street. */
export const YARD = {
  /** Stocks the masons draw from, in front of the house. */
  stacks: {
    brick: { x: -2.5, z: 4.5 },
    cast: { x: -0.7, z: 4.6 },
    timber: { x: 1.1, z: 4.6 },
    tile: { x: 2.9, z: 4.5 },
    joinery: { x: 4.7, z: 4.4 },
  },
  /** Where the lorry drops each material, out at the edge of the plot. */
  sources: {
    brick: { x: 8.4, z: -2.2 },
    cast: { x: 8.4, z: 0.2 },
    timber: { x: 8.4, z: 2.2 },
    tile: { x: 6.6, z: 3.8 },
    joinery: { x: 6.6, z: 1.4 },
  },
  mixer: { x: 6.4, z: 5.0 },
  dumpster: { x: -6.0, z: 4.6 },
  privy: { x: -6.4, z: -3.0 },
  /** Where the carpenter's lorry parks to unload. */
  truck: { x: 2.8, z: 6.6, rot: Math.PI / 2 },
}

/**
 * The far row is an exact mirror of the near one about the road centreline, so
 * anything measured on one side can be reflected onto the other with `mirror`
 * rather than kept as a second set of numbers.
 */
const ROAD_Z = 12.4
const FAR_Z = 2 * ROAD_Z

export const PLOTS = [
  { x: -13, z: 0, rot: 0 },
  { x: -13, z: FAR_Z, rot: Math.PI },
  { x: 0, z: 0, rot: 0 },
  { x: 0, z: FAR_Z, rot: Math.PI },
  { x: 13, z: 0, rot: 0 },
  { x: 13, z: FAR_Z, rot: Math.PI },
]

/**
 * Plot space ↔ world. The far row is turned to face the road, so everything
 * measured against a plot — stocks, drops, the crew's route in — has to be
 * turned with it. Plot-local +z is always "toward the road".
 */
export function toWorld(origin, p) {
  if (!origin.rot) return { x: origin.x + p.x, z: origin.z + p.z }
  const c = Math.cos(origin.rot)
  const s = Math.sin(origin.rot)
  return { x: origin.x + p.x * c + p.z * s, z: origin.z - p.x * s + p.z * c }
}
/** True for a plot on the far side of the road. */
export const isFar = (origin) => origin.z > ROAD_Z
/** Reflect a point across the road, for the far row's copy of a landmark. */
export const mirror = (p) => ({ ...p, z: 2 * ROAD_Z - p.z })
/** The landmark on the row this plot belongs to. */
export const forRow = (origin, p) => (isFar(origin) ? mirror(p) : p)
/** The hoarding round the row this plot belongs to. */
export const fenceFor = (origin) => (isFar(origin) ? SITE.fenceFar : SITE.fence)

/**
 * The hoarding as a set of solid runs for the router, with the gateway left
 * open. Each is an axis-aligned box in world coordinates; a half-metre of
 * thickness so a robot cannot squeeze through the panel itself.
 */
export function fenceRuns(origin) {
  const f = fenceFor(origin)
  const gz = f.gateZ
  const bz = gz === f.z1 ? f.z0 : f.z1
  // Thick enough that a robot shoved sideways by the crowd still cannot end up
  // standing in the panel: the router keeps a berth rather than hugging it.
  const T = 0.34
  const midX = (f.x0 + f.x1) / 2
  const midZ = (f.z0 + f.z1) / 2
  return [
    { x: midX, z: bz, hw: (f.x1 - f.x0) / 2, hd: T },
    { x: f.x0, z: midZ, hw: T, hd: (f.z1 - f.z0) / 2 },
    { x: f.x1, z: midZ, hw: T, hd: (f.z1 - f.z0) / 2 },
    { x: (f.x0 + f.gapX0) / 2, z: gz, hw: (f.gapX0 - f.x0) / 2, hd: T },
    { x: (f.gapX1 + f.x1) / 2, z: gz, hw: (f.x1 - f.gapX1) / 2, hd: T },
  ]
}

export function toLocal(origin, p) {
  const dx = p.x - origin.x
  const dz = p.z - origin.z
  if (!origin.rot) return { x: dx, z: dz }
  const c = Math.cos(origin.rot)
  const s = Math.sin(origin.rot)
  return { x: dx * c - dz * s, z: dx * s + dz * c }
}

/** Site-wide landmarks — these do not move when the crew changes plot. */
export const SITE = {
  trailer: { x: -20.5, z: 5.2, rot: 0.5 },
  gate: { x: 0, z: 9.2 },
  roadZ: ROAD_Z,
  /** The near row's hoarding; `gateZ` is the side the crew comes in on. */
  fence: { x0: -24.5, x1: 24.5, z0: -8.4, z1: 9.2, gapX0: -2.0, gapX1: 2.0, gateZ: 9.2 },
  /** The far row's, reflected across the road. */
  fenceFar: {
    x0: -24.5, x1: 24.5, z0: 2 * ROAD_Z - 9.2, z1: 2 * ROAD_Z + 8.4,
    gapX0: -2.0, gapX1: 2.0, gateZ: 2 * ROAD_Z - 9.2,
  },
  farZ: FAR_Z,
  /** Where a crew gathers by the gate before walking back up the road. */
  muster: { x: -4.6, z: 7.6 },
  /** The yard end of the road: crews come from here and go back to it. */
  offsite: { x: -30.5, z: 12.4 },
  arrival: { x: -30.5, z: 12.4 },
  /** The arrow painted on the road that takes you down to the yard. */
  arrow: { x: 9.0, z: 12.4 },
}

/**
 * The builders' merchant, at the head of the same street — near enough that
 * you can see the site over its wall, which is the point. Its z sits on the
 * kerb line so the compound's local z=0 is the road edge.
 */
export const DEPOT = { x: -42, z: 12.4 }

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

/** How long before a changeover the yard starts building the next crew. */
export const KIT_LEAD_SECONDS = 292

/** Movement + work rates, tuned so a house tops out in roughly eleven minutes. */
export const RATE = {
  walk: 2.1,
  walkLaden: 1.75,
  climb: 2.0,
  layTime: 0.9,
  pickTime: 0.2,
  /** Carrying a sofa is slower than carrying bricks. */
  walkFurniture: 1.3,
  placeFurniture: 1.1,
  paintTime: 2.2,
  /** Hanging a window is fiddlier than dropping a brick on a bed of mortar. */
  fixTime: 2.0,
}

/** One turn of the sun. A plot takes roughly one of these to finish. */
export const DAY_SECONDS = 840

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
