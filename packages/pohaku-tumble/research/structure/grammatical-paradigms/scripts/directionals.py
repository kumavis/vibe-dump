"""Directionals mai / aku / aʻe / iho after their host (verb or locative noun).

Corpus 1: cleaned Hawaiian Wikipedia (common.corpus()).
Corpus 2: Andrews-Parker 1922 OCR (19th-c. citations; no okina/kahakō, so aʻe = ae and
          'ae' "yes" collapses with it; counted separately and flagged).

Host = the nearest preceding token after skipping the post-verbal slots that Alexander
(1864/1920: 19) puts between verb and directive: qualifying adverbs (mau wale ʻole pū hou
koke loa) and the passive ʻia.  A hit is kept only if the host is a content word (not
in FUNC), which drops sentence-initial prohibitive/prepositional mai, 'ma mai', etc.
DIR+lā fusions (maila akula aʻela ihola) count as their directional.

Outputs: tables/dir_hosts.tsv, tables/dir_summary.txt, tables/dir_ap1922.tsv
"""
import os, re, collections
import common

HERE = common.HERE
DIRS = {'mai': 'mai', 'aku': 'aku', 'aʻe': 'aʻe', 'iho': 'iho',
        'maila': 'mai', 'akula': 'aku', 'aʻela': 'aʻe', 'ihola': 'iho'}
SKIP = {'ʻia', 'mau', 'wale', 'ʻole', 'pū', 'hou', 'koke', 'loa', 'nō'}
FUNC = set('''i ma a o e ka ke nā na no he me ua ʻo ia iā mai aku aʻe iho nei lā ala ana ʻana ai hoʻi paha
kekahi kēia kēlā kēnā ko kā kō ʻaʻole inā akā au ʻoe wau kāua māua ʻolua lāua kākou mākou ʻoukou lākou
kona kāna kou kāu koʻu kaʻu ona āna oʻu aʻu ou āu nona nāna kuʻu nēia eia aia pēlā penei pehea
the of and in to'''.split())

DEGREE = ['nui', 'liʻiliʻi', 'ʻoi', 'emi', 'kiʻekiʻe', 'haʻahaʻa', 'maikaʻi', 'lōʻihi', 'pōkole', 'kokoke',
          'mamao', 'ʻoi loa', 'hapa', 'ʻuʻuku']
TIME_HOSTS = ['mua', 'hope', 'pule', 'makahiki', 'mahina', 'lā', 'wā', 'manawa', 'kenekulia']


def host_of(toks, i):
    j = i - 1
    while j >= 0 and toks[j] in SKIP:
        j -= 1
    return toks[j] if j >= 0 else None


def wikipedia():
    sents, _ = common.corpus()
    tab = collections.defaultdict(collections.Counter)
    raw = collections.Counter()
    after = collections.Counter()
    for s in sents:
        toks = [t for t, _ in s]
        for i, t in enumerate(toks):
            if t not in DIRS:
                continue
            d = DIRS[t]
            raw[d] += 1
            h = host_of(toks, i)
            if h is None or h in FUNC or not common.is_native(h):
                continue
            tab[h][d] += 1
            if i + 1 < len(toks):
                after[(d, toks[i + 1])] += 1
    return tab, raw, after


def andrews_parker():
    txt = open(f'{common.CACHE}/andrews-parker1922.txt', encoding='utf-8').read().lower()
    txt = txt.replace("'", '')
    toks = re.findall(r'[a-z]+', txt)
    lex = {common.strip_marks(w) for w in common.load_kaikki() if common.is_native(common.norm(w))}
    func = {common.strip_marks(f) for f in FUNC}
    d2 = {'mai': 'mai', 'aku': 'aku', 'ae': 'ae', 'iho': 'iho', 'maila': 'mai', 'akula': 'aku',
          'aela': 'ae', 'ihola': 'iho'}
    skip = {common.strip_marks(x) for x in SKIP}
    tab = collections.defaultdict(collections.Counter)
    for i, t in enumerate(toks):
        if t not in d2:
            continue
        j = i - 1
        while j >= 0 and toks[j] in skip:
            j -= 1
        h = toks[j] if j >= 0 else None
        if not h or h in func or h not in lex:
            continue
        tab[h][d2[t]] += 1
    return tab


