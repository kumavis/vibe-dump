// Shared scale and resolution constants for the generator and the renderer.
//
// One world unit is 100 m on the ground. Heights are generated and stored in
// metres and only turned into world units at the last moment, through
// VERTICAL — a mild exaggeration, because a 1,700 m summit on an island 25 km
// long reads as a gentle dome at true scale, and the drama of the windward pali
// is the point of the place. Clouds use the same factor, so the cloud base still
// sits at the right height against the mountain.

export const WORLD = 360 // world units across the generated square (36 km)
export const HALF = WORLD / 2
export const METRE = 0.01 // world units per metre, horizontally
export const VERTICAL = 1.3 // vertical exaggeration
export const Y_PER_M = METRE * VERTICAL // world Y per metre of elevation

export const HEIGHT_RES = 2048 // final heightmap, ~17.6 m per texel
export const HYDRO_RES = 1024 // streams, watersheds, masks
export const ERODE_RES = 512 // landscape evolution grid
export const CLIMATE_RES = 256 // rainfall model

export const SEED = 20261004

// Trade winds blow from the east-northeast most of the year. Bearings are
// compass degrees the wind comes FROM; +x is east and +z is south.
export const TRADE_BEARING = 62

/** Unit vector of the direction the wind blows TOWARD, for a FROM bearing. */
export function windVector(bearingFrom) {
  const b = ((bearingFrom + 180) * Math.PI) / 180
  return [Math.sin(b), -Math.cos(b)]
}
