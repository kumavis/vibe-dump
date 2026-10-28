// Track D: the UI's pure text formatters (the DOM parts are covered by
// test/e2e.mjs --fake in Chromium).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  formatBytes, progressText, progressFraction, toolLabel, toolResultText, prettyJson,
  initSummary, resultSummary, systemLine
} from '../../src/ui/format.js'

test('format: bytes and progress', () => {
  assert.equal(formatBytes(12), '12 B')
  assert.equal(formatBytes(2048), '2.0 KB')
  assert.equal(formatBytes(293776752), '280.2 MB')
  assert.equal(formatBytes(NaN), '?')
  assert.equal(progressText({ phase: 'download', loaded: 1 << 20, total: 4 << 20 }), 'Downloading 1.0 MB of 4.0 MB')
  assert.equal(progressText({ phase: 'cache', done: 1200, total: 2846 }), 'Caching 1,200 of 2,846 files')
  assert.equal(progressText({ phase: 'parse', size: 1024 }), 'Finding the embedded JavaScript in 1.0 KB…')
  assert.equal(progressText({ phase: 'mystery' }), 'mystery…')
  assert.equal(progressText(null), '')
  assert.equal(progressFraction({ phase: 'cache', done: 1, total: 4 }), 0.25)
  assert.equal(progressFraction({ phase: 'download', loaded: 5, total: 0 }), null)
  assert.equal(progressFraction({ phase: 'done' }), 1)
  assert.equal(progressFraction({ phase: 'rewrite' }), null)
})

test('format: tools', () => {
  assert.equal(toolLabel('mcp__page__get_weather'), 'get_weather (page)')
  assert.equal(toolLabel('Write'), 'Write')
  assert.equal(toolResultText('x'), 'x')
  assert.equal(toolResultText([{ type: 'text', text: 'a' }, { type: 'image' }, { type: 'doc' }]), 'a\n[image]\n[doc]')
  assert.equal(toolResultText(null), '')
  assert.equal(prettyJson({ a: 1 }), '{\n  "a": 1\n}')
  assert.match(prettyJson('x'.repeat(50), 10), /more characters/)
  assert.equal(prettyJson(undefined), 'undefined')
})

test('format: init, result and system lines', () => {
  assert.equal(
    initSummary({ model: 'claude-sonnet-5-5', tools: ['Read', 'Write'], mcp_servers: [{ name: 'page', status: 'connected' }], claude_code_version: '2.1.311' }),
    'Session started · model claude-sonnet-5-5 · 2 tools · MCP: page (connected) · Claude Code 2.1.311')
  assert.equal(initSummary({ tools: [] }), 'Session started · 0 tools · no MCP servers')
  const ok = resultSummary({ type: 'result', subtype: 'success', is_error: false, duration_ms: 1234, num_turns: 1, usage: { input_tokens: 1000, output_tokens: 5 }, total_cost_usd: 0.0123 })
  assert.deepEqual(ok, { ok: true, text: 'Done · 1.2 s · 1 turn · 1,000 in / 5 out tokens · $0.0123', detail: '' })
  const bad = resultSummary({ type: 'result', subtype: 'success', is_error: true, result: 'API Error: 401' })
  assert.equal(bad.ok, false)
  assert.equal(bad.text, 'Error')
  assert.equal(bad.detail, 'API Error: 401')
  const maxTurns = resultSummary({ type: 'result', subtype: 'error_max_turns', is_error: true, errors: ['too many'] })
  assert.equal(maxTurns.text, 'Error (error_max_turns)')
  assert.equal(maxTurns.detail, 'too many')
  assert.equal(systemLine({ subtype: 'api_retry', attempt: 2, max_retries: 10, error_status: 529 }), 'API retry 2/10 after HTTP 529')
  assert.equal(systemLine({ subtype: 'hook_started' }), 'system/hook_started')
  assert.equal(systemLine({ subtype: 'status' }), null)
  assert.equal(systemLine({ subtype: 'thinking_tokens', estimated_tokens: 40, estimated_tokens_delta: 8 }), null)
})
