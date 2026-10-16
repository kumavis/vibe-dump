// Stage 2 — 32-bit protected mode: the CPU turns part of its own cache into
// RAM (Intel No-Eviction Mode), runs C on that borrowed stack, trains the
// DDR5, moves into real memory, and wakes the other threads for the first time.
//
// Code is coreboot's (open source) for Alder/Raptor Lake; a vendor UEFI BIOS
// does the same jobs through Intel's FSP binaries (TempRamInit, FspMemoryInit),
// whose insides are not public. The DDR5 MRC is also closed, so the training
// loops shown are from coreboot's open re-implementation of Intel's Haswell
// (DDR3) memory code, which keeps Intel's step names.

import { ACT, span, win, SRC, bsp, wave, walk } from './common.js'

const LLC = ['llc0', 'llc1', 'llc2', 'llc3', 'llc4', 'llc5', 'llc6', 'llc7', 'llc8', 'llc9', 'llc10', 'llc11']
const ALL_CORES = ['pcore1', 'pcore2', 'pcore3', 'pcore4', 'pcore5', 'pcore6', 'pcore7', 'ecl0', 'ecl1', 'ecl2', 'ecl3']
const MEM_PRE = { on: ['flash', 'lapic', 'car'], hit: ['car', 'flash'], note: 'no DRAM yet' }


// ---- code excerpts (verbatim, trimmed) -----------------------------------------
const EARLY_RESET = [
  'check_mtrr:',
  '	/* Use the MTRR default type MSR as a proxy for detecting INIT#.',
  '	 * Reset the system if any known bits are set in that MSR. That is',
  '	 * an indication of the CPU not being properly reset. */',
  'check_for_clean_reset:',
  '	movl	$MTRR_DEF_TYPE_MSR, %ecx',
  '	rdmsr',
  '	andl	$(MTRR_DEF_TYPE_EN | MTRR_DEF_TYPE_FIX_EN), %eax',
  '	cmp	$0, %eax',
  '	jnz	warm_reset',
  { i: '	jmp	*%esp', why: '“return”: the caller put its return address in ESP — there is no stack yet' },
]

const CAR_MTRR = [
  '	/* Configure default memory type to uncacheable (UC) */',
  '	mov	$MTRR_DEF_TYPE_MSR, %ecx',
  '	rdmsr',
  '	/* Clear enable bits and set default type to UC. */',
  '	and	$~(MTRR_DEF_TYPE_MASK | MTRR_DEF_TYPE_EN | \\',
  '		 MTRR_DEF_TYPE_FIX_EN), %eax',
  '	wrmsr',
  '	...',
  { i: '	find_free_mtrr', why: 'macro: leaves ECX = first free variable MTRR (200h after the wipe)' },
  '	...',
  '	/* Configure CAR region as write-back (WB) */',
  { i: '	mov	$CONFIG_DCACHE_RAM_BASE, %eax', why: 'CONFIG_DCACHE_RAM_BASE = 0xFEF00000 on Alder/Raptor Lake' },
  '	or	$MTRR_TYPE_WRBACK, %eax',
  '	xor	%edx,%edx',
  '	wrmsr',
  '	incl	%ecx',
  '	mov	$(512 * KiB), %eax	/* size mask */',
  '	...                              # write mask 0, then again for +256 KiB',
  '	/* Enable variable MTRRs */',
  '	mov	$MTRR_DEF_TYPE_MSR, %ecx',
  '	rdmsr',
  '	or	$MTRR_DEF_TYPE_EN, %eax',
  '	wrmsr',
  '	/* Enable caching */',
  '	mov	%cr0, %eax',
  '	and	$~(CR0_CD | CR0_NW), %eax',
  '	invd',
  '	mov	%eax, %cr0',
]

const CAR_ENEM = [
  'car_nem_enhanced:',
  '	/* Disable cache eviction (setup stage) */',
  '	mov	$MSR_EVICT_CTL, %ecx',
  '	rdmsr',
  '	or	$0x1, %eax',
  '	wrmsr',
  '	...                                  # size the LLC, pick data ways, SF masks',
  '	/* Set MSR 0xC85 L3_Protected_ways = ((1 << data ways) - 1) */',
  '	mov	%esi, %eax',
  '	xorl	%edx, %edx',
  '	mov	$IA32_L3_PROTECTED_WAYS, %ecx',
  '	wrmsr',
  '	...                                  # EAX = every way but the data way',
  '	movl	$IA32_L3_MASK_1, %ecx',
  '	xorl	%edx, %edx',
  '	wrmsr',
  '	...',
  '	mov	%esi, %eax',
  '	movl	$IA32_L3_MASK_2, %ecx',
  '	xorl	%edx, %edx',
  '	wrmsr',
  '	...',
  '	movl	$IA32_PQR_ASSOC, %ecx',
  '	...',
  { i: '	movl	$0x02, %edx', why: 'class of service 2: fills may use only the data way' },
  '	...',
  '	wrmsr',
  { i: '	clear_car', why: 'macro: rep stosl of zeros over the 768 KiB window' },
  '	...',
  '	movl	$IA32_PQR_ASSOC, %ecx',
  '	...',
  { i: '	movl	$0x01, %edx', why: 'class of service 1: every way but the data way' },
  '	...',
  '	wrmsr',
  '	...',
  '	/*',
  '	 * Enable No-Eviction Mode Run State by setting',
  '	 * NO_EVICT_MODE MSR 2E0h bit [1] = \'1\'.',
  '	 */',
  '	movl	$MSR_EVICT_CTL, %ecx',
  '	rdmsr',
  '	orl	$0x02, %eax',
  '	wrmsr',
]

const CAR_DONE = [
  'car_init_done:',
  '	post_code(POSTCODE_SOC_CAR_INIT_DONE)',
  '	/* Setup bootblock stack */',
  '	mov	$_ecar_stack, %esp',
  '	...',
  '	/* Copy .data section content to Cache-As-Ram */',
  '#include <cpu/x86/copy_data_section.inc>',
  'before_carstage:',
  '	post_code(POSTCODE_SOC_BEFORE_CARSTAGE)',
  { i: '	call	bootblock_c_entry', why: 'the firmware’s first CALL since the reset vector' },
]

const SPD_READ = [
  'static void smbus_read_spd5(u8 *spd, u8 spd_addr, u16 size)',
  '{',
  '	u8 page = ~0;',
  { i: '	u32 max_page_size = MAX_SPD_PAGE_SIZE_SPD5;', why: 'MAX_SPD_PAGE_SIZE_SPD5 = 128: the hub shows 128 bytes at a time' },
  '	...',
  '	for (int i = 0; i < size; i++) {',
  '		u8 next_page = (u8) (i / max_page_size);',
  '		if (next_page != page) {',
  { i: '			switch_page(spd_addr, next_page);', why: 'writes the page number into the hub’s MR11' },
  '			page = next_page;',
  '		}',
  '		unsigned int byte_addr = SPD_HUB_MEMREG(i % max_page_size);',
  '		spd[i] = smbus_read_byte(spd_addr, byte_addr);',
  '	}',
  '}',
]

const BOOTMODE = [
  '	data = mrc_cache_current_mmap_leak(MRC_TRAINING_DATA, version,',
  '					   &mrc_size);',
  '	if (data == NULL)',
  '		return;',
  '	/* MRC cache found */',
  '	arch_upd->NvsBufferPtr = (uintptr_t)data;',
  '	...',
  '	/* Configure bootmode */',
  '	if (s3wake) {',
  '		arch_upd->BootMode = FSP_BOOT_ON_S3_RESUME;',
  '	} else {',
  '		if (arch_upd->NvsBufferPtr)',
  '			arch_upd->BootMode =',
  '				FSP_BOOT_ASSUMING_NO_CONFIGURATION_CHANGES;',
  '		else',
  '			arch_upd->BootMode = FSP_BOOT_WITH_FULL_CONFIGURATION;',
  '	}',
]

