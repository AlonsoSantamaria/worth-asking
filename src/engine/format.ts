import { Rational } from './rational';

function floorDiv(n: bigint, d: bigint) { return n / d - (n < 0n && n % d !== 0n ? 1n : 0n); }
function fixedInteger(x: bigint): string {
  const sign = x < 0n ? '-' : '', a = x < 0n ? -x : x;
  return `${sign}${a / 100n}.${(a % 100n).toString().padStart(2, '0')}`;
}
export function format(q: Rational, mode: 'nearest' | 'lower' | 'upper' = 'nearest') {
  const n = q.n * 100n;
  if (mode === 'lower') return fixedInteger(floorDiv(n, q.d));
  if (mode === 'upper') return fixedInteger(-floorDiv(-n, q.d));
  const abs = n < 0n ? -n : n;
  const rounded = abs / q.d + (2n * (abs % q.d) >= q.d ? 1n : 0n);
  return fixedInteger(n < 0n ? -rounded : rounded);
}
export function precisionNote(q: Rational) {
  return q.n !== 0n && format(q) === '0.00' ? `${q.n > 0n ? 'Positive' : 'Negative'}, below display precision (${q})` : '';
}
