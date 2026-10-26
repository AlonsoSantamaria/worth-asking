import { format } from '../engine/format';
import type { Evaluation } from '../engine/types';
type Success=Extract<Evaluation,{ok:true}>;
export default function UpdateSummary({previous,current}:{previous:Success;current:Success}) {
  const preference=(r:Success)=>r.comparison.preferred==='tie'?'Tied':r.decision.offers[r.comparison.preferred==='A'?0:1].label;
  const reversed=previous.comparison.preferred!=='tie'&&current.comparison.preferred!=='tie'&&previous.comparison.preferred!==current.comparison.preferred;
  return <section className="update-summary panel" aria-live="polite"><p className="eyebrow">WHAT CHANGED</p><h3>{reversed?'New evidence. A different direction.':'Your decision, updated.'}</h3><div className="before-after"><div><span>BEFORE</span><strong>{preference(previous)}</strong><p>{format(previous.comparison.a)} / {format(previous.comparison.b)} utility points</p></div><span className="change-arrow" aria-hidden="true">→</span><div><span>NOW</span><strong>{preference(current)}</strong><p>{format(current.comparison.a)} / {format(current.comparison.b)} utility points</p></div></div><p className="fine-print">{reversed?'The provisional preference reversed after your update.':'The comparison reflects your latest valid evidence and importance.'} Scores are listed as offer A / offer B.</p></section>;
}
