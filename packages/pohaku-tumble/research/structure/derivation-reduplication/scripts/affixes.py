"""Other prefixes and suffixes: curated pairs from Wiktionary (etymology analyses + 'prefixed/suffixed with' categories),
checked for an attested base; plus formal (string) stripping over the lexicon as a noisy upper bound.
Writes tables/affix_pairs.tsv, tables/affix_summary.tsv."""
import json, re, csv
from collections import Counter, defaultdict
from common import *

lex = lexicon()
wk = json.load(open(f'{CACHE}/wiktionary.json'))
HOO = {'hoʻo-', 'hō-', 'hoʻ-', 'hōʻ-', 'ho-'}

# curated: analyses
cur = defaultdict(set)   # affix -> {(derived, base)}
for a in wk['analyses']:
    parts = [norm(p) for p in a['parts']]
    if len(parts) != 2:
        continue
    w = norm(a['word'])
    if parts[0].endswith('-') and parts[0] not in HOO:
        cur[parts[0]].add((w, parts[1]))
    if parts[1].startswith('-'):
        cur[parts[1]].add((w, parts[0]))
# curated: categories (base unknown -> try stripping)
catm = defaultdict(set)
for w, e in lex.items():
    for c in e['cats']:
        m = re.match(r'Hawaiian terms (prefixed|suffixed) with (\S+)', c)
        if m:
            af = norm(m.group(2))
            if af not in HOO:
                catm[af].add(w)

def strip(w, af):
    a = af.strip('-')
    out = []
    if af.endswith('-') and w.startswith(a) and len(w) > len(a) + 1:
        x = w[len(a):]
        out += [x, shorten(x[0]) + x[1:]]
        if x[0] in VOW: out.append(OK + x)
    if af.startswith('-') and w.endswith(a) and len(w) > len(a) + 1:
        x = w[:-len(a)]
        out += [x]
        # -na length alternations (Medeiros 2020): shortening or lengthening of first vowel
        out += [shorten(x)] + [x[:i] + SHORT2LONG[c] + x[i+1:] for i, c in enumerate(x) if c in SHORT2LONG][:2]
    return [b for b in dict.fromkeys(out) if b in lex and b != w]

rows = []
summary = []
afs = sorted(set(cur) | set(catm), key=lambda a: -(len(cur.get(a, ())) + len(catm.get(a, ()))))
for af in afs:
    pairs = set()
    for w, b in cur.get(af, ()):
        if w in lex and b in lex:
            pairs.add((w, b, 'analysis'))
    for w in catm.get(af, ()):
        for b in strip(w, af):
            if not any(p[0] == w and p[1] == b for p in pairs):
                pairs.add((w, b, 'category+strip'))
    members = {w for w, _ in cur.get(af, ())} | catm.get(af, set())
    # formal upper bound over the whole lexicon
    formal = {(w, b) for w in lex for b in strip(w, af)} if len(af.strip('-')) >= 1 else set()
    summary.append((af, len(members), len({p[0] for p in pairs}), len(pairs), len(formal)))
    for w, b, s in sorted(pairs):
        rows.append({'affix': af, 'derived': w, 'base': b, 'src': s,
                     'der_W': int(lex[w]['W']), 'der_P': int(lex[w]['P']), 'base_W': int(lex[b]['W']), 'base_P': int(lex[b]['P']),
                     'der_gloss': gl(lex, w, 150), 'base_gloss': gl(lex, b, 150)})

with open(f'{W}/tables/affix_pairs.tsv', 'w') as f:
    wr = csv.DictWriter(f, fieldnames=list(rows[0].keys()), delimiter='\t'); wr.writeheader(); wr.writerows(rows)
with open(f'{W}/tables/affix_summary.tsv', 'w') as f:
    f.write('affix\twikt_members\tderived_with_attested_base\tpairs\tformal_string_matches_in_lexicon\n')
    for s in summary:
        f.write('\t'.join(map(str, s)) + '\n')
for s in summary:
    print('%-8s members=%3d  derived-with-base=%3d pairs=%3d  formal=%4d' % s)
