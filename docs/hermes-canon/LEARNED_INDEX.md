# LEARNED_INDEX.md — Master Index of All `LEARNED_<DOMAIN>.md` Canon Files

**Status:** Permanent (refreshed 2026-07-22, Card t_learned_domain_index_20260722).
**Purpose:** Single map of all per-system / per-domain canon files. Kernel-docs (SOUL.md, AGENTS.md, ROUTING-RULES v3) point into `LEARNED_*` for ownership/architecture/repair details. This index is the map of all domains.

---

## How to use this index

1. **Find a domain:** look for the row matching your system (PMD, PM2 Health Monitor, Travel OS, etc.).
2. **Read the file:** open the listed `LEARNED_<DOMAIN>.md` for the canonical rules, ownership model, and repair playbooks.
3. **Add a new domain:** write `LEARNED_<DOMAIN>.md` under `~/.hermes/knowledge/`, mirror to Obsidian + BossMan repo, add a row here.

**Mirrors:** This file lives in 3 places — `~/.hermes/knowledge/LEARNED_INDEX.md` (canonical), `~/Obsidian/Hermes/V3-Canon/V3 – LEARNED_INDEX.md`, `~/Repos/BossMan/docs/hermes-canon/LEARNED_INDEX.md`. All 3 must md5-match (verified by `~/.hermes/scripts/hermes-canon-drift-check.sh`).

**Size budget:** target ≤ 8 KB (a single index table; per-domain detail lives in the `LEARNED_*.md` files themselves).

---

## Master index (24 files)

| # | Domain | Path | Size | Scope summary | Lane / Owner | Last-updated |
|---|--------|------|------|---------------|--------------|--------------|
| 1 | **7-Rule Contract** | `LEARNED_7_RULE_CONTRACT.md` | 9.8 KB | Marcelo's operating preferences for BossMan + sub-agents (Rule #0–#7a, V3 governance). | BossMan (kernel) | 2026-07-22 |
| 2 | **Altus Forensic** | `LEARNED_ALTUS_FORENSIC.md` | 0.9 KB | Altus Forensic ownership rule (extracted from SOUL.md 2026-07-22). | client-hub sub-agent | 2026-07-22 |
| 3 | **Basecamp Workflow** | `LEARNED_BASECAMP_WORKFLOW.md` | 4.0 KB | Basecamp autonomous workflow + retirement rule (extracted from SOUL.md 2026-07-22). | Basecamp sub-agent | 2026-07-22 |
| 4 | **Brave-Perplexity Bridge** | `LEARNED_BRAVE_PERPLEXITY_BRIDGE.md` | 4.6 KB | Brave browser ↔ Perplexity.ai integration (Cloudflare-bypass patterns). | research-intel sub-agent | 2026-06-24 |
| 5 | **Client Review Portal** | `LEARNED_CLIENT_REVIEW_PORTAL.md` | 2.2 KB | Client review portal + helpdesk ticket system operating model. | client-hub sub-agent | 2026-07-22 |
| 6 | **Default Build Flow** | `LEARNED_DEFAULT_BUILD_FLOW.md` | 6.5 KB | V3 default build flow: research → design → build → harden → QA → docs. | BossMan (kernel) | 2026-07-15 |
| 7 | **Health OS V3 Decisions** | `LEARNED_HEALTH_OS_V3_DECISIONS.md` | 2.4 KB | Health OS V3 architectural decisions + decision logic. | health-os sub-agent | 2026-07-20 |
| 8 | **Health OS V3 Reporting** | `LEARNED_HEALTH_OS_V3_REPORTING.md` | 2.0 KB | Health OS V3 strict-grade shopping list reporting shape. | health-os sub-agent | 2026-07-20 |
| 9 | **LBC35 Telegram Spam Incident** | `LEARNED_LBC35_TELEGRAM_SPAM_INCIDENT.md` | 5.3 KB | LBC35 Telegram spam incident (2026-07-20) — rule: no autonomous Telegram. | BossMan (kernel) | 2026-07-21 |
| 10 | **Pentest Reporting** | `LEARNED_PENTEST_REPORTING.md` | 3.7 KB | Pentest reporting standards for all security audits (extracted from AGENTS.md 2026-07-22). | qa-verification sub-agent | 2026-07-22 |
| 11 | **PM2 Health Monitor** | `LEARNED_PM2_HEALTH_MONITOR.md` | 22.8 KB | PM2 detection rules (D1–D9b), auto-repair playbooks (R1–R5), CLI wrapper policy, pmd-web auto-repair. **Write-protected** by `pm2-canon-drift-check.sh`. | ops sub-agent | 2026-07-22 |
| 12 | **PMD (Property Management Dashboard)** | `LEARNED_PMD.md` | 6.8 KB | PMD architecture, basePath history, build/start commands, health expectations. | PMD sub-agent | 2026-07-22 |
| 13 | **PMD Dashboards** | `LEARNED_PMD_DASHBOARDS.md` | 4.3 KB | PMD + production dashboards autonomous-by-default operating model. | PMD sub-agent | 2026-07-22 |
| 14 | **PMD Valuation Integration** | `LEARNED_PMD_VALUATION_INTEGRATION.md` | 5.7 KB | PMD valuation integration with portfolio analytics. | PMD sub-agent | 2026-07-21 |
| 15 | **SquarePayouts** | `LEARNED_SQUAREPAYOUTS.md` | 2.6 KB | SquarePayouts ownership rule + Claude/DeepSeek/OpenAI model restriction (M3 BLOCKED). | BossMan (kernel) | 2026-07-22 |
| 16 | **Standing Authorities** | `LEARNED_STANDING_AUTHORITIES.md` | 6.7 KB | Standing authorities + health monitors (PM2 Health Monitor, Gateway + CuaDriver). | BossMan (kernel) | 2026-07-22 |
| 17 | **Storis API** | `LEARNED_STORIS_API.md` | 7.6 KB | Storis API durable takeaways (OpenAPI 3.0.4, 239 paths, 1179 schemas). | Altus sub-agent | 2026-06-24 |
| 18 | **Sub-Agent Master Blueprint** | `LEARNED_SUB_AGENT_MASTER_BLUEPRINT.md` | 10.6 KB | Sub-agent lane discipline + handoff contracts. | BossMan (kernel) | 2026-07-22 |
| 19 | **Travel OS** | `LEARNED_TRAVEL_OS.md` | 3.8 KB | Travel OS Tailscale/PM2/watchdogs canon + canonical handoff repo. | travel sub-agent | 2026-07-22 |
| 20 | **User Preferences — Autonomous Mode** | `LEARNED_USER_PREFERENCES_AUTONOMOUS_MODE.md` | 2.4 KB | Marcelo's autonomous-only operator preference (extended detail). | BossMan (kernel) | 2026-07-20 |
| 21 | **V3 Baseline** | `LEARNED_V3_BASELINE.md` | 2.1 KB | V3 baseline: governance, model roles, escalation rules. | BossMan (kernel) | 2026-07-20 |
| 22 | **V3 Model Stack** | `LEARNED_V3_MODEL_STACK.md` | 11.7 KB | V3 model roles + task-type routing (canonical model authority). | BossMan (kernel) | 2026-07-20 |
| 23 | **V3 Token Economics** | `LEARNED_V3_TOKEN_ECONOMICS.md` | 6.5 KB | V3 token economics + cost tiers + fallback chains. | BossMan (kernel) | 2026-07-20 |
| 24 | **V4 Canonical Lock** | `LEARNED_V4_CANONICAL_LOCK.md` | 6.0 KB | V4 Health OS canonical lock (do-not-modify rules). | health-os sub-agent | 2026-07-15 |

