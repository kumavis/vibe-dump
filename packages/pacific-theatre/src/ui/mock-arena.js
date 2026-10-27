// Dev-only (ui.html, never in the build): a mock of ROUND-3.md §3's arena
// surface, so the Wargame's interface (the door, the start sheet, the HUD
// layer, the hit markers, the respawn line, the end card and its reel) can be
// built and tested while the engine's arena is written beside it. It serves
// the contract's shapes as research/ui-3.md reads them, not the engine's
// models: a seeded, scripted ten-minute game over a box's real units, ships
// keeping a formation that closes and zigzags, aircraft orbiting and running
// in, hits, sinkings over twenty seconds, aircraft shot down, the player's
// own hits, a loss and a respawn two seconds later, the phases and both main
// goals, and a result.
//
//   arena = new MockArena(scenario, battleFile, kits, { side: 'jp' | 'us', seed })
//   arena.units()          → [{ index, id, kind, side, name, ja, kit, type, group, groupName, k, hull, alive: 1 | 2 | 0,
//                               takeable: true | reason, enemy, stations, now, next, hp }]
//   arena.takeControl(role), arena.setStation(name), arena.releaseControl(), arena.player, arena.sortie
//   arena.advance(dt), arena.seek(t) (the dev page's scrub), arena.t, arena.durationS, arena.clock.label(t)
//   arena.state            → { pos: Float64Array(3n), alive: Uint8Array(n), heading: Float64Array(n) } (the record sim's layout)
//   arena.hop('next' | 'carrier' | 'capital' | 'destroyer' | 'aircraft' | index)   (ids.json vocab.hopKinds)
//   arena.objective        → { jp: goal, us: goal }, goal = { kind, type, count, text, done, of, status: 'open' | 'met' | 'failed' }
//   arena.strength         → { jp: 0..1, us: 0..1 }
//   arena.tally            → { jp: { sunk, downed }, us: { sunk, downed }, player: { hits, sunk, downed, lost } }
//                            (a side's tally is what it did: the ships it sank, the aircraft it shot down)
//   arena.phase            → { jp: phase, us: phase }, phase = { index, of, t, title, text, goal, done, count, leftS, status } | null
//   arena.result           → null, then { t, reason: 'goal' | 'clock', met: { jp, us }, by }
//   arena.highlights       → [{ id, t, kind: 'hit' | 'sunk' | 'lost' | 'downed', mine, unit, text }]
//   arena.events           → [{ id, t, kind: 'hit' | 'near-miss' | 'sinking' | 'sunk' | 'downed' | 'lost' | 'respawn' | 'hop' | 'phase',
//                               target, by, mine, text, from?, to? }]  (the hit markers' feed: link.js reads new entries each frame)
//   arena.shake, arena.slowmo  (numbers that decay; no-ops here)
//   arena.effects, arena.beats, arena.capacityByKit (stand-ins)
//
// installed on the dev page's MockBattle (src/ui/mock-battle.js) as ROUND-3 §4's Battle.enterWargame(id, { side }),
// Battle.restart({ side }), Battle.hop(kind), Battle.leave() and Battle.loadWargame(id) (the scenario: the real file
// when ?scenarios=data asks for it, else the fixtures below), with a scene that gives the projection
// (scene.hud.project(x, y, z) → [x, y]), scene.snapshot() (a 320 × 200 JPEG of the dev page's arena view: the
// "fake snapshots"), scene.shake(a) and scene.slowmo(s) (no-ops). The arena view is a 2D canvas of the arena from
// above, following the held unit; a click on it selects the nearest unit within 24 px (Battle.select, which
// link.js reads as a hop in a wargame). The box's own HUD (scene/hud.js) and, on a touch screen, the touch
// controls (controls/touch.js) are built from their real classes and filled with stand-in readings, so the
// page's layout is the one the box will have and the phone check measures them together.
//
//   ui.html?box=samar&wargame=samar&side=us        straight to the start sheet (the URL's #wargame=samar&side=us does the same)
//   ui.html?box=test-box&data=../test-data/        the fixtures' box (its fixture scenario below)
//   &scrub                                          a dev slider for the ten-minute clock; [ and ] step it 30 s
//   &seed=7                                         another game

import { MockBattle, stationsFor } from './mock-battle.js'
import { kitShort } from './roles.js'
import { Hud } from '../battle/scene/hud.js'
import { TouchControls } from '../battle/controls/touch.js'

