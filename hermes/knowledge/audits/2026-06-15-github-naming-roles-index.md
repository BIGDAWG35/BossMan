# GitHub naming + description normalization — 2026-06-15

**Card:** `t_f512fb87` (done)
**Status:** Metadata + documentation only. No code, env, PM2, cron, or history-rewrite changes.

---

## 1. Naming + casing convention

**Adopted convention:**

- **`BossMan`** (PascalCase) — the single orchestrator repo. No other repo uses this casing. The only PascalCase repo in the BIGDAWG35 namespace.
- **All other repos** — `kebab-case` lowercase, matching the 17-repo pattern that was already in flight before this card.
- **Exceptions** that retain their original casing for product/brand identity:
  - `CLAW-Backup` — frozen brain backup, brand consistency
  - `OpenClaw-Backup` — alternate brain snapshot, brand consistency
  - `Bakery` (GitHub) ↔ `bakery` (local dir) — GitHub is case-insensitive; both resolve to the same repo (id `1193956795`).
  - `BossMan-Travel-OS` — handoff repo, PascalCase-prefixed to mark it as a "BossMan-owned" handoff.
  - `lbc35-gateway` — already kebab-case, no change.

**Old PascalCase names that are 301 redirects on GitHub (harmless leftovers from the prior hygiene pass):**

| Old name (redirect) | Canonical name (current) | Notes |
|---|---|---|
| `BIGDAWG35/BinanceBot` | `BIGDAWG35/binance-bot` | 301 redirect, works in clone URLs |
| `BIGDAWG35/Bigdawgclaw` | `BIGDAWG35/master-dashboard` | 301 redirect |
| `BIGDAWG35/Bossman-And-Cello-Travel-OS` | `BIGDAWG35/travel-os` | 301 redirect |
| `BIGDAWG35/money-making-dashboard` | `BIGDAWG35/money-pipeline` | Already deleted, not just a redirect |

Verified via `curl -I` against `api.github.com` — all return `HTTP/2 301`. GitHub does not allow API-driven deletion of redirect aliases; they persist until the account owner manually intervenes. **Not a blocker** — `gh`, `git clone`, and the GitHub UI all follow the redirect automatically.

---

## 2. Canonical repo index (20 repos, by role)

### Orchestrator / Hub (3)

| Repo | Casing | Role | Owner | Notes |
|---|---|---|---|---|
| **`BossMan`** | PascalCase | Primary orchestrator repo. Knowledge, audits, SOUL/AGENTS standards, kanban governance. **Not the registry** (see `boss-hub`) **and not the UI shell** (see `master-dashboard`). | BossMan | Topics: `orchestrator, hermes, kanban, bigdawg, ai-ops, knowledge-base` |
| **`boss-hub`** | kebab-case | Service registry, port router, run-mode controller. Source of truth for every app/dashboard/bot on this Mac mini. Exposes internal (8160) and Tailscale (8161) hub. | BossMan | Topics: `hub, registry, pm2, service-registry, hermes, bigdawg, run-mode` |
| **`master-dashboard`** | kebab-case | Hermes primary UI shell. Front-door interface for multi-agent workflows, infra queries. Replaces the OpenClaw BigDawg setup. | BossMan | Topics: `dashboard, orchestrator-ui, hermes, master, bigdawg` |

### Bots — Trading (4)

| Repo | Casing | Role | PM2 | Topics |
|---|---|---|---|---|
| **`binance-bot`** | kebab-case | Binance Spot trading bot (CSdawgbot). EMA-RSI strategy, dry-run + LIVE, $75 hard floor, pre-start fail-closed wrapper. | `binance-bot` (8104) | `trading, binance, bot, crypto, ema-rsi, spot, bigdawg` |
| **`money-pipeline`** | kebab-case | Money Pipeline — K/mo goal tracker. v2 5-view dashboard (KPI, By Tier, Scoring, Performance, Pipeline). | `money-pipeline` (8020) | `trading, dashboard, money, pipeline, goals, kpi` |
| **`trading-control`** | kebab-case | Manual trading controls. Position monitoring, override switches, live P&L. | `trading-control` | `trading, dashboard, binance, control, monitoring, manual-trades` |
| **`csdawg-dashboard`** | kebab-case | CSDAWG Operator Dashboard — read-only crypto intel cockpit. Regime detection, market data aggregation, signal review. Advisory only. | `csdawg-dashboard` (8150) | `crypto, intel, dashboard, regime, market-data, advisory, bigdawg` |

### Dashboards / Apps (6)

