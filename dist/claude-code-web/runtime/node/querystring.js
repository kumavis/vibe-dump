// node:querystring — @jspm/core's port.
import Q from '../jspm/querystring.js';

export const { decode, encode, parse, stringify } = Q;
export const escape = Q.escape || ((s) => encodeURIComponent(s));
export const unescape = Q.unescape || ((s) => { try { return decodeURIComponent(s); } catch { return s; } });
export const unescapeBuffer = (s) => new TextEncoder().encode(unescape(String(s)));
export default { decode, encode, parse, stringify, escape, unescape, unescapeBuffer };
