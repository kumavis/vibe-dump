# Lists natural experiment (lists.mjs, run1 data, seed 2222)

Perchers: a list's walking units of AI role `shooter` with OC > 0 (Nutkin, Grenadiers; Spitters; Spinethrowers). Fit: focus score ~ seat + fort + oppP + ownP + fort:oppP + fort:ownP (logits; oppP/ownP centred). A positive fort:oppP says the fortified set helps the focus race more the more perchers its opponent fields.

| size | pair | mean perchers focus / opp | fort | fort x opp perchers | fort x own perchers | focus score fortified - classic by opp perchers (<= median / > median) |
|---|---|---|---|---|---|---|
| classic | B-S (S) | 1.90 / 3.58 | -0.03 ± 0.09 | 0.15 ± 0.09 | -0.15 ± 0.10 | -0.2 (858+854) / -3.6 (142+146) |
| classic | B-I (I) | 1.67 / 3.57 | -0.41 ± 0.09 | -0.05 ± 0.09 | 0.04 ± 0.09 | -9.1 (849+848) / -14.4 (151+152) |
| classic | S-I (I) | 1.65 / 1.86 | -0.44 ± 0.09 | 0.07 ± 0.09 | 0.09 ± 0.09 | -12.4 (700+730) / -6.8 (300+270) |
| classic | B-W (W) | 0.00 / 3.61 | - ± - | - ± - | - ± - | 16.6 (857+833) / 13.4 (143+167) |
| classic | S-W (W) | 0.00 / 1.88 | - ± - | - ± - | - ± - | 24.8 (726+692) / 23.8 (274+308) |
| classic | I-W (W) | 0.00 / 1.67 | - ± - | - ± - | - ± - | 28.6 (748+784) / 24.8 (252+216) |
| field | B-I (I) | 3.44 / 7.54 | -0.20 ± 0.16 | 0.13 ± 0.11 | -0.05 ± 0.13 | -10.1 (202+216) / 9.4 (98+84) |
| field | S-I (I) | 3.43 / 3.93 | -0.24 ± 0.16 | -0.00 ± 0.14 | 0.19 ± 0.13 | -4.9 (179+172) / -6.8 (121+128) |
| field | B-W (W) | 0.00 / 7.36 | - ± - | - ± - | - ± - | 11.9 (176+153) / 7.3 (124+147) |
| field | S-W (W) | 0.00 / 4.05 | - ± - | - ± - | - ± - | 18.4 (164+141) / 13.9 (136+159) |
| field | I-W (W) | 0.00 / 3.40 | - ± - | - ± - | - ± - | 35.4 (221+230) / 14.9 (79+70) |
