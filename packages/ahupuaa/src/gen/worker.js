// Runs the whole island generator off the main thread and hands back typed
// arrays (transferred, not copied) plus a plain-object description of
// everything that was placed on the land.

import { generateIsland } from './island-data.js'

self.onmessage = (e) => {
  const { seed } = e.data
  try {
    const out = generateIsland(seed, (stage, p) => self.postMessage({ type: 'progress', stage, p }))
    self.postMessage({ type: 'done', data: out.data, meta: out.meta }, out.transfer)
  } catch (err) {
    self.postMessage({ type: 'error', message: String(err && err.stack ? err.stack : err) })
  }
}
