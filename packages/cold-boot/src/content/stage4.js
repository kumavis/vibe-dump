// Stage 4 — the operating system wakes the 31 application processors (APs)
// again, and each one climbs the mode ladder from real mode one more time.

import { ACT, span, win, SRC, isPrimary, isSibling } from './common.js'

// Linux's AP trampoline, verbatim highlights (arch/x86/realmode/rm/trampoline_64.S).
const TRAMPOLINE = [
  { i: 'cli', era: '8086', why: 'Woken by a Start-up IPI, the AP is in 16-bit real mode at CS = VV00h, IP = 0 — the page number the IPI carried.' },
  { i: 'wbinvd', era: '486', why: 'Write back and invalidate this core’s caches. (coreboot’s firmware trampoline pointedly does not: “On hyper threaded cpus, invalidating the cache here is very very bad.”)' },
  { i: 'LJMPW_RM(1f)', era: '8086', why: 'A real-mode far jump to normalise CS:IP. Unlike the BSP at the reset vector, an AP can do this safely: its CS base already equals selector × 16.' },
  { i: 'mov   %cs, %ax', era: '8086', why: 'Code and data share the same 4 KiB page below 1 MiB…' },
  { i: 'mov   %ax, %ds / %es / %ss', era: '8086', why: '…so every segment points at it.' },
  { i: 'LOCK_AND_LOAD_REALMODE_ESP', era: '386', why: 'A lock btsl spinlock: only one AP at a time may use the shared real-mode stack. This is what makes parallel bring-up safe.' },
  { i: 'call  verify_cpu', era: '8086', why: 'Unlike the BSP at reset, this code has a stack — the kernel put one below 1 MiB — so it can call a routine that checks the CPU supports long mode.' },
  { i: 'lidtl tr_idt', era: '386', why: 'A zero-length IDT, as at reset: any exception now shuts down instead of vectoring into nowhere.' },
  { i: 'lgdtl tr_gdt', era: '386', why: 'The trampoline’s GDT: a flat 32-bit code segment, a 64-bit code segment (L = 1), a flat data segment.' },
  { i: 'movl  $(CR0_STATE & ~X86_CR0_PG), %eax', era: '386', why: 'Protected mode on, paging still off.' },
  { i: 'movl  %eax, %cr0', era: '386', why: '1985: protected mode.' },
  { i: 'ljmpl $__KERNEL32_CS, $pa_startup_32', era: '386', why: 'Far jump reloads CS with a 32-bit descriptor.' },
  { i: '.code32', era: '' , why: '' },
  { i: 'movl  pa_tr_cr4, %eax ; movl %eax, %cr4', era: 'P6', why: 'Enable PAE — physical address extension, a Pentium Pro (1995) feature long mode requires.' },
  { i: 'movl  $pa_trampoline_pgd, %eax ; movl %eax, %cr3', era: '386', why: 'Point CR3 at the trampoline’s 4-level page tables.' },
  { i: 'movl  $MSR_EFER, %ecx ; rdmsr ; … ; wrmsr', era: 'AMD64', why: 'Set EFER.LME, the long-mode enable bit, in AMD’s Extended Feature Enable Register.' },
  { i: 'movl  $CR0_STATE, %eax ; movl %eax, %cr0', era: 'AMD64', why: 'Turn paging on. With LME set, this activates long mode — in 32-bit compatibility mode until CS is reloaded.' },
  { i: 'ljmpl $__KERNEL_CS, $pa_startup_64', era: 'AMD64', why: 'Load a code segment with L = 1. The AP is now a 64-bit AMD64 processor (2003).' },
  { i: '.code64', era: '', why: '' },
  { i: 'jmpq  *tr_start(%rip)', era: 'AMD64', why: 'RIP-relative addressing — itself an AMD64 invention — jumps into the kernel proper: secondary_startup_64.' },
]

