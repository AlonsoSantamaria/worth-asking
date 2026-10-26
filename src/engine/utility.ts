import { decimal, HUNDRED, sum, TWO, ZERO, min, max } from './rational';
import type { Rational } from './rational';
import { ascii } from './types';
import type { Cell, Criterion, Decision, Comparison, Interval } from './types';

export function normalized(c: Criterion, x: Rational) {
  const a = decimal(c.a), b = decimal(c.b);
  return (c.direction === 'higher' ? x.sub(a) : b.sub(x)).div(b.sub(a));
}
export function midpoint(cell: Cell) { return cell.kind === 'known' ? decimal(cell.value) : decimal(cell.lower).add(decimal(cell.upper)).div(TWO); }
export function utilityInterval(c: Criterion, cell: Cell): Interval {
  if (cell.kind === 'known') { const q = normalized(c, decimal(cell.value)); return { lower: q, upper: q }; }
  const a = normalized(c, decimal(cell.lower)), b = normalized(c, decimal(cell.upper));
  return { lower: min(a,b), upper: max(a,b) };
}
export function compare(decision: Decision): Comparison {
  const [a, b] = decision.offers;
  const rows = [...decision.criteria].sort((a,b) => ascii(a.id,b.id));
  const total = sum(rows.map(c => decimal(c.importance)));
  const contributions = rows.map(c => {
    const weight = decimal(c.importance).div(total), factor = weight.mul(HUNDRED);
    const va = utilityInterval(c, c.cells[a.id]), vb = utilityInterval(c, c.cells[b.id]);
    const ca = factor.mul(normalized(c, midpoint(c.cells[a.id]))), cb = factor.mul(normalized(c, midpoint(c.cells[b.id])));
    return { id: c.id, weight, a: ca, b: cb, gap: ca.sub(cb), bounds: { lower: factor.mul(va.lower.sub(vb.upper)), upper: factor.mul(va.upper.sub(vb.lower)) } };
  });
  const sa = sum(contributions.map(c => c.a)), sb = sum(contributions.map(c => c.b)), gap = sa.sub(sb);
  return { a: sa, b: sb, gap, preferred: gap.cmp(ZERO) > 0 ? 'A' : gap.cmp(ZERO) < 0 ? 'B' : 'tie', contributions };
}
