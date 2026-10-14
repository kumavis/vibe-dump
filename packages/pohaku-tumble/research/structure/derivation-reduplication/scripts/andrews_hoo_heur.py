"""Large-n heuristic check of hoʻo- semantics on Andrews 1922: entries whose own etymology says [Hoo and X ...].
Classify the first sense (text after the bracket, up to the first '2.') by keywords. Heuristic: under-counts causatives
glossed with a plain English transitive verb (e.g. 'to enlarge'), so it is a LOWER bound for CAUS."""
import json, re, random
from collections import Counter
from common import *
A = load_andrews()
an = json.load(open(f'{W}/tables/andrews_analyses.json'))['hoo_bracket']
cnt = Counter(); ex = {}
for h, b in an.items():
    t = A[h][0]
    m = re.search(r'\[\s*Hoo,?\s+(?:and|&)\s+[^\]]*\]\s*(.*)', t)
    if not m: cnt['no-def'] += 1; continue
    d = m.group(1)
    d = re.split(r'\s2\.\s|\s[A-Z][a-z]+\s+\(', d)[0][:160].lower()
    if re.search(r'\bcaus|\bto make\b|\bmake\b|\brender\b|\bto let\b|\bto give\b|\bto put\b|\bto set\b', d): k = 'CAUS-keyword'
    elif re.search(r'pretend|feign|\bact(ing)? (as|like)\b|imitat|simulat|\bplay (the )?|\bassume\b|like a\b|affect', d): k = 'SIM-keyword'
    else: k = 'neither'
    cnt[k] += 1
    ex.setdefault(k, []).append((h, b, d[:90]))
n = sum(v for k, v in cnt.items() if k != 'no-def')
print('Andrews entries with [Hoo and X]:', len(an), dict(cnt))
for k in ('CAUS-keyword', 'SIM-keyword', 'neither'):
    print(f'  {k}: {cnt[k]}/{n} = {cnt[k]/n:.0%}')
random.seed(20261004)
print('sample of "neither" (to judge how many are causatives glossed without a keyword):')
for x in random.sample(ex['neither'], 25): print('   ', x)
