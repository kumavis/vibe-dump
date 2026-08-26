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

// The tag vocabulary the gallery filter offers, in the order the chips appear.
// An app declares any subset in its `gallery.tags`; the gallery build warns
// about anything outside this list, since a stray tag has no chip to match it
// and would quietly drop the app out of every filtered view.
export const TAGS = ['game', 'simulation', 'art', 'kids', 'tutorial']

// Every app is either finished or still being poked at. Anything else is a typo.
export const STATUSES = ['done', 'wip']

// Which model(s) built an app, and how hard they were told to think. Recovered
// from the Co-Authored-By trailers in each package's commits where they exist;
// nothing in the history records thinking level, so those start as "unknown"
// and are filled in by hand.
export const THINKING = ['unknown', 'low', 'medium', 'high', 'max']

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
      tags: meta.tags ?? [],
      status: meta.status ?? 'done',
      models: meta.models ?? [],
      thinking: meta.thinking ?? 'unknown',
      // Optional per-app thumbnail tuning, for apps that don't put their best
      // face forward on their own:
      //   "gallery": { "thumbnail": { "waitFor": "!#boot", "click": "#x", "settle": 2000 } }
      // `waitFor` is a selector to wait for, prefixed with "!" to wait for it to
      // *leave* instead; `click` is a control to press once it's there; `settle`
      // is the pause before the shot.
      settle: meta.thumbnail?.settle,
      waitFor: meta.thumbnail?.waitFor,
      click: meta.thumbnail?.click,
    })
  }
  apps.sort((a, b) => a.title.localeCompare(b.title))
  return apps
}
