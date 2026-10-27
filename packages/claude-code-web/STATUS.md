# claude-code-web — status

_Integration round 1. Refreshed after each step; last update after the
per-platform runs._

## Summary

**The acceptance test passes.** In headless Chromium against the mock API,
the official 2.1.311 linux-x64 binary is dropped into the page, extracted,
and run unmodified (apart from the six mechanical loader rewrites) in a Web
Worker. All six acceptance steps pass, at `/` and under the GitHub Pages
sub-path, and on every non-Windows platform package. Four further checks pass
too: the built-in file tools on the virtual filesystem, a denied permission,
an interrupt mid-stream, and API-key mode. One race in the test itself (the
mock noticing the aborted stream a moment after the result) was fixed; all
ten full runs since then passed, the per-platform ones included.

| check | result | time (unloaded machine) |
|---|---|---|
| 1. extraction of the dropped 294 MB binary: 2,848 modules (2,846 cached; the two `.node` addons are skipped), 6 rewrites at their pinned counts; a reload reuses the cache | PASS | 4.4–5.7 s |
| 2. Worker boot, cold, to the first `system/init` (model, 24 tools, MCP `page: connected`) | PASS | 6.5–7.5 s (limit 30 s) |
| 2b. the same, warm (after a page reload) | PASS | 5.4–6.3 s (limit 10 s) |
| 3. `say hi`: assistant, then result `success`; exactly one `POST /v1/messages`, with `oauth-2025-04-20` beta and `anthropic-dangerous-direct-browser-access: true` | PASS | < 0.5 s per turn |
| 4. `use the weather tool`: the page's `get_weather` handler called once with the model's input; the result echoes it | PASS | |
| 5. `write a file`: in the workspace listing, and still there after a reload (OPFS) | PASS | |
| 6. no request to any host but the static server and the mock | PASS | |
| 7 (extra). Glob, Grep, Read, Edit on the VFS (Glob/Grep through the `rg` command-table shim) | PASS | |
| 8 (extra). the page denies a Write over `can_use_tool`: nothing written, the denial reaches the model | PASS | |
| 9 (extra). interrupt mid-stream: `error_during_execution` at once, the SSE fetch is aborted, the next turn works | PASS | |
| API-key mode (`x-api-key`), by hand with the dev driver | works | |
| steps 1–9 with each platform package dropped as its npm `.tgz`: linux-x64, linux-arm64, linux-x64-musl, linux-arm64-musl (2,848 modules), darwin-x64, darwin-arm64 (2,866 modules, their own pinned counts) | all 10/10 | 23–34 s per run |

Whole e2e run: 22.7–25.6 s. Under CPU contention (the unit suite running in
parallel) the cold boot took 20.7 s, still inside the limit.

Unit tests: 216 across tracks A–D and integration, all passing
(`npm test`: about 26 s once the Vite-built vendor bundle is cached in the OS
temp dir, about 85 s cold; the Chromium-based tests are included).

## What was fixed or added in integration

- `src/runtime/boot.js` + `src/runtime/boot/` (Worker bootstrap):
  - Node globals.
  - Stdin buffered until `process.stdin` exists.
  - VFS mounted from the Cache API, then the OPFS snapshot restored, then
    seed files written where absent (onboarding done, folder trusted).
  - Bun installed, then `__bunRequire` over a registry. The registry is
    filled by one blob "loader" module whose static imports pre-import every
    require target in dependency-safe order, so the browser fetches the graph
    in parallel. The order is computed at extraction time and stored in
    `manifest.boot`.
  - Then `cli` is imported.
- `public/sw.js`:
  - Serves `BASE/vfs/app/*` from the Cache API, rewriting built-in
    specifiers (`src/runtime/boot/specifiers.js`).
  - Keeps the rewritten JS in a companion cache, so warm boots skip the
    rewrite.
  - Takes control on first visit (`skipWaiting` + `clients.claim`).
- **fs shim:** every "save config with lock" failed
  (`ft(...).lock is not a function`; the first attempt said
  `Cannot read properties of undefined (reading '0')`).
  - Cause: graceful-fs (inside proper-lockfile) clones `fs` by copying
    property descriptors. memfs's `ReadStream`/`WriteStream` getters read a
    private symbol off `this`, so on the clone they throw. That left
    proper-lockfile's CommonJS wrapper with empty exports.
  - Fix: the four stream classes are now plain data properties.
- **`boot/require.js`:** forwarding proxies for cyclic requires could not be
  constructed (an arrow-function Proxy target has no `[[Construct]]`). This
  is not reached in 2.1.311, whose one cyclic site only calls functions.
  Fixed anyway with a bound-function target.
