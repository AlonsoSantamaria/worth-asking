---
doc: prd
status: approved
---

# Worth Asking — Product Requirements

**Know what to ask. Know when to stop.**

A small decision-intelligence application for someone choosing between two job offers with incomplete information.

Source: `scope.md > The Unique Kernel`, `Who It's For`, and `The POC Boundary`; supplied WA-01 mission; Diana architecture-review requirements recorded in `../docs/WA-01-architecture-review.md`.

## Review and Approval State
Scope architecture review: PASS. Scope Product Owner approval: approved, as confirmed by the user's administrative correction dated 2026-10-24. This PRD's architecture review: **PASS**, reviewer Diana, dated **2026-10-24**, with no blocking product-scope changes required. This PRD's Product Owner approval: **approved**, explicitly granted in the user's WA-02 mission ("PRODUCT OWNER DECISION: PRD APPROVED"). `status: approved` now records that PO decision separately from architecture review. WA-02 authorized `4-spec`; WA-03 subsequently approved the specification and authorized the build checklist draft. Checklist review and PO approval remain pending before implementation. No requirement expands the current POC boundary. The product-rule proposals below are approved product semantics; their exact technical realization is defined in the now-approved `spec.md`.

## The Core Journey
Source: `scope.md > The Core Loop` and `What "Working" Looks Like`.

1. Open the app locally without login or external credentials and load the labeled example decision.
2. See two job offers, criteria, importance controls, known evidence, and plausible ranges for missing values. See which entries are facts, estimates, or assumptions.
3. Inspect the current comparison, provisional preference or tie, and the stated basis for point estimates of unknown values.
4. Read the decision-readiness state and whether remaining uncertainty can change the choice under the supplied assumptions.
5. See the highest-value unanswered question, its connection to the comparison, and the potential effect of an answer.
6. Enter discovered evidence for the relevant offer or offers. Invalid input leaves the last valid evaluation intact and explains what to correct.
7. See recalculated scores, preference, readiness, next question, and investigation advice, with a clear comparison to the immediately preceding valid evaluation.
8. Continue when unresolved evidence could affect the choice. When a unique preference survives every permitted unresolved value, see "DECIDE NOW" and "You know enough to make a decision," together with the assumptions limiting that conclusion. An unresolved or unavoidable tie receives an honest inconclusive result.

The preferred fixture demonstrates a computed ranking reversal followed by justified DECIDE NOW. A realistic fixture may be chosen for that purpose; outcomes must never be encoded into the recommendation.

## Screens and Layout
Source: WA-01 mission section 4 and `scope.md > Inspiration & Identity`.

One decision workspace contains the five requested sections: **Your Decision**, **Decision Readiness**, **The Question Worth Asking**, **Update Your Evidence**, and **Decide Now / Keep Investigating**. The two-offer comparison supplies context; the next question or justified stopping result receives the strongest emphasis. Evidence entry stays near the selected question, and before/after feedback stays near the updated comparison. On mobile the same journey follows a readable single-column order. No additional dashboard or navigation system is required.

## Look and Feel
WA-UX-01 presentation clarification: each offer card shows only the existing position and criterion inputs in a Characteristic / Value table. Distinguish illustrative evidence, unconfirmed ranges, and fit assessments. Independent bounded scroll regions precede the current engine score; desktop regions resize vertically without changing card widths, while mobile cards stack with touch scrolling. No modal or extra offer button. Evidence updates both the profile and score. This supplies offer context before interpreting the comparison.

English; premium, elegant, clean, modern, and memorable. Use strong hierarchy, readable contrast, accessible controls, few clicks, and a distinct identity from PickyLens. Avoid dashboard overload.

The Product Owner has selected team artwork as a promotional visual reference. WA-02 specifies its visual language: **deep navy, cyan, violet, and subtle gold accents**, with restrained luminous treatment. The artwork is not a mandatory UI layout and introduces no new product features. Its image file/link has not been supplied in this chat; the stated palette and direction are recorded without claiming the artwork has been inspected. Typography and precise accessible color treatments are proposed in `spec.md` for review.

## Features and Behavior

### Your Decision and Evidence
Source: `scope.md > The POC Boundary`.

