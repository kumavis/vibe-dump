"""POLLEX: Hawaiian reflexes of reconstructed derivations (*faka-X, *ma-X, *X-ŋa ...) and of reduplicated protoforms."""
import json, re
from collections import Counter
from common import *
d = json.load(open(f'{CACHE}/pollex/hawaiian-reflexes.json'))
pre = Counter(); ex = {}
for x in d:
    p = x['proto_ng'] or x['proto']
    m = re.match(r'\*([a-zŋq]+)-', p)
    if m:
        pre[m.group(1)] += 1; ex.setdefault(m.group(1), []).append(f"{x['haw']} < {p}")
print('reconstructed hyphenated protoforms, first element counts (top):', pre.most_common(15))
for k in ('faka', 'faa', 'ma', 'maa', 'taa', 'paa'):
    print(k, ex.get(k, [])[:12])
suf = Counter()
for x in d:
    p = x['proto_ng'] or x['proto']
    m = re.search(r'-(ŋa|nga|ga|taŋa|ia|a|fia|ŋia|tia|ki)$', p)
    if m: suf[m.group(1)] += 1
print('reconstructed suffixes:', suf)
def redup(p):
    s = p.strip('*').replace('-', '')
    n = len(s)
    return n >= 4 and n % 2 == 0 and s[:n//2] == s[n//2:]
rr = [x for x in d if redup(x['proto_ng'] or x['proto'])]
print('Hawaiian reflexes of fully reduplicated protoforms:', len(rr), [f"{x['haw']}<{x['proto']}" for x in rr[:20]])
hr = [x for x in d if any(len(f) >= 4 and len(f) % 2 == 0 and f[:len(f)//2] == f[len(f)//2:] for f in x['haw_forms'])]
print('Hawaiian reflexes that are themselves XX:', len(hr), '; of which protoform also XX:', sum(redup(x['proto_ng'] or x['proto']) for x in hr))
