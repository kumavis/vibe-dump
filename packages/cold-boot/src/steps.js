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

import { ACT, span, window as win } from './util.js'

export const STAGES = [
  { name: 'Power', long: 'Stage 0 — before the first instruction', color: '#ff6b81' },
  { name: 'Real mode', long: 'Stage 1 — 16-bit real mode, like an 8086 (1978)', color: '#ffb547' },
  { name: 'Protected', long: 'Stage 2 — 32-bit protected mode, like a 386 (1985): cache-as-RAM and DRAM training', color: '#4fe08a' },
  { name: 'Long mode', long: 'Stage 3 — 64-bit long mode, like AMD64 (2003): drivers, PCIe, GPU, bootloader', color: '#58a6ff' },
  { name: 'Other cores', long: 'Stage 4 — the 31 other hardware threads climb the same ladder', color: '#c79bff' },
  { name: 'OS', long: 'Stage 5 — the operating system owns the machine', color: '#f2f4ff' },
]

// ---- sources ------------------------------------------------------------------
const SRC = {
  thread: ['LaurieWired’s thread', 'https://bsky.app/profile/lauriewired.bsky.social/post/3mxwk6hqb622v'],
  sdm: ['Intel SDM Vol. 3, ch. 12', 'https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html'],
  pchds: ['Intel 700-series PCH datasheet', 'https://edc.intel.com/content/www/us/en/design/products-and-solutions/processors-and-chipsets/700-series-chipset-family-platform-controller-hub-datasheet-volume-1-of/'],
  rplds: ['Intel 13th-gen Core datasheet', 'https://edc.intel.com/content/www/us/en/design/products/platforms/details/raptor-lake-s/13th-generation-core-processors-datasheet-volume-1-of-2/'],
  atx: ['Intel ATX 3 PSU design guide', 'https://cdrdv2-public.intel.com/336521/336521_Rev2p1a.pdf'],
  sio: ['Nuvoton NCT6796D datasheet', 'https://www.nuvoton.com/resource-files/NCT6796D_Datasheet_V0_6.pdf'],
  csme: ['Intel CSME security white paper', 'https://www.intel.com/content/dam/www/public/us/en/security-advisory/documents/intel-csme-security-white-paper.pdf'],
  cseTelemetry: ['coreboot cse_telemetry_v1.h', 'https://review.coreboot.org/plugins/gitiles/coreboot/+/refs/heads/main/src/soc/intel/common/block/include/intelblocks/cse_telemetry_v1.h'],
  cseCommit: ['coreboot commit 860672e9 (measured CSME timings)', 'https://review.coreboot.org/plugins/gitiles/coreboot/+/860672e9879e52820d453e3bc41d151116facb1a'],
  fit: ['Intel FIT BIOS specification', 'https://www.intel.com/content/dam/www/public/us/en/documents/guides/fit-bios-specification.pdf'],
  txt: ['coreboot: Intel TXT / ACM docs', 'https://review.coreboot.org/plugins/gitiles/coreboot/+/refs/heads/main/Documentation/security/intel/txt.md'],
  ermolov: ['Ermolov, “Safeguarding rootkits: Intel BootGuard” (2016)', 'https://papers.put.as/papers/firmware/2016/Intel_BootGuard_final.pdf'],
  entry16: ['coreboot src/cpu/x86/entry16.S', 'https://review.coreboot.org/plugins/gitiles/coreboot/+/refs/heads/main/src/cpu/x86/entry16.S'],
  entry32: ['coreboot src/cpu/x86/entry32.S', 'https://review.coreboot.org/plugins/gitiles/coreboot/+/refs/heads/main/src/cpu/x86/entry32.S'],
  bootblockld: ['coreboot src/arch/x86/bootblock.ld', 'https://review.coreboot.org/plugins/gitiles/coreboot/+/refs/heads/main/src/arch/x86/bootblock.ld'],
  gdt: ['coreboot src/arch/x86/gdt_init.S', 'https://review.coreboot.org/plugins/gitiles/coreboot/+/refs/heads/main/src/arch/x86/gdt_init.S'],
  vtf0: ['EDK2 UefiCpuPkg/ResetVector/Vtf0', 'https://github.com/tianocore/edk2/tree/master/UefiCpuPkg/ResetVector/Vtf0'],
  adlSec: ['edk2-platforms Alder Lake SecEntry.nasm', 'https://github.com/tianocore/edk2-platforms/blob/master/Platform/Intel/AlderlakeOpenBoardPkg/FspWrapper/Library/SecFspWrapperPlatformSecLib/Ia32/SecEntry.nasm'],
  flash: ['Winbond W25Q256JV datasheet', 'https://cdn.sparkfun.com/assets/c/2/9/2/6/W25Q256JV.pdf'],
  ucode: ['Intel microcode release notes', 'https://github.com/intel/Intel-Linux-Processor-Microcode-Data-Files/blob/main/releasenote.md'],
  amd17: ['coreboot: AMD family 17h boot flow', 'https://review.coreboot.org/plugins/gitiles/coreboot/+/refs/heads/main/Documentation/soc/amd/family17h.md'],
}

