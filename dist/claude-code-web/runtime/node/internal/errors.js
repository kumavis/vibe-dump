// Node-style error helpers shared by the shims.
//
// Node errors carry `code` (string), `errno` (negative number), `syscall` and
// often `path`; callers in the bundle branch on `err.code === 'ENOENT'` etc.,
// so every shim builds its errors here to keep the shape consistent.

export const ERRNO = {
  E2BIG: -7, EACCES: -13, EADDRINUSE: -98, EADDRNOTAVAIL: -99, EAGAIN: -11,
  EBADF: -9, EBUSY: -16, ECANCELED: -125, ECONNABORTED: -103, ECONNREFUSED: -111,
  ECONNRESET: -104, EEXIST: -17, EHOSTUNREACH: -113, EINVAL: -22, EIO: -5,
  EISDIR: -21, ELOOP: -40, EMFILE: -24, ENAMETOOLONG: -36, ENETUNREACH: -101,
  ENOENT: -2, ENOSPC: -28, ENOSYS: -38, ENOTCONN: -107, ENOTDIR: -20,
  ENOTEMPTY: -39, ENOTFOUND: -3008, ENOTSUP: -95, EPERM: -1, EPIPE: -32,
  ESRCH: -3, ETIMEDOUT: -110, EXDEV: -18,
};

const MESSAGES = {
  EACCES: 'permission denied', EADDRNOTAVAIL: 'address not available',
  ECONNREFUSED: 'connection refused', ECONNRESET: 'connection reset by peer',
  EEXIST: 'file already exists', EINVAL: 'invalid argument',
  EISDIR: 'illegal operation on a directory', ENOENT: 'no such file or directory',
  ENOSYS: 'function not implemented', ENOTDIR: 'not a directory',
  ENOTEMPTY: 'directory not empty', ENOTFOUND: 'getaddrinfo ENOTFOUND',
  ENOTSUP: 'operation not supported on socket', EPERM: 'operation not permitted',
  ESRCH: 'no such process', ETIMEDOUT: 'connection timed out',
};

// `ENOENT: no such file or directory, open '/x'` (fs style) or
// `spawn git ENOENT` (child_process style, pass `message`).
export function systemError(code, syscall, extra = {}) {
  const { path, message, ...rest } = extra;
  const text = message ?? `${code}: ${MESSAGES[code] || 'error'}, ${syscall}${path !== undefined ? ` '${path}'` : ''}`;
  const err = new Error(text);
  err.errno = ERRNO[code] ?? -1;
  err.code = code;
  err.syscall = syscall;
  if (path !== undefined) err.path = path;
  Object.assign(err, rest);
  return err;
}

// Node's internal `ERR_*` style errors (TypeError/Error with a string code).
export function nodeError(code, message, Ctor = Error) {
  const err = new Ctor(message);
  err.code = code;
  return err;
}

export function unsupported(what) {
  return nodeError('ERR_FEATURE_UNAVAILABLE_ON_PLATFORM', `${what} is not available in the browser runtime`);
}

export function abortError(signal) {
  const err = new Error('The operation was aborted');
  err.name = 'AbortError';
  err.code = 'ABORT_ERR';
  if (signal && signal.reason !== undefined) err.cause = signal.reason;
  return err;
}
