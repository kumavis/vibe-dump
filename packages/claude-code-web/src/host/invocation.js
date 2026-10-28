// How the harness is invoked: argv, environment and the seed files for a
// fresh HOME (ARCHITECTURE.md "Harness invocation"). Pure functions, so the
// exact command line is unit-tested.

import { HOME, WORKSPACE, CONFIG_DIR, CC_VERSION, DEFAULT_API_BASE, ALLOWED_TOOLS, POLICY_ENV } from './constants.js'

/**
 * The CLI arguments (what `process.argv.slice(2)` is inside the Worker).
 * The page is the client, exactly as the Agent SDK is: stream-json both ways,
 * permission prompts over the control channel, page tools as type "sdk" MCP
 * servers, no shell.
 *
 * @param {object} [o]
 * @param {string} [o.model]             omitted when empty (the CLI picks its default)
 * @param {string[]} [o.mcpServerNames]  in-process (type "sdk") servers to declare
 * @param {string} [o.permissionMode]
 * @param {string[]} [o.tools]           the built-in tools (`--tools`, an allowlist; [] for none)
 * @param {string[]} [o.extra]           appended last
 */
export function buildArgv ({ model = '', mcpServerNames = [], permissionMode = 'default', tools = ALLOWED_TOOLS, extra = [] } = {}) {
  const argv = [
    '-p',
    '--input-format', 'stream-json',
    '--output-format', 'stream-json',
    '--verbose',
    '--permission-prompt-tool', 'stdio',
    '--permission-mode', permissionMode
  ]
  // Only these built-ins exist for the model (the CLI's `--tools <tools...>`:
  // a comma-separated list, '' for none). MCP tools are not built-ins.
  argv.push('--tools', tools.join(','))
  if (mcpServerNames.length) {
    const mcpServers = Object.fromEntries(mcpServerNames.map((name) => [name, { type: 'sdk', name }]))
    argv.push('--mcp-config', JSON.stringify({ mcpServers }))
  }
  // Only the servers declared here: no ~/.claude.json or .mcp.json servers.
  argv.push('--strict-mcp-config', '--no-session-persistence')
  if (model) argv.push('--model', model)
  argv.push(...extra)
  return argv
}

/**
 * The process environment. Exactly one credential is set; the policy flags
 * are applied last so nothing in `extra` can turn them off.
 *
 * @param {object} o
 * @param {'oauth'|'api-key'} o.authMode
 * @param {string} [o.token]     `claude setup-token` value -> CLAUDE_CODE_OAUTH_TOKEN
 * @param {string} [o.apiKey]    -> ANTHROPIC_API_KEY
 * @param {string} [o.baseUrl]   -> ANTHROPIC_BASE_URL
 * @param {object} [o.extra]
 */
export function buildEnv ({ authMode = 'api-key', token = '', apiKey = '', baseUrl = '', extra = {} } = {}) {
  const env = {
    HOME,
    USER: 'user',
    LOGNAME: 'user',
    PATH: '/usr/local/bin:/usr/bin:/bin',
    LANG: 'C.UTF-8',
    PWD: WORKSPACE,
    CLAUDE_CONFIG_DIR: CONFIG_DIR,
    TERM: 'dumb',
    SHELL: '',
    ANTHROPIC_BASE_URL: (baseUrl || DEFAULT_API_BASE).replace(/\/+$/, ''),
    USE_BUILTIN_RIPGREP: 'false',
    CLAUDE_CODE_ENTRYPOINT: 'sdk-cli',
    ...extra
  }
  delete env.CLAUDE_CODE_OAUTH_TOKEN
  delete env.ANTHROPIC_API_KEY
  delete env.ANTHROPIC_AUTH_TOKEN
  if (authMode === 'oauth') {
    if (token.trim()) env.CLAUDE_CODE_OAUTH_TOKEN = token.trim()
  } else if (apiKey.trim()) {
    env.ANTHROPIC_API_KEY = apiKey.trim()
  }
  return { ...env, ...POLICY_ENV }
}

/** Throws a user-facing message when the settings cannot start a session. */
export function checkCredentials ({ authMode, token, apiKey }) {
  if (authMode === 'oauth') {
    if (!token || !token.trim()) throw new Error('Paste the token from `claude setup-token` first (Settings).')
  } else if (!apiKey || !apiKey.trim()) {
    throw new Error('Paste an Anthropic API key first (Settings).')
  }
}

/** Loopback hosts, where plain http never leaves the machine (the mock API). */
export function isLoopbackHost (hostname) {
  const h = String(hostname).toLowerCase().replace(/^\[|\]$/g, '')
  return h === 'localhost' || h.endsWith('.localhost') || h === '::1' || /^127(\.\d{1,3}){3}$/.test(h)
}

/**
 * The API base URL check: https anywhere, or http on loopback only, since
 * the credential travels in a request header. Returns null when fine, else
 * a user-facing reason (the settings panel shows it, Session.start refuses).
 */
export function checkBaseUrl (url) {
  const raw = String(url ?? '').trim()
  if (!raw) return null // the default, https://api.anthropic.com
  let u
  try { u = new URL(raw) } catch { return `The API base URL "${raw}" is not a valid URL.` }
  if (u.protocol === 'https:') return null
  if (u.protocol === 'http:' && isLoopbackHost(u.hostname)) return null
  if (u.protocol === 'http:') return `The API base URL must use https (plain http is allowed only for localhost / 127.0.0.1): ${u.host} would receive your key or token unencrypted.`
  return `The API base URL must be an https:// URL (got ${u.protocol}).`
}

const SANDBOX_NOTES = `# This environment

You are running inside a browser tab ("Claude Code Web"), not on a computer.

- There is no shell: the Bash tool is not available, and nothing can be
  installed or executed.
- Files live in an in-browser virtual filesystem. The workspace is
  ${WORKSPACE}; it is saved in the browser and shown to the user.
- Tools named mcp__<server>__<tool> are provided by the web page.
`

/**
 * Files a fresh HOME needs, written by the Worker only where absent (after
 * the persisted snapshot is restored). `.claude.json` marks onboarding done
 * and the workspace trusted, so the onboarding preflight (which calls
 * CORS-blocked endpoints and exits) never runs (report E §3.c).
 */
export function seedFiles ({ version = CC_VERSION } = {}) {
  const config = {
    hasCompletedOnboarding: true,
    lastOnboardingVersion: version,
    projects: {
      [WORKSPACE]: { hasTrustDialogAccepted: true, allowedTools: [] }
    }
  }
  return {
    [`${CONFIG_DIR}/.claude.json`]: JSON.stringify(config, null, 2) + '\n',
    [`${CONFIG_DIR}/CLAUDE.md`]: SANDBOX_NOTES
  }
}
