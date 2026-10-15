// The expedition and the Full Survey after it, as data. Each objective belongs
// to a mission (the expedition unless it says otherwise) and stays locked until
// that mission has started; then it unlocks when everything in `after` is done,
// and completes when its `done` test passes against game state:
//
//   { reach: poiId, radius }        player within radius of a point of interest
//   { flag: name }                  a world flag was set (generator started...)
//   { item: id }                    the item is in the inventory
//   { stat: name, n }               a counter in game stats reached n
//   { allSpecies: set }             every species in SPECIES_ORDER is in that
//                                   stats set (speciesScanned, speciesBlood...);
//                                   `need` names what each missing one still owes
//     extinct: set                  ...or, for a species with none left alive,
//                                   in this set instead (`needExtinct` names it)
//   { any: [test, ...] }            any one of these tests passes
//
// `marker` points the compass and map: a POI id, or { interactable: id } (no
// marker while that interactable does not exist). A `final` objective
// completes its mission.

// Missions run one after another: a mission's debrief offers its `next`, and
// `bonus` is paid into the ledger when the mission completes. What was earned
// in an earlier mission counts towards a later one's tests.
export const MISSIONS = {
  expedition: { title: 'Expedition', debrief: 'Expedition debrief', next: 'survey' },
  survey: {
    title: 'Full Survey',
    debrief: 'Survey complete',
    brief: 'The Foundation will fund a second season for a complete record: every species scanned, and blood from every one of them. What you collected on the expedition counts.',
    bonus: 1500,
  },
}
for (const id in MISSIONS) MISSIONS[id].id = id

export const OBJECTIVES = [
  {
    id: 'landfall',
    title: 'Landfall',
    text: 'Follow the dirt road inland to Ranger Station Alpha.',
    marker: 'station',
    done: { reach: 'station', radius: 16 },
  },
  {
    id: 'gearup',
    after: ['landfall'],
    title: 'Gear Up',
    text: 'Open the equipment locker inside the station.',
    marker: { interactable: 'stationLocker' },
    done: { flag: 'stationLocker' },
  },
  {
    id: 'firstcontact',
    after: ['landfall'],
    title: 'First Contact',
    text: 'Catalogue 3 species with the Field Scanner [1].',
    done: { stat: 'speciesScanned', n: 3 },
  },
  {
    id: 'bloodwork',
    after: ['gearup'],
    title: 'Blood Work',
    text: 'Sedate dinosaurs and draw blood from 2 different species.',
    done: { stat: 'speciesBlood', n: 2 },
  },
  {
    id: 'fieldlab',
    after: ['bloodwork'],
    title: 'The Field Lab',
    text: 'Reach the Foundation Field Lab in the western jungle.',
    marker: 'fieldlab',
    done: { reach: 'fieldlab', radius: 34 },
  },
  {
    id: 'fuel',
    after: ['fieldlab'],
    title: 'Running on Fumes',
    text: 'Search the hangar for a fuel can.',
    marker: { interactable: 'hangarCrate' },
    done: { item: 'fuelcan' },
  },
  {
    id: 'power',
    after: ['fuel'],
    title: 'Power Up',
    text: 'Fuel and start the Field Lab generator.',
    marker: { interactable: 'labGenerator' },
    done: { flag: 'labPower' },
  },
  {
    id: 'heli',
    after: ['power'],
    title: 'Rotor Wash',
    text: 'Run the pump to refuel the helicopter, then take off.',
    marker: { interactable: 'fuelPump' },
    done: { flag: 'heliFlown' },
  },
  {
    id: 'relay',
    after: ['heli'],
    title: 'Summit Relay',
    text: 'Fly to the summit and repair the radio relay.',
    marker: { interactable: 'relay' },
    done: { flag: 'relayFixed' },
  },
  {
    id: 'apex',
    after: ['relay'],
    title: 'Apex',
    text: 'The relay picked up the tyrant’s old tracking collar. Draw its blood.',
    done: { stat: 'blood:tyrannosaurus', n: 1 },
  },
  {
    id: 'extract',
    after: ['apex'],
    title: 'Extraction',
    text: 'Return to the Supply Dock for pickup.',
    marker: 'dock',
    done: { reach: 'dock', radius: 14 },
    final: true,
  },

  // the Full Survey: offered by the expedition's debrief
  {
    id: 'catalogue',
    mission: 'survey',
    title: 'Complete Catalogue',
    text: 'Scan every species. The journal [J] has old sighting notes on the ones still missing.',
    done: { allSpecies: 'speciesScanned' },
    need: 'scan',
  },
  {
    id: 'bloodbank',
    mission: 'survey',
    title: 'Blood Bank',
    text: 'Sedate and draw blood from every species.',
    // nothing restocks the island: once a species is wiped out, blood is gone
    // for good and a carcass's tissue has to stand in
    done: { allSpecies: 'speciesBlood', extinct: 'speciesTissue' },
    need: 'blood sample',
    needExtinct: 'tissue sample',
  },
  {
    id: 'biggame',
    mission: 'survey',
    title: 'Big Game',
    text: 'Brachiosaurs shrug off rifle darts. The keeper’s jumbo syringe should still be at Paddock C.',
    marker: { interactable: 'jumboRack' },
    // a brachiosaur already sampled without it makes the errand moot
    done: { any: [{ flag: 'jumboSyringe' }, { stat: 'blood:brachiosaurus', n: 1 }] },
  },
  {
    id: 'coldchain',
    mission: 'survey',
    after: ['catalogue', 'bloodbank'],
    title: 'Cold Chain',
    text: 'Get the full sample set into the Field Lab’s cold store.',
    marker: 'fieldlab',
    done: { reach: 'fieldlab', radius: 34 },
    final: true,
  },

  // side objectives: run alongside the expedition, listed after it on the HUD
  {
    id: 'photosafari',
    after: ['landfall'],
    title: 'Photo Safari',
    text: 'Photograph 4 different species with the Field Camera [6].',
    done: { stat: 'speciesPhotographed', n: 4 },
  },
]
