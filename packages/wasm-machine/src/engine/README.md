# wasm-machine engine — API reference

A hand-written, steppable WebAssembly interpreter built for visualisation.
Pure ES modules, no dependencies, no DOM: runs unchanged in Node and the
browser. Import everything from `index.js`:

```js
import { assemble, decode, validate, instantiate, load, runWasi } from './engine/index.js'
```

| file          | what it does |
| ------------- | ------------ |
| `decode.js`   | binary → module object, byte offsets everywhere, annotated byte tree |
| `validate.js` | full type checking (WebAssembly 2.0 algorithm), block/branch annotations, static type stacks |
| `wat.js`      | WAT text → bytes + source map |
| `disasm.js`   | module → structured WAT listing lines |
| `machine.js`  | instances, the interpreter (`Machine`), traps, store objects |
| `hosts.js`    | default imports: WASI preview1 subset, `env` helpers, `spectest`, recording stubs |
| `values.js`   | value representation, NaN boxing, formatting |
| `opcodes.js`  | the shared opcode table |

**Supported:** WebAssembly 1.0 MVP, sign-extension ops, saturating
float→int (`0xFC 0–7`), multi-value, bulk memory (`memory.copy/fill/init`,
`data.drop`, `table.copy/init`, `elem.drop`), reference types (`ref.null`,
`ref.is_null`, `ref.func`, `table.get/set/grow/size/fill`, typed `select`,
multiple tables, externref), and extended-const arithmetic in constant
expressions. **Rejected by name** (a `WasmFeatureError` whose `.feature`
reads e.g. `"SIMD (128-bit vectors)"`): SIMD, threads/atomics/shared memory,
GC, exception handling, tail calls, typed function references, memory64,
multi-memory, custom page sizes, the component model.

---

## 1. Two quick examples

### (a) Step through a function with animation data

```js
import { assemble, instantiate, formatValue } from './engine/index.js'

const { bytes, sourceMap } = assemble(`(module
  (func $sq (param $x i32) (result i32) (i32.mul (local.get $x) (local.get $x)))
  (func (export "main") (param $a i32) (result i32)
    (i32.add (call $sq (local.get $a)) (i32.const 1))))`)

const m = instantiate(bytes)
m.invoke('main', [7])                     // sets up the frame; nothing executed yet
let ev
while ((ev = m.step())) {                 // exactly one instruction per call
  const src = sourceMap.funcs[ev.funcIndex][ev.pc]   // WAT range to highlight
  console.log(
    ev.instr.op.padEnd(10),
    'pop', ev.popped.map((v) => formatValue(v.type, v.value)),
    'push', ev.pushed.map((v) => formatValue(v.type, v.value)),
    ev.control?.kind ?? '',
    `bytes ${ev.offset}..${ev.offset + ev.instr.len}`, `src ${src.line}:${src.col}`)
}
console.log(m.status, m.results)          // 'done' [{ type: 'i32', value: 50 }]
while (m.stepBack());                     // rewind to the post-invoke state
```

### (b) Load arbitrary bytes and run with WASI output

```js
import { load, runWasi } from './engine/index.js'

// one-shot
const r = runWasi(bytes, { args: ['prog', 'x'], stdout: (text) => term.write(text) })
console.log(r.exitCode, r.stdout, r.host.unresolved)

// or keep control for stepping
const { module, machine, host } = load(bytes, { stdout: (t) => term.write(t) })
if (host.unresolved.length) warn(host.unresolved)      // imports satisfied by stubs
machine.invoke(machine.exports._start ? '_start' : 'main')
const res = machine.run({ maxSteps: 5_000_000 })        // { reason, steps, ... }
if (res.reason === 'max-steps') { /* keep calling run() from a rAF loop */ }
if (machine.status === 'exited') console.log('exit code', machine.exitCode)
if (machine.status === 'trapped') console.log(machine.trap.kind, machine.trap.message)
```

