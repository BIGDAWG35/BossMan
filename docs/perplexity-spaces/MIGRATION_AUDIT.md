# Perplexity Spaces Migration Audit — OpenClaw → Hermes
**Date:** 2026-05-07
**Status:** PARTIALLY MIGRATED

---

## SECTION 1: FILE INVENTORY

### OpenClaw Perplexity Spaces (Source) — 49 files across 10 spaces

| Space | Files |
|-------|-------|
| agent-os | SETUP.md, architect_01-claude-usage-policy.md, bot-roles.md, routing-rules.md, workspace-map.md |
| business-ideas | SETUP.md, architect_01-claude-usage-policy.md, business-opportunities-overview.md, business-rules.md, money-pipeline-deep-dive.md, passive-income-research.md, real-estate-targets.md, revenue-pipeline-status.md, youtube-content-strategy.md |
| content-youtube | SETUP.md, architect_01-claude-usage-policy.md, content-strategy.md, thumbnail-workflow.md, video-pipeline.md |
| crypto-trading | SETUP.md, architect_01-claude-usage-policy.md, portfolio-management.md, strategy-framework.md |
| real-estate | SETUP.md, architect_01-claude-usage-policy.md, deal-evaluation.md, property-manager-guide.md |
| team-management | SETUP.md, architect_01-claude-usage-policy.md, employee-profiles.md, review-workflow.md |
| trading-ops | SETUP.md, architect_01-claude-usage-policy.md, binance-bot-status.md, trading-overview.md |
| toolchain-dev | SETUP.md, architect_01-claude-usage-policy.md, debugging-stack.md, local-dev-tools.md |
| travel-lifestyle | SETUP.md, architect_01-claude-usage-policy.md, content-experiences.md, destination-guide.md |
| vp-it-operations | SETUP.md, architect_01-claude-usage-policy.md, decision-framework.md, processes-infrastructure.md |
| QUICK-REFERENCE.md | (root) — When-to-use-each-space decision tree |

### Hermes Perplexity Spaces (Created) — 13 files across 4 spaces

| Space | Files |
|-------|-------|
| Agent OS | SETUP.md, bot-roles.md, routing-rules.md, workspace-map.md |
| Business Ideas | SETUP.md, business-opportunities-overview.md, passive-income-research.md |
| Trading Ops | SETUP.md, trading-rules.md |
| Toolchain Dev | SETUP.md, dev-environment.md, hermes-config.md |

**Missing from Hermes:** architect_01-claude-usage-policy.md (claude-usage policy), QUICK-REFERENCE.md (decision tree), 6 entire spaces (Content & YouTube, Crypto & Trading, Real Estate, Team Management, Travel & Lifestyle, VP of IT Operations)

---

## SECTION 2: MIGRATION MATRIX

### ✅ Successfully Migrated

| OpenClaw Concept | Hermes Port | Status | Notes |
|-----------------|-------------|--------|-------|
| Agent OS space structure | Agent OS | ✅ | 4/5 files created — missing architect_01-claude-usage-policy.md |
| Bot roles → Profile roles | Profile lanes (bossman/builder/ops/trading/content) | ✅ | Translated correctly, not copied |
| Routing rules | routing-rules.md | ✅ | Hermes-specific routing table built from ~/.hermes/PROFILES.md |
| Services map (Hub routes → service map) | Services in SETUP.md | ✅ | Real Hermes ports used (3001, 9119, 3100, 8090, etc.) |
| Business Opportunities Overview | business-opportunities-overview.md | ✅ | Content adapted for Hermes context |
| Passive income research | passive-income-research.md | ✅ | Stub created — needs real data |
| LEARNED files | ~/.hermes/knowledge/LEARNED_*.md | ✅ | 24 LEARNED files exist in Hermes — exact copies of OpenClaw LEARNED files (intentional) |
| OpenClaw workspace → Hermes ~/.hermes/ | Workspace structure | ✅ | Correctly mapped from OpenClaw docs to Hermes config |

### 🔴 Not Migrated (Missing)

