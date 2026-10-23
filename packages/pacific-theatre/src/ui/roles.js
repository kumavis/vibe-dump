// The words for units, stations and the record's events (ROUND-2.md §1.1,
// §5; DESIGN.md §7.3; R8 §3.6, §5.1): what the unit list, the unit card, the
// box's bar and the after-card print for a kit, a station, a role and one of
// the record's events, in the voice of the stops (present tense for what the
// record has a unit doing; the record's own `text` where an event carries
// one). Plain functions over plain objects: the UI never imports the sim.
//
// The rules they keep: the player is never a named person ("a Dauntless of
// Bombing Six", never a pilot's name); an aircraft "did not return"; a ship
// "sank", "capsized", "was scuttled"; no count of people anywhere here (the
// counts these lines carry are of bombs, torpedoes and aircraft, and only in
// The record); nothing is a target that is a person, and nothing here says
// what the app does not draw.

/** The stations (tools/check/ids.json vocab.stations), in the order the bar and the card list them. */
export const STATIONS = ['helm', 'main', 'aa', 'torpedoes', 'pilot', 'gunner', 'bombardier']

/** A station's name on a button, and the place it puts you (ROUND-2 §1.1); short, the name on a phone's station pill where the label is too long for the bar's one row. */
export const STATION = {
  helm: { label: 'Helm', where: 'the bridge' },
  main: { label: 'Main battery', short: 'Main', where: 'the director and its sights' },
  aa: { label: 'Anti-aircraft', short: 'AA', where: 'the AA director' },
  torpedoes: { label: 'Torpedoes', short: 'Tubes', where: 'the tubes' },
  pilot: { label: 'Pilot', where: 'the stick and the throttle' },
  gunner: { label: 'Gunner', where: 'the rear gun' },
  bombardier: { label: 'Bombardier', short: 'Sight', where: 'the bombsight' },
}
export const stationLabel = (s) => STATION[s]?.label ?? String(s)

/** The setting (tools/check/ids.json vocab.assist) and its one line (ROUND-2 §1.2). */
export const ASSIST = ['assisted', 'pilot']
export const ASSIST_LABEL = { assisted: 'Assisted', pilot: 'Pilot' }
export const ASSIST_LINE = 'Assisted flight holds the aircraft for you; Pilot is the real thing.'

/** The side codes in the order the briefing gives them. */
export const SIDE_ORDER = { jp: 0, us: 1 }

// An aircraft kit's short name, as the record's roles write it ("a Dauntless
// of Bombing Six", "a Type 97 carrier attack aircraft of Kaga's torpedo unit").
const SHORT = {
  a6m2: 'Zero',
  a6m5: 'Zero',
  d3a1: 'Type 99 carrier bomber',
  b5n2: 'Type 97 carrier attack aircraft',
  d4y1: 'Suisei',
  b6n2: 'Tenzan',
  e13a1: 'Type 0 reconnaissance seaplane',
  f1m2: 'Type 0 observation seaplane',
  'f4f-3': 'Wildcat',
  'f4f-4': 'Wildcat',
  'fm-2': 'Wildcat',
  'f6f-3': 'Hellcat',
  'f2a-3': 'Buffalo',
  'sbd-3': 'Dauntless',
  'sb2u-3': 'Vindicator',
  'tbd-1': 'Devastator',
  'tbf-1': 'Avenger',
  'tbm-1c': 'Avenger',
  'p-40b': 'P-40B',
  'p-36a': 'P-36A',
  'pby-5': 'Catalina',
  'b-17e': 'B-17E',
  'b-26': 'B-26',
  'b-18': 'B-18',
  'a-20': 'A-20',
}

const TYPE = {
  bb: 'battleship',
  cv: 'carrier',
  cvl: 'light carrier',
  cve: 'escort carrier',
  ca: 'heavy cruiser',
  cl: 'light cruiser',
  dd: 'destroyer',
  de: 'destroyer escort',
  ss: 'submarine',
  'ss-midget': 'midget submarine',
  ap: 'transport',
  ar: 'repair ship',
  ao: 'oiler',
  cm: 'minelayer',
  av: 'seaplane tender',
  ah: 'hospital ship',
  ag: 'target ship',
  pt: 'motor torpedo boat',
}

/** "Dauntless", "Type 99 carrier bomber"; a kit not in the list by its name's last word. */
export function kitShort(kit, id = kit?.id) {
  if (SHORT[id]) return SHORT[id]
  const n = String(kit?.name || id || '').replace(/\s*\(.*\)$/, '').trim()
  return n.split(/\s+/).pop() || String(id || '')
}

