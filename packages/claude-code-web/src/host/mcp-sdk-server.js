// A minimal in-process MCP server for page-defined tools, the browser
// counterpart of the Agent SDK's createSdkMcpServer(). Claude Code reaches it
// over the stream-json control channel (harness.js routes control_request
// subtype "mcp_message" here); this object only speaks JSON-RPC 2.0:
//
//   initialize      -> { protocolVersion, capabilities: { tools }, serverInfo }
//   ping            -> {}
//   tools/list      -> { tools: [{ name, description, inputSchema }] }
//   tools/call      -> { content: [...], isError? }   (handler errors become isError results,
//                                                        as the MCP SDK's McpServer does)
//   notifications/* -> no response (null)
//   anything else   -> JSON-RPC error -32601
//
// A tool is { name, description, inputSchema, handler(input, ctx) }. The
// handler may return a string, an MCP result ({content: [...]}) or any JSON
// value (sent as text).

/** What the Agent SDK 0.3.311 bundles (its MCP SDK's LATEST_PROTOCOL_VERSION and supported list). */
export const LATEST_PROTOCOL_VERSION = '2025-11-25'
export const SUPPORTED_PROTOCOL_VERSIONS = [LATEST_PROTOCOL_VERSION, '2025-06-18', '2025-03-26', '2024-11-05', '2024-10-07']

export const JSONRPC = Object.freeze({
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603
})

const TOOL_NAME = /^[a-zA-Z0-9_-]{1,64}$/

/** A request expects a response: it has a method and a non-null id (same test as sdk.mjs). */
export function isJsonRpcRequest (msg) {
  return msg != null && typeof msg === 'object' && 'method' in msg && 'id' in msg && msg.id !== null && msg.id !== undefined
}

export function isJsonRpcNotification (msg) {
  return msg != null && typeof msg === 'object' && typeof msg.method === 'string' && !('id' in msg && msg.id !== null && msg.id !== undefined)
}

const rpcError = (id, code, message, data) => ({ jsonrpc: '2.0', id, error: data === undefined ? { code, message } : { code, message, data } })
const rpcResult = (id, result) => ({ jsonrpc: '2.0', id, result })

/** Normalise whatever a handler returned into an MCP CallToolResult. */
export function toCallToolResult (value) {
  if (value == null) return { content: [{ type: 'text', text: '' }] }
  if (typeof value === 'string') return { content: [{ type: 'text', text: value }] }
  if (typeof value === 'object' && Array.isArray(value.content)) return value
  let text
  try { text = JSON.stringify(value) } catch { text = String(value) }
  return { content: [{ type: 'text', text }] }
}

/** Joined text of a CallToolResult's text blocks (for logs and the transcript). */
export function resultText (result) {
  if (!result || !Array.isArray(result.content)) return ''
  return result.content.filter((b) => b && b.type === 'text').map((b) => b.text).join('\n')
}

/**
 * Shallow input check against the tool's schema: an object, with every
 * `required` property present and top-level primitive `type`s matching.
 * Returns an error string, or null when the input is acceptable. Not a full
 * JSON Schema validator; the model is usually right and the handler sees the
 * input anyway.
 */
export function checkInput (schema, input) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) return 'arguments must be an object'
  if (!schema || typeof schema !== 'object') return null
  for (const key of Array.isArray(schema.required) ? schema.required : []) {
    if (!(key in input)) return `missing required argument "${key}"`
  }
  const props = schema.properties && typeof schema.properties === 'object' ? schema.properties : {}
  for (const [key, spec] of Object.entries(props)) {
    if (!(key in input) || !spec || typeof spec.type !== 'string') continue
    const v = input[key]
    const ok = {
      string: typeof v === 'string',
      number: typeof v === 'number',
      integer: Number.isInteger(v),
      boolean: typeof v === 'boolean',
      array: Array.isArray(v),
      object: v !== null && typeof v === 'object' && !Array.isArray(v),
      null: v === null
    }[spec.type]
    if (ok === false) return `argument "${key}" must be of type ${spec.type}`
  }
  return null
}

function normaliseTool (t) {
  if (!t || typeof t !== 'object') throw new TypeError('McpSdkServer: a tool must be an object')
  if (typeof t.name !== 'string' || !TOOL_NAME.test(t.name)) throw new TypeError(`McpSdkServer: invalid tool name ${JSON.stringify(t.name)} (letters, digits, _ and -, at most 64)`)
  if (typeof t.handler !== 'function') throw new TypeError(`McpSdkServer: tool "${t.name}" has no handler function`)
  const inputSchema = t.inputSchema && typeof t.inputSchema === 'object' ? t.inputSchema : { type: 'object', properties: {} }
  return { name: t.name, description: typeof t.description === 'string' ? t.description : '', inputSchema, handler: t.handler, annotations: t.annotations }
}

