// PLACEHOLDER floorplan — replaced by the researched one. Same schema.
const blocks = []
const PX = [0.2, 0.3, 0.4, 0.5]
PX.forEach((x, i) => {
  blocks.push({ id: `pcore${i}`, kind: 'pcore', label: `P-core ${i}`, x, y: 0.04, w: 0.095, h: 0.36 })
  blocks.push({ id: `pcore${i + 4}`, kind: 'pcore', label: `P-core ${i + 4}`, x, y: 0.6, w: 0.095, h: 0.36, mirror: { y: true } })
})
for (let k = 0; k < 12; k++) blocks.push({ id: `llc${k}`, kind: 'llc_slice', label: `LLC slice ${k}`, x: 0.2 + k * 0.05, y: 0.42, w: 0.048, h: 0.16 })
blocks.push({ id: 'ecl0', kind: 'ecore_cluster', label: 'E-core cluster 0', x: 0.6, y: 0.04, w: 0.1, h: 0.36 })
blocks.push({ id: 'ecl1', kind: 'ecore_cluster', label: 'E-core cluster 1', x: 0.71, y: 0.04, w: 0.1, h: 0.36 })
blocks.push({ id: 'ecl2', kind: 'ecore_cluster', label: 'E-core cluster 2', x: 0.6, y: 0.6, w: 0.1, h: 0.36, mirror: { y: true } })
blocks.push({ id: 'ecl3', kind: 'ecore_cluster', label: 'E-core cluster 3', x: 0.71, y: 0.6, w: 0.1, h: 0.36, mirror: { y: true } })
blocks.push({ id: 'igpu', kind: 'igpu', label: 'UHD 770 GPU', x: 0.83, y: 0.04, w: 0.16, h: 0.92 })
blocks.push({ id: 'sa', kind: 'system_agent', label: 'System agent', x: 0.07, y: 0.3, w: 0.12, h: 0.4 })
blocks.push({ id: 'imc', kind: 'imc', label: 'Memory controller', x: 0.07, y: 0.04, w: 0.12, h: 0.25 })
blocks.push({ id: 'ddrphy', kind: 'ddr_phy', label: 'DDR5 PHY', x: 0.01, y: 0.04, w: 0.055, h: 0.6 })
blocks.push({ id: 'pciephy', kind: 'pcie_phy', label: 'PCIe PHY', x: 0.01, y: 0.66, w: 0.055, h: 0.3 })
blocks.push({ id: 'dmi', kind: 'dmi', label: 'DMI', x: 0.07, y: 0.72, w: 0.12, h: 0.1 })
blocks.push({ id: 'display', kind: 'display', label: 'Display', x: 0.07, y: 0.84, w: 0.12, h: 0.12 })

export const FLOORPLAN = {
  chip: 'placeholder',
  die_mm: { w: 23.8, h: 10.8 },
  blocks,
  core_internals: {
    pcore: [
      { id: 'fe', kind: 'fe', label: 'Front end', x: 0.05, y: 0.05, w: 0.9, h: 0.22 },
      { id: 'ooo', kind: 'ooo', label: 'Out-of-order engine', x: 0.05, y: 0.28, w: 0.9, h: 0.2 },
      { id: 'exec', kind: 'int', label: 'Execution', x: 0.05, y: 0.49, w: 0.9, h: 0.16 },
      { id: 'l2', kind: 'l2', label: 'L2 2 MB', x: 0.05, y: 0.66, w: 0.9, h: 0.3 },
    ],
    ecore_cluster: [
      { id: 'core0', kind: 'core', label: 'E-core', x: 0.03, y: 0.03, w: 0.45, h: 0.3 },
      { id: 'core1', kind: 'core', label: 'E-core', x: 0.52, y: 0.03, w: 0.45, h: 0.3 },
      { id: 'core2', kind: 'core', label: 'E-core', x: 0.03, y: 0.35, w: 0.45, h: 0.3 },
      { id: 'core3', kind: 'core', label: 'E-core', x: 0.52, y: 0.35, w: 0.45, h: 0.3 },
      { id: 'l2', kind: 'l2', label: 'Shared L2 4 MB', x: 0.03, y: 0.67, w: 0.94, h: 0.3 },
    ],
  },
  ring: {
    path: [[0.15, 0.5], [0.82, 0.5]],
    closed: false,
    stops: [],
  },
}
