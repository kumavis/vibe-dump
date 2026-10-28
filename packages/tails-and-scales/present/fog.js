// (F16) The courtesy fog of war: what the table shows the seat played on
// this page of the other seat's army and of the scenery. Pure.
//
// DESIGN §5's "no hidden information" stands as a rule of the core: the
// match is a pure function of a public log that every peer folds whole,
// so nothing here keeps a secret from devtools. This hides it in the view,
// on the trust the dice and the sealed army lists already rest on (open
// questions 1 and 20), and only by agreement: online both seats agree in
// the lobby (net/lobby.js's `fog`), against the AI it is the battle-setup
// panel's toggle (the AI sees everything: core/ai reads G.units), never in
// hotseat (one screen), for a watcher or a replay (they see all). The fold,
// the corpus and the setup never hear of it.
//
// What fog hides (open question 32, answered): an enemy unit none of the
// seat's living units sees (the core's own `sight`, any friendly unit to
// any of its models) has no live figure, label, chip, minimap dot, card,
// tooltip or pick, and the log lines and dice rows that name it go. (F9a)
// A rider is off the table: it is no eye (its hull sees for it), it is
// seen exactly when its hull is (its figures stand on the hull's deck),
// and while it rides it leaves no ghost of its own (the hull's ghost is
// where it was last seen; one seen on the table before it boarded keeps
// that ghost, as any unit does, until its place is seen empty); where
// it was last seen a greyed figure stands as it then stood (its models,
// its wounds), until it is seen again, or seen to be gone (its last place
// in sight and empty, or the unit fallen in sight). The scenery likewise
// is drawn as last seen: a wall a template has since brought down stands
// in this seat's view until a unit of its sees the gap. No permanent
// reveal: only what is seen now, and the greyed record of what was.
//
// It moves an entry at a time (the Session hands the view each entry's
// events, app/flow.js's sink): after each entry, the match the table will
// show once it has played that entry's events is asked what the seat's
// units see (fogSight, inside the Session's preview: the dice locked, as
// input/ asks its questions), and the fog steps on (fogStep). The view is
// told twice per entry, by two `fog` events the flow puts round the
// entry's own (view/player.js plays them in order): as the entry opens,
// what may show while it plays (fogOpen: an enemy seen both before and
// after it, or seen as it fell, live; one leaving sight a ghost where it
// was, at once, so its walk away is never shown), and as it closes, what
// it now sees (fogView), the chunks seen again brought up to date
// (fogReveal). What the entry's events say is marked for the view
// (fogEvents): a line, a tray or a row that would name an enemy unseen at
// both ends of the entry is hidden (a shot at you from one unseen still
// shows, its shooter unnamed: "Unseen"; a fight you are in shows in full),
// a template landing out of sight shows no explosion and no line, and the
// scenery's events for a chunk not seen as the entry ends play nothing.
//
//   F = fogStart(seat)       the fog before anything is seen
//   F = { seat, over,        over: the battle is over, the fog lifted
//         foes: [ids],       the other seat's units
//         seen: Set,         those its living units see now
//         fell: Set,         those that fell in sight in the last step
//         last: Map id →     each one seen, as last seen (`rec`: a mirror
//               rec,         unit, present/mirror.js's, as it then stood);
//                            a seen one's is as it stands now, an unseen
//                            one's is its ghost
//         known: Map id → n  its models standing as last known (n), for the
//                            roster's worth: 0 once seen to fall
//         table: Map id →    the scenery as last seen, every chunk the seat
//               { alive, y } has seen (null before the first step: then the
//                            board as it stands, which both seats see)
//         }
//
// What the sight pass is asked (fogSight, run inside preview):
//   units:  each living enemy, seen by any living friendly unit (sight's
//           `visible`), cached per pair while neither unit and nothing of
//           the scenery has changed (`cache`, the caller's)
//   places: each ghost not seen now, by sight to a stand-in for its record
//           (the unit's type, its models where they stood): "its last place
//           in sight"
//   chunks: each chunk whose live state isn't the seat's record of it (a
//           chunk broken, dropped or added since), by sight to a stand-in
//           at its top centre, 0.1" up: the ray from a friendly eye
//           unblocked through the same G.terrain.los the unit rays take (a
//           chunk the eye stands below, its own face in the way, is not
//           seen; a fallen log and its tree are seen together); unchanged
//           chunks need no answer
//   lands:  each template's landing (blast.land, spell.thorns) in the
//           entry, by sight to a stand-in on the floor there, 0.5" up
// A stand-in is a unit as sight reads one: its type's chest, its models'
// slots round its place; so every answer is the core's own rule.

