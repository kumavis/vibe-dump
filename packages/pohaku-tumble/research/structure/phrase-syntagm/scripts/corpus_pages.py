"""Same three-pass word-salad filter as common.build_corpus (copied from the
grammatical-paradigms sibling study), but every kept sentence keeps its page
index, so bigram counts can be reported as page (document) frequencies.  This
matters: Hawaiian Wikipedia has ~1,200 bot-made stubs on Spanish municipalities
("kiwikā ... panalāʻau ... Castille a me Leon, Sepania") whose formulaic
sentences inflate raw bigram counts.
Output: corpus_pages.pkl = (list of (page_index, [(tok, is_cap), ...]), stats)."""
import math, os, pickle
from collections import Counter
import common as C

HERE = os.path.dirname(os.path.abspath(__file__))


def build(nb_threshold=0.5, iterations=3):
    paras = list(C._paragraphs())
    st = Counter()
    salad1, dirty = set(), set()
    for k, (pi, para, ptoks) in enumerate(paras):
        if any(x in C.SALAD or C.ILLEGAL.search(x) for x in ptoks):
            salad1.add(k); dirty.add(pi)
    sb, cb = Counter(), Counter()
    for k, (pi, para, ptoks) in enumerate(paras):
        bg = list(zip(ptoks, ptoks[1:]))
        if k in salad1:
            sb.update(bg)
        elif pi not in dirty:
            cb.update(bg)
    markers = {b for b, n in sb.items() if n >= 8 and cb[b] == 0}
    salad_s, keep = [], []
    for k, (pi, para, ptoks) in enumerate(paras):
        ss = C._split_sents(para)
        if k in salad1:
            salad_s.extend(ss); st['drop_p1_tokens'] += len(ptoks); continue
        if sum(1 for b in zip(ptoks, ptoks[1:]) if b in markers) >= 2:
            salad_s.extend(ss); st['drop_p2_tokens'] += len(ptoks); continue
        keep.extend((pi, s) for s in ss)
    base = list(salad_s)
    for it in range(iterations):
        S = Counter(t for s in salad_s for t, _ in s)
        K = Counter(t for _, s in keep for t, _ in s)
        NS, NK = sum(S.values()), sum(K.values())
        V = len(set(S) | set(K))
        lS, lK = math.log(NS + 0.5 * V), math.log(NK + 0.5 * V)
        def score(s):
            return sum(math.log(S[t] + 0.5) - lS - math.log(K[t] + 0.5) + lK for t, _ in s) / len(s)
        nk, fl = [], []
        for pi, s in keep:
            (fl if score(s) > nb_threshold else nk).append((pi, s))
        salad_s = base + [s for _, s in fl]
        if it == iterations - 1:
            keep = nk; st['drop_p3_tokens'] = sum(len(s) for _, s in fl)
    st['kept_tokens'] = sum(len(s) for _, s in keep)
    st['sentences'] = len(keep)
    st['pages'] = len({pi for pi, _ in keep})
    return keep, dict(st)


def load():
    pk = os.path.join(HERE, 'corpus_pages.pkl')
    if os.path.exists(pk):
        return pickle.load(open(pk, 'rb'))
    r = build()
    pickle.dump(r, open(pk, 'wb'))
    return r


if __name__ == '__main__':
    keep, st = load()
    print(st)
