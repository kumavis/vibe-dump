// Registering the service worker that serves the extracted tree at
// BASE/vfs/app/ (public/sw.js, written by integration). The Worker imports
// those URLs, so the page must be *controlled* before the harness starts.
//
// First visit: sw.js calls clients.claim() on activate, so the page that
// registered it is controlled without a reload. Hard reload (Shift+Reload):
// the page loads uncontrolled although the service worker is already active,
// so no activate (and no controllerchange) will come by itself; the page asks
// the active worker to claim it ({type: 'claim'}) and waits for that.

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
    // A module service worker (sw.js has a static import); there is no
    // classic fallback, which could not load it anyway: report the real error.
    await sw.register(url, { scope: base, type: 'module' })
    const registration = await withTimeout(sw.ready, timeoutMs)
    if (!sw.controller) {
      const controlled = new Promise((resolve) => sw.addEventListener('controllerchange', resolve, { once: true }))
      const active = registration?.active
      if (active) active.postMessage({ type: 'claim' })
      await withTimeout(controlled, timeoutMs)
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
