# Hermes Spaces — Master Configuration
**Last updated: 2026-05-07**

---

## ⚠️ DO NOT CONFUSE WITH OPENCLAW

| | Hermes | OpenClaw |
|--|-------|---------|
| Primary brain | **MiniMax 2.7** | Claude / OpenAI |
| Local docs | `/Users/bigdawg/Desktop/perplexity-spaces Hermes/` | `/Users/bigdawg/Desktop/Openclaw Brain/` |
| Perplexity Spaces | Hermes-branded | OpenClaw-branded |
| Model policy | `HERMES_MODEL_POLICY.md` | OpenClaw's own policy |

**When Marcelo says "Hermes Space" or "Hermes docs":** Only use the Hermes folder structure
and Hermes files. Never route to or reference OpenClaw structures.

**When Marcelo says "OpenClaw Space" or "OpenClaw docs":** Only use the OpenClaw layout.

**Never mix or merge them** unless Marcelo explicitly says "migrate this from OpenClaw to Hermes."

---

## Spaces Overview

| Space | Sub-Agent | Primary Decisions |
|-------|-----------|------------------|
| Agent OS | BossMan | Routing, system services, profile management |
| Trading Ops | Trading | Binance bot management, signals, risk rules |
| Trading Strategy & Portfolio | Trading | Portfolio construction, strategy framework |
| Toolchain & Dev | Builder | Dev environment, coding tools, automation |
| Business & Ideas | BossMan | Opportunities, revenue, business decisions |
| Content & YouTube | Content | YouTube content, scripts, SEO, thumbnails |
| Real Estate | BossMan | Property targets, rentals, Airbnb strategy |
| Ops Processes | Ops | Service health, PM2, daily runbooks |

---

## Space Details

### Agent OS
- **Path:** `Agent OS/SETUP.md`
- **Perplexity Space:** Hermes OS / Agent OS
- **Questions belong here:** How do I route this task? What does Hermes know about X?
  What's the system architecture? What are the profile rules?
- **Key docs:** Routing table, workspace layout, services map

### Trading Ops
- **Path:** `Trading Ops/SETUP.md`
- **Perplexity Space:** Hermes Trading Ops
- **Questions belong here:** Bot status? Trade signals? Risk limits? Daily P&L?
- **Key docs:** Bot status, risk rules, service ports

### Trading Strategy & Portfolio
- **Path:** `Trading Strategy & Portfolio/SETUP.md`
- **Perplexity Space:** Hermes Trading Strategy
- **Questions belong here:** Portfolio construction? Strategy framework?
  Position sizing? Pair universe?
- **Key docs:** Strategy framework, portfolio rules

### Toolchain & Dev
- **Path:** `Toolchain & Dev/SETUP.md`
- **Perplexity Space:** Hermes Toolchain
- **Questions belong here:** Dev environment? Hermes config? Skills? Scripts?
  Automation?
- **Key docs:** Dev environment, Hermes config reference, skills list

### Business & Ideas
- **Path:** `Business & Ideas/SETUP.md`
- **Perplexity Space:** Hermes Business & Ideas
- **Questions belong here:** New opportunity? Revenue status? Business rules?
  Money pipeline?
- **Key docs:** Business rules, revenue pipeline, opportunity research

### Content & YouTube
- **Path:** `Content & YouTube/SETUP.md`
- **Perplexity Space:** Hermes Content
- **Questions belong here:** Video ideas? Script structure? SEO strategy?
  Thumbnail approach?
- **Key docs:** Content strategy, YouTube research

### Real Estate
- **Path:** `Real Estate/SETUP.md`
- **Perplexity Space:** Hermes Real Estate
- **Questions belong here:** Property targets? Market analysis? Rental strategy?
  Location shortlist?
- **Key docs:** Property targets, market research, rental rules

### Ops Processes
- **Path:** `Ops Processes/SETUP.md`
- **Perplexity Space:** Hermes Ops
- **Questions belong here:** Service health? PM2 status? Daily checklist?
  Runbook for X?
- **Key docs:** Service map, health checks, runbooks

---

## Sub-Agent → Space Mapping

| Sub-Agent | Primary Space(s) |
|-----------|-----------------|
| BossMan | Agent OS, Business & Ideas, Real Estate |
| Builder | Toolchain & Dev |
| Ops | Ops Processes |
| Trading | Trading Ops, Trading Strategy & Portfolio |
| Content | Content & YouTube |

---

## Model Policy Reference

All Spaces reference `HERMES_MODEL_POLICY.md` for model escalation rules.
Default: MiniMax 2.7. Escalate only when MiniMax hits a limitation.