- **DE-01 — Inputs:** Show exactly two alternatives and multiple criteria. Users can adjust importance and supply known values or bounded plausible ranges for unknown values, with units and preference direction clear.
- **DE-02 — Provenance:** Display facts, estimates, and assumptions distinctly. Example data is labeled illustrative. Resolving uncertainty records entered evidence; the interface does not independently verify an employer's statement.
- **DE-03 — Comparison:** Scores and provisional preference derive from the actual evidence, weights, and disclosed estimation assumptions. Explain score units, criterion contributions, and treatment of unknowns. Weight changes trigger the same complete recalculation as evidence changes.
- **DE-04 — Validity:** Reject missing required data, nonfinite numbers, reversed bounds, negative importance, all-zero importance, and values outside a criterion's valid domain. Do not silently clamp values or treat blank as zero. When valid new evidence lies outside an earlier assumed range, require explicit correction of that assumption before recalculating; explain that the previous advice depended on the earlier range.

### Question Value and Priority
Source: `scope.md > The Unique Kernel`; Diana requirement 1.

- **QV-01 — Relevance:** Missing information alone does not make a valuable question. The explanation must connect an unknown to its weighted effect on the actual offer comparison and whether it can change the preferred choice or resolve an inconclusive choice.
- **QV-02 — Ranking:** Question priority must use a transparent value-of-information calculation tied to decision consequences, not the count of blanks, raw range width, or a fixed criterion order. Show why the top question outranks remaining questions. A zero-importance criterion cannot become the top valuable question merely because its value is missing.
- **QV-03 — Assumptions:** Explain the candidate answers, what the question resolves, what remains unknown afterward, and any assumed scenario weights used to compare answers. Those weights are modeling assumptions, not measured likelihoods. Multiple individually small unknowns may jointly change a choice; relevance must not be dismissed solely because changing one value at a time cannot reverse it.
- **QV-04 — Honest output:** Resolve tied information values reproducibly and disclose the tie. Do not claim one tied question is uniquely best. If missing facts cannot affect the choice under the full permitted uncertainty, say that no further decision-relevant question is needed. If the current model cannot distinguish question values, disclose that limitation rather than fabricate precision.

**Approved approach, formalized in the specification:** use expected reduction in decision loss under explicitly disclosed deterministic answer scenarios to order relevant questions. The technical specification must define decision loss, scenario selection/weights, joint uncertainty treatment, and tie handling precisely. The exact algorithm is now in `spec.md`, approved separately by architecture and the PO in WA-03. Question value is decision benefit; the MVP does not introduce a separate research-cost editor or paid-data workflow.

### Stopping Logic
Source: `scope.md > The Unique Kernel` and `The POC Boundary`; Diana requirement 2.

**Approved product rule:** evaluate the attainable difference between the two total utility scores over all unresolved values allowed by the supplied ranges and constraints. Call it the **score gap**, defined consistently as offer A minus offer B. Show its lowest and highest possible values in the same units as the displayed comparison. Keep supplied known evidence and current importance fixed for this analysis. Full-range analysis must account for combinations of uncertainties, rather than only changing one input at a time.

- **SL-01 — STOP with a preference:** If the entire attainable score-gap interval is strictly positive, A remains preferred; if entirely negative, B remains preferred. Show DECIDE NOW only when such a unique preference is established. Explain that remaining evidence within the modeled assumptions cannot reverse or remove this preference. Missing information may still exist.
- **SL-02 — CONTINUE:** If allowed unresolved values could make either alternative preferred, or could change a tie into a unique preference or a unique preference into a tie, show KEEP INVESTIGATING and explain the influential uncertainty. A zero estimated question value from a limited scenario set must not override full-range evidence that the outcome remains unsettled.
- **SL-03 — Ties and inconclusive results:** A tied point estimate does not establish robust equality. If the gap is identically zero throughout the allowed values, show "Inconclusive — the model cannot distinguish these offers" and "No remaining modeled question can break this tie." This is STOP with an inconclusive outcome, never DECIDE NOW for an invented winner. A fully known tie receives the same honest outcome. If the gap merely touches zero, treat uniqueness as unsettled and explain the boundary case.
- **SL-04 — Conditional advice:** Every stopping explanation states that it applies to the current criteria, importance, evidence, plausible ranges, and any constraints. New evidence, revised ranges, or revised importance invalidates the old recommendation and triggers recalculation. No unconditional claim of a correct life decision.
- **SL-05 — No unsupported verdict:** Invalid inputs or unavailable full-range evaluation produce a clear "Cannot evaluate" state, never a default STOP, default winner, or made-up score. Numerical equality/rounding policy must be documented in the specification and applied consistently to displayed scores, tests, and verdicts.