// ---- logical-processor helpers -------------------------------------------------
// Index 0 is the bootstrap processor (BSP). Indices 0..15 are the eight
// P-cores' two threads each, 16..31 the sixteen E-cores.
const all = (m) => () => m
const bsp = (m, rest = 'wfs') => (i) => (i === 0 ? m : rest)
// A wave across the 31 APs: AP k reaches each entry of `seq` in turn,
// staggered by `spread` of the window so they don't all move at once.
function wave(p, a, b, seq, { before = 'wfs', bspMode = null, spread = 0.55, order = null } = {}) {
  const q = span(p, a, b)
  return (i) => {
    if (i === 0) return bspMode ?? seq[seq.length - 1]
    const rank = order ? order(i) : (i - 1) / 30
    const local = (q * (1 + spread) - rank * spread) * seq.length
    if (local <= 0) return before
    return seq[Math.min(seq.length - 1, Math.floor(local))]
  }
}

// ---- code: coreboot's real-mode prologue, as it runs on Alder/Raptor Lake ------
// Addresses and bytes from coreboot entry16.S assembled for ADL/RPL defaults
// (POST_IO=y, no CBnT). "era" = oldest Intel CPU with that instruction form.
const RESET16 = [
  { a: 'FFFFFFF0', i: 'jmp   _start16bit', era: '8086', why: 'A 3-byte near jump (E9 0D F4). IP wraps from FFF3 to F400 inside the 64 KiB segment, so execution continues at FFFFF400. CS is untouched, so its hidden base FFFF0000 survives.' },
  { a: 'FFFFF400', i: 'cli', era: '8086', why: 'Mask interrupts. IF is already 0 after reset; this is belt-and-braces.' },
  { a: 'FFFFF401', i: 'movl  %eax, %ebp', era: '386', why: 'Stash the built-in self-test result (EAX) in EBP. The 66h prefix lets 16-bit code use a 32-bit register — something no 8086 could do.' },
  { a: 'FFFFF404', i: 'movb  $0x01, %al', era: '8086', why: 'POST code 0x01: “reset vector correct”.' },
  { a: 'FFFFF406', i: 'outb  %al, $0x80', era: '8086', why: 'First visible sign of life: an I/O write that crosses DMI to the chipset, where a POST-code display on the board can show “01”.' },
  { a: 'FFFFF408', i: 'xorl  %eax, %eax', era: '386', why: 'EAX = 0 (32-bit operation, 66h prefix).' },
  { a: 'FFFFF40B', i: 'movl  %eax, %cr3', era: '386', why: 'CR3 = 0, “invalidate TLB”. Paging is off; this is historical caution. Control registers arrived with the 386.' },
  { a: 'FFFFF40E', i: 'movw  %cs, %ax', era: '8086', why: 'AX = F000, the visible CS selector.' },
  { a: 'FFFFF410', i: 'shlw  $4, %ax', era: '186', why: 'AX = F000 << 4, truncated to 16 bits = 0. A shift by an immediate count first appeared on the 80186.' },
  { a: 'FFFFF413', i: 'movw  $nullidt_offset, %bx', era: '8086', why: 'Low 16 bits of the address of a 6-byte “null IDT” descriptor, computed by the linker because there is no stack to compute it at run time.' },
  { a: 'FFFFF416', i: 'subw  %ax, %bx', era: '8086', why: 'Make it relative to CS (a no-op on the BSP).' },
  { a: 'FFFFF418', i: 'lidt  %cs:(%bx)', era: '286', why: 'IDTR = {limit 0}. From now on any exception shuts the CPU down instead of jumping through garbage at physical address 0, where there is no RAM.' },
  { a: 'FFFFF41C', i: 'movw  $gdtptr_offset, %bx', era: '8086', why: 'Point at the GDT descriptor, also in the top 64 KiB of flash.' },
  { a: 'FFFFF41F', i: 'subw  %ax, %bx', era: '8086', why: 'CS-relative again.' },
  { a: 'FFFFF421', i: 'lgdtl %cs:(%bx)', era: '386', why: 'Load the Global Descriptor Table: one flat 4 GiB code segment and one flat data segment. The “l” (66h) matters: a 16-bit LGDT keeps only a 24-bit base, and this table lives at FFFFFxxx.' },
  { a: 'FFFFF426', i: 'movl  %cr0, %eax', era: '386', why: 'EAX = 60000010, the reset value of CR0.' },
  { a: 'FFFFF429', i: 'andl  $0x7FFAFFD1, %eax', era: '386', why: 'Clear PG, AM, WP, NE, TS, EM, MP.' },
  { a: 'FFFFF42F', i: 'orl   $0x60000001, %eax', era: '386', why: 'Keep CD and NW set (caches stay off for now) and set PE — Protection Enable.' },
  { a: 'FFFFF435', i: 'movl  %eax, %cr0', era: '386', why: 'CR0 = 60000011. Protected mode is on — but CS still holds its stale 16-bit real-mode descriptor until it is reloaded.' },
  { a: 'FFFFF438', i: 'movl  %ebp, %eax', era: '386', why: 'Put the self-test result back in EAX for the next stage.' },
  { a: 'FFFFF43B', i: 'ljmpl $0x08, $bootblock_protected_mode_entry', era: '386', why: 'The first far jump. Selector 08h is looked up in the new GDT: base 0, limit 4 GiB, 32-bit. From the next instruction the CPU is a 32-bit protected-mode machine — still running straight out of flash.' },
]

