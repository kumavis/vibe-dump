# CLAUDE.md — working in this repo

`vibe-dump` is an **npm-workspaces monorepo** of tiny static web apps. Each app
is one package under `packages/`. A build step collects every app and emits a
gallery (`dist/index.html`) that's deployed to GitHub Pages.

This file is the playbook for adding a new app. Follow it top to bottom.

## How the build fits together

- App source and metadata live in `packages/<slug>/`; finished app assets in
  `dist/<slug>/` and app thumbnails are committed.
- `gallery/` owns the stable HTML shell, JS renderer/model, and CSS.
- `npm run build:gallery` reads package metadata and committed app assets,
  writes ignored `dist/apps.json`, and copies the stable gallery shell. It
  never builds apps, assembles app directories, or takes screenshots.
- `npm run assemble:apps -- <slug>` is LOCAL ONLY. It copies a completed
  `packages/<slug>/dist/` and thumbnail into `dist/<slug>/`.
- `npm run build` is the LOCAL full-build shortcut: compile apps, assemble,
  generate the gallery. `npm run preview` generates the gallery before serving.
- Deployment runs asset verification and lightweight gallery generation with
  Node builtins. No dependency install, app build, browser, or screenshot step.

Generated shared files (`dist/index.html`, `gallery.css`, `gallery.js`,
`gallery-model.js`, `apps.json`) are ignored. **Never commit or hand-edit them.**
New apps must not add entries to a central JS list: discovery reads each
package's metadata. Counts are computed by the browser from the generated list.
Source recency still comes from Git; deployment fetches commit/tree history
with `filter: blob:none`, and name/date queries use `--no-renames` so they do
not fetch historical asset contents.

## Add a new package — checklist

1. Create `packages/<slug>/package.json` with the established workspace name,
   Vite dev/build scripts, and `gallery` metadata. See README for the example.
2. Re-export `../../vite.config.shared.js` from `vite.config.js`; add the entry
   `index.html` and self-contained app source with relative asset paths.
3. Run `npm install` locally to register the workspace. Keep lockfile updates
   in a separate commit from app source.
4. Build locally: `npm run build -w @vibe-dump/<slug>`.
5. For a new app, deliberately capture and inspect its local thumbnail with
   `npm run thumbnails -- <slug>`. Existing thumbnails change only on request.
6. Run `npm run assemble:apps -- <slug>`, `npm run verify`, and
   `npm run preview`. Confirm the gallery and app load.
7. Commit only `packages/<slug>/` and `dist/<slug>/` for the app. No shared
   gallery regeneration needs to appear in the diff.

For gallery changes, edit `gallery/` and the relevant scripts, run
`npm run test:gallery`, generate the local gallery, and run the LOCAL browser
checks with `npm run test:gallery:browser`. Preserve the requirement that
CI/deployment never installs app dependencies, builds apps, or captures images.

## Gallery metadata

Beyond `title` and `description`, each package's `gallery` field carries four
things the grid uses. The vocabularies live in `gallery/gallery-model.js`. The gallery
build and `npm run verify` reject values outside them, because
a tag with no chip quietly drops the app out of every filtered view.

| field      | values                                              |
| ---------- | --------------------------------------------------- |
| `tags`     | any of `game`, `simulation`, `tool`, `art`, `kids`, `tutorial` — one or more |
| `status`   | `done` or `wip` (a `wip` card gets a badge)          |
| `models`   | the model(s) that built it, e.g. `["Opus 4.8", "Opus 5"]`; `[]` if unrecorded |
| `thinking` | `low` / `medium` / `high` / `extra` / `max` / `ultracode`, or `unknown` |

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
because it shoots the real `packages/<slug>/dist/` output, not the dev server.

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

- **`dist/<slug>/` app assets are committed.** Shared gallery output is ignored.
  Build and assemble the changed app locally, then run `npm run verify`.
  `packages/*/dist/` remains an ignored local build intermediate.
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
