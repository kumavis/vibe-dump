# claude-code-web: independent verification, round 1

Verifier run on 2026-10-28 (00:45 to 01:10 UTC), at commit `0bc792a`. The
working tree was clean before and after: `git status --short` was empty and
showed only the ignored `dist/` and `node_modules/`. I changed no source
file; this report is the only file I added. The machine has 4 vCPUs and
15 GB of RAM, and was freshly booted with a load average near 0.

I treated the integration report as wrong until reproduced. Raw logs, JSON
results, mock logs and my own scripts are in
`<scratchpad>/verify-r1/`
(written `$V/` below).

## Verdict

**Acceptance steps 1–6 (and 2b, the warm boot) pass.** I reproduced them in
two ways:
- with the project's own `test/e2e.mjs`: 15 full runs, plus one darwin-arm64
  run;
- with an independent driver (`$V/verify.mjs`) that does not rely on the
  e2e's checks. It uses no Playwright request interception, its own
  instrumented tool handler, `page.reload()` without `stop()`, a
  network-level logging proxy, and wall-clock timing from Node.

Discrepancies are listed at the end:
- extra step 9 is flaky (1 of 16 runs);
- the e2e never exercises the CORS preflight;
- Chromium's own Google background traffic is invisible to the e2e;
- timing ranges run slightly above the reported ones.

## Commands run

```bash
cd /home/user/vibe-dump/packages/claude-code-web
npm test                                   # $V/unit.log (cold), $V/unit2.log (warm), $V/unit3-parallel.log
npm run build                              # $V/build.log
MOCK_LOG=$V/e2e1-mock.jsonl npm run test:e2e -- --json $V/e2e1.json --log $V/e2e1-page.log   # runs 1-13 the same way
node test/e2e.mjs --base /vibe-dump/claude-code-web/ --json $V/e2e-base.json                 # Pages sub-path
node test/e2e.mjs --binary <scratchpad>/trackA/dl-darwin-arm64/...-darwin-arm64-2.1.311.tgz --modules 2866
npm test & npm run test:e2e                # contention run: $V/e2e-par.log
node $V/verify.mjs --out $V/run-proxy --warm-runs 2       # independent driver with the logging proxy
node $V/verify.mjs --out $V/run-noproxy --no-proxy --warm-runs 3
node $V/control.mjs                        # the same Chromium and proxy, no app code (control)
```

- **`npm test`:** `# tests 216 # pass 216 # fail 0 # skipped 0`.
  - 84.2 s wall on the first, cold run (the first read of the 294 MB binary
    took 25.8 s straight after boot).
  - 27.9 s on a warm rerun.
  - 36.3 s while the e2e ran in parallel.
  - No test printed a skip message.
- **`npm run build`:** exit 0 in 3.9 s, ending with
  `build-runtime: dist/runtime: node/ (62 files), bun/ (18 files), boot.js, boot/ (4 files), jspm/ (16 files), vendor.js (408 KiB)`.
- **`npm run test:e2e`:** the mock is started in-process, so nothing was
  started separately.

## Acceptance steps

### 1. Extraction, manifest, cache reuse: PASS

- **e2e, run 1:** `PASS 1 extraction from the dropped binary: 2848 modules (2846 cached), 6 rewrites ok, extracted in 4.5 s; reload reused the cache`.
  All 15 runs passed.
