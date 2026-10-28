# claude-code-web — status

_Last update: ChatGPT-option integration (2026-10-28, 04:56 UTC). Older rounds below, newest first._

## ChatGPT option (Sign in with ChatGPT) — integrated

_Integration 04:24–04:56 UTC on 2026-10-28, after tracks P (page) and W (Worker). Spec: ARCHITECTURE.md
Appendix A and its "As built (ChatGPT option)" section. Run outputs: scratchpad `cgi/`._

**Status: works end to end against the mock; never run against OpenAI.** With the real Claude Code
2.1.311 binary in headless Chromium, `node test/e2e.mjs --provider chatgpt` passes 15/15: sign-in by
pasting the callback URL, the acceptance steps 1–6 and the extras in ChatGPT mode, with every
`/v1/responses` request checked against the Sign in with ChatGPT rules and against how
`/v1/responses` validates its input. The Anthropic-mode e2e still passes 11/11, and its behaviour is
unchanged (the only shared edits are in the transcript, which hides `system/thinking_tokens` progress
lines and labels an empty thinking block "(no summary)", and the e2e printing turn times). No ChatGPT account was available, so nothing has been sent to
`auth.openai.com` or `api.openai.com`.

### What works (against the mock, real 2.1.311 binary)

| step (`--provider chatgpt`) | result |
|---|---|
| 0. Sign in with ChatGPT by paste: authorize URL (`dynamic_agent_client`, `agent_name_hint=claude-code-web` on the first registration only, `ext_agent_host_id` urn:uuid, loopback redirect, PKCE S256, `resource`), code exchange, issued `oaiapp_…` client reused; model list (hidden models filtered) | PASS |
| 10. ChatGPT tokens only in this tab's sessionStorage; a new tab is signed out; no `window.__cc` without `?test` | PASS |
| 1. extraction; 2. cold boot; 2b. warm boot (system/init within 30 s / 10 s) | PASS |
| 3. `say hi`: exactly one `POST /v1/responses` (model gpt-5.5, effort medium, `store:false`, `stream:true`, no system items, no forbidden fields, no Codex or Anthropic headers, the issued bearer), its CORS preflight ok, no `/v1/messages` | PASS |
| 4. weather tool: `function_call` → page MCP handler → `function_call_output` with the same `call_id` → echoed | PASS |
| 5. write a file, kept after a reload (OPFS) | PASS |
| 7. Glob, Grep, Read, Edit over five chained requests; 8. a denied Write | PASS |
| 9. interrupt mid-stream: the upstream SSE fetch is aborted (3–4 of 114 events sent), next turn works | PASS |
| 11. a refused access token (401): the Worker asks once with `unauthorized`, the page refreshes (rotated refresh token saved first), the request is retried once with the new token | PASS |
| 13. usage limit (429 `subscription_sharing_usage_limit_exceeded`): shown to the user ("ChatGPT usage limit reached on the plus plan; it resets at …"), **one** upstream request (Claude Code honours `x-should-retry: false`); a short rate limit arriving as `response.failed rate_limit_exceeded` ("try again in 1.2s") before any output: the adapter answers 429 with `retry-after: 2`, Claude Code retries once (one `api_retry`) and the retry is answered after 2.2 s; a failure **after** some text (`response.failed server_is_overloaded` → an Anthropic `overloaded_error` event mid-stream): 2.1.311 does not retry the request but keeps the partial text and sends a new "resume" user message, which is answered; context overflow (400 `context_length_exceeded`): the adapter's "prompt is too long: N tokens > M maximum" makes the real 2.1.311 **compact the conversation through the adapter** and answer (upstream `overflow:400, compact:200, compacted:200`) | PASS |
| 12. every request of a run (26 in the final runs) has the SIWC shape and valid input structure; every refresh grant accepted; Claude Code replays our reasoning envelope in 7 of 7 follow-ups | PASS |
| 6. only the static server and the mock were contacted | PASS |
| `--access-ttl 65` (tokens live 65 s): the Worker asks again with `expired`, the page refreshes and rotates 10 times in one run, none refused | 15/15 |
| `--base /vibe-dump/claude-code-web/` (Pages sub-path) | 15/15 |
| `--fake --provider chatgpt` (page wiring, token handoff with the fake worker) | 9 pass, 6 skip |

Also confirmed with the real binary (report J §9.5): Claude Code 2.1.311 keeps and replays the
`thinking` blocks carrying our `cxr1.` signature envelope verbatim, and takes the usage in
`message_delta` over the `message_start` estimate (the result line shows the mock's 100 in / 30 out,
not the ~9,700-token estimate). It sent no `max_tokens: 1` probes and no `count_tokens` in any run.

### Timings (mock, unloaded machine, eight ChatGPT-mode runs)

