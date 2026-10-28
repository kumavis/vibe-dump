// A compact util.inspect / util.format, close enough to Node's output for logs,
// error messages and debug strings (jspm's browserify util prints Maps as `{}`).
const customSymbol = Symbol.for('nodejs.util.inspect.custom');

const STYLES = {
  special: 36, number: 33, bigint: 33, boolean: 33, undefined: 90, null: 1,
  string: 32, symbol: 32, date: 35, regexp: 31, module: 4, name: null,
};

const defaultOptions = {
  showHidden: false, depth: 2, colors: false, customInspect: true, showProxy: false,
  maxArrayLength: 100, maxStringLength: 10000, breakLength: 80, compact: 3,
  sorted: false, getters: false, numericSeparator: false,
};

const identRe = /^[A-Za-z_$][\w$]*$/;
const tag = (v) => Object.prototype.toString.call(v);

function stylize(ctx, str, type) {
  const code = ctx.colors ? STYLES[type] : null;
  return code ? `\x1b[${code}m${str}\x1b[${code === 1 ? 22 : 39}m` : str;
}

function quote(s) {
  const q = !s.includes("'") ? "'" : !s.includes('"') ? '"' : !s.includes('`') ? '`' : "'";
  const esc = s.replace(/[\\\n\t\r\b\f\v\0]/g, (c) => ({ '\\': '\\\\', '\n': '\\n', '\t': '\\t', '\r': '\\r', '\b': '\\b', '\f': '\\f', '\v': '\\v', '\0': '\\0' })[c]);
  return q + (q === "'" ? esc.replace(/'/g, "\\'") : esc) + q;
}

function formatPrimitive(ctx, v) {
  switch (typeof v) {
    case 'string': {
      let s = v;
      let extra = '';
      if (s.length > ctx.maxStringLength) { extra = `... ${s.length - ctx.maxStringLength} more characters`; s = s.slice(0, ctx.maxStringLength); }
      return stylize(ctx, quote(s), 'string') + extra;
    }
    case 'number': return stylize(ctx, Object.is(v, -0) ? '-0' : String(v), 'number');
    case 'bigint': return stylize(ctx, `${v}n`, 'bigint');
    case 'boolean': return stylize(ctx, String(v), 'boolean');
    case 'undefined': return stylize(ctx, 'undefined', 'undefined');
    case 'symbol': return stylize(ctx, v.toString(), 'symbol');
    default: return stylize(ctx, 'null', 'null');
  }
}

function ctorName(obj) {
  let proto = Object.getPrototypeOf(obj);
  if (proto === null) return null;
  while (proto) {
    const d = Object.getOwnPropertyDescriptor(proto, 'constructor');
    if (d && typeof d.value === 'function' && d.value.name) return d.value.name;
    proto = Object.getPrototypeOf(proto);
  }
  return '';
}

function formatKey(ctx, key) {
  if (typeof key === 'symbol') return `[${stylize(ctx, key.toString(), 'symbol')}]`;
  return identRe.test(key) ? key : stylize(ctx, quote(key), 'string');
}

function reduceToSingleString(ctx, entries, open, close, indent) {
  if (entries.length === 0) return `${open}${close}`;
  const oneLine = `${open} ${entries.join(', ')} ${close}`;
  if (ctx.compact !== false && oneLine.length + indent <= ctx.breakLength && !oneLine.includes('\n')) return oneLine;
  const pad = ' '.repeat(indent + 2);
  return `${open}\n${pad}${entries.join(`,\n${pad}`)}\n${' '.repeat(indent)}${close}`;
}

function formatError(err) {
  const stack = typeof err.stack === 'string' && err.stack ? err.stack : `${err.name || 'Error'}: ${err.message}`;
  return stack.includes(String(err.message)) || !err.message ? stack : `${err.name}: ${err.message}\n${stack}`;
}

function formatValue(ctx, value, depth, indent) {
  if (value === null || (typeof value !== 'object' && typeof value !== 'function')) return formatPrimitive(ctx, value);

  if (ctx.customInspect) {
    const custom = value[customSymbol];
    if (typeof custom === 'function' && custom !== inspect) {
      const out = custom.call(value, ctx.depth - depth, { ...ctx, stylize: (s, t) => stylize(ctx, s, t) }, inspect);
      if (out !== value) return typeof out === 'string' ? out : formatValue(ctx, out, depth, indent);
    }
  }

  if (ctx.seen.includes(value)) return stylize(ctx, '[Circular *1]', 'special');

  const name = ctorName(value);
  const keys = Object.keys(value);
  if (ctx.showHidden) for (const s of Object.getOwnPropertySymbols(value)) keys.push(s);
  else for (const s of Object.getOwnPropertySymbols(value)) if (Object.getOwnPropertyDescriptor(value, s)?.enumerable) keys.push(s);
  if (ctx.sorted) keys.sort();

  let open = '{';
  let close = '}';
  let prefix = '';
  let base = '';
  let items = null; // pre-formatted entries (arrays, maps, sets)
  let skipIndexKeys = false;

  if (typeof value === 'function') {
    const src = Function.prototype.toString.call(value);
    const kind = src.startsWith('class') ? 'class' : tag(value).slice(8, -1);
    base = kind === 'class' ? `[class ${value.name || '(anonymous)'}]` : `[${kind}${value.name ? `: ${value.name}` : ' (anonymous)'}]`;
    base = stylize(ctx, base, 'special');
    if (keys.length === 0) return base;
  } else if (value instanceof Error || tag(value) === '[object Error]') {
    base = formatError(value);
    const own = keys.filter((k) => k !== 'stack' && k !== 'message');
    if (own.length === 0) return base;
    keys.length = 0; keys.push(...own);
  } else if (value instanceof Date) {
    base = stylize(ctx, Number.isNaN(value.getTime()) ? 'Invalid Date' : value.toISOString(), 'date');
    if (keys.length === 0) return base;
  } else if (value instanceof RegExp) {
    base = stylize(ctx, RegExp.prototype.toString.call(value), 'regexp');
    if (keys.length === 0) return base;
  } else if (tag(value) === '[object Module]') {
    prefix = '[Module: null prototype] ';
  } else if (tag(value) === '[object Promise]') {
    return `Promise { ${stylize(ctx, '<unknown>', 'special')} }`;
  } else if (value instanceof WeakMap || value instanceof WeakSet) {
    return `${name} { ${stylize(ctx, '<items unknown>', 'special')} }`;
  }

  if (depth > ctx.depth && ctx.depth !== null && ctx.depth !== Infinity) {
    return stylize(ctx, `[${Array.isArray(value) ? 'Array' : name || 'Object'}]`, 'special');
  }

  ctx.seen.push(value);
  try {
    const sub = (v) => formatValue(ctx, v, depth + 1, indent + 2);
    if (Array.isArray(value)) {
      skipIndexKeys = true;
      open = '['; close = ']';
      if (name !== 'Array') prefix = `${name}(${value.length}) `;
      items = [];
      const n = Math.min(value.length, ctx.maxArrayLength);
      for (let i = 0; i < n; i++) items.push(Object.prototype.hasOwnProperty.call(value, i) ? sub(value[i]) : stylize(ctx, '<1 empty item>', 'undefined'));
      if (value.length > n) items.push(`... ${value.length - n} more item${value.length - n > 1 ? 's' : ''}`);
    } else if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
      skipIndexKeys = true;
      const isBuf = value._isBuffer === true;
      open = isBuf ? '<' : '['; close = isBuf ? '>' : ']';
      prefix = isBuf ? 'Buffer ' : `${name}(${value.length}) `;
      const n = Math.min(value.length, isBuf ? 50 : ctx.maxArrayLength);
      items = [];
      for (let i = 0; i < n; i++) items.push(isBuf ? value[i].toString(16).padStart(2, '0') : formatPrimitive(ctx, value[i]));
      if (value.length > n) items.push(`... ${value.length - n} more ${isBuf ? 'bytes' : 'items'}`);
      if (isBuf) return `<Buffer${items.length ? ' ' + items.join(' ') : ''}>`;
    } else if (value instanceof Map) {
      prefix = `${name}(${value.size}) `;
      items = [];
      for (const [k, v] of value) items.push(`${sub(k)} => ${sub(v)}`);
    } else if (value instanceof Set) {
      prefix = `${name}(${value.size}) `;
      items = [];
      for (const v of value) items.push(sub(v));
    } else if (value instanceof ArrayBuffer) {
      prefix = 'ArrayBuffer ';
      items = [`[Uint8Contents]: <${[...new Uint8Array(value.slice(0, 50))].map((b) => b.toString(16).padStart(2, '0')).join(' ')}>`, `byteLength: ${formatPrimitive(ctx, value.byteLength)}`];
    } else if (!prefix && !base) {
      if (name === null) prefix = '[Object: null prototype] ';
      else if (name && name !== 'Object') prefix = `${name} `;
      const t = value[Symbol.toStringTag];
      if (typeof t === 'string' && t && t !== name) prefix = `${prefix.trim() || 'Object'} [${t}] `;
    }

    const entries = items ? [...items] : [];
    for (const key of keys) {
      if (skipIndexKeys && typeof key === 'string' && /^\d+$/.test(key)) continue;
      const desc = Object.getOwnPropertyDescriptor(value, key);
      let v;
      if (desc && (desc.get || desc.set) && !('value' in desc)) {
        v = stylize(ctx, desc.get ? (desc.set ? '[Getter/Setter]' : '[Getter]') : '[Setter]', 'special');
      } else {
        v = sub(desc ? desc.value : value[key]);
      }
      entries.push(`${formatKey(ctx, key)}: ${v}`);
    }
    if (base) {
      if (entries.length === 0) return base;
      return `${base} ${reduceToSingleString(ctx, entries, '{', '}', indent)}`;
    }
    return prefix + reduceToSingleString(ctx, entries, open, close, indent);
  } finally {
    ctx.seen.pop();
  }
}

export function inspect(value, opts, ...legacy) {
  let options = opts;
  if (typeof opts === 'boolean') options = { showHidden: opts, depth: legacy[0], colors: legacy[1] };
  const ctx = { ...defaultOptions, ...inspect.defaultOptions, ...(options || {}), seen: [] };
  if (ctx.depth === null) ctx.depth = Infinity;
  if (ctx.depth === undefined) ctx.depth = 2;
  return formatValue(ctx, value, 0, 0);
}
inspect.custom = customSymbol;
inspect.defaultOptions = { ...defaultOptions };
inspect.colors = { bold: [1, 22], italic: [3, 23], underline: [4, 24], inverse: [7, 27], white: [37, 39], grey: [90, 39], black: [30, 39], blue: [34, 39], cyan: [36, 39], green: [32, 39], magenta: [35, 39], red: [31, 39], yellow: [33, 39] };
inspect.styles = { ...STYLES };

function formatArg(a, opts) {
  return typeof a === 'string' ? a : inspect(a, { ...opts, compact: 3 });
}

export function formatWithOptions(opts, fmt, ...args) {
  if (typeof fmt !== 'string') return [fmt, ...args].map((a) => formatArg(a, opts)).join(' ');
  let i = 0;
  let out = fmt.replace(/%([sdifjoOc%])/g, (m, f) => {
    if (f === '%') return '%';
    if (i >= args.length) return m;
    const a = args[i++];
    switch (f) {
      case 's':
        if (typeof a === 'bigint') return `${a}n`;
        if (typeof a === 'symbol') return a.toString();
        if (a !== null && typeof a === 'object') {
          const hasOwnToString = a.toString !== Object.prototype.toString && a.toString !== Array.prototype.toString && !(a instanceof Error);
          return hasOwnToString ? String(a) : inspect(a, { ...opts, depth: 0 });
        }
        return Object.is(a, -0) ? '-0' : String(a);
      case 'd': return typeof a === 'bigint' ? `${a}n` : typeof a === 'symbol' ? 'NaN' : formatPrimitive({ colors: false }, Number(a));
      case 'i': return typeof a === 'bigint' ? `${a}n` : typeof a === 'symbol' ? 'NaN' : String(parseInt(a, 10));
      case 'f': return typeof a === 'symbol' ? 'NaN' : String(parseFloat(a));
      case 'j': try { return JSON.stringify(a); } catch { return '[Circular]'; }
      case 'o': return inspect(a, { ...opts, showHidden: true, depth: 4 });
      case 'O': return inspect(a, opts);
      case 'c': return '';
      default: return m;
    }
  });
  for (; i < args.length; i++) out += ' ' + formatArg(args[i], opts);
  return out;
}

export function format(fmt, ...args) {
  return formatWithOptions({}, fmt, ...args);
}
