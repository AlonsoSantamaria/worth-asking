import type { Rational } from './rational';

export type Cell =
  | { kind: 'known'; value: string; source: 'user-evidence' | 'example-evidence'; note?: string }
  | { kind: 'unknown'; lower: string; upper: string; source: 'assumption'; note?: string };
export interface Offer { id: string; label: string; role: string }
export interface Criterion {
  id: string; label: string; unit: string; direction: 'higher' | 'lower';
  a: string; b: string; importance: string; question: string; cells: Record<string, Cell>;
}
export interface Decision {
  id: string; label: string; modelVersion: string; uncertaintyModel: 'independent-box';
  offers: [Offer, Offer]; criteria: Criterion[];
}
export interface Issue { code: string; path: string; message: string }
export type Validation = { ok: true; decision: Decision } | { ok: false; issues: Issue[] };
export interface Interval { lower: Rational; upper: Rational }
export interface Contribution {
  id: string; weight: Rational; a: Rational; b: Rational; gap: Rational; bounds: Interval;
}
export interface Comparison {
  a: Rational; b: Rational; gap: Rational; preferred: 'A' | 'B' | 'tie'; contributions: Contribution[];
}
export interface Bounds extends Interval { lowerWitness: Record<string, string>; upperWitness: Record<string, string> }
export interface Policy {
  stability: 'Stable preference' | 'Unsettled' | 'Indistinguishable';
  action: 'STOP' | 'CONTINUE'; winner: 'A' | 'B' | null;
}
export interface ConditionalAnswer { answers: Record<string, string>; mass: Rational; meanA: Rational; meanB: Rational; choice: 'A' | 'B' }
export interface Question {
  id: string; text: string; targets: string[]; relevant: boolean; baselineLoss: Rational;
  residualLoss: Rational; value: Rational; rank: number; tied: boolean; outcomes: ConditionalAnswer[];
}
export type Evaluation = { ok: false; issues: Issue[] } | {
  ok: true; decision: Decision; fingerprint: string; comparison: Comparison; bounds: Bounds; policy: Policy;
  questions: Question[]; scenarioCount: number; baselineLoss: Rational;
};
export const ascii = (a: string, b: string) => a < b ? -1 : a > b ? 1 : 0;
