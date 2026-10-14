"""A direct test of PROPORTIONALITY (a : b :: c : d), as opposed to relatedness.

The phonology study asked whether the two members of a minimal pair share meaning (gloss overlap).
Proportionality is a different property: whether the *content difference* between a and b recurs
in another pair c : d with the *same expression difference*. That is what makes a substitution in a
frame significant (Hjelmslev) or a correlation proportional (Trubetzkoy).

Operationalisation (offset consistency, as in vector analogies):
  v(w)   = tf-idf vector of the English gloss tokens of w (Wiktionary, all senses). Grammatical
           glosses "plural of X" / "passive of X" ... are expanded to a tag token + X's own tokens,
           and "alternative form of X" to X's tokens, so a variant has ~zero difference.
  pair   = (a, b) oriented by its expression difference: SUB x→y with x<y in a fixed order; DEL Ø→c.
  d(a,b) = v(b) - v(a). Pairs with |d| < 0.35 (cos(a,b) > 0.94) count as VARIANTS (no content
           difference: the expression changes, the content does not).
  partner: another pair of the SAME opposition, sharing no form with it, with cos(d_i, d_j) >= TAU.
           A pair with a partner instantiates a : b :: c : d.
Baseline: for each opposition, the same number of random same-length non-minimal pairs, oriented at
random; 40 replicates.

Inputs: phonology/lexicon.json (Wiktionary forms, glosses), phonology/minpairs.tsv (2,224 content
minimal pairs). Grids: possessive, pronoun and deixis forms, built here from the same lexicon.
Writes tables/prop_test.txt and tables/prop_partners.tsv.
"""
import json, re, math, random, csv
from collections import Counter, defaultdict

ROOT = '(scratch)/structure'
L = json.load(open(f'{ROOT}/phonology/lexicon.json'))
OUT = f'{ROOT}/synthesis/tables/prop_test.txt'
TAU = 0.5
VAR = 0.35
random.seed(20261004)

STOP = set("""a an the to of in on at from with without into onto upon as or and but nor not no be is are was were
been being am do does did done have has had having it itself this these those one ones someone something thing things
kind kinds sort type types variety form forms sp spp species e g eg etc i ie also especially usually often sometimes
generally used use using very much many more most less least any all some each other another such make makes made
making cause causes caused become becomes became get gets got go goes up down out off over under about against so
than then which who whom whose what when where why how alternative spelling figuratively literally lit term word name
hawaiian native endemic genus family plant tree shrub fish bird variant obsolete rare archaic stative transitive
intransitive verb noun used""".split())
KEEP = set('my me mine your you yours his him her its our us their them for by this that there here two three we they'.split())
TAG = re.compile(r'^\s*(plural|passive|causative|reduplication|frequentative|emphatic form|niʻihau form|lānaʻi form)\s+of\s+(\S+)', re.I)
ALT = re.compile(r'^\s*(alternative (form|spelling)|obsolete (form|spelling)) of\s+(\S+)', re.I)


def stem(w):
    for suf in ('ingly', 'edly', 'ness', 'ment', 'ings', 'ing', 'ers', 'ied', 'ies', 'est', 'ed', 'er', 'ly', 'es', 's'):
        if w.endswith(suf) and len(w) - len(suf) >= 3:
            w = w[:-len(suf)] + ('y' if suf in ('ied', 'ies') else '')
            break
    return w


def toks(text):
    text = re.sub(r'\([^)]*\)', ' ', text)
    out = []
    for t in re.findall(r'[a-z]+', text.lower()):
        if t in KEEP:
            out.append(t); continue
        if t in STOP or len(t) < 3:
            continue
        out.append(stem(t))
    return out


def norm(s):
    return s.strip().lower().replace("'", 'ʻ').replace('‘', 'ʻ').replace('’', 'ʻ')


def raw_tokens(form, depth=0):
    rec = L.get(form)
    if not rec:
        return []
    out = []
    for e in rec['entries']:
        if e['pos'] in ('character', 'letter', 'symbol'):
            continue
        for g in e['glosses']:
            m = TAG.match(g)
            if m and depth == 0:
                out += ['TAG_' + m.group(1).lower().replace(' ', '_')] + raw_tokens(norm(m.group(2)).strip('.,;'), 1)
                continue
            m = ALT.match(g)
            if m and depth == 0:
                out += raw_tokens(norm(m.group(4)).strip('.,;'), 1)
                continue
            out += toks(g)
        if not e['glosses'] and e.get('alt_of') and depth == 0:
            for x in e['alt_of']:
                out += raw_tokens(norm(x), 1)
    return out


TOK = {w: raw_tokens(w) for w in L}
df = Counter(t for w, ts in TOK.items() for t in set(ts))
NDOC = sum(1 for ts in TOK.values() if ts)


