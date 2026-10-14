"""Articles and number on cleaned Hawaiian Wikipedia.

1. ka / ke against the next word's first segment (KEAO rule: ke before k e a o).
2. Number frame: noun types attested after BOTH a singular article (ka/ke) and nā.
3. Plural vowel lengthening in person nouns: does the long form go with nā and the
   short with ka/ke? (agreement = the kahakō carries number redundantly with the article)
4. Other determiners + mau (plural marker), he / kekahi, ua ... nei / lā, i vs iā.
Output: tables/articles.txt
"""
import os, collections, re
import common

HERE = common.HERE
PLURALS = [('kanaka', 'kānaka'), ('wahine', 'wāhine'), ('makua', 'mākua'), ('kupuna', 'kūpuna'),
           ('kahuna', 'kāhuna'), ('kaikamahine', 'kaikamāhine'), ('makuahine', 'mākuahine'),
           ('luahine', 'luāhine'), ('ʻelemakule', 'ʻelemākule'), ('ʻaumakua', 'ʻaumākua'),
           ('kahiko', 'kāhiko'), ('kaikuahine', 'kaikuāhine'), ('makuakāne', 'mākuakāne'),
           ('wahine', 'wāhine')]
FUNC = set('''i ma a o e ka ke nā na no he me ua ʻo ia iā mai aku aʻe iho nei lā ala ana ʻana ʻia ai nō
hoʻi paha wale loa pū ʻole kekahi kēia kēlā kēnā ko kā kō mau poʻe'''.split())


