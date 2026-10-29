// agent/lib/connect.mjs — shared by mcp.mjs and cli.mjs (design §6.3, §16.7).
// parse link -> repo (websocket only, no storage) -> find doc -> try the live host
// (sealed CapTP on the scene doc's ephemeral channel) for hostTimeoutMs -> else
// fall back to the SAME world-caps applied locally to the doc. Every verb except
// capture/logs/eval/explain works without a page; local writes are durable only
// once the sync server has acknowledged them, which synced() waits for.
//
// The shims come first: CapTP needs a global `assert` and `HandledPromise`, and
// both must exist before anything from @endo evaluates (S1/S3).
import 'ses/assert-shim.js'
import '@endo/eventual-send/shim.js'
import vm from 'node:vm'
import { pathToFileURL } from 'node:url'
import { Repo } from '@automerge/automerge-repo' // full entry: initialises the wasm for the slim users too
import { WebSocketClientAdapter } from '@automerge/automerge-repo-network-websocket'
import { connectCapTP, aesKey, randomId } from '../../src/agent/transport.js'
import { makeWorldCaps } from '../../src/agent/world-caps.js'
import { parseLink, docIdOf } from '../../src/net/link.js'
import { findDoc, whenSynced, trackServer, serverStorageId } from '../../src/net/repo.js'
import { applyOps } from '../../src/doc/ops.js'
import * as read from '../../src/doc/read.js'

const withTimeout = (p, ms, msg) => {
  let t
  return Promise.race([p, new Promise((_, rej) => { t = setTimeout(() => rej(new Error(msg)), ms) })]).finally(() => clearTimeout(t))
}

// Node repo: one websocket to the link's sync server, no storage (the server holds the doc).
export async function openNodeRepo (sync, { peerId } = {}) {
  const ws = new WebSocketClientAdapter(sync)
  const info = trackServer(ws, null)
  const repo = new Repo({ network: [ws], ...(peerId ? { peerId } : {}) })
  info.repo = repo
  await withTimeout(new Promise((resolve) => repo.networkSubsystem.once('peer', resolve)), 10000, `cannot reach sync server ${sync}`)
  return { repo, storageId: () => serverStorageId(ws), close: () => repo.shutdown() }
}

// MERGE_MEADOW_OPEN_REPO=<module path> swaps the repo factory (tests run the MCP
// server as a child process against an in-process repo this way).
async function resolveOpenRepo (openRepo) {
  if (openRepo) return openRepo
  const mod = process.env.MERGE_MEADOW_OPEN_REPO
  if (!mod) return openNodeRepo
  const m = await import(pathToFileURL(mod).href)
  if (typeof m.openRepo !== 'function') throw new Error(`${mod} does not export openRepo`)
  return m.openRepo
}

// track A's lowering for the check (a function expression around the body, not
// invoked); a stand-in only if that module is missing
let lowerForCheck = null
async function loadLower () {
  if (lowerForCheck) return lowerForCheck
  try { ({ lowerForCheck } = await import('../../src/scripts/lower.js')) } catch {
    lowerForCheck = (src) => `(function () {\n${String(src).replace(/^([ \t]*)export\s+default\s+/m, '$1return ')}\n})`
  }
  return lowerForCheck
}

