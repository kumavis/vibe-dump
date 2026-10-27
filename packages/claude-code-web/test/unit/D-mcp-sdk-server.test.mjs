// Track D: the in-process MCP server that answers Claude Code's mcp_message
// control requests (JSON-RPC 2.0: initialize, tools/list, tools/call).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  McpSdkServer, LATEST_PROTOCOL_VERSION, JSONRPC, isJsonRpcRequest, isJsonRpcNotification,
  toCallToolResult, resultText, checkInput
} from '../../src/host/mcp-sdk-server.js'

const weather = {
  name: 'get_weather',
  description: 'weather',
  inputSchema: { type: 'object', properties: { city: { type: 'string' } }, required: ['city'] },
  handler: async ({ city }) => `Sunny in ${city}`
}

test('mcp: initialize echoes a supported protocol version and advertises tools', async () => {
  const s = new McpSdkServer({ name: 'page', version: '1.2.3', tools: [weather] })
  const r = await s.handle({ jsonrpc: '2.0', id: 0, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'claude-code', version: '2.1.311' } } })
  assert.deepEqual(r, { jsonrpc: '2.0', id: 0, result: { protocolVersion: '2025-06-18', capabilities: { tools: { listChanged: true } }, serverInfo: { name: 'page', version: '1.2.3' } } })
  assert.deepEqual(s.clientInfo, { name: 'claude-code', version: '2.1.311' })
  const r2 = await new McpSdkServer({ name: 'x' }).handle({ jsonrpc: '2.0', id: 'a', method: 'initialize', params: { protocolVersion: '1999-01-01' } })
  assert.equal(r2.result.protocolVersion, LATEST_PROTOCOL_VERSION)
  assert.equal(r2.id, 'a', 'string ids are preserved')
})

test('mcp: notifications get no response; initialized is recorded', async () => {
  const s = new McpSdkServer({ name: 'page', tools: [weather] })
  assert.equal(await s.handle({ jsonrpc: '2.0', method: 'notifications/initialized' }), null)
  assert.equal(s.initialized, true)
  assert.equal(await s.handle({ jsonrpc: '2.0', method: 'notifications/cancelled', params: { requestId: 1 } }), null)
  assert.equal(await s.handle({ jsonrpc: '2.0', id: null, method: 'notifications/whatever' }), null, 'id: null is a notification')
})

test('mcp: tools/list returns name, description and inputSchema only', async () => {
  const s = new McpSdkServer({ name: 'page', tools: [weather, { name: 'noschema', handler: () => 1 }] })
  const r = await s.handle({ jsonrpc: '2.0', id: 7, method: 'tools/list', params: {} })
  assert.deepEqual(r, {
    jsonrpc: '2.0',
    id: 7,
    result: {
      tools: [
        { name: 'get_weather', description: 'weather', inputSchema: weather.inputSchema },
        { name: 'noschema', description: '', inputSchema: { type: 'object', properties: {} } }
      ]
    }
  })
})

test('mcp: tools/call runs the handler and reports the call', async () => {
  const calls = []
  const s = new McpSdkServer({ name: 'page', tools: [weather], onToolCall: (c) => calls.push(c) })
  const r = await s.handle({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'get_weather', arguments: { city: 'Paris' } } })
  assert.deepEqual(r, { jsonrpc: '2.0', id: 3, result: { content: [{ type: 'text', text: 'Sunny in Paris' }] } })
  assert.equal(calls.length, 1)
  assert.equal(calls[0].tool, 'get_weather')
  assert.deepEqual(calls[0].input, { city: 'Paris' })
  assert.equal(calls[0].error, null)
})

test('mcp: handler errors become isError results, not JSON-RPC errors', async () => {
  const s = new McpSdkServer({ name: 'page', tools: [{ name: 'boom', handler: () => { throw new Error('kaput') } }] })
  const r = await s.handle({ jsonrpc: '2.0', id: 4, method: 'tools/call', params: { name: 'boom', arguments: {} } })
  assert.deepEqual(r.result, { content: [{ type: 'text', text: 'kaput' }], isError: true })
})

