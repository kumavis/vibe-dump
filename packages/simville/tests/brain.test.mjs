// Exercise LiveBrain's request/response handling against a stub engine.
//
// Everything downstream of the model — the JSON parsing, the two shapes of
// `decide`, stripping a small model's stage directions and <think> blocks out
// of a speech bubble — can be wrong in ways nothing else in the repo would
// catch, and checking it for real needs WebGPU and a 1.6 GB download. So: a
// stub engine, and assertions on what we send it and what we do with what
// comes back.
//
//   node tests/brain.test.mjs
import { BrainHub, LiveBrain, OfflineBrain } from '../src/brain.js'

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

function stub(reply, capture = {}) {
  const b = new LiveBrain()
  b.engine = {
    chat: {
      completions: {
        create: async (req) => {
          Object.assign(capture, { req })
          return typeof reply === 'function' ? reply(req) : reply
        },
      },
    },
  }
  return b
}

const ctxA = {
  a: { name: 'Rosa Quill', role: 'baker', bio: 'x', doing: 'y', memories: ['saw Bo'], topics: ['Bo'], voice: {} },
  b: { name: 'Bo Tran', role: 'tinkerer', bio: 'x', doing: 'y', memories: [], topics: [], voice: {} },
  place: 'the Kettle',
  timeOfDay: 'the evening',
  rumour: { text: 'the well has gone sweet' },
  tie: 0.5,
}

console.log('converse')
{
  const cap = {}
  const b = stub({ choices: [{ message: { content: '{"lines":["There you are.","Mm.","Heard about the well?","No."]}' } }], usage: { completion_tokens: 20 } }, cap)
  const r = await b.converse(ctxA)
  check('4 lines, alternating', r.lines.length === 4 && r.lines.map((l) => l.who).join('') === 'abab')
  check('marked live', r.source === 'live')
  check('thinking disabled', cap.req.extra_body?.enable_thinking === false)
  check('json schema sent', cap.req.response_format?.type === 'json_object' && !!cap.req.response_format.schema)
}
{
  // A small model doing exactly what small models do.
  const messy =
    '<think>I should be in character.</think>{"lines":["Rosa: \\"There you are, Bo.\\" *she wipes her hands*",' +
    '"- Bo — Oh. Hello.","' + 'x'.repeat(400) + '","Fine."]}'
  const b = stub({ choices: [{ message: { content: messy } }] })
  const r = await b.converse(ctxA)
  check('strips <think>', !r.lines.some((l) => l.text.includes('think')))
  check('strips speaker label', !/^Rosa:/.test(r.lines[0].text), JSON.stringify(r.lines[0]))
  check('strips stage direction', !r.lines[0].text.includes('*'), JSON.stringify(r.lines[0]))
  check('strips bullet', !r.lines[1].text.startsWith('-'), JSON.stringify(r.lines[1]))
  check('truncates a runaway line', r.lines[2].text.length <= 161, String(r.lines[2].text.length))
}
{
  const b = stub({ choices: [{ message: { content: '{"lines":[]}' } }] })
  let threw = false
  try {
    await b.converse(ctxA)
  } catch {
    threw = true
  }
  check('empty reply throws so the hub falls back', threw)
}

console.log('reflect')
{
  const b = stub({ choices: [{ message: { content: '{"thought":"<think>hm</think>The well is the story."}' } }] })
  const r = await b.reflect({ name: 'Rosa Quill', role: 'baker', bio: 'x', memories: ['a', 'b'] })
  check('one clean sentence', r.text === 'The well is the story.', JSON.stringify(r.text))
}

console.log('decide — tool-calling model')
{
  const cap = {}
  const b = stub(
    { choices: [{ message: { tool_calls: [{ function: { name: 'seek_out', arguments: '{"person":"milo","because":"owed him a bun"}' } }] } }] },
    cap,
  )
  b.supportsTools = true
  const r = await b.decide({
    name: 'Rosa Quill', role: 'baker', bio: 'x', timeOfDay: 'evening', place: 'the Kettle', doing: 'y',
    memories: [], rumours: [], places: [{ id: 'square', name: 'the square' }], people: [{ id: 'milo', name: 'Milo Fen', role: 'child' }],
  })
  check('tools sent', Array.isArray(cap.req.tools) && cap.req.tools.length === 3)
  check('no response_format alongside tools', cap.req.response_format === undefined)
  check('tool call parsed', r?.action === 'seek_out' && r.person === 'milo' && r.because === 'owed him a bun', JSON.stringify(r))
}
{
  const b = stub({ choices: [{ message: { content: 'I think I will stay here.' } }] })
  b.supportsTools = true
  const r = await b.decide({ name: 'x', role: 'x', bio: 'x', timeOfDay: 'x', place: 'x', doing: 'x', memories: [], rumours: [], places: [], people: [] })
  check('no tool call -> null, schedule keeps control', r === null)
}

