"""Stage 1: crawl every page of the POLLEX Hawaiian language listing."""
import json
import os
import re
import sys

from fetch import fetch, BlockedError

BASE = 'https://pollex.eva.mpg.de'
HERE = os.path.dirname(os.path.abspath(__file__))
# Fetched pages and the built tables live outside git (POLLEX states no open licence):
# research/roots/.cache/pollex/, or $POLLEX_DATA.
DATA = os.environ.get('POLLEX_DATA') or os.path.join(HERE, '..', 'roots', '.cache', 'pollex')


def page_url(n):
    return f'{BASE}/language/hawaii/' + ('' if n == 1 else f'?page={n}')


def main():
    first = fetch(page_url(1))
    pages = [int(x) for x in re.findall(r'href="\?page=(\d+)"', first)]
    last = max(pages) if pages else 1
    count = re.search(r'<p class="count">\s*([\d,]+) entries found', first)
    print('pages:', last, 'declared entries:', count.group(1) if count else '?')
    done = []
    for n in range(1, last + 1):
        try:
            fetch(page_url(n))
        except BlockedError as e:
            print('BLOCKED:', e)
            sys.exit(2)
        done.append(n)
        print('page', n, 'ok', flush=True)
    json.dump({'last_page': last, 'declared': count.group(1) if count else None},
              open(os.path.join(DATA, 'raw', 'language_pages.json'), 'w'))


if __name__ == '__main__':
    main()
