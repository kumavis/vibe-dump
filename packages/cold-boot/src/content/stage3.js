// Stage 3 — 64-bit long mode. On a Raptor Lake desktop with retail AMI
// firmware the switch happens at the PEI → DXE hand-off (measured on a real MSI
// Z790 BIOS image: every SEC/PEI module 32-bit, every DXE driver 64-bit). Then
// DXE — a small operating system of 263 drivers — wakes the cores again; BDS
// then enumerates PCIe, locks SMM down (End of DXE), runs the GPU's own driver,
// finishes the ACPI tables and boots the OS loader.

import { ACT, span, win, SRC, wave } from './common.js'

const ALL_CORES = ['pcore1', 'pcore2', 'pcore3', 'pcore4', 'pcore5', 'pcore6', 'pcore7', 'ecl0', 'ecl1', 'ecl2', 'ecl3']
const MEM_RAM = { on: ['flash', 'lapic', 'dram', 'mmio', 'high'], hit: ['dram'] }

const ENABLE_PAGING64 = [
  { i: 'cli', era: '8086', why: 'Interrupts off for the switch (SDM §12.8.5.2). DxeIpl has already loaded an IDT in the 64-bit format while still in 32-bit mode, and turned paging off.' },
  { i: 'mov   DWORD [esp], .0', era: '386', why: 'Put the 64-bit landing address on the stack for the far return below — the stack is real DRAM now.' },
  { i: 'mov   eax, cr4', era: 'P5', why: '' },
  { i: 'or    al, (1 << 5)', era: '8086', why: 'CR4.PAE: physical address extension (Pentium Pro, 1995) — long mode requires it.' },
  { i: 'mov   cr4, eax', era: 'P5', why: 'PAE on.' },
  { i: 'mov   ecx, 0xc0000080', era: '386', why: 'IA32_EFER, AMD’s Extended Feature Enable Register.' },
  { i: 'rdmsr', era: 'P5', why: 'Read a model-specific register (Pentium).' },
  { i: 'or    ah, 1', era: '8086', why: 'Bit 8: LME, long-mode enable.' },
  { i: 'wrmsr', era: 'P5', why: 'Long mode is enabled — but not yet active.' },
  { i: 'mov   eax, cr0', era: '386', why: '' },
  { i: 'bts   eax, 31', era: '386', why: 'CR0.PG: paging.' },
  { i: 'mov   cr0, eax', era: '386', why: 'Paging on with LME set: the CPU sets EFER.LMA. It is now in IA-32e “compatibility mode” — still running 32-bit code, like a 32-bit app on a 64-bit OS.' },
  { i: 'retf', era: '386', why: 'A far return pops a code selector whose descriptor has L = 1, D = 0. This is the instant the CPU becomes a true 64-bit AMD64 machine.' },
  { i: '.0:', era: '', why: 'The label the second line put on the stack: the far return lands here.' },
  { i: 'BITS 64', era: '', why: '' },
  { i: 'mov   rbx, [esp]', era: 'AMD64', why: 'The DXE core’s entry point, read as a full 64-bit value.' },
  { i: 'mov   rcx, [esp + 8]', era: 'AMD64', why: 'First argument: the HOB list — everything PEI learned, the one thing DXE needs.' },
  { i: 'mov   rdx, [esp + 0x10]', era: 'AMD64', why: 'Second argument (unused, 0).' },
  { i: 'mov   rsp, [esp + 0x18]', era: 'AMD64', why: 'Switch to the DXE stack.' },
  { i: 'add   rsp, -0x20', era: 'AMD64', why: '32 bytes of “shadow space” the x64 calling convention reserves.' },
  { i: 'call  rbx', era: 'AMD64', why: 'Into the DXE core. Apart from trips into System Management Mode (and legacy-BIOS thunks, if CSM is on), the boot processor stays in 64-bit mode from here into the kernel.' },
]

// Which ENABLE_PAGING64 line the BSP is on at p, and the p at which line k
// lights. The code panel, registers, mode ladder and die colour all key off
// these, so they flip together: line 12 (retf) = compatibility mode, 13+ = 64-bit.
const pagingK = (p) => Math.floor(span(p, 0.05, 0.85) * ENABLE_PAGING64.length)
const pagingP = (k) => 0.05 + (0.8 * k) / ENABLE_PAGING64.length
const inLong = (p) => pagingK(p) >= 13

const DISPATCHER = [
  'Step #1 - When a FV protocol is added to the system every driver in the',
  'FV is added to the mDiscoveredList. The SOR, Before, and After Depex are',
  'pre-processed as drivers are added to the mDiscoveredList. If an Apriori',
  'file exists in the FV those drivers are addeded to the mScheduledQueue.',
  '...',
  'Step #2 - Dispatch. Remove driver from the mScheduledQueue and load and',
  'start it. After mScheduledQueue is drained check the mDiscoveredList to',
  'see if any item has a Depex that is ready to be placed on the',
  'mScheduledQueue.',
]