This conservative stopping rule operationalizes the existing mission's question of whether more investigation is worthwhile: stop when additional modeled evidence cannot change the choice. It does not claim that every potentially useful question is worth every real-world research cost.

### Decision Readiness
Source: `scope.md > The POC Boundary`; Diana requirement 3.

**Approved indicator definition:** decision readiness measures **whether the modeled preference remains unique across the full supplied uncertainty set**. It is a categorical stability result backed by the attainable score-gap interval, not a completion rate or probability.

- **DR-01 — Defined states:** "Stable preference" means a unique winner survives the full allowed range; "Unsettled" means an allowed change could reverse the winner or create/break a tie; "Indistinguishable" means the gap is zero throughout; "Cannot evaluate" means inputs or analysis are insufficient. Map these directly to SL-01 through SL-05. A provisional tie may be Unsettled rather than Indistinguishable.
- **DR-02 — Evidence:** Display the current score gap and its attainable lower/upper bounds, with a short explanation of which supplied assumptions those bounds cover. Explain how importance and uncertainty affect the result. Do not replace this with a percentage of fields answered, sampled wins, or an arbitrary confidence meter.
- **DR-03 — Interpretation:** Never label readiness as a statistical probability of correctness, a calibrated confidence level, or a chance that an offer is objectively best. Robustness to supplied ranges cannot establish that those ranges or personal preferences are true.
- **DR-04 — Reproducibility:** Identical inputs and assumptions yield identical scores, range bounds, priority order, and readiness/verdict. Explain the method in accessible language; neither the indicator nor its explanation depends on a live model call.

### Update Your Evidence and Compare
Source: `scope.md > The Core Loop` and `What "Working" Looks Like`.

- **UP-01:** The user can answer the selected question for its relevant offer or offers. A partial answer resolves only supplied values and preserves other unknowns. Do not fabricate the other offer's answer.
- **UP-02:** After a valid update, all evaluation outputs refresh together from the same current inputs. Show previous and current scores/preferences and explain whether the result changed, including when it stayed the same. This comparison requires only the immediately preceding valid state, not a new history feature.
- **UP-03:** Weight changes and evidence changes both update question value, attainable score-gap bounds, readiness, and STOP / CONTINUE. Previously answered questions cease to be unanswered. Keep the example reload action available for repeating the demonstration.

## States and Boundaries

| State | User-visible behavior |
| --- | --- |
| First use | An explicit action loads the labeled two-offer example; no live recommendation is implied before valid decision data exists. |
| Valid, uncertain decision | Show provisional comparison, relevant question, attainable gap, and conditional advice. |
| Invalid edit | Identify the affected field and correction; mark current edits as unevaluated. Any last valid result is visibly labeled as previous and must not appear to evaluate the invalid inputs. |
| Tied current estimate | Say the estimate is tied; use full-range analysis to distinguish Unsettled from Indistinguishable. |
| Stable preference with unknowns | DECIDE NOW is allowed with an explanation that remaining modeled unknowns cannot change the unique preference. |
| No unknowns | Give the calculated unique preference or an honest tied outcome; do not recommend a nonexistent question. |
| Jointly consequential unknowns | Continue when their permitted combination can change the result, even if individual changes cannot. |
| Invalid or incomplete assumptions | Cannot evaluate; explain missing/correctable assumptions and withhold current advice. |

No cross-session saving, accounts, collaboration, or evidence-verification service is required. Session/reload behavior must be disclosed in demo instructions; no new persistence feature is implied.

## Product Decisions

- Supplied mission: exactly two job offers; English, responsive, polished interface; several unknowns including office attendance; explicit scoring, evidence updates, question ranking, and stopping rationale.
- Supplied mission: all outcomes calculated; local demo without mandatory login, paid service, or credentials; independent repository; no PickyLens proprietary reuse.
- Diana review: distinguish decision-relevant uncertainty, test stopping against plausible-range sensitivity, and precisely define readiness without arbitrary confidence percentages.
- Review-state correction (2026-10-24): scope PO approval was explicitly confirmed by the user and is recorded separately from scope architecture PASS. Diana's PRD architecture PASS is also recorded separately. The subsequent WA-02 mission explicitly grants PRD PO approval and authorizes the technical specification only.
- Product Owner visual selection, updated by WA-02: deep navy, cyan, violet, subtle gold accents, and restrained luminous treatment from the selected team artwork; promotional visual reference only, not a prescribed UI layout.
- Product semantics initially offered as agent proposals and now approved through the explicit PRD PO decision: categorical readiness, attainable-gap stopping, and scenario-based decision-loss question ranking. This does not imply approval of the specification's exact algorithm before its review.

