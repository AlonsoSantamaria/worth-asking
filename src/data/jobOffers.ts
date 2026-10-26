import type { Cell, Decision } from '../engine/types';
const known = (value: string): Cell => ({ kind: 'known', value, source: 'example-evidence' });
const range = (lower: string, upper: string): Cell => ({ kind: 'unknown', lower, upper, source: 'assumption' });

/** Illustrative inputs only. No expected scores, recommendation, or question ranks. */
export function jobOffers(): Decision {
  return {
    id: 'job-offers', label: 'Your next chapter', modelVersion: 'wa-independent-affine-v1', uncertaintyModel: 'independent-box',
    offers: [{ id: 'northstar', label: 'Northstar', role: 'Product Analyst' }, { id: 'harbor', label: 'Harbor', role: 'Product Analyst' }],
    criteria: [
      { id: 'salary', label: 'Annual salary', unit: 'USD / year', direction: 'higher', a: '80000', b: '120000', importance: '40', question: 'What is the annual gross salary for each offer?', cells: { northstar: known('110000'), harbor: known('100000') } },
      { id: 'office', label: 'Office attendance', unit: 'days / week', direction: 'lower', a: '0', b: '5', importance: '40', question: 'How many mandatory office days does each position require?', cells: { northstar: range('0','5'), harbor: range('0','5') } },
      { id: 'growth', label: 'Career growth fit', unit: 'rating / 10', direction: 'higher', a: '0', b: '10', importance: '15', question: 'How would you rate the career growth fit at Northstar?', cells: { northstar: range('6','8'), harbor: known('7') } },
      { id: 'leave', label: 'Annual paid leave', unit: 'days / year', direction: 'higher', a: '10', b: '30', importance: '5', question: 'How many days of annual paid leave does Harbor provide?', cells: { northstar: known('20'), harbor: range('18','22') } },
    ],
  };
}
