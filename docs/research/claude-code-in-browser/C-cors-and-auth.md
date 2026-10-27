# C — CORS & auth feasibility: browser-hosted Claude Code on `https://kumavis.github.io`

Probed on 2026-10-27, using fake credentials only. **VERIFIED** means I ran it myself or read the primary source (Anthropic docs, the published SDK and CLI packages). **INFERRED** means reasoning or secondary sources.

## TL;DR

| Endpoint class | Browser-direct from `kumavis.github.io`? | Verdict |
|---|---|---|
| **Inference**: `POST /v1/messages`, `/v1/messages/count_tokens` (api.anthropic.com) | **Yes, if the request carries `anthropic-dangerous-direct-browser-access: true`.** Preflight returns 200 with `ACAO: *` and echoes every requested header. Real responses, 401s included, carry `ACAO: *` and `ACEH: *`. Claude Code v2.1.311 **already sends this header**, because its bundled SDK is built with `dangerouslyAllowBrowser: !0`. | **Not a CORS blocker** (VERIFIED in a real Chromium from the genuine origin). Open question that only a real token can answer: whether the server's "Claude Code only" OAuth gate accepts a browser request, which carries the browser's User-Agent plus `Origin` and `Referer`. |
| **Management `/v1` GETs**: `/v1/models`, `/v1/files`, `/v1/messages/batches` | The preflight passes, but a 401 for an invalid credential has **no ACAO**, so the browser can't read it. Success responses are untested. | Minor. Claude Code calls `/v1/models` only for gateway model discovery. |
| **`/api/*` on api.anthropic.com**: `oauth/profile`, `oauth/usage`, `oauth/claude_cli/*`, `claude_cli_feature_flags`, `event_logging/*`, `eval/*` (GrowthBook), `hello`, `claude_code/*`, … | **No.** These sit behind an origin allowlist. Preflight returns `400 Disallowed CORS origin` for any origin other than `claude.ai`, `console.anthropic.com` or `platform.claude.com`, and the dangerous header doesn't help. | **Blocked.** It only matters if Claude Code treats these calls as fatal (that's the internals agent's question). Most are telemetry, flags or account metadata. |
| **OAuth token endpoint**: `POST platform.claude.com/v1/oauth/token` (current CLI), `console.anthropic.com/v1/oauth/token` (legacy), `api.anthropic.com/v1/oauth/token` | **No.** Allowlist is `console.anthropic.com` and `platform.claude.com` only, not even `claude.ai`. Responses carry no ACAO. A form-urlencoded "simple request" skips preflight and **is processed server-side**, but JS can't read the response. | **Hard blocker** for in-browser `/login` (code exchange) and token refresh. |
| **OAuth authorize page**: `claude.com/cai/oauth/authorize` → `claude.ai/oauth/authorize`; `platform.claude.com/oauth/authorize` | Top-level navigation, so CORS doesn't apply. `X-Frame-Options: SAMEORIGIN` and `frame-ancestors 'self'` mean **no iframe**. A popup or new tab works. | Fine as a popup. It doesn't help, because the code exchange behind it is blocked. |
| **Telemetry**: `statsig.anthropic.com/*`, `api.anthropic.com/api/event_logging/*`, Datadog intake | `statsig.anthropic.com` is **NXDOMAIN** (dead host). `event_logging` fails the allowlist. The Datadog preflight returns 403. | **Irrelevant.** Disable with `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` / `DISABLE_TELEMETRY=1`. |

**Bottom line: CORS doesn't block inference. It does block the OAuth login/refresh flow and the `/api/*` side-channel calls.**

The proxy-free path:

1. The user runs `claude setup-token` on a real machine.
2. They paste the resulting one-year, inference-only `sk-ant-oat01-…` token into the web app.
3. The app runs Claude Code with `CLAUDE_CODE_OAUTH_TOKEN=<token>` and `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1`.

Only `/v1/messages` and `count_tokens` then need to succeed, and both pass CORS. Everything else needs a per-user proxy, a Wisp/WebSocket TLS relay, or an extension.

---

## 0. Environment notes (affect how the raw results read)

- `api.anthropic.com` is in the sandbox's `NO_PROXY`, so those probes went **direct** and the responses are unaltered. Every other host (`platform.claude.com`, `console.anthropic.com`, `claude.ai`, `claude.com`, `statsig.anthropic.com`, Datadog, `kumavis.github.io`) went through the egress proxy, which re-terminates TLS.
- **429 on `platform.claude.com` / `console.anthropic.com` `/v1/oauth/token`** happens on every request, with or without `Origin`, so it's an IP-level rate limit on the shared egress IP rather than a CORS effect. The same request sent directly to `api.anthropic.com/v1/oauth/token` returns the real `invalid_grant` error. INFERRED: rate limiting on shared egress IPs (Cloudflare Workers included) could also hit a proxy doing token exchange.
- `statsig.anthropic.com`: the proxy returned 502 on CONNECT, and public DNS (dns.google) answers **NXDOMAIN**, so the host no longer exists. That's an upstream failure, not a policy block. The current CLI binary contains no `statsig.anthropic.com` string.
- The probe scripts are in this folder: `probe.sh`, `browser-cors-test.mjs`, `worker.js`, `worker-node-adapter.mjs`, `browser-worker-test.mjs`. Raw headers and bodies are in `probes/`.

