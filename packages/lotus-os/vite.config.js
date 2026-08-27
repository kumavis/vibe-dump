import { defineConfig, mergeConfig } from 'vite'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { dirname, extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import shared from '../../vite.config.shared.js'
import { EMBEDS } from './src/os/embeds.js'

const pkgDir = dirname(fileURLToPath(import.meta.url))

/**
 * Preload the room at build time.
 *
 * The room is a dynamic import, which is what keeps the desktop down to about
 * 31 kB — but Vite only injects a preload link for a dynamic chunk at the
 * moment the import actually runs, so on a cold cache the first reveal still
 * waits on the network. Emitting a modulepreload into the HTML instead means
 * the browser fetches and compiles the room alongside the desktop, off the
 * critical path, and by the time anyone double-clicks reveal.run it is already
 * in memory.
 *
 * The trade is bandwidth for a visitor who never runs the executable. That is
 * the right way round: the reveal is the whole point of the app, and a loading
 * card in front of it costs more than a background fetch behind it.
 *
 * Finds the chunk from the bundle rather than by name — the filenames are
 * content-hashed, and a hardcoded one would rot on the next build. The
 * single-file artifact build inlines its dynamic imports, so there is no such
 * chunk there and this correctly emits nothing.
 */
function preloadRoom() {
  return {
    name: 'lotus-preload-room',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx?.bundle
        if (!bundle) return
        const room = Object.values(bundle).find(
          (c) => c.type === 'chunk' && c.isDynamicEntry && /scene[\\/]index\.js$/.test(c.facadeModuleId ?? ''),
        )
        if (!room) return // inlined build: nothing to go and get

        // Its own static imports are part of the same wait, so preload those too.
        const files = new Set()
        const walk = (name) => {
          if (files.has(name)) return
          files.add(name)
          const chunk = bundle[name]
          if (chunk?.type === 'chunk') for (const dep of chunk.imports) walk(dep)
        }
        walk(room.fileName)

        return [...files].map((file) => ({
          tag: 'link',
          attrs: { rel: 'modulepreload', crossorigin: true, href: `./${file}` },
          injectTo: 'head',
        }))
      },
    },
  }
}

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.map': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

/**
 * Serve the neighbours the `frame` program embeds.
 *
 * In the built gallery Lotus OS sits at /vibe-dump/lotus-os/ with the rest of
 * the dump beside it, so the `../<pkg>/` the frame asks for is simply there.
 * The dev server has one package in it and that URL lands on /<pkg>/, which is
 * nothing — and worse than nothing, because Vite answers an unknown path with
 * its own index.html and the frame would fill with a second Lotus OS.
 *
 * So hand it the neighbour's built output at the same path. Build the sibling
 * once (`npm run build -w @vibe-dump/<pkg>`) and the embedded window works in
 * dev exactly as it does in the gallery; skip that and the middleware stands
 * aside, the frame gets Vite's fallback, and it says so rather than pretending.
 *
 * This is the only line of contact between the two packages and it is a
 * directory name — neither one imports anything from the other.
 */
function serveNeighbours(pkgs) {
  return {
    name: 'lotus-serve-neighbours',
    apply: 'serve',
    configureServer(server) {
      for (const pkg of pkgs) {
        const dir = resolve(pkgDir, '..', pkg, 'dist')
        server.middlewares.use(`/${pkg}`, (req, res, next) => {
          const rel = normalize(decodeURIComponent((req.url ?? '/').split('?')[0]))
          let file = join(dir, rel)
          // normalize() collapses `..` before it can climb, decoded first so an
          // escaped one collapses too — but the result is still checked against
          // the directory rather than trusted, and the separator is part of the
          // check so a sibling starting with the same name is not "inside" it.
          if (file !== dir && !file.startsWith(dir + sep)) return next()
          if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
          if (!existsSync(file)) return next()
          res.setHeader('Content-Type', MIME[extname(file)] ?? 'application/octet-stream')
          createReadStream(file).pipe(res)
        })
      }
    },
  }
}

export default mergeConfig(
  shared,
  defineConfig({
    plugins: [preloadRoom(), serveNeighbours([...new Set(Object.values(EMBEDS).map((e) => e.pkg))])],
  }),
)
