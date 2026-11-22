// The tutorial: ten lessons, each a small WAT program and narration beats
// bound to machine steps. Pure data (no DOM) so test/lessons.test.mjs can
// assemble every program and check every beat against the real step trace.
//
// Beat fields:
//   at    machine.steps at which the beat becomes current (0 = before any step)
//   op    the instruction executed by step `at` (checked by the test)
//   w     instead of `at`: a position in the lesson's walk (validation / binary tour)
//   spot  pane to spotlight: code | bytes | stack | frames | labels | store | memory | tables | output | globals
//   text  narration; `code` and **bold** are the only markup

export const LESSONS = [
  {
    id: 1,
    title: 'The stack machine',
    wat: `(module
  (func $main (export "main") (result i32)
    i32.const 2
    i32.const 3
    i32.add
    i32.const 7
    i32.mul))`,
    invoke: { name: 'main', args: [] },
    beats: [
      { at: 0, spot: 'code', text: 'WebAssembly code runs on a **stack machine**. Instructions take their operands from the **operand stack** and push their results back onto it; there are no registers. This function computes (2 + 3) × 7. Press **Step** (→) to execute one instruction.' },
      { at: 1, op: 'i32.const', spot: 'bytes', text: '`i32.const 2` pops nothing and pushes the i32 value 2. The 2 is an **immediate**: it is part of the instruction\'s encoding (`41 02` in the Bytes strip), not taken from the stack.' },
      { at: 2, op: 'i32.const', spot: 'stack', text: 'Another constant. Two i32 values are on the stack, 3 on top. The next instruction, `i32.add`, has the type `[i32 i32] → [i32]`.' },
      { at: 3, op: 'i32.add', spot: 'stack', text: '`i32.add` popped both operands and pushed their sum, 5. Its operands are not named anywhere in the code: they are simply the top two values of the stack.' },
      { at: 4, op: 'i32.const', spot: 'stack', text: '`i32.const 7` pushed 7 on top of the 5 that `i32.add` left behind. The stack is now [5 7]: exactly the operands the next instruction, `i32.mul`, will pop. Step (→) to multiply, or back (←) to rewind.' },
      { at: 5, op: 'i32.mul', spot: 'stack', text: '`i32.mul` pops 5 and 7 and pushes 35. Each instruction\'s type fixes how many values it pops and pushes, so the stack height at every point in the code is known before the code runs.' },
      { at: 6, op: 'end', spot: 'code', text: '`end` closes the function body. The result type is `[i32]`, so exactly one i32 must remain on the stack: 35 is returned. Step back (←) to rewind, or go on to lesson 2.' },
    ],
  },
  {
    id: 2,
    title: 'Parameters, locals and the frame',
    wat: `(module
  (func $square_sum (export "square_sum")
    (param $x i32) (param $y i32) (result i32)
    (local $s i32)
    local.get $x
    local.get $y
    i32.add
    local.tee $s    ;; s = x + y, kept on the stack
    local.get $s
    i32.mul))`,
    invoke: { name: 'square_sum', args: [3, 4] },
    beats: [
      { at: 0, spot: 'frames', text: 'Invoking `square_sum(3, 4)` pushed a **frame**: the activation record of one call. Its **locals** are the **parameters**, initialised from the arguments, followed by the declared local `$s`, initialised to zero. They are indexed in that order: `$x` is local 0, `$y` local 1, `$s` local 2.' },
      { at: 1, op: 'local.get', spot: 'frames', text: '`local.get $x` pushes a copy of local 0. The local itself keeps its value.' },
      { at: 2, op: 'local.get', text: '`local.get $y` pushes 4.' },
      { at: 3, op: 'i32.add', text: 'The sum, 7, is on the stack.' },
      { at: 4, op: 'local.tee', spot: 'frames', text: '`local.tee $s` writes the top value into `$s` **and leaves it on the stack**. It does the work of `local.set` followed by `local.get` in one instruction.' },
      { at: 5, op: 'local.get', text: 'Read `$s` back. The stack is [7 7].' },
      { at: 6, op: 'i32.mul', text: '7 × 7 = 49.' },
      { at: 7, op: 'end', spot: 'frames', text: 'The function returns 49 and its frame is popped. Locals exist only as long as their frame: every call gets fresh ones.' },
    ],
  },
  {
    id: 3,
    title: 'Types and validation',
    wat: `(module
  (func $mean (export "mean")
    (param $a f64) (param $b f64) (result f64)
    local.get $a
    local.get $b
    f64.add
    f64.const 2
    f64.div))`,
    invoke: { name: 'mean', args: [3, 4] },
    walk: { kind: 'validate', func: 0 },
    beats: [
      { w: 0, spot: 'code', text: 'Before a module can run, it is **validated**. The validator reads each function once, from top to bottom, keeping a **static type stack**: the types the operand stack will hold at that point, with no values. Step (→) to follow it.' },
      { w: 1, spot: 'stack', text: '`local.get $a`: local 0 is declared f64, so the type stack becomes [f64].' },
      { w: 2, text: '`local.get $b` adds another f64: [f64 f64].' },
      { w: 3, spot: 'stack', text: '`f64.add` needs `[f64 f64]` on top of the type stack. It finds them, pops both and pushes one f64.' },
      { w: 4, text: '`f64.const 2` pushes an f64.' },
      { w: 5, text: '`f64.div` also needs `[f64 f64]`, and finds it. The result is [f64].' },
      { w: 6, spot: 'code', text: 'At `end`, the function promises `[f64]` and the type stack is exactly [f64]: the function is valid. Because validation succeeded, no instruction can find an operand of the wrong type at run time, so the interpreter never checks types while it runs. Load the ill-typed version below to see a rejection, or step (→) to run `mean(3, 4)`.' , action: 'variant' },
      { at: 0, text: 'Now the module runs. The values on the stack have exactly the types the validator predicted at each point.' },
      { at: 3, op: 'f64.add', text: '3 + 4 = 7, an f64.' },
      { at: 5, op: 'f64.div', text: '7 ÷ 2 = 3.5.' },
      { at: 6, op: 'end', text: '`mean` returns 3.5. Floats follow IEEE 754: f32 is single precision, f64 double.' },
    ],
    variant: {
      label: 'Load the ill-typed version',
      wat: `(module
  (func $mean (export "mean")
    (param $a f64) (param $b f64) (result f64)
    local.get $a
    local.get $b
    f64.add
    i32.const 2     ;; an i32, but f64.div needs f64
    f64.div))`,
      text: 'Here the constant is `i32.const 2`. When the validator reaches `f64.div`, the type stack is [f64 i32]: the top operand is an i32 where an f64 is required. Validation fails with a **type mismatch** and the module is rejected before anything runs: it cannot be instantiated at all. Type errors in WebAssembly are found when the module is loaded, never in the middle of execution.',
    },
  },
  {
    id: 4,
    title: 'Blocks and branches',
    wat: `(module
  (func $sign (export "sign")
    (param $n i32) (result i32)
    block $neg (result i32)
      i32.const 99    ;; scratch, left here on purpose
      i32.const -1    ;; the result if $n < 0
      local.get $n
      i32.const 0
      i32.lt_s
      br_if $neg      ;; taken: exit carrying one i32
      drop
      drop
      i32.const 1
    end))`,
    invoke: { name: 'sign', args: [-5] },
    beats: [
      { at: 0, spot: 'code', text: 'WebAssembly has no `goto`. Control flow is **structured**: `block`, `loop` and `if` each have a **label**, and the branch instructions `br`, `br_if` and `br_table` name an enclosing label by its depth. A branch to a `block` label jumps **forward**, to just past the block\'s `end`. This function returns −1 for a negative argument and 1 otherwise; it is invoked with n = −5.' },
      { at: 1, op: 'block', spot: 'labels', text: 'Entering the block pushed a label. It records the operand stack **height** at entry (0) and the block\'s **arity**: one result, from `(result i32)`. The Labels pane lists it above the function\'s own label.' },
      { at: 2, op: 'i32.const', spot: 'stack', text: 'This 99 is scratch, left on the stack to show what a branch does with values it does not carry.' },
      { at: 3, op: 'i32.const', text: '−1: the result if n is negative.' },
      { at: 6, op: 'i32.lt_s', text: '−5 < 0 as signed integers, so `i32.lt_s` pushes 1.' },
      { at: 7, op: 'br_if', spot: 'stack', text: '`br_if` popped the condition 1 and branched. The label\'s arity is 1, so the branch **kept the top value** (−1) and **cut the stack back** to the label\'s height, 0, discarding 99 (shown as a ghost). Then it jumped forward, past `end`. The `drop`s never ran.' },
      { at: 8, op: 'end', text: 'The function returns −1. Change the argument to a non-negative number and invoke again: `br_if` falls through, the two `drop`s clear the stack, and `i32.const 1` becomes the block\'s result at its `end`.' },
    ],
  },
  {
    id: 5,
    title: 'Loops',
    wat: `(module
  (func $sum (export "sum") (param $n i32) (result i32)
    (local $acc i32)
    block $done
      loop $next
        local.get $n
        i32.eqz
        br_if $done     ;; n = 0: exit forward
        local.get $acc
        local.get $n
        i32.add
        local.set $acc  ;; acc += n
        local.get $n
        i32.const 1
        i32.sub
        local.set $n    ;; n -= 1
        br $next        ;; back to the top
      end
    end
    local.get $acc))`,
    invoke: { name: 'sum', args: [3] },
    beats: [
      { at: 0, spot: 'code', text: 'A `loop` also has a label, but a branch to a loop label jumps **backward**, to the start of the loop. That is the only way to repeat code. Compare lesson 4, where the branch went forward. This function adds n + (n−1) + … + 1, for n = 3.' },
      { at: 2, op: 'loop', spot: 'labels', text: 'Two labels are on the control stack. Depth 0 is the loop `$next`; depth 1 is the block `$done`. The same instruction, `br`, goes backward when it targets the first and forward when it targets the second.' },
      { at: 5, op: 'br_if', text: 'n is 3, not 0, so `i32.eqz` pushed 0 and `br_if $done` fell through.' },
      { at: 9, op: 'local.set', spot: 'frames', text: '`acc` is now 3.' },
      { at: 14, op: 'br', spot: 'code', text: '`br $next` jumped **back** to the first instruction of the loop. A branch to a loop label carries the loop\'s parameters (it has none), so the stack is cut back to the height the label recorded: empty.' },
      { at: 26, op: 'br', text: 'Second iteration done: acc = 5, n = 1.' },
      { at: 41, op: 'br_if', spot: 'code', text: 'n is 0, so `br_if $done` is taken. `$done` is a **block** label, so this branch goes **forward**, past the block\'s `end`, and the loop is over.' },
      { at: 43, op: 'end', text: 'Returned 6 = 3 + 2 + 1. A loop that never branches back runs once: falling through its `end` simply continues.' },
    ],
  },
  {
    id: 6,
    title: 'if/else and block results',
    wat: `(module
  (func $divmod (export "divmod")
    (param $a i32) (param $b i32) (result i32 i32)
    local.get $b
    i32.eqz
    if (result i32 i32)  ;; b = 0: give (0, 0)
      i32.const 0
      i32.const 0
    else
      local.get $a
      local.get $b
      i32.div_u
      local.get $a
      local.get $b
      i32.rem_u
    end))`,
    invoke: { name: 'divmod', args: [17, 5] },
    beats: [
      { at: 0, spot: 'code', text: '`if` pops an i32 condition. Non-zero runs the then-arm; zero jumps to the `else` arm. Like `block`, it has a label and a **block type**, here `(result i32 i32)`: with **multi-value**, blocks and functions can produce more than one result. Invoked as divmod(17, 5).' },
      { at: 2, op: 'i32.eqz', text: 'b is 5, so `i32.eqz` pushed 0.' },
      { at: 3, op: 'if', spot: 'code', text: '`if` popped 0. The condition is false, so execution skipped the then-arm and continued after `else`.' },
      { at: 6, op: 'i32.div_u', text: '17 ÷ 5 = 3, unsigned.' },
      { at: 9, op: 'i32.rem_u', spot: 'stack', text: '17 mod 5 = 2. Two i32 values sit above the label\'s height: exactly the block\'s result type.' },
      { at: 10, op: 'end', spot: 'labels', text: 'The `end` of the `if` popped its label. Both results stay on the stack. Had the then-arm run, reaching `else` would have jumped straight to this `end`.' },
      { at: 11, op: 'end', text: 'The function returns two values, (3, 2). Invoke divmod(17, 0) to take the then-arm: `i32.div_u`, which traps on a zero divisor, is never reached.' },
    ],
  },
  {
    id: 7,
    title: 'Calls and recursion',
    wat: `(module
  (func $fact (export "fact")
    (param $n i64) (result i64)
    local.get $n
    i64.const 1
    i64.le_u
    if (result i64)
      i64.const 1       ;; fact(0) = fact(1) = 1
    else
      local.get $n
      local.get $n
      i64.const 1
      i64.sub
      call $fact        ;; fact(n - 1)
      i64.mul
    end))`,
    invoke: { name: 'fact', args: [4] },
    beats: [
      { at: 0, spot: 'frames', text: '`call` pops the callee\'s arguments from the operand stack, pushes a new **frame** whose parameter locals hold them, and continues at the callee\'s first instruction. At the callee\'s final `end` its frame is popped and its results are left on the stack for the caller. Here: fact(4), recursively, with i64 values.' },
      { at: 9, op: 'call', spot: 'frames', text: 'The first recursive call. The argument 3 moved from the operand stack into the new frame\'s `$n`. The caller\'s frame waits below it, paused at its `call`: click it in Call frames to see where it will resume.' },
      { at: 27, op: 'call', spot: 'stack', text: 'Four frames deep, each with its own `$n`. There is one operand stack for all of them: each frame\'s values sit above its caller\'s, and the markers show where each frame\'s part begins.' },
      { at: 31, op: 'if', text: 'n = 1: the condition is true, so the then-arm runs. This is the base case.' },
      { at: 33, op: 'else', spot: 'code', text: 'Reaching `else` at the end of the then-arm jumps to the matching `end`: the else-arm is skipped.' },
      { at: 35, op: 'end', spot: 'frames', text: 'The innermost call returned 1. Its frame was popped; the result stays on the stack, and the caller resumes after its `call`.' },
      { at: 36, op: 'i64.mul', text: 'The caller computes 2 × fact(1) = 2.' },
      { at: 44, op: 'end', text: 'fact(4) = 24. Each call costs a frame; unbounded recursion traps with **call stack exhausted** rather than corrupting memory.' },
    ],
  },
  {
    id: 8,
    title: 'Linear memory',
    wat: `(module
  (memory (export "memory") 1)
  (data (i32.const 16) "wasm")
  (func $main (export "main") (result i32)
    i32.const 0           ;; address
    i32.const 0x11223344  ;; value
    i32.store       ;; writes 4 bytes at 0..3
    i32.const 0
    i32.load8_u     ;; reads 1 byte at 0
    i32.const 16
    i32.load        ;; reads 4 bytes at 16..19
    i32.add
    i32.const 65534
    i32.load        ;; 65534..65537: past the end
    i32.add))`,
    invoke: { name: 'main', args: [] },
    beats: [
      { at: 0, spot: 'memory', text: 'A module can declare a **linear memory**: one contiguous array of bytes, addressed from 0 and sized in 64 KiB pages. This one has 1 page, addresses 0 to 65535. During instantiation the **data segment** copied the bytes of "wasm" to address 16.' },
      { at: 3, op: 'i32.store', spot: 'memory', text: '`i32.store` popped a value, then an address, and wrote the value\'s 4 bytes. Memory is **little-endian**: the low byte, 44, went to address 0, then 33, 22 and 11.' },
      { at: 5, op: 'i32.load8_u', spot: 'memory', text: '`i32.load8_u` read the single byte at address 0 and zero-extended it to an i32: 0x44, 68. The low byte comes first in memory.' },
      { at: 7, op: 'i32.load', spot: 'memory', text: '`i32.load` at 16 read the bytes 77 61 73 6d ("wasm") as one little-endian i32: 0x6d736177. Memory is untyped: the same bytes are characters or an integer depending on the instruction that reads them.' },
      { at: 9, op: 'i32.const', text: 'The next load reads 4 bytes starting at 65534. Only 2 of those bytes exist.' },
      { at: 10, op: 'i32.load', spot: 'code', text: 'The access is out of bounds, so the machine **traps**. A trap aborts the whole invocation: no result is returned, and the host receives an error. Every access is bounds-checked, so a module can never read or write outside its own memory. Step back (←) to undo the trap.' },
    ],
  },
  {
    id: 9,
    title: 'Tables, imports and the host',
    wat: `(module
  (import "env" "log" (func $log (param i32)))
  (type $bin (func (param i32 i32) (result i32)))
  (table 4 funcref)
  (elem (i32.const 0) $add $sub $mul $neg)
  (func $add (type $bin) local.get 0 local.get 1 i32.add)
  (func $sub (type $bin) local.get 0 local.get 1 i32.sub)
  (func $mul (type $bin) local.get 0 local.get 1 i32.mul)
  (func $neg (param i32) (result i32)
    i32.const 0 local.get 0 i32.sub)
  (func $apply (export "apply")
    (param $op i32) (param $a i32) (param $b i32)
    (result i32) (local $r i32)
    local.get $a
    local.get $b
    local.get $op
    call_indirect (type $bin)  ;; table[$op], checked
    local.tee $r
    call $log       ;; hand the result to the host
    local.get $r))`,
    invoke: { name: 'apply', args: [2, 6, 7] },
    beats: [
      { at: 0, spot: 'tables', text: 'A **table** is an array of references, here to functions. `call_indirect` calls through it: a function pointer is an index into a table, never a code address. This module also **imports** `env.log`, a function the host (JavaScript) provides, and **exports** `apply`. Invoked as apply(2, 6, 7).' },
      { at: 3, op: 'local.get', spot: 'tables', text: 'The table index, 2, is on top of the stack. The Tables tab shows what `call_indirect` will find there.' },
      { at: 4, op: 'call_indirect', spot: 'tables', text: '`call_indirect` popped the index, read `$mul` from table[2], and compared its type with `$bin`, [i32 i32] → [i32]. They are equal, so the call went ahead with 6 and 7 as arguments.' },
      { at: 8, op: 'end', text: '`$mul` returns 42 to `apply`.' },
      { at: 10, op: 'call', spot: 'output', text: '`call $log` called the import. It has no wasm body: the machine passed the argument across the **host boundary**, and the host printed it to the Output console. The host sees only what crosses this boundary, plus whatever memory, tables or globals the module exports.' },
      { at: 12, op: 'end', text: 'apply returns 42. Try apply(3, 6, 7): table[3] is `$neg`, whose type [i32] → [i32] differs from `$bin`, so the signature check traps. apply(4, 6, 7) traps too: index 4 is past the end of the table.' },
    ],
  },
  {
    id: 10,
    title: 'The binary',
    wat: null, // lesson 1's module
    invoke: { name: 'main', args: [] },
    walk: { kind: 'binary' },
    beats: [
      { w: 0, find: { kind: 'magic' }, text: 'Lesson 1\'s module is 59 bytes. It starts with the **magic number** `00 61 73 6d`, the bytes of "\\0asm". Hover any byte to see which part of the structure it belongs to.' },
      { w: 1, find: { kind: 'version' }, text: 'Then the binary format **version**, 1, as a 4-byte little-endian integer.' },
      { w: 2, find: { kind: 'section', label: /^type/ }, text: 'The rest is a sequence of **sections**. Each is an id byte, its size in bytes, and its contents. Section 1, the type section, lists the function types used in the module.' },
      { w: 3, find: { kind: 'leb', label: /^section size/ }, text: 'Sizes, counts and indices are **LEB128** integers: 7 bits per byte, least significant group first, with the high bit of each byte saying whether another byte follows. Small values take one byte; 300 would take two, `ac 02`.' },
      { w: 4, find: { kind: 'functype' }, text: '`60` introduces a function type, followed by a vector of parameter types (empty) and a vector of result types. `7f` encodes i32.' },
      { w: 5, find: { kind: 'section', label: /^function/ }, text: 'The function section gives each function its type index. Bodies come later, in the code section, so a decoder knows every signature before it reads any code.' },
      { w: 6, find: { kind: 'export' }, text: 'The export section names function 0 "main": a length-prefixed UTF-8 string, a kind byte (`00` = function) and an index.' },
      { w: 7, find: { kind: 'body' }, text: 'The code section holds one body per function: its size, the local declarations (none here), then the instructions.' },
      { w: 8, find: { kind: 'instr', label: /^i32\.const 2/ }, text: '`41 02` is `i32.const 2`: the opcode `41`, then the immediate 2 as a signed LEB128.' },
      { w: 9, find: { kind: 'instr', label: /^i32\.add/ }, text: '`6a` is `i32.add`: one byte, no immediates. Its operands come from the stack, so nothing about them is encoded.' },
      { w: 10, find: { kind: 'instr', label: /^end/ }, text: '`0b` is the function\'s final `end`.' },
      { w: 11, find: { kind: 'section', label: /custom/ }, text: 'A **custom section** named "name" carries the debug name `$main`. Execution ignores custom sections. The text format is only a view of these bytes: a disassembler rebuilds readable text from the binary alone. Step (→) to run these bytes.' },
      { at: 0, spot: 'bytes', text: 'The same 59 bytes, now executing. The Bytes strip shows the function body: its size, its local declarations, and each instruction\'s opcode and immediates, highlighted as the machine reaches them.' },
      { at: 3, op: 'i32.add', spot: 'bytes', text: '`6a` executed: one byte, one addition.' },
      { at: 6, op: 'end', spot: 'code', text: 'That is the whole machine: an operand stack, labels, frames, and a store of memories, tables and globals, all driven by these bytes. The **Debugger** runs any .wasm file or WAT you write. Start with one of its built-in examples.', action: 'debugger' },
    ],
  },
]
LESSONS[9].wat = LESSONS[0].wat
