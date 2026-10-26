import type { Decision, Evaluation } from '../engine/types';
import { format } from '../engine/format';

/** Presentation of current inputs only; scores and policy come from the engine. */
export default function OfferCard({ decision, result, index }: { decision: Decision; result: Evaluation | null; index: number }) {
  const offer = decision.offers[index];
  const score = result?.ok ? (index === 0 ? result.comparison.a : result.comparison.b) : null;
  const hasEstimates = decision.criteria.some(c => c.cells[offer.id].kind === 'unknown');
  return <section className={`offer-card panel offer-${index}`} aria-labelledby={`offer-${offer.id}`}>
    <div className="offer-topline"><span className="offer-icon" aria-hidden="true">{offer.label[0]}</span><span className="pill">OFFER {index === 0 ? 'A' : 'B'}</span></div>
    <h3 id={`offer-${offer.id}`}>{offer.label}</h3>
    <p className="offer-detail-hint" id={`hint-${offer.id}`}>Scroll details when needed. On desktop, drag the bottom-right corner to resize.</p>
    <div className="offer-details" role="region" aria-label={`${offer.label} offer information`} aria-describedby={`hint-${offer.id}`} tabIndex={0}>
      <table><thead><tr><th scope="col">Characteristic</th><th scope="col">Value</th></tr></thead><tbody>
        <tr><th scope="row">Position</th><td>{offer.role}<small>Illustrative offer</small></td></tr>
        {decision.criteria.map(c => {
          const cell = c.cells[offer.id];
          const assessment = c.id === 'growth';
          return <tr key={c.id}><th scope="row">{c.label}</th><td>
            {cell.kind === 'known' ? <>{cell.value} <span className="offer-unit">{c.unit}</span><small>{assessment ? 'Fit assessment · ' : ''}{cell.source === 'user-evidence' ? 'Your evidence' : 'Illustrative input'}</small></> : <><strong className="unknown-value">Not yet confirmed</strong><small className="offer-assumption">{assessment ? 'Assumed fit range' : 'Assumed range'}: {cell.lower}–{cell.upper} {c.unit}</small></>}
          </td></tr>;
        })}
      </tbody></table>
    </div>
    <div className="offer-score" aria-live="polite"><p className="score-label">Current weighted score</p><div className="score"><strong data-testid={`score-${index}`}>{score ? format(score) : '—'}</strong><span>utility points / 100</span></div>
      <div className="score-track"><i style={{ width: score ? `${Number(score.n) / Number(score.d)}%` : '0%' }} /></div>
      <p className="fine-print">{!result?.ok ? 'Correct the inputs to calculate a current score.' : hasEstimates ? 'Based on your importance settings. Unconfirmed values use assumed-range midpoints.' : 'Based on current evidence and your importance settings.'} This is a preference score, not an employer fact or a confidence percentage.</p>
    </div>
  </section>;
}