**Total: 24 files / ~141 KB.**

---

## Cross-references

- **SOUL.md** `§"Per-system Canon — Pointers"` references this index as the master list.
- **AGENTS.md** `§"Project-Specific Content — Moved to LEARNED_*.md"` documents historical moves; this index is the current state.
- **ROUTING-RULES v3** uses these LEARNED files for sub-agent lane assignments and standing authorities.
- **hermes-canon-drift-check.sh** (weekly) checks 5 of these + AGENTS.md + SOUL.md for md5 drift. **pm2-canon-drift-check.sh** (per-section) protects 3 sections of `LEARNED_PM2_HEALTH_MONITOR.md`.

---

## Maintenance

- **Adding a new domain:** write `LEARNED_<DOMAIN>.md` → mirror to 3 locations → add a row here → register in `hermes-canon-drift-check.sh` if size > 2 KB.
- **Renaming a domain:** create new file, redirect old file (use markdown link), update SOUL/AGENTS/ROUTING-RULES pointers, update this index.
- **Deprecating a domain:** mark file with `# DEPRECATED YYYY-MM-DD` header, do NOT delete (audit trail), keep row here with `Deprecated: YYYY-MM-DD`.
- **Drift detection:** the weekly `hermes-canon-drift-check.sh` checks size + md5 of the 5 registered files. If you add a new LEARNED file, register it there too (or accept that it won't be drift-checked until the next quarterly audit).

---

**Maintained by:** knowledge-canon sub-agent on BossMan's behalf.
**Last refresh:** 2026-07-23 (Card t_loop_engineering_profile_v1_20260723 — added loop-engineering-goals.md).
**Next refresh:** quarterly (or on demand when a new domain is added).

---

## Related non-`LEARNED_*` canon files (sub-agent profiles + lane contracts)

These files are part of the hermes-canon even though they don't use the `LEARNED_` prefix. Listed here for navigation.

| File | Lane | Purpose |
|---|---|---|
| `~/.hermes/knowledge/loop-engineering-goals.md` | loop-engineering | Sub-agent profile + canon contract for the loop-engineering lane (loop design, weekly review cadence, recurring progress machinery). Mirrored 3 ways. |

The `LEARNED_INDEX.md` is the map of `LEARNED_*` canon files only. Per-sub-agent profile files (lives outside `LEARNED_*`) are listed in this section and cross-referenced from AGENTS.md §"Per-lane canonical files".

**Drift detection:** These files are NOT auto-tracked by `hermes-canon-drift-check.sh` (which only handles the LEARNED set + AGENTS + SOUL). Loop Engineering profile updates register their own drift check manually when material.
