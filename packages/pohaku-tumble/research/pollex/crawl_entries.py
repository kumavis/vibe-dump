"""Stage 2: fetch every protoform entry page referenced by a Hawaiian reflex,
plus every /source/ page cited for Hawaiian. Results are cached by fetch.py."""
import json
import os
import re
import sys

from fetch import fetch, BlockedError, NotFound

BASE = 'https://pollex.eva.mpg.de'
HERE = os.path.dirname(os.path.abspath(__file__))
# Fetched pages and the built tables live outside git (POLLEX states no open licence):
# research/roots/.cache/pollex/, or $POLLEX_DATA.
DATA = os.environ.get('POLLEX_DATA') or os.path.join(HERE, '..', 'roots', '.cache', 'pollex')
STATUS = os.path.join(DATA, 'raw', 'entries_status.json')


def main():
    rows = json.load(open(os.path.join(DATA, 'raw', 'haw_rows_raw.json')))
    hrefs = []
    for r in rows:
        h = r['proto_a']['href']
        if h not in hrefs:
            hrefs.append(h)
    srcs = []
    for r in rows:
        h = r['src']['href'] if r['src'] else None
        if h and h not in srcs:
            srcs.append(h)
    status = {'total': len(hrefs), 'ok': 0, 'not_found': [], 'extra_pages': {}, 'blocked': None}
    try:
        for h in srcs:
            fetch(BASE + h)
        for i, h in enumerate(hrefs, 1):
            url = BASE + h
            try:
                page = fetch(url)
            except NotFound:
                status['not_found'].append(h)
                continue
            m = re.search(r'<div class="pagination">(.*?)</div>', page, re.S)
            if m:
                pages = sorted({int(x) for x in re.findall(r'\?page=(\d+)', m.group(1))})
                status['extra_pages'][h] = pages
                for n in pages:
                    if n > 1:
                        fetch(f'{url}?page={n}')
            status['ok'] += 1
            if i % 50 == 0:
                print(f'{i}/{len(hrefs)}', flush=True)
                json.dump(status, open(STATUS, 'w'), indent=1)
    except BlockedError as e:
        status['blocked'] = str(e)
        print('BLOCKED:', e, flush=True)
    json.dump(status, open(STATUS, 'w'), indent=1)
    print('done', status['ok'], 'ok;', len(status['not_found']), 'not found;', 'blocked:', status['blocked'])


if __name__ == '__main__':
    main()