def vec(w):
    tf = Counter(TOK.get(w, []))
    v = {t: (1 + math.log(n)) * math.log(NDOC / df[t]) for t, n in tf.items()}
    s = math.sqrt(sum(x * x for x in v.values())) or 1.0
    return {t: x / s for t, x in v.items()}


V = {w: vec(w) for w in L if TOK.get(w)}


def sub(a, b):
    d = dict(b)
    for t, x in a.items():
        d[t] = d.get(t, 0) - x
    return d


def norm2(d):
    return math.sqrt(sum(x * x for x in d.values()))


def cos(d1, d2, n1=None, n2=None):
    n1 = n1 or norm2(d1); n2 = n2 or norm2(d2)
    if not n1 or not n2:
        return 0.0
    if len(d1) > len(d2):
        d1, d2 = d2, d1
    return sum(x * d2.get(t, 0) for t, x in d1.items()) / (n1 * n2)


ORDER = 'ʻhklmnpwaeiouāēīōū'


def orient(a, b):
    """Return (x_member, y_member, opposition key) or None."""
    if len(a) == len(b):
        diff = [i for i in range(len(a)) if a[i] != b[i]]
        if len(diff) != 1:
            return None
        i = diff[0]
        x, y = a[i], b[i]
        if ORDER.index(x) > ORDER.index(y):
            a, b, x, y = b, a, y, x
        return a, b, f'{x}→{y}'
    if abs(len(a) - len(b)) == 1:
        if len(a) > len(b):
            a, b = b, a
        for i in range(len(b)):
            if b[:i] + b[i + 1:] == a:
                return a, b, f'Ø→{b[i]}'
    return None


LONGV = {'a': 'ā', 'e': 'ē', 'i': 'ī', 'o': 'ō', 'u': 'ū'}


def family(key):
    x, y = key.split('→')
    if x == 'Ø':
        return 'ʻokina vs Ø' if y == 'ʻ' else ('vowel vs Ø' if y in 'aeiouāēīōū' else 'other C vs Ø')
    if LONGV.get(x) == y:
        return 'vowel length'
    if x in 'aeiouāēīōū' and y in 'aeiouāēīōū':
        return 'vowel quality(+length)'
    if (x in 'aeiouāēīōū') != (y in 'aeiouāēīōū'):
        return 'C~V'
    return 'consonant substitution'


def analyse(pairs, label):
    """pairs: list of (a, b, key) oriented. Returns stats + per-pair partner info."""
    D = []
    for a, b, k in pairs:
        if a not in V or b not in V:
            continue
        d = sub(V[a], V[b]); n = norm2(d)
        D.append((a, b, k, d, n))
    byk = defaultdict(list)
    for x in D:
        byk[x[2]].append(x)
    res = []
    for a, b, k, d, n in D:
        best, bp = 0.0, ''
        for a2, b2, k2, d2, n2 in byk[k]:
            if {a2, b2} & {a, b} or derived_copy(a, b, a2, b2) or n2 == 0 or n == 0:
                continue
            c = cos(d, d2, n, n2)
            if c > best:
                best, bp = c, f'{a2}:{b2}'
        if best >= TAU:
            st = 'PARTNER'
        elif n < VAR:
            st = 'VARIANT'
        else:
            st = 'none'
        res.append((a, b, k, st, best, bp))
    return res


def derived_copy(a, b, a2, b2):
    """(a2, b2) = (P+a+S, P+b+S) or the reverse: one lexical difference repeated through an affix
    (kaʻa:kala :: hoʻokaʻa:hoʻokala). Not an independent instance of the opposition."""
    for x, y, X, Y in ((a, b, a2, b2), (a2, b2, a, b)):
        i = X.find(x)
        while i >= 0:
            if Y[:i] + y + Y[i + len(y):] == Y and Y[i:i + len(y)] == y and X[:i] == Y[:i]:
                return True
            i = X.find(x, i + 1)
    return False


def baseline(pairs_by_key, forms_by_len, reps=40):
    """same number of random same-length pairs per opposition, random orientation."""
    shares = []
    for r in range(reps):
        tot = hit = 0
        for k, prs in pairs_by_key.items():
            fake = []
            for a, b in prs:
                la, lb = len(a), len(b)
                for _ in range(20):
                    x = random.choice(forms_by_len[la]); y = random.choice(forms_by_len[lb])
                    if x != y and orient(x, y) is None:
                        fake.append((x, y, k)); break
            for a, b, k2, st, c, p in analyse(fake, 'rand'):
                if st == 'VARIANT':
                    continue
                tot += 1; hit += st == 'PARTNER'
        shares.append(hit / max(1, tot))
    shares.sort()
    return sum(shares) / len(shares), shares[int(0.95 * len(shares)) - 1]


lines = []
def out(*a):
    s = ' '.join(str(x) for x in a); print(s); lines.append(s)

