// The stream-json driver: the page plays the part the Claude Agent SDK plays
// for the CLI (its Query class in sdk.mjs is the reference). Claude Code runs
// in a Worker as `cli -p --input-format stream-json --output-format
// stream-json ...`; every line either way is one JSON object.
//
//   page -> CLI   {type:'user', message:{role:'user', content}, parent_tool_use_id:null, uuid}
//                 {type:'control_request', request_id, request:{subtype:'initialize'|'interrupt', ...}}
//                 {type:'control_response', response:{subtype:'success'|'error', request_id, response|error}}
//   CLI -> page   system/init, assistant, user (tool results), result, ... (the SDKMessage union)
//                 {type:'control_request', request_id, request:{subtype:'can_use_tool'|'mcp_message', ...}}
//                 {type:'control_response', ...} answering ours
//                 {type:'control_cancel_request', request_id}
//
// Note on `system/init`: the CLI emits it at the start of each turn (when it
// processes a user message), not at process start. So start() resolves when
// the CLI answers the `initialize` control request (it is up and reading
// stdin), and `harness.init` resolves on the first system/init.
//
// Events (CustomEvent, payload in `detail`):
//   'message'     every parsed stream-json object, as is
//   'init'        a system/init message
//   'result'      a result message
//   'tool_call'   {server, tool, input, result, error, durationMs} after a page tool ran
//   'permission'  {request, toolName, input, signal, resolve(decision), allow(updatedInput?), deny(message?)}
//                 cancelable: call event.preventDefault() to answer later via resolve()
//   'permission_cancelled' {request_id}
//   'ready'       the initialize response
//   'stderr' {line}, 'stdout_text' {line} (non-JSON stdout), 'log', 'status', 'fs-sync', 'error'
//   'exit'        {code, signal, error, stderrTail}

import { WorkerBridge } from './worker-bridge.js'
import { McpSdkServer, isJsonRpcRequest } from './mcp-sdk-server.js'
import { buildArgv } from './invocation.js'
import { WORKSPACE, randomId } from './constants.js'

const STDERR_KEEP = 400
/** Marker: leave a control request unanswered (the SDK's behaviour for some subtypes). */
const SILENT = Symbol('silent')

export class HarnessExitError extends Error {
  constructor (info) {
    const tail = info?.stderrTail?.length ? `\n${info.stderrTail.slice(-15).join('\n')}` : ''
    super(`Claude Code exited (code ${info?.code ?? 'null'}${info?.signal ? `, ${info.signal}` : ''})${info?.error ? `: ${info.error}` : ''}${tail}`)
    this.name = 'HarnessExitError'
    this.info = info
  }
}

export class ControlRequestError extends Error {
  constructor (subtype, message) { super(`control request ${subtype} failed: ${message}`); this.name = 'ControlRequestError' }
}

function normaliseDecision (decision, input, toolUseId) {
  const d = decision && typeof decision === 'object' ? decision : { behavior: decision === true || decision === 'allow' ? 'allow' : 'deny' }
  if (d.behavior === 'allow') {
    const out = { behavior: 'allow', updatedInput: d.updatedInput ?? input }
    if (d.updatedPermissions) out.updatedPermissions = d.updatedPermissions
    if (toolUseId) out.toolUseID = toolUseId
    return out
  }
  const out = { behavior: 'deny', message: d.message || 'The user denied this tool call in the page.' }
  if (d.interrupt) out.interrupt = true
  if (toolUseId) out.toolUseID = toolUseId
  return out
}

