// The rig tools through the real stdio MCP server in local mode (pattern of
// b-mcp): define_model with a syntax error is refused and leaves the heads
// unchanged; a good model lands, shows in `models`, resolves in `model`, a
// sheep is pointed at it, and remove_model deletes it. Then the CLI verbs.
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
import { OP_NAMES } from '../../src/doc/ops.js'
import { haveRealModels } from './b-rig-fakes.mjs'

const here = (p) => fileURLToPath(new URL(p, import.meta.url))
const skip = (!haveRealModels() || !OP_NAMES.includes('defineModel')) && 'track A\'s models.js / defineModel op are not in yet (the server process cannot use a fake)'

const MODEL = {
  extends: '',
  nodes: [{ name: 'body', shape: 'capsule', p: [0, 0.5, 0], children: [{ name: 'head', shape: 'sphere', p: [0, 0.4, 0.3] }] }],
  animations: { bob: { loop: true, tracks: { 'body.py': 'sin(t*3)*0.05', 'head.rx': [[0, -10], [0.5, 10], [1, -10]] } } },
  controller: { states: { idle: 'bob', walk: ['bob'] }, blend: 0.2 },
}

async function seededFile (title) {
  const repo = new Repo({ network: [] })
  const h = repo.create()
  h.change((d) => seedDoc(d, { title }))
  const dir = mkdtempSync(join(tmpdir(), 'mm-rig-'))
  const docFile = join(dir, 'doc.automerge')
  writeFileSync(docFile, Automerge.save(h.doc()))
  await repo.shutdown()
  return { dir, docFile, url: h.url, documentId: h.documentId }
}

test('MCP, local mode: define_model syntax error leaves heads unchanged; models / model / remove_model', { skip }, async (t) => {
  const f = await seededFile('Rig MCP')
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [here('../../agent/mcp.mjs')],
    env: { ...process.env, MERGE_MEADOW_OPEN_REPO: here('./b-fixture-open-repo.mjs'), MERGE_MEADOW_TEST_DOC: f.docFile, MERGE_MEADOW_TEST_DOC_ID: f.documentId, MERGE_MEADOW_HOST_TIMEOUT: '300' },
    stderr: 'pipe',
  })
  const client = new Client({ name: 'b-rig-mcp-test', version: '0' })
  await client.connect(transport)
  t.after(async () => { await client.close().catch(() => {}); rmSync(f.dir, { recursive: true, force: true }) })
  const call = async (name, args = {}) => {
    const r = await client.callTool({ name, arguments: args })
    const text = r.content.find((c) => c.type === 'text')?.text
    return { isError: !!r.isError, body: text ? JSON.parse(text) : null }
  }
  const names = (await client.listTools()).tools.map((x) => x.name)
  for (const n of ['define_model', 'models', 'model', 'remove_model']) assert.ok(names.includes(n), `missing tool ${n}`)

  const c = await call('connect', { link: `https://example.test/merge-meadow/#doc=${f.url}&key=testkey0123456789abcdef` })
  assert.equal(c.body.mode, 'local', JSON.stringify(c.body))
  const lib = (await call('models')).body.result
  assert.ok(lib.some((m) => m.name === 'quadruped'), JSON.stringify(lib))

  const heads0 = (await call('heads')).body.result
  const bad = await call('define_model', { name: 'blob', model: { ...MODEL, animations: { bob: { loop: true, tracks: { 'body.py': 'sin(t*3' } } } } })
  assert.equal(bad.isError, true)
  assert.match(bad.body.error, /SyntaxError|expression|\)/i)
  assert.equal(bad.body.mode, 'local')
  assert.deepEqual((await call('heads')).body.result, heads0, 'a rejected model never reaches the doc')

  const good = await call('define_model', { name: 'blob', model: MODEL })
  assert.equal(good.isError, false, JSON.stringify(good.body))
  assert.ok('durable' in good.body)
  const row = (await call('models')).body.result.find((m) => m.name === 'blob')
  assert.deepEqual(row.nodes, ['body', 'head']); assert.deepEqual(row.clips, ['bob'])
  const m = (await call('model', { name: 'blob' })).body.result
  assert.deepEqual(m.animations.bob.tracks['head.rx'], [[0, -10], [0.5, 10], [1, -10]])
  const sheep = (await call('list', { tags: ['prey'] })).body.result[0].id
  const rp = await call('replace', { id: sheep, component: 'representation', data: { kind: 'rig', model: 'blob' } })
  assert.equal(rp.isError, false, JSON.stringify(rp.body))
  assert.equal((await call('model', { name: 'nope' })).isError, true)
  assert.equal((await call('remove_model', { name: 'blob' })).isError, false)
  assert.ok(!(await call('models')).body.result.some((x) => x.name === 'blob'))
})

test('CLI, local mode: define-model, models, model', { skip }, async () => {
  const { execFile } = await import('node:child_process')
  const f = await seededFile('Rig CLI')
  const link = `https://example.test/merge-meadow/#doc=${f.url}&key=testkey0123456789abcdef`
  const run = (args) => new Promise((resolve) => {
    execFile(process.execPath, [here('../../agent/cli.mjs'), link, ...args, '--local'], {
      env: { ...process.env, MERGE_MEADOW_OPEN_REPO: here('./b-fixture-open-repo.mjs'), MERGE_MEADOW_TEST_DOC: f.docFile, MERGE_MEADOW_TEST_DOC_ID: f.documentId },
    }, (err, stdout, stderr) => resolve({ code: err ? err.code : 0, stdout, stderr }))
  })
  try {
    const list = await run(['models'])
    assert.equal(list.code, 0, list.stderr)
    assert.ok(JSON.parse(list.stdout).some((m) => m.name === 'biped'))
    const one = await run(['model', 'biped'])
    assert.equal(one.code, 0, one.stderr)
    assert.ok(Array.isArray(JSON.parse(one.stdout).nodes))
    // each CLI run opens the saved file afresh, so this checks the write is accepted, not that it persists
    const def = await run(['define-model', 'blob', JSON.stringify(MODEL)])
    assert.equal(def.code, 0, def.stderr)
    const bad = await run(['define-model', 'blob', JSON.stringify({ ...MODEL, animations: { bob: { tracks: { 'ghost.rx': '1' } } } })])
    assert.equal(bad.code, 1, 'a model with a track on a missing node is refused')
    assert.match(bad.stderr, /ghost/)
  } finally { rmSync(f.dir, { recursive: true, force: true }) }
})
