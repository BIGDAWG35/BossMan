**Version:** v4 · **Date:** 2026-08-31 · **Source:** `~/.hermes/knowledge/LEARNED_CRON_SAFETY.md` · **Status:** Current — auto-built from canon by build_spaces_v4.py; edit the source, not this copy

> Note: any LBC35/OpenClaw mention in this file is historical (retired 2026-09-30; BossMan does all delegation via kanban + route-card.sh). Health OS was deleted 2026-09-30. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins.

# LEARNED_CRON_SAFETY.md

> Status: Permanent. Created 2026-08-31 by card `t_save_jobs_validation_hook_v1_20260831`
> (parent: `t_5fb6ceea`). Cross-references incident `a5e29e688dc0`.

## Purpose

Single source of truth for the cron data-integrity contract: how the
three validated write paths, the persistence gate, and the scheduler
runtime guard compose to make sure a malformed record NEVER silently
fires an empty instruction at the LLM.

## The two error constants

Defined in `cron/jobs.py`:

| Constant | Trigger | Surface at |
|---|---|---|
| `NO_AGENT_WITHOUT_SCRIPT_ERROR` | `no_agent=True` with no/empty/whitespace `script` | create_job, update_job, save_jobs hook, scheduler.run_job (pause) |
| `EMPTY_PAYLOAD_ERROR` | blank `prompt` AND no `script` AND no `skills` (and the record explicitly carries at least one of those keys) | create_job, update_job, save_jobs hook, scheduler.run_job (pause) |

**The same constant text is emitted by every layer** so a downstream
consumer that pattern-matches the message (Telegram alerts, log
searches, ops dashboards) sees consistent text regardless of which
layer caught the malformed record.

## The three layers (defense in depth)

```
        hand-edit / direct json.dump
                  |
                  v
        +-------------------+         <-- LAYER 1: persistence gate
        |   jobs.json       |             save_jobs() validates every
        +-------------------+             record via job_record_is_valid().
                  |                       Run-time-empty records whose
                  |                       enabled=False or state in
                  v                       {paused,completed,error} are
        +-------------------+             admitted (they cannot fire --
        |  scheduler.tick   |             the gate's purpose is "don't
        |  _block_and_pause |             persist a record that would
        |                   |             fire empty", not "police
        +-------------------+             meta-state writes").
                  |
                  v
        paused state, never fires
```

Plus the **API-boundary layer** (create_job / update_job / cronjob model
tool) which catches malformed records before they reach save_jobs.

## Why we have THREE layers

The original defect (incident a5e29e688dc0) was upstream: hand-edits to
`jobs.json` bypassed the API boundary and landed malformed records that
the scheduler correctly paused at fire time. The pause worked; the
defect was that hand-edits could persist anything in the first place.

The 2026-08-31 fix added LAYER 1 (the persistence gate) so:

1. Hand-edits CANNOT persist runnable malformed records.
2. The runtime guard (LAYER 2) is preserved unchanged — if a malformed
   record somehow reaches the runtime path (e.g. a brand-new hand-edit
   between save and tick, or a corrupted-bytes load), the scheduler
   still pauses it.
3. The API boundary (create_job / update_job) is unchanged because the
   validator returns the same constants the API layer already raises.

## `job_record_is_valid(job) -> tuple[bool, str]`

Implementation: `cron/jobs.py:583-630` (added 2026-08-31).

Validates a single job record against the same invariants create_job
and update_job enforce. Used by `save_jobs` as the pre-write hook.

**Evaluation order** (matches create_job/update_job):

0. **Non-runnable carve-out**: `enabled=False` OR `state` in
   `{paused, completed, error}` → admitted unconditionally. Such
   records cannot fire, so the gate's purpose does not apply. This
   is what lets `pause_job`, `claim_dispatch`, `clear_run_claim`,
   `mark_job_run`, `advance_next_runs`, `load_jobs` (the
   read-then-rewrite normalizer), and the scheduler's pause path
   funnel through `save_jobs` without threading a private bypass
   flag through every internal caller.
1. `no_agent=True` AND `script` is None/empty/whitespace →
   `(False, NO_AGENT_WITHOUT_SCRIPT_ERROR)`.
2. `job_payload_is_empty(job)` is True → `(False, EMPTY_PAYLOAD_ERROR)`.
3. `schedule` is a non-empty string AND `parse_schedule()` raises
   `ValueError` / `KeyError` / `TypeError` →
   `(False, EMPTY_PAYLOAD_ERROR)`.

**Returns `(True, "")` for valid records.**

Non-dict inputs (`"not a dict"`, `None`, list, int) → rejected with
EMPTY_PAYLOAD_ERROR so a corrupted-bytes write can't slip through.
Dict-shaped schedules (the storage shape create_job writes) are
accepted as-is — only raw string schedules are re-parsed.

## Operational notes

- The gate is **atomic**: a single malformed record rejects the entire
  batch. No partial writes.
- The gate runs INSIDE `_save_jobs_unlocked`, after the shrink-merge
  guard but before the temp-file stage. A rejection raises
  `ValueError` before `tempfile.mkstemp`, so a failed validation never
  leaves a stray `.jobs_*.tmp` behind.
- The gate is intentionally **NOT** in `scheduler.py`. The pause logic
  there is the runtime backstop and must remain unchanged (it's
  referenced in `cron/scheduler.py:4941` `_block_and_pause_job` and
  the two trigger sites at 5551-5558 / 5647-5654).

## Tests

- `tests/cron/test_save_jobs_validation.py` — added 2026-08-31:
  the four acceptance cases (no_agent+no_script rejected, empty
  payload rejected, valid accepted, defense-in-depth verified) plus
  pure-function unit tests for `job_record_is_valid`.
- `tests/cron/test_cron_empty_payload.py` — pre-existing (since the
  incident): the API-boundary (create_job/update_job) and runtime
  guard (`scheduler.run_job` pause) tests.
- `tests/cron/test_jobs_file_ownership.py`,
  `tests/cron/test_jobs_shrink_merge_80624.py`,
  `tests/cron/test_jobs_drift_alert_once.py`,
  `tests/cron/test_misfire_catchup.py` — pre-existing
  save_jobs regression suites that exercise valid-record round-trips
  through the same code path; all must continue to pass.

## How to add a new validation rule

1. Add the check to `job_record_is_valid` in `cron/jobs.py`. Re-use an
   existing constant if possible; create a new one only if the new
   check cannot share the message text.
2. Mirror the check in `create_job` and `update_job` (they raise
   BEFORE save_jobs is called, so the persistence gate is the
   last-chance backstop, not the primary gate).
3. Add a runtime guard in `scheduler.run_job` if the check applies
   to records that could exist on disk before the new rule lands.
4. Add a test to `tests/cron/test_save_jobs_validation.py` covering
   the save_jobs rejection AND a pure-function unit test for
   `job_record_is_valid`.

## Card history

| Card | Outcome | Effect |
|---|---|---|
| `t_scheduler_payload_detection_fix_v1_20260831` (`t_5fb6ceea`) | STOP — scheduler-side fix not deterministic | Confirmed scheduler.py:4941-5654 pause logic is correct; spawned the save_jobs fix as a child. |
| `t_save_jobs_validation_hook_v1_20260831` (`t_42341bb9`) | PASS | Added `job_record_is_valid` + save_jobs gate + tests + this LEARNED entry. |
