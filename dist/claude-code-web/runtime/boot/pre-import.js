// Pre-import the __bunRequire targets (module-graph.js gives the order) into
// the registry that require.js reads.
//
// One `import()` per module in a loop works, but every call waits for the
// service worker to serve that module's new dependencies before the next can
// start: ~1,700 modules fetched in hundreds of sequential steps. Instead this
// builds one loader module whose static imports are, in order, a tiny
// "registrar" module per target:
//
//   registrar(T):  import * as ns from "<T>"; globalThis.__ccwRegister("<T>", ns)
//   loader:        import "<registrar(T1)>"; import "<registrar(T2)>"; ...
//
// The browser then fetches the whole graph in parallel, and module evaluation
// still runs in exactly that order: T1's graph, then T1 is registered, then
// T2's graph (which may __bunRequire T1 at its top level), and so on.
// Registrars and the loader are blob: modules, so they import their targets by
// absolute URL.
//
// If evaluation throws somewhere, the import of the loader rejects; every
// target that did not get registered is then retried one by one (modules that
// already ran are not run again), so one bad module costs only itself.

export async function preImportAll (order, { appUrl, registry, onProgress = () => {}, onError = () => {} }) {
  const blobs = []
  const blobUrl = (src) => {
    const u = URL.createObjectURL(new Blob([src], { type: 'text/javascript' }))
    blobs.push(u)
    return u
  }
  let done = 0
  const total = order.length
  globalThis.__ccwRegister = (p, ns) => {
    registry.set(p, ns)
    done++
    if (done % 50 === 0 || done === total) onProgress(done, total)
  }
  const failed = []
  try {
    const registrars = order.map((p) => blobUrl(
      `import * as ns from ${JSON.stringify(new URL(p, appUrl).href)};globalThis.__ccwRegister(${JSON.stringify(p)},ns);`))
    const loader = blobUrl(registrars.map((u) => `import ${JSON.stringify(u)};`).join('\n'))
    try {
      await import(loader)
    } catch (err) {
      onError(null, err)
      for (const p of order) {
        if (registry.has(p)) continue
        try {
          registry.set(p, await import(new URL(p, appUrl).href))
        } catch (e) {
          failed.push(p)
          onError(p, e)
        }
      }
    }
  } finally {
    for (const u of blobs) URL.revokeObjectURL(u)
    delete globalThis.__ccwRegister
  }
  return { failed }
}
