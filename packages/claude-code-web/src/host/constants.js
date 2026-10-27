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

/** No shell, and nothing that would reach hosts other than the API. */
export const DISALLOWED_TOOLS = ['Bash', 'BashOutput', 'KillShell', 'WebFetch', 'WebSearch']

/**
 * Policy flags (ARCHITECTURE.md "Policy posture"): always set, never
 * overridable from settings.
 */
export const POLICY_ENV = Object.freeze({
  CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1',
  DISABLE_TELEMETRY: '1',
  DISABLE_ERROR_REPORTING: '1',
  DISABLE_AUTOUPDATER: '1'
})

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
