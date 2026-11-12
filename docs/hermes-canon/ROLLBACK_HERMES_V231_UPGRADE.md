# ROLLBACK — Hermes Agent v0.23.1 upgrade (deployed 2026-11-12)

## What was deployed
- Live repo: `/Users/bigdawg/.hermes/hermes-agent`
- Baseline: official `NousResearch/hermes-agent` `v0.23.1`, peeled commit
  `3b421578588243f920886e6fe79a6faa87ea026e` (detached HEAD).
- Adaptation patch (layered on top of that baseline), 66 files:
  `/Users/bigdawg/.hermes/cache/scratch/upgrade-231-FINAL.patch`
  sha256 `d48fe3f854772c8699cb5f1f37323773c5c40473b7e9464bcbe8fa25aae8ae41`
- Pre-upgrade HEAD: `bf0203a794a07aac3ff764972ab9087baa4e4f4e` (source-equivalent v0.22.5).

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
  (`upgrade-231-FINAL.patch`, `deploy-231/`, `wt-231/`, `verify-231/`).

## Rollback procedure (out-of-process; never restart the gateway in-process)
1. Snapshot current state:
   `git -C ~/.hermes/hermes-agent status --porcelain > /tmp/pre-rollback-status.txt`
2. Restore the previous tree:
   `git -C ~/.hermes/hermes-agent checkout --force --detach bf0203a794a07aac3ff764972ab9087baa4e4f4e`
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