## Requirements for the Future Technical Specification
Source: Diana's PRD architecture review, 2026-10-24. This section records requirements for the technical specification, now authorized by WA-02; it is not implementation authorization.

1. **Information value:** define the exact question-prioritization method. If scenario-weighted decision loss is used, document scenario construction, scenario weights, loss calculation, and deterministic tie handling. Represent weights as modeling assumptions, never empirically measured probabilities. Cross-reference QV-01 through QV-04.
2. **Robust stopping:** calculate attainable score-gap bounds over the complete allowed uncertainty set, including combined unknowns. Limited scenario sampling must never justify robust STOP. Document numerical precision and equality handling. Cross-reference SL-01 through SL-05 and DR-01 through DR-04.
3. **Visual identity:** translate the PO-selected deep navy/cyan/violet palette, WA-02's subtle gold accents, and restrained luminous treatment into accessible styling, maintaining a distinct identity from PickyLens. Treat the team artwork as a promotional reference, not a mandatory UI layout. Preserve the current MVP boundary.

## What We're Building
The single core journey and requirements DE-01–04, QV-01–04, SL-01–05, DR-01–04, and UP-01–03, within the current scope. Delivery includes source, meaningful automated tests, README, license, official planning artifacts, and demo instructions after required planning approvals.

## Acceptance and Demonstration

1. Load a deterministic illustrative decision with two offers and several unknowns, including office attendance; inspect genuine calculated scores and explicit assumptions.
2. Verify a wide-range unknown with zero importance does not outrank a question that can affect the choice. Verify changing importance can alter question ranking without editing a hardcoded result.
3. Verify a point-estimate leader can reverse under allowed values, triggering Unsettled and CONTINUE. Cover a case where only multiple unknowns acting together can change the result.
4. Enter evidence; verify only targeted unknowns resolve, the comparison updates, and the old/current outcomes remain distinguishable.
5. For the preferred realistic demo fixture, verify evidence produces an actual ranking reversal and then a strict full-range preference, yielding Stable preference and DECIDE NOW. Select fixture data honestly if needed; never force engine outputs.
6. Verify remaining blanks with no ability to affect the preference do not prevent STOP. Verify an interval crossing or touching a tie boundary does prevent an unsupported unique-winner STOP.
7. Verify a provisional tie with unresolved preference-changing uncertainty, an unavoidable tie, and a fully known tie receive the distinct outcomes defined above.
8. Verify missing/invalid values, reversed ranges, zero-total importance, partial answers, and evidence outside previous assumptions follow the documented validation behavior.
9. Repeat identical inputs and updates: scores, ranges, question order, and advice match. Display precision must not contradict verdicts.
10. Verify readiness explains stability and shows no arbitrary confidence percentages or statistical-correctness claims. Review the same complete flow on desktop and mobile, with keyboard access, labeled controls, visible focus, and readable contrast.

These are required future verification cases, not tests already run. There is no application implementation in this delivery.

## Deferred From the POC
Submission video follows working-app validation. Public repository publication and final learner-authored Devpost responses belong to shipping. Deployment is optional; VESTA requires explicit GO.

## Possible Later Enhancements
Optional AI assistance may improve explanation wording later, provided it accurately discloses model use and leaves the deterministic decision engine functional without external calls. It is not part of this PRD's acceptance criteria.

## Non-Goals
No extra alternatives or general-purpose decision platform; no new dashboards, persistent decision history, accounts, collaboration, database, mandatory external API, or research-cost workflow. No proprietary PickyLens reuse. No fabricated live AI or hardcoded demo recommendations. No promise that a stable model preference proves a real-world decision is correct.

## Open Questions

- **Resolved by WA-02:** explicit PRD PO approval is recorded separately from architecture PASS; `4-spec` is authorized.
- **Resolved by WA-03:** the technical plan, including its typography and accessible color treatments, has PO approval following architecture PASS; validate the actual implementation against those targets. The artwork itself is not yet attached; this is not an additional approval gate.
- **Resolved in the approved specification:** normalization, unknown point estimates, exact information-value calculation and scenario assumptions, attainable-bound calculation and supported constraints, numerical equality policy, and deterministic question-tie resolution are defined. These must implement the approved product semantics; any change to semantics returns for review.
- **Design arithmetic verified:** the fixture has been calculated and independently verified by Diana; future engine tests must reproduce its reversal-then-stop results. No implemented application test pass is claimed.
