# Spike E: booting Claude Code 2.1.311 (Bun native binary) on stock Node

**Date:** 2026-10-27, 19:26 to 19:41 UTC (about 15 min wall clock, well inside the 60 to 75 min timebox)
**Working dir:** `<scratchpad>/research/spike-E/` (abbreviated `$S` below)
**Input:** `@anthropic-ai/claude-code-linux-x64@2.1.311` → `claude` ELF, 293,776,752 bytes, sha256 `86dc1fcc69498159eaf15f446613e847010f9036bfbbdffd4c49350be8489ada`
**Recipe source:** FreeBSD ports `misc/claude-code` (port is at **2.1.310**), `files/bun-polyfill.cjs` (1,238 lines), `scripts/post-extract` (233 lines), `files/claude.in`, `files/follow-dir-links.cjs`, and clawgod `src/shared/bun-ant-shim.cjs` @ `f9d2dcde3d2977f9015c9a7002b427b8453e8536` (429 lines, **only that file** taken).

## Short version

On stock Node 24, the extracted JS goes well past booting. It runs `--version`, `--help`, the Ink TUI (welcome screen and the full REPL with a prompt round trip), and a complete agentic `-p` turn: streamed SSE, then a `tool_use` Bash call, then a real `/bin/bash`, then the `tool_result`, then the final answer. The only change needed beyond the FreeBSD recipe was **Node ≥ 24**, because the bundle uses `await using`. Node 22.22 cannot parse it, even with `--js-explicit-resource-management`. On 2.1.311 every port rewrite matched exactly, so drift from 2.1.310 is zero.

---

## 0. Setup and safety

- The parent shell carries live session credentials (`CLAUDE_CODE_MESSAGING_TOKEN`, `CLAUDE_SESSION_INGRESS_TOKEN_FILE`, `ANTHROPIC_BASE_URL`, about 60 `CLAUDE_*` vars). Every run therefore used **`env -i` with an allowlist** (`$S/tools/run.sh`): PATH, TERM, LANG, a throwaway `HOME=$S/home` and `CLAUDE_CONFIG_DIR=$S/home/.claude`, proxy vars and CA vars, plus the five required flags (`DISABLE_AUTOUPDATER=1 CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1 DISABLE_TELEMETRY=1 USE_BUILTIN_RIPGREP=false SHELL=/bin/bash`).
- In network tests, `HTTPS_PROXY`/`HTTP_PROXY` for the child pointed at **my own deny-all logging proxy** (`$S/tools/deny-proxy.mjs`). It logs `CONNECT host:port` and answers 403. Direct egress from this container does work (`curl --noproxy '*' https://api.anthropic.com/` returned 404). For that reason a `--require` preload (`$S/tools/netlog.cjs`, `NETLOG_BLOCK=1`) also logs every `fetch`, `http(s).request`, `net.Socket#connect`, `dns.lookup` and `child_process.*`, and **refuses any non-loopback socket or DNS lookup**. I verified the block on `fetch` and on `https.get`. Result: **nothing from the extracted CLI reached Anthropic or any other host.**
- The ELF was never executed.
- Side effects outside `$S`: one per-cwd temp dir that the CLI creates under `/tmp/claude-0/` (moved to `$S/stray-cli-tmpdir`). The real `~/.claude.json` is untouched (mtime 19:06, before the spike).

## 1. Extraction

### Tools
1. **Own Node port of unhare's logic**, `$S/tools/bunfs-extract.mjs` (about 90 lines, pure `DataView`/`TextDecoder`, browser-portable).
2. **unhare 1.1.1** (`UnitedMarsupials/unhare`, BSD-2), built from source for cross-validation: `gcc -O2 -o tools/unhare unhare.c -lelf` (needed `apt-get install libelf-dev` plus `compat.h` from the repo).

```
$ time node tools/bunfs-extract.mjs ../pkg-linux-x64/package/claude extract-node/root
real 0m2.260s
{ "size": 293776752, "trailerAt": 293717290, "magicOccurrences": 2, "bytesAfterTrailer": 59446,
  "blobStart": 115363848, "byteCount": 178353410, "nModules": 2848, "entryId": 7,
  "entry": "/$bunfs/root/cli", "argv": "\"\"", "flags": "0x3bff",
  "files": 2848, "bytes": 54725814, "js": 2603, "jsBytes": 51076699,
  "enc": [144 binary, 2689 latin1, 15 utf16], "withBytecode": 2596, "withSourceMap": 0 }

$ time tools/unhare -vv -o extract-unhare ../pkg-linux-x64/package/claude
real 0m0.313s
unhare: ...claude: found .bun section 30 at offset 115363840, 178353466 bytes
unhare: blob 178353410 bytes, 2848 modules, entry 7, flags 0x3bff
unhare: extracted 2848 of 2848 modules, 54725814 bytes into .../extract-unhare

$ diff -rq extract-unhare extract-node/root && echo "IDENTICAL trees"
IDENTICAL trees
```

