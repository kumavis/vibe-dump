// Track D: the stream-json driver (Harness) against (a) a scripted Worker
// that checks the exact frames the page writes, the shapes sdk.mjs uses, and
// (b) fake-worker.js, the full protocol double.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { Harness, HarnessExitError } from '../../src/host/harness.js'
import { FakeWorker } from '../../src/host/fake-worker.js'
import { buildArgv } from '../../src/host/invocation.js'

/** A Worker double the test drives by hand: records posts, emits messages on demand. */
class ScriptedWorker extends EventTarget {
  constructor () { super(); this.posted = []; this.waiters = []; this.terminated = false }
  postMessage (m) {
    this.posted.push(m)
    for (const w of this.waiters.splice(0)) w()
  }
  terminate () { this.terminated = true }
  emit (data) { this.dispatchEvent(new MessageEvent('message', { data })) }
  out (obj) { this.emit({ type: 'stdout', line: JSON.stringify(obj) }) }
  /** stdin frames written so far, parsed */
  get stdin () { return this.posted.filter((m) => m.type === 'stdin').map((m) => JSON.parse(m.line)) }
  async next (pred) {
    for (;;) {
      const hit = this.stdin.find(pred)
      if (hit) return hit
      await new Promise((resolve) => this.waiters.push(resolve))
    }
  }
}

const tool = { name: 'get_weather', description: 'w', inputSchema: { type: 'object', properties: { city: { type: 'string' } }, required: ['city'] }, handler: ({ city }) => `Sunny in ${city}` }

async function bootScripted (opts = {}) {
  const w = new ScriptedWorker()
  const h = new Harness({ createWorker: () => w, env: { A: '1' }, mcpServers: { page: { tools: [tool] } }, ...opts })
  const started = h.start({ timeoutMs: 2000 })
  await new Promise((resolve) => setTimeout(resolve, 0))
  const init = await w.next((m) => m.type === 'control_request' && m.request.subtype === 'initialize')
  return { w, h, started, init }
}

test('harness: boot message, initialize request, start() resolves on the initialize response', async () => {
  const { w, h, started, init } = await bootScripted()
  const boot = w.posted[0]
  assert.equal(boot.type, 'boot')
  assert.equal(boot.protocol, 1)
  assert.deepEqual(boot.env, { A: '1' })
  assert.equal(boot.cwd, '/home/user/workspace')
  assert.deepEqual(boot.argv, buildArgv({ mcpServerNames: ['page'] }))
  assert.deepEqual(init.request, { subtype: 'initialize', sdkMcpServers: ['page'] })
  assert.equal(typeof init.request_id, 'string')
  assert.equal(h.state, 'booting')
  w.out({ type: 'control_response', response: { subtype: 'success', request_id: init.request_id, response: { commands: [], models: [] } } })
  assert.deepEqual(await started, { commands: [], models: [] })
  assert.equal(h.state, 'ready')
})

test('harness: send() writes an SDK-shaped user message', async () => {
  const { w, h, started, init } = await bootScripted()
  w.out({ type: 'control_response', response: { subtype: 'success', request_id: init.request_id, response: {} } })
  await started
  const uuid = h.send('say hi')
  const msg = await w.next((m) => m.type === 'user')
  assert.deepEqual(msg, { type: 'user', message: { role: 'user', content: 'say hi' }, parent_tool_use_id: null, uuid })
  h.send([{ type: 'text', text: 'blocks' }])
  const m2 = await w.next((m) => m.type === 'user' && Array.isArray(m.message.content))
  assert.deepEqual(m2.message.content, [{ type: 'text', text: 'blocks' }])
})

test('harness: system/init resolves harness.init and emits events; result is awaited by turn()', async () => {
  const { w, h, started, init } = await bootScripted()
  w.out({ type: 'control_response', response: { subtype: 'success', request_id: init.request_id, response: {} } })
  await started
  const seen = []
  h.addEventListener('message', (e) => seen.push(e.detail.type))
  const turn = h.turn('say hi', { timeoutMs: 2000 })
  await w.next((m) => m.type === 'user')
  w.out({ type: 'system', subtype: 'init', session_id: 's1', model: 'm', tools: ['Read'], mcp_servers: [{ name: 'page', status: 'connected' }] })
  w.out({ type: 'assistant', message: { role: 'assistant', content: [{ type: 'text', text: 'hi' }] }, parent_tool_use_id: null })
  w.out({ type: 'result', subtype: 'success', is_error: false, result: 'hi' })
  const { result, messages } = await turn
  assert.equal(result.result, 'hi')
  assert.deepEqual(messages.map((m) => m.type), ['system', 'assistant', 'result'])
  assert.equal((await h.init).session_id, 's1')
  assert.equal(h.sessionId, 's1')
  assert.deepEqual(seen, ['system', 'assistant', 'result'])
})

