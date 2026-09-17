// The simulation: eight bodies, eight memory streams, and the rules that decide
// who ends up standing next to whom.
//
// The clock is the spine. Everything that belongs to the town — walking,
// schedules, rumours going stale — is measured in sim minutes, so the speed
// control changes all of it together. Dialogue is the exception: speech bubbles
// advance on a real-time clock, because they exist to be read by a person and a
// line shouldn't flash past just because the day is running at 8×.

import { CAST, INITIAL_TIES, tieKey, SEED_RUMOURS } from './cast.js'
import { MemoryStream } from './memory.js'
import {
  BUILDINGS,
  buildTown,
  buildLocations,
  findPath,
  isWalkable,
  mulberry32,
  scatterNear,
} from './town.js'
import { clamp, pick, timeOfDay } from './util.js'

const DAY_START = 7 * 60
const WALK_SPEED = 2.4 // tiles per sim minute
const TALK_RADIUS = 1.9
const TALK_COOLDOWN = 85 // sim minutes before the same two will stop again
// New memories before a thought surfaces. This is also the second-biggest
// source of model calls after dialogue, and a day is only six real minutes at
// 1x — at nine it fires often enough to crowd the conversations out of the
// queue and leave the town talking in templates while the GPU muses.
const REFLECT_AFTER = 16
const DECIDE_EVERY = 150 // sim minutes between a resident's free-time decisions
const DRIFT_EVERY = 55 // sim minutes before someone will wander off again
const DRIFT_CHANCE = 0.012 // per idle minute, so roughly one errand every 1-2 hours

// How readily each resident passes something on, and how readily they swallow
// it. Milo is the town's network backbone; Ray is where rumours go to die.
const GOSSIP = { rosa: 0.85, bo: 0.4, nadia: 0.3, milo: 0.95, oma: 0.5, yusef: 0.9, pia: 0.4, ray: 0.2 }

let convSeq = 0
let rumourSeq = 0

class Agent {
  constructor(def, sim) {
    this.def = def
    this.id = def.id
    this.name = def.name
    this.role = def.role
    this.sim = sim
    this.x = 0
    this.y = 0
    this.facing = 's'
    this.path = []
    this.goal = null // location id the body is headed to
    this.goalPoint = null
    this.doing = ''
    this.reason = '' // why, when the model chose it
    this.plannedBy = 'schedule'
    this.override = null // { goal, until, doing, chasing }
    this.memory = new MemoryStream()
    this.rumours = new Set()
    this.conversation = null
    this.resumeGoal = null
    this.bubble = null
    this.thought = ''
    this.lastTalk = new Map()
    this.sinceReflect = 0
    this.lastDecision = -1e9
    this.lastDrift = -1e9
    this.walkPhase = 0
    this.seen = new Set() // who they've noticed this tick, to avoid spam
  }

  get asleep() {
    return this.doing === 'asleep'
  }

  get firstName() {
    return this.name.split(' ')[0]
  }

  say(text, seconds = 3) {
    this.bubble = { text, until: this.sim.realClock + seconds }
  }

  // Memories the offline brain turns into a line, and the live brain gets as
  // "lately:" context. Short phrases, not sentences.
  topics(n = 3) {
    const out = []
    for (const { m } of this.memory.retrieve(this.sim.time, '', 8)) {
      if (m.topic && !out.includes(m.topic)) out.push(m.topic)
      if (out.length >= n) break
    }
    return out
  }

  recall(query, n = 3) {
    return this.memory.retrieve(this.sim.time, query, n).map((r) => r.m.text)
  }

  knownRumours() {
    return [...this.rumours].map((id) => this.sim.rumours.find((r) => r.id === id)).filter(Boolean)
  }
}

