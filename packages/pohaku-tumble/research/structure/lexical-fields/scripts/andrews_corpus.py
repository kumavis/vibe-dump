#!/usr/bin/env python3
"""Motion verb x locative in older Hawaiian text: the Hawaiian example sentences inside
Andrews-Parker 1922 (OCR) and Alexander 1920 / Andrews 1854 grammars (archive.org djvu text).
Old orthography: no okina/kahako, preposition often fused (iuka, mauka, iluna)."""
import re, collections, os, csv
from lex import CACHE, OUT
SRC = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src')
texts = {'andrews-parker1922': open(os.path.join(CACHE, 'andrews-parker1922.txt'), encoding='utf-8').read(),
         'alexander1920': open(os.path.join(SRC, 'shortsynopsisofm00alexrich.txt'), encoding='utf-8').read(),
         'andrews1854': open(os.path.join(SRC, 'cu31924026915888.txt'), encoding='utf-8').read()}
verbs = {'pii': 'piʻi up', 'iho': 'iho down', 'hele': 'hele go', 'hoi': 'hoʻi return', 'holo': 'holo run/sail', 'komo': 'komo enter', 'puka': 'puka exit', 'lele': 'lele fly/jump', 'kau': 'kau place/mount', 'pae': 'pae land'}
locs = ['luna', 'lalo', 'loko', 'waho', 'uka', 'kai', 'mua', 'hope']
tot = collections.Counter()
rows = []
for name, t in texts.items():
    toks = re.findall(r"[a-z]+", t.lower().replace('-\n', ''))
    c = collections.Counter()
    for i in range(len(toks) - 3):
        v = toks[i]
        if v not in verbs:
            continue
        # allow one directional particle between verb and locative phrase
        j = i + 1
        if toks[j] in ('aku', 'ae', 'mai', 'iho', 'la', 'ana', 'akula', 'ihola', 'aela', 'maila') and v != toks[j]:
            j += 1
            if toks[j] == 'la':
                j += 1
        w1, w2 = toks[j], toks[j + 1]
        for l in locs:
            if w1 in ('i' + l, 'ma' + l) or (w1 in ('i', 'ma') and w2 == l):
                c[(v, l)] += 1
    tot.update(c)
with open(OUT + '/space_verb_loc_oldtext.tsv', 'w') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['verb'] + locs)
    print('verb\t' + '\t'.join(locs))
    for v in verbs:
        row = [verbs[v]] + [tot[(v, l)] for l in locs]
        w.writerow(row); print('\t'.join(map(str, row)))
# fused vs spaced iuka/mauka/ikai/makai in Andrews-Parker
t = texts['andrews-parker1922'].lower()
for f in ['iuka', 'i uka', 'mauka', 'ma uka', 'ikai', 'i kai', 'makai', 'ma kai', 'mai uka', 'mai kai', 'iluna', 'ilalo', 'maluna', 'malalo', 'iloko', 'iwaho', 'imua', 'ihope', 'mamua', 'mahope']:
    print(f, len(re.findall(r'\b' + f + r'\b', t)))
