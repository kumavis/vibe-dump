# A — Claude Code anatomy, subscription auth, and terms (as of 2026-10-27)

Scope: what Claude Code ships as today, what is inside it, how Pro/Max OAuth works,
what the terms allow, and what the Agent SDK does. Browser runtimes, CORS tests and
prior art are covered in other reports.

Labels: **VERIFIED** means I checked a primary source (npm registry, the tarballs
themselves, official docs or terms pages) or ran the check. **INFERRED** means it is
reasoned from evidence or comes from secondary or third-party sources.

Local artifacts. Everything was inspected with grep/strings only and nothing was executed:

- `research/pkg/`: `@anthropic-ai/claude-code@2.1.311` (current `latest`)
- `research/pkg-2.1.112/`: `@anthropic-ai/claude-code@2.1.112`, **the last version that shipped `cli.js`**
- `research/pkg-linux-x64/`: `@anthropic-ai/claude-code-linux-x64@2.1.311` (the native binary)
- `research/pkg-sdk/`: `@anthropic-ai/claude-agent-sdk@0.3.311`

(All are under `<scratchpad>/research/`.)

---

## TL;DR — the facts that change the plan

1. **The npm package no longer contains JavaScript.** Starting with **2.1.113 (2026-04-17)**,
   `@anthropic-ai/claude-code` is a 29 KB wrapper. It pulls a **~280–300 MB native
   executable** in through per-platform `optionalDependencies`. That executable is
   Bun-compiled, running **Bun v1.4.4 (an Anthropic-internal fork, `@anthropic-ai/bun-internal`)**.
   The last version with a portable `cli.js` is **2.1.112 (2026-04-16)**, now about 200 releases old. VERIFIED.
2. The JS inside the current binary calls a **private `Bun.ant.*` native namespace**, for example
   `Bun.ant.CellSegmenter`, which the TUI uses for grapheme segmentation. It throws
   *"This runtime has no Bun.ant.CellSegmenter. Run Claude Code on the @anthropic-ai/bun-internal
   version pinned in package.json."* So the current JS cannot run as-is on stock Node, stock Bun
   or a browser. VERIFIED (string and code present). The extent of the breakage is INFERRED.
3. Subscription OAuth is a standard PKCE flow with a public client_id. The token endpoint is
   `platform.claude.com/v1/oauth/token`, and a **manual code-paste redirect** exists that needs no
   localhost listener. API calls use `Authorization: Bearer <access_token>` plus
   `anthropic-beta: oauth-2025-04-20`. Claude Code **always constructs its API client with
   `dangerouslyAllowBrowser: true`**, so it already sends `anthropic-dangerous-direct-browser-access: true`. VERIFIED.
4. **Terms:** OAuth subscription use is allowed only for "ordinary use of Claude Code and other
   native Anthropic applications". Third parties may not "offer Claude.ai login into their own
   applications", may not "collect, store, or intermediate Claude.ai credentials", and a hosted
   Claude Code "binary must not be modified". The one explicit carve-out is "an end user signing in to the
   **unmodified Claude Code binary** with their own Claude subscription". VERIFIED (legal-and-compliance page).
   A web app that bundles or patches the code, or that runs an old `cli.js` in a JS runtime, falls
   outside that carve-out and is risky. INFERRED.
5. **License:** "© Anthropic PBC. All rights reserved." It is proprietary, with no redistribution or
   modification grant. VERIFIED.
6. **Agent SDK:** the main entry always spawns the native CLI binary as a subprocess. There is a
   `@anthropic-ai/claude-agent-sdk/browser` entry, but it is only a **thin client for a remote Claude
   Code session** (Anthropic-hosted "CCR" sessions over SSE/WebSocket), not an in-browser harness. VERIFIED.

---

## 1. Distribution today

### 1.1 Channels (VERIFIED: https://code.claude.com/docs/en/setup)

- **Native installer, labelled "(Recommended)":** `curl -fsSL https://claude.ai/install.sh | bash` (also
  `install.ps1` and `install.cmd`). It installs into `~/.local/share/claude/versions/` with a launcher at
  `~/.local/bin/claude`, and auto-updates in the background.
- **Homebrew** casks `claude-code` (stable) and `claude-code@latest`; **WinGet** `Anthropic.ClaudeCode`;
  signed **apt/dnf/apk** repos at `downloads.claude.ai/claude-code/{apt,rpm,apk}/{stable,latest}`.
- **npm** is still documented under "Advanced installation options", and is *not* marked deprecated:
  > "The npm package requires Node.js 22 or later. On an older Node.js version, npm prints an `EBADENGINE`
  > warning during install rather than failing; the install completes and `claude` still runs, since the package
  > downloads a native binary that doesn't use your Node.js at runtime."
  > "The npm package installs the same native binary as the standalone installer. npm pulls the binary in through
  > a per-platform optional dependency such as `@anthropic-ai/claude-code-darwin-arm64`, and a postinstall step links
  > it into place. The installed `claude` binary does not itself invoke Node."
- Every release publishes a GPG-signed `manifest.json` with per-platform SHA256 at
  `https://downloads.claude.ai/claude-code-releases/<ver>/manifest.json`. Signatures exist from 2.1.89 onward.
- Earlier in 2026 the docs called the npm install "deprecated". A Feb-2026 archived copy of the setup page and
  several guides quote that wording. Current docs have dropped the label. INFERRED from mirrors and archives.

### 1.2 npm registry facts (VERIFIED with `npm view` and the full packument from `registry.npmjs.org`)

| | `@anthropic-ai/claude-code` | `@anthropic-ai/claude-agent-sdk` |
|---|---|---|
| latest | **2.1.311** (published 2026-10-26 19:47Z) | **0.3.311** (2026-10-26) |
| other dist-tags | `next: 2.1.312` (2026-10-27), `stable: 2.1.308` | `next: 0.3.312` |
| versions | 552 | 334 |
| engines | `node >=22.0.0` (since 2.1.198, 2026-07-01; was `>=18.0.0`) | `node >=18.14.0` |
| license field | `SEE LICENSE IN README.md` | `SEE LICENSE IN README.md` |
| deprecated | no (only the ancient 0.2.109 and 0.2.119 are) | no |
| cadence | about one release per weekday, lockstep with the native binary | lockstep: `claudeCodeVersion: "2.1.311"` in its package.json |
| publisher | GitHub Actions OIDC (`npm-oidc-no-reply@github.com`) | same |

