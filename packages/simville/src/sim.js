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
import { ACTION_BY_ID, TIDY, TOOLS, actionsFor, matchTool, toolName } from './objects.js'
import { clamp, clockOf, pick, timeOfDay } from './util.js'

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
// How long two people stand together when there are no words for them — long
// enough to read as a conversation, short enough not to hold up the day.
const MURMUR_SECONDS = 4.5
const ERRAND_EVERY = 200 // sim minutes before somebody takes up another job
const ERRAND_CHANCE = 0.02 // per idle minute

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
    this.thoughtScripted = false
    this.lastTalk = new Map()
    this.sinceReflect = 0
    this.lastDecision = -1e9
    this.lastDrift = -1e9
    this.walkPhase = 0
    this.seen = new Set() // who and what they've noticed, to avoid spam
    this.carrying = null // tool id
    this.errand = null // { action, tool, stage, until, tries }
    this.wants = null // the tool they're hunting for, which is what they ask about
    this.frustration = 0
    this.lastErrand = -1e9
    this.lastAction = null
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
    this.stats = { conversations: 0, rumoursSpread: 0, reflections: 0, modelActions: 0, actionsDone: 0 }
    this.#initTools()

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

    if (a.asleep) {
      // Nobody sleeps holding the axe.
      if (a.carrying) this.#setDown(a, this.rng() < (TIDY[a.id] ?? 0.5))
      return
    }

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
        // Also forget what they were carrying, so picking the same thing up
        // again later is a fresh thing to notice rather than old news.
        for (const k of a.seen) if (k.startsWith(`carry:${b.id}:`)) a.seen.delete(k)
      }
    }
    this.#noticeObjects(a)

    if (a.sinceReflect >= REFLECT_AFTER && a.conversation == null) {
      a.sinceReflect = 0
      this.#reflect(a, sync)
    }

    // An errand in progress owns the body until it's done or given up on.
    if (a.errand) {
      if (a.conversation == null) this.#tickErrand(a)
      return
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
    } else if (this.time - a.lastErrand > ERRAND_EVERY && this.rng() < ERRAND_CHANCE) {
      this.#startErrand(a)
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
    // Null when the model was busy or threw: no thought, rather than a
    // grammar one wearing the model's name.
    const res = sync || !this.brain ? (this.brain?.reflectSync(ctx) ?? null) : await this.brain.reflect(ctx)
    if (!res?.text) return
    a.thought = res.text
    a.thoughtScripted = res.source !== 'live'
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
        // always do is exhausting to watch — unless one of them has lost
        // something, in which case they'll stop anyone.
        if (!a.wants && !b.wants && this.rng() > 0.72) continue
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
      question: null,
      silent: false,
      source: 'none',
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

    // Somebody who can't find their tool asks about it. The sim works out the
    // answer from what the other one actually remembers — the brain only gets
    // to phrase it, so nobody can be told a location that was never observed.
    const asker = a.wants ? a : b.wants ? b : null
    if (asker) {
      const other = asker === a ? b : a
      const known = this.lastKnownTool(other, asker.wants)
      conv.question = {
        asker: asker === a ? 'a' : 'b',
        tool: asker.wants,
        name: toolName(asker.wants),
        answer: known ? (known.spot ? known.spot.where : this.byId.get(known.holder)?.firstName) : null,
        known,
      }
      // Asking outranks gossip; you don't open with the fish when you've lost
      // the axe.
      conv.rumour = null
    }

    const ctx = this.#conversationContext(conv)
    if (sync || !this.brain) {
      this.#fillConversation(conv, this.brain ? this.brain.converseSync(ctx) : null)
    } else {
      a.say('…', 20)
      this.brain
        .converse(ctx)
        .then((res) => this.#fillConversation(conv, res))
        .catch(() => this.#fillConversation(conv, null))
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
      question: conv.question ?? null,
      carrying: { a: a.carrying ? toolName(a.carrying) : null, b: b.carrying ? toolName(b.carrying) : null },
      tie: this.tie(a.id, b.id),
    }
  }

  // `res` is null when the installed brain had nothing to give — the model was
  // busy, or it threw. The two of them still stop and talk, and the rumour still
  // changes hands; we just don't get to hear it. Filling the silence with a
  // grammar line would be the one thing this shouldn't do.
  #fillConversation(conv, res) {
    if (!this.conversations.includes(conv)) return
    conv.lines = res?.lines?.length ? res.lines : []
    conv.silent = conv.lines.length === 0
    conv.source = res?.source ?? 'none'
    conv.pending = false
    conv.idx = -1
    conv.nextAt = this.realClock + (conv.silent ? MURMUR_SECONDS : 0)
    conv.a.bubble = null
    conv.b.bubble = null
    if (conv.silent) {
      // A murmur, so you can see a conversation happening even when there are
      // no words for it.
      conv.a.say('⋯', MURMUR_SECONDS)
    }
  }

  #tickConversations() {
    for (let i = this.conversations.length - 1; i >= 0; i--) {
      const conv = this.conversations[i]
      // Waiting on the model. Give it a while, then let them talk in private.
      if (conv.pending) {
        if (this.realClock - conv.startedReal > 25) this.#fillConversation(conv, null)
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

    if (conv.question) {
      const asker = conv.question.asker === 'a' ? a : b
      const other = asker === a ? b : a
      const q = conv.question
      if (q.known) {
        // Hearsay, but good hearsay: it carries the same spot/holder the other
        // one remembers, so the asker can now go and look.
        asker.memory.add(this.time, 'object', `${other.firstName} said to look for the ${q.name} at ${q.answer}`, 6, {
          topic: `the ${q.name}`,
          tool: q.tool,
          who: other.id,
          spot: q.known.spot,
          holder: q.known.holder,
        })
        asker.frustration = Math.max(0, asker.frustration - 0.3)
        this.logEvent('object', `${other.firstName} tells ${asker.firstName} where to find the ${q.name}`, [a.id, b.id])
      } else {
        asker.frustration = Math.min(1, asker.frustration + 0.15)
        asker.memory.add(this.time, 'object', `${other.firstName} hasn’t seen the ${q.name} either`, 3, {
          topic: `the ${q.name}`,
          who: other.id,
        })
        this.logEvent('object', `${other.firstName} hasn’t seen the ${q.name} either`, [a.id, b.id])
      }
    }

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

  // ------------------------------------------------------------- objects ---

  #initTools() {
    this.tools = new Map()
    for (const def of TOOLS) {
      const home = this.locations.get(def.home)
      const spot = scatterNear(this.town, home, this.rng, 1)
      this.tools.set(def.id, { def, holder: null, x: spot.x, y: spot.y, home: def.home })
    }
  }

  toolsOnGround() {
    return [...this.tools.values()].filter((t) => !t.holder)
  }

  // Where something is, in the words the town would use for it.
  placeWords(x, y) {
    let best = null
    let bestD = Infinity
    for (const loc of this.locations.values()) {
      const d = Math.hypot(loc.x - x, loc.y - y)
      if (d < bestD) {
        bestD = d
        best = loc
      }
    }
    if (!best) return 'somewhere out there'
    // A thing dropped in open country is "out past the workshop", not "at" it.
    return bestD > 6 ? `out past ${best.short}` : best.short
  }

  // What this resident currently believes about where a tool is. This is a
  // straight read of the memory stream and nothing else — there is no oracle,
  // which is the entire point. A record goes stale the moment they go and look
  // and it isn't there, so a wrong belief costs a wasted walk exactly once.
  lastKnownTool(a, toolId) {
    for (let i = a.memory.items.length - 1; i >= 0; i--) {
      const m = a.memory.items[i]
      if (m.tool === toolId && !m.stale && (m.spot || m.holder)) return m
    }
    return null
  }

  #pickUp(a, toolId) {
    const t = this.tools.get(toolId)
    if (!t || t.holder) return false
    if (a.carrying) this.#setDown(a)
    t.holder = a.id
    a.carrying = toolId
    a.memory.add(this.time, 'object', `picked up the ${toolName(toolId)}`, 6, {
      topic: `the ${toolName(toolId)}`,
      tool: toolId,
      holder: a.id,
    })
    return true
  }

  #setDown(a, tidy = false) {
    const toolId = a.carrying
    if (!toolId) return
    const t = this.tools.get(toolId)
    a.carrying = null
    t.holder = null
    if (tidy) {
      const home = this.locations.get(t.home)
      const spot = scatterNear(this.town, home, this.rng, 1)
      t.x = spot.x
      t.y = spot.y
    } else {
      t.x = Math.round(a.x)
      t.y = Math.round(a.y)
    }
    const where = this.placeWords(t.x, t.y)
    a.memory.add(this.time, 'object', `left the ${toolName(toolId)} at ${where}`, 5, {
      topic: `the ${toolName(toolId)}`,
      tool: toolId,
      spot: { x: t.x, y: t.y, where },
    })
    // Only the careless drops are worth the log. Putting a thing back where it
    // belongs is the case where nothing interesting will happen next.
    if (!tidy) this.logEvent('object', `${a.firstName} leaves the ${toolName(toolId)} at ${where}`, [a.id])
  }

  #handOver(from, to, toolId) {
    const t = this.tools.get(toolId)
    if (!t || t.holder !== from.id) return false
    // Nobody has three hands. Whatever the receiver was already holding goes
    // down first — otherwise that tool keeps pointing at them as its holder
    // while they're visibly carrying something else, and it can never be found
    // again.
    if (to.carrying) this.#setDown(to, this.rng() < (TIDY[to.id] ?? 0.5))
    from.carrying = null
    t.holder = to.id
    to.carrying = toolId
    const line = `${from.firstName} handed over the ${toolName(toolId)}`
    for (const p of [from, to]) {
      p.memory.add(this.time, 'object', line, 5, {
        topic: `the ${toolName(toolId)}`,
        tool: toolId,
        holder: to.id,
        who: p === from ? to.id : from.id,
      })
    }
    this.bumpTie(from.id, to.id, 0.06)
    this.logEvent('object', `${line} to ${to.firstName}`, [from.id, to.id])
    return true
  }

  // Noticing objects, which works exactly like noticing people: near enough,
  // once, and into the stream. These records are the only thing anybody has to
  // go on later.
  // Already knowing this exact thing — same tool, same spot, not since proven
  // wrong — means there's nothing to learn and nothing to file.
  #alreadyKnows(a, toolId, spot, holder) {
    const known = this.lastKnownTool(a, toolId)
    if (!known) return false
    if (holder) return known.holder === holder && !known.spot
    return known.spot && known.spot.x === spot.x && known.spot.y === spot.y
  }

  #noticeObjects(a) {
    for (const b of this.agents) {
      if (b === a || b.asleep || !b.carrying) continue
      const d = Math.hypot(b.x - a.x, b.y - a.y)
      const key = `carry:${b.id}:${b.carrying}`
      if (d < 4.5 && !a.seen.has(key)) {
        a.seen.add(key)
        if (this.#alreadyKnows(a, b.carrying, null, b.id)) continue
        a.memory.add(this.time, 'object', `saw ${b.name} carrying the ${toolName(b.carrying)}`, 4, {
          topic: `the ${toolName(b.carrying)}`,
          who: b.id,
          tool: b.carrying,
          holder: b.id,
        })
      }
    }
    for (const [id, t] of this.tools) {
      if (t.holder) continue
      const d = Math.hypot(t.x - a.x, t.y - a.y)
      const key = `ground:${id}:${t.x},${t.y}`
      if (d < 4.5) {
        if (a.seen.has(key)) continue
        a.seen.add(key)
        if (this.#alreadyKnows(a, id, { x: t.x, y: t.y }, null)) continue
        const where = this.placeWords(t.x, t.y)
        a.memory.add(this.time, 'object', `saw the ${toolName(id)} lying at ${where}`, 3, {
          topic: `the ${toolName(id)}`,
          tool: id,
          spot: { x: t.x, y: t.y, where },
        })
      } else if (d > 7) {
        a.seen.delete(key)
      }
    }
  }

  // ------------------------------------------------------------- errands ---

  #startErrand(a) {
    const options = actionsFor(a.id).filter((act) => act.id !== a.lastAction)
    if (!options.length) return
    const action = pick(this.rng, options)
    a.lastErrand = this.time
    a.errand = { action: action.id, tool: action.tool, stage: 'get', until: 0, tries: 0 }
    a.memory.add(this.time, 'plan', `decided to go ${action.doing}`, 4, {
      topic: `the ${toolName(action.tool)}`,
      tool: action.tool,
    })
  }

  #abandonErrand(a, why) {
    if (!a.errand) return
    const action = ACTION_BY_ID.get(a.errand.action)
    a.memory.add(this.time, 'plan', `gave up on ${action.doing} — ${why}`, 5, {
      topic: `the ${toolName(a.errand.tool)}`,
    })
    this.logEvent('errand', `${a.firstName} gives up on ${action.doing} — ${why}`, [a.id])
    a.errand = null
    a.wants = null
    a.override = null
    a.frustration = Math.min(1, a.frustration + 0.3)
  }

  #finishErrand(a) {
    const action = ACTION_BY_ID.get(a.errand.action)
    a.memory.add(this.time, 'object', action.done, 6, { topic: `the ${toolName(action.tool)}`, tool: action.tool })
    this.logEvent('errand', `${a.firstName} ${action.done}`, [a.id])
    this.stats.actionsDone++
    a.lastAction = action.id
    a.errand = null
    a.wants = null
    a.override = null
    a.frustration = Math.max(0, a.frustration - 0.5)
    // Tidy people put it back where it belongs; the rest put it down where they
    // happen to be standing, which is where the next search starts — or wander
    // off still holding it, which is worse and much more true to life.
    const tidy = TIDY[a.id] ?? 0.5
    if (this.rng() < tidy) this.#setDown(a, true)
    else if (this.rng() < 0.55) this.#setDown(a, false)
  }

  // The errand state machine. `get` is looking for the tool, `carry` is taking
  // it to where the job is, `do` is doing the job, `lost` is not knowing.
  #tickErrand(a) {
    const e = a.errand
    const action = ACTION_BY_ID.get(e.action)
    const dest = this.locations.get(action.at)

    if (e.stage === 'do') {
      if (this.time >= e.until) this.#finishErrand(a)
      return
    }

    if (a.carrying === e.tool) {
      if (e.stage !== 'carry') {
        e.stage = 'carry'
        a.wants = null
        a.plannedBy = 'errand'
        a.override = {
          goal: action.at,
          until: this.time + 600,
          doing: `taking the ${toolName(e.tool)} to ${dest.short}`,
        }
        this.#sendTo(a, action.at)
      }
      if (!a.path.length && Math.hypot(a.x - dest.x, a.y - dest.y) < 4.5) {
        e.stage = 'do'
        e.until = this.time + action.minutes
        a.override = { goal: action.at, until: this.time + action.minutes + 20, doing: action.doing }
        a.reason = ''
        this.logEvent('errand', `${a.firstName} is ${action.doing}`, [a.id])
      }
      return
    }

    // They don't have it. Everything from here is memory, not knowledge.
    const known = this.lastKnownTool(a, e.tool)
    const tool = this.tools.get(e.tool)

    if (!known) {
      if (e.stage !== 'lost') {
        e.stage = 'lost'
        a.wants = e.tool
        a.frustration = Math.min(1, a.frustration + 0.25)
        this.logEvent('errand', `${a.firstName} can’t find the ${toolName(e.tool)}`, [a.id])
      }
      // Look somewhere plausible while asking around. Where it lives is the
      // obvious first guess, and being wrong is how you end up asking.
      if (!a.path.length) {
        e.tries++
        if (e.tries > 6) return this.#abandonErrand(a, `no sign of the ${toolName(e.tool)}`)
        const guess = e.tries === 1 ? this.tools.get(e.tool).home : pick(this.rng, ['square', 'kettle', 'market', 'pond'])
        a.override = { goal: guess, until: this.time + 600, doing: `looking for the ${toolName(e.tool)}` }
        this.#sendTo(a, guess)
      }
      return
    }

    if (known.holder && known.holder !== a.id) {
      const holder = this.byId.get(known.holder)
      // Still got it? Go and ask for it.
      if (holder && tool.holder === holder.id) {
        e.stage = 'get'
        a.wants = null
        a.override = {
          goal: a.goal,
          until: this.time + 600,
          doing: `after the ${toolName(e.tool)}`,
          chasing: holder.id,
        }
        // They'll hand it over if they aren't in the middle of using it.
        if (Math.hypot(holder.x - a.x, holder.y - a.y) < 2.4 && holder.errand?.tool !== e.tool) {
          this.#handOver(holder, a, e.tool)
        }
        return
      }
      // They've put it down since. That memory is no use any more.
      known.stale = true
      return
    }

    if (known.spot) {
      e.stage = 'get'
      a.wants = null
      const at = known.spot
      if (Math.hypot(at.x - a.x, at.y - a.y) < 1.8) {
        if (!tool.holder && Math.hypot(tool.x - a.x, tool.y - a.y) < 2.2) {
          this.#pickUp(a, e.tool)
        } else {
          // Somebody moved it. Remember being wrong, and look again.
          known.stale = true
          a.frustration = Math.min(1, a.frustration + 0.2)
          a.memory.add(this.time, 'object', `the ${toolName(e.tool)} wasn’t at ${at.where} after all`, 5, {
            topic: `the ${toolName(e.tool)}`,
          })
          this.logEvent('object', `${a.firstName} finds no ${toolName(e.tool)} at ${at.where}`, [a.id])
        }
        return
      }
      if (!a.path.length) {
        a.override = { goal: a.goal, until: this.time + 600, doing: `fetching the ${toolName(e.tool)}` }
        this.#sendToPoint(a, { x: at.x, y: at.y }, a.goal)
        // Nowhere to walk to means the memory is unusable.
        if (!a.path.length) known.stale = true
      }
    }
  }

  // Called the moment a model is installed. A conversation begun under the
  // grammar still has un-played lines queued, and a thought from the warm start
  // is grammar prose sitting in the inspector — both would surface after the
  // header started claiming a model was in, which is the whole thing we're
  // trying not to do. Drop them; what's already on screen finishes.
  dropScriptedWords() {
    for (const conv of this.conversations) {
      if (conv.source !== 'offline') continue
      // Including whatever is mid-bubble. Letting the current line play out
      // reads as the model's first words and is exactly the confusion this
      // exists to prevent; a bubble vanishing when you deliberately change
      // what's doing the talking is the expected thing.
      conv.lines = []
      conv.source = 'dropped'
      conv.nextAt = this.realClock
      conv.a.bubble = null
      conv.b.bubble = null
    }
    for (const a of this.agents) {
      if (!a.thoughtScripted) continue
      a.thought = ''
      a.thoughtScripted = false
    }
  }

  // ------------------------------------------------------------- the player ---

  async interview(agentId, question, onToken) {
    const a = this.byId.get(agentId)
    if (!a) return null
    // If they're being asked about a thing, the answer comes out of the memory
    // stream, the same way it does when another resident asks. What they can
    // say is bounded by what they actually saw.
    const askedAbout = matchTool(question)
    let item = null
    if (askedAbout) {
      const known = this.lastKnownTool(a, askedAbout)
      item = {
        tool: askedAbout,
        name: toolName(askedAbout),
        carrying: a.carrying === askedAbout,
        answer: known ? (known.spot ? known.spot.where : this.byId.get(known.holder)?.name) : null,
        heldBy: known?.holder ? this.byId.get(known.holder)?.name : null,
        when: known ? clockOf(known.t) : null,
      }
    }
    const ctx = {
      self: { name: a.name, role: a.role, bio: a.def.bio, voice: a.def.voice },
      place: this.whereIs(a).short,
      doing: a.doing,
      timeOfDay: timeOfDay(this.time),
      // Records of being interviewed are filtered out: quoting one back at the
      // visitor produces "what I can tell you is this: was asked about you",
      // which is a hall of mirrors rather than an answer.
      memories: a.memory
        .retrieve(this.time, question, 8)
        .map((r) => r.m)
        .filter((m) => !m.visitor)
        .slice(0, 4)
        .map((m) => m.text),
      rumours: a.knownRumours().map((r) => r.text),
      item,
      question,
    }
    const res = await this.brain.interview(ctx, onToken)
    a.memory.add(this.time, 'dialogue', `was asked about ${shortQuestion(question)} by a visitor`, 5, {
      topic: shortQuestion(question),
      visitor: true,
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
