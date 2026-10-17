"""Shared helpers: gloss tokenisation, a crude English stemmer, tf-idf cosine,
and per-form semantic profiles (content-POS glosses only)."""
import re, math, collections

STOP = set("""
a an the to of in on at by for from with without into onto upon as or and but nor not no
be is are was were been being am do does did done have has had having it its itself this that these those
one ones someone something somebody anything thing things person people place places kind kinds sort type
types variety varieties form forms sp spp species e g eg etc i ie also especially usually often sometimes
generally etc used use using very much many more most less least any all some each other another such
make makes made making cause causes caused causing become becomes became becoming get gets got go goes
being up down out off over under about against so than then there here which who whom whose what when
where why how plural singular alternative spelling form figuratively literally lit term word name
hawaiian native endemic genus family plant tree shrub fish bird used variant obsolete rare archaic
stative transitive intransitive verb noun
""".split())


def stem(w):
    for suf in ('ingly', 'edly', 'ness', 'ment', 'ings', 'ing', 'ers', 'ied', 'ies', 'est', 'ed', 'er',
                'ly', 'es', 's'):
        if w.endswith(suf) and len(w) - len(suf) >= 3:
            w = w[: -len(suf)]
            if suf in ('ied', 'ies'):
                w += 'y'
            break
    # collapse doubled final consonant (stopp -> stop)
    if len(w) > 3 and w[-1] == w[-2] and w[-1] not in 'aeiouls':
        w = w[:-1]
    return w


def tokens(text):
    text = re.sub(r'\([^)]*\)', ' ', text)            # drop parentheticals (often Latin names)
    out = []
    for t in re.findall(r"[a-z]+", text.lower()):
        if t in STOP or len(t) < 3:
            continue
        s = stem(t)
        if s in STOP:
            continue
        out.append(s)
    return out


CONTENT_POS = {'noun', 'verb', 'adj', 'adv'}


def profile(rec, content_only=True):
    toks = []
    for e in rec['entries']:
        if content_only and e['pos'] not in CONTENT_POS:
            continue
        for g in e['glosses']:
            # "plural of kanaka" style glosses carry no lexical meaning of their own
            if re.match(r'^\s*(plural|reduplication|frequentative|passive|causative) (form )?of\b', g):
                continue
            toks += tokens(g)
    return toks


class TfIdf:
    def __init__(self, docs):
        self.N = len(docs)
        df = collections.Counter()
        for d in docs.values():
            df.update(set(d))
        self.idf = {t: math.log((1 + self.N) / (1 + n)) + 1 for t, n in df.items()}
        self.vec = {}
        for k, d in docs.items():
            tf = collections.Counter(d)
            v = {t: (1 + math.log(c)) * self.idf[t] for t, c in tf.items()}
            norm = math.sqrt(sum(x * x for x in v.values())) or 1.0
            self.vec[k] = {t: x / norm for t, x in v.items()}

    def cos(self, a, b):
        va, vb = self.vec.get(a, {}), self.vec.get(b, {})
        if len(va) > len(vb):
            va, vb = vb, va
        return sum(x * vb.get(t, 0.0) for t, x in va.items())
