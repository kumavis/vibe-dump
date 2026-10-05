"""Andrews–Parker 1922 (OCR, no ʻokina/kahakō): sizes of the hoʻo- and reduplication classes
and how often the dictionary itself names the base ("[Hoo and X" / "Freq. of X" / "Redup")."""
import re
from collections import Counter
from common import *

A = load_andrews()
heads = set(A)
hoo = [h for h in heads if h.startswith('hoo') and len(h) > 4]
ho_ = [h for h in heads if h.startswith('ho') and not h.startswith('hoo') and len(h) > 3]
hoo_br = {}
for h in hoo + ho_:
    for t in A[h]:
        m = re.search(r'\[\s*Hoo,?\s+(?:and|&)\s+([a-z]+)', t)
        if m:
            hoo_br[h] = m.group(1)
print('Andrews headword types (unmarked spelling):', len(heads), ' entries:', sum(len(v) for v in A.values()))
print('hoo- initial headword types:', len(hoo))
print('  with Andrews bracket "[Hoo and X": ', sum(1 for h in hoo if h in hoo_br))
print('  base X itself an Andrews headword:', sum(1 for h, b in hoo_br.items() if b in heads))
strip_base = [h for h in hoo if h[3:] in heads]
print('hoo-X where X is an Andrews headword (formal):', len(strip_base), f'({len(strip_base)/len(hoo):.0%})')
# haa-
haa = [h for h in heads if h.startswith('haa') and len(h) > 4]
print('haa- initial headwords:', len(haa), ' haa-X with X headword:', sum(1 for h in haa if h[3:] in heads))
# reduplication marking
freq = {}
for h, ts in A.items():
    for t in ts:
        m = re.search(r'(?:Freq|Redup|Intens)[a-z]*\.?\s+(?:of\s+)?([a-z]+)', t[:200])
        if m:
            freq[h] = m.group(1)
print('Andrews entries citing Freq./Redup./Intens. of X:', len(freq), ' with X a headword:', sum(1 for h, b in freq.items() if b in heads))
full = [h for h in heads if len(h) >= 4 and len(h) % 2 == 0 and h[:len(h)//2] == h[len(h)//2:]]
print('Andrews headwords of exact XX shape:', len(full), ' with X a headword:', sum(1 for h in full if h[:len(h)//2] in heads))
kinds = Counter(re.search(r'(Freq|Redup|Intens)', t[:200]).group(1) for h, ts in A.items() for t in ts if re.search(r'(Freq|Redup|Intens)', t[:200]))
print('marker kinds:', kinds)
import json
json.dump({'hoo_bracket': hoo_br, 'freq': freq}, open(f'{W}/tables/andrews_analyses.json', 'w'), ensure_ascii=False, indent=0)
