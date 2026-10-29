#!/usr/bin/env node
// One-shot agent CLI (design §6.3):
//   node agent/cli.mjs "<link>" <verb> [args] [--local]      (or MERGE_MEADOW_LINK=… node agent/cli.mjs <verb> …)
//   describe | systems | heads | list [--has a,b] [--tags t] [--name n] | get <id> [comp]
//   spawn <preset> [--at x,y,z] [--name n] [--json '{components}'] | set <id> <comp> '<json patch>'
//   replace <id> <comp> '<json>' | remove <id> <comp> | despawn <id> | link <id> <comp> <otherId> ['<json extra>']
//   batch '<ops json>' | define <id> '<entity json>' | define-preset <name> '<json>' | define-component <name> '<json>'
//   define-system <name> '<source>' [--order n] | define-system <name> --file sys.js | explain <id>
//   capture [out.jpg] | eval '<js body>'
// stdout: the JSON result; stderr: mode, fallbackReason and timings.
// exit 0 ok, 1 error, 2 usage, 3 a local write the sync server did not acknowledge.
import { connect } from './lib/connect.mjs'
import { tools } from './lib/tools.mjs'
import { writeFileSync, readFileSync } from 'node:fs'

const argv = process.argv.slice(2)
const link = argv[0]?.includes('doc=') ? argv.shift() : process.env.MERGE_MEADOW_LINK
const flags = {}; const pos = []
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith('--')) { const k = argv[i].slice(2); flags[k] = argv[i + 1] != null && !argv[i + 1].startsWith('--') ? argv[++i] : true } else pos.push(argv[i])
}
const [verb, ...a] = pos
const J = (s, what) => { if (s == null) return undefined; try { return JSON.parse(s) } catch (e) { throw new Error(`${what}: not JSON (${e.message})`) } }
const csv = (s) => (s && s !== true ? String(s).split(',').map((x) => x.trim()).filter(Boolean) : undefined)
const num = (s) => (s == null || s === true ? undefined : Number(s))

const argsFor = {
  describe: () => ({}), systems: () => ({}), heads: () => ({}),
  capture: () => ({}),
  list: () => ({ has: csv(flags.has), tags: csv(flags.tags), name: flags.name, preset: flags.preset, parent: flags.parent }),
  get: () => ({ id: a[0], component: a[1] }),
  spawn: () => ({ preset: a[0], name: flags.name, at: flags.at ? csv(flags.at).map(Number) : undefined, components: J(flags.json, '--json'), parent: flags.parent }),
  set: () => ({ id: a[0], component: a[1], patch: J(a[2], 'patch') }),
  replace: () => ({ id: a[0], component: a[1], data: J(a[2], 'data') }),
  remove: () => ({ id: a[0], component: a[1] }),
  despawn: () => ({ id: a[0] }),
  link: () => ({ id: a[0], component: a[1], other: a[2], extra: J(a[3], 'extra') }),
  batch: () => ({ ops: J(a[0], 'ops') }),
  define: () => ({ id: a[0], entity: J(a[1], 'entity') }),
  'define-preset': () => ({ name: a[0], preset: J(a[1], 'preset') }),
  'define-component': () => ({ name: a[0], def: J(a[1], 'def') }),
  'define-system': () => ({ name: a[0], source: flags.file ? readFileSync(flags.file, 'utf8') : a[1], order: num(flags.order), ...(flags.disabled ? { enabled: false } : {}) }),
  explain: () => ({ id: a[0] }),
  eval: () => ({ code: a[0] }),
}

if (!link || !argsFor[verb]) {
  console.error(`usage: cli.mjs "<link>" <verb> …   verbs: ${Object.keys(argsFor).join(' ')}`)
  process.exit(2)
}

const t0 = performance.now(); let c
try {
  const args = argsFor[verb]()
  c = await connect(link, { local: !!flags.local })
  const t1 = performance.now()
  const tool = tools[verb.replace(/-/g, '_')]
  const out = await tool.run(c.world, args)
  // a local write is durable only once the sync server acknowledged it (§16.7):
  // otherwise say so and exit 3, never report success for a write that may be lost
  let unacked = null
  if (tool.write && c.mode === 'local') await c.synced(5000).catch((e) => { unacked = e })
  if (unacked) {
    console.log(JSON.stringify({ error: 'write not acknowledged by the sync server; it may be lost', detail: unacked.message, mode: 'local', result: out ?? null }, null, 1))
    await c.close().catch(() => {})
    console.error(JSON.stringify({ mode: c.mode, fallbackReason: c.fallbackReason, ...c.timings, totalMs: +(performance.now() - t0).toFixed(1) }))
    process.exit(3)
  }
  if (verb === 'capture') {
    const file = a[0] ?? 'capture.jpg'
    writeFileSync(file, Buffer.from(String(out).split(',')[1] ?? '', 'base64'))
    console.log(JSON.stringify({ wrote: file }))
  } else console.log(JSON.stringify(out ?? null, null, 1))
  const callMs = performance.now() - t1
  await c.close()
  console.error(JSON.stringify({ mode: c.mode, fallbackReason: c.fallbackReason, ...c.timings, callMs: +callMs.toFixed(1), totalMs: +(performance.now() - t0).toFixed(1) }))
  process.exit(0)
} catch (e) {
  console.error(JSON.stringify({ error: e.message, mode: c?.mode ?? null, fallbackReason: c?.fallbackReason ?? null }))
  await c?.close().catch(() => {})
  process.exit(1)
}
