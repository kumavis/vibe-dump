# Claude Code in the browser — feasibility research

*Researched 2026-10-27 by six parallel research subagents coordinated by a
project-manager session. The per-agent reports with raw evidence, probe
tables and VERIFIED/INFERRED marks on every claim are in
[`claude-code-in-browser/`](./claude-code-in-browser/).*

**Goal.** Run "some version of the Claude Code harness" entirely client-side
in a browser tab, as a static app in this gallery (GitHub Pages: no server, no
custom response headers), with decent performance, against a Claude Pro/Max
subscription.

## TL;DR

1. **Feasible, and the fast path is not emulation.** The right runtime is the
   browser's own JavaScript engine running Claude Code's JS with Node-API
   shims around it. We proved the core of this in-session: the official
   13.7 MB `cli.js` (v2.1.112) loads unmodified in headless Chromium behind an
   import map, prints `--version` and `--help`, and a `-p` turn reaches real
   requests to `api.anthropic.com`. Cold start was about 3x native Node;
   steady state is native V8 speed. x86 emulation of the native binary
   (CheerpX, v86, container2wasm) is 10x to 2500x slower, 32-bit only in two
   of three cases, and has no serverless network path. Ruled out.
2. **CORS is not a blocker for inference, but it is for login.** Probed from a
   real Chromium on the real `https://kumavis.github.io` origin:
   `POST /v1/messages` and `count_tokens` allow any origin when the request
   carries the `anthropic-dangerous-direct-browser-access` header, which
   Claude Code already sends on every request. The OAuth token endpoint and
   every `/api/*` side call are allowlisted to Anthropic's own origins and
   cannot be reached from a static page. The proxy-free answer is to have
   the user mint a one-year inference-only token with `claude setup-token`
   on their own machine and paste it into the app.
3. **The big structural surprise: Claude Code is no longer JavaScript you can
   just run.** Since v2.1.113 (2026-04-17) the npm package is a 29 KB wrapper
   around a ~294 MB native binary built on Anthropic's private Bun fork, and
   the embedded JS calls private `Bun.ant.*` APIs. The last portable `cli.js`
   is v2.1.112, now about 200 releases stale. The current JS can be extracted
   from the binary with a 90-line parser and runs on stock Node 24 with
   ~1.7k lines of Bun polyfill, through a full agentic turn with a Bash tool
   call (the FreeBSD port does this; we reproduced it on 2.1.311 in §8). That
   path needs a small patch every 10–20 releases.
4. **The policy question is the real risk, not the engineering.** Anthropic's
   terms permit subscription OAuth only for "the unmodified Claude Code
   binary" signed in by its own user, prohibit third parties from offering
   Claude.ai login or intermediating credentials, and have been enforced
   since January 2026. A no-server design that runs the official JS
   unmodified, never touches tokens outside the user's own browser, and never
   spoofs identity is the defensible shape, but it is a gray area. The clean
   alternative is an **API key from the user's linked Console org**: since
   2026-10-07 Max and Team plans include monthly API credits that cover it,
   and browser-direct API-key access is officially supported.

**Recommendation:** build the shim-port runtime (§9), with API-key auth as
the default and setup-token auth as an opt-in experimental mode, targeting
the extracted current JS if §8 holds and v2.1.112 otherwise. Run a one-day
WebContainers baseline in parallel for comparison.

## 1. Constraints

| Constraint | Consequence |
|---|---|
| Static GitHub Pages: no server, no response headers | No CORS proxy of our own. COOP/COEP (for `SharedArrayBuffer`) only via the `coi-serviceworker` trick, which works but costs one reload on first visit. |
| "Decent performance" | Rules out anything that emulates a CPU. JS must run on the page's own engine. |
| Subscription auth | Only Claude Code's own OAuth is sanctioned for Pro/Max. Nothing may store or relay the user's tokens except the user's own browser. |
| Gallery app in this monorepo | Vite-built package under `packages/`, relative asset paths, committed `dist/`, thumbnail. Anything proprietary must be fetched at runtime, never committed. |

