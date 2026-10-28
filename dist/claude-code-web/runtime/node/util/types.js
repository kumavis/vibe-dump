// node:util/types — brand checks via Object.prototype.toString, which is the
// closest a userland implementation gets to V8's internal slot checks.
const tag = (v) => Object.prototype.toString.call(v);
const typed = /^\[object (?:Int8|Uint8|Uint8Clamped|Int16|Uint16|Int32|Uint32|Float16|Float32|Float64|BigInt64|BigUint64)Array\]$/;
const boxed = (name) => (v) => typeof v === 'object' && v !== null && tag(v) === `[object ${name}]`;

export const isArrayBuffer = (v) => tag(v) === '[object ArrayBuffer]';
export const isSharedArrayBuffer = (v) => tag(v) === '[object SharedArrayBuffer]';
export const isAnyArrayBuffer = (v) => isArrayBuffer(v) || isSharedArrayBuffer(v);
export const isArrayBufferView = (v) => ArrayBuffer.isView(v);
export const isTypedArray = (v) => ArrayBuffer.isView(v) && typed.test(tag(v));
export const isUint8Array = (v) => tag(v) === '[object Uint8Array]';
export const isUint8ClampedArray = (v) => tag(v) === '[object Uint8ClampedArray]';
export const isUint16Array = (v) => tag(v) === '[object Uint16Array]';
export const isUint32Array = (v) => tag(v) === '[object Uint32Array]';
export const isInt8Array = (v) => tag(v) === '[object Int8Array]';
export const isInt16Array = (v) => tag(v) === '[object Int16Array]';
export const isInt32Array = (v) => tag(v) === '[object Int32Array]';
export const isFloat16Array = (v) => tag(v) === '[object Float16Array]';
export const isFloat32Array = (v) => tag(v) === '[object Float32Array]';
export const isFloat64Array = (v) => tag(v) === '[object Float64Array]';
export const isBigInt64Array = (v) => tag(v) === '[object BigInt64Array]';
export const isBigUint64Array = (v) => tag(v) === '[object BigUint64Array]';
export const isDataView = (v) => tag(v) === '[object DataView]';
export const isDate = (v) => v instanceof Date || tag(v) === '[object Date]';
export const isRegExp = (v) => v instanceof RegExp || tag(v) === '[object RegExp]';
export const isMap = (v) => v instanceof Map || tag(v) === '[object Map]';
export const isSet = (v) => v instanceof Set || tag(v) === '[object Set]';
export const isWeakMap = (v) => v instanceof WeakMap;
export const isWeakSet = (v) => v instanceof WeakSet;
export const isMapIterator = (v) => tag(v) === '[object Map Iterator]';
export const isSetIterator = (v) => tag(v) === '[object Set Iterator]';
export const isPromise = (v) => v instanceof Promise || tag(v) === '[object Promise]';
export const isNativeError = (v) => v instanceof Error || tag(v) === '[object Error]';
export const isGeneratorObject = (v) => tag(v) === '[object Generator]';
export const isGeneratorFunction = (v) => typeof v === 'function' && /^\[object (Async)?GeneratorFunction\]$/.test(tag(v));
export const isAsyncFunction = (v) => typeof v === 'function' && /^\[object Async(Generator)?Function\]$/.test(tag(v));
export const isArgumentsObject = (v) => tag(v) === '[object Arguments]';
export const isModuleNamespaceObject = (v) => tag(v) === '[object Module]';
export const isBooleanObject = boxed('Boolean');
export const isNumberObject = boxed('Number');
export const isStringObject = boxed('String');
export const isSymbolObject = boxed('Symbol');
export const isBigIntObject = boxed('BigInt');
export const isBoxedPrimitive = (v) => isBooleanObject(v) || isNumberObject(v) || isStringObject(v) || isSymbolObject(v) || isBigIntObject(v);
export const isWeakRef = (v) => typeof WeakRef === 'function' && v instanceof WeakRef;
export const isProxy = () => false; // not observable from JS
export const isExternal = () => false;
export const isKeyObject = (v) => !!v && v.constructor?.name === 'KeyObject';
export const isCryptoKey = (v) => typeof CryptoKey === 'function' && v instanceof CryptoKey;

const types = {
  isArrayBuffer, isSharedArrayBuffer, isAnyArrayBuffer, isArrayBufferView, isTypedArray,
  isUint8Array, isUint8ClampedArray, isUint16Array, isUint32Array, isInt8Array, isInt16Array,
  isInt32Array, isFloat16Array, isFloat32Array, isFloat64Array, isBigInt64Array, isBigUint64Array,
  isDataView, isDate, isRegExp, isMap, isSet, isWeakMap, isWeakSet, isMapIterator, isSetIterator,
  isPromise, isNativeError, isGeneratorObject, isGeneratorFunction, isAsyncFunction,
  isArgumentsObject, isModuleNamespaceObject, isBooleanObject, isNumberObject, isStringObject,
  isSymbolObject, isBigIntObject, isBoxedPrimitive, isWeakRef, isProxy, isExternal, isKeyObject,
  isCryptoKey,
};
export default types;
