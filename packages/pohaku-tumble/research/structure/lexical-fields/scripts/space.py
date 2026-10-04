#!/usr/bin/env python3
"""Orientation & space field.  Locative nouns x prepositions (spaced/fused), axis polysemy,
motion-verb/axis correlation, compass terms in toponymic frames."""
from lex import *
import csv
out = []
def P_(*a):
    s = ' '.join(str(x) for x in a); print(s); out.append(s)

LOCS = ['luna', 'lalo', 'loko', 'waho', 'mua', 'hope', 'uka', 'kai', 'waena', 'muli', 'ʻō', 'laila', 'ʻaneʻi']
AXES = [('vertical', 'luna', 'lalo'), ('containment', 'loko', 'waho'), ('sagittal / temporal', 'mua', 'hope'),
        ('island-radial', 'uka', 'kai'), ('lateral / N-S', 'ʻākau', 'hema'), ('sun path / E-W', 'hikina', 'komohana')]
PREPS = ['i', 'ma', 'mai', 'no', 'o']

P_('## 1. sources per term')
with open(OUT + '/space_terms.tsv', 'w') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['term', 'W', 'P', 'A', 'C', 'Wiktionary senses', 'POLLEX'])
    for t in LOCS + ['ʻākau', 'hema', 'hikina', 'komohana', 'mauka', 'makai', 'kahakai', 'alo', 'kua', 'ʻaoʻao', 'waena']:
        e = evidence(t)
        row = [t, int(e['W']), int(e['P']), len(andrews(t)), e['C'], wgloss(t, 12)[:300], pgloss(t)[:200]]
        w.writerow(row); P_('\t'.join(map(str, row)))

P_('\n## 2. PREP x LOC frame (hawwiki): spaced "ma luna" / fused "maluna"')
ph = []
for l in LOCS:
    for p in PREPS:
        ph += [p + ' ' + l, p + l.replace('ʻ', '')]
c = phrases(ph)
with open(OUT + '/space_prep_loc.tsv', 'w') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['loc'] + [p + ' L (spaced/fused)' for p in PREPS] + ['cells attested (either spelling)'])
    for l in LOCS:
        cells = []
        n = 0
        for p in PREPS:
            a, b = c[p + ' ' + l], c[p + l.replace('ʻ', '')]
            cells.append('%d/%d' % (a, b))
            n += (a + b) > 0
        row = [l] + cells + [n]
        w.writerow(row); P_('\t'.join(map(str, row)))

P_('\n## 3. motion verb x locative (does uka:kai pattern with luna:lalo?)')
verbs = ['piʻi', 'iho', 'komo', 'puka', 'hele', 'hoʻi', 'holo', 'lele', 'kū', 'noho']
ph = [v + ' ' + p + ' ' + l for v in verbs for p in ['i', 'ma', 'aku i', 'aʻe i', 'iho i', 'mai', 'aku la i', 'ihola i', 'aʻela i', 'akula i'] for l in ['luna', 'lalo', 'loko', 'waho', 'uka', 'kai', 'mua', 'hope']]
c3 = phrases(ph)
with open(OUT + '/space_verb_loc.tsv', 'w') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['verb'] + ['luna', 'lalo', 'loko', 'waho', 'uka', 'kai', 'mua', 'hope'])
    for v in verbs:
        row = [v]
        for l in ['luna', 'lalo', 'loko', 'waho', 'uka', 'kai', 'mua', 'hope']:
            row.append(sum(n for k, n in c3.items() if k.startswith(v + ' ') and k.endswith(' ' + l)))
        w.writerow(row); P_('\t'.join(map(str, row)))

P_('\n## 4. compass words in toponym frame  X + ʻĀkau / Hema / Hikina / Komohana (hawwiki bigrams)')
uni = unigrams()
big = collections.Counter()
for a in corpus():
    for s in a:
        for i in range(1, len(s)):
            if s[i] in ('ʻākau', 'hema', 'hikina', 'komohana'):
                big[(s[i - 1], s[i])] += 1
heads = collections.defaultdict(dict)
for (x, d), n in big.items():
    heads[x][d] = n
both = {x: d for x, d in heads.items() if len(d) >= 2}
P_('compass tokens:', {d: uni[d] for d in ('ʻākau', 'hema', 'hikina', 'komohana')})
P_('distinct left-neighbours:', len(heads), '; neighbours occurring with >=2 different compass words:', len(both))
for x, d in sorted(both.items(), key=lambda kv: -sum(kv[1].values()))[:40]:
    P_('  ', x, d)
P_('\n  hand/side frame:', phrases(['lima ʻākau', 'lima hema', 'ʻaoʻao ʻākau', 'ʻaoʻao hema', 'ʻaoʻao hikina', 'ʻaoʻao komohana', 'ma ka hema', 'ma ka ʻākau', 'ka ʻākau', 'ka hema', 'wāwae ʻākau', 'wāwae hema', 'maka ʻākau', 'maka hema']))

P_('\n## 5. mua/hope across domains: spatial, temporal, kin, ordinal (Wiktionary senses + corpus phrases)')
for t in ['mua', 'hope', 'muli', 'luna', 'lalo', 'loko', 'waho', 'uka', 'kai', 'ʻākau', 'hema']:
    P_(t, '::', wgloss(t, 20)[:400])
P_(phrases(['wā ma mua', 'wā mamua', 'wā ma hope', 'wā mahope', 'hānau mua', 'hānau hope', 'keiki mua', 'keiki hope', 'ka mua', 'ka hope', 'ma mua o', 'ma hope o', 'mamua o', 'mahope o', 'māhoe mua', 'māhoe hope', 'i mua', 'i hope', 'muli loa', 'hope loa', 'mua loa']))
P_(kwic('wā ma mua', 4), kwic('wā ma hope', 4))

P_('\n## 6. mauka/makai vs ma uka/ma kai')
P_(phrases(['mauka', 'makai', 'ma uka', 'ma kai', 'i uka', 'i kai', 'mai uka', 'mai kai', 'no uka', 'no kai', 'uka', 'kai', 'kahakai', 'kai uli', 'kai hohonu', 'kai pāpaʻu', 'kai lawaiʻa']))
open(OUT + '/space_report.txt', 'w').write('\n'.join(out))
