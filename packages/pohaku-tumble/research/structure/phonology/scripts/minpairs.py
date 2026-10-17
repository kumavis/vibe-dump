#!/usr/bin/env python3
"""Minimal pairs per opposition, and the semantic test.

Population (default): Wiktionary Hawaiian single-word forms spelled with native
letters that have at least one content-POS (noun/verb/adj/adv) entry with a real
gloss (not "alternative form of ..."), loans excluded.  --with-loans keeps loans.

A minimal pair is two forms that
  * SUB: have the same number of segments and differ in exactly one (a long
    vowel is one segment, so kai/kā is NOT a minimal pair but ka/kā-type
    length pairs are);
  * DEL: differ by one inserted segment (kai / kaʻi = ʻ vs Ø).
Each pair is classified by the opposition it instantiates.

Semantic relatedness of a pair (computed identically for minimal pairs and for
baseline pairs):
  gloss   - the two forms' content-gloss stem sets share >= 1 stem (stoplist in semantics.py)
  cos     - tf-idf cosine of the gloss profiles (reported as mean and share >= 0.25)
  pos     - share a content POS
  proto   - share a protoform (Wiktionary etymology templates U POLLEX), among
            pairs where both forms have >= 1 protoform
  link    - one form's entry names the other (form-of / alt-of / etymology / forms list)

Baselines:
  matched random - for each observed pair (a,b), a random (a',b') with
                   len(a')==len(a), len(b')==len(b), not itself a minimal pair; 300 reps
  hamming-2      - all same-length pairs differing in exactly two segments (sampled)
"""
import json, os, sys, random, collections, itertools, math, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from semantics import profile, TfIdf, tokens

HERE = os.path.dirname(os.path.abspath(__file__))
OK = 'ʻ'
CONS = set('pkhmnlw' + OK)
SV = list('aeiou'); LV = list('āēīōū')
L2S = dict(zip(LV, SV))
WITH_LOANS = '--with-loans' in sys.argv
REPS = 300
random.seed(12345)


def is_v(s):
    return s in SV or s in LV


def classify_sub(x, y):
    if x in CONS and y in CONS:
        return 'C:' + '/'.join(sorted([x, y]))
    if is_v(x) and is_v(y):
        qx, qy = L2S.get(x, x), L2S.get(y, y)
        lx, ly = x in LV, y in LV
        if qx == qy:
            return 'LEN:' + qx + '/' + qx + 'ː'
        if lx == ly:
            return ('VQ:' if not lx else 'VQː:') + '/'.join(sorted([qx, qy]))
        return 'VQ+LEN:' + '/'.join(sorted([x, y]))
    return 'C~V'


def classify_del(seg):
    if seg == OK:
        return 'DEL:ʻ/Ø'
    if seg in CONS:
        return 'DEL:' + seg + '/Ø'
    return 'DEL:V/Ø'


def family(cls):
    if cls.startswith('C:'):
        return 'consonant substitution'
    if cls.startswith('LEN:'):
        return 'vowel length'
    if cls.startswith('VQ:') or cls.startswith('VQː:'):
        return 'vowel quality'
    if cls.startswith('VQ+LEN'):
        return 'vowel quality+length'
    if cls == 'DEL:ʻ/Ø':
        return 'ʻokina vs Ø'
    if cls.startswith('DEL:') and cls != 'DEL:V/Ø':
        return 'other C vs Ø'
    if cls == 'DEL:V/Ø':
        return 'vowel vs Ø'
    return 'C~V'


def find_pairs(forms, segs):
    """forms: list of strings; segs: dict form->list of segments"""
    pairs = {}
    by_key = collections.defaultdict(list)
    for f in forms:
        s = segs[f]
        for i in range(len(s)):
            key = (len(s), i, tuple(s[:i]), tuple(s[i + 1:]))
            by_key[key].append(f)
    for key, fs in by_key.items():
        if len(fs) < 2:
            continue
        i = key[1]
        for a, b in itertools.combinations(sorted(fs), 2):
            pairs[(a, b)] = ('SUB', classify_sub(segs[a][i], segs[b][i]), i)
    fset = set(forms)
    index = {tuple(segs[f]): f for f in forms}
    for f in forms:
        s = segs[f]
        for i in range(len(s)):
            shorter = tuple(s[:i] + s[i + 1:])
            g = index.get(shorter)
            if g is not None and g != f:
                a, b = sorted([f, g])
                pairs.setdefault((a, b), ('DEL', classify_del(s[i]), i))
    return pairs


