---
title: "2026-09-15 – Runtime Routing Closure"
date: 2026-09-15
type: closure-record
kanban: t_83288a97 (parent), t_248df694, t_c2c5923b
hermes_commit: e1653bd94e16b4e03560e8cab66862af2112b1c1
mirror_commit: fc5e89ab304b8888d9427ea502e3d11e743e4b39 (original-on-main) → 9af01ea (rewritten-on-closure-branch via cherry-pick onto base ce78a9f)
closure_record_commit: 74460c3 (original-on-main) → 3c832f0 (rewritten-on-closure-branch, verified remote tip)
sources_of_truth: ~/.hermes/knowledge/
---

# 2026-09-15 — Runtime Routing Closure

> **Status:** Evidence note. Canonical policy remains in `~/.hermes/knowledge/`. This note preserves verified closure evidence; it is NOT a competing source of truth.
> **Card:** `t_83288a97` (closure parent; done). Children: `t_248df694` (cron provider coverage; done), `t_c2c5923b` (ops profile `reasoning_effort`; done).
> **Commits:** Hermes canon `e1653bd94e16b4e03560e8cab66862af2112b1c1`. BossMan GitHub mirror `fc5e89ab304b8888d9427ea502e3d11e743e4b39` (original-on-main) → `9af01ea` (rewritten-on-closure-branch via cherry-pick onto base `ce78a9f`). Closure-record commit `74460c3` (original-on-main) → `3c832f0` (rewritten-on-closure-branch, verified remote tip).

## Verdict

**PASS** — runtime-routing hardening closed against the 2026-09-15 self-audit. No new public exposure, no new PM2/tunnel/port action, no canonical policy changes (only clarification + Drift Closure sub-section added to canon).

## What changed

### 1. Cron provider coverage closed

| Metric | Value |
|---|---|
| Total cron jobs audited | **42** |
| Jobs with explicit `provider` + `model` | **42 / 42** |
| Jobs with `null` provider or model (was 38 before closure) | **0** |
| Jobs with non-empty `fallback_chain` (was many unset, defaulting to global chain) | **0** |
| Automatic DeepSeek runtime fallback | **removed** |
| Automatic MiniMax runtime fallback | **removed** (M3 jobs are explicit primary routes only; no fallback inheritance) |

**Runtime distribution after closure:**

| Provider | Model | Job count | Tier |
|---|---|---|---|
| `custom` | `qwen2.5:7b` (Ollama) | 38 | routine + risk-gated carve-outs |
| `minimax` | `MiniMax-M3` | 4 | chatty / brief jobs explicitly approved for M3 |

The 4 M3 jobs are: Morning Pipeline Brief, CuaDriver Health Monitor, Weekly Hermes → Perplexity Spaces Refresh, Travel OS — Trip Reminder (consolidated). Their `fallback_chain: []` so they cannot silently fall through to DeepSeek or Claude if MiniMax is unavailable — they fail LOUD with a kanban alert.

### 2. Ops profile `reasoning_effort` patched

- `~/.hermes/profiles/ops/config.yaml:33` — `reasoning_effort: false` (was `medium` pre-closure)
- `~/.hermes/profiles/ops/config.yaml:312` — `reasoning_effort: 'false'` (delegation block; CLI stringifies but YAML-semantic identical to `false`)
- Core `~/.hermes/config.yaml` lines 32 + 478 already `false` per the 2026-07-25 patch

The pre-closure ops profile value (`medium`) would have caused Ollama builds to reject with HTTP 400 ("model does not support thinking") and silently fall through to DeepSeek via the credential pool. Closed via `hermes config set agent.reasoning_effort false` + `hermes config set delegation.reasoning_effort false` (the canonical mechanism per `LEARNED_CONFIG-PATCH-OLLAMA-ROUTING-20260725.md`).

### 3. Ollama smoke test

Direct POST to `http://localhost:11434/v1/chat/completions` with `model: qwen2.5:7b`, no thinking/reasoning parameters (mirrors `reasoning_effort: false` semantics):

```
HTTP 200
content: "Pong"
finish_reason: stop
usage: {prompt_tokens: 36, completion_tokens: 3, total_tokens: 39}
```

**No fallback observed. No unsupported reasoning parameters sent.**

### 4. SquarePayouts reconciliation (documentation only)

| Item | State |
|---|---|
| PM2 process `squarepayouts` | **online**, pid 6189 (uptime ~18.7 hours before closure began) |
| PM2 process `cloudflare-tunnel` | **online**, pid 6190 |
| Port 8030 binding | `node` pid 6215 listening on TCP `*:8030` |
| New `pm2 start` / `pm2 restart` issued during this closure | **none** |
| New tunnel action issued | **none** |
| New public-exposure change | **none** |

