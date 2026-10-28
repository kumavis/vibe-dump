# H — Review and verification summary (workflow round 1)

*Generated from the build workflow journal on 2026-10-28. Verifier evidence is in G-verify-round-1.md.*

## Verifier

Verdict: **pass**

- Step 1: PASS. Passed in all 16 e2e runs. Run 1: 'PASS 1 ... 2848 modules (2846 cached), 6 rewrites ok, extracted in 4.5 s; reload reused the cache'. The independent driver ($V/run-proxy/report.json) found moduleCount 2848, files 2846, manifest.paths 2846. My own caches.keys() listing showed {} before the drop and {cc-app-2.1.311: 2847} after it (2,846 files plus vfs/manifest.json). The reference tree has 2,848 files, two of which are .node addons that are not cached. The 6 rewrites hit their pinned counts: bunfs-root 241429, import-meta-require 529, import-meta-dir 9, builtin-hooks-helper 1, shell-search-gate 1, path-completer-readdir 2, all ok. After page.reload(): extractions 0, the same createdAt, still 2,847 cache entries. Extraction took 4.0-5.8 s.
- Step 2: PASS. Cold, from Start to the first system/init: 6.9-8.3 s over 14 unloaded runs (median 7.6), against the 30 s limit; 12.1 s with npm test running in parallel. The driver measured 7.19 s by the Node wall clock (initialize 6.98 s). init: model claude-sonnet-5-5 and 24 tools, among them mcp__page__get_weather. Bash, BashOutput, KillShell, WebFetch and WebSearch are absent. mcp_servers is [{name:page,status:connected,source:sdk}] and cwd is /home/user/workspace. Warm (2b): 5.8-6.8 s (median 6.1), limit 10 s; 8.0 s under contention; the driver measured 5.96, 6.15 and 6.01 s. Every run's Worker boot line: '400 modules pre-imported (0 failed ...)'. preImport took 5.7-6.2 s cold and 4.5-4.8 s warm.
- Step 3: PASS. e2e: '"hi from the mock API"; 1 POST, beta ok, browser-access header ok' in every run. In mock log $V/e2e1-mock.jsonl, request 1 is POST /v1/messages?beta=true. Its anthropic-beta is claude-code-20250219,oauth-2025-04-20,..., it carries anthropic-dangerous-direct-browser-access: true and 'Bearer sk-ant-oat01-…', and its UA is the browser's own HeadlessChrome/153. Across all 16 e2e mock logs, none of the 240 POSTs lacks the OAuth beta or the browser-access header. The mock only ever saw /v1/messages. The driver ran without interception: its mock saw exactly 'OPTIONS /v1/messages preflight ok=true' then 1 POST. The preflight asked for anthropic-dangerous-direct-browser-access. The result was success with is_error false, and the assistant message came before the result.
- Step 4: PASS. e2e: handler({city:Paris}) returned 'Sunny in Paris, 21°C', and the result was 'The weather tool said: Sunny in Paris, 21°C'. Mock follow-up request 3 carried toolResults [{tool_use_id: toolu_mock_weather_..., text: 'Sunny in Paris, 21°C'}]. For an independent check, the driver installed its own handler through the Settings UI. The handler pushes its input to a page global and returns a nonce. Result: handlerRuns 1, handlerInputs [{city:Paris}], equal to the model's tool_use mcp__page__get_weather {city:Paris} in the mock log. The follow-up tool_result was exactly 'VERIFY Paris call#1 nonce-7f3a91', and the result 'The weather tool said: VERIFY Paris call#1 nonce-7f3a91'.
- Step 5: PASS. e2e: 'hello.txt listed before and after reload' in all runs; the e2e calls stop() first. The driver used page.reload() without stop(). canUseToolAsked was ['Write']. Before the reload, hello.txt was listed and shown in #workspace-list, with text 'hello from the mock API\n'. Reading OPFS directly found cc-web/home.ccwfs (5,094 bytes) containing hello.txt and its content. After the reload the listing, the DOM, the text and the OPFS file were all the same.
- Step 6: PASS. e2e context.route: 'PASS 6 ... 2 hosts used', foreign [] in all 16 runs. Independently, Chromium was run through my network-level logging proxy, with loopback proxied too. Of 383 requests, 347 went to the static server and 8 to the mock. There were no requests to anthropic.com, npm, GitHub or telemetry hosts. The only foreign hosts were Chromium's own services: www.google.com, accounts.google.com, content-autofill.googleapis.com, update.googleapis.com, clients2.google.com and android.clients.google.com. A control run with no app code reproduces them ($V/control.log).