const DURATION = 600
const HP = { cve: 10, cv: 18, cvl: 14, dd: 6, de: 6, ca: 14, cl: 14, bb: 30 }
const DMG = { bomb: 2, torpedo: 5, 'shell-18': 4, 'shell-16': 4, 'shell-14': 3, 'shell-8': 2, 'shell-5': 1 }
const HOP = { carrier: ['cv', 'cve', 'cvl'], capital: ['bb', 'ca', 'cl'], destroyer: ['dd', 'de'] }
const SIDE_KEY = { jp: 'japan', us: 'usa' }
const other = (s) => (s === 'jp' ? 'us' : 'jp')
const DEG = Math.PI / 180
const mmss = (s) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.floor(Math.max(0, s) % 60)).padStart(2, '0')}`

/** A small seeded generator (mulberry32). */
function rng(seed) {
  let a = typeof seed === 'number' ? seed >>> 0 : [...String(seed)].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0, 2166136261)
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// --- the fixtures: ROUND-3 §6's shape, for the boxes the dev page and the smoke test enter ------------------------
// (content-3 writes the real files under public/data/wargames/; these stand in until the merge, and they are
// plainly the mock's: the integrator reads the real ones)
export const FIXTURE_SCENARIOS = {
  samar: {
    id: 'samar',
    box: 'samar',
    title: 'Samar as a wargame',
    label: 'A wargame played with the real forces. The record is on the other side of the table.',
    arena: { centre: [126.0, 11.45], radiusM: 3000 },
    durationS: 600,
    sides: {
      japan: {
        name: 'Centre Force',
        first: 'yamato',
        bearingDeg: 345,
        guide: 'yamato',
        screenM: 1200,
        ships: ['yamato', 'nagato', 'kongo', 'haruna', 'tone', 'chikuma', 'kumano', 'suzuya', 'haguro', 'chokai', 'yahagi', 'noshiro', 'nowaki', 'urakaze', 'yukikaze', 'isokaze', 'shimakaze', 'hayashimo', 'akishimo', 'kishinami', 'okinami', 'hamanami', 'fujinami'],
        aircraft: [],
        goal: { kind: 'sink', type: 'cve', count: 4, text: 'Sink four of the six carriers before 10:00.' },
        phases: [
          { t: 0, title: 'Open fire', goal: { kind: 'hit', type: 'cve', count: 2, withinS: 90 }, text: 'Yamato has the range: put two shells into a carrier.' },
          { t: 90, title: 'Through the smoke', goal: { kind: 'hit', type: 'dd', count: 2, withinS: 100 }, text: 'The escorts are making smoke: hit two of the destroyers.' },
          { t: 200, title: 'The cruisers close', goal: { kind: 'hit', type: 'cve', count: 3, withinS: 120 }, text: 'Tone and Chikuma close from the east: three hits on the carriers.' },
          { t: 330, title: 'Under the aircraft', goal: { kind: 'shoot-down', type: 'aircraft', count: 4, withinS: 100 }, text: 'The Avengers are coming in: bring down four of them.' },
          { t: 450, title: 'The last run', goal: { kind: 'sink', type: 'cve', count: 2, withinS: 150 }, text: 'Sink two carriers before the clock runs out.' },
        ],
        admiral: { aggression: 0.7, turnAwayAt: 0.5, launchEveryS: null, waveGrowth: 0 },
      },
      usa: {
        name: 'Taffy 3',
        first: 'johnston',
        bearingDeg: 165,
        guide: 'fanshaw-bay',
        screenM: 1500,
        ships: ['fanshaw-bay', 'white-plains', 'kalinin-bay', 'kitkun-bay', 'st-lo', 'gambier-bay', 'johnston', 'hoel', 'heermann', 'samuel-b-roberts', 'raymond', 'dennis', 'john-c-butler'],
        aircraft: [
          { carrier: 'gambier-bay', kit: 'tbm-1c', count: 6, profile: 'torpedo' },
          { carrier: 'kitkun-bay', kit: 'fm-2', count: 6, profile: 'cap' },
          { carrier: 'fanshaw-bay', kit: 'tbm-1c', count: 4, profile: 'torpedo' },
          { carrier: 'white-plains', kit: 'fm-2', count: 4, profile: 'strafe' },
        ],
        goal: { kind: 'survive', type: 'cve', count: 4, text: 'Keep four of the six carriers afloat until 10:00.' },
        phases: [
          { t: 0, title: 'The destroyers go in', goal: { kind: 'hit', type: 'ca', count: 1, withinS: 90 }, text: 'Johnston turns toward the cruisers: put a torpedo into one.' },
          { t: 100, title: 'Launch everything', goal: { kind: 'hit', type: 'bb', count: 2, withinS: 120 }, text: 'The Avengers are off the decks: two hits on the battleships.' },
          { t: 240, title: 'Into the squall', goal: { kind: 'survive', type: 'cve', count: 5, withinS: 90 }, text: 'Hide the carriers in the rain: keep five afloat for ninety seconds.' },
          { t: 360, title: 'The second torpedo run', goal: { kind: 'hit', type: 'ca', count: 2, withinS: 120 }, text: 'Heermann and Roberts go in: two torpedoes into the cruisers.' },
          { t: 480, title: 'Hold on', goal: { kind: 'survive', type: 'cve', count: 4, withinS: 120 }, text: 'Keep four carriers afloat to the end.' },
        ],
        admiral: { aggression: 0.5, turnAwayAt: 0.4, launchEveryS: 75, waveGrowth: 0.3 },
      },
    },
    footnote: 'On 25 October 1944 Taffy 3 lost Gambier Bay, Hoel, Johnston and Samuel B. Roberts, and KURITA Takeo 栗田健男 turned away at 09:11.',
    sources: [],
  },
  // the fixtures' box (tools/fake-data.mjs): plainly test data
  'test-box': {
    id: 'test-box',
    box: 'test-box',
    title: 'The test box as a wargame',
    label: 'Test: a wargame played with the test forces. The record is on the other side of the table.',
    arena: { centre: [179.5, 28.0], radiusM: 3000 },
    durationS: 600,
    sides: {
      japan: {
        name: 'Test Japanese force',
        first: 'test-bb-a',
        bearingDeg: 0,
        guide: 'test-cv-a',
        screenM: 900,
        ships: ['test-cv-a', 'test-bb-a', 'test-dd-a'],
        aircraft: [{ carrier: 'test-cv-a', kit: 'test-fighter-jp', count: 4, profile: 'cap' }],
        goal: { kind: 'survive', type: 'cv', count: 1, text: 'Test: keep the test carrier afloat until 10:00.' },
        phases: [
          { t: 0, title: 'Test opening', goal: { kind: 'shoot-down', type: 'aircraft', count: 1, withinS: 120 }, text: 'Test: bring down one of the test aircraft.' },
          { t: 200, title: 'Test middle', goal: { kind: 'hit', type: 'bb', count: 2, withinS: 120 }, text: 'Test: two hits on the test battleship.' },
          { t: 400, title: 'Test end', goal: { kind: 'survive', type: 'cv', count: 1, withinS: 200 }, text: 'Test: keep the carrier afloat to the end.' },
        ],
        admiral: { aggression: 0.5, turnAwayAt: 0.4, launchEveryS: null, waveGrowth: 0 },
      },
      usa: {
        name: 'Test American force',
        first: 'test-dd-b',
        bearingDeg: 180,
        guide: 'test-cv-b',
        screenM: 900,
        ships: ['test-cv-b', 'test-bb-b', 'test-dd-b'],
        aircraft: [
          { carrier: 'test-cv-b', kit: 'test-dive-us', count: 6, profile: 'dive' },
          { carrier: 'test-cv-b', kit: 'test-torpedo-us', count: 4, profile: 'torpedo' },
        ],
        goal: { kind: 'sink', type: 'cv', count: 1, text: 'Test: sink the test carrier before 10:00.' },
        phases: [
          { t: 0, title: 'Test opening', goal: { kind: 'hit', type: 'dd', count: 1, withinS: 120 }, text: 'Test: one hit on the test destroyer.' },
          { t: 200, title: 'Test middle', goal: { kind: 'hit', type: 'cv', count: 2, withinS: 120 }, text: 'Test: two hits on the test carrier.' },
          { t: 400, title: 'Test end', goal: { kind: 'sink', type: 'cv', count: 1, withinS: 200 }, text: 'Test: sink the test carrier.' },
        ],
        admiral: { aggression: 0.6, turnAwayAt: 0.4, launchEveryS: 75, waveGrowth: 0.3 },
      },
    },
    footnote: 'Test: the record of the test box is made up, and so is this sentence.',
    sources: [],
  },
}

// --- the arena ------------------------------------------------------------------------------------------------

export class MockArena {
  constructor(scenario, battleFile, kits, { side = 'us', seed = 1 } = {}) {
    this.scenario = scenario
    this.side = side
    this.seed = seed
    this.durationS = scenario.durationS || DURATION
    this.shipKits = new Map((kits.ships || []).map((k) => [k.id, k]))
    this.airKits = new Map((kits.aircraft || []).map((k) => [k.id, k]))
    const raw = new Map((battleFile.units || []).map((u) => [u.id, u]))
    // the arena is drawn about its own centre, in metres (x east, z south): the box's world centre would add a constant
    this.clock = { duration: this.durationS, label: (t) => mmss(t), utc: () => 0, parse: (s) => Number(s) || 0, clamp: (t) => Math.max(0, Math.min(this.durationS, t)), dateLabel: () => '' }
    this.record = { sites: [], stops: [], moments: new Map(), groups: [], ships: [], shipById: new Map(), groupById: new Map() }
    this.u = []
    this.groups = new Map()
    for (const code of ['jp', 'us']) {
      const sd = scenario.sides[SIDE_KEY[code]]
      if (!sd) continue
      const ships = (sd.ships || []).map((id) => raw.get(id)).filter(Boolean)
      // the formation: carriers and battleships inside, cruisers about them, the destroyers on the screen
      const rings = { 0: [], 1: [], 2: [] }
      for (const r of ships) {
        const kit = this.shipKits.get(r.kit)
        const type = kit?.type || 'dd'
        const ring = ['cv', 'cve', 'cvl', 'bb'].includes(type) ? 0 : ['ca', 'cl'].includes(type) ? 1 : 2
        const u = { index: this.u.length, id: r.id, kind: 'ship', side: code, name: r.name || r.id, ja: r.ja || null, hull: r.hull || null, kit: r.kit, type, hpMax: HP[type] ?? 10, ring }
        u.hp = u.hpMax
        rings[ring].push(u)
        this.u.push(u)
      }
      for (const [ring, list] of Object.entries(rings)) {
        const rad = [0.32, 0.66, 1][ring] * (sd.screenM || 1200)
        list.forEach((u, i) => {
          const a = (i / Math.max(1, list.length)) * Math.PI * 2 + Number(ring) * 0.4
          u.off = u.id === sd.guide ? [0, 0] : [Math.cos(a) * rad, Math.sin(a) * rad * 0.7]
        })
      }
      // the aircraft on deck, a flight each
      ;(sd.aircraft || []).forEach((a, f) => {
        const kit = this.airKits.get(a.kit)
        const carrier = this.u.find((x) => x.id === a.carrier)
        const short = kitShort(kit, a.kit)
        const gid = `${a.carrier}:${a.kit}:${f}`
        const groupName = `${carrier?.name ?? a.carrier}’s ${short}s`
        this.groups.set(gid, { id: gid, name: groupName, short, profile: a.profile, carrier: carrier?.index ?? null, side: code, f })
        for (let k = 0; k < a.count; k++) {
          this.u.push({ index: this.u.length, id: `${gid}#${k + 1}`, kind: 'aircraft', side: code, name: groupName, ja: kit?.ja ?? null, kit: a.kit, type: kit?.type || 'fighter', group: gid, groupName, short, k, hpMax: 1, hp: 1, profile: a.profile, f })
        }
      })
      const guide = this.u.find((x) => x.id === sd.guide) || this.u.find((x) => x.side === code && x.kind === 'ship')
      const b = (sd.bearingDeg ?? (code === 'jp' ? 0 : 180)) * DEG
      this[`g_${code}`] = { x0: Math.sin(b) * 2500, z0: -Math.cos(b) * 2500, guide: guide?.index ?? -1, sd }
    }
    const n = this.u.length
    this.state = { pos: new Float64Array(3 * n), alive: new Uint8Array(n), heading: new Float64Array(n) }
    this.effects = { list: [] }
    this.beats = []
    this.capacityByKit = new Map()
    this.script = this.makeScript()
    this.reset()
  }

  /** The game's shots and losses, seeded: who fires (a side and a weapon), resolved against the state when it comes due. */
  makeScript() {
    const r = rng(`${this.scenario.id}:${this.seed}`)
    const out = []
    const hasAir = (code) => this.u.some((u) => u.side === code && u.kind === 'aircraft')
    // (the played side fires a little less, since the player's own shots come on top)
    const pj = this.side === 'jp' ? 0.33 : 0.5
    for (let t = 4 + r() * 4; t < this.durationS; t += 8 + r() * 6) {
      const side = r() < pj ? 'jp' : 'us'
      const roll = r()
      let weapon
      if (side === 'us' && hasAir('us') && roll < 0.45) weapon = r() < 0.5 ? 'torpedo' : 'bomb'
      else if (side === 'jp' && hasAir('jp') && roll < 0.2) weapon = 'bomb'
      else if (roll > 0.9 && t > 120) weapon = 'torpedo'
      else weapon = 'shell'
      out.push({ t, type: 'shot', side, weapon, r1: r(), r2: r(), r3: r() })
    }
    for (let t = 9 + r() * 6; t < this.durationS; t += 13 + r() * 10) out.push({ t, type: 'down', side: hasAir('jp') && r() < 0.35 ? 'us' : 'jp', r1: r() })
    for (let t = 15 + r() * 8; t < this.durationS; t += (this.side === 'jp' ? 34 : 24) + r() * 14) out.push({ t, type: 'player-shot', r1: r(), r2: r(), r3: r() })
    for (let t = 6 + r() * 4; t < this.durationS; t += 31 + r() * 9) out.push({ t, type: 'near-miss', side: r() < 0.5 ? 'jp' : 'us', r1: r() })
    out.push({ t: 212, type: 'player-loss' })
    return out.sort((a, b) => a.t - b.t)
  }

  reset() {
    this.t = 0
    this.si = 0
    this.events = []
    this.highlights = []
    this.result = null
    this.shake = 0
    this.slowmo = 0
    this.tally = { jp: { sunk: 0, downed: 0 }, us: { sunk: 0, downed: 0 }, player: { hits: 0, sunk: 0, downed: 0, lost: 0 } }
    this.counts = { jp: [], us: [] } // the side's deeds, for the phases: { t, kind: 'hit' | 'sink' | 'shoot-down', type }
    this.pending = [] // { t, fn } (sinkings completing, a respawn)
    this.eid = 0
    for (const u of this.u) {
      u.hp = u.hpMax
      u.alive = 1
      u.sinkAt = null
      u.downAt = null
      u.lastBy = null
    }
    const first = this.scenario.sides[SIDE_KEY[this.side]]?.first
    const fu = this.u.find((u) => u.id === first && u.side === this.side) || this.u.find((u) => u.side === this.side && u.kind === 'ship')
    this.player = null
    this.sortie = null
    if (fu) this.possess(fu, { quiet: true })
    this.place(0)
    this.score()
  }

  /** The dev page's scrub: the game from its start to t, the held unit kept where it is still afloat. */
  seek(t) {
    const held = this.player?.unitIndex
    this.reset()
    if (held != null && this.u[held] && this.u[held].side === this.side) this.possess(this.u[held], { quiet: true })
    const target = Math.max(0, Math.min(this.durationS, t))
    this.seeking = true
    while (this.t < target - 1e-6 && !this.result) this.advance(Math.min(0.5, target - this.t))
    this.seeking = false
    this.place(this.t)
  }

  // --- ROUND-2's surface where the UI touches it ---

  units() {
    const me = this.side
    return this.u.map((u) => {
      const alive = u.alive
      const enemy = u.side !== me
      const reason = enemy ? 'the other side' : alive === 0 ? (u.kind === 'aircraft' ? 'did not return' : 'sunk') : alive === 2 ? 'sinking' : true
      return {
        index: u.index,
        id: u.id,
        kind: u.kind,
        side: u.side,
        name: u.name,
        ja: u.ja,
        hull: u.hull,
        kit: u.kit,
        type: u.type,
        group: u.group ?? null,
        groupName: u.groupName ?? null,
        k: u.k ?? null,
        alive,
        takeable: reason,
        enemy,
        stations: this.stationsOf(u),
        now: this.nowLine(u),
        next: '',
        hp: u.hp / u.hpMax,
        state: u.kind === 'ship' ? { sunk: alive === 0, sinking: alive === 2, onFire: u.hp < u.hpMax / 2 && alive === 1, listing: u.hp < u.hpMax / 4 && alive === 1, listDeg: 9 } : { airborne: alive === 1, altM: this.state.pos[3 * u.index + 1] },
      }
    })
  }

  stationsOf(u) {
    const kit = u.kind === 'ship' ? this.shipKits.get(u.kit) : this.airKits.get(u.kit)
    return stationsFor(kit, u.kind)
  }

  nowLine(u) {
    if (u.alive === 0) return u.kind === 'aircraft' ? 'did not return' : 'sunk'
    if (u.alive === 2) return 'sinking'
    if (u.kind === 'aircraft') return { cap: 'on patrol over the force', torpedo: 'on a torpedo run', dive: 'on a dive-bombing run', strafe: 'strafing' }[u.profile] ?? 'airborne'
    const h = Math.round(((this.state.heading[u.index] / DEG) % 360 + 360) % 360)
    return `steaming ${String(h).padStart(3, '0')}°${u.hp < u.hpMax / 2 ? ', on fire' : ''}`
  }

  positions() {
    return this.u.map((u) => ({ index: u.index, kind: u.kind, side: u.side, x: this.state.pos[3 * u.index], z: this.state.pos[3 * u.index + 2], h: this.state.heading[u.index] / DEG, sunk: u.alive === 0 }))
  }

  takeControl(role) {
    const u = role.unit != null ? this.u.find((x) => x.id === role.unit) : role.index != null && role.group ? this.u.find((x) => x.group === role.group && x.k === role.index) : role.group ? this.u.find((x) => x.group === role.group && x.alive === 1) : this.u[role]
    if (!u) throw new Error(`no unit for ${JSON.stringify(role)}`)
    if (u.side !== this.side) throw new Error('the other side')
    if (u.alive !== 1) throw new Error(u.kind === 'aircraft' ? 'did not return' : 'sunk')
    return this.possess(u, { station: role.station })
  }

  setStation(name) {
    if (!this.player) return null
    if (!this.player.stations.includes(name)) throw new Error(`no ${name} station`)
    this.player.station = name
    return name
  }

  releaseControl() {
    // (a wargame is always held: the UI never offers this; kept for the surface)
    return null
  }

  possess(u, { station = null, quiet = false } = {}) {
    const from = this.player?.unitIndex ?? null
    const stations = this.stationsOf(u)
    const keep = this.player && this.player.kind === u.kind && stations.includes(this.player.station) ? this.player.station : null
    this.player = { kind: u.kind, unitIndex: u.index, station: station && stations.includes(station) ? station : keep || stations[0], stations, scripted: false, input: {}, state: {} }
    this.sortie = { span: [this.t, null], unit: u.index, stations: [this.player.station], hits: [], releases: [], damageTaken: 0, survived: true, divergedDuring: [] }
    if (!quiet) this.push({ kind: 'hop', from, to: u.index, target: u.index, text: '' })
    return this.player
  }

  /** ROUND-3 §1: Tab (the next friendly unit of the same kind), 1–4 (the nearest carrier, capital ship, destroyer, aircraft), or a unit's index. */
  hop(kind) {
    const me = this.player ? this.u[this.player.unitIndex] : null
    const ok = (u) => u.side === this.side && u.alive === 1
    const at = (u) => [this.state.pos[3 * u.index], this.state.pos[3 * u.index + 2]]
    const near = (list) => {
      if (!me) return list[0]
      const [x0, z0] = at(me)
      return list.filter((u) => u !== me).sort((a, b) => Math.hypot(...at(a).map((v, i) => v - [x0, z0][i])) - Math.hypot(...at(b).map((v, i) => v - [x0, z0][i])))[0]
    }
    let to = null
    if (typeof kind === 'number') to = this.u[kind] && ok(this.u[kind]) ? this.u[kind] : null
    else if (kind === 'next') {
      const same = (u) => (me?.kind === 'aircraft' ? u.kind === 'aircraft' : u.kind === 'ship' && hopClass(u.type) === hopClass(me?.type))
      const list = this.u.filter((u) => ok(u) && same(u))
      const i = list.indexOf(me)
      to = list.length ? list[(i + 1) % list.length] : null
      if (to === me) to = null
    } else if (kind === 'aircraft') to = near(this.u.filter((u) => ok(u) && u.kind === 'aircraft'))
    else if (HOP[kind]) to = near(this.u.filter((u) => ok(u) && u.kind === 'ship' && HOP[kind].includes(u.type)))
    if (!to) return null
    return this.possess(to)
  }

  // --- the clock ---

  advance(dt) {
    if (this.result) return
    const t1 = Math.min(this.durationS, this.t + Math.max(0, dt))
    // the script and the pending ends, in time order
    for (;;) {
      const s = this.script[this.si]
      this.pending.sort((a, b) => a.t - b.t)
      const p = this.pending[0]
      const ts = s && s.t <= t1 ? s.t : Infinity
      const tp = p && p.t <= t1 ? p.t : Infinity
      if (ts === Infinity && tp === Infinity) break
      if (tp <= ts) {
        this.pending.shift()
        this.t = tp
        p.fn()
      } else {
        this.si++
        this.t = ts
        this.play(s)
      }
      this.score()
      if (this.result) break
    }
    if (!this.result) this.t = t1
    this.place(this.t)
    this.score()
    this.shake = Math.max(0, this.shake - dt * 2)
    this.slowmo = Math.max(0, this.slowmo - dt)
  }

  push(e) {
    const ev = { id: ++this.eid, t: this.t, mine: false, ...e }
    this.events.push(ev)
    return ev
  }

  highlight(kind, unit, text, mine) {
    const h = { id: this.highlights.length + 1, t: this.t, kind, mine, unit, text }
    // (a scrub plays many highlights in one frame: their stills are taken as they come, as the engine's scene would)
    if (this.seeking && this.snap) h.image = this.snap(h)
    this.highlights.push(h)
  }

  /** One scripted entry, resolved against the state now. */
  play(s) {
    const alive = (code, f) => this.u.filter((u) => u.side === code && u.alive === 1 && f(u))
    const pick = (list, r) => list[Math.min(list.length - 1, Math.floor(r * list.length))]
    if (s.type === 'shot' || s.type === 'player-shot') {
      let by
      let weapon = s.weapon
      let side = s.side
      if (s.type === 'player-shot') {
        by = this.player ? this.u[this.player.unitIndex] : null
        if (!by || by.alive !== 1) return
        side = by.side
        if (by.kind === 'aircraft') {
          if (by.type === 'fighter') return this.down(other(side), by, s.r1, true)
          weapon = by.type === 'torpedo' ? 'torpedo' : 'bomb'
        } else weapon = this.player.station === 'torpedoes' ? 'torpedo' : 'shell'
      } else {
        const shooters = alive(side, (u) => (weapon === 'shell' ? u.kind === 'ship' : weapon === 'torpedo' ? (u.kind === 'aircraft' && u.type === 'torpedo') || ['dd', 'de', 'ca', 'cl'].includes(u.type) : u.kind === 'aircraft' && u.type !== 'fighter'))
        by = pick(shooters, s.r1)
        if (!by) return
      }
      // the target: a ship of the other side afloat (a sinking ship registers nothing), the goal's type first, the damaged first
      const want = side === 'jp' ? ['cve', 'cv', 'cvl'] : ['ca', 'bb', 'cv']
      const afloat = alive(other(side), (u) => u.kind === 'ship')
      if (!afloat.length) return
      const pref = afloat.filter((u) => want.includes(u.type))
      const pool = pref.length && s.r2 < 0.6 ? pref : afloat
      const target = s.r3 < 0.5 ? pool.slice().sort((a, b) => a.hp / a.hpMax - b.hp / b.hpMax)[0] : pick(pool, s.r3 * 2 - 1 > 0 ? s.r3 * 2 - 1 : s.r3)
      const cal = by.kind === 'ship' ? ({ bb: by.kit === 'yamato' ? 'shell-18' : by.kit === 'kongo' ? 'shell-14' : 'shell-16', ca: 'shell-8' }[by.type] ?? 'shell-5') : null
      const dmg = weapon === 'shell' ? DMG[cal] : DMG[weapon]
      this.hit(target, by, weapon, dmg, s.type === 'player-shot', s.r2)
    } else if (s.type === 'down') {
      const by = this.u.find((u) => u.side === s.side && u.alive === 1 && u.kind === 'ship')
      this.down(other(s.side), by, s.r1, false)
    } else if (s.type === 'near-miss') {
      const list = alive(other(s.side), (u) => u.kind === 'ship')
      const target = this.player && this.u[this.player.unitIndex]?.kind === 'ship' && s.r1 < 0.4 && s.side !== this.side ? this.u[this.player.unitIndex] : pick(list, s.r1)
      if (!target) return
      this.push({ kind: 'near-miss', target: target.index, text: `${target.name}: near miss` })
      if (target.index === this.player?.unitIndex) this.shake = Math.max(this.shake, 0.4)
    } else if (s.type === 'player-loss') {
      const me = this.player ? this.u[this.player.unitIndex] : null
      if (!me || me.alive !== 1) return
      if (me.kind === 'aircraft') {
        const by = this.u.find((u) => u.side !== me.side && u.alive === 1 && u.kind === 'ship')
        this.down(me.side, by, 0, false, me)
      } else {
        const by = this.u.find((u) => u.side !== me.side && u.alive === 1 && u.type === 'bb')
        this.hit(me, by, 'shell', me.hp, false, 0.3)
      }
    }
  }

  /** A hit on a ship: its words, the damage, fire under half, listing under a quarter, sinking at zero over twenty seconds. */
  hit(target, by, weapon, dmg, mine, r) {
    if (!target || target.alive !== 1) return
    const where = weapon === 'torpedo' ? (r < 0.5 ? 'amidships' : 'aft') : weapon === 'bomb' && ['cve', 'cv', 'cvl'].includes(target.type) ? 'on the flight deck' : ['forward', 'amidships', 'aft'][Math.floor(r * 3) % 3]
    target.hp = Math.max(0, target.hp - dmg)
    target.lastBy = by?.side ?? null
    const state = target.hp <= 0 ? '' : target.hp < target.hpMax / 4 ? ', listing' : target.hp < target.hpMax / 2 ? ', fire' : ''
    const what = weapon === 'torpedo' ? 'torpedo hit' : weapon === 'bomb' ? 'bomb hit' : 'hit'
    const ev = this.push({ kind: 'hit', target: target.index, by: by?.index ?? null, mine, weapon, text: `${target.name}: ${what} ${where}${state}` })
    if (by) this.counts[by.side].push({ t: this.t, kind: 'hit', type: target.type })
    if (mine) {
      this.tally.player.hits++
      this.sortie?.hits.push({ name: target.name, kind: weapon === 'torpedo' ? 'torpedo-hit' : weapon === 'bomb' ? 'bomb-hit' : 'gun-hit', count: 1, where })
      this.highlight('hit', target.index, ev.text, true)
      // a second of slow motion on the player's torpedo hit or bomb on a carrier (the scene's; a no-op here)
      if (weapon === 'torpedo' || (weapon === 'bomb' && ['cve', 'cv', 'cvl'].includes(target.type))) this.slowmo = 1
    }
    if (target.index === this.player?.unitIndex) {
      this.shake = Math.max(this.shake, 0.8)
      if (this.sortie) this.sortie.damageTaken = 1 - target.hp / target.hpMax
    }
    if (target.hp <= 0) this.sink(target, by, mine)
  }

  sink(target, by, mine) {
    target.alive = 2
    target.sinkAt = this.t
    const side = by?.side ?? other(target.side)
    this.tally[side].sunk++
    if (mine) this.tally.player.sunk++
    this.counts[side].push({ t: this.t, kind: 'sink', type: target.type })
    this.push({ kind: 'sinking', target: target.index, by: by?.index ?? null, mine, text: `${target.name}: sinking` })
    this.highlight('sunk', target.index, `${target.name} sinks`, mine)
    const mineNow = target.index === this.player?.unitIndex
    if (mineNow) {
      // the held ship is lost: the nearest friendly ship is yours at once (ROUND-3 §1)
      this.tally.player.lost++
      this.highlight('lost', target.index, `${target.name} is lost`, true)
      if (this.sortie) this.sortie.survived = false
      const next = this.nearestFriendly(target, (u) => u.kind === 'ship')
      if (next) {
        this.possess(next, { quiet: true })
        this.push({ kind: 'respawn', from: target.index, to: next.index, target: next.index, mine: true, text: `${target.name} is sinking. ${next.name} is yours.` })
      }
    }
    this.pending.push({
      t: this.t + 20,
      fn: () => {
        target.alive = 0
        this.push({ kind: 'sunk', target: target.index, text: `${target.name}: sunk` })
      },
    })
  }

  /** An aircraft of `code` shot down (by a ship's guns or a fighter); `victim` names one (the player's). */
  down(code, by, r, mine, victim = null) {
    const list = this.u.filter((u) => u.side === code && u.kind === 'aircraft' && u.alive === 1 && u.index !== (victim ? -1 : this.player?.unitIndex))
    const a = victim || list[Math.min(list.length - 1, Math.floor(r * list.length))]
    if (!a) return
    a.alive = 0
    a.downAt = this.t
    const side = by?.side ?? other(code)
    this.tally[side].downed++
    if (mine) this.tally.player.downed++
    this.counts[side].push({ t: this.t, kind: 'shoot-down', type: 'aircraft' })
    const ev = this.push({ kind: 'downed', target: a.index, by: by?.index ?? null, mine, text: `${a.short}: shot down` })
    if (mine) {
      this.sortie?.hits.push({ name: a.groupName, kind: 'aircraft', count: 1 })
      this.highlight('downed', a.index, ev.text, true)
    }
    if (a.index === this.player?.unitIndex) {
      // the held aircraft did not return: the next one of the flight is yours two seconds later (ROUND-3 §1)
      this.tally.player.lost++
      this.push({ kind: 'lost', target: a.index, mine: true, text: `Your ${a.short} did not return` })
      this.highlight('lost', a.index, `Your ${a.short} did not return`, true)
      if (this.sortie) this.sortie.survived = false
      const lost = a
      this.pending.push({
        t: this.t + 2,
        fn: () => {
          const next = this.u.find((u) => u.group === lost.group && u.alive === 1) || this.nearestFriendly(lost, (u) => u.kind === 'aircraft') || this.nearestFriendly(lost, () => true)
          if (!next) return
          this.possess(next, { quiet: true })
          this.push({ kind: 'respawn', from: lost.index, to: next.index, target: next.index, mine: true, text: `Your ${lost.short} did not return. ${next.group === lost.group ? 'The next one is yours.' : `${next.kind === 'aircraft' ? `${/^[AEIOU]/.test(next.short) ? 'An' : 'A'} ${next.short} from ${next.groupName.replace(/’s .*$/, '')}` : next.name} is yours.`}` })
        },
      })
    }
  }

  nearestFriendly(from, f) {
    const [x0, z0] = [this.state.pos[3 * from.index], this.state.pos[3 * from.index + 2]]
    let best = null
    let bd = Infinity
    for (const u of this.u) {
      if (u === from || u.side !== from.side || u.alive !== 1 || !f(u)) continue
      const d = Math.hypot(this.state.pos[3 * u.index] - x0, this.state.pos[3 * u.index + 2] - z0)
      if (d < bd) [best, bd] = [u, d]
    }
    return best
  }

  // --- where everything is at t (closed form: the formations close and zigzag; the aircraft orbit and run in) ---

  place(t) {
    const P = this.state.pos
    const guides = {}
    for (const code of ['jp', 'us']) {
      const g = this[`g_${code}`]
      if (!g) continue
      const o = this[`g_${other(code)}`] ?? { x0: -g.x0, z0: -g.z0 }
      const dx = o.x0 - g.x0
      const dz = o.z0 - g.z0
      const d = Math.hypot(dx, dz) || 1
      // closing at 2 m/s each until 3.6 km apart, then a slow turn together; a zigzag across the course
      const close = Math.min(t * 2, Math.max(0, (d - 3600) / 2))
      const ux = dx / d
      const uz = dz / d
      const zig = Math.sin(t / 22 + (code === 'jp' ? 0 : 1.7)) * 160
      const gx = g.x0 + ux * close - uz * zig
      const gz = g.z0 + uz * close + ux * zig
      const head = Math.atan2(ux, -uz) + Math.cos(t / 22) * 0.35
      guides[code] = { x: gx, z: gz, head }
    }
    for (const u of this.u) {
      const i = u.index
      const g = guides[u.side]
      if (!g) continue
      if (u.kind === 'ship') {
        if (u.alive === 2 || u.alive === 0) {
          // (a sinking ship stops where she was hit)
          if (u.frozen) {
            P[3 * i] = u.frozen[0]
            P[3 * i + 2] = u.frozen[1]
          } else u.frozen = [P[3 * i], P[3 * i + 2]]
          P[3 * i + 1] = u.alive === 2 ? -Math.min(1, (t - u.sinkAt) / 20) * 8 : -20
          this.state.alive[i] = u.alive
          continue
        }
        u.frozen = null
        const c = Math.cos(g.head)
        const s = Math.sin(g.head)
        const [ox, oz] = u.off || [0, 0]
        P[3 * i] = g.x + ox * c - oz * s
        P[3 * i + 1] = 0
        P[3 * i + 2] = g.z + ox * s + oz * c
        this.state.heading[i] = g.head
      } else {
        const carrier = this.groups.get(u.group)?.carrier
        const cx = carrier != null ? P[3 * carrier] : g.x
        const cz = carrier != null ? P[3 * carrier + 2] : g.z
        const o = guides[other(u.side)] || { x: -g.x, z: -g.z }
        const launch = 10 + u.f * 25 + u.k * 3
        if (u.alive === 0) {
          P[3 * i + 1] = -50
          this.state.alive[i] = 0
          continue
        }
        if (t < launch) {
          P[3 * i] = cx + u.k * 8
          P[3 * i + 1] = 18
          P[3 * i + 2] = cz
          this.state.heading[i] = g.head
        } else if (u.profile === 'cap') {
          const a = (t - launch) / 70 * Math.PI * 2 + u.k * 0.9
          P[3 * i] = g.x + Math.cos(a) * 1300
          P[3 * i + 1] = 1200 + u.k * 40
          P[3 * i + 2] = g.z + Math.sin(a) * 1300
          this.state.heading[i] = a + Math.PI / 2
        } else {
          // a run: out from the carrier to the other side's force and back, a loop of 140 s
          const ph = ((t - launch) / 140 + u.k * 0.04) % 1
          const w = ph < 0.5 ? ph * 2 : 2 - ph * 2
          const side = Math.sin(ph * Math.PI * 2) * 500 * (u.k % 2 ? 1 : -1)
          const dx = o.x - cx
          const dz = o.z - cz
          const d = Math.hypot(dx, dz) || 1
          P[3 * i] = cx + dx * w - (dz / d) * side
          P[3 * i + 1] = u.profile === 'torpedo' ? 300 - 260 * Math.sin(w * Math.PI) ** 8 : 1500 - 900 * Math.sin(w * Math.PI) ** 6
          P[3 * i + 2] = cz + dz * w + (dx / d) * side
          this.state.heading[i] = Math.atan2(dx, -dz) + (ph < 0.5 ? 0 : Math.PI)
        }
      }
      this.state.alive[i] = u.alive
    }
  }

  // --- the goals, the phases, the strength, the result ---

  score() {
    const typeOk = (want, type) => want === 'ship' || want === type || (want === 'aircraft' && type === 'aircraft')
    const afloat = (code, type) => this.u.filter((u) => u.side === code && u.kind === 'ship' && u.alive === 1 && typeOk(type, u.type)).length
    const all = (code, type) => this.u.filter((u) => u.side === code && (type === 'aircraft' ? u.kind === 'aircraft' : u.kind === 'ship' && typeOk(type, u.type))).length
    const deeds = (code, kind, type, from = 0, to = Infinity) => this.counts[code].filter((c) => c.kind === kind && c.t >= from && c.t <= to && typeOk(type, c.type)).length
    const end = this.t >= this.durationS - 1e-6
    this.objective = {}
    this.phase = {}
    this.strength = {}
    for (const code of ['jp', 'us']) {
      const sd = this.scenario.sides[SIDE_KEY[code]]
      if (!sd) continue
      const g = sd.goal || {}
      const o = { ...g, done: 0, of: 0, status: 'open' }
      if (g.kind === 'survive') {
        o.done = afloat(code, g.type)
        o.of = all(code, g.type)
        o.status = o.done < g.count ? 'failed' : end ? 'met' : 'open'
      } else {
        const kind = g.kind === 'sink' ? 'sink' : g.kind === 'shoot-down' ? 'shoot-down' : 'hit'
        o.done = deeds(code, kind, g.type)
        o.of = g.count
        o.status = o.done >= g.count ? 'met' : end ? 'failed' : 'open'
      }
      this.objective[code] = o
      // the phase: the last one begun, its count since it began, its timer
      const ps = sd.phases || []
      let k = -1
      ps.forEach((p, i) => {
        if (p.t <= this.t + 1e-6) k = i
      })
      if (k < 0) this.phase[code] = null
      else {
        const p = ps[k]
        const pg = p.goal || {}
        const within = pg.withinS ?? 90
        const left = Math.max(0, p.t + within - this.t)
        let done
        let status
        if (pg.kind === 'survive') {
          done = afloat(code, pg.type)
          status = done < pg.count ? 'failed' : left <= 0 ? 'met' : 'open'
        } else {
          const kind = pg.kind === 'sink' ? 'sink' : pg.kind === 'shoot-down' ? 'shoot-down' : 'hit'
          done = deeds(code, kind, pg.type, p.t, p.t + within)
          status = done >= pg.count ? 'met' : left <= 0 ? 'failed' : 'open'
        }
        this.phase[code] = { index: k, of: ps.length, t: p.t, title: p.title, text: p.text, goal: pg, done, count: pg.count, leftS: left, status }
      }
      // the strength: what is left of the ships' hit points, and a little of the aircraft
      const ships = this.u.filter((u) => u.side === code && u.kind === 'ship')
      const air = this.u.filter((u) => u.side === code && u.kind === 'aircraft')
      const hp = ships.reduce((s, u) => s + (u.alive === 1 ? u.hp : 0), 0) / Math.max(1, ships.reduce((s, u) => s + u.hpMax, 0))
      const ap = air.length ? air.filter((u) => u.alive === 1).length / air.length : 1
      this.strength[code] = air.length ? hp * 0.85 + ap * 0.15 : hp
    }
    if (!this.result) {
      // the end: a side's goal met (a survive goal failing does not end it: the other side plays on for its own), or the clock
      const o = this.objective
      const decided = ['jp', 'us'].find((c) => o[c]?.status === 'met' && o[c].kind !== 'survive')
      if (decided || end) {
        const met = { jp: o.jp?.status === 'met', us: o.us?.status === 'met' }
        // (a survive goal still open when the other side's goal is met has failed)
        for (const c of ['jp', 'us']) if (decided && o[c]?.kind === 'survive' && o[c].status !== 'failed') met[c] = false
        this.result = { t: this.t, reason: decided ? 'goal' : 'clock', met, by: decided ?? null }
        this.push({ kind: 'end', text: '' })
      }
    }
  }
}