const KICK = [
  '/* Assert INIT on the target CPU */',
  'apic_icr_write(APIC_INT_LEVELTRIG | APIC_INT_ASSERT |',
  '               APIC_DM_INIT, phys_apicid);',
  'udelay(init_udelay);            /* 0 on modern CPUs */',
  '/* Deassert INIT on the target CPU */',
  'apic_icr_write(APIC_INT_LEVELTRIG | APIC_DM_INIT, phys_apicid);',
  'for (j = 1; j <= num_starts; j++) {      /* num_starts = 2 */',
  '    apic_icr_write(APIC_DM_STARTUP | (start_eip >> 12),',
  '                   phys_apicid);',
  '    udelay(10);   /* give the other CPU time to accept the IPI */',
  '}',
]

// Linux >= 6.5 brings up all primary threads (the 7 other P-core thread-0s and
// all 16 E-cores = 23) before the 8 P-core sibling threads. Within a wave the
// BSP kicks each AP in turn without waiting; a kicked AP runs the first few
// trampoline instructions and then spins in real mode on the lock that guards
// the shared real-mode stack, so the 16 -> 32 -> 64 climb happens one AP at a
// time. Only the per-CPU startup afterwards overlaps.
function osBringup(p, a, b) {
  const primaries = []
  const siblings = []
  for (let i = 1; i < 32; i++) (i < 16 && i % 2 === 1 ? siblings : primaries).push(i)
  const order = [...primaries, ...siblings]
  const n = order.length
  const rankOf = new Map(order.map((i, k) => [i, k]))
  const q = span(p, a, b)
  return (i) => {
    if (i === 0) return 'os'
    const k = rankOf.get(i)
    const wave2 = k >= primaries.length
    // kicks: fast, sequential, each wave kicked as it starts
    const kick = wave2 ? 0.5 + ((k - primaries.length) / siblings.length) * 0.12 : (k / primaries.length) * 0.18
    // turns on the lock: one after another across the window
    const turn = 0.06 + (k / n) * 0.86
    const slot = 0.86 / n
    if (q < kick) return 'park'
    if (q < kick + 0.02) return 'wfs' // INIT received: back in wait-for-SIPI
    if (q < turn) return 'real' // spinning on the trampoline lock in 16-bit code
    if (q < turn + slot * 0.45) return 'prot'
    return 'long'
  }
}

const P_IDS = ['pcore0', 'pcore1', 'pcore2', 'pcore3', 'pcore4', 'pcore5', 'pcore6', 'pcore7']
const E_IDS = ['ecl0', 'ecl1', 'ecl2', 'ecl3']

