// The first module index.html evaluates (design §7.3, §16.1). ESM hoists both
// imports above lockdown(): the eventual-send shim must install HandledPromise
// before @endo/far or @endo/captp evaluate anywhere (spike S1: without it a
// static captp import dies with "HandledPromise is not defined"), and nothing
// that main.js imports may evaluate before this module body has run — which is
// why main is imported dynamically by entry.js and there is no manualChunks.
import 'ses'
import '@endo/eventual-send/shim.js'

const t0 = performance.now()
try {
  lockdown({ overrideTaming: 'severe', errorTaming: 'unsafe', consoleTaming: 'unsafe' })
  globalThis.__mmLockedDown = true
} catch (e) {
  // main's boot guard sees the unfrozen intrinsics, keeps doc systems off and says why
  globalThis.__mmLockedDown = false
  console.error('[boot] lockdown failed', e)
}
globalThis.__boot = { locked: globalThis.__mmLockedDown, lockdownMs: Math.round((performance.now() - t0) * 100) / 100 }
