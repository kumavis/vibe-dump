"""Nested word lists of growing size, for asking how small a list the engine
can carry. Every list starts with the attested compounds (evidence W or A) and
adds Andrews-only candidates in one of three orders:

  realistic  the order a dictionary check would most likely confirm them:
             those in use in Hawaiian Wikipedia first (most used first), then
             the rest at random
  random     at random
  best       most connective first — an optimistic bound

Writes .cache/tiers/curve-<order>-<size>.json with roots as sense ids
(lua#0, lua#1), as in core-morph.json. Run after build_lexicon.py.
"""
import csv
import json
import os
import random

HERE = os.path.dirname(os.path.abspath(__file__))
T = os.path.join(HERE, '.cache', 'tiers')
rows = {r['word']: r for r in csv.DictReader(open(os.path.join(HERE, 'compounds.tsv')), delimiter='\t')}
core = json.load(open(os.path.join(T, 'core-morph.json')))
for r in core:
    m = rows[r['word']]
    r['ev'] = m['evidence']
    r['hw'] = int(m['hawwiki_1w']) + int(m['hawwiki_2w'])
    r['deg'] = int(m['degree'] or 0)

attested = [r for r in core if r['ev'] != 'A*']
pending = [r for r in core if r['ev'] == 'A*']
in_use = sorted((r for r in pending if r['hw'] > 0), key=lambda r: -r['hw'])
unused = [r for r in pending if r['hw'] == 0]
random.Random(7).shuffle(unused)
shuffled = list(pending)
random.Random(11).shuffle(shuffled)
orders = {
    'realistic': attested + in_use + unused,
    'random': attested + shuffled,
    'best': attested + sorted(pending, key=lambda r: -r['deg']),
}
sizes = [len(attested), 175, 225, 300, 400, 500, 650, len(core)]
for name, order in orders.items():
    for n in sizes:
        json.dump([{'word': r['word'], 'parts': r['parts']} for r in order[:n]],
                  open(os.path.join(T, f'curve-{name}-{n}.json'), 'w'), ensure_ascii=False)
print(f'attested {len(attested)}, pending in use {len(in_use)}, pending unused {len(unused)}; sizes {sizes}')
