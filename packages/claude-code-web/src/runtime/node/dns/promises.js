// node:dns/promises
import { promises } from '../dns.js';

export const {
  lookup, lookupService, resolve, resolve4, resolve6, resolveAny, resolveCaa, resolveCname,
  resolveMx, resolveNaptr, resolveNs, resolvePtr, resolveSoa, resolveSrv, resolveTxt, reverse,
  getServers, setServers, setDefaultResultOrder, getDefaultResultOrder, Resolver,
} = promises;
export default promises;
