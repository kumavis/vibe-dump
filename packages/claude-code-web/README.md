# Claude Code Web

> **Unofficial; not affiliated with or endorsed by Anthropic.** A personal
> experiment that runs your own copy of Claude Code; Anthropic does not
> provide or support it.

The official Claude Code harness, running in a browser tab. You give the page
your own copy of Claude Code; it pulls the JavaScript out of the binary, runs
it in a Web Worker on top of small Node and Bun compatibility layers, and
talks to it the way the Claude Agent SDK does. There is no server: the only
network traffic is between your browser and the Anthropic API (or whatever
base URL you set), or OpenAI if you use your ChatGPT subscription instead.

Status: work in progress. Pinned to Claude Code **2.1.311**.

## The idea: the real harness, not a lookalike

Claude Code ships as a native executable that embeds its JavaScript (about
2,800 modules). This page does not reimplement Claude Code, and it does not
ship any of Anthropic's code. Instead:

1. **You supply Claude Code.** Either drop the `claude` binary that is already
   on your disk, or let the page download the official
   `@anthropic-ai/claude-code-linux-x64@2.1.311` package from the npm registry
   into your browser.
2. **The page extracts the embedded JavaScript** in your browser and applies a
   short, fixed list of mechanical loader rewrites, the same ones the FreeBSD
   port of Claude Code applies so the code can load outside its own runtime:
   module paths (`/$bunfs/root/...` to this page's URL), `import.meta.require`
   and `import.meta.dir`, and three small shape-matched patches (the built-in
   hooks helper, the shell search tools gate, a path-completer filter). The
   whole list is [`src/extract/rewrites.js`](./src/extract/rewrites.js); each
   rewrite has an expected match count, and any drift is a visible error,
   never a silent skip. The result is cached in your browser (Cache Storage).
3. **It runs unchanged otherwise**, in programmatic mode
   (`claude -p --input-format stream-json --output-format stream-json`), in a
   Worker. The page is the client, exactly as the Agent SDK is a client of the
   CLI: it sends your prompts, answers permission prompts, and serves custom
   tools as an in-process MCP server.

Nothing touches identity: the browser's own User-Agent is sent, the system
prompt and billing line are untouched, telemetry, error reporting and the
auto-updater are switched off with Claude Code's own environment flags.

## Using it

1. **Get Claude Code** (top-left panel), once:
   - *Drop your binary*: the file the official installer put on your machine.
     It is usually a symlink, so copy the real file somewhere you can pick it:
     `cp "$(readlink -f "$(command -v claude)")" ~/Downloads/claude`.
     Linux and macOS builds are accepted; it must be version 2.1.311
     (`claude --version`). Windows builds are not supported.
     The npm platform tarball (`claude-code-linux-x64-2.1.311.tgz`) works too.
   - *Download from npm*: fetches the official linux-x64 package (about
     130 MB) straight from `registry.npmjs.org`.

   Either way the extracted code (about 52 MB) stays cached; a reload reuses it.
2. **Credentials** (Settings). Pick one:
   - **API key** (default): a key from the Anthropic Console. Browser-direct
     API-key use is officially supported. If your Max or Team plan includes
     monthly API credits, use a key from the Console org linked to it.
   - **Subscription token** (experimental): on your own computer, with Claude
     Code installed and signed in to your Pro/Max plan, run

     ```sh
     claude setup-token
     ```

     It prints a long-lived, inference-only token starting with
     `sk-ant-oat01-`. Paste it into the page. Read the next section first.
   - **ChatGPT subscription** (experimental): sign in with your ChatGPT Plus
     or Pro plan; Claude Code then runs on an OpenAI model. See
     [Using your ChatGPT subscription](#using-your-chatgpt-subscription).

   **Where the key or token is kept.** By default only for the current tab
   (`sessionStorage`): it survives a reload and is forgotten when the tab
   closes. Tick **Remember on this device** to save it in `localStorage`
   instead; untick it to remove it from there. Think before ticking it: on
   GitHub Pages this page's origin (`kumavis.github.io`) is shared with every
   other app in this gallery and every other Pages site of the account, and
   any script on that origin can read that origin's storage (the saved
   workspace in OPFS too). The only real fix is hosting the page on an origin
   of its own. Either way the credential is sent only to the API base URL,
   which must be `https://` (plain `http://` is accepted for `localhost` /
   `127.0.0.1` only, for the mock); inside the Worker, requests that carry it
   to any other origin are refused.
3. **Start Claude Code**, then chat. Files it writes live in an in-browser
   workspace (`/home/user/workspace`), listed on the left and kept across
   reloads.
4. **Custom tools** (Settings): JSON with a name, description, input schema
   and a JavaScript handler body per tool. Handlers run in the page as
   `async (input, ctx) => { ... }`; the model sees them as
   `mcp__<server>__<name>`. The example is a `get_weather` tool.

## The gray area in Anthropic's terms

Read [`docs/research/claude-code-in-browser.md` §5](../../docs/research/claude-code-in-browser.md#5-policy-and-terms-agent-a-not-legal-advice)
before using a subscription token. In short (not legal advice):

- Claude Code's terms allow subscription (OAuth) sign-in for "the unmodified
  Claude Code binary", by its own user, and forbid third parties from offering
  Claude.ai login or routing requests through someone's subscription.
- This page never performs a login, never sees your token outside your own
  browser, and runs the official JavaScript. But it runs that JavaScript on a
  different runtime, after rewriting module paths so it can load at all. That
  is ordinary use in spirit and not "the unmodified binary" in letter.
- Using it yourself is the strongest case; a public page that invites others
  to paste subscription tokens is a weaker one.
- **API-key mode has none of this exposure**, which is why it is the default.

If Anthropic's servers reject subscription tokens from a browser, that is the
answer; this project does not work around it.

## Using your ChatGPT subscription

Pick **ChatGPT subscription** in Settings. The harness stays the same
official Claude Code; only its model requests change direction. Claude Code
is pointed at a made-up address (`https://openai-adapter.invalid`) that never
reaches the network: inside the Worker, an adapter translates each request
into OpenAI's Responses API and sends it to `https://api.openai.com/v1` with
your ChatGPT sign-in, then translates the streamed answer back.

**Signing in** uses OpenAI's documented
["Sign in with ChatGPT" for open-source apps](https://developers.openai.com/siwc/token-sharing-open-source/sign-in)
(scope `chatgpt.tokens.use.direct`; the app registers itself the first time as
`claude-code-web`):

1. Press **Open sign-in**. A new tab opens on `auth.openai.com`; sign in and
   approve.
2. That tab then tries to load `http://127.0.0.1:1455/auth/callback?code=…`
   and fails ("can't connect"). That is expected: OpenAI only redirects to a
   loopback address, and a web page cannot listen there. Copy the whole
   address from that tab's address bar.
3. Paste it into the page and press **Complete sign-in**. The page exchanges
   the code itself (with PKCE) and shows who is signed in.

If the Codex CLI or another app happens to be signing in on the same computer
at that moment, it may grab the callback instead; just try again.

Then pick a **model** (the list is the one OpenAI offers your plan; GPT-5.5 is
the one tested with this page) and, if you like, a **reasoning effort**
("Auto" follows the effort Claude Code asks for).

What to know first:

- **Plans and limits.** It needs an eligible **ChatGPT Plus or Pro** plan, and
  it counts against your plan's Codex usage limits (a 5-hour window on Plus,
  and weekly limits). In
  ChatGPT, *Settings → Security and login → Sign in with ChatGPT* lets you set
  a **weekly cap** for this app or disconnect it.
- **Terms.** OpenAI offers plan usage to open-source apps under its own terms
  for them; this page is open source and runs only in your browser. It is
  unofficial: not affiliated with or endorsed by OpenAI, nor by Anthropic.
- **Your tokens** are kept exactly like the other credentials: in this tab
  only unless you tick *Remember on this device*. They go only to OpenAI
  (`auth.openai.com` to sign in and refresh, `api.openai.com` for the model).
  The page keeps the refresh token; the Worker that runs Claude Code is only
  ever handed the short-lived access token. The refresh token is a
  long-lived credential: anyone who reads it can use your plan until you log
  out (Log out also asks OpenAI to revoke it, best effort). Remember that this
  origin is shared with the other gallery apps.
- **Nothing presents as the Codex CLI**: no Codex client id, `originator`,
  `chatgpt-account-id` or Codex User-Agent.
- **The Codex CLI's own login is not supported.** Its backend
  (`chatgpt.com/backend-api/codex`) only answers OpenAI's own web origins, so
  a page cannot reach it without a relay server, and OpenAI's docs steer
  third-party apps to the route above instead. Its `auth.json` tokens also
  rotate on refresh, so sharing them with the CLI would sign one of the two
  out.
- **What does not carry over.** Claude Code still believes it talks to a
  Claude model (its own prompt and tools run on the OpenAI model); its
  result line reports `claude-sonnet-5-5` and a cost in Claude prices that
  says nothing about your ChatGPT usage. Prompt-cache controls, Anthropic
  server tools and exact token counts have no equivalent; thinking shows as
  OpenAI's reasoning summaries.

## What does not work (v1)

- **No shell.** The Bash tool is disabled; nothing can be installed or run.
  `git` is absent too. Read, Write, Edit, Glob and Grep work on the in-browser
  filesystem.
- **An allowlist of tools.** Claude Code gets only Read, Write, Edit, Glob,
  Grep, NotebookEdit, Task, TodoWrite, AskUserQuestion, ExitPlanMode and Skill
  (`--tools`), plus the page's own tools; the page also denies any other tool
  the CLI asks permission for. Tools a new Claude Code release adds stay off.
- **No WebFetch or WebSearch**, and no MCP servers other than the page's own
  tools.
- **No interactive TUI.** No slash-command UI, `/login`, plan mode UI, hooks,
  plugins or marketplace, background sessions, image resizing, clipboard or
  voice.
- **Conversations are not kept** across reloads (only the workspace is).
- **One tab at a time.** The workspace is one saved file per site, so a
  second tab of the page says it is open in another tab and will not start
  Claude Code until the first tab is closed.
- **Browsers:** Chromium-based browsers, version 134 or later (the code uses
  `await using`). Others are untested.
- **One version:** 2.1.311 only. A new Claude Code release usually means new
  rewrite counts in `src/extract/rewrites.js`.

## Development

The real harness needs the built runtime (`dist/runtime/`: the shims, the Bun
polyfill and the Worker bootstrap), so try it on the build, against the mock
API:

```sh
npm run build                       # vite build + scripts/build-runtime.mjs -> dist/
PORT=4173 node ../../scripts/serve.mjs dist   # the page at http://127.0.0.1:4173/
node mock/mock-api.mjs 18080        # local stand-in for /v1/messages
```

In the page, pick either credential mode and paste any placeholder (the mock
only checks that one is there), set the base URL to `http://127.0.0.1:18080`,
drop the binary, press Start, and try `say hi`, `use the weather tool`,
`write a file`, `run the file tools` (Glob, Grep, Read, Edit on the
workspace) or `stream slowly` (then Interrupt).

For the ChatGPT mode, the same mock is also a fake OpenAI: pick *ChatGPT
subscription*, and under *Advanced: endpoints* set the API base URL to
`http://127.0.0.1:18080/v1` and the issuer to `http://127.0.0.1:18080`. *Open
sign-in* then opens the mock's authorize page, which redirects straight to
the `127.0.0.1:1455` callback; paste that address back. The mock answers
`/v1/responses` with the same scenarios (plus `overflow`, which Claude Code
answers by compacting the conversation, `hit the usage limit` and `hit the
rate limit`), checks
every request the way OpenAI's preview does (no `role: "system"` items,
`store: false`, `stream: true`, no `max_output_tokens`/`temperature`/`metadata`,
no Codex headers) and the way `/v1/responses` validates its input (every tool
call answered, reasoning items followed by their output, content types per
role), and logs what it saw at `/__requests`. `?trace` in the page URL logs
every spawn and fetch the CLI makes (with its abort signal); `?debug` adds the
CLI's own debug output. Both show in the page log.

```sh
npm run dev                         # vite dev server for UI work: add ?fake to the URL
                                    # (a scripted fake worker; the real one needs the build)
npm test                            # unit tests (node --test)
npm run build && npm run test:e2e   # the acceptance test in headless Chromium
node test/e2e.mjs --base /vibe-dump/claude-code-web/   # the same under the Pages sub-path
node test/e2e.mjs --fake            # the page flow against the fake worker
node test/e2e.mjs --provider chatgpt   # the same acceptance run in ChatGPT mode (sign-in by paste,
                                    # the Worker's OpenAI adapter against the mock's /v1/responses,
                                    # plus a refused token, usage/rate limits and overflow/compaction)
```

The tests never keep any of Anthropic's code in this repository: the ones
that need the official binary, the reference extraction or the Agent SDK read
them from one research directory, **`CC_RESEARCH_DIR`** (default: the
scratchpad of the session that built this package; see
[`test/research.mjs`](./test/research.mjs)), and skip when it is absent.
That includes the drift alarms (pinned rewrite counts, bundle surface). The
acceptance test drops `$CC_BINARY` (default:
`$CC_RESEARCH_DIR/pkg-linux-x64/package/claude`).

The e2e opens the page as `index.html?test`: only then does the page define
`window.__cc`, its test hook. Other e2e options: `--log <file>` saves the page
log of every page it opened, `--trace` adds `?trace`, and
`--interrupt-loops N` repeats the interrupt check N times.

The design contract is [ARCHITECTURE.md](./ARCHITECTURE.md); the page ⇄
Worker messages are specified in
[src/host/worker-protocol.md](./src/host/worker-protocol.md).

| directory | what |
|---|---|
| `src/extract/` | tar/gunzip, the Bun payload parser, the rewrites, the cache |
| `src/runtime/` | Node built-in shims, the Bun polyfill, the Worker bootstrap |
| `src/host/` | the stream-json driver (`harness.js`), the MCP server for page tools, the Worker bridge, the session, Sign in with ChatGPT (`siwc.js`) |
| `src/ui/` | the page |
| `mock/` | the mock API used by the tests |
