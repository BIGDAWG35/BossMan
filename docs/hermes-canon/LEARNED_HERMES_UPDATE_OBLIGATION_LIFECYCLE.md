# LEARNED — Hermes Update→Restart Obligation Lifecycle (B6)

**Status:** Permanent (2026-10-30, card `t_ca841d0e` — Card A B6 lifecycle repair)
**Owner:** BossMan (kernel) · **Scope:** Hermes Agent self-update machinery on this host

---

## The rule

The Hermes host carries a **host update→restart obligation** — a durable record that a pull
moved the checkout and the running gateways may still be serving pre-update modules
(`mixed sys.modules`). It lives at
`~/.local/state/hermes/gateway-locks/host-update-restart-<install-id>.json`.

**A retirement is an archive, never a delete.** When the obligation's `expected_sha` is on an
**abandoned lineage** — i.e. it is not an ancestor of the installed checkout HEAD, so no restart
can discharge it — the obligation is retired by **archiving it byte-exact** and writing a
**cryptographically validated tombstone**. The file is never deleted without an archive, and
`expected_sha` is never falsified.

**The warning is never disabled — only ever silenced by a valid matching tombstone.**
The exact warning text is fixed and must not be altered, muted, or reworded:

```
Gateways may still be serving pre-update modules (mixed sys.modules).
```

---

## The CLI surface (shipped 2026-10-30)

```
hermes obligation status     # read-only: live obligation + valid tombstones
hermes obligation retire     # archive the obligation (P1–P7 preconditions; requires --reason)
hermes obligation restore    # restore a retired obligation byte-for-byte from its archive
```

Refusals exit **1** with a non-zero JSON body `{"ok": false, "error": ...}` and **write nothing**.
`status` is strictly read-only.

---

## Fail-closed preconditions (P1–P7)

Every one is evaluated **before** any write. A failed gate refuses the retirement and leaves the
live obligation **byte-identical**.

| Gate | Rule | Refusal string |
|---|---|---|
| reason | `--reason` is required (audit trail) | `refusing: --reason is required (audit trail)` |
| P1 | `expected_sha` must match the record | `P1 expected_sha mismatch` |
| P2 | `expected_sha` must NOT be within the current checkout lineage (`checkout_contains`) | `P2 expected_sha is within the current checkout lineage` |
| P3 | running code must equal checkout HEAD | `P3 running code != checkout HEAD` |
| P4 | no genuinely unrestarted runtime(s) | `P4 genuinely unrestarted runtime(s)` |
| P5 | no update already in flight | `P5 an update is already in flight` |
| P6 | gateway health must be 200 | `P6 gateway health is <x>, expected 200` |
| P7 | archive is byte-exact + SHA-verified before the live file is unlinked | — |

**Upstream's fail-closed ancestry rule is never weakened.** P2 still enforces `checkout_contains`.
A retirement is a *separate, audited* path — it does not relax any existing discharge path.

---

## Tombstone validity is cryptographic (B6 review finding 2)

A tombstone is valid only when **all** of these hold. Marker existence alone is never evidence.

1. `kind == TOMBSTONE_KIND` (`host_update_obligation_retirement`)
2. `expected_sha` is non-empty and equals the SHA being checked — **exact** match
3. the archive file named by `archived_obligation_path` still exists and its bytes **re-hash** to
   `archived_obligation_sha256`
4. the archived obligation payload carries the **same** `expected_sha`

Validation lives in `hermes_cli/update_obligation_retire.py::_tombstone_is_valid()` and is
enforced through `read_tombstone()`, `retired_expected_shas()`, `retired_tombstones()`, and
`warning_should_fire()`. A hand-written marker, an edited archive, a removed archive, or a
wrong-kind marker **fails closed** — the warning fires.

## Fleet debt discharge is exact-SHA scoped (B6 review finding 1)

`hermes_cli/update_cmd_fleet.py::_retired_obligation_discharges_host_debt()` discharges the
host's fleet-restart debt **only** when:

- the SHA actually owed comes from the update receipt (`receipt["post_update"]["sha"]`, via
  `_owed_sha_from_receipt()`), **and**
- a cryptographically valid tombstone matches that **exact** SHA.

When the owed SHA cannot be resolved, the function returns `False` and the warning fires
(fail closed). An unrelated or stale tombstone — including one merely outside the checkout
lineage — **never** silences a warning for a different `expected_sha`.

