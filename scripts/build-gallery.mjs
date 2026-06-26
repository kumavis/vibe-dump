import { readFile, readdir, mkdir, rm, cp, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { startStaticServer } from './static-server.mjs'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const packagesDir = join(root, 'packages')
const outDir = join(root, 'dist')

const SHOT = { width: 1280, height: 800 }

// 1. Discover every built package (a package with a dist/ directory).
async function discoverApps() {
  const entries = await readdir(packagesDir, { withFileTypes: true })
  const apps = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const pkgDir = join(packagesDir, entry.name)
    const distDir = join(pkgDir, 'dist')
    if (!existsSync(join(distDir, 'index.html'))) {
      console.warn(`! Skipping "${entry.name}" — no dist/index.html (did it build?)`)
      continue
    }
    const pkg = JSON.parse(await readFile(join(pkgDir, 'package.json'), 'utf8'))
    const meta = pkg.gallery ?? {}
    apps.push({
      slug: entry.name,
      distDir,
      title: meta.title ?? entry.name,
      description: meta.description ?? '',
    })
  }
  apps.sort((a, b) => a.title.localeCompare(b.title))
  return apps
}

// 2. Assemble the combined site: dist/<slug>/ for each app.
async function assemble(apps) {
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })
  for (const app of apps) {
    await cp(app.distDir, join(outDir, app.slug), { recursive: true })
  }
}

// 3. Screenshot each app. Returns the set of slugs that got a real screenshot.
async function screenshot(apps) {
  let chromium
  try {
    ;({ chromium } = await import('playwright'))
  } catch {
    console.warn('! Playwright not installed — generating gallery without screenshots.')
    return new Set()
  }

  const { url, close } = await startStaticServer(outDir)
  let browser
  const captured = new Set()
  // Allow pointing at a pre-installed browser (e.g. CI images that ship one)
  // instead of the version Playwright would download for itself.
  const executablePath = process.env.CHROMIUM_PATH || undefined
  try {
    try {
      browser = await chromium.launch({ executablePath })
    } catch (err) {
      console.warn(`! Could not launch Chromium — gallery will use text placeholders.\n  ${err.message}`)
      await close()
      return captured
    }
    const context = await browser.newContext({
      viewport: SHOT,
      deviceScaleFactor: 2,
    })
    for (const app of apps) {
      const page = await context.newPage()
      try {
        await page.goto(`${url}/${app.slug}/`, { waitUntil: 'networkidle', timeout: 15000 })
        // Give animations a moment to paint something interesting.
        await page.waitForTimeout(1200)
        await page.screenshot({ path: join(outDir, app.slug, 'screenshot.png') })
        captured.add(app.slug)
        console.log(`  ✓ shot ${app.slug}`)
      } catch (err) {
        console.warn(`  ! failed to shoot ${app.slug}: ${err.message}`)
      } finally {
        await page.close()
      }
    }
  } finally {
    if (browser) await browser.close()
    await close()
  }
  return captured
}

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

// 4. Render the gallery index.html.
function renderGallery(apps, captured) {
  const cards = apps
    .map((app) => {
      const thumb = captured.has(app.slug)
        ? `<img class="thumb" src="./${app.slug}/screenshot.png" alt="Screenshot of ${escapeHtml(app.title)}" loading="lazy" />`
        : `<div class="thumb thumb--empty">${escapeHtml(app.title)}</div>`
      return `      <a class="card" href="./${app.slug}/">
        ${thumb}
        <div class="card__body">
          <h2 class="card__title">${escapeHtml(app.title)}</h2>
          <p class="card__desc">${escapeHtml(app.description)}</p>
        </div>
      </a>`
    })
    .join('\n')

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>vibe-dump · gallery</title>
    <meta name="description" content="A dump of tiny static web experiments." />
    <link rel="stylesheet" href="./gallery.css" />
  </head>
  <body>
    <header class="masthead">
      <h1 class="masthead__title">vibe&#8209;dump</h1>
      <p class="masthead__tagline">A dump of tiny static web experiments.</p>
    </header>
    <main class="grid">
${cards}
    </main>
    <footer class="colophon">
      Built with Vite · screenshots by Playwright · deployed to GitHub Pages
    </footer>
  </body>
</html>
`
}

const GALLERY_CSS = `:root {
  color-scheme: dark;
  --bg: #0a0b16;
  --card: #14162a;
  --border: #232744;
  --text: #e2e8f0;
  --muted: #8b93b0;
}

* { box-sizing: border-box; }

body {
  margin: 0;
  font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
  background: radial-gradient(120% 80% at 50% -10%, #1a1d3a 0%, var(--bg) 60%);
  color: var(--text);
  min-height: 100vh;
}

.masthead {
  max-width: 1100px;
  margin: 0 auto;
  padding: 4rem 1.5rem 2rem;
  text-align: center;
}

.masthead__title {
  margin: 0;
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  background: linear-gradient(120deg, #f0abfc, #818cf8, #22d3ee);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.masthead__tagline {
  margin: 0.75rem 0 0;
  color: var(--muted);
  font-size: 1.05rem;
}

.grid {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem 1.5rem 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
}

.card {
  display: flex;
  flex-direction: column;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.card:hover {
  transform: translateY(-4px);
  border-color: #3b4070;
  box-shadow: 0 18px 40px -20px rgba(129, 140, 248, 0.6);
}

.thumb {
  display: block;
  width: 100%;
  aspect-ratio: 1280 / 800;
  object-fit: cover;
  background: #0b0c1e;
  border-bottom: 1px solid var(--border);
}

.thumb--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--muted);
}

.card__body { padding: 1rem 1.1rem 1.25rem; }

.card__title {
  margin: 0 0 0.35rem;
  font-size: 1.15rem;
  font-weight: 700;
}

.card__desc {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--muted);
}

.colophon {
  text-align: center;
  padding: 2rem 1.5rem 3rem;
  color: var(--muted);
  font-size: 0.85rem;
}
`

async function main() {
  console.log('Building gallery...')
  const apps = await discoverApps()
  if (apps.length === 0) {
    throw new Error('No built apps found. Run "npm run build:apps" first.')
  }
  console.log(`Found ${apps.length} app(s): ${apps.map((a) => a.slug).join(', ')}`)

  await assemble(apps)
  const captured = await screenshot(apps)

  await writeFile(join(outDir, 'index.html'), renderGallery(apps, captured))
  await writeFile(join(outDir, 'gallery.css'), GALLERY_CSS)
  // Disable Jekyll so GitHub Pages serves files/dirs starting with "_" verbatim.
  await writeFile(join(outDir, '.nojekyll'), '')

  console.log(`\nDone → ${outDir}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
