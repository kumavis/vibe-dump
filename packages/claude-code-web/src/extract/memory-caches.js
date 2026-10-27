// A tiny in-memory stand-in for the browser's CacheStorage (`caches`), with
// just the surface cache.js uses: caches.open/has/delete/keys and
// cache.put/match/keys/delete. Used by the Node unit tests, and usable as an
// explicit non-persistent fallback where the Cache API is unavailable (a
// non-secure origin); the service worker cannot see it, so the page would
// have to serve the tree some other way.

const keyOf = (req) => (typeof req === 'string' ? new URL(req).href : req instanceof URL ? req.href : req.url)

class MemoryCache {
  constructor () { this.map = new Map() }

  async put (req, res) {
    const url = keyOf(req)
    if (!/^https?:/.test(url)) throw new TypeError(`Cache.put: unsupported URL scheme in ${url}`)
    // Store the body bytes, as the real Cache API does (it consumes the Response).
    const body = new Uint8Array(await res.arrayBuffer())
    this.map.set(url, { body, status: res.status, headers: [...res.headers] })
  }

  async match (req) {
    const e = this.map.get(keyOf(req))
    return e ? new Response(e.body.slice(), { status: e.status, headers: e.headers }) : undefined
  }

  async keys () { return [...this.map.keys()].map((u) => new Request(u)) }
  async delete (req) { return this.map.delete(keyOf(req)) }
}

export function createMemoryCaches () {
  const stores = new Map()
  return {
    async open (name) {
      if (!stores.has(name)) stores.set(name, new MemoryCache())
      return stores.get(name)
    },
    async has (name) { return stores.has(name) },
    async delete (name) { return stores.delete(name) },
    async keys () { return [...stores.keys()] },
    /** test helper: total bytes stored */
    bytes () {
      let n = 0
      for (const c of stores.values()) for (const e of c.map.values()) n += e.body.length
      return n
    }
  }
}
