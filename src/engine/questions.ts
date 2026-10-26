import { Rational, ZERO, max, min, sum } from './rational';
import { constructScenarios, cellKey } from './scenarios';
import { ascii } from './types';
import type { Bounds, Comparison, ConditionalAnswer, Decision, Question } from './types';

export function prioritizeQuestions(d: Decision, comparison: Comparison, bounds: Bounds) {
  const worlds = constructScenarios(d), count = new Rational(BigInt(worlds.length));
  const average = (xs: Rational[]) => sum(xs).div(count);
  const choose = (a:Rational,b:Rational):'A'|'B' => a.cmp(b)>0?'A':a.cmp(b)<0?'B':ascii(d.offers[0].id,d.offers[1].id)<0?'A':'B';
  const meanA = average(worlds.map(w=>w.a)), meanB = average(worlds.map(w=>w.b));
  if (meanA.cmp(comparison.a)!==0 || meanB.cmp(comparison.b)!==0) throw new Error('Scenario means must equal midpoint utilities');
  const baseChoice = choose(meanA,meanB);
  const baselineLoss = average(worlds.map(w=>max(w.a,w.b).sub(baseChoice==='A'?w.a:w.b)));
  const questions: Question[] = [];
  for (const c of [...d.criteria].sort((a,b)=>ascii(a.id,b.id))) {
    const targets = [...d.offers].sort((a,b)=>ascii(a.id,b.id)).map(o=>o.id).filter(id=>{
      const cell=c.cells[id]; return cell.kind==='unknown' && worlds[0].answers[cellKey(c.id,id)]!==undefined;
    });
    if (!targets.length) continue;
    const con = comparison.contributions.find(x=>x.id===c.id)!;
    const l=con.bounds.lower,h=con.bounds.upper;
    const remainderLower=bounds.lower.sub(l),remainderUpper=bounds.upper.sub(h);
    const relevant = h.cmp(l)>0 && max(remainderLower,h.neg()).cmp(min(remainderUpper,l.neg()))<=0;
    const groups = new Map<string,typeof worlds>();
    for (const w of worlds) {
      const key = JSON.stringify(targets.map(id=>w.answers[cellKey(c.id,id)]));
      const group=groups.get(key); if(group) group.push(w); else groups.set(key,[w]);
    }
    const outcomes: ConditionalAnswer[] = []; let residualTotal=ZERO, bestConditionalMean=ZERO;
    for (const rows of groups.values()) {
      const n = new Rational(BigInt(rows.length)), mass=n.div(count);
      const ma=sum(rows.map(w=>w.a)).div(n),mb=sum(rows.map(w=>w.b)).div(n),choice=choose(ma,mb);
      residualTotal=residualTotal.add(sum(rows.map(w=>max(w.a,w.b).sub(choice==='A'?w.a:w.b))));
      bestConditionalMean=bestConditionalMean.add(mass.mul(max(ma,mb)));
      outcomes.push({ answers:Object.fromEntries(targets.map(id=>[id,rows[0].answers[cellKey(c.id,id)]])),mass,meanA:ma,meanB:mb,choice });
    }
    const residualLoss=residualTotal.div(count),value=baselineLoss.sub(residualLoss);
    if(value.cmp(ZERO)<0 || value.cmp(bestConditionalMean.sub(max(meanA,meanB)))!==0) throw new Error('Information-value invariant failed');
    questions.push({ id:c.id,text:c.question,targets,relevant,baselineLoss,residualLoss,value,rank:0,tied:false,outcomes });
  }
  questions.sort((a,b)=>Number(b.relevant)-Number(a.relevant)||-a.value.cmp(b.value)||ascii(a.id,b.id));
  let rank=0,last:Rational|null=null;
  for(const q of questions.filter(q=>q.relevant)) {
    if(last===null || q.value.cmp(last)!==0) rank++;
    q.rank=rank;last=q.value;
    q.tied=questions.some(other=>other!==q && other.relevant && q.value.cmp(other.value)===0);
  }
  return {questions,scenarioCount:worlds.length,baselineLoss};
}
