"""Deictic series on cleaned Hawaiian Wikipedia and on Andrews-Parker 1922 OCR.
Output: tables/deixis.txt"""
import os, re, collections
import common

HERE = common.HERE
FORMS = ['kēia', 'kēnā', 'kēlā', 'pēia', 'penei', 'pēnā', 'pēlā', 'pehea', 'nei', 'lā', 'ala',
         'ʻaneʻi', 'ʻanā', 'ʻō', 'ʻoneʻi', 'ʻonā', 'laila', 'hea', 'eia', 'aia', 'nēia', 'ia', 'ua']


def main():
    sents, _ = common.corpus()
    uni = common.unigram_counts(sents)
    strip = collections.Counter()
    for t, n in uni.items():
        strip[common.strip_marks(t)] += n
    out = ['form | hawwiki exact | hawwiki same letters, any diacritics (homographs included)']
    for f in FORMS:
        out.append(f'  {f:7s} {uni[f]:6d} {strip[common.strip_marks(f)]:6d}')
    # collocations
    bg = collections.Counter()
    tri = collections.Counter()
    for s in sents:
        toks = [t for t, _ in s]
        for i in range(len(toks) - 1):
            bg[(toks[i], toks[i + 1])] += 1
        for i in range(len(toks) - 2):
            tri[(toks[i], toks[i + 2])] += 1   # skip-one: ke _ nei
    out.append('\nlocative collocations: ' + ', '.join(
        f'{a} {b} {bg[(a, b)]}' for a, b in [('i', 'laila'), ('ma', 'laila'), ('i', 'ʻaneʻi'), ('ma', 'ʻaneʻi'),
                                              ('ma', 'ʻō'), ('i', 'ʻō'), ('i', 'hea'), ('ma', 'hea'), ('aia', 'i'),
                                              ('eia', 'nō'), ('kēia', 'mau'), ('kēlā', 'mau'), ('kēnā', 'mau'),
                                              ('kēlā', 'me'), ('me', 'kēia')]))
    out.append('TAM frame ke _ nei vs ke _ lā (skip-one): nei %d, lā %d, ala %d' % (
        tri[('ke', 'nei')], tri[('ke', 'lā')], tri[('ke', 'ala')]))
    out.append('directional + nei / lā: ' + ', '.join(
        f'{d} {x} {bg[(d, x)]}' for d in ('mai', 'aku', 'aʻe', 'iho') for x in ('nei', 'lā')))
    out.append('fused DIR+lā: maila %d akula %d aʻela %d ihola %d' % (uni['maila'], uni['akula'], uni['aʻela'], uni['ihola']))
    out.append('i hala aku nei (ago) %d; i hala aku lā %d' % (
        sum(1 for s in sents for i in range(len(s) - 3) if [t for t, _ in s[i:i + 4]] == ['i', 'hala', 'aku', 'nei']),
        sum(1 for s in sents for i in range(len(s) - 3) if [t for t, _ in s[i:i + 4]] == ['i', 'hala', 'aku', 'lā'])))
    # Andrews-Parker 1922: undiacritised counts of the forms whose spelling is unambiguous enough
    ap = open(f'{common.CACHE}/andrews-parker1922.txt', encoding='utf-8').read().lower().replace("'", '')
    toks = re.findall(r'[a-z]+', ap)
    c = collections.Counter(toks)
    out.append('\nAndrews-Parker 1922 OCR whole-word counts (undiacritised; homographs collapse): ' + ', '.join(
        f'{w} {c[w]}' for w in ['keia', 'kena', 'kela', 'peia', 'penei', 'pena', 'pela', 'pehea', 'nei', 'la',
                                'aneʻi', 'anei', 'laila', 'malaila', 'ilaila', 'maanei', 'ianei', 'eia', 'aia', 'neia']))
    open(os.path.join(HERE, 'tables', 'deixis.txt'), 'w').write('\n'.join(out) + '\n')
    print('\n'.join(out))


if __name__ == '__main__':
    main()
