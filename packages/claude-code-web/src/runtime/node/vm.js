// node:vm — there is one realm. runInThisContext is an indirect eval;
// "contexts" are plain objects consulted first through a `with` scope, which
// is enough for template engines and expression evaluators but is no security
// boundary. SourceTextModule/SyntheticModule stay undefined, as in Node
// without --experimental-vm-modules.
const contexts = new WeakSet();

export function createContext(obj = {}) {
  if (obj && typeof obj === 'object') contexts.add(obj);
  return obj;
}
export function isContext(obj) { return obj !== null && typeof obj === 'object' && contexts.has(obj); }

const indirectEval = eval;
export function runInThisContext(code) { return indirectEval(String(code)); }

// Sloppy-mode function so `with` is allowed; the proxy makes the context win
// for names it has and swallows assignments to undeclared names.
const runWith = new Function('__ctx', '__code', 'with (__ctx) { return eval(__code); }');
export function runInContext(code, context) {
  const scope = new Proxy(context, {
    has: (t, k) => k !== '__code' && k !== '__ctx' && (k in t || !(k in globalThis)),
    get: (t, k) => (k === Symbol.unscopables ? undefined : k in t ? t[k] : globalThis[k]),
  });
  return runWith(scope, String(code));
}
export function runInNewContext(code, sandbox = {}) { return runInContext(code, createContext(sandbox)); }

export function compileFunction(code, params = []) {
  return new Function(...params, String(code));
}

export class Script {
  constructor(code, options = {}) {
    this._code = String(code);
    this._filename = typeof options === 'string' ? options : options.filename;
    this.cachedDataRejected = false;
  }
  runInThisContext() { return runInThisContext(this._code); }
  runInContext(context) { return runInContext(this._code, context); }
  runInNewContext(sandbox) { return runInNewContext(this._code, sandbox); }
  createCachedData() { return new Uint8Array(0); }
  get sourceMapURL() { return undefined; }
}

export const measureMemory = () => Promise.resolve({ total: { jsMemoryEstimate: 0, jsMemoryRange: [0, 0] } });
export const constants = { USE_MAIN_CONTEXT_DEFAULT_LOADER: Symbol('vm_dynamic_import_main_context_default'), DONT_CONTEXTIFY: Symbol('vm_context_no_contextify') };
export const SourceTextModule = undefined;
export const SyntheticModule = undefined;

export default {
  createContext, isContext, runInThisContext, runInContext, runInNewContext, compileFunction,
  Script, measureMemory, constants, SourceTextModule, SyntheticModule,
};
