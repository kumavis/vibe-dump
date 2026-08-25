import { defineConfig, mergeConfig } from 'vite'
import shared from '../../vite.config.shared.js'

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

export default mergeConfig(shared, defineConfig({ plugins: [preloadRoom()] }))
