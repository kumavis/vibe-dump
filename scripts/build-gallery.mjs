import { mkdir, rm, cp, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { discoverApps, metaProblems, outDir, THUMBNAIL, SHOT, TAGS } from './apps.mjs'

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

// The line under each description: what built it, and how hard it thought.
// Both are frequently unknown — the git trailers only go back so far — and an
// unknown reads better as nothing than as the word "unknown" on every card.
function renderCredits(app) {
  const bits = []
  if (app.models.length > 0) bits.push(app.models.map(escapeHtml).join(' + '))
  if (app.thinking && app.thinking !== 'unknown') bits.push(`${escapeHtml(app.thinking)} effort`)
  if (bits.length === 0) return ''
  return `\n          <p class="card__credits">${bits.join(' · ')}</p>`
}

// Render the gallery index.html.
function renderGallery(apps, withThumbnail) {
  const cards = apps
    .map((app) => {
      const thumb = withThumbnail.has(app.slug)
        ? `<img class="thumb" src="./${app.slug}/${THUMBNAIL}" alt="Screenshot of ${escapeHtml(app.title)}" loading="lazy" />`
        : `<div class="thumb thumb--empty">${escapeHtml(app.title)}</div>`
      const wip = app.status === 'wip' ? '\n        <span class="wip">WIP</span>' : ''
      const tags = app.tags
        .map((t) => `<span class="tag">${escapeHtml(t)}</span>`)
        .join('')
      // The filter reads these attributes, so it needs no copy of the app list.
      const attrs = `data-tags="${escapeHtml(app.tags.join(' '))}" data-status="${escapeHtml(app.status)}"`
      return `      <a class="card" href="./${app.slug}/" ${attrs}>
        ${thumb}${wip}
        <div class="card__body">
          <h2 class="card__title">${escapeHtml(app.title)}</h2>
          <p class="card__desc">${escapeHtml(app.description)}</p>${renderCredits(app)}
          <div class="card__tags">${tags}</div>
        </div>
      </a>`
    })
    .join('\n')

  const counts = Object.fromEntries(TAGS.map((t) => [t, apps.filter((a) => a.tags.includes(t)).length]))
  const chips = TAGS.map(
    (t) => `        <button class="chip" data-tag="${t}" aria-pressed="false">${t}<span class="chip__n">${counts[t]}</span></button>`,
  ).join('\n')
  const wipCount = apps.filter((a) => a.status === 'wip').length

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
    <nav class="filters" id="filters" aria-label="Filter apps">
${chips}
      <span class="filters__sep" role="separator"></span>
      <button class="chip chip--status" data-status="wip" aria-pressed="false">wip<span class="chip__n">${wipCount}</span></button>
      <button class="chip chip--status" data-status="done" aria-pressed="false">done<span class="chip__n">${apps.length - wipCount}</span></button>
      <button class="chip chip--clear" id="clear" hidden>clear</button>
      <output class="filters__count" id="count"></output>
    </nav>
    <main class="grid" id="grid">
${cards}
    </main>
    <p class="empty" id="empty" hidden>Nothing matches those filters.</p>
    <footer class="colophon">
      Built with Vite · thumbnails by Playwright · deployed to GitHub Pages
    </footer>
    <script>
      // Filtering is pure DOM: every card carries its own tags and status, so
      // there is no second copy of the app list to keep in step with the grid.
      const cards = [...document.querySelectorAll('.card')]
      const chips = [...document.querySelectorAll('.chip[data-tag], .chip[data-status]')]
      const count = document.getElementById('count')
      const empty = document.getElementById('empty')
      const clear = document.getElementById('clear')
      const on = { tag: new Set(), status: new Set() }

      function apply() {
        let shown = 0
        for (const card of cards) {
          const tags = card.dataset.tags.split(' ')
          // Within a group any selected value matches; the two groups AND
          // together, so "art" + "wip" means art things that are unfinished.
          const okTag = on.tag.size === 0 || tags.some((t) => on.tag.has(t))
          const okStatus = on.status.size === 0 || on.status.has(card.dataset.status)
          const show = okTag && okStatus
          card.hidden = !show
          if (show) shown++
        }
        const filtered = on.tag.size > 0 || on.status.size > 0
        count.textContent = filtered ? shown + ' of ' + cards.length : ''
        empty.hidden = shown > 0
        clear.hidden = !filtered
        const parts = [...on.tag].concat([...on.status])
        history.replaceState(null, '', parts.length ? '#' + parts.join(',') : location.pathname)
      }

      for (const chip of chips) {
        chip.addEventListener('click', () => {
          const group = chip.dataset.tag ? 'tag' : 'status'
          const value = chip.dataset.tag ?? chip.dataset.status
          const next = !on[group].has(value)
          on[group][next ? 'add' : 'delete'](value)
          chip.setAttribute('aria-pressed', String(next))
          apply()
        })
      }
      clear.addEventListener('click', () => {
        on.tag.clear()
        on.status.clear()
        for (const chip of chips) chip.setAttribute('aria-pressed', 'false')
        apply()
      })

      // #art,wip in the URL opens straight into that view, so a filtered
      // gallery is a link you can send someone.
      for (const value of decodeURIComponent(location.hash.slice(1)).split(',').filter(Boolean)) {
        const chip = chips.find((c) => (c.dataset.tag ?? c.dataset.status) === value)
        if (chip) chip.click()
      }
      apply()
    </script>
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

.filters {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.chip {
  display: inline-flex;
  align-items: baseline;
  gap: 0.4rem;
  padding: 0.35rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--card);
  color: var(--muted);
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease, background 0.15s ease;
}

.chip:hover { color: var(--text); border-color: #3b4070; }

.chip[aria-pressed="true"] {
  color: #0a0b16;
  background: #a5b4fc;
  border-color: #a5b4fc;
  font-weight: 600;
}

.chip__n { font-size: 0.75rem; opacity: 0.65; font-variant-numeric: tabular-nums; }

.chip--status[aria-pressed="true"] { background: #fcd34d; border-color: #fcd34d; }

.chip--clear { border-style: dashed; }

/* An author \`display\` beats the UA rule for [hidden], so say it again here. */
.chip[hidden] { display: none; }

.filters__sep {
  width: 1px;
  align-self: stretch;
  margin: 0.15rem 0.35rem;
  background: var(--border);
}

.filters__count {
  color: var(--muted);
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
}

.empty {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem 3rem;
  color: var(--muted);
  text-align: center;
}

.grid {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem 1.5rem 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
}

/* Hiding a card has to beat the grid item's own display. */
.card[hidden] { display: none; }

.card {
  position: relative;
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

.card__body {
  padding: 1rem 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Tags sit on the card's floor whatever the description's length. */
.card__tags { margin-top: auto; padding-top: 0.75rem; display: flex; flex-wrap: wrap; gap: 0.3rem; }

.tag {
  padding: 0.15rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 0.7rem;
  letter-spacing: 0.02em;
  color: var(--muted);
}

.card__credits {
  margin: 0.6rem 0 0;
  font-size: 0.75rem;
  color: #6b7396;
}

.wip {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: #fcd34d;
  color: #0a0b16;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
}

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

  // A tag with no chip, or a status the filter doesn't know, would quietly drop
  // an app out of every filtered view — so say so rather than shipping it.
  // `npm run verify` fails on the same list; here it's just a fast heads-up.
  for (const problem of metaProblems(apps)) console.warn(`! ${problem}`)

  // Cards are ordered newest first off the git history. A shallow clone has no
  // history to read, and would silently ship an alphabetical gallery.
  if (apps.every((a) => !a.added)) {
    throw new Error(
      'Could not read when any package was added, so the gallery cannot be ordered newest first.\n' +
        'This is a shallow clone or not a git checkout — run "git fetch --unshallow" and build again.',
    )
  }

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
