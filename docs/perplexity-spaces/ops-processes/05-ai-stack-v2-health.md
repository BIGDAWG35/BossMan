# LEARNED_OPS_SELF_HEALING_POLICY.md — PM2/cron Self-Healing Without Marcelo

> **CANONICAL SOURCE OF TRUTH** for ops sub-agent self-healing on PM2, cron, CuaDriver, Ollama, and Tailscale-routed services.
> Locked 2026-08-06 (Card `t_v3_stack_audit_v1_20260806`).
> Updated 2026-09-15 (Card `t_drift_closure_runtime_routing_v1_20260915`) — added §0 Runtime Closure.
> Companion: `LEARNED_7_RULE_CONTRACT.md` Rules #3 + #5 + #7 + #8.

This doc codifies the **default ops self-healing flow** for routine watchdog trips. It exists so Marcelo never has to manually restart a stuck service, paste a log excerpt, or guess whether a fix landed. The whole flow is snap → diagnose → fix → Step-5 verifier → either pass or auto-revert. Marcelo only sees a one-line summary.

## 0. Runtime Closure 2026-09-15 (Permanent, Marcelo directive)

Unattended cron and PM2 jobs route to **M3 or Ollama only**. DeepSeek is helper-only and must NEVER be an automatic primary or fallback provider for cron/PM2. MiniMax must NEVER be an automatic fallback provider for cron/PM2. Claude and OpenAI are NOT unattended runtime defaults. Risk-gated jobs (money paths, security, SquarePayouts state, Binance, MoneyPipeline, pmd-watchdog) are pinned to Ollama — Ollama never goes down, so failure there means true infrastructure failure, not token spend.

This doc's §1 Tier 2–4 model assignments ("DeepSeek-v4 reasoning", "DeepSeek → Claude") apply to **interactive** ops diagnosis runs where BossMan is actively orchestrating, NOT to unattended cron/PM2 job execution. The §1 ladder governs self-healing decisions during a watchdog tick; the §0 closure governs which model is wired into the unattended cron/PM2 dispatcher at runtime. They do not conflict. Full canon: `LEARNED_V3_MODEL_STACK.md` §Drift Closure 2026-09-15, `ROUTING-RULES.md` §3.1.

---

## 1. Default ladder for ops self-healing

| Tier | When | Action | Model |
|---|---|---|---|
| **Tier 0 — observe** | Watchdog tick completes cleanly | Write status to `~/.hermes/state/ops-watchdog/<service>-<yyyymmdd>.log`; do not message Marcelo. | Ollama (`qwen2.5:14b` default) |
| **Tier 1 — clear signal** | One-line canned restore (PM2 restart, cron re-enable, log rotate) | Apply the fix using the snap+revert helpers per Rule #8; run Step-5; auto-revert on FAIL. | Ollama (`qwen2.5:14b`) |
| **Tier 2 — unknown cause** | Restart didn't restore health within one tick | Read `LEARNED_PM2_HEALTH_MONITOR.md` (or relevant LEARNED doc); pre-summarize the log on Ollama; commit a recovery branch. | Ollama pre-summary → DeepSeek-v4 reasoning |
| **Tier 3 — multi-service / cross-system** | Two or more services degraded, or DB / network involved | Promote to Claude via safety-sensitive tier; consult Perplexity-first for the unknown. | DeepSeek → Claude (mandatory for auth/money/infra) |
| **Tier 4 — vendor-blocked** | Vendor returned a clear blocker | Stop, write a `t_drift_*` card with the vendor's quote, surface as a V3 carve-out for Marcelo. | Claude only |
| **Tier 5 — operator confusion** | The fix can't be diagnosed or applied autonomously | Stop. Write a postmortem to `~/.hermes/knowledge/postmortems/<service>-<date>.md`. Surface one-paragraph summary to Marcelo. **DO NOT keep iterating**. | (termination tier) |

**Critical rule:** Steps 0–3 are agent-owned. Only Steps 4–5 ever name Marcelo.

## 2. Snap-then-fix (Rule #8 in ops context)

