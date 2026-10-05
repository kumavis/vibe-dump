"""Head + modifier collocations in Hawaiian Wikipedia (filtered corpus, corpus_pages.py).

Frame: DET  HEAD  X   where DET is a determiner/possessive that marks HEAD as a noun
(the NP is head-initial, so the first content word after the head is the first
modifier slot).  X must be a native-spelled content word (not in STOP).
For every head we record X's token frequency f, page frequency df, and
association with HEAD over the whole corpus (bigram HEAD X anywhere):
  PMI = log2(f_bigram * N / (f_head * f_x));  G2 = log-likelihood ratio (2x2).
Writes ../tables/colloc_<head>.tsv, ../tables/colloc_all.tsv, ../tables/paradigm_summary.tsv
"""
import math, os, re, sys, json, collections
import common as C, lex, corpus_pages

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'tables')
OK = C.OK
V = 'aeiouāēīōū'
CONS = 'pkhmnlw' + OK
NATIVE = re.compile(r'^(?:[%s]?[%s])+$' % (CONS, V))

DET = set('''ka ke nā he kēia kēlā kēnā ia kekahi mau kona kāna koʻu kaʻu kou kāu ko kā kō
kō ko kona ia kahi'''.split())
STOP = set('''ka ke nā na o ʻo a ā i iā ma me no nō e he ua ʻia ia ʻana ana mai aku iho aʻe ai pū paha hoʻi
kēia kēlā kēnā nei lā ala wale anei ihola akula maila aʻela aloa ana nō ho'i akā inā ʻoiai a me
au wau ʻoe ʻoukou kākou mākou lākou lāua kāua māua ʻolua kou koʻu kona kāna kāu kaʻu ko kā kō kekahi mau
ʻaʻole ʻaʻohe hiki pēlā pēia penei pehea aia eia ʻoia ʻo ia ke ka nā la ala na ko kā kahi kēia
i ia ai nāna nona nāu nou noʻu naʻu nāia ona āna lāua iāia iaia'''.split())
# post-nominal grammatical modifiers kept but flagged (they are a closed class, not lexical)
GRAM = set('ʻole loa hou mua hope like ʻē nui iki liʻiliʻi ponoʻī āpau apau ʻekahi ʻelua ʻekolu ʻehā ʻelima ʻeono ʻehiku ʻewalu ʻeiwa ʻumi hoʻokahi kahi'.split())

HEADS = sys.argv[1:] or '''hale wai lau kumu hua ala mea kanaka wahi lā pō
lāʻau ʻāina moku manu iʻa kai mauna ʻōlelo pua keiki wahine kāne poʻe makua ʻaha lumi palapala puke
kula hana ʻoihana aupuni kino lima maka poʻo ahi ua mele hula waʻa wā manawa ʻili papa pae hōkū ʻohana
lāhui kahua luna kiʻi hui'''.split()


def g2(k11, k12, k21, k22):
    def h(*ks):
        n = sum(ks)
        return sum(k * math.log(k / n) for k in ks if k > 0)
    return 2 * (h(k11, k12, k21, k22) - h(k11 + k12, k21 + k22) - h(k11 + k21, k12 + k22))


