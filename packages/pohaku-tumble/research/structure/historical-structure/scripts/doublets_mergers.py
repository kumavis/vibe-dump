"""Doublets and merger-homonyms in POLLEX Hawaiian reflexes.

A. Doublets: one POLLEX entry (pollex_id) -> two or more distinct Hawaiian forms (P&E spellings).
   Classified by how the forms differ.
B. Merger homonyms: one Hawaiian form (modern spelling) reflecting two or more DIFFERENT protoform strings
   (different POLLEX entries). Classified by which proto contrast the merger erased:
   - identical proto strings (homonymy already in the protolanguage, e.g. *mata 'eye' / *mata 'raw')
   - differ only by Hawaiian mergers: *r/*l, *f/*s(/*h at PCE), *q/*h/Ø, *ŋ/*n
   - other (length, irregular, partial)
"""
import collections, json, re, unicodedata
from common import *

d = load_pollex()

def nfc(s): return unicodedata.normalize('NFC', s)

def haw_forms(x):
    out = []
    for f in x['haw_forms']:
        f = nfc(f.lower()).strip()
        if re.fullmatch(r"[a-zāēīōūʻ]+", f):
            out.append(f)
    return out

# ---- A. doublets
by_id = collections.defaultdict(set)
gl = {}
for x in d:
    for f in haw_forms(x):
        by_id[(x['pollex_id'], x['proto_ng'])].add(f)
        gl[(x['pollex_id'], f)] = x['haw_gloss']

def strip_marks(s):
    s = unicodedata.normalize('NFD', s); s = ''.join(c for c in s if unicodedata.category(c) != 'Mn'); return s.replace('ʻ', '')

def classify_pair(a, b):
    if a in b or b in a:
        sa, sb = sorted([a, b], key=len)
        if sb == sa + sa or sb.endswith(sa) and len(sb) > len(sa):
            return 'reduplication/affix (one contains the other)'
        return 'reduplication/affix (one contains the other)'
    if strip_marks(a) == strip_marks(b):
        if a.replace('ʻ', '') == b.replace('ʻ', ''):
            return 'ʻokina only'
        return 'kahakō (length) only' if a.count('ʻ') == b.count('ʻ') else 'ʻokina and length'
    if len(a) == len(b):
        diff = [(p, q) for p, q in zip(a, b) if p != q]
        if all(set(x) == {'l', 'n'} for x in diff): return 'l ~ n'
        if all(set(x) <= {'k', 'ʻ'} for x in diff): return 'k ~ ʻ'
        if all(set(x) <= {'w', 'v'} for x in diff): return 'w ~ v'
        if all(p in 'aeiou' and q in 'aeiou' for p, q in diff): return 'vowel quality'
    return 'other'

dbl = []
kinds = collections.Counter()
for (pid, proto), forms in by_id.items():
    if len(forms) < 2: continue
    fs = sorted(forms)
    k = classify_pair(fs[0], fs[1]) if len(fs) == 2 else 'three+ forms'
    kinds[k] += 1
    dbl.append((k, pid, proto, fs, [gl[(pid, f)][:40] for f in fs]))

# ---- B. merger homonyms
by_form = collections.defaultdict(dict)
for x in d:
    for f in haw_forms(x):
        by_form[f][x['pollex_id']] = (x['proto_ng'].lstrip('*').replace('-', ''), x['level'], x['proto_gloss'][:30])

import itertools
RULES = {'*r/*l': lambda p: p.replace('r', 'l'), '*s/*f': lambda p: p.replace('s', 'f'),
         '*ŋ/*n': lambda p: p.replace('ŋ', 'n'), '*q,*h/Ø': lambda p: p.replace('q', '').replace('h', '')}
def apply(p, names):
    for n in names: p = RULES[n](p)
    return p
def contrast(p1, p2):
    """smallest set of Hawaiian mergers that makes two protoforms identical"""
    if p1 == p2: return 'same proto string (homonymy already in protolanguage)'
    names = list(RULES)
    for k in range(1, len(names) + 1):
        for sub in itertools.combinations(names, k):
            if apply(p1, sub) == apply(p2, sub):
                return 'erased by Hawaiian merger: ' + ' + '.join(sub)
    sh = lambda p: re.sub(r'([aeiou])\1', r'\1', apply(p, names))
    if sh(p1) == sh(p2):
        return 'differ in length (P&E spelling identical)'
    return 'other (irregular / partial reflex)'

hom = []
hk = collections.Counter()
for f, ids in by_form.items():
    protos = {}
    for pid, (p, lv, g) in ids.items():
        protos.setdefault(p, []).append((pid, lv, g))
    if len(ids) < 2: continue
    plist = list(protos)
    # classify every pair of distinct entries; report the "most informative" class for the form
    classes = set()
    for i in range(len(plist)):
        for j in range(i + 1, len(plist)):
            classes.add(contrast(plist[i], plist[j]))
    if len(plist) == 1:
        classes.add(contrast(plist[0], plist[0]))
    for c in classes: hk[c] += 1
    hom.append((f, sorted(classes), [(pid, '*' + p, lv, g) for p, v in protos.items() for pid, lv, g in v]))

lines = ['## A. Doublets (one POLLEX entry -> 2+ Hawaiian forms)\n', f'entries with 2+ Hawaiian forms: {len(dbl)}\n']
lines += [f'- {k}: {v}' for k, v in kinds.most_common()]
lines.append('\n| kind | protoform | Hawaiian forms | glosses |\n|---|---|---|---|')
for k, pid, proto, fs, g in sorted(dbl):
    lines.append(f"| {k} | {proto} | {' / '.join(fs)} | {' / '.join(g)} |")
lines.append('\n## B. Merger homonyms (one Hawaiian form <- 2+ POLLEX entries)\n')
lines.append(f'Hawaiian forms reflecting 2+ POLLEX entries: {len(hom)} (of {len(by_form)} distinct Hawaiian forms)\n')
lines += [f'- {k}: {v} forms' for k, v in hk.most_common()]
lines.append('\n| Hawaiian | contrast(s) erased | etyma |\n|---|---|---|')
for f, cl, et in sorted(hom, key=lambda r: (r[1], r[0])):
    if any('merger' in c for c in cl):
        lines.append(f"| {f} | {'; '.join(cl)} | {'; '.join(f'{p} {lv} “{g}”' for pid, p, lv, g in et)} |")
txt = '\n'.join(lines)
open(f'{OUT}/doublets_mergers.md', 'w').write(txt)
print('\n'.join(lines[:12])); print('...')
print('\n'.join(l for l in lines if l.startswith('- ')))
