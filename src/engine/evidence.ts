import { decimal } from './rational';
import { validate } from './validation';
import type { Decision, Issue } from './types';

export type EvidenceResult = { ok:true; decision:Decision } | { ok:false; issues:Issue[] };
export function applyEvidence(input: Decision, criterionId: string, answers: Record<string,string>): EvidenceResult {
  const valid=validate(input);if(!valid.ok)return valid;
  const decision=valid.decision,c=decision.criteria.find(c=>c.id===criterionId);
  if(!c) return {ok:false,issues:[{code:'INVALID_STRUCTURE',path:'evidence',message:'This criterion is not part of the decision.'}]};
  const issues:Issue[]=[];let count=0;
  for(const [id,text] of Object.entries(answers)) {
    if(!decision.offers.some(o=>o.id===id)) {issues.push({code:'INVALID_STRUCTURE',path:id,message:'Unknown offer.'});continue;}
    if(!text.trim())continue;
    count++;
    let value;try{value=decimal(text);}catch(e){issues.push({code:'INVALID_NUMBER',path:id,message:(e as Error).message});continue;}
    if(value.cmp(decimal(c.a))<0 || value.cmp(decimal(c.b))>0) {issues.push({code:'OUT_OF_DOMAIN',path:id,message:`Answer must lie between ${c.a} and ${c.b} ${c.unit}.`});continue;}
    const cell=c.cells[id];
    if(cell.kind==='unknown' && (value.cmp(decimal(cell.lower))<0 || value.cmp(decimal(cell.upper))>0)) {
      issues.push({code:'OUTSIDE_ASSUMED_RANGE',path:id,message:`This answer is outside your earlier range [${cell.lower}, ${cell.upper}]. Explicitly correct that range in What matters to you, then apply the evidence again. Earlier advice depended on that assumption.`});continue;
    }
    c.cells[id]={kind:'known',value:text.trim(),source:'user-evidence'};
  }
  if(!count) issues.push({code:'INCOMPLETE_INPUT',path:'evidence',message:'Enter at least one answer. Blank answers remain unknown.'});
  if(issues.length)return {ok:false,issues};
  return validate(decision);
}
