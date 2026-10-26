import { useReducer } from 'react';
import { jobOffers } from './data/jobOffers';
import { emptySession, sessionReducer } from './state/session';
import { format, precisionNote } from './engine/format';
import type { Cell } from './engine/types';
import QuestionCard from './components/QuestionCard';
import UpdateSummary from './components/UpdateSummary';
import OfferCard from './components/OfferCard';

export default function App() {
  const [session, dispatch] = useReducer(sessionReducer, emptySession);
  const draft = session.draft, result = session.current;
  function change(index: number, key: 'importance' | 'lower' | 'upper' | 'value', value: string, offerId?: string) {
    if (!draft) return;
    const next = structuredClone(draft);
    if (key === 'importance') next.criteria[index].importance = value;
    else if (offerId) Object.assign(next.criteria[index].cells[offerId], { [key]: value, ...(key === 'value' ? { source: 'user-evidence' } : {}) });
    dispatch({ type: 'edit', decision: next });
  }
  const valueLabel = (cell: Cell) => cell.kind === 'known' ? cell.source === 'user-evidence' ? 'Your evidence' : 'Illustrative evidence' : 'Assumed range · midpoint estimated';
  return <div className="site-shell">
    <header className="topbar"><a className="brand" href="/" aria-label="Worth Asking home"><img src="/mark.svg" alt="" /><span>worth asking<span className="brand-dot">.</span></span></a><span className="topbar-note">A little more clarity.</span><span className="local-badge"><i />Private by design · runs locally</span></header>
    <main>
      <section className="intro"><div><p className="eyebrow">DECISION INTELLIGENCE, MADE HUMAN</p><h1>Good decisions start<br />with <em>better questions.</em></h1><p className="intro-copy">Know what to ask. Know when to stop.</p></div><div className="intro-aside"><span className="orbit-mark" aria-hidden="true">✧</span><p>You don’t need every answer.<br />Just the ones that could change your mind.</p></div></section>
      {!draft ? <section className="welcome panel"><span className="step-number">01 / GET A LITTLE CLARITY</span><h2>Two offers. One next chapter.</h2><p>Compare a realistic pair of job offers. Explore what matters, what’s missing, and when you know enough.</p><button className="primary" onClick={() => dispatch({ type: 'load', decision: jobOffers() })}>Load example decision <span aria-hidden="true">↗</span></button><p className="fine-print">Illustrative data. No sign-in. No external AI connection.</p></section> : <>
        <div className="section-heading"><div><p className="eyebrow">01 / YOUR DECISION</p><h2>{draft.label}<span className="subtle-dot">.</span></h2></div><button className="text-button" onClick={() => dispatch({ type: 'load', decision: jobOffers() })}>↻ Reset example</button></div>
        {result && !result.ok && <section className="error-panel" role="alert"><h3>Cannot evaluate these edits</h3><p>Correct the marked inputs. No current decision advice is available.</p><ul>{result.issues.map((issue,i) => <li key={i}>{issue.path}: {issue.message}</li>)}</ul></section>}
        <div className="offer-grid">{draft.offers.map((offer,index) => <OfferCard key={offer.id} decision={draft} result={result} index={index} />)}</div>
        {result?.ok && <section className="readiness panel" aria-live="polite"><div><p className="eyebrow">02 / DECISION READINESS</p><h3>{result.policy.stability}</h3><p>Provisional preference: <strong>{result.comparison.preferred === 'tie' ? 'Tied' : draft.offers[result.comparison.preferred === 'A' ? 0 : 1].label}</strong></p></div><div className="gap-detail"><span>Possible gap · A minus B</span><strong data-testid="gap-range">[{format(result.bounds.lower,'lower')}, {format(result.bounds.upper,'upper')}]</strong><p>Utility points · outward-rounded bounds</p><p>{precisionNote(result.comparison.gap)}</p></div><p className="readiness-explanation">{result.policy.action === 'CONTINUE' ? 'Missing information can still change the choice or create a tie.' : result.policy.winner ? 'The preference survives every allowed combination of remaining values.' : 'No remaining modeled question can break this tie.'} Stability describes your supplied ranges, not a probability of correctness.</p></section>}
        {result?.ok && session.previous && <UpdateSummary previous={session.previous} current={result} />}
        {result?.ok && result.policy.action === 'CONTINUE' && result.questions.some(q=>q.relevant) && (() => {
          const relevant=result.questions.filter(q=>q.relevant), question=relevant[0];
          return <QuestionCard key={question.id+':'+question.targets.join(',')} question={question} alternatives={relevant.slice(1)} decision={result.decision} onEvidence={decision=>dispatch({type:'edit',decision})} />;
        })()}
        {result?.ok && <section className={`verdict panel ${result.policy.action === 'STOP' ? 'ready' : ''}`}><p className="eyebrow">YOUR NEXT MOVE</p><h2>{result.policy.action === 'CONTINUE' ? 'KEEP INVESTIGATING' : result.policy.winner ? 'DECIDE NOW' : 'Inconclusive'}</h2><p>{result.policy.action === 'CONTINUE' ? 'The choice is still sensitive to unresolved information.' : result.policy.winner ? 'You know enough to make a decision.' : 'The model cannot distinguish these offers.'}</p><small>Under your current criteria, importance, evidence, and independent plausible ranges.</small></section>}
        <section className="criteria-section"><div className="section-heading compact"><div><p className="eyebrow">THE TRADEOFFS</p><h2>What matters to you</h2></div><p className="fine-print">Importance is normalized across criteria.</p></div><div className="criteria-list">{draft.criteria.map((criterion,index) => <article className="criterion-row" key={criterion.id}><div className="criterion-heading"><h3>{criterion.label}</h3><span>{criterion.unit} · {criterion.direction === 'higher' ? 'higher' : 'lower'} is better</span><p>Fixed scale {criterion.a}–{criterion.b}</p></div><label className="weight-control">Importance<input aria-label={`${criterion.label} importance`} inputMode="decimal" value={criterion.importance} onChange={e => change(index,'importance',e.target.value)} /></label>{draft.offers.map(offer => { const cell = criterion.cells[offer.id]; return <div className="cell-inputs" key={offer.id}><span className="cell-offer">{offer.label}</span>{cell.kind === 'known' ? <input aria-label={`${offer.label} ${criterion.label} value`} inputMode="decimal" value={cell.value} onChange={e => change(index,'value',e.target.value,offer.id)} /> : <div className="range-inputs"><input aria-label={`${offer.label} ${criterion.label} lower bound`} inputMode="decimal" value={cell.lower} onChange={e => change(index,'lower',e.target.value,offer.id)} /><span>to</span><input aria-label={`${offer.label} ${criterion.label} upper bound`} inputMode="decimal" value={cell.upper} onChange={e => change(index,'upper',e.target.value,offer.id)} /></div>}<small className={cell.kind === 'unknown' ? 'assumption-label' : ''}>{valueLabel(cell)}</small></div>; })}</article>)}</div></section>

        {session.previous && !result?.ok && <aside className="previous-result">Previous valid evaluation: {format(session.previous.comparison.a)} / {format(session.previous.comparison.b)}. These scores do not evaluate the current edits.</aside>}
      </>}
    </main>
    <footer><span>worth asking<span className="brand-dot">.</span> <span className="footer-tagline">Clarity over certainty.</span></span><p>Developed with AI using the official Devpost Learn Skill Pack.<br />Deterministic engine · no generative AI calls at runtime.</p></footer>
  </div>;
}