const JWRL = [
  '	const uint16_t wl_start = 192;',
  '	const uint16_t wl_stop  = 192 + 128;',
  '	const uint16_t wl_step  = 2;',
  '	...                         # for each rank:',
  '	for (uint16_t wl_delay = wl_start; wl_delay < wl_stop; wl_delay += wl_step) {',
  '		...                       # for each channel with this rank:',
  '		for (uint8_t byte = 0; byte < ctrl->lanes; byte++) {',
  '			update_txt(ctrl, channel, rank, byte, TXT_TXDQS,',
  '				wl_delay);',
  '		}',
  '		...',
  '		io_reset();',
  '		udelay(wait_time_us);',
  '		...                       # for each channel with this rank:',
  '		for (uint8_t byte = 0; byte < ctrl->lanes; byte++) {',
  '			const uint32_t feedback =',
  '				get_data_train_feedback(channel, byte);',
  '			const bool pass = (feedback & 0x1ff) >= 16;',
  '			...',
  '			phase_record_pass(&region_data[channel][byte],',
  '				pass, wl_delay, wl_start, wl_step);',
  '		}',
  '		...',
  '	}',
]

const MARGIN_1D = [
  '	for (int32_t offset = m_start; offset <= m_stop; offset += m_step) {',
  '		...',
  '		change_1d_margin_multicast(ctrl, param, offset, 0, false,',
  '			REG_FILE_USE_START);',
  '		run_io_test(ctrl, chanmask, ctrl->dq_pat, 1);',
  '		for (uint8_t channel = 0; channel < NUM_CHANNELS; channel++) {',
  '			...',
  '			/* Read out byte group error results and update limit */',
  '			const uint16_t result = get_byte_group_errors(channel);',
  '			...',
  '			for (uint8_t byte = 0; byte < ctrl->lanes; byte++) {',
  '				const bool pass = !(result & BIT(byte));',
  '				printk(MARGIN_1D_PLOT, pass ? ". " : "# ");',
  '				linear_record_pass(&region_data[channel][byte],',
  '					pass, offset, m_start, m_step);',
  '			}',
  '		}',
  '	}',
]

const RPL_STEPS = [
  '/* Raptor Lake-S FSP-M training switches (FspmUpd.h): */',
  '/* a selection from ~50, shared with DDR4/LPDDR; */',
  '/* run order isn’t public */',
  'ECT        Early Command Training',
  'SOT        SenseAmp Offset Training',
  'ERDMPRTC2D Early ReadMPR Timing Centering 2D',
  'RCVET      Receive Enable Training',
  'JWRL       Jedec Write Leveling',
  'EWRTC2D    Early Write Time Centering 2D',
  'ERDTC2D    Early Read Time Centering 2D',
  'WRTC1D     Write Timing Centering 1D',
  'WRVC1D     Write Voltage Centering 1D',
  'RDTC1D     Read Timing Centering 1D',
  'DIMMODTT   Dimm ODT Training',
  'DIMMRONT   DIMM RON Training',
  'WRDSEQT    Write Drive Strength/Equalization 2D',
  'RDEQT      Read Equalization Training',
  'CMDVC      Command Voltage Centering',
  'LCT        Late Command Training',
  'RTL        Round Trip Latency Training',
  'TAT        Turn Around Timing Training',
  'DCC        Duty Cycle Correction Training',
  'DIMMDFE    DIMM DFE Training',
  'DRAMDCA    DRAM DCA Training',
  'VDDQT      Vddq Training',
  'MEMTST     Memory Test',
  'ALIASCHK   DIMM SPD Alias Test',
]

const MEMMAP_ART = [
  ' * +---------------------------+ TOUUD',
  ' * |                           |',
  ' * +---------------------------+ TOM (if mem > 4GB)',
  ' * | CSME UMA (if mem > 4 GiB) |',
  ' * +---------------------------+ TOUUD',
  ' * |                           |',
  ' * +---------------------------+ 4GiB',
  ' * | PCI Address Space         |',
  ' * +---------------------------+ TOM (if mem < 4GB)',
  ' * | CSME UMA (if mem < 4 GiB) |',
  ' * +---------------------------+ TOLUD (also maps into MC address space)',
  ' * | iGD / DSM                 |',
  ' * +---------------------------+ BDSM',
  ' * | GTT / GSM                 |',
  ' * +---------------------------+ TOLM',
  ' * | TSEG                      |',
  ' * +---------------------------+ TSEGMB',
  ' * | DMA Protected Region      |',
  ' * +---------------------------+ DPR',
  ' * | PRM (C6DRAM/SGX)          |',
  ' * +---------------------------+ PRMRR',
  ' * | ...                       |',
  ' * +---------------------------+ 0',
]

const EXIT_CAR = [
  '	/* Make sure _cbmem_top_ptr hits dram before invd */',
  '	...',
  '	clflush	_cbmem_top_ptr',
  '	...',
  '	/* chipset_teardown_car() is expected to disable cache-as-ram. */',
  '	call	chipset_teardown_car',
  '	...                          # inside it (soc exit_car.S):',
  '	/* Disable MTRRs. */',
  '	...',
  '	/* invalidate cache contents. */',
  '	invd',
  '	/* Knock down bit 1 then bit 0 of NEM control not combining steps. */',
  '	mov	$(MSR_EVICT_CTL), %ecx',
  '	rdmsr',
  '	and	$(~(1 << 1)), %eax',
  '	wrmsr',
  '	and	$(~(1 << 0)), %eax',
  '	wrmsr',
  '	...                          # CLOS 0, C85h = 0, return',
  '	/* Enable caching if not already enabled. */',
  '	...                          # 64-bit build variant',
  '	mov	%cr0, %eax',
  '	and	$(~(CR0_CD | CR0_NW)), %eax',
  '	mov	%eax, %cr0',
  '	...',
  '	/* Ensure cache is clean. */',
  '	invd',
  { i: '	movl	$_estack, %esp', why: 'the stack moves into DRAM' },
  '	...',
  '	call	postcar_mtrr_setup',
  '	...',
  '	call main',
]

const SIPI_VECTOR = [
  '.code16',
  '.global _start',
  '_start:',
  '	cli',
  '	xorl	%eax, %eax',
  '	movl	%eax, %cr3    /* Invalidate TLB*/',
  '	/* On hyper threaded cpus, invalidating the cache here is',
  '	 * very very bad.  Don\'t.',
  '	 */',
  '	/* setup the data segment */',
  '	movw	%cs, %ax',
  '	movw	%ax, %ds',
  '	...',
  '	movl	$(gdtaddr), %ebx',
  '	sub	$(_start), %ebx',
  '	lgdtl	(%ebx)',
  '	movl	%cr0, %eax',
  '	andl	$~CR0_CLEAR_FLAGS, %eax',
  { i: '	orl	$CR0_SET_FLAGS, %eax', why: 'CR0_SET_FLAGS = PE | CD | NW: protected mode on, caches explicitly kept off' },
  '	movl	%eax, %cr0',
  '	ljmpl	$GDT_CODE_SEG, $1f',
  '1:',
  '	.code32',
  '	...                         # flat data segments, IDT',
  '1:',
  '	/* Obtain CPU number. */',
  '	movl	ap_count, %ecx',
  '	inc	%ecx',
  '	lock cmpxchg %ecx, ap_count',
  '	jnz	1b',
  '	/* Setup stacks for each CPU. */',
  '	...                         # microcode check, copy BSP MTRRs',
  '	/* Enable caching. */',
  '	...                         # then call into C: ap_init()',
  'halt_jump:',
  '	hlt',
  '	jmp	halt_jump',
]
// coreboot's APs leave for C (ap_init) and stop there; they never come back to
// halt_jump, so the highlight ends on the line that calls into C.
const SIPI_C = SIPI_VECTOR.length - 4

// Steps that only run on a first boot (or after a change): on a normal boot
// the saved results are restored instead, so they take ~no time.
const FIRST_ONLY = { tag: 'Normal boot', html: 'This step runs on a <em>first</em> boot, or after new DIMMs, a BIOS update, changed memory settings or a CMOS clear. On a normal boot the saved results are written straight back instead — use the <b>normal boot / first boot</b> switch by the clock to compare (how first-boot time splits across these steps is our estimate).' }

