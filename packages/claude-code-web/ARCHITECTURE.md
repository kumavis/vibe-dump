# claude-code-web — architecture contract

This file is the contract between the parallel build tracks. Each track owns
one directory and may not change another track's files; anything it needs
from another track is requested through the interfaces below. Read
`../../docs/research/claude-code-in-browser.md` first, then the per-agent
reports under `../../docs/research/claude-code-in-browser/` (E, the Node boot
spike, is the one this design is built on).

## What we are building

The official Claude Code harness, **unmodified as far as possible**, running
client-side in a browser tab:

- The user supplies the official Claude Code binary (file drop of their own
  `claude`, or an in-page download of the pinned npm platform package). The
  page extracts the embedded JavaScript, applies the same mechanical
  rewrites the FreeBSD port applies, caches the result, and runs it.
- The JS runs in a **Web Worker** on the browser's own engine, under a
  Node-API shim layer and a Bun-API polyfill.
- The harness runs in **programmatic mode only**: `-p` with
  `--input-format stream-json --output-format stream-json`. There is no
  TUI, no PTY, no xterm.js. The page is the client, exactly as the Claude
  Agent SDK is a client of the CLI.
- **No Bash tool.** The shell is not exposed to the model. File tools work
  on an in-browser virtual filesystem. **Custom tools** are provided by the
  page as in-process MCP servers (`type: "sdk"`), routed over the control
  channel the way the Agent SDK does it.
- Auth: a pasted `claude setup-token` value in `CLAUDE_CODE_OAUTH_TOKEN`
  (or an API key in `ANTHROPIC_API_KEY`), stored only in the browser.
  Validation first runs against a local mock API; the real API is reached
  directly via CORS (`/v1/messages` allows it; the kill-switch flags keep
  the harness from calling anything else).

Pinned Claude Code version: **2.1.311**. Every rewrite carries an expected
match count; a mismatch is a hard, visible error, never a silent skip.

### Non-goals (v1)

Interactive TUI, Bash tool, background sessions, image resize, hooks worker,
clipboard/voice, plugins marketplace, remote control, OAuth `/login` in the
page, any proxy or server of ours.

### Policy posture (binding)

- Never commit, bundle or redistribute any of Anthropic's code. Only the
  user's browser ever holds it.
- Never spoof identity: do not set a fake `User-Agent`, do not touch the
  `cch=` billing line or the system prompt, do not patch entitlement or
  telemetry code. The only edits are the mechanical loader rewrites listed
  in `src/extract/rewrites.js`.
- Always set `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`,
  `DISABLE_TELEMETRY=1`, `DISABLE_ERROR_REPORTING=1`, `DISABLE_AUTOUPDATER=1`.
- Tokens stay in `localStorage`/OPFS on the user's device; nothing is sent
  anywhere except `api.anthropic.com` (or the mock base URL the user sets).

## Layout and ownership

```
packages/claude-code-web/
  ARCHITECTURE.md            this contract
  README.md                  user-facing: what it is, how to use, the gray area
  index.html, src/main.js    page entry (track D)
  src/ui/                    chat transcript, settings, tool panel (track D)
  src/host/                  stream-json driver, MCP-sdk servers, Worker bridge (track D)
  src/extract/               tgz/tar/gunzip, Bun trailer parser, rewrites, cache (track A)
  src/runtime/node/          Node built-in shims as PLAIN ESM files (track B)
  src/runtime/bun/           Bun polyfill + Bun.ant shims as PLAIN ESM (track C)
  src/runtime/vendor-entry.js  re-exports the npm libs the shims need (track B)
  src/runtime/boot.js        Worker bootstrap: globals, process, module registry (integration)
  public/sw.js               service worker serving the extracted tree (integration)
  scripts/build-runtime.mjs  copies runtime files + builds vendor.js into dist/runtime/ (track B)
  mock/mock-api.mjs          CORS-enabled mock of /v1/messages with scripted scenarios (track D)
  test/unit/*.test.mjs       node --test; extractor + shims where runnable under Node
  test/e2e.mjs               Playwright, headless Chromium, the acceptance test (track D, then integration)
```

Dependencies are pre-declared in `package.json` and installed at the repo
root. A track that needs another dependency reports it; it does not edit
`package.json` or run `npm install`.

## Runtime URL and path layout

Let `BASE` be the app's own directory URL (`new URL('.', location.href)`),
which is `/vibe-dump/claude-code-web/` on GitHub Pages and `/` under
`vite dev`. Everything below is relative to it so the same build works in
every deployment.

