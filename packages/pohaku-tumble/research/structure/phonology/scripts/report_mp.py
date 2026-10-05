#!/usr/bin/env python3
"""Print markdown tables from minpairs_summary*.json (for NOTES.md)."""
import json, os, sys, collections
HERE = os.path.dirname(os.path.abspath(__file__))
suffix = sys.argv[1] if len(sys.argv) > 1 else ''
r = json.load(open(os.path.join(HERE, f'minpairs_summary{suffix}.json')))


def pc(x):
    return '–' if x is None else f'{100 * x:.1f}%'


def pv(x):
    return '–' if x is None else (f'<{x:.3f}' if x <= 0.0034 else f'{x:.3f}')


print(f"population {r['population']} forms; {r['n_pairs']} minimal pairs; {r['forms_with_a_neighbour']} forms have >=1; mean {r['mean_neighbours']:.2f}\n")
print('| opposition family | pairs | share gloss stem | matched random | p | tf-idf cos ≥ .25 | random | p | same POS | random | shared POLLEX etymon (n evaluable) | Wiktionary-linked |')
print('|---|---|---|---|---|---|---|---|---|---|---|---|')
for fam, row in r['families'].items():
    print(f"| {fam} | {row['n']} | {pc(row['gloss'])} | {pc(row.get('gloss_base'))} | {pv(row.get('gloss_p'))} | {pc(row['cos25'])} | {pc(row.get('cos25_base'))} | {pv(row.get('cos25_p'))} | {pc(row['pos'])} | {pc(row.get('pos_base'))} | {pc(row['pxid'])} ({row['both_px_n']}) | {pc(row['link'])} |")
a = r['all']; b = r['all_base']
print(f"| **all minimal pairs** | {a['n']} | {pc(a['gloss'])} | {pc(b['gloss'])} | {pv(r['all_base_p']['gloss'])} | {pc(a['cos25'])} | {pc(b['cos25'])} | {pv(r['all_base_p']['cos25'])} | {pc(a['pos'])} | {pc(b['pos'])} | {pc(a['pxid'])} ({a['both_px_n']}) | {pc(a['link'])} |")
h = r['hamming2']; u = r['random_unmatched']
print(f"| same-length pairs differing in 2 segments | {h['n']} | {pc(h['gloss'])} | | | {pc(h['cos25'])} | | | {pc(h['pos'])} | | {pc(h['pxid'])} ({h['both_px_n']}) | {pc(h['link'])} |")
print(f"| unmatched random pairs | {u['n']} | {pc(u['gloss'])} | | | {pc(u['cos25'])} | | | {pc(u['pos'])} | | {pc(u['pxid'])} ({u['both_px_n']}) | {pc(u['link'])} |")
w = r['all_without_links']; wb = r['all_without_links_base']; wp = r['all_without_links_p']
print(f"| minimal pairs with no Wiktionary link | {w['n']} | {pc(w['gloss'])} | {pc(wb['gloss'])} | {pv(wp['gloss'])} | {pc(w['cos25'])} | {pc(wb['cos25'])} | {pv(wp['cos25'])} | {pc(w['pos'])} | {pc(wb['pos'])} | {pc(w['pxid'])} ({w['both_px_n']}) | – |")
print()
print('| opposition | pairs | share gloss stem | example pairs |')
print('|---|---|---|---|')
ex = collections.defaultdict(list)
for line in open(os.path.join(HERE, f'minpairs{suffix}.tsv')).read().splitlines()[1:]:
    f = line.split('\t')
    if len(ex[f[3]]) < 4:
        ex[f[3]].append(f[0] + '/' + f[1])
for cls, row in sorted(r['classes'].items(), key=lambda x: -x[1]['n']):
    print(f"| {cls} | {row['n']} | {pc(row['gloss'])} | {', '.join(ex[cls])} |")
