// The Raptor Lake-S 8P+16E (Core i9-13900K) die floorplan, measured block by
// block on Fritzchens Fritz's CC0 die photograph and checked by overlaying the
// blocks back onto it, then audited block by block a second time with every
// correction verified independently. Coordinates are fractions of the die (x
// across the long edge from the PCIe/DMI side, y down from the DDR PHY edge) —
// the photograph's frame, i.e. the die seen from its transistor side. Notched
// blocks carry `outline_rects` (x/y/w/h stays the block's core rectangle, which
// a notch or a corner piece can reach past). `wiring` is
// the graph packets travel; `mounting` says how the die sits in the socket.
//
// GENERATED from research/floorplan.json by research/fp2js.py: edit that and
// regenerate (research/FLOORPLAN.md says how it was measured).
//
// Sources:
//   i9-13900K (ES) Raptor Lake 8P+16E poly-layer die shot, 20330x9359 px, '23,413 x 10,791 [252,650] | 22030 dpi'.
//     https://commons.wikimedia.org/wiki/File:Intel@intel7(10nmESF)@RaptorLake@RPL(8P%2B16E)@i9-13900K@ES_DSCx05_poly@5xExt.jpg (CC0 1.0 Universal (public domain dedication))
//   Labelled version of the same photo (14999x6905; pixel-registered with the original). Used for block identities
//     https://commons.wikimedia.org/wiki/File:Intel_Core_i9-13900K_Labelled_Die_Shot.jpg (CC0 1.0)
//   Locuza, Alder Lake-S die walkthrough, using Intel's ADL-S die shot via Redfire. Annotations for display PHY/en
//     https://locuza.substack.com/p/die-walkthrough-alder-lake-sp-and (All rights reserved - reference only, not reproduced)
//   Fritz's area figures: P-core 7.429 mm2 without the new L2, 8.080 with 2 MB L2, 10.068 with L3; E-core 1.588 mm
//     https://wccftech.com/intel-raptor-lake-core-i9-13900k-gets-high-res-beautiful-cpu-die-shot/ (press article - facts only)
//   TechPowerUp's reading of the Raptor Lake die: ring-stop order is half the P-cores, half the E-clusters, iGPU, 
//     https://www.techpowerup.com/news-tags/Ringbus (reference only)
//   Intel's 13th-gen launch 'die' image. Checked: it is the 8P+8E (Alder Lake-S class) die, NOT 8P+16E, so it was 
//     https://happytrees.org/dieshots/Intel_-_Core_(Raptor_Lake) (Intel copyright - reference only)
//   'Intel RaptorLake-S Chip Annotation' drawn on Fritz's photo of this same die (20329x11357: a 2000-px header, t
//     https://nemez.net/die/ (reference only (annotation (c) Nemez; not reproduced))
//   Rotem et al., 'Intel Alder Lake CPU Architectures', Hot Chips 33: slide 11 'Alder Lake I/O' and slide 12 build
//     https://hc33.hotchips.org/assets/program/conference/day1/HC2021.C1.1%20Intel%20Efraim%20Rotem.pdf (Intel copyright, reference only)
//   Locuza, 'Info snack: Alder Lake-M + Raptor Lake-S layout (Mockup)', Aug 2022: a pre-launch RPL-S mockup built 
//     https://locuza.substack.com/p/info-snack-alder-lake-m-raptor-lake (reference only)
//   Intel 13th Gen Core datasheet vol 1 (743844) and its S_LGA_Ballout.xlsx (same land positions as 655258): DDR l
//     https://cdrdv2.intel.com/v1/dl/getContent/743844 (Intel, reference only)
//   Linux i915 (v6.6): RPL-S uses adl_s_display (PORT_A + TC1-TC4 on combo PHYs A-E); intel_dpll_mgr.c adls_plls =
//     https://github.com/torvalds/linux/blob/v6.6/drivers/gpu/drm/i915/display/intel_display_device.c (GPL source, facts only)
//   Mesa intel_device_info_rpl: l3_banks = 4; intel_l3_config.c: 480 KB per bank -> 2 x 960 KB GPU L3 columns.
//     https://gitlab.freedesktop.org/mesa/mesa (MIT source, facts only)
//   Intel Hot Chips 32 Tiger Lake: dual-ring coherent fabric; dedicated isochronous display path (DIP) to memory.
//     https://hc32.hotchips.org/assets/program/conference/day1/HotChips2020_Mobile_Processors_Intel_TigerLake_v3.pdf (Intel, reference only)