const resetRegs = (p) => {
  const k = Math.floor(p * RESET16.length) // instructions retired so far
  const cr0 = k >= 19 ? '60000011' : '60000010'
  const cs = k >= 21 ? '0008 · base 0 · 4 GiB · 32-bit' : 'F000 · base FFFF0000 · 16-bit'
  const eip = k >= 21 ? 'FFFFFxxx (32-bit)' : ['0000FFF0', '0000F400', '0000F401', '0000F404', '0000F406', '0000F408', '0000F40B', '0000F40E', '0000F410', '0000F413', '0000F416', '0000F418', '0000F41C', '0000F41F', '0000F421', '0000F426', '0000F429', '0000F42F', '0000F435', '0000F438', '0000F43B'][k]
  return {
    title: 'BSP registers',
    note: 'values per Intel SDM Table 12-1',
    rows: [
      ['CS', cs, 'wide' + (k >= 21 ? ' hot' : '')],
      ['EIP', eip, k === 0 ? 'hot' : ''],
      ['CR0', cr0, k >= 19 ? 'hot' : ''],
      ['EDX', '000B0671'],
      ['EAX', k >= 2 && k < 20 ? '00000000 → EBP' : '00000000'],
      ['IDTR', k >= 12 ? 'limit 0 (null)' : '0 / FFFF'],
      ['GDTR', k >= 15 ? 'FFFFFxxx / 1F' : '0 / FFFF', k >= 15 && k < 19 ? 'hot' : ''],
      ['MTRRs', 'off → all UC'],
    ],
  }
}

// ---- stage 0 signal table -------------------------------------------------------
const signals = (p, phase) => {
  // phase: which step we're in (0 standby, 1 press, 2 power, 3 csme, 4 reset)
  const on = (cond) => (cond ? 'high' : 'low')
  const t = phase + p
  return {
    title: 'Board signals',
    note: '# = active low',
    rows: [
      ['PWRBTN#', t > 1.08 && t < 1.4 ? 'low (pressed)' : 'high', t > 1.08 && t < 1.4 ? 'hot' : ''],
      ['SLP_S3#', t > 1.55 ? 'high (S0)' : 'low (S5)', t > 1.55 && t < 2 ? 'hot' : ''],
      ['PS_ON#', t > 1.75 ? 'low (on)' : 'high (off)', t > 1.75 && t < 2.1 ? 'hot' : ''],
      ['+12 V / 5 V / 3.3 V', t > 2.25 ? 'in regulation' : t > 1.9 ? 'ramping' : 'off'],
      ['5 V standby', 'on'],
      ['PWR_OK', on(t > 2.7), t > 2.7 && t < 3.1 ? 'hot' : ''],
      ['PCH_PWROK', on(t > 3.95), t > 3.95 && t < 4.3 ? 'hot' : ''],
      ['CPUPWRGD', on(t > 4.18), t > 4.18 && t < 4.5 ? 'hot' : ''],
      ['PLTRST#', t > 4.32 ? 'high (released)' : 'low (reset)', t > 4.32 && t < 4.7 ? 'hot' : ''],
    ],
  }
}

const STANDBY_LABELS = ['atx24', 'pch', 'sio', 'cmos', 'fpanel', 'spi']

