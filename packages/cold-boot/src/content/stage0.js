// Stage 0 — from the power button to the moment before the first BIOS
// instruction.

import { ACT, span, win, SRC, all, bsp, wave } from './common.js'

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

export const STAGE0 = [
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
    real: 0.08,
    mode: 'off',
    shot: 'standby',
    narration: [
      'Pressing the button just pulls a wire to ground. The Super I/O has its own debounce filter (62 ms by default on a Nuvoton NCT6796D), then passes the press to the chipset’s <code>PWRBTN#</code> pin, which by default waits out a further 16 ms in case it was a glitch.',
      'Satisfied, the PMC leaves S5 by releasing its sleep signals (<code>SLP_S5#</code>, <code>SLP_S4#</code>, <code>SLP_S3#</code>). The Super I/O turns <code>SLP_S3#</code> into <code>PS_ON#</code> — the green wire in the 24-pin cable that tells the power supply to switch on.',
    ],
    facts: [
      ['Super I/O filter', '62.4 ms default on PSIN# (NCT6796D; delay inferred)'],
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
    labels: [{ id: 'fpanel', hot: true, to: 0.45 }, { id: 'sio', text: 'Super I/O: debounce → PWRBTN#, then PS_ON#' }, { id: 'pch', text: 'PMC: 16 ms debounce, leave S5', from: 0.25 }, { id: 'atx24', text: 'PS_ON# low → PSU on', from: 0.7 }],
  },
  {
    stage: 0,
    title: 'Power, proven',
    dur: 9,
    real: 0.28,
    mode: 'off',
    shot: 'power',
    narration: [
      'The supply ramps +12 V, +5 V and +3.3 V — then deliberately waits. On a current ATX supply, <code>PWR_OK</code> — the PSU’s promise that the power is stable — rises 100–250 ms after the rails are in regulation (pre-2020 designs: up to 500 ms). It is the longest single wait before the CPU runs anything.',
      'The motherboard’s regulators turn 12 V into the processor’s own rails. The big multi-phase core regulator will take its voltage orders from the CPU itself over a three-wire bus called SVID. DIMMs, the GPU and the SSD get power too, but are held in reset.',
    ],
    facts: [
      ['PSU power-on (T1)', '< 200 ms (ATX 3 required)'],
      ['PWR_OK delay (T3)', '100–250 ms after rails are good (ATX 3 required)'],
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
      'Its ROM pulls signed firmware out of the CSME region of the same SPI flash chip that holds the BIOS, and that firmware patches the chipset’s power controller and sets up the clocks, including the 100 MHz reference clock the CPU will run from. The CPU stays in reset until this engine tells the PMC the host may boot.',
    ],
    note: { tag: 'In parallel', html: 'The CSME works while the power supply is still proving itself; the clock here adds them up one after the other, so treat it as ± a few hundred ms. Intel’s own telemetry on Alder Lake Chromebooks: CSME ROM start → “Host BIOS Prep Done” ≈ 50–90 ms; → “CPU Reset Done Ack” ≈ 170–280 ms.' },
    facts: [
      ['CSME core', '32-bit, 486-class, 512 KB–1.9 MB SRAM'],
      ['Firmware', 'CSME region of the SPI flash'],
      ['Also', 'holds the Boot Guard key hash in fuses'],
    ],
    regs: (p) => signals(p, 3),
    sources: [SRC.csme, SRC.cseTelemetry, SRC.cseCommit, SRC.cseCommit2],
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
      'Inside the CPU, in steps Intel doesn’t publish, its power-control firmware brings up clocks and voltages and every core runs its reset microcode. Then one hardware thread becomes the <em>bootstrap processor</em> (BSP). The other 31 halt in <em>wait-for-SIPI</em>: powered, listening, and executing nothing until software sends them a start-up message.',
    ],
    note: { tag: 'Which thread?', html: 'On modern Intel parts the BSP is picked by a platform-specific mix of hardware and configuration (SDM §11.4). Linux’s CPU 0 on Alder/Raptor Lake is a P-core thread; which <em>physical</em> P-core it is isn’t documented, so the one lit here is illustrative.' },
    facts: [
      ['Logical processors', '8 P-cores × 2 threads + 16 E-cores = 32'],
      ['BSP', '1 (IA32_APIC_BASE bit 8 set)'],
      ['APs', '31, in wait-for-SIPI'],
      ['Duration', 'unpublished; the clock’s 50 ms is an estimate'],
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
      'The table lists microcode updates. The CPU loads the newest one that matches and applies it to every thread in the package — every boot, because “the effects of a loaded update are cleared from the processor upon a hard reset”. The chip you bought is being patched by the flash chip before it runs anything.',
    ],
    facts: [
      ['FIT pointer', 'FFFFFFC0h (4 GiB − 40h)'],
      ['Microcode', 'type-1 FIT entry; RPL-S B0 = 06-b7-01, ≈241 KB'],
      ['Reset acknowledged → first BIOS code', '28–89 ms on Alder Lake Chromebooks (what fills it isn’t documented)'],
    ],
    regs: { title: 'Top of the 4 GiB address space', note: 'all of it is the flash chip', rows: [['FFFFFFFC', 'CBFS header pointer (coreboot)', 'wide'], ['FFFFFFF0', 'reset vector (16 bytes)', 'wide'], ['FFFFFFC0', 'FIT pointer — same 64-byte line', 'wide hot'], ['FFFF0000–FFFFFFFF', 'top 64 KiB: real-mode reach', 'wide'], ['FF000000–FFFFFFFF', '16 MiB BIOS decode window', 'wide']] },
    mem: { on: ['flash', 'lapic'], hit: ['flash'], note: 'no DRAM, no cache' },
    sources: [SRC.fit, SRC.sdm, SRC.ucode, SRC.cseCommit, SRC.cseCommit2, SRC.bootblockld],
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
    labels: [{ id: 'spi', text: 'FIT → microcode update', hot: true }, { id: 'dmi', text: 'DMI ×8 to the chipset', always: true }],
  },
  {
    stage: 0,
    title: 'The secret first program',
    dur: 10,
    real: 0.01,
    mode: 'prot',
    shot: 'dieLeft',
    narration: [
      'If the FIT also lists an Intel-signed <em>Startup ACM</em> (as on every <em>Intel Boot Guard</em> PC), the CPU runs it before the reset vector — from inside its own cache, in what is believed to be 32-bit protected mode. So on those machines the first x86 code to run isn’t 16-bit at all: the “386” runs before the “8086”.',
      'With Boot Guard provisioned, the ACM checks the PC maker’s key manifest against a key hash fused into the chipset, then hashes the BIOS’s Initial Boot Block before letting it execute. It leaves that boot block sitting in cache, in the same No-Eviction Mode that comes back in Stage 2.',
    ],
    note: { tag: 'Not every PC', html: 'This step happens only if the FIT lists a Startup ACM, which Boot Guard (fused in by the PC maker) requires. MSI’s PRO Z790-P WIFI BIOS (7E06vAK) lists none, so on that board the BSP goes straight to the reset vector; this step and its estimated 10 ms never happen.' },
    facts: [
      ['FIT type', '0x02 Startup ACM, 0x0B Key Manifest, 0x0C Boot Policy Manifest'],
      ['Runs in', 'cache (“AC RAM”); 32-bit protected mode, paging off (believed — not documented for the reset-time launch)'],
      ['Leaves behind', 'MSR 0x13A bit 0 = NEM enabled'],
    ],
    mem: { on: ['flash', 'lapic', 'car'], hit: ['car', 'flash'], note: 'only with a Startup ACM' },
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

]
