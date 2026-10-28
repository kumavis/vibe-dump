// A test double for the real Worker (src/runtime/boot.js running Claude
// Code): speaks the page<->Worker protocol of worker-protocol.md and, behind
// it, a small scripted imitation of the CLI's stream-json behaviour, so the
// host and the UI can be exercised without the extracted harness.
//
// It does NOT talk to any network and does not imitate Claude Code's
// requests; it only produces the stream-json frames the page consumes:
//
//   initialize       -> control_response with commands/models/account
//   then             -> connects every type "sdk" MCP server over mcp_message
//                       (initialize, notifications/initialized, tools/list)
//   a user message   -> system/init, then by prompt text:
//     "say hi"               thinking + text, result
//     "use the weather tool" tool_use mcp__<server>__get_weather -> can_use_tool
//                            -> tools/call -> tool_result -> text echoing it
//     "write a file"         tool_use Write -> can_use_tool -> file in the
//                            fake VFS -> fs-sync -> text
//     anything else          result with is_error (as a 401 would)
//
// ChatGPT mode (a boot message with provider.kind 'openai-responses') adds the
// token handoff of worker-protocol.md: at boot the fake asks the page for an
// access token (provider-token-request, reason 'start'), and before each turn
// again when its cached token is within 60 s of expiry ('expired'); a prompt
// containing "token refused" asks with reason 'unauthorized', as the real
// Worker does after an upstream 401. A token error ends the turn with
// is_error. `tokenRequests` and `providerToken` record what happened.
//
// Usable in-process (new FakeWorker()) wherever a Worker is expected.

import { encodeSnapshot, decodeSnapshot } from './snapshot.js'
import { HOME, WORKSPACE, randomId } from './constants.js'

const te = new TextEncoder()

export class FakeWorker extends EventTarget {
  /** @param {{bootDelayMs?: number, stepDelayMs?: number}} [o] */
  constructor ({ bootDelayMs = 20, stepDelayMs = 2 } = {}) {
    super()
    this.bootDelayMs = bootDelayMs
    this.stepDelayMs = stepDelayMs
    this.terminated = false
    this.booted = false
    this.queue = [] // stdin lines received before "boot" finished
    this.files = new Map() // path -> Uint8Array
    this.pending = new Map() // our control requests -> resolve
    this.servers = [] // sdk MCP server names
    this.mcpTools = [] // {server, name}
    this.turns = Promise.resolve()
    this.turnAbort = null
    this.outCount = 0
    this.sessionId = randomId()
    this.received = [] // every message from the page (for tests)
    this._onmessage = null
    this.provider = { kind: 'anthropic' }
    this.tokenRequests = [] // {id, reason} sent to the page
    this.tokenWaiters = new Map() // id -> resolve
    this.providerToken = null // {accessToken, expiresAt} the page gave
    this.startToken = Promise.resolve()
  }

  // --- Worker interface ----------------------------------------------------

  set onmessage (fn) {
    if (this._onmessage) this.removeEventListener('message', this._onmessage)
    this._onmessage = fn
    if (fn) this.addEventListener('message', fn)
  }

  get onmessage () { return this._onmessage }

  postMessage (msg) {
    if (this.terminated) return
    const copy = structuredClone(msg)
    setTimeout(() => { if (!this.terminated) this.#receive(copy) }, 0)
  }

  terminate () {
    this.terminated = true
    this.turnAbort?.abort()
  }

  // --- protocol ------------------------------------------------------------

  #post (data) {
    if (this.terminated) return
    setTimeout(() => { if (!this.terminated) this.dispatchEvent(new MessageEvent('message', { data })) }, 0)
  }

  #out (obj) {
    const line = JSON.stringify(obj)
    // Alternate the two stdout forms the protocol allows ({line} and raw
    // {chunk}s split mid-line) so the bridge's splitter gets exercised.
    if (++this.outCount % 2) this.#post({ type: 'stdout', line })
    else {
      const cut = Math.max(1, Math.floor(line.length / 2))
      this.#post({ type: 'stdout', chunk: line.slice(0, cut) })
      this.#post({ type: 'stdout', chunk: line.slice(cut) + '\n' })
    }
  }

