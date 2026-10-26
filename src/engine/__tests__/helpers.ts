import { jobOffers } from '../../data/jobOffers';
import { evaluate } from '../evaluate';
import type { Cell, Decision } from '../types';
export const known = (value: string): Cell => ({ kind: 'known', value, source: 'user-evidence' });
export const unknown = (lower: string, upper: string): Cell => ({ kind: 'unknown', lower, upper, source: 'assumption' });
export function checked(d: Decision = jobOffers()) {
  const r = evaluate(d);
  if (!r.ok) throw new Error(JSON.stringify(r.issues));
  return r;
}
export function combined(): Decision {
  const d = jobOffers(), ids = d.offers.map(o => o.id);
  d.criteria = [
    { id: 'fixed', label: 'Fixed benefit', unit: 'rating', a: '0', b: '100', direction: 'higher', importance: '40', question: 'What is the benefit?', cells: { [ids[0]]: known('57.5'), [ids[1]]: known('50') } },
    ...['x','y'].map(id => ({ id, label: `Uncertain ${id}`, unit: 'rating', a: '0', b: '30', direction: 'higher' as const, importance: '30', question: `What is ${id}?`, cells: { [ids[0]]: unknown('0','4'), [ids[1]]: known('2') } })),
  ];
  return d;
}
