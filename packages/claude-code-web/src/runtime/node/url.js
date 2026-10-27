// node:url — WHATWG URL from the browser, legacy parse/format/resolve from
// @jspm/core, and our own fileURLToPath/pathToFileURL (jspm's reference `Deno`,
// report B §6b).
import ju from '../jspm/url.js';
import { nodeError } from './internal/errors.js';

export const URL = globalThis.URL;
export const URLSearchParams = globalThis.URLSearchParams;
export const Url = ju.Url;
export const parse = ju.parse;
export const resolve = ju.resolve;
export const resolveObject = ju.resolveObject;

export function format(urlObject, options) {
  if (urlObject instanceof URL) {
    if (!options) return urlObject.href;
    const u = new URL(urlObject.href);
    if (options.auth === false) { u.username = ''; u.password = ''; }
    if (options.fragment === false) u.hash = '';
    if (options.search === false) u.search = '';
    return u.href;
  }
  return ju.format(urlObject);
}

// Modules here load from same-origin http(s) URLs whose pathname is also their
// path in the VFS (BASE/vfs/app/chunk-x.js), so `fileURLToPath(import.meta.url)`
// — a file: URL under Bun or Node — maps such a URL to that pathname.
const ownOrigin = () => { try { return globalThis.location?.origin ?? null; } catch { return null; } };

export function fileURLToPath(input) {
  const u = typeof input === 'string' ? new URL(input) : input;
  if (!u || typeof u.protocol !== 'string') throw nodeError('ERR_INVALID_ARG_TYPE', 'The "path" argument must be of type string or an instance of URL', TypeError);
  if ((u.protocol === 'http:' || u.protocol === 'https:') && u.origin === ownOrigin()) return decodeURIComponent(u.pathname);
  if (u.protocol !== 'file:') throw nodeError('ERR_INVALID_URL_SCHEME', 'The URL must be of scheme file', TypeError);
  if (u.hostname !== '' && u.hostname !== 'localhost') throw nodeError('ERR_INVALID_FILE_URL_HOST', `File URL host must be "localhost" or empty on linux`, TypeError);
  const p = u.pathname;
  if (/%2f/i.test(p)) throw nodeError('ERR_INVALID_FILE_URL_PATH', 'File URL path must not include encoded / characters', TypeError);
  return decodeURIComponent(p);
}

export function pathToFileURL(path) {
  let resolved = String(path);
  if (!resolved.startsWith('/')) {
    const cwd = globalThis.process?.cwd?.() || '/';
    resolved = `${cwd.replace(/\/$/, '')}/${resolved}`;
  }
  // Keep a trailing slash, percent-encode what URL would otherwise interpret.
  const encoded = resolved.replace(/%/g, '%25').replace(/\\/g, '%5C').replace(/\n/g, '%0A')
    .replace(/\r/g, '%0D').replace(/\t/g, '%09').replace(/#/g, '%23').replace(/\?/g, '%3F');
  return new URL(`file://${encoded}`);
}

export function domainToASCII(domain) {
  try { return new URL(`http://${domain}`).hostname; } catch { return ''; }
}

export function domainToUnicode(domain) {
  try {
    return String(domain).split('.').map((label) => (label.startsWith('xn--') ? decodePunycode(label.slice(4)) : label)).join('.');
  } catch { return ''; }
}

// RFC 3492 decoder (only used by domainToUnicode).
function decodePunycode(input) {
  const base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700;
  let n = 128, i = 0, bias = 72;
  const out = [];
  let b = input.lastIndexOf('-');
  if (b < 0) b = 0;
  for (let j = 0; j < b; j++) out.push(input.charCodeAt(j));
  const adapt = (delta, numPoints, first) => {
    let k = 0;
    delta = first ? Math.floor(delta / damp) : delta >> 1;
    delta += Math.floor(delta / numPoints);
    for (; delta > ((base - tMin) * tMax) >> 1; k += base) delta = Math.floor(delta / (base - tMin));
    return Math.floor(k + ((base - tMin + 1) * delta) / (delta + skew));
  };
  for (let idx = b > 0 ? b + 1 : 0; idx < input.length;) {
    const oldi = i;
    for (let w = 1, k = base; ; k += base) {
      const c = input.charCodeAt(idx++);
      const digit = c - 48 < 10 ? c - 22 : c - 65 < 26 ? c - 65 : c - 97 < 26 ? c - 97 : base;
      i += digit * w;
      const t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
      if (digit < t) break;
      w *= base - t;
    }
    bias = adapt(i - oldi, out.length + 1, oldi === 0);
    n += Math.floor(i / (out.length + 1));
    i %= out.length + 1;
    out.splice(i++, 0, n);
  }
  return String.fromCodePoint(...out);
}

export function urlToHttpOptions(url) {
  const options = {
    protocol: url.protocol,
    hostname: url.hostname.startsWith('[') ? url.hostname.slice(1, -1) : url.hostname,
    hash: url.hash,
    search: url.search,
    pathname: url.pathname,
    path: `${url.pathname || ''}${url.search || ''}`,
    href: url.href,
  };
  if (url.port !== '') options.port = Number(url.port);
  if (url.username || url.password) options.auth = `${decodeURIComponent(url.username)}:${decodeURIComponent(url.password)}`;
  return options;
}

const url = {
  URL, URLSearchParams, Url, parse, resolve, resolveObject, format, fileURLToPath,
  pathToFileURL, domainToASCII, domainToUnicode, urlToHttpOptions,
};
export default url;