---

## 2. Values

| wasm type   | JS representation |
| ----------- | ----------------- |
| `i32`       | number, always a signed int32 (`x \| 0`); unsigned view: `x >>> 0` |
| `i64`       | BigInt, always signed (`BigInt.asIntN(64, x)`) |
| `f32`/`f64` | number, **or a `NaNBox`** for NaNs read from bits (consts, loads, reinterpret, neg/abs/copysign of a NaN) |
| `funcref`   | `null` or a `FuncInst` |
| `externref` | `null` or any host JS value |

`NaNBox { type:'f32'|'f64', hi, lo }` coerces to `NaN` (`valueOf`), so
arithmetic just works, but keeps the exact payload so stores/reinterprets are
bit exact. A plain JS `NaN` means the canonical positive quiet NaN. **Never
compare floats with `===` / `!==` / `isNaN(x)` without `+x` first**; use the
helpers:

- `formatValue(type, value)` → `"42"`, `"-0"`, `"nan:0x200000"`, `"inf"`,
  `"ref.func sq"`, `"ref.null extern"`; f32 prints the shortest decimal that
  reads back as the same f32 (`0.1`, not `0.10000000149011612`).
- `valueHex(type, value)` → raw bit pattern, e.g. `"0x7fc00000"`.
- `sameValue(type, a, b)` → bit-exact equality.
- `f32Bits(x)` → uint32 pattern; `f64Words(x)` → `[hi, lo]` uint32 words.
- `NaNBox` class (for `instanceof`).

Everywhere the engine hands out a value with its type, it is a **typed value**
`{ type, value }`.

---

## 3. Decoding — `decode.js`

### `decode(bytes, { annotate = false, annotateBodies = true } = {}) → module`

`bytes`: `Uint8Array` or `ArrayBuffer`. Throws `WasmDecodeError`
(`.offset`, `.rawMessage`; message ends with `(at byte 0x…)`) or its
subclass `WasmFeatureError` (`.feature`). Does **not** validate — call
`validate(module)` (or let `instantiate` do it).

**Module object**

```text
{
  bytes: Uint8Array, version: 1,
  sections: [{ id, name, offset, size, contentOffset, end, customName? }],   // offset = section id byte
  types:   [{ index, params: [valtype], results: [valtype], offset }],
  imports: [{ module, name, kind: 'func'|'table'|'memory'|'global', offset,
              index,                    // index in its own index space
              typeIndex?,               // func
              desc? }],                 // table {elemType,min,max} | memory {min,max} | global {type,mut}
  funcs:   [{ index, typeIndex, type, import: importObj|null, body: Body|null }],  // imports first
  tables:  [{ index, elemType, min, max, import, offset? }],
  memories:[{ index, min, max, import, offset? }],     // pages; max null = unbounded
  globals: [{ index, type, mut, init: [instr]|null, import, offset? }],
  exports: [{ name, kind, index, offset }],
  start:   funcIndex | null,
  elems:   [{ index, mode: 'active'|'passive'|'declarative', table, offset: [instr]|null,
              elemType, init: [[instr]], fileOffset }],
  datas:   [{ index, mode: 'active'|'passive', memory, offset: [instr]|null,
              bytes: Uint8Array, fileOffset, bytesOffset }],
  dataCount: number | null,
  customs: [{ name, offset, contentOffset, size, bytes }],
  names:   { module, funcs: Map, locals: Map<funcIdx, Map>, labels, types, tables,
             memories, globals, elems, datas },   // from the "name" custom section
  numImportedFuncs, numImportedTables, numImportedMemories, numImportedGlobals,
  warnings: [string],       // e.g. a malformed name section (ignored, not fatal)
  annotations?: Node,       // with { annotate: true }
  // added by validate(): validated: true, refs: Set<funcIndex>
}
```

valtype strings: `'i32' 'i64' 'f32' 'f64' 'funcref' 'externref'`.

