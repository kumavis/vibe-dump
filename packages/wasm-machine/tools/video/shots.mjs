// Shot list + caption script for the vertical explainer.
//
// Each shot opens the app fresh (`open` = query string), runs `setup` in real
// time (off camera), then records `dur` seconds of virtual time.
//   cues  [t, html]        caption (≤ ~12 words). <b> accent, <code> mono, <em> trap, <i> good
//   acts  [t, action, ...] 'step' | ['run', speedIndex, untilStep] | 'pause' | 'speed' | 'spot' | fn
//   cam   [t, target, dur] 'full' | selector | {x,y,w,h} rect (page CSS px); dur 0 = cut
// Times are seconds from the start of the shot.

const steps = (t0, dt, n) => Array.from({ length: n }, (_, i) => [+(t0 + i * dt).toFixed(3), 'step'])

// the ill-typed lesson-3 module, loaded through the lesson's own button
const loadVariant = (page) => page.evaluate(() => [...document.querySelectorAll('.lesson-actions button')].find((b) => /ill-typed/.test(b.textContent)).click())

// page-space camera rects (CSS px of the 540-wide page; the app starts at y = 262)
const STORE = { x: 283, y: 582, w: 257, h: 321 }         // frames + store column, store at the bottom
const CODE = { x: 0, y: 262, w: 420, h: 230, anchor: 'top' } // code lines with the type/label gutter

