// Bun.serve / Bun.listen / Bun.connect, inert: a page cannot accept
// connections, and v1 has nothing that dials a socket.
//
// serve() and listen() return objects of the right shape that never receive
// anything; each gets a made-up port so code that prints or compares ports
// keeps working. Live inert servers are kept in `servers` (port -> server) so
// an in-page fetch shim could route http://127.0.0.1:<port>/ to server.fetch()
// if that is ever wanted. connect() always fails with ECONNREFUSED, which the
// 2.1.311 probes treat as "nothing listening".

let nextPort = 49152

function allocPort(requested) {
  const n = Number(requested)
  if (Number.isInteger(n) && n > 0 && n < 65536) return n
  if (nextPort > 65535) nextPort = 49152
  return nextPort++
}

export const servers = new Map()

export function serve(options = {}) {
  const hostname = options.hostname ?? 'localhost'
  const port = options.unix ? undefined : allocPort(options.port)
  let handler = options.fetch
  const server = {
    hostname,
    port,
    unix: options.unix,
    url: new URL(`http://${hostname.includes(':') ? `[${hostname}]` : hostname}${port ? `:${port}` : ''}/`),
    development: false,
    id: options.id ?? '',
    pendingRequests: 0,
    pendingWebSockets: 0,
    // Dispatch a Request to the handler in-process (nothing else ever calls it).
    async fetch(request) {
      if (typeof handler !== 'function') return new Response('Not Found', { status: 404 })
      return handler(request instanceof Request ? request : new Request(request), server)
    },
    async stop() { servers.delete(port) },
    reload(next = {}) { if (typeof next.fetch === 'function') handler = next.fetch; return server },
    ref() {},
    unref() {},
    requestIP() { return null },
    timeout() {},
    upgrade() { return false },
    publish() { return 0 },
    subscriberCount() { return 0 },
  }
  if (port !== undefined) servers.set(port, server)
  return server
}

export function listen(options = {}) {
  const port = options.unix ? undefined : allocPort(options.port)
  return {
    hostname: options.hostname ?? '0.0.0.0',
    port,
    unix: options.unix,
    data: options.data,
    stop() {},
    ref() {},
    unref() {},
    reload() {},
  }
}

export async function connect(options = {}) {
  const where = options.unix ?? `${options.hostname ?? 'localhost'}:${options.port}`
  const err = new Error(`connect ECONNREFUSED ${where} (no sockets in the browser runtime)`)
  err.code = 'ECONNREFUSED'
  err.errno = -111
  err.syscall = 'connect'
  try { options.socket?.connectError?.(undefined, err) } catch {}
  throw err
}
