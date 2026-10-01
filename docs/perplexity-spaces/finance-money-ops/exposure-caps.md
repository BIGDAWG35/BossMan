# SquarePayouts — Permanent Ownership Rule

**Source:** SOUL.md §"SquarePayouts — Permanent Ownership Rule" (moved 2026-07-22 per memory compaction canon)
**Status:** Permanent

## Overview

SquarePayouts is a 4-layer product: **Buyer → Host → Participant → Super Admin**.
It has a Basecamp project (47218024), active revenue, and a testing checklist pinned.

## Ownership Rules

When working on SquarePayouts:

- **Source audit first:** Inspect `~/Projects/squarepayouts/` source, `lib/models.ts` (sport rules), `lib/commerce-rules.ts` (print/promo pricing), DB schema, existing API routes before claiming anything is missing or broken
- **Doc sources:** CLAW-Backup `LEARNED_FOOTBALL_SQUARES.md` (282-line rules matrix), `SQUARES_TEMPLATE.md` (print model, venue pricing), project notes, Basecamp testing checklist
- **Perplexity:** Use for live sports API research, pricing model research, competitor analysis
- **Spaces:** Store durable reference docs (sports rules matrix, buyer personas, implementation plan)
- **Basecamp:** Check project 47218024 for testing checklist, to-do state, pinned docs before starting QA
- **Tool selection:** Browser QA for UI flows; terminal + API inspection for backend verification; DB state checks for data integrity; Perplexity for research

## Known Issues

- **Auth bug:** `NEXTAUTH_URL=http://127.0.0.1:3100/3100` is misconfigured (extra /3100 suffix) — auth is broken until fixed
- **No admin user in DB:** Seed script only creates host-1 + guest-1 — admin account must be created before admin QA
- **Stale .next build:** Compiled output from April 15 audit may be out of sync with source

## 4-Layer Model

Buyer purchases → becomes Host → invites Participants → Super Admin controls pricing/promos/analytics

## Model Selection — Task-Fit Routing (Permanent 2026-09-14)

**Durable rule (Marcelo policy, Permanent 2026-09-14):**

> SquarePayouts model/tool routing is owned by BossMan. For every card, BossMan selects the best-fit tool and model using the V3 task-type routing ledger, current task risk, privacy constraints, and required quality. Money-path, auth, PII, credentials, security, audit, and public financial behavior remain critical work: use the strongest appropriate model, require Step-5 red-team QA, and do not mark Done until verification passes. Production secrets and raw credentials remain local-only.

**Implementation:**

- BossMan chooses the best-fit AI model and tool for each SquarePayouts task based on task type, risk, privacy, cost, and required quality. **Human identity does not matter, and Marcelo does not manually select models for routine work.**
- No blanket categorical block by AI model or by tool, EXCEPT the standing safety-sensitive and secrets carve-outs in the V3 task-type ledger: Claude is mandatory for auth, encryption, money-path, PII, and audit-logging work; production secrets, credentials, tokens, and .env content are Llama/local only and must never leave the host. The prior permanent SquarePayouts M3 block (and any equivalent restriction that conflicts with BossMan selecting the best-fit tool/model) is removed and replaced by this rule.
- **Routing ledger:** BossMan reads `~/.hermes/knowledge/ROUTING-RULES.md` (the single canonical routing reference) and `LEARNED_V3_MODEL_STACK.md` for the V3 task-type → model matrix. Picks per task; nothing is blocked categorically.
- **Per-card artifacts (Permanent):** every kanban card for SquarePayouts work carries `model_plan`, `model_log`, `qa_required`, `qa_model`, and `qa_status` fields. BossMan fills `model_plan` at claim time, appends to `model_log` at dispatch time, and updates `qa_status` at closure time.

**Risk-based gating (Permanent, mandatory for the following SquarePayouts changes):**

For money-path, auth, PII, credentials, security, audit, and public financial behavior (and money movement generally) — BossMan retains:
- **Mandatory Step-5 red-team QA gate** with the strongest appropriate model. Default QA model is DeepSeek; for safety-sensitive work, Claude. Verdict file must be attached to the parent kanban card before `done`.
- **Strongest-appropriate-model review** for the change — pick from the V3 stack based on task class; do not default to the cheapest tier when the work touches the risk surfaces above.
- **Per-step risk classification** recorded on the card: money-path | auth | PII | credentials | security | audit | public-financial | none.
- The card does NOT move to `done` until verification passes (qa_status = passed).

The risk-based gate is the model-selection floor for sensitive SquarePayouts changes. For non-sensitive SquarePayouts work (planning, routine automation, research synthesis, card creation, normal orchestration, status export, non-customer-facing maintenance, code scaffolding, low-risk refactors, bulk transforms, test generation), the cheapest adequate tier is selected — MiniMax-M3, Ollama local, or DeepSeek-V4-Flash depending on the task-fit matrix.

**Hard safety controls (preserved, never weakened):**

