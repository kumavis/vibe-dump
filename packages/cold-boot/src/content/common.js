// Shared by every stage's content: sources, and helpers for the 32 logical
// processors' states.

import { ACT, span, window as win } from '../util.js'

export { ACT, span, win }

// ---- sources ------------------------------------------------------------------
export const SRC = {
  thread: ['LaurieWired’s thread', 'https://bsky.app/profile/lauriewired.bsky.social/post/3mxwk6hqb622v'],
  sdm: ['Intel SDM, rev. 093 (Vols. 1 and 3)', 'https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html'],
  pchds: ['Intel 700-series PCH datasheet', 'https://edc.intel.com/content/www/us/en/design/products-and-solutions/processors-and-chipsets/700-series-chipset-family-platform-controller-hub-datasheet-volume-1-of/'],
  rplds: ['Intel 13th-gen Core datasheet', 'https://edc.intel.com/content/www/us/en/design/products/platforms/details/raptor-lake-s/13th-generation-core-processors-datasheet-volume-1-of-2/'],
  atx: ['Intel ATX 3 PSU design guide', 'https://cdrdv2-public.intel.com/336521/336521_Rev2p1a.pdf'],
  sio: ['Nuvoton NCT6796D datasheet (example Super I/O; the MSI board uses an NCT6687D)', 'https://www.nuvoton.com/resource-files/NCT6796D_Datasheet_V0_6.pdf'],
  csme: ['Intel CSME security white paper', 'https://www.intel.com/content/dam/www/public/us/en/security-advisory/documents/intel-csme-security-white-paper.pdf'],
  cseTelemetry: ['coreboot cse_telemetry_v1.h', 'https://github.com/coreboot/coreboot/blob/main/src/soc/intel/common/block/include/intelblocks/cse_telemetry_v1.h'],
  cseCommit: ['coreboot commit 860672e9 (measured CSME timings)', 'https://github.com/coreboot/coreboot/commit/860672e9879e52820d453e3bc41d151116facb1a'],
  cseCommit2: ['coreboot change 79768 (CSME timings, Alder Lake-N)', 'https://review.coreboot.org/c/coreboot/+/79768'],
  fit: ['Intel FIT BIOS specification', 'https://www.intel.com/content/dam/www/public/us/en/documents/guides/fit-bios-specification.pdf'],
  txt: ['coreboot: Intel TXT / ACM docs', 'https://github.com/coreboot/coreboot/blob/main/Documentation/security/intel/txt.md'],
  ermolov: ['Ermolov, “Safeguarding rootkits: Intel BootGuard” (2016)', 'https://papers.put.as/papers/firmware/2016/Intel_BootGuard_final.pdf'],
  entry16: ['coreboot src/cpu/x86/entry16.S', 'https://github.com/coreboot/coreboot/blob/main/src/cpu/x86/entry16.S'],
  entry32: ['coreboot src/cpu/x86/entry32.S', 'https://github.com/coreboot/coreboot/blob/main/src/cpu/x86/entry32.S'],
  bootblockld: ['coreboot src/arch/x86/bootblock.ld', 'https://github.com/coreboot/coreboot/blob/main/src/arch/x86/bootblock.ld'],
  gdt: ['coreboot src/arch/x86/gdt_init.S', 'https://github.com/coreboot/coreboot/blob/main/src/arch/x86/gdt_init.S'],
  vtf0: ['EDK2 UefiCpuPkg/ResetVector/Vtf0', 'https://github.com/tianocore/edk2/tree/master/UefiCpuPkg/ResetVector/Vtf0'],
  adlSec: ['edk2-platforms Alder Lake SecEntry.nasm', 'https://github.com/tianocore/edk2-platforms/blob/master/Platform/Intel/AlderlakeOpenBoardPkg/FspWrapper/Library/SecFspWrapperPlatformSecLib/Ia32/SecEntry.nasm'],
  flash: ['Winbond W25Q256JV datasheet', 'https://cdn.sparkfun.com/assets/c/2/9/2/6/W25Q256JV.pdf'],
  ucode: ['Intel microcode release notes', 'https://github.com/intel/Intel-Linux-Processor-Microcode-Data-Files/blob/main/releasenote.md'],
  amd17: ['coreboot: AMD family 17h boot flow', 'https://github.com/coreboot/coreboot/blob/main/Documentation/soc/amd/family17h.md'],
  // secondary cores
  sipi: ['coreboot src/cpu/x86/sipi_vector.S', 'https://github.com/coreboot/coreboot/blob/main/src/cpu/x86/sipi_vector.S'],
  mpinit: ['coreboot src/cpu/x86/mp_init.c', 'https://github.com/coreboot/coreboot/blob/main/src/cpu/x86/mp_init.c'],
  mpfuncs: ['EDK2 MpInitLib X64/MpFuncs.nasm', 'https://github.com/tianocore/edk2/blob/master/UefiCpuPkg/Library/MpInitLib/X64/MpFuncs.nasm'],
  mplib: ['EDK2 MpInitLib MpLib.c', 'https://github.com/tianocore/edk2/blob/master/UefiCpuPkg/Library/MpInitLib/MpLib.c'],
  smpboot: ['Linux arch/x86/kernel/smpboot.c', 'https://github.com/torvalds/linux/blob/master/arch/x86/kernel/smpboot.c'],
  tramp: ['Linux arch/x86/realmode/rm/trampoline_64.S', 'https://github.com/torvalds/linux/blob/master/arch/x86/realmode/rm/trampoline_64.S'],
  head64: ['Linux arch/x86/kernel/head_64.S', 'https://github.com/torvalds/linux/blob/master/arch/x86/kernel/head_64.S'],
  cpuhp: ['Linux kernel/cpu.c (parallel bring-up)', 'https://github.com/torvalds/linux/blob/master/kernel/cpu.c'],
  lkml65: ['Gleixner, Linux 6.5 smp/core pull (bring-up timings)', 'https://lkml.iu.edu/hypermail/linux/kernel/2306.3/01314.html'],
  acpi: ['ACPI 6.5 §5.2.12 (MADT)', 'https://uefi.org/specs/ACPI/6.5/05_ACPI_Software_Programming_Model.html'],
  ark: ['Intel ARK: Core i9-13900K', 'https://www.intel.com/content/www/us/en/products/sku/230496/intel-core-i913900k-processor-36m-cache-up-to-5-80-ghz/specifications.html'],
  // memory
  micron: ['Micron DDR5 SDRAM product page (core data sheet Rev. D, JESD79-5B-compliant)', 'https://www.micron.com/products/memory/dram-components/ddr5-sdram'],
  rambus: ['Rambus: DDR5 DIMM chipsets', 'https://www.rambus.com/blogs/get-ready-for-ddr5-dimm-chipsets/'],
  fspm: ['Intel FSP: Raptor Lake-S FspmUpd.h', 'https://github.com/intel/FSP/blob/master/RaptorLakeFspBinPkg/Client/RaptorLakeS/Include/FspmUpd.h'],
  meminit: ['coreboot drivers/intel/fsp2_0/memory_init.c', 'https://github.com/coreboot/coreboot/blob/main/src/drivers/intel/fsp2_0/memory_init.c'],
  smbuslib: ['coreboot intel smbus/smbuslib.c', 'https://github.com/coreboot/coreboot/blob/main/src/soc/intel/common/block/smbus/smbuslib.c'],
  hswraminit: ['coreboot Haswell native raminit (open MRC re-implementation)', 'https://github.com/coreboot/coreboot/tree/main/src/northbridge/intel/haswell/native_raminit'],
  memmap: ['coreboot intel systemagent/memmap.c', 'https://github.com/coreboot/coreboot/blob/main/src/soc/intel/common/block/systemagent/memmap.c'],
  adlKconfig: ['coreboot soc/intel/alderlake/Kconfig', 'https://github.com/coreboot/coreboot/blob/main/src/soc/intel/alderlake/Kconfig'],
  fspapi: ['EDK2 IntelFsp2Pkg FspApi.h', 'https://github.com/tianocore/edk2/blob/master/IntelFsp2Pkg/Include/FspEas/FspApi.h'],
  // long mode, DXE, PCIe, boot
  enablepaging: ['EDK2 BaseLib Ia32/EnablePaging64.nasm', 'https://github.com/tianocore/edk2/blob/master/MdePkg/Library/BaseLib/Ia32/EnablePaging64.nasm'],
  dxeipl: ['EDK2 DxeIplPeim (PEI → DXE hand-off)', 'https://github.com/tianocore/edk2/tree/master/MdeModulePkg/Core/DxeIplPeim'],
  dispatcher: ['EDK2 DXE Dispatcher.c', 'https://github.com/tianocore/edk2/blob/master/MdeModulePkg/Core/Dxe/Dispatcher/Dispatcher.c'],
  pispec: ['UEFI PI spec 1.8, Vol. 2 (DXE)', 'https://uefi.org/specs/PI/1.8/V2_Overview.html'],
  uefispec: ['UEFI 2.11 specification', 'https://uefi.org/specs/UEFI/2.11/'],
  msibios: ['MSI PRO Z790-P WIFI BIOS 7E06vAK (module census)', 'https://download-2.msi.com/bos_exe/mb/7E06vAK.zip'],
  smmreloc: ['EDK2 SmmRelocationLib.c', 'https://github.com/tianocore/edk2/blob/master/UefiCpuPkg/Library/SmmRelocationLib/SmmRelocationLib.c'],
  pcidevice: ['coreboot src/device/pci_device.c', 'https://github.com/coreboot/coreboot/blob/main/src/device/pci_device.c'],
  pcilib: ['EDK2 PciBusDxe PciLib.c', 'https://github.com/tianocore/edk2/blob/master/MdeModulePkg/Bus/Pci/PciBusDxe/PciLib.c'],
  pcidevs: ['coreboot alderlake pci_devs.h', 'https://github.com/coreboot/coreboot/blob/main/src/soc/intel/alderlake/include/soc/pci_devs.h'],
  linuxpci: ['Linux drivers/pci/pci.c (link-up waits)', 'https://github.com/torvalds/linux/blob/master/drivers/pci/pci.c'],
  optrom: ['EDK2 PciOptionRomSupport.c', 'https://github.com/tianocore/edk2/blob/master/MdeModulePkg/Bus/Pci/PciBusDxe/PciOptionRomSupport.c'],
  gop: ['EDK2 GraphicsOutput.h', 'https://github.com/tianocore/edk2/blob/master/MdePkg/Include/Protocol/GraphicsOutput.h'],
  bds: ['EDK2 BdsDxe BdsEntry.c', 'https://github.com/tianocore/edk2/blob/master/MdeModulePkg/Universal/BdsDxe/BdsEntry.c'],
  imgverify: ['EDK2 DxeImageVerificationLib.c', 'https://github.com/tianocore/edk2/blob/master/SecurityPkg/Library/DxeImageVerificationLib/DxeImageVerificationLib.c'],
  efistub: ['Linux EFI stub (x86-stub.c, efi-stub-helper.c)', 'https://github.com/torvalds/linux/tree/master/drivers/firmware/efi/libstub'],
  fpdt: ['Microsoft: BIOS initialization duration (FPDT)', 'https://learn.microsoft.com/en-us/windows-hardware/test/assessments/bios-initialization-duration'],
  endofdxe: ['UEFI PI 1.8 Vol. 2: End of DXE event', 'https://uefi.org/specs/PI/1.8/V2_Services_Boot_Services.html'],
  bdsplatform: ['EDK2 OvmfPkg PlatformBootManagerLib BdsPlatform.c', 'https://github.com/tianocore/edk2/blob/master/OvmfPkg/Library/PlatformBootManagerLib/BdsPlatform.c'],
  defer3rd: ['EDK2 SecurityStubDxe Defer3rdPartyImageLoad.c', 'https://github.com/tianocore/edk2/blob/master/MdeModulePkg/Universal/SecurityStubDxe/Defer3rdPartyImageLoad.c'],
  uefiexec: ['UEFI 2.11 §2.3.4: x64 platforms (calling conventions, execution model)', 'https://uefi.org/specs/UEFI/2.11/02_Overview.html'],
  smmcpu: ['EDK2 PiSmmCpuDxeSmm PiSmmCpuCommon.c', 'https://github.com/tianocore/edk2/blob/master/UefiCpuPkg/PiSmmCpuDxeSmm/PiSmmCpuCommon.c'],
  ms7e06: ['coreboot mainboard msi/ms7e06 (PRO Z790-P WIFI)', 'https://github.com/coreboot/coreboot/tree/main/src/mainboard/msi/ms7e06'],
  ucodeLinux: ['Linux arch/x86/kernel/cpu/microcode/intel.c', 'https://github.com/torvalds/linux/blob/master/arch/x86/kernel/cpu/microcode/intel.c'],
  fritz: ['Die photo: Fritzchens Fritz, CC0 (Wikimedia Commons)', 'https://commons.wikimedia.org/wiki/File:Intel@intel7(10nmESF)@RaptorLake@RPL(8P%2B16E)@i9-13900K@ES_DSCx05_poly@5xExt.jpg'],
}

// Logical-processor index -> is it a P-core sibling thread (thread 1)?
// 0..15 are P-core threads (even = thread 0), 16..31 E-cores (one thread each).
export const isSibling = (i) => i < 16 && i % 2 === 1
export const isPrimary = (i) => !isSibling(i)

// ---- logical-processor helpers -------------------------------------------------
// Index 0 is the bootstrap processor (BSP). Indices 0..15 are the eight
// P-cores' two threads each, 16..31 the sixteen E-cores.
export const all = (m) => () => m
export const bsp = (m, rest = 'wfs') => (i) => (i === 0 ? m : rest)
// A wave across the 31 APs: AP k reaches each entry of `seq` in turn,
// staggered by `spread` of the window so they don't all move at once.
export function wave(p, a, b, seq, { before = 'wfs', bspMode = null, spread = 0.55, order = null } = {}) {
  const q = span(p, a, b)
  return (i) => {
    if (i === 0) return bspMode ?? seq[seq.length - 1]
    const rank = order ? order(i) : (i - 1) / 30
    const local = (q * (1 + spread) - rank * spread) * seq.length
    if (local <= 0) return before
    return seq[Math.min(seq.length - 1, Math.floor(local))]
  }
}