### What comes out
| item | value |
|---|---|
| modules | 2,848 (unhare kinds: 2,598 `js/esm/latin1`, 142 `file/binary`, 91 `text/latin1`, 15 `text/utf16`, 2 `napi`) |
| entry | `/$bunfs/root/cli`, a **26 KB** ESM stub beginning with `// @bun @bytecode` that imports chunks |
| JS | 2,594 `chunk-*.js` (49.96 MB) + `cli` + `mermaid.min.js` (786 KB), `hljsBundle.generated.min.js` (171 KB), `chart.umd.min.js` (64 KB), `src/plugins/functionHooks/hooks-worker/hooks-worker.js` (13 KB), `audio-capture.js`/`clipboard-napi.js` loaders. JS total is about 51.1 MB of plaintext source |
| native | `audio-capture.node` (492 KB), `clipboard-napi.node` (1.07 MB). Excluded, as the port does (`-x '*.node'`) |
| assets | 137 `*.zst` (skills/docs/templates), plus `.md`/`.txt` skills and docs, and 2 `.woff2.asset` fonts |
| bytecode | 2,596 modules **also** carry JSC bytecode (about 123 MB of the 178 MB blob). Source is always present, so the bytecode can be ignored |
| time | 0.31 s (unhare, mmap) and 2.2 s (Node, readFileSync of 294 MB) |

The stable (non-hashed) filename set equals the port's 2.1.310 `pkg-plist` exactly. The only differences are the two `.node` files (excluded) and the port's own four added files (`bun-polyfill.cjs`, `bun-ant-shim.cjs`, `follow-dir-links.cjs`, `package.json`).