## 2. What Claude Code is today (agent A)

- **Distribution.** The recommended installer ships a platform binary.
  `@anthropic-ai/claude-code` on npm is at 2.1.311 and still ships daily, but
  since **2.1.113** it is only a wrapper plus per-platform optional
  dependencies holding a 276–299 MB executable (Bun 1.4.4, Anthropic fork).
  The JS is plaintext inside the binary as ~1,770 code-split chunks.
- **Runtime coupling.** The current JS requires `Bun.ant.CellSegmenter`
  (terminal grapheme segmentation, since 2.1.271) and uses `Bun.Terminal`,
  `Bun.spawn`, `bun:ffi` and a dozen `Bun.*` helpers, all behind guards with
  Node fallbacks except `Bun.ant.*`. An Anthropic engineer said in April 2026
  they are "not planning to keep the (deprecated since January) JS build
  around". A feature request to publish the JS bundle has no staff reply.
- **What the harness needs from an OS.** A raw-mode TTY for the Ink TUI
  (headless `-p` / stream-json needs only pipes); `child_process` with a real
  POSIX shell (the Bash tool runs each command as
  `bash -c -l "<snapshot> && eval '<cmd>' && pwd -P >| <file>"`, and it exits
  hard with "No suitable shell found" otherwise); `rg` for Grep/Glob
  (embedded in the binary, vendored in old npm builds, or system `rg` with
  `USE_BUILTIN_RIPGREP=0`); `git` for about a dozen call sites; a full
  synchronous POSIX `fs` (about 300 sync call sites) with a persistent
  `$HOME/.claude`; outbound HTTPS with SSE streaming; and a localhost HTTP
  listener only for the OAuth callback, which the manual paste-code mode
  avoids. Native addons (sharp, audio, seccomp, bwrap) are all optional.
- **Startup long tail.** Before any tool use, a `-p` run spawns about 15
  subprocesses: `which npm|bun|yarn|deno|pnpm|node`, `rg --version`,
  `rg --files` over `~/.claude`, `which bwrap`, `which socat`,
  `npm root -g`, `ps aux | grep …`. A `child_process` shim has to answer or
  fail each of these gracefully.
- **Identity signals the server could check.** The system prompt starts with
  the Claude Code identity line and a billing line containing `cch=00000`;
  third-party reverse engineering says the native Bun fork rewrites those
  zeros with a request hash as client attestation. A JS-only runtime sends the
  literal zeros, exactly as the old npm builds did. Whether the server
  enforces it is unknown. Headers: `x-app: cli`, `User-Agent: claude-cli/…`
  (a browser replaces the User-Agent with its own; Chromium verified).
- **Kill switches.** `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` disables
  telemetry, error reporting, auto-update and feature-flag fetches.
  `DISABLE_AUTOUPDATER=1` matters on its own: the updater clobbers unusual
  installs within seconds.

## 3. CORS, endpoint by endpoint (agent C)

Probed with curl and with headless Chromium 153 running `fetch()` inside the
real `https://kumavis.github.io/vibe-dump/` page. Fake credentials only, so
every row shows what a browser can *read*, not whether a real token is
*accepted*.

