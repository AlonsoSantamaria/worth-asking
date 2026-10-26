---
doc: scope
status: approved
---

# Worth Asking

Know what to ask. Know when to stop.

A small decision-intelligence web application that identifies the missing information most likely to affect a choice and explains when further investigation is no longer worthwhile.

## The Unique Kernel
Connect the next question to its actual effect on a decision, then offer an explainable stop/continue recommendation. Both the question and stopping advice must arise from a transparent, testable model.

## Who It's For
A person choosing between two job offers with competing advantages and incomplete information, such as required office attendance. Today they must compare those tradeoffs and decide what to ask employers themselves.

## The Core Loop
Load the example decision → compare both offers using adjustable criterion importance and explicit known/unknown inputs → inspect the highest-value unanswered question and its explanation → enter discovered evidence → compare the updated evaluation → investigate again or decide.

## Inspiration & Identity
English interface; elegant, polished, memorable, clean and modern. Strong hierarchy, readable contrast, accessible controls, few clicks, desktop and mobile support. A distinct visual identity from PickyLens; avoid dashboard overload. The Product Owner's WA-02 visual direction is deep navy, cyan, violet, and subtle gold accents with restrained luminous treatment, drawing on the selected team artwork as a promotional visual reference rather than a mandatory UI layout. Typography is proposed in the technical plan for review.

## Why This Matters to the Learner
The mission prioritizes a "COMPLETE, WORKING, WELL-PRESENTED submission" for a second, independent Build With AI: Basics entry. Worth Asking must have its own repository, planning, code, tests, and submission materials.

## What "Working" Looks Like
A judge runs the app locally without credentials, loads a realistic two-offer example, sees a calculated comparison, receives the most valuable question with a reason, enters an answer, and sees recalculated scores and justified stop/continue advice.

The preferred demonstration is an actual ranking reversal after office-attendance evidence followed by "DECIDE NOW" / "You know enough to make a decision." The fixture may be selected to demonstrate this; the engine must compute the outcomes rather than encode them. Ties and inconclusive cases remain honest.

## The POC Boundary
- Exactly two alternatives and multiple decision criteria, with adjustable importance.
- Known values, unknown values, plausible ranges, and clear fact/assumption/estimate labels.
- Comparative scoring, influential uncertainty, ranked questions, evidence updates, and explained stopping logic.
- An explained stability/readiness indicator, never an uncalibrated probability of being correct.
- One complete example journey with an easy-to-read before/after comparison.
- Lightweight local web app, modular deterministic engine, automated tests, and responsive UI.
- Independent source repository, README, open-source license, official planning artifacts, and demo/testing instructions.

## Later
- Optional AI explanation assistance, with accurate disclosure of what uses a model.
- Submission video after application validation.
- Learner-written Devpost responses and public GitHub publication during shipping.
- Optional deployment; VESTA requires explicit GO.

## Explicitly Cut
- PickyLens source reuse or modifications: this submission is independent.
- General-purpose decision platform and more than two alternatives: unnecessary for proving the kernel.
- Mandatory accounts, database, paid services, or API keys: judges must run the core journey locally.
- Hardcoded questions, reversals, readiness percentages, or final advice: they invalidate the model demonstration.
- Opaque model-generated scoring or fabricated live AI: the core must be transparent and reproducible.

## Review State
**Product Owner approval: granted**, as explicitly confirmed by the user's administrative correction in the PRD architecture-review checkpoint dated 2026-10-24. That correction states the PO approved this scope in the previous checkpoint; this document now correctly records `status: approved`. The exact earlier approval time is not independently recorded here.

**Architecture approval: SCOPE PASS**, recorded separately from PO approval, with the existing POC boundary retained. WA-02 also explicitly grants PRD PO approval, separately from its recorded architecture PASS, and authorizes `4-spec`. WA-03 subsequently grants separate PO specification approval. Implementation remains gated by the build checklist review and PO approval. See `docs/WA-01-architecture-review.md` and `docs/WA-02-review-record.md`.