- **Independent driver** (`$V/run-proxy/report.json` step "1"):
  - `moduleCount 2848`, `files 2846`, `manifest.paths.length 2846`.
  - CacheStorage listed by my own `caches.keys()`: `{}` before the drop,
    `{"cc-app-2.1.311": 2847}` after it (2,846 files plus
    `vfs/manifest.json`).
  - The reference tree `research/spike-E/extract-unhare/root` has 2,848
    files. Two of them are `.node` addons (`audio-capture.node`,
    `clipboard-napi.node`), which are not cached, as the "As built" notes
    say.
  - Rewrites, matches against expected:

    | rewrite | matches | expected |
    |---|---|---|
    | `bunfs-root` | 241429 | 241429 / 2391 files |
    | `import-meta-require` | 529 | 529 / 115 files |
    | `import-meta-dir` | 9 | 9 / 9 files |
    | `builtin-hooks-helper` | 1 | 1 |
    | `shell-search-gate` | 1 | 1 |
    | `path-completer-readdir` | 2 | 2 |

    Every one has `ok: true`, and the report has `ok: true`.
  - After `page.reload()`: `extractions 0`, the same `createdAt`, the cache
    still holds 2,847 entries, and the state is `present`.
- **Extraction time:** 4.0–5.8 s across all runs (claimed 4.4–5.7 s).

### 2. Worker boot, `system/init` within 30 s cold (2b: 10 s warm): PASS

- **e2e, run 1:** `init after 7.1 s (initialize 6.9 s); model claude-sonnet-5-5, 24 tools, MCP page:connected`.
- **Driver:**
  - `init.tools` is `Task, AskUserQuestion, CronCreate, CronDelete, CronList, Edit, EnterPlanMode, EnterWorktree, ExitPlanMode, ExitWorktree, Glob, Grep, ListAgents, NotebookEdit, Read, RemoteTrigger, ReportFindings, ScheduleWakeup, SendMessage, Skill, ToolSearch, Workflow, Write, mcp__page__get_weather`.
    That is no `Bash`, `BashOutput`, `KillShell`, `WebFetch` or
    `WebSearch`.
  - `mcp_servers [{"name":"page","status":"connected","source":"sdk"}]`,
    `cwd /home/user/workspace`, `permissionMode default`.
- **Worker boot line,** the same in every run:
  `boot: 400 modules pre-imported (0 failed, 1 require(s) answered with forwarding proxies: chunk-dxb5hzgj.js; ...)`.
- Timings are in the table below. Every cold boot was ≤ 8.3 s unloaded and
  12.1 s under contention. Every warm boot was ≤ 6.8 s unloaded and 8.0 s
  under contention.

### 3. "say hi": PASS

- **e2e:** `"hi from the mock API"; 1 POST, beta ok, browser-access header ok`,
  in all runs.
- **Mock log** (`$V/e2e1-mock.jsonl`), request 1:
  - `POST /v1/messages?beta=true`, scenario `hi`.
  - `anthropic-beta: claude-code-20250219,oauth-2025-04-20,interleaved-thinking-2025-05-14,...`
  - `anthropic-dangerous-direct-browser-access: true`
  - `authorization: Bearer sk-ant-oat01-…(len 45)`
  - `user-agent` is the browser's own HeadlessChrome/153 string: no spoofed
    UA.
- **All POSTs, all runs:** across 16 e2e mock logs (darwin included), every one of 240 POSTs
  carries both `oauth-2025-04-20` and `anthropic-dangerous-direct-browser-access: true`
  (`grep` over all 16 logs: 240 POSTs, 0 without `oauth-2025-04-20`, 0 without the browser-access header).
- **Mock paths:** the mock only ever saw `/v1/messages`. No `count_tokens`,
  no `/api/*`, no other path.
- **Driver, no interception:** the mock saw exactly
  `["OPTIONS /v1/messages?beta=true preflight ok=true", "POST /v1/messages?beta=true"]`.
  - The preflight's `access-control-request-headers` included
    `anthropic-dangerous-direct-browser-access`, so the mock's strict-CORS
    emulation of the real API passed.
  - The result was `{subtype: success, is_error: false}`, and the
    `assistant` message came before the `result`.

### 4. "use the weather tool": PASS

- **e2e:** `handler({"city":"Paris"}) -> "Sunny in Paris, 21°C"; result "The weather tool said: Sunny in Paris, 21°C"`.
- **Mock request 3** (follow-up) carried
  `toolResults [{"tool_use_id":"toolu_mock_weather_mvrebcqd","is_error":false,"text":"Sunny in Paris, 21°C"}]`.
