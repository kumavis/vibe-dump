# Within-set slopes (within.mjs, run1 + boards, seed 2222)

Logistic fits on one set at a time: score ~ seat + centre dummies + detour (per 0.1 of walk cost / straight line) + clear18 (per 0.1). "Predicted" = the within-fortified detour slope x the sets' mean detour difference, as score points at the classic mean (a rough linearisation).

| size | pair | set | N | detour slope | clear18 slope | detour sd | mean detour classic / fortified | swing predicted by detour (points) | actual swing |
|---|---|---|---|---|---|---|---|---|---|
| classic | B-S (S) | classic | 1000 | 0.22 ± 0.56 | -0.16 ± 0.07 | 0.01 | 1.03 / 1.16 |  |  |
| classic | B-S (S) | fortified | 1000 | -0.13 ± 0.12 | -0.08 ± 0.08 | 0.06 | 1.03 / 1.16 | -3.9 | -0.8 |
| classic | B-I (I) | classic | 1000 | 0.26 ± 0.58 | -0.01 ± 0.07 | 0.01 | 1.03 / 1.15 |  |  |
| classic | B-I (I) | fortified | 1000 | -0.29 ± 0.12 | 0.18 ± 0.08 | 0.06 | 1.03 / 1.15 | -8.7 | -9.9 |
| classic | S-I (I) | classic | 1000 | 0.24 ± 0.55 | -0.04 ± 0.07 | 0.01 | 1.03 / 1.16 |  |  |
| classic | S-I (I) | fortified | 1000 | -0.31 ± 0.12 | 0.00 ± 0.07 | 0.06 | 1.03 / 1.16 | -9.4 | -10.6 |
| classic | B-W (W) | classic | 1000 | -0.98 ± 0.59 | -0.01 ± 0.07 | 0.01 | 1.03 / 1.16 |  |  |
| classic | B-W (W) | fortified | 1000 | 0.22 ± 0.12 | -0.07 ± 0.08 | 0.06 | 1.03 / 1.16 | 6.9 | 16.0 |
| classic | S-W (W) | classic | 1000 | 0.18 ± 0.63 | -0.02 ± 0.08 | 0.01 | 1.03 / 1.15 |  |  |
| classic | S-W (W) | fortified | 1000 | 0.00 ± 0.12 | -0.26 ± 0.07 | 0.06 | 1.03 / 1.15 | 0.1 | 24.5 |
| classic | I-W (W) | classic | 1000 | -0.33 ± 0.58 | -0.02 ± 0.07 | 0.01 | 1.03 / 1.16 |  |  |
| classic | I-W (W) | fortified | 1000 | 0.21 ± 0.12 | -0.18 ± 0.07 | 0.06 | 1.03 / 1.16 | 6.1 | 27.5 |
| field | B-I (I) | open | 300 | 1.42 ± 1.51 | -0.07 ± 0.16 | 0.01 | 1.04 / 1.08 |  |  |
| field | B-I (I) | fortified | 300 | -1.82 ± 1.09 | -0.01 ± 0.19 | 0.01 | 1.04 / 1.08 | -18.1 | -4.0 |
| field | S-I (I) | open | 300 | 0.51 ± 1.57 | 0.07 ± 0.16 | 0.01 | 1.04 / 1.09 |  |  |
| field | S-I (I) | fortified | 300 | 1.73 ± 0.98 | 0.04 ± 0.16 | 0.01 | 1.04 / 1.09 | 17.1 | -5.5 |
| field | B-W (W) | open | 300 | 2.47 ± 1.63 | 0.22 ± 0.17 | 0.01 | 1.04 / 1.08 |  |  |
| field | B-W (W) | fortified | 300 | 4.71 ± 1.68 | -0.34 ± 0.21 | 0.01 | 1.04 / 1.08 | 26.7 | 10.0 |
| field | S-W (W) | open | 300 | -1.30 ± 1.75 | -0.03 ± 0.15 | 0.01 | 1.04 / 1.08 |  |  |
| field | S-W (W) | fortified | 300 | 3.08 ± 1.42 | 0.04 ± 0.20 | 0.01 | 1.04 / 1.08 | 26.0 | 16.2 |
| field | I-W (W) | open | 300 | -0.28 ± 1.45 | -0.12 ± 0.16 | 0.01 | 1.04 / 1.09 |  |  |
| field | I-W (W) | fortified | 300 | -0.05 ± 1.15 | 0.06 ± 0.20 | 0.01 | 1.04 / 1.09 | -0.6 | 30.7 |
