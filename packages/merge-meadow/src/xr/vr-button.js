// The Enter-VR button. Never the stock VRButton/XRButton: VRButton degrades to a
// visible "VR NOT SUPPORTED" pill that would sit in every gallery thumbnail, and
// XRButton tries immersive-ar first (passthrough on a Quest, with our sky painted
// over it). This one stays `hidden` unless immersive-vr is really supported.
// Returns the <button> itself (append it wherever the UI wants it), carrying
// `supported` (Promise<boolean>), `enter()`, `exit()`, `session` and `dispose()`.
export const SESSION_INIT = { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking', 'layers'] }

export function makeVRButton (renderer, { onSessionStart, onSessionEnd, parent, sessionInit = SESSION_INIT, label = 'Enter VR', exitLabel = 'Exit VR', doc = globalThis.document } = {}) {
  // outside a browser: an inert stand-in with the same surface
  const el = doc?.createElement ? doc.createElement('button') : { hidden: true, textContent: label, remove () {} }
  el.hidden = true; el.textContent = label
  if (doc?.createElement) {
    el.type = 'button'; el.className = 'mm-vr-button'
    el.setAttribute('aria-label', label)
    parent?.appendChild(el)
  }
  let session = null
  let busy = false

  const xr = globalThis.navigator?.xr
  const supported = (async () => {
    if (!xr?.isSessionSupported) return false
    try { return !!(await xr.isSessionSupported('immersive-vr')) } catch { return false }
  })().then((ok) => { el.hidden = !ok; return ok })

  function ended () {
    session?.removeEventListener('end', ended)
    session = null
    el.textContent = label
    try { onSessionEnd?.() } catch (e) { console.error('[vr-button]', e) }
  }

  async function enter () {
    if (session || busy || !(await supported)) return session
    busy = true
    try {
      const s = await xr.requestSession('immersive-vr', sessionInit)
      session = s
      s.addEventListener('end', ended)
      await renderer.xr.setSession(s)
      el.textContent = exitLabel
      try { onSessionStart?.(s) } catch (e) { console.error('[vr-button]', e) }
      return s
    } catch (e) {
      console.error('[vr-button] could not start an immersive-vr session:', e)
      session = null
      return null
    } finally { busy = false }
  }
  const exit = async () => { if (session) await session.end() }

  el.addEventListener?.('click', () => { session ? exit() : enter() })
  el.supported = supported
  el.enter = enter
  el.exit = exit
  Object.defineProperty(el, 'session', { get: () => session, configurable: true })
  el.dispose = () => { el.remove(); if (session) session.end() }
  return el
}