def main():
    sents, _ = common.corpus()
    out = []
    # 1 ka/ke
    init = collections.defaultdict(collections.Counter)
    word = collections.defaultdict(collections.Counter)
    for s in sents:
        toks = [t for t, _ in s]
        for i, t in enumerate(toks[:-1]):
            if t in ('ka', 'ke'):
                n = toks[i + 1]
                if not common.is_native(n) or n in FUNC:
                    continue
                first = n[0]
                init[first][t] += 1
                word[n][t] += 1
    tot = sum(sum(c.values()) for c in init.values())
    keao = set('keao')
    ok = sum(c['ke'] if f in keao else c['ka'] for f, c in init.items())
    out.append(f'1. ka/ke before a native-spelled content word: {tot} tokens; KEAO rule correct for {ok} '
               f'({100*ok/tot:.1f}%)')
    for f in sorted(init, key=lambda f: -sum(init[f].values())):
        c = init[f]
        out.append(f'   {f}: ka {c["ka"]:5d}  ke {c["ke"]:5d}')
    exc = [(n, c) for n, c in word.items() if (c['ke'] > c['ka']) != (n[0] in keao) and sum(c.values()) >= 5]
    exc.sort(key=lambda x: -sum(x[1].values()))
    out.append('   words whose majority article goes against KEAO (>=5 tokens): ' +
               ', '.join(f"{n}(ka {c['ka']}/ke {c['ke']})" for n, c in exc[:25]))
    maj = sum(max(c.values()) for c in word.values())
    out.append(f'   choosing each word\'s own majority article: {maj}/{tot} ({100*maj/tot:.1f}%)  '
               f'-> residue is lexical, not semantic')
    # does any noun take BOTH ka and ke with >=3 each?
    both = [(n, c) for n, c in word.items() if c['ka'] >= 3 and c['ke'] >= 3]
    out.append('   nouns with >=3 of each: ' + ', '.join(f"{n}(ka {c['ka']}/ke {c['ke']})" for n, c in both))

    # 2 number frame
    sg = collections.Counter()
    pl = collections.Counter()
    for s in sents:
        toks = [t for t, _ in s]
        for i, t in enumerate(toks[:-1]):
            n = toks[i + 1]
            if n in FUNC or not common.is_native(n):
                continue
            if t in ('ka', 'ke'):
                sg[n] += 1
            elif t == 'nā':
                pl[n] += 1
    bothn = [n for n in sg if n in pl]
    out.append(f'\n2. noun types after ka/ke: {len(sg)}; after nā: {len(pl)}; after both: {len(bothn)}')
    for m in (2, 5):
        out.append(f'   with >= {m} tokens under each: {sum(1 for n in bothn if sg[n] >= m and pl[n] >= m)}')
    out.append('   tokens: sg ' + str(sum(sg.values())) + ', pl ' + str(sum(pl.values())))

    # 3 plural lengthening agreement
    out.append('\n3. person-noun plural by lengthening: article agreement (sg article = ka/ke/he/kekahi; pl = nā / mau)')
    seen = set()
    agg = collections.Counter()
    for a, b in PLURALS:
        if (a, b) in seen:
            continue
        seen.add((a, b))
        c = collections.Counter()
        for s in sents:
            toks = [t for t, _ in s]
            for i in range(1, len(toks)):
                if toks[i] not in (a, b):
                    continue
                prev = toks[i - 1]
                form = 'short' if toks[i] == a else 'long'
                if prev in ('ka', 'ke', 'kekahi'):
                    c[(form, 'sg')] += 1
                elif prev in ('nā', 'mau'):
                    c[(form, 'pl')] += 1
        agg.update(c)
        out.append(f"   {a:12s}/{b:13s}  short+sg {c[('short','sg')]:4d}  long+pl {c[('long','pl')]:4d}   "
                   f"short+pl {c[('short','pl')]:4d}  long+sg {c[('long','sg')]:3d}")
    agree = agg[('short', 'sg')] + agg[('long', 'pl')]
    tot3 = sum(agg.values())
    out.append(f'   all: agreeing {agree}/{tot3} ({100*agree/tot3:.1f}%); short form with plural article '
               f"{agg[('short','pl')]}; long form with singular article {agg[('long','sg')]}")

    # 4 determiners + mau, he, kekahi, ua...nei/lā, i vs iā
    det_mau = collections.Counter()
    uni = common.unigram_counts(sents)
    ua_nei = collections.Counter()
    i_ia = collections.Counter()
    for s in sents:
        toks = [t for t, _ in s]
        caps = [c for _, c in s]
        for i, t in enumerate(toks[:-1]):
            if toks[i + 1] == 'mau':
                det_mau[t] += 1
            if t == 'ua' and i + 2 < len(toks):
                # ua N nei / ua N lā  (noun, then deictic within 3 tokens)
                for j in range(i + 2, min(i + 5, len(toks))):
                    if toks[j] in ('nei', 'lā', 'ala'):
                        ua_nei[toks[j]] += 1
                        break
            if t in ('i', 'iā'):
                n = toks[i + 1]
                kind = ('pron' if n in {'au', 'ʻoe', 'ia', 'kāua', 'māua', 'ʻolua', 'lāua', 'kākou', 'mākou',
                                        'ʻoukou', 'lākou'} else 'proper' if caps[i + 1] else
                        'article' if n in ('ka', 'ke', 'nā', 'kekahi', 'kēia', 'kēlā', 'kona', 'kāna') else 'other')
                i_ia[(t, kind)] += 1
    out.append('\n4. determiners before the plural marker mau: ' +
               ', '.join(f'{d}({n})' for d, n in det_mau.most_common(14)))
    out.append(f"   he {uni['he']}, kekahi {uni['kekahi']}, he mau {det_mau['he']}, kekahi mau {det_mau['kekahi']}")
    out.append(f"   ua ... nei {ua_nei['nei']}, ua ... lā/ala {ua_nei['lā'] + ua_nei['ala']} (crude window: ua + 1-3 tokens + nei/lā)")
    out.append('   i vs iā by following item: ' + ', '.join(f'{k[0]}+{k[1]} {v}' for k, v in sorted(i_ia.items())))
    open(os.path.join(HERE, 'tables', 'articles.txt'), 'w').write('\n'.join(out) + '\n')
    print('\n'.join(out))


if __name__ == '__main__':
    main()
