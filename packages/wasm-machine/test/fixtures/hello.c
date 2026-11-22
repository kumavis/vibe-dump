// WASI hello-world used as a real toolchain-produced fixture for the engine tests.
// Built freestanding (no libc) with:
//   clang --target=wasm32 -O2 -nostdlib -Wl,--no-entry -Wl,--export=_start \
//         -Wl,--export=fib -Wl,--export=checksum -Wl,--export=sort_demo -o hello.wasm hello.c
typedef unsigned int u32;
typedef unsigned long long u64;
struct iov { const char *p; u32 len; };

__attribute__((import_module("wasi_snapshot_preview1"), import_name("fd_write")))
int fd_write(int fd, const struct iov *iovs, int n, u32 *nwritten);
__attribute__((import_module("wasi_snapshot_preview1"), import_name("proc_exit")))
void proc_exit(int code);

static char buf[256];
static u32 pos;

static void put(const char *s) { while (*s) buf[pos++] = *s++; }
static void put_u64(u64 v) {
  char t[24]; int n = 0;
  do { t[n++] = '0' + (char)(v % 10); v /= 10; } while (v);
  while (n) buf[pos++] = t[--n];
}
static void flush(void) {
  struct iov io = { buf, pos }; u32 w;
  fd_write(1, &io, 1, &w);
  pos = 0;
}

__attribute__((noinline)) u32 fib(u32 n) { return n < 2 ? n : fib(n - 1) + fib(n - 2); }

// 64-bit FNV-1a over a generated buffer: exercises i64 mul/xor and memory
__attribute__((noinline)) u64 checksum(u32 n) {
  static unsigned char data[1024];
  for (u32 i = 0; i < n && i < 1024; i++) data[i] = (unsigned char)(i * 31 + 7);
  u64 h = 1469598103934665603ULL;
  for (u32 i = 0; i < n && i < 1024; i++) { h ^= data[i]; h *= 1099511628211ULL; }
  return h;
}

typedef int (*cmp_fn)(int, int);
static int asc(int a, int b) { return a - b; }
static int desc(int a, int b) { return b - a; }
static cmp_fn cmps[2] = { asc, desc };

// insertion sort through a function pointer (call_indirect) + a switch (br_table)
__attribute__((noinline)) int sort_demo(int which) {
  int a[8] = { 5, -3, 9, 0, 12, -7, 4, 4 };
  cmp_fn c = cmps[which & 1];
  for (int i = 1; i < 8; i++) {
    int v = a[i], j = i - 1;
    while (j >= 0 && c(a[j], v) > 0) { a[j + 1] = a[j]; j--; }
    a[j + 1] = v;
  }
  int r = 0;
  for (int i = 0; i < 8; i++) {
    switch (i % 4) {
      case 0: r += a[i]; break;
      case 1: r ^= a[i] * 3; break;
      case 2: r -= a[i] << 1; break;
      default: r = r * 7 + a[i]; break;
    }
  }
  return r;
}

void _start(void) {
  put("Hello, WASI!\n");
  flush();
  put("fib(20) = "); put_u64(fib(20)); put("\n");
  put("checksum(1000) = "); put_u64(checksum(1000)); put("\n");
  put("sort_demo = "); put_u64((u32)sort_demo(0)); put(" "); put_u64((u32)sort_demo(1)); put("\n");
  float f = 1.0f; for (int i = 0; i < 10; i++) f = f * 1.5f + 0.25f;
  put("float = "); put_u64((u64)(f * 1000)); put("\n");
  flush();
  proc_exit(3);
}