// ── The state ──────────────────────────────────────────────────────────────
export const fogStart = (seat) => ({ seat, over: false, foes: [], seen: new Set(), fell: new Set(), last: new Map(), known: new Map(), table: null })

// a mirror unit, as a record (models copied: the mirror folds in place)
// ((V3c) its spell marks too, as last seen)
const recOf = (mu) => ({ pos: { x: mu.pos.x, z: mu.pos.z }, y: mu.y ?? 0, r: mu.r, models: mu.models.map((m) => ({ w: m.w, alive: m.alive, ox: m.ox, oz: m.oz })), alive: mu.alive, mesmerized: !!mu.mesmerized, engaged: !!mu.engaged, snared: !!mu.snared, warded: !!mu.warded, resolute: !!mu.resolute })
const chunkRec = (c) => ({ alive: c.alive, y: c.y })
const sameChunk = (a, b) => !!a && !!b && a.alive === b.alive && a.y === b.y

// What the sight pass must answer beyond the units: the ghosts' places and
// the chunks whose live state (`M`, the mirror the table will show) isn't
// the record. { places: Map id → rec, chunks: [ids] }
export function fogAsks(F, M) {
  const chunks = []
  if (F.table && !F.over) for (const [k, c] of Object.entries(M.chunks)) if (!sameChunk(F.table.get(Number(k)), c)) chunks.push(Number(k))
  return { places: F.over ? new Map() : F.last, chunks }
}

// The entry's template landings, in order: [{ x, z }] (blast.land and
// spell.thorns: an eruption's thorns and the template under them each)
export const fogLands = (events) => events.filter((e) => e.t === 'blast.land' || e.t === 'spell.thorns').map((e) => ({ x: e.x, z: e.z }))