- **Page:**
  - `?trace` (boot.js logs every spawn, fetch and Worker the CLI starts) and
    `?debug` (the CLI's `--debug-to-stderr`), both shown in the page log.
  - `__cc.workspaceText(rel)` for tests.
- **Mock:**
  - `run the file tools` (Glob, Grep, Read, Edit over four round trips).
  - `stream slowly` (about 3 s of SSE, and it records an abandoned request).
  - The scenario is taken from the phrase that comes *last* in the prompt,
    because after an interrupt the CLI folds the old prompt,
    `[Request interrupted by user]` and the new prompt into one user message.
- **e2e:**
  - Extra steps 7–9.
  - `--base <path>` (serve under a sub-path).
  - `--log <file>` (the page log of every page opened).
  - Prints the Worker's boot-timing line.
- **New unit tests in `test/unit/I-runtime.test.mjs`:**
  - specifier rewriting;
  - the eager/lazy require scanner;
  - pre-import ordering, including cycles;
  - `__bunRequire` (shims, registry, text assets, cycle proxies,
    `MODULE_NOT_FOUND`);
  - the fs clone regression.
- **Also:** a mock test for the interrupt prompt shape, and a Session test
  for the diagnostics flags.

The rewrite list in `src/extract/rewrites.js` is unchanged (six rewrites,
counts pinned per flavor); integration needed no new rewrite.

## What a boot looks like (from `--log`)

```
boot: 400 modules pre-imported (0 failed, 1 require(s) answered with forwarding proxies:
chunk-dxb5hzgj.js; 1 cyclic top-level pair(s), 28 in-function cycle edge(s) dropped);
timings {"globals":321,"cacheRead":145,"mount":11,"graph":11,"preImport":5996} ms; 6549 ms total
```

- About 1,800 modules (about 35 MB of JS) are fetched through the service
  worker and evaluated. Pre-import dominates: about 6 s cold, about 4.7 s
  warm.
- The CLI's own debug log (`?debug`) shows a normal headless start. MCP
  `page` connects; the hooks plugins load; LSP finds 0 servers. Nonessential
  traffic, telemetry, autoupdate and Bootstrap are skipped by the policy
  flags.

Three expected `[ERROR]` lines remain in that debug log. None affects a turn:
- `/proc/version` is missing (WSL detection).
- `crypto.X509Certificate` is unavailable (the bundled CA root is not parsed;
  `fetch` uses the browser's TLS anyway).
- `/tmp` is world-writable without the sticky bit, so cross-session UDS
  messaging stays off, which is what we want.

## What does not work / not verified

- **The real API was not exercised.** Network to Anthropic and a credential
  are not available here.
  - The mock imitates the documented CORS behaviour (a preflight is refused
    unless it asks for the browser-access header), and the CLI sends that
    header. Whether `api.anthropic.com` accepts subscription (OAuth) tokens
    from a browser origin is unverified.
  - The README's gray-area section applies.
- **The in-page npm download** cannot run inside the e2e: npm is a foreign
  host, and Playwright cannot fulfil a 132 MB body. Track D verified it with
  a scratch probe against a same-origin copy.
- **Windows binaries are refused.** Their JS uses a `B:/~BUN/root/` prefix
  that no rewrite handles. The darwin builds run fine on the linux/x64 shims:
  OS checks happen at runtime, not at build time.
- By design (v1): no Bash, WebFetch or WebSearch; no TUI; no hooks worker; no
  session persistence across reloads (only the workspace persists).
- **Shim limits** that the paths exercised here do not hit (details in the
  track reports):
  - no asymmetric crypto or X.509;
  - `AsyncLocalStorage` is synchronous only;
  - `dns` resolves only IP literals and localhost;
  - the `rg` subset ignores `.gitignore`.
- 142 `import.meta.dirname` sites stay undefined in the browser. 141 are
  harmless `assetLoader` calls. One `path.resolve(import.meta.dirname, ...)`
  is in the built-in hooks-plugin builder and was not reached in any run.
- `npm run dev` (Vite dev server) runs the page and `?fake` only. The real
  Worker needs `dist/runtime/`, so use the build (below).

## How to run

```bash
cd packages/claude-code-web
npm test                                   # unit tests
npm run build                              # vite build + scripts/build-runtime.mjs -> dist/
npm run test:e2e                           # acceptance test + extras, headless Chromium + mock
node test/e2e.mjs --base /vibe-dump/claude-code-web/ --log /tmp/e2e-page.log   # under the Pages sub-path
node test/e2e.mjs --fake                   # page/host/UI wiring against the fake worker

# the page by hand, against the mock:
PORT=4173 node ../../scripts/serve.mjs dist      # http://127.0.0.1:4173/  (add ?trace or ?debug)
node mock/mock-api.mjs 18080                     # base URL http://127.0.0.1:18080, any placeholder credential
```

The e2e takes the binary from `$CC_BINARY`, by default the research
scratchpad copy of `@anthropic-ai/claude-code-linux-x64@2.1.311`'s
`package/claude`. Chromium: `$CHROMIUM_PATH`, else Playwright's default,
else `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.

## Next steps

1. Try the real API with an API key, then with a `claude setup-token` token,
   from a deployed page. Record what `api.anthropic.com` does with each.
2. Gallery integration: build the root gallery, shoot the thumbnail (it needs
   a `waitFor` that does not depend on a dropped binary), commit `dist/`.
3. Boot time (warm about 5.5 s, of which pre-import is about 4.1 s).
   Measured in a warm boot:
   - 1,728 modules (35.8 MB) come through the service worker.
   - Requests are in flight for only about 2.0 s of the 4.3 s fetch window.
   - Service-worker time to first byte: p50 22–42 ms, p90 140–230 ms.

   The modules come from the CLI's own dynamic `import()`s: `cli` statically
   imports 7 modules and dynamically imports 151, and the static-plus-dynamic
   closure is 2,159. The browser therefore finds them level by level.

   Tried and reverted, because neither helped:
   - pre-importing the entry's static closure (it is only 8 modules);
   - reusing an opened `Cache` in the service worker (no change, and stale
     after a re-extraction).

   Next levers:
   - Find out whether the gaps are evaluation or the import waterfall (a
     Chromium trace).
   - Prefetch-without-evaluate (fetch the startup set into service-worker
     memory as soon as the Worker starts).
   - Check whether Chromium code-caches modules a service worker serves to a
     dedicated Worker.
4. Conversation persistence across reloads (drop
   `--no-session-persistence`, keep `~/.claude/projects` in the snapshot,
   pass `--resume`).
5. Watch for drift on the next Claude Code release. The pinned rewrite
   counts, `C-bundle-surface` and `B-load` export checks are the alarms.