| thing | location |
|---|---|
| runtime shims | `BASE + 'runtime/node/<mod>.js'`, `BASE + 'runtime/bun/index.js'`, `BASE + 'runtime/jspm/<mod>.js'` (copied `@jspm/core` nodelibs), `BASE + 'runtime/vendor.js'` |
| extracted Claude Code tree (served by `sw.js` from the Cache API) | `BASE + 'vfs/app/'` → `cli`, `chunk-*.js`, assets |
| the same tree inside the virtual filesystem | mounted at `new URL(BASE + 'vfs/app/').pathname`, so a rewritten `/$bunfs/root/x` string works both as an import URL and as an `fs` path |
| HOME | `/home/user` (persisted) |
| CWD / workspace | `/home/user/workspace` (persisted, user-visible) |
| config | `/home/user/.claude/` with `.claude.json` pre-seeded (`hasCompletedOnboarding: true`, folder trust) so the onboarding preflight never runs |

### Service worker and module loading

- `public/sw.js` is registered at `BASE` scope. It answers `GET BASE/vfs/app/*`
  from the Cache API (`caches.open('cc-app-<version>')`), with
  `content-type: text/javascript` for `cli` and `*.js`, and `*` for the rest.
- Chunks import each other by absolute path (`/$bunfs/root/chunk-x.js`
  rewritten to `BASE/vfs/app/chunk-x.js`), so under the service worker the
  module graph loads with plain `import()`.
- Node built-ins: Claude Code's chunks import `node:fs`, `fs`, etc. Import
  maps are not reliably available inside Workers, so the **service worker
  rewrites those specifiers when serving a chunk** (`"node:fs"` and `"fs"`
  → `BASE/runtime/node/fs.js`, for the fixed list of built-ins in
  `src/runtime/node/BUILTINS.js`). The cached tree stays as extracted.
  `ws` → `BASE/runtime/node/ws.js`.