export class McpSdkServer {
  /**
   * @param {object} opts
   * @param {string} opts.name                server name (the key in --mcp-config / sdkMcpServers)
   * @param {string} [opts.version]
   * @param {Array}  [opts.tools]             [{ name, description, inputSchema, handler }]
   * @param {(call: {tool, input, result, error, durationMs}) => void} [opts.onToolCall]
   */
  constructor ({ name, version = '1.0.0', tools = [], onToolCall } = {}) {
    if (typeof name !== 'string' || !name) throw new TypeError('McpSdkServer: name is required')
    this.name = name
    this.version = version
    this.tools = new Map()
    for (const t of tools) {
      const tool = normaliseTool(t)
      if (this.tools.has(tool.name)) throw new TypeError(`McpSdkServer: duplicate tool "${tool.name}"`)
      this.tools.set(tool.name, tool)
    }
    this.onToolCall = onToolCall
    this.initialized = false
    this.clientInfo = null
    this.protocolVersion = null
    this._send = null
  }

  /** Called by the harness: `send(jsonRpcMessage)` delivers a server-initiated message to Claude Code. */
  connect (send) { this._send = send }

  /** Replace the tool set and tell the client (notifications/tools/list_changed). */
  setTools (tools) {
    this.tools = new Map(tools.map((t) => { const n = normaliseTool(t); return [n.name, n] }))
    if (this.initialized && this._send) this._send({ jsonrpc: '2.0', method: 'notifications/tools/list_changed' })
  }

  listTools () {
    return [...this.tools.values()].map(({ name, description, inputSchema, annotations }) =>
      annotations ? { name, description, inputSchema, annotations } : { name, description, inputSchema })
  }

  /**
   * Handle one JSON-RPC message from the client.
   * @returns {Promise<object|null>} the response, or null for a notification
   */
  async handle (message, { signal } = {}) {
    if (message === null || typeof message !== 'object' || Array.isArray(message)) {
      return rpcError(null, JSONRPC.INVALID_REQUEST, 'Invalid Request: not a JSON-RPC object')
    }
    const hasId = 'id' in message && message.id !== null && message.id !== undefined
    const id = hasId ? message.id : null
    if (message.jsonrpc !== '2.0' || typeof message.method !== 'string') {
      // A response object (result/error, no method) is not ours to answer.
      if (!('method' in message) && ('result' in message || 'error' in message)) return null
      return rpcError(id, JSONRPC.INVALID_REQUEST, 'Invalid Request: expected jsonrpc "2.0" and a string method')
    }
    if (!hasId) {
      if (message.method === 'notifications/initialized') this.initialized = true
      return null // notifications never get a response
    }
    const params = message.params ?? {}
    try {
      switch (message.method) {
        case 'initialize': return rpcResult(id, this.#initialize(params))
        case 'ping': return rpcResult(id, {})
        case 'tools/list': return rpcResult(id, { tools: this.listTools() })
        case 'tools/call': return await this.#call(id, params, signal)
        default: return rpcError(id, JSONRPC.METHOD_NOT_FOUND, `Method not found: ${message.method}`)
      }
    } catch (err) {
      return rpcError(id, JSONRPC.INTERNAL_ERROR, `Internal error: ${err?.message ?? err}`)
    }
  }

  #initialize (params) {
    const requested = params?.protocolVersion
    this.protocolVersion = SUPPORTED_PROTOCOL_VERSIONS.includes(requested) ? requested : LATEST_PROTOCOL_VERSION
    this.clientInfo = params?.clientInfo ?? null
    return {
      protocolVersion: this.protocolVersion,
      capabilities: { tools: { listChanged: true } },
      serverInfo: { name: this.name, version: this.version }
    }
  }

  async #call (id, params, signal) {
    if (!params || typeof params.name !== 'string') return rpcError(id, JSONRPC.INVALID_PARAMS, 'Invalid params: tools/call needs a tool name')
    const tool = this.tools.get(params.name)
    if (!tool) return rpcError(id, JSONRPC.INVALID_PARAMS, `Tool ${params.name} not found`)
    const input = params.arguments ?? {}
    const started = Date.now()
    const problem = checkInput(tool.inputSchema, input)
    let result
    let error = null
    if (problem) {
      result = { content: [{ type: 'text', text: `Invalid arguments for tool ${tool.name}: ${problem}` }], isError: true }
      error = problem
    } else {
      try {
        result = toCallToolResult(await tool.handler(input, { signal, server: this.name, tool: tool.name }))
      } catch (err) {
        error = err?.message ?? String(err)
        result = { content: [{ type: 'text', text: error }], isError: true }
      }
    }
    try { this.onToolCall?.({ tool: tool.name, input, result, error, durationMs: Date.now() - started }) } catch {}
    return rpcResult(id, result)
  }
}
