// Fixed values shared by the page side (host + UI). The paths match the
// "Runtime URL and path layout" table in ARCHITECTURE.md.

/** The Claude Code release the extractor's rewrites are pinned to. */
export const CC_VERSION = '2.1.311'

export const HOME = '/home/user'
export const WORKSPACE = '/home/user/workspace'
export const CONFIG_DIR = '/home/user/.claude'

/** Name of the page's in-process MCP server; its tools appear to the model as mcp__<name>__<tool>. */
export const DEFAULT_SERVER = 'page'

export const DEFAULT_API_BASE = 'https://api.anthropic.com'

/**
 * The built-in tools the CLI is given (`--tools`, an allowlist): the file
 * tools on the virtual filesystem and the conversation-control tools. No
 * shell, no web access, nothing that acts on the account or on remote agents
 * (RemoteTrigger, SendMessage, Cron*, worktrees, ...), and nothing a future
 * release adds until it is listed here. The page's own MCP tools
 * (mcp__<server>__<tool>) come on top, via --mcp-config.
 */
export const ALLOWED_TOOLS = Object.freeze(['Read', 'Write', 'Edit', 'Glob', 'Grep', 'NotebookEdit', 'Task', 'TodoWrite', 'AskUserQuestion', 'ExitPlanMode', 'Skill'])

/**
 * Whether the page lets the model use a tool: a built-in on the allowlist, or
 * a tool of one of the page's own MCP servers. Anything else is denied when
 * the CLI asks (can_use_tool), whatever --tools let through.
 */
export function isToolAllowed (toolName, { allowedTools = ALLOWED_TOOLS, serverNames = [] } = {}) {
  const name = String(toolName ?? '')
  if (allowedTools.includes(name)) return true
  return serverNames.some((s) => name.startsWith(`mcp__${s}__`) && name.length > `mcp__${s}__`.length)
}

/**
 * Policy flags (ARCHITECTURE.md "Policy posture"): always set, never
 * overridable from settings. One definition, shared with the Worker, which
 * merges them in again (src/runtime/boot/policy.js).
 */
export { POLICY_ENV } from '../runtime/boot/policy.js'

/** BASE: the app's own directory URL (`/vibe-dump/claude-code-web/` on Pages, `/` under vite dev). */
export function baseUrl (loc = globalThis.location) {
  if (!loc) throw new Error('baseUrl: no location (pass one outside a browser)')
  return new URL('.', loc.href).href
}

/** Where the service worker serves the extracted tree. */
export const appUrlFor = (base) => new URL('vfs/app/', base).href

/** The Worker bootstrap written by integration (src/runtime/boot.js, copied by build-runtime). */
export const workerUrlFor = (base) => new URL('runtime/boot.js', base).href

export const serviceWorkerUrlFor = (base) => new URL('sw.js', base).href

/** Random id for control requests and message uuids; crypto.randomUUID when there is one. */
export function randomId () {
  const c = globalThis.crypto
  if (c?.randomUUID) return c.randomUUID()
  const b = new Uint8Array(16)
  if (c?.getRandomValues) c.getRandomValues(b)
  else for (let i = 0; i < 16; i++) b[i] = Math.floor(Math.random() * 256)
  b[6] = (b[6] & 0x0f) | 0x40
  b[8] = (b[8] & 0x3f) | 0x80
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('')
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`
}