const hopClass = (type) => Object.keys(HOP).find((k) => HOP[k].includes(type)) ?? 'destroyer'

// --- the dev page: the arena's view, and the wargame installed on the mock Battle -----------------------------

/** The arena from above, the camera between the held unit and the arena's middle, 9 km across the shorter side. */
class ArenaView {
  constructor() {
    this.canvas = document.getElementById('arena')
    this.ctx = this.canvas.getContext('2d')
    this.cx = 0
    this.cz = 0
    this.pts = []
  }

  get scale() {
    return Math.min(innerWidth, innerHeight) / 9000
  }

  toScreen(x, z) {
    const s = this.scale
    return [innerWidth / 2 + (x - this.cx) * s, innerHeight / 2 + (z - this.cz) * s]
  }

  draw(arena) {
    const c = this.canvas
    const dpr = Math.min(2, devicePixelRatio || 1)
    if (c.width !== Math.round(innerWidth * dpr) || c.height !== Math.round(innerHeight * dpr)) {
      c.width = Math.round(innerWidth * dpr)
      c.height = Math.round(innerHeight * dpr)
    }
    const P = arena.state.pos
    const me = arena.player?.unitIndex
    // the camera eases toward a point between the held unit and the other side's guide, set down a little so the
    // HUD block at the top hides neither fleet
    if (me != null) {
      const g = arena[`g_${arena.side === 'jp' ? 'us' : 'jp'}`]
      const gi = g?.guide ?? -1
      const ox = gi >= 0 ? P[3 * gi] : 0
      const oz = gi >= 0 ? P[3 * gi + 2] : 0
      const up = (innerHeight * 0.12) / this.scale
      this.cx += ((P[3 * me] + ox) / 2 - this.cx) * 0.15
      this.cz += ((P[3 * me + 2] + oz) / 2 - up - this.cz) * 0.15
    }
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    this.pts = this.paint(this.ctx, innerWidth, innerHeight, this.cx, this.cz, this.scale, arena)
  }

