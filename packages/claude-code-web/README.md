# Claude Code Web

The official Claude Code harness, running in a browser tab. You give the page
your own copy of Claude Code; it pulls the JavaScript out of the binary, runs
it in a Web Worker on top of small Node and Bun compatibility layers, and
talks to it the way the Claude Agent SDK does. There is no server: the only
network traffic is between your browser and the Anthropic API (or whatever
base URL you set).

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

   Keys and tokens are kept in this browser's `localStorage` and are sent
   only to the API base URL.
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

## What does not work (v1)

- **No shell.** The Bash tool is disabled; nothing can be installed or run.
  `git` is absent too. Read, Write, Edit, Glob and Grep work on the in-browser
  filesystem.
- **No WebFetch or WebSearch**, and no MCP servers other than the page's own
  tools.
- **No interactive TUI.** No slash-command UI, `/login`, plan mode UI, hooks,
  plugins or marketplace, background sessions, image resizing, clipboard or
  voice.
- **Conversations are not kept** across reloads (only the workspace is).
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
workspace) or `stream slowly` (then Interrupt). `?trace` in the page URL logs
every spawn and fetch the CLI makes; `?debug` adds the CLI's own debug output.
Both show in the page log.

```sh
npm run dev                         # vite dev server for UI work: add ?fake to the URL
                                    # (a scripted fake worker; the real one needs the build)
npm test                            # unit tests (node --test)
npm run build && npm run test:e2e   # the acceptance test in headless Chromium
node test/e2e.mjs --base /vibe-dump/claude-code-web/   # the same under the Pages sub-path
node test/e2e.mjs --fake            # the page flow against the fake worker
```

The acceptance test drops the binary from `$CC_BINARY` (default: the research
scratchpad copy); `--log <file>` saves the page log of every page it opened.

The design contract is [ARCHITECTURE.md](./ARCHITECTURE.md); the page ⇄
Worker messages are specified in
[src/host/worker-protocol.md](./src/host/worker-protocol.md).

| directory | what |
|---|---|
| `src/extract/` | tar/gunzip, the Bun payload parser, the rewrites, the cache |
| `src/runtime/` | Node built-in shims, the Bun polyfill, the Worker bootstrap |
| `src/host/` | the stream-json driver (`harness.js`), the MCP server for page tools, the Worker bridge, the session |
| `src/ui/` | the page |
| `mock/` | the mock API used by the tests |