console.log('decide — everything else (JSON schema)')
{
  const cap = {}
  const b = stub({ choices: [{ message: { content: '{"action":"go_to","place":"pond","because":"the light"}' } }] }, cap)
  b.supportsTools = false
  const r = await b.decide({
    name: 'Pia Sørensen', role: 'painter', bio: 'x', timeOfDay: 'evening', place: 'the studio', doing: 'y',
    memories: [], rumours: [], places: [{ id: 'pond', name: 'the pond' }], people: [{ id: 'milo', name: 'Milo Fen', role: 'child' }],
  })
  check('no tools sent (webllm would throw)', cap.req.tools === undefined)
  check('schema sent instead', cap.req.response_format?.type === 'json_object')
  const schema = JSON.parse(cap.req.response_format.schema)
  check('action enum is the three verbs', JSON.stringify(schema.properties.action.enum) === '["go_to","seek_out","stay"]')
  check('place enum comes from the town', JSON.stringify(schema.properties.place.enum) === '["pond"]')
  check('decision parsed', r?.action === 'go_to' && r.place === 'pond', JSON.stringify(r))
}
{
  const b = stub({ choices: [{ message: { content: 'not json at all' } }] })
  b.supportsTools = false
  const r = await b.decide({ name: 'x', role: 'x', bio: 'x', timeOfDay: 'x', place: 'x', doing: 'x', memories: [], rumours: [], places: [], people: [] })
  check('unparseable -> null, not a throw', r === null)
}

console.log('interview streaming')
{
  const chunks = [
    { choices: [{ delta: { content: '<think>' } }] },
    { choices: [{ delta: { content: 'weighing it' } }] },
    { choices: [{ delta: { content: '</think>Oh, ' } }] },
    { choices: [{ delta: { content: 'plenty.' } }] },
  ]
  const b = stub(async () => ({ [Symbol.asyncIterator]: async function* () { for (const c of chunks) yield c } }))
  const seen = []
  const r = await b.interview(
    { self: { name: 'Rosa', role: 'baker', bio: 'x' }, place: 'x', doing: 'x', timeOfDay: 'x', memories: [], rumours: [], question: 'q' },
    (partial) => seen.push(partial),
  )
  check('final answer has no thinking', r.text === 'Oh, plenty.', JSON.stringify(r.text))
  check('never streamed the think block to the UI', !seen.some((s) => s.includes('weighing')), JSON.stringify(seen))
}

console.log('offline brain is synchronous (the warm start depends on it)')
{
  const o = new OfflineBrain(() => 0.5)
  const voice = { open: ['Hi {them}.'], reply: ['Mm.'], gossip: ['{rumor}'], hear: ['Oh.'], idle: ['...'] }
  const r = o.converse({ a: { ...ctxA.a, voice }, b: { ...ctxA.b, voice }, rumour: { text: 'the well' } })
  check('returns a value, not a promise', !(r instanceof Promise) && r.lines.length === 4)
  check('rumour reaches the line', r.lines[2].text.includes('the well'), JSON.stringify(r.lines[2]))
}

console.log('the hub never substitutes one brain for the other')
{
  // The bug this guards: in live mode the hub used to fall back to the grammar
  // whenever the model was busy or threw, so a town running a real model still
  // emitted scripted lines with nothing to tell them apart.
  const hub = new BrainHub(() => 0.5)
  check('starts on the grammar', hub.mode === 'scripted' && hub.status === 'scripted')

  const voice = { open: ['Hi {them}.'], reply: ['Mm.'], gossip: ['{rumor}'], hear: ['Oh.'], idle: ['...'] }
  const ctx = { a: { ...ctxA.a, voice }, b: { ...ctxA.b, voice }, rumour: null }
  const scripted = await hub.converse(ctx)
  check('scripted mode speaks', scripted?.lines?.length === 4 && scripted.source === 'offline')

  // Live, but the queue is full.
  hub.mode = 'live'
  hub.live = { engine: {}, unload: async () => {} }
  hub.status = 'live'
  hub.pending = hub.maxPending
  check('busy model returns nothing, not a grammar line', (await hub.converse(ctx)) === null)
  check('busy model has no thought either', (await hub.reflect({ topics: ['x'], memories: [] })) === null)
  // The player's own question deliberately jumps the queue, so it isn't a
  // "skip" — but a failure there still returns nothing rather than a grammar
  // line the player would read as the model's.
  check('a failed interview returns nothing', (await hub.interview({ self: { voice } })) === null)
  check('both skips counted', hub.skipped === 2, String(hub.skipped))

  // Live, free, but the engine throws.
  hub.pending = 0
  hub.live = {
    engine: {},
    unload: async () => {},
    converse: async () => {
      throw new Error('boom')
    },
  }
  check('a throwing model returns nothing, not a grammar line', (await hub.converse(ctx)) === null)

  // And back again on purpose.
  await hub.sleep()
  check('sleep returns to the grammar', hub.mode === 'scripted' && hub.modelId === null)
  const again = await hub.converse(ctx)
  check('grammar speaks again once chosen', again?.source === 'offline')
}

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