### Discrepancies

- Overstated: extra step 9 (interrupt) is flaky. It failed in e2e run 3 of 16 with 'the streaming request was not abandoned'. In $V/e2e3-mock.jsonl the 'stream slowly' request #14 ran to completion without the aborted flag, so the SSE fetch was not cancelled. The next prompt was '[Request interrupted by user]\n\nsay hi' rather than the usual 'stream slowly\n\n[Request interrupted by user]\n\nsay hi'. This contradicts 'ten consecutive full e2e runs passed'. The acceptance steps are unaffected.
- Gap in the e2e: Playwright auto-fulfils intercepted CORS preflights with a permissive 204 whenever context.route is active (playwright-core coreBundle.js, isInterceptedOptionsPreflight). All 16 e2e mock logs show 0 OPTIONS, so `npm run test:e2e` never tests the mock's strict-CORS emulation of api.anthropic.com. My run without interception showed that the real preflight does pass (1 OPTIONS, ok=true).
- Step 6's '2 hosts used' covers only page, Worker and service-worker traffic. At the network level the headless Chromium also contacts Google services: component updater, accounts, and autofill reacting to the Settings form. These are the browser's own requests, and the e2e cannot see them.
- Timings are slightly optimistic. I measured cold 6.9-8.3 s (reported 6.5-7.5 s), warm 5.8-6.8 s (reported 5.4-6.3 s) and a whole e2e of 23.7-27.1 s, or 31.4 s for the run that failed (reported 22-26 s). Under contention the cold boot took 12.1 s (reported 20.7 s). Both limits still hold with a wide margin.
- Not reproduced, so unverified rather than refuted: the linux-arm64, linux-x64-musl, linux-arm64-musl and darwin-x64 .tgz runs, and API-key mode. darwin-arm64 (10/10, --modules 2866) and the --base /vibe-dump/claude-code-web/ sub-path (10/10) did reproduce. npm test (216/216, 0 skipped; 84 s cold, 28 s warm) and npm run build (exit 0, 3.9 s) match the report.

## Reviewer

Policy posture OK: **true**

### [major] packages/claude-code-web/src/host/persist.js

Workspace persistence can lose data. (1) The OPFS store's load() does not wait for saves still in its chain. Session.#start() calls load() straight after a Stop, and the final fs-sync that boot.js exitOnce() posts has queued a save but may not have finished it. The new Worker then boots from the previous snapshot, and its first fs-sync overwrites the newer state. Stop then Start is the normal flow, since custom tools only 'take effect on the next start'. (2) save() ends in .catch(() => {}), so the try/catch in Session.#onFsSync never sees a failure: a QuotaExceededError, or a browser without createWritable, loses the workspace with no warning. (3) Harness.stop() gives the CLI 1.5 s and then calls terminate() with no forced fs-flush. fs.js onChange is a trailing debounce with no maxWait, so a steady stream of writes under HOME delays persistence indefinitely. Nothing flushes on pagehide, so a reload within about 400 ms of a write loses that write.

**Fix:** In persist.js, make load() start with `await chain`. Have save() return the real promise and keep the chain alive separately: `const p = chain.then(write); chain = p.catch(() => {}); return p`. Session.#onFsSync then surfaces failures through its existing note(). In Session.#start, prefer the in-memory `this.workspace.snapshot` (encodeSnapshot) over a reload from OPFS. Session.stop() should call harness.flushFs() and wait for the next fs-sync and its save before ending stdin. In fs.js onChange, add a maxWait (for example 2 s) so a steady write stream still flushes. Best fix: have the Worker write the snapshot to OPFS itself through createSyncAccessHandle, so persistence does not depend on the page surviving. Request navigator.storage.persist() after the first write so the workspace is not evicted as best-effort storage.

### [major] packages/claude-code-web/src/host/session.js

There is no single-writer guard across tabs. Each tab boots its own Worker and writes the same OPFS file cc-web/home.ccwfs. createWritable swap files make it last-close-wins, so two open tabs silently clobber each other's workspace, and a reload restores whichever tab saved last.