  /** The arena into ctx (w × h CSS px) about (cx, cz) at s px a metre; the live units' screen points come back. */
  paint(ctx, w, h, cx, cz, s, arena, { focus = null } = {}) {
    const P = arena.state.pos
    const me = arena.player?.unitIndex
    const at = (x, z) => [w / 2 + (x - cx) * s, h / 2 + (z - cz) * s]
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7)
    g.addColorStop(0, '#173a52')
    g.addColorStop(1, '#0a1c2a')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = 'rgba(238,242,241,0.06)'
    ctx.lineWidth = 1
    for (let k = -10; k <= 10; k++) {
      const [x] = at(k * 1000, 0)
      const [, y] = at(0, k * 1000)
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, h)
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }
    const [ox, oz] = at(0, 0)
    ctx.strokeStyle = 'rgba(220,196,154,0.25)'
    ctx.setLineDash([6, 6])
    ctx.beginPath()
    ctx.arc(ox, oz, (arena.scenario.arena?.radiusM ?? 3000) * s, 0, Math.PI * 2)
    ctx.stroke()
    ctx.setLineDash([])
    const col = (side, a) => (side === 'jp' ? `rgba(214,96,82,${a})` : `rgba(160,196,230,${a})`)
    const pts = []
    for (const u of arena.u) {
      const i = u.index
      if (u.alive === 0 && u.kind === 'aircraft') continue
      const [sx, sy] = at(P[3 * i], P[3 * i + 2])
      if (sx < -40 || sy < -40 || sx > w + 40 || sy > h + 40) continue
      if (u.alive === 1) pts.push({ index: i, sx, sy })
      ctx.save()
      ctx.translate(sx, sy)
      ctx.rotate(arena.state.heading[i])
      if (u.kind === 'ship') {
        const L = Math.max(7, (u.type === 'bb' ? 260 : u.type === 'ca' || u.type === 'cl' ? 190 : u.type.startsWith('cv') ? 160 : 110) * s)
        const W = L * 0.16
        const a = u.alive === 1 ? 0.95 : u.alive === 2 ? 0.55 - 0.4 * Math.min(1, (arena.t - u.sinkAt) / 20) : 0.12
        if (u.alive === 1) {
          ctx.strokeStyle = 'rgba(238,242,241,0.18)'
          ctx.lineWidth = W * 0.8
          ctx.beginPath()
          ctx.moveTo(0, L / 2)
          ctx.lineTo(0, L * 1.6)
          ctx.stroke()
        }
        ctx.fillStyle = col(u.side, a)
        ctx.beginPath()
        ctx.moveTo(0, -L / 2)
        ctx.lineTo(W, -L / 4)
        ctx.lineTo(W, L / 2)
        ctx.lineTo(-W, L / 2)
        ctx.lineTo(-W, -L / 4)
        ctx.closePath()
        ctx.fill()
        if (u.alive !== 0 && u.hp < u.hpMax / 2) {
          // fire, and smoke for a ship going down
          ctx.fillStyle = u.alive === 2 ? 'rgba(160,160,150,0.55)' : 'rgba(255,170,90,0.85)'
          ctx.beginPath()
          ctx.arc(0, 0, W * (u.alive === 2 ? 2.2 : 0.9), 0, Math.PI * 2)
          ctx.fill()
        }
      } else {
        const k = Math.max(1, Math.min(1.8, s / 0.09))
        ctx.fillStyle = col(u.side, 0.95)
        ctx.beginPath()
        ctx.moveTo(0, -5 * k)
        ctx.lineTo(3.6 * k, 3.5 * k)
        ctx.lineTo(-3.6 * k, 3.5 * k)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()
      if (i === me || i === focus) {
        ctx.strokeStyle = i === me ? '#e9d6b3' : 'rgba(246,227,160,0.9)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(sx, sy, i === me ? 16 : 24, 0, Math.PI * 2)
        ctx.stroke()
      }
    }
    // the tracer of the last few hits
    for (const e of arena.events.slice(-12)) {
      if (e.kind !== 'hit' || e.by == null || arena.t - e.t > 1.2) continue
      const [ax, ay] = at(P[3 * e.by], P[3 * e.by + 2])
      const [bx, by] = at(P[3 * e.target], P[3 * e.target + 2])
      ctx.strokeStyle = `rgba(246,227,160,${0.7 * (1 - (arena.t - e.t) / 1.2)})`
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(ax, ay)
      ctx.lineTo(bx, by)
      ctx.stroke()
    }
    return pts
  }

  pick(cx, cy) {
    let best = null
    let bd = 24 * 24
    for (const p of this.pts) {
      const d2 = (p.sx - cx) ** 2 + (p.sy - cy) ** 2
      if (d2 < bd) [best, bd] = [p.index, d2]
    }
    return best
  }

  /** A 320 × 200 JPEG about the latest highlight's unit, 2.4 km across (the "fake snapshot"). */
  snapshot(arena, hl = arena.highlights[arena.highlights.length - 1]) {
    const out = document.createElement('canvas')
    out.width = 320
    out.height = 200

    const i = hl?.unit ?? arena.player?.unitIndex ?? 0
    const P = arena.state.pos
    this.paint(out.getContext('2d'), 320, 200, P[3 * i], P[3 * i + 2], 320 / 2400, arena, { focus: i })
    return out.toDataURL('image/jpeg', 0.78)
  }
}

