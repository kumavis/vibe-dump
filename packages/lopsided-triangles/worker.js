// Runs the chapter 9 instance off the main thread.

import { createEngine } from './engine.js'

let engine = null

self.onmessage = (ev) => {
  const msg = ev.data
  try {
    if (!engine) engine = createEngine()
    if (msg.type === 'load') {
      const out = engine.load(msg.X, msg.Y)
      self.postMessage({ type: 'loaded', id: msg.id, ...out })
    } else if (msg.type === 'run') {
      const out = engine.run(msg.entries)
      self.postMessage({ type: 'result', id: msg.id, ...out })
    }
  } catch (err) {
    self.postMessage({ type: 'error', id: msg.id, message: String(err && err.message ? err.message : err) })
  }
}
