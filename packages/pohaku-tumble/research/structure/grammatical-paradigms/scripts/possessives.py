"""a/o possessive choice measured on Hawaiian Wikipedia.

Possessum extraction (lowercase tokens only, so place-name Kona is skipped):
  * k-forms   kaʻu kāu kāna | koʻu kou kona          -> next token
  * kā / ko + non-singular pronoun (any diacritic variant) -> token after pronoun
  'mau' (plural marker) is skipped; if the candidate is a function word the hit is dropped.
  A candidate followed by 'ʻana' is recorded as a nominalised verb (V ʻana).
Outputs:
  tables/poss_nouns.tsv     noun, a, o, total, share_a, category (hand-coded), predicted, agrees
  tables/poss_mixed.txt     KWIC lines for nouns attested with both a and o
  tables/poss_summary.txt   counts
Hand-coded categories follow the descriptions in Alexander 1864/1920 §15-17,
Wilson 1980 §2.2.3 and §2.3.1 (see NOTES.md).  The coding is mine.
"""
import os, re, collections
import common

HERE = common.HERE
A_FORMS = {'kaʻu': 1, 'kāu': 2, 'kāna': 3}
O_FORMS = {'koʻu': 1, 'kou': 2, 'kona': 3}
NSG = {'kāua', 'māua', 'ʻolua', 'lāua', 'kākou', 'mākou', 'ʻoukou', 'lākou'}
NSG_STRIP = {common.strip_marks(x) for x in NSG}
FUNC = set('''i ma a o e ka ke nā na no he me ua ʻo ia iā mai aku aʻe iho nei lā ala ana ʻana ʻia ai nō
hoʻi paha wale loa pū ʻole kekahi kēia kēlā kēnā ko kā kō a me ʻaʻole inā akā no ka mea ʻoi
ʻelua ʻekolu ʻehā hoʻokahi he mau lākou lāua kākou mākou ʻoukou kāua māua ʻolua au ʻoe wau'''.split())

# --- hand-coded semantic categories (my coding) and the class the grammars predict
CAT = {
    # ascending / same-generation kin -> o (Alexander §16; Wilson ex. 2.19-2.20)
    'KIN-ASC': ('o', '''makua makuakāne makuakane makuahine mākua kupuna kūpuna kupunakāne kupunawahine tūtū
        tūtūwahine tūtūkāne kaikuaʻana kaikaina kaikuahine kaikunāne kaikunane hoahānau ʻohana pōkiʻi
        kaikoʻeke ʻaumakua kūkū'''),
    # descendants -> a (Alexander §16-17; Wilson ex. 2.24)
    'KIN-DESC': ('a', '''keiki kaikamahine kamaliʻi moʻopuna mamo hānauna keikikāne keikikane pua lāhui-desc
        hiapo muli'''),
    # spouse / lover -> a (Alexander §17 kane, wahine; Wilson ex. 2.25)
    'SPOUSE': ('a', '''wahine kāne kane ipo wahine-male male hoapili'''),
    # body, mind, faculties, feelings -> o (Alexander §16)
    'BODY-MIND': ('o', '''lima kino poʻo maka wāwae leo puʻuwai naʻau lolo manaʻo noʻonoʻo makemake aloha
        ahonui hoʻomanawanui hoomanawanui ʻike-mind umauma poli ola-body ʻili lauoho mana pono pōmaikaʻi
        malu lokomaikaʻi ikaika naʻauao akamai ʻano huhū hauʻoli'''),
    # name, title, honour, image of the possessor -> o (Wilson ex. 2.11-2.17)
    'NAME-HONOUR': ('o', '''inoa kahili hoʻolewa kupapaʻu kiaʻhoʻomanaʻo kiahoʻomanaʻo kūlana kuleana-title
        hanohano'''),
    # house, land, vehicle, clothing, furniture ("spatial use") -> o (Wilson §2.3.1, ex. 2.40-2.44)
    'SPATIAL': ('o', '''hale home ʻāina aina waʻa kaʻa moku lole palule noho moe lumi kai wahi kauhale
        kulanakauhale moku-ship one hānau-place'''),
    # life, time, death, birth, age (non-controlled states / events) -> o
    'LIFE-TIME': ('o', '''ola wā make hānau makahiki lā au-era manawa'''),
    # works, products, utterances, acts the possessor performs -> a (Alexander §16-17; Wilson ex. 2.22)
    'WORK-PRODUCT': ('a', '''hana puke mele kiʻi moʻolelo papahana palapala ʻōlelo-utt pule kauoha wānana
        hoʻokolohua kākau mea-made noi kipa haʻawina kōkua makau huakaʻi pāʻani kamaʻilio hoʻokō'''),
    # food, drink, tools, animals, money, ordinary property -> a (Alexander §16; Wilson ex. 2.29-2.32)
    'PROPERTY': ('a', '''ʻai mea-ʻai ʻīlio hoe kālā waiwai pia haupia lio-prop pahi'''),
    # subordinates, servants, students, employees -> a (Alexander §17; Wilson ex. 2.27-2.28)
    'SUBORDINATE': ('a', '''kauwā kauā haumāna haumana limahana poʻe-lawehana'''),
    # rulers, superiors -> o (Alexander §16 "rulers ... take o")
    'RULER': ('o', '''aliʻi mōʻī haku kumu-teacher'''),
}
NOUN2CAT = {}
for cat, (pred, words) in CAT.items():
    for w in words.split():
        NOUN2CAT.setdefault(w, cat)


