"""Reduplication: detect reduplicated forms in the attested lexicon and pair them with an attested base.
Patterns follow Alderete & MacMillan (2015) / Elbert & Pukui (1979) types:
 FULL (whole copy, incl. length alternation), CV-PREFIX, FOOT-PREFIX, FOOT-SUFFIX (with σ1 lengthening allowed),
 CV-INFIX (copy of a CV before the final foot). Curated base from Wiktionary {{redup|haw|X}} etc. is used first.
Writes tables/redup_pairs.tsv and prints counts."""
import json, re, csv
from collections import Counter, defaultdict
from common import *

lex = lexicon()
kk = load_kaikki()

# curated bases from Wiktionary etymology templates
curated = defaultdict(set)
for w, es in kk.items():
    for e in es:
        for t in e['tpls']:
            if t['name'] in ('redup', 'reduplication', 'rdp'):
                b = t.get('args', {}).get('2')
                if b:
                    curated[w].add(norm(b))
            if t['name'] == 'etymon':
                pass
        m = re.search(r'[Rr]eduplication of ([^\s,.(“]+)', e['etym'])
        if m:
            curated[w].add(norm(m.group(1)))

redcat = {w for w, e in lex.items() if 'Hawaiian reduplications' in e['cats']}

def eqs(a, b):
    return shorten(a) == shorten(b)

def first_vowel_variants(x):
    """x with its first vowel shortened or lengthened (A&M σ1 length alternations)"""
    out = {x}
    for i, c in enumerate(x):
        if c in VOW:
            if c in LONG: out.add(x[:i] + LONG[c] + x[i+1:])
            else: out.add(x[:i] + SHORT2LONG[c] + x[i+1:])
            break
    return out

def analyse(w):
    """return list of (pattern, base, red_shape)"""
    s = syllables(w)
    n = len(s)
    res = []
    # FULL: s = X X (length-insensitive)
    if n % 2 == 0 and n >= 2:
        h = n // 2
        X1, X2 = ''.join(s[:h]), ''.join(s[h:])
        if eqs(X1, X2):
            for b in {X2, X1}:
                res.append(('FULL', b, 'whole'))
    # odd syllable counts / partials
    for k in (1, 2):           # reduplicant size in syllables: 1 = σ, 2 = foot (σσ)
        # prefix: s[:k] == s[k:2k]
        if n >= 2 * k + (0 if k == 2 else 1) and eqs(''.join(s[:k]), ''.join(s[k:2*k])):
            b = ''.join(s[k:])
            if n - k >= 2:
                for bb in first_vowel_variants(b):
                    res.append(('CV-PREFIX' if k == 1 else 'FOOT-PREFIX', bb, f'{k}σ'))
        # suffix: s[-k:] == s[-2k:-k]
        if n >= 2 * k + 1 and eqs(''.join(s[-k:]), ''.join(s[-2*k:-k])):
            b = ''.join(s[:-k])
            for bb in first_vowel_variants(b):
                res.append(('σ-SUFFIX' if k == 1 else 'FOOT-SUFFIX', bb, f'{k}σ'))
    # CV-INFIX: identical adjacent σσ not at the left edge; delete one copy
    for i in range(1, n - 1):
        if i + 1 < n and eqs(s[i], s[i+1]) and s[i][-1] in VOW and n >= 4:
            b = ''.join(s[:i] + s[i+1:])
            for bb in first_vowel_variants(b):
                res.append(('CV-INFIX', bb, '1σ'))
    out = []
    seen = set()
    for p, b, sh in res:
        if b in lex and b != w and len(b) >= 2 and (p, b) not in seen and b != 'ʻ':
            seen.add((p, b)); out.append((p, b, sh))
    return out

rows = []
shape_only = []
for w in sorted(lex):
    if '-' in w:
        continue
    found = analyse(w)
    cur = curated.get(w, set())
    for b in cur:
        if b in lex and b != w and not any(f[1] == b for f in found):
            found.append(('CURATED-OTHER', b, '?'))
    s = syllables(w)
    # record formal shape regardless of base (for 'reduplicated-looking' counts)
    if not found:
        n = len(s)
        if (n % 2 == 0 and n >= 2 and eqs(''.join(s[:n//2]), ''.join(s[n//2:]))) or w in redcat:
            shape_only.append(w)
        continue
    # prefer curated base when available
    if cur & {f[1] for f in found}:
        found = [f for f in found if f[1] in cur] + [f for f in found if f[1] not in cur]
    p, b, sh = found[0]
    rows.append({'derived': w, 'base': b, 'pattern': p, 'alt_analyses': ';'.join(f'{x[0]}:{x[1]}' for x in found[1:]),
                 'curated_base': ';'.join(sorted(cur)), 'in_redup_cat': int(w in redcat),
                 'der_W': int(lex[w]['W']), 'der_P': int(lex[w]['P']), 'base_W': int(lex[b]['W']), 'base_P': int(lex[b]['P']),
                 'der_gloss': gl(lex, w, 150), 'base_gloss': gl(lex, b, 150)})

with open(f'{W}/tables/redup_pairs.tsv', 'w') as f:
    wr = csv.DictWriter(f, fieldnames=list(rows[0].keys()), delimiter='\t'); wr.writeheader(); wr.writerows(rows)
with open(f'{W}/tables/redup_shape_no_base.tsv', 'w') as f:
    for w in shape_only:
        f.write(f"{w}\t{int(w in redcat)}\t{gl(lex, w, 120)}\n")

print('lexicon:', len(lex))
print('Wiktionary "Hawaiian reduplications" category members in lexicon:', len(redcat))
print('Wiktionary curated redup bases:', sum(1 for w in curated if w in lex), 'words; base attested:', sum(1 for w, bs in curated.items() if w in lex and any(b in lex for b in bs)))
print('pairs (derived with an attested base, any pattern):', len(rows))
print('  of which curated (Wiktionary names the base):', sum(1 for r in rows if r['base'] in r['curated_base'].split(';')))
print('  of which in redup category:', sum(r['in_redup_cat'] for r in rows))
print('patterns:', Counter(r['pattern'] for r in rows))
print('reduplicated-shape words with no attested base:', len(shape_only))
print('both in POLLEX:', sum(1 for r in rows if r['der_P'] and r['base_P']))
