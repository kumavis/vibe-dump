// Plain-language explanations for traps and load errors.

export const TRAP_EXPLAIN = {
  'unreachable': 'An `unreachable` instruction executed. Compilers emit it for code paths that must never run (a failed assertion, a missing match arm, a panic).',
  'integer-divide-by-zero': 'An integer division or remainder had a divisor of 0. Integer division by zero has no defined result, so wasm traps. (Float division by zero does not trap: it gives ±inf or NaN.)',
  'integer-overflow': 'The result does not fit the type: signed division of the minimum value by −1 (e.g. −2³¹ ÷ −1 = 2³¹, one more than the maximum i32).',
  'invalid-conversion': 'A float-to-integer truncation got NaN or a value outside the integer range. The `trunc_sat` variants clamp instead of trapping.',
  'out-of-bounds-memory': 'The access touched bytes past the end of linear memory. Every load and store checks address + offset + width against the current memory size.',
  'out-of-bounds-table': 'A table index (or a range of entries) was past the end of the table.',
  'undefined-element': '`call_indirect` was given an index at or beyond the table\'s size, so there is no entry to call.',
  'uninitialized-element': '`call_indirect` found a null entry at that table index: no function was stored there.',
  'indirect-call-type-mismatch': '`call_indirect` found a function, but its type differs from the type named by the instruction. The check is exact: same parameter and result types.',
  'call-stack-exhausted': 'Too many nested calls (or too many operand-stack values). Unbounded recursion is the usual cause.',
  'host-error': 'A host (JavaScript) function called through an import threw an exception.',
  'host-abort': 'The program called its abort import (e.g. a failed assertion in the source language).',
}

export const STAGE_TITLE = {
  assemble: 'The text does not assemble',
  decode: 'The binary could not be decoded',
  validate: 'Validation rejected the module',
  instantiate: 'Instantiation failed',
}

export const STAGE_EXPLAIN = {
  assemble: 'The assembler turns WAT text into the binary format. It stopped at the position shown.',
  decode: 'Decoding reads the binary format section by section. Nothing has run.',
  validate: 'Validation type-checks every function before anything runs: each instruction must find the operand types it needs on the static type stack, and each block must leave exactly its result types. A module that fails validation cannot be instantiated.',
  instantiate: 'The module is valid, but creating an instance failed while linking imports or applying segments.',
}