| OpenClaw Space/File | Hermes Equivalent | Action Needed |
|---------------------|-------------------|---------------|
| QUICK-REFERENCE.md | — | **CREATE** — decision tree for which Space to use |
| architect_01-claude-usage-policy.md | — | **CREATE** — Perplexity AI usage policy for Hermes |
| Content & YouTube space | — | **SKIP or CREATE** — Marcelo does YouTube; does Hermes own this? |
| Crypto & Trading space | Trading Ops | **MERGE** — OpenClaw had separate crypto-trading (strategy) + trading-ops (health); Hermes merged into Trading Ops but with no strategy content |
| Real Estate space | — | **SKIP** — likely not Hermes's domain |
| Team Management space | — | **SKIP** — likely not Hermes's domain |
| Travel & Lifestyle space | — | **SKIP** — likely not Hermes's domain |
| VP of IT Operations space | — | **SKIP** — Marcelo's role, not Hermes's domain |
| money-pipeline-deep-dive.md | — | **CREATE** — detailed Money Pipeline breakdown |
| real-estate-targets.md | — | **SKIP** |
| revenue-pipeline-status.md | — | **CREATE** — current revenue streams |
| youtube-content-strategy.md | — | **SKIP or MERGE** |
| business-rules.md | — | **CREATE** — decision framework for business |
| binance-bot-status.md | — | **CREATE** — current bot config/balance |
| portfolio-management.md | — | **CREATE** — holdings tracking |
| strategy-framework.md | trading-rules.md | **MERGE NEEDED** — OpenClaw had separate strategy doc; Hermes trading-rules.md is a stub |
| deal-evaluation.md | — | **SKIP** |
| property-manager-guide.md | — | **SKIP** |
| employee-profiles.md | — | **SKIP** |
| review-workflow.md | — | **SKIP** |
| content-strategy.md | — | **SKIP** |
| thumbnail-workflow.md | — | **SKIP** |
| video-pipeline.md | — | **SKIP** |
| debugging-stack.md | dev-environment.md | **MERGE** — partial content exists in hermes-config.md and dev-environment.md |
| local-dev-tools.md | dev-environment.md | **MERGE** — partial content exists |
| decision-framework.md | — | **SKIP** |
| processes-infrastructure.md | — | **SKIP** |

### ⚠️ Rewritten — Verify Meaning Preserved

| OpenClaw Content | Hermes Version | Risk |
|------------------|----------------|------|
| OpenClaw agent bots (DWDAWGBOT, OPdawgbot, LBC35, CSdawgbot, etc.) | Hermes profiles (bossman, builder, ops, trading, content) | ✅ Translated — different naming and architecture, correct adaptation |
| OpenClaw Hub routes (localhost:8090 → various services) | Hermes service ports (3001 gateway, 9119 dashboard, etc.) | ✅ Real ports from SERVICES_MAP.md used |
| OpenClaw SOUL.md → Hermes SOUL.md | SOUL.md exists in ~/.hermes/ | ✅ Verified — identical copies (intentional, both need same persona) |
| OpenClaw learn.md | ~/.hermes/knowledge/ | ✅ Verified — 24 LEARNED_*.md files are identical copies (intentional shared knowledge) |

---

## SECTION 3: MISSING KNOWLEDGE LIST

### Critical Gaps ( Hermes cannot operate fully without these)

**1. QUICK-REFERENCE.md — When-to-Use Decision Tree**
- **What it does:** Maps "what am I working on?" to "which Space do I use?"
- **Why critical:** Without this, there's no way to know which Space is right for a given task
- **OpenClaw source:** `/perplexity-spaces/QUICK-REFERENCE.md` lines 4-89
- **Action:** CREATE — adapt for Hermes's 4 spaces

**2. architect_01-claude-usage-policy.md — AI Usage Policy (per space)**
- **What it does:** Defines when/how Perplexity AI is used within each Space
- **Why critical:** Perplexity Spaces have custom AI instructions per space
- **OpenClaw pattern:** Every space has this file
- **Action:** CREATE one per Hermes Space

**3. Trading Ops — Strategy Content (CRITICAL)**
- **OpenClaw had:** `crypto-trading/strategy-framework.md` + `crypto-trading/portfolio-management.md` + `trading-ops/binance-bot-status.md`
- **Hermes has:** `trading-rules.md` (stub — pair universe blank, HBAR lock blank, no actual bot config)
- **Why critical:** The actual trading strategy, pair universe, and portfolio data are missing
- **Action:** FILL IN trading-rules.md from OpenClaw's `trading-overview.md` and `binance-bot-status.md`

**4. Hermes Perplexity Spaces — Missing Custom Instructions**
- **What it does:** Each Perplexity Space has custom AI behavior instructions
- **OpenClaw pattern:** architect_01-claude-usage-policy.md in each space
- **Hermes status:** None created — Perplexity will use default AI behavior
- **Action:** CREATE per Space

### Knowledge That Was Copied but Should Be Noted

