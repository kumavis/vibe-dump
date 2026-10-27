// Registering the service worker that serves the extracted tree at
// BASE/vfs/app/ (public/sw.js, written by integration). The Worker imports
// those URLs, so the page must be *controlled* before the harness starts;
// sw.js is expected to call clients.claim() on activate, so the first visit
// does not need a reload.

import { serviceWorkerUrlFor } from './constants.js'

/**
 * @returns {Promise<{state: 'controlled'|'registered'|'missing'|'unsupported'|'error', error?: string}>}
 */
export async function ensureServiceWorker (base, { timeoutMs = 10_000, nav = globalThis.navigator, fetch = globalThis.fetch } = {}) {
  const sw = nav?.serviceWorker
  if (!sw) return { state: 'unsupported', error: 'service workers are unavailable here (they need https or localhost)' }
  const url = serviceWorkerUrlFor(base)
  try {
    if (fetch) {
      const head = await fetch(url, { method: 'HEAD', cache: 'no-store' }).catch(() => null)
      if (head && head.status === 404) return { state: 'missing', error: `${url} is not deployed` }
    }
    await sw.register(url, { scope: base, type: 'module' }).catch(() => sw.register(url, { scope: base }))
    await withTimeout(sw.ready, timeoutMs)
    if (!sw.controller) {
      await withTimeout(new Promise((resolve) => sw.addEventListener('controllerchange', resolve, { once: true })), timeoutMs)
    }
    return sw.controller ? { state: 'controlled' } : { state: 'registered', error: 'the service worker is active but does not control this page yet (reload once)' }
  } catch (err) {
    return { state: 'error', error: err?.message ?? String(err) }
  }
}

function withTimeout (promise, ms) {
  let timer
  return Promise.race([promise, new Promise((resolve) => { timer = setTimeout(resolve, ms) })]).finally(() => clearTimeout(timer))
}