export class Simulation {
  constructor(seed = 20260917) {
    this.rng = mulberry32(seed)
    this.town = buildTown(seed)
    this.locations = buildLocations(this.town)
    this.time = DAY_START
    this.day = 1
    this.realClock = 0
    this.minuteAcc = 0
    this.rumours = []
    this.events = []
    this.conversations = []
    this.ties = new Map(Object.entries(INITIAL_TIES))
    this.brain = null
    this.selected = null
    this.stats = { conversations: 0, rumoursSpread: 0, reflections: 0, modelActions: 0 }

    this.agents = CAST.map((def) => new Agent(def, this))
    this.byId = new Map(this.agents.map((a) => [a.id, a]))
    for (const a of this.agents) {
      const entry = scheduleAt(a.def, this.time)
      const loc = this.locations.get(entry.at)
      const spot = scatterNear(this.town, loc, this.rng)
      a.x = spot.x
      a.y = spot.y
      a.goal = entry.at
      a.doing = entry.doing
      a.memory.add(this.time - 60, 'observation', `woke up at ${loc.short}`, 2, { topic: null })
    }
  }

  attachBrain(brain) {
    this.brain = brain
  }

  // -------------------------------------------------------------- queries ---

  tie(a, b) {
    return this.ties.get(tieKey(a, b)) ?? 0
  }

  bumpTie(a, b, delta) {
    const k = tieKey(a, b)
    this.ties.set(k, clamp((this.ties.get(k) ?? 0) + delta, -1, 1))
  }

  // Where somebody is, in words the rest of the town would use. Inside a
  // building wins; otherwise the nearest named outdoor spot, if it's close.
  whereIs(agent) {
    for (const b of BUILDINGS) {
      if (agent.x > b.x && agent.x < b.x + b.w - 1 && agent.y > b.y && agent.y < b.y + b.h - 1) {
        return this.locations.get(b.id)
      }
    }
    let best = null
    let bestD = 6
    for (const loc of this.locations.values()) {
      if (loc.kind !== 'outdoor') continue
      const d = Math.hypot(loc.x - agent.x, loc.y - agent.y)
      if (d < bestD) {
        bestD = d
        best = loc
      }
    }
    return best ?? this.locations.get('lane')
  }

  logEvent(kind, text, agents = []) {
    this.events.push({ t: this.time, day: this.day, kind, text, agents })
    if (this.events.length > 80) this.events.shift()
  }

  // ---------------------------------------------------------------- rumour ---

  plantRumour(text, agentId = null) {
    const carrier = agentId ? this.byId.get(agentId) : pick(this.rng, this.agents)
    const rumour = {
      id: ++rumourSeq,
      text,
      origin: carrier.id,
      plantedAt: this.time,
      plantedDay: this.day,
      knowers: new Set([carrier.id]),
    }
    this.rumours.push(rumour)
    carrier.rumours.add(rumour.id)
    carrier.memory.add(this.time, 'rumor', `heard that ${text}`, 8, { topic: rumourTopic(text) })
    carrier.say('…oh.', 3)
    this.logEvent('rumour', `${carrier.firstName} hears: “${text}”`, [carrier.id])
    return rumour
  }

  // -------------------------------------------------------------- the loop ---

  // dtMin: sim minutes elapsed. dtReal: wall-clock seconds, zero while paused.
  // sync: replay mode — no promises, used by the warm start.
  update(dtMin, dtReal, sync = false) {
    this.realClock += dtReal
    this.minuteAcc += dtMin

    // Bodies move continuously; decisions tick once per sim minute so the
    // behaviour is identical at 1× and 8×.
    for (const a of this.agents) this.#move(a, dtMin)

    while (this.minuteAcc >= 1) {
      this.minuteAcc -= 1
      this.time += 1
      if (this.time >= this.day * 1440 + DAY_START) this.day += 1
      this.#tickMinute(sync)
    }

    this.#tickConversations(sync)
    for (const a of this.agents) {
      if (a.bubble && a.bubble.until < this.realClock) a.bubble = null
    }
  }