// What the page's Compartment would reject, checked without one: SES refuses
// `import(`, `eval(` and HTML comment tokens at compile time, then the lowered
// body must parse. Compile only; nothing runs.
export function makeNodeCheckSource (lower) {
  return (source) => {
    const s = String(source ?? '')
    // SES's own rejection patterns, so this refuses what the page's Compartment refuses
    if (/(^|[^.])\bimport(\s*(?:\(|\/[/*]))/m.test(s)) throw new SyntaxError('dynamic import( is not allowed in doc systems')
    if (/(^|[^.]|\.\.\.)\beval(\s*(?:\(|\/[/*]))/m.test(s)) throw new SyntaxError('eval( is not allowed in doc systems')
    if (/(?:<!--|-->)/.test(s)) throw new SyntaxError('HTML comment tokens are not allowed in doc systems')
    // eslint-disable-next-line no-new
    new vm.Script(lower(s), { filename: 'doc-system.js' })
    return true
  }
}

export async function connect (link, {
  hostTimeoutMs = Number(process.env.MERGE_MEADOW_HOST_TIMEOUT ?? 1500),
  findTimeoutMs = 20000, local = false, openRepo, peerId = 'agent_' + randomId(6),
} = {}) {
  const t0 = performance.now(); const t = {}
  const L = parseLink(link)
  if (!L.docUrl) throw new Error('link needs #doc=automerge:<id>')
  const open = await resolveOpenRepo(openRepo)
  const opened = await open(L.sync, { peerId })
  const repo = opened.repo
  const storageId = () => (typeof opened.storageId === 'function' ? opened.storageId() : opened.storageId)
  t.repoMs = performance.now() - t0
  const handle = await findDoc(repo, L.docUrl, { tries: 4, attemptTimeoutMs: findTimeoutMs })
  t.findMs = performance.now() - t0 - t.repoMs
  const docId = docIdOf(L.docUrl)
  const role = L.key ? 'editor' : L.view ? 'viewer' : 'none'
  const secret = L.key || L.view

  let world; let conn = null; let mode; let fallbackReason = null; let localCaps = null; let wrote = false
  if (secret && !local) {
    try {
      conn = await connectCapTP(handle, await aesKey(secret, docId), { timeoutMs: hostTimeoutMs })
      world = conn.bootstrap; mode = 'live'
    } catch (e) { fallbackReason = e.message }
  } else fallbackReason = local ? 'local mode forced' : 'link has no key: no host page can be reached'
  t.hostMs = performance.now() - t0 - t.repoMs - t.findMs

  if (!world) {
    const checkSource = makeNodeCheckSource(await loadLower())
    const localApply = (...args) => { const r = applyOps(...args); wrote = true; return r }
    localCaps = makeWorldCaps(handle, { applyOps: localApply, read, checkSource, mode: 'local', peerId })
    world = role === 'viewer' ? localCaps.viewer : localCaps.world // attenuate locally too (§16.8)
    mode = 'local'
  }

  // Local writes are durable only once the sync server acknowledged them (§16.7).
  // A server that never advertised a storage id cannot confirm anything: that is
  // an error, not an instant success. A repo with no server at all (opened.noServer,
  // e.g. the in-process test fixture) has nothing to confirm against: null.
  const synced = (ms = 5000) => {
    const sid = storageId()
    if (!sid && !opened.noServer) return Promise.reject(Object.assign(new Error('the sync server has not advertised a storage id, so the write cannot be confirmed'), { unacked: true }))
    return whenSynced(handle, sid, { timeoutMs: ms }).catch((e) => { throw Object.assign(e, { unacked: true }) })
  }
  const timings = Object.fromEntries(Object.entries({ ...t, totalMs: performance.now() - t0 }).map(([k, v]) => [k, +v.toFixed(1)]))
  let closed = false
  return {
    world, mode, role, handle, repo, link: L, linkBase: String(link).split('#')[0], timings, fallbackReason, synced, host: conn?.host ?? null,
    get isClosed () { return closed || !!conn?.isClosed },
    closedLive: conn?.closed ?? null,
    // rejects (after cleaning up) when local writes were not acknowledged: closing
    // the repo then may lose them, and the caller should say so
    async close () {
      if (closed) return
      closed = true
      let unacked = null
      if (mode === 'local') await synced(5000).catch((e) => { if (wrote) unacked = e })
      await conn?.close().catch(() => {})
      localCaps?.close()
      await (opened.close ? opened.close() : repo.shutdown()).catch?.(() => {})
      if (unacked) throw Object.assign(new Error(`local writes were not acknowledged by the sync server and may be lost: ${unacked.message}`), { unacked: true })
    },
  }
}
