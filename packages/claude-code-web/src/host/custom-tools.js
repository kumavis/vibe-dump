// Custom tools as the user edits them in Settings: JSON naming an MCP server
// and its tools, each with a JavaScript handler *body* that becomes
// `async function (input, ctx) { <body> }`. The handler runs in the page
// (not in the Worker), with the page's privileges: it is the user's own code.
//
//   {
//     "server": "page",
//     "tools": [{
//       "name": "get_weather",
//       "description": "...",
//       "inputSchema": { "type": "object", "properties": {...}, "required": [...] },
//       "handler": "return `Sunny in ${input.city}`"
//     }]
//   }
//
// A bare array is accepted as the tools list of the default server.

import { DEFAULT_SERVER } from './constants.js'

export class ToolsConfigError extends Error {
  constructor (problems) {
    super(`Custom tools: ${problems.join('; ')}`)
    this.name = 'ToolsConfigError'
    this.problems = problems
  }
}

const NAME = /^[a-zA-Z0-9_-]{1,64}$/
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

export const DEFAULT_TOOLS = {
  server: DEFAULT_SERVER,
  tools: [
    {
      name: 'get_weather',
      description: 'Get the current weather for a city. Returns a one-line report.',
      inputSchema: {
        type: 'object',
        properties: { city: { type: 'string', description: 'City name, e.g. Paris' } },
        required: ['city']
      },
      handler: "const temps = { paris: 21, reykjavik: 7, tokyo: 18 }\nconst t = temps[String(input.city).toLowerCase()] ?? 15\nreturn `Sunny in ${input.city}, ${t}°C`"
    }
  ]
}

export const DEFAULT_TOOLS_JSON = JSON.stringify(DEFAULT_TOOLS, null, 2)

/**
 * Parse and validate the JSON text. Returns { server, tools: [{name,
 * description, inputSchema, handlerSource}] }; throws ToolsConfigError with
 * every problem found.
 */
export function parseToolsConfig (text) {
  if (text == null || String(text).trim() === '') return { server: DEFAULT_SERVER, tools: [] }
  let raw
  try { raw = JSON.parse(text) } catch (err) { throw new ToolsConfigError([`not valid JSON (${err.message})`]) }
  if (Array.isArray(raw)) raw = { tools: raw }
  if (!raw || typeof raw !== 'object') throw new ToolsConfigError(['expected an object with "tools"'])
  const problems = []
  const server = raw.server ?? DEFAULT_SERVER
  if (typeof server !== 'string' || !NAME.test(server)) problems.push(`"server" must match ${NAME} (got ${JSON.stringify(server)})`)
  const list = raw.tools ?? []
  if (!Array.isArray(list)) problems.push('"tools" must be an array')
  const tools = []
  const seen = new Set()
  for (const [i, t] of (Array.isArray(list) ? list : []).entries()) {
    const at = `tools[${i}]`
    if (!t || typeof t !== 'object') { problems.push(`${at} must be an object`); continue }
    if (typeof t.name !== 'string' || !NAME.test(t.name)) problems.push(`${at}.name must match ${NAME}`)
    else if (seen.has(t.name)) problems.push(`${at}.name "${t.name}" is a duplicate`)
    else seen.add(t.name)
    if (t.description != null && typeof t.description !== 'string') problems.push(`${at}.description must be a string`)
    const schema = t.inputSchema ?? { type: 'object', properties: {} }
    if (!schema || typeof schema !== 'object' || Array.isArray(schema) || schema.type !== 'object') problems.push(`${at}.inputSchema must be a JSON Schema with "type": "object"`)
    const handler = Array.isArray(t.handler) ? t.handler.join('\n') : t.handler
    if (typeof handler !== 'string' || !handler.trim()) problems.push(`${at}.handler must be a JavaScript function body (string)`)
    else {
      try { new AsyncFunction('input', 'ctx', handler) } catch (err) { problems.push(`${at}.handler does not compile: ${err.message}`) }
    }
    tools.push({ name: t.name, description: t.description ?? '', inputSchema: schema, handlerSource: handler })
  }
  if (problems.length) throw new ToolsConfigError(problems)
  return { server, tools }
}

/**
 * Compile handler bodies into functions. `ctx` gets { signal, server, tool }
 * from the MCP server plus whatever `extraCtx` adds (e.g. a logger).
 */
export function compileTools (config, extraCtx = {}) {
  return config.tools.map((t) => {
    const fn = new AsyncFunction('input', 'ctx', t.handlerSource)
    return {
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
      handler: (input, ctx) => fn(input, { ...extraCtx, ...ctx })
    }
  })
}

/** Text -> the Harness `mcpServers` option: { [server]: { tools } } (empty when there are no tools). */
export function mcpServersFromText (text, extraCtx) {
  const config = parseToolsConfig(text)
  if (!config.tools.length) return {}
  return { [config.server]: { tools: compileTools(config, extraCtx) } }
}
