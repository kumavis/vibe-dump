// The names the cards print for the data's codes (DATA.md §4, R3 §2.1): the
// sides and peoples an event's `sides` names, the kinds of event, the place
// precisions and the sources' licences and access. A code without a name
// here prints as itself, so a new code shows up on a card rather than
// vanishing.

export const SIDES = {
  jp: 'Japan',
  us: 'United States',
  uk: 'British Commonwealth',
  in: 'India',
  au: 'Australia',
  nz: 'New Zealand',
  ca: 'Canada',
  nl: 'Netherlands',
  cn: 'China',
  ph: 'Philippines',
  th: 'Thailand',
  fr: 'French Indochina',
  su: 'Soviet Union',
  mn: 'Mongolia',
  ina: 'Indian National Army',
  mk: 'Manchukuo',
  // the peoples
  chamorro: 'Chamorro',
  refaluwasch: 'Carolinian',
  nauruan: 'Nauruan',
  banaban: 'Banaban',
  'i-kiribati': 'I-Kiribati',
  marshallese: 'Marshallese',
  chuukese: 'Chuukese',
  palauan: 'Palauan',
  'solomon-islanders': 'Solomon Islanders',
  papuan: 'Papuan',
  bougainvillean: 'Bougainvillean',
  okinawan: 'Okinawan',
  unangax: 'Unangax̂',
  korean: 'Korean',
  'chinese-civ': 'Chinese civilians',
  'filipino-civ': 'Filipino civilians',
  'japanese-civ': 'Japanese civilians',
  'japanese-am': 'Japanese Americans',
  'japanese-ca': 'Japanese Canadians',
  romusha: 'rōmusha',
}

export const KINDS = {
  battle: 'battle',
  campaign: 'campaign',
  landing: 'landing',
  raid: 'raid',
  siege: 'siege',
  sinking: 'sinking',
  occupation: 'occupation',
  surrender: 'surrender',
  political: 'politics',
  bombing: 'bombing',
  atrocity: 'atrocity',
  captivity: 'captivity',
  people: 'the peoples',
  other: 'event',
}

export const LICENCES = {
  'pd-us-gov': 'public domain (US government)',
  pdm: 'public domain',
  'cc-by': 'CC BY',
  'cc-by-4.0': 'CC BY 4.0',
  'cc-by-nc': 'CC BY-NC',
  'cc-by-sa': 'CC BY-SA',
  odbl: 'ODbL',
  'nids-permission': 'NIDS, cited by reference',
  'copyright-cite-only': 'in copyright, cited',
  unknown: '',
}

export const ACCESS = { open: '', lending: 'lending library', print: 'in print', paywalled: 'paywalled' }

export const sideName = (code) => SIDES[code] || code
export const kindName = (code) => KINDS[code] || code || 'event'