// ── The sight pass (inside preview: G, q the core's queries) ──────────────
// `ask`: { seat, places, chunks, lands } (fogAsks's, and fogLands'); `cache`
// a Map the caller keeps (answers by pair, let go when the scenery changes)
// or null. Returns { units: Set, places: Set, chunks: Set, lands: [bool] }.
export function fogSight(G, q, { seat, places = new Map(), chunks = [], lands = [] }, cache = null) {
  const mine = [], foes = []
  // ((F9a) riders aside: off the table, seen with their hulls below)
  for (const u of G.units) if (q.alive(u) && !u.aboard) (u.side === seat ? mine : foes).push(u)
  if (cache) {
    const tk = terrainKey(G)
    if (cache.get('terrain') !== tk) {
      cache.clear()
      cache.set('terrain', tk)
    }
  }
  const keys = new Map()
  const keyOf = (u) => {
    let k = keys.get(u)
    if (k === undefined) keys.set(u, (k = unitKey(u)))
    return k
  }
  const pair = (f, e) => {
    if (!cache) return q.sight(G, f, e).visible
    const id = `${f.id}|${e.id}`, sig = `${keyOf(f)}|${keyOf(e)}`, hit = cache.get(id)
    if (hit && hit.sig === sig) return hit.v
    const v = q.sight(G, f, e).visible
    cache.set(id, { sig, v })
    return v
  }
  const units = new Set()
  for (const e of foes) if (mine.some((f) => pair(f, e))) units.add(e.id)
  // ((F9a) an enemy rider is seen exactly when its hull is)
  for (const u of G.units) if (q.alive(u) && u.aboard && u.side !== seat && units.has(u.aboard)) units.add(u.id)
  // a stand-in seen by any friendly unit (its cover never asked: false)
  const probe = (b) => mine.some((f) => q.sight(G, f, b, f.pos, false).visible)
  const point = (x, z, y) => ({ id: -1, side: -1, t: { chest: y - q.floorAt(G, x, z), eye: 0, models: 1 }, pos: { x, z }, r: 0, models: [{ alive: true, w: 1, ox: 0, oz: 0 }] })
  const byId = new Map(G.units.map((u) => [u.id, u]))
  const placesSeen = new Set()
  for (const [id, rec] of places) {
    const u = byId.get(id)
    if (!u || units.has(id) || !rec.models.some((m) => m.alive)) continue
    if (probe({ id, side: u.side, t: u.t, pos: rec.pos, r: rec.r, models: rec.models })) placesSeen.add(id)
  }
  const chunkOf = new Map(G.terrain.chunks.map((c) => [c.id, c]))
  const chunksSeen = new Set()
  for (const id of chunks) {
    const c = chunkOf.get(id)
    if (c && probe(point(c.shape.x, c.shape.z, c.shape.y + c.shape.hy + 0.1))) chunksSeen.add(id)
  }
  // (a fallen log and the tree it was are seen together: the one is the
  // other keeled over, drawn by one mesh)
  for (const id of chunks) {
    const c = chunkOf.get(id), t = c?.look?.piece === 'fallen' ? c.look.tree : undefined
    if (t === undefined || !(chunksSeen.has(id) || chunksSeen.has(t))) continue
    chunksSeen.add(id)
    if (chunks.includes(t)) chunksSeen.add(t)
  }
  return { units, places: placesSeen, chunks: chunksSeen, lands: lands.map((p) => probe(point(p.x, p.z, q.floorAt(G, p.x, p.z) + 0.5))) }
}
// what a pair's answer depends on, of a unit: where it stands, its models
// standing and their slots
const unitKey = (u) => `${u.pos.x},${u.pos.z},${u.models.map((m) => (m.alive ? `${m.ox},${m.oz}` : '-')).join(';')}`
// of the scenery: which chunks are broken, how many there are and their
// heights (a drop moves one), weighed so two states rarely sum alike
const terrainKey = (G) => {
  let dead = '', h = 0
  for (const c of G.terrain.chunks) {
    if (!c.alive) dead += `${c.id},`
    else h += c.shape.y * (1 + (c.id % 7))
  }
  return `${G.terrain.chunks.length}|${dead}|${h}`
}

// ── The step ───────────────────────────────────────────────────────────────
// The fog after an entry: `M` the mirror the table shows once it has played
// it (project(G) there), `sideOf(id)` a unit's seat, `sees` fogSight's. Each
// living enemy seen is recorded as it stands; one that fell while seen as
// the entry began fell in sight (its record goes, its count 0); a ghost
// whose place is seen empty goes; the chunks seen are recorded as they
// stand. The battle over, the fog lifts: everything seen, nothing a ghost.
export function fogStep(F, M, sideOf, sees) {
  const foes = Object.keys(M.units).map(Number).filter((id) => sideOf(id) !== F.seat)
  const live = () => new Map(Object.entries(M.chunks).map(([k, c]) => [Number(k), chunkRec(c)]))
  if (M.stage === 'over') {
    const seen = new Set(foes.filter((id) => M.units[id].alive > 0))
    return { seat: F.seat, over: true, foes, seen, fell: new Set(foes.filter((id) => !(M.units[id].alive > 0) && F.seen.has(id))), last: new Map(), known: new Map(foes.map((id) => [id, M.units[id].alive])), table: live() }
  }
  const seen = new Set(), fell = new Set(), last = new Map(F.last), known = new Map(F.known)
  for (const id of foes) {
    const mu = M.units[id]
    if (mu.alive > 0 && sees.units.has(id)) {
      seen.add(id)
      // ((F9a) a rider seen on its hull's deck leaves no record of its own:
      // its hull's ghost stands for it)
      if (mu.aboard) last.delete(id)
      else last.set(id, recOf(mu))
      known.set(id, mu.alive)
    } else if (!(mu.alive > 0) && F.seen.has(id)) {
      fell.add(id)
      last.delete(id)
      known.set(id, 0)
    } else if (last.has(id) && sees.places.has(id)) last.delete(id)
  }
  let table = F.table
  if (!table) table = live()
  else {
    for (const id of sees.chunks) {
      const c = M.chunks[id]
      if (!c) continue
      if (table === F.table) table = new Map(table)
      table.set(id, chunkRec(c))
    }
  }
  return { seat: F.seat, over: false, foes, seen, fell, last, known, table }
}