**Packaging transitions** (VERIFIED, from the `bin` field and `unpackedSize` across every version):

| first version | date | `bin` | unpacked size | what it means |
|---|---|---|---|---|
| 0.2.9 | 2025-02-24 | `cli.mjs` | 35 MB | bundled JS |
| 0.2.33 | 2025-03-07 | `cli.js` | 32 MB → 49 MB | bundled JS + vendored rg and other native helpers |
| **2.1.113** | **2026-04-17** | `bin/claude.exe` | **132 KB** | wrapper + native platform packages |
| 2.1.198 | 2026-07-01 | `bin/claude.exe` | 155 KB | engines bumped to Node ≥22 |

- Last `cli.js` release: **2.1.112** (2026-04-16T19:23Z). It is still downloadable from
  `registry.npmjs.org`, `cdn.jsdelivr.net/npm/@anthropic-ai/claude-code@2.1.112/cli.js` and unpkg. All
  three answered `200` with `access-control-allow-origin: *`. VERIFIED (HEAD requests).
- **2.1.88 has been removed** from the registry. It was published 2026-03-30T22:36Z, `time` still lists it,
  and `versions` does not. This is the release that leaked the full TypeScript source through `cli.js.map`
  (~512k lines). Anthropic pulled it. VERIFIED (absence on the registry); the leak details are INFERRED from press:
  https://bleepingcomputer.com/news/artificial-intelligence/claude-code-source-code-accidentally-leaked-in-npm-package ,
  https://infoq.com/news/2026/04/claude-code-source-leak . The leaked source is still proprietary and has no license.
- The Agent SDK made the same switch on the same day. Through **0.2.112** it bundled the CLI (~70–78 MB).
  From **0.2.113** (2026-04-17) it depends on `@anthropic-ai/claude-agent-sdk-<platform>` native packages
  (~4–5 MB for the JS part). VERIFIED.

### 1.3 The native binary (VERIFIED on the linux-x64 2.1.311 package)

- `file`: `ELF 64-bit LSB executable, x86-64, dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2 … not stripped`,
  size **293,776,752 bytes**. The manifest gives 276–299 MB across the 8 platforms.
- It embeds the string `Bun v1.4.4 (0ae49f8b6) Linux x64`, and the JS sits in Bun's embedded FS as code-split chunks
  (`/$bunfs/root/chunk-*.js`). The JS is **plaintext** inside the binary: grep finds
  `VERSION:"2.1.311",…BUILD_TIME:"2026-10-26T18:31:42Z",GIT_SHA:"e7d3b836…"`.
- It runs on an **Anthropic fork of Bun** with a private `Bun.ant` namespace. Members found:
  `CellSegmenter, posixFsAt, windowsFsAt, installSeccompFilter, loginTty, ttyName, getPeerPid, getPeerUid,
  setDumpable, memoryPressureLevel, createPowerAssertion, releasePowerAssertion, windowsFolderSecurity,
  windowsProcessList, windowsProcessCreationTime`. Quote:
  > `function L6n(e,t){if(typeof Bun>"u"||typeof Bun.ant?.CellSegmenter!=="function")throw Error("This runtime has no Bun.ant.CellSegmenter. Run Claude Code on the @anthropic-ai/bun-internal version pinned in package.json.");return new Bun.ant.CellSegmenter({ambiguousIsNarrow:!0,substitute:e,screen:t})}`

  That function backs grapheme segmentation (`YHt`), which the terminal renderer uses.