**Fix:** Hold a Web Lock for the session's lifetime: navigator.locks.request('cc-web:home', {ifAvailable: true}, ...). A second tab that cannot take the lock shows 'open in another tab' and refuses Start, or runs without persistence. Alternatively, use BroadcastChannel to hand ownership over. Add a unit test with two Sessions sharing one store.

### [major] packages/claude-code-web/src/host/settings.js

The API key and setup-token are stored in origin-wide localStorage ('cc-web:settings'). On GitHub Pages the origin is kumavis.github.io, which is shared with every other vibe in the gallery and with every other kumavis.github.io/<repo> Pages site. Any script on that origin can read the credential, and also the OPFS workspace. main.js additionally exposes window.__cc.session.settings, which includes the token, in production. The UI footer ('your key or token stays in this browser') is literally true, but users would not expect this exposure.

**Fix:** Default to not persisting the credential: keep it in memory, or in sessionStorage. Add an explicit 'Remember on this device' checkbox, which writes it to localStorage only when ticked. Say in the README and next to the token field that the origin is shared with the other gallery apps. Expose window.__cc only under ?test (the e2e can add it), or at least strip apiKey and token from what it returns. Longer term, deploy this app on its own origin.

### [major] packages/claude-code-web/test/e2e.mjs

Acceptance step 3 passes without ever exercising CORS. The foreign-host guard uses context.route('**/*'), and with any route installed Playwright 1.61 auto-fulfils every OPTIONS preflight with a permissive 204 (playwright-core coreBundle.js:35797, isInterceptedOptionsPreflight). The mock's strict-CORS gate, which imitates api.anthropic.com's browser-access requirement, never runs: every e2e mock log shows 0 OPTIONS. Separately, step 5 always calls __cc.stop() before the reload, so the realistic reload-without-stop path is untested; only the verifier's own driver covered it.

**Fix:** Drop context.route. Block egress at the network level instead, for example chromium.launch({args: ['--host-resolver-rules=MAP * ~NOTFOUND, EXCLUDE 127.0.0.1']}) or a proxy pointing at a closed port with loopback bypassed. Keep context.on('request') and add 'requestfailed' to record foreign hosts. In step 3, assert that the mock log has exactly one OPTIONS for /v1/messages with preflight.ok === true before the POST. In step 5, reload with page.reload() and no stop(), after waiting for the OPFS save. This needs a 'saved' event or promise from Session.

### [major] packages/claude-code-web/src/runtime/node/internal/http.js

An interrupt sometimes leaves the SSE stream running. Verifier run 3 of 16: main-model request #14 ('stream slowly', claude-sonnet-5-5, nMessages 26) streamed to completion with no `aborted` flag, even though the turn's result came back promptly. The next request had nMessages 29, meaning the finished assistant reply was appended after the interrupt. A user who presses Interrupt can keep consuming output tokens until the stream ends.

**Fix:** Find out which path carries the /v1/messages stream: the bundle's fetch with its AbortSignal, or ClientRequest here. Extend boot.js installTrace to log whether init.signal is set and when it aborts. Reproduce by looping step 9 about 30 times. If it is this shim: make abort/destroy that lands between the fetch resolving and `_reader` being set cancel res.body. Also propagate opts.signal when destroy() runs before _send. Keep step 9 in the e2e, with a longer slow stream so the race window is visible.

### [minor] packages/claude-code-web/src/runtime/boot.js

Policy guarantees depend entirely on Claude Code's own behaviour. The Worker's fetch and WebSocket are unrestricted. The page sets the kill-switch flags only in invocation.js buildEnv, and boot.js does not re-assert them, so a caller that builds a Harness with its own env (or a future refactor) can drop them. The research memo notes that several CLI calls ignore ANTHROPIC_BASE_URL. The UI footer and README promise that credentials go 'only to the API base URL', but nothing in the runtime enforces that.

**Fix:** In boot.js, merge POLICY_ENV last into the env it receives, as defence in depth (export POLICY_ENV from a shared module, or duplicate it with a unit test that keeps the two in sync). Wrap globalThis.fetch and WebSocket in the Worker. Refuse, and log as a warning, any request that carries authorization or x-api-key to an origin other than the ANTHROPIC_BASE_URL origin. Refuse every request to hosts outside {base URL origin, api.anthropic.com, self origin}. Add a unit test for the guard.

### [minor] packages/claude-code-web/src/host/constants.js