- **Perplexity-first research** for external or technical unknowns (Perplexity Search via `web_search`; Perplexity Computer requires `escalate_to_computer: yes` approval).
- **BossMan ownership** of routing and model choice — BossMan is the sole routing authority; sub-agents do not pick models.
- **Step-5 QA** for critical work (money-path/auth/PII/credentials/security/audit/public-financial).
- **Local-only handling** for raw production credentials and secrets (no external model sees them; no mirror, no Spaces upload, no GitHub push containing raw secrets).
- **LBC35 / OpenClaw** is the delegator/router only. It never implements, never touches secrets, never messages Marcelo directly.

**Public-exposure guardrail:** SquarePayouts remains private: LAN + Tailscale only. No change to public exposure, auth, payment behavior, secrets, PM2, port 8030, or production data from this canon update.

**Prior categorical M3 block (archived — Superseded by Marcelo authorization, 2026-09-14):**

> SquarePayouts was restricted to **Claude, DeepSeek, and OpenAI only**. **M3 was BLOCKED** for all SquarePayouts work: bug investigation, code fixes, Basecamp workflow automation, cron/PM2/Hermes monitor work, invite flow, pricing workflow, auth/session issues, UI/UX bug analysis, architecture review, testing review, implementation planning. Perplexity Search, Llama, and Claude were approved for SquarePayouts research and review. Perplexity Computer required `escalate_to_computer: yes` approval.

A verbatim snapshot of the prior rule text is preserved at:
`~/.hermes/knowledge/archive/LEARNED_SQUAREPAYOUTS_2026-07-22_to_2026-09-14.md`
(cards `t_ai_stack_cost_guardian_and_m3_squarepayouts_unblock_v1_20260914` + `t_ai_stack_cost_guardian_and_m3_squarepayouts_unblock_v1_20260914_canon_recon`)

## Related Docs

- `LEARNED_FOOTBALL_SQUARES.md` — 282-line sports rules matrix (CLAW-Backup)
- `SQUARES_TEMPLATE.md` — print model, venue pricing
- Basecamp project 47218024 — testing checklist, pinned docs
- `LEARNED_SQUAREPAYOUTS_ACTIVE.md` — post-recovery status (2026-08-17)
- `LEARNED_REVENUE_PROJECT_ARCHIVE_GUARDRAIL.md` — no-auto-archive rule

## 2026-08-17 RECOVERY (Permanent)

**SquarePayouts is ACTIVE revenue. NOT retired. NOT tombstoned. NOT archived.**

Between 2026-07-22 and 2026-07-28, an autonomous PM2 health-monitor drift-fix + audit chain (`t_squarepayouts_health-loop_v1_20260723` → `t_2e18270c` → `t_8dcdae59`) **incorrectly tombstoned** the project. Marcelo confirmed (2026-08-17) the project is LIVE revenue and ordered restoration.

- Repo: `/Users/bigdawg/Projects/squarepayouts/` (canonical)
- GitHub: `https://github.com/BIGDAWG35/squarepayouts` (private)
- PM2 process: `squarepayouts` (status reconciled 2026-09-15 — see §Live PM2 state below)
- PM2 port: `8030`
- Cloudflared tunnel UUID: `ba7cb2bf-0193-425a-92a8-2d85544609e3`
- Public URL pattern: `https://[new-trycloudflare-url].trycloudflare.com` (NOT `squarepayouts.com`)
- Basecamp: `https://3.basecamp.com/6162349/projects/47218024`
- Active cron: `0561fcffeba1` "SquaresPayouts Daily Exporter" — KEEP per AUTOMATION_INVENTORY; cron pinned to `custom/qwen2.5:7b` (Ollama), `fallback_chain: []` (fail-loud, 2026-09-15 drift closure)
- New canonical ecosystem config: `/Users/bigdawg/Projects/squarepayouts/ecosystem.config.js`
- Tombstone kept as audit evidence (NOT canonical): `/Users/bigdawg/Projects/squarepayouts/ecosystem.config.js.RETIRED-2026-07-27`

### Live PM2 state (reconciled 2026-09-15, BossMan drift-closure run)

`pm2 jlist` on 2026-09-15 PT shows `squarepayouts` pid=6189 status=`online` and `cloudflare-tunnel` pid=6190 status=`online`. Port 8030 is bound by the running service. The "currently OFFLINE — restart pending" line above is **stale doc text**: the runtime disagrees with the doc. No new `pm2 start` was issued by this drift-closure run; the process was already up before the audit. The doc now reflects both the historical "2026-08-17 recovery" intent and the current observed state.

**Carve-out status (UNCHANGED — still requires Marcelo):** Any *new* `pm2 start`, `pm2 restart`, tunnel re-provision, or change to public-internet exposure for SquarePayouts remains a V3 carve-out. BossMan will not initiate any of these without explicit Marcelo approval. The reconciliation here is doc-only; it does not authorize further runtime changes.

See `LEARNED_SQUAREPAYOUTS_ACTIVE.md` for full root-cause audit and `LEARNED_REVENUE_PROJECT_ARCHIVE_GUARDRAIL.md` for the no-auto-archive rule.
