// The front's states (DATA.md §6) as the table colours them: sRGB colour,
// strength (how much of it lies on the relief), Japan's side (whose edge is
// drawn as the front's line), hatched, and the legend's words. Its own
// module, importing nothing, so tools/check/table.mjs can hold the data's
// states against it in Node.
//
// No colour here is a flag's: Japan's side is a brick red in the Green
// Books' manner, the Allies a slate blue, the surrender zones of General
// Order No. 1 each a quiet colour of its own.

export const STATES = {
  held: { colour: [170, 58, 46], strength: 0.62, jp: 1, label: 'held by Japan' },
  garrisoned: { colour: [190, 104, 70], strength: 0.42, jp: 1, label: 'garrisoned by Japan by treaty' },
  'allied-with-japan': { colour: [200, 146, 72], strength: 0.4, jp: 1, label: 'allied with Japan' },
  contested: { colour: [196, 120, 88], strength: 0.2, jp: 0, hatch: 1, label: 'contested' },
  allied: { colour: [84, 124, 178], strength: 0.5, jp: 0, label: 'held by the Allies' },
  neutral: { colour: [150, 150, 146], strength: 0.3, jp: 0, label: 'neutral' },
  soviet: { colour: [150, 84, 118], strength: 0.42, jp: 0, label: 'the Soviet Union' },
  'zone-cks': { colour: [176, 150, 84], strength: 0.4, jp: 0, label: 'surrender to Chiang Kai-shek' },
  'zone-soviet': { colour: [150, 84, 118], strength: 0.42, jp: 0, label: 'surrender to the Soviet forces' },
  'zone-seac': { colour: [104, 146, 108], strength: 0.4, jp: 0, label: 'surrender to South East Asia Command' },
  'zone-cincpac': { colour: [104, 150, 190], strength: 0.4, jp: 0, label: 'surrender to the US Pacific Fleet' },
  'zone-swpa': { colour: [86, 110, 160], strength: 0.4, jp: 0, label: 'surrender to the South West Pacific Area' },
}

export const OTHER = { colour: [150, 150, 150], strength: 0.25, jp: 0, label: 'other' }

// the label kinds labels.js styles (DATA.md §3)
export const LABEL_KINDS = ['sea', 'group', 'island', 'strait', 'base', 'city', 'region', 'line']