- **Independent check:** the driver replaced the tool config through the
  Settings UI with its own handler. The handler pushes `input` into a page
  global and returns `VERIFY <city> call#<n> nonce-7f3a91`. The UI showed
  `1 tool on server "page"`.
  - The handler really ran once: `handlerRuns 1`, `handlerInputs [{"city":"Paris"}]`.
  - The model's `tool_use` in the mock log is
    `mcp__page__get_weather {"city":"Paris"}`, and `inputMatches true`.
  - The follow-up `tool_result` text was exactly
    `VERIFY Paris call#1 nonce-7f3a91`.
  - The result was `"The weather tool said: VERIFY Paris call#1 nonce-7f3a91"`.

### 5. "write a file", persisted across reload: PASS

- **e2e:** `hello.txt listed before and after reload` in all runs. The e2e
  calls `__cc.stop()` before its reload.
- **Driver,** which did NOT call `stop()` and used `page.reload()`:
  - `canUseToolAsked ["Write"]`: the Write went through `can_use_tool` to
    the page.
  - Before the reload: `listedBefore ["hello.txt"]`, `#workspace-list` shows
    it, and the text is `"hello from the mock API\n"`.
  - OPFS, read directly with `navigator.storage.getDirectory()`:
    `cc-web/home.ccwfs` (5,094 bytes), containing `hello.txt` and its
    content.
  - After the reload: `listedAfterReload ["hello.txt"]`, the DOM shows it,
    the text is unchanged, and the same OPFS file is present.

### 6. No request to any other host: PASS for the app's traffic

- **e2e** (`context.route` on page, Worker and service-worker requests):
  `PASS 6 ... 2 hosts used` and `"foreign": []` in all 16 runs.
- **Independent network-level audit** (`$V/run-proxy/proxy-log.json`).
  Chromium was launched with `--proxy-server` set to my logging proxy, and
  Playwright adds `<-loopback>`, so loopback traffic is proxied too. Every
  request the browser's network service made went through it.
  - 383 requests in all: 347 to the static server and 8 to the mock. The
    proxy forwarded only these two hosts.
  - Foreign, blocked: `www.google.com` 7, `content-autofill.googleapis.com` 13,
    `accounts.google.com` 4, `update.googleapis.com` 2, `clients2.google.com` 1,
    `android.clients.google.com` 1.
  - Not one request went to anthropic.com, npm, GitHub, Statsig, Sentry or
    any telemetry host.
- **Control** (`$V/control.log`): the same Chromium and proxy with no app
  code reproduces those Google hosts.
  - `about:blank`: `www.google.com`, `accounts.google.com`,
    `android.clients.google.com`.
  - A static page with password and URL inputs and no script:
    `content-autofill.googleapis.com` ×6.

  This traffic is Chromium's own (component updater, accounts, the autofill
  form-signature service reacting to the Settings form). The app's code
  does not send it.

## Timings (wall clock)

| | extraction | cold: initialize | cold: first `system/init` | warm: first `system/init` | whole e2e |
|---|---|---|---|---|---|
| 14 unloaded e2e runs (13 at `/`, 1 at the sub-path) | 4.1–5.8 s (median 4.8) | 6.7–8.0 s | 6.9–8.3 s (median 7.6) | 5.8–6.8 s (median 6.1) | 23.7–31.4 s (median 24.9) |
| driver, no proxy (Node clock around the click) | 4.0 s | 6.98 s | 7.19 s | 5.96 / 6.15 / 6.01 s | |
| driver, logging proxy | 4.8 s | 7.04 s | 7.26 s | 6.07 / 6.15 s | |
| e2e with `npm test` in parallel | 9.9 s | 11.8 s | 12.1 s | 8.0 s | 38.4 s |
| darwin-arm64 `.tgz` (2,866 modules, 2,863 cached) | 5.8 s | 7.1 s | 7.4 s | 6.3 s | 26.3 s |

