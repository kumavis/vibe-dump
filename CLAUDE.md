# CLAUDE.md — working in this repo

`vibe-dump` is an **npm-workspaces monorepo** of tiny static web apps. Each app
is one package under `packages/`. A build step collects every app and emits a
gallery (`dist/index.html`) that's deployed to GitHub Pages.

This file is the playbook for adding a new app. Follow it top to bottom.

## How the build fits together

```
npm run build                                    (by hand — output is committed)
├─ build:apps      → vite build in every package  → packages/<name>/dist/
└─ build:gallery   → scripts/build-gallery.mjs
                     • copies each packages/<name>/dist into dist/<name>/
                     • copies the committed packages/<name>/thumbnail.jpg beside it
                     • renders the grid dist/index.html from each package's
                       `gallery` field, newest vibe first

npm run thumbnails                               (needs a browser — run by hand)
└─ scripts/thumbnails.mjs
   • screenshots each app with Playwright → packages/<name>/thumbnail.jpg
   • you commit the result

npm run verify                                   (what CI runs — builds nothing)
└─ scripts/verify.mjs
   • checks the committed dist/ still matches packages/
```

**Nothing is built in CI.** Two generated things are produced by hand and
committed, because both got more expensive with every vibe added:

- **`dist/`** — the assembled gallery. `deploy.yml` publishes the committed copy
  with no Node, no npm and no build; `ci.yml` runs `npm run verify` and nothing
  else. So the last step before pushing is always `npm run build` + commit
  `dist/`. Vite output is deterministic, so an app you didn't touch rebuilds
  byte-identical and doesn't show up in the diff.
- **`packages/<name>/thumbnail.jpg`** — captured once after developing an app.
  A card can't silently change because a screenshot landed on a different frame.

The gallery is **auto-discovered**: any package with a built `dist/index.html`
shows up. There is **no central registry to edit** — wiring up a new app means
creating the package correctly, nothing more.

The full contributor workflow — create, iterate, shoot, prepare the PR — is in
[README.md](./README.md#working-on-a-vibe). What follows is the checklist form
plus the gotchas that only bite when you're deep in it.

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
       "description": "One-line pitch shown on the gallery card.",
       "tags": ["art"],
       "status": "wip",
       "models": ["Opus 5"],
       "thinking": "high"
     }
   }
   ```

   See **Gallery metadata** below for what goes in the four new fields.

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

6. **Shoot the thumbnail** — a new app has no card image until you do, and
   `npm run verify` fails on the missing one:

   ```bash
   npm run thumbnails                 # shoots only apps with no thumbnail yet
   ```

   **Look at the result** (`packages/<slug>/thumbnail.jpg`) before moving on —
   see the section below for the ones that come out blank, and for the
   `waitFor` / `click` / `settle` knobs that fix them.

7. **Rebuild and commit the built gallery** — `dist/` is committed, so a PR that
   adds an app but not its built output fails CI:

   ```bash
   npm run build                      # apps + gallery, with the new card in it
   npm run verify                     # the exact check CI runs
   git add packages/<slug> dist
   ```

That's the whole wiring. The "N and counting" tagline updates itself.

## Gallery metadata

Beyond `title` and `description`, each package's `gallery` field carries four
things the grid uses. The vocabularies live in `scripts/apps.mjs`. The gallery
build warns about a value outside them and `npm run verify` fails on it, because
a tag with no chip quietly drops the app out of every filtered view.

| field      | values                                              |
| ---------- | --------------------------------------------------- |
| `tags`     | any of `game`, `simulation`, `tool`, `art`, `kids`, `tutorial` — one or more |
| `status`   | `done` or `wip` (a `wip` card gets a badge)          |
| `models`   | the model(s) that built it, e.g. `["Opus 4.8", "Opus 5"]`; `[]` if unrecorded |
| `thinking` | `low` / `medium` / `high` / `max` / `ultracode`, or `unknown` |

The filter chips are OR **within** a group and AND **across** them, so `art` +
`wip` means unfinished art things. The selection lives in the URL fragment —
`/vibe-dump/#art,wip` opens straight into that view.

`models` was backfilled from the `Co-Authored-By` trailers in each package's
own commits:

```bash
git log --format="%b" -- packages/<slug> | grep -oE "Claude (Opus|Sonnet|Haiku|Fable) [0-9.]+" | sort -u
```

