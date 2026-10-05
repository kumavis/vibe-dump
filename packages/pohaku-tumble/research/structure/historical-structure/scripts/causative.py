"""*faka- -> Hawaiian hoʻo- / hō- / hoʻ- / haʻa-: allomorph vs base-initial segment.
Data: Wiktionary heads (a head beginning with an allomorph whose remainder is itself a head) and POLLEX *faka-/*faa- rows."""
import json, collections, unicodedata, re
from common import *
W = json.load(open(WIKT))['heads']; P = load_pollex()
heads = {unicodedata.normalize('NFC', k) for k in W}
def cls(seg):
    if seg.startswith('ʻ'): return 'ʻ'
    if seg[0] in 'aāeēiīoōuū': return 'V:' + unicodedata.normalize('NFD', seg[0])[0]
    return 'C'
tab = collections.defaultdict(collections.Counter); ex = collections.defaultdict(list)
for h in heads:
    for pre in ['hoʻo', 'hō', 'hoʻ', 'haʻa']:
        if h.startswith(pre) and len(h) > len(pre) + 1:
            base = h[len(pre):]
            if base in heads:
                # avoid double count: hoʻo + base where base starts with 'o' would also be hoʻ + 'o...'
                tab[pre][cls(base)] += 1
                if len(ex[(pre, cls(base))]) < 5: ex[(pre, cls(base))].append(f'{h} = {pre}+{base}')
for pre in tab:
    print(pre, dict(tab[pre]))
for k, v in sorted(ex.items()): print(k, v)
print('\nPOLLEX *faka-/*faa- rows:')
c = collections.Counter()
for x in P:
    if x['proto_ng'].startswith(('*faka-', '*faa-')):
        h = to_okina(x['haw_raw'].split(',')[0]).lower()
        base = x['proto_ng'].split('-', 1)[1] or '?'
        allo = 'hoʻo' if h.startswith('hoʻo') else 'hō' if h.startswith('hō') else 'hoʻ' if h.startswith('hoʻ') else 'haʻa' if h.startswith('haʻa') else 'hā' if h.startswith('hā') else h[:3]
        c[(x['proto_ng'].split('-')[0], allo, 'base *' + ('k' if base.startswith('k') else 'V/q/h' if base[0] in 'aeiouqh' else 'C'))] += 1
        print(f'  {h:18} {x["proto_ng"]:16} {x["level"]}')
print(c)
