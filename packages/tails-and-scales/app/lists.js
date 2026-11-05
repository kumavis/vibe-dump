// The army lists this device keeps (DESIGN §4.2.8.8's "Saved lists", F11b):
// the lists a player saved from the Muster screen (ui/screens/muster.js),
// and the last list each race took into each battle size, which the
// battle-setup panel's army line and the Muster screen open with.
//
//   localStorage['ts.lists']        { v: 1, lists: [{ id, name, race,
//                                   mission, units: { nutkin: 4, … }, at }] }
//                                   at most 50
//   localStorage['ts.lists.last.<race>.<mission>']   { v: 1, units: { … } }
//
// Stored by unit key, never by digits: a list's digits are counts in its
// race's roster order, so a roster that changed in an update (a unit added
// in the middle by mistake, one taken out) would silently read them as
// other units. A key says which unit it means: on reading, a key the race no
// longer has is dropped with a note ("\"ballista\" is no longer in the
// Bushtails' roster"), and the list is then checked under today's prices
// and list rules (core/army.js's checkList, the fold's own), so a list that
// is now over its limit shows red where it is shown, never refused unseen.
//
// Every access to the storage is in try/catch, and the page works without
// it (a private window, blocked site data, a full quota): a list saved
// where nothing can be kept lives as long as the page, and a page that
// keeps nothing opens every army line on its preset. Client code only: the
// lists never reach a setup but as the digits a seat's army names (no bump,
// nothing in the match).
//
//   new Lists(store = localStorage)   (a stand-in store for the checks)
//   lists.all(race)                   the saved lists of a race, newest first
//   lists.save({ name, race, mission, counts })   → { list } | { why }
//   lists.remove(id)
//   lists.last(race, mission)         → the last list's counts and notes, or
//                                     null
//   lists.keep(race, mission, counts) the last list, written on Ready
//   countsOf(race, units)             → { counts, notes } (unknown keys
//                                     dropped, each with its note)
//   unitsOf(race, counts)             → { key: n } (the counts above 0)
import { RACES } from '../data/schema.js'

export const LISTS_KEY = 'ts.lists'
export const LAST_KEY = 'ts.lists.last'
// the most lists a device keeps
export const MAX_LISTS = 50
// the schema's version
const V = 1

// A record of the units a list fields, by unit key, from its counts (one
// per roster entry, in roster order): only the counts above 0.
export function unitsOf(race, counts) {
  const out = {}
  RACES[race].roster.forEach((k, i) => {
    if ((counts[i] ?? 0) > 0) out[k] = counts[i]
  })
  return out
}

// A list's counts from its record of units by key: a key the race's roster
// no longer has dropped, with a note naming it; a count that is no whole
// number from 1 to 9 dropped too (a hand-edited store). Never throws.
export function countsOf(race, units) {
  const r = RACES[race], notes = []
  const counts = r.roster.map(() => 0)
  if (!units || typeof units !== 'object' || Array.isArray(units)) return { counts, notes: ['the list holds no units'] }
  for (const [k, n] of Object.entries(units)) {
    const i = r.roster.indexOf(k)
    if (i < 0) notes.push(`"${k}" is no longer in the ${r.short}' roster`)
    else if (!Number.isInteger(n) || n < 1 || n > 9) notes.push(`${r.units[k].name}: ${JSON.stringify(n)} is no count`)
    else counts[i] = n
  }
  return { counts, notes }
}

// a store's text as JSON, or null (absent, unreadable, or no JSON)
function read(store, key) {
  try {
    const text = store?.getItem(key)
    return text == null ? null : JSON.parse(text)
  } catch {
    return null
  }
}
// true if the store took it
function write(store, key, value) {
  try {
    store.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

// the store this page has, or null (a sandbox that throws on the name)
const pageStore = () => {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

export class Lists {
  constructor(store = pageStore()) {
    this.store = store
    // (the lists as this page knows them: the store's, else the ones saved
    // on this page where the store keeps nothing)
    this.mem = null
    this.lastMem = new Map()
  }

  // every saved list the store holds, well formed (a record of the schema
  // with a race this code knows), newest first
  load() {
    const doc = read(this.store, LISTS_KEY)
    const lists = doc && doc.v === V && Array.isArray(doc.lists) ? doc.lists : this.mem ?? []
    return lists.filter((l) => l && typeof l === 'object' && typeof l.id === 'string' && typeof l.name === 'string' && Object.hasOwn(RACES, l.race) && typeof l.mission === 'string').sort((x, y) => (y.at ?? 0) - (x.at ?? 0))
  }

  // the saved lists of `race`, newest first
  all(race) {
    return this.load().filter((l) => l.race === race)
  }

  // A list saved under `name`: { list } (the record kept), or { why } when
  // the device holds its most already. A name is trimmed and cut to 40
  // characters; an empty one gets the race's and the list's points.
  save({ name, race, mission, counts, points = 0 }) {
    const lists = this.load()
    if (lists.length >= MAX_LISTS) return { why: `${MAX_LISTS} lists are saved already: delete one to save another` }
    const text = String(name ?? '').trim().slice(0, 40) || `${RACES[race].short} ${points.toLocaleString('en')}`
    const list = { id: `l${Date.now().toString(36)}${lists.length.toString(36)}`, name: text, race, mission, units: unitsOf(race, counts), at: Date.now() }
    const next = [list, ...lists]
    this.mem = next
    write(this.store, LISTS_KEY, { v: V, lists: next })
    return { list }
  }

  // (countsOf, for the Muster screen, which holds a Lists)
  countsOf(race, units) {
    return countsOf(race, units)
  }

  remove(id) {
    const next = this.load().filter((l) => l.id !== id)
    this.mem = next
    write(this.store, LISTS_KEY, { v: V, lists: next })
  }

  // The last list `race` took into `mission`'s battles (the Muster screen's
  // Ready): { counts, notes }, its unknown keys dropped (countsOf), or null
  // when there is none. The caller checks it (checkList), as a saved list is.
  last(race, mission) {
    const key = `${LAST_KEY}.${race}.${mission}`
    const doc = read(this.store, key) ?? this.lastMem.get(key) ?? null
    if (!doc || doc.v !== V) return null
    const got = countsOf(race, doc.units)
    return got.counts.some((n) => n > 0) ? got : null
  }

  keep(race, mission, counts) {
    const key = `${LAST_KEY}.${race}.${mission}`, doc = { v: V, units: unitsOf(race, counts) }
    this.lastMem.set(key, doc)
    write(this.store, key, doc)
  }
}
