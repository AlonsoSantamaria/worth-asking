import { describe,it,expect } from 'vitest';
import { applyEvidence } from '../evidence';
import { checked } from './helpers';
import { jobOffers } from '../../data/jobOffers';
import { emptySession,sessionReducer } from '../../state/session';

describe('real evidence and ranking reversal',()=>{
  it('reverses from A to B and robustly stops while unknowns remain',()=>{
    const before=checked(),updated=applyEvidence(before.decision,'office',{northstar:'5',harbor:'1'});
    expect(updated.ok).toBe(true);if(!updated.ok)return;
    const after=checked(updated.decision);
    expect([after.comparison.a.toString(),after.comparison.b.toString(),after.comparison.gap.toString()]).toEqual(['43','65','-22']);
    expect([after.bounds.lower.toString(),after.bounds.upper.toString()]).toEqual(['-24','-20']);
    expect(after.policy).toEqual({stability:'Stable preference',action:'STOP',winner:'B'});
    expect(after.questions.filter(q=>q.relevant)).toHaveLength(0);
    expect(after.decision.criteria.find(c=>c.id==='growth')!.cells.northstar.kind).toBe('unknown');
    expect(after.decision.criteria.find(c=>c.id==='leave')!.cells.harbor.kind).toBe('unknown');
    expect(before.decision.criteria.find(c=>c.id==='office')!.cells.northstar.kind).toBe('unknown');
  });
  it('accepts an interior answer and preserves an omitted answer',()=>{
    const updated=applyEvidence(jobOffers(),'office',{northstar:'5',harbor:''});
    if(!updated.ok)throw new Error('Valid answer rejected');
    const c=updated.decision.criteria.find(c=>c.id==='office')!;
    expect(c.cells.northstar).toEqual({kind:'known',value:'5',source:'user-evidence'});expect(c.cells.harbor.kind).toBe('unknown');
    const second=applyEvidence(updated.decision,'office',{harbor:'1'});expect(second.ok).toBe(true);
    if(second.ok) expect(checked(second.decision).comparison.b.toString()).toBe('65');
  });
  it('does not silently broaden assumptions or apply partial failed transactions',()=>{
    const d=jobOffers();d.criteria.find(c=>c.id==='office')!.cells.northstar={kind:'unknown',lower:'0',upper:'2',source:'assumption'};
    const bad=applyEvidence(d,'office',{northstar:'5',harbor:'1'});
    expect(bad.ok).toBe(false);if(!bad.ok)expect(bad.issues[0].code).toBe('OUTSIDE_ASSUMED_RANGE');
    expect(d.criteria.find(c=>c.id==='office')!.cells.harbor.kind).toBe('unknown');
    d.criteria.find(c=>c.id==='office')!.cells.northstar={kind:'unknown',lower:'0',upper:'5',source:'assumption'};
    expect(applyEvidence(d,'office',{northstar:'5',harbor:'1'}).ok).toBe(true);
  });
  it.each([{}, {northstar:''}, {northstar:'NaN'}, {northstar:'6'}, {missing:'1'}] as Record<string,string>[])('rejects incomplete/invalid transaction %j',answers=>expect(applyEvidence(jobOffers(),'office',answers).ok).toBe(false));
  it('keeps immediately preceding valid before/after results',()=>{
    const before=sessionReducer(emptySession,{type:'load',decision:jobOffers()}),u=applyEvidence(jobOffers(),'office',{northstar:'5',harbor:'1'});
    if(!u.ok)throw new Error('Valid answer rejected');
    const after=sessionReducer(before,{type:'edit',decision:u.decision});
    expect(after.previous?.comparison.preferred).toBe('A');expect(after.current?.ok && after.current.comparison.preferred).toBe('B');
  });
});
