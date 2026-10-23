// The works' decoder, off the main thread (data/works.js): fetch one island's
// works file, decode it whole, and hand the typed arrays back without copying.

import { decodeWorks, transfers } from './works.js'

self.onmessage = async (e) => {
  const { job, url, lat0, lon0 } = e.data
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const out = decodeWorks(await res.json(), { lat0, lon0 })
    self.postMessage({ job, ok: true, out }, transfers(out))
  } catch (err) {
    self.postMessage({ job, ok: false, message: String(err?.message || err) })
  }
}
