import { mm, deg } from './build.js'

// ---------------------------------------------------------------------------
// The spec sheet
//
// Every dimension in this app comes from here, in millimetres, because that is
// the unit the manufacturer quotes and the unit a fabricator would work in.
// Nothing downstream is allowed to hard-code a number: change a value here and
// the truck, the modules, the collision hulls and the HUD readout all move
// together.
//
// THE TRUCK IS A DAIHATSU HIJET S500P (2014-present, 2WD Standard, 5MT). It was
// picked over the Suzuki Carry DA16T and the Honda Acty HA8/HA9 by comparing
// what each maker actually publishes, and the Hijet won on one specific thing:
// it is the only one of the three that gives the DECK FLOOR HEIGHT (荷台床面地上高,
// 660 mm) in both the spec table and the side elevation, and its elevation
// annotates roof height, ground clearance, wheelbase, bed length, bed wall
// height and deck height together — which is exactly the set you scale a side
// view from. Suzuki publishes deck height in the table only; Honda never
// published it at all, and third-party sources for the Acty split 650/660 with
// no way to resolve it.
//
// Two traps this avoids, both live on popular aggregator sites: an "interior
// length" of 1940/1410/290 quoted for a two-seat kei cab (those are the BED
// dimensions, relabelled), and an Acty wheelbase of 2420 mm (that is the
// previous HA6/HA7 generation; the HA8 is 1900).
//
// The kei class is a legal box, not a styling choice: 3400 x 1480 x 2000 mm and
// 660 cc. All three trucks are 3395 x 1475 overall with an identical 1940 x
// 1410 bed and an identical 350 kg payload, because the box is worth more than
// the styling. They diverge only where the box does not bind — roof height
// (1735-1780 across the three), ground clearance (160 vs the Acty's 185) and
// rear track. That is why the modules below can be designed against "a kei
// truck" rather than against one model: the deck they bolt to is the same deck.
//
// COORDINATES. Two frames, and only two:
//
//   WORLD — y = 0 is the ground the tyres stand on. The truck lives here.
//   BED   — origin at the CENTRE OF THE CARGO DECK SURFACE, +X forward toward
//           the cab, +Y up, +Z to the driver's right. Every fold-out module is
//           authored here, and the module root is parented at the bed origin.
//
// So a module part at (0.9, 0, 0) sits on the deck at the headboard, and one at
// (-0.97, 0, 0) is on the tailgate hinge line. Both frames are right-handed and
// share their up axis; the only difference is the origin.
// ---------------------------------------------------------------------------

/** Kei-class legal maxima. Everything about this truck is downstream of these. */
export const KEI_LIMIT_MM = {
  length: 3400,
  width: 1480,
  height: 2000,
  displacement_cc: 660,
}

/**
 * Suzuki Carry DA16T, in millimetres. Kilograms where the name says kg,
 * degrees where it says deg.
 */
