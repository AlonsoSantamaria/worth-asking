import { describe, it, expect } from 'vitest';
import { jobOffers } from '../../data/jobOffers';
import { checked, unknown } from './helpers';

describe('normalization, weights, estimates', () => {
  it('uses fixed anchors in both directions', () => {
    const r=checked();
    expect(r.comparison.contributions.find(c => c.id==='salary')!.a.toString()).toBe('30');
    expect(r.comparison.contributions.find(c => c.id==='office')!.a.toString()).toBe('20');
  });
  it('does not renormalize anchors when plausible ranges change', () => {
    const d=jobOffers(); d.criteria.find(c=>c.id==='office')!.cells.northstar=unknown('4','5');
    const r=checked(d); expect(r.comparison.contributions.find(c=>c.id==='office')!.a.toString()).toBe('4');
  });
  it('is invariant to proportional weights', () => {
    const d=jobOffers(); for(const c of d.criteria) c.importance=String(Number(c.importance)*2);
    expect(checked(d).comparison.a.toString()).toBe('63'); expect(checked(d).bounds.lower.toString()).toBe('-32');
  });
  it('zeroes a wide uncertain criterion exactly', () => {
    const d=jobOffers(); d.criteria.find(c=>c.id==='office')!.importance='0';
    const r=checked(d), c=r.comparison.contributions.find(c=>c.id==='office')!;
    expect([c.a.toString(),c.b.toString(),c.bounds.lower.toString(),c.bounds.upper.toString()]).toEqual(['0','0','0','0']);
    expect(r.policy.winner).toBe('A');
  });
  it('keeps degenerate ranges as assumptions with fixed utility', () => {
    const d=jobOffers(); d.criteria.find(c=>c.id==='office')!.cells.northstar=unknown('5','5');
    expect(checked(d).decision.criteria.find(c=>c.id==='office')!.cells.northstar.kind).toBe('unknown');
    expect(checked(d).comparison.contributions.find(c=>c.id==='office')!.a.toString()).toBe('0');
  });
});
