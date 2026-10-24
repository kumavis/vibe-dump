// Below the surface: what the water looks like from inside it, what swims in
// it, and how much of either each graphics tier can afford. world/underwater.js
// and world/sealife.js read these; the seabed itself is shaped from
// data/world.js `seabed`.

export const UNDERWATER = {
  // FogExp2 density just under the surface, and `at` metres down
  fog: { near: 0.03, deep: 0.048, at: 30 },
  // the water's colour (fog and background) at the surface and `fog.at` m
  // down, in full daylight; night leaves `night` of it
  shallow: '#2f8088',
  deep: '#0a2f3b',
  night: 0.1,
  // sunlight left `d` m down: exp(-d / falloff), never under `floor` of it
  light: { falloff: 15, floor: 0.16 },
  // the surface seen from beneath: the window of sky (Snell's, 48.6° off
  // vertical) and the mirror of the water outside it
  surface: { size: 1400, ripple: 0.22, mirror: 1.25 },
  // light on the seabed: caustics, gone by `fade` m down; sand ripples
  caustics: { strength: 0.55, fade: 22, ripples: 0.08 },
  // shafts of sunlight hanging from the surface
  rays: { length: 30, width: [2.5, 6], range: [7, 32], strength: 0.14 },
  // drifting marine snow round the camera
  snow: { box: 34, size: 0.05 },
}

// Per graphics tier (core/quality.js): marine snow particles, light shafts,
// caustics on the bed, and how many of each animal are about.
export const SEA_TIERS = {
  low: { snow: 220, rays: 0, caustics: false, schools: 2, fish: 12, jellies: 4, ammonites: 2 },
  medium: { snow: 600, rays: 6, caustics: true, schools: 4, fish: 18, jellies: 9, ammonites: 4 },
  high: { snow: 1200, rays: 10, caustics: true, schools: 6, fish: 26, jellies: 14, ammonites: 6 },
}

// Ambient sea life (world/sealife.js). None of it is a species the survey
// counts: it is scenery that keeps out of the way. Distances are from the
// camera, depths from the surface; `range` is where things appear, and past
// `gone` they are taken away and appear again somewhere ahead.
export const SEA_LIFE = {
  school: {
    range: [18, 60],
    gone: 95,
    size: [0.22, 0.5], // body length, m
    speed: [1.1, 2.4],
    radius: [2.2, 4.5], // how loosely the school holds together
    scare: { radius: 9, speed: 2.6, time: 3 }, // the sub coming close, or a ping
    tones: ['#9fb4c0', '#c8b060', '#7f98b0', '#b0c8a8', '#d09060'],
  },
  jelly: { range: [8, 40], gone: 60, depth: [1.5, 14], size: [0.25, 0.5], drift: 0.25 },
  ammonite: { range: [10, 40], gone: 60, above: [1, 4], size: [0.35, 0.7], speed: 0.5 },
  // a marine reptile crossing in the murk: one pass every `every` seconds
  // while the camera is at least `minDepth` down, at the distance where the
  // fog leaves it a silhouette (about `murk` / fog density)
  leviathan: { every: [45, 100], first: 25, minDepth: 5, murk: 0.95, distance: [18, 42], speed: 4.2, length: 13 },
}
