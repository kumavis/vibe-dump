// Guaranteed early encounters, so a first expedition meets animals in its first
// minutes rather than its first hour. Each is a herd set down in a ring around
// a viewpoint, at the spot that scores best for being open ground in plain
// sight of it, and kept on a short leash (`radius`, the herd's home range in
// metres) so it is still there when you arrive.
//
//   at     the viewpoint the ring is measured from (see below), searched `arc`
//          radians either side of the way it faces, preferring `aim` off it
//   also   more viewpoints that must see the spot too, inside the middle of
//          their screen (not clipped at the edge, not behind a roadside sign)
//   ring   [min, max] distance from `at`
//   eye    height on the animal that must be in sight (metres above ground)
//   cover  most undergrowth allowed at the spot (tall ferns hide a compy, not
//          a parasaurolophus)
//   offRoad  keep at least this far from any road, so walking up it does not
//          crowd the herd
//   like   biome weights that make a spot score higher (see Island.habitat)
//   bold   a habituated herd: it watches a person until they come within
//          `tolerate` metres (half that crouched), then trots off for
//          `scatter` seconds rather than bolting out of sight, and darts if
//          they keep coming. A gunshot still sends it running.
//
// Viewpoints: 'spawn' the end of the pier, looking inland; 'pierFoot' where the
// pier comes ashore, looking inland; 'door' the doorway of Ranger Station
// Alpha, looking out; 'approach' the dock road 120 m short of the station,
// where it comes over the rise from the dock yard, looking up it.

export const ENCOUNTERS = [
  // A gang of compys picking over the dock yard where the pier comes ashore,
  // off to one side of the path. The bank there is ferns and the terrace lip
  // hides anything further back from the pier foot, so the open strip along
  // the lip is the one place in sight all the way down the pier and from its
  // foot. Used to boat crews, they let you get close before scattering.
  { species: 'compsognathus', at: 'pierFoot', also: ['spawn'], ring: [8, 18], arc: 1.6, aim: 1.1, count: [7, 9], radius: 4, eye: 0.3, cover: 0.4, bold: { tolerate: 10, scatter: 3 } },
  // Parasaurolophus grazing in front of the first hut, off to the side of the
  // road up: ahead of you from the top of the dock yard, framed in the doorway
  // (the jungle there is ferns, which hide a compy but not a 4 m hadrosaur),
  // and calm enough to watch you walk past rather than stampede.
  { species: 'parasaurolophus', at: 'door', also: ['approach'], ring: [40, 72], arc: 0.6, count: [3, 3], radius: 4, eye: 2.5, cover: 1, offRoad: 18, like: { grass: 0.5 }, bold: { tolerate: 10, scatter: 4 } },
]
