import { readFile, readdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { discoverApps, metaProblems, outDir, THUMBNAIL } from './apps.mjs'

// Check that the committed dist/ still matches the packages, without building
// anything. This is what CI runs: the apps are built by hand and the result is
// committed with the PR, so the only thing left to police is whether somebody
// added or changed an app and forgot to rebuild before committing.
//
// Deliberately dependency-free (node builtins only) so CI needs no npm install
// — its cost stays flat as the number of apps grows, which building never did.
//
//   npm run verify

async function main() {
  const apps = await discoverApps()
  const failures = []

  if (!existsSync(join(outDir, 'index.html'))) {
    failures.push('dist/index.html is missing — run "npm run build" and commit dist/.')
    report(failures)
    return
  }

  const index = await readFile(join(outDir, 'index.html'), 'utf8')
  failures.push(...metaProblems(apps))

  for (const app of apps) {
    // A package is an app once it has an entry point; anything else is scaffolding.
    if (!existsSync(join(app.pkgDir, 'index.html'))) continue

    if (!existsSync(join(outDir, app.slug, 'index.html'))) {
      failures.push(`"${app.slug}" has no built dist/${app.slug}/index.html — rebuild and commit dist/.`)
    }
    if (!app.hasThumbnail) {
      failures.push(`"${app.slug}" has no committed ${THUMBNAIL} — run "npm run thumbnails".`)
      continue
    }
    const shipped = join(outDir, app.slug, THUMBNAIL)
    if (!existsSync(shipped)) {
      failures.push(`"${app.slug}" thumbnail was never copied into dist/ — rebuild and commit dist/.`)
    } else {
      const [a, b] = await Promise.all([readFile(app.thumbnail), readFile(shipped)])
      if (!a.equals(b)) {
        failures.push(`"${app.slug}" thumbnail in dist/ is stale — rebuild and commit dist/.`)
      }
    }
    if (!index.includes(`"./${app.slug}/"`)) {
      failures.push(`"${app.slug}" has no card in the gallery — rebuild and commit dist/.`)
    }
  }

  // The other direction: a slug still shipping after its package was deleted.
  const slugs = new Set(apps.map((a) => a.slug))
  for (const entry of await readdir(outDir, { withFileTypes: true })) {
    if (entry.isDirectory() && !slugs.has(entry.name)) {
      failures.push(`dist/${entry.name}/ has no package — rebuild and commit dist/.`)
    }
  }

  report(failures, apps.length)
}

function report(failures, total) {
  if (failures.length === 0) {
    console.log(`dist/ is in step with all ${total} app(s).`)
    return
  }
  console.error(`${failures.length} problem(s):`)
  for (const f of failures) console.error(`  ! ${f}`)
  process.exitCode = 1
}

main().catch((err) => {
  console.error(err.message ?? err)
  process.exit(1)
})