### The Bun trailer format, in two sentences
The ELF has a `.bun` section (here section 30, `WA` flags) laid out as `[u64 payload_len][blob][32-byte Offsets{u64 byte_count; {u32 off,u32 len} modules; u32 entry_id; {u32,u32} argv; u32 flags}]["\n---- Bun! ----\n"]`. Without ELF parsing, an extractor can use the **last** occurrence of the magic in the file, since the string also occurs earlier in the runtime itself. The `modules` slice is an array of 52-byte records: six `{u32 offset,u32 len}` pairs relative to the blob start (name, contents, sourcemap, bytecode, module_info, bytecode_origin) plus four `u8` (encoding 0=binary/1=latin1/**2=UTF-16LE**, loader, format, side). Names carry a `/$bunfs/` prefix. The magic is **not** in the last 8 KiB here (59,446 bytes follow it), which is why `unbun`-style tail scans fail.

## 2. Patching (FreeBSD `scripts/post-extract`, adapted to Linux/GNU sed)

Script: `$S/tools/post-extract-linux.sh` (plus `$S/tools/zst-rewrite.mjs`, because no `zstd` CLI is installed; it uses Node `zlib.zstd*`). Changes from the original: BSD `sed -i ''` became `sed -i`, the BSD word boundary `[[:>:]]` became GNU `\>`, `cpio` became `cp -a`, and `APPDIR=$S/install/app`, `PREFIX=/usr/local`.

```
$ bash tools/post-extract-linux.sh extract-node/root/root install/app freebsd-port clawgod-shim/bun-ant-shim.cjs
== files copied: 2846
pre  bunfs=241429 usrlocal=30 meta.require=529 meta.dir=9
post bunfs=0 meta.require=0 meta.dir=0
== zst assets: 137, rewritten: 0
== builtin-hooks helper matches: 1 in chunk-v3b74dgg.js
=(e,o,t)=>Zf()?En(o,t(),e):{module:o,folder:e}      ->  =(e,o,t)=>En(o,t(),e)
== shell-search-tools gate files: 1 (chunk-ps7vnt4g.js)
function qA(){if(!Le("true"))return!1;if(kcs())return!1;return i.CLAUDE_CODE_ENTRYPOINT!=="local-agent"}  -> function qA(){return!1}
== path-completer readdir matches: 2 in chunk-w5xyre23.js
== prepended polyfill import to cli
real 0m2.455s
```

| rewrite | matches on 2.1.311 | port expectation | drift |
|---|---|---|---|
| `/$bunfs/root/` → APPDIR | 241,429 occurrences (2,391 files) | any | none |
| `/usr/local` → PREFIX | 30 (no-op on Linux) | any | none |
| `import.meta.require` → `globalThis.__bunRequire` | 529 sites / 115 files (port comment: "65 of ~1770 chunks" in an older release) | any | none |
| `import.meta.dir\b` → `.dirname` | 9 (port comment: 5 in 2.1.282) | any | none |
| built-in hooks-module helper (`Ed()?kt(...):{module,folder}`) | **1** | exactly 1 (fatal otherwise) | none |
| shell-search-tools gate (ugrep/bfs argv0 shims) | **1 file** | exactly 1 (fatal otherwise) | none |
| path-completer `readdir().filter(...)` | **2 in 1 chunk** | exactly 2 (fatal otherwise) | none |
| `.zst` assets needing rewrite | 0 of 137 | n/a | n/a |
| entry has no shebang, polyfill import prepended | OK | OK | none |

**Every rewrite matched, so 2.1.310 → 2.1.311 drift is zero.** The `USE_CURL_USER_AGENT` option (a `Claude-User` UA rewrite) was not applied, because it is cosmetic and unrelated to booting.

npm deps: the same 12-package set the port vendors, installed with `npm install --ignore-scripts` into `install/app`: string-width 8.3.0, wrap-ansi 10.0.2, slice-ansi 9.0.1, strip-ansi 7.2.0, yaml 2.9.1, semver 7.8.5, ws 8.22.0, undici 8.12.3 (plus 4 transitive). The bundle's only external bare import is `ws` (4 sites). The rest are used by the polyfill.

## 3. Boot tests

Runner: `$S/tools/run.sh [ENV=VAL...] -- <claude args>`, which runs `node --require install/app/bun-polyfill.cjs install/app/cli`.

### 3.0 Node 22.22 (the default `node` here): FAIL before any code runs
```
$ run.sh -- --version         -> "2.1.311 (Claude Code)"  (0.17 s: fast path, no chunk graph loaded)
$ run.sh -- --help            -> exit 1
file:///.../install/app/chunk-a15e22h9.js:15
...function _(e,n,r){using i=t_`JSON.stringify(${_e(e)})`;return JSON.stringify(e,n,r)}...
SyntaxError: Unexpected identifier 'i'
    at compileSourceTextModule (node:internal/modules/esm/utils:346:16)
```
The bundle uses TC39 Explicit Resource Management: 91 sync `using` and 36 `await using` declarations across 46 chunks. Node 22's V8 12.4 has `--js-explicit-resource-management`, but that flag parses only **sync** `using`; `await using a = …` still throws `SyntaxError: Unexpected identifier 'a'`. **The requirement is Node ≥ 24.** This is a runtime-version issue, not a polyfill gap. The FreeBSD port uses node24/26. I fetched the official `node-v24.22.1-linux-x64.tar.xz` from nodejs.org (SHA256 verified against `SHASUMS256.txt`) into `$S/node24/`. All results below use it.

### 3.a `--version` (Node 24): PASS
```
$ time run.sh -- --version
2.1.311 (Claude Code)       real 0m0.184s   exit 0
```

### 3.b `--help` (Node 24): PASS
```
$ time run.sh -- --help
Usage: claude [options] [command] [prompt]
Claude Code - starts an interactive session by default, use -p/--print for non-interactive output
... (314 lines)                 real 0m3.679s   exit 0
```

### 3.c Interactive TUI under a pty (`python3 -I tools/pty-capture.py`, 120x40; screen replayed by `tools/vt-render.mjs`)

**Pass 1: fresh HOME, no token, egress denied.** Ink renders. The welcome screen paints, which shows that the `Bun.ant.CellSegmenter` shim works. The onboarding connectivity preflight then fails against my deny proxy and the process `exit(1)`s after about 4.9 s:
```
Welcome to Claude Code v2.1.311
..........................................................
     *                                       █████▓▓░
   ... (ASCII art) ...
 Unable to connect to Anthropic services
 Failed to connect to api.anthropic.com: fetch failed
 A proxy is configured via https_proxy. Check that it allows connections to the host above. ...
```
The preflight is `GET https://api.anthropic.com/api/hello` + `GET https://platform.claude.com/v1/oauth/hello`, both hardcoded (`${on().BASE_API_URL}/api/hello`, `${new URL(TOKEN_URL).origin}/v1/oauth/hello`). Any non-200 response, or no response, ends in `process.exit(1)` (`ov("preflight_endpoint")`). The login-method screen sits behind this check, so I did not reach it without real egress, which I chose not to allow.

**Pass 2: seeded `.claude.json` (`hasCompletedOnboarding`, folder trust), `CLAUDE_CODE_OAUTH_TOKEN=sk-ant-oat01-FAKE…`, `ANTHROPIC_BASE_URL=http://127.0.0.1:18080` (mock → 401), keystrokes `say hi⏎` at t=8 s.** The full REPL works:
```
 ▐▛███▛█   Claude Code v2.1.311
▝▜██████▀  Sonnet 5.5 · Claude API
 ▝▝   ▝▝   /…/spike-E/tui-cwd
▎ Auto mode is now Claude Code's default permission mode. ...
❯ say hi
● Please run /login · API Error: 401 Invalid bearer token (mock)
✻ Worked for 2s · done 7:35 PM
────────────────────────────────────────────────────────────
❯
────────────────────────────────────────────────────────────
  ⏵⏵ auto mode on (shift+tab to cycle)
```
Still running at t=18 s, then killed. Egress attempts in interactive mode (all denied): `CONNECT downloads.claude.ai:443` (`GET /claude-code-releases/plugins/claude-plugins-official/latest`, the official plugin-marketplace manifest, sent **despite** `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`) and `CONNECT github.com:443` from a `git` child. Subprocesses spawned at startup (25): `git` (×8), `rg --files` (×3), `npm config get prefix` (×2, and npm itself pinged registry.npmjs.org), `ps aux | grep -E "code|cursor|windsurf|…"` (IDE detection), `ssh -T -o BatchMode=yes git@github.com` (GitHub SSH probe; a separate process that my Node preload cannot block), and `which`.

### 3.d `-p "say hi" --output-format json` with an inference-only (fake) OAuth token
```
$ run.sh CLAUDE_CODE_OAUTH_TOKEN=sk-ant-oat01-FAKEspikeE… ANTHROPIC_BASE_URL=http://127.0.0.1:18080 \
    HTTPS_PROXY=http://127.0.0.1:18081 … NO_PROXY=127.0.0.1,localhost \
    NODE_OPTIONS=--require=tools/netlog.cjs NETLOG_FILE=logs/net-d.jsonl \
    -- -p "say hi" --output-format json
real 0m7.287s   exit=1
{"type":"result","subtype":"success","is_error":true,"api_error_status":401,
 "result":"Failed to authenticate. API Error: 401 Invalid bearer token (mock)",
 "terminal_reason":"api_error","num_turns":1,"duration_ms":2492, ...}
```
The mock (`tools/mock-api.mjs`) logged the following. Request #1 was my own curl self-test.
```
#2 POST /v1/messages?beta=true
   authorization: Bearer sk-ant-oat01-…(len 117)
   anthropic-beta: claude-code-20250219,oauth-2025-04-20,interleaved-thinking-2025-05-14,context-management-2025-06-27,
                   per-turn-control-2026-07-01,mid-conversation-tool-changes-2026-07-01,thinking-token-count-2026-05-13,
                   advanced-tool-use-2025-11-20,effort-2025-11-24,extended-cache-ttl-2025-04-11
   anthropic-version: 2023-06-01
   user-agent: claude-cli/2.1.311 (external, sdk-cli)
   x-app: cli
   anthropic-dangerous-direct-browser-access: true
   x-claude-code-session-id: <uuid>
   x-stainless-lang: js  x-stainless-runtime: node  x-stainless-runtime-version: v24.22.1  x-stainless-package-version: 0.128.0
   other headers: host, connection, accept, x-stainless-retry-count, x-stainless-timeout, x-stainless-os, x-stainless-arch,
                  accept-language, sec-fetch-mode, accept-encoding, content-length
   body: model=claude-sonnet-5-5 stream=true max_tokens=128000 messages=2 tools=14 system=3 blocks
#3 POST /v1/messages?beta=true   (identical; one retry after the 401, ~0.6 s later)
```
- **Deny-proxy log: empty. Netlog: no DNS lookups and no non-loopback sockets.** Only these two requests went out. Spawns: `git ls-files`, `which zsh/bash`.
- Time from process start to the first `/v1/messages`: 5.1 s.
- The SDK sends `anthropic-dangerous-direct-browser-access: true` **even from Node**, and Node's fetch adds `sec-fetch-mode: cors`.

**Request list (inference-only token, flags as specified): startup = none; turn = `POST {BASE}/v1/messages?beta=true` ×2 (initial plus one retry on 401).**

### 3.d2 Variant: same, but without the two suppression flags (`CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=` `DISABLE_TELEMETRY=`), egress blocked
Order as observed (t = ms after process start):
| t | via | request | honours ANTHROPIC_BASE_URL? |
|---|---|---|---|
| 3292 | fetch (Bun `proxy:` opt, proxied) | `POST https://api.anthropic.com/api/eval/sdk-zAZezfDKGoZuXXKe` (GrowthBook remote eval) | **no** |
| 4053 | axios/https.request | `GET https://api.anthropic.com/api/claude_cli/bootstrap?entrypoint=sdk-cli&model=claude-sonnet-5-5` | **no** |
| 4433 | axios/https.request | `GET https://api.anthropic.com/mcp-registry/v0/servers?version=latest&limit=100&visibility=commercial,gsuite,enterprise,health` | **no** |
| 5700 | fetch | `POST http://127.0.0.1:18080/v1/messages?beta=true` (401) | yes |
| 6284 | fetch | `POST http://127.0.0.1:18080/v1/messages?beta=true` (401, retry) | yes |
| 7498 / 8008 / 8053 | fetch ×2, https ×1 | `POST https://api.anthropic.com/api/event_logging/v2/batch` | **no** (literal `https://api.anthropic.com/api/event_logging/v2/batch`) |

The deny proxy saw 6× `CONNECT api.anthropic.com:443`. Nothing went direct: the bundle's proxy configuration is honoured under Node too. No `/api/oauth/profile`, `/api/claude_code/settings` or `/api/hello` calls were made, since an env-supplied OAuth token has no profile scope.

### 3.e (extra) Successful agentic turn: mock in OK mode returns SSE with a `tool_use` Bash call, then text
```
$ run.sh … ANTHROPIC_BASE_URL=http://127.0.0.1:18090 … -- -p "run the probe" --output-format json --allowedTools Bash --permission-mode default
real 0m5.013s  exit=0
{"type":"result","subtype":"success","is_error":false,"num_turns":2,"result":"mock saw the tool result",
 "terminal_reason":"completed","modelUsage":{"claude-sonnet-5-5":{...,"contextWindow":1000000,"maxOutputTokens":128000}}, ...}
mock log:
POST /v1/messages?beta=true  messages=2 tools=14      -> SSE tool_use Bash {"command":"echo hello-from-bash; uname -s; echo node=$(node --version)"}
POST /v1/messages?beta=true  messages=5 tools=14
  tool_result: {"tool_use_id":"toolu_mock1","type":"tool_result","content":"hello-from-bash\nLinux\nnode=v24.22.1","is_error":false}
                                                        -> SSE text "mock saw the tool result"
spawns: rg --files; /bin/bash -c env; /bin/bash -c -l SNAPSHOT_FILE=… (shell snapshot); /bin/bash -c "source <snapshot> … <command>"
```
Streaming parse, the permission system, the Bash tool, the shell snapshot and the tool_result round trip all work on stock Node. (A first attempt with a buggy mock looped tool calls for 90 s, which also showed sustained multi-turn operation; see `logs/api-ok-loop.jsonl`.)

`CLAUDE_CODE_GZIP_REQUEST_BODIES=1` test: no `content-encoding` was applied in this configuration, so the `Bun.hash.crc32` gzip-trailer path was not reached (see §4).

## 4. Failures and gaps, classified

| # | symptom | where | class | fixable in JS? |
|---|---|---|---|---|
| 1 | `SyntaxError: Unexpected identifier` on `using` / `await using` (Node 22) | 46 chunks | **runtime version** (needs V8 ≥ 13.x, i.e. Node ≥ 24) | Yes, either use Node 24 or lower `using` with a transpile pass |
| 2 | Onboarding preflight `exit(1)` without reachability to `api.anthropic.com` + `platform.claude.com` | onboarding | network policy, not a port bug | n/a (needs egress, or pre-seeded onboarding plus a token) |
| 3 | `Bun.hash.crc32` absent from polyfill (2 sites: gzip-body trailer, PNG chunk CRC) | latent | **polyfill gap** | yes (`zlib.crc32`, Node ≥ 22.2) |
| 4 | `Bun.hash.xxHash64` faked as truncated SHA-256 | cache keys only | polyfill approximation | acceptable |
| 5 | `Bun.FetchSession` absent | TLS session pooling, guarded `if(!n)return` | Bun-only API | degrades cleanly |
| 6 | `Bun.ant.posixFsAt` absent | macOS sandbox "anchor" backend, warns | **Bun fork-only** (`Bun.ant.*`) | n/a on Linux |
| 7 | `Bun.ant.loginTty`, `Bun.ant.ttyName` absent | `--bg` controlling-tty and stdout diagnostics, try/catch | **Bun fork-only** | degrades |
| 8 | `Bun.ant.windowsProcessList/windowsFolderSecurity/windowsProcessCreationTime` | Windows only, `typeof` guarded | Bun fork-only | n/a |
| 9 | `Bun.ant.CellSegmenter` (Ink cell grid since 2.1.271) | renderer | **Bun fork-only**, covered by the clawgod shim, verified rendering | yes (done) |
| 10 | `Bun.ant.memoryPressureLevel/setDumpable/getPeerPid/getPeerUid` | misc | Bun fork-only, stubbed by the polyfill | stubbed |
| 11 | `Bun.Terminal` stub, so the `--bg-pty-host` background-PTY host cannot work; the bundle itself says *"Bun.Terminal unavailable (running under Node?)"* | `--bg` sessions | Bun-only API | needs node-pty or similar (native) |
| 12 | `Bun.Image` absent; image resize falls back to "send original or refuse" | images | Bun-only (native codecs) | needs a wasm codec |
| 13 | `import("bun:jsc")` (`edenGC`, `heapStats`) | GC and diagnostics, try/catch | Bun-only | degrades |
| 14 | global `new Worker(...)` ×3 real sites (stdout-blocking watchdog via Blob URL; hooks-worker; node-forge core estimate) | Node has no global `Worker` | runtime difference | partial: try/catch; hooks-worker will not run |
| 15 | Self-respawn `process.execPath [+ argv[1]]` (73 `process.execPath` refs / 25 files; `CLAUDE_CODE_EXECPATH` ×4) | remote-control, bg host, plugin evals, ugrep/bfs argv0 shims | **process identity** | handled by the port: the polyfill import is prepended to `cli` and the ugrep/bfs gate is forced off (Grep/Glob then use system `rg`) |
| 16 | `audio-capture.node`, `clipboard-napi.node` | voice and clipboard | **native dependency** (napi) | excluded; load sites wrapped in try |

No unhandled exception came up in any of the exercised paths (`--version`, `--help`, `-p` 401, `-p` success with Bash, TUI welcome, TUI REPL turn). Stderr was empty in every Node 24 run.

## 5. Node built-ins needed: polyfill and bundle, judged for a browser

**Polyfill (`bun-polyfill.cjs`) needs:** `child_process` (spawn, execFileSync for `which`), `fs` (file-backed `localStorage`, `Bun.file/write`, `__bunRequire` text assets), `path`, `http` (`Bun.serve`), `net` (`Bun.connect/listen`), `crypto` (sync sha256 for `Bun.hash`/`SHA256`/`CryptoHasher`), `os`, `module.createRequire` (`__bunRequire`: **synchronous require of ESM chunks**, with a Proxy shim for `ERR_REQUIRE_CYCLE_MODULE`), `zlib` (zstd), `util`, `v8` (heap snapshot), `SharedArrayBuffer` + `Atomics.wait` (`sleepSync`).

**Bundle imports (counts of `from"…"`):** path 1106, fs/promises 588, crypto 442, fs 285, os 216, util 91, child_process 65, net 46, url 35, stream 30, async_hooks 30, http 29, vm 23, process 22, readline 14, zlib 13, https 11, buffer 11, tls 10, string_decoder 10, events 9, tty 6, dns 4, http2 3, module 2, v8 1, perf_hooks 1, plus npm `ws`.

| difficulty in browser | modules |
|---|---|
| **easy** (shim or npm) | path, url, util, events, buffer, string_decoder, stream, os (fake values), semver/yaml/string-width etc. (pure JS), zlib (fflate/pako + wasm zstd), `ws` → native WebSocket, `localStorage` (native) |
| **medium** | `crypto` (sync `createHash`/`randomBytes`; WebCrypto is async, so a JS sha256 such as noble is needed), `fs` + `fs/promises` (virtual FS such as ZenFS/OPFS; **sync** fs calls need an in-memory FS or SAB+Atomics bridging), `readline`/`tty`/raw-mode stdin (xterm.js + adapter), `async_hooks` (the bundle already falls back to a no-op `AsyncLocalStorage` when `process.getBuiltinModule("async_hooks")` is absent), `__bunRequire`'s synchronous ESM require (needs a bundler pre-pass or a sync module registry), `sleepSync` (`Atomics.wait` is banned on the main thread, so it must run in a Worker with COOP/COEP) |
| **hard** | `child_process` (Bash tool, git, rg, ps, ssh, npm: needs a WASM/VM shell such as v86 or WebContainer, or a remote executor), `net`/`tls`/`http`/`https`/`http2`/`dns` (axios-on-`https.request` paths need a fetch adapter; `Bun.serve`/`listen` have no browser equivalent beyond a Service Worker), `vm` (23 imports, no browser equivalent; would need iframe or ShadowRealm-style isolation), `.node` addons (none needed) |
| **easier in the browser than in Node** | global `Worker`, `Blob`/`URL.createObjectURL`, `fetch`, `WebSocket` |

## VERDICT

**(i) Extraction with open-source tools: YES.** unhare 1.1.1 (BSD-2, C + libelf) extracts all 2,848 modules in 0.3 s. A 90-line pure-JS port of its parser (`$S/tools/bunfs-extract.mjs`) produces a byte-identical tree and would run unchanged in a browser on an `ArrayBuffer` of the ELF. No decryption or obfuscation is involved: the JS is plaintext ESM (UTF-16LE for 15 text modules), and the JSC bytecode next to it can be ignored.

**(ii) Boots on stock Node: YES on Node 24, NO on Node 22.** With the FreeBSD polyfill, the clawgod CellSegmenter shim and the post-extract rewrites (all matching), the following work on Node 24.22.1: `--version`, `--help`, the full Ink TUI (welcome screen and a REPL turn), and a complete agentic `-p` turn with streaming and real Bash tool execution. Node 22.22 fails at parse time on `await using`. The `--js-explicit-resource-management` flag covers sync `using` only. Not working under Node: `--bg` PTY host (`Bun.Terminal`), image resize (`Bun.Image`), the hooks worker (no global `Worker`), clipboard and voice (napi). The onboarding/login screen needs real reachability to `api.anthropic.com/api/hello` and `platform.claude.com/v1/oauth/hello`.

**(iii) Requests with an inference-only token (`CLAUDE_CODE_OAUTH_TOKEN`, `ANTHROPIC_BASE_URL` set):**
- With `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1 DISABLE_TELEMETRY=1`, the `-p` turn makes only `POST {BASE}/v1/messages?beta=true` (plus one retry on 401). There is no other HTTP or DNS at startup. Interactive mode additionally fetches `GET https://downloads.claude.ai/claude-code-releases/plugins/claude-plugins-official/latest` and has a `git` child contact github.com, while the TUI runs subprocess probes (`ssh -T git@github.com`, `ps aux`, `npm config get prefix` → registry.npmjs.org).
- Without those flags, the following also happen, all **hardcoded to `https://api.anthropic.com`** and **ignoring `ANTHROPIC_BASE_URL`**: `POST /api/eval/sdk-zAZezfDKGoZuXXKe` (GrowthBook), `GET /api/claude_cli/bootstrap?entrypoint=sdk-cli&model=…`, `GET /mcp-registry/v0/servers?…`, `POST /api/event_logging/v2/batch` ×3.
- From the code (grep): `/api/oauth/profile`, `/api/claude_code/settings`, `/api/claude_code/policy_limits`, `/api/claude_code/metrics`, `/api/hello` (onboarding preflight) and the OAuth endpoints (`TOKEN_URL=https://platform.claude.com/v1/oauth/token`, `API_KEY_URL`/`ROLES_URL` on api.anthropic.com) all derive from `on().BASE_API_URL`. That value is hardcoded per environment and can be overridden only by `CLAUDE_CODE_CUSTOM_OAUTH_URL`, checked against an allowlist (`beacon.claude-ai.staging.ant.dev`, `claude.fedstart.com`, `claude-staging.fedstart.com`; anything else throws *"not an approved endpoint"*). `event_logging/v2/batch` is a string literal. The bootstrap honours `ANTHROPIC_BASE_URL` only on the WIF (workload-identity) path, and one `HEAD {ANTHROPIC_BASE_URL}/api/hello` connection warm-up honours it as well. **Only `/v1/messages` (and `count_tokens`) follow `ANTHROPIC_BASE_URL`.**

**(iv) Drift risk: low per release, moderate over time.** Between 2.1.310 and 2.1.311 drift was zero: all 7 rewrites matched with the exact counts the port's fatal checks require, and the stable file set was identical. The port's own history shows a forced change about every 10 to 20 releases: zstd assets (2.1.251), require cycles (2.1.258), `Bun.Image` (2.1.268), `Bun.ant.CellSegmenter` (2.1.271), `Bun.unsafe` and `import.meta.dir` (2.1.282), `Bun.SHA256` (2.1.288). Upstream ships roughly daily, so plan on an occasional patch every week or two. 2.1.311 already references unpolyfilled `Bun.FetchSession`, `Bun.ant.posixFsAt/loginTty/ttyName` and `Bun.hash.crc32`; these are guarded or latent today, but they show where future breaks will come from. The minified-shape regexes, and the private `Bun.ant.*` surface in particular, are the brittle part. The Bun container format itself has been stable (unhare handles 4 historical binaries).

**(v) What a browser port needs beyond what Node provides:**
1. **`using`/`await using` support**: Chromium 134+ has it natively. Other engines need a lowering pass over about 50 MB of JS (not verified here).
2. **A synchronous module system** for 529 `import.meta.require` sites, plus a cycle-tolerant loader (bundle the chunks with esbuild/rollup, or a sync registry) and absolute-path import rewriting (241k `/$bunfs/root/` refs). There is no `createRequire` in a browser.
3. **A virtual filesystem with sync APIs** (config, sessions, skills, `.zst` assets, shell snapshots): 873 fs/fs-promises imports.
4. **Process execution**: Bash/git/rg/ps/ssh/npm spawns, which are the core of the agent (WASM Linux/v86/WebContainer, or a remote sandbox). The Grep/Glob tools also depend on `rg`.
5. **Networking shims**: axios over `https.request` (bootstrap, MCP registry, OAuth) must be moved to fetch. **CORS** applies to every non-`/v1/messages` endpoint. The CLI already sends `anthropic-dangerous-direct-browser-access: true` on `/v1/messages`. The hardcoded `api.anthropic.com`/`platform.claude.com` calls cannot be redirected by `ANTHROPIC_BASE_URL`, so either suppress them with the env flags (as in 3.d) or intercept them in a fetch shim or Service Worker.
6. **Terminal**: xterm.js wired to `process.stdin`/`stdout`, raw mode, `SIGWINCH`/resize, plus the CellSegmenter shim (pure JS, already works). `sleepSync` via `Atomics.wait` requires running in a Worker under COOP/COEP.
7. **Sync crypto** (sha256 etc.), wasm zstd, an `AsyncLocalStorage` fallback (the bundle already has one), and `vm` (23 imports, needs an iframe or realm substitute or stubs).
8. **Process identity**: neutralise `process.execPath` self-respawn (bg sessions, remote-control) and keep the ugrep/bfs gate off, as the port does.
9. Startup cost: about 4.4 to 5.1 s on Node 24 from process start to the first `/v1/messages`, loading about 51 MB of source with no code cache. A browser should precompile or bundle and cache.

## Files

- Tools (mine): `$S/tools/bunfs-extract.mjs`, `post-extract-linux.sh`, `zst-rewrite.mjs`, `run.sh`, `mock-api.mjs`, `deny-proxy.mjs`, `netlog.cjs`, `pty-capture.py`, `vt-render.mjs`, `unhare` (built binary)
- Upstream inputs: `$S/freebsd-port/` (Makefile, distinfo, pkg-plist, files/, scripts/post-extract), `$S/clawgod-shim/bun-ant-shim.cjs`, `$S/unhare-src/`
- Outputs: `$S/extract-node/root/root/` and `$S/extract-unhare/root/` (identical), `$S/install/app/` (patched, runnable), `$S/post-extract.log`, `$S/out-*.txt`, `$S/out-tui*.raw`, `$S/logs/*.jsonl` (`net-*` = preload log, `api-*` = mock, `proxy-*` = denied CONNECTs)
- Node 24: `$S/node24/node-v24.22.1-linux-x64/bin/node`
