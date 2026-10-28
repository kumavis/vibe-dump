// Page side of the Worker message protocol (worker-protocol.md is the spec).
// Wraps anything Worker-shaped (a real Worker, or fake-worker.js in tests)
// and turns its messages into events:
//
//   'stdout' {line}   one line of the CLI's stdout (stream-json), no newline
//   'stderr' {line}   one line of stderr
//   'exit'   {code, signal, error}   exactly once
//   'log'    {level, msg, data}      boot diagnostics from boot.js
//   'status' {phase, ...}           boot progress
//   'fs-sync' {snapshot, paths, flush?}  a serialized snapshot of the persisted roots
//                                    (flush: the id of the fs-flush it answers)
//   'error'  {message, stack}       an uncaught error inside the Worker
//   'provider-token-request' {id, reason}  the Worker asks for a ChatGPT access
//                                    token (answered by serveProviderTokens below,
//                                    which listens on the Worker itself)
//
// The worker may send stdout/stderr as whole lines ({line}) or as raw text
// ({chunk}); chunks are split here, so either side can be simple.

export const PROTOCOL_VERSION = 1

export const TOKEN_REASONS = Object.freeze(['start', 'expired', 'unauthorized'])

/**
 * The page's half of the token handoff (worker-protocol.md, "Provider
 * tokens"): answers every `{type:'provider-token-request', id, reason}` from
 * `worker` with `{type:'provider-token', id, accessToken, expiresAt}` or
 * `{type:'provider-token', id, error}`. The page owns the tokens; the reply is
 * built field by field, so nothing but the access token and its expiry ever
 * reaches the Worker (never the refresh or ID token). `reason: 'unauthorized'`
 * (the API refused the token) forces a refresh; 'start' and 'expired' take
 * the current token, which getAccessToken refreshes when it is near expiry.
 *
 * Attach it before the boot message is posted (Session wraps the Worker
 * factory), so no request can arrive unheard. Returns a detach function.
 *
 * @param {{postMessage: Function, addEventListener: Function, removeEventListener?: Function}} worker
 * @param {object} o
 * @param {(o: {force: boolean, reason: string}) => Promise<{accessToken: string, expiresAt: number}>} o.getAccessToken
 * @param {(d: {id, reason}) => void} [o.onRequest]
 * @param {(d: {id, reason, ok: boolean, error?: string, expiresAt?: number}) => void} [o.onAnswer]  never given the token
 */
export function serveProviderTokens (worker, { getAccessToken, onRequest, onAnswer } = {}) {
  if (!worker || typeof worker.addEventListener !== 'function') throw new TypeError('serveProviderTokens: a Worker-like object is required')
  if (typeof getAccessToken !== 'function') throw new TypeError('serveProviderTokens: getAccessToken is required')
  const onMessage = async (ev) => {
    const msg = ev?.data
    if (!msg || typeof msg !== 'object' || msg.type !== 'provider-token-request') return
    const id = msg.id
    const reason = TOKEN_REASONS.includes(msg.reason) ? msg.reason : 'start'
    try { onRequest?.({ id, reason }) } catch {}
    let reply
    try {
      const t = await getAccessToken({ force: reason === 'unauthorized', reason })
      const accessToken = typeof t === 'string' ? t : t?.accessToken
      if (typeof accessToken !== 'string' || !accessToken) throw new Error('no access token')
      reply = { type: 'provider-token', id, accessToken, expiresAt: Number(t?.expiresAt) || 0 }
    } catch (err) {
      reply = { type: 'provider-token', id, error: String(err?.message ?? err) }
    }
    try { onAnswer?.({ id, reason, ok: !reply.error, ...(reply.error ? { error: reply.error } : { expiresAt: reply.expiresAt }) }) } catch {}
    try { worker.postMessage(reply) } catch {}
  }
  worker.addEventListener('message', onMessage)
  return () => worker.removeEventListener?.('message', onMessage)
}

/** Splits a text stream into lines; keeps the unterminated tail for the next push. */
export class LineSplitter {
  constructor () { this.tail = '' }
  push (chunk) {
    const text = this.tail + chunk
    const parts = text.split('\n')
    this.tail = parts.pop()
    return parts.map((l) => (l.endsWith('\r') ? l.slice(0, -1) : l))
  }
  flush () {
    const t = this.tail
    this.tail = ''
    return t ? [t] : []
  }
}

const decoder = typeof TextDecoder !== 'undefined' ? new TextDecoder() : null
const asText = (chunk) => (typeof chunk === 'string' ? chunk : decoder ? decoder.decode(chunk, { stream: false }) : String(chunk))

