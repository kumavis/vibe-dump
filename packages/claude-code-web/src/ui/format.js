// Pure text formatting for the UI (unit-tested under Node; no DOM here).

export function formatBytes (n) {
  if (!Number.isFinite(n)) return '?'
  if (n < 1024) return `${n} B`
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} KB`
  if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} MB`
  return `${(n / 1024 ** 3).toFixed(2)} GB`
}

const int = (n) => (Number.isFinite(n) ? n.toLocaleString('en-US') : '?')

/** One line per extraction phase (track A's onProgress shapes, plus 'download'). */
export function progressText (p) {
  if (!p) return ''
  switch (p.phase) {
    case 'start': return 'Starting…'
    case 'download': return p.total ? `Downloading ${formatBytes(p.loaded)} of ${formatBytes(p.total)}` : `Downloading ${formatBytes(p.loaded ?? 0)}`
    case 'read': return p.total ? `Reading ${formatBytes(p.loaded)} of ${formatBytes(p.total)}` : `Reading ${formatBytes(p.loaded ?? 0)}`
    case 'parse': return `Finding the embedded JavaScript${p.size ? ` in ${formatBytes(p.size)}` : ''}…`
    case 'hash': return 'Fingerprinting the module tree…'
    case 'rewrite': return 'Applying the loader rewrites…'
    case 'graph': return 'Ordering the module graph for loading…'
    case 'cache': return `Caching ${int(p.done)} of ${int(p.total)} files`
    case 'done': return 'Done'
    default: return p.phase ? `${p.phase}…` : ''
  }
}

/** 0..1 for a <progress>, or null when indeterminate. */
export function progressFraction (p) {
  if (!p) return null
  if ((p.phase === 'download' || p.phase === 'read') && p.total) return Math.min(1, p.loaded / p.total)
  if (p.phase === 'cache' && p.total) return Math.min(1, p.done / p.total)
  if (p.phase === 'done') return 1
  return null
}

/** "get_weather (page)" for mcp__page__get_weather; other names unchanged. */
export function toolLabel (name) {
  const m = /^mcp__(.+?)__(.+)$/.exec(name ?? '')
  return m ? `${m[2]} (${m[1]})` : String(name ?? '?')
}

/** Text of a tool_result block's content (string, or blocks). */
export function toolResultText (content) {
  if (content == null) return ''
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content.map((b) => (b?.type === 'text' ? b.text : b?.type === 'image' ? '[image]' : `[${b?.type ?? '?'}]`)).join('\n')
  }
  return prettyJson(content)
}

export function prettyJson (v, max = 4000) {
  let s
  try { s = JSON.stringify(v, null, 2) } catch { s = String(v) }
  if (s === undefined) s = String(v)
  return s.length > max ? `${s.slice(0, max)}\n… (${int(s.length - max)} more characters)` : s
}

export function initSummary (msg) {
  const tools = Array.isArray(msg.tools) ? msg.tools : []
  const servers = (msg.mcp_servers ?? []).map((s) => `${s.name} (${s.status})`).join(', ')
  return [
    'Session started',
    msg.model ? `model ${msg.model}` : null,
    `${tools.length} tools`,
    servers ? `MCP: ${servers}` : 'no MCP servers',
    msg.claude_code_version ? `Claude Code ${msg.claude_code_version}` : null
  ].filter(Boolean).join(' · ')
}

export function resultSummary (msg) {
  const secs = Number.isFinite(msg.duration_ms) ? `${(msg.duration_ms / 1000).toFixed(1)} s` : null
  const turns = Number.isFinite(msg.num_turns) ? `${msg.num_turns} turn${msg.num_turns === 1 ? '' : 's'}` : null
  const u = msg.usage ?? {}
  const tokens = Number.isFinite(u.input_tokens) || Number.isFinite(u.output_tokens) ? `${int(u.input_tokens ?? 0)} in / ${int(u.output_tokens ?? 0)} out tokens` : null
  const cost = Number.isFinite(msg.total_cost_usd) && msg.total_cost_usd > 0 ? `$${msg.total_cost_usd.toFixed(4)}` : null
  const ok = !msg.is_error && msg.subtype === 'success'
  const head = ok ? 'Done' : `Error${msg.subtype && msg.subtype !== 'success' ? ` (${msg.subtype})` : ''}`
  const detail = !ok ? (msg.result || (Array.isArray(msg.errors) ? msg.errors.join('; ') : '')) : ''
  return { ok, text: [head, secs, turns, tokens, cost].filter(Boolean).join(' · '), detail }
}

/** A short line for system messages other than init (api_retry, status, compact_boundary, ...). */
export function systemLine (msg) {
  switch (msg.subtype) {
    case 'api_retry': return `API retry ${msg.attempt ?? ''}${msg.max_retries ? `/${msg.max_retries}` : ''}${msg.error_status ? ` after HTTP ${msg.error_status}` : ''}`
    case 'compact_boundary': return 'Conversation compacted'
    case 'status': return msg.status ? `Status: ${msg.status}` : null
    // progress estimates while a thinking block streams (one per delta): not transcript material
    case 'thinking_tokens': return null
    default: return `system/${msg.subtype ?? '?'}`
  }
}
