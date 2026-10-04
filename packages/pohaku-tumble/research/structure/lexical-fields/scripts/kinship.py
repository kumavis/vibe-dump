#!/usr/bin/env python3
"""Kinship field: componential matrix, attestation, the GEN x SEX frame, the kai- paradigm,
and the a/o possessive correlate.  Writes tables/kinship_*.tsv and prints a report."""
from lex import *
import itertools, csv

out = []
def P_(*a):
    s = ' '.join(str(x) for x in a); print(s); out.append(s)

# ---- 1. componential matrix (features from Wiktionary/POLLEX glosses + Handy & Pukui/Morgan descriptions)
# GEN: +2,+1,0,-1,-2 ; SEX = sex of referent ; RSEX = sex of referent relative to ego (par/cross) ; AGE = relative age
M = [
 # term, GEN, SEX, RSEX, AGE, source of components
 ('kupuna',      '+2', '±', '·', '·'),
 ('makua',       '+1', '±', '·', '·'),
 ('makuahine',   '+1', 'F', '·', '·'),
 ('kaikuaʻana',  '0',  '=ego', 'parallel', 'older'),
 ('kaikaina',    '0',  '=ego', 'parallel', 'younger'),
 ('kaikunāne',   '0',  'M', 'cross', '·'),
 ('kaikuahine',  '0',  'F', 'cross', '·'),
 ('kaikoʻeke',   '0 (affine)', '=ego', 'parallel', '·'),
 ('keiki',       '-1', '±', '·', '·'),
 ('kaikamahine', '-1', 'F', '·', '·'),
 ('moʻopuna',    '-2', '±', '·', '·'),
]
with open(OUT + '/kinship_matrix.tsv', 'w') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['term', 'GEN', 'SEX(referent)', 'RSEX(rel. to ego)', 'AGE(rel. to ego)', 'W', 'P(P&E)', 'A', 'C(hawwiki)', 'W gloss', 'POLLEX gloss / proto'])
    P_('## 1. matrix')
    for t, *feat in M:
        e = evidence(t)
        row = [t] + feat + [int(e['W']), int(e['P']), len(andrews(t)), e['C'], wgloss(t, 4)[:90], pgloss(t)[:120]]
        w.writerow(row); P_('\t'.join(map(str, row)))

# ---- 2. GEN x SEX frame: [kin noun] + [kāne | wahine]
gens = ['kupuna', 'makua', 'keiki', 'moʻopuna', 'kaikuaʻana', 'kaikaina', 'hoahānau', 'kama', 'kamaliʻi', 'pōkiʻi']
sexes = ['kāne', 'wahine']
cands = []
for g in gens:
    for s in sexes:
        cands += [g + ' ' + s]
    cands += [g + 'kāne', g + 'hine', g + 'wahine']
cands += ['kaikamahine', 'kaikamāhine', 'keiki kāne', 'keiki wahine', 'kāne', 'wahine', 'mākua kāne', 'mākua wahine', 'kūpuna kāne', 'kūpuna wahine', 'makua wahine']
cnt = phrases(cands)
P_('\n## 2. GEN x SEX frame (hawwiki counts; spaced vs fused spelling)')
with open(OUT + '/kinship_gen_sex.tsv', 'w') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['gen noun', '+ kāne (spaced)', 'fused -kāne', '+ wahine (spaced)', 'fused -wahine', 'fused -hine', 'W(fused -kāne)', 'W(fused -hine)', 'A(stripped X+kane)', 'A(stripped X+hine/wahine)'])
    for g in gens:
        row = [g, cnt[g + ' kāne'], cnt[g + 'kāne'], cnt[g + ' wahine'], cnt[g + 'wahine'], cnt[g + 'hine'],
               int(bool(wikt(g + 'kāne') or wikt(g + ' kāne'))), int(bool(wikt(g + 'hine') or wikt(g + ' wahine') or wikt(g+'wahine'))),
               len(andrews(g + 'kane')), len(andrews(g + 'hine')) + len(andrews(g + 'wahine'))]
        w.writerow(row); P_('\t'.join(map(str, row)))
for k in ['kaikamahine', 'kaikamāhine', 'mākua kāne', 'kūpuna kāne', 'kūpuna wahine', 'makua wahine']:
    P_(k, cnt[k])

# ---- 3. the kai- paradigm
P_('\n## 3. kai- paradigm (Wiktionary entries whose etymology says kai- kinship prefix, and kaika-)')
kai = sorted(w for w, es in W().items() if any('kai-' in e['etym'] and 'kinship' in e['etym'] for e in es))
for t in kai:
    P_(t, '|', wgloss(t, 3)[:100], '| C=', count(t))
P_('kaikamahine etym:', [e['etym'] for e in wikt('kaikamahine')])

# ---- 4. a/o possessive class per kin term (3sg kona/kāna, 1sg koʻu/kaʻu, 2sg kou/kāu)
P_('\n## 4. a- vs o-class possessor with each kin term (hawwiki)')
kin = ['kupuna', 'kūpuna', 'makua', 'mākua', 'makuahine', 'makuakāne', 'kaikuaʻana', 'kaikaina', 'kaikunāne', 'kaikuahine', 'keiki', 'kamaliʻi',
       'kaikamahine', 'moʻopuna', 'kāne', 'wahine', 'ʻohana', 'hoahānau', 'pōkiʻi']
A_ = ['kāna', 'kaʻu', 'kāu', 'kā']
O_ = ['kona', 'koʻu', 'kou', 'ko']
ph = [p + ' ' + k for k in kin for p in A_ + O_] + [p + ' mau ' + k for k in kin for p in A_ + O_]
c4 = phrases(ph)
with open(OUT + '/kinship_ao.tsv', 'w') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['kin term', 'a-class (kāna/kaʻu/kāu/kā [mau])', 'o-class (kona/koʻu/kou/ko [mau])', 'share a'])
    for k in kin:
        a = sum(c4[p + ' ' + k] + c4[p + ' mau ' + k] for p in A_)
        o = sum(c4[p + ' ' + k] + c4[p + ' mau ' + k] for p in O_)
        row = [k, a, o, '%.2f' % (a / (a + o)) if a + o else '-']
        w.writerow(row); P_('\t'.join(map(str, row)))
open(OUT + '/kinship_report.txt', 'w').write('\n'.join(out))
