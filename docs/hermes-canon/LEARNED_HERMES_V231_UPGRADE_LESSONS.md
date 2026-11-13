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

## 12. A review verdict is bound to the EXACT artifact bytes, not to the branch

A delegated review approves a sha256, not a concept. Any post-review edit — even a
mechanical Ruff autofix — produces new bytes and INVALIDATES that approval. The safe
sequence is: land the lint fixes first, regenerate the patch (`git diff --cached --binary`),
then re-dispatch the review against the new sha256. Never deploy an artifact whose hash
differs from the reviewed hash, and never let a runner apply a patch that is not the
approved file.

Corollary: the deployed tree must be proven to equal the reviewed tree (byte-for-byte on
every path the patch owns). If the live tree differs from the approved artifact, the
verdict does not transfer — stop.

## 13. `git clean` in the LIVE repo is a destructive-by-default mistake

The runner's "reset the tree to the target" step originally ran `git clean -fdq` in the live
repository. The live repo held unrelated untracked work (`BLUEPRINT_*.md`,
`M31_CONSOLIDATED_VALIDATION.md`) that is NOT in the patch. `git clean` would have deleted
it silently. Rule: `git clean` may run ONLY inside a throwaway scratch worktree. In the
live repo, reset tracked content to the reviewed commit and leave untracked files alone.

Corollary: the runner should land a REVIEWED COMMIT (`git checkout <commit>`), not
re-apply a patch file — then a tree-identity guard proves the live tree equals the
reviewed commit's tree.

## 14. Autofix is a semantics change until you read the diff

Ruff's fixers rewrite code, not just whitespace. Two classes bit during this upgrade:
- `subprocess.run(...)` result handling — the fixer demanded an explicit `check=False`;
  adding it preserved capture/encoding/error/timeout behaviour.
- Test lambdas rewritten to builtins (`lambda **kw: dict(**kw)` → `dict`) — a behaviour
  change if the original had any body.

Rule: after any autofix, re-run the touched tests AND read the changed hunks. Lint-clean
is not evidence of correctness.

## 15. The gateway version string is the ground truth for "is the new code live"

`hermes --version` reports the INSTALLED tree; `curl -s http://127.0.0.1:8642/health`
reports the RUNNING process. A successful deploy with the old version in `/health` means
the gateway has not restarted yet — the restart is a separate, out-of-process step
(`~/.hermes/perplexity-intake/restart.request` → `ai.hermes.deferred-restart`).

Gotcha: the deferred-restart script's `upgrade*` reason word runs the OLD 2026-10-26
runner and then ABORTS the restart unless HEAD equals the old stable sha. For a layered
upgrade, use a neutral reason string so the script takes the plain restart path.

## 16. Vendored `just` is required for the repo's pre-commit hook

The repo's `lefthook.yml` pre-commit hook shells out to `just lint-python`. `just` is not
on the default PATH (it is vendored at `~/.hermes/tools/just-1.59.0-darwin-arm64`), so the
commit fails with a confusing exit 1. Prefix the commit with
`PATH="/Users/bigdawg/.hermes/tools/just-1.59.0-darwin-arm64:$PATH" git commit ...`.

## 17. A gateway restart DRAINS the live chat turn that requested it

The gateway lifecycle verb interrupts live turns, but first it DRAINS them: it waits for
the running turn to finish before stopping the gateway. A restart requested from inside a
chat turn therefore cannot complete until that turn ends — the classic self-deadlock.

Rule: request the restart as the LAST action of the turn, from a script that runs OUTSIDE
the gateway process tree (launchd), and let that script gather the post-restart evidence
and post it. The launchd-run verifier survives the SIGTERM that the restart delivers to
the gateway's children; a child of the gateway does not.

Corollary: the deferred-restart helper refuses to act while live work exists. A plain
reason string therefore yields a NO-OP restart on a busy gateway — the log shows the
refusal and the health probe still answers from the OLD process. The v0.23.1 upgrade
added a dedicated reason branch to that helper that runs the verifier script with the
interrupt flag from launchd.

Corollary 2: the "live session" gate is about turns, not about the code. The running
gateway keeps serving the OLD code until it actually restarts; `/health` reporting the
old base version is the proof that the new code is not live yet.

## 18. A test venv on a DIFFERENT Python minor than the runtime is a fake regression

After the v0.23.1 upgrade the repo's dev `venv/` was still Python **3.11**, while the pm-managed
runtime environment `966380101a8a45a2a717faaf7baa6de8` is Python **3.14**. Hermes' bootstrap
(`pm/environments.py: activate_dependencies`) puts the *selected* environment's site-packages on
`sys.path`, so a 3.11 interpreter ended up importing a **cpython-314** `pydantic_core` extension:

    ImportError: cannot import name 'ArgsKwargs' from 'pydantic_core._pydantic_core' (unknown location)

That single ABI mismatch produced **284 collection errors** and looked exactly like a catastrophic
upgrade regression. It was pure harness noise.

**Rule:** run the suite with an interpreter whose minor version matches the runtime environment's
(`uv venv --python <runtime venv>/bin/python` + `uv pip install pytest pytest-asyncio pytest-xdist
pytest-timeout`), and pass the runtime site-packages via `PYTHONPATH`. Two more harness traps in the
same area:
- the suite's home-I/O guard rejects any `HERMES_HOME` under `~/.hermes` (it treats it as the REAL
  home) — use `/tmp/...` for the isolated home, not `~/.hermes/cache/scratch/...`;
- a test venv needs `pytest-asyncio` (and friends) installed or collection dies on
  `ModuleNotFoundError: No module named 'pytest_asyncio'`.

**A/B rule for upgrades:** compare the SAME test files on the patched tree and the pristine upstream
tree with the SAME interpreter. Here: patched tree **331 passed / 6 skipped / 0 failed** on the 17
patch-touched files that exist upstream; pristine upstream on those same files: **54 failed, 6 errors**
— because upstream lacks the local adaptation behavior the tests assert. That is the correct signal:
the local layer is real and load-bearing, and it is *absent* upstream.