export const STAGE4 = [
  {
    stage: 4,
    title: 'The OS knocks again',
    dur: 11,
    real: 0.01,
    mode: 'long',
    shot: 'die',
    narration: [
      'At hand-off the firmware leaves the 31 other threads halted in a tiny loop, in memory the OS has promised not to touch. The OS learns they exist from ACPI’s MADT table, which lists every APIC ID, the boot processor first.',
      'Then, for each AP in turn, Linux writes its Local APIC’s Interrupt Command Register — the MMIO register at <code>FEE0_0300h</code>, or MSR <code>830h</code> when the kernel runs the APICs in x2APIC mode, as it often does on modern Intel: an <em>INIT</em>, which drops the AP straight back to its reset state, and two <em>Start-up IPIs</em> carrying a one-byte page number. The AP will begin executing in real mode at that page × 4096, a trampoline the kernel copied below 1 MiB.',
    ],
    note: { tag: 'What INIT keeps', html: 'INIT resets the registers and the APIC, but leaves caches, MTRRs, most MSRs and the SMM base the firmware set alone (SDM Table 12-1, §34.11). The ladder restarts; the housekeeping mostly doesn’t.' },
    facts: [
      ['ICR', 'FEE0_0300h (xAPIC) or MSR 830h (x2APIC, platform-dependent)'],
      ['Per AP', 'INIT, then SIPI, SIPI — targeted, not broadcast'],
      ['10 ms INIT delay', 'skipped on modern CPUs (init_udelay = 0)'],
    ],
    regs: (p) => ({
      title: 'BSP → Local APIC ICR (low dword)',
      note: 'one AP shown',
      rows: [
        ['INIT assert', '0000C500', p > 0.15 && p < 0.4 ? 'hot wide' : 'wide'],
        ['INIT de-assert', '00008500', p > 0.35 && p < 0.55 ? 'hot wide' : 'wide'],
        ['SIPI × 2', '000006VV  (VV = trampoline page)', p > 0.55 && p < 0.9 ? 'hot wide' : 'wide'],
        ['AP starts at', 'CS = VV00h, IP = 0 → VV000h', p > 0.85 ? 'hot wide' : 'wide'],
      ],
    }),
    code: { src: 'Linux arch/x86/kernel/smpboot.c', href: SRC.smpboot[1], lines: KICK, at: (p) => Math.min(KICK.length - 1, Math.floor(span(p, 0.1, 0.95) * KICK.length)) },
    mem: { on: ['dram', 'mmio', 'lapic', 'flash', 'high'], hit: ['lapic'], note: 'ICR is an APIC register' },
    sources: [SRC.smpboot, SRC.acpi, SRC.sdm],
    lps: (p) => (i) => (i === 0 ? 'os' : p < 0.4 ? 'park' : p < 0.85 ? 'wfs' : 'wfs'),
    act(p, A) {
      A.die('pcore0', 0.7, ACT.dram, 'glow')
      A.die('sub:pcore0:l2', 0.3, ACT.dram, 'glow')
      const k = win(p, 0.1, 0.95)
      if (k > 0) {
        for (const id of [...P_IDS.slice(1), ...E_IDS]) A.flow(`ipi-${id}`, 'pcore0', id, 1.6 * k, ACT.ipi, 7)
        A.ring(0.6 * k, ACT.ipi)
      }
      A.die('kind:pcore', win(p, 0.4, 0.6) * 0.25, '#ffffff', 'scan')
      A.die('kind:ecore_cluster', win(p, 0.4, 0.6) * 0.25, '#ffffff', 'scan')
    },
    labels: [{ id: 'pcore0', text: 'BSP: running the kernel', hot: true }],
  },
  {
    stage: 4,
    title: 'Thirty-one more trips from 1978 to 2003',
    dur: 14,
    real: 0.03,
    mode: 'long',
    shot: [[0, 'die'], [0.55, 'dieRight']],
    narration: [
      'Each AP wakes as an 8086 in the kernel’s trampoline, and in a couple of dozen instructions it is a 386, then an AMD64. Watch the era tags again: <code>wbinvd</code> from the 486, PAE from the Pentium Pro, <code>EFER.LME</code> and RIP-relative jumps from AMD64.',
      'They take turns. The BSP kicks each AP in quick succession without waiting for it, but the trampoline shares one real-mode stack, guarded by a lock: kicked APs spin on it in 16-bit code, and each climbs to 64-bit only when its turn comes, releasing the lock once it is on its own kernel stack. Since Linux 6.5, what overlaps is the rest of each AP’s startup — and the primary threads (seven other P-core first threads and all sixteen E-cores) go before the eight P-core sibling threads, so a core’s microcode update is done before its second thread joins.',
    ],
    note: { tag: 'Thread check', html: '“Every single core has to go through the same process” — every <em>thread</em> climbs the same mode ladder, and not just once: on a typical UEFI PC, typically once in 32-bit PEI, again in 64-bit DXE, and again here. But no AP ever runs the reset vector, cache-as-RAM, DRAM training or PCIe enumeration. They are fast mostly because they skip all that, and because they run side by side.' },
    facts: [
      ['Order', '23 primary threads (7 P + 16 E), then 8 P-core siblings'],
      ['Climb', 'one AP at a time (trampoline lock); later startup overlaps'],
      ['Per AP', '350 µs – 3.5 ms to report alive (upstream measurements, various CPUs)'],
      ['Big server', '~800 ms → ~80 ms with parallel bring-up (2-socket Skylake)'],
    ],
    code: { src: 'Linux arch/x86/realmode/rm/trampoline_64.S', href: SRC.tramp[1], lines: TRAMPOLINE, at: (p) => Math.min(TRAMPOLINE.length - 1, Math.floor(span(p, 0.05, 0.5) * TRAMPOLINE.length)), title: 'One AP’s trampoline' },
    mem: { on: ['dram', 'mmio', 'lapic', 'flash', 'high'], hit: ['dram'], note: 'trampoline page below 1 MiB' },
    sources: [SRC.tramp, SRC.cpuhp, SRC.lkml65, SRC.head64],
    lps: (p) => osBringup(p, 0.04, 0.97),
    act(p, A) {
      A.die('pcore0', 0.5, ACT.dram, 'glow')
      const w1 = win(p, 0.04, 0.6)
      const w2 = win(p, 0.5, 0.96)
      A.die('kind:ecore_cluster', 0.2 + w1 * 0.5, '#7fd8ff', 'sparkle')
      A.die('kind:pcore', 0.15 + Math.max(w1, w2) * 0.4, '#7fd8ff', 'sparkle')
      for (const id of [...P_IDS, ...E_IDS]) A.flow(`tr-${id}`, id, 'imc0', 0.8 * Math.max(w1, w2), ACT.dram, 6)
      A.die('kind:imc', 0.5 * Math.max(w1, w2), ACT.dram, 'scan')
      A.ring(0.6 * Math.max(w1, w2), ACT.dram)
    },
    labels: [{ id: 'ecl1', text: 'primary threads first (incl. all E-cores)', to: 0.55 }, { id: 'pcore2', text: 'then the P-core sibling threads', from: 0.6 }],
  },
  {
    stage: 4,
    title: 'Checking in',
    dur: 10,
    real: 0.02,
    mode: 'long',
    shot: 'dieRight',
    narration: [
      'Now in 64-bit mode with kernel page tables, each AP finds its own CPU number by reading its APIC ID, takes its own idle stack, and releases the trampoline’s lock for the next one.',
      'Then the per-thread chores: check its microcode (already current, almost always), program its Local APIC, re-sync its memory-type registers with the boot CPU, and ask CPUID leaf 1Ah what it is — <code>40h</code> for a Core (P-core), <code>20h</code> for an Atom (E-core). Finally it marks itself online and drops into the idle loop, ready for the scheduler.',
    ],
    facts: [
      ['CPUID.1AH:EAX[31:24]', '40h = P-core · 20h = E-core'],
      ['Microcode', 'MSR 79h written only if newer than what is running'],
      ['Ends in', 'the kernel idle loop'],
    ],
    regs: { title: 'What each thread reports', rows: [['P-core thread', 'core type 40h (Core)'], ['E-core', 'core type 20h (Atom)'], ['P-cores', '8 × 2 threads'], ['E-cores', '16 × 1 thread'], ['Online', '32 of 32', 'hot']] },
    mem: { on: ['dram', 'mmio', 'lapic', 'flash', 'high'], hit: ['dram'] },
    sources: [SRC.head64, SRC.smpboot, SRC.sdm],
    lps: (p) => (i) => {
      if (i === 0) return 'os'
      const k = isSibling(i) ? 0.5 + ((i - 1) / 2) * 0.05 : (i < 16 ? i / 2 : 8 + (i - 16)) / 23 * 0.5
      return p > 0.1 + k * 0.8 ? 'os' : 'long'
    },
    act(p, A) {
      A.die('kind:pcore', 0.3, '#f2f4ff', 'breathe')
      A.die('kind:ecore_cluster', 0.3, '#f2f4ff', 'breathe')
      A.ring(0.4, '#f2f4ff')
    },
  },
]
