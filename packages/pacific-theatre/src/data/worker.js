// The pack decoder, off the main thread: fetch the PNGs, decode them, derive
// the normal and (for a box) land maps, and hand the typed arrays back without
// copying. Copied from holo-i-ke-au's data/worker.js (b480c27); the decode
// parameters (normalExag, aoExag, land) now come with each job.

import { decodeImage } from './image.js'
import { derivePack } from './decode.js'

self.onmessage = async (e) => {
  const { job, heightUrl, rainUrl, W, H, scale, offset, mx, mz, normalExag, aoExag, land } = e.data
  try {
    const hi = await decodeImage(heightUrl)
    if (hi.W !== W || hi.H !== H) throw new Error(`${heightUrl} is ${hi.W}×${hi.H}, the manifest says ${W}×${H}`)
    let rainPx = null
    if (rainUrl) {
      try {
        const r = await decodeImage(rainUrl)
        if (r.W === W && r.H === H) rainPx = r.px
        else self.postMessage({ job, warn: `${rainUrl} is ${r.W}×${r.H}, not ${W}×${H}; ignored` })
      } catch (err) {
        self.postMessage({ job, warn: `${rainUrl}: ${err.message}` })
      }
    }
    const out = derivePack({ heightPx: hi.px, rainPx, W, H, scale, offset, mx, mz, normalExag, aoExag, land })
    const transfer = [out.metres.buffer, out.normals.buffer]
    if (out.land) transfer.push(out.land.buffer)
    self.postMessage({ job, ok: true, ...out }, transfer)
  } catch (err) {
    self.postMessage({ job, ok: false, message: String(err?.message || err) })
  }
}
