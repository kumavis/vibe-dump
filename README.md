# vibe-dump

A monorepo of tiny **static web apps**. Each lives in its own package, builds to
plain HTML/CSS/JS with [Vite](https://vitejs.dev), and shows up automatically in
a **gallery** that's deployed to GitHub Pages.

🔗 **Live gallery:** https://kumavis.github.io/vibe-dump/

## Layout

```
vibe-dump/
├─ packages/<slug>/       # app source, package.json metadata, thumbnail.jpg
├─ dist/<slug>/           # COMMITTED app builds and copied thumbnails
├─ gallery/               # stable HTML shell, JS renderer/model, CSS
├─ scripts/
│  ├─ assemble-apps.mjs   # LOCAL ONLY: copy finished app builds into dist/<slug>/
│  ├─ build-gallery.mjs   # metadata → ignored apps.json; copy stable gallery shell
│  ├─ thumbnails.mjs      # LOCAL ONLY: capture an app thumbnail
│  ├─ verify.mjs          # verify committed app assets and metadata
│  ├─ apps.mjs            # discover packages and their source commit dates
│  └─ static-server.mjs
└─ .github/workflows/     # verify assets; generate lightweight gallery; deploy
```

## How it works

Each app owns its metadata in `packages/<slug>/package.json` and its finished
build in `dist/<slug>/`. There is no shared app registry to edit.

The stable shell and JavaScript in `gallery/` render cards and filter counts
from `dist/apps.json`. `npm run build:gallery` generates that list directly from
package metadata and the committed app assets, then copies the shell into
`dist/`. Those shared generated files are **ignored by Git**, so adding apps
on separate branches no longer rewrites shared HTML or counters.

Cards remain newest-source-change first. Tags are OR within their group and
AND with status; `#art,wip` is still a shareable filtered view. Missing model
and thinking credits are omitted. Local previews allow a new uncommitted app
to sort to the end; deployment requires complete commit dates.

**App builds and thumbnails stay local.** Contributors commit each app's built
files and thumbnail. Deployment runs Node builtins to verify those assets and
write the small gallery list. It performs no dependency install, Vite build,
app build, screenshot generation, or browser launch. A blobless checkout keeps
commit/tree history for ordering without fetching historical asset contents;
the date query disables rename detection to avoid reading old binaries.

Apps still use `base: './'` for GitHub Pages subpaths. Serve the gallery over
HTTP (`npm run preview`) so its JavaScript can fetch the generated list.

## Commands

```bash
npm install                           # local Vite + Playwright dependencies
npm run dev -w @vibe-dump/<slug>       # local app development
npm run build -w @vibe-dump/<slug>     # build one app locally
npm run assemble:apps -- <slug>        # copy that build + thumbnail to dist/<slug>/
npm run build:gallery                 # lightweight shell/list generation only
npm run preview                       # generate gallery + serve at 127.0.0.1:4173
npm run verify                        # validate committed app assets + metadata
npm run test:gallery                  # dependency-free data/assembly tests
npm run test:gallery:browser          # optional LOCAL browser tests after generation
npm run build                         # LOCAL full app build + assembly + gallery
npm run clean                         # delete outputs; rebuild apps locally to restore

# Deliberate LOCAL thumbnail capture only:
npx playwright install chromium
npm run thumbnails -- <slug>
npm run thumbnails -- --check
```

## Working on a vibe

### Creating one

Pick a `slug` (kebab-case, e.g. `particle-pond`). It becomes both the directory
name and the URL path (`/vibe-dump/<slug>/`).

1. **`packages/<slug>/package.json`** — the `gallery` field is the card, so
   write a real title and a one-line pitch:

   ```json
   {
     "name": "@vibe-dump/<slug>",
     "version": "0.0.0",
     "private": true,
     "type": "module",
     "scripts": { "dev": "vite", "build": "vite build" },
     "gallery": {
       "title": "Particle Pond",
       "description": "One-line pitch shown on the gallery card.",
       "tags": ["art"],
       "status": "wip",
       "models": ["Opus 5"],
       "thinking": "high"
     }
   }
   ```

   | field      | values                                                        |
   | ---------- | ------------------------------------------------------------- |
   | `tags`     | one or more of `game`, `simulation`, `tool`, `art`, `kids`, `tutorial` |
   | `status`   | `done`, or `wip` for a badge on the card                       |
   | `models`   | which model(s) built it, e.g. `["Opus 5"]`                     |
   | `thinking` | `low` / `medium` / `high` / `extra` / `max` / `ultracode`, or `unknown` |

   The vocabularies live in `gallery/gallery-model.js`. `npm run verify` fails
   on a value outside them — a tag with no chip would drop the app out of every
   filtered view.

2. **`packages/<slug>/vite.config.js`** — always re-export the shared config
   (it sets `base: './'` so the app works under the Pages sub-path):

   ```js
   export { default } from '../../vite.config.shared.js'
   ```

3. **`packages/<slug>/index.html`** plus whatever `main.js` / `style.css` it
   needs. Reference assets with **relative** paths (`./main.js`) — never
   absolute (`/main.js`).

4. **`npm install`** once, so npm links the new workspace.

Then go round the iterate loop below until it's what you want.

### Iterating on one

```bash
npm run dev -w @vibe-dump/<slug>    # hot reload while you work
```

The dev server is the fast loop. When the app is close, check it the way the
gallery will see it — built, not hot-reloaded:

```bash
npm run build -w @vibe-dump/<slug>
npm run assemble:apps -- <slug>
npm run preview                      # open http://127.0.0.1:4173
```

### Shooting its thumbnail

The card image is the app's whole pitch on the grid, and it isn't generated for
you — a new vibe has no card until you shoot one, and `npm run verify` fails
without it.

```bash
npm run build -w @vibe-dump/<slug>   # capture uses packages/<slug>/dist/
npm run thumbnails -- <slug>         # deliberate local capture
npm run assemble:apps -- <slug>      # copy the new thumbnail beside the app
```

**Look at the result** (`packages/<slug>/thumbnail.jpg`) before moving on. If it
came out blank, mistimed, or buried under the app's own chrome, tune it from the
`gallery.thumbnail` field rather than accepting it:

```json
"thumbnail": { "waitFor": "!#loading", "click": "#close-panel", "settle": 2000 }
```

- `waitFor` — a selector to wait for before shooting; prefix `!` to wait for it
  to *leave* (how `space-goblin` waits out its 20-second boot).
- `click` — a control to press once the app is ready, for an app whose opening
  chrome hides its own subject (how `rule-explorer` collapses its detail rail
  and `abyssal-*` dismiss their intro modals).
- `settle` — milliseconds to wait before the shot. Defaults to 1200.

Re-shoot with `npm run thumbnails -- <slug>` until it looks right. See
[`CLAUDE.md`](./CLAUDE.md) for the full list of thumbnail gotchas.

### Preparing the PR

For an app change, build and assemble only that app, then verify:

```bash
npm run build -w @vibe-dump/<slug>
npm run assemble:apps -- <slug>
npm run verify
npm run preview

git add packages/<slug> dist/<slug>
```

Commit `packages/<slug>/thumbnail.jpg` when adding or deliberately refreshing
one. Keep `package-lock.json` updates in their own commit. The shared
`dist/index.html`, `gallery.css`, `gallery.js`, `gallery-model.js`, and
`apps.json` are generated and ignored; never add or hand-edit them.

For a gallery-only change, edit `gallery/`, run `npm run test:gallery`,
`npm run build:gallery`, and the local browser checks. No app rebuild or
thumbnail capture is needed. CI runs the small Node tests, asset verification,
and strict gallery generation, then checks that generation changes no tracked
files. App source and assets remain owned by their app branches.

## Deployment

On pushes to `main` (or workflow dispatch), GitHub Actions checks out current
assets plus blobless history, sets up Node, runs `npm run verify` and
`npm run build:gallery -- --require-history`, then uploads `dist/` to Pages.
These commands use Node builtins and Git metadata only. Screenshots and app
builds never run during deployment.

> First-time setup: in **Settings → Pages**, set **Source** to **GitHub Actions**.