export const STEPS = [
  // ============================== STAGE 0 ==============================
  {
    stage: 0,
    title: 'Off — but not dead',
    dur: 9,
    real: 0,
    mode: 'off',
    shot: 'standby',
    narration: [
      'A PC that is “off” is still sipping power. A coin cell keeps the chipset’s real-time clock ticking at 32,768 Hz and preserves 256 bytes of battery-backed “CMOS” RAM.',
      'With the power supply plugged in, its always-on <em>5 V standby</em> rail also keeps part of the chipset awake — its power-management controller (PMC) — plus a small <em>Super I/O</em> chip whose job right now is to watch the power button.',
    ],
    facts: [
      ['State', 'ACPI S5 “soft off”'],
      ['Alive', 'RTC well, PCH standby well + PMC, Super I/O'],
      ['CPU', 'unpowered — SLP_S3# can cut it off completely'],
    ],
    regs: (p) => signals(p, 0),
    sources: [SRC.pchds, SRC.atx, SRC.sio],
    lps: () => all('off'),
    act(p, A) {
      A.board('cmos', 0.35, ACT.mgmt, 'breathe')
      A.board('atx24', 0.3, ACT.power, 'breathe')
      A.bus('standby', 0.35, ACT.power, { rate: 2, speed: 30 })
      A.board('pch', 0.22, ACT.mgmt, 'breathe')
      A.board('sio', 0.3, ACT.mgmt, 'breathe')
      A.bus('cmos', 0.25, ACT.mgmt, { rate: 0.6, speed: 20 })
    },
    labels: STANDBY_LABELS,
  },
  {
    stage: 0,
    title: 'Press',
    dur: 8,
    real: 0.02,
    mode: 'off',
    shot: 'standby',
    narration: [
      'Pressing the button just pulls a wire to ground. The Super I/O passes it on to the chipset’s <code>PWRBTN#</code> pin, which ignores it for 16 ms in case it was a glitch.',
      'Satisfied, the PMC leaves S5 by releasing its sleep signals (<code>SLP_S5#</code>, <code>SLP_S4#</code>, <code>SLP_S3#</code>). The Super I/O turns <code>SLP_S3#</code> into <code>PS_ON#</code> — the green wire in the 24-pin cable that tells the power supply to switch on.',
    ],
    facts: [
      ['Debounce', '16 ms on PWRBTN# (PCH datasheet)'],
      ['SLP_S3# → PS_ON#', '0–200 ns on a Nuvoton NCT6796D'],
    ],
    regs: (p) => signals(p, 1),
    sources: [SRC.pchds, SRC.sio],
    lps: () => all('off'),
    act(p, A) {
      A.board('cmos', 0.3, ACT.mgmt, 'breathe')
      A.board('atx24', 0.3 + span(p, 0.75, 0.95) * 0.7, ACT.power, 'breathe')
      A.bus('standby', 0.35, ACT.power, { rate: 2, speed: 30 })
      const press = win(p, 0.05, 0.4)
      A.board('fpanel', press, ACT.power, 'glow')
      A.bus('pwrbtn', press, ACT.power, { rate: press * 14, speed: 30 })
      A.board('sio', 0.3 + win(p, 0.15, 0.85) * 0.7, ACT.mgmt, 'glow')
      A.bus('siopch', win(p, 0.2, 0.6), ACT.mgmt, { rate: 10, speed: 12 })
      A.board('pch', 0.25 + win(p, 0.3, 0.7) * 0.75, ACT.mgmt, 'scan')
      A.bus('siopch', win(p, 0.55, 0.75), ACT.power, { rate: 10, speed: 12, dir: -1 })
      A.bus('pson', win(p, 0.65, 1), ACT.power, { rate: 14, speed: 40 })
    },
    labels: [{ id: 'fpanel', hot: true, to: 0.45 }, { id: 'sio', text: 'Super I/O → PWRBTN#, then PS_ON#' }, { id: 'pch', text: 'PMC: 16 ms debounce, leave S5', from: 0.25 }, { id: 'atx24', text: 'PS_ON# low → PSU on', from: 0.7 }],
  },
  {
    stage: 0,
    title: 'Power, proven',
    dur: 9,
    real: 0.28,
    mode: 'off',
    shot: 'power',
    narration: [
      'The supply ramps +12 V, +5 V and +3.3 V — then deliberately waits. <code>PWR_OK</code> may only rise 100–250 ms after the rails are in regulation: the PSU’s promise that the power is stable. It is the longest single wait before the CPU runs anything.',
      'The motherboard’s regulators turn 12 V into the processor’s own rails. The big multi-phase core regulator will take its voltage orders from the CPU itself over a three-wire bus called SVID. DIMMs, the GPU and the SSD get power too, but are held in reset.',
    ],
    facts: [
      ['PSU power-on (T1)', '< 200 ms (ATX 3 required)'],
      ['PWR_OK delay (T3)', '100–250 ms after rails are good'],
      ['CPU rails', 'VccCORE, VccGT (SVID), VccIN_AUX, VDD2 (memory controller), 1.05 V sustain'],
    ],
    regs: (p) => signals(p, 2),
    sources: [SRC.atx, SRC.rplds, SRC.pchds],
    lps: () => all('off'),
    act(p, A) {
      const up = span(p, 0.05, 0.35)
      A.board('atx24', 0.6 + up * 0.4, ACT.power, 'glow')
      A.bus('atx', up, ACT.power, { rate: 30 * up, speed: 90 })
      A.board('eps', up, ACT.power, 'glow')
      A.bus('eps', up, ACT.power, { rate: 24 * up, speed: 70 })
      const vr = span(p, 0.3, 0.55)
      A.board('vrm', vr * 0.9, ACT.power, 'sparkle')
      A.board('vrm2', vr * 0.9, ACT.power, 'sparkle')
      A.bus('vrm', vr, ACT.power, { rate: 20 * vr, speed: 40 })
      A.bus('vrm2', vr, ACT.power, { rate: 20 * vr, speed: 40 })
      const ok = span(p, 0.62, 0.8)
      A.bus('pwrok', win(p, 0.6, 0.85), ACT.mgmt, { rate: 12, speed: 50 })
      A.board('sio', 0.3 + ok * 0.5, ACT.mgmt, 'glow')
      A.board('dimmA', vr * 0.25, ACT.power, 'breathe')
      A.board('dimmB', vr * 0.25, ACT.power, 'breathe')
      A.board('gpu', vr * 0.15, ACT.power, 'breathe')
      A.board('nvme', vr * 0.25, ACT.power, 'breathe')
      A.board('pch', 0.4, ACT.mgmt, 'breathe')
    },
    labels: [{ id: 'atx24', text: '+12 V · +5 V · +3.3 V', hot: true }, { id: 'vrm', text: 'CPU voltage regulator', from: 0.3 }, { id: 'sio', text: 'PWR_OK → board power-good', from: 0.6 }],
  },
  {
    stage: 0,
    title: 'The computer that boots your computer',
    dur: 10,
    real: 0.1,
    mode: 'off',
    shot: 'pch',
    narration: [
      'Inside the chipset sits another processor: the <em>Converged Security and Management Engine</em>, a 32-bit core “based on Intel 486 architecture” with its own SRAM and an unchangeable boot ROM. It starts climbing its own ladder — from reset into protected mode with paging — before the main CPU executes anything.',
      'Its ROM pulls signed firmware out of the CSME region of the same SPI flash chip that holds the BIOS, patches the chipset’s power controller, and sets up the clocks, including the 100 MHz reference clock the CPU will run from. The CPU stays in reset until this engine tells the PMC the host may boot.',
    ],
    note: { tag: 'In parallel', html: 'The CSME works while the power supply is still proving itself; the clock here adds them up one after the other, so treat it as ± a few hundred ms. Intel’s own telemetry on Alder Lake laptops: CSME ROM start → “Host BIOS Prep Done” ≈ 80–90 ms; → CPU reset acknowledged ≈ 240–280 ms.' },
    facts: [
      ['CSME core', '32-bit, 486-class, 512 KB–1.9 MB SRAM'],
      ['Firmware', 'CSME region of the SPI flash'],
      ['Also', 'holds the Boot Guard key hash in fuses'],
    ],
    regs: (p) => signals(p, 3),
    sources: [SRC.csme, SRC.cseTelemetry, SRC.cseCommit],
    lps: () => all('off'),
    act(p, A) {
      A.board('pch', 0.7 + 0.3 * win(p, 0.1, 0.9), ACT.mgmt, 'sparkle')
      A.board('spi', win(p, 0.15, 0.6), ACT.fetch, 'scan')
      A.bus('spi', win(p, 0.15, 0.6), ACT.mgmt, { rate: 16, speed: 25, dir: -1 })
      A.bus('pwrok', win(p, 0.75, 1), ACT.mgmt, { rate: 8, speed: 40 })
      A.board('atx24', 0.8, ACT.power, 'glow')
      A.board('vrm', 0.5, ACT.power, 'breathe')
      A.board('vrm2', 0.5, ACT.power, 'breathe')
      A.board('sio', 0.5, ACT.mgmt, 'glow')
    },
    labels: [{ id: 'pch', text: 'CSME: a 486-class CPU inside the chipset', hot: true }, { id: 'spi', text: 'SPI flash: descriptor · CSME · BIOS regions', from: 0.12 }],
  },
  {
    stage: 0,
    title: 'Reset released — and a leader is chosen',
    dur: 9,
    real: 0.05,
    mode: 'reset',
    shot: [[0, 'socket'], [0.38, 'die']],
    narration: [
      'Every supply reports good. The chipset raises <code>CPUPWRGD</code> and releases <code>PLTRST#</code>, the platform reset — which also reaches the GPU and SSD as PCIe <code>PERST#</code>, after their guaranteed 100 ms of stable power.',
      'Inside the CPU, its power-control firmware brings up clocks and voltages and every core runs its reset microcode. Then one hardware thread becomes the <em>bootstrap processor</em> (BSP). The other 31 halt in <em>wait-for-SIPI</em>: powered, listening, and executing nothing until software sends them a start-up message.',
    ],
    note: { tag: 'Which thread?', html: 'On modern Intel parts the BSP is picked by a platform-specific mix of hardware and configuration (SDM §11.4). Linux’s CPU 0 on Alder/Raptor Lake is a P-core thread; which <em>physical</em> P-core it is isn’t documented, so the one lit here is illustrative.' },
    facts: [
      ['Logical processors', '8 P-cores × 2 threads + 16 E-cores = 32'],
      ['BSP', '1 (IA32_APIC_BASE bit 8 set)'],
      ['APs', '31, in wait-for-SIPI'],
    ],
    regs: (p) => signals(p, 4),
    sources: [SRC.pchds, SRC.sdm, SRC.rplds],
    lps: (p) => (p < 0.3 ? all('off') : p < 0.55 ? all('reset') : wave(p, 0.55, 0.85, ['wfs'], { before: 'reset', bspMode: 'reset', spread: 0.6 })),
    act(p, A) {
      A.bus('sideband', win(p, 0.05, 0.45), ACT.mgmt, { rate: 10, speed: 60 })
      A.bus('perst', win(p, 0.15, 0.5), ACT.mgmt, { rate: 6, speed: 60 })
      A.bus('perst2', win(p, 0.15, 0.5), ACT.mgmt, { rate: 6, speed: 60 })
      A.board('pch', 0.5, ACT.mgmt, 'glow')
      const wash = win(p, 0.3, 0.5, 0.08)
      A.die('die', wash * 0.9, '#ffffff', 'scan')
      A.die('kind:pcore', win(p, 0.32, 0.62) * 0.5, '#d8dcff', 'sparkle')
      A.die('kind:ecore_cluster', win(p, 0.32, 0.62) * 0.5, '#d8dcff', 'sparkle')
      A.die('sa', span(p, 0.3, 0.45) * 0.4, ACT.mgmt, 'breathe')
      A.die('pcore0', span(p, 0.6, 0.8) * 0.55, '#ffffff', 'glow')
    },
    labels: [{ id: 'pcore0', text: 'BSP (P-core 0, thread 0)', hot: true, from: 0.6 }],
  },
  {
    stage: 0,
    title: 'Patching itself before the first instruction',
    dur: 10,
    real: 0.07,
    mode: 'reset',
    shot: 'fetch',
    inset: { shot: 'die', label: 'ON THE DIE' },
    narration: [
      'Before running a single BIOS instruction, the BSP’s microcode reads a pointer stored 64 bytes below the 4 GiB mark (<code>FFFFFFC0</code>) to find the <em>Firmware Interface Table</em> in flash.',
      'The table lists microcode updates. The CPU loads the newest one that matches and applies it to every thread in the package — every boot, because a microcode update “is cleared from the processor upon a hard reset”. The chip you bought is being patched by the flash chip before it runs anything.',
    ],
    facts: [
      ['FIT pointer', 'FFFFFFC0h (4 GiB − 40h)'],
      ['Microcode', 'type-1 FIT entry; RPL-S B0 = 06-b7-01, ≈241 KB'],
      ['CPU reset ack → first instruction', '≈ 49–89 ms measured on Alder Lake laptops'],
    ],
    regs: { title: 'Top of the 4 GiB address space', note: 'all of it is the flash chip', rows: [['FFFFFFF0', 'reset vector (16 bytes)', 'wide'], ['FFFFFFC0', 'FIT pointer', 'wide hot'], ['FFFF0000–FFFFFFFF', 'top 64 KiB: real-mode reach', 'wide'], ['FF000000–FFFFFFFF', '16 MiB BIOS decode window', 'wide']] },
    mem: { on: ['flash', 'lapic'], hit: ['flash'], note: 'no DRAM, no cache' },
    sources: [SRC.fit, SRC.sdm, SRC.ucode, SRC.cseCommit, SRC.bootblockld],
    lps: () => bsp('reset'),
    act(p, A) {
      A.die('pcore0', 0.6, '#ffffff', 'scan')
      A.ring(0.6, ACT.fetch)
      A.flow('fit', 'pcore0', 'dmi', 4, ACT.fetch, 5)
      A.bus('dmi', 0.8, ACT.fetch, { rate: 6, speed: 70 })
      A.bus('spi', 0.9, ACT.fetch, { rate: 10, speed: 30, dir: -1 })
      A.bus('dmi', 0.8, ACT.fetch, { rate: 8, speed: 70, dir: -1 })
      A.board('spi', 0.9, ACT.fetch, 'scan')
      A.board('pch', 0.5, ACT.fetch, 'glow')
      // the patch lands in every core
      const patch = span(p, 0.55, 0.95)
      if (patch > 0) {
        for (const id of ['pcore1', 'pcore2', 'pcore3', 'pcore4', 'pcore5', 'pcore6', 'pcore7', 'ecl0', 'ecl1', 'ecl2', 'ecl3']) A.flow(`uc-${id}`, 'dmi', id, 1.2, '#ffffff', 6)
        A.die('kind:pcore', patch * 0.3, '#ffffff', 'scan')
        A.die('kind:ecore_cluster', patch * 0.3, '#ffffff', 'scan')
      }
    },
    labels: [{ id: 'spi', text: 'FIT → microcode update', hot: true }, { id: 'dmi', text: 'DMI 4.0 ×8 to the chipset' }],
  },
  {
    stage: 0,
    title: 'The secret first program',
    dur: 10,
    real: 0.01,
    mode: 'prot',
    shot: 'dieLeft',
    narration: [
      'On PCs with <em>Intel Boot Guard</em> provisioned, the FIT also lists an Intel-signed <em>Startup ACM</em>, and the CPU runs it before the reset vector — in 32-bit protected mode, from inside its own cache. So on those machines the first x86 code to run isn’t 16-bit at all: the “386” runs before the “8086”.',
      'The ACM checks the PC maker’s key manifest against a key hash fused into the chipset, then hashes the BIOS’s Initial Boot Block before letting it execute. It leaves that boot block sitting in cache, in the same No-Eviction Mode that comes back in Stage 2.',
    ],
    note: { tag: 'Not every PC', html: 'Boot Guard must be provisioned (fused) by the board maker. OEM desktops and laptops usually are; many DIY retail motherboards are not. Without it, the BSP goes straight to the reset vector.' },
    facts: [
      ['FIT type', '0x02 Startup ACM, 0x0B Key Manifest, 0x0C Boot Policy Manifest'],
      ['Runs in', '32-bit protected mode, paging off, from cache'],
      ['Leaves behind', 'MSR 0x13A bit 0 = NEM enabled'],
    ],
    mem: { on: ['flash', 'lapic', 'car'], hit: ['car', 'flash'], note: 'Boot Guard only' },
    sources: [SRC.fit, SRC.txt, SRC.ermolov, SRC.csme],
    lps: () => bsp('prot'),
    act(p, A) {
      A.die('pcore0', 0.8, ACT.car, 'scan')
      A.die('llc0', 0.4 + 0.3 * span(p, 0.2, 0.6), ACT.car, 'pinned')
      A.die('sub:pcore0:l2', 0.5, ACT.car, 'pinned')
      A.ring(0.5, ACT.car)
      A.flow('ibb', 'dmi', 'pcore0', 3, ACT.fetch, 5)
      A.flow('acm', 'pcore0', 'llc0', 4, ACT.car, 4)
    },
    labels: [{ id: 'pcore0', text: 'Startup ACM (Intel-signed)', hot: true }, { id: 'llc0', text: 'cache as private RAM' }],
  },

  // ============================== STAGE 1 ==============================
  {
    stage: 1,
    title: 'Wake up as a 1978 processor',
    dur: 9,
    real: 0,
    isReset: true,
    mode: 'real',
    shot: 'die',
    narration: [
      'Now the BSP looks like a freshly reset 8086: <em>real mode</em>, where an address is “segment × 16 + offset” and 64 KiB segments reach about 1 MiB. Caches are disabled and every MTRR is off, so all memory is uncacheable.',
      'But there is a trick. Real mode can’t reach 4 GiB, so at reset the CPU loads the code segment’s <em>hidden</em> base with <code>FFFF0000</code> while the visible selector says <code>F000</code>. Add <code>IP = FFF0</code> and the first fetch comes from <code>FFFFFFF0</code> — 16 bytes below 4 GiB. An 8086 started at <code>FFFF0</code>, 16 bytes below 1 MiB.',
    ],
    facts: [
      ['First fetch', 'FFFFFFF0h (since the 386)'],
      ['EDX at reset', '000B0671 = this CPU’s own model ID'],
      ['Caching', 'CR0.CD = NW = 1, MTRRs off → uncacheable'],
    ],
    regs: (p) => resetRegs(0),
    code: { src: 'coreboot entry16.S', href: SRC.entry16[1], lines: RESET16, at: () => 0, title: 'Next to execute' },
    mem: { on: ['flash', 'lapic'], hit: [], note: 'nothing writable anywhere' },
    sources: [SRC.sdm, SRC.rplds],
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
      'There is no memory controller set up, no cache, no RAM. The fetch leaves the core, crosses the ring and the DMI link to the chipset, whose SPI controller reads it serially from the flash chip at up to 50 MHz. The chipset wires the top 16 MiB below 4 GiB to the BIOS region of that chip.',
      'Only 16 bytes fit between <code>FFFFFFF0</code> and the end of the address space, so the first instruction is always a jump. coreboot’s is 3 bytes, <code>E9 0D F4</code>: a <em>near</em> jump that wraps around inside the 64 KiB segment to <code>FFFFF400</code> without touching CS, so the hidden base survives.',
    ],
    facts: [
      ['One 64-byte flash read', '≈ 3 µs (quad I/O, 50 MHz) to 11 µs (single-bit)'],
      ['Path', 'core → ring → system agent → DMI → PCH → SPI → flash'],
      ['For scale', 'a 5 GHz core could retire tens of thousands of instructions in that time'],
    ],
    regs: (p) => resetRegs(p < 0.7 ? 0 : 1 / RESET16.length + 0.001),
    code: { src: 'coreboot entry16.S', href: SRC.entry16[1], lines: RESET16, at: (p) => (p < 0.7 ? 0 : 1) },
    mem: { on: ['flash', 'lapic'], hit: ['flash'] },
    sources: [SRC.sdm, SRC.pchds, SRC.flash, SRC.entry16, SRC.bootblockld],
    lps: () => bsp('real'),
    act(p, A) {
      A.die('sub:pcore0:fe', 1, ACT.fetch, 'scan')
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
      'There is still no stack, so nothing can be <code>call</code>ed — coreboot parks the self-test result in EBP, and EDK2’s reset vector parks it in the stack pointer itself because there is no stack to point at. An <code>out</code> to port 80h sends POST code <code>01</code> across DMI, the machine’s first visible sign of life.',
    ],
    facts: [
      ['Real-mode prologue', '21 instructions (coreboot), 17 (EDK2 VTF0), 29 (Intel’s Alder Lake reference)'],
      ['Instructions newer than the 8086 here', 'about two-thirds'],
    ],
    regs: (p) => resetRegs((1 + p * 13) / RESET16.length + 0.001),
    code: { src: 'coreboot entry16.S', href: SRC.entry16[1], lines: RESET16, at: (p) => Math.min(13, 1 + Math.floor(p * 13)) },
    mem: { on: ['flash', 'lapic'], hit: ['flash'] },
    sources: [SRC.entry16, SRC.vtf0, SRC.adlSec, SRC.sdm],
    lps: () => bsp('real'),
    act(p, A, t) {
      A.die('sub:pcore0:fe', 0.9, ACT.fetch, 'scan')
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
      'Load a tiny table from flash — the GDT — describing one flat 4 GiB code segment and one data segment. Set bit 0 of CR0, <em>Protection Enable</em>. Then make the first far jump: selector <code>08h</code> is looked up in the new table, and CS becomes base 0, limit 4 GiB, 32-bit.',
      'That’s it — real mode is over after about twenty instructions. LaurieWired’s “15–30 instructions” is right on: 21 in coreboot, 17 in EDK2’s generic reset vector, 29 in Intel’s Alder Lake reference code.',
    ],
    note: { tag: 'Thread check', html: '“500 ns (ish)” is plausible only when Boot Guard has pre-loaded this code into cache. Fetched uncached from SPI flash, 21 instructions take more like <em>15–60 µs</em> (an estimate — no one seems to have published a measurement). And the stack isn’t built here: real mode only loads a GDT and flips PE. The writable stack comes next, in 32-bit mode.' },
    facts: [
      ['Time in real mode', '≈ 15–60 µs uncached (estimate); sub-µs if Boot Guard cached it'],
      ['Leaves with', 'caches still off, still no RAM, still no stack'],
    ],
    regs: (p) => resetRegs((14 + p * 7.2) / RESET16.length + 0.001),
    code: { src: 'coreboot entry16.S', href: SRC.entry16[1], lines: RESET16, at: (p) => Math.min(20, 14 + Math.floor(p * 7.2)) },
    mem: { on: ['flash', 'lapic'], hit: ['flash'] },
    sources: [SRC.entry16, SRC.gdt, SRC.sdm, SRC.thread],
    lps: (p) => bsp(p < 0.86 ? 'real' : 'prot'),
    act(p, A) {
      const jump = span(p, 0.84, 0.95)
      A.die('pcore0', 0.6 + jump * 0.4, jump > 0.5 ? '#4fe08a' : ACT.fetch, jump > 0 ? 'scan' : 'glow')
      A.die('sub:pcore0:fe', 0.8, ACT.fetch, 'scan')
      A.ring(0.5, ACT.fetch)
      A.flow('f', 'pcore0', 'dmi', 3, ACT.fetch, 5)
    },
    labels: [{ id: 'pcore0', text: 'BSP', hot: true }],
  },

  // ======================= (later stages: placeholders) ========================
  {
    stage: 2,
    title: 'Memory training (placeholder)',
    dur: 8,
    real: 2,
    mode: 'prot',
    shot: [[0, 'dieLeft'], [0.4, 'dimms']],
    narration: ['Placeholder.'],
    lps: () => bsp('prot'),
    eye: { title: 'Read DQ eye', sub: 'DIMM A · rank 0 · DQ5', kind: 'read' },
    act(p, A, t) {
      A.die('kind:llc_slice', 0.7, ACT.car, 'pinned')
      A.die('kind:imc', 1, ACT.train, 'sparkle')
      A.die('kind:ddr_phy', 1, ACT.train, 'sparkle')
      A.bus('ddrA', 1, ACT.train, { rate: 30, speed: 80 })
      A.bus('ddrB', 1, ACT.train, { rate: 30, speed: 80 })
      A.chips((d, r, s, i) => (Math.sin(t * 8 + i + s * 2) > 0.3 ? 1 : 0.1), ACT.train)
    },
    labels: ['dimmA', 'dimmB'],
  },
]
