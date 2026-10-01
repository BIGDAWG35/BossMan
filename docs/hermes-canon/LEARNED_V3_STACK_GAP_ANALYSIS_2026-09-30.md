# LEARNED: V3 AI Stack Gap Analysis (2026-09-30)

Author: Perplexity Computer, with BossMan. Requested by Marcelo, 22:03: "do we need to add any other modules like Gemini, Grok, or any other AI tools ... to make our stack stronger."
Goal: keep pushing work toward free (local plus MiniMax), and use paid models only for builds.

## Current stack (verified 2026-09-30)
- Host: Mac Studio M4 Max, 64 GB RAM.
- Ollama has only qwen2.5:7b (about 6 GB of models). That one small model is the whole "free local" tier.
- Hermes v0.21.5. MiniMax M3 is the default and M2.7 handles content/QA.
- Paid models: OpenAI gpt-5.5 (builds), Claude Sonnet 4.6 (architecture and money paths), DeepSeek v4-pro (QA and escalation).
- No Gemini, xAI, OpenRouter, Groq, Mistral or Together keys are configured.

## Recommendations, ranked by money saved

| # | Add | Why | Cost | Verdict |
|---|---|---|---|---|
| 1 | A strong local coding model: Qwen3.8-27B (`qwen3.8`, 18 GB at 4-bit, 256K context). Optional speed pick: Qwen3-Coder-30B-A3B (`qwen3-coder`, 19 GB). | qwen2.5:7b is too weak to absorb real build, QA or fallback work. A 27B model that fits comfortably in 64 GB makes "downgrade, never stop" produce usable output, and it can take first-pass builds and reviews for free. Source: https://zachrattner.com/projects/ai-mac-cluster/coding-models | Free. Needs about 20 GB of disk. | APPROVED 2026-09-30 23:50. Pull in flight (`proc_2ae12d037f8f`). PENDING benchmark PASS to swap profile fallbacks. Config.yaml fallback already `qwen3.8:27b`. qwen2.5:7b + qwen2.5:3b PRESERVED for binance-bot daily_memo.js, altus-forensic, crons. |
| 2 | A local embedding model (e.g. nomic-embed-text or qwen3-embedding via Ollama). | Lets the reuse pre-flight match on meaning, not only keywords, across LEARNED_*, BUILD_LIBRARY and past cards. More reuse means fewer paid calls. | Free. Under 1 GB. | YES, after #1. Not started. |
| 3 | Google Gemini (native Hermes `gemini` provider, GEMINI_API_KEY). | The free tier covers the Flash models. On the free tier Google may use your data to improve its products, so it suits public, non-sensitive bulk work only, such as long-document summaries or web content. Paid Gemini 3.8 Flash is $0.75 in / $3.75 out per 1M tokens through 2026-12-31. Source: https://ai.google.dev/gemini-api/docs/pricing | Free tier, or cheap paid. | APPROVED 2026-09-30 23:50. PREP DONE: provider entry appended to `~/.hermes/config.yaml` fallback_providers (model `gemini-3.1-flash-lite-preview`, base_url `https://generativelanguage.googleapis.com/v1beta`). route-card.sh `research-public` task_type wired (provider `gemini`, fallback M3, body-pattern guard). budget-gate.py extended with 400 req/day cap on `gemini`. `~/.hermes/.env` stub `# GEMINI_API_KEY=` added. KEY CREATION PENDING on Marcelo (no-billing Google AI Studio project). Free tier caps: Flash ~20 RPD, Flash-Lite ~500 RPD; 400 RPD enforced. |
| 4 | xAI Grok 4.7. | $2 in / $6 out per 1M tokens, 500K context. It has no job in this stack that Claude, DeepSeek, gpt-5.5 or M3 doesn't already cover. Source: https://docs.x.ai/developers/models | Paid. | REJECTED 2026-09-30 23:50 by Marcelo: "let's go ahead and skip grok". Not pursued. |
| 5 | OpenRouter. | One key for many models, plus free endpoints. Only useful as a backup gateway if a primary provider is down. | Paid per call. | NOT NOW. |

## Non-model gaps (tools and ops)
- An upgrade runbook is still missing. The v0.21.5 venv crash happened because `pip install -e .` was not run after the upgrade. Add a post-upgrade check: venv import test plus `hermes gateway status`.
- Disk is at 93%. Time Machine local snapshots keep deleted files until they expire. Watch free space and alert below 25 GB.
- Direct app API spend (ticketflow, money-making-dashboard, binance-bot) is outside Hermes. paid-model-guard counts what it can from app logs. Check the provider dashboards monthly.
- Still open from earlier work: Discord transport acceptance, sustained Telegram mobile verification, and the Binance bot (last on the list).

## Decision needed from Marcelo
- Approve #1 (download about 18-20 GB) and #2, and choose whether to add #3.