## 1. How api.anthropic.com decides CORS (VERIFIED by probing)

The CORS layer is **path-prefix based**:

1. **`/v1/*` inference routes** allow any origin, but only on opt-in:
   - The preflight succeeds (`200`, `ACAO: *`) **only if** `Access-Control-Request-Headers` contains `anthropic-dangerous-direct-browser-access`.
   - Without it, the preflight returns `400 Disallowed CORS origin`. That held even for `Origin: https://claude.ai`.
   - When it passes, `Access-Control-Allow-Headers` echoes **whatever was requested**, including `x-stainless-*`, `x-claude-code-session-id`, `x-app`, `user-agent` and made-up names, so Claude Code's extra headers are fine.
   - Methods: `DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT`. `max-age` is 600.
   - Real responses with the header present carry `access-control-allow-origin: *`, `access-control-expose-headers: *`, and `vary: Origin, Access-Control-Request-Headers, anthropic-dangerous-direct-browser-access`. Real responses without the header carry no ACAO.
   - The header's value isn't checked: `false` also produced ACAO.
2. **`/api/*` and `/v1/oauth/token`** use an exact-origin allowlist:
   - `claude.ai`, `console.anthropic.com` and `platform.claude.com` get `ACAO: <origin>`.
   - `kumavis.github.io`, `http://localhost:3000` and `null` get `400 Disallowed CORS origin`.
   - Made-up paths behave the same: `/api/does-not-exist` returns 400.
   - `/api/hello` is an oddity: its preflight returns 200 but has no ACAO, so it still fails in a browser.
3. **Management `/v1` GETs** (`/v1/models`, `/v1/models/{id}`, `/v1/files`, `/v1/messages/batches`, `/v1/organizations/me`):
   - The preflight passes with the dangerous header.
   - The **401 for an invalid credential carries no ACAO**, so a browser sees an opaque `TypeError`.
   - A 401 for a **missing** credential (`x-api-key header is required`) *does* carry ACAO, so the CORS headers are added only on some error paths.
   - `/v1/complete` and `count_tokens` behave like `/v1/messages`, adding ACAO on the 401.
   - INFERRED: a 200 with valid credentials probably carries ACAO, but I couldn't test that.
4. **`access-control-allow-credentials: true` is paired with `ACAO: *`.** Browsers reject that pair for credentialed requests, so a runtime must use `credentials: 'omit'` or `'same-origin'`. The `fetch` default is fine; `credentials: 'include'` would fail. VERIFIED that the headers are as described; INFERRED how a given runtime behaves.
5. **The server doesn't block based on Origin. It only withholds ACAO.** A disallowed-origin `POST /api/event_logging/batch` still returned `200 {"accepted_count":0,…}`, and a form-urlencoded `POST /v1/oauth/token` was processed (`invalid_grant`).

### Footgun

A browser *can* fire a token **refresh** as a CORS "simple request" (`application/x-www-form-urlencoded`, no custom headers). No preflight is needed and the server processes it. The page can't read the response, so if refresh tokens rotate, the old refresh token is burned and the new one is lost. VERIFIED that the request is processed and the response is unreadable. INFERRED that refresh tokens rotate.

## 2. Raw probe tables

### 2a. curl preflights (`OPTIONS`, `Origin: https://kumavis.github.io`)

These used `Access-Control-Request-Method: POST` (or `GET`) and `Access-Control-Request-Headers: authorization,anthropic-beta,anthropic-version,content-type,anthropic-dangerous-direct-browser-access,x-api-key,x-app,user-agent`, unless a row says otherwise.

Every `api.anthropic.com` response also carried `access-control-allow-methods: DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT`, `access-control-max-age: 600`, `access-control-allow-credentials: true`, and `access-control-allow-headers: <echo of the request>`. That held even on the 400s. Without ACAO, those headers are useless.