| | ChatGPT mode | Anthropic mode (same tree) |
|---|---|---|
| cold boot, Start to first `system/init` | 6.6–7.9 s (initialize 6.4–7.7 s) | 7.2–8.1 s |
| warm boot (after a reload) | 5.7–6.2 s | 6.3–6.4 s |
| turn, warm `say hi` (Send to `result`) | 123–183 ms (first turn of a session, with its system/init: 401–538 ms) | 90–112 ms |
| turn with one tool round trip (weather) | 273–346 ms | 236–269 ms |
| five chained requests (file tools) | 627–720 ms | 530–536 ms |
| whole e2e run (ChatGPT mode runs four more turns) | 26–31 s | 26–28 s |

The adapter adds about 30–40 ms per request here (translation both ways, a reasoning item per mock
reply, the read-ahead to the first output event); boot time is unchanged.

### How to run

```bash
cd packages/claude-code-web
npm test && npm run build
CHROMIUM_PATH=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome node test/e2e.mjs --provider chatgpt
node test/e2e.mjs --provider chatgpt --trace --log /tmp/page.log   # one line per upstream request
node test/e2e.mjs --provider chatgpt --access-ttl 65               # stress the token handoff
node test/e2e.mjs --provider chatgpt --base /vibe-dump/claude-code-web/
node test/e2e.mjs --fake --provider chatgpt
# by hand: PORT=4173 node ../../scripts/serve.mjs dist ; node mock/mock-api.mjs 18080
#   ChatGPT subscription -> Advanced: endpoints: API base http://127.0.0.1:18080/v1, issuer http://127.0.0.1:18080
```

Unit tests: `npm test` 339/339 (track P 38, track W 47, integration `I-chatgpt` 6).

### What does not work, or is not verified

