// Stage 1 — 16-bit real mode, from the reset vector to the far jump.

import { ACT, span, win, SRC, all, bsp, wave } from './common.js'

// ---- code: coreboot's real-mode prologue, as it runs on Alder/Raptor Lake ------
// Addresses and bytes from coreboot entry16.S assembled for ADL/RPL defaults
// (POST_IO=y, no CBnT). "era" = oldest Intel CPU with that instruction form.
export const RESET16 = [
  { a: 'FFFFFFF0', i: 'jmp   _start16bit', era: '8086', why: 'A 3-byte near jump (E9 0D F4). IP wraps from FFF3 to F400 inside the 64 KiB segment, so execution continues at FFFFF400. CS is untouched, so its hidden base FFFF0000 survives.' },
  { a: 'FFFFF400', i: 'cli', era: '8086', why: 'Mask interrupts. IF is already 0 after reset; this is belt-and-braces.' },
  { a: 'FFFFF401', i: 'movl  %eax, %ebp', era: '386', why: 'Stash the built-in self-test result (EAX) in EBP. The 66h prefix lets 16-bit code use a 32-bit register — something no 8086 could do.' },
  { a: 'FFFFF404', i: 'movb  $0x01, %al', era: '8086', why: 'post_code(POSTCODE_RESET_VECTOR_CORRECT) expands to this line and the next. POST code 0x01: “reset vector correct”.' },
  { a: 'FFFFF406', i: 'outb  %al, $0x80', era: '8086', why: 'The BIOS’s first visible output: an I/O write that crosses DMI to the chipset, where a POST-code display on the board can show “01”.' },
  { a: 'FFFFF408', i: 'xorl  %eax, %eax', era: '386', why: 'EAX = 0 (32-bit operation, 66h prefix).' },
  { a: 'FFFFF40B', i: 'movl  %eax, %cr3', era: '386', why: 'CR3 = 0, “invalidate TLB”. Paging is off; this is historical caution. Control registers arrived with the 386.' },
  { a: 'FFFFF40E', i: 'movw  %cs, %ax', era: '8086', why: 'AX = F000, the visible CS selector.' },
  { a: 'FFFFF410', i: 'shlw  $4, %ax', era: '186', why: 'AX = F000 << 4, truncated to 16 bits = 0. A shift by an immediate count first appeared on the 80186.' },
  { a: 'FFFFF413', i: 'movw  $nullidt_offset, %bx', era: '8086', why: 'Low 16 bits of the address of a 6-byte “null IDT” descriptor, computed by the linker because there is no stack to compute it at run time.' },
  { a: 'FFFFF416', i: 'subw  %ax, %bx', era: '8086', why: 'Make it relative to CS (a no-op on the BSP).' },
  { a: 'FFFFF418', i: 'lidt  %cs:(%bx)', era: '286', why: 'IDTR = {limit 0}. From now on any exception shuts the CPU down instead of jumping through garbage at physical address 0, where there is no RAM.' },
  { a: 'FFFFF41C', i: 'movw  $gdtptr_offset, %bx', era: '8086', why: 'Point at the GDT descriptor, also in the top 64 KiB of flash.' },
  { a: 'FFFFF41F', i: 'subw  %ax, %bx', era: '8086', why: 'CS-relative again.' },
  { a: 'FFFFF421', i: 'lgdtl %cs:(%bx)', era: '386', why: 'Load the Global Descriptor Table: flat 32-bit code and data segments, plus a 64-bit code segment not used here. The “l” (66h) matters: a 16-bit LGDT keeps only a 24-bit base, and this table lives at FFFFFxxx.' },
  '...       # Boot Guard (CBnT) path, not built',
  { a: 'FFFFF426', i: 'movl  %cr0, %eax', era: '386', why: 'EAX = 60000010, the reset value of CR0.' },
  { a: 'FFFFF429', i: 'andl  $0x7FFAFFD1, %eax', era: '386', why: 'Clear PG, AM, WP, NE, TS, EM, MP.' },
  { a: 'FFFFF42F', i: 'orl   $0x60000001, %eax', era: '386', why: 'Keep CD and NW set (caches stay off for now) and set PE — Protection Enable.' },
  { a: 'FFFFF435', i: 'movl  %eax, %cr0', era: '386', why: 'CR0 = 60000011. Protected mode is on — but CS still holds its stale 16-bit real-mode descriptor until it is reloaded.' },
  { a: 'FFFFF438', i: 'movl  %ebp, %eax', era: '386', why: 'Put the self-test result back in EAX for the next stage. The SDM asks for the far jump immediately after MOV CR0; a register-only move like this one is harmless in practice.' },
  { a: 'FFFFF43B', i: 'ljmpl $GDT_CODE_SEG, $bootblock_protected_mode_entry', era: '386', why: 'The first far jump. Selector GDT_CODE_SEG = 08h is looked up in the new GDT: base 0, limit 4 GiB, 32-bit. From the next instruction the CPU is a 32-bit protected-mode machine — still running straight out of flash.' },
]
const OPS16 = RESET16.filter((l) => typeof l === 'object') // the 21 instructions, no '...'
const line16 = (k) => RESET16.indexOf(OPS16[Math.min(k, OPS16.length - 1)])

