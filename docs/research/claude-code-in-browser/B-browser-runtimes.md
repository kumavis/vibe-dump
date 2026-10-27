# B: Browser-side runtime options for running Claude Code client-side

*Research slice B of the "Claude Code in a static GitHub Pages tab" feasibility study. Compiled 2026-10-27.*

**Legend.** **[V]** means VERIFIED: I found a primary source (official docs, the repo or package itself, or my own experiment in this session). **[I]** means INFERRED: my reasoning, or a secondary source only.

Other agents cover Claude Code internals, CORS/auth empirics and prior art. I only touch those where they change the verdict on a runtime.

---

## 0. Cross-cutting findings (read these first)

1. **The npm package no longer ships `cli.js`.** **[V]**
   - `@anthropic-ai/claude-code` stopped publishing a JS bundle at 2.1.113 (2026-04-17). From that version on, the package is `bin/claude.exe` plus per-platform `optionalDependencies`, which means native binaries only.
   - The **last `cli.js` release is 2.1.112** (2026-04-16): one ESM file, 13,711,684 bytes, `engines.node >= 18`.
   - The latest version today is 2.1.312 (2026-10-27).
   - `@anthropic-ai/claude-agent-sdk` 0.3.x is native-only as well. (Source: npm registry metadata, `registry.npmjs.org/@anthropic-ai/claude-code`.)
   - **Consequence:** every "run `cli.js` as-is" option below is frozen at a version about six months old. The only way out is recovering the JS from the Bun binary, which is the internals agent's question.
2. **The frozen `cli.js` can be fetched from public CDNs with CORS.** **[V]**
   - jsDelivr and unpkg both serve `@anthropic-ai/claude-code@2.1.112/cli.js` with `access-control-allow-origin: *` and `cross-origin-resource-policy: cross-origin`.
   - So a page can load it unmodified at runtime, even under `COEP: require-corp`. That avoids redistributing a patched copy of Anthropic's proprietary file, whose `LICENSE.md` reads "© Anthropic PBC. All rights reserved".
3. **Only one option can execute the native Bun binary: QEMU-wasm, via container2wasm.**
   - CheerpX and v86 are 32-bit x86 only. **[V]** Bun ships no 32-bit build. **[I]**
   - WebContainers, Nodebox and BrowserPod cannot run native ELF binaries at all. **[V]**
   - QEMU-wasm emulates x86_64 and aarch64 guests with a wasm JIT. **[V]** Running Bun's JIT inside that would be extremely slow. **[I]**