def summarize(tab, dirs, label, out):
    hosts = {h: c for h, c in tab.items()}
    tok = sum(sum(c.values()) for c in hosts.values())
    out.append(f'\n[{label}] host types {len(hosts)}, directional tokens after a content host {tok}')
    for d in dirs:
        out.append(f'   {d:4s} tokens {sum(c[d] for c in hosts.values()):5d}  host types {sum(1 for c in hosts.values() if c[d]):4d}')
    for k in (1, 2):
        multi = [h for h, c in hosts.items() if sum(1 for d in dirs if c[d] >= k) >= 2]
        ma = [h for h, c in hosts.items() if c[dirs[0]] >= k and c[dirs[1]] >= k]
        ai = [h for h, c in hosts.items() if c[dirs[2]] >= k and c[dirs[3]] >= k]
        all4 = [h for h, c in hosts.items() if all(c[d] >= k for d in dirs)]
        out.append(f'   with each counted direction >= {k} token(s): hosts with >=2 directionals {len(multi)}; '
                   f'{dirs[0]}+{dirs[1]} {len(ma)}; {dirs[2]}+{dirs[3]} {len(ai)}; all four {len(all4)}')
    return hosts


def main():
    out = []
    tab, raw, after = wikipedia()
    out.append('Hawaiian Wikipedia (cleaned) raw directional tokens: ' + str(dict(raw)))
    hosts = summarize(tab, ['mai', 'aku', 'aʻe', 'iho'], 'Wikipedia', out)
    rows = sorted(hosts.items(), key=lambda kv: -sum(kv[1].values()))
    with open(os.path.join(HERE, 'tables', 'dir_hosts.tsv'), 'w') as fh:
        fh.write('host\tmai\taku\taʻe\tiho\ttotal\tn_dirs\n')
        for h, c in rows:
            fh.write(f"{h}\t{c['mai']}\t{c['aku']}\t{c['aʻe']}\t{c['iho']}\t{sum(c.values())}\t"
                     f"{sum(1 for d in ('mai','aku','aʻe','iho') if c[d])}\n")
    out.append('\n  top 40 hosts (mai aku aʻe iho):')
    for h, c in rows[:40]:
        out.append(f"   {h:12s} {c['mai']:4d} {c['aku']:4d} {c['aʻe']:4d} {c['iho']:4d}")
    out.append('\n  hosts with both mai and aku (>=2 each):')
    out.append('   ' + ', '.join(f"{h}({c['mai']}/{c['aku']})" for h, c in rows if c['mai'] >= 2 and c['aku'] >= 2))
    out.append('  hosts with both aʻe and iho (>=1 each):')
    out.append('   ' + ', '.join(f"{h}({c['aʻe']}/{c['iho']})" for h, c in rows if c['aʻe'] >= 1 and c['iho'] >= 1))
    # degree / comparative hosts (Shionoya 2008)
    out.append('\n  degree words + directional (Wikipedia):')
    for h in DEGREE:
        c = hosts.get(h)
        if c:
            out.append(f"   {h:10s} mai {c['mai']:3d} aku {c['aku']:3d} aʻe {c['aʻe']:3d} iho {c['iho']:3d}")
    out.append('  time / locative-noun hosts + directional (Wikipedia):')
    for h in TIME_HOSTS:
        c = hosts.get(h)
        if c:
            out.append(f"   {h:10s} mai {c['mai']:3d} aku {c['aku']:3d} aʻe {c['aʻe']:3d} iho {c['iho']:3d}")
    out.append('  what follows the directional (top 12 each):')
    for d in ('mai', 'aku', 'aʻe', 'iho'):
        out.append(f'   {d}: ' + ', '.join([f'{w}({n})' for (dd, w), n in after.most_common() if dd == d][:12]))

    # ---- restrict hosts to Wiktionary verbs (drops nouns before prepositional 'mai' "from"
    #      and bot pseudo-words); this is the V + DIR frame
    k = common.load_kaikki()
    verbs = {w for w, es in k.items() if any(e['pos'] == 'verb' for e in es)}
    vt = {h: c for h, c in hosts.items() if h in verbs}
    out.append('\n=== V + DIR frame: hosts that Wiktionary lists as verbs')
    summarize(vt, ['mai', 'aku', 'aʻe', 'iho'], 'Wikipedia, verb hosts', out)
    vrows = sorted(vt.items(), key=lambda kv: -sum(kv[1].values()))
    with open(os.path.join(HERE, 'tables', 'dir_verb_hosts.tsv'), 'w') as fh:
        fh.write('verb\tmai\taku\taʻe\tiho\ttotal\tgloss\n')
        for h, c in vrows:
            g = next((e['glosses'][0] for e in k[h] if e['pos'] == 'verb' and e['glosses']), '')
            fh.write(f"{h}\t{c['mai']}\t{c['aku']}\t{c['aʻe']}\t{c['iho']}\t{sum(c.values())}\t{g[:60]}\n")
    out.append('  verb hosts with both mai and aku (any count): ' +
               ', '.join(f"{h}({c['mai']}/{c['aku']})" for h, c in vrows if c['mai'] and c['aku']))
    # random sample of verb + mai / aku tokens for hand classification
    import random
    random.seed(7)
    sents, _ = common.corpus()
    occ = {'mai': [], 'aku': [], 'aʻe': [], 'iho': []}
    for s in sents:
        toks = [t for t, _ in s]
        for i, t in enumerate(toks):
            if t in DIRS:
                h = host_of(toks, i)
                if h in vt:
                    occ[DIRS[t]].append(' '.join(toks[max(0, i - 6): i + 6]))
    with open(os.path.join(HERE, 'tables', 'dir_sample.txt'), 'w') as fh:
        for d, n in (('mai', 50), ('aku', 40), ('aʻe', 30), ('iho', 30)):
            smp = random.sample(occ[d], min(n, len(occ[d])))
            for j, line in enumerate(smp):
                fh.write(f'{d}\t{j}\t{line}\n')

    ap = andrews_parker()
    aph = summarize(ap, ['mai', 'aku', 'ae', 'iho'], 'Andrews-Parker 1922 OCR citations (undiacritised)', out)
    rows2 = sorted(aph.items(), key=lambda kv: -sum(kv[1].values()))
    with open(os.path.join(HERE, 'tables', 'dir_ap1922.tsv'), 'w') as fh:
        fh.write('host\tmai\taku\tae\tiho\ttotal\n')
        for h, c in rows2:
            fh.write(f"{h}\t{c['mai']}\t{c['aku']}\t{c['ae']}\t{c['iho']}\t{sum(c.values())}\n")
    out.append('\n  A-P top 30 hosts (mai aku ae iho):')
    for h, c in rows2[:30]:
        out.append(f"   {h:12s} {c['mai']:4d} {c['aku']:4d} {c['ae']:4d} {c['iho']:4d}")
    # overlap of mai+aku hosts between the two corpora
    w_ma = {common.strip_marks(h) for h, c in hosts.items() if c['mai'] and c['aku']}
    a_ma = {h for h, c in aph.items() if c['mai'] and c['aku']}
    out.append(f'\n  hosts with both mai and aku: Wikipedia {len(w_ma)}, A-P {len(a_ma)}, in both {len(w_ma & a_ma)}, '
               f'union {len(w_ma | a_ma)}')
    open(os.path.join(HERE, 'tables', 'dir_summary.txt'), 'w').write('\n'.join(out) + '\n')
    print('\n'.join(out))


if __name__ == '__main__':
    main()