# ---------------------------------------------------------------- lexicon minimal pairs
mp = list(csv.DictReader(open(f'{ROOT}/phonology/minpairs.tsv'), delimiter='\t'))
pairs = []
for r in mp:
    o = orient(r['a'], r['b'])
    if o:
        pairs.append(o)
content_forms = {r['a'] for r in mp} | {r['b'] for r in mp}
forms_by_len = defaultdict(list)
for w in V:
    if L[w].get('content') and L[w].get('native') and not L[w].get('loan'):
        forms_by_len[len(w)].append(w)

res = analyse(pairs, 'lexicon')
out(f'TAU (offset cosine for a proportional partner) = {TAU}; variant threshold |d| < {VAR}')
out(f'Lexicon: {len(pairs)} oriented content minimal pairs (phonology/minpairs.tsv); {len(res)} with glosses on both sides')
out()
fam = defaultdict(list)
for x in res:
    fam[family(x[2])].append(x)
out(f"{'family':28s} {'pairs':>6s} {'variant':>8s} {'with partner':>13s} {'share':>7s} {'random':>7s} {'rand95':>7s}")
allp = defaultdict(list)
for a, b, k in pairs:
    allp[k].append((a, b))
tot = Counter()
for f in ['consonant substitution', 'vowel quality(+length)', 'other C vs Ø', 'vowel vs Ø', 'C~V', 'ʻokina vs Ø', 'vowel length']:
    xs = fam.get(f, [])
    nv = sum(1 for x in xs if x[3] == 'VARIANT'); npart = sum(1 for x in xs if x[3] == 'PARTNER')
    keys = {k: v for k, v in allp.items() if family(k) == f}
    bm, b95 = baseline(keys, forms_by_len, reps=25)
    share = npart / max(1, len(xs) - nv)
    tot.update(n=len(xs), v=nv, p=npart)
    out(f'{f:28s} {len(xs):6d} {nv:8d} {npart:13d} {share:7.1%} {bm:7.1%} {b95:7.1%}')
bm, b95 = baseline(allp, forms_by_len, reps=25)
out(f"{'ALL':28s} {tot['n']:6d} {tot['v']:8d} {tot['p']:13d} {tot['p']/(tot['n']-tot['v']):7.1%} {bm:7.1%} {b95:7.1%}")
out()
out('Pairs that have a proportional partner (lexicon), with the best partner:')
with open(f'{ROOT}/synthesis/tables/prop_partners.tsv', 'w') as f:
    f.write('a\tb\topposition\tstatus\tbest_cos\tbest_partner\tgloss_a\tgloss_b\n')
    for a, b, k, st, c, p in sorted(res, key=lambda x: -x[4]):
        ga = '; '.join(g for e in L[a]['entries'] for g in e['glosses'])[:60]
        gb = '; '.join(g for e in L[b]['entries'] for g in e['glosses'])[:60]
        f.write(f'{a}\t{b}\t{k}\t{st}\t{c:.2f}\t{p}\t{ga}\t{gb}\n')
        if st == 'PARTNER':
            out(f'  {k:6s} {a}:{b} :: {p}  cos={c:.2f}   [{ga[:35]} | {gb[:35]}]')
out()

# ---------------------------------------------------------------- closed grids
GRID = {
  'possessive': ['aʻu', 'āu', 'āna', 'oʻu', 'ou', 'ona', 'kaʻu', 'kāu', 'kāna', 'koʻu', 'kou', 'kona', 'naʻu', 'nāu', 'nāna', 'noʻu', 'nou', 'nona'],
  'pronoun': ['kāua', 'māua', 'lāua', 'kākou', 'mākou', 'lākou'],
  'deixis': ['kēia', 'kēnā', 'kēlā', 'penei', 'pēnā', 'pēlā'],
}
out('Closed grids: every pair of grid forms (any distance), oriented by the first differing slot; partner = same opposition key')
for g, forms in GRID.items():
    have = [w for w in forms if w in V]
    gp = []
    for i in range(len(have)):
        for j in range(i + 1, len(have)):
            o = orient(have[i], have[j])
            if o:
                gp.append(o)
    r = analyse(gp, g)
    nv = sum(1 for x in r if x[3] == 'VARIANT'); npart = sum(1 for x in r if x[3] == 'PARTNER')
    out(f'  {g:10s} forms with glosses {len(have)}/{len(forms)}; one-segment pairs {len(r)}; variants {nv}; with partner {npart} = {npart/max(1,len(r)-nv):.0%}')
    for a, b, k, st, c, p in r:
        out(f'      {k:6s} {a}:{b}  {st:8s} best {c:.2f} {p}')

# ---------------------------------------------------------------- plural subset
pl = [x for x in res if family(x[2]) == 'vowel length']
out()
out('Vowel-length pairs in detail:')
for a, b, k, st, c, p in sorted(pl, key=lambda x: -x[4]):
    out(f'  {a}:{b}  {st:8s} best {c:.2f} {p}')
open(OUT, 'w').write('\n'.join(lines) + '\n')
