# LEARNED — V3 Paid-Model Routing (permanent, 2026-09-30)

Owner: BossMan. Approved by Marcelo, 2026-09-30 19:27 (Perplexity chat): "use them only when we need to build and not to use them for nonsense ... MiniMax M3 and Ollama are pretty much free ... make sure we properly use DeepSeek, OpenAI and Claude."
Companion to LEARNED_V3_MODEL_STACK.md, which still defines the MiniMax lanes. This file governs PAID models and wins on conflict.

## Why this exists (evidence: every profile's state.db, all time, source=cron)
- Claude, about $181, ALL from crons, mostly the `PM2 Health Monitor`:
  - default: $36.18 in July, then $58.75 on Aug 25-27;
  - ops: $85.51, last run 2026-08-24;
  - bossman: $0.91.
- DeepSeek, about $13.6 from crons on deepseek-v4-flash (bossman, builder, content and ops clones), last run 2026-09-30 00:04, before today's fixes.
- OpenAI Codex (gpt-5.5) was used by crons up to 09-23. That exhausted the Codex plan quota: `usage_limit_reached` until about 2026-10-16.
- Since the 2026-09-30 fixes (cron.model M3, clones paused, no paid fallback): 0 paid cron sessions. The first paid kanban sessions are the stack-005 routing proofs: builder Claude $0.14, and qa-verification DeepSeek $0.05.
- Each profile has its OWN state.db, so the spend guard must scan all of them (paid-model-guard.py does).
- Kanban: 1 of 1,106 bossman cards had a model override. 207 cards in 30 days had 0. The old "BossMan writes a model_plan" rule had no enforcement, so every build and troubleshoot ran on M3.
- DeepSeek spend comes from the binance-bot app (direct API), not from Hermes. Claude is also called directly by the ticketflow and money-making-dashboard apps.

## The rule
1. Free tier (MiniMax M3, MiniMax M2.7 content/QA, Ollama qwen3.5:35b-a3b-nvfp4 local-fallback) handles all routine work: chat, orchestration, triage, crons, PM2, watchdogs, summaries, bulk text and first-pass troubleshooting. The default is M3; M2.7 is content/QA (not default); qwen3.5:35b-a3b-nvfp4 is the local-fallback after M3. qwen2.5:7b/3b are reserved for explicit light-app jobs.
2. Paid models are used only through a kanban card that carries `--model` and `--provider` (kanban_db model_override/provider_override). Never through a cron, a fallback chain, or a scheduled PM2 call. That makes every paid call traceable to a card.
3. BossMan sets the override when creating the card, using the table below. A build, QA or architecture card with no override is a routing defect.

## Routing table
| Work | Use | Escalate to | Notes |
|---|---|---|---|
| Crons, PM2, heartbeats, monitors, digests | MiniMax-M3 / Ollama qwen3.5:35b-a3b-nvfp4 | never paid | hard rule; qwen2.5:7b/3b pinned only for explicit light-app jobs |
| Orchestration, planning, triage, status | MiniMax-M3 | — | BossMan default |
| Content, marketing, docs that are not canon | MiniMax-M2.7 | — | content + qa lanes (M2.7 is content/QA, NOT default) |
| Bulk extraction, classification, dedupe | Ollama qwen3.5:35b-a3b-nvfp4 (deep) / qwen2.5:7b (light), then M3 | — | local-first |
| Research-public: public web summaries, news/YouTube transcripts, long public docs, public image read | Gemini Flash-Lite (gemini-3.1-flash-lite-preview) free tier | M3 | route-card.sh task_type=`research-public`; body-pattern guard; 400 req/day budget cap; 0 USD |
| Troubleshooting, attempts 1-2 | MiniMax-M3 | DeepSeek v4-pro after 2 failed attempts or 30 min | |
| Troubleshooting with production down or a money path | DeepSeek v4-pro | Claude sonnet after DeepSeek fails | log on card |
| BUILD: implementation (code, features, refactors, tests) | OpenAI Codex (openai-codex OAuth, flat-rate plan) | Claude sonnet after 2 failed Codex passes | uses OpenAI instead of leaving it idle |
| BUILD: architecture, security, money paths (SquarePayouts, trading logic), canon docs | Claude sonnet (claude-sonnet-4-6) | Claude top tier only when Marcelo tags the card `deep` | |
| QA / code review of a build | DeepSeek v4-pro, which must be a different vendor from the builder | Claude for money paths | independent second opinion |
| Final Step-5 verifier | qa-verification lane (M2.7) plus live evidence | DeepSeek for code diffs | |

## Budgets and guard
- Claude: $5/day, $60/month. DeepSeek: $1/day. OpenAI API key (pay-per-token): $1/day. Codex OAuth runs on the flat plan, so it has no per-call cost.
- Above budget: paid cards stay `blocked` with a `NEED-MARCELO-YES: budget` line.
- The guard script `paid-model-guard.py` (a no-LLM cron, daily) reads state.db and the kanban DBs and posts one Telegram line with paid spend by provider. It ALERTS on:
  - any paid session whose source is cron;
  - any paid session not linked to a card;
  - any build or QA card created without an override;
  - any budget being exceeded.
- PM2 apps that call paid APIs on a schedule move to M3. User-triggered product features, such as the ticketflow brief generator, may keep a paid model but are counted in the report.

> **2026-10-02 update:** the local Ollama fallback is now `qwen3.5:35b-a3b-nvfp4` (128K context, ~113 tok/s). It replaced `qwen3.8:27b`, which was removed from disk. `qwen2.5:7b` / `qwen2.5:3b` stay for light pinned jobs only. Canon: ~/.hermes/knowledge/LEARNED_V3_MODEL_STACK.md (2026-10-02 section).