- `import.meta.require` sites were rewritten to `globalThis.__bunRequire(p)`.
  `boot.js` pre-imports every chunk (`import()` in dependency-safe order:
  the entry's graph first, then the rest) into a registry keyed by VFS
  path, and `__bunRequire(p)` returns the namespace from the registry
  (CJS interop: a namespace with a lone `default` returns that default).
  Unknown paths throw `MODULE_NOT_FOUND`.

### Worker boot sequence (`src/runtime/boot.js`)

1. Install globals: `process` (argv, env, cwd, stdin/stdout/stderr as
   streams bridged to the page, `getBuiltinModule` returning our shims,
   `exit` → post `{type:'exit', code}`), `Buffer`, `global`, `setImmediate`,
   `queueMicrotask`, `structuredClone`, timers with `.unref()`.
2. Mount the virtual filesystem (track B's `fs` shim) with the extracted
   tree, HOME and workspace restored from OPFS.
3. Install `Bun` (track C) and `__bunRequire`.
4. Pre-import chunks into the registry, then `import(BASE/vfs/app/cli)`.

### Harness invocation

```
argv: cli -p --input-format stream-json --output-format stream-json --verbose
      --permission-prompt-tool stdio --permission-mode default
      --disallowedTools Bash,BashOutput,KillShell,WebFetch,WebSearch
      --mcp-config '{"mcpServers":{"<name>":{"type":"sdk","name":"<name>"}}}'
      --strict-mcp-config --no-session-persistence --model <model>
env:  HOME=/home/user  CLAUDE_CONFIG_DIR=/home/user/.claude  TERM=dumb  SHELL=
      CLAUDE_CODE_OAUTH_TOKEN=<token> | ANTHROPIC_API_KEY=<key>
      ANTHROPIC_BASE_URL=<api base, default https://api.anthropic.com>
      CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1 DISABLE_TELEMETRY=1
      DISABLE_ERROR_REPORTING=1 DISABLE_AUTOUPDATER=1 USE_BUILTIN_RIPGREP=false
      CLAUDE_CODE_ENTRYPOINT=sdk-cli
```

Integration may adjust flags (for example `--tools`) after checking the
extracted CLI's `--help`; the principle is: no shell, file tools on the VFS,
custom tools via MCP.

## Interfaces

### Track A — `src/extract/`

```js
// index.js
export async function* readTarballEntries(readableStream)      // gunzip (DecompressionStream) + ustar; yields {path, bytes}
export function findBunPayload(uint8)                           // ELF/Mach-O/PE agnostic: last "\n---- Bun! ----\n" + trailer
export function parseBunfs(uint8) -> { entry, files: Map<string, {bytes, encoding}> }   // names keep the /$bunfs/ prefix
export function applyRewrites(files, { appPath }) -> { files, report }  // see rewrites.js; throws RewriteDriftError on count mismatch
export async function materialize(files, { version, appUrl }) // writes Cache API entries for BASE/vfs/app/* and returns a manifest {version, sha256, entry, paths[]}
export async function loadCachedManifest(version)              // null if absent
export async function extractFromBinary(bytesOrStream, { source: 'drop'|'npm', version, appUrl, onProgress })
```

`rewrites.js` lists each rewrite as `{ id, pattern, replacement, expect }` and
is the single place the "modification" lives. It mirrors the FreeBSD
`scripts/post-extract` on 2.1.311 (see report E §2 for the exact patterns and
counts: `/$bunfs/root/` paths, `import.meta.require`, `import.meta.dir`, the
builtin-hooks helper, the shell-search-tools gate, the path-completer
`readdir` filter, the prepended polyfill import), minus anything that only
matters under Node. `.zst` assets are stored as-is; the `zlib` shim
decompresses them (fzstd).

Unit tests run under Node against
`<scratchpad>/research/pkg-linux-x64/package/claude` and must produce a tree
byte-identical (before rewrites) to `<scratchpad>/research/spike-E/extract-unhare/`.
`npm pack @anthropic-ai/claude-code-darwin-arm64@2.1.311` into a fresh
directory to prove Mach-O file drops work.

### Track B — `src/runtime/node/` and `scripts/build-runtime.mjs`

One plain ESM file per built-in, each with the named exports Claude Code's
bundle imports plus `default`. Start from `@jspm/core` nodelibs (copied to
`runtime/jspm/` by the build script) and patch the gaps report B §6b found;
import heavier pieces from `../vendor.js` (built by the same script with
Vite lib mode from `src/runtime/vendor-entry.js`, which re-exports memfs,
noble, fflate, fzstd, yaml, semver, string-width, wrap-ansi, slice-ansi,
strip-ansi). Must be loadable with no bundler: relative imports only.

Key modules and requirements:

- `fs.js`, `fs/promises.js`: memfs volume with the full **sync** API; `mount(tree)`,
  `snapshot()`/`restore()` helpers exported from `fs.js` for OPFS persistence
  (debounced, whole-volume is fine for v1). `chmod`, `realpath`, `mkdtemp`,
  `watch` (no-op emitter) must exist.
- `child_process.js`: `spawn`/`spawnSync`/`execFile`/`execFileSync`/`exec`/`execSync`
  that consult a **command table** (`registerCommand(name, handler)`); unknown
  commands fail with `ENOENT` asynchronously (or `{status:127}` for sync).
  Default handlers: `which` (always "not found"), `git` (exit 128, "not a git
  repository"), `rg --files` (walk the VFS with glob filtering, since skills
  discovery uses it), `ps` (empty), `npm` (empty). No shell.
- `crypto.js`: sync `createHash` (sha256/sha1/md5 via noble), `randomBytes`,
  `randomUUID`, `createHmac`, `timingSafeEqual`, `webcrypto`, `createPrivateKey` stub.
- `http.js`/`https.js`/`http2.js`/`net.js`/`tls.js`/`dns.js`: `request()` implemented
  over `fetch` with streaming response bodies (SSE must stream); `createServer`
  returns a server that never listens; `Agent` classes are inert; `net.BlockList` stub.
- `zlib.js`: gzip/gunzip/deflate (fflate), `zstdDecompressSync`/`zstdDecompress`
  (fzstd), `constants`, `crc32`.
- `os.js` (fixed `linux`/`x64`, `homedir()` = HOME, `userInfo()`), `tty.js`
  (`isatty` false), `readline.js`, `events.js` (+`setMaxListeners`), `stream*`,
  `util.js` (+`isDeepStrictEqual`, `types`), `url.js` (`fileURLToPath` fixed),
  `path.js`, `buffer.js`, `string_decoder.js`, `timers/promises.js`,
  `async_hooks.js` (`AsyncLocalStorage` that at least round-trips `run`/`getStore`
  synchronously), `worker_threads.js` (stub, `isMainThread: true`), `vm.js`
  (`runInNewContext` via `new Function`), `v8.js`, `perf_hooks.js`,
  `inspector.js`, `diagnostics_channel.js`, `assert.js`, `constants.js`,
  `module.js` (`createRequire` → `__bunRequire`), `process.js`, `querystring.js`,
  `ws.js` (native `WebSocket` wrapper with the `ws` API shape).
- `BUILTINS.js`: the list of specifiers the service worker maps.

Unit tests: each shim loads under Node (ESM) and the specific gaps from
report B §6b are covered (`zlib.constants.Z_SYNC_FLUSH`, `url.fileURLToPath`,
`crypto.createHash('sha256')`, `events.setMaxListeners`, streaming `https.request`
against a local server).

### Track C — `src/runtime/bun/`

`index.js` exports `installBun(globalThis, { fs, path, crypto, zlib, process })`
and the `Bun` surface the 2.1.311 bundle touches. Source of truth: the
FreeBSD `bun-polyfill.cjs` (1,238 lines) and the clawgod `bun-ant-shim.cjs`
at `<scratchpad>/research/spike-E/{freebsd-port/files,clawgod-shim}/`.
Write our own browser implementation informed by them; check both licences
before copying any line verbatim and record the outcome in a header
comment. Required: `stringWidth`, `stripANSI`, `wrapAnsi`, `sliceAnsi`,
`sleepSync` (busy-wait; no `Atomics.wait`), `hash` (+`crc32`, `xxHash64`
approximation), `SHA256`, `CryptoHasher`, `which`, `spawn`/`spawnSync`
(delegate to the child_process shim), `file`/`write` (over the VFS),
`serve`/`connect`/`listen` (inert), `deepEquals`, `semver`, `YAML`, `TOML`
(minimal), `JSONL`, `Transpiler` stub, `Terminal` stub (throws the same
"unavailable" error the bundle expects), `zstdDecompress[Sync]`, `env`,
`version`, `isStandaloneExecutable: false`, `embeddedFiles: []`, `main`,
`peek`, `inspect`, `nanoseconds`, `gc`, `ant` (`CellSegmenter` and the
stubs the port provides). Unit-test every function under Node.

### Track D — `src/host/`, `src/ui/`, `mock/`, `test/e2e.mjs`

```js
// src/host/harness.js
export class Harness extends EventTarget {
  constructor({ workerUrl, env, argv, mcpServers })  // mcpServers: { [name]: { tools: [{name, description, inputSchema, handler}] } }
  async start()                                      // boots the Worker, waits for the stream-json `system/init` message
  send(userMessage)                                   // {type:'user', message:{role:'user', content}} as a stream-json line
  interrupt(); stop()
  // events: 'message' (every parsed stream-json object), 'tool_call' ({server, tool, input, result}), 'permission' (request + resolve()), 'exit'
}
```

- Mirror the Agent SDK's wire protocol from
  `<scratchpad>/research/pkg-sdk/package/sdk.mjs` (read it; it is the
  reference client): `control_request`/`control_response` with subtypes
  `initialize`, `can_use_tool`, `mcp_message`; the `type: "sdk"` MCP server
  declaration; how `mcp_message` carries JSON-RPC to an in-process server
  (`initialize`, `tools/list`, `tools/call`). Implement a minimal MCP server
  object in `src/host/mcp-sdk-server.js` that answers those three methods
  for page-defined tools.
- `src/host/worker-bridge.js`: the page side of the Worker protocol:
  `{type:'stdin', line}` in, `{type:'stdout'|'stderr', line}` / `{type:'exit'}` /
  `{type:'log'}` out, plus `{type:'fs-sync'}` for persistence.
- UI (`src/ui/`): settings (token or API key, base URL, model, custom tools
  as editable JSON of name/description/inputSchema with a JS handler body),
  binary acquisition panel (drop zone + "download 2.1.311 from npm" with
  progress and the cache state), transcript (user, assistant text,
  thinking summaries, tool calls with inputs and results, result/usage line),
  a "workspace" file list from the VFS. Keep it plain DOM and small.
- `mock/mock-api.mjs`: Node HTTP server, CORS for any origin, streaming SSE
  on `POST /v1/messages`, scenarios selected by the user prompt text:
  `"say hi"` → text; `"use the weather tool"` → `tool_use` of the MCP tool
  `mcp__<server>__get_weather`, then on the follow-up request assert the
  `tool_result` is present and reply with text echoing it; `"write a file"` →
  `tool_use` of `Write` then text; anything else → 401. Start from
  `<scratchpad>/research/spike-E/tools/mock-api.mjs`.
- `test/e2e.mjs`: builds nothing; serves `dist/` (reuse
  `../../scripts/serve.mjs` or a tiny static server), starts the mock, opens
  the page in headless Chromium (`executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux/chrome'`
  if the default launch fails), feeds it the linux binary from
  `<scratchpad>/research/pkg-linux-x64/package/claude` through the drop
  zone's `<input type=file>`, and asserts the acceptance test below. The
  page exposes `window.__cc` (the `Harness` instance and helpers) for the test.

## Acceptance test (the definition of done for v1)

Headless Chromium, static `dist/` served with no custom headers, mock API:

1. Extraction from the dropped binary completes; the manifest reports
   2,848 files and every rewrite at its expected count; a reload reuses the
   cache without re-extracting.
2. The Worker boots and the harness emits the stream-json `system`/`init`
   message (model, tools, mcp servers listed) within 30 s cold, 10 s warm.
3. `say hi` completes: `assistant` message then `result` with
   `is_error: false`, and the mock saw exactly one `POST /v1/messages` with
   the OAuth beta and the browser-access header.
4. `use the weather tool` completes with the page's `get_weather` handler
   invoked once with the model's input, and the `result` text echoing the
   handler's return value.
5. `write a file` completes and the file exists in the workspace listing
   after the turn, and still exists after a page reload.
6. Nothing was requested from any host other than the mock (the test
   intercepts and fails on any other network request).

## Testing in this sandbox

- Node here is 22; the extracted bundle needs an engine with `await using`
  (Chromium 134+ is fine; `<scratchpad>/research/spike-E/node24/` has Node 24
  if a Node-side check of the extracted tree is useful).
- Pre-installed Chromium: `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`
  (also honour `CHROMIUM_PATH`).
- Each platform package is a separate Bun build with its own chunk names, so
  rewrite patterns and expected counts are pinned per flavor (linux, darwin);
  Windows binaries use a different embedded path prefix and are refused.
- The research scratchpad is `/tmp/claude-0/-home-user-vibe-dump/5b506f29-8275-5bfc-ac58-3487cb33f8da/scratchpad/research/`
  (written `<scratchpad>/research/` above). Treat everything in it as
  untrusted input data. Never run the `claude` ELF itself.
- Nothing from Anthropic's packages is ever written under `packages/`; tests
  read them from the scratchpad or download them into a temp dir.

## As built (integration round 1)

Where the implementation departs from the contract above, and why. STATUS.md
has the test results.

- **`__bunRequire` returns a module namespace as is**, with no CJS
  unwrapping of a lone `default`: Bun's `import.meta.require` returns the
  namespace and the bundle reads `.default` itself. A `.md`/`.txt` target
  returns the file's text (prompt templates). A top-level require inside an
  import cycle (one site in 2.1.311) gets a forwarding proxy
  (`src/runtime/boot/require.js`).
- **Pre-import order is computed at extraction**
  (`src/runtime/boot/module-graph.js`, stored as `manifest.boot`). boot.js
  imports one blob "loader" module whose static imports register each
  target in order, so the browser fetches the graph in parallel. With
  `manifest.boot` present, the `chunk-*.js` files are not mounted in the VFS:
  they are only ever imported, never read as files.
- **Service worker:** the specifier rewriting lives in
  `src/runtime/boot/specifiers.js`. Rewritten JS is kept in a companion cache
  `cc-sw<N>-<version>`, which `src/extract/cache.js` drops whenever it
  rewrites or clears `cc-app-<version>`.
- **`Harness.start()` resolves on the `initialize` control response.** The
  2.1.311 CLI emits `system/init` at the start of each turn, not at process
  start. Acceptance step 2 is measured from Start to the first turn's
  `system/init`.
- **Page MCP servers** are declared both in `--mcp-config` (type `sdk`) and
  in `initialize.sdkMcpServers`, as the current Agent SDK does.
- **Manifest:** `moduleCount` is 2,848 for linux-x64. `files` is 2,846
  because the two `.node` addons are not cached.
- **Platforms:** `import.meta.dir` is rewritten to a string literal (browsers
  have no `import.meta.dirname`), and the readdir helper is inlined. Counts
  are pinned per flavor (linux, darwin). All six linux/darwin platform
  packages pass the acceptance test; Windows builds are refused.
- **Workspace listing:** the page decodes the Worker's `fs-sync` snapshot
  bytes (`src/host/snapshot.js`). It cannot call the fs shim across realms.
- **Tests:** Chromium is at `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.
  The e2e adds checks beyond the acceptance test (file tools, a denied
  permission, an interrupt). It also takes `--base`, `--binary`, `--modules`
  and `--log`.
