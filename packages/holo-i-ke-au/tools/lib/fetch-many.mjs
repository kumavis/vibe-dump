// Many downloads at once, for the district bake's lidar tiles (hundreds of
// small GeoTIFFs). The same contract as fetchTo in fetch.mjs: curl, not
// Node's fetch, so the machine's proxy is honoured; a file already in the
// ledger and on disk at its recorded size is not fetched again; a body is
// written to <file>.part and renamed only when complete and non-empty; every
// file fetched goes into the ledger with its URL, date, size and SHA-256.
// The only difference is that up to `parallel` curls run at a time.
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, renameSync, rmSync, statSync } from 'node:fs'
import { dirname } from 'node:path'
import { sha256, sleep, today } from './fetch.mjs'

function curl(url, tmp, maxTime) {
  return new Promise((done) => {
    const p = spawn('curl', ['-sSL', '--fail', '--retry', '3', '--max-time', String(maxTime), '-o', tmp, '-w', '%{http_code}', url])
    let out = ''
    let err = ''
    p.stdout.on('data', (d) => (out += d))
    p.stderr.on('data', (d) => (err += d))
    p.on('close', (code) => done({ code, status: Number(out.trim().slice(-3)) || 0, err: err.trim() }))
  })
}

/**
 * jobs: [{ url, file }]. Returns [{ url, file, ok, status, cached }] in the
 * order given. An HTTP error comes back as ok: false with its status; a
 * transport failure, or an empty body three times running, throws.
 */
export async function fetchManyTo(ledger, jobs, { parallel = 6, maxTime = 600, onDone = () => {} } = {}) {
  const results = new Array(jobs.length)
  let next = 0
  async function worker() {
    while (next < jobs.length) {
      const k = next++
      const { url, file } = jobs[k]
      mkdirSync(dirname(file), { recursive: true })
      const known = ledger.get(file)
      if (known && known.url === url && known.bytes > 0 && existsSync(file) && statSync(file).size === known.bytes) {
        results[k] = { url, file, ok: true, status: 200, cached: true }
        onDone(results[k], k)
        continue
      }
      const tmp = file + '.part'
      for (let attempt = 1; ; attempt++) {
        rmSync(tmp, { force: true })
        const r = await curl(url, tmp, maxTime)
        if (r.code !== 0) {
          rmSync(tmp, { force: true })
          if (r.status >= 400) {
            results[k] = { url, file, ok: false, status: r.status, cached: false }
            break
          }
          throw new Error(`curl failed (${r.code}) for ${url}: ${r.err}`)
        }
        if (existsSync(tmp) && statSync(tmp).size > 0) {
          renameSync(tmp, file)
          ledger.put(file, { url, fetched: today(), bytes: statSync(file).size, sha256: sha256(file) })
          results[k] = { url, file, ok: true, status: r.status, cached: false }
          break
        }
        rmSync(tmp, { force: true })
        if (attempt >= 3) throw new Error(`empty response ${attempt} times for ${url}`)
        sleep(2000 * attempt)
      }
      onDone(results[k], k)
    }
  }
  await Promise.all(Array.from({ length: Math.min(parallel, jobs.length) }, worker))
  return results
}