DISALLOWED_TOOLS is a denylist, and the default policy auto-allows every can_use_tool (permissionPolicy 'allow', askPermission false). Tools added upstream are therefore approved silently. In 2.1.311 the init message already lists RemoteTrigger, SendMessage, Workflow, CronCreate/Delete/List, ScheduleWakeup, ListAgents and EnterWorktree/ExitWorktree. Some of these act on the user's account or on remote agents, not on the VFS.

**Fix:** Use an explicit allowlist (ARCHITECTURE.md allows `--tools`): Read, Write, Edit, Glob, Grep, NotebookEdit, Task, TodoWrite, AskUserQuestion, ExitPlanMode and Skill, plus mcp__<server>__*. Alternatively, keep the denylist but answer can_use_tool with deny for any tool outside a page-side allowlist. Add a D-* test that pins the allowed set.

### [minor] packages/claude-code-web/src/host/sw-client.js

A hard reload (Shift+Reload) leaves the page uncontrolled. The service worker is already active, so controllerchange never fires. ensureServiceWorker waits the full 10 s, then preflight blocks Start with 'reload once'. The fallback to a classic registration can never succeed (sw.js uses a static import), and it hides the real module-registration error.

**Fix:** In sw.js, add a 'message' handler that calls self.clients.claim(). In sw-client.js, when registration.active exists but navigator.serviceWorker.controller is null, post {type: 'claim'} to registration.active and then wait for controllerchange. Remove the classic fallback, or report the first error.

### [minor] public/../packages/claude-code-web/public/sw.js

The service worker serves from 'the newest cc-app-* cache that has the key' and keeps `current` for its whole lifetime, not the cache named in the manifest the Worker booted with. With two versions cached, `cli` (the same name in every version) can be served from the wrong tree. Separately, Session lets a user extract or clear the cache while a harness is running. materialize() then deletes cc-app-<version> under the live Worker, whose later dynamic imports 404.

**Fix:** Put the version in the served path (BASE/vfs/<version>/app/), or have the page post the manifest's cacheName to the service worker, and serve only from that cache. In Session.#extract and clearCache, refuse while harness.state is booting or ready, or stop the harness first; disable the drop zone and buttons accordingly in binary-panel.js.

### [minor] packages/claude-code-web/src/extract/index.js

extractFromBinary runs on the page's main thread. Reading, parsing, hashing and rewriting a 294 MB binary freezes the UI for several seconds and can trigger the 'page unresponsive' prompt. The .zst drift check described in rewrites.js is dormant in production: acquire.js never passes zstdDecompressSync, so report.zst.unchecked is 137 and nothing checks those assets.

**Fix:** Run the extractor in a dedicated module Worker. Post progress and the manifest back; the Cache API is available in Workers. Pass fzstd's decompress, which is already a dependency, as zstdDecompressSync from acquire.js. Add a test that an extraction through acquire reports zst.checked > 0.

### [minor] packages/claude-code-web/src/host/worker-bridge.js

Every uncaught error in the running Worker is reported twice. boot.js posts {type: 'error'} and does not call preventDefault, so the page's Worker 'error' event fires as well, giving two 'Worker: ...' notes. Harness.messages and Session.messages each keep every stream-json message, and toolCalls is also duplicated, all without a bound. A long session holds the transcript twice.

**Fix:** In boot.js's error listener, call ev.preventDefault() after posting. Keep one message log (Session can read harness.messages), or cap both.

### [minor] packages/claude-code-web/test/unit/B-support.mjs

The session-specific scratchpad path <scratchpad> is hard-coded in B-support.mjs, A-rewrites.test.mjs and e2e.mjs, and in other A/C tests via SCRATCH_RESEARCH. Outside this sandbox the tests that check pinned rewrite counts, bundle surface and named imports, which STATUS.md calls the drift alarms, always skip. test/VERIFY-r1.md, untracked and written by the verifier, embeds the same absolute paths. Neither ships in dist/.

**Fix:** Read one CC_RESEARCH_DIR environment variable, defaulting to that path, in a shared test helper, and document it in README Development. Move VERIFY-r1.md to docs/research/ with paths written as <scratchpad>/..., or leave it out of the commit.

### [minor] packages/claude-code-web/src/ui/app.js