**LEARNED files in `~/.hermes/knowledge/` — 24 files are IDENTICAL copies of OpenClaw's**
- These are Marcelo's accumulated domain knowledge (PowerShell, AWS, dashboards, PM tools, etc.)
- Copying is **intentional** — both agents should share the same knowledge base
- **However:** The Hermes Perplexity Space docs don't reference or link to these LEARNED files
- **Action:** The Space docs should include a note: "For domain knowledge (PowerShell, AWS, etc.), see ~/.hermes/knowledge/LEARNED_*.md"

---

## SECTION 4: RECOMMENDED FIXES

### Must Fix (Blockers for Hermes Perplexity Spaces to function)

| # | File to Create/Fix | Source | Action | Priority |
|---|-------------------|--------|--------|----------|
| 1 | `QUICK-REFERENCE.md` | OpenClaw `QUICK-REFERENCE.md` | ADAPT for 4 Hermes spaces | 🔴 HIGH |
| 2 | `architect_01-claude-usage-policy.md` (per Space) | OpenClaw pattern | CREATE per Space | 🔴 HIGH |
| 3 | `Agent OS/architect_01-claude-usage-policy.md` | OpenClaw `agent-os/architect...` | CREATE | 🔴 HIGH |
| 4 | `Trading Ops/trading-overview.md` | OpenClaw `trading-ops/trading-overview.md` | CREATE — fill in real bot data | 🔴 HIGH |
| 5 | `Trading Ops/binance-bot-status.md` | OpenClaw `trading-ops/binance-bot-status.md` | CREATE — actual bot config | 🔴 HIGH |
| 6 | `Trading Ops/strategy-framework.md` | OpenClaw `crypto-trading/strategy-framework.md` | MERGE into trading-rules.md | 🔴 HIGH |

### Should Fix (Incomplete but Functional)

| # | File to Create/Fix | Source | Action | Priority |
|---|-------------------|--------|--------|----------|
| 7 | `business-ideas/money-pipeline-deep-dive.md` | OpenClaw `business-ideas/money-pipeline-deep-dive.md` | CREATE | 🟡 MED |
| 8 | `business-ideas/revenue-pipeline-status.md` | OpenClaw `business-ideas/revenue-pipeline-status.md` | CREATE | 🟡 MED |
| 9 | `business-ideas/business-rules.md` | OpenClaw `business-ideas/business-rules.md` | CREATE | 🟡 MED |
| 10 | `Toolchain Dev/debugging-stack.md` | OpenClaw `toolchain-dev/debugging-stack.md` | MERGE into existing dev docs | 🟡 MED |
| 11 | `Toolchain Dev/local-dev-tools.md` | OpenClaw `toolchain-dev/local-dev-tools.md` | MERGE into existing dev docs | 🟡 MED |
| 12 | Link LEARNED files in Space docs | N/A | ADD note in SETUP.md files referencing ~/.hermes/knowledge/LEARNED_*.md | 🟡 MED |

### Optional (Nice to Have)

| # | File | Rationale | Priority |
|---|------|-----------|----------|
| 13 | `business-ideas/youtube-content-strategy.md` | If Hermes manages YouTube work | 🟢 LOW |
| 14 | `Content & YouTube` space | If Hermes handles content pipeline | 🟢 LOW |
| 15 | `Real Estate` space | If Marcelo wants Hermes to track this | 🟢 LOW |

---

## SECTION 5: WHAT ACTUALLY CAME FROM HERMES (vs. Copied from OpenClaw)

### Hermes-Native Content (Built from Real Config)

These were NOT copied from OpenClaw — they were reverse-engineered from actual Hermes config:

| File | Source | Evidence |
|------|--------|----------|
| Agent OS/SETUP.md | `~/.hermes/` + `~/.hermes/knowledge/SERVICES_MAP.md` | Real ports: 3001, 9119, 3100, 8090, 8100, 8102, 8104, 8110, 8130, 8140, 8020 |
| Agent OS/routing-rules.md | `~/.hermes/PROFILES.md` | Real profiles: bossman, builder, ops, trading, content |
| Agent OS/bot-roles.md | `~/.hermes/` + skill list | Real skills: apple, debug, github, ideas, kanban, mlops, etc. |
| Agent OS/workspace-map.md | `~/.hermes/` directory structure | Real paths: ~/.hermes/SOUL.md, PROFILES.md, knowledge/, skills/, etc. |
| Toolchain Dev/hermes-config.md | `~/.hermes/config.yaml` | Real Hermes config references |
| Toolchain Dev/dev-environment.md | `~/.hermes/` + system info | Real machine: Mac mini, Node v25.6.1, Hermes on port 3001 |

