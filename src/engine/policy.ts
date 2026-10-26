import { ZERO } from './rational';
import type { Interval, Policy } from './types';

/** Policy consumes the complete attainable interval, never a scenario frequency. */
export function recommend(bounds: Interval): Policy {
  if (bounds.lower.cmp(bounds.upper) > 0) throw new Error('Invalid attainable bounds');
  if (bounds.lower.cmp(ZERO) > 0) return { stability: 'Stable preference', action: 'STOP', winner: 'A' };
  if (bounds.upper.cmp(ZERO) < 0) return { stability: 'Stable preference', action: 'STOP', winner: 'B' };
  if (bounds.lower.cmp(ZERO) === 0 && bounds.upper.cmp(ZERO) === 0) return { stability: 'Indistinguishable', action: 'STOP', winner: null };
  return { stability: 'Unsettled', action: 'CONTINUE', winner: null };
}