**Body**

```text
{ offset,          // of the body-size LEB
  size, start, end, // body bytes are [start, end)
  localsOffset, locals: [{ count, type, offset }],
  localTypes: [valtype],   // params followed by declared locals — index = local index
  codeOffset,      // first instruction byte
  code: [Instr],   // the last one is the function's final `end`
  blk }            // (after validate) the function-level block descriptor
```

**Instr** — `{ op, code, offset, len, ...immediates }`

- `op` mnemonic (`'i32.add'`), `code` internal number (single-byte opcodes
  keep their byte; `0xFC n` → `0xE0 + n`), `offset`/`len` = exact byte range
  in the file (for hex highlighting).
- immediates by kind: `bt` `{ raw: 'empty'|valtype|typeIndex, params, results }`
  (block/loop/if); `depth` (br, br_if); `targets`, `deflt` (br_table);
  `func` (call, ref.func); `type`, `table` (call_indirect); `local`;
  `global`; `table` (+ `table2` for table.copy src, `elem` for table.init);
  `align` (log2), `memOffset` (loads/stores); `mem` (`mem2`);
  `value` (consts: number / BigInt / NaNBox); `types` (typed select);
  `refType` (ref.null); `data` (memory.init / data.drop); `elem` (elem.drop).
- added by `validate`: `pops` (operand count, `-1` for br/br_if/br_table/
  return/end/else) and `blk` on block/loop/if/else/end:
  `{ kind: 'block'|'loop'|'if'|'func', start, else, end, params, results }`
  (instruction indices, `-1` when absent; params/results are arities).

### `annotate(bytes, { annotateBodies = true }) → Node`

The annotated byte walk for a binary-format explainer. Tree of
`{ start, end, label, kind, children?, value? }` (byte range `[start, end)`).
Leaves tile the whole file with no gaps (tested). `kind` is one of
`module section byte leb field valtype limits functype string magic version
import table memory global export elem body locals code instr opcode
blocktype float bytes expr data header subsection group`. Labels read like
`"magic \"\\0asm\" (00 61 73 6d)"`, `"section size = 37 bytes (LEB128)"`,
`"vec length = 3 types (LEB128)"`, `"functype (i32,i32)->i32"`,
`"i32.const 42"` with children `"opcode 0x41 = i32.const"`,
`"i32 literal 42 (signed LEB128)"`. Use `annotateBodies:false` for
multi-megabyte binaries (skips per-instruction nodes; each body is one
`code` node).

### Helpers

- `findInstrAt(module, byteOffset) → { funcIndex, pc } | null` — which
  instruction a hex-view byte belongs to.
- `funcName(module, index)` — name section, else first export name, else
  `"module.field"` for imports, else `null`.
- `instrText(instr)` — short text with numeric immediates.

---

## 4. Validation — `validate.js`

### `validate(module) → module`

Full type checking. Throws `WasmValidationError` with `.rawMessage` and,
for code, `.funcIndex .funcName .pc .op .offset` (message:
`function $add, instruction 3 (i32.add), byte 0x2f: type mismatch: expected i32 but found f64`).
Annotates instructions in place (`pops`, `blk`, block-type params/results)
and sets `module.validated`. Constant expressions follow WebAssembly 2.0
(`global.get` only of imported immutable globals). `instantiate` calls it
for you when `module.validated` is not set.

### `functionTypeStacks(module, funcIndex) → [{ stack, unreachable, depth }]`

The **static operand-type stack before each instruction** (index = pc):
`stack` is an array of valtypes, with `null` meaning "any" (polymorphic slot
after `unreachable`/`br`), `unreachable` whether that code is dead, `depth`
the number of enclosing control frames including the function.

---

## 5. Text format — `wat.js`

### `assemble(text) → { bytes, sourceMap }`  ·  `wat2wasm(text) → bytes`

