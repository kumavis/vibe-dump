// Entry for runtime/vendor.js: the npm libraries the Node shims (track B) and
// the Bun polyfill (track C) need, bundled once by scripts/build-runtime.mjs
// (Vite lib mode, vite.vendor.config.js) into a single ESM file with no
// further imports except the Node built-ins memfs requires, which are rewritten
// to ./node/<name>.js so they resolve to our own shims.
//
// Export names are a contract with src/runtime/node/* and src/runtime/bun/*:
// add, don't rename.

// --- virtual filesystem ---------------------------------------------------
export { Volume, createFsFromVolume } from 'memfs';
// memfs' inodes read uid/gid from this object (the global process if one
// existed when vendor.js loaded, else a stub); fs.js keeps it in sync.
export { default as memfsProcess } from '@jsonjoy.com/fs-core/lib/process.js';

// --- hashing (sync; WebCrypto is async-only) ------------------------------
export { sha224, sha256, sha384, sha512, sha512_224, sha512_256 } from '@noble/hashes/sha2';
export { md5, sha1, ripemd160 } from '@noble/hashes/legacy';
export { sha3_256, sha3_512 } from '@noble/hashes/sha3';
export { hmac } from '@noble/hashes/hmac';
export { pbkdf2 } from '@noble/hashes/pbkdf2';
export { hkdf } from '@noble/hashes/hkdf';
export { scrypt } from '@noble/hashes/scrypt';

// --- compression ----------------------------------------------------------
import * as fflate from 'fflate';
import * as fzstd from 'fzstd';
export { fflate, fzstd };

// --- text / data helpers used by the Bun polyfill -------------------------
import * as YAML from 'yaml';
import semver from 'semver';
export { YAML, semver };
export { default as stringWidth } from 'string-width';
export { default as wrapAnsi } from 'wrap-ansi';
export { default as sliceAnsi } from 'slice-ansi';
export { default as stripAnsi } from 'strip-ansi';
