#!/usr/bin/env node
// Build a self-contained single-file version of the app, for hosts that serve
// one page and nothing beside it (the claude.ai artifact viewer's CSP among
// them). Run it directly — it does its own build:
//
//   node tools/standalone.mjs            → dist/artifact.html
//
// The emitted file is a page *fragment* — title, style, markup, script, with no
// <html>/<body> wrapper — as the artifact pipeline expects.
//
// The one thing this build gives up is the point of the normal one. Lotus OS
// keeps three.js and the whole room behind a dynamic import so the desktop
// costs 31 kB and the room is only paid for by someone who runs reveal.run.
// A single file has nowhere to fetch that second chunk from, so here it is
// inlined and the room arrives with everything else. The reveal still works;
// it is just already in the room's pocket when you ask for it.
//
// The neighbours in the `frame` windows are the exception to all of that. In a
// normal build the frame goes next door — a sibling directory of this one — and
// a single file has no next door, so this build hands it each neighbour's
// published address instead, on `window.__LOTUS_EMBEDS__` before the OS boots.
// A URL rather than a copy: half a megabyte of somebody else's program does not
// belong in this file, and the deployed one is the same program anyway. The
// cost is that the window now needs the network and needs the host to permit
// framing; the frame checks both and says which one failed.
import { build } from 'vite'
import { readFile, writeFile, readdir, rm } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { EMBEDS } from '../src/os/embeds.js'

const pkgDir = dirname(dirname(fileURLToPath(import.meta.url)))
const outDir = join(pkgDir, 'dist-standalone')

await build({
  root: pkgDir,
  base: './',
  logLevel: 'warn',
  build: {
    outDir,
    emptyOutDir: true,
    // One chunk, or there is a second file to go and find.
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
})

const html = await readFile(join(outDir, 'index.html'), 'utf8')
const assets = await readdir(join(outDir, 'assets'))
const js = await readFile(join(outDir, 'assets', assets.find((f) => f.endsWith('.js'))), 'utf8')
const css = await readFile(join(outDir, 'assets', assets.find((f) => f.endsWith('.css'))), 'utf8')

// The page title carries a tagline for the deployed site, where it sits in a
// browser tab on its own. In a gallery of artifacts it sits beside dozens of
// others and wants to be a name, so keep the half before the dash.
const title = (html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? 'Lotus OS').split(/\s+[—-]\s+/)[0].trim()
const bodyInner = html
  .replace(/[\s\S]*<body[^>]*>/, '')
  .replace(/<\/body>[\s\S]*/, '')
  .replace(/<script[^>]*src=[^>]*><\/script>\s*/g, '')
  .trim()

// `</script` inside inlined code would close the tag early; the escaped form is
// byte-identical once the parser hands the string to JS.
const guard = (s) => s.replaceAll('</script', '<\\/script')

// A classic script runs before any module does, so the table is on the window
// by the time the OS looks for it. An entry with no published address is left
// out rather than written as null: the frame reads "no override" off a missing
// key, and would have nowhere to go with an empty one.
const addresses = Object.fromEntries(
  Object.entries(EMBEDS)
    .filter(([, embed]) => embed.home)
    .map(([id, embed]) => [id, embed.home]),
)
const embeds = Object.keys(addresses).length
  ? `<script>window.__LOTUS_EMBEDS__=${JSON.stringify(addresses).replaceAll('<', '\\u003c')}</script>\n`
  : ''

const out = `<title>${title}</title>
<style>
${css}
</style>
${bodyInner}
${embeds}<script type="module">
${guard(js)}
</script>
`

await writeFile(join(pkgDir, 'dist', 'artifact.html'), out)
await rm(outDir, { recursive: true, force: true })
console.log(
  `Wrote dist/artifact.html — ${(out.length / 1024).toFixed(0)} KiB ` +
    `(script ${(js.length / 1024).toFixed(0)}, style ${(css.length / 1024).toFixed(0)})`,
)
for (const [id, url] of Object.entries(addresses)) console.log(`  ${id} → ${url}`)