Throws `WatError` with `.line .col .start .end` (character offsets) and
`.rawMessage`.

Covered: `module` (optionally `$name`, or `(module binary "…")`), `type`,
`func` (named params/locals/results, inline `(export)`/`(import)`, type uses),
`import`, `export`, `memory` (incl. inline `(data …)`), `data` (active/passive,
`(memory x)`, `(offset …)`), `table` (incl. inline `(elem …)`), `elem` (active /
passive / `declare`, func-index lists and expression lists, `(item …)`),
`global` (`(mut t)`), `start`; flat and folded instructions; `block/loop/if/
else/end` with labels, `end $label` checks, block types incl. multi-value via
`(type $t)` or inline `(param …)(result …)`; `$names` for funcs, locals,
globals, tables, memories, types, labels, elems, datas; numeric literals
(decimal, hex, `_` separators, signs, hex floats, `inf`, `nan`,
`nan:0x…`; floats are correctly rounded, f32 included); `offset=`/`align=`;
`;;` and nested `(; ;)` comments. Not supported: `(module quote …)`,
annotations `(@…)`, quoted `$"…"` ids, any of the rejected proposals (which
fail with a "this module uses <feature>" `WatError`). Output matches wabt on
all 1113 spec-testsuite modules (1027 byte-identical, the rest equal up to
implicit type order).

Emits a `name` section (module, functions, locals, types, tables, memories,
globals, elems, datas) so decode/disasm/machine show your names.

**Source map**: `sourceMap.funcs[funcIndex][pc]` →
`{ start, end, line, col, endLine, endCol, keyword: {start,end,line,col,…}, op }`
for every instruction of every defined function (imports have no entry);
`pc` matches `module.funcs[funcIndex].body.code`. Flat instructions map to
`keyword + immediates`; folded ones to the whole `( … )`; a folded
`block/loop/if` maps to its header `(if $l (result i32)`, the folded `end` to
its closing `)`, and each function's final `end` to the function's `)`.
Ranges nest, so highlight the innermost.

---

## 6. Disassembly — `disasm.js`

### `disassembleFunction(module, funcIndex) → [Line]`  ·  `disassemble(module, { maxData = 64 }) → [Line]`

`Line = { kind, depth, text, pc, offset, len, funcIndex }`

- kinds: `module type import func local instr end table memory global
  export start elem data`.
- function listings: a `func` header (with inline exports, `(type …)`,
  named params), `local` lines, one `instr` line per instruction (`pc`,
  `offset`, `len` set; `else`/`end` included) and a final `end` line `)`
  carrying the last instruction's pc. So *every* pc has exactly one line.
- names: name section, then export names, then `module.field` for imports —
  sanitised and de-duplicated so the text re-assembles. Branches read
  `br_if 1 (;@0;)` and blocks carry `;; label = @0`.
- `disassemble` lists the whole module; data longer than `maxData` bytes is
  truncated with a block comment (pass `Infinity` for re-assemblable output:
  round-trips on all 1236 spec binaries).
- `linesToText(lines)` renders with two spaces per depth.

---

## 7. Instantiation and the Machine — `machine.js`

### `instantiate(moduleOrBytes, imports = {}, options = {}) → Machine`

Decodes (if given bytes), validates (if needed), links, creates the
instance, applies active element then data segments, and handles the start
function. Throws `LinkError` (missing/incompatible import), `Trap` (segment
out of bounds, or the start function trapped), `ProcExit`, or decode /
validation errors.

`imports` = `{ moduleName: { field: value } }` where value is:

- **func**: a plain JS function called as `fn(...args)` (i64 args are
  BigInt; return a value, an array for multi-value, or nothing), a function
  wrapped with `hostFunction(fn)` which is called as `fn(caller, ...args)`
  (see *Caller API*), or a `FuncInst` exported by another machine (cross
  instance calls then run as real frames inside the calling machine).