export const SHOTS = [
  {
    id: 'stack', chap: 'The stack machine', open: 'lesson=1', dur: 13.4,
    slow: [[0, 3.4, 0.45], [6.5, 7.6, 0.6]],
    cues: [
      [0, 'Your browser runs a <b>second computer</b>.'],
      [1.9, 'Here’s how it thinks.'],
      [3.5, 'It’s a <b>stack machine</b>: no registers, one <b>operand stack</b>.'],
      [6.0, '<code>i32.add</code> pops two operands, pushes their sum.'],
      [9.0, '<code>i32.const 7</code>, then <code>i32.mul</code>: 5 × 7 = 35.'],
      [11.6, 'One value left on the stack: <b>the result</b>.'],
    ],
    acts: [[0.45, 'step'], [2.1, 'step'], [6.6, 'step'], [9.4, 'step'], [10.4, 'step'], [12.0, 'step']],
    cam: [[0, 'full'], [5.6, '.stack-pane', 0.8], [12.0, 'full', 0.7]],
  },
  {
    id: 'bytes', chap: 'It’s all bytes', open: 'lesson=10', setup: async (rig) => { await rig.api('step', 7) }, dur: 8.4,
    cues: [
      [0, 'Underneath, the code is just <b>bytes</b>: 59 of them.'],
      [2.0, '<code>41 02</code>: opcode 41 is <code>i32.const</code>, immediate 2.'],
      [4.9, '<code>6a</code> is <code>i32.add</code>. One byte: operands come from the stack.'],
    ],
    acts: [[1.9, 'step'], [4.8, 'step']],
    cam: [[0, 'full'], [0.2, { x: 0, y: 282, w: 300, h: 170, anchor: 'top' }, 0.9]],
  },
  {
    id: 'frames', chap: 'Frames & locals', open: 'lesson=2', dur: 9.6,
    cues: [
      [0, 'A call pushes a <b>frame</b>: params <code>$x</code>, <code>$y</code>, local <code>$s</code>.'],
      [2.3, '<code>local.get</code> copies a local onto the stack.'],
      [4.7, '<code>local.tee</code> stores 7 in <code>$s</code> <b>and</b> keeps it.'],
      [7.0, '7 × 7 = 49 returned; the frame is <b>popped</b>.'],
    ],
    acts: [[2.5, 'step'], [3.1, 'step'], [3.7, 'step'], [5.2, 'step'], [7.1, 'step'], [7.7, 'step'], [8.4, 'step']],
    // capture-time crop: this lesson has only the function label, so give the pane to the frame's locals
    setup: async (rig) => { await rig.page.addStyleTag({ content: '.frames-pane > .pane-head:first-child, .frames-pane > .labels { display: none !important; }' }) },
    cam: [[0, '.frames-pane'], [2.2, 'full', 0.6], [4.6, '.frames-pane', 0.6], [6.9, 'full', 0.6]],
  },
  {
    id: 'br', chap: 'Structured control', open: 'lesson=4', setup: async (rig) => { await rig.api('step', 3) }, dur: 8.4,
    cues: [
      [0, 'No goto. A <code>block</code> pushes a <b>label</b>: it records the stack height.'],
      [3.0, '<code>br_if</code> exits the block, carrying one result…'],
      [5.2, '…and <b>cuts the stack back</b>: 99 is discarded.'],
    ],
    acts: [[0.9, 'step'], [1.4, 'step'], [1.9, 'step'], [3.5, 'step']],
    cam: [[0, 'full'], [2.8, '.stack-pane', 0.7]],
  },
  {
    id: 'loop', chap: 'Structured control', open: 'lesson=5', setup: async (rig) => { await rig.api('step', 11) }, dur: 5.4,
    cues: [
      [0, 'A <code>loop</code> label branches <b>backward</b>: the only way to repeat.'],
    ],
    acts: [...steps(0.5, 0.45, 3), [2.2, 'run', 3, 26]],
    cam: [[0, CODE]],
  },
  {
    id: 'rec', chap: 'Recursion', open: 'lesson=7', setup: async (rig) => { await rig.api('step', 8) }, dur: 11.4,
    cues: [
      [0, 'Each <code>call</code> pushes a new <b>frame</b>; recursion stacks them up.'],
      [3.6, 'fact(4) → fact(3) → fact(2) → fact(1): <b>four frames</b>.'],
      [6.2, 'Base case returns 1; each frame pops and multiplies.'],
      [9.1, 'fact(4) = <b>24</b>. Every frame unwound.'],
    ],
    acts: [[0.5, 'run', 3, 27], [6.3, 'run', 3, 44]],
    cam: [[0, 'full'], [3.5, '.stack-pane', 0.7], [6.2, 'full', 0.7]],
  },
  {
    id: 'mem', chap: 'Linear memory', open: 'lesson=8', setup: async (rig) => { await rig.api('step', 2) }, dur: 11.2,
    cues: [
      [0, '<b>Linear memory</b>: one flat, bounds-checked array of bytes.'],
      [2.0, '<code>i32.store</code> 0x11223344 → <code>44 33 22 11</code>: <b>little-endian</b>.'],
      [4.9, 'Now load 4 bytes at 65534, past the end…'],
      [7.6, '<em>Trap.</em> The call aborts. Nothing outside memory is touched.'],
    ],
    acts: [[0.9, 'step'], ...steps(4.9, 0.32, 6), [7.4, 'step']],
    cam: [[0, STORE], [4.7, 'full', 0.6], [7.4, { sel: '.code-slot', max: 1.25, anchor: 'top' }, 0.5]],
  },
  {
    id: 'valid', chap: 'Validation', open: 'lesson=3', dur: 8.6,
    cues: [
      [0, 'Before anything runs, the <b>validator</b> type-checks every instruction.'],
      [3.1, 'Give <code>f64.div</code> an <code>i32</code> instead of an f64…'],
      [5.3, '<em>Rejected</em> at load time: the bad code never runs.'],
    ],
    acts: [...steps(0.5, 0.42, 6), [5.0, loadVariant]],
    cam: [[0, CODE]],
  },
  {
    id: 'real', chap: 'Real binaries', open: 'example=hello', setup: async (rig) => {
      await rig.page.evaluate(() => window.__wasmMachine.store.select('output'))
    }, dur: 6.2,
    cues: [
      [0, 'Same machine, real binary: <code>hello.wasm</code>, C built with clang.'],
      [3.2, 'Running at 10,000 instructions a second.'],
    ],
    acts: [[0.4, 'run', 8], [3.0, 'speed', 9]],
    cam: [[0, 'full']],
  },
  {
    id: 'done', chap: 'Real binaries', open: 'example=hello', setup: async (rig) => {
      await rig.page.evaluate(() => window.__wasmMachine.store.select('output'))
      await rig.api('run', { speed: 9, timeout: 1500 })
      await rig.api('run', { speed: 10 })
      // show the program's own output lines in the console
      await rig.page.evaluate(() => {
        const out = [...document.querySelectorAll('.store-pane *')].find((e) => e.scrollHeight > e.clientHeight + 4 && /Hello/.test(e.textContent))
        const line = [...out.querySelectorAll('*')].find((e) => e.children.length === 0 && /^Hello, WASI!/.test(e.textContent))
        if (out && line) out.scrollTop = line.offsetTop - out.offsetTop - 4
      })
    }, dur: 4.6,
    cues: [
      [0, '329,681 instructions later: <i>Hello, WASI!</i>'],
    ],
    acts: [],
    cam: [[0, 'full'], [0.3, STORE, 0.9]],
  },
  {
    id: 'end', chap: '', open: null, dur: 3.6, end: true,
    cues: [],
    acts: [],
    cam: [[0, STORE]], // hold the previous shot's last framing, then fade to the end card
  },
]
