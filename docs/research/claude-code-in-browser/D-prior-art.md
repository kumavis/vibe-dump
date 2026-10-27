# D: Prior art and lessons learned: running Claude Code (or similar agent CLIs) in the browser

Research slice D of the feasibility study "run the Claude Code harness client-side in a browser, as a static GitHub Pages app, against a Pro/Max subscription".
Compiled 2026-10-27.

**Legend**
- **VERIFIED**: I read the primary source (repo code, commit, Makefile, changelog, maintainer post) myself.
- **INFERRED**: comes from secondary reporting, search summaries, or my own reasoning from partial evidence.
- "CC" means Claude Code.

---

## 0. Executive summary

1. **People have already run the real Claude Code in a browser tab, client-side.** The serious example is **BrowserCode** (Leaning Technologies, built on BrowserPod): Claude Code, Codex CLI and Pi run in a WebAssembly "pod" with real bash, git, rg and Node 22. Login is a pasted OAuth code against your Claude account. It is **not** dependency-free, though:
   - All outbound traffic goes through BrowserPod's Cloudflare-Worker egress proxy, which only allows listed hosts.
   - It needs a BrowserPod API key.
   - It needs WebAssembly JSPI (Chrome/Edge 137+, Firefox 153+, Safari 27+; no iOS).
   - Its Claude disk image has been pinned since 2026-05-06.
2. **Projects built on WebContainers or almostnode also boot Claude Code, but all are frozen at `@anthropic-ai/claude-code@2.1.112`.** Since **v2.1.113 (April 2026)** the npm package ships a Bun-compiled native binary and no `cli.js`. An Anthropic engineer (ant-kurt) said in April 2026 that they are "not planning to keep the (deprecated since January) JS build around." This is the biggest structural fact for this project.
3. **The only proven way to run *current* Claude Code JS outside Anthropic's Bun is the FreeBSD port `misc/claude-code` (2.1.310).**
   - It extracts the JS from the Bun binary with `unhare`.
   - It runs the JS on stock **Node 24**, using a Bun-API polyfill of 1,238 lines plus clawgod's 429-line `Bun.ant.CellSegmenter` shim.
   - It needs four `sed` rewrites and two patches matched by code shape.
   - It works, but it breaks often: 2.1.251 added zstd, 2.1.271 added CellSegmenter, and 2.1.282 broke on `import.meta.dir`. This is the closest template for a browser port of current Claude Code.
4. **The network is the wall, not the CPU.**
   - Every precedent that completed real API turns used a server-side relay: a Cloudflare Worker or Pages function, the BrowserPod egress proxy, a configurable CORS proxy, or a Tailscale-in-WASM exit node.
   - The one purely static GitHub Pages precedent (reagent-systems) reached the Claude Code welcome screen. Its own notes say provider APIs "may still hit CORS".
5. **Projects converged on the same patterns independently:**
   - Rewrite the OAuth `redirect_uri` to Anthropic's manual "paste code" page, because a localhost callback cannot work in a browser.
   - Render the real Ink TUI in xterm.js; it works.
   - Get COOP/COEP isolation, via headers or `coi-serviceworker` on GitHub Pages.
   - Ship a `CLAUDE.md` that tells the agent it is in a strange environment.
   - Pin the CLI version and set `DISABLE_AUTOUPDATER=1`.

---

## 1. Claude Code itself in in-browser runtimes (priority 1)

### 1.1 BrowserCode / BrowserPod (Leaning Technologies): the strongest precedent
- **Links:** https://github.com/leaningtech/browsercode · https://browsercode.io/agents/claude · https://labs.leaningtech.com/blog/browserpod-deep-dive · https://browserpod.io/blog/announcing-browsercode/ · HN Show HN https://news.ycombinator.com/item?id=48049713 · Gemini-first preview HN https://news.ycombinator.com/item?id=47974906
- **Dates:**
  - Claude support was added 2026-05-05 (commit `22e7262`) and the image bumped 2026-05-06 (`14f8ab3`, Alessandro Pignotti).
  - BrowserPod deep dive: 2026-05-18.
  - Codex added 2026-08-12. Gemini CLI dropped 2026-08-07. Pi added 2026-10-07.
  - Release 1.3.0 announced 2026-10-26.
  - VERIFIED from git history.
- **What runs and where:** VERIFIED from `src/lib/config/tools.ts`.
  - The disk image `wss://disks.browserpod.io/claude_20260506.ext2` is streamed block by block and cached in OPFS or IndexedDB.
  - The launch command is `node /home/user/claude-extracted/src/entrypoints/cli.js`.
  - Before 2026-05-06 the launch was `npm run claude` on image `claude_20260428`.
  - The folder name `claude-extracted` and its `src/entrypoints/` layout suggest JS extracted from the post-2.1.113 Bun binary, around v2.1.12x–13x. INFERRED: the image contents are not public.
  - The README calls it an "unmodified version of Claude Code" and "Account authentication or API key required".
- **Runtime model:** VERIFIED from the deep-dive post.
  - Node is "modified to run JavaScript payloads on the underlying browser JavaScript engine". It is not V8 compiled to Wasm.
  - A Linux-like kernel compiled to Wasm runs in every Web Worker. Each process or thread is a Worker.
  - The filesystem is ext2.
  - bash, git, npm, pnpm, rg, fd, curl, python3 (stdlib only) are compiled to Wasm.
  - `timeout` is broken.
