// Stage 5 — the operating system owns the machine. Summary and a scorecard
// for the thread's claims.

import { ACT, SRC } from './common.js'

export const STAGE5 = [
  {
    stage: 5,
    title: 'Thirty-two threads, one machine',
    dur: 16,
    hold: true,
    real: 0.2,
    mode: 'long',
    shot: 'die',
    narration: [
      'From the button to here: a coin-cell clock, a power supply proving itself, a 486-class security engine booting inside the chipset, a CPU patched from flash before its first instruction, an 8086 costume for twenty instructions, a 386 borrowing its own cache as RAM while it taught the DDR5 to talk, an AMD64 enumerating PCIe and loading a boot loader — and 31 other threads woken, parked, and woken again.',
      'Biology has a phrase for an embryo replaying its ancestors’ forms as it develops: <em>ontogeny recapitulates phylogeny</em>. It turned out to be wrong for embryos. For an x86 PC it is literally true, every single boot.',
    ],
    note: { tag: 'Credit', html: 'This walkthrough expands <a href="https://bsky.app/profile/lauriewired.bsky.social/post/3mxwk6hqb622v" target="_blank" rel="noopener">LaurieWired’s thread</a>, checked against Intel’s manuals and datasheets and the coreboot, EDK2 and Linux sources. The die is Fritzchens Fritz’s CC0 photograph of an i9-13900K, with the floorplan measured on it.' },
    facts: [
      ['“…in a few milliseconds”', '≈ the mode switches take microseconds; the whole boot takes seconds (a first boot with new DDR5, far longer)'],
      ['“15–30 instructions” in real mode', '✓ 17 (EDK2), 21 (coreboot), 29 (Intel ADL reference)'],
      ['“500 ns (ish)”', '≈ only if Boot Guard pre-cached the code; ~15–60 µs uncached (estimate)'],
      ['Real mode builds the stack', '✗ it only loads a GDT and sets PE; the stack comes in 32-bit mode'],
      ['Cache-as-RAM, “NEM”', '✓ on Intel; AMD Zen trains DRAM on its ARM security processor before x86 runs at all'],
      ['Every core repeats the process', '≈ every thread climbs the mode ladder again and again (PEI wake, SMM relocation, DXE wake, the OS); none repeat CAR, training or PCIe'],
      ['Faster because RAM is warm', '≈ mostly because they skip the slow work and run in parallel'],
    ],
    sources: [SRC.thread, SRC.fritz, SRC.sdm, SRC.entry16, SRC.tramp],
    lps: () => () => 'os',
    act(p, A, t) {
      A.die('kind:pcore', 0.45, '#f2f4ff', 'sparkle')
      A.die('kind:ecore_cluster', 0.45, '#f2f4ff', 'sparkle')
      A.die('kind:llc_slice', 0.3, ACT.dram, 'scan')
      A.ring(0.7, '#d8dcff')
      A.die('kind:imc', 0.5, ACT.dram, 'scan')
      A.die('kind:ddr_phy', 0.5, ACT.dram, 'scan')
      A.die('pcie5', 0.4, ACT.pcie, 'scan')
      A.die('pcie4', 0.4, ACT.pcie, 'scan')
      A.die('dmi', 0.3, ACT.pcie, 'scan')
      A.flow('o1', 'pcore1', 'imc0', 3, ACT.dram, 6)
      A.flow('o2', 'ecl2', 'imc1', 3, ACT.dram, 6)
      A.flow('o3', 'pcore6', 'llc3', 3, '#ffffff', 6)
      A.flow('o4', 'ecl1', 'llc8', 3, '#ffffff', 6)
      A.bus('ddrA', 0.6, ACT.dram, { rate: 12, speed: 90 })
      A.bus('ddrB', 0.6, ACT.dram, { rate: 12, speed: 90 })
      A.bus('pcie16', 0.5, ACT.pcie, { rate: 6, speed: 90 })
      A.bus('pcie4', 0.5, ACT.pcie, { rate: 6, speed: 90 })
      A.board('gpu', 0.5, ACT.gpu, 'scan')
      A.board('nvme', 0.4, ACT.pcie, 'scan')
    },
  },
]