const MPFUNCS = [
  ';RendezvousFunnelProc  procedure follows. All APs execute their procedure. This',
  ';procedure serializes all the AP processors through an Init sequence. It must be',
  ';noted that APs arrive here very raw...ie: real mode, no stack.',
  '...',
  'BITS 16',
  '    ...',
  'o32 lgdt       [cs:si]',
  '    mov        eax, cr0                    ; Get control register 0',
  '    or         eax, 000000003h             ; Set PE bit (bit #0) & MP',
  '    mov        cr0, eax',
  'o32 jmp far    [cs:di]',
  'BITS 32',
  'Flat32Start:                                   ; protected mode entry point',
  '    ...',
  '    mov        eax, cr4',
  '    bts        eax, 5',
  '    ...',
  '    mov        cr4, eax',
  '    ...',
  '    mov        cr3, ecx                    ; Load CR3',
  '    mov        ecx, 0c0000080h             ; EFER MSR number',
  '    rdmsr                                  ; Read EFER',
  '    bts        eax, 8                      ; Set LME=1',
  '    wrmsr                                  ; Write EFER',
  '    mov        eax, cr0                    ; Read CR0',
  '    bts        eax, 31                     ; Set PG=1',
  '    mov        cr0, eax                    ; Write CR0',
  '    ...',
  '    jmp far    [edi]',
  'BITS 64',
  'LongModeStart:',
]

// What enumeration finds on this board, in the order a scan of bus 0 meets it.
// Device numbers from coreboot's Alder/Raptor Lake pci_devs.h; bus numbers for
// the cards are assigned in discovery order (illustrative).
const LSPCI = [
  '00:00.0  host bridge / system agent      (CPU)',
  '00:01.0  PCIe root port, x16 Gen5        (CPU)',
  '  01:00.0  discrete GPU',
  '  01:00.1  GPU HDMI/DP audio',
  '00:02.0  UHD 770 integrated GPU          (CPU)',
  '00:06.0  PCIe root port, x4 Gen4         (CPU)',
  '  02:00.0  NVMe SSD',
  '00:14.0  USB xHCI controller             (PCH, via DMI)',
  '00:16.0  CSME interface (HECI)           (PCH)',
  '00:17.0  SATA controller                 (PCH)',
  '00:1a–1d PCH PCIe root ports             (PCH)',
  '00:1f.0  eSPI / LPC bridge               (PCH)',
  '00:1f.3  HD audio                        (PCH)',
  '00:1f.4  SMBus                           (PCH)',
  '00:1f.5  SPI flash controller            (PCH)',
]

const BAR_SIZING = [
  'u32 pci_moving_config32(struct device *dev, unsigned int reg)',
  '{',
  '	u32 value, ones, zeroes;',
  '	value = pci_read_config32(dev, reg);',
  '	pci_write_config32(dev, reg, 0xffffffff);',
  '	ones = pci_read_config32(dev, reg);',
  '	pci_write_config32(dev, reg, 0x00000000);',
  '	zeroes = pci_read_config32(dev, reg);',
  '	pci_write_config32(dev, reg, value);',
  '	return ones ^ zeroes;',
  '}',
]

const BDS = [
  '//',
  '// Delete "BootNext" NV variable before transferring control to it to prevent loops.',
  '//',
  'Status = gRT->SetVariable (',
  '                EFI_BOOT_NEXT_VARIABLE_NAME,',
  '...',
  '//',
  '// Boot to "BootNext"',
  '//',
  'UnicodeSPrint (BootNextVariableName, sizeof (BootNextVariableName), L"Boot%04x", *BootNext);',
  '...                       /* then walk BootOrder: Boot0000, Boot0003, … */',
]

const EXIT_BS = [
  '	status = efi_get_memory_map(&map, true);',
  '	...',
  '	status = efi_bs_call(exit_boot_services, handle, map->map_key);',
  '	if (status == EFI_INVALID_PARAMETER) {',
  '		/*',
  '		 * The memory map changed between efi_get_memory_map() and',
  '		 * exit_boot_services().  Per the UEFI Spec v2.6, Section 6.4:',
  '		 * EFI_BOOT_SERVICES.ExitBootServices we need to get the',
  '		 * updated map, and try again.  The spec implies one retry',
  '		 * ...',
  '		 */',
  '	...',
  'static void __noreturn enter_kernel(unsigned long kernel_addr,',
  '				    struct boot_params *boot_params)',
  '{',
  '	/* enter decompressed kernel with boot_params pointer in RSI/ESI */',
  '	asm("jmp *%0"::"r"(kernel_addr), "S"(boot_params));',
]

const longRegs = (p) => {
  const k = pagingK(p)
  return {
    title: 'BSP control state',
    note: 'SDM §12.8.5',
    rows: [
      ['CR3', 'PML4 in DRAM (identity map)', 'wide'],
      ['CR4.PAE', k >= 5 ? '1' : '0', k >= 5 && k < 8 ? 'hot' : ''],
      ['EFER.LME', k >= 9 ? '1' : '0', k >= 9 && k < 11 ? 'hot' : ''],
      ['CR0.PG', k >= 12 ? '1' : '0', k >= 12 && k < 13 ? 'hot' : ''],
      ['EFER.LMA', k >= 12 ? '1 (set by hardware)' : '0', k >= 12 && k < 13 ? 'hot' : ''],
      ['CS', k >= 13 ? 'L = 1, D = 0 → 64-bit' : k >= 12 ? 'L = 0, D = 1 → compatibility mode' : '32-bit flat (L = 0, D = 1)', k >= 12 ? 'hot wide' : 'wide'],
    ],
  }
}

