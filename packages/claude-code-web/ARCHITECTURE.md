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
- **Persistence (fix round F1):** the page saves every `fs-sync` to OPFS on
  one ordered chain (`persist.js`), boots from its in-memory snapshot, and
  `Session.stop()` flushes (`fs-flush` with an `id`, answered by an `fs-sync`
  carrying `flush: id`) and waits for the save before `stdin-end`. The fs
  shim's change debounce has a 2 s `maxWaitMs`. One tab at a time: the
  session holds the Web Lock `cc-web:home`; a second tab refuses Start.
- **Acceptance step 6 is enforced at the network level:** the e2e launches
  Chromium with a proxy on a closed loopback port (only `127.0.0.1`
  bypassed) and host-resolver rules that resolve nothing else, records
  foreign hosts from `request`/`requestfailed`, and probes that the block
  holds. It no longer uses `context.route`, which made Playwright answer the
  CORS preflights itself; step 3 now checks the mock's strict-CORS preflight.
  Step 5 reloads without `stop()`, after the session reports the OPFS save.
- **Credentials (fix round F2):** the origin is shared with the other gallery
  apps (kumavis.github.io), so the API key / token is kept in
  `sessionStorage` (`cc-web:secrets`, this tab only) unless the user ticks
  "Remember on this device", which writes it to `localStorage`. This narrows
  the "Tokens stay in localStorage/OPFS" line of the policy posture.
  `window.__cc` exists only under `?test` (the e2e opens `index.html?test`).
  The base URL must be https, or http on loopback only.
- **Tool allowlist (F2):** `--tools` with `ALLOWED_TOOLS` (`src/host/constants.js`)
  replaces `--disallowedTools`; the harness also denies `can_use_tool` for
  anything outside that list and the page's `mcp__<server>__` tools. With
  2.1.311 the init message lists Task, AskUserQuestion, Edit, ExitPlanMode,
  Glob, Grep, NotebookEdit, Read, Skill, Write and the page's MCP tools.
- **Worker defence in depth (F2):** boot.js merges `POLICY_ENV` in last
  (`src/runtime/boot/policy.js`, which `src/host/constants.js` re-exports) and
  wraps `fetch`/`WebSocket` with an egress guard (`src/runtime/boot/egress.js`,
  worker-protocol.md rule 5).
- **The API stream does not use the http shim (F2):** in 2.1.311 the CLI's
  fetch wrapper calls `globalThis.fetch` with the SDK's `AbortSignal`
  (`Bun.FetchSession` is used only when `Bun.isStandaloneExecutable` is true).
  An interrupt aborts that signal and the browser cancels the body.
  `?trace` logs each fetch's path (`direct` or `http-shim`) and its abort.
- **Tests:** Chromium is at `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.
  Research inputs come from `$CC_RESEARCH_DIR` (`test/research.mjs`).
  The e2e adds checks beyond the acceptance test (file tools, a denied
  permission, an interrupt). It also takes `--base`, `--binary`, `--modules`
  and `--log`.

## Appendix A — ChatGPT subscription option (added 2026-10-28)

Research: `docs/research/claude-code-in-browser/J-codex-protocol.md` (the
Codex CLI's protocol and the Anthropic⇄Responses translation design, §7 is
the spec) and `K-codex-cors-terms.md` (CORS and terms). Decision: build on
OpenAI's documented **"Sign in with ChatGPT"** (SIWC) route for open-source
apps: dynamic client registration, scope `chatgpt.tokens.use.direct`,
inference on `https://api.openai.com/v1/responses` with the user's bearer
token. The Codex CLI's private backend (`chatgpt.com/backend-api/codex/*`)
is origin-allowlisted and must not be used; nothing may present as the Codex
CLI (no `originator`, `chatgpt-account-id` or Codex User-Agent).

### Settings (page)

- `authMode`: `'api-key' | 'oauth' | 'chatgpt'`.
- Public: `chatgpt: { clientId, extAgentHostId, model, effort, baseUrl, issuer }`.
  `clientId` is the `oaiapp_…` id the first login issues (empty before);
  `extAgentHostId` is a per-device `urn:uuid:…` minted once; `baseUrl`
  defaults to `https://api.openai.com/v1`, `issuer` to `https://auth.openai.com`
  (both overridable for tests; `checkBaseUrl` rules apply: https or loopback).
