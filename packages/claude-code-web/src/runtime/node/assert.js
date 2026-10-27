// node:assert — @jspm/core's port (callable default, strict, AssertionError).
import A from '../jspm/assert.js';

export const {
  AssertionError, deepEqual, deepStrictEqual, doesNotReject, doesNotThrow, equal, fail, ifError,
  notDeepEqual, notDeepStrictEqual, notEqual, notStrictEqual, ok, rejects, strict, strictEqual, throws,
} = A;
export const match = A.match || ((string, regexp, message) => {
  if (!regexp.test(string)) throw new AssertionError({ message: message || `The input did not match the regular expression ${regexp}. Input:\n\n'${string}'\n`, actual: string, expected: regexp, operator: 'match' });
});
export const doesNotMatch = A.doesNotMatch || ((string, regexp, message) => {
  if (regexp.test(string)) throw new AssertionError({ message: message || `The input was expected to not match the regular expression ${regexp}.`, actual: string, expected: regexp, operator: 'doesNotMatch' });
});
if (!A.match) A.match = match;
if (!A.doesNotMatch) A.doesNotMatch = doesNotMatch;
export default A;
