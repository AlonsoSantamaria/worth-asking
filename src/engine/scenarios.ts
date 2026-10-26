import { canonicalDecimal, decimal, HUNDRED, sum, ZERO } from './rational';
import type { Rational } from './rational';
import { normalized } from './utility';
import { ascii } from './types';
import type { Decision } from './types';

export interface World { answers: Record<string,string>; a: Rational; b: Rational }
export const cellKey = (criterionId: string, offerId: string) => `${criterionId}/${offerId}`;

/** Complete Cartesian endpoint thought experiment, NOT a robust-bound estimator. */
export function constructScenarios(d: Decision): World[] {
  const total = sum(d.criteria.map(c=>decimal(c.importance)));
  let baseA = ZERO, baseB = ZERO;
  const dimensions: { key: string; offerIndex: number; values: [string,string]; contributions: [Rational,Rational] }[] = [];
  for (const c of [...d.criteria].sort((a,b)=>ascii(a.id,b.id))) {
    const factor = HUNDRED.mul(decimal(c.importance).div(total));
    for (const o of [...d.offers].sort((a,b)=>ascii(a.id,b.id))) {
      const oi = d.offers[0].id === o.id ? 0 : 1, cell = c.cells[o.id];
      if (cell.kind === 'unknown' && decimal(cell.lower).cmp(decimal(cell.upper)) !== 0) {
        dimensions.push({ key:cellKey(c.id,o.id), offerIndex:oi, values:[canonicalDecimal(cell.lower),canonicalDecimal(cell.upper)], contributions:[factor.mul(normalized(c,decimal(cell.lower))),factor.mul(normalized(c,decimal(cell.upper)))] });
      } else {
        const value = cell.kind === 'known' ? cell.value : cell.lower;
        const contribution = factor.mul(normalized(c,decimal(value)));
        if (oi === 0) baseA = baseA.add(contribution); else baseB = baseB.add(contribution);
      }
    }
  }
  if (dimensions.length > 12) throw new Error('Unsupported scenario count');
  let worlds: World[] = [{ answers:{},a:baseA,b:baseB }];
  for (const dim of dimensions) worlds = worlds.flatMap(w=>([0,1] as const).map(i=>({
    answers:{...w.answers,[dim.key]:dim.values[i]},
    a:dim.offerIndex===0?w.a.add(dim.contributions[i]):w.a,
    b:dim.offerIndex===1?w.b.add(dim.contributions[i]):w.b,
  })));
  return worlds;
}