test('mcp: invalid arguments are an isError result naming the problem', async () => {
  const s = new McpSdkServer({ name: 'page', tools: [weather] })
  const r = await s.handle({ jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'get_weather', arguments: {} } })
  assert.equal(r.result.isError, true)
  assert.match(r.result.content[0].text, /missing required argument "city"/)
  const r2 = await s.handle({ jsonrpc: '2.0', id: 6, method: 'tools/call', params: { name: 'get_weather', arguments: { city: 3 } } })
  assert.match(r2.result.content[0].text, /must be of type string/)
})

test('mcp: unknown tool, unknown method and malformed messages are JSON-RPC errors', async () => {
  const s = new McpSdkServer({ name: 'page', tools: [weather] })
  const unknownTool = await s.handle({ jsonrpc: '2.0', id: 8, method: 'tools/call', params: { name: 'nope', arguments: {} } })
  assert.deepEqual(unknownTool, { jsonrpc: '2.0', id: 8, error: { code: JSONRPC.INVALID_PARAMS, message: 'Tool nope not found' } })
  const noName = await s.handle({ jsonrpc: '2.0', id: 9, method: 'tools/call', params: {} })
  assert.equal(noName.error.code, JSONRPC.INVALID_PARAMS)
  const unknownMethod = await s.handle({ jsonrpc: '2.0', id: 10, method: 'resources/list' })
  assert.deepEqual(unknownMethod, { jsonrpc: '2.0', id: 10, error: { code: JSONRPC.METHOD_NOT_FOUND, message: 'Method not found: resources/list' } })
  assert.deepEqual(await s.handle({ jsonrpc: '1.0', id: 11, method: 'ping' }), { jsonrpc: '2.0', id: 11, error: { code: JSONRPC.INVALID_REQUEST, message: 'Invalid Request: expected jsonrpc "2.0" and a string method' } })
  assert.equal((await s.handle('nope')).error.code, JSONRPC.INVALID_REQUEST)
  assert.equal((await s.handle('nope')).id, null)
  assert.equal(await s.handle({ jsonrpc: '2.0', id: 12, result: {} }), null, 'responses are not answered')
  assert.deepEqual(await s.handle({ jsonrpc: '2.0', id: 13, method: 'ping' }), { jsonrpc: '2.0', id: 13, result: {} })
})

test('mcp: setTools sends notifications/tools/list_changed once initialized', async () => {
  const sent = []
  const s = new McpSdkServer({ name: 'page', tools: [weather] })
  s.connect((m) => sent.push(m))
  s.setTools([weather])
  assert.equal(sent.length, 0, 'not before the client initialized')
  await s.handle({ jsonrpc: '2.0', method: 'notifications/initialized' })
  s.setTools([])
  assert.deepEqual(sent, [{ jsonrpc: '2.0', method: 'notifications/tools/list_changed' }])
})

test('mcp: constructor validation', () => {
  assert.throws(() => new McpSdkServer({}), /name is required/)
  assert.throws(() => new McpSdkServer({ name: 'p', tools: [{ name: 'bad name', handler () {} }] }), /invalid tool name/)
  assert.throws(() => new McpSdkServer({ name: 'p', tools: [{ name: 'x' }] }), /no handler/)
  assert.throws(() => new McpSdkServer({ name: 'p', tools: [weather, weather] }), /duplicate/)
})

test('mcp: helpers', () => {
  assert.equal(isJsonRpcRequest({ method: 'a', id: 0 }), true)
  assert.equal(isJsonRpcRequest({ method: 'a', id: null }), false)
  assert.equal(isJsonRpcRequest({ method: 'a' }), false)
  assert.equal(isJsonRpcNotification({ method: 'a' }), true)
  assert.deepEqual(toCallToolResult('x'), { content: [{ type: 'text', text: 'x' }] })
  assert.deepEqual(toCallToolResult({ a: 1 }), { content: [{ type: 'text', text: '{"a":1}' }] })
  assert.deepEqual(toCallToolResult(null), { content: [{ type: 'text', text: '' }] })
  const r = { content: [{ type: 'image', data: '', mimeType: 'image/png' }] }
  assert.equal(toCallToolResult(r), r)
  assert.equal(resultText({ content: [{ type: 'text', text: 'a' }, { type: 'text', text: 'b' }] }), 'a\nb')
  assert.equal(checkInput({ type: 'object' }, []), 'arguments must be an object')
  assert.equal(checkInput({ type: 'object', properties: { n: { type: 'integer' } } }, { n: 1.5 }), 'argument "n" must be of type integer')
  assert.equal(checkInput(undefined, {}), null)
})
