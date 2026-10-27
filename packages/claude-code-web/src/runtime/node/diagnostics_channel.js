// node:diagnostics_channel — a working in-process pub/sub (cheap, and some
// libraries publish unconditionally).
const channels = new Map();

export class Channel {
  constructor(name) { this.name = name; this._subs = new Set(); this._stores = new Map(); }
  get hasSubscribers() { return this._subs.size > 0 || this._stores.size > 0; }
  subscribe(fn) { this._subs.add(fn); }
  unsubscribe(fn) { return this._subs.delete(fn); }
  publish(message) { for (const fn of [...this._subs]) { try { fn(message, this.name); } catch (err) { queueMicrotask(() => { throw err; }); } } }
  bindStore(store, transform) { this._stores.set(store, transform); }
  unbindStore(store) { return this._stores.delete(store); }
  runStores(data, fn, thisArg, ...args) {
    this.publish(data);
    let run = () => fn.apply(thisArg, args);
    for (const [store, transform] of this._stores) { const inner = run; run = () => store.run(transform ? transform(data) : data, inner); }
    return run();
  }
}

export function channel(name) {
  if (!channels.has(name)) channels.set(name, new Channel(name));
  return channels.get(name);
}
export const hasSubscribers = (name) => channels.get(name)?.hasSubscribers ?? false;
export const subscribe = (name, fn) => channel(name).subscribe(fn);
export const unsubscribe = (name, fn) => channel(name).unsubscribe(fn);

export function tracingChannel(nameOrChannels) {
  const names = ['start', 'end', 'asyncStart', 'asyncEnd', 'error'];
  const ch = typeof nameOrChannels === 'string'
    ? Object.fromEntries(names.map((n) => [n, channel(`tracing:${nameOrChannels}:${n}`)]))
    : nameOrChannels;
  return {
    ...ch,
    get hasSubscribers() { return names.some((n) => ch[n]?.hasSubscribers); },
    subscribe(handlers) { for (const n of names) if (handlers[n]) ch[n].subscribe(handlers[n]); },
    unsubscribe(handlers) { for (const n of names) if (handlers[n]) ch[n].unsubscribe(handlers[n]); return true; },
    traceSync(fn, context = {}, thisArg, ...args) {
      ch.start.publish(context);
      try { const r = fn.apply(thisArg, args); context.result = r; return r; } catch (e) { context.error = e; ch.error.publish(context); throw e; } finally { ch.end.publish(context); }
    },
    async tracePromise(fn, context = {}, thisArg, ...args) {
      ch.start.publish(context);
      try { const r = await fn.apply(thisArg, args); context.result = r; ch.asyncEnd.publish(context); return r; } catch (e) { context.error = e; ch.error.publish(context); throw e; } finally { ch.end.publish(context); }
    },
    traceCallback(fn, position, context, thisArg, ...args) { return fn.apply(thisArg, args); },
  };
}

export default { Channel, channel, hasSubscribers, subscribe, unsubscribe, tracingChannel };
