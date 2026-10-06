# Perplexity Skills — Hermes Enablement Guide

> Short, practical guide for Marcelo. The full audit is at `~/.hermes/knowledge/LEARNED_PERPLEXITY_SKILLS_CAPABILITY_MAP.md`. This guide is the "what to click" version.

## What is this

You have a Perplexity Pro account with access to the Perplexity Computer Skills marketplace. The marketplace lists dozens of Skills (research, evidence synthesis, finance, sales, legal, Ramp, Carbon Arc, etc.). Not all of them fit how you actually work with Hermes. The audit identified which Skills are worth enabling, which to keep on by default, and which to leave alone.

## Hard rule: V3 / Project docs override Skill output

If a Skill (e.g. Evidence synthesis) produces a finding that conflicts with a V3 canon doc (`LEARNED_V3_TOKEN_ECONOMICS.md`, `LEARNED_7_RULE_CONTRACT.md`, etc.) or with a Project's instructions, the canon / Project docs win. Always. Log the disagreement on the kanban card and route through BossMan.

## Hard rule: Approval is per-action, not per-Skill

Even a "KEEP ENABLED" Skill can produce an output that requires your approval. Outreach to a real contact, a vendor edit, a contract redline, a public post, a payment — all Tier B. The Skill running is not the approval. The action is.

---

## Enable now (3 Skills)

### 1. Evidence synthesis
- **What it does:** builds an evidence matrix across a body of research. Perfect for "what does the research say about X" and "where do studies disagree".
- **Which Project:** Knowledge & Learning, Business ideas, Content/Revenue research, Trading Ops (research before a decision).
- **Example prompt:** `Build an evidence matrix for whether Solana ETFs are likely to be approved by end of 2026. List studies/filings, sample/methodology, consensus rating, and source links. Flag where sources disagree.`
- **Where it routes:** produces a structured table → standard handoff contract → BossMan reads the contract and decides whether to open a card.

### 2. research (already on by default)
- **What it does:** multi-round web-grounded research with citations. This is the heart of the perplexity-intake flow that already runs daily.
- **Which Project:** All projects.
- **Example prompt:** `Research the current state of AI agent orchestration frameworks in Q4 2026. Cite primary sources (vendor docs, GitHub stars, recent blog posts). Output a 1-page brief.`

### 3. finance (already on by default)
- **What it does:** financial data, modeling, and analysis. Used by Trading Ops and Money Pipeline.
- **Which Project:** Trading Ops, Finance & Money Ops, Business ideas.
- **Example prompt:** `Compare Q3 2026 ROAS and gross margin across our top 5 Meta ads accounts. Use only the CSV I'll attach.`

---

## Evaluate later (not enabled today, but useful when a Project opens)

| Skill | When to revisit |
|---|---|
| Dataset profiling | When you have a CSV you need to clean before analysis (System Health, Money Pipeline). |
| Company initiation report | When you start serious BizDev outreach and need a vendor/competitor diligence deck. |
| Company comps | When Trading Ops needs peer multiples beyond what yfinance gives you. |
| Alt data aggregator | If CSDAWG 2.0's intelligence layer has a known gap that web signals can fill. |
| Carbon Arc: Earnings preview | If you decide to pay for the Carbon Arc data connector. |
| sales-account-research | When you start doing outbound BizDev calls and need pre-call intel. |
| Meeting briefing (legal) | When you have a vendor / partnership call and want a pre-meeting brief. |

---

## Do not enable (for now)

- **All Ramp:* skills** (8) — B2B spend connector, Tier B. None are on the critical path.
- **Carbon Arc: Consumer health / Consumer pulse** — paid alt-data connector, no current use case.
- **All other legal skills** (Contract review, NDA triage, Compliance monitor, Risk assessment, Canned responses) — Tier B; not on the roadmap.
- **Offer negotiation prep, Billable hours** — wrong fit (freelancer / professional services).

---

## Connections required (none enabled)

If you later approve a Skill that needs a third-party connection (Ramp, Carbon Arc, etc.), the connection will be its own Tier B approval. BossMan will name the connector, the data scope, and the spend limit before any connection is created.

---

## Custom Skills (gaps a catalog Skill cannot fill)

- **V3 canon-audit** — audits `LEARNED_*.md` for stale references and change control. High value for the weekly governance pass.
- **kanban-blocker detection** — surfaces stalled cards on the bossman board. Pairs with weekly executive reporting.
- **local-skill handoff contract** — wraps the standard contract and posts to `~/.hermes/perplexity-intake/`. Trivial to build on top of the existing intake flow.

If you want any of these, open a card and BossMan will design + ship.

---

## Approval

Reply to BossMan with one of:
- **Approve** — enable Evidence synthesis, keep research + finance on. No new connections.
- **Change** — name the Skills to swap, drop, or add.
- **Do not enable** — close the card; nothing changes.