- Secret (in `SECRET_FIELDS`, same `remember` semantics as the other
  credentials): `chatgptTokens: { accessToken, refreshToken, idToken, expiresAt, earliestRefreshAt }`.

### Sign-in flow (page, `src/host/siwc.js`)

`createSiwc({ settings, fetch, now, random })` exposes:
- `beginLogin() -> { url }`: PKCE S256, `state`, `nonce`; stores verifier/state in sessionStorage; authorize URL `issuer + '/api/accounts/authorize'` with `response_type=code`, `client_id` = saved `oaiapp_…` or `dynamic_agent_client`, `agent_name_hint=claude-code-web` (first registration only), `ext_agent_host_id`, `redirect_uri=http://127.0.0.1:1455/auth/callback`, `scope=openid profile email offline_access resource.invoke chatgpt.tokens.use.direct`, `resource=https://api.openai.com/v1`, `code_challenge`, `code_challenge_method=S256`, `state`, `nonce`. The page opens it in a new tab; the browser then fails to load the loopback redirect and the user pastes that final URL back.
- `completeLogin(pastedUrl)`: parses `code`, `state` (must match), `client_id` (saved), exchanges at `issuer + '/api/accounts/oauth/token'` (form-encoded `grant_type=authorization_code&client_id&code&code_verifier&redirect_uri&resource`), saves tokens.
- `getAccessToken({ force })`: single-flight; refreshes (form `grant_type=refresh_token&client_id&refresh_token&resource`) when within 5 minutes of `expiresAt`, respecting `earliestRefreshAt`; refresh tokens rotate, so persist the new one before resolving.
- `listModels()`: `GET baseUrl + '/models'` with the bearer; `{models:[…]}` filtered to `visibility === 'list'`; returns `[{ slug, displayName, contextWindow }]`.
- `logout()`.
Pure helpers (`buildAuthorizeUrl`, `parseCallbackUrl`, `pkce`) are exported and unit-tested with a fake fetch; nothing in this module touches the network except through the injected `fetch`.

### Worker side

- Boot config gains `provider`: `{ kind: 'anthropic' }` (default) or
  `{ kind: 'openai-responses', baseUrl, model, effort, contextWindow }`.
- In chatgpt mode the harness env is `ANTHROPIC_BASE_URL=https://openai-adapter.invalid`
  (synthetic origin) and `ANTHROPIC_API_KEY=openai-adapter` (placeholder so
  Claude Code starts); argv keeps `--model claude-sonnet-5-5` so the harness
  behaviour stays the tested one, and the adapter substitutes the OpenAI model.
  Set `CLAUDE_CODE_MAX_CONTEXT_TOKENS` / `CLAUDE_CODE_AUTO_COMPACT_WINDOW` from
  `contextWindow` if report J's reading of those variables holds (verify in the bundle).
- **Token handoff** (page owns the tokens; the Worker never sees the refresh token):
  Worker → page `{ type: 'provider-token-request', id, reason: 'start'|'expired'|'unauthorized' }`;
  page → Worker `{ type: 'provider-token', id, accessToken, expiresAt }` or
  `{ type: 'provider-token', id, error }`. The Worker caches the token until
  `expiresAt - 60 s`; on an upstream 401 it asks once with `reason: 'unauthorized'`,
  retries once, then fails the request. Document in `worker-protocol.md`.
