// Downloads for the bakes go through curl, not Node's fetch: curl honours the
// HTTPS proxy settings of the machine it runs on, and Node's built-in fetch
// does not. Every file fetched is recorded in a ledger (fetched.json in the
// downloads directory, outside the repository) with its URL, date, size and
// SHA-256, and the manifests take their "fetched" dates from that ledger.
//
// Copied from holo-i-ke-au's tools/lib/fetch.mjs (b480c27) with one option
// added: `globoff` passes curl -g, so an OPeNDAP constraint's brackets
// (ETOPO 2022's `z[0:2:9000][0:2:12000]`) are sent as they are, not globbed
// (DATA.md §11).
import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'

export function today() {
  return new Date().toISOString().slice(0, 10)
}

export function sha256(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

export class Ledger {
  constructor(dir) {
    this.dir = dir
    this.path = join(dir, 'fetched.json')
    this.entries = existsSync(this.path) ? JSON.parse(readFileSync(this.path, 'utf8')) : {}
  }
  get(file) {
    return this.entries[relative(this.dir, file)]
  }
  put(file, info) {
    this.entries[relative(this.dir, file)] = info
    writeFileSync(this.path, JSON.stringify(this.entries, null, 2) + '\n')
  }
}

/**
 * Fetch url into file unless the ledger already has it and it is on disk.
 * Returns { ok, status, file, cached }. A 404 (or any HTTP error) returns
 * ok: false with the status rather than throwing, so callers can look for an
 * alternative; transport failures throw.
 */
export function fetchTo(ledger, url, file, { maxTime = 900, force = false, emptyRetries = 5, globoff = false } = {}) {
  mkdirSync(dirname(file), { recursive: true })
  const known = ledger.get(file)
  if (!force && known && known.url === url && known.bytes > 0 && existsSync(file) && statSync(file).size === known.bytes) {
    return { ok: true, status: 200, file, cached: true }
  }
  const tmp = file + '.part'
  // curl --retry covers transport errors and 5xx; some servers (GMRT) also
  // answer 200 with an empty body under load, so an empty file is retried too.
  for (let attempt = 1; ; attempt++) {
    rmSync(tmp, { force: true })
    const r = spawnSync('curl', ['-sSL', ...(globoff ? ['-g'] : []), '--fail', '--retry', '3', '--max-time', String(maxTime), '-o', tmp, '-w', '%{http_code}', url], {
      encoding: 'utf8',
      maxBuffer: 1 << 20,
    })
    const status = Number((r.stdout || '').trim().slice(-3)) || 0
    if (r.status !== 0) {
      rmSync(tmp, { force: true })
      if (status >= 400) return { ok: false, status, file, cached: false }
      throw new Error(`curl failed (${r.status}) for ${url}: ${(r.stderr || '').trim()}`)
    }
    if (existsSync(tmp) && statSync(tmp).size > 0) {
      renameSync(tmp, file)
      ledger.put(file, { url, fetched: today(), bytes: statSync(file).size, sha256: sha256(file) })
      return { ok: true, status, file, cached: false }
    }
    rmSync(tmp, { force: true })
    if (attempt >= emptyRetries) throw new Error(`empty response ${attempt} times for ${url}`)
    sleep(Math.min(30000, 5000 * attempt))
  }
}

export function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

/** curl a URL and return its body as text (small metadata requests only). */
export function fetchText(url, { maxTime = 120, globoff = false } = {}) {
  const r = spawnSync('curl', ['-sSL', ...(globoff ? ['-g'] : []), '--fail', '--retry', '3', '--max-time', String(maxTime), url], {
    encoding: 'utf8',
    maxBuffer: 64 << 20,
  })
  if (r.status !== 0) throw new Error(`curl failed (${r.status}) for ${url}: ${(r.stderr || '').trim()}`)
  return r.stdout
}