4. **GitHub Pages plus `coi-serviceworker` does give cross-origin isolation.**
   - The service worker injects COOP/COEP so the page gets `SharedArrayBuffer`. **[V]** (Sources: gzuidhof/coi-serviceworker README; tomayac's blog, 2025-03.)
   - Demonstrated for WebContainers on Pages (garrettmflynn/webcontainers-ghpages) **[V]**. WebVM ships its own equivalent `serviceWorker.js` **[V]**.
   - Caveats:
     - It reloads the page once on first visit. **[V]**
     - The worker must be a separate same-origin file. **[V]**
     - Firefox private mode may have no service workers. **[I]**
     - Safari has no `COEP: credentialless`, so it falls back to `require-corp`. **[I]** (Source: WebKit bug 230550, still "New".)
     - Every cross-origin subresource then needs CORP or CORS headers.
   - Chrome's `Document-Isolation-Policy` (Chrome 137, desktop) **[V]** cannot help a Pages site, because it is itself a response header.

---

## 1. StackBlitz WebContainers (`@webcontainer/api`)

**What it is and who runs it.**
- A proprietary Node.js-compatible runtime: a Wasm "OS" kernel plus Node's JS running on the browser's own V8 inside Web Workers. Made by StackBlitz.
- The npm package `@webcontainer/api` 1.6.4 (2026-04-14, MIT) is only a thin client. **[V]** I inspected the tarball: `boot()` inserts a hidden `<iframe src="https://stackblitz.com/headless?...">` and talks to it over Comlink.
- The runtime itself (`webcontainer.*.js`, `fetch.worker.*.js`) loads from `w-corp-staticblitz.com`. **[V]** So there is a **hard runtime dependency on StackBlitz's servers**, and the runtime code is not open source.

**Can it run `cli.js`? Probably yes.** **[I, high confidence]**
- Node version: 22.22.0, upgraded to 22.22.3 in June 2026. **[V]** (Issue #2106.)
- `npm install` runs inside the container from the browser, using StackBlitz's "Turbo" installer or npm/pnpm/yarn. **[V]**
- `npm i @anthropic-ai/claude-code@2.1.112` has no install scripts. Its optional `sharp` dependencies would fail harmlessly. **[I]**
- I found no public report of Claude Code running in a WebContainer. No issue in webcontainer-core mentions it. **[V: absence]**
- Recent issues show the API surface lagging behind real Node:
  - `node:sqlite` is missing (#2150, 2026-08).
  - `Module.enableCompileCache` errored (#2128).
  - `TextEncoder.encodeInto` has a bug (#2173, 2026-10).

**Can it run the native binary? No.** **[V]**
- "can only execute languages that are natively supported on the Web, including JavaScript and WebAssembly". Native addons are disabled (troubleshooting page).
- Issue #2151 (2026-08): "pnpm 12 cannot run because native binaries cannot execute".
- The vendored `rg` binary therefore won't run either. Claude Code's Grep, Glob and command discovery would need an `rg` shim placed on `PATH` (with `USE_BUILTIN_RIPGREP=0`). **[I]**

**Performance.**
- JS runs on the browser's V8 at near-native JIT speed. StackBlitz's own 2021 claims are "builds complete up to 20% faster" than local and installs "≥5x faster". **[V, vendor claim]**
- System calls (fs, process) cross a worker boundary through a `SharedArrayBuffer`-based RPC. That adds microseconds per call, not milliseconds. **[I]**
- For an interactive TUI: **roughly 1–1.5x native.** **[I]**

**Networking.**
- Node `http`/`https`/`fetch` become browser `fetch()` from the StackBlitz iframe's workers, so **CORS applies**. **[V for the general model** (StackBlitz's CORS-proxy blog: "isolated from the rest of the web, unless some external site specifically allows you to make CORS requests"); **I for exact mechanics]**
- StackBlitz's built-in **CORS proxy** (May 2024) is a feature of the StackBlitz *editor*. It needs a Personal+ or Teams plan and a `.stackblitzrc` setting `{"corsProxy": true}`. **[V]** It is not documented as available to API users. **[I]** Issue #882, asking to route requests to a proxy, has been open since 2022. **[V]**
- No raw outbound TCP. The "virtualized TCP stack" only serves in-container servers through a service worker. **[V]** (2021 blog.)

**PTY / interactive TTY.** **[V]**
- `spawn(cmd, args, { terminal: { cols, rows } })` gives a pseudo-terminal. `process.input` is a `WritableStream<string>`, `output` is a `ReadableStream<string>`, and `process.resize({cols, rows})` resizes it.
- The official tutorial wires it to xterm.js and the fit addon. Raw mode, which Ink needs, is expected to work, since StackBlitz terminals run interactive `npm create …` prompts. **[I]**
- A known stdin quirk: `\r\n` becomes `\n\n` (#1341, open).

**The shell is `jsh`, not bash.** **[V]**
- An `ls` inside a container (issue #1165) showed:
  - `/bin`: bash, cp, jsh, ls, ps, rmdir, cat, echo, kill, mkdir, pwd, sh, chmod, hostname, ln, mv, rm, zsh
  - `/usr/bin`: alias, clear, env, head, tail, true, which, cd, curl, false, sort, touch, uptime
- `sleep` and `date` were missing. The `bash`/`sh`/`zsh` entries are presumably aliases to `jsh`. **[I]** Aliases can be added via `~/.jshrc`. **[V]** (2021 blog.)
- **No git CLI.** Nothing in the listing, no docs; git-related issues are all about StackBlitz's GitHub integration. **[V: absence]**
- **A bash shim is feasible.** Point `SHELL` at a Node script that wraps `just-bash` (see §6). It runs as plain JS inside the container. `git` could be a Node script over `isomorphic-git`. **[I]**

**Filesystem.**
- In-memory. `export()`/`mount()` give snapshots (JSON, binary or zip) that you can persist to IndexedDB or OPFS yourself. **[V for API; I for persistence pattern]**

**Browser requirements.** **[V]**
- COOP `same-origin` plus COEP `require-corp` or `credentialless`. Desktop Chromium is fully supported. Firefox and Safari 16.4+ are listed as beta.
- **Third-party cookie blockers break it** (Chrome's third-party cookie blocking, Brave's defaults).
- I fetched the `stackblitz.com/headless` response today. It sends COOP, COEP `require-corp`, `CORP: cross-origin`, and an `UnrestrictedSharedArrayBuffer` origin-trial token whose decoded expiry is **2026-05-19**. **[V]**
- The `coep: 'none'` boot option is documented as Chromium-only "as long as an Origin Trial is supported". With an expired token it is presumably dead. **[I]** So you need the `coi-serviceworker` route.

**GitHub Pages.** Works with `coi-serviceworker`. There is a working demo at garrettflynn.com/webcontainers-ghpages. **[V]**

**Licence and cost.** **[V]**
- "Always free for Open Source."
- "Licensing is required for production usage of the API in a commercial, for-profit setting." Prototypes and POCs are exempt.
- `configureAPIKey()` exists for commercial keys.
- An open-source hobby project should be free. **[V]**

**Maturity.** Mature (since 2021) and actively maintained (issues triaged through 2026-10). **[V]**

---

## 2. CodeSandbox Nodebox (`@codesandbox/nodebox`)

**What it is.**
- A Node-*compatible* runtime that reimplements Node modules by hand on top of browser APIs. Made by CodeSandbox, which was acquired by Together AI in December 2024. **[V]**
- Like WebContainers, the npm client loads the runtime from an iframe at `https://nodebox-runtime.codesandbox.io`. That host still serves today (last-modified 2026-10-15). **[V]**

**Maintenance: effectively abandoned.** **[V]**
- Latest npm release is 0.1.9 (2023-11-29). The last commit to `Sandpack/nodebox-runtime` was 2023-11-29 ("sync").

**Can it run `cli.js`? Very unlikely.** **[I]** Its stated limitations **[V]**:
- No N-API.
- No sockets to external IPs.
- **No synchronous `exec`/`spawn`.** `cli.js` has 20 such call sites; see §6.
- No `async_hooks`.
- Processes don't exit automatically.

**Native binary.** No. **[V]**

**Networking.** fetch-based, so CORS applies. **[I]**

**PTY.**
- None. The Shell API gives `stdout`/`stderr` string emitters and a `stdin.write`. There is no terminal size, resize or raw mode. **[V]** (Typings `build/modules/shell.d.ts`.)

**COOP/COEP.**
- **Not required.** **[I]** The client library has no `SharedArrayBuffer` references **[V]**, and the README claims Chrome, Firefox and Safari support with iOS Safari in beta **[V]**.
- That is its one advantage, and it works on Pages as-is.

**Licence.**
- "Sustainable Use License": "use … only for … non-commercial or personal use", and distribution only "free of charge for non-commercial purposes". **[V]** That is OK for a hobby project.

**Verdict.** Not viable: stale, no TTY, no sync child processes.

---

## 3. CheerpX / WebVM (Leaning Technologies)

**What it is.** **[V]**
- An x86-to-WebAssembly JIT plus a Linux syscall emulator, running real Linux userland binaries from an ext2 image streamed on demand.
- npm `@leaningtech/cheerpx` 1.4.0 (2026-10-07). WebVM is the demo distribution (Apache-2.0 repo).

**Can it run the native Bun binary? No.** **[V]**
- CheerpX runs "existing 32-bit x86 native binaries". On 64-bit support (issue #165, 2025-02-26), the staff answer was: "planned in the medium term, but … not a priority". They call Wasm "structurally 32-bit".
- Bun is x86-64/arm64 only. So the JIT-heavy JavaScriptCore inside Bun is moot.

**Can it run `cli.js`? Yes in principle, with a 32-bit Node.** **[I]**
- 32-bit Node is still packaged: Alpine edge has `nodejs 24.22.1-r0` for `x86` (built 2026-10-23). **[V]**
- V8's JIT would emit x86 code that CheerpX re-JITs into Wasm: JIT-in-JIT. CheerpX says it supports "dynamically generated and self-modifying code". **[V]**

**Performance.**
- Vendor claims (CheerpX 1.0, 2024-12): 2–3x slower than native in the best case, "5x–10x slower" for complex apps. Floating point and vectors are the weak spots. **[V]**
- V8 inside it: probably at the bad end of that range or worse, plus multi-second cold starts. **[I]** No published Node benchmark exists. **[V: absence]**

**Networking: Tailscale only.** **[V]**
- "Networking with WebVM always happens via Tailscale."
- "You need an exit node if you want to access the internet." An exit node is a machine you must run.
- Using browser `fetch` "for general networking purposes" is described as impossible.
- **So reaching api.anthropic.com needs a server-side Tailscale exit node,** which breaks the no-server requirement.
- A custom bridge (the guest writes a request to a shared file or device, JS performs the `fetch`) could be built, but nothing ships. **[I]**
- Note: WebVM's own Claude integration calls the Anthropic API from page JS, not from inside the VM. **[V]** (labs.leaningtech.com/blog/webvm-claude.)

**PTY.** Real Linux TTY semantics in the guest, shown through xterm.js in WebVM. **[V]**

**Filesystem.** Devices include `IDBDevice` (IndexedDB), `OverlayDevice`, `HttpBytesDevice` and `WebDevice`. **[V]**

**Non-JS binaries.** Yes, any 32-bit x86 Linux binary: git, ripgrep, bash. This is its big strength. **[V]**

**COOP/COEP.** Required. **[V]** It works on Pages: WebVM's `serviceWorker.js` injects COEP `require-corp`, COOP `same-origin` and CORP. **[V]**

**Licence.** **[V]**
- The free "Community License" covers individuals, FOSS projects and technical evaluations, **only when loading CheerpX from `cxrtnc.leaningtech.com`**. Attribution is required.
- Self-hosting or redistribution needs a commercial licence.

**Maturity.** Commercial product with active releases. **[V]**

**Verdict.** It runs real bash, git and rg, but it is 32-bit only, slow for V8, and has **no serverless path to api.anthropic.com**.

---

## 4. v86 and container2wasm (Bochs / TinyEMU / QEMU-wasm)

### v86
**What it is.** **[V]**
- A 32-bit x86 PC emulator with an x86-to-Wasm JIT, by copy (Fabian). BSD-2-Clause.
- npm 0.5.472 (2026-10-18), very active.
- "64-bit kernels are not supported"; Pentium 4-level CPU with SSE3.

**Bun native binary.** No (64-bit). **[V]**

**Node performance (issue #1005, 2024).** **[V]**
- `node hello.js`, Node 20 on Alpine: 3.71 s cold / 1.61 s warm on the maintainer's machine. Other reporters saw 7–40 s cold; a low-end PC took 18 s warm in-browser.
- Maintainer: "a 10x slowdown compared to native is expected", and "three layers of jit warmups (js->x86, x86->wasm, wasm->hostcpu)".
- A third-party agent sandbox measured cold boot at about 20–25 s and saved-state restore at 2–3 s (pi-mono "mom" v86 page).

**Implication.** Claude Code's ~0.6–0.9 s native start (my measurement, §6) would likely become tens of seconds, with sluggish Ink re-renders: **roughly 20–100x slower.** **[I]**

**Networking.** **[V]**
- The `fetch` backend only intercepts guest **TCP port 80** HTTP and turns it into `fetch()`. It upgrades to `https:` when the page is HTTPS (read in `libv86` source). A `cors_proxy` option exists. So the guest would run `ANTHROPIC_BASE_URL=http://api.anthropic.com` and the browser makes an HTTPS, CORS-bound call. **[I]**
- `wsproxy` (Ethernet over WebSocket) and `wisp` (TCP over WebSocket) need a relay server.

**PTY.** A serial console wired to xterm.js works. **[V: common usage]**

**COOP/COEP.** **Not required.** `libv86` contains no `SharedArrayBuffer` or `Atomics` usage. **[V: grep]** It runs on Pages unmodified.

**Licence.** BSD-2-Clause. Note the project refuses AI-generated pull requests and issues. **[V]**

### container2wasm / QEMU-wasm
**What it is.** **[V]**
- Converts a container image into Wasm. Apache-2.0, "experimental", from NTT's ktock.
- Emulators: Bochs for x86_64 (an interpreter), TinyEMU for riscv64, and **QEMU-wasm** (`--to-js`), which has a TCG to Wasm JIT, multi-threaded TCG, and **x86_64, aarch64 and riscv64 guests**.
- TCG Wasm JIT is "under discussion" for upstream QEMU; 32-bit-guest TCI was upstreamed in QEMU 10.1.

**Native binary.** **The only option that could execute the x86-64 or arm64 Bun-compiled `claude` ELF.** **[I, untested]** Expect three stacked JITs: JSC, then QEMU TCG, then the browser's Wasm compiler.

**Performance.**
- FOSDEM 2025 benchmarked `pigz` on an x86_64 guest and said the Wasm backend is "still slower than other backends" (numbers only in a chart image). **[V]**
- For a JIT-heavy Bun or JSC workload: **likely 50–500x slower.** **[I]**

**Networking.** **[V]**
- `c2w-net-proxy` is an in-browser network stack. It terminates the guest's TLS with its own certificate (`/.wasmenv/proxy.crt`, with `SSL_CERT_FILE` preset), then re-issues the request through `fetch`.
- So HTTPS to api.anthropic.com works if the server allows CORS. Forbidden headers can't be set, and only Chrome is tested.
- The WebSocket mode needs the host-side `c2w-net` daemon.

**COOP/COEP.** Needed for multi-threaded QEMU (pthreads need `SharedArrayBuffer`). **[I]** On Pages that means `coi-serviceworker`.

**Verdict.** v86 is too slow and can't run Bun. QEMU-wasm is a research curiosity: the only native-binary route, with unusable performance.

---

## 5. WASI / Emscripten "Node in Wasm" runtimes

**Is there a Node or Bun for wasm32-wasi? No.** **[I: no official target found]**
- Node has no Wasm build target.
- Bun has only discussion #10400 ("Could bun run in the browser?") and no target. **[V: discussion]**
- Deno (Rust plus V8) has no browser build. **[I]**

**Close relatives worth knowing:**
- **Wasmer Edge.js** (2026-03-17, MIT). **[V]**
  - A Node-compatible runtime whose JS engine (V8, JSC or QuickJS) is reached through N-API, with syscalls sandboxed through WASIX. It reuses libuv, llhttp and similar libraries.
  - Claims 3,592 of 3,626 Node tests passing, and runs 5–30% slower than Node natively.
  - Browser use goes through `@wasmer/sdk` (alpha; needs COOP/COEP). The examples use `wasmer/edgejs-quickjs`, i.e. **QuickJS interpreted inside Wasm**, which is far slower than V8's JIT for a 13 MB bundle. **[I]**
  - "Host-engine mode" (the browser supplies the engine) is labelled experimental.
  - Watch it, but it is not usable today.
- **Wasmer JS SDK with WASIX bash/coreutils**: real bash in the browser, but needs COOP/COEP. **[V]**
- **`@jupyterlite/cockle`**: a bash-like shell in TypeScript plus Emscripten-forge Wasm coreutils, grep, sed, vim, and **`git2cpp`** (libgit2) for git. Needs `SharedArrayBuffer` or a service worker for synchronous stdin. **[V]**
- **`browser_wasi_shim`** (0.4.2, 2025-06) and **xterm-pty** (0.12.0, 2026-04, MIT): plumbing that gives xterm.js a PTY line discipline for Wasm programs. **[V]**

**Verdict.** Not a viable route to running Node or Bun itself in 2026. The pieces are useful as tools (bash, git, rg) next to a JS-native approach.

---

## 6. The "polyfill port": run the official `cli.js` on the browser's own V8 with Node API shims

**Idea.**
- Load the unmodified `cli.js` 2.1.112 as an ES module, from jsDelivr or a local copy.
- Use an **import map** to point every `node:*` and bare built-in specifier at browser shims.
- Pre-install globals (`process`, `Buffer`, `global`, `setImmediate`), wire `process.stdin`/`stdout` to xterm.js, and route `child_process` into an in-page shell emulator.

### 6a. What `cli.js` actually needs **[V: static scan of 2.1.112]**
**Static ESM imports from 31 distinct Node built-ins, in both `node:x` and bare `x` forms:**
- assert, async_hooks, buffer, child_process, crypto, dns, events, fs, fs/promises, http, http2, https, module (`createRequire`), net, os, path (+ posix, win32), process, readline, stream (+ consumers, promises), timers/promises, tls, tty, url, util (+ types), v8, vm, zlib.
- Plus dynamic `require()` of perf_hooks, inspector and others through `createRequire`.
- **Every named import must exist at link time**, or the module fails with a `SyntaxError`.

**Synchronous fs:** about 300 call sites.
- statSync 87, readFileSync 67, existsSync 53, readdirSync 27, mkdirSync 26, writeFileSync 21, realpathSync 19.
- This rules out purely async storage. You need an in-memory filesystem with a synchronous API (memfs, or ZenFS whose "backends support synchronous operations"), asynchronously persisted to OPFS or IndexedDB. **[V: ZenFS README]**

**Synchronous `child_process`:** 20 call sites (spawnSync 11, execFileSync 5, execSync 4).
- A JS shell emulator is async. Making these truly synchronous requires running `cli.js` in a Worker and blocking with `Atomics.wait` on a second Worker that runs the shell. That needs `SharedArrayBuffer`, hence COOP/COEP via `coi-serviceworker`.
- Alternatively, return failures. My probe showed the startup ones are all optional probes.

**TTY:** `setRawMode` ×25, `isTTY` ×60, `"resize"` ×14, `SIGWINCH`. Ink needs a `tty.ReadStream`-like stdin and a stdout with columns and rows.

**Other:** `undici` ×61, WebSocket ×167 (IDE and remote features), `globalThis.Bun` checks.

### 6b. Experiment: unmodified `cli.js` 2.1.112 in headless Chromium **[V: run in this session]**
**Setup.**
- `@jspm/core` 2.1.0's browser `nodelibs`, plus about 250 lines of my own shims:
  - `process` with `argv`, `env`, stdout and stderr
  - `os` and `tty`
  - an `AsyncLocalStorage` replacement for `async_hooks`
  - `module.createRequire` mapping to the loaded shims
  - a `child_process` stub that fails asynchronously with ENOENT and logs each call
  - wrappers adding missing exports
  - Node-style timers with `.unref()`
- All wired up with a `<script type="importmap">`.
- Files: `<scratchpad>/research/probe/index2.html` plus the `w/` and `jspm/` directories.

**Results:**
- **Hashbang, ESM linking and import-map remapping of `node:*` all work.** Chrome parsed and linked the 13.7 MB file unchanged.
- **`claude --version`** printed `2.1.112 (Claude Code)`.
- **`claude --help`** printed the full commander help. The whole main module initialised.
- **`claude -p hello`** got through config and init. It then issued requests to `https://api.anthropic.com` through **both `fetch`** (the SDK path) **and XHR** (axios via jspm's `http`):
  - `/api/claude_code/settings`, `/policy_limits`, `/api/claude_cli/bootstrap`, `/mcp-registry/...`, `HEAD /`
  - The sandboxed browser had no internet, so it ended with "Invalid API key · Fix external API key".
- **Gaps in @jspm/core I had to patch** (each a hard link-time or startup failure):
  - missing `crypto.createPrivateKey`, `events.setMaxListeners`, `fs/promises.constants`, `http.createServer`, `net.BlockList`, `os.userInfo`, `util.isDeepStrictEqual`
  - `zlib.constants` absent (`Z_SYNC_FLUSH`, Brotli constants)
  - `url.fileURLToPath` broken (references `Deno`)
  - `async_hooks` throws
  - `Buffer` global missing
  - `setTimeout(...).unref` missing
- **Subprocesses attempted during `-p` startup, before any tool use:**
  - `which npm|bun|yarn|deno|pnpm|node`
  - vendored `rg --version`
  - `rg --files … --glob *.md` over `~/.claude/{commands,agents,output-styles}` and `/etc/claude-code/...`
  - `rg --files --max-depth 4 --glob .orphaned_at ~/.claude/plugins/cache`
  - `which bwrap`, `which socat`, `npm root -g`
  - `ps aux | grep -E "code|cursor|windsurf|idea|…"`
  - These are exactly the long tail a `child_process` shim must answer (or fail gracefully).
- **Cold-start cost.** Wall time above a blank-page baseline was **about 2.0 s for `--version` and 2.9 s for `--help`**, versus **0.61 s and 0.86 s for native Node 22** on the same 4-vCPU Xeon. That includes loading 3.6 MB of jspm crypto and 13.7 MB of JS with no code cache, so about **3x cold start**. Steady-state JS runs on the browser's V8 JIT, i.e. native speed. **[I]**

### 6c. Bash emulation: Vercel Labs `just-bash` 3.6.0 (2026-10-01, Apache-2.0)
**What it is.** **[V]**
- A TypeScript bash interpreter over a virtual filesystem, "designed for AI agents".
- Built-ins include ls, cat, grep, sed, awk, jq, **`rg`**, find, xargs, diff, tar, gzip, base64, curl (allow-listed) and `bash`/`sh`.
- `defineCommand()` adds custom commands, such as `git` via isomorphic-git or `node` that runs JS in-page.
- Browser support: "The core shell (parsing, execution, filesystem, and all built-in commands) works in browser environments". python, sqlite and js-exec are Node-only.

**My test of Claude Code's real Bash-tool wrapper idioms.** I ran the browser bundle under Node; the idioms were taken from `cli.js` and from the live harness. **[V]**

These work:
- `source snapshot && { shopt -u extglob || setopt NO_EXTENDED_GLOB; } >/dev/null 2>&1 || true && eval '…' < /dev/null && pwd -P >| file`
- `\builtin export`, `\builtin unalias --`, `\builtin unset -f --`
- `bash -c`, `base64 -d`, heredocs, pipes, `$()`, subshells
- process substitution `<( )`, `&` / `wait`
- `rg -n`, `command -v`, `type`, `declare -F`

These are missing:
- `trap` ("command not found")
- `typeset -f`/`declare -f <fn>` prints no function body (affects shell snapshots)
- `git` and `node` (add them as custom commands)

**Alternatives:**
- `@jupyterlite/cockle` (real Wasm coreutils, git2cpp, vim)
- Wasmer WASIX bash (real bash; needs COOP/COEP)

### 6d. Existing toolkits and full shim runtimes **[V]**
| Package | Version and date | Licence | Notes |
|---|---|---|---|
| `@jspm/core` | 2.1.0, 2024-10 | Apache-2.0 | Browser ESM builds of all Node built-ins. Good base; gaps listed in §6b. |
| `node-stdlib-browser` | 1.3.1, 2025-02 | MIT | Browserify-era polyfills. |
| `vite-plugin-node-polyfills` | 0.28.0, 2026-05 | MIT | Wraps node-stdlib-browser for bundling. |
| `unenv` | 1.10, 2024-07 | MIT | UnJS Node-compat presets (workers/browser). |
| `@zenfs/core` + `@zenfs/dom` | 2.8.0, 2026-10 | LGPL-3.0 | Node `fs` with sync API; OPFS and IndexedDB backends. |
| `memfs` | 4.80, 2026-09 | Apache-2.0 | In-memory `fs`, plus a File System Access adapter. |
| `isomorphic-git` | 1.44.5, 2026-10 | MIT | git in JS. |
| `xterm-pty` | 0.12.0, 2026-04 | MIT | termios / line discipline for xterm.js. |
| `ink-web`, `ink-canvas` | — | — | Prove Ink renders into xterm.js via shims. Claude Code bundles its own Ink fork, so shim at the `process`/`tty` level. |
| `almostnode` (Macaly) | last release 2026-02 | MIT | Browser "Node" with 40+ shims, just-bash shell, npm install. `worker_threads` stubbed, no documented raw-mode TTY. |
| `Nodepod` (Scelar) | 2026-09 | MIT + Commons Clause | Shim runtime with optional xterm.js UI. COOP/COEP needed for sync `child_process`. |
| `Vivari` | 2026-07 → 2026-10 | MIT | Runs Node's own `lib/` JS on the browser engine with a Rust/Wasm kernel, real npm/pnpm. Needs COOP/COEP. No documented TTY. 86 stars. |

**Assessment.**
- **Realistic, and the best-performing option.** The probe already reaches network calls with about 250 lines of shims.
- Remaining work, in rough order of size:
  1. A `child_process` router: `bash -c`/`sh -c` to just-bash; `rg` to just-bash's `rg` or a JS/Wasm ripgrep; `which`, `ps` and `npm root -g` faked; `git` to isomorphic-git.
  2. A sync filesystem: ZenFS or memfs in memory, mirrored to OPFS.
  3. TTY: a `tty.ReadStream`-like stdin fed by `xterm.onData`, plus `setRawMode`, `isTTY`, `columns`/`rows` and `'resize'`.
  4. Network headers and CORS: the other agent's question. Forbidden headers like `User-Agent` are dropped silently; `HTTPS_PROXY`/undici agents must be no-ops.
  5. OAuth login: the localhost callback is impossible; use the API key or a copy-code flow.
  6. Many smaller gaps (`v8.getHeapStatistics`, `inspector`, `os` details, signals).
- **COOP/COEP:** optional. Only needed for truly synchronous subprocesses via `Atomics.wait`.
- **Licensing:**
  - Load `cli.js` *unmodified at runtime* from jsDelivr or unpkg, and shim around it. Do not ship a patched or bundled copy.
  - That keeps the project's own code fully open source. Anthropic's terms still govern the use of Claude Code itself. **[I]**
  - Freezing at 2.1.112 is the real cost (§0).

---

## 7. Other credible options

### BrowserPod (Leaning Technologies) and its demo app BrowserCode
**This is the most direct existing answer to the brief.**

**How it works.**
- BrowserPod "compiles the node C++ source unmodified to WebAssembly". V8 API calls are swapped for an implementation built on browser capabilities. **[V]** (Beta announcement, 2025-12-11.)
- The Node build is modified to run JS payloads on the browser's own engine (May 2026 deep-dive, via a mirror). **[V]**
- The kernel is a Wasm module with Linux syscalls, one Worker per process, and an ext2 block filesystem streamed on demand and cached in OPFS or IndexedDB. **[V]**
- Releases: 1.0 (2026-02-18, Node.js); 2.0 (2026-04-16, real bash, git built for Wasm, coreutils); npm `@leaningtech/browserpod` 3.4.0 (2026-10-07). **[V]**
- The README lists bash, git, ripgrep, npm and yarn as included, and says it can "run AI coding CLIs in-browser without modification (e.g., Claude Code, Codex)". **[V]**

**BrowserCode** (Apache-2.0, a static SvelteKit app, 1.3.0 beta). **[V]**
- Claims to run "unmodified versions of Claude Code, Codex CLI and Pi, completely client-side" on Node 22 in Wasm.
- Claude login uses a "copy code" flow; the default localhost-callback login fails.
- Which Claude Code version it runs is not stated, but it says native binaries are not supported yet. Open question for the prior-art agent.

**Performance.** "Native-like" for JS payloads (vendor claim; no numbers). **[V: claim only]**

**Networking.**
- **All egress goes through BrowserPod's proxy** (Cloudflare Workers), restricted to an allowlist: npm, GitHub, "the major AI provider APIs". Plain HTTP, SSH and other ports are refused. **[V]**
- This **sidesteps CORS** but routes your API traffic, and therefore your key or token, through Leaning's infrastructure. **[I]** The proxy must terminate TLS to forward the request.

**PTY.** Yes. `createDefaultTerminal` uses xterm.js. **[V]**

**Browser requirements.** **[V]**
- COOP `same-origin` plus COEP `require-corp`.
- BrowserCode additionally needs **Wasm JSPI**: Chrome/Edge 137+, Firefox 153+, Safari 27+. No iOS.

**Licence and cost.** **[V]**
- Proprietary runtime, loaded from Leaning's CDN (the npm package is 13 KB).
- Free plan: non-commercial, 10,000 tokens a month (about 1,000 sandbox-hours at 10 tokens an hour), up to 5 API keys and 5 origin domains, no custom egress domains, **attribution required**.
- Open-source projects can apply for up to 100k tokens a month.
- The API key is visible to the client.

**GitHub Pages.** Should work through `coi-serviceworker`, but this is untested and not documented. **[I]**

### Other notes
- **Cloudflare/workerd-style shims:** `unenv` and `nodejs_compat` are just the polyfill approach with a different preset. **[I]**
- **Bun-to-Wasm:** no plans found. **[V: absence]**

---

## Ranked comparison

Ranked by fitness for "Claude Code in a static GitHub Pages tab with decent performance".

| # | Option | Runs `cli.js` as-is? | Runs native Bun binary? | Performance (interactive TUI) | Networking and CORS | PTY / xterm.js | Needs COOP/COEP? | Works on GH Pages? | Licence (OSS hobby) | Maturity (2026) | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Polyfill port** (import map, @jspm/core, ZenFS, just-bash, xterm.js) | **Yes, 2.1.112 only.** `--help` and `-p` proven **[V]** | No | **Native V8; about 3x cold start [V], about 1x steady [I]** | Browser `fetch` and XHR, so CORS; no TCP; no proxy | DIY tty shim; xterm.js sends raw keys **[I]** | Optional (only for sync `child_process`) | **Yes** | Shims MIT/Apache/LGPL; `cli.js` loaded unmodified from CDN | DIY; long tail | **Best: prototype first** |
| 2 | **WebContainers** | Very likely **[I]** (Node 22.22 [V]) | No [V] | Near-native V8 plus syscall RPC, about 1–1.5x [I] | fetch, so CORS; no TCP; CORS proxy only in paid StackBlitz editor | **Yes**: `spawn` terminal, resize **[V]**; shell is `jsh`, no git | **Yes** | Yes via coi-sw (demo exists) [V] | Free for OSS [V]; proprietary runtime hosted by StackBlitz | Mature | **Strong #2** (quick baseline) |
| 3 | **BrowserPod / BrowserCode** | Vendor says yes (Claude Code beta) [V claim] | No (not yet) | "Native-like" JS (vendor) | **Vendor egress proxy with allowlist: no CORS issue,** but a third party sees traffic | Yes (xterm.js) [V] | **Yes**, plus JSPI | Probably via coi-sw [I] | Proprietary; free non-commercial tier with attribution; OSS grants | Young (Feb 2026), fast-moving | Reference benchmark; vendor lock-in |
| 4 | CheerpX / WebVM | Yes via 32-bit Node [I] | **No (32-bit only)** [V] | 2–10x claimed; V8 JIT-in-JIT worse [I] | **Tailscale only; needs an exit-node server** [V] | Yes (real Linux TTY) | Yes | Yes (WebVM's own SW) [V] | Free community licence, hosted CDN only, attribution | Mature commercial | Networking breaks the no-server rule |
| 5 | v86 | Yes via 32-bit Node [I] | **No** [V] | **About 10–100x;** Node warm hello 1.6 s, cold 4–40 s [V] | fetch backend for port-80 HTTP only (upgraded to HTTPS), CORS; else a relay server | Serial plus xterm.js | **No** [V] | Yes | BSD-2 | Active | Too slow |
| 6 | container2wasm / QEMU-wasm | Yes [I] | **Only option that could** (x86_64/aarch64 guest) [I] | **Likely 50–500x** [I]; "still slower" [V] | In-browser TLS-terminating fetch proxy, CORS; forbidden headers lost [V] | xterm-pty | Yes (MTTCG) [I] | Yes via coi-sw [I] | Apache-2.0 (+GPL QEMU) | Experimental | Curiosity only |
| 7 | Edge.js / Wasmer SDK, Vivari, Nodepod, almostnode | Possibly (untested) [I] | No | QuickJS-in-Wasm (slow) for Wasmer; V8 for the others | fetch, CORS / WISP relay | Undocumented | Mostly yes | Probably | MIT (Nodepod: +Commons Clause) | Alpha / young | Watch; could replace pieces of #1 |
| 8 | Nodebox | Unlikely (no sync spawn) [V] | No | V8 | fetch, CORS | **None** [V] | No [I] | Yes | Sustainable Use (non-commercial) | **Abandoned (Nov 2023)** [V] | Not viable |
| 9 | Native Node or Bun built for WASI | n/a (doesn't exist) | n/a | — | — | — | — | — | — | — | Not viable |

---

## Recommendation: prototype the polyfill port first, WebContainers second

**1. Polyfill port.** Load the unmodified `cli.js` 2.1.112 from jsDelivr into a tab, with an import map pointing at `@jspm/core` and a dozen small shims. Add a ZenFS or memfs filesystem mirrored to OPFS, a `child_process` router into `just-bash` (with custom `git` via isomorphic-git, `rg`, `which` and `ps`), and a `tty`/`process` shim wired to xterm.js.

- This session already showed the hard part works: the 13.7 MB bundle links unchanged in Chromium, `--help` fully initialises, and `-p` reaches api.anthropic.com.
- It is the only option with native V8 speed, no vendor runtime or servers, no mandatory COOP/COEP, and trivial GitHub Pages hosting.
- just-bash already handles Claude Code's exact Bash-tool wrapper syntax.
- Main risks:
  - the version freeze at 2.1.112 (unless the internals agent can recover JS from the Bun binary);
  - the `child_process`/TTY long tail;
  - CORS and header acceptance by api.anthropic.com (the CORS agent's question).

**2. WebContainers.** Run `npm i @anthropic-ai/claude-code@2.1.112` and spawn `node cli.js` with the `terminal` option, wired to xterm.js, on a Pages site with `coi-serviceworker`. That is about a day's work.

- It gives a real-Node baseline with a real PTY to compare against, and is free for open-source use.
- Its weaknesses are the same CORS dependency, `jsh` instead of bash (fixable with a just-bash Node shim on `SHELL`), no git, and a hard dependency on StackBlitz-hosted runtime code and third-party-cookie-friendly browsers.

**BrowserPod/BrowserCode.** Try the hosted browsercode.io directly as the reference point, rather than building on it. Its vendor egress proxy, token metering, attribution requirement and proprietary runtime make it a poor foundation for an independent open-source app. It is still the yardstick for what "working" looks like.

---

## Sources
**Primary docs and repos**
- WebContainers:
  - webcontainers.io: `/api`, `/guides/quickstart`, `/guides/configuring-headers`, `/guides/browser-support`, `/guides/troubleshooting`, `/enterprise`, `/guides/introduction`, `/tutorial/7-add-interactivity`
  - `@webcontainer/api` 1.6.4 tarball
  - github.com/stackblitz/webcontainer-core issues #2106, #1165, #882, #2150, #2151, #2128, #1341
  - blog.stackblitz.com `/posts/cors-proxy/`, `/posts/introducing-webcontainers/`
  - github.com/garrettmflynn/webcontainers-ghpages
- Nodebox: github.com/Sandpack/nodebox-runtime (README, commits); `@codesandbox/nodebox` 0.1.9 tarball (LICENSE, typings)
- CheerpX / WebVM:
  - cheerpx.io/docs: `/overview`, `/getting-started`, `/guides/Networking`, `/licensing`
  - github.com/leaningtech/webvm (README, `serviceWorker.js`, issue #165)
  - labs.leaningtech.com/blog: `/cx-10`, `/webvm-claude`
- v86: github.com/copy/v86 (README, `docs/networking.md`, issue #1005); v86 0.5.472 npm build; hochej.github.io/pi-mono/mom/v86
- container2wasm / QEMU-wasm: github.com/container2wasm/container2wasm (README, `examples/networking/fetch`); github.com/ktock/qemu-wasm; FOSDEM 2025 "Running QEMU Inside Browser" slides
- Wasmer: wasmer.io/posts/edgejs-safe-nodejs-using-wasm-sandbox; github.com/wasmerio/edgejs; wasmer.io/posts/wasmer-local-sandboxes-for-ai-agents; github.com/wasmerio/wasmer-js
- BrowserPod / BrowserCode:
  - labs.leaningtech.com/blog: `/browserpod-10`, `/browserpod-beta-announcement`, `/browserpod-20`
  - github.com/leaningtech/browserpod-meta; github.com/leaningtech/browsercode (README, `package.json`)
  - browserpod.io: `/pricing`, `/docs/more/licensing`, `/docs/more/FAQ`, `/docs/understanding-browserpod/*`
- Shims and tools:
  - npm READMEs and metadata for `just-bash`, `@zenfs/core`, `xterm-pty`, `almostnode`, `@vivari/core`, `@jspm/core` (tarball)
  - github.com/maitrungduc1410/vivari; github.com/ScelarOrg/Nodepod
- Cross-origin isolation: github.com/gzuidhof/coi-serviceworker; blog.tomayac.com/2025/03/08/setting-coop-coep-headers-on-static-hosting-like-github-pages/; developer.chrome.com/blog/document-isolation-policy
- Claude Code packaging: registry.npmjs.org metadata for `@anthropic-ai/claude-code` and `@anthropic-ai/claude-agent-sdk`; `cli.js` 2.1.112 tarball; jsDelivr and unpkg response headers
- Alpine packages: pkgs.alpinelinux.org (nodejs, edge, x86)

**Experiments in this session**
- Headless Chromium (Playwright build 1243) loading `cli.js` 2.1.112 via import map: `<scratchpad>/research/probe/`
- just-bash idiom tests: `<scratchpad>/research/probe-scripts/jbtest.mjs` and `jbtest2.mjs`
- Native Node 22.22 timings of `cli.js --version` and `--help`