/** A ship kit as a line: "Kongō-class battleship"; an aircraft kit by its full name. */
export function kitLine(kit, kind, unit = null) {
  if (!kit) return ''
  if (kind === 'aircraft') return kit.name || kitShort(kit)
  const cls = String(kit.class || '').replace(/\s*\(.*\)$/, '').trim()
  const type = /^AG-/.test(unit?.hull || '') ? 'target ship' : TYPE[kit.type] || kit.type || 'ship'
  return cls ? `${cls}-class ${type}` : type
}

/** A ship kit's type alone: "battleship", "destroyer" (the unit list's short line). */
export function shipType(kit, unit = null) {
  if (/^AG-/.test(unit?.hull || '')) return 'target ship'
  return TYPE[kit?.type] || kit?.type || 'ship'
}

/** "One" → the line as a sentence: its first letter up, a full stop at the end. */
export const asSentence = (s) => {
  const t = String(s || '').trim()
  if (!t) return ''
  return `${t[0].toUpperCase()}${t.slice(1)}${/[.!?…]$/.test(t) ? '' : '.'}`
}

const VOWEL = /^[aeiouAEIOU]/
const article = (w) => (VOWEL.test(w) && !/^U[A-Z]/.test(w) ? 'an' : 'a')
/** "the Shikishima unit" mid-sentence, "Bombing Six" as written. */
export const midName = (name) => String(name || '').replace(/^The /, 'the ')
export const poss = (name) => `${name}’s`

/** "a Dauntless of Bombing Six" (never a person: a group's leader is never the player's). */
export function aircraftRole(kitShortName, groupName) {
  return `${article(kitShortName)} ${kitShortName} of ${midName(groupName)}`
}

/**
 * The phrase for a held unit: "At the controls of a Dauntless of Bombing
 * Six", "At the helm of Johnston", "Aboard Johnston" when more than one
 * station was held.
 */
export function rolePhrase({ kind, name, kitShortName, groupName, label = null }, stations = []) {
  const st = [...new Set(stations.filter(Boolean))]
  if (kind === 'aircraft') {
    // (the engine's one-aircraft label where it gives one: "a P-40B from Haleʻiwa", "a Zero of Kaga’s fighters")
    const who = label && /^an? /.test(label) ? label : aircraftRole(kitShortName || 'aircraft', groupName || name || '')
    if (st.length > 1) return `Aboard ${who}`
    if (st[0] === 'gunner') return `At the rear gun of ${who}`
    if (st[0] === 'bombardier') return `At the bombsight of ${who}`
    return `At the controls of ${who}`
  }
  if (st.length > 1) return `Aboard ${name}`
  if (st[0] === 'main') return `At ${poss(name)} main battery`
  if (st[0] === 'aa') return `At ${poss(name)} anti-aircraft guns`
  if (st[0] === 'torpedoes') return `At ${poss(name)} torpedo tubes`
  return `At the helm of ${name}`
}

// --- counts in words (bombs, torpedoes, aircraft: never people) ----------------------------
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
const word = (n) => (n >= 0 && n < WORDS.length && Number.isInteger(n) ? WORDS[n] : String(n))
/** [4, 5] → "four or five"; [2, 6] → "two to six"; 1 → "one". */
export function countWords(c) {
  const [a, b] = Array.isArray(c) ? c : [c, c]
  if (a == null) return ''
  if (a === b) return word(a)
  if (a === 0) return `up to ${word(b)}`
  return b === a + 1 ? `${word(a)} or ${word(b)}` : `${word(a)} to ${word(b)}`
}
const plural = (noun, c) => {
  const [a, b] = Array.isArray(c) ? c : [c, c]
  return a === 1 && (b ?? 1) === 1 ? noun : noun === 'torpedo' ? 'torpedoes' : `${noun}s`
}
const some = (noun, c) => {
  if (c == null) return `${noun === 'torpedo' ? 'torpedoes' : `${noun}s`}`
  const [a, b] = Array.isArray(c) ? c : [c, c]
  if (a === 1 && b === 1) return `${article(noun)} ${noun}`
  return `${countWords(c)} ${plural(noun, c)}`
}
const sentence = (s) => String(s || '').trim().replace(/[.;:]+$/, '')

/**
 * One of the record's events as a line in the stops' voice: "Nevada is hit
 * by a torpedo", "fire breaks out aboard Kaga". `name` is the unit's name;
 * `cause` (optional) { name, profile, kind: 'group' | 'unit' } is what the
 * event's `by` names, for the weapon's noun. An event with its own `text`
 * keeps the record's words. An event the record marks `hud: false` has no
 * line (null), as on the HUD.
 */
