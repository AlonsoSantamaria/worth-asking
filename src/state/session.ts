import { evaluate } from '../engine/evaluate';
import type { Decision, Evaluation } from '../engine/types';

export interface Session { draft: Decision | null; current: Evaluation | null; previous: Extract<Evaluation,{ok:true}> | null }
export type Action = { type: 'load'; decision: Decision } | { type: 'edit'; decision: Decision };
export const emptySession: Session = { draft: null, current: null, previous: null };
export function sessionReducer(state: Session, action: Action): Session {
  const current = evaluate(action.decision);
  if (action.type === 'load') return { draft: structuredClone(action.decision), current, previous: null };
  const lastValid = state.current?.ok ? state.current : state.previous;
  return { draft: structuredClone(action.decision), current, previous: lastValid };
}
