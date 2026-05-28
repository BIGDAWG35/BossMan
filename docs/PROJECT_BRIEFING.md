# Altus Forensic — Project Briefing
**Created:** 2026-05-22
**Blueprint:** v2
**Status:** Pre-kickoff — waiting on Allen's sample files

## Project Overview
Forensic document pipeline for Altus Forensic (law firm). Processes closed-case files from OwnCloud, runs local Ollama LLM inference, outputs extraction-only summaries to `/altus_output/`.

**Hard rules:**
- All LLM inference runs LOCAL via Ollama (Qwen2.5:14B) — no cloud API calls with file content
- No raw file content ever leaves the Mac Studio or goes through Telegram
- AI output lives in `/altus_output/` — NEVER inside OwnCloud case file tree
- Prompts = extraction and summary only — zero conclusions, zero inferences
- OCR runs before any LLM step — most files are scanned PDFs
- Source files are never deleted — classifier marks, never removes
- Telegram bot is whitelist-only (Allen, Claire, Jessica by user ID)
- Build on Mac Studio M4 Max first — validate with Allen's sample files — then package for transfer to Altus machine

## Brain Assignments

| Component | Brain | Reasoning |
|---|---|---|
| Document Classifier (altus-classifier) | DeepSeek | Extraction-only, strict rules, precise type detection |
| Stage 1 Triage Generator (altus-triage) | MiniMax 2.7 | Batch processing, structured Materials List output |
| Stage 2 Summarizer (altus-summarizer) | DeepSeek | Deep document analysis, page citations |
| Builder Sub-agent (code generation) | Claude | Code architecture, Python/Node pipeline, strict output |
| Research + Architecture | Perplexity Computer | All non-trivial decisions — no guessing |
| Quick Lookups | Perplexity Search | Fast answers without full session |

## Output Structure
```
/altus_output/
  └── [CASE_NAME]/
      ├── materials_list.json      (Stage 1 — full document inventory)
      ├── duplicates.json           (hash-comparison dupes)
      ├── stage1_output/           (per-document classification + triage)
      └── stage2_output/           (summaries + key-point extraction)
```

## Waiting On
- Allen Bourgeois — OwnCloud closed-case sample file link
  → When received: route to Perplexity Computer for folder structure analysis before Builder starts

## Kanban Cards
14 cards created in `~/.hermes/kanban/altus-forensic/`
- 7 HIGH (card 01 completed, cards 02-07 blocked on sample files)
- 5 MEDIUM
- 2 LOW (Phase 2)

## Perplexity Computer Protocol
When you hit an architecture question, use this format:

```
PERPLEXITY COMPUTER — ALTUS FORENSIC QUERY:
[Your question]
Context: [1-2 sentences of what you're building and why]
```

Perplexity Computer responds → you continue execution. Marcus stays out of loop unless approval needed.
