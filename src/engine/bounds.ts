import { canonicalDecimal, sum } from './rational';
import type { Bounds, Comparison, Decision } from './types';

/** Affine independent-box extrema; no scenario module is imported here. */
export function attainableBounds(decision: Decision, comparison: Comparison): Bounds {
  const lowerWitness: Record<string,string> = {}, upperWitness: Record<string,string> = {};
  for (const c of decision.criteria) for (const [index, offer] of decision.offers.entries()) {
    const cell = c.cells[offer.id], key = `${c.id}/${offer.id}`;
    if (cell.kind === 'known') { lowerWitness[key] = canonicalDecimal(cell.value); upperWitness[key] = canonicalDecimal(cell.value); continue; }
    const positiveSlope = (c.direction === 'higher') === (index === 0);
    lowerWitness[key] = canonicalDecimal(positiveSlope ? cell.lower : cell.upper);
    upperWitness[key] = canonicalDecimal(positiveSlope ? cell.upper : cell.lower);
  }
  return { lower: sum(comparison.contributions.map(c => c.bounds.lower)), upper: sum(comparison.contributions.map(c => c.bounds.upper)), lowerWitness, upperWitness };
}