def hamming2_pairs(forms, segs, limit=20000):
    bylen = collections.defaultdict(list)
    for f in forms:
        bylen[len(segs[f])].append(f)
    out = []
    # sample via 2-wildcard keys
    keymap = collections.defaultdict(list)
    for f in forms:
        s = segs[f]
        for i, j in itertools.combinations(range(len(s)), 2):
            key = (len(s), i, j, tuple(s[:i]), tuple(s[i + 1:j]), tuple(s[j + 1:]))
            keymap[key].append(f)
    seen = set()
    for key, fs in keymap.items():
        if len(fs) < 2:
            continue
        i, j = key[1], key[2]
        for a, b in itertools.combinations(sorted(fs), 2):
            if segs[a][i] != segs[b][i] and segs[a][j] != segs[b][j]:
                seen.add((a, b))
    seen = sorted(seen)
    random.shuffle(seen)
    return seen[:limit]


def main():
    lex = json.load(open(os.path.join(HERE, 'lexicon.json')))
    pop = {}
    for w, r in lex.items():
        if not r['native'] or not r['content'] or r['proper']:
            continue
        if r['loan'] and not WITH_LOANS:
            continue
        pop[w] = r
    forms = sorted(pop)
    segs = {w: pop[w]['segs'] for w in forms}
    profs = {w: profile(pop[w]) for w in forms}
    tfidf = TfIdf(profs)
    stemsets = {w: set(p) for w, p in profs.items()}
    posset = {w: {e['pos'] for e in pop[w]['entries'] if e['pos'] in ('noun', 'verb', 'adj', 'adv') and e['glosses']} for w in forms}
    protos = {}
    pxids = {}
    for w in forms:
        ps = {p[1].replace('ŋ', 'ng').lower() for p in pop[w]['protos'] if p[0] in ('PPN', 'PNP', 'PEP')}
        ps |= {p['proto'].replace('ŋ', 'ng').lower() for p in pop[w]['pollex']}
        protos[w] = {p.strip('*').replace('-', '') for p in ps}
        pxids[w] = {p['pollex_id'] for p in pop[w]['pollex'] if p.get('pollex_id')}
    # texts that may name another form
    linktext = {}
    for w in forms:
        bits = []
        for e in pop[w]['entries']:
            bits += e['form_of'] + e['alt_of'] + [f for f, _ in e['forms']]
            bits += [x.strip('-') for x in e.get('etym_haw_links', [])]
            for a in e['af']:
                bits += [str(v).split('<')[0].strip('-').lower() for k, v in a.items() if k not in ('1',)]
        linktext[w] = set(bits)

    def rel(a, b):
        c = tfidf.cos(a, b)
        both_proto = bool(protos[a]) and bool(protos[b])
        return {
            'gloss': bool(stemsets[a] & stemsets[b]),
            'cos': c,
            'cos25': c >= 0.25,
            'pos': bool(posset[a] & posset[b]),
            'both_proto': both_proto,
            'proto': both_proto and bool(protos[a] & protos[b]),
            'link': (b in linktext[a]) or (a in linktext[b]),
            'both_px': bool(pxids[a]) and bool(pxids[b]),
            'pxid': bool(pxids[a] & pxids[b]),
        }

    pairs = find_pairs(forms, segs)
    pairset = set(pairs)
    bylen = collections.defaultdict(list)
    for f in forms:
        bylen[len(segs[f])].append(f)

    def matched_random(obs):
        out = []
        for (a, b) in obs:
            for _ in range(50):
                a2 = random.choice(bylen[len(segs[a])])
                b2 = random.choice(bylen[len(segs[b])])
                if a2 != b2 and tuple(sorted([a2, b2])) not in pairset:
                    out.append((a2, b2))
                    break
        return out

    def summarise(plist):
        n = len(plist)
        if n == 0:
            return None
        rs = [rel(a, b) for a, b in plist]
        bp = sum(r['both_proto'] for r in rs)
        return {
            'n': n,
            'gloss': sum(r['gloss'] for r in rs) / n,
            'cos_mean': sum(r['cos'] for r in rs) / n,
            'cos25': sum(r['cos25'] for r in rs) / n,
            'pos': sum(r['pos'] for r in rs) / n,
            'both_proto_n': bp,
            'proto': (sum(r['proto'] for r in rs) / bp) if bp else None,
            'link': sum(r['link'] for r in rs) / n,
            'both_px_n': sum(r['both_px'] for r in rs),
            'pxid': (sum(r['pxid'] for r in rs) / max(1, sum(r['both_px'] for r in rs))),
        }

    def baseline(plist, reps=REPS):
        keys = ['gloss', 'cos_mean', 'cos25', 'pos', 'proto', 'link', 'pxid']
        dist = {k: [] for k in keys}
        for _ in range(reps):
            s = summarise(matched_random(plist))
            for k in keys:
                if s and s[k] is not None:
                    dist[k].append(s[k])
        return dist

    def wilson(p, n, z=1.96):
        if n == 0:
            return (0, 0)
        d = 1 + z * z / n
        c = p + z * z / (2 * n)
        h = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))
        return ((c - h) / d, (c + h) / d)

    # ---------- counts per opposition
    by_cls = collections.defaultdict(list)
    by_fam = collections.defaultdict(list)
    for (a, b), (kind, cls, i) in pairs.items():
        by_cls[cls].append((a, b))
        by_fam[family(cls)].append((a, b))
    res = {'population': len(forms), 'with_loans': WITH_LOANS, 'n_pairs': len(pairs)}
    # forms with >=1 minimal pair (neighbourhood)
    nb = collections.Counter()
    for a, b in pairs:
        nb[a] += 1; nb[b] += 1
    res['forms_with_a_neighbour'] = len(nb)
    res['mean_neighbours'] = sum(nb.values()) / len(forms)
    res['families'] = {}
    for fam, pl in sorted(by_fam.items(), key=lambda x: -len(x[1])):
        s = summarise(pl)
        bl = baseline(pl)
        row = dict(s)
        for k in ['gloss', 'cos25', 'pos', 'proto', 'link', 'cos_mean', 'pxid']:
            d = bl[k]
            if d and s[k] is not None:
                m = sum(d) / len(d)
                row[k + '_base'] = m
                row[k + '_p'] = (sum(1 for x in d if x >= s[k]) + 1) / (len(d) + 1)
        row['gloss_ci'] = wilson(s['gloss'], s['n'])
        res['families'][fam] = row
    res['classes'] = {}
    for cls, pl in sorted(by_cls.items(), key=lambda x: -len(x[1])):
        s = summarise(pl)
        res['classes'][cls] = s
    # all pairs together vs baseline vs hamming-2
    allp = list(pairs)
    s_all = summarise(allp)
    bl_all = baseline(allp, reps=200)
    res['all'] = s_all
    res['all_base'] = {k: (sum(v) / len(v) if v else None) for k, v in bl_all.items()}
    res['all_base_p'] = {k: ((sum(1 for x in v if x >= s_all[k]) + 1) / (len(v) + 1) if v and s_all[k] is not None else None) for k, v in bl_all.items() if k in s_all}
    h2 = hamming2_pairs(forms, segs)
    res['hamming2'] = summarise(h2)
    # random unmatched
    rnd = []
    while len(rnd) < 20000:
        a, b = random.sample(forms, 2)
        if tuple(sorted([a, b])) not in pairset:
            rnd.append((a, b))
    res['random_unmatched'] = summarise(rnd)
    # pairs excluding any explicit link (pure lexical minimal pairs)
    nolink = [p for p in allp if not rel(*p)['link']]
    res['all_without_links'] = summarise(nolink)
    bl_nl = baseline(nolink, reps=200)
    res['all_without_links_base'] = {k: (sum(v) / len(v) if v else None) for k, v in bl_nl.items()}
    res['all_without_links_p'] = {k: ((sum(1 for x in v if x >= res['all_without_links'][k]) + 1) / (len(v) + 1) if v and res['all_without_links'][k] is not None else None) for k, v in bl_nl.items()}
    # per family without links
    res['families_nolink'] = {}
    for fam, pl in by_fam.items():
        pl2 = [p for p in pl if not rel(*p)['link']]
        if not pl2:
            continue
        s = summarise(pl2)
        bl = baseline(pl2, reps=200)
        row = dict(s)
        for k in ['gloss', 'cos25', 'pos', 'proto']:
            d = bl[k]
            if d and s[k] is not None:
                row[k + '_base'] = sum(d) / len(d)
                row[k + '_p'] = (sum(1 for x in d if x >= s[k]) + 1) / (len(d) + 1)
        res['families_nolink'][fam] = row
    suffix = '_loans' if WITH_LOANS else ''
    json.dump(res, open(os.path.join(HERE, f'minpairs_summary{suffix}.json'), 'w'), ensure_ascii=False, indent=1)
    # pair listing
    with open(os.path.join(HERE, f'minpairs{suffix}.tsv'), 'w') as fh:
        fh.write('a\tb\tkind\topposition\tfamily\tpos_a\tpos_b\tgloss_overlap\tcos\tshared_proto\tlink\tgloss_a\tgloss_b\tshared_pollex_id\n')
        for (a, b), (kind, cls, i) in sorted(pairs.items(), key=lambda x: (family(x[1][1]), x[1][1], x[0])):
            r = rel(a, b)
            ga = ' | '.join(g for e in pop[a]['entries'] for g in e['glosses'])[:120]
            gb = ' | '.join(g for e in pop[b]['entries'] for g in e['glosses'])[:120]
            fh.write('\t'.join(map(str, [a, b, kind, cls, family(cls), ','.join(sorted(posset[a])), ','.join(sorted(posset[b])),
                                          int(r['gloss']), round(r['cos'], 3), ('' if not r['both_proto'] else int(r['proto'])),
                                          int(r['link']), ga, gb, ('' if not r['both_px'] else int(r['pxid']))])) + '\n')
    print(json.dumps({k: v for k, v in res.items() if k not in ('classes',)}, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
