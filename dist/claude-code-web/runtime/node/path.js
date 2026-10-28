// node:path — POSIX functions from @jspm/core (a port of Node's own), with
// resolve()/relative() rebased on the runtime's process.cwd() (jspm's shim
// process always answers '/'), plus a small win32 implementation because
// jspm's path.win32 is null and path/win32 throws on every call.
import jp from '../jspm/path.js';

const cwd = () => {
  try { return globalThis.process?.cwd?.() || '/'; } catch { return '/'; }
};

function makePosix() {
  const p = {
    sep: '/',
    delimiter: ':',
    basename: jp.basename,
    dirname: jp.dirname,
    extname: jp.extname,
    format: jp.format,
    isAbsolute: jp.isAbsolute,
    join: jp.join,
    normalize: jp.normalize,
    parse: jp.parse,
    resolve: (...args) => jp.resolve(cwd(), ...args),
    relative: (from, to) => jp.relative(p.resolve(from), p.resolve(to)),
    toNamespacedPath: (s) => s,
    _makeLong: (s) => s,
    matchesGlob: (path, pattern) => globToRegExp(pattern).test(path),
  };
  return p;
}

// Minimal glob used only by path.matchesGlob (Node >= 22.5).
function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') { re += '.*'; i++; if (glob[i + 1] === '/') i++; }
      else re += '[^/]*';
    } else if (c === '?') re += '[^/]';
    else re += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  }
  return new RegExp(`^${re}$`);
}

// --- win32 ---------------------------------------------------------------
// Good enough for the bundle's uses (basename/isAbsolute/join on paths that
// might carry backslashes); not a full port of Node's win32 module.
function makeWin32() {
  const isSep = (c) => c === '\\' || c === '/';
  const splitRoot = (s) => {
    const m = /^([a-zA-Z]:)?([\\/]{0,2})/.exec(s);
    let device = m[1] || '';
    let root = m[2] ? '\\' : '';
    let rest = s.slice(m[0].length);
    if (!device && (m[2] === '\\\\' || m[2] === '//')) {
      // UNC: \\server\share
      const parts = rest.split(/[\\/]+/);
      if (parts.length >= 2 && parts[0] && parts[1]) {
        device = `\\\\${parts[0]}\\${parts[1]}`;
        rest = parts.slice(2).join('\\');
        root = '\\';
      }
    }
    return { device, root, rest };
  };
  const normParts = (rest, absolute) => {
    const out = [];
    for (const seg of rest.split(/[\\/]+/)) {
      if (!seg || seg === '.') continue;
      if (seg === '..') { if (out.length && out[out.length - 1] !== '..') out.pop(); else if (!absolute) out.push('..'); }
      else out.push(seg);
    }
    return out;
  };
  const w = {
    sep: '\\',
    delimiter: ';',
    isAbsolute: (s) => /^[a-zA-Z]:[\\/]/.test(s) || (s.length > 0 && isSep(s[0])),
    normalize(s) {
      if (!s) return '.';
      const { device, root, rest } = splitRoot(s);
      const parts = normParts(rest, !!root);
      let out = device + root + parts.join('\\');
      if (!parts.length && !root) out = device || '.';
      if (isSep(s[s.length - 1]) && parts.length) out += '\\';
      return out;
    },
    join: (...args) => {
      const joined = args.filter((a) => a !== '').join('\\');
      return joined ? w.normalize(joined) : '.';
    },
    resolve(...args) {
      let resolved = '';
      for (let i = args.length - 1; i >= 0 && !w.isAbsolute(resolved); i--) {
        if (args[i]) resolved = resolved ? `${args[i]}\\${resolved}` : args[i];
      }
      if (!w.isAbsolute(resolved)) resolved = `C:\\${resolved}`;
      const { device, rest } = splitRoot(resolved);
      return `${device || 'C:'}\\${normParts(rest, true).join('\\')}`;
    },
    relative(from, to) {
      const a = w.resolve(from).split('\\');
      const b = w.resolve(to).split('\\');
      if (a[0].toLowerCase() !== b[0].toLowerCase()) return w.resolve(to);
      let i = 0;
      while (i < a.length && i < b.length && a[i].toLowerCase() === b[i].toLowerCase()) i++;
      return [...a.slice(i).filter(Boolean).map(() => '..'), ...b.slice(i)].filter(Boolean).join('\\');
    },
    dirname(s) {
      const { device, root, rest } = splitRoot(s);
      const parts = rest.split(/[\\/]+/).filter(Boolean);
      parts.pop();
      if (!parts.length) return device + root || '.';
      return device + root + parts.join('\\');
    },
    basename(s, ext) {
      const { rest } = splitRoot(s);
      const parts = rest.split(/[\\/]+/).filter(Boolean);
      let b = parts.length ? parts[parts.length - 1] : '';
      if (ext && b.endsWith(ext) && b !== ext) b = b.slice(0, -ext.length);
      return b;
    },
    extname(s) {
      const b = w.basename(s);
      const i = b.lastIndexOf('.');
      return i > 0 ? b.slice(i) : '';
    },
    parse(s) {
      const { device, root } = splitRoot(s);
      const base = w.basename(s);
      const ext = w.extname(s);
      const dir = w.dirname(s);
      return { root: device + root, dir: dir === '.' && !s.match(/[\\/]/) ? '' : dir, base, ext, name: ext ? base.slice(0, -ext.length) : base };
    },
    format: (o) => {
      const dir = o.dir || o.root || '';
      const base = o.base || `${o.name || ''}${o.ext || ''}`;
      return dir ? (dir === o.root ? dir + base : `${dir}\\${base}`) : base;
    },
    toNamespacedPath: (s) => s,
    _makeLong: (s) => s,
    matchesGlob: (path, pattern) => globToRegExp(pattern.replace(/\\/g, '/')).test(path.replace(/\\/g, '/')),
  };
  return w;
}

export const posix = makePosix();
export const win32 = makeWin32();
posix.posix = posix; posix.win32 = win32;
win32.posix = posix; win32.win32 = win32;

export const {
  sep, delimiter, basename, dirname, extname, format, isAbsolute, join, normalize, parse,
  resolve, relative, toNamespacedPath, matchesGlob, _makeLong,
} = posix;

export default posix;