test('harness: can_use_tool is answered allow with updatedInput and toolUseID (default policy)', async () => {
  const { w, h, started, init } = await bootScripted()
  w.out({ type: 'control_response', response: { subtype: 'success', request_id: init.request_id, response: {} } })
  await started
  w.out({ type: 'control_request', request_id: 'p1', request: { subtype: 'can_use_tool', tool_name: 'Write', input: { file_path: '/x' }, tool_use_id: 'toolu_1' } })
  const r = await w.next((m) => m.type === 'control_response' && m.response.request_id === 'p1')
  assert.deepEqual(r, { type: 'control_response', response: { subtype: 'success', request_id: 'p1', response: { behavior: 'allow', updatedInput: { file_path: '/x' }, toolUseID: 'toolu_1' } } })
  assert.equal(h.state, 'ready')
})

test('harness: the permission event can defer and deny; cancel aborts it', async () => {
  const { w, h, started, init } = await bootScripted()
  w.out({ type: 'control_response', response: { subtype: 'success', request_id: init.request_id, response: {} } })
  await started
  const asks = []
  h.addEventListener('permission', (e) => { e.preventDefault(); asks.push(e.detail) })
  w.out({ type: 'control_request', request_id: 'p2', request: { subtype: 'can_use_tool', tool_name: 'Edit', input: {}, tool_use_id: 't2' } })
  await new Promise((resolve) => setTimeout(resolve, 5))
  assert.equal(asks.length, 1)
  assert.equal(asks[0].toolName, 'Edit')
  asks[0].deny('nope')
  const r = await w.next((m) => m.type === 'control_response' && m.response.request_id === 'p2')
  assert.deepEqual(r.response.response, { behavior: 'deny', message: 'nope', toolUseID: 't2' })

  // A cancelled prompt gets no answer at all.
  w.out({ type: 'control_request', request_id: 'p3', request: { subtype: 'can_use_tool', tool_name: 'Edit', input: {}, tool_use_id: 't3' } })
  await new Promise((resolve) => setTimeout(resolve, 5))
  w.out({ type: 'control_cancel_request', request_id: 'p3' })
  await new Promise((resolve) => setTimeout(resolve, 5))
  assert.equal(asks[1].signal.aborted, true)
  asks[1].allow()
  await new Promise((resolve) => setTimeout(resolve, 5))
  assert.equal(w.stdin.filter((m) => m.type === 'control_response' && m.response.request_id === 'p3').length, 0)
})

test('harness: can_use_tool for a tool outside the page allowlist is denied unasked', async () => {
  const asked = []
  const { w, h, started, init } = await bootScripted({ canUseTool: async (name) => { asked.push(name); return { behavior: 'allow' } } })
  assert.equal(h.argv[h.argv.indexOf('--tools') + 1], 'Read,Write,Edit,Glob,Grep,NotebookEdit,Task,TodoWrite,AskUserQuestion,ExitPlanMode,Skill')
  w.out({ type: 'control_response', response: { subtype: 'success', request_id: init.request_id, response: {} } })
  await started
  const denied = []
  h.addEventListener('denied', (e) => denied.push(e.detail.toolName))
  h.addEventListener('permission', () => asked.push('event'))
  for (const [id, tool] of [['d1', 'RemoteTrigger'], ['d2', 'Bash'], ['d3', 'mcp__elsewhere__x']]) {
    w.out({ type: 'control_request', request_id: id, request: { subtype: 'can_use_tool', tool_name: tool, input: { a: 1 }, tool_use_id: `t_${id}` } })
    const r = await w.next((m) => m.type === 'control_response' && m.response.request_id === id)
    assert.equal(r.response.response.behavior, 'deny', tool)
    assert.match(r.response.response.message, new RegExp(`^${tool} is not available in this page`))
    assert.equal(r.response.response.toolUseID, `t_${id}`)
  }
  assert.deepEqual(denied, ['RemoteTrigger', 'Bash', 'mcp__elsewhere__x'])
  assert.deepEqual(asked, [], 'neither canUseTool nor the permission event saw them')
  // the page's own MCP tool and an allowed built-in still reach canUseTool
  w.out({ type: 'control_request', request_id: 'd4', request: { subtype: 'can_use_tool', tool_name: 'mcp__page__get_weather', input: {}, tool_use_id: 't_d4' } })
  assert.equal((await w.next((m) => m.type === 'control_response' && m.response.request_id === 'd4')).response.response.behavior, 'allow')
  w.out({ type: 'control_request', request_id: 'd5', request: { subtype: 'can_use_tool', tool_name: 'NotebookEdit', input: {}, tool_use_id: 't_d5' } })
  assert.equal((await w.next((m) => m.type === 'control_response' && m.response.request_id === 'd5')).response.response.behavior, 'allow')
  assert.deepEqual(asked, ['mcp__page__get_weather', 'NotebookEdit'])
})

