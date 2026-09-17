// The objects and errands loop, run headlessly for a few simulated days.
//
// The thing worth pinning here isn't any single behaviour, it's the invariant
// underneath all of them: a tool is in exactly one place at a time, and the
// only route from "I need the axe" to "I have the axe" runs through somebody's
// memory. If a shortcut ever appears — an agent teleporting a tool to itself,
// or a tool existing in two places, or a search resolving from knowledge nobody
// observed — the town stops being a simulation and starts being a puppet show.
//
//   node tests/objects.test.mjs

import { BrainHub } from '../src/brain.js'
import { TOOLS } from '../src/objects.js'
import { Simulation } from '../src/sim.js'

let pass = 0
let fail = 0
const check = (name, cond, extra = '') => {
  if (cond) {
    pass++
    console.log(`  ok   ${name}`)
  } else {
    fail++
    console.log(`  FAIL ${name} ${extra}`)
  }
}

function freshTown() {
  const sim = new Simulation()
  sim.attachBrain(new BrainHub(sim.rng))
  return sim
}

// Every tool is held by exactly one person or lying in exactly one place.
function conservation(sim) {
  const problems = []
  const held = new Map()
  for (const a of sim.agents) {
    if (!a.carrying) continue
    if (held.has(a.carrying)) problems.push(`${a.carrying} carried by two people`)
    held.set(a.carrying, a.id)
  }
  for (const def of TOOLS) {
    const t = sim.tools.get(def.id)
    if (!t) {
      problems.push(`${def.id} vanished`)
      continue
    }
    if (t.holder && held.get(def.id) !== t.holder) {
      problems.push(`${def.id} thinks ${t.holder} has it, but they don't`)
    }
    if (!t.holder && held.has(def.id)) problems.push(`${def.id} is on the ground and in a hand`)
    if (!t.holder && !Number.isFinite(t.x)) problems.push(`${def.id} is nowhere`)
  }
  return problems
}

console.log('setup')
{
  const sim = freshTown()
  check('twelve tools exist', sim.tools.size === TOOLS.length, String(sim.tools.size))
  check('all start on the ground', sim.toolsOnGround().length === TOOLS.length)
  check('conserved at rest', conservation(sim).length === 0, conservation(sim).join('; '))
}

console.log('three days of errands')
{
  const sim = freshTown()
  sim.warmStart(620)
  let worst = []
  for (let m = 0; m < 1440 * 3; m += 0.5) {
    sim.update(0.5, 2, true)
    if (m % 120 === 0) {
      const p = conservation(sim)
      if (p.length > worst.length) worst = p
    }
  }
  check('conserved throughout', worst.length === 0, worst.join('; '))
  check('jobs actually get done', sim.stats.actionsDone > 20, String(sim.stats.actionsDone))

  const events = sim.events.map((e) => e.text).join('\n')
  const allEvents = sim.agents.flatMap((a) => a.memory.items)
  check(
    'people remember seeing things on the ground',
    allEvents.some((m) => /saw the .* lying at/.test(m.text)),
  )
  check(
    'people remember seeing somebody carrying something',
    allEvents.some((m) => /saw .* carrying the/.test(m.text)),
  )
  check(
    'people remember putting things down',
    allEvents.some((m) => /left the .* at/.test(m.text)),
  )
  check('the day is still a day', sim.stats.conversations > 50 && sim.day === 4, `${sim.stats.conversations} ${sim.day}`)
  void events
}

console.log('finding a tool goes through memory and nothing else')
{
  const sim = freshTown()
  const oma = sim.byId.get('oma')
  const rosa = sim.byId.get('rosa')

  // Put the axe somewhere nobody has seen, and wipe every trace of it.
  const axe = sim.tools.get('axe')
  axe.holder = null
  axe.x = 49
  axe.y = 31
  for (const a of sim.agents) a.memory.items = a.memory.items.filter((m) => m.tool !== 'axe')

  check('nobody knows where the axe is', sim.agents.every((a) => sim.lastKnownTool(a, 'axe') === null))

  // Rosa walks past it; now exactly one person knows.
  rosa.x = 48
  rosa.y = 30
  sim.update(1, 1, true)
  const rosaKnows = sim.lastKnownTool(rosa, 'axe')
  check('walking past it is how you learn where it is', !!rosaKnows?.spot, JSON.stringify(rosaKnows?.text))
  check('and nobody else learned anything', sim.lastKnownTool(oma, 'axe') === null)

  // Oma wants it, has never seen it, and so is stuck rather than psychic.
  oma.errand = { action: 'chop', tool: 'axe', stage: 'get', until: 0, tries: 0 }
  oma.conversation = null
  oma.override = null
  oma.path = []
  for (let i = 0; i < 3; i++) sim.update(1, 1, true)
  check('wanting it without having seen it means being stuck', oma.wants === 'axe', String(oma.wants))
  check('being stuck is frustrating', oma.frustration > 0, String(oma.frustration))
  check('and does not conjure the tool', oma.carrying !== 'axe')
}

console.log('a stale memory costs a wasted walk, once')
{
  const sim = freshTown()
  const bo = sim.byId.get('bo')
  const rod = sim.tools.get('rod')
  // Bo remembers the rod by the pond. It isn't there any more.
  bo.memory.add(sim.time, 'object', 'saw the fishing rod lying at the pond', 3, {
    tool: 'rod',
    spot: { x: 18, y: 24, where: 'the pond' },
  })
  rod.x = 46
  rod.y = 24
  const before = sim.lastKnownTool(bo, 'rod')
  check('the belief is there to start with', !!before)

  bo.x = 18
  bo.y = 24
  bo.errand = { action: 'fish', tool: 'rod', stage: 'get', until: 0, tries: 0 }
  bo.conversation = null
  bo.override = null
  bo.path = []
  sim.update(1, 1, true)
  check('the belief is marked wrong once checked', before.stale === true)
  check(
    'and the disappointment is remembered',
    bo.memory.items.some((m) => /wasn’t at the pond/.test(m.text)),
  )
}

console.log('being told is as good as seeing, and comes from the other one’s memory')
{
  const sim = freshTown()
  const milo = sim.byId.get('milo')
  const nadia = sim.byId.get('nadia')
  const bucket = sim.tools.get('bucket')
  bucket.x = 5
  bucket.y = 10

  for (const a of sim.agents) a.memory.items = a.memory.items.filter((m) => m.tool !== 'bucket')
  nadia.memory.add(sim.time, 'object', 'saw the bucket lying at the woodpile', 3, {
    tool: 'bucket',
    spot: { x: 5, y: 10, where: 'the woodpile' },
  })
  milo.wants = 'bucket'

  // Stand them together and let a conversation run to its end.
  milo.x = 32
  milo.y = 20
  nadia.x = 32.5
  nadia.y = 20
  milo.lastTalk.clear()
  nadia.lastTalk.clear()
  for (let i = 0; i < 80 && !milo.memory.items.some((m) => /Nadia said/.test(m.text)); i++) {
    sim.update(1, 3, true)
  }
  const told = milo.memory.items.find((m) => /Nadia said/.test(m.text))
  check('the answer reaches the asker', !!told, JSON.stringify(milo.memory.items.slice(-3).map((m) => m.text)))
  check('and it carries a place they can actually walk to', told?.spot?.where === 'the woodpile', JSON.stringify(told?.spot))
  check('which is now what they believe', sim.lastKnownTool(milo, 'bucket')?.spot?.where === 'the woodpile')
}

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
