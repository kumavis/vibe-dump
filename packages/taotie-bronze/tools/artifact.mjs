#!/usr/bin/env node
// Package a built dist/ as a claude.ai Artifact: the host wraps the page in its
// own <html><head><body>, strips query strings and serves sibling files by
// relative URL. So: emit the body content as one page file (title, stylesheet
// links and scripts inline in it) and list every other dist file to publish
// beside it.
//
//   node tools/artifact.mjs [--dist dir] [--out dir]
//   → <out>/taotie-bronze.html, <out>/files.json ({ "published/path": "absolute source" })
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { args, DIST, PKG } from './lib.mjs'

const opt = args()
const dist = opt.dist ? resolve(opt.dist) : DIST
const out = resolve(opt.out || join(PKG, '.work', 'artifact'))
const html = readFileSync(join(dist, 'index.html'), 'utf8')

const head = html.match(/<head>([\s\S]*?)<\/head>/)[1]
const bodyTag = html.match(/<body([^>]*)>/)[1]
const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1]
const rel = (u) => u.replace(/^\.\//, '')
const styles = [...head.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/g)].map((m) => rel(m[0].match(/href="([^"]+)"/)[1]))
const scripts = [...head.matchAll(/<script[^>]+src="([^"]+)"[^>]*><\/script>/g)].map((m) => rel(m[1]))
const preloads = [...head.matchAll(/<link[^>]+rel="modulepreload"[^>]*>/g)].map((m) => rel(m[0].match(/href="([^"]+)"/)[1]))
const bodyAttrs = [...bodyTag.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]])

const page = `<title>Taotie Bronze</title>
<style>
  /* the host pins a light colour scheme and pads :root for phone system bars; this vitrine is dark-only */
  :root { color-scheme: dark; }
  html, body { height: 100%; }
  body { background: #0f0e0c; color: #e9e2d4; }
</style>
${styles.map((s) => `<link rel="stylesheet" href="${s}">`).join('\n')}
${preloads.map((s) => `<link rel="modulepreload" href="${s}">`).join('\n')}
<script>${bodyAttrs.map(([k, v]) => `document.body.setAttribute(${JSON.stringify(k)}, ${JSON.stringify(v)})`).join(';')}</script>
${body.trim()}
${scripts.map((s) => `<script type="module" src="${s}"></script>`).join('\n')}
`
mkdirSync(out, { recursive: true })
writeFileSync(join(out, 'taotie-bronze.html'), page)

const files = {}
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else if (relative(dist, p) !== 'index.html') files[relative(dist, p)] = p
  }
}
walk(dist)
writeFileSync(join(out, 'files.json'), JSON.stringify(files, null, 1))
const bytes = Object.values(files).reduce((n, p) => n + statSync(p).size, 0)
console.log(`page ${join(out, 'taotie-bronze.html')} (${page.length} B) + ${Object.keys(files).length} files, ${(bytes / 1e6).toFixed(2)} MB`)
