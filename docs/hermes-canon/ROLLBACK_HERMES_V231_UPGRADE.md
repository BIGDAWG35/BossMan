# ROLLBACK — Hermes Agent v0.23.1 upgrade (deployed 2026-11-12)

## What was deployed
- Live repo: `/Users/bigdawg/.hermes/hermes-agent`
- Branch: `feat/v0.23.1-local-adaptations`
- Landed commit: `1dbce72e03865516bc94ce534b0ad2ca068777c5`
  ("feat(v0.23.1): layer reviewed local adaptations over upstream v0.23.1")
- Baseline: official `NousResearch/hermes-agent` `v0.23.1`, peeled commit
  `3b421578588243f920886e6fe79a6faa87ea026e` (parent of the landed commit).
- Adaptation patch (layered on top of that baseline), 66 files:
  `/Users/bigdawg/.hermes/cache/scratch/upgrade-231-FINAL-v2.patch`
  sha256 `e744e60834da968728aeb9434c54c14a8110f5fada227d7408ca522762e53ac9`
  (independently reviewed = APPROVED for exactly these bytes).
- Pre-upgrade HEAD: `bf0203a794a07aac3ff764972ab9087baa4e4f4e` (source-equivalent v0.22.5).
- Runtime version after landing: `Hermes Agent v0.23.1+1.g1dbce72.dirty`, Python 3.14.9,
  OpenAI SDK 2.54.0.

## Backups (never deleted)
- `/Users/bigdawg/Backups/hermes-upgrade-20261112T045826Z`
  - `SHA256SUMS.txt` — checksum manifest of every backed-up artifact.
  - `repo-state/live-pre-231-<ts>/status.txt` — live `git status --porcelain` before landing.
  - `repo-state/live-pre-231-<ts>/tracked-live.diff` — full diff of every locally modified
    tracked file (includes Class B files upstream supersedes).
  - `repo-state/live-pre-231-<ts>/untracked.list` — untracked file inventory.
  - `repo-state/superseded-untracked/` — untracked files the target tree tracks, MOVED aside
    (never deleted).
- Patch artifact + reviewed trees: `/Users/bigdawg/.hermes/cache/scratch/`
  (`upgrade-231-FINAL-v2.patch` = the approved artifact; `upgrade-231-FINAL.patch` =
  superseded v1; `deploy-231/`, `wt-231/`, `verify-231/`).
- Runner state/log/evidence: `/Users/bigdawg/.hermes/logs/hermes-upgrade-20261112.state`
  (`5-complete`), `hermes-upgrade-20261112.log`, `hermes-upgrade-20261112-evidence.json`.

## Rollback procedure (out-of-process; never restart the gateway in-process)
1. Snapshot current state:
   `git -C ~/.hermes/hermes-agent status --porcelain > /tmp/pre-rollback-status.txt`
2. Restore the previous tree (this drops the adaptation branch from HEAD):
   `git -C ~/.hermes/hermes-agent checkout --force --detach bf0203a794a07aac3ff764972ab9087baa4e4f4e`
   (the adaptation branch/commit `1dbce72e` is retained in git history, so a forward
   re-land is just `git checkout feat/v0.23.1-local-adaptations`)
3. Re-apply any live local edits that upstream superseded:
   `git -C ~/.hermes/hermes-agent apply <backup>/repo-state/live-pre-231-<ts>/tracked-live.diff`
   (review the diff first; it may not apply cleanly onto bf0203a if the patch touched the same
   hunks — resolve by hand in that case).
4. Restore untracked files moved aside:
   `cp -R <backup>/repo-state/superseded-untracked/. ~/.hermes/hermes-agent/`
   (the 7 untracked BLUEPRINT/MD docs were never moved and need no restore).
5. Rebuild deps for the old pins: `hermes pm install && hermes pm doctor`.
6. Verify: `hermes --version` shows the pre-upgrade version, then request the restart
   out-of-process:
   `printf 'rollback to bf0203a (v0.22.5)\n' > ~/.hermes/perplexity-intake/restart.request`
   The `ai.hermes.deferred-restart` LaunchAgent performs the restart and posts health.
7. Confirm: gateway healthy, Telegram/Discord connectors connected, `MiniMax-M3.1-Flash`
   still the default model, Ollama fallback intact, PM2 services up.

## Partial rollback (single subsystem)
The upgrade is a single tree, not modular. If only one subsystem misbehaves, prefer a
forward fix over a full rollback; the offending file can be reverted from the reviewed tree
`/Users/bigdawg/.hermes/cache/scratch/deploy-231/<path>` and re-verified with:
`git -C ~/.hermes/hermes-agent diff -- <path>` then the patch-touched test file set.