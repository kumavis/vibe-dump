import { readFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
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
export const TAGS = ['game', 'simulation', 'tool', 'art', 'kids', 'tutorial']

// Every app is either finished or still being poked at. Anything else is a typo.
export const STATUSES = ['done', 'wip']

// Which model(s) built an app, and how hard they were told to think. Recovered
// from the Co-Authored-By trailers in each package's commits where they exist;
// nothing in the history records thinking level, so those start as "unknown"
// and are filled in by hand. The list runs from least to most effort — this is
// a guard against typos silently dropping a card out of a filtered view, so a
// genuinely new setting belongs in it rather than rounded to the nearest old one.
export const THINKING = ['unknown', 'low', 'medium', 'high', 'max', 'ultracode']

// When each package was last worked on, so the gallery can lead with whatever
// is freshest. Read out of the history rather than a hand-maintained field —
// the date somebody last touched an app is a fact git already knows, and one
// nobody would remember to bump.
//
// Two files per package are excluded, and they are the whole reason this is not
// a one-liner. `package.json` and `thumbnail.jpg` are metadata, and metadata
// gets rewritten in sweeps: one commit tagged and credited every app in the
// repo, another committed thirty-eight thumbnails at once. Counting those, more
// than half the gallery shares a timestamp to the second and the order it is
// supposed to express collapses into the title tie-break. Excluded, every app
// but one pair has a date of its own, and it is the date of the last time the
// app itself changed.
//
// The max rather than the first hit, because a commit's author date is when the
// work was done and not when it landed: a branch merged a week later carries the
// older date and shows up out of order in the log.
function updatedDates() {
  const dates = new Map()
  let out
  try {
    out = execFileSync(
      'git',
      [
        'log',
        '--format=%aI',
        '--name-only',
        '--',
        'packages/',
        ':(exclude)packages/*/package.json',
        ':(exclude)packages/*/thumbnail.jpg',
      ],
      { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 32 * 1024 * 1024 },
    )
  } catch {
    return dates
  }
  let date = null
  for (const line of out.split('\n')) {
    if (line === '') continue
    if (line.startsWith('packages/')) {
      const slug = line.split('/')[1]
      if (!slug) continue
      const seen = dates.get(slug)
      if (!seen || Date.parse(date) > Date.parse(seen)) dates.set(slug, date)
    } else {
      date = line
    }
  }
  return dates
}

// Problems with an app's declared metadata, as a flat list of sentences. The
// gallery build prints these as warnings for fast local feedback; `npm run
// verify` treats them as failures, because that's the gate a PR has to pass.
export function metaProblems(apps) {
  const problems = []
  for (const app of apps) {
    const stray = app.tags.filter((t) => !TAGS.includes(t))
    if (stray.length > 0) problems.push(`"${app.slug}" has unknown tag(s): ${stray.join(', ')}`)
    if (app.tags.length === 0) problems.push(`"${app.slug}" has no tags`)
    if (!STATUSES.includes(app.status)) problems.push(`"${app.slug}" has unknown status "${app.status}"`)
    if (!THINKING.includes(app.thinking)) problems.push(`"${app.slug}" has unknown thinking "${app.thinking}"`)
  }
  return problems
}

// Discover every package under packages/. `built` says whether `vite build` has
// run for it; `hasThumbnail` whether a committed thumbnail sits alongside it.
export async function discoverApps() {
  const updated = updatedDates()
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
      updated: updated.get(entry.name) ?? null,
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
      // `click` also takes an array, pressed in order, for an app that opens
      // behind a dialog it has to dismiss before the frame is worth shooting.
      // `waitFor` is a selector to wait for, prefixed with "!" to wait for it to
      // *leave* instead; `click` is a control to press once it's there; `settle`
      // is the pause before the shot.
      settle: meta.thumbnail?.settle,
      waitFor: meta.thumbnail?.waitFor,
      click: meta.thumbnail?.click == null ? [] : [meta.thumbnail.click].flat(),
    })
  }
  // Most recently touched first. Two apps last changed in the same commit, so
  // title breaks the tie and the order stays stable between builds instead of
  // drifting with readdir.
  //
  // An app whose date could not be read sorts to the end — which is most of
  // them in a shallow clone, where `git log` cannot see far enough back. The
  // gallery build refuses to ship that; see the check it makes.
  apps.sort((a, b) => (b.updated ?? '').localeCompare(a.updated ?? '') || a.title.localeCompare(b.title))
  return apps
}
