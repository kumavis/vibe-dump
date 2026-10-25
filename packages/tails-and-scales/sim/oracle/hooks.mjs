// Module-resolution hooks for running the game in Node (registered by
// register.mjs). The game's `three` becomes the renderer-less shim and
// OrbitControls a stub; every other `three/…` import resolves from this
// directory, so a `git archive` of the game unpacked outside the repo still
// finds the repo's node_modules.
const HERE = new URL('./', import.meta.url).href
const SHIM = HERE + 'three-shim.mjs'

export async function resolve(spec, ctx, next) {
  const parent = ctx.parentURL || ''
  if (spec === 'three' && !parent.startsWith(HERE)) return { url: SHIM, shortCircuit: true }
  if (spec.endsWith('controls/OrbitControls.js')) return { url: HERE + 'orbit-stub.mjs', shortCircuit: true }
  if (spec === 'three' || spec.startsWith('three/')) return next(spec, { ...ctx, parentURL: SHIM })
  return next(spec, ctx)
}