// The training choreography shared by the DRAM steps.
function trainingGlow(A, p, t, { chips, phy = 1 } = {}) {
  A.die('pcore0', 0.55, ACT.fetch, 'glow')
  A.die('sub:pcore0:l1d|l2|load_store', 0.6, ACT.car, 'pinned')
  for (const id of LLC) A.die(id, 0.4, ACT.car, 'stripe')
  A.die('imc0', 0.8 * phy, ACT.train, 'sparkle')
  A.die('imc1', 0.8 * phy, ACT.train, 'sparkle')
  A.die('ddrphy', 1 * phy, ACT.train, 'sparkle')
  A.ring(0.35, ACT.train)
  A.flow('mmio0', 'pcore0', 'imc0', 3, ACT.train, 6)
  A.flow('mmio1', 'pcore0', 'imc1', 3, ACT.train, 6)
  A.bus('ddrA', 0.9 * phy, ACT.train, { rate: 26, speed: 80 })
  A.bus('ddrB', 0.9 * phy, ACT.train, { rate: 26, speed: 80 })
  if (chips) A.chips(chips, ACT.train)
}

// EDK2's SMM relocation (a PEI library since 2024): every AP, one at a time,
// then the BSP. Verbatim excerpts.
const SMM_RELOC = [
  'U8Ptr       = (UINT8 *)(UINTN)(SMM_DEFAULT_SMBASE + SMM_HANDLER_OFFSET);',
  '...',
  '// Backup original contents at address 0x38000',
  '...',
  'for (Index = 0; Index < mNumberOfCpus; Index++) {',
  '  ...',
  '  if (BspApicId != (UINT32)ProcessorInfo.ProcessorId) {',
  '    mRebased = FALSE;',
  '    mSmBase  = GetSmBase (Index, SmmRelocationStart, TileSize);',
  '    SendSmiIpi ((UINT32)ProcessorInfo.ProcessorId);',
  '    //',
  '    // Wait for this AP to finish its 1st SMI',
  '    //',
  '    while (!mRebased) {',
  '    }',
  '  } else {',
  '    //',
  '    // BSP will be Relocated later',
  '    //',
  '    BspIndex = Index;',
  '  }',
  '}',
  '...',
  'mSmBase  = GetSmBase (BspIndex, SmmRelocationStart, TileSize);',
  'SendSmiIpi (BspApicId);',
]