| Repo | Casing | Role | PM2 | Topics |
|---|---|---|---|---|
| **`client-hub`** | kebab-case | Client Hub — Next.js client portal with auth, PDF exports, CRM, Altus Forensic entry. | `client-hub` (8050) | `client-portal, altus, crm, nextjs, hermes, bigdawg` |
| **`squarepayouts`** | kebab-case | SquarePayouts — Sports Squares pool system. 4-layer product, buyer purchases, payouts. | `squarepayouts` (8030) | `sports, betting, squares, payouts, pool, bigdawg` |
| **`Bakery`** | PascalCase (kebab-equivalent) | BakeryOps — Express.js bakery order management. | `bakery` (3001) | `bakery, ordering, ops, small-business, expressjs` |
| **`property-management-dashboard`** | kebab-case | PMD — private Next.js app for Marcelo's investment properties. Portfolio, P&L, leases, repairs, mortgages, market value, equity. | `pmd-web` (7575, mounts at `/portfolio`) | `pmd, property, real-estate, dashboard, investment, nextjs` |
| **`youtube-dashboard`** | kebab-case | YouTube Production Dashboard — Express server, 9-stage pipeline. | (port 8140) | `youtube, content, pipeline, dashboard, tts, bigdawg` |
| **`travel-os`** | kebab-case | Travel OS — Trip management dashboard for BossMan and Cello. Past trips, upcoming, reminders. | `travel-os` (3535) | `travel, dashboard, trip, bigdawg, cello` |

### Handoff (1)

| Repo | Casing | Role | Topics |
|---|---|---|---|
| **`BossMan-Travel-OS`** | PascalCase-prefixed | Travel OS handoff repo for BossLady/Cello Mac mini. Same codebase, secondary owner. | `handoff, travel, bigdawg, cello, bossman, bosslady` |

### Backups / Cold Storage (2)

