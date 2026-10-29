#!/usr/bin/env node
// stdio MCP server (design §6.3). The link comes from MERGE_MEADOW_LINK or the
// `connect` tool:   claude mcp add merge-meadow -- node <abs path>/agent/mcp.mjs
// Every result carries { mode: 'live'|'local', fallbackReason }. Local writes
// return only after the sync server acknowledged them (synced()), with
// durable: true, or durable: false + syncWarning when it did not; a live host
// that stops answering drops the connection so the next call reconnects.
import { connect } from './lib/connect.mjs' // first: installs the assert/HandledPromise shims
import { tools } from './lib/tools.mjs'
import { buildLink } from '../src/net/link.js'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { E, Far } from '@endo/far'

const CALL_TIMEOUT_MS = Number(process.env.MERGE_MEADOW_CALL_TIMEOUT ?? 20000)
const RING = 500

let conn = null
let connecting = null
// bounded ring of change events, each with a seq; `events` returns those after a cursor
const ring = []; let seq = 0; let cursor = 0; let dropped = 0

const meta = () => ({ mode: conn?.mode ?? null, fallbackReason: conn?.fallbackReason ?? null })
const text = (v) => ({ content: [{ type: 'text', text: JSON.stringify(v ?? null) }] })
const fail = (e) => ({ isError: true, content: [{ type: 'text', text: JSON.stringify({ error: String(e?.message ?? e), ...meta() }) }] })
// the timeout error is marked, so only a host that really went quiet drops the connection
// (matching the message text would also drop it for a refused op that merely mentions "closed")
const withTimeout = (p, ms, msg) => { let t; return Promise.race([p, new Promise((_, rej) => { t = setTimeout(() => rej(Object.assign(new Error(msg), { hostTimeout: true })), ms) })]).finally(() => clearTimeout(t)) }

async function doConnect (link, opts = {}) {
  const old = conn; conn = null
  await old?.close().catch(() => {})
  const c = await connect(link, opts)
  conn = c
  const listener = Far('Listener', {
    onEvents (evts) {
      for (const e of evts) { ring.push({ seq: ++seq, t: Date.now(), ...e }); if (ring.length > RING) { ring.shift(); dropped++ } }
    },
  })
  await E(c.world).subscribe(listener, {}).catch(() => {})
  c.closedLive?.then(() => { if (conn === c) conn = null })
  return { ...meta(), role: c.role, doc: c.link.docUrl, host: c.host, timings: c.timings }
}

async function need () {
  if (conn && !conn.isClosed) return conn
  if (!process.env.MERGE_MEADOW_LINK) throw new Error('not connected: call `connect` with the scene link first (or set MERGE_MEADOW_LINK)')
  connecting ??= doConnect(process.env.MERGE_MEADOW_LINK).finally(() => { connecting = null })
  await connecting
  return conn
}

const server = new McpServer({ name: 'merge-meadow', version: '0.1.0' })

server.registerTool('connect', {
  description: 'Connect to a Merge Meadow world. link = https://…/merge-meadow/#doc=automerge:<id>&key=<secret>[&sync=<ws url>] (or &view=<secret> for read-only). Uses the live page when one answers (mode "live"), else edits the doc directly (mode "local": no capture/eval/explain).',
  inputSchema: { link: z.string(), local: z.boolean().optional() },
}, async ({ link, local }) => {
  try { return text(await doConnect(link, { local })) } catch (e) { return fail(e) }
})

server.registerTool('events', {
  description: 'Change events (entity-added/-removed/-changed, component-changed, system-changed, preset-changed, …) since the last call, oldest first. Filters: types, ids. since: a seq to read after instead of the cursor.',
  inputSchema: { max: z.number().int().positive().optional(), since: z.number().int().optional(), types: z.array(z.string()).optional(), ids: z.array(z.string()).optional() },
}, async ({ max = 50, since, types, ids }) => {
  try {
    await need()
    const from = since ?? cursor
    const after = ring.filter((e) => e.seq > from)
    const hits = after.filter((e) => (!types || types.includes(e.type)) && (!ids || (e.id != null && ids.includes(e.id)))).slice(0, max)
    // advance past everything inspected, matched or not, up to the last returned when truncated
    const last = hits.length === max ? hits[hits.length - 1].seq : (after.length ? after[after.length - 1].seq : from)
    if (since == null) cursor = Math.max(cursor, last)
    return text({ events: hits, cursor: last, more: after.some((e) => e.seq > last), droppedSinceStart: dropped, ...meta() })
  } catch (e) { return fail(e) }
})

for (const [name, t] of Object.entries(tools)) {
  server.registerTool(name, { description: t.description, inputSchema: t.input }, async (args) => {
    let c
    try {
      c = await need()
      const out = await withTimeout(Promise.resolve(t.run(c.world, args ?? {})), CALL_TIMEOUT_MS, `the ${c.mode} world did not answer within ${CALL_TIMEOUT_MS} ms`)
      if (t.image) {
        const m = /^data:([^;]+);base64,(.*)$/s.exec(String(out))
        if (!m) throw new Error('capture returned no image')
        return { content: [{ type: 'image', mimeType: m[1], data: m[2] }, { type: 'text', text: JSON.stringify(meta()) }] }
      }
      const res = { result: out ?? null, ...meta() }
      if (name === 'heads') res.versionLink = buildLink({ docUrl: c.link.docUrl, sync: c.link.sync, heads: out }, c.linkBase)
      // local writes say whether the sync server holds them: durable false means the
      // write may be lost (the agent should not assume it landed for others)
      if (t.write && c.mode === 'local') {
        try { res.syncedMs = await c.synced(5000); res.durable = true } catch (e) { res.durable = false; res.syncWarning = `write not acknowledged by the sync server; it may be lost (${e.message})` }
      }
      return text(res)
    } catch (e) {
      // a live host that went quiet: drop it so the next call reconnects (maybe locally)
      if (c?.mode === 'live' && (e?.hostTimeout || c.isClosed)) { if (conn === c) conn = null; c.close().catch(() => {}) }
      return fail(e)
    }
  })
}

const shutdown = async () => { await conn?.close().catch(() => {}); process.exit(0) }
const transport = new StdioServerTransport()
transport.onclose = shutdown
process.stdin.on('end', shutdown)
process.on('SIGTERM', shutdown)
server.connect(transport).catch((e) => { console.error('[merge-meadow mcp]', e); process.exit(1) })
