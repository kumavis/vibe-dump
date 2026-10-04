#!/usr/bin/env node
// Build a self-contained single-file version of the app, for hosts whose CSP
// won't serve the side-car assets (the claude.ai artifact viewer among them).
// Run after `vite build`, or as `npm run standalone`:
//
//   node tools/standalone.mjs            → dist/artifact.html
//
// The emitted file is a page *fragment* — title, style, markup, script, with no
// <html>/<body> wrapper — as the artifact pipeline expects. The three woff2
// subsets go in as data: URIs: the whole piece is drawn with them, and a host
// that refuses the font files would fall back silently to a system face.
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const pkgDir = dirname(dirname(fileURLToPath(import.meta.url)))
const distDir = join(pkgDir, 'dist')
const assetsDir = join(distDir, 'assets')

const html = await readFile(join(distDir, 'index.html'), 'utf8')
const assets = await readdir(assetsDir)
const js = await readFile(join(assetsDir, assets.find((f) => f.endsWith('.js'))), 'utf8')
let css = await readFile(join(assetsDir, assets.find((f) => f.endsWith('.css'))), 'utf8')

let fontBytes = 0
for (const file of assets.filter((f) => f.endsWith('.woff2'))) {
  const data = await readFile(join(assetsDir, file))
  fontBytes += data.length
  const uri = `data:font/woff2;base64,${data.toString('base64')}`
  css = css.replace(new RegExp(`url\\(["']?(\\./)?${file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']?\\)`, 'g'), `url(${uri})`)
}
if (/url\([^)]*\.woff2/.test(css)) throw new Error('A font reference was left pointing at a file.')

const bodyInner = html
  .replace(/[\s\S]*<body[^>]*>/, '')
  .replace(/<\/body>[\s\S]*/, '')
  .replace(/<script[^>]*src=[^>]*><\/script>\s*/g, '')

// `</script` inside inlined code would close the tag early; the escaped form is
// byte-identical once the parser hands the string to JS.
const guard = (s) => s.replaceAll('</script', '<\\/script')

// An artifact is named by its <title>.
const out = `<title>Pōhaku Tumble</title>
<style>
${css}
</style>
${bodyInner.trim()}
<script type="module">
${guard(js)}
</script>
`
await writeFile(join(distDir, 'artifact.html'), out)
console.log(
  `Wrote dist/artifact.html — ${(out.length / 1024).toFixed(0)} KiB ` +
    `(fonts ${(fontBytes / 1024).toFixed(0)}, script ${(js.length / 1024).toFixed(0)}, style ${(css.length / 1024).toFixed(0)})`,
)