  #receive (msg) {
    this.received.push(msg)
    switch (msg?.type) {
      case 'boot': return this.#boot(msg)
      case 'stdin':
        if (!this.booted) this.queue.push(msg.line)
        else this.#stdin(msg.line)
        return
      case 'stdin-end':
        this.turns = this.turns.then(() => this.#exit(0))
        return
      case 'fs-flush': return this.#fsSync([], msg.id)
      case 'signal': this.turnAbort?.abort(); return
      case 'provider-token': {
        const resolve = this.tokenWaiters.get(msg.id)
        this.tokenWaiters.delete(msg.id)
        resolve?.(msg)
      }
    }
  }

  // --- the ChatGPT token handoff ------------------------------------------------

  #askToken (reason) {
    const id = `ptr_${this.tokenRequests.length + 1}`
    this.tokenRequests.push({ id, reason })
    return new Promise((resolve) => {
      this.tokenWaiters.set(id, resolve)
      this.#post({ type: 'provider-token-request', id, reason })
    })
  }

  /** The cached token, or a new one from the page (reason given: always ask). */
  async #token (reason) {
    const t = this.providerToken
    if (!reason && t && t.expiresAt - 60_000 > Date.now()) return t
    const r = await this.#askToken(reason ?? (t ? 'expired' : 'start'))
    if (r.error) throw new Error(r.error)
    this.providerToken = { accessToken: r.accessToken, expiresAt: r.expiresAt }
    return this.providerToken
  }

  #boot (msg) {
    this.argv = msg.argv ?? []
    this.env = msg.env ?? {}
    this.cwd = msg.cwd ?? WORKSPACE
    const flag = (name) => { const i = this.argv.indexOf(name); return i >= 0 ? this.argv[i + 1] : undefined }
    this.model = flag('--model') || 'fake-model'
    this.permissionMode = flag('--permission-mode') || 'default'
    try {
      const cfg = JSON.parse(flag('--mcp-config') ?? '{}')
      for (const [name, def] of Object.entries(cfg.mcpServers ?? {})) if (def?.type === 'sdk') this.servers.push(name)
    } catch {}
    this.#post({ type: 'status', phase: 'restore-fs' })
    if (msg.fsSnapshot) {
      try {
        for (const e of decodeSnapshot(msg.fsSnapshot).entries) if (e.type === 'file') this.files.set(e.path, e.data)
      } catch (err) { this.#post({ type: 'log', level: 'warn', msg: `fake worker: snapshot not restored: ${err.message}` }) }
    }
    for (const [path, text] of Object.entries(msg.seedFiles ?? {})) if (!this.files.has(path)) this.files.set(path, te.encode(text))
    if (msg.provider?.kind) this.provider = msg.provider
    if (this.provider.kind === 'openai-responses') {
      this.startToken = this.#token('start').catch((err) => this.#post({ type: 'stderr', line: `fake worker: no ChatGPT token at start: ${err.message}` }))
    }
    this.#post({ type: 'log', level: 'info', msg: `fake worker booted: ${this.argv.length} args, ${this.files.size} files` })
    setTimeout(() => {
      if (this.terminated) return
      this.booted = true
      this.#post({ type: 'status', phase: 'run' })
      for (const line of this.queue.splice(0)) this.#stdin(line)
    }, this.bootDelayMs)
  }

  #stdin (line) {
    let msg
    try { msg = JSON.parse(line) } catch {
      this.#post({ type: 'stderr', line: `fake worker: not JSON: ${line.slice(0, 80)}` })
      return
    }
    if (msg.type === 'control_response') {
      const r = msg.response ?? {}
      this.pending.get(r.request_id)?.(r)
      this.pending.delete(r.request_id)
    } else if (msg.type === 'control_request') {
      this.#controlRequest(msg)
    } else if (msg.type === 'user') {
      this.turns = this.turns.then(() => this.#turn(msg)).catch((err) => this.#post({ type: 'stderr', line: `fake worker turn failed: ${err?.stack ?? err}` }))
    }
  }

  #respond (request_id, response, error) {
    this.#out({ type: 'control_response', response: error ? { subtype: 'error', request_id, error } : { subtype: 'success', request_id, response } })
  }

  #controlRequest ({ request_id, request }) {
    if (request.subtype === 'initialize') {
      for (const n of request.sdkMcpServers ?? []) if (!this.servers.includes(n)) this.servers.push(n)
      this.#respond(request_id, {
        commands: [],
        agents: [],
        output_style: 'default',
        available_output_styles: ['default'],
        models: [{ value: this.model, displayName: 'Fake model', description: 'fake-worker.js' }],
        account: {}
      })
      this.mcpReady = this.#connectServers()
    } else if (request.subtype === 'interrupt') {
      this.turnAbort?.abort()
      this.#respond(request_id, {})
    } else {
      this.#respond(request_id, null, `Unsupported control request subtype: ${request.subtype}`)
    }
  }

  #request (request) {
    const request_id = randomId()
    return new Promise((resolve) => {
      this.pending.set(request_id, resolve)
      this.#out({ type: 'control_request', request_id, request })
    })
  }

  async #mcp (server, message) {
    const r = await this.#request({ subtype: 'mcp_message', server_name: server, message })
    if (r.subtype !== 'success') throw new Error(r.error)
    return r.response?.mcp_response
  }

  async #connectServers () {
    let id = 0
    for (const server of this.servers) {
      try {
        const init = await this.#mcp(server, { jsonrpc: '2.0', id: id++, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'fake-cli', version: '0' } } })
        if (!init?.result) throw new Error(`initialize failed: ${JSON.stringify(init?.error)}`)
        await this.#mcp(server, { jsonrpc: '2.0', method: 'notifications/initialized' })
        const list = await this.#mcp(server, { jsonrpc: '2.0', id: id++, method: 'tools/list' })
        for (const t of list?.result?.tools ?? []) this.mcpTools.push({ server, name: t.name })
      } catch (err) {
        this.#post({ type: 'stderr', line: `fake worker: MCP server ${server} failed: ${err.message}` })
      }
    }
  }

  async #step () { await new Promise((resolve) => setTimeout(resolve, this.stepDelayMs)) }

  #assistant (content, stop = null) {
    this.#out({
      type: 'assistant',
      message: { id: `msg_fake_${randomId().slice(0, 8)}`, type: 'message', role: 'assistant', model: this.model, content, stop_reason: stop, stop_sequence: null, usage: { input_tokens: 10, output_tokens: 5 } },
      parent_tool_use_id: null,
      session_id: this.sessionId,
      uuid: randomId()
    })
  }

  #toolResult (tool_use_id, text, isError = false) {
    this.#out({
      type: 'user',
      message: { role: 'user', content: [{ type: 'tool_result', tool_use_id, content: text, is_error: isError }] },
      parent_tool_use_id: null,
      session_id: this.sessionId,
      uuid: randomId()
    })
  }

  async #permission (tool_name, input, tool_use_id) {
    const r = await this.#request({ subtype: 'can_use_tool', tool_name, input, tool_use_id, permission_suggestions: [] })
    if (r.subtype !== 'success') return { behavior: 'deny', message: r.error }
    return r.response ?? { behavior: 'deny', message: 'no answer' }
  }

  async #turn (msg) {
    await this.mcpReady
    this.turnAbort = new AbortController()
    const started = Date.now()
    const content = msg.message?.content
    const text = typeof content === 'string' ? content : (content ?? []).filter((b) => b.type === 'text').map((b) => b.text).join('\n')
    this.#out({
      type: 'system',
      subtype: 'init',
      cwd: this.cwd,
      session_id: this.sessionId,
      tools: ['Read', 'Write', 'Edit', 'Glob', 'Grep', 'TodoWrite', ...this.mcpTools.map((t) => `mcp__${t.server}__${t.name}`)],
      mcp_servers: this.servers.map((name) => ({ name, status: 'connected', source: 'sdk' })),
      model: this.model,
      permissionMode: this.permissionMode,
      slash_commands: [],
      apiKeySource: this.env.ANTHROPIC_API_KEY ? 'ANTHROPIC_API_KEY' : 'none',
      claude_code_version: '0.0.0-fake',
      output_style: 'default',
      skills: [],
      plugins: [],
      uuid: randomId()
    })
    await this.#step()
    let resultText
    let isError = false
    let turns = 1
    let tokenError = null
    if (this.provider.kind === 'openai-responses') {
      await this.startToken
      try { await this.#token(/token refused/i.test(text) ? 'unauthorized' : undefined) } catch (err) { tokenError = err }
    }
    if (tokenError) {
      isError = true
      resultText = `API Error: 401 ChatGPT sign-in: ${tokenError.message}`
      this.#assistant([{ type: 'text', text: resultText }], 'end_turn')
    } else if (/say hi/i.test(text)) {
      this.#assistant([{ type: 'thinking', thinking: 'The user is greeting me.', signature: '' }])
      await this.#step()
      resultText = 'Hi! (from the fake worker)'
      this.#assistant([{ type: 'text', text: resultText }], 'end_turn')
    } else if (/use the weather tool/i.test(text)) {
      const tool = this.mcpTools.find((t) => t.name === 'get_weather')
      if (!tool) {
        resultText = 'No get_weather tool is connected.'
        this.#assistant([{ type: 'text', text: resultText }], 'end_turn')
      } else {
        turns = 2
        const id = `toolu_fake_${randomId().slice(0, 8)}`
        const input = { city: 'Paris' }
        this.#assistant([{ type: 'tool_use', id, name: `mcp__${tool.server}__get_weather`, input }], 'tool_use')
        const decision = await this.#permission(`mcp__${tool.server}__get_weather`, input, id)
        let said
        if (decision.behavior !== 'allow') {
          said = decision.message
          this.#toolResult(id, said, true)
        } else {
          const r = await this.#mcp(tool.server, { jsonrpc: '2.0', id: 100, method: 'tools/call', params: { name: 'get_weather', arguments: decision.updatedInput ?? input } })
          said = r?.error ? r.error.message : (r?.result?.content ?? []).filter((b) => b.type === 'text').map((b) => b.text).join('\n')
          this.#toolResult(id, said, Boolean(r?.error || r?.result?.isError))
        }
        await this.#step()
        resultText = `The weather tool said: ${said}`
        this.#assistant([{ type: 'text', text: resultText }], 'end_turn')
      }
    } else if (/write a file/i.test(text)) {
      turns = 2
      const id = `toolu_fake_${randomId().slice(0, 8)}`
      const input = { file_path: `${WORKSPACE}/hello.txt`, content: 'hello from Claude Code Web\n' }
      this.#assistant([{ type: 'tool_use', id, name: 'Write', input }], 'tool_use')
      const decision = await this.#permission('Write', input, id)
      if (decision.behavior === 'allow') {
        const final = decision.updatedInput ?? input
        this.files.set(final.file_path, te.encode(final.content))
        this.#fsSync([final.file_path])
        this.#toolResult(id, `File created successfully at: ${final.file_path}`)
        resultText = `Wrote ${final.file_path}.`
      } else {
        this.#toolResult(id, decision.message, true)
        resultText = 'The Write tool was denied.'
      }
      await this.#step()
      this.#assistant([{ type: 'text', text: resultText }], 'end_turn')
    } else {
      isError = true
      resultText = 'Failed to authenticate. API Error: 401 (the fake worker has no scenario for this prompt)'
      this.#assistant([{ type: 'text', text: resultText }], 'end_turn')
    }
    await this.#step()
    this.#out({
      type: 'result',
      subtype: 'success',
      is_error: isError,
      duration_ms: Date.now() - started,
      duration_api_ms: 1,
      num_turns: turns,
      result: resultText,
      session_id: this.sessionId,
      total_cost_usd: 0,
      usage: { input_tokens: 10 * turns, output_tokens: 5 * turns, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 },
      permission_denials: [],
      uuid: randomId()
    })
  }

  #fsSync (paths, flush) {
    const entries = []
    const dirs = new Set()
    for (const p of this.files.keys()) {
      if (!p.startsWith(`${HOME}/`)) continue
      for (let d = p.slice(0, p.lastIndexOf('/')); d.length >= HOME.length; d = d.slice(0, d.lastIndexOf('/'))) dirs.add(d)
    }
    for (const d of [...dirs].sort()) entries.push({ path: d, type: 'dir', mode: 0o755, mtimeMs: Date.now() })
    for (const [path, data] of [...this.files].sort()) if (path.startsWith(`${HOME}/`)) entries.push({ path, type: 'file', mode: 0o644, mtimeMs: Date.now(), data })
    const bytes = encodeSnapshot({ version: 1, roots: [HOME], entries })
    this.#post({ type: 'fs-sync', snapshot: bytes, paths, ...(flush != null ? { flush } : {}) })
  }

  #exit (code) {
    this.#fsSync([])
    this.#post({ type: 'exit', code })
  }
}
