// The district decoder, off the main thread (data/district.js): fetch and
// decode the pack's PNGs, derive everything the close-up draws
// (district-decode.js), and hand the typed arrays back without copying.

import { decodeImage } from './image.js'
import { deriveDistrict } from './district-decode.js'

self.onmessage = async (e) => {
  const { id, heightUrl, rainUrl, patchUrls, ...job } = e.data
  try {
    const hi = await decodeImage(heightUrl)
    if (hi.W !== job.W || hi.H !== job.H) throw new Error(`${heightUrl} is ${hi.W}×${hi.H}, the manifest says ${job.W}×${job.H}`)
    let rainPx = null
    if (rainUrl) {
      const r = await decodeImage(rainUrl).catch(() => null)
      if (r && r.W === job.W && r.H === job.H) rainPx = r.px
    }
    const patchPx = []
    for (const u of patchUrls) {
      const p = await decodeImage(u).catch(() => null)
      if (p && p.W === job.W && p.H === job.H) patchPx.push(p.px)
    }
    const out = deriveDistrict({ ...job, heightPx: hi.px, rainPx, patchPx })
    const transfer = [out.metres.buffer, out.normals.buffer, out.land.buffer, out.aux.buffer, out.carve.buffer, out.streams.buffer, ...out.trees.lists.map((l) => l.buffer)]
    self.postMessage({ id, ok: true, out }, transfer)
  } catch (err) {
    self.postMessage({ id, ok: false, message: String(err?.message || err) })
  }
}