---

## Durability ordering

- Archive and tombstone are written with tmp-write → `fsync` → `os.replace` → directory `fsync`.
- The archive is **SHA-verified** and the tombstone is made durable **before** the live
  obligation is unlinked. A crash leaves the obligation armed and the operation resumable.
- `restore()` writes the archived bytes back byte-for-byte, verifies them, and removes the
  tombstone.

---

## Live-host state on this machine (2026-10-30)

- Install `0454e657975feb56`, environment `526a260c54c44969853b94c174643fe4`.
- Checkout HEAD `bf0203a794a07aac3ff764972ab9087baa4e4f4e` (detached).
- The live obligation was **absent** at close: it was discharged upstream by a legitimate
  `hermes update` run at 09:48→09:50 PDT on 2026-10-30 (receipt
  `update_20261030_164855_73548_21fe5265a6054691930def244ab917aa.json`, `outcome: success`,
  `stop_reason: source update completion`, gateway restart skipped because *every running
  gateway already serves the checkout code*).
- **No B6 retirement was executed on this host**, and **no archive/tombstone was fabricated**.
  The retired-obligation directory does not exist. The warning is **not owed**:
  `_fleet_restart_obligation_armed()` → `False`, `_pending_fleet_restart_needed()` → `False`,
  `_update_owes_fleet_restart()` → `False`.
- The B6 code path remains deployed and available for any future obligation that genuinely
  reaches the abandoned-lineage condition.

---

## Rules for operators

1. Never hand-delete the obligation file, never hand-write a tombstone, never falsify
   `expected_sha`.
2. Never suppress the warning by editing its text or disabling its code path.
3. Retirement requires `--reason`; it is an audited operation.
4. A failed gate is not a blocker to fix — it is the mechanism working. Read the refusal string.
5. If the obligation turns out to have been discharged legitimately upstream, **document that**
   and leave the state alone. Absence of the file is not evidence of a successful retirement.

---

## Deployment + verification runbook (added 2026-11-02, card `t_6d5d1edc`)

The procedure for a future retirement on this host, in order. **Every step is a gate; a failed
gate stops the run and is reported, not worked around.**

### Step 0 — Preconditions, fail-closed

1. **Implementation present in the INSTALLED checkout**, not in a scratch worktree:
   `hermes_cli/update_obligation_retire.py`, `hermes_cli/subcommands/obligation.py`, the
   `cmd_obligation` wiring in `hermes_cli/main.py`, the tombstone gate in
   `hermes_cli/update_cmd_fleet.py`.
2. **Independent QA verdict = PASS / PASS-WITH-FIX**, with the evidence attached. A card
   stuck in `blocked`/`archived` does **not** fail this gate if the review artifacts exist
   and pass — but say so explicitly in the deploy log rather than implying the card was
   green.
3. **Fresh precondition check at deploy time** (not reused from an earlier run). Run the
   module's own probes through the **install venv** interpreter.

### Step 1 — Pick the RIGHT interpreter (this is the trap)

Only the **arm64 install venv** resolves this checkout's dependencies:

```
/Users/bigdawg/.hermes/installs/0454e657975feb56/environments/46f00863a0b64b468953fe51d188b93a/venv/bin/python
```

- system `python3` (x86_64) → **no** `fastapi`/`uvicorn` → `hermes_cli.web_server` raises
  `SystemExit("Web UI requires fastapi and uvicorn.")` **at import**, which aborts a whole
  pytest run with `INTERNALERROR` (not a per-test error). This looks like a broken
  checkout; it is not.
- the checkout's own `.venv` → **no** `pytest`.
- `ruamel` is importable only from the install venv in some configurations.

Do **not** `PYTHONPATH`-blend the two: the venv is arm64 and the system python is x86_64,
so `pydantic_core` fails with `mach-o file, but is an incompatible architecture`.

If pytest is missing from the install venv: `uv pip install --python <venv>/bin/python pytest`.
That is safe — it adds a test runner, it does not touch Hermes runtime deps.

### Step 2 — Check the obligation actually exists BEFORE anything else

```
hermes obligation status   # obligation present: ? / expected_sha: ? / tombstones: ?
```

If `obligation present: False`, **there is nothing to retire.** P1 fails by construction.
Do not create a synthetic obligation on the live host to give yourself something to retire.