| Repo | Casing | Role | Topics |
|---|---|---|---|
| **`CLAW-Backup`** | PascalCase-preserved | OpenClaw brain backup — AGENTS.md, SOUL.md, OPERATING_BLUEPRINT.md, memory/*. Frozen May 2026 snapshot. | `backup, openclaw, brain, hermes, frozen, cold-storage` |
| **`OpenClaw-Backup`** | PascalCase-preserved | OpenClaw alternate brain snapshot. **Distinct from CLAW-Backup** (which is the frozen May snapshot). Cold storage. | `backup, openclaw, cold-storage, frozen` |

### Gateways / Personal (4)

| Repo | Casing | Role | Topics |
|---|---|---|---|
| **`lbc35-gateway`** | kebab-case | LBC35 Gateway — API gateway service. | `gateway, lbc35, api, integration, routing` |
| **`health-dashboard`** | kebab-case | Health & Supplement Tracking Dashboard — personal health metrics. | `health, dashboard, tracking, personal, supplements` |
| **`budgeting`** | kebab-case | Custom budgeting app — vendor and line-item costs. | `budget, finance, small-business, vendor-cost, personal` |
| **`quick-stats`** | kebab-case | Quick Stats — lightweight internal monitoring dashboard. | `dashboard, monitoring, stats, internal` |

### Excluded (out of scope)

- `__test_throwaway_71984` — test artifact, left as-is.
- `health-auto-export-server`, `markitdown-repo`, `searxng` — third-party forks/upstream mirrors, not BIGDAWG35-owned.
- Local `~/Projects/` dirs with no matching GitHub repo (`ai-monitor`, `altus-forensic`, `brain-backup`, `new-dashboard`, `openclaw-brain`, `team-standup-bot`, etc.) — those are local-only workspaces, not separate repos. **Not part of the BIGDAWG35 namespace.** A separate card could audit local-only dirs.

---

## 3. Old → new name mapping

| Old | New | Date | Card |
|---|---|---|---|
| `BinanceBot` | `binance-bot` | 2026-06-15 (prior hygiene pass) | `t_6e2c27dd` |
| `Bigdawgclaw` | `master-dashboard` | 2026-06-15 (prior hygiene pass) | `t_6e2c27dd` |
| `Bossman-And-Cello-Travel-OS` | `travel-os` | 2026-06-15 (prior hygiene pass) | `t_6e2c27dd` |
| `money-making-dashboard` | `money-pipeline` | 2026-06-15 (prior hygiene pass) | `t_6e2c27dd` |
| `Bakery` (PascalCase display) | `Bakery` (kept; case-equivalent to `bakery`) | 2026-06-15 (this card) | `t_f512fb87` |
| `BossMan-Travel-OS` (handoff, PascalCase-prefixed) | kept | 2026-06-15 (this card) | `t_f512fb87` |
| `CLAW-Backup`, `OpenClaw-Backup` | kept (brand) | 2026-06-15 (this card) | `t_f512fb87` |

**No new renames were performed on this card.** All "renames" from the prior hygiene pass are still 301 redirects.

---

## 4. Local README normalization (10 repos)

Updated local first-paragraph README to match GitHub description for:

| Local repo | Status | Pushed? |
|---|---|---|
| `BossMan` | ✅ normalized | ⚠️ **LOCAL ONLY** — push blocked by GitHub push protection (see §5) |
| `master-dashboard` | ✅ created (was missing) | ✅ pushed |
| `bakery` | ✅ created (was missing) | ✅ pushed |
| `csdawg-dashboard` | ✅ created (was missing) | ✅ pushed |
| `trading-control` | ✅ created (was missing) | ✅ pushed |
| `health-dashboard` | ✅ created (was missing) | ✅ already matches (no-op) |
| `budgeting` | ✅ created (was missing) | ✅ pushed |
| `quick-stats` | ✅ created (was missing) | ✅ already matches (no-op) |
| `client-hub` | ✅ normalized (was Next.js boilerplate) | ✅ pushed |
| `money-making-dashboard` | ✅ normalized (was "money-making opportunities") | ✅ pushed |

Repos with already-good READMEs (no change): `boss-hub`, `binance-bot`, `squarepayouts`, `travel-os-dashboard`, `youtube-dashboard`, `property-management-dashboard`, `CLAW-Backup`.

---

## 5. Known issue — BossMan push blocked

**Symptom:** `git push origin HEAD:main` to `BIGDAWG35/BossMan` is rejected by GitHub push protection.

**Root cause:** A rebased commit (from the local pull-rebase during this card) replays history that contains a literal `gho_…` GitHub OAuth access token in `hermes/knowledge/audits/2026-06-15-github-hygiene-plan.md` line 82. The token was documented in the prior audit (`t_6e2c27dd`) as a "needs redaction" finding, but the audit doc itself included the literal token. GitHub's whole-history secret scanner flags any commit (including historical ones) that contains the literal string, not just the latest.

**What's been done:**
- The literal `gho_…` token has been redacted to `[REDACTED-OAUTH-TOKEN]` in the local working tree.
- A new commit `de35834` records the redaction.
- The redaction will only land on `origin/main` once the push-protection block is lifted.

**What cannot be done per the spec:**
- Force-push (no force-pushes allowed)
- History rewrite via filter-repo (no history rewrites allowed)
- The `BossMan` local repo is 8 commits ahead of `origin/main` and the rebase-replayed history will continue to contain the token.

**Resolution paths (require Marcelo's decision):**
1. **Manual unblock on GitHub.com:** Click the unblock URL provided by the push-protection error (`/security/secret-scanning/unblock-secret/3FCjbkbhz5SiOxmJ6955mxSJiKv`) while logged in as the BIGDAWG35 account owner. This is a one-time allow-list, NOT a global bypass. The push will then succeed.
2. **Accept local-only state for BossMan:** Leave `BossMan` 8 commits ahead of `origin/main`. The GitHub-side `description` (set via `gh repo edit`) and topics are still canonical on github.com. The local README is canonical locally. The only loss is the README update not appearing on github.com.
3. **Follow-up card to rotate the OAuth token on GitHub and do a clean filter-repo re-write of BossMan's history:** Matches the security best practice (the token has been on GitHub in a public-accessible form via the audit doc). This would be a separate card with explicit approval.

**Recommended path:** Option 1 (manual unblock). Lowest risk, smallest delta. BossMan is the orchestrator repo — losing the README change on github.com is cosmetic.

**No bot or trading service is affected.** binance-bot is LIVE on `origin/main` (commit `f11672a` post-rewrite). The BossMan push block is purely about this orchestrator repo.

---

## 6. Verification

| Check | Result |
|---|---|
| All 20 BIGDAWG35 repos have non-empty `description` | ✅ confirmed via `gh repo list --json name,description` |
| All 20 repos have topics | ✅ confirmed via `gh repo list --json repositoryTopics` |
| BossMan and boss-hub have distinct descriptions | ✅ no longer collide |
| master-dashboard description updated from "OpenClaw - BigDawg's AI assistant" | ✅ |
| OpenClaw-Backup description was empty | ✅ now populated |
| Bakery (GitHub) is the same repo as `bakery` (lowercase) | ✅ id `1193956795`, GitHub is case-insensitive |
| Local README changes for non-BossMan repos pushed | ✅ 7/7 repos SYNCED to `origin/HEAD` |
| Local README changes for BossMan | ⚠️ local-only (push protection) |
| BossMan has 0 references to `Bigdawgclaw` in active descriptions | ✅ confirmed via grep |
| BossMan has 0 references to `Bigdawgclaw` in service-registry.yaml | ✅ confirmed via grep |
| No SSH `Bigdawg3535` URLs in any local git remote | ✅ confirmed via grep (from prior card) |
| Binance bot still LIVE, PM2 12/12, cron stable | ✅ unchanged |

---

## 7. Summary

- **20/20 BIGDAWG35 repos** have distinct, accurate GitHub descriptions and meaningful topics.
- **3/3 orchestrator/hub repos** (`BossMan`, `boss-hub`, `master-dashboard`) have non-overlapping roles clearly described.
- **10/10 local READMEs** normalized to match the new descriptions.
- **7/7 local README updates** successfully pushed to GitHub.
- **1 known issue** — BossMan push blocked by secret scanner on a historical commit; resolution requires Marcelo's manual unblock (or a follow-up card). Does not affect any live service.

BossMan can now route unambiguously to any of the 20 BIGDAWG35 repos by name + role + owner.

