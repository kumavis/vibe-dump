# claude-code-web — status

_v0, 2026-10-28. Current state only; the build history (agent reports, round by round) is in
`docs/research/claude-code-in-browser/M-build-log.md`, and the research behind every decision in the
reports A–L next to it._

## What this is

The official Claude Code harness, pinned at **2.1.311**, running client-side in a browser tab. The user
supplies the binary (file drop of their own `claude`, or the npm platform package downloaded in the
page); the page extracts the embedded JavaScript, applies six mechanical loader rewrites with pinned
match counts, caches the tree, and runs it in a Web Worker on Node and Bun shims. The page drives it
over `-p` stream-json exactly as the Agent SDK does: no TUI, no Bash tool, file tools on a virtual
filesystem persisted in OPFS, custom tools from the page as in-process MCP servers.

Three ways to authenticate:

| mode | how | network |
|---|---|---|
| API key | `ANTHROPIC_API_KEY` | `api.anthropic.com` directly (CORS allows it; Claude Code sends the browser-access header) |
| Claude subscription | a `claude setup-token` value pasted in | same endpoint, bearer token; the gray area in README |
| ChatGPT subscription | OpenAI's documented Sign in with ChatGPT (dynamic client, `chatgpt.tokens.use.direct`) | `api.openai.com/v1/responses`, translated inside the Worker from Claude Code's Messages-API requests |

Every platform package except Windows works (linux x64/arm64, glibc and musl; darwin x64/arm64).

## Verified (headless Chromium, real 2.1.311 binary, mock API; reproduced by an independent verifier)

| | Anthropic mode | ChatGPT mode |
|---|---|---|
| extraction of the dropped 294 MB binary, 2,848 modules, 6 rewrites at their pinned counts, cache reused on reload | PASS, 4.4–5.7 s | same |
| cold boot to the first `system/init` | 6.5–8.1 s (limit 30 s) | 6.6–7.9 s |
| warm boot after a reload | 5.4–6.4 s (limit 10 s) | 5.7–6.2 s |
| `say hi`: one request, correct headers and body shape, streamed result | PASS, ~100 ms | PASS, ~150 ms |
| custom tool (`get_weather` from the page) called once with the model's input, result round-tripped | PASS | PASS |
| `write a file`, present after a reload (OPFS) | PASS | PASS |
| Glob, Grep, Read, Edit on the VFS; a denied permission; interrupt mid-stream | PASS | PASS |
| credentials never in localStorage without "Remember"; no `window.__cc` without `?test` | PASS | PASS |
| no host contacted but the static server and the mock (network-level block) | PASS | PASS |
| sign-in by pasting the loopback callback URL; refused-token refresh; rotating refresh tokens; usage-limit, rate-limit, mid-stream failure and context-overflow handling (Claude Code compacts through the adapter); every request audited for the Sign in with ChatGPT rules | — | PASS |
| whole e2e run | 25–28 s, 11 steps | 26–31 s, 15 steps |

Unit tests: `npm test` 351/351 (extractor, Node shims, Bun polyfill, host, Worker boot, translator,
e2e recovery). `npm run build` and the repo's `npm run verify` pass.

## Not verified, known issues

- **No real API traffic yet, for either provider.** Everything above is against a mock that imitates the
  documented behaviour and the CORS probes in reports C and K. Open for Anthropic: whether the server
  accepts a subscription token from a browser origin (API key is the documented-safe default). Open for
  OpenAI: a readable successful SSE stream cross-origin, the authorize page completing with nothing on
  `127.0.0.1:1455`, classic top-level tools on the responses-lite models (gpt-5.6, gpt-6), the ID-token
  claim assumptions, and whether a static Pages app counts as "locally hosted" under the plan terms.
- **About 2% of interrupts on a long stream are not applied** (1 in 54 ChatGPT-mode, 1 in 16 once in
  Anthropic mode): the turn's result arrives when the stream ends. The path is the bundle's own
  fetch-with-AbortSignal; not diagnosed. The e2e isolates it so it cannot cascade.
- **Windows binaries are refused** (a different embedded path prefix). The in-page npm download is verified
  by hand only (Playwright cannot serve a 132 MB body).
- **Not emulated:** Bash, WebFetch, WebSearch, the TUI, the hooks worker, background sessions, image
  resize, the `clear_tool_uses_*` context edit, Anthropic server tools; prompt-cache controls on the OpenAI
  side; the cost line stays in Claude prices in ChatGPT mode.
- **Shim limits not hit by any exercised path:** no asymmetric crypto or X.509; `AsyncLocalStorage` is
  synchronous only; `dns` resolves IP literals and localhost only; the `rg` subset ignores `.gitignore`;
  `import.meta.dirname` is undefined (one unreached `path.resolve` site in the hooks-plugin builder).
- Conversation history does not persist across reloads (only the workspace does).
- `npm run dev` runs the page with the fake worker only; the real Worker needs the build.
- Inside a claude.ai artifact frame the page renders but cannot run: service workers and outbound
  fetch are blocked there.

## How to run

```bash
cd packages/claude-code-web
npm test                                     # unit tests (351)
npm run build                                # vite build + scripts/build-runtime.mjs -> dist/
npm run test:e2e                             # Anthropic mode: acceptance test + extras
npm run test:e2e -- --provider chatgpt       # ChatGPT mode
node test/e2e.mjs --base /vibe-dump/claude-code-web/     # under the Pages sub-path
node test/e2e.mjs --trace --log /tmp/page.log            # one line per upstream request
node test/e2e.mjs --provider chatgpt --access-ttl 65     # exercise token expiry and rotation
node test/e2e.mjs --fake                                  # page wiring against the fake worker

# by hand, against the mock:
PORT=4173 node ../../scripts/serve.mjs dist   # http://127.0.0.1:4173/  (?trace or ?debug for diagnostics)
node mock/mock-api.mjs 18080                  # Anthropic: base URL http://127.0.0.1:18080, any placeholder key
                                              # ChatGPT: Advanced -> API base http://127.0.0.1:18080/v1, issuer http://127.0.0.1:18080
```

The e2e takes the binary from `$CC_BINARY` (default: the research scratchpad copy of
`@anthropic-ai/claude-code-linux-x64@2.1.311`, see `test/research.mjs` and `CC_RESEARCH_DIR`). Chromium:
`$CHROMIUM_PATH`, else Playwright's default, else `/opt/pw-browsers/chromium-1243/chrome-linux64/chrome`.

## Next steps

1. The first real turn, from a local build or the deployed page: API key, then a setup-token, then a
   ChatGPT Plus/Pro sign-in. Record what each server does.
2. Boot time: warm boots spend ~4 s pre-importing ~1,800 modules through the service worker; next
   levers are a Chromium trace (evaluation vs waterfall), prefetch into service-worker memory, and
   checking whether modules served to a dedicated Worker get code-cached.
3. Conversation persistence across reloads (`--resume` with `~/.claude/projects` in the snapshot).
4. Drift: the pinned rewrite counts and the bundle-surface tests are the alarms for the next Claude
   Code release.
