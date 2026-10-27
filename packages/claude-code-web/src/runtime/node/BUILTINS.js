// The module specifiers served from runtime/node/. Plain data with no imports
// so the service worker (and build scripts) can load it on its own.
//
// public/sw.js rewrites, when serving a chunk of the extracted tree:
//   "<name>" and "node:<name>"  ->  BASE + 'runtime/node/' + <name> + '.js'
// for every <name> in BUILTINS, and "<name>" -> the same path for NPM_SHIMS
// (bare npm specifiers the bundle imports or `import.meta.require`s and that
// Bun used to provide built in).

export const BUILTINS = [
  'assert',
  'assert/strict',
  'async_hooks',
  'buffer',
  'child_process',
  'console',
  'constants',
  'crypto',
  'diagnostics_channel',
  'dns',
  'dns/promises',
  'events',
  'fs',
  'fs/promises',
  'http',
  'http2',
  'https',
  'inspector',
  'inspector/promises',
  'module',
  'net',
  'os',
  'path',
  'path/posix',
  'path/win32',
  'perf_hooks',
  'process',
  'punycode',
  'querystring',
  'readline',
  'readline/promises',
  'stream',
  'stream/consumers',
  'stream/promises',
  'stream/web',
  'string_decoder',
  'timers',
  'timers/promises',
  'tls',
  'tty',
  'url',
  'util',
  'util/types',
  'v8',
  'vm',
  'worker_threads',
  'zlib',
];

export const NPM_SHIMS = ['ws', 'undici'];

// Every specifier -> file path relative to runtime/node/.
export const SPECIFIER_MAP = Object.fromEntries([
  ...BUILTINS.flatMap((name) => [[name, `${name}.js`], [`node:${name}`, `${name}.js`]]),
  ...NPM_SHIMS.map((name) => [name, `${name}.js`]),
]);

// 'node:fs' -> 'fs.js', 'ws' -> 'ws.js', anything else -> null.
export function shimFile(specifier) {
  return Object.prototype.hasOwnProperty.call(SPECIFIER_MAP, specifier) ? SPECIFIER_MAP[specifier] : null;
}

export default BUILTINS;
