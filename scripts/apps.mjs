import { readFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

export const root = dirname(dirname(fileURLToPath(import.meta.url)))
export const packagesDir = join(root, 'packages')
export const outDir = join(root, 'dist')

// Thumbnails are captured once (see scripts/thumbnails.mjs) and committed next
// to the app, so neither the gallery build nor CI needs a browser.
export const THUMBNAIL = 'thumbnail.jpg'

// The viewport every thumbnail is shot at. The gallery card reserves this exact
// aspect ratio, so changing it means changing `.thumb` in the gallery CSS too.
export const SHOT = { width: 1280, height: 800 }

// Discover every package under packages/. `built` says whether `vite build` has
// run for it; `hasThumbnail` whether a committed thumbnail sits alongside it.
export async function discoverApps() {
  const entries = await readdir(packagesDir, { withFileTypes: true })
  const apps = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const pkgDir = join(packagesDir, entry.name)
    if (!existsSync(join(pkgDir, 'package.json'))) continue
    const pkg = JSON.parse(await readFile(join(pkgDir, 'package.json'), 'utf8'))
    const meta = pkg.gallery ?? {}
    const distDir = join(pkgDir, 'dist')
    const thumbnail = join(pkgDir, THUMBNAIL)
    apps.push({
      slug: entry.name,
      pkgDir,
      distDir,
      thumbnail,
      built: existsSync(join(distDir, 'index.html')),
      hasThumbnail: existsSync(thumbnail),
      title: meta.title ?? entry.name,
      description: meta.description ?? '',
      // Optional per-app thumbnail tuning, for scenes that need longer than the
      // default before they look like anything:
      //   "gallery": { "thumbnail": { "waitFor": "!#boot", "settle": 2000 } }
      // `settle` is the pause before the shot; `waitFor` is a selector to wait
      // for first, prefixed with "!" to wait for it to *leave* instead.
      settle: meta.thumbnail?.settle,
      waitFor: meta.thumbnail?.waitFor,
    })
  }
  apps.sort((a, b) => a.title.localeCompare(b.title))
  return apps
}