- **memory**: a `Memory`, or `{ min, max }` to create one.
- **table**: a `Table`. **global**: a `Global`, or a plain number/BigInt for
  an immutable numeric global.

`options` (all optional):

| option | default | meaning |
| ------ | ------- | ------- |
| `history` | `10000` | undo records kept for `stepBack()`; `0` disables |
| `maxCallDepth` | `10000` | frames before `call-stack-exhausted` |
| `maxValueStack` | `1048576` | value-stack slots before `call-stack-exhausted` |
| `maxMemoryPages` | `16384` (1 GiB) | engine cap; `memory.grow` beyond it returns -1 |
| `start` | `'run'` | start section: `'run'` during instantiate, `'pending'` (leave it invoked and ready to step), `'skip'` |
| `onMissingImport(imp)` | — | return a value for an import not in `imports` |

### Machine properties

| property | |
| -------- | - |
| `status` | `'idle'` (no call) · `'ready'` (next `step()` executes something) · `'done'` · `'trapped'` · `'exited'` (proc_exit) |
| `results` | `[typed value]` when `'done'`, else `null` |
| `trap` | `{ kind, message, funcIndex, pc, offset, error }` when `'trapped'` (pc = the faulting instruction, state is as it was *before* it) |
| `exitCode` | when `'exited'` |
| `steps` | instructions executed since `invoke` (decremented by `stepBack`) |
| `location` | next instruction `{ funcIndex, pc, instr, offset, inst }` or `null` |
| `stack` | value stack bottom→top, `[typed value]` (a copy) |
| `stackHeight` | number of values |
| `callStack` | frames bottom→top: `{ funcIndex, name, sameInstance, pc, instr, offset, locals: [{ index, type, value, name, isParam }], stackBase, stackHeight, labels: [{ kind, height, start, else, end, arity, depth }], resultTypes }` — `stackBase..+stackHeight` is the frame's slice of `stack`; `labels` innermost last, `depth` = branch depth that targets it, the first is the function label |
| `memory` | `Memory` (`bytes: Uint8Array`, `pages`, `max`, `view: DataView`, `byteLength`) — re-read `bytes` after `memory.grow`, it is replaced |
| `globals` / `tables` | `[Global]` (`{ type, mut, value }`) / `[Table]` (`{ elemType, max, elements: [ref], length }`) |
| `instance` | `{ module, funcs: [FuncInst], tables, memories, globals, elems: [{ refs, dropped }], datas: [{ bytes, dropped }], exports }` |
| `exports` | `{ name: FuncInst | Memory | Table | Global }` |
| `module` | the decoded module |
| `historySize`, `canStepBack`, `breakpoints` | |

### Machine methods

- **`invoke(nameOrIndexOrFuncInst, args = []) → this`** — clears stacks and
  history, pushes the callee frame with its parameters in its locals; status
  `'ready'`; nothing is executed. Args are coerced (`i64` accepts number or
  BigInt). Invoking a *host* function runs it immediately (status `'done'`).
- **`step() → Event | null`** — executes exactly one instruction. Never
  throws for traps or host errors (they become a trap event). `null` when
  status is not `'ready'`.
- **`run({ maxSteps = Infinity, breakpoints, until, record } = {}) → RunResult`**
  — fast loop without events.
  - `breakpoints`: array overriding the persistent ones for this run (`[]` = none).
  - `until(machine)`: checked *before* each instruction; stop when true.
  - `record` (default `true` when `history > 0`): keep undo records so you
    can `stepBack()` afterwards. ~7 M instr/s with, 25–45 M instr/s without
    (`step()` with full events: ~2.5 M/s).
  - Breakpoints stop *before* the instruction, but never on the first
    instruction of a run — so calling `run()` again continues.
  - `RunResult = { reason, steps, location, results?, trap?, exitCode? }`,
    `reason ∈ 'done' 'trap' 'exit' 'breakpoint' 'until' 'max-steps' 'step-complete' 'idle'`.
