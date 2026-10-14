// The expedition, as data. Each objective unlocks when everything in `after`
// is done, and completes when its `done` test passes against game state:
//
//   { reach: poiId, radius }        player within radius of a point of interest
//   { flag: name }                  a world flag was set (generator started...)
//   { item: id }                    the item is in the inventory
//   { stat: name, n }               a counter in game stats reached n
//
// `marker` points the compass and map: a POI id, or { interactable: id }.

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

  // side objectives: run alongside the expedition, listed after it on the HUD
  {
    id: 'photosafari',
    after: ['landfall'],
    title: 'Photo Safari',
    text: 'Photograph 4 different species with the Field Camera [6].',
    done: { stat: 'speciesPhotographed', n: 4 },
  },
]