| Probe | Status | ACAO | Body | Notes |
|---|---|---|---|---|
| `/v1/messages` | **200** | `*` | `OK` | `vary: Origin, Access-Control-Request-Headers` |
| `/v1/messages`, request headers **without** `anthropic-dangerous-direct-browser-access` (any subset tried, including `content-type` alone or none) | 400 | – | `Disallowed CORS origin` | Same result with `Origin: https://claude.ai` |
| `/v1/messages`, request headers = only `anthropic-dangerous-direct-browser-access` | 200 | `*` | `OK` | |
| `/v1/messages`, full Claude Code header set (17 headers incl. `x-stainless-*`, `x-claude-code-session-id`, `anthropic-client-platform`) | 200 | `*` | `OK` | Arbitrary headers are echoed |
| `/v1/messages/count_tokens` | **200** | `*` | `OK` | `content-security-policy: default-src 'none'; frame-ancestors 'none'` |
| `/v1/models` (GET) | **200** | `*` | `OK` | |
| `/v1/count_tokens` and `/v1/models` without the dangerous header | 400 | – | | |
| `/v1/does-not-exist` | 404 | – | | |
| `/api/oauth/profile` (GET) | **400** | – | `Disallowed CORS origin` | 200 + `ACAO: https://claude.ai` / `console.anthropic.com` / `platform.claude.com` for those origins |
| `/api/oauth/claude_cli/create_api_key` | 400 | – | `Disallowed CORS origin` | |
| `/api/claude_cli_feature_flags` (GET) | 400 | – | `Disallowed CORS origin` | The path exists (401 on GET) |
| `/api/event_logging/batch` | 400 | – | `Disallowed CORS origin` | |
| `/api/event_logging/v2/batch` (current CLI) | 400 | – | `Disallowed CORS origin` | |
| `/api/eval/sdk-abc` (GrowthBook) | 400 | – | `Disallowed CORS origin` | |
| `/api/oauth/claude_cli/roles`, `/api/claude_code/settings`, `/api/does-not-exist` | 400 | – | | |
| `/api/oauth/usage` | 429 | – | rate-limit JSON | 429 even on the preflight |
| `/api/hello` | 200 | **–** | `{"message":"hello"}` | No ACAO, so it fails in a browser |
| `api.anthropic.com/v1/oauth/token` | 400 | – | `Disallowed CORS origin` | 200 + ACAO for `platform.claude.com` origin |
| `console.anthropic.com/v1/oauth/token` (req hdrs `content-type`) | 400 | – | `Disallowed CORS origin` | Allowlist: `console.anthropic.com`, `platform.claude.com`; **not** `claude.ai` |
| `console.anthropic.com/v1/oauth/token` (full hdr list incl. the dangerous header) | 400 | – | `Disallowed CORS origin` | The dangerous header doesn't help |
| `platform.claude.com/v1/oauth/token` (both variants) | 400 | – | `Disallowed CORS origin` | Same allowlist |
| `statsig.anthropic.com/v1/initialize`, `/v1/rgstr` | proxy 502 | – | | NXDOMAIN in public DNS |
| `http-intake.logs.us5.datadoghq.com/api/v2/logs` (req hdr `dd-api-key`) | 403 | – | `API key is missing or invalid` | |

### 2b. curl actual requests (`Origin: https://kumavis.github.io`, fake auth)

"DD" means the request carried `anthropic-dangerous-direct-browser-access: true`. The OAuth variant used `Authorization: Bearer sk-ant-oat01-FAKE…` plus `anthropic-beta: oauth-2025-04-20`. The key variant used `x-api-key: sk-ant-api03-FAKE…`.