- Background sessions use `Bun.Terminal` (Bun's PTY API) together with `Bun.spawn({terminal})`, and the code carries the fallback
  message `"Bun.Terminal unavailable (running under Node?)"`. Parts of the code still tolerate Node; others do not.
- Platforms published: darwin-arm64/x64, linux-x64/arm64 (glibc and musl), win32-x64/arm64. The wrapper's
  `PLATFORMS` map also names `linux-{x64,arm64}-android`, but no such packages are published.

---

## 2. What's inside the npm package

### 2.1 Current package (2.1.311): a wrapper only (VERIFIED)

```
     147  LICENSE.md
    2037  README.md
     500  bin/claude.exe      # shell stub: "Error: claude native binary not installed." … exit 1
    4997  cli-wrapper.cjs     # fallback: spawnSync(<platform pkg>/claude, argv, {stdio:'inherit'})
    8375  install.cjs         # postinstall: hardlink/copy platform binary over bin/claude.exe (no network)
    1476  package.json
  171918  sdk-tools.d.ts      # tool input/output TypeScript types only
```

The platform package `@anthropic-ai/claude-code-linux-x64@2.1.311` contains `claude` (293.8 MB),
`README.md`, `LICENSE.md` and `package.json` (`"os":["linux"],"cpu":["x64"],"libc":["glibc"]`).

### 2.2 Last JS package (2.1.112): what the analysis below is based on (VERIFIED)

```
  13,711,684  cli.js                                  # single bundled ESM file, 18,412 lines, longest line 397,778 chars
     117,768  sdk-tools.d.ts
      ~4.5–6.5 MB each  vendor/ripgrep/{arm64,x64}-{darwin,linux,win32}/rg(.exe)   # 6 static ripgrep builds (COPYING: Unlicense/MIT)
      ~440–510 KB each  vendor/audio-capture/{arm64,x64}-{darwin,linux,win32}/audio-capture.node  # N-API addon (voice mode)
      603 KB / 752 KB   vendor/seccomp/{arm64,x64}/apply-seccomp   # static ELF, Linux sandbox helper
  optionalDependencies: @img/sharp-* (9 platforms, libvips N-API image processing)
```

- **Single bundled file: yes.** It starts with `#!/usr/bin/env node`, then
  `import{createRequire as vP5}from"node:module";` (ESM, `"type":"module"`).
- **Minified, not obfuscated.** Identifiers are mangled (`K6`, `vB6`, …) but strings, env-var names, URLs and
  React/Ink component structure are intact. The header says so itself:
  `// Want to see the unminified source? We're hiring!`
- **Native code it touches:**
  - `rg`: vendored per platform. In the Bun build, `rg` is *embedded in the main binary* and invoked as
    `process.execPath` with `argv0:"rg"`, mode `"embedded"`. `USE_BUILTIN_RIPGREP=0` switches to the system `rg`.
    Snippet:
    `ts6=P1(()=>{if(c5(process.env.USE_BUILTIN_RIPGREP)){let{cmd:z}=Jp1("rg",[]);if(z!=="rg")return{mode:"system",command:z,args:[]}}if(v$()){let z={mode:"embedded",command:process.execPath,args:["--no-config"],argv0:"rg"};…`
    with the builtin fallback `AK6.resolve(K,`${process.arch}-${process.platform}`,"rg")` under `vendor/ripgrep`.
  - `.node` addons: `audio-capture.node` (voice), `sharp.node` (images, with a `@img/sharp-wasm32` candidate path),
    `image-processor.node`, `modifiers.node` (darwin), `computer_use.node` (darwin). Each is loaded optionally
    inside try/catch.
  - Sandboxing: `bwrap` (bubblewrap) plus `socat` plus `apply-seccomp` on Linux, and `sandbox-exec` on macOS.
- **Node built-ins referenced** (union of `node:`-prefixed and bare specifiers):
  `assert, async_hooks, buffer, child_process, console, constants, crypto, diagnostics_channel, dns, events,
  fs, fs/promises, http, http2, https, inspector, module, net, os, path, path/posix, perf_hooks, process,
  querystring, readline, stream, stream/consumers, stream/promises, string_decoder, timers/promises, tls, tty,
  url, util, util/types, vm, worker_threads, zlib`. Most frequent: `path` (269 imports), `fs/promises` (153),
  `crypto` (103), `fs`, `os`, `child_process` (30 + 11 + 7 + 13). There is also `bun:ffi`, used only when
  `typeof Bun` is defined (`dlopen("libc.so.6",{prctl…})`).
- **Bun awareness, even in the Node build:** `function m16(){return process.versions.bun!==void 0}` and
  `function v$(){return typeof Bun<"u"&&Array.isArray(Bun.embeddedFiles)&&Bun.embeddedFiles.length>0}`.
  There are 41 `typeof Bun` guards with Node fallbacks: `Bun.which`, `Bun.hash`, `Bun.stringWidth`,
  `Bun.stripANSI`, `Bun.wrapAnsi`, `Bun.semver`, `Bun.YAML`, `Bun.JSONL`, `Bun.spawn` (ripgrep version probe),
  `Bun.listen`. The 2.1.112 build ran on plain Node ≥18.
- **Shell execution (Bash tool).** It picks a shell from `CLAUDE_CODE_SHELL`, then `$SHELL`, then `which zsh/bash`, then
  `/bin`, `/usr/bin`, `/usr/local/bin` and `/opt/homebrew/bin`. With no shell available it fails hard:
  > `"No suitable shell found. Claude CLI requires a Posix shell environment. Please ensure you have a valid shell installed and the SHELL environment variable set."`

  Each command is a **fresh non-PTY child process**: `spawn(shell, ["-c", "-l"?, cmdString])`, built by
  `getSpawnArgs(A){…return["-c",...O?[]:["-l"],A]}`. `cmdString` is roughly
  `source <shell-snapshot> && … && eval '<cmd>' && pwd -P >| <cwdfile>`. The working directory persists between
  calls through that file, and environment and aliases come from a "shell snapshot" file captured once. It also uses
  `execFile` (az/azd auth), `shell:!0` helpers, `sh -c` process-tree walks, `ps`, `git` (11 direct
  `"git",[` call sites, 18 `rev-parse`), `osascript`, `xdg-open` and `pbcopy`.
  The current native build adds PTY-backed background agents (`Bun.Terminal`) and PowerShell on Windows.
- **TTY / raw mode (Ink).** The interactive UI is React + Ink with a pure-JS Yoga layout (no wasm). It needs
  `process.stdin.setRawMode` (25 references), and Ink throws
  `"Raw mode is not supported on the current process.stdin, which Ink uses as input stream by default."`
  It also listens for `SIGWINCH` and reads `process.stdout.columns`. **Non-interactive mode `-p` and
  `--input-format stream-json --output-format stream-json` (what the Agent SDK uses) needs no TTY.**
- **Local servers:** 30 `createServer` references. These include the OAuth localhost callback server, IDE/MCP websockets and
  a unix-socket proxy (`ANTHROPIC_UNIX_SOCKET`).
- **WebAssembly:** a few `WebAssembly.compile` uses (llhttp-style parser, a small inline wasm helper).
  A tree-sitter Bash parser is referenced for command safety parsing. No yoga wasm.

### 2.3 Hostnames (VERIFIED in cli.js 2.1.112; the same constants are present in 2.1.311)

| Host | Use |
|---|---|
| `api.anthropic.com` | `/v1/messages`, `/v1/sessions`, `/v1/environments`, `/v1/agents`; `/api/oauth/{profile,usage,account/settings,organizations/…,claude_cli/roles,claude_cli/create_api_key,file_upload}`; `/api/claude_code/{settings,policy_limits,team_memory,…}`, `/api/claude_cli/bootstrap`, `/api/hello`, **`/api/event_logging/batch`** (1P telemetry), feature flags (GrowthBook, with `cdn.growthbook.io` only as the library default) |
| `platform.claude.com` | `/oauth/authorize` (Console), **`/v1/oauth/token`**, `/oauth/code/callback` (manual paste redirect), `/oauth/code/success?app=claude-code` |
| `claude.com/cai/oauth/authorize` → `claude.ai` | Pro/Max authorize page; `CLAUDE_AI_ORIGIN:"https://claude.ai"`, `https://claude.ai/oauth/claude-code-client-metadata` |
| `mcp-proxy.anthropic.com` | claude.ai MCP connectors (`/v1/toolbox/shttp/mcp/{server_id}`) |
| `http-intake.logs.us5.datadoghq.com/api/v2/logs` | Datadog operational telemetry (the docs add `browser-intake-us5-datadoghq.com` for error reports from 2.1.198) |
| `downloads.claude.ai`, `storage.googleapis.com/claude-code-dist-…` | native updater (GCS before 2.1.116) |
| `raw.githubusercontent.com`, `registry.npmjs.org`, `github.com` | changelog, plugins, npx MCP servers |
| `oauth2.googleapis.com`, Azure/MSAL endpoints | Vertex/Foundry provider auth (bundled SDKs) |

`statsig` (6 hits) survives only as the legacy cache key names `cachedStatsigGates` and
`checkStatsigFeatureGate_CACHED_MAY_BE_STALE`, and `sentry` (9 hits) appears only in secret-redaction regexes. Neither is a live endpoint.
The official list is at https://code.claude.com/docs/en/network-config#network-access-requirements. VERIFIED.

### 2.4 Env vars of interest (VERIFIED: present in cli.js and in the 2.1.311 binary)

- `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC`. The gate is:
  `function Qu7(){if(process.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC)return"essential-traffic";if(process.env.DISABLE_TELEMETRY)return"no-telemetry";if(S6(process.env.DO_NOT_TRACK))return"no-telemetry";return"default"}`
  It also disables the autoupdater (`j$6()` returns `{type:"env",envVar:"CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC"}`).
- `DISABLE_TELEMETRY`, `DO_NOT_TRACK`, `DISABLE_ERROR_REPORTING`, `DISABLE_AUTOUPDATER`, `DISABLE_UPDATES`,
  `DISABLE_FEEDBACK_COMMAND`, `DISABLE_BUG_COMMAND`, `DISABLE_COST_WARNINGS`, `DISABLE_INSTALLATION_CHECKS`,
  `CLAUDE_CODE_DISABLE_FEEDBACK_SURVEY`, `CLAUDE_CODE_ATTRIBUTION_HEADER` (set falsy to drop the billing/attribution
  line). Per the docs, `DISABLE_TELEMETRY` and NONESSENTIAL also disable feature-flag evaluation. The WebFetch domain
  check (`api.anthropic.com`) is *not* covered by NONESSENTIAL; it has its own `skipWebFetchPreflight` setting.
  Source: https://code.claude.com/docs/en/data-usage#telemetry-services
- `USE_BUILTIN_RIPGREP` (see 2.2), `ANTHROPIC_BASE_URL` (20 refs; a non-`api.anthropic.com` value flips several
  first-party-only behaviors), `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`, `CLAUDE_CODE_OAUTH_TOKEN` (+
  `CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR`), `CLAUDE_CODE_OAUTH_CLIENT_ID`, `CLAUDE_CODE_CUSTOM_OAUTH_URL`
  (restricted: `"…CLAUDE_CODE_CUSTOM_OAUTH_URL is not an approved endpoint."`), `CLAUDE_CODE_SHELL`,
  `CLAUDE_CODE_SHELL_PREFIX`, `CLAUDE_CONFIG_DIR`, `CLAUDE_CODE_TMPDIR`, `CLAUDE_CODE_ENTRYPOINT`.
- `anthropic-dangerous-direct-browser-access`: comes from the bundled `@anthropic-ai/sdk`. It is added when
  `dangerouslyAllowBrowser` is true, and **Claude Code always sets that option**:
  `M={defaultHeaders:H,maxRetries:K,timeout:parseInt(process.env.API_TIMEOUT_MS||String(600000),10),dangerouslyAllowBrowser:!0,fetchOptions:…}` (2.1.112)
  and `ze={defaultHeaders:Ke,maxRetries:r,timeout:…,dangerouslyAllowBrowser:!0,…}` (2.1.311).
- `oauth-2025-04-20` is exported as `OAUTH_BETA_HEADER` (see §3). `setup-token` has 16 references (see §3).

### 2.5 Client-identity mechanisms worth knowing about

- **Attribution / billing line.** It is injected as the first *system-prompt block*, not as an HTTP header:
  `x-anthropic-billing-header: cc_version=<ver>.<hash>; cc_entrypoint=<entrypoint>; cch=00000; …`.
  In 2.1.311 `cch=00000` is emitted for the first-party base URL (`b=n==="firstParty"&&xi()||n==="vertex"?" cch=00000;":""`).
  VERIFIED (string and code). Third-party reverse engineering reports that **Bun's native (Zig) HTTP layer in the
  Anthropic fork rewrites `00000` with a hash of the request body** as client attestation. A JS-only runtime
  would send the literal `00000`. INFERRED. Sources: https://claude-wiki.com/native-attestation.html ,
  https://devday.kr/article/anthropic-claude-code-cch-hash-reverse-engineering . The `cch=00000;` literal also
  appears in the binary's non-JS string region. Whether the server enforces it is unknown.
- **Identity prefix.** The system prompt starts with `"You are Claude Code, Anthropic's official CLI for Claude."`
  (VERIFIED in code). Third-party reverse engineering says OAuth requests whose system prompt lacks one of the identity
  prefixes are rejected. INFERRED (https://minzique.github.io/claude-code-re/research/).
- Headers sent: `x-app: cli`, `User-Agent: claude-cli/<ver> (…)`, `X-Claude-Code-Session-Id`. VERIFIED.
- Anthropic shipped a hidden proxy and gateway fingerprinting experiment in 2.1.91–2.1.196, removed around
  2.1.197/198. INFERRED (press: https://thenextweb.com/news/alibaba-bans-claude-code-anthropic-tracking-chinese-users).
  The point is that Anthropic actively looks at client provenance.

---

## 3. Subscription (Pro/Max) auth mechanics

### 3.1 OAuth config constants (VERIFIED; identical in 2.1.112 and 2.1.311)

```
BASE_API_URL:            https://api.anthropic.com
CONSOLE_AUTHORIZE_URL:   https://platform.claude.com/oauth/authorize
CLAUDE_AI_AUTHORIZE_URL: https://claude.com/cai/oauth/authorize      # Pro/Max/Team/Enterprise
CLAUDE_AI_ORIGIN:        https://claude.ai
TOKEN_URL:               https://platform.claude.com/v1/oauth/token
MANUAL_REDIRECT_URL:     https://platform.claude.com/oauth/code/callback
CLAUDEAI_SUCCESS_URL:    https://platform.claude.com/oauth/code/success?app=claude-code
API_KEY_URL:             https://api.anthropic.com/api/oauth/claude_cli/create_api_key
ROLES_URL:               https://api.anthropic.com/api/oauth/claude_cli/roles
CLIENT_ID:               9d1c250a-e61b-44d9-88ed-5944d1962f5e      # public client, PKCE, no secret
(2.1.311 adds DESIGN_CLIENT_ID: 59637612-477b-4836-a601-b0589eda7704)
MCP_PROXY_URL:           https://mcp-proxy.anthropic.com
```

Overrides exist (`CLAUDE_CODE_OAUTH_CLIENT_ID`, plus `CLAUDE_CODE_CUSTOM_OAUTH_URL` restricted to an allow-list).

### 3.2 Flow (VERIFIED from code)

1. Generate a PKCE verifier and challenge (S256) and a `state`.
2. Build the authorize URL. For Pro/Max it is `https://claude.com/cai/oauth/authorize?code=true&client_id=9d1c…&response_type=code&redirect_uri=<R>&scope=<S>&code_challenge=…&code_challenge_method=S256&state=…[&orgUUID=…][&login_hint=…][&login_method=…]`.
   The code:
   `H.searchParams.append("code","true"),H.searchParams.append("client_id",r7().CLIENT_ID),H.searchParams.append("response_type","code"),H.searchParams.append("redirect_uri",z?r7().MANUAL_REDIRECT_URL:`http://localhost:${_}/callback`);…append("code_challenge",q),…("code_challenge_method","S256"),…("state",K)`
3. The redirect URI `<R>` is **either** `http://localhost:<ephemeral port>/callback`, served by a local `http.createServer`
   that afterwards 302s to the success URL, **or** the **manual mode** `https://platform.claude.com/oauth/code/callback`.
   In manual mode the page shows a code and the user pastes it at `"Paste code here if prompted > "`. The docs say:
   > "If your browser shows a login code instead of redirecting back after you sign in, paste it into the terminal …
   > This happens when the browser can't reach Claude Code's local callback server, which is common in WSL2, SSH sessions, and containers."
   (https://code.claude.com/docs/en/authentication). The pasted value is commonly `code#state`. INFERRED.
4. Token exchange: `POST https://platform.claude.com/v1/oauth/token`, **JSON body**
   `{grant_type:"authorization_code",code,redirect_uri,client_id,code_verifier,state[,expires_in]}`,
   `Content-Type: application/json`.
5. Refresh: `POST` the same URL with `{grant_type:"refresh_token",refresh_token,client_id,scope:<space-joined>[,expires_in]}`.
   The response carries `access_token`, an optional rotated `refresh_token`, `expires_in`, `scope`, and in 2.1.311
   `refresh_token_expires_in`.
6. Scopes. Full claude.ai login requests
   `org:create_api_key user:profile user:inference user:sessions:claude_code user:mcp_servers user:file_upload`.
   2.1.311 also defines `user:plugins`, `user:projects:read` and `user:projects:write`.
   **`setup-token` requests only `user:inference`** with `expires_in: 31536000` (1 year):
   `{loginWithClaudeAi:!0,inferenceOnly:!0,expiresIn:31536000}`.

### 3.3 Headers on API calls with an OAuth token (VERIFIED)

```
OH(){if(i7()){let K=o7();if(!K?.accessToken)return{headers:{},error:"No OAuth token available"};
  return{headers:{Authorization:`Bearer ${K.accessToken}`,"anthropic-beta":eJ}}} …   // eJ = "oauth-2025-04-20"
```

For `/v1/messages` the beta list gets `eJ` pushed when `i7()` (claude.ai subscriber) is true:
`if(i7())K.push(eJ);`. The Anthropic client is built with `authToken` (Bearer) and `apiKey:null`. So the
request carries `Authorization: Bearer <access token>`, `anthropic-beta: oauth-2025-04-20,<other betas>`,
`anthropic-version: 2023-06-01`, `anthropic-dangerous-direct-browser-access: true`, `x-app: cli`,
`User-Agent: claude-cli/…`, and a system prompt beginning with the Claude Code identity line plus the billing line.
Token prefix `sk-ant-oat01-…` for access tokens (and `sk-ant-ort01-` for refresh tokens) is community-documented and
not present as a literal in code. INFERRED.

### 3.4 `claude setup-token` / `CLAUDE_CODE_OAUTH_TOKEN` (VERIFIED: docs and code)

> "generate a one-year OAuth token with `claude setup-token` … It does not save the token anywhere; copy it and set it
> as the `CLAUDE_CODE_OAUTH_TOKEN` environment variable … This token authenticates with your Claude subscription and
> requires a Pro, Max, Team, or Enterprise plan. It can only make model requests, so it can't establish Remote Control
> sessions or fetch claude.ai connectors." (https://code.claude.com/docs/en/authentication#generate-a-long-lived-token)

The code message is: `"Long-lived tokens (from \`claude setup-token\` or CLAUDE_CODE_OAUTH_TOKEN) are limited to inference-only for security reasons."`
Precedence: cloud provider, then `ANTHROPIC_AUTH_TOKEN`, then `ANTHROPIC_API_KEY`, then `apiKeyHelper`,
then **`CLAUDE_CODE_OAUTH_TOKEN`**, then Anthropic profile/WIF, then `/login` OAuth (same page). Bare mode (`--bare`)
ignores `CLAUDE_CODE_OAUTH_TOKEN`.

### 3.5 Credential storage (VERIFIED: docs and code)

- macOS: Keychain (`security find-generic-password -a <user> -w -s <service>`), falling back to `~/.claude/.credentials.json`.
- Linux: `~/.claude/.credentials.json`, mode `0600` (code: `storagePath:pw_(q,".credentials.json")` plus `chmodSync`).
- Windows: `%USERPROFILE%\.claude\.credentials.json`.
- `CLAUDE_CONFIG_DIR` relocates all of it. Account and onboarding state live in `~/.claude.json`, and transcripts in
  `~/.claude/projects/` (plaintext, kept 30 days by default).

---

## 4. Terms of service / policy

### 4.1 The governing text today (VERIFIED: https://code.claude.com/docs/en/legal-and-compliance)

The License section points Free, Pro and Max users to the Consumer Terms, and Team, Enterprise and API users to the
Commercial Terms.

**Authentication and credential use** (added around 2026-02-19 per press):
> "**OAuth authentication** is intended exclusively for purchasers of Claude Free, Pro, Max, Team, and Enterprise
> subscription plans and is designed to support ordinary use of Claude Code and other native Anthropic applications."
>
> "**Developers** building products or services that interact with Claude's capabilities, including those using the
> Agent SDK, should use API key authentication … Anthropic does not permit third-party developers to offer Claude.ai
> login into their own applications, or to route requests through Free, Pro, or Max plan credentials on behalf of
> their users. Moreover, developers may not collect, store, or intermediate Claude.ai credentials or session tokens —
> sign-in to a Claude account must complete through Anthropic's own flow."
>
> "… Nor does it prevent an end user from signing in to the unmodified Claude Code binary with their own Claude
> subscription, including where a platform hosts Claude Code as described under *Can customers offer Claude Code in
> their products?* above."
>
> "Anthropic reserves the right to take measures to enforce these restrictions and may do so without prior notice."

**Can customers offer Claude Code in their products?**
> "preinstalling or running Claude Code in your products or services (e.g. in hosted sandboxes or other agent
> infrastructure) requires agreeing to our Commercial Terms of Service and complying with the conditions below:
> **The Claude Code binary must not be modified.** Claude Code must be installed and run as published by Anthropic,
> and customers may not remove, disable, or restrict any authentication method built into it …
> **Customers may not pay for, resell, or intermediate Claude usage on their end users' behalf.** Each end user must
> authenticate with their own Anthropic API key, Claude subscription plan credentials, or 3P inference provider credential"

It also says Pro/Max "Advertised usage limits … assume ordinary, individual usage of Claude Code and the Agent SDK."

**Help Center** (VERIFIED: https://support.claude.com/en/articles/13189465-log-in-to-your-claude-account):
> "The preferred way to access Anthropic services using third-party software, tools, or services ('third-party
> tools'), including open-source projects, is through API key authentication … Anthropic may at its discretion allow
> paid subscribers who have enabled usage credits to use certain third-party tools to access Anthropic services
> included in paid subscription plans, but reserves the right to draw use of such third-party tools from usage credits
> rather than subscription limits. … Use of third-party tools that misrepresent their identity to Anthropic's servers,
> attempt to route third-party traffic against subscription limits, or otherwise violate applicable terms or policies
> is prohibited and such use may be enforced against."
> Developers: "If you're building a product, application, or tool for others, use API key authentication …"

**Consumer Terms** (effective Oct 8, 2025; VERIFIED: https://www.anthropic.com/legal/consumer-terms), §3:
> "Except when you are accessing our Services via an Anthropic API Key or where we otherwise explicitly permit it, to
> access the Services through automated or non-human means, whether through a bot, script, or otherwise."
> "To decompile, reverse engineer, disassemble, or otherwise reduce our Services to human-readable form, except when
> these restrictions are prohibited by applicable law."
> "… bypassing any of our systems or protective measures."

§2: "You may not share your Account login information, Anthropic API key, or Account credentials with anyone else."
§10: "Other than the rights of access and use expressly granted in our Terms, our Terms do not grant you any right,
title, or interest in or to our Services."

**Commercial Terms** (effective Jun 17, 2025; VERIFIED), D.4:
> "Customer may not and must not attempt to (a) access the Services to build a competing product or service … or
> resell the Services except as expressly approved by Anthropic; (b) reverse engineer or duplicate the Services …"

### 4.2 Timeline

- **2026-01-09.** Anthropic added server-side checks against clients spoofing the Claude Code harness. OpenCode and similar
  tools were cut off from subscription OAuth. Thariq Shihipar (Anthropic) said they had "tightened our safeguards
  against spoofing the Claude Code harness", that third-party harnesses using subscriptions are prohibited by
  the ToS and lack Claude Code's telemetry, and that "the supported way to use Claude in your own tools is via the API".
  Bans caused by the change were lifted. INFERRED from the thread mirror and press:
  https://threadreaderapp.com/thread/2009689809875591565.html ,
  https://venturebeat.com/technology/anthropic-cracks-down-on-unauthorized-claude-usage-by-third-party-harnesses
- **~2026-02-19.** The "Authentication and credential use" section was added to the Claude Code legal page, and OpenCode
  removed its Claude OAuth support. INFERRED (press: https://thenewstack.io/anthropic-claudecode-opencode-split/).
  The current text of that section is VERIFIED (above).
- **2026-04-04, 12pm PT.** Subscription limits stopped covering third-party harnesses, starting with OpenClaw ("applies to
  all third-party harnesses and will be rolled out to more shortly"). Third-party use can instead bill to
  extra usage / usage credits, or use an API key. Boris Cherny: "subscriptions weren't built for the usage patterns of
  these third-party tools." INFERRED from press:
  https://techcrunch.com/2026/04/04/anthropic-says-claude-code-subscribers-will-need-to-pay-extra-for-openclaw-support/ .
  It is consistent with the VERIFIED Help Center text above.
- **2026-06-15 / 2026-10-07.** "Use the Claude Agent SDK with your Claude plan" (VERIFIED:
  https://support.claude.com/en/articles/15036540):
  > "Update October 7, 2026: Claude Max and Team plans now include monthly API credits. They cover the Claude API,
  > Claude Managed Agents, and the Claude Agent SDK and `claude -p` when you run them with an API key from your linked
  > Claude Console organization. Nothing changes for your plan: when you're signed in with your Claude plan, the Claude
  > Agent SDK and `claude -p` still draw from your subscription limits."
  > "Update June 15, 2026: We've paused the previously-announced changes to Claude Agent SDK usage. For now, nothing
  > has changed: Claude Agent SDK, `claude -p`, and third-party app usage still draw from your subscription limits."

### 4.3 Applying this to "Claude Code in a browser on GitHub Pages" (INFERRED analysis, not legal advice)

- **(a) The official client in an unusual environment.** The only explicit permission is for "the unmodified Claude Code
  binary", installed and run "as published by Anthropic". Running the *native binary* under x86 or ARM emulation in the
  browser (CheerpX or v86) is the closest fit to that wording. Running JS extracted from the binary, or the old
  `cli.js`, on a different runtime is "run as published" only for ≤2.1.112, which is ~200 versions stale and
  can be blocked server-side at any time.
- **(b) A third-party or reimplemented harness**, including a patched `cli.js` or a shim that re-signs requests or
  fakes the identity line or `cch`, is squarely "misrepresent their identity to Anthropic's servers". It is prohibited
  and has been actively enforced since January 2026.
- **Hosting the OAuth flow in our web page.** The page would initiate the PKCE flow and hold the token (in memory or in browser
  storage). Since all of this happens in the user's own browser, our server never "collects, stores, or intermediates"
  anything. But the page *is* our application offering Claude.ai login, which the Agent SDK note and the legal text forbid
  ("Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits
  for their products"). The defensible shape is one where the unmodified Claude Code program itself
  performs `/login` (manual code-paste mode) inside the emulated environment, and our page only supplies the terminal.
  Even then, Anthropic's "ordinary use" and enforcement discretion apply.
- **Personal-use framing.** A user running their own copy for themselves is the "individual, ordinary use"
  case. Publishing it as a public tool for others is closer to "building a product … for others".

### 4.4 License of the npm package (VERIFIED)

- `package.json` has `"license": "SEE LICENSE IN README.md"`. `LICENSE.md` (identical in the wrapper, the platform
  packages and the SDK) reads:
  > "© Anthropic PBC. All rights reserved. Use is subject to the Legal Agreements outlined here: https://code.claude.com/docs/en/legal-and-compliance."
- The GitHub repo's `LICENSE.md` (https://raw.githubusercontent.com/anthropics/claude-code/main/LICENSE.md) reads:
  "© Anthropic PBC. All rights reserved. Use is subject to Anthropic's Commercial Terms of Service."
- The README only links to the Commercial Terms and Privacy Policy. **There is no grant to copy, modify or redistribute.** The vendored
  ripgrep is Unlicense/MIT and sharp is Apache-2.0, but those cover only their own parts.
- **(a) Fetch the unmodified package at runtime from npm or a CDN in the user's browser.** The user obtains it from the
  official channel just as `npm install` would, so no redistribution by us. This is the safer pattern (INFERRED),
  and the transport works: the registry, jsDelivr and unpkg all return `ACAO: *`, VERIFIED for HEAD. The platform
  binary tarball is ~132 MB compressed and ~294 MB unpacked. CDNs that serve single files probably won't serve a file
  that large (INFERRED, not tested), so the registry tarball is the realistic source.
- **(b) Bundle, copy or patch `cli.js` or the binary into our own build and GitHub Pages deploy.** That is redistribution
  and possibly modification of "All rights reserved" software. It is not permitted without a license and conflicts with
  "The Claude Code binary must not be modified." INFERRED, but strongly supported by the text.

---

## 5. Agent SDK (`@anthropic-ai/claude-agent-sdk@0.3.311`) — VERIFIED

The main entry (`sdk.mjs`) always runs Claude Code **as a subprocess**. It spawns the native binary from
`@anthropic-ai/claude-agent-sdk-<platform>` (or `pathToClaudeCodeExecutable`) with
`["--output-format","stream-json","--verbose","--input-format","stream-json", …]` and talks newline-delimited JSON
over stdin and stdout. The docs say the same: "A library that runs the Claude Code binary"
(https://code.claude.com/docs/en/agent-sdk/overview).

There are two hooks for exotic hosts. `executable?: 'bun'|'deno'|'node'` was for the old JS CLI.
`spawnClaudeCodeProcess?: (options: SpawnOptions) => SpawnedProcess` is documented as
"Use this to run Claude Code in VMs, containers, or remote environments". It needs only `stdin`/`stdout` streams,
`kill`, and `exit`/`error` events, so an emulator-backed process could satisfy it in principle.

There *is* a `./browser` export (`browser-sdk.js`, 909 KB), but it is **not an in-browser harness**. It is a client for
a remote Claude Code session. It takes `sse: {streamUrl: "…/v1/code/sessions/{id}/events/stream", sendUrl: "…/v1/code/sessions/{id}/events", sessionId, headers}`
or a `websocket` URL, and "the remote CLI" does the work. This is the transport claude.ai uses for cloud or "CCR" sessions,
and it contains no `child_process`. A companion `./bridge` export lets a local CLI host register as a worker for
claude.ai. Neither supplies tools, a filesystem or a shell in the browser. Last, `./extract` (`extractFromBunfs`) only
helps `bun build --compile` apps unpack the embedded binary to a temp dir.
Policy note from the overview: "Unless previously approved, Anthropic does not allow third party developers to offer
claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK."

---

## 6. Implications for running it in a browser

### 6.1 Which artifact you would actually run

| Option | What it is | Runtime needed | Notes |
|---|---|---|---|
| **A. Native binary, current** (2.1.311, ~294 MB ELF) | Bun 1.4.4 fork + JS + embedded rg | x86-64 or arm64 **Linux userland emulation** (glibc or musl variant), e.g. CheerpX or v86 | Closest to "unmodified binary as published". Very heavy: 132 MB download, ~294 MB on disk, 4 GB RAM recommended, and JIT under emulation will be slow. The musl build (287 MB) may suit a small Alpine image. |
| **B. `cli.js` 2.1.112** (13.7 MB JS) | Last Node-runnable build | A Node-compatible JS runtime (WebContainers-like) | Frozen at April 2026: stale models, features and fixes, and Anthropic can block old versions. No Bun native layer, so `cch` stays `00000` (INFERRED risk). |
| **C. JS extracted from the current binary** | Plaintext chunks in `$bunfs` | Bun **fork** APIs (`Bun.ant.*`, `Bun.Terminal`, `Bun.spawn`) | Requires shimming private APIs, which is modification. Breaks the "unmodified" carve-out. Not recommended. |
| **D. Reimplemented harness** | Own agent loop | n/a | Prohibited for subscription OAuth (misrepresenting identity). API key only. |

### 6.2 OS and runtime facilities the harness needs (from 2.1.112 code and 2.1.311 strings)

1. **Terminal.** A raw-mode TTY (`process.stdin.setRawMode`, `isTTY`, `columns`/`rows`, `SIGWINCH`) for the
   Ink TUI, with ANSI/VT100 rendering (xterm.js would do). Background agents in the native build use a **real PTY**
   (`Bun.Terminal`, `login_tty`). Headless `-p` / stream-json mode needs only pipes.
2. **Process spawning and a POSIX shell.** `child_process.spawn/execFile/spawnSync` and a working **bash or zsh**, which
   is mandatory for the Bash tool ("No suitable shell found … requires a Posix shell"). Each command is a fresh
   `bash -c -l "<snapshot>; eval …; pwd -P >| <file>"` process. It also needs `sh`, `ps`, `which` and coreutils, and
   process-group kill (`detached`, signals).
3. **ripgrep.** Grep, Glob and file discovery shell out to `rg`: embedded in the native binary (exec of `process.execPath` with
   `argv0:"rg"`), vendored per platform in `cli.js` builds, or system `rg` with `USE_BUILTIN_RIPGREP=0`. A browser
   port needs a working `rg` executable, or Glob/Grep break.
4. **git.** About 11 direct `git` invocations (`rev-parse`, status, diff, worktrees, commit attribution). Most tool
   flows assume `git` on PATH.
5. **Filesystem.** A full POSIX FS via `fs` + `fs/promises`: stat, realpath, symlinks, chmod `0600`, `mkdtemp`,
   rename, `fs.watch`. It writes to `~/.claude/` (settings, `.credentials.json`, `projects/` transcripts, shell
   snapshots, plugins), `~/.claude.json`, project `.claude/`, and `$TMPDIR/claude-<uid>`. It needs a persistent `HOME`
   (IndexedDB or OPFS backing) to keep login and history.
6. **Network.** Outbound HTTPS with **streaming SSE** to `api.anthropic.com` (fetch, `http`/`https`/`http2`, `tls`,
   `zlib`/gzip request bodies), `platform.claude.com` (token and refresh), `mcp-proxy.anthropic.com`, Datadog (optional),
   and `registry.npmjs.org`/`github.com` (plugins and MCP). Also WebSocket clients (voice, IDE, bridge), `dns`,
   proxy env (`HTTPS_PROXY`), and CA handling (`tls.getCACertificates`, `NODE_EXTRA_CA_CERTS`). Inside an emulator
   all of this needs a socket-to-fetch/WebSocket bridge, plus CORS on each host. The CORS work is covered in another report.
7. **Local listeners.** An `http.createServer` on localhost for the OAuth callback. This is avoidable with manual code-paste
   (`MANUAL_REDIRECT_URL`). There are also unix sockets / `net.listen` for IDE integration, the background-agent supervisor
   and `ANTHROPIC_UNIX_SOCKET`.
8. **Native addons, all optional.** `sharp` (images; a wasm32 fallback path exists), `audio-capture.node` (voice),
   darwin-only `modifiers.node` and `computer_use.node`, plus `bwrap`/`socat`/`apply-seccomp` and `sandbox-exec` for the
   sandbox, which can be disabled.
9. **OS integration, best-effort.** Clipboard (`pbcopy`/xclip), `xdg-open`/`open` to launch the browser, `osascript`,
   macOS Keychain (`security`), `process.getuid`, `os.homedir`, signals.
10. **Runtime APIs.** Node ≥18 for `cli.js`. For the current build, Bun-fork-only APIs (`Bun.ant.CellSegmenter` etc.),
    `worker_threads`, `WebAssembly`, `async_hooks`, `vm`, `crypto` (PKCE SHA-256, randomBytes).
11. **Memory and CPU.** The 13.7 MB minified bundle (or the 294 MB binary) at startup. The docs list "4 GB+ RAM".
12. **Auth flow constraints for a static page.** The authorize page must be opened in a real browser tab, and the
    user pastes the code back (manual mode). The token POST to `platform.claude.com/v1/oauth/token` and every
    `api.anthropic.com` call must succeed cross-origin from `*.github.io`. That is CORS, untested here. Claude Code's
    requests already include `anthropic-dangerous-direct-browser-access: true`.

### 6.3 Bottom line (INFERRED)

The only "official client" path that stays within the written carve-out is running the **unmodified native Linux
binary inside a full x86-64/arm64 Linux emulator in the page**, with bash, coreutils, git and a network bridge, and
having the user log in through Claude Code's own manual-paste OAuth. That path is heavy: ~132 MB compressed
download and a JIT-heavy Bun runtime under emulation. Every lighter path (old `cli.js` in a JS runtime, extracted or
patched JS, a reimplementation) either freezes the version at 2.1.112 or modifies or re-hosts Anthropic's
proprietary code. With subscription OAuth, those paths run into the "unmodified binary" and "misrepresent identity"
rules that Anthropic has enforced since January 2026.

---

## Sources

Primary:
- npm registry: https://registry.npmjs.org/@anthropic-ai/claude-code , https://registry.npmjs.org/@anthropic-ai/claude-agent-sdk (`npm view`, `npm pack`)
- https://code.claude.com/docs/en/setup
- https://code.claude.com/docs/en/authentication
- https://code.claude.com/docs/en/legal-and-compliance
- https://code.claude.com/docs/en/network-config
- https://code.claude.com/docs/en/data-usage
- https://code.claude.com/docs/en/agent-sdk/overview
- https://www.anthropic.com/legal/consumer-terms (effective 2025-10-08)
- https://www.anthropic.com/legal/commercial-terms (effective 2025-06-17)
- https://support.claude.com/en/articles/13189465-log-in-to-your-claude-account
- https://support.claude.com/en/articles/15036540
- https://raw.githubusercontent.com/anthropics/claude-code/main/LICENSE.md

Secondary (INFERRED items):
- https://threadreaderapp.com/thread/2009689809875591565.html (Thariq, 2026-01-09)
- https://venturebeat.com/technology/anthropic-cracks-down-on-unauthorized-claude-usage-by-third-party-harnesses
- https://thenewstack.io/anthropic-claudecode-opencode-split/
- https://techcrunch.com/2026/04/04/anthropic-says-claude-code-subscribers-will-need-to-pay-extra-for-openclaw-support/
- https://bleepingcomputer.com/news/artificial-intelligence/claude-code-source-code-accidentally-leaked-in-npm-package
- https://infoq.com/news/2026/04/claude-code-source-leak
- https://thenextweb.com/news/alibaba-bans-claude-code-anthropic-tracking-chinese-users
- https://minzique.github.io/claude-code-re/research/
- https://claude-wiki.com/native-attestation.html
- https://devday.kr/article/anthropic-claude-code-cch-hash-reverse-engineering
