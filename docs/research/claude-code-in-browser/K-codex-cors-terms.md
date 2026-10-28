# K — CORS & terms feasibility: a "Codex subscription" option on `https://kumavis.github.io`

Probed on 2026-10-28, using fake credentials only. **VERIFIED** means I ran it myself or read the primary source (OpenAI's docs, the Codex source, a published npm package). **INFERRED** means reasoning or secondary sources. Not legal advice.

## TL;DR

| Endpoint class | Browser-direct from `kumavis.github.io`? | Verdict |
|---|---|---|
| **Codex CLI inference**: `POST chatgpt.com/backend-api/codex/responses` (also `GET …/codex/models`, `…/wham/usage`) | **No.** An exact-origin allowlist sits in front of it. The preflight returns `400 Disallowed CORS origin` for our origin, for `https://claude.ai` and for `null`, whatever headers are requested. `Authorization` isn't CORS-safelisted, so the preflight can't be avoided. In Chromium the POST is **never sent** (`PreflightMissingAllowOriginHeader`). | **Hard blocker** (VERIFIED in a real Chromium on the genuine origin). The Codex CLI's own route needs a relay. |
| **Codex CLI OAuth**: `POST auth.openai.com/oauth/token` (refresh and auth-code grants, JSON or form) | **Yes.** The preflight returns 200 with `ACAO: *` and echoes the requested headers. Every error response carries `ACAO: *` and is readable in Chromium. | **Not a blocker** (VERIFIED). |
| **Codex CLI device-code login**: `POST auth.openai.com/api/accounts/deviceauth/{usercode,token}` | **Yes**, `ACAO: *` (probed with a fake `client_id`, so no real code was minted). | **Not a blocker** (VERIFIED). |
| **Authorize page**: `auth.openai.com/oauth/authorize` | curl got a **Cloudflare challenge** (`403`, `cf-mitigated: challenge`, "Just a moment..."). **I stopped probing it.** It's a top-level navigation in the user's own browser, so CORS doesn't apply. The challenge page sends `X-Frame-Options: SAMEORIGIN` and `COOP: same-origin`. | Use a new tab, never an iframe (INFERRED). |
| **Official "Sign in with ChatGPT" (SIWC) plan usage**, launched at DevDay on 2026-09-29: token endpoint `POST auth.openai.com/api/accounts/oauth/token` | **Yes**, `ACAO: *`, and errors are readable in Chromium. | **Not a blocker** (VERIFIED). |
| SIWC inference: `POST api.openai.com/v1/responses` with the SIWC bearer (also the API-key path) | **Preflight passes** (`ACAO: *`, echoes every requested header). The app layer adds `ACAO: *`: a missing-auth 401 is readable. The **edge auth layer's 401 for a bad or forged credential has no ACAO**, so a browser sees a TypeError, though the request *was* sent. | **Probably works** (preflight VERIFIED). The success path is INFERRED readable: OpenAI staff treated two browser-CORS regressions on this API as bugs and fixed them. The open item needs a real token. |
| `GET api.openai.com/v1/models` | Preflight OK, and the 401 for a fake key is readable (`ACAO: *`). | Fine (VERIFIED). |
| `auth.openai.com/.well-known/openid-configuration`, `/.well-known/jwks.json` | **No ACAO**, so blocked. | Minor: the page can't fetch the JWKS to verify the ID token's signature (§4). |

**Bottom line:**
- **Doing it "the way the Codex CLI does"** (ChatGPT token to `chatgpt.com/backend-api/codex`) **is not possible from a static page without a relay.** Login and refresh are CORS-open, but inference is behind an origin allowlist.
- **OpenAI's own sanctioned route for open-source apps (SIWC token sharing) points the same subscription at `api.openai.com/v1/responses`.** That host's CORS admits any origin, so a **proxy-free static page looks feasible**. Login has one manual step: paste the `127.0.0.1` callback URL, which pi does too.
- **Terms risk:**
  - **Low** for the SIWC route, which OpenAI documents for open-source apps.
  - **Moderate** for the Codex-CLI route. It is tolerated and was praised by OpenAI staff in March 2026, but it was never documented. SIWC now supersedes it, and the SIWC docs say "do not point it at ChatGPT's `backend-api` endpoints".

---

## 0. Environment notes (affect how the raw results read)

- **Every OpenAI host went through the sandbox egress proxy,** which re-terminates TLS. curl and Chromium both trust the proxy CA through the system store and NSS respectively (`ccr-agent-proxy`, `C,,`), and **no TLS verification was disabled**. Responses are upstream's own: they carry `cf-ray`, `x-oai-request-id` and `x-openai-proxy-wasm`.
- **Cloudflare challenges hit twice.** Per the ground rules, I recorded each and stopped probing that endpoint, with no retries using another UA, cookies or anything else.
  1. `OPTIONS https://chatgpt.com/backend-api/does-not-exist` (a made-up control path) returned `403` HTML with `challenge-platform` and "Enable JavaScript and cookies". The real Codex paths were **not** challenged, for preflights or POSTs, from curl or Chromium.
  2. `GET https://auth.openai.com/oauth/authorize?…` (the Codex CLI's authorize URL with fake PKCE/state) returned `403`, `cf-mitigated: challenge`, title "Just a moment...". I did not probe the SIWC authorize URL (`/api/accounts/authorize`) at all: it's a navigation, not a `fetch`, and would likely be challenged the same way.
  3. `GET https://auth.openai.com/codex/device` returned a plain `302` to `/api/accounts/deviceauth/authorize`. I didn't follow it.
- **openai.com and help.openai.com returned 403 to the WebFetch tool** (Terms of Use, help-center articles). I didn't try to get around that. Terms text below comes from a dated archive copy and search snippets, and is marked as such.
- **Fake tokens:**
  - ChatGPT and SIWC access token: a JWT-shaped string with a fake signature.
  - Account ID: `00000000-0000-0000-0000-000000000000`.
  - API key: `sk-proj-FAKE…`.
  - Refresh tokens and codes: `FAKE…`.
  - Device-code probe: a fake `client_id`, so it returned `invalid_client` and no real device code was created.
- One control (a POST with `Origin: chatgpt.com`) accidentally sent **two** `Origin` headers. It's kept as `INVALID-double-origin-*` and excluded; the redo with a single origin is in 2c.
- Scripts are in `K-scripts/` and raw headers and bodies in `K-probes/out/` (§7). `set-cookie` values are redacted.

## 1. How each host decides CORS (VERIFIED by probing)

### 1a. `chatgpt.com/backend-api/*`: exact-origin allowlist

- **Preflight:**
  - Answers `400`, `text/plain`, body `Disallowed CORS origin`.
  - Always sends `access-control-allow-methods: DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT`, `access-control-max-age: 600`, `access-control-allow-credentials: true` and `access-control-allow-headers: <echo>`.
  - Only an allowlisted origin gets `ACAO: <origin>` and `200 OK`.
  - INFERRED: this is the signature of Starlette/FastAPI `CORSMiddleware`, whose 400 body lists the failing checks; here only "origin" fails, so the methods and headers would pass.
- **Allowlist (controls, §2b):**

  | | Origins |
  |---|---|
  | **Allowed** | `https://chatgpt.com`, `https://chat.openai.com`, `https://platform.openai.com`, `https://auth.openai.com`, `https://sora.chatgpt.com`, and, oddly, **`http://localhost:3000`** |
  | **Denied** | `https://kumavis.github.io`, `https://claude.ai`, `null`, `https://openai.com`, `https://www.chatgpt.com`, `http://localhost`, `http://localhost:3001`, `http://localhost:8080`, `http://localhost:1455`, `http://127.0.0.1:3000`, `https://localhost:3000`, and lookalikes |

- **Header list doesn't matter.** Our origin is denied with the full Codex header set, with `content-type` only, and with no `Access-Control-Request-Headers` at all.
- **Same allowlist on other paths:** `/backend-api/codex/models` and `/backend-api/wham/usage` behave the same. Unknown paths get the Cloudflare challenge.
- **Real requests pass two layers:**
  1. **Edge auth layer:** `text/plain`, a JSON body with `"status": 401`, plus `x-openai-authorization-error: 401`, `x-error-json: <base64>` and `x-openai-internal-caller: unknown_through_ide`. It **never adds CORS headers, even for `Origin: https://chatgpt.com`**. This is what a forged token hits ("Could not parse your authentication token").
  2. **App layer:** `application/json` and `x-openai-proxy-wasm: v0.1`. It always adds `access-control-allow-credentials: true` and adds `ACAO` only for allowlisted origins. A missing token returns `missing_end_user_auth`, which carries `ACAO: https://chatgpt.com` for that origin and none for ours.
- **Consequence:** from `kumavis.github.io`, nothing on the Codex backend is readable. The preflight fails first anyway, so the POST is never even sent. `mode: 'no-cors'` can't help: it forbids the non-safelisted headers (`authorization`, `chatgpt-account-id`, `originator`, `OpenAI-Beta`) and returns an opaque body.

### 1b. `auth.openai.com`: open (`ACAO: *`) on every OAuth/API path probed

- **Preflights:**
  - `/oauth/token`, `/api/accounts/oauth/token`, `/api/accounts/deviceauth/usercode` and `/api/accounts/deviceauth/token` all return `200 OK` with `ACAO: *`.
  - `access-control-allow-headers` echoes the request. There is **no** `allow-credentials`, which is fine because the page never needs cookies.
  - `Origin: null` also gets `ACAO: *`.
- **Real responses:**
  - `401 invalid_refresh_token`, `401 token_expired` (fake auth code), `401`/`400 invalid_client`, and `404 deviceauth_not_found` all carry `ACAO: *`. Chromium read every one.
  - Both JSON and form-urlencoded bodies work; the form variant is a "simple request" that needs no preflight.
- **`/.well-known/openid-configuration` and `/.well-known/jwks.json`** return 200 but with **no ACAO**, so Chromium blocks them (`MissingAllowOriginHeader`).
- **Discovery document** (VERIFIED, fetched): authorization `…/api/accounts/authorize`, token `…/api/accounts/oauth/token`, revocation `…/api/accounts/oauth/revoke`, userinfo `…/api/accounts/oauth/userinfo`, `token_endpoint_auth_methods_supported` includes `none` (public clients), PKCE `S256`, `response_modes_supported: ["query"]`.
- **Contrast with Anthropic** (report C): there, `/v1/oauth/token` is allowlisted to Anthropic's own origins, so login and refresh are the blocker and inference is open. **OpenAI is the reverse for the Codex backend:** login and refresh are open and inference is closed.

### 1c. `api.openai.com/v1/*`: open, except edge-auth errors

- **Preflights:**
  - `/v1/responses` and `/v1/models` return `200 OK` with `ACAO: *`.
  - `allow-headers` echoes the request, including `chatgpt-account-id`, `originator` and `openai-beta`.
  - `access-control-expose-headers: X-Request-ID, Server-Timing-Total, CF-Ray`. There's no `allow-credentials`.
- **App-layer responses carry `ACAO: *` and are readable in Chromium:**
  - `POST /v1/responses` with no auth: `401 Missing bearer or basic authentication`.
  - `GET /v1/models` with a fake key or fake JWT: `401 invalid_api_key` / `invalid_issuer`.
- **Edge-auth responses carry no ACAO:**
  - `POST /v1/responses` with a fake key returns `401 invalid_api_key`; with a fake JWT, `401 invalid_issuer`.
  - Both are `text/plain` with `x-openai-authorization-error`.
  - Chromium **did send the POST** (the preflight passed) and then reported `MissingAllowOriginHeader`.
  - This is the same quirk report C found on Anthropic's `/v1/models` 401.
- **Practical consequence:** a page can't distinguish "token rejected" from "network down" on `/v1/responses`. It should refresh and retry once after a TypeError on a request that the preflight let through (§4).

## 2. Raw probe tables

### 2a. curl preflights (`OPTIONS`, `Origin: https://kumavis.github.io`)

These used `Access-Control-Request-Method: POST` (`GET` for the models endpoints) and `Access-Control-Request-Headers: authorization,chatgpt-account-id,openai-beta,originator,content-type,accept`, unless a row says otherwise.

| Probe | Status | ACAO | ACAC | Other `access-control-*` | Body |
|---|---|---|---|---|---|
| `chatgpt.com/backend-api/codex/responses` | **400** | – | `true` | `allow-methods: DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT`; `max-age: 600`; `allow-headers: <echo>`; `vary: Origin` | `Disallowed CORS origin` |
| same, req-headers `content-type` only / none / method `GET` | 400 | – | `true` | same | `Disallowed CORS origin` |
| `chatgpt.com/backend-api/codex/models` (GET) | 400 | – | `true` | same | `Disallowed CORS origin` |
| `chatgpt.com/backend-api/wham/usage` (GET) | 400 | – | `true` | same | `Disallowed CORS origin` |
| `chatgpt.com/backend-api/does-not-exist` (control) | **403** | – | – | – | **Cloudflare JS challenge** (`challenge-platform`, "Enable JavaScript and cookies"). **Stopped.** |
| `auth.openai.com/oauth/token` | **200** | `*` | – | `allow-methods` as above; `max-age: 600`; `allow-headers: <echo>` | `OK` |
| same, `Origin: null` / req-headers `content-type` | 200 | `*` | – | same | `OK` |
| `auth.openai.com/api/accounts/oauth/token` (SIWC) — full list / `content-type` | **200** | `*` | – | same | `OK` |
| `auth.openai.com/api/accounts/deviceauth/usercode` (`content-type`) | 200 | `*` | – | same | `OK` |
| `auth.openai.com/api/accounts/deviceauth/token` (`content-type`) | 200 | `*` | – | same | `OK` |
| `api.openai.com/v1/responses` | **200** | `*` | – | `allow-methods` as above; `max-age: 600`; `allow-headers: <echo>`; `expose-headers: X-Request-ID, Server-Timing-Total` + `CF-Ray` | `OK` |
| `api.openai.com/v1/models` (GET) | **200** | `*` | – | same; `expose-headers: X-Request-ID` + `CF-Ray` | `OK` |

### 2b. `chatgpt.com/backend-api/codex/responses` preflight vs Origin (full Codex header list)

| Origin | Status | ACAO |
|---|---|---|
| `https://chatgpt.com` | 200 | `https://chatgpt.com` |
| `https://chat.openai.com` | 200 | `https://chat.openai.com` |
| `https://platform.openai.com` | 200 | `https://platform.openai.com` |
| `https://auth.openai.com` | 200 | `https://auth.openai.com` |
| `https://sora.chatgpt.com` | 200 | `https://sora.chatgpt.com` |
| `http://localhost:3000` | **200** | `http://localhost:3000` |
| `https://kumavis.github.io` | 400 | – |
| `https://claude.ai` | 400 | – |
| `null` | 400 | – |
| `https://openai.com`, `https://www.chatgpt.com` | 400 | – |
| `http://localhost`, `:3001`, `:8080`, `:1455`; `http://127.0.0.1:3000`; `https://localhost:3000` | 400 | – |
| `https://kumavis.github.io.chatgpt.com`, `https://evil.chatgpt.com.example.com` | 400 | – |

### 2c. curl actual requests (`Origin: https://kumavis.github.io` unless noted, fake auth)

"Codex hdrs" means `Authorization: Bearer <fake JWT>`, `chatgpt-account-id`, `OpenAI-Beta: responses=experimental`, `originator: codex_cli_rs`, `content-type: application/json` and `accept: text/event-stream`. The body was a minimal Codex `responses` payload (`stream:true`, `store:false`).

| Probe | Status | ACAO | ACEH | Body (first ~300 chars, whitespace folded) |
|---|---|---|---|---|
| `POST chatgpt.com/backend-api/codex/responses`, Codex hdrs | 401 | **–** | – | `{ "error": { "message": "Could not parse your authentication token. Please try signing in again.", "type": null, "code": "unauthorized_unknown", "param": null }, "status": 401 }` (`text/plain`, edge layer) |
| same, `Origin: https://chatgpt.com` (single origin) | 401 | **–** | – | same: the edge layer adds no CORS even for an allowed origin |
| same, no `Origin` | 401 | – | – | same |
| `POST …/codex/responses`, no `Authorization` | 401 | **–** (`ACAC: true`) | – | `{"detail":{"code":"missing_end_user_auth","message":"We got your request, but your ChatGPT login did not make it to this service."},…}` (app layer) |
| same, no auth, `Origin: https://chatgpt.com` | 401 | `https://chatgpt.com` (`ACAC: true`) | – | same: the app layer adds ACAO only for allowlisted origins |
| `GET chatgpt.com/backend-api/codex/models?client_version=0.50.0`, Codex hdrs | 401 | – | – | `Could not parse your authentication token…` |
| `POST auth.openai.com/oauth/token`, JSON refresh (Codex `client_id`, fake refresh token) | 401 | **`*`** | – | `{ "error": { "message": "Could not validate your refresh token. Please try signing in again.", "type": "invalid_request_error", "param": null, "code": "invalid_refresh_token" } }` |
| same, form refresh | 401 | `*` | – | same |
| same, form `authorization_code` (fake code, `localhost:1455` redirect) | 401 | `*` | – | `…"Could not validate your token. Please try signing in again."…"code": "token_expired"` |
| same, JSON, fake `client_id` | 401 | `*` | – | `…"Invalid client specified."…"code": "invalid_client"` |
| `POST auth.openai.com/api/accounts/deviceauth/usercode` (fake `client_id`) | 400 | `*` | – | `…"This app is unavailable. Contact the app owner and try again later."…"code": "invalid_client"` |
| `POST auth.openai.com/api/accounts/deviceauth/token` (fake IDs) | 404 | `*` | – | `…"Resource not found"…"code": "deviceauth_not_found"` |
| `POST auth.openai.com/api/accounts/oauth/token` (SIWC), form `authorization_code`, fake issued client | 400 | `*` | – | `{ "error": "invalid_client" }` |
| same, form `refresh_token` | 400 | `*` | – | `{ "error": "invalid_client" }` |
| `GET auth.openai.com/.well-known/openid-configuration` | 200 | **–** | – | `{ "issuer": "https://auth.openai.com", "authorization_endpoint": "https://auth.openai.com/api/accounts/authorize", "token_endpoint": "https://auth.openai.com/api/accounts/oauth/token", …` |
| `GET auth.openai.com/.well-known/jwks.json` | 200 | **–** | – | `{"keys":[{"kty":"RSA","kid":"qAgbfguRn1QO…","use":"sig","alg":"RS256",…` |
| `POST api.openai.com/v1/responses`, `Bearer sk-proj-FAKE…` | 401 | **–** | `X-Request-ID, Server-Timing-Total, CF-Ray` | `{ "error": { "message": "Incorrect API key provided: sk-proj-****…FAKE. …", "type": "invalid_request_error", "code": "invalid_api_key", "param": null }, "status": 401 }` (`text/plain`, edge layer) |
| `POST api.openai.com/v1/responses`, `Bearer <fake JWT>` | 401 | **–** | same | `…"Your authentication token is not from a valid issuer."…"code": "invalid_issuer"…"status": 401` (edge layer) |
| `POST api.openai.com/v1/responses`, no auth | 401 | **`*`** | same | `{ "error": { "message": "Missing bearer or basic authentication in header", "type": "invalid_request_error", "param": null, "code": null } }` (app layer, `www-authenticate: Bearer realm="OpenAI API"`) |
| `GET api.openai.com/v1/models`, fake key | 401 | **`*`** | `X-Request-ID, CF-Ray` | `…"Incorrect API key provided…"…"invalid_api_key"` |
| `GET auth.openai.com/oauth/authorize?…` (navigation, no Origin) | **403** | – | – | **Cloudflare "Just a moment..."** (`cf-mitigated: challenge`, `x-frame-options: SAMEORIGIN`, `COOP: same-origin`, `COEP: require-corp`). **Stopped.** |
| `GET auth.openai.com/codex/device` (navigation) | 302 | – | – | `location: https://auth.openai.com/api/accounts/deviceauth/authorize` (not followed) |

### 2d. Real browser: headless Chromium 153 on the genuine `https://kumavis.github.io/vibe-dump/` (VERIFIED)

- `fetch()` ran inside the page with only the headers listed; `location.origin === "https://kumavis.github.io"`.
- The CORS reason comes from the Chrome DevTools Protocol (`Network.loadingFailed.corsErrorStatus`).
- `acao=null` in the page is expected: `access-control-allow-origin` isn't readable from JS unless exposed. "READABLE" means the body was readable.
- Outputs: `K-probes/out/browser-codex-cors.out` and `browser-siwc-cors.out`.

| fetch | Result | Chromium CORS reason / wire |
|---|---|---|
| `POST chatgpt.com/backend-api/codex/responses`, Codex hdrs | **BLOCKED** `TypeError: Failed to fetch` | `OPTIONS` 400, then `PreflightMissingAllowOriginHeader`. **The POST was never sent.** |
| `GET chatgpt.com/backend-api/codex/models`, Codex hdrs | **BLOCKED** | `OPTIONS` 400, then `PreflightMissingAllowOriginHeader` |
| `POST auth.openai.com/oauth/token`, JSON refresh | **READABLE** 401 `invalid_refresh_token` | `OPTIONS` 200 |
| `POST auth.openai.com/oauth/token`, form auth-code | **READABLE** 401 `token_expired` | no preflight (simple request) |
| `POST auth.openai.com/api/accounts/deviceauth/usercode` | **READABLE** 400 `invalid_client` | `OPTIONS` 200 |
| `POST auth.openai.com/api/accounts/deviceauth/token` | **READABLE** 404 `deviceauth_not_found` | `OPTIONS` 200 |
| `POST auth.openai.com/api/accounts/oauth/token` (SIWC), form auth-code / refresh | **READABLE** 400 `invalid_client` (both) | simple request |
| `GET auth.openai.com/.well-known/openid-configuration` | **BLOCKED** | `MissingAllowOriginHeader` |
| `GET auth.openai.com/.well-known/jwks.json` | **BLOCKED** | `MissingAllowOriginHeader` |
| `POST api.openai.com/v1/responses`, fake API key | **BLOCKED** | `OPTIONS` 200, **POST sent**, then 401 with `MissingAllowOriginHeader` |
| `POST api.openai.com/v1/responses`, fake JWT (SIWC style) | **BLOCKED** | same (edge 401) |
| `POST api.openai.com/v1/responses`, no auth | **READABLE** 401 `Missing bearer…` | `OPTIONS` 200 |
| `GET api.openai.com/v1/models`, fake key / fake JWT | **READABLE** 401 `invalid_api_key` / `invalid_issuer` | `OPTIONS` 200 |

**Wire headers Chromium sent** on the `/v1/responses` POST:
- **From the page:** `authorization`, `content-type` and `accept`.
- **Added by the browser:**
  - `origin: https://kumavis.github.io` and `referer: https://kumavis.github.io/`
  - `sec-fetch-mode: cors` and `sec-fetch-site: cross-site`
  - `sec-ch-ua*`, plus the HeadlessChrome `user-agent`

The Codex POST attempt carried the page's `originator: codex_cli_rs` and `OpenAI-Beta`, but it never left the browser.

## 3. Documentary findings

### 3a. Codex "Sign in with ChatGPT": plans, limits, credentials (VERIFIED primary: `developers.openai.com/codex/auth`, which now 308-redirects to `learn.chatgpt.com/docs/auth`, and `learn.chatgpt.com/docs/pricing`)

- **Two sign-in methods:** *"Codex supports two ways for a person to sign in when using OpenAI models: Sign in with ChatGPT for subscription access; Sign in with an API key for usage-based access."*
  - With a key: *"When you sign in with an API key, Codex uses standard API pricing instead of included ChatGPT plan credits."*
- **Plans and limits:**
  - *"ChatGPT Work and Codex are included in your ChatGPT Free, Go, Plus, Pro, Business, Edu, or Enterprise plan."*
  - Limits are per 5-hour window for Plus and Business (*"Pro plans currently have no five-hour limit"*), and *"Weekly limits may also apply."*
  - Local and cloud usage share the allowance. Plus and Pro can buy credits.
- **Credentials:**
  - *"Codex caches login details locally in a plaintext file at `~/.codex/auth.json` or in your OS-specific credential store … treat `~/.codex/auth.json` like a password: it contains access tokens."*
  - *"Codex refreshes tokens automatically during use before they expire."*
  - Headless use: copy `auth.json`, or tunnel `localhost:1455`. *"Don't commit it, paste it into tickets, or share it in chat."*
- **Device code login** is *"(beta)"*. Users must *"Enable device code login in your ChatGPT security settings."*
- **Codex access tokens** (`printenv CODEX_ACCESS_TOKEN | codex login --with-access-token`) exist only in *"ChatGPT Enterprise workspaces"*. They're *"intended for trusted scripts, schedulers, and private CI runners."* There's no Plus/Pro equivalent of Claude's `setup-token`.
- **Silent topics:** the Codex auth page says nothing about third-party clients reusing the login, and nothing about browsers or CORS.

### 3b. OpenAI Terms of Use clauses that bear on this

**Source and dating.** These are VERIFIED from the **2024-12-11** version via an archive copy (open.windriver.com), because openai.com returned 403 to the fetcher. The current version is effective 2026-01-01. Secondary trackers (conductatlas, rupt.dev) say it keeps the same clauses, but that is INFERRED.

- *"Automatically or programmatically extract data or Output."* This sits in the "What you cannot do" list.
- *"Interfere with or disrupt our Services, including circumvent any rate limits or restrictions or bypass any protective measures or safety mitigations we put on our Services."*
- *"Modify, copy, lease, sell or distribute any of our Services."*
- *"You may not share your account credentials or make your account available to anyone else and are responsible for all activities that occur under your account."*

### 3c. OpenAI's position on third-party tools using the ChatGPT/Codex OAuth

Timeline:

1. **2025:** community plugins reuse the Codex CLI's public client ID (`app_EMoamEEZ73f0CkXaXp7hrann`) against `chatgpt.com/backend-api/codex`. Examples are `opencode-openai-codex-auth` (numman-ali and forks), CLIProxyAPI and pi's `openai-codex` provider. The plugin READMEs describe themselves as "personal development use only … not for commercial services, API resale, or multi-user applications" (INFERRED: secondary search summaries).
2. **2025-12-19 and 2026-02-09:** in [openai/codex discussion #8338](https://github.com/openai/codex/discussions/8338), Codex maintainer **@etraut-openai** wrote:
   - *"you're welcome to fork the repo and make modifications to suit your own needs"*
   - *"I'm an engineer, not a lawyer … our terms of use and code license are quite permissive … OSS projects like OpenCode are doing things similar to what you're describing"*
   - He also recommended a lawyer for commercial questions.

   VERIFIED (page read). Not a policy statement.
3. **2026-01-10:** OpenCode v1.1.11 ships native ChatGPT Plus/Pro login (INFERRED: secondary blogs).
4. **2026-03-30:** **Romain Huet (OpenAI):** *"We want people to be able to use Codex, and their ChatGPT subscription, wherever they like! That means in the app, in the terminal, but also in JetBrains, Xcode, OpenCode, Pi, and now Claude Code. That's why Codex CLI and Codex app server are open source too!"*
   - Source: quoted in [Simon Willison, 2026-04-23](https://simonwillison.net/2026/Apr/23/gpt-5-5/), which calls `/backend-api/codex/responses` the *"semi-official Codex backdoor API"* and reports OpenAI saying OpenClaw *"was welcome to continue integrating with OpenAI's subscriptions via the same mechanism."*
   - VERIFIED that the post quotes this. I didn't fetch the tweet itself.
5. **2026-04 onwards, technical friction on the Codex backend** (not policy):
   - [#17860](https://github.com/openai/codex/issues/17860), open with no staff reply: a Cloudflare JS challenge on `chatgpt.com/backend-api/*` for some non-browser TLS stacks (the Codex CLI's own rustls build on Linux).
   - [#31967](https://github.com/openai/codex/issues/31967), July 2026, closed: model routing depends on `originator`/version, so `originator: pi` without a version got `Model not found`. Third parties responded by sending Codex identity headers.

   VERIFIED (issue pages read).
6. **2026-09-29, DevDay: "Sign in with ChatGPT" plan usage for third-party apps.** This is the decisive change (VERIFIED primary: developers.openai.com/siwc/* and learn.chatgpt.com/docs/sign-in-with-chatgpt).
   - *"Eligible ChatGPT Plus and Pro users can use their ChatGPT plan for AI requests in participating apps."*
   - *"ChatGPT plan usage is available to all open-source partners and selected private clients"*; commercial partners are in a limited trial.
   - The listed **"Open-source integrations: OpenClaw, OpenCode, Pi, and T3."**
   - Usage *"uses your Codex / ChatGPT work usage included in your plan"*. Users can set a weekly cap per app under Settings, and disconnect under *"Security and login > Sign in with ChatGPT"*.
   - **Flow (open-source track):**
     - Authorize at `https://auth.openai.com/api/accounts/authorize` with `client_id=dynamic_agent_client` (*"the first-time registration entrypoint"*; the issued client ID comes back on the callback), `ext_agent_host_id` (*"distinct for each host"*), `agent_name_hint`, PKCE `S256`, scope `openid profile email offline_access resource.invoke chatgpt.tokens.use.direct`, and `resource=https://api.openai.com/v1`.
     - Redirect URI: *"Use an HTTP loopback callback on `127.0.0.1` … Do not substitute with `localhost`."*
     - Token exchange at `https://auth.openai.com/api/accounts/oauth/token`, form-encoded. *"No client secret is required … this OSS flow remains a public client without a secret."*
     - `expires_in: 3600`. *"rotating refresh token."*
   - **Inference:** *"send the OAuth access token as `Authorization: Bearer <ACCESS_TOKEN>` to `POST https://api.openai.com/v1/responses`"*, with `store:false` and `stream:true`, and **"do not point it at ChatGPT's `backend-api` endpoints."**
   - **Preview limitations** (relevant to the protocol agent): `input` must be an array, *"explicit `{type: "message", role: "system"}` items are rejected"*, many parameters must be omitted (`temperature`, `max_output_tokens`, `previous_response_id` over HTTP, …), and there are no hosted tools.
   - **Not addressed:** none of the SIWC pages mention browser or web clients, origins or CORS.
     - The "Self-hosted VMs" page only covers completing OAuth on the machine with the browser and copying the credentials.
     - The **"On your website"** track is identity-only (*"Authenticate users and create a session in your application"*). Plan usage sits under the open-source track.
7. **2026-10-21:** `@earendil-works/pi-ai@1.4.0` (successor of the now-deprecated `@mariozechner/pi-ai`, last version 0.73.1) ships **both** providers (VERIFIED from the npm tarball, grep only):
   - `auth/oauth/openai-chatgpt.js`, the SIWC route: `dynamic_agent_client`, `/api/accounts/*` endpoints, resource `api.openai.com/v1`, and a callback at `http://127.0.0.1:1455/auth/callback`. If the callback server can't receive it, the user is told to *"paste the final redirect URL here"*. *"Pi does not use the ID token to identify the user or read profile data."*
   - `auth/oauth/openai-codex.js`, the legacy route: the Codex `client_id`, `auth.openai.com/oauth/*`, and `localhost:1455`. Its header says *"only intended for CLI use, not browser environments."*

**Reading** (INFERRED):
- Reusing the Codex CLI client against `backend-api` was tolerated, publicly endorsed in spirit by OpenAI developer relations for named open-source tools, and never documented.
- Since 2026-09-29 OpenAI has a documented route for exactly this use case. Its docs steer apps away from `backend-api`.
- For a new integration, the defensible choice is SIWC.

### 3d. Browser-direct use of `api.openai.com`

- **openai-node README** (VERIFIED, raw GitHub; npm `openai@7.45.1`):
  - *"Web browsers: disabled by default to avoid exposing your secret API credentials. Enable browser support by explicitly setting `dangerouslyAllowBrowser` to `true`."*
  - It lists "Internal Tools" and short-lived credentials as cases where this "might not be dangerous".
- **OpenAI help center "Best practices for API key safety"** (INFERRED: search snippet, because the help center returned 403 to the fetcher):
  - *"Exposing your OpenAI API key in client-side environments like browsers or mobile apps allows malicious users to take that key and make requests on your behalf … Requests should always be routed through your own backend server."*
  - This targets developers shipping their own key to users. A user's own key, or their own SIWC token, in their own tab is a different threat model.
- **OpenAI treats browser CORS on the API as supported.** Staff fixed two regressions as bugs (VERIFIED: forum threads read):
  - [2025-10-15](https://community.openai.com/t/chat-completions-api-endpoint-down-blocked-any-web-browser-request/1362527): the `/v1/chat/completions` preflight returned 404. Staff: *"I can confirm this is a bug, and it's currently being worked on."* Fixed the same day.
  - [2026-01-29](https://community.openai.com/t/has-the-cors-policy-changed-responses-api/1372791): the `/v1/responses` preflight returned 400 with no ACAO ("All OpenAI requests that were previously succeeding began failing overnight due to CORS errors"). Staff: *"We have identified the issue and the fix has rolled out."*
- **What that implies** (INFERRED, strongly): successful `/v1/responses` responses, SSE included, carry ACAO for arbitrary origins, because browser apps were "previously succeeding".

### 3e. CORS documentation for the Codex backend

There isn't any (VERIFIED by search; no OpenAI page mentions it). Every browser-facing Codex-backend project I found runs through a local or server proxy: `chatgpt-codex-proxy`, `codex-openai-proxy`, ccproxy, CLIProxyAPI and others. The probes in §1a show why.

## 4. What this means for the page

### Route A: "like the Codex CLI" (Codex `client_id`, `chatgpt.com/backend-api/codex`)

- **Login:** feasible in-page.
  - **Device code:** CORS-open, but the user must first enable it in ChatGPT security settings.
  - **Authorize in a new tab, then paste the loopback callback URL:** the code exchange is CORS-open. Current Codex `main` (`server.rs`) uses `http://127.0.0.1:<port>/auth/callback`, default port 1455; older builds and pi's legacy provider use `localhost:1455`.
  - **Refresh:** CORS-open.
- **Inference: blocked.** It needs a relay (§5a), an extension (§5b) or a local helper.
- **Risk:**
  - Identifying as `originator: codex_cli_rs` from a non-Codex client means presenting as the Codex CLI.
  - The backend routes by originator and version (#31967), and Cloudflare challenges non-browser fingerprints (#17860).
  - It is now off the documented path (§3c).

### Route B: Sign in with ChatGPT, open-source track (recommended)

1. The page makes a per-browser host UUID once (`crypto.randomUUID()` → `ext_agent_host_id=urn:uuid:<uuid>`) and creates the PKCE pair with WebCrypto.
2. It opens `https://auth.openai.com/api/accounts/authorize?...` in a **new tab** (the authorize host frames `SAMEORIGIN`), with `redirect_uri=http://127.0.0.1:1455/auth/callback`.
3. The tab ends on `http://127.0.0.1:1455/auth/callback?code=…&state=…&client_id=<issued>`, normally a "can't connect" page. The user copies that URL and pastes it into the page; pi's documented fallback does the same.
   - **Caveat:** if the Codex CLI or pi is mid-login on port 1455 on that machine, it will receive the callback and reject it (state mismatch). Tell the user (INFERRED).
4. `POST https://auth.openai.com/api/accounts/oauth/token` (form, `client_id=<issued>`, `code`, `code_verifier`, `redirect_uri`, `resource`). **CORS-open, VERIFIED.** Check that the granted `scope` includes `chatgpt.tokens.use.direct`.
5. **Inference:** `POST https://api.openai.com/v1/responses` with `Authorization: Bearer <access>` (`store:false`, `stream:true`).
   - The preflight is **VERIFIED**. A readable 200 SSE is **INFERRED** (§3d) and is the open item.
   - The SIWC docs list no ChatGPT-specific headers, so no `chatgpt-account-id` or `originator` is needed (VERIFIED: docs and pi's provider).
6. **Refresh:** the same token endpoint (`grant_type=refresh_token`, `client_id`, `refresh_token`, `resource`). Tokens live 1 hour and refresh tokens rotate.
   - Serialize refreshes across tabs with `navigator.locks.request(...)`, so two tabs don't burn a rotated refresh token (INFERRED).
   - Unlike Anthropic's token endpoint, the response is readable, so a refresh that went through can't be lost.
7. **Error handling:** an edge 401 is an unreadable TypeError (§1c). After a TypeError on a request whose preflight passed, refresh once and retry once; then report "signed out or network". A usage limit arrives in-stream as `response.failed` with `subscription_sharing_usage_limit_exceeded` (VERIFIED docs), which is readable.
8. **ID token validation:**
   - The JWKS is not CORS-readable.
   - An ID token received straight from the token endpoint over TLS may be validated by TLS server validation instead of its signature (OIDC Core 1.0 §3.1.3.7, item 6). The page can therefore decode it and check `iss`, `aud` (= issued `client_id`), `exp` and `nonce`.
   - Or it can skip identity use entirely, as pi does (INFERRED).
9. **Storage:**
   - The same caveats as the README's credential section apply, and more strongly, because this is a **refresh** token:
     - `kumavis.github.io` is shared by every Pages app of the account, and any script there can read storage.
     - `auth.openai.com` accepts any origin, so a stolen refresh token is usable from anywhere.
   - Default to `sessionStorage`. Offer "Remember" with the same warning (INFERRED).

**Eligibility ambiguity** (INFERRED):
- The SIWC docs assume a local tool that writes a `0600` file. A browser tab is a different kind of "host".
- Dynamic registration needs no approval (VERIFIED: docs and pi), and the docs say plan usage is "available to all open-source partners". This page is open source.
- What's unclear is whether an unregistered open-source *web page* counts. If the user wants certainty, `/siwc/request-client-id` exists.
- Plans: SIWC plan usage is Plus and Pro only. Codex itself also covers Free, Go, Business, Edu and Enterprise. Business and Enterprise users would be told "unavailable".

**The claude.ai artifact copy** (open, untested):
- Its origin is not `kumavis.github.io`. `auth.openai.com` and `api.openai.com` send `ACAO: *`, so CORS is fine for any origin, `null` included (preflight VERIFIED with `Origin: null` on the token endpoint).
- The artifact sandbox's own CSP or `connect-src` may block outbound fetches regardless. Check that separately.

## 5. Fallbacks

**Note:** GitHub Pages serves static files only. Anything that proxies lives elsewhere.

### 5a. Per-user Cloudflare Worker for `chatgpt.com/backend-api/codex/*` (Route A only)

File: `K-worker/K-codex-cors-worker.js`. It's a variant of `C-personal-cors-worker.js` with a pinned upstream, a path allowlist, a per-user relay key, and `set-cookie` stripping.

```js
// Personal CORS relay for a browser-hosted "Codex subscription" client.
// Deploy on YOUR OWN Cloudflare account; never share it, never run one for others.
//   wrangler secret put RELAY_KEY      # any long random string; the page sends it as x-relay-key
// Point the page's Codex base URL at https://<name>.<you>.workers.dev/backend-api/codex
//
// Only chatgpt.com/backend-api/codex/* needs this: auth.openai.com (token, refresh,
// device code) already answers any origin with ACAO:* (probed 2026-10-28), so the
// page should call it directly and keep refresh tokens out of the relay.
const ALLOWED_ORIGINS = new Set(['https://kumavis.github.io']);
const UPSTREAM = 'https://chatgpt.com';           // pinned: never taken from the request
const ALLOWED_PATH = /^\/backend-api\/codex\/(responses|models)$/;
const DROP = /^(origin|referer|cookie|host|x-relay-key|cf-|x-forwarded-|x-real-ip|sec-fetch-|forwarded)/i;

export default {
  async fetch(req, env) {
    const origin = req.headers.get('origin');
    if (!ALLOWED_ORIGINS.has(origin)) return new Response('origin not allowed', { status: 403 });
    const cors = {
      'access-control-allow-origin': origin,
      'access-control-allow-methods': 'GET, POST, OPTIONS',
      'access-control-allow-headers': req.headers.get('access-control-request-headers') ?? '',
      'access-control-expose-headers': '*',
      'access-control-max-age': '600',
      vary: 'Origin',
    };
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (!env.RELAY_KEY || req.headers.get('x-relay-key') !== env.RELAY_KEY)
      return new Response('bad relay key', { status: 401, headers: cors });
    const url = new URL(req.url);
    if (!ALLOWED_PATH.test(url.pathname) || !['GET', 'POST'].includes(req.method))
      return new Response('path not relayed', { status: 404, headers: cors });
    const headers = new Headers();
    for (const [k, v] of req.headers) if (!DROP.test(k)) headers.set(k, v);
    const res = await fetch(UPSTREAM + url.pathname + url.search, {
      method: req.method, headers, redirect: 'manual',
      body: req.method === 'POST' ? req.body : undefined,   // streamed through, not buffered
      ...(req.method === 'POST' ? { duplex: 'half' } : {}),
    });
    const out = new Headers(res.headers);
    out.delete('set-cookie');                                // never hand chatgpt.com cookies to the page
    for (const [k, v] of Object.entries(cors)) out.set(k, v);
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers: out }); // SSE streams
  },
};
```

**Test.** The Worker ran under a Node adapter (`K-worker/node-adapter.mjs`, upstream through the egress proxy, TLS verified). Then I called it from the real `kumavis.github.io` page in Chromium; Local Network Access checks were disabled only because the test relay was on loopback. Output: `K-probes/out/browser-worker-codex.out`.
- **curl:**
  - Preflight: 204 with exact-origin ACAO.
  - Wrong origin: 403.
  - No relay key: 401 `bad relay key`, readable.
  - `/backend-api/conversation`: 404 `path not relayed`.
- **Chromium:**
  - `POST /backend-api/codex/responses` with Codex hdrs and the key returns **READABLE** `401 "Could not parse your authentication token…"` from chatgpt.com, with `cf-ray` exposed.
  - `GET …/codex/models` is also readable.
  - Without the key, the page gets a readable 401 from the relay.
- **Not verified:**
  - Deployment on the real Workers runtime. Cloudflare-to-Cloudflare subrequests have a non-browser fingerprint, and #17860 shows `chatgpt.com/backend-api` challenges some non-browser TLS stacks. **If chatgpt.com challenges the Worker, that's the answer.** Don't add UA or TLS impersonation.
  - A successful SSE stream, which needs a real token.

**Security notes:**
- **Who sees the token.** The ChatGPT access token and account ID pass through the Worker in cleartext at the edge. Each user deploys their own relay.
  - **The app author must not run a shared relay.** It would hold many users' subscription tokens and would be "mak[ing] your account available to anyone else" from the users' side (ToU, §3b).
  - Log nothing.
- **Keep refresh tokens out of the relay.** Refresh goes to `auth.openai.com` directly, since that host is CORS-open.
- **Origin is not authentication.** Non-browser clients can spoof `Origin`, so the **relay key** is the real gate. It's still weak, because it sits in page storage like the token itself. Its job is stopping drive-by abuse of the relay, not same-origin attackers.
- **Pinned upstream plus path allowlist:** it is never an open proxy, never reaches `/backend-api/conversation` or other ChatGPT-web endpoints, and drops `set-cookie`.
- **No identity games.** The Worker doesn't set `User-Agent` or `originator`; whatever the page sends passes through. Choosing to send `originator: codex_cli_rs` from a non-Codex client is the terms question in §4, not something the relay should paper over.

### 5b. Browser extension (Route A)

- An MV3 extension with `host_permissions: ["https://chatgpt.com/*"]` can make the call from its service worker. Extension fetches with host permissions aren't subject to CORS (INFERRED, standard Chrome behaviour).
- It uses the real browser's TLS stack, so it's less likely to trip Cloudflare than a Worker (INFERRED). The token stays on-device.
- **Downsides:** an install step, Chromium or Firefox only, and streaming over a `runtime.Port`.
- **Not DNR:** declarativeNetRequest can't turn the preflight's 400 into an OK, so header injection alone won't work (INFERRED, as in report C §5b).

### 5c. Wisp/libcurl.js TLS-in-WASM relay (Route A)

- CORS doesn't apply, and the relay sees only ciphertext.
- mbedTLS has a non-browser fingerprint, the same class as the rustls build that #17860 reports being challenged (INFERRED). If challenged, stop.

### 5d. Observed and **not recommended**: `http://localhost:3000` is on the chatgpt.com allowlist

- A copy of the page served from exactly `http://localhost:3000` would pass the Codex backend's CORS (VERIFIED preflight, §2b).
- This is evidently a developer-convenience entry. Building on it is relying on an unintended hole in an access restriction, close to the ToU's "bypass any protective measures", and it can vanish without notice.
- Recorded as a finding only.

### 5e. API key (no subscription)

- `api.openai.com` with the user's own key is CORS-open (VERIFIED preflight; the app-layer 401s are readable) and is billed at API rates.
- It has the same unreadable-edge-401 quirk.
- OpenAI's guidance discourages keys in browsers. A user's own key in their own tab is the README's existing "API key" stance, applied to OpenAI.

## 6. Open items needing a real token

1. **SIWC:** does a successful `POST api.openai.com/v1/responses` (SSE) return `ACAO: *` to `https://kumavis.github.io` and stream incrementally? Does anything in the SIWC entitlement check look at `Origin`, `Referer` or the browser UA?
2. **SIWC:** does the authorize flow complete normally when nothing listens on `127.0.0.1:1455` (code readable from the "can't connect" URL)? Is the issued `client_id` stable across re-logins from the same `ext_agent_host_id`?
3. **SIWC:** does a *real but expired* access token on `/v1/responses` get the edge 401 (unreadable, no ACAO) or an app-layer 401 (readable)?
4. **Route A:** does chatgpt.com challenge a deployed Workers relay?
5. **Artifact copy:** does the claude.ai artifact sandbox allow `connect-src` to `auth.openai.com` and `api.openai.com`?

## 7. Files

Scratchpad root: `<scratchpad>/research/`

- **This report:** `K-codex-cors-terms.md`
- **Probe scripts** (`K-scripts/`):
  - `preflight.sh` and `pf-origin.sh` (curl preflights)
  - `real.sh` (curl actual requests, with challenge detection)
  - `browser-codex-cors.mjs` and `browser-siwc-cors.mjs` (Chromium on the real page, with CDP CORS reasons)
  - `browser-worker-codex.mjs` (Chromium against the relay)
- **Raw output** (`K-probes/out/`): `*.hdr` and `*.body` per probe (cookies redacted), plus `browser-*.out`.
- **Relay** (`K-worker/`): `K-codex-cors-worker.js` and `node-adapter.mjs` (local harness).
- **Sources read** (`K-src/`):
  - Codex login source (`device_code_auth.rs`, `server.rs`, `lib.rs` from `openai/codex@main`)
  - the openai-node README
- **pi-ai packages** (grep only, nothing executed): `K-dl-piai/` and `K-dl-piai2/`.