Policy and UX: the page is titled 'Claude Code Web' (header 'Claude Code in your browser', with a Claude-like favicon), and neither the page nor the README says it is unofficial and not affiliated with Anthropic. The base URL field accepts http:// to a remote host, which sends the credential in cleartext.

**Fix:** Add 'Unofficial; not affiliated with or endorsed by Anthropic' to the header or footer and to the top of the README. In settings-panel.js, warn (or refuse) when the base URL is not https and not loopback.

## Reviewer notes

I found no blockers. What I checked:
- Read every file under packages/claude-code-web (skipping dist/ and node_modules), plus the research memo.
- Ran `npm test`: 216 passed, 0 failed, 0 skipped, in 27.6 s.
- Audited the built dist/ (2.0 MB, no file over 500 KB) and grepped the whole repo.

Blocker checklist:
- **No Anthropic code under /home/user/vibe-dump.**
  - Grepping for bundle markers (identity line, cch=, tengu_, CLAUDE_CODE_EXECPATH, /$bunfs/root/chunk-) only hits rewrite descriptions, synthetic test fixtures and the research docs.
  - dist/ holds only our shims, the @jspm/core subset and vendor.js (with licence files).
  - Tests read the binary and the extracted tree from the scratchpad and write only to os.tmpdir or the memfs VFS.
  - builds.js holds hashes only.
- **rewrites.js matches the contract exactly.** It has six rewrites: bunfs-root, import-meta-require, import-meta-dir, builtin-hooks-helper, shell-search-gate, path-completer-readdir. Each has pinned per-flavor counts and raises RewriteDriftError on a mismatch.
  - shell-search-gate turns a gate *off* so Grep and Glob appear; the FreeBSD port applies the same rewrite and the contract lists it.
  - The only other change to Anthropic JS at runtime is the service worker's built-in specifier mapping, which is limited to BUILTINS plus ws/undici and documented in the contract.
- **No identity spoofing.**
  - No User-Agent, x-app or cch handling anywhere.
  - No --system-prompt, --append-system-prompt or initialize.systemPrompt.
  - The http shim forwards the CLI's own headers unchanged.
  - Bun.isStandaloneExecutable is false and Bun.version is a plausible non-fork version, both runtime facts.
  - The seeded ~/.claude/CLAUDE.md sandbox note and the .claude.json onboarding/trust flags are user config, not code patches. Note that CLAUDE.md is model-visible content the page adds, so the README might mention it.
  - CLAUDE_CODE_ENTRYPOINT=sdk-cli is required by the contract, and accurate because the page is an SDK-style client.
- **Kill-switch flags are present.** POLICY_ENV is applied last in buildEnv and unit-tested. boot.js does not enforce it Worker-side (minor finding).
- **Credentials go nowhere unexpected.**
  - The token lives only in localStorage and the Worker env.
  - The mock redacts it in its logs, and no code path logs env.
  - The verifier's network audit saw only the static server and the mock.
- **Service worker scope cannot leak.** It is registered at BASE with the script at BASE/sw.js, so its maximum scope is BASE. respondWith is used only for same-origin BASE/vfs/app/*.
- **No secrets or sandbox paths in shipped code** (src/, public/, dist/). Only tests and e2e hard-code the scratchpad path.

Ownership:
- Every file matches the ARCHITECTURE.md layout, and tests are named A-, B-, C-, D- and I-*.test.mjs.
- Integration's cross-directory edits (fs.js stream-class fix, harness/session/e2e/mock additions) are documented in STATUS.md and in the As-built section.
- src/extract/index.js imports runtime/boot/module-graph.js; this is documented in the As-built section.
- The only working-tree change is the untracked test/VERIFY-r1.md.
- package.json and the lockfile are untouched.

Test quality:
- The unit tests assert behaviour, not just that modules load. Examples: real-binary extraction byte-identical to unhare, pinned rewrite counts, esbuild re-parse of rewritten modules, SSE streaming through the http shim, the MCP JSON-RPC paths, harness control-channel cases, and Chromium Worker loads.
- Gaps: no unit test for public/sw.js serving (factor serve() out the way specifiers.js was), none for the OPFS store's ordering and failure handling, and none for multi-tab behaviour.

Memory:
- A dropped File is read into a single allocation of its exact size.
- From the npm tarball, only package/claude is buffered, at its exact size.
- Views are dropped after materialize. Peak is roughly 0.5–0.6 GB on the main thread; moving the extractor to a Worker is a minor finding.