- **`stepOver(opts) → { event, run } | null`** — one `step()`; if that
  entered a wasm callee, runs until it returns (`run.reason ===
  'step-complete'`, or `'breakpoint'` etc. if stopped early; pass
  `breakpoints: false` to ignore breakpoints).
- **`stepOut(opts) → RunResult | null`** — run until the current frame returns.
- **`stepBack() → { funcIndex, pc, instr, offset } | null`** — undo one
  step (including trap/exit steps); returns the instruction that is next
  again. Restores value stack and types, frames, labels, locals, globals,
  memory bytes, memory size after `memory.grow`, tables (incl. `table.grow`),
  dropped segments, status/trap/results. `null` when history is empty.
- **`setBreakpoints([{ funcIndex, pc } | { offset }])`** — persistent;
  `offset` may be any byte inside an instruction.
- **`call(target, args) → [JS values]`** — invoke + run to completion;
  throws the `Trap` / `ProcExit`. Uses this machine (clearing its state)
  unless it is busy, in which case it behaves like `callSync`.
- **`callSync(target, args) → [JS values]`** — runs on a temporary child
  machine sharing the instance (safe from inside host functions; not
  recorded in this machine's history).
- **`exportedFunction(name) → (...args) => value`** — JS wrapper (child machine).
- **`snapshot()`** — deep copy of all mutable state (tests, time travel).
- **`reset()`** — rebuild memories/tables/globals/segments from the module
  (imported objects are left as they are), clear stacks/history, re-run or
  re-arm the start function. `exports`/`instance` objects are replaced.

### Step events

```text
{
  step,                 // machine.steps after this instruction
  instr, funcIndex, pc, offset,   // the instruction executed (before-state location)
  instance,             // the Instance whose code ran (differs only for cross-instance calls)
  popped: [typed],      // operand values consumed, bottom→top
  pushed: [typed],      // values produced, bottom→top
  control: Control | null,
  status, done, results,          // done = the outermost call returned; results then set
  nextPc,               // pc of the next instruction in the (new) top frame, or null
  // present only when relevant:
  localRead:   { index, type, value }
  localWrite:  { index, type, old, value }
  globalRead:  { index, type, value }
  globalWrite: { index, type, old, value }
  memRead:     { addr, len, bytes }      // loads; memory.copy source (bytes: null)
  memWrite:    { addr, len, before: Uint8Array, after: Uint8Array }  // stores, fill, copy, init, host writes
  memWrites:   [memWrite, …]             // when a host function wrote several ranges
  memGrow:     { delta, oldPages, newPages, failed }
  tableRead:   { table, index, value }
  tableWrite:  { table, index, len, before: [ref], after: [ref] }
  tableGrow:   { table, delta, oldSize, newSize, failed }
  dropped:     { kind: 'data'|'elem', index }
}
```

For branches and returns, `popped` holds *every* value removed (the carried
results plus the unwound values plus the condition/index), `pushed` the
carried results at their new position.

`Control` kinds:

| kind | fields |
| ---- | ------ |
| `enter-block` | `blockKind` (`block`/`loop`/`if`), `start`, `end`, `depth` (nesting, 1 = directly in the body); for `if`: `taken`, `else`, `to` |
| `exit-block` | `blockKind`, `start`, `end` (an `end` that closes a block) |
| `branch` | `taken`, `depth`, `from`, `to`, `labelKind`, `kept`, `unwound`; not-taken br_if: `{ taken:false, depth, from, to }`; `else` reached at the end of a then-arm: `{ implicit:true, reason, from, to }` (jumps to the `end`) |
| `return` | `fromFunc`, `toFunc` (null when the outermost call returned), `to` (caller pc), `results`; `viaBranch` when a `br` targeted the function label |
| `call` | `funcIndex`, `name`, `args`, `indirect`, `elemIndex` (indirect), `crossInstance` |
| `host-call` | `funcIndex`, `name`, `module`, `field`, `args`, `results`, `unresolved` (a stub from hosts.js ran), `indirect` |
| `trap` | `trap: { kind, message }` (also `event.trap`) |
| `exit` | `exitCode` (proc_exit / env.exit) |

An `if` whose condition is false jumps to its `else`-arm, or to its `end`
when there is none (so the next step is the `exit-block`).

### Traps

`Trap extends Error` with `.kind`:
`unreachable`, `integer-divide-by-zero`, `integer-overflow`,
`invalid-conversion`, `out-of-bounds-memory`, `out-of-bounds-table`,
`undefined-element` (call_indirect index ≥ table size),
`uninitialized-element` (null entry), `indirect-call-type-mismatch`,
`call-stack-exhausted`, `host-error` (a host function threw; `.cause`),
`host-abort` (env.abort / __assert_fail). Messages start with the
spec-testsuite wording (`"integer divide by zero"`, …) plus detail.
`TRAP_MESSAGES` maps kinds to base messages.

### Host functions — Caller API

`hostFunction((caller, ...args) => result, extraProps?)` marks a JS function
to receive a `caller`:

- `caller.memory` — the calling instance's `Memory`
- `caller.read(addr, len) → Uint8Array` (copy; traps if out of bounds)
- `caller.write(addr, bytes)` — **recorded in the undo log**; write through
  this, not `memory.bytes` directly, if stepping back must undo it
- `caller.u32(addr)`, `caller.setU32(addr, v)`, `caller.setU64(addr, v)`,
  `caller.string(addr, len)`, `caller.cstring(addr)`
- `caller.machine`

Throw `new Trap(kind, msg)` to trap, `new ProcExit(code)` to exit.

### Store classes

`Memory({ min, max })` (`grow(delta) → old | -1`), `Table({ elemType, min,
max })`, `Global({ type, mut }, value)`, `FuncInst` (`{ type, typeKey,
inst, index, host, name, module, field, unresolved }`), `LinkError`,
`ProcExit` (`.code`), `PAGE_SIZE`.

---

## 8. Default imports — `hosts.js`

### `createImports(module, opts) → { imports, unresolved, calls, output, wasi, setStdin }`

Builds an imports object for *any* module. `opts`: `imports` (yours, checked
first), `stdout(text, bytes)`, `stderr(text, bytes)`, `stdin`
(string/Uint8Array), `args` (default `['program']`), `env` (object), `now()`
(BigInt ns), `random(n)`, `onUnresolved(call)`.

- **WASI preview1** (`wasi_snapshot_preview1` / `wasi_unstable`): `fd_write`
  (fd 1/2 → callbacks, UTF-8 streamed), `fd_read` (fd 0 from `stdin`),
  `proc_exit`, `args_sizes_get/args_get`, `environ_sizes_get/environ_get`,
  `clock_time_get`, `clock_res_get`, `random_get`, `fd_close`, `fd_seek`
  (ESPIPE on stdio), `fd_fdstat_get` (char device for 0–2),
  `fd_fdstat_set_flags`, `fd_prestat_get`/`fd_prestat_dir_name` (EBADF: no
  preopens), `sched_yield`. Matching is by name *and* signature. Other WASI
  functions become stubs returning `ENOSYS` (52) and are listed as
  unresolved.
- **env**: `abort` (AssemblyScript message decoding), `exit`,
  `__assert_fail`, `putchar`, `puts`, `emscripten_notify_memory_growth`,
  `emscripten_memcpy_big`, `seed`; any `print*`/`log*`/`debug*`/`trace*`
  function with numeric params and no results prints its arguments.
- **spectest**: `print*`, `global_i32/i64/f32/f64` (666 / 666.6),
  `table` (10..20 funcref), `memory` (1..2 pages).
- **anything else**: a function stub that records `{ module, name, args,
  results }` into `calls`, calls `onUnresolved`, returns zeros of the right
  types; events show it as `host-call` with `unresolved: true`. Memories,
  tables and globals are created from their declared limits / zero values.
  All of these appear in `unresolved: [{ module, name, kind }]`.
- `output.stdout` / `output.stderr` accumulate all text.

### `load(bytes, opts) → { module, machine, host }` (in `index.js`)

`decode` + `validate` + `createImports(module, opts)` + `instantiate(module,
host.imports, opts.machine)`.

### `runWasi(bytes, opts) → { exitCode, stdout, stderr, result, machine, host }`

Runs `_start` (or `main`, or `opts.entry`) to completion with history off.
`exitCode` is the proc_exit code, `0` if the entry returned, `null` if it
trapped (see `machine.trap`) or hit `opts.maxSteps`.

---

## 9. Things the UI should know

- **Float values may be `NaNBox` objects** — always render with
  `formatValue`, compare with `sameValue`.
- **`invoke()` and `call()` clear the machine** (stacks, history, trap).
  Use a second `instantiate`/`Machine` or `callSync` for side calculations.
- `memory.bytes` is **replaced** on `memory.grow` (and on `stepBack` over a
  grow); never cache it across steps.
- `run()` records undo history by default (when `history > 0`), which costs
  ~4–6× speed; pass `record: false` for maximum speed when you don't need to
  rewind (stepBack history then ends at the run's start).
- History is bounded (`history` option, default 10 000 steps); each record
  for a bulk memory op stores the overwritten bytes, so a `memory.fill` of
  1 MB keeps 1 MB alive until it falls out of the ring.
- Host side effects are not undone except memory written via
  `caller.write` (stdout text already emitted stays emitted).
- Event `funcIndex` / `pc` refer to `event.instance.module` — the same as
  `machine.module` unless a call crossed into another instance.
- `step()` on a trapping instruction returns a trap event and leaves the
  state exactly as before that instruction (pc still points at it);
  `stepBack()` clears the trap.
- Branch targets in events: `control.to` is the next pc; loops jump to
  `start + 1`, blocks to `end + 1` (skipping the `end`).
- A start-section function runs inside `instantiate` by default; use
  `{ start: 'pending' }` to step through it (it is then the current call —
  invoking anything else abandons it).
- Large binaries: decoding a 1 MB Rust binary takes ~150 ms and validation
  ~80 ms; use `annotate(bytes, { annotateBodies: false })` for its hex view.

---

## 10. Tests and spec conformance

```bash
npm test -w @vibe-dump/wasm-machine     # node --test test/*.test.mjs
```

Differential tests assemble WAT with `wat.js`, run the bytes through Node's
native `WebAssembly` and through the machine, and compare results, traps and
memory (every numeric opcode over edge + random operands, control flow,
memory/bulk/table ops, imports, real clang- and rustc-produced binaries),
plus step-back/replay, events, the assembler, decoder and disassembler.

Official testsuite (not vendored): convert the
[WebAssembly/testsuite](https://github.com/WebAssembly/testsuite) `.wast`
files with wabt's `wast2json` (one directory per file), then

```bash
node tools/spec-runner.mjs <json-root> [--mode=run|record|step|undo]
node tools/wat-crosscheck.mjs <wast-dir> <json-root>   # assembler vs wabt, disasm round trip
```

`--mode=undo` runs each invocation recording history, rewinds it all,
checks the state is exactly the post-invoke snapshot, then replays.

**Known deviations**: arithmetic producing a NaN returns the canonical NaN
(payload propagation is allowed but not done); NaN *inputs* are preserved
bit-exactly through moves, loads/stores, reinterprets and
neg/abs/copysign. Memory is capped at `maxMemoryPages`. Table size is capped
at 10 M entries. Constant expressions follow 2.0 (only imported globals).
