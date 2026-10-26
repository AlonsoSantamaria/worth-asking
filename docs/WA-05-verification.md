# WA-05 — Accepted candidate and verification

Date: 2026-10-26. Mission: [issue #1](https://github.com/AlonsoSantamaria/worth-asking/issues/1). Public source baseline: `33c45365adb3f18cacae0cb65bdb1483887e747c`.

## Gate result

**GO for 6-ship preparation of the accepted current candidate.** This is not a claim of Devpost submission, completed video, or complete implementation of every original planned UI/verification item. No application source, mathematical model, fixture, environment, Apache configuration, or VESTA deployment was changed in WA-05.

Alonso was asked to confirm acceptance after the VESTA 5/1 flow and the app-map reference, with the absence of the full MethodDetails panel and the 4096-scenario timing measurement explicitly disclosed. His actual reply was **“adelante”**. This records acceptance of the current submission candidate with those declared limits. It does not invent detailed manual-testing observations, a guided coding session, or a claim that either missing item was implemented/performed.

The original scope/PRD/spec approvals and Diana's separate architecture PASS remain unchanged. There is no new architecture approval claimed. The checklist distinguishes delivered behavior, fresh verification, earlier reported evidence, and this current candidate-acceptance disposition. Original larger per-slice contracts remain visible as historical plans; accepted limitations are not marked as completed tests or features.

## Fresh clean-copy reproduction

The public baseline was exported with `git archive` into a new disposable Windows directory, with no existing `node_modules` or environment files. Node **24.21.0**, npm **11.19.0**, Vite **8.3.5**, Vitest **5.0.5**, Playwright **1.64.1**.

| Command / check | Observed result in WA-05 |
| --- | --- |
| `npm ci` | PASS; 49 packages installed, 50 audited; npm reported 0 vulnerabilities at that run. |
| `npm run typecheck` | PASS. |
| `npm test` | PASS: 6 test files, **68 tests**, 844ms reported duration. |
| `npm run build` | PASS: typecheck and production build; 32 modules, 260ms Vite-reported duration. |
| `npx playwright install chromium` | PASS. Browser setup command used the available browser cache; no fresh browser download is claimed. |
| `npm run test:e2e` | PASS: **9 tests**, 30.8s reported duration. |

Browser checks include the real question/evidence/reversal/STOP path, partial evidence, rejected out-of-domain evidence, invalid-edit recovery, updated offer profiles, independent native desktop resizing and keyboard scrolling, touch-emulated evidence entry, and 1440/390/320px layouts. Physical mobile devices were not tested. No new product test or feature was introduced.

### Reproduced canonical results

| Input state | Scores Northstar / Harbor | Complete A−B gap | Verdict |
| --- | --- | --- | --- |
| Load example | 63 / 53 | [-32, 52] | KEEP INVESTIGATING |
| Top question | Office attendance; modeled VOI 7.50 | Independent robust bounds still apply | Ask the existing office question |
| Office days 5 / 1 | 43 / 65 | [-24, -20] | DECIDE NOW, Harbor |
| Reset; office days 0 / 5 | 83 / 33 | [48, 52] | DECIDE NOW, Northstar |

The fresh browser tests assert these results and updated evidence displays. The current office scale is **0–5**. No 0–6 modification was made. The fixture contains illustrative inputs only; neither UI nor production data encode expected winners/scores.

### Deployed candidate comparison — read only

WA-05 downloaded the existing preview's public files over normally validated HTTPS. All deployed files still match the existing WA-UX-01 release manifest. Fresh clean-build JavaScript and CSS match the deployed files **byte for byte**:

- `assets/index-csK6k3Jo.js`: SHA-256 `ce5775cf6350a5f8f051880de3076e7dc98ff078089540243bcafd167e8c3fd3`.
- `assets/index-C0TZW59y.css`: SHA-256 `87a0ccdf8e618fe0f141b8d5463ee8b7e3f80355cbd41d9c98f742a27c1f9ae2`.

`index.html` and `mark.svg` differ in raw hashes between the clean Windows export/build and deployed release, but are exactly equal after CRLF→LF normalization. **A four-file bit-identical clean build is not claimed.** The executable bundle and styling are identical; this newline difference required no deployment change.

Earlier public HTTPS browser smoke at 1440/390/320px and preview-only rollback evidence belong to WA-UX-01/final-ship verification. They are reused historical evidence, not new WA-05 deployment or rollback operations. WA-05's browser suite was a fresh clean local reproduction; the public-file comparison was fresh and read only.

## Actual PO feedback and disposition

- Earlier WA-UX-01 feedback said small text was difficult to read and requested offer context, independent scroll/resize, persistent score visibility, and narrow-screen usability. Those presentation changes exist in the accepted candidate; the fresh browser tests verify their functional behavior.
- Earlier original engineering commits (`1a83621`, application `549950d`, verification `3abb51d`) belong to the preserved original project history. They are provenance, not commits retroactively inserted into this public repository. Public initial snapshot is `595973c`; sharing-link record is `33c4536`. Public history stays separate and is not rewritten.
- In WA-05 Alonso's reply “adelante” accepts this existing candidate for submission after the disclosed limits and reference map. No additional product changes were requested. No detailed keyboard/tie/mobile manual test transcript is inferred from that reply.
- The original full contribution-by-contribution MethodDetails/exact-detail panel is not implemented. Existing UI does disclose modeled question values/loss, assumed scenario weights, provenance, conditional readiness, and outward-rounded bounds. This narrower delivered UI is accepted for the current candidate; the missing panel is not silently presented as shipped.
- The specified production 5-warm-up/30-run timing protocol through 4096 scenarios was **not performed**. No measured maximum-size performance or timing threshold is claimed. The original extended 360px/200%-zoom/full accessibility audit is also not claimed by the fresh 320/390/1440px suite. These remain declared verification limits, not passing results. WA-05's freeze and submission priority do not authorize implementation/optimization work.

## Brief recap and app map

[The standalone map](../devpost/app-map.html) follows actual symbols: `QuestionCard.submit → applyEvidence → sessionReducer → evaluate`, with independent `compare/attainableBounds/recommend` and `prioritizeQuestions/constructScenarios` branches, then `App`, `OfferCard`, and `UpdateSummary`.

The agent delivered a brief static explanation of this route and the reusable practice of testing both a transition and its opposite. This is recorded as a recap, **not** a completed hands-on coding tour or personal learning testimonial. The map was rendered and visually inspected in a browser with JavaScript disabled, at 1440px and 320px; it had no external requests or horizontal overflow. Relative source/demo links resolve to real files. A map screenshot/reference was made available in the review conversation; opening the editor panel was queued. No claim is made that the learner navigated every linked file.

Optional code editing is **not applicable** under the explicit WA-05 no-product-change scope. Optional reflection was offered; no personal reflection answer or mastery is claimed. The acceptance reply above is a product decision, not a reflection response.

## Public safety and next step

Only reviewed project documentation and this static map are added/updated. No learner profile, credentials, environment files, browser traces, local machine paths, infrastructure inventories, deployment scripts, or original operational Git history are included. The current public snapshot already passed the earlier reachable-history credential-pattern audit; WA-05's additions contain only source references, factual results, and the actual acceptance disposition.

The [demo guide](demo.md) gives the exact existing control sequence and limitations. Continue to `6-ship` for the learner's video, learner-authored submission fields/exit survey, and explicit submission action. Their completion is not claimed here. The VESTA preview remains available; recording/submission should not wait for cosmetic refactoring or undocumented new features.
