# Automating Wasm Machine

For recording scripts and tests. Build first (`npm run build -w @vibe-dump/wasm-machine`)
and serve `dist/` with any static server.

## Presentation mode

Open the app with a `present` query parameter:

```
/?present&lesson=4&theme=light&motion=on
/?present&example=fib&theme=dark
/?present&lesson=10&view=binary
```

| parameter | effect |
| --------- | ------ |
| `present` | capture mode: no intro autoplay, no toasts or program-name chip, preferences are not saved |
| `lesson=N` | open tutorial lesson N (1–10) |
| `example=ID` | open a debugger example (`fib`, `sieve`, `reverse`, `dispatch`, `newton`, `bigmem`, `hello`) |
| `theme=dark\|light` | colour theme |
| `motion=on\|off` | animations |
| `view=machine\|binary` | starting view |

Hash deep links (`#lesson-3`, `#example-sieve`, `#debugger`) work with or without `present`.

## `window.__wasmMachine.api`

Every method returns a promise that resolves once the UI has **settled**: all
running animations finished and two frames painted. Methods that change
state resolve to `state()`.

| call | what it does |
| ---- | ------------ |
| `state()` | sync snapshot: `{ mode, view, lesson, phase, walk, program, status, steps, running, stack, frames, results, trap, beat, error }` |
| `settled()` | wait for animations to finish |
| `lesson(n)` | jump to tutorial lesson `n` |
| `example(id)` | load a debugger example |
| `step(n = 1, { gap })` | step `n` times with normal animations, `gap` ms extra pause between steps. In lessons 3 and 10 the first steps walk the validation / binary tour, exactly like the Step button |
| `back(n = 1, { gap })` | step back |
| `over()`, `out()` | step over / step out |
| `play({ gap = 400 })` | step until the call finishes (or traps) |
| `restart()`, `seek(stepNumber)` | rewind / jump on the timeline |
| `run({ speed, timeout })` | run with the transport; `speed` is an index into `SPEEDS` (`SPEEDS.length - 1` = max); resolves when it stops |
| `pause()` | pause a run |
| `invoke(name, args)` | invoke an export with JS values (BigInt for i64) |
| `mode('tutorial' \| 'debugger')`, `view('machine' \| 'binary')` | switch mode / view |
| `theme('dark' \| 'light')`, `motion(bool)`, `hex(bool)` | preferences |
| `pane(id)` | narrow layouts only: show `side`, `code`, `stack`, `frames`, `store` or `bytes` |
| `spotlight(name)` | outline a pane (`code`, `bytes`, `stack`, `frames`, `labels`, `store`, `memory`, `tables`, `output`, `globals`) or `null` |
| `canStep()` | whether a step would do anything |
| `LESSONS`, `SPEEDS` | lesson ids/titles, run speeds in instructions per second |

Example (Playwright):

```js
await page.goto(`${base}/?present&lesson=7&theme=dark&motion=on`)
await page.waitForFunction(() => window.__wasmMachine?.api)
const api = (fn, ...a) => page.evaluate(([fn, a]) => window.__wasmMachine.api[fn](...a), [fn, a])
await api('step', 9, { gap: 600 })    // into the first recursive call
await api('play', { gap: 500 })        // and on to the result
```

Lower level, `window.__wasmMachine` is the app object (`session`, `tutorial`,
`codePane`, `stack`, `frames`, `store`, `act(kind)`), for tests only.

## Portrait capture

Tall portrait viewports (height ≥ 900 CSS px) stack the narration, code,
operand stack + frames, and bytes + store so all are visible at once.
540×960 at DPR 2 and 1080×1920 at DPR 1 both render that layout; at
1080×1920 the layout is scaled 1.8× so it reads like the phone version.