// ── What the view shows ────────────────────────────────────────────────────
// As an entry closes: the enemies hidden (every one not seen now, but one
// seen as it fell: its fall plays on in sight) and the ghosts (each record
// of one not seen). { hide: Set, ghosts: Map id → rec }
export function fogView(F) {
  if (F.over) return { hide: new Set(), ghosts: new Map() }
  return { hide: new Set(F.foes.filter((id) => !F.seen.has(id) && !F.fell.has(id))), ghosts: new Map([...F.last].filter(([id]) => !F.seen.has(id))) }
}
// While an entry plays (`before` the fog as it opened, `after` as it
// closes): live, an enemy seen at both ends of it or seen as it fell (its
// fall plays); every other enemy hidden, and the ghosts the records of
// those as the entry opened (one leaving sight a ghost where it last stood,
// one coming into sight still its old ghost, if any, until the entry
// closes). { live: Set, hide: Set, ghosts: Map }
export function fogOpen(before, after) {
  const live = new Set([...before.seen].filter((id) => after.seen.has(id) || after.fell.has(id)))
  return { live, hide: new Set(after.foes.filter((id) => !live.has(id))), ghosts: new Map([...before.last].filter(([id]) => !live.has(id))) }
}
// The chunks whose record the step changed: seen again as they now stand
// (the view brings each up to date: a broken one goes, a dropped one is
// set at its height, one never seen before is built). [ids]
export function fogReveal(before, after) {
  if (!before.table || !after.table || before.table === after.table) return []
  const out = []
  for (const [id, c] of after.table) if (!sameChunk(before.table.get(id), c)) out.push(id)
  return out
}
// The chunks as this seat's table draws them (a snap's: view/terrain.js's
// sync over these): `chunks` the match's (G.terrain.chunks), each as its
// record has it, one never seen not drawn; the others the match's own.
export function fogChunks(chunks, F) {
  if (!F?.table || F.over) return chunks
  return chunks.map((c) => {
    const r = F.table.get(c.id)
    if (!r) return c.alive ? { ...c, alive: false } : c
    return r.alive === c.alive && r.y === c.shape.y ? c : { ...c, alive: r.alive, shape: { ...c.shape, y: r.y } }
  })
}
// Whether a chunk is stale: the match's live state of it (`M`'s) isn't
// what this seat's table draws.
export const fogStale = (F, M, id) => !!F?.table && !F.over && !sameChunk(F.table.get(id), M.chunks[id])

