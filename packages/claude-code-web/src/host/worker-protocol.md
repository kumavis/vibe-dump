# Page ⇄ Worker protocol (version 1)

The page (`src/host/worker-bridge.js`, driven by `harness.js`) runs Claude Code
in a dedicated **module** Worker created as

```js
new Worker(BASE + 'runtime/boot.js', { type: 'module', name: 'claude-code' })
```

`runtime/boot.js` (integration, from `src/runtime/boot.js`) plays the part of
the operating system around one `claude` process: it receives the command
line and environment, turns `postMessage` into stdin/stdout/stderr, and
reports exit. Everything is plain structured-clone `postMessage`; there are
no `MessagePort`s and no `SharedArrayBuffer`.

`src/host/fake-worker.js` implements the Worker side of this document with a
scripted imitation of the CLI. When in doubt, it is the executable reference.

## Page → Worker

| message | when | meaning |
|---|---|---|
| `{type:'boot', protocol:1, argv, env, cwd, base, appUrl, version, manifest, fsSnapshot, seedFiles, persistRoots, provider, trace?}` | exactly once, first | start the process (fields below) |
| `{type:'stdin', line}` | any time after `boot` | one stream-json line for the CLI's stdin, **without** the trailing newline; the Worker appends `'\n'` |
| `{type:'stdin-end'}` | `Harness.stop()` | EOF on stdin (`process.stdin` emits `'end'`) |
| `{type:'fs-flush', id?}` | "refresh" in the workspace panel; `Session.stop()` before `stdin-end`; the page going hidden (`pagehide`, `visibilitychange`) | post an `fs-sync` now. With an `id`, that `fs-sync` carries `flush: id`, so the page can wait for exactly this snapshot (`Harness.flushFs()` resolves on it). Before the VFS is mounted there is nothing to snapshot: the answer is `{type:'fs-sync', snapshot: null, paths: [], flush: id}` |
| `{type:'signal', signal}` | optional | emit `signal` (`'SIGINT'`/`'SIGTERM'`) on `process` |
| `{type:'provider-token', id, accessToken, expiresAt}` or `{type:'provider-token', id, error}` | ChatGPT mode, answering a `provider-token-request` | an OpenAI access token and its expiry (ms since the epoch), or why there is none (a user-facing sentence). Never anything else: see "Provider tokens" below |

`terminate()` on the Worker is the page's SIGKILL; it is used after
`stdin-end` plus a grace period, and after an `exit` message.

**Stopping without losing the workspace.** `Session.stop()` sends
`fs-flush` with an id, waits for the `fs-sync` that answers it (at most 2 s)
and for its save to OPFS, and only then sends `stdin-end`. The `fs-sync`
boot.js posts before `exit` is saved as well before `stop()` resolves.

### The boot message