export const STAGE2 = [
  {
    stage: 2,
    title: 'A 386 with nowhere to put anything',
    dur: 10,
    real: 2e-5,
    mode: 'prot',
    shot: 'dieLeft',
    narration: [
      'The far jump lands in 32-bit flat protected mode: one segment spanning all 4 GiB, base 0. It is a 386 now — but it still has no RAM. The DIMMs are untrained, flash is read-only, and — unless a Boot Guard ACM left this code in cache — every fetch crawls in from the SPI chip uncached.',
      'So the early code is written without a stack. coreboot saves the self-test result and the timestamp counter in <em>MMX registers</em>, and “calls” its sanity checks by first loading the return address into ESP and ending them with <code>jmp *%esp</code>. Here it checks that the CPU really was reset: if the MTRRs were already enabled, something did a warm INIT instead, so it resets the platform properly through port <code>CF9h</code>.',
    ],
    facts: [
      ['Segments', 'flat: base 0, limit 4 GiB, 32-bit'],
      ['Memory', 'none writable; code uncached from flash unless Boot Guard cached it'],
      ['Scratch storage', 'registers only — even MMX (1997) registers'],
    ],
    code: { src: 'coreboot src/cpu/x86/early_reset.S', href: SRC.entry32[1].replace('entry32.S', 'early_reset.S'), lines: EARLY_RESET, at: (p) => Math.min(EARLY_RESET.length - 1, Math.floor(span(p, 0.15, 0.95) * EARLY_RESET.length)) },
    mem: { on: ['flash', 'lapic'], hit: ['flash'], note: 'still nothing writable' },
    sources: [SRC.entry32, SRC.sdm],
    lps: () => bsp('prot'),
    act(p, A) {
      A.die('pcore0', 0.7, '#4fe08a', 'glow')
      A.die('sub:pcore0:decode|l1i_ctl|branch|ucode_opcache', 0.8, ACT.fetch, 'scan')
      A.ring(0.5, ACT.fetch)
      A.flow('f', 'pcore0', 'dmi', 3, ACT.fetch, 5)
    },
    labels: [{ id: 'pcore0', text: 'BSP — 32-bit protected mode', hot: true, color: '#4fe08a' }],
  },
  {
    stage: 2,
    title: 'Borrowing the cache, part 1: lie about an address',
    dur: 12,
    real: 2e-5,
    mode: 'prot',
    shot: 'llc',
    narration: [
      'C code needs a stack and writable globals. The only fast, writable storage on the chip is its cache — so the firmware borrows it. First it picks an address range where nothing will ever exist: <code>FEF00000</code>, in the hole just above the local APIC and below the flash window.',
      'It wipes the memory-type range registers (MTRRs) to “uncacheable”, then marks that window as <em>write-back</em> with two variable MTRRs (512 KiB + 256 KiB = 768 KiB), enables the MTRRs, and clears CR0’s CD and NW bits — after an <code>INVD</code> to throw away anything stale. The cache is now on, and willing to hold an address range that has no memory behind it.',
    ],
    facts: [
      ['CAR window', 'FEF00000–FEFBFFFF (768 KiB, coreboot on ADL/RPL)'],
      ['Elsewhere', 'Intel’s FSP and EDK2 reference: 1 MiB at the same base'],
      ['Physical address bits', '46 on a typical i9-13900K (CPUID 80000008h; some systems report fewer)'],
    ],
    regs: (p) => ({
      title: 'MSRs written (i9-13900K, coreboot defaults)',
      rows: [
        ['MTRR_DEF_TYPE (2FFh)', p > 0.7 ? 'E=1 · default UC' : 'E=0 · UC', p > 0.7 && p < 0.85 ? 'hot wide' : 'wide'],
        ['PHYSBASE0 (200h)', p > 0.3 ? '00000000_FEF00006 (WB)' : '0', p > 0.3 && p < 0.5 ? 'hot wide' : 'wide'],
        ['PHYSMASK0 (201h)', p > 0.4 ? '00003FFF_FFF80800 (512 KiB)' : '0', 'wide'],
        ['PHYSBASE1 (202h)', p > 0.5 ? '00000000_FEF80006 (WB)' : '0', p > 0.5 && p < 0.7 ? 'hot wide' : 'wide'],
        ['PHYSMASK1 (203h)', p > 0.5 ? '00003FFF_FFFC0800 (256 KiB)' : '0', 'wide'],
        ['CR0', p > 0.85 ? '…CD=0 NW=0 (caches on)' : '60000011 (CD=1 NW=1)', p > 0.85 ? 'hot wide' : 'wide'],
      ],
    }),
    code: { src: 'coreboot …/car/cache_as_ram.S', href: 'https://github.com/coreboot/coreboot/blob/main/src/soc/intel/common/block/cpu/car/cache_as_ram.S', lines: CAR_MTRR, at: (p) => Math.min(CAR_MTRR.length - 1, walk(p, [[0.05, 0], [0.3, 14], [0.4, 17], [0.62, 18], [0.7, 22], [0.85, 27]])) },
    mem: { on: ['flash', 'lapic', 'car'], hit: ['car'], note: 'a window with nothing behind it' },
    sources: [SRC.adlKconfig, SRC.sdm],
    lps: () => bsp('prot'),
    act(p, A) {
      A.die('pcore0', 0.7, '#4fe08a', 'glow')
      A.die('sub:pcore0:decode|l1i_ctl|branch|ucode_opcache', 0.6, ACT.fetch, 'scan')
      const on = span(p, 0.85, 1)
      for (const id of LLC) A.die(id, 0.12 + on * 0.15, ACT.car, 'breathe')
      A.die('sub:pcore0:l1d|l2', 0.2 + on * 0.3, ACT.car, 'breathe')
    },
    labels: [{ id: 'llc2', text: 'L3 slices: 12 × 3 MB', from: 0.4 }],
  },
  {
    stage: 2,
    title: 'Borrowing the cache, part 2: No-Eviction Mode',
    dur: 13,
    real: 3e-4,
    mode: 'prot',
    shot: 'llc',
    narration: [
      'A normal cache evicts old lines by writing them back to memory. Here there is no memory, so an evicted line would simply vanish. Intel’s fix is <em>No-Eviction Mode</em> (MSR <code>2E0h</code>): in its “setup” state the firmware writes zeros over the whole 768 KiB window — 12,288 cache lines, each now allocated and marked modified — then flips it to “run”, and those lines can no longer be chosen as victims.',
      'On Raptor Lake it is surgical (“enhanced NEM”). The 36 MB L3 has 12 ways; firmware reserves just <em>one</em> for its data, via class-of-service way masks, and leaves the other eleven as an ordinary cache for code streaming in from flash. Because the L3 hashes addresses across its 12 slices, the pinned data is almost certainly spread over all of them — drawn here, schematically, as a thin stripe in every slice.',
    ],
    note: { tag: 'Thread check', html: '“Temporarily uses L2/L3 cache-as-RAM … Intel calls this NEM” — yes. The guarantee is enforced in the L3 and its snoop filter while the BSP’s own L1/L2 hold the hot data, so “L2/L3” is fair. AMD Zen has no such stage at all: its ARM security processor trains DRAM before any x86 core runs.' },
    facts: [
      ['LLC (CPUID leaf 4)', '12 ways × 49,152 sets × 64 B = 36 MiB'],
      ['Ways pinned for CAR', '1 of 12 (mask 0x001); “effective way size” 2 MiB ≥ 768 KiB'],
      ['Lines touched', '12,288 (rep stosl of 196,608 dwords)'],
    ],
    regs: (p) => ({
      title: 'MSRs written, in order',
      note: 'most are model-specific, not in the SDM',
      rows: [
        ['2E0h NEM', p > 0.85 ? 'setup + RUN' : p > 0.05 ? 'setup' : '0', p > 0.05 && p < 0.12 ? 'hot' : p > 0.85 ? 'hot' : ''],
        ['1892h / 1891h SF masks', p > 0.12 ? '0x001 · other snoop-filter ways' : '—', p > 0.12 && p < 0.2 ? 'hot' : ''],
        ['C85h L3 protected ways', p > 0.2 ? '0x001' : '—', p > 0.2 && p < 0.27 ? 'hot' : ''],
        ['C91h L3 mask 1', p > 0.27 ? '0xFFE (code ways)' : '—', p > 0.27 && p < 0.33 ? 'hot' : ''],
        ['C92h L3 mask 2', p > 0.33 ? '0x001 (data way)' : '—', p > 0.33 && p < 0.4 ? 'hot' : ''],
        ['C8Fh PQR_ASSOC', p > 0.78 ? 'CLOS 1' : p > 0.4 ? 'CLOS 2 (fill)' : '—', p > 0.4 && p < 0.8 ? 'hot' : ''],
        ['lines filled', `${Math.floor(span(p, 0.42, 0.75) * 12288).toLocaleString('en-US')} / 12,288`, p > 0.42 && p < 0.76 ? 'hot' : ''],
      ],
    }),
    code: { src: 'coreboot …/car/cache_as_ram.S', href: 'https://github.com/coreboot/coreboot/blob/main/src/soc/intel/common/block/cpu/car/cache_as_ram.S', lines: CAR_ENEM, at: (p) => Math.min(CAR_ENEM.length - 1, walk(p, [[0, 0], [0.05, 5], [0.08, 6], [0.16, 7], [0.2, 11], [0.23, 12], [0.27, 15], [0.33, 20], [0.4, 26], [0.42, 27], [0.75, 28], [0.78, 33], [0.8, 34], [0.85, 42]])) },
    mem: { on: ['flash', 'lapic', 'car'], hit: ['car'], note: 'cache pinned as RAM' },
    sources: [SRC.amd17, SRC.adlKconfig, SRC.sdm],
    lps: () => bsp('prot'),
    act(p, A) {
      A.die('pcore0', 0.7, '#4fe08a', 'glow')
      const fill = span(p, 0.42, 0.75)
      const lock = span(p, 0.8, 0.95)
      for (let k = 0; k < LLC.length; k++) {
        const here = span(fill * 12, k, k + 1)
        A.die(LLC[k], 0.15 + here * 0.7 + lock * 0.25, ACT.car, 'stripe')
      }
      A.die('sub:pcore0:l1d|l2|load_store', 0.3 + fill * 0.5, ACT.car, 'pinned')
      if (fill > 0 && fill < 1) {
        A.ring(0.8, ACT.car)
        for (const id of ['llc0', 'llc3', 'llc5', 'llc8', 'llc10', 'llc11']) A.flow(`fill-${id}`, 'pcore0', id, 4, ACT.car, 6)
      }
    },
    labels: [{ id: 'llc1', text: 'one way of 12, pinned (placement schematic)', from: 0.5 }],
  },
  {
    stage: 2,
    title: 'The first stack, the first call',
    dur: 11,
    real: 0.012,
    mode: 'prot',
    shot: 'dieLeft',
    narration: [
      'Now there is RAM — 768 KiB of it, made of cache. The stack pointer is set to the top of its 544 KiB slice of the window and, for the first time since the reset vector, the CPU executes a <code>call</code>. From here on it is C.',
      'The first C code marks the BIOS region of flash <em>write-protect</em> cacheable, so code finally stops crawling in a line at a time: it streams into the eleven free L3 ways and can be dropped and refetched at will. Everything before memory exists now lives on this borrowed stack — coreboot’s bootblock and romstage, or UEFI’s SEC and PEI, and Intel’s memory-training code, which needs at least 284 KB of stack (coreboot budgets 512 KiB).',
    ],
    facts: [
      ['CAR budget (coreboot ADL/RPL)', '544 KiB stack · 128 KiB FSP-M heap · console, timestamps, caches'],
      ['Code', 'executes in place from flash, cached WP'],
      ['Time on a normal boot', 'FSP-M with saved training ≈ 46–105 ms (Meteor Lake Chromebook)'],
    ],
    code: { src: 'coreboot …/car/cache_as_ram.S', href: 'https://github.com/coreboot/coreboot/blob/main/src/soc/intel/common/block/cpu/car/cache_as_ram.S', lines: CAR_DONE, at: (p) => Math.min(CAR_DONE.length - 1, Math.floor(span(p, 0.05, 0.6) * CAR_DONE.length)) },
    mem: MEM_PRE,
    sources: [SRC.adlKconfig, SRC.fspapi],
    lps: () => bsp('prot'),
    act(p, A) {
      A.die('pcore0', 0.8, '#4fe08a', 'glow')
      A.die('sub:pcore0:l1d|l2|load_store', 0.7, ACT.car, 'pinned')
      for (const id of LLC) A.die(id, 0.45, ACT.car, 'stripe')
      const stream = span(p, 0.45, 0.6)
      A.ring(0.4 + stream * 0.4, ACT.fetch)
      A.flow('code', 'dmi', 'pcore0', 2 + stream * 8, ACT.fetch, 7)
      if (stream > 0) for (const id of ['llc1', 'llc2', 'llc6', 'llc9']) A.flow(`wp-${id}`, 'dmi', id, 2 * stream, ACT.fetch, 7)
      A.bus('dmi', 0.6, ACT.fetch, { rate: 4 + stream * 10, speed: 80, dir: -1 })
    },
    labels: [{ id: 'pcore0', text: 'call bootblock_c_entry', hot: true }],
  },
  {
    stage: 2,
    title: 'Who’s plugged in?',
    dur: 11,
    real: { normal: 0.02, first: 0.4 },
    mode: 'prot',
    shot: 'spd',
    inset: { shot: 'imc', label: 'ON THE DIE' },
    narration: [
      'Before training anything, the firmware asks each DIMM what it is. On every DDR5 module sits an <em>SPD hub</em> holding 1 KiB: DRAM type, size, ranks, chip width, speed bins and timings, XMP profiles. The chipset’s SMBus controller (PCI device 00:1F.4) reads it one byte at a time over two wires, flipping 128-byte pages through a register in the hub.',
      'A DDR5 DIMM is really two independent 32-bit sub-channels, so the code hands each DIMM’s data to both halves. Two DIMMs on Raptor Lake: 2 channels × 2 sub-channels × 32 bits = 128 data lines, each byte with its own strobe — sixteen byte lanes to train.',
    ],
    facts: [
      ['SPD5 hub', '1 KiB, I²C up to 1 MHz or I3C up to 12.5 MHz'],
      ['Read cost', 'coreboot reads 512 B: ≈ 0.2 s per DIMM at 100 kHz (estimate); with its SPD cache, later boots read just the serial number'],
      ['This system', '2 DIMMs · 4 sub-channels · 128 DQ lines'],
    ],
    code: { src: 'coreboot …/smbus/smbuslib.c', href: SRC.smbuslib[1], lines: SPD_READ, at: (p) => Math.min(SPD_READ.length - 1, 5 + Math.floor(span(p, 0.1, 0.9) * 8)) },
    mem: MEM_PRE,
    sources: [SRC.smbuslib, SRC.rambus, SRC.micron],
    lps: () => bsp('prot'),
    act(p, A, t) {
      A.die('pcore0', 0.6, ACT.fetch, 'glow')
      for (const id of LLC) A.die(id, 0.35, ACT.car, 'stripe')
      A.flow('smb', 'pcore0', 'dmi', 3, ACT.mgmt, 6)
      A.bus('dmi', 0.6, ACT.mgmt, { rate: 6, speed: 80 })
      A.board('pch', 0.6, ACT.mgmt, 'scan')
      A.bus('smbus', 1, ACT.mgmt, { rate: 10, speed: 30 })
      A.bus('smbus', 0.8, ACT.mgmt, { rate: 6, speed: 30, dir: -1 })
      A.dimmPart('spd', 0.6 + 0.4 * Math.sin(t * 9), ACT.mgmt)
      A.board('dimmA', 0.3, ACT.mgmt, 'scan')
      A.board('dimmB', 0.3, ACT.mgmt, 'scan')
    },
    labels: [{ id: 'pch', text: 'SMBus controller (00:1F.4)' }, { id: 'dimmA', text: 'SPD hub: 1 KiB of “what am I”', hot: true }, 'dimmB'],
  },
  {
    stage: 2,
    title: 'Train — or remember?',
    dur: 10,
    real: 0.002,
    mode: 'prot',
    shot: 'fetch',
    narration: [
      'Training results — thousands of delay, voltage and equalizer settings — are saved in the flash chip later in any boot whose training succeeded (Chromebooks reserve a 64 KB slot for them; Intel’s open EDK2 platform code keeps them in a UEFI variable). If a matching copy exists, the firmware hands it to Intel’s memory code with the instruction “assume nothing changed”.',
      'New DIMMs, a different BIOS version, changed memory settings or a cleared CMOS invalidate it, and the full training below runs instead. That — not the CPU — is what makes a first boot with new memory sit on a black screen; coreboot’s optional early-display mode even puts up a wait message (“Please wait for RAM to be initialized...”) so you don’t think it hung.',
    ],
    facts: [
      ['Saved where', 'SPI flash (coreboot RW_MRC_CACHE; Intel EDK2 MinPlatform “FspNvsBuffer” variable; AMI’s isn’t public)'],
      ['Retrain triggers', 'DIMM change, BIOS/FSP update, setting change, CMOS/RTC power loss'],
    ],
    regs: (p, ctx) => ({
      title: 'FSP-M boot mode',
      rows: [
        ['NvsBufferPtr', ctx?.bootKind === 'first' ? '0 (no saved data)' : '→ saved training data', 'wide hot'],
        ['BootMode', ctx?.bootKind === 'first' ? 'FSP_BOOT_WITH_FULL_CONFIGURATION' : 'FSP_BOOT_ASSUMING_NO_CONFIGURATION_CHANGES', 'wide hot'],
      ],
    }),
    code: { src: 'coreboot drivers/intel/fsp2_0/memory_init.c', href: SRC.meminit[1], lines: BOOTMODE, at: (p) => Math.min(BOOTMODE.length - 1, Math.floor(span(p, 0.05, 0.95) * BOOTMODE.length)) },
    mem: MEM_PRE,
    sources: [SRC.meminit, SRC.fspm],
    lps: () => bsp('prot'),
    act(p, A) {
      A.die('pcore0', 0.6, ACT.fetch, 'glow')
      for (const id of LLC) A.die(id, 0.35, ACT.car, 'stripe')
      A.flow('mrc', 'dmi', 'pcore0', 4, ACT.fetch, 6)
      A.bus('dmi', 0.7, ACT.fetch, { rate: 6, speed: 80, dir: -1 })
      A.bus('spi', 0.9, ACT.fetch, { rate: 10, speed: 25, dir: -1 })
      A.board('spi', 0.9, ACT.fetch, 'scan')
      A.board('pch', 0.5, ACT.fetch, 'glow')
    },
    labels: [{ id: 'spi', text: 'saved training data lives here', hot: true }],
  },
  {
    stage: 2,
    title: 'Waking the DRAM chips',
    dur: 10,
    real: 0.006,
    mode: 'prot',
    shot: 'dimms',
    inset: { shot: 'imc', label: 'MEMORY CONTROLLERS + DDR5 PHY' },
    narration: [
      'Each DIMM makes its own DRAM voltages from the board’s 5 V with an on-module power-management chip (PMIC): 1.1 V for the chips and their I/O, 1.8 V for word-line pumping. The controller holds the DRAMs in reset for at least 200 µs, releases it, then by JEDEC rule waits at least 4 ms before driving chip-select high, starts the clocks, and issues its first configuration commands.',
      'Then <em>ZQ calibration</em>: each DRAM compares its output drivers and on-die termination against a precision 240 Ω resistor, so every chip speaks with the right impedance whatever its temperature or manufacturing spread.',
    ],
    facts: [
      ['DDR5 rails', 'VDD = VDDQ = 1.1 V, VPP = 1.8 V (from the DIMM’s PMIC)'],
      ['JEDEC timings', 'RESET_n low ≥ 200 µs · CS_n low ≥ 4 ms after reset · ZQCAL ≥ 1 µs'],
      ['Happens on', 'every boot, normal or first'],
    ],
    mem: MEM_PRE,
    sources: [SRC.micron, SRC.rambus],
    lps: () => bsp('prot'),
    act(p, A, t) {
      trainingGlow(A, p, t, { phy: 0.6, chips: (d, r, s, i) => (p > 0.35 ? 0.35 + 0.25 * Math.sin(t * 3) : 0.05) })
      A.dimmPart('pmic', 0.9, ACT.power)
      A.board('dimmA', 0.3, ACT.power, 'breathe')
      A.board('dimmB', 0.3, ACT.power, 'breathe')
    },
    labels: [{ id: 'dimmA', text: 'PMIC: 5 V → 1.1 V / 1.8 V', hot: true }, 'dimmB'],
  },
  {
    stage: 2,
    title: 'Teaching the commands to land',
    dur: 11,
    real: { normal: 0, first: 4 },
    mode: 'prot',
    shot: 'dimms',
    inset: { shot: 'imc', label: 'MEMORY CONTROLLERS + DDR5 PHY' },
    narration: [
      'At DDR5-5600 a data bit lasts 178.6 picoseconds — about the time light takes to cross 5 cm, and a signal on a circuit board covers roughly half that. The chips sample command pins once per 357 ps clock, but the controller doesn’t yet know where inside that clock they sample, so even its configuration writes are unreliable.',
      'DDR5 provides loop-back modes for this. In <em>CS training</em> and <em>CA training</em> the DRAM samples the chip-select and address pins and echoes the result back on its data pins; the controller slides its command timing (and the reference voltage the chips compare against) until the echoes come back right.',
    ],
    note: FIRST_ONLY,
    facts: [
      ['1 UI at DDR5-5600', '178.6 ps (clock: 357 ps)'],
      ['VrefCA / VrefCS', '126 codes, 0.5 % of VDDQ (≈ 5.5 mV) each'],
      ['Intel’s name', 'ECT — Early Command Training'],
    ],
    mem: MEM_PRE,
    sources: [SRC.micron, SRC.fspm],
    lps: () => bsp('prot'),
    act(p, A, t) {
      trainingGlow(A, p, t, { chips: (d, r, s, i) => (r === 0 ? (Math.sin(t * 7 + s * 1.7 + i * 0.4) > 0.2 ? 0.9 : 0.25) : 0.08) })
      A.bus('ddrA', 0.9, ACT.fetch, { rate: 10, speed: 70, dir: -1 })
      A.bus('ddrB', 0.9, ACT.fetch, { rate: 10, speed: 70, dir: -1 })
    },
    labels: [{ id: 'dimmA', text: 'rank 0: echoing CS / CA on its data pins', hot: true }],
  },
  {
    stage: 2,
    title: 'Learning to read before writing',
    dur: 11,
    real: { normal: 0, first: 5 },
    mode: 'prot',
    shot: 'dimms',
    inset: { shot: 'imc', label: 'MEMORY CONTROLLERS + DDR5 PHY' },
    narration: [
      'Writes can’t be checked until reads work, and reads can’t be checked without known data. DDR5 solves the chicken-and-egg with a pattern generator in every chip: two 8-bit LFSRs (x⁸+x⁶+x⁵+x⁴+1), seeded through MR26/MR27 and read out with a mode-register read of MR31 — pseudo-random enough to stress crosstalk between neighbouring data lines.',
      'A read-preamble mode makes the chip hold its strobe steady between reads and toggle it only for a short preamble plus the data, so the controller can find exactly when read data starts arriving and open its receivers (“receive enable”) at the right moment. Only then can it centre its sampling point inside each bit.',
    ],
    note: { tag: 'Order', html: 'JEDEC fixes the order only up to command training. After that each vendor chooses; coreboot’s open re-implementation of Intel’s Haswell memory code runs the reads (receive enable, read pattern) before write leveling. Raptor Lake’s DDR5 order isn’t public. ' + FIRST_ONLY.html },
    facts: [
      ['LFSR seeds', 'MR26 = 0x5A, MR27 = 0x3C (defaults)'],
      ['Intel’s names', 'RCVET Receive Enable · RDMPRT Read MPR · SOT SenseAmp Offset'],
    ],
    mem: MEM_PRE,
    sources: [SRC.micron, SRC.fspm],
    lps: () => bsp('prot'),
    act(p, A, t) {
      // one rank at a time, both channels in parallel
      trainingGlow(A, p, t, { chips: (d, r, s, i) => (r !== Math.min(1, Math.floor(p * 2)) ? 0.06 : Math.sin(t * 11 + i * 1.3 + s + d * 2) > 0.4 ? 0.9 : 0.2) })
      A.bus('ddrA', 1, ACT.dram, { rate: 30, speed: 90, dir: -1 })
      A.bus('ddrB', 1, ACT.dram, { rate: 30, speed: 90, dir: -1 })
    },
    labels: [{ id: 'dimmB', text: 'chips stream an LFSR pattern', hot: true }],
  },
  {
    stage: 2,
    title: 'Write leveling: the fly-by problem',
    dur: 12,
    real: { normal: 0, first: 5 },
    mode: 'prot',
    shot: 'dimms',
    eye: { kind: 'flyby', title: 'Write leveling — one sub-channel', sub: 'x8 chips, one rank at a time' },
    narration: [
      'On a DIMM the clock and command wires visit the chips one after another — a “fly-by” route that keeps the bus clean but means each chip sees its clock edge a little later than the last. Every byte’s write strobe must be delayed by just the right amount to meet <em>its</em> chip’s clock.',
      'So the controller puts the DRAMs in write-leveling mode, sends writes, and nudges each byte’s strobe later in small steps; the chip reports what it saw on a data pin, and the controller locks onto the moment that report flips from 0 to 1. DDR5 adds a second, internal leveling pass for delays inside the chip. One rank at a time.',
    ],
    note: FIRST_ONLY,
    facts: [
      ['Sweep (open Haswell code)', '64 delay points per byte lane per rank'],
      ['Intel’s name', 'JWRL — Jedec Write Leveling'],
    ],
    code: { src: 'coreboot haswell/native_raminit (open DDR3 analogue)', href: SRC.hswraminit[1], lines: JWRL, at: (p) => Math.min(JWRL.length - 1, 4 + Math.floor(((p * 9) % 1) * (JWRL.length - 4))) },
    mem: MEM_PRE,
    sources: [SRC.micron, SRC.hswraminit, SRC.fspm],
    lps: () => bsp('prot'),
    act(p, A, t) {
      // chips light one after another along the fly-by route
      trainingGlow(A, p, t, {
        chips: (d, r, s, i) => {
          if (r !== Math.min(1, Math.floor(p * 2))) return 0.06
          // each sub-channel is its own fly-by; A and B level in parallel
          const k = i
          const front = (t * 1.6) % 5
          return Math.abs(front - k) < 0.8 ? 1 : 0.15
        },
      })
    },
    labels: [{ id: 'dimmA', text: 'clock reaches each chip later', hot: true }],
  },
  {
    stage: 2,
    title: 'Drawing the eye',
    dur: 16,
    real: { normal: 0, first: 25 },
    mode: 'prot',
    shot: 'imcEye',
    eye: { kind: 'read', title: 'Read eye — one byte lane', sub: 'DIMM A · sub-channel A · byte 2 · each rank in turn', seed: 5 },
    narration: [
      'Now the heart of it. For every byte lane, firmware sweeps the sampling delay and the reference voltage, and at each point fires a burst of test traffic generated by hardware in the memory controller — a pattern generator and checker (Intel’s names for it include REUT and CPGC). Pass or fail. The passing region is an <em>eye</em>; the setting is parked in its middle, for the most margin on every side.',
      'All lanes are tested in parallel by hardware, but settings are stepped one by one — in the open re-implementation of Intel’s Haswell code, 63 timing points or 109 voltage points per sweep, and at each point 256 loops of 128 cache lines written and read back: 2 MiB each way, per channel. Then again for writes, for every rank.',
    ],
    note: { tag: 'Thread check', html: '“Tens of millions of instructions” — nobody has published an instruction count for memory training, and it’s the wrong yardstick: the time goes to hardware — MMIO polls, JEDEC-mandated waits, and test bursts the memory controller generates itself. The core mostly waits.' },
    facts: [
      ['Normal boot', 'skipped: the saved results are written straight back (switch to “first boot” by the clock)'],
      ['Each point', 'one hardware test burst, pass / fail'],
      ['Shape shown', 'illustrative — real eyes vary per lane, that’s the point'],
    ],
    code: { src: 'coreboot haswell/native_raminit train_1d_margins.c', href: SRC.hswraminit[1], lines: MARGIN_1D, at: (p) => Math.min(MARGIN_1D.length - 1, Math.floor(((p * 14) % 1) * MARGIN_1D.length)) },
    mem: MEM_PRE,
    sources: [SRC.hswraminit, SRC.micron, SRC.fspm],
    lps: () => bsp('prot'),
    act(p, A, t) {
      // one rank at a time, both channels in parallel
      trainingGlow(A, p, t, { chips: (d, r, s, i) => (r !== Math.min(1, Math.floor(p * 2)) ? 0.06 : Math.sin(t * 13 + i * 0.9 + s * 2.1 + d) > 0.1 ? 0.8 : 0.15) })
    },
    labels: [{ id: 'ddrphy', text: 'DDR5 PHY: per-lane delay & Vref', hot: true }, { id: 'imc0', text: 'memory controller 0' }, { id: 'imc1', text: 'memory controller 1' }],
  },
  {
    stage: 2,
    title: 'DDR5’s extra knobs — and why the first boot takes forever',
    dur: 15,
    real: { normal: 0.07, first: 25 },
    mode: 'prot',
    shot: 'dimms',
    eye: { kind: 'write', title: 'Write eye — DRAM receiver', sub: 'after DFE · DIMM B · rank 1 · byte 5', seed: 9 },
    narration: [
      'Past about 3,000 MT/s, JEDEC expects the data eye at a DDR5 chip’s pins to be <em>closed</em>: echoes of earlier bits smear into later ones. So every DDR5 chip’s data receivers have a 4-tap decision-feedback equalizer that subtracts those echoes, plus duty-cycle adjusters, termination and drive-strength settings — each another set of knobs to sweep, each change needing the eye re-measured.',
      'Intel’s Raptor Lake memory code lists about fifty separately switchable training steps. Multiply by every rank, tens to hundreds of settings per sweep, a burst of hardware test traffic at each setting — and, with dynamic memory frequency enabled, up to four memory speeds. First-time DDR5 training typically takes tens of seconds and can run to minutes on large or dual-rank kits. A normal boot restores the saved results instead: on an Intel Meteor Lake Chromebook reference board (soldered LPDDR5X, not DIMMs), coreboot logs show the whole memory init taking 46–105 ms. We found no published figure for desktop DDR5 DIMMs.',
    ],
    note: { tag: 'Thread check', html: '“Takes forever on DDR5 with memory training” — on a first boot or after a change, yes. LaurieWired’s jet-engine start-cart image fits nicely: a small self-contained system (the cache scratchpad) gets the big one running and is then disconnected. The cache supplies a place to run the training code, not energy. On AMD the “start cart” is literally a separate ARM processor.' },
    facts: [
      ['DFE tap 1', '+50 … −200 mV in ~5 mV steps (≈ 50 codes)'],
      ['DCA', '−7 … +7 global, −3 … +3 per pin'],
      ['JEDEC minimum eye, DDR5-5600', '0.235 UI (≈ 42 ps) × 60 mV diamond at the DRAM’s receiver, after DFE (writes)'],
      ['Normal boot', 'restore + JEDEC init + checks: FSP-M ≈ 46–105 ms (Meteor Lake Chromebook, soldered LPDDR5X)'],
      ['First boot', 'tens of seconds to minutes (board-vendor and memory-maker reports)'],
    ],
    code: { src: 'Intel FSP RaptorLakeS FspmUpd.h (switch names)', href: SRC.fspm[1], lines: RPL_STEPS, at: (p) => Math.min(RPL_STEPS.length - 1, 3 + Math.floor(span(p, 0.05, 0.95) * (RPL_STEPS.length - 3))) },
    mem: MEM_PRE,
    sources: [SRC.micron, SRC.fspm, SRC.thread],
    lps: () => bsp('prot'),
    act(p, A, t) {
      trainingGlow(A, p, t, { chips: (d, r, s, i) => (Math.sin(t * 17 + i * 2.3 + s * 1.1 + r * 3 + d) > 0 ? 0.95 : 0.12) })
    },
    labels: [{ id: 'dimmA', text: '4-tap DFE in every chip' }, 'dimmB'],
  },
  {
    stage: 2,
    title: 'DRAM online: carving up the map',
    dur: 12,
    real: { normal: 0.005, first: 0.01 },
    mode: 'prot',
    shot: 'memory',
    narration: [
      'Memory works. The fresh training results stay in RAM for now: they are written to flash later in this boot, and only if they changed (this board’s BIOS does it from a 64-bit DXE driver, SaveMemoryConfig; coreboot after PCI enumeration). The memory controller’s map is programmed: DRAM from address 0 up to <em>TOLUD</em>, then a hole below 4 GiB for device registers and PCIe — with the DRAM that would have sat in the hole remapped above 4 GiB, up to <em>TOUUD</em>.',
      'Slices are fenced off before anyone else can see them: <em>TSEG</em> for System Management Mode, stolen memory for the integrated GPU, a region for the security engine, protected ranges for DMA and for the cores’ C6 save area (PRMRR; this chip has no SGX). Each region gets its memory type when the MTRRs are rewritten.',
    ],
    facts: [
      ['Host-bridge registers', 'TOLUD BCh · TOUUD A8h · TSEG B8h · BDSM B0h'],
      ['TSEG size (FSP default)', '4 MiB release / 16 MiB debug'],
    ],
    code: { src: 'coreboot …/systemagent/memmap.c (comment)', href: SRC.memmap[1], lines: MEMMAP_ART, at: (p) => Math.min(MEMMAP_ART.length - 1, Math.floor(span(p, 0.05, 0.95) * MEMMAP_ART.length)) },
    mem: { on: ['flash', 'lapic', 'car', 'dram', 'mmio', 'high'], hit: ['dram', 'high'], note: 'DRAM exists' },
    sources: [SRC.memmap, SRC.fspm],
    lps: () => bsp('prot'),
    act(p, A) {
      A.die('pcore0', 0.6, ACT.dram, 'glow')
      for (const id of LLC) A.die(id, 0.35, ACT.car, 'stripe')
      A.die('imc0', 0.6, ACT.dram, 'scan')
      A.die('imc1', 0.6, ACT.dram, 'scan')
      A.die('ddrphy', 0.6, ACT.dram, 'scan')
      A.bus('ddrA', 0.8, ACT.dram, { rate: 14, speed: 90 })
      A.bus('ddrB', 0.8, ACT.dram, { rate: 14, speed: 90 })
      A.chips(() => 0.3, ACT.dram)
    },
    labels: ['dimmA', 'dimmB'],
  },
  {
    stage: 2,
    title: 'Moving out of the cache',
    dur: 13,
    real: 0.003,
    mode: 'prot',
    shot: 'llc',
    narration: [
      'Time to give the cache back. Everything worth keeping — logs, timestamps, the next stage’s code — has been written into DRAM, which is still mapped uncached, so none of it is sitting only in the cache. Then the firmware does something no normal program ever should: <code>INVD</code>, which throws the entire cache away <em>without</em> writing anything back. The scratch data had no home in memory anyway; writing it back would mean writing to addresses where nothing exists.',
      'Intel’s manual names this exact use: INVD for when “the cache is used as temporary memory”. The No-Eviction bits are cleared (run first, then setup), the way masks released, and the stack pointer leaps from the cache window into real DRAM. The cache goes back to its day job.',
    ],
    note: { tag: 'Boot Guard', html: 'On Boot Guard systems this teardown is a security moment: once the verified code is no longer pinned in cache it would be re-read from flash, which can be swapped after verification. EDK2 can migrate firmware volumes into DRAM before tearing NEM down, but only if the platform turns it on (PcdMigrateTemporaryRamFirmwareVolumes is off by default).' },
    facts: [
      ['INVD vs WBINVD', 'discard vs write back — writing back 768 KiB to nowhere is pointless or harmful'],
      ['New MTRRs', 'write-back: TSEG + the 32 MiB below cbmem_top · flash write-protect'],
    ],
    code: { src: 'coreboot exit_car.S (arch + soc)', href: 'https://github.com/coreboot/coreboot/blob/main/src/arch/x86/exit_car.S', lines: EXIT_CAR, at: (p) => Math.min(EXIT_CAR.length - 1, Math.floor(span(p, 0.05, 0.95) * EXIT_CAR.length)) },
    mem: (() => ({ on: ['flash', 'lapic', 'dram', 'mmio', 'high'], hit: ['dram'], note: 'CAR gone' }))(),
    sources: [SRC.sdm, SRC.fspapi],
    lps: () => bsp('prot'),
    act(p, A) {
      const gone = span(p, 0.3, 0.38)
      for (const id of LLC) A.die(id, (1 - gone) * 0.6 + win(p, 0.3, 0.36, 0.02) * 0.8, gone > 0.5 ? '#ffffff' : ACT.car, 'stripe')
      A.die('sub:pcore0:l1d|l2|load_store', 0.6 * (1 - gone), ACT.car, 'pinned')
      A.die('pcore0', 0.6, ACT.dram, 'glow')
      const dram = span(p, 0.55, 0.8)
      A.die('imc0', 0.3 + dram * 0.4, ACT.dram, 'scan')
      A.die('imc1', 0.3 + dram * 0.4, ACT.dram, 'scan')
      A.flow('stk', 'pcore0', 'imc0', 1 + dram * 4, ACT.dram, 6)
      if (p < 0.3) A.flow('copy', 'llc2', 'imc0', 4, ACT.car, 6)
      A.ring(0.4, ACT.dram)
    },
    labels: [{ id: 'llc2', text: 'INVD: the scratch RAM evaporates', hot: true, from: 0.28, to: 0.6 }],
  },
  {
    stage: 2,
    title: 'Thirty-one sleepers get a doorbell',
    dur: 14,
    real: 0.05,
    mode: 'prot',
    shot: 'die',
    narration: [
      'With DRAM up — and before any PCIe work — the firmware wakes the other 31 hardware threads for the first time. The BSP writes its Local APIC’s Interrupt Command Register: an INIT and then a single <em>Start-up IPI</em> to “all excluding self”, carrying a page number. Every AP starts at once in 16-bit real mode at that page — coreboot uses vector 30h, so <code>CS = 3000h, IP = 0</code>: physical 30000h, in freshly trained DRAM.',
      'Each climbs the ladder in a dozen instructions, takes a ticket for its own stack with one <code>lock cmpxchg</code>, checks its microcode (already loaded for every thread by the FIT, so usually a no-op), copies the BSP’s MTRRs, turns its caches on, reports its APIC ID and core type, and parks — by default in <code>hlt</code> under EDK2; coreboot first has it relocate its SMM base, then spin waiting for work. In a typical UEFI BIOS this first wake comes from 32-bit PEI — as INIT-SIPI-SIPI, or a bare SIPI under EDK2’s default — so they only climb to protected mode.',
    ],
    note: { tag: 'Thread check', html: 'LaurieWired’s “Stage 4” starts here — before Stage 3’s PCIe and GPU work, not after it. And the APs never touch the reset vector, cache-as-RAM or training: they start at a 4 KiB page below 1 MiB that the BSP filled in.' },
    facts: [
      ['ICR (FEE0_0300h)', 'INIT 000C4500h · SIPI 000C4630h (all-excluding-self, vector 30h)'],
      ['AP entry', 'CS = 3000h, IP = 0 → 30000h (coreboot)'],
      ['In parallel?', 'yes — one broadcast; EDK2’s default then waits a fixed 50 ms to count them unless the platform sets its CPU count'],
    ],
    code: { src: 'coreboot src/cpu/x86/sipi_vector.S', href: SRC.sipi[1], lines: SIPI_VECTOR, at: (p) => Math.min(SIPI_C, walk(p, [[0.27, 0], [0.45, 20], [0.63, SIPI_C]])) },
    mem: { on: ['flash', 'lapic', 'dram', 'mmio', 'high'], hit: ['lapic', 'dram'] },
    sources: [SRC.sipi, SRC.mpinit, SRC.mplib, SRC.sdm],
    lps: (p) => wave(p, 0.18, 0.9, ['real', 'prot', 'park'], { before: 'wfs', bspMode: 'prot', spread: 0.35 }),
    act(p, A) {
      A.die('pcore0', 0.6, '#4fe08a', 'glow')
      const ipi = win(p, 0.04, 0.22)
      if (ipi > 0) {
        A.ring(0.9 * ipi, ACT.ipi)
        for (const id of ALL_CORES) A.flow(`sipi-${id}`, 'pcore0', id, 3 * ipi, ACT.ipi, 8)
      }
      const run = win(p, 0.2, 0.85)
      A.die('kind:pcore', 0.1 + run * 0.35, '#ffcf6b', 'sparkle')
      A.die('kind:ecore_cluster', 0.1 + run * 0.35, '#ffcf6b', 'sparkle')
      if (run > 0) for (const id of ALL_CORES) A.flow(`tr-${id}`, id, 'imc0', 0.6 * run, ACT.dram, 6)
    },
    labels: [{ id: 'pcore0', text: 'BSP: INIT, then SIPI to all-but-self', hot: true, to: 0.3 }],
  },
  {
    stage: 2,
    title: 'Thirty-two SMM bases, one at a time',
    dur: 15,
    real: 0.005,
    mode: 'prot',
    shot: 'die',
    narration: [
      '<em>System Management Mode</em> is a hidden CPU mode with its own walled-off slice of DRAM, TSEG, carved out a moment ago. An SMI drops a thread into it, and every thread starts out assuming its SMM area is at <code>30000h</code> — so if two took an SMI at once they would trample each other’s saved state. The BSP therefore sends each of the other 31 threads an SMI, one after another, and has each move its base to a private tile; then it does itself.',
      'Entering SMM clears CR0’s PE and PG bits, putting the thread in an environment “similar to real-address mode”; this relocation handler climbs straight back to 32-bit protected mode. Once DXE has installed the 64-bit SMM code, every later SMI climbs all the way to long mode — 1978 to 2003 again, on every SMI, for as long as the machine runs.',
    ],
    note: { tag: 'When', html: 'Current EDK2 relocates here in PEI, as soon as the MP services are up — its SMM CPU driver now refuses to start if this hasn’t happened. Older EDK2 did it in DXE; which one this retail BIOS does isn’t public. coreboot relocates during its own multiprocessor init, and on AMD it simply writes each thread’s SMM_BASE MSR — no SMI needed.' },
    facts: [
      ['Default SMBASE', '30000h; handler at SMBASE + 8000h = 38000h'],
      ['TSEG', 'FSP default 4 MiB (16 MiB debug); coreboot ADL/RPL: 8 MiB'],
      ['Order', 'the 31 APs one at a time, then the BSP'],
      ['SMRR', 'only SMM code may set it; then non-SMM reads of TSEG return a fixed value and writes are dropped'],
    ],
    code: {
      src: 'EDK2 UefiCpuPkg SmmRelocationLib.c (PEIM library)',
      href: SRC.smmreloc[1],
      lines: SMM_RELOC,
      at: (p) => {
        if (p < 0.06) return 0
        const k = span(p, 0.06, 0.94) * 32
        if (k >= 31) return k % 1 < 0.4 ? 23 : 24
        const f = k % 1
        return f < 0.15 ? 7 : f < 0.3 ? 8 : f < 0.45 ? 9 : 13
      },
    },
    mem: { on: ['flash', 'lapic', 'dram', 'mmio', 'high'], hit: ['dram'], note: 'TSEG carved from DRAM' },
    sources: [SRC.smmreloc, SRC.smmcpu, SRC.sdm],
    lps: (p) => (i) => {
      // one thread at a time: APs in order, then the BSP last
      const order = i === 0 ? 31 : i - 1
      const k = span(p, 0.06, 0.94) * 32
      const rest = i === 0 ? 'prot' : 'park'
      // the SMI lands after SendSmiIpi; the BSP spins on mRebased meanwhile
      if (k < order + 0.45) return rest
      if (k < order + 0.7) return 'real'
      if (k < order + 0.95) return 'prot'
      return rest
    },
    act(p, A) {
      A.die('pcore0', 0.5, '#4fe08a', 'glow')
      const k = Math.floor(span(p, 0.06, 0.94) * 32)
      const ids = ['pcore0', 'pcore0', 'pcore1', 'pcore1', 'pcore2', 'pcore2', 'pcore3', 'pcore3', 'pcore4', 'pcore4', 'pcore5', 'pcore5', 'pcore6', 'pcore6', 'pcore7', 'pcore7']
      const target = k < 31 ? (k + 1 < 16 ? ids[k + 1] : ['ecl0', 'ecl1', 'ecl2', 'ecl3'][Math.floor((k + 1 - 16) / 4)]) : 'pcore0'
      A.die(target, 0.9, '#ff9a3d', 'scan')
      A.flow(`smi-${target}`, 'pcore0', target, 4, '#ff9a3d', 9)
      A.die('imc0', 0.35, ACT.dram, 'scan')
    },
    labels: [{ id: 'pcore0', text: 'BSP: SendSmiIpi(), one thread at a time', hot: true }],
  },
]