// ── The entry's events, marked for the view ────────────────────────────────
// A copy of `events` (an entry's, in order) in which each one the table
// must not show carries `veil: 'hide'`, and each that names a shooter
// unseen carries its text with the name put as "Unseen" (`veil: 'anon'`,
// the html or title rewritten). `ctx`: { seat, before, after (the fog as
// the entry opened and closed), sees (fogSight's: its `lands` the entry's
// templates', in order), M (the mirror at its close), sideOf(id),
// units: [{ id, side, short, name }] (each unit's type names: a line or a
// row that carries no id is read by the name it starts with) }.
//
// Whom an event is about is read off the entry as the core emits it
// (core/actions/: each action opens with a focus, its turn to face or its
// tray, and its deeds name the unit that acts, `u`, and its target, `tg`):
//   - an action's tray, its dice rows and its lines are its actor's: shown
//     when the actor is the seat's own or an enemy seen as the entry opened
//     or closed; else, at one of the seat's units (its target, `tg`),
//     shown with the actor unnamed, or in full for a fight it is in; else
//     hidden. A line or tray with no unit named in its action (an advance's
//     roll played alone, a morale test held) by the name it starts with:
//     shown unless every enemy unit of that name is unseen;
//   - a destroyed unit's line (one held back, `traced: false`) is that
//     unit's, in the order the units fell;
//   - a template's victims (each wound row from its landing on, its save
//     row and its line) and its "…scenery wrecked" line are shown when its
//     landing is in sight, or (a row, a line) the victim is the seat's own;
//     its landing (blast.land, spell.thorns, spell.fade; (F19a) a keg.fuse
//     as the landing straight after it) the same; its aim,
//     scatter and throw as its shooter's figure (an enemy live through the
//     entry, or the seat's own);
//   - the scenery's events (and a walk's smashes) for a chunk stale as the
//     entry closes, or caused by a template landing out of sight or a
//     walker hidden, play nothing (the chunk is brought up to date once
//     seen: fogReveal).
// The figures' own events (a walk, a volley, a fall) are the view's to
// hide by the unit (fogOpen's live set): they are never marked here.
const OWN = new Set(['phase.start', 'round.scored', 'stage', 'game.over'])
const OPENS = new Set(['focus', 'unit.face', 'tray.open'])
// ((F9a) a unit boarding or stepping off its hull acts as a walker does;
// (V3c) a snare and a ward settling are the caster's acts, as a gaze is)
const DEEDS = new Set(['unit.move', 'unit.place', 'volley', 'melee', 'blast.aim', 'blast.fire', 'spell.cast', 'spell.fizzle', 'spell.thorns', 'charge.result', 'unit.flee', 'unit.embark', 'unit.disembark'])
const ACTS = new Set(['unit.face', 'volley', 'melee', 'charge.result', 'spell.cast', 'spell.fizzle', 'spell.gaze', 'spell.thorns', 'spell.snare', 'spell.ward', 'blast.fire', 'unit.move', 'unit.place', 'unit.embark', 'unit.disembark'])
const TERRAIN = new Set(['terrain.add', 'terrain.hurt', 'terrain.destroy', 'terrain.collapse', 'terrain.rubble'])
const VICTIM = /^(⚠ )?.+: \d+ hits? · wound/
// the name a line or a tray title starts with
const lineName = (html) => /^<b>(.*?)<\/b>/.exec(html ?? '')?.[1] ?? null
const trayName = (title) => (title ? String(title).split(/ → | fight | charge | — |: /)[0].trim() : null)

