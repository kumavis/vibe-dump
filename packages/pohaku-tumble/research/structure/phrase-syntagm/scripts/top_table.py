"""Markdown table: strongest DET-frame collocations (stable, ranked by G2) for the
requested heads; columns f / df / PMI / G2 / dictionary attestation / solid spelling count."""
import csv, os
HERE = os.path.dirname(os.path.abspath(__file__))
rows = list(csv.DictReader(open(os.path.join(HERE, '..', 'tables', 'colloc_all.tsv')), delimiter='\t'))
H = 'hale wai lau kumu hua ala mea kanaka wahi lā pō'.split()
out = ['| head | top modifiers by G² (f, df, PMI, G², attestation; solid=n when also written as one word) |', '|---|---|']
for h in H:
    rs = [r for r in rows if r['head'] == h and int(r['f']) >= 2 and int(r['df']) >= 2 and r['gram'] == 'False'
          and not int(r['cap']) * 2 > int(r['f'])]
    rs.sort(key=lambda r: -float(r['G2']))
    cells = []
    for r in rs[:8]:
        a = r['attest'] or '–'
        s = f"; solid={r['solid_in_corpus']}" if r['solid_in_corpus'] != '0' else ''
        cells.append(f"{h} {r['mod']} ({r['f']}, {r['df']}, {r['pmi']}, {r['G2']}, {a}{s})")
    out.append(f"| {h} | {'; '.join(cells) if cells else '(no pair with f≥2 in ≥2 pages)'} |")
open(os.path.join(HERE, '..', 'tables', 'top_collocations.md'), 'w').write('\n'.join(out) + '\n')
print('\n'.join(out))