| field | type | notes |
|---|---|---|
| `protocol` | `1` | bump on incompatible changes |
| `argv` | `string[]` | the CLI arguments, i.e. what `process.argv.slice(2)` must return. boot.js prepends its own `[execPath, scriptPath]` (e.g. `['/usr/local/bin/node', appPath + 'cli']`). Built by `invocation.js` `buildArgv()`: `-p --input-format stream-json --output-format stream-json --verbose --permission-prompt-tool stdio --permission-mode default --tools Read,Write,Edit,Glob,Grep,NotebookEdit,Task,TodoWrite,AskUserQuestion,ExitPlanMode,Skill [--mcp-config {"mcpServers":{"page":{"type":"sdk","name":"page"}}}] --strict-mcp-config --no-session-persistence [--model M]` |
| `env` | `{[k]: string}` | the complete `process.env` (`invocation.js` `buildEnv()`): HOME, CLAUDE_CONFIG_DIR, TERM=dumb, SHELL='', exactly one of CLAUDE_CODE_OAUTH_TOKEN / ANTHROPIC_API_KEY, ANTHROPIC_BASE_URL, the four policy flags, USE_BUILTIN_RIPGREP=false, CLAUDE_CODE_ENTRYPOINT=sdk-cli. boot.js uses it as is except that it merges the four policy flags in again, last (`boot/policy.js` `workerEnv()`, the same `POLICY_ENV` the page uses); nothing else is added, and nothing that identifies differently. **ChatGPT mode** (`provider.kind` `'openai-responses'`): ANTHROPIC_BASE_URL is the synthetic origin `https://openai-adapter.invalid`, ANTHROPIC_API_KEY the placeholder `openai-adapter` (so Claude Code starts; not a credential), and CLAUDE_CODE_AUTO_COMPACT_WINDOW the OpenAI model's context window when it is known and within 100k..1M (2.1.311 clamps it to the Claude model's window). No ChatGPT token is ever in `env`; argv keeps `--model claude-sonnet-5-5` |
| `cwd` | `string` | `/home/user/workspace`; create it if missing, then `process.chdir` |
| `base` | `string` | BASE, absolute URL of the app directory (a Worker's `location` is the script URL, not BASE) |
| `appUrl` | `string` | `BASE + 'vfs/app/'`, where `sw.js` serves the extracted tree |
| `version` | `string` | `'2.1.311'` |
| `manifest` | `object \| null` | track A's manifest of the cached extraction (`cacheName`, `appUrl`, `appPath`, `entry`, `paths[]`, ...). `loadCachedFiles(manifest)` from `src/extract/cache.js` reads the tree back for mounting into the VFS. `null` only with the fake worker |
| `fsSnapshot` | `Uint8Array \| null` | the persisted VFS: `serializeSnapshot(snapshot(['/home/user']))` bytes from the last `fs-sync` (format in `src/runtime/node/fs.js`). Its buffer is **transferred**. Restore it with `restore(deserializeSnapshot(bytes))` before the CLI starts |
| `seedFiles` | `{[path]: string}` | files to write **only where absent** after restoring the snapshot: `~/.claude/.claude.json` (onboarding done, workspace trusted: without it the CLI runs a CORS-blocked preflight and exits) and `~/.claude/CLAUDE.md` (describes the sandbox) |
| `persistRoots` | `string[]` | `['/home/user']`: what `fs-sync` snapshots (never the app tree) |
| `provider` | `object` | where the model requests go (`invocation.js` `providerConfig()`): `{kind: 'anthropic'}` (the default; also when absent), or `{kind: 'openai-responses', baseUrl, model, effort, efforts?, contextWindow}` for the ChatGPT subscription option (ARCHITECTURE.md Appendix A): `baseUrl` the Responses API base (`https://api.openai.com/v1`, or the mock's `<mock>/v1`), `model` the OpenAI model slug the adapter substitutes for the Claude model, `effort` a reasoning-effort override (`'low'`…`'xhigh'`, or `''`: follow Claude Code's `output_config.effort`), `efforts` (present when the model list gave them) the model's supported levels, which the Worker clamps the effort it sends to, `contextWindow` tokens or `null` |
| `trace` | `boolean` | the page's `?trace`: boot.js logs every spawn, fetch and Worker the CLI starts |

## Worker → Page

| message | meaning |
|---|---|
| `{type:'stdout', line}` or `{type:'stdout', chunk}` | process stdout. `line` is one complete line without its newline; `chunk` is raw text (string or `Uint8Array`) that the bridge splits on `'\n'` (a partial last line is kept until the next chunk or exit). Either form, mixed freely |
| `{type:'stderr', line}` or `{type:'stderr', chunk}` | process stderr, same rules; shown in the page log and kept (last 400 lines) for error messages |
| `{type:'exit', code, signal?, error?}` | the process ended (`process.exit(code)`, or an uncaught error: code 1 plus `error`). Sent once; the page then terminates the Worker |
| `{type:'fs-sync', snapshot, paths?, flush?}` | `snapshot`: `serializeSnapshot(snapshot(persistRoots))` as a `Uint8Array` (transfer its buffer); `paths`: what changed; `flush`: the `id` of the `fs-flush` it answers. The page decodes it for the workspace listing and saves it to OPFS (`cc-web/home.ccwfs`). Send it debounced after writes under `persistRoots` (`fs.js onChange(cb, {debounceMs: 400, maxWaitMs: 2000})`: 400 ms after the last write, and at least every 2 s while writes keep coming), on `fs-flush`, and before `exit` |
| `{type:'log', level, msg, data?}` | boot diagnostics (`level`: debug/info/warn/error), shown in the page log |
| `{type:'status', phase, done?, total?}` | boot progress, shown next to the Start button, e.g. `{phase:'import', done: 1200, total: 2594}` |
| `{type:'error', message, stack?}` | an uncaught error the Worker survived (logged; not fatal by itself). boot.js calls `preventDefault()` on the error event after posting this, so the page's Worker object does not report the same error a second time |
| `{type:'provider-token-request', id, reason}` | ChatGPT mode: the Worker needs an OpenAI access token. `reason`: `'start'` (the first one, asked for at boot), `'expired'` (the cached one is within 60 s of `expiresAt`), `'unauthorized'` (the API refused the cached one). The page answers with `provider-token` carrying the same `id` |

A Worker that fails to load (404, syntax error, throwing top-level import)
fires a plain `error` event on the Worker object; the bridge turns that into
`exit {code: 1}` with a message pointing at `runtime/boot.js`.

## Rules for boot.js

1. **Buffer stdin.** The page writes the `initialize` control request right
   after `boot`, seconds before the CLI attaches its stdin reader. Queue
   `stdin` lines and deliver them, in order, once `process.stdin` is read.
2. **stdout carries only stream-json.** Every stdout line is parsed as JSON;
   anything else is shown as log text. Diagnostics go to stderr or `log`.
3. **Exit exactly once**, after flushing stdout/stderr and a final `fs-sync`.
4. **No network of its own.** The CLI's `/v1/messages` calls go to
   `env.ANTHROPIC_BASE_URL` through the http/fetch shims; boot.js itself
   fetches only same-origin URLs under `base`.
5. **Egress guard.** Before any Claude Code module loads, boot.js wraps the
   Worker's `fetch` and `WebSocket` (`boot/egress.js`): a request to a host
   outside {the `ANTHROPIC_BASE_URL` origin, `https://api.anthropic.com`, the
   page's origin}, or one carrying `authorization` / `x-api-key` to any origin
   but the base URL's, is refused (a `TypeError` with `code: 'EGRESS_REFUSED'`)
   and reported as a `log` message at level `warn` (header names, never values).
   **ChatGPT mode:** the allowed origins are {the page's origin, the origin of
   `provider.baseUrl`}; credential headers may go to the provider origin only;
   the synthetic origin is answered inside the Worker by the OpenAI adapter
   (`boot/openai-adapter.js`, installed inside the guard) and never reaches
   the network.
6. **Tokens come from the page.** In ChatGPT mode the Worker holds at most an
   access token and its expiry, obtained with `provider-token-request`
   (below). It never asks for, stores or logs anything else, and it never
   presents as the Codex CLI (no `originator`, `chatgpt-account-id` or Codex
   User-Agent on the upstream requests).

## Provider tokens (ChatGPT mode)

The ChatGPT subscription option (ARCHITECTURE.md Appendix A) signs in with
OpenAI's "Sign in with ChatGPT" in the page (`src/host/siwc.js`). The page
owns the tokens: the refresh token and the ID token never cross into the
Worker. The Worker asks for an access token when it needs one:

```
Worker -> page   {type:'provider-token-request', id, reason: 'start'|'expired'|'unauthorized'}
page -> Worker   {type:'provider-token', id, accessToken, expiresAt}     expiresAt: ms since the epoch
                 {type:'provider-token', id, error}                      a sentence for the user
```

- **Page side** (`worker-bridge.js` `serveProviderTokens(worker, {getAccessToken})`,
  attached by `Session` to the Worker before the boot message is posted, so
  no request can arrive unheard): `'start'` and `'expired'` call
  `siwc.getAccessToken()`, which returns the current token, refreshing it
  first when it has less than 5 minutes left (unless OpenAI's
  `earliest_refresh_at` has not passed while the token is still valid);
  `'unauthorized'` calls `getAccessToken({force: true})`, which refreshes
  now (single-flight: concurrent requests share one refresh). Refresh tokens
  rotate; the new one is saved before the answer is sent. The reply is built
  field by field: only `accessToken` and `expiresAt` (or `error`) leave the
  page. Errors are user-facing: signed out, the refresh refused (sign in
  again), no refresh allowed yet, the issuer unreachable.
- **Worker side** (track W, `boot/openai/token.js`): one request in flight at
  a time; the token is cached until `expiresAt - 60 s`. After an upstream
  401 it asks once with `'unauthorized'`, retries the request once, then
  fails it. OpenAI's edge layer answers a refused token without CORS
  headers, so the browser reports a `TypeError` instead of the 401; the
  Worker treats that as possibly unauthorized but does not ask again for a
  token it got moments ago, so a network outage cannot become a refresh
  storm. An `error` answer fails the request as an authentication error that
  carries the page's sentence.
- `src/host/fake-worker.js` imitates the Worker side: it asks with
  `'start'` at boot, with `'expired'` before a turn when its token is within
  60 s of expiry, and with `'unauthorized'` for a prompt containing
  "token refused".

## What travels inside stdin/stdout

The lines are the Agent SDK's stream-json protocol, with the page as the SDK
(`harness.js`; reference: `@anthropic-ai/claude-agent-sdk` 0.3.311 `sdk.mjs`):

- page → CLI: `{type:'control_request', request_id, request:{subtype:'initialize', sdkMcpServers:['page']}}`
  first, then `{type:'user', message:{role:'user', content}, parent_tool_use_id:null, uuid}`
  per prompt; `{subtype:'interrupt'}` control requests; `control_response`s
  answering the CLI's requests.
- CLI → page: `control_response` to `initialize` (commands, models, account),
  then per turn `system/init`, `assistant`, `user` (tool results), `result`;
  `control_request`s with subtype `can_use_tool` (answered
  `{behavior:'allow', updatedInput, toolUseID}` or `{behavior:'deny', message, toolUseID}`)
  and `mcp_message` (`{server_name, message: <JSON-RPC>}`, answered
  `{mcp_response: <JSON-RPC response>}`, or `{mcp_response:{jsonrpc:'2.0', result:{}, id:0}}`
  for a notification); `control_cancel_request` withdraws one.

`system/init` comes at the start of each turn, not at process start: the
page treats the `initialize` response as "the CLI is up".
