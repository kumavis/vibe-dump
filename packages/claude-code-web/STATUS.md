# claude-code-web — status

_Integration round 1, in progress. This file is refreshed after each step._

## Where things stand

- Tracks A (extract), B (Node shims), C (Bun polyfill) and D (page, host,
  mock, e2e) are finished and their unit tests pass individually.
- Integration wrote `src/runtime/boot.js` (+ `src/runtime/boot/`) and
  `public/sw.js`. An earlier, interrupted integration run reached a complete
  `say hi` turn in headless Chromium against the mock (system/init,
  assistant, result/success; exactly one `POST /v1/messages`).
- Current run: re-checking unit tests, build and the acceptance test.

## How to run

```bash
cd packages/claude-code-web
npm test             # unit tests (node --test "test/unit/*.test.mjs")
npm run build        # vite build + scripts/build-runtime.mjs -> dist/
npm run test:e2e     # acceptance test: headless Chromium + mock API
```