- `src/runtime/boot/openai-adapter.js`: `installOpenAIAdapter(scope, { provider, nativeFetch, getToken, syntheticOrigin, log, warn })`
  wraps `scope.fetch` *inside* the egress guard and answers every request to
  the synthetic origin locally: `POST /v1/messages` with `stream: true` →
  translated upstream stream (Anthropic SSE out); without `stream` → run the
  upstream stream, aggregate, return one Anthropic `Message`; `max_tokens <= 1`
  probes → canned reply, no upstream call; `POST /v1/messages/count_tokens` →
  `{ input_tokens: ceil(bytes/4) }`; anything else → 404. Pure, unit-tested
  exports: `toResponsesRequest(anthropicBody, { model, effort }) -> { body, idMap }`,
  `createResponsesToAnthropicStream({ model, idMap }) -> TransformStream` (Responses
  SSE text in, Anthropic SSE text out, per J §7.6), `mapUpstreamError(status, body) -> { status, body, headers }`
  (J §7.7: context overflow → `prompt is too long: N tokens > M`, terminal 429 → `x-should-retry: false`).
  Request mapping per J §7.3–7.5: system blocks and in-`messages` `role:"system"`
  items → one leading `developer` message (strip the `x-anthropic-billing-header` line);
  tool_use/tool_result → `function_call`/`function_call_output` with `call_id` maps;
  tools → function tools (schema cleanup; drop `DeferredToolPlaceholder`/`defer_loading`);
  `thinking`/`output_config.effort` → `reasoning: { effort, summary: 'auto' }` plus
  `include: ['reasoning.encrypted_content']`, encrypted reasoning carried back in a
  thinking block `signature` envelope and replayed; always `store: false`, `stream: true`;
  never `max_output_tokens`, `temperature`, `metadata`, `role: "system"` items.
- Egress policy in chatgpt mode: allowed origins `{ self, provider.baseUrl origin }`;
  credential headers allowed only to the provider origin; the synthetic origin
  never reaches the network.

### Mock and tests

- `mock/mock-api.mjs` adds, on the same server: `POST /v1/responses` (Responses
  SSE scenarios mirroring the Anthropic ones: `say hi`, `use the weather tool`
  (a `function_call` for `mcp__page__get_weather`, then on the follow-up assert
  the `function_call_output` and echo it), `write a file`, `run the file tools`,
  `stream slowly`, `overflow` (a `context_length_exceeded` error)); it asserts
  and records per request: bearer present, `store === false`, `stream === true`,
  no `role: "system"` items, no `originator`/`chatgpt-account-id`/`max_output_tokens`/`temperature`/`metadata`;
  `GET /v1/models` → `{ models: [{ slug: 'gpt-5.5', display_name: 'GPT-5.5', visibility: 'list', context_window: 272000 }, …] }`;
  a fake issuer: `GET /api/accounts/authorize` → 302 to
  `http://127.0.0.1:1455/auth/callback?code=…&state=<echoed>&client_id=oaiapp_test`,
  `POST /api/accounts/oauth/token` (form) → tokens with a rotating `refresh_token`,
  `expires_in: 3600`, rejecting a reused refresh token with `refresh_token_reused`.