def main():
    keep, st = corpus_pages.load()
    uni = collections.Counter()
    bi = collections.Counter()
    bi_pages = collections.defaultdict(set)
    frame = collections.defaultdict(collections.Counter)      # head -> X -> f (in DET frame)
    frame_pages = collections.defaultdict(lambda: collections.defaultdict(set))
    frame_cap = collections.defaultdict(collections.Counter)  # capitalised X (likely names)
    head_det = collections.Counter()
    for pi, s in keep:
        toks = [t for t, _ in s]
        caps = [c for _, c in s]
        for i, t in enumerate(toks):
            uni[t] += 1
            if i + 1 < len(toks):
                bi[(t, toks[i + 1])] += 1
        for i in range(1, len(toks) - 1):
            h = toks[i]
            if h in HEADS and toks[i - 1] in DET:
                head_det[h] += 1
                x = toks[i + 1]
                if x in STOP or not NATIVE.match(x):
                    continue
                frame[h][x] += 1
                frame_pages[h][x].add(pi)
                if caps[i + 1]:
                    frame_cap[h][x] += 1
    N = sum(uni.values())
    json.dump({'N': N, 'stats': st}, open(os.path.join(OUT, 'corpus_N.json'), 'w'))

    W, Wd = lex.wikt()
    P, _ = lex.pollex()
    A = lex.andrews()
    R = {lex.bare(r['word']): r for r in lex.reviews()}
    Wbare = {lex.bare(w) for w in W}
    Wspaced = {w for w in W if ' ' in w} | {w for w in Wd if ' ' in w}
    Wsolid = set(W) | set(Wd)
    Psp = {w for w in P if ' ' in w}
    Psolid = set(P)

    def attest(h, x):
        sp, so = f'{h} {x}', f'{h}{x}'
        b = lex.bare(so)
        a = []
        if sp in Wspaced: a.append('W2')          # Wiktionary, written as two words
        if so in Wsolid: a.append('W1')           # Wiktionary, written as one word
        if sp in Psp: a.append('P2')
        if so in Psolid: a.append('P1')
        if b in A: a.append('A1')                 # Andrews 1922 headword (always solid)
        if b in R: a.append('R:' + R[b].get('verdict', '?'))
        return a

    allrows = []
    summ = []
    for h in HEADS:
        rows = []
        for x, f in frame[h].items():
            fb = bi[(h, x)]
            fh, fx = uni[h], uni[x]
            pmi = math.log2(fb * N / (fh * fx)) if fb and fh and fx else 0
            k11 = fb; k12 = fh - fb; k21 = fx - fb; k22 = N - fh - fx + fb
            G = g2(k11, k12, k21, k22) if fb else 0
            df = len(frame_pages[h][x])
            xpos = sorted({e['pos'] for e in W.get(x, [])})
            att = attest(h, x)
            solid = uni.get(h + x, 0)
            rows.append(dict(head=h, mod=x, f=f, df=df, f_bigram=fb, pmi=round(pmi, 2), G2=round(G, 1),
                             cap=frame_cap[h][x], gram=x in GRAM, mod_pos_W='/'.join(p for p in xpos if p),
                             attest=','.join(att), solid_in_corpus=solid))
        rows.sort(key=lambda r: (-r['G2'], -r['f']))
        allrows += rows
        with open(os.path.join(OUT, f'colloc_{h}.tsv'), 'w') as fo:
            if rows:
                ks = list(rows[0].keys())
                fo.write('\t'.join(ks) + '\n')
                for r in rows:
                    fo.write('\t'.join(str(r[k]) for k in ks) + '\n')
        # paradigm measures
        lex_rows = [r for r in rows if not r['gram']]
        stable = [r for r in lex_rows if r['f'] >= 2 and r['df'] >= 2]
        toks = sum(r['f'] for r in lex_rows)
        ent = 0.0
        if toks:
            ps = [r['f'] / toks for r in lex_rows]
            ent = -sum(p * math.log2(p) for p in ps)
        nent = ent / math.log2(len(lex_rows)) if len(lex_rows) > 1 else 0
        top10 = sum(sorted((r['f'] for r in lex_rows), reverse=True)[:10]) / toks if toks else 0
        att_st = [r for r in stable if r['attest']]
        assoc = [r for r in stable if r['pmi'] >= 3 and r['G2'] >= 10.83]
        att_assoc = [r for r in assoc if r['attest']]
        noun_mod = sum(1 for r in stable if r['mod_pos_W'] == 'noun')
        verb_mod = sum(1 for r in stable if 'verb' in r['mod_pos_W'] and 'noun' not in r['mod_pos_W'])
        both_mod = sum(1 for r in stable if 'verb' in r['mod_pos_W'] and 'noun' in r['mod_pos_W'])
        summ.append(dict(head=h, f_head=uni[h], f_head_after_det=head_det[h], modifier_tokens=toks,
                         types_all=len(lex_rows), types_f2_df2=len(stable),
                         assoc_types=len(assoc), top10_share=round(top10, 2), norm_entropy=round(nent, 2),
                         attested_of_stable=len(att_st), attested_of_assoc=len(att_assoc),
                         mod_noun=noun_mod, mod_verb=verb_mod, mod_both=both_mod,
                         top=' '.join(f"{r['mod']}({r['f']})" for r in sorted(stable, key=lambda r: -r['f'])[:12])))
    with open(os.path.join(OUT, 'colloc_all.tsv'), 'w') as fo:
        ks = list(allrows[0].keys())
        fo.write('\t'.join(ks) + '\n')
        for r in allrows:
            fo.write('\t'.join(str(r[k]) for k in ks) + '\n')
    with open(os.path.join(OUT, 'paradigm_summary.tsv'), 'w') as fo:
        ks = list(summ[0].keys())
        fo.write('\t'.join(ks) + '\n')
        for r in summ:
            fo.write('\t'.join(str(r[k]) for k in ks) + '\n')
    print('N tokens', N)
    for r in summ:
        print(r)


if __name__ == '__main__':
    main()