`LEARNED_SQUAREPAYOUTS.md` previously said "currently OFFLINE — restart pending Marcelo approval." That line was **stale doc text** — the runtime disagreed. Doc updated2026-09-15 with new §Live PM2 state reflecting observed state.

**Carve-out status UNCHANGED.** Any **new** `pm2 start`, `pm2 restart`, tunnel re-provision, port 8030 change, or public-internet exposure change for SquarePayouts still requires Marcelo approval (V3 carve-out). The reconciliation here is doc-only; it does not authorize further runtime changes.

### 5. Cosmetic follow-up (no runtime impact)

Ops profile line 312 `delegation.reasoning_effort` displays as quoted `'false'` because `hermes config set` stringifies its input. YAML-semantic identical to unquoted `false`. YAML parsers treat both equivalently. Smoke test confirms runtime behavior is safe. If strict unquoted boolean form is desired for canon-style consistency, a single one-line cosmetic patch is needed; it does not change behavior.

## Standing policy (Permanent 2026-09-15)

Codified in `LEARNED_V3_MODEL_STACK.md` §Drift Closure 2026-09-15 + `ROUTING-RULES.md` §3.1 (both canonical + Obsidian + GitHub mirrors):

- Unattended cron/PM2 execution routes to **M3 or Ollama only**.
- **DeepSeek is helper-only** — must NEVER be an automatic primary or fallback provider for cron/PM2.
- **MiniMax must NEVER be an automatic fallback provider** for cron/PM2. M3 may be the explicit primary when chosen by BossMan, but the *fallback* chain for cron/PM2 runtime is Ollama-local only.
- **Claude and OpenAI are interactive** planning / architecture / quality / risk-gated review models — NOT unattended runtime defaults.
- Payment, auth, PII, security, audit-logging, and customer-facing financial work retain mandatory risk-based QA gates and must fail loudly or escalate if the approved route is unavailable.

## Drift scan result

Canonical files vs Obsidian V3-Canon mirrors (model stack, routing rules, token economics) — all six files reviewed for the forbidden-pattern set:

- ❌ "DeepSeek is automatic cron/PM2 fallback"
- ❌ "MiniMax is automatic cron/PM2 fallback"
- ❌ "cron/PM2 inherits global paid-provider fallback"
- ❌ "DeepSeek primary for cron or PM2"
- ❌ Blanket restrictions preventing BossMan task-fit selection

**Zero mismatches found.** The only matches are the new policy statements themselves (the §3.1 / §Drift Closure paragraphs explicitly forbidding those patterns). The "ops: ... DeepSeek for PM2/cron/infra debugging" line in `LEARNED_V3_MODEL_STACK.md` per-profile table is intentional and refers to **interactive** multi-step debugging sessions where BossMan actively orchestrates — it is correctly distinguished from unattended runtime cron/PM2 jobs by the new §Drift Closure sub-section.

## No new public exposure, no service change

- No `pm2 start` / `pm2 restart` / tunnel / port / DNS / firewall change.
- No secrets rotated, no credentials touched.
- No application code, payment logic, customer data, or auth flow modified.
- No canonical policy altered except for adding §Drift Closure 2026-09-15 + §3.1 sub-sections (clarification, not policy change) and the §Live PM2 state doc reconciliation in `LEARNED_SQUAREPAYOUTS.md`.

## Evidence trail

- `git -C ~/.hermes log -1 e1653bd` → "drift-closure: runtime routing (cron provider coverage + ops profile reasoning_effort)"
- `git -C ~/Repos/BossMan log -1 fc5e89a` → "mirror: drift-closure runtime routing 2026-09-15"
- `jq '.jobs | length' /Users/bigdawg/.hermes/cron/jobs.json` → `42`
- `jq '[.jobs[] | select(.provider != null and .model != null)] | length' …` → `42`
- `jq '[.jobs[] | select(.fallback_chain | length > 0)] | length' …` → `0`
- `pm2 jlist | jq '…squarepayouts…'` → `pid=6189 status=online` (uptime 1789434487303 = 2026-09-14 18:08 PT, 18.7 hours before closure)
- `lsof -nP -i :8030` → `node 6215 … TCP *:8030 (LISTEN)`
- Ollama smoke test (above): HTTP 200, no fallback, no unsupported params.

## Marcelo-only decision

**None.** Closure was fully agent-owned within BossMan authority. No V3 carve-out was invoked, no new public exposure was created, and no canonical policy was changed.