export function fogEvents(events, { seat, before, after, sees, M, sideOf, units = [] }) {
  if (after.over && before.over) return events
  const foe = 1 - seat
  const V = new Set([...before.seen, ...after.seen])
  const live = fogOpen(before, after).live
  const vis = (id) => sideOf(id) === seat || V.has(id)
  const shownFig = (id) => sideOf(id) === seat || live.has(id)
  const mine = (id) => id !== null && id !== undefined && sideOf(id) === seat
  const byName = (name) => units.filter((u) => u.short === name || u.name === name)
  // by the name alone: shown unless every enemy unit so named is unseen
  const named = (name) => {
    const all = byName(name)
    const foes = all.filter((u) => u.side === foe)
    return !foes.length || foes.some((u) => vis(u.id))
  }
  const namedMine = (name) => {
    const all = byName(name)
    return all.length > 0 && all.every((u) => u.side === seat)
  }
  const stale = (id) => fogStale(after, M, id)
  const out = events.slice()
  const mark = (k, veil, extra = {}) => (out[k] = { ...out[k], veil, ...extra })
  const lands = sees.lands ?? []

  // the entry's actions (spans), each with its actor and target
  const spans = []
  let cur = null
  const open = (k) => {
    cur = { from: k, to: k, u: null, tg: null, deed: false, said: false, melee: false, name: null, morale: false }
    spans.push(cur)
  }
  events.forEach((e, k) => {
    if (OWN.has(e.t)) {
      open(k)
      cur.to = k + 1
      cur = null
      return
    }
    if (!cur || (OPENS.has(e.t) && (cur.deed || cur.said)) || (e.t === 'unit.move' && cur.u !== null && cur.u !== e.u && cur.deed)) open(k)
    cur.to = k + 1
    if (e.t === 'tray.open') {
      cur.name ??= trayName(e.title)
      if (e.title === 'Morale') cur.morale = true
    }
    if (e.t === 'log') {
      cur.said = true
      if (e.traced !== false) cur.name ??= lineName(e.html)
    }
    if (DEEDS.has(e.t)) cur.deed = true
    if (e.t === 'melee') cur.melee = true
    if (ACTS.has(e.t) && cur.u === null && e.u !== undefined) cur.u = e.u
    if (cur.tg === null && e.tg !== undefined) cur.tg = e.tg
    if (e.t === 'act' || e.t === 'pending') cur = null
  })

  // a span's say over its tray, rows and lines: 'show', 'anon' or 'hide'
  const sayOf = (s) => {
    if (s.u === null) return !s.name || named(s.name) ? 'show' : 'hide'
    if (vis(s.u)) return 'show'
    if (mine(s.tg)) return s.melee ? 'show' : 'anon'
    return 'hide'
  }
  const anonName = (s) => units.find((u) => u.id === s.u)?.short ?? null
  const fallen = []
  let land = -1
  for (const s of spans) {
    const say = sayOf(s), short = anonName(s)
    // (a morale test: each unit's row and its line, by the units that flee
    // or the name the row starts with)
    let sub = null
    // (a template's victims: from its landing to the next aim, throw or
    // landing, each group a wound row to its line)
    let victims = false, victim = null, group = []
    const endGroup = (shown) => {
      for (const k of group) if (!shown) mark(k, 'hide')
      group = []
      victim = null
    }
    for (let k = s.from; k < s.to; k++) {
      const e = events[k]
      if (e.t === 'unit.destroyed') fallen.push(e.u)
      if (e.t === 'blast.land' || e.t === 'spell.thorns') {
        land++
        victims = e.t === 'blast.land'
        if (!lands[land]) mark(k, 'hide')
        continue
      }
      if (e.t === 'spell.fade') {
        if (!lands[land]) mark(k, 'hide')
        continue
      }
      // ((F19a) a powder keg's fuse, as the landing of its blast, straight
      // after it)
      if (e.t === 'keg.fuse') {
        if (!lands[land + 1]) mark(k, 'hide')
        continue
      }
      if (e.t === 'blast.aim' || e.t === 'blast.fire' || e.t === 'blast.scatter') {
        victims = false
        if (s.u !== null && !shownFig(s.u)) mark(k, 'hide')
        continue
      }
      if (TERRAIN.has(e.t)) {
        terrainMark(k, e, (id) => stale(id) || (land >= 0 && !lands[land] && inBlast(s, k)))
        continue
      }
      if (e.t === 'unit.move' && e.smashes?.length) {
        const hiddenWalk = !shownFig(e.u)
        const smashes = e.smashes.map((sm) => ({ ...sm, ev: sm.ev.map((x) => (TERRAIN.has(x.t) ? terrainVeil(x, (id) => stale(id) || hiddenWalk) : x)) }))
        if (smashes.some((sm, i) => sm.ev.some((x, j) => x !== e.smashes[i].ev[j]))) out[k] = { ...out[k], smashes }
        continue
      }
      // a template's victims
      if (victims && e.t === 'dice' && VICTIM.test(e.label ?? '')) {
        endGroup(groupShown(victim, lands[land]))
        group.push(k)
        victim = { name: (e.label ?? '').replace(/^⚠ /, '').split(':')[0], u: null }
        continue
      }
      if (victim) {
        if ((e.t === 'unit.wound' || e.t === 'unit.slain') && victim.u === null) victim.u = e.u
        if (e.t === 'dice') {
          group.push(k)
          continue
        }
        if (e.t === 'log' && e.traced !== false) {
          group.push(k)
          endGroup(groupShown(victim, lands[land]))
          continue
        }
      }
      if (e.t === 'log' && e.traced === false) {
        // a held-back line: the unit that fell, in order
        const at = fallen.findIndex((id) => sideOf(id) === e.side)
        const id = at >= 0 ? fallen.splice(at, 1)[0] : null
        if (id !== null ? !vis(id) : !(e.side !== foe || named(lineName(e.html)))) mark(k, 'hide')
        continue
      }
      if (e.t === 'log' && /^…and \d+ pieces? of scenery/.test(e.html ?? '')) {
        if (land >= 0 && !lands[land]) mark(k, 'hide')
        continue
      }
      // a morale test's rows and lines
      if (s.morale && e.t === 'dice') {
        sub = { row: k, u: null, name: (e.label ?? '').split(':')[0] }
        continue
      }
      if (s.morale && sub) {
        if (e.t === 'unit.flee' && sub.u === null) sub.u = e.u
        if (e.t === 'log') {
          const shown = sub.u !== null ? vis(sub.u) : named(sub.name)
          if (!shown) {
            mark(sub.row, 'hide')
            mark(k, 'hide')
          }
          sub = null
        }
        continue
      }
      if (e.t === 'tray.open' || e.t === 'dice' || e.t === 'log') {
        if (e.t === 'tray.open' && s.morale) continue
        // (a line of nobody's, or the seat's own: always shown)
        if (e.t === 'log' && (e.side < 0 || e.side === seat)) continue
        if (say === 'hide') mark(k, 'hide')
        else if (say === 'anon') {
          if (e.t === 'tray.open' && short) mark(k, 'anon', { title: String(e.title).replace(short, 'Unseen') })
          else if (e.t === 'log' && short) mark(k, 'anon', { html: String(e.html).replace(`<b>${short}</b>`, '<b>Unseen</b>') })
        }
      }
    }
    endGroup(groupShown(victim, lands[land]))
  }
  return out

  // a victim's rows and line: shown when the landing is seen, or the
  // victim is the seat's own (by the unit its wounds name, else its name)
  function groupShown(v, landSeen) {
    if (!v) return true
    if (landSeen) return true
    return v.u !== null ? mine(v.u) : namedMine(v.name)
  }
  // whether event k of span s comes from a template landing in it (its
  // terrain events follow the landing)
  function inBlast(s, k) {
    for (let j = k - 1; j >= s.from; j--) {
      const t = events[j].t
      if (t === 'blast.land') return true
      if (t === 'unit.move') return false
    }
    return false
  }
  function terrainMark(k, e, hidden) {
    const x = terrainVeil(e, hidden)
    if (x !== e) out[k] = x
  }
  // (the event's own fields untouched: the mirror folds it as it is, the
  // view plays it or not; a collapse's drops not to play named apart)
  function terrainVeil(e, hidden) {
    if (e.t === 'terrain.collapse') {
      const unseen = e.drops.filter((d) => hidden(d.id)).map((d) => d.id)
      if (!unseen.length) return e
      return unseen.length === e.drops.length ? { ...e, veil: 'hide' } : { ...e, veil: 'part', unseen }
    }
    const id = e.t === 'terrain.add' ? e.def.id : e.id
    return hidden(id) ? { ...e, veil: 'hide' } : e
  }
}
