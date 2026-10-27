// Optional helper for boot.js (not a Node built-in, not in BUILTINS): install
// the globals Claude Code expects from Node, in one call, before any chunk loads.
//
//   import { installNodeGlobals } from './node/globals.js'
//   const proc = installNodeGlobals(globalThis, { processOptions: { argv, env, cwd, onStdout, onStderr, onExit } })
//
// Sets process (createProcess + the shim registry as getBuiltinModule),
// Buffer, global, setImmediate/clearImmediate and, unless `timers: false`,
// Node-style setTimeout/setInterval (Timeout objects with unref()). It also
// routes Worker-level errors to process 'uncaughtException' /
// 'unhandledRejection' listeners, and swallows the ProcessExit that
// process.exit() throws to stop the caller.
import { Buffer } from './buffer.js';
import { createProcess, installProcess, ProcessExit } from './process.js';
import * as timers from './timers.js';
import { getBuiltinModule } from './index.js';

export function installNodeGlobals(target = globalThis, options = {}) {
  const { process: given, processOptions = {}, timers: replaceTimers = true, wireErrors = true } = options;
  const proc = given || createProcess({ getBuiltinModule, ...processOptions });
  installProcess(proc, target);
  target.Buffer = Buffer;
  target.global = target;
  target.setImmediate = timers.setImmediate;
  target.clearImmediate = timers.clearImmediate;
  if (replaceTimers) {
    target.setTimeout = timers.setTimeout;
    target.clearTimeout = timers.clearTimeout;
    target.setInterval = timers.setInterval;
    target.clearInterval = timers.clearInterval;
  }
  if (wireErrors && typeof target.addEventListener === 'function') {
    target.addEventListener('unhandledrejection', (ev) => {
      if (ev.reason instanceof ProcessExit) { ev.preventDefault(); return; }
      if (proc.listenerCount('unhandledRejection') > 0) {
        ev.preventDefault();
        proc.emit('unhandledRejection', ev.reason, ev.promise);
      }
    });
    target.addEventListener('error', (ev) => {
      if (ev.error instanceof ProcessExit) { ev.preventDefault(); return; }
      if (proc.listenerCount('uncaughtException') > 0) {
        ev.preventDefault();
        proc.emit('uncaughtException', ev.error ?? new Error(ev.message), 'uncaughtException');
      }
    });
  }
  return proc;
}

export { ProcessExit };
export default installNodeGlobals;