  #move(a, dtMin) {
    if (!a.path.length) return
    let budget = WALK_SPEED * dtMin
    while (budget > 0 && a.path.length) {
      const n = a.path[0]
      const dx = n.x - a.x
      const dy = n.y - a.y
      const d = Math.hypot(dx, dy)
      if (d < 1e-6) {
        a.path.shift()
        continue
      }
      a.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'e' : 'w') : dy > 0 ? 's' : 'n'
      if (d <= budget) {
        a.x = n.x
        a.y = n.y
        budget -= d
        a.path.shift()
      } else {
        a.x += (dx / d) * budget
        a.y += (dy / d) * budget
        budget = 0
      }
    }
    a.walkPhase += dtMin * WALK_SPEED
  }

  #tickMinute(sync) {
    for (const a of this.agents) this.#tickAgent(a, sync)
    this.#tickMeetings(sync)
  }

  #tickAgent(a, sync) {
    // The schedule is the floor: it decides where the body should be unless a
    // model-chosen detour is still running.
    const entry = scheduleAt(a.def, this.time)
    if (a.override && this.time > a.override.until) {
      a.override = null
      a.plannedBy = 'schedule'
      a.reason = ''
    }
    const wantGoal = a.override?.goal ?? entry.at
    const wantDoing = a.override?.doing ?? entry.doing

    if (a.conversation == null) {
      if (a.goal !== wantGoal) this.#sendTo(a, wantGoal)
      a.doing = a.path.length ? `on the way to ${this.locations.get(wantGoal)?.short ?? 'somewhere'}` : wantDoing
    }

    // Chasing somebody means re-pathing as they move.
    if (a.override?.chasing && a.conversation == null && this.time % 6 === 0) {
      const target = this.byId.get(a.override.chasing)
      if (target) this.#sendToPoint(a, { x: Math.round(target.x), y: Math.round(target.y) }, wantGoal)
    }

    if (a.asleep) return

    // Noticing people. Cheap, and it's what gives the memory stream texture.
    for (const b of this.agents) {
      if (b === a || b.asleep) continue
      const d = Math.hypot(b.x - a.x, b.y - a.y)
      const key = b.id
      if (d < 4.5) {
        if (!a.seen.has(key)) {
          a.seen.add(key)
          const place = this.whereIs(a)
          a.memory.add(this.time, 'observation', `saw ${b.name} at ${place.short}`, 2, { topic: b.firstName, who: b.id })
          a.sinceReflect++
        }
      } else if (d > 7) {
        a.seen.delete(key)
      }
    }

    if (a.sinceReflect >= REFLECT_AFTER && a.conversation == null) {
      a.sinceReflect = 0
      this.#reflect(a, sync)
    }

    // Free time, once they've arrived and have nothing scheduled but "be here".
    const idle = a.conversation == null && !a.override && !a.path.length
    if (!idle) return

    if (
      !sync &&
      this.brain?.isLive &&
      this.time - a.lastDecision > DECIDE_EVERY &&
      this.rng() < 0.25
    ) {
      a.lastDecision = this.time
      this.#decide(a)
    } else if (this.time - a.lastDrift > DRIFT_EVERY && this.rng() < DRIFT_CHANCE) {
      this.#drift(a)
    }
  }

  // An errand. Without this the offline town is eight people standing in eight
  // separate rooms all morning — the schedule alone never makes anyone cross
  // anyone else's path, so nothing is ever said and nothing gets around. It's
  // the same job the model's tool call does when the live brain is awake, which
  // is the point: waking the minds swaps out who decides, it doesn't bolt on a
  // behaviour that wasn't there.
  #drift(a) {
    const candidates = ['square', 'kettle', 'pond', 'market', 'library']
    // Somewhere a friend is, more often than not — the town's social graph
    // should steer its foot traffic.
    const friend = this.agents.find((o) => o !== a && !o.asleep && this.tie(a.id, o.id) > 0.35 && this.rng() < 0.4)
    const goal = friend ? this.whereIs(friend).id : pick(this.rng, candidates)
    if (!this.locations.has(goal) || goal === a.goal) return

    a.lastDrift = this.time
    const where = this.locations.get(goal)
    const doing = friend
      ? `looking in on ${friend.firstName}`
      : pick(this.rng, ['stretching their legs', 'an errand', `over at ${where.short}`, 'the long way round'])
    a.override = { goal, until: this.time + 35 + Math.floor(this.rng() * 45), doing }
    this.#sendTo(a, goal)
    a.memory.add(this.time, 'plan', `went to ${where.short}`, 3, { topic: friend ? friend.firstName : where.short })
  }

  #sendTo(a, locId) {
    const loc = this.locations.get(locId)
    if (!loc) return
    const from = { x: Math.round(a.x), y: Math.round(a.y) }
    const spot = scatterNear(this.town, loc, this.rng)
    let path = findPath(this.town, from, spot)
    // The scattered spot is a corner of a room somebody else's furniture or a
    // doorway can make awkward to reach; the location's own tile is the
    // fallback before anyone gets stranded at home for a whole day.
    if (!path && (spot.x !== loc.x || spot.y !== loc.y)) {
      path = findPath(this.town, from, { x: loc.x, y: loc.y })
    }
    a.goal = locId
    a.goalPoint = spot
    a.path = path ?? []
  }

  #sendToPoint(a, point, goalId) {
    if (!isWalkable(this.town, point.x, point.y)) return
    a.goal = goalId
    const path = findPath(this.town, { x: Math.round(a.x), y: Math.round(a.y) }, point)
    if (path) a.path = path
  }

  // ------------------------------------------------------------ the model ---

  async #decide(a) {
    const places = [...this.locations.values()]
      .filter((l) => l.kind !== 'home' || l.id === a.def.home)
      .map((l) => ({ id: l.id, name: l.name }))
    const people = this.agents.filter((x) => x !== a).map((x) => ({ id: x.id, name: x.name, role: x.role }))
    const decision = await this.brain.decide({
      name: a.name,
      role: a.role,
      bio: a.def.bio,
      timeOfDay: timeOfDay(this.time),
      place: this.whereIs(a).short,
      doing: a.doing,
      memories: a.recall('', 3),
      rumours: a.knownRumours().map((r) => r.text),
      places,
      people,
    })
    if (!decision) return
    this.stats.modelActions++
    const because = String(decision.because ?? '').slice(0, 80)
    a.plannedBy = 'model'
    a.reason = because

    if (decision.action === 'go_to' && this.locations.has(decision.place)) {
      a.override = { goal: decision.place, until: this.time + 90, doing: because || 'off somewhere' }
      this.#sendTo(a, decision.place)
      a.memory.add(this.time, 'plan', `decided to go to ${this.locations.get(decision.place).short}`, 4, {
        topic: this.locations.get(decision.place).short,
      })
      this.logEvent('decision', `${a.firstName} heads for ${this.locations.get(decision.place).name} — ${because}`, [a.id])
    } else if (decision.action === 'seek_out' && this.byId.has(decision.person)) {
      const target = this.byId.get(decision.person)
      a.override = { goal: a.goal, until: this.time + 90, doing: `looking for ${target.firstName}`, chasing: target.id }
      this.#sendToPoint(a, { x: Math.round(target.x), y: Math.round(target.y) }, a.goal)
      a.memory.add(this.time, 'plan', `went looking for ${target.name}`, 5, { topic: target.firstName, who: target.id })
      this.logEvent('decision', `${a.firstName} goes looking for ${target.firstName} — ${because}`, [a.id, target.id])
    } else {
      a.override = { goal: a.goal, until: this.time + 60, doing: because || a.doing }
      this.logEvent('decision', `${a.firstName} stays put — ${because}`, [a.id])
    }
  }

  async #reflect(a, sync) {
    const ctx = {
      name: a.name,
      role: a.role,
      bio: a.def.bio,
      topics: a.topics(3),
      memories: a.recall('', 5),
    }
    const res = sync || !this.brain ? (this.brain?.reflectSync(ctx) ?? null) : await this.brain.reflect(ctx)
    if (!res?.text) return
    a.thought = res.text
    a.memory.add(this.time, 'reflection', res.text, 6, { topic: ctx.topics[0] ?? null })
    this.stats.reflections++
    this.logEvent('reflection', `${a.firstName}: “${res.text}”`, [a.id])
  }

  // ------------------------------------------------------- conversations ---

  #tickMeetings(sync) {
    const free = this.agents.filter((a) => !a.asleep && a.conversation == null)
    for (let i = 0; i < free.length; i++) {
      for (let j = i + 1; j < free.length; j++) {
        const a = free[i]
        const b = free[j]
        if (a.conversation != null || b.conversation != null) continue
        if (Math.hypot(a.x - b.x, a.y - b.y) > TALK_RADIUS) continue
        const last = a.lastTalk.get(b.id) ?? -1e9
        if (this.time - last < TALK_COOLDOWN) continue
        // Two people crossing paths don't always stop, and a town where they
        // always do is exhausting to watch.
        if (this.rng() > 0.72) continue
        this.#beginConversation(a, b, sync)
      }
    }
  }

  #beginConversation(a, b, sync) {
    const place = this.whereIs(a)
    const conv = {
      id: ++convSeq,
      a,
      b,
      place,
      lines: [],
      idx: -1,
      nextAt: this.realClock,
      pending: true,
      startedReal: this.realClock,
      startedSim: this.time,
      rumour: null,
      source: 'offline',
    }
    a.conversation = conv.id
    b.conversation = conv.id
    a.lastTalk.set(b.id, this.time)
    b.lastTalk.set(a.id, this.time)
    a.resumeGoal = a.goal
    b.resumeGoal = b.goal
    a.path = []
    b.path = []
    faceEachOther(a, b)
    this.conversations.push(conv)
    this.stats.conversations++

    // Does the opener have something to pass on?
    const fresh = a.knownRumours().filter((r) => !b.rumours.has(r.id))
    if (fresh.length && this.rng() < GOSSIP[a.id]) conv.rumour = pick(this.rng, fresh)

    const ctx = this.#conversationContext(conv)
    if (sync || !this.brain) {
      this.#fillConversation(conv, this.brain ? this.brain.converseSync(ctx) : { lines: [], source: 'offline' })
    } else {
      a.say('…', 20)
      this.brain
        .converse(ctx)
        .then((res) => this.#fillConversation(conv, res))
        .catch(() => this.#fillConversation(conv, this.brain.converseSync(ctx)))
    }
  }

  #conversationContext(conv) {
    const { a, b } = conv
    const describe = (p) => ({
      name: p.name,
      role: p.role,
      bio: p.def.bio,
      voice: p.def.voice,
      doing: p.doing,
      memories: p.recall(conv.rumour?.text ?? '', 3),
      topics: p.topics(2),
    })
    return {
      a: describe(a),
      b: describe(b),
      place: conv.place.short,
      timeOfDay: timeOfDay(this.time),
      rumour: conv.rumour,
      tie: this.tie(a.id, b.id),
    }
  }

  #fillConversation(conv, res) {
    if (!this.conversations.includes(conv)) return
    conv.lines = res?.lines?.length ? res.lines : [{ who: 'a', text: '…' }]
    conv.source = res?.source ?? 'offline'
    conv.pending = false
    conv.idx = -1
    conv.nextAt = this.realClock
    conv.a.bubble = null
    conv.b.bubble = null
  }

  #tickConversations() {
    for (let i = this.conversations.length - 1; i >= 0; i--) {
      const conv = this.conversations[i]
      // Waiting on the model. Give it a while, then take the template.
      if (conv.pending) {
        if (this.realClock - conv.startedReal > 25) {
          this.#fillConversation(conv, this.brain?.converseSync(this.#conversationContext(conv)))
        }
        continue
      }
      if (this.realClock < conv.nextAt) continue
      conv.idx++
      if (conv.idx >= conv.lines.length) {
        this.#endConversation(conv, i)
        continue
      }
      const line = conv.lines[conv.idx]
      const speaker = line.who === 'a' ? conv.a : conv.b
      const listener = line.who === 'a' ? conv.b : conv.a
      const seconds = clamp(1.5 + line.text.split(/\s+/).length * 0.28, 2.2, 6)
      speaker.say(line.text, seconds + 0.4)
      listener.bubble = null
      faceEachOther(conv.a, conv.b)
      conv.nextAt = this.realClock + seconds
    }
  }

  #endConversation(conv, index) {
    const { a, b } = conv
    this.conversations.splice(index, 1)
    a.conversation = null
    b.conversation = null
    a.bubble = null
    b.bubble = null

    const subject = conv.rumour ? rumourTopic(conv.rumour.text) : null
    const transcript = conv.lines.map((l) => l.text).join(' ')
    const line = (other) =>
      subject
        ? `talked with ${other.name} at ${conv.place.short} about ${subject}`
        : `talked with ${other.name} at ${conv.place.short}`
    a.memory.add(this.time, 'dialogue', line(b), subject ? 5 : 4, {
      topic: subject ?? b.firstName,
      who: b.id,
      transcript,
    })
    b.memory.add(this.time, 'dialogue', line(a), subject ? 5 : 4, {
      topic: subject ?? a.firstName,
      who: a.id,
      transcript,
    })
    a.sinceReflect++
    b.sinceReflect++
    this.bumpTie(a.id, b.id, 0.04)

    if (conv.rumour && !b.rumours.has(conv.rumour.id)) {
      if (this.rng() < GOSSIP[b.id]) {
        b.rumours.add(conv.rumour.id)
        conv.rumour.knowers.add(b.id)
        b.memory.add(this.time, 'rumor', `heard from ${a.firstName} that ${conv.rumour.text}`, 7, {
          topic: rumourTopic(conv.rumour.text),
          who: a.id,
        })
        b.sinceReflect += 2
        this.stats.rumoursSpread++
        this.logEvent(
          'rumour',
          `${a.firstName} → ${b.firstName}: “${conv.rumour.text}” (${conv.rumour.knowers.size}/${this.agents.length})`,
          [a.id, b.id],
        )
      } else {
        this.logEvent('rumour', `${b.firstName} isn’t buying it from ${a.firstName}`, [a.id, b.id])
      }
    } else {
      this.logEvent('talk', `${a.firstName} and ${b.firstName} talked at ${conv.place.short}`, [a.id, b.id])
    }

    for (const p of [a, b]) {
      if (p.resumeGoal) this.#sendTo(p, p.resumeGoal)
      p.resumeGoal = null
    }
  }

  // ------------------------------------------------------------- the player ---

  async interview(agentId, question, onToken) {
    const a = this.byId.get(agentId)
    if (!a) return null
    const ctx = {
      self: { name: a.name, role: a.role, bio: a.def.bio, voice: a.def.voice },
      place: this.whereIs(a).short,
      doing: a.doing,
      timeOfDay: timeOfDay(this.time),
      memories: a.recall(question, 4),
      rumours: a.knownRumours().map((r) => r.text),
      question,
    }
    const res = await this.brain.interview(ctx, onToken)
    a.memory.add(this.time, 'dialogue', `was asked about ${shortQuestion(question)} by a visitor`, 5, {
      topic: shortQuestion(question),
    })
    if (res?.text) a.say(res.text.split(/(?<=[.!?])\s/)[0].slice(0, 90), 6)
    return res
  }

  // Replay a stretch of town history with no rendering and no model, so the
  // first frame the player sees has people spread across town, memories worth
  // reading and something already going round.
  warmStart(minutes) {
    // Rosa, deliberately: she stands still in the café all morning and repeats
    // everything. Handing the first rumour to Ray (who repeats nothing) makes
    // for a truthful simulation and a very boring opening minute.
    this.plantRumour(SEED_RUMOURS[0], 'rosa')
    const step = 0.5
    for (let m = 0; m < minutes; m += step) {
      this.update(step, step * 4, true)
    }
    // The bubbles from the replay would otherwise pop in stale.
    for (const a of this.agents) a.bubble = null
    this.realClock = 0
    for (const c of this.conversations) {
      c.nextAt = 0
      c.startedReal = 0
    }
  }
}

function scheduleAt(def, minutes) {
  const h = Math.floor((((minutes % 1440) + 1440) % 1440) / 60)
  let entry = def.schedule[0]
  for (const e of def.schedule) {
    if (e.h <= h) entry = e
    else break
  }
  return entry
}

function faceEachOther(a, b) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  if (Math.abs(dx) > Math.abs(dy)) {
    a.facing = dx > 0 ? 'e' : 'w'
    b.facing = dx > 0 ? 'w' : 'e'
  } else {
    a.facing = dy > 0 ? 's' : 'n'
    b.facing = dy > 0 ? 'n' : 's'
  }
}

// A rumour's short name, for memory topics and the offline brain's frames.
function rumourTopic(text) {
  const words = text.split(/\s+/)
  const idx = words.findIndex((w) => /^(the|a|an)$/i.test(w))
  if (idx >= 0 && words[idx + 1]) return `${words[idx]} ${words[idx + 1]}`.replace(/[^a-zA-Z' ]/g, '')
  return words.slice(0, 3).join(' ')
}

function shortQuestion(q) {
  return q.trim().replace(/\?+$/, '').split(/\s+/).slice(-4).join(' ').toLowerCase()
}

export { SEED_RUMOURS }
