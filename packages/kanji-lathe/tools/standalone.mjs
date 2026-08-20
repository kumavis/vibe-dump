#!/usr/bin/env node
// Build a self-contained single-file version of the app, for hosts that will
// not serve the corpus as a side-car fetch (the claude.ai artifact viewer's CSP
// among them). Run after `vite build`:
//
//   node tools/standalone.mjs            → dist/artifact.html
//
// The emitted file is a page *fragment* — title, style, markup, script, with no
// <html>/<body> wrapper — as the artifact pipeline expects. The corpus is baked
// into a global the loader checks before it reaches for the network.
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const pkgDir = dirname(dirname(fileURLToPath(import.meta.url)))
const distDir = join(pkgDir, 'dist')

const html = await readFile(join(distDir, 'index.html'), 'utf8')
const assets = await readdir(join(distDir, 'assets'))
const js = await readFile(join(distDir, 'assets', assets.find((f) => f.endsWith('.js'))), 'utf8')
const css = await readFile(join(distDir, 'assets', assets.find((f) => f.endsWith('.css'))), 'utf8')
const corpus = await readFile(join(distDir, 'kanji-1000.json'), 'utf8')

const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/)
const bodyInner = html
  .replace(/[\s\S]*<body[^>]*>/, '')
  .replace(/<\/body>[\s\S]*/, '')
  .replace(/<script[^>]*src=[^>]*><\/script>\s*/g, '')

// `</script` inside inlined code or JSON would close the tag early; the escaped
// form is byte-identical once the parser hands the string to JS.
const guard = (s) => s.replaceAll('</script', '<\\/script')

const out = `<title>${titleMatch ? titleMatch[1] : 'Kanji Lathe'}</title>
<style>
${css}
</style>
${bodyInner}
<script>window.__KANJI_CORPUS__ = ${guard(corpus)}</script>
<script type="module">
${guard(js)}
</script>
`
await writeFile(join(distDir, 'artifact.html'), out)
console.log(
  `Wrote dist/artifact.html — ${(out.length / 1024).toFixed(0)} KiB ` +
    `(corpus ${(corpus.length / 1024).toFixed(0)}, script ${(js.length / 1024).toFixed(0)}, style ${(css.length / 1024).toFixed(0)})`,
)
