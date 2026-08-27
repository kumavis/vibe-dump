import { startStaticServer } from './static-server.mjs'
import { discoverApps, packagesDir, THUMBNAIL, SHOT } from './apps.mjs'

// Capture the gallery thumbnails. This runs *once, by hand, after developing an
// app* — the resulting packages/<slug>/thumbnail.jpg is committed, so the CI
// deploy never needs Playwright or a browser download.
//
//   npm run thumbnails                 # shoot the apps that don't have one yet
//   npm run thumbnails -- <slug>...    # re-shoot specific apps
//   npm run thumbnails -- --all        # re-shoot everything
//   npm run thumbnails -- --check      # list apps missing a thumbnail (exit 1)
//
// Apps must be built first (`npm run build:apps`) — thumbnails are shot against
// the same dist/ output that gets published, not the dev server.

// Several apps time their opening move against this exact settle (grep for
// "1200 ms" under packages/) — don't change it without re-shooting everything.
const SETTLE_MS = 1200
const QUALITY = 82 // JPEG: visually identical to PNG at card size, ~5x smaller
// Pages render at DPR 2 — some apps pick their internal resolution off it — but
// `scale: 'css'` writes the file at CSS size, so the 2x buffer is downsampled
// into a crisp 1280x800 instead of shipping a 2560x1600 binary in the repo.
const DEVICE_SCALE_FACTOR = 2
const WAIT_FOR_TIMEOUT_MS = 90000 // a heavy procedural boot under SwiftShader is slow

function parseArgs(argv) {
  // `settle` stays undefined unless asked for, so a per-app value can tell the
  // default apart from someone deliberately passing --settle to experiment.
  const opts = { all: false, check: false, settle: undefined, slugs: [] }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--all') opts.all = true
    else if (arg === '--check') opts.check = true
    else if (arg === '--settle') {
      const ms = Number(argv[++i])
      if (!Number.isFinite(ms) || ms < 0) throw new Error('--settle needs a number of milliseconds')
      opts.settle = ms
    } else if (arg.startsWith('-')) throw new Error(`Unknown option "${arg}"`)
    else opts.slugs.push(arg)
  }
  return opts
}

// Which apps this invocation should shoot: named slugs, everything, or just the
// ones with no committed thumbnail (the default — keeps re-runs from churning
// binaries for apps that didn't change).
function select(apps, opts) {
  if (opts.slugs.length > 0) {
    const known = new Set(apps.map((a) => a.slug))
    const unknown = opts.slugs.filter((s) => !known.has(s))
    if (unknown.length > 0) throw new Error(`No such package(s): ${unknown.join(', ')}`)
    return apps.filter((a) => opts.slugs.includes(a.slug))
  }
  if (opts.all) return apps
  return apps.filter((a) => !a.hasThumbnail)
}

// `settleOverride` is an explicit --settle; without one each app gets its own
// configured settle, falling back to the default.
async function shoot(apps, settleOverride) {
  const { chromium } = await import('playwright')
  // Serve packages/ so each app is reachable at /<slug>/dist/ — the exact files
  // the gallery will publish.
  const { url, close } = await startStaticServer(packagesDir)
  let browser
  const failed = []
  try {
    try {
      // CHROMIUM_PATH points at a pre-installed browser (see CLAUDE.md); without
      // it Playwright uses the one `npx playwright install chromium` downloaded.
      browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined })
    } catch (err) {
      throw new Error(
        `Could not launch Chromium. Run "npx playwright install chromium", or set ` +
          `CHROMIUM_PATH to a pre-installed browser.\n  ${err.message}`,
      )
    }
    const context = await browser.newContext({ viewport: SHOT, deviceScaleFactor: DEVICE_SCALE_FACTOR })
    for (const app of apps) {
      const page = await context.newPage()
      try {
        await page.goto(`${url}/${app.slug}/dist/`, { timeout: 30000 })
        // "Quiet network" is a good proxy for "done booting", but an app that
        // polls, streams, or reaches for a tile server that isn't there never
        // gets there — so it's best-effort, not a precondition for the shot.
        await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})
        // An app with a slow boot overlay can declare what "ready" looks like;
        // how long sculpting/compiling takes is a property of the machine, not
        // something a fixed delay can pin down.
        if (app.waitFor) {
          const leaves = app.waitFor.startsWith('!')
          const selector = leaves ? app.waitFor.slice(1) : app.waitFor
          await page.waitForSelector(selector, {
            state: leaves ? 'detached' : 'visible',
            timeout: WAIT_FOR_TIMEOUT_MS,
          })
        }
        // Some apps open with chrome in front of the thing worth showing — a
        // detail rail, an intro card. Press it out of the way first.
        if (app.click) await page.click(app.click, { timeout: 15000 })
        await page.waitForTimeout(settleOverride ?? app.settle ?? SETTLE_MS)
        await page.screenshot({ path: app.thumbnail, type: 'jpeg', quality: QUALITY, scale: 'css' })
        console.log(`  ✓ ${app.slug}`)
      } catch (err) {
        failed.push(app.slug)
        console.warn(`  ! ${app.slug} — ${err.message.split('\n')[0]}`)
      } finally {
        await page.close()
      }
    }
  } finally {
    if (browser) await browser.close()
    await close()
  }
  return failed
}

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  const apps = await discoverApps()

  if (opts.check) {
    const missing = apps.filter((a) => !a.hasThumbnail)
    if (missing.length === 0) {
      console.log(`All ${apps.length} app(s) have a committed ${THUMBNAIL}.`)
      return
    }
    console.error(`Missing ${THUMBNAIL} for: ${missing.map((a) => a.slug).join(', ')}`)
    console.error('Run "npm run build:apps && npm run thumbnails" and commit the result.')
    process.exitCode = 1
    return
  }

  const selected = select(apps, opts)
  if (selected.length === 0) {
    console.log('Nothing to shoot — every app already has a thumbnail. Use --all to re-shoot.')
    return
  }

  const unbuilt = selected.filter((a) => !a.built)
  if (unbuilt.length > 0) {
    throw new Error(
      `Not built (no dist/index.html): ${unbuilt.map((a) => a.slug).join(', ')}\n` +
        'Run "npm run build:apps" first.',
    )
  }

  console.log(`Shooting ${selected.length} thumbnail(s)...`)
  const failed = await shoot(selected, opts.settle)

  console.log(`\nDone → packages/<slug>/${THUMBNAIL} (commit these)`)
  if (failed.length > 0) {
    console.error(`Failed: ${failed.join(', ')}`)
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(err.message ?? err)
  process.exit(1)
})