const resetRegs = (p) => {
  const k = Math.floor(p * OPS16.length) // instructions retired so far
  const cr0 = k >= 19 ? '60000011' : '60000010'
  const cs = k >= 21 ? '0008 · base 0 · 4 GiB · 32-bit' : 'F000 · base FFFF0000 · 16-bit'
  const eax = k === 4 || k === 5 ? '00000001' : k === 8 ? '0000F000' : k === 16 || k === 17 ? '60000010' : k === 18 || k === 19 ? '60000011' : '00000000'
  const eip = k >= 21 ? 'FFFFFxxx (32-bit)' : ['0000FFF0', '0000F400', '0000F401', '0000F404', '0000F406', '0000F408', '0000F40B', '0000F40E', '0000F410', '0000F413', '0000F416', '0000F418', '0000F41C', '0000F41F', '0000F421', '0000F426', '0000F429', '0000F42F', '0000F435', '0000F438', '0000F43B'][k]
  return {
    title: 'BSP registers',
    note: 'values per Intel SDM Table 12-1',
    rows: [
      ['CS', cs, 'wide' + (k >= 21 ? ' hot' : '')],
      ['EIP', eip, k === 0 ? 'hot' : ''],
      ['CR0', cr0, k >= 19 ? 'hot' : ''],
      ['EDX', '000B0671'],
      ['EAX', eax],
      ['EBP', k >= 3 ? '00000000 ← BIST' : '00000000'],
      ['IDTR', k >= 12 ? 'limit 0 (null)' : 'base 0'],
      ['GDTR', k >= 15 ? 'base FFFFFxxx' : 'base 0', k >= 15 && k < 19 ? 'hot' : ''],
      ['MTRRs', 'off → all UC'],
    ],
  }
}

