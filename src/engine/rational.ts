/** Exact arithmetic. Never convert a decimal to a binary floating-point value. */
export class Rational {
  readonly n: bigint;
  readonly d: bigint;
  constructor(n: bigint, d = 1n) {
    if (d === 0n) throw new Error('Zero denominator');
    if (d < 0n) { n = -n; d = -d; }
    let a = n < 0n ? -n : n, b = d;
    while (b) { const rem = a % b; a = b; b = rem; }
    const gcd = a || 1n;
    this.n = n / gcd; this.d = d / gcd;
  }
  add(b: Rational) { return new Rational(this.n * b.d + b.n * this.d, this.d * b.d); }
  sub(b: Rational) { return new Rational(this.n * b.d - b.n * this.d, this.d * b.d); }
  mul(b: Rational) { return new Rational(this.n * b.n, this.d * b.d); }
  div(b: Rational) { return new Rational(this.n * b.d, this.d * b.n); }
  cmp(b: Rational) { const x = this.n * b.d - b.n * this.d; return x < 0n ? -1 : x > 0n ? 1 : 0; }
  neg() { return new Rational(-this.n, this.d); }
  toString() { return this.d === 1n ? `${this.n}` : `${this.n}/${this.d}`; }
}
export const ZERO = new Rational(0n);
export const ONE = new Rational(1n);
export const TWO = new Rational(2n);
export const HUNDRED = new Rational(100n);
export const sum = (xs: Rational[]) => xs.reduce((a, b) => a.add(b), ZERO);
export const min = (a: Rational, b: Rational) => a.cmp(b) <= 0 ? a : b;
export const max = (a: Rational, b: Rational) => a.cmp(b) >= 0 ? a : b;
export function decimal(value: string): Rational {
  const text = value.trim();
  if (text.length > 32 || !/^-?\d+(?:\.\d{1,2})?$/.test(text)) throw new Error('Use a decimal with at most two places.');
  const negative = text.startsWith('-');
  const [whole, frac = ''] = (negative ? text.slice(1) : text).split('.');
  const q = new Rational(BigInt(whole + frac) * (negative ? -1n : 1n), 10n ** BigInt(frac.length));
  if (q.cmp(new Rational(-1000000000n)) < 0 || q.cmp(new Rational(1000000000n)) > 0) throw new Error('Magnitude must not exceed 1,000,000,000.');
  return q;
}
export function canonicalDecimal(text: string) {
  const q=decimal(text), scaled=q.n*100n/q.d, abs=scaled<0n?-scaled:scaled;
  const fraction=(abs%100n).toString().padStart(2,'0').replace(/0+$/,'');
  return `${scaled<0n?'-':''}${abs/100n}${fraction?'.'+fraction:''}`;
}
