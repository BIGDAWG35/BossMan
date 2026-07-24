# Dominoes Rules Truth Table

| Rule                       | Traditional (Standard)            | Block                              | Draw (or "Chicken Foot" in 5p)    | All Fives                              |
|----------------------------|-----------------------------------|------------------------------------|------------------------------------|----------------------------------------|
| First move                 | Highest double OR highest pip    | Highest double OR highest pip     | Highest double OR highest pip     | Highest double OR highest pip          |
| Must start on a double?    | Only if player holds any double   | Only if player holds any double    | Only if player holds any double    | Only if player holds any double        |
| Open ends after first move  | Both pips (no spinner)            | Both pips (no spinner)             | Both pips (no spinner)             | Both pips (no spinner)                 |
| Draw from boneyard         | Allowed, max 1 / turn             | NOT allowed                        | Allowed, unlimited per turn       | Allowed, max 1 / turn                  |
| Forced pass rule           | Player must play if can. End -> opp gets pip sum. | Player must play if can. End -> opp gets pip sum. | If boneyard empty AND can't play -> pass. | Player must play if can. End -> opp gets pip sum. |
| Blocked round (both stuck)  | Both pass / can't play. Lowest pip sum wins the round. | Same. Both can't play -> round ends. | Both can't play AND boneyard empty -> round ends. | Same.                                 |
| Scoring on round end       | Round winner gets opponent's hand pips + boneyard pips (if any). | Same. | Same. | Same.                                  |
| Multi-round match: when next round starts? | When neither side reached targetScore. Re-deal hands, reset layout, score continues to accumulate. | Same. | Same. | Same. |
| Per-play scoring           | None (only round-end pip-sum scoring) | None | None | Sum of open ends (both sides count) is divisible by 5 -> the player just played scores the sum. |
| Target score               | 100 (or 100 / 150 / 200 / 250 chosen at create) | 100 | 100 | 200 |
| Match ends when either side | >= target score                  | >= target score                    | >= target score                    | >= target score                        |
| Tie-break on match         | Current round of reaching target wins. (Cannot happen unless both reach on same round: implementation chooses seat-of-winner.) | Same. | Same. | Same. |
| Spinner rules              | No spinner.                       | No spinner.                        | No spinner.                        | No spinner.                            |
| Muggins (All Fives variation, score from own hand if opp misses) | n/a                                | n/a                                | n/a                                | Out of scope (strict All Fives only).  |

## Implementation status -- 2026-07-23

Each row maps to which engine class owns it. The truth table above is what
operators and users expect; the implementation currently differs from it
on the rows marked "BROKEN" below.

### Per ruleset class

| Ruleset         | Class             | targetScore | maxDrawPerTurn | scoring       | requireDoubleFirst | allowDraw |
|-----------------|-------------------|-------------|----------------|---------------|--------------------|-----------|
| traditional     | TraditionalEngine | 100 (hardcoded) | 1          | simple_sum    | TRUE               | TRUE      |
| block           | BlockEngine       | 100 (hardcoded) | 0          | simple_sum    | TRUE               | FALSE     |
| draw            | DrawEngine        | 100 (hardcoded) | Infinity   | simple_sum    | TRUE               | TRUE      |
| all_fives       | AllFivesEngine    | 200 (hardcoded) | 1          | all_fives     | TRUE               | TRUE      |

## BROKEN rows (must fix in t_dominoes_engine_truth_v1_20260723)

1. **targetScore is class-level hardcoded** -- not driven by `winScore`
   on the match row. Fix: `createEngine(ruleset, targetScore?)` accepts
   an override; server reads `match.winScore` and passes it through.

2. **`requireDoubleFirst` declared but not enforced** -- engine does not
   reject a non-double first move when the player holds a double in
   hand. Fix: in empty-board `play` branch, verify the player either
   has no doubles OR played a double.

3. **Round-end -> new round transition is silent** -- the engine
   returns `matchOver=false` after a round ends (when neither side
   reached targetScore), but does NOT call `newRound` to re-deal
   hands / clear layout / reset boneyard. The client sees an empty
   board but cannot start a new round. Fix: when a play/draw event
   empties a hand AND matchOver === false, the engine must call
   `newRound` and return the new state.

4. **`applyMove` doesn't enforce `maxDrawPerTurn`** -- the placeholder
   comment on lines 451-453 is the only enforcement. Per ruleset:
   - Traditional: at most 1 draw per turn (state.layout > 0 -> reject
     second draw this turn)
   - All Fives:  same
   - Block: draws disabled (already covered by allowDraw: false)
   - Draw: unlimited -- player keeps drawing until they can play
     OR boneyard runs out

5. **AI test coverage** -- there are unit tests for AI difficulty but
   none assert AI never returns illegal moves across all 4 rulesets.

## Acceptance bar for the fix

Each BROKEN row must be fixed AND verified by:
- An explicit unit test asserting the broken behavior is now correct
- A live-route proof (start a match, make moves, target-score end)
