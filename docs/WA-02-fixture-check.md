# WA-02 — Exact numerical fixture design check

This worksheet records a temporary arithmetic check performed while drafting the technical specification. It does not claim a working app or passing engine tests. Future implementation must reproduce these outputs from fixture inputs through its production engine.

## Method

Python standard-library `fractions.Fraction` supplied exact rational arithmetic; `itertools.product` enumerated all 16 combinations of the four nondegenerate endpoint-model unknown cells: office A, office B, growth A, leave B. Salary in the temporary worksheet was expressed in thousands of USD (anchors 80–120, values110/100), which gives exactly the same normalization as the specification's USD values80,000–120,000 and110,000/100,000. Scores used weights40/40/15/5 and the fixed normalization rules in `devpost/spec.md`.

World regret was `max(scoreA, scoreB) - scoreChosen`. For each criterion question, worlds were partitioned by its revealed endpoint answer tuple, the offer with highest conditional mean utility was chosen, and residual loss was averaged over the original equally weighted worlds. These endpoint weights are declared modeling assumptions; they are not measured probabilities.

## Observed exact outputs

```text
INITIAL 63 53 GAP 10 BOUNDS -32 52 BASE_LOSS 15/2
QUESTION office VOI 15/2 POST_LOSS 0
QUESTION growth VOI 0 POST_LOSS 15/2
QUESTION leave VOI 0 POST_LOSS 15/2
AFTER 43 65 GAP -22 BOUNDS -24 -20
COMBINED gap=3+x+y; x,y in [-2,2]: midpoint=3, individual minima=1, joint bounds=[-1,7]
```

After evidence, office A=5 and B=1; the four remaining growth/leave endpoint combinations were enumerated. B=1 is an interior allowed answer and was fixed as evidence, not looked up in the previous hypothetical scenario set.

## Full-range interpretation

The listed fixture endpoint extrema match the analytic affine independent-box bounds in the specification. That proof, rather than a scenario win count or frequency, justifies the full-range conclusion:

- Before evidence: fixed salary gap10 plus office[−40,40], growth[−1.5,1.5], leave[−0.5,0.5] → [−32,52]. CONTINUE.
- After evidence: fixed salary10 plus office−32 plus growth[−1.5,1.5] and leave[−0.5,0.5] → [−24,−20]. Strictly negative throughout → B / STOP / DECIDE NOW.

## Future verification boundaries

Diana's supplied WA-02 technical-specification review, dated 2026-10-24, independently confirms initial A=63/B=53, gap+10, full interval[−32,+52], office/growth/leave VOIs7.5/0/0, and post-evidence A=43/B=65, gap−22, full interval[−24,−20], yielding stable B and DECIDE NOW. This is a separately attributed review of the mathematics.

The temporary worksheet did not test the future TypeScript rational module, validation, analytical relevance implementation, UI, accessibility, responsive layout, or package compatibility. Those remain explicit acceptance cases in the specification. Production fixture data will store no desired winner, question rank, confidence percentage, or stopping result; expected outputs belong only to tests/documentation.
