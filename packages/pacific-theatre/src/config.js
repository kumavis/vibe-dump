// Scale, the zoom range, and the one curve that matters most for the look:
// vertical exaggeration against camera distance.
//
// One world unit is 100 m on the ground, as in the ahupuaʻa app, and x runs
// east, z south, y up. The whole chain from Niʻihau to Kaʻū is about 6,000
// units across. Heights stay in metres everywhere (data, CPU and GPU alike) and
// only turn into world Y at the last moment, through the exaggeration of the
// moment: 1.3 in a valley, as in ahupuaʻa, rising smoothly as the camera pulls
// back, because over 600 km a 4,200 m summit is a bump of under one percent and
// the far view wants the mountains to read.

export const UNIT = 100 // metres per world unit, horizontally
export const METRE = 1 / UNIT

// camera distance (world units from its target) at the two ends of the zoom
export const MIN_DISTANCE = 8 // 800 m: about as close as 70–150 m packs bear (and the district's 6 m is seen from)
export const MAX_DISTANCE = 9000

export const NEAR_EXAG = 1.3
export const FAR_EXAG = 5.5
// The exaggeration eases from NEAR to FAR between these distances, on a log
// scale. Tuned by looking: 1.3 to about 10 km out; about 2.7 at 50 km, where
// Mauna Kea should still read as a shield and not a cone; 4 over Maui Nui at
// 120 km; 5.5 with the whole chain in view.
const EXAG_NEAR_D = 100
const EXAG_FAR_D = 6000

/** Vertical exaggeration for a camera this far from its target. */
export function exaggeration(distance) {
  const t = Math.log(Math.max(1, distance) / EXAG_NEAR_D) / Math.log(EXAG_FAR_D / EXAG_NEAR_D)
  const s = Math.max(0, Math.min(1, t))
  return NEAR_EXAG + (FAR_EXAG - NEAR_EXAG) * s * s * (3 - 2 * s)
}

// The normal maps are baked at this exaggeration and re-scaled to the current
// one in the shader (see decode.js packNormals), so one texture serves the
// whole zoom.
export const NORMAL_EXAG = 2

// Island packs that can be drawn at full detail at once. Each takes a slot;
// a pack leaves its slot only after it has faded back to the archipelago.
export const SLOTS = 5

// Patches (DATA.md "Patches, on any pack"; render/patches.js): how many the
// island packs in the slots can carry between them, and how many a district
// can (its raise patches, and the groups its lower patches fall into)
export const PATCHES = 32
export const DIST_PATCHES = 16
// a patch's weight eases at this rate (1/s) as the year crosses its until:
// most of the way in a couple of seconds
export const PATCH_EASE = 1.6

// The district close-up (DATA.md "District packs"), a third level under the
// island: one district resident at a time, streamed as the camera comes down
// near it and given up once it has gone. Distances are world units.
export const DISTRICT = {
  // its detail weight eases in as the camera closes from `far` to `near`
  // (camera to the district's rect, as an island's is to its own); and only
  // while the camera's own distance is under `rig`, where the far view's
  // overlays have gone, so the hand-over shows nothing of them
  far: 115,
  near: 75,
  rig: [95, 135],
  // the outer band over which its heights and maps ease back into the
  // island's, and inside that a strip where both are drawn, the district at
  // nothing, so the two meshes overlap there rather than meet in a crack
  margin: 7,
  band: 0.5,
  // start streaming once the camera is this near the rect, or a tour flight is headed into it
  prefetch: 320,
  // and drop it from memory this long after it has faded out and the camera
  // is away, or after a tour has asked for it ahead of the camera, this
  // much longer
  linger: 25,
  hold: 90,
}

// Things built and grown in the district are drawn larger than life, as the
// ahupuaʻa app draws them 1.6×: a valley is seen from one to six kilometres
// off, and a hale at life size would be a pixel.
export const FEATURE_S = 0.024

// Where the data lives: ./data/ by default, or ?data=<base url> (the dev tools
// point it at ../test-data/, the synthetic set from tools/fake-data.mjs).
export function dataBase() {
  const q = new URLSearchParams(location.search).get('data')
  const base = q || './data/'
  return base.endsWith('/') ? base : `${base}/`
}
