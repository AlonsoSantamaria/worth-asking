# Worth Asking

Know what to ask. Know when to stop.

Compare two illustrative job offers, identify decision-relevant missing information, enter evidence, and see whether remaining uncertainty can reverse the preferred offer. React, TypeScript, and Vite; deterministic exact-rational engine. No credentials, accounts, database, or runtime generative AI connection.

## Try the preview

https://worthasking.neovantia.live/

Choose **Load example decision**. Initial scores are Northstar 63 / Harbor 53, with KEEP INVESTIGATING. The highest-value question concerns office attendance (modeled information value 7.50). Enter Northstar **5** and Harbor **1** days/week, then **Update decision**: scores become 43 / 65 and the full gap interval is [-24, -20], giving DECIDE NOW for Harbor. These are computed regression examples, not hardcoded results. The office scale remains 0–5.

The fixture is synthetic. Unknowns use explicit plausible ranges; point scores use their midpoints. Fit ratings are preference assessments. Question weights describe modeling assumptions, not measured probabilities. STOP uses independent full-range bounds and considers combined uncertainties. Stability is conditional on the supplied assumptions and is not a probability of correctness. Edits are kept in browser memory and clear on reload.

## Run and verify

Requires Node.js 24.x and npm.

```sh
npm ci
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open http://127.0.0.1:5173/.

```sh
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The tested candidate has 68 unit tests and 9 browser tests, including canonical reversals, invalid evidence, independent desktop resizing, keyboard scrolling, mobile touch emulation, and 320/390px layouts. Public preview smoke checks passed in Google Chrome at 1440, 390, and 320px. Mobile checks are emulated, not physical-device certification.

## Planning and development

- [Scope](devpost/scope.md)
- [Product requirements](devpost/prd.md)
- [Technical specification](devpost/spec.md)
- [Build checklist and recorded progress](devpost/checklist.md)
- [Fixture mathematics](docs/WA-02-fixture-check.md)

Developed **with AI using the official Devpost Learn Skill Pack** from https://github.com/challengepost/learn-ai-basics. Installed skills 1-start through 6-ship and their lock file are included. The runtime application makes no generative AI calls. Planning approvals remain separate from build completion: the recorded checklist, hands-on review, and learning/app-map completion must be reconciled before claiming the Skill Pack workflow is complete.

This publication candidate preserves the application source tested in the VESTA preview (application commit 549950d7caa8a0161a5fbee3334589c7cde2f3ff). It deliberately excludes operational deployment scripts, server inventories, private learner context, local artifacts, and the original operational Git history. Public repository: https://github.com/AlonsoSantamaria/worth-asking. A demo video and the learner's own Devpost answers remain separate submission tasks.

## License

MIT. See [LICENSE](LICENSE).
