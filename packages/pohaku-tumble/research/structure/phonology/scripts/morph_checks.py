#!/usr/bin/env python3
"""Where has a phonological difference been morphologized?
1. plural by vowel lengthening (Wiktionary forms lists + POLLEX "plural" rows)
2. possessive grid {Ø,k,n} x {a,o} x {1sg,2sg,3sg}  (Wiktionary, POLLEX, corpus counts)
3. pronoun grid {k,m,ʻo,l} x {dual,plural}
4. demonstrative grid {kē,pē,Ø} x {proximal, addressee, distal}
5. article ka/ke: conditioned by the following word (corpus bigrams)
6. causative hoʻo-/hō- by stem-initial segment (Wiktionary)
Writes morph_checks.json and prints tables.
"""
import json, os, collections, re, math
HERE = os.path.dirname(os.path.abspath(__file__))
OK = 'ʻ'
LV = 'āēīōū'; SV = 'aeiou'
L2S = dict(zip(LV, SV))
lex = json.load(open(os.path.join(HERE, 'lexicon.json')))
corp = json.load(open(os.path.join(HERE, 'corpus_counts.json')))
big = json.load(open(os.path.join(HERE, 'corpus_bigrams.json')))
px = json.load(open('roots/.cache/pollex/hawaiian-reflexes.json'))
pxby = collections.defaultdict(list)
for r in px:
    for f in (r.get('haw_forms') or [r['haw']]):
        pxby[f].append(r)
out = {}


def vowels(w):
    return [i for i, c in enumerate(w) if c in SV + LV]


# ---------- 1. plurals
plur = []
for w, r in lex.items():
    for e in r['entries']:
        for f, tags in e['forms']:
            if 'plural' in tags:
                plur.append((w, f, e['pos']))
rows = []
for sg, pl, pos in sorted(set(plur)):
    kind = 'other'
    pos_from_end = None
    if len(sg) == len(pl):
        diff = [i for i in range(len(sg)) if sg[i] != pl[i]]
        if len(diff) == 1 and L2S.get(pl[diff[0]]) == sg[diff[0]]:
            kind = 'lengthening'
            vs = vowels(sg)
            pos_from_end = len(vs) - vs.index(diff[0])
    elif pl.endswith(sg) or pl.startswith(sg) or (len(pl) > len(sg) and sg in pl):
        kind = 'reduplication/affix'
    rows.append({'sg': sg, 'pl': pl, 'pos': pos, 'kind': kind, 'vowel_from_end': pos_from_end,
                 'corpus_sg': corp.get(sg, 0), 'corpus_pl': corp.get(pl, 0),
                 'pollex_pl': [(x['proto_ng'], x['proto_gloss'][:40]) for x in pxby.get(pl, [])]})
out['plurals'] = rows
# POLLEX rows glossed as plural
out['pollex_plural_rows'] = [(r['haw'], r['haw_gloss'], r['proto_ng'], r['level'], r['proto_gloss']) for r in px
                             if re.search(r'plural', r['haw_gloss'] + ' ' + r['proto_gloss'], re.I)]
# any Wiktionary "plural of" sense not covered above
out['wikt_plural_of'] = sorted({(w, e['form_of'][0] if e['form_of'] else '') for w, r in lex.items() for e in r['entries']
                                for g in e['glosses'] if re.match(r'^\s*plural of', g)})

# ---------- 2. possessive grid
grid = {}
for C in ['', 'k', 'n']:
    for V, label in [('a', 'a-class'), ('o', 'o-class')]:
        for P, plabel in [('1sg', 'ʻu'), ('2sg', 'u'), ('3sg', 'na')]:
            # a-class 2sg/3sg have long ā
            vv = V
            if V == 'a' and P in ('2sg', '3sg'):
                vv = 'ā'
            form = C + vv + plabel
            r = lex.get(form)
            grid[(C or 'Ø', label, P)] = {
                'form': form,
                'wiktionary': bool(r and any(e['pos'] in ('pron', 'det') for e in r['entries'])),
                'wikt_gloss': '; '.join(g for e in (r['entries'] if r else []) if e['pos'] in ('pron', 'det') for g in e['glosses'])[:80],
                'pollex': [(x['proto_ng'], x['proto_gloss'][:50]) for x in pxby.get(form, []) if 'possess' in (x['proto_gloss'] + x['haw_gloss']).lower()],
                'corpus': corp.get(form, 0)}
out['possessive_grid'] = {' '.join(k): v for k, v in grid.items()}
out['possessive_extra'] = {f: {'corpus': corp.get(f, 0), 'pollex': [(x['proto_ng'], x['proto_gloss'][:50]) for x in pxby.get(f, [])]}
                           for f in ['kuʻu', 'kō', 'ko', 'kā', 'a', 'o', 'na', 'no']}

# ---------- 3. pronoun grid
pron = {('1 incl', 'dual'): 'kāua', ('1 excl', 'dual'): 'māua', ('2', 'dual'): 'ʻolua', ('3', 'dual'): 'lāua',
        ('1 incl', 'plural'): 'kākou', ('1 excl', 'plural'): 'mākou', ('2', 'plural'): 'ʻoukou', ('3', 'plural'): 'lākou',
        ('1', 'singular'): 'au', ('2', 'singular'): 'ʻoe', ('3', 'singular'): 'ia'}
out['pronoun_grid'] = {' '.join(k): {'form': f, 'wiktionary': f in lex, 'pollex': [x['proto_ng'] for x in pxby.get(f, [])], 'corpus': corp.get(f, 0)}
                       for k, f in pron.items()}