export const STAGE1 = [
  {
    stage: 1,
    title: 'Wake up as a 1978 processor',
    dur: 9,
    real: 0,
    isReset: true,
    mode: 'real',
    shot: 'die',
    narration: [
      'Now the BSP looks like a freshly reset 8086: <em>real mode</em>, where an address is “segment × 16 + offset” and 64 KiB segments reach about 1 MiB. Caches are disabled and every MTRR is off, so all memory is uncacheable — unless a Boot Guard ACM ran first and left the boot block in cache.',
      'But there is a trick. Real mode can’t reach 4 GiB, so at reset the CPU loads the code segment’s <em>hidden</em> base with <code>FFFF0000</code> while the visible selector says <code>F000</code>. Add <code>IP = FFF0</code> and the first fetch comes from <code>FFFFFFF0</code> — 16 bytes below 4 GiB. An 8086 started at <code>FFFF0</code>, 16 bytes below 1 MiB.',
    ],
    facts: [
      ['First fetch', 'FFFFFFF0h on Intel since the 386 (AMD Zen: in DRAM, see Stage 2)'],
      ['EDX at reset', '000B0671 = this CPU’s family/model/stepping (06-B7-01)'],
      ['Caching', 'CR0.CD = NW = 1, MTRRs off → uncacheable (no Boot Guard)'],
    ],
    regs: (p) => resetRegs(0),
    code: { src: 'coreboot entry16.S', href: SRC.entry16[1], lines: RESET16, at: () => 0, title: 'Next to execute' },
    mem: { on: ['flash', 'lapic'], hit: [], note: 'no writable memory anywhere' },
    sources: [SRC.sdm, SRC.rplds, SRC.amd17],
    lps: () => bsp('real'),
    act(p, A) {
      A.die('pcore0', 0.55, ACT.fetch, 'breathe')
    },
    labels: [{ id: 'pcore0', text: 'BSP — real mode', hot: true, color: '#ffb547' }],
  },
  {
    stage: 1,
    title: 'Sixteen bytes below 4 GiB',
    dur: 10,
    real: 8e-6,
    mode: 'real',
    shot: 'fetch',
    inset: { shot: 'die', label: 'ON THE DIE' },
    narration: [
      'There is no memory controller set up, no cache, no RAM. The fetch — a whole 64-byte line at a time — leaves the core, crosses the ring and the DMI link to the chipset, whose SPI controller reads it serially from the flash chip at up to 50 MHz. The chipset wires the top 16 MiB below 4 GiB to the BIOS region of that chip.',
      'Only 16 bytes fit between <code>FFFFFFF0</code> and the end of the address space, so the code there just jumps somewhere roomier (EDK2 puts two NOPs before its jump). coreboot’s is 3 bytes, <code>E9 0D F4</code>: a <em>near</em> jump that wraps around inside the 64 KiB segment to <code>FFFFF400</code> without touching CS, so the hidden base survives.',
    ],
    facts: [
      ['One 64-byte flash read', '≈ 3 µs (quad I/O) to 11 µs (single-bit) at 50 MHz; slower at lower clocks'],
      ['Path', 'core → ring → system agent → DMI → PCH → SPI → flash'],
      ['Lower bound', '≥ 3 µs per fresh 64-byte line (50 MHz quad I/O) — 6× the thread’s 500 ns already'],
    ],
    regs: (p) => resetRegs(p < 0.7 ? 0 : 1 / OPS16.length + 0.001),
    code: { src: 'coreboot entry16.S', href: SRC.entry16[1], lines: RESET16, at: (p) => (p < 0.7 ? 0 : 1) },
    mem: { on: ['flash', 'lapic'], hit: ['flash'] },
    sources: [SRC.sdm, SRC.pchds, SRC.flash, SRC.entry16, SRC.bootblockld],
    lps: () => bsp('real'),
    act(p, A) {
      A.die('sub:pcore0:decode|l1i_ctl|branch|ucode_opcache', 1, ACT.fetch, 'scan')
      A.die('pcore0', 0.5, ACT.fetch, 'glow')
      A.ring(0.8, ACT.fetch)
      A.flow('f', 'pcore0', 'dmi', 5, ACT.fetch, 5)
      A.bus('dmi', 0.9, ACT.fetch, { rate: 8, speed: 70 })
      A.bus('spi', 1, ACT.fetch, { rate: 10, speed: 25, dir: -1 })
      A.bus('dmi', 0.9, ACT.fetch, { rate: 6, speed: 70, dir: -1 })
      A.board('spi', 1, ACT.fetch, 'scan')
      A.board('pch', 0.6, ACT.fetch, 'glow')
    },
    labels: [{ id: 'spi', text: 'FFFFFFF0 lives here', hot: true }, { id: 'pch', text: 'SPI controller' }],
  },
  {
    stage: 1,
    title: 'An 8086 costume over a 386',
    dur: 12,
    real: 2.5e-5,
    mode: 'real',
    shot: 'die',
    inset: { shot: 'fetch', label: 'EVERY FETCH GOES TO FLASH' },
    narration: [
      'The code that follows wears 1978 clothes but uses 1985 parts. A <code>66h</code> prefix lets 16-bit code touch 32-bit registers; <code>mov %cr3</code>, <code>lgdtl</code> and <code>lidt</code> belong to the 286 and 386. Watch the era tags.',
      'There is still no stack, so nothing can be <code>call</code>ed — coreboot parks the self-test result in EBP, and EDK2’s reset vector parks it in the stack pointer itself because there is no stack to point at. An <code>out</code> to port 80h sends POST code <code>01</code> across DMI, the BIOS’s first visible sign of life.',
    ],
    facts: [
      ['Real-mode prologue', '21 instructions (coreboot), 17 (EDK2 VTF0), 29 (Intel’s Alder Lake reference)'],
      ['Instructions newer than the 8086 here', '12 of 21 — just over half'],
    ],
    regs: (p) => resetRegs((1 + p * 13) / OPS16.length + 0.001),
    code: { src: 'coreboot entry16.S', href: SRC.entry16[1], lines: RESET16, at: (p) => Math.min(13, 1 + Math.floor(p * 13)) },
    mem: { on: ['flash', 'lapic'], hit: ['flash'] },
    sources: [SRC.entry16, SRC.vtf0, SRC.adlSec, SRC.sdm],
    lps: () => bsp('real'),
    act(p, A, t) {
      A.die('sub:pcore0:decode|l1i_ctl|branch|ucode_opcache', 0.9, ACT.fetch, 'scan')
      A.die('pcore0', 0.5, ACT.fetch, 'glow')
      A.ring(0.6, ACT.fetch)
      A.flow('f', 'pcore0', 'dmi', 3, ACT.fetch, 5)
      A.bus('dmi', 0.8, ACT.fetch, { rate: 5, speed: 70 })
      A.bus('spi', 0.8, ACT.fetch, { rate: 6, speed: 25, dir: -1 })
      A.board('spi', 0.8, ACT.fetch, 'scan')
      // the port-80 POST write
      const post = win(p, 0.25, 0.4)
      A.board('pch', 0.4 + post * 0.6, '#ffffff', 'glow')
    },
    labels: [{ id: 'pcore0', text: 'BSP — real mode', hot: true, color: '#ffb547' }],
  },
  {
    stage: 1,
    title: 'One bit, one far jump',
    dur: 11,
    real: 2e-5,
    mode: (p) => (p < 0.86 ? 'real' : 'prot'),
    shot: 'dieLeft',
    narration: [
      'Load a tiny table from flash — the GDT — describing flat 4 GiB code and data segments (plus a 64-bit code segment it won’t use here). Set bit 0 of CR0, <em>Protection Enable</em>. Then make the first far jump: selector <code>08h</code> is looked up in the new table, and CS becomes base 0, limit 4 GiB, 32-bit.',
      'That’s it — real mode is over after about twenty instructions. LaurieWired’s “15–30 instructions” is right on: 21 in coreboot, 17 in EDK2’s generic reset vector, 29 in Intel’s Alder Lake reference code.',
    ],
    note: { tag: 'Thread check', html: '“500 ns (ish)” is plausible only when Boot Guard has pre-loaded this code into cache and nothing waits on a port-80 write. Fetched uncached from SPI flash, 21 instructions take more like <em>15–60 µs</em> (an estimate — no one seems to have published a measurement). And the stack isn’t built here: real mode only loads a GDT and flips PE. The writable stack comes next, in 32-bit mode.' },
    facts: [
      ['Time in real mode', '≈ 15–60 µs uncached; ≈ 1 µs if Boot Guard cached it, as the port-80 write still crosses DMI (both estimates)'],
      ['Leaves with', 'caches still off, still no RAM, still no stack'],
    ],
    regs: (p) => resetRegs((14 + p * 8.14) / OPS16.length + 0.001),
    code: { src: 'coreboot entry16.S', href: SRC.entry16[1], lines: RESET16, at: (p) => line16(Math.min(20, 14 + Math.floor(p * 8.14))) },
    mem: { on: ['flash', 'lapic'], hit: ['flash'] },
    sources: [SRC.entry16, SRC.gdt, SRC.sdm, SRC.thread],
    lps: (p) => bsp(p < 0.86 ? 'real' : 'prot'),
    act(p, A) {
      const jump = span(p, 0.84, 0.95)
      A.die('pcore0', 0.6 + jump * 0.4, jump > 0.5 ? '#4fe08a' : ACT.fetch, jump > 0 ? 'scan' : 'glow')
      A.die('sub:pcore0:decode|l1i_ctl|branch|ucode_opcache', 0.8, ACT.fetch, 'scan')
      A.ring(0.5, ACT.fetch)
      A.flow('f', 'pcore0', 'dmi', 3, ACT.fetch, 5)
    },
    labels: [{ id: 'pcore0', text: 'BSP', hot: true }],
  },

]
