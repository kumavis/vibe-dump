import { mkdir, cp, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { discoverApps, metaProblems, root, THUMBNAIL } from './apps.mjs'
import { validateManifest } from '../gallery/gallery-model.js'

export const SHELL_FILES = ['index.html', 'gallery.css', 'gallery.js', 'gallery-model.js']

// Deployment runs only this lightweight step. It consumes the committed app
// assets; it never builds an app, copies app directories, or launches a browser.
export async function buildGallery({ repoRoot = root, requireHistory = false } = {}) {
  const output = join(repoRoot, 'dist')
  const apps = (await discoverApps(repoRoot)).filter(app => app.hasEntry)
  if (!apps.length) throw new Error('No apps found in packages/.')
  const problems = metaProblems(apps)
  for (const app of apps) {
    if (!existsSync(join(output, app.slug, 'index.html'))) problems.push(`"${app.slug}" has no committed dist/${app.slug}/index.html; build it locally and run npm run assemble:apps -- ${app.slug}.`)
    if (requireHistory && !app.updated) problems.push(`"${app.slug}" has no source commit date; use a checkout with fetch-depth: 0 (blob:none is supported).`)
  }
  if (problems.length) throw new Error(problems.join('\n'))
  const manifest = {
    version: 1,
    apps: apps.map(app => ({
      slug: app.slug, title: app.title, description: app.description,
      tags: app.tags, status: app.status, models: app.models, thinking: app.thinking,
      updated: app.updated, hasThumbnail: existsSync(join(output, app.slug, THUMBNAIL)),
    })),
  }
  validateManifest(manifest)
  await mkdir(output, { recursive: true })
  await Promise.all([
    ...SHELL_FILES.map(name => cp(join(root, 'gallery', name), join(output, name))),
    writeFile(join(output, 'apps.json'), JSON.stringify(manifest, null, 2) + '\n'),
    writeFile(join(output, '.nojekyll'), ''),
  ])
  return manifest
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  if (args.some(arg => arg !== '--require-history')) {
    console.error('Usage: node scripts/build-gallery.mjs [--require-history]')
    process.exitCode = 1
  } else {
    buildGallery({ requireHistory: args.includes('--require-history') })
      .then(data => console.log(`Generated the gallery and apps.json for ${data.apps.length} committed apps. No app builds or screenshots.`))
      .catch(error => { console.error(error.message); process.exitCode = 1 })
  }
}
