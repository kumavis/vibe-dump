// The era layers' baker, off the main thread: fetch and decode one
// keyframe's masks, pack them, and hand the grids back without copying.

import { decodeImage } from './image.js'
import { bakeKeyframe, decodeGrey, transfers } from './layers.js'

self.onmessage = async (e) => {
  const job = e.data
  try {
    const out = await bakeKeyframe(job, (url) => decodeGrey(decodeImage, url))
    self.postMessage({ job: job.job, ok: true, out }, transfers(out))
  } catch (err) {
    self.postMessage({ job: job.job, ok: false, message: String(err?.message || err) })
  }
}
