// Bun.file / Bun.write / Bun.stdin / Bun.stdout / Bun.stderr over the VFS
// (deps.fs: track B's memfs-backed shim, sync API) and deps.process streams.
//
// A BunFile is lazy: nothing touches the filesystem until a method or the
// `size` / `lastModified` getters are used. Relative paths resolve against
// process.cwd(), like Bun. Bun.write creates missing parent directories, as
// Bun does by default (createPath: true).
import { bytesStream, readAllBytes, toWebStream } from './streams.js'
import { concatBytes, fromUtf8, toBytes, toBytesAsync } from './bytes.js'

const MIME = {
  txt: 'text/plain;charset=utf-8',
  md: 'text/markdown;charset=utf-8',
  json: 'application/json;charset=utf-8',
  js: 'text/javascript;charset=utf-8',
  mjs: 'text/javascript;charset=utf-8',
  html: 'text/html;charset=utf-8',
  css: 'text/css;charset=utf-8',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  pdf: 'application/pdf',
  wasm: 'application/wasm',
}
const mimeOf = (p) => MIME[/\.([^./]+)$/.exec(p)?.[1]?.toLowerCase()] ?? 'application/octet-stream'
const view = (b) => new Uint8Array(b.buffer, b.byteOffset, b.byteLength)

export function makeFiles(deps) {
  const fs = () => {
    if (!deps.fs) throw new Error('Bun.file is unavailable: installBun() was not given deps.fs')
    return deps.fs
  }
  const proc = () => deps.process ?? globalThis.process

  function resolvePath(p) {
    let s = p instanceof URL ? decodeURIComponent(p.pathname) : String(p)
    if (s.startsWith('file://')) s = decodeURIComponent(new URL(s).pathname)
    if (s.startsWith('/')) return s
    const base = proc()?.cwd?.() ?? '/'
    return deps.path ? deps.path.resolve(base, s) : `${base.replace(/\/$/, '')}/${s}`
  }
  const dirname = (p) => (deps.path ? deps.path.dirname(p) : p.replace(/\/[^/]*$/, '') || '/')

  function fdStream(fd) {
    const p = proc()
    return fd === 1 ? p?.stdout : fd === 2 ? p?.stderr : undefined
  }

  /** FileSink: buffered writes, flushed on flush()/end(); the file is truncated on first flush. */
  function fileSink(target) {
    let parts = []
    let started = false
    const flush = () => {
      const data = concatBytes(parts.length ? parts : [new Uint8Array(0)])
      parts = []
      if (typeof target === 'number') {
        const s = fdStream(target)
        if (data.length && s) s.write(data)
      } else if (!started) {
        fs().mkdirSync(dirname(target), { recursive: true })
        fs().writeFileSync(target, data)
      } else if (data.length) {
        fs().appendFileSync(target, data)
      }
      started = true
      return data.length
    }
    return {
      write(chunk) {
        const u8 = toBytes(chunk)
        parts.push(u8.slice())
        return u8.length
      },
      flush,
      end() { return flush() },
      ref() {},
      unref() {},
      start() {},
    }
  }

  class BunFile {
    #path
    #fd
    #begin
    #end
    #type

    constructor(target, options = {}, range) {
      if (typeof target === 'number') this.#fd = target
      else this.#path = resolvePath(target)
      this.#type = options.type ?? (this.#path ? mimeOf(this.#path) : 'application/octet-stream')
      ;[this.#begin, this.#end] = range ?? [0, undefined]
    }

    get name() { return this.#path ?? this.#fd }
    get fd() { return this.#fd }
    get type() { return this.#type }

    get size() {
      if (this.#path === undefined) return Infinity
      try {
        const n = fs().statSync(this.#path).size
        const end = this.#end === undefined ? n : Math.min(this.#end, n)
        return Math.max(0, end - this.#begin)
      } catch {
        return 0
      }
    }

    get lastModified() {
      try { return fs().statSync(this.#path).mtimeMs } catch { return 0 }
    }

    #read() {
      if (this.#fd === 0) return readAllBytes(toWebStream(proc()?.stdin))
      if (this.#path === undefined) throw new Error(`Bun.file(${this.#fd}): reading this descriptor is not supported`)
      const all = view(fs().readFileSync(this.#path))
      return this.#begin === 0 && this.#end === undefined ? all : all.subarray(this.#begin, this.#end)
    }

    async exists() {
      if (this.#path === undefined) return true
      try { fs().statSync(this.#path); return true } catch { return false }
    }

    async bytes() { return await this.#read() }
    async arrayBuffer() { return (await this.#read()).slice().buffer }
    async text() { return fromUtf8(await this.#read()) }
    async json() { return JSON.parse(await this.text()) }
    stream() {
      if (this.#fd === 0) return toWebStream(proc()?.stdin)
      return bytesStream(async () => this.#read())
    }

    slice(begin = 0, end, type) {
      const b = this.#begin + Math.max(0, begin)
      const e = end === undefined ? this.#end : this.#begin + Math.max(0, end)
      return new BunFile(this.#path ?? this.#fd, { type: type ?? this.#type }, [b, e])
    }

    writer() { return fileSink(this.#path ?? this.#fd) }
    write(data) { return write(this, data) }
    async delete() { fs().unlinkSync(this.#path) }
    unlink() { return this.delete() }
    async stat() { return fs().statSync(this.#path) }
  }

  function file(target, options) {
    if (target instanceof BunFile) return target
    return new BunFile(target, options)
  }

  // Bun.write(destination, data): destination is a path, URL, BunFile or fd;
  // data a string, bytes, Blob, Response, BunFile or an array of those.
  async function write(destination, data, options = {}) {
    const bytes = data instanceof BunFile ? await data.bytes() : await toBytesAsync(data)
    const fd = typeof destination === 'number' ? destination : destination instanceof BunFile ? destination.fd : undefined
    if (fd !== undefined) {
      const s = fdStream(fd)
      if (!s) throw new Error(`Bun.write: cannot write to file descriptor ${fd}`)
      s.write(bytes)
      return bytes.length
    }
    const p = destination instanceof BunFile ? destination.name : resolvePath(destination)
    if (options.createPath !== false) fs().mkdirSync(dirname(p), { recursive: true })
    fs().writeFileSync(p, bytes)
    return bytes.length
  }

  return {
    BunFile,
    file,
    write,
    stdin: new BunFile(0, { type: 'application/octet-stream' }),
    stdout: new BunFile(1, { type: 'application/octet-stream' }),
    stderr: new BunFile(2, { type: 'application/octet-stream' }),
  }
}
