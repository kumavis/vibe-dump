// Named rule sets used from stage 3 on. Ticks are director beats (~2.05 s).
export const RULES = {
  stock: { dealMin: 1 }, //                         Jukugo rules, deal bound lowered to 1 so it deals
  'stock+R6': { dealMin: 1, retry: 6 }, //          + director tries up to 6 other idle pairs on a null
  'T-R6-d1': { dealMin: 1, retry: 6, tiers: true },
  'T-P12-R6-d1': { dealMin: 1, retry: 6, tiers: true, prevAfter: 12 },
  'T-P12-R6-d3': { dealMin: 3, retry: 6, tiers: true, prevAfter: 12 }, //             no duplicates ever
  'T-P12-R6-d3-dd31': { dealMin: 3, retry: 6, tiers: true, prevAfter: 12, dealDupFar: 31.1 }, // duplicates only in the deal
  'T-P12-D31-R6-d3': { dealMin: 3, retry: 6, tiers: true, prevAfter: 12, dupFar: 31.1 }, // never two copies in one 26x17 view
  'T-P12-D26-R6-d3': { dealMin: 3, retry: 6, tiers: true, prevAfter: 12, dupFar: 26 },
  'T-P12-D20-R6-d3': { dealMin: 3, retry: 6, tiers: true, prevAfter: 12, dupFar: 20 },
  'T-P12-D14-R6-d3': { dealMin: 3, retry: 6, tiers: true, prevAfter: 12, dupFar: 14 },
  'T-P25-D26-R6-d3': { dealMin: 3, retry: 6, tiers: true, prevAfter: 25, dupFar: 26 },
  'T-P6-D26-R6-d3': { dealMin: 3, retry: 6, tiers: true, prevAfter: 6, dupFar: 26 },
  'T-P12-D26-R6-d5': { dealMin: 5, retry: 6, tiers: true, prevAfter: 12, dupFar: 26 },
  'W-P12-D26-R6-d3': { dealMin: 3, retry: 6, recentW: 0.05, dupW: 0.2, prevAfter: 12, dupFar: 26 }, // soft weights instead of tiers
  'T-P12-D26-d3': { dealMin: 3, tiers: true, prevAfter: 12, dupFar: 26 }, //           no retry
}
// Added for stage 5: duplicates allowed only where both copies can never sit in
// one 26x17 view (|dx| > 27 or |dz| > 18, one unit of margin), and shorter rests.
Object.assign(RULES, {
  'T-P12-box-R6-d3': { dealMin: 3, retry: 6, tiers: true, prevAfter: 12, dupFar: 1, dupBox: [27, 18] },
  'T-P6-box-R6-d3': { dealMin: 3, retry: 6, tiers: true, prevAfter: 6, dupFar: 1, dupBox: [27, 18] },
  'T-P3-box-R6-d3': { dealMin: 3, retry: 6, tiers: true, prevAfter: 3, dupFar: 1, dupBox: [27, 18] },
  'T-P3-dd31-R6-d3': { dealMin: 3, retry: 6, tiers: true, prevAfter: 3, dealDupFar: 31.1 },
})
// Added for stage 7: a box sized for a 1920x1080 window at default zoom (32 x 22 + 1).
Object.assign(RULES, {
  'T-P3-boxHD-R6-d3': { dealMin: 3, retry: 6, tiers: true, prevAfter: 3, dupFar: 1, dupBox: [33, 23] },
})
