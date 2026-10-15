// The Raptor Lake-S 8P+16E (Core i9-13900K) die floorplan, measured block by
// block on Fritzchens Fritz's CC0 die photograph and checked by overlaying the
// rectangles back onto it. Coordinates are fractions of the die (x across the
// long edge from the PCIe/DMI side, y down from the DDR PHY edge).
//
// GENERATED from the research floorplan JSON - edit that and regenerate.
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
   "label": "DDR5/DDR4 memory PHY (2 channels, 128-bit + ECC bits)",
   "x": 0.0063,
   "y": 0.0074,
   "w": 0.551,
   "h": 0.039,
   "confidence": "high"
  },
  {
   "id": "imc0",
   "kind": "imc",
   "label": "Memory controller, left half (mirror pair - probably one DDR channel each)",
   "x": 0.0969,
   "y": 0.065,
   "w": 0.0518,
   "h": 0.2698,
   "confidence": "medium"
  },
  {
   "id": "imc1",
   "kind": "imc",
   "label": "Memory controller, right half (mirror pair - probably one DDR channel each)",
   "x": 0.1487,
   "y": 0.065,
   "w": 0.0521,
   "h": 0.2698,
   "confidence": "medium"
  },
  {
   "id": "sa",
   "kind": "system_agent",
   "label": "System Agent (uncore: IO fabric, coherency, power/clock control)",
   "x": 0.1086,
   "y": 0.3394,
   "w": 0.0919,
   "h": 0.1103,
   "confidence": "medium"
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
   "confidence": "high"
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
   "confidence": "medium"
  },
  {
   "id": "ring_stop_sa",
   "kind": "ring",
   "label": "Ring stop at the System-Agent end (SA <-> ring interface)",
   "x": 0.1615,
   "y": 0.4581,
   "w": 0.039,
   "h": 0.1256,
   "confidence": "medium"
  },
  {
   "id": "uncore_misc",
   "kind": "other",
   "label": "Uncore logic, unidentified (GNA 3.0 probably here)",
   "x": 0.0859,
   "y": 0.4525,
   "w": 0.0756,
   "h": 0.2443,
   "confidence": "low"
  },
  {
   "id": "uncore_misc2",
   "kind": "other",
   "label": "Uncore logic, unidentified",
   "x": 0.1615,
   "y": 0.5854,
   "w": 0.0401,
   "h": 0.1058,
   "confidence": "low"
  },
  {
   "id": "display",
   "kind": "display",
   "label": "Display engine (4 display pipes)",
   "x": 0.0534,
   "y": 0.6968,
   "w": 0.1484,
   "h": 0.2206,
   "confidence": "medium"
  },
  {
   "id": "display_phy",
   "kind": "display_phy",
   "label": "Display PHYs (DDI ports for DP/HDMI)",
   "x": 0.0617,
   "y": 0.9253,
   "w": 0.1315,
   "h": 0.0628,
   "confidence": "medium"
  },
  {
   "id": "misc_io",
   "kind": "misc_io",
   "label": "Misc I/O macros (unidentified; possibly sideband/GPIO/clock/debug pads)",
   "x": 0.0057,
   "y": 0.7381,
   "w": 0.0474,
   "h": 0.1624,
   "confidence": "low"
  },
  {
   "id": "misc_io_b",
   "kind": "misc_io",
   "label": "Small macros / fill at bottom-left corner (unidentified)",
   "x": 0.0057,
   "y": 0.9021,
   "w": 0.0474,
   "h": 0.0866,
   "confidence": "low"
  },
  {
   "id": "pcore0",
   "kind": "pcore",
   "label": "P-core 0 (Raptor Cove) + 2 MB L2",
   "x": 0.2012,
   "y": 0.0679,
   "w": 0.0966,
   "h": 0.3009,
   "confidence": "high"
  },
  {
   "id": "llc0",
   "kind": "llc_slice",
   "label": "LLC slice 0 (3 MB) - P-core column 0, top",
   "x": 0.2008,
   "y": 0.3688,
   "w": 0.093,
   "h": 0.1097,
   "confidence": "high"
  },
  {
   "id": "pcore1",
   "kind": "pcore",
   "label": "P-core 1 (Raptor Cove) + 2 MB L2",
   "x": 0.2978,
   "y": 0.0679,
   "w": 0.0966,
   "h": 0.3009,
   "confidence": "high"
  },
  {
   "id": "llc1",
   "kind": "llc_slice",
   "label": "LLC slice 1 (3 MB) - P-core column 1, top",
   "x": 0.2977,
   "y": 0.3688,
   "w": 0.0927,
   "h": 0.1097,
   "confidence": "high"
  },
  {
   "id": "pcore2",
   "kind": "pcore",
   "label": "P-core 2 (Raptor Cove) + 2 MB L2",
   "x": 0.3944,
   "y": 0.0679,
   "w": 0.0966,
   "h": 0.3009,
   "confidence": "high"
  },
  {
   "id": "llc2",
   "kind": "llc_slice",
   "label": "LLC slice 2 (3 MB) - P-core column 2, top",
   "x": 0.3943,
   "y": 0.3688,
   "w": 0.0927,
   "h": 0.1097,
   "confidence": "high"
  },
  {
   "id": "pcore3",
   "kind": "pcore",
   "label": "P-core 3 (Raptor Cove) + 2 MB L2",
   "x": 0.491,
   "y": 0.0679,
   "w": 0.0966,
   "h": 0.3009,
   "confidence": "high"
  },
  {
   "id": "llc3",
   "kind": "llc_slice",
   "label": "LLC slice 3 (3 MB) - P-core column 3, top",
   "x": 0.4909,
   "y": 0.3688,
   "w": 0.0927,
   "h": 0.1097,
   "confidence": "high"
  },
  {
   "id": "pcore4",
   "kind": "pcore",
   "label": "P-core 4 (Raptor Cove) + 2 MB L2",
   "x": 0.2021,
   "y": 0.6912,
   "w": 0.0963,
   "h": 0.3009,
   "confidence": "high",
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
   "h": 0.1081,
   "confidence": "high"
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
   "w": 0.0925,
   "h": 0.1081,
   "confidence": "high"
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
   "w": 0.0925,
   "h": 0.1081,
   "confidence": "high"
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
   "w": 0.0925,
   "h": 0.1081,
   "confidence": "high"
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
   "confidence": "high"
  },
  {
   "id": "llc9",
   "kind": "llc_slice",
   "label": "LLC slice 9 (3 MB) - ecluster1 column",
   "x": 0.7148,
   "y": 0.405,
   "w": 0.0922,
   "h": 0.0735,
   "confidence": "high"
  },
  {
   "id": "llc10",
   "kind": "llc_slice",
   "label": "LLC slice 10 (3 MB) - ecluster2 column",
   "x": 0.5935,
   "y": 0.5831,
   "w": 0.0922,
   "h": 0.073,
   "confidence": "high"
  },
  {
   "id": "llc11",
   "kind": "llc_slice",
   "label": "LLC slice 11 (3 MB) - ecluster3 column",
   "x": 0.719,
   "y": 0.5831,
   "w": 0.0922,
   "h": 0.073,
   "confidence": "high"
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
   "w": 0.0857,
   "h": 0.0985,
   "confidence": "high"
  },
  {
   "id": "ring_stop_gt",
   "kind": "ring",
   "label": "Ring stop at the iGPU end (right end of the ring)",
   "x": 0.807,
   "y": 0.4785,
   "w": 0.0112,
   "h": 0.1041,
   "confidence": "low"
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
   "label": "Media engine 0 (video decode/encode + video enhancement)",
   "x": 0.8427,
   "y": 0.1086,
   "w": 0.0766,
   "h": 0.3501,
   "confidence": "medium"
  },
  {
   "id": "media1",
   "kind": "media",
   "label": "Media engine 1 (video decode/encode + video enhancement)",
   "x": 0.8427,
   "y": 0.6063,
   "w": 0.0766,
   "h": 0.3496,
   "confidence": "medium"
  },
  {
   "id": "gpu_global",
   "kind": "igpu",
   "label": "GPU global assets (GAM + GTI: the GPU's interface to the ring)",
   "x": 0.8427,
   "y": 0.4587,
   "w": 0.0391,
   "h": 0.1476,
   "confidence": "medium"
  },
  {
   "id": "gpu_common",
   "kind": "igpu",
   "label": "GPU slice common (3D geometry front end, raster/pixel back end, L3 control)",
   "x": 0.8818,
   "y": 0.3173,
   "w": 0.1125,
   "h": 0.3773,
   "confidence": "medium"
  },
  {
   "id": "gpu_l3_top",
   "kind": "igpu",
   "label": "GPU L3 cache column (upper SRAM banks)",
   "x": 0.9201,
   "y": 0.1086,
   "w": 0.019,
   "h": 0.2014,
   "confidence": "medium"
  },
  {
   "id": "gpu_l3_bot",
   "kind": "igpu",
   "label": "GPU L3 cache column (lower SRAM banks)",
   "x": 0.9201,
   "y": 0.7212,
   "w": 0.019,
   "h": 0.2024,
   "confidence": "medium"
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
   "label": "GPU subslice 0: sampler / texture units + L1/SLM",
   "x": 0.9393,
   "y": 0.2042,
   "w": 0.055,
   "h": 0.1131,
   "confidence": "medium"
  },
  {
   "id": "gpu_tmu1",
   "kind": "igpu",
   "label": "GPU subslice 1: sampler / texture units + L1/SLM",
   "x": 0.9393,
   "y": 0.6946,
   "w": 0.055,
   "h": 0.1131,
   "confidence": "medium"
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
   "kind": "other",
   "label": "Small analog/mixed-signal macro 0 on top edge (unidentified)",
   "x": 0.599,
   "y": 0.0147,
   "w": 0.0145,
   "h": 0.0554,
   "confidence": "low"
  },
  {
   "id": "analog1",
   "kind": "other",
   "label": "Small analog/mixed-signal macro 1 on top edge (unidentified)",
   "x": 0.6656,
   "y": 0.0147,
   "w": 0.0289,
   "h": 0.0554,
   "confidence": "low"
  },
  {
   "id": "analog2",
   "kind": "other",
   "label": "Small analog/mixed-signal macro 2 on top edge (unidentified)",
   "x": 0.7922,
   "y": 0.0147,
   "w": 0.0286,
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
    "w": 0.035,
    "h": 1.0
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
    "x": 0.759,
    "y": 0.299,
    "w": 0.083,
    "h": 0.165
   },
   {
    "id": "l1d",
    "label": "48 KB L1 data cache",
    "x": 0.079,
    "y": 0.397,
    "w": 0.136,
    "h": 0.119
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
    "id": "decode",
    "label": "Instruction decode",
    "x": 0.616,
    "y": 0.464,
    "w": 0.384,
    "h": 0.135
   },
   {
    "id": "l1i",
    "label": "32 KB L1 instruction cache",
    "x": 0.623,
    "y": 0.599,
    "w": 0.092,
    "h": 0.09
   },
   {
    "id": "l1i_ctl",
    "label": "L1I control / fetch",
    "x": 0.715,
    "y": 0.599,
    "w": 0.285,
    "h": 0.105
   },
   {
    "id": "branch",
    "label": "Branch prediction",
    "x": 0.704,
    "y": 0.704,
    "w": 0.296,
    "h": 0.296
   },
   {
    "id": "l2",
    "label": "L2 cache (in-core arrays + control)",
    "x": 0.066,
    "y": 0.689,
    "w": 0.638,
    "h": 0.311
   },
   {
    "id": "l2_ext",
    "label": "L2 extension arrays (Raptor Cove's 1.25 -> 2 MB growth)",
    "x": 0.217,
    "y": 1.0,
    "w": 0.55,
    "h": 0.175
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
    "label": "L2 control/tags + cluster logic (central spine, links to the ring stop)",
    "x": 0.431,
    "y": 0.196,
    "w": 0.138,
    "h": 0.8
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
    "y": 0.5305,
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
    "x": 0.2288,
    "y": 0.5059,
    "serves": [
     "pcore0",
     "llc0"
    ]
   },
   {
    "id": "stop_pcore1",
    "x": 0.3254,
    "y": 0.5059,
    "serves": [
     "pcore1",
     "llc1"
    ]
   },
   {
    "id": "stop_pcore2",
    "x": 0.422,
    "y": 0.5059,
    "serves": [
     "pcore2",
     "llc2"
    ]
   },
   {
    "id": "stop_pcore3",
    "x": 0.5186,
    "y": 0.5059,
    "serves": [
     "pcore3",
     "llc3"
    ]
   },
   {
    "id": "stop_ecluster0",
    "x": 0.6166,
    "y": 0.5059,
    "serves": [
     "ecl0",
     "llc8"
    ]
   },
   {
    "id": "stop_ecluster1",
    "x": 0.7421,
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
    "x": 0.785,
    "y": 0.5551,
    "serves": [
     "ecl3",
     "llc11"
    ]
   },
   {
    "id": "stop_ecluster2",
    "x": 0.6587,
    "y": 0.5551,
    "serves": [
     "ecl2",
     "llc10"
    ]
   },
   {
    "id": "stop_pcore7",
    "x": 0.5605,
    "y": 0.5551,
    "serves": [
     "pcore7",
     "llc7"
    ]
   },
   {
    "id": "stop_pcore6",
    "x": 0.4639,
    "y": 0.5551,
    "serves": [
     "pcore6",
     "llc6"
    ]
   },
   {
    "id": "stop_pcore5",
    "x": 0.3673,
    "y": 0.5551,
    "serves": [
     "pcore5",
     "llc5"
    ]
   },
   {
    "id": "stop_pcore4",
    "x": 0.2707,
    "y": 0.5551,
    "serves": [
     "pcore4",
     "llc4"
    ]
   }
  ]
 }
}