### Copied from OpenClaw (Appropriate — Same Knowledge Needed)

| Content | OpenClaw Source | Hermes Status | Appropriate? |
|---------|-----------------|--------------|-------------|
| LEARNED_*.md (24 files) | Identical copies | ✅ In ~/.hermes/knowledge/ | ✅ Yes — shared domain knowledge |
| SOUL.md | Identical copy | ✅ In ~/.hermes/SOUL.md | ✅ Yes — same persona |
| PROFILES.md | Adapted | ✅ In ~/.hermes/PROFILES.md | ✅ Yes — Hermes profiles are different but PROFILES.md concept copied |
| SERVICES_MAP.md | Adapted | ✅ In ~/.hermes/knowledge/SERVICES_MAP.md | ✅ Yes — Hermes services different but concept same |

---

## SECTION 6: VALIDATION — Is Hermes Truly Hermes and Not a Shallow Clone?

**Question: Are the Hermes Space docs tailored to Hermes and not just a shallow clone?**

### ✅ Yes — For the Agent OS Space

The Agent OS docs are genuinely Hermes-native:
- Uses real Hermes profile names (bossman, builder, ops, trading, content) — not OpenClaw bot names
- References actual Hermes ports (3001, 9119, 3100, etc.) — not OpenClaw's ports (18789, 8090, etc.)
- Lists real Hermes skills (apple, debug, github, mlops, etc.)
- Maps to actual Hermes workspace structure (`~/.hermes/`)
- LEARNED-first rule is Hermes-specific (uses `~/.hermes/knowledge/LEARNED_*.md`)

### ⚠️ Partial — For Business Ideas and Trading Ops

**Business Ideas:** Content was adapted but much is placeholder/stub:
- business-opportunities-overview.md has real Money Pipeline context (170+ opportunities, categories, top 5)
- BUT passive-income-research.md is a thin stub
- Missing: money-pipeline-deep-dive.md, revenue-pipeline-status.md, business-rules.md

**Trading Ops:** Most at risk of being a shallow clone:
- trading-rules.md references actual trading parameters (3% risk, 6% daily loss, MIN_RR 2:1, trailing stops)
- BUT pair universe is blank: "[TO BE FILLED]"
- HBAR lock is blank: "[Note reason if HBAR is locked]"
- Missing: trading-overview.md, binance-bot-status.md, strategy-framework.md
- **This is the most incomplete Space — it has the架子 (frame) but empty inside**

### ✅ Yes — For Toolchain Dev

- dev-environment.md and hermes-config.md are built from actual Hermes config
- References real Hermes commands (`hermes config set`, `hermes skills`, etc.)
- Not a copy of OpenClaw's toolchain-dev

---

## FINAL VERDICT

### 🟡 **PARTIALLY MIGRATED**

**Confidence Level:** 40% — Hermes has the frame and some real content, but critical knowledge is missing.

### Why Not READY:
1. **QUICK-REFERENCE.md missing** — Without the decision tree, there's no way to know which Space to use
2. **architect_01-claude-usage-policy.md missing from ALL 4 Spaces** — Perplexity will use default AI behavior, not Hermes-specific instructions
3. **Trading Ops is nearly empty** — The most important operational Space (for Marcelo) has stub content with blank pair universe, no bot status, no strategy
4. **6 of 10 OpenClaw Spaces not created** — Content & YouTube, Crypto & Trading, Real Estate, Team Management, Travel & Lifestyle, VP of IT Operations

### What Works:
- ✅ Agent OS is genuinely Hermes-native and well-built
- ✅ LEARNED files properly copied (intentional shared knowledge)
- ✅ Hermes config correctly reverse-engineered and used
- ✅ Toolchain Dev has real content

### Immediate Actions Required:
1. CREATE `QUICK-REFERENCE.md` (5 min)
2. CREATE `architect_01-claude-usage-policy.md` for all 4 Spaces (15 min)
3. FILL IN `Trading Ops/trading-rules.md` with real pair universe and HBAR lock status (5 min)
4. CREATE `Trading Ops/trading-overview.md` from OpenClaw's `trading-ops/trading-overview.md` (10 min)
5. CREATE `Trading Ops/binance-bot-status.md` (10 min)

**Estimated time to reach READY:** ~45 minutes of work, mostly copy-adapt from OpenClaw docs.
