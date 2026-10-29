// Crash marker, session variant (design §7.3, spike S1): while doc systems run in
// this tab, localStorage['mm:running'] = {docId, systemsHash}; it is cleared on
// pagehide (a clean exit) and re-armed on pageshow. A boot that finds a marker
// for THIS doc with the SAME systems hash starts in safe mode, so a hang caused
// by a system costs one safe boot and editing any system re-enables systems.
// Only the doc id and a hash are stored: nothing from a doc reaches storage.
import { sourceHash } from './lower.js'

export const MARKER_KEY = 'mm:running'

const defaultStorage = () => { try { return globalThis.localStorage ?? null } catch { return null } }

// identity of the doc's runnable systems (enabled ones; order changes do not count)
export function systemsHash (doc) {
  const s = doc?.systems ?? {}
  const parts = Object.keys(s).sort().filter((n) => s[n]?.enabled !== false).map((n) => `${n}\u0000${String(s[n].source ?? '')}`)
  return parts.length ? sourceHash(parts.join('\u0001')) : ''
}

export function makeSafeMode ({ docId, systemsHash: initialHash = '', storage, forced = false, key = MARKER_KEY } = {}) {
  const store = storage === undefined ? defaultStorage() : storage
  const read = () => { try { const v = store?.getItem(key); return v ? JSON.parse(v) : null } catch { return null } }
  const write = (v) => { try { store?.setItem(key, JSON.stringify(v)) } catch {} }
  const clear = () => { try { store?.removeItem(key) } catch {} }
  let hash = initialHash
  let armed = false
  // the marker as this boot found it: crash evidence, before this tab arms its own
  const atBoot = read()

  return {
    shouldStartSafe (currentHash = hash) {
      if (forced) return true
      const m = read()
      return !!m && m.docId === docId && !!currentHash && m.systemsHash === currentHash
    },
    reason (currentHash = hash) {
      if (forced) return '#safe in the link'
      const m = read()
      if (m && m.docId === docId && m.systemsHash === currentHash) return 'the last session stopped while running this world\'s systems'
      return null
    },
    // call when doc systems start running (and again when their hash changes)
    arm (newHash = hash) { hash = newHash; if (!hash) return; armed = true; write({ docId, systemsHash: hash, at: Date.now() }) },
    disarm () { armed = false; clear() },
    // safe mode entered for `crashHash` after this tab had armed its own systems:
    // keep the evidence (the marker names the crashed systems again) and stop being
    // armed, so a clean exit does not clear it and the next stale boot stays safe
    hold (crashHash) { armed = false; if (crashHash) write({ docId, systemsHash: crashHash, at: Date.now() }) },
    onPageHide () { if (armed) clear() },
    onPageShow () { if (armed) write({ docId, systemsHash: hash, at: Date.now() }) },
    // the systems hash that was running when this doc's last session died, or null.
    // A boot can load a stale local doc (IndexedDB) and only later sync the systems
    // that hung; the app compares every new hash against this one.
    bootCrashHash () { return atBoot && atBoot.docId === docId && atBoot.systemsHash ? atBoot.systemsHash : null },
    get armed () { return armed },
    get forced () { return forced },
  }
}

// Sync doc systems under the crash marker. `sync` evaluates module bodies and
// runs init(), and either can hang the tab, so the marker for the new systems
// hash is written BEFORE it runs (arming after sync meant a system hanging in
// init or in its module body never left a marker, and every boot of that doc
// hung again). Disarms when nothing ended up running. Returns { report, armed }.
export function syncArmed (safe, { hash, armed = null, sync, running }) {
  let now = armed
  if (hash && hash !== armed) { safe.arm(hash); now = hash }
  const report = sync()
  if (now && !running()) { safe.disarm(); now = null }
  return { report, armed: now }
}