export class Harness extends EventTarget {
  /**
   * @param {object} o
   * @param {string|URL} [o.workerUrl]   module Worker script (BASE/runtime/boot.js)
   * @param {() => object} [o.createWorker]  alternative to workerUrl: returns a Worker-like object (tests, fake-worker.js)
   * @param {object} [o.env]             process.env for the CLI (invocation.js buildEnv)
   * @param {string[]} [o.argv]          CLI arguments; default buildArgv({model, mcpServerNames})
   * @param {string} [o.model]           used only when argv is not given
   * @param {object} [o.mcpServers]      { [name]: { tools: [{name, description, inputSchema, handler}] } | McpSdkServer }
   * @param {object} [o.boot]            extra fields for the Worker boot message (manifest, fsSnapshot, seedFiles, base, appUrl, ...)
   * @param {Transferable[]} [o.transfer] transferables in `boot`
   * @param {string} [o.cwd]
   * @param {(toolName, input, ctx) => Promise<object>} [o.canUseTool]  answers permission prompts; else the 'permission' event, else `permissionPolicy`
   * @param {'allow'|'deny'} [o.permissionPolicy]  default answer when nobody handles 'permission' (default 'allow': no shell, VFS only)
   * @param {object} [o.initialize]      extra fields for the initialize control request
   */
  constructor ({ workerUrl, createWorker, env = {}, argv, model = '', mcpServers = {}, boot = {}, transfer = [], cwd = WORKSPACE, canUseTool, permissionPolicy = 'allow', initialize = {} } = {}) {
    super()
    if (!workerUrl && !createWorker) throw new TypeError('Harness: workerUrl or createWorker is required')
    this.workerUrl = workerUrl ? String(workerUrl) : null
    this.createWorker = createWorker ?? null
    this.env = { ...env }
    this.cwd = cwd
    this.bootExtra = boot
    this.transfer = transfer
    this.canUseTool = canUseTool ?? null
    this.permissionPolicy = permissionPolicy
    this.initializeExtra = initialize

    this.servers = new Map()
    for (const [name, def] of Object.entries(mcpServers)) {
      const server = def instanceof McpSdkServer ? def : new McpSdkServer({ name, tools: def?.tools ?? [] })
      this.#attachServer(name, server)
    }
    this.argv = argv ? [...argv] : buildArgv({ model, mcpServerNames: [...this.servers.keys()] })

    this.state = 'idle' // idle | booting | ready | exited
    this.bridge = null
    this.messages = []
    this.stderr = []
    this.toolCalls = []
    this.initMessage = null
    this.initializeResponse = null
    this.sessionId = null
    this.exitInfo = null
    this.pending = new Map() // our control requests: request_id -> {resolve, reject, subtype}
    this.inbound = new Map() // CLI's control requests in flight: request_id -> AbortController
    this.init = new Promise((resolve, reject) => { this._initResolve = resolve; this._initReject = reject })
    this.init.catch(() => {})
    this.exited = new Promise((resolve) => { this._exitResolve = resolve })
  }

  #attachServer (name, server) {
    const previous = server.onToolCall
    server.onToolCall = (call) => {
      const detail = { server: name, ...call }
      this.toolCalls.push(detail)
      try { previous?.(call) } catch {}
      this.#emit('tool_call', detail)
    }
    server.connect((message) => this.#sendMcpToCli(name, message))
    this.servers.set(name, server)
  }

