// node:dns — a page cannot resolve names (fetch does its own resolution).
// IP literals and localhost resolve; every other name fails with ENOTFOUND,
// which the bundle's SSRF guards treat as "could not resolve".
import { isIP } from './net.js';
import { systemError } from './internal/errors.js';

const LOCAL = new Set(['localhost', 'localhost.localdomain', 'ip6-localhost']);

function resolveLocal(hostname, family) {
  const fam = isIP(hostname);
  if (fam) return [{ address: hostname, family: fam }];
  if (LOCAL.has(String(hostname).toLowerCase()) || String(hostname).toLowerCase().endsWith('.localhost')) {
    const v4 = { address: '127.0.0.1', family: 4 };
    const v6 = { address: '::1', family: 6 };
    return family === 6 ? [v6] : family === 4 ? [v4] : [v4, v6];
  }
  return null;
}

function notFound(hostname, syscall = 'getaddrinfo') {
  return systemError('ENOTFOUND', syscall, { message: `${syscall} ENOTFOUND ${hostname}`, hostname, errno: -3008 });
}

function lookupSync(hostname, options) {
  const opts = typeof options === 'number' ? { family: options } : options || {};
  const family = opts.family === 'IPv4' ? 4 : opts.family === 'IPv6' ? 6 : opts.family || 0;
  const found = resolveLocal(hostname, family);
  if (!found) throw notFound(hostname);
  return opts.all ? found : found[0];
}

export function lookup(hostname, options, cb) {
  const callback = typeof options === 'function' ? options : cb;
  const opts = typeof options === 'function' ? {} : options;
  queueMicrotask(() => {
    let r;
    try { r = lookupSync(hostname, opts); } catch (err) { callback(err); return; }
    if (Array.isArray(r)) callback(null, r);
    else callback(null, r.address, r.family);
  });
  return {};
}

export function lookupService(address, port, cb) {
  queueMicrotask(() => cb(notFound(address, 'getnameinfo')));
}

const failing = (syscall) => function (hostname, ...rest) {
  const cb = rest.find((a) => typeof a === 'function');
  queueMicrotask(() => cb(systemError('ENOTFOUND', syscall, { message: `${syscall} ENOTFOUND ${hostname}`, hostname })));
  return {};
};
const rrtypes = ['resolve', 'resolve4', 'resolve6', 'resolveAny', 'resolveCaa', 'resolveCname', 'resolveMx', 'resolveNaptr', 'resolveNs', 'resolvePtr', 'resolveSoa', 'resolveSrv', 'resolveTxt', 'reverse'];
const query = Object.fromEntries(rrtypes.map((n) => [n, failing(n === 'reverse' ? 'getHostByAddr' : `query${n.replace('resolve', '') || 'A'}`)]));

export const {
  resolve, resolve4, resolve6, resolveAny, resolveCaa, resolveCname, resolveMx, resolveNaptr,
  resolveNs, resolvePtr, resolveSoa, resolveSrv, resolveTxt, reverse,
} = query;

let servers = ['127.0.0.53'];
export const getServers = () => [...servers];
export const setServers = (s) => { servers = [...s]; };
export const setDefaultResultOrder = () => {};
export const getDefaultResultOrder = () => 'verbatim';

export class Resolver {
  constructor() { this._servers = [...servers]; }
  cancel() {}
  getServers() { return [...this._servers]; }
  setServers(s) { this._servers = [...s]; }
  setLocalAddress() {}
}
Object.assign(Resolver.prototype, query);

export const ADDRCONFIG = 1024;
export const V4MAPPED = 2048;
export const ALL = 256;
export const NODATA = 'ENODATA', FORMERR = 'EFORMERR', SERVFAIL = 'ESERVFAIL', NOTFOUND = 'ENOTFOUND',
  NOTIMP = 'ENOTIMP', REFUSED = 'EREFUSED', BADQUERY = 'EBADQUERY', BADNAME = 'EBADNAME',
  BADFAMILY = 'EBADFAMILY', BADRESP = 'EBADRESP', CONNREFUSED = 'ECONNREFUSED', TIMEOUT = 'ETIMEOUT',
  EOF = 'EOF', FILE = 'EFILE', NOMEM = 'ENOMEM', DESTRUCTION = 'EDESTRUCTION', BADSTR = 'EBADSTR',
  BADFLAGS = 'EBADFLAGS', NONAME = 'ENONAME', BADHINTS = 'EBADHINTS', NOTINITIALIZED = 'ENOTINITIALIZED',
  LOADIPHLPAPI = 'ELOADIPHLPAPI', ADDRGETNETWORKPARAMS = 'EADDRGETNETWORKPARAMS', CANCELLED = 'ECANCELLED';

// dns.promises
const promisify = (fn) => (...args) => new Promise((res, rej) => fn(...args, (err, ...v) => (err ? rej(err) : res(v.length > 1 ? { address: v[0], family: v[1] } : v[0]))));
export const promises = {
  lookup: (hostname, options) => new Promise((res, rej) => { try { res(lookupSync(hostname, options)); } catch (e) { rej(e); } }),
  lookupService: promisify(lookupService),
  ...Object.fromEntries(rrtypes.map((n) => [n, promisify(query[n])])),
  getServers, setServers, setDefaultResultOrder, getDefaultResultOrder,
  Resolver: class extends Resolver {},
};
for (const n of rrtypes) promises.Resolver.prototype[n] = promises[n];

export default {
  lookup, lookupService, ...query, getServers, setServers, setDefaultResultOrder,
  getDefaultResultOrder, Resolver, promises, ADDRCONFIG, V4MAPPED, ALL, NODATA, FORMERR, SERVFAIL,
  NOTFOUND, NOTIMP, REFUSED, BADQUERY, BADNAME, BADFAMILY, BADRESP, CONNREFUSED, TIMEOUT, EOF, FILE,
  NOMEM, DESTRUCTION, BADSTR, BADFLAGS, NONAME, BADHINTS, NOTINITIALIZED, LOADIPHLPAPI,
  ADDRGETNETWORKPARAMS, CANCELLED,
};
