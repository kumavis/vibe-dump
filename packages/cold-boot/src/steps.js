// The walkthrough, one step at a time. Every claim here traces to a source
// listed on the step; numbers that are estimates say so.
//
// A step:
//   stage      0..5 (see STAGES)
//   title, narration[] (HTML), note {tag, html}, facts [[k, v]], sources [[label, url]]
//   dur        seconds of animation at 1x
//   real       real-world seconds this step stands for (drives the clock)
//   mode       the BSP's CPU mode (or a function of progress p)
//   lps(p)     -> (i, lp) => mode for each of the 32 logical processors
//   act(p, A, t) lights things up (see main.js for the A api)
//   regs       {title, note, rows: [[k, v, flags]]} or a function of p
//   code       {src, href, lines, at(p) -> index}
//   mem        {on: [...regions], hit: [...regions], note}
//   shot       camera shot name, or [[fromP, name], ...]
//   inset      {shot, label} picture-in-picture
//   labels     ids of board components / die blocks to label

import { STAGE0 } from './content/stage0.js'
import { STAGE1 } from './content/stage1.js'
import { STAGE2 } from './content/stage2.js'
import { STAGE3 } from './content/stage3.js'
import { STAGE4 } from './content/stage4.js'
import { STAGE5 } from './content/stage5.js'

export const STAGES = [
  { name: 'Power', long: 'Stage 0 — before the first instruction', color: '#ff6b81' },
  { name: 'Real mode', long: 'Stage 1 — 16-bit real mode, like an 8086 (1978)', color: '#ffb547' },
  { name: 'Protected', long: 'Stage 2 — 32-bit protected mode, like a 386 (1985): cache-as-RAM and DRAM training', color: '#4fe08a' },
  { name: 'Long mode', long: 'Stage 3 — 64-bit long mode, like AMD64 (2003): drivers, PCIe, GPU, bootloader', color: '#58a6ff' },
  { name: 'Other cores', long: 'Stage 4 — the 31 other hardware threads climb the same ladder', color: '#c79bff' },
  { name: 'OS', long: 'Stage 5 — the operating system owns the machine', color: '#f2f4ff' },
]

export const STEPS = [...STAGE0, ...STAGE1, ...STAGE2, ...STAGE3, ...STAGE4, ...STAGE5]