| Probe | Status | ACAO on response | ACEH | Body (trimmed) |
|---|---|---|---|---|
| `POST /v1/messages` key + DD | 401 | `*` | `*` | `{"type":"error","error":{"type":"authentication_error","message":"invalid x-api-key"},…}` |
| `POST /v1/messages` key, no DD | 401 | **–** | – | `invalid x-api-key` |
| `POST /v1/messages` OAuth + DD | 401 | `*` | `*` | `{"type":"error","error":{"type":"authentication_error","message":"OAuth access token is invalid."},…}` |
| `POST /v1/messages` OAuth, no DD | 401 | **–** | – | `OAuth access token is invalid.` |
| `POST /v1/messages` Bearer `oat01` **without** oauth beta + DD | 401 | `*` | `*` | `OAuth access token is invalid.` (the server recognises the `oat01` prefix) |
| `POST /v1/messages` no auth + DD | 401 | `*` | `*` | `x-api-key header is required` |
| `POST /v1/messages` key + DD value `false` | 401 | `*` | | |
| `POST /v1/complete` key + DD | 401 | `*` | | `invalid x-api-key` |
| `POST /v1/messages/count_tokens` OAuth + DD | 401 | `*` | `*` | `OAuth access token is invalid.` |
| `POST /v1/messages/count_tokens` OAuth, no DD | 401 | – | – | same |
| `GET /v1/models` OAuth + DD / key + DD / OAuth no DD | 401 | **– (all three)** | – | `OAuth access token is invalid.` / `invalid x-api-key` |
| `GET /v1/models` no auth + DD | 401 | `*` | | `x-api-key header is required` |
| `GET /v1/models/{id}`, `/v1/files`, `/v1/messages/batches`, `POST /v1/messages/batches`, `GET /v1/organizations/me` with fake auth + DD | 401 | – | | (4× repeat, consistent) |
| `GET /api/oauth/profile` OAuth ± DD | 401 | – | | `OAuth access token is invalid.` |
| `POST /api/oauth/claude_cli/create_api_key` OAuth + DD | 401 | – | | same |
| `GET /api/claude_cli_feature_flags` OAuth + DD | 401 | – | | same |
| `POST /api/event_logging/batch` ± auth | **200** | – | | `{"accepted_count":0,"rejected_count":0}` (processed despite the disallowed origin) |
| `GET /api/hello` | 200 | – | | `{"message": "hello"}` |
| `GET /api/oauth/usage` | 429 | – | | rate-limit |
| `POST api.anthropic.com/v1/oauth/token` JSON refresh | 400 | – | | `{"error": "invalid_grant", "error_description": "Refresh token not found or invalid"}` |
| same, `application/x-www-form-urlencoded` (simple request) | 400 | – | | same: **processed** |
| same, `text/plain` | 415 | – | | `Unsupported media type. Use application/json or application/x-www-form-urlencoded` |
| same, `authorization_code` grant | 400 | – | | `{"error": "invalid_grant", "error_description": "Invalid 'code' in request."}` |
| `POST platform.claude.com/v1/oauth/token` (JSON refresh / JSON code / form) | 429 | – | | `Rate limited. Please try again later.` (also 429 with `Origin: https://claude.ai` and with no Origin, so egress IP) |
| `POST console.anthropic.com/v1/oauth/token` (same 3) | 429 | – | | same; `x-frame-options: SAMEORIGIN` |
| `GET claude.com/cai/oauth/authorize?…` (CLI's claude.ai authorize URL) | 307 → `claude.ai/oauth/authorize?…` | – | | `x-frame-options: SAMEORIGIN`, `cross-origin-opener-policy: same-origin-allow-popups` |
| `GET claude.ai/oauth/authorize?…` | 403 (Cloudflare "Just a moment…" bot challenge for curl) | – | | `x-frame-options: SAMEORIGIN`, `COOP: same-origin`, `COEP: require-corp`, `CORP: same-origin` |
| `GET console.anthropic.com/oauth/authorize?…` | 301 → `platform.claude.com/oauth/authorize?…` | | | |
| `GET platform.claude.com/oauth/authorize?…` | 200 | | | `x-frame-options: SAMEORIGIN`, CSP `frame-ancestors 'self'`, `COOP: same-origin-allow-popups` |
| `GET console.anthropic.com/oauth/code/callback` | 301 → `platform.claude.com/oauth/code/callback` | | | |
| `GET platform.claude.com/oauth/code/callback?code=x` | 200 | | | `x-frame-options: SAMEORIGIN`, `frame-ancestors 'self'` |

**Exact missing-header error.** I couldn't reproduce it with fake credentials, because authentication is checked first: the no-DD requests above return the auth error, not the CORS error. Community reports quote it as `401 "CORS requests must set 'anthropic-dangerous-direct-browser-access' header"` ([page-assist #511](https://github.com/n4ze3m/page-assist/issues/511), [NextChat #5429](https://github.com/ChatGPTNextWeb/NextChat/issues/5429)). With a valid credential, a browser couldn't even read that 401, because the no-DD response has no ACAO.

### 2c. Real browser: headless Chromium 153, page = the genuine `https://kumavis.github.io/vibe-dump/` (VERIFIED)

`fetch()` ran inside the page; `location.origin === "https://kumavis.github.io"`. Results are in `probes/browser-cors-test.out`.

| fetch | Result |
|---|---|
| `POST /v1/messages?beta=true` OAuth + DD | **READABLE** 401 `ACAO=*` `OAuth access token is invalid.` |
| same, + `x-app: cli`, `user-agent: claude-cli/…`, `x-stainless-*` | **READABLE** 401 |
| `POST /v1/messages` OAuth, no DD | BLOCKED `TypeError: Failed to fetch` |
| `POST /v1/messages` api-key + DD | **READABLE** 401 `invalid x-api-key` |
| `POST /v1/messages` api-key, no DD | BLOCKED |
| `POST /v1/messages/count_tokens` OAuth + DD | **READABLE** 401 |
| `GET /v1/models` OAuth + DD | BLOCKED (no ACAO on the 401) |
| `GET /api/oauth/profile`, `/api/oauth/usage`, `POST /api/oauth/claude_cli/create_api_key`, `GET /api/claude_cli_feature_flags`, `POST /api/event_logging/batch`, `GET /api/hello` | BLOCKED (all) |
| `POST platform.claude.com/v1/oauth/token` JSON | BLOCKED |
| `POST api.anthropic.com/v1/oauth/token` form-urlencoded (simple request, no preflight) | BLOCKED (sent, but unreadable) |

**Wire headers Chromium actually sent** for the "+CLI headers" case:

- `authorization`, `anthropic-beta`, `anthropic-dangerous-direct-browser-access`, `anthropic-version`, `x-app`, `x-stainless-*` and `content-type` went through unchanged.
- **`user-agent` was silently replaced** with `Mozilla/5.0 … HeadlessChrome/153…`. Chromium ignores a JS-set UA.
- The browser added `referer: https://kumavis.github.io/`, the `sec-ch-ua*` client hints, and (not shown by Playwright) `Origin` and `Sec-Fetch-*`.

INFERRED: Firefox now honours a JS-set `User-Agent` per the Fetch spec; Chromium doesn't.

## 3. What Claude Code itself does (static inspection of `@anthropic-ai/claude-code-linux-x64@2.1.311`; strings only, nothing executed)

Only the CORS-relevant facts are below; the internals agent owns the rest.

- **The CLI already opts into browser CORS.** Its Anthropic client is built with `{defaultHeaders:…, maxRetries:…, timeout:…, dangerouslyAllowBrowser:!0, fetchOptions:…}`, and the bundled SDK then adds `"anthropic-dangerous-direct-browser-access":"true"`. Every inference request from the terminal CLI therefore already carries the header together with the OAuth bearer. VERIFIED (binary string). [A third-party traffic capture of v2.1.77](https://gist.github.com/troykelly/6fdb3845d3c53a39469c338c125dfff6) shows the same header on the wire.
  - **Consequence:** CORS for `/v1/messages` needs no patching.
  - **Consequence:** "OAuth bearer + dangerous header" is what every Claude Code user sends today, so the server accepts that combination.
  - INFERRED: if the bundled SDK's own `isRunningInBrowser()` check fires inside a browser runtime, the flag also stops it from throwing.
- **OAuth endpoints (prod config):**
  - `TOKEN_URL: "https://platform.claude.com/v1/oauth/token"`
  - `CLAUDE_AI_AUTHORIZE_URL: "https://claude.com/cai/oauth/authorize"`
  - `CONSOLE_AUTHORIZE_URL: "https://platform.claude.com/oauth/authorize"`
  - `MANUAL_REDIRECT_URL: "https://platform.claude.com/oauth/code/callback"`
  - `BASE_API_URL: "https://api.anthropic.com"`
  - `CLIENT_ID: "9d1c250a-e61b-44d9-88ed-5944d1962f5e"`
  - Local redirect: `http://localhost:${port}/callback`
  - Beta: `oauth-2025-04-20`
- **`CLAUDE_CODE_CUSTOM_OAUTH_URL` is allowlisted** to `https://beacon.claude-ai.staging.ant.dev`, `https://claude.fedstart.com` and `https://claude-staging.fedstart.com`. Anything else throws `CLAUDE_CODE_CUSTOM_OAUTH_URL is not an approved endpoint.`, so **the token and `/api` base can't be pointed at a CORS proxy through env vars.** VERIFIED.
- **`/api/*` URL construction is mixed.**
  - Built from the fixed `BASE_API_URL`, ignoring `ANTHROPIC_BASE_URL`: `jb()` → `${on().BASE_API_URL}/api/oauth/profile`, the `/api/hello` preflight checks, and `/api/claude_code/organizations/metrics_enabled`.
  - Built from `ANTHROPIC_BASE_URL || BASE_API_URL`: some others, such as bootstrap and the environment endpoints.
  - So **`ANTHROPIC_BASE_URL` → proxy rescues inference but not all `/api/*` calls.** VERIFIED (string inspection). Which of those calls are fatal is INFERRED or out of scope.
- **`claude setup-token`** starts the OAuth flow with `{loginWithClaudeAi:true, inferenceOnly:true, expiresIn:<1y>}`. VERIFIED (binary). The docs say the same (§4).
- **A credential guard** (`hxe`) withholds `x-api-key` / `Authorization` from telemetry endpoints whose host doesn't match the first-party host (`"credential withheld: this telemetry endpoint is not the host it belongs to"`). It applies to telemetry only, not inference.
- **`ANTHROPIC_CUSTOM_HEADERS` exists** (51 references) and is documented, so a header such as `anthropic-dangerous-direct-browser-access` could be added without patching if it were ever needed.

## 4. Documentary findings

### Anthropic's position on browser-direct access

- **SDK README** (`@anthropic-ai/sdk@1.3.0`, npm tarball, VERIFIED): *"Web browsers: disabled by default to avoid exposing your secret API credentials … Enable browser support by explicitly setting `dangerouslyAllowBrowser` to `true`."*
- **SDK source** (VERIFIED): `buildHeaders` adds `'anthropic-dangerous-direct-browser-access': 'true'` purely on `this._options.dangerouslyAllowBrowser`, **independent of `apiKey` vs `authToken` (Bearer)**. Nothing in the SDK ties the flag to API keys only.
- **Launch history**: [Simon Willison, 2024-08-23](https://simonwillison.net/2024/Aug/23/anthropic-dangerous-direct-browser-access/). Anthropic "enabled CORS support for their JSON APIs" behind this header.
- **I found no official doc that mentions OAuth bearer tokens with the dangerous header**, either to bless or to forbid the combination. The empirical answer (CORS layer) is that the server treats Bearer and `x-api-key` identically for CORS (§2b, §2c). The CLI sends exactly this combination in production (§3).
- **Server-side "Claude Code only" gating of subscription tokens** is a separate concern from CORS:
  - It is reported as `"This credential is only authorized for use with Claude Code and cannot be used for other API requests."` ([claude-code #11252](https://claudeissues.com/issue/11252-bug-authentication-error-credentials-restricted-to-claude-code), [OpenCode error page](https://www.developersdigest.tech/errors/opencode/claude-code-credential-only)).
  - Feb 2026 reports say third-party use returned `"OAuth authentication is currently not supported."` ([#28089](https://claudeissues.com/issue/28089-bug-anthropic-disabled-oauth-tokens-for-third-party-apps)).
  - [One investigation](https://chris-chabot-blog.pages.dev/blog/claude-oauth-detective-story) found the system prompt was the discriminator (INFERRED, unofficial).
  - [Lively4](https://lively-kernel.org/lively4/aexpr/demos/claude/claude-auth.md), a browser IDE, documents that its direct `/v1/messages` call with these tokens "DOES NOT WORK" but doesn't say why.
  - **Risk for this project** (INFERRED, needs a real token to test): the unmodified CLI sends the right system prompt and beta headers, but from a browser the request carries a browser User-Agent instead of `claude-cli/… (external, cli)` (VERIFIED that Chromium drops it), plus `Origin`, `Referer` and `Sec-Fetch-*`. If the gate checks UA or Origin, browser-direct inference fails with a readable 401/403 even though CORS passes. A proxy (§5a) or a Wisp relay (§5c) can send the original UA.

### Policy: Claude Code [Legal and compliance](https://code.claude.com/docs/en/legal-and-compliance) (VERIFIED primary)

- *"OAuth authentication is intended exclusively for purchasers of Claude Free, Pro, Max, Team, and Enterprise subscription plans and is designed to support ordinary use of Claude Code and other native Anthropic applications."*
- *"Anthropic does not permit third-party developers to offer Claude.ai login into their own applications, or to route requests through Free, Pro, or Max plan credentials on behalf of their users. Moreover, developers may not collect, store, or intermediate Claude.ai credentials or session tokens — sign-in to a Claude account must complete through Anthropic's own flow."*
- *"Nor does it prevent an end user from signing in to the unmodified Claude Code binary with their own Claude subscription, including where a platform hosts Claude Code…"*. Hosting also requires *"The Claude Code binary must not be modified."*

INFERRED implications:
- A per-user proxy the user deploys on their own account, carrying their own token, is the user's own infrastructure.
- **A shared proxy run by the app author** that sees users' tokens is "intermediating" and should be avoided.
- The app should never store tokens server-side.
- The in-browser `/login` would complete on Anthropic's pages, with only the code exchange proxied.

### OAuth token endpoint and redirect URIs

- **CORS:** I found no public doc or community report showing that `/v1/oauth/token` sends CORS headers for third-party origins. Every community Claude OAuth client I found runs in Node, Rust or Go, or behind a local proxy ([CLIProxyAPI](https://mintlify.com/router-for-me/CLIProxyAPI/oauth/claude), [auth2api](https://www.sourcepulse.org/projects/27747255), [rogs.me](https://rogs.me/2026/02/use-your-claude-max-subscription-as-an-api-with-cliproxyapi/)). The probes settle it: the allowlist is `console.anthropic.com` and `platform.claude.com` only (VERIFIED).
- **Redirect URIs** registered for the CLI client ID (VERIFIED from binary and docs):
  - **`http://localhost:<port>/callback`**: a static Pages app can't listen on a port.
  - **`https://platform.claude.com/oauth/code/callback`** ("manual" mode): the page shows a code the user pastes back. The [authentication docs](https://code.claude.com/docs/en/authentication.md) say: *"If your browser shows a login code instead of redirecting back … paste it into the terminal."*
  - The web app *could* open the authorize URL in a popup and ask the user to paste the code. **The code→token exchange is still a CORS-blocked POST**, so this only works through a proxy.
  - `https://kumavis.github.io/...` isn't a registered redirect for this client ID (INFERRED; I didn't test it, because that needs a real login).
- **Iframing:** both authorize hosts send `X-Frame-Options: SAMEORIGIN`. platform.claude.com also sends `frame-ancestors 'self'`. claude.ai sends `COOP: same-origin`, which severs `window.opener`. claude.com and platform.claude.com send `same-origin-allow-popups`. Use a popup or new tab with manual paste; an iframe or `postMessage` handshake won't work.

### `claude setup-token` / `CLAUDE_CODE_OAUTH_TOKEN` ([authentication docs](https://code.claude.com/docs/en/authentication.md), [env-vars](https://code.claude.com/docs/en/env-vars), VERIFIED primary)

- *"generate a one-year OAuth token with `claude setup-token` … It does not save the token anywhere; copy it and set it as the `CLAUDE_CODE_OAUTH_TOKEN` environment variable"*
- *"This token authenticates with your Claude subscription and requires a Pro, Max, Team, or Enterprise plan. It can only make model requests, so it can't establish Remote Control sessions or fetch claude.ai connectors."*
- Precedence: `CLAUDE_CODE_OAUTH_TOKEN` is #5, above Anthropic profiles and above `/login` credentials.
- *"Unless you run `/login`, Claude Code uses the token you set for the whole session. To replace an expired token, generate a new one and restart"*, so **no refresh call is ever made**.
- *"Bare mode does not read `CLAUDE_CODE_OAUTH_TOKEN`."*

**Does it sidestep OAuth-in-browser? Yes (INFERRED from the facts above).**
- Minting happens on the user's laptop through Anthropic's own flow, which is policy-clean.
- The browser never calls `/v1/oauth/token`: there's no code exchange and no refresh.
- The token is an `sk-ant-oat01-…` bearer, sent as `Authorization: Bearer` plus `anthropic-beta: oauth-2025-04-20` to the same `/v1/messages?beta=true`. The server identifies it by its prefix (§2b).
- Because it's inference-only, `/api/oauth/profile` and similar calls would fail on scope anyway, with or without CORS, and the CLI is evidently built to run that way (CI use case).
- **This is the only fully proxy-free path.**

Caveats:
- Community reports of intermittent `401 Invalid bearer token` with setup-tokens ([e.g.](https://claudeissues.com/issue/40860-setup-token-generates-invalid-bearer-token-401-invalid-bearer-token)).
- A pasted token lives in the browser (localStorage or IndexedDB). It's a one-year credential that should be scoped to the user's own device; it must never be sent to a server the user doesn't control.

### `ANTHROPIC_BASE_URL` with OAuth ([LLM gateway](https://code.claude.com/docs/en/llm-gateway.md), [gateway protocol](https://code.claude.com/docs/en/llm-gateway-protocol.md), VERIFIED primary)

- *"Setting only that variable, without a gateway credential, doesn't replace the subscription. Requests still route through the gateway, but a saved claude.ai login remains the active credential … Gateways that pass this traffic on to Anthropic must forward the OAuth capability in `anthropic-beta`"*. **Claude Code does honour `ANTHROPIC_BASE_URL` with OAuth auth and sends the bearer to the proxy.**
- `anthropic-beta`: *"stripping it fails those requests with `401`"*. Forward `anthropic-*` verbatim, return `text/event-stream` unbuffered, and forward `x-should-retry` and `anthropic-ratelimit-unified-*`.
- Inference posts to `/v1/messages?beta=true`; `count_tokens` is optional.
- The gateway receives a `HEAD /api/hello` warm-up.
- *"The fast mode availability check … calls `api.anthropic.com` directly rather than following `ANTHROPIC_BASE_URL` … The WebFetch domain safety check also calls `api.anthropic.com` directly."* These calls miss the proxy and fail CORS in a browser. `CLAUDE_CODE_SKIP_FAST_MODE_NETWORK_ERRORS=1` exists for the first.
- `ANTHROPIC_BASE_URL` set to a non-api.anthropic.com host disables Remote Control (v2.1.196+).
- Telemetry and flags are disabled by `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` (*"auto-updates, telemetry, error reporting, … Also disables feature-flag fetching"*), `DISABLE_TELEMETRY`, `DISABLE_ERROR_REPORTING`, `DISABLE_GROWTHBOOK` and `DISABLE_AUTOUPDATER`.

## 5. Fallbacks

**Note:** GitHub Pages serves static files only. It can't run server code, set response headers for other hosts, or proxy, so any proxy lives elsewhere.

### 5a. Per-user CORS proxy (Cloudflare Worker): VERIFIED working (logic run under Node + real Chromium)

```js
// Personal CORS proxy. Deploy on YOUR OWN Cloudflare account; never share it.
const ALLOWED_ORIGIN = 'https://kumavis.github.io';
const UPSTREAM = { '/v1/oauth/token': 'https://platform.claude.com' }; // else api.anthropic.com
export default {
  async fetch(req) {
    const origin = req.headers.get('origin');
    if (origin !== ALLOWED_ORIGIN) return new Response('origin not allowed', { status: 403 });
    const cors = {
      'access-control-allow-origin': origin,
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': req.headers.get('access-control-request-headers') ?? '',
      'access-control-expose-headers': '*',
      'access-control-max-age': '86400',
      vary: 'Origin',
    };
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    const url = new URL(req.url);
    const target = (UPSTREAM[url.pathname] ?? 'https://api.anthropic.com') + url.pathname + url.search;
    const headers = new Headers(req.headers);
    for (const h of [...headers.keys()])
      if (/^(origin|referer|cookie|host|cf-|x-forwarded-|x-real-ip)/i.test(h)) headers.delete(h);
    const res = await fetch(target, { method: req.method, headers, redirect: 'manual',
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.arrayBuffer() });
    const out = new Headers(res.headers);
    for (const [k, v] of Object.entries(cors)) out.set(k, v);
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: out }); // streams SSE
  },
};
```

**Test** (`worker.js` + `worker-node-adapter.mjs`, then `browser-worker-test.mjs` from the real `kumavis.github.io` page; `probes/browser-worker-test.out`):

- Every class came back **READABLE**:
  - `/v1/messages?beta=true` (with `stream:true`, and *without* the DD header): 401
  - `/v1/models`: 401
  - `/api/oauth/profile`: 401
  - `/api/event_logging/batch`: 200
  - `/v1/oauth/token` → `platform.claude.com`: 429 from this IP, but readable
- `request-id` was readable via `expose-headers: *`.
- curl checks:
  - Preflight returns 204 with exact-origin ACAO.
  - A wrong origin returns 403.
- **Not verified:** deployment on the real Workers runtime, and a successful SSE stream (needs a real token).
- **Caveat:** the Node adapter had to drop `content-encoding`, because Node's fetch decompresses and doesn't re-encode. Workers re-encodes automatically (INFERRED from Workers semantics).

**Wiring.** Set `ANTHROPIC_BASE_URL=https://<worker>.workers.dev`; that's documented to keep the OAuth credential (§4). Calls built on the fixed `BASE_API_URL` (`/api/oauth/profile`, `/api/hello`, metrics check, fast-mode check, WebFetch safety check) and the token URL still target the real hosts, and `CLAUDE_CODE_CUSTOM_OAUTH_URL` can't be redirected. To catch them, **rewrite hosts in the browser runtime's network shim** instead: map `api.anthropic.com` and `platform.claude.com` to the Worker origin, and let the Worker route by path as above. That needs no change to the CLI binary (INFERRED).

**Security:**
- The user's bearer token passes through the Worker in cleartext at the TLS-terminating edge. Each user must deploy their own; the app author must not run a shared one (policy, §4).
- The `Origin` check stops other *websites* from using the Worker. It doesn't stop scripts, which can spoof `Origin`. The Worker holds no secrets, so the abuse risk is quota or anonymised relaying. Add a random path prefix or a shared secret header if that matters.
- Log nothing.
- Pin `UPSTREAM` hosts. Never take the target from the request, or it becomes an open proxy.
- The Worker also strips `Origin`, `Referer` and `cf-*`, so upstream sees a server-to-server call. It could set `user-agent` to the CLI's value if the "Claude Code only" gate turns out to check it (INFERRED).
- Shared Workers egress IPs may hit the same 429s seen here on the token endpoint (INFERRED).

### 5b. Browser extension

- **declarativeNetRequest `modifyHeaders` on `responseHeaders`** can add `Access-Control-Allow-Origin` for `initiatorDomains: ["kumavis.github.io"]` ([example thread](https://groups.google.com/a/chromium.org/g/chromium-extensions/c/Iu0UpiYb8Fk)).
- **Limit:** the `/api/*` and token-endpoint **preflights return HTTP 400**, and CORS requires an OK status. DNR can modify headers but can't change status codes (INFERRED from the DNR action set; [related report](https://groups.google.com/a/chromium.org/g/chromium-extensions/c/5LBF68AGo4k)). So DNR alone likely fixes the `/v1/models` error-ACAO gap, but **not** `/api/*` or `/v1/oauth/token`.
- **More robust:** an MV3 extension whose background service worker has `host_permissions` for `api.anthropic.com` and `platform.claude.com` and makes the requests itself. Extension-origin fetches with host permissions aren't CORS-restricted (INFERRED; standard Chrome extension behaviour). The page reaches it via `externally_connectable` + `runtime.connect`, and streams SSE chunks over the Port.
- **Downsides:** users must install it, it's Chrome or Firefox only, and streaming over a Port is clunky. The token stays on-device (better than 5a).

### 5c. WebSocket TCP relay with in-browser TLS (Wisp + libcurl.js / epoxy-tls)

- [libcurl.js](https://cdn.jsdelivr.net/npm/libcurl.js@0.7.5/README.md) runs curl and mbedTLS in WASM and tunnels raw TCP over a WebSocket to a [Wisp](https://github.com/MercuryWorkshop/wisp-protocol) server.
- The browser never uses `fetch` to Anthropic, so **CORS doesn't apply at all**. TLS terminates in the page, so **the relay sees only ciphertext**: the token isn't exposed to the relay operator.
- The User-Agent and all headers are fully controllable.
- It still needs a relay server, but a generic one; even a third-party one is tolerable since it can't read traffic.
- This fits naturally if the chosen browser runtime (other agent) already has a socket/relay layer. Cost: about 0.5 MB of WASM, an experimental library, and Anthropic sees the relay's IP. INFERRED; untested here.

### 5d. Avoid needing anything but inference (recommended baseline)

- `CLAUDE_CODE_OAUTH_TOKEN=<setup-token>`
- `CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1` (or `DISABLE_TELEMETRY=1`, `DISABLE_ERROR_REPORTING=1`, `DISABLE_AUTOUPDATER=1`)
- optionally `CLAUDE_CODE_SKIP_FAST_MODE_NETWORK_ERRORS=1`
- Remaining cross-origin traffic is `/v1/messages?beta=true` and `/v1/messages/count_tokens`, which pass CORS natively. `count_tokens` is optional: it falls back to an estimate.
- Remaining `/api/*` calls (e.g. `/api/hello`, `/api/oauth/profile`, `/api/claude_code/policy_limits`) fail as network errors. Whether that's survivable is for the internals agent.

### 5e. Local helper

- The user runs the same Worker locally (`node`/`wrangler dev`) and the page talks to `http://127.0.0.1:8787`.
- It defeats "fully client-side". Chrome's Local Network Access checks apply to public→loopback requests: my headless test disabled them via `--disable-features=LocalNetworkAccessChecks,…`, so real users would get a permission prompt or a block (INFERRED).

## 6. Open items needing a real token (can't be tested with fake credentials)

1. Does a valid OAuth token (from `/login` or `setup-token`) succeed on `POST /v1/messages?beta=true` when sent from a browser page? The request would carry the browser UA, `Origin` and `Referer`, along with the CLI's system prompt and beta headers. Expected CORS is fine (verified); the open question is the "Claude Code only" gate.
2. Does a successful SSE stream carry ACAO and stream incrementally to the browser? Expected yes, since the 401 on the same route does.
3. Does a successful `GET /v1/models` (200) carry ACAO?
4. Do refresh tokens rotate? This matters for the simple-request footgun in §1.
