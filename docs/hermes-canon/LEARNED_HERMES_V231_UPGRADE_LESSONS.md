# LEARNED — Hermes Agent v0.22.5 → v0.23.1 upgrade (2026-11-12)

Durable lessons from the v0.23.1 upgrade of the live install at
`/Users/bigdawg/.hermes/hermes-agent` (detached HEAD `bf0203a794`, source-equivalent
v0.22.5 → official `v0.23.1`, peeled commit `3b421578588243f920886e6fe79a6faa87ea026e`).

## 1. Layer, never replace

Do not swap the repository wholesale. Upstream `v0.23.1` is the BASELINE; the local
adaptations (MiniMax M3.1-Flash routing, runtime-main isolation, obligation/tombstone
lifecycle, kanban pin-first resolution, home-I/O guard, scheduler telemetry) are LAYERED on
top and must survive the upgrade. The working artifact is a single `git diff` from the
peeled upstream commit to the adapted tree — reviewable byte-for-byte, and re-appliable to a
pristine checkout.

Pattern that worked:
1. Worktree at the upstream tag: `git worktree add --detach <scratch> 3b421578…`.
2. Adapt the local changes into that worktree (resolve OFF-LIVE conflicts there).
3. `git diff --binary 3b421578… -- .` → ONE patch file; hash it; review the EXACT bytes.
4. Pristine tree + `git apply --check` → apply cleanly; then `diff -r` against the adapted
   worktree → byte-for-byte equality (only build artifacts may differ).

## 2. The test-suite home-I/O guard can fake a product regression

`tests/home_io_guard.py` refuses ANY file I/O under the REAL `~/.hermes` home. Two
consequences that cost real debugging time:

- The scratch worktree lives under `~/.hermes/cache/scratch/`, so production import-time
  code that stats `<git-dir>/hermes-update-pull` or reads `install-stamp.json` trips the
  guard and aborts unrelated tests at import. Those failures look like product bugs.
- A guard-induced exception inside `git` ancestry probes was silently swallowed by a
  `try/except` and degraded a tri-state probe to UNKNOWN — which then failed the debt
  discharge. The "product defect" was the guard.

Fix pattern: the guard gets NARROW, READ-ONLY exemptions for the checkout's OWN
metadata (`.git/`, `.git/worktrees/<name>/`) and its OWN install-layout metadata
(`install-stamp.json` beside the code / beside the install root). Writes and deletes stay
refused, and genuine runtime state (`config.yaml`, `sessions/`, `kanban/`, `state.db`,
`cron/`, `db/`) stays refused for reads and writes.

## 3. Tri-state probes: never collapse UNKNOWN into False

`git merge-base --is-ancestor <sha> HEAD` exits 128 for a SHA the repository does not
have. Collapsing every non-zero exit into "not contained" silently DISCHARGES a
fleet-restart debt (the exact thing the surrounding comment forbids). Correct shape:

- `True`  = git answered, SHA IS an ancestor.
- `False` = git answered, SHA is NOT an ancestor (including "object absent from this repo").
- `None`  = UNKNOWN — repo unreadable / timeout / crash. Fail CLOSED: keep the debt.

A separate RESOLVED probe (`checkout_contains_resolved`) splits the hard-failure case: on
UNKNOWN, ask git whether the object is merely ABSENT (`git cat-file -e`) → absent = DEFINITIVE
False; present-but-inconclusive = None. A boolean wrapper (`checkout_contains`) must never be
used where the debt outcome depends on the distinction.

## 4. Test fixtures must patch the function the production code CALLS

A regression test patched `checkout_contains_strict` while the production reader consumed
`checkout_contains_resolved`. The test then failed for a reason that had nothing to do with
the behaviour under test. Patch the exact symbol the consumer imports, and assert the
tri-state arm deterministically with NO real git.

## 5. Deploy out-of-process; request the restart separately

A worker that is a descendant of the gateway dies when the gateway restarts. Never restart
the gateway in-process. Two-stage, both outside the gateway tree:

1. `launchctl submit` a runner script (fail-closed: any failed stage aborts BEFORE the
   restart request, so a broken tree is never made live).