// EDK2's reference order at the end of DXE (OVMF's platform BDS hook), verbatim.
const LOCKDOWN = [
  'VisitAllInstancesOfProtocol (',
  '  &gEfiPciRootBridgeIoProtocolGuid,',
  '  ConnectRootBridge,',
  '  NULL',
  '  );',
  '...',
  'EfiEventGroupSignal (&gEfiEndOfDxeEventGroupGuid);',
  '...',
  '//',
  '// Prevent further changes to LockBoxes or SMRAM.',
  '// Any TPM 2 Physical Presence Interface opcode must be handled before.',
  '//',
  'Handle = NULL;',
  'Status = gBS->InstallProtocolInterface (',
  '                &Handle,',
  '                &gEfiDxeSmmReadyToLockProtocolGuid,',
  '                EFI_NATIVE_INTERFACE,',
  '                NULL',
  '                );',
  '...',
  '//',
  '// Dispatch deferred images after EndOfDxe event and ReadyToLock',
  '// installation.',
  '//',
  'EfiBootManagerDispatchDeferredImages ();',
]

export const STAGE3 = [
  {
    stage: 3,
    title: 'Into 64 bits: the PEI → DXE hand-off',
    dur: 13,
    real: 0.005,
    mode: (p) => (inLong(p) ? 'long' : 'prot'),
    shot: 'dieLeft',
    narration: [
      'On this platform everything since the reset code left 16-bit real mode — cache-as-RAM, DDR5 training, even Intel’s silicon init — ran as 32-bit code. We checked a real retail Z790 BIOS image: every SEC and PEI module is 32-bit x86 except one used only for firmware updates, and all 263 DXE drivers are 64-bit. On a normal boot the CPU flips into long mode once, at the hand-off from PEI to DXE.',
      'The recipe: build identity-mapped page tables in DRAM (every address maps to itself, so the code flipping the switch keeps running), point CR3 at them, set CR4.PAE, set EFER.LME, then turn on paging. That lands the CPU in <em>compatibility mode</em> — long mode, still running 32-bit code. One far return to a code segment marked L = 1 and it is a 2003 AMD64.',
    ],
    note: { tag: 'Not universal', html: 'Other designs switch earlier. coreboot runs 64-bit from just after cache-as-RAM — before DRAM exists — on Panther Lake and some Meteor Lake Chromebooks, and Intel ships 64-bit FSP builds starting with Meteor Lake. EDK2’s generic X64 reset vector reaches long mode before its first line of C — after a short scan of flash for the SEC core — using page tables stored in flash. On AMD Zen an on-die ARM security processor has trained DRAM before the x86 cores run a single instruction.' },
    facts: [
      ['Measured (MSI Z790, AMI)', 'SEC 4/4 and PEI 100/101 modules 32-bit · DXE 263/263 and SMM 63/63 64-bit'],
      ['Raptor Lake FSP', '32-bit API · spec 2.4 in this MSI image (Intel’s public RPL-S release: 2.3)'],
      ['Identity map', 'EDK2: the CPU’s whole physical address width (46 bits on a typical 13900K), 2 MiB or 1 GiB pages, built in DRAM'],
    ],
    regs: longRegs,
    code: { src: 'EDK2 MdePkg BaseLib Ia32/EnablePaging64.nasm', href: SRC.enablepaging[1], lines: ENABLE_PAGING64, at: (p) => Math.min(ENABLE_PAGING64.length - 1, pagingK(p)) },
    mem: MEM_RAM,
    sources: [SRC.enablepaging, SRC.dxeipl, SRC.sdm, SRC.msibios, SRC.fspm],
    lps: (p) => (i) => (i === 0 ? (inLong(p) ? 'long' : 'prot') : 'park'),
    act(p, A) {
      const k = pagingK(p)
      const jump = span(p, pagingP(12), pagingP(13))
      A.die('pcore0', 0.7 + jump * 0.3, k >= 13 ? '#58a6ff' : '#4fe08a', k >= 12 ? 'scan' : 'glow')
      A.die('sub:pcore0:decode|l1i|branch|ucode_opcache', 0.6, '#58a6ff', 'scan')
      A.die('imc0', 0.4, ACT.dram, 'scan')
      A.flow('pt', 'pcore0', 'imc0', 4 * win(p, 0.0, 0.3), ACT.dram, 6)
      A.ring(0.4, ACT.dram)
    },
    labels: [{ id: 'pcore0', text: 'BSP: compatibility mode → 64-bit', hot: true, color: '#58a6ff', from: pagingP(12) }],
  },
  {
    stage: 3,
    title: 'A firmware operating system',
    dur: 12,
    real: 1.0,
    mode: 'long',
    shot: 'fetch',
    inset: { shot: 'bsp', label: 'ONE THREAD DOES THE WORK' },
    narration: [
      'DXE — the Driver Execution Environment — is a small operating system in its own right: memory allocation, events and timers, boot and runtime services, and a dispatcher that runs each driver as soon as the protocols it depends on appear. Order is mostly emergent — only a short “apriori” list (14 drivers on this board) runs first, in a fixed order.',
      'On the MSI board we measured, the main DXE volume is stored LZMA-compressed — 5.5 MB in flash — and inflated into 18.3 MB of DRAM before dispatch: 260 DXE drivers (Intel’s FSP volume adds 3 more) and 63 System Management Mode drivers, from CPU and timer drivers to USB, NVMe, FAT, a network stack, Secure Boot, the setup UI and the board vendor’s overclocking menus.',
      'And it all runs on one thread of one P-core. The UEFI specification defines boot services as uniprocessor: drivers are serviced by polling, and the only interrupt is the boot-services timer.',
    ],
    facts: [
      ['DXE volume', '5,513,321 B compressed → 18,284,560 B'],
      ['Modules', '263 DXE · 63 SMM · 101 PEIM · 3 UEFI apps'],
      ['Execution model', 'one processor, 64-bit, identity-mapped, polled drivers, a timer interrupt (UEFI §2.3.4)'],
      ['Idle', 'the BSP HLTs when no event is pending'],
    ],
    code: { src: 'EDK2 MdeModulePkg/Core/Dxe/Dispatcher/Dispatcher.c (header)', href: SRC.dispatcher[1], lines: DISPATCHER, at: (p) => Math.min(DISPATCHER.length - 1, Math.floor(span(p, 0.05, 0.9) * DISPATCHER.length)), title: 'How DXE decides what runs next' },
    mem: { on: ['flash', 'lapic', 'dram', 'mmio', 'high'], hit: ['flash', 'dram'] },
    sources: [SRC.pispec, SRC.dispatcher, SRC.uefiexec, SRC.msibios],
    lps: () => (i) => (i === 0 ? 'long' : 'park'),
    act(p, A, t) {
      A.die('pcore0', 0.9, '#58a6ff', 'sparkle')
      A.die('sub:pcore0:l1d|l2|load_store|int_exec', 0.6, '#58a6ff', 'sparkle')
      // Drivers load from the inflated copy in DRAM; flash gets only a brief touch.
      const fv = win(p, 0, 0.15)
      A.flow('fv', 'dmi', 'pcore0', 5 * fv, ACT.fetch, 7)
      A.flow('ram', 'pcore0', 'imc0', 6, ACT.dram, 7)
      A.flow('ram2', 'pcore0', 'imc1', 4, ACT.dram, 7)
      A.bus('spi', 0.9 * fv, ACT.fetch, { rate: 12 * fv, speed: 25, dir: -1 })
      A.bus('dmi', 0.8 * fv, ACT.fetch, { rate: 10 * fv, speed: 80, dir: -1 })
      A.board('spi', 0.8 * fv, ACT.fetch, 'scan')
      A.bus('ddrA', 0.6, ACT.dram, { rate: 10, speed: 90 })
      A.bus('ddrB', 0.6, ACT.dram, { rate: 10, speed: 90 })
      A.ring(0.6, '#58a6ff')
    },
    labels: [{ id: 'spi', text: 'DXE volume: 5.5 MB LZMA', hot: true, to: 0.3 }],
  },
  {
    stage: 3,
    title: 'Wake the cores again — all the way to 64-bit',
    dur: 13,
    real: 0.03,
    mode: 'long',
    shot: 'die',
    narration: [
      'The APs were last woken from 32-bit PEI, so DXE’s CPU driver can’t simply hand them 64-bit work: it sends INIT-SIPI-SIPI again. Every thread restarts in 16-bit real mode at a page below 1 MiB and climbs the whole ladder in a trampoline of about fifty instructions — real, protected, then long mode, into code, descriptor tables and page tables the BSP already built in RAM.',
      'In EDK2’s default “HLT loop” parking mode, each later request for AP work repeats the INIT-SIPI-SIPI too. That’s the second climb for every AP this boot, at least.',
    ],
    facts: [
      ['Why again', 'PEI (32-bit) and DXE (64-bit) differ in mode'],
      ['Trampoline', '≈ 50 instructions from the SIPI vector to the first 64-bit one'],
    ],
    code: { src: 'EDK2 UefiCpuPkg MpInitLib X64/MpFuncs.nasm', href: SRC.mpfuncs[1], lines: MPFUNCS, at: (p) => Math.min(MPFUNCS.length - 1, Math.floor(span(p, 0.15, 0.85) * MPFUNCS.length)) },
    mem: { on: ['flash', 'lapic', 'dram', 'mmio', 'high'], hit: ['lapic', 'dram'] },
    sources: [SRC.mpfuncs, SRC.mplib, SRC.sdm],
    lps: (p) => wave(p, 0.12, 0.92, ['wfs', 'real', 'prot', 'long', 'park'], { before: 'park', bspMode: 'long', spread: 0.3 }),
    act(p, A) {
      A.die('pcore0', 0.6, '#58a6ff', 'glow')
      const ipi = win(p, 0.04, 0.2)
      if (ipi > 0) {
        A.ring(0.9 * ipi, ACT.ipi)
        for (const id of ALL_CORES) A.flow(`ipi-${id}`, 'pcore0', id, 3 * ipi, ACT.ipi, 8)
      }
      const run = win(p, 0.18, 0.88)
      A.die('kind:pcore', 0.1 + run * 0.3, '#7fd8ff', 'sparkle')
      A.die('kind:ecore_cluster', 0.1 + run * 0.3, '#7fd8ff', 'sparkle')
    },
    labels: [{ id: 'ecl0', text: 'every AP: 16 → 32 → 64 again', from: 0.3 }],
  },
  {
    stage: 3,
    title: 'Who’s on the bus? PCIe enumeration',
    dur: 15,
    real: 0.3,
    mode: 'long',
    shot: 'pcie',
    inset: { shot: 'sa', label: 'ROOT PORTS ON THE DIE' },
    narration: [
      'When the dispatcher runs out of drivers, the boot manager (BDS) starts <em>connecting</em> devices — and connecting the PCI root bridge is what sets the PCI bus driver scanning. Configuration space is reached through a memory window (ECAM): 4 KiB per bus/device/function. Firmware reads the first four bytes of every possible device; all ones — <code>FFFFFFFF</code> — means nobody is home, anything else is a vendor and device ID. Finding a bridge, it hands the link behind it the next free bus number, scans it depth-first, then records the highest bus number found below so future requests route correctly.',
      'The chipset is invisible here: DMI is transparent to configuration software, so the PCH’s USB, SATA, audio and SPI controllers show up on bus 0 alongside the CPU’s own devices. The links themselves train in hardware — up to 32 GT/s per lane on the CPU’s Gen5 ×16 graphics port — before this scan begins. The PCIe rule: wait at least 100 ms after a link trains before the first configuration request, and allow a device a full second before declaring it broken. (Intel’s FSP configured the CPU’s root ports back in 32-bit PEI; this finds what is behind them.)',
    ],
    facts: [
      ['ECAM address', 'base + (bus << 20 | dev << 15 | fn << 12 | reg)'],
      ['CPU lanes', 'PCIe 5.0 ×16 (or ×8 + ×8) + PCIe 4.0 ×4'],
      ['CPU ↔ PCH', 'DMI Gen 4 ×8, 16 GT/s'],
    ],
    code: { src: 'enumeration result (devices: coreboot pci_devs.h; slots: coreboot’s ms7e06 board)', href: SRC.pcidevs[1], lines: LSPCI, at: (p) => Math.min(LSPCI.length - 1, Math.floor(span(p, 0.05, 0.9) * LSPCI.length)), title: 'Found so far' },
    mem: { on: ['flash', 'lapic', 'dram', 'mmio', 'high'], hit: ['mmio'], note: 'ECAM lives in the MMIO hole' },
    sources: [SRC.bdsplatform, SRC.pcidevice, SRC.pcilib, SRC.pcidevs, SRC.ms7e06, SRC.linuxpci, SRC.ark],
    lps: () => (i) => (i === 0 ? 'long' : 'park'),
    act(p, A) {
      A.die('pcore0', 0.6, '#58a6ff', 'glow')
      A.die('pcie_ctrl', 0.8, ACT.pcie, 'scan')
      A.die('sa', 0.5, ACT.pcie, 'scan')
      A.flow('cfg', 'pcore0', 'pcie_ctrl', 6, ACT.pcie, 7)
      const g = win(p, 0.12, 0.4)
      const n = win(p, 0.32, 0.55)
      const h = win(p, 0.5, 0.95)
      A.die('pcie5', 0.3 + g * 0.7, ACT.pcie, 'sparkle')
      A.die('pcie4', 0.3 + n * 0.7, ACT.pcie, 'sparkle')
      A.die('dmi', 0.3 + h * 0.7, ACT.pcie, 'sparkle')
      A.bus('pcie16', 0.3 + g * 0.7, ACT.pcie, { rate: 14 * g, speed: 90 })
      A.board('gpu', g * 0.8, ACT.pcie, 'scan')
      A.bus('pcie4', 0.3 + n * 0.7, ACT.pcie, { rate: 10 * n, speed: 90 })
      A.board('nvme', n * 0.9, ACT.pcie, 'scan')
      A.bus('dmi', 0.3 + h * 0.6, ACT.pcie, { rate: 10 * h, speed: 90 })
      A.board('pch', 0.3 + h * 0.6, ACT.pcie, 'scan')
    },
    labels: [{ id: 'gpu', text: '01:00.0 GPU', to: 0.5 }, { id: 'nvme', text: '02:00.0 NVMe', from: 0.3 }, { id: 'pch', text: 'PCH devices, also on bus 0', from: 0.5 }],
  },
  {
    stage: 3,
    title: 'Sizing the windows',
    dur: 11,
    real: 0.05,
    mode: 'long',
    shot: 'pcie',
    narration: [
      'Each device says how much address space it wants through its Base Address Registers, and the trick for asking is lovely: write all ones, read it back. Address bits below the window’s size stay zero, and the lowest bit that moved gives the size. (coreboot also writes zeros and XORs the two answers, to find exactly the bits that move.) A GPU answering <code>F000000C</code> wants 256 MiB, 64-bit, prefetchable — or, with Resizable BAR enabled, all of its VRAM in one window above 4 GiB.',
      'Then the allocator packs every request into the address holes — I/O ports, 32-bit MMIO below 4 GiB, 64-bit prefetchable MMIO above — largest first, programs each bridge’s windows and switches the bridges on. A device’s own bus mastering — its licence to DMA — waits for its driver (in EDK2, its memory decoding does too).',
    ],
    regs: (p) => ({
      title: 'Sizing one BAR (worked example)',
      rows: [
        ['original value', 'saved'],
        ['write', 'FFFFFFFF', p > 0.15 && p < 0.4 ? 'hot' : ''],
        ['read back', p > 0.3 ? 'F000000C' : '…', p > 0.3 && p < 0.55 ? 'hot' : ''],
        ['bits 3:0', p > 0.45 ? 'C = memory, 64-bit, prefetchable' : '…', 'wide'],
        ['lowest bit that moved', p > 0.6 ? 'bit 28 → 2²⁸ = 256 MiB' : '…', p > 0.6 ? 'hot wide' : 'wide'],
      ],
    }),
    code: { src: 'coreboot src/device/pci_device.c', href: SRC.pcidevice[1], lines: BAR_SIZING, at: (p) => Math.min(BAR_SIZING.length - 1, 3 + Math.floor(span(p, 0.05, 0.9) * 8)) },
    mem: { on: ['flash', 'lapic', 'dram', 'mmio', 'high'], hit: ['mmio', 'high'] },
    sources: [SRC.pcidevice, SRC.pcilib],
    lps: () => (i) => (i === 0 ? 'long' : 'park'),
    act(p, A) {
      A.die('pcore0', 0.6, '#58a6ff', 'glow')
      A.die('pcie_ctrl', 0.6, ACT.pcie, 'scan')
      A.die('pcie5', 0.8, ACT.pcie, 'glow')
      A.flow('bar', 'pcore0', 'pcie5', 4, ACT.pcie, 7)
      A.bus('pcie16', 0.8, ACT.pcie, { rate: 8, speed: 90 })
      A.bus('pcie16', 0.6, ACT.pcie, { rate: 6, speed: 90, dir: -1 })
      A.board('gpu', 0.7, ACT.pcie, 'scan')
    },
    labels: [{ id: 'gpu', text: 'BAR: “I want 256 MiB”', hot: true }],
  },
  {
    stage: 3,
    title: 'Lock-down before outside code runs',
    dur: 13,
    real: 0.02,
    mode: 'long',
    shot: 'die',
    narration: [
      'Up to now every instruction came from the board maker’s own flash. The next code to run comes from somewhere else — the graphics card’s ROM — so the firmware locks up first. It signals <em>End of DXE</em>, then installs <em>SMM Ready To Lock</em>: SMRAM is closed and locked until the next reset, and SMM stops loading new drivers.',
      'The PI specification asks for this order: before running any driver or application that isn’t from the platform manufacturer, or connecting consoles, the platform should signal End of DXE and immediately install SMM Ready To Lock. EDK2 enforces it — an option ROM found during enumeration is <em>deferred</em>, not run, until this moment.',
    ],
    note: { tag: 'Also around here', html: 'A retail BIOS typically also write-protects its own flash and turns on pre-boot DMA protection. This MSI image carries modules for BIOS Guard, VT-d DMA protection and the CSME hand-off; we checked they are present, not exactly when each one runs. The order shown is EDK2’s reference platform; AMI’s is not public.' },
    facts: [
      ['Order (EDK2)', 'connect root bridges → End of DXE → SMM Ready To Lock → deferred option ROMs → consoles'],
      ['SMRAM lock', 'cannot be reopened until the next reset'],
    ],
    code: {
      src: 'EDK2 OvmfPkg BdsPlatform.c — PlatformBootManagerBeforeConsole()',
      href: SRC.bdsplatform[1],
      lines: LOCKDOWN,
      title: 'The order, in code',
      at: (p) => (p < 0.12 ? Math.min(4, Math.floor(span(p, 0, 0.12) * 5)) : p < 0.35 ? 6 : p < 0.75 ? 9 + Math.min(9, Math.floor(span(p, 0.35, 0.75) * 10)) : 24),
    },
    mem: { on: ['flash', 'lapic', 'dram', 'mmio', 'high'], hit: ['dram', 'flash'], note: 'TSEG locked' },
    sources: [SRC.endofdxe, SRC.bdsplatform, SRC.defer3rd, SRC.msibios],
    lps: () => (i) => (i === 0 ? 'long' : 'park'),
    act(p, A) {
      A.die('pcore0', 0.8, '#58a6ff', 'glow')
      const lock = span(p, 0.4, 0.7)
      A.die('imc0', 0.3 + 0.5 * lock, '#ff9a3d', 'pinned')
      A.die('imc1', 0.3 + 0.5 * lock, '#ff9a3d', 'pinned')
      A.flow('lock', 'pcore0', 'imc0', 4 * win(p, 0.35, 0.75), '#ff9a3d', 7)
      A.board('spi', 0.25 + 0.5 * lock, '#ff9a3d', 'pinned')
      A.board('gpu', 0.25, ACT.gpu, 'breathe')
      A.die('kind:pcore', 0.12, '#7d7fb8', 'breathe')
      A.die('kind:ecore_cluster', 0.12, '#7d7fb8', 'breathe')
    },
    labels: [
      { id: 'gpu', text: 'option ROM found — deferred', to: 0.8 },
      { id: 'pcore0', text: 'End of DXE → SMM Ready To Lock', hot: true, from: 0.15 },
    ],
  },
  {
    stage: 3,
    title: 'The graphics card brings its own driver',
    dur: 12,
    real: 0.3,
    mode: 'long',
    shot: 'pcie',
    narration: [
      'A graphics card carries an <em>option ROM</em>, exposed through a ROM BAR at configuration offset 30h. Each image begins <code>55 AA</code> and points to a “PCIR” structure whose code type says what it is: 0 for an old real-mode VGA BIOS, 3 for a UEFI driver. This board’s firmware still ships the legacy-compatibility (CSM) modules, but a modern card is driven by its UEFI <em>GOP</em> driver.',
      'Only now, after the lock-down, does the firmware run that 64-bit driver — on the CPU, not the GPU — after checking its signature under Secure Boot. GOP hands back a framebuffer address inside one of the card’s BARs; the boot logo is simply pixels written there. (An ACPI table, BGRT, later tells the OS where the logo was, so it can keep it on screen.)',
    ],
    facts: [
      ['ROM image', 'signature AA55h → “PCIR” → code type 3 = EFI'],
      ['Runs on', 'the CPU (BSP), 64-bit'],
      ['Gives', 'a linear framebuffer + Blt()'],
      ['Signed by', 'usually Microsoft’s third-party UEFI CA — the 2011 certificate expired in June 2026; firmware doesn’t enforce expiry, and newer ROMs are signed under a 2023 CA'],
    ],
    mem: { on: ['flash', 'lapic', 'dram', 'mmio', 'high'], hit: ['high', 'dram'] },
    sources: [SRC.optrom, SRC.gop, SRC.imgverify, SRC.defer3rd],
    lps: () => (i) => (i === 0 ? 'long' : 'park'),
    act(p, A) {
      A.die('pcore0', 0.8, '#58a6ff', 'sparkle')
      A.die('pcie5', 0.9, ACT.gpu, 'scan')
      A.flow('rom', 'pcie5', 'pcore0', 4 * win(p, 0.05, 0.4), ACT.gpu, 7)
      A.flow('fb', 'pcore0', 'pcie5', 6 * span(p, 0.45, 0.6), ACT.gpu, 7)
      A.bus('pcie16', 1, ACT.gpu, { rate: 6 + 16 * span(p, 0.45, 0.6), speed: 100, dir: p < 0.4 ? -1 : 1 })
      A.board('gpu', 0.6 + 0.4 * span(p, 0.45, 0.65), ACT.gpu, 'glow')
    },
    labels: [{ id: 'gpu', text: 'GOP driver from the card’s ROM; logo → framebuffer', hot: true }],
  },
  {
    stage: 3,
    title: 'Describing the machine to whoever comes next',
    dur: 11,
    real: 0.05,
    mode: 'long',
    shot: 'die',
    narration: [
      'Before handing over, firmware writes down what it found. ACPI tables: the RSDP points to the XSDT, which lists the rest — the FADT (which in turn points to the DSDT, device descriptions in AML bytecode), the <em>MADT</em> with one entry for each of the 32 hardware threads (by convention the boot thread comes first), MCFG saying where ECAM lives, HPET, DMAR for the IOMMU, the boot-performance and boot-logo tables, TPM2.',
      'SMBIOS describes the board, the processor and each DIMM; the UEFI memory map tells the OS which RAM is free and which it must never touch. Most of it is written as drivers load; the boot-logo table waits for ReadyToBoot, once a boot option is picked, and the boot-timing record is stamped right up to ExitBootServices.',
    ],
    facts: [
      ['RSDP signature', '“RSD PTR ” (with the trailing space)'],
      ['MADT', '32 processor entries; the spec says the BSP “should” be first'],
      ['SMBIOS 3', 'anchor “_SM3_”; type 4 = CPU, type 17 = each DIMM'],
    ],
    regs: { title: 'ACPI tables written', rows: [['RSDP', '→ XSDT'], ['XSDT', '64-bit pointers'], ['FACP / DSDT', 'AML device tree'], ['APIC (MADT)', '32 local APICs', 'hot'], ['MCFG', 'ECAM base'], ['HPET · DMAR', 'timers · VT-d'], ['FPDT · BGRT', 'boot timing · logo'], ['TPM2 · SSDTs', 'more AML']] },
    mem: MEM_RAM,
    sources: [SRC.acpi, SRC.uefispec],
    lps: () => (i) => (i === 0 ? 'long' : 'park'),
    act(p, A) {
      A.die('pcore0', 0.7, '#58a6ff', 'sparkle')
      A.flow('acpi', 'pcore0', 'imc1', 4, ACT.dram, 6)
      A.die('kind:pcore', 0.18, '#7d7fb8', 'breathe')
      A.die('kind:ecore_cluster', 0.18, '#7d7fb8', 'breathe')
    },
  },
  {
    stage: 3,
    title: 'Choosing something to boot',
    dur: 12,
    real: 0.8,
    mode: 'long',
    shot: 'pcie',
    narration: [
      'Boot Device Selection: the boot manager reads the UEFI variable <code>BootNext</code> (deleting it first, so a broken entry can’t loop forever), then walks <code>BootOrder</code> through <code>Boot####</code> entries — each a device path like <code>PciRoot(0x0)/Pci(0x6,0x0)/Pci(0x0,0x0)/NVMe(0x1,…)/HD(1,GPT,…)/\\EFI\\…</code> down to a file on a FAT32 EFI System Partition. If none work, firmware falls back to its recovery options, which by spec include the removable-media default path <code>\\EFI\\BOOT\\BOOTX64.EFI</code>.',
      'Under Secure Boot the loader is hashed and its signature checked against <code>dbx</code> (revoked) first, then <code>db</code> (allowed); the KEK and platform key control who may change those lists. Then the boot loader — Windows Boot Manager, or shim and GRUB — runs as a 64-bit UEFI application, still using the firmware’s services to read the kernel off the NVMe drive.',
    ],
    facts: [
      ['Fallback path', '\\EFI\\BOOT\\BOOTX64.EFI (PE machine 8664h)'],
      ['Watchdog', 'the boot manager arms a 5-minute watchdog before starting the loader'],
      ['Variable writes', 'go through SMM on this firmware (its NvramSmm and SmiVariable modules): each is an SMI, a trip out of long mode and back'],
    ],
    code: { src: 'EDK2 MdeModulePkg BdsDxe/BdsEntry.c', href: SRC.bds[1], lines: BDS, at: (p) => Math.min(BDS.length - 1, Math.floor(span(p, 0.05, 0.6) * BDS.length)) },
    mem: MEM_RAM,
    sources: [SRC.uefispec, SRC.bds, SRC.imgverify],
    lps: () => (i) => (i === 0 ? 'long' : 'park'),
    act(p, A) {
      A.die('pcore0', 0.8, '#58a6ff', 'sparkle')
      A.die('pcie4', 0.9, ACT.pcie, 'scan')
      A.flow('nvme', 'pcie4', 'pcore0', 5, ACT.pcie, 7)
      A.bus('pcie4', 1, ACT.pcie, { rate: 18, speed: 100, dir: -1 })
      A.board('nvme', 1, ACT.pcie, 'scan')
      A.board('gpu', 0.4, ACT.gpu, 'glow')
    },
    labels: [{ id: 'nvme', text: 'ESP → \\EFI\\…\\loader.efi', hot: true }],
  },
  {
    stage: 3,
    title: 'ExitBootServices: the firmware steps aside',
    dur: 13,
    real: 0.5,
    mode: 'long',
    shot: 'die',
    narration: [
      'Linux’s EFI stub — the kernel image pretending to be a UEFI application — decompresses the kernel while firmware services are still available, grabs the final memory map and calls <code>ExitBootServices</code> with that map’s key. If anything allocated memory in between, the firmware refuses and the loader must fetch the map and try again.',
      'After that the OS owns all available memory; firmware keeps only a few runtime services (variables, time, reset). The stub jumps to the kernel’s <code>startup_64</code> with a pointer to its boot parameters in RSI. Apart from brief trips into SMM (and legacy-BIOS thunks, if CSM is on), the boot processor has stayed in 64-bit mode since DXE began. The other 31 threads — woken one last time at ExitBootServices (in EDK2) to move there — sit in a tiny halt loop the firmware copied into reserved memory, waiting to be woken again.',
    ],
    note: { tag: 'Thread check', html: '“Hundreds of millions of instructions” for this stage — plausible as a floor, but unmeasured: nobody publishes it. Retail desktops typically spend a few seconds in firmware (Windows shows it as “Last BIOS time”); with turbo-clocked busy-waits the true count could be in the billions.' },
    facts: [
      ['Typical firmware time', 'a few seconds on retail desktops; well under 1 s with lean firmware like coreboot'],
      ['APs at hand-off', 'HLT/MWAIT loop in EfiReservedMemoryType pages'],
    ],
    code: { src: 'Linux drivers/firmware/efi/libstub', href: SRC.efistub[1], lines: EXIT_BS, at: (p) => Math.min(EXIT_BS.length - 1, Math.floor(span(p, 0.05, 0.9) * EXIT_BS.length)) },
    mem: MEM_RAM,
    sources: [SRC.efistub, SRC.uefispec, SRC.fpdt],
    lps: () => (i) => (i === 0 ? 'long' : 'park'),
    act(p, A) {
      A.die('pcore0', 0.85, '#58a6ff', 'sparkle')
      A.flow('k', 'pcore0', 'imc0', 6, ACT.dram, 7)
      A.flow('k2', 'pcore0', 'imc1', 6, ACT.dram, 7)
      A.ring(0.7, ACT.dram)
      A.bus('ddrA', 0.7, ACT.dram, { rate: 14, speed: 100 })
      A.bus('ddrB', 0.7, ACT.dram, { rate: 14, speed: 100 })
      A.die('kind:pcore', 0.15, '#7d7fb8', 'breathe')
      A.die('kind:ecore_cluster', 0.15, '#7d7fb8', 'breathe')
    },
    labels: [{ id: 'pcore0', text: 'jmp startup_64', hot: true, from: 0.7 }],
  },
]
