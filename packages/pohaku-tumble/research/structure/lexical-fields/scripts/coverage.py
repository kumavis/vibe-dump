#!/usr/bin/env python3
"""Per-series attestation: for each candidate series, how many member forms are in
Wiktionary (W), POLLEX/P&E (P), Andrews-Parker (A, stripped spelling), hawwiki (C>0)."""
from lex import *
import csv
SERIES = {
 'S1 kin GEN x SEX (cells)': ['kupuna kāne', 'kupuna wahine', 'makua kāne', 'makuahine', 'keiki kāne', 'kaikamahine', 'moʻopuna kāne', 'moʻopuna wahine'],
 'S1 kin GEN x SEX (slot fillers)': ['kupuna', 'makua', 'keiki', 'moʻopuna', 'kāne', 'wahine'],
 'S2 sibling terms': ['kaikuaʻana', 'kaikaina', 'kaikunāne', 'kaikuahine', 'kuaʻana', 'kaina', 'kunāne', 'kuahine', 'kaikoʻeke'],
 'S3 kin plural by length': ['kūpuna', 'mākua', 'wāhine', 'kaikamāhine', 'mākuahine', 'luāhine', 'ʻelemākule'],
 'S4 locative nouns': ['luna', 'lalo', 'loko', 'waho', 'mua', 'hope', 'uka', 'kai', 'waena', 'muli', 'laila', 'ʻaneʻi', 'ʻō'],
 'S4 prepositions': ['i', 'ma', 'mai', 'no', 'o'],
 'S5 axis terms (other)': ['ʻākau', 'hema', 'hikina', 'komohana', 'mauka', 'makai', 'alo', 'kua', 'koʻolau', 'kona', 'hoʻolua', 'malanai'],
 'S7 NUM4 units': ['kāuna', 'kaʻau', 'kanahā', 'ʻiako', 'lau', 'mano', 'kini', 'lehu'],
 'S8 kana- tens': ['kanakolu', 'kanahā', 'kanalima', 'kanaono', 'kanahiku', 'kanawalu', 'kanaiwa'],
 'S8 hapa- fractions': ['hapalua', 'hapakolu', 'hapahā'],
 'S8 pā- multiplicatives': ['pālua', 'pākolu', 'pāhā'],
 'S8 Pōʻa- weekdays': ['pōʻakahi', 'pōʻalua', 'pōʻakolu', 'pōʻahā', 'pōʻalima', 'pōʻaono'],
 'S8 kau- canoes': ['kaukahi', 'kaulua'],
 'S9 moon phase words': ['kū', 'ʻole', 'lāʻau', 'kāloa'],
 'S10 colour RR': ['keʻokeʻo', 'ʻeleʻele', 'ʻulaʻula', 'uliuli', 'melemele', 'lenalena', 'ʻōmaʻomaʻo'],
 'S10 colour roots': ['keʻo', 'ʻele', 'ʻula', 'uli', 'mele', 'lena', 'maʻo'],
 'S11 limb parts': ['manamana', 'kuʻekuʻe', 'poho', 'kupeʻe', 'lima', 'wāwae'],
 'S12 body terms w/ land sense': ['poʻo', 'lae', 'alo', 'kua', 'piko', 'nuku', 'ʻili'],
}
rows = []
for s, mem in SERIES.items():
    w = sum(bool(wikt(m)) for m in mem)
    p = sum(bool(pollex(m)) for m in mem)
    a = sum(bool(andrews(m)) for m in mem)
    c = sum((phrase(m) if ' ' in m else count(m)) > 0 for m in mem)
    missingP = [m for m in mem if not pollex(m)]
    rows.append([s, len(mem), w, p, a, c, ' '.join(missingP)])
with open(OUT + '/series_coverage.tsv', 'w') as f:
    wr = csv.writer(f, delimiter='\t')
    wr.writerow(['series', 'n forms', 'W', 'P (P&E via POLLEX)', 'A (Andrews 1922)', 'C>0 (hawwiki)', 'not in POLLEX'])
    for r in rows:
        wr.writerow(r); print('\t'.join(map(str, r)))
print('kāne POLLEX all:', pgloss('kāne'))
print('i/ma/mai POLLEX:', [(x, pgloss(x)[:100]) for x in ['i', 'ma', 'mai', 'no']])
