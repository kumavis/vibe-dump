import { readFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { discoverApps, metaProblems, root, THUMBNAIL } from './apps.mjs'
import { SHELL_FILES } from './build-gallery.mjs'

// Dependency-free verification of committed app assets. The shared gallery
// shell and apps.json are generated, ignored files and are not required here.
export async function verifyApps(repoRoot = root) {
  const apps = (await discoverApps(repoRoot)).filter(app => app.hasEntry)
  const output = join(repoRoot, 'dist'), failures = metaProblems(apps)
  // Ignore rules alone do not protect against an older branch reintroducing
  // these tracked files, so enforce the ownership boundary explicitly.
  let tracked = ''
  try {
    tracked = execFileSync('git', ['ls-files', '--', ...SHELL_FILES.map(name => `dist/${name}`), 'dist/apps.json'], {
      cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch { /* File-only fixture/checkouts can still verify their app assets. */ }
  if (tracked) failures.push(`Generated gallery output must not be tracked: ${tracked.split('\n').join(', ')}. Remove it from Git and edit gallery/ instead.`)
  if (!existsSync(output)) return { failures: [...failures, 'dist/ is missing; build and assemble apps locally.'], total: apps.length }
  for (const app of apps) {
    if (!existsSync(join(output, app.slug, 'index.html'))) failures.push(`"${app.slug}" has no committed dist/${app.slug}/index.html; build locally and run npm run assemble:apps -- ${app.slug}.`)
    if (!app.hasThumbnail) {
      failures.push(`"${app.slug}" has no committed ${THUMBNAIL}; run npm run thumbnails -- ${app.slug} locally.`)
      continue
    }
    const shipped = join(output, app.slug, THUMBNAIL)
    if (!existsSync(shipped)) failures.push(`"${app.slug}" thumbnail was not copied into dist/; run npm run assemble:apps -- ${app.slug}.`)
    else {
      const [source, dest] = await Promise.all([readFile(app.thumbnail), readFile(shipped)])
      if (!source.equals(dest)) failures.push(`"${app.slug}" thumbnail in dist/ is stale; run npm run assemble:apps -- ${app.slug}.`)
    }
  }
  const slugs = new Set(apps.map(app => app.slug))
  for (const entry of await readdir(output, { withFileTypes: true })) {
    if (entry.isDirectory() && !slugs.has(entry.name)) failures.push(`dist/${entry.name}/ has no app package; remove that obsolete built directory.`)
  }
  return { failures, total: apps.length }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  verifyApps().then(({ failures, total }) => {
    if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1 }
    else console.log(`Committed assets and metadata are valid for all ${total} apps.`)
  }).catch(error => { console.error(error.message); process.exitCode = 1 })
}
