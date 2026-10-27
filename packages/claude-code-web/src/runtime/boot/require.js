// globalThis.__bunRequire: what `import.meta.require(p)` was rewritten to.
//
// Bun's import.meta.require is a synchronous import. Here every target is
// imported ahead of time by boot.js (see module-graph.js) and read from
// `registry`. Bun returns an ES module's namespace object as is, even when
// `default` is its only export: the bundle reads `.default` off it
// (`X = import.meta.require(p).default`), so there is no CommonJS-style
// unwrapping here. Built-ins and the npm names Bun provided ('ws', 'undici')
// come from the node shim registry.
//
// A miss on a known target means the target is still being evaluated: a
// top-level require inside an import cycle (one pair in 2.1.311, see
// module-graph.js). Bun hands back the half-built namespace; Node, under the
// FreeBSD port, throws ERR_REQUIRE_CYCLE_MODULE and the port answers with
// forwarding proxies. So do we: the namespace returned forwards to the real
// one once it is in the registry, and an export read from it before then
// (`var {f} = __bunRequire(p)`) is itself a proxy that forwards each use
// (call, construct, property access) to the real export. This mirrors the
// approach of the FreeBSD port's bun-polyfill.cjs (BSD-2-Clause); the code
// here is our own.

/**
 * @param {object} o
 * @param {Map<string, object>} o.registry    VFS path -> module namespace
 * @param {Set<string>} o.known               every path a require may name (the pre-import targets)
 * @param {(id: string) => boolean} o.isShimmed
 * @param {(id: string) => any} o.requireShim
 * @param {object} o.fs                        the VFS (text assets)
 * @param {(path: string) => void} [o.onMiss]
 */
export function makeRequire ({ registry, known, isShimmed, requireShim, fs, onMiss }) {
  const lookup = (p) => registry.get(p)

  return function __bunRequire (id) {
    const s = String(id)
    if (isShimmed(s)) return requireShim(s)
    const p = /^https?:/.test(s) ? new URL(s).pathname : s
    const hit = lookup(p)
    if (hit !== undefined) return hit
    // Bun returns the text of a required .md/.txt sibling (prompt templates).
    if (/\.(md|txt)$/.test(p) && fs.existsSync(p)) return fs.readFileSync(p, 'utf8')
    if (known.has(p)) {
      onMiss?.(p)
      return lazyNamespace(() => lookup(p))
    }
    const err = new Error(`Cannot find module '${s}'`)
    err.code = 'MODULE_NOT_FOUND'
    throw err
  }
}

function lazyNamespace (resolve) {
  return new Proxy({}, {
    get (_, prop) {
      const ns = resolve()
      if (ns !== undefined) return ns[prop]
      // not a thenable, and symbols (inspection) read as absent
      if (typeof prop !== 'string' || prop === 'then') return undefined
      return lazyExport(() => resolve()?.[prop])
    },
    has: (_, prop) => prop in (resolve() ?? {}),
    ownKeys: () => Reflect.ownKeys(resolve() ?? {}),
    getOwnPropertyDescriptor (_, prop) {
      const ns = resolve()
      if (!ns || !(prop in ns)) return undefined
      return { value: ns[prop], enumerable: true, configurable: true, writable: true }
    }
  })
}

// A bound function as the target: a Proxy is callable/constructible only when
// its target is (an arrow function would make `new` throw before the trap
// runs), and unlike a plain function it has no non-configurable `prototype`
// own property, which ownKeys would then have to report.
function lazyExport (value) {
  return new Proxy(function () {}.bind(null), {
    get (_, prop) {
      const v = value()
      if (v === undefined || v === null) return undefined
      const out = v[prop]
      return typeof out === 'function' && typeof v !== 'function' ? out.bind(v) : out
    },
    set (_, prop, val) {
      const v = value()
      if (v !== undefined && v !== null) v[prop] = val
      return true
    },
    has: (_, prop) => { const v = value(); return v !== undefined && v !== null && prop in Object(v) },
    ownKeys: () => { const v = value(); return v !== undefined && v !== null ? Reflect.ownKeys(Object(v)).filter((k) => Reflect.getOwnPropertyDescriptor(Object(v), k)?.configurable !== false) : [] },
    getOwnPropertyDescriptor (_, prop) {
      const v = value()
      if (v === undefined || v === null || !(prop in Object(v))) return undefined
      return { value: v[prop], enumerable: true, configurable: true, writable: true }
    },
    apply: (_, self, args) => Reflect.apply(value(), self, args),
    construct: (_, args) => Reflect.construct(value(), args)
  })
}