- `test/e2e.mjs --provider chatgpt`: settings point `baseUrl`/`issuer` at the
  mock; the test performs the paste flow (fetch the authorize URL with
  `redirect: 'manual'`, paste the `Location` into the page's callback field),
  then runs steps 2–6 and the file-tools extra in chatgpt mode, asserting the
  mock's recorded request shapes and that the only hosts used are the static
  server and the mock. The Anthropic-mode e2e stays green.

### Policy posture additions

`agent_name_hint` is `claude-code-web`; tokens are stored exactly like the
other credentials; the README states the Plus/Pro requirement, OpenAI's
per-app weekly caps and open-source-app terms, and that the Codex CLI's own
login is not supported here and why.

### As built (ChatGPT option, integration 2026-10-28)

Where the implementation departs from or pins down the appendix above.
STATUS.md ("ChatGPT option") has the test results.

- **Token handoff.** `siwc.getAccessToken()` returns `{accessToken, expiresAt}`
  (the reply needs the expiry). The page answers `provider-token-request`
  with `serveProviderTokens(worker, {getAccessToken})` (`worker-bridge.js`),
  which `Session` attaches to the raw Worker through the Worker factory it
  hands the Harness, so the listener is on before the boot message is
  posted. `'unauthorized'` forces a refresh; the reply is built field by
  field (never the refresh or ID token). The Worker side
  (`boot/openai/token.js`) caches until `expiresAt - 60 s`, keeps one
  request in flight, and after a `TypeError` (OpenAI's edge sends a refused
  token's 401 without CORS headers) renews only if its token is older than
  30 s, so an outage cannot become a refresh storm.
- **`createSiwc`** also takes `sha256` (tests), `sessionStorage` (the pending
  PKCE login) and `locks`: refreshes run under the Web Lock
  `cc-web:siwc-refresh` and, with "Remember on this device", re-read
  storage first, so two tabs cannot burn one rotating refresh token.
  `logout()` also asks `issuer + /api/accounts/oauth/revoke`, best effort.
  The ID token's signature is not verified (the JWKS is not CORS-readable,
  report K §4.8); its `nonce` is checked, and the email/plan shown come from
  it unverified.
- **Effort.** The boot `provider.effort` is `''` for "follow Claude Code";
  `providerConfig()` in `boot/policy.js` maps that to `'auto'`, and the
  translator then uses the request's `output_config.effort`. When the model
  list gave the model's `supported_reasoning_levels`, the page passes them as
  `provider.efforts` and the translator clamps the effort to them
  (`clampEffort`: the highest supported level not above the requested one);
  otherwise the effort is passed through.
- **Context window.** Only `CLAUDE_CODE_AUTO_COMPACT_WINDOW` is set (the
  model's `context_window` when within 100k..1M; 2.1.311 clamps it to the
  Claude model's window). `CLAUDE_CODE_MAX_CONTEXT_TOKENS` is a no-op with
  `--model claude-sonnet-5-5` in 2.1.311 and is not set. The page sets the
  env; `applyProviderEnv()` re-applies the ChatGPT env in the Worker
  (synthetic base URL, placeholder key, no Anthropic credential). The
  constants (`OPENAI_ADAPTER_ORIGIN`, `OPENAI_ADAPTER_KEY`,
  `AUTO_COMPACT_WINDOW_RANGE`) live in `boot/policy.js`; the page re-exports
  them.
- **System items stay in place.** Only the top-level `system` blocks become
  the leading `developer` message (billing line stripped). In-`messages`
  `role:"system"` items become `developer` messages where they are (J §7.3),
  and one that sits between a call and its output moves to just after the
  output. Folding them into the leading message (the appendix's wording)
  would change the prefix every turn (`<total_tokens>` reminders) and defeat
  OpenAI's prefix caching; `toResponsesRequest(..., {hoistSystem: true})`
  gives the folded form.
- **Order of the wrappers.** The adapter wraps `fetch` on top of the egress
  guard, and its upstream requests go through the guard: in ChatGPT mode the
  guard allows {the page, the provider origin} and credentials only to the
  provider origin, so the policy covers the adapter's own calls as well.
- **Failures before any output** become HTTP errors, not a 200 stream with an
  error event: the adapter reads ahead to the first non-preamble event, so
  `context_length_exceeded` is a 400 "prompt is too long: N tokens > M
  maximum" (Claude Code compacts on it) and usage limits are a 429 with
  `x-should-retry: false`. Probes (`max_tokens <= 1`) get a canned reply and
  `count_tokens` a local estimate; 2.1.311 sent neither in the e2e runs.
- **Mock.** `overflow` is an HTTP 400 before the stream; `overflow
  mid-stream` sends `response.failed`. A prompt without a scenario gets a 400
  `mock_no_scenario` (not a 401, which would burn refreshes). Bearers must be
  ones the mock's issuer minted; `POST /__revoke-access` revokes them. Beyond
  the SIWC field list, the mock refuses what the real `/v1/responses` would
  (`inputStructureProblems`: call/output pairing, a reasoning item without
  its following item, content types per role, tool names, non-function
  tools). Further scenarios: "hit the usage limit" (429
  `subscription_sharing_usage_limit_exceeded`), "hit the rate limit"
  (`response.failed rate_limit_exceeded` before output, then answered),
  "fail mid-stream" (text, then `response.failed`; 2.1.311's resume request
  is answered), and compaction (a prompt asking for a "summary" gets a
  marked summary, after which "overflow" is answered).
- **e2e.** `--provider chatgpt` adds step 0 (sign-in by paste, model list),
  11 (a refused token is refreshed once and the request retried), 12
  (every `/v1/responses` request had the SIWC shape and valid input; every
  refresh grant accepted; reasoning replayed) and 13 (usage limit not
  retried, rate limit retried, mid-stream failure resumed, overflow
  compacted, all by the real 2.1.311). A new tab signs in again (tokens are
  per tab unless remembered). `--access-ttl S` shortens the mock's token
  lifetime to exercise the `expired` path; the run prints each turn's wall
  time.
- **Transcript.** `system/thinking_tokens` (2.1.311 emits one per thinking
  delta) is not shown; an empty thinking block reads "(no summary)".
