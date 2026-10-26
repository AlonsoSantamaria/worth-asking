import { describe, it, expect } from 'vitest';
import { checked, combined, known } from './helpers';
import { jobOffers } from '../../data/jobOffers';
import { decimal as q, ZERO } from '../rational';
import { recommend } from '../policy';

describe('full uncertainty and independent stopping', () => {
  it('calculates the real initial comparison', () => {
    const r = checked();
    expect([r.comparison.a.toString(),r.comparison.b.toString(),r.comparison.gap.toString()]).toEqual(['63','53','10']);
    expect([r.bounds.lower.toString(),r.bounds.upper.toString()]).toEqual(['-32','52']);
    expect(r.comparison.preferred).toBe('A'); expect(r.policy.action).toBe('CONTINUE');
  });
  it('includes joint changes that individual midpoint changes miss', () => {
    const d = combined(), r = checked(d);
    expect(r.comparison.gap.toString()).toBe('3');
    expect([r.bounds.lower.toString(),r.bounds.upper.toString()]).toEqual(['-1','7']);
    for (const id of ['x','y']) { const partial = structuredClone(d); partial.criteria.find(c => c.id === id)!.cells.northstar = known('0'); partial.criteria.find(c => c.id !== id && c.id !== 'fixed')!.cells.northstar = known('2'); expect(checked(partial).comparison.gap.toString()).toBe('1'); }
    expect(r.policy.action).toBe('CONTINUE');
  });
  it('returns endpoint witnesses that attain each full bound', () => {
    const d = jobOffers(), result = checked(d);
    for (const edge of ['lower','upper'] as const) {
      const fixed = structuredClone(d);
      for (const c of fixed.criteria) for (const o of fixed.offers) c.cells[o.id] = known(result.bounds[`${edge}Witness`][`${c.id}/${o.id}`]);
      expect(checked(fixed).comparison.gap.toString()).toBe(result.bounds[edge].toString());
    }
  });
  it.each([['1','2','STOP','A'],['-2','-1','STOP','B'],['0','1','CONTINUE',null],['-1','0','CONTINUE',null],['-1','1','CONTINUE',null],['0','0','STOP',null]])('classifies [%s,%s]', (l,h,action,winner) => {
    const r = recommend({ lower:q(l), upper:q(h) }); expect(r.action).toBe(action); expect(r.winner).toBe(winner);
  });
  it('keeps exactly tiny signs and rejects reversed bounds', () => {
    const tiny = q('0.01').div(q('1000000000'));
    expect(recommend({ lower:tiny, upper:tiny }).winner).toBe('A');
    expect(recommend({ lower:tiny.neg(), upper:ZERO }).action).toBe('CONTINUE');
    expect(() => recommend({ lower:q('1'), upper:ZERO })).toThrow();
  });
  it('handles completely known equality honestly', () => {
    const d = jobOffers();
    for (const c of d.criteria) for (const o of d.offers) c.cells[o.id] = known(c.a);
    expect(checked(d).policy).toEqual({ stability:'Indistinguishable', action:'STOP', winner:null });
  });
});