- **No real OpenAI traffic yet.** Everything above is against the mock, which imitates the documented
  behaviour (and K's CORS probes), not the real service.
- **Model coverage:** only `gpt-5.5`'s classic tool shape is exercised. The responses-lite models
  (gpt-5.6-\*, gpt-6\*) may need tools as an `additional_tools` developer item (J §9.3).
- **Not emulated:** the `clear_tool_uses_*` context-management edit (2.1.311 sends only
  `clear_thinking … keep:'all'`); Anthropic server tools; prompt-cache controls (OpenAI caches by
  prefix and `prompt_cache_key` = Claude Code's session id). Token counts are estimates until the
  final usage arrives; the cost line is in Claude prices (the page says so after Start).
- **ID token** signature not verified (JWKS not CORS-readable); nonce checked; email and plan shown
  unverified. **Revoke** on log out is best effort (its CORS is unknown).
- The model list is cached in memory; after a reload Start fetches it once for the context window and
  effort levels (if that fails, Claude Code keeps its own compaction window and efforts pass through).

### Needs a real ChatGPT Plus/Pro login to confirm

From report J §9 (still open) and K §6:
1. **CORS on success** (J §9.1, K §6.1): does a successful `POST api.openai.com/v1/responses` SSE carry
   `ACAO: *` to `https://kumavis.github.io` and stream incrementally? (Preflight and error paths are
   verified by K.) Does the SIWC entitlement check look at `Origin`, `Referer` or the browser UA?
2. **The paste flow** (K §6.2): does `auth.openai.com/api/accounts/authorize` complete when nothing
   listens on `127.0.0.1:1455`, leaving the code readable in the failed tab's URL? Is the issued
   `client_id` stable across re-logins with the same `ext_agent_host_id`? Is a Cloudflare challenge
   shown to a normal browser there?
3. **A real expired token** (K §6.3): edge 401 without CORS (a `TypeError`, handled as "maybe
   unauthorized", renewed once) or a readable app-layer 401 (renewed once)? Both paths are
   implemented and unit-tested; which one OpenAI uses is unknown.
4. **Tools on responses-lite models** (J §9.3): do classic top-level `tools` work for gpt-5.6-\* and
   gpt-6\*, or must they go in `additional_tools` with `reasoning.context: "all_turns"`? Is
   `reasoning.summary: "auto"` accepted for every listed model?
5. **The model list** (J §9.4): what `GET /v1/models` returns for a SIWC token (which models, the
   shape of `supported_reasoning_levels` and `context_window`), and whether anything is gated on a
   client version.
6. **Token response details:** the format of `earliest_refresh_at` (`parseTime` accepts unix s/ms, ISO,
   or small relative seconds), whether `scope` is returned (checked only if present), `expires_in`.
7. **Terms** (J §9.6, K §3–4): whether a static GitHub Pages app whose code runs only in the user's
   browser counts as an "open-source and locally hosted" app for plan usage; the README states the
   position and the Plus/Pro requirement; `/siwc/request-client-id` exists if certainty is wanted.

J §9.2 (Route A's `originator`) does not apply: Route A (the Codex CLI backend) is not used. J §9.5
was answered with the real binary (above).

### Integration log

- 04:24–04:31: the combined tree was green as delivered (`npm test` 333/333, build, chatgpt 14/14,
  anthropic 11/11); the P/W interface matched (boot `provider`, `provider-token-request` /
  `provider-token`, env, constants), so there was no mismatch to fix. Hardening: the adapter constants
  and `AUTO_COMPACT_WINDOW_RANGE` now have one source (`boot/policy.js`, re-exported by the page);
  the mock refuses what `/v1/responses` would (`inputStructureProblems`); turn times printed;
  `test/unit/I-chatgpt.test.mjs`.
- 04:31–04:37: effort clamped to the model's supported levels (`provider.efforts` → `clampEffort`);
  "(no summary)" for an empty thinking block; mock "hit the usage limit" and compaction scenarios;
  e2e extra 13.
- 04:37–04:44: the transcript no longer prints a line per `system/thinking_tokens` progress message
  (2.1.311 emits one per thinking delta, so long reasoning flooded it); e2e `--access-ttl` and
  `--screenshot`; step 12 checks every refresh grant and reports the token-request reasons;
  ARCHITECTURE.md "As built (ChatGPT option)", worker-protocol.md (`provider.efforts`), README.
- 04:47–04:52: mock "hit the rate limit" (fails before output once, then answers) and "fail mid-stream"
  (text, then `response.failed`; the mock treats 2.1.311's resume request as that scenario's
  retry); extra 13 checks both through the adapter; `I-chatgpt` runs the adapter against every mock failure
  scenario in Node. Finding: after a mid-stream error 2.1.311
  keeps the partial assistant text and asks the model to resume in a new user message (no
  `api_retry`); the translated resume request passes the strict input checks.
- final round (04:51–04:55, `cgi/k*`): `npm test` 339/339; build ok; `--provider chatgpt` 15/15 twice, under
  `--base` and with `--access-ttl 65`; anthropic 11/11 at `/` and under `--base`; `--fake` both
  providers green.
- next (needs an account): the list above, starting with 1, 2 and 4.

## ChatGPT option — track P report (page side)

Started 03:59 UTC, finished 04:24 UTC. Spec: ARCHITECTURE.md Appendix A. Owns src/host/{siwc,settings,
invocation,session,worker-bridge,fake-worker,constants}.js, worker-protocol.md, src/ui/*, src/main.js,
mock/mock-api.mjs, test/e2e.mjs, README.md, test/unit/P-*.test.mjs.

- done:
  - settings.js: authMode 'chatgpt'; public `chatgpt` {clientId, extAgentHostId, model, effort, baseUrl,
    issuer} patched field by field; secret `chatgptTokens` in SECRET_FIELDS (same remember semantics);
    older saved settings load with the defaults; `reload()`; `chatgptConfig()`.
  - siwc.js: buildAuthorizeUrl / parseCallbackUrl / pkce (WebCrypto, deps injectable) / decodeJwt /
    tokensFromResponse / parseTime / normaliseModels; createSiwc: beginLogin, completeLogin (state,
    client_id, nonce and granted-scope checks), getAccessToken (single-flight, 5-min window,
    earliestRefreshAt, rotation persisted before resolving, cross-tab Web Lock + re-read with
    "remember"), listModels (retry once after 401 or a CORS-less TypeError), logout (best-effort revoke).
  - invocation.js: chatgpt env (ANTHROPIC_BASE_URL=https://openai-adapter.invalid,
    ANTHROPIC_API_KEY=openai-adapter, CLAUDE_CODE_AUTO_COMPACT_WINDOW from the context window),
    harnessModel() keeps --model claude-sonnet-5-5, providerConfig(), checkCredentials, checkChatgptUrls.
  - worker-bridge.js serveProviderTokens(); session.js passes `provider` in boot, attaches the token
    server to the Worker before boot, checks the token (and fetches the model list for the context
    window when unknown) before booting, notes the cost-line caveat.
  - fake-worker.js speaks provider-token-request/provider-token.
  - UI: "ChatGPT subscription" radio, src/ui/chatgpt-panel.js (Open sign-in, paste field, Complete
    sign-in, signed-in state + Log out, model dropdown from listModels, effort select, notes, advanced
    endpoints). Screenshots light/dark/390 px in scratchpad p/ (no horizontal overflow).
  - mock: /v1/responses (SSE scenarios + request-shape checks), /v1/models, fake issuer, /__revoke-access.
  - e2e `--provider chatgpt` (step 0 sign-in, 10, 1-9, 11 refused token, 12 request shapes).
  - worker-protocol.md (boot `provider`, provider-token messages, rules 5-6, "Provider tokens"), README.
- results (04:23): `npm test` 333/333 (P-siwc 15, P-host 13, P-mock-responses 10 new); `npm run build` ok;
  e2e against track W's adapter: `--provider chatgpt` 14/14 (twice, 27-31 s), `--provider chatgpt
  --base /vibe-dump/claude-code-web/` 14/14, anthropic 11/11 (twice), `--fake --provider chatgpt` 9 pass
  5 skip, `--fake --skip-extract` both providers green. Outputs: scratchpad p/run1*.txt, run2-*.txt.
- not done / open: the real OpenAI endpoints were not exercised (no account): the authorize page
  with nothing on 127.0.0.1:1455, the format of `earliest_refresh_at`, CORS on the revoke endpoint and
  on a successful /v1/responses stream. The ID token's signature is not verified (JWKS not
  CORS-readable); only its nonce. ARCHITECTURE.md as-built not updated (not this track's file).
- finding (bundle 2.1.311): CLAUDE_CODE_AUTO_COMPACT_WINDOW accepts 100k..1M and is clamped to the
  Claude model's window; CLAUDE_CODE_MAX_CONTEXT_TOKENS only applies with DISABLE_COMPACT or an
  unrecognised model, so the page does not set it.

## ChatGPT option — track W report (Worker side)

Started 04:00 UTC, finished ~04:25 UTC. Spec: ARCHITECTURE.md Appendix A + J §7. Owns src/runtime/boot.js,
src/runtime/boot/{openai-adapter,egress,policy}.js, src/runtime/boot/openai/*.js, test/unit/W-*.

- done:
  - `boot/openai/request.js` `toResponsesRequest(body, {model, smallModel, effort, sessionId, hoistSystem})
    -> {body, idMap}`: system blocks -> one leading developer message (billing line stripped);
    in-message role:"system" -> developer messages in place (deferred past pending call outputs;
    `hoistSystem: true` folds them into the leading one instead); tool_use/tool_result <->
    function_call/function_call_output (call_id = tool_use id, sanitized+hashed past 64 chars;
    interrupted calls get an "aborted" output; orphan results become user text); tools -> non-strict
    function tools (schema cleanup, DeferredToolPlaceholder and server tools dropped, names <= 64 with
    a reverse map); thinking/redacted_thinking with our `cxr1.` envelope -> reasoning items
    (other-model and dangling ones dropped, clear_thinking keep N honoured); images -> input_image,
    PDFs -> input_file, text docs -> input_text, else a placeholder; reasoning {effort, summary:'auto'},
    include reasoning.encrypted_content, store:false, stream:true, prompt_cache_key = session id.
    The body is built from scratch: no max_output_tokens/temperature/metadata/... ever.
  - `boot/openai/stream.js` `createResponsesToAnthropicStream({model, idMap, inputTokens, contextWindow, pingMs})`
    (J §7.6: message_start with placeholders, text / tool_use (input_json_delta) / thinking
    (signature_delta envelope) blocks, out-of-order events held back, completed -> message_delta
    end_turn|tool_use|max_tokens|refusal with usage incl. cached tokens, failed/error/EOF -> error event,
    pings on silence) + `aggregateAnthropicEvents` for non-stream calls.
  - `boot/openai/errors.js` `mapUpstreamError(status, body, ctx) -> {status, body, headers}` (J §7.7).
  - `boot/openai/token.js` `createTokenBroker({post})`: get()/renew(failedToken, {ambiguous})/onMessage().
  - `boot/openai-adapter.js` `installOpenAIAdapter(scope, {provider, getToken, nativeFetch, syntheticOrigin, log, warn, pingMs})`;
    a pre-stream upstream failure (response.failed before any output) becomes an HTTP error, so
    "prompt is too long" is a 400 and usage limits are 429 + x-should-retry:false.
  - `boot/policy.js` `providerConfig`, `applyProviderEnv` (+ OPENAI_ADAPTER_ORIGIN/KEY, equal to the
    page's); `boot/egress.js` ChatGPT-mode policy; `boot.js` wiring (provider-token routed to the broker).
- results: `npm test` 332/332 (W: request 10, stream 10, errors 5, token 5, adapter 11, boot 5,
  browser 1 = 47 new; W-browser runs the adapter as plain ESM in a Chromium module Worker against a
  CORS provider). `npm run build` ok (boot/ 13 files). With track P's page + mock:
  `node test/e2e.mjs --provider chatgpt` 14/14 twice (real 2.1.311 binary; reasoning envelope
  replayed by Claude Code in 7 of 7 follow-ups; interrupt, refused-token refresh, file tools pass);
  `node test/e2e.mjs` (Anthropic mode) 11/11, no egress refusals.
- bundle finding: CLAUDE_CODE_AUTO_COMPACT_WINDOW sets the auto-compact window to min(model window,
  value), accepted 100k..1M (clamped outside, with a warning); claude-sonnet-5-5's window is 1M, so
  272000 takes effect. CLAUDE_CODE_MAX_CONTEXT_TOKENS is only read for model ids Claude Code does not
  recognize (or with DISABLE_COMPACT): a no-op with --model claude-sonnet-5-5, so it is not set.
  Usage: Claude Code merges message_delta usage over message_start when the value is > 0.
- not verified (needs a real ChatGPT login): `reasoning.summary:'auto'` and classic top-level tools on
  the real /v1/responses for each model; readable SSE success responses cross-origin.

## Fix round F2 (credentials, interrupt race, Worker guard, tool allowlist, notices, test paths)

Started 01:33 UTC, finished ~02:00 UTC. Scope: H-review-round-1.md items owned by F2. All six done.

- done:
  1. credentials (settings.js, persist.js createJsonStore `area`, settings-panel.js, main.js, README):
     the key/token goes to sessionStorage `cc-web:secrets` unless "Remember on this device"
     (`remember`) is ticked; unticking removes it from localStorage; an old localStorage copy
     is migrated out on load; `settings.getPublic()` (no secrets). `window.__cc` only under
     `?test` (e2e opens `index.html?test`), `__cc.settings` is the redacted view. e2e step 10
     (new) checks localStorage/sessionStorage, a new tab, no `__cc` on a plain visit.
     Tests: D-host-parts 'settings: ...' (3).
  5. "Unofficial; not affiliated with or endorsed by Anthropic" in header, footer, README top;
     `checkBaseUrl` (invocation.js): https, or http on loopback only; warned in the panel,
     refused by Session.start. Tests: D-host-parts 'invocation: the base URL ...',
     D-session 'session: Start refuses a base URL ...'.
  2. interrupt race, diagnosed: the /v1/messages stream does NOT use the http shim. The
     CLI's fetch wrapper (dw -> uZ -> gl -> wlr in 2.1.311) calls globalThis.fetch with
     the SDK's AbortSignal; Bun.FetchSession is used only when Bun.isStandaloneExecutable
     is true (ours is false). `?trace` now logs per fetch `(direct|http-shim, signal)` and
     when the signal aborts relative to the response. e2e `--trace --interrupt-loops 25`:
     25/25 passed, every API fetch `direct, signal`, slow-stream aborts ~590 ms after
     dispatch (response at ~10 ms), stream abandoned after 3-4 of 106 events
     (scratchpad f2/loop1.*). Shim hardening anyway (B-http-abort.test.mjs, 5 tests: destroy
     between fetch resolving and the reader, signal mid-stream, signal while pending, abort
     before/right after end(), pre-aborted signal): only defect found was the abort
     listener never removed from a long-lived signal; now removed on destroy/end. e2e step 9
     now also fails if the interrupted turn ends in `success` (interrupt not applied).
  3. Worker defence in depth: `src/runtime/boot/policy.js` holds POLICY_ENV (host/constants.js
     re-exports it) and `workerEnv()`, which boot.js uses so the flags are merged last;
     `src/runtime/boot/egress.js` wraps fetch and WebSocket before the Node globals: hosts
     outside {ANTHROPIC_BASE_URL origin, https://api.anthropic.com, page origin} and any
     authorization / x-api-key header to an origin other than the base URL's are refused
     (TypeError, code EGRESS_REFUSED) and logged as warn (header names only). Tests:
     I-egress.test.mjs (4). Docs still to update: worker-protocol.md, ARCHITECTURE as-built.
  4. tool allowlist: constants.js `ALLOWED_TOOLS` (Read, Write, Edit, Glob, Grep, NotebookEdit,
     Task, TodoWrite, AskUserQuestion, ExitPlanMode, Skill) + `isToolAllowed()`; buildArgv
     passes `--tools <comma list>` (the bundle's commander option `--tools <tools...>`;
     spike-E/out-help.txt is an error dump, not the help) and no `--disallowedTools`;
     Harness answers can_use_tool with deny for anything outside the allowlist and the
     page's own mcp__<server>__ tools, before canUseTool/'permission' (new 'denied' event).
     Real e2e init: 11 tools (Task, AskUserQuestion, Edit, ExitPlanMode, Glob, Grep,
     NotebookEdit, Read, Skill, Write, mcp__page__get_weather; 2.1.311 offers no TodoWrite
     here), was 24. e2e step 2 fails on any tool outside the allowlist. Tests: D-host-parts
     'invocation: the built-in tools are an allowlist (pinned) ...', D-harness 'harness:
     can_use_tool for a tool outside the page allowlist is denied unasked'.
     Full e2e after 1-5: 11/11 (run-a), no egress-guard refusal in the page log.
  6. `test/research.mjs`: `RESEARCH_DIR` = `$CC_RESEARCH_DIR` or the scratchpad default, and
     `LINUX_X64_BINARY`; used by A-*.test.mjs, B-support, C-support and e2e.mjs (no other
     copy of the path in test/). acquire.js `loadZstd()` (lazy `import('fzstd')`) is passed as
     `zstdDecompressSync` by extractFile and downloadAndExtract. Tests: D-host-parts 'acquire:
     extractions pass fzstd ...' and 'acquire: a real extraction through extractFile checks
     every .zst asset (report.zst.checked > 0)' (skips without the research binary).
  docs: worker-protocol.md (argv `--tools`, env merge, rule 5 egress guard), ARCHITECTURE
  as-built (F2 bullets), README (unofficial notice, credential storage, allowlist,
  CC_RESEARCH_DIR, `?test`, e2e `--trace` / `--interrupt-loops`).
  `npm test`: 248/248 (28 s; 17 new). `npm run build`: ok (boot/ now 7 files; fzstd is a
  lazy 8 KB chunk).
- results (final tree): `npm test` 248/248 (30 s); `npm run build` ok; `npm run test:e2e`
  10 full runs in a row, all 11/11 (steps 1-9, 2b and the new 10; 25.4-26.9 s; cold init
  7.1-7.7 s, warm 5.6-6.6 s; init 11 tools every run; no egress-guard refusal in any page
  log); step 9 passed 10/10 (abandoned after 3-4 of 106 events, result 0.0 s after the
  interrupt), plus 25/25 in the traced loop run; `--base /vibe-dump/claude-code-web/` 11/11;
  `--fake --skip-extract` 7 passed, 4 skipped. Outputs: scratchpad f2/ (loop.txt, run<N>.*,
  loop1.* traced, final-base.*).
- not done / open: the verifier's 1-in-16 step-9 failure did not reproduce (35 runs here);
  the http shim is not on the API path, so its hardening cannot be what fixed it. If it
  recurs, run `node test/e2e.mjs --trace --interrupt-loops 30 --log <f>`: step 9 now says
  whether the turn ended in success (interrupt not applied) or the stream ran on, and the
  trace shows when the SDK signal aborted. The egress guard covers fetch and WebSocket, not
  XMLHttpRequest/EventSource (the CLI uses neither). Session's 'denied' note has no test of
  its own (the Harness 'denied' event does).

## Fix round F1 (persistence, multi-tab, e2e gaps, sw, small fixes)

Scope from `docs/research/claude-code-in-browser/H-review-round-1.md`.

- done (code + unit tests in `test/unit/D-persist.test.mjs`, `B-fs.test.mjs`):
  1. persistence: persist.js load()/clear() await the save chain, save() returns
     the real promise (failures reach Session.note()), storage.persist() after the
     first write; Session.#start boots from the in-memory snapshot; Session.stop()
     sends `fs-flush` with an id, waits for that fs-sync and its save, then ends
     stdin; `whenSaved()` + 'saved' event; fs.js onChange `maxWaitMs` (boot.js: 2 s);
     flush on pagehide / hidden (`Session.flushOnHide`, main.js).
  2. Web Lock `cc-web:home` (ifAvailable, then queued; a second tab shows
     "open in another tab" and refuses Start / clear workspace).
  4. sw.js `claim` message + sw-client posts it on a hard reload; no classic fallback.
  5. no extract/clearCache while booting/ready (binary panel disables them).
  6. boot.js reports an uncaught error once (`boot/errors.js`, preventDefault);
     Session reads messages/toolCalls from the harness (one log, not two).
  3. e2e: `context.route` dropped; egress blocked at the network level (dead
     loopback proxy + `--host-resolver-rules`, probe must fail); `request` and
     `requestfailed` record foreign hosts; step 3 asserts exactly one strict-CORS
     OPTIONS preflight (ok) before the POST; step 5 waits for `whenSaved()` and
     uses `page.reload()` without `stop()`; the mock's slow stream is ~21 s and
     step 9 says whether a missed abort ran to completion or is still streaming.
- results: `npm test` 231/231 (30.8 s, 15 new tests); `npm run build` ok;
  `npm run test:e2e` 6 of 6 full runs 10/10 (one, then five in a row: 23.4–25.3 s;
  cold init 7.0–7.8 s, warm 5.9–6.4 s); every run's mock saw exactly one
  `OPTIONS /v1/messages?beta=true` with `preflight.ok: true` before the POST;
  step 9 passed 5/5 in the series (6/6 overall), so the interrupt race (F2's
  shim fix) did not show here; the longer stream makes it obvious when it does.
  `node test/e2e.mjs --fake --skip-extract`: 6 passed, 4 skipped (as before).
- not done: the reviewer's "best fix" (the Worker writing OPFS itself through
  `createSyncAccessHandle`); the pagehide flush stays best effort.

## Summary

**The acceptance test passes.** In headless Chromium against the mock API,
the official 2.1.311 linux-x64 binary is dropped into the page, extracted,
and run unmodified (apart from the six mechanical loader rewrites) in a Web
Worker. All six acceptance steps pass, at `/` and under the GitHub Pages
sub-path, and on every non-Windows platform package. Four further checks pass
too: the built-in file tools on the virtual filesystem, a denied permission,
an interrupt mid-stream, and API-key mode. One race in the test itself (the
mock noticing the aborted stream a moment after the result) was fixed; all
ten full runs since then passed, the per-platform ones included.

| check | result | time (unloaded machine) |
|---|---|---|
| 1. extraction of the dropped 294 MB binary: 2,848 modules (2,846 cached; the two `.node` addons are skipped), 6 rewrites at their pinned counts; a reload reuses the cache | PASS | 4.4–5.7 s |
| 2. Worker boot, cold, to the first `system/init` (model, 24 tools, MCP `page: connected`) | PASS | 6.5–7.5 s (limit 30 s) |
| 2b. the same, warm (after a page reload) | PASS | 5.4–6.3 s (limit 10 s) |
| 3. `say hi`: assistant, then result `success`; exactly one `POST /v1/messages`, with `oauth-2025-04-20` beta and `anthropic-dangerous-direct-browser-access: true` | PASS | < 0.5 s per turn |
| 4. `use the weather tool`: the page's `get_weather` handler called once with the model's input; the result echoes it | PASS | |
| 5. `write a file`: in the workspace listing, and still there after a reload (OPFS) | PASS | |
| 6. no request to any host but the static server and the mock | PASS | |
| 7 (extra). Glob, Grep, Read, Edit on the VFS (Glob/Grep through the `rg` command-table shim) | PASS | |
| 8 (extra). the page denies a Write over `can_use_tool`: nothing written, the denial reaches the model | PASS | |
| 9 (extra). interrupt mid-stream: `error_during_execution` at once, the SSE fetch is aborted, the next turn works | PASS | |
| API-key mode (`x-api-key`), by hand with the dev driver | works | |
| steps 1–9 with each platform package dropped as its npm `.tgz`: linux-x64, linux-arm64, linux-x64-musl, linux-arm64-musl (2,848 modules), darwin-x64, darwin-arm64 (2,866 modules, their own pinned counts) | all 10/10 | 23–34 s per run |

Whole e2e run: 22.7–25.6 s. Under CPU contention (the unit suite running in
parallel) the cold boot took 20.7 s, still inside the limit.

Unit tests: 216 across tracks A–D and integration, all passing
(`npm test`: about 26 s once the Vite-built vendor bundle is cached in the OS
temp dir, about 85 s cold; the Chromium-based tests are included).

## What was fixed or added in integration

- `src/runtime/boot.js` + `src/runtime/boot/` (Worker bootstrap):
  - Node globals.
  - Stdin buffered until `process.stdin` exists.
  - VFS mounted from the Cache API, then the OPFS snapshot restored, then
    seed files written where absent (onboarding done, folder trusted).
  - Bun installed, then `__bunRequire` over a registry. The registry is
    filled by one blob "loader" module whose static imports pre-import every
    require target in dependency-safe order, so the browser fetches the graph
    in parallel. The order is computed at extraction time and stored in
    `manifest.boot`.
  - Then `cli` is imported.
- `public/sw.js`:
  - Serves `BASE/vfs/app/*` from the Cache API, rewriting built-in
    specifiers (`src/runtime/boot/specifiers.js`).
  - Keeps the rewritten JS in a companion cache, so warm boots skip the
    rewrite.
  - Takes control on first visit (`skipWaiting` + `clients.claim`).
- **fs shim:** every "save config with lock" failed
  (`ft(...).lock is not a function`; the first attempt said
  `Cannot read properties of undefined (reading '0')`).
  - Cause: graceful-fs (inside proper-lockfile) clones `fs` by copying
    property descriptors. memfs's `ReadStream`/`WriteStream` getters read a
    private symbol off `this`, so on the clone they throw. That left
    proper-lockfile's CommonJS wrapper with empty exports.
  - Fix: the four stream classes are now plain data properties.
- **`boot/require.js`:** forwarding proxies for cyclic requires could not be
  constructed (an arrow-function Proxy target has no `[[Construct]]`). This
  is not reached in 2.1.311, whose one cyclic site only calls functions.
  Fixed anyway with a bound-function target.
- **Page:**
  - `?trace` (boot.js logs every spawn, fetch and Worker the CLI starts) and
    `?debug` (the CLI's `--debug-to-stderr`), both shown in the page log.
  - `__cc.workspaceText(rel)` for tests.
- **Mock:**
  - `run the file tools` (Glob, Grep, Read, Edit over four round trips).
  - `stream slowly` (about 3 s of SSE, and it records an abandoned request).
  - The scenario is taken from the phrase that comes *last* in the prompt,
    because after an interrupt the CLI folds the old prompt,
    `[Request interrupted by user]` and the new prompt into one user message.
- **e2e:**
  - Extra steps 7–9.
  - `--base <path>` (serve under a sub-path).
  - `--log <file>` (the page log of every page opened).
  - Prints the Worker's boot-timing line.
- **New unit tests in `test/unit/I-runtime.test.mjs`:**
  - specifier rewriting;
  - the eager/lazy require scanner;
  - pre-import ordering, including cycles;
  - `__bunRequire` (shims, registry, text assets, cycle proxies,
    `MODULE_NOT_FOUND`);
  - the fs clone regression.
- **Also:** a mock test for the interrupt prompt shape, and a Session test
  for the diagnostics flags.

The rewrite list in `src/extract/rewrites.js` is unchanged (six rewrites,
counts pinned per flavor); integration needed no new rewrite.

## What a boot looks like (from `--log`)

```
boot: 400 modules pre-imported (0 failed, 1 require(s) answered with forwarding proxies:
chunk-dxb5hzgj.js; 1 cyclic top-level pair(s), 28 in-function cycle edge(s) dropped);
timings {"globals":321,"cacheRead":145,"mount":11,"graph":11,"preImport":5996} ms; 6549 ms total
```

- About 1,800 modules (about 35 MB of JS) are fetched through the service
  worker and evaluated. Pre-import dominates: about 6 s cold, about 4.7 s
  warm.
- The CLI's own debug log (`?debug`) shows a normal headless start. MCP
  `page` connects; the hooks plugins load; LSP finds 0 servers. Nonessential
  traffic, telemetry, autoupdate and Bootstrap are skipped by the policy
  flags.

Three expected `[ERROR]` lines remain in that debug log. None affects a turn:
- `/proc/version` is missing (WSL detection).
- `crypto.X509Certificate` is unavailable (the bundled CA root is not parsed;
  `fetch` uses the browser's TLS anyway).
- `/tmp` is world-writable without the sticky bit, so cross-session UDS
  messaging stays off, which is what we want.

## What does not work / not verified

- **The real API was not exercised.** Network to Anthropic and a credential
  are not available here.
  - The mock imitates the documented CORS behaviour (a preflight is refused
    unless it asks for the browser-access header), and the CLI sends that
    header. Whether `api.anthropic.com` accepts subscription (OAuth) tokens
    from a browser origin is unverified.
  - The README's gray-area section applies.
- **The in-page npm download** cannot run inside the e2e: npm is a foreign
  host, and Playwright cannot fulfil a 132 MB body. Track D verified it with
  a scratch probe against a same-origin copy.
- **Windows binaries are refused.** Their JS uses a `B:/~BUN/root/` prefix
  that no rewrite handles. The darwin builds run fine on the linux/x64 shims:
  OS checks happen at runtime, not at build time.
- By design (v1): no Bash, WebFetch or WebSearch; no TUI; no hooks worker; no
  session persistence across reloads (only the workspace persists).
- **Shim limits** that the paths exercised here do not hit (details in the
  track reports):
  - no asymmetric crypto or X.509;
  - `AsyncLocalStorage` is synchronous only;
  - `dns` resolves only IP literals and localhost;
  - the `rg` subset ignores `.gitignore`.
- 142 `import.meta.dirname` sites stay undefined in the browser. 141 are
  harmless `assetLoader` calls. One `path.resolve(import.meta.dirname, ...)`
  is in the built-in hooks-plugin builder and was not reached in any run.
- `npm run dev` (Vite dev server) runs the page and `?fake` only. The real
  Worker needs `dist/runtime/`, so use the build (below).

## How to run

```bash
cd packages/claude-code-web
npm test                                   # unit tests
npm run build                              # vite build + scripts/build-runtime.mjs -> dist/
npm run test:e2e                           # acceptance test + extras, headless Chromium + mock
node test/e2e.mjs --base /vibe-dump/claude-code-web/ --log /tmp/e2e-page.log   # under the Pages sub-path
node test/e2e.mjs --fake                   # page/host/UI wiring against the fake worker

# the page by hand, against the mock:
PORT=4173 node ../../scripts/serve.mjs dist      # http://127.0.0.1:4173/  (add ?trace or ?debug)
node mock/mock-api.mjs 18080                     # base URL http://127.0.0.1:18080, any placeholder credential
```

The e2e takes the binary from `$CC_BINARY`, by default the research
scratchpad copy of `@anthropic-ai/claude-code-linux-x64@2.1.311`'s
`package/claude`. Chromium: `$CHROMIUM_PATH`, else Playwright's default,
else `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.

## Next steps

1. Try the real API with an API key, then with a `claude setup-token` token,
   from a deployed page. Record what `api.anthropic.com` does with each.
2. Gallery integration: build the root gallery, shoot the thumbnail (it needs
   a `waitFor` that does not depend on a dropped binary), commit `dist/`.
3. Boot time (warm about 5.5 s, of which pre-import is about 4.1 s).
   Measured in a warm boot:
   - 1,728 modules (35.8 MB) come through the service worker.
   - Requests are in flight for only about 2.0 s of the 4.3 s fetch window.
   - Service-worker time to first byte: p50 22–42 ms, p90 140–230 ms.

   The modules come from the CLI's own dynamic `import()`s: `cli` statically
   imports 7 modules and dynamically imports 151, and the static-plus-dynamic
   closure is 2,159. The browser therefore finds them level by level.

   Tried and reverted, because neither helped:
   - pre-importing the entry's static closure (it is only 8 modules);
   - reusing an opened `Cache` in the service worker (no change, and stale
     after a re-extraction).

   Next levers:
   - Find out whether the gaps are evaluation or the import waterfall (a
     Chromium trace).
   - Prefetch-without-evaluate (fetch the startup set into service-worker
     memory as soon as the Worker starts).
   - Check whether Chromium code-caches modules a service worker serves to a
     dedicated Worker.
4. Conversation persistence across reloads (drop
   `--no-session-persistence`, keep `~/.claude/projects` in the snapshot,
   pass `--resume`).
5. Watch for drift on the next Claude Code release. The pinned rewrite
   counts, `C-bundle-surface` and `B-load` export checks are the alarms.