/** ROUND-3 §4's Battle.enterWargame, restart({ side }), hop and leave on the mock Battle, and loadWargame (the scenario). */
function install() {
  const proto = MockBattle.prototype
  const q = new URLSearchParams(location.search)
  const seed = q.get('seed') ?? 1

  proto.loadWargame = async function (id) {
    this.calls.push(['loadWargame', id])
    if (q.get('scenarios') === 'data') {
      const r = await fetch(this.app.data.abs(`wargames/${id}.json`))
      if (r.ok) return r.json()
    }
    const s = FIXTURE_SCENARIOS[id]
    if (!s) throw new Error(`no wargame “${id}” in the mock’s fixtures`)
    return structuredClone(s)
  }

  proto.enterWargame = async function (id, { side = 'us' } = {}) {
    this.calls.push(['enterWargame', id, side])
    const scenario = await this.loadWargame(id)
    if (this.loaded?.box.id !== scenario.box) await this.enter(scenario.box, { from: 'url' })
    if (this._held) this.release({ quiet: true })
    this._recordSim ??= this.sim
    this.arena = new MockArena(scenario, this.loaded.battle, this.loaded.kits, { side, seed })
    this.arena.snap = (h) => this.view?.snapshot(this.arena, h)
    this.sim = this.arena
    this.wargame = { id, side, scenario }
    this.input = { mock: true, wargame: true }
    this.timeScale = 1
    this.running = true
    this._selected = null
    document.body.classList.add('wargame')
    this.view ||= new ArenaView()
    this.wgScene()
    this.app.setMode?.('moment')
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'wargame', id, side } }))
    return this.state
  }

  /** The scene a wargame has: the projection, the snapshot, shake and slow motion (no-ops), and the box's HUD and touch controls as stand-ins. */
  proto.wgScene = function () {
    const battle = this
    const view = this.view
    const hudBox = { sim: null, camera: null, battle }
    if (!this.hud) this.hud = new Hud(hudBox)
    this.hud.project = (x, y, z) => view.toScreen(x, z)
    this.scene = {
      mock: true,
      wargame: true,
      hud: this.hud,
      setCamera() {},
      snapshot: () => (battle.arena ? view.snapshot(battle.arena) : null),
      shake(a) {
        battle.calls.push(['shake', a])
      },
      slowmo(s) {
        battle.calls.push(['slowmo', s])
      },
    }
    this.app.active = this.scene
    this.standIns(true)
  }

  /** The box's own HUD and touch controls, filled with plausible readings for the held unit (they are the engine's; here they stand in). */
  proto.standIns = function (force = false) {
    const a = this.arena
    if (!a || !this.hud) return
    const hud = this.hud
    const pl = a.player
    const u = pl ? a.u[pl.unitIndex] : null
    const key = `${pl?.unitIndex}:${pl?.station}`
    const now = performance.now()
    if (!force && key === this._standKey && now - (this._standAt || 0) < 1000) return
    this._standKey = key
    this._standAt = now
    hud.clockB.textContent = mmss(a.t)
    hud.clockS.textContent = a.scenario.title
    const air = u?.kind === 'aircraft'
    hud.inst.textContent = air ? `speed      210 kn\nheight     ${Math.round(a.state.pos[3 * u.index + 1] * 3.28)} ft\nheading    ${String(Math.round(((a.state.heading[u.index] / DEG) % 360 + 360) % 360)).padStart(3, '0')}°\nthrottle   80 %` : `speed      28 kn\nheading    ${String(Math.round(((a.state.heading[u?.index ?? 0] / DEG) % 360 + 360) % 360)).padStart(3, '0')}°\nrudder     amidships\nmain       ready`
    hud.strip.innerHTML = air ? '<span>210 kn</span><span>1,500 ft</span><span>165°</span><span>1.0 g</span>' : '<span>28 kn</span><span>165°</span><span>rudder 0°</span><span>main ready</span>'
    hud.plotLabel.textContent = 'Radar plot'
    const ctx = hud.plot.getContext('2d')
    ctx.clearRect(0, 0, 168, 168)
    ctx.strokeStyle = 'rgba(200,220,200,.35)'
    ctx.beginPath()
    ctx.arc(84, 84, 60, 0, Math.PI * 2)
    ctx.stroke()
    const beat = a.events.filter((e) => e.kind === 'sinking' || e.kind === 'sunk').slice(-1)[0]
    hud.subs.innerHTML = beat ? `<div>${beat.text}</div>` : ''
    // the touch controls on a touch screen, rebuilt when the held unit's kind or station changes
    const touch = matchMedia('(pointer: coarse)').matches
    const tkey = touch && pl ? `${pl.kind}:${pl.station}` : ''
    if (tkey !== this._touchKey) {
      this._touchKey = tkey
      this.touch?.dispose()
      this.touch = null
      if (tkey) {
        const input = { player: pl, battle: this, app: { canvas: document.getElementById('arena') }, gun: { az: 0, el: 10 }, gunInit() {}, askRelease() {}, acted: false }
        this.touch = new TouchControls(input)
      }
    }
    this.touch?.showPause?.()
  }

  const restart = proto.restart
  proto.restart = function (arg) {
    if (!this.wargame || typeof arg !== 'object') return restart.call(this, arg)
    const side = arg?.side === 'jp' || arg?.side === 'us' ? arg.side : this.wargame.side
    this.calls.push(['restart', side])
    this.arena = new MockArena(this.wargame.scenario, this.loaded.battle, this.loaded.kits, { side, seed })
    this.arena.snap = (h) => this.view?.snapshot(this.arena, h)
    this.sim = this.arena
    this.wargame = { ...this.wargame, side }
    this.running = true
    this._touchKey = null
    this.standIns(true)
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'wargame', id: this.wargame.id, side, restart: true } }))
    return this.state
  }

  const setStation = proto.setStation
  proto.setStation = function (name) {
    if (!this.wargame) return setStation.call(this, name)
    this.calls.push(['setStation', name])
    const r = this.arena.setStation(name)
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'station', station: name } }))
    return r
  }

  proto.hop = function (kind) {
    this.calls.push(['hop', kind])
    if (!this.arena) return null
    const p = this.arena.hop(kind)
    if (p) this._selected = p.unitIndex
    return p
  }

  const leave = proto.leave
  proto.leave = async function () {
    if (this.wargame) this.endWargame()
    return leave.call(this)
  }

  proto.endWargame = function () {
    this.wargame = null
    this.arena = null
    this.sim = this._recordSim ?? this.sim
    this._recordSim = null
    this.input = null
    this.touch?.dispose()
    this.touch = null
    this._touchKey = null
    this.hud?.dispose()
    this.hud = null
    document.body.classList.remove('wargame')
  }

  const release = proto.release
  proto.release = function (opts) {
    // (a wargame is always held: Release is not offered, and the mock gives nothing back)
    if (this.wargame) return null
    return release.call(this, opts)
  }

  const select = proto.select
  proto.select = function (index) {
    if (!this.wargame) return select.call(this, index)
    this.calls.push(['select', index])
    this._selected = index == null ? null : Number(index)
    this.app.events?.dispatchEvent(new CustomEvent('battle', { detail: { kind: 'select', index: this._selected } }))
    return this._selected
  }

  const tick = proto.tick
  proto.tick = function (dt) {
    if (!this.wargame) return tick.call(this, dt)
    const a = this.arena
    if (this.running && !a.result) a.advance(Math.min(0.1, dt) * this.timeScale)
    if (a.result) this.running = false
    this.view.draw(a)
    this.standIns()
  }

  const speeds = Object.getOwnPropertyDescriptor(proto, 'speeds')
  Object.defineProperty(proto, 'speeds', {
    configurable: true,
    get() {
      return this.wargame ? [1] : speeds.get.call(this)
    },
  })

  const state = Object.getOwnPropertyDescriptor(proto, 'state')
  Object.defineProperty(proto, 'state', {
    configurable: true,
    get() {
      const s = state.get.call(this)
      if (!s || !this.wargame) return s
      const pl = this.arena?.player
      return { ...s, mode: 'moment', wargame: { id: this.wargame.id, side: this.wargame.side }, station: pl?.station ?? null, held: pl ? { index: pl.unitIndex, id: this.arena.u[pl.unitIndex].id, kind: pl.kind } : null }
    },
  })

  // the dev page's own: a click on the arena selects (a hop, through link.js); the scrub
  addEventListener('DOMContentLoaded', () => {}, { once: true })
  const ready = () => {
    const app = window.__app
    if (!app?.ready) return setTimeout(ready, 100)
    const canvas = document.getElementById('arena')
    canvas.addEventListener('click', (e) => {
      const b = app.battle
      if (!b.wargame) return
      const i = b.view.pick(e.clientX, e.clientY)
      if (i != null) b.select(i)
    })
    if (q.has('scrub')) {
      const dev = document.getElementById('mock-dev')
      dev.hidden = false
      const r = dev.querySelector('input')
      const out = dev.querySelector('output')
      r.addEventListener('input', () => app.battle.arena?.seek(Number(r.value)))
      setInterval(() => {
        const a = app.battle.arena
        dev.classList.toggle('on', !!a)
        if (!a) return
        if (document.activeElement !== r) r.value = String(Math.round(a.t))
        out.textContent = mmss(a.t)
      }, 250)
    }
    addEventListener('keydown', (e) => {
      const a = app.battle.arena
      if (!a || e.target.closest?.('input, textarea')) return
      if (e.key === '[' || e.key === ']') a.seek(a.t + (e.key === ']' ? 30 : -30))
    })
    // ?wargame=samar&side=us: as the URL's #wargame does (the start sheet, offered)
    if (q.get('wargame') && !new URLSearchParams(location.hash.slice(1)).get('wargame')) app.urlBattle?.(new URLSearchParams(`wargame=${q.get('wargame')}${q.get('side') ? `&side=${q.get('side')}` : ''}`))
  }
  ready()
}

// (in a browser; a node script may import the arena alone)
if (typeof window !== 'undefined' && typeof document !== 'undefined') install()