export class WorkerBridge extends EventTarget {
  /** @param {Worker|{postMessage, addEventListener, terminate}} worker */
  constructor (worker) {
    super()
    if (!worker || typeof worker.postMessage !== 'function') throw new TypeError('WorkerBridge: a Worker-like object is required')
    this.worker = worker
    this.exited = false
    this.exitInfo = null
    this.booted = false
    this.splitters = { stdout: new LineSplitter(), stderr: new LineSplitter() }
    this.heardFrom = false // any message from the worker yet?
    this._onMessage = (ev) => { this.heardFrom = true; this.#receive(ev.data) }
    this._onError = (ev) => {
      // A module Worker that fails to load (404, syntax error, throwing
      // top-level import) fires a plain Event with no message: fatal. An
      // ErrorEvent with a message is an uncaught error in a running worker;
      // boot.js decides whether that ends the process (it posts 'exit').
      const loadFailure = !ev?.message
      const message = ev?.message || 'the Worker failed to load or threw while importing (is runtime/boot.js deployed?)'
      this.#emit('error', { message, filename: ev?.filename, lineno: ev?.lineno, fatal: loadFailure })
      if (loadFailure || !this.heardFrom) this.#exit({ code: 1, error: message })
    }
    this._onMessageError = () => this.#emit('error', { message: 'a Worker message could not be deserialized' })
    worker.addEventListener('message', this._onMessage)
    worker.addEventListener('error', this._onError)
    worker.addEventListener('messageerror', this._onMessageError)
  }

  /** Send the boot message (once). Transferables (e.g. the snapshot's buffer) are moved, not copied. */
  boot (message, transfer = []) {
    if (this.booted) throw new Error('WorkerBridge: already booted')
    this.booted = true
    this.#post({ ...message, type: 'boot', protocol: PROTOCOL_VERSION }, transfer)
  }

  /** One stream-json line onto the CLI's stdin (the worker appends the newline). */
  writeLine (line) {
    if (typeof line !== 'string') throw new TypeError('writeLine: a string is required')
    if (line.includes('\n')) throw new Error('writeLine: a stream-json line must not contain a newline')
    this.#post({ type: 'stdin', line })
  }

  /** EOF on stdin. */
  endInput () { this.#post({ type: 'stdin-end' }) }

  /** Ask the worker for an immediate fs-sync; an `id` comes back as that fs-sync's `flush`. */
  flushFs (id) { this.#post(id == null ? { type: 'fs-flush' } : { type: 'fs-flush', id }) }

  /** Forward a signal to process (SIGINT/SIGTERM); boot.js emits it on `process`. */
  signal (name = 'SIGINT') { this.#post({ type: 'signal', signal: name }) }

  /** Kill the Worker. Emits 'exit' {code: null, signal: 'SIGKILL'} if it had not exited. */
  terminate () {
    try { this.worker.terminate?.() } catch {}
    this.#detach()
    if (!this.exited) this.#exit({ code: null, signal: 'SIGKILL' })
  }

  #post (msg, transfer) {
    if (this.exited) return
    try {
      if (transfer && transfer.length) this.worker.postMessage(msg, transfer)
      else this.worker.postMessage(msg)
    } catch (err) {
      this.#emit('error', { message: `postMessage failed: ${err?.message ?? err}` })
    }
  }

  #receive (msg) {
    if (!msg || typeof msg !== 'object') return
    switch (msg.type) {
      case 'stdout':
      case 'stderr': {
        const lines = typeof msg.line === 'string'
          ? [msg.line]
          : msg.chunk != null ? this.splitters[msg.type].push(asText(msg.chunk)) : []
        for (const line of lines) this.#emit(msg.type, { line })
        break
      }
      case 'exit': this.#exit({ code: msg.code ?? 0, signal: msg.signal ?? null, error: msg.error ?? null }); break
      case 'log': this.#emit('log', { level: msg.level ?? 'info', msg: msg.msg ?? '', data: msg.data }); break
      case 'status': this.#emit('status', { ...msg }); break
      case 'fs-sync': this.#emit('fs-sync', { snapshot: msg.snapshot ?? null, paths: msg.paths ?? [], ...(msg.flush != null ? { flush: msg.flush } : {}) }); break
      case 'error': this.#emit('error', { message: msg.message ?? 'error in Worker', stack: msg.stack }); break
      case 'provider-token-request': this.#emit('provider-token-request', { id: msg.id, reason: msg.reason }); break
      default: this.#emit('log', { level: 'debug', msg: `unknown worker message type ${JSON.stringify(msg.type)}`, data: msg })
    }
  }

  #exit ({ code, signal = null, error = null }) {
    if (this.exited) return
    // Whatever was buffered without a trailing newline is still output.
    for (const k of ['stdout', 'stderr']) for (const line of this.splitters[k].flush()) this.#emit(k, { line })
    this.exited = true
    this.exitInfo = { code, signal, error }
    this.#emit('exit', this.exitInfo)
    // The process is gone; free the thread (no-op if already terminated).
    try { this.worker.terminate?.() } catch {}
    this.#detach()
  }

  #detach () {
    this.worker.removeEventListener?.('message', this._onMessage)
    this.worker.removeEventListener?.('error', this._onError)
    this.worker.removeEventListener?.('messageerror', this._onMessageError)
  }

  #emit (type, detail) { this.dispatchEvent(new CustomEvent(type, { detail })) }
}