export const FLOORPLAN = {
 "chip": "Intel Core i9-13900K - Raptor Lake-S 8P+16E die (B0 stepping; same die in i9-14900K / i7-13700K-class parts), Intel 7, UHD Graphics 770 (32 EU)",
 "die_mm": {
  "w": 23.413,
  "h": 10.791
 },
 "area_mm2": 252.65,
 "blocks": [
  {
   "id": "ddrphy",
   "kind": "ddr_phy",
   "label": "DDR5/DDR4 memory PHY: 10 x16 DQ units + 4 probable CA/CK units in two groups (2 MCs x 2 DDR5 sub-channels of 32+4 ECC bits, or 2 DDR4 channels of 64+8)",
   "x": 0.0063,
   "y": 0.0074,
   "w": 0.5513,
   "h": 0.039,
   "confidence": "high",
   "children_tile": true
  },
  {
   "id": "ddr_phy_a",
   "kind": "ddr_phy_channel",
   "label": "DDR PHY group A (DMI end): 5 x16 DQ units + 2 probable CA/CK units",
   "x": 0.0063,
   "y": 0.0074,
   "w": 0.2591,
   "h": 0.039,
   "confidence": "high",
   "units": 7,
   "parent": "ddrphy"
  },
  {
   "id": "ddr_phy_common",
   "kind": "ddr_phy_common",
   "label": "DDR PHY common block (non-repeating macros; shared clocking/compensation inferred)",
   "x": 0.2654,
   "y": 0.0074,
   "w": 0.0359,
   "h": 0.039,
   "confidence": "medium",
   "parent": "ddrphy"
  },
  {
   "id": "ddr_phy_b",
   "kind": "ddr_phy_channel",
   "label": "DDR PHY group B (GPU side): 2 probable CA/CK units + 5 x16 DQ units",
   "x": 0.3013,
   "y": 0.0074,
   "w": 0.2562,
   "h": 0.039,
   "confidence": "high",
   "units": 7,
   "parent": "ddrphy"
  },
  {
   "id": "imc0",
   "kind": "imc",
   "label": "Memory controller MC0 (of 2): 2 DDR5 sub-channels (32 + 4 ECC bits) or 1 DDR4 channel (64 + 8 ECC); DIMM channel A by convention",
   "x": 0.0969,
   "y": 0.065,
   "w": 0.0518,
   "h": 0.2698,
   "confidence": "medium",
   "outline_rects": [
    [
     0.0969,
     0.065,
     0.0518,
     0.1544
    ],
    [
     0.0969,
     0.2195,
     0.0151,
     0.1154
    ]
   ]
  },
  {
   "id": "imc1",
   "kind": "imc",
   "label": "Memory controller MC1 (of 2): 2 DDR5 sub-channels (32 + 4 ECC bits) or 1 DDR4 channel (64 + 8 ECC); DIMM channel B by convention",
   "x": 0.1487,
   "y": 0.065,
   "w": 0.0521,
   "h": 0.2698,
   "confidence": "medium",
   "outline_rects": [
    [
     0.1487,
     0.065,
     0.0521,
     0.1544
    ],
    [
     0.1854,
     0.2195,
     0.0154,
     0.1154
    ]
   ]
  },
  {
   "id": "imc_shared",
   "kind": "imc_common",
   "label": "Memory-controller lower group (below the per-MC rows; function not identified)",
   "x": 0.112,
   "y": 0.2195,
   "w": 0.0734,
   "h": 0.121,
   "confidence": "medium"
  },
  {
   "id": "sa",
   "kind": "system_agent",
   "label": "System Agent (uncore: IO fabric, coherency, power/clock control) - identity disputed",
   "x": 0.1086,
   "y": 0.349,
   "w": 0.0919,
   "h": 0.1092,
   "confidence": "low",
   "outline_rects": [
    [
     0.1234,
     0.349,
     0.0195,
     0.013
    ],
    [
     0.1667,
     0.349,
     0.0195,
     0.013
    ],
    [
     0.1086,
     0.362,
     0.0919,
     0.043
    ],
    [
     0.1164,
     0.405,
     0.0807,
     0.0334
    ],
    [
     0.1479,
     0.4383,
     0.0492,
     0.0198
    ]
   ]
  },
  {
   "id": "dmi",
   "kind": "dmi",
   "label": "DMI 4.0 x8 PHY (link to the Z690/Z790 PCH)",
   "x": 0.0057,
   "y": 0.0673,
   "w": 0.0469,
   "h": 0.1516,
   "confidence": "high"
  },
  {
   "id": "pcie5",
   "kind": "pcie_phy",
   "label": "PCIe 5.0 x16 PHY (x16 or 2x8)",
   "x": 0.0057,
   "y": 0.2511,
   "w": 0.0521,
   "h": 0.3654,
   "confidence": "high",
   "children_tile": true
  },
  {
   "id": "pcie5_phy_x8a",
   "kind": "pcie_phy_unit",
   "label": "PCIe 5.0 x8 PHY unit (DMI side): 4 lanes + common block + 4 lanes",
   "x": 0.0057,
   "y": 0.2511,
   "w": 0.0521,
   "h": 0.1827,
   "confidence": "high",
   "lanes": 8,
   "parent": "pcie5"
  },
  {
   "id": "pcie5_phy_x8b",
   "kind": "pcie_phy_unit",
   "label": "PCIe 5.0 x8 PHY unit (PCIe 4.0 side): 4 lanes + common block + 4 lanes",
   "x": 0.0057,
   "y": 0.4338,
   "w": 0.0521,
   "h": 0.1827,
   "confidence": "high",
   "lanes": 8,
   "parent": "pcie5"
  },
  {
   "id": "pcie4",
   "kind": "pcie_phy",
   "label": "PCIe 4.0 x4 PHY (CPU-attached M.2)",
   "x": 0.0057,
   "y": 0.6176,
   "w": 0.0469,
   "h": 0.09,
   "confidence": "high"
  },
  {
   "id": "pcie_ctrl",
   "kind": "pcie_ctrl",
   "label": "PCIe 5.0/4.0 + DMI controllers (digital logic)",
   "x": 0.0578,
   "y": 0.065,
   "w": 0.0281,
   "h": 0.5911,
   "confidence": "medium",
   "children_tile": false,
   "outline_rects": [
    [
     0.0536,
     0.065,
     0.0391,
     0.1838
    ],
    [
     0.0578,
     0.2489,
     0.0349,
     0.0204
    ],
    [
     0.0578,
     0.2692,
     0.0344,
     0.0498
    ],
    [
     0.0578,
     0.319,
     0.0306,
     0.1295
    ],
    [
     0.0578,
     0.4485,
     0.0281,
     0.1691
    ],
    [
     0.0526,
     0.6176,
     0.0333,
     0.0399
    ],
    [
     0.0526,
     0.6575,
     0.0052,
     0.0116
    ]
   ]
  },
  {
   "id": "pcie_ctrl_upper",
   "kind": "pcie_ctrl_cluster",
   "label": "PCIe/DMI controller logic, upper cluster (beside the DMI PHY)",
   "x": 0.0552,
   "y": 0.0679,
   "w": 0.0307,
   "h": 0.129,
   "confidence": "medium",
   "parent": "pcie_ctrl"
  },
  {
   "id": "pcie_ctrl_mid",
   "kind": "pcie_ctrl_cluster",
   "label": "PCIe/DMI controller logic, mid cluster (identity unknown)",
   "x": 0.0669,
   "y": 0.2783,
   "w": 0.0237,
   "h": 0.0402,
   "confidence": "low",
   "parent": "pcie_ctrl"
  },
  {
   "id": "pcie_ctrl_lower",
   "kind": "pcie_ctrl_cluster",
   "label": "PCIe/DMI controller logic, lower cluster (beside the PCIe 5.0/4.0 PHYs)",
   "x": 0.0651,
   "y": 0.3326,
   "w": 0.0208,
   "h": 0.3247,
   "confidence": "medium",
   "parent": "pcie_ctrl",
   "outline_rects": [
    [
     0.0651,
     0.3326,
     0.0234,
     0.1114
    ],
    [
     0.0633,
     0.444,
     0.0227,
     0.1725
    ],
    [
     0.0578,
     0.6165,
     0.0281,
     0.0407
    ]
   ]
  },
  {
   "id": "ring_stop_sa",
   "kind": "ring",
   "label": "Ring stop at the System-Agent end (SA <-> ring interface)",
   "x": 0.1612,
   "y": 0.4598,
   "w": 0.0445,
   "h": 0.1222,
   "confidence": "medium",
   "outline_rects": [
    [
     0.1612,
     0.4598,
     0.037,
     0.0209
    ],
    [
     0.1612,
     0.4808,
     0.0417,
     0.017
    ],
    [
     0.1612,
     0.4977,
     0.0445,
     0.056
    ],
    [
     0.1695,
     0.5537,
     0.0362,
     0.0283
    ]
   ]
  },
  {
   "id": "uncore_misc",
   "kind": "other",
   "label": "Uncore logic, unidentified (GNA 3.0 probably here)",
   "x": 0.0859,
   "y": 0.4587,
   "w": 0.0755,
   "h": 0.2381,
   "confidence": "low",
   "outline_rects": [
    [
     0.0859,
     0.4587,
     0.0755,
     0.1988
    ],
    [
     0.138,
     0.6575,
     0.0234,
     0.0393
    ]
   ]
  },
  {
   "id": "uncore_misc2",
   "kind": "other",
   "label": "Uncore logic, unidentified",
   "x": 0.1615,
   "y": 0.5854,
   "w": 0.0401,
   "h": 0.1114,
   "confidence": "low"
  },
  {
   "id": "fivr_sa",
   "kind": "fivr",
   "label": "FIVR (fully integrated voltage regulator) beside the System Agent",
   "x": 0.089,
   "y": 0.3939,
   "w": 0.0143,
   "h": 0.0556,
   "confidence": "medium",
   "outline_rects": [
    [
     0.089,
     0.3939,
     0.0075,
     0.0256
    ],
    [
     0.089,
     0.4195,
     0.0143,
     0.03
    ]
   ]
  },
  {
   "id": "display",
   "kind": "display",
   "label": "Display engine (4 display pipes)",
   "x": 0.0544,
   "y": 0.6968,
   "w": 0.1474,
   "h": 0.2203,
   "confidence": "high",
   "outline_rects": [
    [
     0.0626,
     0.6968,
     0.1392,
     0.0503
    ],
    [
     0.0544,
     0.7472,
     0.1474,
     0.0837
    ],
    [
     0.0544,
     0.8309,
     0.1408,
     0.0863
    ]
   ]
  },
  {
   "id": "fivr_disp_l",
   "kind": "fivr",
   "label": "FIVR (fully integrated voltage regulator) left of the display engine",
   "x": 0.0395,
   "y": 0.7472,
   "w": 0.0148,
   "h": 0.1691,
   "confidence": "medium",
   "outline_rects": [
    [
     0.0471,
     0.7472,
     0.0072,
     0.0469
    ],
    [
     0.0395,
     0.7941,
     0.0148,
     0.1222
    ]
   ]
  },
  {
   "id": "fivr_disp_r",
   "kind": "fivr",
   "label": "FIVR (fully integrated voltage regulator) at the right edge of the display engine",
   "x": 0.1952,
   "y": 0.8309,
   "w": 0.0069,
   "h": 0.0865,
   "confidence": "medium"
  },
  {
   "id": "display_phy",
   "kind": "display_phy",
   "label": "Display PHYs: 5 combo PHY ports (DDI A + TC1-TC4 = PHY A-E per i915) + 4 display PLL macros (likely DPLL0-3)",
   "x": 0.0619,
   "y": 0.927,
   "w": 0.1308,
   "h": 0.0605,
   "confidence": "high",
   "children_tile": true
  },
  {
   "id": "display_phy_a",
   "kind": "display_phy_port",
   "label": "Display PHY x2 (DDI combo PHY ports)",
   "x": 0.0619,
   "y": 0.927,
   "w": 0.0414,
   "h": 0.0605,
   "confidence": "high",
   "units": 2,
   "parent": "display_phy"
  },
  {
   "id": "display_pll",
   "kind": "display_pll",
   "label": "Display clock generators x4 (PLL macros, likely DPLL0-3)",
   "x": 0.1033,
   "y": 0.927,
   "w": 0.0274,
   "h": 0.0605,
   "confidence": "high",
   "parent": "display_phy"
  },
  {
   "id": "display_phy_b",
   "kind": "display_phy_port",
   "label": "Display PHY x3 (DDI combo PHY ports)",
   "x": 0.1307,
   "y": 0.927,
   "w": 0.062,
   "h": 0.0605,
   "confidence": "high",
   "units": 3,
   "parent": "display_phy"
  },
  {
   "id": "misc_io",
   "kind": "misc_io",
   "label": "Sideband / strap / debug I/O (probable): CFG straps, JTAG, BPM#, PREQ#/PRDY#, PM_SYNC/PM_DOWN, RTC_CLK, CATERR#",
   "x": 0.0057,
   "y": 0.7395,
   "w": 0.0302,
   "h": 0.1615,
   "confidence": "low"
  },
  {
   "id": "misc_io_b",
   "kind": "misc_io",
   "label": "Small macros at the SW corner (probably reference-clock receivers and sideband support; unidentified)",
   "x": 0.0057,
   "y": 0.9021,
   "w": 0.0539,
   "h": 0.0865,
   "confidence": "low",
   "outline_rects": [
    [
     0.0057,
     0.9021,
     0.0337,
     0.0187
    ],
    [
     0.0057,
     0.9208,
     0.0539,
     0.0679
    ]
   ]
  },
  {
   "id": "pcore0",
   "kind": "pcore",
   "label": "P-core 0 (Raptor Cove) + 2 MB L2",
   "x": 0.2012,
   "y": 0.0679,
   "w": 0.0966,
   "h": 0.3009,
   "confidence": "high",
   "outline_rects": [
    [
     0.2012,
     0.0679,
     0.0966,
     0.3009
    ],
    [
     0.2221,
     0.3688,
     0.0737,
     0.0215
    ],
    [
     0.2221,
     0.3903,
     0.0531,
     0.0311
    ]
   ]
  },
  {
   "id": "llc0",
   "kind": "llc_slice",
   "label": "LLC slice 0 (3 MB) - P-core column 0, top",
   "x": 0.2008,
   "y": 0.3688,
   "w": 0.093,
   "h": 0.1097,
   "confidence": "high",
   "outline_rects": [
    [
     0.2008,
     0.3688,
     0.0214,
     0.0215
    ],
    [
     0.2008,
     0.3903,
     0.0214,
     0.0311
    ],
    [
     0.2753,
     0.3903,
     0.0185,
     0.0311
    ],
    [
     0.2008,
     0.4214,
     0.093,
     0.0571
    ]
   ]
  },
  {
   "id": "pcore1",
   "kind": "pcore",
   "label": "P-core 1 (Raptor Cove) + 2 MB L2",
   "x": 0.2978,
   "y": 0.0679,
   "w": 0.0966,
   "h": 0.3009,
   "confidence": "high",
   "outline_rects": [
    [
     0.2978,
     0.0679,
     0.0966,
     0.3009
    ],
    [
     0.3187,
     0.3688,
     0.0737,
     0.0215
    ],
    [
     0.3187,
     0.3903,
     0.0531,
     0.0311
    ]
   ]
  },
  {
   "id": "llc1",
   "kind": "llc_slice",
   "label": "LLC slice 1 (3 MB) - P-core column 1, top",
   "x": 0.2977,
   "y": 0.3688,
   "w": 0.0927,
   "h": 0.1097,
   "confidence": "high",
   "outline_rects": [
    [
     0.2977,
     0.3688,
     0.0211,
     0.0215
    ],
    [
     0.2977,
     0.3903,
     0.0211,
     0.0311
    ],
    [
     0.3719,
     0.3903,
     0.0185,
     0.0311
    ],
    [
     0.2977,
     0.4214,
     0.0927,
     0.0571
    ]
   ]
  },
  {
   "id": "pcore2",
   "kind": "pcore",
   "label": "P-core 2 (Raptor Cove) + 2 MB L2",
   "x": 0.3944,
   "y": 0.0679,
   "w": 0.0966,
   "h": 0.3009,
   "confidence": "high",
   "outline_rects": [
    [
     0.3944,
     0.0679,
     0.0966,
     0.3009
    ],
    [
     0.4154,
     0.3688,
     0.0737,
     0.0215
    ],
    [
     0.4154,
     0.3903,
     0.0531,
     0.0311
    ]
   ]
  },
  {
   "id": "llc2",
   "kind": "llc_slice",
   "label": "LLC slice 2 (3 MB) - P-core column 2, top",
   "x": 0.3943,
   "y": 0.3688,
   "w": 0.0927,
   "h": 0.1097,
   "confidence": "high",
   "outline_rects": [
    [
     0.3943,
     0.3688,
     0.0211,
     0.0215
    ],
    [
     0.3943,
     0.3903,
     0.0211,
     0.0311
    ],
    [
     0.4685,
     0.3903,
     0.0185,
     0.0311
    ],
    [
     0.3943,
     0.4214,
     0.0927,
     0.0571
    ]
   ]
  },
  {
   "id": "pcore3",
   "kind": "pcore",
   "label": "P-core 3 (Raptor Cove) + 2 MB L2",
   "x": 0.491,
   "y": 0.0679,
   "w": 0.0966,
   "h": 0.3009,
   "confidence": "high",
   "outline_rects": [
    [
     0.491,
     0.0679,
     0.0966,
     0.3009
    ],
    [
     0.512,
     0.3688,
     0.0737,
     0.0215
    ],
    [
     0.512,
     0.3903,
     0.0531,
     0.0311
    ]
   ]
  },
  {
   "id": "llc3",
   "kind": "llc_slice",
   "label": "LLC slice 3 (3 MB) - P-core column 3, top",
   "x": 0.4909,
   "y": 0.3688,
   "w": 0.0927,
   "h": 0.1097,
   "confidence": "high",
   "outline_rects": [
    [
     0.4909,
     0.3688,
     0.0211,
     0.0215
    ],
    [
     0.4909,
     0.3903,
     0.0211,
     0.0311
    ],
    [
     0.5651,
     0.3903,
     0.0185,
     0.0311
    ],
    [
     0.4909,
     0.4214,
     0.0927,
     0.0571
    ]
   ]
  },
  {
   "id": "pcore4",
   "kind": "pcore",
   "label": "P-core 4 (Raptor Cove) + 2 MB L2",
   "x": 0.2021,
   "y": 0.6912,
   "w": 0.0964,
   "h": 0.3009,
   "confidence": "high",
   "outline_rects": [
    [
     0.2245,
     0.6403,
     0.0531,
     0.0294
    ],
    [
     0.2039,
     0.6697,
     0.0737,
     0.0215
    ],
    [
     0.2021,
     0.6912,
     0.0964,
     0.3009
    ]
   ],
   "mirror": {
    "x": true,
    "y": true
   }
  },
  {
   "id": "llc4",
   "kind": "llc_slice",
   "label": "LLC slice 4 (3 MB) - P-core column 0, bottom",
   "x": 0.206,
   "y": 0.5831,
   "w": 0.0924,
   "h": 0.108,
   "confidence": "high",
   "outline_rects": [
    [
     0.206,
     0.5831,
     0.0924,
     0.0571
    ],
    [
     0.206,
     0.6403,
     0.0185,
     0.0294
    ],
    [
     0.2776,
     0.6403,
     0.0208,
     0.0294
    ],
    [
     0.2776,
     0.6697,
     0.0208,
     0.0215
    ]
   ]
  },
  {
   "id": "pcore5",
   "kind": "pcore",
   "label": "P-core 5 (Raptor Cove) + 2 MB L2",
   "x": 0.2987,
   "y": 0.6912,
   "w": 0.0964,
   "h": 0.3009,
   "confidence": "high",
   "outline_rects": [
    [
     0.3211,
     0.6403,
     0.0531,
     0.0294
    ],
    [
     0.3005,
     0.6697,
     0.0737,
     0.0215
    ],
    [
     0.2987,
     0.6912,
     0.0964,
     0.3009
    ]
   ],
   "mirror": {
    "x": true,
    "y": true
   }
  },
  {
   "id": "llc5",
   "kind": "llc_slice",
   "label": "LLC slice 5 (3 MB) - P-core column 1, bottom",
   "x": 0.3026,
   "y": 0.5831,
   "w": 0.0924,
   "h": 0.108,
   "confidence": "high",
   "outline_rects": [
    [
     0.3026,
     0.5831,
     0.0924,
     0.0571
    ],
    [
     0.3026,
     0.6403,
     0.0185,
     0.0294
    ],
    [
     0.3742,
     0.6403,
     0.0208,
     0.0294
    ],
    [
     0.3742,
     0.6697,
     0.0208,
     0.0215
    ]
   ]
  },
  {
   "id": "pcore6",
   "kind": "pcore",
   "label": "P-core 6 (Raptor Cove) + 2 MB L2",
   "x": 0.3953,
   "y": 0.6912,
   "w": 0.0964,
   "h": 0.3009,
   "confidence": "high",
   "outline_rects": [
    [
     0.4177,
     0.6403,
     0.0531,
     0.0294
    ],
    [
     0.3971,
     0.6697,
     0.0737,
     0.0215
    ],
    [
     0.3953,
     0.6912,
     0.0964,
     0.3009
    ]
   ],
   "mirror": {
    "x": true,
    "y": true
   }
  },
  {
   "id": "llc6",
   "kind": "llc_slice",
   "label": "LLC slice 6 (3 MB) - P-core column 2, bottom",
   "x": 0.3992,
   "y": 0.5831,
   "w": 0.0924,
   "h": 0.108,
   "confidence": "high",
   "outline_rects": [
    [
     0.3992,
     0.5831,
     0.0924,
     0.0571
    ],
    [
     0.3992,
     0.6403,
     0.0185,
     0.0294
    ],
    [
     0.4708,
     0.6403,
     0.0208,
     0.0294
    ],
    [
     0.4708,
     0.6697,
     0.0208,
     0.0215
    ]
   ]
  },
  {
   "id": "pcore7",
   "kind": "pcore",
   "label": "P-core 7 (Raptor Cove) + 2 MB L2",
   "x": 0.4919,
   "y": 0.6912,
   "w": 0.0964,
   "h": 0.3009,
   "confidence": "high",
   "outline_rects": [
    [
     0.5143,
     0.6403,
     0.0531,
     0.0294
    ],
    [
     0.4938,
     0.6697,
     0.0737,
     0.0215
    ],
    [
     0.4919,
     0.6912,
     0.0964,
     0.3009
    ]
   ],
   "mirror": {
    "x": true,
    "y": true
   }
  },
  {
   "id": "llc7",
   "kind": "llc_slice",
   "label": "LLC slice 7 (3 MB) - P-core column 3, bottom",
   "x": 0.4958,
   "y": 0.5831,
   "w": 0.0924,
   "h": 0.108,
   "confidence": "high",
   "outline_rects": [
    [
     0.4958,
     0.5831,
     0.0924,
     0.0571
    ],
    [
     0.4958,
     0.6403,
     0.0185,
     0.0294
    ],
    [
     0.5674,
     0.6403,
     0.0209,
     0.0294
    ],
    [
     0.5674,
     0.6697,
     0.0209,
     0.0215
    ]
   ]
  },
  {
   "id": "ecl0",
   "kind": "ecore_cluster",
   "label": "E-core cluster 0 (top-left): 4x Gracemont + 4 MB shared L2",
   "x": 0.5878,
   "y": 0.0877,
   "w": 0.1265,
   "h": 0.2969,
   "confidence": "high"
  },
  {
   "id": "ecl1",
   "kind": "ecore_cluster",
   "label": "E-core cluster 1 (top-right): 4x Gracemont + 4 MB shared L2",
   "x": 0.7146,
   "y": 0.0877,
   "w": 0.1265,
   "h": 0.2969,
   "confidence": "high"
  },
  {
   "id": "ecl2",
   "kind": "ecore_cluster",
   "label": "E-core cluster 2 (bottom-left): 4x Gracemont + 4 MB shared L2",
   "x": 0.5888,
   "y": 0.677,
   "w": 0.1266,
   "h": 0.297,
   "confidence": "high",
   "mirror": {
    "x": true,
    "y": true
   }
  },
  {
   "id": "ecl3",
   "kind": "ecore_cluster",
   "label": "E-core cluster 3 (bottom-right): 4x Gracemont + 4 MB shared L2",
   "x": 0.7156,
   "y": 0.677,
   "w": 0.1263,
   "h": 0.297,
   "confidence": "high",
   "mirror": {
    "x": true,
    "y": true
   }
  },
  {
   "id": "llc8",
   "kind": "llc_slice",
   "label": "LLC slice 8 (3 MB) - ecluster0 column",
   "x": 0.5893,
   "y": 0.405,
   "w": 0.0922,
   "h": 0.0735,
   "confidence": "high",
   "outline_rects": [
    [
     0.5893,
     0.405,
     0.0737,
     0.015
    ],
    [
     0.5893,
     0.42,
     0.0922,
     0.0585
    ]
   ]
  },
  {
   "id": "llc9",
   "kind": "llc_slice",
   "label": "LLC slice 9 (3 MB) - ecluster1 column",
   "x": 0.7148,
   "y": 0.405,
   "w": 0.0922,
   "h": 0.0735,
   "confidence": "high",
   "outline_rects": [
    [
     0.7148,
     0.405,
     0.0737,
     0.0158
    ],
    [
     0.7148,
     0.4208,
     0.0922,
     0.0577
    ]
   ]
  },
  {
   "id": "llc10",
   "kind": "llc_slice",
   "label": "LLC slice 10 (3 MB) - ecluster2 column",
   "x": 0.5935,
   "y": 0.5831,
   "w": 0.0922,
   "h": 0.073,
   "confidence": "high",
   "outline_rects": [
    [
     0.5935,
     0.5831,
     0.0922,
     0.058
    ],
    [
     0.612,
     0.6411,
     0.0737,
     0.015
    ]
   ]
  },
  {
   "id": "llc11",
   "kind": "llc_slice",
   "label": "LLC slice 11 (3 MB) - ecluster3 column",
   "x": 0.719,
   "y": 0.5831,
   "w": 0.0922,
   "h": 0.073,
   "confidence": "high",
   "outline_rects": [
    [
     0.719,
     0.5831,
     0.0922,
     0.0568
    ],
    [
     0.7375,
     0.64,
     0.0737,
     0.0161
    ]
   ]
  },
  {
   "id": "ring_p0",
   "kind": "ring",
   "label": "Ring agents for column P0: 2 mirrored ring-stop/CBo units (pcore0+llc0, pcore4+llc4)",
   "x": 0.2078,
   "y": 0.4813,
   "w": 0.0839,
   "h": 0.0985,
   "confidence": "high"
  },
  {
   "id": "ring_p1",
   "kind": "ring",
   "label": "Ring agents for column P1: 2 mirrored ring-stop/CBo units (pcore1+llc1, pcore5+llc5)",
   "x": 0.3044,
   "y": 0.4813,
   "w": 0.0839,
   "h": 0.0985,
   "confidence": "high"
  },
  {
   "id": "ring_p2",
   "kind": "ring",
   "label": "Ring agents for column P2: 2 mirrored ring-stop/CBo units (pcore2+llc2, pcore6+llc6)",
   "x": 0.401,
   "y": 0.4813,
   "w": 0.0839,
   "h": 0.0985,
   "confidence": "high"
  },
  {
   "id": "ring_p3",
   "kind": "ring",
   "label": "Ring agents for column P3: 2 mirrored ring-stop/CBo units (pcore3+llc3, pcore7+llc7)",
   "x": 0.4977,
   "y": 0.4813,
   "w": 0.0838,
   "h": 0.0985,
   "confidence": "high"
  },
  {
   "id": "ring_e0",
   "kind": "ring",
   "label": "Ring agents for column E0: 2 mirrored ring-stop/CBo units (ecluster0+llc8, ecluster2+llc10)",
   "x": 0.5956,
   "y": 0.4813,
   "w": 0.0841,
   "h": 0.0985,
   "confidence": "high"
  },
  {
   "id": "ring_e1",
   "kind": "ring",
   "label": "Ring agents for column E1: 2 mirrored ring-stop/CBo units (ecluster1+llc9, ecluster3+llc11)",
   "x": 0.7211,
   "y": 0.4813,
   "w": 0.084,
   "h": 0.0985,
   "confidence": "high"
  },
  {
   "id": "ring_stop_gt",
   "kind": "ring",
   "label": "Ring stop at the iGPU end (right end of the ring)",
   "x": 0.807,
   "y": 0.474,
   "w": 0.0109,
   "h": 0.1058,
   "confidence": "medium",
   "outline_rects": [
    [
     0.8086,
     0.474,
     0.0094,
     0.0074
    ],
    [
     0.807,
     0.4813,
     0.0109,
     0.0877
    ],
    [
     0.807,
     0.569,
     0.0063,
     0.0107
    ]
   ]
  },
  {
   "id": "igpu",
   "kind": "igpu",
   "label": "Integrated GPU complex: Intel UHD Graphics 770 (Xe-LP, 32 EU) incl. media",
   "x": 0.8427,
   "y": 0.0583,
   "w": 0.1516,
   "h": 0.8976,
   "confidence": "high"
  },
  {
   "id": "media0",
   "kind": "media",
   "label": "Media engine 0 (video decode/encode)",
   "x": 0.8427,
   "y": 0.1086,
   "w": 0.0766,
   "h": 0.3501,
   "confidence": "high",
   "outline_rects": [
    [
     0.8427,
     0.1086,
     0.0766,
     0.2862
    ],
    [
     0.8427,
     0.3948,
     0.0391,
     0.056
    ],
    [
     0.851,
     0.4508,
     0.0307,
     0.0079
    ]
   ]
  },
  {
   "id": "media1",
   "kind": "media",
   "label": "Media engine 1 (video decode/encode)",
   "x": 0.8427,
   "y": 0.6063,
   "w": 0.0766,
   "h": 0.3495,
   "confidence": "high",
   "outline_rects": [
    [
     0.851,
     0.6063,
     0.0307,
     0.0107
    ],
    [
     0.8427,
     0.6171,
     0.0391,
     0.0532
    ],
    [
     0.8427,
     0.6703,
     0.0766,
     0.2856
    ]
   ]
  },
  {
   "id": "gpu_global",
   "kind": "igpu",
   "label": "GPU global assets (GAM + GTI: the GPU's interface to the ring)",
   "x": 0.8427,
   "y": 0.4587,
   "w": 0.0391,
   "h": 0.1476,
   "confidence": "medium",
   "outline_rects": [
    [
     0.851,
     0.4587,
     0.0307,
     0.0147
    ],
    [
     0.8427,
     0.4734,
     0.0391,
     0.1182
    ],
    [
     0.851,
     0.5916,
     0.0307,
     0.0147
    ]
   ]
  },
  {
   "id": "gpu_common",
   "kind": "igpu",
   "label": "GPU unslice + slice common (command streamer and geometry front end, rasterizer, pixel back end/ROPs, L3 control)",
   "x": 0.8818,
   "y": 0.3699,
   "w": 0.1125,
   "h": 0.3003,
   "confidence": "high",
   "children_tile": false,
   "outline_rects": [
    [
     0.9201,
     0.3699,
     0.0193,
     0.0068
    ],
    [
     0.9201,
     0.3767,
     0.0742,
     0.0181
    ],
    [
     0.8818,
     0.3948,
     0.1125,
     0.2426
    ],
    [
     0.8818,
     0.6374,
     0.0576,
     0.0266
    ],
    [
     0.8818,
     0.664,
     0.0383,
     0.0062
    ]
   ]
  },
  {
   "id": "gpu_unslice",
   "kind": "gpu_unslice",
   "label": "GPU unslice (command streamer, global thread dispatch, geometry fixed-function front end)",
   "x": 0.8818,
   "y": 0.3948,
   "w": 0.038,
   "h": 0.2025,
   "confidence": "low",
   "parent": "gpu_common"
  },
  {
   "id": "gpu_l3_top",
   "kind": "igpu",
   "label": "GPU L3 cache, 960 KB (2 x 480 KB banks)",
   "x": 0.9201,
   "y": 0.1086,
   "w": 0.019,
   "h": 0.2613,
   "confidence": "high"
  },
  {
   "id": "gpu_l3_bot",
   "kind": "igpu",
   "label": "GPU L3 cache, 960 KB (2 x 480 KB banks)",
   "x": 0.9201,
   "y": 0.664,
   "w": 0.019,
   "h": 0.2613,
   "confidence": "high"
  },
  {
   "id": "gpu_eu0",
   "kind": "igpu",
   "label": "GPU subslice 0: 16 EUs (8 EU pairs)",
   "x": 0.9393,
   "y": 0.0583,
   "w": 0.055,
   "h": 0.1459,
   "confidence": "high"
  },
  {
   "id": "gpu_tmu0",
   "kind": "igpu",
   "label": "GPU subslice 0, non-EU block: texture & media samplers (8 TMUs) + L1/texture cache + SLM",
   "x": 0.9393,
   "y": 0.2042,
   "w": 0.0549,
   "h": 0.1725,
   "confidence": "high"
  },
  {
   "id": "gpu_tmu1",
   "kind": "igpu",
   "label": "GPU subslice 1, non-EU block: texture & media samplers (8 TMUs) + L1/texture cache + SLM",
   "x": 0.9393,
   "y": 0.6374,
   "w": 0.0549,
   "h": 0.1702,
   "confidence": "high"
  },
  {
   "id": "gpu_eu1",
   "kind": "igpu",
   "label": "GPU subslice 1: 16 EUs (8 EU pairs)",
   "x": 0.9393,
   "y": 0.8077,
   "w": 0.055,
   "h": 0.1471,
   "confidence": "high"
  },
  {
   "id": "analog0",
   "kind": "fivr",
   "label": "FIVR (fully integrated voltage regulator), single instance on the top edge; rail unidentified",
   "x": 0.599,
   "y": 0.0147,
   "w": 0.0146,
   "h": 0.0554,
   "confidence": "medium",
   "outline_rects": [
    [
     0.5991,
     0.0147,
     0.0072,
     0.0252
    ],
    [
     0.5991,
     0.0399,
     0.0143,
     0.0303
    ]
   ]
  },
  {
   "id": "analog1",
   "kind": "fivr",
   "label": "FIVR pair (2 mirrored instances) on the top edge, probably the E-core L2 rail",
   "x": 0.6656,
   "y": 0.0147,
   "w": 0.0289,
   "h": 0.0554,
   "confidence": "medium",
   "outline_rects": [
    [
     0.6727,
     0.0147,
     0.0148,
     0.0252
    ],
    [
     0.6656,
     0.0399,
     0.0289,
     0.0303
    ]
   ]
  },
  {
   "id": "analog2",
   "kind": "fivr",
   "label": "FIVR pair (2 mirrored instances) on the top edge, probably the E-core L2 rail",
   "x": 0.7922,
   "y": 0.0147,
   "w": 0.029,
   "h": 0.0554,
   "confidence": "medium",
   "outline_rects": [
    [
     0.7993,
     0.0147,
     0.0148,
     0.0252
    ],
    [
     0.7923,
     0.0399,
     0.0289,
     0.0303
    ]
   ]
  },
  {
   "id": "gt_stop_aux",
   "kind": "other",
   "label": "Companion of the GT ring stop (unidentified)",
   "x": 0.812,
   "y": 0.582,
   "w": 0.007,
   "h": 0.0345,
   "confidence": "low"
  },
  {
   "id": "gt_gap_macros_top",
   "kind": "other",
   "label": "Three stacked macros between the ring end and the iGPU (unidentified)",
   "x": 0.8276,
   "y": 0.388,
   "w": 0.0133,
   "h": 0.0447,
   "confidence": "low"
  },
  {
   "id": "gt_gap_macros_bot",
   "kind": "other",
   "label": "Macro group between the ring end and the iGPU (unidentified)",
   "x": 0.8346,
   "y": 0.6159,
   "w": 0.0078,
   "h": 0.0549,
   "confidence": "low"
  },
  {
   "id": "gt_left_macro",
   "kind": "other",
   "label": "Framed macro at the iGPU left edge (unidentified)",
   "x": 0.8432,
   "y": 0.5967,
   "w": 0.0073,
   "h": 0.0204,
   "confidence": "low"
  },
  {
   "id": "ring_gap_p3e0",
   "kind": "other",
   "label": "Logic macro in the ring band between P-core 3 and E-cluster 0 (unidentified; the same unit repeats in every column gap)",
   "x": 0.5836,
   "y": 0.4972,
   "w": 0.0076,
   "h": 0.0356,
   "confidence": "low"
  },
  {
   "id": "ring_gap_p3e0_strip_t",
   "kind": "other",
   "label": "Thin SRAM-like strip in the LLC row (unidentified)",
   "x": 0.5844,
   "y": 0.4203,
   "w": 0.0037,
   "h": 0.0583,
   "confidence": "low"
  },
  {
   "id": "ring_gap_p3e0_strip_b",
   "kind": "other",
   "label": "Thin SRAM-like strip in the LLC row (unidentified)",
   "x": 0.5885,
   "y": 0.5837,
   "w": 0.0031,
   "h": 0.0571,
   "confidence": "low"
  },
  {
   "id": "ring_gap_e0e1",
   "kind": "other",
   "label": "Logic macro in the ring band between E-clusters 0 and 1 (unidentified)",
   "x": 0.6953,
   "y": 0.4972,
   "w": 0.0076,
   "h": 0.0362,
   "confidence": "low"
  },
  {
   "id": "ring_gap_e0e1_strip_t",
   "kind": "other",
   "label": "Thin SRAM-like strip in the LLC row (unidentified)",
   "x": 0.6964,
   "y": 0.4214,
   "w": 0.0034,
   "h": 0.056,
   "confidence": "low"
  },
  {
   "id": "ring_gap_e0e1_strip_b",
   "kind": "other",
   "label": "Thin SRAM-like strip in the LLC row (unidentified)",
   "x": 0.6997,
   "y": 0.5837,
   "w": 0.0031,
   "h": 0.0554,
   "confidence": "low"
  }
 ],
 "core_internals": {
  "pcore": [
   {
    "id": "power_gates",
    "label": "Power-gate stripe (core power switches)",
    "x": 0.0,
    "y": 0.0,
    "w": 0.036,
    "h": 0.891
   },
   {
    "id": "power_gates_inner",
    "label": "Power-gate stripe, inner column (mirror twin of the outer one)",
    "x": 0.036,
    "y": 0.285,
    "w": 0.028,
    "h": 0.606
   },
   {
    "id": "fma",
    "label": "FMA / vector execution units (ports 0 & 1)",
    "x": 0.035,
    "y": 0.0,
    "w": 0.187,
    "h": 0.277
   },
   {
    "id": "fpu",
    "label": "FPU / SIMD execution",
    "x": 0.222,
    "y": 0.0,
    "w": 0.296,
    "h": 0.284
   },
   {
    "id": "fp_regs",
    "label": "FP/vector register files",
    "x": 0.518,
    "y": 0.0,
    "w": 0.142,
    "h": 0.277
   },
   {
    "id": "ooo",
    "label": "Out-of-order scheduling, rename & retirement (ROB)",
    "x": 0.66,
    "y": 0.0,
    "w": 0.34,
    "h": 0.337
   },
   {
    "id": "decode",
    "label": "Instruction decode",
    "x": 0.616,
    "y": 0.337,
    "w": 0.384,
    "h": 0.288,
    "outline_rects": [
     [
      0.66,
      0.4625,
      0.34,
      0.0015
     ],
     [
      0.66,
      0.337,
      0.0637,
      0.1255
     ],
     [
      0.8423,
      0.337,
      0.1577,
      0.1255
     ],
     [
      0.616,
      0.464,
      0.384,
      0.127
     ],
     [
      0.705,
      0.591,
      0.295,
      0.008
     ],
     [
      0.705,
      0.599,
      0.125,
      0.026
     ]
    ]
   },
   {
    "id": "int_exec",
    "label": "Integer execution",
    "x": 0.068,
    "y": 0.284,
    "w": 0.445,
    "h": 0.128
   },
   {
    "id": "int_regs",
    "label": "Integer register file",
    "x": 0.518,
    "y": 0.31,
    "w": 0.142,
    "h": 0.1
   },
   {
    "id": "ucode_opcache",
    "label": "Microcode ROM + 4K-uop op cache",
    "x": 0.7237,
    "y": 0.2914,
    "w": 0.1186,
    "h": 0.1711
   },
   {
    "id": "l1d",
    "label": "48 KB L1 data cache",
    "x": 0.066,
    "y": 0.398,
    "w": 0.14,
    "h": 0.134
   },
   {
    "id": "load_store",
    "label": "Load/store units + L1D control",
    "x": 0.215,
    "y": 0.412,
    "w": 0.401,
    "h": 0.277
   },
   {
    "id": "l1i",
    "label": "32 KB L1 instruction cache",
    "x": 0.612,
    "y": 0.591,
    "w": 0.093,
    "h": 0.087
   },
   {
    "id": "branch",
    "label": "Branch prediction",
    "x": 0.704,
    "y": 0.599,
    "w": 0.296,
    "h": 0.401,
    "outline_rects": [
     [
      0.83,
      0.599,
      0.17,
      0.078
     ],
     [
      0.77,
      0.677,
      0.23,
      0.043
     ],
     [
      0.704,
      0.72,
      0.296,
      0.28
     ]
    ]
   },
   {
    "id": "l1i_ctl",
    "label": "L1I tags",
    "x": 0.705,
    "y": 0.625,
    "w": 0.125,
    "h": 0.095,
    "outline_rects": [
     [
      0.705,
      0.625,
      0.125,
      0.052
     ],
     [
      0.705,
      0.677,
      0.065,
      0.043
     ]
    ]
   },
   {
    "id": "l2",
    "label": "L2: 2 x 640 KB partitions + tags + control (1.25 MB of the 2 MB)",
    "x": 0.066,
    "y": 0.689,
    "w": 0.638,
    "h": 0.311
   },
   {
    "id": "l2_ctl",
    "kind": "sram",
    "label": "L2 control arrays (Locuza ADL-S: part of 'L2$/MLC & Control'; function unverified)",
    "x": 0.067,
    "y": 0.602,
    "w": 0.142,
    "h": 0.106
   },
   {
    "id": "l2_tags",
    "kind": "l2",
    "label": "L2 tag/state array column",
    "x": 0.705,
    "y": 0.869,
    "w": 0.047,
    "h": 0.131
   },
   {
    "id": "l2_ext",
    "label": "L2 extension: 576 KB + 192 KB partitions + tags (0.75 MB; Raptor Cove's 1.25 -> 2 MB growth)",
    "x": 0.217,
    "y": 1.0,
    "w": 0.55,
    "h": 0.175
   },
   {
    "id": "core_ext",
    "label": "Core corner piece in the LLC band (may include clock-driver circuitry, per Locuza; ~0.1 mm2 on Golden Cove)",
    "x": 0.767,
    "y": 1.0,
    "w": 0.213,
    "h": 0.071
   }
  ],
  "ecore_cluster": [
   {
    "id": "l2",
    "label": "Shared 4 MB L2 (cluster)",
    "x": 0.004,
    "y": 0.0,
    "w": 0.992,
    "h": 0.19
   },
   {
    "id": "core_tl",
    "label": "Gracemont core (top-left)",
    "x": 0.0,
    "y": 0.196,
    "w": 0.431,
    "h": 0.398
   },
   {
    "id": "core_tr",
    "label": "Gracemont core (top-right; L/R mirror of core_tl)",
    "x": 0.569,
    "y": 0.196,
    "w": 0.431,
    "h": 0.398
   },
   {
    "id": "core_bl",
    "label": "Gracemont core (bottom-left; T/B mirror of core_tl)",
    "x": 0.0,
    "y": 0.598,
    "w": 0.431,
    "h": 0.398
   },
   {
    "id": "core_br",
    "label": "Gracemont core (bottom-right)",
    "x": 0.569,
    "y": 0.598,
    "w": 0.431,
    "h": 0.398
   },
   {
    "id": "spine",
    "label": "Cluster spine: L2 tags + L2 control + cluster interconnect / ring interface (container of spine_l2tags / spine_l2ctl / spine_ccx)",
    "x": 0.431,
    "y": 0.196,
    "w": 0.138,
    "h": 0.772
   },
   {
    "id": "spine_l2tags",
    "label": "L2 tag arrays (SRAM)",
    "x": 0.431,
    "y": 0.196,
    "w": 0.138,
    "h": 0.22
   },
   {
    "id": "spine_l2ctl",
    "label": "L2 control + small arrays (TLB?)",
    "x": 0.431,
    "y": 0.416,
    "w": 0.138,
    "h": 0.109
   },
   {
    "id": "spine_ccx",
    "label": "Cluster interconnect + ring interface (toward the ring stop)",
    "x": 0.431,
    "y": 0.525,
    "w": 0.138,
    "h": 0.443
   },
   {
    "id": "gm_l1d_tl",
    "label": "L1D cache 32 KB",
    "x": 0.3575,
    "y": 0.3923,
    "w": 0.0722,
    "h": 0.1743
   },
   {
    "id": "gm_loadstore_tl",
    "label": "Load/store",
    "x": 0.1503,
    "y": 0.4152,
    "w": 0.2794,
    "h": 0.1771,
    "outline_rects": [
     [
      0.1503,
      0.4152,
      0.0629,
      0.0152
     ],
     [
      0.1503,
      0.4304,
      0.2072,
      0.1362
     ],
     [
      0.1503,
      0.5666,
      0.2794,
      0.0257
     ]
    ]
   },
   {
    "id": "gm_vec_tl",
    "label": "Vector (FP/SIMD) execution",
    "x": 0.0,
    "y": 0.3894,
    "w": 0.1503,
    "h": 0.2029,
    "outline_rects": [
     [
      0.0555,
      0.3894,
      0.0948,
      0.0229
     ],
     [
      0.0,
      0.4123,
      0.1503,
      0.18
     ]
    ]
   },
   {
    "id": "gm_int_tl",
    "label": "Integer execution",
    "x": 0.2132,
    "y": 0.2057,
    "w": 0.2165,
    "h": 0.2247,
    "outline_rects": [
     [
      0.3472,
      0.2057,
      0.0825,
      0.1266
     ],
     [
      0.2132,
      0.3323,
      0.2165,
      0.06
     ],
     [
      0.2132,
      0.3923,
      0.1443,
      0.0381
     ]
    ]
   },
   {
    "id": "gm_sched_tl",
    "label": "Scheduler",
    "x": 0.2132,
    "y": 0.2057,
    "w": 0.134,
    "h": 0.1266
   },
   {
    "id": "gm_decode_tl",
    "label": "Decoders",
    "x": 0.1297,
    "y": 0.2057,
    "w": 0.0835,
    "h": 0.2095,
    "outline_rects": [
     [
      0.1297,
      0.2057,
      0.0835,
      0.1837
     ],
     [
      0.1503,
      0.3894,
      0.0629,
      0.0258
     ]
    ]
   },
   {
    "id": "gm_l1i_tl",
    "label": "L1I cache 64 KB",
    "x": 0.0771,
    "y": 0.2057,
    "w": 0.0526,
    "h": 0.1837
   },
   {
    "id": "gm_bpu_tl",
    "label": "Branch predictor",
    "x": 0.0,
    "y": 0.2057,
    "w": 0.0771,
    "h": 0.2066,
    "outline_rects": [
     [
      0.0,
      0.2057,
      0.0771,
      0.1837
     ],
     [
      0.0,
      0.3894,
      0.0555,
      0.0229
     ]
    ]
   },
   {
    "id": "gm_l1d_tr",
    "label": "L1D cache 32 KB",
    "x": 0.5703,
    "y": 0.3923,
    "w": 0.0722,
    "h": 0.1743
   },
   {
    "id": "gm_loadstore_tr",
    "label": "Load/store",
    "x": 0.5703,
    "y": 0.4152,
    "w": 0.2794,
    "h": 0.1771,
    "outline_rects": [
     [
      0.7868,
      0.4152,
      0.0629,
      0.0152
     ],
     [
      0.6425,
      0.4304,
      0.2072,
      0.1362
     ],
     [
      0.5703,
      0.5666,
      0.2794,
      0.0257
     ]
    ]
   },
   {
    "id": "gm_vec_tr",
    "label": "Vector (FP/SIMD) execution",
    "x": 0.8497,
    "y": 0.3894,
    "w": 0.1503,
    "h": 0.2029,
    "outline_rects": [
     [
      0.8497,
      0.3894,
      0.0948,
      0.0229
     ],
     [
      0.8497,
      0.4123,
      0.1503,
      0.18
     ]
    ]
   },
   {
    "id": "gm_int_tr",
    "label": "Integer execution",
    "x": 0.5703,
    "y": 0.2057,
    "w": 0.2165,
    "h": 0.2247,
    "outline_rects": [
     [
      0.5703,
      0.2057,
      0.0825,
      0.1266
     ],
     [
      0.5703,
      0.3323,
      0.2165,
      0.06
     ],
     [
      0.6425,
      0.3923,
      0.1443,
      0.0381
     ]
    ]
   },
   {
    "id": "gm_sched_tr",
    "label": "Scheduler",
    "x": 0.6528,
    "y": 0.2057,
    "w": 0.134,
    "h": 0.1266
   },
   {
    "id": "gm_decode_tr",
    "label": "Decoders",
    "x": 0.7868,
    "y": 0.2057,
    "w": 0.0835,
    "h": 0.2095,
    "outline_rects": [
     [
      0.7868,
      0.2057,
      0.0835,
      0.1837
     ],
     [
      0.7868,
      0.3894,
      0.0629,
      0.0258
     ]
    ]
   },
   {
    "id": "gm_l1i_tr",
    "label": "L1I cache 64 KB",
    "x": 0.8703,
    "y": 0.2057,
    "w": 0.0526,
    "h": 0.1837
   },
   {
    "id": "gm_bpu_tr",
    "label": "Branch predictor",
    "x": 0.9229,
    "y": 0.2057,
    "w": 0.0771,
    "h": 0.2066,
    "outline_rects": [
     [
      0.9229,
      0.2057,
      0.0771,
      0.1837
     ],
     [
      0.9445,
      0.3894,
      0.0555,
      0.0229
     ]
    ]
   },
   {
    "id": "gm_l1d_bl",
    "label": "L1D cache 32 KB",
    "x": 0.3575,
    "y": 0.6276,
    "w": 0.0722,
    "h": 0.1743
   },
   {
    "id": "gm_loadstore_bl",
    "label": "Load/store",
    "x": 0.1503,
    "y": 0.6019,
    "w": 0.2794,
    "h": 0.1771,
    "outline_rects": [
     [
      0.1503,
      0.6019,
      0.2794,
      0.0257
     ],
     [
      0.1503,
      0.6276,
      0.2072,
      0.1362
     ],
     [
      0.1503,
      0.7638,
      0.0629,
      0.0152
     ]
    ]
   },
   {
    "id": "gm_vec_bl",
    "label": "Vector (FP/SIMD) execution",
    "x": 0.0,
    "y": 0.6019,
    "w": 0.1503,
    "h": 0.2029,
    "outline_rects": [
     [
      0.0,
      0.6019,
      0.1503,
      0.18
     ],
     [
      0.0555,
      0.7819,
      0.0948,
      0.0229
     ]
    ]
   },
   {
    "id": "gm_int_bl",
    "label": "Integer execution",
    "x": 0.2132,
    "y": 0.7638,
    "w": 0.2165,
    "h": 0.2247,
    "outline_rects": [
     [
      0.2132,
      0.7638,
      0.1443,
      0.0381
     ],
     [
      0.2132,
      0.8019,
      0.2165,
      0.06
     ],
     [
      0.3472,
      0.8619,
      0.0825,
      0.1266
     ]
    ]
   },
   {
    "id": "gm_sched_bl",
    "label": "Scheduler",
    "x": 0.2132,
    "y": 0.8619,
    "w": 0.134,
    "h": 0.1266
   },
   {
    "id": "gm_decode_bl",
    "label": "Decoders",
    "x": 0.1297,
    "y": 0.779,
    "w": 0.0835,
    "h": 0.2095,
    "outline_rects": [
     [
      0.1503,
      0.779,
      0.0629,
      0.0258
     ],
     [
      0.1297,
      0.8048,
      0.0835,
      0.1837
     ]
    ]
   },
   {
    "id": "gm_l1i_bl",
    "label": "L1I cache 64 KB",
    "x": 0.0771,
    "y": 0.8048,
    "w": 0.0526,
    "h": 0.1837
   },
   {
    "id": "gm_bpu_bl",
    "label": "Branch predictor",
    "x": 0.0,
    "y": 0.7819,
    "w": 0.0771,
    "h": 0.2066,
    "outline_rects": [
     [
      0.0,
      0.7819,
      0.0555,
      0.0229
     ],
     [
      0.0,
      0.8048,
      0.0771,
      0.1837
     ]
    ]
   },
   {
    "id": "gm_l1d_br",
    "label": "L1D cache 32 KB",
    "x": 0.5703,
    "y": 0.6276,
    "w": 0.0722,
    "h": 0.1743
   },
   {
    "id": "gm_loadstore_br",
    "label": "Load/store",
    "x": 0.5703,
    "y": 0.6019,
    "w": 0.2794,
    "h": 0.1771,
    "outline_rects": [
     [
      0.5703,
      0.6019,
      0.2794,
      0.0257
     ],
     [
      0.6425,
      0.6276,
      0.2072,
      0.1362
     ],
     [
      0.7868,
      0.7638,
      0.0629,
      0.0152
     ]
    ]
   },
   {
    "id": "gm_vec_br",
    "label": "Vector (FP/SIMD) execution",
    "x": 0.8497,
    "y": 0.6019,
    "w": 0.1503,
    "h": 0.2029,
    "outline_rects": [
     [
      0.8497,
      0.6019,
      0.1503,
      0.18
     ],
     [
      0.8497,
      0.7819,
      0.0948,
      0.0229
     ]
    ]
   },
   {
    "id": "gm_int_br",
    "label": "Integer execution",
    "x": 0.5703,
    "y": 0.7638,
    "w": 0.2165,
    "h": 0.2247,
    "outline_rects": [
     [
      0.6425,
      0.7638,
      0.1443,
      0.0381
     ],
     [
      0.5703,
      0.8019,
      0.2165,
      0.06
     ],
     [
      0.5703,
      0.8619,
      0.0825,
      0.1266
     ]
    ]
   },
   {
    "id": "gm_sched_br",
    "label": "Scheduler",
    "x": 0.6528,
    "y": 0.8619,
    "w": 0.134,
    "h": 0.1266
   },
   {
    "id": "gm_decode_br",
    "label": "Decoders",
    "x": 0.7868,
    "y": 0.779,
    "w": 0.0835,
    "h": 0.2095,
    "outline_rects": [
     [
      0.7868,
      0.779,
      0.0629,
      0.0258
     ],
     [
      0.7868,
      0.8048,
      0.0835,
      0.1837
     ]
    ]
   },
   {
    "id": "gm_l1i_br",
    "label": "L1I cache 64 KB",
    "x": 0.8703,
    "y": 0.8048,
    "w": 0.0526,
    "h": 0.1837
   },
   {
    "id": "gm_bpu_br",
    "label": "Branch predictor",
    "x": 0.9229,
    "y": 0.7819,
    "w": 0.0771,
    "h": 0.2066,
    "outline_rects": [
     [
      0.9445,
      0.7819,
      0.0555,
      0.0229
     ],
     [
      0.9229,
      0.8048,
      0.0771,
      0.1837
     ]
    ]
   }
  ]
 },
 "ring": {
  "path": [
   [
    0.1836,
    0.5059
   ],
   [
    0.8125,
    0.5059
   ],
   [
    0.8125,
    0.5551
   ],
   [
    0.1836,
    0.5551
   ]
  ],
  "closed": true,
  "stops": [
   {
    "id": "stop_sa",
    "x": 0.1836,
    "y": 0.5059,
    "serves": [
     "sa",
     "imc0",
     "imc1",
     "pcie_ctrl",
     "dmi",
     "pcie5",
     "pcie4",
     "display",
     "display_phy",
     "uncore_misc",
     "uncore_misc2"
    ]
   },
   {
    "id": "stop_pcore0",
    "x": 0.2379,
    "y": 0.5059,
    "serves": [
     "pcore0",
     "llc0"
    ]
   },
   {
    "id": "stop_pcore1",
    "x": 0.3345,
    "y": 0.5059,
    "serves": [
     "pcore1",
     "llc1"
    ]
   },
   {
    "id": "stop_pcore2",
    "x": 0.4313,
    "y": 0.5059,
    "serves": [
     "pcore2",
     "llc2"
    ]
   },
   {
    "id": "stop_pcore3",
    "x": 0.5279,
    "y": 0.5059,
    "serves": [
     "pcore3",
     "llc3"
    ]
   },
   {
    "id": "stop_ecluster0",
    "x": 0.6257,
    "y": 0.5059,
    "serves": [
     "ecl0",
     "llc8"
    ]
   },
   {
    "id": "stop_ecluster1",
    "x": 0.7513,
    "y": 0.5059,
    "serves": [
     "ecl1",
     "llc9"
    ]
   },
   {
    "id": "stop_gt",
    "x": 0.8125,
    "y": 0.5305,
    "serves": [
     "igpu",
     "gpu_global",
     "gpu_common",
     "media0",
     "media1"
    ]
   },
   {
    "id": "stop_ecluster3",
    "x": 0.7749,
    "y": 0.5551,
    "serves": [
     "ecl3",
     "llc11"
    ]
   },
   {
    "id": "stop_ecluster2",
    "x": 0.6494,
    "y": 0.5551,
    "serves": [
     "ecl2",
     "llc10"
    ]
   },
   {
    "id": "stop_pcore7",
    "x": 0.5516,
    "y": 0.5551,
    "serves": [
     "pcore7",
     "llc7"
    ]
   },
   {
    "id": "stop_pcore6",
    "x": 0.4549,
    "y": 0.5551,
    "serves": [
     "pcore6",
     "llc6"
    ]
   },
   {
    "id": "stop_pcore5",
    "x": 0.3582,
    "y": 0.5551,
    "serves": [
     "pcore5",
     "llc5"
    ]
   },
   {
    "id": "stop_pcore4",
    "x": 0.2616,
    "y": 0.5551,
    "serves": [
     "pcore4",
     "llc4"
    ]
   }
  ]
 },
 "wiring": {
  "nodes": {
   "sa": [
    0.15469,
    0.3948
   ],
   "sa_ring": [
    0.1836,
    0.3948
   ],
   "sa_w": [
    0.13073,
    0.3948
   ],
   "sa_mem": [
    0.15469,
    0.34474
   ],
   "mf_w": [
    0.12279,
    0.34474
   ],
   "mf_e": [
    0.17474,
    0.34474
   ],
   "imc0": [
    0.12279,
    0.19994
   ],
   "imc1": [
    0.17474,
    0.19994
   ],
   "imc0_up": [
    0.12279,
    0.05628
   ],
   "imc1_up": [
    0.17474,
    0.05628
   ],
   "ddrA_s": [
    0.13516,
    0.05628
   ],
   "ddrB_s": [
    0.43281,
    0.05628
   ],
   "ddr_a": [
    0.13516,
    0.02687
   ],
   "ddr_b": [
    0.43281,
    0.02687
   ],
   "io_j": [
    0.13073,
    0.45136
   ],
   "io_hub": [
    0.0625,
    0.45136
   ],
   "io_p5": [
    0.0625,
    0.43326
   ],
   "io_p5a": [
    0.0625,
    0.34219
   ],
   "io_dmi": [
    0.0625,
    0.1431
   ],
   "io_p5b": [
    0.0625,
    0.52432
   ],
   "io_p4": [
    0.0625,
    0.67704
   ],
   "dmi": [
    0.02917,
    0.1431
   ],
   "pcie5": [
    0.03177,
    0.43326
   ],
   "pcie5_a": [
    0.03177,
    0.34219
   ],
   "pcie5_b": [
    0.03177,
    0.52432
   ],
   "pcie4": [
    0.02917,
    0.67704
   ],
   "um": [
    0.13073,
    0.57466
   ],
   "um2_w": [
    0.13073,
    0.63801
   ],
   "um2": [
    0.18151,
    0.63801
   ],
   "disp_n": [
    0.13073,
    0.6776
   ],
   "disp": [
    0.13073,
    0.80713
   ],
   "dphy_n": [
    0.13073,
    0.92081
   ],
   "dphy": [
    0.13073,
    0.95673
   ],
   "gt": [
    0.86224,
    0.5305
   ],
   "media0": [
    0.86224,
    0.28281
   ],
   "media1": [
    0.86224,
    0.78054
   ],
   "gc": [
    0.90104,
    0.5305
   ],
   "gs": [
    0.92943,
    0.5305
   ],
   "gs_eu0": [
    0.92943,
    0.13122
   ],
   "gs_tmu0": [
    0.92943,
    0.26075
   ],
   "gl3t": [
    0.92943,
    0.31674
   ],
   "gl3b": [
    0.92943,
    0.6957
   ],
   "gs_tmu1": [
    0.92943,
    0.75113
   ],
   "gs_eu1": [
    0.92943,
    0.88122
   ],
   "gpu_eu0": [
    0.9668,
    0.13122
   ],
   "gpu_tmu0": [
    0.9668,
    0.26075
   ],
   "gpu_tmu1": [
    0.9668,
    0.75113
   ],
   "gpu_eu1": [
    0.9668,
    0.88122
   ],
   "pcore0": [
    0.2379,
    0.21833
   ],
   "llc0": [
    0.2379,
    0.42364
   ],
   "pcore1": [
    0.3345,
    0.21833
   ],
   "llc1": [
    0.3345,
    0.42364
   ],
   "pcore2": [
    0.4313,
    0.21833
   ],
   "llc2": [
    0.4313,
    0.42364
   ],
   "pcore3": [
    0.5279,
    0.21833
   ],
   "llc3": [
    0.5279,
    0.42364
   ],
   "pcore4": [
    0.2616,
    0.84163
   ],
   "llc4": [
    0.2616,
    0.63716
   ],
   "pcore5": [
    0.3582,
    0.84163
   ],
   "llc5": [
    0.3582,
    0.63716
   ],
   "pcore6": [
    0.4549,
    0.84163
   ],
   "llc6": [
    0.4549,
    0.63716
   ],
   "pcore7": [
    0.5516,
    0.84163
   ],
   "llc7": [
    0.5516,
    0.63716
   ],
   "ecluster0": [
    0.65104,
    0.23614
   ],
   "e0_g": [
    0.65104,
    0.39423
   ],
   "e0_s": [
    0.6257,
    0.39423
   ],
   "llc8": [
    0.6257,
    0.44174
   ],
   "ecluster1": [
    0.77786,
    0.23614
   ],
   "e1_g": [
    0.77786,
    0.39423
   ],
   "e1_s": [
    0.7513,
    0.39423
   ],
   "llc9": [
    0.7513,
    0.44174
   ],
   "ecluster2": [
    0.65208,
    0.82551
   ],
   "e2_g": [
    0.65208,
    0.66686
   ],
   "e2_s": [
    0.6494,
    0.66686
   ],
   "llc10": [
    0.6494,
    0.61963
   ],
   "ecluster3": [
    0.77878,
    0.82551
   ],
   "e3_g": [
    0.77878,
    0.66686
   ],
   "e3_s": [
    0.7749,
    0.66686
   ],
   "llc11": [
    0.7749,
    0.61963
   ]
  },
  "edges": [
   [
    "stop:stop_sa",
    "sa_ring"
   ],
   [
    "sa_ring",
    "sa"
   ],
   [
    "sa",
    "sa_w"
   ],
   [
    "sa",
    "sa_mem"
   ],
   [
    "sa_mem",
    "mf_w"
   ],
   [
    "sa_mem",
    "mf_e"
   ],
   [
    "mf_w",
    "imc0"
   ],
   [
    "mf_e",
    "imc1"
   ],
   [
    "imc0",
    "imc0_up"
   ],
   [
    "imc1",
    "imc1_up"
   ],
   [
    "imc0_up",
    "ddrA_s"
   ],
   [
    "imc1_up",
    "ddrB_s"
   ],
   [
    "ddrA_s",
    "ddr_a"
   ],
   [
    "ddrB_s",
    "ddr_b"
   ],
   [
    "sa_w",
    "io_j"
   ],
   [
    "io_j",
    "io_hub"
   ],
   [
    "io_hub",
    "io_p5"
   ],
   [
    "io_p5",
    "io_p5a"
   ],
   [
    "io_p5a",
    "io_dmi"
   ],
   [
    "io_hub",
    "io_p5b"
   ],
   [
    "io_p5b",
    "io_p4"
   ],
   [
    "io_dmi",
    "dmi"
   ],
   [
    "io_p5",
    "pcie5"
   ],
   [
    "io_p4",
    "pcie4"
   ],
   [
    "io_p5a",
    "pcie5_a"
   ],
   [
    "io_p5b",
    "pcie5_b"
   ],
   [
    "pcie5",
    "pcie5_a"
   ],
   [
    "pcie5",
    "pcie5_b"
   ],
   [
    "io_j",
    "um"
   ],
   [
    "um",
    "um2_w"
   ],
   [
    "um2_w",
    "disp_n"
   ],
   [
    "um2_w",
    "um2"
   ],
   [
    "disp_n",
    "disp"
   ],
   [
    "disp",
    "dphy_n"
   ],
   [
    "dphy_n",
    "dphy"
   ],
   [
    "stop:stop_gt",
    "gt"
   ],
   [
    "gt",
    "media0"
   ],
   [
    "gt",
    "media1"
   ],
   [
    "gt",
    "gc"
   ],
   [
    "gc",
    "gs"
   ],
   [
    "gs_eu0",
    "gpu_eu0"
   ],
   [
    "gs_tmu0",
    "gpu_tmu0"
   ],
   [
    "gs_tmu1",
    "gpu_tmu1"
   ],
   [
    "gs_eu1",
    "gpu_eu1"
   ],
   [
    "pcore0",
    "llc0"
   ],
   [
    "llc0",
    "stop:stop_pcore0"
   ],
   [
    "pcore1",
    "llc1"
   ],
   [
    "llc1",
    "stop:stop_pcore1"
   ],
   [
    "pcore2",
    "llc2"
   ],
   [
    "llc2",
    "stop:stop_pcore2"
   ],
   [
    "pcore3",
    "llc3"
   ],
   [
    "llc3",
    "stop:stop_pcore3"
   ],
   [
    "pcore4",
    "llc4"
   ],
   [
    "llc4",
    "stop:stop_pcore4"
   ],
   [
    "pcore5",
    "llc5"
   ],
   [
    "llc5",
    "stop:stop_pcore5"
   ],
   [
    "pcore6",
    "llc6"
   ],
   [
    "llc6",
    "stop:stop_pcore6"
   ],
   [
    "pcore7",
    "llc7"
   ],
   [
    "llc7",
    "stop:stop_pcore7"
   ],
   [
    "ecluster0",
    "e0_g"
   ],
   [
    "e0_g",
    "e0_s"
   ],
   [
    "e0_s",
    "llc8"
   ],
   [
    "llc8",
    "stop:stop_ecluster0"
   ],
   [
    "ecluster1",
    "e1_g"
   ],
   [
    "e1_g",
    "e1_s"
   ],
   [
    "e1_s",
    "llc9"
   ],
   [
    "llc9",
    "stop:stop_ecluster1"
   ],
   [
    "ecluster2",
    "e2_g"
   ],
   [
    "e2_g",
    "e2_s"
   ],
   [
    "e2_s",
    "llc10"
   ],
   [
    "llc10",
    "stop:stop_ecluster2"
   ],
   [
    "ecluster3",
    "e3_g"
   ],
   [
    "e3_g",
    "e3_s"
   ],
   [
    "e3_s",
    "llc11"
   ],
   [
    "llc11",
    "stop:stop_ecluster3"
   ],
   [
    "gs",
    "gl3t"
   ],
   [
    "gl3t",
    "gs_tmu0"
   ],
   [
    "gs_tmu0",
    "gs_eu0"
   ],
   [
    "gs",
    "gl3b"
   ],
   [
    "gl3b",
    "gs_tmu1"
   ],
   [
    "gs_tmu1",
    "gs_eu1"
   ]
  ],
  "ports": {
   "sa": "sa",
   "imc0": "imc0",
   "imc1": "imc1",
   "ddrphy": "ddr_a",
   "dmi": "dmi",
   "pcie5": "pcie5",
   "pcie4": "pcie4",
   "pcie_ctrl": "io_hub",
   "display": "disp",
   "display_phy": "dphy",
   "igpu": "gt",
   "gpu_global": "gt",
   "media0": "media0",
   "media1": "media1",
   "gpu_common": "gc",
   "gpu_l3_top": "gl3t",
   "gpu_l3_bot": "gl3b",
   "gpu_eu0": "gpu_eu0",
   "gpu_eu1": "gpu_eu1",
   "gpu_tmu0": "gpu_tmu0",
   "gpu_tmu1": "gpu_tmu1",
   "uncore_misc": "um",
   "uncore_misc2": "um2",
   "pcore0": "pcore0",
   "pcore1": "pcore1",
   "pcore2": "pcore2",
   "pcore3": "pcore3",
   "pcore4": "pcore4",
   "pcore5": "pcore5",
   "pcore6": "pcore6",
   "pcore7": "pcore7",
   "llc0": "llc0",
   "llc1": "llc1",
   "llc2": "llc2",
   "llc3": "llc3",
   "llc4": "llc4",
   "llc5": "llc5",
   "llc6": "llc6",
   "llc7": "llc7",
   "llc8": "llc8",
   "llc9": "llc9",
   "llc10": "llc10",
   "llc11": "llc11",
   "ecl0": "ecluster0",
   "ecl1": "ecluster1",
   "ecl2": "ecluster2",
   "ecl3": "ecluster3",
   "ddr_phy_a": "ddr_a",
   "ddr_phy_b": "ddr_b",
   "pcie5_phy_x8a": "pcie5_a",
   "pcie5_phy_x8b": "pcie5_b",
   "gpu_unslice": "gc"
  },
  "exits": {
   "dmi": {
    "node": "dmi",
    "edge": "left",
    "label": "DMI ×8 → chipset",
    "bus": "dmi"
   },
   "pcie5": {
    "node": "pcie5",
    "edge": "left",
    "label": "PCIe 5.0 ×16 → graphics card",
    "bus": "pcie16"
   },
   "pcie4": {
    "node": "pcie4",
    "edge": "left",
    "label": "PCIe 4.0 ×4 → NVMe SSD",
    "bus": "pcie4"
   },
   "dram0": {
    "node": "ddr_a",
    "edge": "top",
    "label": "DDR5 → DIMM slots",
    "bus": "ddrA"
   },
   "dram1": {
    "node": "ddr_b",
    "edge": "top",
    "label": "DDR5 → DIMM slots",
    "bus": "ddrB"
   },
   "display": {
    "node": "dphy",
    "edge": "bottom",
    "label": "DisplayPort / HDMI → monitor",
    "bus": "ddi"
   }
  }
 },
 "mounting": {
  "mirrored": true,
  "note": "Flip-chip: seen from above, the layout is the photo mirrored (transposed across its anti-diagonal). DDR edge faces the DIMMs, the DMI/PCIe end faces the PCIe x16 slot and the PCH, the GPU end faces the VRM. Verified against Intel's LGA1700 ballout (datasheets 655258 / 743844).",
  "die_center_offset_mm": {
   "east": 0,
   "north": 1.8
  }
 }
}
