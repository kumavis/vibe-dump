// node:timers/promises
import { abortError } from '../internal/errors.js';
import { setImmediate as setImm, clearImmediate as clearImm } from '../internal/tick.js';

function delay(schedule, cancel, value, options = {}) {
  const { signal } = options || {};
  return new Promise((resolve, reject) => {
    if (signal?.aborted) return reject(abortError(signal));
    let onAbort;
    const handle = schedule(() => {
      if (signal) signal.removeEventListener('abort', onAbort);
      resolve(value);
    });
    if (signal) {
      onAbort = () => { cancel(handle); reject(abortError(signal)); };
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });
}

export function setTimeout(ms = 1, value, options) {
  return delay((fn) => globalThis.setTimeout(fn, ms), (h) => globalThis.clearTimeout(h), value, options);
}

export function setImmediate(value, options) {
  return delay((fn) => setImm(fn), (h) => clearImm(h), value, options);
}

export async function* setInterval(ms = 1, value, options = {}) {
  const { signal } = options;
  if (signal?.aborted) throw abortError(signal);
  let pending = 0;
  let wake = null;
  const id = globalThis.setInterval(() => { pending++; if (wake) { wake(); wake = null; } }, ms);
  const onAbort = () => { if (wake) { wake(); wake = null; } };
  signal?.addEventListener('abort', onAbort, { once: true });
  try {
    for (;;) {
      if (signal?.aborted) throw abortError(signal);
      if (pending === 0) await new Promise((r) => { wake = r; });
      if (signal?.aborted) throw abortError(signal);
      while (pending > 0) { pending--; yield value; }
    }
  } finally {
    globalThis.clearInterval(id);
    signal?.removeEventListener('abort', onAbort);
  }
}

export const scheduler = {
  wait: (ms, options) => setTimeout(ms, undefined, options),
  yield: () => setImmediate(),
};

export default { setTimeout, setImmediate, setInterval, scheduler };