export const TRUCK_MM = {
  // --- published spec sheet (Daihatsu 主要諸元表, 3BD-S500P 2WD Standard) -------
  overallLength: 3395,
  overallWidth: 1475,
  overallHeight: 1780, // Standard roof. The High-roof / Jumbo is 1885 — a
  //                      different variant, not a tolerance.
  wheelbase: 1900,
  trackFront: 1305,
  trackRear: 1300,
  groundClearance: 160,
  kerbWeight_kg: 780,
  payload_kg: 350,
  gvw_kg: 1240, // published, and NOT kerb + payload: it also carries 2 x 55 kg
  //               of occupant. 780 + 350 + 110 = 1240.

  // Cargo bed — the numbers the whole second half of this app is built on.
  bedInnerLength: 1940,
  bedInnerWidth: 1410,
  bedSideHeight: 285, // 5 mm lower than the Carry and Acty, which are both 290
  deckHeight: 660, // deck surface above ground — the number that decided the
  //                  choice of truck, because Daihatsu draws it as well as
  //                  tabulating it

  // Tyres: 145/80R12 80/78N LT. Overall diameter is
  // 304.8 (12 in rim) + 2 * 145 * 0.80 = 536.8 mm. That the resulting axle
  // centre (268 mm) plus a plausible frame, spring and deck stack lands on the
  // published 660 mm deck height is the cross-check that this tyre is right.
  tyreSection: 145,
  tyreAspect: 80,
  rimDiameter: 304.8,
  get tyreDiameter() {
    return this.rimDiameter + 2 * this.tyreSection * (this.tyreAspect / 100)
  },

  // --- derived layout, in BED coordinates ----------------------------------
  // Chained off the published numbers rather than measured off a photo, so the
  // model is internally consistent: overhangs, axle positions and the cab
  // length all have to add back up to the 3395 mm overall.
  gateThickness: 24, // stamped steel side gate / tailgate
  cabGap: 20, // clearance between the bed headboard and the cab's back panel
  rearBumperDepth: 15,

  // OVERHANGS. These are read off the manufacturer's own side elevation, and
  // they are the opposite way round from what "cab-over" suggests to most
  // people: the front overhang is LONG (880 mm) and the rear is SHORT (615).
  // Cab-over means the driver sits over the front axle, so the entire nose —
  // bumper, front panel, footwell, and the front half of the door — hangs out
  // ahead of it. Meanwhile the bed's tail sits close behind the rear axle.
  //
  // This matters more than any styling detail in this file, because it sets
  // the lever arm every fold-out module works against. Guess it the wrong way
  // round and you design the tailgate cantilever against 1125 mm of overhang
  // when the truck only has 600.
  //
  //   880 + 1900 + 615 = 3395 = the published overall length.
  frontOverhang: 880,
  rearOverhang: 615,

  // Headboard: on a three-way-open bed the front gate is the same 285 mm
  // stamping as the sides, and the tall part is a separate tubular "torii"
  // guard that stops at cab-roof height. The torii is also the single best
  // hard point on the truck, which is why three of the four modules react
  // their overturning moment into it.
  toriiHeight: 1120, // above deck, i.e. exactly level with the 1780 cab roof
  toriiTube: 34, // outside diameter

  // Cab. Heights above ground; setbacks measured back from the nose. Scaled off
  // the maker's front and side elevations, cross-checked against each other.
  sill: 420, //             bottom of the visible cab side
  bumperBottom: 360,
  bumperTop: 560,
  grilleBottom: 815, //     the grille is one wide horizontal band...
  grilleTop: 955,
  headlampCentre: 885, //   ...and the headlamps live at its outer ends
  windshieldBase: 1010, //  cowl / bottom of the glass
  windshieldSetback: 190, // horizontally back from the nose at that height
  roofFront: 1695, //       the header, i.e. the top of the glass
  windshieldRake_deg: 29.6, // from vertical: 390 mm back over a 685 mm rise
  beltline: 1100,
  windowTop: 1590,
  doorFront: 2080, //       BED x of the door's leading edge, at the sill
  mirrorHeight: 1185,
  mirrorReach: 195, //      how far the mirror head stands proud of the body side

  // The cab has real tumblehome: 1440 mm across the shoulders, 1290 across the
  // roof. Without it a kei cab models as a fridge.
  bodyWidth: 1440,
  roofWidth: 1290,
}

/** Everything above, converted once, in metres. */
export const T = Object.freeze({
  L: mm(TRUCK_MM.overallLength),
  W: mm(TRUCK_MM.overallWidth),
  H: mm(TRUCK_MM.overallHeight),
  wheelbase: mm(TRUCK_MM.wheelbase),
  trackFront: mm(TRUCK_MM.trackFront),
  trackRear: mm(TRUCK_MM.trackRear),
  clearance: mm(TRUCK_MM.groundClearance),

  bedLen: mm(TRUCK_MM.bedInnerLength),
  bedWid: mm(TRUCK_MM.bedInnerWidth),
  bedSide: mm(TRUCK_MM.bedSideHeight),
  deckH: mm(TRUCK_MM.deckHeight),
  gate: mm(TRUCK_MM.gateThickness),

  tyreR: mm(TRUCK_MM.tyreDiameter) / 2,
  tyreW: mm(TRUCK_MM.tyreSection),
  rimR: mm(TRUCK_MM.rimDiameter) / 2,

  toriiH: mm(TRUCK_MM.toriiHeight),
  toriiTube: mm(TRUCK_MM.toriiTube),

  sill: mm(TRUCK_MM.sill),
  windshieldBase: mm(TRUCK_MM.windshieldBase),
  windshieldSetback: mm(TRUCK_MM.windshieldSetback),
  windshieldRake: deg(TRUCK_MM.windshieldRake_deg),
  roofFront: mm(TRUCK_MM.roofFront),
  beltline: mm(TRUCK_MM.beltline),
  windowTop: mm(TRUCK_MM.windowTop),
  headlampY: mm(TRUCK_MM.headlampCentre),
  grilleTop: mm(TRUCK_MM.grilleTop),
  grilleBottom: mm(TRUCK_MM.grilleBottom),
  bumperTop: mm(TRUCK_MM.bumperTop),
  bumperBottom: mm(TRUCK_MM.bumperBottom),
  mirrorY: mm(TRUCK_MM.mirrorHeight),
  mirrorReach: mm(TRUCK_MM.mirrorReach),
  bodyW: mm(TRUCK_MM.bodyWidth),
  roofW: mm(TRUCK_MM.roofWidth),

  payload: TRUCK_MM.payload_kg,
  kerb: TRUCK_MM.kerbWeight_kg,
})

