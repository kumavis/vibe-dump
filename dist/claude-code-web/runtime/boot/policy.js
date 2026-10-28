// The kill-switch flags (ARCHITECTURE.md "Policy posture"), shared by the
// page (src/host/invocation.js buildEnv, via src/host/constants.js) and the
// Worker (boot.js), so the two can never drift apart. Plain ESM with no
// imports: the Worker loads it as is from runtime/boot/policy.js.

/** Always set, never overridable from settings or from the boot message. */
export const POLICY_ENV = Object.freeze({
  CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1',
  DISABLE_TELEMETRY: '1',
  DISABLE_ERROR_REPORTING: '1',
  DISABLE_AUTOUPDATER: '1'
})

/**
 * The process environment the Worker runs the CLI with: whatever the boot
 * message carried, with the policy flags merged in last (defence in depth:
 * a page that builds a Harness with its own env cannot drop them).
 */
export function workerEnv (env) {
  return { ...(env || {}), ...POLICY_ENV }
}

// --- provider (ARCHITECTURE.md Appendix A) -------------------------------------
// The boot message's `provider`: {kind: 'anthropic'} (the default) or
// {kind: 'openai-responses', baseUrl, model, effort, contextWindow}. In the
// second ("ChatGPT subscription") mode the CLI talks to a synthetic origin
// that the Worker's OpenAI adapter answers locally (boot/openai-adapter.js);
// it never reaches the network.

export const PROVIDER_ANTHROPIC = 'anthropic'
export const PROVIDER_OPENAI_RESPONSES = 'openai-responses'
/** The synthetic ANTHROPIC_BASE_URL in ChatGPT mode (the same value as src/host/constants.js). */
export const OPENAI_ADAPTER_ORIGIN = 'https://openai-adapter.invalid'
/** Placeholder ANTHROPIC_API_KEY so Claude Code starts; it only ever reaches the adapter. */
export const OPENAI_ADAPTER_KEY = 'openai-adapter'
export const OPENAI_DEFAULT_BASE_URL = 'https://api.openai.com/v1'
export const OPENAI_DEFAULT_MODEL = 'gpt-5.5'
/**
 * CLAUDE_CODE_AUTO_COMPACT_WINDOW in 2.1.311: the auto-compact window is
 * min(model window, this), accepted from 100k to 1M (outside, it is clamped
 * and a warning printed). CLAUDE_CODE_MAX_CONTEXT_TOKENS is not used: the
 * bundle reads it only for model ids it does not recognize (or with
 * DISABLE_COMPACT), and the harness keeps --model claude-sonnet-5-5.
 */
export const AUTO_COMPACT_WINDOW_RANGE = Object.freeze([100_000, 1_000_000])

const LOOPBACK = new Set(['127.0.0.1', 'localhost', '[::1]', '::1'])

/** https, or http on loopback only (the page's checkBaseUrl rule). */
export function isAllowedApiUrl (url) {
  let u
  try { u = new URL(url) } catch { return false }
  return u.protocol === 'https:' || (u.protocol === 'http:' && LOOPBACK.has(u.hostname))
}

/**
 * The provider from the boot message, normalized; throws on anything the
 * Worker must not run with (unknown kind, a base URL that is not https or
 * loopback http).
 */
export function providerConfig (raw) {
  if (!raw || raw.kind === undefined || raw.kind === PROVIDER_ANTHROPIC) return { kind: PROVIDER_ANTHROPIC }
  if (raw.kind !== PROVIDER_OPENAI_RESPONSES) throw new Error(`unknown provider kind ${JSON.stringify(raw.kind)}`)
  const baseUrl = String(raw.baseUrl || OPENAI_DEFAULT_BASE_URL).trim().replace(/\/+$/, '')
  if (!isAllowedApiUrl(baseUrl)) throw new Error(`the ChatGPT API base URL must be https (or http on loopback): ${baseUrl}`)
  const cw = Number(raw.contextWindow)
  return {
    kind: PROVIDER_OPENAI_RESPONSES,
    baseUrl,
    model: String(raw.model || OPENAI_DEFAULT_MODEL),
    ...(raw.smallModel ? { smallModel: String(raw.smallModel) } : {}),
    effort: raw.effort ? String(raw.effort) : 'auto',
    ...(Array.isArray(raw.efforts) && raw.efforts.some((e) => typeof e === 'string') ? { efforts: raw.efforts.filter((e) => typeof e === 'string') } : {}),
    contextWindow: Number.isFinite(cw) && cw > 0 ? Math.round(cw) : null
  }
}

/**
 * Provider-specific process env, applied in place after workerEnv(): in
 * ChatGPT mode the base URL is the synthetic origin, the API key the
 * placeholder, no Anthropic credential is kept, and the auto-compact window
 * follows the upstream model's context window (unless the page already set
 * one in range). The policy flags are merged in again, last.
 */
export function applyProviderEnv (env, provider) {
  if (provider?.kind === PROVIDER_OPENAI_RESPONSES) {
    env.ANTHROPIC_BASE_URL = OPENAI_ADAPTER_ORIGIN
    env.ANTHROPIC_API_KEY = OPENAI_ADAPTER_KEY
    delete env.CLAUDE_CODE_OAUTH_TOKEN
    delete env.ANTHROPIC_AUTH_TOKEN
    const [min, max] = AUTO_COMPACT_WINDOW_RANGE
    const inRange = (v) => Number.isFinite(v) && v >= min && v <= max
    if (!inRange(Number(env.CLAUDE_CODE_AUTO_COMPACT_WINDOW))) {
      delete env.CLAUDE_CODE_AUTO_COMPACT_WINDOW
      if (inRange(provider.contextWindow)) env.CLAUDE_CODE_AUTO_COMPACT_WINDOW = String(provider.contextWindow)
    }
  }
  return Object.assign(env, POLICY_ENV)
}