# ---------- 4. demonstratives
dem = {('kē-', 'near speaker'): 'kēia', ('kē-', 'near addressee'): 'kēnā', ('kē-', 'distal'): 'kēlā',
       ('pē-', 'near speaker'): 'penei', ('pē-', 'near addressee'): 'pēnā', ('pē-', 'distal'): 'pēlā',
       ('postposed', 'near speaker'): 'nei', ('postposed', 'near addressee'): 'nā', ('postposed', 'distal'): 'lā'}
out['demonstrative_grid'] = {' '.join(k): {'form': f, 'wiktionary': f in lex, 'pollex': [(x['proto_ng'], x['proto_gloss'][:45]) for x in pxby.get(f, []) if 'emonstr' in x['proto_gloss'] + x['haw_gloss'] or 'like' in x['proto_gloss'].lower() or 'there' in x['proto_gloss'].lower() or 'here' in x['proto_gloss'].lower() or 'this' in x['proto_gloss'].lower()], 'corpus': corp.get(f, 0)}
                             for k, f in dem.items()}

# ---------- 5. ka / ke by following word
def first_seg(w):
    return w[0]


tab = collections.defaultdict(lambda: collections.Counter())
byword = collections.defaultdict(lambda: collections.Counter())
for k, n in big.items():
    a, b = k.split(' ')
    if a in ('ka', 'ke'):
        s = first_seg(b)
        cls = s if s in 'keaoʻp' else ('ā/ē/ō' if s in 'āēō' else 'other')
        tab[cls][a] += n
        byword[b][a] += n
out['ka_ke_by_initial'] = {k: dict(v) for k, v in tab.items()}
both = {w: dict(c) for w, c in byword.items() if c['ka'] and c['ke']}
out['ka_ke_words_with_both'] = sorted(both.items(), key=lambda x: -sum(x[1].values()))[:40]
tot = sum(sum(c.values()) for c in byword.values())
# predictability: share of tokens that follow the majority choice for their following word
maj = sum(max(c.values()) for c in byword.values())
out['ka_ke_tokens'] = tot
out['ka_ke_majority_by_word'] = maj / tot
# rule: ke before k,e,a,o (and long ā,ē,ō), ka elsewhere
rule_ok = 0
for w, c in byword.items():
    pred = 'ke' if w[0] in 'keaoāēō' else 'ka'
    rule_ok += c[pred]
out['ka_ke_rule_KEAO'] = rule_ok / tot
# exceptions to the rule: words beginning with ʻ or p taking ke
exc = collections.Counter()
for w, c in byword.items():
    if w[0] not in 'keaoāēō' and c['ke']:
        exc[w] = c['ke']
out['ke_exceptions_top'] = exc.most_common(30)
out['ke_exception_tokens'] = sum(exc.values())
# entropy of ka/ke choice: unconditional, given first segment, given word
def H(counter):
    n = sum(counter.values())
    return -sum(v / n * math.log2(v / n) for v in counter.values() if v)
allc = collections.Counter()
for c in byword.values():
    allc.update(c)
out['H_kake'] = H(allc)
out['H_kake_given_initial'] = sum(sum(c.values()) / tot * H(c) for c in tab.values())
out['H_kake_given_word'] = sum(sum(c.values()) / tot * H(c) for c in byword.values())

# ---------- 6. hoʻo- / hō-
caus = collections.defaultdict(list)
for w, r in lex.items():
    for e in r['entries']:
        for a in e['af']:
            vals = [str(v) for k, v in a.items() if k != '1']
            vals = [v.split('<')[0] for v in vals]
            if any(v in ('hoʻo-', 'hō-', 'hoʻ-', 'hōʻ-', 'ho-') for v in vals):
                pref = [v for v in vals if v in ('hoʻo-', 'hō-', 'hoʻ-', 'hōʻ-', 'ho-')][0]
                stems = [v for v in vals if v not in ('hoʻo-', 'hō-', 'hoʻ-', 'hōʻ-', 'ho-') and not v.startswith('t') and v]
                if stems:
                    caus[pref].append((w, stems[0]))
ctab = collections.defaultdict(collections.Counter)
cex = collections.defaultdict(list)
for pref, lst in caus.items():
    for w, stem in set(lst):
        s = stem.strip('-')
        if not s:
            continue
        init = s[0].lower()
        cls = 'ʻ' if init == OK else ('V' if init in SV + LV else 'C')
        ctab[pref][cls] += 1
        if len(cex[(pref, cls)]) < 8:
            cex[(pref, cls)].append(f'{w} < {s}')
out['causative_by_stem_initial'] = {k: dict(v) for k, v in ctab.items()}
out['causative_examples'] = {' '.join(k): v for k, v in cex.items()}
# lexicon-wide: words beginning hō + ʻ vs hoʻo
out['lex_hōʻ_initial'] = sum(1 for w in lex if w.startswith('hōʻ'))
out['lex_hoʻo_initial'] = sum(1 for w in lex if w.startswith('hoʻo'))
out['lex_hoʻoʻ_initial'] = [w for w in lex if w.startswith('hoʻoʻ')]

json.dump(out, open(os.path.join(HERE, 'morph_checks.json'), 'w'), ensure_ascii=False, indent=1)
for k, v in out.items():
    print('==', k)
    if isinstance(v, dict):
        for kk, vv in v.items():
            print('  ', kk, vv)
    elif isinstance(v, list):
        for x in v[:60]:
            print('  ', x)
    else:
        print('  ', v)
