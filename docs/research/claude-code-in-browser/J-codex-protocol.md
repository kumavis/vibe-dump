# J — Codex subscription mode: the Codex CLI's ChatGPT-plan auth and wire protocol, and an Anthropic→Responses translation design

Research agent J, 2026-10-28. Scope: the auth and wire protocol of the OpenAI Codex CLI in ChatGPT-plan mode, taken from primary sources, plus the design for translating inside the Worker. CORS and terms are agent K's slice and are only flagged here.

Tags: **VERIFIED** means read in primary source (Codex Rust source at the commit below, OpenAI's own SDK typings, OpenAI developer docs, or a request captured from Claude Code 2.1.311 in this sandbox). **INFERRED** means reasoned from secondary sources (third-party clients) or from names, and not exercised against the real backend. No real ChatGPT token was available, so nothing was sent to OpenAI.

---

## 0. Key findings

1. **There are two ways to put a ChatGPT plan behind the translator, and they share one wire format (the Responses API).**
   - **Route A, the Codex CLI's own path (what was asked for).** Use `~/.codex/auth.json` from `codex login`, then call `POST https://chatgpt.com/backend-api/codex/responses` with `Authorization: Bearer <access_token>` and `ChatGPT-Account-ID`. This backend is undocumented and unversioned.
   - **Route B, "Sign in with ChatGPT" token sharing (OpenAI's documented path for third-party apps, launched Sept 2026).** OAuth with dynamic client registration and scope `chatgpt.tokens.use.direct`, then call `POST https://api.openai.com/v1/responses` with a plain bearer token. OpenAI's SIWC docs explicitly say **not** to point this flow at `backend-api`.
   - Build the translator to the stricter Route B subset (`store:false`, `stream:true`, no `max_output_tokens`/`temperature`/`metadata`, no `role:"system"` items). It then works for both routes. **Recommendation: offer B as the primary "ChatGPT subscription" option and A as "Use my Codex CLI login (advanced)".** Agent K must check CORS on `api.openai.com/v1/responses`, `auth.openai.com/api/accounts/oauth/token`, `chatgpt.com/backend-api/codex/*` and `auth.openai.com/oauth/token`, and the terms for each route.
2. **The current Codex CLI (0.165.0) no longer sends `instructions`.** Its base prompt goes in as a leading `developer` message. It prefers **Responses-over-WebSocket** and falls back to HTTP SSE. Browsers cannot put `Authorization` on a WebSocket, so the Worker must use HTTP SSE. That is a supported fallback.
3. **Newer catalog models (gpt-5.6-\*, gpt-6\*) are flagged `use_responses_lite: true` / `tool_mode: code_mode_only` in Codex's bundled catalog.** For those, Codex sends tools inside an `additional_tools` developer input item rather than top-level `tools`. Only `gpt-5.5` (marked "Legacy coding model") uses the classic shape. Third-party clients (pi-ai) send classic top-level `tools` to gpt-5.6/gpt-6 on the Codex backend, and OpenAI's SIWC docs use `gpt-6.1-sol` on the public API. So the classic shape is very likely accepted (INFERRED; first thing to test with a real token).
4. **Refresh tokens rotate, and reuse is detected (`refresh_token_reused`).** If the page refreshes with a refresh token copied from the user's CLI `auth.json`, one of the two copies dies. The CLI then reports "Your access token could not be refreshed because your refresh token was already used". To avoid this, have the user mint a dedicated login (`CODEX_HOME=<new dir> codex login`), or let the page use the access token only until it expires.
5. **Identity:** Codex sends `originator: codex_cli_rs` plus a `codex_cli_rs/<ver> (...)` User-Agent and a `version: <cli version>` header. Under the policy posture, the page must **not** copy those. pi-ai sends `originator: pi` and says "Codex expects an originator on every request". An honest `originator: claude-code-web` is therefore probably required on Route A and probably accepted (INFERRED). Route B needs no originator and no account header. The optional `x-oai-attestation` header is supplied only by attestation-capable app-server hosts; the plain CLI does not send it.
6. **Claude Code 2.1.311's real request** (captured here, §7.1) includes **`role:"system"` messages inside `messages`**, `thinking:{type:"adaptive",display:"omitted"}`, `output_config:{effort}`, `context_management`, `metadata.user_id` (device id), `cache_control` with `ttl:"1h"`, a `DeferredToolPlaceholder` tool with `defer_loading`, and the `x-anthropic-billing-header` system line. The translator must handle all of these (§7).
7. **Reuse:** pi-ai (`@earendil-works/pi-ai`, MIT) has the cleanest browser-friendly Codex SSE client (plain `fetch`, `TextDecoder`, `atob`). CLIProxyAPI (Go, MIT) has the most complete Claude↔Codex translator to copy *designs* from. Neither speaks Anthropic SSE out of the box in a browser. A purpose-built ~700-line translator in the Worker is the right size (§8).

---

## 1. Sources

| source | version / commit | licence | how used |
|---|---|---|---|
| `openai/codex` (git, shallow) | `7ac6081623928adead75caa2882e307444edad82`, 2026-10-28 02:54 UTC | Apache-2.0 (VERIFIED, npm + repo `LICENSE`) | read only, never built or run; at `<scratchpad>/research/codex-src/repo/` |
| npm `@openai/codex` | 0.165.0 (latest), modified 2026-10-27 | Apache-2.0 | `npm view` |
| OpenAI developer docs, Sign in with ChatGPT | fetched 2026-10-28 | — | `developers.openai.com/siwc/...` |
| npm `openai` (official Node SDK) | 7.45.1 | Apache-2.0 | typings for Responses stream events, at `<scratchpad>/research/openai-sdk/x/` |
| npm `@earendil-works/pi-ai` (successor of the deprecated `@mariozechner/pi-ai`) | 1.4.0, 2026-10-21 | MIT | at `<scratchpad>/research/pi-ai-pkg/x/` |
| `router-for-me/CLIProxyAPI` (git, shallow) | `ad8bdd3f`, 2026-10-27 | MIT | at `<scratchpad>/research/J-others/cliproxyapi/` |
| npm `opencode-openai-codex-auth` | 4.4.0, 2026-01-09 | MIT | at `<scratchpad>/research/J-others/occa/x/` |
| Claude Code 2.1.311 request capture | this session | (Anthropic's; not redistributed) | `<scratchpad>/research/J-capture/bodies.jsonl`: spike-E's Node runner with a fake token, aimed at a logging proxy in front of `packages/claude-code-web/mock/mock-api.mjs` (proxy script: `<scratchpad>/research/J-scripts/logproxy.mjs`) |

Paths below are relative to `codex-rs/` unless noted.

---

## 2. The npm package (VERIFIED, `npm view`)

- `@openai/codex@0.165.0`: `bin: {codex: "bin/codex.js"}`, 3 files, 13 KB unpacked. It is only a Node launcher (`codex-cli/bin/codex.js`) that picks a platform package by target triple and spawns its binary.
- The real binaries come as `optionalDependencies` aliased to the same package name at platform versions: `@openai/codex-linux-x64 → npm:@openai/codex@0.165.0-linux-x64` (and darwin-x64/arm64, linux-arm64, win32-x64/arm64). The linux-x64 one is 445,947,042 bytes unpacked, 45 files, `os:["linux"]`, `cpu:["x64"]`. These are native Rust executables (`x86_64-unknown-linux-musl`, etc.). **Nothing in them is runnable in a browser**, and nothing from the package is needed: the protocol is reimplemented.
- Dist-tags show weekly releases plus `alpha` (0.166.0-alpha.3). The protocol drifts quickly (WebSocket v2, responses-lite and session headers all changed in 2026), so pin what we test against and keep the translator tolerant.

---

## 3. Auth

### 3a. `~/.codex/auth.json` (VERIFIED)

`login/src/auth/storage.rs`:

```rust
/// Expected structure for $CODEX_HOME/auth.json.
pub struct AuthDotJson {
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub auth_mode: Option<AuthMode>,
    #[serde(rename = "OPENAI_API_KEY")]
    pub openai_api_key: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tokens: Option<TokenData>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_refresh: Option<DateTime<Utc>>,
    // also optional: agent_identity, personal_access_token, bedrock_api_key, bedrock_access_keys
}
```

`login/src/token_data.rs`:

```rust
pub struct TokenData {
    /// Flat info parsed from the JWT in auth.json.   (serialized back as the raw JWT string)
    pub id_token: IdTokenInfo,
    /// This is a JWT.
    pub access_token: String,
    pub refresh_token: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub oauth_provenance: Option<AccountOAuthProvenance>,   // {issuer, client_id}
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub login_owner_id: Option<String>,
    pub account_id: Option<String>,
}
```

`AuthMode` is `#[serde(rename_all = "lowercase")]` with `ApiKey`, `Chatgpt`, and renamed `chatgptAuthTokens`, `headers`, `agentIdentity`, `personalAccessToken`, `bedrockApiKey`, `bedrockAccessKeys` (`protocol/src/auth.rs`). A fresh browser login therefore writes (`login/src/server.rs::persist_tokens_async`):

```json
{
  "auth_mode": "chatgpt",
  "OPENAI_API_KEY": null,
  "tokens": {
    "id_token": "<JWT>",
    "access_token": "<JWT>",
    "refresh_token": "<opaque>",
    "oauth_provenance": {"issuer": "https://auth.openai.com", "client_id": "app_EMoamEEZ73f0CkXaXp7hrann"},
    "login_owner_id": "<random base64url>",
    "account_id": "<chatgpt_account_id>"
  },
  "last_refresh": "2026-10-28T12:34:56.789Z"
}
```

`OPENAI_API_KEY` is filled only if the post-login token exchange `obtain_api_key` succeeded (see 3b). Older files lack `auth_mode`, `oauth_provenance` and `login_owner_id`, so the parser must accept both shapes.

**Where the file is.** It is `$CODEX_HOME/auth.json` (default `~/.codex`). It exists only when `cli_auth_credentials_store` is `file`, which is the default (`config/src/types.rs`: `#[default] File`). With `keyring` there is no file, and with `auto` there is a file only when the keyring is unavailable. The paste UI must say "if you have no auth.json, run `codex login` with `cli_auth_credentials_store = "file"`".

**`account_id` derivation (VERIFIED, `server.rs` lines 857–871).** At login: `tokens.account_id = jwt_auth_claims(&id_token).get("chatgpt_account_id")`, the claim object `"https://api.openai.com/auth"` of the **id_token**. `token_data.rs` parses the same claim object:

```rust
struct IdClaims { email, #[serde(rename = "https://api.openai.com/profile")] profile,
                  #[serde(rename = "https://api.openai.com/auth")] auth: Option<AuthClaims> }
struct AuthClaims { chatgpt_plan_type, chatgpt_user_id, user_id, chatgpt_account_id, chatgpt_account_is_fedramp }
```

The access token carries the same claim object: Codex reads `chatgpt_account_id` and `chatgpt_account_user_id` from it in `parse_chatgpt_account_user_id`, and pi-ai takes the account id from the access token at `payload["https://api.openai.com/auth"].chatgpt_account_id`. **Page rule:** prefer `tokens.account_id`, else the id_token claim, else the access-token claim.

**Token lifetime and when Codex refreshes (VERIFIED, `login/src/auth/manager.rs`).**

```rust
const TOKEN_REFRESH_INTERVAL: i64 = 8;                       // days
const CHATGPT_ACCESS_TOKEN_REFRESH_WINDOW_MINUTES: i64 = 5;
fn proactive_refresh_reason(auth) -> Option<RefreshReason> {
    if let Ok(Some(expires_at)) = parse_jwt_expiration(&tokens.access_token) {
        return (expires_at <= now + 5min).then_some(ProactiveExpiry);
    }
    let last_refresh = auth_dot_json.last_refresh?;
    (last_refresh < now - 8 days).then_some(Scheduled)
}
```

Codex refreshes when the access-token JWT `exp` is within 5 minutes. If `exp` cannot be read, it refreshes when `last_refresh` is older than 8 days. On an HTTP 401 it runs `UnauthorizedRecovery`: reload `auth.json` from disk, then refresh, then retry. The source fixes no lifetime; the page must read `exp` from the JWT. (Route B documents 1 h access tokens and 30-day rotating refresh tokens, §3c.)

**Refresh request (VERIFIED: `manager.rs` `request_chatgpt_token_refresh` and `oauth/client.rs`).**

```
POST https://auth.openai.com/oauth/token      (or {oauth_provenance.issuer}/oauth/token; env override CODEX_REFRESH_TOKEN_URL_OVERRIDE)
Content-Type: application/json                // "ChatGPT refresh uses JSON; authorization-code and gateway grants use form encoding."
originator: codex_cli_rs   User-Agent: codex_cli_rs/...   (Codex's default client headers; the page sends its own, see §4)

{"client_id":"app_EMoamEEZ73f0CkXaXp7hrann","grant_type":"refresh_token",
 "refresh_reason":"proactive_expiry|scheduled|unauthorized_recovery|forced","refresh_token":"<rt>"}
```

Response: `struct RefreshResponse { id_token: Option<String>, access_token: Option<String>, refresh_token: Option<String> }`. Codex replaces whichever fields are present and sets `last_refresh = now`. A 401, or error codes `refresh_token_expired` / `refresh_token_reused` / `refresh_token_invalidated`, or `invalid_grant` on a 400, is permanent and the user must log in again. Any other status is transient. pi-ai sends the same grant **form-encoded**, without `refresh_reason` (`auth/oauth/openai-codex.js`), and it works for them, so either encoding is accepted (INFERRED). **The rotation conflict in §0.4 applies.**

`CLIENT_ID` = `"app_EMoamEEZ73f0CkXaXp7hrann"` (`manager.rs` line 1794; env override `CODEX_APP_SERVER_LOGIN_CLIENT_ID`).

### 3b. The Codex OAuth login flow (VERIFIED; for documentation, not needed when the user pastes `auth.json`)

`login/src/server.rs`, `login/src/oauth/{authorization,pkce,client}.rs`:

- Issuer `https://auth.openai.com`. Local callback server on **`127.0.0.1:1455`** (fallback port 1457, "keep in sync with the Codex CLI Hydra redirect URI allow-list"). `redirect_uri = http://127.0.0.1:{port}/auth/callback`.
- `GET https://auth.openai.com/oauth/authorize?response_type=code&client_id=app_EMoamEEZ73f0CkXaXp7hrann&redirect_uri=…&code_challenge=…&code_challenge_method=S256&state=…&scope=openid profile email offline_access api.connectors.read api.connectors.invoke&id_token_add_organizations=true&codex_cli_simplified_flow=true&originator=codex_cli_rs` (plus optional `allowed_workspace_id`, `current_workspace_id`, `login_hint`, `connection`).
- PKCE: 64 random bytes → base64url verifier; S256 challenge. `state`: 32 random bytes, base64url.
- Code exchange: `POST {issuer}/oauth/token`, **form-encoded** `grant_type=authorization_code&client_id&code&redirect_uri&code_verifier`. The response is `{id_token, access_token, refresh_token}`.
- It then attempts `obtain_api_key`, an RFC 8693 token exchange: `grant_type=urn:ietf:params:oauth:grant-type:token-exchange&client_id&requested_token=openai-api-key&subject_token=<id_token>&subject_token_type=urn:ietf:params:oauth:token-type:id_token`. The result goes into `OPENAI_API_KEY`. It is best effort (`.ok()`).
- **Device code alternative** (`login/src/device_code_auth.rs`, `codex login --device-auth`): `POST {issuer}/api/accounts/deviceauth/usercode` with `{"client_id"}` returns `{device_auth_id, user_code, interval}`. The user opens `{issuer}/codex/device`. The client polls `POST {issuer}/api/accounts/deviceauth/token` with `{device_auth_id, user_code}` (403/404 means pending, 15 min max) and gets `{authorization_code, code_challenge, code_verifier}`. That is exchanged at `/oauth/token` with `redirect_uri = {issuer}/deviceauth/callback`. Device auth needs no loopback server, so it is the only Codex login a pure web page could in principle drive. It still needs CORS on `auth.openai.com/api/accounts/*` (agent K) and is still Codex's client id, so it is not recommended. `codex login --with-api-key` / `--with-access-token` also exist (`cli/src/main.rs`).

### 3c. Route B: "Sign in with ChatGPT" token sharing (VERIFIED from OpenAI docs; refresh body from pi-ai)

From `developers.openai.com/siwc/token-sharing-open-source/{sign-in,token-reference,models-and-inference,preview-limitations,errors-and-recovery}`:

- Authorize: `https://auth.openai.com/api/accounts/authorize`. Token: `https://auth.openai.com/api/accounts/oauth/token` (form-encoded).
- First registration uses `client_id=dynamic_agent_client`. The callback returns the issued `client_id` (`oaiapp_…`), which must be saved and reused. No client secret.
- Parameters: `agent_name_hint` (first registration only, "display metadata, not identity"); **`ext_agent_host_id` required** (`urn:uuid:…` supported, JWK-thumbprint URN recommended); `id_token_hint` / `login_hint` optional; `response_type=code`; `scope=openid profile email offline_access resource.invoke chatgpt.tokens.use.direct`; `resource=https://api.openai.com/v1`; `state`; `nonce`; PKCE S256.
- **Redirect must be an HTTP loopback on `127.0.0.1`**, e.g. `http://127.0.0.1:1455/auth/callback`. Only the port may vary, and the docs say "Do not substitute with `localhost`". A page cannot listen there. pi-ai's workaround is to let the browser fail to load the loopback URL and have the user **paste the final redirect URL** (`authorizationResultFromManualInput`). The docs do not describe that, so it is INFERRED to be acceptable.
- Code exchange: `grant_type=authorization_code&client_id=<issued>&code&code_verifier&redirect_uri&resource=https://api.openai.com/v1`. Refresh (pi-ai): `grant_type=refresh_token&client_id=<issued>&refresh_token&resource=https://api.openai.com/v1`.
- Token response: `access_token, refresh_token, id_token, token_type, expires_in, scope, earliest_refresh_at`. Access token 1 h (`expires_in: 3600`). Refresh token 30 days, rotating on every refresh. Access-token JWT `aud` is `https://api.openai.com/v1`.
- Inference: `POST https://api.openai.com/v1/responses` with `Authorization: Bearer <access>`. Models: `GET https://api.openai.com/v1/models`, which returns `{models:[…]}`; filter `visibility=="list"` and use `slug` / `display_name`. "`store: false` and `stream: true` on each HTTP inference request."
- Preview limitations: omit `background, conversation, max_output_tokens, max_tool_calls, metadata, moderation, multi_agent, prompt, prompt_cache_retention, safety_identifier, temperature, top_logprobs, top_p, truncation, user`. Omit `previous_response_id` over HTTP. **"Explicit `{type:"message", role:"system"}` items are rejected; use `instructions` or developer messages."** No image generation, file search, code interpreter, computer use, hosted MCP or `tool_search`.
- Eligibility (from the overview page): "These docs explain ChatGPT plan usage for open-source and locally hosted apps. If you're interested in offering it in a paid or remotely hosted app, complete the interest form." Whether a static GitHub Pages app whose code runs only in the user's browser counts as "locally hosted" is **agent K's question**.

---

## 4. The inference endpoint and headers (Route A) (VERIFIED unless marked)

**Base URL** (`model-provider-info/src/lib.rs::to_api_provider`):

```rust
let default_base_url = if matches!(auth_mode, Some(AuthMode::Chatgpt | AuthMode::ChatgptAuthTokens
        | AuthMode::Headers | AuthMode::AgentIdentity | AuthMode::PersonalAccessToken)) {
    CHATGPT_CODEX_BASE_URL            // "https://chatgpt.com/backend-api/codex"
} else { "https://api.openai.com/v1" };
```

The streaming endpoint is `POST {base}/responses` (`codex-api/src/endpoint/responses.rs`), so ChatGPT-plan users get **`https://chatgpt.com/backend-api/codex/responses`** and API-key users get `https://api.openai.com/v1/responses`. Other backend paths: `GET {base}/models?client_version=<x.y.z>` (`codex-api/src/endpoint/models.rs`); usage status `GET https://chatgpt.com/backend-api/wham/usage` (`backend-client/src/client/rate_limit_resets.rs`); FedRAMP accounts get `X-OpenAI-Fedramp: true`.

**Headers on `POST /codex/responses`** (union of `login/src/auth/default_client.rs::default_headers`, `create_openai_provider`, `bearer_auth_provider.rs`, `core/src/client.rs::build_responses_options`, `codex-api/src/requests/headers.rs`, `responses_metadata.rs::compatibility_headers`):

| header | value in Codex | page should send |
|---|---|---|
| `Authorization` | `Bearer <tokens.access_token>` | same |
| `chatgpt-account-id` (const `CHATGPT_ACCOUNT_ID_HEADER`) | `tokens.account_id` | same (Route A only) |
| `originator` | `codex_cli_rs` (`DEFAULT_ORIGINATOR`; `codex-tui`, `codex_vscode`, `Codex …` are other first-party values) | **`claude-code-web`** (honest; never `codex_cli_rs`). pi-ai sends `pi` |
| `User-Agent` | `codex_cli_rs/0.165.0 (<os> <ver>; <arch>) <terminal>` | the browser's own (Chrome won't let fetch override it anyway) |
| `version` | the CLI's `CARGO_PKG_VERSION` (provider `http_headers`) | omit. Gating by version is unknown (INFERRED) |
| `Accept` | `text/event-stream` | same |
| `Content-Type` | `application/json` | same |
| `Content-Encoding` | `zstd` (feature `enable_request_compression`, Stable, default on, only for Codex-backend auth) | omit (browsers have no zstd `CompressionStream`; pi-ai skips it in browsers) |
| `session-id` | session-derived cache key (root session UUID); "ChatGPT derives cache affinity from the Responses session-id header" | Claude Code's session id (`x-claude-code-session-id` / `metadata.user_id.session_id`) |
| `thread-id` | thread UUID | same value |
| `x-client-request-id` | thread id | same value |
| `x-codex-window-id`, `x-codex-turn-metadata`, `x-codex-parent-thread-id`, `x-openai-subagent`, `x-codex-beta-features`, `x-codex-routing-hint`, `x-openai-memgen-request`, `x-openai-internal-codex-responses-lite` | Codex-internal telemetry, routing and feature headers | omit |
| `x-codex-turn-state` | echoed back from the previous response's `x-codex-turn-state` header (sticky routing within a turn) | optional: echo it if present and exposed by CORS |
| `x-oai-attestation` | only from an "attestation-capable" app-server connection, 100 ms timeout (`app-server/src/attestation.rs`). The plain CLI sends none | omit |
| `OpenAI-Beta` | **not** sent on HTTP. On WebSocket: `responses_websockets=2026-02-06` | omit. pi-ai sends `responses=experimental` on SSE (legacy, harmless) |
| `x-openai-actor-authorization`, `X-OpenAI-Fedramp` | special cases | omit / FedRAMP only |

The older underscore spellings `session_id` and `conversation_id` (used by opencode-openai-codex-auth and CLIProxyAPI tests) are superseded by `session-id` / `thread-id` in current source.

**Transport (VERIFIED).** The OpenAI provider has `supports_websockets: true`, and every catalog model has `prefer_websockets: true`. `core/src/client.rs`: "WebSocket fallback is session-scoped: once a turn activates the HTTP fallback, subsequent turns [use HTTP]". HTTP SSE is a first-class fallback, and it is the only option in a browser, since `new WebSocket()` cannot set `Authorization`. Retries: `request_max_retries` 4 (5xx and transport only, `retry_429: false`), `stream_max_retries` 5, `stream_idle_timeout` 300 s.

**Identity and attestation checks (§2f).** The source shows only client-side identity: `originator`, User-Agent, `version`, the optional `x-oai-attestation`, and Cloudflare cookies. `http-client/src/chatgpt_cloudflare_cookies.rs` keeps "only Cloudflare infrastructure cookies and the `__oailb` routing cookie". What the server enforces cannot be read from client source. The evidence:
- pi-ai (current, Oct 2026) works with `originator: pi`, its own UA (`pi/<ver> (browser)` in a browser) and no `version` header.
- CLIProxyAPI spoofs a `codex-tui/0.154.0 (Mac OS …)` UA in its legacy mode. That is a reason **not** to copy it, not evidence that spoofing is required.
- An unknown `originator` is therefore very likely accepted (INFERRED).

`api_bridge.rs` maps a 403 whose body mentions Cloudflare and "blocked" to "Access blocked by Cloudflare. This usually happens when connecting from a restricted region". Browser requests from a `github.io` Origin through Cloudflare are agent K's to probe.

---

## 5. Request body (VERIFIED: `codex-api/src/common.rs`, `core/src/client.rs::build_responses_request`)

```rust
pub struct ResponsesApiRequest {
    pub model: String,
    pub stream: bool,                                  // always true
    pub service_tier: Option<String>,                  // e.g. "priority" ("Fast", more usage)
    pub input: Vec<ResponseItem>,
    pub tools: Option<ResponsesApiTools>,              // None for responses-lite models
    pub tool_choice: String,                           // always "auto"
    pub parallel_tool_calls: bool,
    pub reasoning: Option<Reasoning>,                  // {effort, summary?, context?}
    pub store: bool,                                   // always false
    pub stream_options: Option<StreamOptions>,         // Codex feature only
    pub include: Vec<String>,                          // ["reasoning.encrypted_content"] (+ "output.encrypted_content")
    pub prompt_cache_key: Option<String>,              // session-derived
    pub text: Option<TextControls>,                    // {verbosity: low|medium|high, format?: json_schema}
    pub client_metadata: Option<HashMap<String,String>>, // x-codex-installation-id, session/thread/turn ids
    pub access_programs: Option<AccessPrograms>,       // {cyber: standard|daybreak_blue|daybreak_red}
}
```

There is **no `instructions` and no `max_output_tokens` field.** The base prompt is spliced in as the first input item:

```rust
if !prompt.base_instructions.text.is_empty() {
    let mut instructions = ContextualUserFragment::into(BaseInstructionsFragment(prompt.base_instructions.text.clone()));
    ... prefix.push(instructions);           // role "developer", content [input_text], kind "model.base_instructions"
}
input.splice(0..0, prefix);
```

Third parties still send top-level `instructions` and it works: pi-ai sends `instructions: <system prompt> || "You are a helpful assistant."`, and the SIWC docs allow it. The early-2025 requirement that `instructions` equal Codex's own prompt is gone. opencode-openai-codex-auth (Jan 2026) still fetches Codex's prompt from GitHub releases, while pi-ai (Oct 2026) sends arbitrary text (INFERRED from the two clients).

**`ResponseItem` wire shapes** (`protocol/src/models.rs`, `#[serde(tag="type", rename_all="snake_case")]`):

```jsonc
{"type":"message","role":"user|assistant|developer","content":[{"type":"input_text","text":"…"}
   | {"type":"input_image","image_url":"data:…"|"https…","detail":"auto|low|high|original"}
   | {"type":"output_text","text":"…"}], "id"?: "msg_…", "phase"?: "commentary|final_answer"}
{"type":"reasoning","id":"rs_…","summary":[{"type":"summary_text","text":"…"}],"encrypted_content":"…"}
{"type":"function_call","id"?: "fc_…","call_id":"call_…","name":"…","namespace"?: "…","arguments":"<JSON string>"}
{"type":"function_call_output","call_id":"call_…","output":"<string>" | [{"type":"input_text","text"} | {"type":"input_image","image_url"}]}
{"type":"custom_tool_call", "call_id","name","input":"<freeform>"} / {"type":"custom_tool_call_output", …}
{"type":"additional_tools","role":"developer","tools":[ …namespace "functions" … ]}     // responses-lite only
// also local_shell_call, web_search_call, tool_search_call/output, image_generation_call, compaction, configuration_update
```

Codex replays server item ids that look like `prefix_suffix` (`ResponseItemId::is_prefixed`) and drops others (`prepare_response_items_for_request`).

**Tools** (`tools/src/tool_spec.rs`, `responses_api.rs`): `{"type":"function","name","description","strict":false,"parameters":<JSON Schema>, "defer_loading"?:true}`. **`strict` is always `false`** for MCP and dynamic tools (`tool_definition_to_responses_api_tool`). Other kinds: `namespace`, `tool_search`, `web_search`, `custom` (freeform/grammar, used for `apply_patch` with `apply_patch_tool_type: "freeform"`). Schemas pass through `sanitize_json_schema`: boolean schemas become `{type:string}`, `const` becomes `enum`, a missing `type` is inferred, objects get `properties:{}`, and `$defs`/`$ref`/`anyOf`/`oneOf`/`allOf` are kept. Large schemas are compacted. Names must match `^[a-zA-Z0-9_-]+$` (`codex-mcp/src/mcp/mod.rs`). CLIProxyAPI clamps names and call_ids to 64 characters with a hash suffix.

**Reasoning** (`build_reasoning`): `effort` = requested or the model default, clamped by `resolve_reasoning_effort`. `summary` (`auto|concise|detailed`) only if the model `supports_reasoning_summary_parameter` and the summary is not `none`. Catalog default is `"none"`, so the CLI omits it by default. `context:"all_turns"` only for responses-lite models. Effort values (`protocol/src/openai_models.rs`): `none, minimal, low, medium, high, xhigh, max, ultra, persistent, <custom>`. The OpenAI SDK's public type is `'none'|'minimal'|'low'|'medium'|'high'|'xhigh'|'max'`.

**Models valid for ChatGPT-plan users.** The models endpoint is `GET https://chatgpt.com/backend-api/codex/models?client_version=0.165.0`, returning `{"models":[ModelInfo…]}` plus an `ETag` (Route B: `GET https://api.openai.com/v1/models`). The bundled fallback is `models-manager/models.json`, 12 entries, all with `available_in_plans` including `free, go, plus, pro, prolite, promax, team, business, enterprise, edu, …`:

| slug | visibility | default effort | efforts | context | responses-lite | tool_mode | min client |
|---|---|---|---|---|---|---|---|
| gpt-6.1-sol | list (prio 1) | low | low…max, ultra | 272k | yes | code_mode_only | 0.153.0 |
| gpt-6-astra | list (2) | low | low…ultra | 272k | yes | code_mode_only | 0.153.0 |
| gpt-6-sol | list (3) | medium | low…ultra | 272k | yes | code_mode_only | 0.155.0 |
| gpt-6-luna | list (4) | medium | low…max | 272k | yes | code_mode_only | 0.155.0 |
| gpt-5.6-sol / -terra / -luna | list (5/8/9) | low/medium/medium | … | 272k | yes | code_mode_only | 0.144.0 |
| gpt-6.1-terra | list (7) | low | low…ultra | 500k | yes | code_mode_only | 0.153.0 |
| **gpt-5.5** | list (13), "Legacy coding model" | medium | low, medium, high, xhigh | 272k | **no** | (direct) | 0.124.0 |
| gpt-daybreak-blue/red-latest, codex-auto-review | hide | | | | | | |

All have `input_modalities: ["text","image"]` and `supports_parallel_tool_calls: true`. The page should fetch the live list (it changes weekly) and fall back to a small static list. `minimal_client_version` implies the server filters the catalog by `client_version` (INFERRED). With an honest client version, or none, the live list may be shorter, and that should be tested.

---

## 6. Streaming response (VERIFIED: `codex-api/src/sse/responses.rs`; field shapes from OpenAI's SDK typings, `openai@7.45.1 resources/responses/responses.d.ts`)

Codex parses SSE `data:` lines as `{type, response?, item?, item_id?, call_id?, delta?, text?, summary_index?, content_index?, error?, headers?, metadata?}`.

| event | fields (SDK typings) | Codex handling |
|---|---|---|
| `response.created` | `response{id,status:"in_progress",model,…}`, `sequence_number` | `Created{response_id}` |
| `response.in_progress`, `response.metadata`, `codex.response.metadata` | | ignored. `response.metadata` may carry `headers` (`OpenAI-Model`), `openai_verification_recommendation`, moderation metadata |
| `response.output_item.added` | `item`, `output_index` | `OutputItemAdded(item)` |
| `response.content_part.added` / `.done` | `item_id, output_index, content_index, part` | ignored |
| `response.output_text.delta` | `item_id, output_index, content_index, delta, logprobs` | `OutputTextDelta(delta)` |
| `response.output_text.done` | `…, text` | ignored |
| `response.function_call_arguments.delta` / `.done` | `item_id, output_index, delta` / `arguments` | **ignored**: Codex uses the complete `function_call` in `output_item.done` |
| `response.custom_tool_call_input.delta` | `item_id, call_id, delta` | `ToolCallInputDelta` |
| `response.reasoning_summary_part.added` | `summary_index` | `ReasoningSummaryPartAdded` |
| `response.reasoning_summary_text.delta` / `.done` | `item_id, output_index, summary_index, delta` / `text` | `ReasoningSummaryDelta/Done` |
| `response.reasoning_text.delta` | `content_index, delta` | raw reasoning (rare) |
| `response.output_item.done` | `item` (message / reasoning with `encrypted_content` / function_call with `call_id,name,arguments`) | `OutputItemDone(item)` |
| `response.completed` | `response{id, status:"completed", output[], usage, end_turn?}` | `Completed{usage}`, end of stream |
| `response.incomplete` | `response.incomplete_details.reason ∈ max_output_tokens \| max_messages \| content_filter \| steered` (plus `"interrupted"` in Codex) | content_filter becomes `ContentFilter`; `interrupted` is treated as completed with `end_turn:false`; anything else becomes `ResponseIncomplete{reason, usage}` |
| `response.failed` | `response.error{code, message}` | error (see below) |
| `error` | `{code, message, param, sequence_number}` | terminal provider error |

Usage (VERIFIED, Rust struct and SDK):

```rust
struct ResponseCompletedUsage { input_tokens: i64, input_tokens_details: Option<{cached_tokens, cache_write_tokens}>,
                                output_tokens: i64, output_tokens_details: Option<{reasoning_tokens}>, total_tokens: i64,
                                codex_rollout_budget_units: Option<Number> }
```

`input_tokens` **includes** `cached_tokens`.

Response headers Codex reads: `x-request-id` / `x-oai-request-id`, `cf-ray`, `openai-model` (can differ when safety routing applies), `x-reasoning-included`, `x-codex-turn-state`, `X-Models-Etag`, and the rate-limit family (`codex-api/src/rate_limits.rs`): `x-codex-primary-used-percent`, `x-codex-primary-window-minutes`, `x-codex-primary-reset-at`, the same for `secondary`, `x-codex-limit-name`, `x-codex-credits-has-credits|unlimited|balance`, `x-codex-active-limit`, `x-codex-promo-message`, `x-codex-rate-limit-reached-type`, plus other `x-<limit-id>-…` families. Over WebSocket the same arrives as a `codex.rate_limits` event. Most of these headers are unreadable cross-origin unless CORS exposes them (agent K).

**Errors** (`api_bridge.rs`):
- **429** with body `{"error":{"type":"usage_limit_reached","plan_type","resets_at":<unix s>,"limit_window_minutes"}}` means the plan limit was hit. `usage_not_included` means the plan doesn't include Codex. `insufficient_quota` and similar mean quota exceeded. Codex does **not** retry 429.
- **401**: refresh and retry once. **400**: `cyber_policy`, `bio_policy`, `invalid_prompt`, `misalignment_policy_violation`, else "invalid request". **503**: `server_is_overloaded`, `slow_down`, `policy_capacity_unavailable`. **403** mentioning Cloudflare: region block.
- Mid-stream `response.failed` codes seen in Codex tests: `rate_limit_exceeded` ("Please try again in 11.054s"), `context_length_exceeded`, `insufficient_quota`, `server_is_overloaded`, `cyber_policy`, `misalignment_policy_violation`.
- Route B adds structured `error.code`s: `subscription_sharing_usage_limit_exceeded` (429), `subscription_sharing_usage_unavailable` (503), `subscription_sharing_unsupported_capability` (400, see `error.param`), `subscription_sharing_user_not_eligible` (403), `subscription_sharing_invalid_user` (401), `chatpass_v2_*` (403). Before the stream opens, the body may instead be `{"detail":"…"}`.

---

## 7. Translation design (Anthropic Messages ⇄ Responses, in the Worker)

### 7.1 What Claude Code 2.1.311 actually sends (VERIFIED, captured)

`POST {ANTHROPIC_BASE_URL}/v1/messages?beta=true`. Body keys, in order: `model, messages, system, tools, metadata, max_tokens, thinking, context_management, output_config, stream`. From the capture:

```jsonc
{
  "model": "claude-sonnet-5-5",
  "max_tokens": 128000,
  "stream": true,
  "thinking": {"type": "adaptive", "display": "omitted"},
  "output_config": {"effort": "medium"},
  "context_management": {"edits": [{"type": "clear_thinking_20251015", "keep": "all"}]},
  "metadata": {"user_id": "{\"device_id\":\"<64 hex>\",\"account_uuid\":\"\",\"session_id\":\"<uuid>\"}"},
  "system": [
    {"type":"text","text":"x-anthropic-billing-header: cc_version=2.1.311.5b3; cc_entrypoint=sdk-cli;…"},
    {"type":"text","text":"You are a Claude agent, built on Anthropic's Claude Agent SDK.","cache_control":{"type":"ephemeral","ttl":"1h"}},
    {"type":"text","text":"\nYou are an agent working with the user …(5.8 k chars)","cache_control":{"type":"ephemeral","ttl":"1h"}}
  ],
  "messages": [
    {"role":"user","content":[{"type":"text","text":"<system-reminder>…"},{"type":"text","text":"write a file"}]},
    {"role":"system","content":"# Environment\n…(9.5 k chars)"},            // mid-conversation system message (string or blocks)
    {"role":"assistant","content":[{"type":"tool_use","id":"toolu_…","name":"Write","input":{…}}]},
    {"role":"user","content":[{"type":"tool_result","tool_use_id":"toolu_…","content":"File created …"}]},
    {"role":"system","content":[{"type":"text","text":"<total_tokens>…","cache_control":{"type":"ephemeral","ttl":"1h"}}]}
  ],
  "tools": [ {"name":"Write","description":"…","input_schema":{"$schema":"https://json-schema.org/draft/2020-12/schema","type":"object",
               "properties":{…},"required":[…],"additionalProperties":false}},
             {"name":"DeferredToolPlaceholder","description":"Reserved placeholder … never call this tool.",
               "input_schema":{"type":"object","properties":{}},"defer_loading":true}, … ]
}
```

Headers: `anthropic-beta: claude-code-20250219,oauth-2025-04-20,interleaved-thinking-2025-05-14,context-management-2025-06-27,per-turn-control-2026-07-01,mid-conversation-tool-changes-2026-07-01,thinking-token-count-2026-05-13,advanced-tool-use-2025-11-20,effort-2025-11-24,extended-cache-ttl-2025-04-11`, `x-claude-code-session-id`, `anthropic-dangerous-direct-browser-access: true`. JSON Schema keywords used across the 14 tools in this capture: `type, description, properties, required, additionalProperties, $schema, enum, maxLength, pattern, minimum, maximum, exclusiveMinimum, default, items, maxItems`. All are acceptable to non-strict Responses function tools once `$schema` is stripped. The harness also makes side requests: `max_tokens:1` probes such as `api_key_verify` and `quota_check` with `stream` unset, plus `POST /v1/messages/count_tokens`.

### 7.2 Where it plugs in

- In Codex mode, start the harness with `ANTHROPIC_BASE_URL=<synthetic origin>` (for example `https://codex-adapter.invalid`) and a dummy `ANTHROPIC_API_KEY`. This is the documented "LLM gateway" pattern; report E verified that only `/v1/messages` and `count_tokens` follow `ANTHROPIC_BASE_URL`.
- `boot.js` installs the adapter *inside* the egress guard. The adapter keeps a private reference to the native `fetch` and is the only code allowed to reach the upstream hosts: `chatgpt.com/backend-api/codex/*` + `auth.openai.com/oauth/token` for Route A, or `api.openai.com/v1/*` + `auth.openai.com/api/accounts/oauth/token` for Route B. Claude Code's own fetches stay limited to the synthetic origin, which the adapter answers with a synthetic `Response` whose body is a `ReadableStream` of Anthropic SSE.
- The API stream already uses `globalThis.fetch` with the SDK's `AbortSignal` (STATUS F2), so interrupts can propagate to the upstream fetch.
- Routes:
  - `POST /v1/messages` with `stream:true`: stream-translate.
  - `POST /v1/messages` with `stream` unset or false: run upstream streaming, aggregate, and return one Anthropic `Message` JSON. Short-circuit `max_tokens:1` probes locally with a canned reply, so no plan usage is spent.
  - `POST /v1/messages/count_tokens`: answer locally `{input_tokens: ceil(bytes/4)}`.
  - Anything else: 404.
- Model choice: Settings → Codex model (live list from §5) and effort override. Keep `--model claude-sonnet-5-5` on the harness so its behaviour (adaptive thinking, betas, tool set) stays the tested one, and map the model name in the adapter. Set `CLAUDE_CODE_AUTO_COMPACT_WINDOW` / `CLAUDE_CODE_MAX_CONTEXT_TOKENS` (both present in the 2.1.311 bundle; exact semantics INFERRED) to the Codex model's `context_window` (272 k), so Claude Code compacts before the backend's `context_length_exceeded`.

### 7.3 Request mapping (Anthropic → Responses)

| Anthropic | Responses | notes |
|---|---|---|
| `model` | `settings.codexModel` (haiku-class names → `settings.codexSmallModel`, defaulting to the same) | |
| `system[]` text blocks | `instructions` = texts joined with `\n\n`, **minus the `x-anthropic-billing-header:` line** | CLIProxyAPI drops that line too (`IsClaudeCodeAttributionSystemText`). It means nothing to OpenAI and leaks version info. Nothing is sent to Anthropic, so the "don't touch cch=" rule is not engaged |
| `cache_control` anywhere | dropped. Set `prompt_cache_key` = Claude Code session id (from `metadata.user_id.session_id` or `x-claude-code-session-id`), plus `session-id`/`thread-id`/`x-client-request-id` headers (Route A) | caching is automatic on OpenAI. Codex keys it on the session id |
| `messages[i].role:"system"` (string or text blocks) | `{"type":"message","role":"developer","content":[{"type":"input_text",…}]}` **at the same position** | `role:"system"` items are rejected on Route B |
| user `text` | `message{role:"user", content:[input_text]}` | merge consecutive text blocks into one message, order preserved |
| user `image` (`source.type` `base64` / `url`) | `input_image{image_url:"data:<media_type>;base64,<data>" \| url, detail:"auto"}` | |
| user `document` (PDF base64 / text) | Route B: `input_file{filename, file_data:"data:application/pdf;base64,…"}`. Text documents become `input_text`. Otherwise a `[document omitted: …]` text placeholder | file inputs only "when the model accepts them" |
| user `tool_result{tool_use_id, content, is_error}` | `function_call_output{call_id: tool_use_id, output}`: a string, or `[input_text…, input_image…]` when it has images. `is_error` prepends `"Error: "` | Responses has no is_error flag (Codex's `success` field is not serialized). Emit outputs before the user's other blocks in the same message, preserving order |
| `tool_reference` / `search_result` / other blocks in tool_result | text rendering (`[tool reference: <name>]`, title + snippets) | |
| assistant `text` | `message{role:"assistant", content:[{type:"output_text", text}]}` (plus `id:"msg_…"` if recorded in the envelope) | |
| assistant `thinking{thinking, signature}` | if `signature` is **our envelope** (§7.5): `reasoning{id, summary:[{type:"summary_text",text:thinking}], encrypted_content}`; otherwise drop | Anthropic-signed thinking (after a provider switch) is meaningless upstream |
| assistant `redacted_thinking{data}` | same envelope decode, else drop | |
| assistant `tool_use{id, name, input}` | `function_call{call_id: id, name: toolName(name), arguments: JSON.stringify(input)}` (plus `id:"fc_…"` from the per-session map if known) | the call id is the identity mapping: we emit `tool_use.id = call_id` (§7.4) |
| a `tool_use` with no matching `tool_result` (interrupted turn) | synthesize `function_call_output{call_id, output:"aborted"}` | the Responses API requires an output for every call. INFERRED; Codex does similar |
| `tools[]` | `{"type":"function", name: toolName(name), description, parameters: clean(input_schema), strict:false}` | `clean` strips `$schema`/`$id`, ensures `properties:{}` on objects, and drops regexes using `\p{…}` (CLIProxyAPI does this). **Drop `DeferredToolPlaceholder`.** Strip `defer_loading` from the rest (or drop deferred tools until loaded). Drop Anthropic server tools (`type` like `web_search_*`, `code_execution_*`) |
| tool names | `^[a-zA-Z0-9_-]{1,64}$`. Over-long `mcp__srv__tool` becomes `mcp__tool` or a hash, with a reverse map per request | `mcp__page__get_weather` passes as is |
| `tool_choice` `{type:auto\|any\|tool\|none, disable_parallel_tool_use}` | `"auto"` / `"required"` / `{"type":"function","name"}` / `"none"`; `parallel_tool_calls = !disable_parallel_tool_use` (default true) | Codex always sends `"auto"` |
| `thinking` + `output_config.effort` | `reasoning:{effort}` with effort = `output_config.effort` (`low\|medium\|high\|xhigh\|max`), clamped to the model's `supported_reasoning_levels`. `thinking.type:"disabled"` → lowest supported (`low`). `enabled` + `budget_tokens` → ≤4k low, ≤16k medium, else high. Settings override wins. `reasoning.summary:"auto"` only if `thinking.display === "summarized"` (or a UI toggle); omit otherwise | always `include:["reasoning.encrypted_content"]` |
| `output_config.format {type:"json_schema", schema}` | `text:{format:{type:"json_schema", name, schema, strict:false}}` | |
| `max_tokens` | **dropped** | no `max_output_tokens` on either route (Codex never sends it; SIWC forbids it) |
| `temperature`, `top_p`, `top_k`, `stop_sequences` | dropped | reasoning models reject sampling params |
| `metadata` | dropped (session id extracted first) | SIWC forbids `metadata`. Don't leak `device_id` |
| `context_management.edits` | applied locally: `clear_thinking_*` with `keep:{type:"thinking_turns",value:N}` drops reasoning items older than N assistant turns (`"all"` drops none); `clear_tool_uses_*` replaces older tool outputs with a stub | the server-side feature does not exist upstream |
| `speed:"fast"` | ignored by default (`service_tier:"priority"` costs "increased usage") | |
| `anthropic-beta`, `anthropic-version` | ignored | |
| constants | `store:false`, `stream:true` | required |
| `text.verbosity` | omit (or settings) | catalog default is `low` |

### 7.4 ID mapping

- **tool_use ↔ function_call.** Set Anthropic `tool_use.id` to the Responses `call_id`. Server ids look like `call_…` and fit `^[a-zA-Z0-9_-]+$`; otherwise sanitize and keep a map. On the way back, `function_call_output.call_id = tool_result.tool_use_id`. Because `store:false` makes every request carry the full history, no server state is involved. Claude Code's own `toolu_…` ids, after a provider switch mid-session, pass through as call_ids (≤64 characters, hash-shortened as CLIProxyAPI does).
- **Item ids (`rs_…`, `fc_…`, `msg_…`).** Codex replays them, and the reasoning↔following-item pairing may depend on them. Record `call_id → fc_id` and `msg text index → msg_id` in a per-session Worker map, and put `rs_id` in the thinking envelope. Omit ids that are unknown (pi-ai omits them for cross-model history, so omission is tolerated).

### 7.5 Reasoning continuity: the thinking envelope

Responses reasoning is stateless with `store:false`. The server needs the previous `reasoning` items (with `encrypted_content`) replayed. Claude Code keeps assistant thinking blocks, signature included, in history (`clear_thinking … keep:"all"`). So:

- For each upstream `reasoning` item, emit an Anthropic `thinking` block with `thinking` = concatenated summary text (often empty) and `signature` = `"cxr1." + base64url(JSON {id, encrypted_content, model})`.
- On replay, decode blocks whose signature starts with `cxr1.` and drop any other signature.
- If summaries are off and the text is empty, a `redacted_thinking{data:"cxr1.…"}` block is the semantically cleaner carrier. Both round-trip in Claude Code (INFERRED: test that 2.1.311 replays `redacted_thinking` verbatim).
- If the user switches Codex model mid-session, drop reasoning items whose `model` differs, as pi-ai does.

### 7.6 Response mapping (Responses SSE → Anthropic SSE), state machine

```
state: idx = -1, open = null (current block {kind, outputIndex}), sawToolCall = false, usage, lastEventAt
on HTTP 200:            emit message_start {message:{id:"msg_"+uuid, type:"message", role:"assistant",
                          model:<requested claude model>, content:[], stop_reason:null, stop_sequence:null,
                          usage:{input_tokens:<estimate>, output_tokens:0, cache_read_input_tokens:0, cache_creation_input_tokens:0}}}
                        then a ping every 10–15 s of upstream silence (long reasoning phases)
response.created        remember response.id (debug only)
output_item.added       item.type=="message"       → closeOpen(); content_block_start {type:"text", text:""}
                        item.type=="function_call" → closeOpen(); content_block_start {type:"tool_use", id:call_id,
                                                      name:reverseToolName(name), input:{}}; sawToolCall = true
                        item.type=="reasoning"     → closeOpen(); open a pending thinking slot (start lazily)
reasoning_summary_text.delta → if the thinking block isn't started: content_block_start {type:"thinking", thinking:"", signature:""};
                               content_block_delta {type:"thinking_delta", thinking:delta}
                               (between summary parts insert "\n\n")
output_text.delta       → content_block_delta {type:"text_delta", text:delta}
function_call_arguments.delta → content_block_delta {type:"input_json_delta", partial_json:delta}
output_item.done        reasoning → start the thinking block if not started; content_block_delta {type:"signature_delta",
                                    signature:"cxr1."+…}; content_block_stop
                        message   → if no deltas were seen, emit the full text from item.content; content_block_stop
                        function_call → if no argument deltas were seen, emit item.arguments || "{}" as one input_json_delta; stop
                        other (web_search_call, …) → ignore
response.completed      closeOpen(); message_delta {delta:{stop_reason: sawToolCall ? "tool_use" : "end_turn", stop_sequence:null},
                          usage:{input_tokens: in - cached - cacheWrite, cache_read_input_tokens: cached,
                                 cache_creation_input_tokens: cacheWrite, output_tokens: out}}; message_stop
response.incomplete     reason max_output_tokens → stop_reason "max_tokens"; content_filter → "refusal";
                        interrupted → "end_turn"; else error (below)
response.failed / error → closeOpen(); event: error {type:"error", error:{type, message}} (mapping below); end stream
stream EOF without a terminal event → event: error {overloaded_error, "stream closed before response.completed"} (Codex retries this)
```

Rules: Anthropic needs strictly sequential, non-overlapping blocks. Responses output items arrive in `output_index` order and do not interleave in practice. Handle it defensively: if an event for a different `output_index` arrives while a block is open, buffer it until the open block's `output_item.done`. That is the "deferred events" approach CLIProxyAPI's `shouldDeferCodexStreamEvent` uses. Abort: Claude Code's `AbortSignal` aborts the upstream fetch and closes the synthetic stream. Usage: Anthropic `input_tokens` excludes cache reads, while OpenAI's includes them, hence the subtraction. `output_tokens` include reasoning tokens on both sides. Whether the SDK takes `input_tokens` from `message_delta` over `message_start` must be tested (INFERRED). The fallback is to delay `message_start` until the first content event, which costs nothing measurable. Claude Code's cost line will use Claude prices and be wrong; label it in the UI.

### 7.7 Error mapping

| upstream | before stream (synthetic HTTP response, Anthropic error JSON) | mid-stream (`event: error`) |
|---|---|---|
| 401 / `subscription_sharing_invalid_user` | refresh once (if allowed, §0.4), retry; else 401 `authentication_error` "ChatGPT login expired – paste a fresh auth.json / sign in again" | same, as an error event |
| 429 `usage_limit_reached` / `subscription_sharing_usage_limit_exceeded` | 429 `rate_limit_error`, message with plan and reset time (`resets_at`), header **`x-should-retry: false`** | `rate_limit_error` |
| 429 `rate_limit_exceeded` (short) | 429 `rate_limit_error` + `retry-after` | `rate_limit_error` |
| `usage_not_included`, `insufficient_quota`, `subscription_sharing_user_not_eligible` | 403 `permission_error`, `x-should-retry:false` | `permission_error` |
| `context_length_exceeded` | 400 `invalid_request_error` with message **`prompt is too long: <N> tokens > <window> maximum`** | same |
| 503 `server_is_overloaded` / `slow_down` / `*_unavailable` | 529 `overloaded_error` (retryable) | `overloaded_error` |
| 400 `cyber_policy` / `bio_policy` / `invalid_prompt` / `misalignment_policy_violation` | 400 `invalid_request_error`, `x-should-retry:false` | `invalid_request_error` |
| 400 `subscription_sharing_unsupported_capability` | 400 `invalid_request_error` including `error.param` (a translator bug to surface) | |
| 403 Cloudflare block | 403 `permission_error` "blocked by Cloudflare (region?)" | |
| other 5xx / network | 500 `api_error` (retryable) | `api_error` |

Two of these are VERIFIED in the bundle. Claude Code 2.1.311 knows `x-should-retry` (its gateway code sets `{"x-should-retry":"false"}`). It parses `/prompt is too long[^0-9]*(\d+)\s*tokens?\s*>\s*(\d+)/i` to drive reactive compaction.

### 7.8 Things that do not translate faithfully, and how they degrade

- **Prompt caching control** (`cache_control`, 1 h TTL): gone. OpenAI caches automatically by prefix and `prompt_cache_key`. Cost and latency are different, not broken.
- **Multiple system blocks and mid-conversation system messages**: flattened into `instructions` plus developer messages. Content is preserved; Claude Code's per-block caching intent is lost.
- **Anthropic-only betas**: `context-management` (emulated locally), `interleaved-thinking` (Responses interleaves reasoning and tool calls natively), `per-turn-control`, `mid-conversation-tool-changes` (tools are re-sent whole each request, so changes just work), `advanced-tool-use` / `defer_loading` / `tool_reference` (no `tool_search` on Route B, so deferred tools are dropped or inlined), `thinking-token-count`, `effort` (mapped), `extended-cache-ttl` (dropped), `oauth`, `claude-code`.
- **Thinking display**: Responses exposes only *summaries*, and only when `reasoning.summary` is set. Raw thinking text is never available. Anthropic thinking signatures cannot be produced; we substitute our own opaque envelope.
- **`max_tokens`**: cannot be enforced; `stop_reason:"max_tokens"` happens only on upstream `max_output_tokens` incompletes.
- **Images**: supported (`input_image`). **PDF/documents**: Route B `input_file` per model; otherwise a placeholder. **Citations / search results**: rendered as text.
- **Server tools** (Anthropic web search/fetch, code execution): not offered. The page already disables WebFetch/WebSearch. Responses `web_search` could be mapped later, but Route B makes it subject to model and account policy.
- **Token counting**: local estimate only.
- **Stop sequences, temperature, top_p/top_k**: dropped.
- **Model identity**: Claude Code believes it is talking to a Claude model. Its system prompt says "You are a Claude agent…". The OpenAI model will follow the instructions anyway, but this is worth a sentence in the UI ("the Codex model runs Claude Code's prompt").
- **Usage and cost reporting** in Claude Code's result line is in Claude units and prices; plan usage is shown separately (rate-limit headers or `/wham/usage`, if CORS allows).

### 7.9 Size and tests

About 700–800 lines of JS: request translator ~250, SSE state machine ~300, auth (auth.json parse, JWT decode, refresh with single-flight lock, Route B OAuth paste flow) ~150, models list ~60. Add a `POST /backend-api/codex/responses` + `POST /v1/responses` mock to `mock/mock-api.mjs` with scripted Responses SSE for the existing scenarios ("say hi", "use the weather tool", "write a file", "stream slowly"). Then the e2e acceptance can run in Codex mode with no network. Unit-test the translator against the captured 2.1.311 body shape (§7.1).

---

## 8. Existing translators

| project | licence | what it implements | size | browser-Worker fit |
|---|---|---|---|---|
| **`@earendil-works/pi-ai` 1.4.0** (was `@mariozechner/pi-ai`, now deprecated) | MIT (VERIFIED npm) | `openai-codex` provider ("OpenAI Codex (legacy)"): `chatgpt.com/backend-api/codex/responses`, SSE plus WebSocket with SSE fallback, `originator: pi`, `chatgpt-account-id` from the access-token JWT, `instructions` = system prompt, classic `tools`, `include:["reasoning.encrypted_content"]`, `prompt_cache_key`, retry/backoff, friendly usage-limit messages, Codex OAuth (client `app_EMoamEEZ73f0CkXaXp7hrann`, form refresh). **Also an `openai` provider with "Sign in with ChatGPT"** (`auth/oauth/openai-chatgpt.js`: `dynamic_agent_client`, `chatgpt.tokens.use.direct`, `ext_agent_host_id`, manual redirect-URL paste) against `api.openai.com/v1` | 4.3 MB package; Codex path ≈ 1,327 + 768 lines plus utilities | Streaming code is browser-friendly (`fetch`, `TextDecoder`, `atob`, `Headers`; zstd skipped without `node:zlib`). OAuth login modules import `node:http` / `node:crypto` and are not browser-safe. It speaks pi's own message and event model, not Anthropic wire format, so both directions would still need an adapter. **Best reference for the upstream half; copying selected functions with the MIT notice is fine** |
| **CLIProxyAPI** (`router-for-me/CLIProxyAPI`) | MIT (VERIFIED `LICENSE`) | Full Claude↔Codex translator (`internal/translator/codex/claude/codex_claude_{request,response}.go`): system to a developer message, billing-line strip, thinking budget/effort to `reasoning.effort`, `encrypted_content` carried in thinking `signature`, 64-char name and call-id shortening with reverse maps, schema cleanup, deferred SSE events, stop-reason and usage mapping, error events. Executor for both the legacy backend (spoofs a `codex-tui` UA) **and SIWC** (no Originator / ChatGPT-Account-ID in SIWC mode) | Go, ~300 k lines in total; translator ~2 k lines | Not runnable in a browser. **Best design reference for edge cases** (its tests encode many real-world quirks) |
| `opencode-openai-codex-auth` 4.4.0 | MIT | opencode plugin: Codex OAuth, request rewrite to the Codex backend, `originator: codex_cli_rs`, injects Codex's official prompt as `instructions` (fetched from GitHub releases), `session_id`/`conversation_id` headers | 270 KB | Node only. Outdated relative to current Codex (Jan 2026), and spoofs the originator. Don't use |
| `@musistudio/claude-code-router` 3.1.3 / `@musistudio/llms` 1.0.53 | MIT (npm) | Local gateway between Claude Code and many providers, with Anthropic↔OpenAI transformers. Codex OAuth not confirmed | 37 MB / 8 MB | Node server. Design reference only |
| `ai-sdk-provider-codex-cli` 2.3.0 | MIT (npm) | AI-SDK provider that *spawns the Codex CLI* | 287 KB | Not applicable (needs the native binary) |
| `@openai/codex-sdk` 0.165.0 | Apache-2.0 | Official TS SDK that drives the Codex CLI/app-server | 80 KB | Not applicable (spawns the binary) |
| `openai` Node SDK 7.45.1 | Apache-2.0 | Official typings and streaming for the Responses API | — | Works in browsers (`dangerouslyAllowBrowser`). Could be used for Route B, but ~100 KB+ for what is one `fetch` and an SSE parser. Use it for the types only |
| LiteLLM `chatgpt/` provider, opencode core | MIT (INFERRED, not fetched) | Python / server-side | — | Not applicable |

**Recommendation.** Write our own small translator in `src/runtime/boot/codex-adapter.js` (plain ESM, no dependencies), modelled on CLIProxyAPI's mapping decisions and pi-ai's SSE client. Credit both in a header comment if any function is copied (MIT notice).

---

## 9. Open questions that need a real ChatGPT login (or agent K)

1. CORS and preflight for: `chatgpt.com/backend-api/codex/responses` (custom headers `chatgpt-account-id`, `originator`, `session-id`), `auth.openai.com/oauth/token`, `api.openai.com/v1/responses` and `/v1/models`, and `auth.openai.com/api/accounts/oauth/token`. Also which response headers are exposed (`x-codex-*`, `x-request-id`). **(K)**
2. Whether Route A accepts `originator: claude-code-web`, the browser UA, no `version` header and a `github.io` Origin. Whether Cloudflare challenges browser-origin calls. **(test)**
3. Whether classic top-level `tools` work for the responses-lite / code-mode-only models (gpt-5.6-\*, gpt-6\*) on both routes. If not, emit `additional_tools` with a `functions` namespace (Codex's `create_tools_json_for_responses_lite`) and set `reasoning.context:"all_turns"`. **(test)**
4. What `/models?client_version=` returns without the CLI's version, and whether the server gates models on the `version` header. **(test)**
5. Whether Claude Code 2.1.311 replays `redacted_thinking` and our `thinking.signature` envelope verbatim, and whether usage in `message_delta` overrides `message_start`. **(test against the mock; no OpenAI token needed)**
6. Terms: Route A (reusing the Codex CLI's client and backend from a third-party web app) versus Route B ("open-source and locally hosted apps"; is a static Pages app running in the user's browser "locally hosted"?). **(K)**
