// Scale, the zoom range, budgets and the one curve that matters most for the
// look of the table: vertical exaggeration against camera distance.
//
// Adapted from holo-i-ke-au's config.js (b480c27). There one world unit was
// 100 m everywhere; here two scenes share one page and each has its own unit
// (ENGINEERING.md §2), so every distance a module needs comes from the scene's
// own object below, never from a module constant:
//
//   TABLE  world units are kilometres (unit 1000), x east, z south, y up, over
//          the azimuthal projection of the whole theatre (geo.js).
//   BOX    world units are metres (unit 1), origin at the box's centre, the
//          Hawaiian tangent plane (geo.js TangentProjection).
//
// Heights stay in metres everywhere (data, CPU and GPU alike) and turn into
// world Y only at the last moment, through ground.vert = exaggeration / unit.

const smoothstep = (t) => {
  const s = Math.max(0, Math.min(1, t))
  return s * s * (3 - 2 * s)
}

/** A smoothstep on log distance from `near` at dNear to `far` at dFar (the Hawaiian curve's shape). */
function logEase(distance, near, far, dNear, dFar) {
  const t = Math.log(Math.max(1e-9, distance) / dNear) / Math.log(dFar / dNear)
  return near + (far - near) * smoothstep(t)
}

export const TABLE = {
  unit: 1000, // metres per world unit (km)
  // camera distance from its target, km: a single island group at the near
  // limit (where a box's pin invites you down), the whole theatre at the far
  minDistance: 60,
  maxDistance: 20000,
  // the rig's tilt eases from oblique to steep between these distances (km):
  // the Hawaiian 40 to 4,500 units happens to suit the table in kilometres (R9 §2.1)
  pitchRange: [40, 4500],
  // near and far planes under the logarithmic depth buffer (ENGINEERING §2):
  // near follows the camera's height above the ground within [near, nearMax]
  near: 0.1,
  nearMax: 30,
  far: 50000,
  // the target may wander this far past the pack's edge, km
  targetMargin: 500,
  // the eye's clearance above the ground: base + k × distance, km; the soft
  // floor's gap; how far ahead of a moving camera the ground is looked for
  clearance: [0.05, 0.03],
  floorGap: 0.01,
  aheadMax: 50,
  // picking: the ray march's reach and its smallest step, km; a flight's
  // mid-air hop is scaled by this many km
  marchLimit: 1e5,
  marchStep: 0.05,
  hopScale: 300,
  // The exaggeration eases from the box's value at the hand-over distance (a
  // box's diagonal × 0.8: 300 to 500 km for the v1 boxes) to about 30 with
  // the whole theatre in view, so the Marianas Trench and Fuji both read from
  // 14,000 km and the ridges do not jump at the cut into a box. Tuned by eye
  // later (the table workflow); the shape is the Hawaiian smoothstep on log
  // distance.
  exag: { near: 1.0, far: 30, dNear: 400, dFar: 12000 },
  /** Vertical exaggeration for a table camera this far from its target (km); `near` is the box's value. */
  exaggeration(distance, near = TABLE.exag.near) {
    const e = TABLE.exag
    return logEase(distance, near, e.far, e.dNear, e.dFar)
  },
  // The table's normals are baked at this exaggeration and rebuilt at the
  // current one in the shader (decode.js packNormals): baked near the display
  // exaggeration so 8-bit normals do not terrace the abyssal plain (R9 §2.3:
  // at 2 they step by 12 % slope once rebuilt at 30; at 18, by about 1 %).
  normalExag: 18,
  // ambient occlusion is worked out at this exaggeration (harmless at 7 km texels)
  aoExag: 18,
  // beyond the pack's edge (never seen on the table): open ocean
  outside: -4000,
  // the hand-over pose: the box's centre at this × the box's diagonal (km)
  handoverK: 0.8,
  // draw calls: under this always (DESIGN §5.10)
  drawBudget: 200,
}

export const BOX = {
  unit: 1, // metres per world unit
  minDistance: 15,
  maxDistance: 600000, // the hand-over height of the largest box
  pitchRange: [100, 40000],
  near: 0.5,
  nearMax: 300,
  far: 450000,
  targetMargin: 5000,
  clearance: [3, 0.03],
  floorGap: 4,
  aheadMax: 2000,
  marchLimit: 1e6,
  marchStep: 0.5,
  hopScale: 30000,
  // One constant per box (boxes/manifest.json `exaggeration`), used by the
  // renderer and the sim alike, never varied with the camera: the terrain an
  // aircraft collides with must be the terrain on screen (ENGINEERING §2).
  exaggeration: 1.0,
  // a box's normals at the Hawaiian 2, its ambient occlusion at the valley's 1.3
  normalExag: 2,
  aoExag: 1.3,
  // the exaggeration the box terrain's vegetation reads slope at (the Hawaiian NEAR_EXAG)
  slopeExag: 1.3,
  // beyond a box's pack the ground is a flat deep sea (ENGINEERING §7)
  outside: -4000,
  drawBudget: 500,
}

// The slider and the window of pins and routes (time.js WarClock): the
// ten-year prologue gets a tenth of the slider, the war's days the rest; the
// window is an eighth of the chapter's length either side, clamped to a week
// and three weeks (DESIGN §5.5).
export const CLOCK = { prologueShare: 0.1, windowMinDays: 7, windowMaxDays: 21 }

// The sim's step and the most steps one advance may run (ENGINEERING §2).
export const SIM = { step: 1 / 60, maxSteps: 8 }

// The quality governor's levels (app.js): the CDLOD detail knob and the pixel ratio cap.
export const QUALITY = [
  { range: 3, dpr: 1 },
  { range: 3.8, dpr: 1.25 },
  { range: 4.6, dpr: 1.5 },
  { range: 5.5, dpr: 2 },
]

// Where the data lives: ./data/ by default, or ?data=<base url> (the dev tools
// point it at ../test-data/, the synthetic set from tools/fake-data.mjs).
export function dataBase() {
  const q = new URLSearchParams(location.search).get('data')
  const base = q || './data/'
  return base.endsWith('/') ? base : `${base}/`
}

// The query string carries tool switches, the hash the view (ENGINEERING §9).
export const QUERY = ['data', 'q', 'fixedq', 'debug']
export const HASH = ['date', 'cam', 'battle', 't', 'moment', 'unit', 'station']
