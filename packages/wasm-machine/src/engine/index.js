// Public entry point of the wasm-machine engine. Pure ES modules, no DOM.
export { decode, annotate, findInstrAt, funcName, instrText, WasmDecodeError, WasmFeatureError } from './decode.js'
export { validate, functionTypeStacks, WasmValidationError } from './validate.js'
export { assemble, wat2wasm, WatError } from './wat.js'
export { disassemble, disassembleFunction, linesToText } from './disasm.js'
export {
  instantiate, Machine, Trap, LinkError, ProcExit, Memory, Table, Global, FuncInst,
  hostFunction, TRAP_MESSAGES, PAGE_SIZE,
} from './machine.js'
export { createImports, WASI_ERRNO } from './hosts.js'
export { NaNBox, formatValue, valueHex, sameValue, f32Bits, f64Words } from './values.js'
export { OPS, OPS_BY_NAME } from './opcodes.js'

import { decode } from './decode.js'
import { validate } from './validate.js'
import { instantiate } from './machine.js'
import { createImports } from './hosts.js'

/**
 * Decode + validate arbitrary bytes, build default imports (WASI, env stubs…)
 * and instantiate. Returns { module, machine, host } where host is the
 * createImports() result (output, unresolved imports, stub call log).
 * A start-section function (if any) runs during instantiation unless
 * opts.machine.start is 'pending' (set up, ready to step) or 'skip'.
 */
export function load(bytes, opts = {}) {
  const module = decode(bytes)
  validate(module)
  const host = createImports(module, opts)
  const machine = instantiate(module, host.imports, { ...opts.machine })
  return { module, machine, host }
}

/**
 * Run a WASI command module (its `_start` export, else `main`) to completion.
 * Returns { exitCode, stdout, stderr, result, machine, host }.
 */
export function runWasi(bytes, opts = {}) {
  const { machine, host } = load(bytes, { ...opts, machine: { start: 'run', history: 0, ...opts.machine } })
  const entry = opts.entry || (machine.exports._start ? '_start' : 'main')
  machine.invoke(entry, opts.entryArgs || [])
  const result = machine.run({ maxSteps: opts.maxSteps, record: false })
  const exitCode = machine.status === 'exited' ? machine.exitCode : machine.status === 'done' ? 0 : null
  return { exitCode, stdout: host.output.stdout, stderr: host.output.stderr, result, machine, host }
}