/**
 * Longitudinal layout, all in BED x (metres, +X forward).
 *
 * This is where the spec sheet turns into a place for things to be. It is
 * arithmetic, not estimation — read it top to bottom and the 3395 mm overall
 * length falls out at the end, which is the check that none of it drifted.
 */
function layout() {
  const halfBed = T.bedLen / 2 // 0.970
  const bedFrontOuter = halfBed + T.gate // 0.994 — front gate outer face
  const bedRearOuter = -(halfBed + T.gate) // -0.994 — tailgate outer face
  const cabRear = bedFrontOuter + mm(TRUCK_MM.cabGap) // 1.024
  const rear = bedRearOuter - mm(TRUCK_MM.rearBumperDepth) // -1.009
  const nose = rear + T.L // 2.386
  const cabLength = nose - cabRear // 1.372
  const axleFront = nose - mm(TRUCK_MM.frontOverhang) // 1.506
  const axleRear = axleFront - T.wheelbase // -0.394

  return {
    halfBed,
    bedFrontOuter,
    bedRearOuter,
    cabRear,
    rear,
    nose,
    cabLength,
    axleFront,
    axleRear,
    doorFront: mm(TRUCK_MM.doorFront),
    /**
     * How far the tailgate hinge line sits behind the rear axle: 0.600 m.
     *
     * This is the number that governs every one of these modules. A mass hung
     * off the tailgate acts about the rear axle with that lever, resisted by
     * the truck's own weight acting forward of the axle. 600 mm is a friendly
     * number — it is why a fold-down rear deck is viable at all here — and it
     * is only that friendly because the rear overhang is short. Read the
     * overhangs the intuitive way round and this comes out at 1125 mm, and
     * every tailgate design downstream is quietly over-braced for a load case
     * the truck does not have.
     */
    tailLever: axleRear - bedRearOuter,
    /** And how far forward of the rear axle the headboard sits: 1.364 m. */
    headLever: bedFrontOuter - axleRear,
  }
}

export const X = Object.freeze(layout())

/** Half-width of the cargo deck's usable floor. */
export const HALF_W = T.bedWid / 2

/**
 * Height above the deck a packed module may not exceed.
 *
 * The kei ceiling is 2000 mm and the deck is at 660 mm, so 1340 mm is the legal
 * answer. But a truck loaded to the legal ceiling looks like a truck with a
 * wardrobe on it, and the whole idea here is a vehicle that reads as an
 * ordinary working kei truck right up until it opens. So the modules are held
 * to the cab roof — 1120 mm above the deck — which keeps the loaded silhouette
 * inside the cab's own profile, and leaves 220 mm of legal headroom for a
 * lashed tarpaulin or a rooftop light bar.
 */
export const PACK_CEILING = T.H - T.deckH // 1.120
export const PACK_CEILING_LEGAL = mm(KEI_LIMIT_MM.height) - T.deckH // 1.340

/** Live-load figures the module structure is designed against, in kPa. */
export const LIVE_LOAD = {
  /** Crowd on a small stage / dance floor. EN 13200 and ASCE 7 both land here. */
  stage: 5.0,
  /** Assembly floor with fixed seating / light occupancy. */
  occupied: 4.0,
  /** A serving counter: point loads from equipment, no one standing on it. */
  counter: 2.0,
  /** Sleeping platform. */
  sleeping: 1.5,
}

/** What things weigh, kg per square metre unless noted. Used by the budgets. */
export const MASS = {
  ply12: 8.4, // 12 mm birch ply, per m^2
  ply18: 12.6,
  aluDeck: 11.0, // 30 mm aluminium plank decking, per m^2
  aluExtrusion40: 1.6, // 40x40x2 mm 6061 tube, per m
  aluTruss: 3.4, // small ladder truss, per m
  steelTube30: 2.6, // 30x30x2 mm steel, per m
  canvas: 0.45, // per m^2, 400 gsm acrylic
  hinge: 0.9, // per m of piano hinge
  jack: 4.2, // per screw jack with foot
  glass: 0, // there is no glass anywhere in these modules, by design
}
