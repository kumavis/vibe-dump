// Built-in debugger examples. WAT ones are checked by test/lessons.test.mjs;
// `asset` ones are real toolchain binaries bundled with the app.

export const EXAMPLES = [
  {
    id: 'fib',
    title: 'Recursive Fibonacci',
    desc: 'Folded WAT, if/else with a result, two recursive calls per frame.',
    invoke: { name: 'fib', args: [10] },
    wat: `(module
  ;; fib(n) = n if n < 2, else fib(n-1) + fib(n-2)
  (func $fib (export "fib")
    (param $n i32) (result i32)
    (if (result i32)
      (i32.lt_u (local.get $n) (i32.const 2))
      (then (local.get $n))
      (else
        (i32.add
          (call $fib
            (i32.sub (local.get $n) (i32.const 1)))
          (call $fib
            (i32.sub (local.get $n) (i32.const 2))))))))`,
    expect: (m) => { if (m.results[0].value !== 55) throw new Error('fib(10)') },
  },
  {
    id: 'sieve',
    title: 'Sieve of Eratosthenes',
    desc: 'One byte of linear memory per number; nested loops mark the composites.',
    invoke: { name: 'sieve', args: [100] },
    wat: `(module
  (memory (export "memory") 1)
  ;; Counts the primes below $n (at most 65536).
  ;; Byte i of memory becomes 1 once i is known to be
  ;; composite. Memory starts zeroed.
  (func $sieve (export "sieve")
    (param $n i32) (result i32)
    (local $i i32) (local $j i32) (local $count i32)
    (local.set $i (i32.const 2))
    (block $done
      (loop $outer
        (br_if $done
          (i32.ge_u (local.get $i) (local.get $n)))
        (if (i32.eqz (i32.load8_u (local.get $i)))
          (then
            (local.set $count
              (i32.add (local.get $count) (i32.const 1)))
            (local.set $j
              (i32.mul (local.get $i) (local.get $i)))
            (block $marked
              (loop $mark
                (br_if $marked
                  (i32.ge_u (local.get $j) (local.get $n)))
                (i32.store8 (local.get $j) (i32.const 1))
                (local.set $j
                  (i32.add (local.get $j) (local.get $i)))
                (br $mark)))))
        (local.set $i
          (i32.add (local.get $i) (i32.const 1)))
        (br $outer)))
    (local.get $count)))`,
    expect: (m) => { if (m.results[0].value !== 25) throw new Error('sieve(100)') },
  },
  {
    id: 'reverse',
    title: 'Reverse a string (WASI)',
    desc: 'A data segment, byte swaps in memory, and fd_write to stdout.',
    invoke: { name: '_start', args: [] },
    wat: `(module
  (import "wasi_snapshot_preview1" "fd_write"
    (func $fd_write
      (param i32 i32 i32 i32) (result i32)))
  (memory (export "memory") 1)
  (data (i32.const 64) "Hello, WebAssembly!\\n")

  ;; reverse $len bytes in place, starting at $p
  (func $reverse (param $p i32) (param $len i32)
    (local $q i32) (local $t i32)
    (local.set $q                    ;; q = p + len - 1
      (i32.sub (i32.add (local.get $p) (local.get $len))
               (i32.const 1)))
    (block $done
      (loop $swap
        (br_if $done
          (i32.ge_u (local.get $p) (local.get $q)))
        (local.set $t (i32.load8_u (local.get $p)))
        (i32.store8 (local.get $p)
                    (i32.load8_u (local.get $q)))
        (i32.store8 (local.get $q) (local.get $t))
        (local.set $p
          (i32.add (local.get $p) (i32.const 1)))
        (local.set $q
          (i32.sub (local.get $q) (i32.const 1)))
        (br $swap))))

  ;; write $len bytes at $p to stdout through one
  ;; iovec { ptr, len } at address 0
  (func $print (param $p i32) (param $len i32)
    (i32.store (i32.const 0) (local.get $p))
    (i32.store (i32.const 4) (local.get $len))
    ;; fd 1, 1 iovec at 0, bytes written stored at 8
    (drop (call $fd_write (i32.const 1) (i32.const 0)
                          (i32.const 1) (i32.const 8))))

  (func (export "_start")
    (call $print (i32.const 64) (i32.const 20))
    ;; 19 bytes: keep the newline last
    (call $reverse (i32.const 64) (i32.const 19))
    (call $print (i32.const 64) (i32.const 20))))`,
    expect: (m, out) => { if (out !== 'Hello, WebAssembly!\n!ylbmessAbeW ,olleH\n') throw new Error('reverse output: ' + JSON.stringify(out)) },
  },
  {
    id: 'dispatch',
    title: 'br_table dispatch',
    desc: 'A switch: br_table jumps to one of five nested blocks by index.',
    invoke: { name: 'calc', args: [2, 6, 7] },
    wat: `(module
  ;; op: 0 add, 1 sub, 2 mul, 3 div_s (0 if b = 0),
  ;; anything else -1
  (func $calc (export "calc")
    (param $op i32) (param $a i32) (param $b i32)
    (result i32)
    (block $default
      (block $div
        (block $mul
          (block $sub
            (block $add
              (br_table $add $sub $mul $div $default
                (local.get $op)))
            (return
              (i32.add (local.get $a) (local.get $b))))
          (return
            (i32.sub (local.get $a) (local.get $b))))
        (return (i32.mul (local.get $a) (local.get $b))))
      (if (i32.eqz (local.get $b))
        (then (return (i32.const 0))))
      (return (i32.div_s (local.get $a) (local.get $b))))
    (i32.const -1)))`,
    expect: (m) => { if (m.results[0].value !== 42) throw new Error('calc') },
  },
  {
    id: 'newton',
    title: 'Square root by Newton\'s method',
    desc: 'f64 arithmetic in a counted loop; compare with f64.sqrt.',
    invoke: { name: 'sqrt', args: [2] },
    wat: `(module
  ;; six Newton steps g = (g + x/g) / 2, from g = x/2
  (func $sqrt (export "sqrt")
    (param $x f64) (result f64)
    (local $g f64) (local $i i32)
    (local.set $g (f64.div (local.get $x) (f64.const 2)))
    (loop $step
      (local.set $g
        (f64.mul (f64.const 0.5)
          (f64.add (local.get $g)
            (f64.div (local.get $x) (local.get $g)))))
      (local.set $i (i32.add (local.get $i) (i32.const 1)))
      (br_if $step (i32.lt_u (local.get $i) (i32.const 6))))
    (local.get $g))
  (func (export "exact") (param $x f64) (result f64)
    (f64.sqrt (local.get $x))))`,
    expect: (m) => { if (Math.abs(m.results[0].value - Math.SQRT2) > 1e-12) throw new Error('sqrt') },
  },
  {
    id: 'bigmem',
    title: '16 MiB of memory',
    desc: 'memory.grow to 256 pages, memory.fill a megabyte, stores near the top.',
    invoke: { name: 'grow', args: [] },
    wat: `(module
  (memory (export "memory") 1)
  (func (export "grow") (result i32)
    ;; 1 + 255 pages = 16 MiB
    (drop (memory.grow (i32.const 255)))
    ;; fill the top MiB with 0xAB
    (memory.fill (i32.const 0xF00000)
                 (i32.const 0xAB)
                 (i32.const 0x100000))
    (i32.store (i32.const 0x800000)
               (i32.const 0xCAFEBABE))
    (i64.store (i32.const 0xFFFFF8)
               (i64.const 0x0123456789ABCDEF))
    (memory.size)))`,
    expect: (m) => { if (m.results[0].value !== 256) throw new Error('grow') },
  },
  {
    id: 'hello',
    title: 'hello.wasm (C, WASI)',
    desc: 'A clang-built binary: fd_write, fib, an FNV checksum, call_indirect sort, proc_exit.',
    invoke: { name: '_start', args: [] },
    asset: 'hello',
  },
]
