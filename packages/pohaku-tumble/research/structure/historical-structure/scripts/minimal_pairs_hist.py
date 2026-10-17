"""Hawaiian ʻokina / kahakō minimal pairs among POLLEX (P&E-spelled) reflexes, checked against their etyma.
Pair = two distinct Hawaiian forms that differ by exactly one ʻokina (insert/delete) or one vowel length, everything else equal.
For each pair: are the etyma the SAME POLLEX root (one built on the other: shared hyphen part, or one proto contained in the other)
or UNRELATED?  And where does the contrast come from historically?
 ʻ : Ø  -> expected *k : (*q | *h | Ø)
 V̄ : V  -> PPN long vowel or VqV/VhV contraction vs short."""
import collections, json, re, unicodedata, itertools
from common import *
d = load_pollex()
def nfc(s): return unicodedata.normalize('NFC', s)
forms = collections.defaultdict(list)
for x in d:
    for f in x['haw_forms']:
        f = nfc(f.lower())
        if re.fullmatch(r'[a-zāēīōūʻ]+', f):
            forms[f].append((x['proto_ng'], x['proto_gloss'][:35], x['haw_gloss'][:35]))
MAC = {'ā': 'a', 'ē': 'e', 'ī': 'i', 'ō': 'o', 'ū': 'u'}
def short(s): return ''.join(MAC.get(c, c) for c in s)
def related(p1, p2):
    """same etymon (identical proto string) or a shared hyphen-delimited morpheme where at least one protoform
    is segmented (*kau-matua / *kau-matua, *te-o-ku / *te-o-u, *-ku / *-u share the paradigm slot)"""
    if p1 == p2: return True
    a = [m for m in p1.lstrip('*').split('-') if m]; b = [m for m in p2.lstrip('*').split('-') if m]
    if ('-' in p1.strip('*-') or '-' in p2.strip('*-')) and set(a) & set(b) - {'a', 'qa', 'o'}:
        return True
    if p1.startswith('*-') and p2.startswith('*-'):   # two pronominal suffixes of one paradigm
        return True
    return False
fl = list(forms)
okina, length = [], []
idx = collections.defaultdict(list)
for f in fl: idx[short(f).replace('ʻ', '')].append(f)
for k, group in idx.items():
    for a, b in itertools.combinations(group, 2):
        if a.replace('ʻ', '') == b.replace('ʻ', '') and abs(a.count('ʻ') - b.count('ʻ')) == 1 and short(a) != short(b) or \
           (a.replace('ʻ', '') == b.replace('ʻ', '') and abs(a.count('ʻ') - b.count('ʻ')) == 1 and a.replace('ʻ','') == b.replace('ʻ','')):
            okina.append((a, b))
        elif short(a) == short(b) and a.count('ʻ') == b.count('ʻ') and sum(c in MAC for c in a) != sum(c in MAC for c in b) \
                and abs(sum(c in MAC for c in a) - sum(c in MAC for c in b)) == 1:
            length.append((a, b))
def summarize(pairs, label):
    rel = 0; rows = []
    for a, b in pairs:
        r = any(related(p, q) for p, _, _ in forms[a] for q, _, _ in forms[b])
        rel += r
        rows.append((r, a, b, forms[a][0], forms[b][0]))
    print(f'\n{label}: {len(pairs)} pairs; etyma related {rel}; unrelated {len(pairs)-rel}')
    for r in sorted(rows, key=lambda t: not t[0])[:40]:
        print(f"  {'REL' if r[0] else '   '} {r[1]:10} {r[3][0]:14} “{r[3][2]}”  |  {r[2]:10} {r[4][0]:14} “{r[4][2]}”")
    return rows
o = summarize(okina, 'ʻokina minimal pairs (ʻ vs Ø, one position)')
l = summarize(length, 'kahakō minimal pairs (long vs short, one position)')
json.dump({'okina': [r[1:3] + (r[0],) for r in o], 'length': [r[1:3] + (r[0],) for r in l]}, open(f'{OUT}/minimal_pairs_hist.json', 'w'), ensure_ascii=False, indent=0)