export function eventLine(e, name, cause = null) {
  if (!e || e.hud === false) return null
  if (e.text) return sentence(e.text)
  const n = name
  const where = e.where ? `, ${String(e.where).trim()}` : ''
  switch (e.kind) {
    case 'hit': {
      if (cause?.profile === 'strafe') return `${n} is strafed${where}`
      const noun = cause?.kind === 'unit' ? 'shell' : cause?.profile ? 'bomb' : null
      if (!noun) return e.count ? `${n} is hit, ${countWords(e.count)} ${plural('time', e.count)}${where}` : `${n} is hit${where}`
      return `${n} is hit by ${some(noun, e.count ?? 1)}${where}`
    }
    case 'torpedo-hit':
      return `${n} is hit by ${some('torpedo', e.count ?? 1)}${where}`
    case 'near-miss':
      return `near misses fall around ${n}`
    case 'fire':
      return `fire breaks out aboard ${n}${where}`
    case 'flood':
      return `${n} is flooding`
    case 'list':
      return `${n} lists${e.deg ? ` ${e.deg}°` : ''}`
    case 'dead-in-water':
      return `${n} is dead in the water`
    case 'explodes':
      return `${n} explodes`
    case 'sinks':
      return `${n} sinks`
    case 'scuttled':
      return `${n} is scuttled`
    case 'abandoned':
      return `${n} is abandoned`
    case 'launches':
      return `${n} launches aircraft`
    case 'recovers':
      return `${n} recovers aircraft`
    case 'turns':
      return `${n} turns${e.toDeg != null ? ` to ${String(Math.round(e.toDeg)).padStart(3, '0')}°` : ''}`
    case 'opens-fire':
      return `${n} opens fire${e.targetName ? ` on ${e.targetName}` : ''}`
    case 'ceases-fire':
      return `${n} ceases fire`
    case 'torpedoes-fired':
      return `${n} fires torpedoes${e.targetName ? ` at ${e.targetName}` : ''}`
    case 'smoke-screen':
      return `${n} lays smoke`
    case 'searchlight':
      return `${n} turns on her searchlights`
    case 'illuminated':
      return `${n} is illuminated`
    case 'starshell':
      return `${n} fires star shell`
    case 'steering-jammed':
      return `${poss(n)} steering jams`
    case 'power-failure':
      return `${n} loses power`
    case 'radar-lost':
      return `${poss(n)} radar fails`
    case 'collision':
      return `${n} is in a collision`
    case 'sighted':
      return `${n} is sighted`
    case 'withdraws':
      return `${n} withdraws`
    case 'aground':
      return `${n} runs aground`
    default:
      return null
  }
}

/** What an air group's attack is, in the stops' voice: "dives on Kaga". */
export function attackLine(profile, targetName) {
  const on = targetName ? ` ${targetName}` : ''
  switch (profile) {
    case 'dive':
      return `dives on${on || ' the ships'}`
    case 'torpedo':
      return `runs in to drop torpedoes${targetName ? ` at ${targetName}` : ''}`
    case 'level':
      return targetName ? `bombs ${targetName} from altitude` : 'bombs from altitude'
    case 'strafe':
      return `strafes${on || ' the airfields'}`
    case 'cap':
      return targetName ? `engages ${targetName}` : 'flies combat air patrol'
    case 'escort':
      return targetName ? `escorts ${targetName}` : 'flies escort'
    case 'search':
      return 'searches'
    default:
      return targetName ? `attacks ${targetName}` : 'attacks'
  }
}

/** A course and speed: "steaming 310° at 20 kn"; "not under way" when stopped. */
export function steaming(courseDeg, speedKn) {
  if (!(speedKn > 0.4)) return 'not under way'
  return `steaming ${String(Math.round((((courseDeg ?? 0) % 360) + 360) % 360)).padStart(3, '0')}° at ${Math.round(speedKn)} kn`
}

/** A ship's fate as a past-tense verb (R8 §3.6). */
export const FATE_VERB = { sunk: 'sank', scuttled: 'was scuttled', capsized: 'capsized', lost: 'was lost', exploded: 'blew up', beached: 'was beached', wrecked: 'was wrecked' }

/** Damage taken (a share of the kit's fatal) in words for Your sortie. */
export function damageWords(d, kind) {
  if (d == null) return null
  if (typeof d === 'string') return d
  // (a share of the kit's fatal: the mock's share, an aircraft's damage, a ship's fighting or floating damage, whichever is worse)
  const share = typeof d === 'object' ? d.share ?? d.damage ?? Math.max(d.fight ?? 0, d.float ?? 0) : d
  if (!(share > 0.005)) return 'none'
  if (kind === 'aircraft') return share >= 1 ? 'fatal' : 'hit'
  if (share < 0.15) return 'light'
  if (share < 0.45) return 'serious'
  if (share < 1) return 'crippling'
  return 'fatal'
}