2. Write a one-line reason to `~/.hermes/perplexity-intake/restart.request`; the
   `ai.hermes.deferred-restart` LaunchAgent performs the restart and posts health.

Runner stages that proved worth the effort: preflight (patch present, backup checksums OK,
target commit present) → pristine `git apply --check` → land + byte-for-byte tree equality
→ dependency rebuild (v0.23.1 bumps pins: openai 2.54.0, pydantic 2.14.1, requests 2.34.2,
croniter 6.2.4, truststore 0.10.5, packaging 26.3, rich 14.3.4) → evidence JSON.

## 6. Preserve unrelated pending work by CLASSIFICATION, not by hope

Before deploying, classify every live `git status` entry:
- Class A (artifact-covered): re-applied identically by the patch; proven by the tree-equality
  gate.
- Class B (tracked, NOT in artifact): local code the upstream design SUPERSEDES. Snapshot the
  diff into the backup; land upstream.
- Class C (untracked docs): moved aside to the backup, NEVER deleted. The runner must never
  run `git clean` in the LIVE repo — only in the pristine scratch worktree.

## 7. Model-tier pricing: read the official wording, then document the choice

MiniMax publishes M3 bands as "≤ 512k input tokens" / "> 512k input tokens" and publishes NO
tier row for M2.7 at all. Never invent a rate for an unlisted model. When the docs are silent
on a detail (do cached tokens count toward the band?), state the choice explicitly in the
code, pick the conservative direction (cost telemetry may over-report; it must never
under-report), and keep the default model (M3.1-Flash) free of a tier entirely.

## 8. Async delegation notifications are NOT verdicts

A subagent that returns "PASS" may have hit its iteration cap mid-review, may have reviewed
a STALE artifact, or may have lost tool output to context compression. Always: re-verify the
hash of the artifact the reviewer was given, read the transcript, and re-run the tests
yourself. Re-dispatch a bounded review when the summary is thin.

## 9. Broad suites are unreliable evidence; scoped suites are

Whole-directory pytest batches on this stack hang, time out, and die on collection errors
from unrelated optional deps (keyring, lark_oapi). The reliable unit of evidence is the
SET OF FILES THE PATCH TOUCHES, run in a pristine-venv interpreter with an isolated
`HERMES_HOME`, with `-p no:cacheprovider` and a bounded `timeout`. A patched-vs-baseline
comparison on that file set is the regression gate.

## 10. The guard's interpreter exemption must cover the SYMLINKED alias

The PM runtime exposes the interpreter twice:
`.../generation-<id>/cpython-3.11-macos-aarch64-none` (a SYMLINK) ->
`.../cpython-3.11.15-macos-aarch64-none`. The guard resolved its interpreter prefixes once
at import, so only the RESOLVED spelling was exempt — while stdlib reads
(linecache/traceback/zoneinfo) arrive with the UNRESOLVED spelling. The lexical path then
falls inside the real home and the guard refuses the interpreter's OWN stdlib.

The nastiest part: pytest reads the source file to FORMAT a failure. So the guard crash
happened inside pytest's own reporting path, turning a normal test failure into an
unreadable traceback and hiding the real result. A green run and a red run looked identical.

Fix: exempt the UNRESOLVED spelling of the same interpreter prefixes as well (read-only,
same installation — no widening to Hermes state). Then the live venv is usable directly.
Do not read a guard-induced crash inside pytest reporting as a product regression: fix the
guard first, then re-read the real result.

Interpreter note (superseded): the live venv
`/Users/bigdawg/.hermes/hermes-agent/venv/bin/python` now works once the guard exempts the
symlink alias. Scoped alternative if needed: the arm64 python under
`~/.hermes/cache/scratch/wt-231/.pyhome/` with
`PYTHONPATH=<tree>:<live venv site-packages>` and `HERMES_HOME=<scratch test home>`.

## 11. Pipefail or the exit code lies

`pytest ... | tail -30` returns tail's exit status. A failing suite reported `EXIT=0`.
Always `set -o pipefail` and read pytest's OWN summary line ("N passed, M skipped"),
never the shell's exit code alone.