| Endpoint class | From `kumavis.github.io`? | Verdict |
|---|---|---|
| `POST api.anthropic.com/v1/messages`, `/v1/messages/count_tokens` | **Yes.** Preflight 200 with `ACAO: *` only when the request headers include `anthropic-dangerous-direct-browser-access`; every other header is echoed back (the full 17-header Claude Code set included). Real responses, 401s included, carry `ACAO: *` and `ACEH: *`. Bearer OAuth and `x-api-key` behave identically. | **Not a blocker.** Claude Code's bundled SDK is built with `dangerouslyAllowBrowser: true`, so it already sends the header. |
| Management `/v1` GETs (`/v1/models`, `/v1/files`, batches) | Preflight passes, but the 401 for an invalid credential has no `ACAO`. | Minor. Claude Code uses `/v1/models` only for gateway model discovery. |
| `api.anthropic.com/api/*` (`oauth/profile`, `oauth/usage`, `claude_cli/*`, `claude_code/settings`, `policy_limits`, `event_logging/*`, `hello`, GrowthBook) | **No.** Exact-origin allowlist: `claude.ai`, `console.anthropic.com`, `platform.claude.com`. Preflight returns `400 Disallowed CORS origin`. | **Blocked.** They fail as network errors. Mostly telemetry, flags and account metadata; §8 records which ones a `-p` turn actually makes. |
| `POST platform.claude.com/v1/oauth/token` (code exchange, refresh) | **No.** Allowlist is `console.anthropic.com` and `platform.claude.com` only. | **Hard blocker** for in-page `/login` and token refresh. Footgun: a form-encoded refresh is a CORS "simple request" that the server *processes* but the page cannot read, so a rotated refresh token would be lost. |
| Authorize pages (`claude.com/cai/oauth/authorize` → `claude.ai`, `platform.claude.com/oauth/authorize`) | Top-level navigation, so CORS is irrelevant. `X-Frame-Options: SAMEORIGIN`; no iframe. Popup works. | Fine as a popup, but the code exchange behind it is blocked. |
| Telemetry (`statsig.anthropic.com`, Datadog, `event_logging`) | `statsig.anthropic.com` is NXDOMAIN; the rest fail CORS. | Irrelevant. Disable them. |

Two things only a real token can answer: whether the server's "Claude Code
only" gate on subscription tokens accepts a request carrying a browser
User-Agent, `Origin` and `Referer`; and whether a successful SSE stream
carries `ACAO` (the 401 on the same route does, so expected yes).

**Fallbacks if we ever need the blocked endpoints:** a per-user Cloudflare
Worker (20 lines, tested from the real origin; the user deploys their own,
never a shared one, because that is credential intermediation); a browser
extension whose background worker makes the requests; or a Wisp/libcurl.js
relay that does TLS in the page so the relay sees only ciphertext. Note that
several Claude Code calls (`/api/oauth/profile`, `/api/hello`, the fast-mode
and WebFetch safety checks) ignore `ANTHROPIC_BASE_URL`, so a proxy has to be
wired at the runtime's network layer, not via env vars.

## 4. Authenticating against a subscription

