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
// Two things this build gives up, and one it has to carry.
//
// It gives up the point of the normal build. Lotus OS keeps three.js and the
// whole room behind a dynamic import so the desktop costs 31 kB and the room is
// only paid for by someone who runs reveal.run. A single file has nowhere to
// fetch that second chunk from, so here it is inlined and the room arrives with
// everything else. The reveal still works; it is just already in the room's
// pocket when you ask for it.
//
// And it has to carry the neighbours. The `frame` program shows a sibling app
// out of the same gallery, which in a normal build is a directory next door.
// One page has no next door and no network, so each neighbour is built the same
// way — one file, everything inlined — and parked on `window.__LOTUS_EMBEDS__`
// before the OS boots. The frame finds it there and puts it in a srcdoc instead
// of fetching it.
import { build } from 'vite'
import { readFile, writeFile, readdir, rm } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { EMBEDS } from '../src/os/embeds.js'

const pkgDir = dirname(dirname(fileURLToPath(import.meta.url)))
const outDir = join(pkgDir, 'dist-standalone')

// `</script` inside inlined code would close the tag early; the escaped form is
// byte-identical once the parser hands the string to JS.
const guard = (s) => s.replaceAll('</script', '<\\/script')

/** The one .js and one .css a single-chunk Vite build leaves in assets/. */
async function chunksOf(dir) {
  const assets = await readdir(join(dir, 'assets'))
  const read = (ext) => {
    const name = assets.find((f) => f.endsWith(ext))
    return name ? readFile(join(dir, 'assets', name), 'utf8') : Promise.resolve('')
  }
  return { js: await read('.js'), css: await read('.css') }
}

/**
 * Build a neighbouring package into one complete HTML document.
 *
 * Same trick as this file's own build, but the result stays a document rather
 * than becoming a fragment: it is going into an iframe, which wants a whole
 * page. A neighbour that is not checked out is skipped — the frame falls back
 * to fetching it and explains itself if that fails too.
 */
async function bakeNeighbour(pkg) {
  const root = join(pkgDir, '..', pkg)
  if (!existsSync(join(root, 'index.html'))) {
    console.warn(`  skipped ${pkg} — no package at ${root}`)
    return null
  }
  const dir = join(root, 'dist-embed')
  await build({
    root,
    base: './',
    logLevel: 'warn',
    build: {
      outDir: dir,
      emptyOutDir: true,
      cssCodeSplit: false,
      // Anything left in assets/ is a second file to go and find, and there is
      // nowhere to find it from.
      assetsInlineLimit: Number.MAX_SAFE_INTEGER,
      rollupOptions: { output: { inlineDynamicImports: true } },
    },
  })

  const { js, css } = await chunksOf(dir)
  // Every replacement here goes through a function. Minified code contains `$&`
  // — one of them does, today — and a *string* replacement would read that as
  // "insert the matched tag here", quietly splicing an HTML tag into the middle
  // of the program. It parses right up until it doesn't.
  const html = (await readFile(join(dir, 'index.html'), 'utf8'))
    .replace(/<link[^>]+rel="modulepreload"[^>]*>\s*/g, '')
    .replace(/<link[^>]+rel="stylesheet"[^>]*>/, () => `<style>\n${css}\n</style>`)
    .replace(/<script[^>]*\ssrc="[^"]*"[^>]*><\/script>/, () => `<script type="module">\n${guard(js)}\n</script>`)
  await rm(dir, { recursive: true, force: true })

  console.log(`  baked ${pkg} — ${(html.length / 1024).toFixed(0)} KiB`)
  return html
}

// --- the neighbours -------------------------------------------------------

const baked = {}
console.log('Baking neighbours…')
for (const [id, embed] of Object.entries(EMBEDS)) {
  const html = await bakeNeighbour(embed.pkg)
  if (html) baked[id] = html
}

// --- the machine itself ---------------------------------------------------

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
const { js, css } = await chunksOf(outDir)

// The page title carries a tagline for the deployed site, where it sits in a
// browser tab on its own. In a gallery of artifacts it sits beside dozens of
// others and wants to be a name, so keep the half before the dash.
const title = (html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? 'Lotus OS').split(/\s+[—-]\s+/)[0].trim()
const bodyInner = html
  .replace(/[\s\S]*<body[^>]*>/, '')
  .replace(/<\/body>[\s\S]*/, '')
  .replace(/<script[^>]*src=[^>]*><\/script>\s*/g, '')
  .trim()

// A classic script runs before any module does, so the table is on the window
// by the time the OS looks for it. `<` is escaped throughout rather than just
// in `</script`: a `<!--` anywhere in a neighbour's markup would otherwise open
// an HTML comment inside the block and swallow the rest of it.
const embeds = Object.keys(baked).length
  ? `<script>window.__LOTUS_EMBEDS__=${JSON.stringify(baked).replaceAll('<', '\\u003c')}</script>\n`
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
    `(script ${(js.length / 1024).toFixed(0)}, style ${(css.length / 1024).toFixed(0)}` +
    `${embeds ? `, embeds ${(embeds.length / 1024).toFixed(0)}` : ''})`,
)
