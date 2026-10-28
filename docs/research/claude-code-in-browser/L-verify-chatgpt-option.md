# L — Independent verification of the ChatGPT subscription option

*Verifier and reviewer, 2026-10-28, 04:56–05:13 UTC, on the uncommitted integration tree (HEAD `dc129be` plus the
integration's working-tree changes). I changed no code and no STATUS.md. Raw outputs are in `<scratchpad>/ver/`,
my scripts in `<scratchpad>/ver-scripts/`. `<scratchpad>` is this session's scratchpad directory.*

## Verdict

**Partial.** Almost all of the integration report reproduces: unit tests, build, Anthropic mode, request shape,
token handling and policy posture all hold. What does not hold is "15/15 four times". **One of my three required
`--provider chatgpt` runs failed (12/15).**

- **Cause of the failure.** The interrupt in extra step 9 was not applied. The upstream stream ran to completion.
  The e2e does not resynchronise after a missed interrupt, so steps 11 and 13 then failed too, each reading the
  previous turn's `result`.
- **Not new.** The signature matches the Anthropic-mode step-9 flake recorded in H-review-round-1.md (1 in 16
  there). It is not caused by the adapter: its abort path is correct when tested alone, at 1 ms resolution.
- **Everything else passed.** The acceptance steps 0–6 and 12 passed in every run. The token handoff, storage and
  the Codex-identity rules all hold.

## What I ran

| what | result | evidence |
|---|---|---|
| `npm test` ×3 | 339/339 ×3 (29.2–31.3 s) | `<scratchpad>/ver/unit{1,2,3}.log` |
| `npm run build` ×3 | exit 0 ×3 (3.4–3.5 s); `build-runtime: … boot/ (13 files)` | `<scratchpad>/ver/build{1,2,3}.log` |
| `npm run test:e2e` (Anthropic) ×3 | **11/11 ×3** (25.2–25.6 s) | `<scratchpad>/ver/a{1,2,3}.txt`, `-mock.jsonl`, `.json` |
| `npm run test:e2e -- --provider chatgpt` ×3 | **15/15, 15/15, 12/15** (30.2 s, 29.8 s, 53.4 s) | `<scratchpad>/ver/c{1,2,3}.txt`, `-mock.jsonl`, `.json`, `-page.log` |
| `--provider chatgpt --access-ttl 65` (forced expiry) | 15/15, 10 refresh grants, all 200 | `<scratchpad>/ver/cttl.*` |
| `--provider chatgpt --base /vibe-dump/claude-code-web/` | 15/15 | `<scratchpad>/ver/cbase.*` |
| `--fake --provider chatgpt` | 9 pass, 6 skip (as reported) | `<scratchpad>/ver/cfake.txt` |
| `--provider chatgpt --trace --interrupt-loops 20`, then `30` (under contention, alongside the Anthropic loop) | 20/20 and 30/30 interrupts ok; 15/15 both runs | `<scratchpad>/ver/loopc*.txt`, `loopc-page.log` |
| `--trace --interrupt-loops 30` (Anthropic, concurrent) | 30/30 ok, 11/11 | `<scratchpad>/ver/loopa.*` |
| translator on the two captured 2.1.311 bodies (in memory) and synthetic round trips | clean, except one edge case (finding 3) | `<scratchpad>/ver/translator-check.txt` |
| adapter abort sweep (Node, real local SSE server) | an AbortError reaches the caller for every abort time; the upstream socket closes | `<scratchpad>/ver/abort-sweep*.txt` |
| token-handoff probe (my own Playwright driver; real binary; access tokens live 65 s) | no refresh or ID token crosses into the Worker; nothing in localStorage or OPFS without "remember" | `<scratchpad>/ver/token-probe.txt` |

Chromium: `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome` (HeadlessChrome/153). Each e2e ran with its own
`MOCK_LOG`. I read the mock logs with my own analyzer (`<scratchpad>/ver-scripts/analyze-mock.mjs`), not with the
e2e's verdicts.

**Interrupt totals across all runs:**

| mode | interrupts | missed |
|---|---|---|
| ChatGPT | 54 | 1 (run c3) |
| Anthropic | 33 | 0 |

Timings, from my runs:

| | Anthropic | ChatGPT |
|---|---|---|
| cold init | 6.8–7.4 s | 7.1–7.9 s |
| warm init | 5.6–6.1 s | 5.8–6.3 s |
| warm `say hi` | 93–113 ms | 121–158 ms |
| weather turn | 248–266 ms | 283–334 ms |
| file tools | 496–545 ms | 640–789 ms (789 ms is the 65 s-token run) |

These are within the report's ranges.

## ChatGPT-mode acceptance steps, with mock-log evidence (runs c1, c2, c3, cttl)

### Sign-in and token exchange: PASS (all runs)

**Authorize requests.** c1 #1: `client_id=dynamic_agent_client`, `agent_name_hint=claude-code-web`,
`ext_agent_host_id=urn:uuid:d12f…`, `redirect_uri=http://127.0.0.1:1455/auth/callback`,
`resource=https://api.openai.com/v1`, the scope includes `chatgpt.tokens.use.direct`, no mock problems, 302.
- The second sign-in (a new tab, #5) used `client_id=oaiapp_test` without `agent_name_hint`.
- The same `ext_agent_host_id` was used in both.

**Code exchanges.** #2 and #6 are both `content-type=application/x-www-form-urlencoded`, `client_id=oaiapp_test`,
`resource=https://api.openai.com/v1`. PKCE verified by the mock (`pkce_ok=true`), 200.

c2, c3 and cttl are identical apart from the UUIDs.

### Every `/v1/responses` request: PASS (all runs)

- **Coverage.** 26 POSTs in c1, c2 and cttl; 25 in c3.
- **Body.** Every request had a bearer the mock issued (`Bearer mock_at_…`), `store:false`, `stream:true`, no
  `role:"system"` items and no forbidden fields: `checks.forbiddenFields` was empty. That list includes
  `max_output_tokens`, `temperature` and `metadata`.
- **Input structure.** Valid in every request; the mock's `problems` was empty.
- **Headers.** Every request carried exactly accept, accept-encoding, accept-language, authorization, connection,
  content-length, content-type, host, origin, referer, sec-fetch-dest, sec-fetch-mode, sec-fetch-site and
  user-agent. There was no `originator`, no `chatgpt-account-id`, no `x-api-key`, no `anthropic-*`, no `x-codex-*`
  and no `x-stainless-*`.
- **User-agent.** The browser's own (HeadlessChrome/153).
- **Model and reasoning.** Model `gpt-5.5`; effort `medium`; `include:["reasoning.encrypted_content"]`;
  summary `auto`.
- **Statuses.** 23 × 200, 1 × 400 (the overflow scenario), 1 × 401 (the step-11 revoked token) and 1 × 429 (the
  usage limit).

The independent translator check reached the same result on both real 2.1.311 bodies:
- Both have mid-conversation system items (role sequences `us` and `usaus`). They became `dud` and `dudCOd`, with
  `d` the developer messages: no system items.
- The billing line was stripped.
- `DeferredToolPlaceholder` was dropped (14 tools became 13).
- No `$schema` and no `defer_loading` remained.
- Body keys: `model,input,tools,tool_choice,parallel_tool_calls,reasoning,include,store,stream,prompt_cache_key`.
  `metadata.user_id` (device id) is not forwarded.

### `function_call_output` round trip: PASS (all runs)

**Weather.** In c1, #11 replied with a `function_call` (`call_id=call_mock_weather_mvrncrkb`,
`mcp__page__get_weather`, `{"city":"Paris"}`). The follow-up #12 carried a `function_call_output` with the same
`call_id` and output `"Sunny in Paris, 21°C"`. The answer echoed it.

**File tools.** Five chained requests carried four call_id → output pairs into the next request.

**Synthetic checks** (independent of the mock):
- Parallel calls with an out-of-order event (output 2 delta while output 1 is open) became sequential blocks.
- A 79-character MCP name was shortened to `mcp__and_an_even_longer_tool_name_x` and mapped back.
- Reasoning was replayed as `R(rs_1,ENC1)` before the calls.
- An interrupted call got an `"aborted"` output.

### Refresh-token rotation: PASS

**Forced expiry, `--access-ttl 65` (cttl):**
- 10 refresh grants, all 200, all form-encoded with `client_id=oaiapp_test` and the `resource` parameter.
- Each grant presented a refresh token the mock had issued earlier; none was reused.
- The Worker asked with reasons start, expired and unauthorized.

**Revoked token, step 11 (c1):**

| request | status | bearer |
|---|---|---|
| #26 `/v1/responses` | 200 | `mock_at_4…` |
| #27 `/v1/responses` | 401 (token revoked) | `mock_at_4…` |
| #28 `refresh_token` grant | 200 | — |
| #29 `/v1/responses` | 200 | new bearer `mock_at_5…` |

**My probe:** 4 turns 6.5 s apart with 65 s tokens.
- The Worker asked with reasons `start` and 4 × `expired`; 5 refresh tokens were seen in the page.
- 7 refresh grants: one at Start, one for the model list and five token answers. All 200, no problem codes.

### Only the static server and the mock: PASS

- Step 6 passed in every run, with 0 foreign hosts and the network-level probe blocked.
- My probe recorded 0 foreign hosts.
- No page log contains an egress-guard refusal.
- `/v1/messages` POSTs in ChatGPT mode: 0.

### Extras

**Step 9 (interrupt): PASS in c1, c2, cttl, cbase and 50/50 traced loops. FAIL in c3.**
- In c3 the slow request (#25) reached the mock at 05:02:27.893. The interrupt followed about 0.6 s later.
- No `result` arrived within 20 s.
- The next request (#26, 05:02:51.0) had the prompt `"[Request interrupted by user]\n\nsay hi"` and 39 input
  items. A normal run has the prompt `"stream slowly\n\n[Request interrupted by user]\n\nsay hi"` and 35 items.
- So the slow turn's complete answer was kept in history: the stream ran to completion. This is the signature
  H-review-round-1.md recorded for Anthropic mode.

**Steps 11 and 13: PASS in every run except c3.** There they read the previous turn's late result (`success ""`,
then each answer one turn late). This is a cascade from step 9, not a defect of their own.

**Step 13 behaviour reproduced (c1, c2, cttl):**
- Usage limit: 1 upstream request, and the message reached the transcript.
- Rate limit: 1 `api_retry`, answered after 2.2 s.
- Mid-stream failure: 0 `api_retry`, partial text kept, resume answered.
- Overflow: `overflow:400`, `compact:200`, `compacted:200`. The compaction request kept all 11 tools.

## Review

### Policy posture: OK

- **Codex identity.** Nothing in `src/`, and nothing built into `dist/`, sends `originator`, `chatgpt-account-id`, a
  Codex client id or a User-Agent. The strings appear in `dist` only inside a comment of
  `runtime/boot/openai-adapter.js`.
- **The Codex client id `app_EMoamEEZ73f0CkXaXp7hrann`** occurs in the package once: a negative test
  (`test/unit/P-mock-responses.test.mjs:78`) asserts that the mock issuer refuses it, along with
  `originator=codex_cli_rs`. It also occurs in the already-committed research reports J and K. That is not
  "anywhere" in the strictest sense; see finding 5.
- **Refresh and ID tokens never reach the Worker** (my probe). Of 16 page → Worker messages (1 boot, 10 stdin,
  5 provider-token), every `provider-token` had exactly `{type, id, accessToken, expiresAt}`.
  - No refresh token (5 seen), no ID token and no `mock_rt_` substring appeared in either direction.
  - The boot env holds `ANTHROPIC_API_KEY=openai-adapter` and `ANTHROPIC_BASE_URL=https://openai-adapter.invalid`
    and no token.
  - The code agrees: `serveProviderTokens` builds the reply field by field.
- **No token is persisted without "remember".**
  - With "remember" off, localStorage holds only `cc-web:settings`, with no token material; sessionStorage holds
    the tokens. The OPFS `home.ccwfs` (5,054 bytes) holds no access, refresh or ID token.
  - Ticking "remember" puts the refresh token in localStorage; unticking it removes it.
  - e2e step 10 passed in every run.
- **The app name is honest.** `agent_name_hint=claude-code-web` is sent only with the first, dynamic registration.
- **Claude Code's identity is not spoofed.**
  - The harness keeps `--model claude-sonnet-5-5`, and no User-Agent is set.
  - The billing line is removed only from what goes to OpenAI; nothing goes to Anthropic in this mode.
  - The device id in `metadata.user_id` is not forwarded. Only the session id is, as `prompt_cache_key`.
- **The README** states the Plus/Pro requirement, the per-app weekly cap, the terms position, the unofficial status,
  and why the Codex CLI's login is not supported.

### Correctness risks

**SSE back-pressure: OK.**
- `replay()` is pull-based. When the consumer is idle, only 3 of 2,001 upstream chunks were pulled, and cancel
  stopped further reads.
- The ping timer enqueues without checking demand. That is negligible: one small event per 15 s of silence.

**Abort propagation in the adapter: OK.** Aborts were swept every 20 ms from 0 to 700 ms, then every 1 ms from
396 to 414 ms around the hand-over at ~404 ms.
- Before the hand-over, the fetch rejected with AbortError, usually within 1–4 ms (12 ms and 41 ms at two
  points right at the boundary).
- After it, the body errored with AbortError within 1–3 ms.
- The upstream socket closed every time.

In the browser (trace from the loops), the synthetic response reaches Claude Code ~410 ms after dispatch: the
lookahead waits for the first output event. The e2e's interrupt then lands 175–195 ms later. The one missed
interrupt (c3) is upstream of the adapter: Claude Code recorded the interruption but did not abort that request's
signal. It is not diagnosed.

**call_id maps across turns: OK.** Upstream `call_id` is used as the Anthropic `tool_use.id` (identity) and
mapped back. Long tool names round-trip through a per-request reverse map. One edge case produces input that
`/v1/responses` rejects (finding 3).

**Context-overflow mapping: OK.**
- `context_length_exceeded` becomes a 400 "prompt is too long: 300000 tokens > 272000 maximum" with
  `x-should-retry:false`, and the real 2.1.311 compacts on it.
- A usage limit becomes a 429 with `x-should-retry:false` and the reset time.
- `rate_limit_exceeded` "1.2s" becomes a 429 with `retry-after: 2`.
- A 503 becomes a 529 `overloaded_error`.

### Findings

1. **major: `src/host/harness.js` (interrupt path); root cause not located.** An interrupt is sometimes not applied
   to the in-flight model request. The stream runs to completion and the turn's result arrives about 20 s late.
   - Rate: 1 in 54 interrupts in ChatGPT mode here. H recorded 1 in 16 in Anthropic mode.
   - Not caused by the adapter (its abort path verified above).
   - In ChatGPT mode, a missed interrupt keeps spending plan usage until the response completes.
   - It made 1 of my 3 required ChatGPT e2e runs fail.
   - **Fix:** catch a failure under `--trace --interrupt-loops 50` (repeat until one fails). Compare when the
     SDK signal aborted with when `control_request interrupt` was answered. Check whether 2.1.311 swaps the turn's
     AbortController between the response arriving and the stream being consumed. In ChatGPT mode that
     hand-over comes ~400 ms after dispatch. Until then, do not claim step 9 is reliable.
2. **minor: `test/e2e.mjs`.** After step 9 times out, the e2e goes on without waiting for the pending `result`. Every
   later turn then reads the previous turn's result, and one flake fails steps 9, 11 and 13 (c3).
   **Fix:** when an interrupt step fails, wait for that turn's `result` (or restart the session) before the next
   step, and report the cascade as such.
3. **minor: `src/runtime/boot/openai/request.js`.** When the results of one assistant turn's parallel calls are
   split across two consecutive user messages, the first user message's `flushPending()` emits
   `function_call_output:"aborted"` for the unanswered call. The real output then follows: a duplicate output,
   which `/v1/responses` rejects. Synthetic check: `C C O(call_AAA:r0) O(call_BBB:aborted) O(call_BBB:r1)`.
   2.1.311 normally merges results into one message, so this is latent.
   **Fix:** emit the `"aborted"` outputs only when an assistant message (or the end of input) follows with calls
   still unanswered, not at the end of every user message.
4. **minor: `src/host/siwc.js`.**
   - The ID token's `nonce` is checked only when present. `iss`, `aud` (the issued client id) and `exp` are not
     checked; report K §4.8 suggests all four. The token is used only for the email and plan shown.
   - The token-endpoint fetch has no timeout and runs under the cross-tab Web Lock `cc-web:siwc-refresh`. A
     hanging issuer blocks refreshes in every tab, while the Worker gives up after 90 s.

   **Fix:** reject a missing nonce or a wrong `aud`/`iss` or an expired `exp`; give the token-endpoint POST an
   `AbortSignal.timeout`.
5. **minor: `test/unit/P-mock-responses.test.mjs`.** Line 78 contains the Codex CLI's client id
   `app_EMoamEEZ73f0CkXaXp7hrann` and `originator=codex_cli_rs`. It is only a negative test against the local mock,
   but the rule is "no Codex client id anywhere".
   **Fix:** use a made-up id (e.g. `app_not_registered`); the test still proves the mock refuses unknown clients
   and `originator`.

## Discrepancies with the integration report

- **"Passed 15/15 four times on the final tree": not fully reproduced.** I got 15/15 in c1, c2, cttl, cbase and
  both loop runs, but **12/15 in c3**. That is 1 of the 3 required runs, failing steps 9, 11 and 13 (finding 1,
  with finding 2 causing the cascade). The acceptance steps 0–6 and 12 passed in all runs.
- **"Anthropic-mode e2e 11/11": reproduced** (3/3, plus 30/30 interrupts in a loop run).
- **"npm test 339/339" and "build passes, 13 files in boot/": reproduced** (3/3 each).
- **Long-tail behaviour of the real 2.1.311 binary: reproduced** in every run without the interrupt cascade.
  This covers the usage limit not retried, the rate limit retried once after ~2.2 s, a mid-stream failure resumed
  with the partial text kept, and overflow compacting.
- **"Step 12 checked all 26 requests": reproduced** (26 in c1, c2 and cttl). My analyzer found the same shapes, and
  the translator on the real captured bodies agrees.
- **Not independently re-derived:** the "no P/W interface mismatch" history. The tests on the combined tree pass;
  that is all I can say.
