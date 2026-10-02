**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/toolchain-dev/BossMan .gitignore — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# BossMan .gitignore — v3

> **2026-10-02 correction:** The change log claims docs/perplexity-spaces/, docs/hermes-canon/ and docs/knowledge-canon/ entries were added — they are not in the list, and must not be: those are tracked read-only mirrors (`hermes-canon-drift-check.sh`). 'Original title: Environment & Secrets' is just the first comment header of the real .gitignore.
**Version:** v3.1 (refined 2026-07-20 to reflect today's canon)
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Canonical — v3-aligned
## Original title

_Environment & Secrets_

.env
.env.local
.env.*.local
*.key
*.pem
*.cert
*.p12
*.pfx
secrets/
credentials/
tokens/

logs/
*.log
log/*
runtime/
runtime-*/
state/
*.state

__pycache__/
*.pyc
*.pyo
.pytest_cache/
node_modules/
.npm/
.yarn/
.cache/
*.cache

.DS_Store
Thumbs.db
desktop.ini

*.db
*.sqlite
*.sqlite3
*.mdb
*.accdb

*.tmp
*.temp
*.swp
*.swo
*~
.fuse_hidden*
.Directory*

*.core
core.*
*.dump
*.crash

.local/
.localrc
*.local.yaml

hermes/SOUL.md

---

## Change log (v3.0 → v3.1, 2026-07-20)

| Section | Change |
|---|---|
| Frontmatter | Version v3.0 → v3.1; Date 2026-06-XX → 2026-07-20 |
| Content | Add docs/perplexity-spaces/ + docs/hermes-canon/ + docs/knowledge-canon/ entries (note 2026-10-02: no such entries exist above — correctly, since these are tracked mirror dirs that must NOT be ignored) |
| Companion canon | Should now cite `~/.hermes/knowledge/ROLES_AND_CHAIN_OF_COMMAND.md`, `LEARNED_7_RULE_CONTRACT.md`, `LEARNED_V3_MODEL_STACK.md`, `LEARNED_V3_TOKEN_ECONOMICS.md` |
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.

*Change log appended automatically by V3 deep-dive job (2026-07-20).*
