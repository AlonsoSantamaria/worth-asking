import { describe, expect, it } from 'vitest';
import { decimal as q, Rational, ZERO } from '../rational';
import { format, precisionNote } from '../format';

describe('exact arithmetic and presentation', () => {
  it('preserves decimal identity without binary floating point', () => expect(q('0.10').add(q('0.2')).toString()).toBe(q('0.30').toString()));
  it('reduces fractions and normalizes signs', () => {
    expect(new Rational(6n,-8n).toString()).toBe('-3/4');
    expect(q('-0.00').toString()).toBe('0');
    expect(q(' 0001.20 ').toString()).toBe('6/5');
    expect(q('3').div(q('4')).mul(q('8')).sub(q('2')).toString()).toBe('4');
    expect(q('-1').cmp(ZERO)).toBe(-1);
    expect(() => ZERO.div(ZERO)).toThrow();
  });
  it.each(['','1e2','1,000','NaN','Infinity','1.234','+2','.5','2.','1000000001','1'.repeat(33)])('rejects invalid exact decimal %s', x => expect(() => q(x)).toThrow());
  it('rounds halves away from zero and bounds outward', () => {
    const tiny = new Rational(1n,1000n), half = new Rational(125n,1000n);
    expect(format(half)).toBe('0.13'); expect(format(half.neg())).toBe('-0.13');
    expect(format(tiny,'lower')).toBe('0.00'); expect(format(tiny,'upper')).toBe('0.01');
    expect(format(tiny.neg(),'lower')).toBe('-0.01'); expect(format(tiny.neg(),'upper')).toBe('0.00');
    expect(precisionNote(tiny)).toContain('Positive'); expect(precisionNote(tiny.neg())).toContain('Negative');
    expect(precisionNote(ZERO)).toBe('');
  });
});