- **Worker phases** (boot line): globals 0.21–0.34 s, cacheRead 0.10–0.34 s,
  mount 10–15 ms, preImport 5.7–6.2 s cold and 4.5–4.8 s warm.
- **Turns** against the mock take under 0.3 s, by the mock-log timestamps.
- **Both limits hold with margin:** cold ≤ 8.3 s against 30 s; warm ≤ 6.8 s
  against 10 s, and 8.0 s under contention.

## Extras (beyond acceptance)

- **Steps 7 and 8** (file tools; denied Write) passed in all 16 runs.
- **Step 9** (interrupt) passed in 15 of 16 runs; see the discrepancies.
- **Sub-path:** `--base /vibe-dump/claude-code-web/` passed 10/10.
- **Platforms:** darwin-arm64 passed 10/10 with `--modules 2866`. I did not
  reproduce the other platform packages or API-key mode.

## Policy checks

- **No extracted Anthropic code in the repo:**
  - None of the 1,887 repo files over 1 KB (outside `.git` and
    `node_modules`) shares a sha256 with the 2,438 distinct files over 1 KB
    in the extracted reference tree.
  - 36 random 48-character substrings, sampled from the 12 largest
    extracted chunks, match 0 repo files.
  - The `chunk-*.js` files under `dist/runtime/jspm/` are `@jspm/core`
    chunks.
- **No identity spoofing:** the browser's own User-Agent reached the mock.

## Discrepancies with the integration report

1. **Step 9 (interrupt) is flaky.** It failed in e2e run 3 of 16:
   `FAIL 9 extra: interrupt mid-stream, then the next turn works: the streaming request was not abandoned`
   (`$V/e2e3.log`).
   - The mock log `$V/e2e3-mock.jsonl` shows the `stream slowly` request
     (#14, 00:55:07.395) running to completion with no `aborted` flag. The
     next prompt was `"[Request interrupted by user]\n\nsay hi"`; in passing
     runs it is `"stream slowly\n\n[Request interrupted by user]\n\nsay hi"`.
   - So in that run the interrupt ended the turn (the result came promptly),
     but the SSE fetch was not cancelled.
   - The report's "ten consecutive full e2e runs passed" overstates its
     stability. Acceptance steps are unaffected.
2. **The e2e never exercises the CORS preflight.** Playwright's Chromium
   network manager auto-fulfils intercepted OPTIONS preflights with a
   permissive 204 whenever request interception is on
   (`node_modules/playwright-core/lib/coreBundle.js` around line 35797,
   `isInterceptedOptionsPreflight`).
   - Because of `context.route('**/*')`, all 16 e2e mock logs show
     `OPTIONS 0`. The mock's strict-CORS gate, which imitates the real
     `api.anthropic.com`, is never tested by `npm run test:e2e`.
   - My driver, without interception, showed that the real preflight passes
     (1 OPTIONS, `ok=true`). So the claim holds, but only outside the e2e.
3. **Step 6 is scoped to page, Worker and service-worker traffic.**
   "Only 2 hosts were used" holds for the app. At the network level, the
   headless Chromium also contacts Google services (above). The e2e's
   `context.route` cannot see them.
4. **The timing ranges are slightly optimistic.** On this machine I measured
   cold 6.9–8.3 s (reported 6.5–7.5 s) and warm 5.8–6.8 s (reported
   5.4–6.3 s). The whole e2e took 23.7–27.1 s, or 31.4 s in the run that
   failed step 9 (reported 22–26 s). Under contention I measured cold
   12.1 s (reported 20.7 s).
5. **Not reproduced:** the linux-arm64, linux-x64-musl, linux-arm64-musl
   and darwin-x64 `.tgz` runs, and API-key mode. Their claims stand
   unverified by me, not refuted.
