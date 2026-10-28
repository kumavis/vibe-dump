// Service worker: serves the extracted Claude Code tree at BASE/vfs/app/*
// from the Cache API (written by src/extract/cache.js), so the Worker can load
// the module graph with plain import(). Registered at BASE scope by
// src/host/sw-client.js as a *module* service worker (the static import below
// needs that).
//
// While serving a JavaScript file it rewrites Node built-in specifiers in
// import positions ("fs", "node:fs", "ws", ...) to BASE/runtime/node/<shim>.js,
// using the fixed list in runtime/node/BUILTINS.js: import maps are not
// available to Workers, and the cached tree stays exactly as extracted.
//
// Everything outside BASE/vfs/app/ is left to the network (no respondWith).
import { rewriteSpecifiers } from './runtime/boot/specifiers.js'

const SCOPE = new URL(self.registration.scope)
const APP_PATH = new URL('vfs/app/', SCOPE).pathname
const SHIM_PATH = new URL('runtime/node/', SCOPE).pathname

// First visit: take over at once, and claim the page that registered us so
// the harness Worker it creates next is controlled without a reload.
self.addEventListener('install', (event) => { event.waitUntil(self.skipWaiting()) })
self.addEventListener('activate', (event) => { event.waitUntil(self.clients.claim()) })
// A hard reload (Shift+Reload) loads the page uncontrolled while this worker
// is already active, so no activate follows: the page asks to be claimed.
self.addEventListener('message', (event) => {
  if (event.data?.type === 'claim') event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET' && req.method !== 'HEAD') return
  const url = new URL(req.url)
  if (url.origin !== SCOPE.origin || !url.pathname.startsWith(APP_PATH)) return
  event.respondWith(serve(url, req.method))
})

// The cc-app-<version> caches, newest first (CacheStorage keys are in creation order).
async function appCaches () {
  return (await caches.keys()).filter((n) => n.startsWith('cc-app-')).reverse()
}

// Rewritten JavaScript is kept in a companion cache next to cc-app-<version>
// and served from there: one CacheStorage lookup per module on every boot
// after the first (a boot fetches ~1,700 modules, so per-request work is what
// bounds it), and a Response straight from CacheStorage is one the browser
// can attach its compiled-code cache to. src/extract/cache.js deletes the
// companion whenever it rewrites or clears cc-app-<version>, so its entries
// are never stale; REWRITE_VERSION retires them when this file's rewriting
// changes.
const REWRITE_VERSION = 1
const rewrittenName = (appName) => appName.replace(/^cc-app-/, `cc-sw${REWRITE_VERSION}-`)
let current = null // {app, rewritten}: the cache pair last served from

self.addEventListener('activate', (event) => {
  // drop companions written by an older rewrite version
  event.waitUntil(caches.keys().then((names) => Promise.all(names
    .filter((n) => n.startsWith('cc-sw') && !n.startsWith(`cc-sw${REWRITE_VERSION}-`))
    .map((n) => caches.delete(n)))))
})

async function serve (url, method) {
  const key = url.origin + url.pathname
  if (current) {
    const hit = await caches.match(key, { cacheName: current.rewritten })
    if (hit) return method === 'HEAD' ? new Response(null, { headers: hit.headers }) : hit
  }
  for (const name of await appCaches()) {
    const cache = await caches.open(name)
    const res = await cache.match(key)
    if (!res) continue
    current = { app: name, rewritten: rewrittenName(name) }
    const type = res.headers.get('content-type') || 'application/octet-stream'
    if (!type.startsWith('text/javascript')) return res
    const out = new Response(rewriteSpecifiers(await res.text(), SHIM_PATH), {
      headers: { 'content-type': 'text/javascript; charset=utf-8' }
    })
    await (await caches.open(current.rewritten)).put(key, out.clone())
    return method === 'HEAD' ? new Response(null, { headers: out.headers }) : out
  }
  return new Response(`not in the extracted tree: ${url.pathname}`, { status: 404, headers: { 'content-type': 'text/plain' } })
}
