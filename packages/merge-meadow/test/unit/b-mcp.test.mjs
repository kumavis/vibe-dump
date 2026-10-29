// The stdio MCP server driven exactly as Claude Code drives it (@modelcontextprotocol/sdk
// Client over stdio), in local mode against an in-process repo injected through
// MERGE_MEADOW_OPEN_REPO — no host page, no sync server.
import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { Repo } from '@automerge/automerge-repo'
import * as Automerge from '@automerge/automerge'
import { seedDoc } from '../../src/doc/seed.js'

const here = (p) => fileURLToPath(new URL(p, import.meta.url))

test('MCP server, local mode: tools, spawn/list/set/get, events, define_system syntax error leaves heads unchanged', async (t) => {
  const repo = new Repo({ network: [] })
  const h = repo.create()
  h.change((d) => seedDoc(d, { title: 'MCP Meadow' }))
  const dir = mkdtempSync(join(tmpdir(), 'mm-mcp-'))
  const docFile = join(dir, 'doc.automerge')
  writeFileSync(docFile, Automerge.save(h.doc()))
  await repo.shutdown()

  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [here('../../agent/mcp.mjs')],
    env: { ...process.env, MERGE_MEADOW_OPEN_REPO: here('./b-fixture-open-repo.mjs'), MERGE_MEADOW_TEST_DOC: docFile, MERGE_MEADOW_TEST_DOC_ID: h.documentId, MERGE_MEADOW_HOST_TIMEOUT: '300' },
    stderr: 'pipe',
  })
  const client = new Client({ name: 'b-mcp-test', version: '0' })
  await client.connect(transport)
  t.after(async () => { await client.close().catch(() => {}); rmSync(dir, { recursive: true, force: true }) })

  const call = async (name, args = {}) => {
    const r = await client.callTool({ name, arguments: args })
    const text = r.content.find((c) => c.type === 'text')?.text
    return { isError: !!r.isError, body: text ? JSON.parse(text) : null, raw: r }
  }

  const { tools } = await client.listTools()
  const names = tools.map((x) => x.name).sort()
  for (const n of ['connect', 'describe', 'list', 'get', 'spawn', 'set', 'replace', 'remove', 'despawn', 'batch', 'define', 'define_preset', 'define_component', 'define_system', 'systems', 'explain', 'events', 'capture', 'eval', 'heads', 'link']) assert.ok(names.includes(n), `missing tool ${n}`)

  const notYet = await call('describe')
  assert.equal(notYet.isError, true, 'no link yet')

  const link = `https://example.test/merge-meadow/#doc=${h.url}&key=testkey0123456789abcdef`
  const c = await call('connect', { link })
  assert.equal(c.isError, false, JSON.stringify(c.body))
  assert.equal(c.body.mode, 'local')
  assert.match(c.body.fallbackReason, /no host page answered/)

  const d = await call('describe')
  assert.equal(d.body.result.title, 'MCP Meadow')
  assert.equal(d.body.mode, 'local')
  assert.ok('fallbackReason' in d.body)

  const sheepBefore = (await call('list', { tags: ['prey'] })).body.result.length
  const s = await call('spawn', { preset: 'sheep', name: 'Dolly', at: [3, 0, -5] })
  assert.equal(s.isError, false, JSON.stringify(s.body))
  const id = s.body.result.id
  assert.match(id, /^[a-z0-9-]+$/)
  assert.equal(s.body.mode, 'local')
  assert.ok('syncedMs' in s.body, 'local writes report the server ack (null: no server here)')
  const after = (await call('list', { tags: ['prey'] })).body.result
  assert.equal(after.length, sheepBefore + 1)
  assert.ok(after.some((r) => r.id === id && r.name === 'Dolly'))

  assert.equal((await call('set', { id, component: 'body', patch: { speed: 9 } })).isError, false)
  assert.equal((await call('get', { id, component: 'body' })).body.result.speed, 9)
  assert.deepEqual((await call('get', { id, component: 'transform' })).body.result.p, [3, 0, -5])

  const heads0 = (await call('heads')).body
  assert.ok(Array.isArray(heads0.result) && heads0.result.length > 0)
  assert.match(heads0.versionLink, /^https:\/\/example\.test\/merge-meadow\/#doc=automerge:.*&heads=/)
  const bad = await call('define_system', { name: 'oops', source: 'export default { update(world, dt) { world.log( } }' })
  assert.equal(bad.isError, true)
  assert.match(bad.body.error, /SyntaxError/)
  assert.equal(bad.body.mode, 'local')
  assert.deepEqual((await call('heads')).body.result, heads0.result, 'a rejected system never reaches the doc')

  const good = await call('define_system', { name: 'spin', source: 'export default { update(world, dt) {} }', order: 960 })
  assert.equal(good.isError, false, JSON.stringify(good.body))
  const sys = (await call('systems')).body.result
  assert.deepEqual(sys.map((x) => [x.name, x.status]), [['spin', 'unknown']])

  const cap = await call('capture')
  assert.equal(cap.isError, true)
  assert.match(cap.body.error, /needs a live host page/)
  assert.equal(cap.body.mode, 'local')

  const ev = (await call('events', { types: ['entity-added'] })).body
  assert.ok(ev.events.some((e) => e.id === id), JSON.stringify(ev))
  assert.equal((await call('events')).body.events.length, 0, 'the cursor advanced')

  const b = await call('batch', { ops: [{ op: 'spawn', preset: 'trex', at: [0, 0, 0] }, { op: 'set', id: '$0', component: 'body', patch: { speed: 3 } }] })
  assert.equal(b.isError, false, JSON.stringify(b.body))
  assert.equal((await call('get', { id: b.body.result[0], component: 'body' })).body.result.speed, 3)
  assert.equal((await call('despawn', { id })).isError, false)
  assert.equal((await call('get', { id })).isError, true)
})

test('CLI, local mode: a write the sync server never acknowledges exits 3 with an error, not success', async () => {
  const { execFile } = await import('node:child_process')
  const repo = new Repo({ network: [] })
  const h = repo.create()
  h.change((d) => seedDoc(d, { title: 'No Ack' }))
  const dir = mkdtempSync(join(tmpdir(), 'mm-cli-'))
  const docFile = join(dir, 'doc.automerge')
  writeFileSync(docFile, Automerge.save(h.doc()))
  await repo.shutdown()
  const link = `https://example.test/merge-meadow/#doc=${h.url}&key=testkey0123456789abcdef`
  const run = (fixture, args) => new Promise((resolve) => {
    execFile(process.execPath, [here('../../agent/cli.mjs'), link, ...args, '--local'], {
      env: { ...process.env, MERGE_MEADOW_OPEN_REPO: here(fixture), MERGE_MEADOW_TEST_DOC: docFile, MERGE_MEADOW_TEST_DOC_ID: h.documentId },
    }, (err, stdout, stderr) => resolve({ code: err ? err.code : 0, stdout, stderr }))
  })
  try {
    const w = await run('./b-fixture-noack-repo.mjs', ['spawn', 'sheep', '--at', '1,0,1'])
    assert.equal(w.code, 3, w.stderr)
    const out = JSON.parse(w.stdout)
    assert.match(out.error, /not acknowledged/); assert.equal(out.mode, 'local'); assert.ok(out.result?.id)
    const r = await run('./b-fixture-noack-repo.mjs', ['describe'])
    assert.equal(r.code, 0, 'a read needs no acknowledgement')
    const ok = await run('./b-fixture-open-repo.mjs', ['spawn', 'sheep'])
    assert.equal(ok.code, 0, ok.stderr)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})
