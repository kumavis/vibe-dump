#!/usr/bin/env python3
"""Colour field: which colour words are reduplications of a root, what the bare root means,
prefixed forms (hā-, ʻā-, ʻō-), and loans.  Also scans Wiktionary for every Hawaiian word
whose gloss names a colour, to size the field."""
from lex import *
import csv, re
out = []
def P_(*a):
    s = ' '.join(str(x) for x in a); print(s); out.append(s)
COL = r'\b(red|white|black|blue|green|yellow|grey|gray|brown|purple|pink|orange|dark colou?r|colou?r)\b'
P_('## 1. every Wiktionary headword with a colour gloss')
hits = []
for w, es in W().items():
    for e in es:
        for g in e['glosses']:
            if re.search(COL, g, re.I) and len(g) < 90 and 'colou' in g.lower() or re.match(r'^(light |dark |bright |deep )?(red|white|black|blue|green|yellow|grey|gray|brown|purple|pink|orange)\b', g, re.I):
                hits.append((w, e['pos'], g)); break
hits = sorted(set(hits))
for h in hits:
    P_('  ', *h)
P_('n =', len(set(h[0] for h in hits)))

def redup_root(w):
    s = w
    n = len(s)
    for k in range(2, n // 2 + 1):
        if n % k == 0 and s == s[:k] * (n // k):
            return s[:k]
    if n % 2 == 0 and s[:n // 2] == s[n // 2:]:
        return s[:n // 2]
    return None

P_('\n## 2. core terms: shape, bare root, root senses')
core = ['keʻokeʻo', 'ʻeleʻele', 'ʻulaʻula', 'uliuli', 'melemele', 'lenalena', 'ʻōmaʻomaʻo', 'hinahina', 'ʻāhinahina', 'poni', 'ʻākala', 'mākuʻe', 'polū', 'ʻalani', 'ʻākalakala', 'ʻōlenalena', 'hāʻulaʻula', 'hāuliuli', 'ʻāʻā', 'lehu', 'kea', 'lena', 'ʻula', 'uli', 'mele', 'keʻo', 'ʻele', 'maʻo', 'hina', 'kala', 'ʻōpalapala', 'pālaunu', 'ʻāhiehie', 'ʻālani', 'ʻōmaʻo', 'kuʻe']
with open(OUT + '/colour_terms.tsv', 'w') as f:
    w = csv.writer(f, delimiter='\t')
    w.writerow(['term', 'shape', 'root', 'C(term)', 'C(root)', 'W(term)', 'W(root senses)', 'POLLEX(term)', 'POLLEX(root)'])
    for t in core:
        body = t
        pre = ''
        for p in ('ʻā', 'ʻō', 'hā'):
            if t.startswith(p) and redup_root(t[len(p):]):
                pre, body = p, t[len(p):]
        r = redup_root(body)
        shape = ('%s- + ' % pre if pre else '') + ('RR' if r else 'simple')
        root = r or ''
        row = [t, shape, root, count(t), count(root) if root else '', wgloss(t, 5)[:110], wgloss(root, 8)[:200] if root else '', pgloss(t)[:120], pgloss(root)[:200] if root else '']
        w.writerow(row); P_('\t'.join(map(str, row)))

P_('\n## 3. bare root vs reduplicated in N + colour compounds (hawwiki counts)')
nouns = ['kai', 'lepo', 'ʻāina', 'pua', 'lau', 'wai', 'ao', 'hulu', 'ʻili', 'maka', 'lole', 'pōhaku', 'one', 'moana']
pairs = [('ʻula', 'ʻulaʻula'), ('uli', 'uliuli'), ('keʻo', 'keʻokeʻo'), ('ʻele', 'ʻeleʻele'), ('mele', 'melemele'), ('lena', 'lenalena'), ('maʻo', 'ʻōmaʻomaʻo'), ('kea', 'keʻokeʻo')]
ph = [n + ' ' + x for n in nouns for p in pairs for x in p]
c = phrases(ph)
for r, rr in pairs:
    a = {n: c[n + ' ' + r] for n in nouns if c[n + ' ' + r]}
    b = {n: c[n + ' ' + rr] for n in nouns if c[n + ' ' + rr]}
    P_(r, a, '||', rr, b)
P_('kea', wgloss('kea'), pgloss('kea'))
open(OUT + '/colour_report.txt', 'w').write('\n'.join(out))
