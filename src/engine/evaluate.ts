import { validate } from './validation';
import { compare } from './utility';
import { attainableBounds } from './bounds';
import { recommend } from './policy';
import { decimal } from './rational';
import { ascii } from './types';
import { prioritizeQuestions } from './questions';
import type { Decision, Evaluation } from './types';

function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value !== null && typeof value==='object') return Object.fromEntries(Object.entries(value).sort(([a],[b])=>ascii(a,b)).map(([key,x])=>[key,canonical(x)]));
  return value;
}
export function fingerprint(d: Decision) {
  return JSON.stringify(canonical({ ...d, criteria: [...d.criteria].sort((a,b) => ascii(a.id,b.id)).map(c => ({
    ...c, a: decimal(c.a).toString(), b: decimal(c.b).toString(), importance: decimal(c.importance).toString(),
    cells: Object.fromEntries(d.offers.map(o => { const cell = c.cells[o.id]; return [o.id, cell.kind === 'known' ? { ...cell, value: decimal(cell.value).toString() } : { ...cell, lower: decimal(cell.lower).toString(), upper: decimal(cell.upper).toString() }]; })),
  })) }));
}
export function evaluate(input: unknown): Evaluation {
  const validated = validate(input);
  if (!validated.ok) return validated;
  try {
    const decision = validated.decision, comparison = compare(decision), bounds = attainableBounds(decision, comparison), policy = recommend(bounds);
    const questions=prioritizeQuestions(decision,comparison,bounds);
    if (policy.action==='CONTINUE' && !questions.questions.some(q=>q.relevant)) throw new Error('Unsettled model requires consequential uncertainty');
    return { ok: true, decision, fingerprint: fingerprint(decision), comparison, bounds, policy, ...questions };
  } catch {
    return { ok: false, issues: [{ code: 'ANALYSIS_FAILURE', path: 'decision', message: 'The calculation could not be completed. Review inputs or reload the example.' }] };
  }
}
