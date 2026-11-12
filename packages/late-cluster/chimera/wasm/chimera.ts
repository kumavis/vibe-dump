/**
 * The CHIMERA engine (Rust, compiled to wasm) on the main thread: one compiled module, shared
 * with the AudioWorklet (which instantiates its own copy), and a synchronous JSON call interface
 * for everything that is not real time (planning, G2P, geometry, catalogues).
 * `initChimera()` must resolve before anything calls into the engine (main.tsx awaits it).
 */
type Fn = (...a: number[]) => number;
export interface ChimeraExports {
  memory: WebAssembly.Memory;
  chimera_alloc: Fn;
  chimera_free: Fn;
  chimera_call: Fn;
  chimera_result_ptr: Fn;
  chimera_result_len: Fn;
  [name: string]: Fn | WebAssembly.Memory;
}

let module: WebAssembly.Module | null = null;
let exports: ChimeraExports | null = null;
let loading: Promise<void> | null = null;

/** Compile and instantiate the engine (once). `source`: the wasm bytes or a URL (default: the bundled build). */
export function initChimera(source?: BufferSource | string): Promise<void> {
  if (loading) return loading;
  loading = (async () => {
    let mod: WebAssembly.Module;
    if (source && typeof source !== "string") mod = await WebAssembly.compile(source);
    else {
      const url = source ?? (await import("./chimera.wasm?url")).default;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`engine: ${url}: HTTP ${res.status}`);
      mod = await WebAssembly.compile(await res.arrayBuffer());
    }
    if (WebAssembly.Module.imports(mod).length) throw new Error("engine: the wasm module must not have imports");
    exports = (await WebAssembly.instantiate(mod, {})).exports as unknown as ChimeraExports;
    module = mod;
  })();
  loading.catch(() => (loading = null)); // a failed load may be retried
  return loading;
}

export function chimeraReady(): boolean {
  return exports !== null;
}

/** The compiled module, for the AudioWorklet's own instance. */
export function chimeraModule(): WebAssembly.Module {
  if (!module) throw new Error("engine not loaded (await initChimera())");
  return module;
}

function x(): ChimeraExports {
  if (!exports) throw new Error("engine not loaded (await initChimera())");
  return exports;
}

const enc = new TextEncoder();
const dec = new TextDecoder();

/** Call the engine's JSON interface (crates/chimera-wasm/src/api.rs); throws on an engine error. */
export function call<T>(fn: string, args: Record<string, unknown> = {}): T {
  const e = x();
  const bytes = enc.encode(JSON.stringify({ fn, ...args }));
  const p = e.chimera_alloc(bytes.length);
  new Uint8Array(e.memory.buffer, p, bytes.length).set(bytes);
  const status = e.chimera_call(p, bytes.length);
  e.chimera_free(p, bytes.length);
  const out = dec.decode(new Uint8Array(e.memory.buffer, e.chimera_result_ptr(), e.chimera_result_len()));
  const v = JSON.parse(out);
  if (status !== 0) throw new Error(`engine ${fn}: ${v.error}`);
  return v as T;
}