Every non-trivial fix must run `git-snapshot-before-fix.sh` before any mutation. Examples of "non-trivial" for ops:

- `~/.hermes/config.yaml` edit (model defaults, fallback chains)
- `~/.hermes/cron/jobs.json` add/remove/enable/disable
- `~/.hermes/scripts/<important>.sh` patch
- PM2 `ecosystem.config.js` change
- Caddy / Nginx / Tailscale Serve / systemd unit / LaunchAgent edit
- Ollama model routing change

The flow inside a watchdog tick:

```
1. SNAP        → ~/.hermes/scripts/git-snapshot-before-fix.sh <repo> "<short-label>"
                  Capture SHA into the kanban card metadata.
2. APPLY       → Execute the fix.
3. STEP-5      → ~/.hermes/skills/.../step5-verdict-file.json (PASS|PASS-WITH-FIX|CHANGE-RECOMMENDED|FAIL).
4. PASS        → Commit the fix; report one-line summary.
   FAIL        → ~/.hermes/scripts/git-revert-last-fix.sh <repo> $SHA "step5-fail";
                  Report one-line "auto-reverted" summary.
5. REPORT      → Single 7-rule packet to BossMan → possibly to Marcelo.
```

## 3. No-spam constraint

Ops sub-agents must NEVER page Marcelo for routine watchdog observations. The default delivery policy is silent (Tier 0 writes to a log file, no message). Only the following trigger a Marcelo-visible message:

- Tier 3 promotion (multi-service, cross-system, DB, auth, money)
- Tier 4 (vendor blocker) — ALWAYS surface as a V3 carve-out
- Tier 5 (operator cannot auto-resolve) — surface with a postmortem file

Message format when paging Marcelo:

> "**OPS / [service]:** auto-fix applied (sha `<hash>`); Step-5 verdict `<verdict>`; snapshot at `<path>`. **Action needed:** [if Tier 4, what to confirm; if Tier 5, what to decide]. **Auto-revert path:** `~/.hermes/scripts/git-revert-last-fix.sh <repo> <sha> <reason>`."

## 4. Lane carve-outs

- **Trading:** Self-healing NEVER changes PAPER_MODE, NEVER re-enables a real-money bot, NEVER modifies money limits. Tier 2 or higher — V3 carve-out.
- **SquarePayouts:** Tier-0 diagnostic signals follow the standard V3 task-fit routing (Permanent 2026-09-14, Marcelo policy — no categorical model block). Risk-gated changes (payment execution, auth, PII, security/audit logging, customer-facing financial) require Step-5 QA + strongest-appropriate-model. Perplexity-first for unknown vendor errors.
- **Tailscale / OVH / vendor infra:** Two-factor or DNS changes require Tier 4 (operator approval). All other Tailscale Serve config changes go through Tier 1 snap+fix.

## 5. Forbidden patterns (Permanent 2026-08-06)

❌ Apply a fix without snapping first.
❌ Page Marcelo to interpret a log excerpt.
❌ Page Marcelo to retype a config the agent stack has in git.
❌ Keep iterating after Tier 5 — write a postmortem and stop.
❌ Suppress an alert because it feels noisy — fix the alert threshold, not the alert.
❌ Use a Tier 3 (Claude) verifier for a routine Tier 1 (restart) fix.
❌ Use M3 for a SquarePayouts cron (BLOCKED).

## 6. Compliance check

This policy is enforced by:
- `~/.hermes/scripts/pm2-canon-drift-check.sh` — md5 baselines for `LEARNED_PM2_HEALTH_MONITOR.md` + this file
- `~/.hermes/knowledge/hermes-canon-drift-check.sh` — weekly md5 across the canon set
- `~/.hermes/scripts/hermes-canon-drift-check.sh` — weekly GC of old `state/git-snapshots/`

A failure in either detector opens a `t_drift_ops_self_healing_<date>` card.

---

*Maintained by: ops sub-agent. Mirror: Obsidian + GitHub (per `hermes-canon-sync.sh`).*
