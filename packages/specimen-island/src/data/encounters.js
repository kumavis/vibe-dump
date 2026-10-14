// Guaranteed early encounters, so a first expedition meets animals in its first
// minutes rather than its first hour. Each is a herd set down in a ring around
// a viewpoint, at the spot that scores best for being open ground in plain
// sight of it, and kept on a short leash (`radius`, the herd's home range in
// metres) so it is still there when you arrive.
//
//   view   'spawn'    the end of the pier, looking inland (`arc` radians either side)
//          'station'  the door of Ranger Station Alpha, any direction
//   ring   [min, max] distance from the viewpoint
//   eye    height on the animal that must be in sight (metres above ground)
//   cover  most undergrowth allowed at the spot (tall ferns hide a compy)
//   like   biome weights that make a spot score higher (see Island.habitat)

export const ENCOUNTERS = [
  // a harmless gang of compys scavenging the beach where the pier comes ashore;
  // on sand they stand out, and they cannot see you from the end of the pier
  { species: 'compsognathus', view: 'spawn', ring: [36, 52], arc: 0.6, count: [5, 7], radius: 9, eye: 0.3, cover: 0.4, like: { beach: 1.5 } },
  // parasaurolophus grazing in the open beside the first hut, just beyond the
  // 60 m they can see — close enough to scan from the door, far enough that
  // standing there does not send them running
  { species: 'parasaurolophus', view: 'station', ring: [70, 80], count: [3, 3], radius: 6, eye: 2.5, cover: 0.4, like: { grass: 0.5 } },
]
