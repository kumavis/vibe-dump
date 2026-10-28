// Registry of every shim, for boot.js: process.getBuiltinModule() (wired here
// automatically) and requireShim() for __bunRequire('fs')-style requires from
// the bundle's CJS code (`import.meta.require("util")` became
// `globalThis.__bunRequire("util")`). Importing this module loads every shim.
//
// Namespace imports keep this safe inside import cycles: nothing is read from
// a shim until getBuiltinModule() is called.
import { setBuiltinResolver } from './process.js';
import { BUILTINS, NPM_SHIMS } from './BUILTINS.js';
import * as m_assert from './assert.js';
import * as m_assert_strict from './assert/strict.js';
import * as m_async_hooks from './async_hooks.js';
import * as m_buffer from './buffer.js';
import * as m_child_process from './child_process.js';
import * as m_console from './console.js';
import * as m_constants from './constants.js';
import * as m_crypto from './crypto.js';
import * as m_diagnostics_channel from './diagnostics_channel.js';
import * as m_dns from './dns.js';
import * as m_dns_promises from './dns/promises.js';
import * as m_events from './events.js';
import * as m_fs from './fs.js';
import * as m_fs_promises from './fs/promises.js';
import * as m_http from './http.js';
import * as m_http2 from './http2.js';
import * as m_https from './https.js';
import * as m_inspector from './inspector.js';
import * as m_inspector_promises from './inspector/promises.js';
import * as m_module from './module.js';
import * as m_net from './net.js';
import * as m_os from './os.js';
import * as m_path from './path.js';
import * as m_path_posix from './path/posix.js';
import * as m_path_win32 from './path/win32.js';
import * as m_perf_hooks from './perf_hooks.js';
import * as m_process from './process.js';
import * as m_punycode from './punycode.js';
import * as m_querystring from './querystring.js';
import * as m_readline from './readline.js';
import * as m_readline_promises from './readline/promises.js';
import * as m_stream from './stream.js';
import * as m_stream_consumers from './stream/consumers.js';
import * as m_stream_promises from './stream/promises.js';
import * as m_stream_web from './stream/web.js';
import * as m_string_decoder from './string_decoder.js';
import * as m_timers from './timers.js';
import * as m_timers_promises from './timers/promises.js';
import * as m_tls from './tls.js';
import * as m_tty from './tty.js';
import * as m_url from './url.js';
import * as m_util from './util.js';
import * as m_util_types from './util/types.js';
import * as m_v8 from './v8.js';
import * as m_vm from './vm.js';
import * as m_worker_threads from './worker_threads.js';
import * as m_zlib from './zlib.js';
import * as m_ws from './ws.js';
import * as m_undici from './undici.js';

export const namespaces = {
  'assert': m_assert,
  'assert/strict': m_assert_strict,
  'async_hooks': m_async_hooks,
  'buffer': m_buffer,
  'child_process': m_child_process,
  'console': m_console,
  'constants': m_constants,
  'crypto': m_crypto,
  'diagnostics_channel': m_diagnostics_channel,
  'dns': m_dns,
  'dns/promises': m_dns_promises,
  'events': m_events,
  'fs': m_fs,
  'fs/promises': m_fs_promises,
  'http': m_http,
  'http2': m_http2,
  'https': m_https,
  'inspector': m_inspector,
  'inspector/promises': m_inspector_promises,
  'module': m_module,
  'net': m_net,
  'os': m_os,
  'path': m_path,
  'path/posix': m_path_posix,
  'path/win32': m_path_win32,
  'perf_hooks': m_perf_hooks,
  'process': m_process,
  'punycode': m_punycode,
  'querystring': m_querystring,
  'readline': m_readline,
  'readline/promises': m_readline_promises,
  'stream': m_stream,
  'stream/consumers': m_stream_consumers,
  'stream/promises': m_stream_promises,
  'stream/web': m_stream_web,
  'string_decoder': m_string_decoder,
  'timers': m_timers,
  'timers/promises': m_timers_promises,
  'tls': m_tls,
  'tty': m_tty,
  'url': m_url,
  'util': m_util,
  'util/types': m_util_types,
  'v8': m_v8,
  'vm': m_vm,
  'worker_threads': m_worker_threads,
  'zlib': m_zlib,
  'ws': m_ws,
  'undici': m_undici,
};

// CJS view: what require(id) returns under Node (the module object), for the
// Node built-ins only ('fs' or 'node:fs'), like process.getBuiltinModule().
export function getBuiltinModule(id) {
  const s = String(id);
  const name = s.startsWith('node:') ? s.slice(5) : s;
  if (!BUILTINS.includes(name)) return undefined;
  const ns = namespaces[name];
  return ns.default !== undefined ? ns.default : ns;
}

// For boot.js's __bunRequire: built-ins plus the npm names Bun provided
// (`ws`, `undici`), which the bundle's CJS code requires by bare name.
export function requireShim(id) {
  const s = String(id);
  if (NPM_SHIMS.includes(s)) return namespaces[s].default;
  return getBuiltinModule(s);
}

export function isShimmed(id) {
  const s = String(id);
  return s.startsWith('node:') ? BUILTINS.includes(s.slice(5)) : BUILTINS.includes(s) || NPM_SHIMS.includes(s);
}

setBuiltinResolver(getBuiltinModule);
