# CLAUDE.md — working in this repo

`vibe-dump` is an **npm-workspaces monorepo** of tiny static web apps. Each app
is one package under `packages/`. A build step screenshots every app and emits a
gallery (`dist/index.html`) that's deployed to GitHub Pages.

This file is the playbook for adding a new app. Follow it top to bottom.

## How the build fits together

```
npm run build
├─ build:apps      → vite build in every package  → packages/<name>/dist/
└─ build:gallery   → scripts/build-gallery.mjs
                     • copies each packages/<name>/dist into dist/<name>/
                     • screenshots each app with Playwright → dist/<name>/screenshot.png
                     • renders the grid dist/index.html from each package's
                       `gallery` field (title + description)
```

The gallery is **auto-discovered**: any package with a built `dist/index.html`
shows up. There is **no central registry to edit** — wiring up a new app means
creating the package correctly, nothing more.

## Add a new package — checklist

Pick a `slug` (kebab-case, e.g. `particle-pond`). It becomes the directory name
*and* the URL path (`/vibe-dump/<slug>/`).

1. **Create `packages/<slug>/package.json`** — the `gallery` field is what the
   grid renders, so write a real title and a one-line description:

   ```json
   {
     "name": "@vibe-dump/<slug>",
     "version": "0.0.0",
     "private": true,
     "type": "module",
     "scripts": { "dev": "vite", "build": "vite build" },
     "gallery": {
       "title": "Particle Pond",
       "description": "One-line pitch shown on the gallery card."
     }
   }
   ```

2. **Create `packages/<slug>/vite.config.js`** — always re-export the shared
   config (it sets `base: './'` so the app works under the Pages sub-path):

   ```js
   export { default } from '../../vite.config.shared.js'
   ```

3. **Add the app's entry `packages/<slug>/index.html`** plus whatever
   `main.js` / `style.css` it needs. Reference assets with **relative** paths
   (`./main.js`, `./style.css`) — never absolute (`/main.js`).

4. **Register the workspace**: run `npm install` once so npm links the new
   package. (Needed any time you add a package.)

5. **Build + verify**:

   ```bash
   npm run build            # builds all apps + regenerates the gallery
   npm run preview          # serve dist/ at http://127.0.0.1:4173
   ```

   Confirm the new card appears in the gallery and its app loads.

That's the whole wiring. The "N and counting" tagline updates itself.

## Two kinds of app

- **Vite-bundled (default):** ordinary `index.html` + JS/CSS modules (and npm
  deps like `three`). Vite bundles them. This is what `origami-crane` is.
- **Self-contained single file:** an `index.html` that inlines everything (e.g.
  an exported Three.js scene). Just drop it in as `index.html`; `vite build`
  copies it through untouched. This is what `mirror-field` is. Prefer a fully
  offline file (no CDN `<script src>`/importmap) so Pages has zero external
  requests.

## Screenshots (Playwright) — important gotcha

`build:gallery` screenshots each app with Playwright's Chromium.

- **In CI** the workflow runs `npx playwright install --with-deps chromium`, so
  it just works.
- **Locally / in this container** Playwright's downloaded browser may not match
  a pre-installed one. Point it at the pre-installed Chromium via env var:

  ```bash
  CHROMIUM_PATH=/opt/pw-browsers/chromium-<build>/chrome-linux/chrome npm run build
  ```

  Find the path with `ls /opt/pw-browsers`. If no browser is available the
  build still succeeds — the gallery just falls back to text placeholders
  instead of screenshots (see `scripts/build-gallery.mjs`).

WebGL/Three.js apps screenshot fine (headless Chromium uses SwiftShader).

## Importing an app from another repo / PR

If MCP GitHub access isn't scoped to the source repo, fetch the PR patch over
the public web and reconstruct the files:

```bash
curl -sSL https://github.com/<owner>/<repo>/pull/<n>.patch -o /tmp/pr.patch
git -C "$(mktemp -d)" init -q && git am /tmp/pr.patch   # or apply by hand
```

Then drop the resulting file(s) into a new `packages/<slug>/` per the checklist
above. Keep provenance in the commit message (link the source PR).

## Conventions

- Don't commit build output — `dist/` and `packages/*/dist/` are gitignored.
- Keep each app self-contained in its own package; no cross-package imports.
- Commit `package-lock.json` (CI uses `npm ci`). Always commit lockfile
  changes in a **separate commit** from the code change — never mix a
  `package-lock.json` update into a commit that also touches app code. This
  keeps diffs readable and makes lockfile-only changes (and rebase/merge
  conflicts in the lockfile) easy to review and resolve in isolation.
- Develop on the assigned branch; deploy happens on push via
  `.github/workflows/deploy.yml`.
