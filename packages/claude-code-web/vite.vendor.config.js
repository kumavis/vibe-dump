// Vite lib-mode config for runtime/vendor.js (track B; used only by
// scripts/build-runtime.mjs, which passes `build.outDir`).
//
// One ESM file, no code splitting, no hash in the name. Node built-ins that the
// bundled libraries import (memfs needs buffer/events/path/stream/url) stay
// external and are rewritten to ./node/<name>.js, i.e. our own shims next to
// vendor.js in dist/runtime/.
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { BUILTINS } from './src/runtime/node/BUILTINS.js'

const root = fileURLToPath(new URL('.', import.meta.url))
const builtins = new Set(BUILTINS)
const bare = (id) => id.replace(/^node:/, '')
const isBuiltin = (id) => id.startsWith('node:') || builtins.has(id)

export default defineConfig({
  root,
  base: './',
  publicDir: false,
  logLevel: 'warn',
  build: {
    outDir: 'dist/runtime',
    emptyOutDir: false,
    copyPublicDir: false,
    target: 'es2022',
    sourcemap: false,
    reportCompressedSize: false,
    // memfs and its @jsonjoy.com helpers are CommonJS with require cycles.
    // With the default ('auto') wrapping, which modules get a lazy wrapper
    // depends on the order Rollup finished loading them, and that order
    // varied run to run with filesystem timing, so vendor.js was not
    // byte-identical across builds. Wrapping every CommonJS module keeps the
    // output deterministic, which the committed dist/ relies on.
    commonjsOptions: { strictRequires: true },
    lib: {
      entry: fileURLToPath(new URL('./src/runtime/vendor-entry.js', import.meta.url)),
      formats: ['es'],
      fileName: () => 'vendor.js',
    },
    rollupOptions: {
      external: (id) => isBuiltin(id),
      output: {
        inlineDynamicImports: true,
        paths: (id) => (isBuiltin(id) ? `./node/${bare(id)}.js` : id),
      },
    },
  },
})