def main():
    sents, _ = common.corpus()
    uni = common.unigram_counts(sents)
    canon = {}
    for t, n in uni.most_common():           # most frequent spelling wins
        canon.setdefault(common.strip_marks(t), t)
    cnt = collections.defaultdict(lambda: {'a': 0, 'o': 0})
    vana = collections.defaultdict(lambda: {'a': 0, 'o': 0})
    kwic = collections.defaultdict(list)
    src = collections.Counter()
    for s in sents:
        toks = [t for t, _ in s]
        for i, (t, cap) in enumerate(s):
            cls = None
            j = None
            if not cap and t in A_FORMS:
                cls, j = 'a', i + 1
                src['k-form a'] += 1
            elif not cap and t in O_FORMS:
                cls, j = 'o', i + 1
                src['k-form o'] += 1
            elif t in ('kā', 'ko', 'kō') and i + 1 < len(s) and common.strip_marks(toks[i + 1]) in NSG_STRIP:
                cls, j = ('a' if t == 'kā' else 'o'), i + 2
                src[f'{t} + pronoun'] += 1
            if cls is None or j >= len(s):
                continue
            if toks[j] == 'mau' and j + 1 < len(s):
                j += 1
            n = toks[j]
            if n in FUNC or not common.is_native(n):
                src['dropped (function word / foreign)'] += 1
                continue
            n = canon.get(common.strip_marks(n), n)   # merge diacritic variants (makuakane -> makuakāne)
            if n in FUNC:
                src['dropped (function word / foreign)'] += 1
                continue
            if j + 1 < len(s) and toks[j + 1] == 'ʻana':
                vana[n][cls] += 1
                continue
            cnt[n][cls] += 1
            kwic[n].append((cls, ' '.join(toks[max(0, i - 4): j + 5])))

    rows = []
    for n, d in cnt.items():
        tot = d['a'] + d['o']
        cat = NOUN2CAT.get(n)
        pred = CAT[cat][0] if cat else ''
        agree = (d[pred] if pred else '')
        rows.append((n, d['a'], d['o'], tot, round(d['a'] / tot, 3), cat or '', pred, agree))
    rows.sort(key=lambda r: -r[3])
    with open(os.path.join(HERE, 'tables', 'poss_nouns.tsv'), 'w') as fh:
        fh.write('noun\ta\to\ttotal\tshare_a\tcategory\tpredicted\ttokens_agreeing\n')
        for r in rows:
            fh.write('\t'.join(map(str, r)) + '\n')

    out = []
    out.append('extraction sources: ' + str(dict(src)))
    ntok = sum(r[3] for r in rows)
    out.append(f'possessum noun types {len(rows)}, tokens {ntok}')
    out.append(f"  a tokens {sum(r[1] for r in rows)}, o tokens {sum(r[2] for r in rows)}")
    for minn in (1, 3, 5):
        sub = [r for r in rows if r[3] >= minn]
        both = [r for r in sub if r[1] and r[2]]
        stro = [r for r in sub if r[4] <= 0.1]
        stra = [r for r in sub if r[4] >= 0.9]
        out.append(f'types with >= {minn} tokens: {len(sub)}; attested with both a and o: {len(both)} '
                   f'({100*len(both)/len(sub):.1f}%); >=90% o: {len(stro)}; >=90% a: {len(stra)}')
    # agreement with grammar predictions
    coded = [r for r in rows if r[5]]
    tok_c = sum(r[3] for r in coded)
    tok_ok = sum(r[7] for r in coded)
    out.append(f'coded types {len(coded)} ({tok_c} tokens); tokens in predicted class {tok_ok} '
               f'({100*tok_ok/tok_c:.1f}%)')
    typ_ok = sum(1 for r in coded if (r[1] if r[6] == 'a' else r[2]) > r[3] / 2)
    out.append(f'coded types whose majority class = predicted: {typ_ok}/{len(coded)}')
    bycat = collections.defaultdict(lambda: [0, 0, 0])
    for r in coded:
        b = bycat[r[5]]
        b[0] += 1; b[1] += r[3]; b[2] += r[7]
    out.append('per category: types, tokens, tokens in predicted class, %')
    for cat in CAT:
        if cat in bycat:
            b = bycat[cat]
            out.append(f'  {cat:13s} pred {CAT[cat][0]}  types {b[0]:3d} tokens {b[1]:5d} agree {b[2]:5d} '
                       f'({100*b[2]/b[1]:.1f}%)')
    out.append('\ncoded nouns going against prediction (tokens against >= 1):')
    for r in coded:
        against = r[3] - r[7]
        if against:
            out.append(f'  {r[0]:14s} {r[5]:12s} pred {r[6]}  a={r[1]} o={r[2]}')
    out.append('\nnominalised verbs (V ʻana) after possessives: types %d, tokens a=%d o=%d' % (
        len(vana), sum(d['a'] for d in vana.values()), sum(d['o'] for d in vana.values())))
    for n, d in sorted(vana.items(), key=lambda kv: -(kv[1]['a'] + kv[1]['o']))[:25]:
        out.append(f'  {n:12s} a={d["a"]:3d} o={d["o"]:3d}')
    open(os.path.join(HERE, 'tables', 'poss_summary.txt'), 'w').write('\n'.join(out) + '\n')
    print('\n'.join(out))

    with open(os.path.join(HERE, 'tables', 'poss_mixed.txt'), 'w') as fh:
        for r in rows:
            if r[1] and r[2]:
                fh.write(f'== {r[0]}  a={r[1]} o={r[2]}  [{r[5]}]\n')
                seen = {'a': 0, 'o': 0}
                for cls, line in kwic[r[0]]:
                    if seen[cls] < 4:
                        fh.write(f'   {cls}: {line}\n')
                        seen[cls] += 1
    print('\nTop 60 possessum nouns:')
    for r in rows[:60]:
        print('  ', r)


if __name__ == '__main__':
    main()
