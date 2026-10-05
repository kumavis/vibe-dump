"""Distribution of hoʻo- allomorphs by the base's initial segment (Harris-style distributional table).
Uses curated pairs only (Wiktionary etymology analyses, base attested) plus manual-sample-confirmed formal pairs.
Allomorph is read off the surface: derived = PREFIX + (base, possibly with ʻ deleted / vowel lengthened)."""
import csv, json
from collections import Counter, defaultdict
from common import *

rows = list(csv.DictReader(open(f'{W}/tables/hoo_pairs.tsv'), delimiter='\t'))
codes = {(r['derived'], r['base']): r['value'] for r in csv.DictReader(open(f'{W}/tables/codes_hoo.tsv'), delimiter='\t')}

def init_class(b):
    if b[0] == OK:
        return 'ʻ + long V' if b[1] in LONG else 'ʻ + short V'
    if b[0] in LONG: return 'long V'
    if b[0] in VOW: return f'short {b[0]}'
    return 'C (not ʻ)'

def surface(d, b):
    """classify the surface allomorph"""
    if d == 'hoʻo' + b: return 'hoʻo-'
    if d == 'hō' + b: return 'hō- (base ʻ kept)' if b[0] == OK else 'hō-'
    if b[0] == OK and d == 'hōʻ' + b[1:]: return 'hō- (base ʻ kept)'
    if b[0] in VOW and d == 'hoʻ' + b: return 'hoʻ- (o elided)'
    if b[0] in VOW and b[0] in SHORT2LONG and d == 'hoʻ' + SHORT2LONG[b[0]] + b[1:]: return 'hoʻ- + V lengthened'
    if b[0] == OK and d == 'hoʻ' + b[1:]: return 'hoʻ- (base ʻ lost)'
    if b[0] == OK and b[1] in SHORT2LONG and d == 'hoʻ' + SHORT2LONG[b[1]] + b[2:]: return 'hoʻ- + V lengthened (base ʻ lost)'
    if b[0] in VOW and d == 'hōʻ' + b: return 'hōʻ- (before V)'
    if d == 'hoʻo' + b[1:] and b[0] == OK: return 'hoʻo- (base ʻ lost)'
    return 'other'

tab = defaultdict(Counter)
examples = defaultdict(list)
used = 0
for r in rows:
    key = (r['derived'], r['base'])
    if not (r['src_wikt_analysis'] == '1' or codes.get(key) not in (None, 'SPUR')):
        continue
    if codes.get(key) == 'SPUR':
        continue
    used += 1
    ic = init_class(r['base']); s = surface(r['derived'], r['base'])
    tab[ic][s] += 1
    if len(examples[(ic, s)]) < 4:
        examples[(ic, s)].append(f"{r['base']}→{r['derived']}")
cols = sorted({s for c in tab.values() for s in c}, key=lambda s: -sum(tab[i][s] for i in tab))
order = ['C (not ʻ)', 'short a', 'short e', 'short i', 'short o', 'short u', 'long V', 'ʻ + short V', 'ʻ + long V']
with open(f'{W}/tables/hoo_allomorphy.tsv', 'w') as f:
    f.write('base_initial\t' + '\t'.join(cols) + '\ttotal\n')
    for ic in order:
        if ic in tab:
            f.write(ic + '\t' + '\t'.join(str(tab[ic][s]) for s in cols) + f'\t{sum(tab[ic].values())}\n')
print('pairs used:', used)
print('%-14s' % 'initial', ' | '.join(cols))
for ic in order:
    if ic in tab:
        print('%-14s' % ic, ' | '.join(f'{tab[ic][s]:>3}' for s in cols), ' total', sum(tab[ic].values()))
for k, v in sorted(examples.items()):
    print(k, v)
