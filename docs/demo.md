# Reproduce the existing demonstration

Use the [VESTA preview](https://worthasking.neovantia.live/); acceptance does not require a local server. This is a deterministic browser application developed with AI using the official Devpost Learn Skill Pack. It makes no generative-AI calls at runtime.

1. Open the page and select **Load example decision**. The Northstar and Harbor cards show the existing Product Analyst fixture: salaries, office attendance, growth-fit assessments, and paid leave. Unknown values are labeled **Not yet confirmed** with assumed ranges. Scores are **63.00 / 53.00**, full A−B gap **[-32.00, 52.00]**, and **KEEP INVESTIGATING**.
2. Read **The Question Worth Asking**: mandatory office days for each offer. The modeled information value is **7.50**. Expand **Why this question comes next** to see comparative question values and modeled loss. Scenario weights are assumptions, not measured probabilities.
3. In **Found the answer?**, enter **Northstar answer = 5** and **Harbor answer = 1**, then select **Update decision**. Scores become **43.00 / 65.00**; the full gap becomes **[-24.00, -20.00]**. The before/after summary shows the preference change from Northstar to Harbor and the verdict becomes **DECIDE NOW**. Remaining growth/leave uncertainty stays visible; all its allowed combinations preserve Harbor's preference.
4. For an optional counterexample, select **↻ Reset example**, enter **Northstar = 0**, **Harbor = 5**, and update. Scores become **83.00 / 33.00**, full gap **[48.00, 52.00]**, with **DECIDE NOW** for Northstar. These outputs are calculated, not predetermined UI results.

## Existing controls and limits

- Reset restores the illustrative fixture, clears entered evidence and the one-step before/after summary, and returns to 63/53. Reload clears the in-memory session and returns to **Load example decision**; there is no persistence or saved history.
- A blank answer remains unknown; provide at least one answer. A value outside 0–5 office days is rejected. The supported model uses continuous decimal inputs, not an integer-only attendance rule; WA-05 does not change it to 0–6.
- If evidence is outside an earlier assumed range but inside the criterion domain, explicitly correct that range under **What matters to you**, then apply the answer again. No silent range widening. Invalid edits withhold current advice and identify the previous valid result where available.
- Preference importance is editable in the existing controls. It is not a fact about an employer. Growth-fit ratings are assessments; the entire fixture is illustrative, not an actual offer.
- Scores use exact rational calculations, with rounded presentation. Full independent-range bounds determine STOP separately from endpoint-scenario question value. Stability is conditional on the criteria, importance, evidence, and ranges; it is not statistical confidence or a guarantee of real-world correctness.
- Exactly two offers, 2–6 criteria, independent continuous ranges, at most 12 nondegenerate unknown cells / 4096 endpoint worlds. No correlation model, external research, runtime LLM, or new scenario-builder flow.
- On desktop, offer profiles have independent scroll areas with native vertical resize handles; scores are outside them. On mobile, cards stack and resizing is disabled. Keyboard focus permits scrolling. Mobile verification uses emulation, not a physical-device certification.
- The UI includes question-value/loss disclosures and conditional advice. It does not have the originally planned full contribution-by-contribution MethodDetails panel. Do not demonstrate or claim that panel exists.

## Local judge reproduction

Node.js 24.x and npm are required. Run in the repository:

```sh
npm ci
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

For development, run `npm run dev -- --host 127.0.0.1 --port 5173 --strictPort` and open `http://127.0.0.1:5173/`. For the production build, run `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort` and open `http://127.0.0.1:4173/`.

See [WA-05 verification](WA-05-verification.md) for the actual fresh/reused evidence and [the app map](../devpost/app-map.html) for the code route. The video, narration, Devpost answers, exit survey, and submission are separate human tasks; their completion is not inferred from this guide.
