// The geology's height images, decoded off the main thread (data/geology.js).

import { decodeImage } from './image.js'
import { decodeHeights } from './geology.js'

self.onmessage = async (e) => {
  const { id, url, W, H, scale, offset } = e.data
  try {
    const im = await decodeImage(url)
    if (im.W !== W || im.H !== H) throw new Error(`${url} is ${im.W}×${im.H}, the geology manifest says ${W}×${H}`)
    const out = decodeHeights(im.px, W, H, scale, offset)
    self.postMessage({ id, ok: true, out }, [out.half.buffer, out.coarse.buffer])
  } catch (err) {
    self.postMessage({ id, ok: false, message: String(err?.message || err) })
  }
}
