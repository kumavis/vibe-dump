import { cp, mkdir, rm } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { discoverApps, root, THUMBNAIL } from './apps.mjs'

// Local-only: sync a contributor's finished builds and thumbnails into the
// per-app directories that GitHub Pages deploys. Never run this in deployment.
export async function assembleApps({ repoRoot = root, slugs = [] } = {}) {
  const apps = (await discoverApps(repoRoot)).filter(app => app.hasEntry)
  const unknown = slugs.filter(slug => !apps.some(app => app.slug === slug))
  if (unknown.length) throw new Error(`Unknown app(s): ${unknown.join(', ')}`)
  const selected = apps.filter(app => !slugs.length || slugs.includes(app.slug))
  const missing = slugs.length ? selected.filter(app => !app.built) : []
  if (missing.length) throw new Error(`Build locally first: ${missing.map(app => app.slug).join(', ')}`)
  const built = selected.filter(app => app.built)
  if (!built.length) throw new Error('No local app builds found. Build the selected app first.')
  await mkdir(join(repoRoot, 'dist'), { recursive: true })
  for (const app of built) {
    const dest = join(repoRoot, 'dist', app.slug)
    await rm(dest, { recursive: true, force: true })
    await cp(app.distDir, dest, { recursive: true })
    if (app.hasThumbnail) await cp(app.thumbnail, join(dest, THUMBNAIL))
  }
  return built.map(app => app.slug)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  assembleApps({ slugs: process.argv.slice(2) })
    .then(slugs => console.log(`Assembled locally built apps: ${slugs.join(', ')}`))
    .catch(error => { console.error(error.message); process.exitCode = 1 })
}