test('harness: canUseTool option wins over events', async () => {
  const { w, h, started, init } = await bootScripted({ canUseTool: async (name, input) => ({ behavior: 'allow', updatedInput: { ...input, patched: name } }) })
  w.out({ type: 'control_response', response: { subtype: 'success', request_id: init.request_id, response: {} } })
  await started
  w.out({ type: 'control_request', request_id: 'p4', request: { subtype: 'can_use_tool', tool_name: 'Write', input: { a: 1 }, tool_use_id: 't4' } })
  const r = await w.next((m) => m.type === 'control_response' && m.response.request_id === 'p4')
  assert.deepEqual(r.response.response, { behavior: 'allow', updatedInput: { a: 1, patched: 'Write' }, toolUseID: 't4' })
  assert.equal(h.toolCalls.length, 0)
})

test('harness: mcp_message requests are answered with {mcp_response}; notifications with the SDK placeholder', async () => {
  const { w, h, started, init } = await bootScripted()
  w.out({ type: 'control_response', response: { subtype: 'success', request_id: init.request_id, response: {} } })
  await started
  const calls = []
  h.addEventListener('tool_call', (e) => calls.push(e.detail))
  w.out({ type: 'control_request', request_id: 'm1', request: { subtype: 'mcp_message', server_name: 'page', message: { jsonrpc: '2.0', id: 0, method: 'initialize', params: { protocolVersion: '2025-11-25' } } } })
  const r1 = await w.next((m) => m.type === 'control_response' && m.response.request_id === 'm1')
  assert.equal(r1.response.subtype, 'success')
  assert.equal(r1.response.response.mcp_response.result.serverInfo.name, 'page')
  w.out({ type: 'control_request', request_id: 'm2', request: { subtype: 'mcp_message', server_name: 'page', message: { jsonrpc: '2.0', method: 'notifications/initialized' } } })
  const r2 = await w.next((m) => m.type === 'control_response' && m.response.request_id === 'm2')
  assert.deepEqual(r2.response.response, { mcp_response: { jsonrpc: '2.0', result: {}, id: 0 } })
  w.out({ type: 'control_request', request_id: 'm3', request: { subtype: 'mcp_message', server_name: 'page', message: { jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'get_weather', arguments: { city: 'Oslo' } } } } })
  const r3 = await w.next((m) => m.type === 'control_response' && m.response.request_id === 'm3')
  assert.deepEqual(r3.response.response.mcp_response, { jsonrpc: '2.0', id: 5, result: { content: [{ type: 'text', text: 'Sunny in Oslo' }] } })
  assert.equal(calls.length, 1)
  assert.equal(calls[0].server, 'page')
  assert.deepEqual(calls[0].input, { city: 'Oslo' })
  w.out({ type: 'control_request', request_id: 'm4', request: { subtype: 'mcp_message', server_name: 'other', message: { jsonrpc: '2.0', id: 1, method: 'tools/list' } } })
  const r4 = await w.next((m) => m.type === 'control_response' && m.response.request_id === 'm4')
  assert.deepEqual(r4.response, { subtype: 'error', request_id: 'm4', error: 'SDK MCP server not found: other' })
})

test('harness: unsupported control requests get an error response; elicitation is declined', async () => {
  const { w, h, started, init } = await bootScripted()
  w.out({ type: 'control_response', response: { subtype: 'success', request_id: init.request_id, response: {} } })
  await started
  w.out({ type: 'control_request', request_id: 'u1', request: { subtype: 'frobnicate' } })
  const r = await w.next((m) => m.type === 'control_response' && m.response.request_id === 'u1')
  assert.deepEqual(r.response, { subtype: 'error', request_id: 'u1', error: 'Unsupported control request subtype: frobnicate' })
  w.out({ type: 'control_request', request_id: 'u2', request: { subtype: 'elicitation', mcp_server_name: 'x', message: 'q' } })
  const r2 = await w.next((m) => m.type === 'control_response' && m.response.request_id === 'u2')
  assert.deepEqual(r2.response.response, { action: 'decline' })
})

test('harness: interrupt() is a control request; errors reject', async () => {
  const { w, h, started, init } = await bootScripted()
  w.out({ type: 'control_response', response: { subtype: 'success', request_id: init.request_id, response: {} } })
  await started
  const p = h.interrupt()
  const req = await w.next((m) => m.type === 'control_request' && m.request.subtype === 'interrupt')
  w.out({ type: 'control_response', response: { subtype: 'error', request_id: req.request_id, error: 'nothing to interrupt' } })
  await assert.rejects(p, /interrupt failed: nothing to interrupt/)
})

