"""Seeded sample of Andrews 1922 entries that label themselves 'Freq. of X' (X an Andrews headword), with both definitions,
for coding whether the derived meaning is in fact frequentative/iterative."""
import json, random, re
from common import *
A = load_andrews()
an = json.load(open(f'{W}/tables/andrews_analyses.json'))
fr = {h: b for h, b in an['freq'].items() if b in A}
random.seed(20261004)
keys = random.sample(sorted(fr), 40)
for i, h in enumerate(keys, 1):
    b = fr[h]
    print(f'{i}. {h} <- {b}')
    print('   D:', A[h][0][:300])
    print('   B:', A[b][0][:220])
