import { decimal, ZERO, HUNDRED, sum } from './rational';
import type { Decision, Issue, Validation } from './types';

const object = (x: unknown): x is Record<string, unknown> => x !== null && typeof x === 'object' && !Array.isArray(x);
export function validate(input: unknown): Validation {
  const issues: Issue[] = [];
  const error = (code: string, path: string, message: string) => issues.push({ code, path, message });
  const text = (v: unknown, path: string) => {
    if (typeof v !== 'string' || !v.trim() || v.length > 300) error('INCOMPLETE_INPUT', path, 'Enter a nonempty label of at most 300 characters.');
  };
  const id = (v: unknown, path: string) => { if (typeof v !== 'string' || !/^[A-Za-z][A-Za-z0-9_-]{0,39}$/.test(v)) error('INVALID_STRUCTURE', path, 'Use a unique ASCII identifier.'); };
  const numeric = (v: unknown, path: string) => {
    if (typeof v !== 'string' || !v.trim()) { error('INCOMPLETE_INPUT', path, 'Enter a number; blanks do not mean zero.'); return null; }
    try { return decimal(v); } catch (e) { error('INVALID_NUMBER', path, (e as Error).message); return null; }
  };
  const keys = (obj: Record<string, unknown>, allowed: string[], path: string) => {
    for (const key of Object.keys(obj)) if (!allowed.includes(key)) error('UNSUPPORTED_MODEL', `${path}.${key}`, 'This model supports independent ranges and the documented input fields only.');
  };
  if (!object(input)) return { ok: false, issues: [{ code: 'INVALID_STRUCTURE', path: 'decision', message: 'Supply a complete decision.' }] };
  keys(input, ['id','label','modelVersion','uncertaintyModel','offers','criteria'], 'decision');
  id(input.id, 'id'); text(input.label, 'label'); text(input.modelVersion, 'modelVersion');
  if (input.uncertaintyModel !== 'independent-box') error('UNSUPPORTED_MODEL', 'uncertaintyModel', 'Only independent continuous plausible ranges are supported.');
  const offers = Array.isArray(input.offers) ? input.offers : [];
  if (offers.length !== 2) error('INVALID_STRUCTURE', 'offers', 'Exactly two offers are required.');
  const offerIds: string[] = [];
  for (const [i, offer] of offers.entries()) {
    if (!object(offer)) { error('INVALID_STRUCTURE', `offers.${i}`, 'Incomplete offer.'); continue; }
    keys(offer, ['id','label','role'], `offers.${i}`);
    id(offer.id, `offers.${i}.id`); text(offer.label, `offers.${i}.label`); text(offer.role, `offers.${i}.role`);
    if (typeof offer.id === 'string') offerIds.push(offer.id);
  }
  if (new Set(offerIds).size !== offerIds.length) error('INVALID_STRUCTURE', 'offers', 'Offer IDs must be unique.');
  const rows = Array.isArray(input.criteria) ? input.criteria : [];
  if (rows.length < 2 || rows.length > 6) error('INVALID_STRUCTURE', 'criteria', 'Supply 2–6 criteria.');
  const seen = new Set<string>(), weights = [];
  for (const [i, c] of rows.entries()) {
    const path = `criteria.${i}`;
    if (!object(c)) { error('INVALID_STRUCTURE', path, 'Incomplete criterion.'); continue; }
    keys(c, ['id','label','unit','direction','a','b','importance','question','cells'], path);
    id(c.id, `${path}.id`); text(c.label, `${path}.label`); text(c.unit, `${path}.unit`); text(c.question, `${path}.question`);
    if (typeof c.id === 'string') { if (seen.has(c.id)) error('INVALID_STRUCTURE', `${path}.id`, 'Criterion IDs must be unique.'); seen.add(c.id); }
    if (c.direction !== 'higher' && c.direction !== 'lower') error('INVALID_STRUCTURE', `${path}.direction`, 'Choose higher or lower utility direction.');
    const a = numeric(c.a, `${path}.a`), b = numeric(c.b, `${path}.b`), weight = numeric(c.importance, `${path}.importance`);
    if (a && b && a.cmp(b) >= 0) error('INVALID_RANGE', path, 'Fixed normalization anchors must increase.');
    if (weight) { weights.push(weight); if (weight.cmp(ZERO) < 0 || weight.cmp(HUNDRED) > 0) error('INVALID_WEIGHT', `${path}.importance`, 'Importance must be between 0 and 100.'); }
    if (!object(c.cells)) { error('INCOMPLETE_INPUT', `${path}.cells`, 'Supply both offer values.'); continue; }
    if (Object.keys(c.cells).length !== 2 || Object.keys(c.cells).some(k => !offerIds.includes(k))) error('INVALID_STRUCTURE', `${path}.cells`, 'Supply exactly one cell for each offer.');
    for (const oid of offerIds) {
      const cell = c.cells[oid], cp = `${path}.cells.${oid}`;
      if (!object(cell)) { error('INCOMPLETE_INPUT', cp, 'Enter evidence or both plausible bounds.'); continue; }
      const known = cell.kind === 'known', unknown = cell.kind === 'unknown';
      if (!known && !unknown) { error('INVALID_STRUCTURE', cp, 'Choose known or unknown.'); continue; }
      keys(cell, known ? ['kind','value','source','note'] : ['kind','lower','upper','source','note'], cp);
      if (cell.note !== undefined) text(cell.note, `${cp}.note`);
      if ((known && !['user-evidence','example-evidence'].includes(String(cell.source))) || (unknown && cell.source !== 'assumption')) error('INVALID_STRUCTURE', cp, 'Provide the documented evidence/assumption source.');
      const values = known ? [numeric(cell.value, `${cp}.value`)] : [numeric(cell.lower, `${cp}.lower`), numeric(cell.upper, `${cp}.upper`)];
      if (unknown && values[0] && values[1] && values[0].cmp(values[1]) > 0) error('INVALID_RANGE', cp, 'Lower bound must not exceed upper bound.');
      for (const v of values) if (v && a && b && (v.cmp(a) < 0 || v.cmp(b) > 0)) error('OUT_OF_DOMAIN', cp, 'Value must stay inside the fixed criterion anchors.');
    }
  }
  if (weights.length === rows.length && sum(weights).cmp(ZERO) === 0) error('ZERO_TOTAL_WEIGHT', 'criteria', 'Give at least one criterion positive importance.');
  return issues.length ? { ok: false, issues } : { ok: true, decision: structuredClone(input) as unknown as Decision };
}