test('harness: exit before initialize rejects start() with the stderr tail', async () => {
  const { w, h, started } = await bootScripted()
  w.emit({ type: 'stderr', chunk: 'SyntaxError: Unexpected identifier\nat chunk-x.js:1\n' })
  w.emit({ type: 'exit', code: 1 })
  await assert.rejects(started, (err) => err instanceof HarnessExitError && /code 1/.test(err.message) && /SyntaxError/.test(err.message))
  assert.equal(h.state, 'exited')
  assert.equal(w.terminated, true)
  await assert.rejects(h.init, HarnessExitError)
  assert.throws(() => h.send('x'), HarnessExitError)
})

test('harness: a Worker that fails to load (plain error event) ends start()', async () => {
  const w = new ScriptedWorker()
  const h = new Harness({ createWorker: () => w })
  const started = h.start({ timeoutMs: 2000 })
  await new Promise((resolve) => setTimeout(resolve, 0))
  w.dispatchEvent(new Event('error'))
  await assert.rejects(started, /failed to load/)
})

test('harness: a throwing Worker factory ends in exited, and turn() rejects afterwards', async () => {
  const h = new Harness({ createWorker: () => { throw new Error('no workers here') } })
  await assert.rejects(h.start(), /could not create the Worker: no workers here/)
  assert.equal(h.state, 'exited')
  await assert.rejects(h.turn('x'), HarnessExitError)
})

test('harness: start() times out when initialize is never answered', async () => {
  const w = new ScriptedWorker()
  const h = new Harness({ createWorker: () => w })
  await assert.rejects(h.start({ timeoutMs: 30 }), /did not answer initialize/)
})

test('harness: stop() closes stdin, then terminates after the grace period', async () => {
  const { w, h, started, init } = await bootScripted()
  w.out({ type: 'control_response', response: { subtype: 'success', request_id: init.request_id, response: {} } })
  await started
  const info = await h.stop({ graceMs: 20 })
  assert.ok(w.posted.some((m) => m.type === 'stdin-end'))
  assert.equal(w.terminated, true)
  assert.equal(info.signal, 'SIGKILL')
})

// --- against the full protocol double ------------------------------------

async function fakeHarness (extra = {}) {
  const worker = new FakeWorker({ bootDelayMs: 5, stepDelayMs: 1 })
  const h = new Harness({ createWorker: () => worker, env: {}, mcpServers: { page: { tools: [tool] } }, ...extra })
  await h.start({ timeoutMs: 3000 })
  return { h, worker }
}

test('fake worker: say hi -> init, assistant, result', async () => {
  const { h } = await fakeHarness()
  const { result, messages } = await h.turn('say hi', { timeoutMs: 3000 })
  assert.equal(result.is_error, false)
  const init = messages.find((m) => m.type === 'system' && m.subtype === 'init')
  assert.ok(init.tools.includes('mcp__page__get_weather'), 'MCP tool connected via mcp_message before the turn')
  assert.deepEqual(init.mcp_servers, [{ name: 'page', status: 'connected', source: 'sdk' }])
  assert.ok(messages.findIndex((m) => m.type === 'assistant') < messages.findIndex((m) => m.type === 'result'))
  await h.stop({ graceMs: 200 })
  assert.equal(h.exitInfo.code, 0)
})

test('fake worker: weather tool round trip through the page handler', async () => {
  const { h } = await fakeHarness()
  const { result } = await h.turn('please use the weather tool', { timeoutMs: 3000 })
  assert.equal(result.is_error, false)
  assert.equal(result.result, 'The weather tool said: Sunny in Paris')
  assert.equal(h.toolCalls.length, 1)
  assert.deepEqual(h.toolCalls[0].input, { city: 'Paris' })
})

test('fake worker: write a file -> fs-sync carries the file', async () => {
  const { h } = await fakeHarness()
  const syncs = []
  h.addEventListener('fs-sync', (e) => syncs.push(e.detail))
  const { result } = await h.turn('write a file', { timeoutMs: 3000 })
  assert.equal(result.is_error, false)
  assert.ok(syncs.length >= 1)
  assert.deepEqual(syncs[0].paths, ['/home/user/workspace/hello.txt'])
  assert.ok(syncs[0].snapshot instanceof Uint8Array)
})

test('fake worker: a denied permission reaches the model as an error tool_result', async () => {
  const { h } = await fakeHarness({ permissionPolicy: 'deny' })
  const { result, messages } = await h.turn('write a file', { timeoutMs: 3000 })
  assert.equal(result.result, 'The Write tool was denied.')
  const tr = messages.find((m) => m.type === 'user')
  assert.equal(tr.message.content[0].is_error, true)
})

test('fake worker: an unknown prompt ends with is_error like a 401', async () => {
  const { h } = await fakeHarness()
  const { result } = await h.turn('something else', { timeoutMs: 3000 })
  assert.equal(result.is_error, true)
})