  /**
   * Boot the Worker, send `initialize` and wait for the CLI to answer it.
   * @returns {Promise<object>} the initialize response (commands, models, account, ...)
   */
  async start ({ timeoutMs = 120_000 } = {}) {
    if (this.state !== 'idle') throw new Error(`Harness.start: already ${this.state}`)
    this.state = 'booting'
    let worker
    try {
      worker = this.createWorker ? await this.createWorker() : new Worker(this.workerUrl, { type: 'module', name: 'claude-code' })
    } catch (err) {
      this.#onExit({ code: null, signal: null, error: `could not create the Worker: ${err?.message ?? err}` })
      throw new HarnessExitError(this.exitInfo)
    }
    const bridge = this.bridge = new WorkerBridge(worker)
    bridge.addEventListener('stdout', (e) => this.#onLine(e.detail.line))
    bridge.addEventListener('stderr', (e) => {
      this.stderr.push(e.detail.line)
      if (this.stderr.length > STDERR_KEEP) this.stderr.splice(0, this.stderr.length - STDERR_KEEP)
      this.#emit('stderr', e.detail)
    })
    for (const type of ['log', 'status', 'fs-sync', 'error']) bridge.addEventListener(type, (e) => this.#emit(type, e.detail))
    bridge.addEventListener('exit', (e) => this.#onExit(e.detail))

    bridge.boot({ ...this.bootExtra, argv: this.argv, env: this.env, cwd: this.cwd }, this.transfer)

    // As the SDK does: initialize goes first; the Worker buffers stdin until
    // the CLI reads it. sdkMcpServers names the in-process servers (the same
    // names --mcp-config declares as type "sdk"; the CLI merges the two).
    const names = [...this.servers.keys()]
    const initRequest = { subtype: 'initialize', ...(names.length ? { sdkMcpServers: names } : {}), ...this.initializeExtra }
    let timer
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Claude Code did not answer initialize within ${Math.round(timeoutMs / 1000)} s` +
        (this.stderr.length ? `\n${this.stderr.slice(-10).join('\n')}` : ''))), timeoutMs)
    })
    try {
      this.initializeResponse = await Promise.race([this.request(initRequest), timeout])
    } catch (err) {
      if (this.state !== 'exited') this.stop({ graceMs: 0 })
      throw err
    } finally {
      clearTimeout(timer)
    }
    this.state = 'ready'
    this.#emit('ready', this.initializeResponse)
    return this.initializeResponse
  }

  /**
   * Send a user message. Accepts a string, a content-block array, a
   * {role, content} message or a full {type:'user', ...} object.
   * @returns {string} the message uuid
   */
  send (userMessage) {
    let msg
    if (typeof userMessage === 'string' || Array.isArray(userMessage)) {
      msg = { type: 'user', message: { role: 'user', content: userMessage }, parent_tool_use_id: null }
    } else if (userMessage && userMessage.type === 'user') {
      msg = { parent_tool_use_id: null, ...userMessage }
    } else if (userMessage && 'content' in userMessage) {
      msg = { type: 'user', message: { role: 'user', ...userMessage }, parent_tool_use_id: null }
    } else {
      throw new TypeError('Harness.send: expected a string, content blocks or a user message')
    }
    if (!msg.uuid) msg.uuid = randomId()
    this.#write(msg)
    return msg.uuid
  }

  /** Send and wait for the turn's `result`. Resolves {result, messages, uuid}. */
  turn (userMessage, { timeoutMs = 300_000 } = {}) {
    const from = this.messages.length
    const done = this.waitFor((m) => m.type === 'result', { timeoutMs, fromIndex: from })
    let uuid
    try {
      uuid = this.send(userMessage)
    } catch (err) {
      done.catch(() => {})
      return Promise.reject(err)
    }
    return done.then((result) => ({ result, uuid, messages: this.messages.slice(from) }))
  }

  /**
   * First message (at or after `fromIndex`, default: from now on) matching
   * the predicate. Rejects if the process exits first or on timeout.
   */
  waitFor (predicate, { timeoutMs = 60_000, fromIndex } = {}) {
    const start = fromIndex ?? this.messages.length
    for (let i = start; i < this.messages.length; i++) if (predicate(this.messages[i])) return Promise.resolve(this.messages[i])
    if (this.state === 'exited') return Promise.reject(new HarnessExitError(this.exitInfo))
    return new Promise((resolve, reject) => {
      const onMessage = (e) => { if (predicate(e.detail)) { cleanup(); resolve(e.detail) } }
      const onExit = () => { cleanup(); reject(new HarnessExitError(this.exitInfo)) }
      const timer = setTimeout(() => { cleanup(); reject(new Error(`timed out after ${timeoutMs} ms waiting for a stream-json message`)) }, timeoutMs)
      const cleanup = () => {
        clearTimeout(timer)
        this.removeEventListener('message', onMessage)
        this.removeEventListener('exit', onExit)
      }
      this.addEventListener('message', onMessage)
      this.addEventListener('exit', onExit)
    })
  }

  /** Ask the CLI to stop the current turn (control_request subtype "interrupt"). */
  interrupt () { return this.request({ subtype: 'interrupt' }) }

  /** Close stdin, give the CLI `graceMs` to exit, then terminate the Worker. */
  async stop ({ graceMs = 1500 } = {}) {
    if (!this.bridge || this.state === 'exited') return this.exitInfo
    this.bridge.endInput()
    if (graceMs > 0) {
      let timer
      await Promise.race([this.exited, new Promise((resolve) => { timer = setTimeout(resolve, graceMs) })])
      clearTimeout(timer)
    }
    if (this.state !== 'exited') this.bridge.terminate()
    return this.exitInfo
  }

  /** Send a control request to the CLI; resolves with its `response` payload. */
  request (request) {
    if (!this.bridge || this.state === 'exited') return Promise.reject(new HarnessExitError(this.exitInfo))
    const request_id = randomId()
    return new Promise((resolve, reject) => {
      this.pending.set(request_id, { resolve, reject, subtype: request.subtype })
      this.#write({ type: 'control_request', request_id, request })
    })
  }

  /** Ask the Worker for an fs-sync now (the workspace listing refreshes on the event). */
  flushFs () { this.bridge?.flushFs() }

  // --- internals ---------------------------------------------------------

  #write (obj) {
    if (!this.bridge || this.state === 'exited') throw new HarnessExitError(this.exitInfo)
    this.bridge.writeLine(JSON.stringify(obj))
  }

  #onLine (line) {
    if (!line.trim()) return
    let msg
    try { msg = JSON.parse(line) } catch {
      this.#emit('stdout_text', { line })
      return
    }
    if (!msg || typeof msg !== 'object') { this.#emit('stdout_text', { line }); return }
    this.messages.push(msg)
    this.#emit('message', msg)
    switch (msg.type) {
      case 'control_response': this.#onControlResponse(msg.response ?? {}); break
      case 'control_request': this.#onControlRequest(msg); break
      case 'control_cancel_request': {
        const ctl = this.inbound.get(msg.request_id)
        if (ctl) { ctl.abort(new Error('cancelled by Claude Code')); this.inbound.delete(msg.request_id) }
        this.#emit('permission_cancelled', { request_id: msg.request_id })
        break
      }
      case 'system':
        if (msg.subtype === 'init') {
          this.initMessage = msg
          this.sessionId = msg.session_id ?? this.sessionId
          this._initResolve(msg)
          this.#emit('init', msg)
        }
        break
      case 'result': this.#emit('result', msg); break
    }
  }

  #onControlResponse (response) {
    const p = this.pending.get(response.request_id)
    if (!p) return
    this.pending.delete(response.request_id)
    if (response.subtype === 'success') p.resolve(response.response ?? {})
    else p.reject(new ControlRequestError(p.subtype, response.error ?? 'unknown error'))
  }

  async #onControlRequest (msg) {
    const { request_id: id, request = {} } = msg
    if (this.inbound.has(id)) return // duplicate delivery of an in-flight request
    const ctl = new AbortController()
    this.inbound.set(id, ctl)
    let reply
    try {
      const response = await this.#processControlRequest(request, ctl.signal)
      if (response === SILENT) return
      reply = { type: 'control_response', response: { subtype: 'success', request_id: id, response } }
    } catch (err) {
      if (ctl.signal.aborted) return // cancelled: the CLI no longer waits for an answer
      reply = { type: 'control_response', response: { subtype: 'error', request_id: id, error: err?.message ?? String(err) } }
    } finally {
      this.inbound.delete(id)
    }
    try { this.#write(reply) } catch {}
  }

  async #processControlRequest (request, signal) {
    switch (request.subtype) {
      case 'can_use_tool': return this.#permission(request, signal)
      case 'mcp_message': {
        const server = this.servers.get(request.server_name)
        if (!server) throw new Error(`SDK MCP server not found: ${request.server_name}`)
        if (isJsonRpcRequest(request.message)) return { mcp_response: await server.handle(request.message, { signal }) }
        await server.handle(request.message, { signal })
        return { mcp_response: { jsonrpc: '2.0', result: {}, id: 0 } } // what the SDK answers for a notification
      }
      case 'elicitation': return { action: 'decline' }
      case 'request_user_dialog': return SILENT // as the SDK does without an onUserDialog handler
      case 'hook_callback': throw new Error('this page registers no hooks')
      case 'oauth_token_refresh': throw new Error('getOAuthToken callback is not provided (use a fresh `claude setup-token` value)')
      default: throw new Error(`Unsupported control request subtype: ${request.subtype}`)
    }
  }

  async #permission (request, signal) {
    const toolName = request.tool_name
    const input = request.input ?? {}
    const toolUseId = request.tool_use_id
    if (this.canUseTool) {
      return normaliseDecision(await this.canUseTool(toolName, input, { signal, request }), input, toolUseId)
    }
    let settle
    let settled = false
    const decided = new Promise((resolve) => { settle = (d) => { if (!settled) { settled = true; resolve(d) } } })
    const detail = {
      request,
      toolName,
      input,
      signal,
      resolve: (d) => settle(d),
      allow: (updatedInput) => settle({ behavior: 'allow', updatedInput }),
      deny: (message) => settle({ behavior: 'deny', message })
    }
    const notCancelled = this.dispatchEvent(new CustomEvent('permission', { detail, cancelable: true }))
    if (notCancelled && !settled) settle({ behavior: this.permissionPolicy === 'deny' ? 'deny' : 'allow', message: 'Tool use is switched off in this page.' })
    const aborted = new Promise((_, reject) => {
      if (signal.aborted) reject(signal.reason)
      signal.addEventListener('abort', () => reject(signal.reason), { once: true })
    })
    return normaliseDecision(await Promise.race([decided, aborted]), input, toolUseId)
  }

  #sendMcpToCli (serverName, message) {
    // Server-initiated messages (e.g. notifications/tools/list_changed) ride
    // a control_request of our own; its response carries nothing we need.
    if (!this.bridge || this.state === 'exited') return
    this.request({ subtype: 'mcp_message', server_name: serverName, message }).catch(() => {})
  }

  #onExit (info) {
    if (this.state === 'exited') return
    this.state = 'exited'
    this.exitInfo = { ...info, stderrTail: this.stderr.slice(-30) }
    const err = new HarnessExitError(this.exitInfo)
    for (const p of this.pending.values()) p.reject(err)
    this.pending.clear()
    for (const ctl of this.inbound.values()) ctl.abort(err)
    this.inbound.clear()
    this._initReject(err)
    this._exitResolve(this.exitInfo)
    this.#emit('exit', this.exitInfo)
  }

  #emit (type, detail) { this.dispatchEvent(new CustomEvent(type, { detail })) }
}
