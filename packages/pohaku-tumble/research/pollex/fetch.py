"""Polite, cached fetcher for pollex.eva.mpg.de.

- One request at a time, >= MIN_INTERVAL seconds apart.
- Retries with exponential backoff on network errors / 5xx.
- Hard stop (BlockedError) on 403/407/429 or a bot-check page; never retried.
- Every successful response is cached under raw/cache/ so re-runs are free.
"""
import hashlib
import os
import sys
import time
import urllib.error
import urllib.request

UA = 'vibe-dump-research/1.0 (aaron@kumavis.me)'
MIN_INTERVAL = 1.2
HERE = os.path.dirname(os.path.abspath(__file__))
# Fetched pages and the built tables live outside git (POLLEX states no open licence):
# research/roots/.cache/pollex/, or $POLLEX_DATA.
DATA = os.environ.get('POLLEX_DATA') or os.path.join(HERE, '..', 'roots', '.cache', 'pollex')
CACHE = os.path.join(DATA, 'raw', 'cache')
os.makedirs(CACHE, exist_ok=True)
LOG = os.path.join(DATA, 'raw', 'fetch.log')

_last = [0.0]


class BlockedError(Exception):
    pass


class NotFound(Exception):
    pass


def _cache_path(url):
    h = hashlib.sha1(url.encode()).hexdigest()[:16]
    safe = url.split('://', 1)[-1].replace('/', '_').replace('?', '_').replace('=', '-')[:120]
    return os.path.join(CACHE, f'{safe}__{h}.html')


def _log(msg):
    with open(LOG, 'a', encoding='utf-8') as f:
        f.write(time.strftime('%Y-%m-%dT%H:%M:%S ') + msg + '\n')


def fetch(url, max_tries=5):
    p = _cache_path(url)
    if os.path.exists(p):
        with open(p, encoding='utf-8') as f:
            return f.read()
    delay = 2.0
    for attempt in range(1, max_tries + 1):
        wait = MIN_INTERVAL - (time.time() - _last[0])
        if wait > 0:
            time.sleep(wait)
        _last[0] = time.time()
        req = urllib.request.Request(url, headers={'User-Agent': UA, 'Accept': 'text/html'})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                body = r.read().decode('utf-8')
                code = r.status
        except urllib.error.HTTPError as e:
            code = e.code
            _log(f'{code} {url} (attempt {attempt})')
            if code in (403, 407, 429):
                raise BlockedError(f'HTTP {code} for {url}')
            if code == 404:
                raise NotFound(url)
            if 500 <= code < 600 and attempt < max_tries:
                time.sleep(delay)
                delay *= 2
                continue
            raise
        except (urllib.error.URLError, TimeoutError, ConnectionError, OSError) as e:
            _log(f'ERR {url} {e!r} (attempt {attempt})')
            if attempt < max_tries:
                time.sleep(delay)
                delay *= 2
                continue
            raise
        low = body[:5000].lower()
        if 'just a moment' in low or 'cf-challenge' in low or 'captcha' in low:
            _log(f'BOTCHECK {url}')
            raise BlockedError(f'bot check page for {url}')
        _log(f'{code} {url} {len(body)}B')
        with open(p, 'w', encoding='utf-8') as f:
            f.write(body)
        return body
    raise RuntimeError(f'gave up on {url}')


if __name__ == '__main__':
    for u in sys.argv[1:]:
        print(len(fetch(u)), u)