- **Network:** VERIFIED from the shipped `CLAUDE.md` and the deep dive.
  - Outbound traffic is "proxied through BrowserPod infrastructure" (Cloudflare Workers): HTTPS port 443 only, allowlisted hosts only.
  - The allowlist covers npm, Yarn 2+, github.com, raw.githubusercontent.com and "major AI provider APIs". It does **not** cover api.github.com or codeload.
  - Loopback does not work.
  - Inbound traffic goes through "Portals", which are public random URLs routed to in-pod ports.
  - Remote MCP servers fail with DNS errors. Maintainer alexp-sssup replied on 2026-06-25: "there is indeed a strict whitelist", to be expandable with "BrowserPod Pro" (issue #15).
- **Auth:** VERIFIED.
  - An `openCallback` hook rewrites Claude Code's `https://claude.com/cai/oauth/authorize…redirect_uri=http://localhost:0` to `https://platform.claude.com/oauth/code`.
  - The user copies the code back into the TUI's "Paste code here" prompt.
- **Requirements:** VERIFIED.
  - COOP/COEP (`static/_headers`).
  - JSPI: Chrome/Edge 137+, Firefox 153+, Safari 27+; iOS is blocked.
  - A BrowserPod API key (`VITE_API_KEY`). The free tier allows up to 1,000 compute hours a month for non-commercial use.
- **Performance:**
  - The vendor gives no Claude Code numbers.
  - An independent HN commenter (johndough, thread 47314161) measured BrowserPod Node fib(35) at **60 ms vs 65 ms native Node**. CPU-bound JS runs at about native speed, because it runs on the browser's JS engine.
  - Boot is "near-instant" (vendor claim).
- **Known rough edges:**
  - The agent "may first attempt its default behavior before referencing" the injected `CLAUDE.md`.
  - Native npm deps fail. The shipped `CLAUDE.md` contains a substitution table: esbuild-wasm, @rollup/wasm-node, @parcel/watcher-wasm, @next/swc-wasm-nodejs, rolldown/oxc wasm32-wasi bindings, and no Turbopack.
- **Lesson for us:** a "real kernel plus real bash/rg/git in Wasm" approach can run current-era Claude Code with subscription login. Even this best-funded example still relies on a hosted egress proxy and an unchanging disk image, and has not kept up with Claude Code releases (May 2026 image versus 2.1.311 today).

### 1.2 agent-wasm / almostnode fork (Brett Lamy): Claude Code on Node-API shims (no Wasm Node)
- **Links:** https://github.com/BLamy/almostnode (repo renamed "agent-wasm"); upstream runtime https://github.com/macaly/almostnode
- **Date:** v0.2.15 on 2026-06-09. The Claude Code pin was bumped to 2.1.112 after 2.1.198 existed (around Aug 2026). Last commit 2026-09-08. VERIFIED.
- **What runs:** VERIFIED from `packages/almostnode/src/shims/child_process.ts` and `CHANGELOG.md`.
  - A `claude-wrapper` shell command runs `npx --yes @anthropic-ai/claude-code@2.1.112`, raised from 2.1.52, with `CLAUDE_CODE_NO_FLICKER=1`.
  - The runtime is almostnode: 40+ Node modules re-implemented in JS over an in-memory VFS, with just-bash as the shell and esbuild-wasm for transforms.
  - The shims total about **48k lines**; `child_process.ts` alone is 8,204 lines.
  - An e2e test only checks that `npx @anthropic-ai/claude-code --version` boots.
- **Why it stops at 2.1.112:** VERIFIED code comment. 2.1.113+ "ship `bin/claude.exe`… a Bun `--compile` Mach-O/ELF/PE executable… can't execute in this WASM sandbox regardless of shimming… Bump past this only once a JS/WASM-runnable distribution exists again."
- **UI tricks:** VERIFIED.
  - A chat UI stays in sync with the TUI "via transcript tailing [~/.claude/projects/*.jsonl] + bracketed-paste stdin injection".
  - An MCP-style IDE bridge.
  - Fixes they needed:
    - "raw-mode init used to flush queued stdin", so the first message was lost.
    - Child-process output had to be buffered, because "Streaming interleaves with Claude Code's UI rendering and garbles output".
- **Network:** VERIFIED from `network/policy.ts` and the web-ide readme.
  - A per-tab configurable `corsProxy` (stored in localStorage `__corsProxyUrl`), or a **Tailscale Connect Go-WASM client** that routes public traffic through the user's own tailnet exit node.
  - Dev builds use a local Vite CORS proxy plus a WebSocket relay.
- **Auth:** VERIFIED. Credential files live in the VFS inside a passkey-encrypted "keychain" vault. OAuth popups are relayed through `/oauth/callback` using both `postMessage` and `BroadcastChannel`.
- **Lesson for us:** a pure-JS Node-shim runtime with no Wasm kernel can host the 2.1.112 `cli.js`. Expect to write a large child_process/tty shim. Network still needs a user-supplied proxy, or Tailscale as a user-owned proxy.

### 1.3 claude-co.de (Brett Lamy, 2025): WebContainers with StackBlitz's internal CORS-proxy API
- **Link:** https://github.com/BLamy/claude-co.de (a bolt.new fork). Commits from 2025-05-02 to 2025-07-18; "add cors proxy" 2025-05-24; "login with claude-code" 2025-05-28. VERIFIED.
- **What ran:** VERIFIED from `app/lib/stores/terminal.ts`.
  - `npx -y @anthropic-ai/claude-code@1.0.56`, spawned inside WebContainers' `jsh`.
  - It used **`@webcontainer/api@1.6.1-internal.1`** for `webcontainer.internal.setCORSProxy(...)` and `setCORSAuthToken(...)`.
  - These route Node's outbound HTTP to a proxy at `${origin}/api`.
- **The proxy:** a Remix/Cloudflare Pages route (`app/routes/$.ts`).
  - It reads `x-stackblitz-host` and forwards the request.
  - It checks a hard-coded token `'1234567890'`.
  - It strips origin/referer and `x-stackblitz-*` headers. VERIFIED.
- **Auth automation:** VERIFIED from `LoginPage.tsx`.
  1. Boot Claude Code in a hidden xterm and scrape the login URL from the TUI output.
  2. The user pastes the code.
  3. The app sends Enter keypresses, then Ctrl+C.
  4. It runs `cat /home/.claude.json` to read `oauthAccount`.
  - Git used isomorphic-git with `https://cors.isomorphic-git.org`.
- **Perf / what broke:** not documented.
- **Lesson for us:** WebContainers can host 1.x Claude Code, but only with a non-public "internal" API build plus a CORS relay, and with TUI scraping for login.

### 1.4 WebCode / webcode.sh (wordbricks, July 2025): WebContainers
- **Links:** https://github.com/wordbricks/webcode · HN https://news.ycombinator.com/item?id=44731669 (2025-07-30)
- **What ran:** VERIFIED.
  - `@anthropic-ai/claude-code: "latest"` (around 1.0.6x then) from a `~/.global` template, aliased in `.jshrc`.
  - git is isomorphic-git run through `tsx`.
  - It **self-hosted StackBlitz's WebContainer runtime bundle**: `window.WEBCONTAINER_API_IFRAME_URL = location.origin`, plus the vendored files `webcontainer.96435430.js`, `fs_bg…wasm` and `internal_bindings_bg…wasm`. This is probably outside WebContainer's license (INFERRED).
- **Proxy:** VERIFIED from a Cloudflare Worker at `/api/v1/cors/proxy/*`.
  - For `api.anthropic.com…messages` it strips forwarding headers and **sets `user-agent: "claude-cli (external, cli)"`**.
  - On `api.anthropic.com/api/oauth/profile` it **posts the user's full name and email to a Slack webhook**.
- **Auth:** VERIFIED. It hooks the WebContainer `xdg-open` event and rewrites `redirect_uri` to `https://console.anthropic.com/oauth/code/callback` (manual code paste).
- **Perf / breakage:** the author said "Loading takes around 10–15 seconds". The first user saw "command not found: claude" during that load.
- **Lesson for us (anti-pattern):** a proxy you do not control sees OAuth tokens and identity, so it is a trust and ToS liability. User-agent spoofing is a red flag. Design the network path so the user owns it.

### 1.5 reagent-systems / clientside-containers (Aug 2026): WebContainers on static GitHub Pages
- **Links:** https://github.com/reagent-systems/clientside-containers · devlog `docs/devlog/2026-08-27-webcontainer-clis.md` · live https://thyfriendlyfox.github.io/clientside-containers/
- **What ran:** VERIFIED.
  - `npm install @anthropic-ai/claude-code@2.1.112`, then `node …/cli.js`, rendered in xterm.js.
  - Also `@google/gemini-cli@0.57.0`, `bundle/gemini.js`.
  - Optional native addons (sharp, node-pty) were omitted.
  - Isolation on GitHub Pages came from `public/coi-serviceworker.js`.
- **Result:** it prints "Welcome to Claude Code v2.1.112".
  - "A dummy key fails on api.anthropic.com with an honest network error… A real key continues into the real REPL." The real-key result is claimed, not shown.
  - The project's own limits section says: "Provider APIs may still hit CORS from the browser."
  - It is built by an "autonomous daily loop" (AI-generated), so treat its claims as weak.
- **Lesson for us:** this is the exact deployment shape we want (static GitHub Pages plus coi-serviceworker plus an in-browser Node runtime), and it gets as far as the TUI. Nobody has shown a full API round-trip without a relay.

### 1.6 The best evidence for *current* Claude Code comes from ports to unusual native platforms (not browsers)

| Project | What | Key facts | Status |
|---|---|---|---|
| **FreeBSD `misc/claude-code` 2.1.310** (maintainer yuri@) https://github.com/freebsd/freebsd-ports/tree/main/misc/claude-code | Extracts JS from the `claude-code-linux-x64` npm tarball using `archivers/unhare` (https://github.com/UnitedMarsupials/unhare). Runs on `node24` with `--require bun-polyfill.cjs`. | The polyfill (1,238 lines) implements `Bun.stringWidth/stripANSI/wrapAnsi/sliceAnsi/sleepSync/hash/spawn/which/file/write/serve/connect/listen/deepEquals/semver/YAML/TOML/JSONL/Transpiler(stub)/Terminal(stub)/zstdDecompress[Sync]`, plus `localStorage` backed by a file. `Bun.ant.CellSegmenter` (required since **2.1.271** by the Ink renderer: "throws before the first frame") comes from clawgod's 429-line `Intl.Segmenter` shim. `post-extract` (11 KB) rewrites `/$bunfs/root/` to an install dir, `import.meta.require` to a global (65 of about **1,770 chunks**), and `import.meta.dir` to `.dirname` (whose absence made 2.1.282 die on startup). It also forces off the **embedded ugrep/bfs "shell-search-tools" gate**: otherwise CC re-execs `process.execPath` as `ugrep`/`bfs`, which is now node, so grep and find break and Grep/Glob are hidden. It forces the builtin-plugin loader to use bundled modules (`Bun.isStandaloneExecutable` is false) and makes the entry point import the polyfill itself, because CC **relaunches itself** (`[process.execPath, argv[1]]`) for remote-control, the bg PTY host and the self-hosted runner. Native `.node` addons are excluded (clipboard, audio); `Bun.Image` is optional; `hooks-worker` needs a global `Worker`. The wrapper sets `USE_BUILTIN_RIPGREP=false`, `DISABLE_AUTOUPDATER=1` and `SHELL=bash`. | VERIFIED (Makefile, `files/bun-polyfill.cjs`, `files/claude.in`, `scripts/post-extract`) |
| **clawgod** https://github.com/0Chencc/clawgod | Re-extracts the user's native binary on each upgrade and runs the patched JS on **stock Bun**. Runs daily compatibility CI. | The source of the CellSegmenter shim. **Also patches entitlement, safety and telemetry**, which violates the ToS; cite it only as technical evidence. | VERIFIED (README, shim) |
| FreeBSD forum script (ZioMario, 2026-07-21) https://forums.freebsd.org/threads/…103339/ | A Python scan for the `// @bun @bytecode @bun-cjs` header and `cli.js`, then `eval` under FreeBSD-native Bun. | Froze after a while for one tester. | VERIFIED (forum) |
| Termux/Android #50270 https://github.com/anthropics/claude-code/issues/50270 | Pin 2.1.112 and run `node cli.js`. | The auto-updater re-upgraded within seconds, so a `chmod -R a-w` was needed. **proot-distro works but "too slow for interactive use because of filesystem I/O overhead."** | VERIFIED (issue) |
| genose esbuild fork (#55520 comments) | Node build from the 2.1.88 leaked source. | "frozen at v2.1.88"; a commenter called it pointless. | INFERRED (second-hand) |

**Lesson for us:**
- The current Claude Code bundle is close to runnable on a non-Bun JS engine; the evidence is about 1.7k lines of polyfill.
- The hard parts are about process identity and multi-call design: self-respawn via `process.execPath`, the embedded ugrep/bfs, and `$bunfs` paths. Plain Node API gaps are the easier part.
- A browser has something native Node lacks here: a global `Worker`.

### 1.7 Searched for but not found
- No report of Claude Code running under **CheerpX/WebVM, v86, JSLinux, container2wasm, or CodeSandbox Nodebox**.
- HN thread 47314161 (JSLinux x86_64, around Mar 2026) has the relevant performance anecdotes:
  - simonw wants agents running against browser VMs; his v86 demo loads 12.7 MB and boots in 10–30 s.
  - the_mitsuhiko found container2wasm "performance to be enough of an issue".
  - johndough measured WebVM (x86 JIT) Python fib(30) at about **20× slower** than native and NumPy matmul about **2500× slower**, versus BrowserPod at about native speed.
  - VERIFIED via HN.
- **Lesson for us:** do not run the Bun ELF under x86 emulation. Run the JS on the browser's own engine.

---

## 2. Comparable agent CLIs run in the browser (priority 2)

| CLI | Who / where | How | Worked / broke | Status |
|---|---|---|---|---|
| **Codex CLI** (Rust, about 1.25M lines) | BrowserPod (Yuri Iozzelli, blog 2026-08-13, https://labs.leaningtech.com/blog/browserpod-rust; Show HN 49362139) | Custom target `wasm32-browserpod-linux-musl`. "disabled some sandboxing options"; otherwise unchanged. | Works. Needs an **OpenAI API key**: "ChatGPT sign-in isn't available here" (BrowserCode `tools.ts`). | VERIFIED |
| **Codex CLI** | agent-wasm `docs/codex-cli-browser.md` | A single-commit fork of `rust-v0.145.0` for `wasm32-unknown-unknown`, with a wasm `ratatui` renderer and a wasm-bindgen adapter. A host bridge handles auth, VFS, streamed fetch and process spawn. | CLI and app-server work. **No rollout files, so `codex resume` is impossible**; they replay transcripts instead. | VERIFIED |
| **Gemini CLI** | BrowserCode first preview (around Apr 2026); dropped 2026-08-07. reagent-systems on WebContainers pinned to `@google/gemini-cli@0.57.0`. | Node bundle `bundle/gemini.js`. | Booted. BrowserCode dropped it (reason not stated; Antigravity is now listed instead). | VERIFIED |
| **Pi** (earendil-works/pi, formerly badlogic/pi-mono) | BrowserCode (2026-10-07) | `npm install` on first launch, then Node. | Works. Anthropic login via "Copy code login (headless)" because the localhost callback fails. Note that using a subscription in a third-party harness is what the Feb 2026 terms prohibit. | VERIFIED |
| **OpenCode** | agent-wasm (vendored browser build, OpenTUI compiled to wasm32-freestanding); adyoi/opencode-wasm | Browser SDK shim and an in-browser server `/event` stream. | Works in agent-wasm. BrowserCode lists it as "coming soon". | agent-wasm VERIFIED; opencode-wasm INFERRED |
| Aider, Goose, Cline/Roo, Amp, Crush | — | — | No client-side browser runs found. | — |
| WebVM + Claude (Pignotti, 2025-03-17) https://labs.leaningtech.com/blog/webvm-claude | A hand-written agent loop **in browser JS**: Anthropic SDK with `dangerouslyAllowBrowser` and a user's API key, driving a CheerpX x86 VM. | The bash tool injects commands as user input and uses a "# End of AI command" sentinel. | It "cannot exit vim" because it can't see terminal state, and the VM is "obviously slower". | VERIFIED |
| len4m browser-agent-v86-poc (2026-05-24) | v86 plus Transformers.js/Ollama | Local models only. | One vCPU, slow network. | VERIFIED |

**Lesson for us:** Rust CLIs port to Wasm with few changes. Node CLIs run either on a Node-API shim or on a Wasm kernel. In every case the vendor's own consumer sign-in (ChatGPT or Claude.ai) is the hard part, and code-paste OAuth is the workaround everyone used.

---

## 3. "Claude Code in the browser" products that are server-backed, NOT client-side (priority 3)

| Project | One line | How the UI talks to Claude Code |
|---|---|---|
| **claude.ai/code** (Anthropic cloud sessions) | Claude Code runs in Anthropic-managed VMs or in your **self-hosted environment / `claude self-hosted-runner`**; the browser is only a client. | A structured session stream with Remote Control infrastructure; no TUI. `--cloud`, `--teleport` and `--remote-control` exist (VERIFIED, docs). |
| **Remote Control** (`claude --remote-control`) | A local CLI steered from claude.ai or the mobile app. | Structured; the changelog mentions an `--sdk-url` flag (VERIFIED). |
| **Claude Code VS Code extension and desktop app** | Local CLI; the webview renders SDK events. | Agent SDK / stream-json. Issue #104108: the webview crashes in browser VS Code (`code serve-web`), but the extension host is still server-side. |
| **Claude in Chrome / Cowork side panel** | An MV3 extension. Community analysis says the agent loop runs in the side panel using the Anthropic JS SDK. Now presented as a Cowork session. | INFERRED (gist by sshh12; official docs give no architecture). This is a precedent for Anthropic itself running an agent loop in a browser context against a subscription. |
| **siteboon/claudecodeui ("CloudCLI")** | Express, ws and node-pty server using `@anthropic-ai/claude-agent-sdk ^0.3.165`. | SDK (structured) plus an xterm.js shell tab. VERIFIED (package.json). |
| **sugyan/claude-code-webui** (archived) | Hono/Deno backend using the `@anthropic-ai/claude-code@1.0.108` SDK. | SDK stream-json into a chat UI. VERIFIED. |
| **vultuk/claude-code-web** | `npx claude-code-web`: node-pty plus WebSocket into xterm.js. | Raw PTY bytes. VERIFIED. |
| **cheneeheng claude-code-html-wrapper** (2026-06-16) | Docker per user, `docker exec` through node-pty to xterm.js. Lists sessions from Claude Code's own JSONL transcripts. | Raw PTY. VERIFIED (blog). |
| **Happy (slopus/happy)** | Wraps local Claude Code/Codex; E2E-encrypted relay to mobile and web. | Structured relay. VERIFIED (README). |
| Vibe Kanban, Conductor, opcode/Claudia | Local orchestrators or desktop apps that spawn the CLI. | INFERRED (from my knowledge; not re-checked). |
| bolt.new v2 | StackBlitz adopted the **Claude Agent SDK** (server-side) for Bolt's agent. WebContainers is only the preview/runtime. | INFERRED (Anthropic customer page via search summary). |

**What to take from them:**
1. Every rich web UI uses the structured protocol (Agent SDK, `-p --output-format stream-json`, or tailing JSONL transcripts) rather than parsing the TUI. For a browser host, consider running Claude Code in its headless mode and drawing our own UI, keeping xterm.js as a fallback.
2. Anthropic's own "Claude Code in the browser" puts execution in a VM or on your own runner. "Self-hosted environments" is the sanctioned fallback if client-side fails.

---

## 4. Other large Node tools and building blocks run in-browser (priority 4)

- **WebContainers (StackBlitz):**
  - Requires COOP/COEP and allows one instance per page.
  - Native binaries don't run.
  - Outbound Node HTTP goes through the browser and its CORS rules, except with the internal `setCORSProxy`.
  - The runtime iframe is served from StackBlitz (`local-corp.webcontainer-api.io`); webcode re-hosted it.
  - Commercial use needs a license (INFERRED).
  - wc-exe (cbcruk) measured boot at "a few seconds", warm builds 4.2 s, and 2.0 s with a persistent daemon. VERIFIED.
- **BrowserPod's native-binary table:** the shipped `CLAUDE.md` is the best summary of what breaks for Vite, Next or Nuxt in a Wasm Node. VERIFIED.
  - esbuild → esbuild-wasm
  - rollup → @rollup/wasm-node
  - @parcel/watcher → watcher-wasm
  - Next SWC → @next/swc-wasm-nodejs (pinned to the same version as `next`)
  - Vite 8.2+ and Nuxt 4 → @rolldown/binding-wasm32-wasi
  - no Turbopack
  - avoid sharp, sqlite3, bcrypt, node-sass
- **Ink in xterm.js:**
  - `ink-web` (cjroth) is a maintained drop-in for Ink 6.x on xterm 5.x.
  - **Claude Code uses its own forked renderer**, so ink-web doesn't apply directly.
  - In Claude Code's favor: 2.1.85 "replac[ed] WASM yoga-layout with a pure TypeScript implementation" (VERIFIED, CHANGELOG).
  - Against: since 2.1.271 it needs `Bun.ant.CellSegmenter`.
  - Every precedent above rendered the real TUI in xterm.js successfully, with `COLORTERM=truecolor` and `CLAUDE_CODE_NO_FLICKER=1`.
- **git:**
  - isomorphic-git needs a CORS proxy for GitHub (`cors.isomorphic-git.org` in claude-co.de; VERIFIED).
  - BrowserPod ships real git, HTTPS only, and not codeload or api.github.com.
- **ripgrep:**
  - Claude Code's native builds replaced Grep/Glob with embedded **ugrep/bfs** reached through the Bash tool (2.1.117; "Windows and npm-installed builds unchanged"). VERIFIED (CHANGELOG).
  - Any extracted-JS port must turn that gate off and provide `rg` (`USE_BUILTIN_RIPGREP=0/false`).
  - Wasm options: `ripgrep-node` (wasm32-wasip1 with SIMD; TTY colour detection lost across the WASI boundary), `grep-wasm`, `ripgrep_wasm`. BrowserPod ships rg. INFERRED except BrowserPod.
- **bash:**
  - Claude Code's Bash tool expects a real POSIX bash (the FreeBSD wrapper forces `SHELL=bash`).
  - Options:
    - WebContainers `jsh`: not bash.
    - **Vercel `just-bash` 3.6.0**: has a browser export and an in-memory FS, but is "beta"; README says "Binaries and WASM are not supported". agent-wasm uses it.
    - BrowserPod: real bash compiled to Wasm.
  - No WebContainer or almostnode precedent shows Claude Code completing Bash-tool work end to end. INFERRED gap.
- **Filesystems:**
  - BrowserPod: ext2 blocks streamed over WS or HTTP range requests, cached in OPFS or IndexedDB, writes kept local.
  - almostnode: in-memory VFS plus IndexedDB project snapshots.
  - ZenFS (OPFS/IndexedDB backends), memfs, LightningFS (IndexedDB, used with isomorphic-git): INFERRED; no Claude Code-specific reports.
- **Network workarounds seen:**
  - Cloudflare Worker / Pages proxies (claude-co.de, webcode, BrowserPod).
  - Tailscale Connect in WASM (agent-wasm).
  - The documented `anthropic-dangerous-direct-browser-access: true` header makes api.anthropic.com CORS-enabled for **API-key** browser calls (Simon Willison, 2024-08-23). Claude Code's own requests and the OAuth token endpoints are another agent's CORS question.

---

## 5. Re-implementations of the harness that could run in-browser (priority 5)

> **Policy flag (for the policy agent to confirm):**
> - The Agent SDK docs (VERIFIED, code.claude.com/docs/en/agent-sdk/overview) say: "Unless previously approved, Anthropic does not allow third party developers to offer claude.ai login or rate limits for their products, including agents built on the Claude Agent SDK."
> - Press reports say a 2026-02-19 docs and terms update made using subscription OAuth tokens in any third-party harness a violation; OpenCode reportedly removed Anthropic OAuth after legal demands in March 2026 (INFERRED, secondary).
> - So every option below implies **API-key billing**, not Pro/Max.

| # | Candidate | Size / maturity | In-browser story | Note |
|---|---|---|---|---|
| 1 | **Pi** (earendil-works/pi; formerly badlogic/pi-mono) | Mature TS monorepo; minimal harness with extensions, SDK and RPC; OpenClaw is built on it. | Runs inside BrowserCode on Node (VERIFIED). Core libraries are plain TS and likely portable to a page (INFERRED). | Best-engineered small harness to port. |
| 2 | **anyclaude-sdk** (pipilot-dev) | Small (about 9 stars, created 2026-06). | Built browser-first: the same `query()` / `SDKMessage` shape as the official Agent SDK, a `WebContainerWorkspace`, `mcpProxy` for CORS, teams over BroadcastChannel. "No backend required, no OAuth." | The closest drop-in Agent-SDK-in-browser; immature. VERIFIED (README). |
| 3 | **OpenCode** (anomalyco/opencode) | Very large and popular. | A browser build exists in agent-wasm (VERIFIED), plus adyoi/opencode-wasm (INFERRED). | Lost Anthropic OAuth in 2026. |
| 4 | **Roll your own on `@anthropic-ai/sdk`** (browser-supported with `dangerouslyAllowBrowser`; beta tool runner) | Official. | WebVM + Claude (2025) is the precedent. | Smallest and most legally clean path, but it is not Claude Code. |
| 5 | Leak-derived trees (claw-code Python/Rust "clean room", free-code, ReplayCode, kill136/claude-code-open; from the **2.1.88 source-map leak, 2026-03-31**) | Popular; legally contested (DMCA notices reported). | Most still need Bun. | **Avoid**: legal risk and frozen at 2.1.88. |
| — | Official **Claude Agent SDK** | — | "A library that runs the Claude Code binary" (docs, VERIFIED); a subprocess, not browser-capable. | Same problem as the CLI. |

---

## 6. Anthropic statements on JS, Bun, npm and browser builds (priority 6)

- **ant-kurt (Anthropic, assignee of #30640), April 2026,** quoted verbatim in-thread by @delleceste on 2026-04-15: "No, to be upfront - porting Bun to FreeBSD is nontrivial to get right, and **we're not planning to keep the (deprecated since January) JS build around.**" Earlier: "For now you'll have to rely on Linuxulator." VERIFIED as quoted (I did not open the original comment ID).
- **CHANGELOG:** VERIFIED, https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
  - 2.1.0: faster rendering "when using native installer or Bun".
  - 2.1.15: "Added deprecation notification for npm installations".
  - 2.1.85: yoga WASM replaced by pure TS.
  - 2.1.91: `stripAnsi` routed through `Bun.stripANSI`.
  - **2.1.113: "Changed the CLI to spawn a native Claude Code binary (via a per-platform optional dependency) instead of bundled JavaScript"**.
  - 2.1.117: embedded bfs/ugrep.
  - 2.1.181: bundled Bun upgraded to 1.4.
- **Inside the 2.1.310 bundle:** VERIFIED as quoted in #105074. "This runtime has no Bun.ant.CellSegmenter. Run Claude Code on the **@anthropic-ai/bun-internal** version pinned in package.json." So Claude Code now depends on a private Bun fork.
- **#105074** (markblackman, 2026-10-25): asks Anthropic to publish the JS bundle as an unsupported artifact. **No staff reply.** Related #51020, #51698, #81704 got bot closes or labels only. bcherny added `area:core` to #81704 on 2026-08-17. VERIFIED.
- **Anthropic acquired Bun** (announced 2025-12-02/03). Coverage quotes Jarred Sumner: if Bun fails, Claude Code fails. INFERRED (press).
- **No public Anthropic statement about a browser or Wasm build of Claude Code was found** (searched X/bcherny, issues, docs). The nearest are the desktop in-app browser, Claude in Chrome, and cloud/self-hosted sessions.

---

## 7. Performance data points collected

| Setup | Number | Source |
|---|---|---|
| BrowserPod Node (browser JS engine) | fib(35) 60 ms vs 65 ms native | HN 47314161 (johndough) |
| WebVM / CheerpX x86 JIT | Python fib(30) 1300 ms vs 65 ms (about 20×); NumPy about 2500× | same |
| container2wasm | "performance … enough of an issue" | same (the_mitsuhiko) |
| v86 Buildroot | 12.7 MB, 10–30 s boot | simonwillison.net 2026-01-06 |
| WebContainers + Claude Code (webcode) | 10–15 s until `claude` is available | HN 44731669 |
| WebContainers build tool (wc-exe) | boot "a few seconds"; warm build 4.2 s, 2.0 s with daemon | wc-exe README |
| Termux proot + Claude Code | "too slow for interactive use" (FS I/O) | #50270 |
| Codex wasm, Claude Code on BrowserPod | no figures published | — |

---

## 8. Top 10 lessons

1. **The `cli.js` era ended at 2.1.112 (April 2026), and Anthropic says it won't return.** Every WebContainer or almostnode precedent is pinned there, now about 200 releases behind. To run current Claude Code we must **extract the JS from the Bun binary** (`unhare`, `@avmc/bun-extractor`, `bun-decompile`) and supply a Bun-API polyfill. The FreeBSD port proves this works with about 1.7k lines, and shows it breaks every few dozen releases.
2. **Treat the Bun surface as the contract.** Start from FreeBSD's `bun-polyfill.cjs` list plus clawgod's `Bun.ant.CellSegmenter`. Plan for the bundle-shape rewrites (`$bunfs` paths, `import.meta.require/dir`, the embedded-search gate, `isStandaloneExecutable`), each with a matcher that fails loudly when it stops matching. Run a daily compatibility CI as clawgod does.
3. **Map process identity to Workers.** Claude Code re-spawns `process.execPath` (bg PTY host, remote-control, runner) and re-execs itself as `ugrep`/`bfs`. In the browser, "spawn myself" must become a new Worker that loads the same bundle with the polyfill preloaded. The embedded-search gate must be off and `rg` must be provided.
4. **The network decides feasibility.** Every working precedent relayed traffic: BrowserPod CF Workers, claude-co.de / webcode CF functions, or agent-wasm's CORS proxy or Tailscale. The pure-static GitHub Pages precedent stopped at the welcome screen. Before building, verify CORS on `api.anthropic.com` and the OAuth endpoints (separate agent). Otherwise design a **user-owned** relay (one-click Worker, Tailscale exit node), never a shared one that sees tokens (webcode posted emails to Slack).
5. **Subscription login works through the manual code-paste OAuth flow.** BrowserCode, claude-co.de, webcode and Pi all rewrote `redirect_uri` from localhost to Anthropic's `/oauth/code` page. Persist `~/.claude` credentials in OPFS or IndexedDB, ideally encrypted (agent-wasm uses a passkey vault).
6. **The TUI renders fine in xterm.js, but the terminal layer must be faithful:**
   - Raw-mode setup must not flush stdin.
   - Child output must not interleave with Ink frames.
   - Set `COLORTERM=truecolor` and `CLAUDE_CODE_NO_FLICKER=1`.
   - For a nicer UI, use the structured paths (stream-json, Agent-SDK protocol, JSONL transcript tail) rather than scraping, as Anthropic's own surfaces do.
7. **Run JS on the page's own engine; never emulate.** Shim-based and BrowserPod-style runtimes are about native speed for JS. x86 emulation (WebVM, v86, container2wasm) is 10–2500× slower and would have to run the Bun ELF itself.
8. **The Bash tool is the real gap for lighter runtimes.** Claude Code expects real bash plus rg plus git. BrowserPod succeeds because it ships real ones compiled to Wasm. WebContainers `jsh` and `just-bash` (beta, "Binaries and WASM are not supported") are approximations, and no precedent showed full tool loops on them. Budget for a Wasm bash (or a very good emulator), Wasm rg, and isomorphic-git behind a proxy.
9. **Browser and hosting requirements:**
   - GitHub Pages can't set COOP/COEP; `coi-serviceworker` works (reagent-systems, live).
   - JSPI-dependent runtimes exclude iOS and older browsers.
   - Disable the auto-updater (`DISABLE_AUTOUPDATER=1`); it clobbers unusual installs.
   - Ship a `CLAUDE.md` describing the sandbox; agents still try native habits first.
10. **Only the official bundle has a defensible case for subscription use.** Pro/Max in a third-party harness is prohibited (Agent SDK docs; Feb 2026 clarification), so clones and re-implementations (Pi, anyclaude-sdk, OpenCode, leak-derived trees) mean API-key billing. Running the **official, minimally changed** bundle is the only arguable subscription path; BrowserCode does this, and Anthropic has not commented. Each polyfill or patch moves us away from "unmodified". Clawgod-style feature patching and user-agent spoofing are clearly over the line. Get the policy agent's read before relying on this.

---

## 9. Key sources (all accessed 2026-10-27)
- BrowserCode repo: https://github.com/leaningtech/browsercode (`src/lib/config/tools.ts`, `static/project/claude/CLAUDE.md`, `static/_headers`, git log). Issue #15: https://github.com/leaningtech/browsercode/issues/15
- BrowserPod deep dive: https://labs.leaningtech.com/blog/browserpod-deep-dive · Rust/Codex: https://labs.leaningtech.com/blog/browserpod-rust · Announcement: https://browserpod.io/blog/announcing-browsercode/
- HN: 48049713 (BrowserCode Show HN), 47974906 (Gemini CLI in browser), 49362139 (Codex WASM), 47314161 (browser VM agents, perf), 44731669 (webcode.sh)
- agent-wasm / almostnode fork: https://github.com/BLamy/almostnode (`CHANGELOG.md`, `packages/almostnode/src/shims/child_process.ts`, `network/policy.ts`, `apps/web-ide/readme.md`, `docs/codex-cli-browser.md`) · upstream https://github.com/macaly/almostnode
- claude-co.de: https://github.com/BLamy/claude-co.de
- webcode: https://github.com/wordbricks/webcode
- clientside-containers: https://github.com/reagent-systems/clientside-containers (devlog 2026-08-27)
- anyclaude-sdk: https://github.com/pipilot-dev/anyclaude-sdk
- FreeBSD port: https://github.com/freebsd/freebsd-ports/tree/main/misc/claude-code · https://www.freshports.org/misc/claude-code/ · PR https://github.com/freebsd/freebsd-ports/pull/626 · unhare https://github.com/UnitedMarsupials/unhare · clawgod https://github.com/0Chencc/clawgod
- Claude Code issues: #51976, #55520, #50270, #81704, #30640, #51698, #105074, #90754 at https://github.com/anthropics/claude-code/issues/
- Claude Code CHANGELOG: https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md
- Docs: https://code.claude.com/docs/en/agent-sdk/overview · https://code.claude.com/docs/en/claude-code-on-the-web
- WebVM + Claude: https://labs.leaningtech.com/blog/webvm-claude · v86 PoC: https://len4m.github.io/posts/browser-agent-v86-poc/
- Server-backed UIs: https://github.com/siteboon/claudecodeui · https://github.com/sugyan/claude-code-webui · https://github.com/vultuk/claude-code-web · https://github.com/slopus/happy · https://cheneeheng.github.io/blog/claude-code-html-wrapper--in-the-browser/
- Building blocks: https://www.npmjs.com/package/just-bash · https://github.com/cjroth/ink-web · https://simonwillison.net/2024/Aug/23/anthropic-dangerous-direct-browser-access
- Policy (secondary): https://www.theregister.com/2026/02/20/anthropic_clarifies_ban_third_party_claude_access · Leak: https://bleepingcomputer.com/news/artificial-intelligence/claude-code-source-code-accidentally-leaked-in-npm-package