| Mode | How | Needs | Policy standing |
|---|---|---|---|
| **A. `claude setup-token`** | User runs it once on their own machine (Anthropic's own flow), pastes the `sk-ant-oat01-…` token; app sets `CLAUDE_CODE_OAUTH_TOKEN`. One-year, inference-only, never refreshed. | Only `/v1/messages` (+ optional `count_tokens`), both CORS-clean. **Fully proxy-free.** | Token minted officially; stored only in the user's browser. Gray: the runtime around the official JS is ours (§5). |
| **B. Full `/login` in-page** | Open the authorize URL in a popup with the manual-paste redirect; user pastes the code. | The code exchange and refresh hit the CORS-blocked token endpoint, so a user-owned proxy or extension is required. | Same as A plus a relay. Only worth it for connectors/Remote Control, which a static page cannot use anyway. |
| **C. API key from the linked Console org** | `ANTHROPIC_API_KEY`. Since 2026-10-07 Max and Team plans include monthly API credits that cover it. | `/v1/messages` with `x-api-key`, CORS-clean. | **Clean.** Browser-direct API-key use is officially supported (`dangerouslyAllowBrowser`); the credits come from the subscription. Pro plans have no included credits, so this is pay-as-you-go for them. |

Headers Claude Code sends with an OAuth token: `Authorization: Bearer …`,
`anthropic-beta: oauth-2025-04-20,…`, `anthropic-version: 2023-06-01`,
`anthropic-dangerous-direct-browser-access: true`, `x-app: cli`.

## 5. Policy and terms (agent A; not legal advice)

The governing text is Claude Code's
[legal-and-compliance page](https://code.claude.com/docs/en/legal-and-compliance):

> OAuth authentication is intended exclusively for purchasers of Claude Free,
> Pro, Max, Team, and Enterprise subscription plans and is designed to support
> ordinary use of Claude Code and other native Anthropic applications. …
> Anthropic does not permit third-party developers to offer Claude.ai login
> into their own applications, or to route requests through Free, Pro, or Max
> plan credentials on behalf of their users. Moreover, developers may not
> collect, store, or intermediate Claude.ai credentials or session tokens …
> Nor does it prevent an end user from signing in to the unmodified Claude
> Code binary with their own Claude subscription.

Hosting Claude Code in a product additionally requires that "the Claude Code
binary must not be modified" and that each end user authenticates with their
own credentials. The npm package and binary are "© Anthropic PBC. All rights
reserved." with no grant to copy, modify or redistribute. Enforcement history:
server-side anti-spoofing checks cut off OpenCode in January 2026; the
Help Center says third-party tools that "misrepresent their identity" may be
enforced against, and that Anthropic may draw third-party-tool usage from
usage credits rather than subscription limits.

What follows from this for our design:

- **Never commit or bundle Claude Code's code.** Fetch the official artifact
  at runtime, in the user's browser, from Anthropic's own channel
  (`registry.npmjs.org` and the jsDelivr/unpkg mirrors serve it with
  `ACAO: *`). The 2.1.112 `cli.js` loads directly; the current binary
  (~132 MB compressed) can be fetched and have its JS extracted in-page, or
  the user can drop in the `claude` binary already on their disk.
- **No server, no proxy of ours, no shared relay.** Tokens live only in the
  user's browser storage.
- **No identity spoofing.** Do not fake the User-Agent, patch `cch`, or alter
  the system prompt. If Anthropic's gate rejects browser requests, that is
  the answer, not something to route around.
- **Disable non-essential traffic**, which also keeps the blocked `/api/*`
  calls from being attempted.
- **The honest framing:** running the official JS unmodified on a different
  runtime is "ordinary use of Claude Code" in spirit but not "the unmodified
  binary" in letter, especially for the extracted current version, whose
  path strings must be rewritten to load at all. Running it for yourself is
  the strongest case; publishing it in the gallery for others is closer to
  "offering Claude.ai login in a third-party product", even though we never
  perform the login. Mode C (API key with included credits) has none of this
  exposure and should be the default.

## 6. Runtime avenues compared (agents B, D, F)

| # | Avenue | Runs which Claude Code | Perf (interactive TUI) | Network | Shell / rg / git | COOP/COEP | GH Pages | Dependency / licence | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **Shim port**: official JS on the page's V8 behind an import map (`@jspm/core` + own shims), ZenFS/memfs → OPFS, `just-bash`, isomorphic-git, xterm.js tty shim | 2.1.112 proven (`--help`, `-p` reach the API); current via extraction + Bun polyfill (§8) | **Native V8**; ~3x cold start measured | Browser `fetch`, so CORS (§3): inference works | `just-bash` already runs the Bash tool's wrapper idiom; lacks `trap`, `declare -f` bodies, `git`, `node`; `rg` built in | Optional (only for sync `spawnSync` via `Atomics.wait`) | Yes, trivially | All MIT/Apache/LGPL; Claude Code fetched at runtime | **Build this** |
| 2 | **WebContainers** (StackBlitz) | 2.1.112 very likely (Node 22.22 inside); current via extracted JS + polyfill plausible | Near-native (~1–1.5x) | Browser `fetch`, so CORS; CORS proxy only in paid editor | `jsh`, not bash (alias a `just-bash` Node script as `SHELL`); no git; no native `rg` | Required (`coi-serviceworker` works, demo exists) | Yes | Proprietary runtime loaded from StackBlitz; free for OSS; breaks under third-party-cookie blocking | **One-day baseline** |
| 3 | **BrowserPod / BrowserCode** (Leaning Technologies) | Current-era extracted JS (their pinned May-2026 image); the only precedent with real bash/git/rg | "Native-like" JS (vendor); no numbers | **All egress via their Cloudflare proxy** (allowlist incl. AI APIs); token transits their infra | Real bash, git, rg, npm compiled to Wasm | Required, plus Wasm JSPI (Chrome 137+, Firefox 153+, Safari 27+, no iOS) | Probably via `coi-serviceworker`, untested | Proprietary, metered (free non-commercial tier, attribution, key visible client-side) | Reference yardstick; poor foundation |
| 4 | **almostnode / agent-wasm** | 2.1.112 (fork pinned there; code says it can't go past) | Native V8 | Configurable CORS proxy or Tailscale-in-Wasm exit node | `just-bash`; 48k lines of shims incl. an 8k-line `child_process` | See agent F | Yes | MIT | Mine for shims; see agent F |
| 5 | CheerpX / WebVM | 32-bit Node only; cannot run the 64-bit Bun binary | 2–10x slower, V8 JIT-in-JIT worse | **Tailscale only**; needs an exit-node server | Real Linux userland | Required | Yes | Free community licence from their CDN | Ruled out (network) |
| 6 | v86 | 32-bit Node only | **10–100x slower**; Node hello-world 1.6–40 s | Port-80 fetch bridge (CORS) or relay | Real Linux userland | No | Yes | BSD-2 | Ruled out (speed) |
| 7 | container2wasm / QEMU-wasm | The only one that could run the x86-64 Bun ELF | **Likely 50–500x slower** | In-page TLS-terminating fetch proxy | Real | Required | Yes | Apache/GPL | Curiosity only |
| 8 | Nodebox, WASI Node/Bun, Edge.js | Nodebox abandoned 2023 with no TTY; no Node/Bun for wasm32-wasi exists; Edge.js runs QuickJS in Wasm | — | — | — | — | — | — | Not viable |

Why the shim port wins: it is the only avenue with native JS speed, no vendor
runtime, no mandatory cross-origin isolation, no server, and a licensing
story where every line we ship is ours. Its cost is the long tail of
`child_process`, `tty` and `fs` behaviour, which agents B and D have already
mapped (startup subprocess list, raw-mode stdin must not flush, child output
must be buffered so it does not interleave with Ink frames,
`COLORTERM=truecolor`, `CLAUDE_CODE_NO_FLICKER=1`).

## 7. Prior art worth knowing (agent D)

- **BrowserCode** (Leaning Technologies, May–Oct 2026): Claude Code, Codex
  CLI and Pi client-side on BrowserPod. Subscription login works by rewriting
  the OAuth redirect to Anthropic's paste-code page. Image pinned since
  2026-05-06; all traffic through their proxy; remote MCP servers fail.
- **FreeBSD port `misc/claude-code` 2.1.310**: extracts the JS from the Bun
  binary with `unhare`, runs it on Node 24 with a 1,238-line Bun polyfill
  plus a 429-line `Bun.ant.CellSegmenter` shim and four shape-matched
  rewrites. The template for tracking current releases; breaks every few
  dozen versions (2.1.251 zstd, 2.1.271 CellSegmenter, 2.1.282 `import.meta.dir`).
- **agent-wasm / almostnode**: 2.1.112 on pure-JS Node shims; transcript
  tailing to sync a chat UI, bracketed-paste stdin injection, OAuth popup
  relay, passkey-encrypted credential vault.
- **clientside-containers** (Aug 2026): the exact deployment shape we want
  (WebContainers on GitHub Pages with `coi-serviceworker`); reached the
  Claude Code welcome screen and stopped at "provider APIs may still hit CORS".
- **webcode.sh / claude-co.de** (2025): WebContainers plus a Cloudflare proxy
  that spoofed the CLI User-Agent and posted users' emails to Slack. The
  anti-pattern.
- **Anthropic's own browser surfaces** (claude.ai/code, Claude in Chrome,
  the desktop app) all execute server-side or in a local process; none is a
  client-side harness.

## 8. Version strategy: frozen 2.1.112 vs extracted current JS (agent E)

We reproduced the FreeBSD recipe on 2.1.311 in this sandbox, with all egress
blocked and a mock API, in about 15 minutes of agent time:

- **Extraction works, and would work in a page.** The ELF has a `.bun`
  section holding a blob, a table of 52-byte file records and the marker
  `---- Bun! ----`. `unhare` (BSD-2, C) pulls out all 2,848 modules in
  0.3 s; a 90-line pure-JS port of its parser produces a byte-identical tree
  from an `ArrayBuffer` and needs nothing a browser lacks. The result is
  51 MB of plaintext ESM: a 26 KB entry stub plus 2,594 chunks, 137 zstd
  assets, two optional native addons we drop, and JSC bytecode we ignore.
- **Every FreeBSD rewrite matched exactly** (`/$bunfs/root/` paths ×241k,
  `import.meta.require` ×529, `import.meta.dir` ×9, and the three
  shape-matched patches the port treats as fatal if they stop matching).
  Drift from 2.1.310 to 2.1.311: zero.
- **It needs Node ≥ 24.** The bundle uses `await using` 36 times; Node 22
  cannot parse it. Chromium 134+ supports it natively, so in a browser this
  is a non-issue on Chromium and a transpile pass elsewhere.
- **On Node 24 it goes all the way.** `--version`, `--help`, the Ink welcome
  screen and REPL (so the `CellSegmenter` shim renders correctly), and a
  complete `-p` turn: streamed SSE, a `tool_use` Bash call executed in a real
  `/bin/bash` with the shell-snapshot dance, the `tool_result` round trip,
  exit 0. Still broken under Node: background PTY sessions (`Bun.Terminal`),
  image resize (`Bun.Image`), the hooks worker (no global `Worker` in Node;
  the browser has one), clipboard and voice (native addons).
- **Request list with an inference-only token and the kill-switch flags:
  startup makes no requests; a turn makes exactly `POST {BASE}/v1/messages?beta=true`**
  (plus one retry on 401), with `Authorization: Bearer`, the OAuth beta,
  `user-agent: claude-cli/2.1.311 (external, sdk-cli)`, `x-app: cli` and
  `anthropic-dangerous-direct-browser-access: true`. Without the flags it
  also hits GrowthBook, `/api/claude_cli/bootstrap`, the MCP registry and
  `event_logging` ×3, all hardcoded to `api.anthropic.com` and ignoring
  `ANTHROPIC_BASE_URL`. Interactive mode additionally fetches the plugin
  marketplace manifest from `downloads.claude.ai` even with the flags set,
  and probes `git`, `ssh -T git@github.com`, `ps aux` and `npm config get prefix`.
- **Onboarding is a trap.** A fresh `$HOME` runs a connectivity preflight to
  `api.anthropic.com/api/hello` and `platform.claude.com/v1/oauth/hello`,
  both CORS-blocked, and calls `process.exit(1)` on failure. The browser app
  must seed `.claude.json` with `hasCompletedOnboarding` and folder trust,
  which is what the spike did to reach the REPL.
- **Drift risk: low per release, moderate over time.** The port's history
  shows a forced patch roughly every 10–20 releases (zstd assets at 2.1.251,
  require cycles at 2.1.258, `Bun.Image` at 2.1.268, `CellSegmenter` at
  2.1.271, `import.meta.dir` at 2.1.282, `Bun.SHA256` at 2.1.288). 2.1.311
  already references `Bun.FetchSession`, `Bun.hash.crc32` and three more
  private `Bun.ant.*` calls that the polyfill lacks; all guarded today.
  Budget for a small fix every week or two if we track `latest`, and pin
  otherwise.
- **What the browser port adds on top of the Node recipe:** a synchronous
  module system for the 529 `import.meta.require` sites (bundle the chunks
  in-page or keep a sync registry), a sync virtual filesystem, the
  `child_process` router from §6, moving the axios-over-`https.request`
  paths to `fetch` (only `/v1/messages` and `count_tokens` honour
  `ANTHROPIC_BASE_URL`, so anything else must be suppressed by the flags or
  intercepted in the fetch shim), running `cli` in a Worker so
  `Bun.sleepSync`'s `Atomics.wait` is legal, sync sha256 (noble), wasm zstd,
  stubs for `vm` (23 imports), and neutralising `process.execPath`
  self-respawn as the port does. Startup on Node 24 is about 5 s to the first
  API call while loading 51 MB of source with no code cache; the page should
  bundle and cache the extracted tree in OPFS.

**Verdict.** Tracking current releases is real, not aspirational: the
official JS, extracted in the user's browser from the package the user's
browser downloaded, runs on a non-Bun runtime with a known, small, versioned
set of shims. The costs are a ~132 MB one-time download (or a file drop of
the user's own `claude` binary), ~1.7k lines of polyfill to maintain, and
the gray area in §5 widening slightly because path strings in the official
JS must be rewritten to load. 2.1.112 remains the zero-maintenance fallback
and the right first milestone.

## 9. Recommendation and plan

**Decision for the user (see Open decisions).** Assuming the shim-port route
and API-key-default auth:

### Phase 2: two parallel spikes, one acceptance test (subagent workflow)

Both tracks build the same package skeleton, `packages/claude-code-web/`,
and are judged by one test run in headless Chromium against a static build:

1. The page loads on a static server with no custom headers.
2. Claude Code's TUI renders in xterm.js and accepts typed input.
3. With an API key, one `-p "say hi"` turn completes against
   `api.anthropic.com` (streaming).
4. In interactive mode, the agent performs a Read, an Edit and a Bash tool
   call on files in a persisted in-browser workspace.

- **Track 1, shim port.** Seed from agent B's probe harness
  (`index2.html` + shims): import map over `@jspm/core`, a `child_process`
  router (`bash`/`sh` → `just-bash`, `rg` → built-in, `which`/`ps`/
  `npm root -g` faked, `git` → isomorphic-git), ZenFS in memory mirrored to
  OPFS, a `tty` shim fed by `xterm.onData`, and `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`.
- **Track 2, WebContainers baseline.** `coi-serviceworker`, boot a
  container, `npm i @anthropic-ai/claude-code@2.1.112`, `spawn` with the
  `terminal` option into xterm.js, `SHELL` pointed at a `just-bash` Node
  script, `USE_BUILTIN_RIPGREP=0` with a JS `rg` on `PATH`.
- A verification agent runs the acceptance test on both and reports which
  reached step 3 and 4, with timings. Converge on one.

### Phase 3: harden the winner

Persist `$HOME/.claude` and the workspace in OPFS; settings UI for the API
key and the experimental setup-token mode; a `CLAUDE.md` injected into the
workspace describing the sandbox (every precedent needed this); disable the
updater and telemetry; thumbnail and gallery card.

### Phase 4 (optional): track current releases

If §8 confirms the extraction recipe, add an in-page extractor: download the
platform tarball (or accept the user's local `claude` binary via file drop),
parse Bun's embedded-file trailer, apply the rewrites, cache in OPFS, and
layer the Bun polyfill under the shims. Add a daily compatibility check
against `@anthropic-ai/claude-code@latest` so breakage is noticed.

### Open decisions for the user

1. **Auth default.** API key (clean; Max/Team credits apply) as default, with
   setup-token mode as an opt-in experimental toggle behind a warning? Or
   setup-token only, accepting the gray area?
2. **Version.** Ship 2.1.112 (stable, loads from jsDelivr, frozen features)
   first and treat the current-version extractor as Phase 4? Or go straight
   for the extracted current JS?
3. **Audience.** Personal tool for the author, or a public gallery card? The
   second is the weaker policy position (§5).
4. **Proceed with Phase 2 as two parallel subagent tracks** under a workflow,
   or pick Track 1 only?
