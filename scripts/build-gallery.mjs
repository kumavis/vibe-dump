import { mkdir, rm, cp, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { discoverApps, outDir, THUMBNAIL, SHOT } from './apps.mjs'

// Assemble the combined site: dist/<slug>/ for each app, plus its committed
// thumbnail. No browser involved — thumbnails are captured out of band by
// `npm run thumbnails` and live in the repo.
async function assemble(apps) {
  await rm(outDir, { recursive: true, force: true })
  await mkdir(outDir, { recursive: true })
  const withThumbnail = new Set()
  for (const app of apps) {
    await cp(app.distDir, join(outDir, app.slug), { recursive: true })
    if (app.hasThumbnail) {
      await cp(app.thumbnail, join(outDir, app.slug, THUMBNAIL))
      withThumbnail.add(app.slug)
    }
  }
  return withThumbnail
}

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

// Render the gallery index.html.
function renderGallery(apps, withThumbnail) {
  const cards = apps
    .map((app) => {
      const thumb = withThumbnail.has(app.slug)
        ? `<img class="thumb" src="./${app.slug}/${THUMBNAIL}" alt="Screenshot of ${escapeHtml(app.title)}" loading="lazy" />`
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
  aspect-ratio: ${SHOT.width} / ${SHOT.height};
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
  const all = await discoverApps()
  for (const app of all.filter((a) => !a.built)) {
    console.warn(`! Skipping "${app.slug}" — no dist/index.html (did it build?)`)
  }
  const apps = all.filter((a) => a.built)
  if (apps.length === 0) {
    throw new Error('No built apps found. Run "npm run build:apps" first.')
  }
  console.log(`Found ${apps.length} app(s): ${apps.map((a) => a.slug).join(', ')}`)

  const missing = apps.filter((a) => !a.hasThumbnail)
  if (missing.length > 0) {
    console.warn(
      `! No committed ${THUMBNAIL} for: ${missing.map((a) => a.slug).join(', ')}\n` +
        '  Those cards fall back to a text placeholder. Run "npm run thumbnails" and commit the result.',
    )
  }

  const withThumbnail = await assemble(apps)

  await writeFile(join(outDir, 'index.html'), renderGallery(apps, withThumbnail))
  await writeFile(join(outDir, 'gallery.css'), GALLERY_CSS)
  // Disable Jekyll so GitHub Pages serves files/dirs starting with "_" verbatim.
  await writeFile(join(outDir, '.nojekyll'), '')

  console.log(`\nDone → ${outDir}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
