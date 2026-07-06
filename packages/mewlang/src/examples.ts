export interface Example {
  id: string
  title: string
  source: string
}

export const EXAMPLES: Example[] = [
  {
    id: 'fib',
    title: 'fib(10) — the classic',
    source: `;; the classic — watch the call tree collapse into a DAG
def fib(n) =
  if n < 2 then n
  else fib(n - 1) + fib(n - 2)

main = fib(10)
`,
  },
  {
    id: 'arith',
    title: 'add/mul arithmetic — hash-consing',
    source: `;; the two (1 + 2) subterms share ONE e-class — hash-consing
main = (1 + 2) * (1 + 2)
`,
  },
  {
    id: 'max',
    title: 'max via if',
    source: `;; branching without control flow: R-if is a union, not a jump
def max(a, b) = if a < b then b else a

main = max(3, 4 * 2)
`,
  },
  {
    id: 'gcd',
    title: 'gcd(48, 18) — subtraction Euclid',
    source: `;; Euclid by repeated subtraction
def gcd(a, b) =
  if a == b then a
  else if a < b then gcd(a, b - a)
  else gcd(a - b, b)

main = gcd(48, 18)
`,
  },
  {
    id: 'sumto',
    title: 'sum-to(100) — deep recursion',
    source: `;; 1 + 2 + ... + n, one unfold per level
def sumto(n) = if n == 0 then 0 else n + sumto(n - 1)

main = sumto(100)
`,
  },
  {
    id: 'loop',
    title: 'loop — infinite unfolding (fuel!)',
    source: `;; this never quiesces — the fuel cell is the only thing that stops it
def loop(n) = loop(n + 1)

main = loop(0)
`,
  },
]

export function exampleById(id: string): Example {
  const e = EXAMPLES.find((x) => x.id === id)
  if (!e) throw new Error(`no example ${id}`)
  return e
}
