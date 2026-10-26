import { describe, it, expect } from 'vitest';
import { jobOffers } from '../../data/jobOffers';
import { evaluate } from '../evaluate';
import type { Decision } from '../types';
import { emptySession, sessionReducer } from '../../state/session';

describe('invalid/incomplete input never gets a current verdict', () => {
  const cases: [string,(d:Decision)=>void,string][] = [
    ['blank weight',d=>{d.criteria[0].importance='';},'INCOMPLETE_INPUT'],
    ['negative weight',d=>{d.criteria[0].importance='-1';},'INVALID_WEIGHT'],
    ['zero weights',d=>{d.criteria.forEach(c=>c.importance='0');},'ZERO_TOTAL_WEIGHT'],
    ['NaN',d=>{d.criteria[0].importance='NaN';},'INVALID_NUMBER'],
    ['exponent',d=>{d.criteria[0].importance='1e2';},'INVALID_NUMBER'],
    ['reversed anchors',d=>{d.criteria[0].a='120000';d.criteria[0].b='80000';},'INVALID_RANGE'],
    ['duplicate IDs',d=>{d.criteria[0].id=d.criteria[1].id;},'INVALID_STRUCTURE'],
    ['unsupported coupled model',d=>{Object.assign(d,{constraints:[]});},'UNSUPPORTED_MODEL'],
    ['missing cell',d=>{delete d.criteria[0].cells.northstar;},'INCOMPLETE_INPUT'],
    ['bad bounds',d=>{d.criteria[1].cells.northstar={kind:'unknown',lower:'5',upper:'1',source:'assumption'};},'INVALID_RANGE'],
    ['outside anchors',d=>{d.criteria[1].cells.northstar={kind:'unknown',lower:'0',upper:'6',source:'assumption'};},'OUT_OF_DOMAIN'],
    ['incomplete bounds',d=>{d.criteria[1].cells.northstar={kind:'unknown',lower:'',upper:'5',source:'assumption'};},'INCOMPLETE_INPUT'],
    ['bad zero-weight cell',d=>{d.criteria[1].importance='0';d.criteria[1].cells.northstar={kind:'unknown',lower:'oops',upper:'5',source:'assumption'};},'INVALID_NUMBER'],
    ['too few criteria',d=>{d.criteria=d.criteria.slice(0,1);},'INVALID_STRUCTURE'],
  ];
  it.each(cases)('%s',(_name,edit,code)=>{
    const d=jobOffers();edit(d);const r=evaluate(d);expect(r.ok).toBe(false);
    if(!r.ok){expect(r.issues.some(e=>e.code===code)).toBe(true);expect('policy' in r).toBe(false);}
  });
  it.each([null,{},[],{offers:null},'text',42])('rejects malformed root %j',x=>expect(evaluate(x).ok).toBe(false));
  it('retains previous valid evaluation while marking edits unevaluated',()=>{
    const first=sessionReducer(emptySession,{type:'load',decision:jobOffers()});
    const next=jobOffers();next.criteria[0].importance='';
    const invalid=sessionReducer(first,{type:'edit',decision:next});
    expect(invalid.current?.ok).toBe(false);expect(invalid.previous?.comparison.a.toString()).toBe('63');
    const reload=sessionReducer(invalid,{type:'load',decision:jobOffers()});expect(reload.previous).toBeNull();
  });
});
