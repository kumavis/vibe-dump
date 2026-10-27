# F — BrowserPod/BrowserCode vs almostnode: deep dive for in-browser Claude Code

Research date: 2026-10-27. Every claim is tagged **VERIFIED** (seen in source, a fetched page, or a live HTTP response) or **INFERRED** (reasoned from evidence, not directly tested). No third-party code was executed. Repos were cloned read-only into
`<scratchpad>/research/F-src/` (`browsercode/`, `almostnode/`, `almostnode-fork/`, `bp-pkg/` is the npm tarball, and `bp-rt/` holds the downloaded runtime JS and wasm, read only, never run).

---

## TL;DR

* **BrowserPod is the stronger runtime by a wide margin.** It runs real Node v22.15.0 with OpenSSL 3.0.16, compiled to wasm by Cheerp. JS runs on the browser's own V8. It also has real bash, git, rg, ptys, processes and signals, plus a persistent ext2-on-OPFS disk. It already runs a Claude Code build in production (browsercode.io). It has a **built-in Bun polyfill flag** (`--browserpod-polyfill-bun`) whose API set matches what Bun-built Claude Code uses.
* Its big catch is **networking**. All pod TCP/UDP goes over WebSockets to `main.browserportal.io` (Leaning's Cloudflare egress), using the BrowserPod API key and a server-side host allowlist. The public API has no way to plug in your own network or a direct browser `fetch`. On the plus side, TLS terminates inside the pod's Node/OpenSSL, so the proxy should see only ciphertext plus SNI (INFERRED). Because Node does the HTTP, there is **no CORS problem at all**, and full `/login` OAuth for Pro/Max works. BrowserCode does exactly this today.
* Other BrowserPod constraints: it is proprietary, its free "Personal" plan is for non-commercial use, requires **attribution (link + logo)**, and has a token budget (10 tokens per boot). It needs JSPI plus `Atomics.waitAsync` plus cross-origin isolation, does not run on iOS, and offers only **Node 22**.
* **almostnode** (MIT) is a pure-JS Node *emulation*. It needs no COOP/COEP or SAB, and it could plausibly run on iOS. Its fidelity is far lower: `worker_threads` is a no-op stub, `execSync` throws, `AsyncLocalStorage` loses context across `await`, http2 is a stub, zlib has no zstd, bash/rg are JS re-implementations, child output is buffered, and there is no real PTY. Upstream has been abandoned since 2026-02-14. The active fork (BLamy/agent-wasm, last commit 2026-09-08) only pins **2.1.112** (`npx @anthropic-ai/claude-code@2.1.112`), and its e2e tests check only `--version` and launch. A fake session stands in for chat tests. Its default network path sends **every external request through a third-party CORS proxy** (`almostnode-cors-proxy.langtail.workers.dev`) unless you configure `noProxy`.
* **Recommendation: prototype on BrowserPod.** See the comparison table and recommendation at the end.

---

## 1. BrowserPod (Leaning Technologies) + BrowserCode

### 1a. SDK shape and embedding

**Package.** `@leaningtech/browserpod`. Latest is `3.4.0` (2026-10-07), with 59 versions. Its license field is "SEE LICENSE IN LICENSE.txt" (proprietary). VERIFIED: https://registry.npmjs.org/@leaningtech/browserpod

**It is a 13 KB loader.** The whole `index.js` is:

```js
const version="3.4.0"
const dynImport = new Function("x", "return import(x)");
... return await dynImport(`https://rt.browserpod.io/${version}/browserpod.js`);
export const BrowserPod = Library.BrowserPod;
```

So **the runtime always loads from Leaning's CDN** (`rt.browserpod.io`). That works from GitHub Pages. VERIFIED: tarball `F-src/bp-pkg/package/index.js`.

**CDN headers.** `rt.browserpod.io/3.4.0/browserpod.js` serves `access-control-allow-origin: *` and `cross-origin-resource-policy: cross-origin`. That makes it loadable under `COEP: require-corp` from any origin. VERIFIED by a live `curl -D`.

**Runtime payload.** VERIFIED by live download of `https://rt.browserpod.io/3.4.0/*`:

| file | raw | br/gzip on the wire |
| --- | --- | --- |
| browserpod.js | 567 KB | — |
| bpworker.js | 201 KB | — |
| bpnode.js | 114 KB | — |
| bpnode.wasm (Node v22.15.0 + OpenSSL 3.0.16) | 30.6 MB | 12.0 MB |
| kernel.wasm | 699 KB | 348 KB |
| cache.wasm | 157 KB | 78 KB |
| worker.js | 79 KB | 32 KB |

**Disk images.**
* Root image `node22.ext2` is **666 MB**, streamed block-on-demand over `wss://disks.browserpod.io`. VERIFIED (`content-length: 665829376`).
* BrowserCode's `claude_20260506.ext2` has a nominal size of **2 GB** (sparse; only touched blocks stream). VERIFIED by HEAD.
* `disks.browserpod.io` refuses HTTP Range (500) and only serves blocks over its WS protocol. VERIFIED.

**`boot()` options.**
* Documented options are `apiKey`, `nodeVersion` ("Currently only '22' is allowed"), `storageKey` and `userImage`. VERIFIED: https://browserpod.io/docs/reference/BrowserPod/boot
* The runtime also accepts undocumented `rootImage` (replaces `/`) and `apiOrigin` (default `https://main.browserportal.io`, described as "used when self-hosting"). VERIFIED in `browserpod.js` 3.4.0.
* Image URLs may be `http(s)` (served by `createHttpDevice`) or `ws(s)` (served by `createCloudDevice`). VERIFIED in code.

**Mount layout.** VERIFIED in code:
* `/` is the root image plus an OPFS overlay keyed `${storageKey}-node22_3.4.0`.
* `/home` is the user image plus an OPFS overlay keyed `${storageKey}-user`.
* Each overlay falls back to IndexedDB if OPFS is unavailable.
* `/dev` and `/proc` are synthetic.
* `node` and `xdg-open` are registered as ESM programs.

**Minimal embed (VERIFIED API; composed from BrowserCode's `boot.ts` + `fs.ts`):**

```js
// page must be crossOriginIsolated (coi-serviceworker loaded first on GitHub Pages)
const { BrowserPod } = await import('https://rt.browserpod.io/3.4.0/browserpod.js'); // or npm loader
const pod = await BrowserPod.boot({
  apiKey,                                   // BrowserPod key (see 1b)
  storageKey: 'claude',                     // persistent OPFS disk; omit = ephemeral
  userImage: 'wss://disks.browserpod.io/claude_20260506.ext2', // or our own https:// ext2
});
const term = await pod.createDefaultTerminal(document.getElementById('term')); // bundles xterm.js + fit, ResizeObserver
pod.onOpen((url) => window.open(url, '_blank'));        // xdg-open from inside the pod
pod.onPortal(({ url, port }) => {});                    // a pod listen() gets a public URL
await pod.createDirectory('/home/user/project', { recursive: true });
const f = await pod.createFile('/home/user/project/CLAUDE.md', 'utf-8'); await f.write('…'); await f.close();
await pod.run('node', ['/home/user/claude-extracted/src/entrypoints/cli.js'],
  { terminal: term, cwd: '/home/user/project', env: ['COLORTERM=truecolor'] });
```

**Details.**
* `run()` resolves a bare executable name against `PATH` and injects `TERM=xterm-256color PATH=/bin:/usr/bin LC_ALL=en_US.UTF-8 HOME=/home/user`. It throws unless the browser has `Atomics.waitAsync`. VERIFIED in code.
* The docs say `await pod.run()` returns the exit code. BrowserCode's own comment says "resolves on spawn, not exit". The two conflict, so test it. VERIFIED both sources; which is current is unknown.
* `createDefaultTerminal()` exposes the underlying `xterm` instance as an undocumented `.xterm` property. VERIFIED: BrowserCode uses `terminal.xterm.onWriteParsed`.
* For your own xterm, use `createCustomTerminal({cols, rows, onOutput})`. Input goes in through an **undocumented `terminal.readData(bytes)`**. VERIFIED in the runtime class.
  * The custom terminal has no resize method. INFERRED from the class, which only implements `write` and `readData`.
  * Easiest path: let BrowserPod own the xterm through `createDefaultTerminal`.
* Page↔pod file access goes through `createFile`/`openFile` (`'binary'` or `'utf-8'`) and `createDirectory`. These hit the same VFS the pod sees. VERIFIED: docs and BrowserCode `src/lib/pod/fs.ts`.

**COOP/COEP.** Required, because the runtime uses SharedArrayBuffer. Docs only mention real headers (Vite dev and nginx), with no word on coi-serviceworker. VERIFIED: https://browserpod.io/docs/understanding-browserpod/cross-origin-isolation and https://browserpod.io/docs/guides/hosting

**Does coi-serviceworker suffice? INFERRED yes:**
* Every cross-origin runtime asset sends CORP `cross-origin` plus ACAO `*`.
* Workers are spawned from blob/inline bootstrap code that `import()`s the CDN scripts (`bpnode.js` uses `onmessage=(e)=>{…import(mp2.script)…}`), so they inherit the creator's COEP.
* Disk and network use WebSockets, which COEP does not affect.
* Not tested end to end.
* BrowserCode's `podBlocker()` checks `crossOriginIsolated`, `Atomics.waitAsync` and `WebAssembly.promising` (JSPI); BrowserPod ≥3.1.0 boots through JSPI. VERIFIED: `browsercode/src/lib/utils/platform.ts`, commit `5cca8cb`.

**Zero-code baseline.** You can iframe `https://browsercode.io/embed?agent=claude` with `allow="cross-origin-isolated"` on an isolated host page. That runs on Leaning's key and their pinned image. "`claude` opens a new tab for OAuth sign-in", and only one agent session runs per browser. The `/agents*` routes are frame-locked; `/embed` is not. VERIFIED: `browsercode/docs/embedding.md`, `static/_headers`, `static/llms.txt`.

### 1b. API key model, tiers, non-commercial

**The key is client-visible by design.**
* Docs: "In a browser app, the key will ultimately be available to the client."
* Docs call inline keys "fine for quick prototypes but not ideal for production".
* VERIFIED: https://browserpod.io/docs/understanding-browserpod/api-key
* The runtime puts the key in the WebSocket query string: `wss://main.browserportal.io/init?apiKey=…` and `/conn?apiKey=…`. VERIFIED in code.
* The console has a **"Keys & Domains"** tab, but the docs don't explain it, so origin-restricted keys are UNVERIFIED. Server-side Origin checks on the WS handshake would be possible. INFERRED.

**Metering.** VERIFIED: https://browserpod.io/browserpod-pricing-policy
* Tokens are worth $0.001 each.
* **A boot costs 10 tokens.** A session lasts up to 1 h; each extra hour costs 10 tokens, and pods may be killed after 10 h.
* **Personal (free): "non-commercial and technical evaluation", bundled with 10,000 tokens**, which is about 1,000 boots. The policy does not say whether that is monthly or one-time.
* Pro: $20/mo with 20k tokens, $10 per extra 10k, and a 1M/month fair-use cap.
* `boot()` "fails if there are not enough tokens". VERIFIED in the boot reference.
* Bandwidth, egress and pod concurrency are not metered in the policy. BrowserCode's agent-facing CLAUDE.md says "Concurrency is not metered". VERIFIED.

**Non-commercial use.**
* npm README: "free to use for personal and open-source projects … Generous token grants are available for start-ups and open-source projects." VERIFIED: tarball README.
* A personal OSS hobby app fits "non-commercial". INFERRED.
* **The Personal plan requires visible attribution (link + logo).** VERIFIED: https://browserpod.io/docs/more/licensing and the TOS.

**Practical implication.** Shipping our key on a public page means every visitor's boot spends our token pool, and abuse is our liability. The TOS says "You are entirely responsible for the traffic generated by the end-users…" and includes an indemnity. VERIFIED: https://browserpod.io/browserpod-tos

The cleaner design is **bring-your-own BrowserPod key**: the user signs in with GitHub at console.browserpod.io and pastes the key next to their Claude token. That design is INFERRED. The GitHub sign-in itself is VERIFIED in the quickstart.

### 1c. Networking

**Everything goes through their egress; it cannot be overridden through the public API.** VERIFIED in `browserpod.js` 3.4.0:
* The pod's network interface is hard-wired in `init()` as `new N(apiKey, apiOrigin, "192.168.1.100", …)`.
* It exposes Direct-Sockets-shaped `TCPSocket`/`UDPSocket`/`TCPServerSocket` and tunnels raw TCP/UDP frames over pooled WebSockets to `main.browserportal.io` (`/init` for inbound/portals, `/conn` for outbound).
* DNS replies carry per-domain "nettokens" that gate which IPs you may connect to. That is how the allowlist is enforced. INFERRED from the `nettokens` and `storeNetTokens`/`netTokensFor` logic.
* The underlying CheerpOS `create()` accepts a `networkInterface` option, but `BrowserPod.boot` does not expose it.
* The only knob is the undocumented `apiOrigin`, meaning your own portal server ("self-hosting" is an Enterprise offer). That is useless for a static site.
* The worker also does `delete self.XMLHttpRequest`, so there is no browser-fetch side channel from pod code.

**TLS terminates inside the pod.** INFERRED, with strong evidence:
* `bpnode.wasm` contains `OpenSSL 3.0.16` and `v22.15.0` (VERIFIED with `strings`).
* The transport carries raw TCP bytes.
* So Leaning's proxy should see destination IP, SNI and ciphertext, not the OAuth token.
* Caveats: Leaning controls the root image, including its CA store, and the TOS says "We keep logging information about that traffic". The privacy policy URL returned 404 when fetched.

**Allowlist.**
* BrowserCode README and llms.txt: "HTTPS only, to an allowlist that includes the npm registry, Yarn 2+, GitHub (`github.com`, `raw.githubusercontent.com`) and the major AI provider APIs". Not allowed: `api.github.com`, `codeload.github.com`, GitHub release downloads, PyPI, plain HTTP, other ports, SSH and pod-local `localhost`. VERIFIED: `browsercode/README.md`, `static/llms.txt`, `static/project/claude/CLAUDE.md`.
* "paid plans can add custom outbound domains" and "reach out to us on Discord". VERIFIED.
* **`api.anthropic.com`:** effectively VERIFIED. BrowserCode's Claude Code works through it.
* **`platform.claude.com` / `claude.com` OAuth:** INFERRED allowed. BrowserCode's Claude login rewrites the redirect to `https://platform.claude.com/oauth/code` and does the code exchange from Node inside the pod. Its docs describe that flow as working: "open the sign-in URL … paste the code".
* **`registry.npmjs.org`:** VERIFIED allowed. BrowserCode installs Pi with `curl` from it inside the pod.
* The full list is server-side and not enumerable from the client.

**Consequence for us.**
* Upside: the whole CORS problem disappears. `/v1/messages`, OAuth token refresh and every `/api/*` call go from Node over sockets, so subscription `/login` works and a pasted setup-token is optional.
* Downside: the token cannot be made to bypass Leaning's egress through supported APIs.
* A hack is possible: an in-pod `--require` preload overrides `fetch` for api.anthropic.com and relays to the page, which then does a direct CORS `fetch`. The relay could run over a helper process on a custom terminal (`onOutput` / `readData` form a byte pipe) or over polled files.
  * It is ugly. The pod can't reach its own `localhost`, so a local proxy server won't work.
  * It is arguably in tension with the TOS "no modify/reverse engineer" clause.
  * Not recommended unless "token never touches third-party infra, even encrypted" is a hard requirement.

### 1d. Custom images, runtime file injection, persistence

**Custom `/home` image:** documented (`userImage`: "A URL pointing to a custom ext2 filesystem image … mounted directly on the Pod's /home"). VERIFIED.
* An `https://` URL is served by `createHttpDevice`. The deep-dive post says the backend can be "any HTTP server using byte ranges". VERIFIED: blog https://labs.leaningtech.com/blog/browserpod-deep-dive
* GitHub Pages serving a ≤100 MB ext2 with Range support should work. INFERRED, untested; GitHub Pages' Range support is assumed.
* `rootImage` (undocumented) could even replace `/`.
* Nothing documents how to build the images. Any `genext2fs`/`mke2fs -d` image should do. INFERRED.

**Writing files at runtime from the page:** VERIFIED (`createFile(path,'binary')` plus `write(ArrayBuffer)`). BrowserCode copies static assets into the pod this way.

So the page could:
* fetch `@anthropic-ai/claude-code-linux-x64@2.1.311` from npm (CORS `*`; tarball **133 MB**, 294 MB unpacked; VERIFIED live), or
* fetch a smaller extracted bundle from our own origin,

then extract it and drop the JS plus polyfill into `/home/user/...`.

Alternatively, curl the tarball from npm *inside* the pod, which works because npm is allowlisted. BrowserCode's Pi installer does this, and warns that "BrowserPod truncates a pipe this large", so it decompresses to a file before `tar`. VERIFIED: `src/lib/agents/pi.ts`.

Redistributing extracted Claude Code JS from our own origin is a licensing question, because the package license is "SEE LICENSE IN README.md" (proprietary). VERIFIED metadata. Extracting client-side from npm avoids hosting it.

**Persistence:** `storageKey` gives a persistent OPFS (else IDB) copy-on-write overlay. VERIFIED in code and docs.
* `/home` holds 2 GB (changelog 2.0.0).
* Persistence is scoped to the origin, and clearing site data loses it.
* BrowserCode allows one agent session per browser. INFERRED cause: exclusive OPFS handles.

**Node features relevant to Claude Code.**
* Changelog (VERIFIED: https://browserpod.io/docs/more/changelog):
  * 3.1.0: "Node: support for command line arguments", "custom loaders", "running scripts directly as executables".
  * 2.19.0: "Support ptys".
  * 3.4.0: "Fix terminal input when programs switch between line and raw mode"; signal numbers.
  * 3.3.0: `Atomics.waitAsync`.
  * 2.15.0: `node:sqlite`.
  * 2.11.0 / 2.13.0: "Polyfill some bun APIs", "Activate the Bun polyfill only under the —browserpod-polyfill-bun cli argument".
* **The built-in Bun polyfill:** in 3.4.0, `node --browserpod-polyfill-bun …` sets `self.Bun` to an object with:
  * implemented: `stringWidth`, `stripANSI`, `wrapAnsi`, `hash` (a murmur-style 64-bit), `which`;
  * empty stubs: `embeddedFiles`, `gc`, `generateHeapSnapshot`, `JSONL`, `listen`, `semver`, `spawn`, `Terminal`, `Transpiler`, `version`, `YAML`.
  * `which` returns only `node` and `npm`.
  * VERIFIED in `bpworker.js`, module 530.
  * That API set looks aimed at Claude Code's Bun usage. You'd still layer the FreeBSD `bun-polyfill.cjs`/`bun-ant-shim.cjs` on top through `--require`.
* **Async context:** the runtime replaces `Promise` and rewrites async functions/generators with an acorn and astring AST pass (`bpHandleGenerator`, `bpForAwaitReturn`). It implements `bpSetPromiseHooks` and `get/setContinuationPreservedEmbedderData`, so **`AsyncLocalStorage` should behave like real Node**. INFERRED from code.
* **Node version risk:** BrowserPod offers **only Node 22**, but the FreeBSD port (`misc/claude-code` 2.1.310) depends on **www/node24**. It extracts "using the unhare extractor" and ships `bun-polyfill.cjs` and `bun-ant-shim.cjs`. VERIFIED: https://www.freshports.org/misc/claude-code/
  * JS *language* features come from the browser's V8, so newer syntax and builtins are fine.
  * Node-24-only *module APIs* would need polyfilling. INFERRED risk, and it should be the first thing to test.

### 1e. How BrowserCode got `claude-extracted`, status, Anthropic

**History.** VERIFIED in BrowserCode git history:
* Before 2026-05-06 the config was `command:'npm', args:['run','claude']` with image `claude_20260428.ext2`.
* Commit `a182ac3` (2026-05-06, Alessandro Pignotti) switched to `node claude-extracted/src/entrypoints/cli.js` and image `claude_20260506.ext2`.
* The live site still uses that image. VERIFIED: deployed JS chunk on browsercode.io contains `claude_20260506.ext2`.

**Extraction method is not published.**
* The repo has no image-build or extraction tooling; I grepped all of history. VERIFIED.
* No issue, blog post or doc mentions it. The deep-dive blog doesn't mention Bun or extraction. VERIFIED.
* Leaning's CTO Alessandro Pignotti (`apignotti`) said on HN: "The version of Claude Code you see running is completely unmodified." VERIFIED: https://news.ycombinator.com/item?id=48425347
* The `src/entrypoints/cli.js` layout mirrors Claude Code's TypeScript source tree, not a single Bun bundle. That suggests either a source-tree reconstruction or a per-module extraction. The npm `cli.js` ≤2.1.112 is a single file. INFERRED; the image can't be inspected without speaking their WS block protocol, which the TOS forbids reverse-engineering.
* **Which Claude Code version is in the image is unknown.**
* BrowserCode does **not** pass `--browserpod-polyfill-bun`. VERIFIED.

**Status today.**
* The repo is very active: 319 commits, last on 2026-10-26, v1.3.0. VERIFIED.
* Open Claude issues: #18 bracketed paste fails, #19 Pre/PostToolUse hooks hang the pod (maintainer couldn't reproduce), #23 copy-to-clipboard, #15 MCP servers. #20 (MCP needing localhost) is closed. No open "login broken" or "API broken" issue. VERIFIED: https://github.com/leaningtech/browsercode/issues
* Claude Code is listed as "✅ Beta open now". VERIFIED.

**Anthropic:** no public Anthropic comment on BrowserCode or BrowserPod found after searching. Not found ≠ none.

### 1f. Licensing / terms

* BrowserCode is **Apache-2.0**. VERIFIED (`LICENSE.txt`).
* The BrowserPod SDK and runtime are **proprietary**. Use is "conditioned upon acceptance" of the TOS, pricing and privacy policies. VERIFIED: npm `LICENSE.txt`.
* TOS clauses that matter. VERIFIED: https://browserpod.io/browserpod-tos
  * Personal plan is "strictly non-commercial" and requires attribution.
  * No "modify, reproduce, sell, reverse engineer … or create derivative works based on the Services".
  * The key holder is responsible and liable for end-user traffic.
  * The key holder must keep API keys confidential. This is in tension with the docs' admission that browser keys are public.
  * Traffic is logged.
  * Leaning may "restrict, suspend, or terminate your individual access … at any time".
  * Data is hosted in the EU.
* **No clause mentions AI-provider traffic, Anthropic/OpenAI, or third-party credential handling.** VERIFIED: absent from the TOS text.
* Building a public, non-commercial hobby app with attribution appears allowed. INFERRED.

### 1g. Performance

* **No published numbers** for boot time, npm install, memory or TUI throughput, in the docs, blogs or changelog. VERIFIED absence; the 2.0 post only says "faster networking and disk access".
* Claims: Node is "modified to run JavaScript payloads on the browser's own JavaScript engine … native-like performance"; there is one Web Worker per process/thread; disks stream on demand and cache in OPFS/IDB. VERIFIED: deep-dive blog.
* `getTotalMem()` reports 1 GiB. Kernel and userspace memory became resizable in 2.14.0. VERIFIED: `bpworker.js` and changelog.
* **INFERRED cold-start cost:** about 13.5 MB of runtime on the wire (mostly the 12 MB `bpnode.wasm`), plus the on-demand blocks of the 666 MB root image and the Claude image. Expect several seconds on first visit and fast warm boots after that, because the CDN caches for 1 year and blocks persist in OPFS.
* The Promise replacement and async→generator rewriting add overhead on Promise-heavy code like Ink and the SDK. INFERRED. A closed BrowserCode issue (#36) reports high Safari CPU that scales with terminal width.
* Measure before trusting "near-native".

---

## 2. almostnode

### 2a. License, maintenance, packages

**Upstream `macaly/almostnode`.** VERIFIED: https://github.com/macaly/almostnode, https://registry.npmjs.org/almostnode
* **MIT.** Built by Petr Brzek, co-founder of Macaly (an AI website builder) and of Langtail. He made 94 of 96 commits.
* **Last commit 2026-02-14.** npm `almostnode@0.2.14` (2026-02-14) is 16 MB unpacked.
* 1.2k stars, 9 open issues.
* Issue #10 "Is it possible to run Claude Code inside?" has had no maintainer reply since February. Issue #20 says it can't deploy under a non-root base path such as GitHub Pages.
* Effectively unmaintained.

**Fork `BLamy/almostnode`, renamed "agent-wasm".** VERIFIED: clone and https://github.com/BLamy/almostnode
* **MIT** ("agent-wasm contributors"). Brett Lamy made 128 commits, from 2026-07-26 to **2026-09-08**. 0 stars.
* Published as `@agent-wasm/core@0.4.0` (2026-07-25, **296 MB unpacked**), `@agent-wasm/sdk`, and `@agent-wasm/code`. npm maintainer: `bel423`.
* The hosted demo runs on **GitHub Pages** at `blamy.github.io/almostnode/`. VERIFIED: live fetch. So the fork does deploy under a sub-path.

**Shell.** `just-bash` (Vercel's Malte Ubl, Apache-2.0, v3.6.0) is a TypeScript bash interpreter over an in-memory FS. It accepts `defineCommand` for custom commands, and "Commands can be invoked by path (e.g., /bin/ls) or by name". VERIFIED: npm README.

### 2b. Architecture

**Thread.**
* `createContainer()` runs code **on the main thread** in the page realm: "runs code on the main thread with full access to your page". VERIFIED: upstream README.
* `WorkerRuntime` and the cross-origin-iframe `SandboxRuntime` exist.
* The fork's workbench, sdk and web-ide use `createContainer`, so Claude Code runs on the UI thread. VERIFIED by grep.

**COOP/COEP/SAB: not needed.**
* Core has no SharedArrayBuffer, Atomics.wait or crossOriginIsolated usage. VERIFIED by grep.
* It **does need a Service Worker** for its ESM module graph (`/__modules__/r` route, `TransportMode 'service-worker'`), for dev servers and for HTTP interception. VERIFIED: `module-graph-loader.ts`, README.
* A same-origin SW is fine on GitHub Pages.

**Module loading.**
* CJS runs through an eval wrapper.
* ESM goes through an acorn rewrite (`import.meta` → `__almostnode_import_meta` with `url`/`filename`/`dirname`; `import()` → `__dynamicImport`) and is served by the SW. TS and TSX are transpiled with esbuild-wasm.
* There is no `import.meta.require` or `import.meta.dir` (Bun-isms). VERIFIED: `runtime.ts`, `module-graph-loader.ts`.

**`child_process`.** The fork's `shims/child_process.ts` is **8,204 lines**.
* `spawn` turns the argv into a shell string and runs `controller.runCommand()` in just-bash. **stdout/stderr are delivered all at once on completion, not streamed.** The comment says streaming "interleaves with Claude Code's UI rendering and garbles output". VERIFIED: `spawnWithBinding`, around L5798.
* `node <script>` is a just-bash command that builds a **new in-process `Runtime`** (same thread, shared VFS) and fakes `process.exit` by throwing. VERIFIED: L1570–1700.
* `execSync` **throws** ("not supported in browser environment") except for synthetic probes. VERIFIED: L5600.
* Signals are emulated: `kill()` just emits `exit`/`close` with SIGTERM. `detached` is accepted but meaningless. VERIFIED.
* `process.execPath = '/usr/local/bin/node'`. VERIFIED: `process.ts` L417.

**TTY.**
* `tty.ReadStream.setRawMode` only flips a flag, and `isTTY` defaults to false.
* Inside a terminal-attached `node` run, the fork sets `isTTY = true` and records raw mode to keep stdin attached. VERIFIED: `shims/tty.ts`, `child_process.ts` L1743–1750 and L2014–2023.
* There is no PTY. Ink sees a fake TTY with column and row values.

**Networking.**
* `globalThis.fetch` and `XMLHttpRequest` are **patched page-wide**. VERIFIED: `runtime.ts` L1948–1965.
* The `http`/`https`/`undici` shims call into `network/fetch.ts`.
* Per-request routing: `resolveBrowserFetchTarget` proxies every external URL through `policy.browser.corsProxyUrl` unless the host matches `proxy.noProxy`.
* **The default proxy is `https://almostnode-cors-proxy.langtail.workers.dev/?url=`**. That means OAuth tokens transit a third-party Worker unless you configure otherwise.
* Overrides: `options.corsProxy`, `CORS_PROXY_URL`, `localStorage.__corsProxyUrl`. VERIFIED: `network/policy.ts` L11, L240–257, L540–563.
* **So a per-host override is possible:** set `noProxy` to `api.anthropic.com` (direct CORS) and point `corsProxy` at something that fails closed.
* Optional Tailscale-in-wasm exit node (`network/tailscale-connect-*`). Its tests route `api.anthropic.com` and `platform.claude.com/oauth/token` through it. VERIFIED: `tests/network.test.ts`.

**Persistence.** The in-memory VFS can be snapshotted to IndexedDB (`createIndexedDbSnapshotStore` in `almostnode-sdk/src/workspace.ts`). OPFS is not used. VERIFIED.

### 2c. Built-ins Claude Code needs

From `packages/almostnode/src/shims/` in the fork. 48,352 total lines across the shims. VERIFIED by reading each file.

| module | status |
| --- | --- |
| `worker_threads` | **stub**: `Worker` warns "not fully supported" and `postMessage` is a no-op; `isMainThread = true` (111 lines) |
| `net` / `tls` | virtual sockets / "TLS/SSL is not available in browser — stubs" (420 / 168 lines) |
| `http2` | **stub** ("HTTP/2 is not available in browser") |
| `vm` | `eval` / `new Function` (no real contexts) |
| `async_hooks` | `AsyncLocalStorage` is a sync save/restore stack, so **context is lost across `await`**; the fork's changelog hit this ("AsyncLocalStorage shim that is a plain stack") |
| `inspector` | no-op stub |
| `dns` | shim routed through the network controller |
| `zlib` | pako (gzip/deflate) + brotli-wasm (brotli sync only after async init); **no zstd** |
| `fs.watch` | supported via VFS watchers (`vfs.watch`) |
| `child_process` | async spawn via just-bash, buffered output; `execSync` throws; no real signals/detach |
| `readline` | `createInterface`, `emitKeypressEvents`, cursor helpers (228 lines) |
| `tty` | flag-only raw mode, fake TTY |
| `rg` / `grep` / `fd` | JS re-implementations over the VFS with a subset of flags (`executeRgCommand`) |
| `git` | isomorphic-git-backed command (3,070 lines) |

### 2d. Running *current* extracted Claude Code on almostnode

Hard. INFERRED effort is 2–4+ weeks, with high risk. Each step needs:

1. **The FreeBSD Bun polyfill**, adapted. The fork already has an OpenCode browser Bun shim that its tests exercise against Claude Code helpers: `semver`, `YAML`, `hash` seed-chaining, `JSONL.parseChunk`, `wrapAnsi`, `which`, `embeddedFiles`, `bun:bundle feature()`.
   * VERIFIED: `apps/web-ide/tests/opencode-bun-shim.test.ts`, `tests/fixtures/claude-code-bun-compat.ts`.
   * The test imports a local `/Users/brettlamy/Downloads/claude-code/utils/*.ts` checkout. The shim source itself lives in `vendor/opencode`, which was not populated in the clone.
2. **Rewrites for `import.meta.require`/`dir`**: the loader gives only `url`, `filename` and `dirname`.
3. **A global `Worker` / `worker_threads`**: currently a no-op. Any code path that awaits a worker reply hangs.
4. **Self-respawn through `process.execPath`**: just-bash resolves `/usr/local/bin/node` by name, so spawning `node <script>` *does* start a new in-browser runtime. But it is synchronous-ish, shares the thread, has buffered I/O, and has no detached or background process model.
5. **`execSync`/`spawnSync` call sites**: these throw.
6. **AsyncLocalStorage across `await`**: subagent and tool context would be broken.
7. **Bundle size**: one ~10+ MB file through acorn rewriting on the main thread.

ESM with `import.meta` is supported (rewritten). `child_process` can run `node <script>` as a new in-browser process, but only with buffered output and no real concurrency. VERIFIED mechanics; feasibility INFERRED.

### 2e. Fork tricks worth copying

All VERIFIED paths in `BLamy/almostnode`:

* `packages/code/src/claude-transcript-tail.ts` (+ `claude-conversation-adapter.ts`, `claude-threads.ts`): tails `~/.claude/projects/*/*.jsonl` and maps lines (incl. usage) into chat messages and tool-call cards.
* `packages/chat-core/src/agent-session-registry.ts` (`BRACKETED_PASTE_START/END`, `SUBMIT_DELAY_MS=60`, `ready` promise): injects chat input as a bracketed paste and presses Enter after 60 ms. It waits for the TUI to be ready, because raw-mode init flushes earlier stdin.
* `packages/keychain/src/keychain.ts` (+ `packages/workbench/src/features/claude-auth-vault.ts`): a WebAuthn **PRF → HKDF → AES-GCM** vault that mirrors `/home/user/.claude/.credentials.json`, `.claude/.config.json` and `.claude.json` across sandbox VFSes and restores them on unlock.
* `packages/keychain/src/oauth-services/{authorize-popup,orchestrator,pkce,discovery,registration}.ts`: a generic **MCP OAuth** (DCR + PKCE) popup. It opens the popup synchronously in the click handler, relays back through `/oauth/callback` `postMessage` plus a BroadcastChannel backchannel, and is COOP-tolerant. It is *not* Claude's own `/login`.
* `packages/almostnode/src/shims/child_process.ts`:
  * L143–153: `DEFAULT_BROWSER_CLAUDE_CODE_PACKAGE = "@anthropic-ai/claude-code@2.1.112"`, with the comment explaining why 2.1.113+ (Bun native binary) can't run.
  * L3503–3530: a `claude-wrapper` command that runs `npx --yes <pin>` with `CLAUDE_CODE_NO_FLICKER=1`.
  * L1743–1750 and L2014–2023: raw-mode stdin kept attached.
  * L2270 and L4760: install output buffered rather than streamed to avoid Ink garbling.
  * Yoga-layout preload: L1755+.
* `packages/code/src/claude-ide-server.ts` + `packages/workbench/src/features/claude-ide-bridge.ts`: an MCP-over-SSE "IDE" server so Claude Code sees editor state (open file, selection, diagnostics).
* `network/policy.ts` `noProxy` / `corsProxy` and `tests/network.test.ts`: per-host routing for `api.anthropic.com` and `platform.claude.com`.

### 2f. Perf and end-to-end status

* **No perf numbers** for Claude Code on almostnode, anywhere. The README's general claims ("~250KB gzipped", "Instant" startup vs WebContainers) are self-reported and unbenchmarked. VERIFIED.
* **E2E:** the fork's Playwright suite `e2e/shadcn-claude-code.spec.ts` asserts that `npx @anthropic-ai/claude-code --version` boots and that the interactive CLI starts without console errors, CORS failures or `Bun.which` errors. **The chat e2e uses a fake Claude session** ("without requiring real agent credentials"). VERIFIED.
* Changelog entries imply the author ran real interactive sessions:
  * "First chat message no longer lost: input injection now waits for Claude's MCP client to connect"
  * transcript-driven chat
  * a model picker
  * VERIFIED text; real turns INFERRED.
* **No public evidence of a real API turn plus a Bash tool call** on almostnode. Upstream issue #10 asking exactly that is unanswered.

---

## 3. Comparison

| | **BrowserPod (+ BrowserCode pattern)** | **almostnode (BLamy fork)** |
| --- | --- | --- |
| Runs current extracted Claude Code (2.1.311)? | **Plausible**. Real Node, processes, workers and ALS; a built-in partial Bun polyfill flag; add the FreeBSD polyfill through `--require`. Main risk: only Node 22 is offered while the FreeBSD port targets node24 (INFERRED) | **Unlikely without major work**: no worker_threads, execSync throws, ALS is broken, buffered I/O, no `import.meta.require` |
| Runs 2.1.112 `cli.js`? | Yes. It is plain Node 22 code. INFERRED, but BrowserCode already runs a May-2026 build | **Yes, demonstrated** to launch (`--version` and TUI start in e2e); real turns not evidenced publicly |
| bash / rg / git fidelity | **Real** GNU bash, git, rg, fd, curl, coreutils, npm/pnpm, python3 stdlib, compiled to wasm; ptys, signals, background jobs (`timeout` is broken) | just-bash TS interpreter; JS rg/grep subset; isomorphic-git; no PTY or real processes |
| Direct-CORS fetch to api.anthropic.com possible? | **No** via the public API. All egress uses Leaning's WS proxy (TLS end-to-end inside the pod, INFERRED). Only an in-pod preload plus terminal/file relay hack would work | **Yes**: `noProxy=api.anthropic.com`. Must disable the default langtail CORS proxy for everything else |
| CORS-blocked OAuth and `/api/*` | **Works** (Node sockets, no CORS), so Pro/Max `/login` works | Blocked unless routed through a CORS proxy or Tailscale exit node, so you need a setup-token |
| Third-party dependency and key | Leaning CDN, disk WS, egress proxy; BrowserPod API key (client-visible, 10 tokens per boot, free Personal quota of about 1k boots); attribution required | None required. The default CORS proxy is third-party but optional; npm registry for installs |
| COOP/COEP | **Required** (SAB). coi-serviceworker should work (INFERRED). Also JSPI plus `Atomics.waitAsync` | **Not required**. Needs a same-origin Service Worker (fine on Pages) |
| iOS | **No** (BrowserCode blocks iOS: "pod.run never returns") | Probably yes (pure JS). INFERRED, untested |
| Browsers | Chrome/Edge 137+, Firefox 153+, Safari 27+ | Any modern browser |
| License | Proprietary runtime (Personal = non-commercial only; no reverse engineering); BrowserCode Apache-2.0 | MIT (+ just-bash Apache-2.0) |
| Perf | JS on browser V8 (JIT) in workers; about 13.5 MB runtime plus streamed disk; Promise/async rewriting overhead; no published numbers | Main-thread JS, no wasm kernel; cheap to start, but Claude Code's Ink render and tools share the UI thread; no numbers |
| Maintenance | Very active (runtime 3.4.0 on 2026-10-07; BrowserCode commits on 2026-10-26) | Upstream dead since 2026-02; fork single-author, last commit 2026-09-08 |
| Estimated effort to first API turn | **0.5–1 day** reusing BrowserCode's public image `claude_20260506` + `/login` or setup-token; **3–7 days** for current 2.1.311 (in-page or in-pod extraction plus polyfill plus Node 22 gaps) | **2–5 days** for 2.1.112 (vendor `@agent-wasm/core`, set noProxy, inject `CLAUDE_CODE_OAUTH_TOKEN`, tolerate blocked `/api/*`); **weeks** for current |

### Recommendation

**Prototype on BrowserPod.** It is the only one of the two that gives Claude Code a real OS: actual Node 22 with OpenSSL, real bash/git/rg, ptys, signals, worker threads, and working AsyncLocalStorage. It already ships Claude Code to the public at browsercode.io, and it even has a dormant `--browserpod-polyfill-bun` switch aimed at Bun-built CLIs.

Because pod networking is raw TCP from Node rather than browser `fetch`, it also removes the CORS wall. Subscription `/login`, token refresh and `/api/*` all work, which almostnode can only get through a third-party CORS proxy or Tailscale.

Plan:
* **Step 1:** load `rt.browserpod.io/3.4.0` on a coi-serviceworker GitHub Pages page with a *user-supplied* BrowserPod key, and boot BrowserCode's public `claude_20260506.ext2`. That gets a first real turn in under a day.
* **Step 2:** produce the current 2.1.311 JS (unhare/FreeBSD method). Inject it at runtime with `createFile`, or with an in-pod `curl` from npm, or ship it as our own `userImage`. Run it as `node --browserpod-polyfill-bun --require /home/user/bun-polyfill.cjs cli.js`. Treat Node-22-vs-24 API gaps as the first thing to measure.

Accept these costs consciously:
* a proprietary runtime with a revocable key and attribution;
* no iOS;
* encrypted-but-proxied egress through Leaning, with no direct-CORS path short of an unsupported relay hack.

**Keep almostnode as the fallback** if any of those becomes a deal-breaker, especially iOS, zero third-party infrastructure, or no COOP/COEP. It is MIT-licensed, header-free and can do direct CORS. Use it via the BLamy fork, pinned to 2.1.112, and copy its transcript-tail, bracketed-paste and PRF-vault pieces. Running the *current* Claude Code on it would mean writing worker_threads, sync child_process and async-context emulation yourself.

---

## Sources

* BrowserCode repo: https://github.com/leaningtech/browsercode (files: `src/lib/config/tools.ts`, `src/lib/agents/boot.ts`, `src/lib/agents/pi.ts`, `src/lib/pod/fs.ts`, `src/lib/utils/platform.ts`, `static/llms.txt`, `static/project/claude/CLAUDE.md`, `static/_headers`, `docs/embedding.md`; commits `a182ac3`, `648062b`, `5cca8cb`)
* BrowserCode issues: https://github.com/leaningtech/browsercode/issues, https://github.com/leaningtech/browsercode/issues/19
* npm SDK: https://registry.npmjs.org/@leaningtech/browserpod (tarball 3.4.0: `index.js`, `index.d.ts`, `README.md`, `LICENSE.txt`)
* Runtime: https://rt.browserpod.io/3.4.0/browserpod.js, `/bpworker.js`, `/bpnode.js`, `/bpnode.wasm`, `/kernel.wasm`, `/node22.ext2`; `https://disks.browserpod.io/claude_20260506.ext2`
* Docs: https://browserpod.io/docs/overview, https://browserpod.io/docs/reference/BrowserPod/boot, https://browserpod.io/docs/reference/BrowserPod/run, https://browserpod.io/docs/understanding-browserpod/api-key, https://browserpod.io/docs/understanding-browserpod/cross-origin-isolation, https://browserpod.io/docs/understanding-browserpod/filesystem, https://browserpod.io/docs/guides/hosting, https://browserpod.io/docs/guides/common-errors, https://browserpod.io/docs/more/FAQ, https://browserpod.io/docs/more/licensing, https://browserpod.io/docs/more/changelog, https://browserpod.io/docs/getting-started/quickstart
* Terms: https://browserpod.io/browserpod-pricing-policy, https://browserpod.io/browserpod-tos (privacy policy URL returned 404)
* Blogs: https://labs.leaningtech.com/blog/browserpod-deep-dive, https://labs.leaningtech.com/blog/browserpod-20, https://labs.leaningtech.com/showcase/browsercode
* HN (apignotti "completely unmodified"): https://news.ycombinator.com/item?id=48425347
* FreeBSD port: https://www.freshports.org/misc/claude-code/
* almostnode upstream: https://github.com/macaly/almostnode, https://github.com/macaly/almostnode/issues, https://github.com/macaly/almostnode/issues/10, https://registry.npmjs.org/almostnode
* almostnode fork: https://github.com/BLamy/almostnode (files cited inline), https://blamy.github.io/almostnode/, https://registry.npmjs.org/@agent-wasm/core
* just-bash: https://registry.npmjs.org/just-bash
* Claude Code npm metadata: https://registry.npmjs.org/@anthropic-ai/claude-code (2.1.112 dated 2026-04-16; 2.1.311 ships `bin/claude.exe` plus platform optionalDependencies; `claude-code-linux-x64-2.1.311.tgz` is 132.8 MB)
