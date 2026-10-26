import { describe,it,expect } from 'vitest';
import { checked,combined,known,unknown } from './helpers';
import { jobOffers } from '../../data/jobOffers';
import { constructScenarios } from '../scenarios';
import { evaluate } from '../evaluate';

describe('decision-relevant question value',()=>{
  it('derives the office question and exact 7.5-point information value',()=>{
    const r=checked(); expect(r.scenarioCount).toBe(16);expect(r.baselineLoss.toString()).toBe('15/2');
    const qs=r.questions.filter(q=>q.relevant);
    expect(qs[0].id).toBe('office');expect(qs[0].value.toString()).toBe('15/2');expect(qs[0].residualLoss.toString()).toBe('0');expect(qs[0].tied).toBe(false);
    for(const id of ['growth','leave']) expect(qs.find(q=>q.id===id)!.value.toString()).toBe('0');
    expect(qs[0].outcomes.map(x=>x.meanA.sub(x.meanB).toString()).sort()).toEqual(['-30','10','10','50']);
    expect(qs[0].outcomes.every(x=>x.mass.toString()==='1/4')).toBe(true);
  });
  it('does not mistake complementary zero single-question value for STOP',()=>{
    const r=checked(combined());
    expect(r.baselineLoss.toString()).toBe('1/4');expect(r.policy.action).toBe('CONTINUE');
    expect(r.questions.filter(q=>q.relevant).map(q=>[q.id,q.value.toString(),q.rank,q.tied])).toEqual([['x','0',1,true],['y','0',1,true]]);
  });
  it('shares positive value ranks and uses ASCII ID only for presentation',()=>{
    const d=combined();d.criteria[0].cells.northstar=known('50');
    const r=checked(d);expect(r.comparison.preferred).toBe('tie');expect(r.policy.stability).toBe('Unsettled');
    expect(r.questions.map(q=>[q.id,q.value.toString(),q.rank,q.tied])).toEqual([['x','1',1,true],['y','1',1,true]]);
  });
  it('excludes zero-weight uncertainty from relevant questions',()=>{
    const d=jobOffers();d.criteria.find(c=>c.id==='office')!.importance='0';
    const r=checked(d);expect(r.questions.find(q=>q.id==='office')!.relevant).toBe(false);
    expect(r.policy.action).toBe('STOP');expect(r.questions.filter(q=>q.relevant)).toHaveLength(0);
  });
  it('cannot be driven by a fixture ID or raw range width',()=>{
    const d=jobOffers();d.id='different';d.label='Unrelated names';d.criteria.find(c=>c.id==='office')!.id='travel';
    const r=checked(d);expect(r.questions[0].id).toBe('travel');expect(r.questions[0].value.toString()).toBe('15/2');
  });
  it('covers all allowed endpoint combinations deterministically',()=>{
    const d=jobOffers();const worlds=constructScenarios(d);
    expect(worlds).toHaveLength(16);expect(new Set(worlds.map(w=>JSON.stringify(w.answers))).size).toBe(16);
    d.criteria.reverse();expect(constructScenarios(d)).toEqual(worlds);
  });
  it('reproduces results across input order and equivalent decimal strings',()=>{
    const d=jobOffers(),first=checked(d);d.criteria.reverse();
    const salary=d.criteria.find(c=>c.id==='salary')!;salary.importance='040.00';salary.cells.northstar=known('0110000.00');
    // Source remains equal to the original illustrative source for fingerprint identity.
    salary.cells.northstar={kind:'known',value:'0110000.00',source:'example-evidence'};
    const second=checked(d);
    expect(second.fingerprint).toBe(first.fingerprint);
    expect(second.questions).toEqual(first.questions);expect(second.bounds).toEqual(first.bounds);expect(second.policy).toEqual(first.policy);
    expect(checked(d)).toEqual(second);
  });
  it('removes questions when unknown ranges degenerate',()=>{
    const d=jobOffers();for(const c of d.criteria) for(const o of d.offers)if(c.cells[o.id].kind==='unknown')c.cells[o.id]=unknown(c.a,c.a);
    const r=evaluate(d);expect(r.ok).toBe(true);if(r.ok){expect(r.scenarioCount).toBe(1);expect(r.questions).toHaveLength(0);}
  });
});