### Step 3 — Decide whether a restart is needed, then justify it

The B6 modules are **CLI-side** (`hermes_cli/`). The gateway daemon never imports them
(`grep -rn "update_cmd_fleet|update_obligation_retire|update_cmd_fleet_checkout" gateway/ agent/ cron/ hermes_bootstrap.py`
→ empty), and the CLI re-imports from source on every invocation. **A restart is therefore
almost never required for a B6 change** — check this, and if no restart is needed, do not
perform one. If one IS needed, write a one-line reason to
`~/.hermes/perplexity-intake/restart.request`; the `ai.hermes.deferred-restart` LaunchAgent
performs the out-of-process restart. Never restart the gateway in-process.

### Step 4 — Execute the retirement (only if every gate passes)

```
hermes obligation retire --expected-sha <sha> --reason "<truthful reason>"
```

Never falsify `expected_sha`. Never hand-write the archive, the tombstone, or the audit
entry. If the CLI refuses, **read the refusal string** — it names the gate that failed.

### Step 5 — Prove reversibility

`hermes obligation restore` must bring the obligation back **byte-for-byte** (compare
SHA-256 of the restored file against the pre-retirement bytes) and the warning must
re-fire. If the live host has no obligation to work on, run the whole retire→restore round
trip in a **sandbox** using the module's own env overrides:

```
HERMES_GATEWAY_LOCK_DIR=<scratch>/gateway-locks
HERMES_OBLIGATION_RETIREMENT_DIR=<scratch>/obligation-retirements
```

Both are supported overrides. Sandbox the test; never write a synthetic obligation onto the
live host.

### Step 6 — Post-deploy verification (fresh, never reused)

- **V1** prove the RUNNING code is the reviewed code from the running process, not from HEAD.
- **V2** warning silent on ordinary CLI invocations **and** a restore test proves it returns.
- **V3** probe **all nine** profiles for HTTP 200 on `/health` and `/v1/health`. Any non-200
  = investigate; do not claim pass.
- **V4** record the PM2 snapshot (20 services expected); no new degraded/unstable.
- **V5** one non-spamming messaging/dispatch check + one live delegation route check.
- **V6** the affected regression slice — and **compare any failure against the baseline tree**
  before calling it a regression.
- **V7/V8** confirm the model is **requested at runtime**, not merely configured.

### Step 7 — Verdict discipline

Report what happened, including what did **not** happen. "Retirement not executed because the
obligation was legitimately discharged upstream" is a **pass**, not a gap — as long as it is
stated plainly and no state was fabricated to make it look tidier.

---

## Cost accounting: never present estimated as billed

The MiniMax path's `session_model_usage` rows carry `cost_status='estimated'` and
`cost_source='official_docs_snapshot'`, with `actual_cost_usd = 0.0`. Local (Ollama) rows
carry `cost_status='unknown'`, `cost_source='none'`. **Never describe an estimated figure as
provider-billed.** The `cost_status` field is the discriminator; check it before quoting any
cost number.

---

## Proving a model is REQUESTED at runtime, not just configured

Configuration proves nothing. Three runtime surfaces that do:

1. **The gateway wire log** — `~/.hermes/logs/gateway.error.log` records the actual request
   line: `provider=minimax base_url=https://api.minimax.io/anthropic model=MiniMax-M3.1-Flash`.
   A provider-attributed, model-named line can only come from the request path.
2. **`session_model_usage`** in each profile's `state.db` — the `model` /
   `billing_provider` / `billing_base_url` triple is written *after* the call completes.
   Read it for **every** profile, not just the default one.
3. **A live delegated subagent** — the delegator reports the child's `model` and
   `cost_status` independently.

---

## Files

- `hermes_cli/update_obligation_retire.py` — lifecycle module (archive, tombstone, restore, validity)
- `hermes_cli/subcommands/obligation.py` — CLI parser (`retire|restore|status`)
- `hermes_cli/update_cmd_fleet.py` — warning path + exact-SHA debt discharge
- `hermes_cli/main.py` — CLI wiring (`cmd_obligation`)
- `tests/test_obligation_retire.py` — fail-closed fixture suite (22 tests)
- `~/.hermes/knowledge/CARD_A_B6_LIFECYCLE_REPAIR_PROPOSAL.md` — the approved proposal
- `~/.hermes/knowledge/card-a-b6/` — reference implementation + verifier artifacts