Five apps predate that convention and have no trailer at all (`brick-crew`,
`eclipse-iceland-clear-skies`, `flute-machine`, `ideographic-ink`,
`sloshing-os`), so their `models` is `[]`. **Nothing in the history records
thinking level**, so every app starts at `"unknown"` — it has to be filled in by
hand by whoever remembers. A card renders neither line when it doesn't know, so
an unrecorded app reads as silent rather than as the word "unknown".

## Two kinds of app

- **Vite-bundled (default):** ordinary `index.html` + JS/CSS modules (and npm
  deps like `three`). Vite bundles them. This is what `origami-crane` is.
- **Self-contained single file:** an `index.html` that inlines everything (e.g.
  an exported Three.js scene). Just drop it in as `index.html`; `vite build`
  copies it through untouched. This is what `mirror-field` is. Prefer a fully
  offline file (no CDN `<script src>`/importmap) so Pages has zero external
  requests.

## Thumbnails (Playwright) — important gotchas

`npm run thumbnails` shoots `packages/<slug>/thumbnail.jpg` with Playwright's
Chromium. It's a **local, by-hand step** — never CI. Apps must be built first,
because it shoots the real `dist/` output, not the dev server.

```bash
npm run thumbnails                  # only the apps that have no thumbnail yet
npm run thumbnails -- <slug>...     # re-shoot specific apps
npm run thumbnails -- --all         # re-shoot everything
npm run thumbnails -- --check       # list apps missing one (exit 1)
```

- **Point it at the pre-installed Chromium.** Playwright's downloaded browser
  may not match the one this container has:

  ```bash
  CHROMIUM_PATH=/opt/pw-browsers/chromium-<build>/chrome-linux/chrome npm run thumbnails
  ```

  Find the path with `ls /opt/pw-browsers`. Unlike the old in-build screenshot
  pass, a missing browser is a hard error here — you asked for thumbnails, so
  silently producing none would be worse than failing.

- **The shot is taken 1200 ms after the page settles, at DPR 2**, written out
  at CSS size (1280×800) via Playwright's `scale: 'css'`. Several apps time
  their opening move against that exact 1200 ms (grep `1200 ms` under
  `packages/`) and at least one picks its render resolution off DPR 2 — so
  don't change either without re-shooting everything and looking at it.

- **Slow-booting apps need a hint.** `space-goblin` spends ~20 s sculpting its
  rig under SwiftShader, so a plain delay caught its loading bar. Declare what
  "ready" means instead — `waitFor` takes a selector, prefixed with `!` to wait
  for it to *leave*:

  ```json
  "gallery": {
    "title": "Space Goblin",
    "description": "...",
    "thumbnail": { "waitFor": "!#boot", "settle": 3000 }
  }
  ```

- **An app whose chrome hides its own subject can press it away.** `click`
  takes a selector, pressed once the app is ready and before the settle.
  `rule-explorer` opens with a detail rail over two thirds of the frame, so
  its card was mostly UI and a smear of graph; closing the rail refits the
  camera and the basins become the picture:

  ```json
  "thumbnail": { "waitFor": "!#loading.show", "click": "#panelclose", "settle": 1500 }
  ```

  Wait for *built*, not just loaded, before clicking — a refit that lands
  mid-build frames a graph that isn't there yet.

- **Apps that fetch live data** (`eclipse-iceland-clear-skies` pulls forecasts)
  shoot fine but with empty data panels when the sandbox has no outbound
  network. That's cosmetic at card size; re-shoot on a networked machine if it
  matters.

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

- **`dist/` is committed** — it's what Pages deploys, and CI builds nothing.
  Always finish with `npm run build && npm run verify` before pushing.
  `packages/*/dist/` stays gitignored: it's the intermediate `dist/` is
  assembled from, not the deployable.
- `packages/*/thumbnail.jpg` is committed too — an input to the build rather
  than output of it.
- Keep each app self-contained in its own package; no cross-package imports.
- Commit `package-lock.json`. Always commit lockfile
  changes in a **separate commit** from the code change — never mix a
  `package-lock.json` update into a commit that also touches app code. This
  keeps diffs readable and makes lockfile-only changes (and rebase/merge
  conflicts in the lockfile) easy to review and resolve in isolation.
- Develop on the assigned branch; deploy happens on push via
  `.github/workflows/deploy.yml`.
