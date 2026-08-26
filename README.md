# vibe-dump

A monorepo of tiny **static web apps**. Each lives in its own package, builds to
plain HTML/CSS/JS with [Vite](https://vitejs.dev), and shows up automatically in
a screenshot **gallery** that's deployed to GitHub Pages.

🔗 **Live gallery:** https://kumavis.github.io/vibe-dump/

## Layout

```
vibe-dump/
├─ packages/
│  ├─ origami-crane/    # each package is an independent static app (Vite + three)
│  └─ mirror-field/     # self-contained Three.js scene (no build step needed)
├─ scripts/
│  ├─ build-gallery.mjs # collects the apps + emits the grid index (no browser)
│  ├─ thumbnails.mjs    # shoots packages/<name>/thumbnail.jpg (run by hand)
│  ├─ apps.mjs          # package discovery shared by the two above
│  ├─ static-server.mjs # dependency-free static server (preview + screenshots)
│  ├─ serve.mjs
│  └─ clean.mjs
├─ vite.config.shared.js
└─ .github/workflows/deploy.yml
```

## How it works

1. `npm run build:apps` builds every package (npm workspaces) into
   `packages/<name>/dist`.
2. `npm run build:gallery` copies each app into `dist/<name>/` along with its
   committed `thumbnail.jpg`, and writes a gallery `dist/index.html` — a tight
   grid of thumbnail + title + description, each card linking to the app.
3. The combined `dist/` is published to GitHub Pages by the workflow.

Card thumbnails are **captured once by hand and committed**, not generated on
every build: `npm run thumbnails` screenshots each app with Playwright into
`packages/<name>/thumbnail.jpg`. So the build — and both CI workflows — never
need a browser, and a card only changes when someone deliberately re-shoots it.

Apps use `base: './'` (see `vite.config.shared.js`) so they work under any
sub-path — locally, in a `file://` preview, or at `/vibe-dump/<app>/` on Pages.

## Commands

```bash
npm install              # install Vite + Playwright (run once)

npm run build            # build all apps + gallery into dist/ (no browser needed)
npm run preview          # serve dist/ locally at http://127.0.0.1:4173
npm run clean            # remove all dist/ output

# thumbnails — only when adding an app or deliberately re-shooting one:
npx playwright install chromium   # one-time: fetch the screenshot browser
npm run thumbnails       # shoot any app that has no thumbnail.jpg yet
npm run thumbnails -- --all       # re-shoot every app
npm run thumbnails -- --check     # fail if an app is missing one (what CI runs)

# work on a single app with hot reload:
npm run dev -w @vibe-dump/hello-world
```

## Adding a new app

1. Create `packages/<your-app>/` with an `index.html` entry and a
   `package.json`:

   ```json
   {
     "name": "@vibe-dump/your-app",
     "version": "0.0.0",
     "private": true,
     "type": "module",
     "scripts": { "dev": "vite", "build": "vite build" },
     "gallery": {
       "title": "Your App",
       "description": "One-line pitch shown on the gallery card."
     }
   }
   ```

2. Add `vite.config.js`:

   ```js
   export { default } from '../../vite.config.shared.js'
   ```

3. Run `npm install` (to link the new workspace) then `npm run build`. The
   gallery picks it up automatically from the `gallery` field — no central
   registry to update.

4. Run `npm run thumbnails` and commit `packages/<your-app>/thumbnail.jpg`.
   Look at it first — that image is the app's whole pitch on the grid.

For the full step-by-step procedure (including thumbnail gotchas and how to
import an app from another repo), see [`CLAUDE.md`](./CLAUDE.md).

## Deployment

`.github/workflows/deploy.yml` builds everything and deploys `dist/` to GitHub
Pages on every push to `main` (and `claude/**` branches), or manually via
**Actions → Deploy gallery to GitHub Pages → Run workflow**.

> First-time setup: in **Settings → Pages**, set **Source** to
> **GitHub Actions**.
